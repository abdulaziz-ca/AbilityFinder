const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const app = fs.readFileSync('public/app.js','utf8');
const names = ['localDateFromIso','benefitDateUpcoming','benefitDateCalendarEligible','formatBenefitDate','addCalendarDays','icsFold','buildCalendarIcs','benefitDateEvent','buildBenefitDateIcs'];
const constants = ['icsDate','icsUtcTimestamp','icsEsc'];
function declaration(name, kind='function') {
  if (kind === 'const') return app.match(new RegExp(`const ${name} = [\\s\\S]*?;\\n`))[0];
  const start = app.indexOf(`function ${name}(`);
  let brace = app.indexOf('{', start), depth = 0;
  for (let i=brace;i<app.length;i++) { if(app[i]==='{') depth++; else if(app[i]==='}' && --depth===0) return app.slice(start,i+1); }
  throw new Error(name);
}
const ctx = vm.createContext({ Intl, Date, TextEncoder, resolveUrl: x => x, globalThis: {} });
vm.runInContext(constants.map(n=>declaration(n,'const')).join('\n')+'\n'+names.map(n=>declaration(n)).join('\n')+'\nglobalThis.api={'+names.join(',')+'};',ctx);
const h=ctx.globalThis.api;

test('upcoming uses local day, whole month, and latest conflict', () => {
  const now = new Date(2026,9,30,23,59);
  assert.equal(h.benefitDateUpcoming({date:'2026-10-30'},now),true);
  assert.equal(h.benefitDateUpcoming({date:'2026-10-29'},now),false);
  assert.equal(h.benefitDateUpcoming({date:'2026-10'},now),true);
  assert.equal(h.benefitDateUpcoming({date:'2026-09'},now),false);
  assert.equal(h.benefitDateUpcoming({date:'2026-10-01',conflict:['2026-11-01']},now),true);
});
test('calendar eligibility accepts only exact final dates', () => {
  assert.equal(h.benefitDateCalendarEligible({date:'2026-10-30'}),true);
  assert.equal(h.benefitDateCalendarEligible({date:'2026-10'}),false);
  assert.equal(h.benefitDateCalendarEligible({date:'2026-10-30',expected:true}),false);
  assert.equal(h.benefitDateCalendarEligible({date:'2026-10-30',conflict:['2026-11-01']}),false);
});
test('date formatting is long en-CA with optional time', () => {
  assert.equal(h.formatBenefitDate({date:'2026-10-30'}),'October 30, 2026');
  assert.equal(h.formatBenefitDate({date:'2026-10-30',time:'16:30'}),'October 30, 2026 at 4:30 p.m.');
  assert.equal(h.formatBenefitDate({date:'2027-01'}),'January 2027');
});
test('single-date ICS escapes, folds, and includes two alarms', () => {
  const b={id:'sample',name:'A very long program name that makes the summary exceed seventy-five octets — safely',applyUrl:'https://example.test/a,b'};
  const entry={date:'2026-10-30',label:'Applications close',text:'Bring notes; keep one, then apply \\ online.'};
  const ics=h.buildBenefitDateIcs(b,entry,new Date('2026-10-20T12:00:00Z'));
  assert.match(ics,/DTSTART;VALUE=DATE:20261030\r\n/);
  assert.match(ics,/TRIGGER:-P6DT15H/);
  assert.match(ics,/TRIGGER:PT9H/);
  assert.ok(ics.replace(/\r\n /g,'').includes('DESCRIPTION:Bring notes\\; keep one\\, then apply \\\\ online.'));
  assert.match(ics,/\r\n /);
  for (const line of ics.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75, line);
});
