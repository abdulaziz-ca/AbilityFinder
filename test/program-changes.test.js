'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { cleanProgramChanges, buildPersistedState, restorePersistedState } = require('../public/stateManager');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync('public/data.js', 'utf8') + '\n' + fs.readFileSync('public/changelog.js', 'utf8') +
  '\nglobalThis.fixture = { entries: DATA_CHANGELOG, api: AbilityFinderProgramChanges, ids: BENEFITS.map(b => b.id) };', ctx);
const { entries, api, ids } = ctx.fixture;
const known = new Set(ids);
const { watermark } = api.collect(entries, ids);
const validSelections = { benefitIds: ['dtc', 'aish'], programChangeWatermark: watermark };
const good = () => ({ version: 1, seenByProgram: { dtc: 0, aish: watermark } });

test('annotated changelog batches have known ids, allowed kinds, neutral short summaries and increasing unique revisions', () => {
  let previous = 0;
  let count = 0;
  for (const entry of [...entries].reverse()) {
    if (!('revision' in entry) && !('changes' in entry)) continue;
    assert.ok(api.validEntry(entry, known), entry.text);
    assert.ok(entry.revision > previous, `Revision ${entry.revision} follows ${previous}`);
    previous = entry.revision;
    const pairs = new Set();
    for (const change of entry.changes) {
      const pair = change.recordId + ':' + change.kind;
      assert.ok(!pairs.has(pair), pair);
      pairs.add(pair);
      assert.ok(!/\d/.test(change.summary), 'Backfill does not restate figures');
    }
    count++;
  }
  assert.equal(count, 13);
  assert.equal(watermark, previous);
});

test('initial batches and Kelowna follow release order and only applied fixes are annotated', () => {
  const released = [...entries].reverse().filter(entry => entry.revision);
  assert.deepEqual(Array.from(released, entry => entry.revision), Array.from({length: 13}, (_, i) => i + 1));
  assert.match(released[0].text, /^Corrected Healthy Kids/);
  assert.match(released[1].text, /^Applied twenty-four/);
  assert.match(released[2].text, /^Corrected the Kelowna/);
  assert.equal(released[0].changes.length, 10);
  assert.equal(new Set(released[0].changes.map(change => change.recordId)).size, 7);
  assert.ok(!released[0].changes.some(change => ['csg-disability', 'bc-msp-supplementary-benefits'].includes(change.recordId)));
  assert.deepEqual(Array.from(released[2].changes, change => change.kind), ['amount', 'rule']);
});

test('changelog validator rejects invalid metadata; collection omits bad and non-increasing batches', () => {
  const entry = { revision: 1, changes: [{ recordId: 'dtc', kind: 'rule', summary: 'The requirements were corrected.' }] };
  for (const patch of [{revision: 0}, {revision: 1.5}, {revision: Infinity}, {changes: []}, {changes: null}]) {
    assert.equal(api.validEntry({...entry, ...patch}, known), false);
  }
  for (const patch of [{recordId: 'deleted'}, {kind: 'wording'}, {summary: ''}, {summary: '123'}, {summary: 'x'.repeat(121)}, {secret: true}]) {
    assert.equal(api.validEntry({...entry, changes: [{...entry.changes[0], ...patch}]}, known), false);
  }
  assert.equal(api.collect([{...entry, revision: 2}, {...entry, revision: 1}, entry], ids).changes.length, 2);
});

test('program marker round-trips in schema two with no previous-results retention', () => {
  const payload = buildPersistedState({programChanges: good(), validSelections});
  assert.equal(payload.schemaVersion, 2);
  assert.deepEqual(payload.ui.programChanges, good());
  assert.deepEqual(restorePersistedState(payload, {validSelections}).programChanges, good());
  assert.equal(restorePersistedState({}, {validSelections}).programChanges, null);
});

const invalid = [undefined, null, false, 1, 'marker', [], {}, {version: 2, seenByProgram: {}},
  {version: 1, seenByProgram: []}, {version: 1, seenByProgram: null},
  {version: 1, seenByProgram: {unknown: 0}}, {version: 1, seenByProgram: {}, lastResultIds: ['dtc']},
  ...[-1, 0.5, Infinity, NaN, Number.MAX_SAFE_INTEGER, watermark + 1, '1', null].map(dtc => ({version: 1, seenByProgram: {dtc}})),
  {version: 1, seenByProgram: Object.fromEntries(Array.from({length: 1000}, (_, i) => ['id'+i, 0]))},
  {version: 1, seenByProgram: {dtc: {revision: 1}}},
  {version: 1, seenByProgram: {}, arbitrary: 'private text'},
];
for (const [index, value] of invalid.entries()) test(`invalid marker ${index} silently becomes uninitialized on build and restore`, () => {
  assert.equal(cleanProgramChanges(value, validSelections), null);
  assert.equal(buildPersistedState({programChanges: value, validSelections}).ui.programChanges, null);
  assert.equal(restorePersistedState({ui: {programChanges: value}}, {validSelections}).programChanges, null);
});

test('non-plain marker objects and unbounded contexts are rejected', () => {
  assert.equal(cleanProgramChanges(new Date(), validSelections), null);
  assert.equal(cleanProgramChanges(Object.assign(Object.create({extra: true}), good()), validSelections), null);
  assert.equal(cleanProgramChanges(good(), {}), null);
});
