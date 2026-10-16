"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadEngine } = require("../research/2026-10-site-audit/tools/load-engine");
const PERSONAS = require("../research/2026-10-site-audit/tools/personas");
const FROZEN = require("./fixtures/results-phase1-evaluator.json");
const { classifyResults } = require("../public/resultsGroups.js");

const E = loadEngine(path.join(__dirname, ".."));

function evaluateScoped(answers) {
  E.setAnswers(answers);
  try {
    return E.evaluateAnswers(answers, {}).filter((e) => E.benefitInResultsScope(e.b, answers));
  } finally { E.setAnswers(null); }
}
const ids = (list) => Array.from(list, (e) => e.b.id).sort();

test("every in-scope ready/almost program lands in exactly one group, with the frozen ready set intact", () => {
  for (const p of PERSONAS) {
    const evaluated = evaluateScoped(p.answers);
    const g = classifyResults(evaluated, p.answers);
    const matched = evaluated.filter((e) => e.r.status === "ready" || e.r.status === "almost");
    const placed = [...g.g1, ...g.g2, ...g.g3];
    assert.deepEqual(ids(placed), ids(matched), `${p.id}: each matched program exactly once`);
    assert.equal(new Set(ids(placed)).size, placed.length, `${p.id}: no duplicates`);
    assert.deepEqual(ids(g.no), ids(evaluated.filter((e) => e.r.status === "no")), `${p.id}: status no untouched`);

    const frozen = FROZEN[p.id];
    assert.ok(frozen, `${p.id}: frozen evaluator statuses exist`);
    const frozenReady = Object.keys(frozen).filter((id) => frozen[id] === "ready" && evaluated.some((e) => e.b.id === id)).sort();
    assert.deepEqual(ids(g.g1.filter((e) => e.r.status === "ready")), frozenReady, `${p.id}: G1 ready set equals evaluate() ready set`);
    assert.deepEqual(ids(evaluated.filter((e) => e.r.status === "ready")), frozenReady, `${p.id}: evaluate() unchanged since freeze`);
    for (const e of placed) assert.equal(e.r.status, evaluated.find((x) => x.b.id === e.b.id).r.status, "status never rewritten");
  }
});

test("DTC answered no: DTC-dependent programs go to G3, DTC itself stays in G1", () => {
  const p = PERSONAS.find((x) => x.id === "P01-calgary-aish");
  assert.equal(p.answers.dtc, "no");
  const g = classifyResults(evaluateScoped(p.answers), p.answers);
  assert.ok(g.g1.some((e) => e.b.id === "dtc"), "DTC record in G1");
  assert.ok(g.g3.length > 0, "some DTC-dependent programs in G3");
  for (const e of g.g3) assert.ok(e.r.needs.some((n) => n.key === "dtc"), `${e.b.id} needs DTC`);
  for (const e of g.g1) if (e.b.id !== "dtc" && e.r.status === "almost") assert.ok(!e.r.needs.some((n) => n.key === "dtc"), `${e.b.id} should not stay in G1`);
});

test("unknown or unsure DTC never moves anything to G3", () => {
  for (const dtc of [null, "unsure"]) {
    for (const p of PERSONAS) {
      const answers = { ...p.answers, dtc };
      const g = classifyResults(evaluateScoped(answers), answers);
      assert.equal(g.g3.length, 0, `${p.id} dtc=${dtc}`);
    }
  }
});

test("G2 rows only hold programs whose remaining checks are unasked facts, with a situation phrase", () => {
  for (const p of PERSONAS) {
    const g = classifyResults(evaluateScoped(p.answers), p.answers);
    for (const e of g.g2) {
      assert.equal(e.r.status, "almost");
      assert.ok(e.situation && e.situation.length > 3, `${e.b.id} has a situation`);
    }
  }
});
