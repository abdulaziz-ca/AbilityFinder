'use strict';
// Browse targeting maps (#246): DIS_BY_REQ / NEED_BY_REQ are derived from the
// requirement gates' own source. This pins the derived table so changes show in review.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'public/app.js'), 'utf8');
const ctx = vm.createContext({ console, AbilityFinderState: require('../public/stateManager') });
vm.runInContext(fs.readFileSync(path.join(root, 'public/data.js'), 'utf8'), ctx);
const end = app.indexOf('/* some benefit URLs are functions of the answers');
assert.ok(end > 0, 'marker after the browse maps moved');
vm.runInContext(app.slice(0, end) + '\nglobalThis.__ = { EQUIP_NEED, DIS_BY_REQ, NEED_BY_REQ, REQS, BENEFITS };', ctx);
const { DIS_BY_REQ, NEED_BY_REQ, BENEFITS } = ctx.__;
const sorted = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, [...o[k]].sort()]));
const uses = (gate) => BENEFITS.filter((b) => (b.requires || []).includes(gate)).length;

test('named gates map to the disability or need their code tests', () => {
  assert.ok(DIS_BY_REQ.visionDisability.includes('vision'));
  assert.ok(DIS_BY_REQ.hearingDisability.includes('hearing'));
  assert.ok(DIS_BY_REQ.autismSelected.includes('autism'));
  assert.ok(NEED_BY_REQ.transitBarrier.includes('transitBarrier'));
  assert.ok(NEED_BY_REQ.homeAccessNeed.includes('homeAccess'));
});

test('the three hand overrides keep their values', () => {
  assert.deepEqual([...DIS_BY_REQ.mobility], ['physical', 'vision']);
  assert.deepEqual([...DIS_BY_REQ.developmental], ['intellectual', 'autism']);
  assert.deepEqual([...DIS_BY_REQ.equipmentNeed], [...ctx.__.EQUIP_NEED]);
});

test('no gate maps to other, none or unsure', () => {
  for (const map of [DIS_BY_REQ, NEED_BY_REQ])
    for (const [gate, values] of Object.entries(map))
      for (const v of values) assert.ok(!['other', 'none', 'unsure'].includes(v), `${gate} -> ${v}`);
});

test('derived maps match the pinned snapshot', () => {
  const table = {};
  for (const [name, map] of [['DIS_BY_REQ', DIS_BY_REQ], ['NEED_BY_REQ', NEED_BY_REQ]])
    table[name] = Object.fromEntries(Object.keys(map).sort().map((g) => [g, { values: [...map[g]].sort(), programs: uses(g) }]));
  const file = path.join(__dirname, 'fixtures/browse-maps.json');
  if (process.env.UPDATE_BROWSE_MAPS) fs.writeFileSync(file, JSON.stringify(table, null, 2) + '\n');
  assert.deepEqual(table, JSON.parse(fs.readFileSync(file, 'utf8')));
});
