#!/usr/bin/env node
/**
 * Generates src/benefits-context.js from public/data.js.
 *
 * WHY: the assistant runs on a small free model that does not reliably know
 * Alberta benefits. Ungrounded it invented "AISH = Alberta Income Support for
 * the Homeless" (it is Assured Income for the Severely Handicapped). The
 * verified catalog already exists in data.js, so we feed it to the model rather
 * than trusting its memory.
 *
 * Deliberately emits name/level/category/summary and NOT amounts, cutoffs, or
 * URLs. The assistant is not allowed to quote those, and the most reliable way
 * to stop a weak model quoting a number is to never put the number in front of
 * it. It points at the guide instead, which has the checked figures.
 *
 * Run after editing the BENEFITS array in data.js:
 *     npm run gen:context
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const {
  assertGroundingNarrativeSafe,
  redactGroundingNarrative,
} = require("./benefits-context-safety");
const { buildLinkCatalogue } = require("./link-sources");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "data.js");
const GRANTS_SRC = path.join(ROOT, "public", "grants-data.js");
const ORGS_SRC = path.join(ROOT, "public", "orgs-data.js");
const APP = path.join(ROOT, "public", "app.js");
const OUT = path.join(ROOT, "src", "benefits-context.js");
const OUT_LINKS = path.join(ROOT, "src", "links.js");

const ctx = { window: {}, document: {}, console };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(SRC, "utf8") +
    '\n;globalThis.__B = typeof BENEFITS !== "undefined" ? BENEFITS : null;' +
    '\n;globalThis.__BC_CITIES = typeof BC_CITIES !== "undefined" ? BC_CITIES : null;' +
    '\n;globalThis.__HELP = typeof HELP_ORGS !== "undefined" ? HELP_ORGS : null;' +
    // Province fallback maps. These are reached only through answer-dependent link
    // functions, so addLink() never saw them and skipped them silently — three of the six
    // values were unmonitored. They are a small fixed set of already-written URLs, so they
    // are registered directly rather than by evaluating a function with invented answers.
    '\n;globalThis.__STUDENT_AID = typeof STUDENT_AID !== "undefined" ? STUDENT_AID : null;' +
    '\n;globalThis.__TWO_ELEVEN = typeof TWO_ELEVEN !== "undefined" ? TWO_ELEVEN : null;' +
    '\n;globalThis.__EMPLOYMENT = typeof EMPLOYMENT !== "undefined" ? EMPLOYMENT : null;' +
    '\n;globalThis.__FED_STUDENT_AID = typeof FED_STUDENT_AID !== "undefined" ? FED_STUDENT_AID : null;' +
    '\n;globalThis.__NATIONAL_211 = typeof NATIONAL_211 !== "undefined" ? NATIONAL_211 : null;' +
    "\n" + fs.readFileSync(GRANTS_SRC, "utf8") +
    '\n;globalThis.__GRANTS = typeof GRANTS_DIRECTORY !== "undefined" ? GRANTS_DIRECTORY : null;' +
    "\n" + fs.readFileSync(ORGS_SRC, "utf8") +
    '\n;globalThis.__ORGS = typeof ORGS_DIRECTORY !== "undefined" ? ORGS_DIRECTORY : null;',
  ctx
);

const allBenefits = ctx.__B;
if (!Array.isArray(allBenefits) || allBenefits.length === 0) {
  console.error("gen:context — could not read BENEFITS from data.js");
  process.exit(1);
}

const appSource = fs.readFileSync(APP, "utf8");
const bcEnabledMatch = /^const BC_ENABLED = (true|false);\s*$/m.exec(appSource);
if (!bcEnabledMatch) {
  throw new Error("gen:context — could not find literal const BC_ENABLED = true/false in public/app.js");
}
const bcEnabled = bcEnabledMatch[1] === "true";
const bcCities = ctx.__BC_CITIES;
if (!Array.isArray(bcCities)) {
  throw new Error("gen:context — could not read BC_CITIES from data.js");
}
const benefitIsBritishColumbia = (b) =>
  b.level === "British Columbia" || b.level === "Metro Vancouver" || bcCities.includes(b.level);
const benefits = bcEnabled ? allBenefits : allBenefits.filter((b) => !benefitIsBritishColumbia(b));
const excludedBenefits = allBenefits.length - benefits.length;
console.log(
  `BC_ENABLED=${bcEnabled} - excluded ${excludedBenefits} British Columbia entries, ` +
    `generating ${benefits.length} ${bcEnabled ? "Alberta, British Columbia, and federal" : "Alberta and federal"} entries.`
);

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

const byId = new Map(benefits.map((b) => [b.id, b]));

// PRACTITIONER_FORMS lives in app.js, not data.js. It is the verified answer to
// "which form does my doctor sign" — the ungrounded model got this wrong too
// (it called T2201 the "Medical Certificate"). Pull just that object literal
// rather than evaluating app.js, which expects a DOM.
const formsMatch = /const PRACTITIONER_FORMS = (\{[\s\S]*?\});/.exec(appSource);
if (!formsMatch) {
  console.error("gen:context — could not find PRACTITIONER_FORMS in app.js");
  process.exit(1);
}
const forms = vm.runInNewContext(`(${formsMatch[1]})`);

const lines = benefits.map((b) => {
  const where = [b.level, b.category].filter(Boolean).join(" · ");
  return `- ${redactGroundingNarrative(clean(b.name))} [${where}] — ${redactGroundingNarrative(clean(b.summary))}`;
});

const formLines = Object.entries(forms).filter(([id]) => byId.has(id)).map(([id, label]) => {
  const name = clean(byId.get(id).name);
  return `- ${name}: a practitioner signs ${clean(label)}.`;
});

const body = lines.join("\n");
const formContext = formLines.join("\n");
assertGroundingNarrativeSafe(body, "always-sent benefit catalogue");

/* ---------------------------------------------------------------------------
   Per-benefit detail, retrieved on demand.

   Injecting all 20 benefits' detail into every request costs ~3.9k tokens and
   would cut the free allocation to ~73 questions/day. Matching the question and
   sending only what is relevant keeps it near ~134/day, on the same 10k Neurons.
--------------------------------------------------------------------------- */

/** Search keys for a benefit: id, acronym, full name, and any form code. */
function keysFor(b) {
  const keys = new Set();
  const id = String(b.id || "");
  if (id) {
    keys.add(id.toLowerCase());
    if (id.includes("-")) keys.add(id.replace(/-/g, " ").toLowerCase());
  }
  const name = clean(b.name);
  // "Assured Income for the Severely Handicapped (AISH)" -> "AISH" + the long name
  const paren = /\(([^)]+)\)/.exec(name);
  if (paren && paren[1].length >= 3) keys.add(paren[1].toLowerCase());
  const bare = name.replace(/\s*\([^)]*\)\s*/g, " ").trim().toLowerCase();
  if (bare.length >= 6) keys.add(bare);
  // Form codes ("T2201") route form questions to the right benefit.
  const form = forms[b.id];
  if (form) for (const m of String(form).matchAll(/\b([A-Z]\d{3,})\b/g)) keys.add(m[1].toLowerCase());
  return [...keys].filter((k) => k.length >= 3);
}

const details = {};
for (const b of benefits) {
  const d = b.detail || {};
  const parts = [];
  if (d.about) parts.push(`What it is: ${redactGroundingNarrative(clean(d.about))}`);
  if (d.steps?.length)
    parts.push(`How to apply:\n${d.steps.map((s, i) => `  ${i + 1}. ${redactGroundingNarrative(clean(s))}`).join("\n")}`);
  if (d.documents?.length)
    parts.push(`What you need:\n${d.documents.map((s) => `  - ${redactGroundingNarrative(clean(s))}`).join("\n")}`);
  if (d.tips?.length)
    parts.push(`Practical tips:\n${d.tips.map((s) => `  - ${redactGroundingNarrative(clean(s))}`).join("\n")}`);
  if (d.time) parts.push(`How long it takes (verified — you may state this): ${redactGroundingNarrative(clean(d.time))}`);
  if (!parts.length) continue;
  const text = parts.join("\n");
  assertGroundingNarrativeSafe(text, `${b.id} detail grounding`);
  details[b.id] = {
    name: redactGroundingNarrative(clean(b.name)),
    keys: keysFor(b),
    text,
    ...(d.phone ? { phone: clean(d.phone) } : {}),
  };
}

const scope = {
  bcEnabled,
  label: bcEnabled
    ? "Alberta, British Columbia, and federal Canada"
    : "Alberta and federal Canada",
  provinces: bcEnabled ? ["Alberta", "British Columbia"] : ["Alberta"],
};

const out = `// GENERATED FILE — DO NOT EDIT BY HAND.
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

fs.writeFileSync(OUT, out);
const detailChars = Object.values(details).reduce((a, d) => a + d.text.length, 0);
console.log(
  `gen:context — wrote ${path.relative(ROOT, OUT)}\n` +
    `  catalog: ${body.length} chars (always sent)\n` +
    `  details: ${Object.keys(details).length} benefits, ${detailChars} chars total, ` +
    `~${Math.round(detailChars / Object.keys(details).length)} each (sent on match)`
);

/* ---------------------------------------------------------------------------
   src/links.js — every official link we send people to, for the Phase 5A
   monitor. These carry the whole "how do I get it?" promise and rot silently.

   URLs can be functions of the user's answers (city-specific pages). A function
   may expose a safe staticUrl for monitoring; otherwise it cannot be checked
   without inventing a user, so it is skipped and counted rather than silently
   dropped.
--------------------------------------------------------------------------- */
// Link derivation lives in scripts/link-sources.js so this generator and the guard in
// test/data-procedure.test.js cannot disagree about it. They used to keep separate copies
// and drifted in #193.
const { links, skippedDynamic } = buildLinkCatalogue({
  benefits,
  helpOrgs: ctx.__HELP,
  grants: ctx.__GRANTS || [],
  orgs: ctx.__ORGS || [],
  studentAid: ctx.__STUDENT_AID,
  twoEleven: ctx.__TWO_ELEVEN,
  employment: ctx.__EMPLOYMENT,
  fedStudentAid: ctx.__FED_STUDENT_AID,
  national211: ctx.__NATIONAL_211,
});

const linksOut = `// GENERATED FILE — DO NOT EDIT BY HAND.
// Regenerate with:  npm run gen:context
// Sources of truth: public/data.js (BENEFITS.applyUrl/.source, HELP_ORGS),
// public/grants-data.js (GRANTS_DIRECTORY), public/orgs-data.js (ORGS_DIRECTORY)
//
// ${links.length} links. The monitor checks a bounded rotating batch every
// three hours, so this catalog can grow past the Workers FREE plan's 50
// external-subrequest per-invocation limit without dropping coverage.
// ${skippedDynamic} dynamic (function) URLs are skipped — they depend on the
// user's answers and expose no safe static URL to check.

export const LINKS = ${JSON.stringify(links, null, 2)};

export const SKIPPED_DYNAMIC = ${skippedDynamic};
`;

fs.writeFileSync(OUT_LINKS, linksOut);
console.log(
  `gen:context — wrote ${path.relative(ROOT, OUT_LINKS)}\n` +
  `  ${links.length} checkable links (rotating monitor batches them safely)` +
    `\n  ${skippedDynamic} dynamic URLs skipped (no safe static URL)`
);
