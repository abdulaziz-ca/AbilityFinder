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

/* Every month in here corresponds to an actual substantive official-source review.
   DATA-10's rule is that a review date "advances only after substantive
   official-source review", and its regression requirement is a test that
   generation cannot advance dates. An allowlist keeps that tripwire: a date in a
   month not listed here fails until someone consciously adds the month, which is
   the moment to ask whether a real review actually happened. It is deliberately
   NOT a free-form "any past month" check — that would let a date drift forward
   silently, which is the exact defect DATA-10 was raised about.

   - 2026-07: the catalog-wide review sweep (also DATA_VERIFIED_MONTH in app.js).
   - 2026-09: the nine Ontario province-level records, each read against its
     official ontario.ca page on 2026-09-04 while being written. */
const REVIEWED_MONTHS = new Set(["2026-07", "2026-09"]);

test("benefit review dates use month granularity", () => {
  assert.equal(typeof BENEFIT_VERIFIED, "object");
  assert.notEqual(BENEFIT_VERIFIED, null);
  for (const [id, value] of Object.entries(BENEFIT_VERIFIED)) {
    assert.match(value, /^[0-9]{4}-[0-9]{2}$/);
    assert.ok(
      REVIEWED_MONTHS.has(value),
      `${id} claims review month ${value}, which is not a recorded review sweep. ` +
        "Add the month to REVIEWED_MONTHS only if an actual official-source review happened."
    );
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
