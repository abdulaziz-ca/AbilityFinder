/* =============================================================================
   TEST-01 — THE ELIGIBILITY ORACLE SPECIFICATION
   TaskView #61 · spec-key AF-S0401 · issue #19

   WHAT THIS FILE IS

   An independent, versioned restatement of what each eligibility gate MEANS in
   terms of wizard answers. It is deliberately NOT a recording of what the
   matcher currently returns. A snapshot of current behaviour would lock in
   exactly the false-ready class this oracle exists to catch — the audit's
   TEST-01 finding is that the false-ready cluster was fixed as individual
   findings with no systematic net underneath it.

   The load-bearing judgement here is the `evidence` field on every gate:

     evidence: "answers"  — a wizard answer can establish this gate. The user
                            tells us their province, their age, their city,
                            whether they own a home. We know it.
     evidence: "scoped-fact" — explicit program/version/component checks, separate
                            from answers; absent checks cannot establish a gate.
     evidence: "external" — this gate depends on a fact the wizard never
                            collects and cannot collect: a caseworker's
                            adjudication, a doctor's certification, a tax
                            filing, a registration, money actually spent. The
                            product cannot know it, therefore the product must
                            never claim readiness on it.

   From that single classification the central invariant follows mechanically:

     A program with ANY external gate can never legitimately return "ready",
     for any user, ever. The best a truthful matcher can say is "almost".

   That invariant is what makes the file worth maintaining. When someone deletes
   a gate from a `requires` list, or flips an external gate to `met: () => true`,
   the program's best-case persona turns ready and the oracle fails with
   Expected: "almost" / Received: "ready".

   HOW TO MAINTAIN IT

   Adding a program to public/data.js without adding its gates here fails the
   coverage test rather than passing silently. When you add a gate, decide the
   `evidence` value first and write down why — that decision is the review, and
   it is a product decision, not a mechanical one. Bump SPEC_VERSION whenever
   the semantics of an existing entry change (not for pure additions).

   WHAT IT IS NOT

   It is not proof the gates are the RIGHT gates. Whether a program should
   require what it requires is a data-accuracy question answered against the
   official source (epic #26), not here. This file asserts that the matcher does
   what the specification says, and that no program can overclaim.
   ========================================================================== */

const SPEC_VERSION = "1.32.0";

// Separate evidence channel: never wizard answers and never official adjudication.
// GRT source snapshots fetched 2026-10-16; each yes is scoped to this program.
const SCOPED_FACTS = {
  "grt-taxi-coupons": { mobilityplusRegistered: { version: 2, components: { registered: "yes" } } },
  "grt-cnib-pass": { cnibCustomer: { version: 1, components: { customer: "yes" } } },
  "grt-affordable-transit": { atpApproval: { version: 2, components: { approved: "yes" } } },
};

/* The persona dimensions this oracle asserts over. These are the keys of the
   production answer model — see the wizard STEPS in public/app.js. Any gate
   whose satisfaction needs a dimension outside this list (unless explicitly
   reviewed as scoped-fact) is by definition
   `evidence: "external"`, because the wizard has no way to ask for it.

   TICKET NOTE: ticket #61's DONE WHEN records this list as "TBD — owner to
   specify any required dimensions not stated in the working record". Asked
   2026-08-06; the owner directed the work to proceed without adding one. So the
   list stands as the complete production answer model, which is the strongest
   form it can take — it is every question the wizard asks, and a dimension
   outside it does not exist to be asserted over. Recorded as "no additional
   dimensions required", not as an owner-authored list. If one is ever added to
   the wizard, add it here and bump SPEC_VERSION. */
const DIMENSIONS = [
  "forWho", "disabilities", "ageBand", "ageGroup", "disabilityVerified",
  "autismDiagnosis", "onsetBefore18", "canWalkFar", "functionalNeeds",
  "province", "msp", "bcAssistance", "circumstances", "citizenPR", "dtc",
  "receives", "situation", "income", "city", "postal",
];

/* The three outcome states the production matcher can return. */
const OUTCOMES = ["ready", "almost", "no"];

/* A deliberately empty-handed starting person: nothing is established, nothing
   is claimed. Every gate a program needs must be satisfied by that program's
   own declared fragments, so a persona can never pass a gate by accident of the
   baseline. `city` is set per province by the builder. */
const BASE_PERSONA = {
  forWho: "self",
  disabilities: [],
  ageBand: "19to59",
  ageGroup: "adult",
  disabilityVerified: "no",
  autismDiagnosis: "no",
  onsetBefore18: false,
  canWalkFar: true,
  functionalNeeds: ["none"],
  province: "AB",
  msp: "no",
  bcAssistance: "none",
  circumstances: ["none"],
  citizenPR: false,
  dtc: "no",
  receives: ["none"],
  situation: ["none"],
  income: "moderate",
  city: null,
  postal: null,
};

/* Default community per province, chosen so it carries no municipal program of
   its own — a persona should never satisfy a city gate it did not ask for. Both
   are real entries in CITIES_BY_PROVINCE. */
// 2026-10-17: Nanaimo and Kingston gained municipal records, so the defaults moved
// to Fort St. John and Timmins (no local record; city-sweep "none found" / unreadable).
const DEFAULT_CITY = { AB: "Camrose", BC: "Fort St. John", ON: "Timmins", SK: "Weyburn", MB: "Dauphin", NB: "Bathurst", NS: "Lunenburg" };

/* Cities used to violate a city gate: same province, different community. */
const OTHER_CITY = { AB: "Wetaskiwin", BC: "Williams Lake", ON: "Guelph", SK: "Martensville", MB: "Selkirk", NB: "Campbellton", NS: "Antigonish" };

/* --------------------------------------------------------------------------
   FRAGMENTS

   A fragment is a declarative edit to a persona:
     set:  { key: value }        scalar assignment; two gates setting the same
                                 key to different values is a CONFLICT and is
                                 reported, never silently resolved
     add:  { arrayKey: [...] }   union into a multi-select answer; adding a real
                                 value removes the "none" placeholder
     drop: { arrayKey: [...] }   remove values from a multi-select answer
   -------------------------------------------------------------------------- */

/* Shorthands for the two shapes that repeat dozens of times. */
const province = (code) => ({
  evidence: "answers",
  satisfy: { set: { province: code } },
  violations: [
    { name: "wrong province", fragment: { set: { province: code === "AB" ? "BC" : "AB" } }, expect: "no" },
  ],
});

const municipality = (name, prov) => ({
  evidence: "answers",
  satisfy: { set: { city: name } },
  violations: [
    { name: "different community", fragment: { set: { city: OTHER_CITY[prov] } }, expect: "no" },
  ],
});

/* An age gate. `band` is the canonical satisfying band; `outside` is a band the
   gate excludes. Every "N and older" gate resolves to the same adult band so
   that two age gates on one program can never collide. */
const ageGate = (band, outside) => ({
  evidence: "answers",
  satisfy: { set: { ageBand: band } },
  violations: [{ name: `age ${outside}`, fragment: { set: { ageBand: outside } }, expect: "no" }],
});

/* A functional-need gate. These are conditionally hard: `fixed` is
   !functionalNeedUnknown(), so there are two distinct violations worth
   asserting — the user who says "no such need" is not a match, while the user
   who says "I'm not sure" is one answer away, not refused. That distinction is
   a product promise and belongs in the oracle. */
const needGate = (need) => ({
  evidence: "answers",
  satisfy: { add: { functionalNeeds: [need] } },
  violations: [
    { name: "need absent", fragment: { set: { functionalNeeds: ["none"] } }, expect: "no" },
    { name: "need unsure", fragment: { set: { functionalNeeds: ["unsure"] } }, expect: "almost" },
  ],
});

/* A circumstance gate. Same conditional hardness as needGate. */
const circumstanceGate = (circumstance) => ({
  evidence: "answers",
  satisfy: { add: { circumstances: [circumstance] } },
  violations: [
    { name: "circumstance absent", fragment: { set: { circumstances: ["none"] } }, expect: "no" },
    { name: "circumstance unsure", fragment: { set: { circumstances: ["unsure"] } }, expect: "almost" },
  ],
});

/* A gate that needs one disability category selected. */
const disabilityGate = (value) => ({
  evidence: "answers",
  satisfy: { add: { disabilities: [value] } },
  violations: [
    { name: "category not selected", fragment: { drop: { disabilities: [value] } }, expect: "no" },
  ],
});

/* An external gate: no persona can satisfy it, so it needs no satisfy fragment
   and no violations. `why` is the product reason it is unknowable, and it is
   the field a reviewer should argue with. */
const external = (why) => ({ evidence: "external", why });

/* --------------------------------------------------------------------------
   THE GATE REGISTRY

   Keyed by REQS key in public/app.js. Grouped the way the wizard asks, not the
   way app.js declares, so a reviewer can read it against the questionnaire.
   -------------------------------------------------------------------------- */
const GATES = {
  /* ---------------------------------------------------------- jurisdiction */
  ab: province("AB"),
  bc: province("BC"),
  on: province("ON"),
  sk: province("SK"),
  mb: province("MB"),
  nb: province("NB"),
  ns: province("NS"),
  provinceCovered: {
    evidence: "answers",
    satisfy: { set: { province: "AB" } },
    violations: [{ name: "uncovered province", fragment: { set: { province: "other" } }, expect: "no" }],
  },
  notBcStudentAidDuplicate: {
    // Federal student grants route BC residents to the StudentAid BC version
    // instead of calling them ineligible. Satisfied by any non-BC province.
    evidence: "answers",
    satisfy: { set: { province: "AB" } },
    violations: [{ name: "BC resident", fragment: { set: { province: "BC" } }, expect: "no" }],
  },
  cityOther: {
    // The 2-1-1 fallback for communities with no verified municipal program.
    evidence: "answers",
    satisfy: { set: { city: "Camrose" } },
    violations: [{ name: "community has its own program", fragment: { set: { city: "Calgary" } }, expect: "no" }],
  },
  metroVancouver: {
    evidence: "answers",
    satisfy: { set: { city: "Vancouver" } },
    violations: [{ name: "outside Metro Vancouver", fragment: { set: { city: "Kamloops" } }, expect: "no" }],
  },
  outsideMetroVancouver: {
    evidence: "answers",
    satisfy: { set: { city: "Nanaimo" } },
    violations: [{ name: "inside Metro Vancouver", fragment: { set: { city: "Vancouver" } }, expect: "no" }],
  },

  /* ------------------------------------------------------------ Alberta municipalities */
  calgary: municipality("Calgary", "AB"),
  edmonton: municipality("Edmonton", "AB"),
  toronto: municipality("Toronto", "ON"),
  ottawa: municipality("Ottawa", "ON"),
  mississauga: municipality("Mississauga", "ON"),
  brampton: municipality("Brampton", "ON"),
  hamilton: municipality("Hamilton", "ON"),
  niagaraRegion: municipality("St. Catharines", "ON"),
  kingston: municipality("Kingston", "ON"),
  haltonRegion: municipality("Oakville", "ON"),
  london: municipality("London", "ON"),
  windsor: municipality("Windsor", "ON"),
  yorkRegion: {
    evidence: "answers",
    satisfy: { set: { city: "Markham" } },
    violations: [{ name: "outside York Region", fragment: { set: { city: OTHER_CITY.ON } }, expect: "no" }],
  },
  waterlooRegion: {
    evidence: "answers",
    satisfy: { set: { city: "North Dumfries" } },
    violations: [{ name: "outside Region of Waterloo", fragment: { set: { city: OTHER_CITY.ON } }, expect: "no" }],
  },
  waterlooUrban: {
    evidence: "answers",
    satisfy: { set: { city: "Kitchener" } },
    violations: [{ name: "Waterloo Region township", fragment: { set: { city: "North Dumfries" } }, expect: "no" }],
  },
  waterlooRenovatesEligibility: external("Depends on the Region confirming the family-size total gross household income maximum or sole-source OW/ODSP financial support, home value, sole-and-principal-residence and other-property rules, current taxes and mortgage, and full-value insurance; generic lowIncome cannot establish or disprove the alternative."),
  waterlooHomemakingFinancial: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [
      { name: "moderate income: social support route not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "high income: social support route not collected", fragment: { set: { income: "high" } }, expect: "almost" },
    ],
  },
  windsorEssex: municipality("Windsor", "ON"),
  yorkRecreationFamilyRoute: external("The wizard does not ask about rent subsidy, Ontario Works, ODSP, ACSD or child care fee subsidy receipt, so no answer can establish a listed route."),
  yorkRecreationAge: {
    evidence: "answers",
    satisfy: { set: { ageBand: "6to11" } },
    violations: [
      { name: "age under 6: four to five not distinguishable", fragment: { set: { ageBand: "under6" } }, expect: "almost" },
    ],
  },
  waterlooHomemakingNeed: external("Depends on the program confirming significant functional impairment affecting homemaking, the reason help is needed at home, and full financial and health information when the applicant reaches the top of the waitlist."),
  waterlooWasteSupportApproval: external("Depends on Region approval under either the assisted-collection route or the medical-waste route; the wizard cannot establish every condition for either route."),
  yorkHomemakersNeed: external("Depends on York Region's unpublished financial need assessment and confirmation of illness or disability."),
  visionDisability: disabilityGate("vision"),
  bcLdAssessmentReferral: external("Depends on StudentAid BC eligibility, a designated public B.C. institution and a recommendation from the school's accessibility services office, none of which the wizard asks."),
  ottawaOdspReceipt: external("Depends on actually receiving ODSP benefits and holding an ODSP identification number."),
  paraTranspoRegistered: external("Depends on being registered as a Para Transpo customer, which the wizard never asks."),
  atpApproval: { evidence: "scoped-fact", why: "Explicit, versioned program-scoped confirmation; never inferred from wizard answers." },
  mobilityplusRegistered: { evidence: "scoped-fact", why: "Explicit, versioned program-scoped confirmation; never inferred from wizard answers." },
  cnibCustomer: { evidence: "scoped-fact", why: "Explicit, versioned program-scoped confirmation; never inferred from wizard answers." },
  supportPersonApproval: external("Depends on applying to the Transit Support Person program."),
  aCardProof: external("Depends on holding a CNIB card or an Attorney-General of Ontario Guide Dog photo ID card."),
  londonRenovatesEligibility: external("Depends on household income, liquid assets and the home's property tax assessment value, none of which the wizard asks about."),
  p2pIncomeTest: external("Depends on combined household income being at or below the Market Basket Measure threshold for family size; Windsor does not publish those thresholds, so the applicant must ask the local municipal transit or recreation department."),
  reddeer: municipality("Red Deer", "AB"),
  lethbridge: municipality("Lethbridge", "AB"),
  medicinehat: municipality("Medicine Hat", "AB"),
  grandeprairie: municipality("Grande Prairie", "AB"),
  stalbert: municipality("St. Albert", "AB"),
  strathcona: municipality("Sherwood Park", "AB"),
  airdrie: municipality("Airdrie", "AB"),
  woodbuffalo: municipality("Fort McMurray", "AB"),
  sprucegrovearea: municipality("Spruce Grove", "AB"),
  leduc: municipality("Leduc", "AB"),
  cochrane: municipality("Cochrane", "AB"),
  canmore: municipality("Canmore", "AB"),
  lloydminster: municipality("Lloydminster", "AB"),
  fortsask: municipality("Fort Saskatchewan", "AB"),

  /* ------------------------------------------------------ BC municipalities */
  vancouver: municipality("Vancouver", "BC"),
  surrey: municipality("Surrey", "BC"),
  bridgewater: municipality("Bridgewater", "NS"),
  moncton: municipality("Moncton", "NB"),
  dieppe: municipality("Dieppe", "NB"),
  fredericton: municipality("Fredericton", "NB"),
  saintJohn: municipality("Saint John", "NB"),
  brandon: municipality("Brandon", "MB"),
  winnipeg: municipality("Winnipeg", "MB"),
  swiftCurrent: municipality("Swift Current", "SK"),
  regina: municipality("Regina", "SK"),
  saskatoon: municipality("Saskatoon", "SK"),
  northBattleford: municipality("North Battleford", "SK"),
  mooseJaw: municipality("Moose Jaw", "SK"),
  princeAlbert: municipality("Prince Albert", "SK"),
  yorkton: municipality("Yorkton", "SK"),
  brantford: municipality("Brantford", "ON"),
  dawsonCreek: municipality("Dawson Creek", "BC"),
  highRiver: municipality("High River", "AB"),
  langley: municipality("Langley", "BC"),
  morinville: municipality("Morinville", "AB"),
  nelson: municipality("Nelson", "BC"),
  portCoquitlam: municipality("Port Coquitlam", "BC"),
  sarnia: municipality("Sarnia", "ON"),
  taber: municipality("Taber", "AB"),
  westVancouver: municipality("West Vancouver", "BC"),
  banff: municipality("Banff", "AB"),
  blackfalds: municipality("Blackfalds", "AB"),
  chestermere: municipality("Chestermere", "AB"),
  draytonValley: municipality("Drayton Valley", "AB"),
  edson: municipality("Edson", "AB"),
  rockyMountainHouse: municipality("Rocky Mountain House", "AB"),
  strathmore: municipality("Strathmore", "AB"),
  whitecourt: municipality("Whitecourt", "AB"),
  belleville: municipality("Belleville", "ON"),
  chathamKent: municipality("Chatham-Kent", "ON"),
  cornwall: municipality("Cornwall", "ON"),
  peterborough: municipality("Peterborough", "ON"),
  campbellRiver: municipality("Campbell River", "BC"),
  colwoodArea: municipality("Colwood", "BC"),
  courtenayArea: municipality("Courtenay", "BC"),
  cranbrook: municipality("Cranbrook", "BC"),
  duncan: municipality("Duncan", "BC"),
  mission: municipality("Mission", "BC"),
  penticton: municipality("Penticton", "BC"),
  pittMeadows: municipality("Pitt Meadows", "BC"),
  portMoody: municipality("Port Moody", "BC"),
  princeRupert: municipality("Prince Rupert", "BC"),
  quesnel: municipality("Quesnel", "BC"),
  squamish: municipality("Squamish", "BC"),
  terrace: municipality("Terrace", "BC"),
  whiteRock: municipality("White Rock", "BC"),
  abbotsford: municipality("Abbotsford", "BC"),
  mapleRidge: municipality("Maple Ridge", "BC"),
  nanaimo: municipality("Nanaimo", "BC"),
  newWestminster: municipality("New Westminster", "BC"),
  princeGeorge: municipality("Prince George", "BC"),
  burnaby: municipality("Burnaby", "BC"),
  richmondbc: municipality("Richmond", "BC"),
  victoria: municipality("Victoria", "BC"),
  saanich: municipality("Saanich", "BC"),
  kelowna: municipality("Kelowna", "BC"),
  coquitlam: municipality("Coquitlam", "BC"),
  kamloops: municipality("Kamloops", "BC"),

  /* ------------------------------------------------------------------- age */
  child: ageGate("6to11", "19to59"),
  under6: ageGate("under6", "19to59"),
  under19: ageGate("16to17", "19to59"),
  bcCydbAge: ageGate("16to17", "19to59"),
  schoolAge: ageGate("6to11", "19to59"),
  age6to18: ageGate("6to11", "19to59"),
  age12plus: ageGate("19to59", "under6"),
  age16plus: ageGate("19to59", "under6"),
  age18plus: ageGate("19to59", "under6"),
  age60plus: ageGate("60to64", "19to59"),
  age65plus: ageGate("65plus", "19to59"),
  adult: ageGate("19to59", "under6"),
  torontoFairPassAge: {
    evidence: "answers",
    satisfy: { set: { ageBand: "19to59" } },
    violations: [
      { name: "age 18: page says 20 to 64", fragment: { set: { ageBand: "18" } }, expect: "no" },
      { name: "senior", fragment: { set: { ageBand: "65plus" } }, expect: "no" },
    ],
  },
  niagaraTbpRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: OW, ODSP or Region approval not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  notFullTimePostSecondary: {
    evidence: "answers",
    satisfy: { drop: { situation: ["student"] } },
    violations: [{ name: "post-secondary student: full-time status not asked", fragment: { add: { situation: ["student"] } }, expect: "almost" }],
  },
  haltonSplitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: low income, OW or ODSP not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  abbotsfordPrcIncome: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  mapleRidgeIncome: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nanaimoLeapRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  newWestRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  princeGeorgeIncome: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  physicianConfirmedDisability: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  mapleRidgeDisabilityProof: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  nanaimoNotStudent: {
    evidence: "answers",
    satisfy: { drop: { situation: ["student"] } },
    violations: [{ name: "is a post-secondary student", fragment: { add: { situation: ["student"] } }, expect: "no" }],
  },
  banffAccessProgramRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  blackfaldsRecreationFeeAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  chestermereCommunityAccessProgramRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  draytonValleyRecreationFeeAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  edsonLeisureAssistRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  rockyMountainHouseRfapRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  strathmoreCommunityAccessCardRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  whitecourtRecreationFeeAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  bellevilleRecreationFeeAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  chathamKentAffordableBusPassRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  cornwallFairRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  peterboroughRecreationSubsidyRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  peterboroughOwOdspTransitPassRoute: external("Depends on receiving the assistance program the city names, which the wizard does not ask."),
  campbellRiverLifeRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  colwoodLangfordLifeRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  courtenayComoxRapLeapRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  cranbrookLeisureAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  duncanLeisureAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  missionPlayPassRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  pentictonLifeRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  pentictonAccessPassRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  pittMeadowsFeeSubsidyRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  portMoodyLeisureAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  princeRupertRecreationAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  quesnelLeisureAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  squamishRecreationAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  terraceAffordableRecreationAccessRoute: external("Depends on receiving the assistance program the city names, which the wizard does not ask."),
  whiteRockLeisureAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  noPostSecondaryStudents: {
    evidence: "answers",
    satisfy: { drop: { situation: ["student"] } },
    violations: [{ name: "is a post-secondary student", fragment: { add: { situation: ["student"] } }, expect: "no" }],
  },
  brantfordRecreationSubsidyRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  cornwallCommunityBusPassRoute: external("Depends on receiving the assistance program the city names, which the wizard does not ask."),
  dawsonCreekLeisureAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  highRiverCommunityAccessProgramRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  langleyLeisureAccessGrantRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  morinvilleWrapRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nelsonRdckLeisureAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  portCoquitlamFinancialAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  sarniaCnibPassRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  taberFeeAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  westVancouverRecreationFinancialAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  onChildBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "6to11" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "an adult may have no child: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  onDsoAdultServicesRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  onEnhancedRespiteRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  onGainsRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  onHealthySmilesRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  onOntarioWorksRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  onSeniorsDentalRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  onTrilliumBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  onDrugBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { ageBand: "65plus" } },
    violations: [{ name: "under 65: the assistance, home care and Trillium routes are not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" }],
  },
  onHomeCommunityCareRoute: external("Depends on an Ontario Health atHome assessment of care needs, which the wizard cannot make."),
  onNorthernHealthTravelGrantRoute: external("Depends on living in a listed Northern Ontario district, a specialist referral and travelling at least 100 km one way, which the wizard does not ask."),
  onOdspEmploymentSupportsRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  onOdspHealthBenefitsRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  onOespRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  bcCsilRoute: external("Depends on a health authority assessment of high physical care needs, which the wizard cannot make."),
  bcFamilyBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  bcHomeSupportRoute: external("Depends on a health authority assessment of care needs, which the wizard cannot make."),
  bcIncomeAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "on disability assistance (PWD), a separate program", fragment: { set: { bcAssistance: "pwd" } }, expect: "almost" },
    ],
  },
  bcNursingSupportServicesRoute: external("Depends on a nursing assessment of the child's health care needs, which the wizard cannot make."),
  bcPpmbRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  bcRentalAssistanceProgramRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "6to11" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "an adult may have no child: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
      { name: "on disability assistance", fragment: { set: { bcAssistance: "pwd" } }, expect: "almost" },
    ],
  },
  bcSaferRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  abBlueCrossNonGroupRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  abBrainInjuryRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  abChildFamilyBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "6to11" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "an adult may have no child: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  abHomeCareRoute: external("Depends on a professional assessment of unmet care needs, which the wizard cannot make."),
  abIncomeSupportRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  abRentAssistanceBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  abSeniorsBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  abSeniorsDentalOpticalRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  abSeniorsSpecialNeedsAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  abSharpRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  bcSubsidizedHousingRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", dtc: "yes" } },
    violations: [
      { name: "moderate income: the Housing Income Limits are not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "no DTC or disability assistance yet", fragment: { set: { dtc: "no", bcAssistance: "none" } }, expect: "almost" },
    ],
  },
  onChildrensRehabRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  skSaidRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", disabilityVerified: "yes" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "disability not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" },
    ],
  },
  skIncomeSupportRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  skEmploymentIncentiveRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "6to11" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "an adult may have no child: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  skHousingBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  skSailRoute: external("Depends on a referral from an authorized health professional, which the wizard cannot confirm."),
  skSupplementaryHealthRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  skFamilyHealthBenefitsRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "6to11" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "an adult may have no child: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  skSpecialSupportRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  skSeniorsDrugPlanRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  skSeniorsIncomePlanRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  skAutismIndividualizedFundingRoute: {
    evidence: "answers",
    satisfy: { set: { autismDiagnosis: "yes", ageBand: "6to11" } },
    violations: [{ name: "no written diagnosis yet", fragment: { set: { autismDiagnosis: "no" } }, expect: "almost" }],
  },
  skCognitiveDisabilityStrategyRoute: external("Depends on an unmet need that no other program can support, which the ministry assesses."),
  skFamilyRespiteIntellectualDisabilityRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "neither route established", fragment: { set: { income: "moderate", disabilityVerified: "no" } }, expect: "almost" }],
  },
  skHomeCareRoute: external("Depends on a health authority assessment of care needs, which the wizard cannot make."),
  skAdaptationsForIndependenceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", disabilityVerified: "yes" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "disability not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" },
    ],
  },
  skEapdRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  skPersonalCareHomeBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  skActiveFamiliesBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "moderate", ageBand: "6to11" } },
    violations: [
      { name: "higher income: the $120,000 limit is not collected exactly", fragment: { set: { income: "high" } }, expect: "almost" },
      { name: "an adult may have no child: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  skLowIncomeTaxCreditRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  skCochlearProcessorRoute: external("Depends on having a health-authority cochlear implant processor that meets the replacement criteria, which the wizard does not ask."),
  reginaAffordableAccessRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  saskatoonLeisureAccessProgramRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  saskatoonLowIncomeBusPassRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  reginaDiscounted31DayPassRoute: external("Depends on receiving the assistance program the city names, which the wizard does not ask."),
  mooseJawDiscountedMonthlyPassRoute: external("Depends on receiving the assistance program the city names, which the wizard does not ask."),
  saskatoonAccessibleParkingPermitSubsidyRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  yorktonDiscountedMonthlyPassRoute: external("Depends on receiving the assistance program the city names, which the wizard does not ask."),
  mbSupportsPersonsDisabilitiesRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", disabilityVerified: "yes" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "disability not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" },
    ],
  },
  mbEiaRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "neither route established", fragment: { set: { income: "moderate", disabilityVerified: "no" } }, expect: "almost" }],
  },
  mbRentAssistRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  mbPharmacareRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  mbDisabilityHealthSupportsRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  mbChildrensDisabilityServicesRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  mbCommunityLivingDisabilityServicesRoute: external("Depends on the program's assessment of the help with personal care or property a person needs."),
  mbHomeCareRoute: external("Depends on a regional health authority assessment of care needs, which the wizard cannot make."),
  mbPrimaryCaregiverTaxCreditRoute: external("Depends on the person cared for being assessed at care level 2 or higher, which the wizard does not ask."),
  mbChildBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "6to11" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "an adult may have no child: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  mb55PlusRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "65plus" } },
    violations: [
      { name: "moderate income", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "55 to 59 sits inside the 19 to 59 band: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  mbResidentialAdaptationsRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", disabilityVerified: "yes" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "disability not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" },
    ],
  },
  winnipegRecreationFeeAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  winnipegWinnpassRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  mbEapdRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  mbRentSupplementRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  mbPrenatalBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  brandonCnibFreeTransitRoute: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["vision"] } },
    violations: [{ name: "no vision category: CNIB card not likely", fragment: { drop: { disabilities: ["vision"] } }, expect: "almost" }],
  },
  nbSocialAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nbDisabilitySupportProgramRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes", ageBand: "19to59" } },
    violations: [
      { name: "disability not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" },
      { name: "age 65 or older: outside 19 to 64", fragment: { set: { ageBand: "65plus" } }, expect: "almost" },
    ],
  },
  nbSelfManagedSupportRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  nbEmploymentSupportServicesRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  nbTessRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  nbFamilySupportsChildrenRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  nbVehicleRetrofitRoute: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["physical"] } },
    violations: [{ name: "no physical category: other routes not asked", fragment: { drop: { disabilities: ["physical"] } }, expect: "almost" }],
  },
  nbPrescriptionDrugProgramRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "neither route established", fragment: { set: { income: "moderate", disabilityVerified: "no" } }, expect: "almost" }],
  },
  nbHealthySmilesClearVisionRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nbPreschoolAutismRoute: {
    evidence: "answers",
    satisfy: { set: { autismDiagnosis: "yes" } },
    violations: [{ name: "no diagnosis yet", fragment: { set: { autismDiagnosis: "no" } }, expect: "almost" }],
  },
  nbLongTermCareHomeSupportRoute: external("Depends on a Social Development assessment of long-term care needs, which the wizard cannot make."),
  nbExtraMuralRoute: external("Depends on the program deciding your health care can be given safely at home."),
  nbLowIncomeSeniorsBenefitRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  nbChildTaxBenefitRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "6to11" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "an adult may have no child: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  nbHealthServicesEquipmentRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  nbPortableRentSupplementRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", disabilityVerified: "yes" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "disability not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" },
    ],
  },
  nbRentSupplementRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nbRrapRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", disabilityVerified: "yes" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "disability not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" },
    ],
  },
  nbAmbulanceFeeExemptionRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  monctonCnibFreeTransitRoute: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["vision"] } },
    violations: [{ name: "no vision category: CNIB card not likely", fragment: { drop: { disabilities: ["vision"] } }, expect: "almost" }],
  },
  saintJohnProKidsRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "6to11" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "an adult: the program is for children", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  nbDrugPlanRoute: external("Depends on having no other drug coverage for the medication, which the wizard does not ask."),
  nbHearingAidProgramRoute: external("Depends on holding the Social Development health card the policy lists, which the wizard does not ask."),
  nbPublicHousingRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nbSeniorsHomeRenovationCreditRoute: {
    evidence: "answers",
    satisfy: { set: { ageBand: "65plus" } },
    violations: [{ name: "under 65: the family-member route is not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" }],
  },
  nbChildcareAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low", ageBand: "6to11" } },
    violations: [
      { name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "an adult may have a young child: not asked", fragment: { set: { ageBand: "19to59" } }, expect: "almost" },
    ],
  },
  nbHomeownerRepairRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" }, add: { circumstances: ["homeowner"] } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nsIncomeAssistanceRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nsDisabilitySupportProgramRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  nsDirectFamilySupportChildrenRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  nsCaregiverBenefitRoute: external("Depends on a Continuing Care assessment of the person receiving care and their income category, which the wizard cannot make."),
  nsOsdPharmacareRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  nsFamilyPharmacareRoute: external("Depends on not having other drug coverage, which the wizard does not ask."),
  nsHarpRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nsSeniorsCareGrantRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nsSeniorsPropertyTaxRebateRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  nsHousingRepairAccessibilityRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" }, add: { circumstances: ["homeowner"] } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nsRentSupplementRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nsPovertyReductionCreditRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  nsChildrensOralHealthRoute: {
    evidence: "answers",
    satisfy: { set: { ageBand: "6to11" } },
    violations: [{ name: "adult", fragment: { set: { ageBand: "19to59" } }, expect: "almost" }],
  },
  nsCommunityBusPassRoute: external("Depends on receiving the assistance program the province names, which the wizard does not ask."),
  nsSeniorsWheelchairLoanRoute: external("Depends on an occupational or physical therapist assessment and a Continuing Care income category, which the wizard cannot confirm."),
  nsDayProgramsRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  nsPublicHousingRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nsAmbulanceFeeWaiverRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  nsStudentLoanForgivenessDisabilitiesRoute: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  bridgewaterProKidsRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: the program's own income test is not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  kingstonMfapIncome: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "moderate income: MFAP limit not collected", fragment: { set: { income: "moderate" } }, expect: "almost" }],
  },
  hamiltonFareRoute: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [
      { name: "moderate income: OW or ODSP route not collected", fragment: { set: { income: "moderate" } }, expect: "almost" },
      { name: "high income: OW or ODSP route not collected", fragment: { set: { income: "high" } }, expect: "almost" },
    ],
  },
  workingAge: ageGate("19to59", "under6"),
  under60: ageGate("19to59", "65plus"),
  achbAge: ageGate("6to11", "60to64"),
  achbOlderDependent: {
    // Soft on purpose. The 19–59 band also contains 30-year-olds, so an older
    // dependent is asked to confirm rather than refused — but can never be
    // ready, because exact age, home residence and grade are never collected.
    //
    // This is the only gate that shares a dimension with a sibling on the same
    // program: achbAge accepts under-18 OR an 18/19–59-year-old still in high
    // school. To say something about THIS gate the violation has to stay inside
    // achbAge's second branch, so "still in high school" travels with the band.
    evidence: "answers",
    satisfy: { set: { ageBand: "6to11" } },
    violations: [
      {
        name: "possible 19-year-old still in high school",
        fragment: { set: { ageBand: "19to59", situation: ["secondary"] } },
        expect: "almost",
      },
    ],
  },

  /* -------------------------------------------------------------- identity */
  citizenPR: {
    evidence: "answers",
    satisfy: { set: { citizenPR: true } },
    violations: [{ name: "not a citizen or PR", fragment: { set: { citizenPR: false } }, expect: "no" }],
  },
  lowIncome: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [{ name: "higher income", fragment: { set: { income: "high" } }, expect: "no" }],
  },

  /* ------------------------------------------------------------ disability */
  disabilityDoc: {
    // Soft: getting a professional to verify is an action the user can take.
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet verified", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  dtc: {
    evidence: "answers",
    satisfy: { set: { dtc: "yes" } },
    violations: [{ name: "no DTC yet", fragment: { set: { dtc: "no" } }, expect: "almost" }],
  },
  autismSelected: disabilityGate("autism"),
  intellectualDisability: disabilityGate("intellectual"),
  brainInjuryDisability: disabilityGate("braininjury"),
  skCognitiveDisability: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["intellectual"] } },
    violations: [{ name: "no cognitive category", fragment: { drop: { disabilities: ["intellectual", "autism", "braininjury", "learning", "other"] } }, expect: "no" }],
  },
  hearingDisability: disabilityGate("hearing"),
  learningDisability: disabilityGate("learning"),
  autismDiagnosis: {
    evidence: "answers",
    satisfy: { set: { autismDiagnosis: "yes" } },
    violations: [{ name: "no qualifying diagnosis yet", fragment: { set: { autismDiagnosis: "no" } }, expect: "almost" }],
  },
  developmental: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["intellectual"] }, set: { onsetBefore18: true } },
    violations: [
      { name: "onset not before 18", fragment: { set: { onsetBefore18: false } }, expect: "no" },
      { name: "no developmental category", fragment: { drop: { disabilities: ["intellectual", "autism"] } }, expect: "no" },
    ],
  },
  palliativeCandidateCondition: disabilityGate("chronic"),
  psychiatricMedicationCandidate: disabilityGate("mental"),
  mobility: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["physical"] }, set: { canWalkFar: false } },
    violations: [{ name: "can walk and no vision loss", fragment: { set: { canWalkFar: true }, drop: { disabilities: ["vision"] } }, expect: "no" }],
  },
  abPlacardMobility: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["physical"] }, set: { canWalkFar: false } },
    violations: [
      // fixed is !physical && !vision, so keeping the physical category and
      // answering "I can walk that far" is actionable, not a refusal.
      { name: "walks far enough", fragment: { set: { canWalkFar: true } }, expect: "almost" },
      { name: "no mobility or vision category", fragment: { drop: { disabilities: ["physical", "vision"] } }, expect: "no" },
    ],
  },
  // vehicleDisability remains unchanged in production. Fuel tax was its last
  // catalogue user; omit the now-orphaned oracle entry, not the shared gate.

  /* ----------------------------------------------------- functional limits */
  dailyLivingLimit: needGate("dailyLiving"),
  equipmentNeed: needGate("equipment"),
  transitBarrier: needGate("transitBarrier"),
  nutritionNeed: needGate("nutrition"),
  // Snapshot corrections 2026-10-15: absent answers leave alternative routes open.
  bcMedTransportNeed: {
    evidence: "answers",
    satisfy: { add: { functionalNeeds: ["medicalTravel"] } },
    violations: [{ name: "daily or local travel route not asked", fragment: { drop: { functionalNeeds: ["medicalTravel"] } }, expect: "almost" }],
  },
  bcMedTransportRoute: external("Receiving assistance or another approved route requires external confirmation; the PWD designation-or-assistance answer does not establish receipt."),
  bcStcAgeOrFamily: {
    evidence: "answers",
    satisfy: { set: { ageBand: "19to59" } },
    violations: [{ name: "younger spouse or parent route not asked", fragment: { set: { ageBand: "under6" } }, expect: "almost" }],
  },
  burnabyFairPlayRoute: external("FAIR Play requires an established application route; the PWD designation-or-assistance answer does not establish receiving government income assistance."),
  bcAtHomeMedicalRoute: external("Requires assessed ADL dependence, Nursing Support Services direct nursing care eligibility, or a palliative condition with physician- or nurse-practitioner-indicated life expectancy of up to six months; self-reported dependence establishes none of these."),
  homeAccessNeed: needGate("homeAccess"),
  childHighNeeds: needGate("childHighNeeds"),
  childThreeAdls: needGate("childThreeAdls"),

  /* ---------------------------------------------------------- circumstance */
  // Batch two: HATC permits expected residence and family claimants. Missing
  // self-profile answers cannot hard-exclude those unasked routes.
  hatcEligibleDwelling: {
    evidence: "answers",
    satisfy: { add: { circumstances: ["homeowner"] } },
    violations: [{ name: "ownership or expected residence needs checking", fragment: { set: { circumstances: ["none"] } }, expect: "almost" }],
  },
  hatcQualifyingPerson: {
    evidence: "answers",
    satisfy: { set: { dtc: "yes" } },
    violations: [{ name: "family claimant or year-specific eligibility unasked", fragment: { set: { dtc: "no", ageBand: "19to59" } }, expect: "almost" }],
  },
  hatcQualifyingRenovationSpend: external("HATC is non-refundable and requires eligible work done and paid for in the tax year; the wizard does not collect spending."),
  richmondFinancialHardship: {
    evidence: "answers",
    satisfy: { set: { income: "low" } },
    violations: [
      { name: "PWD designation does not establish current assistance receipt", fragment: { set: { income: "high", bcAssistance: "pwd" } }, expect: "almost" },
      { name: "other assistance or financial limits need checking", fragment: { set: { income: "high", bcAssistance: "none" } }, expect: "almost" },
    ],
  },
  homeowner: {
    ...circumstanceGate("homeowner"),
    violations: [
      ...circumstanceGate("homeowner").violations,
      { name: "ownership unasked", fragment: { set: { circumstances: [] } }, expect: "almost" },
    ],
  },
  vehicleOwner: circumstanceGate("vehicleOwner"),
  recentGraduate: circumstanceGate("recentGraduate"),
  // Batch 7 (2026-10-16): record-specific gates replacing shared ones that drifted from the page.
  waterlooMobilityPlusTransit: external("Needing assistance on regular public transit does not establish that a disability prevents conventional transit use or that barriers limit consistent use; the wizard cannot establish a MobilityPLUS eligibility type."),
  bcParkingMobility: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["physical"] }, set: { canWalkFar: false } },
    violations: [
      { name: "physical category but walks far enough: other mobility limits may apply", fragment: { set: { canWalkFar: true } }, expect: "almost" },
      { name: "no physical category: mobility limits can arise under other categories", fragment: { drop: { disabilities: ["physical"] } }, expect: "almost" },
    ],
  },
  okotoksArea: {
    ...municipality("Okotoks", "AB"),
    violations: [
      ...municipality("Okotoks", "AB").violations,
      { name: "city unasked", fragment: { set: { city: null } }, expect: "almost" },
      { name: "unlisted city", fragment: { set: { city: "Other / my town isn't listed" } }, expect: "almost" },
    ],
  },
  okotoksResidency: external("The city question asks in or near, so selecting Okotoks does not establish residence in the Town of Okotoks or Foothills County."),
  exciseMobilityImpairment: external("Depends on a permanent mobility impairment with unsafe public transportation, which the wizard cannot establish."),
  fortsaskIncomeRoute: external("Depends on receiving funding from an approved government program or meeting the Statistics Canada low income thresholds, neither of which the wizard asks."),
  mhrtcQualifyingIndividual: {
    evidence: "answers",
    satisfy: { set: { dtc: "yes", ageBand: "19to59" } },
    violations: [{ name: "no DTC and not a senior: the unit may be for a relative", fragment: { set: { dtc: "no", ageBand: "19to59" } }, expect: "almost" }],
  },
  abSpecialNeedsHousingStatus: {
    evidence: "answers",
    satisfy: { set: { citizenPR: true } },
    violations: [{ name: "not a citizen or PR: other listed routes exist", fragment: { set: { citizenPR: false } }, expect: "almost" }],
  },
  bcClbcStream: {
    // Diagnosis and onset do not establish the required functional impairments.
    evidence: "external",
    satisfy: { add: { disabilities: ["intellectual"] }, set: { onsetBefore18: true } },
    violations: [
      { name: "no developmental category", fragment: { drop: { disabilities: ["intellectual", "autism"] } }, expect: "no" },
    ],
  },
  bcWorkAbleSelfIdentify: {
    evidence: "answers",
    satisfy: { set: { disabilityVerified: "yes" } },
    violations: [{ name: "not yet documented, self-identification still possible", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }],
  },
  homeRenoCandidate: {
    evidence: "answers",
    satisfy: { set: { dtc: "yes" } },
    violations: [{ name: "no DTC and not a senior", fragment: { set: { dtc: "no", ageBand: "19to59" } }, expect: "no" }],
  },

  /* ------------------------------------------------------------- situation */
  student: {
    evidence: "answers",
    satisfy: { add: { situation: ["student"] } },
    violations: [{ name: "not a post-secondary student", fragment: { set: { situation: ["none"] } }, expect: "no" }],
  },
  notPostSecondaryStudent: {
    evidence: "answers",
    satisfy: { drop: { situation: ["student"] } },
    violations: [{ name: "is a post-secondary student", fragment: { add: { situation: ["student"] } }, expect: "no" }],
  },
  working: {
    evidence: "answers",
    satisfy: { add: { situation: ["working"] } },
    violations: [{ name: "no employment income", fragment: { set: { situation: ["none"] } }, expect: "no" }],
  },
  employmentActive: {
    evidence: "answers",
    satisfy: { add: { situation: ["working"] } },
    violations: [{ name: "not working or looking", fragment: { set: { situation: ["none"] } }, expect: "no" }],
  },
  unableToWork: {
    evidence: "answers",
    satisfy: { add: { situation: ["unableToWork"] } },
    violations: [{ name: "able to work", fragment: { set: { situation: ["none"] } }, expect: "no" }],
  },
  childcare: {
    evidence: "answers",
    satisfy: { add: { situation: ["childcare"] } },
    violations: [{ name: "not in child care", fragment: { set: { situation: ["none"] } }, expect: "no" }],
  },

  /* ---------------------------------------------------------- BC statuses */
  bcMsp: {
    evidence: "answers",
    satisfy: { set: { msp: "yes" } },
    violations: [
      { name: "not enrolled in MSP", fragment: { set: { msp: "no" } }, expect: "no" },
      { name: "unsure about MSP", fragment: { set: { msp: "unsure" } }, expect: "almost" },
    ],
  },
  bcPwdStatus: {
    evidence: "answers",
    satisfy: { set: { bcAssistance: "pwd" } },
    violations: [{ name: "no PWD designation yet", fragment: { set: { bcAssistance: "none" } }, expect: "almost" }],
  },
  bcAssistanceStatus: {
    evidence: "answers",
    satisfy: { set: { bcAssistance: "pwd" } },
    violations: [
      { name: "no qualifying assistance category", fragment: { set: { bcAssistance: "none" } }, expect: "no" },
      { name: "unsure about assistance category", fragment: { set: { bcAssistance: "unsure" } }, expect: "almost" },
    ],
  },
  notBcAssistance: {
    evidence: "answers",
    satisfy: { set: { bcAssistance: "none" } },
    violations: [
      { name: "already on ministry assistance", fragment: { set: { bcAssistance: "pwd" } }, expect: "no" },
      { name: "unsure about assistance", fragment: { set: { bcAssistance: "unsure" } }, expect: "almost" },
    ],
  },
  bcBusPassStatus: {
    evidence: "answers",
    satisfy: { set: { bcAssistance: "pwd" } },
    violations: [{ name: "neither PWD nor low-income senior", fragment: { set: { bcAssistance: "none", ageBand: "19to59" } }, expect: "almost" }],
  },

  /* --------------------------------------------------------------------------
     EXTERNAL GATES — 66 of them, and the reason each one is here is the whole
     point of the oracle. None of these can be established by any answer the
     wizard collects, so no persona satisfies them and no program that carries
     one may ever return "ready".
     -------------------------------------------------------------------------- */

  /* federal — adjudication, tax filing and contribution history */
  prolonged: external("A qualified practitioner must certify the impairment is severe and prolonged; a self-reported category is not a certification."),
  certifier: external("Requires a named qualified practitioner to complete and sign the form."),
  cdbTaxFiling: external("Depends on filed tax returns for the person and their spouse or partner."),
  cdbStatus: external("Depends on CRA's own approval status for the benefit."),
  ccbEligibility: external("Depends on existing Canada Child Benefit entitlement, which CRA determines."),
  cppContrib: external("Depends on the CPP contribution record held by Service Canada."),
  cppDisabilityContributorLink: external("Depends on a parent's approved CPP disability benefit, a Service Canada determination."),
  cwbEligibility: external("Depends on working income and adjusted family net income from a filed return."),
  rdspOpening: external("Depends on an RDSP actually being opened with a participating financial institution."),
  rdspContributionWindow: external("Depends on contribution room and the beneficiary's contribution history."),
  csgNeedAndProgram: external("Depends on an assessed financial need and an approved program of study."),
  csgServicesEquipment: external("Depends on an assessment of the specific services or equipment required."),
  cdcpRequirements: external("Depends on absence of private dental coverage, filed returns and adjusted family net income."),
  disabilityMedicalExpensesPaid: external("Depends on expenses actually paid and receipted — money out the door, not an answer."),
  caregiverSupportClaim: external("Depends on the supporting person's own tax return and their dependant relationship."),
  bcHomeRenoSpend: external("Depends on the renovation having actually been done; the expense is deemed paid when paid or payable."),
  qualifyingRenovationSpend: external("The credit pays back part of what is spent, so it depends on the renovation having actually been done and paid for."),
  mhrtcSecondaryUnit: external("Depends on a self-contained secondary unit having been created, and on it never having been claimed before for that person."),
  excisePermanentMobilityCertified: external("Requires a practitioner to certify permanent mobility impairment and inability to use public transport safely."),

  /* Alberta — caseworker adjudication and program registration */
  passportDevelopmental: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["intellectual"] } },
    violations: [{ name: "no developmental category", fragment: { drop: { disabilities: ["intellectual", "autism"] } }, expect: "no" }],
  },
  passportDso: external("Developmental Services Ontario confirms eligibility for provincially funded adult developmental services; the developmental disability should be determined by a psychologist or psychological associate registered with the College of Psychologists of Ontario or an equivalent body."),
  tdpDeductible: external("Depends on what the household actually spends on prescription drugs against about 4% of its after-tax income, and on existing drug coverage."),
  hvmpMobility: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["physical"] }, set: { canWalkFar: false } },
    violations: [
      { name: "no mobility-restricting disability", fragment: { drop: { disabilities: ["physical", "vision"] }, set: { canWalkFar: true } }, expect: "almost" },
    ],
  },
  hvmpIncome: external("Depends on household income against the program's established threshold, which the wizard cannot evaluate."),
  hvmpCoordinator: external("The program's service coordinator determines eligibility, and other available funding must be accessed first."),
  ssahDocumentation: external("A regulated health professional must document the child's functional limitations, and the program is discretionary."),
  acsdSeverity: external("The ministry assesses the severity of the child's disability and the extraordinary costs related to it."),
  acsdIncome: external("Depends on total household income against a $77,640 threshold, plus family size and disability-related costs."),
  adpClinical: external("A registered authorizer must assess the person against the clinical criteria for that specific device category."),
  oapDiagnosis: {
    evidence: "answers",
    satisfy: { set: { autismDiagnosis: "yes" } },
    violations: [{ name: "no written diagnosis yet", fragment: { set: { autismDiagnosis: "no" } }, expect: "almost" }],
  },
  odspMedical: external("ODSP adjudicates the Disability Determination Package; the wizard cannot know the outcome."),
  odspFinancial: external("ODSP assesses income, assets, shelter costs and family size; the wizard cannot compute financial need."),
  aishMedical: external("AISH medical eligibility is adjudicated by the program from medical evidence."),
  aishFinancial: external("AISH applies its own income and asset test to the household."),
  // No answer distinguishes designation from receipt, or establishes another route.
  surreyLeisureRoute: external("Surrey's listed route and its conditions need confirmation; PWD designation alone is not receipt."),
  aishAge: {
    evidence: "answers",
    satisfy: { set: { ageBand: "19to59" } },
    violations: [
      { name: "under eighteen: hard age minimum", fragment: { set: { ageBand: "under6" } }, expect: "no" },
      { name: "senior: OAS eligibility not asked", fragment: { set: { ageBand: "65plus" } }, expect: "almost" },
    ],
  },
  adapAge: {
    evidence: "answers",
    satisfy: { set: { ageBand: "19to59" } },
    violations: [
      { name: "under eighteen: hard age minimum", fragment: { set: { ageBand: "under6" } }, expect: "no" },
      { name: "senior: OAS eligibility not asked", fragment: { set: { ageBand: "65plus" } }, expect: "almost" },
    ],
  },
  adapMedical: external("ADAP medical eligibility is adjudicated by the program."),
  adapFinancial: external("ADAP applies its own financial test."),
  ahcipRegistered: external("Depends on active Alberta Health Care Insurance Plan registration."),
  aadlAssessment: external("Requires an assessment by an AADL-authorised assessor."),
  aadlOtherPayer: external("Depends on eligibility for comparable benefits, including the NIHB fallback."),
  bcVehicleDisabilityRoute: external("ICBC requires confirmation through a registration-page disability route; the wizard cannot establish it from physical, vision or transit answers."),
  pddEligibility: external("PDD eligibility is determined by the program, including its own assessment process."),
  fscdEligibility: external("FSCD eligibility is determined by a regional caseworker agreement."),
  dresResidencyAndStatus: external("DRES confirms residency and immigration status through its own intake."),
  dresDisabilityBarrier: external("DRES assesses whether the disability creates an employment barrier."),
  dresEmploymentRoute: external("DRES confirms the employment or training route through intake."),
  abGrantStudyAidEligibility: external("Depends on Alberta student aid eligibility, assessed separately."),
  abGrantCurrentCostRequest: external("Depends on the actual current-year cost request and the federal-first rules."),
  adultHealthIncome: external("The Alberta Adult Health Benefit applies its own income test."),
  adultHealthGateway: external("Depends on the qualifying gateway programme the ministry records."),
  achbFamilyResidencyStatus: external("Depends on the family's residency and status as the ministry records it."),
  achbCoverageCoordination: external("Depends on coordination with any other health coverage the family already holds."),
  rampMobilityRoute: external("RAMP confirms the mobility route through its own documented process."),
  rampIncomeAndResidency: external("RAMP applies its own income and residency test."),
  abServiceDogQualified: external("Depends on a qualified service dog team assessment under the Service Dogs Act."),
  abCapccContinuingCareHome: external("Depends on placement in a designated continuing care home."),
  abSpecialNeedsHousingPlacement: external("Depends on a housing placement decision made by the provider."),
  lowIncomeOrDisabilityIncome: external("The municipality applies its own income or disability-income test at intake."),
  municipalProgramEligibility: external("The municipality determines eligibility through its own application."),

  /* British Columbia — ministry adjudication and registration */
  bcPwdMedical: external("PWD designation requires the ministry's own medical adjudication."),
  bcPwdDesignationFinancial: external("PWD designation applies the ministry's family-unit income and asset test."),
  bcDisabilityAssistanceFinancial: external("Disability assistance applies the ministry's own income and asset test."),
  bcSupplementaryBenefitsEligibility: external("MSP supplementary benefits apply their own eligibility test."),
  planGClinicalAndFinancialNeed: external("Plan G requires both a clinical assessment and a financial need determination."),
  planPRegistration: external("Plan P requires registration through the palliative care programme."),
  firstNationsStatus: external("First Nations Health Authority coverage depends on status the FNHA verifies."),
  bcHealthyKidsIncome: external("Healthy Kids applies its own family income test."),
  translinkHandyCard: external("Requires an existing TransLink HandyDART/HandyCard registration."),
  bcTransitHandyDart: external("Requires registration as a permanent BC Transit handyDART customer."),
  bcCydbIntake: external("Direct applications do not open until April 1, 2027; current families transition through existing pathways."),
  atHomeProgram: external("Requires prior enrolment in the At Home Program."),
  bcHomeOwnerGrantDisabilityRoute: external("Depends on the specific disability route the grant recognises, evidenced to the province."),
  rahaEligibility: external("RAHA applies its own income and asset limits, which are not published in a form the wizard can test."),
  bcWorkBcRoute: external("WorkBC confirms the service route at intake."),
  bcFuelTaxRoute: external("Fuel-tax registration accepts certification, BCANDS, Veterans' Affairs, CNIB or medical routes, including permanent mental disability making public transportation hazardous. Physical, vision or transit answers cannot disprove these unasked routes; fuel tax no longer uses vehicleDisability."),
  bcFuelTaxRegistered: external("Requires an approved registration in the fuel tax refund programme."),
  bcDefermentProperty: external("Depends on residency duration, registered ownership, equity share and tax arrears."),
  coquitlamStatus: external("Coquitlam determines status through its own application."),
  coquitlamIncome: external("Coquitlam applies its own income test."),
  archIncomeOrAssistance: external("Kamloops ARCH applies its own income or assistance test."),
};

/* --------------------------------------------------------------------------
   DECLARED BEST-CASE OUTCOME PER PROGRAM  (the frozen baseline)

   Why this exists even though the outcome is derivable from the gates: because
   derivation alone cannot catch a gate being DELETED. Remove
   qualifyingRenovationSpend from a program's `requires` and the derivation
   happily re-derives "ready" — it agrees with the mutation, which makes it
   useless as a guard against exactly the edit TEST-01 is about.

   So the value is written down. Three things then have to agree on every run:

     declared (this map)  ==  derived (the gate registry)  ==  actual (the app)

   Deleting a gate breaks declared-vs-derived. Changing the matcher breaks
   declared-vs-actual. Neither can be done silently.

   "almost" here is never a defect; it means the program depends on evidence
   the product cannot see, and saying so is the honest answer. Changing a value
   in this map is a product decision: it asserts that a person can now finish an
   application on what the wizard knows, and it needs the same evidence as any
   other data change. Bump SPEC_VERSION when one changes.
   -------------------------------------------------------------------------- */
/*
    MUTATION EVIDENCE — recorded 2026-08-06, both directions

    1. Gate removed from data. public/data.js, home-accessibility-tax-credit
       requires reduced to ["homeRenoCandidate", "homeowner"]:

       e2e/matcher-safety.spec.js:1411
         Error: home-accessibility-tax-credit must not claim readiness before the work is done
         Expected: "almost"
         Received: "ready"

       e2e/eligibility-oracle.spec.js (coverage)
         "home-accessibility-tax-credit - declared almost, but its gates now derive ready
          (requires: homeRenoCandidate, homeowner)"

    2. Gate flipped in the matcher. public/app.js, qualifyingRenovationSpend
       met: () => false changed to () => true. Two programs failed,
       home-accessibility-tax-credit and bc-home-reno-tax-credit, both:
         Expected: "almost"
         Received: "ready"

    Both mutations were reverted; git diff on public/ is empty.
*/
// #216 (2026-10-14): CDB amount calculation and RDSP grant/bond age window
// moved to guide context; neither is an application prerequisite for its record.
// No status changes: CDB retains tax/status checks; RDSP retains opening and
// contribution checks. BC intake is unchanged. See research/216-misfiled/PROPOSAL.md.
const PROGRAM_BEST_CASE = {
  "dtc":                                           "almost",
  "cdb-adult":                                     "almost",
  "child-disability-benefit":                      "almost",
  "rdsp":                                          "almost",
  "cwb-disability":                                "almost",
  "cpp-disability":                                "almost",
  "cpp-childrens-benefit":                         "almost",
  "csg-disability":                                "almost",
  "csg-dse":                                       "almost",
  "home-accessibility-tax-credit":                 "almost",
  "multigenerational-home-renovation-tax-credit":  "almost",
  "excise-gasoline-tax-refund":                    "almost",
  "canadian-dental-care-plan":                     "almost",
  "disability-supports-deduction":                 "almost",
  "medical-expense-tax-credit":                    "almost",
  "canada-caregiver-credit":                       "almost",
  "aish":                                          "almost",
  "adap":                                          "almost",
  "aadl":                                          "almost",
  "pdd":                                           "almost",
  "fscd":                                          "almost",
  "dres":                                          "almost",
  "ab-grant-disability":                           "almost",
  "adult-health-benefit":                          "almost",
  "child-health-benefit":                          "almost",
  "ramp":                                          "almost",
  "parking-placard":                               "almost",
  "ab-service-dog-id-card":                        "almost",
  "ab-capcc":                                      "almost",
  "ab-special-needs-housing":                      "almost",
  "calgary-fair-entry":                            "ready",
  "edmonton-fare-assistance":                      "almost",
  "reddeer-fee-assistance":                        "almost",
  "lethbridge-fee-assistance":                     "almost",
  "medicinehat-fair-entry":                        "almost",
  "grandeprairie-aish-pass":                       "almost",
  "stalbert-subsidy":                              "almost",
  "strathcona-subsidy":                            "almost",
  "airdrie-fair-access":                           "almost",
  "woodbuffalo-lift":                              "almost",
  "sprucegrove-low-income-transit":                "ready",
  "leduc-subsidies":                               "ready",
  "cochrane-connect-card":                         "ready",
  "okotoks-fee-assistance":                        "almost",
  "canmore-affordable-services":                   "ready",
  "lloydminster-recreation-access":                "ready",
  "fortsask-access":                               "almost",
  "local-supports":                                "ready",
  "bc-pwd-designation":                            "almost",
  "bc-fair-pharmacare":                            "ready",
  "bc-msp-supplementary-benefits":                 "almost",
  "bc-pharmacare-plan-c":                          "ready",
  "bc-pharmacare-plan-g":                          "almost",
  "bc-pharmacare-plan-p":                          "almost",
  "bc-fnha-health-benefits":                       "almost",
  "bc-healthy-kids":                               "almost",
  "bc-medical-transportation":                     "almost",
  "handydart-translink":                           "ready",
  "handycard-translink":                           "ready",
  "taxisaver-translink":                           "almost",
  "handydart-bctransit":                           "ready",
  "taxi-saver-bctransit":                          "almost",
  "bc-disability-assistance-pwd":                  "almost",
  "bc-autism-funding-under-6":                     "ready",
  "bc-autism-funding-6-18":                        "ready",
  "bc-cy-disability-benefit":                      "almost",
  "bc-monthly-nutritional-supplement":             "ready",
  "bc-optical-supplement":                         "ready",
  "bc-bus-pass":                                   "ready",
  "sparc-parking-permit":                          "ready",
  "on-parking-permit":                             "ready",
  "odsp":                                          "almost",
  "on-adp":                                        "almost",
  "waterloo-ontario-renovates":                    "almost",
  "waterloo-homemaking-support":                    "almost",
  "waterloo-curbside-waste-support":                "almost",
  "grt-affordable-transit":                        "ready",
  "grt-cnib-pass":                                 "ready",
  "grt-mobilityplus":                              "almost",
  "grt-taxi-coupons":                              "ready",
  "grt-support-person":                            "almost",
  "york-region-homemakers":                        "almost",
  "york-region-recreation-subsidies":              "almost",
  "ottawa-community-pass":                         "almost",
  "ottawa-access-pass":                            "almost",
  "ottawa-equipass":                               "ready",
  "ottawa-a-card":                                 "almost",
  "london-ontario-renovates":                      "almost",
  "windsor-affordable-pass":                       "almost",
  "windsor-recreation-assistance":                 "almost",
  "hamilton-fare-assist":                          "ready",
  "niagara-transit-benefit-pass":                  "ready",
  "kingston-affordable-transit-pass":              "ready",
  "halton-split":                                  "ready",
  "abbotsford-prc-subsidy":                        "ready",
  "abbotsford-specialized-access":                 "ready",
  "maple-ridge-access-pass-financial":             "ready",
  "maple-ridge-access-pass-disability":            "ready",
  "nanaimo-leap":                                  "ready",
  "new-westminster-financial-assistance":          "ready",
  "prince-george-lap":                             "ready",
  "banff-access-program":                          "ready",
  "blackfalds-recreation-fee-assistance":          "ready",
  "chestermere-community-access-program":          "ready",
  "drayton-valley-recreation-fee-assistance":      "ready",
  "edson-leisure-assist":                          "ready",
  "rocky-mountain-house-rfap":                     "ready",
  "strathmore-community-access-card":              "ready",
  "whitecourt-recreation-fee-assistance":          "ready",
  "belleville-recreation-fee-assistance":          "ready",
  "chatham-kent-affordable-bus-pass":              "ready",
  "cornwall-fair":                                 "ready",
  "peterborough-recreation-subsidy":               "ready",
  "peterborough-ow-odsp-transit-pass":             "almost",
  "campbell-river-life":                           "ready",
  "colwood-langford-life":                         "ready",
  "courtenay-comox-rap-leap":                      "ready",
  "cranbrook-leisure-access":                      "ready",
  "duncan-leisure-access":                         "ready",
  "mission-play-pass":                             "ready",
  "penticton-life":                                "ready",
  "penticton-access-pass":                         "ready",
  "pitt-meadows-fee-subsidy":                      "ready",
  "port-moody-leisure-access":                     "ready",
  "prince-rupert-recreation-access":               "ready",
  "quesnel-leisure-access":                        "ready",
  "squamish-recreation-access":                    "ready",
  "terrace-affordable-recreation-access":          "almost",
  "white-rock-leisure-access":                     "ready",
  "bridgewater-pro-kids":                          "ready",
  "ns-poverty-reduction-credit":                   "almost",
  "ns-childrens-oral-health":                      "ready",
  "ns-community-bus-pass":                         "almost",
  "ns-seniors-wheelchair-loan":                    "almost",
  "ns-day-programs":                               "ready",
  "ns-public-housing":                             "ready",
  "ns-preschool-autism":                           "ready",
  "ns-ambulance-fee-waiver":                       "ready",
  "ns-student-loan-forgiveness-disabilities":      "ready",
  "ns-income-assistance":                          "ready",
  "ns-disability-support-program":                 "ready",
  "ns-direct-family-support-children":             "ready",
  "ns-caregiver-benefit":                          "almost",
  "ns-osd-pharmacare":                             "almost",
  "ns-seniors-pharmacare":                         "ready",
  "ns-family-pharmacare":                          "almost",
  "ns-harp":                                       "ready",
  "ns-seniors-care-grant":                         "ready",
  "ns-seniors-property-tax-rebate":                "almost",
  "ns-housing-repair-accessibility":               "ready",
  "ns-rent-supplement":                            "ready",
  "ns-accessible-parking":                         "ready",
  "nb-drug-plan":                                  "almost",
  "nb-hearing-aid-program":                        "almost",
  "nb-public-housing":                             "ready",
  "nb-seniors-home-renovation-credit":             "ready",
  "nb-childcare-assistance":                       "ready",
  "nb-homeowner-repair":                           "ready",
  "moncton-cnib-free-transit":                     "ready",
  "dieppe-accessible-transit":                     "ready",
  "fredericton-para-transit":                      "ready",
  "saint-john-accessible-transit":                 "ready",
  "saint-john-pro-kids":                           "ready",
  "nb-social-assistance":                          "ready",
  "nb-disability-support-program":                 "ready",
  "nb-self-managed-support":                       "almost",
  "nb-employment-support-services":                "almost",
  "nb-tess":                                       "ready",
  "nb-family-supports-children":                   "ready",
  "nb-vehicle-retrofit":                           "ready",
  "nb-accessible-parking":                         "ready",
  "nb-prescription-drug-program":                  "ready",
  "nb-healthy-smiles-clear-vision":                "ready",
  "nb-preschool-autism":                           "ready",
  "nb-long-term-care-home-support":                "almost",
  "nb-extra-mural":                                "almost",
  "nb-low-income-seniors-benefit":                 "almost",
  "nb-child-tax-benefit":                          "ready",
  "nb-health-services-equipment":                  "almost",
  "nb-portable-rent-supplement":                   "ready",
  "nb-rent-supplement":                            "ready",
  "nb-rrap":                                       "ready",
  "nb-ambulance-fee-exemption":                    "almost",
  "brandon-access-transit":                        "ready",
  "brandon-cnib-free-transit":                     "ready",
  "mb-eapd":                                       "ready",
  "mb-rent-supplement":                            "ready",
  "mb-prenatal-benefit":                           "ready",
  "winnipeg-recreation-fee-assistance":            "ready",
  "winnipeg-winnpass":                             "ready",
  "winnipeg-transit-plus":                         "ready",
  "mb-supports-persons-disabilities":              "ready",
  "mb-eia":                                        "ready",
  "mb-rent-assist":                                "ready",
  "mb-pharmacare":                                 "ready",
  "mb-disability-health-supports":                 "almost",
  "mb-childrens-disability-services":              "ready",
  "mb-community-living-disability-services":       "almost",
  "mb-home-care":                                  "almost",
  "mb-primary-caregiver-tax-credit":               "almost",
  "mb-child-benefit":                              "ready",
  "mb-55-plus":                                    "ready",
  "mb-accessible-parking":                         "ready",
  "mb-residential-adaptations":                    "ready",
  "swift-current-access-transit":                  "ready",
  "regina-affordable-access":                      "ready",
  "regina-paratransit":                            "ready",
  "saskatoon-access-transit":                      "ready",
  "saskatoon-leisure-access-program":              "ready",
  "saskatoon-low-income-bus-pass":                 "ready",
  "north-battleford-handi-bus":                    "ready",
  "regina-discounted-31-day-pass":                 "almost",
  "moose-jaw-discounted-monthly-pass":             "almost",
  "moose-jaw-paratransit":                         "ready",
  "prince-albert-access-transit":                  "ready",
  "saskatoon-accessible-parking-permit-subsidy":   "ready",
  "yorkton-access-transit":                        "ready",
  "yorkton-discounted-monthly-pass":               "almost",
  "sk-active-families-benefit":                    "ready",
  "sk-low-income-tax-credit":                      "ready",
  "sk-early-childhood-intervention":               "ready",
  "sk-cochlear-processor":                         "almost",
  "sk-said":                                       "ready",
  "sk-income-support":                             "ready",
  "sk-employment-incentive":                       "ready",
  "sk-housing-benefit":                            "ready",
  "sk-sail":                                       "almost",
  "sk-supplementary-health":                       "almost",
  "sk-family-health-benefits":                     "ready",
  "sk-special-support":                            "ready",
  "sk-seniors-drug-plan":                          "ready",
  "sk-seniors-income-plan":                        "ready",
  "sk-autism-individualized-funding":              "ready",
  "sk-cognitive-disability-strategy":              "almost",
  "sk-family-respite-intellectual-disability":     "ready",
  "sk-home-care":                                  "almost",
  "sk-adaptations-for-independence":               "ready",
  "sk-eapd":                                       "ready",
  "sk-personal-care-home-benefit":                 "ready",
  "sk-accessible-parking":                         "ready",
  "bc-subsidized-housing":                         "ready",
  "on-childrens-rehab":                            "ready",
  "on-child-benefit":                              "ready",
  "on-dso-adult-services":                         "ready",
  "on-enhanced-respite":                           "ready",
  "on-gains":                                      "ready",
  "on-healthy-smiles":                             "ready",
  "on-ontario-works":                              "ready",
  "on-seniors-dental":                             "ready",
  "on-trillium-benefit":                           "ready",
  "on-drug-benefit":                               "ready",
  "on-home-community-care":                        "almost",
  "on-northern-health-travel-grant":               "almost",
  "on-odsp-employment-supports":                   "almost",
  "on-odsp-health-benefits":                       "almost",
  "on-oesp":                                       "ready",
  "bc-csil":                                       "almost",
  "bc-family-benefit":                             "ready",
  "bc-home-support":                               "almost",
  "bc-income-assistance":                          "ready",
  "bc-nursing-support-services":                   "almost",
  "bc-ppmb":                                       "almost",
  "bc-rental-assistance-program":                  "ready",
  "bc-safer":                                      "ready",
  "bc-hearing-supplements":                        "ready",
  "ab-blue-cross-non-group":                       "ready",
  "ab-brain-injury":                               "ready",
  "ab-child-family-benefit":                       "ready",
  "ab-home-care":                                  "almost",
  "ab-income-support":                             "ready",
  "ab-rent-assistance-benefit":                    "ready",
  "ab-seniors-benefit":                            "ready",
  "ab-seniors-dental-optical":                     "ready",
  "ab-seniors-special-needs-assistance":           "ready",
  "ab-sharp":                                      "ready",
  "brantford-recreation-subsidy":                  "ready",
  "cornwall-community-bus-pass":                   "almost",
  "dawson-creek-leisure-access":                   "ready",
  "high-river-community-access-program":           "ready",
  "langley-leisure-access-grant":                  "ready",
  "morinville-wrap":                               "ready",
  "nelson-rdck-leisure-access":                    "ready",
  "port-coquitlam-financial-assistance":           "ready",
  "sarnia-cnib-pass":                              "ready",
  "taber-fee-assistance":                          "ready",
  "west-vancouver-recreation-financial-assistance": "ready",
  "brampton-activeassist":                         "ready",
  "mississauga-activeassist":                      "ready",
  "ottawa-hand-in-hand":                           "ready",
  "toronto-fair-pass":                             "ready",
  "toronto-welcome-policy":                        "ready",
  "trillium-drug-program":                         "almost",
  "passport-program":                              "almost",
  "hvmp":                                          "almost",
  "ssah":                                          "almost",
  "acsd":                                          "almost",
  "ontario-autism-program":                        "ready",
  "bc-medical-equipment-devices":                  "ready",
  "bc-at-home-medical":                            "almost",
  "bc-supported-child-development":                "ready",
  "bc-at-home-saet":                               "almost",
  "bc-clbc":                                       "almost",
  "bc-csg-students-disabilities":                  "ready",
  "bc-csg-services-equipment":                     "ready",
  "bc-access-grant-students-disabilities":         "ready",
  "bc-supplemental-bursary-students-disabilities": "ready",
  "bc-assistance-program-students-disabilities":   "ready",
  "bc-learning-disability-assessment-bursary":     "almost",
  "bc-access-grant-deaf-students":                 "ready",
  "bc-dental-supplement":                          "ready",
  "bc-additional-home-owner-grant":                "almost",
  "bc-home-reno-tax-credit":                       "almost",
  "bc-raha":                                       "almost",
  "bc-work-able-internship":                       "ready",
  "bc-workbc-assistive-technology":                "ready",
  "bc-workbc-employment-services":                 "almost",
  "bc-fuel-tax-refund-disabilities":               "almost",
  "bc-icbc-disability-discount":                   "almost",
  "bc-property-tax-deferment-disabilities":        "almost",
  "bc-sales-tax-credit":                           "ready",
  "vancouver-leisure-access":                      "ready",
  "surrey-leisure-access":                         "almost",
  "burnaby-fair-play":                             "almost",
  "richmond-rec-fee-subsidy":                      "ready",
  "victoria-life":                                 "ready",
  "saanich-life":                                  "ready",
  "kelowna-recreation-assistance":                 "ready",
  "coquitlam-far":                                 "almost",
  "kamloops-arch":                                 "almost",
};

/* --------------------------------------------------------------------------
   DECLARED PROGRAM EXPECTATIONS

   Almost every program's outcome sets are derived from its gates, which is the
   point — the derivation is the assertion. This map is for programs whose
   expected outcome is a deliberate product decision that the gate list alone
   does not explain. Empty is the healthy state; an entry here is a claim
   somebody has to defend at review.
   -------------------------------------------------------------------------- */
const PROGRAM_NOTES = {
  "bc-icbc-disability-discount": {
    bestCase: "almost",
    why: "TaskView #221, batch three item nine: registration-page disability confirmation has alternatives the wizard does not collect. Missing physical, vision or transit categories must not reject ICBC; bcVehicleDisabilityRoute and fuel-tax registration remain external. The shared vehicleDisability gate stays unchanged for its other users. Item twenty adds age text only, not an age gate.",
  },
  "burnaby-fair-play": { bestCase: "almost", why: "Review F1: PWD designation does not establish receiving assistance; eligibility route needs external confirmation." },
  "bc-medical-transportation": { bestCase: "almost", why: "Review F1: PWD designation does not establish receiving assistance; eligibility route needs external confirmation." },
  "bc-at-home-medical": {
    bestCase: "almost",
    why: "TaskView #219, snapshot bc-at-home-medical--2: assessed ADL dependence and the assessment-free direct-nursing-care and certified palliative routes are alternatives. The wizard establishes none of the required assessment or clinical eligibility facts.",
  },
  "child-health-benefit": {
    bestCase: "almost",
    why: "Alberta Child Health Benefit must stay conditional for a child under 18 — family residency status and coverage coordination are ministry facts. Asserted in e2e/matcher-safety.spec.js and required by the working record.",
  },
  "home-accessibility-tax-credit": {
    bestCase: "almost",
    why: "HATC must remain almost until eligible work is done and paid for. Batch two uses hatcQualifyingRenovationSpend for its non-refundable wording; removing this external gate must still expose false readiness. Missing ownership or personal DTC answers are now almost, not no, because expected residence and family claimant routes are unasked.",
  },
  "bc-home-reno-tax-credit": {
    bestCase: "almost",
    why: "Record-specific renovation-spend gate; the renovation must actually be done and the expense is deemed paid when paid or payable.",
  },
  "multigenerational-home-renovation-tax-credit": {
    bestCase: "almost",
    why: "Same renovation-spend gate, plus a secondary unit that must actually exist.",
  },
};

// Frozen no-confirmation baseline remains the current pre-pilot 45 ready / 89 almost (the proposal predates later gate reviews).
const PROGRAM_NO_CONFIRMATION = { ...PROGRAM_BEST_CASE,
  "grt-affordable-transit": "almost", "grt-cnib-pass": "almost", "grt-taxi-coupons": "almost" };

module.exports = {
  SCOPED_FACTS,
  PROGRAM_NO_CONFIRMATION,
  SPEC_VERSION,
  PROGRAM_BEST_CASE,
  DIMENSIONS,
  OUTCOMES,
  BASE_PERSONA,
  DEFAULT_CITY,
  OTHER_CITY,
  GATES,
  PROGRAM_NOTES,
};
