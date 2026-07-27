"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function loadDataForTest() {
  const source = fs.readFileSync(path.join(ROOT, "public", "data.js"), "utf8");
  const context = {
    window: {},
    document: {},
    navigator: {},
    console,
  };
  vm.runInNewContext(
    source + "\n;globalThis.__captured = { BENEFITS, BENEFIT_VALUES };",
    context,
    { filename: "public/data.js" }
  );
  return context.__captured;
}

const BC_VALUE_IDS = [
  "bc-disability-assistance-pwd",
  "bc-cy-disability-benefit",
  "bc-monthly-nutritional-supplement",
  "bc-autism-funding-under-6",
  "bc-autism-funding-6-18",
  "bc-csg-students-disabilities",
  "bc-csg-services-equipment",
  "bc-access-grant-students-disabilities",
  "bc-supplemental-bursary-students-disabilities",
  "bc-assistance-program-students-disabilities",
  "bc-learning-disability-assessment-bursary",
  "bc-access-grant-deaf-students",
  "bc-home-reno-tax-credit",
  "bc-sales-tax-credit",
  "bc-property-tax-deferment-disabilities",
  "bc-fair-pharmacare",
  "bc-pharmacare-plan-c",
  "bc-healthy-kids",
  "bc-dental-supplement",
  "bc-optical-supplement",
  "bc-medical-equipment-devices",
  "bc-medical-transportation",
  "bc-at-home-medical",
  "bc-at-home-saet",
  "bc-bus-pass",
  "handydart-translink",
  "handycard-translink",
  "taxisaver-translink",
  "handydart-bctransit",
  "taxi-saver-bctransit",
  "bc-fuel-tax-refund-disabilities",
  "bc-icbc-disability-discount",
  "vancouver-leisure-access",
  "surrey-leisure-access",
  "burnaby-fair-play",
  "richmond-rec-fee-subsidy",
  "victoria-life",
  "saanich-life",
  "kelowna-recreation-assistance",
  "coquitlam-far",
  "kamloops-arch",
  "bc-clbc",
  "bc-supported-child-development",
  "bc-workbc-assistive-technology",
  "bc-workbc-employment-services",
  "bc-work-able-internship",
  "bc-pwd-designation",
  "sparc-parking-permit",
];

const ALLOWED_KINDS = new Set([
  "cash",
  "grant",
  "taxCredit",
  "coverage",
  "discount",
  "access",
  "services",
]);

const { BENEFITS, BENEFIT_VALUES } = loadDataForTest();

test("all 48 BC benefits have typed structured values", () => {
  assert.equal(BC_VALUE_IDS.length, 48);
  const benefitIds = new Set(BENEFITS.map((benefit) => benefit.id));

  for (const id of BC_VALUE_IDS) {
    assert.ok(benefitIds.has(id), "Missing BC benefit catalog entry: " + id);
    assert.ok(BENEFIT_VALUES[id], "Missing BENEFIT_VALUES entry: " + id);
  }
});

test("all BC structured values are estimate-excluded and use an allowed kind", () => {
  for (const id of BC_VALUE_IDS) {
    const value = BENEFIT_VALUES[id];
    assert.equal(value.excludeFromEstimate, true, id + " must be excluded from estimates");
    assert.ok(ALLOWED_KINDS.has(value.kind), id + " has invalid kind: " + value.kind);
  }
});

test("all published BC annual and monthly maxima are positive finite numbers", () => {
  for (const id of BC_VALUE_IDS) {
    const value = BENEFIT_VALUES[id];
    for (const field of ["annualMax", "monthlyMax"]) {
      if (!Object.prototype.hasOwnProperty.call(value, field)) continue;
      assert.equal(Number.isFinite(value[field]), true, id + "." + field + " must be finite");
      assert.ok(value[field] > 0, id + "." + field + " must be greater than zero");
    }
  }
});

test("BC StudentAid entries match their federal equivalents", () => {
  assert.equal(
    BENEFIT_VALUES["bc-csg-students-disabilities"].annualMax,
    BENEFIT_VALUES["csg-disability"].annualMax
  );
  assert.equal(BENEFIT_VALUES["bc-csg-students-disabilities"].annualMax, 2800);
  assert.equal(
    BENEFIT_VALUES["bc-csg-services-equipment"].annualMax,
    BENEFIT_VALUES["csg-dse"].annualMax
  );
  assert.equal(BENEFIT_VALUES["bc-csg-services-equipment"].annualMax, 20000);
});

test("specific verified BC figures are preserved exactly", () => {
  assert.equal(BENEFIT_VALUES["bc-disability-assistance-pwd"].monthlyMax, 1535.5);
  assert.equal(BENEFIT_VALUES["bc-cy-disability-benefit"].annualMax, 17000);
  assert.equal(BENEFIT_VALUES["bc-autism-funding-under-6"].annualMax, 22000);
  assert.equal(BENEFIT_VALUES["bc-autism-funding-6-18"].annualMax, 6000);
  assert.equal(BENEFIT_VALUES["bc-access-grant-students-disabilities"].annualMax, 1560);
  assert.equal(BENEFIT_VALUES["bc-home-reno-tax-credit"].annualMax, 1000);
  assert.equal(BENEFIT_VALUES["bc-sales-tax-credit"].annualMax, 75);
});

test("priority scoring keeps estimate-excluded values neutral", () => {
  const source = fs.readFileSync(path.join(ROOT, "public", "app.js"), "utf8");
  assert.ok(source.includes("if (v.excludeFromEstimate) return ease;"));
});
