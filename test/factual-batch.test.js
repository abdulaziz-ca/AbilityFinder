"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function loadData() {
  const source = fs.readFileSync(path.join(ROOT, "public", "data.js"), "utf8");
  const context = { window: {}, document: {}, navigator: {}, console };
  vm.runInNewContext(
    `${source}
    ;globalThis.__captured = { BENEFITS, BENEFIT_VALUES, BENEFIT_META };`,
    context,
    { filename: "public/data.js" }
  );
  return context.__captured;
}

const { BENEFITS, BENEFIT_VALUES, BENEFIT_META } = loadData();

test("batch four: Surrey's unlabelled table and route qualifiers match the snapshot", () => {
  const b = benefitById("surrey-leisure-access");
  assert.deepEqual(JSON.parse(JSON.stringify(b.amountTiers.rows)), [
    ["1", "$26,355"], ["2", "$32,075"], ["3", "$39,940"],
    ["4", "$49,829"], ["5", "$56,742"], ["6", "$62,928"],
    ["7", "$69,112"], ["8 and more", "$6,186 for each additional person"],
  ]);
  assert.equal(b.amountTiers.headers[1], "Family net income");
  assert.doesNotMatch(b.amountTiers.caption, /20\d\d/);
  assert.equal(b.eligibility.mode, "any");
  assert.equal(b.eligibility.items.length, 6);
  assert.match(b.eligibility.note, /may qualify/);
  assert.ok(b.eligibility.items[2].length <= 120);
  assert.ok(b.eligibility.items[4].length <= 120);
  assert.match(b.eligibility.note, /less than.*other income-line limits/);
  assert.match(b.eligibility.note, /SAJE.*one legal guardian/);
  assert.match(b.amount, /most registered courses/);
  assert.match(b.note, /up to \$500 plus \$500.*up to \$250 plus \$250/);
  assert.match(b.note, /Applicable day camps for children \(0 to 12\) and youth \(13 to 18\).*no discount limits/);
  assert.match(b.detail.documents.join(" "), /Proof of Income Statement.*Canada Groceries and Essentials/);
  assert.ok(b.requires.includes("surreyLeisureRoute"));
  assert.ok(!b.requires.includes("lowIncome"));
});

test("batch four: Vancouver has one three-column table with route-specific limits", () => {
  const b = benefitById("vancouver-leisure-access");
  assert.deepEqual(JSON.parse(JSON.stringify(b.amountTiers.headers)), [
    "Family size", "Disability Tax Credit route", "Low-income self-referral and EI routes",
  ]);
  assert.deepEqual(JSON.parse(JSON.stringify(b.amountTiers.rows)), [
    ["1 person", "$53,166", "$43,028"], ["2 people", "$70,972", "$60,834"],
    ["3 people", "$84,645", "$74,507"], ["4 people", "$96,171", "$86,033"],
    ["5 people", "$106,325", "$96,187"], ["6 people", "$115,506", "$105,368"],
    ["7 people", "$123,948", "$113,810"],
    ["Each additional person", "Not stated on the page", "Add $8,450"],
  ]);
  assert.equal(b.eligibility.mode, "any");
  assert.equal(b.eligibility.items.length, 7);
  assert.match(b.eligibility.items[0], /receives.*shown on/);
  assert.match(b.eligibility.items[4], /agency.*refers you/);
  assert.match(b.eligibility.items[6], /projected family income/);
  assert.match(b.eligibility.note, /investors or entrepreneurs/);
  for (const value of ["$1,500", "$2,000", "12100", "12600", "12700"])
    assert.ok(b.eligibility.note.includes(value));
  assert.match(b.summary, /outdoor pools.*online reservation/);
  assert.match(b.amount, /group swimming and skating lessons/);
});

test("batch four: document exceptions, hedges and processing periods stay explicit", () => {
  assert.match(benefitById("fscd").detail.documents[0], /awaiting a diagnosis/);
  const handy = benefitById("handycard-translink");
  assert.match(handy.requiresNote, /may also be eligible/);
  assert.match(handy.detail.time, /4 to 6 weeks/);
  assert.match(BENEFIT_META[handy.id].wait, /4 to 6 weeks/);
  const local = benefitById("local-supports");
  assert.match(local.detail.about, /In most of Canada.*excluding statutory holidays/);
  assert.equal(typeof local.applyUrl, "function");
  assert.equal(typeof local.source, "function");
  assert.equal(local.applyUrl({ province: "other" }), "https://211.ca/");
  const strathcona = benefitById("strathcona-subsidy").detail.documents.join(" ");
  assert.match(strathcona, /2025 NOA.*June 1, 2026.*2024 NOA.*no longer accepted/);
  assert.match(strathcona, /New refugee or permanent resident.*first year.*Canadian bank/);
  assert.match(benefitById("stalbert-subsidy").note, /does not say whether.*confirm with the City/);
  const grant = benefitById("bc-access-grant-students-disabilities");
  assert.match(grant.note, /same program at the same school.*may request.*July 31, 2029.*whichever/);
  assert.match(grant.requiresNote, /^You may be eligible/);
  assert.match(benefitById("bc-at-home-saet").summary, /^May help.*out-of-school/);
});

test("batch four: ADAP employment wording and autism assessment routes retain qualifiers", () => {
  const adap = benefitById("adap");
  assert.ok(adap.requires.includes("adapAge"));
  assert.match(adap.summary, /severe.*continuously or episodically.*does not prevent/);
  assert.match(adap.detail.about, /significantly restrict but not prevent/);
  for (const id of ["bc-autism-funding-6-18", "bc-autism-funding-under-6"]) {
    const b = benefitById(id);
    assert.match(b.note, /eligibility to transfer/);
    assert.doesNotMatch(b.note, /in phases/);
    assert.match(b.detail.documents.join(" "), /PANTER.*optional.*CF0904.*ADOS-2.*ADI-R.*CF0905/);
    assert.doesNotMatch(b.detail.documents.join(" "), /Personal Health Number/);
    assert.equal(BENEFIT_META[id].effort, "Application + diagnosis form for your assessment route");
  }
  const older = benefitById("bc-autism-funding-6-18");
  assert.match(older.detail.coversList.items[3], /should be supervised/);
  assert.match(older.detail.about, /bookkeeper.*direct payment accountant fees/);
  const younger = benefitById("bc-autism-funding-under-6");
  assert.match(younger.detail.tips[0], /interventionists supervised.*do not need to be on RASP/);
  assert.match(younger.detail.tips.at(-1), /may be eligible/);
  assert.match(younger.detail.documents[2], /speech-language and psychological/);
});

test("batch two: transit and recreation values retain all source limits", () => {
  const edmonton = benefitById("edmonton-fare-assistance");
  assert.match(edmonton.amount, /\$35 or \$50.*depending on household income/);
  assert.match(BENEFIT_VALUES[edmonton.id].note, /\$35 or \$50.*depending on household income/);
  assert.doesNotMatch(JSON.stringify(edmonton), /\$36|automatically considers|You qualify on/);
  const lethbridge = benefitById("lethbridge-fee-assistance");
  for (const text of [lethbridge.amount, BENEFIT_VALUES[lethbridge.id].note]) {
    assert.match(text, /up to \$150 per person per season toward one recreation or culture program, while funds are available/);
  }
  const hat = benefitById("medicinehat-fair-entry");
  for (const text of [hat.amount, BENEFIT_VALUES[hat.id].note]) {
    assert.match(text, /up to 75%.*up to \$630\/yr per person/);
    assert.equal((text.match(/up to \$200\/yr per person/g) || []).length, 2);
    assert.match(text, /separate.*Esplanade education/);
  }
  assert.match(hat.detail.about, /regular-priced.*City-run pools.*provided directly by Esplanade staff/);
  assert.match(hat.detail.time, /missing information may delay/);
  // These are discount descriptions, not cash computations. None may enter
  // an annual or monthly estimate using the old price or an assumed subsidy.
  for (const id of [edmonton.id, lethbridge.id, hat.id]) {
    const value = BENEFIT_VALUES[id];
    assert.equal(value.kind, "discount");
    for (const field of ["annualMax", "annualMin", "monthlyMax", "monthlyMin"])
      assert.equal(value[field], undefined, `${id}.${field}`);
  }
});

test("batch two: tax lines, supported dependants and prior-year exclusion", () => {
  const medical = benefitById("medical-expense-tax-credit");
  const steps = medical.detail.steps.join(" ");
  assert.match(steps, /total on line 33099/);
  assert.match(steps, /line below.*lesser of 3%.*\$2,834/);
  assert.match(steps, /following line of your return/);
  assert.match(steps, /residents of Canada at any time in the year/);
  assert.doesNotMatch(steps, /any other dependant|result on line 33099/);
  assert.match(medical.detail.tips[1], /not already claimed in the prior year/);
});

test("batch two: conditional coverage, choices and alternative documents stay qualified", () => {
  const csg = benefitById("csg-dse");
  assert.match(csg.summary, /Helps pay.*if you qualify.*can include.*depending on your needs/);
  assert.match(csg.note, /depends on your needs and your application/);
  assert.equal(csg.source, "https://www.canada.ca/en/employment-social-development/services/education/grants/disabilities.html");
  const rdsp = benefitById("rdsp");
  for (const text of [rdsp.summary, rdsp.detail.about, rdsp.detail.aboutList.lead]) {
    assert.match(text, /may (add|pay)/);
    assert.match(text, /depending on (your )?family income/);
    assert.match(text, /contribut/);
  }
  const richmond = benefitById("richmond-rec-fee-subsidy");
  for (const text of [richmond.amount, richmond.summary]) {
    assert.match(text, /many drop-in programs and services/);
    assert.match(text, /most registered programs/);
  }
  assert.match(richmond.requiresNote, /government assistance.*do not receive them.*other financial limits/);
  const saanich = benefitById("saanich-life");
  assert.match(saanich.amount, /Option 1:.*52 regional.*Option 2: 50% off an annual/);
  assert.match(saanich.note, /children.*youth.*may.*strict eligibility.*no guarantee/);
  for (const text of [saanich.eligibility.note, saanich.requiresNote]) {
    assert.match(text, /landing.*within one year/);
    assert.match(text, /adjudicator form/);
    assert.match(text, /local school.*parental or guardian support/);
  }
  assert.match(benefitById("taxi-saver-bctransit").detail.steps[4], /remainder in cash/);
});

test("batch two: HATC and Richmond use isolated gates", () => {
  assert.deepEqual(Array.from(benefitById("home-accessibility-tax-credit").requires),
    ["hatcQualifyingPerson", "hatcEligibleDwelling", "hatcQualifyingRenovationSpend"]);
  assert.ok(benefitById("richmond-rec-fee-subsidy").requires.includes("richmondFinancialHardship"));
  assert.ok(benefitById("saanich-life").requires.includes("lowIncome"));
  assert.ok(benefitById("bc-home-reno-tax-credit").requires.includes("bcHomeRenoSpend"));
  assert.ok(benefitById("multigenerational-home-renovation-tax-credit").requires.includes("mhrtcQualifyingIndividual"));
});

test("batch five: student verification exceptions and distinct request routes survive", () => {
  const equipment = benefitById("bc-csg-services-equipment");
  const student = benefitById("bc-csg-students-disabilities");
  assert.match(equipment.detail.steps[0], /Specific Learning Disorders.*different verification requirements/);
  assert.match(equipment.detail.steps[2], /Equipment Request form to Assistive Technology BC.*Services Request form to StudentAid BC/);
  assert.match(equipment.detail.steps[3], /equipment is ordered.*notification/);
  assert.doesNotMatch(equipment.detail.steps.join(" "), /decisions are posted/);
  assert.match(BENEFIT_META[equipment.id].effort, /Appendix 8 if you applied before June 19, 2026/);
  assert.match(student.detail.steps[2], /do not require the form/);
  assert.match(student.detail.steps[3], /if your disability needs it/);
  assert.match(student.detail.documents[1], /not required for some disabilities/);
  const bursary = benefitById("bc-supplemental-bursary-students-disabilities");
  assert.match(bursary.summary, /may be eligible.*qualify for the Canada Student Grant/);
  assert.match(bursary.requiresNote, /qualify for the Canada Student Grant/);
  assert.match(bursary.note, /same program at the same school.*whichever occurs first/);
  assert.match(benefitById("cpp-childrens-benefit").detail.tips[1], /full-time or part-time, can apply and renew online/);
});

test("batch five: youth transition boundaries remain conditional and isolated", () => {
  const b = benefitById("bc-cy-disability-benefit");
  assert.deepEqual(Array.from(b.requires), ["bc", "bcCydbAge", "childHighNeeds", "bcCydbIntake"]);
  for (const text of [b.summary, b.requiresNote, b.eligibility.items[0]]) {
    assert.match(text, /last day of (?:their|the) 19th birthday month/);
  }
  for (const text of [b.detail.about, b.detail.aboutList.items[1]]) {
    assert.match(text, /degenerative conditions with predictable decline/);
  }
  assert.match(b.note, /Eligible families.*will not need to apply.*may be asked.*additional information/);
  assert.match(b.note, /province-wide by April 1, 2027/);
  assert.match(b.detail.steps[1], /before March 31, 2027.*if they are eligible/);
  assert.match(b.detail.tips[0], /if they are eligible/);
  assert.match(b.detail.documents[0], /others may be asked for additional information/);
  assert.match(b.detail.steps[2], /^After April 1, 2027/);
  assert.match(b.detail.time, /after April 1, 2027/);
  assert.match(b.detail.tips[3], /1-844-442-2800.*PAIRS.*1-844-878-4700.*excluding statutory holidays/);
  assert.ok(benefitById("bc-healthy-kids").requires.includes("under19"));
  assert.ok(benefitById("bc-home-reno-tax-credit").requires.includes("bcHomeRenoSpend"));
  assert.ok(benefitById("multigenerational-home-renovation-tax-credit").requires.includes("qualifyingRenovationSpend"));
});

test("batch five: dental medical equipment and optical coverage keep exceptions", () => {
  const dental = benefitById("bc-dental-supplement");
  assert.match(dental.eligibility.items[0], /may be able.*persistent multiple barriers/);
  for (const text of [dental.requiresNote, dental.eligibility.note]) {
    assert.match(text, /may also be eligible for dentures.*complete upper and\/or lower teeth.*previous six months.*relieve pain/);
  }
  assert.match(dental.detail.time, /may be able/);
  const pwd = benefitById("bc-disability-assistance-pwd");
  assert.match(pwd.detail.about, /minimum is \$75/);
  assert.match(pwd.detail.aboutList.items[0], /minimum is \$75/);
  assert.match(pwd.detail.steps[4], /month following designation.*month of your 18th birthday/);
  const medical = benefitById("bc-medical-equipment-devices");
  assert.match(medical.amount, /more only if the excess is from unusual installation expenses/);
  assert.match(medical.note, /except in cases of a life-threatening emergency.*Co-funding may be considered/);
  assert.match(medical.detail.tips[0], /except in cases of a life-threatening emergency/);
  assert.match(medical.detail.about, /and\/or the medical need confirmed/);
  assert.match(medical.detail.steps[1], /and\/or an assessment/);
  assert.match(medical.detail.documents[0], /and\/or therapist assessment/);
  assert.match(medical.detail.aboutList.items[2], /automatic turning beds and containment type beds/);
  const optical = benefitById("bc-optical-supplement");
  for (const text of [optical.amount, optical.detail.about, optical.detail.aboutList.items[2], optical.detail.tips[1]]) {
    assert.match(text, /eye doctor confirms a change in your prescription/);
  }
  assert.match(optical.detail.aboutList.items[3], /necessary repairs to lenses or frames/);
  assert.match(optical.note, /may be responsible/);
});

test("batch five: MSP retains eight possible routes residency tax and mail qualifiers", () => {
  const b = benefitById("bc-msp-supplementary-benefits");
  assert.equal(b.eligibility.mode, "all");
  assert.equal(b.eligibility.note.items.length, 8);
  assert.match(b.eligibility.note.lead, /may be eligible include/);
  assert.match(b.eligibility.items[2], /last 12 months.*not exempt/);
  assert.match(b.note, /many practitioners.*allowed to charge more/);
  assert.match(b.summary, /may also be eligible for the Healthy Kids Program/);
  assert.match(b.detail.aboutList.items[2], /may also be eligible/);
  assert.match(b.detail.tips[2], /eligibility may be affected/);
  assert.match(b.detail.tips[4], /may be eligible.*hearing assistance/);
  assert.match(b.detail.documents[1], /Assessment or Reassessment.*if you apply by mail, include copies/);
  assert.doesNotMatch(b.requiresNote, /one of three ways/);
});

function benefitById(id) {
  return BENEFITS.find((benefit) => benefit.id === id);
}

function joinedBenefitText(benefit) {
  return [
    benefit.amount,
    benefit.summary,
    benefit.note,
    benefit.detail && benefit.detail.about,
    ...((benefit.detail && benefit.detail.tips) || []),
  ].filter(Boolean).join("\n");
}

test("DATA-07: Calgary shows the current 2026 transit bands", () => {
  const benefit = benefitById("calgary-fair-entry");
  assert.ok(benefit, "calgary-fair-entry record was found");
  const value = BENEFIT_VALUES["calgary-fair-entry"];
  assert.ok(value, "calgary-fair-entry BENEFIT_VALUES entry was found");

  const text = [joinedBenefitText(benefit), value.note].filter(Boolean).join("\n");
  assert.match(text, /6\.30/);
  assert.match(text, /44\.10/);
  assert.match(text, /63/);
  assert.doesNotMatch(text, /5\.90/);
  assert.doesNotMatch(text, /\$59\b/);
  assert.doesNotMatch(text, /600\+/);
  assert.doesNotMatch(text, /75\s?%/);
  assert.match(text, /lower-cost recreation/);
});

test("Calgary carries no unsupported recreation percentage, but other cities keep theirs", () => {
  // Calgary publishes no percentage; the other municipal figures come from
  // different city sources and were NOT re-verified, so they must survive.
  const benefit = benefitById("calgary-fair-entry");
  assert.ok(benefit, "calgary-fair-entry record was found");
  const value = BENEFIT_VALUES["calgary-fair-entry"];
  assert.ok(value, "calgary-fair-entry BENEFIT_VALUES entry was found");
  const calgary = [
    benefit.amount,
    benefit.summary,
    benefit.note,
    benefit.detail && benefit.detail.about,
    value.note,
  ].filter(Boolean).join(" | ");
  assert.ok(!/\d{1,3}\s?%/.test(calgary), "Calgary must not state any percentage");

  for (const id of ["medicinehat-fair-entry", "grandeprairie-aish-pass", "airdrie-fair-access", "woodbuffalo-lift"]) {
    const record = BENEFITS.find((b) => b.id === id);
    assert.ok(record, `expected to find ${id}`);
    const text = [record.amount, record.summary, record.note, record.detail && record.detail.about]
      .filter(Boolean).join(" | ");
    assert.match(text, /\d{1,3}\s?%/, `${id} should still state its own percentage`);
  }
});

test("Wood Buffalo LIFT states the official specialized-transit ride counts", () => {
  const record = benefitById("woodbuffalo-lift");
  assert.ok(record, "expected to find woodbuffalo-lift");
  const text = [record.amount, record.summary, record.note, record.detail && record.detail.about]
    .filter(Boolean).join(" | ");
  // Verified 2026-07-28 at rmwb.ca/LIFT: "75% discount on 10 and 25-ride passes".
  assert.match(text, /10- and 25-ride/);
  assert.doesNotMatch(text, /20-ride/);
  // The figures that were already correct must survive.
  assert.match(text, /\$10/);
  assert.match(text, /75%/);
  assert.match(text, /60%/);
});

test("DATA-08: Edmonton states the real processing time", () => {
  const benefit = benefitById("edmonton-fare-assistance");
  assert.ok(benefit, "edmonton-fare-assistance record was found");
  assert.ok(BENEFIT_META["edmonton-fare-assistance"], "edmonton-fare-assistance metadata was found");

  assert.equal(BENEFIT_META["edmonton-fare-assistance"].wait, "8–12 weeks");
  assert.match(benefit.detail.time, /8 to 12 weeks/);
  assert.match(benefit.detail.time, /10 more business days/);
  assert.doesNotMatch(benefit.detail.time, /couple of weeks/i);
});

test("DATA-09: the AISH/ADAP number is labelled as Alberta labels it", () => {
  for (const id of ["adap", "aish"]) {
    const benefit = benefitById(id);
    assert.ok(benefit, `${id} record was found`);
    assert.match(benefit.detail.phone, /DIA Application Processing Centre/);
    assert.ok(benefit.detail.phone.includes("1-877-759-6810"));
    assert.doesNotMatch(benefit.detail.phone, /Alberta Supports: 1-877-759-6810/);
  }
});

// TaskView #219: only the supplied October snapshots are factual evidence.
const { extractReqs } = require("../scripts/lib/dense-surfaces");
const snapshotReqs = extractReqs(ROOT);

test("snapshot item one retains the reviewer's conservative grant amount", () => {
  assert.match(benefitById("csg-disability").amount, /^Up to \$2,800/);
});

test("Healthy Kids helps with costs and includes the income boundary", () => {
  const b = benefitById("bc-healthy-kids");
  assert.match(b.summary, /Helps pay/);
  assert.doesNotMatch(b.summary, /Free/);
  for (const text of [b.requiresNote, b.eligibility.items[0], snapshotReqs.bcHealthyKidsIncome.unmet]) {
    assert.match(text, /\$42,000 or less/);
    assert.doesNotMatch(text, /less than \$42,000/);
  }
  // This gate collects no numeric income, so there is no numeric boundary to test.
  assert.equal(snapshotReqs.bcHealthyKidsIncome.met(), false);
});

test("medical transportation retains conditions and conditional escort help", () => {
  const b = benefitById("bc-medical-transportation");
  assert.deepEqual(Array.from(b.requires), ["bc", "bcMedTransportRoute", "bcMedTransportNeed"]);
  assert.match(b.summary, /Helps pay for extraordinary transportation costs to and from essential medical treatment/);
  assert.match(b.eligibility.items.join(" "), /income assistance and reside in a special care facility/);
  assert.match(b.requiresNote, /income assistance while residing in a special care facility/);
  for (const text of [b.detail.about, b.detail.aboutList.items.join(" ")]) {
    assert.match(text, /escort costs may be paid if required/);
    assert.match(text, /may only be considered/);
    assert.match(text, /child under 19/);
    assert.match(text, /verified medical reasons/);
    assert.doesNotMatch(text, /Escort costs are covered/);
  }
  for (const text of [b.requiresNote, snapshotReqs.bcMedTransportNeed.unmet]) {
    assert.match(text, /You do not have resources available to cover your medical transportation costs/);
  }
  assert.match(snapshotReqs.bcMedTransportNeed.unmet, /daily appointments/);
  assert.match(snapshotReqs.bcMedTransportNeed.unmet, /reasonable timeframe/);
  assert.match(snapshotReqs.bcMedTransportRoute.unmet, /Medical Services Only/);
});

test("At Home Medical routes retain assessment and nursing or palliative alternatives", () => {
  const b = benefitById("bc-at-home-medical");
  assert.ok(b.requires.includes("bcAtHomeMedicalRoute"));
  assert.ok(!b.requires.includes("childThreeAdls"));
  for (const text of [b.requiresNote, b.detail.aboutList.items.join(" "), snapshotReqs.bcAtHomeMedicalRoute.unmet]) {
    assert.match(text, /[Aa]ssessed dependence in at least three/);
    assert.match(text, /eating, dressing, toileting and washing/);
    assert.match(text, /Nursing Support Services direct nursing care/);
    assert.match(text, /palliative condition with life expectancy of up to six months/);
    assert.match(text, /physician or nurse practitioner/);
    assert.match(text, /[Nn]o eligibility assessment|without an eligibility assessment/);
  }
  assert.equal(snapshotReqs.bcAtHomeMedicalRoute.met(), false);
  assert.ok(benefitById("bc-at-home-saet").requires.includes("childThreeAdls"));
});

test("home owner grant health-professional certification is specific to Option B", () => {
  const b = benefitById("bc-additional-home-owner-grant");
  assert.match(b.detail.about, /For Option B.*health professional must certify/);
  assert.match(b.detail.aboutList.items.join(" "), /For Option B, Form B/);
});

test("fuel tax medical routes retain permanent and complete qualifiers", () => {
  const b = benefitById("bc-fuel-tax-refund-disabilities");
  for (const text of [b.requiresNote, b.eligibility.items.join(" ")]) {
    for (const phrase of ["permanent dependence on a wheelchair", "complete and permanent functional loss of lower limbs", "permanent impairment of movement", "permanent mental disability", "permanent sight impairment", "whether or not it is available"]) {
      assert.ok(text.includes(phrase), phrase);
    }
    assert.doesNotMatch(text, /loss of function in a lower limb/);
  }
  assert.equal(b.eligibility.mode, "any");
  assert.match(b.eligibility.note, /also own or lease a vehicle/);
});

test("benefit-specific alternative gates stay soft and have short nondigit cues", () => {
  for (const key of ["bcMedTransportRoute", "bcMedTransportNeed", "bcStcAgeOrFamily", "burnabyFairPlayRoute", "bcAtHomeMedicalRoute"]) {
    const gate = snapshotReqs[key];
    assert.equal(gate.fixed, false, key);
    assert.ok(gate.short.length <= 80, key);
    assert.doesNotMatch(gate.short, /\d/);
    assert.ok(gate.who.length > 0, key);
  }
  for (const key of ["bcMedTransportRoute", "burnabyFairPlayRoute"]) {
    assert.equal(snapshotReqs[key].met(), false);
    assert.match(snapshotReqs[key].met.toString(), /=> false/);
  }
  assert.ok(benefitById("bc-sales-tax-credit").requires.includes("bcStcAgeOrFamily"));
  assert.match(snapshotReqs.bcStcAgeOrFamily.unmet, /spouse or common-law partner, or were a parent/);
});

test("FAIR Play keeps CDB, CUAET and agency-referral alternatives on all surfaces", () => {
  const b = benefitById("burnaby-fair-play");
  assert.ok(b.requires.includes("burnabyFairPlayRoute"));
  assert.ok(!b.requires.includes("lowIncome"));
  for (const text of [b.requiresNote, b.eligibility.items.join(" "), snapshotReqs.burnabyFairPlayRoute.unmet]) {
    assert.match(text, /currently receiv\w* the Child Disability Benefit/);
    assert.match(text, /[Tt]his application is only for your child/);
    assert.match(text, /current Canadian Ukraine Emergency Travel Authorization/);
  }
  for (const text of [b.detail.steps.join(" "), b.detail.documents.join(" ")]) {
    assert.match(text, /household application/);
    assert.match(text, /FAIR Play Agency Referral Form/);
    assert.match(text, /approved referral agency worker/);
  }
});

test("no other record's figures were disturbed", () => {
  const medicineHat = benefitById("medicinehat-fair-entry");
  assert.ok(medicineHat, "medicinehat-fair-entry record was found");
  assert.match(medicineHat.amount, /\$630/);

  const grandePrairie = benefitById("grandeprairie-aish-pass");
  assert.ok(grandePrairie, "grandeprairie-aish-pass record was found");
  assert.match(grandePrairie.amount, /\$10\.25/);

  const woodBuffalo = benefitById("woodbuffalo-lift");
  assert.ok(woodBuffalo, "woodbuffalo-lift record was found");
  assert.match(woodBuffalo.amount, /\$10\/month/);

  const recreationPercentageRecords = BENEFITS.filter((benefit) =>
    joinedBenefitText(benefit).includes("75%")
  );
  assert.ok(
    recreationPercentageRecords.length >= 5,
    `expected at least 5 records containing 75%, found ${recreationPercentageRecords.length}`
  );
});

test("Kelowna recreation assistance LICO table equals the City's 2025 page", () => {
  const benefit = benefitById("kelowna-recreation-assistance");
  assert.ok(benefit, "kelowna-recreation-assistance record was found");
  const page = [["1", "$26,926"], ["2", "$33,519"], ["3", "$41,208"], ["4", "$50,032"], ["5", "$56,744"], ["6", "$64,000"], ["7", "$71,254"]];
  assert.equal(JSON.stringify(benefit.amountTiers.rows), JSON.stringify(page));
  assert.equal(benefit.amountTiers.headers[1], "Family net income");
  const note = benefit.requiresNote;
  for (const pairing of [
    /\$26,926 for a family of 1\b/,
    /\$33,519 for 2\b/,
    /\$41,208 for 3\b/,
    /\$50,032 for 4\b/,
    /\$56,744 for 5\b/,
    /\$64,000 for 6\b/,
    /\$71,254 for 7\b/,
  ]) assert.match(note, pairing);
  assert.doesNotMatch(JSON.stringify(benefit), /31,264|38,922|47,851|58,096|65,892|74,315|82,739/);
  assert.match(benefit.detail.time, /may take up to two weeks from the date of submission, provided all required information is received/);
  assert.match(benefit.requiresNote, /income verification requirements and have all the necessary documentation/);
  assert.doesNotMatch(benefit.requiresNote, /\bqualify\b/);
});
