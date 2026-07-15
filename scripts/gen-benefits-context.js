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

const ctx = { window: {}, document: {}, console };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(SRC, "utf8") +
    '\n;globalThis.__B = typeof BENEFITS !== "undefined" ? BENEFITS : null;',
  ctx
);

const benefits = ctx.__B;
if (!Array.isArray(benefits) || benefits.length === 0) {
  console.error("gen:context — could not read BENEFITS from data.js");
  process.exit(1);
}

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

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

const out = `// GENERATED FILE — DO NOT EDIT BY HAND.
// Regenerate with:  npm run gen:context
// Source of truth:  public/data.js (the BENEFITS array)
//
// ${benefits.length} benefits. Names/levels/categories/summaries only — no
// amounts or cutoffs on purpose, so the assistant cannot quote a figure at all
// and must send people to the guide, which has the verified numbers.

export const BENEFITS_CONTEXT = ${JSON.stringify(body)};

export const BENEFIT_COUNT = ${benefits.length};
`;

fs.writeFileSync(OUT, out);
console.log(
  `gen:context — wrote ${path.relative(ROOT, OUT)} (${benefits.length} benefits, ${body.length} chars)`
);
