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

test("phase 2: a program the person already gets moves to G0 and nowhere else", () => {
  for (const [personaId, received] of [["P01-calgary-aish", ["aish"]], ["P05-ottawa-odsp", ["odsp"]]]) {
    const p = PERSONAS.find((x) => x.id === personaId);
    const answers = { ...p.answers, receives: received };
    const evaluated = evaluateScoped(answers);
    const g = classifyResults(evaluated, answers, received);
    assert.deepEqual(ids(g.g0), received, `${personaId}: G0 holds the received program`);
    for (const key of ["g1", "g2", "g3", "no"]) {
      assert.ok(!g[key].some((e) => received.includes(e.b.id)), `${personaId}: not also in ${key}`);
    }
    // Every other program is grouped exactly as without the answer, except the
    // receipt-gated rows that become known (RECEIPT_GATES).
    const before = classifyResults(evaluated, p.answers);
    const where = (groups) => Object.fromEntries(["g1", "g2", "g3", "no"].flatMap((k) => groups[k].map((e) => [e.b.id, k])));
    const was = where(before), now = where(g);
    for (const id of Object.keys(now)) {
      if (was[id] !== now[id]) assert.equal(id, "ottawa-community-pass", `${personaId}: only the ODSP-gated pass may move (${id})`);
    }
  }
});

test("phase 2: getting ODSP turns the Ottawa Community Pass from an 'If you get ODSP' row into a full card", () => {
  const p = PERSONAS.find((x) => x.id === "P05-ottawa-odsp");
  const evaluated = evaluateScoped(p.answers);
  const pass = (g) => ["g1", "g2", "g3"].find((k) => g[k].some((e) => e.b.id === "ottawa-community-pass"));
  const before = pass(classifyResults(evaluated, p.answers));
  const after = pass(classifyResults(evaluated, p.answers, ["odsp"]));
  if (before === "g2") assert.equal(after, "g1");
  else assert.equal(after, before, "unchanged when the pass was not an unasked-fact row");
});

test("phase 2: no received answer means no G0 and identical groups", () => {
  for (const p of PERSONAS) {
    const evaluated = evaluateScoped(p.answers);
    const a = classifyResults(evaluated, p.answers);
    const b = classifyResults(evaluated, p.answers, []);
    assert.equal(b.g0.length, 0);
    for (const k of ["g1", "g2", "g3", "no"]) assert.deepEqual(ids(a[k]), ids(b[k]), `${p.id} ${k}`);
  }
});

test("autism diagnosis answered 'no': the three diagnosis-first programs move to G3 with reason autism", () => {
  const p = PERSONAS.find((x) => x.id === "P03-surrey-autistic-child");
  const cases = [
    [{ ...p.answers, autismDiagnosis: "no" }, ["bc-autism-funding-6-18"]],
    [{ ...p.answers, autismDiagnosis: "no", ageBand: "under6" }, ["bc-autism-funding-under-6"]],
    [{ ...p.answers, autismDiagnosis: "no", province: "ON", city: "Toronto" }, ["ontario-autism-program"]],
  ];
  for (const [answers, expected] of cases) {
    const evaluated = evaluateScoped(answers);
    const g = classifyResults(evaluated, answers);
    const autism = g.g3.filter((e) => e.reason === "autism").map((e) => e.b.id).sort();
    assert.deepEqual(autism, expected, JSON.stringify({ province: answers.province, ageBand: answers.ageBand }));
    // Same answers but "not sure" or unanswered: never moved.
    for (const autismDiagnosis of ["unsure", null]) {
      const a2 = { ...answers, autismDiagnosis };
      const g2 = classifyResults(evaluateScoped(a2), a2);
      assert.equal(g2.g3.filter((e) => e.reason === "autism").length, 0, `autismDiagnosis=${autismDiagnosis}`);
    }
  }
});

test("G3 rules only move programs on their reviewed list", () => {
  const { PREREQ_RULES } = require("../public/resultsGroups.js");
  for (const p of PERSONAS) {
    for (const autismDiagnosis of ["no", "yes", "unsure"]) {
      const answers = { ...p.answers, autismDiagnosis, disabilities: [...new Set([...(p.answers.disabilities || []), "autism"])] };
      const g = classifyResults(evaluateScoped(answers), answers);
      for (const e of g.g3) {
        if (e.reason === "dtc") continue;
        const rule = PREREQ_RULES.find((r) => r.reason === e.reason);
        assert.ok(rule && rule.programs.includes(e.b.id), `${p.id}: ${e.b.id} (${e.reason})`);
      }
    }
  }
});
