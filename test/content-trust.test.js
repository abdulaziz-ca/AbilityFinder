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
    p2Sections: () => ({}), listBlock: () => '', practitionerFinder: () => '', renderBenefitDates: () => '',
    resolveUrl: s => s,
  });
  vm.runInContext(data + '\n' + translations + '\n' + fn('reqEscape') + '\n' + fn('recLang') + '\n' + fn('recAttr') + '\n' + fn('glossaryBlock') + '\n' + fn('applyLabel') + '\n' + fn('statusBadge') + '\n' + fn('valueParts') + '\n' + fn('difficultyInfo') + '\n' + fn('renderGuideBody') + '\n' + fn('resultsBlurb') + '\nglobalThis.benefits = BENEFITS; globalThis.render = renderGuideBody;', ctx);
  return ctx;
}
test('every live guide amount equals the qualified catalogue amount and generated static guide', () => {
  const ctx = context();
  let compared = 0;
  for (const b of ctx.benefits) {
    const live = ctx.render(b, { status: 'almost', needs: [] });
    if (!b.amount) continue;
    const answer = live.match(/How much\?<\/span><span class="af-a"(?: lang="fr")?>([^]*?)<\/span>/)?.[1];
    const amount = live.match(/<div class="detail-amount"(?: lang="fr")?>([^]*?)<\/div>/)?.[1];
    assert.equal(answer, escape(b.amount), `${b.id}: live answer`);
    assert.equal(amount, answer, `${b.id}: live amount section`);
    // This routing placeholder has no official source URL and intentionally has no static guide.
    if (b.id === 'local-supports' || (b.level === 'Saskatchewan' && !/^const SK_ENABLED = true;/m.test(app)) || (/^(Manitoba|Winnipeg|Brandon)$/.test(b.level) && !/^const MB_ENABLED = true;/m.test(app)) || (/^(New Brunswick|Dieppe|Fredericton|Saint John|Moncton|Riverview|Bathurst|Campbellton|Edmundston|Miramichi|Oromocto|Quispamsis|Rothesay)$/.test(b.level) && !/^const NB_ENABLED = true;/m.test(app)) || (/^(Nova\ Scotia|Amherst|Antigonish|Bridgewater|Dartmouth|Glace\ Bay|Halifax|Kentville|Lunenburg|New\ Glasgow|Sydney|Truro|Wolfville|Yarmouth)$/.test(b.level) && !/^const NS_ENABLED = true;/m.test(app)) || (/^(Prince Edward Island|Charlottetown|Cornwall, PEI|Kensington|Montague|Souris|Stratford, PEI|Summerside|Alberton|Tignish)$/.test(b.level) && !/^const PE_ENABLED = true;/m.test(app)) || (/^(Newfoundland\ and\ Labrador|St\.\ John's|Conception\ Bay\ South|Paradise|Mount\ Pearl|Corner\ Brook|Grand\ Falls\-Windsor|Gander|Portugal\ Cove\-St\.\ Philip's|Happy\ Valley\-Goose\ Bay|Torbay|Labrador\ City|Clarenville|Stephenville)$/.test(b.level) && !/^const NL_ENABLED = true;/m.test(app)) || (/^(Quebec|Montréal|Ville\ de\ Québec|Laval|Gatineau|Longueuil|Sherbrooke|Saguenay|Lévis|Trois\-Rivières|Terrebonne|Saint\-Jean\-sur\-Richelieu|Repentigny|Brossard|Drummondville|Saint\-Jérôme|Granby)$/.test(b.level) && !/^const QC_ENABLED = true;/m.test(app))) {
      // The routing placeholder and dark-province records have no static guide.
      assert.equal(fs.existsSync(`public/guides/${b.id}.html`), false);
      continue;
    }
    const staticHtml = fs.readFileSync(`public/guides/${b.id}.html`, 'utf8');
    assert.equal(staticHtml.match(/<p class="detail-amount">([^]*?)<\/p>/)?.[1], answer, `${b.id}: static amount`);
    compared++;
  }
  assert.equal(compared, 462);
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
  // life.alberta.h is province-neutral since the 2026-10-21 landing rewrite ("Just moved to a new province").
  // orgs.lede is Canada-wide since 2026-10-21 (owner: no province lists on pages).
  // pro.what.p and partner.title are Canada-wide since 2026-10-22 (owner: no province lists on pages).
  for (const key of ['land.eyebrow']) {
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
  assert.equal(ctx.entries[0].date, '2026-10-22');
  assert.equal(ctx.entries[0].revision, undefined);
  for (let i = 0; i < ctx.entries.length; i++) {
    assert.ok(ctx.entries[i].date <= '2026-10-22');
    if (i) assert.ok(ctx.entries[i-1].date >= ctx.entries[i].date, ctx.entries[i].text);
  }
  // Records first published after the October review carry 2026-10 from their own
  // official-page build, not from that review; the review entry keeps its count.
  const ADDED_AFTER_REVIEW = ["niagara-transit-benefit-pass", "kingston-affordable-transit-pass", "halton-split", "abbotsford-prc-subsidy", "abbotsford-specialized-access", "maple-ridge-access-pass-financial", "maple-ridge-access-pass-disability", "nanaimo-leap", "new-westminster-financial-assistance", "prince-george-lap", "banff-access-program", "blackfalds-recreation-fee-assistance", "chestermere-community-access-program", "drayton-valley-recreation-fee-assistance", "edson-leisure-assist", "rocky-mountain-house-rfap", "strathmore-community-access-card", "whitecourt-recreation-fee-assistance", "belleville-recreation-fee-assistance", "chatham-kent-affordable-bus-pass", "cornwall-fair", "peterborough-recreation-subsidy", "peterborough-ow-odsp-transit-pass", "campbell-river-life", "colwood-langford-life", "courtenay-comox-rap-leap", "cranbrook-leisure-access", "duncan-leisure-access", "mission-play-pass", "penticton-life", "penticton-access-pass", "pitt-meadows-fee-subsidy", "port-moody-leisure-access", "prince-rupert-recreation-access", "quesnel-leisure-access", "squamish-recreation-access", "terrace-affordable-recreation-access", "white-rock-leisure-access", "brantford-recreation-subsidy", "cornwall-community-bus-pass", "dawson-creek-leisure-access", "high-river-community-access-program", "langley-leisure-access-grant", "morinville-wrap", "nelson-rdck-leisure-access", "port-coquitlam-financial-assistance", "sarnia-cnib-pass", "taber-fee-assistance", "west-vancouver-recreation-financial-assistance", "on-child-benefit", "on-dso-adult-services", "on-enhanced-respite", "on-gains", "on-healthy-smiles", "on-ontario-works", "on-seniors-dental", "on-trillium-benefit", "on-drug-benefit", "on-home-community-care", "on-northern-health-travel-grant", "on-odsp-employment-supports", "on-odsp-health-benefits", "on-oesp", "bc-csil", "bc-family-benefit", "bc-home-support", "bc-income-assistance", "bc-nursing-support-services", "bc-ppmb", "bc-rental-assistance-program", "bc-safer", "bc-hearing-supplements", "ab-blue-cross-non-group", "ab-brain-injury", "ab-child-family-benefit", "ab-home-care", "ab-income-support", "ab-rent-assistance-benefit", "ab-seniors-benefit", "ab-seniors-dental-optical", "ab-seniors-special-needs-assistance", "ab-sharp", "bc-subsidized-housing", "on-childrens-rehab", "sk-said", "sk-income-support", "sk-employment-incentive", "sk-housing-benefit", "sk-sail", "sk-supplementary-health", "sk-family-health-benefits", "sk-special-support", "sk-seniors-drug-plan", "sk-seniors-income-plan", "sk-autism-individualized-funding", "sk-cognitive-disability-strategy", "sk-family-respite-intellectual-disability", "sk-home-care", "sk-adaptations-for-independence", "sk-eapd", "sk-personal-care-home-benefit", "sk-accessible-parking", "sk-active-families-benefit", "sk-low-income-tax-credit", "sk-early-childhood-intervention", "sk-cochlear-processor", "regina-affordable-access", "regina-paratransit", "saskatoon-access-transit", "saskatoon-leisure-access-program", "saskatoon-low-income-bus-pass", "north-battleford-handi-bus", "regina-discounted-31-day-pass", "moose-jaw-discounted-monthly-pass", "moose-jaw-paratransit", "prince-albert-access-transit", "saskatoon-accessible-parking-permit-subsidy", "yorkton-access-transit", "yorkton-discounted-monthly-pass", "swift-current-access-transit", "mb-supports-persons-disabilities", "mb-eia", "mb-rent-assist", "mb-pharmacare", "mb-disability-health-supports", "mb-childrens-disability-services", "mb-community-living-disability-services", "mb-home-care", "mb-primary-caregiver-tax-credit", "mb-child-benefit", "mb-55-plus", "mb-accessible-parking", "mb-residential-adaptations", "winnipeg-recreation-fee-assistance", "winnipeg-winnpass", "winnipeg-transit-plus", "mb-eapd", "mb-rent-supplement", "mb-prenatal-benefit", "brandon-access-transit", "brandon-cnib-free-transit", "nb-social-assistance", "nb-disability-support-program", "nb-self-managed-support", "nb-employment-support-services", "nb-tess", "nb-family-supports-children", "nb-vehicle-retrofit", "nb-accessible-parking", "nb-prescription-drug-program", "nb-healthy-smiles-clear-vision", "nb-preschool-autism", "nb-long-term-care-home-support", "nb-extra-mural", "nb-low-income-seniors-benefit", "nb-child-tax-benefit", "nb-health-services-equipment", "nb-portable-rent-supplement", "nb-rent-supplement", "nb-rrap", "nb-ambulance-fee-exemption", "moncton-cnib-free-transit", "dieppe-accessible-transit", "fredericton-para-transit", "saint-john-accessible-transit", "saint-john-pro-kids", "nb-drug-plan", "nb-hearing-aid-program", "nb-public-housing", "nb-seniors-home-renovation-credit", "nb-childcare-assistance", "nb-homeowner-repair", "ns-income-assistance", "ns-disability-support-program", "ns-direct-family-support-children", "ns-caregiver-benefit", "ns-osd-pharmacare", "ns-seniors-pharmacare", "ns-family-pharmacare", "ns-harp", "ns-seniors-care-grant", "ns-seniors-property-tax-rebate", "ns-housing-repair-accessibility", "ns-rent-supplement", "ns-accessible-parking", "ns-poverty-reduction-credit", "ns-childrens-oral-health", "ns-community-bus-pass", "ns-seniors-wheelchair-loan", "ns-day-programs", "ns-public-housing", "ns-preschool-autism", "ns-ambulance-fee-waiver", "ns-student-loan-forgiveness-disabilities", "bridgewater-pro-kids", "ns-child-benefit", "ns-affordable-living-tax-credit", "ns-home-care", "ns-home-support-direct-funding", "ns-self-managed-care", "ns-home-lift", "ns-specialized-bed-loan", "ns-respite-care", "ns-child-care-subsidy", "pe-caregiver-benefit", "pe-renovation-persons-disabilities", "pe-home-renovation-seniors", "pe-seniors-safe-at-home", "pe-dental-care", "pe-home-energy-low-income", "pe-out-of-province-travel", "pe-accessability-supports", "pe-social-assistance", "pe-seniors-hearing-aid", "pe-family-health-benefit", "pe-catastrophic-drug", "pe-generic-drug", "pe-financial-assistance-drug", "pe-seniors-drug", "pe-seniors-independence-initiative", "pe-family-housing", "pe-seniors-housing", "pe-child-care-subsidy", "pe-autism-funding", "pe-severe-permanent-disability-benefit", "pe-accessible-parking", "pe-home-care", "pe-seniors-property-tax-deferral", "pe-children-complex-needs", "pe-coach", "pe-adult-day-programs", "nl-income-support", "nl-disability-benefit", "nl-health-related-services", "nl-child-benefit", "nl-prenatal-nutrition", "nl-foundation-plan", "nl-65plus-plan", "nl-access-plan", "nl-assurance-plan", "nl-special-assistance", "nl-home-support", "nl-special-child-welfare-allowance", "nl-direct-home-services", "nl-community-behavioural-services", "nl-paid-family-caregiving", "nl-home-modification", "nl-home-repair", "nl-rental-housing", "nl-housing-benefit", "nl-seniors-benefit", "nl-income-supplement", "nl-child-care-subsidy", "nl-accessible-parking", "nl-student-disabilities", "nl-mtap", "st-johns-children-recreation-subsidy", "st-johns-adult-recreation-subsidy", "st-johns-attendant-pass", "st-johns-gobus", "paradise-accessible-transit", "corner-brook-cbt-link", "corner-brook-free-transit-pass", "nl-moving-into-workforce", "nl-dental-programs", "nl-caregiver-benefit", "qc-solidarite-sociale", "qc-aide-sociale", "qc-revenu-base", "qc-objectif-emploi", "qc-reussir", "qc-allocation-famille", "qc-supplement-enfant-handicape", "qc-sehnse", "qc-rente-invalidite", "qc-soutien-familles", "qc-aides-auditives", "qc-aides-visuelles", "qc-appareils-deficience-physique", "qc-aides-elimination", "qc-chien-assistance", "qc-aides-vie-quotidienne", "qc-triporteurs", "qc-ambulateurs", "qc-tricycles", "qc-chaussures-orthetiques", "qc-aides-communication", "qc-transport-hebergement", "qc-services-deficience", "qc-soutien-domicile", "qc-adaptation-domicile", "qc-supplement-loyer", "qc-vignette-stationnement", "qc-adaptation-vehicule", "qc-carte-accompagnement-loisir", "qc-allocation-logement", "qc-hlm", "qc-assurance-medicaments", "qc-prestations-speciales", "qc-besoins-particuliers-adultes", "qc-besoins-particuliers-jeunes", "qc-prets-bourses-dfm", "montreal-transport-adapte", "laval-transport-adapte", "rtl-transport-adapte", "exo-transport-adapte", "quebec-equimobilite", "gatineau-echo", "gatineau-transport-adapte", "sherbrooke-transport-adapte", "trois-rivieres-tarification-sociale", "trois-rivieres-transport-adapte", "qc-carte-accompagnement-autocar", "qc-agir-tot", "qc-artistes-handicap", "qc-credit-solidarite", "qc-credit-personne-aidante", "qc-deficience-grave-prolongee", "qc-prime-travail-adaptee", "qc-credit-maintien-domicile", "qc-pefsad", "qc-protheses-oculaires", "qc-lunettes-enfants", "qc-services-dentaires", "qc-services-optometriques", "halifax-access-a-bus", "halifax-affordable-transit-pass", "halifax-recreation-access", "morden-handi-van"];
  // Records re-checked in the 2026-10-19/20 full audit carry 2026-10 from that audit.
  const REVERIFIED_IN_AUDIT = ["canada-caregiver-credit", "canadian-dental-care-plan", "cdb-adult", "child-disability-benefit", "cpp-childrens-benefit", "cpp-disability", "cwb-disability", "disability-supports-deduction", "dtc", "excise-gasoline-tax-refund", "medical-expense-tax-credit", "multigenerational-home-renovation-tax-credit", "rdsp", "london-ontario-renovates", "bc-supported-child-development", "dres", "sparc-parking-permit", "bc-workbc-employment-services", "kelowna-recreation-assistance", "woodbuffalo-lift", "bc-optical-supplement", "stalbert-subsidy", "bc-monthly-nutritional-supplement", "mississauga-activeassist", "bc-medical-equipment-devices", "bc-msp-supplementary-benefits", "bc-work-able-internship", "reddeer-fee-assistance", "ramp", "edmonton-fare-assistance", "aadl", "ab-capcc", "bc-pwd-designation", "taxisaver-translink", "bc-dental-supplement", "ottawa-hand-in-hand", "bc-pharmacare-plan-c", "leduc-subsidies", "bc-learning-disability-assessment-bursary", "on-parking-permit", "bc-access-grant-deaf-students", "bc-fnha-health-benefits", "victoria-life", "bc-sales-tax-credit", "bc-at-home-saet", "pdd", "parking-placard", "child-health-benefit", "grt-affordable-transit", "ottawa-access-pass", "handydart-translink", "grt-mobilityplus", "ottawa-equipass", "handycard-translink", "odsp", "bc-property-tax-deferment-disabilities", "bc-autism-funding-6-18", "grandeprairie-aish-pass", "bc-medical-transportation", "local-supports", "bc-healthy-kids", "bc-fair-pharmacare", "windsor-affordable-pass", "windsor-recreation-assistance", "calgary-fair-entry", "strathcona-subsidy", "bc-csg-services-equipment", "bc-additional-home-owner-grant", "kamloops-arch", "ottawa-community-pass", "bc-clbc"];
  const count = vm.runInContext(`Object.entries(BENEFIT_VERIFIED).filter(([id, d]) => d === "2026-10" && !${JSON.stringify([...ADDED_AFTER_REVIEW, ...REVERIFIED_IN_AUDIT])}.includes(id)).length`, ctx);
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
