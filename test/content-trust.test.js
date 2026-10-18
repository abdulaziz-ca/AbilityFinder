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
  vm.runInContext(data + '\n' + translations + '\n' + fn('reqEscape') + '\n' + fn('glossaryBlock') + '\n' + fn('applyLabel') + '\n' + fn('statusBadge') + '\n' + fn('valueParts') + '\n' + fn('difficultyInfo') + '\n' + fn('renderGuideBody') + '\n' + fn('resultsBlurb') + '\nglobalThis.benefits = BENEFITS; globalThis.render = renderGuideBody;', ctx);
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
    if (b.id === 'local-supports' || (b.level === 'Saskatchewan' && !/^const SK_ENABLED = true;/m.test(app))) {
      // The routing placeholder and dark-province records have no static guide.
      assert.equal(fs.existsSync(`public/guides/${b.id}.html`), false);
      continue;
    }
    const staticHtml = fs.readFileSync(`public/guides/${b.id}.html`, 'utf8');
    assert.equal(staticHtml.match(/<p class="detail-amount">([^]*?)<\/p>/)?.[1], answer, `${b.id}: static amount`);
    compared++;
  }
  assert.equal(compared, 253);
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
  assert.equal(ctx.entries[0].date, '2026-10-18');
  assert.equal(ctx.entries[0].revision, undefined);
  for (let i = 0; i < ctx.entries.length; i++) {
    assert.ok(ctx.entries[i].date <= '2026-10-18');
    if (i) assert.ok(ctx.entries[i-1].date >= ctx.entries[i].date, ctx.entries[i].text);
  }
  // Records first published after the October review carry 2026-10 from their own
  // official-page build, not from that review; the review entry keeps its count.
  const ADDED_AFTER_REVIEW = ["niagara-transit-benefit-pass", "kingston-affordable-transit-pass", "halton-split", "abbotsford-prc-subsidy", "abbotsford-specialized-access", "maple-ridge-access-pass-financial", "maple-ridge-access-pass-disability", "nanaimo-leap", "new-westminster-financial-assistance", "prince-george-lap", "banff-access-program", "blackfalds-recreation-fee-assistance", "chestermere-community-access-program", "drayton-valley-recreation-fee-assistance", "edson-leisure-assist", "rocky-mountain-house-rfap", "strathmore-community-access-card", "whitecourt-recreation-fee-assistance", "belleville-recreation-fee-assistance", "chatham-kent-affordable-bus-pass", "cornwall-fair", "peterborough-recreation-subsidy", "peterborough-ow-odsp-transit-pass", "campbell-river-life", "colwood-langford-life", "courtenay-comox-rap-leap", "cranbrook-leisure-access", "duncan-leisure-access", "mission-play-pass", "penticton-life", "penticton-access-pass", "pitt-meadows-fee-subsidy", "port-moody-leisure-access", "prince-rupert-recreation-access", "quesnel-leisure-access", "squamish-recreation-access", "terrace-affordable-recreation-access", "white-rock-leisure-access", "brantford-recreation-subsidy", "cornwall-community-bus-pass", "dawson-creek-leisure-access", "high-river-community-access-program", "langley-leisure-access-grant", "morinville-wrap", "nelson-rdck-leisure-access", "port-coquitlam-financial-assistance", "sarnia-cnib-pass", "taber-fee-assistance", "west-vancouver-recreation-financial-assistance", "on-child-benefit", "on-dso-adult-services", "on-enhanced-respite", "on-gains", "on-healthy-smiles", "on-ontario-works", "on-seniors-dental", "on-trillium-benefit", "on-drug-benefit", "on-home-community-care", "on-northern-health-travel-grant", "on-odsp-employment-supports", "on-odsp-health-benefits", "on-oesp", "bc-csil", "bc-family-benefit", "bc-home-support", "bc-income-assistance", "bc-nursing-support-services", "bc-ppmb", "bc-rental-assistance-program", "bc-safer", "bc-hearing-supplements", "ab-blue-cross-non-group", "ab-brain-injury", "ab-child-family-benefit", "ab-home-care", "ab-income-support", "ab-rent-assistance-benefit", "ab-seniors-benefit", "ab-seniors-dental-optical", "ab-seniors-special-needs-assistance", "ab-sharp", "bc-subsidized-housing", "on-childrens-rehab", "sk-said", "sk-income-support", "sk-employment-incentive", "sk-housing-benefit", "sk-sail", "sk-supplementary-health", "sk-family-health-benefits", "sk-special-support", "sk-seniors-drug-plan", "sk-seniors-income-plan", "sk-autism-individualized-funding", "sk-cognitive-disability-strategy", "sk-family-respite-intellectual-disability", "sk-home-care", "sk-adaptations-for-independence", "sk-eapd", "sk-personal-care-home-benefit", "sk-accessible-parking", "sk-active-families-benefit", "sk-low-income-tax-credit", "sk-early-childhood-intervention", "sk-cochlear-processor", "regina-affordable-access", "regina-paratransit", "saskatoon-access-transit", "saskatoon-leisure-access-program", "saskatoon-low-income-bus-pass", "north-battleford-handi-bus", "regina-discounted-31-day-pass", "moose-jaw-discounted-monthly-pass", "moose-jaw-paratransit", "prince-albert-access-transit", "saskatoon-accessible-parking-permit-subsidy", "yorkton-access-transit", "yorkton-discounted-monthly-pass", "swift-current-access-transit"];
  const count = vm.runInContext(`Object.entries(BENEFIT_VERIFIED).filter(([id, d]) => d === "2026-10" && !${JSON.stringify(ADDED_AFTER_REVIEW)}.includes(id)).length`, ctx);
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
