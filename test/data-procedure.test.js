"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { execFileSync } = require("node:child_process");
const { redactGroundingNarrative } = require("../scripts/benefits-context-safety");

const ROOT = path.join(__dirname, "..");
const DATA_FILES = [
  "public/data.js",
  "public/grants-data.js",
  "public/orgs-data.js",
];

function runGit(args) {
  try {
    return {
      ok: true,
      stdout: execFileSync("git", args, {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }).trim(),
    };
  } catch (error) {
    return {
      ok: false,
      reason: error.stderr?.toString().trim() || error.message,
    };
  }
}

function changedPaths(stdout) {
  return new Set(stdout.split(/\r?\n/).filter(Boolean));
}

function resolveChangeContext() {
  // WHY: CI declares its baseline explicitly instead of letting this resolver guess
  // from whichever refs happen to exist. The ref scan below is a heuristic, and on a
  // real push it is rescued only by luck: `actions/checkout` points origin/main at the
  // pushed commit, so `merge-base HEAD origin/main == HEAD` and that candidate is
  // rejected. What saved it in practice was leftover *merged feature branches* still
  // present on the remote, which supplied a nearer ancestor. Delete those branches —
  // ordinary hygiene — and the scan finds nothing and this guard fails closed on every
  // data change, blocking the deploy through `needs: test`.
  //
  // Verified 2026-08-16 by reproducing the CI checkout shape (HEAD == origin/main,
  // fetch-depth: 0): with the feature refs present the guard resolved the true parent
  // and caught a real omission; with only origin/main present it reported
  // "no comparison refs were available" and failed 2 of 4 tests.
  //
  // A wrong baseline is worse than none: it would silently drop the data file from the
  // change set and pass all four checks vacuously. So an explicitly supplied baseline is
  // validated and, if unusable, fails closed rather than falling back to the guess.
  // WHY every untrusted-baseline path below claims all data files changed: the four
  // tests return early when no data file is in the change set, and only *then* consult
  // baselineError. Failing closed with an empty (or merely HEAD-derived) set is
  // therefore a silent pass — the exact vacuous-guard failure this file exists to
  // prevent. Both variants were caught by this file's own fail-closed checks on
  // 2026-08-16: an empty set passed 4/0, and a HEAD-derived set still passed 4/0
  // whenever HEAD's own commit touched no data file. When the baseline cannot be
  // trusted we cannot know whether data changed, so assume it did and let the error
  // surface.
  const assumeDataChanged = () => new Set([...DATA_FILES]);

  // Collected up front so EVERY successful comparison below can union it in. A dirty
  // tracked data file is part of the tree being tested no matter which baseline is in
  // play: an explicit DATA_PROCEDURE_BASELINE says which revision to compare against, it
  // does not say "ignore what is sitting uncommitted in front of you". Before this, a
  // valid declared baseline plus an uncommitted edit to public/orgs-data.js reported NOT
  // APPLICABLE and passed 4/0.
  const earlyWorktreeDiff = runGit(["diff", "--name-only", "HEAD"]);
  const earlyWorktreePaths = earlyWorktreeDiff.ok ? changedPaths(earlyWorktreeDiff.stdout) : new Set();

  const declared = (process.env.DATA_PROCEDURE_BASELINE || "").trim();
  if (declared) {
    // (historical note, kept because it explains the shape of every branch below)
    // WHY every failure path below claims all data files changed: the four tests
    // return early when no data file is in the change set, and only *then* consult
    // baselineError. Failing closed with an empty (or merely HEAD-derived) set is
    // therefore a silent pass — the exact vacuous-guard failure this file exists to
    // prevent. Both variants were caught by this file's own fail-closed checks on
    // 2026-08-16: an empty set passed 4/0, and a HEAD-derived set still passed 4/0
    // whenever HEAD's own commit touched no data file, which is the ordinary case
    // for a force-push mid-series. When the baseline cannot be trusted we cannot know
    // whether data changed, so assume it did and let baselineError surface.

    // GitHub sends the all-zero SHA for the first push of a ref: there is genuinely
    // no previous commit to compare against, so say so instead of guessing.
    if (/^0+$/.test(declared)) {
      return {
        changed: assumeDataChanged(),
        baselineError:
          "enforcement could not be completed because DATA_PROCEDURE_BASELINE is the all-zero SHA, " +
          "which means this is the first push of this ref and no previous commit exists to compare against. " +
          "Re-run after a second commit, or supply an explicit ancestor SHA.",
      };
    }

    const exists = runGit(["cat-file", "-e", `${declared}^{commit}`]);
    // WHY "strictly older" and not merely "an ancestor": git counts a commit as its own
    // ancestor, so `--is-ancestor HEAD HEAD` succeeds and `HEAD...HEAD` is an empty diff.
    // A declared baseline of HEAD would then find no changed data file and every check
    // would return early — passing without inspecting anything. Confirmed 2026-08-16:
    // DATA_PROCEDURE_BASELINE=HEAD passed 4/0 before this rejection existed.
    const resolvedDeclared = runGit(["rev-parse", `${declared}^{commit}`]);
    const headSha = runGit(["rev-parse", "HEAD"]);
    const isSameAsHead =
      resolvedDeclared.ok && headSha.ok && resolvedDeclared.stdout === headSha.stdout;
    const isAncestor =
      exists.ok &&
      !isSameAsHead &&
      runGit(["merge-base", "--is-ancestor", declared, "HEAD"]).ok;
    if (!isAncestor) {
      return {
        changed: assumeDataChanged(),
        baselineError:
          `enforcement could not be completed because DATA_PROCEDURE_BASELINE (${declared}) ` +
          (isSameAsHead
            ? "resolves to HEAD itself, so there is nothing earlier to compare against."
            : exists.ok
            ? "is not an ancestor of HEAD. A force-push or an unrelated SHA can cause this."
            : "does not exist in this checkout. CI must check out with enough history to contain it (fetch-depth: 0).") +
          " Refusing to fall back to ref guessing, because a wrong baseline would pass this guard vacuously.",
      };
    }
    const declaredDiff = runGit(["diff", "--name-only", `${declared}...HEAD`]);
    if (declaredDiff.ok) {
      // WHY the resolved SHA rather than `declared`: DATA_PROCEDURE_BASELINE accepts any
      // object name git accepts — an abbreviation, a tag, a ref — so echoing it back left
      // the diagnostic showing whatever was typed. Reporting the canonical 40-char SHA
      // makes the baseline unambiguous in a CI log and lets shortSha() actually shorten it.
      return {
        baseline: resolvedDeclared.ok ? resolvedDeclared.stdout : declared,
        trust: "declared",
        changed: new Set([...changedPaths(declaredDiff.stdout), ...earlyWorktreePaths]),
      };
    }
    return {
      changed: assumeDataChanged(),
      baselineError:
        `enforcement could not be completed because diffing against DATA_PROCEDURE_BASELINE (${declared}) ` +
        `failed: ${declaredDiff.reason}`,
    };
  }

  // WHY CI never reaches the ref scan below: that scan is a heuristic over whatever refs
  // happen to exist, which is exactly how this guard came to depend on leftover merged
  // feature branches for its baseline. push and pull_request always declare one from the
  // event. workflow_dispatch does not, and it is an enabled trigger here — manual re-runs
  // are a real capability on this project — so failing it outright would cost something
  // rather than protect anything. Its baseline is not a guess either: a manual run asks
  // "what did this commit change", which is HEAD's first parent. That is deterministic,
  // and unlike the old diff-tree fallback it gives the changelog and asset-version checks
  // a real commit to read the previous file contents from.
  if (process.env.GITHUB_ACTIONS === "true") {
    const parent = runGit(["rev-parse", "HEAD^{commit}^"]);
    if (!parent.ok || !parent.stdout) {
      return {
        changed: assumeDataChanged(),
        baselineError:
          "enforcement could not be completed because no DATA_PROCEDURE_BASELINE was supplied " +
          "and HEAD has no parent commit to fall back to. Re-run from a push or pull request, " +
          "or supply an explicit ancestor SHA.",
      };
    }
    const parentDiff = runGit(["diff", "--name-only", `${parent.stdout}...HEAD`]);
    if (!parentDiff.ok) {
      return {
        changed: assumeDataChanged(),
        baselineError:
          "enforcement could not be completed because no DATA_PROCEDURE_BASELINE was supplied " +
          `and diffing against HEAD's parent failed: ${parentDiff.reason}`,
      };
    }
    return { baseline: parent.stdout, changed: changedPaths(parentDiff.stdout) };
  }

  // WHY: uncommitted ticket work is the normal local workflow. This diff needs no
  // comparison branch, so it also lets the baseline-free checks keep protecting a
  // data edit when a shallow checkout cannot supply the older file contents.
  const worktreeDiff = runGit(["diff", "--name-only", "HEAD"]);
  if (!worktreeDiff.ok) {
    const gitAvailable = runGit(["--version"]);
    return gitAvailable.ok
      ? { resolutionError: `git diff --name-only HEAD failed: ${worktreeDiff.reason}` }
      : { skipReason: `data-change procedure guard cannot run because Git is unavailable: ${gitAvailable.reason}` };
  }
  // WHY this no longer returns early, fixed 2026-08-18: it used to, and that hid every
  // committed data change behind any unrelated dirty file. A tree with public/data.js
  // changed in an earlier commit and one scratch edit to some other tracked file resolved
  // to baseline=HEAD with only the scratch path in the change set, so the guard reported
  // NOT APPLICABLE and passed 4/0 without ever inspecting the committed data change.
  // Reproduced on 6cac97e. The uncommitted paths are still collected — they are the normal
  // local workflow — but they are now UNIONED with whatever the comparison baseline shows,
  // rather than replacing it.
  const worktreePaths = changedPaths(worktreeDiff.stdout);

  // WHY: CI usually has a clean worktree, so discover its comparison branch from
  // Git metadata rather than assuming that the remote is origin or the branch is
  // named main. Remote HEAD symbolic refs cover main, master, trunk, and any other
  // default name; the nearest local ancestor supports clones without that ref.
  const candidates = [];
  const remoteHeads = runGit([
    "for-each-ref",
    "--format=%(symref:short)",
    "refs/remotes",
  ]);
  if (remoteHeads.ok) candidates.push(...remoteHeads.stdout.split(/\r?\n/).filter(Boolean));

  const refs = runGit([
    "for-each-ref",
    "--format=%(refname:short)",
    "refs/heads",
    "refs/remotes",
  ]);
  const ancestorCandidates = [];
  if (refs.ok) {
    for (const ref of refs.stdout.split(/\r?\n/).filter(Boolean)) {
      const mergeBase = runGit(["merge-base", "HEAD", ref]);
      if (!mergeBase.ok || !mergeBase.stdout) continue;
      const distance = runGit(["rev-list", "--count", `${mergeBase.stdout}..HEAD`]);
      if (distance.ok && Number(distance.stdout) > 0) {
        ancestorCandidates.push({ ref, distance: Number(distance.stdout) });
      }
    }
  }
  ancestorCandidates.sort((left, right) => left.distance - right.distance);
  candidates.push(...ancestorCandidates.map(({ ref }) => ref));

  const failures = [];
  for (const branch of [...new Set(candidates)]) {
    const mergeBase = runGit(["merge-base", "HEAD", branch]);
    if (!mergeBase.ok || !mergeBase.stdout || mergeBase.stdout === runGit(["rev-parse", "HEAD"]).stdout) {
      failures.push(`${branch}: ${mergeBase.reason || "no earlier merge-base returned"}`);
      continue;
    }
    const branchDiff = runGit(["diff", "--name-only", `${mergeBase.stdout}...HEAD`]);
    if (branchDiff.ok) {
      return {
        baseline: mergeBase.stdout,
        // "inferred", not declared: the nearest ref that happens to exist in this checkout,
        // not the range actually being pushed. A stale local branch sitting after a data
        // commit makes this baseline skip straight over it. The baseline-FREE checks below
        // no longer depend on this being right.
        trust: "inferred",
        changed: new Set([...changedPaths(branchDiff.stdout), ...worktreePaths]),
      };
    }
    failures.push(`${branch}: ${branchDiff.reason}`);
  }

  // WHY: in a shallow CI checkout HEAD can look like a root commit. diff-tree is
  // still enough to notice a data file in that visible commit, so do not silently
  // skip the gate; run baseline-free checks and make baseline-dependent checks
  // fail closed with checkout advice.
  //
  // WHY the union with every data file, added 2026-08-18: the visible commit is NOT the
  // change set. A shallow checkout of depth > 1 can show a tip that touches no data file
  // while an earlier, invisible commit in the same push changed all of them — reproduced
  // against `main` at 1428eba, where a depth-2 clone reported "NOT APPLICABLE ...
  // (baseline=unresolved)" and passed 4/0 even though ee0afbe, three commits back, had
  // rewritten all three data files. That is this guard failing OPEN in the one situation
  // it cannot see, and it contradicted the rule every other failure path here already
  // follows: when the baseline cannot be trusted we do not know whether data changed, so
  // assume it did and let baselineError surface.
  const headChange = runGit(["diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "HEAD"]);
  const visible = headChange.ok ? changedPaths(headChange.stdout) : new Set();
  const changed = new Set([...visible, ...worktreePaths, ...assumeDataChanged()]);
  return {
    changed,
    baselineError:
      "enforcement could not be completed because the git baseline is unavailable. " +
      "CI should check out with full history (for example, fetch-depth: 0). " +
      `Baseline attempts: ${failures.join(" | ") || "no comparison refs were available"}`,
  };
}

let reportedGuardState = false;

function dataChangeContext(t) {
  const resolved = resolveChangeContext();
  if (resolved.skipReason) {
    t.skip(resolved.skipReason);
    return null;
  }
  if (resolved.resolutionError) assert.fail(resolved.resolutionError);

  const changedDataFiles = DATA_FILES.filter((file) => resolved.changed.has(file));

  // WHY: the four tests below return early when no data file is in the change set, so
  // "4 pass / 0 fail" is the signature of a genuine enforced run AND of a vacuous one.
  // The log could not tell them apart, which is the failure this file exists to prevent
  // — applied to itself. Timing is not a usable substitute: measured 2026-08-17, an
  // explicit DATA_PROCEDURE_BASELINE fires in ~163ms because it does one diff, while the
  // no-baseline path takes ~2427ms walking every ref and can still return early. The
  // fast run was the one that fired. So say so explicitly instead of inferring it.
  // Emitted once per run rather than once per test: all four tests call this, and four
  // identical lines is noise that makes the one line anyone needs harder to find.
  if (!reportedGuardState) {
    reportedGuardState = true;
    const trust = resolved.trust || "none";
    const where = resolved.baseline
      ? `baseline=${shortSha(resolved.baseline)}${trust === "inferred" ? " (inferred, not declared)" : ""}`
      : "baseline=unresolved";
    if (changedDataFiles.length === 0) {
      t.diagnostic(`data-procedure guard: NOT APPLICABLE — no data file in the change set (${where})`);
    } else if (resolved.baselineError) {
      t.diagnostic(
        `data-procedure guard: FIRED — ${changedDataFiles.join(", ")} changed, but ${where}, ` +
          "so baseline-dependent checks fail closed"
      );
    } else {
      t.diagnostic(`data-procedure guard: FIRED — ${where}, changed: ${changedDataFiles.join(", ")}`);
    }
  }

  return { ...resolved, changedDataFiles };
}

// "HEAD" is a legitimate baseline value here (the working-tree-diff path), so only
// abbreviate something that actually looks like an object name.
function shortSha(value) {
  return /^[0-9a-f]{40}$/i.test(value) ? value.slice(0, 7) : value;
}

function extractAssetMarkers(source) {
  return [...source.matchAll(/\?v(?==|[\s"'&<>#)])(?:=([^\s"'&<>)]*))?/g)].map((match) => ({
    raw: match[0],
    hasEquals: match[0].startsWith("?v="),
    value: match[1],
  }));
}

function loadLinkSources() {
  const context = { window: {}, document: {}, console };
  vm.createContext(context);
  vm.runInContext(
    `${readRepoFile("public", "data.js")}\n` +
      `${readRepoFile("public", "grants-data.js")}\n` +
      `${readRepoFile("public", "orgs-data.js")}\n` +
      "globalThis.__benefits = BENEFITS; globalThis.__bcCities = BC_CITIES; " +
      "globalThis.__help = HELP_ORGS; globalThis.__grants = GRANTS_DIRECTORY; " +
      "globalThis.__orgs = ORGS_DIRECTORY; " +
      // Province fallback maps. This mirror must expose exactly what
      // scripts/gen-benefits-context.js exposes, or the expected and generated link lists
      // drift and this guard blocks the next data deploy for the wrong reason.
      "globalThis.__studentAid = STUDENT_AID; globalThis.__twoEleven = TWO_ELEVEN; " +
      "globalThis.__employment = EMPLOYMENT; globalThis.__fedStudentAid = FED_STUDENT_AID; " +
      "globalThis.__national211 = NATIONAL_211;",
    context
  );
  return context;
}

function expectedGeneratedLinks() {
  const sources = loadLinkSources();
  const bcEnabled = /\bconst BC_ENABLED = true;\s*$/m.test(readRepoFile("public", "app.js"));
  const benefits = bcEnabled
    ? sources.__benefits
    : sources.__benefits.filter(
        (benefit) =>
          benefit.level !== "British Columbia" &&
          benefit.level !== "Metro Vancouver" &&
          !sources.__bcCities.includes(benefit.level)
      );
  const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const tuples = [];
  const seen = new Set();
  let skippedDynamic = 0;
  const addLink = (url, label, kind) => {
    const staticUrl = typeof url === "function" ? url.staticUrl : url;
    if (typeof url === "function" && (typeof staticUrl !== "string" || !staticUrl.startsWith("http"))) {
      skippedDynamic++;
      return;
    }
    if (typeof staticUrl !== "string" || !staticUrl.startsWith("http") || seen.has(staticUrl)) return;
    seen.add(staticUrl);
    tuples.push([staticUrl, clean(label), kind]);
  };

  for (const benefit of benefits) {
    addLink(benefit.applyUrl, `${clean(benefit.name)} — apply`, "apply");
    addLink(benefit.source, `${clean(benefit.name)} — official source`, "source");
  }
  const helpOrgs = Array.isArray(sources.__help)
    ? sources.__help
    : Object.values(sources.__help || {}).flat();
  for (const org of helpOrgs) {
    if (org?.url) addLink(org.url, `Help — ${clean(org.name || org.url)}`, "help");
  }
  for (const grant of sources.__grants || []) {
    if (grant?.url) addLink(grant.url, `grant:${clean(grant.id)} — ${clean(grant.name || grant.url)}`, "grant");
  }
  for (const org of sources.__orgs || []) {
    if (org?.url) addLink(org.url, `org:${clean(org.id)} — ${clean(org.name || org.url)}`, "org");
  }
  // Must stay in the same ORDER and use the same LABELS as the generator: the guard
  // compares ordered (url, label, kind) tuples, so a reordering fails as loudly as an
  // omission.
  for (const [mapName, map] of [
    ["student aid", sources.__studentAid],
    ["2-1-1", sources.__twoEleven],
    ["employment supports", sources.__employment],
  ]) {
    for (const [province, url] of Object.entries(map || {})) {
      addLink(url, `Province fallback — ${mapName} (${clean(province)})`, "help");
    }
  }
  addLink(sources.__fedStudentAid, "Province fallback — student aid (national default)", "help");
  addLink(sources.__national211, "Province fallback — 2-1-1 (national default)", "help");
  return { tuples, skippedDynamic };
}

function generatedLinks() {
  const source = readRepoFile("src", "links.js");
  const match = source.match(
    /export const LINKS = (\[[\s\S]*?\]);\s*\n\s*export const SKIPPED_DYNAMIC = (\d+);/
  );
  assert.ok(match, "src/links.js must export its generated LINKS array and SKIPPED_DYNAMIC count");
  return {
    tuples: JSON.parse(match[1]).map(({ url, label, kind }) => [url, label, kind]),
    skippedDynamic: Number(match[2]),
  };
}

function expectedBenefitsContextSource() {
  const sources = loadLinkSources();
  const appSource = readRepoFile("public", "app.js");
  const bcEnabledMatch = /^const BC_ENABLED = (true|false);\s*$/m.exec(appSource);
  assert.ok(bcEnabledMatch, "public/app.js must declare a literal BC_ENABLED value");
  const bcEnabled = bcEnabledMatch[1] === "true";
  const benefits = bcEnabled
    ? sources.__benefits
    : sources.__benefits.filter(
        (benefit) =>
          benefit.level !== "British Columbia" &&
          benefit.level !== "Metro Vancouver" &&
          !sources.__bcCities.includes(benefit.level)
      );
  const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const byId = new Map(benefits.map((benefit) => [benefit.id, benefit]));
  const formsMatch = /const PRACTITIONER_FORMS = (\{[\s\S]*?\});/.exec(appSource);
  assert.ok(formsMatch, "public/app.js must contain PRACTITIONER_FORMS for generated context");
  const forms = vm.runInNewContext(`(${formsMatch[1]})`);

  const body = benefits
    .map((benefit) => {
      const where = [benefit.level, benefit.category].filter(Boolean).join(" · ");
      return (
        `- ${redactGroundingNarrative(clean(benefit.name))} [${where}] — ` +
        redactGroundingNarrative(clean(benefit.summary))
      );
    })
    .join("\n");
  const formContext = Object.entries(forms)
    .filter(([id]) => byId.has(id))
    .map(([id, label]) => `- ${clean(byId.get(id).name)}: a practitioner signs ${clean(label)}.`)
    .join("\n");

  const keysFor = (benefit) => {
    const keys = new Set();
    const id = String(benefit.id || "");
    if (id) {
      keys.add(id.toLowerCase());
      if (id.includes("-")) keys.add(id.replace(/-/g, " ").toLowerCase());
    }
    const name = clean(benefit.name);
    const parenthetical = /\(([^)]+)\)/.exec(name);
    if (parenthetical && parenthetical[1].length >= 3) keys.add(parenthetical[1].toLowerCase());
    const bare = name.replace(/\s*\([^)]*\)\s*/g, " ").trim().toLowerCase();
    if (bare.length >= 6) keys.add(bare);
    const form = forms[benefit.id];
    if (form) {
      for (const match of String(form).matchAll(/\b([A-Z]\d{3,})\b/g)) keys.add(match[1].toLowerCase());
    }
    return [...keys].filter((key) => key.length >= 3);
  };

  const details = {};
  for (const benefit of benefits) {
    const detail = benefit.detail || {};
    const parts = [];
    if (detail.about) parts.push(`What it is: ${redactGroundingNarrative(clean(detail.about))}`);
    if (detail.steps?.length) {
      parts.push(
        `How to apply:\n${detail.steps
          .map((step, index) => `  ${index + 1}. ${redactGroundingNarrative(clean(step))}`)
          .join("\n")}`
      );
    }
    if (detail.documents?.length) {
      parts.push(
        `What you need:\n${detail.documents
          .map((document) => `  - ${redactGroundingNarrative(clean(document))}`)
          .join("\n")}`
      );
    }
    if (detail.tips?.length) {
      parts.push(
        `Practical tips:\n${detail.tips
          .map((tip) => `  - ${redactGroundingNarrative(clean(tip))}`)
          .join("\n")}`
      );
    }
    if (detail.time) {
      parts.push(`How long it takes (verified — you may state this): ${redactGroundingNarrative(clean(detail.time))}`);
    }
    if (!parts.length) continue;
    details[benefit.id] = {
      name: redactGroundingNarrative(clean(benefit.name)),
      keys: keysFor(benefit),
      text: parts.join("\n"),
      ...(detail.phone ? { phone: clean(detail.phone) } : {}),
    };
  }

  const scope = {
    bcEnabled,
    label: bcEnabled
      ? "Alberta, British Columbia, and federal Canada"
      : "Alberta and federal Canada",
    provinces: bcEnabled ? ["Alberta", "British Columbia"] : ["Alberta"],
  };

  return `// GENERATED FILE — DO NOT EDIT BY HAND.
// Regenerate with:  npm run gen:context
// Sources of truth: public/data.js (BENEFITS) + public/app.js (PRACTITIONER_FORMS)
//
// ${benefits.length} benefits. Figures are redacted on purpose — the assistant is
// told never to state an amount, and the surest way to hold a small model to
// that is to never show it one. It explains the concept and points at the guide.

/** Always injected: the catalog of what exists + the verified form names. */
export const BENEFITS_CONTEXT = ${JSON.stringify(body)};

/** Allowed exact form facts are kept separate from redacted narrative text. */
export const PRACTITIONER_FORM_CONTEXT = ${JSON.stringify(formContext)};

/** Injected only when the question matches — see retrieveDetails() in index.js. */
export const BENEFIT_DETAILS = ${JSON.stringify(details, null, 2)};

/** Generated from the same BC_ENABLED switch that controls catalogue inclusion. */
export const BENEFITS_SCOPE = Object.freeze(${JSON.stringify(scope)});

export const BENEFIT_COUNT = ${benefits.length};
`;
}

function extractChangelogEntries(source, label = "public/changelog.js") {
  let changelog;
  try {
    // WHY: these are repository-controlled classic-script files. Evaluating them in
    // an isolated function scope is acceptable here and reads actual array elements,
    // which is more robust than pattern-matching object-like text in comments/strings.
    changelog = new Function(`"use strict";\n${source}\nreturn DATA_CHANGELOG;`)();
  } catch (error) {
    assert.fail(`${label} changelog could not be parsed: ${error.message}`);
  }
  assert.ok(Array.isArray(changelog), `${label} changelog could not be parsed: DATA_CHANGELOG is not an array`);

  return new Set(
    changelog
      .filter(
        (entry) =>
          entry &&
          typeof entry === "object" &&
          /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
          typeof entry.text === "string"
      )
      .map((entry) => JSON.stringify([entry.date, entry.text]))
  );
}

function readBaselineFile(baseline, file) {
  const listing = runGit(["ls-tree", "--name-only", baseline, "--", file]);
  if (!listing.ok) return { ok: false, reason: listing.reason };
  if (!listing.stdout) return { ok: true, newFile: true, stdout: "" };
  return runGit(["show", `${baseline}:${file}`]);
}

function readRepoFile(...parts) {
  return fs.readFileSync(path.join(ROOT, ...parts), "utf8");
}

test.describe("data-change procedure stays enforced", () => {
  test("a data change adds a DATA_CHANGELOG entry", (t) => {
    const context = dataChangeContext(t);
    if (!context || context.changedDataFiles.length === 0) return;

    if (context.baselineError) assert.fail(context.baselineError);
    const baselineChangelog = readBaselineFile(context.baseline, "public/changelog.js");
    assert.ok(
      baselineChangelog.ok,
      `enforcement could not be completed because the git baseline is unavailable: ` +
        `${baselineChangelog.reason}. CI should check out with full history ` +
        "(for example, fetch-depth: 0)."
    );

    // WHY: merely touching changelog.js proves nothing: an unrelated whitespace
    // edit used to satisfy this gate while the required public record was absent.
    // Compare parsed entry identities so the current array must retain every old
    // entry and add at least one genuinely new dated entry.
    const baselineEntries = extractChangelogEntries(
      baselineChangelog.stdout,
      "baseline public/changelog.js"
    );
    const currentEntries = extractChangelogEntries(readRepoFile("public", "changelog.js"));
    const retainedBaseline = [...baselineEntries].every((entry) => currentEntries.has(entry));
    assert.ok(
      retainedBaseline && currentEntries.size > baselineEntries.size,
      "public/changelog.js changed but no new DATA_CHANGELOG entry was added. " +
        'Prepend an entry in this format: { date: "YYYY-MM-DD", text: "..." }'
    );
  });

  test("a data change keeps the shared asset version valid everywhere", (t) => {
    const context = dataChangeContext(t);
    // Runs on EVERY test run, not only when a data file is in the change set. It needs no
    // baseline at all, so gating it behind the baseline resolver meant a wrong or heuristic
    // baseline could suppress it — and this pair catches the failures that actually happen
    // (a stale generated artifact, a guide left on an old ?v). Four fail-opens in that
    // resolver across three review rounds is the argument: never let a check that needs no
    // guess depend on one.
    if (!context) return;

    // WHY: this is deliberately baseline-free. A shallow checkout can prevent us
    // from proving that the number moved, but it cannot prevent us from checking
    // the files that will actually deploy. Every generated guide is expected, no
    // empty directory is acceptable, and every guide must carry exactly one valid
    // marker rather than disappearing from the comparison when its marker breaks.
    const guidesDir = path.join(ROOT, "public", "guides");
    const guideFiles = fs
      .readdirSync(guidesDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => `public/guides/${entry.name}`)
      .sort();
    assert.ok(guideFiles.length > 0, "public/guides must contain generated guide files");

    const indexMarkers = extractAssetMarkers(readRepoFile("public", "index.html"));
    const numericIndexVersions = indexMarkers
      .filter((marker) => marker.hasEquals && /^\d+$/.test(marker.value || ""))
      .map((marker) => marker.value);
    const currentVersions = [...new Set(numericIndexVersions)];
    assert.ok(
      indexMarkers.length > 0 &&
        indexMarkers.every((marker) => marker.hasEquals && /^\d+$/.test(marker.value || "")) &&
        currentVersions.length === 1,
      `public/index.html must contain one shared numeric ?v=N value; found ` +
        `${indexMarkers.map((marker) => marker.raw).join(", ") || "no markers"}`
    );
    const currentVersion = currentVersions[0];

    const filesToCheck = ["public/styles.css", ...guideFiles];
    const markerProblems = [];
    for (const file of filesToCheck) {
      const markers = extractAssetMarkers(readRepoFile(...file.split("/")));
      if (markers.length === 0) {
        markerProblems.push(`${file} (missing ?v=N marker)`);
        continue;
      }
      if (markers.some((marker) => !marker.hasEquals)) {
        markerProblems.push(`${file} (malformed marker: ${markers.map((marker) => marker.raw).join(", ")})`);
        continue;
      }
      if (markers.some((marker) => marker.value === "")) {
        markerProblems.push(`${file} (empty ?v= marker)`);
        continue;
      }
      if (markers.some((marker) => !/^\d+$/.test(marker.value))) {
        markerProblems.push(`${file} (non-numeric marker: ${markers.map((marker) => marker.raw).join(", ")})`);
        continue;
      }
      if (file.startsWith("public/guides/") && markers.length !== 1) {
        markerProblems.push(`${file} (expected exactly one marker; found ${markers.length})`);
        continue;
      }
      const versions = new Set(markers.map((marker) => marker.value));
      if (versions.size !== 1 || !versions.has(currentVersion)) {
        markerProblems.push(`${file} (${markers.map((marker) => marker.raw).join(", ")})`);
      }
    }

    assert.deepEqual(
      markerProblems,
      [],
      `shared asset version must be ?v=${currentVersion} in styles.css and every guide. ` +
        `Offending files: ${markerProblems.join(", ") || "none"}. ` +
        "Run npm run gen:guides after bumping index.html."
    );
  });

  test("a data change moves the index asset version", (t) => {
    const context = dataChangeContext(t);
    if (!context || context.changedDataFiles.length === 0) return;

    if (context.baselineError) assert.fail(context.baselineError);
    const baselineIndex = readBaselineFile(context.baseline, "public/index.html");
    assert.ok(
      baselineIndex.ok,
      `enforcement could not be completed because the git baseline is unavailable: ` +
        `${baselineIndex.reason}. CI should check out with full history ` +
        "(for example, fetch-depth: 0)."
    );
    // WHY: a newly added index has no previous asset version and therefore already
    // satisfies "moved". This is distinct from failing to read an existing file,
    // which must fail closed rather than weakening a deploy gate.
    if (baselineIndex.newFile) return;

    const oldVersions = [
      ...new Set(
        extractAssetMarkers(baselineIndex.stdout)
          .filter((marker) => marker.hasEquals && /^\d+$/.test(marker.value || ""))
          .map((marker) => marker.value)
      ),
    ];
    const currentVersions = [
      ...new Set(
        extractAssetMarkers(readRepoFile("public", "index.html"))
          .filter((marker) => marker.hasEquals && /^\d+$/.test(marker.value || ""))
          .map((marker) => marker.value)
      ),
    ];
    assert.equal(
      oldVersions.length,
      1,
      `baseline public/index.html must contain one shared ?v=N value; found ${oldVersions.join(", ") || "none"}`
    );
    assert.equal(
      currentVersions.length,
      1,
      `public/index.html must contain one shared ?v=N value; found ${currentVersions.join(", ") || "none"}`
    );
    assert.notEqual(
      currentVersions[0],
      oldVersions[0],
      `${context.changedDataFiles.join(", ")} changed, but the shared asset version ` +
        `in public/index.html is still ?v=${oldVersions[0]}. Bump ?v=N for browser-loaded data files.`
    );
  });

  test("a data change keeps generated context and link output in step", (t) => {
    const context = dataChangeContext(t);
    // Runs on EVERY test run, not only when a data file is in the change set. It needs no
    // baseline at all, so gating it behind the baseline resolver meant a wrong or heuristic
    // baseline could suppress it — and this pair catches the failures that actually happen
    // (a stale generated artifact, a guide left on an old ?v). Four fail-opens in that
    // resolver across three review rounds is the argument: never let a check that needs no
    // guess depend on one.
    if (!context) return;

    // WHY: the generator has two outputs. Checking links.js alone allowed a benefit
    // rename or summary edit to ship with stale assistant grounding. Reproduce the
    // complete benefits-context rendering in memory so names, summaries, IDs,
    // details, practitioner forms, scope, and count all have to match without ever
    // executing a generator that writes files during the test.
    assert.equal(
      readRepoFile("src", "benefits-context.js"),
      expectedBenefitsContextSource(),
      "src/benefits-context.js is stale compared with public/data.js and public/app.js. " +
        "This check mirrors the complete generated file, including catalogue text, benefit IDs and details, " +
        "practitioner forms, scope, and BENEFIT_COUNT. Run npm run gen:context and review the diff."
    );

    // WHY: URL membership alone misses changed labels, kinds, and ordering. The
    // SKIPPED_DYNAMIC value is deterministic too: the generator increments it once
    // for each function URL that has no monitorable staticUrl, so compare that count
    // rather than trusting an unvalidated generated constant.
    const expected = expectedGeneratedLinks();
    const generated = generatedLinks();
    const differingIndex = Array.from(
      { length: Math.max(expected.tuples.length, generated.tuples.length) },
      (_, index) => index
    ).find(
      (index) => JSON.stringify(expected.tuples[index]) !== JSON.stringify(generated.tuples[index])
    );

    assert.equal(
      differingIndex,
      undefined,
      `generated link catalogue is stale at tuple ${differingIndex}. ` +
        `Expected: ${JSON.stringify(expected.tuples[differingIndex])}. ` +
        `src/links.js: ${JSON.stringify(generated.tuples[differingIndex])}. ` +
        "Run npm run gen:context and review the diff in src/links.js."
    );
    assert.equal(
      generated.skippedDynamic,
      expected.skippedDynamic,
      `src/links.js SKIPPED_DYNAMIC is ${generated.skippedDynamic}, but the data sources contain ` +
        `${expected.skippedDynamic} unmonitorable function URLs. Run npm run gen:context.`
    );
  });
});
