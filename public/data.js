/* =============================================================================
   ABILITYFINDER DATA — Alberta (all disabilities) + federal + municipal
   - DISABILITIES: the categories a user can pick.
   - BENEFITS: declarative. Eligibility LOGIC lives in app.js (see REQS).
   Each benefit has a `detail` object: plain-language guidance shown ON our site
   so users aren't lost on the confusing government pages.
   Facts/amounts current as of 2025–2026 from official sources (`source`).
   ========================================================================== */

/* ------------------------------------------------------ disability options */
const DISABILITIES = [
  { value: "adhd", icon: "adhd", label: "ADHD / attention" },
  { value: "autism", icon: "autism", label: "Autism spectrum" },
  { value: "learning", icon: "learning", label: "Learning disability", sub: "dyslexia, dyscalculia…" },
  { value: "intellectual", icon: "intellectual", label: "Intellectual / developmental" },
  { value: "mental", icon: "mental", label: "Mental health", sub: "anxiety, depression, PTSD, bipolar…" },
  { value: "physical", icon: "physical", label: "Physical / mobility", sub: "MS, cerebral palsy, spinal, arthritis…" },
  { value: "chronic", icon: "chronic", label: "Chronic illness / pain", sub: "diabetes, Crohn's, fibromyalgia, cancer…" },
  { value: "vision", icon: "vision", label: "Vision loss / blindness" },
  { value: "hearing", icon: "hearing", label: "Hearing loss / Deaf" },
  { value: "speech", icon: "speech", label: "Speech / communication" },
  { value: "braininjury", icon: "braininjury", label: "Brain injury", sub: "stroke, concussion, TBI" },
  { value: "other", icon: "other", label: "Something else / not listed" },
];

/* Disability groups used by benefit targeting */
const EQUIP_NEED = ["physical", "chronic", "vision", "hearing", "speech", "braininjury"];

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

/* ALBERTA-ONLY for now. Other provinces/territories (cities, map entries and
   benefit programs) are parked in data-provinces-later.js and will be
   re-integrated once the Alberta feature set is complete. */
const CITIES_BY_PROVINCE = { AB: ALBERTA_CITIES };
const COVERED_PROVINCES = ["AB"];

/* national fallbacks (used when a jurisdiction isn't in the maps yet) */
const FED_STUDENT_AID = "https://www.canada.ca/en/employment-social-development/services/education/grants/disabilities.html";
const NATIONAL_211 = "https://211.ca/";

const STUDENT_AID = { AB: "https://studentaid.alberta.ca/" };
const TWO_ELEVEN = { AB: "https://ab.211.ca/" };
const EMPLOYMENT = { AB: "https://www.alberta.ca/disability-related-employment-supports" };

/* =============================================================================
   STRUCTURED VALUE MODEL (Phase 1) — approximate dollar value per benefit, so we
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
  aish: { kind: "cash", monthlyMax: 1901, annualMax: 22812 },
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
  "local-supports": { kind: "discount", note: "varies by community" },
};

/* difficulty (1 easy … 5 hard), effort to apply, and typical wait to hear back */
const BENEFIT_META = {
  dtc: { difficulty: 3, effort: "30–60 min + a doctor visit", wait: "8–20 weeks" },
  "cdb-adult": { difficulty: 2, effort: "15–30 min (after DTC)", wait: "monthly once approved" },
  "child-disability-benefit": { difficulty: 1, effort: "Automatic after DTC + CCB", wait: "next CCB payment" },
  rdsp: { difficulty: 2, effort: "~1 hr at a bank/credit union", wait: "same day to open" },
  "cwb-disability": { difficulty: 1, effort: "Claimed on your tax return", wait: "at tax time" },
  "cpp-disability": { difficulty: 5, effort: "2–4 hrs + a doctor's report", wait: "~4 months" },
  "csg-disability": { difficulty: 2, effort: "With your student aid application", wait: "with student aid" },
  "csg-dse": { difficulty: 2, effort: "Student aid + quotes for equipment", wait: "with student aid" },
  aish: { difficulty: 4, effort: "2–3 hrs + a doctor's form", wait: "6–12 weeks" },
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
  "local-supports": { difficulty: 1, effort: "Call 2-1-1", wait: "immediate" },
};

/* =============================================================================
   PHASE 2 — eligibility depth & trust. Per-benefit:
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
    taxNote: "AISH isn't taxable, but other income (like CPP-D, or earnings above the monthly exemption) reduces your payment. You must apply for CPP-D if you might qualify.",
    denials: [
      "The condition wasn't shown to be permanent, or was expected to improve with treatment.",
      "The medical didn't tie the disability to an inability to earn a living.",
      "Income or assets over the limit.",
      "Hadn't first applied for other benefits like CPP-D.",
    ],
    appeal: "You can appeal to the Citizen's Appeal Panel — usually within 30 days. An advocate (e.g. Voice of Albertans with Disabilities) can help strengthen the medical evidence.",
    faqs: [
      { q: "Can I work and keep AISH?", a: "Yes — you can earn a set amount each month before it affects your payment, and only part of income above that reduces AISH." },
      { q: "Do I need the DTC first?", a: "No, AISH is separate — but the DTC, CPP-D and RDSP are all worth applying for too." },
      { q: "What assets can I keep?", a: "Your home, one vehicle, an RDSP, and some other assets are exempt." },
    ],
    related: ["dtc", "cpp-disability", "aadl", "adult-health-benefit"],
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
    faqs: [{ q: "Do I need to own a car?", a: "No — the placard belongs to you and works in any vehicle you're travelling in." }],
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
   HUMAN-HELP DIRECTORY (Phase 3)
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
    url: "https://inclusionalberta.org/individuals-families/rdsp/",
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
    amount: "Up to ~$1,901 / month + health & other benefits",
    summary:
      "Alberta's main disability income program — a monthly living allowance plus health coverage.",
    requires: ["adult", "ab", "citizenPR", "severePermanent", "lowIncome"],
    note:
      "AISH requires a SEVERE, PERMANENT disability that substantially limits your ability to earn a living. Approval is strict, but worth applying if that describes you. From July 2026 a single application also considers you for the new Alberta Disability Assistance Program.",
    applyText: "Check AISH eligibility & apply",
    applyUrl: "https://www.alberta.ca/aish",
    source: "https://www.alberta.ca/aish-eligibility",
    detail: {
      about:
        "A monthly living allowance for Alberta adults whose severe, permanent disability substantially limits their ability to work. It also comes with health benefits (prescriptions, dental, optical) and other supports.",
      steps: [
        "Read the eligibility page to confirm you likely qualify.",
        "Complete Part A (you) of the application; your doctor completes Part B (medical).",
        "Submit to an AISH office; you'll usually meet with a caseworker.",
      ],
      documents: [
        "Medical report showing a severe, permanent impairment",
        "Proof of Alberta residency + Canadian citizenship / PR",
        "Financial details (income and assets)",
      ],
      tips: [
        "The medical form should focus on how your condition limits your ability to EARN A LIVING, not just the diagnosis.",
        "There's a financial test — some assets (like your home and vehicle) are exempt.",
        "If ADHD/mental health is your only condition, pair it with any other diagnoses and be detailed about work impact.",
      ],
      time: "Can take several months; apply early.",
      phone: "Alberta Supports: 1-877-644-9992",
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
        "A doctor, nurse practitioner, or in some cases other practitioners can certify it.",
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

];
