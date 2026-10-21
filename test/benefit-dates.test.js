const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadData(file = 'public/data.js') {
  const ctx = vm.createContext({});
  vm.runInContext(fs.readFileSync(file, 'utf8') + '\nglobalThis.out={BENEFITS,BENEFIT_DATES,BENEFIT_META,BENEFIT_EXTRA};', ctx);
  return ctx.out;
}
const { BENEFITS, BENEFIT_DATES, BENEFIT_META, BENEFIT_EXTRA } = loadData();
const ids = new Set(BENEFITS.map(b => b.id));
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function realDate(value) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value);
  if (!m) return false;
  const y=+m[1], mo=+m[2], d=m[3] ? +m[3] : 1;
  const date = new Date(Date.UTC(y, mo-1, d));
  return date.getUTCFullYear()===y && date.getUTCMonth()===mo-1 && date.getUTCDate()===d;
}
function sourceForms(value) {
  const [y,m,d] = value.split('-');
  const month = MONTHS[+m-1];
  return d ? [`${month} ${+d}, ${y}`, `${+d} ${month} ${y}`] : [`${month} ${y}`];
}

test('BENEFIT_DATES has valid sourced entries', () => {
  for (const [id, entries] of Object.entries(BENEFIT_DATES)) {
    assert.ok(ids.has(id), `${id} exists in BENEFITS`);
    const benefit = BENEFITS.find(b => b.id === id);
    const ownText = JSON.stringify([benefit, BENEFIT_META[id], BENEFIT_EXTRA[id]]);
    for (const entry of entries) {
      assert.ok(['deadline','opens','ends'].includes(entry.kind), `${id}: ${entry.kind}`);
      assert.ok(realDate(entry.date), `${id}: real date ${entry.date}`);
      assert.ok(entry.label && entry.label.trim(), `${id}: label`);
      assert.ok(entry.text && entry.text.trim(), `${id}: text`);
      for (const value of [entry.date, ...(entry.conflict || [])]) {
        assert.match(value, /^\d{4}-\d{2}(-\d{2})?$/);
        assert.ok(realDate(value), `${id}: real date ${value}`);
        assert.ok(sourceForms(value).some(form => ownText.includes(form)), `${id}: ${value} appears in own record text`);
      }
    }
  }
});

test('generated data-core exports BENEFIT_DATES', () => {
  const source = fs.readFileSync('public/data-core.js','utf8');
  assert.match(source, /Object\.assign\(globalThis,[\s\S]*\bBENEFIT_DATES\b/);
});
