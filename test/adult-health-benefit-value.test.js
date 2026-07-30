"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const TARGET_ID = "adult-health-benefit";

function loadData() {
  const source = fs.readFileSync(path.join(ROOT, "public", "data.js"), "utf8");
  const context = { window: {}, document: {}, navigator: {}, console };
  vm.runInNewContext(
    `${source}
    ;globalThis.__captured = {
      BENEFITS,
      BENEFIT_VALUES,
      BENEFIT_VERIFIED,
      benefit: BENEFITS.find((item) => item.id === ${JSON.stringify(TARGET_ID)}),
    };`,
    context,
    { filename: "public/data.js" }
  );
  return context.__captured;
}

const { BENEFITS, BENEFIT_VALUES, BENEFIT_VERIFIED, benefit } = loadData();
const value = BENEFIT_VALUES[TARGET_ID];

test("no unsupported annual amount remains on any Adult Health Benefit surface", () => {
  const surfaces = [
    benefit.name,
    benefit.amount,
    benefit.summary,
    benefit.note,
    benefit.detail.about,
    ...benefit.detail.steps,
    ...benefit.detail.documents,
    ...benefit.detail.tips,
    JSON.stringify(value),
  ].join("\n");

  assert.doesNotMatch(surfaces, /\$\s?[0-9][0-9,]*/);
  assert.doesNotMatch(surfaces, /1,000/);
});

test("the structured value carries no monetary fields", () => {
  assert.equal(value.kind, "coverage");

  for (const field of [
    "annualMax",
    "annualMin",
    "monthlyMax",
    "monthlyMin",
    "lifetimeMax",
  ]) {
    assert.equal(Object.prototype.hasOwnProperty.call(value, field), false);
  }
});

test("the replacement wording states that no value is published", () => {
  assert.match(value.note, /no annual dollar value/i);

  for (const coverage of [
    "prescriptions",
    "dental",
    "optical",
    "ambulance",
    "diabetes",
  ]) {
    assert.match(value.note, new RegExp(coverage, "i"));
  }
});

test("the static guide and assistant grounding carry no dollar figure", () => {
  const guide = fs.readFileSync(
    path.join(ROOT, "public", "guides", "adult-health-benefit.html"),
    "utf8"
  );
  const assistantGrounding = fs.readFileSync(
    path.join(ROOT, "src", "benefits-context.js"),
    "utf8"
  );

  assert.doesNotMatch(guide, /\$\s?[0-9]/);

  const sectionStart = assistantGrounding.indexOf("Alberta Adult Health Benefit");
  assert.notEqual(sectionStart, -1);
  const adultHealthSection = assistantGrounding.slice(sectionStart, sectionStart + 400);
  assert.doesNotMatch(adultHealthSection, /\$\s?[0-9]/);
});

test("matcher gates and routing are unchanged", () => {
  assert.deepEqual(Array.from(benefit.requires), [
    "adult",
    "ab",
    "citizenPR",
    "adultHealthIncome",
    "adultHealthGateway",
  ]);
});

test("the record is dated", () => {
  assert.equal(BENEFIT_VERIFIED[TARGET_ID], "2026-07");
});

test("legitimate dollar values on other benefits are untouched", () => {
  const rdsp = BENEFITS.find((item) =>
    item.name.includes("Registered Disability Savings Plan")
  );
  const dentalSupplement = BENEFITS.find((item) =>
    item.id.includes("dental-supplement")
  );
  const homeRenovationCredit = BENEFITS.find((item) =>
    item.id === "bc-home-reno-tax-credit"
  );

  assert.ok(rdsp, "expected to find the RDSP record");
  assert.ok(dentalSupplement, "expected to find the BC dental supplement record");
  assert.ok(
    homeRenovationCredit,
    "expected to find the BC home renovation credit record"
  );

  assert.match(rdsp.amount, /\$1,000 bond/);
  assert.match(dentalSupplement.amount, /\$1,000 per 2 calendar years/);
  assert.match(homeRenovationCredit.amount, /Up to \$1,000 per year/);
});
