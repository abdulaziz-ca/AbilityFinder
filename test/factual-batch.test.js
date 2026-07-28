"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function loadData() {
  const source = fs.readFileSync(path.join(ROOT, "public", "data.js"), "utf8");
  const context = { window: {}, document: {}, navigator: {}, console };
  vm.runInNewContext(
    `${source}
    ;globalThis.__captured = { BENEFITS, BENEFIT_VALUES, BENEFIT_META };`,
    context,
    { filename: "public/data.js" }
  );
  return context.__captured;
}

const { BENEFITS, BENEFIT_VALUES, BENEFIT_META } = loadData();

function benefitById(id) {
  return BENEFITS.find((benefit) => benefit.id === id);
}

function joinedBenefitText(benefit) {
  return [
    benefit.amount,
    benefit.summary,
    benefit.note,
    benefit.detail && benefit.detail.about,
    ...((benefit.detail && benefit.detail.tips) || []),
  ].filter(Boolean).join("\n");
}

test("DATA-07: Calgary shows the current 2026 transit bands", () => {
  const benefit = benefitById("calgary-fair-entry");
  assert.ok(benefit, "calgary-fair-entry record was found");
  const value = BENEFIT_VALUES["calgary-fair-entry"];
  assert.ok(value, "calgary-fair-entry BENEFIT_VALUES entry was found");

  const text = [joinedBenefitText(benefit), value.note].filter(Boolean).join("\n");
  assert.match(text, /6\.30/);
  assert.match(text, /44\.10/);
  assert.match(text, /63/);
  assert.doesNotMatch(text, /5\.90/);
  assert.doesNotMatch(text, /\$59\b/);
  assert.doesNotMatch(text, /600\+/);
});

test("DATA-08: Edmonton states the real processing time", () => {
  const benefit = benefitById("edmonton-fare-assistance");
  assert.ok(benefit, "edmonton-fare-assistance record was found");
  assert.ok(BENEFIT_META["edmonton-fare-assistance"], "edmonton-fare-assistance metadata was found");

  assert.equal(BENEFIT_META["edmonton-fare-assistance"].wait, "8–12 weeks");
  assert.match(benefit.detail.time, /8 to 12 weeks/);
  assert.match(benefit.detail.time, /10 more business days/);
  assert.doesNotMatch(benefit.detail.time, /couple of weeks/i);
});

test("DATA-09: the AISH/ADAP number is labelled as Alberta labels it", () => {
  for (const id of ["adap", "aish"]) {
    const benefit = benefitById(id);
    assert.ok(benefit, `${id} record was found`);
    assert.match(benefit.detail.phone, /DIA Application Processing Centre/);
    assert.ok(benefit.detail.phone.includes("1-877-759-6810"));
    assert.doesNotMatch(benefit.detail.phone, /Alberta Supports: 1-877-759-6810/);
  }
});

test("no other record's figures were disturbed", () => {
  const medicineHat = benefitById("medicinehat-fair-entry");
  assert.ok(medicineHat, "medicinehat-fair-entry record was found");
  assert.match(medicineHat.amount, /\$630/);

  const grandePrairie = benefitById("grandeprairie-aish-pass");
  assert.ok(grandePrairie, "grandeprairie-aish-pass record was found");
  assert.match(grandePrairie.amount, /\$10\.25/);

  const woodBuffalo = benefitById("woodbuffalo-lift");
  assert.ok(woodBuffalo, "woodbuffalo-lift record was found");
  assert.match(woodBuffalo.amount, /\$10\/month/);

  const recreationPercentageRecords = BENEFITS.filter((benefit) =>
    joinedBenefitText(benefit).includes("75%")
  );
  assert.ok(
    recreationPercentageRecords.length >= 5,
    `expected at least 5 records containing 75%, found ${recreationPercentageRecords.length}`
  );
});
