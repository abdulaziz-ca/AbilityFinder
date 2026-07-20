/* =============================================================================
   AbilityFinder — app (router + wizard + eligibility engine + guides)
   Views: landing → wizard → results → detail
   Plain JS, no build step, works from a local server.
   State is saved to IndexedDB + wired to the browser history so the Back
   button and reloads never lose the user's answers.
   ========================================================================== */

/* -------------------------------------------------- answer state (defaults) */
const BLANK = () => ({
  forWho: null,        // "self" | "child" | "family"
  disabilities: [],    // from DISABILITIES values
  ageGroup: null,      // "child" | "adult" | "senior"
  onsetBefore18: null, // true | false  (dynamic: autism/intellectual)
  canWalkFar: null,    // true | false  (dynamic: physical)
  province: null,      // "AB" | "BC" | "ON" | "QC" | "other"
  citizenPR: null,     // true | false
  dtc: null,           // "yes" | "no" | "unsure"
  situation: [],       // "student","working","looking","unableToWork","none"
  income: null,        // "low" | "moderate" | "high"
  city: null,          // an ALBERTA_CITIES string
  postal: null,        // optional — used to find local practitioners
  retroYears: 5,       // back-pay estimator; lives here so it survives a re-render
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
let helpTopic = null;    // "disabilities" | "dtc" — the "I don't know" pages
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
const wizardDone = () => !!(answers.forWho && answers.income); // completed the questionnaire?
const isStudent = () => has(answers.situation, "student");
const isWorking = () => has(answers.situation, "working");
const isLooking = () => has(answers.situation, "looking");
const isUnableToWork = () => has(answers.situation, "unableToWork");
const lowIncome = () => answers.income === "low";
const hasDisability = (v) => has(answers.disabilities, v);
const hasAnyDisability = (list) => list.some((v) => hasDisability(v));

/* =============================================================================
   REQUIREMENTS  (key -> {met, fixed, unmet, action?})
   fixed=true  -> a trait the user can't easily change -> "not a match"
   fixed=false -> actionable (get DTC, enroll, etc.)     -> "one step away"
   ========================================================================== */
const DTC_URL =
  "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2201.html";

const REQS = {
  dtc: {
    met: () => answers.dtc === "yes",
    fixed: false,
    unmet: "Get approved for the Disability Tax Credit first — it unlocks this.",
    action: { text: "Start the DTC (T2201)", url: DTC_URL },
  },
  prolonged: { met: () => true, fixed: false, unmet: "Your condition must have lasted (or be expected to last) 12+ months." },
  certifier: { met: () => true, fixed: false, unmet: "A medical practitioner must certify the form." },

  adult: { met: () => answers.ageGroup === "adult", fixed: true, unmet: "This is for working-age adults (18–64)." },
  workingAge: { met: () => answers.ageGroup === "adult", fixed: true, unmet: "This is for people aged 18–64." },
  child: { met: () => answers.ageGroup === "child", fixed: true, unmet: "This is for children under 18." },
  under60: { met: () => answers.ageGroup !== "senior", fixed: true, unmet: "You must be under 60 to open this." },
  ab: { met: () => answers.province === "AB", fixed: true, unmet: "This is an Alberta program." },
  bc: { met: () => answers.province === "BC", fixed: true, unmet: "This is a British Columbia program." },
  on: { met: () => answers.province === "ON", fixed: true, unmet: "This is an Ontario program." },
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

  lowIncome: { met: () => lowIncome(), fixed: true, unmet: "This is for lower-income households." },
  lowIncomeOrDisabilityIncome: {
    met: () => lowIncome() || answers.dtc === "yes" || isUnableToWork(),
    fixed: true,
    unmet: "For lower-income residents, or those on AISH / CPP Disability.",
  },

  student: { met: () => isStudent(), fixed: true, unmet: "This is for post-secondary students." },
  working: { met: () => isWorking(), fixed: true, unmet: "This is for people with employment income." },
  lookingOrTraining: {
    met: () => isWorking() || isLooking() || isStudent(),
    fixed: false,
    unmet: "You should be working, looking for work, or in training.",
  },
  unableToWork: { met: () => isUnableToWork(), fixed: true, unmet: "This is for people a disability regularly stops from working." },
  cppContrib: { met: () => isWorking() || isUnableToWork(), fixed: false, unmet: "You need enough past CPP contributions from working." },
  severePermanent: {
    met: () => isUnableToWork(),
    fixed: false,
    unmet: "Requires a severe, permanent disability that substantially limits your ability to work.",
  },

  disabilityDoc: { met: () => answers.disabilities.length > 0, fixed: true, unmet: "You'll provide documentation of your disability." },

  /* disability-type driven */
  mobility: {
    // eligible if physical + can't walk 50m, OR vision loss affecting mobility
    met: () =>
      (hasDisability("physical") && answers.canWalkFar === false) ||
      hasDisability("vision"),
    fixed: true,
    unmet: "For a mobility limitation (can't walk ~50m) or vision loss.",
  },
  equipmentNeed: { met: () => hasAnyDisability(EQUIP_NEED), fixed: true, unmet: "For conditions that need medical equipment or supplies." },
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
  // Municipalities with their own verified programs (researched 2026-07-15).
  reddeer: { met: () => answers.city === "Red Deer", fixed: true, unmet: "This is a City of Red Deer program." },
  lethbridge: { met: () => answers.city === "Lethbridge", fixed: true, unmet: "This is a City of Lethbridge program." },
  medicinehat: { met: () => answers.city === "Medicine Hat", fixed: true, unmet: "This is a City of Medicine Hat program." },
  grandeprairie: { met: () => answers.city === "Grande Prairie", fixed: true, unmet: "This is a City of Grande Prairie program." },
  stalbert: { met: () => answers.city === "St. Albert", fixed: true, unmet: "This is a City of St. Albert program." },
  strathcona: { met: () => answers.city === "Sherwood Park", fixed: true, unmet: "This is a Strathcona County program." },
  airdrie: { met: () => answers.city === "Airdrie", fixed: true, unmet: "This is a City of Airdrie program." },
  woodbuffalo: { met: () => answers.city === "Fort McMurray", fixed: true, unmet: "This is a Wood Buffalo (Fort McMurray) program." },
  sprucegrovearea: { met: () => ["Spruce Grove", "Stony Plain"].includes(answers.city), fixed: true, unmet: "This is for eligible Spruce Grove-area residents." },
  leduc: { met: () => answers.city === "Leduc", fixed: true, unmet: "This is a City of Leduc program." },
  cochrane: { met: () => answers.city === "Cochrane", fixed: true, unmet: "This is a Town of Cochrane program." },
  okotoks: { met: () => answers.city === "Okotoks", fixed: true, unmet: "This is a Town of Okotoks program." },
  canmore: { met: () => answers.city === "Canmore", fixed: true, unmet: "This is a Town of Canmore program." },
  lloydminster: { met: () => answers.city === "Lloydminster", fixed: true, unmet: "This is a City of Lloydminster program." },
  fortsask: { met: () => answers.city === "Fort Saskatchewan", fixed: true, unmet: "This is a City of Fort Saskatchewan program." },
  cityOther: {
    // Anywhere we DON'T have a verified municipal program → the 2-1-1 finder.
    // Add a city here the moment you add its program, or people get the generic
    // fallback instead of the real thing.
    met: () => !!answers.city && !CITIES_WITH_PROGRAMS.includes(answers.city),
    fixed: true,
    unmet: "For communities without their own listed program.",
  },
};

/* some benefit URLs are functions of the answers (province-specific) */
const resolveUrl = (u) => (typeof u === "function" ? u(answers) : u);

/* format the structured value model into a money-forward headline + sub-line */
function valueParts(b) {
  const v = BENEFIT_VALUES[b.id];
  if (!v) return { head: b.amount, sub: "", est: false };
  if (v.excludeFromEstimate) return { head: b.amount, sub: "", est: false };
  const m = (n) => "$" + Math.round(n).toLocaleString("en-CA");
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
  if (v.retroMax) subs.push(`up to ${m(v.retroMax)} back-pay if backdated`);
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
/* priority = value × ease, with a big boost for the DTC (it unlocks the rest) */
function priorityScore(b) {
  const v = BENEFIT_VALUES[b.id] || {};
  const meta = BENEFIT_META[b.id] || {};
  let value = 0;
  if (v.annualMax) value += Math.min(v.annualMax / 1000, 14);
  else if (v.monthlyMax) value += Math.min(v.monthlyMax / 100, 14);
  if (v.lifetimeMax) value += Math.min(v.lifetimeMax / 12000, 8);
  if (v.retroMax) value += Math.min(v.retroMax / 6000, 4);
  if (["services", "coverage"].includes(v.kind)) value += 3;
  const ease = 6 - (meta.difficulty || 3);
  const gateway = b.masterKey ? 12 : 0;
  return value * 1.4 + ease + gateway;
}

function renderMoneyBand(ready, almost) {
  const matched = [...ready, ...almost];
  // headline = what's READY now (honest); unlocks shown separately as potential
  const readyVals = ready.map((e) => BENEFIT_VALUES[e.b.id]).filter(Boolean);
  const annualTotal = readyVals.filter((v) => ["cash", "grant", "taxCredit"].includes(v.kind) && !v.excludeFromEstimate && v.annualMax).reduce((s, v) => s + v.annualMax, 0);
  const lifetime = matched.map((e) => BENEFIT_VALUES[e.b.id]).find((v) => v && v.lifetimeMax);
  const hasDtc = matched.some((e) => e.b.id === "dtc");
  const round100 = (n) => Math.round(n / 100) * 100;
  const extras = [];
  if (hasDtc) extras.push("up to $25,000 one-time DTC back-pay");
  if (lifetime) extras.push(`up to ${money(lifetime.lifetimeMax)} lifetime (RDSP)`);
  const retro = hasDtc
    ? `<div class="retro">
        <label class="retro-label" for="retroYears">Roughly how long have you had your disability? <span class="opt-tag">(estimates back-pay)</span></label>
        <div class="retro-row">
          <select class="select-input" id="retroYears">
            <option value="0"${(answers.retroYears ?? 5) === 0 ? " selected" : ""}>Less than a year</option>
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => `<option value="${y}"${y === (answers.retroYears ?? 5) ? " selected" : ""}>${y} year${y > 1 ? "s" : ""}${y === 10 ? "+" : ""}</option>`).join("")}
          </select>
          <div class="retro-out" id="retroOut"></div>
        </div>
      </div>`
    : "";
  return `
  <div class="money-band">
    <div class="mb-head">
      <span class="mb-badge">${icon("money")}</span>
      <div>
        <div class="mb-total">Up to <b>~${money(round100(annualTotal))}</b> / year</div>
        <div class="mb-sub">in support you may qualify for${extras.length ? " · " + extras.join(" · ") : ""}</div>
      </div>
    </div>
    ${retro}
    <p class="mb-caveat">Rough estimates — not everything stacks (e.g. AISH has income limits). Open each benefit for real numbers.</p>
  </div>`;
}

/* -------------------------------------------------------------- engine */
function evaluate(benefit) {
  const needs = [];
  const reasons = [];
  for (const key of benefit.requires) {
    const req = REQS[key];
    if (!req || req.met()) continue;
    if (req.fixed) {
      reasons.push(req.unmet);
    } else {
      let text = req.unmet;
      if (key === "dtc" && answers.dtc === "unsure") {
        text = "You're not sure about your Disability Tax Credit — apply for it; it unlocks this.";
      }
      needs.push({ text, action: req.action });
    }
  }
  if (reasons.length) return { status: "no", needs, reasons };
  if (needs.length) return { status: "almost", needs, reasons };
  return { status: "ready", needs, reasons };
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
    onPick(v) {
      // Only "my child" implies an age group. A family member could be any age,
      // so don't guess — let them answer the age question themselves.
      if (v === "child") answers.ageGroup = "child";
      else if (answers.ageGroup === "child") answers.ageGroup = null;
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
    // DYNAMIC — only if autism / intellectual selected (drives PDD eligibility)
    id: "onset", type: "single", kicker: "A bit more",
    q: "Did this begin before age 18?",
    help: "Some Alberta programs (like PDD) are specifically for developmental disabilities that started in childhood.",
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
    help: () => `This decides whether an accessible parking placard applies to ${who().them}.`,
    key: "canWalkFar",
    skipIf: () => !hasDisability("physical"),
    options: [
      { value: true, label: "Yes, usually fine" },
      { value: false, label: "No, that's difficult or impossible" },
    ],
  },
  {
    id: "age", type: "single", kicker: "About you",
    q: () => (answers.forWho === "self" ? "Which age group applies?" : `Which age group is ${subj()} in?`),
    help: () => `Age decides which programs are open to ${who().them}.`,
    key: "ageGroup",
    skipIf: () => answers.forWho === "child",
    options: [
      { value: "child", label: "Under 18" },
      { value: "adult", label: "18 to 64", sub: "Working age" },
      { value: "senior", label: "65 or older" },
    ],
  },
  {
    id: "residency", type: "single", kicker: "About you",
    q: () => `${who().doQ} live in Alberta?`,
    help: "Federal benefits apply anywhere in Canada. Alberta's provincial programs are fully built out right now — other provinces are coming soon.",
    key: "province",
    options: [
      { value: "AB", label: "Yes, I live in Alberta" },
      { value: "other", label: "No, another province or territory", sub: "you'll still see all Canada-wide benefits" },
    ],
    onPick(v) {
      // a city from another province is no longer valid
      if (!(CITIES_BY_PROVINCE[v] || []).includes(answers.city)) answers.city = null;
    },
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
    id: "dtc", type: "single", kicker: "The master key 🔑",
    q: () => `${who().areQ} approved for the Disability Tax Credit (DTC)?`,
    help: "The DTC is the #1 thing that unlocks most disability benefits. If you don't have it, that's okay — we'll show you how to get it.",
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
      sub: "How to check in 2 minutes — it's worth the most here",
    },
  },
  {
    id: "situation", type: "multi", kicker: "Your situation",
    q: () => `What best describes ${subj()} right now?`,
    help: "Pick all that apply — this opens up work & school supports.",
    key: "situation",
    options: [
      { value: "student", icon: "student", label: "In post-secondary school" },
      { value: "working", icon: "working", label: "Working / have a job" },
      { value: "looking", icon: "looking", label: "Looking for work or training" },
      { value: "unableToWork", icon: "unable", label: "A disability stops me from working" },
      { value: "none", icon: "none", label: "None of these" },
    ],
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
    skipIf: () => !COVERED_PROVINCES.includes(answers.province),
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

const visibleSteps = () => STEPS.filter((s) => !(s.skipIf && s.skipIf()));

const PERSISTENCE_SELECTIONS = {
  disabilities: DISABILITIES.map((item) => item.value),
  situations: STEPS.find((step) => step.key === "situation").options.map((item) => item.value),
  provinces: STEPS.find((step) => step.key === "province").options.map((item) => item.value),
  cities: ALBERTA_CITIES,
  benefitIds: BENEFITS.map((benefit) => benefit.id),
  progressStages: STAGES.map((stage) => stage.key),
};

/* =============================================================================
   PERSISTENCE + HISTORY
   ========================================================================== */
const stateChanges = new AbilityFinderState.StateChangeEmitter();

function persistentState() {
  return AbilityFinderState.buildPersistedState({
    answers, view, stepIndex, detailId, detailFrom, progress, groupMode,
    browseQuery, browseTheme, browseLevel, browseDis, a11y, lang: LANG,
    helpTopic, helpReturnStep,
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
  answers = restored.answers;
  view = restored.view;
  stepIndex = restored.stepIndex;
  detailId = restored.detailId;
  detailFrom = restored.detailFrom;
  helpTopic = restored.helpTopic;
  helpReturnStep = restored.helpReturnStep;
  progress = restored.progress;
  groupMode = restored.groupMode;
  browseQuery = restored.browseQuery;
  browseTheme = restored.browseTheme;
  browseLevel = restored.browseLevel;
  browseDis = restored.browseDis;
  a11y = restored.a11y;
  LANG = restored.lang;
  askConsent = restored.askConsent;
  document.documentElement.setAttribute("data-theme", restored.theme);

  // Drop unknown tracker stages and invalid guide IDs before either can render.
  for (const id in progress) if (!STAGE[progress[id]]) delete progress[id];
  if (view === "detail" && !BENEFITS.some((b) => b.id === detailId)) view = "results";
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

  const openPanel = (open) => {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
  };
  fab.addEventListener("click", () => openPanel(panel.hidden));
  if (close) close.addEventListener("click", () => openPanel(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") openPanel(false);
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
function splitSentences(text) {
  const m = text.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]*/g);
  return m ? m.map((s) => s.trim()).filter(Boolean) : [text.trim()];
}
function buildTtsUnits() {
  ttsUnits = [];
  const sel = "#app h1, #app h2, #app h3, #app p, #app li, #app .amount, #app .step-kicker, #app .master-flag, #app .eyebrow, #app .group-title";
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
function updateNavTag() {
  const tag = document.getElementById("navTag");
  if (tag) tag.textContent = PROVINCE_NAME[answers.province] || t("nav.tag");
}

let lastRenderKey = null;
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
        <button class="btn btn-primary" onclick="location.reload()">Try again</button>
        <button class="btn btn-ghost" id="reReset">Start over</button>
      </div>
      <p class="re-foot">If it keeps happening, please tell us — the feedback form is on the home page, and it genuinely gets read.</p>
    </section>`;
  }
}

function render() {
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
  } else if (view === "browse") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderBrowse, "browse");
    wireBrowse();
  } else if (view === "detail") {
    progress.style.display = "block";
    bar.style.width = "100%";
    app.innerHTML = renderSafely(() => renderDetail(detailId), "guide");
    wireDetail();
  } else if (view === "privacy") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderPrivacy, "privacy");
    wirePrivacy();
  } else if (view === "about") {
    progress.style.display = "none";
    app.innerHTML = renderSafely(renderAbout, "about");
    wireAbout();
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
  // "Start over" on the error card, wired here so it works from any view.
  const reReset = document.getElementById("reReset");
  if (reReset)
    reReset.addEventListener("click", () => {
      answers = BLANK(); progress = {}; stepIndex = 0; detailId = null;
      setState("landing");
    });
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
          <button class="btn btn-ghost js-browse">${icon("search")} Browse all benefits</button>
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
        <div class="preview-top"><span class="pv-dot"></span><b>8</b> ${t("pv.found")}<span class="pv-badge">${icon("check")} ${t("pv.qualify")}</span></div>
        <div class="pv-hero">
          <div class="pv-hero-l">
            <span class="pv-hero-lbl">Estimated total</span>
            <span class="pv-hero-val">~$14,600<i>/yr</i></span>
          </div>
          <div class="pv-gauge"><span class="pv-gauge-fill"></span><span class="pv-gauge-tick" style="left:74%"></span></div>
        </div>
        <div class="pv-list">
          <div class="pv-row"><span class="pv-ic">${icon("money")}</span><span class="pv-meta"><b>${t("pv.dtc")}</b><span>≈ $10,138 / year</span></span><span class="pv-check">${icon("check")}</span></div>
          <div class="pv-row"><span class="pv-ic">${icon("money")}</span><span class="pv-meta"><b>${t("pv.rdsp")}</b><span>+ $4,500 / year</span></span><span class="pv-check">${icon("check")}</span></div>
          <div class="pv-row"><span class="pv-ic">${icon("transit")}</span><span class="pv-meta"><b>${t("pv.transit")}</b><span>from $5.90 / month</span></span><span class="pv-check">${icon("check")}</span></div>
          <div class="pv-row"><span class="pv-ic">${icon("money")}</span><span class="pv-meta"><b>${t("pv.cdb")}</b><span>${t("pv.needsDtc")}</span></span><span class="pv-lock">${icon("lock")}</span></div>
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
        <textarea id="fb-msg" class="text-input" rows="4" placeholder="${t("fb.placeholder")}"></textarea>
      </label>
      <div class="fb-actions">
        <button class="btn btn-primary" id="fb-send">${t("fb.send")} ${icon("arrowRight")}</button>
        <button class="btn btn-ghost" id="fb-mailto" type="button">${icon("external")} Open my email app instead</button>
      </div>
      <p class="fb-note" id="fb-status">${t("fb.note")}</p>
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
        <button class="linklike js-browse">Browse all benefits</button>
        <span class="sf-note">Alberta + federal · Info verified ${DATA_VERIFIED} · Not government-affiliated</span>
      </div>
    </footer>
  </section>`;
}

function navigateStart() {
  // if they already have answers, jump straight to results
  if (answers.forWho && answers.income) setState("results");
  else setState("wizard", { stepIndex: 0 });
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
  "life-turning18": [["forWho", "self"], ["ageGroup", "adult"]],
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
  progress = {};
  editingReturn = false;
  selections.forEach(([key, value]) => {
    const step = STEPS.find((candidate) => candidate.key === key);
    if (step) applyWizardSelection(step, value);
  });
  setState("wizard", { stepIndex: 0 });
}

function wireLanding() {
  const app = document.getElementById("app");
  wireNavigation(app);
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

  const send = document.getElementById("fb-send");
  if (send)
    send.addEventListener("click", async () => {
      const { kind, email, message, status } = fbFields();
      if (!message) {
        status.textContent = t("fb.needMsg");
        status.classList.add("err");
        return;
      }
      status.classList.remove("err");
      send.disabled = true;
      status.textContent = "Sending…";
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, email, message }),
        });
        if (!res.ok) {
          let m = "Could not send.";
          try { m = (await res.json()).error || m; } catch (e) {}
          throw new Error(m);
        }
        status.classList.remove("err");
        status.innerHTML = `${icon("check")} Sent — thank you. We read every message.`;
        document.getElementById("fb-msg").value = "";
      } catch (err) {
        status.classList.add("err");
        status.textContent = `${err.message} You can use "Open my email app instead".`;
        send.disabled = false;
      }
    });

  const mailtoBtn = document.getElementById("fb-mailto");
  if (mailtoBtn)
    mailtoBtn.addEventListener("click", () => {
      const { kind, email, message, status } = fbFields();
      if (!message) {
        status.textContent = t("fb.needMsg");
        status.classList.add("err");
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

   Two of the questions are ones people genuinely cannot answer, and answering
   them wrong is expensive: guess "not sure" on the DTC and you may skip the
   single biggest benefit here.

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
        p: "People expect one, and it doesn't exist. The government doesn't decide by diagnosis — it decides by <b>how much your condition limits you day to day</b>, even with treatment. Two people with the same diagnosis can get different answers. Someone with a condition nobody's heard of can qualify easily.",
      },
      {
        h: "This question does not decide anything",
        p: "The categories on the last page are just buckets we use to match you to programs and to suggest the right kind of practitioner. Picking one doesn't make you eligible, and picking the “wrong” one doesn't disqualify you. Nothing here is sent to the government.",
      },
      {
        h: "So what should you pick?",
        p: "Whatever is closest. If two fit, pick both — it's a multi-select. If nothing fits, pick <b>“Something else / not listed”</b> and carry on; you'll still get the full federal and Alberta list, because most benefits don't depend on the category at all.",
      },
      {
        h: "If you don't have a diagnosis yet",
        p: "You can still apply for most of this. What the forms need is a <b>practitioner describing your limitations</b> — not a label. Start with a family doctor or nurse practitioner and describe what you struggle to do, and how long it takes. If you don't have a practitioner, the benefit guides here have a “find one near you” search.",
      },
      {
        h: "If you want to talk to a person",
        p: "Voice of Albertans with Disabilities and Inclusion Alberta both help people work out what they might qualify for, for free, before any paperwork. Alberta 211 (dial 2-1-1, any time) will point you to local help. They're all listed under “Real people who can help” on your results.",
      },
    ],
    foot:
      "Still stuck? Pick the closest option and keep going — you can change any answer afterwards by tapping it on the results page.",
  },
  dtc: {
    kicker: "The master key",
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
        p: "Most people using this site don't have it yet, and it's the first thing worth doing. Answer <b>“No, not yet”</b> and we'll put the DTC at the top of your list with a step-by-step guide — including what “severe and prolonged” actually means, which is where most people wrongly rule themselves out.",
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
    ${block("Analytics", `<p>AbilityFinder uses <b>Cloudflare Web Analytics</b>, a privacy-first measurement tool with no cookies, no fingerprinting, no cross-site tracking, and no personal profiles. It counts aggregate page views — including the page, country, and browser type — so we know which guides help people. Your wizard answers are never part of analytics and never leave your device.</p>`)}
    ${block("No tracking cookies, no ads", `<p>There is no advertising, cross-site tracking, or fingerprinting. We don't set tracking cookies.</p>`)}
    ${block("Fonts and files", `<p>All fonts and core app files are served from this site itself. The Cloudflare Web Analytics beacon is the only externally hosted measurement script.</p>`)}
    ${block("Location", `<p>The “Use my location” button only asks your browser for your location when <b>you tap it</b>. A postal code stays in current-page memory; neither it nor your coordinates are saved in IndexedDB or sent to AbilityFinder. If you open a practitioner-search link, the postal code or coordinates are included in a user-initiated Google Maps URL and are then sent to Google under its privacy policy.</p>`)}
    ${block("Links to other sites", `<p>Every “Apply” and official link opens the relevant government website in a new tab. Once you're on those sites, their own privacy policies apply — not ours.</p>`)}
    ${block("Clearing your data", `<p>Click the <b>AbilityFinder</b> logo (or “Start over”) to wipe your answers, or clear your browser's site data at any time. IndexedDB is still browser-owned storage: if you clear this site's data or delete your browser profile, your saved progress is deleted and AbilityFinder cannot recover it.</p>`)}

    <div class="legal-block">
      <h2>Important disclaimer</h2>
      <p>AbilityFinder is a free helper tool, <b>not</b> legal, medical, or financial advice, and it is not affiliated with the Government of Canada or Alberta. Dollar figures are <b>estimates</b> to give you a sense of scale — your actual amount depends on your situation. Eligibility rules and amounts change; always confirm the current details on each official government page before you apply. Information was last verified ${DATA_VERIFIED}.</p>
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

    ${block("What AbilityFinder is", `<p>AbilityFinder is a free, independent tool that helps Albertans with disabilities find every government benefit they may qualify for. It is not affiliated with any government. There is no login and there are no ads.</p>`)}
    ${block("How we verify facts", `<p>Every benefit is backed by official government sources. Each benefit shows when its information was last verified.</p><p>Automated link monitoring checks official links around the clock and flags pages that break or move. The app also shows a warning when information is getting old and needs another review.</p>`)}
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
    <p class="legal-lede">Small actions can help more disabled Albertans find support.</p>

    <div class="legal-block">
      <h2>Keep it free</h2>
      <p>AbilityFinder is free and independent, and it will stay free for the people who need it.</p>
    </div>
    <div class="legal-block">
      <h2>Ways to help</h2>
      <p>Share AbilityFinder with someone who may need it. If you find an error, please use the <button class="linklike js-feedback">feedback form</button> to tell us.</p>
      <p>Organizations that help disabled Albertans are welcome to link to AbilityFinder or get in touch through the <button class="linklike js-feedback">feedback form</button>.</p>
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
    ${block("Embed AbilityFinder on your site", `<p>Add the private, one-question AbilityFinder card to your organization’s website.</p><div class="embed-snippet"><code id="embedSnippet" tabindex="0">&lt;iframe src=&quot;https://abilityfinder.ca/embed.html&quot; title=&quot;AbilityFinder benefit check&quot; width=&quot;100%&quot; height=&quot;420&quot; style=&quot;border:0&quot; loading=&quot;lazy&quot;&gt;&lt;/iframe&gt;</code><button class="btn btn-secondary" id="copyEmbedSnippet" type="button">Copy snippet</button></div>`)}
    ${block(t("pro.partner.h"), `<p>${t("pro.partner.p")}</p><p><button class="btn btn-primary cred-cta" type="button" data-prof-nav="partner">${t("pro.partner.button")} ${icon("arrowRight")}</button></p>`)}
    ${block(t("pro.dtc.h"), `<p>${t("pro.dtc.p")}</p><p><button class="btn btn-primary cred-cta" type="button" data-prof-nav="dtc-prep">${t("pro.dtc.button")} ${icon("arrowRight")}</button></p>`)}
    ${block(t("orgs.pro.h"), `<p>${t("orgs.pro.p")}</p><p><button class="btn btn-primary cred-cta" type="button" data-prof-nav="organizations">${t("orgs.pro.button")} ${icon("arrowRight")}</button></p>`)}
    ${block(t("pro.contact.h"), `<p>${t("pro.contact.p")} <button class="linklike" type="button" data-page-feedback>${t("fb.send")}</button></p>`)}
    <button class="back-link bottom" id="pro-back2">${icon("arrowLeft")} Back</button>
  </section>`;
}

function renderPartnerOverview() {
  const programCount = Array.isArray(BENEFITS) ? BENEFITS.length : 0;
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
  const visible = directory.filter((grant) => grantsAudience === "all" || grant.audience === "all" || grant.audience === grantsAudience);
  const filters = ["all", "children", "adults"].map((audience) => `
    <button class="grants-filter" type="button" data-grants-filter="${audience}" aria-pressed="${grantsAudience === audience}">
      ${t(`grants.filter.${audience}`)}
    </button>`).join("");
  const cards = visible.map((grant) => `
    <article class="grant-card" data-grant-id="${ttsEscape(grant.id)}">
      <header>
        <span class="grant-card-icon" aria-hidden="true">${icon("money")}</span>
        <div><h2>${ttsEscape(grant.name)}</h2><p class="grant-org">${ttsEscape(grant.org)}</p></div>
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
    <p class="legal-lede">${t("grants.lede")}</p>
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
  const cards = directory.map((organization) => `
    <article class="org-card" data-org-id="${ttsEscape(organization.id)}">
      <header>
        <span class="org-card-icon" aria-hidden="true">${icon("help")}</span>
        <div><h2>${ttsEscape(organization.name)}</h2><p class="org-region">${ttsEscape(organization.region)}</p></div>
      </header>
      <dl>
        <div><dt>${t("orgs.region")}</dt><dd>${ttsEscape(organization.region)}</dd></div>
        <div><dt>${t("orgs.what")}</dt><dd>${ttsEscape(organization.whatTheyDo)}</dd></div>
      </dl>
      <a class="org-link" href="${ttsEscape(organization.url)}" target="_blank" rel="noopener noreferrer">${t("orgs.website")} ${icon("external")}</a>
      <p class="org-verified">${icon("check")}${t("orgs.verified")}</p>
    </article>`).join("");
  const rules = Array.from({ length: 6 }, (_, index) => {
    const content = t(`orgs.rules.${index + 1}`);
    return `<li>${index === 5 ? `<button class="linklike" type="button" data-page-feedback>${content}</button>` : content}</li>`;
  }).join("");
  return `<section class="legal orgs-page">
    <button class="back-link" type="button" data-orgs-back>${icon("arrowLeft")} ${t("orgs.back")}</button>
    <p class="section-label">${t("orgs.kicker")}</p>
    <h1 class="legal-title">${t("orgs.title")}</h1>
    <p class="legal-lede">${t("orgs.lede")}</p>
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
  const programs = Array.isArray(BENEFITS) ? BENEFITS : [];
  const levels = programs.reduce((counts, benefit) => {
    if (benefit.level === "Federal") counts.federal += 1;
    else if (benefit.level === "Alberta") counts.provincial += 1;
    else counts.municipal += 1;
    return counts;
  }, { federal: 0, provincial: 0, municipal: 0 });
  return {
    programs: programs.length,
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

function recentlyVerifiedBenefits() {
  const programs = Array.isArray(BENEFITS) ? BENEFITS : [];
  const verifiedDates = typeof BENEFIT_VERIFIED === "object" && BENEFIT_VERIFIED ? BENEFIT_VERIFIED : {};
  const catalogDate = typeof DATA_VERIFIED_ISO === "string" ? DATA_VERIFIED_ISO : "";
  return programs.filter((benefit) => benefit && typeof benefit === "object").map((benefit, catalogIndex) => {
    const rawDate = benefit.id ? verifiedDates[benefit.id] : null;
    const isoDate = typeof rawDate === "string" && /^\d{4}-\d{2}$/.test(rawDate)
      ? `${rawDate}-01`
      : catalogDate;
    return { benefit, catalogIndex, isoDate };
  })
    .sort((a, b) => String(b.isoDate).localeCompare(String(a.isoDate)) || a.catalogIndex - b.catalogIndex)
    .slice(0, 10);
}

function renderUpdates() {
  const verifiedItems = recentlyVerifiedBenefits().map(({ benefit, isoDate }) => `
    <li class="updates-feed-item">
      <div class="updates-feed-heading">
        <h3>${ttsEscape(String(benefit.name || "Unnamed program"))}</h3>
        <time datetime="${ttsEscape(String(isoDate || ""))}">${ttsEscape(plainEnglishDate(isoDate))}</time>
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
      .map((o) => {
        const selected =
          step.type === "multi"
            ? answers[step.key].includes(o.value)
            : answers[step.key] === o.value;
        return `
        <button class="opt ${selected ? "selected" : ""}" data-value='${JSON.stringify(o.value)}'>
          ${o.icon ? icon(o.icon) : ""}
          <span class="label">${optionText(step, o)}${o.sub ? `<span class="sub">${o.sub}</span>` : ""}</span>
          <span class="tick"></span>
        </button>`;
      })
      .join("");
    const twoCol = stepOpts.length === 2 ? "two" : "";
    controlHtml = `<div class="options ${twoCol}">${optionsHtml}</div>`;
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
      <h2 class="step-q">${T.q}</h2>
      <p class="step-help">${T.help}</p>
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
  if (step.type === "multi") return answers[step.key].length > 0;
  return answers[step.key] !== null;
}

function applyWizardSelection(step, value) {
  const validOption = stepOptions(step).some((option) => {
    const optionValue = typeof option === "object" ? option.value : option;
    return optionValue === value;
  });
  if (!validOption) return false;

  if (step.type === "multi") toggleMulti(step, value);
  else {
    answers[step.key] = value;
    if (step.onPick) step.onPick(value);
  }
  notifyStateChange("wizard-answer");
  return true;
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
        answers[step.key] = sel.value;
        notifyStateChange("wizard-answer");
        render();
        setTimeout(goNext, 150);
      });
    const back = document.getElementById("back");
    const next = document.getElementById("next");
    if (back) back.addEventListener("click", goBack);
    if (next) next.addEventListener("click", goNext);
    return;
  }

  document.querySelectorAll(".opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = JSON.parse(btn.dataset.value);
      if (!applyWizardSelection(step, value)) return;
      if (step.type === "multi") {
        render(); // reflect selection, stay on step
      } else {
        render();
        setTimeout(goNext, 200); // snappy auto-advance
      }
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
    if (value === step.exclusive) { answers[step.key] = [value]; return; }
    const ex = arr.indexOf(step.exclusive);
    if (ex >= 0) arr.splice(ex, 1);
  }
  arr.push(value);
}

function finishEdit() { editingReturn = false; setState("results"); }
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
  return { ...source, disabilities: [...source.disabilities], situation: [...source.situation] };
}

/* REQS intentionally powers both real and hypothetical results. Swap its answer
   model only for this synchronous calculation, then restore the real model before
   returning. Nothing here emits a state change or reaches persistence. */
function evaluateAnswers(answerModel) {
  const realAnswers = answers;
  answers = answerModel;
  try {
    return BENEFITS.map((b) => ({ b, r: evaluate(b) }));
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
  const age = visible.find((step) => step.key === "ageGroup");
  const situation = visible.find((step) => step.key === "situation");
  const income = visible.find((step) => step.key === "income");
  const city = visible.find((step) => step.key === "city");

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

  const chips = [...scenarioChanges.values()].map((change) => `<button type="button" class="scenario-chip" data-scenario-remove="${change.id}" aria-label="${t("scenario.remove")} ${change.label}">${change.label}${icon("x")}</button>`).join("");
  let diff = `<p class="scenario-empty">${t("scenario.empty")}</p>`;
  if (scenarioChanges.size) {
    const hypothetical = evaluateAnswers(model);
    const current = new Map(currentEvaluated.map((e) => [e.b.id, e]));
    const changed = new Map(hypothetical.map((e) => [e.b.id, e]));
    const matched = (status) => status === "ready" || status === "almost";
    const gained = hypothetical.filter((e) => matched(e.r.status) && !matched(current.get(e.b.id).r.status));
    const lost = currentEvaluated.filter((e) => matched(e.r.status) && !matched(changed.get(e.b.id).r.status));
    const newlyReady = hypothetical.filter((e) => e.r.status === "ready" && current.get(e.b.id).r.status !== "ready");
    const noLongerReady = currentEvaluated.filter((e) => e.r.status === "ready" && changed.get(e.b.id).r.status !== "ready");
    const row = (key, items, tone) => `<div class="scenario-diff-row ${tone}"><b>${t(key)} <span>${items.length}</span></b><p>${items.length ? items.map((e) => e.b.name).join(" · ") : t("scenario.none")}</p></div>`;
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

function renderResults() {
  const evaluated = BENEFITS.map((b) => ({ b, r: evaluate(b) }));
  const ready = evaluated.filter((e) => e.r.status === "ready");
  const almost = evaluated.filter((e) => e.r.status === "almost");
  // "not a match" excludes programs that belong to a DIFFERENT province
  const no = evaluated.filter((e) => {
    if (e.r.status !== "no") return false;
    const p = benefitProvince(e.b);
    return !p || p === answers.province;
  });

  // order by priority (value × ease; DTC boosted because it unlocks the rest)
  ready.sort((a, b) => priorityScore(b.b) - priorityScore(a.b));
  almost.sort((a, b) => priorityScore(b.b) - priorityScore(a.b));

  const totalWin = ready.length + almost.length;

  const matched = [...ready, ...almost];
  // stable priority rank for the "ready" items (1..N) — reused in both group modes
  const rankOf = {};
  ready.forEach((e, i) => { rankOf[e.b.id] = i + 1; });

  const headline = totalWin === 1 ? t("res.headline1") : t("res.headline");
  let html = `
  <div class="results-head">
    <div class="big">${totalWin}</div>
    <h2>${headline}</h2>
    <p>${resultsBlurb(ready.length, almost.length)}</p>
  </div>
  ${renderMoneyBand(ready, almost)}
  ${renderScenarioPanel(evaluated)}
  <div class="results-tools">
    <button class="tool-btn" id="printList">${icon("print")}${t("res.print")}</button>
    <div class="group-toggle" role="group" aria-label="Group benefits by">
      <button class="gt-btn ${groupMode === "priority" ? "on" : ""}" data-group="priority">${icon("list")}Priority order</button>
      <button class="gt-btn ${groupMode === "category" ? "on" : ""}" data-group="category">${icon("grid")}By category</button>
    </div>
  </div>
  ${trackerSummary(matched)}
  ${renderAnswerChips()}
  ${renderPrintActionPlan(matched)}`;

  html += renderMatchedGroups(ready, almost, rankOf);

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
  html += `<p class="disclaimer">${t("disclaimer")}</p>`;
  return html;
}

/* which province a benefit belongs to (federal / nationwide → null) */
function benefitProvince(b) {
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
  /* This section was being ignored, and the content is some of the most useful
     on the site — "extra time on exams", "a distraction-free exam room". The
     closed row said only a category name and a count, which gives nobody a
     reason to open it. So the closed state now previews what's actually inside,
     and the framing leads with the real selling point: unlike every benefit
     here, none of this needs a form, a practitioner, or a 20-week wait. */
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
      <p>practical things matched to ${who().poss === "your" ? "your" : poss()} answers that need
        <b>no form, no practitioner and no waiting</b> — you can use them this week.
        Everything above takes weeks; none of this does.</p>
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
    <p class="summary">${o.summary}</p>
    <div class="help-actions">${tel}${web}</div>
  </div>`;
}
function renderHelpDirectory() {
  if (typeof HELP_ORGS === "undefined" || !HELP_ORGS.length) return "";
  const sections = HELP_CATEGORIES.map((c) => {
    const orgs = HELP_ORGS.filter((o) => o.cat === c.cat);
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
    <p class="supports-sub">You don't have to do this alone. These Alberta and national organizations help people fill out the forms, appeal a decision, and find local services — most of them for free.</p>
    ${sections}
  </div>`;
}

function resultsBlurb(readyN, almostN) {
  const fr = LANG === "fr";
  if (readyN && almostN)
    return fr
      ? `Vous pouvez faire une demande pour ${readyN} maintenant, et ${almostN} de plus s'ouvrent après une étape (souvent l'obtention du crédit d'impôt pour personnes handicapées). Touchez une carte pour un guide détaillé.`
      : `You're ready to apply for ${readyN} now, and ${almostN} more open up once you take one step (usually getting your Disability Tax Credit). Tap any card for a step-by-step guide.`;
  if (readyN)
    return fr
      ? `Voici ce que vous pouvez demander dès maintenant. Touchez une carte pour un guide en langage clair et le lien direct.`
      : `Here's what you can apply for right now. Tap any card for a plain-language guide and the direct link.`;
  if (almostN)
    return fr
      ? `Vous y êtes presque ! Obtenir votre crédit d'impôt pour personnes handicapées (CIPH) est la clé qui débloque ces prestations.`
      : `You're close! Getting your Disability Tax Credit (DTC) is the key that unlocks these. Tap any card to see how.`;
  return fr
    ? `Aucune correspondance selon vos réponses — ajustez vos réponses, ou commencez par le crédit d'impôt pour personnes handicapées.`
    : `Based on your answers we didn't find a match — try adjusting your answers, or start with the Disability Tax Credit.`;
}

function groupTitle(kind, ic, text, count) {
  return `<div class="group-title ${kind}"><span class="gi">${icon(ic)}</span>${text}<span class="count">${count}</span></div>`;
}

/* broad theme buckets for the "By category" dashboard view */
const THEMES = [
  { key: "money",         label: "Money & income",        icon: "money" },
  { key: "health",        label: "Health & equipment",    icon: "health" },
  { key: "getting-around",label: "Getting around",        icon: "transit" },
  { key: "employment",    label: "Work & employment",     icon: "working" },
  { key: "education",     label: "Education",             icon: "education" },
  { key: "family",        label: "Family & daily living", icon: "family" },
];
function benefitTheme(b) {
  const c = (b.category || "").toLowerCase();
  if (c.includes("money") || c.includes("tax") || c.includes("savings")) return "money";
  if (c.includes("employ") || c.includes("work")) return "employment";
  if (c.includes("education")) return "education";
  if (c.includes("health") || c.includes("equipment")) return "health";
  if (c.includes("getting around") || c.includes("recreation") || c.includes("transit")) return "getting-around";
  return "family"; // family supports, daily-living supports
}

/* render matched benefits either in priority groups or by category theme */
function renderMatchedGroups(ready, almost, rankOf) {
  if (groupMode === "category") {
    const all = [...ready, ...almost].sort((a, b) => priorityScore(b.b) - priorityScore(a.b));
    return THEMES.map((th) => {
      const items = all.filter((e) => benefitTheme(e.b) === th.key);
      if (!items.length) return "";
      return groupTitle(th.key, th.icon, th.label, items.length) +
        `<div class="benefits-grid">${items.map((e) => benefitCard(e.b, e.r, rankOf[e.b.id])).join("")}</div>`;
    }).join("");
  }
  let h = "";
  if (ready.length) {
    h += groupTitle("ready", "check", t("grp.ready"), ready.length);
    h += `<div class="benefits-grid">${ready.map((e) => benefitCard(e.b, e.r, rankOf[e.b.id])).join("")}</div>`;
  }
  if (almost.length) {
    h += groupTitle("almost", "key", t("grp.almost"), almost.length);
    h += `<div class="benefits-grid">${almost.map((e) => benefitCard(e.b, e.r, rankOf[e.b.id])).join("")}</div>`;
  }
  return h;
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
  `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;

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

function buildReminderIcs() {
  const now = new Date();
  const stamp = `${icsDate(now)}T000000Z`;
  const events = [];
  const addDays = (n) => new Date(now.getTime() + n * 86400000);

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

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AbilityFinder//Reminders//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(e.date)}`,
      `DTEND;VALUE=DATE:${icsDate(new Date(e.date.getTime() + 86400000))}`,
      icsFold(`SUMMARY:${icsEsc(e.summary)}`),
      icsFold(`DESCRIPTION:${icsEsc(e.desc)}`),
      "TRANSP:TRANSPARENT",
      // 9am on the day, not midnight — a reminder nobody sees is not a reminder.
      "BEGIN:VALARM",
      "TRIGGER:PT9H",
      "ACTION:DISPLAY",
      icsFold(`DESCRIPTION:${icsEsc(e.summary)}`),
      "END:VALARM",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return { ics: lines.join("\r\n") + "\r\n", count: events.length };
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

function benefitCard(b, r, rank) {
  const stage = progress[b.id] || "";
  const cls = b.masterKey ? "master" : r.status;
  const masterFlag = b.masterKey
    ? `<div class="master-flag">${icon("key")} Start here — this unlocks the rest</div>` : "";
  const rankBadge = rank ? `<span class="rank-badge" title="Suggested order to apply">${rank}</span>` : "";
  const needsHtml =
    r.status === "almost" && r.needs.length
      ? `<div class="needs">
           <div class="needs-h">${t("det.almostSub")}</div>
           <ul>${r.needs.map((n) => `<li>${n.text}</li>`).join("")}</ul>
         </div>` : "";

  const v = valueParts(b);
  const valueHtml = `<span class="amount">${v.est ? `<span class="amount-tag">Est. value</span>` : ""}${v.head}</span>${v.sub ? `<span class="amount-sub">${v.sub}</span>` : ""}`;
  return `
  <div class="benefit ${cls} ${stage ? "stage-" + stage : ""}">
    ${masterFlag}
    <div class="benefit-row">
      <div class="benefit-main">
        <div class="top">
          ${rankBadge}
          <h3 id="benefit-title-${b.id}">${b.name}</h3>
          <span class="tag lvl">${b.level}</span>
          <span class="tag">${b.category}</span>
        </div>
        <p class="summary">${b.summary}</p>
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
};

/* "Find a/an <type>" with the correct article */
const findLabel = (type) => `Find a${/^[aeiou]/i.test(type) ? "n" : ""} ${type}`;

/* Personalized, form-aware "find a practitioner near you" block. */
function practitionerFinder(b) {
  const type = practitionerType();
  const formName = (b && PRACTITIONER_FORMS[b.id]) || "your disability form";
  const formFlag = `
    <div class="finder-flag">${icon("check")}
      <span>You'll need a practitioner willing to complete <b>${formName}</b>. Not every clinic does these — it's worth calling ahead to ask.</span>
    </div>`;
  /* (C) Other people who can sign THIS form — only where data.js actually says
     so (today: DTC). In Alberta a family doctor can take months to see, and
     plenty of people don't have one at all; knowing a nurse practitioner or
     optometrist can sign a T2201 is the difference between applying and giving
     up. Never render a signer we haven't verified. */
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
        <li>“Is there a fee to fill it out, and how much?” — form fees vary and usually aren't covered by Alberta Health, so it's fair to ask up front.</li>
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
      <input id="finderPostal" class="text-input finder-postal" data-finder-postal inputmode="text" placeholder="${t("finder.postalPh")}" value="${answers.postal || ""}" />
      <button class="btn btn-ghost" data-finder-loc type="button">${icon("compass")} ${t("finder.useLoc")}</button>
    </div>
    <div class="finder-btns">
      <a class="apply finder-search" data-ptype="${type}" href="${mapsSearchUrl(type)}" target="_blank" rel="noopener noreferrer" data-ext>${findLabel(type)} ${icon("external")}</a>
      ${type !== "family doctor" ? `<a class="apply secondary finder-search" data-ptype="family doctor" href="${mapsSearchUrl("family doctor")}" target="_blank" rel="noopener noreferrer" data-ext>${findLabel("family doctor")} ${icon("external")}</a>` : ""}
    </div>
    ${signerChips}
    ${wizardNudge}
    ${askTips}
    <p class="finder-note" data-finder-note>${t("finder.note")}</p>
  </div>`;
}

/* supports & strategies (non-monetary help) matched to disability + situation */
function supportMatches(item) {
  const disOk = item.dis && item.dis.length ? item.dis.some((d) => hasDisability(d)) : null;
  const sitOk = item.sit && item.sit.length ? item.sit.some((s) => answers.situation.includes(s)) : null;
  return disOk === true || sitOk === true;
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

function wireResults() {
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

  // retroactive DTC back-pay estimator (~$2,000/yr of DTC value, up to 10 years)
  const retroSel = document.getElementById("retroYears");
  const retroOut = document.getElementById("retroOut");
  if (retroSel && retroOut) {
    const upd = () => {
      const y = Math.min(parseInt(retroSel.value, 10) || 0, 10);
      // Store it: this used to be hardcoded to 5, so opening a benefit and
      // coming back silently threw the choice away and showed the wrong
      // back-pay figure.
      answers.retroYears = y;
      notifyStateChange("estimator-change");
      const amt = y * 2000;
      retroOut.innerHTML = amt > 0
        ? `≈ <b>${money(amt)}</b> in DTC back-pay you could recover`
        : `Apply now so future years start counting`;
    };
    upd();
    retroSel.addEventListener("change", upd);
  }

  const r = document.getElementById("restart");
  if (r)
    r.addEventListener("click", () => {
      answers = BLANK();
      progress = {};
      stepIndex = 0;
      detailId = null;
      setState("landing", {}, true);
    });
}

/* ---- print-only action plan; built entirely from the local catalog ---- */
function renderPrintActionPlan(matched) {
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const listed = matched.map((e) => e.b);
  // Keep an explicitly tracked benefit in the plan even if later answer edits
  // mean it is no longer in the current match set.
  BENEFITS.forEach((b) => {
    if (progress[b.id] && !listed.some((item) => item.id === b.id)) listed.push(b);
  });
  const printDate = new Date().toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
  const items = listed.map((b) => {
    const url = resolveUrl(b.applyUrl);
    const nextStep = b.detail && Array.isArray(b.detail.steps) && b.detail.steps.length
      ? `<p class="print-next"><b>Next step:</b> ${esc(b.detail.steps[0])}</p>` : "";
    const documents = b.detail && Array.isArray(b.detail.documents) && b.detail.documents.length
      ? `<div class="print-documents"><b>Forms and documents</b><ul>${b.detail.documents.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div>` : "";
    return `<section class="print-benefit">
      <h2>${esc(b.name)}</h2>
      <p>${esc(b.summary)}</p>
      ${url ? `<p class="print-url"><b>Official link:</b> ${esc(url)}</p>` : ""}
      ${nextStep}
      ${documents}
    </section>`;
  }).join("");
  return `<article class="print-action-plan" aria-hidden="true">
    <header><h1>AbilityFinder — My action plan</h1><p class="print-date">${esc(printDate)}</p></header>
    ${items || "<p>No matched or tracked benefits yet.</p>"}
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
  const age = { child: "Under 18", adult: "18–64", senior: "65+" }[answers.ageGroup];
  if (age) parts.push(age);
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
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const evaluated = BENEFITS.map((b) => ({ b, r: evaluate(b) }));
  const ready = evaluated.filter((e) => e.r.status === "ready").sort((a, b) => priorityScore(b.b) - priorityScore(a.b));
  const almost = evaluated.filter((e) => e.r.status === "almost").sort((a, b) => priorityScore(b.b) - priorityScore(a.b));

  const section = ({ b, r }, i) => {
    const v = valueParts(b);
    const value = esc(v.head) + (v.sub ? ` — ${esc(v.sub)}` : "");
    const meta = BENEFIT_META[b.id] || {};
    const di = difficultyInfo(meta.difficulty);
    const metaBits = [meta.effort && `Apply: ${meta.effort}`, meta.wait && `Wait: ${meta.wait}`, `Difficulty: ${di.label}`]
      .filter(Boolean).map(esc).join(" · ");
    const steps = b.detail && b.detail.steps
      ? `<p class="lbl">How to apply</p><ol>${b.detail.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : "";
    const docs = b.detail && b.detail.documents && b.detail.documents.length
      ? `<p class="lbl">What you'll need</p><ul>${b.detail.documents.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : "";
    const tracked = progress[b.id] && STAGE[progress[b.id]] ? STAGE[progress[b.id]].label : null;
    const status = tracked || (r.status === "ready" ? "Ready to apply" : "One step away");
    const phone = b.detail && b.detail.phone ? `<p class="lnk">Phone: ${esc(b.detail.phone)}</p>` : "";
    return `<section>
      <h3><span class="num">${i}</span>${esc(b.name)} <span class="badge">${esc(status)}</span></h3>
      <p class="meta">${esc(b.level)} · ${esc(b.category)}${metaBits ? " · " + metaBits : ""}</p>
      <p class="amt">${value}</p>
      <p>${esc(b.summary)}</p>
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
      <p class="brand">AbilityFinder · Alberta + federal</p>
      <h1>My disability benefits report</h1>
      ${profile ? `<p class="profile"><b>Based on:</b> ${esc(profile)}</p>` : ""}
      ${total > 0 ? `<p class="total">Estimated support you may qualify for: <b>up to ~$${total.toLocaleString("en-CA")}/year</b>, plus one-time back-pay and lifetime savings where noted. Rough estimate — not everything stacks.</p>` : ""}
      ${dateStr ? `<p class="profile" style="color:#888;font-size:12px;margin-top:8px;">Prepared ${esc(dateStr)}. Share this with a family member, caregiver, or case worker.</p>` : ""}
    </header>
    ${readyRows ? `<p class="grp">Ready to apply (${ready.length})</p>${readyRows}` : ""}
    ${almostRows ? `<p class="grp">One step away (${almost.length})</p>${almostRows}` : ""}
    ${!readyRows && !almostRows ? "<p>No matches yet — try adjusting your answers in AbilityFinder.</p>" : ""}
    <footer>
      Amounts are estimates. Always confirm current rules and amounts on each official government page before applying.
      This report is a helper, not legal, medical, or financial advice. Info verified ${esc(DATA_VERIFIED)}.
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
const BROWSE_LEVELS = [
  { key: "all", label: "All levels" },
  { key: "Federal", label: "Federal" },
  { key: "Alberta", label: "Alberta" },
  { key: "local", label: "Local / city" },
];
function benefitIsLocal(b) {
  return b.level === "Calgary" || b.level === "Edmonton" || b.level === "Your community";
}
function benefitSearchText(b) {
  const d = b.detail || {};
  return [b.name, b.summary, b.category, b.level, d.about, (d.tips || []).join(" ")]
    .filter(Boolean).join(" ").toLowerCase();
}
/* ── Per-disability browse (2026-07-15) ───────────────────────────────────────
   Derived from each benefit's own `requires`, NOT a hand-written tag table:
   one source of truth, so it cannot drift when the rules change.

     mobility      → physical, vision
     equipmentNeed → EQUIP_NEED
     developmental → intellectual, autism

   This is a *sort*, not a filter: most catalog entries are not diagnosis-specific
   because Canadian and Alberta disability benefits usually key off how much a
   condition limits someone, not the diagnosis label.

   So hiding non-matching benefits would be actively harmful — pick "autism" and
   you'd stop seeing DTC, AISH and RDSP, which you very likely qualify for. That
   is the exact self-rejection this whole site exists to prevent. Instead we
   surface the specific ones first, badge them, and say the true thing out loud. */
const DIS_BY_REQ = {
  mobility: ["physical", "vision"],
  equipmentNeed: EQUIP_NEED,
  developmental: ["intellectual", "autism"],
};

/** Disabilities a benefit specifically targets. Empty = applies to any. */
function benefitDisabilities(b) {
  const out = new Set();
  for (const r of b.requires || []) (DIS_BY_REQ[r] || []).forEach((d) => out.add(d));
  return [...out];
}
const isDisSpecific = (b, dis) => benefitDisabilities(b).includes(dis);

function browseFiltered() {
  const q = browseQuery.trim().toLowerCase();
  return BENEFITS.filter((b) => {
    if (browseTheme !== "all" && benefitTheme(b) !== browseTheme) return false;
    if (browseLevel !== "all") {
      if (browseLevel === "local" ? !benefitIsLocal(b) : b.level !== browseLevel) return false;
    }
    if (q && !benefitSearchText(b).includes(q)) return false;
    return true;
  }).sort((a, b) => {
    // Specifically-relevant first when a disability is picked; never hidden.
    if (browseDis !== "all") {
      const ra = isDisSpecific(a, browseDis) ? 1 : 0;
      const rb = isDisSpecific(b, browseDis) ? 1 : 0;
      if (ra !== rb) return rb - ra;
    }
    return priorityScore(b) - priorityScore(a);
  });
}
/* a status-agnostic card for browsing (no eligibility judgement) */
function browseCard(b) {
  const v = valueParts(b);
  const valueHtml = `<span class="amount">${v.est ? `<span class="amount-tag">Est. value</span>` : ""}${v.head}</span>${v.sub ? `<span class="amount-sub">${v.sub}</span>` : ""}`;
  return `
  <div class="benefit browse-card ${b.masterKey ? "master" : ""}${browseDis !== "all" && isDisSpecific(b, browseDis) ? " dis-match" : ""}">
    <div class="benefit-row">
      <div class="benefit-main">
        <div class="top">
          <h3>${b.name}</h3>
          <span class="tag lvl">${b.level}</span>
          <span class="tag">${b.category}</span>
          ${browseDis !== "all" && isDisSpecific(b, browseDis) ? `<span class="tag dis-tag">${icon("check")} Aimed at this</span>` : ""}
        </div>
        <p class="summary">${b.summary}</p>
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
  // Say the true thing rather than quietly hiding 17 benefits.
  const nSpec = browseDis === "all" ? 0 : BENEFITS.filter((b) => isDisSpecific(b, browseDis)).length;
  const disLabel = (DISABILITIES.find((d) => d.value === browseDis) || {}).label || "";
  const disNote = browseDis === "all" ? "" : `
    <p class="browse-disnote">${icon("info")}
      <span>${nSpec
        ? `<b>${nSpec} program${nSpec === 1 ? " is" : "s are"} aimed specifically at ${disLabel.toLowerCase()}</b> — shown first.`
        : `<b>No program is aimed only at ${disLabel.toLowerCase()}</b>.`}
      Everything else still applies to you: most disability benefits go by <b>how much your condition limits you</b>, not by your diagnosis. That's why we don't hide the rest.</span>
    </p>`;
  return `
  <section class="browse">
    <button class="back-link" id="b-back">${icon("arrowLeft")} Home</button>
    <div class="browse-head">
      <h1>Browse every benefit</h1>
      <p>Explore all ${BENEFITS.length} programs in our Alberta + federal catalog — no questionnaire needed. Want a list tailored to you?
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
    </div>
    ${disNote}
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
}
function wireBrowse() {
  const back = document.getElementById("b-back");
  if (back) back.addEventListener("click", () => setState("landing"));
  const start = document.getElementById("b-start");
  if (start) start.addEventListener("click", () => {
    if (answers.forWho && answers.income) setState("results");
    else setState("wizard", { stepIndex: 0 });
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
function listBlock(title, ic, items, ordered) {
  if (!items || !items.length) return "";
  const tag = ordered ? "ol" : "ul";
  return `
  <div class="guide-block">
    <div class="guide-h">${icon(ic)} ${title}</div>
    <${tag} class="guide-list">${items.map((i) => `<li>${i}</li>`).join("")}</${tag}>
  </div>`;
}

const DATA_VERIFIED = "July 2026";

/* ── Freshness that doesn't over-claim ────────────────────────────────────────
   DATA_VERIFIED is one human-readable date stamped on all catalog entries. It is
   honest today (they really were all checked in July 2026) but it cannot age:
   in two years it will still say "verified", and the amounts are the product.
   These make staleness computable and per-benefit. */

/** Machine-comparable twin of DATA_VERIFIED. Keep the two in step. */
const DATA_VERIFIED_ISO = "2026-07-01";

/**
 * Per-benefit override, "id": "YYYY-MM". ADD AN ENTRY WHEN YOU RE-CHECK ONE
 * BENEFIT against its official page — anything absent falls back to the
 * catalog-wide date, which is the truth: it was last checked with everything
 * else. Never add a date you did not actually verify; a fake date here is worse
 * than no date, because the whole point is telling people when to distrust us.
 */
const BENEFIT_VERIFIED = {
  aish: "2026-07",
  adap: "2026-07",
  "cpp-disability": "2026-07",
  "parking-placard": "2026-07",
  "sprucegrove-low-income-transit": "2026-07",
  "leduc-subsidies": "2026-07",
  "cochrane-connect-card": "2026-07",
  "okotoks-fee-assistance": "2026-07",
  "canmore-affordable-services": "2026-07",
  "lloydminster-recreation-access": "2026-07",
  "fortsask-access": "2026-07",
};

/** Past this, the guide tells the reader to confirm the number themselves. */
const STALE_MONTHS = 9;

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function verifiedFor(b) {
  const raw = (b && BENEFIT_VERIFIED[b.id]) || null;
  const iso = raw ? `${raw}-01` : DATA_VERIFIED_ISO;
  const when = new Date(`${iso}T00:00:00Z`);
  const now = new Date();
  const months =
    (now.getUTCFullYear() - when.getUTCFullYear()) * 12 + (now.getUTCMonth() - when.getUTCMonth());
  return {
    label: `${MONTHS_EN[when.getUTCMonth()]} ${when.getUTCFullYear()}`,
    months: Math.max(0, months),
    stale: months >= STALE_MONTHS,
    perBenefit: !!raw,
  };
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
    ? `<div class="callout"><span class="co-ic">${icon("info")}</span><div><b>Good to know</b><p>${x.taxNote}</p></div></div>`
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
      .map((rid) => { const rb = BENEFITS.find((z) => z.id === rid); return rb ? `<button class="related-chip" data-related-id="${rid}">${rb.name} ${icon("arrowRight")}</button>` : ""; })
      .join("");
    if (chips) related = `<div class="guide-block"><div class="guide-h">${icon("key")} Works well with</div><div class="related-chips">${chips}</div></div>`;
  }
  return { tax, denials, appeal, faqs, related, plainTest };
}

function renderGuideBody(b, r = evaluate(b), options = {}) {
  const inline = !!options.inline;
  const backBtn = (idn) => `<button class="back-link${idn === "d-back2" ? " bottom" : ""}" id="${idn}">${icon("arrowLeft")} ${t("det.back")}</button>`;
  const d = b.detail || {};
  const vFresh = verifiedFor(b); // Per-benefit freshness.

  const x = BENEFIT_EXTRA[b.id] || {};
  let statusBanner = "";
  if (!wizardDone()) {
    statusBanner = `
      <div class="status-banner maybe">${icon("compass")}<div><b>Want to know if you qualify?</b>
        Answer a few quick questions and we'll tell you — and tailor this guide to you.
        <button class="linklike" data-guide-check>Check my eligibility ${icon("arrowRight")}</button></div>
      </div>`;
  } else if (r.status === "almost") {
    statusBanner = `
      <div class="status-banner almost">${icon("key")}<div><b>${t("det.almostH")}</b> ${t("det.almostSub")}
        <ul>${r.needs.map((n) => `<li>${n.text}</li>`).join("")}</ul></div>
      </div>`;
  } else if (x.confirm) {
    statusBanner = `<div class="status-banner maybe">${icon("info")}<div><b>Likely eligible</b> — final approval depends on ${x.confirm}.</div></div>`;
  } else {
    statusBanner = `<div class="status-banner ready">${icon("check")}<span>${t("det.eligible")}</span></div>`;
  }
  const p2 = p2Sections(b);

  const dtcAction = wizardDone() ? r.needs.find((n) => n.action) : null;
  const meta = [];
  if (d.time) meta.push(`<div class="meta-item"><span>${t("meta.time")}</span>${d.time}</div>`);
  if (d.phone) meta.push(`<div class="meta-item"><span>${t("meta.contact")}</span>${d.phone}</div>`);
  const enNote = LANG !== "en" ? `<div class="note">${t("det.enNote")}</div>` : "";

  const v = valueParts(b);
  const valueHead = `<div class="detail-amount">${v.est ? `<span class="amount-tag">Est. value</span>` : ""}${v.head}</div>${v.sub ? `<div class="detail-amount-sub">${v.sub}</div>` : ""}`;

  // "At a glance" facts for the sticky sidebar
  const mm = BENEFIT_META[b.id] || {};
  const di = difficultyInfo(mm.difficulty);
  const facts = [];
  if (mm.difficulty) facts.push(["Difficulty", `<span class="fact-diff ${di.cls}"><span class="dots">${di.dots}</span> ${di.label}</span>`]);
  if (mm.effort) facts.push(["Time to apply", mm.effort]);
  if (mm.wait) facts.push(["Wait for a decision", mm.wait]);
  if (d.time) facts.push(["Processing", d.time]);
  if (d.phone) facts.push(["Phone", d.phone]);
  facts.push(["Level", b.level]);
  facts.push(["Category", b.category]);
  const factsHtml = facts.map(([k, val]) => `<div class="fact"><dt>${k}</dt><dd>${val}</dd></div>`).join("");

  const sideStatus = !wizardDone()
    ? { cls: "maybe", txt: "Check your eligibility" }
    : r.status === "almost" ? { cls: "almost", txt: "One step away" }
    : x.confirm ? { cls: "maybe", txt: "Likely eligible" }
    : { cls: "ready", txt: "You're eligible" };

  return `
  ${inline ? "" : `<div class="detail">
    ${backBtn("d-back")}

    <header class="detail-hero">
      <div class="detail-tags">
        <span class="tag lvl">${b.level}</span>
        <span class="tag">${b.category}</span>
      </div>
      <h1 class="detail-title">${b.name}</h1>
      <p class="detail-lede">${b.summary}</p>
    </header>`}

    <div class="detail-body${inline ? " inline-guide-body" : ""}">
      <div class="detail-main">
        ${statusBanner}
        ${enNote}

        ${d.about && d.about !== b.summary ? `<p class="detail-about">${d.about}</p>` : ""}
        ${b.note ? `<div class="note">${b.note}</div>` : ""}
        ${b.id === "dtc" ? `<div class="dtc-prep-guide-cta"><button class="apply" type="button" data-open-dtc-prep>${icon("print")}${t("dtcPrep.guideButton")}</button></div>` : ""}
        ${p2.tax}
        ${/* Before "how to apply" on purpose: knowing you might actually
              qualify is what gets someone to read the steps at all. */ ""}
        ${p2.plainTest}

        ${listBlock(t("guide.how"), "compass", d.steps, true)}
        ${b.needsPractitioner && !inline ? practitionerFinder(b) : ""}
        ${listBlock(t("guide.need"), "check", d.documents, false)}
        ${listBlock(t("guide.tips"), "info", d.tips, false)}
        ${p2.denials}
        ${p2.appeal}
        ${p2.faqs}
        ${p2.related}
        ${inline ? `<div class="inline-guide-full"><button class="inline-guide-full-link" type="button" data-open-full-guide="${b.id}">${t("guide.openFull")} ${icon("arrowRight")}</button></div>` : ""}
      </div>

      <aside class="detail-side">
        <div class="side-card">
          <span class="side-status ${sideStatus.cls}">${sideStatus.txt}</span>
          ${valueHead}
          <dl class="side-facts">${factsHtml}</dl>
          <div class="side-actions">
            <a class="apply" href="${resolveUrl(b.applyUrl)}" target="_blank" rel="noopener noreferrer" data-ext>${b.applyText} ${icon("external")}</a>
            ${dtcAction ? `<a class="apply secondary" href="${dtcAction.action.url}" target="_blank" rel="noopener noreferrer" data-ext>${dtcAction.action.text} ${icon("external")}</a>` : ""}
            <a class="source-link" href="${resolveUrl(b.source)}" target="_blank" rel="noopener noreferrer" data-ext>${t("det.official")} ${icon("external")}</a>
          </div>
          <p class="side-foot"><span class="verified${vFresh.stale ? " stale" : ""}">${icon(vFresh.stale ? "info" : "check")} Info verified ${vFresh.label}</span></p>
          ${vFresh.stale ? `<p class="side-stale">${icon("info")} <span>That was about ${vFresh.months} months ago. Amounts and income rules usually change each year, so <b>check the official page above</b> before you count on a number here.</span></p>` : ""}
        </div>
      </aside>
    </div>

    ${inline ? "" : `${backBtn("d-back2")}</div>`}`;
}

function renderDetail(id) {
  const b = BENEFITS.find((x) => x.id === id);
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
  if (send) send.disabled = busy;
}

async function askSend(question) {
  askHistory.push({ role: "user", content: question });
  askBubble("me", question);
  askSetBusy(true);
  askAnnounce("Thinking.");

  const bubble = askBubble("bot", "");
  let answer = "";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: askHistory }),
    });

    // Non-streaming failures (429 rate limit, 400 validation) arrive as JSON.
    if (!res.ok) {
      let msg = "Something went wrong. Please try again.";
      try { msg = (await res.json()).error || msg; } catch (e) {}
      bubble.remove();
      askBubble("err", msg);
      askAnnounce(msg);
      askHistory.pop();
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let failed = null;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      const parts = buf.split("\n\n");
      buf = parts.pop() ?? ""; // keep the trailing partial event

      for (const part of parts) {
        const ev = /^event:\s*(.+)$/m.exec(part)?.[1]?.trim();
        const dataLine = /^data:\s*(.+)$/m.exec(part)?.[1];
        if (!ev || !dataLine) continue;

        let data;
        try { data = JSON.parse(dataLine); } catch (e) { continue; }

        // Not a truthy check: a "0" token is legitimate content and would be
        // dropped. The Worker already sends strings, but stay defensive.
        if (ev === "delta" && data.text !== undefined && data.text !== null) {
          answer += data.text;
          bubble.textContent = answer;
          document.getElementById("askLog").scrollTop = 99999;
        } else if (ev === "error") {
          failed = data.message;
        }
      }
    }

    if (failed) {
      bubble.remove();
      askBubble("err", failed);
      askAnnounce(failed);
      askHistory.pop();
    } else if (answer.trim() === "") {
      bubble.remove();
      const m = "The assistant did not reply. Please try again.";
      askBubble("err", m);
      askAnnounce(m);
      askHistory.pop();
    } else {
      askHistory.push({ role: "assistant", content: answer });
      askAnnounce(answer); // announce the finished answer once, not per token
    }
  } catch (e) {
    bubble.remove();
    const m = "Could not reach the assistant. Check your connection and try again.";
    askBubble("err", m);
    askAnnounce(m);
    askHistory.pop();
  } finally {
    askSetBusy(false);
  }
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
  await loadState();
  applyA11y();
  applyStaticI18n();
  wireAccessibility();
  wireAssistant();
  wireHeaderMenu();
  history.replaceState({ view, stepIndex, detailId }, "");
  render();

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
      stopReadAloud();
      answers = BLANK();
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
});
