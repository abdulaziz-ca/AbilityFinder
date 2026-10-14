'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { buildQueue } = require('../scripts/reverify-queue');
const rootDir = path.resolve(__dirname, '..');
const today = '2026-10-13';

test('queue contains exactly one entry for every benefit, with identity and actual metadata', t => {
  const context = vm.createContext({ window: {}, document: {}, console });
  vm.runInContext(fs.readFileSync(path.join(rootDir, 'public/data.js'), 'utf8') +
    ';globalThis.records = BENEFITS; globalThis.dates = BENEFIT_VERIFIED;', context);
  const queue = buildQueue({ rootDir, today });
  const inherited = queue.filter(b => b.inherited).length;
  const oldest = [...queue].sort((a, b) => b.ageDays - a.ageDays)[0];
  t.diagnostic(`As of ${today}: records=${queue.length}, inherited=${inherited}, own-date=${queue.length - inherited}, oldest=${oldest.verified} (${oldest.ageDays} days)`);
  assert.equal(queue.length, context.records.length);
  assert.equal(new Set(queue.map(b => b.id)).size, queue.length);
  for (const record of context.records) {
    const entry = queue.find(b => b.id === record.id);
    assert.ok(entry.id && entry.name);
    assert.equal(entry.name, record.name);
    assert.equal(entry.scope, record.level || null);
    assert.equal(entry.inherited, !context.dates[record.id]);
    if (context.dates[record.id]) assert.equal(entry.verified, context.dates[record.id]);
    assert.equal(entry.priority, entry.ageDays + (entry.inherited ? 60 : 0) + (entry.hasDollarFigures ? 30 : 0));
    assert.ok(Array.isArray(entry.urls));
    if (typeof record.source === 'string') assert.ok(entry.urls.includes(record.source));
  }
});

test('priority is descending and deterministic', () => {
  const queue = buildQueue({ rootDir, today });
  for (let i = 1; i < queue.length; i++) assert.ok(queue[i - 1].priority >= queue[i].priority);
  assert.deepEqual(queue, buildQueue({ rootDir, today }));
});

test('injecting a later day increases every age by elapsed UTC days', () => {
  const queue = buildQueue({ rootDir, today });
  const later = buildQueue({ rootDir, today: '2026-10-23' });
  for (const entry of queue) assert.equal(later.find(b => b.id === entry.id).ageDays, entry.ageDays + 10);
});
