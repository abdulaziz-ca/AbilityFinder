"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const TARGET_ID = "bc-access-grant-deaf-students";
const PROGRAM_URL =
  "https://studentaidbc.ca/explore/grants-scholarships/bc-access-grant-deaf-students";
const POLICY_URL =
  "https://studentaidbc.ca/sites/all/files/school-officials/policy_manual_26_27.pdf";

function loadTarget() {
  const source = fs.readFileSync(path.join(ROOT, "public", "data.js"), "utf8");
  const context = { window: {}, document: {}, navigator: {}, console };
  vm.runInNewContext(
    `${source}
    ;globalThis.__captured = {
      benefit: BENEFITS.find((item) => item.id === ${JSON.stringify(TARGET_ID)}),
      value: BENEFIT_VALUES[${JSON.stringify(TARGET_ID)}],
    };`,
    context,
    { filename: "public/data.js" }
  );
  return context.__captured;
}

const { benefit, value } = loadTarget();
const guide = fs.readFileSync(
  path.join(ROOT, "public", "guides", `${TARGET_ID}.html`),
  "utf8"
);

test("Deaf Students grant displays the assessed annual cap without promising it", () => {
  assert.equal(
    benefit.amount,
    "Up to $30,000 per program year, based on financial need assessed by StudentAid BC"
  );
  assert.match(guide, /Up to \$30,000 per program year, based on financial need assessed by StudentAid BC/);
  assert.doesNotMatch(`${benefit.amount}\n${guide}`, /guaranteed|will receive|receives? \$30,000/i);
});

test("Deaf Students structured value preserves estimate exclusion and the exact cap", () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(value)),
    {
      kind: "grant",
      excludeFromEstimate: true,
      annualMax: 30000,
      note: "up to $30,000 per program year, based on StudentAid BC-assessed financial need",
    }
  );
});

test("Deaf Students record and guide contain no unpublished-amount wording", () => {
  assert.doesNotMatch(JSON.stringify(benefit), /amount not published|not published|unpublished/i);
  assert.doesNotMatch(guide, /amount not published|not published|unpublished/i);
});

test("Deaf Students guide exposes the distinct official program and policy links", () => {
  assert.equal(benefit.applyUrl, PROGRAM_URL);
  assert.equal(benefit.source, POLICY_URL);
  assert.match(guide, new RegExp(PROGRAM_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(guide, new RegExp(POLICY_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(guide, /Learn more at StudentAid BC/);
  assert.match(guide, /Official government source/);
});

test("Deaf Students matcher requirements remain exact", () => {
  assert.deepEqual(
    Array.from(benefit.requires),
    ["bc", "student", "disabilityDoc", "hearingDisability"]
  );
});
