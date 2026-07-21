/* =============================================================================
   ABILITYFINDER DATA — Alberta (all disabilities) + federal + municipal
   - DISABILITIES: the categories a user can pick.
   - BENEFITS: declarative. Eligibility LOGIC lives in app.js (see REQS).
   Each benefit has a `detail` object: plain-language guidance shown ON our site
   so users aren't lost on the confusing government pages.
   Facts/amounts current as of 2025–2026 from official sources (`source`).
   ========================================================================== */

/* ------------------------------------------------------ disability options */
/* The `sub` lines are for RECOGNITION, not diagnosis. People scan this list
 * looking for their own condition, and if they don't see it they assume the
 * tool isn't for them and leave — so half-lists ending in "…" were costing us
 * users who qualify. They are examples, never exhaustive; "Something else /
 * not listed" is always there, and nothing here affects eligibility (the
 * government decides that). Keep each line scannable: this audience includes
 * people with brain fog and cognitive disabilities, so completeness has to be
 * balanced against wall-of-text.
 *
 * NOTE: these buckets drive PRACTITIONERS (which specialist we suggest) and the
 * *_NEED groups below. If you move a condition between buckets, check both. */
const DISABILITIES = [
  { value: "adhd", icon: "adhd", label: "ADHD / attention", sub: "ADHD, ADD, inattentive or hyperactive type" },
  { value: "autism", icon: "autism", label: "Autism spectrum", sub: "autism, ASD, Asperger's, PDD-NOS" },
  { value: "learning", icon: "learning", label: "Learning disability", sub: "dyslexia, dyscalculia, dysgraphia, auditory or visual processing, non-verbal learning disability" },
  { value: "intellectual", icon: "intellectual", label: "Intellectual / developmental", sub: "Down syndrome, fragile X, fetal alcohol spectrum (FASD), global developmental delay" },
  { value: "mental", icon: "mental", label: "Mental health", sub: "anxiety, depression, PTSD, bipolar, OCD, schizophrenia, eating disorders, addiction" },
  { value: "physical", icon: "physical", label: "Physical / mobility", sub: "MS, cerebral palsy, spinal cord injury, muscular dystrophy, arthritis, amputation or limb difference, dwarfism, chronic back or joint pain" },
  { value: "chronic", icon: "chronic", label: "Chronic illness / pain", sub: "diabetes, Crohn's or colitis, fibromyalgia, ME/CFS, long COVID, cancer, epilepsy, lupus, heart, lung or kidney disease" },
  { value: "vision", icon: "vision", label: "Vision loss / blindness", sub: "blind, low vision, macular degeneration, glaucoma, retinitis pigmentosa" },
  { value: "hearing", icon: "hearing", label: "Hearing loss / Deaf", sub: "Deaf, hard of hearing, hearing loss, severe tinnitus" },
  { value: "speech", icon: "speech", label: "Speech / communication", sub: "stutter, apraxia, aphasia, non-speaking, uses AAC or a communication device" },
  { value: "braininjury", icon: "braininjury", label: "Brain injury", sub: "stroke, concussion, traumatic brain injury (TBI), aneurysm, brain tumour" },
  { value: "other", icon: "other", label: "Something else / not listed", sub: "pick this if nothing above fits — you can still qualify" },
];

/* Disability groups used by benefit targeting */
const EQUIP_NEED = ["physical", "chronic", "vision", "hearing", "speech", "braininjury"];

/* Municipalities with their own verified program in BENEFITS. Everywhere else
 * falls through to the generic 2-1-1 "local supports" finder (REQS.cityOther).
 * Keep this in step with the city-gated benefits below. */
const CITIES_WITH_PROGRAMS = [
  "Calgary", "Edmonton", "Red Deer", "Lethbridge",
  "Medicine Hat", "Grande Prairie", "St. Albert", "Sherwood Park",
  "Airdrie", "Fort McMurray", "Spruce Grove", "Stony Plain", "Leduc",
  "Cochrane", "Okotoks", "Canmore", "Lloydminster", "Fort Saskatchewan",
];

/* ---------------------------------------------- Alberta communities (pop >5,000)
   Includes cities, larger towns, and the two big urban service areas
   (Sherwood Park, Fort McMurray). Calgary & Edmonton have their own programs;
   everywhere else is routed to the "local supports" finder below. */
const ALBERTA_CITIES = [
  "Airdrie", "Banff", "Beaumont", "Blackfalds", "Bonnyville", "Brooks",
  "Calgary", "Camrose", "Canmore", "Chestermere", "Coaldale", "Cochrane",
  "Cold Lake", "Devon", "Didsbury", "Drayton Valley", "Edmonton", "Edson",
  "Fort McMurray", "Fort Saskatchewan", "Grande Prairie", "High River",
  "Hinton", "Innisfail", "Lacombe", "Leduc", "Lethbridge", "Lloydminster",
  "Medicine Hat", "Morinville", "Okotoks", "Olds", "Peace River", "Ponoka",
  "Red Deer", "Redcliff", "Rocky Mountain House", "Sherwood Park", "Slave Lake",
  "Spruce Grove", "St. Albert", "Stettler", "Stony Plain", "Strathmore",
  "Sylvan Lake", "Taber", "Vegreville", "Wainwright", "Wetaskiwin", "Whitecourt",
  "Other / my town isn't listed",
];

/* ------------------------------------------- British Columbia communities */
const BC_CITIES = [
  "Abbotsford", "Burnaby", "Campbell River", "Chilliwack", "Colwood", "Comox",
  "Coquitlam", "Courtenay", "Cranbrook", "Dawson Creek", "Delta", "Duncan",
  "Fort St. John", "Kamloops", "Kelowna", "Langford", "Langley", "Maple Ridge",
  "Mission", "Nanaimo", "Nelson", "New Westminster", "North Vancouver",
  "Parksville", "Penticton", "Pitt Meadows", "Port Coquitlam", "Port Moody",
  "Powell River", "Prince George", "Prince Rupert", "Quesnel", "Richmond",
  "Saanich", "Salmon Arm", "Squamish", "Surrey", "Terrace", "Vancouver",
  "Vernon", "Victoria", "West Vancouver", "White Rock", "Williams Lake",
  "Other / my town isn't listed",
];

/* Province scaffolding can land before its catalog. Visibility is gated in app.js. */
const CITIES_BY_PROVINCE = { AB: ALBERTA_CITIES, BC: BC_CITIES };
const COVERED_PROVINCES = ["AB", "BC"];

/* national fallbacks (used when a jurisdiction isn't in the maps yet) */
const FED_STUDENT_AID = "https://www.canada.ca/en/employment-social-development/services/education/grants/disabilities.html";
const NATIONAL_211 = "https://211.ca/";

const STUDENT_AID = { AB: "https://studentaid.alberta.ca/" };
const TWO_ELEVEN = { AB: "https://ab.211.ca/" };
const EMPLOYMENT = { AB: "https://www.alberta.ca/disability-related-employment-supports" };

/* =============================================================================
   STRUCTURED VALUE MODEL — approximate dollar value per benefit, so we
   can answer "how much money could I get?" instead of a dense description.
   kind: cash | taxCredit | grant | services | coverage | access | discount
   Amounts are 2025–2026 figures, rounded. Verified July 2026 (see each benefit's
   official source). These are ESTIMATES — actual amounts depend on the person.
   ========================================================================== */
const BENEFIT_VALUES = {
  // ---- federal ----
  dtc: { kind: "taxCredit", annualMin: 1500, annualMax: 2700, retroMax: 25000,
    note: "in income tax you (or a supporting family member) save" },
  "cdb-adult": { kind: "cash", annualMax: 2400, monthlyMax: 200 },
  "child-disability-benefit": { kind: "cash", annualMax: 3480, monthlyMax: 290 },
  rdsp: { kind: "grant", annualMax: 4500, lifetimeMax: 90000,
    note: "in free government grants & bonds" },
  "cwb-disability": { kind: "cash", annualMax: 843, note: "refundable top-up on your tax return" },
  "cpp-disability": { kind: "cash", monthlyMin: 611, monthlyMax: 1741, annualMax: 20894 },
  "csg-disability": { kind: "grant", annualMax: 2800 },
  "csg-dse": { kind: "grant", annualMax: 20000 },
  // ---- Alberta ----
  // AISH and ADAP are assessed through one application. Keep both out of the
  // combined estimate: adding them together would falsely promise two incomes.
  aish: { kind: "cash", excludeFromEstimate: true,
    note: "monthly living allowance plus health and personal benefits" },
  adap: { kind: "cash", excludeFromEstimate: true,
    note: "monthly financial benefit plus health, personal and employment benefits" },
  aadl: { kind: "coverage", note: "covers ~75% of approved equipment & supplies" },
  pdd: { kind: "services", note: "funded daily-living, community & employment services" },
  fscd: { kind: "services", note: "respite, services & help with some disability costs" },
  dres: { kind: "services", note: "funds assistive tech, training & workplace supports" },
  "ab-grant-disability": { kind: "grant", annualMax: 3000 },
  "adult-health-benefit": { kind: "coverage", note: "free prescriptions, dental & optical — often $1,000+/yr" },
  "child-health-benefit": { kind: "coverage", note: "free prescriptions, dental & optical for kids" },
  "parking-placard": { kind: "access", note: "low-cost accessible parking permit" },
  "calgary-fair-entry": { kind: "discount", note: "transit from $5.90/mo + 75% off rec — often $600+/yr saved" },
  "edmonton-fare-assistance": { kind: "discount", note: "$36/mo transit pass + low-cost recreation" },
  // Municipal programs researched 2026-07-15 — figures from each city's own page.
  "reddeer-fee-assistance": { kind: "discount", note: "$34/mo transit pass + up to $200/yr recreation" },
  "lethbridge-fee-assistance": { kind: "discount", note: "3 months of bus passes for the price of 1 + $150/season" },
  "medicinehat-fair-entry": { kind: "discount", note: "75% off transit (max $630/yr) + $200/yr recreation" },
  "grandeprairie-aish-pass": { kind: "discount", note: "$10.25/mo transit pass (vs $74.25) + 75% off recreation" },
  "stalbert-subsidy": { kind: "discount", note: "Free local transit + free annual rec membership" },
  "strathcona-subsidy": { kind: "discount", note: "Reduced transit fare cap + free annual Active Pass+" },
  "airdrie-fair-access": { kind: "discount", note: "25–75% off transit + Genesis Place recreation" },
  "woodbuffalo-lift": { kind: "discount", note: "$10/mo transit pass + 75% off SMART Bus + 60% off recreation" },
  "sprucegrove-low-income-transit": { kind: "discount", note: "$25/mo local or $50/mo commuter transit pass" },
  "leduc-subsidies": { kind: "discount", note: "half-price local, commuter and LATS transit + a free rec membership" },
  "cochrane-connect-card": { kind: "discount", note: "25% off local transit + 50% off SLS Centre monthly passes" },
  "okotoks-fee-assistance": { kind: "discount", note: "80% off most Town programs, passes and admission" },
  "canmore-affordable-services": { kind: "discount", note: "discounts on local transit, recreation and community services" },
  "lloydminster-recreation-access": { kind: "discount", note: "$2 adult drop-in admission at City recreation facilities" },
  "fortsask-access": { kind: "discount", note: "free multi-facility membership and reduced local or commuter transit fares" },
  "local-supports": { kind: "discount", note: "varies by community" },
};

/* difficulty (1 easy … 5 hard), effort to apply, and typical wait to hear back */
/* Who is allowed to sign a benefit's form.
 *
 * ONLY add an entry you have actually verified on the official page. This drives
 * real "find one near you" buttons, so a wrong entry sends a disabled person to
 * book (and often pay for) an appointment with someone who cannot sign their
 * form. An absent entry costs nothing — the finder just falls back to the
 * practitioner matched to their disability.
 *
 * dtc: transcribed verbatim from this benefit's own `note` in this file
 *   ("Your doctor, nurse practitioner, psychologist, optometrist or audiologist
 *   documents this on Form T2201"), which was verified July 2026.
 * AISH/ADAP remains deliberately absent: Alberta's public guidance says the
 * report must be completed by a medical professional registered in Alberta, but
 * does not publish an exhaustive profession list.
 */
const BENEFIT_SIGNERS = {
  dtc: ["family doctor", "nurse practitioner", "psychologist", "optometrist", "audiologist"],
  "cpp-disability": ["family doctor", "nurse practitioner"],
  "parking-placard": ["family doctor", "occupational therapist", "physiotherapist", "surgeon", "podiatrist", "nurse practitioner", "chiropractor"],
};

const BENEFIT_META = {
  dtc: { difficulty: 3, effort: "30–60 min + a doctor visit", wait: "8–20 weeks" },
  "cdb-adult": { difficulty: 2, effort: "15–30 min (after DTC)", wait: "monthly once approved" },
  "child-disability-benefit": { difficulty: 1, effort: "Automatic after DTC + CCB", wait: "next CCB payment" },
  rdsp: { difficulty: 2, effort: "~1 hr at a bank/credit union", wait: "same day to open" },
  "cwb-disability": { difficulty: 1, effort: "Claimed on your tax return", wait: "at tax time" },
  "cpp-disability": { difficulty: 5, effort: "2–4 hrs + a doctor's report", wait: "~4 months" },
  "csg-disability": { difficulty: 2, effort: "With your student aid application", wait: "with student aid" },
  "csg-dse": { difficulty: 2, effort: "Student aid + quotes for equipment", wait: "with student aid" },
  aish: { difficulty: 4, effort: "Application + medical report", wait: "Check with Alberta Supports" },
  adap: { difficulty: 4, effort: "Application + medical report", wait: "Check with Alberta Supports" },
  aadl: { difficulty: 3, effort: "Assessment with an OT / authorizer", wait: "varies" },
  pdd: { difficulty: 3, effort: "Assessment-based", wait: "varies" },
  fscd: { difficulty: 2, effort: "Meet with an FSCD worker", wait: "varies" },
  dres: { difficulty: 2, effort: "Meet at an Alberta Supports Centre", wait: "varies" },
  "ab-grant-disability": { difficulty: 2, effort: "Student aid + Schedule 4 (once)", wait: "with student aid" },
  "adult-health-benefit": { difficulty: 2, effort: "Form + proof of income", wait: "a few weeks" },
  "child-health-benefit": { difficulty: 2, effort: "Form + proof of income", wait: "a few weeks" },
  "parking-placard": { difficulty: 1, effort: "Short form + a registry visit", wait: "often same day" },
  "calgary-fair-entry": { difficulty: 1, effort: "Online + proof of income", wait: "1–2 weeks" },
  "edmonton-fare-assistance": { difficulty: 1, effort: "Application + proof of income", wait: "1–2 weeks" },
  "reddeer-fee-assistance": { difficulty: 1, effort: "Online form + proof", wait: "up to 10 business days" },
  "lethbridge-fee-assistance": { difficulty: 1, effort: "Online form or call 311", wait: "apply any time" },
  "medicinehat-fair-entry": { difficulty: 1, effort: "One form, lasts 2 years", wait: "about 2 weeks" },
  "grandeprairie-aish-pass": { difficulty: 1, effort: "Ask at City Hall", wait: "same day in person" },
  "stalbert-subsidy": { difficulty: 1, effort: "One FCSS form", wait: "1–2 weeks" },
  "strathcona-subsidy": { difficulty: 2, effort: "Call or visit FCSS", wait: "ask when you apply" },
  "airdrie-fair-access": { difficulty: 1, effort: "One online form", wait: "ask when you apply" },
  "woodbuffalo-lift": { difficulty: 1, effort: "Online form + proof of income", wait: "7–10 business days" },
  "sprucegrove-low-income-transit": { difficulty: 1, effort: "Application + proof of income", wait: "Apply year-round" },
  "leduc-subsidies": { difficulty: 1, effort: "Contact FCSS for an assessment", wait: "Ask when you apply" },
  "cochrane-connect-card": { difficulty: 2, effort: "Appointment + income documents", wait: "Ask when you apply" },
  "okotoks-fee-assistance": { difficulty: 1, effort: "Application + proof of income", wait: "Ask when you apply" },
  "canmore-affordable-services": { difficulty: 1, effort: "Application + proof of income", wait: "Ask when you apply" },
  "lloydminster-recreation-access": { difficulty: 1, effort: "Application + proof of income", wait: "Ask when you apply" },
  "fortsask-access": { difficulty: 1, effort: "Application + proof of income", wait: "Ask when you apply" },
  "local-supports": { difficulty: 1, effort: "Call 2-1-1", wait: "immediate" },
};

/* =============================================================================
   ELIGIBILITY DEPTH & TRUST. Per-benefit:
   confirm  → what actually confirms eligibility (turns "eligible" into an honest
              "likely eligible — depends on…")
   taxNote  → tax / interaction warnings (does it count as income? affect AISH?)
   denials  → common reasons applications get rejected
   appeal   → what to do if you're denied
   faqs     → real questions people ask
   related  → other benefits that stack with / are unlocked by this one (ids)
   ========================================================================== */
const BENEFIT_EXTRA = {
  dtc: {
    /* What "severe and prolonged" actually means, in practice.
     *
     * This is the single phrase the whole DTC turns on, and it is the reason
     * people self-reject: they read "severe" as "my diagnosis must be dramatic"
     * and never apply. It doesn't mean that.
     *
     * Every claim here is transcribed from CRA's own eligibility pages
     * (verified 2026-07-15) — see `source` links on this benefit:
     *  - markedly restricted = unable OR takes an inordinate amount of time,
     *    EVEN WITH therapy, devices and medication
     *  - all or substantially all of the time = CRA reads this as 90%+
     *  - prolonged = has lasted, or is expected to last, 12+ continuous months
     *  - cumulative effect = limitations in 2+ categories that together are as
     *    severe as one marked restriction (CRA's own example: always slow to
     *    both walk and dress)
     * Do not add a criterion here that isn't on a CRA page. */
    plainTest: {
      lead:
        "Everything about the DTC hangs on four words: <b>severe and prolonged</b>. They don't mean what most people assume, and that misunderstanding is why people who qualify never apply.",
      points: [
        {
          h: "“Severe” is not about your diagnosis",
          p: "The CRA never asks how serious your condition sounds. It asks how much it limits you day to day. Two people with the identical diagnosis can get opposite answers — and someone with a condition you've never heard of can qualify easily. Never rule yourself out because your diagnosis doesn't sound bad enough.",
        },
        {
          h: "You're judged <i>with</i> your treatment, not without it",
          p: "The test is whether you're still limited <b>even with</b> appropriate therapy, medication and devices. So the honest answer to “but I manage okay with my meds” is: that's exactly the question. If you're still restricted while doing everything right, that counts.",
        },
        {
          h: "You don't have to be unable — just slow",
          p: "“Markedly restricted” means unable to do something <b>or</b> taking an <b>inordinate amount of time</b> to do it. CRA's own yardstick is roughly three times longer than someone without the impairment. Taking forever to dress, walk, or organise your day is the thing being measured, not failure to do it at all.",
        },
        {
          h: "“All or substantially all of the time” = about 90%",
          p: "This is where fluctuating conditions get lost. If you have good days, the question is not “are you always like this?” — it's whether the restriction is there roughly 90% of the time. Describe your typical day, not your best one, and say plainly how often the bad days come.",
        },
        {
          h: "Two smaller limits can add up to one big one",
          p: "This is the route most people miss. If you're significantly limited in <b>two or more</b> categories and the combined effect is as severe as one marked restriction, you can qualify on <b>cumulative effect</b>. CRA's own example: always slow to walk <i>and</i> always slow to dress. Ask your practitioner about it by name.",
        },
        {
          h: "“Prolonged” just means 12 months",
          p: "It has lasted, or is expected to last, a continuous 12 months. It does not mean permanent, and it does not mean forever — an impairment expected to last a year counts.",
        },
      ],
      foot:
        "The categories the CRA scores are: walking, dressing, feeding, speaking, hearing, seeing, eliminating (bladder or bowel), mental functions, and life-sustaining therapy. Only your practitioner can say where you land — your job is to make sure they're describing your limitations, not your label.",
    },
    confirm: "a medical practitioner confirming your condition markedly restricts a basic daily activity (or would, without therapy) all or substantially all of the time, for 12+ months",
    taxNote: "The DTC is non-refundable — it only reduces income tax you owe. If your income is low, you can transfer it to a supporting spouse or parent instead, and it still unlocks the RDSP and Canada Disability Benefit.",
    denials: [
      "The practitioner described the diagnosis instead of your day-to-day limitations.",
      "A section of Form T2201 was left incomplete.",
      "Limitations weren't shown to be present 'all or substantially all of the time' (about 90%+).",
      "Not enough detail on how much longer everyday tasks take you than others.",
    ],
    appeal: "Call the CRA to ask exactly why. You can send more medical detail, request a formal review, or file a Notice of Objection within 90 days. Many people are approved on a second try once the practitioner describes function (not just diagnosis).",
    faqs: [
      { q: "Do I need a family doctor?", a: "No — a nurse practitioner, psychologist, optometrist or audiologist can certify, depending on your condition." },
      { q: "Does a diagnosis alone qualify me?", a: "No. Approval is about how much your condition limits daily functions, not the diagnosis name." },
      { q: "Worth it if I don't pay much tax?", a: "Yes — transfer it to a supporting family member, and it unlocks the RDSP and Canada Disability Benefit." },
    ],
    related: ["rdsp", "cdb-adult", "child-disability-benefit", "cwb-disability"],
  },
  "cpp-disability": {
    confirm: "enough recent CPP contributions (usually 4 of the last 6 years) AND medical proof your disability is 'severe and prolonged' — it regularly stops you from any substantially gainful work",
    taxNote: "CPP-D is taxable income and can reduce income-tested benefits (AISH, GIS, provincial assistance). Private long-term disability (LTD) insurers usually subtract it from what they pay you.",
    denials: [
      "The disability wasn't shown to prevent ALL suitable work, not just your former job.",
      "Not enough CPP contributions in the qualifying period.",
      "The medical report was thin — describe your worst days, not your best.",
    ],
    appeal: "Request a reconsideration in writing within 90 days. If still denied, appeal to the Social Security Tribunal. Strong new medical evidence matters — many are approved at reconsideration.",
    faqs: [
      { q: "Can I get CPP-D and the DTC?", a: "Yes — they're separate, and CPP-D can even support a DTC application." },
      { q: "What happens at 65?", a: "It automatically converts to your CPP retirement pension." },
      { q: "Can I work at all?", a: "There's a small allowable-earnings amount and a return-to-work provision so you can try working without losing benefits immediately." },
    ],
    related: ["dtc", "aish"],
  },
  aish: {
    confirm: "a severe, permanent condition that substantially limits your ability to earn a living, AND income and assets under the AISH limits",
    taxNote: "AISH is not taxable. Other income and assets can affect assistance; Alberta's combined assessment decides the current treatment for your situation.",
    denials: [
      "The condition wasn't shown to be permanent, or was expected to improve with treatment.",
      "The medical didn't tie the disability to an inability to earn a living.",
      "Income or assets over the limit.",
      "The financial assessment did not meet the program rules.",
    ],
    appeal: "Read Alberta's current decision and appeal information before acting; rules and routes can change during the AISH/ADAP transition.",
    faqs: [
      { q: "Do I apply separately for ADAP?", a: "No. Alberta's current application assesses both AISH and ADAP and places eligible applicants in the program that fits." },
      { q: "Do I need the DTC first?", a: "No, AISH is separate — but the DTC, CPP-D and RDSP are all worth applying for too." },
      { q: "How much will I receive?", a: "It depends on Alberta's current rules and your household. Use the official AISH/ADAP benefit estimator rather than relying on a general figure." },
    ],
    related: ["adap", "dtc", "cpp-disability", "aadl", "adult-health-benefit"],
  },
  adap: {
    confirm: "a severe disability that significantly impedes employment continuously or episodically, plus Alberta's age, residency, status and financial rules",
    taxNote: "Alberta's combined assessment decides the current benefit and how household income or assets affect it.",
    faqs: [
      { q: "Do I have to choose AISH or ADAP?", a: "No. Alberta's one application assesses both programs and places eligible applicants in the program that fits." },
      { q: "Can a fluctuating condition count?", a: "ADAP's official eligibility describes barriers that significantly impede employment continuously or episodically. Alberta makes the decision from the full application and medical report." },
    ],
    related: ["aish", "dtc", "cpp-disability", "aadl", "adult-health-benefit"],
  },
  rdsp: {
    confirm: "being approved for the Disability Tax Credit (DTC) and being under age 60",
    taxNote: "A rare advantage: RDSP savings and withdrawals are generally exempt from AISH and most provincial benefits, so it won't cut your assistance. Grants, bonds and growth are taxed (only partly) when withdrawn.",
    faqs: [
      { q: "Do I have to put money in?", a: "No — the $1,000/year bond needs no contribution if your income is low. Even $0 in still grows." },
      { q: "Does it affect my AISH?", a: "Generally no — RDSP money is exempt from AISH and most provincial benefits." },
      { q: "When can I take money out?", a: "It's built for long-term saving — grants/bonds from the last 10 years may be repaid if you withdraw early." },
    ],
    related: ["dtc"],
  },
  "cdb-adult": {
    confirm: "DTC approval, age 18–64, a filed tax return, and income under the threshold",
    taxNote: "The Canada Disability Benefit isn't taxable and shouldn't reduce federal income-tested benefits — but check how Alberta treats it alongside AISH.",
    faqs: [
      { q: "Do I need the DTC?", a: "Yes — get the DTC first; it's required." },
      { q: "How much will I get?", a: "Up to $200/month, reduced as income rises above about $23,000 (single)." },
    ],
    related: ["dtc"],
  },
  "child-disability-benefit": {
    faqs: [{ q: "Do I apply separately?", a: "No — once your child has the DTC and you receive the Canada Child Benefit, it's added automatically." }],
    related: ["dtc", "fscd"],
  },
  "cwb-disability": {
    taxNote: "It's a refundable credit — you receive it even if you owe no tax. You need working income and the DTC on file with the CRA.",
    related: ["dtc"],
  },
  aadl: {
    taxNote: "You usually pay a 25% cost-share (capped each year) — waived entirely for low-income households and people on AISH.",
    related: ["aish", "adult-health-benefit"],
  },
  "adult-health-benefit": {
    taxNote: "If you leave AISH or Income Support because you started working, you may be able to keep this coverage — ask specifically.",
    related: ["aish", "aadl"],
  },
  "parking-placard": {
    faqs: [
      { q: "Do I need to own a car?", a: "No — the placard belongs to you and works in any vehicle you're travelling in." },
      { q: "Who can complete the medical section?", a: "Alberta lists a physician, occupational therapist, physiotherapist, surgeon, podiatrist, nurse practitioner or chiropractor. Check with the practitioner before booking." },
    ],
  },
  dres: { related: ["ab-grant-disability", "csg-dse"] },
};

/* =============================================================================
   SUPPORTS & STRATEGIES — practical, non-monetary help (accommodations, study /
   focus / memory / anxiety strategies, counselling, employment). Personalized by
   disability + situation; resource links are province-aware where relevant.
   Shown as their own group on the results page (not counted as "benefits").
   ========================================================================== */
const SUPPORTS = [
  {
    id: "accommodations", icon: "education", cat: "School & learning",
    dis: [], sit: ["student"],
    title: "Accommodations you can request at school",
    summary:
      "Post-secondary schools must accommodate a documented disability. Registering with your campus accessibility / disability-services office is the single most useful step — do it early.",
    tips: [
      "Extra time (often 1.5× or double) on exams and assignments.",
      "A distraction-free or private exam room.",
      "A reader or text-to-speech for questions, and speech-to-text (dictation) for writing-heavy exams.",
      "Copies of slides/notes ahead of time, or permission to record lectures.",
      "Permission to use a calculator, a reading pen (C-Pen), or audiobooks.",
      "Noise-cancelling headphones to cut distractions.",
    ],
    link: (a) => STUDENT_AID[a.province] || FED_STUDENT_AID,
    linkText: "Student aid & disability grants (can fund equipment)",
  },
  {
    id: "study-tools", icon: "learning", cat: "School & learning",
    dis: ["learning", "adhd", "vision"], sit: [],
    title: "Study strategies & assistive tech",
    summary: "Tools and habits that help when reading, writing, or focus are hard.",
    tips: [
      "Text-to-speech and audiobooks to take material in by ear.",
      "Speech-to-text (dictation) to get ideas down without the writing bottleneck.",
      "A reading pen (C-Pen) that scans and reads text aloud.",
      "Break complex instructions into small steps and ask for visual examples.",
      "Self-test with flashcards (Quizlet) instead of re-reading.",
    ],
    link: "https://www.khanacademy.org/",
    linkText: "Khan Academy — free lessons & practice",
  },
  {
    id: "exam-strategy", icon: "check", cat: "School & learning",
    dis: [], sit: ["student"],
    title: "Timed-exam strategy",
    summary: "A simple plan for using limited exam time well.",
    tips: [
      "Skim the whole exam first; do the easy questions before the hard ones.",
      "Give each question a time budget based on its marks, and keep moving.",
      "Read instructions slowly — out loud if you're allowed a private room.",
      "Practise past exams with these strategies so they're automatic on the day.",
    ],
    link: "https://www.khanacademy.org/",
    linkText: "Khan Academy — free lessons & test prep",
  },
  {
    id: "focus", icon: "adhd", cat: "Focus & attention",
    dis: ["adhd"], sit: [],
    title: "Focus & attention strategies",
    summary: "Small changes that make it easier to start, stay on task, and not get overwhelmed.",
    tips: [
      "Sit at the front, away from windows, doors, and high-traffic spots.",
      "Do the hardest thing first, in short focused blocks with movement breaks.",
      "Turn multi-step instructions into one small step at a time.",
      "Notice when you drift and gently redirect — awareness itself reduces it.",
      "Tie a boring task to something you care about to make starting easier.",
    ],
    link: "https://caddac.ca/",
    linkText: "CADDAC — Canada's ADHD resource centre",
  },
  {
    id: "memory", icon: "key", cat: "Memory",
    dis: ["adhd", "learning", "braininjury"], sit: [],
    title: "Memory strategies",
    summary: "Ways to hold on to information when short-term memory is a weak spot.",
    tips: [
      "Chunk information into small groups; use acronyms and mnemonics.",
      "Say it out loud, write it more than once, and rehearse it in your head.",
      "Pair facts with a picture or a feeling — meaning makes memory stick.",
      "Review a little and often (spaced repetition) rather than cramming.",
    ],
    link: "https://caddac.ca/find-a-resource/",
    linkText: "CADDAC — memory & executive-function resources",
  },
  {
    id: "calm", icon: "mental", cat: "Emotional wellbeing",
    dis: ["mental", "adhd"], sit: [],
    title: "Managing anxiety & overwhelm",
    summary: "Techniques to calm your nervous system and think clearly under pressure.",
    tips: [
      "Name what you're feeling — labelling an emotion takes some of its power away.",
      "Find a quiet spot, close your eyes, and repeat a calming phrase ('I am at peace').",
      "Slow, deep breathing settles the physical signs of anxiety.",
      "Cognitive Behavioural Therapy (CBT) works very well for test anxiety — a counsellor can teach it.",
      "Face feared situations gradually, from easiest to hardest, to build confidence.",
    ],
    link: (a) => TWO_ELEVEN[a.province] || NATIONAL_211,
    linkText: "Find local counselling (2-1-1)",
  },
  {
    id: "time", icon: "compass", cat: "Organization & time",
    dis: ["adhd", "learning", "mental", "intellectual"], sit: [],
    title: "Time management & organization",
    summary: "Structure that helps you plan, start early, and hit deadlines.",
    tips: [
      "Break big assignments into small pieces with their own mini-deadlines — and reward hitting them.",
      "Guess how long a task will take, then track the real time, to plan better next time.",
      "Use timers and reminders (Time Timer, WatchMinder, phone alarms).",
      "Keep a simple daily routine and review tomorrow's plan the night before.",
    ],
    link: "https://www.timetimer.com/",
    linkText: "Time Timer — visual countdown timers",
  },
  {
    id: "employment", icon: "working", cat: "Work",
    dis: [], sit: ["working", "looking"],
    title: "Employment support & workplace accommodations",
    summary: "Help to find work, and adjustments that let you do your best on the job.",
    tips: [
      "Ask about a job coach and your province's disability employment program.",
      "Reasonable accommodations: written instructions and checklists, extra time to learn tasks, a quieter space, and assistive technology.",
      "Break new tasks into small steps; ask for demonstrations plus notes you can keep.",
      "Employers can get funding to accommodate you — you don't always need to be on income assistance to qualify.",
    ],
    link: (a) => EMPLOYMENT[a.province] || TWO_ELEVEN[a.province] || NATIONAL_211,
    linkText: "Disability employment services in your province",
  },
  {
    id: "vision-tech", icon: "vision", cat: "Vision",
    dis: ["vision"], sit: [],
    title: "Vision assistive tech & services",
    summary: "Tools and services that help if you have low vision or are blind.",
    tips: [
      "Screen readers (VoiceOver, NVDA, JAWS) read your screen aloud.",
      "Built-in screen magnification, high-contrast, and large-text settings.",
      "Free accessible books and audio through the CELA library.",
      "Orientation & mobility training to help you travel safely and independently.",
      "CNIB offers tech training, programs, and peer support across Canada.",
    ],
    link: "https://www.cnib.ca/en",
    linkText: "CNIB — programs & technology for vision loss",
  },
  {
    id: "hearing-tech", icon: "hearing", cat: "Hearing",
    dis: ["hearing"], sit: [],
    title: "Hearing assistive tech & services",
    summary: "Tools and services if you're Deaf or hard of hearing.",
    tips: [
      "Funding for hearing aids and devices through your province's equipment program.",
      "Real-time captioning (CART) and captioned telephones.",
      "ASL / LSQ interpreters for appointments, school, and work.",
      "FM / loop systems, and video relay service (SRV Canada VRS) for phone calls.",
      "The Canadian Hard of Hearing Association has resources and local branches.",
    ],
    link: "https://www.chha.ca/",
    linkText: "Canadian Hard of Hearing Association",
  },
  {
    id: "mobility-supports", icon: "physical", cat: "Getting around",
    dis: ["physical"], sit: [],
    title: "Mobility, home & vehicle supports",
    summary: "Getting around and adapting your space with a physical or mobility disability.",
    tips: [
      "Funding for mobility equipment (wheelchairs, walkers) through your province's aids program.",
      "Accessible / paratransit 'door-to-door' transit — apply through your local transit agency.",
      "Home-modification help (ramps, bathroom adaptations) may be available.",
      "An accessible parking permit for closer, wider parking spaces.",
      "An occupational therapist can assess your home and recommend adaptations.",
    ],
    link: (a) => TWO_ELEVEN[a.province] || NATIONAL_211,
    linkText: "Find local mobility & home-support services (2-1-1)",
  },
  {
    id: "speech-aac", icon: "speech", cat: "Communication",
    dis: ["speech"], sit: [],
    title: "Communication supports (AAC)",
    summary: "Tools if speaking or being understood is difficult.",
    tips: [
      "Augmentative & alternative communication (AAC) apps and devices.",
      "A speech-language pathologist (SLP) can assess and set up the right tools.",
      "Text-to-speech and symbol-based communication boards.",
      "Ask about funding for communication devices through your province's aids program.",
    ],
    link: (a) => TWO_ELEVEN[a.province] || NATIONAL_211,
    linkText: "Find speech & communication services (2-1-1)",
  },
  {
    id: "energy-pacing", icon: "chronic", cat: "Energy & pacing",
    dis: ["chronic"], sit: [],
    title: "Managing energy & chronic symptoms",
    summary: "Getting things done while protecting your energy with a chronic illness or pain.",
    tips: [
      "Pace yourself — alternate activity with rest before you crash.",
      "Pick the few things that matter most each day and let the rest wait.",
      "Break tasks into short segments with breaks in between.",
      "Ask for flexible hours, remote options, or rest breaks at school/work.",
      "Track what triggers flare-ups so you can plan around them.",
    ],
    link: (a) => TWO_ELEVEN[a.province] || NATIONAL_211,
    linkText: "Find chronic-illness self-management help (2-1-1)",
  },
  {
    id: "autism-supports", icon: "autism", cat: "Autism",
    dis: ["autism"], sit: [],
    title: "Autism supports & strategies",
    summary: "Practical supports for autistic people and their families.",
    tips: [
      "Visual schedules and clear, literal instructions reduce uncertainty.",
      "Plan for sensory needs — noise-cancelling headphones, quiet spaces, sunglasses.",
      "Use 'first/then' plans and social scripts to ease transitions.",
      "Ask about your province's autism funding and services (they vary a lot).",
      "An occupational therapist can help with sensory and daily-living strategies.",
    ],
    link: "https://www.autismcanada.org/",
    linkText: "Autism Canada — resources & support",
  },
  {
    id: "intellectual-supports", icon: "intellectual", cat: "Community & inclusion",
    dis: ["intellectual"], sit: [],
    title: "Community living & inclusion supports",
    summary: "Help to live, work, and take part in your community.",
    tips: [
      "Local inclusion / community-living associations offer housing, day programs, and advocacy.",
      "Supported decision-making keeps you in control, with help when you want it.",
      "Ask about provincial developmental-disability services (like PDD in Alberta).",
      "Supported-employment programs can match you to inclusive jobs.",
    ],
    link: "https://www.inclusioncanada.ca/",
    linkText: "Inclusion Canada — find your local association",
  },
  {
    id: "braininjury-support", icon: "braininjury", cat: "Brain injury",
    dis: ["braininjury"], sit: [],
    title: "Brain injury recovery & cognitive strategies",
    summary: "Support and strategies for living with an acquired brain injury.",
    tips: [
      "Local brain injury associations offer programs, peer support, and navigation.",
      "Cognitive rehabilitation (with an OT or therapist) rebuilds skills step by step.",
      "Use external aids — calendars, alarms, notes — to take the load off memory.",
      "Manage fatigue with pacing and regular rest.",
      "Reduce noise and clutter to lower cognitive overload.",
    ],
    link: "https://braininjurycanada.ca/en/",
    linkText: "Brain Injury Canada — support & local associations",
  },
  {
    id: "mental-resources", icon: "mental", cat: "Emotional wellbeing",
    dis: ["mental"], sit: [],
    title: "Mental health resources & crisis support",
    summary: "Where to get help — from everyday support to a crisis.",
    tips: [
      "In crisis or thinking about suicide? Call or text 9-8-8 anytime — free, 24/7.",
      "Your family doctor can refer you to counselling or a psychiatrist.",
      "Many provinces offer free or low-cost therapy — ask 2-1-1 what's nearby.",
      "Peer-support groups connect you with people who understand.",
    ],
    link: "https://988.ca/",
    linkText: "9-8-8 Suicide Crisis Helpline (call or text)",
  },
];

/* order + icon for each supports section (only sections with matches are shown) */
const SUPPORT_CATEGORIES = [
  { cat: "School & learning", icon: "education" },
  { cat: "Work", icon: "working" },
  { cat: "Focus & attention", icon: "adhd" },
  { cat: "Memory", icon: "key" },
  { cat: "Organization & time", icon: "compass" },
  { cat: "Emotional wellbeing", icon: "mental" },
  { cat: "Autism", icon: "autism" },
  { cat: "Community & inclusion", icon: "intellectual" },
  { cat: "Brain injury", icon: "braininjury" },
  { cat: "Vision", icon: "vision" },
  { cat: "Hearing", icon: "hearing" },
  { cat: "Getting around", icon: "physical" },
  { cat: "Communication", icon: "speech" },
  { cat: "Energy & pacing", icon: "chronic" },
];

/* =============================================================================
   HUMAN-HELP DIRECTORY
   Real Alberta + national organizations that help people actually GET these
   benefits — filling out forms, appealing a denial, or finding local services.
   Free unless noted. Grouped by `cat` (see HELP_CATEGORIES). Links verified
   July 2026 — confirm hours/services on each site before relying on them.
   ========================================================================== */
const HELP_CATEGORIES = [
  { cat: "Help with the forms", icon: "check", blurb: "Free, patient help filling out the DTC, AISH, CPP-Disability and RDSP paperwork." },
  { cat: "If you're denied — legal help & appeals", icon: "scale", blurb: "Free or low-cost legal help to understand a decision and appeal it." },
  { cat: "Find local services near you", icon: "compass", blurb: "One call that connects you to food, housing, transport and support services in your community." },
];

const HELP_ORGS = [
  {
    id: "vad",
    cat: "Help with the forms",
    name: "Voice of Albertans with Disabilities (VAD)",
    summary:
      "An Edmonton-based advocacy society that helps you fill out the Disability Tax Credit, AISH, and CPP-Disability forms — and supports you if you have to appeal. Free.",
    phone: "780-488-9088",
    url: "https://vadsociety.ca",
    urlText: "vadsociety.ca",
    focus: ["dtc", "aish", "appeals"],
  },
  {
    id: "inclusion-ab",
    cat: "Help with the forms",
    name: "Inclusion Alberta",
    summary:
      "Family-focused help understanding the DTC, RDSP and other supports for people with developmental disabilities — including free RDSP guidance sessions.",
    phone: "1-800-252-7556",
    // Was /individuals-families/rdsp/ — that page is gone and now 301s to a
    // one-off event page, so anyone clicking "RDSP help" landed somewhere
    // useless. Caught by the link monitor, 2026-07-15. /dtc-rdsp-info/
    // is canonical (/dtc-rdsp/ is an alias that redirects to it), covers DTC +
    // RDSP, and lists the same 1-800-252-7556 as above.
    url: "https://inclusionalberta.org/dtc-rdsp-info/",
    urlText: "inclusionalberta.org",
    focus: ["dtc", "rdsp", "family"],
  },
  {
    id: "rdsp-helpline",
    cat: "Help with the forms",
    name: "Access RDSP Helpline (Plan Institute)",
    summary:
      "A free national helpline that walks you through opening a Registered Disability Savings Plan and claiming the grants and bonds you're owed.",
    phone: "1-844-311-7526",
    url: "https://www.rdsp.com",
    urlText: "rdsp.com",
    focus: ["rdsp"],
  },
  {
    id: "legal-aid-ab",
    cat: "If you're denied — legal help & appeals",
    name: "Legal Aid Alberta",
    summary:
      "Legal help for lower-income Albertans — including appeals of AISH and income-support decisions. Start with their toll-free intake line.",
    phone: "1-866-845-3425",
    url: "https://www.legalaid.ab.ca",
    urlText: "legalaid.ab.ca",
    focus: ["aish", "appeals"],
  },
  {
    id: "lawcentral-ab",
    cat: "If you're denied — legal help & appeals",
    name: "LawCentral Alberta",
    summary:
      "Plain-language legal information and a directory of free legal clinics and services across Alberta — a good first stop to understand your rights.",
    phone: null,
    url: "https://www.lawcentralalberta.ca",
    urlText: "lawcentralalberta.ca",
    focus: ["appeals"],
  },
  {
    id: "ab-211",
    cat: "Find local services near you",
    name: "Alberta 211",
    summary:
      "Dial 2-1-1 (or chat/text) any time, free, to be connected to local food, housing, transportation, disability and mental-health services near you.",
    phone: "211",
    url: "https://ab.211.ca",
    urlText: "ab.211.ca",
    focus: ["local"],
  },
];

const BENEFITS = [
  /* ---------------------------------------------------------------- FEDERAL */
  {
    id: "dtc",
    needsPractitioner: true,
    name: "Disability Tax Credit (DTC)",
    level: "Federal",
    category: "Money & taxes",
    masterKey: true,
    amount: "≈ $10,138 tax credit / year + up to 10 years back-pay",
    summary:
      "The master key. A tax credit that lowers the income tax you (or a family member) pay — and it unlocks most other disability benefits below.",
    requires: ["prolonged", "certifier"],
    note:
      "Approval is based on how much your condition limits your everyday functions — not on the diagnosis name. Your doctor, nurse practitioner, psychologist, optometrist or audiologist documents this on Form T2201. Many conditions qualify when the limitations are well described.",
    applyText: "Start the DTC application (T2201)",
    applyUrl:
      "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2201.html",
    source:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit.html",
    detail: {
      about:
        "A federal tax credit for people with a severe, long-lasting impairment in physical or mental functions. Getting approved is the single most important step, because it's what makes you eligible for the Canada Disability Benefit, RDSP, Child Disability Benefit and more.",
      steps: [
        "Sign in to (or create) CRA My Account — or use the paper form.",
        "Fill Part A (your personal information).",
        "Ask a medical practitioner who knows you to complete Part B, describing how your condition limits your daily life.",
        "Submit through CRA My Account for the fastest processing.",
        "If approved, ask the CRA to reassess up to 10 past years — this can mean a large back-payment.",
      ],
      documents: [
        "Your Social Insurance Number (SIN)",
        "A medical practitioner familiar with your condition",
        "Real examples of how it limits you (focus, memory, walking, self-care, etc.)",
      ],
      tips: [
        "The medical practitioner's section decides most approvals — ask them to be specific and give concrete examples of your limitations.",
        "You do NOT need to pay a private company a percentage of your refund. Applying directly is free.",
        "Denied? You can request a review or appeal. Many people are approved on a second try with stronger wording.",
      ],
      time: "About 8 weeks once the CRA has the completed form.",
      phone: "CRA: 1-800-959-8281",
    },
  },
  {
    id: "cdb-adult",
    name: "Canada Disability Benefit",
    level: "Federal",
    category: "Money",
    amount: "Up to $2,400 / year ($200 / month)",
    summary:
      "A monthly payment for working-age adults with a disability and lower income.",
    requires: ["dtc", "workingAge", "lowIncome"],
    note:
      "You get the maximum if your income is under about $23,000 (single) or $32,500 (couple). You must be approved for the DTC first.",
    applyText: "Learn how to apply",
    applyUrl:
      "https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit.html",
    source:
      "https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit.html",
    detail: {
      about:
        "A new federal income top-up (started July 2025) for low-income adults aged 18–64 who are approved for the Disability Tax Credit.",
      steps: [
        "Make sure your DTC is approved and your taxes are filed.",
        "Apply online, by phone, by mail, or in person once applications are open to you.",
        "Provide direct-deposit details so payments arrive automatically.",
      ],
      documents: [
        "DTC approval on file with the CRA",
        "Your most recent tax return filed",
        "Banking info for direct deposit",
      ],
      tips: [
        "File your taxes every year even with no income — payments are calculated from your return.",
        "The first $10,000 of your own working income (or $14,000 for a couple) is not counted against you.",
      ],
      time: "Paid monthly once approved.",
      phone: "Service Canada: 1-800-O-Canada",
    },
  },
  {
    id: "child-disability-benefit",
    name: "Child Disability Benefit",
    level: "Federal",
    category: "Money (for parents)",
    amount: "Up to $3,480 / year per child ($290 / month)",
    summary:
      "A tax-free monthly amount added to the Canada Child Benefit for a child approved for the DTC.",
    requires: ["dtc", "child"],
    note:
      "Once your child is approved for the DTC and you already receive the Canada Child Benefit, this is added automatically — no separate form.",
    applyText: "How the Child Disability Benefit works",
    applyUrl:
      "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/child-disability-benefit.html",
    source:
      "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/child-disability-benefit.html",
    detail: {
      about:
        "Extra monthly money for families raising a child under 18 who qualifies for the Disability Tax Credit. It's added on top of the regular Canada Child Benefit.",
      steps: [
        "Apply for the DTC for your child (Form T2201).",
        "Make sure you're already receiving the Canada Child Benefit (CCB).",
        "Once the DTC is approved, the Child Disability Benefit is added automatically.",
      ],
      documents: [
        "Your child's DTC approval",
        "You must be the person receiving the CCB",
      ],
      tips: [
        "No separate application — the hard part is just getting your child's DTC approved.",
        "The amount reduces gradually for family income over about $82,847.",
      ],
      time: "Added to your next CCB payment after DTC approval.",
      phone: "CRA benefits: 1-800-387-1193",
    },
  },
  {
    id: "rdsp",
    name: "Registered Disability Savings Plan (RDSP)",
    level: "Federal",
    category: "Money & savings",
    amount: "Up to $3,500 grant + $1,000 bond per year (free government money)",
    summary:
      "A savings account where the government adds matching grants (up to 300%) and bonds — you don't even need to contribute to get the bond if your income is low.",
    requires: ["dtc", "under60"],
    note:
      "One of the best-value benefits available. Open one at most banks or credit unions after you're approved for the DTC.",
    applyText: "How to open an RDSP",
    applyUrl:
      "https://www.canada.ca/en/employment-social-development/programs/disability/savings.html",
    source:
      "https://www.canada.ca/en/employment-social-development/programs/disability/savings.html",
    detail: {
      about:
        "A long-term savings account for people approved for the DTC. The government pays in grants (matching what you put in) and bonds (free money for lower incomes) — potentially tens of thousands of dollars over time.",
      steps: [
        "Get approved for the DTC first.",
        "Choose a bank or credit union that offers RDSPs.",
        "Open the plan with your SIN and DTC approval.",
        "Contribute if you can — but even $0 contributions still earn the bond if your income is low.",
      ],
      documents: [
        "Your SIN and DTC approval",
        "Be a Canadian resident under age 60",
      ],
      tips: [
        "The bond (up to $1,000/year) requires NO contribution from you — don't leave it on the table.",
        "Grants can match up to 300% — for lower incomes, the first $500 you put in can become $1,500.",
        "Ask the bank specifically for an 'RDSP' — front-line staff sometimes aren't familiar with it.",
      ],
      time: "Can be opened same-day once you have DTC approval.",
      phone: "RDSP info: 1-866-204-0357",
    },
  },
  {
    id: "cwb-disability",
    name: "Canada Workers Benefit — Disability Supplement",
    level: "Federal",
    category: "Money & taxes",
    amount: "Extra refundable tax credit on top of the base benefit",
    summary:
      "If you work and earn a lower income, this adds an extra disability top-up to your tax refund.",
    requires: ["dtc", "working", "lowIncome"],
    note:
      "Claimed automatically on your annual tax return once your DTC is on file with the CRA.",
    applyText: "Canada Workers Benefit details",
    applyUrl:
      "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-workers-benefit.html",
    source:
      "https://www.canada.ca/en/revenue-agency/services/child-family-benefits/canada-workers-benefit.html",
    detail: {
      about:
        "A refundable tax credit that boosts the income of lower-earning workers, with an extra 'disability supplement' for those approved for the DTC.",
      steps: [
        "Have your DTC on file with the CRA.",
        "File your income tax return — claim the disability supplement (Schedule 6).",
        "Tax software or a free tax clinic will handle it for you.",
      ],
      documents: [
        "DTC approval",
        "Your T4 / record of working income",
      ],
      tips: [
        "You may be able to receive part of it in advance rather than waiting for tax time.",
        "Free volunteer tax clinics can file this for you if money is tight.",
      ],
      time: "Received with your tax refund (or as advance payments).",
      phone: "CRA: 1-800-959-8281",
    },
  },
  {
    id: "cpp-disability",
    needsPractitioner: true,
    name: "CPP Disability Benefit",
    level: "Federal",
    category: "Money",
    amount: "Monthly payment based on your CPP contributions",
    summary:
      "A monthly payment if a severe, long-term disability stops you from working and you've paid into CPP.",
    requires: ["workingAge", "cppContrib", "unableToWork"],
    note:
      "Does NOT require the DTC. You need enough past CPP work contributions AND a disability severe enough that it regularly prevents any substantial work.",
    applyText: "Apply for CPP Disability",
    applyUrl:
      "https://www.canada.ca/en/services/benefits/publicpensions/cpp-disability-benefit.html",
    source:
      "https://www.canada.ca/en/services/benefits/publicpensions/cpp-disability-benefit.html",
    detail: {
      about:
        "A monthly payment from the Canada Pension Plan for people under 65 who have worked and contributed to CPP but can no longer work regularly because of a severe, prolonged disability.",
      steps: [
        "Gather your medical information and work history.",
        "Complete the CPP Disability application (online through My Service Canada Account, or on paper).",
        "Have your doctor complete the medical report section.",
        "Submit and keep a copy of everything.",
      ],
      documents: [
        "Enough CPP contributions (generally 4 of the last 6 years)",
        "A detailed medical report from your doctor",
        "Details of your work history and why you can't continue",
      ],
      tips: [
        "'Severe and prolonged' is a high bar — describe your worst days honestly, not your best.",
        "If denied, you can request reconsideration — many are approved at that stage. Don't give up after a first no.",
        "Apply as soon as you stop being able to work; there can be back-pay.",
      ],
      time: "Around 120 days for a decision.",
      phone: "Service Canada: 1-800-277-9914",
    },
  },
  {
    id: "csg-disability",
    name: "Canada Student Grant for Students with Disabilities",
    level: "Federal",
    category: "Education",
    amount: "Up to $2,800 / year (a grant — you don't pay it back)",
    summary:
      "Extra grant money for post-secondary students with a documented disability.",
    requires: ["student", "disabilityDoc"],
    note:
      "Applied for through Alberta Student Aid — one application covers this and the Alberta grant.",
    applyText: "Apply through your provincial student aid",
    applyUrl: (a) => STUDENT_AID[a.province] || FED_STUDENT_AID,
    source:
      "https://www.canada.ca/en/employment-social-development/services/education/grants/disabilities.html",
    detail: {
      about:
        "A federal grant (not a loan) to help post-secondary students with a permanent or persistent disability with the general costs of school.",
      steps: [
        "Create an Alberta Student Aid account.",
        "Apply for student aid for your program.",
        "Complete the disability section and submit a Schedule 4 + medical documentation the first time.",
      ],
      documents: [
        "Proof of your disability (e.g. assessment or a completed Schedule 4)",
        "Enrolment in a designated post-secondary program",
      ],
      tips: [
        "One Alberta Student Aid application covers the federal grants AND the Alberta grant — you don't apply separately.",
        "You only need to submit disability documentation once, not every year.",
      ],
      time: "Assessed with your student aid application.",
      phone: "Alberta Student Aid: 1-855-606-2096",
    },
  },
  {
    id: "csg-dse",
    name: "Canada Student Grant — Services & Equipment",
    level: "Federal",
    category: "Education",
    amount: "Up to $20,000 / year",
    summary:
      "Covers assistive technology, note-taking, tutoring, coaching and other supports for students with disabilities.",
    requires: ["student", "disabilityDoc"],
    note:
      "Covers a lot: assistive tech, tutors, note-takers, learning coaches, specialized transportation and more.",
    applyText: "Apply through your provincial student aid",
    applyUrl: (a) => STUDENT_AID[a.province] || FED_STUDENT_AID,
    source:
      "https://www.canada.ca/en/employment-social-development/services/education/grants/disabilities.html",
    detail: {
      about:
        "A large grant that pays for the specific services and equipment a student needs because of their disability — from screen readers and hearing supports to coaching, tutoring and note-taking.",
      steps: [
        "Apply through Alberta Student Aid and complete the disability section.",
        "Work with your school's Accessibility / Disability Services office to identify what you need.",
        "Submit quotes or a recommendation for the equipment/services.",
      ],
      documents: [
        "Disability documentation on file",
        "A recommendation or quote for the specific supports (often via your school's accessibility office)",
      ],
      tips: [
        "Your campus Accessibility Services office does this all the time — go to them first; they'll guide the paperwork.",
        "Can cover ADHD/learning coaching, tutoring, and organization tools, not just physical equipment.",
      ],
      time: "Assessed with your student aid application.",
      phone: "Alberta Student Aid: 1-855-606-2096",
    },
  },

  /* ------------------------------------------------------------ PROVINCIAL */
  {
    id: "aish",
    needsPractitioner: true,
    name: "Assured Income for the Severely Handicapped (AISH)",
    level: "Alberta",
    category: "Money",
    amount: "Monthly living allowance + health and personal benefits",
    summary:
      "Alberta disability income assistance for people whose permanent disability prevents employment.",
    requires: ["adult", "ab", "citizenPR", "severePermanent", "lowIncome"],
    note:
      "AISH is for a severe, permanent disability that prevents employment. Alberta now uses one application to assess both AISH and ADAP — submit it once, not separately for each program.",
    applyText: "Apply for Alberta disability income assistance",
    applyUrl: "https://www.alberta.ca/aish-how-to-apply",
    source: "https://www.alberta.ca/aish-eligibility",
    detail: {
      about:
        "AISH is Alberta disability income assistance for adults whose severe, permanent disability prevents employment. It includes a monthly living allowance and may include health and personal benefits.",
      steps: [
        "Use Alberta's combined AISH/ADAP application — it assesses which program fits; you do not make two separate applications.",
        "Complete your part and arrange the required medical report with a medical professional registered in Alberta.",
        "Submit online, or use the application options Alberta Supports provides if online is not workable for you.",
      ],
      documents: [
        "Medical report showing how a severe, permanent impairment prevents employment",
        "Proof of Alberta residency + Canadian citizenship / PR",
        "Financial details (income and assets)",
      ],
      tips: [
        "The medical form should focus on how your condition limits your ability to EARN A LIVING, not just the diagnosis.",
        "The combined application assesses AISH and ADAP. Alberta, not this tool, decides the program and benefit amount.",
        "Use Alberta's AISH/ADAP benefit estimator for a household-specific estimate before relying on any amount.",
      ],
      time: "Ask Alberta Supports for the current processing time.",
      phone: "Alberta Supports: 1-877-759-6810",
    },
  },
  {
    id: "adap",
    needsPractitioner: true,
    name: "Alberta Disability Assistance Program (ADAP)",
    level: "Alberta",
    category: "Money",
    amount: "Up to $1,740/month + health, personal and employment benefits",
    summary:
      "Alberta disability income assistance when a severe disability significantly impedes employment, including episodically.",
    requires: ["adult", "ab", "citizenPR", "lowIncome", "disabilityDoc"],
    note:
      "The same combined application assesses ADAP and AISH. This guide can only flag that ADAP may be worth asking about — Alberta makes the eligibility decision.",
    applyText: "Apply for Alberta disability income assistance",
    applyUrl: "https://www.alberta.ca/aish-how-to-apply",
    source: "https://www.alberta.ca/alberta-disability-assistance-program",
    detail: {
      about:
        "ADAP is Alberta disability income assistance for adults whose severe disability significantly impedes employment continuously or episodically. It can include a core monthly financial benefit, health benefits, personal benefits and employment supports.",
      steps: [
        "Use Alberta's combined AISH/ADAP application — it assesses which program fits; you do not make two separate applications.",
        "Complete your part and arrange the required medical report with a medical professional registered in Alberta.",
        "Provide the residency, status and financial information requested by Alberta Supports.",
      ],
      documents: [
        "Medical report describing how the disability significantly impedes employment",
        "Proof of Alberta residency + Canadian citizenship / PR",
        "Financial details (income and assets)",
      ],
      tips: [
        "Describe functional limits and fluctuating or episodic barriers — not only your diagnosis name.",
        "One application is enough: Alberta decides whether AISH or ADAP is the appropriate program.",
        "Use Alberta's AISH/ADAP benefit estimator for a household-specific estimate before relying on any amount.",
      ],
      time: "Ask Alberta Supports for the current processing time.",
      phone: "Alberta Supports: 1-877-759-6810",
    },
  },
  {
    id: "aadl",
    name: "Alberta Aids to Daily Living (AADL)",
    level: "Alberta",
    category: "Health & equipment",
    amount: "Funding for medical equipment & supplies (you pay a small share)",
    summary:
      "Helps pay for equipment and supplies you need for a long-term illness, disability or condition — wheelchairs, hearing aids, breathing supplies and much more.",
    requires: ["ab", "equipmentNeed"],
    note:
      "Covers a huge range of devices. You usually pay 25% (capped per year), and low-income households can have that waived.",
    applyText: "Alberta Aids to Daily Living",
    applyUrl: "https://www.alberta.ca/alberta-aids-to-daily-living",
    source: "https://www.alberta.ca/aadl-eligibility-and-application-for-benefits",
    detail: {
      about:
        "A provincial program that funds basic medical equipment and supplies for Albertans with a long-term disability, chronic illness or terminal illness — mobility aids, hearing aids, vision aids, breathing equipment, diabetic and ostomy supplies, and more.",
      steps: [
        "See an AADL-authorized health professional (e.g. an OT, audiologist, or specialist) who assesses what you need.",
        "They complete the authorization for the specific equipment.",
        "Get the item from an approved vendor; AADL covers its share directly.",
      ],
      documents: [
        "Alberta Health Care (personal health) number",
        "An assessment from an authorized professional for the specific item",
      ],
      tips: [
        "You don't apply to a general office — you go through an authorizer (often an OT, physio, or audiologist). Ask your doctor for a referral.",
        "The 25% cost-share is capped each year, and can be waived entirely for low-income households or those on AISH.",
      ],
      time: "Depends on the assessment and vendor.",
      phone: "AADL: 780-427-0731 (toll-free via 310-0000)",
    },
  },
  {
    id: "pdd",
    name: "Persons with Developmental Disabilities (PDD)",
    level: "Alberta",
    category: "Daily living supports",
    amount: "Funded support services (not a cash payment)",
    summary:
      "Support services for adults with a developmental disability — help with daily living, community involvement, and employment.",
    requires: ["adult", "ab", "developmental"],
    note:
      "For adults whose developmental disability began before age 18 and significantly affects daily living. Provides services and supports, not direct cash.",
    applyText: "Persons with Developmental Disabilities",
    applyUrl: "https://www.alberta.ca/persons-with-developmental-disabilities-pdd",
    source: "https://www.alberta.ca/persons-with-developmental-disabilities-pdd",
    detail: {
      about:
        "A program that funds services helping adults with developmental disabilities live as independently as possible — community access, home living supports, employment supports and specialized services.",
      steps: [
        "Contact a PDD office or Alberta Supports to start.",
        "An assessment confirms eligibility (developmental disability with onset before 18).",
        "Work with a coordinator to build a support plan and connect with service providers.",
      ],
      documents: [
        "Psychological assessment showing a developmental disability before age 18",
        "Proof of Alberta residency + age 18+",
      ],
      tips: [
        "PDD funds services and supports rather than paying you cash — many people also receive AISH at the same time.",
        "Start early; assessment and planning can take time.",
      ],
      time: "Varies; assessment-based.",
      phone: "Alberta Supports: 1-877-644-9992",
    },
  },
  {
    id: "fscd",
    name: "Family Support for Children with Disabilities (FSCD)",
    level: "Alberta",
    category: "Family supports",
    amount: "Services + funding for families raising a child with a disability",
    summary:
      "Support and funding for Alberta families raising a child under 18 with a disability — respite, aids, counselling, and reimbursement of some costs.",
    requires: ["child", "ab"],
    note:
      "Wide-ranging support for families: respite care, specialized services, and help with some out-of-pocket disability costs. Separate from (and can be combined with) the federal Child Disability Benefit.",
    applyText: "Family Support for Children with Disabilities",
    applyUrl: "https://www.alberta.ca/fscd",
    source: "https://www.alberta.ca/fscd-eligibility",
    detail: {
      about:
        "A provincial program that helps families of children under 18 with disabilities cover the extra costs and stress of caregiving — respite, child-focused supports, family counselling, and reimbursement of some disability-related expenses.",
      steps: [
        "Contact an FSCD office or Alberta Supports.",
        "Meet with an FSCD worker to identify your family's needs.",
        "A signed agreement sets out the services and funding you'll receive.",
      ],
      documents: [
        "A diagnosis of your child's disability from a professional",
        "Proof of Alberta residency",
      ],
      tips: [
        "Ask specifically about respite — many families don't realize it's covered.",
        "You can receive FSCD AND the federal Child Disability Benefit at the same time.",
      ],
      time: "Assessment-based; contact them to begin.",
      phone: "Alberta Supports: 1-877-644-9992",
    },
  },
  {
    id: "dres",
    name: "Disability Related Employment Supports (DRES)",
    level: "Alberta",
    category: "Employment",
    amount: "Funding for assistive tech, coaching, training & workplace supports",
    summary:
      "Pays for supports that help you get or keep a job, or finish training — assistive devices, tutoring, coaching, workplace tools.",
    requires: ["ab", "citizenPR", "disabilityDoc", "lookingOrTraining"],
    note:
      "Does NOT require the DTC and is very flexible — can fund coaching, focus/organization tools, and training supports. Start at an Alberta Supports Centre.",
    applyText: "Disability Related Employment Supports",
    applyUrl: "https://www.alberta.ca/disability-related-employment-supports",
    source: "https://www.alberta.ca/disability-related-employment-supports",
    detail: {
      about:
        "Funding for the specific supports you need to overcome disability-related barriers to work or training — assistive technology, tutoring, interpreters, coaching, exam accommodations, even some vehicle or workplace modifications.",
      steps: [
        "Contact your nearest Alberta Supports Centre.",
        "Complete an employability assessment with a worker.",
        "Together you build a service plan listing the supports DRES will fund.",
      ],
      documents: [
        "Documentation of a permanent/chronic disability that affects work or training",
        "Proof you're legally entitled to work in Canada",
      ],
      tips: [
        "No DTC needed — this is one of the easiest supports to access with an ADHD, learning, or mental-health diagnosis.",
        "Be specific about the barrier and the tool that would fix it (e.g. 'text-to-speech software for reports').",
      ],
      time: "Assessment-based.",
      phone: "Alberta Supports: 1-877-644-9992",
    },
  },
  {
    id: "ab-grant-disability",
    name: "Alberta Grant for Students with Disabilities",
    level: "Alberta",
    category: "Education",
    amount: "Up to $3,000 / year",
    summary:
      "Alberta top-up grant for post-secondary students with a disability.",
    requires: ["student", "ab", "disabilityDoc"],
    note:
      "First time applying? You'll complete a Schedule 4 form + submit medical documentation once. Then it's part of your yearly student aid.",
    applyText: "Apply through your provincial student aid",
    applyUrl: (a) => STUDENT_AID[a.province] || FED_STUDENT_AID,
    source:
      "https://studentaid.alberta.ca/policy/student-aid-policy-manual/disability-permanent-disability-or-persistent-or-prolonged-disability/grants-for-students-with-a-disability-pd-or-ppd/",
    detail: {
      about:
        "A provincial grant (not a loan) that stacks on top of the federal disability grants to help Alberta post-secondary students with a disability.",
      steps: [
        "Apply for student aid through Alberta Student Aid.",
        "Complete the disability section.",
        "Submit a Schedule 4 + medical documentation the first time you apply.",
      ],
      documents: [
        "Schedule 4 (Disability Verification) form",
        "Medical documentation of your disability",
      ],
      tips: [
        "It's the same single application as the federal grants — no extra form.",
        "Documentation is a one-time submission, reused in future years.",
      ],
      time: "Assessed with your student aid application.",
      phone: "Alberta Student Aid: 1-855-606-2096",
    },
  },
  {
    id: "adult-health-benefit",
    name: "Alberta Adult Health Benefit",
    level: "Alberta",
    category: "Health",
    amount: "Free prescriptions, dental, optical and more",
    summary:
      "Health coverage for adults in lower-income households — prescriptions, dental, eye care, essential diabetic supplies.",
    requires: ["adult", "ab", "lowIncome"],
    note:
      "Great for covering the cost of medication if you're on a lower income and not already covered by AISH.",
    applyText: "Alberta Adult Health Benefit",
    applyUrl: "https://www.alberta.ca/alberta-adult-health-benefit",
    source: "https://www.alberta.ca/alberta-adult-health-benefit",
    detail: {
      about:
        "Ongoing health coverage for adults and families with lower incomes — prescription drugs, dental, optical, emergency ambulance, and diabetic supplies — at no monthly premium.",
      steps: [
        "Check the income guidelines on the page.",
        "Complete the Alberta Adult Health Benefit application.",
        "Submit it with proof of income.",
      ],
      documents: [
        "Proof of income (e.g. tax assessment)",
        "Alberta Health Care number",
      ],
      tips: [
        "If you leave AISH or Income Support because you started working, you may keep this coverage — ask specifically.",
      ],
      time: "A few weeks to process.",
      phone: "Alberta Supports: 1-877-644-9992",
    },
  },
  {
    id: "child-health-benefit",
    name: "Alberta Child Health Benefit",
    level: "Alberta",
    category: "Health (for children)",
    amount: "Free prescriptions, dental, optical for kids",
    summary:
      "Health coverage for children in lower-income families — including prescriptions, dental and eye care.",
    requires: ["child", "ab", "lowIncome"],
    note:
      "Covers medication, dental and eye care for children in lower-income households.",
    applyText: "Alberta Child Health Benefit",
    applyUrl: "https://www.alberta.ca/alberta-child-health-benefit",
    source: "https://www.alberta.ca/alberta-child-health-benefit",
    detail: {
      about:
        "Health coverage for children up to 18 (or 19 if in school) in lower-income Alberta families — prescriptions, dental, optical, and more, with no premium.",
      steps: [
        "Check the income guidelines.",
        "Complete the Alberta Child Health Benefit application.",
        "Submit with proof of income.",
      ],
      documents: [
        "Proof of family income",
        "Your children's Alberta Health Care numbers",
      ],
      tips: [
        "One application can cover all the children in your household.",
      ],
      time: "A few weeks to process.",
      phone: "Alberta Supports: 1-877-644-9992",
    },
  },
  {
    id: "parking-placard",
    needsPractitioner: true,
    name: "Disability Parking Placard",
    level: "Alberta",
    category: "Getting around",
    amount: "Low-cost accessible parking permit",
    summary:
      "A placard that lets you use accessible parking spaces.",
    requires: ["ab", "mobility"],
    note:
      "For people who can't walk more than about 50 metres, or whose vision loss makes moving around parking areas unsafe.",
    applyText: "Apply for a parking placard",
    applyUrl: "https://www.alberta.ca/get-parking-placard-people-disabilities",
    source: "https://www.alberta.ca/parking-placard-disabilities",
    detail: {
      about:
        "A permit that lets you park in designated accessible spaces. Blue placards are for long-term disabilities (valid 5 years); red placards are for temporary ones (3–12 months).",
      steps: [
        "Get the application form and have a medical practitioner complete their section.",
        "Take it to any registry agent (e.g. an AMA centre).",
      ],
      documents: [
        "Application form with the medical section completed",
        "Government-issued ID",
      ],
      tips: [
        "You don't need to own a vehicle — the placard belongs to you, not a car.",
        "The medical section can be completed by a physician, occupational therapist, physiotherapist, surgeon, podiatrist, nurse practitioner or chiropractor.",
      ],
      time: "Issued at the registry, often same-day.",
      phone: "Any Alberta registry agent",
    },
  },

  /* ------------------------------------------------------------- MUNICIPAL */
  {
    id: "calgary-fair-entry",
    name: "Calgary Fair Entry — Transit & Recreation",
    level: "Calgary",
    category: "Getting around & recreation",
    amount: "Transit pass from $5.90/mo + 75% off recreation",
    summary:
      "One application unlocks a low-income monthly transit pass and 75% off City of Calgary pools, fitness and rec programs.",
    requires: ["calgary", "lowIncome"],
    note:
      "Apply once through Fair Entry; the sliding-scale transit pass is $5.90–$59/month depending on income.",
    applyText: "Apply through Calgary Fair Entry",
    applyUrl: "https://www.calgary.ca/social-services/low-income/fair-entry-subsidy.html",
    source: "https://www.calgary.ca/social-services/low-income/fair-entry-subsidy.html",
    detail: {
      about:
        "A single City of Calgary application ('Fair Entry') that qualifies you for several low-income discounts at once — the sliding-scale monthly transit pass and 75% off recreation admission and programs.",
      steps: [
        "Gather proof of income for your household.",
        "Apply online through Fair Entry (or in person).",
        "Once approved, buy the low-income transit pass and use your Fee Assistance card for recreation.",
      ],
      documents: [
        "Proof of income (e.g. tax assessment or benefit statements)",
        "Calgary address",
      ],
      tips: [
        "One approval covers transit AND recreation — you don't apply separately.",
        "The transit pass price slides with income, as low as $5.90/month.",
      ],
      time: "Usually processed within a couple of weeks.",
      phone: "City of Calgary 311",
    },
  },
  {
    id: "edmonton-fare-assistance",
    name: "Edmonton Ride Transit & Leisure Access",
    level: "Edmonton",
    category: "Getting around & recreation",
    amount: "$36/month transit pass + free/low-cost recreation",
    summary:
      "A subsidized monthly Arc transit card plus reduced-cost access to City of Edmonton recreation facilities.",
    requires: ["edmonton", "lowIncomeOrDisabilityIncome"],
    note:
      "You qualify on low income OR if you receive AISH / CPP Disability. One application covers both transit and leisure access.",
    applyText: "Edmonton transit & leisure assistance",
    applyUrl: "https://www.edmonton.ca/ets/fare-assistance",
    source: "https://www.edmonton.ca/ets/fare-assistance",
    detail: {
      about:
        "City of Edmonton programs that give lower-income residents a discounted monthly transit pass (the Ride Transit Program) and reduced-cost recreation access (the Leisure Access Program).",
      steps: [
        "Complete the Leisure Access / Ride Transit application.",
        "Include proof of income OR proof you receive AISH / CPP-D.",
        "Once approved, buy the $36 monthly Arc card and use your Leisure Access pass.",
      ],
      documents: [
        "Proof of income OR AISH / CPP-D statement",
        "Edmonton address",
      ],
      tips: [
        "Applying for Leisure Access automatically considers you for the transit discount too.",
        "If you're on AISH or CPP Disability you likely qualify regardless of the income cutoff.",
      ],
      time: "A couple of weeks.",
      phone: "City of Edmonton 311",
    },
  },

  /* ---- Alberta municipalities beyond Calgary/Edmonton -----------------------
     Researched and verified against each city's own page on 2026-07-15. Every
     figure below was read off the official source listed in the entry — none is
     recalled or inferred. If you add a city: verify it the same way, and add it
     to CITIES_WITH_PROGRAMS or its residents keep getting the 2-1-1 fallback.

     Worth knowing: these are NOT all the same program with a different logo.
     Grande Prairie explicitly excludes AISH recipients from its low-income
     transit subsidy and gives them a much better separate pass; St. Albert
     gives AISH free transit outright. Assuming they all work like Calgary's
     Fair Entry would have sent people to the wrong program. */
  {
    id: "reddeer-fee-assistance",
    name: "Red Deer Transit & Recreation Fee Assistance",
    level: "Red Deer",
    category: "Getting around & recreation",
    amount: "$34/month transit pass + up to $200/year recreation",
    summary:
      "A reduced monthly transit pass plus help with City recreation fees. Being on AISH qualifies you automatically.",
    requires: ["reddeer", "lowIncomeOrDisabilityIncome"],
    note:
      "If you're on AISH or Income Support you qualify automatically — no income test needed. The transit pass is a permanent program (not a pilot), and both need renewing each year.",
    applyText: "Red Deer fee assistance",
    applyUrl:
      "https://www.reddeer.ca/city-services/transit/fares-and-passes/transit-fare-assistance-pass/",
    source:
      "https://www.reddeer.ca/recreation-and-culture/recreation/facility-admission-fees--pass-prices/fee-assistance-program/",
    detail: {
      about:
        "Two City of Red Deer programs. The Transit Fare Assistance Pass drops a monthly pass to $34 no matter which type you'd normally buy (regular passes run $62–$75). The Recreation Fee Assistance Program adds a Recreation Pass Card for drop-in use plus up to $200 a year toward registered programs.",
      steps: [
        "Apply online for Recreation Fee Assistance, or for the Transit Fare Assistance Pass — being approved for recreation also qualifies you for transit.",
        "If you're on AISH, Income Support or Guaranteed Income Supplement, say so — that's automatic qualification and you can skip the income test.",
        "Otherwise attach your CRA Notice of Assessment so they can check you against the low-income line.",
        "Allow up to 10 business days, then buy the $34 pass.",
        "Re-apply every year — approval expires.",
      ],
      documents: [
        "Proof you're on AISH / Income Support / GIS — or a CRA Notice of Assessment",
        "Proof of a Red Deer address",
      ],
      tips: [
        "One application can cover both: being approved for Recreation Fee Assistance is itself a qualifying route into the transit pass.",
        "Recreation funding is 'pending available funding' — apply early in the year rather than late.",
        "Sorensen Station staff will help you apply in person if the online form is hard going.",
      ],
      time: "Up to 10 business days.",
      phone: "City of Red Deer: 403-342-8111",
    },
  },
  {
    id: "lethbridge-fee-assistance",
    name: "Lethbridge Fee Assistance Program",
    level: "Lethbridge",
    category: "Getting around & recreation",
    amount: "3 months of bus passes for the price of 1 + $150/season recreation",
    summary:
      "One application covers transit, Access-A-Ride paratransit, and recreation fees. AISH counts as proof of income.",
    requires: ["lethbridge", "lowIncomeOrDisabilityIncome"],
    note:
      "This is the only one of these city programs that also subsidizes paratransit (Access-A-Ride) — worth knowing if you can't use a regular bus.",
    applyText: "Lethbridge fee assistance",
    applyUrl:
      "https://www.lethbridge.ca/community-services-supports/community-social-development-csd/fee-assistance-program/",
    source:
      "https://www.lethbridge.ca/community-services-supports/community-social-development-csd/fee-assistance-program/",
    detail: {
      about:
        "A single City of Lethbridge program covering three things: bus passes (you pay for one month and get the next two free), Access-A-Ride paratransit at one-third of the usual cost, and recreation or culture programs.",
      steps: [
        "Apply online through the City's Fee Assistance form, or call 311 for help.",
        "Send your AISH statement as proof of income — it's on their accepted list, so you don't need a Notice of Assessment.",
        "Choose what you need: bus pass, Access-A-Ride, recreation, or more than one.",
        "Buy your one paid month of bus pass and the next two come free.",
      ],
      documents: [
        "AISH statement — or a CRA Notice of Assessment, Alberta Works letter, housing authority letter, or a letter from a Registered Social Worker",
        "Proof of a Lethbridge address",
      ],
      tips: [
        "A letter from a Registered Social Worker is accepted on its own — useful if your paperwork is a mess or your income is hard to document.",
        "Recreation funding is capped per season, so a season with an expensive program in it is the one to claim.",
        "CommunityLINKS at the main library will sit with you and do the application.",
      ],
      time: "Apply any time; funding runs while it lasts.",
      phone: "311, or 403-320-3111 from outside Lethbridge",
    },
  },
  {
    id: "medicinehat-fair-entry",
    name: "Medicine Hat Fair Entry",
    level: "Medicine Hat",
    category: "Getting around & recreation",
    amount: "75% off transit (up to $630/yr) + $200/yr recreation & arts",
    summary:
      "One application, valid up to two years, for cheaper transit passes plus recreation and Esplanade arts programs.",
    requires: ["medicinehat", "lowIncomeOrDisabilityIncome"],
    note:
      "Approval lasts up to two years, so this is one of the least repetitive programs to stay on. Your AISH benefits card is accepted as proof.",
    applyText: "Medicine Hat Fair Entry",
    applyUrl: "https://forms.medicinehat.ca/Community-Development/Fair-Entry-Application",
    source:
      "https://www.medicinehat.ca/community-support-culture-safety/community-support/fair-entry/",
    detail: {
      about:
        "The City of Medicine Hat's single low-income access program. It cuts 75% off monthly transit passes (to an annual maximum of $630 of subsidy), and gives each approved person $200 a year toward City recreation and Esplanade arts programs at 75% off.",
      steps: [
        "Fill in the Fair Entry application online, or call 403-502-8001.",
        "Attach your AISH benefits card — it's accepted as proof of income.",
        "Add proof of a Medicine Hat address.",
        "Wait about two weeks for a decision.",
      ],
      documents: [
        "AISH benefits card — or a CRA notice, Alberta Works document, or a social worker's letter",
        "Proof of a Medicine Hat address",
      ],
      tips: [
        "List every family member on the one application — each approved person gets their own $200 recreation subsidy.",
        "Approval is good for up to two years, so diarize the expiry rather than re-applying blindly.",
      ],
      time: "About two weeks.",
      phone: "Fair Entry: 403-502-8001",
    },
  },
  {
    id: "grandeprairie-aish-pass",
    name: "Grande Prairie AISH Transit Pass & Recreation Access",
    level: "Grande Prairie",
    category: "Getting around & recreation",
    amount: "$10.25/month transit pass + 75% off recreation",
    summary:
      "If you're on AISH, a monthly Grande Prairie transit pass costs $10.25 instead of $74.25 — the deepest municipal transit discount in the province that we've found.",
    requires: ["grandeprairie"],
    note:
      "Important: AISH and ADAP recipients are NOT part of the general Transit Access Program — you get your own, cheaper pass instead ($10.25 vs $37.13). Ask for the AISH pass by name at City Hall.",
    applyText: "Grande Prairie transit fares",
    applyUrl: "https://cityofgp.com/roads-transportation/public-transit/fares",
    source: "https://cityofgp.com/roads-transportation/public-transit/transit-access-program",
    detail: {
      about:
        "Grande Prairie prices a monthly transit SUPERPASS at $10.25 for AISH recipients, against $74.25 at the regular adult rate. It's separate from the city's general low-income Transit Access Program, which AISH recipients are explicitly excluded from — because this is the better deal. The Recreation Access Program is a separate application giving 75% off memberships, punch passes and registered programs.",
      steps: [
        "For the transit pass: go to City Hall (10205 98 Street) and ask for the AISH monthly pass — bring your AISH documentation.",
        "For recreation: apply separately to the Recreation Access Program, online or in person.",
        "In-person applications are approved on the spot — about 10 minutes. Online takes about 2 days.",
      ],
      documents: [
        "Proof you receive AISH (or ADAP)",
        "Proof of a Grande Prairie address",
        "For recreation: household income and any dependent children's details",
      ],
      tips: [
        "Don't let anyone put you in the Transit Access Program instead — it's a 50% discount ($37.13), and the AISH pass is $10.25. Say 'AISH pass' explicitly.",
        "The Recreation Access Program uses a more generous income line than most (the low-income cut-off plus 30%), so apply even if you've been refused elsewhere.",
      ],
      time: "Same day in person; about 2 days online.",
      phone: "City of Grande Prairie: 780-538-0300 or 311",
    },
  },
  {
    id: "stalbert-subsidy",
    name: "St. Albert Transit & Recreation Subsidy",
    level: "St. Albert",
    category: "Getting around & recreation",
    amount: "Free local transit + free annual recreation membership",
    summary:
      "On AISH or ADAP in St. Albert, local buses and the Handibus are free, and a year's membership at every City rec facility is free too.",
    requires: ["stalbert"],
    note:
      "AISH and ADAP recipients get automatic eligibility here — the free annual recreation membership isn't income-tested for you, and local transit is free rather than discounted.",
    applyText: "St. Albert subsidy program",
    applyUrl: "https://stalbert.ca/city/fcss/programs-services/subsidy/",
    source: "https://stalbert.ca/city/fcss/programs-services/subsidy/",
    detail: {
      about:
        "St. Albert's Family and Community Support Services runs one subsidy covering transit and recreation. For AISH and ADAP recipients: free local fares within St. Albert, free Handibus rides if you're an approved rider, 65% off the monthly Edmonton commuter pass, and a free annual membership at Servus Place, Fountain Park and Grosvenor Pool.",
      steps: [
        "Fill in the subsidy application on the City's subsidy page.",
        "Say that you receive AISH or ADAP — that's automatic eligibility for the free annual recreation membership.",
        "If you use the Handibus, ask about approved-rider status at the same time.",
        "Call 780-459-1756 if you get stuck.",
      ],
      documents: [
        "Proof you receive AISH or ADAP",
        "Proof of a St. Albert address",
      ],
      tips: [
        "You can't claim this if another source already funds the same thing — so if a program is already paying your bus fare, sort that out first.",
        "The commuter pass to Edmonton is separate from free local fares — ask for both if you travel in.",
      ],
      time: "Allow a couple of weeks.",
      phone: "St. Albert FCSS: 780-459-1756",
    },
  },
  {
    id: "strathcona-subsidy",
    name: "Strathcona County Everybody Rides & Everybody Gets to Play",
    level: "Sherwood Park",
    category: "Getting around & recreation",
    amount: "Reduced transit fare cap + free annual Active Pass+",
    summary:
      "Reduced transit fares on your Arc card and a no-cost annual Active Pass+ for County recreation facilities, for residents on a limited income.",
    requires: ["strathcona", "lowIncomeOrDisabilityIncome"],
    note:
      "These are income-tested rather than disability-specific, and the income line is roughly $33,675/year for one person — AISH is below that, so it's worth applying.",
    applyText: "Strathcona County subsidies",
    applyUrl: "https://www.strathcona.ca/community-families/affordable-services/subsidized-fares/",
    source: "https://www.strathcona.ca/community-families/affordable-services/",
    detail: {
      about:
        "Two Strathcona County programs. Everybody Rides puts a reduced monthly fare cap on your Arc card profile for local and commuter travel. Everybody Gets to Play gives a free annual Active Pass+ for County recreation facilities plus reduced fees on programs.",
      steps: [
        "Call Family and Community Services at 780-464-4044, or go to 401 Festival Lane (Community Centre, 2nd floor).",
        "Bring ID, proof you live in the County, and your Notice of Assessment.",
        "Ask about both programs in the one visit — they're separate but handled by the same team.",
      ],
      documents: [
        "Photo ID",
        "Proof of a Strathcona County address",
        "CRA Notice of Assessment (or other proof of income)",
      ],
      tips: [
        "The County raised its income thresholds, so a refusal from years ago isn't a reason not to re-apply.",
        "Everybody Rides works by changing the fare cap on your Arc card — you keep using the same card.",
      ],
      time: "Ask when you apply — it isn't published.",
      phone: "Family and Community Services: 780-464-4044",
    },
  },
  {
    id: "airdrie-fair-access",
    name: "Airdrie Fair Access",
    level: "Airdrie",
    category: "Getting around & recreation",
    amount: "25–75% off transit passes + Genesis Place recreation",
    summary:
      "One income-tested application covering Airdrie transit passes and Genesis Place recreation, at 25%, 50% or 75% off depending on income.",
    requires: ["airdrie", "lowIncomeOrDisabilityIncome"],
    note:
      "Unlike Red Deer or Medicine Hat, being on AISH does NOT qualify you automatically here — Airdrie goes purely on household income. AISH income is well under the line, so it's still worth applying; just expect to show income rather than an AISH card.",
    applyText: "Airdrie Fair Access",
    applyUrl: "https://www.airdrie.ca/index.cfm?serviceID=2414",
    source: "https://www.airdrie.ca/index.cfm?serviceID=2157",
    detail: {
      about:
        "The City of Airdrie's single low-income subsidy (formerly the Airdrie Participant Support Program). One application covers transit passes and Genesis Place recreation admissions, passes and registered programs. The discount is tiered: 75%, 50% or 25% depending where your household income falls against the low-income cut-off before tax.",
      steps: [
        "Apply online through the Airdrie Fair Access form — it's a one-step application.",
        "Show household income; the tier you land in (75 / 50 / 25%) is worked out from it.",
        "Call Community Links on 403-945-3900 if you want help with the form.",
      ],
      documents: [
        "Proof of household income",
        "Proof of an Airdrie address",
      ],
      tips: [
        "Income up to 25% ABOVE the low-income cut-off still gets you the 25% tier — don't assume you earn too much.",
        "If you use Access Airdrie (paratransit), ask whether your subsidy applies to it — the program page doesn't say either way, so check rather than assume.",
      ],
      time: "Ask when you apply.",
      phone: "City of Airdrie: 403-948-8800 · Community Links: 403-945-3900",
    },
  },
  {
    id: "woodbuffalo-lift",
    name: "Wood Buffalo LIFT (Low-Income Fare Transit)",
    level: "Fort McMurray",
    category: "Getting around & recreation",
    amount: "$10/month transit pass + 75% off SMART Bus + 60% off recreation",
    summary:
      "A $10 monthly transit pass, 75% off specialized SMART Bus passes, and a separate 60% discount on regional recreation memberships.",
    requires: ["woodbuffalo", "lowIncomeOrDisabilityIncome"],
    note:
      "One of only two municipal programs here that discounts specialized (door-to-door) transit — the other is Lethbridge's Access-A-Ride. Your AISH statement is accepted as proof of income.",
    applyText: "Wood Buffalo LIFT",
    applyUrl: "https://forms.rmwb.ca/Community-Services/LIFT-Program-Application",
    source: "https://www.rmwb.ca/LIFT",
    detail: {
      about:
        "The Regional Municipality of Wood Buffalo's Low-Income Fare Transit program: a monthly conventional transit pass for $10, and 75% off 10- and 20-ride passes for the SMART Bus (the specialized service for seniors and people with mobility needs). Everyone in the household is covered by the one application. The Wood Buffalo Recreation Support Program is separate and gives 60% off memberships at Syncrude Sport and Wellness Centre, Regional Recreation Corporation facilities and Vista Ridge.",
      steps: [
        "Apply online for LIFT, or email community.services@rmwb.ca, or apply in person.",
        "Send your AISH statement as proof of income — it's accepted.",
        "Allow 7–10 business days for approval.",
        "For SMART Bus, buy the discounted 10- or 25-ride passes directly from the operator once you're approved.",
        "Ask about the Recreation Support Program separately — it's a different application.",
      ],
      documents: [
        "AISH statement (or other proof of household income)",
        "Proof of a Wood Buffalo address",
        "You must be 18 or older to apply",
      ],
      tips: [
        "The income line here is generous — about $35,500 for one person, well above AISH.",
        "One application covers your partner and dependent children too, not just you.",
        "Call Pulse on 780-743-7000 if anything about the form is unclear.",
      ],
      time: "7–10 business days.",
      phone: "Pulse: 780-743-7000",
    },
  },
  {
    id: "sprucegrove-low-income-transit",
    name: "Spruce Grove Low Income Transit Pass",
    level: "Spruce Grove area",
    category: "Getting around",
    amount: "$25/month local or $50/month commuter transit pass",
    summary: "A reduced local or commuter transit pass for qualifying Spruce Grove-area residents.",
    requires: ["sprucegrovearea", "lowIncome"],
    note: "The City accepts applications year-round. The program also serves eligible Stony Plain and Parkland County residents.",
    applyText: "Spruce Grove transit fares and low-income pass",
    applyUrl: "https://www.sprucegrove.org/services/spruce-grove-transit/transit-fares/",
    source: "https://www.sprucegrove.org/services/spruce-grove-transit/transit-fares/",
    detail: {
      about: "A City of Spruce Grove subsidized transit pass. Qualifying adults can buy a local pass for $25 a month or a commuter pass for $50 a month.",
      steps: ["Read the City’s current eligibility rules and application instructions.", "Apply with proof of address and household income.", "Choose the local or commuter pass that matches your trips."],
      documents: ["Proof of address", "Proof of household income"],
      tips: ["The City says applications are accepted year-round.", "Stony Plain and Parkland County residents should confirm the local address rules on the City page before applying."],
      time: "Applications are accepted year-round.",
    },
  },
  {
    id: "leduc-subsidies",
    name: "Leduc Transit & Recreation Subsidies",
    level: "Leduc",
    category: "Getting around & recreation",
    amount: "Half-price transit + a free Leduc Recreation Centre annual membership",
    summary: "Financial-navigation support that can reduce local, commuter and LATS transit costs and provide recreation access.",
    requires: ["leduc", "lowIncome"],
    note: "Leduc lists half-price local, commuter and LATS transit passes, plus a free annual Leduc Recreation Centre membership for qualifying residents.",
    applyText: "Contact Leduc FCSS about subsidies",
    applyUrl: "https://www.leduc.ca/community/family-community-support-services/housing-financial-support",
    source: "https://www.leduc.ca/community/family-community-support-services/housing-financial-support",
    detail: {
      about: "Leduc Family and Community Support Services can help qualifying residents access reduced transit and recreation costs as part of its housing and financial-navigation support.",
      steps: ["Contact Leduc FCSS for a financial-navigation appointment.", "Ask about the transit and recreation subsidies when discussing your situation.", "Follow their directions for the documents needed to assess eligibility."],
      documents: ["Proof of Leduc residence", "Financial information requested by FCSS"],
      tips: ["Ask specifically about LATS if you use specialized transit.", "The City’s page describes an assessment, so do not assume eligibility until FCSS confirms it."],
      time: "Ask FCSS when you contact them.",
    },
  },
  {
    id: "cochrane-connect-card",
    name: "Cochrane Connect Card",
    level: "Cochrane",
    category: "Getting around & recreation",
    amount: "25% off local transit + 50% off SLS Centre monthly passes",
    summary: "A City card for residents facing financial or situational barriers, with local transit and recreation discounts.",
    requires: ["cochrane", "lowIncome"],
    note: "Cochrane assesses financial and situational need. Book an appointment and bring the requested income and address documents.",
    applyText: "Cochrane Connect Card information",
    applyUrl: "https://www.cochrane.ca/node/241/financial-resources/cochrane-connect-card",
    source: "https://www.cochrane.ca/node/241/financial-resources/cochrane-connect-card",
    detail: {
      about: "The Cochrane Connect Card gives qualifying residents 25% off COLT monthly and 10-ticket transit passes, and 50% off SLS Centre 30-day and monthly passes.",
      steps: ["Book the appointment described on the City’s Connect Card page.", "Bring proof of income and your Cochrane address.", "Ask which current transit and SLS Centre discounts the card gives you."],
      documents: ["Proof of income", "Proof of Cochrane address"],
      tips: ["This is not only an income test; the City also describes situational need.", "Confirm the current eligible passes at your appointment before purchasing."],
      time: "Ask when booking the appointment.",
    },
  },
  {
    id: "okotoks-fee-assistance",
    name: "Okotoks Recreation Fee Assistance",
    level: "Okotoks",
    category: "Recreation",
    amount: "80% off most Town programs, passes and admission",
    summary: "A recreation-fee subsidy for qualifying low-income Okotoks and Foothills County residents.",
    requires: ["okotoks", "lowIncome"],
    note: "The Town describes 80% support for most Town programs, passes and admission. Check current exclusions and camp limits before registering.",
    applyText: "Okotoks recreation fee assistance",
    applyUrl: "https://www.okotoks.ca/your-community/social-well-being/family-community-resources/okotoks-family-resource-centre-7",
    source: "https://www.okotoks.ca/your-community/social-well-being/family-community-resources/okotoks-family-resource-centre-7",
    detail: {
      about: "The Town’s Recreation Fee Assistance Program helps qualifying residents afford most Town recreation programs, passes and admission at an 80% discount.",
      steps: ["Read the Town’s current program information and eligibility rules.", "Apply with the income and residence documents requested.", "Check the program period and any limits before registering for an activity."],
      documents: ["Proof of income", "Proof of Okotoks residence"],
      tips: ["The Town also serves eligible Foothills County residents; confirm the current boundary rule if that is you.", "Ask about exclusions before choosing a camp or program."],
      time: "Ask when you apply.",
    },
  },
  {
    id: "canmore-affordable-services",
    name: "Canmore Affordable Services Program",
    level: "Canmore",
    category: "Getting around & recreation",
    amount: "Discounts on local transit, recreation and community services",
    summary: "A Town program that provides qualifying residents with lower-cost local services, including transit and recreation.",
    requires: ["canmore", "lowIncome"],
    note: "The Town lists discounts across local transit, recreation and community services. Transit discount tiers differ, so confirm the current rate for your household.",
    applyText: "Canmore Affordable Services Program",
    applyUrl: "https://www.canmore.ca/your-community/community-supports-and-services/affordable-services-program",
    source: "https://www.canmore.ca/your-community/community-supports-and-services/affordable-services-program",
    detail: {
      about: "Canmore’s Affordable Services Program provides qualifying residents with discounts on Town and community services, including local transit and recreation.",
      steps: ["Review the Town’s current eligibility and application instructions.", "Apply with the income and residency documents requested.", "Ask which discounts apply to the services you use."],
      documents: ["Proof of income", "Proof of Canmore residence"],
      tips: ["Transit discounts are tiered; the Town page is the source of truth for the current rate.", "Apply before assuming a discount is available for a specific community service."],
      time: "Ask when you apply.",
    },
  },
  {
    id: "lloydminster-recreation-access",
    name: "Lloydminster Recreation Access Program",
    level: "Lloydminster",
    category: "Recreation",
    amount: "$2 adult drop-in admission at City recreation facilities",
    summary: "Income-based recreation access for qualifying Lloydminster residents.",
    requires: ["lloydminster", "lowIncome"],
    note: "The City lists income-based access to City recreation facilities, including $2 adult drop-in admission. Confirm all current discounts when applying.",
    applyText: "Lloydminster Recreation Access Program",
    applyUrl: "https://www.lloydminster.ca/recreation-culture-community/social-programs-and-services/recreation-access-program/",
    source: "https://www.lloydminster.ca/recreation-culture-community/social-programs-and-services/recreation-access-program/",
    detail: {
      about: "Lloydminster’s Recreation Access Program gives qualifying low-income residents reduced-cost access to City recreation facilities.",
      steps: ["Review the City’s current income criteria and application instructions.", "Apply with the documents the City requests.", "Ask the recreation desk which current facility admissions and passes are covered."],
      documents: ["Proof of household income", "Proof of Lloydminster residence"],
      tips: ["Use the official City page to confirm current rates before making plans around a discount.", "Ask whether your household members can be included in the application."],
      time: "Ask when you apply.",
    },
  },
  {
    id: "fortsask-access",
    name: "Fort Saskatchewan Access for Everyone",
    level: "Fort Saskatchewan",
    category: "Getting around & recreation",
    amount: "Free multi-facility membership + reduced local or commuter transit fares",
    summary: "Recreation and transit support for eligible Fort Saskatchewan residents with limited income or approved income support.",
    requires: ["fortsask", "lowIncome"],
    note: "The City lists a fully discounted annual multi-facility membership and an Everyone Rides transit subsidy. It also accepts several approved income-support programs; confirm your route when applying.",
    applyText: "Fort Saskatchewan Access for Everyone",
    applyUrl: "https://www.fortsask.ca/recreation-parks/program-registrations-drop-in-classes/access-for-everyone-program/",
    source: "https://www.fortsask.ca/recreation-parks/program-registrations-drop-in-classes/access-for-everyone-program/",
    detail: {
      about: "Fort Saskatchewan’s Access for Everyone Program combines recreation support with the Everyone Rides transit subsidy for eligible residents.",
      steps: ["Review the City’s current eligibility routes and application instructions.", "Apply with proof of limited income or the approved income-support document that applies to you.", "Ask about both the recreation membership and Everyone Rides transit subsidy."],
      documents: ["Proof of Fort Saskatchewan residence", "Proof of income or approved income support"],
      tips: ["The City lists AISH, CPP Disability, FSCD and Income Support among the approved-program routes; check the current page for full details.", "Ask whether your local or commuter transit trips qualify before buying a pass."],
      time: "Ask when you apply.",
    },
  },
  {
    id: "local-supports",
    name: "Local transit & recreation discounts",
    level: "Your community",
    category: "Getting around & recreation",
    amount: "Varies by community",
    summary:
      "Many cities and towns run their own low-income or disability discounts on transit passes and recreation. 2-1-1 can point you to yours.",
    requires: ["provinceCovered", "cityOther"],
    note:
      "Programs are named and run differently in every community. 2-1-1 is a free, confidential service that finds the ones near you.",
    applyText: "Find supports near me (2-1-1)",
    applyUrl: (a) => TWO_ELEVEN[a.province] || "https://211.ca/",
    source: (a) => TWO_ELEVEN[a.province] || "https://211.ca/",
    detail: {
      about:
        "Beyond the biggest cities, many municipalities offer their own low-income or disability discounts on transit and recreation — but they're all named and delivered differently. 2-1-1 is a free, confidential, 24/7 service that connects you to the specific programs in your community.",
      steps: [
        "Visit your provincial 2-1-1 site, or simply dial 2-1-1 from any phone.",
        "Tell them your town and what you need (transit, recreation, financial help).",
        "They'll point you to the exact local programs and how to apply.",
      ],
      documents: [
        "Your city or town name",
        "A rough idea of your household income",
      ],
      tips: [
        "Dialing 2-1-1 is free and available 24/7 in many languages.",
        "Also search your town's own website for 'recreation fee assistance' or 'low-income transit pass'.",
      ],
      time: "Immediate — it's an information service.",
      phone: "Dial 2-1-1",
    },
  },

  /* ---- British Columbia (hidden until BC_ENABLED) ---- */
  {
    "id": "bc-disability-assistance-pwd",
    "needsPractitioner": true,
    "name": "BC Disability Assistance (PWD)",
    "level": "British Columbia",
    "category": "Money",
    "amount": "Up to $1,483.50/month single ($983.50 support + $500 shelter) plus $52/month transportation supplement; up to $2,662/month for a couple where both have PWD",
    "summary": "Monthly income support for adults with the Persons with Disabilities (PWD) designation — a support allowance plus shelter allowance, an automatic $52 transportation supplement, and full health supplements and PharmaCare Plan C coverage.",
    "requires": ["bc", "adult", "severePermanent", "lowIncome"],
    "note": "Rates effective December 1, 2025 (re-verified July 2026 — $1,483.50 single is still the current maximum). In 2026 you can also earn up to $16,200/year from work before earnings reduce your payment ($23,400 couple with one PWD, $32,400 both PWD).",
    "applyText": "Apply on My Self Serve",
    "applyUrl": "https://myselfserve.gov.bc.ca/",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/disability-assistance-rate-table",
    "verified": "2026-07-20",
    "detail": {
      "about": "Disability assistance is BC's core income program for people with the PWD designation. A single person receives a $983.50 monthly support allowance plus actual shelter costs up to $500, and every PWD recipient gets a $52 transportation supplement as cash or an in-kind bus pass. It also opens the door to dental, optical, medical equipment, medical transportation and nutrition supplements, and 100% drug coverage under PharmaCare Plan C.",
      "steps": ["Create an account at myselfserve.gov.bc.ca (or call 1-866-866-0800) and complete the online application so the ministry can check financial eligibility", "Request the PWD designation application and complete the applicant section (form HR2883)", "Have your doctor or nurse practitioner complete the medical report section", "Have a doctor, nurse practitioner or prescribed professional (e.g., occupational therapist, social worker) complete the assessor report", "Submit everything and respond to any ministry follow-up; once the designation is approved and you are financially eligible, payments begin", "Report income and changes monthly as required to keep payments accurate"],
      "documents": ["ID and Social Insurance Number for all adults in the family unit", "Bank statements and details of assets and income", "Rent receipt, lease or proof of shelter costs", "Completed PWD application (applicant, medical and assessor sections)"],
      "tips": ["Already on CPP Disability, Community Living BC, the At Home Program, PharmaCare Plan P (palliative) or ISC PWD? A simplified prescribed-class application (HR3642) skips most of the medical paperwork", "The $52 transportation supplement can be taken as a BC Bus Pass instead of cash — choose whichever you actually use", "PWD has higher asset limits than regular income assistance, so savings do not disqualify you as quickly", "At 65 most recipients transition to federal Old Age Security and GIS — the ministry will contact you before then"],
      "time": "Financial eligibility is usually confirmed within days; the PWD designation decision commonly takes several weeks to a few months once all three report sections are submitted",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-autism-funding-under-6",
    "needsPractitioner": true,
    "name": "Autism Funding: Under Age 6",
    "level": "British Columbia",
    "category": "Money",
    "amount": "Up to $22,000/year",
    "summary": "Direct annual funding to buy autism intervention services (behaviour consultants, therapists, supervised behaviour interventionists) for children under 6 with an autism diagnosis.",
    "requires": ["bc", "child"],
    "requiresNote": "Child under age 6 with an autism spectrum disorder diagnosis meeting BC standards (BCAAN or qualified private assessment)",
    "note": "The Autism Funding program continues unchanged and accepts new applications until March 2027, then is replaced by the new BC Children and Youth Disability Benefit. Families already receiving Autism Funding start transitioning automatically in July 2026 — the ministry contacts you, no reapplication needed. This program is being replaced: it accepts new applications until March 2027 and ends March 31, 2027. The Children and Youth Disability Benefit is taking over.",
    "applyText": "Apply for autism funding",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/autism-funding/apply",
    "source": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/autism-funding/funding-amount",
    "verified": "2026-07-20",
    "detail": {
      "about": "Up to $22,000 per year per child, spent on professionals listed on the Registry of Autism Service Providers (RASP) and behaviour interventionists supervised by a RASP professional. Also covers family counselling from certified counsellors, psychologists, social workers or psychiatrists, employment-related costs when you hire staff, and administrative costs up to $100/month. Up to 20% of the allocation can go to training, travel and equipment (TTE); the allocation may be prorated in your first funding period.",
      "steps": ["Get an autism diagnosis through the BC Autism Assessment Network (BCAAN, free via physician referral) or a private assessment meeting BC standards", "Register for a Basic BCeID account to apply online, or complete the paper Application for Autism Funding", "Email the application and supporting documents to mcf.autismfundingintake@gov.bc.ca or submit through your local CYSN office", "Sign the funding agreement, then choose RASP-listed providers and submit invoices or reimbursement claims"],
      "documents": ["Diagnostic report confirming autism spectrum disorder", "Confirmation of Previous Diagnosis of Autism Spectrum Disorder form (CF0905) if diagnosed elsewhere", "Child's Personal Health Number and proof of BC residency", "Basic BCeID account for online applications"],
      "tips": ["Providers must be on the RASP registry for children under 6 — search it before hiring", "Reserve part of the budget for the 20% travel/training/equipment allowance if you need tablets, AAC apps or workshop fees", "Unspent funds do not roll over indefinitely — plan spending across the funding year", "From July 2026 the ministry contacts Autism Funding families about moving to the new Disability Benefit ($6,500 or $17,000/year); you keep current funding until your transition date"],
      "time": "New applications accepted until March 2027; funding starts after the agreement is signed. BCAAN assessment wait lists are long — private assessment is faster but paid out of pocket.",
      "phone": "1-877-777-3530"
    }
  },
  {
    "id": "bc-autism-funding-6-18",
    "needsPractitioner": true,
    "name": "Autism Funding: Ages 6-18",
    "level": "British Columbia",
    "category": "Money",
    "amount": "Up to $6,000/year",
    "summary": "Annual funding for autism intervention, therapies, life-skills programs, camps and out-of-school tutoring for children and youth aged 6 to 18.",
    "requires": ["bc", "child"],
    "requiresNote": "Child or youth aged 6-18 with an autism spectrum disorder diagnosis meeting BC standards",
    "note": "Program runs until March 31, 2027, then is replaced by the BC Children and Youth Disability Benefit. Current families transition automatically starting July 2026 — the ministry will contact you. New applications are still accepted until March 2027. This program is being replaced: it accepts new applications until March 2027 and ends March 31, 2027. The Children and Youth Disability Benefit is taking over.",
    "applyText": "Apply for autism funding",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/autism-funding/apply",
    "source": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/autism-funding/funding-amount",
    "verified": "2026-07-20",
    "detail": {
      "about": "Up to $6,000 per year per child for behaviour consultants or analysts, speech-language pathologists, occupational or physical therapists, behaviour interventionists, life skills and social skills programs, out-of-school learning support and tutoring, dietary counselling from registered dieticians, family counselling, and specialized therapeutic camps for autism. Administrative costs up to $50/month (or $600 per period for an accountant) and up to 20% for training, travel and equipment.",
      "steps": ["Have an autism diagnosis on file (BCAAN or qualified private assessment)", "Apply online with a Basic BCeID or send the Application for Autism Funding to mcf.autismfundingintake@gov.bc.ca, or go through your local CYSN office", "Sign the funding agreement and hire qualified providers", "Submit invoices for direct payment or claim reimbursements"],
      "documents": ["Diagnostic report or CF0905 confirmation form", "Child's Personal Health Number", "Basic BCeID account for the online portal"],
      "tips": ["For ages 6-18 providers do not have to be RASP-listed for every service type, so therapy, tutoring and camps are easier to fund than under the Under-6 program", "Specialized autism camps and social-skills groups are eligible — get receipts", "The new Disability Benefit will pay $6,500 (base) or $17,000 (higher tier), so most transitioning families see an increase from the current $6,000", "Ask your CYSN office about the transition schedule if you have not been contacted by fall 2026"],
      "time": "New applications accepted until March 2027; existing families move to the Disability Benefit in phases from July 2026 through March 2027.",
      "phone": "1-877-777-3530"
    }
  },
  {
    "id": "bc-cy-disability-benefit",
    "needsPractitioner": true,
    "name": "BC Children and Youth Disability Benefit",
    "level": "British Columbia",
    "category": "Money",
    "amount": "$6,500 or $17,000/year",
    "summary": "New direct-funding benefit for children and youth up to age 19 with significant disabilities of any diagnosis (autism, Down syndrome, cerebral palsy, intellectual disability and more) — replacing Autism Funding and At Home respite/SAET streams.",
    "requires": ["bc", "child", "severePermanent"],
    "requiresNote": "Ages 0-19 with a long-term disability causing significant and complex developmental support needs, based on diagnosis and/or functional impact",
    "note": "Starts April 1, 2026 for families already receiving ministry services for children and youth with support needs; they do not need to apply. The benefit will be available province-wide by April 1, 2027.",
    "applyText": "Learn about the Disability Benefit",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/financial-supports/disability-benefit",
    "source": "https://news.gov.bc.ca/releases/2026CFD0002-000136",
    "verified": "2026-07-20",
    "detail": {
      "about": "Two funding tiers: a base tier of $6,500/year and a higher tier of $17,000/year set through support planning with a ministry worker. Funding covers disability-related expenses including respite, paediatric therapies, behavioural intervention, and assistive and augmentative communication supports. Eligibility is needs-based, not diagnosis-specific: direct admission for conditions such as moderate-to-profound intellectual disability, autism with intellectual disability, and degenerative conditions, plus a needs-based clinical review pathway for rare or atypical cases. Part of a $475-million, three-year provincial investment that also expands free community services (therapies from spring 2026, behaviour and mental-health supports 2027, navigation and school-aged programming 2027-2028).",
      "steps": ["Already receiving Autism Funding, At Home respite or SAET: wait to be contacted — a ministry worker manages your transition between April 2026 and March 2027", "Not yet in a program: apply through the current pathways (Autism Funding or At Home Program) before March 2027 and you will move to the Disability Benefit automatically in April 2027", "From April 1, 2027: apply directly to the Disability Benefit", "Work with a ministry worker on support planning if your child may qualify for the $17,000 higher tier"],
      "documents": ["Existing program enrolment (for automatic transition), or", "Diagnostic reports and functional assessments showing significant support needs (communication, cognitive/adaptive functioning, safety or behavioural complexity)"],
      "tips": ["Do not wait for 2027 — applying to Autism Funding or the At Home Program now locks in an automatic transition", "Funding is flexible across respite, therapy, behaviour intervention and AAC rather than tied to one diagnosis stream", "Services outside British Columbia and unresearched interventions are not eligible uses", "Call the CYSN Resource Line (1-833-882-0024) or your local CYSN office to discuss eligibility today"],
      "time": "Transition runs April 2026 to March 2027; open to direct applications April 1, 2027.",
      "phone": "1-844-442-2800"
    }
  },
  {
    "id": "bc-monthly-nutritional-supplement",
    "needsPractitioner": true,
    "name": "Monthly Nutritional Supplement",
    "level": "British Columbia",
    "category": "Health",
    "amount": "Up to $180/month for dietary items plus up to $45/month for vitamins or minerals",
    "summary": "Extra monthly money on top of disability assistance for PWD recipients whose severe condition causes a chronic, progressive deterioration of health and who need supplemental nutrition to avoid serious decline.",
    "requires": ["bc", "adult", "severePermanent", "lowIncome"],
    "note": "A practitioner must confirm at least two symptoms such as malnutrition, underweight status, significant weight loss, significant muscle-mass loss, significant neurological degeneration, deterioration of a vital organ, or moderate-to-severe immune suppression.",
    "applyText": "Get form HR2847 (PDF)",
    "applyUrl": "https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/policies-for-government/bc-employment-assistance-policy-procedure-manual/forms/pdfs/hr2847.pdf",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/health-supplements-and-programs-rate-table",
    "verified": "2026-07-20",
    "detail": {
      "about": "The MNS is for people on disability assistance with the PWD designation who have a severe medical condition causing chronic, progressive deterioration of health with wasting-type symptoms, and who need additional nutritional items or vitamins and minerals to prevent imminent danger to life. Current maximums (Health Supplements & Programs rate table, effective August 1, 2023) are $180/month for dietary items and $45/month for vitamins or minerals.",
      "steps": ["Get form HR2847 (Application for Monthly Nutritional Supplement) from your ministry office, My Self Serve or the link above", "Complete Part B yourself", "Have a medical practitioner, nurse practitioner or registered dietitian complete Part C describing your condition, symptoms and the items needed", "Submit the form; the ministry's Health Assistance staff review and decide"],
      "documents": ["Form HR2847 with the practitioner or dietitian section completed"],
      "tips": ["A registered dietitian can complete Part C — often faster than waiting for a specialist appointment", "Be specific about each symptom: two or more must be documented for approval", "If denied, request reconsideration — MNS denials are frequently overturned with better medical detail"],
      "time": "Typically a few weeks after the ministry receives the completed form",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-optical-supplement",
    "name": "Optical Supplements (Glasses & Eye Exams)",
    "level": "British Columbia",
    "category": "Health",
    "amount": "Routine eye exam up to $44.83 with an optometrist or $48.90 with an ophthalmologist once every 2 years; new prescription glasses at the ministry's maximum rates, plus lens replacements when your prescription changes",
    "summary": "Eye exams and prescription eyewear for everyone on income or disability assistance — show your BC Services Card at any eye clinic and the ministry pays the optometrist or optician directly.",
    "requires": ["bc", "lowIncome"],
    "note": "Children's routine eye exams are already covered by MSP — the supplement pays for their glasses. Costs above the ministry's fee schedule are your responsibility, so ask the clinic first.",
    "applyText": "See what's covered",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/family-social-supports/income-assistance/on-assistance/supplements/optical",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/health-supplements-and-programs-rate-table",
    "verified": "2026-07-20",
    "detail": {
      "about": "Everyone receiving income or disability assistance gets specified optical services: routine eye exams for adults ($44.83 with an optometrist or $48.90 with an ophthalmologist every two years), new eyeglasses up to ministry maximum rates, lens replacement when a prescription changes, and repairs to frames and lenses. Payment goes straight from the ministry to the optometrist or optician.",
      "steps": ["Take your BC Services Card to any eye clinic", "The clinic verifies your coverage through Pacific Blue Cross", "Get your exam and choose frames within the ministry rate (or pay the difference)", "The ministry pays the provider directly"],
      "documents": ["BC Services Card"],
      "tips": ["Ask the clinic which frames are fully covered at ministry rates before choosing", "If your prescription changes, replacement lenses are covered even between exam cycles"],
      "time": "No application — coverage verified at the clinic on the spot",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-bus-pass",
    "name": "BC Bus Pass Program",
    "level": "British Columbia",
    "category": "Transit",
    "amount": "$45 per year",
    "summary": "Annual bus pass for people on BC disability assistance and low-income seniors, valid on scheduled BC Transit services provincewide and issued as a Compass Card for Metro Vancouver.",
    "requires": ["bc", "lowIncome"],
    "requiresNote": "For people receiving BC disability assistance (PWD designation). Low-income seniors also qualify: GIS recipients, 60-64 year olds on provincial income assistance, and 65+ who would get GIS but for residency rules.",
    "note": "The fee is $45 per year. PWD recipients should confirm with the program how the pass affects their $52/month transportation supplement.",
    "applyText": "Request via My Self Serve or call 1-866-866-0800",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/transportation/passenger-travel/buses-taxis-limos/bus-pass/people-with-disabilities",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/general-supplements-and-programs-rate-table",
    "verified": "2026-07-20",
    "detail": {
      "about": "The BC Bus Pass Program provides an annual pass for eligible people with the PWD designation receiving disability assistance and for eligible low-income seniors. The pass gives travel on scheduled BC Transit bus services across the province and comes as a Compass Card usable on TransLink in Metro Vancouver. The fee is $45 per year. PWD recipients should confirm with the program how the pass affects their $52/month transportation supplement.",
      "steps": ["Confirm that you meet the PWD or low-income senior eligibility rules", "Ask the program how receiving the pass will affect your $52/month transportation supplement if you receive PWD disability assistance", "Request the pass through My Self Serve or by calling 1-866-866-0800", "Allow up to 6 weeks for the pass to arrive"],
      "documents": ["No new documents if you already receive disability assistance — just your request", "Seniors stream: SIN, name, date of birth, address and contact details"],
      "tips": ["The pass works in BC Transit communities across the whole province, not just your home city", "BC Transit enabled digital tap validation for BC Bus Pass holders in Umo-equipped communities starting fall 2025", "Replacement passes for lost or stolen cards may carry a fee — report them promptly", "PWD recipients should confirm directly with the program how the pass affects the monthly transportation supplement"],
      "time": "Allow up to 6 weeks for the pass to arrive",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "sparc-parking-permit",
    "needsPractitioner": true,
    "name": "Accessible Parking Permit (SPARC BC)",
    "level": "British Columbia",
    "category": "Parking",
    "amount": "Fees are set by SPARC BC; confirm the current fee on their site. Permanent permits are valid 3 years; temporary permits are valid 1-12 months and are not renewable.",
    "summary": "BC's accessible parking placard for people with mobility limitations — hang it from the rear-view mirror and it's valid whether you're driving or riding as a passenger.",
    "requires": ["bc"],
    "requiresNote": "Mobility limitation confirmed by a medical professional — for example you use a wheelchair or a mobility aid like a cane or crutches, or your health prevents you from walking far. You don't need to own a vehicle.",
    "note": "SPARC BC is the non-profit that administers BC's permit program. Fees are set by SPARC BC; confirm the current fee and any available hardship assistance on its site.",
    "applyText": "Apply through SPARC BC",
    "applyUrl": "https://www.sparc.bc.ca/parking-permits/",
    "source": "https://www.sparc.bc.ca/parking-permits/",
    "verified": "2026-07-20",
    "detail": {
      "about": "SPARC BC issues the accessible parking permits recognized in designated spaces across British Columbia. Three types exist: permanent (valid 3 years, renewable), temporary (1 to 12 months, not renewable — reapply if still needed), and conditional (3 years, not renewable). The permit belongs to the person, not a car, and must be displayed on the rear-view mirror while parked.",
      "steps": ["Download the application form from sparc.bc.ca or call 604-718-7744 / 1-888-718-7794 for a copy", "Have the referral section completed by a medical professional with a valid MSP number", "Check SPARC BC's site for the current fee and submit it with the application; ask about hardship assistance if needed", "Allow 2 to 3 weeks for processing", "Display the permit on the rear-view mirror whenever parked in an accessible space"],
      "documents": ["Application form including the medical professional referral section", "Payment of the current fee listed by SPARC BC, unless hardship assistance applies"],
      "tips": ["The permit is yours, not the vehicle's — use it in any car you drive or ride in", "Renew permanent permits online at online.sparc.bc.ca before they expire; expired permits can't be renewed online", "Temporary permits can't be renewed — submit a new application if you still need one", "Email permits@sparc.bc.ca with questions"],
      "time": "2 to 3 weeks from when your application is received",
      "phone": "604-718-7744 or toll-free 1-888-718-7794"
    }
  },
  {
    "id": "bc-medical-equipment-devices",
    "needsPractitioner": true,
    "name": "Medical Equipment & Devices Supplement",
    "level": "British Columbia",
    "category": "Equipment",
    "amount": "Full cost of pre-approved equipment — e.g., scooters up to $3,500 ($4,500 bariatric), floor/ceiling lifts up to $4,200; wheelchairs, walkers, hospital beds and bathing aids at ministry rates",
    "summary": "The ministry buys, repairs and replaces essential medical equipment — canes to power wheelchairs, hospital beds, transfer aids, pressure-relief mattresses, specialized glucose meters — for people on assistance with no other way to pay.",
    "requires": ["bc", "lowIncome"],
    "note": "Pre-approval is mandatory: the ministry must approve the request before purchase, and it is the payer of last resort — you must show no other program (ICBC, WorkSafeBC, extended health) can pay.",
    "applyText": "Request via My Self Serve",
    "applyUrl": "https://myselfserve.gov.bc.ca/",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/health-supplements-and-programs/medical-equipment-and-devices",
    "verified": "2026-07-20",
    "detail": {
      "about": "Covered items include canes, crutches, walkers, manual and power wheelchairs, scooters, grab bars, bath seats, commodes, lift devices, hospital beds, pressure-relief mattresses and non-conventional glucose meters. A prescription from a doctor or nurse practitioner is required, and many items also need an occupational or physical therapist assessment. Most equipment can be replaced every five years (wheelchair seating after two; canes, crutches and walkers as needed). Recreational scooters, lift chairs and automatic beds are excluded.",
      "steps": ["Contact the ministry through My Self Serve or 1-866-866-0800 to start an equipment request", "Get a prescription from your doctor or nurse practitioner", "Complete an occupational or physical therapist assessment where required (wheelchairs, seating, scooters, lifts)", "Submit supplier quote(s); wait for written ministry pre-approval", "The ministry pays the supplier directly; repairs are requested the same way"],
      "documents": ["Doctor or nurse practitioner prescription", "Occupational/physical therapist assessment for mobility and positioning items", "Supplier quote"],
      "tips": ["Never buy first — equipment purchased before pre-approval is not reimbursed", "Ask your OT to note why the least-expensive option would not meet your medical need if you require specific features", "Repairs and batteries can be covered between replacement cycles"],
      "time": "Weeks to a couple of months depending on assessments, quotes and pre-approval",
      "phone": "1-866-866-0800"
    }
  }

];
