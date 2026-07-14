/* =============================================================================
   AbilityFinder — app (router + wizard + eligibility engine + guides)
   Views: landing → wizard → results → detail
   Plain JS, no build step, works from a local server.
   State is saved to localStorage + wired to the browser history so the Back
   button and reloads never lose the user's answers.
   ========================================================================== */

/* -------------------------------------------------- answer state (defaults) */
const BLANK = () => ({
  forWho: null,        // "self" | "child"
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
});

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
let answers = BLANK();

/* view state */
let view = "landing";   // "landing" | "wizard" | "results" | "detail"
let stepIndex = 0;
let detailId = null;
let detailFrom = "results"; // "results" | "browse" — where the guide was opened from
let progress = {};      // { benefitId: stageKey } — where the user is in each application
let editingReturn = false; // when true, editing one answer returns to results
let groupMode = "priority"; // "priority" | "category" — how results are grouped

/* browse/search view state (explore all benefits without doing the wizard) */
let browseQuery = "";
let browseTheme = "all"; // a THEMES key, or "all"
let browseLevel = "all"; // "all" | "Federal" | "Alberta" | "local"

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

const STORE_KEY = "abilityfinder.v2";
const A11Y_KEY = "abilityfinder.a11y";

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
  cityOther: {
    met: () =>
      !!answers.city && answers.city !== "Calgary" && answers.city !== "Edmonton",
    fixed: true,
    unmet: "For communities outside Calgary and Edmonton.",
  },
};

/* some benefit URLs are functions of the answers (province-specific) */
const resolveUrl = (u) => (typeof u === "function" ? u(answers) : u);

/* format the structured value model into a money-forward headline + sub-line */
function valueParts(b) {
  const v = BENEFIT_VALUES[b.id];
  if (!v) return { head: b.amount, sub: "", est: false };
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
  const annualTotal = readyVals.filter((v) => ["cash", "grant", "taxCredit"].includes(v.kind) && v.annualMax).reduce((s, v) => s + v.annualMax, 0);
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
            <option value="0">Less than a year</option>
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((y) => `<option value="${y}"${y === 5 ? " selected" : ""}>${y} year${y > 1 ? "s" : ""}${y === 10 ? "+" : ""}</option>`).join("")}
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
    ],
    onPick(v) {
      if (v === "child") answers.ageGroup = "child";
      else if (answers.ageGroup === "child") answers.ageGroup = null;
    },
  },
  {
    id: "disabilities", type: "multi", kicker: "Your disability",
    q: "Which of these apply?",
    help: "Pick all that fit — you can choose more than one. This is private and never leaves your browser.",
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
    q: "Can you comfortably walk about 50 metres (half a block)?",
    help: "This decides whether an accessible parking placard applies to you.",
    key: "canWalkFar",
    skipIf: () => !hasDisability("physical"),
    options: [
      { value: true, label: "Yes, usually fine" },
      { value: false, label: "No, that's difficult or impossible" },
    ],
  },
  {
    id: "age", type: "single", kicker: "About you",
    q: "Which age group applies?",
    help: "Age decides which programs are open to you.",
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
    q: "Do you live in Alberta?",
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
    q: "Are you a Canadian citizen or permanent resident?",
    help: "Most government benefits require this.",
    key: "citizenPR",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No / not yet" },
    ],
  },
  {
    id: "dtc", type: "single", kicker: "The master key 🔑",
    q: "Are you approved for the Disability Tax Credit (DTC)?",
    help: "The DTC is the #1 thing that unlocks most disability benefits. If you don't have it, that's okay — we'll show you how to get it.",
    key: "dtc",
    options: [
      { value: "yes", label: "Yes, I'm approved" },
      { value: "no", label: "No, not yet" },
      { value: "unsure", label: "I'm not sure what that is" },
    ],
  },
  {
    id: "situation", type: "multi", kicker: "Your situation",
    q: "What best describes you right now?",
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
    help: "Some money benefits are for lower incomes. A rough answer is fine — we never store or send this anywhere.",
    key: "income",
    options: [
      { value: "low", label: "Lower income", sub: "Under ~$35,000" },
      { value: "moderate", label: "Middle income", sub: "~$35,000–$80,000" },
      { value: "high", label: "Higher income", sub: "Over ~$80,000" },
    ],
  },
  {
    id: "city", type: "select", kicker: "Your community",
    q: "Which city or town do you live in or near?",
    help: "Unlocks local transit and recreation discounts. Start typing to find yours.",
    key: "city",
    placeholder: "Choose your city or town…",
    skipIf: () => !COVERED_PROVINCES.includes(answers.province),
    options: ALBERTA_CITIES, // replaced at render time by the province's list
  },
];

/* the city list depends on the chosen province */
const stepOptions = (step) =>
  step.id === "city" ? (CITIES_BY_PROVINCE[answers.province] || []) : step.options;

const visibleSteps = () => STEPS.filter((s) => !(s.skipIf && s.skipIf()));

/* =============================================================================
   PERSISTENCE + HISTORY
   ========================================================================== */
function persist() {
  try {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ answers, view, stepIndex, detailId, progress, groupMode })
    );
  } catch (e) {}
}
function restore() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (!s) return;
    answers = Object.assign(BLANK(), s.answers || {});
    view = s.view || "landing";
    stepIndex = s.stepIndex || 0;
    detailId = s.detailId || null;
    groupMode = s.groupMode === "category" ? "category" : "priority";
    progress = s.progress || {};
    // migrate the old binary "applied" model → the multi-stage tracker
    if (s.applied) for (const id in s.applied) if (s.applied[id] && !progress[id]) progress[id] = "submitted";
    // drop any unknown stage keys (forward-compat safety)
    for (const id in progress) if (!STAGE[progress[id]]) delete progress[id];
    if (view === "detail" && !BENEFITS.some((b) => b.id === detailId)) view = "results";
  } catch (e) {}
}

/* ---------------------------------------------------- accessibility engine */
function persistA11y() {
  try { localStorage.setItem(A11Y_KEY, JSON.stringify(a11y)); } catch (e) {}
}
function restoreA11y() {
  try {
    const s = JSON.parse(localStorage.getItem(A11Y_KEY));
    if (s) a11y = Object.assign(a11y, s);
  } catch (e) {}
}
function applyA11y() {
  document.documentElement.style.fontSize = `${Math.round(16 * a11y.fontScale)}px`;
  document.body.classList.toggle("a11y-spacing", a11y.spacing);
  document.body.classList.toggle("a11y-contrast", a11y.contrast);
  document.body.classList.toggle("a11y-links", a11y.links);
  document.body.classList.toggle("a11y-guide", a11y.guide);
  document.body.classList.toggle("a11y-nomotion", a11y.motion);
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
const LANG_KEY = "abilityfinder.lang";
function restoreLang() { try { const l = localStorage.getItem(LANG_KEY); if (l && I18N[l]) LANG = l; } catch (e) {} }
function persistLang() { try { localStorage.setItem(LANG_KEY, LANG); } catch (e) {} }
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

function setState(nextView, opts = {}, push = true) {
  view = nextView;
  if ("stepIndex" in opts) stepIndex = opts.stepIndex;
  if ("detailId" in opts) detailId = opts.detailId;
  const snap = { view, stepIndex, detailId };
  if (push) history.pushState(snap, "");
  else history.replaceState(snap, "");
  persist();
  render();
}

window.addEventListener("popstate", (e) => {
  const s = e.state;
  if (s) {
    view = s.view;
    stepIndex = s.stepIndex ?? stepIndex;
    detailId = s.detailId ?? null;
  } else {
    view = "landing";
  }
  persist();
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
    app.innerHTML = renderLanding();
    wireLanding();
  } else if (view === "wizard") {
    const steps = visibleSteps();
    if (stepIndex > steps.length - 1) stepIndex = steps.length - 1;
    progress.style.display = "block";
    bar.style.width = `${(stepIndex / steps.length) * 100}%`;
    app.innerHTML = renderStep(steps[stepIndex]);
    wireStep(steps[stepIndex]);
  } else if (view === "results") {
    progress.style.display = "block";
    bar.style.width = "100%";
    app.innerHTML = renderResults();
    wireResults();
  } else if (view === "browse") {
    progress.style.display = "none";
    app.innerHTML = renderBrowse();
    wireBrowse();
  } else if (view === "detail") {
    progress.style.display = "block";
    bar.style.width = "100%";
    app.innerHTML = renderDetail(detailId);
    wireDetail();
  } else if (view === "privacy") {
    progress.style.display = "none";
    app.innerHTML = renderPrivacy();
    wirePrivacy();
  }
  if (samePage) {
    window.scrollTo(0, keepScroll);
  } else {
    stopReadAloud(); // don't keep narrating an old page
    window.scrollTo(0, 0);
  }
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
      <button class="btn btn-primary" id="fb-send">${t("fb.send")} ${icon("arrowRight")}</button>
      <p class="fb-note" id="fb-status">${t("fb.note")}</p>
    </div>

    <p class="disclaimer">${t("disclaimer")}</p>

    <footer class="site-footer">
      <div class="sf-brand">${icon("compass")} AbilityFinder</div>
      <div class="sf-links">
        <button class="linklike js-privacy">Privacy &amp; disclaimer</button>
        <button class="linklike js-browse">Browse all benefits</button>
        <span class="sf-note">Alberta + federal · Info verified ${DATA_VERIFIED} · Not government-affiliated</span>
      </div>
    </footer>
  </section>`;
}

function wireLanding() {
  document.querySelectorAll(".js-start").forEach((b) =>
    b.addEventListener("click", () => {
      // if they already have answers, jump straight to results
      if (answers.forWho && answers.income) setState("results");
      else setState("wizard", { stepIndex: 0 });
    })
  );
  document.querySelectorAll(".js-browse").forEach((b) =>
    b.addEventListener("click", () => setState("browse"))
  );
  document.querySelectorAll(".js-privacy").forEach((b) =>
    b.addEventListener("click", () => setState("privacy"))
  );

  const send = document.getElementById("fb-send");
  if (send)
    send.addEventListener("click", () => {
      const type = document.getElementById("fb-type").value;
      const email = document.getElementById("fb-email").value.trim();
      const msg = document.getElementById("fb-msg").value.trim();
      const status = document.getElementById("fb-status");
      if (!msg) {
        status.textContent = t("fb.needMsg");
        status.classList.add("err");
        return;
      }
      status.classList.remove("err");
      const subject = `AbilityFinder feedback — ${type}`;
      const body =
        `Type: ${type}\n` +
        (email ? `Reply-to: ${email}\n` : "") +
        `\n${msg}\n`;
      const mailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      status.innerHTML = `${t("fb.thanks")}<b>${FEEDBACK_EMAIL}</b>.`;
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

    ${block("What we collect", `<p>Nothing. AbilityFinder has no accounts, no sign-up, and no server that stores your data. Everything you answer lives only in <b>your own browser</b> (in its local storage) so the site can remember your progress. We can't see it, and it never leaves your device.</p>`)}
    ${block("No tracking, no cookies, no ads", `<p>There are no analytics trackers, no advertising, and no third-party scripts watching what you do. We don't set tracking cookies.</p>`)}
    ${block("Fonts and files", `<p>All fonts and code are served from this site itself — we don't call Google Fonts or any external CDN, so no third party is told that you visited.</p>`)}
    ${block("Location", `<p>The “Use my location” button only asks your browser for your location when <b>you tap it</b>, and only to build a Google Maps search link for nearby practitioners. Your location is never sent to us or saved.</p>`)}
    ${block("Links to other sites", `<p>Every “Apply” and official link opens the relevant government website in a new tab. Once you're on those sites, their own privacy policies apply — not ours.</p>`)}
    ${block("Clearing your data", `<p>Click the <b>AbilityFinder</b> logo (or “Start over”) to wipe your answers, or clear your browser's site data at any time. That's all it takes.</p>`)}

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
    const optionsHtml = step.options
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
    const twoCol = step.options.length === 2 ? "two" : "";
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

function wireStep(step) {
  if (step.type === "select") {
    const sel = document.getElementById("selInput");
    if (sel)
      sel.addEventListener("change", () => {
        answers[step.key] = sel.value;
        persist();
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
      if (step.type === "multi") {
        toggleMulti(step, value);
        persist();
        render(); // reflect selection, stay on step
      } else {
        answers[step.key] = value;
        if (step.onPick) step.onPick(value);
        persist();
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
  <div class="results-tools">
    <button class="tool-btn" id="printList">${icon("print")}${t("res.print")}</button>
    <div class="group-toggle" role="group" aria-label="Group benefits by">
      <button class="gt-btn ${groupMode === "priority" ? "on" : ""}" data-group="priority">${icon("list")}Priority order</button>
      <button class="gt-btn ${groupMode === "category" ? "on" : ""}" data-group="category">${icon("grid")}By category</button>
    </div>
  </div>
  ${trackerSummary(matched)}
  ${renderAnswerChips()}`;

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
  const sections = SUPPORT_CATEGORIES.map((c) => {
    const items = matched.filter((s) => s.cat === c.cat);
    if (!items.length) return "";
    return `
    <details class="support-section">
      <summary>
        <span class="ss-ic">${icon(c.icon)}</span>
        <span class="ss-name">${c.cat}</span>
        <span class="count">${items.length}</span>
        <span class="ss-chev">${icon("arrowRight")}</span>
      </summary>
      <div class="support-list">${items.map(renderSupportCard).join("")}</div>
    </details>`;
  }).join("");
  return `
  <div class="supports-area">
    <h2 class="supports-heading">${t("supports.heading")}</h2>
    <p class="supports-sub">${t("supports.sub")}</p>
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
function trackerSummary(matched) {
  const counts = {};
  matched.forEach((e) => { const s = progress[e.b.id]; if (s && STAGE[s]) counts[s] = (counts[s] || 0) + 1; });
  const active = STAGES.filter((s) => counts[s.key]);
  if (!active.length) return "";
  const pills = active
    .map((s) => `<span class="ts-pill ${s.cls}">${icon(s.ic)}<b>${counts[s.key]}</b> ${s.short}</span>`)
    .join("");
  return `<div class="tracker-summary" aria-label="Your application progress">
    <span class="ts-lbl">${icon("compass")} Your progress</span>${pills}</div>`;
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
          <h3>${b.name}</h3>
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
          <button class="apply js-detail" data-id="${b.id}">
            ${r.status === "ready" ? t("apply.how") : t("apply.unlock")} ${icon("arrowRight")}
          </button>
          ${statusControl(b)}
        </div>
      </div>
    </div>
  </div>`;
}

/* editable summary of the user's answers */
function valueLabel(step, val) {
  const o = (step.options || []).find((x) => x.value === val);
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
  "cpp-disability": "the CPP-Disability medical report",
  aish: "the AISH medical report (Part B)",
  "parking-placard": "the accessible parking placard form",
};

/* "Find a/an <type>" with the correct article */
const findLabel = (type) => `Find a${/^[aeiou]/i.test(type) ? "n" : ""} ${type}`;

/* personalized "find a practitioner near you" block (Phase 3: form-aware) */
function practitionerFinder(b) {
  const type = practitionerType();
  const formName = (b && PRACTITIONER_FORMS[b.id]) || "your disability form";
  const formFlag = `
    <div class="finder-flag">${icon("check")}
      <span>You'll need a practitioner willing to complete <b>${formName}</b>. Not every clinic does these — it's worth calling ahead to ask.</span>
    </div>`;
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
      <input class="text-input finder-postal" id="finderPostal" inputmode="text" placeholder="${t("finder.postalPh")}" value="${answers.postal || ""}" />
      <button class="btn btn-ghost" id="finderLoc" type="button">${icon("compass")} ${t("finder.useLoc")}</button>
    </div>
    <div class="finder-btns">
      <a class="apply finder-search" data-ptype="${type}" href="${mapsSearchUrl(type)}" target="_blank" rel="noopener noreferrer" data-ext>${findLabel(type)} ${icon("external")}</a>
      ${type !== "family doctor" ? `<a class="apply secondary finder-search" data-ptype="family doctor" href="${mapsSearchUrl("family doctor")}" target="_blank" rel="noopener noreferrer" data-ext>${findLabel("family doctor")} ${icon("external")}</a>` : ""}
    </div>
    ${askTips}
    <p class="finder-note" id="finderNote">${t("finder.note")}</p>
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
  document.querySelectorAll("[data-edit]").forEach((btn) =>
    btn.addEventListener("click", () => {
      editingReturn = true;
      setState("wizard", { stepIndex: parseInt(btn.dataset.edit, 10) });
    })
  );
  document.querySelectorAll(".js-detail").forEach((btn) =>
    btn.addEventListener("click", () => {
      detailFrom = "results";
      setState("detail", { detailId: btn.dataset.id });
    })
  );
  // per-benefit progress tracker
  document.querySelectorAll("[data-track]").forEach((sel) =>
    sel.addEventListener("change", () => {
      const id = sel.dataset.track;
      if (sel.value && STAGE[sel.value]) progress[id] = sel.value;
      else delete progress[id];
      persist();
      render(); // same page → scroll position preserved
    })
  );

  // group-by toggle (priority ↔ category dashboard)
  document.querySelectorAll("[data-group]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const mode = btn.dataset.group === "category" ? "category" : "priority";
      if (mode === groupMode) return;
      groupMode = mode;
      persist();
      render();
    })
  );

  const print = document.getElementById("printList");
  if (print) print.addEventListener("click", printResults);

  // retroactive DTC back-pay estimator (~$2,000/yr of DTC value, up to 10 years)
  const retroSel = document.getElementById("retroYears");
  const retroOut = document.getElementById("retroOut");
  if (retroSel && retroOut) {
    const upd = () => {
      const y = Math.min(parseInt(retroSel.value, 10) || 0, 10);
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
    .filter((v) => v && ["cash", "grant", "taxCredit"].includes(v.kind) && v.annualMax)
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
function browseFiltered() {
  const q = browseQuery.trim().toLowerCase();
  return BENEFITS.filter((b) => {
    if (browseTheme !== "all" && benefitTheme(b) !== browseTheme) return false;
    if (browseLevel !== "all") {
      if (browseLevel === "local" ? !benefitIsLocal(b) : b.level !== browseLevel) return false;
    }
    if (q && !benefitSearchText(b).includes(q)) return false;
    return true;
  }).sort((a, b) => priorityScore(b) - priorityScore(a));
}
/* a status-agnostic card for browsing (no eligibility judgement) */
function browseCard(b) {
  const v = valueParts(b);
  const valueHtml = `<span class="amount">${v.est ? `<span class="amount-tag">Est. value</span>` : ""}${v.head}</span>${v.sub ? `<span class="amount-sub">${v.sub}</span>` : ""}`;
  return `
  <div class="benefit browse-card ${b.masterKey ? "master" : ""}">
    <div class="benefit-row">
      <div class="benefit-main">
        <div class="top">
          <h3>${b.name}</h3>
          <span class="tag lvl">${b.level}</span>
          <span class="tag">${b.category}</span>
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
    </div>
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
  if (input) input.addEventListener("input", () => { browseQuery = input.value; refreshBrowse(); });

  document.querySelectorAll("[data-btheme]").forEach((c) =>
    c.addEventListener("click", () => { browseTheme = c.dataset.btheme; refreshBrowse(); }));
  document.querySelectorAll("[data-blevel]").forEach((c) =>
    c.addEventListener("click", () => { browseLevel = c.dataset.blevel; refreshBrowse(); }));

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

/* Phase-2 detail sections: tax warning, denial reasons, appeals, FAQs, related */
function p2Sections(b) {
  const x = BENEFIT_EXTRA[b.id];
  if (!x) return { tax: "", denials: "", appeal: "", faqs: "", related: "" };
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
      .map((rid) => { const rb = BENEFITS.find((z) => z.id === rid); return rb ? `<button class="related-chip" data-id="${rid}">${rb.name} ${icon("arrowRight")}</button>` : ""; })
      .join("");
    if (chips) related = `<div class="guide-block"><div class="guide-h">${icon("key")} Works well with</div><div class="related-chips">${chips}</div></div>`;
  }
  return { tax, denials, appeal, faqs, related };
}

function renderDetail(id) {
  const b = BENEFITS.find((x) => x.id === id);
  const backBtn = (idn) => `<button class="back-link${idn === "d-back2" ? " bottom" : ""}" id="${idn}">${icon("arrowLeft")} ${t("det.back")}</button>`;
  if (!b) return `<div class="card">Not found. ${backBtn("d-back")}</div>`;
  const r = evaluate(b);
  const d = b.detail || {};

  const x = BENEFIT_EXTRA[b.id] || {};
  let statusBanner = "";
  if (!wizardDone()) {
    statusBanner = `
      <div class="status-banner maybe">${icon("compass")}<div><b>Want to know if you qualify?</b>
        Answer a few quick questions and we'll tell you — and tailor this guide to you.
        <button class="linklike" id="d-check">Check my eligibility ${icon("arrowRight")}</button></div>
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
  <div class="detail">
    ${backBtn("d-back")}

    <header class="detail-hero">
      <div class="detail-tags">
        <span class="tag lvl">${b.level}</span>
        <span class="tag">${b.category}</span>
      </div>
      <h1 class="detail-title">${b.name}</h1>
      <p class="detail-lede">${b.summary}</p>
    </header>

    <div class="detail-body">
      <div class="detail-main">
        ${statusBanner}
        ${enNote}

        ${d.about && d.about !== b.summary ? `<p class="detail-about">${d.about}</p>` : ""}
        ${b.note ? `<div class="note">${b.note}</div>` : ""}
        ${p2.tax}

        ${listBlock(t("guide.how"), "compass", d.steps, true)}
        ${b.needsPractitioner ? practitionerFinder(b) : ""}
        ${listBlock(t("guide.need"), "check", d.documents, false)}
        ${listBlock(t("guide.tips"), "info", d.tips, false)}
        ${p2.denials}
        ${p2.appeal}
        ${p2.faqs}
        ${p2.related}
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
          <p class="side-foot"><span class="verified">${icon("check")} Info verified ${DATA_VERIFIED}</span></p>
        </div>
      </aside>
    </div>

    ${backBtn("d-back2")}
  </div>`;
}

function wireDetail() {
  // Always return to results predictably (works whether the guide was opened
  // in-session or reloaded directly). The browser's own Back button is handled
  // separately by the popstate listener.
  ["d-back", "d-back2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => setState(detailFrom === "browse" ? "browse" : "results"));
  });

  // "check my eligibility" CTA (shown when the wizard isn't done yet)
  const check = document.getElementById("d-check");
  if (check) check.addEventListener("click", () => setState("wizard", { stepIndex: 0 }));

  // related-benefit chips → open that benefit's guide
  document.querySelectorAll(".related-chip[data-id]").forEach((btn) =>
    btn.addEventListener("click", () => setState("detail", { detailId: btn.dataset.id }))
  );

  // practitioner finder: keep the map-search links in sync with postal / location
  const updateFinderLinks = (coords) => {
    document.querySelectorAll(".finder-search").forEach((a) => {
      a.href = mapsSearchUrl(a.dataset.ptype, coords);
    });
  };
  const postal = document.getElementById("finderPostal");
  if (postal)
    postal.addEventListener("input", () => {
      answers.postal = postal.value.trim() || null;
      persist();
      updateFinderLinks(null);
    });
  const loc = document.getElementById("finderLoc");
  const note = document.getElementById("finderNote");
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
/* ── Assistant (Phase 4) ──────────────────────────────────────────────────────
   Talks to POST /api/ask on our own origin (hence CSP connect-src 'self' needs
   no change). Backed by Workers AI on the free allocation, so it can run out;
   that is a normal state, not an error, and is worded as such.

   Opt-in on purpose: this is the ONLY part of the app that sends anything off
   the device, and the privacy page promises otherwise. Consent is remembered. */
const ASK_KEY = "abilityfinder.askConsent";
let askHistory = [];
let askBusy = false;

function askConsented() {
  try { return localStorage.getItem(ASK_KEY) === "1"; } catch (e) { return false; }
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

        if (ev === "delta" && data.text) {
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
    try { localStorage.setItem(ASK_KEY, "1"); } catch (e) {}
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

document.addEventListener("DOMContentLoaded", () => {
  restore();
  restoreA11y();
  restoreLang();
  applyA11y();
  applyStaticI18n();
  wireAccessibility();
  wireAssistant();
  history.replaceState({ view, stepIndex, detailId }, "");
  render();

  // language switcher
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.addEventListener("click", toggleLang);

  // light / dark theme toggle (initial theme is set by the inline <head> script)
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn)
    themeBtn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = cur === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("abilityfinder.theme", next); } catch (e) {}
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
