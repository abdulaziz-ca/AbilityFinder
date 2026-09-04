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

const SPEC_VERSION = "1.5.0";

/* The persona dimensions this oracle asserts over. These are the keys of the
   production answer model — see the wizard STEPS in public/app.js. Any gate
   whose satisfaction needs a dimension outside this list is by definition
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
  "situation", "income", "city", "postal",
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
  situation: ["none"],
  income: "moderate",
  city: null,
  postal: null,
};

/* Default community per province, chosen so it carries no municipal program of
   its own — a persona should never satisfy a city gate it did not ask for. Both
   are real entries in CITIES_BY_PROVINCE. */
const DEFAULT_CITY = { AB: "Camrose", BC: "Nanaimo" };

/* Cities used to violate a city gate: same province, different community. */
const OTHER_CITY = { AB: "Wetaskiwin", BC: "Prince George" };

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
  okotoks: municipality("Okotoks", "AB"),
  canmore: municipality("Canmore", "AB"),
  lloydminster: municipality("Lloydminster", "AB"),
  fortsask: municipality("Fort Saskatchewan", "AB"),

  /* ------------------------------------------------------ BC municipalities */
  vancouver: municipality("Vancouver", "BC"),
  surrey: municipality("Surrey", "BC"),
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
  schoolAge: ageGate("6to11", "19to59"),
  age6to18: ageGate("6to11", "19to59"),
  age12plus: ageGate("19to59", "under6"),
  age16plus: ageGate("19to59", "under6"),
  age18plus: ageGate("19to59", "under6"),
  age19plus: ageGate("19to59", "under6"),
  adult: ageGate("19to59", "under6"),
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
  vehicleDisability: {
    evidence: "answers",
    satisfy: { add: { disabilities: ["physical"] } },
    violations: [
      { name: "no qualifying category", fragment: { drop: { disabilities: ["physical", "vision"] }, set: { functionalNeeds: ["none"] } }, expect: "no" },
      { name: "needs unsure", fragment: { drop: { disabilities: ["physical", "vision"] }, set: { functionalNeeds: ["unsure"] } }, expect: "almost" },
    ],
  },

  /* ----------------------------------------------------- functional limits */
  dailyLivingLimit: needGate("dailyLiving"),
  equipmentNeed: needGate("equipment"),
  transitBarrier: needGate("transitBarrier"),
  nutritionNeed: needGate("nutrition"),
  medicalTravelNeed: needGate("medicalTravel"),
  homeAccessNeed: needGate("homeAccess"),
  childHighNeeds: needGate("childHighNeeds"),
  childThreeAdls: needGate("childThreeAdls"),

  /* ---------------------------------------------------------- circumstance */
  homeowner: circumstanceGate("homeowner"),
  vehicleOwner: circumstanceGate("vehicleOwner"),
  recentGraduate: circumstanceGate("recentGraduate"),
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
  cdbAmountCalculation: external("Depends on adjusted family net income CRA calculates from filed returns."),
  ccbEligibility: external("Depends on existing Canada Child Benefit entitlement, which CRA determines."),
  cppContrib: external("Depends on the CPP contribution record held by Service Canada."),
  cppDisabilityContributorLink: external("Depends on a parent's approved CPP disability benefit, a Service Canada determination."),
  cwbEligibility: external("Depends on working income and adjusted family net income from a filed return."),
  rdspOpening: external("Depends on an RDSP actually being opened with a participating financial institution."),
  rdspContributionWindow: external("Depends on contribution room and the beneficiary's contribution history."),
  rdspGrantWindow: external("Depends on grant and bond entitlement years the government tracks, not the user."),
  csgNeedAndProgram: external("Depends on an assessed financial need and an approved program of study."),
  csgServicesEquipment: external("Depends on an assessment of the specific services or equipment required."),
  cdcpRequirements: external("Depends on absence of private dental coverage, filed returns and adjusted family net income."),
  disabilityMedicalExpensesPaid: external("Depends on expenses actually paid and receipted — money out the door, not an answer."),
  caregiverSupportClaim: external("Depends on the supporting person's own tax return and their dependant relationship."),
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
  adapMedical: external("ADAP medical eligibility is adjudicated by the program."),
  adapFinancial: external("ADAP applies its own financial test."),
  ahcipRegistered: external("Depends on active Alberta Health Care Insurance Plan registration."),
  aadlAssessment: external("Requires an assessment by an AADL-authorised assessor."),
  aadlOtherPayer: external("Depends on what another payer already covers for the same item."),
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
  bcFuelTaxRoute: external("Requires one of the programme's accepted disability confirmations."),
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
  "okotoks-fee-assistance":                        "ready",
  "canmore-affordable-services":                   "ready",
  "lloydminster-recreation-access":                "ready",
  "fortsask-access":                               "ready",
  "local-supports":                                "ready",
  "bc-pwd-designation":                            "almost",
  "bc-fair-pharmacare":                            "ready",
  "bc-msp-supplementary-benefits":                 "almost",
  "bc-pharmacare-plan-c":                          "ready",
  "bc-pharmacare-plan-g":                          "almost",
  "bc-pharmacare-plan-p":                          "almost",
  "bc-fnha-health-benefits":                       "almost",
  "bc-healthy-kids":                               "almost",
  "bc-medical-transportation":                     "ready",
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
  "passport-program":                              "almost",
  "hvmp":                                          "almost",
  "ssah":                                          "almost",
  "acsd":                                          "almost",
  "ontario-autism-program":                        "ready",
  "bc-medical-equipment-devices":                  "ready",
  "bc-at-home-medical":                            "ready",
  "bc-supported-child-development":                "ready",
  "bc-at-home-saet":                               "almost",
  "bc-clbc":                                       "ready",
  "bc-csg-students-disabilities":                  "ready",
  "bc-csg-services-equipment":                     "ready",
  "bc-access-grant-students-disabilities":         "ready",
  "bc-supplemental-bursary-students-disabilities": "ready",
  "bc-assistance-program-students-disabilities":   "ready",
  "bc-learning-disability-assessment-bursary":     "ready",
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
  "surrey-leisure-access":                         "ready",
  "burnaby-fair-play":                             "ready",
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
  "child-health-benefit": {
    bestCase: "almost",
    why: "Alberta Child Health Benefit must stay conditional for a child under 18 — family residency status and coverage coordination are ministry facts. Asserted in e2e/matcher-safety.spec.js and required by the working record.",
  },
  "home-accessibility-tax-credit": {
    bestCase: "almost",
    why: "The mutation acceptance criterion for ticket #61: removing the qualifyingRenovationSpend gate must turn this Expected: \"almost\" / Received: \"ready\".",
  },
  "bc-home-reno-tax-credit": {
    bestCase: "almost",
    why: "Same renovation-spend gate as the federal credit; a credit cannot be claimed before the work is paid for.",
  },
  "multigenerational-home-renovation-tax-credit": {
    bestCase: "almost",
    why: "Same renovation-spend gate, plus a secondary unit that must actually exist.",
  },
};

module.exports = {
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
