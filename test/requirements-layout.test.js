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

test("English match-status surfaces never claim eligibility, approval or likelihood", () => {
  const ctx = vm.createContext({});
  vm.runInContext(i18n + '\nglobalThis.copy = I18N.en;', ctx);
  const forbidden = /\b(?:eligible|approved|guaranteed|likely|one step away)\b/i;
  const keys = Object.keys(ctx.copy).filter(key =>
    /^(?:mb\.|grp\.|nm\.|af\.|res\.|det\.(?:eligible|almostH|almostSub)$|scenario\.(?:newReady|noReady)$|pv\.qualify$|how\.2[hp]$|prob\.good2$)/.test(key));
  assert.ok(keys.length >= 30, "audit must cover the status-copy inventory");
  for (const key of keys) assert.doesNotMatch(ctx.copy[key], forbidden, key);
  assert.equal(ctx.copy['grp.ready'], 'Matches your answers');
  assert.equal(ctx.copy['grp.almost'], 'More to check');
  assert.equal(ctx.copy['nm.summary'], 'Does not match these answers');
  assert.equal(ctx.copy['det.eligible'], 'Based on what you told us. The program decides if you qualify.');
  // Audit only status-surface renderers, not REQS, application-progress stages,
  // or benefit prose (official rules can legitimately say "eligible"). Keys are
  // not displayed text: det.eligible remains an API key, not a verdict.
  const ranges = [
    ['function renderMoneyBand(', '/* -------------------------------------------------------------- engine */'],
    ['function resultsBlurb(', 'function groupTitle('],
    ['function renderMatchedGroups(', '/* a compact'],
    ['function benefitCard(', '/* editable summary'],
    ['function renderPrintActionPlan(', 'function reportProfileLine('],
    ['function printResults(', 'function benefitIsLocal('],
    ['function renderGuideBody(', 'function wireGuideInteractions('],
  ];
  for (const [start, end] of ranges) {
    const from = source.indexOf(start);
    assert.ok(from >= 0, start);
    const to = source.indexOf(end, from + start.length);
    assert.ok(to > from, end);
    const body = source.slice(from, to)
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/t\("[^"]+"\)/g, 'TRANSLATED_COPY');
    const literals = body.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g) || [];
    for (const literal of literals) assert.doesNotMatch(literal, forbidden, start + ': ' + literal);
  }
});

test("requirement cues have paired, plain-text, bounded actor metadata; rollout matches the reviewed applied inventory", () => {
  const migrated = [];
  for (const [key, req] of Object.entries(gates)) {
    const hasShort = Object.hasOwn(req, "short");
    assert.equal(Object.hasOwn(req, "who"), hasShort, key);
    if (!hasShort) continue;
    migrated.push(key);
    assert.equal(typeof req.short, "string", key);
    assert.ok(req.short.trim().length && [...req.short].length <= 80, key);
    assert.doesNotMatch(req.short, /[<>\r\n\d]|\.$/, key);
    assert.ok(![...req.short].some(c => [8232, 8233].includes(c.codePointAt(0))), key);
    assert.ok(Array.isArray(req.who) && req.who.length, key);
    assert.equal(new Set(req.who).size, req.who.length, key);
    const actors = ["you", "professional", "program"];
    assert.ok(req.who.every(w => actors.includes(w)), key);
    assert.deepEqual(Array.from(req.who), actors.filter(w => req.who.includes(w)), key);
  }
  const applied = require("../research/207-shorts/shorts-applied.json");
  assert.deepEqual(migrated.sort(), Object.keys(applied).filter(k => applied[k].short).sort());
  for (const [key, entry] of Object.entries(applied)) {
    assert.equal(gates[key].short || null, entry.short, key);
    if (entry.short) assert.deepEqual(Array.from(gates[key].who), entry.who, key);
  }
});

test("every static full requirement survives detail rendering verbatim as text", () => {
  const ctx = renderer();
  for (const [key, req] of Object.entries(gates)) {
    if (typeof req.unmet !== "string") continue; // Dynamic branches exercised in browser DOM test.
    const need = { key, text: req.unmet, short: req.short, who: req.who, action: req.action };
    const html = ctx.renderRequirements({ id: "test", name: "Test benefit" }, [need]);
    const expected = req.unmet.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
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
  assert.match(preview, /and 2 other checks/);
  assert.match(preview, /href="\/guides\/pilot"/);
  needs[3] = { key: "k3", text: "Unmigrated full text" };
  const fallback = vm.runInContext(`reqPreview(${JSON.stringify(b)}, ${JSON.stringify(needs)})`, ctx);
  assert.equal((fallback.match(/class="req-cue"/g) || []).length, 3);
  assert.match(fallback, /and 2 other checks/);
  const previewFor = n => vm.runInContext(`reqPreview(${JSON.stringify(b)}, ${JSON.stringify(n)})`, ctx);
  assert.match(previewFor([{ text: "Unmigrated full text" }]), /<ul.*Unmigrated full text/);
  assert.doesNotMatch(previewFor([{ text: "x".repeat(121) }]), /<ul/);
  assert.match(previewFor([{ text: "x".repeat(121) }]), /and 1 other checks/);
  assert.doesNotMatch(previewFor([]), /<ul/);
  const detail = ctx.renderRequirements(b, needs);
  assert.match(detail, /Other checks/);
  assert.ok(detail.includes("Full 4"), "no slice drops later needs");
  assert.equal((detail.match(/<details /g) || []).length, 1);
  assert.doesNotMatch(ctx.renderRequirements(b, [{ key: "same", text: "Same", short: "Same", who: ["you"] }]), /<details/);
});

test('name, short and print wording escape special characters and literal replacement dollars', () => {
  const ctx = renderer();
  const b = { id: 'escaped', name: '<"&$&' };
  const needs = [{ key: 'k', text: 'Full <"&', short: '<"&', who: ['you'] }];
  const detail = ctx.renderRequirements(b, needs);
  assert.ok(detail.includes('for &lt;&quot;&amp;$&amp;'));
  assert.ok(detail.includes('&lt;&quot;&amp;</li>'));
  const preview = vm.runInContext(`reqPreview(${JSON.stringify(b)}, ${JSON.stringify(needs)})`, ctx);
  assert.ok(preview.includes('for &lt;&quot;&amp;$&amp;'));
  const printed = vm.runInContext(`reqPrint(${JSON.stringify(needs)})`, ctx);
  assert.ok(printed.includes('Full &lt;&quot;&amp;'));
  assert.equal(vm.runInContext('reqPrint([])', ctx), '');
});
