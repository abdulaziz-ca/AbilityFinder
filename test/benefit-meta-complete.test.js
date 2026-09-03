"use strict";

// Ticket #202: every benefit must show the "at a glance" difficulty / apply-time /
// wait row, so every benefit needs a BENEFIT_META entry with all three fields.
// This guards against a newly-added benefit silently shipping without the row.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const ctx = { window: {}, document: {}, console };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(ROOT, "public", "data.js"), "utf8") +
    "\n;globalThis.__B = BENEFITS; globalThis.__M = BENEFIT_META;",
  ctx
);
const BENEFITS = ctx.__B;
const BENEFIT_META = ctx.__M;

test("every benefit has a complete BENEFIT_META row (difficulty/effort/wait)", () => {
  assert.ok(BENEFITS.length >= 100, `Expected the full catalogue, found ${BENEFITS.length}`);

  const problems = [];
  for (const b of BENEFITS) {
    const m = BENEFIT_META[b.id];
    if (!m) {
      problems.push(`${b.id}: no BENEFIT_META entry`);
      continue;
    }
    if (!Number.isInteger(m.difficulty) || m.difficulty < 1 || m.difficulty > 5) {
      problems.push(`${b.id}: difficulty must be an integer 1-5 (got ${JSON.stringify(m.difficulty)})`);
    }
    if (typeof m.effort !== "string" || !m.effort.trim()) {
      problems.push(`${b.id}: effort must be a non-empty string`);
    }
    if (typeof m.wait !== "string" || !m.wait.trim()) {
      problems.push(`${b.id}: wait must be a non-empty string`);
    }
  }

  assert.equal(
    problems.length,
    0,
    `Every benefit must show the at-a-glance row. Add a BENEFIT_META entry ` +
      `{ difficulty: 1-5, effort: "...", wait: "..." } for:\n  ${problems.join("\n  ")}`
  );
});
