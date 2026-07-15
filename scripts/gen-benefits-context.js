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

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "data.js");
const APP = path.join(ROOT, "public", "app.js");
const OUT = path.join(ROOT, "src", "benefits-context.js");
const OUT_LINKS = path.join(ROOT, "src", "links.js");

const ctx = { window: {}, document: {}, console };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(SRC, "utf8") +
    '\n;globalThis.__B = typeof BENEFITS !== "undefined" ? BENEFITS : null;' +
    '\n;globalThis.__HELP = typeof HELP_ORGS !== "undefined" ? HELP_ORGS : null;',
  ctx
);

const benefits = ctx.__B;
if (!Array.isArray(benefits) || benefits.length === 0) {
  console.error("gen:context — could not read BENEFITS from data.js");
  process.exit(1);
}

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

/**
 * Strip figures out of grounding text.
 *
 * The blanket rule "never state a dollar amount" is one a small model can
 * actually follow; a conditional one ("only if it appears verbatim above") is
 * exactly the kind it fumbles. So we keep the rule absolute and make it true by
 * construction — the model is never shown a figure it could quote or, worse,
 * misattribute from one benefit to another. The sentence still explains the
 * concept, and the guide (which has the checked number) is one click away.
 *
 * Deliberately does NOT touch phone numbers: they carry no $ or % and don't
 * match the thousands pattern.
 */
const redactFigures = (s) =>
  String(s ?? "")
    .replace(/\$\s?[\d,]+(?:\.\d+)?/g, "[amount — see the guide]")
    .replace(/\b\d+(?:\.\d+)?\s?%/g, "[percentage — see the guide]")
    .replace(/\b\d{1,3},\d{3}\b/g, "[amount — see the guide]");

const byId = new Map(benefits.map((b) => [b.id, b]));

// PRACTITIONER_FORMS lives in app.js, not data.js. It is the verified answer to
// "which form does my doctor sign" — the ungrounded model got this wrong too
// (it called T2201 the "Medical Certificate"). Pull just that object literal
// rather than evaluating app.js, which expects a DOM.
const formsMatch = /const PRACTITIONER_FORMS = (\{[\s\S]*?\});/.exec(
  fs.readFileSync(APP, "utf8")
);
if (!formsMatch) {
  console.error("gen:context — could not find PRACTITIONER_FORMS in app.js");
  process.exit(1);
}
const forms = vm.runInNewContext(`(${formsMatch[1]})`);

const lines = benefits.map((b) => {
  const where = [b.level, b.category].filter(Boolean).join(" · ");
  return `- ${clean(b.name)} [${where}] — ${clean(b.summary)}`;
});

const formLines = Object.entries(forms).map(([id, label]) => {
  const name = byId.has(id) ? clean(byId.get(id).name) : id;
  return `- ${name}: a practitioner signs ${clean(label)}.`;
});

const body =
  lines.join("\n") +
  "\n\nFORMS A PRACTITIONER MUST SIGN (the only form names you may state):\n" +
  formLines.join("\n");

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
  if (d.about) parts.push(`What it is: ${redactFigures(clean(d.about))}`);
  if (d.steps?.length)
    parts.push(`How to apply:\n${d.steps.map((s, i) => `  ${i + 1}. ${redactFigures(clean(s))}`).join("\n")}`);
  if (d.documents?.length)
    parts.push(`What you need:\n${d.documents.map((s) => `  - ${redactFigures(clean(s))}`).join("\n")}`);
  if (d.tips?.length)
    parts.push(`Practical tips:\n${d.tips.map((s) => `  - ${redactFigures(clean(s))}`).join("\n")}`);
  if (d.time) parts.push(`How long it takes (verified — you may state this): ${redactFigures(clean(d.time))}`);
  if (d.phone) parts.push(`Phone (this exact number is verified — you may give it): ${clean(d.phone)}`);
  if (!parts.length) continue;
  details[b.id] = { name: clean(b.name), keys: keysFor(b), text: parts.join("\n") };
}

const out = `// GENERATED FILE — DO NOT EDIT BY HAND.
// Regenerate with:  npm run gen:context
// Sources of truth: public/data.js (BENEFITS) + public/app.js (PRACTITIONER_FORMS)
//
// ${benefits.length} benefits. Figures are redacted on purpose — the assistant is
// told never to state an amount, and the surest way to hold a small model to
// that is to never show it one. It explains the concept and points at the guide.

/** Always injected: the catalog of what exists + the verified form names. */
export const BENEFITS_CONTEXT = ${JSON.stringify(body)};

/** Injected only when the question matches — see retrieveDetails() in index.js. */
export const BENEFIT_DETAILS = ${JSON.stringify(details, null, 2)};

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

   applyUrl can be a function of the user's answers (city-specific pages); those
   cannot be checked without inventing a user, so they are skipped and counted
   rather than silently dropped.
--------------------------------------------------------------------------- */
const links = [];
const seen = new Set();
let skippedDynamic = 0;

const addLink = (url, label, kind) => {
  if (typeof url === "function") { skippedDynamic++; return; }
  if (typeof url !== "string" || !url.startsWith("http")) return;
  if (seen.has(url)) return;
  seen.add(url);
  links.push({ url, label: clean(label), kind });
};

for (const b of benefits) {
  addLink(b.applyUrl, `${clean(b.name)} — apply`, "apply");
  addLink(b.source, `${clean(b.name)} — official source`, "source");
}

// Help orgs are the "talk to a human" escape hatch; a dead one is just as bad.
const help = ctx.__HELP;
if (help) {
  const orgs = Array.isArray(help) ? help : Object.values(help).flat();
  for (const o of orgs) if (o && o.url) addLink(o.url, `Help — ${clean(o.name || o.url)}`, "help");
}

const linksOut = `// GENERATED FILE — DO NOT EDIT BY HAND.
// Regenerate with:  npm run gen:context
// Sources of truth: public/data.js (BENEFITS.applyUrl/.source, HELP_ORGS)
//
// ${links.length} links. The Workers FREE plan caps subrequests at 50 per
// invocation, so this must stay under that or the check needs chunking across
// runs. Currently ${links.length}/50.
// ${skippedDynamic} dynamic (function) applyUrls are skipped — they depend on the
// user's answers, so there is no single URL to check.

export const LINKS = ${JSON.stringify(links, null, 2)};

export const SKIPPED_DYNAMIC = ${skippedDynamic};
`;

fs.writeFileSync(OUT_LINKS, linksOut);
console.log(
  `gen:context — wrote ${path.relative(ROOT, OUT_LINKS)}\n` +
    `  ${links.length} checkable links (subrequest cap is 50/invocation)` +
    (links.length > 50 ? "  *** OVER THE CAP — needs chunking ***" : "  — fits in one run") +
    `\n  ${skippedDynamic} dynamic applyUrls skipped (depend on user answers)`
);
