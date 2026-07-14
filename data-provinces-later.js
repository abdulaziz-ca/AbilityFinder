/* =============================================================================
   PARKED — other provinces & territories (NOT loaded by the app right now).
   The app is Alberta-only while we build out the Phase-1 feature set. When
   Alberta is complete, re-integrate this into data.js:

   1) Add these city arrays back, and extend CITIES_BY_PROVINCE + COVERED_PROVINCES.
   2) Merge the STUDENT_AID / TWO_ELEVEN / EMPLOYMENT entries below into those maps.
   3) Spread OTHER_PROVINCE_BENEFITS into the BENEFITS array.
   4) In app.js: restore the full province list in the residency step, and add the
      per-province REQS keys (bc/on/qc/mb/sk/ns/nb/nl/pe/yt/nt/nu) — they already
      exist in app.js, so only the residency options + this data need restoring.

   Every benefit + link here was researched & verified during the multi-province
   build (see git history / prior notes).
   ========================================================================== */

/* ---- city lists (pop > 10,000 largest municipalities) ---- */
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
const ON_CITIES = [
  "Ajax", "Aurora", "Barrie", "Belleville", "Bradford", "Brampton", "Brantford",
  "Burlington", "Caledon", "Cambridge", "Chatham-Kent", "Clarington",
  "Cobourg", "Collingwood", "Cornwall", "Fort Erie", "Georgina", "Grimsby",
  "Guelph", "Halton Hills", "Hamilton", "Innisfil", "Kingston", "Kitchener",
  "Leamington", "London", "Markham", "Milton", "Mississauga", "Newmarket",
  "Niagara Falls", "North Bay", "Oakville", "Orangeville", "Orillia", "Oshawa",
  "Ottawa", "Peterborough", "Pickering", "Richmond Hill", "Sarnia",
  "Sault Ste. Marie", "St. Catharines", "St. Thomas", "Stratford", "Sudbury",
  "Thunder Bay", "Timmins", "Toronto", "Vaughan", "Waterloo", "Welland",
  "Whitby", "Windsor", "Woodstock",
  "Other / my town isn't listed",
];
const QC_CITIES = [
  "Alma", "Beloeil", "Blainville", "Boisbriand", "Boucherville", "Brossard",
  "Chambly", "Châteauguay", "Côte-Saint-Luc", "Dollard-des-Ormeaux",
  "Drummondville", "Gatineau", "Granby", "Laval", "Lévis", "Longueuil",
  "Magog", "Mascouche", "Mirabel", "Montreal", "Quebec City", "Repentigny",
  "Rimouski", "Rouyn-Noranda", "Saguenay", "Saint-Bruno-de-Montarville",
  "Saint-Eustache", "Saint-Hyacinthe", "Saint-Jean-sur-Richelieu",
  "Saint-Jérôme", "Sainte-Julie", "Salaberry-de-Valleyfield", "Sept-Îles",
  "Shawinigan", "Sherbrooke", "Sorel-Tracy", "Terrebonne", "Thetford Mines",
  "Trois-Rivières", "Val-d'Or", "Vaudreuil-Dorion", "Victoriaville",
  "Autre / ma ville n'est pas listée",
];
const MB_CITIES = ["Winnipeg", "Brandon", "Steinbach", "Winkler", "Portage la Prairie", "Selkirk", "Morden", "Dauphin", "Thompson", "The Pas", "Other / my town isn't listed"];
const SK_CITIES = ["Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current", "Yorkton", "North Battleford", "Estevan", "Weyburn", "Warman", "Martensville", "Lloydminster", "Other / my town isn't listed"];
const NS_CITIES = ["Halifax", "Sydney (Cape Breton)", "Truro", "New Glasgow", "Amherst", "Kentville", "Bridgewater", "Yarmouth", "Other / my town isn't listed"];
const NB_CITIES = ["Moncton", "Saint John", "Fredericton", "Dieppe", "Riverview", "Miramichi", "Edmundston", "Bathurst", "Campbellton", "Other / my town isn't listed"];
const NL_CITIES = ["St. John's", "Conception Bay South", "Mount Pearl", "Corner Brook", "Paradise", "Grand Falls-Windsor", "Gander", "Happy Valley-Goose Bay", "Other / my town isn't listed"];
const PE_CITIES = ["Charlottetown", "Summerside", "Stratford", "Cornwall", "Other / my town isn't listed"];
const YT_CITIES = ["Whitehorse", "Dawson City", "Watson Lake", "Other / my community isn't listed"];
const NT_CITIES = ["Yellowknife", "Hay River", "Inuvik", "Fort Smith", "Behchokǫ̀", "Other / my community isn't listed"];
const NU_CITIES = ["Iqaluit", "Rankin Inlet", "Arviat", "Baker Lake", "Cambridge Bay", "Other / my community isn't listed"];

/* ---- map entries to merge back ---- */
const STUDENT_AID_OTHER = {
  BC: "https://studentaidbc.ca/",
  ON: "https://www.ontario.ca/page/osap-ontario-student-assistance-program",
  QC: "https://www.quebec.ca/en/education/student-financial-assistance",
  MB: "https://www.edu.gov.mb.ca/manitobastudentaid/",
  SK: "https://www.saskatchewan.ca/residents/education-and-learning/student-loans",
  NS: "https://novascotia.ca/studentassistance/",
  YT: "https://yukon.ca/en/student-disability-grants",
};
const TWO_ELEVEN_OTHER = {
  BC: "https://bc.211.ca/", ON: "https://211ontario.ca/", QC: "https://www.211quebec.ca/en",
  MB: "https://mb.211.ca/", SK: "https://sk.211.ca/", NS: "https://ns.211.ca/", NB: "https://nb.211.ca/",
  NL: "https://nl.211.ca/", PE: "https://pe.211.ca/", NT: "https://nt.211.ca/", NU: "https://nu.211.ca/", YT: "https://211.ca/",
};
const EMPLOYMENT_OTHER = {
  BC: "https://www.workbc.ca/plan-career/resources/people-disabilities",
  ON: "https://www.ontario.ca/page/ontario-disability-support-program-employment-supports",
  QC: "https://www.quebec.ca/en/people-with-disabilities/employment-and-adapted-jobs",
};

/* ---- provincial/territorial benefit programs ---- */
const OTHER_PROVINCE_BENEFITS = [
  /* ------------------------------------------------- BRITISH COLUMBIA */
  {
    id: "bc-disability-assistance",
    needsPractitioner: true,
    name: "BC Disability Assistance (PWD)",
    level: "British Columbia",
    category: "Money",
    amount: "Up to ~$1,483.50 / month + health supplements",
    summary:
      "BC's monthly disability assistance for people with the Persons with Disabilities (PWD) designation.",
    requires: ["bc", "adult", "lowIncome"],
    note:
      "You first need the PWD designation (a form your doctor and you complete). It comes with health coverage, a bus pass option, and higher earnings exemptions.",
    applyText: "BC Disability Assistance",
    applyUrl: "https://www2.gov.bc.ca/gov/content/family-social-supports/services-for-people-with-disabilities/disability-assistance",
    source: "https://www2.gov.bc.ca/gov/content/family-social-supports/services-for-people-with-disabilities/disability-assistance",
    detail: {
      about:
        "Monthly financial support for BC residents with the Persons with Disabilities (PWD) designation who have limited income and assets. It includes health supplements and access to the annual bus pass.",
      steps: [
        "Apply for income/disability assistance through the Ministry (online via My Self Serve).",
        "Complete the PWD Designation Application — your part plus a prescribed professional's assessment.",
        "Once designated, your monthly rate increases and supplements open up.",
      ],
      documents: [
        "PWD Designation Application (with a doctor/nurse practitioner assessment)",
        "Proof of BC residency and income/assets",
      ],
      tips: [
        "The PWD designation is the key step — it also has generous earnings exemptions so you can work part-time.",
        "If you already get CPP-D or the DTC, mention it; some criteria can be met automatically.",
      ],
      time: "Assessment can take several weeks.",
      phone: "BC: 1-866-866-0800",
    },
  },
  {
    id: "bc-bus-pass",
    name: "BC Bus Pass Program",
    level: "British Columbia",
    category: "Getting around",
    amount: "Annual bus pass for $45/year (or $52/mo transportation supplement)",
    summary:
      "A low-cost annual transit pass for people on disability assistance with the PWD designation.",
    requires: ["bc", "lowIncome"],
    note:
      "For people receiving disability assistance. You can take the bus pass OR a $52/month transportation supplement in cash — your choice.",
    applyText: "BC Bus Pass Program",
    applyUrl: "https://www.gov.bc.ca/buspassprogram",
    source: "https://www2.gov.bc.ca/gov/content/transportation/passenger-travel/buses-taxis-limos/bus-pass/people-with-disabilities",
    detail: {
      about:
        "An annual transit pass (valid on most BC transit systems) for $45/year for people with the PWD designation who receive disability assistance. Alternatively you can take the transportation supplement as $52/month in cash.",
      steps: [
        "Make sure you have the PWD designation and receive disability assistance.",
        "Request the bus pass from the Ministry by the 5th of the month.",
        "Pay the $45 annual administration fee.",
      ],
      documents: ["PWD designation + disability assistance", "BC ID"],
      tips: [
        "If you don't use transit much, take the $52/month cash supplement instead — you can switch anytime.",
        "It can take up to 6 weeks to receive the pass, so request early.",
      ],
      time: "Up to 6 weeks.",
      phone: "BC: 1-866-866-0800",
    },
  },

  /* -------------------------------------------------------- ONTARIO */
  {
    id: "odsp",
    needsPractitioner: true,
    name: "Ontario Disability Support Program (ODSP)",
    level: "Ontario",
    category: "Money",
    amount: "Up to ~$1,368 / month + health & employment benefits",
    summary:
      "Ontario's main disability income program — monthly income support plus drug, dental and other benefits.",
    requires: ["on", "adult", "lowIncome"],
    note:
      "You'll complete a Disability Determination Package (your doctor documents how your impairment affects daily living and work). Comes with a drug card, dental, and employment supports.",
    applyText: "Ontario Disability Support Program",
    applyUrl: "https://www.ontario.ca/page/ontario-disability-support-program",
    source: "https://www.ontario.ca/page/ontario-disability-support-program",
    detail: {
      about:
        "Income and employment support for Ontario adults with a substantial physical or mental impairment that is continuous or recurrent and expected to last a year or more. Includes health benefits (prescriptions, dental, vision) for you and your family.",
      steps: [
        "Apply for financial assistance (online, by phone, or at a local office).",
        "If you pass the financial test, you'll get a Disability Determination Package.",
        "Your health professional completes it to confirm the disability.",
      ],
      documents: [
        "Disability Determination Package (completed by an approved health professional)",
        "Income, asset, and residency details",
      ],
      tips: [
        "People already receiving certain benefits (e.g. CPP-D in some cases) may be fast-tracked.",
        "ODSP has employment supports and lets you keep more of your earnings than regular assistance.",
      ],
      time: "Financial review first, then disability adjudication (can take a few months).",
      phone: "Ontario: 1-888-789-4199",
    },
  },
  {
    id: "on-adp",
    name: "Assistive Devices Program (ADP)",
    level: "Ontario",
    category: "Health & equipment",
    amount: "Covers ~75% of the cost of many devices",
    summary:
      "Ontario program that helps pay for personalized equipment — wheelchairs, hearing aids, breathing and other devices.",
    requires: ["on", "equipmentNeed"],
    note:
      "Open to Ontario residents with a long-term physical disability — you don't need to be on ODSP. An authorizer assesses what you need.",
    applyText: "Assistive Devices Program",
    applyUrl: "https://www.ontario.ca/page/assistive-devices-program",
    source: "https://www.ontario.ca/page/assistive-devices-program",
    detail: {
      about:
        "ADP helps Ontarians with long-term physical disabilities pay for customized equipment and specialized supplies. It typically covers about 75% of the cost, up to set maximums.",
      steps: [
        "See a health professional who is a registered ADP 'authorizer' for your device type.",
        "They assess you and complete the application for the specific equipment.",
        "Buy from a registered vendor; ADP pays its share directly.",
      ],
      documents: [
        "An ADP authorizer's assessment for the specific device",
        "Ontario health card (OHIP)",
      ],
      tips: [
        "You don't have to be on ODSP — ADP is based on your health card + long-term disability.",
        "If you're on ODSP, it may cover your remaining share of the cost.",
      ],
      time: "Depends on assessment and vendor.",
      phone: "Ontario: 1-800-268-6021",
    },
  },
  {
    id: "on-parking",
    needsPractitioner: true,
    name: "Accessible Parking Permit (Ontario)",
    level: "Ontario",
    category: "Getting around",
    amount: "Free accessible parking permit",
    summary:
      "A permit to use designated accessible parking spaces across Ontario.",
    requires: ["on", "mobility"],
    note:
      "For people who can't walk without difficulty, or with certain vision or health conditions. A health professional certifies the form.",
    applyText: "Get an Accessible Parking Permit",
    applyUrl: "https://www.ontario.ca/page/get-accessible-parking-permit",
    source: "https://www.ontario.ca/page/get-accessible-parking-permit",
    detail: {
      about:
        "A permit that lets you park in designated accessible spaces. There are permanent and temporary permits depending on your condition.",
      steps: [
        "Get the application and have a regulated health professional complete their section.",
        "Submit it to ServiceOntario (online, by mail, or in person).",
      ],
      documents: ["Application with the health professional's certification", "Ontario ID"],
      tips: [
        "There is no fee for the permit or to renew it.",
        "The permit belongs to you, not a vehicle — you can use it in any car you're travelling in.",
      ],
      time: "Often issued quickly at ServiceOntario.",
      phone: "ServiceOntario: 1-800-267-8097",
    },
  },

  /* --------------------------------------------------------- QUEBEC */
  {
    id: "qc-basic-income",
    needsPractitioner: true,
    name: "Basic Income Program (Quebec)",
    level: "Quebec",
    category: "Money",
    amount: "Higher, more flexible monthly benefit than social assistance",
    summary:
      "Quebec's program for people with a severely limited capacity for employment — more money, and you can keep more of your earnings and assets.",
    requires: ["qc", "adult", "severePermanent"],
    note:
      "You're admitted automatically after 66 months on the Social Solidarity Program (for people with severely limited capacity for employment). Start with Social Solidarity if you're not there yet.",
    applyText: "Quebec Basic Income Program",
    applyUrl: "https://www.quebec.ca/en/family-and-support-for-individuals/social-assistance-social-solidarity/basic-income-program",
    source: "https://www.quebec.ca/en/family-and-support-for-individuals/social-assistance-social-solidarity/basic-income-program",
    detail: {
      about:
        "A Quebec income program (started 2023) for people with a severely limited capacity for employment. It pays more than regular social assistance and lets you earn income and hold assets without losing your benefit.",
      steps: [
        "If you're not already on it, apply for Social Assistance / Social Solidarity.",
        "A medical report establishes your severely limited capacity for employment.",
        "After the qualifying period on Social Solidarity, you move to the Basic Income Program automatically.",
      ],
      documents: [
        "Medical report on your capacity for employment",
        "Quebec residency and income/asset details",
      ],
      tips: [
        "The big advantage is generous earnings and asset exemptions — you can work and save.",
        "Quebec also has its own tax credit for a severe and prolonged impairment (via Revenu Québec) — ask about it.",
      ],
      time: "Involves a qualifying period on Social Solidarity first.",
      phone: "Services Québec: 1-877-767-8773",
    },
  },
  {
    id: "qc-disability-supports",
    name: "Quebec Disability Supports & Services",
    level: "Quebec",
    category: "Daily living supports",
    amount: "Adapted transport, home support, and family services",
    summary:
      "Quebec's hub of services for people with disabilities — adapted transport, home support, respite, and help navigating programs.",
    requires: ["qc"],
    note:
      "The Office des personnes handicapées du Québec (OPHQ) and Services Québec help you find and access the right programs for your situation.",
    applyText: "Quebec — support for people with disabilities",
    applyUrl: "https://www.quebec.ca/en/people-with-disabilities/family-and-support-for-individuals",
    source: "https://www.quebec.ca/en/people-with-disabilities/family-and-support-for-individuals",
    detail: {
      about:
        "A starting point for Quebec's disability services: adapted (paratransit) transportation, home-support services, respite for families, and help understanding what you qualify for.",
      steps: [
        "Browse the Quebec disability supports hub for the service you need.",
        "For adapted transport, apply through your local transit authority (e.g. STM, RTC).",
        "Contact the OPHQ if you need help navigating multiple programs.",
      ],
      documents: ["Depends on the service", "Often a medical or functional assessment"],
      tips: [
        "Adapted transport (transport adapté) is run city-by-city — apply through your local transit society.",
        "The OPHQ can advocate for you if you're stuck between programs.",
      ],
      time: "Varies by service.",
      phone: "OPHQ: 1-800-567-1465",
    },
  },

  /* ------------------------------------------------------ MANITOBA */
  {
    id: "mb-supports",
    needsPractitioner: true,
    name: "Manitoba Supports for Persons with Disabilities",
    level: "Manitoba",
    category: "Money",
    amount: "Monthly income support + disability services",
    summary:
      "Manitoba's income and services program for adults with a severe, prolonged disability.",
    requires: ["mb", "adult", "lowIncome"],
    note:
      "For adults 18+ with a severe and prolonged disability and financial need. Provides living-expense support plus help connecting to community services.",
    applyText: "Manitoba Supports for Persons with Disabilities",
    applyUrl: "https://www.gov.mb.ca/fs/manitobasupports/index.html",
    source: "https://www.gov.mb.ca/fs/manitobasupports/index.html",
    detail: {
      about:
        "A Manitoba program (launched 2023) that gives adults with severe, prolonged disabilities monthly financial support for living costs and housing, plus help connecting to community services — outside the regular welfare system.",
      steps: [
        "Check eligibility and start an application on the Manitoba Supports page.",
        "Provide medical confirmation of a severe and prolonged disability.",
        "A caseworker reviews your finances and needs.",
      ],
      documents: ["Medical confirmation of a severe, prolonged disability", "Proof of Manitoba residency and income"],
      tips: [
        "Being approved for the federal DTC or CPP-D can help show your disability.",
        "It's separate from regular Employment and Income Assistance — ask specifically for 'Manitoba Supports'.",
      ],
      time: "Assessment-based.",
      phone: "1-877-830-1044",
    },
  },

  /* -------------------------------------------------- SASKATCHEWAN */
  {
    id: "sk-said",
    needsPractitioner: true,
    name: "Saskatchewan Assured Income for Disability (SAID)",
    level: "Saskatchewan",
    category: "Money",
    amount: "Monthly income support + disability benefits",
    summary:
      "Saskatchewan's income support for people with a significant and enduring disability.",
    requires: ["sk", "adult", "lowIncome"],
    note:
      "SAID pays higher, more stable support than regular assistance and is built around disability-related and daily-living needs.",
    applyText: "Saskatchewan Assured Income for Disability (SAID)",
    applyUrl: "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/income-support-for-people-with-disabilities",
    source: "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/income-support-for-people-with-disabilities",
    detail: {
      about:
        "Long-term income support for Saskatchewan residents with a significant and enduring disability, with extra benefits based on your individual needs and more choice in the services you use.",
      steps: [
        "Contact your local Social Services office to apply.",
        "A disability impact assessment confirms eligibility.",
        "Your benefits are set based on your living and disability-related needs.",
      ],
      documents: ["Disability impact assessment / medical information", "Proof of Saskatchewan residency and finances"],
      tips: [
        "SAID recipients can keep more of their earnings than people on regular assistance.",
        "Bring any existing diagnoses or a DTC/CPP-D approval to speed things up.",
      ],
      time: "Assessment-based.",
      phone: "Saskatchewan: 1-888-567-7873",
    },
  },

  /* ---------------------------------------------------- MANITOBA/ATLANTIC */
  {
    id: "ns-disability",
    needsPractitioner: true,
    name: "Nova Scotia Disability Support & Income Assistance",
    level: "Nova Scotia",
    category: "Money",
    amount: "Income assistance + $300/mo disability supplement + services",
    summary:
      "Income assistance with a disability supplement, plus the Disability Support Program's services.",
    requires: ["ns", "adult", "lowIncome"],
    note:
      "Income Assistance now adds $300/month for people with a disability who aren't in the Disability Support Program. The DSP itself provides services for intellectual, mental-health and physical disabilities.",
    applyText: "Nova Scotia Disability Support Program",
    applyUrl: "https://novascotia.ca/coms/disabilities/index.html",
    source: "https://novascotia.ca/coms/disabilities/index.html",
    detail: {
      about:
        "Two connected supports: Income Assistance (with a $300/month disability supplement) for basic needs, and the Disability Support Program (DSP) which funds community living, day programs, and residential supports.",
      steps: [
        "Call the toll-free intake line or visit a Community Services office.",
        "Apply for Income Assistance and ask about the disability supplement.",
        "For services (housing, day programs), ask about the Disability Support Program.",
      ],
      documents: ["Medical documentation of your disability", "Proof of Nova Scotia residency and income"],
      tips: [
        "Ask specifically about the $300/month disability supplement if you're on Income Assistance.",
        "The DSP is about services and supported living, not just money.",
      ],
      time: "Assessment-based.",
      phone: "1-877-424-1177",
    },
  },
  {
    id: "nb-disability",
    needsPractitioner: true,
    name: "New Brunswick Disability Support Program",
    level: "New Brunswick",
    category: "Daily living supports",
    amount: "Personalized disability supports & services",
    summary:
      "Personalized supports for New Brunswickers (19–64) with a long-term disability.",
    requires: ["nb", "adult"],
    note:
      "For residents 19–64 with a long-term disability needing regular attention or support — home support, respite, life-skills training, community participation and residential services.",
    applyText: "New Brunswick Disability Support Program",
    applyUrl: "https://www2.gnb.ca/content/gnb/en/services/services_renderer.200972.Disability_Support_Program.html",
    source: "https://socialsupportsnb.ca/en/program/disability-support-program",
    detail: {
      about:
        "A personalized program from NB Social Development for adults with a long-term disability. A needs assessment builds a plan that can include home support, respite for caregivers, life-skills training, and help taking part in the community.",
      steps: [
        "Apply online through Social Supports NB, or call the intake line.",
        "A social worker completes a needs assessment with you.",
        "Your plan sets out the supports you'll receive.",
      ],
      documents: ["Confirmation of a long-term disability", "Proof of NB residency (ages 19–64)"],
      tips: [
        "Explain how your disability affects daily life — the plan is built around your needs.",
        "Ask about respite if a family member helps care for you.",
      ],
      time: "Assessment-based.",
      phone: "1-833-733-7835",
    },
  },
  {
    id: "nl-disability",
    name: "Newfoundland & Labrador Disability Benefit",
    level: "Newfoundland & Labrador",
    category: "Money",
    amount: "Up to $400 / month ($4,800 / year)",
    summary:
      "A monthly top-up for N.L. residents (18–64) who qualify for the Disability Tax Credit and have a lower income.",
    requires: ["nl", "workingAge", "dtc", "lowIncome"],
    note:
      "No separate application — if you have a valid DTC, live in N.L., are 18–64, and file your taxes, you're assessed automatically based on income.",
    applyText: "Newfoundland & Labrador Disability Benefit",
    applyUrl: "https://www.gov.nl.ca/sswb/newfoundland-and-labrador-disability-benefit/",
    source: "https://www.gov.nl.ca/sswb/newfoundland-and-labrador-disability-benefit/",
    detail: {
      about:
        "A provincial monthly benefit (up to $400) for lower-income N.L. residents aged 18–64 who hold a valid Disability Tax Credit certificate. You get the full amount under about $29,400 income, and a partial amount above that.",
      steps: [
        "Get approved for the federal Disability Tax Credit (DTC) — that's the key step.",
        "File your income taxes every year.",
        "The benefit is calculated and paid automatically — no separate form.",
      ],
      documents: ["A valid DTC certificate", "Filed N.L. tax return"],
      tips: [
        "Because it's DTC-based, getting your DTC approved unlocks this automatically.",
        "File taxes even with no income so you're assessed.",
      ],
      time: "Paid monthly once your DTC and taxes are on file.",
      phone: "N.L. Digital Government & Service NL",
    },
  },
  {
    id: "pe-accessability",
    needsPractitioner: true,
    name: "PEI AccessAbility Supports",
    level: "Prince Edward Island",
    category: "Daily living supports",
    amount: "Personal, housing, community, caregiver & financial supports",
    summary:
      "PEI's program offering five kinds of support for Islanders with a disability.",
    requires: ["pe", "adult"],
    note:
      "Open to anyone who identifies as having a physical, intellectual, neurological, sensory or mental disability — with navigation and planning help whether or not you receive funding.",
    applyText: "PEI AccessAbility Supports",
    applyUrl: "https://www.princeedwardisland.ca/en/information/social-development-and-seniors/accessability-supports",
    source: "https://www.princeedwardisland.ca/en/information/social-development-and-seniors/accessability-supports",
    detail: {
      about:
        "A PEI program that provides five types of help — personal, housing, community, caregiver, and financial — plus navigation and planning for anyone with a disability, even before any funding is approved.",
      steps: [
        "Contact AccessAbility Supports for navigation and planning help.",
        "Work with a coordinator to identify which of the five supports you need.",
        "A plan is built around your goals and situation.",
      ],
      documents: ["Information about your disability and needs", "Proof of PEI residency"],
      tips: [
        "You can get information and planning help even if you don't qualify for funding.",
        "Ask about caregiver support if a family member helps you.",
      ],
      time: "Assessment-based.",
      phone: "PEI: 1-877-569-0546",
    },
  },

  /* ------------------------------------------------------ TERRITORIES */
  {
    id: "yt-disability",
    needsPractitioner: true,
    name: "Yukon Disability Supports & Social Assistance",
    level: "Yukon",
    category: "Money & services",
    amount: "Social assistance + supplementary allowance + cost help",
    summary:
      "Yukon financial help and services for residents with a disability or chronic condition.",
    requires: ["yt", "adult", "lowIncome"],
    note:
      "Includes Social Assistance with a supplementary allowance for people with disabilities, plus help with some costs of a chronic disease or disability.",
    applyText: "Yukon — services if you have a disability",
    applyUrl: "https://yukon.ca/en/health-and-wellness/care-services/find-services-if-you-have-disability",
    source: "https://yukon.ca/en/health-and-wellness/care-services/find-services-if-you-have-disability",
    detail: {
      about:
        "Yukon offers Social Assistance with an extra supplementary allowance for people with disabilities, plus the Chronic Disease and Disability Benefits program that helps with certain costs.",
      steps: [
        "Contact Yukon Social Services to apply for Social Assistance.",
        "Ask about the supplementary allowance for people with disabilities.",
        "Check the Chronic Disease and Disability Benefits program for cost help.",
      ],
      documents: ["Medical confirmation of your disability/condition", "Proof of Yukon residency and income"],
      tips: [
        "Ask specifically about the supplementary allowance — it's extra money for disability.",
        "The Chronic Disease program can help with supplies and some travel for care.",
      ],
      time: "Assessment-based.",
      phone: "Yukon Health & Social Services",
    },
  },
  {
    id: "nt-income",
    needsPractitioner: true,
    name: "NWT Income Assistance (Disability)",
    level: "Northwest Territories",
    category: "Money",
    amount: "Monthly income assistance + disability allowances",
    summary:
      "NWT income assistance, with a stream for seniors and people with disabilities.",
    requires: ["nt", "adult", "lowIncome"],
    note:
      "The NWT created a dedicated Income Assistance stream (2024) for seniors and people who qualify as a person with a disability, with fewer conditions than the general program.",
    applyText: "NWT Income Assistance Program",
    applyUrl: "https://www.ece.gov.nt.ca/en/services/income-security-programs/income-assistance-program",
    source: "https://www.ece.gov.nt.ca/en/services/income-security-programs/income-assistance-program",
    detail: {
      about:
        "Financial help for NWT residents to meet basic needs. A 2024 stream specifically supports seniors and people with disabilities, recognizing their ongoing needs.",
      steps: [
        "Contact your regional ECE Service Centre to apply.",
        "Provide medical confirmation to qualify as a person with a disability.",
        "A worker sets your monthly assistance and any disability allowances.",
      ],
      documents: ["Medical confirmation of disability", "Proof of NWT residency and income"],
      tips: [
        "Ask about the disability/senior stream — it has more flexible rules.",
        "Bring any DTC or CPP-D approval you already have.",
      ],
      time: "Assessment-based.",
      phone: "NWT ECE Service Centre",
    },
  },
  {
    id: "nu-income",
    needsPractitioner: true,
    name: "Nunavut Income Assistance",
    level: "Nunavut",
    category: "Money",
    amount: "Monthly income assistance for basic needs",
    summary:
      "Nunavut's program of last resort for residents in financial need, including due to disability.",
    requires: ["nu", "adult", "lowIncome"],
    note:
      "Any Nunavummiut 18+ in financial need — including because of a disability or illness — can apply for help meeting basic needs.",
    applyText: "Nunavut Income Assistance Program",
    applyUrl: "https://www.gov.nu.ca/en/social-supports/income-assistance-program",
    source: "https://www.gov.nu.ca/en/social-supports/income-assistance-program",
    detail: {
      about:
        "Income Assistance helps Nunavut individuals and families meet basic needs when they can't provide for themselves — including because of a disability, illness, or low income.",
      steps: [
        "Visit your community's Income Assistance office.",
        "Explain your situation, including any disability or illness.",
        "A worker determines your monthly assistance.",
      ],
      documents: ["Information about your disability/illness", "Proof of Nunavut residency and income"],
      tips: [
        "Your local Income Assistance office is the place to start — there's one in most communities.",
        "Also apply for the federal DTC and RDSP, which apply across Canada.",
      ],
      time: "Assessment-based.",
      phone: "Your community Income Assistance office",
    },
  },
];
