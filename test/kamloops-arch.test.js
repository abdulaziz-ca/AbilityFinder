"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const TARGET_ID = "kamloops-arch";
const CANONICAL_URL =
  "https://www.kamloops.ca/recreation-culture/programs-activities/accessible-recreation/arch-program";

function loadTarget() {
  const source = fs.readFileSync(path.join(ROOT, "public", "data.js"), "utf8");
  const context = { window: {}, document: {}, navigator: {}, console };
  vm.runInNewContext(
    `${source}
    ;globalThis.__captured = {
      benefit: BENEFITS.find((item) => item.id === ${JSON.stringify(TARGET_ID)}),
      verified: BENEFIT_VERIFIED[${JSON.stringify(TARGET_ID)}],
    };`,
    context,
    { filename: "public/data.js" }
  );
  return context.__captured;
}

const { benefit, verified } = loadTarget();

test("ARCH-only applicants are not promised KamPASS", () => {
  assert.doesNotMatch(benefit.summary, /also gets you/);
  assert.doesNotMatch(benefit.note, /also gets you/);
  assert.doesNotMatch(benefit.summary, /so one form covers both/);
  assert.doesNotMatch(benefit.note, /so one form covers both/);
  assert.match(benefit.note, /does not establish that you are eligible for KamPASS/);
  assert.doesNotMatch(JSON.stringify(benefit), /same application also gets/i);
});

test("the shared application is described as one form, two programs", () => {
  assert.match(benefit.detail.about, /two separate programs that share one application process/);
  assert.match(benefit.detail.about, /automatically considered for both/);
  assert.match(benefit.detail.about, /Approval for ARCH does not establish KamPASS eligibility/);
});

test("KamPASS-excluded groups are surfaced, including PWD disability assistance", () => {
  assert.ok(
    benefit.detail.tips.some((tip) =>
      tip.includes("Employment and Assistance for Persons with Disabilities Act")
    )
  );
  assert.ok(
    benefit.detail.tips.some((tip) =>
      tip.includes("Ministry of Social Development and Poverty Reduction")
    )
  );
  const tips = benefit.detail.tips.join("\n");
  for (const phrase of [
    "Provincial BC Bus Pass for Seniors and Others",
    "School District No. 73",
    "U-PASS",
    "CNIB",
    "Low Income Cut-Offs",
  ]) {
    assert.ok(tips.includes(phrase));
  }
});

test("KamPASS-eligible applicants still see that both are possible", () => {
  assert.match(benefit.summary, /KamPASS/);
  assert.match(benefit.detail.about, /qualified participants can use both programs or just one/);
});

test("matcher behaviour is untouched", () => {
  assert.deepEqual(Array.from(benefit.requires), ["bc", "kamloops", "lowIncome"]);
});

test("official links are canonical and the record is dated", () => {
  assert.equal(benefit.applyUrl, CANONICAL_URL);
  assert.equal(benefit.source, CANONICAL_URL);
  assert.equal(verified, "2026-07");
});
