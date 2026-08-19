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

// Directive name -> the EXACT source list it must carry. Compared as token sets after
// splitting the header on ";", never as substrings: `csp.includes("script-src 'self'")`
// happily passes `script-src 'self' https://evil.example`, which is the precise attack
// this check exists to notice. Directive ORDER is not contractual, so the header is
// parsed rather than compared whole.
const REQUIRED_CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": ["'self'"],
  "connect-src": ["'self'"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  // form-action does NOT fall back to default-src. It is in the shipped policy
  // (public/_headers) and was going unverified, so a live `form-action *` would have
  // passed every other check while permitting form submission to any destination.
  "form-action": ["'self'"],
  // These fall back to default-src, so an EXPLICIT weaker value overrides the fallback
  // silently — `style-src https://evil.example` would otherwise pass every other check.
  // Pinned to what public/_headers actually ships, including the two deliberate relaxations:
  // inline styles (the app sets them from JS for the progress bar, text size and reading
  // guide) and data: images.
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:"],
  "font-src": ["'self'"],
};

// CLOSED SET, not a blocklist. Anything present in the live CSP that is not a key of
// REQUIRED_CSP_DIRECTIVES fails.
//
// WHY inverted, 2026-08-19: three review rounds each found one more directive missing from
// a blocklist — script-src-elem, then object-src/worker-src/child-src/frame-src, then
// style-src-elem/prefetch-src, then navigate-to. Enumerating what is dangerous is unbounded:
// CSP gains directives, and every one that falls back to default-src can override it
// silently. Enumerating what we SHIP is bounded — it is nine directives in public/_headers.
// So an unrecognised directive is now a failure by default, and adding one to _headers
// deliberately means updating this contract, which is exactly the review that should happen.

/**
 * Parse a CSP header into directives, and report duplicates rather than silently resolving
 * them. WHY duplicates are an error and not a merge: CSP uses the FIRST occurrence of a
 * repeated directive and ignores the rest, while a Map keyed by name keeps the LAST. So
 * `script-src https://evil.example; script-src 'self'` would have been read as `'self'`
 * and passed, while the policy the browser actually enforces allows the external origin.
 * A duplicate is never something we ship, so treating it as a failure is both safe and
 * simpler than emulating the precedence rule.
 */
function parseCsp(header) {
  const directives = new Map();
  const duplicates = [];
  for (const clause of String(header || "").split(";")) {
    const tokens = clause.trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) continue;
    const name = tokens[0].toLowerCase();
    if (directives.has(name)) {
      duplicates.push(name);
      continue;
    }
    directives.set(name, tokens.slice(1).map((t) => t.toLowerCase()));
  }
  return { directives, duplicates };
}
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

/**
 * The versioned asset PATHS a document references, e.g. "app.js", "fonts/inter-latin.woff2".
 * Needed because checking only that every marker found has the right value says nothing
 * about markers that are missing: a live homepage serving one correct `?v=112` and having
 * dropped the other thirteen script and font tags passed the old predicate. Completeness is
 * the property that matters — a release that loses app.js is exactly the failure this
 * script exists to catch.
 */
function versionedAssets(html) {
  return [...html.matchAll(/([A-Za-z0-9._/-]+)\?v=\d+/g)].map((m) => m[1].replace(/^\.?\//, "")).sort();
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
      redirected: response.redirected,
      finalUrl: response.url,
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
 * The guide slugs the generated sitemap declares. sitemap.xml and the guide pages are
 * written by the same gen:guides run, so it is the manifest — and comparing against it
 * catches what a directory-not-empty check cannot: 101 of 102 guides missing while
 * dtc.html survives. Both are generated together, so a mismatch means one was not written.
 */
function sitemapGuideSlugs(xml) {
  // The grammar is the generator's own slugify(): lowercase alphanumerics and hyphens.
  // Nothing else is accepted — a "." or ".." in a committed sitemap would otherwise be
  // interpolated into /guides/<slug> and normalise to the site root, so a crafted manifest
  // could make the sweep fetch "/" and count it as a served guide.
  return [...xml.matchAll(/<loc>[^<]*\/guides\/([^<\/]+?)(?:\.html)?<\/loc>/g)]
    .map((m) => m[1])
    .filter((slug) => /^[a-z0-9-]+$/.test(slug) && slug !== "index")
    .sort();
}

/**
 * Step 2, local half: every guide carries the committed version.
 * A guide left behind means gen:guides was not run or not committed.
 */
function checkGuidesLocal(version) {
  // returns the guide slugs when the local set is trustworthy, so the live sweep can use them
  const dir = path.join(ROOT, "public", "guides");
  const guides = fs.readdirSync(dir).filter((name) => name.endsWith(".html"));
  // WHY not `.includes(`?v=${version}`)`: that substring matches `?v=1120` when the
  // version is 112, so a guide a full release behind would read as current. Extract the
  // markers and compare values exactly.
  const stale = guides.filter((name) => {
    const { all, distinct } = versionMarkers(fs.readFileSync(path.join(dir, name), "utf8"));
    return all.length === 0 || distinct.some((value) => value !== version);
  });
  // An empty directory would otherwise report "all 0 guides carry ?v=N" and pass — true but
  // vacuous, and the same silent-pass shape the data-procedure guard was just fixed for.
  // Compare the directory against the sitemap manifest, not merely "is it non-empty".
  const sitemapPath = path.join(ROOT, "public", "sitemap.xml");
  const declared = fs.existsSync(sitemapPath) ? sitemapGuideSlugs(fs.readFileSync(sitemapPath, "utf8")) : [];
  const present = guides.map((name) => name.replace(/\.html$/, "")).filter((slug) => slug !== "index").sort();
  const absent = declared.filter((slug) => !present.includes(slug));
  const unexpected = present.filter((slug) => !declared.includes(slug));
  record(
    declared.length > 0 && absent.length === 0 && unexpected.length === 0,
    `local guides match the ${declared.length} the sitemap declares`,
    declared.length === 0
      ? "sitemap.xml declares no guide URLs — cannot establish the expected set"
      : absent.length === 0 && unexpected.length === 0
      ? `${present.length} present, none missing`
      : `${absent.length ? `MISSING: ${absent.slice(0, 8).join(", ")}${absent.length > 8 ? ` (+${absent.length - 8})` : ""}` : ""}` +
        `${unexpected.length ? ` UNEXPECTED: ${unexpected.slice(0, 8).join(", ")}` : ""}`
  );
  if (declared.length === 0 || absent.length || unexpected.length) return null;
  record(
    stale.length === 0,
    `all ${guides.length} local guides carry ?v=${version}`,
    stale.length === 0 ? "0 stale" : `stale: ${stale.slice(0, 10).join(", ")}${stale.length > 10 ? " …" : ""}`
  );
  return stale.length === 0 ? declared : null;
}

/**
 * Step 2, live half. Note there is no "did the version move" check and that is deliberate:
 * live-equals-committed is the correct assertion for a content deploy AND for a docs-only or
 * Worker-only deploy, which correctly moves nothing. Asserting a move would report a false
 * failure on every docs deploy — the exact trap DEPLOY.md step 2 warns about.
 */
async function checkLiveVersion(origin, guide, version) {
  // Expected asset references come from the COMMITTED documents, so "the live page is
  // missing an asset it should have" is detectable rather than invisible.
  const guideFile = path.join(ROOT, "public", "guides", `${guide}.html`);
  const expected = {
    "/": versionedAssets(fs.readFileSync(path.join(ROOT, "public", "index.html"), "utf8")),
    [`/guides/${guide}`]: fs.existsSync(guideFile) ? versionedAssets(fs.readFileSync(guideFile, "utf8")) : [],
  };
  for (const [label, url] of [
    ["/", `${origin}/`],
    [`/guides/${guide}`, `${origin}/guides/${guide}`],
  ]) {
    const response = await get(url);
    const { all, distinct } = versionMarkers(response.body);
    const wrong = distinct.filter((value) => value !== version);
    const liveAssets = versionedAssets(response.body);
    const expectedAssets = expected[label] || [];
    const missing = expectedAssets.filter((a) => !liveAssets.includes(a));
    const extra = liveAssets.filter((a) => !expectedAssets.includes(a));
    record(
      response.status === 200 && all.length > 0 && wrong.length === 0 && missing.length === 0 && extra.length === 0,
      `live ${label} serves ?v=${version} on all ${expectedAssets.length} committed versioned asset(s)`,
      `HTTP ${response.status}, ${response.body.length} chars, ${all.length} reference(s), distinct versions: ` +
        `${distinct.join(", ") || "none"}` +
        (wrong.length ? ` — STALE: ?v=${wrong.join(", ?v=")}` : "") +
        (missing.length ? ` — MISSING: ${missing.join(", ")}` : "") +
        (extra.length ? ` — UNEXPECTED: ${extra.join(", ")}` : "")
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

/**
 * Every generated guide is actually served, at the committed version.
 *
 * WHY all of them and not a sample: the local manifest check proves the 102 guides exist in
 * the repository, which says nothing about what the deploy uploaded. Checking one guide
 * (the old behaviour) would pass a release that shipped only that one — and a missing guide
 * is a disabled person reaching a 404 for the benefit they were sent to read. Sampling is
 * the same bet with better odds, and this project's own rule is to count rather than
 * sample. 102 requests at concurrency 8 costs a couple of seconds on a check that runs once
 * per release.
 */
async function checkAllGuidesLive(origin, version, slugs) {
  const failures = [];
  const queue = [...slugs];
  const worker = async () => {
    for (let slug = queue.pop(); slug !== undefined; slug = queue.pop()) {
      try {
        const response = await get(`${origin}/guides/${slug}`);
        const { all, distinct } = versionMarkers(response.body);
        // WHY a redirect fails here: /guides/<slug> serves 200 directly (only the .html
        // form 307s). A guide that redirects has been removed or renamed, and following it
        // to a 200 landing page with correct markers would record the missing guide as
        // served — the site root satisfies every other condition in this predicate.
        if (response.redirected) failures.push(`${slug}: redirected to ${response.finalUrl}`);
        else if (response.status !== 200) failures.push(`${slug}: HTTP ${response.status}`);
        else if (all.length === 0) failures.push(`${slug}: no ?v marker`);
        else if (distinct.some((value) => value !== version)) failures.push(`${slug}: ?v=${distinct.join(",")}`);
      } catch (error) {
        failures.push(`${slug}: ${String((error && error.message) || error).slice(0, 60)}`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(8, slugs.length) }, worker));
  record(
    failures.length === 0,
    `all ${slugs.length} guides served live at ?v=${version}`,
    failures.length === 0
      ? `${slugs.length} fetched, all 200 and current`
      : `${failures.length} bad: ${failures.slice(0, 6).join("; ")}${failures.length > 6 ? ` (+${failures.length - 6})` : ""}`
  );
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
  const cspHeader = response.headers.get("content-security-policy") || "";
  const { directives: csp, duplicates } = parseCsp(cspHeader);
  const cspProblems = duplicates.map((name) => `${name}: repeated (CSP honours the FIRST, so this is unsafe)`);
  // script-src-elem and script-src-attr override script-src for their contexts, so a policy
  // could satisfy `script-src 'self'` and still permit an external script element. We ship
  // neither; require them absent, or identical to script-src if they ever appear.
  for (const override of ["script-src-elem", "script-src-attr"]) {
    if (!csp.has(override)) continue;
    const actual = csp.get(override);
    const ok = actual.length === 1 && actual[0] === "'self'";
    if (!ok) cspProblems.push(`${override}: overrides script-src with [${actual.join(" ") || "(empty)"}]`);
  }
  for (const name of csp.keys()) {
    // Object.hasOwn, NOT `in`: `in` walks the prototype chain, so "constructor",
    // "toString", "hasOwnProperty", "valueOf" and "__proto__" were all treated as
    // documented directives and skipped — five names silently exempt from a check whose
    // whole contract is "anything not in this set fails".
    if (Object.hasOwn(REQUIRED_CSP_DIRECTIVES, name)) continue;
    if (name === "script-src-elem" || name === "script-src-attr") continue; // handled above
    const actual = csp.get(name);
    cspProblems.push(
      `${name}: not part of the documented policy (value [${actual.join(" ") || "(empty)"}]) — ` +
        "add it to REQUIRED_CSP_DIRECTIVES with its expected sources if it is intended"
    );
  }
  for (const [name, expected] of Object.entries(REQUIRED_CSP_DIRECTIVES)) {
    if (!csp.has(name)) {
      cspProblems.push(`${name}: absent`);
      continue;
    }
    const actual = csp.get(name);
    const same = actual.length === expected.length && expected.every((token) => actual.includes(token));
    if (!same) cspProblems.push(`${name}: expected [${expected.join(" ")}], got [${actual.join(" ") || "(empty)"}]`);
  }
  record(
    cspHeader.length > 0 && cspProblems.length === 0,
    "live CSP directives carry exactly their documented sources",
    cspHeader.length === 0
      ? "no CSP header at all"
      : cspProblems.length === 0
      ? Object.entries(REQUIRED_CSP_DIRECTIVES).map(([n, v]) => `${n} ${v.join(" ")}`).join("; ")
      : cspProblems.join("; ")
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

  const guideSlugs = checkGuidesLocal(version);
  await checkLiveVersion(args.origin, args.guide, version);
  if (guideSlugs) await checkAllGuidesLive(args.origin, version, guideSlugs);
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
