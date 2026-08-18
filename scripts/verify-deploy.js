#!/usr/bin/env node
/**
 * Run the mechanical half of DEPLOY.md's post-deploy routine against the live site.
 *
 * This does NOT replace that routine. It executes the checks that are purely
 * mechanical and leaves every judgement-bearing step to the person deploying:
 * confirming which commit was meant to ship, the wizard/reload/IndexedDB journey,
 * the privacy re-read, the keyboard/theme/print/mobile pass, and above all the
 * reading rule — a disagreement between checks MAY be propagation, so a failure
 * here is a prompt to re-run and think, not a verdict.
 *
 * Usage:
 *   node scripts/verify-deploy.js
 *   node scripts/verify-deploy.js --present "at least 2 times per week" --asset data.js
 *   node scripts/verify-deploy.js --absent "3 times per week" --asset data.js
 *   node scripts/verify-deploy.js --origin https://abilityfinder.ca --guide dtc
 *
 * Exit codes: 0 = every check passed. 1 = a check failed. 2 = nothing failed, but at least
 * one check could not be evaluated (see INCONCLUSIVE below) — the catalogue was NOT
 * verified, and a human has to close it. 2 exists because exit 0 told release tooling that
 * an unverified catalogue was a success.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEFAULT_ORIGIN = "https://abilityfinder.ca";
const DEFAULT_GUIDE = "dtc";
const REQUEST_TIMEOUT_MS = 10_000;

// WHY these five: /api/* returns 404 text/html to a top-level navigation and 200 JSON to
// a fetch, because Cloudflare's static-asset routing answers navigations before the Worker
// runs (REL-06, WON'T FIX on zero-spend grounds). Node's fetch sends no Sec-Fetch-Mode at
// all, which is the safe side of that behaviour — do not add one.
// Values, not just names. DEPLOY.md's step 6 names the exact policy for two of these,
// and a header present with a weakened value (x-frame-options: SAMEORIGIN) is the failure
// worth catching — checking only for presence would call that a pass.
const EXPECTED_HEADER_VALUES = {
  "x-frame-options": "deny",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "geolocation=(self), camera=(), microphone=()",
};

// Substrings that must appear in the live CSP. Not whole-string equality: the header is
// long and its directive order is not contractual, but these five carry the guarantees —
// scripts and connections confined to our own origin, no framing, no base-tag injection.
const REQUIRED_CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
];
// WHY these are asserted live rather than trusted to a test, corrected 2026-08-18: an
// earlier version of this comment said the directives were "already asserted by
// test/worker-transport.test.js". That was false — that file asserts HSTS, location and
// cache-control, and NO test in this repository asserts a CSP directive at all
// (`grep -rn "default-src" test/` returns nothing). So a live policy of
// `default-src *`, `Referrer-Policy: unsafe-url` or `Permissions-Policy: geolocation=*`
// would have passed every check we have. The values below come from public/_headers, and
// the CSP is spot-checked on the directives that carry the privacy and anti-injection
// guarantees rather than by whole-string equality, which would break on harmless reordering.
const REQUIRED_HEADERS = [
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
];

function parseArgs(argv) {
  const args = { origin: DEFAULT_ORIGIN, guide: DEFAULT_GUIDE, asset: null, present: [], absent: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    const needsValue = () => {
      if (value === undefined || value.startsWith("--")) {
        throw new Error(`${flag} needs a value`);
      }
      index += 1;
      return value;
    };
    if (flag === "--origin") args.origin = needsValue().replace(/\/+$/, "");
    else if (flag === "--guide") args.guide = needsValue();
    else if (flag === "--asset") args.asset = needsValue();
    else if (flag === "--present") args.present.push(needsValue());
    else if (flag === "--absent") args.absent.push(needsValue());
    else throw new Error(`unknown argument: ${flag}`);
  }
  if ((args.present.length || args.absent.length) && !args.asset) {
    throw new Error("--present/--absent need --asset to say which live asset to read");
  }
  return args;
}

const results = [];
let inconclusive = 0;
function record(ok, name, detail) {
  results.push({ ok, name, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}\n        ${detail}`);
}

/**
 * Every `?v=N` marker in a document, deduplicated. NOT just styles.css: index.html carries
 * 14 distinct versioned assets (app.js, data.js, i18n.js, the fonts, the icons, …) and each
 * is fetched independently by the browser. Checking one of them was a real hole — a deploy
 * that shipped styles.css?v=112 while app.js stayed at ?v=111 would have been reported
 * healthy, which is exactly the stale-asset release this check exists to catch.
 */
function versionMarkers(html) {
  const all = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  return { all, distinct: [...new Set(all)] };
}

/** The committed asset version. Everything live is compared against this, never guessed. */
function committedVersion() {
  const index = fs.readFileSync(path.join(ROOT, "public", "index.html"), "utf8");
  const { distinct } = versionMarkers(index);
  if (distinct.length === 0) throw new Error("could not read any ?v=N marker from public/index.html");
  if (distinct.length > 1) {
    throw new Error(
      `public/index.html is internally inconsistent: it carries ?v=${distinct.join(", ?v=")}. ` +
        "Bump every browser-loaded asset together."
    );
  }
  return distinct[0];
}

/**
 * LINKS.length, SKIPPED_DYNAMIC and the catalogue signature, read the same way
 * test/data-procedure.test.js and src/link-check.js read them. The signature is
 * `LINKS.map(l => l.url).join("\n")` — see catalogSignature() in src/link-check.js.
 */
function committedLinkCounts() {
  const source = fs.readFileSync(path.join(ROOT, "src", "links.js"), "utf8");
  const match = source.match(
    /export const LINKS = (\[[\s\S]*?\]);\s*\n\s*export const SKIPPED_DYNAMIC = (\d+);/
  );
  if (!match) throw new Error("could not read LINKS/SKIPPED_DYNAMIC from src/links.js");
  const links = JSON.parse(match[1]);
  return {
    total: links.length,
    skippedDynamic: Number(match[2]),
    signature: links.map((link) => link.url).join("\n"),
  };
}

// WHY redirect: "follow" is stated rather than left to the default: guide URLs 307-redirect
// from /guides/<id>.html to /guides/<id>, and a non-following request returns 0 bytes, which
// looks exactly like a failed deploy. This cost real debugging time once already.
async function get(url) {
  // WHY a timeout: without one a connection that never settles hangs the release path
  // forever. src/link-check.js already sets this precedent at 10s with an AbortController;
  // matching it keeps one number in the reader's head.
  // WHY the timer spans the body read too, corrected 2026-08-18: fetch() resolves as soon
  // as the response HEADERS arrive. Clearing the timer there left response.text() unbounded,
  // so a server that sent headers and then stalled mid-body could hang the release path
  // indefinitely — the exact failure this timeout was added to prevent, just moved one step
  // later. The deadline now covers both phases and is cleared only once the body is in hand.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal });
    const body = await response.text();
    return {
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      headers: response.headers,
      body,
    };
  } catch (error) {
    if (error && error.name === "AbortError") {
      throw new Error(`${url} did not respond within ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

// Sizes below are reported in CHARACTERS, not bytes, and say so: response.body.length counts
// UTF-16 code units, so the live data.js reads 363,844 here against 364,608 from
// `curl | wc -c`. Both numbers are right about different things — labelling this "bytes"
// would have someone chasing a 764-byte phantom diff on a healthy release.


/**
 * Step 2, local half: every guide carries the committed version.
 * A guide left behind means gen:guides was not run or not committed.
 */
function checkGuidesLocal(version) {
  const dir = path.join(ROOT, "public", "guides");
  const guides = fs.readdirSync(dir).filter((name) => name.endsWith(".html"));
  const stale = guides.filter((name) => !fs.readFileSync(path.join(dir, name), "utf8").includes(`?v=${version}`));
  // An empty directory would otherwise report "all 0 guides carry ?v=N" and pass — true but
  // vacuous, and the same silent-pass shape the data-procedure guard was just fixed for.
  if (guides.length === 0) {
    record(false, "local guides exist to check", `public/guides contains no .html files; expected ~102`);
    return;
  }
  record(
    stale.length === 0,
    `all ${guides.length} local guides carry ?v=${version}`,
    stale.length === 0 ? "0 stale" : `stale: ${stale.slice(0, 10).join(", ")}${stale.length > 10 ? " …" : ""}`
  );
}

/**
 * Step 2, live half. Note there is no "did the version move" check and that is deliberate:
 * live-equals-committed is the correct assertion for a content deploy AND for a docs-only or
 * Worker-only deploy, which correctly moves nothing. Asserting a move would report a false
 * failure on every docs deploy — the exact trap DEPLOY.md step 2 warns about.
 */
async function checkLiveVersion(origin, guide, version) {
  for (const [label, url] of [
    ["/", `${origin}/`],
    [`/guides/${guide}`, `${origin}/guides/${guide}`],
  ]) {
    const response = await get(url);
    const { all, distinct } = versionMarkers(response.body);
    const wrong = distinct.filter((value) => value !== version);
    record(
      response.status === 200 && all.length > 0 && wrong.length === 0,
      `live ${label} serves ?v=${version} on all ${all.length} versioned reference(s)`,
      `HTTP ${response.status}, ${response.body.length} chars, distinct versions: ${distinct.join(", ") || "none"}` +
        (wrong.length ? ` — STALE: ?v=${wrong.join(", ?v=")}` : "")
    );
  }
}

/** Step 3: the changed content itself, not just the version string. */
async function checkContent(origin, asset, version, present, absent) {
  const url = `${origin}/${asset}?v=${version}`;
  const response = await get(url);
  record(response.status === 200, `live ${asset} fetched`, `HTTP ${response.status}, ${response.body.length} chars`);
  if (response.status !== 200) return;
  for (const needle of present) {
    const count = response.body.split(needle).length - 1;
    record(count > 0, `live ${asset} contains "${needle}"`, `${count} occurrence(s)`);
  }
  for (const needle of absent) {
    const count = response.body.split(needle).length - 1;
    record(count === 0, `live ${asset} does not contain "${needle}"`, `${count} occurrence(s)`);
  }
}

/** Steps 5 and 7: the endpoint contract, and that the live catalogue matches what shipped. */
async function checkLinkHealth(origin, counts) {
  const response = await get(`${origin}/api/link-health`);
  const isJson = response.contentType.includes("application/json");
  record(
    response.status === 200 && isJson,
    "/api/link-health answers a fetch with 200 application/json",
    `HTTP ${response.status}, content-type: ${response.contentType || "none"}`
  );
  if (response.status !== 200 || !isJson) return;

  let report;
  try {
    report = JSON.parse(response.body);
  } catch (error) {
    record(false, "/api/link-health returns parseable JSON", String(error.message));
    return;
  }
  // WHY this is conditional, and it is the whole point of the check:
  // /api/link-health does NOT re-derive the catalogue per request. It serves the report
  // the three-hourly cron last wrote to KV. So after a deploy that changes the link count,
  // the live report legitimately keeps the OLD total until the next cron run — up to three
  // hours — because runLinkCheck() only starts a fresh sweep once catalogSignature stops
  // matching the stored one. Asserting equality unconditionally would therefore report a
  // false failure on every link-changing deploy, which is the exact class of mistake this
  // script exists to avoid. Measured on the 2026-08-17 removal deploy: committed 179, live
  // still 180 with the removed camrose.ca URL present, and nothing was wrong.
  //
  // So: compare signatures first. Matching signature means the report describes THIS
  // catalogue, and then the totals must agree — a mismatch there is real. A differing
  // signature means the report predates this deploy; say so and move on.
  // FAIL CLOSED on a malformed payload. Without this, a 200 application/json body of `{}`
  // has no catalogSignature, compares unequal, and slides into the INCONCLUSIVE branch —
  // reporting a benign propagation window for what is actually a broken or incompatible
  // endpoint. A missing signature is not a mismatch; it is an answer we cannot read.
  const wellFormed =
    report !== null &&
    typeof report === "object" &&
    !Array.isArray(report) &&
    typeof report.catalogSignature === "string" &&
    report.catalogSignature.length > 0 &&
    Number.isInteger(report.total) &&
    Number.isInteger(report.skippedDynamic);
  if (!wellFormed) {
    record(
      false,
      "/api/link-health returns a well-formed report",
      "expected an object with a non-empty string catalogSignature and integer total/skippedDynamic; " +
        `got ${JSON.stringify(report).slice(0, 120)}`
    );
    return;
  }

  if (report.catalogSignature === counts.signature) {
    record(
      report.total === counts.total && report.skippedDynamic === counts.skippedDynamic,
      "live link catalogue matches the committed src/links.js",
      `live total=${report.total} skippedDynamic=${report.skippedDynamic}; ` +
        `committed total=${counts.total} skippedDynamic=${counts.skippedDynamic}`
    );
  } else {
    // WHY this is INCONCLUSIVE and not a pass: a differing signature is *consistent with*
    // the propagation window above, but the script cannot tell that case apart from an
    // older production deployment, a production catalogue built from something we never
    // committed, or permanent drift. Saying "predates this deploy" would be asserting a
    // cause we have not established. It stays non-fatal because the benign case is the
    // common one right after a link-changing deploy — but it is a check that did NOT run,
    // and the reader has to close it by hand.
    const liveTotal = (report.catalogSignature || "").split("\n").filter(Boolean).length;
    console.log(
      `INCONCLUSIVE  live link catalogue could not be compared: the live report describes ` +
        `${liveTotal} links, the committed catalogue has ${counts.total}, and their signatures differ.\n` +
        "        Expected within ~3h of a link-changing deploy, because /api/link-health serves the\n" +
        "        last cron snapshot and only re-sweeps once the signature changes. If it persists\n" +
        "        beyond one sweep, treat it as real drift and investigate by hand."
    );
    inconclusive += 1;
  }

  // Reported, never asserted. A null lastFullSweepAt is correct right after the catalogue
  // signature changes — it restarts the sweep — so failing on it would cry wolf on exactly
  // the deploys that touch the monitor. Read it, do not gate on it.
  const coverage = report.coverage || {};
  console.log(
    `INFO  link-health coverage: status=${coverage.status} batch=${coverage.batch}/${coverage.batches} ` +
      `lastFullSweepAt=${coverage.lastFullSweepAt} broken=${report.brokenCount} unreachable=${report.unreachableCount}`
  );
}

/** Step 6, the mechanical half: the headers still ship. Console errors stay a human check. */
async function checkHeaders(origin) {
  const response = await get(`${origin}/`);
  const missing = REQUIRED_HEADERS.filter((name) => !response.headers.get(name));
  record(
    missing.length === 0,
    "security headers present on the custom domain",
    missing.length === 0 ? REQUIRED_HEADERS.join(", ") : `missing: ${missing.join(", ")}`
  );

  const wrong = Object.entries(EXPECTED_HEADER_VALUES)
    .map(([name, expected]) => [name, expected, (response.headers.get(name) || "").trim().toLowerCase()])
    .filter(([, expected, actual]) => actual !== expected);
  const csp = (response.headers.get("content-security-policy") || "").toLowerCase();
  const missingDirectives = REQUIRED_CSP_DIRECTIVES.filter((d) => !csp.includes(d.toLowerCase()));
  record(
    csp.length > 0 && missingDirectives.length === 0,
    "live CSP still carries its load-bearing directives",
    missingDirectives.length === 0 && csp.length > 0
      ? REQUIRED_CSP_DIRECTIVES.join("; ")
      : `missing: ${missingDirectives.join("; ") || "(no CSP header at all)"}`
  );

  record(
    wrong.length === 0,
    "value-sensitive security headers carry their documented values",
    wrong.length === 0
      ? Object.entries(EXPECTED_HEADER_VALUES).map(([name, value]) => `${name}: ${value}`).join(", ")
      : wrong.map(([name, expected, actual]) => `${name}: expected "${expected}", got "${actual || "none"}"`).join("; ")
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const version = committedVersion();
  const counts = committedLinkCounts();
  console.log(`Verifying ${args.origin} against the committed tree (?v=${version}).`);
  console.log("DEPLOY.md covers what this does not: the intended commit, the wizard/reload/");
  console.log("IndexedDB journey, privacy, keyboard/theme/print/mobile, and reading a");
  console.log("disagreement as propagation before calling it a failure.\n");

  checkGuidesLocal(version);
  await checkLiveVersion(args.origin, args.guide, version);
  if (args.asset) await checkContent(args.origin, args.asset, version, args.present, args.absent);
  await checkLinkHealth(args.origin, counts);
  await checkHeaders(args.origin);

  const failed = results.filter((result) => !result.ok);
  console.log(
    `\n${results.length - failed.length}/${results.length} checks passed` +
      (inconclusive ? `, ${inconclusive} inconclusive (see above — not verified, verify by hand).` : ".")
  );
  if (failed.length) {
    console.log("A failure here is not automatically a bad release: re-run once before");
    console.log("classifying it, because propagation mid-flight looks the same. A mismatch");
    console.log("that persists is real. See DEPLOY.md, \"Reading the results\".");
    process.exitCode = 1;
  } else if (inconclusive) {
    console.log("Exiting 2: nothing failed, but the run did not verify everything it set out");
    console.log("to. Re-run after the next sweep, or close it by hand.");
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(`verify-deploy could not complete: ${error.message}`);
  process.exitCode = 1;
});
