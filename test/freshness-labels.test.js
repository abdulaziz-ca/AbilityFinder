'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { buildQueue } = require('../scripts/reverify-queue');
const app = fs.readFileSync('public/app.js', 'utf8');
function context() {
  const ctx = vm.createContext({window: {}, document: {}, console});
  const constants = ['DATA_VERIFIED_MONTH', 'STALE_MONTHS', 'MONTHS_EN'].map(n => app.match(new RegExp(`^const ${n} = .*;$`, 'm'))[0]);
  vm.runInContext(fs.readFileSync('public/data.js', 'utf8') + '\n' + constants.join('\n') + '\n' + app.match(/function verifiedFor\(b\) \{[\s\S]*?\n\}/)[0] + '\nglobalThis.freshness = verifiedFor;', ctx);
  return ctx;
}
test('every record has exactly one honest label, agrees with queue and generated guide', () => {
  const ctx = context();
  const queue = buildQueue();
  let inherited = 0;
  for (const record of queue) {
    const f = ctx.freshness(record);
    assert.equal(f.inherited, record.inherited, record.id);
    const ownLabel = /^Info verified \w+ \d{4}$/.test(f.wording);
    const inheritedLabel = /^Part of the \w+ \d{4} catalogue review$/.test(f.wording);
    assert.equal(Number(ownLabel) + Number(inheritedLabel), 1, record.id);
    assert.equal(inheritedLabel, record.inherited, record.id);
    inherited += Number(f.inherited);
    const file = `public/guides/${record.id}.html`;
    if (record.id === 'local-supports') { assert.equal(fs.existsSync(file), false); continue; }
    const html = fs.readFileSync(file, 'utf8');
    assert.ok(html.includes(`<span class="verified">${f.wording}</span>`), record.id);
  }
  assert.equal(queue.length, 137);
  assert.equal(inherited, 39);
  assert.ok(app.includes('${vFresh.wording}'));
});
