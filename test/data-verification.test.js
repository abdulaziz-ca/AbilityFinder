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
    console,
  };
  vm.runInNewContext(
    `${source}\n;globalThis.__captured = { BENEFITS, BENEFIT_VERIFIED, HELP_ORGS };`,
    context,
    { filename: "public/data.js" }
  );
  return context.__captured;
}

const { BENEFITS, BENEFIT_VERIFIED, HELP_ORGS } = loadDataForTest();

test("benefit review dates use month granularity", () => {
  assert.equal(typeof BENEFIT_VERIFIED, "object");
  assert.notEqual(BENEFIT_VERIFIED, null);
  for (const value of Object.values(BENEFIT_VERIFIED)) {
    assert.match(value, /^[0-9]{4}-[0-9]{2}$/);
    assert.equal(value, "2026-07");
  }
});

test("every benefit review-date key names a catalog benefit", () => {
  const benefitIds = new Set(BENEFITS.map((benefit) => benefit.id));
  for (const id of Object.keys(BENEFIT_VERIFIED)) {
    assert.ok(benefitIds.has(id), `Unknown benefit review-date key: ${id}`);
  }
});

test("benefit review dates are consolidated outside benefit objects", () => {
  for (const benefit of BENEFITS) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(benefit, "verified"),
      false,
      `Benefit still has a verified property: ${benefit.id}`
    );
  }
});

test("help organization verification dates remain intact", () => {
  assert.ok(
    HELP_ORGS.some((organization) => Object.prototype.hasOwnProperty.call(organization, "verified")),
    "Expected at least one help organization to retain its verified property"
  );
});
