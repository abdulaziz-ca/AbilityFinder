"use strict";
// Repeated-fact ratchet (site audit 2026-10, C-CONTENT-TRUST P1-08). Counts 7-word
// runs repeated verbatim between two fields a guide actually displays. It may only
// go down: lower the numbers when you remove a repeat, never raise them. Give each
// field one job (docs/CONTENT-STYLE-GUIDE.md).
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadEngine } = require("../research/2026-10-site-audit/tools/load-engine");
const { duplication } = require("../scripts/lib/duplication");

const MAX_RECORDS_WITH_REPEATS = 70;
const MAX_SHARED_RUNS = 1180;

test("repeated facts across displayed fields do not grow", () => {
  const E = loadEngine(path.join(__dirname, ".."));
  const results = Array.from(E.BENEFITS).filter((b) => b.requires).map((b) => duplication(b));
  const records = results.filter((r) => r.shared >= 3).length;
  const shared = results.reduce((a, r) => a + r.shared, 0);
  assert.ok(records <= MAX_RECORDS_WITH_REPEATS, `${records} records repeat facts (baseline ${MAX_RECORDS_WITH_REPEATS})`);
  assert.ok(shared <= MAX_SHARED_RUNS, `${shared} repeated runs (baseline ${MAX_SHARED_RUNS})`);
});
