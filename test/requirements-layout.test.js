"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { extractReqs } = require("../scripts/lib/dense-surfaces");
const root = path.resolve(__dirname, "..");
const gates = extractReqs(root);
const source = fs.readFileSync(path.join(root, "public/app.js"), "utf8");
const i18n = fs.readFileSync(path.join(root, "public/i18n.js"), "utf8");
const helpers = source.slice(source.indexOf("function reqEscape("), source.indexOf("function benefitCard("));
function renderer() {
  const ctx = vm.createContext({});
  vm.runInContext(i18n + '\n' + helpers + '\nglobalThis.renderRequirements = renderRequirements;', ctx);
  return ctx;
}

test("requirement cues have paired, plain-text, bounded actor metadata; only six pilots migrate", () => {
  const migrated = [];
  for (const [key, req] of Object.entries(gates)) {
    const hasShort = Object.hasOwn(req, "short");
    assert.equal(Object.hasOwn(req, "who"), hasShort, key);
    if (!hasShort) continue;
    migrated.push(key);
    assert.equal(typeof req.short, "string", key);
    assert.ok(req.short.trim().length && [...req.short].length <= 80, key);
    assert.doesNotMatch(req.short, /[<>\r\n]/, key);
    assert.ok(![...req.short].some(c => [8232, 8233].includes(c.codePointAt(0))), key);
    assert.ok(Array.isArray(req.who) && req.who.length, key);
    assert.equal(new Set(req.who).size, req.who.length, key);
    const actors = ["you", "professional", "program"];
    assert.ok(req.who.every(w => actors.includes(w)), key);
    assert.deepEqual(Array.from(req.who), actors.filter(w => req.who.includes(w)), key);
  }
  assert.deepEqual(migrated.sort(), ["odspMedical", "cwbEligibility", "bcHomeOwnerGrantDisabilityRoute", "dresEmploymentRoute", "cdbStatus", "rdspOpening"].sort());
});

test("every static full requirement survives detail rendering verbatim as text", () => {
  const ctx = renderer();
  for (const [key, req] of Object.entries(gates)) {
    if (typeof req.unmet !== "string") continue; // Dynamic branches exercised in browser DOM test.
    const need = { key, text: req.unmet, short: req.short, who: req.who, action: req.action };
    const html = ctx.renderRequirements({ id: "test", name: "Test benefit" }, [need]);
    const expected = vm.runInContext(`reqEscape(${JSON.stringify(req.unmet)})`, ctx);
    assert.ok(html.includes(expected), key);
    assert.equal((html.match(/<details /g) || []).length, req.short && req.short !== req.unmet ? 1 : 0, key);
  }
});

test("preview budgets, fallback, direct-text exception and grouped detail ordering", () => {
  const ctx = renderer();
  const b = { id: "pilot", name: "A & B" };
  const needs = Array.from({ length: 5 }, (_, i) => ({ key: `k${i}`, text: `Full ${i}`, short: `Cue ${i}`, who: ["you"] }));
  const preview = vm.runInContext(`reqPreview(${JSON.stringify(b)}, ${JSON.stringify(needs)})`, ctx);
  assert.equal((preview.match(/class="req-cue"/g) || []).length, 3);
  assert.match(preview, /— 2 more/);
  assert.match(preview, /href="\/guides\/pilot"/);
  needs[3] = { key: "k3", text: "Unmigrated full text" };
  const fallback = vm.runInContext(`reqPreview(${JSON.stringify(b)}, ${JSON.stringify(needs)})`, ctx);
  assert.doesNotMatch(fallback, /<ul|more/);
  const detail = ctx.renderRequirements(b, needs);
  assert.match(detail, /Other checks/);
  assert.ok(detail.includes("Full 4"), "no slice drops later needs");
  assert.equal((detail.match(/<details /g) || []).length, 1);
  assert.doesNotMatch(ctx.renderRequirements(b, [{ key: "same", text: "Same", short: "Same", who: ["you"] }]), /<details/);
});
