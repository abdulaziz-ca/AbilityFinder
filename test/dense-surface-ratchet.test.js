const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { collectDenseSurfaces, isFlagged, SURFACES, cueCoverage } = require('../scripts/lib/dense-surfaces');
const baseline = require('../research/197-info-density/dense-surface-baseline.json');
const items = collectDenseSurfaces(path.join(__dirname, '..'));

test('REQS extraction retains at least 150 unmet strings', () => {
  assert.ok(items.filter(item => item.surface === 'gate.unmet').length >= 150,
    'gate.unmet extraction must retain at least 150 strings');
});
for (const surface of SURFACES) {
  test(`dense-surface ratchet: ${surface}`, () => {
    const actual = items.filter(item => item.surface === surface && isFlagged(item)).length;
    const allowed = baseline.counts[surface];
    assert.ok(Number.isInteger(allowed), `Missing baseline count for ${surface}`);
    assert.ok(actual <= allowed,
      `${surface}: flagged count ${actual} exceeds baseline ${allowed}; shorten the new text or move the official wording behind the expander; never delete a qualifier`);
  });
}

test('flagged unmet entries without a short cue never increase', () => {
  assert.ok(Number.isInteger(baseline.flaggedWithoutShort));
  assert.ok(cueCoverage(path.join(__dirname, '..')).withoutShort <= baseline.flaggedWithoutShort);
});
