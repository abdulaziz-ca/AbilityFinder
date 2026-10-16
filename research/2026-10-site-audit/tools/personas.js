/* 14 realistic personas expressed ONLY in the production answer model
   (BLANK() in public/app.js). Where a real person's situation cannot be
   expressed (e.g. "on AISH", "on ODSP", "has a HandyCard"), the closest honest
   answers are used and the gap is noted in `note`. Steps the wizard skips for
   that person are left at their BLANK() defaults ([] / null), exactly as the
   live wizard leaves them. */
const base = (o) => ({
  forWho: "self", disabilities: [], ageBand: null, ageGroup: null, disabilityVerified: null,
  autismDiagnosis: null, onsetBefore18: null, canWalkFar: null, functionalNeeds: [],
  province: null, msp: null, bcAssistance: null, circumstances: [], citizenPR: true,
  dtc: null, situation: [], income: null, city: null, postal: null, ...o,
});
const ageGroup = (b) => (["under6", "6to11", "12to15", "16to17"].includes(b) ? "child" : b === "65plus" ? "senior" : "adult");
const P = (id, label, note, o) => { const a = base(o); a.ageGroup = ageGroup(a.ageBand); return { id, label, note, answers: a }; };

module.exports = [
  P("P01-calgary-aish", "Single adult, 45, on AISH, Calgary", "AISH receipt cannot be expressed; modelled as low income + 'disability stops me from working'. No DTC yet.", {
    disabilities: ["mental", "chronic"], ageBand: "19to59", disabilityVerified: "yes",
    functionalNeeds: ["fatiguePain", "careCoordination"], province: "AB", dtc: "no",
    situation: ["unableToWork"], income: "low", city: "Calgary" }),
  P("P02-vancouver-worker-dtc", "Working adult, 38, wheelchair user, has DTC, Vancouver", "", {
    disabilities: ["physical"], ageBand: "19to59", disabilityVerified: "yes", canWalkFar: false,
    functionalNeeds: ["transitBarrier", "equipment"], province: "BC", msp: "yes", bcAssistance: "none",
    circumstances: ["none"], dtc: "yes", situation: ["working"], income: "moderate", city: "Vancouver" }),
  P("P03-surrey-autistic-child", "Parent of an autistic 8-year-old, Surrey", "Child has a diagnosis; family has not applied for DTC yet.", {
    forWho: "child", disabilities: ["autism"], ageBand: "6to11", disabilityVerified: "yes", autismDiagnosis: "yes",
    onsetBefore18: true, functionalNeeds: ["communication", "sensory"], province: "BC", msp: "yes",
    bcAssistance: "none", circumstances: ["homeowner"], dtc: "no", situation: ["elementary"], income: "moderate", city: "Surrey" }),
  P("P04-toronto-senior-mobility", "Senior, 67, mobility needs, Toronto", "Retired; lower income.", {
    disabilities: ["physical"], ageBand: "65plus", disabilityVerified: "yes", canWalkFar: false,
    functionalNeeds: ["transitBarrier", "equipment", "homeAccess"], province: "ON", dtc: "no",
    situation: ["none"], income: "low", city: "Toronto" }),
  P("P05-ottawa-odsp", "Adult, 50, on ODSP, Ottawa", "ODSP receipt cannot be expressed; modelled as low income + unable to work.", {
    disabilities: ["mental", "braininjury"], ageBand: "19to59", disabilityVerified: "yes",
    functionalNeeds: ["memorySafety", "careCoordination", "transitBarrier"], province: "ON", dtc: "yes",
    situation: ["unableToWork"], income: "low", city: "Ottawa" }),
  P("P06-edmonton-ld-student", "Low-income student, 20, learning disability, Edmonton", "", {
    disabilities: ["learning", "adhd"], ageBand: "19to59", disabilityVerified: "yes",
    functionalNeeds: ["none"], province: "AB", dtc: "no", situation: ["student"], income: "low", city: "Edmonton" }),
  P("P07-kelowna-moderate-nodtc", "Adult, 42, chronic pain, no DTC, middle income, Kelowna", "Works part time.", {
    disabilities: ["chronic"], ageBand: "19to59", disabilityVerified: "unsure",
    functionalNeeds: ["fatiguePain"], province: "BC", msp: "yes", bcAssistance: "none", circumstances: ["homeowner", "vehicleOwner"],
    dtc: "no", situation: ["working"], income: "moderate", city: "Kelowna" }),
  P("P08-bc-pwd-victoria", "Adult, 55, PWD designation, Victoria", "", {
    disabilities: ["physical", "chronic"], ageBand: "19to59", disabilityVerified: "yes", canWalkFar: false,
    functionalNeeds: ["dailyLiving", "transitBarrier", "equipment"], province: "BC", msp: "yes", bcAssistance: "pwd",
    circumstances: ["none"], dtc: "unsure", situation: ["unableToWork"], income: "low", city: "Victoria" }),
  P("P09-reddeer-deaf-worker", "Deaf adult, 30, working, middle income, Red Deer", "", {
    disabilities: ["hearing"], ageBand: "19to59", disabilityVerified: "yes", functionalNeeds: ["communication"],
    province: "AB", dtc: "no", situation: ["working"], income: "moderate", city: "Red Deer" }),
  P("P10-ontario-child-wheelchair", "Parent of a 4-year-old wheelchair user, Hamilton", "", {
    forWho: "child", disabilities: ["physical"], ageBand: "under6", disabilityVerified: "yes", canWalkFar: false,
    functionalNeeds: ["equipment", "homeAccess"], province: "ON", dtc: "yes",
    situation: ["childcare"], income: "moderate", city: "Hamilton" }),
  P("P11-burnaby-high-income-dtc", "Adult, 48, MS, higher income, has DTC, Burnaby", "", {
    disabilities: ["physical", "chronic"], ageBand: "19to59", disabilityVerified: "yes", canWalkFar: false,
    functionalNeeds: ["fatiguePain", "homeAccess"], province: "BC", msp: "yes", bcAssistance: "none",
    circumstances: ["homeowner", "vehicleOwner"], dtc: "yes", situation: ["working"], income: "high", city: "Burnaby" }),
  P("P12-lethbridge-intellectual-adult", "Adult, 24, intellectual disability, Lethbridge (family helping)", "", {
    forWho: "family", disabilities: ["intellectual"], ageBand: "19to59", disabilityVerified: "yes", onsetBefore18: true,
    functionalNeeds: ["dailyLiving", "memorySafety", "careCoordination"], province: "AB", dtc: "unsure",
    situation: ["none"], income: "low", city: "Lethbridge" }),
  P("P13-kingston-vision-senior", "Senior, 70, low vision, Kingston", "Kingston has no municipal records.", {
    disabilities: ["vision"], ageBand: "65plus", disabilityVerified: "yes", functionalNeeds: ["transitBarrier"],
    province: "ON", dtc: "no", situation: ["none"], income: "moderate", city: "Kingston" }),
  P("P14-calgary-teen-mental", "Parent of a 15-year-old with anxiety + ADHD, Calgary", "", {
    forWho: "child", disabilities: ["mental", "adhd"], ageBand: "12to15", disabilityVerified: "unsure",
    functionalNeeds: ["unsure"], province: "AB", dtc: "unsure", situation: ["secondary"], income: "moderate", city: "Calgary" }),
];
module.exports.push((() => {
  const a = { forWho: "self", disabilities: ["physical", "chronic"], ageBand: "65plus", ageGroup: "senior", disabilityVerified: "yes",
    autismDiagnosis: null, onsetBefore18: null, canWalkFar: false, functionalNeeds: ["equipment", "transitBarrier"], province: "AB",
    msp: null, bcAssistance: null, circumstances: [], citizenPR: true, dtc: "no", situation: ["none"], income: "low", city: "Edmonton", postal: null };
  return { id: "P15-edmonton-senior", label: "Senior, 66, low income, mobility needs, Edmonton", note: "", answers: a };
})());
