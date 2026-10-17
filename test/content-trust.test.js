'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const app = fs.readFileSync('public/app.js', 'utf8');
const data = fs.readFileSync('public/data.js', 'utf8');
const translations = fs.readFileSync('public/i18n.js', 'utf8');
const escape = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const fn = name => app.match(new RegExp(`function ${name}\\([^]*?\\n\\}`))[0];
function context() {
  const ctx = vm.createContext({ window: {}, document: {}, console,
    icon: () => '', wizardDone: () => false,
    verifiedFor: () => ({ wording: 'test', stale: false }),
    p2Sections: () => ({}), listBlock: () => '', practitionerFinder: () => '',
    resolveUrl: s => s,
  });
  vm.runInContext(data + '\n' + translations + '\n' + fn('reqEscape') + '\n' + fn('applyLabel') + '\n' + fn('statusBadge') + '\n' + fn('valueParts') + '\n' + fn('difficultyInfo') + '\n' + fn('renderGuideBody') + '\n' + fn('resultsBlurb') + '\nglobalThis.benefits = BENEFITS; globalThis.render = renderGuideBody;', ctx);
  return ctx;
}
test('every live guide amount equals the qualified catalogue amount and generated static guide', () => {
  const ctx = context();
  let compared = 0;
  for (const b of ctx.benefits) {
    const live = ctx.render(b, { status: 'almost', needs: [] });
    if (!b.amount) continue;
    const answer = live.match(/How much\?<\/span><span class="af-a">([^]*?)<\/span>/)?.[1];
    const amount = live.match(/<div class="detail-amount">([^]*?)<\/div>/)?.[1];
    assert.equal(answer, escape(b.amount), `${b.id}: live answer`);
    assert.equal(amount, answer, `${b.id}: live amount section`);
    // This routing placeholder has no official source URL and intentionally has no static guide.
    if (b.id === 'local-supports') {
      assert.equal(fs.existsSync(`public/guides/${b.id}.html`), false);
      continue;
    }
    const staticHtml = fs.readFileSync(`public/guides/${b.id}.html`, 'utf8');
    assert.equal(staticHtml.match(/<p class="detail-amount">([^]*?)<\/p>/)?.[1], answer, `${b.id}: static amount`);
    compared++;
  }
  assert.equal(compared, 133);
});
test('privacy copy describes local saving, including the French wizard', () => {
  assert.doesNotMatch(translations, /never saved|jamais enregistrées|ne conservons ni n'envoyons/);
  const ctx = context();
  assert.match(vm.runInContext('I18N.en.disclaimer', ctx), /saved only in this browser on this device/);
  assert.match(vm.runInContext('STEP_I18N.fr.income.help', ctx), /enregistrée uniquement dans ce navigateur/);
});
test('landing illustration contains neither prices nor a match verdict', () => {
  const preview = app.split('<div class="hero-preview-wrap"')[1].split('<section class="section life-events"')[0];
  assert.match(preview, /Illustration only/);
  assert.doesNotMatch(preview, /\$[\d]|matchStatusNote|pv.qualify|icon\("check"\)/);
});
test('French scope follows both province flags and French results match the English caveat', () => {
  const ctx = context();
  vm.runInContext('var BC_ENABLED = true; var ON_ENABLED = true; LANG = "fr";', ctx);
  for (const key of ['land.eyebrow', 'orgs.lede', 'pro.what.p', 'life.alberta.h', 'partner.title']) {
    assert.match(vm.runInContext(`t(${JSON.stringify(key)})`, ctx), /Ontario|ontariens|Ontariens/);
  }
  for (const counts of [[1,0], [0,1], [1,1], [0,0]]) {
    assert.equal(vm.runInContext(`resultsBlurb(${counts})`, ctx), vm.runInContext('I18N.fr["res.acknowledgement"]', ctx));
  }
  const frenchCopy = vm.runInContext('JSON.stringify(I18N.fr)', ctx);
  assert.doesNotMatch(frenchCopy, /prêt à demander|Prêt à demander|une étape près|confirmez une condition|Pas admissible pour l'instant/);
  assert.match(vm.runInContext('STEP_I18N.fr.dtc.help', ctx), /plusieurs programmes fédéraux, mais pas pour toutes/);
  vm.runInContext('ON_ENABLED = false;', ctx);
  assert.doesNotMatch(vm.runInContext('t("land.eyebrow")', ctx), /Ontario/);
});
test('changelog is newest-first, has no future dates, and October review count matches the data', () => {
  const ctx = context();
  vm.runInContext(fs.readFileSync('public/changelog.js', 'utf8') + '\nglobalThis.entries = DATA_CHANGELOG;', ctx);
  assert.equal(ctx.entries[0].date, '2026-10-17');
  assert.equal(ctx.entries[0].revision, undefined);
  for (let i = 0; i < ctx.entries.length; i++) {
    assert.ok(ctx.entries[i].date <= '2026-10-17');
    if (i) assert.ok(ctx.entries[i-1].date >= ctx.entries[i].date, ctx.entries[i].text);
  }
  const count = vm.runInContext('Object.values(BENEFIT_VERIFIED).filter(d => d === "2026-10").length', ctx);
  assert.equal(count, 51);
  assert.match(ctx.entries.find(e => e.text.startsWith('Review dates moved')).text, new RegExp(`for ${count} benefits`));
});
test('category help does not promise categories cannot exclude a match or name Alberta-only helpers', () => {
  const help = app.split('const HELP_PAGES = {')[1]?.split('documentation:')[0];
  assert.ok(help);
  assert.match(help, /Some programs depend on the category/);
  assert.doesNotMatch(help, /doesn't disqualify|will not disqualify|Voice of Albertans|Inclusion Alberta|Alberta 211/);
});
test('verification and money labels do not make the former site-wide claims', () => {
  assert.doesNotMatch(app, /Info verified \$\{(?:esc\()?DATA_VERIFIED|Information was last verified \$\{|Est\. value|around the clock/);
  assert.doesNotMatch(data, /free government (money|grants)/);
  assert.match(app, /Published maximum/);
  assert.match(app, /Every few hours.*rotating set/);
});
