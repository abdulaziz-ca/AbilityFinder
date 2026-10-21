/* =============================================================================
   AbilityFinder — app (router + wizard + eligibility engine + guides)
   Views: landing → wizard → results → detail
   Plain JS, no build step, works from a local server.
   State is saved to IndexedDB + wired to the browser history so the Back
   button and reloads never lose the user's answers.
   ========================================================================== */

const DATA_PACKS = true;
// The index also names the unchanged, deployed full-data fallback. Core exports
// are configurable globals so full data.js can shadow them without redeclarations.
const CATALOGUE_INDEX = typeof BENEFIT_INDEX !== "undefined"
  ? BENEFIT_INDEX : BENEFITS.map(b => [b.id, b.level, null]);
const packRequests = new Map();
function loadDataScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); reject(new Error("Program data could not be downloaded. Please try again.")); };
    document.head.appendChild(script);
  });
}
function dataAssetVersion() {
  return document.querySelector('script[src*="app.js?v="]')?.getAttribute("src").split("?v=")[1] || "237";
}
function ensurePacks(provs) {
  if (!DATA_PACKS || typeof AF_ADD_PACK === "undefined") return Promise.resolve();
  return Promise.all([...new Set(provs)].filter(p => COVERED_PROVINCES.includes(p)).map(p => {
    if (AF_LOADED_PACKS.has(p)) return Promise.resolve();
    if (!packRequests.has(p)) {
      const request = loadDataScript(`data-pack-${p}.js?v=${dataAssetVersion()}`)
        .then(() => { if (!AF_LOADED_PACKS.has(p)) throw new Error(`Program pack ${p} did not load.`); })
        .catch(error => { packRequests.delete(p); throw error; });
      packRequests.set(p, request);
    }
    return packRequests.get(p);
  }));
}
function packsForIds(ids) {
  const selected = new Set(ids);
  return CATALOGUE_INDEX.filter(row => selected.has(row[0])).map(row => row[2]).filter(Boolean);
}
function packsForView() {
  if (["browse", "coverage", "updates", "impact"].includes(view)) return COVERED_PROVINCES;
  if (["results", "detail"].includes(view)) {
    return [answers.province, ...packsForIds([...Object.keys(progress), ...(view === "detail" ? [detailId, ...(BENEFIT_EXTRA[detailId]?.related || [])] : [])])];
  }
  return [];
}
const BC_ENABLED = true;
// Ontario rollout — dark until launch (ticket #91)
const ON_ENABLED = true;
// Saskatchewan: live with provincial records (cities come later).
const SK_ENABLED = true;
// Manitoba: live with provincial and Winnipeg records; PROVINCE_NOTICES.MB cautions users.
const MB_ENABLED = true;
// New Brunswick: live with provincial and city records.
const NB_ENABLED = true;
// Nova Scotia: live with provincial and city records.
const NS_ENABLED = true;
// Prince Edward Island rollout — dark until launch.
const PE_ENABLED = true;
// Newfoundland and Labrador rollout — dark until launch.
const NL_ENABLED = true;
// Quebec rollout — dark until launch.
const QC_ENABLED = true;
// Scope labels compose from the enabled-province set, so flipping a flag updates them everywhere.
// Invariant: with ON_ENABLED=false (and BC_ENABLED=true) these produce exactly the prior Alberta+BC strings.
const _SCOPE_FULL = ["Alberta", ...(BC_ENABLED ? ["British Columbia"] : []), ...(ON_ENABLED ? ["Ontario"] : []), ...(SK_ENABLED ? ["Saskatchewan"] : []), ...(MB_ENABLED ? ["Manitoba"] : []), ...(NB_ENABLED ? ["New Brunswick"] : []), ...(NS_ENABLED ? ["Nova Scotia"] : []), ...(PE_ENABLED ? ["Prince Edward Island"] : []), ...(NL_ENABLED ? ["Newfoundland and Labrador"] : []), ...(QC_ENABLED ? ["Quebec"] : [])];
const _SCOPE_DEMONYM = ["Albertans", ...(BC_ENABLED ? ["British Columbians"] : []), ...(ON_ENABLED ? ["Ontarians"] : []), ...(SK_ENABLED ? ["Saskatchewanians"] : []), ...(MB_ENABLED ? ["Manitobans"] : []), ...(NB_ENABLED ? ["New Brunswickers"] : []), ...(NS_ENABLED ? ["Nova Scotians"] : []), ...(PE_ENABLED ? ["Islanders"] : []), ...(NL_ENABLED ? ["Newfoundlanders and Labradorians"] : []), ...(QC_ENABLED ? ["Quebecers"] : [])];
const _SCOPE_ABBR = ["Alberta", ...(BC_ENABLED ? ["BC"] : []), ...(ON_ENABLED ? ["ON"] : []), ...(SK_ENABLED ? ["SK"] : []), ...(MB_ENABLED ? ["MB"] : []), ...(NB_ENABLED ? ["NB"] : []), ...(NS_ENABLED ? ["NS"] : []), ...(PE_ENABLED ? ["PEI"] : []), ...(NL_ENABLED ? ["NL"] : []), ...(QC_ENABLED ? ["QC"] : [])];
const _joinAnd = (a) => (a.length <= 1 ? (a[0] || "") : `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}`);
const _joinOrComma = (a) => (a.length <= 1 ? (a[0] || "") : `${a.slice(0, -1).join(", ")}, or ${a[a.length - 1]}`);
const _joinOr = (a) => (a.length <= 1 ? (a[0] || "") : `${a.slice(0, -1).join(", ")} or ${a[a.length - 1]}`);
const SCOPE_LABEL = `Alberta${BC_ENABLED ? ", BC" : ""}${ON_ENABLED ? ", ON" : ""}${SK_ENABLED ? ", SK" : ""}${MB_ENABLED ? ", MB" : ""}${NB_ENABLED ? ", NB" : ""}${NS_ENABLED ? ", NS" : ""}${PE_ENABLED ? ", PEI" : ""}${NL_ENABLED ? ", NL" : ""}${QC_ENABLED ? ", QC" : ""} + federal`;
const SCOPE_LABEL_LONG = _joinAnd(_SCOPE_FULL);
const SCOPE_RESIDENTS = _joinAnd(_SCOPE_DEMONYM);
const SCOPE_GOVERNMENTS = `Canada, ${_joinOrComma(_SCOPE_FULL)}`;
const SCOPE_ORGANIZATIONS = `${_SCOPE_FULL.join(", ")}, and national`;
const SCOPE_REGION_LABEL = _SCOPE_ABBR.join(" + ");
const SCOPE_DESTINATION = _joinOr(_SCOPE_FULL);
// "selected ... ones" rather than "fully built out": the catalogue holds chosen
// programs, not every provincial or municipal benefit. Both languages keep the
// residency explanation, which is the whole point of help on a residency question
// and was never a completeness claim.
const SCOPE_RESIDENCY_HELP = `The federal benefits in our catalog apply anywhere in Canada. Provincial and municipal programs depend on where you live — our catalog includes selected ${SCOPE_LABEL_LONG} ones.`;
const SCOPE_RESIDENCY_HELP_FR = `Les prestations fédérales du catalogue s'appliquent partout au Canada. Les programmes provinciaux et municipaux dépendent de votre lieu de résidence ; le catalogue en comprend une sélection pour ${["l'Alberta", ...(BC_ENABLED ? ["la Colombie-Britannique"] : []), ...(ON_ENABLED ? ["l'Ontario"] : []), ...(SK_ENABLED ? ["la Saskatchewan"] : []), ...(MB_ENABLED ? ["le Manitoba"] : []), ...(NB_ENABLED ? ["le Nouveau-Brunswick"] : []), ...(NS_ENABLED ? ["la Nouvelle-Écosse"] : []), ...(PE_ENABLED ? ["l'Île-du-Prince-Édouard"] : []), ...(NL_ENABLED ? ["Terre-Neuve-et-Labrador"] : []), ...(QC_ENABLED ? ["le Québec"] : [])].join(", ")}.`;

/* -------------------------------------------------- answer state (defaults) */
const BLANK = () => ({
  forWho: null,        // "self" | "child" | "family"
  disabilities: [],    // from DISABILITIES values
  ageBand: null,       // eligibility-relevant age range selected in the wizard
  ageGroup: null,      // derived "child" | "adult" | "senior"
  disabilityVerified: null, // "yes" | "no" | "unsure"
  autismDiagnosis: null,    // "yes" | "no" | "unsure" (only asked when relevant)
  onsetBefore18: null, // true | false  (dynamic: autism/intellectual)
  canWalkFar: null,    // true | false  (dynamic: physical)
  functionalNeeds: [],// selected functional impacts; never a diagnosis verdict
  province: null,      // "AB" | "BC" | "ON" | "SK" | "MB" | "NB" | "NS" | "PE" | "NL" | "QC" | "QC" | "other"
  msp: null,           // "yes" | "no" | "unsure" (BC only)
  bcAssistance: null,  // "pwd" | "other" | "none" | "unsure" (BC only)
  circumstances: [],  // concrete ownership/education facts used by a few BC programs
  citizenPR: null,     // true | false
  dtc: null,           // "yes" | "no" | "unsure"
  receives: [],        // benefit ids the person says they already get (RECEIVES_OPTIONS), or "none"/"unsure"
  situation: [],       // "student","working","looking","unableToWork","none"
  income: null,        // "low" | "moderate" | "high"
  city: null,          // an ALBERTA_CITIES string
  postal: null,        // optional — used to find local practitioners
});

/* ── Who are we talking about? ────────────────────────────────────────────────
   Every question used to say "you", even after someone said they were doing
   this for their child. Being asked "can you walk 50 metres?" about your kid is
   confusing at best, and it quietly signals the tool wasn't built for you.

   `subj()` is the subject ("you" / "your child" / "your family member") and
   `poss()` the possessive. Use them in question text instead of hardcoding.
   Third person is deliberate over a name: we never ask for one, and we are not
   going to start — see the privacy page. */
const FOR_WHO = {
  self: {
    subj: "you", poss: "your", them: "you",
    doQ: "Do you", areQ: "Are you", canQ: "Can you", haveQ: "Have you",
  },
  child: {
    subj: "your child", poss: "your child's", them: "them",
    doQ: "Does your child", areQ: "Is your child", canQ: "Can your child", haveQ: "Has your child",
  },
  family: {
    subj: "your family member", poss: "their", them: "them",
    doQ: "Does your family member", areQ: "Is your family member",
    canQ: "Can your family member", haveQ: "Has your family member",
  },
};
const who = () => FOR_WHO[answers.forWho] || FOR_WHO.self;
const subj = () => who().subj;
const poss = () => who().poss;

/* which kind of practitioner best fits the chosen disability (for finding help) */
const PRACTITIONERS = {
  vision: "optometrist",
  hearing: "audiologist",
  speech: "speech-language pathologist",
  adhd: "psychologist",
  learning: "psychologist",
  mental: "psychologist",
  autism: "psychologist",
  intellectual: "psychologist",
  braininjury: "neurologist",
};
function practitionerType() {
  for (const d of answers.disabilities) if (PRACTITIONERS[d]) return PRACTITIONERS[d];
  return "family doctor";
}
function mapsSearchUrl(query, coords) {
  // coords: center the map on the exact spot (path form with @lat,lng,zoom)
  if (coords) {
    return `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},12z`;
  }
  // otherwise let Google geocode a place string. Use the documented ?api=1 form
  // (the bare /maps/search/<text> form can leave the map at world view).
  let where = "";
  if (answers.postal) where = ` near ${answers.postal}`;
  else if (answers.city) where = ` in ${answers.city}, ${PROVINCE_NAME[answers.province] || ""}, Canada`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + where)}`;
}

/* configure where feedback is emailed. Change this to your real inbox. */
const FEEDBACK_EMAIL = "feedback@abilityfinder.ca";
// Set to the donation page URL (e.g. Ko-fi) to show the donation section.
const DONATION_URL = "";
let answers = BLANK();

/* view state */
let view = "landing";   // landing, wizard, results, browse, detail, privacy, about, support, updates, help, accessibility, professionals, partner-overview, impact, dtc-prep, grants, organizations
let stepIndex = 0;
let detailId = null;
let detailFrom = "results"; // "results" | "browse" — where the guide was opened from
let confirmedFacts = {}; // program + gate + version + component choices; device only
let progress = {};      // { benefitId: stageKey } — where the user is in each application
let editingReturn = false; // when true, editing one answer returns to results
let groupMode = "priority"; // "priority" | "category" — how results are grouped
const expandedBenefitIds = new Set(); // results-only accordion state; deliberately never persisted
let scenarioOpen = false; // results-only "what if" panel; deliberately never persisted
let dtcPrepFrom = "professionals"; // in-memory return target for the printable DTC sheet
let grantsAudience = "all"; // directory-only audience filter; deliberately never persisted
const scenarioChanges = new Map(); // hypothetical answer overrides; memory only, cleared on route changes

/* browse/search view state (explore all benefits without doing the wizard) */
let browseQuery = "";
let browseTheme = "all"; // a THEMES key, or "all"
let browseLevel = "all"; // "all" | "Federal" | "Alberta" | "local"
let browseDis = "all";   // a DISABILITIES value, or "all" — sorts, never hides
let browseNeed = "all";  // a browseable functional-need value, or "all" — sorts, never hides
let helpTopic = null;    // current contextual "I'm not sure" help page
let helpReturnStep = 0;  // which wizard step to come back to

/* the application journey, in order. No entry = "Not started". */
const STAGES = [
  { key: "saved",     label: "Saved for later",         short: "Saved",     ic: "bookmark", cls: "saved" },
  { key: "gathering", label: "Getting documents / doctor", short: "In progress", ic: "clock", cls: "gathering" },
  { key: "submitted", label: "Application submitted",    short: "Submitted", ic: "check",    cls: "submitted" },
  { key: "waiting",   label: "Waiting to hear back",     short: "Waiting",   ic: "clock",    cls: "waiting" },
  { key: "approved",  label: "Approved",                 short: "Approved",  ic: "check",    cls: "approved" },
  { key: "denied",    label: "Denied",                   short: "Denied",    ic: "info",     cls: "denied" },
];
const STAGE = Object.fromEntries(STAGES.map((s) => [s.key, s]));

/* accessibility preferences (kept separate so "start over" never resets them) */
let a11y = { fontScale: 1, spacing: false, contrast: false, links: false, guide: false, motion: false };
let askConsent = false;

/* ---------------------------------------------------------- helper getters */
const has = (arr, v) => arr.includes(v);
const wizardDone = () => visibleSteps().every(stepAnswered); // completed the current adaptive questionnaire?
const isStudent = () => has(answers.situation, "student");
const isWorking = () => has(answers.situation, "working");
const isLooking = () => has(answers.situation, "looking");
const isUnableToWork = () => has(answers.situation, "unableToWork");
const lowIncome = () => answers.income === "low";
const hasDisability = (v) => has(answers.disabilities, v);
const hasFunctionalNeed = (v) => has(answers.functionalNeeds, v);
const functionalNeedUnknown = () => hasFunctionalNeed("unsure");
const hasCircumstance = (v) => has(answers.circumstances, v);
const circumstanceUnknown = () => hasCircumstance("unsure");
const AGE_BANDS = [
  { value: "under6", label: "Younger than 6", sub: "Baby, toddler or preschool age" },
  { value: "6to11", label: "6 to 11", sub: "Usually elementary school" },
  { value: "12to15", label: "12 to 15", sub: "Usually junior high or secondary school" },
  { value: "16to17", label: "16 to 17", sub: "Secondary school or transition planning" },
  { value: "18", label: "18", sub: "Adult benefits may begin; school supports can continue" },
  { value: "19to59", label: "19 to 59" },
  { value: "60to64", label: "60 to 64" },
  { value: "65plus", label: "65 or older" },
];
const ageGroupForBand = (band) =>
  ["under6", "6to11", "12to15", "16to17"].includes(band)
    ? "child"
    : ["18", "19to59", "60to64"].includes(band)
      ? "adult"
      : band === "65plus" ? "senior" : null;
const ageIn = (...bands) => bands.includes(answers.ageBand);
const isUnder18 = () => ageIn("under6", "6to11", "12to15", "16to17");
const isAdultAge = () => ageIn("18", "19to59", "60to64");
const isSeniorAge = () => answers.ageBand === "65plus";
const isEmploymentActive = () => isWorking() || isLooking();
const METRO_VANCOUVER_CITIES = [
  "Burnaby", "Coquitlam", "Delta", "Langley", "Maple Ridge", "New Westminster",
  "North Vancouver", "Pitt Meadows", "Port Coquitlam", "Port Moody", "Richmond",
  "Surrey", "Vancouver", "West Vancouver", "White Rock",
];

/* =============================================================================
   REQUIREMENTS  (key -> {met, fixed, unmet, action?})
   fixed=true  -> a trait the user can't easily change -> "not a match"
   fixed=false -> actionable (get DTC, enroll, etc.)     -> "one step away"
   ========================================================================== */
const DTC_URL =
  "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2201.html";
const DTC_ELIGIBILITY_URL =
  "https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit/eligible-dtc.html";
const DRES_URL = "https://www.alberta.ca/disability-related-employment-supports";
const ACHB_URL = "https://www.alberta.ca/alberta-child-health-benefit";
const ACHB_DEPENDENT_DECLARATION_URL = "https://cfr.forms.gov.ab.ca/Form/AEHB3654";

const REQS = {
  dtc: {
    met: () => answers.dtc === "yes",
    fixed: false,
    unmet: "This needs Disability Tax Credit approval first.",
    action: { text: "Start the DTC (T2201)", url: DTC_URL },
  },
  prolonged: {
    short: "Ask a medical practitioner which CRA route to check",
    who: ["you", "professional"],
    // The questionnaire does not collect the CRA's practitioner-certified,
    // comparative marked-restriction, cumulative-effect, or life-sustaining-
    // therapy evidence. Keep this unresolved instead of turning a lay answer
    // into DTC readiness. Verified against the CRA eligibility page 2026-08-14.
    met: () => false,
    fixed: false,
    unmet: "Ask a medical practitioner to decide with you whether you meet a CRA route: a marked restriction in one category, combined limitations in two or more categories, or life-sustaining therapy. Read the full criteria.",
    action: { text: "Read the CRA's eligibility criteria", url: DTC_ELIGIBILITY_URL },
  },
  certifier: {
    // This requirement is shared by DTC and parking placards, so its copy must
    // stay program-neutral. Documentation in the profile is not the same as an
    // authorized practitioner certifying the program's application form.
    met: () => false,
    fixed: false,
    unmet: "Have an authorized practitioner certify the program's required form.",
  },

  adult: { met: isAdultAge, fixed: true, unmet: "This is for people aged 18–64." },
  torontoFairPassAge: {
    short: "Check the Fair Pass age range and other TTC fares",
    who: ["you"],
    met: () => ageIn("19to59", "60to64"),
    fixed: true,
    unmet: "Fair Pass lists applicants as between 20 and 64 years of age. If you are 13 to 19 or 65 and over, the City points you to the TTC's youth, student and seniors fares instead.",
  },
  workingAge: { met: isAdultAge, fixed: true, unmet: "This is for people aged 18–64." },
  child: { met: isUnder18, fixed: true, unmet: "This is for children under 18." },
  under6: { met: () => ageIn("under6"), fixed: true, unmet: "This program is only for children younger than 6." },
  age6to18: { met: () => ageIn("6to11", "12to15", "16to17", "18"), fixed: true, unmet: "This program is for children and youth aged 6–18." },
  schoolAge: { met: () => ageIn("6to11", "12to15", "16to17"), fixed: true, unmet: "This is for school-aged children and youth." },
  under19: { met: () => isUnder18() || ageIn("18"), fixed: true, unmet: "This is for children and youth younger than 19." },
  // The age bands cannot express the last day of the nineteenth birthday month.
  bcCydbAge: { met: () => isUnder18() || ageIn("18"), fixed: true,
    short: "Check the age range",
    who: ["you"],
    unmet: "This benefit is for children and youth from age 0 until the last day of their 19th birthday month." },
  age12plus: { met: () => ageIn("12to15", "16to17", "18", "19to59", "60to64", "65plus"), fixed: true, unmet: "You must be at least 12." },
  age16plus: { met: () => ageIn("16to17", "18", "19to59", "60to64", "65plus"), fixed: true, unmet: "You must be at least 16." },
  age18plus: { met: () => ageIn("18", "19to59", "60to64", "65plus"), fixed: true, unmet: "You must be at least 18." },
  age60plus: { met: () => ageIn("60to64", "65plus"), fixed: true, unmet: "This is for people aged 60 or older." },
  age65plus: { met: isSeniorAge, fixed: true, unmet: "This is for people aged 65 or older." },
  age19plus: { met: () => ageIn("19to59", "60to64", "65plus"), fixed: true, unmet: "This program starts at age 19." },
  under60: { met: () => ageIn("under6", "6to11", "12to15", "16to17", "18", "19to59"), fixed: true, unmet: "You must be under 60 to open this." },
  ab: { met: () => answers.province === "AB", fixed: true, unmet: "This is an Alberta program." },
  bc: { met: () => answers.province === "BC", fixed: true, unmet: "This is a British Columbia program." },
  on: { met: () => answers.province === "ON", fixed: true, unmet: "This is an Ontario program." },
  odspMedical: {
    short: "Check ODSP's disability decision or prescribed-class route",
    who: ["you", "professional", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "ODSP decides whether you meet its definition of a person with a disability: a substantial mental or physical impairment that is continuous or recurrent and expected to last a year or more, where the direct and cumulative effect results in a substantial restriction in your ability to work, care for yourself, or take part in community life, verified by an approved health care professional. Your caseworker gives you a Disability Determination Package to complete and return within 90 days. If you receive CPP-D or QPP-D you are in a prescribed class and skip this step.",
    action: { text: "Review ODSP eligibility", url: "https://www.ontario.ca/page/ontario-disability-support-program-eligibility-income-support" },
  },
  passportDevelopmental: {
    met: () => hasDisability("intellectual") || hasDisability("autism"),
    fixed: true,
    unmet: "Passport is for an adult with a developmental disability.",
  },
  passportDso: {
    short: "Ask Developmental Services Ontario about its review and the assessment",
    who: ["you", "professional", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "Developmental Services Ontario confirms whether you are eligible for government-funded adult developmental services, and a psychologist or psychological associate registered with the College of Psychologists of Ontario should have determined the developmental disability.",
    action: { text: "Apply through Developmental Services Ontario", url: "https://www.ontario.ca/page/passport-program-adults-developmental-disability" },
  },
  tdpDeductible: {
    short: "Check household drug costs, insurance and other drug coverage",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet:
      "The Trillium Drug Program is for households spending about 4% or more of their after-tax income on prescription drugs, who do not already qualify for the Ontario Drug Benefit and do not have insurance covering 100% of their drugs.",
    action: { text: "Apply to the Trillium Drug Program", url: "https://www.ontario.ca/page/get-help-high-prescription-drug-costs" },
  },
  hvmpMobility: {
    short: "Check how your disability limits movement and daily tasks",
    who: ["you"],
    // HVMP's criterion is broader than the parking-oriented `mobility` gate, and the
    // service coordinator decides it. fixed:false so a profile that does not obviously
    // match is told the criterion rather than being refused outright.
    met: () =>
      hasDisability("physical") || hasDisability("vision") || answers.canWalkFar === false,
    fixed: false,
    unmet:
      "This is for a disability that impedes mobility and results in substantial restriction in activities of daily living, such as personal care or getting to medical care and community services.",
  },
  hvmpIncome: {
    short: "Check the income limit and whether you may need to pay a share",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "Your household income must not exceed the program's established threshold. With a household income over $38,000 you may be required to contribute toward the cost of the modification.",
    action: { text: "See how to apply", url: "https://www.ontario.ca/page/home-and-vehicle-modification-program" },
  },
  hvmpCoordinator: {
    short: "Check other funding first and ask the coordinator about approval",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "You must first access any other sources of available public or private funding, and the program's service coordinator decides whether you meet the eligibility criteria and approves expenditures that comply with the program guidelines.",
    action: { text: "See how to apply", url: "https://www.ontario.ca/page/home-and-vehicle-modification-program" },
  },
  ssahDocumentation: {
    short: "A health professional documents your child's limits; funding is not guaranteed",
    who: ["you", "professional", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "SSAH needs a regulated health professional to document your child's functional limitations, and it is a discretionary program — funding is provided according to available resources, so meeting the rules does not guarantee an amount.",
    action: { text: "See how to apply for SSAH", url: "https://www.ontario.ca/page/special-services-home" },
  },
  acsdSeverity: {
    short: "Ask ACSD how it reviews your child's disability and extra costs",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "ACSD assesses how severe your child's disability is, along with the extraordinary costs related to it, to decide both eligibility and the amount.",
    action: { text: "Review ACSD eligibility", url: "https://www.ontario.ca/page/assistance-children-severe-disabilities-program" },
  },
  acsdIncome: {
    short: "Check family income, family size and disability costs with ACSD",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "ACSD is for families with a total household income of $77,640 or less. The amount also depends on the size of your family and your child's disability-related costs.",
    action: { text: "Review ACSD eligibility", url: "https://www.ontario.ca/page/assistance-children-severe-disabilities-program" },
  },
  adpClinical: {
    short: "Ask an ADP authorizer about the assessment for your device",
    who: ["you", "professional"],
    met: () => false,
    fixed: false,
    unmet:
      "Each ADP device category has its own clinical criteria. A registered authorizer for that device type must assess you and confirm you meet them, and that the equipment is generally needed for 6 months or longer.",
    action: { text: "See how to apply by device type", url: "https://www.ontario.ca/page/assistive-devices-program" },
  },
  oapDiagnosis: {
    met: () => answers.autismDiagnosis === "yes",
    fixed: false,
    unmet: "The Ontario Autism Program requires a written autism diagnosis from a qualified professional.",
  },
  odspFinancial: {
    short: "Check with ODSP about income, assets and what does not count",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "ODSP looks at your income, assets, living expenses, family size and shelter costs to decide financial need. Non-exempt assets must stay at or under $40,000 for a single person or $50,000 for a couple. Some income and assets are exempt, including child support, the Ontario Child Benefit, RDSP payments, and the home you own and live in.",
    action: { text: "Review ODSP eligibility", url: "https://www.ontario.ca/page/ontario-disability-support-program-eligibility-income-support" },
  },
  notBcStudentAidDuplicate: {
    short: "In B.C., apply for this federal grant through StudentAid BC",
    who: ["you"], met: () => answers.province !== "BC", fixed: true, unmet: "Use the StudentAid BC version of this federal grant; it is the same program with B.C.-specific application steps." },
  qc: { met: () => answers.province === "QC", fixed: true, unmet: "This is a Quebec program." },
  mb: { met: () => answers.province === "MB", fixed: true, unmet: "This is a Manitoba program." },
  sk: { met: () => answers.province === "SK", fixed: true, unmet: "This is a Saskatchewan program." },
  ns: { met: () => answers.province === "NS", fixed: true, unmet: "This is a Nova Scotia program." },
  nb: { met: () => answers.province === "NB", fixed: true, unmet: "This is a New Brunswick program." },
  nl: { met: () => answers.province === "NL", fixed: true, unmet: "This is a Newfoundland & Labrador program." },
  pe: { met: () => answers.province === "PE", fixed: true, unmet: "This is a Prince Edward Island program." },
  yt: { met: () => answers.province === "YT", fixed: true, unmet: "This is a Yukon program." },
  nt: { met: () => answers.province === "NT", fixed: true, unmet: "This is a Northwest Territories program." },
  nu: { met: () => answers.province === "NU", fixed: true, unmet: "This is a Nunavut program." },
  provinceCovered: { met: () => COVERED_PROVINCES.includes(answers.province), fixed: true, unmet: "Available across the covered provinces & territories." },
  citizenPR: { met: () => answers.citizenPR === true, fixed: true, unmet: "You must be a Canadian citizen or permanent resident." },
  achbAge: {
    short: "Check the child's age and high school rules for coverage",
    who: ["you"],
    met: () => isUnder18() || (ageIn("18", "19to59") && has(answers.situation, "secondary")),
    fixed: true,
    unmet: "Ordinary Alberta Child Health Benefit coverage is for children under 18. An 18- or 19-year-old must still be attending high school through grade 12.",
  },
  achbOlderDependent: {
    // The broad 19–59 answer plus "secondary" is only a safe proxy for a
    // possible 19-year-old. Exact age, home residence, grade and the required
    // declaration are not collected, so an older dependent can never be ready.
    met: () => isUnder18(),
    fixed: false,
    unmet: () => ageIn("19to59")
      ? "Confirm the person is exactly 19 (the selected age band also includes older adults), lives at home, is attending high school through grade 12, and submit the Declaration of 18 and 19 Year Old Dependent (AEHB3654)."
      : "Confirm the 18-year-old lives at home, is attending high school through grade 12, and submit the Declaration of 18 and 19 Year Old Dependent (AEHB3654).",
    action: { text: "Open declaration AEHB3654", url: ACHB_DEPENDENT_DECLARATION_URL },
  },
  achbFamilyResidencyStatus: {
    short: "Check where each family member lives and their status in Canada",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "Confirm the applicant and every family member included in the application live in Alberta and are Canadian citizens or permanent residents.",
    action: { text: "Review Alberta Child Health Benefit eligibility", url: ACHB_URL },
  },
  achbCoverageCoordination: {
    short: "Check excluded coverage and coordination for services covered by both plans",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Confirm the family is not receiving government health-benefit coverage through Income Support, AISH, the Child and Youth Support Program, or Non-Insured Health Benefits for First Nations and Inuit. Private or other health plans are not exclusions: use them first and ACHB may cover remaining eligible costs. For dental services covered by both plans, claim from the Canadian Dental Care Plan first; ACHB may then cover remaining eligible dental costs.",
    action: { text: "Review coverage and coordination rules", url: ACHB_URL },
  },

  lowIncome: { met: () => lowIncome(), fixed: true, unmet: "This is for lower-income households." },
  hamiltonFareRoute: {
    short: "Check the Ontario Works, ODSP or household income route",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Hamilton residents who are recipients of Ontario Works or the Ontario Disability Support Program (ODSP), or whose household incomes are below the Low-Income Measure, can apply for themselves and their family.",
  },
  niagaraTbpRoute: {
    short: "Check the Ontario Works, ODSP or low-income route",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You must get Ontario Works or ODSP, or Niagara Region must approve you as low income.",
  },
  // The wizard asks about post-secondary study but not full-time vs part-time.
  notFullTimePostSecondary: {
    short: "Check the full-time student rule",
    who: ["you"],
    met: () => !isStudent(),
    fixed: false,
    unmet: "Full-time post-secondary students are not eligible.",
  },
  haltonSplitRoute: {
    short: "Check the low-income, Ontario Works or ODSP route",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You must have a low income, or get Ontario Works or ODSP; Halton Region decides.",
  },
  abbotsfordPrcIncome: {
    short: "Check your income against the City's low-income chart",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Family net income after tax must be within the City of Abbotsford's low-income cutoff chart.",
  },
  mapleRidgeIncome: {
    short: "Check the Low Income Cut-off or third-party route",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Household income before tax must be at or below the Low Income Cut-off, or a third party verifies your need.",
  },
  nanaimoLeapRoute: {
    short: "Check the six financial-need routes",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You must show financial need by one of LEAP's six routes, such as assistance, GIS or income below the guidelines.",
  },
  newWestRoute: {
    short: "Check the agency referral or income route",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You need an agency referral, or household income below $50,000 shown on a recent tax assessment.",
  },
  princeGeorgeIncome: {
    short: "Check your income against the City's guidelines",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Annual income must be below the Statistics Canada Low Income Guidelines listed by the City.",
  },
  physicianConfirmedDisability: {
    short: "Check that a physician can confirm a permanent disability",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "A physician must confirm a permanent disability.",
  },
  mapleRidgeDisabilityProof: {
    short: "Check your disability documents or third-party verification",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You need disability documents such as PWD or DTC approval, or third-party verification.",
  },
  // The wizard asks about post-secondary study; LEAP excludes all post-secondary students.
  nanaimoNotStudent: { met: () => !isStudent(), fixed: true, unmet: "Post-secondary students are not eligible for LEAP." },
  banffAccessProgramRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your gross household income must be at or below the limit for your household size.",
  },
  blackfaldsRecreationFeeAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Total household income must be below the Statistics Canada Low Income Cut-Off.",
  },
  chestermereCommunityAccessProgramRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income must be low, based on the Low Income Cut-Offs.",
  },
  draytonValleyRecreationFeeAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your gross household income must be below the Statistics Canada Low Income Cut-Off.",
  },
  edsonLeisureAssistRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your income must be below the LICO, or you must get AISH, Income Support or GIS.",
  },
  rockyMountainHouseRfapRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Total family income must be at or under the limit for your family size, or you have an agency referral.",
  },
  strathmoreCommunityAccessCardRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income and family size must meet the Town's financial criteria.",
  },
  whitecourtRecreationFeeAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your circumstances must meet the financial criteria for people unable to pay the full fee.",
  },
  bellevilleRecreationFeeAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your total family income must be within the City's chart limit for your family size.",
  },
  chathamKentAffordableBusPassRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your family income must be at or below the before-tax low-income measure for your family size.",
  },
  cornwallFairRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your yearly family income must be at or below the Low Income Cut-Off.",
  },
  peterboroughRecreationSubsidyRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Household income must be under the cut-off chart, or you receive Ontario Works or ODSP.",
  },
  peterboroughOwOdspTransitPassRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be an adult on Ontario Works or a person on ODSP.",
  },
  campbellRiverLifeRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You live in Campbell River and meet the income limits on the LIFE form.",
  },
  colwoodLangfordLifeRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income is at or below the Statistics Canada low income thresholds.",
  },
  courtenayComoxRapLeapRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income is within the Statistics Canada after-tax low-income measure.",
  },
  cranbrookLeisureAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income is at or below the chart limit for your family size.",
  },
  duncanLeisureAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your gross household income is under the cutoff for your household size.",
  },
  missionPlayPassRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your income is at or below the CRA low income thresholds, or you are on income assistance.",
  },
  pentictonLifeRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You need a limited family income, as set out on the LIFE form.",
  },
  pentictonAccessPassRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You need a permanent cognitive or physical disability.",
  },
  pittMeadowsFeeSubsidyRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your income must be at or below the federal low-income cut-off.",
  },
  portMoodyLeisureAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Total family income must be within the limits for your family size.",
  },
  princeRupertRecreationAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You get a named assistance benefit or show financial need with tax documents.",
  },
  quesnelLeisureAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You get income assistance or your household income is under the limit.",
  },
  squamishRecreationAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Gross household income must be under the limit for your household size.",
  },
  terraceAffordableRecreationAccessRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must get one of the named assistance or disability benefits.",
  },
  whiteRockLeisureAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your family income must be at or below the limit for your family size.",
  },
  // Post-secondary study is asked in the wizard; these programs exclude those students.
  noPostSecondaryStudents: { met: () => !isStudent(), fixed: true, unmet: "This program does not accept post-secondary students." },
  brantfordRecreationSubsidyRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Family gross income within the City chart, or on Ontario Works or ODSP.",
  },
  cornwallCommunityBusPassRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must get ODSP or Ontario Works benefits.",
  },
  dawsonCreekLeisureAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Family income at or below the Statistics Canada Low-Income Cut-Off.",
  },
  highRiverCommunityAccessProgramRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Household income at or below the limit for your household size.",
  },
  langleyLeisureAccessGrantRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Low income under the program's income requirements; temporary residents are excluded.",
  },
  morinvilleWrapRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Household income within the Low-Income Cut-Offs chart for your household size.",
  },
  nelsonRdckLeisureAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Named government assistance, or income below the Low Income Measure on your Notice of Assessment.",
  },
  portCoquitlamFinancialAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Family income within the LICO table, or a Community Partner referral.",
  },
  sarniaCnibPassRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You need a valid CNIB card.",
  },
  taberFeeAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Income below the thresholds in the Town's Fee Assistance Procedure.",
  },
  westVancouverRecreationFinancialAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Low income without significant savings or assets, as set in the handout.",
  },
  onChildBenefitRoute: {
    short: "Check the income test and that you are raising a child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "Low-income to moderate-income families with children under 18 in their care.",
  },
  onDsoAdultServicesRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Adult with a developmental disability confirmed by a psychologist, living in Ontario.",
  },
  onEnhancedRespiteRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Child under 18 at home, medically fragile or technology dependent, needing 24-hour care.",
  },
  onGainsRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Age 65 or older, getting Old Age Security and Guaranteed Income Supplement, with low private income.",
  },
  onHealthySmilesRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Child 17 or under in a household under the income limit, or on named assistance programs.",
  },
  onOntarioWorksRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "People who need help with food and housing and are in financial need.",
  },
  onSeniorsDentalRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Age 65 or older, net income $25,480 or less (single) or $42,290 or less (couple), no other dental benefits.",
  },
  onTrilliumBenefitRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Ontario residents with low-to-moderate income; the Canada Revenue Agency decides from your return.",
  },
  onDrugBenefitRoute: {
    short: "Check which Ontario Drug Benefit route fits you",
    who: ["you"],
    met: () => isSeniorAge(),
    fixed: false,
    unmet: "Age 65 or older, or on Ontario Works or the Ontario Disability Support Program, or another listed group.",
  },
  onHomeCommunityCareRoute: {
    short: "Ask for a care needs assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "People of any age assessed by Ontario Health atHome as needing care at home.",
  },
  onNorthernHealthTravelGrantRoute: {
    short: "Check your district, referral and travel distance",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Northern Ontario residents who travel 100 km or more one way for referred specialist care.",
  },
  onOdspEmploymentSupportsRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "People who already get ODSP income support, and their eligible family members.",
  },
  onOdspHealthBenefitsRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "People who get ODSP income support and their families.",
  },
  onOespRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household size and after-tax income must be within the OESP levels.",
  },
  bcCsilRoute: {
    short: "Ask for a care needs assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Assessed as having high physical care needs and a physical disability, and medically stable.",
  },
  bcFamilyBenefitRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Family with a child under 18; the amount is reduced as family income rises.",
  },
  bcHomeSupportRoute: {
    short: "Ask for a care needs assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You are assessed by a health authority as needing personal assistance or caregiver respite.",
  },
  bcIncomeAssistanceRoute: {
    short: "Check the income test; disability assistance (PWD) is a separate program",
    who: ["you", "program"],
    met: () => lowIncome() && answers.bcAssistance !== "pwd",
    fixed: false,
    unmet: "You are in need and have no other resources after using all other income and assets.",
  },
  bcNursingSupportServicesRoute: {
    short: "Ask for a nursing assessment of your child's care needs",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Child or youth with a chronic, complex medical condition needing a registered nurse's skill.",
  },
  bcPpmbRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You already get income or hardship assistance and meet the PPMB health and barrier tests.",
  },
  bcRentalAssistanceProgramRoute: {
    short: "Check the income test, your dependent child and that you are not on assistance",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18() && !["pwd", "other"].includes(answers.bcAssistance),
    fixed: false,
    unmet: "Family with a dependent child; household income $60,000 or less before tax.",
  },
  bcSaferRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "A renter aged 60 or older with income under $40,000 who pays over 30% of it on rent.",
  },
  abBlueCrossNonGroupRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome() && !isSeniorAge(),
    fixed: false,
    unmet: "Anyone under 65 can join, but only lower-income households get the premium subsidy.",
  },
  abBrainInjuryRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You are an adult with an acquired brain injury.",
  },
  abChildFamilyBenefitRoute: {
    short: "Check the income test and that you are raising a child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "You are a parent of children under 18 with a lower or middle family income.",
  },
  abHomeCareRoute: {
    short: "Ask for a care needs assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "A professional assessment of unmet care needs decides access.",
  },
  abIncomeSupportRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You cannot pay for basic needs and your income and assets are under the limits.",
  },
  abRentAssistanceBenefitRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income must be below the local income limit.",
  },
  abSeniorsBenefitRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 65 or older, get Old Age Security and have a low enough income.",
  },
  abSeniorsDentalOpticalRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 65 or older, approved for Seniors Financial Assistance and within the income limits.",
  },
  abSeniorsSpecialNeedsAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 65 or older with income of $32,690 or less (single) or $53,800 or less (couple).",
  },
  abSharpRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 65 or older, own your home and have income of $75,000 or less.",
  },
  bcSubsidizedHousingRoute: {
    short: "Check the income limits and your disability pension or DTC",
    who: ["you", "professional"],
    met: () => lowIncome() && (answers.dtc === "yes" || answers.bcAssistance === "pwd"),
    fixed: false,
    unmet: "You get a disability pension or are disabled for income tax purposes, with income under the limits.",
  },
  onChildrensRehabRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Child or youth up to 19 (21 if in school) with a physical or developmental disability or communication difficulty.",
  },
  skSaidRoute: {
    short: "Check the disability and financial need rules",
    who: ["you", "professional"],
    met: () => lowIncome() && answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You need a significant and enduring disability and too little money for basic needs.",
  },
  skIncomeSupportRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 18 or older, live in Saskatchewan and have no or low income.",
  },
  skEmploymentIncentiveRoute: {
    short: "Check the income test, your work earnings and that you are raising a child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "You are a working parent with at least $500 a month earned and family income under the limit.",
  },
  skHousingBenefitRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You rent, spend 35 per cent or more of income on shelter, and are under the income limit.",
  },
  skSailRoute: {
    short: "Ask a health professional for a referral",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You need a referral from a health care professional for a physical disability or chronic condition.",
  },
  skSupplementaryHealthRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be enrolled in SAID, Saskatchewan Income Support or the Employment Incentive, or in a listed group.",
  },
  skFamilyHealthBenefitsRoute: {
    short: "Check the income test and that you are raising a child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "You are a low-income working family who meets the income test.",
  },
  skSpecialSupportRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Coverage depends on your family income and drug costs.",
  },
  skSeniorsDrugPlanRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 65 or older and your net income is under the age credit limit.",
  },
  skSeniorsIncomePlanRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 65 or older, get OAS and GIS, and have income below the set level.",
  },
  skAutismIndividualizedFundingRoute: {
    short: "Check the diagnosis and that the child is under twelve",
    who: ["you", "professional"],
    met: () => answers.autismDiagnosis === "yes" && ageIn("under6", "6to11"),
    fixed: false,
    unmet: "Your child has an Autism Spectrum Disorder diagnosis and is under age 12.",
  },
  skCognitiveDisabilityStrategyRoute: {
    short: "Ask the ministry whether your need qualifies",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You have a cognitive disability and an unmet need that no other system can support.",
  },
  skFamilyRespiteIntellectualDisabilityRoute: {
    short: "Check the income or disability route",
    who: ["you", "program"],
    met: () => lowIncome() || answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Your child has an intellectual disability and your family meets the income test.",
  },
  skHomeCareRoute: {
    short: "Ask for a care needs assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "The health authority assesses your need for home care and decides your services.",
  },
  skAdaptationsForIndependenceRoute: {
    short: "Check the disability, income and asset limits",
    who: ["you", "program"],
    met: () => lowIncome() && answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "A household member has a housing-related disability, and your income and assets are within limits.",
  },
  skEapdRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You are at least 16 and declare a disability that needs specialized supports for work.",
  },
  skPersonalCareHomeBenefitRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 65 or older, in a licensed personal care home, and your income is below set levels.",
  },
  skActiveFamiliesBenefitRoute: {
    short: "Check the family income limit and the child's age",
    who: ["you", "program"],
    met: () => answers.income !== "high" && (isUnder18() || ageIn("18")),
    fixed: false,
    unmet: "Family adjusted income of $120,000 or less, with a child 18 or younger in an eligible activity.",
  },
  skLowIncomeTaxCreditRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You file a return as a resident and meet the income and family criteria.",
  },
  skCochlearProcessorRoute: {
    short: "Ask your audiologist whether your processor qualifies",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "People with a cochlear implant who need a replacement external processor and meet the clinical indicators.",
  },
  reginaAffordableAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Household income must be under the limit for your household size.",
  },
  saskatoonLeisureAccessProgramRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Household income before tax must be at or below the limit for your household size.",
  },
  saskatoonLowIncomeBusPassRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Last year's Notice of Assessment must show income under the limit.",
  },
  reginaDiscounted31DayPassRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be in SAID, SIS, SES or SEI.",
  },
  mooseJawDiscountedMonthlyPassRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be in SIS, SEI, SAID or SES and show proof.",
  },
  saskatoonAccessibleParkingPermitSubsidyRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You need a SaskAbilities placard and household income below the LICO.",
  },
  yorktonDiscountedMonthlyPassRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be in a provincially sponsored social assistance program.",
  },
  mbSupportsPersonsDisabilitiesRoute: {
    short: "Check the disability and financial rules",
    who: ["you", "professional"],
    met: () => lowIncome() && answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Severe and prolonged disability that affects daily living, plus financial eligibility for income assistance.",
  },
  mbEiaRoute: {
    short: "Check the income or disability route",
    who: ["you", "program"],
    met: () => lowIncome() || answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You live in Manitoba and are in financial need; a disability route applies to adults 18 or older.",
  },
  mbRentAssistRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Net annual income under the limit for your household size, and you rent in the private market.",
  },
  mbPharmacareRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Coverage depends on your family income and what you pay for eligible prescriptions.",
  },
  mbDisabilityHealthSupportsRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You take part in EIA, Children's disABILITY Services or Community Living disABILITY Services.",
  },
  mbChildrensDisabilityServicesRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Child under 18 with a medical diagnosis of a listed condition.",
  },
  mbCommunityLivingDisabilityServicesRoute: {
    short: "Ask the program about an eligibility assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Adult with an intellectual disability that existed before age 18, who needs help with personal care or property.",
  },
  mbHomeCareRoute: {
    short: "Ask for a care needs assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Home care is based on an assessment of your needs by your regional health authority.",
  },
  mbPrimaryCaregiverTaxCreditRoute: {
    short: "Check the care-level assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "The person you care for is assessed at care level 2 or higher and lives at home.",
  },
  mbChildBenefitRoute: {
    short: "Check the income test and that you are raising a child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "Your family income is below a set level, based on last year's income.",
  },
  mb55PlusRoute: {
    short: "Check your age and the income ranges",
    who: ["you", "program"],
    met: () => lowIncome() && ageIn("60to64", "65plus"),
    fixed: false,
    unmet: "You are 55 or older with income within the allowable ranges.",
  },
  mbResidentialAdaptationsRoute: {
    short: "Check the disability and income limits",
    who: ["you", "professional"],
    met: () => lowIncome() && answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "A household member has a disability, and household income is within your community's limit.",
  },
  winnipegRecreationFeeAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your economic family income must be below the low income cut-off for your family size.",
  },
  winnipegWinnpassRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome() && !isSeniorAge(),
    fixed: false,
    unmet: "Winnipeg residents 64 and under qualify through assistance, new arrival status, or low household income.",
  },
  mbEapdRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You need a disability and must be 16 or older and legally entitled to work in Manitoba.",
  },
  mbRentSupplementRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income must be under the CMHC Program Income Limits.",
  },
  mbPrenatalBenefitRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You must be pregnant, live in Manitoba and have net family income under $32,000 a year.",
  },
  brandonCnibFreeTransitRoute: {
    short: "Check that you hold a CNIB card",
    who: ["you"],
    met: () => hasDisability("vision"),
    fixed: false,
    unmet: "You are a CNIB registered client.",
  },
  nbSocialAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Low household income, judged against your family type.",
  },
  nbDisabilitySupportProgramRoute: {
    short: "Check the age range and the long-term disability rule",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes" && ageIn("19to59", "60to64"),
    fixed: false,
    unmet: "You must be 19 to 64 with a long-term disability and need support.",
  },
  nbSelfManagedSupportRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "Only people already in one of those two programs qualify.",
  },
  nbEmploymentSupportServicesRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be receiving Disability Support Program services.",
  },
  nbTessRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You must have a permanent disability; income support is not required.",
  },
  nbFamilySupportsChildrenRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Your child must have a disability with unmet needs.",
  },
  nbVehicleRetrofitRoute: {
    short: "Check the physical disability rule",
    who: ["you", "professional"],
    met: () => hasDisability("physical"),
    fixed: false,
    unmet: "Individuals need a physical disability; some organizations may also apply.",
  },
  nbPrescriptionDrugProgramRoute: {
    short: "Check the income or disability route",
    who: ["you", "program"],
    met: () => lowIncome() || answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You qualify through a listed group, such as a Social Development card or a listed condition.",
  },
  nbHealthySmilesClearVisionRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your family net income must be at or under the limit for your family size.",
  },
  nbPreschoolAutismRoute: {
    short: "Check the autism diagnosis",
    who: ["you", "professional"],
    met: () => answers.autismDiagnosis === "yes",
    fixed: false,
    unmet: "Your child needs an autism spectrum disorder diagnosis made between ages 0 and 5.",
  },
  nbLongTermCareHomeSupportRoute: {
    short: "Ask for a long-term care assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You need long-term help with daily activities, as found in an assessment.",
  },
  nbExtraMuralRoute: {
    short: "Ask your health provider about a referral",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You need health care that can be given safely at home.",
  },
  nbLowIncomeSeniorsBenefitRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must get the Guaranteed Income Supplement, Allowance or Allowance for the Survivor.",
  },
  nbChildTaxBenefitRoute: {
    short: "Check the income test and that you are raising a child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "Payments fall as family net income rises above $20,000.",
  },
  nbHealthServicesEquipmentRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You are a Social Development client or dependent with the Health Card the program requires.",
  },
  nbPortableRentSupplementRoute: {
    short: "Check the disability and income ceiling",
    who: ["you", "professional"],
    met: () => lowIncome() && answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You need a verified disability and household income under the ceiling for your area.",
  },
  nbRentSupplementRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income must be under the ceiling for your area and bedrooms needed.",
  },
  nbRrapRoute: {
    short: "Check the activity restriction and income limit",
    who: ["you", "professional"],
    met: () => lowIncome() && answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "The suite is for a person with an activity restriction, and your income is under the limit.",
  },
  nbAmbulanceFeeExemptionRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You get Social Assistance or the Guaranteed Income Supplement, or fit another listed group.",
  },
  monctonCnibFreeTransitRoute: {
    short: "Check that you hold a CNIB card",
    who: ["you"],
    met: () => hasDisability("vision"),
    fixed: false,
    unmet: "You hold a valid CNIB card.",
  },
  saintJohnProKidsRoute: {
    short: "Check the income test and that the program is for your child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "Your family has a low income.",
  },
  nbDrugPlanRoute: {
    short: "Check whether you have other drug coverage",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Open to residents without drug coverage; premiums rise with household income.",
  },
  nbHearingAidProgramRoute: {
    short: "Check your health card coverage",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You must be a Social Development client or dependent with a qualifying health card.",
  },
  nbPublicHousingRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Household income must be under the ceiling for your area and home size.",
  },
  nbSeniorsHomeRenovationCreditRoute: {
    short: "Check the senior and household rules",
    who: ["you", "program"],
    met: () => isSeniorAge(),
    fixed: false,
    unmet: "No income test: seniors and family living with them can claim at any income.",
  },
  nbChildcareAssistanceRoute: {
    short: "Check the income limit and your child's age",
    who: ["you", "program"],
    met: () => lowIncome() && ageIn("under6", "6to11"),
    fixed: false,
    unmet: "Gross household income must be up to $80,000, and parents must work, study or have a referral.",
  },
  nbHomeownerRepairRoute: {
    short: "Check the income limit and that you own your home",
    who: ["you", "program"],
    met: () => lowIncome() && hasCircumstance("homeowner"),
    fixed: false,
    unmet: "Low-income homeowners, or owners needing disability or seniors' changes, may qualify.",
  },
  nsIncomeAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You cannot financially support yourself or your family.",
  },
  nsDisabilitySupportProgramRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You meet Disability Support Program policy, including a functional and financial assessment.",
  },
  nsDirectFamilySupportChildrenRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Your child under 19 has a documented disability and your family net income meets guidelines.",
  },
  nsCaregiverBenefitRoute: {
    short: "Ask Continuing Care about an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "The person you care for has low income and a high level of disability, assessed by a care coordinator.",
  },
  nsOsdPharmacareRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You are on Income Assistance or in the Disability Support Program, or are a child in care.",
  },
  nsFamilyPharmacareRoute: {
    short: "Check whether you have other drug coverage",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Residents with a Health Card can register; costs scale with family size and income.",
  },
  nsHarpRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Low income, Income Assistance, or the Guaranteed Income Supplement or Allowance.",
  },
  nsSeniorsCareGrantRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Age 65 or older by 31 March 2027, with household net income of $45,100 or less.",
  },
  nsSeniorsPropertyTaxRebateRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You get, or are eligible for, the Guaranteed Income Supplement or the Allowance.",
  },
  nsHousingRepairAccessibilityRoute: {
    short: "Check the income limit and that you own your home",
    who: ["you", "program"],
    met: () => lowIncome() && hasCircumstance("homeowner"),
    fixed: false,
    unmet: "Homeowner with household income under the Program Guide limits; accessible stream needs a disability.",
  },
  nsRentSupplementRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Renters with gross household income below the benefit limits who spend over 40% on average rent.",
  },
  nsPovertyReductionCreditRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You got Income Assistance all last year, filed taxes, had income under $16,000 and no children.",
  },
  nsChildrensOralHealthRoute: {
    short: "Check your child's age",
    who: ["you", "program"],
    met: () => ageIn("under6", "6to11", "12to15"),
    fixed: false,
    unmet: "Your child is 14 or younger with a valid Nova Scotia health card; no income test is stated.",
  },
  nsCommunityBusPassRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You get Income Assistance or are in the Disability Support Program, in Halifax or Cape Breton.",
  },
  nsSeniorsWheelchairLoanRoute: {
    short: "Ask for a therapist assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You are 65 or older, need help due to disability or illness, and have category A income.",
  },
  nsDayProgramsRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "The program supports adults and youth with disabilities.",
  },
  nsPublicHousingRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income must be below the limit for your area and bedrooms.",
  },
  nsAmbulanceFeeWaiverRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You cannot pay the bill because your income is low, judged by the Low Income Measure.",
  },
  nsStudentLoanForgivenessDisabilitiesRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You count as a student with a disability under the student assistance rules.",
  },
  bridgewaterProKidsRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Family income must be under the limit for your size; an endorsement can verify it.",
  },
  nsChildBenefitRoute: {
    short: "Check the income test and that you are raising a child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "Your adjusted family net income is below $34,000 and you have a child under 18.",
  },
  nsAffordableLivingTaxCreditRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are a low- or modest-income individual or family.",
  },
  nsHomeCareRoute: {
    short: "Ask Continuing Care for an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You need care at home, and a Care Coordinator assesses your needs.",
  },
  nsHomeSupportDirectFundingRoute: {
    short: "Ask Continuing Care for an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You have unmet care needs and an assessment confirms you are eligible.",
  },
  nsSelfManagedCareRoute: {
    short: "Ask Continuing Care for an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You are 19 or older with a physical disability and need help with daily living.",
  },
  nsHomeLiftRoute: {
    short: "Ask Continuing Care for an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You get funded home care and a therapist says you need a lift.",
  },
  nsSpecializedBedLoanRoute: {
    short: "Ask Continuing Care for an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "A Care Coordinator assesses you and decides if you need a specialized bed.",
  },
  nsRespiteCareRoute: {
    short: "Ask Continuing Care for an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "The person needs personal care and a Care Coordinator confirms eligibility.",
  },
  nsChildCareSubsidyRoute: {
    short: "Check the income limit and your child's age",
    who: ["you", "program"],
    met: () => lowIncome() && ageIn("under6", "6to11"),
    fixed: false,
    unmet: "Your assessed family income is under $70,000 and your child is 12 or younger.",
  },
  peCaregiverBenefitRoute: {
    short: "Ask Home Care for an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Home Care must assess high ongoing care needs and a high likelihood of long-term care.",
  },
  peRenovationPersonsDisabilitiesRoute: {
    short: "Check the income limit, disability and home ownership",
    who: ["you", "professional"],
    met: () => lowIncome() && answers.disabilityVerified === "yes" && hasCircumstance("homeowner"),
    fixed: false,
    unmet: "You need a permanent disability and a household income of $50,000 or less.",
  },
  peHomeRenovationSeniorsRoute: {
    short: "Check the income limit and home ownership",
    who: ["you", "program"],
    met: () => lowIncome() && hasCircumstance("homeowner"),
    fixed: false,
    unmet: "You must be 60 or older with a household income of $50,000 or less.",
  },
  peSeniorsSafeAtHomeRoute: {
    short: "Check the income limit and home ownership",
    who: ["you", "program"],
    met: () => lowIncome() && hasCircumstance("homeowner"),
    fixed: false,
    unmet: "You must be 60 or older with a combined income of $50,000 or less.",
  },
  peDentalCareRoute: {
    short: "Check the income or disability route",
    who: ["you", "program"],
    met: () => lowIncome() || answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You get provincial assistance, or your family income is within the program's table.",
  },
  peHomeEnergyLowIncomeRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income must be $35,000 or less; the form also lists two low-income benefits.",
  },
  peAccessabilitySupportsRoute: {
    short: "Check the diagnosis and that you apply before age sixty-five",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes" && !isSeniorAge(),
    fixed: false,
    unmet: "You need a diagnosed disability with a significant impairment lasting 12 months or more.",
  },
  peSocialAssistanceRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 18 or older and your income cannot cover the basic costs of living.",
  },
  peSeniorsHearingAidRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 65 or older; lower income gets the full cost covered, higher income a part.",
  },
  peFamilyHealthBenefitRoute: {
    short: "Check the income limit and that you are raising a child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "You are a low-income family supporting at least one child under the age limits.",
  },
  peGenericDrugRoute: {
    short: "Check that you have no drug insurance and are under sixty-five",
    who: ["you", "program"],
    met: () => !isSeniorAge(),
    fixed: false,
    unmet: "You are under 65 with no private drug insurance and a PEI Health Card.",
  },
  peFinancialAssistanceDrugRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be approved for financial assistance under the Social Assistance Act.",
  },
  peSeniorsIndependenceInitiativeRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 65 or older with net household income under the single or couple limit.",
  },
  peFamilyHousingRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Low household income, poor housing or other special circumstances; income is compared with a limit for unit size.",
  },
  peSeniorsHousingRoute: {
    short: "Check your age and the income limits",
    who: ["you", "program"],
    met: () => lowIncome() && ageIn("60to64", "65plus"),
    fixed: false,
    unmet: "You are 60 or older (55 with a disability); income is compared with a limit for unit size.",
  },
  peChildCareSubsidyRoute: {
    short: "Check the income test and your child's age",
    who: ["you", "program"],
    met: () => lowIncome() && ageIn("under6", "6to11"),
    fixed: false,
    unmet: "You have a child aged 12 or under and your income and needs support a subsidy.",
  },
  peAutismFundingRoute: {
    short: "Check the autism diagnosis",
    who: ["you", "professional"],
    met: () => answers.autismDiagnosis === "yes",
    fixed: false,
    unmet: "Your child needs a diagnosed autism spectrum disorder and the right program enrolment.",
  },
  peSeverePermanentDisabilityBenefitRoute: {
    short: "Check your federal Severe Permanent Disability Benefit approval",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You must already be approved for the federal Severe Permanent Disability Benefit.",
  },
  peHomeCareRoute: {
    short: "Ask Home Care for an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You need home health care or support, based on an assessment of your needs.",
  },
  peSeniorsPropertyTaxDeferralRoute: {
    short: "Check the income limit and home ownership",
    who: ["you", "program"],
    met: () => lowIncome() && hasCircumstance("homeowner"),
    fixed: false,
    unmet: "You are sixty-five or older and your household income is under $42,000 a year.",
  },
  peChildrenComplexNeedsRoute: {
    short: "Check the program's health criteria",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Your child is under eighteen with a lasting health condition and at least two listed needs.",
  },
  peCoachRoute: {
    short: "Ask your care provider about a referral",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You are sixty-five or older, frail, mainly homebound and referred by a primary care provider.",
  },
  peAdultDayProgramsRoute: {
    short: "Ask Home Care for an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "This program is for seniors; a coordinator assesses your eligibility.",
  },
  nlIncomeSupportRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are eighteen or older, live in the province and pass a financial assessment.",
  },
  nlDisabilityBenefitRoute: {
    short: "Check your Disability Tax Credit and the income limits",
    who: ["you", "professional"],
    met: () => lowIncome() && answers.dtc === "yes",
    fixed: false,
    unmet: "You are eighteen to sixty-four, have the Disability Tax Credit and meet the income limits.",
  },
  nlHealthRelatedServicesRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "These services are for people who receive Income Support.",
  },
  nlChildBenefitRoute: {
    short: "Check the income test and that you are raising a child",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "Your family has children under eighteen and income below the program limit.",
  },
  nlPrenatalNutritionRoute: {
    short: "Check the income test and your child's age",
    who: ["you", "program"],
    met: () => lowIncome() && ageIn("under6"),
    fixed: false,
    unmet: "You are pregnant or have a child under five, with a low income or on Income Support.",
  },
  nlFoundationPlanRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You receive Income Support or certain health authority services.",
  },
  nl65plusPlanRoute: {
    short: "Check that you get the federal senior benefits",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You are sixty-five or older and get both federal senior benefits, OAS and GIS.",
  },
  nlAccessPlanRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your net yearly income is at or under the limit for your family type.",
  },
  nlAssurancePlanRoute: {
    short: "Check your drug costs against your income",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Your eligible drug costs are above a set share of your net income.",
  },
  nlSpecialAssistanceRoute: {
    short: "Ask for a financial assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You live in the community, need supplies for daily living and meet the financial criteria.",
  },
  nlHomeSupportRoute: {
    short: "Ask for a home support assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You need home support and pass a functional and financial assessment.",
  },
  nlSpecialChildWelfareAllowanceRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Your child under eighteen has a physical or intellectual disability and lives at home.",
  },
  nlDirectHomeServicesRoute: {
    short: "Ask for a developmental assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Your infant or preschool child shows or is at risk for significant developmental delay.",
  },
  nlCommunityBehaviouralServicesRoute: {
    short: "Ask about a referral",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You are school-aged or older with a developmental disability and significant behaviour concerns.",
  },
  nlPaidFamilyCaregivingRoute: {
    short: "Ask for a home support assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You are an adult home support client who needs personal or behaviour care a family member can give.",
  },
  nlHomeModificationRoute: {
    short: "Check the income limit, disability and home ownership",
    who: ["you", "program"],
    met: () => lowIncome() && answers.disabilityVerified === "yes" && hasCircumstance("homeowner"),
    fixed: false,
    unmet: "You are a homeowner needing accessibility changes, under the yearly income limit.",
  },
  nlHomeRepairRoute: {
    short: "Check the income limit and home ownership",
    who: ["you", "program"],
    met: () => lowIncome() && hasCircumstance("homeowner"),
    fixed: false,
    unmet: "You are a homeowner with combined yearly income under the limit for your area.",
  },
  nlRentalHousingRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your household income is low and you cannot find suitable, affordable rental housing.",
  },
  nlHousingBenefitRoute: {
    short: "Check the housing need test",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Your household net income may be at or under the limit and you are in severe core housing need.",
  },
  nlSeniorsBenefitRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You are 64 or older by year end and your family net income is under the limit.",
  },
  nlIncomeSupplementRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your family net income is low; the credit phases out as income rises.",
  },
  nlChildCareSubsidyRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Your yearly family net income is at or under the limit for your number of children.",
  },
  nlStudentDisabilitiesRoute: {
    short: "Check the disability verification form",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You need a verified disability that limits your studies or work.",
  },
  stJohnsChildrenRecreationSubsidyRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome() && isUnder18(),
    fixed: false,
    unmet: "Need is judged by Statistics Canada's Low Income Cut Off, using family income and size.",
  },
  stJohnsAdultRecreationSubsidyRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Need is judged by Statistics Canada's Low Income Cut Off, using family income and size.",
  },
  stJohnsAttendantPassRoute: {
    short: "Check the disability documents the program asks for",
    who: ["you", "professional"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "You live with a disability that needs a support person, verified by a professional.",
  },
  cornerBrookFreeTransitPassRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You receive income support or youth services, or you are a senior receiving GIS.",
  },
  nlMovingIntoWorkforceRoute: {
    short: "Check that you get the assistance program it names",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must already receive Income Support.",
  },
  nlDentalProgramsRoute: {
    short: "Check which dental program covers your age",
    who: ["you", "program"],
    met: () => ageIn("under6", "6to11"),
    fixed: false,
    unmet: "Children up to twelve are covered; older youth and adults need Income Support or a plan enrolment.",
  },
  nlCaregiverBenefitRoute: {
    short: "Ask NL Health Services about an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "The senior you care for must be under the household income limit and have high care needs.",
  },
  qcSolidariteSocialeRoute: {
    short: "Vérifiez vos contraintes sévères de santé et vos revenus",
    who: ["you", "professional"],
    lang: "fr",
    met: () => lowIncome() && answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Vous ou un adulte de votre famille avez des contraintes sévères de santé et un faible revenu.",
  },
  qcAideSocialeRoute: {
    short: "Vérifiez le critère de revenu du programme",
    who: ["you", "program"],
    lang: "fr",
    met: () => lowIncome(),
    fixed: false,
    unmet: "Vos ressources sont sous les maximums prévus et vous n'avez pas de contraintes sévères de santé.",
  },
  qcRevenuBaseRoute: {
    short: "Vérifiez votre historique à la solidarité sociale",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez des contraintes sévères de santé depuis longtemps, selon l'un des cas prévus.",
  },
  qcObjectifEmploiRoute: {
    short: "Vérifiez si c'est votre première demande d'aide sociale",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous demandez l'aide sociale pour la première fois et y êtes admissible.",
  },
  qcReussirRoute: {
    short: "Vérifiez que vous recevez le programme d’aide nommé",
    who: ["you"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous êtes admissible à la solidarité sociale ou au revenu de base et avez des contraintes sévères.",
  },
  qcAllocationFamilleRoute: {
    short: "Vérifiez que vous avez un enfant à charge",
    who: ["you", "program"],
    lang: "fr",
    met: () => isUnder18(),
    fixed: false,
    unmet: "Vous avez un enfant de moins de 18 ans à charge et le montant dépend du revenu familial.",
  },
  qcSupplementEnfantHandicapeRoute: {
    short: "Vérifiez les documents sur l’incapacité demandés",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Votre enfant de moins de 18 ans a une incapacité importante qui durera au moins un an.",
  },
  qcSehnseRoute: {
    short: "Demandez l'évaluation des besoins de votre enfant",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Votre enfant de moins de 18 ans a des incapacités très importantes ou des soins complexes.",
  },
  qcRenteInvaliditeRoute: {
    short: "Vérifiez vos cotisations et faites évaluer votre invalidité",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Retraite Québec doit vous reconnaître invalide avant 65 ans et vous devez avoir assez cotisé.",
  },
  qcSoutienFamillesRoute: {
    short: "Demandez une évaluation au CLSC",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous vivez avec un proche ayant une déficience ou un TSA et vous en prenez soin chaque jour.",
  },
  qcAidesAuditivesRoute: {
    short: "Faites évaluer votre audition",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Votre perte auditive doit atteindre le seuil prévu pour votre âge, selon un audiogramme.",
  },
  qcAidesVisuellesRoute: {
    short: "Faites évaluer votre vision dans un centre de réadaptation",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Une évaluation doit montrer une déficience visuelle permanente qui limite vos activités.",
  },
  qcAppareilsDeficiencePhysiqueRoute: {
    short: "Vérifiez les conditions liées à votre appareil",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Vous devez avoir une déficience physique et remplir les conditions de l'appareil demandé.",
  },
  qcAidesEliminationRoute: {
    short: "Demandez une note médicale",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez un problème d'élimination lié à une déficience ou à un TSA, établi par une note médicale.",
  },
  qcChienAssistanceRoute: {
    short: "Vérifiez les conditions sur le chien et l'école",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez une déficience motrice permanente et un chien d'assistance à la motricité d'une école accréditée.",
  },
  qcAidesVieQuotidienneRoute: {
    short: "Demandez une évaluation à l'établissement qui vous suit",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez une déficience significative et persistante ou un TSA et vous recevez l'aide d'un établissement.",
  },
  qcTriporteursRoute: {
    short: "Demandez une évaluation à un ergothérapeute",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez une incapacité significative et persistante à la marche, motrice ou cardio-respiratoire sévère.",
  },
  qcAmbulateursRoute: {
    short: "Demandez une évaluation à un professionnel",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous êtes majeur et avez une déficience physique qui limite votre locomotion.",
  },
  qcTricyclesRoute: {
    short: "Demandez une évaluation pour votre enfant",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "L'enfant est mineur, a une déficience physique ou intellectuelle et ne peut pas utiliser un vélo standard.",
  },
  qcChaussuresOrthetiquesRoute: {
    short: "Demandez une évaluation à un professionnel",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez une incapacité permanente à la marche, sévère à très sévère, liée au pied ou à la cheville.",
  },
  qcAidesCommunicationRoute: {
    short: "Demandez une évaluation de vos besoins de communication",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez une déficience ou un TSA qui entraîne des incapacités à communiquer.",
  },
  qcTransportHebergementRoute: {
    short: "Vérifiez la distance jusqu'à vos services",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez une déficience physique ou intellectuelle et des déplacements de plus de 50 km.",
  },
  qcServicesDeficienceRoute: {
    short: "Vérifiez les documents sur l’incapacité demandés",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Vous avez une déficience physique, intellectuelle ou un TSA, ou vous êtes un proche de cette personne.",
  },
  qcSoutienDomicileRoute: {
    short: "Demandez une évaluation au CLSC",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous vivez à domicile, avez besoin d'aide et êtes jugé admissible par le CLSC.",
  },
  qcAdaptationDomicileRoute: {
    short: "Vérifiez les documents sur l’incapacité demandés",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Vous avez une incapacité significative et persistante et vous êtes citoyen ou résident permanent.",
  },
  qcSupplementLoyerRoute: {
    short: "Vérifiez le critère de revenu du programme",
    who: ["you", "program"],
    lang: "fr",
    met: () => lowIncome(),
    fixed: false,
    unmet: "Votre ménage a un faible revenu et respecte les règles d'un des deux volets.",
  },
  qcAdaptationVehiculeRoute: {
    short: "Vérifiez les documents sur l’incapacité demandés",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Un handicap physique vous empêche de conduire ou d'utiliser un véhicule de façon sécuritaire.",
  },
  qcCarteAccompagnementLoisirRoute: {
    short: "Vérifiez les documents sur l’incapacité demandés",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Vous êtes une personne handicapée résidant au Québec et vous avez cinq ans ou plus.",
  },
  qcAllocationLogementRoute: {
    short: "Vérifiez le critère de revenu du programme",
    who: ["you", "program"],
    lang: "fr",
    met: () => lowIncome(),
    fixed: false,
    unmet: "Le programme s'adresse aux familles et aux personnes de 50 ans ou plus; Revenu Québec confirme l'admissibilité.",
  },
  qcHlmRoute: {
    short: "Vérifiez le critère de revenu du programme",
    who: ["you", "program"],
    lang: "fr",
    met: () => lowIncome(),
    fixed: false,
    unmet: "Vous avez un faible revenu et vous répondez aux critères d'admissibilité du locateur.",
  },
  qcAssuranceMedicamentsRoute: {
    short: "Vérifiez si vous avez accès à un régime collectif",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous êtes au régime public si vous n'avez pas accès à un régime privé.",
  },
  qcPrestationsSpecialesRoute: {
    short: "Vérifiez que vous recevez le programme d’aide nommé",
    who: ["you"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous recevez une prestation d'un programme d'assistance sociale, comme la solidarité sociale.",
  },
  qcBesoinsParticuliersAdultesRoute: {
    short: "Vérifiez vos études et la confirmation médicale",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez une déficience avec incapacité significative et persistante, confirmée par un médecin.",
  },
  qcBesoinsParticuliersJeunesRoute: {
    short: "Vérifiez l'école de l'enfant et la confirmation médicale",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Votre enfant a une déficience avec incapacité significative et persistante, confirmée par un médecin.",
  },
  qcPretsBoursesDfmRoute: {
    short: "Vérifiez vos études et la confirmation de votre déficience",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez une déficience entraînant une incapacité significative et persistante, confirmée par votre médecin.",
  },
  quebecEquimobiliteRoute: {
    short: "Vérifiez le critère de revenu ou d’incapacité",
    who: ["you", "program"],
    lang: "fr",
    met: () => lowIncome() || answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Votre revenu est sous le seuil de faible revenu, ou vous utilisez le STAC.",
  },
  gatineauEchoRoute: {
    short: "Vérifiez le critère de revenu du programme",
    who: ["you", "program"],
    lang: "fr",
    met: () => lowIncome(),
    fixed: false,
    unmet: "Vous êtes sous le seuil de faible revenu, prestataire d'aide sociale ou nouvel arrivant.",
  },
  troisRivieresTarificationSocialeRoute: {
    short: "Vérifiez le critère de revenu du programme",
    who: ["you", "program"],
    lang: "fr",
    met: () => lowIncome(),
    fixed: false,
    unmet: "Un organisme communautaire accrédité juge que vous êtes en situation de vulnérabilité.",
  },
  qcCarteAccompagnementAutocarRoute: {
    short: "Vérifiez les documents sur l’incapacité demandés",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Vous avez 8 ans ou plus et un handicap permanent qui exige un accompagnateur en autocar.",
  },
  qcAgirTotRoute: {
    short: "Vérifiez l'âge de votre enfant",
    who: ["you", "professional"],
    lang: "fr",
    met: () => ageIn("under6"),
    fixed: false,
    unmet: "Votre enfant a moins de 7 ans et son développement vous inquiète.",
  },
  qcArtistesHandicapRoute: {
    short: "Vérifiez votre admissibilité aux bourses du CALQ",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous êtes artiste ou écrivain en situation de handicap, avec un projet financé par le CALQ.",
  },
  qcCreditSolidariteRoute: {
    short: "Vérifiez le critère de revenu du programme",
    who: ["you", "program"],
    lang: "fr",
    met: () => lowIncome(),
    fixed: false,
    unmet: "Votre revenu familial doit être inférieur au maximum prévu pour votre situation.",
  },
  qcCreditPersonneAidanteRoute: {
    short: "Vérifiez les conditions sur la personne aidée",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous aidez un proche de 70 ans ou plus, ou ayant une déficience grave et prolongée.",
  },
  qcDeficienceGraveProlongeeRoute: {
    short: "Faites remplir l'attestation de déficience",
    who: ["you", "professional"],
    lang: "fr",
    met: () => answers.dtc === "yes",
    fixed: false,
    unmet: "Vous avez une déficience grave et prolongée attestée par un professionnel de la santé.",
  },
  qcPrimeTravailAdapteeRoute: {
    short: "Vérifiez vos revenus de travail",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous travaillez, votre revenu familial est sous le maximum, et vous avez des contraintes sévères à l'emploi.",
  },
  qcCreditMaintienDomicileRoute: {
    short: "Vérifiez que vous avez soixante-dix ans ou plus",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez 70 ans ou plus; le montant dépend de votre revenu familial.",
  },
  qcProthesesOculairesRoute: {
    short: "Demandez une ordonnance à votre ophtalmologiste",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Vous avez besoin d'une prothèse oculaire à la suite d'une perte ou d'une atteinte de l'œil.",
  },
  qcLunettesEnfantsRoute: {
    short: "Faites faire un examen de la vue",
    who: ["you", "program"],
    lang: "fr",
    met: () => false,
    fixed: false,
    unmet: "Aucune condition de revenu : l'enfant doit avoir moins de 18 ans et une ordonnance.",
  },
  qcServicesDentairesRoute: {
    short: "Vérifiez l'âge ou votre carnet de réclamation",
    who: ["you", "program"],
    lang: "fr",
    met: () => ageIn("under6"),
    fixed: false,
    unmet: "Vous avez moins de 10 ans ou un carnet de réclamation d'un programme d'aide financière.",
  },
  qcServicesOptometriquesRoute: {
    short: "Vérifiez votre âge ou votre carnet de réclamation",
    who: ["you", "program"],
    lang: "fr",
    met: () => ageIn("under6", "6to11", "12to15", "16to17", "65plus"),
    fixed: false,
    unmet: "Aucun test de revenu : l'âge ou un carnet de réclamation depuis 12 mois détermine l'accès.",
  },
  halifaxAffordableTransitPassRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Household income of $59,000 or less, and not on Community Services assistance.",
  },
  halifaxRecreationAccessRoute: {
    short: "Check the program's income test",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "You can show financial need under Statistics Canada's Low Income Cut-Offs.",
  },
  mordenHandiVanRoute: {
    short: "Check that you are a senior or have limited mobility",
    who: ["you", "professional"],
    met: () => hasFunctionalNeed("transitBarrier") || isSeniorAge(),
    fixed: false,
    unmet: "For seniors and persons with mobility limitations; the page gives no other rules.",
  },
  kingstonMfapIncome: {
    short: "Check your income against the MFAP limit",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "Household income must be at or under the MFAP limit (after-tax Low-Income Measure plus 15 percent).",
  },
  lowIncomeOrDisabilityIncome: {
    // Household-size thresholds and actual receipt of AISH/CPP-D are not asked.
    // DTC approval or inability to work cannot stand in for either route.
    met: () => false,
    fixed: false,
    unmet: "Confirm the municipality's household-income limit or an accepted benefit-recipient route.",
  },
  municipalProgramEligibility: {
    met: () => false,
    fixed: false,
    unmet: "Confirm the program's household-income or qualifying benefit-recipient route.",
  },

  student: { met: () => isStudent(), fixed: true, unmet: "This is for post-secondary students." },
  notPostSecondaryStudent: {
    short: "Check Kelowna's student rule and ask about student pass rates",
    who: ["you"],
    met: () => !isStudent(),
    fixed: true,
    unmet: "Kelowna does not accept post-secondary students for this program. Students can instead ask for the discounted student rate on passes, by showing a valid student ID plus proof of full-time enrolment with your name on it.",
  },
  childcare: { met: () => has(answers.situation, "childcare"), fixed: true, unmet: "This support is for a child attending or seeking child care." },
  working: { met: () => isWorking(), fixed: true, unmet: "This is for people with employment income." },
  lookingOrTraining: {
    met: () => isWorking() || isLooking() || isStudent(),
    fixed: false,
    unmet: "You should be working, looking for work, or in training.",
  },
  unableToWork: { met: () => isUnableToWork(), fixed: true, unmet: "This is for people a disability regularly stops from working." },
  employmentActive: { met: isEmploymentActive, fixed: true, unmet: "This is for someone working or looking for work." },
  cppContrib: {
    // Current work status does not establish the official contribution history.
    met: () => false,
    fixed: false,
    unmet: "Check your CPP Statement of Contributions for the required contribution history.",
  },
  cppDisabilityContributorLink: {
    short: "Check the parent gets a CPP disability benefit, and the child's age and school",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "This is paid because of a parent's disability rather than the child's: a parent or guardian must be receiving a CPP disability benefit or a post-retirement disability benefit, and the child must be under 18, or 18 to 25 and attending a recognized school or university.",
    action: { text: "Check CPP children's benefit eligibility", url: "https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-childrens-benefit.html" },
  },
  cdbTaxFiling: {
    short: "Check tax residency and tax returns for you and your partner",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be a Canadian resident for income tax purposes, and you and your spouse or common-law partner must have filed your 2025 federal income tax return before payments can start.",
    action: { text: "Review Canada Disability Benefit eligibility", url: "https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit/eligibility.html" },
  },
  cdbStatus: {
    short: "Check CDB status routes and federal imprisonment exceptions",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be a Canadian citizen, a permanent resident, a protected person, a temporary resident who has lived in Canada throughout the previous 18 months, or registered or entitled to be registered under the Indian Act. If you are serving a sentence of 2 years or more in a federal penitentiary you are not eligible, except for the first and last month of that sentence.",
    action: { text: "Review Canada Disability Benefit eligibility", url: "https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit/eligibility.html" },
  },
  ccbEligibility: {
    short: "Check Canada Child Benefit rules and yearly tax filing",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "The Child Disability Benefit is paid together with the Canada Child Benefit, so you must already be eligible for the CCB — living with the child, being primarily responsible for their care and upbringing, and a resident of Canada for tax purposes — and you must file your taxes every year.",
    action: { text: "Check Canada Child Benefit eligibility", url: "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-child-benefit.html" },
  },
  rdspOpening: {
    short: "Check SIN and residency rules for opening an RDSP and contributing",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "To open a plan the beneficiary needs a valid social insurance number and must be a resident of Canada when the plan is opened and when each contribution is made.",
    action: { text: "Review RDSP eligibility", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-disability-savings-plan-rdsp/eligibility-contributions.html" },
  },
  rdspContributionWindow: {
    short: "Check the age deadline for adding money to an RDSP",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "Contributions are permitted until the end of the year in which the beneficiary turns 59. There is no annual contribution limit, but the lifetime contribution limit for a beneficiary is \$200,000.",
    action: { text: "Review RDSP contribution limits", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-disability-savings-plan-rdsp/rdsp-limits-transfers-rollovers.html" },
  },
  cwbEligibility: {
    short: "Check CWB residence, family, income rules and exclusions",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must be a resident of Canada throughout the year, be 19 or older on December 31 or live with your spouse, common-law partner or child, and have net income below the level set for your province or territory. You are not eligible if you were enrolled as a full-time student for more than 13 weeks in the year unless you have an eligible dependant on December 31, if you were confined to a prison or similar institution for at least 90 days during the year, or if you do not have to pay tax in Canada because you are an officer or servant of another country, such as a diplomat, or a family member or employee of that person.",
    action: { text: "Check CWB eligibility", url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-45300-canada-workers-benefit-cwb/who-is-eligible.html" },
  },
  csgNeedAndProgram: {
    short: "Check need, school and disability records; some provinces run their own aid",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You must have an assessed financial need, be enrolled in a qualified program at a designated school, have a disability recognized by the Canada Student Financial Assistance Program, and include documentation of your disability with your application. The Northwest Territories, Nunavut and Quebec run their own student aid programs; if you live there, apply through that program instead.",
    action: { text: "Review the grant's eligibility", url: "https://www.canada.ca/en/employment-social-development/services/education/grants/disabilities.html" },
  },
  csgServicesEquipment: {
    short: "Ask a qualified person to confirm school support needs and costs",
    who: ["you", "professional"],
    met: () => false,
    fixed: false,
    unmet: "You must also send written confirmation from a qualified person — a rehabilitation caseworker, an official from a centre for students with disabilities, a guidance counsellor, or your school's financial aid administrator — that you need the education-related services or equipment, plus a document confirming their cost.",
    action: { text: "Review the services and equipment grant", url: "https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans/disabilities-service-equipment.html" },
  },
  abGrantStudyAidEligibility: {
    short: "Check Alberta student aid rules, course load and assessed need",
    who: ["you", "program"],
    // Course-load percentage, Alberta funding eligibility, and Alberta's
    // calculated-need result are not collected by the questionnaire.
    met: () => false,
    fixed: false,
    unmet: "Confirm Alberta student-funding eligibility, a full-time course load of at least 60% (or a documented reduced load of at least 40%), and at least $1 of Alberta calculated need.",
    action: { text: "Review Alberta grant eligibility", url: "https://studentaid.alberta.ca/policy/student-aid-policy-manual/eligibility-for-student-loans-and-grants/alberta-student-grants/" },
  },
  abGrantCurrentCostRequest: {
    short: "Check approved cost records and what is left after federal funding",
    who: ["you", "program"],
    // A disability document does not establish a current approved Schedule 4
    // request, current costs, or a gap after the federal grant is allocated first.
    met: () => false,
    fixed: false,
    unmet: "For this financial-assistance application, confirm an approved Schedule 4 lists current disability-related service or equipment costs with quotes or estimates, and that approved costs remain after federal funding is allocated first.",
    action: { text: "Review Schedule 4 and cost rules", url: "https://studentaid.alberta.ca/policy/student-aid-policy-manual/eligibility-for-student-loans-and-grants/alberta-student-grants/" },
  },
  disabilityDoc: {
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Have a qualified professional verify the disability or functional limitation first.",
  },
  dresResidencyAndStatus: {
    short: "Check Alberta residency and your right to work or train in Canada",
    who: ["you"],
    // The questionnaire's citizen/PR answer cannot rule out a Convention Refugee,
    // and it does not establish current Alberta residency or legal work status.
    met: () => false,
    fixed: false,
    unmet: "Confirm that you reside in Alberta, are legally entitled to work or train in Canada, and are a Canadian citizen, permanent resident, or Convention Refugee.",
    action: { text: "Review DRES eligibility", url: DRES_URL },
  },
  dresDisabilityBarrier: {
    short: "Check records of how your disability affects school or work",
    who: ["you"],
    // A general documentation answer does not establish DRES's duration and
    // barrier tests. Keep both unresolved even when unsupported fields appear.
    met: () => false,
    fixed: false,
    unmet: "Confirm that your documented disability is permanent or long-term and creates a barrier to education, training, or employment.",
    action: { text: "Review DRES disability criteria", url: DRES_URL },
  },
  dresEmploymentRoute: {
    short: "Check DRES employment and accommodation routes and exclusions",
    who: ["you", "program"],
    // Work/training answers do not establish employment-destined status, the
    // requested accommodation, or whether an institutional exclusion applies.
    met: () => false,
    fixed: false,
    unmet: "Confirm that you are employed or employment destined and that the request is for a DRES-funded accommodation. Education or training supports are not available while attending Alberta Education-funded K–12 or a publicly funded Alberta post-secondary institution; contact the school or institution for disability accommodations. DRES does not fund employment services, for example job matching, employment or skills training, or wage subsidies.",
    action: { text: "Review DRES routes and exclusions", url: DRES_URL },
  },
  pddEligibility: {
    met: () => false,
    fixed: false,
    unmet: "Confirm PDD's citizenship and assessed intellectual/adaptive-function criteria.",
  },
  abServiceDogQualified: {
    short: "Check your service dog's training and records against the accepted routes",
    who: ["you", "professional"],
    met: () => false,
    fixed: false,
    unmet: "Your service dog must already be qualified — assessed by one of Alberta's approved service dog providers, graduated from an Assistance Dogs International accredited program, or qualified by an organization contracted by a provincial or territorial government in Canada to an equivalent standard.",
  },
  abCapccContinuingCareHome: {
    short: "Check whether you live in a type A or B care home and can share your goals",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "This is for people living in a type A or type B continuing care home in Alberta who can take part in setting their own goals and communicate their preferences. The questionnaire does not ask where you live.",
  },
  abSpecialNeedsHousingPlacement: {
    short: "Ask your local housing provider about its rules and waiting list",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Income limits are set community by community, and you apply to a local housing provider rather than to the province, so that provider confirms eligibility. Each housing operator may keep a waitlist when there are no current vacancies.",
  },
  abSpecialNeedsHousingStatus: {
    short: "Check your status against the listed routes",
    who: ["you"],
    met: () => answers.citizenPR === true,
    fixed: false,
    unmet: "You must be a Canadian citizen or permanent resident, a refugee sponsored by the Government of Canada, or a privately sponsored refugee whose sponsorship has broken down. Evacuees from Ukraine with a Canada-Ukraine Authorization for Emergency Travel are eligible to apply. Some housing providers may have additional eligibility criteria.",
  },
  fscdEligibility: {
    met: () => false,
    fixed: false,
    unmet: "Confirm guardianship, the child's status, and medical documentation of disability or an awaiting-diagnosis assessment.",
  },
  aishMedical: {
    short: "Ask about AISH's disability review and your doctor's report",
    who: ["you", "professional", "program"],
    met: () => false,
    fixed: false,
    unmet: "AISH decides whether you have a severe disability that permanently prevents employment. A doctor must complete the medical report, and AISH reviews the treatments, therapies, rehabilitation and training that might improve your condition.",
    action: { text: "Review AISH eligibility", url: "https://www.alberta.ca/aish-eligibility" },
  },
  aishFinancial: {
    short: "Check income, assets and other benefits you may need to apply for",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "AISH counts your income and your spouse or partner's income, and your combined non-exempt assets must stay at or under $100,000. You must also apply for other income you may qualify for, such as CPP-D, the Canada Disability Benefit, EI or WCB.",
    action: { text: "Review AISH eligibility", url: "https://www.alberta.ca/aish-eligibility" },
  },
  surreyLeisureRoute: {
    short: "Check which Surrey Leisure Access route applies",
    who: ["you"],
    // The wizard's PWD answer can mean designation alone, not current receipt.
    // No existing answer establishes any of the City's listed routes.
    met: () => false,
    fixed: false,
    unmet: "Surrey says you may qualify through income tax documents against its family size and income table, Ministry of Social Development client status, the Disability Tax Credit with lower net income, Guaranteed Income Supplement for seniors, qualifying legal care or SAJE support, or a refugee referral through an approved agency. Check which route applies.",
  },
  aishAge: {
    short: "Check your age and Old Age Security eligibility",
    who: ["you"],
    met: () => isAdultAge(),
    fixed: () => isUnder18(),
    unmet: "AISH is for adults aged 18 and older who are not eligible to receive an Old Age Security pension. If you are 65 or older, check whether you are eligible to receive an Old Age Security pension.",
  },
  adapAge: {
    short: "Check your age and Old Age Security eligibility",
    who: ["you"],
    met: () => isAdultAge(),
    fixed: () => isUnder18(),
    unmet: "ADAP is for adults aged eighteen and older who are not eligible to receive an Old Age Security pension. If you are sixty-five or older, check whether you are eligible to receive an Old Age Security pension.",
  },
  adapMedical: {
    short: "Check Alberta's disability review for AISH and ADAP",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Alberta decides whether your severe disability significantly impedes employment, continuously or episodically. For ADAP it must be determined to significantly restrict but not prevent you from being employed. One application assesses both AISH and ADAP.",
    action: { text: "Review ADAP eligibility", url: "https://www.alberta.ca/adap-eligibility" },
  },
  adapFinancial: {
    short: "Check ADAP income reviews, assets and other possible benefits",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "ADAP reviews your income monthly and your non-exempt assets must stay at or under $100,000. You must also apply for other income you may qualify for, such as CPP-D, the Canada Disability Benefit, EI or WCB.",
    action: { text: "Review ADAP eligibility", url: "https://www.alberta.ca/adap-eligibility" },
  },
  ahcipRegistered: {
    met: () => false,
    fixed: false,
    unmet: "Confirm you are registered for the Alberta Health Care Insurance Plan (AHCIP) and hold a valid card.",
    action: { text: "Check AHCIP registration", url: "https://www.alberta.ca/ahcip-how-to-apply" },
  },
  aadlAssessment: {
    short: "Ask an authorized health professional about assessment and AADL benefits",
    who: ["you", "professional"],
    met: () => false,
    fixed: false,
    unmet: "An authorized health professional must assess you, and the item must be an AADL benefit bought from an AADL-approved vendor. AADL defines long-term and chronic as 6 months or longer.",
    action: { text: "Review AADL eligibility", url: "https://www.alberta.ca/aadl-eligibility-and-application-for-benefits" },
  },
  aadlOtherPayer: {
    short: "Check comparable benefits you may receive and the NIHB fallback",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You may not be eligible for AADL if you are eligible to receive comparable benefits from another source: Veterans Affairs (for a medical condition from active duty), Workers' Compensation Board, Non-Insured Health Benefits (NIHB) or a private insurance plan. If a benefit is not available through NIHB and you are eligible for AADL, AADL benefits can be accessed.",
  },
  homeAccessNeed: {
    met: () => hasFunctionalNeed("homeAccess"),
    fixed: () => !functionalNeedUnknown(),
    unmet: "This is for someone who needs disability-related changes to the home for access or safety.",
  },
  rampMobilityRoute: {
    short: "Check RAMP's routes for mobility aids or listed conditions",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "RAMP may be for an Albertan of any age who uses a wheelchair, a senior (65+) who uses a 4-wheel walker on an ongoing basis, or someone living with a progressive neuro-degenerative disease including multiple sclerosis, muscular dystrophy, ALS, COPD, Parkinson's disease, Alzheimer's disease, spina bifida, a spinal cord injury, or non-recovering stroke.",
    action: { text: "Review RAMP eligibility", url: "https://www.alberta.ca/residential-access-modification-program" },
  },
  rampIncomeAndResidency: {
    short: "Check RAMP's family income and Alberta residency rules",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "Maximum family income runs from \$36,900 for a single adult to \$94,500 for a couple with five children, with \$7,131 added when a child permanently uses a wheelchair. You must also have lived in Alberta for 90 continuous days.",
    action: { text: "Check the RAMP income table", url: "https://www.alberta.ca/residential-access-modification-program" },
  },
  adultHealthIncome: {
    short: "Check your family size against Alberta's current income table",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "Alberta sets a maximum income by family size — $16,580 for a single adult and $23,212 for a couple with no children, rising with each child. Check your family size against the current table.",
    action: { text: "Check the income table", url: "https://www.alberta.ca/alberta-adult-health-benefit" },
  },
  adultHealthGateway: {
    short: "Check the health benefit routes and other coverage exclusions",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "Confirm pregnancy, high ongoing prescription drug needs, or the qualifying AISH/Income Support transition route. You cannot already be receiving Income Support, AISH, the Child and Youth Support Program, Non-Insured Health Benefits or another federal First Nations or Inuit program, or the Alberta Seniors Benefit.",
  },
  abPlacardMobility: {
    short: "Check the parking permit rules for walking or vision limits",
    who: ["you"],
    met: () => hasDisability("physical") && answers.canWalkFar === false,
    fixed: () =>
      !hasDisability("physical") &&
      !hasDisability("vision"),
    unmet: "Confirm inability to walk 50 metres or vision loss that substantially limits safe, independent navigation in parking areas.",
    action: {
      text: "Review Alberta's parking placard criteria",
      url: "https://www.alberta.ca/get-parking-placard-people-disabilities",
    },
  },
  autismDiagnosis: {
    short: "Check whether the autism diagnosis meets B.C. standards",
    who: ["you", "professional"],
    met: () => answers.autismDiagnosis === "yes",
    fixed: false,
    unmet: "BC Autism Funding requires an autism diagnosis that meets B.C. standards.",
  },
  autismSelected: { met: () => hasDisability("autism"), fixed: true, unmet: "This funding is specifically for an autistic child or youth." },
  palliativeCandidateCondition: {
    met: () => hasDisability("chronic") || hasDisability("other"),
    fixed: true,
    unmet: "This is for someone who has reached the end stage of a life-threatening disease or illness.",
  },
  psychiatricMedicationCandidate: {
    met: () => hasDisability("mental") || hasDisability("other"),
    fixed: true,
    unmet: "This plan covers psychiatric medications specifically.",
  },
  planGClinicalAndFinancialNeed: {
    short: "Your prescriber confirms health need with a care team; check the income test",
    who: ["you", "professional"],
    met: () => false,
    fixed: false,
    unmet: "You need both clinical and financial need: your prescriber confirms the clinical side with your local mental health and substance use team, and the financial test is an annual income lower than $42,000.",
  },
  planPRegistration: {
    short: "Ask a doctor or nurse practitioner to send the registration form",
    who: ["you", "professional"],
    met: () => false,
    fixed: false,
    unmet: "A physician or nurse practitioner registers the patient with PharmaCare — there is no form for the patient or family to submit. Ask the doctor or nurse practitioner to send the BC Palliative Care Benefits registration form.",
  },
  bcMsp: {
    short: "Check your Medical Services Plan enrolment",
    who: ["you"],
    met: () => answers.msp === "yes",
    fixed: () => answers.msp === "no",
    unmet: "Confirm B.C. Medical Services Plan enrolment first.",
    action: { text: "Check or apply for MSP", url: "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/eligibility-and-enrolment" },
  },
  bcSupplementaryBenefitsEligibility: {
    short: "Check the income and other eligibility routes",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You may be eligible in several ways: your adjusted net income last year was less than $42,000, or you are an Income Assistance recipient, a Convention refugee, an inmate of a B.C. Correctional Facility, enroled with MSP through the At Home Program, a long term care resident receiving the GIS, enroled with MSP as a Mental Health Client, or a First Nations individual with valid B.C. Medical Plan coverage through FNHA. You live in B.C., have lived in Canada as a citizen or permanent resident for at least the last 12 months before applying, and are not exempt from paying income tax under another act.",
    action: { text: "Apply for Supplementary Benefits", url: "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/benefits/services-covered-by-msp/supplementary-benefits" },
  },
  firstNationsStatus: {
    short: "Ask FNHA Health Benefits about status and B.C. residency rules",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "This program is for First Nations people with Indian status living in B.C. The questionnaire does not ask about status, so check directly with FNHA Health Benefits.",
    action: { text: "Check FNHA Health Benefits eligibility", url: "https://www.fnha.ca/benefits/eligibility" },
  },
  // Benefit-specific alternatives: do not narrow other users of the shared gates.
  bcMedTransportRoute: {
    short: "Check which medical transportation eligibility route may apply",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You may be eligible if you receive disability assistance; income assistance in the PPMB category; income assistance while residing in a special care facility; or Medical Services Only. Other routes are Transitional Health Services after income assistance in PPMB or while residing in a special care facility; a person or child approved as facing a life-threatening health need with a direct and immediate life-threatening need for medical transportation; or a child in a family receiving income assistance, disability assistance, hardship assistance, MSO or Transitional Health Services.",
  },
  bcMedTransportNeed: {
    short: "Check extraordinary travel costs for essential medical treatment",
    who: ["you", "professional", "program"],
    met: () => hasFunctionalNeed("medicalTravel"),
    fixed: false,
    unmet: "You do not have resources available to cover your medical transportation costs. You must have extraordinary medical transportation costs for essential medical treatment. This includes daily appointments or a need to travel out of town. If local treatment is not available within a reasonable timeframe or due to extenuating circumstances, provide verification that you require essential medical treatment outside your community with a medical practitioner, nurse practitioner, specialist and/or at a hospital.",
  },
  bcStcAgeOrFamily: {
    short: "Check the age, spouse or common-law partner, or parent route",
    who: ["you"],
    met: () => ageIn("19to59", "60to64", "65plus"),
    fixed: false,
    unmet: "For the tax year, you were nineteen or older, had a spouse or common-law partner, or were a parent.",
  },
  burnabyFairPlayRoute: {
    short: "Check which FAIR Play application route may apply",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You must meet one FAIR Play route: federal or provincial government income assistance; combined family income within the FAIR Play income scale; applying for a child with a disability while currently receiving the Child Disability Benefit (this application is only for your child); government or privately sponsored refugee status or current Canadian Ukraine Emergency Travel Authorization (CUAET); or an approved agency referral. The agency-referral route uses a FAIR Play Agency Referral Form submitted by your approved referral agency worker, not a household application.",
  },
  bcAtHomeMedicalRoute: {
    short: "Check assessed daily-living, direct nursing or palliative eligibility",
    who: ["you", "professional", "program"],
    // Self-reported dependence is not the program's eligibility assessment.
    met: () => false,
    fixed: false,
    unmet: "Medical-benefit routes are alternatives: assessed dependence in at least three of eating, dressing, toileting and washing; eligibility for Nursing Support Services direct nursing care, without an eligibility assessment; or a palliative condition with life expectancy of up to six months as indicated by a physician or nurse practitioner, without an eligibility assessment. The questionnaire cannot establish the assessment, nursing eligibility or palliative certification.",
  },
  bcPwdStatus: {
    short: "Check your B.C. PWD designation or disability assistance status",
    who: ["you"],
    met: () => answers.bcAssistance === "pwd",
    fixed: false,
    unmet: "This requires B.C. PWD designation or disability assistance first.",
    action: { text: "Start through My Self Serve", url: "https://myselfserve.gov.bc.ca/" },
  },
  bcAssistanceStatus: {
    short: "Check the guide for accepted B.C. assistance or status categories",
    who: ["you"],
    met: () => ["pwd", "other"].includes(answers.bcAssistance),
    fixed: () => answers.bcAssistance === "none",
    unmet: "This requires a qualifying B.C. assistance, care, or protected-status category; check the guide first.",
  },
  bcBusPassStatus: {
    short: "Check the bus pass routes for disability assistance or senior status",
    who: ["you"],
    met: () => answers.bcAssistance === "pwd" || (isSeniorAge() && lowIncome()),
    fixed: false,
    unmet: "This requires B.C. disability assistance/PWD status or one of the listed low-income senior categories.",
  },
  bcPwdMedical: {
    short: "Ask about the ministry review and the health reports it needs",
    who: ["you", "professional", "program"],
    met: () => false,
    fixed: false,
    unmet: "The ministry decides whether your impairment is severe and likely to continue for at least two years. A medical practitioner or nurse practitioner completes the medical report, and a medical practitioner, nurse practitioner or other prescribed professional completes the assessor report.",
    action: { text: "Review the PWD designation criteria", url: "https://www2.gov.bc.ca/gov/content/family-social-supports/services-for-people-with-disabilities/disability-assistance" },
  },
  bcPwdDesignationFinancial: {
    short: "Check the usual PWD application path and routes that may skip it",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "The standard designation application is generally reached through a financial eligibility screen for assistance. An existing designation is not automatically lost if you later become financially ineligible, and prescribed-class routes — including CPP disability benefits, the At Home Program, Community Living BC support services and PharmaCare palliative care benefits — can lead to designation without the standard application.",
    action: { text: "Review the PWD designation criteria", url: "https://www2.gov.bc.ca/gov/content/family-social-supports/services-for-people-with-disabilities/disability-assistance" },
  },
  bcDisabilityAssistanceFinancial: {
    short: "Ask the ministry about its family income and asset test",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Disability assistance depends on the ministry's own family-unit income and asset test. Exempt asset limits are \$100,000 for a single person, couple or family where one person has the PWD designation, and \$200,000 for a couple where both adults have the designation.",
    action: { text: "Review disability assistance eligibility", url: "https://www2.gov.bc.ca/gov/content/family-social-supports/services-for-people-with-disabilities/disability-assistance" },
  },
  bcCydbIntake: {
    met: () => false,
    fixed: false,
    unmet: "Support is available now: new families apply through the existing pathways — Autism Funding or the At Home Program. Children and youth receiving CYSN services before March 31, 2027 will transition to the Disability Benefit if they are eligible. New applicants after April 1, 2027 will apply directly for the Disability Benefit.",
    action: { text: "Read the transition guidance", url: "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/financial-supports/disability-benefit" },
  },
  bcFuelTaxRoute: {
    short: "Check which disability proof the fuel tax refund program accepts",
    who: ["you", "professional", "program"],
    met: () => false,
    fixed: false,
    unmet: "You must be 16 or older. You may qualify through B.C. Disability Assistance Certification, a BCANDS, Veterans' Affairs or CNIB letter, or medical certification of a listed condition, such as a permanent mental disability. See the full list in the guide's eligibility section.",
    action: { text: "Review the fuel tax refund routes", url: "https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/motor-fuel-carbon-tax/refund-disabilities" },
  },
  bcFuelTaxRegistered: {
    short: "Check your fuel tax refund registration approval before claiming",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "This discount requires an approved registration in the Fuel Tax Refund Program for Persons with Disabilities. You can claim only after your registration is confirmed.",
    action: { text: "Register for the fuel tax refund program", url: "https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/motor-fuel-carbon-tax/refund-disabilities" },
  },
  bcDefermentProperty: {
    short: "Check residency, home ownership, equity and unpaid property bills",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must have lived in B.C. for at least one year, be the registered owner of the property as your principal residence, keep at least 25% equity in it, and have paid all previous years' property taxes, utility fees, penalties and interest.",
    action: { text: "Review deferment eligibility", url: "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/annual-property-tax/property-tax-deferment-program/eligibility" },
  },
  hatcEligibleDwelling: {
    short: "Check ownership and ordinary or expected residence in the Canadian home",
    who: ["you"],
    met: () => hasCircumstance("homeowner"),
    fixed: false,
    unmet: "The home must be in Canada and owned (jointly or otherwise) by the person the renovation is for or by the family member claiming for them. It must be ordinarily lived in (or expected to be ordinarily lived in) during the year by the qualifying person if they own it, or by both the owner and the qualifying person if the family member owns it. In that family-owner route, the qualifying person must not, throughout the year, own and ordinarily inhabit another housing unit in Canada. Co-op shares can count.",
  },
  hatcQualifyingPerson: {
    short: "Check DTC eligibility during the year or senior status at year end",
    who: ["you"],
    met: () => answers.dtc === "yes" || isSeniorAge(),
    fixed: false,
    unmet: "The renovation must be for a qualifying individual: someone eligible for the Disability Tax Credit at any time in the year, or aged 65 or older at the end of the year. A spouse, common-law partner or certain other relatives can make the claim for them.",
    action: { text: "Start the DTC (T2201)", url: DTC_URL },
  },
  hatcQualifyingRenovationSpend: {
    short: "Check the renovation is done and paid for, and keep the receipts",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "This credit is non-refundable: it reduces the tax you owe based on eligible expenses (up to $20,000 a year), so it applies only once a qualifying renovation has actually been done and paid for in the tax year. Keep your invoices and receipts.",
  },
  richmondFinancialHardship: {
    short: "Check listed assistance or, without it, income and other financial limits",
    who: ["you", "program"],
    met: () => answers.income === "low",
    fixed: false,
    unmet: "You must be in financial hardship in one of two ways: you receive one of the government assistance programs the City lists (for example Disability Assistance, Income Assistance, the Guaranteed Income Supplement or the Canada Disability Benefit), or you do not receive them but meet the City's family net income and other financial limits.",
  },
  bcHomeRenoSpend: {
    short: "Check the renovation expenses qualify, and keep the receipts",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "This credit pays back part of what you spend, so it applies only once the qualifying renovation has actually been done. An eligible expense is deemed to have been paid on the earlier of the date it was paid or the date it becomes payable. Keep your invoices and receipts.",
  },
  qualifyingRenovationSpend: {
    short: "Check the renovation is done and paid for, and keep the receipts",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "This credit pays back part of what you spend, so it applies only once the qualifying renovation has actually been done and paid for. Keep your invoices and receipts.",
  },
  mhrtcSecondaryUnit: {
    short: "Check the separate-unit rules and who the renovation is for",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "This credit is only for creating a self-contained secondary unit with its own private entrance, kitchen, bathroom and sleeping area, so that a senior or an adult eligible for the Disability Tax Credit can live with a relative. Only one such renovation can ever be claimed for that person.",
  },
  excisePermanentMobilityCertified: {
    short: "Ask a medical practitioner about certifying your mobility limits",
    who: ["you", "professional"],
    met: () => false,
    fixed: false,
    unmet: "A qualified medical practitioner must certify that you have a permanent mobility impairment and cannot safely use public transportation.",
  },
  cdcpRequirements: {
    short: "Check dental coverage, tax returns, family income and residency",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must meet all four CDCP requirements: you have no access to private dental insurance or coverage, you and your spouse or partner have filed your Canadian tax returns, your adjusted family net income is under $90,000, and you are a Canadian resident.",
  },
  disabilityMedicalExpensesPaid: {
    short: "Check paid medical costs and receipts for your tax return",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "This is claimed on your tax return for money you have already spent, so it applies once you have paid the expenses and have the receipts.",
  },
  caregiverSupportClaim: {
    short: "Check who gives support and who claims it on their tax return",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "This is claimed by the person providing support, on their own tax return, for a spouse, partner or dependant with a mental or physical impairment.",
  },
  bcHomeOwnerGrantDisabilityRoute: {
    short: "Check the disability assistance or spending route and any Form B requirement",
    who: ["you", "professional", "program"],
    met: () => false,
    fixed: false,
    unmet: "You must qualify on one of two routes: you receive provincial disability assistance, hardship assistance or a supplement under the Employment and Assistance for Persons with Disabilities Act; or you pay at least $150 a month for assistance with daily living activities, or have spent at least $2,000 on structural modifications to the home. The second route needs Form B (FIN 74) signed by a health professional.",
    action: { text: "Check the grant criteria", url: "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/annual-property-tax/home-owner-grant/person-with-disabilities" },
  },
  rahaEligibility: {
    short: "Check income and asset limits; wait for written approval before work starts",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You or someone in your household must have a permanent disability or loss of physical ability, and the household must be within BC Housing income and asset limits. Adaptations finished before BC Housing gives written approval are not eligible.",
    action: { text: "Check BC RAHA eligibility", url: "https://www.bchousing.org/housing-assistance/BC-RAHA" },
  },
  bcHealthyKidsIncome: {
    short: "Check income rules and apply for MSP supplementary benefits first",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Your family must be eligible for MSP supplementary benefits, which means an adjusted net income of $42,000 or less. Apply to Health Insurance BC for supplementary benefits first.",
    action: { text: "Apply for MSP supplementary benefits", url: "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/benefits/premium-assistance" },
  },
  bcWorkBcRoute: {
    short: "Check which WorkBC route fits your work or school situation",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "WorkBC serves people who are unemployed or underemployed. People with disabilities who are employed also qualify if they are at significant risk of losing a job, or work more than 20 hours a week and are seeking more hours. Final-year high-school and post-secondary students with disabilities qualify too. Confirm which route applies to you.",
    action: { text: "Check WorkBC eligibility", url: "https://www.workbc.ca/discover-employment-services/workbc-centres/employment-services/employment-services-eligibility" },
  },
  coquitlamStatus: {
    short: "Check Coquitlam's residency and immigration status rules",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "Coquitlam serves Canadian citizens, permanent residents and refugees who have settled in Coquitlam. Temporary residents — including visitors and study or work permit holders — and business-class, investor or entrepreneur immigrants are not eligible.",
    action: { text: "Review Coquitlam's eligibility", url: "https://www.coquitlam.ca/499/Financial-Assistance-for-Recreation" },
  },
  coquitlamIncome: {
    short: "Check your household size against Coquitlam's income table",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Coquitlam verifies household income against the Low Income Cut-off for your household size, which ranges from \$27,478 for one person to \$72,715 for seven or more. Check your household size against the current table.",
    action: { text: "Review Coquitlam's eligibility", url: "https://www.coquitlam.ca/499/Financial-Assistance-for-Recreation" },
  },
  archIncomeOrAssistance: {
    short: "Check Kamloops' assistance, income or pension routes",
    who: ["you"],
    // ARCH accepts any ONE of three official routes. The questionnaire can
    // suggest none of them: the income band is far below the City's
    // household-size Low Income Guidelines, and an assistance status is not the
    // same as currently receiving MSDPR Income Assistance. Never deny on income
    // alone.
    met: () => false,
    fixed: false,
    unmet: "Kamloops accepts any one of three routes: you receive Income Assistance from the Ministry of Social Development and Poverty Reduction, your annual income is below the Statistics Canada Low Income Guidelines listed on the application form, or you receive a Canadian pension or long-term disability payment below those guidelines.",
    action: { text: "Check ARCH eligibility", url: "https://www.kamloops.ca/recreation-culture/programs-activities/accessible-recreation/arch-program" },
  },
  notBcAssistance: {
    short: "Check whether Healthy Kids or ministry coverage is the right route",
    who: ["you"],
    met: () => answers.bcAssistance === "none",
    fixed: () => ["pwd", "other"].includes(answers.bcAssistance),
    unmet: "BC Healthy Kids is for eligible lower-income families not already receiving ministry assistance; those on assistance receive equivalent ministry coverage.",
  },

  /* disability-type driven */
  bcParkingMobility: {
    short: "Check that a mobility limitation applies",
    who: ["you"],
    met: () => hasDisability("physical") && answers.canWalkFar === false,
    fixed: false,
    unmet: "People with mobility limitations are entitled to a permit, for example people who use a wheelchair, crutches, a cane or other mobility aid, or whose health prevents them from walking very far.",
  },
  mobility: {
    // eligible if physical + can't walk 50m, OR vision loss affecting mobility
    met: () =>
      (hasDisability("physical") && answers.canWalkFar === false) ||
      hasDisability("vision"),
    fixed: true,
    unmet: "For a mobility limitation (can't walk ~50m) or vision loss.",
  },
  equipmentNeed: {
    met: () => hasFunctionalNeed("equipment"),
    fixed: () => !functionalNeedUnknown(),
    unmet: "This is for someone who needs disability-related medical equipment or supplies.",
  },
  dailyLivingLimit: {
    short: "Check daily living limits and the help or supports you need",
    who: ["you"],
    met: () => hasFunctionalNeed("dailyLiving"),
    fixed: () => !functionalNeedUnknown(),
    unmet: "PWD requires significant restrictions in daily living plus an assistive device, the significant help or supervision of another person, or the services of an assistance animal.",
  },
  childHighNeeds: {
    met: () => hasFunctionalNeed("childHighNeeds"),
    fixed: () => !functionalNeedUnknown(),
    unmet: "This benefit is for children and youth with the highest functional support needs.",
  },
  childThreeAdls: {
    met: () => hasFunctionalNeed("childThreeAdls"),
    fixed: () => !functionalNeedUnknown(),
    unmet: "The At Home Program requires dependence in at least 3 of eating, dressing, toileting and washing.",
  },
  transitBarrier: {
    met: () => hasFunctionalNeed("transitBarrier"),
    fixed: () => !functionalNeedUnknown(),
    unmet: "This is for someone who cannot use regular public transit without assistance for some or all trips.",
  },
  nutritionNeed: {
    met: () => hasFunctionalNeed("nutrition"),
    fixed: () => !functionalNeedUnknown(),
    unmet: "This supplement requires a qualifying medical need for a special diet or nutritional products.",
  },
  medicalTravelNeed: {
    met: () => hasFunctionalNeed("medicalTravel"),
    fixed: () => !functionalNeedUnknown(),
    unmet: "This is for essential medical travel that cannot be obtained in the home community.",
  },
  metroVancouver: { met: () => METRO_VANCOUVER_CITIES.includes(answers.city), fixed: true, unmet: "This TransLink program is for Metro Vancouver residents." },
  outsideMetroVancouver: {
    short: "Check whether to use B.C. Transit or TransLink for your area",
    who: ["you"], met: () => !!answers.city && !METRO_VANCOUVER_CITIES.includes(answers.city), fixed: true, unmet: "Use the TransLink program in Metro Vancouver; this listing is for B.C. Transit communities." },
  translinkHandyCard: { met: () => false, fixed: false, unmet: "Get a TransLink HandyCard first (TaxiSavers are sold to HandyCard members)." },
  bcTransitHandyDart: { met: () => false, fixed: false, unmet: "Register as a permanent handyDART customer and obtain a handyPASS first." },
  atHomeProgram: { met: () => false, fixed: false, unmet: "The child must first be enrolled in the At Home Program." },
  recentGraduate: { met: () => hasCircumstance("recentGraduate"), fixed: () => !circumstanceUnknown(),
    short: "Check your qualification and graduation date",
    who: ["you"],
    unmet: "Work-Able requires a recent graduate of a recognized post-secondary institution (two-year diploma, associate degree, bachelor's degree, master's degree or doctorate) with a graduation date within three years of the program start date." },
  vehicleOwner: { met: () => hasCircumstance("vehicleOwner"), fixed: () => !circumstanceUnknown(), unmet: "You must own, lease, or have an ownership interest in a qualifying vehicle." },
  homeowner: { met: () => hasCircumstance("homeowner"), fixed: () => answers.circumstances.length > 0 && !circumstanceUnknown(), unmet: "You or the eligible family member must own and live in the home and meet the program's other property rules." },
  mhrtcQualifyingIndividual: {
    short: "Check who the unit is for",
    who: ["you"],
    met: () => isSeniorAge() || (answers.dtc === "yes" && ageIn("18", "19to59", "60to64")),
    fixed: false,
    unmet: "The secondary unit must allow a senior or an adult who is eligible for the disability tax credit to live with a qualifying relative. Check whether the person the unit is for is one of these.",
  },
  homeRenoCandidate: {
    met: () => answers.dtc === "yes" || isSeniorAge(),
    fixed: true,
    unmet: "This credit requires DTC eligibility (any age), age 65+, or an eligible supporting family member living with the person.",
  },
  bcVehicleDisabilityRoute: {
    short: "Check which disability confirmation the registration page accepts",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "Confirm your disability with one of the routes the registration page lists: B.C. Disability Assistance Certification; a letter from BCANDS, Veterans' Affairs (100% disability pension) or CNIB; or medical certification of a listed permanent condition.",
    action: { text: "Review fuel-tax registration routes", url: "https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/motor-fuel-carbon-tax/refund-disabilities" },
  },
  exciseMobilityImpairment: {
    short: "Check whether your mobility impairment is permanent and affects transit",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "This refund is for people with a permanent mobility impairment who cannot safely use public transportation.",
  },
  vehicleDisability: {
    met: () => hasDisability("physical") || hasDisability("vision") || hasFunctionalNeed("transitBarrier"),
    fixed: () => !functionalNeedUnknown(),
    unmet: "The vehicle programs require one of the listed mobility, vision, or public-transit disability criteria.",
  },
  // The Cognitive Disability Strategy page does not define the term, so the clear
  // cognitive categories qualify and "something else" stays open rather than refused.
  skCognitiveDisability: {
    met: () => ["intellectual", "autism", "braininjury", "learning"].some(hasDisability),
    fixed: () => !hasDisability("other"),
    unmet: "This is for people with a cognitive disability and their families.",
  },
  intellectualDisability: { met: () => hasDisability("intellectual"), fixed: true, unmet: "This is for a child with an intellectual disability." },
  brainInjuryDisability: { met: () => hasDisability("braininjury"), fixed: true, unmet: "This is for adults with an acquired brain injury." },
  visionDisability: { met: () => hasDisability("vision"), fixed: true, unmet: "This program is for people who are blind or have low vision." },
  physicalDisability: { met: () => hasDisability("physical"), fixed: true, unmet: "This program is for people with a physical or mobility disability." },
  hearingDisability: { met: () => hasDisability("hearing"), fixed: true, unmet: "This grant is specifically for Deaf or hard-of-hearing students." },
  learningDisability: { met: () => hasDisability("learning"), fixed: true, unmet: "This bursary is specifically for a recommended learning-disability assessment." },
  // The bursary pays for the assessment, so no documentation is needed first
  // (official page, 2026-10-15 snapshot). What it asks for instead: StudentAid
  // BC eligibility, a designated public B.C. institution, and a recommendation.
  bcLdAssessmentReferral: {
    short: "Check that your school recommends an assessment",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You need StudentAid BC eligibility, a designated public college or university, and its accessibility office's referral.",
    action: { text: "See the bursary page", url: "https://studentaidbc.ca/explore/grants-scholarships/learning-disability-assessment-bursary" },
  },
  bcClbcStream: {
    short: "Check which CLBC stream fits",
    who: ["you", "program"],
    met: () => false,
    fixed: () => !(hasDisability("intellectual") || hasDisability("autism")),
    unmet: "CLBC supports adults with a developmental disability (significantly impaired intellectual and adaptive functioning that started before age 18). Through the Personalized Supports Initiative it also supports adults without a developmental disability who have a diagnosis of FASD or Autism Spectrum Disorder and, in either case, need significant help with day-to-day tasks (significant limitation in adaptive functioning).",
  },
  bcWorkAbleSelfIdentify: {
    short: "Check that you self-identify as having a disability",
    who: ["you"],
    met: () => answers.disabilityVerified === "yes",
    fixed: false,
    unmet: "Work-Able asks you to self-identify as having a disability. It does not ask you to disclose your specific disability or diagnosis.",
  },
  developmental: {
    // PDD: a developmental disability that began before age 18
    met: () =>
      (hasDisability("intellectual") || hasDisability("autism")) &&
      answers.onsetBefore18 === true,
    fixed: true,
    unmet: "For an intellectual / developmental disability that began before age 18.",
  },

  calgary: { met: () => answers.city === "Calgary", fixed: true, unmet: "This is a City of Calgary program." },
  edmonton: { met: () => answers.city === "Edmonton", fixed: true, unmet: "This is a City of Edmonton program." },
  toronto: { met: () => answers.city === "Toronto", fixed: true, unmet: "This is a City of Toronto program." },
  ottawa: { met: () => answers.city === "Ottawa", fixed: true, unmet: "This is a City of Ottawa program." },
  mississauga: { met: () => answers.city === "Mississauga", fixed: true, unmet: "This is a City of Mississauga program." },
  brampton: { met: () => answers.city === "Brampton", fixed: true, unmet: "This is a City of Brampton program." },
  hamilton: { met: () => answers.city === "Hamilton", fixed: true, unmet: "This is a City of Hamilton program." },
  // Niagara Region members in ON_CITIES; other Niagara municipalities are not listed in the wizard.
  niagaraRegion: { met: () => ["St. Catharines", "Welland", "Niagara Falls"].includes(answers.city), fixed: true, unmet: "This is a Niagara Region program for Niagara residents." },
  kingston: { met: () => answers.city === "Kingston", fixed: true, unmet: "This is a City of Kingston program." },
  // Halton Region members in ON_CITIES; Halton Hills is not listed in the wizard.
  haltonRegion: { met: () => ["Burlington", "Oakville", "Milton"].includes(answers.city), fixed: true, unmet: "This is a Halton Region program for Halton residents." },
  london: { met: () => answers.city === "London", fixed: true, unmet: "This is a City of London program." },
  windsor: { met: () => answers.city === "Windsor", fixed: true, unmet: "This is a City of Windsor program." },
  yorkRegion: {
    met: () => ["Aurora", "Markham", "Newmarket", "Richmond Hill", "Vaughan"].includes(answers.city),
    fixed: true,
    unmet: "This is a York Region program.",
  },
  waterlooRegion: {
    met: () => ["Cambridge", "Kitchener", "North Dumfries", "Waterloo", "Wellesley", "Wilmot", "Woolwich"].includes(answers.city),
    fixed: true,
    unmet: "This is a Region of Waterloo program.",
  },
  waterlooUrban: {
    met: () => ["Cambridge", "Kitchener", "Waterloo"].includes(answers.city),
    fixed: true,
    unmet: "This part of the service covers Cambridge, Kitchener and Waterloo; townships have a separate specialized service.",
  },
  waterlooRenovatesEligibility: {
    short: "Ask the Region to check income, home value and home records",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "The Region must confirm:\n• Total gross income of all household members (including those with disabilities) at or below the family-size maximum, or Ontario Works or Ontario Disability Support Program financial support as the household's sole source of income.\n• The home's maximum $600,000 value and sole and principal residence with no other property ownership.\n• Up-to-date property taxes and mortgage payments, and full-value home insurance.",
    action: { text: "See funding and application details", url: "https://www.regionofwaterloo.ca/programs-and-services/employment-and-financial-supports/financial-support-for-renters-and-homeowners/funding-for-home-repairs/" },
  },
  waterlooHomemakingFinancial: {
    short: "Ask the Region about the low income or social support route",
    who: ["you", "program"],
    met: () => lowIncome(),
    fixed: false,
    unmet: "The Region lists financial criteria of low income or social support. Ask the Region which applies to you.",
  },
  windsorEssex: {
    short: "Check Windsor-Essex residency and local program eligibility",
    who: ["you", "program"],
    met: () => answers.city === "Windsor",
    fixed: true,
    unmet: "This is for Windsor-Essex residents. This tool can only place residents of the City of Windsor, and the program says eligibility may differ across municipalities.",
  },
  yorkRecreationFamilyRoute: {
    short: "Check which York Region subsidy route applies to your family",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "York Region lists routes such as receiving a rent subsidy, Ontario Works, ODSP or ACSD, or a child care fee subsidy with an annual income of $43,000 or less. Overnight camp also lists some housing communities. Families who meet one of the Region's listed routes may be eligible.",
  },
  yorkRecreationAge: {
    short: "Check the age range for the subsidy you want",
    who: ["you"],
    met: () => ageIn("6to11", "12to15", "16to17", "18"),
    fixed: false,
    unmet: "PLAY assists children ages four to 18 and single parents. Summer day camp is for ages four to 12, and youth overnight camp for ages 12 to 17.",
  },
  waterlooHomemakingNeed: {
    short: "Ask about the program's home help review and the records it needs",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "The program confirms that significant functional impairments affect your homemaking tasks, that you need help at home due to illness, recovery from injury, aging or disability, and that you meet its financial criteria. Full financial and health information is required when you reach the top of the waitlist.",
    action: { text: "Apply through Caredove", url: "https://www.regionofwaterloo.ca/programs-and-services/seniors-and-long-term-care/community-programs-for-older-adults/homemaking-support/" },
  },
  waterlooWasteSupportApproval: {
    short: "Ask the Region which waste support route you can apply for",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "Assisted collection is for a disability or physical limitation when nobody is available to help, and only for eligible households that receive municipal curbside waste collection; the medical exemption's bag tags go to approved applicants. Either way you apply to the Region first.",
    action: { text: "See both waste support programs", url: "https://www.regionofwaterloo.ca/programs-and-services/garbage-and-organics/garbage/curbside-waste-support/" },
  },
  yorkHomemakersNeed: {
    short: "Contact York Region to ask about health and financial need rules",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "York Region checks that you are temporarily or permanently ill or disabled and that you meet its financial need requirements. The thresholds are not published, so you need to contact York Region.",
    action: { text: "Call York Region to apply", url: "https://www.york.ca/support/financial-assistance/homemakers-services" },
  },
  visionDisability: {
    met: () => hasDisability("vision"),
    fixed: true,
    unmet: "This is for people who are blind or partially sighted.",
  },
  ottawaOdspReceipt: {
    short: "Check your Ottawa residency and ODSP and transit proof",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet:
      "You need to be an Ottawa resident receiving ODSP benefits. Proving it takes your 9-digit ODSP identification number from an ODSP document, plus either a Presto card number or a Para Transpo ID number.",
    action: { text: "See reduced fares", url: "https://www.octranspo.com/en/fares/reduced-fares/" },
  },
  paraTranspoRegistered: {
    met: () => false,
    fixed: false,
    unmet: "You need to be registered as a Para Transpo customer, and you will be asked for your Para Transpo registration number.",
    action: { text: "See reduced fares", url: "https://www.octranspo.com/en/fares/reduced-fares/" },
  },
  atpApproval: {
    short: "Ask about transit program approval and household tax records",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet: "You need to be approved for the Affordable Transit Program, which is based on household net income from line 23600 of each household member's tax return.",
  },
  mobilityplusRegistered: {
    short: "Check that you are a MobilityPLUS customer in the three cities",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You need to be registered with MobilityPLUS. MobilityPLUS customers who live and travel in Cambridge, Kitchener and Waterloo can buy taxi coupons. Customers on MobilityPLUS North Dumfries or Kiwanis Transit services are not eligible.",
  },
  waterlooMobilityPlusTransit: {
    short: "Check which MobilityPLUS eligibility type fits",
    who: ["you", "professional"],
    met: () => false,
    fixed: false,
    unmet: "MobilityPLUS eligibility may be unconditional (a disability prevents you from using conventional transit), conditional (environmental or physical barriers limit your ability to consistently use it) or temporary (a temporary disability prevents you from using it).",
  },
  cnibCustomer: {
    met: () => false,
    fixed: false,
    unmet: "You need to be a CNIB customer.",
  },
  supportPersonApproval: {
    met: () => false,
    fixed: false,
    unmet: "You need to apply to the Transit Support Person program.",
  },
  aCardProof: {
    met: () => false,
    fixed: false,
    unmet:
      "You need either a CNIB one-piece photo ID card or an Attorney-General of Ontario Guide Dog photo ID card.",
    action: { text: "See reduced fares", url: "https://www.octranspo.com/en/fares/reduced-fares/" },
  },
  londonRenovatesEligibility: {
    short: "Ask London to check income, assets, home value and residency",
    who: ["you", "program"],
    // Deliberately NOT the lowIncome gate: the ceiling is $95,000, which is moderate
    // rather than low, so a fixed low-income gate would refuse eligible households. The
    // test also covers liquid assets and property assessment value, which the wizard
    // never asks about, so it stays unresolved and the record reads "One step away".
    met: () => false,
    fixed: false,
    unmet:
      "London checks that your gross household income is at or below $95,000, your household liquid assets are at or below $30,000, and your home's property tax assessment value is at or below $320,000, and that it is your sole and principal residence in London or Middlesex County.",
    action: { text: "See how to apply", url: "https://london.ca/living-london/building-renovating/home-repair-accessibility-funding" },
  },
  p2pIncomeTest: {
    short: "Ask local transit or recreation staff for your family's income limit",
    who: ["you", "program"],
    met: () => false,
    fixed: false,
    unmet:
      "Eligibility depends on your household's combined income being at or below the Market Basket Measure threshold for its family size. The programme page does not list those thresholds and directs applicants to contact their local municipal transit or recreation department for them.",
  },
  // Municipalities with their own verified programs (researched 2026-07-15).
  reddeer: { met: () => answers.city === "Red Deer", fixed: true, unmet: "This is a City of Red Deer program." },
  lethbridge: { met: () => answers.city === "Lethbridge", fixed: true, unmet: "This is a City of Lethbridge program." },
  medicinehat: { met: () => answers.city === "Medicine Hat", fixed: true, unmet: "This is a City of Medicine Hat program." },
  grandeprairie: { met: () => answers.city === "Grande Prairie", fixed: true, unmet: "This is a City of Grande Prairie program." },
  stalbert: {
    short: "Check whether the City of St. Albert program is for your area",
    who: ["you"], met: () => answers.city === "St. Albert", fixed: true, unmet: "This is a City of St. Albert program." },
  strathcona: { met: () => answers.city === "Sherwood Park", fixed: true, unmet: "This is a Strathcona County program." },
  airdrie: { met: () => answers.city === "Airdrie", fixed: true, unmet: "This is a City of Airdrie program." },
  woodbuffalo: { met: () => answers.city === "Fort McMurray", fixed: true, unmet: "This is a Wood Buffalo (Fort McMurray) program." },
  sprucegrovearea: { met: () => ["Spruce Grove", "Stony Plain"].includes(answers.city), fixed: true, unmet: "This is for eligible Spruce Grove-area residents." },
  leduc: { met: () => answers.city === "Leduc", fixed: true, unmet: "This is a City of Leduc program." },
  cochrane: { met: () => answers.city === "Cochrane", fixed: true, unmet: "This is a Town of Cochrane program." },
  okotoksArea: {
    met: () => answers.province === "AB" && ["Okotoks", "Foothills County"].includes(answers.city),
    fixed: () => !!answers.city && answers.city !== "Other / my town isn't listed",
    unmet: "This program serves Okotoks and Foothills County, Alberta.",
  },
  okotoksResidency: {
    short: "Check that you live in the Town of Okotoks or Foothills County",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "You must live in the Town of Okotoks or Foothills County.",
  },
  canmore: { met: () => answers.city === "Canmore", fixed: true, unmet: "This is a Town of Canmore program." },
  lloydminster: { met: () => answers.city === "Lloydminster", fixed: true,
    short: "Check the City of Lloydminster residency rule",
    who: ["you"],
    unmet: "This is a City of Lloydminster program. The residency requirement does not apply to First Nations, Metis, and/or Inuit applicants, who must still meet the income eligibility." },
  fortsask: { met: () => answers.city === "Fort Saskatchewan", fixed: true, unmet: "This is a City of Fort Saskatchewan program." },
  fortsaskIncomeRoute: {
    short: "Check your income route (approved program or income limit)",
    who: ["you"],
    met: () => false,
    fixed: false,
    unmet: "The applicant must be receiving funding from an approved Government program (such as AISH, CPPD, FSCD or Income Support), or have a combined household income at or under the Statistics Canada Low Income Thresholds listed on the City’s page. Proof of income verification is required.",
  },
  vancouver: { met: () => answers.city === "Vancouver", fixed: true, unmet: "This is a City of Vancouver program." },
  surrey: { met: () => answers.city === "Surrey", fixed: true, unmet: "This is a City of Surrey program." },
  morden: { met: () => answers.city === "Morden", fixed: true, unmet: "This is a local program for Morden residents." },
  halifaxArea: { met: () => ["Halifax", "Dartmouth"].includes(answers.city), fixed: true, unmet: "This is a local program for Halifax residents." },
  montrAl: { met: () => answers.city === "Montr\u00e9al", fixed: true, unmet: "This is a local program for Montréal residents." },
  laval: { met: () => answers.city === "Laval", fixed: true, unmet: "This is a local program for Laval residents." },
  longueuilEtBrossardArea: { met: () => ["Longueuil", "Brossard"].includes(answers.city), fixed: true, unmet: "This is a local program for Longueuil et Brossard residents." },
  terrebonne: { met: () => answers.city === "Terrebonne", fixed: true, unmet: "This is a local program for Terrebonne residents." },
  villeDeQuBec: { met: () => answers.city === "Ville de Qu\u00e9bec", fixed: true, unmet: "This is a local program for Ville de Québec residents." },
  gatineau: { met: () => answers.city === "Gatineau", fixed: true, unmet: "This is a local program for Gatineau residents." },
  sherbrooke: { met: () => answers.city === "Sherbrooke", fixed: true, unmet: "This is a local program for Sherbrooke residents." },
  troisRiviRes: { met: () => answers.city === "Trois-Rivi\u00e8res", fixed: true, unmet: "This is a local program for Trois-Rivières residents." },
  stJohnS: { met: () => answers.city === "St. John's", fixed: true, unmet: "This is a local program for residents of the capital city." },
  stJohnSArea: { met: () => ["St. John's", "Mount Pearl"].includes(answers.city), fixed: true, unmet: "This is a local program for residents of the capital city and Mount Pearl." },
  paradise: { met: () => answers.city === "Paradise", fixed: true, unmet: "This is a local program for Paradise residents." },
  cornerBrook: { met: () => answers.city === "Corner Brook", fixed: true, unmet: "This is a local program for Corner Brook residents." },
  bridgewater: { met: () => answers.city === "Bridgewater", fixed: true, unmet: "This is a local program for Bridgewater residents." },
  moncton: { met: () => answers.city === "Moncton", fixed: true, unmet: "This is a local program for Moncton residents." },
  dieppe: { met: () => answers.city === "Dieppe", fixed: true, unmet: "This is a local program for Dieppe residents." },
  fredericton: { met: () => answers.city === "Fredericton", fixed: true, unmet: "This is a local program for Fredericton residents." },
  saintJohn: { met: () => answers.city === "Saint John", fixed: true, unmet: "This is a local program for Saint John residents." },
  brandon: { met: () => answers.city === "Brandon", fixed: true, unmet: "This is a local program for Brandon residents." },
  winnipeg: { met: () => answers.city === "Winnipeg", fixed: true, unmet: "This is a local program for Winnipeg residents." },
  swiftCurrent: { met: () => answers.city === "Swift Current", fixed: true, unmet: "This is a local program for Swift Current residents." },
  regina: { met: () => answers.city === "Regina", fixed: true, unmet: "This is a local program for Regina residents." },
  saskatoon: { met: () => answers.city === "Saskatoon", fixed: true, unmet: "This is a local program for Saskatoon residents." },
  northBattleford: { met: () => answers.city === "North Battleford", fixed: true, unmet: "This is a local program for North Battleford residents." },
  mooseJaw: { met: () => answers.city === "Moose Jaw", fixed: true, unmet: "This is a local program for Moose Jaw residents." },
  princeAlbert: { met: () => answers.city === "Prince Albert", fixed: true, unmet: "This is a local program for Prince Albert residents." },
  yorkton: { met: () => answers.city === "Yorkton", fixed: true, unmet: "This is a local program for Yorkton residents." },
  brantford: { met: () => answers.city === "Brantford", fixed: true, unmet: "This is a local program for Brantford residents." },
  dawsonCreek: { met: () => answers.city === "Dawson Creek", fixed: true, unmet: "This is a local program for Dawson Creek residents." },
  highRiver: { met: () => answers.city === "High River", fixed: true, unmet: "This is a local program for High River residents." },
  langley: { met: () => answers.city === "Langley", fixed: true, unmet: "This is a local program for Langley residents." },
  morinville: { met: () => answers.city === "Morinville", fixed: true, unmet: "This is a local program for Morinville residents." },
  nelson: { met: () => answers.city === "Nelson", fixed: true, unmet: "This is a local program for Nelson residents." },
  portCoquitlam: { met: () => answers.city === "Port Coquitlam", fixed: true, unmet: "This is a local program for Port Coquitlam residents." },
  sarnia: { met: () => answers.city === "Sarnia", fixed: true, unmet: "This is a local program for Sarnia residents." },
  taber: { met: () => answers.city === "Taber", fixed: true, unmet: "This is a local program for Taber residents." },
  westVancouver: { met: () => answers.city === "West Vancouver", fixed: true, unmet: "This is a local program for West Vancouver residents." },
  banff: { met: () => answers.city === "Banff", fixed: true, unmet: "This is a local program for Banff residents." },
  blackfalds: { met: () => answers.city === "Blackfalds", fixed: true, unmet: "This is a local program for Blackfalds residents." },
  chestermere: { met: () => answers.city === "Chestermere", fixed: true, unmet: "This is a local program for Chestermere residents." },
  draytonValley: { met: () => answers.city === "Drayton Valley", fixed: true, unmet: "This is a local program for Drayton Valley residents." },
  edson: { met: () => answers.city === "Edson", fixed: true, unmet: "This is a local program for Edson residents." },
  rockyMountainHouse: { met: () => answers.city === "Rocky Mountain House", fixed: true, unmet: "This is a local program for Rocky Mountain House residents." },
  strathmore: { met: () => answers.city === "Strathmore", fixed: true, unmet: "This is a local program for Strathmore residents." },
  whitecourt: { met: () => answers.city === "Whitecourt", fixed: true, unmet: "This is a local program for Whitecourt residents." },
  belleville: { met: () => answers.city === "Belleville", fixed: true, unmet: "This is a local program for Belleville residents." },
  chathamKent: { met: () => answers.city === "Chatham-Kent", fixed: true, unmet: "This is a local program for Chatham-Kent residents." },
  cornwall: { met: () => answers.city === "Cornwall", fixed: true, unmet: "This is a local program for Cornwall residents." },
  peterborough: { met: () => answers.city === "Peterborough", fixed: true, unmet: "This is a local program for Peterborough residents." },
  campbellRiver: { met: () => answers.city === "Campbell River", fixed: true, unmet: "This is a local program for Campbell River residents." },
  colwoodArea: { met: () => ["Colwood", "Langford"].includes(answers.city), fixed: true, unmet: "This is a local program for Colwood residents." },
  courtenayArea: { met: () => ["Courtenay", "Comox"].includes(answers.city), fixed: true, unmet: "This is a local program for Courtenay residents." },
  cranbrook: { met: () => answers.city === "Cranbrook", fixed: true, unmet: "This is a local program for Cranbrook residents." },
  duncan: { met: () => answers.city === "Duncan", fixed: true, unmet: "This is a local program for Duncan residents." },
  mission: { met: () => answers.city === "Mission", fixed: true, unmet: "This is a local program for Mission residents." },
  penticton: { met: () => answers.city === "Penticton", fixed: true, unmet: "This is a local program for Penticton residents." },
  pittMeadows: { met: () => answers.city === "Pitt Meadows", fixed: true, unmet: "This is a local program for Pitt Meadows residents." },
  portMoody: { met: () => answers.city === "Port Moody", fixed: true, unmet: "This is a local program for Port Moody residents." },
  princeRupert: { met: () => answers.city === "Prince Rupert", fixed: true, unmet: "This is a local program for Prince Rupert residents." },
  quesnel: { met: () => answers.city === "Quesnel", fixed: true, unmet: "This is a local program for Quesnel residents." },
  squamish: { met: () => answers.city === "Squamish", fixed: true, unmet: "This is a local program for Squamish residents." },
  terrace: { met: () => answers.city === "Terrace", fixed: true, unmet: "This is a local program for Terrace residents." },
  whiteRock: { met: () => answers.city === "White Rock", fixed: true, unmet: "This is a local program for White Rock residents." },
  abbotsford: { met: () => answers.city === "Abbotsford", fixed: true, unmet: "This is a City of Abbotsford program." },
  mapleRidge: { met: () => answers.city === "Maple Ridge", fixed: true, unmet: "This is a City of Maple Ridge program." },
  nanaimo: { met: () => answers.city === "Nanaimo", fixed: true, unmet: "This is a City of Nanaimo program." },
  newWestminster: { met: () => answers.city === "New Westminster", fixed: true, unmet: "This is a City of New Westminster program." },
  princeGeorge: { met: () => answers.city === "Prince George", fixed: true, unmet: "This is a City of Prince George program." },
  burnaby: { met: () => answers.city === "Burnaby", fixed: true, unmet: "This is a City of Burnaby program." },
  richmondbc: { met: () => answers.city === "Richmond", fixed: true, unmet: "This is a City of Richmond program." },
  victoria: { met: () => answers.city === "Victoria", fixed: true, unmet: "This is a City of Victoria program." },
  saanich: { met: () => answers.city === "Saanich", fixed: true, unmet: "This is a District of Saanich program." },
  kelowna: { met: () => answers.city === "Kelowna", fixed: true, unmet: "This is a City of Kelowna program." },
  coquitlam: { met: () => answers.city === "Coquitlam", fixed: true, unmet: "This is a City of Coquitlam program." },
  kamloops: { met: () => answers.city === "Kamloops", fixed: true, unmet: "This is a City of Kamloops program." },
  cityOther: {
    // Anywhere we DON'T have a verified municipal program → the 2-1-1 finder.
    // Add a city here the moment you add its program, or people get the generic
    // fallback instead of the real thing.
    met: () => !!answers.city && !CITIES_WITH_PROGRAMS.includes(answers.city),
    fixed: true,
    unmet: "For communities without their own listed program.",
  },
};

/* ── Browse targeting maps ────────────────────────────────────────────────────
   Derive these from the requirement registry itself so browse ordering follows
   the eligibility gates instead of a second hand-maintained tag table. The gate
   helpers that test membership are `hasDisability` and `hasFunctionalNeed`;
   `Array#some(hasDisability)` is also used by skCognitiveDisability.

   Only literal positive membership checks are safe to infer. Negated checks are
   ignored, and syntax this small parser does not recognize simply leaves a gate
   unmapped (the safe "applies to any" browse default). The three original browse
   mappings remain explicit overrides and win over anything derived. */
const BROWSE_NEEDS = [
  "transitBarrier", "equipment", "nutrition", "medicalTravel", "communication",
  "memorySafety", "sensory", "homeAccess", "careCoordination", "fatiguePain",
];
const BROWSE_NEED_LABEL_KEYS = {
  transitBarrier: "browse.need.transitBarrier",
  equipment: "browse.need.equipment",
  nutrition: "browse.need.nutrition",
  medicalTravel: "browse.need.medicalTravel",
  communication: "browse.need.communication",
  memorySafety: "browse.need.memorySafety",
  sensory: "browse.need.sensory",
  homeAccess: "browse.need.homeAccess",
  careCoordination: "browse.need.careCoordination",
  fatiguePain: "browse.need.fatiguePain",
};
function positiveLiteralHelperValues(source, helper) {
  const out = new Set();
  const direct = new RegExp(`${helper}\\(\\s*(["'])([^"']+)\\1\\s*\\)`, "g");
  for (const match of source.matchAll(direct)) {
    const prefix = source.slice(0, match.index);
    if (!/!\s*(?:\(\s*)*$/.test(prefix)) out.add(match[2]);
  }
  const some = new RegExp(`\\[([^\\]]*)\\]\\.some\\(\\s*${helper}\\s*\\)`, "g");
  for (const match of source.matchAll(some)) {
    for (const literal of match[1].matchAll(/(["'])([^"']+)\1/g)) out.add(literal[2]);
  }
  return [...out];
}
function deriveBrowseRequirementMaps() {
  const disabilities = {};
  const needs = {};
  for (const [gate, req] of Object.entries(REQS)) {
    if (typeof req.met !== "function") continue;
    const source = req.met.toString();
    const gateDisabilities = positiveLiteralHelperValues(source, "hasDisability")
      .filter((value) => value !== "other");
    const gateNeeds = positiveLiteralHelperValues(source, "hasFunctionalNeed")
      .filter((value) => BROWSE_NEEDS.includes(value));
    if (gateDisabilities.length) disabilities[gate] = gateDisabilities;
    if (gateNeeds.length) needs[gate] = gateNeeds;
  }
  return { disabilities, needs };
}
const DERIVED_BROWSE_MAPS = deriveBrowseRequirementMaps();
const DIS_BY_REQ = {
  ...DERIVED_BROWSE_MAPS.disabilities,
  mobility: ["physical", "vision"],
  equipmentNeed: EQUIP_NEED,
  developmental: ["intellectual", "autism"],
};
const NEED_BY_REQ = DERIVED_BROWSE_MAPS.needs;

/* some benefit URLs are functions of the answers (province-specific) */
const resolveUrl = (u) => (typeof u === "function" ? u(answers) : u);

/* Province-scoped directories must never leak Alberta-only resources into a BC
   journey (or vice versa). National entries use CA and remain visible in both. */
function coverageApplies(record, province = answers.province) {
  const coverage = Array.isArray(record && record.coverage) ? record.coverage : [];
  if (!province || !["AB", "BC", "ON", "SK", "MB", "NB", "NS", "PE", "NL", "QC"].includes(province)) return true;
  return coverage.includes("CA") || coverage.includes(province);
}

function coverageLabel(record) {
  const coverage = Array.isArray(record && record.coverage) ? record.coverage : [];
  if (coverage.includes("CA")) return "Canada-wide";
  if (coverage.includes("BC")) return "British Columbia";
  if (coverage.includes("ON")) return "Ontario";
  if (coverage.includes("SK")) return "Saskatchewan";
  if (coverage.includes("MB")) return "Manitoba";
  if (coverage.includes("NB")) return "New Brunswick";
  if (coverage.includes("NS")) return "Nova Scotia";
  if (coverage.includes("PE")) return "Prince Edward Island";
  if (coverage.includes("NL")) return "Newfoundland and Labrador";
  if (coverage.includes("QC")) return "Quebec";
  if (coverage.includes("AB")) return "Alberta";
  return "Check service area";
}

/* format the structured value model into a money-forward headline + sub-line */
function valueParts(b) {
  const v = BENEFIT_VALUES[b.id];
  if (!v) return { head: b.amount, sub: "", est: false };
  if (v.excludeFromEstimate) return { head: b.amount, sub: "", est: false };
  const m = (n) => "$" + Number(n).toLocaleString("en-CA", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  let head = "";
  if (["services", "coverage", "access", "discount"].includes(v.kind)) {
    head = v.note || b.amount;
  } else if (v.monthlyMin && v.monthlyMax && v.monthlyMin !== v.monthlyMax) {
    head = `${m(v.monthlyMin)}–${m(v.monthlyMax)} / month`;
  } else if (v.annualMax) {
    const range = v.annualMin && v.annualMin !== v.annualMax ? `${m(v.annualMin)}–${m(v.annualMax)}` : `Up to ${m(v.annualMax)}`;
    if (v.kind === "taxCredit") head = `≈ ${range} / year`;
    else { head = `${range} / year`; if (v.monthlyMax) head += ` (${m(v.monthlyMax)}/mo)`; }
  } else if (v.monthlyMax) {
    head = `Up to ${m(v.monthlyMax)} / month`;
  } else head = v.note || b.amount;

  const subs = [];
  if (v.kind === "taxCredit" && v.note) subs.push(v.note);
  if (v.lifetimeMax) subs.push(`up to ${m(v.lifetimeMax)} lifetime`);
  const cash = ["cash", "taxCredit", "grant"].includes(v.kind);
  return { head, sub: subs.join(" · "), est: cash };
}

const money = (n) => "$" + Math.round(n).toLocaleString("en-CA");

function difficultyInfo(d) {
  d = d || 3;
  const label = d <= 2 ? "Easy" : d === 3 ? "Medium" : "Hard";
  const cls = d <= 2 ? "easy" : d === 3 ? "med" : "hard";
  return { label, cls, dots: "●".repeat(d) + "○".repeat(5 - d) };
}
function metaRow(b) {
  const meta = BENEFIT_META[b.id];
  if (!meta) return "";
  const di = difficultyInfo(meta.difficulty);
  return `<div class="bmeta">
    <span class="bm-diff ${di.cls}"><span class="dots">${di.dots}</span>${di.label}</span>
    ${meta.effort ? `<span class="bm"><b>Apply:</b> ${meta.effort}</span>` : ""}
    ${meta.wait ? `<span class="bm"><b>Wait:</b> ${meta.wait}</span>` : ""}
  </div>`;
}
/*
 * This is an editorial ordering aid, not an official recommendation or a
 * substitute for urgency or deadlines. The score combines an ease term derived
 * from BENEFIT_META.difficulty (the documented scale is 1 for easy through 5
 * for hard) with a value term derived from BENEFIT_VALUES. The final calculation
 * is value * 1.4 + ease.
 *
 * All eight constants in that calculation and its inputs — 6, 1000, 14, 100,
 * 12000, 8, 3 and 1.4 — are editorial. They were chosen by hand, no rationale
 * for them is recorded anywhere in this repository, and they have never been
 * validated against representative user profiles.
 *
 * That choice has a visible consequence in the current catalogue. Ease spans
 * only 1–5, while the weighted value contribution reaches about 19.6, so any
 * programme with a dollar value outranks programmes scored on ease alone. 86%
 * of the catalogue scores on ease alone, which means the former ease-only claim
 * describes the bulk of the list but not its top. cpp-disability is the worked
 * example: it has the hardest difficulty (5), giving it ease 1, yet ranks third
 * overall.
 *
 * Validating or replacing these weights is the remaining work for TaskView #68.
 * Before any re-weighting, the owner must specify a representative profile set,
 * recorded hypotheses, a validation method and an objective threshold. The
 * DATA-51 guard inside the function is part of this boundary: values flagged
 * excludeFromEstimate are display-only and deliberately do not shift ordering,
 * and wiring value into priority was deferred to this work.
 */
function priorityScore(b) {
  const v = BENEFIT_VALUES[b.id] || {};
  const meta = BENEFIT_META[b.id] || {};
  const ease = 6 - (meta.difficulty || 3);
  // DATA-51: values flagged excludeFromEstimate are typed for display only and
  // must not shift priority ordering; wiring value into priority is deferred to
  // the priority/UX work. This preserves todays ordering exactly (dtc/aish/adap
  // already scored ease-only, and BC benefits had no entry = ease-only).
  if (v.excludeFromEstimate) return ease;
  let value = 0;
  if (v.annualMax) value += Math.min(v.annualMax / 1000, 14);
  else if (v.monthlyMax) value += Math.min(v.monthlyMax / 100, 14);
  if (v.lifetimeMax) value += Math.min(v.lifetimeMax / 12000, 8);
  if (["services", "coverage"].includes(v.kind)) value += 3;
  return value * 1.4 + ease;
}

function renderMoneyBand(ready, almost) {
  if (!ready.length && !almost.length) return "";

  // Only READY benefits can contribute a figure. Conditional matches have at
  // least one unanswered gate, so neither annual nor lifetime values are shown.
  const readyVals = ready.map((e) => BENEFIT_VALUES[e.b.id]).filter(Boolean);
  const annualTotal = readyVals.filter((v) => ["cash", "grant", "taxCredit"].includes(v.kind) && !v.excludeFromEstimate && v.annualMax).reduce((s, v) => s + v.annualMax, 0);
  const lifetime = readyVals.find((v) => v.lifetimeMax && !v.excludeFromEstimate);
  const round100 = (n) => Math.round(n / 100) * 100;
  const extras = [];
  if (lifetime) extras.push(t("mb.lifetime").replace("{amount}", money(lifetime.lifetimeMax)));

  if (annualTotal > 0) {
    return `
  <div class="money-band">
    <div class="mb-head">
      <span class="mb-badge">${icon("money")}</span>
      <div>
        <div class="mb-total">${t("mb.upTo").replace("{amount}", `<b>~${money(round100(annualTotal))}</b>`)}</div>
        <div class="mb-sub">${t("mb.readySub")}${extras.length ? " · " + extras.join(" · ") : ""}</div>
      </div>
    </div>
    ${matchStatusNote("ready")}
    <p class="mb-caveat">${t("mb.caveat")}</p>
  </div>`;
  }

  // No figure to show: render nothing. An empty "no estimate" band only added
  // reading load above the programs (site audit 2026-10, DECISION.md).
  return "";
}

/* Apply-button text. A record without its own label gets one that is always
   true: where the link goes, not a promise that it opens an application form
   (site audit 2026-10, C-CONTENT-TRUST P2-16). */
function applyLabel(b) {
  if (b.applyText) return b.applyText;
  try {
    const host = new URL(resolveUrl(b.applyUrl)).hostname.replace(/^www2?\./, "");
    return `Open the official page on ${host}`;
  } catch { return t("af.applyGeneric"); }
}

/* "Abbreviations on this page": GLOSSARY terms that appear in this program's
   text (data.js glossaryTermsFor). Closed by default; English-only. */
function glossaryBlock(b) {
  const terms = typeof glossaryTermsFor === "function" ? glossaryTermsFor(b) : [];
  if (!terms.length) return "";
  return `<details class="guide-block guide-glossary" lang="en"><summary><h2 class="guide-h">Abbreviations on this page</h2></summary><dl class="glossary-list">${terms.map(([a, e]) => `<div><dt><abbr title="${reqEscape(e)}">${reqEscape(a)}</abbr></dt><dd>${reqEscape(e)}</dd></div>`).join("")}</dl></details>`;
}

/* Time-limited program badge (BENEFIT_STATUS in data.js). English-only copy. */
function statusBadge(b) {
  const s = typeof BENEFIT_STATUS !== "undefined" && BENEFIT_STATUS[b.id];
  if (!s) return "";
  return `<p class="status-badge status-${reqEscape(s.kind)}" lang="en">${reqEscape(s.text)}</p>`;
}

/* -------------------------------------------------------------- engine */
function evaluate(benefit, scopedConfirmations = confirmedFacts) {
  let checkedFacts = false;
  const needs = [];
  const reasons = [];
  for (const key of benefit.requires) {
    const req = REQS[key];
    // Fail closed: a requirement key with no definition (a typo in data.js)
    // must never silently drop a gate and produce a false "Matches your answers".
    if (!req) {
      console.error(`AbilityFinder: unknown requirement "${key}" on ${benefit.id}`);
      needs.push({ key, text: "We could not check one requirement. Read the official page to confirm." });
      continue;
    }
    if (req.met()) continue;
    const fixed = typeof req.fixed === "function" ? req.fixed() : req.fixed;
    if (!fixed && AbilityFinderState.confirmedGatePasses(benefit.id, key, scopedConfirmations)) {
      checkedFacts = true;
      continue;
    }
    if (fixed) {
      reasons.push(typeof req.unmet === "function" ? req.unmet() : req.unmet);
    } else {
      let text = typeof req.unmet === "function" ? req.unmet() : req.unmet;
      if (key === "dtc" && answers.dtc === "unsure") {
        text = "This needs Disability Tax Credit approval. If you are not sure whether you have it, check your CRA account or apply.";
      }
      const useCue = !(key === "dtc" && answers.dtc === "unsure");
      needs.push({ key, text, action: req.action, lang: req.lang,
        short: useCue ? req.short : undefined, who: useCue ? req.who : undefined });
    }
  }
  if (reasons.length) return { status: "no", needs, reasons };
  if (needs.length) return { status: "almost", needs, reasons };
  return { status: "ready", needs, reasons, checkedFacts };
}

/* =============================================================================
   WIZARD STEPS  (questions only — the intro is now the landing page)
   ========================================================================== */
const STEPS = [
  {
    id: "forWho", type: "single", kicker: "Getting started",
    q: "Who are we finding benefits for?",
    help: "This tailors everything to the right person.",
    key: "forWho",
    options: [
      { value: "self", label: "Myself" },
      { value: "child", label: "My child" },
      { value: "family", label: "Another family member", sub: "a partner, parent, sibling or someone you care for" },
    ],
    onPick(v, previous) {
      // Relationship does not establish age. A person's child may be 4, 14, or
      // 40, and the exact band materially changes eligibility.
      if (previous !== v) {
        answers.ageBand = null;
        answers.ageGroup = null;
        answers.situation = [];
        answers.functionalNeeds = [];
      }
    },
  },
  {
    id: "disabilities", type: "multi", kicker: "Your disability",
    q: () => (answers.forWho === "self" ? "Which of these apply to you?" : `Which of these apply to ${subj()}?`),
    help: "Pick all that fit — you can choose more than one. This is private and never leaves your browser.",
    sideNote: {
      topic: "disabilities",
      label: "Not sure which one to pick?",
      sub: "You don't need a diagnosis — read this first",
    },
    key: "disabilities",
    options: DISABILITIES,
  },
  {
    id: "age", type: "single", kicker: "Age",
    q: () => (answers.forWho === "self" ? "How old are you?" : `How old is ${subj()}?`),
    help: "Choose the closest range. These eight cutoffs keep child, transition-age, adult and senior programs from being mixed together.",
    key: "ageBand",
    options: AGE_BANDS,
    onPick(v, previous) {
      answers.ageGroup = ageGroupForBand(v);
      if (previous !== v) {
        answers.situation = [];
        answers.functionalNeeds = [];
      }
    },
  },
  {
    id: "disabilityVerified", type: "single", kicker: "Documentation",
    q: () => `Has a qualified professional documented ${poss()} disability or functional limitation?`,
    help: "This does not decide whether someone is disabled. It prevents programs that require professional verification from being shown as ready before that step is complete.",
    sideNote: {
      topic: "documentation",
      label: "Not sure what counts as documented?",
      sub: "See which records count and how to check",
    },
    key: "disabilityVerified",
    options: [
      { value: "yes", label: "Yes, it is documented" },
      { value: "no", label: "No, not yet" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "autismDiagnosis", type: "single", kicker: "A required detail",
    q: () => answers.forWho === "self"
      ? "Do you have an autism diagnosis that meets provincial assessment standards?"
      : `Does ${subj()} have an autism diagnosis that meets provincial assessment standards?`,
    help: "A diagnosis is required for the current BC Autism Funding programs. It does not guarantee approval for other benefits.",
    sideNote: {
      topic: "autismAssessment",
      label: "Not sure whether the assessment counts?",
      sub: "See what document to look for",
    },
    key: "autismDiagnosis",
    skipIf: () => !hasDisability("autism"),
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No / not yet" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    // DYNAMIC — only if autism / intellectual selected (drives PDD eligibility)
    id: "onset", type: "single", kicker: "A bit more",
    q: "Did this begin before age 18?",
    help: "Some provincial programs (like PDD in Alberta) are specifically for developmental disabilities that started in childhood.",
    key: "onsetBefore18",
    skipIf: () => !(hasDisability("autism") || hasDisability("intellectual")),
    options: [
      { value: true, label: "Yes, it began in childhood" },
      { value: false, label: "No, it started as an adult" },
    ],
  },
  {
    // DYNAMIC — only if a physical/mobility condition is selected
    id: "mobilityQ", type: "single", kicker: "A bit more",
    q: () => `${who().canQ} comfortably walk about 50 metres (half a block)?`,
    help: () => `This helps show whether an accessible parking placard may apply to ${who().them}. The program decides.`,
    key: "canWalkFar",
    skipIf: () => !hasDisability("physical"),
    options: [
      { value: true, label: "Yes, usually fine" },
      { value: false, label: "No, that's difficult or impossible" },
    ],
  },
  {
    id: "functionalNeeds", type: "multi", kicker: "How daily life is affected",
    q: () => `Which of these are true for ${subj()}?`,
    help: "Pick only what applies. These functional details are more important than a diagnosis for many programs.",
    sideNote: {
      topic: "functionalNeeds",
      label: "Not sure which daily-life answer fits?",
      sub: "Read plain examples before deciding",
    },
    key: "functionalNeeds",
    options: () => {
      const childOptions = isUnder18() ? [
        { value: "childHighNeeds", icon: "family", label: "Has very high or complex developmental support needs" },
        { value: "childThreeAdls", icon: "help", label: "Depends on help with at least 3 of eating, dressing, toileting and washing" },
      ] : [];
      const adultOptions = ageIn("18", "19to59", "60to64", "65plus") ? [
        { value: "dailyLiving", icon: "help", label: "Needs significant help, supervision, an assistive device or service animal for daily activities" },
      ] : [];
      return [
        ...childOptions,
        ...adultOptions,
        { value: "transitBarrier", icon: "transit", label: "Cannot use regular public transit without assistance for some or all trips" },
        { value: "equipment", icon: "health", label: "Needs disability-related medical equipment or supplies" },
        { value: "nutrition", icon: "health", label: "Needs a medically prescribed special diet or nutritional products" },
        { value: "medicalTravel", icon: "transit", label: "Must travel outside the community for essential medical care" },
        { value: "communication", icon: "speech", label: "Needs help communicating, understanding others, or being understood" },
        { value: "memorySafety", icon: "braininjury", label: "Needs prompting or supervision because memory, judgment, or safety is affected" },
        { value: "sensory", icon: "autism", label: "Needs sensory or behavioural support to take part safely in daily activities" },
        { value: "homeAccess", icon: "physical", label: "Needs disability-related changes to the home for access or safety" },
        { value: "careCoordination", icon: "compass", label: "Needs help organizing medication, appointments, forms, or services" },
        { value: "fatiguePain", icon: "chronic", label: "Pain, fatigue, seizures, or changing symptoms regularly limit daily activities" },
        { value: "none", icon: "none", label: "None of these" },
        { value: "unsure", icon: "help", label: "I'm not sure" },
      ];
    },
    exclusive: ["none", "unsure"],
  },
  {
    id: "residency", type: "single", kicker: "About you",
    q: () => BC_ENABLED ? `Where ${who().doQ.toLowerCase()} live?` : `${who().doQ} live in Alberta?`,
    help: SCOPE_RESIDENCY_HELP,
    key: "province",
    options: [
      { value: "AB", label: BC_ENABLED ? "Alberta" : "Yes, I live in Alberta" },
      ...(BC_ENABLED ? [{ value: "BC", label: "British Columbia" }] : []),
      ...(ON_ENABLED ? [{ value: "ON", label: "Ontario" }] : []),
      ...(SK_ENABLED ? [{ value: "SK", label: "Saskatchewan" }] : []),
      ...(MB_ENABLED ? [{ value: "MB", label: "Manitoba" }] : []),
      ...(NB_ENABLED ? [{ value: "NB", label: "New Brunswick" }] : []),
      ...(NS_ENABLED ? [{ value: "NS", label: "Nova Scotia" }] : []),
      ...(PE_ENABLED ? [{ value: "PE", label: "Prince Edward Island" }] : []),
      ...(NL_ENABLED ? [{ value: "NL", label: "Newfoundland and Labrador" }] : []),
      ...(QC_ENABLED ? [{ value: "QC", label: "Quebec" }] : []),
      { value: "other", label: BC_ENABLED ? "Another province or territory" : "No, another province or territory", sub: "you'll still see the Canada-wide programs in our catalog" },
    ],
    onPick(v) {
      // a city from another province is no longer valid
      if (!(CITIES_BY_PROVINCE[v] || []).includes(answers.city)) answers.city = null;
    },
  },
  {
    id: "msp", type: "single", kicker: "British Columbia health coverage",
    q: () => `Is ${subj()} enrolled in B.C.'s Medical Services Plan (MSP)?`,
    help: "Fair PharmaCare and the At Home Program require MSP enrolment.",
    sideNote: {
      topic: "msp",
      label: "Not sure whether MSP is active?",
      sub: "How to check your B.C. coverage",
    },
    key: "msp",
    skipIf: () => answers.province !== "BC",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "bcAssistance", type: "single", kicker: "British Columbia assistance",
    q: () => `Which B.C. assistance status applies to ${subj()}?`,
    help: "Several health, transport and income programs require an existing assistance status. Pick the closest answer; each guide lists the full exceptions.",
    sideNote: {
      topic: "bcAssistance",
      label: "Not sure which assistance status applies?",
      sub: "Understand PWD and where to check",
    },
    key: "bcAssistance",
    skipIf: () => answers.province !== "BC",
    options: [
      { value: "pwd", label: "PWD designation or disability assistance" },
      { value: "other", label: "Other qualifying assistance, care or protected status" },
      { value: "none", label: "None of these" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "circumstances", type: "multi", kicker: "A few specific programs",
    q: () => `Which of these are true for ${subj()}?`,
    help: "These answers prevent vehicle, property and recent-graduate programs from appearing when they cannot apply.",
    sideNote: {
      topic: "circumstances",
      label: "Not sure about ownership or dates?",
      sub: "See exactly what each choice is asking",
    },
    key: "circumstances",
    skipIf: () => answers.province !== "BC",
    options: [
      { value: "homeowner", icon: "family", label: "Owns and lives in a home" },
      { value: "vehicleOwner", icon: "transit", label: "Owns, leases or has an ownership interest in a vehicle" },
      { value: "recentGraduate", icon: "student", label: "Graduated from post-secondary within the last 3 years" },
      { value: "none", icon: "none", label: "None of these" },
      { value: "unsure", icon: "help", label: "I'm not sure" },
    ],
    exclusive: ["none", "unsure"],
  },
  {
    id: "citizen", type: "single", kicker: "About you",
    q: () => `${who().areQ} a Canadian citizen or permanent resident?`,
    help: "Most government benefits require this.",
    key: "citizenPR",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No / not yet" },
    ],
  },
  {
    id: "dtc", type: "single", kicker: "A federal tax credit",
    q: () => `${who().areQ} approved for the Disability Tax Credit (DTC)?`,
    help: "DTC approval is required for several federal programs, but not for every disability benefit. If you don't have it, we'll show you the official application guide.",
    key: "dtc",
    options: () => [
      { value: "yes", label: answers.forWho === "self" ? "Yes, I'm approved" : "Yes, approved" },
      { value: "no", label: "No, not yet" },
      { value: "unsure", label: "I'm not sure what that is" },
    ],
    // Answering "not sure" and moving on costs someone the single biggest
    // benefit in the app. Give them a way to actually find out, right here.
    sideNote: {
      topic: "dtc",
      label: "Not sure if you have it?",
      sub: "How to check in 2 minutes",
    },
  },
  {
    // Site audit 2026-10 ("already get" question). Presentation only: a program the person says
    // they already get is listed as "You already get this" instead of as a
    // program to check. It never changes evaluate() or any other match.
    id: "receives", type: "multi", kicker: "Benefits you already get",
    q: () => `${who().doQ} already get any of these?`,
    help: "Optional — you can skip this. Programs you already get are listed as “You already get this” instead of as something to check. This does not change any other result.",
    key: "receives",
    optional: true,
    keepsFacts: true,
    skipIf: () => answers.ageGroup === "child",
    options: () => [
      ...receivesChoices(answers.province).map((o) => ({ value: o.value, icon: "money", label: o.label })),
      { value: "none", icon: "none", label: "None of these" },
      { value: "unsure", icon: "help", label: "I'm not sure" },
    ],
    exclusive: ["none", "unsure"],
  },
  {
    id: "situation", type: "multi", kicker: "Your situation",
    q: () => `What best describes ${subj()} right now?`,
    help: "Pick all that apply — this opens up work & school supports.",
    key: "situation",
    options: () => {
      // A pre-v39 in-progress session can contain the old broad child age but
      // no exact age band. Never fall through to adult-only choices while that
      // session is being repaired; give it regular-school choices and route the
      // person back to the missing age question on restore (see loadState()).
      if (!answers.ageBand && answers.ageGroup === "child") return [
        { value: "childcare", icon: "family", label: "In child care or preschool" },
        { value: "elementary", icon: "student", label: "In elementary or middle school" },
        { value: "secondary", icon: "student", label: "In junior high or high school" },
        { value: "none", icon: "none", label: "Not currently in school or child care" },
      ];
      if (answers.ageBand === "under6") return [
        { value: "childcare", icon: "family", label: "In child care or preschool" },
        { value: "none", icon: "none", label: "Not in child care or preschool" },
      ];
      if (answers.ageBand === "6to11") return [
        { value: "elementary", icon: "student", label: "In elementary school" },
        { value: "none", icon: "none", label: "Not currently in school" },
      ];
      if (["12to15", "16to17"].includes(answers.ageBand)) {
        const teen = [
          { value: "secondary", icon: "student", label: "In junior high or high school" },
          { value: "working", icon: "working", label: "Working / have a job" },
          { value: "looking", icon: "looking", label: "Looking for work or training" },
          { value: "none", icon: "none", label: "None of these" },
        ];
        return answers.ageBand === "16to17"
          ? teen
          : teen.filter((option) => !["working", "looking"].includes(option.value));
      }
      const adultOptions = [
        ...(answers.ageBand === "18"
          ? [{ value: "secondary", icon: "student", label: "In junior high or high school" }]
          : answers.ageBand === "19to59"
            ? [{ value: "secondary", icon: "student", label: "Age 19 and still attending high school through grade 12" }]
            : []),
        { value: "student", icon: "student", label: "In post-secondary school" },
        { value: "working", icon: "working", label: "Working / have a job" },
        { value: "looking", icon: "looking", label: "Looking for work or training" },
        { value: "unableToWork", icon: "unable", label: () => `A disability stops ${answers.forWho === "self" ? "me" : subj()} from working` },
        { value: "none", icon: "none", label: "None of these" },
      ];
      return adultOptions;
    },
    exclusive: "none",
  },
  {
    id: "income", type: "single", kicker: "Your household",
    q: "Roughly, what's your household income?",
    help: "Some money benefits are for lower incomes. This rough category is saved only in your browser so your progress survives a reload; it is never sent to us.",
    key: "income",
    options: [
      { value: "low", label: "Lower income", sub: "Under ~$35,000" },
      { value: "moderate", label: "Middle income", sub: "~$35,000–$80,000" },
      { value: "high", label: "Higher income", sub: "Over ~$80,000" },
    ],
  },
  {
    id: "city", type: "select", kicker: "Your community",
    q: () => `Which city or town ${who().doQ.toLowerCase()} live in or near?`,
    help: "Unlocks local transit and recreation discounts. Start typing to find yours.",
    key: "city",
    placeholder: "Choose your city or town…",
    /* Skip when the province has no municipal list yet. Ontario went live with
       province-level records only, so CITIES_BY_PROVINCE.ON is empty; without this
       an Ontario resident was asked to choose a city from an empty dropdown and
       could not answer. Keyed on the list being empty rather than on the province
       name, so the step reappears by itself once Ontario municipalities are added. */
    skipIf: () =>
      !COVERED_PROVINCES.includes(answers.province) ||
      (answers.province === "BC" && !BC_ENABLED) ||
      (answers.province === "SK" && !SK_ENABLED) ||
      (answers.province === "MB" && !MB_ENABLED) ||
      (answers.province === "NB" && !NB_ENABLED) ||
      (answers.province === "NS" && !NS_ENABLED) ||
      (answers.province === "PE" && !PE_ENABLED) ||
      (answers.province === "NL" && !NL_ENABLED) ||
      (answers.province === "QC" && !QC_ENABLED) ||
      (CITIES_BY_PROVINCE[answers.province] || []).length === 0,
    options: ALBERTA_CITIES, // replaced at render time by the province's list
  },
];

/* the city list depends on the chosen province */
const stepOptions = (step) =>
  step.id === "city"
    ? (CITIES_BY_PROVINCE[answers.province] || [])
    // options may be a function so labels can address the right person
    : typeof step.options === "function"
      ? step.options()
      : step.options;

/* Choices for the "already get" question. Each value is the benefit record id.
   Province-specific programs are offered only for that province. */
const RECEIVES_OPTIONS = [
  { value: "aish", province: "AB", label: "AISH (Assured Income for the Severely Handicapped)" },
  { value: "adap", province: "AB", label: "ADAP (Alberta Disability Assistance Program)" },
  { value: "bc-disability-assistance-pwd", province: "BC", label: "B.C. disability assistance (PWD)" },
  { value: "odsp", province: "ON", label: "ODSP (Ontario Disability Support Program)" },
  { value: "sk-said", province: "SK", label: "SAID (Saskatchewan Assured Income for Disability)" },
  { value: "mb-supports-persons-disabilities", province: "MB", label: "Manitoba Supports for Persons with Disabilities (MSPD)" },
  { value: "mb-eia", province: "MB", label: "EIA (Employment and Income Assistance)" },
  { value: "nb-social-assistance", province: "NB", label: "Social Assistance (including Extended Benefits)" },
  { value: "nb-disability-support-program", province: "NB", label: "Disability Support Program" },
  { value: "ns-income-assistance", province: "NS", label: "Employment Support and Income Assistance (ESIA)" },
  { value: "ns-disability-support-program", province: "NS", label: "Disability Support Program (Flex or Independent Living Support)" },
  { value: "pe-social-assistance", province: "PE", label: "Social Assistance" },
  { value: "pe-accessability-supports", province: "PE", label: "AccessAbility Supports (including Assured Income)" },
  { value: "nl-income-support", province: "NL", label: "Income Support" },
  { value: "nl-disability-benefit", province: "NL", label: "Newfoundland and Labrador Disability Benefit" },
  { value: "qc-solidarite-sociale", province: "QC", label: "Programme de solidarité sociale" },
  { value: "qc-revenu-base", province: "QC", label: "Programme de revenu de base" },
  { value: "qc-aide-sociale", province: "QC", label: "Programme d’aide sociale" },
  { value: "cpp-disability", label: "CPP disability benefit" },
];
const receivesChoices = (province) => RECEIVES_OPTIONS.filter((o) => !o.province || o.province === province);
/* Benefit ids the answer model says the person already gets. Stale picks (a
   province or age change after answering) are dropped, never trusted. */
function receivedIds(model = answers) {
  if (model.ageGroup === "child" || !Array.isArray(model.receives)) return [];
  const allowed = new Set(receivesChoices(model.province).map((o) => o.value));
  return model.receives.filter((v) => allowed.has(v));
}

const visibleSteps = () => STEPS.filter((s) => !(s.skipIf && s.skipIf()));

const BROWSE_LEVELS = [
  { key: "all", label: "All levels" },
  { key: "Federal", label: "Federal" },
  { key: "Alberta", label: "Alberta" },
  { key: "British Columbia", label: "British Columbia" },
  ...(ON_ENABLED ? [{ key: "Ontario", label: "Ontario" }] : []),
  ...(SK_ENABLED ? [{ key: "Saskatchewan", label: "Saskatchewan" }] : []),
  ...(MB_ENABLED ? [{ key: "Manitoba", label: "Manitoba" }] : []),
  ...(NB_ENABLED ? [{ key: "New Brunswick", label: "New Brunswick" }] : []),
  ...(NS_ENABLED ? [{ key: "Nova Scotia", label: "Nova Scotia" }] : []),
  ...(PE_ENABLED ? [{ key: "Prince Edward Island", label: "Prince Edward Island" }] : []),
  ...(NL_ENABLED ? [{ key: "Newfoundland and Labrador", label: "Newfoundland and Labrador" }] : []),
  ...(QC_ENABLED ? [{ key: "Quebec", label: "Quebec" }] : []),
  { key: "local", label: "Local / city" },
];

const PROGRAM_CHANGE_DATA = typeof AbilityFinderProgramChanges !== "undefined" && typeof DATA_CHANGELOG !== "undefined"
  ? AbilityFinderProgramChanges.collect(DATA_CHANGELOG, CATALOGUE_INDEX.map(row => row[0]))
  // No feed means no notices or new baselines. Preserve existing review markers
  // during validation rather than rejecting them against a fabricated zero.
  : { watermark: Number.MAX_SAFE_INTEGER, changes: [] };
let programChanges = null;

const PERSISTENCE_SELECTIONS = {
  programChangeWatermark: PROGRAM_CHANGE_DATA.watermark,
  disabilities: DISABILITIES.map((item) => item.value),
  ageBands: AGE_BANDS.map((item) => item.value),
  situations: ["childcare", "elementary", "secondary", "student", "working", "looking", "unableToWork", "none"],
  functionalNeeds: ["childHighNeeds", "childThreeAdls", "dailyLiving", "transitBarrier", "equipment", "nutrition", "medicalTravel", "communication", "memorySafety", "sensory", "homeAccess", "careCoordination", "fatiguePain", "none", "unsure"],
  circumstances: ["homeowner", "vehicleOwner", "recentGraduate", "none", "unsure"],
  receives: [...RECEIVES_OPTIONS.map((o) => o.value), "none", "unsure"],
  provinces: STEPS.find((step) => step.key === "province").options.map((item) => item.value),
  cities: [...ALBERTA_CITIES, ...(BC_ENABLED ? BC_CITIES : []), ...(ON_ENABLED ? ON_CITIES : []), ...(SK_ENABLED ? SK_CITIES.filter((c) => !ALBERTA_CITIES.includes(c)) : []), ...(MB_ENABLED ? MB_CITIES : []), ...(NB_ENABLED ? NB_CITIES : []), ...(NS_ENABLED ? NS_CITIES : []), ...(PE_ENABLED ? PE_CITIES : []), ...(NL_ENABLED ? NL_CITIES : []), ...(QC_ENABLED ? QC_CITIES : [])],
  citiesByProvince: { AB: ALBERTA_CITIES, BC: BC_ENABLED ? BC_CITIES : [], ON: ON_ENABLED ? ON_CITIES : [], SK: SK_ENABLED ? SK_CITIES : [], MB: MB_ENABLED ? MB_CITIES : [], NB: NB_ENABLED ? NB_CITIES : [], NS: NS_ENABLED ? NS_CITIES : [], PE: PE_ENABLED ? PE_CITIES : [], NL: NL_ENABLED ? NL_CITIES : [], QC: QC_ENABLED ? QC_CITIES : [] },
  browseLevels: BROWSE_LEVELS.map((level) => level.key),
  browseNeeds: BROWSE_NEEDS,
  benefitIds: CATALOGUE_INDEX.map(row => row[0]),
  progressStages: STAGES.map((stage) => stage.key),
};

/* =============================================================================
   PERSISTENCE + HISTORY
   ========================================================================== */
const stateChanges = new AbilityFinderState.StateChangeEmitter();

function persistentState() {
  return AbilityFinderState.buildPersistedState({
    answers, confirmedFacts, view, stepIndex, detailId, detailFrom, progress, groupMode,
    browseQuery, browseTheme, browseLevel, browseDis, browseNeed, a11y, lang: LANG,
    helpTopic, helpReturnStep, programChanges,
    theme: document.documentElement.getAttribute("data-theme"), askConsent,
    validSelections: PERSISTENCE_SELECTIONS,
  });
}

async function saveState() {
  const saved = await AbilityFinderDB.saveState(persistentState());
  // Another tab saved a newer full snapshot. Never overwrite it with stale
  // answers: reload that authoritative record instead.
  if (!saved && AbilityFinderDB.lastWriteConflict) window.location.reload();
  return saved;
}

function notifyStateChange(reason) {
  stateChanges.emit(reason);
}

stateChanges.subscribe(() => { void saveState(); });

async function loadState() {
  // One-time import protects work saved by releases that used localStorage. The
  // manager deletes those legacy keys only after the IndexedDB write succeeds.
  await AbilityFinderDB.migrateLegacyState(undefined, (legacy) =>
    AbilityFinderState.sanitizeLegacyState(legacy, PERSISTENCE_SELECTIONS));
  const saved = await AbilityFinderDB.loadState({});
  const restored = AbilityFinderState.restorePersistedState(saved, {
    answers: BLANK(),
    theme: document.documentElement.getAttribute("data-theme") || "dark",
    validSelections: PERSISTENCE_SELECTIONS,
  });
  programChanges = restored.programChanges;
  answers = restored.answers;
  // v43 returns to the smaller tap-to-select age ranges. v42 also persisted the
  // derived band, so current sessions keep their progress without retaining the
  // exact age value that release briefly collected.
  answers.ageGroup = ageGroupForBand(answers.ageBand);
  view = restored.view;
  stepIndex = restored.stepIndex;
  detailId = restored.detailId;
  detailFrom = restored.detailFrom;
  helpTopic = restored.helpTopic;
  helpReturnStep = restored.helpReturnStep;
  confirmedFacts = restored.confirmedFacts;
  progress = restored.progress;
  groupMode = restored.groupMode;
  browseQuery = restored.browseQuery;
  browseTheme = restored.browseTheme;
  browseLevel = restored.browseLevel;
  browseDis = restored.browseDis;
  browseNeed = restored.browseNeed;
  a11y = restored.a11y;
  LANG = restored.lang;
  askConsent = restored.askConsent;
  document.documentElement.setAttribute("data-theme", restored.theme);

  // Drop unknown tracker stages and invalid guide IDs before either can render.
  for (const id in progress) if (!STAGE[progress[id]]) delete progress[id];
  if (view === "detail" && !CATALOGUE_INDEX.some(([id]) => id === detailId)) view = "results";
  // Older snapshots may not contain the current age band and functional answers.
  // Never render broad results from an incomplete legacy questionnaire.
  if (view === "results" && !wizardDone()) {
    const firstMissing = visibleSteps().findIndex((step) => !stepAnswered(step));
    view = "wizard";
    stepIndex = Math.max(0, firstMissing);
  } else {
    stepIndex = Math.min(stepIndex, Math.max(0, visibleSteps().length - 1));
    // Old in-progress sessions may point beyond questions added in a newer
    // release. Resume at the earliest unanswered question so a missing age band
    // can never produce adult situation options for a child.
    if (view === "wizard") {
      const firstMissing = visibleSteps().findIndex((step) => !stepAnswered(step));
      if (firstMissing >= 0 && stepIndex > firstMissing) stepIndex = firstMissing;
    }
  }
}

/* ---------------------------------------------------- accessibility engine */
function persistA11y() {
  notifyStateChange("accessibility-change");
}
function applyA11y() {
  document.documentElement.style.fontSize = `${Math.round(16 * a11y.fontScale)}px`;
  document.body.classList.toggle("a11y-spacing", a11y.spacing);
  document.body.classList.toggle("a11y-contrast", a11y.contrast);
  document.body.classList.toggle("a11y-links", a11y.links);
  document.body.classList.toggle("a11y-guide", a11y.guide);
  document.body.classList.toggle("a11y-nomotion", a11y.motion);
  // The Reduce-motion toggle can flip mid-session; re-evaluate reveals so
  // anything mid-animation is pinned visible immediately.
  if (typeof wireReveals === "function") wireReveals();
  // reflect toggle states in the panel
  document.querySelectorAll(".a11y-toggle").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(!!a11y[btn.dataset.toggle]));
  });
}

function wireAccessibility() {
  const fab = document.getElementById("a11yFab");
  const panel = document.getElementById("a11yPanel");
  const close = document.getElementById("a11yClose");
  if (!fab || !panel) return;

  let a11yLastFocus = null;
  const bgEls = () => [document.querySelector("header"), document.getElementById("app"), document.querySelector(".ask-wrap")].filter(Boolean);
  const focusables = () => Array.from(panel.querySelectorAll("button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])")).filter((el) => el.offsetParent !== null || el === document.activeElement);
  const openPanel = (open) => {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    if (open) {
      a11yLastFocus = document.activeElement;
      bgEls().forEach((el) => el.setAttribute("inert", ""));
      const f = focusables(); if (f.length) f[0].focus();
    } else {
      bgEls().forEach((el) => el.removeAttribute("inert"));
      if (a11yLastFocus && typeof a11yLastFocus.focus === "function") a11yLastFocus.focus(); else fab.focus();
      a11yLastFocus = null;
    }
  };
  fab.addEventListener("click", () => openPanel(panel.hidden));
  if (close) close.addEventListener("click", () => openPanel(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) openPanel(false); });
  panel.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = focusables(); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // text size
  panel.querySelectorAll("[data-size]").forEach((b) =>
    b.addEventListener("click", () => {
      const d = b.dataset.size;
      if (d === "up") a11y.fontScale = Math.min(1.6, a11y.fontScale + 0.1);
      else if (d === "down") a11y.fontScale = Math.max(0.9, a11y.fontScale - 0.1);
      else a11y.fontScale = 1;
      applyA11y();
      persistA11y();
    })
  );

  // toggles
  panel.querySelectorAll(".a11y-toggle").forEach((b) =>
    b.addEventListener("click", () => {
      const k = b.dataset.toggle;
      a11y[k] = !a11y[k];
      applyA11y();
      persistA11y();
    })
  );

  // read aloud
  const readBtn = document.getElementById("a11yRead");
  if (readBtn) readBtn.addEventListener("click", toggleReadAloud);

  // reset
  const reset = document.getElementById("a11yReset");
  if (reset)
    reset.addEventListener("click", () => {
      stopReadAloud();
      a11y = { fontScale: 1, spacing: false, contrast: false, links: false, guide: false, motion: false };
      applyA11y();
      persistA11y();
    });

  // reading guide follows the pointer
  const guide = document.getElementById("readingGuide");
  if (guide)
    window.addEventListener("mousemove", (e) => {
      if (a11y.guide) guide.style.top = `${e.clientY - guide.offsetHeight / 2}px`;
    });
}

/* --------- text-to-speech with per-sentence highlighting --------- */
let ttsUnits = [], ttsIndex = 0, ttsActive = false;

function ttsEscape(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
function attrEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
function splitSentences(text) {
  const m = text.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]*/g);
  return m ? m.map((s) => s.trim()).filter(Boolean) : [text.trim()];
}
function buildTtsUnits() {
  ttsUnits = [];
  const sel = "#app h1, #app h2, #app h3, #app p, #app li, #app .amount, #app .step-kicker, #app .eyebrow, #app .group-title";
  const els = [...document.querySelectorAll(sel)].filter((el) => el.offsetParent !== null && el.textContent.trim());
  els.forEach((el) => {
    // wrap plain-text blocks into sentence spans so each can be highlighted
    if (el.children.length === 0) {
      const parts = splitSentences(el.textContent);
      if (parts.length > 1) {
        el.innerHTML = parts.map((s) => `<span class="tts-s">${ttsEscape(s)}</span>`).join(" ");
        el.querySelectorAll(".tts-s").forEach((sp) => ttsUnits.push(sp));
        return;
      }
    }
    ttsUnits.push(el);
  });
}
function toggleReadAloud() {
  const rb = document.getElementById("a11yRead");
  if (!("speechSynthesis" in window)) {
    if (rb) rb.querySelector(".lbl").textContent = "Not supported";
    return;
  }
  if (ttsActive) { stopReadAloud(); return; }
  buildTtsUnits();
  if (!ttsUnits.length) return;
  ttsActive = true; ttsIndex = 0;
  setReadState(true);
  speakNext();
}
function speakNext() {
  if (!ttsActive) return;
  if (ttsIndex >= ttsUnits.length) { stopReadAloud(); return; }
  document.querySelectorAll(".tts-active").forEach((e) => e.classList.remove("tts-active"));
  const el = ttsUnits[ttsIndex];
  el.classList.add("tts-active");
  el.scrollIntoView({ block: "center", behavior: a11y.motion ? "auto" : "smooth" });
  const u = new SpeechSynthesisUtterance(el.textContent);
  u.lang = LANG === "fr" ? "fr-CA" : "en-CA";
  u.rate = 0.98;
  u.onend = () => { ttsIndex++; speakNext(); };
  u.onerror = () => { ttsIndex++; speakNext(); };
  window.speechSynthesis.speak(u);
}
function stopReadAloud() {
  ttsActive = false;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  document.querySelectorAll(".tts-active").forEach((e) => e.classList.remove("tts-active"));
  setReadState(false);
}
function setReadState(speaking) {
  const rb = document.getElementById("a11yRead");
  if (!rb) return;
  rb.classList.toggle("speaking", speaking);
  rb.querySelector(".lbl").textContent = speaking ? t("a11y.stop") : t("a11y.read");
}

/* ---------------------------------------------------- language */
function persistLang() { notifyStateChange("language-change"); }
function applyStaticI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  const label = document.getElementById("langLabel");
  if (label) label.textContent = LANG === "fr" ? "FR" : "EN";
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.setAttribute("aria-label", `${LANG === "fr" ? "FR" : "EN"} — ${t("lang.switch")}`);
  const tag = document.getElementById("navTag");
  if (tag) tag.textContent = t("nav.tag");
}
function toggleLang() {
  LANG = LANG === "en" ? "fr" : "en";
  persistLang();
  stopReadAloud();
  applyStaticI18n();
  lastRenderKey = null; // force full re-render of current view
  render();
}

function wireHeaderMenu() {
  const button = document.getElementById("headerMenuToggle");
  const panel = document.getElementById("headerMenuPanel");
  if (!button || !panel) return;

  const iconSlot = button.querySelector(".header-menu-icon");
  if (iconSlot) iconSlot.innerHTML = icon("menu");

  const menuNavigation = {
    start: navigateStart,
    browse: navigateBrowse,
    coverage: () => setState("coverage"),
    grants: navigateGrants,
    organizations: navigateOrganizations,
    about: navigateAbout,
    support: navigateSupport,
    updates: navigateUpdates,
    privacy: navigatePrivacy,
    professionals: navigateProfessionals,
  };
  panel.querySelectorAll(".menu-item[data-nav]").forEach((item) => {
    const navigate = menuNavigation[item.dataset.nav];
    if (navigate) item.addEventListener("click", navigate);
  });

  const setOpen = (open, returnFocus = false) => {
    panel.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (!open && returnFocus) button.focus();
  };

  button.addEventListener("click", () => setOpen(panel.hidden));
  panel.addEventListener("click", (event) => {
    if (event.target.closest(".header-menu-item")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false, true);
  });
  document.addEventListener("click", (event) => {
    if (!panel.hidden && !event.target.closest(".header-menu-wrap")) setOpen(false);
  });
}

function clearScenario() {
  scenarioOpen = false;
  scenarioChanges.clear();
}

function setState(nextView, opts = {}, push = true) {
  if (nextView !== "results") clearScenario();
  view = nextView;
  if ("stepIndex" in opts) stepIndex = opts.stepIndex;
  if ("detailId" in opts) detailId = opts.detailId;
  const snap = { view, stepIndex, detailId };
  if (push) history.pushState(snap, "");
  else history.replaceState(snap, "");
  notifyStateChange("navigation");
  render();
}

window.addEventListener("popstate", (e) => {
  clearScenario();
  const s = e.state;
  if (s) {
    view = s.view;
    stepIndex = s.stepIndex ?? stepIndex;
    detailId = s.detailId ?? null;
  } else {
    view = "landing";
  }
  notifyStateChange("browser-history");
  render();
});

/* =============================================================================
   RENDER ROUTER
   ========================================================================== */
const PROVINCE_NAME = {
  AB: "Alberta", BC: "British Columbia", ON: "Ontario", QC: "Quebec",
  MB: "Manitoba", SK: "Saskatchewan", NS: "Nova Scotia", NB: "New Brunswick",
  NL: "Newfoundland & Labrador", PE: "Prince Edward Island",
  YT: "Yukon", NT: "Northwest Territories", NU: "Nunavut",
};

/* The `level` string a provincial record carries, for every province we cover.
   Derived rather than written out, so a newly covered province is counted as
   provincial instead of silently falling through to the municipal bucket — which
   is exactly what happened to Ontario's nine records on launch day. */
const PROVINCE_LEVEL_NAMES = new Set(
  COVERED_PROVINCES.map((code) => PROVINCE_NAME[code]).filter(Boolean)
);
function updateNavTag() {
  const tag = document.getElementById("navTag");
  if (tag) tag.textContent = PROVINCE_NAME[answers.province] || SCOPE_REGION_LABEL;
}

let lastRenderKey = null;
let hasRenderedView = false; // true after the first render; gates route-change focus so it never fires on initial load (keeps the skip link first-focusable)
/**
 * Last line of defence.
 *
 * render() writes #app.innerHTML. If anything it calls throws, the assignment
 * never happens and the visitor is left with a blank page and no way out — not
 * even a refresh, because the broken view is restored from IndexedDB. That
 * shipped once (valueLabel() read step.options directly after it became a
 * function on one step): the wizard rendered fine, so per-piece checks passed,
 * but "Find my benefits" jumps straight to results when you already have
 * answers, and results threw.
 *
 * A benefits site going blank for a disabled person is not a cosmetic failure —
 * they leave, and they don't get the money. So: never let one throw eat the
 * page. Show something honest, and always offer a way to start over.
 */
function renderSafely(fn, label) {
  try {
    return fn();
  } catch (err) {
    console.error(`render failed (${label}):`, err);
    return `
    <section class="card render-error">
      <h2>Something went wrong on our end</h2>
      <p>This is our bug, not anything you did. Your answers are still saved.</p>
      <p class="re-detail">${label}: ${String(err && err.message ? err.message : err).slice(0, 160)}</p>
      <div class="re-actions">
        <button class="btn btn-primary" id="reRetry" type="button">Try again</button>
        <button class="btn btn-ghost" id="reReset" type="button">Start over (clears your answers)</button>
      </div>
      <p class="re-foot">If it keeps happening, please tell us — the feedback form is on the home page, and it genuinely gets read.</p>
    </section>`;
  }
}

let packRenderRevision = 0;
function render() {
  const revision = ++packRenderRevision;
  const required = packsForView();
  if (DATA_PACKS && typeof AF_LOADED_PACKS !== "undefined" && required.some(p => COVERED_PROVINCES.includes(p) && !AF_LOADED_PACKS.has(p))) {
    // Keep the current page visible while its successor downloads. A newer
    // navigation wins over an older in-flight render (including Back/Forward).
    void ensurePacks(required).then(() => {
      if (revision === packRenderRevision) render();
    }).catch(error => {
      if (revision !== packRenderRevision) return;
      document.getElementById("app").innerHTML = renderSafely(() => { throw error; }, "program data");
      document.getElementById("reRetry")?.addEventListener("click", () => render());
      document.getElementById("reReset")?.addEventListener("click", () => {
        answers = BLANK(); confirmedFacts = {}; progress = {}; stepIndex = 0; detailId = null;
        setState("landing");
      });
    });
    return;
  }
  updateNavTag();
  const app = document.getElementById("app");
  const progress = document.querySelector(".progress");
  const bar = document.getElementById("progress-bar");
  // remember scroll so re-rendering the SAME page (e.g. ticking a checkbox)
  // doesn't yank the user to the top.
  const renderKey = `${view}|${stepIndex}|${detailId}`;
  const samePage = renderKey === lastRenderKey;
  const keepScroll = window.scrollY;

  if (view === "landing") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderLanding, "landing");
    wireLanding();
  } else if (view === "wizard") {
    const steps = visibleSteps();
    if (stepIndex > steps.length - 1) stepIndex = steps.length - 1;
    progress.style.display = "block";
    bar.style.width = `${(stepIndex / steps.length) * 100}%`;
    app.innerHTML = renderSafely(() => renderStep(steps[stepIndex]), "wizard");
    wireStep(steps[stepIndex]);
  } else if (view === "results") {
    progress.style.display = "block";
    bar.style.width = "100%";
    app.innerHTML = renderSafely(renderResults, "results");
    wireResults();
    wireFactChecks();
  } else if (view === "browse") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderBrowse, "browse");
    wireBrowse();
  } else if (view === "detail") {
    progress.style.display = "block";
    bar.style.width = "100%";
    app.innerHTML = renderSafely(() => renderDetail(detailId), "guide");
    wireDetail();
    wireFactChecks();
  } else if (view === "privacy") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderPrivacy, "privacy");
    wirePrivacy();
  } else if (view === "about") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderAbout, "about");
    wireAbout();
  } else if (view === "coverage") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderCoverage, "coverage");
    wireInfoPage(["cv-back", "cv-back2"]);
  } else if (view === "support") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderSupport, "support");
    wireSupport();
  } else if (view === "updates") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderUpdates, "updates");
    wireUpdates();
  } else if (view === "help") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(() => renderHelpPage(helpTopic), "help");
    wireHelpPage();
  } else if (view === "accessibility") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderAccessibilityStatement, "accessibility statement");
    wireAccessibilityStatement();
  } else if (view === "professionals") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderProfessionals, "for professionals");
    wireProfessionals();
  } else if (view === "partner-overview") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderPartnerOverview, "partner overview");
    wirePartnerOverview();
  } else if (view === "impact") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderImpact, "impact and coverage");
    wireImpact();
  } else if (view === "dtc-prep") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderDtcPrep, "DTC preparation sheet");
    wireDtcPrep();
  } else if (view === "grants") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderGrants, "grants and charitable funds");
    wireGrants();
  } else if (view === "organizations") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderOrganizations, "organizations that can help");
    wireOrganizations();
  }
  if (samePage) {
    window.scrollTo(0, keepScroll);
  } else {
    stopReadAloud(); // don't keep narrating an old page
    window.scrollTo(0, 0);
  }
  if (!samePage) {
    const appEl = document.getElementById("app");
    const heading = appEl && appEl.querySelector("h1, h2");
    const label = (heading && heading.textContent ? heading.textContent : "AbilityFinder").replace(/\s+/g, " ").trim();
    document.title = label === "AbilityFinder" ? "AbilityFinder" : `${label} · AbilityFinder`;
    const live = document.getElementById("routeLive");
    if (live) live.textContent = label;
    const focusTarget = document.getElementById("wizard-question") || heading;
    // Move focus on route CHANGES only, not the initial page load, so the skip
    // link stays the first focusable element on load (reconciles A11Y-02 + A11Y-03).
    if (focusTarget && hasRenderedView) { focusTarget.tabIndex = -1; focusTarget.focus({ preventScroll: true }); }
    hasRenderedView = true;
  }
  // Error-card recovery actions, wired here so they work from any view.
  // Recovery actions are wired here, not inline, so the self-only script CSP
  // never has to allow inline event handlers.
  const reRetry = document.getElementById("reRetry");
  if (reRetry) reRetry.addEventListener("click", () => window.location.reload());
  const reReset = document.getElementById("reReset");
  if (reReset)
    reReset.addEventListener("click", () => {
      answers = BLANK(); confirmedFacts = {}; progress = {}; stepIndex = 0; detailId = null;
      setState("landing");
    });
  // Content CTAs can appear on results and information pages as well as the
  // landing page. Wire them after every render so none become inert links.
  wireNavigation(app);
  // Re-run after the scroll settles: "is it on screen already?" is meaningless
  // if we ask before scrollTo has moved us.
  wireReveals();
  lastRenderKey = renderKey;
}

/* =============================================================================
   LANDING PAGE
   ========================================================================== */
function renderLanding() {
  const cat = (ic, key) => `<span class="cat">${icon(ic)}${t("cat." + key)}</span>`;
  return `
  <section class="landing">
    <section class="hero-full">
      <div class="hero-atmos" aria-hidden="true">
        <span class="hero-bloom"></span>
        <svg class="hero-ridges" viewBox="0 0 1440 480" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hrA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa6b8" stop-opacity="0.5"/><stop offset="1" stop-color="#9aa6b8" stop-opacity="0"/></linearGradient>
            <linearGradient id="hrB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b79a86" stop-opacity="0.55"/><stop offset="1" stop-color="#b79a86" stop-opacity="0"/></linearGradient>
            <linearGradient id="hrC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3d34" stop-opacity="0.9"/><stop offset="1" stop-color="#4a3d34" stop-opacity="0.2"/></linearGradient>
          </defs>
          <path d="M0,262 C210,222 360,286 560,250 S960,206 1180,258 1360,250 1440,262 L1440,480 L0,480 Z" fill="url(#hrA)"/>
          <path d="M0,318 C240,286 420,344 660,312 S1040,268 1260,326 1400,320 1440,322 L1440,480 L0,480 Z" fill="url(#hrB)"/>
          <path d="M0,372 C200,350 380,398 640,370 S1060,338 1300,384 1420,382 1440,384 L1440,480 L0,480 Z" fill="url(#hrC)"/>
        </svg>
        <span class="hero-fade"></span>
        <div class="hero-wave" aria-hidden="true">
          <svg class="hw hw-a" viewBox="0 0 2880 140" preserveAspectRatio="none"><path d="M0,74 c 180,-46 540,-46 720,0 c 180,46 540,46 720,0 c 180,-46 540,-46 720,0 c 180,46 540,46 720,0 L2880,140 L0,140 Z"/></svg>
          <svg class="hw hw-b" viewBox="0 0 2880 140" preserveAspectRatio="none"><path d="M0,86 c 240,42 480,42 720,0 c 240,-42 480,-42 720,0 c 240,42 480,42 720,0 c 240,-42 480,-42 720,0 L2880,140 L0,140 Z"/></svg>
        </div>
      </div>
      <div class="hero-inner">
        <span class="eyebrow"><span class="dot"></span>${t("land.eyebrow")}</span>
        <h1 class="hero-title">${t("land.title")}</h1>
        <p class="hero-sub">${t("land.sub")}</p>
        <div class="hero-cta">
          <button class="btn btn-primary js-start">${t("land.find")} ${icon("arrowRight")}</button>
          <button class="btn btn-ghost js-browse">${icon("search")} ${t("menu.browse")}</button>
        </div>
        <div class="trust">
          <span>${icon("lock")}${t("trust.private")}</span>
          <span>${icon("check")}${t("trust.free")}</span>
          <span>${icon("link")}${t("trust.official")}</span>
        </div>
      </div>
    </section>

    <div class="hero-preview-wrap" aria-hidden="true">
      <div class="preview">
        <div class="preview-top"><span class="pv-dot"></span><b>Example programs</b></div>
        <p class="match-note">Illustration only — not matched to anyone's answers.</p>
        <div class="pv-hero">
          <div class="pv-hero-l">
            <span class="pv-hero-lbl">Example results</span>
            <span class="pv-hero-val">Amounts vary</span>
          </div>
          <div class="pv-gauge"><span class="pv-gauge-fill"></span><span class="pv-gauge-tick" style="left:74%"></span></div>
        </div>
        <div class="pv-list">
          ${["pv.dtc", "pv.rdsp", "pv.transit", "pv.cdb"].map(key => `<div class="pv-row"><span class="pv-ic">${icon(key === "pv.transit" ? "transit" : "money")}</span><span class="pv-meta"><b>${t(key)}</b><span>Check the guide for details</span></span></div>`).join("")}
        </div>
      </div>
    </div>

    <section class="section life-events" aria-labelledby="life-events-title">
      <h2 class="section-title" id="life-events-title">${t("life.title")}</h2>
      <div class="life-event-grid">
        <button class="life-event-card menu-item reveal" type="button" data-nav="life-diagnosed">
          <span class="life-event-icon" aria-hidden="true">${icon("compass")}</span>
          <span class="life-event-copy"><span class="life-event-title">${t("life.diagnosed.h")}</span><span class="life-event-description">${t("life.diagnosed.p")}</span></span>
          <span class="life-event-arrow" aria-hidden="true">${icon("arrowRight")}</span>
        </button>
        <button class="life-event-card menu-item reveal" type="button" data-nav="life-turning18">
          <span class="life-event-icon" aria-hidden="true">${icon("clock")}</span>
          <span class="life-event-copy"><span class="life-event-title">${t("life.turning18.h")}</span><span class="life-event-description">${t("life.turning18.p")}</span></span>
          <span class="life-event-arrow" aria-hidden="true">${icon("arrowRight")}</span>
        </button>
        <button class="life-event-card menu-item reveal" type="button" data-nav="life-parent">
          <span class="life-event-icon" aria-hidden="true">${icon("family")}</span>
          <span class="life-event-copy"><span class="life-event-title">${t("life.parent.h")}</span><span class="life-event-description">${t("life.parent.p")}</span></span>
          <span class="life-event-arrow" aria-hidden="true">${icon("arrowRight")}</span>
        </button>
        <button class="life-event-card menu-item reveal" type="button" data-nav="life-unable">
          <span class="life-event-icon" aria-hidden="true">${icon("unable")}</span>
          <span class="life-event-copy"><span class="life-event-title">${t("life.unable.h")}</span><span class="life-event-description">${t("life.unable.p")}</span></span>
          <span class="life-event-arrow" aria-hidden="true">${icon("arrowRight")}</span>
        </button>
        <button class="life-event-card menu-item reveal" type="button" data-nav="life-alberta">
          <span class="life-event-icon" aria-hidden="true">${icon("globe")}</span>
          <span class="life-event-copy"><span class="life-event-title">${t("life.alberta.h")}</span><span class="life-event-description">${t("life.alberta.p")}</span></span>
          <span class="life-event-arrow" aria-hidden="true">${icon("arrowRight")}</span>
        </button>
        <button class="life-event-card menu-item reveal" type="button" data-nav="life-helper">
          <span class="life-event-icon" aria-hidden="true">${icon("help")}</span>
          <span class="life-event-copy"><span class="life-event-title">${t("life.helper.h")}</span><span class="life-event-description">${t("life.helper.p")}</span></span>
          <span class="life-event-arrow" aria-hidden="true">${icon("arrowRight")}</span>
        </button>
      </div>
    </section>

    <div class="section problem">
      <h2 class="section-title">${t("prob.title")}</h2>
      <div class="compare">
        <div class="compare-col bad">
          <div class="compare-h">${t("prob.badH")}</div>
          <ul>
            <li>${t("prob.bad1")}</li><li>${t("prob.bad2")}</li>
            <li>${t("prob.bad3")}</li><li>${t("prob.bad4")}</li>
          </ul>
        </div>
        <div class="compare-col good">
          <div class="compare-h">${icon("compass")} ${t("prob.goodH")}</div>
          <ul>
            <li>${t("prob.good1")}</li><li>${t("prob.good2")}</li>
            <li>${t("prob.good3")}</li><li>${t("prob.good4")}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="section" id="how">
      <p class="section-label">${t("how.title")}</p>
      <div class="steps3">
        <div class="step3"><div class="step3-n">1</div><div><h3>${t("how.1h")}</h3><p>${t("how.1p")}</p></div></div>
        <div class="step3"><div class="step3-n">2</div><div><h3>${t("how.2h")}</h3><p>${t("how.2p")}</p></div></div>
        <div class="step3"><div class="step3-n">3</div><div><h3>${t("how.3h")}</h3><p>${t("how.3p")}</p></div></div>
      </div>
    </div>

    <div class="section">
      <p class="section-label">${t("cats.title")}</p>
      <div class="cats">
        ${cat("money", "money")}${cat("health", "health")}${cat("education", "education")}
        ${cat("working", "employment")}${cat("transit", "transit")}${cat("family", "family")}
      </div>
      <p class="cats-note">${t("cats.note")}</p>
    </div>

    <div class="final-cta">
      <h2>${t("final.title")}</h2>
      <p>${t("final.sub")}</p>
      <button class="btn btn-primary js-start">${t("land.find")} ${icon("arrowRight")}</button>
    </div>

    <div class="section feedback" id="feedback">
      <span class="eyebrow"><span class="dot"></span>${t("fb.label")}</span>
      <h2 class="section-title">${t("fb.title")}</h2>
      <p class="feedback-lead">${t("fb.lead")}</p>
      <div class="fb-grid">
        <label class="fb-field"><span class="fb-lbl">${t("fb.typeLabel")}</span>
          <select id="fb-type" class="select-input">
            <option value="Feature request">${t("fb.tFeature")}</option>
            <option value="Bug or broken link">${t("fb.tBug")}</option>
            <option value="Missing benefit">${t("fb.tMissing")}</option>
            <option value="Something else">${t("fb.tOther")}</option>
          </select>
        </label>
        <label class="fb-field"><span class="fb-lbl">${t("fb.emailLabel")} <span class="opt-tag">${t("fb.optional")}</span></span>
          <input type="email" id="fb-email" class="text-input" placeholder="you@example.com" />
        </label>
      </div>
      <label class="fb-field"><span class="fb-lbl">${t("fb.msgLabel")}</span>
        <textarea id="fb-msg" class="text-input" rows="4" placeholder="${t("fb.placeholder")}" aria-describedby="fb-status" aria-invalid="false"></textarea>
      </label>
      <div class="fb-actions">
        <button class="btn btn-primary" id="fb-send">${t("fb.send")} ${icon("arrowRight")}</button>
        <button class="btn btn-ghost" id="fb-mailto" type="button">${icon("external")} Open my email app instead</button>
      </div>
      <p class="fb-note" id="fb-status" role="status" aria-live="polite">${t("fb.note")}</p>
    </div>

    <p class="disclaimer">${t("disclaimer")}</p>

    <footer class="site-footer">
      <div class="sf-brand">${icon("compass")} AbilityFinder</div>
      <div class="sf-links">
        <button class="linklike js-privacy">Privacy &amp; disclaimer</button>
        <button class="linklike" type="button" data-info-nav="accessibility">${t("footer.accessibility")}</button>
        <button class="linklike js-about">About &amp; how we verify</button>
        <button class="linklike js-support">Support AbilityFinder</button>
        <button class="linklike js-updates">Data updates</button>
        <button class="linklike" type="button" data-info-nav="impact">${t("footer.impact")}</button>
        <button class="linklike" type="button" data-info-nav="professionals">${t("footer.professionals")}</button>
        <button class="linklike" type="button" data-info-nav="grants">${t("footer.grants")}</button>
        <button class="linklike" type="button" data-info-nav="organizations">${t("footer.organizations")}</button>
        <button class="linklike js-browse">${t("menu.browse")}</button>
        <span class="sf-note">${SCOPE_LABEL} · Each guide shows when it was last checked · Not government-affiliated</span>
      </div>
    </footer>
  </section>`;
}

function navigateStart() {
  // if they already have answers, jump straight to results
  if (wizardDone()) setState("results");
  else {
    const firstMissing = visibleSteps().findIndex((step) => !stepAnswered(step));
    setState("wizard", { stepIndex: Math.max(0, firstMissing) });
  }
}
function navigateBrowse() { setState("browse"); }
function navigateGrants() { setState("grants"); }
function navigateOrganizations() { setState("organizations"); }
function navigatePrivacy() { setState("privacy"); }
function navigateAbout() { setState("about"); }
function navigateSupport() { setState("support"); }
function navigateUpdates() { setState("updates"); }
function navigateAccessibility() { setState("accessibility"); }
function navigateProfessionals() { setState("professionals"); }
function navigatePartnerOverview() { setState("partner-overview"); }
function navigateImpact() { setState("impact"); }
function navigateDtcPrep(from = "professionals") {
  dtcPrepFrom = from === "detail" ? "detail" : "professionals";
  setState("dtc-prep");
}

/* Shared by the landing-page footer and content CTAs. */
function wireNavigation(root) {
  root.querySelectorAll(".js-start").forEach((el) => el.addEventListener("click", navigateStart));
  root.querySelectorAll(".js-browse").forEach((el) => el.addEventListener("click", navigateBrowse));
  root.querySelectorAll(".js-privacy").forEach((el) => el.addEventListener("click", navigatePrivacy));
  root.querySelectorAll(".js-about").forEach((el) => el.addEventListener("click", navigateAbout));
  root.querySelectorAll(".js-support").forEach((el) => el.addEventListener("click", navigateSupport));
  root.querySelectorAll(".js-updates").forEach((el) => el.addEventListener("click", navigateUpdates));
  const infoNavigation = { accessibility: navigateAccessibility, professionals: navigateProfessionals, impact: navigateImpact, grants: navigateGrants, organizations: navigateOrganizations };
  root.querySelectorAll("[data-info-nav]").forEach((el) => {
    const navigate = infoNavigation[el.dataset.infoNav];
    if (navigate) el.addEventListener("click", navigate);
  });
}

const LIFE_EVENT_ANSWERS = {
  "life-diagnosed": [],
  "life-turning18": [["forWho", "self"], ["ageBand", "18"]],
  "life-parent": [["forWho", "child"]],
  "life-unable": [["forWho", "self"], ["situation", "unableToWork"]],
  "life-alberta": [],
  "life-helper": [["forWho", "family"]],
};

function startFromLifeEvent(startingPoint) {
  const selections = LIFE_EVENT_ANSWERS[startingPoint];
  if (!selections) return;

  // Every starting point begins a fresh questionnaire. Preseeds are applied by
  // the same validated selection helper used by the wizard's own option taps.
  answers = BLANK();
  confirmedFacts = {};
  progress = {};
  editingReturn = false;
  selections.forEach(([key, value]) => {
    const step = STEPS.find((candidate) => candidate.key === key);
    if (!step) return;
    applyWizardSelection(step, value);
  });
  setState("wizard", { stepIndex: 0 });
}

function wireLanding() {
  const app = document.getElementById("app");
  app.querySelectorAll(".life-event-card.menu-item[data-nav]").forEach((card) => {
    card.addEventListener("click", () => startFromLifeEvent(card.dataset.nav));
  });

  /* Feedback has two routes on purpose.
     - "Send" posts to /api/feedback and we mail it — no mail app needed, which
       is what most people expect and the only thing that works on a phone with
       no mail account configured.
     - "Open my email app" is the original mailto:. It never touches our server,
       so it stays available for anyone who'd rather not send us anything
       directly — and it still works if the endpoint is down. */
  const fbFields = () => ({
    kind: document.getElementById("fb-type").value,
    email: document.getElementById("fb-email").value.trim(),
    message: document.getElementById("fb-msg").value.trim(),
    status: document.getElementById("fb-status"),
  });

  let fbBusy = false;
  const send = document.getElementById("fb-send");
  if (send)
    send.addEventListener("click", async () => {
      if (fbBusy) return; // no duplicate submissions
      const { kind, email, message, status } = fbFields();
      const msgEl = document.getElementById("fb-msg");
      if (!message) {
        status.textContent = t("fb.needMsg");
        status.classList.add("err");
        if (msgEl) { msgEl.setAttribute("aria-invalid", "true"); msgEl.focus(); }
        return;
      }
      if (msgEl) msgEl.setAttribute("aria-invalid", "false");
      status.classList.remove("err");
      fbBusy = true; send.disabled = true;
      status.textContent = t("fb.sending");
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), fbTimeoutMs());
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, email, message }),
          signal: controller.signal,
        });
        if (!res.ok) { let m = t("fb.failGeneric"); try { m = (await res.json()).error || m; } catch (e) {} throw new Error(m); }
        status.classList.remove("err");
        status.innerHTML = `${icon("check")} ${t("fb.sent")}`;
        document.getElementById("fb-msg").value = ""; // clear only on success
      } catch (err) {
        status.classList.add("err");
        const msg = err.name === "AbortError" ? t("fb.timeout") : err.message;
        status.textContent = `${msg} ${t("fb.orMailApp")}`; // message text preserved for retry
      } finally {
        clearTimeout(timer);
        fbBusy = false; send.disabled = false;
      }
    });

  const mailtoBtn = document.getElementById("fb-mailto");
  if (mailtoBtn)
    mailtoBtn.addEventListener("click", () => {
      const { kind, email, message, status } = fbFields();
      const msgEl = document.getElementById("fb-msg");
      if (!message) {
        status.textContent = t("fb.needMsg");
        status.classList.add("err");
        if (msgEl) { msgEl.setAttribute("aria-invalid", "true"); msgEl.focus(); }
        return;
      }
      status.classList.remove("err");
      const subject = `AbilityFinder feedback — ${kind}`;
      const body = `Type: ${kind}\n` + (email ? `Reply-to: ${email}\n` : "") + `\n${message}\n`;
      window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.innerHTML = `${t("fb.thanks")}<b>${FEEDBACK_EMAIL}</b>.`;
    });
}

/* =============================================================================
   "I DON'T KNOW" HELP PAGES  (reachable from a wizard step, returns to it)

   Every question that offers "I'm not sure" links to a question-specific page.
   These are decision aids, not extra eligibility screens: they explain what the
   words mean, what record to look for, and when to keep the unsure answer.

   NOTE ON THE DISABILITY PAGE: there is deliberately no "list of disabilities
   the government recognises", because there isn't one. Eligibility is decided
   by how much you are limited, not by your diagnosis — that is the entire point
   of "severe and prolonged". Publishing a list would be false, and would feed
   the exact belief ("my condition isn't on the list, so I don't qualify") that
   stops people applying. So the page says the true thing instead.

   ALSO DELIBERATELY ABSENT: a "describe your disability and we'll pick for you"
   box. Mapping free text to a disability category is diagnosis-adjacent
   guesswork; get it wrong and we steer someone away from money they're owed.
   The assistant is explicitly fenced off from exactly this. Pointing people to
   someone who can actually answer is the honest version.
   ========================================================================== */
const HELP_PAGES = {
  disabilities: {
    kicker: "Not sure which to pick?",
    title: "You don't need a diagnosis to use this",
    lead: "This question trips people up more than any other. Here's the honest answer.",
    blocks: [
      {
        h: "There is no official list of “qualifying disabilities”",
        p: "People expect one, and it doesn't exist. The government doesn't decide by diagnosis — it decides by <b>how much your condition limits you day to day</b>, even with treatment. Two people with the same diagnosis can get different answers. Someone with a condition nobody's heard of can still qualify.",
      },
      {
        h: "Some programs depend on the category",
        p: "We use these categories to match you to programs and suggest the right kind of practitioner. Some programs depend on the category you pick, so it can change which results you see. Picking a category does not establish eligibility — the program decides. You can change your answers anytime. Your answers stay on this device. We don't send them anywhere.",
      },
      {
        h: "So what should you pick?",
        p: `Pick what is closest. If two fit, pick both — it's a multi-select. If nothing fits, pick <b>“Something else / not listed”</b>. Some programs depend on a specific category, so check each guide's requirements. You can change your answers anytime.`,
      },
      {
        h: "If you don't have a diagnosis yet",
        p: "You can still apply for most of this. What the forms need is a <b>practitioner describing your limitations</b> — not a label. Start with a family doctor or nurse practitioner and describe what you struggle to do, and how long it takes. If you don't have a practitioner, the benefit guides here have a “find one near you” search.",
      },
      {
        h: "If you want to talk to a person",
        p: "The “Real people who can help” section on your results lists help for your province. Check each organization's listing for who it serves and how to contact it.",
      },
    ],
    foot:
      "Still stuck? Pick the closest option and keep going — you can change any answer afterwards by tapping it on the results page.",
  },
  documentation: {
    kicker: "Professional documentation",
    title: "What “documented” means here",
    lead: "You are only telling AbilityFinder whether a qualified professional has recorded the disability or its day-to-day effects.",
    blocks: [
      {
        h: "Choose yes when there is a professional record",
        p: "Examples include a diagnostic or assessment report, a medical chart note, a specialist letter, or a benefit form completed by a doctor, nurse practitioner, psychologist, occupational therapist or another professional relevant to the program. You do not need to upload or show it here.",
      },
      {
        h: "A school plan alone may not satisfy every program",
        p: "An individualized education plan or school accommodation record is useful evidence, but some government programs require a medical practitioner or another specifically named professional. The guide for each program tells you who must confirm what.",
      },
      {
        h: "How to check",
        p: "Look for an assessment report or letter, check the patient portal if the clinic uses one, or ask the clinic whether the disability or functional limitation is recorded in the chart. If you cannot confirm that, keep <b>“I'm not sure”</b>; AbilityFinder will show the requirement as something to verify instead of calling it complete.",
      },
    ],
    foot: "This answer does not decide whether the person is disabled. It only prevents a documentation requirement from being treated as complete when it may not be.",
  },
  autismAssessment: {
    kicker: "B.C. autism assessment",
    title: "How to tell whether the diagnosis meets B.C. standards",
    lead: "The current B.C. Autism Funding application asks for an assessment and diagnosis that meet the province's requirements.",
    blocks: [
      {
        h: "Look for the diagnostic paperwork",
        p: "A B.C. Autism Assessment Network assessment normally produces a clinical outcome form. A private or out-of-province diagnosis needs the forms and confirmation described by B.C. A school identification, screening result or referral by itself is not the same as the required diagnostic assessment.",
      },
      {
        h: "Ask the assessor or Autism Information Services",
        p: "If the report does not make this clear, ask the diagnosing clinic whether it meets current B.C. Autism Funding standards. Autism Information Services can also explain the next step at <b>1-844-878-4700</b>.",
      },
      {
        h: "Use the unsure answer until it is confirmed",
        p: `Choosing <b>“I'm not sure”</b> keeps AbilityFinder from presenting Autism Funding as ready. It does not remove other disability supports. <a href="https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/diagnosis" target="_blank" rel="noopener noreferrer">Read B.C.'s official assessment guidance</a>.`,
      },
    ],
    foot: "B.C. says the current Autism Funding program continues during its announced transition. Always check the official page for the latest application rules.",
  },
  functionalNeeds: {
    kicker: "Daily-life needs",
    title: "Choose what is true in everyday life",
    lead: "These choices describe practical barriers and support needs. They are not diagnoses and they do not guarantee a program.",
    blocks: [
      {
        h: "Think about a usual difficult day",
        p: "Consider what happens most days even with medication, equipment or routines: whether another person must help or supervise, whether regular transit is usable, and whether equipment, a prescribed diet or medical travel is actually needed.",
      },
      {
        h: "Pick every statement that clearly applies",
        p: "This is a multi-select question. It includes personal care, transit, equipment, communication, memory and safety, sensory needs, home access, care coordination, pain and fatigue. For a child, the eating, dressing, toileting and washing choice means help with at least three of those listed activities. For transit, choose the barrier only when regular public transit cannot be used without assistance for some or all trips.",
      },
      {
        h: "Use unsure instead of guessing",
        p: "If you cannot tell whether a program would consider the need significant enough, choose <b>“I'm not sure”</b>. Do not choose “None of these” unless every statement is clearly false. The relevant guides will tell you what must be confirmed.",
      },
    ],
    foot: "Describe function honestly. The government or funding organization—not AbilityFinder—decides whether its threshold is met.",
  },
  msp: {
    kicker: "B.C. health coverage",
    title: "How to check MSP enrolment",
    lead: "MSP is British Columbia's public medical coverage. An active enrolment is different from simply having lived in B.C. or having applied in the past.",
    blocks: [
      {
        h: "A Personal Health Number is a useful clue",
        p: "People enrolled in MSP receive a Personal Health Number, usually shown on a BC Services Card. Because that number stays with a person for life, the card alone may not prove that coverage is currently active.",
      },
      {
        h: "The reliable check is an account confirmation",
        p: "B.C. provides an online MSP Account Confirmation request. You can also call Health Insurance BC at <b>604-683-7151</b> in the Lower Mainland or <b>1-800-663-7100</b> elsewhere in B.C.",
      },
      {
        h: "Keep unsure until you verify it",
        p: `Choose <b>“I'm not sure”</b> if you cannot confirm active enrolment. AbilityFinder will mark MSP-dependent programs as needing confirmation. <a href="https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/eligibility-and-enrolment" target="_blank" rel="noopener noreferrer">Check enrolment or request confirmation on the official B.C. page</a>.`,
      },
    ],
    foot: "No health number or confirmation? The official page also explains how to apply for MSP.",
  },
  bcAssistance: {
    kicker: "B.C. assistance status",
    title: "PWD, disability assistance and other statuses",
    lead: "This question asks about an existing government assistance status—not whether the person has a disability generally.",
    blocks: [
      {
        h: "PWD is a provincial designation",
        p: "Choose the first answer if the Ministry has granted the Persons with Disabilities (PWD) designation or the person currently receives B.C. disability assistance. The federal Disability Tax Credit is separate and does not by itself mean someone has PWD status.",
      },
      {
        h: "Other qualifying status depends on the program",
        p: "Some B.C. health and supplement programs also cover people in named income-assistance, child-in-care, palliative-care or protected-status groups. Those exceptions differ by program, so use the second answer only when you know an official status applies.",
      },
      {
        h: "Where to check",
        p: `Look at a Ministry decision letter or My Self Serve account, or ask the Ministry office handling the file. If the wording is still unclear, choose <b>“I'm not sure”</b> and confirm it in each guide. <a href="https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/pwd-designation-and-application/designation-application" target="_blank" rel="noopener noreferrer">Read the official PWD designation guidance</a>.`,
      },
    ],
    foot: "Selecting PWD here never grants the designation. It only tells the matcher that the person says the Ministry has already granted it.",
  },
  circumstances: {
    kicker: "Specific B.C. programs",
    title: "What the ownership and graduation choices mean",
    lead: "These narrow facts keep property, vehicle and recent-graduate programs out of results when they cannot apply.",
    blocks: [
      {
        h: "Owns and lives in a home",
        p: "Choose this only when the person—or the eligible family member named by the program—has an ownership interest in the home and lives there. Renting a home is not ownership.",
      },
      {
        h: "Owns, leases or has an interest in a vehicle",
        p: "Choose this when the person owns or leases a vehicle, or is named in another legally recognized ownership interest. Being a passenger or occasionally using someone else's vehicle is not enough for vehicle-owner programs.",
      },
      {
        h: "Graduated within the last three years",
        p: "Use the completion date on the post-secondary credential or official school record. If the date or completion status is unclear, choose <b>“I'm not sure”</b> so the related program appears only as a condition to investigate.",
      },
    ],
    foot: "If every statement is clearly false, choose “None of these.” Otherwise choose the true statements or keep “I'm not sure” until you can check.",
  },
  dtc: {
    kicker: "A federal tax credit",
    title: "How to tell if you have the DTC",
    lead: "The Disability Tax Credit unlocks more than anything else here — the RDSP, the Canada Disability Benefit, the Child Disability Benefit. It's worth two minutes to find out.",
    blocks: [
      {
        h: "You'd know if you applied",
        p: "The DTC isn't automatic and nobody gets it by accident. Someone had to send the CRA a <b>Form T2201</b> with a practitioner's section filled in, and the CRA had to write back approving it. If none of that rings a bell, the answer is almost certainly <b>“No, not yet”</b>.",
      },
      {
        h: "The reliable way to check",
        p: "Sign in to <b>CRA My Account</b> and look under benefits and credits — an active DTC shows there, with the years it covers. No account? Call the CRA at <b>1-800-959-8281</b> and ask “am I approved for the disability tax credit?”. They'll tell you.",
      },
      {
        h: "It might be on an old tax return",
        p: "If someone claimed it for you, it appears as the disability amount on your return (or on a parent's or spouse's, if it was transferred to them). Worth asking whoever does your taxes.",
      },
      {
        h: "It can expire",
        p: "Approvals are sometimes granted for a set number of years. If you were approved years ago and nothing's been re-submitted, it may have lapsed — CRA My Account shows the end year.",
      },
      {
        h: "Not approved? That's the normal starting point",
        p: "Answer <b>“No, not yet”</b> and we'll include the DTC step-by-step guide. It explains the CRA's “severe and prolonged” rules and which practitioner can certify each functional category.",
      },
    ],
    foot:
      "If you're unsure, answering “No, not yet” is the safer choice — we'll show you the DTC guide either way, and you can change the answer later.",
  },
};

function renderHelpPage(topic) {
  const hp = HELP_PAGES[topic];
  if (!hp) return `<div class="card">Not found.</div>`;
  const back = (id) => `<button class="back-link${id === "hp-back2" ? " bottom" : ""}" id="${id}">${icon("arrowLeft")} Back to the question</button>`;
  return `
  <section class="legal helppage">
    ${back("hp-back")}
    <p class="section-label">${hp.kicker}</p>
    <h1 class="legal-title">${hp.title}</h1>
    <p class="legal-lede">${hp.lead}</p>
    <ol class="pt-list">
      ${hp.blocks
        .map(
          (b, i) => `<li class="pt-item reveal" style="--i:${i}">
            <span class="pt-num" aria-hidden="true">${i + 1}</span>
            <div><h4>${b.h}</h4><p>${b.p}</p></div>
          </li>`
        )
        .join("")}
    </ol>
    <p class="pt-foot">${icon("info")} <span>${hp.foot}</span></p>
    ${back("hp-back2")}
  </section>`;
}

function wireHelpPage() {
  ["hp-back", "hp-back2"].forEach((id) => {
    const el = document.getElementById(id);
    // Return to the exact question they left, not the top of the wizard.
    if (el) el.addEventListener("click", () => setState("wizard", { stepIndex: helpReturnStep }));
  });
}

/* =============================================================================
   PRIVACY & DISCLAIMER
   ========================================================================== */
function renderPrivacy() {
  const block = (h, body) => `<div class="legal-block"><h2>${h}</h2>${body}</div>`;
  return `
  <section class="legal">
    <button class="back-link" id="p-back">${icon("arrowLeft")} Back</button>
    <p class="section-label">Privacy &amp; disclaimer</p>
    <h1 class="legal-title">Your information stays with you</h1>
    <p class="legal-lede">AbilityFinder is built to be private by default. Here's exactly how it works — in plain language.</p>

    ${block("What stays on your device", `<p>AbilityFinder has no accounts, sign-up, or advertising. Your wizard answers, progress, bookmarks, browse search, and settings live only in <b>your own browser</b>, in this site's IndexedDB database. We can't see that local state, and it is not sent to our Worker.</p>`)}
    ${block("Two optional ways information leaves your browser", `<p><b>Assistant:</b> The Ask a question button opens an optional assistant. Before you type, you must agree to send data. Each time you send, the entire current in-memory conversation (up to 20 messages) is sent through our Worker to <b>Cloudflare's AI service</b>. It is not saved in IndexedDB or linked to an AbilityFinder account, but the words leave your browser, so <b>please don't type your name, address, or health details you would rather not send</b>.</p><p><b>Feedback:</b> Choosing “Send feedback” posts the type, message, and optional reply email to our Worker. The feedback is emailed to AbilityFinder's pinned inbox and the emailed copy may be retained by the mail provider. Choosing “Open my email app instead” does not submit the form through our Worker.</p><p>The assistant can be <b>wrong</b>. It can explain confusing wording, explain what a form asks for, and point to a guide. It cannot tell you whether you qualify or quote dollar amounts — the checked guides and official pages are the final word.</p>`)}
    ${block("No analytics", `<p>AbilityFinder does not run client-side analytics or measure which pages or benefit guides you view. The site is delivered through Cloudflare, so ordinary web requests still pass through its infrastructure to load the site and protect it, but AbilityFinder does not use a Web Analytics or Browser Insights beacon.</p>`)}
    ${block("No tracking cookies, no ads", `<p>There is no advertising, cross-site tracking, or fingerprinting. We don't set tracking cookies.</p>`)}
    ${block("Fonts and files", `<p>All fonts and core app files are served from this site itself. AbilityFinder does not load an externally hosted analytics or measurement script.</p>`)}
    ${block("Location", `<p>The “Use my location” button only asks your browser for your location when <b>you tap it</b>. A postal code stays in current-page memory; neither it nor your coordinates are saved in IndexedDB or sent to AbilityFinder. If you open a practitioner-search link, the postal code or coordinates are included in a user-initiated Google Maps URL and are then sent to Google under its privacy policy.</p>`)}
    ${block("Links to other sites", `<p>Every “Apply” and official link opens the relevant government website in a new tab. Once you're on those sites, their own privacy policies apply — not ours.</p>`)}
    ${block("Clearing your data", `<p>Click the <b>AbilityFinder</b> logo (or “Start over”) to wipe your answers, or clear your browser's site data at any time. IndexedDB is still browser-owned storage: if you clear this site's data or delete your browser profile, your saved progress is deleted and AbilityFinder cannot recover it.</p>`)}

    <div class="legal-block">
      <h2>Important disclaimer</h2>
      <p>AbilityFinder is a free helper tool, <b>not</b> legal, medical, or financial advice, and it is not affiliated with the Government of ${SCOPE_GOVERNMENTS}. Dollar figures show published amounts or limits, not a personal payment estimate — your actual amount depends on your situation. Eligibility rules and amounts change; always confirm the current details on each official government page before you apply. Each guide shows when it was last checked.</p>
    </div>

    <button class="back-link bottom" id="p-back2">${icon("arrowLeft")} Back</button>
  </section>`;
}
function wirePrivacy() {
  ["p-back", "p-back2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => setState("landing"));
  });
}

/* =============================================================================
   ABOUT & METHODOLOGY
   ========================================================================== */
function renderAbout() {
  const block = (h, body) => `<div class="legal-block"><h2>${h}</h2>${body}</div>`;
  return `
  <section class="legal">
    <button class="back-link" id="a-back">${icon("arrowLeft")} Back</button>
    <p class="section-label">About &amp; how we verify</p>
    <h1 class="legal-title">Clear help, checked against official sources</h1>
    <p class="legal-lede">AbilityFinder makes it easier to find disability benefits and understand what to do next.</p>

    ${block("What AbilityFinder is", `<p>AbilityFinder is a free, independent tool that helps ${SCOPE_RESIDENTS} with disabilities find benefits in our catalog that may match their situation. It is not affiliated with any government. There is no login and there are no ads.</p>`)}
    ${block("How we verify facts", `<p>Every benefit links to an official government source. ${CATALOGUE_INDEX.filter(([id]) => !verifiedFor({ id }).inherited).length} programs were individually re-checked against their official source; the remaining ${CATALOGUE_INDEX.filter(([id]) => verifiedFor({ id }).inherited).length} were last checked in the ${verifiedFor(null).label} catalogue review.</p><p>Every few hours, automated monitoring checks a rotating set of official links and flags pages that break or move. A working link does not mean the rules or amounts are unchanged. Each guide shows its review date and warns when the numbers are worth re-confirming.</p>`)}
    ${block("What we never do", `<p>We do not create accounts, show ads, or use third-party trackers. Your answers stay on your device. We never sell or share your data.</p>`)}
    ${block("Found a mistake?", `<p>Please tell us through the <button class="linklike js-feedback">feedback form</button>. Corrections help everyone who uses AbilityFinder.</p>`)}
    ${block("Who runs this", `<p>AbilityFinder is an independent project built in Alberta by a small team. It is not a government service.</p>`)}

    <button class="back-link bottom" id="a-back2">${icon("arrowLeft")} Back</button>
  </section>`;
}

function renderSupport() {
  const donation = DONATION_URL ? `
    <div class="legal-block">
      <h2>Donations</h2>
      <p>If you would like to help cover the cost of running AbilityFinder, you can support the project.</p>
      <p><a class="btn btn-primary" href="${ttsEscape(DONATION_URL)}" target="_blank" rel="noopener noreferrer">Support this project ${icon("external")}</a></p>
    </div>` : "";
  return `
  <section class="legal">
    <button class="back-link" id="s-back">${icon("arrowLeft")} Back</button>
    <p class="section-label">Support AbilityFinder</p>
    <h1 class="legal-title">Help keep AbilityFinder useful</h1>
    <p class="legal-lede">Small actions can help more disabled ${SCOPE_RESIDENTS} find support.</p>

    <div class="legal-block">
      <h2>Keep it free</h2>
      <p>AbilityFinder is free and independent, and it will stay free for the people who need it.</p>
    </div>
    <div class="legal-block">
      <h2>Ways to help</h2>
      <p>Share AbilityFinder with someone who may need it. If you find an error, please use the <button class="linklike js-feedback">feedback form</button> to tell us.</p>
      <p>Organizations that help disabled ${SCOPE_RESIDENTS} are welcome to link to AbilityFinder or get in touch through the <button class="linklike js-feedback">feedback form</button>.</p>
    </div>
    ${donation}

    <button class="back-link bottom" id="s-back2">${icon("arrowLeft")} Back</button>
  </section>`;
}

function wireInfoPage(backIds) {
  backIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => setState("landing"));
  });
  document.querySelectorAll(".js-feedback").forEach((el) => {
    el.addEventListener("click", () => {
      setState("landing");
      requestAnimationFrame(() => document.getElementById("feedback")?.scrollIntoView({ block: "start" }));
    });
  });
}
function wireAbout() { wireInfoPage(["a-back", "a-back2"]); }

/* "What we don't cover yet" (task #206). Honest limits, so people know where
   else to look. The city lists are computed from the matcher: a listed city
   counts as covered when at least one local program does not refuse someone
   who lives there, so the page cannot drift from the catalogue. */
const LOCAL_LEVELS_EXCLUDED = new Set(["Federal", "Alberta", "British Columbia", "Ontario", "Saskatchewan", "Manitoba", "New Brunswick", "Nova Scotia", "Prince Edward Island", "Newfoundland and Labrador", "Quebec"]);
function citiesWithoutLocalPrograms() {
  const out = {};
  for (const [prov, cities] of Object.entries(CITIES_BY_PROVINCE)) {
    const local = BENEFITS.filter((b) => !LOCAL_LEVELS_EXCLUDED.has(b.level) && benefitProvinces(b).includes(prov));
    out[prov] = cities.filter((city) => {
      if (/^Other/i.test(city)) return false;
      // Two plausible people (an adult and a child, low income, documented
      // disability): a city is covered when some local program does not refuse
      // at least one of them. A blank profile is not enough, because programs'
      // other firm rules (age, for example) refuse an empty answer set.
      const base = { ...BLANK(), province: prov, city, forWho: "self", income: "low", citizenPR: true, disabilityVerified: "yes", dtc: "yes", disabilities: ["physical"], functionalNeeds: ["dailyLiving"], situation: ["none"], circumstances: ["none"] };
      const people = [{ ...base, ageBand: "19to59", ageGroup: "adult" }, { ...base, forWho: "child", ageBand: "6to11", ageGroup: "child", situation: ["elementary"] }];
      return !people.some((model) => evaluateAnswers(model, {}).some((e) => local.includes(e.b) && e.r.status !== "no"));
    });
  }
  return out;
}
function renderCoverage() {
  const block = (h, body) => `<div class="legal-block"><h2>${h}</h2>${body}</div>`;
  const missing = citiesWithoutLocalPrograms();
  const names = { AB: "Alberta", BC: "British Columbia", ON: "Ontario", ...(SK_ENABLED ? { SK: "Saskatchewan" } : {}), ...(MB_ENABLED ? { MB: "Manitoba" } : {}), ...(NB_ENABLED ? { NB: "New Brunswick" } : {}), ...(NS_ENABLED ? { NS: "Nova Scotia" } : {}), ...(PE_ENABLED ? { PE: "Prince Edward Island" } : {}), ...(NL_ENABLED ? { NL: "Newfoundland and Labrador" } : {}), ...(QC_ENABLED ? { QC: "Quebec" } : {}) };
  const cityRows = Object.entries(missing).filter(([p]) => names[p]).map(([p, list]) =>
    `<p><b>${names[p]}:</b> ${list.length ? reqEscape(list.join(", ")) : "every listed community has at least one local program"}.</p>`).join("");
  const localCount = CATALOGUE_INDEX.filter(([, level]) => !LOCAL_LEVELS_EXCLUDED.has(level)).length;
  return `
  <section class="legal" lang="en">
    <button class="back-link" id="cv-back">${icon("arrowLeft")} Back</button>
    <p class="section-label">Our limits</p>
    <h1 class="legal-title">What we don’t cover yet</h1>
    <p class="legal-lede">AbilityFinder does not list every program. This page says plainly what is missing, so you know where else to look.</p>
    ${block("Where we cover", `<p>We cover Canada-wide federal programs and provincial programs in ${SCOPE_LABEL_LONG}, plus ${localCount} city and regional programs. If you live in another province or territory, you will only see federal programs.</p>`)}
    ${block("Communities with no local program in our catalogue yet", `<p>These communities are in our list, but we have not added a city or regional program for them. They may still have one: ask your city hall or recreation centre.</p>${cityRows}`)}
    ${block("Kinds of help we do not list", `<ul class="cred-list">
      <li>${icon("info")}<span>Programs for one medical condition rather than disability, such as condition-specific drug programs.</span></li>
      <li>${icon("info")}<span>Programs whose rules or amounts are not published, or that change by local office, until we can state them accurately.</span></li>
      <li>${icon("info")}<span>Private, workplace or insurance benefits, and one-off pilots.</span></li>
      <li>${icon("info")}<span>Some charity grants and community organizations: our <button class="linklike" data-cover-nav="grants">grants</button> and <button class="linklike" data-cover-nav="organizations">organizations</button> lists hold the ones we have checked.</span></li>
    </ul>`)}
    ${block("Language", `<p>The menus can switch to French, but program details are in English for now.</p>`)}
    ${block("Where else to look", `<p>211 can point you to local programs: <a href="https://ab.211.ca/" target="_blank" rel="noopener noreferrer" data-ext>Alberta 211</a>, <a href="https://bc.211.ca/" target="_blank" rel="noopener noreferrer" data-ext>BC 211</a>, <a href="https://211ontario.ca" target="_blank" rel="noopener noreferrer" data-ext>211 Ontario</a>${SK_ENABLED ? `, <a href="https://sk.211.ca/" target="_blank" rel="noopener noreferrer" data-ext>211 Saskatchewan</a>` : ""}${MB_ENABLED ? `, <a href="https://mb.211.ca/" target="_blank" rel="noopener noreferrer" data-ext>211 Manitoba</a>` : ""}${NB_ENABLED ? `, <a href="https://nb.211.ca/" target="_blank" rel="noopener noreferrer" data-ext>211 New Brunswick</a>` : ""}${NS_ENABLED ? `, <a href="https://ns.211.ca/" target="_blank" rel="noopener noreferrer" data-ext>211 Nova Scotia</a>` : ""}${PE_ENABLED ? `, <a href="https://pe.211.ca/" target="_blank" rel="noopener noreferrer" data-ext>211 Prince Edward Island</a>` : ""}${NL_ENABLED ? `, <a href="https://nl.211.ca/" target="_blank" rel="noopener noreferrer" data-ext>211 Newfoundland and Labrador</a>` : ""}${QC_ENABLED ? `, <a href="https://www.211qc.ca/" target="_blank" rel="noopener noreferrer" data-ext>211 Quebec</a>` : ""}. Elsewhere in Canada, visit <a href="https://211.ca/" target="_blank" rel="noopener noreferrer" data-ext>211.ca</a>.</p>`)}
    ${block("Know a program we missed?", `<p>Tell us through the <button class="linklike js-feedback">feedback form</button>. We add a program only after we read its official page.</p>`)}
    <button class="back-link bottom" id="cv-back2">${icon("arrowLeft")} Back</button>
  </section>`;
}
function wireSupport() { wireInfoPage(["s-back", "s-back2"]); }

function infoList(keys) {
  return `<ul class="cred-list">${keys.map((key) => `<li>${icon("check")}<span>${t(key)}</span></li>`).join("")}</ul>`;
}

function renderAccessibilityStatement() {
  const block = (h, body) => `<div class="legal-block"><h2>${h}</h2>${body}</div>`;
  return `<section class="legal credibility-page">
    <button class="back-link" id="access-back">${icon("arrowLeft")} Back</button>
    <p class="section-label">${t("access.kicker")}</p>
    <h1 class="legal-title">${t("access.title")}</h1>
    <p class="legal-lede">${t("access.lede")}</p>
    ${block(t("access.commitment.h"), `<p>${t("access.commitment.p")}</p>`)}
    ${block(t("access.works.h"), infoList(Array.from({ length: 10 }, (_, i) => `access.works.${i + 1}`)))}
    ${block(t("access.test.h"), `<p>${t("access.test.p1")}</p><p>${t("access.test.p2")}</p>`)}
    ${block(t("access.limits.h"), infoList(["access.limits.1", "access.limits.2", "access.limits.3"]))}
    ${block(t("access.barrier.h"), `<p>${t("access.barrier.p")} <button class="linklike" type="button" data-page-feedback>${t("fb.send")}</button></p>`)}
    <p class="cred-reviewed">${t("access.reviewed")}</p>
    <button class="back-link bottom" id="access-back2">${icon("arrowLeft")} Back</button>
  </section>`;
}

function renderProfessionals() {
  const block = (h, body) => `<div class="legal-block"><h2>${h}</h2>${body}</div>`;
  return `<section class="legal credibility-page professionals-page">
    <button class="back-link" id="pro-back">${icon("arrowLeft")} Back</button>
    <p class="section-label">${t("pro.kicker")}</p>
    <h1 class="legal-title">${t("pro.title")}</h1>
    <p class="legal-lede">${t("pro.lede")}</p>
    ${block(t("pro.what.h"), `<p>${t("pro.what.p")}</p>`)}
    ${block(t("pro.use.h"), infoList(["pro.use.1", "pro.use.2", "pro.use.3", "pro.use.4"]))}
    ${block(t("pro.not.h"), `<p>${t("pro.not.p")} <button class="linklike" type="button" data-prof-nav="browse">${t("trust.official")}</button></p>`)}
    ${block(t("pro.link.h"), `<p>${t("pro.link.p")}</p><p class="stable-links"><a href="https://abilityfinder.ca/">abilityfinder.ca</a><span>abilityfinder.ca/guides/&lt;program&gt;.html</span></p>`)}
    ${block("Embed AbilityFinder on your site", `<p>Add the private, one-question AbilityFinder card to your organization’s website.</p><div class="embed-snippet"><code id="embedSnippet" tabindex="0">&lt;iframe src=&quot;https://abilityfinder.ca/embed&quot; title=&quot;AbilityFinder benefit check&quot; width=&quot;100%&quot; height=&quot;420&quot; style=&quot;border:0&quot; loading=&quot;lazy&quot;&gt;&lt;/iframe&gt;</code><button class="btn btn-secondary" id="copyEmbedSnippet" type="button">Copy snippet</button></div>`)}
    ${block(t("pro.partner.h"), `<p>${t("pro.partner.p")}</p><p><button class="btn btn-primary cred-cta" type="button" data-prof-nav="partner">${t("pro.partner.button")} ${icon("arrowRight")}</button></p>`)}
    ${block(t("pro.dtc.h"), `<p>${t("pro.dtc.p")}</p><p><button class="btn btn-primary cred-cta" type="button" data-prof-nav="dtc-prep">${t("pro.dtc.button")} ${icon("arrowRight")}</button></p>`)}
    ${block(t("orgs.pro.h"), `<p>${t("orgs.pro.p")}</p><p><button class="btn btn-primary cred-cta" type="button" data-prof-nav="organizations">${t("orgs.pro.button")} ${icon("arrowRight")}</button></p>`)}
    ${block(t("pro.contact.h"), `<p>${t("pro.contact.p")} <button class="linklike" type="button" data-page-feedback>${t("fb.send")}</button></p>`)}
    <button class="back-link bottom" id="pro-back2">${icon("arrowLeft")} Back</button>
  </section>`;
}

function renderPartnerOverview() {
  const programCount = browseCatalog(CATALOGUE_INDEX.map(([id, level]) => ({ id, level }))).length;
  const municipalityCount = Array.isArray(CITIES_WITH_PROGRAMS) ? new Set(CITIES_WITH_PROGRAMS).size : 0;
  return `<article class="partner-overview" id="partnerOverview">
    <header class="partner-head">
      <div>
        <p class="section-label">${t("partner.kicker")}</p>
        <h1 class="legal-title">${t("partner.title")}</h1>
        <p class="legal-lede">${t("partner.lede")}</p>
      </div>
      <div class="partner-actions">
        <button class="tool-btn" id="partnerPrint" type="button">${icon("print")}${t("partner.print")}</button>
        <button class="back-link" id="partner-back">${icon("arrowLeft")} Back</button>
      </div>
    </header>
    <section class="partner-metrics" aria-label="${t("partner.coverage.h")}">
      <div><strong>${programCount}</strong><span>${t("partner.coverage.programs")}</span></div>
      <div><strong>${municipalityCount}</strong><span>${t("partner.coverage.municipalities")}</span></div>
    </section>
    <div class="partner-grid">
      <section><h2>${icon("check")}${t("partner.verify.h")}</h2><p>${t("partner.verify.p")}</p></section>
      <section><h2>${icon("lock")}${t("partner.privacy.h")}</h2><p>${t("partner.privacy.p")}</p></section>
      <section><h2>${icon("compass")}${t("partner.impact.h")}</h2><p>${t("partner.impact.p")} <button class="linklike" type="button" data-partner-nav="impact">${t("partner.impact.link")}</button></p></section>
      <section><h2>${icon("link")}${t("partner.contact.h")}</h2><p>${t("partner.contact.p")} <button class="linklike" type="button" data-page-feedback>${t("fb.send")}</button></p></section>
    </div>
    <footer class="partner-foot">AbilityFinder · abilityfinder.ca · ${t("access.reviewed")}</footer>
  </article>`;
}

function wirePageFeedback() {
  document.querySelectorAll("[data-page-feedback]").forEach((el) => el.addEventListener("click", () => {
    setState("landing");
    requestAnimationFrame(() => document.getElementById("feedback")?.scrollIntoView({ block: "start" }));
  }));
}
function wireAccessibilityStatement() {
  ["access-back", "access-back2"].forEach((id) => document.getElementById(id)?.addEventListener("click", () => setState("landing")));
  wirePageFeedback();
}
function wireProfessionals() {
  ["pro-back", "pro-back2"].forEach((id) => document.getElementById(id)?.addEventListener("click", () => setState("landing")));
  document.querySelector('[data-prof-nav="browse"]')?.addEventListener("click", navigateBrowse);
  document.querySelector('[data-prof-nav="partner"]')?.addEventListener("click", navigatePartnerOverview);
  document.querySelector('[data-prof-nav="dtc-prep"]')?.addEventListener("click", () => navigateDtcPrep("professionals"));
  document.querySelector('[data-prof-nav="organizations"]')?.addEventListener("click", navigateOrganizations);

  const snippet = document.getElementById("embedSnippet");
  const copyButton = document.getElementById("copyEmbedSnippet");
  const selectSnippet = () => {
    if (!snippet) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(snippet);
    selection.removeAllRanges();
    selection.addRange(range);
  };
  snippet?.addEventListener("click", selectSnippet);
  snippet?.addEventListener("focus", selectSnippet);
  copyButton?.addEventListener("click", async () => {
    const text = snippet?.textContent || "";
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "Copied";
      window.setTimeout(() => { copyButton.textContent = "Copy snippet"; }, 1800);
    } catch (_) {
      selectSnippet();
      copyButton.textContent = "Snippet selected — copy it";
    }
  });
  wirePageFeedback();
}
function renderDtcPrep() {
  const dtc = BENEFITS.find((benefit) => benefit.id === "dtc");
  if (!dtc) return `<div class="card">DTC catalog entry not found.</div>`;
  const formUrl = resolveUrl(dtc.applyUrl);
  const sourceUrl = resolveUrl(dtc.source);
  const check = (key) => `<li><span class="dtc-prep-box" aria-hidden="true"></span><span>${t(key)}</span></li>`;
  const lines = (key) => `<div class="dtc-prep-prompt"><p>${t(key)}</p><span></span><span></span></div>`;
  return `<article class="dtc-prep" id="dtcPrepSheet">
    <header class="dtc-prep-head">
      <div>
        <p class="section-label">${t("dtcPrep.kicker")}</p>
        <h1>${t("dtcPrep.title")}</h1>
        <p class="dtc-prep-lede">${t("dtcPrep.lede")}</p>
        <p class="dtc-prep-bring">${icon("check")}<strong>${t("dtcPrep.bring")}</strong></p>
      </div>
      <div class="dtc-prep-actions">
        <button class="tool-btn" type="button" data-dtc-prep-print>${icon("print")}${t("dtcPrep.print")}</button>
        <button class="back-link" type="button" data-dtc-prep-back>${icon("arrowLeft")}${t("dtcPrep.back")}</button>
      </div>
    </header>

    <section class="dtc-prep-section">
      <h2>${icon("check")}${t("dtcPrep.before.h")}</h2>
      <ul class="dtc-prep-checklist">
        ${check("dtcPrep.before.sin")}
        ${check("dtcPrep.before.practitioner")}
        ${check("dtcPrep.before.examples")}
        ${check("dtcPrep.before.route")}
      </ul>
    </section>

    <section class="dtc-prep-section dtc-prep-notes">
      <h2>${icon("info")}${t("dtcPrep.notes.h")}</h2>
      <p class="dtc-prep-note-label">${t("dtcPrep.notes.label")}</p>
      ${lines("dtcPrep.notes.1")}
      ${lines("dtcPrep.notes.2")}
      ${lines("dtcPrep.notes.3")}
    </section>

    <section class="dtc-prep-section">
      <h2>${icon("compass")}${t("dtcPrep.practitioner.h")}</h2>
      <ul class="dtc-prep-facts">
        <li>${t("dtcPrep.practitioner.partB")}</li>
        <li>${t("dtcPrep.practitioner.digital")}</li>
        <li><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" data-ext>${t("dtcPrep.practitioner.list")} ${icon("external")}</a></li>
      </ul>
    </section>

    <section class="dtc-prep-section dtc-prep-sources">
      <h2>${icon("link")}${t("dtcPrep.sources.h")}</h2>
      <p><strong>${t("dtcPrep.sources.form")}</strong><br><a href="${formUrl}" target="_blank" rel="noopener noreferrer" data-ext>${formUrl}</a></p>
      <p><strong>${t("dtcPrep.sources.dtc")}</strong><br><a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" data-ext>${sourceUrl}</a></p>
    </section>
    <footer>${t("dtcPrep.footer")}</footer>
  </article>`;
}

function wireDtcPrep() {
  document.querySelector("[data-dtc-prep-print]")?.addEventListener("click", () => window.print());
  document.querySelector("[data-dtc-prep-back]")?.addEventListener("click", () => setState(dtcPrepFrom, dtcPrepFrom === "detail" ? { detailId: "dtc" } : {}));
}

function wirePartnerOverview() {
  document.getElementById("partner-back")?.addEventListener("click", () => setState("professionals"));
  document.getElementById("partnerPrint")?.addEventListener("click", () => window.print());
  document.querySelector('[data-partner-nav="impact"]')?.addEventListener("click", navigateImpact);
  wirePageFeedback();
}

function renderGrants() {
  const directory = typeof GRANTS_DIRECTORY !== "undefined" && Array.isArray(GRANTS_DIRECTORY)
    ? GRANTS_DIRECTORY
    : [];
  const visible = directory.filter((grant) => coverageApplies(grant) &&
    (grantsAudience === "all" || grant.audience === "all" || grant.audience === grantsAudience));
  const filters = ["all", "children", "adults"].map((audience) => `
    <button class="grants-filter" type="button" data-grants-filter="${audience}" aria-pressed="${grantsAudience === audience}">
      ${t(`grants.filter.${audience}`)}
    </button>`).join("");
  const cards = visible.map((grant) => `
    <article class="grant-card" data-grant-id="${ttsEscape(grant.id)}">
      <header>
        <span class="grant-card-icon" aria-hidden="true">${icon("money")}</span>
        <div><h2>${ttsEscape(grant.name)}</h2><p class="grant-org">${ttsEscape(grant.org)} · ${coverageLabel(grant)}</p></div>
      </header>
      <dl>
        <div><dt>${t("grants.who")}</dt><dd>${ttsEscape(grant.whoFor)}</dd></div>
        <div><dt>${t("grants.offers")}</dt><dd>${ttsEscape(grant.offers)}</dd></div>
        <div><dt>${t("grants.apply")}</dt><dd><a href="${ttsEscape(grant.url)}" target="_blank" rel="noopener noreferrer">${ttsEscape(grant.howToApply)} ${icon("external")}</a></dd></div>
      </dl>
      <p class="grant-verified">${icon("check")}${t("grants.verified").replace("{date}", plainEnglishDate(grant.verified))}</p>
    </article>`).join("");
  return `<section class="legal grants-page">
    <button class="back-link" type="button" data-grants-back>${icon("arrowLeft")} ${t("grants.back")}</button>
    <p class="section-label">${t("grants.kicker")}</p>
    <h1 class="legal-title">${t("grants.title")}</h1>
    <p class="legal-lede">${t("grants.lede")} ${COVERED_PROVINCES.includes(answers.province) ? `Showing ${PROVINCE_NAME[answers.province]} and Canada-wide funds.` : "Choose a province in the questionnaire to narrow this directory."}</p>
    <div class="grants-filters" role="group" aria-label="${t("grants.filter.label")}">${filters}</div>
    <div class="grants-grid">${cards}</div>
    <aside class="grants-suggest">
      <span aria-hidden="true">${icon("help")}</span>
      <div><h2>${t("grants.suggest.h")}</h2><p>${t("grants.suggest.p")}</p>
      <button class="linklike" type="button" data-page-feedback>${t("grants.suggest.button")}</button></div>
    </aside>
    <button class="back-link bottom" type="button" data-grants-back>${icon("arrowLeft")} ${t("grants.back")}</button>
  </section>`;
}

function wireGrants() {
  document.querySelectorAll("[data-grants-back]").forEach((button) => button.addEventListener("click", () => setState("landing")));
  document.querySelectorAll("[data-grants-filter]").forEach((button) => button.addEventListener("click", () => {
    grantsAudience = button.dataset.grantsFilter;
    lastRenderKey = null;
    render();
  }));
  wirePageFeedback();
}

function renderOrganizations() {
  const directory = typeof ORGS_DIRECTORY !== "undefined" && Array.isArray(ORGS_DIRECTORY)
    ? ORGS_DIRECTORY
    : [];
  const visible = directory.filter((organization) => coverageApplies(organization));
  const directoryProvinceNames = _joinAnd(
    [...new Set(directory.flatMap((organization) => Array.isArray(organization.coverage) ? organization.coverage : []))]
      .map((code) => PROVINCE_NAME[code])
      .filter(Boolean)
  );
  const cards = visible.map((organization) => `
    <article class="org-card" data-org-id="${ttsEscape(organization.id)}">
      <header>
        <span class="org-card-icon" aria-hidden="true">${icon("help")}</span>
        <div><h2>${ttsEscape(organization.name)}</h2><p class="org-region"${recAttr(organization)}>${ttsEscape(organization.region)}</p></div>
      </header>
      <dl>
        <div><dt>${t("orgs.region")}</dt><dd${recAttr(organization)}>${ttsEscape(organization.region)}</dd></div>
        <div><dt>${t("orgs.what")}</dt><dd${recAttr(organization)}>${ttsEscape(organization.whatTheyDo)}</dd></div>
      </dl>
      <a class="org-link" href="${ttsEscape(organization.url)}" target="_blank" rel="noopener noreferrer">${t("orgs.website")} ${icon("external")}</a>
      ${orgVerifiedLabel(organization) ? `<p class="org-verified">${icon("check")}${t("orgs.verified").replace("{date}", orgVerifiedLabel(organization))}</p>` : ""}
    </article>`).join("");
  const rules = Array.from({ length: 6 }, (_, index) => {
    const content = t(`orgs.rules.${index + 1}`);
    return `<li>${index === 5 ? `<button class="linklike" type="button" data-page-feedback>${content}</button>` : content}</li>`;
  }).join("");
  return `<section class="legal orgs-page">
    <button class="back-link" type="button" data-orgs-back>${icon("arrowLeft")} ${t("orgs.back")}</button>
    <p class="section-label">${t("orgs.kicker")}</p>
    <h1 class="legal-title">${t("orgs.title")}</h1>
    <p class="legal-lede">${t("orgs.lede")} ${
      !COVERED_PROVINCES.includes(answers.province)
        ? "Choose a province in the questionnaire to narrow this directory."
        : visible.length
          ? `Showing organizations that serve ${PROVINCE_NAME[answers.province]}.`
          : `No organizations listed for ${PROVINCE_NAME[answers.province]} yet. The directory currently covers ${directoryProvinceNames || "no provinces"}.`
    }</p>
    <div class="orgs-grid">${cards}</div>
    <section class="orgs-rules" aria-labelledby="orgs-rules-title">
      <h2 id="orgs-rules-title">${icon("check")}${t("orgs.rules.h")}</h2>
      <ul>${rules}</ul>
    </section>
    <aside class="orgs-suggest">
      <span aria-hidden="true">${icon("help")}</span>
      <div><h2>${t("orgs.suggest.h")}</h2><p>${t("orgs.suggest.p")}</p>
      <button class="linklike" type="button" data-page-feedback>${t("orgs.suggest.button")}</button></div>
    </aside>
    <button class="back-link bottom" type="button" data-orgs-back>${icon("arrowLeft")} ${t("orgs.back")}</button>
  </section>`;
}

function wireOrganizations() {
  document.querySelectorAll("[data-orgs-back]").forEach((button) => button.addEventListener("click", () => setState("landing")));
  wirePageFeedback();
}

function impactCatalogStats() {
  const programs = browseCatalog();
  const indexed = browseCatalog(CATALOGUE_INDEX.map(([id, level]) => ({ id, level })));
  const levels = indexed.reduce((counts, benefit) => {
    if (benefit.level === "Federal") counts.federal += 1;
    else if (PROVINCE_LEVEL_NAMES.has(benefit.level)) counts.provincial += 1;
    else counts.municipal += 1;
    return counts;
  }, { federal: 0, provincial: 0, municipal: 0 });
  return {
    programs: indexed.length,
    municipalities: Array.isArray(CITIES_WITH_PROGRAMS) ? new Set(CITIES_WITH_PROGRAMS).size : 0,
    categories: new Set(programs.map((benefit) => benefit.category).filter(Boolean)).size,
    sourced: programs.filter((benefit) => benefit.source).length,
    ...levels,
  };
}

function renderImpact() {
  const stats = impactCatalogStats();
  const metric = (value, label) => `<div class="impact-metric"><strong>${value}</strong><span>${label}</span></div>`;
  return `<section class="legal credibility-page impact-page">
    <button class="back-link" id="impact-back">${icon("arrowLeft")} ${t("impact.back")}</button>
    <p class="section-label">${t("impact.kicker")}</p>
    <h1 class="legal-title">${t("impact.title")}</h1>
    <p class="legal-lede">${t("impact.lede")}</p>

    <div class="legal-block">
      <h2>${icon("compass")}${t("impact.coverage.h")}</h2>
      <div class="impact-metrics">
        ${metric(stats.programs, t("impact.coverage.programs"))}
        ${metric(stats.municipalities, t("impact.coverage.municipalities"))}
        ${metric(stats.categories, t("impact.coverage.categories"))}
      </div>
      <div class="impact-levels" aria-label="${t("impact.coverage.levels")}">
        <span><b>${stats.federal}</b> ${t("impact.coverage.federal")}</span>
        <span><b>${stats.provincial}</b> ${t("impact.coverage.provincial")}</span>
        <span><b>${stats.municipal}</b> ${t("impact.coverage.municipal")}</span>
      </div>
    </div>

    <div class="legal-block">
      <h2>${icon("check")}${t("impact.truth.h")}</h2>
      <p>${t("impact.truth.sources").replace("{sourced}", stats.sourced).replace("{programs}", stats.programs)}</p>
      <p>${t("impact.truth.monitor")}</p>
      <p>${t("impact.truth.changes")} <button class="linklike" type="button" data-impact-nav="updates">${t("impact.links.updates")}</button>.</p>
    </div>

    <div class="legal-block">
      <h2>${icon("info")}${t("impact.usage.h")}</h2>
      <p>${t("impact.usage.p")}</p>
    </div>

    <div class="legal-block">
      <h2>${icon("money")}${t("impact.estimates.h")}</h2>
      <p>${t("impact.estimates.p1")}</p>
      <p>${t("impact.estimates.p2")}</p>
    </div>

    <nav class="impact-links" aria-label="${t("impact.links.label")}">
      <button type="button" data-impact-nav="professionals">${icon("working")}<span>${t("impact.links.professionals")}</span>${icon("arrowRight")}</button>
      <button type="button" data-impact-nav="partner">${icon("compass")}<span>${t("impact.links.partner")}</span>${icon("arrowRight")}</button>
      <button type="button" data-impact-nav="updates">${icon("check")}<span>${t("impact.links.updates")}</span>${icon("arrowRight")}</button>
      <button type="button" data-impact-nav="grants">${icon("money")}<span>${t("grants.related")}</span>${icon("arrowRight")}</button>
    </nav>
    <button class="back-link bottom" id="impact-back2">${icon("arrowLeft")} ${t("impact.back")}</button>
  </section>`;
}

function wireImpact() {
  ["impact-back", "impact-back2"].forEach((id) => document.getElementById(id)?.addEventListener("click", () => setState("landing")));
  const destinations = { professionals: navigateProfessionals, partner: navigatePartnerOverview, updates: navigateUpdates, grants: navigateGrants };
  document.querySelectorAll("[data-impact-nav]").forEach((element) => {
    const navigate = destinations[element.dataset.impactNav];
    if (navigate) element.addEventListener("click", navigate);
  });
}

function plainEnglishDate(isoDate) {
  if (typeof isoDate !== "string" || !isoDate.trim()) return "Date not available";
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(LANG === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function plainEnglishMonth(monthDate) {
  if (typeof monthDate !== "string" || !/^\d{4}-\d{2}$/.test(monthDate)) return "Date not available";
  const [year, month] = monthDate.split("-").map(Number);
  if (month < 1 || month > 12) return monthDate;
  return new Intl.DateTimeFormat(LANG === "fr" ? "fr-CA" : "en-CA", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function recentlyVerifiedBenefits() {
  const programs = browseCatalog();
  const verifiedDates = typeof BENEFIT_VERIFIED === "object" && BENEFIT_VERIFIED ? BENEFIT_VERIFIED : {};
  const catalogMonth = typeof DATA_VERIFIED_MONTH === "string" ? DATA_VERIFIED_MONTH : "";
  return programs.filter((benefit) => benefit && typeof benefit === "object").map((benefit, catalogIndex) => {
    const rawDate = benefit.id ? verifiedDates[benefit.id] : null;
    const reviewMonth = typeof rawDate === "string" && /^\d{4}-\d{2}$/.test(rawDate)
      ? rawDate
      : catalogMonth;
    return { benefit, catalogIndex, reviewMonth };
  })
    .sort((a, b) => String(b.reviewMonth).localeCompare(String(a.reviewMonth)) || a.catalogIndex - b.catalogIndex)
    .slice(0, 10);
}

function renderUpdates() {
  const verifiedItems = recentlyVerifiedBenefits().map(({ benefit, reviewMonth }) => `
    <li class="updates-feed-item">
      <div class="updates-feed-heading">
        <h3>${ttsEscape(String(benefit.name || "Unnamed program"))}</h3>
        <time datetime="${ttsEscape(String(reviewMonth || ""))}">${ttsEscape(plainEnglishMonth(reviewMonth))}</time>
      </div>
      <p>${ttsEscape(String(benefit.summary || "See the program guide for details."))}</p>
    </li>`).join("");
  const changes = typeof DATA_CHANGELOG !== "undefined" && Array.isArray(DATA_CHANGELOG)
    ? DATA_CHANGELOG.filter((change) => change && typeof change === "object")
    : [];
  const changelogSection = changes.length ? `
    <div class="legal-block">
      <h2>${t("updates.changelog.h")}</h2>
      <ol class="updates-feed updates-changelog">${[...changes]
        .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
        .map((change) => `
          <li class="updates-feed-item">
            <time datetime="${ttsEscape(String(change.date || ""))}">${ttsEscape(plainEnglishDate(change.date))}</time>
            <p>${ttsEscape(String(change.text || "Catalog updated."))}</p>
          </li>`).join("")}</ol>
    </div>` : "";
  return `<section class="legal updates-page">
    <button class="back-link" id="u-back">${icon("arrowLeft")} ${t("updates.back")}</button>
    <p class="section-label">${t("updates.kicker")}</p>
    <h1 class="legal-title">${t("updates.title")}</h1>
    <p class="legal-lede">${t("updates.lede")}</p>
    <div class="legal-block">
      <h2>${t("updates.verified.h")}</h2>
      <p>${t("updates.verified.note")}</p>
      <ol class="updates-feed">${verifiedItems}</ol>
    </div>
    ${changelogSection}
    <button class="back-link bottom" id="u-back2">${icon("arrowLeft")} ${t("updates.back")}</button>
  </section>`;
}
function wireUpdates() {
  ["u-back", "u-back2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => setState("landing"));
  });
}

/* =============================================================================
   WIZARD STEP
   ========================================================================== */
function renderStep(step) {
  const steps = visibleSteps();
  const T = stepText(step);
  let controlHtml;

  if (step.type === "select") {
    const opts = stepOptions(step)
      .map((c) => `<option value="${c}" ${answers[step.key] === c ? "selected" : ""}>${c}</option>`)
      .join("");
    controlHtml = `
      <select class="select-input" id="selInput" aria-label="${T.q}">
        <option value="" ${!answers[step.key] ? "selected" : ""} disabled>${T.placeholder || "Choose…"}</option>
        ${opts}
      </select>`;
  } else {
    const stepOpts = stepOptions(step);
    const optionsHtml = stepOpts
      .map((o, optionIndex) => {
        const selected =
          step.type === "multi"
            ? answers[step.key].includes(o.value)
            : answers[step.key] === o.value;
        const inputId = `wizard-option-${stepIndex}-${optionIndex}`;
        return `
        <input class="wizard-choice sr-only" id="${inputId}"
          type="${step.type === "multi" ? "checkbox" : "radio"}"
          name="wizard-${step.key}" data-value='${JSON.stringify(o.value)}'
          ${selected ? "checked" : ""}>
        <label class="opt ${selected ? "selected" : ""}" for="${inputId}">
          ${o.icon ? icon(o.icon) : ""}
          <span class="label">${optionText(step, o)}${o.sub ? `<span class="sub">${o.sub}</span>` : ""}</span>
          <span class="tick" aria-hidden="true"></span>
        </label>`;
      })
      .join("");
    const twoCol = stepOpts.length === 2 ? "two" : "";
    controlHtml = `
      <fieldset class="wizard-options-fieldset" aria-describedby="wizard-help">
        <legend class="sr-only">${T.q}</legend>
        <div class="options ${twoCol}">${optionsHtml}</div>
      </fieldset>`;
  }

  const nextDisabled = !stepAnswered(step);
  const isFirst = stepIndex === 0;

  return `
  <div class="wiz-mountains" aria-hidden="true">
    <svg class="wm wm-3" viewBox="0 0 2880 600" preserveAspectRatio="xMidYMax slice"><path d="M0,430 Q220,300 430,360 T760,290 Q980,250 1180,340 T1520,300 Q1740,240 1980,330 T2360,290 Q2600,250 2880,350 L2880,600 L0,600 Z"/></svg>
    <svg class="wm wm-2" viewBox="0 0 2880 600" preserveAspectRatio="xMidYMax slice"><path d="M0,500 L340,360 470,420 720,300 900,400 1180,330 1440,470 1640,340 1880,440 2140,320 2380,450 2600,360 2880,470 L2880,600 L0,600 Z"/></svg>
    <svg class="wm wm-1" viewBox="0 0 2880 600" preserveAspectRatio="xMidYMax slice"><path d="M0,560 L280,470 400,510 620,420 760,480 980,410 1180,520 1440,430 1560,490 1780,420 1980,515 2220,440 2420,520 2660,450 2880,530 L2880,600 L0,600 Z"/></svg>
  </div>
  <div class="wizard-layout">
    <div class="card wizard-card">
      <p class="step-kicker">${icon("compass")} ${T.kicker} · ${t("wiz.step")} ${stepIndex + 1} ${t("wiz.of")} ${steps.length}</p>
      <h2 class="step-q" id="wizard-question" tabindex="-1">${T.q}</h2>
      <p class="step-help" id="wizard-help">${T.help}</p>
      ${/* ABOVE the options, not below. Someone who doesn't know the answer
            decides that while reading the question — by the time they're
            scanning options they've already picked one and moved on, and on the
            DTC step a wrong guess costs them the biggest benefit here. */ ""}
      ${step.sideNote ? `
        <button class="side-note" id="sideNote" type="button">
          <span class="sn-ic">${icon("help")}</span>
          <span class="sn-body">
            <span class="sn-label">${step.sideNote.label}</span>
            <span class="sn-sub">${step.sideNote.sub}</span>
          </span>
          <span class="sn-go">${icon("arrowRight")}</span>
        </button>` : ""}
      ${controlHtml}
      <div class="nav-row">
        <button class="btn btn-ghost" id="back">${editingReturn ? t("wiz.cancel") : isFirst ? t("wiz.exit") : t("wiz.back")}</button>
        <button class="btn btn-primary" id="next" ${nextDisabled ? "disabled" : ""}>
          ${editingReturn ? t("wiz.done") : step.type === "multi" ? t("wiz.continue") : t("wiz.next")}
        </button>
      </div>
    </div>
    <aside class="wizard-aside">
      <div class="aside-card">
        <h4>${t("aside.title")}</h4>
        <ul class="aside-list">
          <li>${icon("check")}<span>${t("aside.1")}</span></li>
          <li>${icon("lock")}<span>${t("aside.2")}</span></li>
          <li>${icon("key")}<span>${t("aside.3")}</span></li>
        </ul>
      </div>
    </aside>
  </div>`;
}

function stepAnswered(step) {
  // An optional step never holds the wizard back, and a saved answer set from
  // before the step existed still counts as finished.
  if (step.optional) return true;
  if (step.type === "multi") return answers[step.key].length > 0;
  return answers[step.key] !== null;
}

function applyWizardSelection(step, value) {
  const validOption = stepOptions(step).some((option) => {
    const optionValue = typeof option === "object" ? option.value : option;
    return optionValue === value;
  });
  if (!validOption) return false;

  // Presentation-only answers (step.keepsFacts) never affect a gate, so they
  // must not clear the person's program-scoped fact checks.
  if (!step.keepsFacts && JSON.stringify(answers[step.key]) !== JSON.stringify(value)) confirmedFacts = {};
  if (step.type === "multi") toggleMulti(step, value);
  else {
    const previous = answers[step.key];
    answers[step.key] = value;
    if (step.key === "province") void ensurePacks([value]).catch(() => {}); // results retries/report failures
    if (step.onPick) step.onPick(value, previous);
  }
  notifyStateChange("wizard-answer");
  return true;
}

function refreshWizardSelectionControls(step) {
  document.querySelectorAll(".wizard-choice").forEach((choice) => {
    const value = JSON.parse(choice.dataset.value);
    const selected = step.type === "multi"
      ? answers[step.key].includes(value)
      : answers[step.key] === value;
    choice.checked = selected;
    const label = choice.nextElementSibling;
    if (label?.classList.contains("opt")) label.classList.toggle("selected", selected);
  });
  const next = document.getElementById("next");
  if (next) next.disabled = !stepAnswered(step);
}

function wireStep(step) {
  const sn = document.getElementById("sideNote");
  if (sn && step.sideNote)
    sn.addEventListener("click", () => {
      helpReturnStep = stepIndex;      // come back to this exact question
      helpTopic = step.sideNote.topic;
      setState("help");
    });
  if (step.type === "select") {
    const sel = document.getElementById("selInput");
    if (sel)
      sel.addEventListener("change", () => {
        // Native select navigation is a draft until explicitly confirmed.
        const next = document.getElementById("next");
        if (next) next.disabled = !sel.value;
      });
    const back = document.getElementById("back");
    const next = document.getElementById("next");
    if (back) back.addEventListener("click", goBack);
    if (next) next.addEventListener("click", () => {
      if (!sel || !applyWizardSelection(step, sel.value)) return;
      goNext();
    });
    return;
  }

  const choices = [...document.querySelectorAll(".wizard-choice")];
  let advancePending = false;
  choices.forEach((choice, index) => {
    // Label activation can forward a detail=0 click in WebKit. Track the
    // originating pointer instead, scoped to this option and this render.
    let pointerIntentUntil = 0;
    const label = choice.nextElementSibling;
    [choice, label].forEach((target) => {
      target.addEventListener("pointerdown", (event) => {
        pointerIntentUntil = event.isPrimary && event.button === 0 ? performance.now() + 1500 : 0;
      });
      target.addEventListener("pointercancel", () => { pointerIntentUntil = 0; });
    });
    choice.addEventListener("keydown", (event) => {
      // A pointer press that never clicked must not turn later keyboard input
      // into an auto-advance, even while the intent window is still open.
      pointerIntentUntil = 0;
      if (step.type === "multi") return;
      const direction = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
      if (direction) {
        event.preventDefault();
        choices[(index + direction + choices.length) % choices.length].focus();
      } else if (event.key === "Enter") {
        event.preventDefault();
        choice.click();
      }
    });
    // Pointer activation keeps the existing one-tap path. Keyboard selection
    // records an answer but leaves the question and Next button in place.
    choice.addEventListener("click", () => {
      const pointerActivation = performance.now() < pointerIntentUntil;
      pointerIntentUntil = 0;
      if (step.type !== "multi" && pointerActivation && !advancePending) {
        advancePending = true;
        const idx = stepIndex;
        setTimeout(() => {
          if (stepIndex !== idx) return;
          goNext();
        }, 200);
      }
    });
    choice.addEventListener("change", () => {
      const value = JSON.parse(choice.dataset.value);
      if (!applyWizardSelection(step, value)) return;
      refreshWizardSelectionControls(step);
      // Keep native selection and focus without replacing the question.
    });
  });

  const back = document.getElementById("back");
  const next = document.getElementById("next");
  if (back) back.addEventListener("click", goBack);
  if (next) next.addEventListener("click", goNext);
}

function toggleMulti(step, value) {
  const arr = answers[step.key];
  const idx = arr.indexOf(value);
  if (idx >= 0) { arr.splice(idx, 1); return; }
  if (step.exclusive) {
    const exclusiveValues = Array.isArray(step.exclusive) ? step.exclusive : [step.exclusive];
    if (exclusiveValues.includes(value)) { answers[step.key] = [value]; return; }
    exclusiveValues.forEach((exclusiveValue) => {
      const ex = arr.indexOf(exclusiveValue);
      if (ex >= 0) arr.splice(ex, 1);
    });
  }
  arr.push(value);
}

function finishEdit() {
  editingReturn = false;
  if (!wizardDone()) {
    const firstMissing = visibleSteps().findIndex((step) => !stepAnswered(step));
    setState("wizard", { stepIndex: Math.max(0, firstMissing) });
    return;
  }
  setState("results");
}
function goNext() {
  if (editingReturn) return finishEdit();
  const steps = visibleSteps();
  if (stepIndex >= steps.length - 1) setState("results");
  else setState("wizard", { stepIndex: stepIndex + 1 }, false);
}
function goBack() {
  if (editingReturn) return finishEdit();
  if (stepIndex === 0) setState("landing", {}, false);
  else setState("wizard", { stepIndex: stepIndex - 1 }, false);
}

/* =============================================================================
   RESULTS
   ========================================================================== */
function cloneAnswers(source = answers) {
  return {
    ...source,
    disabilities: [...source.disabilities],
    functionalNeeds: [...source.functionalNeeds],
    circumstances: [...source.circumstances],
    receives: [...(source.receives || [])],
    situation: [...source.situation],
  };
}

/* REQS intentionally powers both real and hypothetical results. Swap its answer
   model only for this synchronous calculation, then restore the real model before
   returning. Nothing here emits a state change or reaches persistence. */
function evaluateAnswers(answerModel, scopedConfirmations = {}) {
  const realAnswers = answers;
  answers = answerModel;
  try {
    return BENEFITS.map((b) => ({ b, r: evaluate(b, scopedConfirmations) }));
  } finally {
    answers = realAnswers;
  }
}

function scenarioAnswerModel() {
  const model = cloneAnswers();
  for (const change of scenarioChanges.values()) {
    if (change.key === "situation") {
      const set = new Set(model.situation);
      if (change.value) {
        set.delete("none");
        set.add(change.option);
      } else {
        set.delete(change.option);
        if (!set.size) set.add("none");
      }
      model.situation = [...set];
    } else {
      model[change.key] = change.value;
      if (change.key === "ageBand") model.ageGroup = ageGroupForBand(change.value);
      if (change.key === "province" && !(CITIES_BY_PROVINCE[change.value] || []).includes(model.city)) model.city = null;
    }
  }
  return model;
}

function scenarioOptionLabel(step, value) {
  const option = stepOptions(step).find((item) => (typeof item === "object" ? item.value : item) === value);
  return typeof option === "object" ? optionText(step, option) : String(option || value);
}

function scenarioSelect(step, label, options) {
  return `<label class="scenario-field"><span>${label}</span><select class="select-input" data-scenario-select="${step.key}">
    <option value="">${t("scenario.choose")}</option>${options.join("")}
  </select></label>`;
}

function renderScenarioPanel(currentEvaluated) {
  const model = scenarioAnswerModel();
  const controls = [];
  const visible = visibleSteps();
  const age = visible.find((step) => step.key === "ageBand");
  const situation = visible.find((step) => step.key === "situation");
  const income = visible.find((step) => step.key === "income");
  const city = visible.find((step) => step.key === "city");
  const dtc = visible.find((step) => step.key === "dtc");

  if (situation) {
    const options = stepOptions(situation).filter((o) => o.value !== "none").map((o) => {
      const active = model.situation.includes(o.value);
      return `<option value="${o.value}">${active ? t("scenario.stop") : t("scenario.start")} ${optionText(situation, o)}</option>`;
    });
    controls.push(scenarioSelect(situation, t("scenario.situation"), options));
  }
  if (age) controls.push(scenarioSelect(age, t("scenario.age"), stepOptions(age).map((o) => `<option value="${o.value}">${optionText(age, o)}</option>`)));
  if (income) controls.push(scenarioSelect(income, t("scenario.income"), stepOptions(income).map((o) => `<option value="${o.value}">${optionText(income, o)}</option>`)));
  if (city) controls.push(scenarioSelect(city, t("scenario.city"), stepOptions(city).map((value) => `<option value="${value}">${value}</option>`)));
  if (dtc) controls.push(scenarioSelect(dtc, t("scenario.dtc"), stepOptions(dtc).map((o) => `<option value="${o.value}">${optionText(dtc, o)}</option>`)));

  const chips = [...scenarioChanges.values()].map((change) => `<button type="button" class="scenario-chip" data-scenario-remove="${change.id}" aria-label="${t("scenario.remove")} ${change.label}">${change.label}${icon("x")}</button>`).join("");
  let diff = `<p class="scenario-empty">${t("scenario.empty")}</p>`;
  if (scenarioChanges.size) {
    const hypothetical = evaluateAnswers(model, confirmedFacts).filter((e) => benefitInResultsScope(e.b, model));
    const current = new Map(currentEvaluated.map((e) => [e.b.id, e]));
    const changed = new Map(hypothetical.map((e) => [e.b.id, e]));
    // Same presentation classifier as the page, on the hypothetical answers.
    const currentG1 = resultGroups(currentEvaluated, answers).g1;
    const changedG1 = resultGroups(hypothetical, model).g1;
    const inCurrentG1 = new Set(currentG1.map((e) => e.b.id));
    const inChangedG1 = new Set(changedG1.map((e) => e.b.id));
    const gained = changedG1.filter((e) => !inCurrentG1.has(e.b.id));
    const lost = currentG1.filter((e) => !inChangedG1.has(e.b.id));
    const receivedNow = new Set(receivedIds(answers));
    const receivedThen = new Set(receivedIds(model));
    const newlyReady = hypothetical.filter((e) => !receivedThen.has(e.b.id) && e.r.status === "ready" && current.get(e.b.id)?.r.status !== "ready");
    const noLongerReady = currentEvaluated.filter((e) => !receivedNow.has(e.b.id) && e.r.status === "ready" && changed.get(e.b.id)?.r.status !== "ready");
    const row = (key, items, tone) => `<div class="scenario-diff-row ${tone}"><b>${t(key)} <span>${items.length}</span></b>${tone === "ready" ? matchStatusNote("ready") : ""}<p>${items.length ? items.map((e) => e.b.name).join(" · ") : t("scenario.none")}</p></div>`;
    diff = `${row("scenario.gain", gained, "gain")}${row("scenario.lose", lost, "lose")}${row("scenario.newReady", newlyReady, "ready")}${row("scenario.noReady", noLongerReady, "not-ready")}`;
  }

  return `<section class="scenario" aria-labelledby="scenario-title">
    <button type="button" class="scenario-toggle" id="scenario-title" aria-expanded="${scenarioOpen}" aria-controls="scenario-panel">${icon("compass")}<span>${t("scenario.title")}</span>${icon("arrowRight")}</button>
    <div class="scenario-panel" id="scenario-panel"${scenarioOpen ? "" : " hidden"}>
      <p class="scenario-intro">${t("scenario.intro")}</p>
      <div class="scenario-controls">${controls.join("")}</div>
      ${scenarioChanges.size ? `<div class="scenario-active"><span>${t("scenario.active")}</span>${chips}<button type="button" class="linklike scenario-reset">${t("scenario.reset")}</button></div>` : ""}
      <div class="scenario-diff" aria-live="polite" aria-atomic="true">${diff}</div>
      <p class="scenario-estimate"><b>${t("scenario.estimate")}</b> ${t("scenario.note")}</p>
    </div>
  </section>`;
}

// No visit timestamps or previous-results history. Missing/new IDs baseline silently.
function baselineProgramChanges() {
  if (typeof AbilityFinderProgramChanges === "undefined") return;
  let changed = false;
  if (!programChanges) { programChanges = { version: 1, seenByProgram: {} }; changed = true; }
  for (const [id] of CATALOGUE_INDEX) {
    if (!Object.prototype.hasOwnProperty.call(programChanges.seenByProgram, id)) {
      programChanges.seenByProgram[id] = PROGRAM_CHANGE_DATA.watermark;
      changed = true;
    }
  }
  if (changed) void saveState();
}

function pendingProgramUpdates(matched) {
  if (!programChanges) return [];
  const inResults = new Set(matched.map((e) => e.b.id));
  return browseCatalog().flatMap((b) => {
    if (!inResults.has(b.id) && !STAGE[progress[b.id]]) return [];
    const cursor = programChanges.seenByProgram[b.id];
    if (!Number.isSafeInteger(cursor)) return [];
    const changes = PROGRAM_CHANGE_DATA.changes.filter((change) => change.recordId === b.id && change.revision > cursor);
    return changes.length ? [{ b, changes, provenance: inResults.has(b.id) ? "In your results" : "Saved or tracked" }] : [];
  });
}

// Match gen-guide-pages.js: only records with a static official URL get guides.
function hasGeneratedGuide(b) {
  return [b.applyUrl, b.source].some((url) => {
    const staticUrl = typeof url === "function" ? url.staticUrl : url;
    return typeof staticUrl === "string" && /^https?:\/\//.test(staticUrl);
  });
}

function renderProgramUpdates(matched) {
  const pending = pendingProgramUpdates(matched);
  if (!pending.length) return "";
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  return `<section class="program-updates" lang="en" aria-labelledby="program-updates-title">
    <h3 id="program-updates-title">Updates to your programs</h3>
    <p>Details for ${pending.length === 1 ? "1 program" : `${pending.length} programs`} were updated in AbilityFinder.</p>
    <p>These are recorded updates since your last review on this device. They may correct our guide, not a change to the program itself. Other updates may not be listed. The program decides if you qualify.</p>
    <details><summary>Show the updates</summary><ul>${pending.map(({ b, changes, provenance }) => `<li data-updated-program="${esc(b.id)}">
      <h4>${esc(b.name)}</h4><p>${provenance}</p>
      <ul>${changes.map((change) => `<li>Guide update: ${esc(new Date(change.date + "T12:00:00Z").toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }))} — ${esc(change.summary)}</li>`).join("")}</ul>
      <p>${hasGeneratedGuide(b) ? `<a href="/guides/${esc(b.id)}.html">Read the ${esc(b.name)} guide</a> · ` : ""}<a href="${esc(resolveUrl(b.source))}" target="_blank" rel="noopener noreferrer">Official source</a></p>
    </li>`).join("")}</ul></details>
    <button type="button" class="tool-btn" id="hide-program-updates" aria-label="Got it, hide these updates">Got it</button>
    <p id="program-updates-status" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p>
  </section>`;
}

function wireProgramUpdates() {
  const button = document.getElementById("hide-program-updates");
  if (!button) return;
  const panel = button.closest("section");
  const ids = [...panel.querySelectorAll("[data-updated-program]")].map((item) => item.dataset.updatedProgram);
  const watermark = PROGRAM_CHANGE_DATA.watermark; // Capture this notice, not a future catalogue.
  button.addEventListener("click", async () => {
    button.disabled = true;
    const previous = Object.fromEntries(ids.map((id) => [id, programChanges.seenByProgram[id]]));
    for (const id of ids) programChanges.seenByProgram[id] = watermark;
    const saved = await saveState();
    if (!saved && AbilityFinderDB.lastWriteConflict) return; // authoritative reload; never retry stale state
    const status = panel.querySelector("[role=status]");
    if (saved) {
      for (const child of [...panel.children]) if (child !== status) child.remove();
      panel.removeAttribute("aria-labelledby");
      status.textContent = "These updates are marked reviewed on this device.";
    } else {
      // A later unrelated save must not persist an acknowledgment reported as failed.
      Object.assign(programChanges.seenByProgram, previous);
      button.disabled = false;
      status.textContent = "We could not save this review on this device. These updates may appear again next time.";
    }
    status.focus({ preventScroll: true });
  });
}

/* Presentation groups (public/resultsGroups.js). Pure: never changes a status. */
function resultGroups(evaluated, model = answers) {
  return AbilityFinderResultsGroups.classifyResults(evaluated, model, receivedIds(model));
}

// New results copy is English-only for now; mark it so French pages stay honest.
const enOnly = () => (LANG === "en" ? "" : ' lang="en"');

function guideSlug(b) {
  return b.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function guideLink(b, text = t("grp.readGuide")) {
  return `<a class="row-guide-link js-guide-link" href="/guides/${reqEscape(guideSlug(b))}" data-id="${reqEscape(b.id)}">${reqEscape(text)}<span class="sr-only">: ${reqEscape(b.name)}</span></a>`;
}

/* G0: programs the person says they already get. One line each. */
function renderAlreadyGet(items) {
  if (!items.length) return "";
  return `<section class="result-group result-group-have" aria-labelledby="g0-title" lang="en">
    <h2 class="result-group-h" id="g0-title">${t("grp.g0")} (${items.length})</h2>
    <p class="result-group-sub">${t("grp.g0Sub")}</p>
    <ul class="compact-rows">${items.map((e) => `<li class="compact-row" data-result-group="g0" data-id="${reqEscape(e.b.id)}"><b class="cr-name"${recLang(e.b) !== "en" ? ` lang="${recLang(e.b)}"` : ""}>${reqEscape(e.b.name)}</b> — <span class="cr-have">${t("grp.g0Tag")}</span> · ${guideLink(e.b)}</li>`).join("")}</ul>
  </section>`;
}

/* G2: one line each — "If [situation]: [program] — Read the guide". */
function renderOtherPrograms(items) {
  if (!items.length) return "";
  return `<section class="result-group result-group-other" aria-labelledby="g2-title" lang="en">
    <h2 class="result-group-h" id="g2-title">${t("grp.g2")} (${items.length})</h2>
    <p class="result-group-sub">${t("grp.g2Sub")}</p>
    <ul class="compact-rows">${items.map((e) => `<li class="compact-row" data-result-group="g2" data-id="${reqEscape(e.b.id)}"><span class="cr-if">If ${reqEscape(e.situation)}:</span> <b class="cr-name"${recLang(e.b) !== "en" ? ` lang="${recLang(e.b)}"` : ""}>${reqEscape(e.b.name)}</b> — ${guideLink(e.b)}</li>`).join("")}</ul>
  </section>`;
}

/* G3: one closed native disclosure. Only definite contradictions from the
   person's own answers; prerequisite rows name what is needed first. */
function renderNotNow(items) {
  if (!items.length) return "";
  // One sub-list per reason, in this order. Each heading says what is needed
  // first and links to where to start it.
  const REASONS = [
    { reason: "dtc", head: t("grp.g3Dtc"), start: "dtc", link: t("grp.g3DtcLink") },
    { reason: "autism", head: t("grp.g3Autism"), start: null, link: null },
  ];
  const sections = REASONS.map(({ reason, head, start, link }) => {
    const rows = items.filter((e) => e.reason === reason);
    if (!rows.length) return "";
    const startRecord = start && BENEFITS.find((b) => b.id === start);
    return `<div class="later-reason" data-later-reason="${reason}">
      <p class="later-why"><b>${head}</b>${startRecord ? ` — ${guideLink(startRecord, link)}` : ""}</p>
      <ul class="compact-rows">${rows.map((e) => `<li class="compact-row" data-result-group="g3" data-id="${reqEscape(e.b.id)}"><b class="cr-name"${recLang(e.b) !== "en" ? ` lang="${recLang(e.b)}"` : ""}>${reqEscape(e.b.name)}</b> — ${guideLink(e.b)}</li>`).join("")}</ul>
    </div>`;
  }).join("");
  return `<details class="result-group result-group-later" lang="en">
    <summary><h2 class="result-group-h" id="g3-title">${t("grp.g3")} (${items.length})</h2></summary>
    <p class="result-group-sub">${t("grp.g3Sub")}</p>
    ${sections}
  </details>`;
}

function provinceNoticeHtml(code) {
  const n = typeof PROVINCE_NOTICES !== "undefined" ? PROVINCE_NOTICES[code] : null;
  if (!n) return "";
  // A notice may carry a French version (n.fr), shown when the interface is French.
  const v = LANG === "fr" && n.fr ? n.fr : n;
  return `<div class="callout province-notice" role="note" lang="${v === n.fr ? "fr" : "en"}"><span class="co-ic">${icon("info")}</span><div><b>${reqEscape(v.title)}</b><p>${reqEscape(v.lede)}</p><ul>${v.items.map((it) => `<li>${reqEscape(it)}</li>`).join("")}</ul></div></div>`;
}

function localDateFromIso(value) {
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(value || ""));
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +(m[3] || 1));
}
function benefitDateUpcoming(entry, now = new Date()) {
  const candidates = [entry.date, ...(entry.conflict || [])].filter(Boolean).sort();
  const latest = candidates[candidates.length - 1];
  if (!latest) return false;
  const today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  if (/^\d{4}-\d{2}$/.test(latest)) return +latest.replace("-", "") >= Math.floor(today / 100);
  return +latest.replace(/-/g, "") >= today;
}
function benefitDateCalendarEligible(entry) {
  return /^\d{4}-\d{2}-\d{2}$/.test(entry.date) && !entry.expected && !(entry.conflict && entry.conflict.length);
}
function formatBenefitDate(entry) {
  const date = localDateFromIso(entry.date);
  if (!date) return entry.date;
  if (/^\d{4}-\d{2}$/.test(entry.date)) {
    return new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" }).format(date);
  }
  let formatted = new Intl.DateTimeFormat("en-CA", { month: "long", day: "numeric", year: "numeric" }).format(date);
  if (entry.time) {
    const [hour, minute] = entry.time.split(":").map(Number);
    date.setHours(hour, minute, 0, 0);
    formatted += ` at ${new Intl.DateTimeFormat("en-CA", { hour: "numeric", minute: "2-digit", hour12: true }).format(date)}`;
  }
  return formatted;
}
function benefitDateRows(benefits, { upcoming = true, now = new Date() } = {}) {
  const rows = [];
  for (const b of benefits) {
    const entries = typeof BENEFIT_DATES !== "undefined" ? BENEFIT_DATES[b.id] || [] : [];
    entries.forEach((entry, index) => {
      if (!upcoming || benefitDateUpcoming(entry, now)) rows.push({ b, entry, index });
    });
  }
  return rows.sort((a, b) => a.entry.date.localeCompare(b.entry.date));
}
function renderBenefitDates(benefits, options = {}) {
  const rows = benefitDateRows(benefits, options);
  if (!rows.length) return "";
  const staticAsOf = options.staticAsOf || "";
  return `<section class="callout dates-to-know" aria-labelledby="${options.headingId || "dates-to-know-title"}">
    <div><h2 id="${options.headingId || "dates-to-know-title"}">${t("dates.heading")}</h2>
    ${staticAsOf ? `<p>${t("dates.static").replace("{month}", reqEscape(staticAsOf))}</p>` : ""}
    <ul class="dates-list">${rows.map(({ b, entry, index }) => {
      const A = recAttr(b);
      const expected = entry.expected && !/expect/i.test(entry.label) ? ` ${t("dates.expected")}` : "";
      const action = benefitDateCalendarEligible(entry) && !options.noCalendar
        ? `<button class="tool-btn date-calendar" type="button" data-date-program="${reqEscape(b.id)}" data-date-index="${index}" aria-label="${reqEscape(`Add ${b.name} ${entry.label.toLowerCase()} to calendar`)}">${icon("clock")}${t("dates.add")}</button>`
        : `<p class="date-not-final">${t("dates.notFinal")}</p>`;
      return `<li><p class="date-when">${reqEscape(formatBenefitDate(entry))}</p><h3${A}>${reqEscape(entry.label)}${expected}</h3><p><span${A}>${reqEscape(b.name)}</span> — ${guideLink(b)}</p><p${A}>${reqEscape(entry.text)}</p>${action}</li>`;
    }).join("")}</ul></div>
  </section>`;
}

function renderLimitsPanel(hasOtherPrograms) {
  return `<details class="limits-panel">
    <summary>${t("limits.summary")}</summary>
    <ul>
      <li><strong>${t("limits.programsLead")}</strong> ${t("limits.programsBody")} <button class="linklike" type="button" data-nav="coverage">${t("limits.coverage")}</button></li>
      <li><strong>${t("limits.approvalLead")}</strong> ${t("limits.approvalBody")}</li>
      <li><strong>${t("limits.detailsLead")}</strong> ${t("limits.detailsBody")}${hasOtherPrograms ? ` ${t("limits.otherPrograms")}` : ""}</li>
    </ul>
  </details>`;
}

function renderResults() {
  const evaluated = browseCatalog().filter((b) => benefitInResultsScope(b, answers)).map((b) => ({ b, r: evaluate(b) }));
  const groups = resultGroups(evaluated);
  const ready = groups.g1.filter((e) => e.r.status === "ready");
  const almost = groups.g1.filter((e) => e.r.status === "almost");
  // "not a match" excludes programs that belong to a DIFFERENT province
  const no = groups.no.filter((e) => {
    const p = benefitProvince(e.b);
    return !p || p === answers.province;
  });

  // Every in-scope ready/almost program, each exactly once (G1, G2, G3), plus
  // programs the person already gets (G0, any status).
  const matched = [...groups.g0, ...groups.g1, ...groups.g2, ...groups.g3];

  let html = `
  <div class="results-head">
    <h1${enOnly()}>${t("res.title")}</h1>
    ${groups.g1.length ? "" : `<p class="results-need-more"${enOnly()}>${t("res.needMore")}</p>`}
    <p>${resultsBlurb(ready.length, almost.length)}</p>
  </div>
  ${renderBenefitDates([...groups.g1, ...groups.g2].map((e) => e.b))}
  ${provinceNoticeHtml(answers.province)}
  ${renderProgramUpdates(matched)}
  ${renderMoneyBand(ready, almost)}
  <div class="results-tools">
    <button class="tool-btn" id="printList">${icon("print")}${t("res.print")}</button>
    ${groups.g1.length ? `<div class="group-toggle" role="group" aria-label="Show programs to check"${enOnly()}>
      <button class="gt-btn ${groupMode === "priority" ? "on" : ""}" data-group="priority" aria-pressed="${groupMode === "priority"}">${icon("list")}${t("res.byAnswers")}</button>
      <button class="gt-btn ${groupMode === "category" ? "on" : ""}" data-group="category" aria-pressed="${groupMode === "category"}">${icon("grid")}${t("res.byCategory")}</button>
    </div>` : ""}
  </div>
  ${trackerSummary(matched)}
  ${renderAnswerChips()}
  ${renderPrintActionPlan(groups.g1)}`;

  html += renderAlreadyGet(groups.g0);
  html += renderMatchedGroups(ready, almost);
  html += renderOtherPrograms(groups.g2);
  html += renderNotNow(groups.g3);
  html += renderScenarioPanel(evaluated);
  const documents = buildDocumentChecklist(actionPlanBenefits(groups.g1));
  if (documents.length) html += `<details class="document-checklist-details" lang="en"><summary>Documents several programs ask for (${splitDocumentChecklist(documents).shared.length})</summary>${renderDocumentChecklist(documents)}</details>`;

  html += renderMatchedGrants();

  if (no.length) {
    html += `
    <details class="notmatch">
      <summary>${t("nm.summary")} (${no.length}) — ${t("nm.tap")}</summary>
      ${no.map((e) => `
        <div class="nm-item">
          <b>${e.b.name}</b>
          <span class="why">${e.r.reasons[0] || t("nm.default")}</span>
        </div>`).join("")}
    </details>`;
  }

  html += renderSupportsArea();
  html += renderHelpDirectory();
  html += `<button class="btn btn-ghost restart" id="restart">${t("restart")}</button>`;
  html += renderLimitsPanel(groups.g2.length > 0);
  html += `<p class="disclaimer">${t("disclaimer")}</p>`;
  return html;
}

/* which province a benefit belongs to (federal / nationwide → null) */
function benefitInResultsScope(b, model) {
  const provinces = benefitProvinces(b);
  if (provinces.length && !provinces.includes(model.province)) return false;
  if (b.requires.includes("okotoksArea")) {
    return model.province === "AB" && (!model.city || ["Other / my town isn't listed", "Okotoks", "Foothills County"].includes(model.city));
  }
  return true;
}

/* Border cities (Lloydminster) belong to two provinces: a local program there is
   in scope for residents of either. Every other record has exactly one province. */
function benefitProvinces(b) {
  if (SHARED_CITIES[b.level]) return SHARED_CITIES[b.level].filter((p) => p !== "SK" || SK_ENABLED);
  const p = benefitProvince(b);
  return p ? [p] : [];
}

function benefitProvince(b) {
  // Local levels include regional delivery bodies, not only province gates.
  if (benefitIsOntario(b)) return "ON";
  if (benefitIsSaskatchewan(b)) return "SK";
  if (benefitIsManitoba(b)) return "MB";
  if (benefitIsNewBrunswick(b)) return "NB";
  if (benefitIsNovaScotia(b)) return "NS";
  if (benefitIsPrinceEdwardIsland(b)) return "PE";
  if (benefitIsNewfoundlandandLabrador(b)) return "NL";
  if (benefitIsQuebec(b)) return "QC";
  if (benefitIsBritishColumbia(b)) return "BC";
  if (b.level === "Alberta" || ALBERTA_CITIES.includes(b.level) || b.level === "Spruce Grove area") return "AB";
  const r = b.requires;
  if (r.includes("ab") || r.includes("calgary") || r.includes("edmonton")) return "AB";
  for (const p of ["bc", "on", "qc", "mb", "sk", "ns", "nb", "nl", "pe", "yt", "nt", "nu"])
    if (r.includes(p)) return p.toUpperCase();
  return null;
}

/* supports & strategies — their own collapsible category sections */
function renderSupportsArea() {
  const matched = SUPPORTS.filter(supportMatches);
  if (!matched.length) return "";
  /* Low-barrier ideas are kept separate from benefits. Some linked services can
     still have intake steps, fees or waits, so the framing never promises that
     every resource is immediate or application-free. */
  const totalTips = matched.reduce((n, s) => n + (s.tips ? s.tips.length : 0), 0);
  const sections = SUPPORT_CATEGORIES.map((c) => {
    const items = matched.filter((s) => s.cat === c.cat);
    if (!items.length) return "";
    const preview = items.map((i) => i.title).join(" · ");
    const tipCount = items.reduce((n, i) => n + (i.tips ? i.tips.length : 0), 0);
    return `
    <details class="support-section">
      <summary>
        <span class="ss-ic">${icon(c.icon)}</span>
        <span class="ss-body">
          <span class="ss-name">${c.cat}</span>
          <span class="ss-preview">${preview}</span>
        </span>
        <span class="count" title="${tipCount} practical tip${tipCount === 1 ? "" : "s"}">${tipCount}</span>
        <span class="ss-chev">${icon("arrowRight")}</span>
      </summary>
      <div class="support-list">${items.map(renderSupportCard).join("")}</div>
    </details>`;
  }).join("");
  return `
  <div class="supports-area">
    <h2 class="supports-heading">${t("supports.heading")}</h2>
    <p class="supports-sub">${t("supports.sub")}</p>
    <div class="supports-hook">
      <span class="sh-num" aria-hidden="true">${totalTips}</span>
      <p>practical ideas matched to ${who().poss === "your" ? "your" : poss()} answers.
        <b>Some can be tried without an application</b>; linked services may still have
        intake steps, costs or wait lists. Start with one manageable step.</p>
    </div>
    ${sections}
  </div>`;
}

/* human-help directory — real orgs that help people GET the benefits */
function renderHelpOrg(o) {
  const tel = o.phone
    ? `<a class="help-phone" href="tel:${o.phone.replace(/[^0-9+]/g, "")}">${icon("phone")}${o.phone}</a>`
    : "";
  const web = o.url
    ? `<a class="help-web" href="${o.url}" target="_blank" rel="noopener noreferrer" data-ext>${icon("external")}${o.urlText}</a>`
    : "";
  return `
  <div class="help-card">
    <h3>${o.name}</h3>
    <p class="summary"${recAttr(o)}>${o.summary}</p>
    <div class="help-actions">${tel}${web}</div>
  </div>`;
}
function renderHelpDirectory() {
  if (typeof HELP_ORGS === "undefined" || !HELP_ORGS.length) return "";
  const sections = HELP_CATEGORIES.map((c) => {
    const orgs = HELP_ORGS.filter((o) => o.cat === c.cat && coverageApplies(o));
    if (!orgs.length) return "";
    return `
    <div class="help-group">
      <div class="help-group-h">
        <span class="hg-ic">${icon(c.icon)}</span>
        <span class="hg-text"><b>${c.cat}</b><span class="hg-blurb">${c.blurb}</span></span>
      </div>
      <div class="help-list">${orgs.map(renderHelpOrg).join("")}</div>
    </div>`;
  }).join("");
  return `
  <div class="help-area">
    <h2 class="supports-heading">${icon("help")} Real people who can help</h2>
    <p class="supports-sub">You don't have to do this alone. These ${PROVINCE_NAME[answers.province] ? `${PROVINCE_NAME[answers.province]} and national` : SCOPE_ORGANIZATIONS} organizations can help with forms, appeals and local services. Each card says what it offers; confirm any fees when you contact them.</p>
    ${sections}
  </div>`;
}

/* Charitable funding is not a government entitlement. These matches use only
   explicit directory rules and are deliberately phrased as leads to check. */
function grantMatchesAnswers(grant) {
  if (!grant || grant.matchOnResults === false || !coverageApplies(grant)) return false;
  const age = answers.ageBand;
  const childProfile = answers.forWho === "child" || ["under6", "6to11", "12to15", "16to17"].includes(age);
  if (grant.audience === "children" && !childProfile) return false;
  if (grant.audience === "adults" && childProfile) return false;
  if (grant.ageBands && grant.ageBands.length && !grant.ageBands.includes(age)) return false;
  if (grant.disabilities && grant.disabilities.length && !grant.disabilities.some((d) => hasDisability(d))) return false;
  if (grant.situations && grant.situations.length && !grant.situations.some((s) => answers.situation.includes(s))) return false;
  if (grant.functionalNeeds && grant.functionalNeeds.length && !grant.functionalNeeds.some((need) => hasFunctionalNeed(need))) return false;
  if (grant.cities && grant.cities.length && !grant.cities.includes(answers.city)) return false;
  if (grant.lowIncome && answers.income === "high") return false;
  return true;
}

function renderMatchedGrants() {
  const directory = typeof GRANTS_DIRECTORY !== "undefined" && Array.isArray(GRANTS_DIRECTORY)
    ? GRANTS_DIRECTORY
    : [];
  const grants = directory.filter(grantMatchesAnswers);
  const cards = grants.map((grant) => `<article class="result-grant" data-result-grant="${ttsEscape(grant.id)}">
    <div><span class="program-kind charity">Charitable fund</span><h3>${ttsEscape(grant.name)}</h3>
    <p>${ttsEscape(grant.offers)}</p><small>${ttsEscape(grant.org)} · ${coverageLabel(grant)}</small></div>
    <a class="apply" href="${ttsEscape(grant.url)}" target="_blank" rel="noopener noreferrer">Check full rules ${icon("external")}</a>
  </article>`).join("");
  return `<section class="matched-grants" aria-labelledby="matched-grants-title">
    <p class="section-label">Separate from government programs</p>
    <h2 id="matched-grants-title">Charitable funds worth checking</h2>
    <p>${grants.length ? "These leads fit the broad answers you gave, but charities use their own detailed rules, budgets and deadlines." : "No charitable fund in the current directory closely matched every broad answer you gave. The full directory may still contain a diagnosis-specific or local fund the questionnaire cannot safely identify."} These are not confirmed eligibility and are not included in the benefit count above.</p>
    ${grants.length ? `<div class="result-grants-grid">${cards}</div>` : ""}
    <button class="linklike" type="button" data-info-nav="grants">Browse the full grants and charitable funds directory ${icon("arrowRight")}</button>
  </section>`;
}

function resultsBlurb(readyN, almostN) {
  return t("res.acknowledgement");
}

// Copy only: keep match statuses separate from user-recorded application progress.
function matchStatusLabel(status) {
  return t(status === "ready" ? "grp.ready" : status === "almost" ? "grp.almost" : "nm.summary");
}
function matchStatusNote(status) {
  return status === "ready" ? `<p class="match-note">${t("det.eligible")}</p>` : "";
}

function groupTitle(kind, ic, text, count) {
  return `<div class="group-title ${kind}"><span class="gi">${icon(ic)}</span>${text}<span class="count">${count}</span></div>`;
}

/* Program type says what a result actually is. This avoids presenting a tax
   credit, funded service, transit pass and charitable fund as the same thing. */
const PROGRAM_TYPES = [
  { key: "income", label: "Income benefits", badge: "Income benefit", icon: "money" },
  { key: "tax", label: "Tax credits", badge: "Tax credit", icon: "check" },
  { key: "grant", label: "Government grants & bursaries", badge: "Government grant/bursary", icon: "education" },
  { key: "service", label: "Funded services & supports", badge: "Funded service/support", icon: "family" },
  { key: "health", label: "Health & equipment coverage", badge: "Health/equipment coverage", icon: "health" },
  { key: "discount", label: "Discounts, passes & permits", badge: "Discount/pass/permit", icon: "transit" },
  { key: "savings", label: "Savings plans", badge: "Savings plan", icon: "key" },
];
function benefitType(b) {
  const value = BENEFIT_VALUES[b.id] || {};
  const category = (b.category || "").toLowerCase();
  if (b.id === "rdsp") return "savings";
  if (value.kind === "taxCredit") return "tax";
  if (value.kind === "grant") return "grant";
  if (/grant|bursary/i.test(b.name || "")) return "grant";
  if (["coverage"].includes(value.kind) || category.includes("health") || category.includes("equipment")) return "health";
  if (["discount", "access"].includes(value.kind) || category.includes("transit") || category.includes("recreation") || category.includes("getting around")) return "discount";
  if (value.kind === "services" || category.includes("employ") || category.includes("family") || category.includes("daily living")) return "service";
  return "income";
}

/* The browse directory keeps the broader topic filters people already know;
   result cards and grouping use the more precise program taxonomy above. */
const THEMES = [
  { key: "money", label: "Money & income", icon: "money" },
  { key: "health", label: "Health & equipment", icon: "health" },
  { key: "getting-around", label: "Getting around", icon: "transit" },
  { key: "employment", label: "Work & employment", icon: "working" },
  { key: "education", label: "Education", icon: "education" },
  { key: "family", label: "Family & daily living", icon: "family" },
];
function benefitTheme(b) {
  const c = (b.category || "").toLowerCase();
  if (c.includes("money") || c.includes("tax") || c.includes("savings")) return "money";
  if (c.includes("employ") || c.includes("work")) return "employment";
  if (c.includes("education")) return "education";
  if (c.includes("health") || c.includes("equipment")) return "health";
  if (c.includes("getting around") || c.includes("recreation") || c.includes("transit")) return "getting-around";
  return "family";
}
function benefitTypeLabel(b) {
  const type = PROGRAM_TYPES.find((entry) => entry.key === benefitType(b));
  return type ? type.badge : "Government program";
}

/* G1 "Programs to check": full cards, already in evidence order (ready first,
   then fewer unmet checks, then name). "By category" regroups the same G1
   items by program type; it never pulls in G2/G3 items. No rank badges: the
   order is not an editorial priority. */
function renderMatchedGroups(ready, almost) {
  const g1 = [...ready, ...almost];
  if (!g1.length) return "";
  let h = `<section class="result-group result-group-main" aria-labelledby="g1-title">
    <h2 class="result-group-h" id="g1-title"${enOnly()}>${t("grp.g1")} (${g1.length})</h2>`;
  if (groupMode === "category") {
    h += PROGRAM_TYPES.map((th) => {
      const items = g1.filter((e) => benefitType(e.b) === th.key);
      if (!items.length) return "";
      return groupTitle(th.key, th.icon, th.label, items.length) +
        `<div class="benefits-grid">${items.map((e) => benefitCard(e.b, e.r)).join("")}</div>`;
    }).join("");
  } else {
    if (ready.length) {
      h += groupTitle("ready", "check", t("grp.ready"), ready.length) + matchStatusNote("ready");
      h += `<div class="benefits-grid">${ready.map((e) => benefitCard(e.b, e.r)).join("")}</div>`;
    }
    if (almost.length) {
      const isPrimary = !ready.length;
      h += groupTitle(`almost${isPrimary ? " primary" : ""}`, "key", t(isPrimary ? "grp.almostOnly" : "grp.almost"), almost.length);
      h += `<div class="benefits-grid">${almost.map((e) => benefitCard(e.b, e.r)).join("")}</div>`;
    }
  }
  return h + "</section>";
}

/* a compact "where am I" strip above the results (only shows active stages) */
/* ── Reminders as a calendar file ─────────────────────────────────────────────
   The 14-list asked for renewal reminders. Doing that with email/SMS would mean
   storing an address — i.e. holding disability data about an identifiable
   person, breaking the promise on the landing page, for the one population that
   can least afford a breach. A downloaded .ics needs no account, no address, no
   server: the visitor's own calendar does the reminding, offline, forever, even
   if this site disappears. */

/** "8–20 weeks" → 140 days. "at tax time" → null (we will not invent a date). */
function waitToDays(wait) {
  const s = String(wait || "").toLowerCase();
  const range = /(\d+)\s*[–-]\s*(\d+)\s*(week|month)/.exec(s);
  const single = /~?\s*(\d+)\s*(week|month)/.exec(s);
  const m = range ? { n: +range[2], unit: range[3] } : single ? { n: +single[1], unit: single[2] } : null;
  if (!m) return null; // "at tax time", "next CCB payment", "same day to open"…
  return m.unit === "month" ? m.n * 31 : m.n * 7;
}

const icsDate = (d) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

const icsUtcTimestamp = (d) =>
  `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}` +
  `T${String(d.getUTCHours()).padStart(2, "0")}${String(d.getUTCMinutes()).padStart(2, "0")}${String(d.getUTCSeconds()).padStart(2, "0")}Z`;

function addCalendarDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/** RFC 5545 TEXT escaping — a stray comma silently corrupts the file otherwise. */
const icsEsc = (s) =>
  String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/**
 * Fold to 75 OCTETS, continuation lines start with a space (RFC 5545 §3.1).
 *
 * Octets, not characters: our own data is full of en/em dashes ("8–20 weeks"),
 * which are 3 bytes each in UTF-8 — a 75-character line can be 79 bytes. Also
 * never splits mid-character, which would corrupt the file.
 */
function icsFold(line) {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out = [];
  let cur = "";
  let limit = 75; // continuation lines lose one octet to the leading space
  for (const ch of line) {
    if (enc.encode(cur + ch).length > limit) {
      out.push(cur);
      cur = ch;
      limit = 74;
    } else {
      cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out[0] + (out.length > 1 ? "\r\n " + out.slice(1).join("\r\n ") : "");
}

function buildCalendarIcs(events, now = new Date()) {
  const stamp = icsUtcTimestamp(now);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AbilityFinder//Reminders//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT", `UID:${e.uid}`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(e.date)}`,
      `DTEND;VALUE=DATE:${icsDate(addCalendarDays(e.date, 1))}`,
      icsFold(`SUMMARY:${icsEsc(e.summary)}`),
      icsFold(`DESCRIPTION:${icsEsc(e.desc)}`),
      "TRANSP:TRANSPARENT"
    );
    for (const trigger of e.alarms || ["PT9H"]) lines.push(
      "BEGIN:VALARM", `TRIGGER:${trigger}`, "ACTION:DISPLAY",
      icsFold(`DESCRIPTION:${icsEsc(e.summary)}`), "END:VALARM"
    );
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

function benefitDateEvent(b, entry) {
  const official = resolveUrl(b.applyUrl || b.source);
  return {
    uid: `date-${b.id}-${entry.date.replace(/-/g, "")}@abilityfinder.ca`,
    date: localDateFromIso(entry.date),
    summary: `${entry.label}: ${b.name}`,
    desc: `${entry.text} Official page: ${official}`,
    alarms: ["-P6DT15H", "PT9H"],
  };
}
function buildBenefitDateIcs(b, entry, now = new Date()) {
  return buildCalendarIcs([benefitDateEvent(b, entry)], now);
}
function downloadBenefitDate(id, index) {
  const b = BENEFITS.find((item) => item.id === id);
  const entry = b && BENEFIT_DATES[id] && BENEFIT_DATES[id][index];
  if (!b || !entry || !benefitDateCalendarEligible(entry)) return false;
  const blob = new Blob([buildBenefitDateIcs(b, entry)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `abilityfinder-${id}-date.ics`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

function buildReminderIcs() {
  const now = new Date();
  const events = [];
  const addDays = (n) => addCalendarDays(now, n);

  // Follow-ups for anything submitted / waiting, dated from the benefit's own
  // published wait. Only where that wait is actually a duration.
  for (const b of BENEFITS) {
    const stage = progress[b.id];
    if (stage !== "submitted" && stage !== "waiting") continue;
    const days = waitToDays(BENEFIT_META[b.id] && BENEFIT_META[b.id].wait);
    if (!days) continue;
    const phone = (b.detail && b.detail.phone) ? ` You can call: ${b.detail.phone}.` : "";
    events.push({
      uid: `followup-${b.id}-${icsDate(addDays(days))}@abilityfinder.ca`,
      date: addDays(days),
      summary: `Follow up: ${b.name}`,
      desc:
        `You marked this as ${STAGE[stage].label.toLowerCase()} on ${now.toLocaleDateString("en-CA")}. ` +
        `The usual wait is ${BENEFIT_META[b.id].wait}. If you have not heard back, it is worth chasing —` +
        ` applications do get lost, and chasing is normal.${phone}`,
    });
  }

  // Amounts and rules change every year; a yearly nudge costs nothing.
  events.push({
    uid: `recheck-${icsDate(addDays(365))}@abilityfinder.ca`,
    date: addDays(365),
    summary: "Re-check your disability benefits (AbilityFinder)",
    desc:
      "Benefit amounts and income rules change most years, and new programs appear. " +
      "Re-run the questions at https://abilityfinder.ca to see if anything changed for you.",
  });

  // Exact, non-conflicting dates for every program the person has chosen to track.
  for (const b of BENEFITS) {
    if (!progress[b.id] || !STAGE[progress[b.id]]) continue;
    for (const entry of BENEFIT_DATES[b.id] || []) {
      if (benefitDateUpcoming(entry, now) && benefitDateCalendarEligible(entry)) events.push(benefitDateEvent(b, entry));
    }
  }

  return { ics: buildCalendarIcs(events, now), count: events.length };
}

function downloadReminders() {
  const { ics, count } = buildReminderIcs();
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "abilityfinder-reminders.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return count;
}

function trackerSummary(matched) {
  const counts = {};
  matched.forEach((e) => { const s = progress[e.b.id]; if (s && STAGE[s]) counts[s] = (counts[s] || 0) + 1; });
  const active = STAGES.filter((s) => counts[s.key]);
  if (!active.length) return "";
  const pills = active
    .map((s) => `<span class="ts-pill ${s.cls}">${icon(s.ic)}<b>${counts[s.key]}</b> ${s.short}</span>`)
    .join("");
  const waitingCount = (counts.submitted || 0) + (counts.waiting || 0);
  const remindLbl = waitingCount
    ? "Remind me to follow up"
    : "Add a yearly re-check to my calendar";
  return `<div class="tracker-summary" aria-label="Your application progress">
    <span class="ts-lbl">${icon("compass")} Your progress</span>${pills}
    <button class="ts-remind" id="tsRemind" type="button">${icon("clock")} ${remindLbl}</button>
  </div>`;
}

/* per-card progress control: pick a stage from Not started → Approved/Denied */
function statusControl(b) {
  const cur = progress[b.id] || "";
  const st = STAGE[cur];
  const opts = `<option value="">Not started</option>` +
    STAGES.map((s) => `<option value="${s.key}"${cur === s.key ? " selected" : ""}>${s.label}</option>`).join("");
  return `<span class="track ${st ? st.cls : "none"}">
    <span class="track-ic" aria-hidden="true">${icon(st ? st.ic : "bookmark")}</span>
    <select class="track-sel" data-track="${b.id}" aria-label="Track your progress for ${b.name}">${opts}</select>
  </span>`;
}

// Display-only requirements helpers. Never use actor metadata in eligibility.
function reqEscape(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function reqCount(n) {
  return t(n === 1 ? "req.count.one" : "req.count.other").replace("{n}", n);
}
/* Requirement lists sit in lang="en" containers; a gate written in French
   (Québec route gates carry lang: "fr") marks its own item. */
function needLang(n) {
  return n && n.lang && n.lang !== "en" ? ` lang="${n.lang}"` : "";
}
function reqPrint(needs) {
  return needs.length ? `<section lang="en"><h2>${t("req.heading")}</h2><ul>${needs.map(n => `<li${needLang(n)}>${reqEscape(n.text)}</li>`).join("")}</ul></section>` : "";
}
function renderRequirements(b, needs, surface = "detail", nextAction = null) {
  const heading = reqEscape(`req-${surface}-${b.id}`);
  const level = surface === "inline" ? 4 : 2;
  const groups = ["you", "professional", "program", "shared", "other"];
  const groupFor = n => !n.short ? "other" : n.who.length > 1 ? "shared" : n.who[0];
  const ordered = groups.flatMap(g => needs.filter(n => groupFor(n) === g));
  const migrated = ordered.filter(n => n.short);
  const direct = migrated.length === 1 && migrated[0].short === migrated[0].text;
  const action = n => n.action && !(n.action.url === nextAction?.action.url && n.action.text === nextAction?.action.text)
    ? `<a class="req-action" lang="en" href="${reqEscape(n.action.url)}" target="_blank" rel="noopener noreferrer" data-ext>${reqEscape(n.action.text)}</a>` : "";
  return `<section class="side-next req-checks" lang="en" aria-labelledby="${heading}">
    <h${level} id="${heading}" tabindex="-1">${t("req.heading")}</h${level}>
    <p class="req-context">${t("req.context")}</p>
    <div data-fact-requirements="${b.id}">${groups.map(g => {
      const rows = ordered.filter(n => groupFor(n) === g);
      return rows.length ? `<div class="req-group${g === "other" ? " req-fallback" : ""}"><h${level + 1} class="req-group-title">${t(`req.${g}`)}</h${level + 1}><ul class="req-list" lang="en">${rows.map(n => `<li class="req-cue" data-req-key="${reqEscape(n.key)}"${needLang(n)}>${reqEscape(n.short || n.text)}${!n.short || direct ? action(n) : ""}</li>`).join("")}</ul></div>` : "";
    }).join("")}
    ${migrated.length && !direct ? `<details class="req-full"><summary>${reqEscape(t("req.full").replace("{name}", () => b.name))}</summary><ol class="req-full-list" lang="en">${migrated.map(n => `<li data-req-key="${reqEscape(n.key)}"${needLang(n)}><p class="req-cue">${reqEscape(n.short)}</p><p class="req-wording">${reqEscape(n.text)}</p>${action(n)}</li>`).join("")}</ol></details>` : ""}
  </div>${factChecks(b, surface)}</section>`;
}
function reqPreview(b, needs) {
  const shown = needs.filter(n => n.short).slice(0, 3);
  if (needs.length === 1 && !needs[0].short && [...needs[0].text].length <= 120) shown.push(needs[0]);
  const more = needs.length - shown.length;
  const slug = b.id.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `<section class="needs req-preview" lang="en" aria-labelledby="req-card-${reqEscape(b.id)}"><h4 class="needs-h" id="req-card-${reqEscape(b.id)}">${t("req.heading")}</h4><div data-fact-requirements="${b.id}"><p class="req-count">${reqCount(needs.length)}</p>${shown.length ? `<ul class="req-list" lang="en">${shown.map(n => `<li class="req-cue"${needLang(n)}>${reqEscape(n.short || n.text)}</li>`).join("")}</ul>` : ""}${more ? `<p class="req-other">${t("req.otherChecks").replace("{n}", more)}</p>` : ""}<a class="req-guide-link js-req-guide" href="/guides/${reqEscape(slug)}" data-id="${reqEscape(b.id)}">${reqEscape(t("req.guide").replace("{name}", () => b.name))}</a></div>${factChecks(b, "card")}</section>`;
}

function factChecks(b, surface) {
  const gates = AbilityFinderState.FACT_REGISTRY[b.id];
  if (!gates || !wizardDone() || evaluate(b).status === "no") return "";
  return `<details class="fact-checks" lang="en" data-fact-checks="${b.id}"><summary>Check this fact (optional)</summary>
    ${answers.forWho !== "self" ? "<p>Answer about the person this benefit is for.</p>" : ""}
    <p>Tell us only yes, no, or not sure. Do not enter any ID numbers. These answers stay on this device. The program still decides.</p>
    ${Object.entries(gates).map(([key, gate]) => `<p>${reqEscape(gate.help.replace(/\byour\b/g, poss()))}</p>${Object.entries(gate.components).map(([component, question]) => {
      const subjectQuestion = question.replace("Are you", who().areQ).replace("approved you", `approved ${subj()}`);
      const name = `fact-${surface}-${b.id}-${key}-${component}`;
      return `<fieldset><legend>${reqEscape(b.name + ": " + subjectQuestion)}</legend>${[ ["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"] ].map(([value, label]) => `<label><input type="radio" name="${name}" data-fact-id="${b.id}" data-fact-gate="${key}" data-fact-component="${component}" value="${value}" ${confirmedFacts[b.id]?.[key]?.components[component] === value ? "checked" : ""}>${label}</label>`).join("")}</fieldset>`;
    }).join("")}`).join("")}
    <button type="button" class="guide-toggle" data-clear-facts="${b.id}">Clear these checks</button>
    <p class="fact-live" role="status" aria-live="polite"></p>
  </details>`;
}
function wireFactChecks() {
  const update = async (id, control, clear = false) => {
    const b = BENEFITS.find(b => b.id === id);
    const before = evaluate(b).status;
    if (clear) delete confirmedFacts[id];
    else {
      const key = control.dataset.factGate;
      const gate = AbilityFinderState.FACT_REGISTRY[id][key];
      confirmedFacts[id] ||= {};
      confirmedFacts[id][key] ||= { version: gate.version, components: {} };
      confirmedFacts[id][key].components[control.dataset.factComponent] = control.value;
    }
    const r = evaluate(b);
    // Never replace the focused control or regroup cards during an answer edit.
    document.querySelectorAll(`[data-fact-status="${id}"]`).forEach(el => {
      el.textContent = matchStatusLabel(r.status);
      el.classList.remove("ready", "almost", "no"); el.classList.add(r.status);
      const parent = el.parentElement;
      parent.querySelectorAll(":scope > .match-note, :scope > .checked-facts-note").forEach(n => n.remove());
      el.insertAdjacentHTML("afterend", matchStatusNote(r.status) + (r.checkedFacts ? '<p class="checked-facts-note" lang="en">Includes facts you checked on this device.</p>' : ""));
    });
    document.querySelectorAll(`[data-fact-program="${id}"]`).forEach(el => {
      el.classList.remove("ready", "almost", "no"); el.classList.add(r.status);
    });
    document.querySelectorAll(`[data-fact-requirements="${id}"]`).forEach(el => {
      el.innerHTML = `<p class="req-count">${reqCount(r.needs.length)}</p>${r.needs.length ? `<ul class="req-list">${r.needs.map(n => `<li class="req-cue">${reqEscape(n.text)}</li>`).join("")}</ul>` : ""}`;
    });
    document.querySelectorAll(`[data-fact-checks="${id}"]`).forEach(el => {
      el.querySelectorAll("input").forEach(input => { input.checked = confirmedFacts[id]?.[input.dataset.factGate]?.components[input.dataset.factComponent] === input.value; });
      el.querySelector(".fact-live").textContent = el.contains(control)
        ? before !== "ready" && r.status === "ready" ? "Matches your answers. The program still decides." : before === "ready" && r.status !== "ready" ? "Checks updated." : clear ? "Checks cleared." : ""
        : "";
    });
    const saved = await saveState();
    if (!saved) document.querySelectorAll(`[data-fact-checks="${id}"] .fact-live`).forEach(el => { el.textContent = "Not saved on this device."; });
  };
  document.querySelectorAll("[data-fact-id]").forEach(input => input.addEventListener("change", () => { void update(input.dataset.factId, input); }));
  document.querySelectorAll("[data-clear-facts]").forEach(button => button.addEventListener("click", () => { void update(button.dataset.clearFacts, button, true); }));
}

function benefitCard(b, r, rank) {
  const stage = progress[b.id] || "";
  const rankBadge = rank ? `<span class="rank-badge" title="Our rough order, not official advice">${rank}</span>` : "";
  const needsHtml =
    (r.status === "almost" && r.needs.length) || (r.status !== "no" && AbilityFinderState.FACT_REGISTRY[b.id])
      ? reqPreview(b, r.needs) : "";

  const v = valueParts(b);
  const valueHtml = `<span class="amount">${v.est ? `<span class="amount-tag">Published maximum</span>` : ""}<span${recAttr(b)}>${v.head}</span></span>${v.sub ? `<span class="amount-sub"${recAttr(b)}>${v.sub}</span>` : ""}`;
  return `
  <div data-fact-program="${b.id}" class="benefit ${r.status} ${stage ? "stage-" + stage : ""}">
    <div class="benefit-row">
      <div class="benefit-main">
        <div class="top">
          ${rankBadge}
          <h3 id="benefit-title-${b.id}"${recAttr(b)}>${b.name}</h3>
          <span class="program-kind ${benefitType(b)}">${benefitTypeLabel(b)}</span>
          <span class="tag lvl">${b.level}</span>
        </div>
        <span class="tag match-status" data-fact-status="${b.id}">${matchStatusLabel(r.status)}</span>
        ${matchStatusNote(r.status)}${r.checkedFacts ? '<p class="checked-facts-note" lang="en">Includes facts you checked on this device.</p>' : ""}
        ${statusBadge(b)}<p class="summary"${recAttr(b)}>${b.summary}</p>
        ${metaRow(b)}
        ${needsHtml}
      </div>
      <div class="benefit-side">
        <div class="benefit-value">${valueHtml}</div>
        <div class="benefit-actions">
          <button class="apply js-detail" type="button" data-id="${b.id}">${t("guide.how")} ${icon("arrowRight")}</button>
          <button class="guide-toggle" id="guide-toggle-${b.id}" type="button" data-guide-toggle="${b.id}" aria-expanded="${expandedBenefitIds.has(b.id)}" aria-controls="guide-panel-${b.id}">
            <span class="guide-toggle-label">${expandedBenefitIds.has(b.id) ? t("guide.close") : t("guide.full")}</span>
            <span class="guide-toggle-icon" aria-hidden="true">${icon("arrowRight")}</span>
          </button>
          ${statusControl(b)}
        </div>
      </div>
    </div>
    <div class="inline-guide" id="guide-panel-${b.id}" role="region" aria-labelledby="guide-toggle-${b.id} benefit-title-${b.id}" ${expandedBenefitIds.has(b.id) ? "" : "hidden"}>
      ${renderGuideBody(b, r, { inline: true })}
    </div>
  </div>`;
}

/* editable summary of the user's answers */
function valueLabel(step, val) {
  // MUST go through stepOptions(): a step's `options` may be a function (so its
  // labels can address the right person), and `city` builds its list from the
  // province. Reading step.options directly here threw
  // "(step.options || []).find is not a function" and took the whole results
  // page down — renderResults() throws, #app is never written, blank screen.
  const o = (stepOptions(step) || []).find((x) => x.value === val);
  return o ? optionText(step, o) : val == null ? "—" : String(val);
}
function answerSummary(step) {
  const v = answers[step.key];
  if (step.type === "multi") return v && v.length ? v.map((x) => valueLabel(step, x)).join(", ") : "—";
  if (step.id === "city") return v || "—";
  return v == null ? "—" : valueLabel(step, v);
}
function renderAnswerChips() {
  const chips = visibleSteps()
    .map((s, i) => `<button class="chip" data-edit="${i}" title="${stepText(s).q}">${answerSummary(s)}</button>`)
    .join("");
  return `<div class="answers-bar">
    <span class="answers-lbl">${t("res.yourAnswers")}</span>
    <div class="chips">${chips}</div>
  </div>`;
}

/* which form a practitioner has to sign, per benefit (for the doctor-finder) */
const PRACTITIONER_FORMS = {
  dtc: "the Disability Tax Credit certificate (Form T2201)",
  "cpp-disability": "the CPP disability medical report (ISP-2519)",
  aish: "the Disability Assistance Medical Report (for the combined AISH/ADAP application)",
  adap: "the Disability Assistance Medical Report (for the combined AISH/ADAP application)",
  "parking-placard": "the accessible parking placard form",
  "on-parking-permit": "the Accessible Parking Permit application",
  odsp: "the ODSP Disability Determination Package",
  "on-adp": "the ADP application form for your device type",
  ssah: "the SSAH documentation of your child's functional limitations",
  "passport-program": "the determination of a developmental disability by a psychologist or psychological associate",
};

/* "Find a/an <type>" with the correct article */
const findLabel = (type) => `Find a${/^[aeiou]/i.test(type) ? "n" : ""} ${type}`;

/* Personalized, form-aware "find a practitioner near you" block. */
function practitionerFinder(b) {
  // The general disability-to-practitioner hint is not safe for the DTC:
  // specialists may certify only the CRA categories in the matrix below.
  // Default DTC search to a universally authorized signer.
  const isDtc = b && b.id === "dtc";
  const type = isDtc ? "family doctor" : practitionerType();
  const formName = (b && PRACTITIONER_FORMS[b.id]) || "your disability form";
  const formFlag = `
    <div class="finder-flag">${icon("check")}
      <span>You'll need a practitioner willing to complete <b>${formName}</b>. Not every clinic does these — it's worth calling ahead to ask.</span>
    </div>`;
  /* Other people who can sign this form, where the official program source
     treats them as interchangeable signers. DTC is handled by its scoped
     matrix instead. */
  const shown = new Set([type, "family doctor"]);
  const others = ((b && BENEFIT_SIGNERS[b.id]) || []).filter((s) => !shown.has(s));
  const signerChips = others.length
    ? `<div class="finder-signers">
        <p class="fs-lead">Any of these can sign this form — whoever you can get in to see soonest:</p>
        <div class="fs-chips">
          ${others
            .map(
              (s) =>
                `<a class="fs-chip finder-search" data-ptype="${s}" href="${mapsSearchUrl(s)}" target="_blank" rel="noopener noreferrer" data-ext>${findLabel(s)} ${icon("external")}</a>`
            )
            .join("")}
        </div>
      </div>`
    : "";
  const dtcSignerMatrix = isDtc
    ? `<div class="finder-signers">
        <p class="fs-lead">Who can certify depends on the functional category. A medical doctor or nurse practitioner can certify every category; the other professions are limited:</p>
        <div class="fs-chips">
          ${DTC_SIGNER_SCOPES.map(
            (entry) =>
              `<a class="fs-chip finder-search" data-ptype="${entry.search}" href="${mapsSearchUrl(entry.search)}" target="_blank" rel="noopener noreferrer" data-ext><b>${entry.name}</b> — ${entry.scope} ${icon("external")}</a>`
          ).join("")}
        </div>
        <p class="finder-note">Do not book a limited-scope professional unless the affected function matches the category they are allowed to certify. <a href="${DTC_SIGNER_SOURCE}" target="_blank" rel="noopener noreferrer" data-ext>Check the current CRA matrix ${icon("external")}</a></p>
      </div>`
    : "";

  /* (B) Without the wizard we can only guess "family doctor". Say so, instead of
     quietly showing the weakest option as if it were tailored. */
  const wizardNudge = !wizardDone()
    ? `<p class="finder-nudge">${icon("info")}
        <span>This is the general default. <button type="button" class="linkish" data-finder-wizard>Answer a few questions</button> and it will show the kind of practitioner that fits your situation.</span>
      </p>`
    : "";

  const askTips = `
    <div class="finder-ask">
      <div class="finder-ask-h">What to ask when you call a clinic</div>
      <ul>
        <li>“Do you complete disability forms like ${formName}?”</li>
        <li>“Is there a fee to fill it out, and how much?” — form fees vary and usually aren't covered by your provincial health plan, so it's fair to ask up front.</li>
        <li>“How long is the wait for an appointment to get it done?”</li>
        <li>Book a longer appointment and bring concrete examples of how your condition limits your daily life — it makes the form much stronger.</li>
      </ul>
    </div>`;
  return `
  <div class="guide-block finder">
    <div class="guide-h">${icon("compass")} ${t("finder.title")}</div>
    <p class="finder-lead">${t("finder.lead")}</p>
    ${formFlag}
    <div class="finder-row">
      <label for="finderPostal">${t("finder.postalLabel")}</label>
      <input id="finderPostal" class="text-input finder-postal" data-finder-postal inputmode="text" placeholder="${t("finder.postalPh")}" value="${attrEscape(answers.postal)}" />
      <button class="btn btn-ghost" data-finder-loc type="button">${icon("compass")} ${t("finder.useLoc")}</button>
    </div>
    <div class="finder-btns">
      <a class="apply finder-search" data-ptype="${type}" href="${mapsSearchUrl(type)}" target="_blank" rel="noopener noreferrer" data-ext>${findLabel(type)} ${icon("external")}</a>
      ${isDtc
        ? `<a class="apply secondary finder-search" data-ptype="nurse practitioner" href="${mapsSearchUrl("nurse practitioner")}" target="_blank" rel="noopener noreferrer" data-ext>${findLabel("nurse practitioner")} ${icon("external")}</a>`
        : type !== "family doctor"
          ? `<a class="apply secondary finder-search" data-ptype="family doctor" href="${mapsSearchUrl("family doctor")}" target="_blank" rel="noopener noreferrer" data-ext>${findLabel("family doctor")} ${icon("external")}</a>`
          : ""}
    </div>
    ${signerChips}
    ${dtcSignerMatrix}
    ${wizardNudge}
    ${askTips}
    <p class="finder-note" data-finder-note>${t("finder.note")}</p>
  </div>`;
}

/* supports & strategies (non-monetary help) matched to disability + situation */
function supportMatches(item) {
  const disOk = item.dis && item.dis.length ? item.dis.some((d) => hasDisability(d)) : null;
  const sitOk = item.sit && item.sit.length ? item.sit.some((s) => answers.situation.includes(s)) : null;
  const needOk = item.needs && item.needs.length ? item.needs.some((need) => hasFunctionalNeed(need)) : null;
  return disOk === true || sitOk === true || needOk === true;
}
function renderSupportCard(item) {
  const url = item.link ? resolveUrl(item.link) : null;
  return `
  <div class="support-card">
    <h3>${icon(item.icon)} ${item.title}</h3>
    <p class="summary">${item.summary}</p>
    <ul class="support-tips">${item.tips.map((x) => `<li>${x}</li>`).join("")}</ul>
    ${
      url
        ? `<a class="support-resource" href="${url}" target="_blank" rel="noopener noreferrer" data-ext>
             <span class="sr-badge">${icon("link")}</span>
             <span class="sr-body"><span class="sr-eyebrow">${t("supports.resource")}</span><span class="sr-text">${item.linkText}</span></span>
             ${icon("external")}
           </a>`
        : ""
    }
  </div>`;
}

function wireBenefitDateButtons(root = document) {
  root.querySelectorAll(".date-calendar").forEach((button) => button.addEventListener("click", () => {
    if (downloadBenefitDate(button.dataset.dateProgram, Number(button.dataset.dateIndex))) {
      button.classList.add("done");
      button.innerHTML = `${icon("check")} ${t("dates.downloaded")}`;
    }
  }));
}

function wireResults() {
  wireProgramUpdates();
  wireBenefitDateButtons();
  const scenarioToggle = document.getElementById("scenario-title");
  if (scenarioToggle) scenarioToggle.addEventListener("click", () => {
    scenarioOpen = !scenarioOpen;
    scenarioToggle.setAttribute("aria-expanded", String(scenarioOpen));
    document.getElementById("scenario-panel").hidden = !scenarioOpen;
  });
  document.querySelectorAll("[data-scenario-select]").forEach((select) =>
    select.addEventListener("change", () => {
      if (!select.value) return;
      const key = select.dataset.scenarioSelect;
      const step = STEPS.find((item) => item.key === key);
      if (!step) return;
      if (key === "situation") {
        const active = scenarioAnswerModel().situation.includes(select.value);
        const optionLabel = scenarioOptionLabel(step, select.value);
        scenarioChanges.set(`situation:${select.value}`, {
          id: `situation:${select.value}`, key, option: select.value, value: !active,
          label: `${active ? t("scenario.stop") : t("scenario.start")} ${optionLabel}`,
        });
      } else {
        const optionValue = step.type === "select" ? select.value : stepOptions(step)
          .map((item) => typeof item === "object" ? item.value : item)
          .find((value) => String(value) === select.value);
        scenarioChanges.set(key, { id: key, key, value: optionValue, label: `${select.previousElementSibling.textContent}: ${scenarioOptionLabel(step, optionValue)}` });
      }
      scenarioOpen = true;
      render();
    })
  );
  document.querySelectorAll("[data-scenario-remove]").forEach((button) =>
    button.addEventListener("click", () => { scenarioChanges.delete(button.dataset.scenarioRemove); scenarioOpen = true; render(); })
  );
  document.querySelector(".scenario-reset")?.addEventListener("click", () => { scenarioChanges.clear(); scenarioOpen = true; render(); });

  document.querySelectorAll(".js-req-guide").forEach(link =>
    link.addEventListener("click", event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      detailFrom = "results";
      setState("detail", { detailId: link.dataset.id });
      const el = document.getElementById(`req-detail-${link.dataset.id}`);
      if (el) {
        el.focus({ preventScroll: true });
        el.scrollIntoView({ block: "start", behavior: a11y.motion ? "auto" : "smooth" });
      }
    })
  );
  document.querySelectorAll(".js-guide-link").forEach(link =>
    link.addEventListener("click", event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      detailFrom = "results";
      setState("detail", { detailId: link.dataset.id });
    })
  );
  document.querySelectorAll(".js-detail").forEach((btn) =>
    btn.addEventListener("click", () => {
      detailFrom = "results";
      setState("detail", { detailId: btn.dataset.id });
    })
  );
  document.querySelectorAll("[data-open-full-guide]").forEach((btn) =>
    btn.addEventListener("click", () => {
      detailFrom = "results";
      setState("detail", { detailId: btn.dataset.openFullGuide });
    })
  );
  document.querySelectorAll("[data-edit]").forEach((btn) =>
    btn.addEventListener("click", () => {
      editingReturn = true;
      setState("wizard", { stepIndex: parseInt(btn.dataset.edit, 10) });
    })
  );
  document.querySelectorAll("[data-guide-toggle]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = btn.dataset.guideToggle;
      const panel = document.getElementById(`guide-panel-${id}`);
      if (!panel) return;
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
      btn.querySelector(".guide-toggle-label").textContent = open ? t("guide.close") : t("guide.full");
      if (open) {
        expandedBenefitIds.add(id);
        wireGuideInteractions(panel);
        wireReveals(panel);
      } else expandedBenefitIds.delete(id);
    })
  );
  document.querySelectorAll(".inline-guide:not([hidden])").forEach(wireGuideInteractions);
  // per-benefit progress tracker
  document.querySelectorAll("[data-track]").forEach((sel) =>
    sel.addEventListener("change", () => {
      const id = sel.dataset.track;
      if (sel.value && STAGE[sel.value]) progress[id] = sel.value;
      else delete progress[id];
      notifyStateChange("progress-change");
      render(); // same page → scroll position preserved
    })
  );
  // Download reminders as a calendar file (no account, no server).
  const remind = document.getElementById("tsRemind");
  if (remind)
    remind.addEventListener("click", () => {
      const n = downloadReminders();
      remind.classList.add("done");
      remind.innerHTML = `${icon("check")} Added ${n} reminder${n === 1 ? "" : "s"} — check your downloads`;
    });

  // group-by toggle (priority ↔ category dashboard)
  document.querySelectorAll("[data-group]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const mode = btn.dataset.group === "category" ? "category" : "priority";
      if (mode === groupMode) return;
      groupMode = mode;
      notifyStateChange("results-filter-change");
      render();
    })
  );

  const print = document.getElementById("printList");
  if (print) print.addEventListener("click", () => {
    const date = document.querySelector(".print-action-plan .print-date");
    if (date) date.textContent = new Date().toLocaleDateString(undefined, {
      year: "numeric", month: "long", day: "numeric",
    });
    window.print();
  });

  document.querySelector('.limits-panel [data-nav="coverage"]')?.addEventListener("click", () => setState("coverage"));

  const r = document.getElementById("restart");
  if (r)
    r.addEventListener("click", () => {
      answers = BLANK();
      confirmedFacts = {};
      progress = {};
      stepIndex = 0;
      detailId = null;
      setState("landing", {}, true);
    });
}

/* Pure catalog aggregation. Input: evaluated plan entries { b, r }.
   Only case, whitespace and trailing punctuation are ignored for grouping.
   Keep the first original string verbatim; never infer equivalent documents. */
function buildDocumentChecklist(benefits) {
  const grouped = new Map();
  const normalize = (text) => text.toLowerCase().trim().replace(/\s+/g, " ").replace(/[\p{P}\s]+$/gu, "");
  for (const { b, r } of benefits) {
    if (!b || !r || !["ready", "almost"].includes(r.status)) continue;
    const documents = b.detail && b.detail.documents;
    if (!Array.isArray(documents)) continue;
    for (const text of documents) {
      if (typeof text !== "string" || !text.trim()) continue;
      const key = normalize(text);
      if (!key) continue;
      if (!grouped.has(key)) grouped.set(key, { text, programs: [] });
      const entry = grouped.get(key);
      if (!entry.programs.includes(b.name)) entry.programs.push(b.name);
    }
  }
  return [...grouped.values()]
    .map((entry) => ({ text: entry.text, programs: entry.programs.sort((a, b) => a.localeCompare(b, "en")) }))
    .sort((a, b) => b.programs.length - a.programs.length || normalize(a.text).localeCompare(normalize(b.text), "en"));
}

function splitDocumentChecklist(entries) {
  return {
    shared: entries.filter(entry => entry.programs.length >= 2),
    single: entries.filter(entry => entry.programs.length === 1)
  };
}

function renderDocumentChecklist(entries) {
  const { shared, single } = splitDocumentChecklist(entries);
  const more = single.length ? `<p class="document-checklist-more">${single.length === 1 ? "1 more document is" : `${single.length} more documents are each`} needed by only one program. You'll find them on that program's card and guide.</p>` : "";
  return `<div class="document-checklist-content" lang="en">${shared.length ? `<p>Taken from each program's guide. Each program's official page has the final list.</p><ul class="document-checklist">${shared.map((entry) => `<li><span class="document-checklist-box" aria-hidden="true"></span><span class="document-checklist-text">${reqEscape(entry.text)}</span><p>Needed for: ${entry.programs.map(reqEscape).join(", ")}</p></li>`).join("")}</ul>` : ""}${more}</div>`;
}

function actionPlanBenefits(matched) {
  const listed = [...matched];
  // Keep tracked programs in the existing plan list, but the checklist only
  // gathers documents for ready/almost entries, not a tracked "no" program.
  browseCatalog().forEach((b) => {
    if (progress[b.id] && !listed.some((item) => item.b.id === b.id)) listed.push({ b, r: evaluate(b) });
  });
  return listed;
}

/* ---- print-only action plan; built entirely from the local catalog ---- */
function renderPrintActionPlan(matched) {
  const esc = reqEscape; // one shared helper that also escapes quotes (site audit D-ENGINEERING P3)
  const plan = actionPlanBenefits(matched);
  const listed = plan.map((e) => e.b);
  const documentsToGather = buildDocumentChecklist(plan);
  const printDate = new Date().toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
  const items = listed.map((b) => {
    const url = resolveUrl(b.applyUrl);
    const nextStep = b.detail && Array.isArray(b.detail.steps) && b.detail.steps.length
      ? `<p class="print-next"><b>Next step:</b> ${esc(b.detail.steps[0])}</p>` : "";
    const documents = b.detail && Array.isArray(b.detail.documents) && b.detail.documents.length
      ? `<div class="print-documents"><b>Forms and documents</b><ul>${b.detail.documents.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>` : "";
    const r = evaluate(b);
    return `<section class="print-benefit">
      <h2>${esc(b.name)}</h2>
      <p class="print-match-status">${matchStatusLabel(r.status)}</p>
      ${matchStatusNote(r.status)}${r.checkedFacts ? '<p class="checked-facts-note" lang="en">Includes facts you checked on this device.</p>' : ""}
      <p>${esc(b.summary)}</p>
      ${url ? `<p class="print-url"><b>Official link:</b> ${esc(url)}</p>` : ""}
      ${reqPrint(r.needs)}
      ${nextStep}
      ${documents}
    </section>`;
  }).join("");
  return `<article class="print-action-plan" aria-hidden="true">
    <header><h1>AbilityFinder — My action plan</h1><p class="print-date">${esc(printDate)}</p><p>${t("res.acknowledgement")}</p></header>
    ${items || "<p>No matched or tracked benefits yet.</p>"}
    ${documentsToGather.length ? `<section class="print-document-checklist" lang="en"><h2>Documents to gather</h2>${renderDocumentChecklist(documentsToGather)}</section>` : ""}
    <footer>Generated by abilityfinder.ca — free, independent, not affiliated with any government. Details change; confirm with official sources.</footer>
  </article>`;
}

/* ---- printable / shareable report (Save as PDF → send to a caregiver) ---- */
function reportProfileLine() {
  const parts = [];
  const disLabels = answers.disabilities
    .map((d) => { const o = DISABILITIES.find((x) => x.value === d); return o ? o.label : d; })
    .filter(Boolean);
  if (answers.forWho === "child") parts.push("For a child");
  if (disLabels.length) parts.push(disLabels.join(", "));
  const ageLabel = AGE_BANDS.find((band) => band.value === answers.ageBand)?.label;
  if (ageLabel) parts.push(`Age ${ageLabel}`);
  if (answers.province) parts.push(PROVINCE_NAME[answers.province] || answers.province);
  if (answers.city) parts.push(answers.city);
  const dtc = { yes: "DTC approved", no: "DTC not yet", unsure: "DTC unsure" }[answers.dtc];
  if (dtc) parts.push(dtc);
  const inc = { low: "Lower income", moderate: "Middle income", high: "Higher income" }[answers.income];
  if (inc) parts.push(inc);
  return parts.join(" · ");
}
function reportAnnualTotal(ready) {
  const total = ready
    .map((e) => BENEFIT_VALUES[e.b.id])
    .filter((v) => v && ["cash", "grant", "taxCredit"].includes(v.kind) && !v.excludeFromEstimate && v.annualMax)
    .reduce((s, v) => s + v.annualMax, 0);
  return Math.round(total / 100) * 100;
}
function printResults() {
  const esc = reqEscape; // one shared helper that also escapes quotes (site audit D-ENGINEERING P3)
  // Programs the person already gets are not printed as ones to apply for.
  const received = new Set(receivedIds());
  const evaluated = browseCatalog().filter((b) => benefitInResultsScope(b, answers) && !received.has(b.id)).map((b) => ({ b, r: evaluate(b) }));
  const ready = evaluated.filter((e) => e.r.status === "ready").sort((a, b) => priorityScore(b.b) - priorityScore(a.b));
  const almost = evaluated.filter((e) => e.r.status === "almost").sort((a, b) => priorityScore(b.b) - priorityScore(a.b));

  const section = ({ b, r }, i) => {
    const v = valueParts(b);
    const value = esc(v.head) + (v.sub ? ` — ${esc(v.sub)}` : "");
    const meta = BENEFIT_META[b.id] || {};
    const di = difficultyInfo(meta.difficulty);
    const metaBits = [meta.effort && `Apply: ${meta.effort}`, meta.wait && `Wait: ${meta.wait}`, `Difficulty: ${di.label}`]
      .filter(Boolean).map(esc).join(" · ");
    const printSteps = b.detail && b.detail.steps && b.detail.steps.length ? b.detail.steps : [
      "Review the current rules and application method on the official program page.",
      "Gather the documents named on that page, apply through the official link, and save your confirmation.",
    ];
    const steps = `<p class="lbl">How to apply</p><ol>${printSteps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;
    const docs = b.detail && b.detail.documents && b.detail.documents.length
      ? `<p class="lbl">What you'll need</p><ul>${b.detail.documents.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : "";
    const tracked = progress[b.id] && STAGE[progress[b.id]] ? STAGE[progress[b.id]].label : null;
    const status = matchStatusLabel(r.status);
    const phone = b.detail && b.detail.phone ? `<p class="lnk">Phone: ${esc(b.detail.phone)}</p>` : "";
    return `<section>
      <h3><span class="num">${i}</span>${esc(b.name)} <span class="badge">${esc(status)}</span></h3>
      ${matchStatusNote(r.status)}${r.checkedFacts ? '<p class="checked-facts-note" lang="en">Includes facts you checked on this device.</p>' : ""}
      ${tracked ? `<p>Application progress: ${esc(tracked)}</p>` : ""}
      <p class="meta">${esc(b.level)}${metaBits ? " · " + metaBits : ""}</p>
      <p class="amt">${value}</p>
      <p>${esc(b.summary)}</p>
      ${reqPrint(r.needs)}
      ${steps}
      ${docs}
      <p class="lnk">Apply: ${esc(resolveUrl(b.applyUrl))}</p>
      <p class="lnk">Official info: ${esc(resolveUrl(b.source))}</p>
      ${phone}
    </section>`;
  };

  const readyRows = ready.map((e, i) => section(e, i + 1)).join("");
  const almostRows = almost.map((e, i) => section(e, ready.length + i + 1)).join("");
  const total = reportAnnualTotal(ready);
  const profile = reportProfileLine();
  let dateStr = "";
  try { dateStr = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" }); } catch (e) {}

  const doc = `<!doctype html><html><head><meta charset="utf-8"><title>My disability benefits report — AbilityFinder</title>
    <style>
      html{background:#fff;}
      body{font:15px/1.55 -apple-system,Segoe UI,Roboto,sans-serif;color:#16181d;background:#fff;max-width:760px;margin:28px auto;padding:24px 20px;color-scheme:light;}
      header{border-bottom:2px solid #16181d;padding-bottom:14px;margin-bottom:20px;}
      h1{font-size:25px;margin:0 0 4px;letter-spacing:-0.02em;}
      .brand{font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b74e6;font-weight:700;margin:0 0 8px;}
      .profile{color:#333;margin:6px 0 0;font-size:14px;}
      .total{margin:14px 0 0;font-size:15px;background:#eef0fb;border-radius:8px;padding:12px 14px;}
      .total b{font-size:19px;}
      .grp{font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b74e6;font-weight:700;margin:26px 0 8px;}
      section{border:1px solid #ddd;border-radius:10px;padding:16px 18px;margin:0 0 12px;break-inside:avoid;page-break-inside:avoid;}
      h3{font-size:16px;margin:0 0 6px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
      .num{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#6b74e6;color:#fff;font-size:12px;flex:none;}
      .badge{font-size:11px;font-weight:700;color:#17915f;background:#e3f3ec;border-radius:20px;padding:2px 9px;}
      .meta{color:#666;font-size:12.5px;margin:0 0 8px;}
      .amt{font-weight:700;color:#17915f;margin:0 0 6px;font-size:15px;}
      .lbl{font-weight:600;font-size:13px;margin:12px 0 3px;}
      .lnk{color:#1a4bd6;font-size:12.5px;word-break:break-all;margin:6px 0 0;}
      ol,ul{margin:4px 0;padding-left:20px;} li{margin:3px 0;font-size:13.5px;}
      footer{margin-top:24px;padding-top:14px;border-top:1px solid #ddd;color:#666;font-size:12px;}
      @media print{.noprint{display:none;} body{margin:0;}}
    </style></head><body>
    <header>
      <p class="brand">AbilityFinder · ${SCOPE_LABEL}</p>
      <h1>My disability benefits report</h1>
      ${profile ? `<p class="profile"><b>Based on:</b> ${esc(profile)}</p>` : ""}
      ${total > 0 ? `<p class="total">Estimated value represented by programs under Matches your answers: <b>up to ~$${total.toLocaleString("en-CA")}/year</b>, plus one-time back-pay and lifetime savings where noted. This is not an eligibility or payment estimate, and programs may not stack.</p>` : ""}
      ${dateStr ? `<p class="profile" style="color:#888;font-size:12px;margin-top:8px;">Prepared ${esc(dateStr)}. Share this with a family member, caregiver, or case worker.</p>` : ""}
    </header>
    <p>${t("res.acknowledgement")}</p>
    ${readyRows ? `<p class="grp">${t("grp.ready")} (${ready.length})</p>${matchStatusNote("ready")}${readyRows}` : ""}
    ${almostRows ? `<p class="grp">${t("grp.almost")} (${almost.length})</p>${almostRows}` : ""}
    ${!readyRows && !almostRows ? "<p>No matches yet — try adjusting your answers in AbilityFinder.</p>" : ""}
    <footer>
      Amounts are published amounts or limits, not a personal payment estimate. Always confirm current rules and amounts on each official government page before applying.
      This report is a helper, not legal, medical, or financial advice. Each guide shows when it was last checked.
    </footer>
    </body></html>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(doc);
  w.document.close();
  w.focus();
  setTimeout(() => { try { w.print(); } catch (e) {} }, 400);
}

/* =============================================================================
   BROWSE / SEARCH — explore every benefit without doing the wizard
   ========================================================================== */
function benefitIsLocal(b) {
  return !["Federal", "Alberta", "British Columbia", "Ontario", "Saskatchewan", "Manitoba", "New Brunswick", "Nova Scotia", "Prince Edward Island", "Newfoundland and Labrador", "Quebec"].includes(b.level);
}
function benefitIsBritishColumbia(b) {
  return b.level === "British Columbia" || b.level === "Metro Vancouver" || BC_CITIES.includes(b.level);
}
function benefitIsOntario(b) {
  // Regions count too. A record delivered by York Region carries "York Region" as its
  // level, which is neither "Ontario" nor a city, so without ON_REGIONS it would slip
  // past the province filter if Ontario were ever staged dark again.
  return b.level === "Ontario" || ON_CITIES.includes(b.level) || ON_REGIONS.includes(b.level);
}
// Saskatchewan-only levels. A shared border city (Lloydminster) stays with its
// Alberta records, so the dark flag never hides an existing Alberta program.
function benefitIsSaskatchewan(b) {
  return b.level === "Saskatchewan" || (SK_CITIES.includes(b.level) && !SHARED_CITIES[b.level]);
}
function benefitIsManitoba(b) {
  return b.level === "Manitoba" || MB_CITIES.includes(b.level);
}
function benefitIsNewBrunswick(b) {
  return b.level === "New Brunswick" || NB_CITIES.includes(b.level);
}
function benefitIsNovaScotia(b) {
  return b.level === "Nova Scotia" || NS_CITIES.includes(b.level);
}
function benefitIsPrinceEdwardIsland(b) {
  return b.level === "Prince Edward Island" || PE_CITIES.includes(b.level);
}
function benefitIsNewfoundlandandLabrador(b) {
  return b.level === "Newfoundland and Labrador" || NL_CITIES.includes(b.level);
}
function benefitIsQuebec(b) {
  return b.level === "Quebec" || QC_CITIES.includes(b.level);
}
function browseCatalog(records = BENEFITS) {
  let list = records;
  if (!BC_ENABLED) list = list.filter((b) => !benefitIsBritishColumbia(b));
  if (!ON_ENABLED) list = list.filter((b) => !benefitIsOntario(b));
  if (!SK_ENABLED) list = list.filter((b) => !benefitIsSaskatchewan(b));
  if (!MB_ENABLED) list = list.filter((b) => !benefitIsManitoba(b));
  if (!NB_ENABLED) list = list.filter((b) => !benefitIsNewBrunswick(b));
  if (!NS_ENABLED) list = list.filter((b) => !benefitIsNovaScotia(b));
  if (!PE_ENABLED) list = list.filter((b) => !benefitIsPrinceEdwardIsland(b));
  if (!NL_ENABLED) list = list.filter((b) => !benefitIsNewfoundlandandLabrador(b));
  if (!QC_ENABLED) list = list.filter((b) => !benefitIsQuebec(b));
  return list;
}
function benefitSearchText(b) {
  const d = b.detail || {};
  return [b.name, b.summary, b.category, b.level, d.about, b.requiresNote, (d.tips || []).join(" ")]
    .filter(Boolean).join(" ").toLowerCase();
}
/* ── Disability / functional-need browse ──────────────────────────────────────
   This is a *sort*, never a filter. Hiding non-matching programs would encourage
   self-rejection because most disability benefits depend on functional impact,
   not a diagnosis or one selected need. Specific programs rise first; all other
   potentially useful programs stay visible. */
/** Disabilities a benefit specifically targets. Empty = applies to any. */
function benefitDisabilities(b) {
  const out = new Set();
  for (const r of b.requires || []) (DIS_BY_REQ[r] || []).forEach((d) => out.add(d));
  return [...out];
}
const isDisSpecific = (b, dis) => benefitDisabilities(b).includes(dis);
/** Functional needs a benefit specifically targets. Empty = applies to any. */
function benefitNeeds(b) {
  const out = new Set();
  for (const r of b.requires || []) (NEED_BY_REQ[r] || []).forEach((need) => out.add(need));
  return [...out];
}
const isNeedSpecific = (b, need) => benefitNeeds(b).includes(need);
function browseTargetScore(b) {
  return (browseDis !== "all" && isDisSpecific(b, browseDis) ? 1 : 0)
    + (browseNeed !== "all" && isNeedSpecific(b, browseNeed) ? 1 : 0);
}

function browseFiltered() {
  const q = browseQuery.trim().toLowerCase();
  return browseCatalog().filter((b) => {
    if (browseTheme !== "all" && benefitTheme(b) !== browseTheme) return false;
    if (browseLevel !== "all") {
      if (browseLevel === "local" ? !benefitIsLocal(b) : b.level !== browseLevel) return false;
    }
    if (q && !benefitSearchText(b).includes(q)) return false;
    return true;
  }).sort((a, b) => {
    // Both selected targets first, then either target, then everything else.
    // With one row at "Any", this naturally becomes matching then non-matching.
    const targetDifference = browseTargetScore(b) - browseTargetScore(a);
    if (targetDifference) return targetDifference;
    return priorityScore(b) - priorityScore(a);
  });
}
/* a status-agnostic card for browsing (no eligibility judgement) */
function browseCard(b) {
  const v = valueParts(b);
  const isTargeted = browseTargetScore(b) > 0;
  const valueHtml = `<span class="amount">${v.est ? `<span class="amount-tag">Published maximum</span>` : ""}<span${recAttr(b)}>${v.head}</span></span>${v.sub ? `<span class="amount-sub"${recAttr(b)}>${v.sub}</span>` : ""}`;
  return `
  <div class="benefit browse-card${isTargeted ? " dis-match" : ""}">
    <div class="benefit-row">
      <div class="benefit-main">
        <div class="top">
          <h3${recAttr(b)}>${b.name}</h3>
          <span class="tag lvl">${b.level}</span>
          ${isTargeted ? `<span class="tag dis-tag">${icon("check")} Aimed at this</span>` : ""}
        </div>
        ${statusBadge(b)}<p class="summary"${recAttr(b)}>${b.summary}</p>
        ${metaRow(b)}
      </div>
      <div class="benefit-side">
        <div class="benefit-value">${valueHtml}</div>
        <div class="benefit-actions">
          <button class="apply js-detail" data-id="${b.id}">View guide ${icon("arrowRight")}</button>
        </div>
      </div>
    </div>
  </div>`;
}
function browseResultsHtml() {
  const items = browseFiltered();
  if (!items.length) {
    return `<p class="browse-empty">${icon("search")} No benefits match that. Try clearing the search or a different filter.</p>`;
  }
  return `<div class="benefits-grid">${items.map(browseCard).join("")}</div>`;
}
function browseChip(active, key, label, kind) {
  return `<button class="browse-chip ${active ? "on" : ""}" data-${kind}="${key}">${label}</button>`;
}
function renderBrowse() {
  const themeChips = [browseChip(browseTheme === "all", "all", "All categories", "btheme")]
    .concat(THEMES.map((th) => browseChip(browseTheme === th.key, th.key, th.label, "btheme")))
    .join("");
  const levelChips = BROWSE_LEVELS
    .map((l) => browseChip(browseLevel === l.key, l.key, l.label, "blevel"))
    .join("");
  const disChips = [browseChip(browseDis === "all", "all", "Any disability", "bdis")]
    .concat(DISABILITIES.filter((d) => d.value !== "other")
      .map((d) => browseChip(browseDis === d.value, d.value, d.label, "bdis")))
    .join("");
  const needChips = [browseChip(browseNeed === "all", "all", t("browse.need.any"), "bneed")]
    .concat(BROWSE_NEEDS.map((need) => browseChip(
      browseNeed === need, need, t(BROWSE_NEED_LABEL_KEYS[need]), "bneed")))
    .join("");
  // Say the true thing rather than quietly hiding potentially useful benefits.
  const catalog = browseCatalog();
  const nSpec = browseDis === "all" ? 0 : catalog.filter((b) => isDisSpecific(b, browseDis)).length;
  const disLabel = (DISABILITIES.find((d) => d.value === browseDis) || {}).label || "";
  const disNote = browseDis === "all" ? "" : `
    <p class="browse-disnote">${icon("info")}
      <span>${nSpec
        ? `<b>${nSpec} program${nSpec === 1 ? " is" : "s are"} aimed specifically at ${disLabel.toLowerCase()}</b> — shown first.`
        : `<b>No program is aimed only at ${disLabel.toLowerCase()}</b>.`}
      Everything else still applies to you: most disability benefits go by <b>how much your condition limits you</b>, not by your diagnosis. That's why we don't hide the rest.</span>
    </p>`;
  const nNeedSpec = browseNeed === "all" ? 0 : catalog.filter((b) => isNeedSpecific(b, browseNeed)).length;
  const needNote = browseNeed === "all" ? "" : `
    <p class="browse-disnote browse-neednote">${icon("info")}
      <span>${nNeedSpec
        ? `<b>${nNeedSpec} program${nNeedSpec === 1 ? " is" : "s are"} aimed specifically at this need — shown first.</b>`
        : `<b>No program is aimed only at this need.</b>`}
      Everything else may still apply.</span>
    </p>`;
  return `
  <section class="browse">
    <button class="back-link" id="b-back">${icon("arrowLeft")} Home</button>
    <div class="browse-head">
      <h1>${t("menu.browse")}</h1>
      <p>Explore all ${catalog.length} programs in our ${SCOPE_LABEL} catalog — no questionnaire needed. Want a list tailored to you?
        <button class="linklike" id="b-start">Get my personalized results ${icon("arrowRight")}</button></p>
    </div>
    <div class="browse-search">
      ${icon("search")}
      <input type="search" id="browseInput" class="text-input" placeholder="Search benefits — e.g. “tax”, “transit”, “savings”…" value="${browseQuery.replace(/"/g, "&quot;")}" aria-label="Search benefits" />
    </div>
    <div class="browse-filters">
      <div class="browse-chiprow" role="group" aria-label="Filter by category">${themeChips}</div>
      <div class="browse-chiprow" role="group" aria-label="Filter by level">${levelChips}</div>
      <div class="browse-chiprow" role="group" aria-label="Show what is most relevant to a disability">${disChips}</div>
      <div class="browse-chiprow" role="group" aria-label="${t("browse.need.row")}">${needChips}</div>
    </div>
    ${disNote}
    ${needNote}
    <div class="browse-count" id="browseCount">${browseFiltered().length} benefit${browseFiltered().length === 1 ? "" : "s"}</div>
    <div id="browseResults">${browseResultsHtml()}</div>
  </section>`;
}
function refreshBrowse() {
  const results = document.getElementById("browseResults");
  const count = document.getElementById("browseCount");
  if (results) results.innerHTML = browseResultsHtml();
  if (count) {
    const n = browseFiltered().length;
    count.textContent = `${n} benefit${n === 1 ? "" : "s"}`;
  }
  document.querySelectorAll("[data-btheme]").forEach((c) =>
    c.classList.toggle("on", c.dataset.btheme === browseTheme));
  document.querySelectorAll("[data-blevel]").forEach((c) =>
    c.classList.toggle("on", c.dataset.blevel === browseLevel));
  document.querySelectorAll("[data-bdis]").forEach((c) =>
    c.classList.toggle("on", c.dataset.bdis === browseDis));
  document.querySelectorAll("[data-bneed]").forEach((c) =>
    c.classList.toggle("on", c.dataset.bneed === browseNeed));
}
function wireBrowse() {
  const back = document.getElementById("b-back");
  if (back) back.addEventListener("click", () => setState("landing"));
  const start = document.getElementById("b-start");
  if (start) start.addEventListener("click", () => {
    if (wizardDone()) setState("results");
    else {
      const firstMissing = visibleSteps().findIndex((step) => !stepAnswered(step));
      setState("wizard", { stepIndex: Math.max(0, firstMissing) });
    }
  });

  const input = document.getElementById("browseInput");
  if (input) input.addEventListener("input", () => {
    browseQuery = input.value;
    notifyStateChange("browse-filter-change");
    refreshBrowse();
  });

  document.querySelectorAll("[data-btheme]").forEach((c) =>
    c.addEventListener("click", () => {
      browseTheme = c.dataset.btheme;
      notifyStateChange("browse-filter-change");
      refreshBrowse();
    }));
  document.querySelectorAll("[data-blevel]").forEach((c) =>
    c.addEventListener("click", () => {
      browseLevel = c.dataset.blevel;
      notifyStateChange("browse-filter-change");
      refreshBrowse();
    }));
  document.querySelectorAll("[data-bdis]").forEach((c) =>
    c.addEventListener("click", () => {
      browseDis = c.dataset.bdis;
      notifyStateChange("browse-filter-change");
      render();      // full render: the explainer line above the list has to change too
    }));
  document.querySelectorAll("[data-bneed]").forEach((c) =>
    c.addEventListener("click", () => {
      browseNeed = c.dataset.bneed;
      notifyStateChange("browse-filter-change");
      render();
    }));

  // delegate "View guide" clicks (survives partial innerHTML refreshes)
  const results = document.getElementById("browseResults");
  if (results) results.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-detail");
    if (btn) { detailFrom = "browse"; setState("detail", { detailId: btn.dataset.id }); }
  });
}

/* =============================================================================
   DETAIL — the in-app guide for one benefit
   ========================================================================== */
/* Language of a record's own text. Québec records keep the official French
   wording (b.lang === "fr"); every element that shows record text carries
   lang="fr" when the interface is in another language, so screen readers and
   browser translation read it correctly. Records without b.lang are English. */
function recLang(b) {
  return (b && b.lang) || "en";
}
function recAttr(b) {
  return b && b.lang && b.lang !== LANG ? ` lang="${b.lang}"` : "";
}

function listBlock(title, ic, items, ordered, attr = "") {
  if (!items || !items.length) return "";
  const tag = ordered ? "ol" : "ul";
  return `
  <div class="guide-block">
    <div class="guide-h">${icon(ic)} ${title}</div>
    <${tag} class="guide-list"${attr}>${items.map((i) => `<li>${i}</li>`).join("")}</${tag}>
  </div>`;
}

const DATA_VERIFIED = "July 2026";

/* ── Freshness that doesn't over-claim ────────────────────────────────────────
   BENEFIT_VERIFIED in public/data.js is the single source of truth for
   per-benefit review dates. Dates are month-granular, with no fabricated day.
   A benefit absent from the map is covered by the catalog review month. */

/** Machine-comparable twin of DATA_VERIFIED. Keep the two in step. */
const DATA_VERIFIED_MONTH = "2026-07";

/** Past this, the guide tells the reader to confirm the number themselves. */
const STALE_MONTHS = 9;

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_FR = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
function orgVerifiedLabel(organization) {
  const raw = organization && organization.verified;
  if (typeof raw !== "string") return null;
  const match = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(raw);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!(month >= 1 && month <= 12)) return null;
  // Month granularity only, matching the DATA-10 rule against synthetic precision.
  const name = (LANG === "fr" ? MONTHS_FR : MONTHS_EN)[month - 1];
  return `${name} ${year}`;
}

function verifiedFor(b) {
  const raw = (b && BENEFIT_VERIFIED[b.id]) || DATA_VERIFIED_MONTH; // "YYYY-MM"
  const [y, m] = raw.split("-").map(Number);
  const now = new Date();
  const months = (now.getUTCFullYear() - y) * 12 + (now.getUTCMonth() - (m - 1));
  const label = `${MONTHS_EN[m - 1]} ${y}`;
  const inherited = !(b && BENEFIT_VERIFIED[b.id]);
  return { label, inherited, wording: inherited ? `Part of the ${label} catalogue review` : `Info verified ${label}`, months: Math.max(0, months), stale: months >= STALE_MONTHS };
}

/* Phase-2 detail sections: tax warning, denial reasons, appeals, FAQs, related */
function p2Sections(b) {
  const x = BENEFIT_EXTRA[b.id];
  if (!x) return { tax: "", denials: "", appeal: "", faqs: "", related: "", plainTest: "" };
  /* "What 'severe and prolonged' actually means."
     Deliberately NOT collapsed: the six headings are the lesson. Skim them in
     fifteen seconds and you've got it; read the paragraphs if you want the why.
     That's how we add substance without adding load. */
  const plainTest = x.plainTest
    ? `<div class="guide-block plaintest">
        <div class="guide-h">${icon("key")} What “severe and prolonged” actually means</div>
        <p class="pt-lead">${x.plainTest.lead}</p>
        <ol class="pt-list">
          ${x.plainTest.points
            .map(
              (pt, i) => `<li class="pt-item reveal" style="--i:${i}">
                <span class="pt-num" aria-hidden="true">${i + 1}</span>
                <div><h4>${pt.h}</h4><p>${pt.p}</p></div>
              </li>`
            )
            .join("")}
        </ol>
        <p class="pt-foot">${icon("info")} <span>${x.plainTest.foot}</span></p>
      </div>`
    : "";
  const tax = x.taxNote
    ? `<div class="callout"><span class="co-ic">${icon("info")}</span><div><b>Money and other benefits</b><p>${x.taxNote}</p></div></div>`
    : "";
  const denials = x.denials && x.denials.length
    ? `<div class="guide-block"><div class="guide-h">${icon("info")} Common reasons people get denied</div>
       <ul class="guide-list warn-list">${x.denials.map((d) => `<li>${d}</li>`).join("")}</ul></div>`
    : "";
  const appeal = x.appeal
    ? `<div class="guide-block"><div class="guide-h">${icon("key")} If you're denied</div><p class="p2-text">${x.appeal}</p></div>`
    : "";
  const faqs = x.faqs && x.faqs.length
    ? `<div class="guide-block"><div class="guide-h">${icon("info")} Questions people ask</div>
       <div class="faqs">${x.faqs.map((f) => `<details class="faq"><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")}</div></div>`
    : "";
  let related = "";
  if (x.related && x.related.length) {
    const chips = x.related
      .map((rid) => { const rb = browseCatalog().find((z) => z.id === rid); return rb ? `<button class="related-chip" data-related-id="${rid}">${rb.name} ${icon("arrowRight")}</button>` : ""; })
      .join("");
    if (chips) related = `<div class="guide-block"><div class="guide-h">${icon("key")} Works well with</div><div class="related-chips">${chips}</div></div>`;
  }
  return { tax, denials, appeal, faqs, related, plainTest };
}

function renderGuideBody(b, r = evaluate(b), options = {}) {
  const inline = !!options.inline;
  const backBtn = (idn) => `<button class="back-link${idn === "d-back2" ? " bottom" : ""}" id="${idn}">${icon("arrowLeft")} ${t("det.back")}</button>`;
  const d = b.detail || {};
  const guideSteps = d.steps && d.steps.length ? d.steps : [
    "Open the official program page and review the current eligibility rules, dates and application method.",
    "Gather the documents named on the official application page; requirements can change.",
    "Apply through the official link below, then keep a copy or confirmation number for follow-up.",
  ];
  const vFresh = verifiedFor(b); // Per-benefit freshness.

  const x = BENEFIT_EXTRA[b.id] || {};
  // The old top status-banner is replaced by the answer-first summary card
  // (ticket #197), built below once sideStatus and the value are known.
  const p2 = p2Sections(b);

  const nextAction = wizardDone() ? r.needs.find((n) => n.action) : null;
  const meta = [];
  if (d.time) meta.push(`<div class="meta-item"><span>${t("meta.time")}</span>${d.time}</div>`);
  if (d.phone) meta.push(`<div class="meta-item"><span>${t("meta.contact")}</span>${d.phone}</div>`);
  const A = recAttr(b);
  const enNote = LANG !== "en" && recLang(b) === "en" ? `<div class="note">${t("det.enNote")}</div>` : "";
  const guideLimit = `<p class="detail-about guide-limit"><strong>${t("guide.limitLead")}</strong> ${t("guide.limitBody")}</p>`;

  const v = valueParts(b);
  const valueHead = `<div class="detail-amount"${A}>${reqEscape(b.amount)}</div>${v.sub ? `<div class="detail-amount-sub"${A}>${v.sub}</div>` : ""}`;
  const valueSection = b.amount ? `<section class="guide-block guide-value"><h2 class="guide-h">${icon("info")} What it can provide</h2>${valueHead}</section>` : "";

  // Optional structured amount breakdown. When a benefit's value has bands or
  // tiers (income thresholds, coverage rates), `amountTiers` renders them as a
  // small table so a user can find their row at a glance instead of parsing a
  // run-on sentence. The prose `amount` string above stays as the headline; the
  // table only appears when the structured field is present. Cells are authored
  // catalogue content (not model output), interpolated like every other benefit
  // field here; the guide generator escapes the same cells for the static pages.
  const tiersSection = b.amountTiers && b.amountTiers.rows && b.amountTiers.rows.length
    ? `<section class="guide-block guide-tiers"><h2 class="guide-h">${icon("info")} ${b.amountTiers.caption || "How the amount is worked out"}</h2><div class="tier-scroll"><table class="amount-tiers"${A}><thead><tr>${b.amountTiers.headers.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${b.amountTiers.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody></table></div></section>`
    : "";

  // "What it covers" — a benefit's list of covered services/items, held as a
  // structured list (detail.coversList) instead of a comma run-on buried in the
  // description prose, so users can scan what's covered. Optional lead line
  // keeps the record's own framing ("CLBC funds and coordinates:").
  const coversList = d.coversList && d.coversList.items && d.coversList.items.length ? d.coversList : null;
  const coversSection = coversList
    ? `<section class="guide-block"><h2 class="guide-h">${icon("info")} ${t("guide.covers")}</h2>${coversList.lead ? `<p class="eligibility-lead"${A}>${coversList.lead}</p>` : ""}<ul class="eligibility-list"${A}>${coversList.items.map((it) => `<li>${it}</li>`).join("")}</ul></section>`
    : "";

  // Progressive disclosure (#201): secondary content sits inside labelled native
  // <details> so the page leads with the essentials instead of a wall of text —
  // but nothing is removed, and each expander is keyboard-operable and fully
  // readable without JS. Proportionate: a SHORT description stays visible (we do
  // not add a click to reach a one-liner); only a long one collapses. A benefit
  // with little content therefore shows it all directly, with no expanders.
  const aboutText = d.about && d.about !== b.summary ? d.about : "";
  const aboutLong = aboutText.length > 240;
  const aboutListData = d.aboutList && d.aboutList.items && d.aboutList.items.length ? d.aboutList : null;
  const aboutVisible = aboutText && !aboutLong && !aboutListData ? `<p class="detail-about"${A}>${aboutText}</p>` : "";
  const moreList = (summary, items, extraCls) => (items && items.length)
    ? `<section class="guide-block"><h2 class="guide-h">${summary}</h2><ul class="guide-list${extraCls ? " " + extraCls : ""}"${A}>${items.map((it) => `<li>${it}</li>`).join("")}</ul></section>`
    : "";
  const aboutMore = (aboutListData || aboutLong || p2.plainTest)
    ? `<section class="guide-block"><h2 class="guide-h">${t("guide.moreAbout")}</h2>${aboutListData ? `${aboutListData.lead ? `<p class="detail-about"${A}>${aboutListData.lead}</p>` : ""}<ul class="eligibility-list"${A}>${aboutListData.items.map((it) => `<li>${it}</li>`).join("")}</ul>` : (aboutLong ? `<p class="detail-about"${A}>${aboutText}</p>` : "")}${p2.plainTest}</section>`
    : "";
  const documentsMore = moreList(t("guide.need"), d.documents);
  const tipsMore = moreList(t("guide.tips"), d.tips);
  const denialsMore = moreList(t("guide.denials"), x.denials, "warn-list");
  const appealMore = x.appeal ? `<section class="guide-block"><h2 class="guide-h">${t("guide.appeal")}</h2><p class="p2-text">${x.appeal}</p></section>` : "";
  const faqsMore = (x.faqs && x.faqs.length)
    ? `<section class="guide-block"><h2 class="guide-h">${t("guide.faqs")}</h2><div class="faqs">${x.faqs.map((f) => `<div class="faq-item"><p class="faq-q">${f.q}</p><p class="faq-a">${f.a}</p></div>`).join("")}</div></section>`
    : "";

  // "At a glance" facts for the sticky sidebar
  const mm = BENEFIT_META[b.id] || {};
  const di = difficultyInfo(mm.difficulty);
  const facts = [];
  if (mm.difficulty) facts.push(["Difficulty", `<span class="fact-diff ${di.cls}"><span class="dots">${di.dots}</span> ${di.label}</span>`]);
  if (mm.effort) facts.push(["Application", `<span${A}>${mm.effort}</span>`]);
  // One row for one fact: the record's own timing text when it has one, else
  // the short meta wait. Two rows ("Wait for a decision" and "Processing") often
  // disagreed (site audit 2026-10, C-CONTENT-TRUST P1-09/P2-07).
  if (d.time || mm.wait) facts.push(["How long", `<span${A}>${d.time || mm.wait}</span>`]);
  if (d.phone) facts.push(["Phone", d.phone]);
  facts.push(["Level", b.level]);
  const factsHtml = facts.map(([k, val]) => `<div class="fact"><dt>${k}</dt><dd>${val}</dd></div>`).join("");

  const sideStatus = !wizardDone()
    ? { cls: "maybe", txt: t("af.check") }
    : { cls: r.status, txt: matchStatusLabel(r.status) };
  const unmet = r.status === "almost" ? r.needs : [];
  const sidePrompt = !wizardDone()
    ? `<div class="side-next"><h2>See if it fits you</h2><p>Answer the questionnaire for a personalized match.</p></div>`
    : (unmet.length || (r.status !== "no" && AbilityFinderState.FACT_REGISTRY[b.id]))
      ? renderRequirements(b, unmet, inline ? "inline" : "detail", nextAction)
      : `<div class="side-next"><h2>Next step</h2><p>Confirm the current rules, then use the official application.</p></div>`;

  // Answer-first summary (ticket #197): the three questions a benefit user
  // arrives with — am I eligible? / how much? / how do I apply? — surfaced above
  // the prose so they are scannable in seconds without reading the page. SPA
  // only; the static guide pages remain the no-JS/SEO fallback and already
  // front-load these facts. The eligibility cell keeps the [data-guide-check]
  // wizard trigger (wired in wireGuideInteractions) when the wizard isn't done.
  const afEligible = !wizardDone()
    ? `<span class="af-a">${t("af.eligiblePrompt")}</span><button class="linklike af-check" data-guide-check>${t("af.check")} ${icon("arrowRight")}</button>`
    : `<span data-fact-status="${b.id}" class="af-a af-status ${sideStatus.cls}">${sideStatus.txt}</span>${matchStatusNote(r.status)}${r.checkedFacts ? '<p class="checked-facts-note" lang="en">Includes facts you checked on this device.</p>' : ""}`;
  const answerFirst = inline ? "" : `<section class="answer-first" aria-label="${t("af.aria")}">
        <div class="af-cell"><span class="af-q">${t("af.eligible")}</span>${afEligible}</div>
        ${b.amount ? `<div class="af-cell"><span class="af-q">${t("af.howMuch")}</span><span class="af-a"${A}>${reqEscape(b.amount)}</span></div>` : ""}
        <div class="af-cell"><span class="af-q">${t("af.howApply")}</span>${b.applyUrl ? `<a class="af-apply-link" href="${resolveUrl(b.applyUrl)}" target="_blank" rel="noopener noreferrer" data-ext><span${A}>${applyLabel(b)}</span> ${icon("external")}</a>` : `<span class="af-a"${A}>${applyLabel(b)}</span>`}${d.time ? `<span class="af-meta">${t("meta.time")}: <span${A}>${d.time}</span></span>` : ""}</div>
      </section>`;

  return `
  ${inline ? "" : `<div class="detail">
    ${backBtn("d-back")}

    <header class="detail-hero">
      <div class="detail-tags">
        <span class="tag lvl">${b.level}</span>
      </div>
      <h1 class="detail-title"${A}>${b.name}</h1>
      ${statusBadge(b)}<p class="detail-lede"${A}>${b.summary}</p>
    </header>`}

    <div class="detail-body${inline ? " inline-guide-body" : ""}">
      <div class="detail-main">
        ${answerFirst}
        ${inline || typeof provinceNoticeHtml !== "function" ? "" : provinceNoticeHtml(benefitProvince(b))}
        ${enNote}

        ${/* Essentials stay visible; secondary detail moves into the labelled
              "More …" expanders below so the page isn't a wall of text (#201). */ ""}
        ${aboutVisible}
        ${b.note ? `<section class="guide-block"><h2 class="guide-h">${t("guide.goodToKnow")}</h2><div class="note"${A}>${b.note}</div></section>` : ""}
        ${b.eligibility && b.eligibility.items && b.eligibility.items.length
          ? `<section class="guide-block"><h2 class="guide-h">${t("guide.mustMeet")}</h2><p class="eligibility-lead">${b.eligibility.mode === "any" ? t("guide.mustMeetAny") : t("guide.mustMeetAll")}</p><ul class="eligibility-list"${A}>${b.eligibility.items.map((it) => `<li>${it}</li>`).join("")}</ul>${b.eligibility.note ? (b.eligibility.note.items ? `<p class="eligibility-lead"${A}>${b.eligibility.note.lead}</p><ul class="eligibility-list"${A}>${b.eligibility.note.items.map((it) => `<li>${it}</li>`).join("")}</ul><p class="detail-about eligibility-note"${A}>${b.eligibility.note.after}</p>` : `<p class="detail-about eligibility-note"${A}>${b.eligibility.note}</p>`) : ""}${guideLimit}</section>`
          : b.requiresNote ? `<section class="guide-block"><h2 class="guide-h">${t("guide.mustMeet")}</h2><p class="detail-about"${A}>${b.requiresNote}</p>${guideLimit}</section>` : guideLimit}
        ${valueSection}
        ${tiersSection}
        ${coversSection}
        ${b.id === "dtc" ? `<div class="dtc-prep-guide-cta"><button class="apply" type="button" data-open-dtc-prep>${icon("print")}${t("dtcPrep.guideButton")}</button></div>` : ""}
        ${p2.tax}
        ${renderBenefitDates([b], { headingId: `dates-to-know-${reqEscape(b.id)}` })}
        ${listBlock(t("guide.how"), "compass", guideSteps, true, d.steps && d.steps.length ? A : "")}
        ${b.needsPractitioner && !inline ? practitionerFinder(b) : ""}
        ${p2.related}
        ${aboutMore}
        ${documentsMore}
        ${tipsMore}
        ${denialsMore}
        ${appealMore}
        ${faqsMore}
        ${glossaryBlock(b)}
        ${inline ? `<div class="inline-guide-full"><button class="inline-guide-full-link" type="button" data-open-full-guide="${b.id}">${t("guide.openFull")} ${icon("arrowRight")}</button></div>` : ""}
      </div>

      <aside class="detail-side">
        <div class="side-card">
          <span data-fact-status="${b.id}" class="side-status ${sideStatus.cls}">${sideStatus.txt}</span>
          ${wizardDone() && inline ? matchStatusNote(r.status) : ""}
          ${sidePrompt}
          ${nextAction ? `<a class="apply side-next-action" href="${nextAction.action.url}" target="_blank" rel="noopener noreferrer" data-ext>${nextAction.action.text} ${icon("external")}</a>` : ""}
          <dl class="side-facts">${factsHtml}</dl>
          <div class="side-actions">
            ${b.applyUrl ? `<a class="apply" href="${resolveUrl(b.applyUrl)}" target="_blank" rel="noopener noreferrer" data-ext><span${A}>${applyLabel(b)}</span> ${icon("external")}</a>` : ""}
            ${b.declarationUrl ? `<a class="source-link" href="${resolveUrl(b.declarationUrl)}" target="_blank" rel="noopener noreferrer" data-ext>${b.declarationText || "Required dependent declaration"} ${icon("external")}</a>` : ""}
            <a class="source-link" href="${resolveUrl(b.source)}" target="_blank" rel="noopener noreferrer" data-ext>${t("det.official")} ${icon("external")}</a>
            ${inline ? "" : `<button class="source-link copy-link" type="button" data-copy-guide-link="${b.id}">Copy link to this guide</button>`}
          </div>
          <p class="side-foot"><span class="verified${vFresh.stale ? " stale" : ""}">${icon(vFresh.stale ? "info" : "check")} ${vFresh.wording}</span></p>
          ${vFresh.stale ? `<p class="side-stale">${icon("info")} <span>That was about ${vFresh.months} months ago. Amounts and income rules usually change each year, so <b>check the official page above</b> before you count on a number here.</span></p>` : ""}
        </div>
      </aside>
    </div>

    ${inline ? "" : `${backBtn("d-back2")}</div>${unmet.length ? `<article class="print-action-plan" aria-hidden="true" lang="en"><h1 lang="${recLang(b)}">${reqEscape(b.name)}</h1><p lang="${recLang(b)}">${reqEscape(b.summary)}</p><p><b>Official link:</b> ${reqEscape(resolveUrl(b.applyUrl || b.source))}</p>${reqPrint(unmet)}</article>` : ""}`}`;
}

function renderDetail(id) {
  const b = browseCatalog().find((x) => x.id === id);
  if (!b) return `<div class="card">Not found. <button class="back-link" id="d-back">${icon("arrowLeft")} ${t("det.back")}</button></div>`;
  return renderGuideBody(b, evaluate(b));
}

function wireDetail() {
  // Always return to results predictably (works whether the guide was opened
  // in-session or reloaded directly). The browser's own Back button is handled
  // separately by the popstate listener.
  ["d-back", "d-back2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => setState(detailFrom === "browse" ? "browse" : "results"));
  });

  wireGuideInteractions(document.querySelector(".detail") || document);
}

function wireGuideInteractions(root) {
  if (!root || root.dataset.guideWired === "true") return;
  root.dataset.guideWired = "true";
  wireBenefitDateButtons(root);
  root.querySelectorAll("[data-copy-guide-link]").forEach((btn) => btn.addEventListener("click", async () => {
    const gid = btn.getAttribute("data-copy-guide-link");
    if (!gid) return;
    const url = `https://abilityfinder.ca/guides/${gid}`; // id-only canonical guide URL — no wizard/profile data
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(url);
      if (!btn.dataset.label) btn.dataset.label = btn.textContent;
      btn.textContent = "Link copied";
      window.setTimeout(() => { btn.textContent = btn.dataset.label; }, 1800);
    } catch (_) {
      btn.textContent = url;
    }
  }));
  // "check my eligibility" CTA (shown when the wizard isn't done yet)
  root.querySelectorAll("[data-guide-check]").forEach((check) =>
    check.addEventListener("click", () => setState("wizard", { stepIndex: 0 }))
  );

  // Related benefits keep their existing deep-link route.
  root.querySelectorAll(".related-chip[data-related-id]").forEach((btn) =>
    btn.addEventListener("click", () => setState("detail", { detailId: btn.dataset.relatedId }))
  );

  // The DTC guide links to the printable practitioner-visit preparation sheet.
  root.querySelectorAll("[data-open-dtc-prep]").forEach((btn) =>
    btn.addEventListener("click", () => navigateDtcPrep("detail"))
  );

  // Each inline guide owns its finder controls, so several open cards never clash.
  const updateFinderLinks = (coords) => {
    root.querySelectorAll(".finder-search").forEach((a) => {
      a.href = mapsSearchUrl(a.dataset.ptype, coords);
    });
  };
  const postal = root.querySelector("[data-finder-postal]");
  if (postal)
    postal.addEventListener("input", () => {
      answers.postal = postal.value.trim() || null;
      // Free-text postal searches stay in memory only; they are deliberately
      // outside the persisted-state whitelist.
      updateFinderLinks(null);
    });
  // "Answer a few questions" nudge — only rendered when the wizard isn't done.
  const finderWizard = root.querySelector("[data-finder-wizard]");
  if (finderWizard)
    finderWizard.addEventListener("click", () => setState("wizard", { stepIndex: 0 }));
  const loc = root.querySelector("[data-finder-loc]");
  const note = root.querySelector("[data-finder-note]");
  if (loc)
    loc.addEventListener("click", () => {
      if (!navigator.geolocation) { if (note) note.textContent = t("finder.locUnsupported"); return; }
      loc.disabled = true;
      if (note) note.textContent = t("finder.locating");
      navigator.geolocation.getCurrentPosition(
        (p) => {
          updateFinderLinks({ lat: p.coords.latitude, lng: p.coords.longitude });
          loc.disabled = false;
          if (note) note.textContent = t("finder.located");
        },
        (err) => {
          loc.disabled = false;
          if (note)
            note.textContent =
              err.code === 1 ? t("finder.locBlocked")
              : err.code === 3 ? t("finder.locTimeout")
              : t("finder.locFail");
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
      );
    });
}

/* ------------------------------------------------------------------ boot */
/* ── Scroll reveal ────────────────────────────────────────────────────────────
   Sections rise+fade in as they enter view; hairlines draw themselves.

   Three rules this obeys, because the audience is disabled people and motion is
   not a free garnish:
   1. FAIL VISIBLE. `.reveal` hides nothing until JS adds `.reveal-ready` to
      <html>. No JS, JS error, slow parse → the page is just... a page. Nobody
      ever stares at blank space because an observer didn't fire.
   2. Reduced motion wins — both the OS setting and the in-app toggle, checked
      live rather than once at boot, since the toggle can flip mid-session.
   3. Reveal once, then forget. Re-animating on every scroll-by is nausea, not
      delight, and it makes re-reading a paragraph hostile. */
let revealObserver = null;

const motionOff = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  document.body.classList.contains("a11y-nomotion");

/** Reveal everything, now, and stop trying to be clever. */
function revealAll(root = document) {
  document.documentElement.classList.remove("reveal-ready");
  root.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

function wireReveals(root = document) {
  if (motionOff()) {
    revealAll(root); // toggle may have flipped mid-animation
    return;
  }

  // If we have no viewport we cannot reason about "on screen", and an
  // IntersectionObserver can never fire against a zero-height root — every
  // .reveal would stay at opacity 0 forever. Seen for real in an embedded
  // browser pane reporting innerHeight === 0. Don't gamble: just show it.
  if (!window.innerHeight || typeof IntersectionObserver === "undefined") {
    revealAll(root);
    return;
  }

  document.documentElement.classList.add("reveal-ready");

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          revealObserver.unobserve(e.target); // once only
        }
      },
      // Fire a little before it hits the viewport so it's already settling when
      // you get there — a reveal you watch happen is a reveal that's too slow.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
  }

  const pending = [];
  root.querySelectorAll(".reveal:not(.in)").forEach((el) => {
    // Already on screen at render (e.g. the top of a guide)? Show it now —
    // don't make someone scroll to reveal what they're already looking at.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) el.classList.add("in");
    else {
      pending.push(el);
      revealObserver.observe(el);
    }
  });

  // WATCHDOG. Hiding content behind an animation is a bet that the animation
  // will run. If that bet ever loses — observer wedged, layout thrash, some
  // browser we didn't test — a disabled person is left staring at blank space
  // where their benefit information should be. Nothing about this effect is
  // worth that, so after 3s anything still waiting is simply shown.
  if (pending.length) {
    clearTimeout(wireReveals._watchdog);
    wireReveals._watchdog = setTimeout(() => {
      pending.forEach((el) => {
        if (!el.isConnected) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("in");
      });
    }, 3000);
  }
}

/* ── Assistant ────────────────────────────────────────────────────────────────
   Talks to POST /api/ask on our own origin (hence CSP connect-src 'self' needs
   no change). Backed by Workers AI on the free allocation, so it can run out;
   that is a normal state, not an error, and is worded as such.

   Opt-in on purpose: this sends the current conversation off the device. The
   separate feedback form is also opt-in. Assistant consent is remembered. */
let askHistory = [];
let askBusy = false;
const ASK_MAX_MESSAGES = 20; // matches the Worker MAX_TURNS (10 exchanges)
let askController = null;
let askCancelled = false;
const askTimeoutMs = () => Number(window.__ASK_TIMEOUT_MS) || 30000; // idle/inactivity bound
const fbTimeoutMs = () => Number(window.__FB_TIMEOUT_MS) || 15000;

function askConsented() {
  return askConsent;
}

function askBubble(cls, text) {
  const log = document.getElementById("askLog");
  const el = document.createElement("div");
  el.className = `ask-msg ${cls}`;
  el.textContent = text; // textContent, never innerHTML — model output is untrusted
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function askAnnounce(msg) {
  const live = document.getElementById("askLive");
  if (live) live.textContent = msg;
}

function askSetBusy(busy) {
  askBusy = busy;
  const send = document.getElementById("askSend");
  const stop = document.getElementById("askStop");
  if (send) send.hidden = busy;
  if (stop) stop.hidden = !busy;
}

async function askSend(question) {
  askHistory.push({ role: "user", content: question });
  askBubble("me", question);
  askSetBusy(true);
  askAnnounce(t("ask.thinking"));

  const bubble = askBubble("bot", "");
  let answer = "";
  askCancelled = false;
  let askTimedOut = false;
  let idleTimer = null;
  askController = new AbortController();
  const clearIdle = () => { if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; } };
  const bumpIdle = () => { clearIdle(); idleTimer = setTimeout(() => { askTimedOut = true; if (askController) askController.abort(); }, askTimeoutMs()); };

  try {
    bumpIdle();
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: askHistory }),
      signal: askController.signal,
    });
    if (!res.ok) {
      clearIdle();
      let msg = t("ask.generic");
      try { msg = (await res.json()).error || msg; } catch (e) {}
      bubble.remove();
      askBubble("err", msg);
      askAnnounce(msg);
      askHistory.pop();
      if (/too long/i.test(msg) || askHistory.length >= ASK_MAX_MESSAGES) showAskCap();
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let failed = null;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bumpIdle();
      buf += decoder.decode(value, { stream: true });
      const parts = buf.split("\n\n");
      buf = parts.pop() ?? "";
      for (const part of parts) {
        const ev = /^event:\s*(.+)$/m.exec(part)?.[1]?.trim();
        const dataLine = /^data:\s*(.+)$/m.exec(part)?.[1];
        if (!ev || !dataLine) continue;
        let data;
        try { data = JSON.parse(dataLine); } catch (e) { continue; }
        if (ev === "delta" && data.text !== undefined && data.text !== null) {
          answer += data.text;
          bubble.textContent = answer;
          document.getElementById("askLog").scrollTop = 99999;
        } else if (ev === "error") {
          failed = data.message;
        }
      }
    }
    clearIdle();
    if (failed) {
      bubble.remove(); askBubble("err", failed); askAnnounce(failed); askHistory.pop();
    } else if (answer.trim() === "") {
      bubble.remove(); const m = t("ask.noreply"); askBubble("err", m); askAnnounce(m); askHistory.pop();
    } else {
      askHistory.push({ role: "assistant", content: answer });
      askAnnounce(answer);
      if (askHistory.length >= ASK_MAX_MESSAGES) showAskCap();
    }
  } catch (e) {
    clearIdle();
    bubble.remove();
    askHistory.pop();
    const m = askCancelled ? t("ask.stopped") : askTimedOut ? t("ask.timeout") : t("ask.netfail");
    askBubble(askCancelled ? "note" : "err", m);
    askAnnounce(m);
  } finally {
    clearIdle();
    askController = null;
    askSetBusy(false);
  }
}

function showAskCap() {
  const newBtn = document.getElementById("askNew");
  const input = document.getElementById("askInput");
  const send = document.getElementById("askSend");
  if (newBtn) { newBtn.hidden = false; newBtn.textContent = t("ask.new"); }
  if (input) input.disabled = true;
  if (send) send.disabled = true;
  askAnnounce(t("ask.capReached"));
}
function resetAskConversation() {
  askHistory = []; // in-memory only; questionnaire/profile answers are untouched
  const log = document.getElementById("askLog");
  if (log) {
    log.innerHTML = "";
    const hint = document.createElement("p");
    hint.className = "ask-hint";
    hint.textContent = "Ask about a word, a form, or a step you are stuck on. For example: what does T2201 mean?";
    log.appendChild(hint);
  }
  const newBtn = document.getElementById("askNew");
  const input = document.getElementById("askInput");
  const send = document.getElementById("askSend");
  if (newBtn) newBtn.hidden = true;
  if (send) send.disabled = false;
  if (input) { input.disabled = false; input.value = ""; input.focus(); }
  askAnnounce(t("ask.newStarted"));
}

function wireAssistant() {
  const fab = document.getElementById("askFab");
  const panel = document.getElementById("askPanel");
  const consent = document.getElementById("askConsent");
  const bodyEl = document.getElementById("askBody");
  const input = document.getElementById("askInput");
  const form = document.getElementById("askForm");
  if (!fab || !panel) return;

  const showChat = () => {
    consent.hidden = true;
    bodyEl.hidden = false;
    if (!document.getElementById("askLog").children.length) {
      const hint = document.createElement("p");
      hint.className = "ask-hint";
      hint.textContent =
        "Ask about a word, a form, or a step you are stuck on. For example: what does T2201 mean?";
      document.getElementById("askLog").appendChild(hint);
    }
  };

  const open = (yes) => {
    panel.hidden = !yes;
    fab.setAttribute("aria-expanded", String(yes));
    if (!yes) return;
    if (askConsented()) { showChat(); input.focus(); }
    else document.getElementById("askAccept").focus();
  };

  fab.addEventListener("click", () => open(panel.hidden));
  document.getElementById("askClose").addEventListener("click", () => { open(false); fab.focus(); });
  const askStop = document.getElementById("askStop");
  if (askStop) askStop.addEventListener("click", () => { askCancelled = true; if (askController) askController.abort(); });
  const askNew = document.getElementById("askNew");
  if (askNew) askNew.addEventListener("click", () => resetAskConversation());

  document.getElementById("askAccept").addEventListener("click", () => {
    askConsent = true;
    notifyStateChange("assistant-consent");
    showChat();
    input.focus();
  });

  // Esc closes, matching the rest of the app's panels.
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { open(false); fab.focus(); }
  });

  // Enter sends; Shift+Enter makes a new line.
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q || askBusy) return;
    input.value = "";
    askSend(q);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
  if (!DATA_PACKS && typeof BENEFIT_INDEX !== "undefined") {
    const fallback = document.querySelector("script[data-full-source]")?.getAttribute("data-full-source");
    await loadDataScript(fallback || `data.js?v=${dataAssetVersion()}`);
  }
  await loadState();
  // Restore all records needed by results, saved follow-ups and deep links
  // before readiness is signalled. Landing never waits for province data.
  if (view !== "landing") await ensurePacks([answers.province, ...packsForView()]);
  // Stable deep link for static guide footers. Only this one value is honoured.
  try {
    if (new URLSearchParams(window.location.search).get("view") === "privacy") view = "privacy";
  } catch (_) { /* malformed query strings must never block boot */ }
  applyA11y();
  applyStaticI18n();
  wireAccessibility();
  wireAssistant();
  wireHeaderMenu();
  const skipLink = document.getElementById("skipLink");
  if (skipLink) skipLink.addEventListener("click", (e) => { e.preventDefault(); const main = document.getElementById("app"); if (main) { main.setAttribute("tabindex", "-1"); main.focus(); } });
  // e2e readiness (#200): tests treat a non-null history.state as "app fully
  // wired" (see e2e/app-ready.js waitForAppReady). This MUST stay AFTER
  // wireAccessibility() above; test/app-init-order.test.js guards the order so a
  // future reorder cannot silently disarm the readiness wait.
  history.replaceState({ view, stepIndex, detailId }, "");
  render();
  if (!document.querySelector(".render-error")) baselineProgramChanges();

  // language switcher
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.addEventListener("click", toggleLang);

  // light / dark theme toggle (initial theme is set by theme-init.js in <head>)
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn)
    themeBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = cur === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      notifyStateChange("theme-change");
    });

  // subtle nav border once the page is scrolled
  const nav = document.getElementById("nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Logo → start over from scratch (clears answers + tracked progress)
  const brand = document.getElementById("brandHome");
  if (brand)
    brand.addEventListener("click", (e) => {
      e.preventDefault();
      // People expect a logo to mean "home", not "erase". Ask before clearing
      // anything they would lose (site audit 2026-10, D-ENGINEERING P3).
      const hasWork = JSON.stringify(answers) !== JSON.stringify(BLANK()) || Object.keys(progress).length > 0;
      if (hasWork && !window.confirm(t("brand.confirmStartOver"))) return;
      stopReadAloud();
      answers = BLANK();
      confirmedFacts = {};
      progress = {};
      stepIndex = 0;
      detailId = null;
      setState("landing");
    });

  // Guarantee every external link opens in a NEW tab (never navigates away).
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-ext]");
    if (!a) return;
    e.preventDefault();
    window.open(a.href, "_blank", "noopener");
  });
  window.AbilityFinderStartup?.ready();
  } catch (error) {
    console.error("AbilityFinder startup failed", error);
    window.AbilityFinderStartup?.fail();
  }
});
