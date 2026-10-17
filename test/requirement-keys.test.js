"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadEngine } = require("../research/2026-10-site-audit/tools/load-engine");

const E = loadEngine(path.join(__dirname, ".."));

test("every requires key in the catalogue has a REQS definition", () => {
  const missing = [];
  for (const b of E.BENEFITS) for (const key of b.requires || []) if (!E.REQS[key]) missing.push(`${b.id}:${key}`);
  assert.deepEqual(missing, []);
});

test("an unknown requirement key fails closed: the program is never ready", () => {
  const b = E.BENEFITS.find((x) => x.id === "dtc");
  const fake = { ...b, requires: [...b.requires, "noSuchRequirementKey"] };
  const errors = [];
  const original = console.error;
  console.error = (m) => errors.push(String(m));
  try {
    const answers = { forWho: "self", disabilities: ["physical"], ageBand: "19to59", ageGroup: "adult", disabilityVerified: "yes", functionalNeeds: ["dailyLiving"], province: "AB", citizenPR: true, dtc: "yes", situation: ["working"], income: "low", city: "Calgary", circumstances: [], receives: [] };
    E.setAnswers(answers);
    const r = E.evaluate(fake, {});
    assert.notEqual(r.status, "ready");
    assert.ok(r.needs.some((n) => n.key === "noSuchRequirementKey"));
    assert.ok(errors.some((m) => m.includes("noSuchRequirementKey")));
  } finally { console.error = original; E.setAnswers(null); }
});
