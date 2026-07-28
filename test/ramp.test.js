"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const TARGET_ID = "ramp";
const CANONICAL_URL =
  "https://www.alberta.ca/residential-access-modification-program";

function loadCatalogue() {
  const source = fs.readFileSync(path.join(ROOT, "public", "data.js"), "utf8");
  const context = { window: {}, document: {}, navigator: {}, console };
  vm.runInNewContext(
    `${source}
    ;globalThis.__captured = {
      benefits: BENEFITS,
      values: BENEFIT_VALUES,
      meta: BENEFIT_META,
      verified: BENEFIT_VERIFIED,
    };`,
    context,
    { filename: "public/data.js" }
  );
  return context.__captured;
}

const {
  benefits: BENEFITS,
  values: BENEFIT_VALUES,
  meta: BENEFIT_META,
  verified: BENEFIT_VERIFIED,
} = loadCatalogue();
const benefit = BENEFITS.find((item) => item.id === TARGET_ID);

test("the record exists with the official amounts", () => {
  assert.ok(benefit);
  assert.match(benefit.amount, /\$12,000/);
  assert.match(benefit.amount, /\$24,000/);
  assert.match(benefit.amount, /10 years/);
  assert.match(benefit.detail.time, /30 days/);
});

test("every dollar figure on the record is one Alberta actually publishes", () => {
  const searchableText = [
    benefit.name,
    benefit.amount,
    benefit.summary,
    benefit.note,
    benefit.requiresNote,
    benefit.detail.about,
    ...benefit.detail.steps,
    ...benefit.detail.documents,
    ...benefit.detail.tips,
    BENEFIT_VALUES[TARGET_ID].note,
  ].join("\n");
  const actualFigures = new Set(searchableText.match(/\$[\d,]+/g) || []);
  const officialFigures = new Set([
    "$12,000",
    "$24,000",
    "$36,900",
    "$94,500",
    "$7,131",
    "$1,200",
  ]);

  assert.deepEqual([...actualFigures].sort(), [...officialFigures].sort());
});

test("the structured value cannot inflate any estimate", () => {
  const value = BENEFIT_VALUES[TARGET_ID];

  assert.equal(value.kind, "grant");
  assert.equal(value.excludeFromEstimate, true);
  assert.equal(value.annualMax, 12000);
  assert.equal(Object.prototype.hasOwnProperty.call(value, "lifetimeMax"), false);
});

test("the matcher gates are conservative and do not gate on the income band", () => {
  assert.deepEqual(Array.from(benefit.requires), [
    "ab",
    "citizenPR",
    "homeAccessNeed",
    "rampMobilityRoute",
    "rampIncomeAndResidency",
  ]);
  assert.equal(benefit.requires.includes("lowIncome"), false);
});

test("the record is dated and points at the official page", () => {
  assert.equal(BENEFIT_VERIFIED[TARGET_ID], "2026-07");
  assert.equal(benefit.applyUrl, CANONICAL_URL);
  assert.equal(benefit.source, CANONICAL_URL);
});

test("the catalogue grew by exactly one and ids stay unique", () => {
  assert.equal(BENEFITS.length, 85);
  const ids = BENEFITS.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length);
});

// Loading BENEFIT_META above is intentional: the regression harness verifies
// that all four public data registries remain executable in the VM context.
assert.ok(BENEFIT_META);
