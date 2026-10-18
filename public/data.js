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
  "Vancouver", "Surrey", "Burnaby", "Richmond", "Victoria", "Saanich",
  "Kelowna", "Coquitlam", "Kamloops",
  "Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Windsor",
  "Aurora", "Markham", "Newmarket", "Richmond Hill", "Vaughan",
  "Cambridge", "Kitchener", "North Dumfries", "Waterloo", "Wellesley", "Wilmot", "Woolwich",
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

const BC_TRANSIT_HANDYDART_CHOOSER = "https://www.bctransit.com/";
const BC_TRANSIT_HANDYDART_REGISTRATION = {
  Victoria: "https://www.bctransit.com/victoria/riderinfo/handydart/register/",
  Colwood: "https://www.bctransit.com/victoria/riderinfo/handydart/register/",
  Langford: "https://www.bctransit.com/victoria/riderinfo/handydart/register/",
  Saanich: "https://www.bctransit.com/victoria/riderinfo/handydart/register/",
  Kelowna: "https://www.bctransit.com/kelowna/riderinfo/handydart/register/",
  Kamloops: "https://www.bctransit.com/kamloops/riderinfo/handydart/register/",
  Nanaimo: "https://www.bctransit.com/nanaimo/riderinfo/handydart/register/",
  Parksville: "https://www.bctransit.com/nanaimo/riderinfo/handydart/register/",
};
const resolveBcTransitHandyDartUrl = (a) =>
  BC_TRANSIT_HANDYDART_REGISTRATION[a && a.city] || BC_TRANSIT_HANDYDART_CHOOSER;
resolveBcTransitHandyDartUrl.staticUrl = BC_TRANSIT_HANDYDART_CHOOSER;

/* Province scaffolding can land before its catalog. Visibility is gated in app.js. */
/* Ontario municipalities offered in the questionnaire. Listing a city here does NOT
   mean it has its own programs — CITIES_WITH_PROGRAMS is that list. Alberta works the
   same way: 51 cities offered, 27 with programs. */
/* Ontario regional municipalities that deliver programs on behalf of their member cities.
   These are NOT city options in the questionnaire — nobody selects "York Region" — but a
   record can carry one as its `level`, so the province filter has to know about them. */
const ON_REGIONS = ["York Region", "Region of Waterloo", "Niagara Region", "Halton Region"];

const ON_CITIES = [
  "Ajax", "Aurora", "Barrie", "Belleville", "Brampton", "Brantford", "Burlington",
  "Cambridge", "Chatham-Kent", "Clarington", "Cornwall", "Greater Sudbury", "Guelph",
  "Hamilton", "Kingston", "Kitchener", "London", "Markham", "Milton", "Mississauga",
  "Newmarket", "Niagara Falls", "North Bay", "North Dumfries", "Oakville", "Oshawa", "Ottawa",
  "Peterborough", "Pickering", "Richmond Hill", "Sarnia", "Sault Ste. Marie",
  "St. Catharines", "Stratford", "Thunder Bay", "Timmins", "Toronto", "Vaughan",
  "Waterloo", "Welland", "Wellesley", "Whitby", "Wilmot", "Windsor", "Woolwich", "Woodstock",
];
/* Every province in COVERED_PROVINCES gets a key here, even when its list is still
   empty, so callers can tell "covered, no municipalities yet" from "not covered".
   app.js skips the city question whenever the chosen province's list is empty. */
/* Saskatchewan municipalities offered in the questionnaire (provincial records first;
   city programs come later). Lloydminster straddles the Alberta border and is listed
   under both provinces; SHARED_CITIES says which provinces a border city belongs to. */
const SK_CITIES = [
  "Estevan", "Lloydminster", "Martensville", "Moose Jaw", "North Battleford", "Prince Albert",
  "Regina", "Saskatoon", "Swift Current", "Warman", "Weyburn", "Yorkton",
  "Other / my town isn't listed",
];
const SHARED_CITIES = { Lloydminster: ["AB", "SK"] };
const CITIES_BY_PROVINCE = { AB: ALBERTA_CITIES, BC: BC_CITIES, ON: ON_CITIES, SK: SK_CITIES };
const COVERED_PROVINCES = ["AB", "BC", "ON", "SK"];

/* national fallbacks (used when a jurisdiction isn't in the maps yet) */
const FED_STUDENT_AID = "https://www.canada.ca/en/employment-social-development/services/education/grants/disabilities.html";
const NATIONAL_211 = "https://211.ca/";

const STUDENT_AID = {
  AB: "https://studentaid.alberta.ca/",
  BC: "https://studentaidbc.ca/apply/how-to-apply-disability-funding",
};
const TWO_ELEVEN = { AB: "https://ab.211.ca/", BC: "https://bc.211.ca/" };
const EMPLOYMENT = {
  AB: "https://www.alberta.ca/disability-related-employment-supports",
  BC: "https://www.workbc.ca/plan-career/resources/people-disabilities",
};

/* =============================================================================
   STRUCTURED VALUE MODEL — approximate dollar value per benefit, so we
   can answer "how much money could I get?" instead of a dense description.
   kind: cash | taxCredit | grant | services | coverage | access | discount
   Amounts are 2025–2026 figures, rounded. Verified July 2026 (see each benefit's
   official source). These are ESTIMATES — actual amounts depend on the person.
   ========================================================================== */
const BENEFIT_VALUES = {
  "yorkton-discounted-monthly-pass": { kind: "discount", note: "The discounted pass costs $27.50 a month, not the adult price of $90.00." },
  "yorkton-access-transit": { kind: "access", note: "Door-to-door rides for people with disabilities who cannot use regular transit." },
  "saskatoon-accessible-parking-permit-subsidy": { kind: "discount", note: "The yearly permit costs $50 plus GST instead of $100 plus GST." },
  "prince-albert-access-transit": { kind: "access", note: "Door-to-door rides for people who cannot use public transit." },
  "moose-jaw-paratransit": { kind: "access", note: "Door-to-door accessible rides for people who cannot use regular transit." },
  "moose-jaw-discounted-monthly-pass": { kind: "discount", note: "The discounted monthly pass costs $25.00 on the fares table." },
  "regina-discounted-31-day-pass": { kind: "discount", note: "The discounted 31-day pass costs $28." },
  "north-battleford-handi-bus": { kind: "access", note: "On-demand rides for people who cannot use regular transit" },
  "saskatoon-low-income-bus-pass": { kind: "discount", note: "Reduced monthly pass: adult $66.40, high school $47.20" },
  "saskatoon-leisure-access-program": { kind: "access", note: "Free drop-in admission and one registered program per year" },
  "saskatoon-access-transit": { kind: "access", note: "Shared door-to-door rides on accessible buses at regular fares" },
  "regina-paratransit": { kind: "access", note: "Door-to-door shared rides for registered riders at regular fares" },
  "regina-affordable-access": { kind: "discount", note: "50% to 80% off recreation; 20% off adult and youth transit passes" },
  "sk-cochlear-processor": { kind: "grant", note: "Cost-shared replacement; client co-pay of $840 per processor" },
  "sk-early-childhood-intervention": { kind: "access", note: "Home-based services; no cost is stated on the page" },
  "sk-low-income-tax-credit": { kind: "grant", note: "Refundable quarterly payment for low and modest incomes, paid with the GST Credit" },
  "sk-active-families-benefit": { kind: "grant", note: "Refundable provincial tax benefit toward activity fees, up to $400 per child with the Disability Tax Credit" },
  "sk-accessible-parking": { kind: "access", note: "$10 fee each time a permit is issued; the health professional may charge a form fee" },
  "sk-personal-care-home-benefit": { kind: "grant", note: "Monthly amount is $3,500 minus your monthly income (half of combined income for couples)" },
  "sk-eapd": { kind: "access", note: "Funds disability-related supports for work or training; no dollar amount published" },
  "sk-adaptations-for-independence": { kind: "grant", note: "Forgivable loan of up to $23,000 for accessibility changes" },
  "sk-home-care": { kind: "access", note: "Services based on assessed need; fees depend on income and a subsidy is available" },
  "sk-family-respite-intellectual-disability": { kind: "grant", note: "Monthly income-tested respite benefit; no dollar amount published" },
  "sk-cognitive-disability-strategy": { kind: "grant", note: "Income-tested benefit; no dollar amount published" },
  "sk-autism-individualized-funding": { kind: "grant", note: "Up to $8,000 a year under age 6 and up to $6,000 a year for ages 6 to 11, paid for approved services" },
  "sk-seniors-income-plan": { kind: "grant", note: "Monthly income top-up for seniors on OAS and GIS." },
  "sk-seniors-drug-plan": { kind: "discount", note: "A $25 cap on eligible prescriptions." },
  "sk-special-support": { kind: "discount", note: "Lower drug costs based on family income." },
  "sk-family-health-benefits": { kind: "access", note: "Health coverage for children in low-income working families." },
  "sk-supplementary-health": { kind: "access", note: "Extra health coverage for people on qualifying income programs." },
  "sk-sail": { kind: "access", note: "Coverage of disability-related equipment and supplies." },
  "sk-housing-benefit": { kind: "grant", note: "Monthly help with rent and utilities." },
  "sk-employment-incentive": { kind: "grant", note: "Monthly payment for working families with low incomes and children." },
  "sk-income-support": { kind: "grant", note: "Monthly money for shelter and basic needs." },
  "sk-said": { kind: "grant", note: "Long-term monthly income for people with a significant and enduring disability." },
  "on-childrens-rehab": { kind: "access", note: "Therapy and family supports through a local Children's Treatment Centre" },
  "bc-subsidized-housing": { kind: "access", note: "Rent geared to income (30% of gross household income), subject to a minimum rent" },
  "ab-sharp": { kind: "access", note: "Low-interest loan of up to $40,000 at the current rate of 4.45%" },
  "ab-seniors-special-needs-assistance": { kind: "grant", note: "Up to $5,872 per benefit year toward eligible items" },
  "ab-seniors-dental-optical": { kind: "discount", note: "Dental up to $5,000 every 5 years; glasses up to $230 every 3 years" },
  "ab-seniors-benefit": { kind: "grant", note: "Monthly benefit; the maximum depends on residence type and marital status" },
  "ab-rent-assistance-benefit": { kind: "grant", note: "Rent subsidy paid to the tenant; the amount depends on income and local rent" },
  "ab-income-support": { kind: "grant", note: "Monthly money for basic needs; the amount depends on your needs and family size" },
  "ab-home-care": { kind: "access", note: "Publicly funded health and personal care services; no dollar value published" },
  "ab-child-family-benefit": { kind: "grant", note: "Base part up to $1,529 to $3,821 a year (July 2026 to June 2027), plus a working part up to $782 to $2,061" },
  "ab-brain-injury": { kind: "access", note: "Help finding and coordinating supports; no dollar value published" },
  "ab-blue-cross-non-group": { kind: "access", note: "Monthly premium of $63.50 (single) or $118.00 (family); $44.45 or $82.60 with the subsidy" },
  "bc-hearing-supplements": { kind: "grant", note: "Pays for approved hearing aids and repairs; a separate monthly supplement exists." },
  "bc-safer": { kind: "grant", note: "Monthly rent supplement paid by direct deposit on the last working day of the month." },
  "bc-rental-assistance-program": { kind: "grant", note: "Monthly rent help paid by direct deposit, in arrears." },
  "bc-ppmb": { kind: "grant", note: "Income assistance category that may bring a higher support rate and supplements." },
  "bc-nursing-support-services": { kind: "access", note: "In-home nursing respite and school nursing support; cost not stated." },
  "bc-income-assistance": { kind: "grant", note: "Monthly income support for people in need with no other resources." },
  "bc-home-support": { kind: "access", note: "Subsidized home support with an income-based daily rate." },
  "bc-family-benefit": { kind: "grant", note: "Tax-free monthly payment based on family income and number of children." },
  "bc-csil": { kind: "grant", note: "Monthly funds to buy your own home support; you pay an income-based daily rate." },
  "on-oesp": { kind: "discount", note: "monthly bill credit $35–$75 by income and household size; $52–$113 for special circumstances" },
  "on-odsp-health-benefits": { kind: "access", note: "Health and disability benefits for ODSP recipients and families" },
  "on-odsp-employment-supports": { kind: "grant", note: "Keep ODSP while earning, plus work-related benefits" },
  "on-northern-health-travel-grant": { kind: "grant", note: "Partial reimbursement of long-distance medical travel" },
  "on-home-community-care": { kind: "access", note: "Government-paid home care if you are assessed as eligible" },
  "on-drug-benefit": { kind: "discount", note: "Most of the cost of listed prescription drugs" },
  "on-trillium-benefit": { kind: "grant", note: "Tax-free payments for energy costs and sales and property taxes" },
  "on-seniors-dental": { kind: "access", note: "Free routine dental care for eligible low-income seniors" },
  "on-ontario-works": { kind: "grant", note: "Monthly money for living costs and health benefits" },
  "on-healthy-smiles": { kind: "access", note: "Free dental care for eligible children and youth 17 and under" },
  "on-gains": { kind: "grant", note: "Up to $92 a month, non-taxable" },
  "on-enhanced-respite": { kind: "grant", note: "Up to $4,213 per child each fiscal year for respite" },
  "on-dso-adult-services": { kind: "access", note: "Gateway to provincially funded adult developmental services" },
  "on-child-benefit": { kind: "grant", note: "Up to $1,760 per child each year, paid monthly" },
  "west-vancouver-recreation-financial-assistance": { kind: "discount", note: "50% off FitPasses and activities, within yearly maximums." },
  "taber-fee-assistance": { kind: "discount", note: "50% off many Town recreation fees." },
  "sarnia-cnib-pass": { kind: "discount", note: "About $36 (a page note says $35.25) instead of $1,065 for the annual pass." },
  "port-coquitlam-financial-assistance": { kind: "grant", note: "A One City Pass and a scholarship of $200 per adult or $500 per child." },
  "nelson-rdck-leisure-access": { kind: "grant", note: "A yearly credit of $100 per adult or $150 per youth." },
  "morinville-wrap": { kind: "grant", note: "Up to $250 per person toward recreation fees." },
  "langley-leisure-access-grant": { kind: "discount", note: "25% to 75% off a City program or pass." },
  "high-river-community-access-program": { kind: "discount", note: "50% off Town programs and recreation admissions." },
  "dawson-creek-leisure-access": { kind: "grant", note: "Funding amount varies and is not guaranteed." },
  "cornwall-community-bus-pass": { kind: "discount", note: "A reduced-price pass. The page gives no price." },
  "brantford-recreation-subsidy": { kind: "discount", note: "The City pays 25% to 75% of fees, or 100% on assistance." },
  "white-rock-leisure-access": { kind: "discount", note: "50% off, up to $300 a year" },
  "terrace-affordable-recreation-access": { kind: "discount", note: "50% off drop-ins and short memberships" },
  "squamish-recreation-access": { kind: "discount", note: "50% off services and programs" },
  "quesnel-leisure-access": { kind: "discount", note: "50% off admissions, 25% off programs" },
  "prince-rupert-recreation-access": { kind: "discount", note: "90% off for children and youth, 50% off for adults, plus 50 free admissions" },
  "port-moody-leisure-access": { kind: "discount", note: "50% off admissions and many programs" },
  "pitt-meadows-fee-subsidy": { kind: "discount", note: "Discounted fees; the rate is not published" },
  "penticton-access-pass": { kind: "discount", note: "25% off passes" },
  "penticton-life": { kind: "access", note: "Free and low-cost recreation; the exact discount is not published" },
  "mission-play-pass": { kind: "access", note: "Free admissions to the Mission Leisure Centre." },
  "duncan-leisure-access": { kind: "access", note: "Annual drop-in access at Cowichan Aquatic Centre and Fuller Lake Arena." },
  "cranbrook-leisure-access": { kind: "discount", note: "75% off regular swim rates plus free monthly transit passes." },
  "courtenay-comox-rap-leap": { kind: "discount", note: "52 free drop-ins and a $350 subsidy per family member through LEAP." },
  "colwood-langford-life": { kind: "access", note: "Recreation centre access at Greater Victoria municipal centres for low-income households." },
  "campbell-river-life": { kind: "discount", note: "52 free drop-ins and 50% off three City programs per card each year." },
  "peterborough-ow-odsp-transit-pass": { kind: "discount", note: "A 30-day City bus pass for $49." },
  "peterborough-recreation-subsidy": { kind: "grant", note: "$100 or $200 per person per year toward registration fees." },
  "cornwall-fair": { kind: "discount", note: "City covers 75% of eligible recreation costs, up to $300 per year." },
  "chatham-kent-affordable-bus-pass": { kind: "discount", note: "Unlimited urban rides for $41.99 per 30 days." },
  "belleville-recreation-fee-assistance": { kind: "discount", note: "25%, 50% or 75% off eligible City recreation fees, based on income." },
  "whitecourt-recreation-fee-assistance": { kind: "discount", note: "Subsidy toward 2 programs per session per family member, or a 3 month membership." },
  "strathmore-community-access-card": { kind: "discount", note: "10% to 75% off entry and membership fees at three Town recreation facilities." },
  "rocky-mountain-house-rfap": { kind: "discount", note: "50% off a set number of drop-ins, program registrations and one membership per card, each year." },
  "edson-leisure-assist": { kind: "grant", note: "$150 per person, up to $450 per family, credited to your Active Net account each year." },
  "drayton-valley-recreation-fee-assistance": { kind: "discount", note: "75% off qualifying Town recreation fees." },
  "chestermere-community-access-program": { kind: "discount", note: "Subsidies and discounts on memberships, classes and transit. No dollar amount is published." },
  "blackfalds-recreation-fee-assistance": { kind: "discount", note: "Subsidy for recreation fees when possible. No dollar amount or percentage is published." },
  "banff-access-program": { kind: "discount", note: "Reduced rates on recreation, transit passes and participating services. No dollar amount is published." },
  "prince-george-lap": { kind: "access", note: "52 free swims, then 75% off swim passes and programs (up to a $50 credit)." },
  "new-westminster-financial-assistance": { kind: "discount", note: "50% off eligible programs and passes, using 1,000 credits per family member." },
  "nanaimo-leap": { kind: "access", note: "50 free admissions, 50% off programs up to $40, and free gallery and museum entry." },
  "maple-ridge-access-pass-disability": { kind: "discount", note: "50% off admissions and 25% off programs up to $150 a year." },
  "maple-ridge-access-pass-financial": { kind: "discount", note: "75% or 90% off admissions and 50% off programs up to $300 spent." },
  "abbotsford-specialized-access": { kind: "discount", note: "50% off drop-in admissions and passes, plus free entry for a required support worker." },
  "abbotsford-prc-subsidy": { kind: "discount", note: "Pass plus 25% off listed programs; the pass price itself is not stated on the page." },
  "halton-split": { kind: "discount", note: "Part of the cost of bus tickets or monthly passes; the page does not give the amount" },
  "kingston-affordable-transit-pass": { kind: "discount", note: "Discounted monthly pass. The price is not published on the MFAP page." },
  "niagara-transit-benefit-pass": { kind: "discount", note: "$50 a month for a monthly bus pass. The page does not give the regular price." },
  "waterloo-ontario-renovates": { kind: "grant", excludeFromEstimate: true, note: "maximum $25,000 per dwelling for homeowner repairs as a fully forgivable loan and/or up to $25,000 for eligible accessibility modifications; accessibility funding includes a grant portion up to $5,000; maximum funding limits may be subject to change" },
  "waterloo-homemaking-support": { kind: "services", excludeFromEstimate: true, note: "light housekeeping, meal planning and preparation, and laundry; waitlist currently approximately 2–3 years except under special circumstances" },
  "waterloo-curbside-waste-support": { kind: "services", excludeFromEstimate: true, note: "assisted black and green cart set-out, or 30 garbage bag tags per year at no charge for approved medical-waste applicants" },
  "grt-affordable-transit": { kind: "discount", note: "$47 monthly pass vs $104 regular; $1.35 stored value per ride vs $3 regular and $4 cash; $6.75 for 5 MobilityPLUS tickets vs $15 regular" },
  "grt-cnib-pass": { kind: "access", excludeFromEstimate: true, note: "free annual pass for unlimited conventional GRT bus and ION light rail travel" },
  "grt-mobilityplus": { kind: "access", excludeFromEstimate: true, note: "specialized transit; $15 for 5 tickets or $104 monthly, with ATP tickets $6.75 for 5" },
  "grt-taxi-coupons": { kind: "discount", note: "$60 coupon book for $30, up to 30 books between January 1 and December 31" },
  "grt-support-person": { kind: "access", excludeFromEstimate: true, note: "a support person travels free while assisting the customer" },
  "york-region-homemakers": { kind: "services", excludeFromEstimate: true, note: "help with the cost of an in-home homemaker; no published amount" },
  "york-region-recreation-subsidies": { kind: "discount", excludeFromEstimate: true, note: "recreation, day camp and youth overnight camp subsidies; no published amount" },
  "ottawa-community-pass": { kind: "discount", note: "$43.25/month or $1.75/ride, all routes including Para Transpo with no top-up" },
  "ottawa-access-pass": { kind: "discount", note: "$43.25/month, unlimited O-Train and non-Para buses, $2.75 top-up per Para Transpo ride" },
  "ottawa-equipass": { kind: "discount", note: "$58.25/month or $1.75/ride, about half the adult fare" },
  "ottawa-a-card": { kind: "access", excludeFromEstimate: true, note: "free travel on all routes except Para Transpo" },
  "london-ontario-renovates": { kind: "grant", excludeFromEstimate: true, note: "10-year forgivable loan up to $25,000; first $5,000 a grant for accessibility modifications" },
  "windsor-affordable-pass": { kind: "discount", note: "Transit Windsor APP 30-day pass: $63 adult or $43.50 youth, before taxes; regular 30-day Smart Pass: $124 adult, $85 youth or $63 senior" },
  "windsor-recreation-assistance": { kind: "discount", note: "90% off eligible recreation program registration fees before taxes; equipment and materials are not covered" },
  "hamilton-fare-assist": { kind: "discount", note: "50% off single-ride PRESTO fares for one year; does not apply to monthly or annual passes" },
  "brampton-activeassist": { kind: "discount", note: "$275 per eligible family member as one lump sum; approval lasts two years" },
  "mississauga-activeassist": { kind: "discount", note: "$275 per eligible family member per year, non-refundable" },
  "ottawa-hand-in-hand": { kind: "discount", note: "$185 per person per year toward City recreation and culture programs" },
  "toronto-fair-pass": { kind: "discount", note: "36% off adult single TTC fares — $2.10 instead of $3.30, monthly cap $98.70" },
  "toronto-welcome-policy": { kind: "discount", note: "$683.04/year up to age 24; $314.60/year at 25 and over" },
  "trillium-drug-program": { kind: "coverage", excludeFromEstimate: true, note: "for most people the deductible is about 4% of after-tax household income, then up to $2 for each drug filled or refilled" },
  "passport-program": { kind: "grant", excludeFromEstimate: true, note: "$5,665 a year minimum; up to $45,604 based on assessed need" },
  hvmp: { kind: "grant", excludeFromEstimate: true, note: "funds approved home or vehicle modifications; no published maximum" },
  ssah: { kind: "grant", excludeFromEstimate: true, note: "discretionary funding for respite and support services; no published amount" },
  acsd: { kind: "cash", excludeFromEstimate: true, monthlyMax: 678, note: "income-tested; $25 to $678 a month depending on income, family size and disability costs (July 2026)" },
  "on-adp": { kind: "coverage", excludeFromEstimate: true, note: "ADP pays up to 75% of the approved amount, depending on the device's funding model; may be the full amount if you receive ODSP, Ontario Works or ACSD" },
  "ontario-autism-program": { kind: "services", excludeFromEstimate: true, note: "needs-based services; no published dollar amount" },
  odsp: { kind: "cash", excludeFromEstimate: true, monthlyMax: 1436, note: "income-tested; single-person maximum for basic needs and shelter (July 2026)" },
  "on-parking-permit": { kind: "access", excludeFromEstimate: true, note: "accessible parking permit; free to get, renew, or replace" },
  // ---- federal ----
  // The annual disability amount is not cash and is not the tax reduction.
  // Actual federal/provincial tax relief depends on tax payable, transfers,
  // province and tax year, so DTC is deliberately excluded from totals.
  dtc: { kind: "taxCredit", excludeFromEstimate: true,
    note: "reduces income tax payable; the actual reduction varies" },
  "cdb-adult": { kind: "cash", annualMax: 2450.4, monthlyMax: 204.2,
    note: "July 2026–June 2027 maximum; excludes the separate conditional $150 supplement" },
  "child-disability-benefit": { kind: "cash", annualMax: 3480, monthlyMax: 290 },
  "cpp-childrens-benefit": { kind: "cash", excludeFromEstimate: true,
    note: "$307.81 per month per child in 2026, or $153.91 for a part-time student aged 18 to 25" },
  rdsp: { kind: "grant", annualMax: 4500, lifetimeMax: 90000,
    note: "in government grants & bonds; repayment rules apply" },
  "cwb-disability": { kind: "cash", annualMax: 843, note: "refundable top-up on your tax return" },
  "cpp-disability": { kind: "cash", monthlyMin: 611, monthlyMax: 1741, annualMax: 20894 },
  "csg-disability": { kind: "grant", annualMax: 2800 },
  "csg-dse": { kind: "grant", annualMax: 20000 },
  "canadian-dental-care-plan": { kind: "coverage", excludeFromEstimate: true,
    note: "The plan pays at CDCP established fees, which can be lower than what your provider charges, so you may still owe the difference directly to them." },
  "disability-supports-deduction": { kind: "taxCredit", excludeFromEstimate: true,
    note: "This is a deduction, not a credit — it reduces the income you are taxed on rather than paying out money." },
  "medical-expense-tax-credit": { kind: "taxCredit", excludeFromEstimate: true,
    note: "Only the portion above a threshold counts." },
  "canada-caregiver-credit": { kind: "taxCredit", excludeFromEstimate: true,
    note: "A federal non-refundable credit for someone who supports a spouse, common-law partner or dependant with a mental or physical impairment." },
  // ---- Alberta ----
  // AISH and ADAP are assessed through one application. Keep both out of the
  // combined estimate: adding them together would falsely promise two incomes.
  aish: { kind: "cash", excludeFromEstimate: true,
    note: "monthly living allowance plus health and personal benefits" },
  adap: { kind: "cash", excludeFromEstimate: true,
    note: "monthly financial benefit plus health, personal and employment benefits" },
  aadl: { kind: "coverage", note: "covers ~75% of approved equipment & supplies" },
  ramp: { kind: "grant", annualMax: 12000, excludeFromEstimate: true, note: "up to \$12,000 per benefit year for approved home modifications; \$24,000 over any 10 years" },
  pdd: { kind: "services", note: "funded daily-living, community & employment services" },
  fscd: { kind: "services", note: "respite, services & help with some disability costs" },
  dres: { kind: "services", note: "may fund approved disability-related accommodations for work or eligible education or training routes" },
  "ab-grant-disability": { kind: "grant", annualMax: 3000,
    note: "per loan year; limited to approved service/equipment costs after federal funding is allocated first" },
  "adult-health-benefit": { kind: "coverage", note: "prescriptions, dental, optical, ambulance and diabetes supplies — Alberta publishes no annual dollar value" },
  "child-health-benefit": { kind: "coverage", note: "eligible prescription drugs, basic and preventative dental care and eyeglasses for children in low-income households" },
  "parking-placard": { kind: "access", note: "low-cost accessible parking permit" },
  "ab-service-dog-id-card": { kind: "access", excludeFromEstimate: true,
    note: "Free provincial ID card for a qualified service dog team, mailed in about 2 weeks" },
  "ab-capcc": { kind: "services", excludeFromEstimate: true,
    note: "A community access coordinator and an individual service plan to reduce social isolation" },
  "ab-special-needs-housing": { kind: "services", excludeFromEstimate: true,
    note: "Subsidized housing applied for through a local housing provider" },
  "calgary-fair-entry": { kind: "discount", note: "transit $6.30–$63/mo by income band + lower-cost recreation" },
  "edmonton-fare-assistance": { kind: "discount", note: "Reduced-cost monthly Arc card ($35 or $50 depending on household income) + Leisure Access Pass" },
  // Municipal programs researched 2026-07-15 — figures from each city's own page.
  "reddeer-fee-assistance": { kind: "discount", note: "$34/mo transit pass + up to $200/yr recreation" },
  "lethbridge-fee-assistance": { kind: "discount", note: "3 months of bus passes for the price of 1 + up to $150 per person per season toward one recreation or culture program, while funds are available" },
  "medicinehat-fair-entry": { kind: "discount", note: "up to 75% off transit (up to $630/yr per person) + up to $200/yr per person for City recreation and a separate up to $200/yr per person for Esplanade education programs" },
  "grandeprairie-aish-pass": { kind: "discount", note: "$10.25/mo transit pass (vs $74.25) + 75% off recreation" },
  "stalbert-subsidy": { kind: "discount", note: "Free local fares + free annual rec membership (AISH/ADAP)" },
  "strathcona-subsidy": { kind: "discount", note: "Reduced transit fare cap + free annual Active Pass+" },
  "airdrie-fair-access": { kind: "discount", note: "25–75% off transit + Genesis Place recreation" },
  "woodbuffalo-lift": { kind: "discount", note: "$10/mo transit pass + 75% off SMART Bus + 60% off recreation" },
  "sprucegrove-low-income-transit": { kind: "discount", note: "$25/mo local or $50/mo commuter transit pass" },
  "leduc-subsidies": { kind: "discount", note: "half-price monthly bus pass of your choice (local, commuter or LATS); recreation program now closed, reopening for new applications in January 2027" },
  "cochrane-connect-card": { kind: "discount", note: "25% off local transit + 50% off SLS Centre monthly passes" },
  "okotoks-fee-assistance": { kind: "discount", note: "80% off most Town programs, passes and admission" },
  "canmore-affordable-services": { kind: "discount", note: "discounts on Regional ROAM Transit, recreation and community services" },
  "lloydminster-recreation-access": { kind: "discount", note: "$2 adult drop-in admission at City recreation facilities" },
  "fortsask-access": { kind: "discount", note: "free multi-facility membership and reduced local or commuter transit fares" },
  "local-supports": { kind: "discount", note: "varies by community" },
  // ---- British Columbia (DATA-51) — typed for display + future priority work.
  // ALL excluded from the combined estimate; priorityScore treats them as
  // priority-neutral (see the excludeFromEstimate guard in app.js). ----
  "bc-disability-assistance-pwd": { kind: "cash", excludeFromEstimate: true, monthlyMax: 1535.5, note: "primary BC disability income support (support + max shelter + $52 transport); income-tested — excluded like AISH/ADAP" },
  "bc-cy-disability-benefit": { kind: "cash", excludeFromEstimate: true, annualMax: 17000, note: "need-based tier ($6,500 or $17,000); replaces Autism Funding — never counted with bc-autism-funding-*" },
  "bc-monthly-nutritional-supplement": { kind: "cash", excludeFromEstimate: true, monthlyMax: 225, note: "conditional supplement (<=$180 diet + <=$45 vitamins) stacked on PWD" },
  "bc-autism-funding-under-6": { kind: "grant", excludeFromEstimate: true, annualMax: 22000, note: "open to Mar 2027; replaced by bc-cy-disability-benefit — mutually exclusive" },
  "bc-autism-funding-6-18": { kind: "grant", excludeFromEstimate: true, annualMax: 6000, note: "open to Mar 2027; replaced by bc-cy-disability-benefit — mutually exclusive" },
  "bc-csg-students-disabilities": { kind: "grant", excludeFromEstimate: true, annualMax: 2800, note: "same program as federal csg-disability via StudentAid BC — never double-counted" },
  "bc-csg-services-equipment": { kind: "grant", excludeFromEstimate: true, annualMax: 20000, note: "same program as federal csg-dse via StudentAid BC — never double-counted" },
  "bc-access-grant-students-disabilities": { kind: "grant", excludeFromEstimate: true, annualMax: 1560, note: "student-only; $30 per week of study" },
  "bc-supplemental-bursary-students-disabilities": { kind: "grant", excludeFromEstimate: true, annualMax: 800, note: "student-only; $800 full-time / $400 part-time" },
  "bc-assistance-program-students-disabilities": { kind: "grant", excludeFromEstimate: true, annualMax: 10000, note: "student-only; up to $12,000 if an attendant is required" },
  "bc-learning-disability-assessment-bursary": { kind: "grant", excludeFromEstimate: true, annualMax: 3500, note: "one-time, toward a learning-disability assessment" },
  "bc-access-grant-deaf-students": { kind: "grant", excludeFromEstimate: true, annualMax: 30000, note: "up to $30,000 per program year, based on StudentAid BC-assessed financial need" },
  "bc-additional-home-owner-grant": { kind: "grant", excludeFromEstimate: true, note: "reduces the property tax you owe; it is not a payment" },
  "bc-raha": { kind: "grant", excludeFromEstimate: true, note: "lifetime maximum per household; adaptations completed before written approval are not eligible" },
  "bc-home-reno-tax-credit": { kind: "taxCredit", excludeFromEstimate: true, annualMax: 1000, note: "refundable; 10% of up to $10,000 in eligible renovations; conditional on spending" },
  "home-accessibility-tax-credit": { kind: "taxCredit", excludeFromEstimate: true, note: "non-refundable; conditional on eligible renovation spending" },
  "multigenerational-home-renovation-tax-credit": { kind: "taxCredit", excludeFromEstimate: true, note: "14.5% of up to $50,000 in eligible expenses, to a maximum of $7,250 for the 2025 tax year" },
  "excise-gasoline-tax-refund": { kind: "taxCredit", excludeFromEstimate: true, note: "Part of the federal excise tax on gasoline you buy; no per-litre amount is published" },
  "bc-sales-tax-credit": { kind: "taxCredit", excludeFromEstimate: true, annualMax: 75, note: "income-tested refundable credit, up to $75/person" },
  "bc-property-tax-deferment-disabilities": { kind: "access", excludeFromEstimate: true, note: "a repayable low-interest loan, not a payment" },
  "bc-fair-pharmacare": { kind: "coverage", excludeFromEstimate: true, note: "income-based drug coverage" },
  "bc-msp-supplementary-benefits": { kind: "coverage", excludeFromEstimate: true, note: "$23 per visit toward six covered services, up to a combined 10 visits each calendar year" },
  "bc-pharmacare-plan-c": { kind: "coverage", excludeFromEstimate: true, note: "100% of eligible drug costs for people on assistance" },
  "bc-pharmacare-plan-g": { kind: "coverage", excludeFromEstimate: true, note: "100% of eligible costs for covered psychiatric medications" },
  "bc-fnha-health-benefits": { kind: "coverage", excludeFromEstimate: true, note: "100% of eligible prescriptions plus dental, vision, medical transportation, mental health and medical supplies" },
  "bc-pharmacare-plan-p": { kind: "coverage", excludeFromEstimate: true, note: "100% coverage of eligible costs for medications used in palliative care and in the Plan P formulary" },
  "bc-healthy-kids": { kind: "coverage", excludeFromEstimate: true, note: "children: dental (<=$2,000/2yr), glasses, hearing" },
  "bc-dental-supplement": { kind: "coverage", excludeFromEstimate: true, note: "basic dental for people on assistance" },
  "bc-optical-supplement": { kind: "coverage", excludeFromEstimate: true, note: "eye exam + glasses at ministry rates" },
  "bc-medical-equipment-devices": { kind: "coverage", excludeFromEstimate: true, note: "pre-approved medical equipment at ministry rates" },
  "bc-medical-transportation": { kind: "coverage", excludeFromEstimate: true, note: "essential medical travel costs" },
  "bc-at-home-medical": { kind: "coverage", excludeFromEstimate: true, note: "per-item equipment, therapy, dental/optical, PharmaCare Plan F" },
  "bc-at-home-saet": { kind: "coverage", excludeFromEstimate: true, note: "OT/PT/speech therapy (<=$5,760/yr each)" },
  "bc-bus-pass": { kind: "discount", excludeFromEstimate: true, note: "no annual fee for PWD; $45/yr low-income seniors" },
  "handydart-translink": { kind: "discount", excludeFromEstimate: true, note: "1-zone fare door-to-door transit" },
  "handycard-translink": { kind: "access", excludeFromEstimate: true, note: "concession-fare photo ID; attendant rides free" },
  "taxisaver-translink": { kind: "discount", excludeFromEstimate: true, note: "half-price taxi coupons for HandyCard holders" },
  "handydart-bctransit": { kind: "discount", excludeFromEstimate: true, note: "free registration; attendants ride free" },
  "taxi-saver-bctransit": { kind: "discount", excludeFromEstimate: true, note: "half-price taxi coupons" },
  "bc-fuel-tax-refund-disabilities": { kind: "discount", excludeFromEstimate: true, note: "may receive up to $500 each calendar year for a qualifying vehicle registered in the program and a 25% discount off ICBC basic Autoplan insurance (including electric vehicles)" },
  "bc-icbc-disability-discount": { kind: "discount", excludeFromEstimate: true, note: "may get 25% off ICBC basic Autoplan" },
  "vancouver-leisure-access": { kind: "discount", excludeFromEstimate: true, note: "free pool/rink admission + 50% off fitness" },
  "surrey-leisure-access": { kind: "discount", excludeFromEstimate: true, note: "free pass (0-18/60+) or 75% off adults; 75% off most courses" },
  "burnaby-fair-play": { kind: "discount", excludeFromEstimate: true, note: "$250/person ($500/child) credit + annual Be Active Pass" },
  "richmond-rec-fee-subsidy": { kind: "discount", excludeFromEstimate: true, note: "Unlimited free admission to many drop-in programs and services + 90% off most registered programs (up to $300/year for children and youth or $100/year for adults and seniors)" },
  "victoria-life": { kind: "discount", excludeFromEstimate: true, note: "2 yrs free drop-ins (opens early 2027) + $80-120 program credit" },
  "saanich-life": { kind: "discount", excludeFromEstimate: true, note: "Choose for two years: Saanich free drop-ins, 52 regional visits/year and a one-time $80–$120 age-based Saanich program grant; or 50% off an annual Regional Recreation Pass" },
  "kelowna-recreation-assistance": { kind: "discount", excludeFromEstimate: true, note: "credit toward a pass or City programs" },
  "coquitlam-far": { kind: "discount", excludeFromEstimate: true, note: "50 drop-in passes + $225 credit per member" },
  "kamloops-arch": { kind: "discount", excludeFromEstimate: true, note: "up to $400/yr recreation credits" },
  "bc-clbc": { kind: "services", excludeFromEstimate: true, note: "individually planned developmental-disability services" },
  "bc-supported-child-development": { kind: "services", excludeFromEstimate: true, note: "consulting/support for inclusive child care" },
  "bc-workbc-assistive-technology": { kind: "services", excludeFromEstimate: true, note: "funded assistive technology for work" },
  "bc-workbc-employment-services": { kind: "services", excludeFromEstimate: true, note: "free employment services" },
  "bc-work-able-internship": { kind: "access", excludeFromEstimate: true, note: "paid BC Public Service internship (up to 24 months)" },
  "bc-pwd-designation": { kind: "access", excludeFromEstimate: true, note: "gateway designation — no payment on its own" },
  "sparc-parking-permit": { kind: "access", excludeFromEstimate: true, note: "accessible parking placard; fee set by SPARC BC" },
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
 * AISH/ADAP remains deliberately absent: Alberta's public guidance says the
 * report must be completed by a medical professional registered in Alberta, but
 * does not publish an exhaustive profession list.
 */
const BENEFIT_SIGNERS = {
  "cpp-disability": ["family doctor", "nurse practitioner"],
  "parking-placard": ["family doctor", "occupational therapist", "physiotherapist", "surgeon", "podiatrist", "nurse practitioner", "chiropractor"],
};

/* Current CRA DTC certification matrix, verified 2026-07-22.
 *
 * The Spring Economic Update 2026 proposes broader scopes and adding
 * podiatrists, but those changes are not treated as current rules here. */
const DTC_SIGNER_SCOPES = [
  { name: "Medical doctor", search: "family doctor", scope: "All impairments" },
  { name: "Nurse practitioner", search: "nurse practitioner", scope: "All impairments" },
  { name: "Optometrist", search: "optometrist", scope: "Vision only" },
  { name: "Audiologist", search: "audiologist", scope: "Hearing only" },
  { name: "Occupational therapist", search: "occupational therapist", scope: "Walking, feeding or dressing only" },
  { name: "Physiotherapist", search: "physiotherapist", scope: "Walking only" },
  { name: "Psychologist", search: "psychologist", scope: "Mental functions only" },
  { name: "Speech-language pathologist", search: "speech-language pathologist", scope: "Speaking only" },
];
const DTC_SIGNER_SOURCE =
  "https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit/how-apply-dtc.html";

const BENEFIT_META = {
  "yorkton-discounted-monthly-pass": { difficulty: 2, effort: "Buy the pass in person at City Hall.", wait: "Not published" },
  "yorkton-access-transit": { difficulty: 3, effort: "Register in advance through SaskAbilities.", wait: "Not published" },
  "saskatoon-accessible-parking-permit-subsidy": { difficulty: 3, effort: "Apply for the subsidy first, then buy the permit at City Hall.", wait: "Not published" },
  "prince-albert-access-transit": { difficulty: 3, effort: "Contact the Community Service Centre and book each ride ahead.", wait: "Not published" },
  "moose-jaw-paratransit": { difficulty: 3, effort: "Fill in a form and mail or email it, then wait for a decision.", wait: "Within 21 days of a completed application" },
  "moose-jaw-discounted-monthly-pass": { difficulty: 2, effort: "Bring proof of your program and buy the pass in person.", wait: "Not published" },
  "regina-discounted-31-day-pass": { difficulty: 2, effort: "Call the Transit Information Centre, then buy the first pass in person.", wait: "Not published" },
  "north-battleford-handi-bus": { difficulty: 2, effort: "Phone call", wait: "Not published" },
  "saskatoon-low-income-bus-pass": { difficulty: 2, effort: "Form by mail with tax and address proof", wait: "Three to four weeks" },
  "saskatoon-leisure-access-program": { difficulty: 2, effort: "Online form with tax and address proof", wait: "Three to six weeks" },
  "saskatoon-access-transit": { difficulty: 3, effort: "Application on a separate page", wait: "Not published" },
  "regina-paratransit": { difficulty: 3, effort: "Application, possible interview", wait: "Most within two weeks" },
  "regina-affordable-access": { difficulty: 2, effort: "One form with income proof", wait: "About three weeks" },
  "sk-cochlear-processor": { difficulty: 3, effort: "Clinical assessment through the Saskatchewan Health Authority", wait: "Not published" },
  "sk-early-childhood-intervention": { difficulty: 1, effort: "Phone your regional program; self-referral is allowed", wait: "Not published" },
  "sk-low-income-tax-credit": { difficulty: 1, effort: "File your income tax return", wait: "Paid quarterly by the CRA" },
  "sk-active-families-benefit": { difficulty: 1, effort: "Claim on your income tax return", wait: "Not published" },
  "sk-accessible-parking": { difficulty: 2, effort: "Form signed by a health professional, plus $10 fee", wait: "Not published" },
  "sk-personal-care-home-benefit": { difficulty: 3, effort: "Application form with income documents and direct deposit form", wait: "Not published" },
  "sk-eapd": { difficulty: 2, effort: "Phone SaskJobs, then write a career or service plan", wait: "Not published" },
  "sk-adaptations-for-independence": { difficulty: 4, effort: "Application form with income and asset documents, and a health practitioner's identification of changes", wait: "Not published" },
  "sk-home-care": { difficulty: 3, effort: "Assessment by the health authority, plus an agreement for individualized funding", wait: "Not published" },
  "sk-family-respite-intellectual-disability": { difficulty: 3, effort: "Application, two assessments and income verification", wait: "Not published" },
  "sk-cognitive-disability-strategy": { difficulty: 3, effort: "Application package sent to a consultant, with help available", wait: "Not published" },
  "sk-autism-individualized-funding": { difficulty: 3, effort: "Online application with ID, diagnosis form and bank details, then proof of expenses", wait: "Not published" },
  "sk-seniors-income-plan": { difficulty: 1, effort: "No application. File taxes and apply for OAS/GIS.", wait: "Not published" },
  "sk-seniors-drug-plan": { difficulty: 2, effort: "One application form with consent or income documents.", wait: "Not published" },
  "sk-special-support": { difficulty: 2, effort: "One application form with consent or income documents.", wait: "Not published" },
  "sk-family-health-benefits": { difficulty: 2, effort: "Call for a pre-assessment.", wait: "Not published" },
  "sk-supplementary-health": { difficulty: 1, effort: "Approval follows enrolment in a qualifying program.", wait: "Not published" },
  "sk-sail": { difficulty: 3, effort: "Needs a professional referral and program-specific criteria.", wait: "Not published" },
  "sk-housing-benefit": { difficulty: 2, effort: "One online or PDF application with documents.", wait: "Contact SHC if no reply within 14 business days" },
  "sk-employment-incentive": { difficulty: 2, effort: "Online application with income documents, then monthly income reports.", wait: "Not published" },
  "sk-income-support": { difficulty: 2, effort: "Online or phone application plus a questionnaire within 30 days.", wait: "Not published" },
  "sk-said": { difficulty: 3, effort: "Online or phone application, a disability assessment and a service questionnaire.", wait: "Not published" },
  "on-childrens-rehab": { difficulty: 2, effort: "Contact your local Children's Treatment Centre; no referral needed", wait: "Not published" },
  "bc-subsidized-housing": { difficulty: 4, effort: "Online or paper application with proof of disability and income", wait: "Not published" },
  "ab-sharp": { difficulty: 3, effort: "Application form, estimates and a land title caveat", wait: "Not published" },
  "ab-seniors-special-needs-assistance": { difficulty: 3, effort: "Receipts or estimates, plus medical notes for some items", wait: "Not published" },
  "ab-seniors-dental-optical": { difficulty: 2, effort: "Enrol in Seniors Financial Assistance, then claim", wait: "Not published" },
  "ab-seniors-benefit": { difficulty: 2, effort: "Application form; income is checked with the CRA", wait: "Not published" },
  "ab-rent-assistance-benefit": { difficulty: 3, effort: "Apply through a local housing provider", wait: "Not published" },
  "ab-income-support": { difficulty: 3, effort: "Online application with ID and 60 days of bank statements", wait: "Typically 2 weeks" },
  "ab-home-care": { difficulty: 3, effort: "Needs a professional assessment", wait: "Not published" },
  "ab-child-family-benefit": { difficulty: 1, effort: "File your taxes; no separate form", wait: "Paid 4 times a year" },
  "ab-brain-injury": { difficulty: 1, effort: "Contact a regional agency", wait: "Not published" },
  "ab-blue-cross-non-group": { difficulty: 2, effort: "Application form, plus a second form for the subsidy", wait: "Coverage starts in the fourth month" },
  "bc-hearing-supplements": { difficulty: 4, effort: "Hearing assessment, provider submission to Pacific Blue Cross, prior approval", wait: "Not published" },
  "bc-safer": { difficulty: 3, effort: "Paper application with income, rent and ID documents", wait: "Not published" },
  "bc-rental-assistance-program": { difficulty: 3, effort: "Paper application with income, rent and asset documents", wait: "Not published" },
  "bc-ppmb": { difficulty: 3, effort: "PPMB application with a health professional's input", wait: "Not published" },
  "bc-nursing-support-services": { difficulty: 3, effort: "Referral from your child's physician or nurse practitioner", wait: "Not published" },
  "bc-income-assistance": { difficulty: 3, effort: "Online application, work search and eligibility assessment", wait: "Not published" },
  "bc-home-support": { difficulty: 2, effort: "Contact health authority, then assessments", wait: "Not published" },
  "bc-family-benefit": { difficulty: 1, effort: "File taxes and register for the Canada child benefit", wait: "Not published" },
  "bc-csil": { difficulty: 3, effort: "Contact health authority, assessments, then act as an employer", wait: "Not published" },
  "on-oesp": { difficulty: 2, effort: "Online or mail application with CRA consent", wait: "About 4 to 6 weeks for a decision" },
  "on-odsp-health-benefits": { difficulty: 3, effort: "Ask your ODSP office; most benefits need a form and approval", wait: "Not published" },
  "on-odsp-employment-supports": { difficulty: 2, effort: "Report earnings monthly and ask your caseworker for benefits", wait: "Not published" },
  "on-northern-health-travel-grant": { difficulty: 3, effort: "Application with original receipts and a provider form", wait: "Not published" },
  "on-home-community-care": { difficulty: 3, effort: "Phone call and an in-home needs assessment", wait: "Not published" },
  "on-drug-benefit": { difficulty: 2, effort: "Automatic for some groups; others ask a caseworker or pharmacist", wait: "Not published" },
  "on-trillium-benefit": { difficulty: 2, effort: "File your tax return with the ON-BEN form", wait: "Payments start in July if you file by April 30" },
  "on-seniors-dental": { difficulty: 2, effort: "Online or mail application", wait: "Not published" },
  "on-ontario-works": { difficulty: 3, effort: "Online, phone or in-person application with documents", wait: "Decision within four business days once all information is received" },
  "on-healthy-smiles": { difficulty: 2, effort: "Online or mail application, or automatic enrolment", wait: "Not published" },
  "on-gains": { difficulty: 1, effort: "Usually automatic if you get Old Age Security and the Guaranteed Income Supplement", wait: "Not published" },
  "on-enhanced-respite": { difficulty: 3, effort: "Apply through a ministry regional office, then claim costs", wait: "Not published" },
  "on-dso-adult-services": { difficulty: 3, effort: "Two assessment meetings with a DSO assessor", wait: "Not published" },
  "on-child-benefit": { difficulty: 2, effort: "Apply for the Canada Child Benefit and file taxes each year", wait: "Not published" },
  "west-vancouver-recreation-financial-assistance": { difficulty: 4, effort: "Paper package, drop-off and interview", wait: "Two to six weeks" },
  "taber-fee-assistance": { difficulty: 3, effort: "FCSS application, then card pickup", wait: "Not published" },
  "sarnia-cnib-pass": { difficulty: 1, effort: "One visit with your CNIB card", wait: "Not published" },
  "port-coquitlam-financial-assistance": { difficulty: 3, effort: "Form plus CRA income statement or partner form", wait: "10 to 14 business days (busy in January)" },
  "nelson-rdck-leisure-access": { difficulty: 3, effort: "Online form with uploads", wait: "Up to three weeks" },
  "morinville-wrap": { difficulty: 2, effort: "Form plus income proof", wait: "Not published" },
  "langley-leisure-access-grant": { difficulty: 2, effort: "Form plus three documents", wait: "Within three weeks" },
  "high-river-community-access-program": { difficulty: 2, effort: "In-person application with income papers", wait: "Not published" },
  "dawson-creek-leisure-access": { difficulty: 3, effort: "Printed form and a Trusted Partner signature", wait: "Up to three weeks after the deadline" },
  "cornwall-community-bus-pass": { difficulty: 2, effort: "In-person visit with proof", wait: "Not published" },
  "brantford-recreation-subsidy": { difficulty: 2, effort: "Online form plus income papers", wait: "Not published" },
  "white-rock-leisure-access": { difficulty: 2, effort: "One application per family", wait: "Not published" },
  "terrace-affordable-recreation-access": { difficulty: 3, effort: "Visit the Aquatic Centre and a verifying office", wait: "Not published" },
  "squamish-recreation-access": { difficulty: 3, effort: "Gather original documents and apply at the recreation centre", wait: "Not published" },
  "quesnel-leisure-access": { difficulty: 2, effort: "Fill in a form and show proof", wait: "Not published" },
  "prince-rupert-recreation-access": { difficulty: 3, effort: "Collect proof of assistance or income, then apply online or on paper", wait: "Not published" },
  "port-moody-leisure-access": { difficulty: 3, effort: "Gather several documents and apply in person", wait: "Not published" },
  "pitt-meadows-fee-subsidy": { difficulty: 3, effort: "Collect income and address proof, then complete a form", wait: "Not published" },
  "penticton-access-pass": { difficulty: 2, effort: "Fill in one form", wait: "Not published" },
  "penticton-life": { difficulty: 2, effort: "Fill in one form and bring documents to the Community Centre", wait: "Not published" },
  "mission-play-pass": { difficulty: 2, effort: "Short application, small fee", wait: "Up to three weeks" },
  "duncan-leisure-access": { difficulty: 2, effort: "Online form with ID and Notice of Assessment or referral", wait: "Not published" },
  "cranbrook-leisure-access": { difficulty: 3, effort: "Agency adjudication, then a City registration visit", wait: "About 1 week to process" },
  "courtenay-comox-rap-leap": { difficulty: 2, effort: "One combined form with residency proof and BC Services Cards", wait: "Not published" },
  "colwood-langford-life": { difficulty: 2, effort: "One family form with residency proof and Notice of Assessment", wait: "Not published" },
  "campbell-river-life": { difficulty: 2, effort: "One form with proof of address and income", wait: "Not published" },
  "peterborough-ow-odsp-transit-pass": { difficulty: 1, effort: "One visit to the bus terminal with statement and ID", wait: "Not published" },
  "peterborough-recreation-subsidy": { difficulty: 2, effort: "Online application with uploaded documents", wait: "Not published" },
  "cornwall-fair": { difficulty: 2, effort: "Email a form with ID and income documents", wait: "Not published" },
  "chatham-kent-affordable-bus-pass": { difficulty: 3, effort: "Paper application with tax notices and ID", wait: "Not published" },
  "belleville-recreation-fee-assistance": { difficulty: 3, effort: "Online application, then an appointment with documents", wait: "Contacted within 10 business days" },
  "whitecourt-recreation-fee-assistance": { difficulty: 3, effort: "In-person application at Guest Services", wait: "Not published" },
  "strathmore-community-access-card": { difficulty: 3, effort: "In-person visit with income and ID documents", wait: "Not published" },
  "rocky-mountain-house-rfap": { difficulty: 2, effort: "One visit to the FCSS office with tax return or referral form", wait: "Not published" },
  "edson-leisure-assist": { difficulty: 2, effort: "Fill in a short form and attach one proof document", wait: "About ten business days" },
  "drayton-valley-recreation-fee-assistance": { difficulty: 3, effort: "Fill in a form and gather documents for every adult", wait: "Not published" },
  "chestermere-community-access-program": { difficulty: 2, effort: "Submit a short online form, then give proof to staff", wait: "Not published" },
  "blackfalds-recreation-fee-assistance": { difficulty: 3, effort: "Fill in a multi-section paper form and attach income proof", wait: "Two to four weeks" },
  "banff-access-program": { difficulty: 3, effort: "Email several documents, including income, address and employment proof", wait: "Not published" },
  "prince-george-lap": { difficulty: 2, effort: "One form with income proof and photo ID", wait: "Up to 10 days, often a day or two" },
  "new-westminster-financial-assistance": { difficulty: 2, effort: "Bring documents to a recreation facility", wait: "Not published" },
  "nanaimo-leap": { difficulty: 2, effort: "Online form or print and take in the front desk", wait: "Not published" },
  "maple-ridge-access-pass-disability": { difficulty: 2, effort: "Online form with uploads, or in person", wait: "Up to 10 business days" },
  "maple-ridge-access-pass-financial": { difficulty: 2, effort: "Online form with uploads, or in person", wait: "Up to 10 business days" },
  "abbotsford-specialized-access": { difficulty: 3, effort: "Get a physician to complete a form, then apply in person", wait: "Not published" },
  "abbotsford-prc-subsidy": { difficulty: 3, effort: "Gather several documents and apply in person", wait: "Up to 2 weeks" },
  "halton-split": { difficulty: 2, effort: "Online application with a Halton 311 account, or call 311; documents within 10 business days", wait: "Not published" },
  "kingston-affordable-transit-pass": { difficulty: 2, effort: "One application to MFAP, online, by email or in person.", wait: "Not published" },
  "niagara-transit-benefit-pass": { difficulty: 2, effort: "Bring ID and a benefit statement to a terminal or outlet. Low-income applicants also fill in an application with proof of income.", wait: "Not published" },
  "waterloo-ontario-renovates": { difficulty: 3, effort: "Application with identification, income, property, tax, mortgage and insurance documents", wait: "First come first serve; eligible households are contacted by phone to arrange a home inspection" },
  "waterloo-homemaking-support": { difficulty: 2, effort: "Apply through Caredove, then provide full financial and health information when you reach the top of the waitlist", wait: "Currently approximately 2–3 years, except under special circumstances" },
  "waterloo-curbside-waste-support": { difficulty: 2, effort: "Apply to the Region for assisted cart collection or the medical exemption", wait: "Ask the Region about current processing time" },
  "grt-affordable-transit": { difficulty: 2, effort: "Online application with household income information and supporting documents", wait: "Not published" },
  "grt-cnib-pass": { difficulty: 1, effort: "Call GRT to arrange a special CNIB EasyGO fare card", wait: "Not published" },
  "grt-mobilityplus": { difficulty: 3, effort: "Two-part application, including a Health/Disability Professional form", wait: "Not published" },
  "grt-taxi-coupons": { difficulty: 1, effort: "Order by phone, buy in person, or mail a cheque with your MobilityPLUS ID", wait: "Not published" },
  "grt-support-person": { difficulty: 2, effort: "Online or paper application; a PAL card number, or the health-care professional's section (completed by a professional with a listed designation)", wait: "GRT sends a letter within 14 calendar days of receiving your application saying whether you are approved" },
  "york-region-homemakers": { difficulty: 2, effort: "Phone York Region and go through a financial need assessment", wait: "Not published" },
  "york-region-recreation-subsidies": { difficulty: 2, effort: "Apply through York Region, then register with your municipal recreation department", wait: "Not published" },
  "ottawa-community-pass": { difficulty: 2, effort: "Set the discount at a Customer Service Centre with your ODSP number and Presto card", wait: "Not published" },
  "ottawa-access-pass": { difficulty: 2, effort: "Register with Para Transpo, then set the discount at a Customer Service Centre", wait: "Not published" },
  "ottawa-equipass": { difficulty: 2, effort: "Application and consent form plus a CRA Notice of Assessment", wait: "Not published" },
  "ottawa-a-card": { difficulty: 1, effort: "Bring a CNIB or Guide Dog photo ID card to a Customer Service Centre", wait: "Not published" },
  "london-ontario-renovates": { difficulty: 3, effort: "Application package with income, property and asset documents plus three repair estimates", wait: "Not published — first come, first served until funds run out" },
  "windsor-affordable-pass": { difficulty: 2, effort: "Application through the local municipal transit department with proof of income and residency", wait: "Not published — funding is first-come, first-served and subject to local demands and budgets" },
  "windsor-recreation-assistance": { difficulty: 2, effort: "Application through the local municipal recreation department with proof of income and residency", wait: "Not published — funding is first-come, first-served and subject to local demands and budgets" },
  "hamilton-fare-assist": { difficulty: 2, effort: "Application with your Ontario Works or ODSP Member ID, or a Notice of Assessment for each family member", wait: "Not published" },
  "brampton-activeassist": { difficulty: 2, effort: "Application online, in person at a recreation centre, or by mail, with supporting documents", wait: "Not published — the City has noted longer waits" },
  "mississauga-activeassist": { difficulty: 2, effort: "Application at a community centre or online with original supporting documents", wait: "Within 15 business days" },
  "ottawa-hand-in-hand": { difficulty: 2, effort: "Application form, approved in person at a recreation or cultural facility", wait: "Not published" },
  "toronto-fair-pass": { difficulty: 2, effort: "Online application with a PRESTO card number, plus proof of income or an OW/ODSP member ID", wait: "Not published" },
  "toronto-welcome-policy": { difficulty: 2, effort: "Application with proof of income for each family member 18 or older, or an OW, ODSP or Child Care Fee Subsidy ID", wait: "Email on the outcome within 5 business days; paper applications can take up to 8 weeks; missing documents add time" },
  "trillium-drug-program": { difficulty: 2, effort: "Household application, online or on paper", wait: "Not published" },
  "passport-program": { difficulty: 4, effort: "Apply through Developmental Services Ontario, then work with a local Passport agency", wait: "Not published" },
  hvmp: { difficulty: 3, effort: "Application details via the March of Dimes website; eligibility assessed by the program's service coordinator", wait: "Not published" },
  ssah: { difficulty: 3, effort: "Application with medical documentation, sent to your local Ministry regional office", wait: "Not published" },
  acsd: { difficulty: 3, effort: "Online or paper application reviewed by a special agreements officer", wait: "Not published" },
  "on-adp": { difficulty: 3, effort: "Assessment by a registered authorizer, then purchase (through a registered vendor, except for grant-funded equipment)", wait: "Not published" },
  "ontario-autism-program": { difficulty: 2, effort: "Create an AccessOAP account and register with the written diagnosis", wait: "Not published" },
  odsp: { difficulty: 4, effort: "Online, phone or in-person application, plus a Disability Determination Package unless you are in a prescribed class", wait: "A few months" },
  "on-parking-permit": { difficulty: 2, effort: "Application + a regulated health professional certifies your condition", wait: "Up to 3 weeks (online or mail); about 7 weeks (in person)" },
  "dres": { difficulty: 3, effort: "Application + disability documentation", wait: "varies" },
  "cpp-childrens-benefit": { difficulty: 2, effort: "Apply with the parent's CPP-D", wait: "monthly once approved" },
  "home-accessibility-tax-credit": { difficulty: 2, effort: "Claimed on your tax return", wait: "at tax time" },
  "multigenerational-home-renovation-tax-credit": { difficulty: 3, effort: "Claimed on your tax return", wait: "at tax time" },
  "excise-gasoline-tax-refund": { difficulty: 3, effort: "A form + practitioner certification", wait: "varies" },
  "canadian-dental-care-plan": { difficulty: 2, effort: "~20–30 min online or by phone", wait: "varies by application date" },
  "disability-supports-deduction": { difficulty: 3, effort: "Claimed on your tax return", wait: "at tax time" },
  "medical-expense-tax-credit": { difficulty: 2, effort: "Claimed on your tax return", wait: "at tax time" },
  "canada-caregiver-credit": { difficulty: 2, effort: "Claimed on your tax return", wait: "at tax time" },
  "ab-service-dog-id-card": { difficulty: 2, effort: "Application + proof of assessment", wait: "Card mailed in approximately 2 weeks" },
  "ab-capcc": { difficulty: 3, effort: "Application through continuing care", wait: "varies" },
  "ab-special-needs-housing": { difficulty: 3, effort: "Housing application + income verification", wait: "waitlists vary" },
  "bc-msp-supplementary-benefits": { difficulty: 2, effort: "Register with MSP (no cost)", wait: "varies" },
  "bc-pharmacare-plan-g": { difficulty: 1, effort: "Your prescriber applies for you", wait: "varies" },
  "bc-pharmacare-plan-p": { difficulty: 1, effort: "Set up by your care team", wait: "varies" },
  "bc-fnha-health-benefits": { difficulty: 2, effort: "Enrol with the First Nations Health Authority", wait: "varies" },
  "bc-additional-home-owner-grant": { difficulty: 2, effort: "Claimed with your property taxes", wait: "at tax time" },
  "bc-raha": { difficulty: 4, effort: "BC Housing application + possible OT/PT assessment", wait: "varies" },
  dtc: { difficulty: 3, effort: "30–60 min + a doctor visit", wait: "Varies" },
  "cdb-adult": { difficulty: 2, effort: "15–30 min (after DTC)", wait: "First payment the month after approval" },
  "child-disability-benefit": { difficulty: 1, effort: "Automatic after DTC + CCB", wait: "next CCB payment" },
  rdsp: { difficulty: 2, effort: "~1 hr at a bank/credit union", wait: "same day to open" },
  "cwb-disability": { difficulty: 1, effort: "Claimed on your tax return", wait: "at tax time" },
  "cpp-disability": { difficulty: 5, effort: "2–4 hrs + a doctor's report", wait: "~4 months" },
  "csg-disability": { difficulty: 2, effort: "With your student aid application", wait: "with student aid" },
  "csg-dse": { difficulty: 2, effort: "Student aid, disability documents, written confirmation of need and cost document", wait: "You can apply at the same time as student aid" },
  aish: { difficulty: 4, effort: "Application + medical report", wait: "Check with Alberta Supports" },
  adap: { difficulty: 4, effort: "Application + medical report", wait: "Check with Alberta Supports" },
  aadl: { difficulty: 3, effort: "Assessment with an OT / authorizer", wait: "varies" },
  ramp: { difficulty: 3, effort: "Multi-form application + income verification", wait: "About 30 days for a decision" },
  pdd: { difficulty: 3, effort: "Assessment-based", wait: "varies" },
  fscd: { difficulty: 2, effort: "Meet with an FSCD worker", wait: "varies" },
  "ab-grant-disability": { difficulty: 2, effort: "Student aid + current Schedule 4 and cost quotes", wait: "with student aid" },
  "adult-health-benefit": { difficulty: 2, effort: "Form + consent for CRA to verify income", wait: "a few weeks" },
  "child-health-benefit": { difficulty: 2, effort: "Form + proof of income", wait: "a few weeks" },
  "parking-placard": { difficulty: 1, effort: "Short form + a registry visit", wait: "often same day" },
  "calgary-fair-entry": { difficulty: 1, effort: "Online + proof of income", wait: "1–2 weeks" },
  "edmonton-fare-assistance": { difficulty: 1, effort: "Application + proof of income", wait: "8–12 weeks" },
  "reddeer-fee-assistance": { difficulty: 1, effort: "Online form + proof", wait: "up to 10 business days" },
  "lethbridge-fee-assistance": { difficulty: 1, effort: "Online form or call 311", wait: "apply any time" },
  "medicinehat-fair-entry": { difficulty: 1, effort: "One form, lasts up to 2 years", wait: "Processed within two weeks; missing information may delay approval" },
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
  "bc-pwd-designation": { difficulty: 4, effort: "Assistance application + PWD medical sections", wait: "Not published — ask the ministry" },
  "bc-fair-pharmacare": { difficulty: 1, effort: "Online registration + income consent", wait: "Confirm when you register" },
  "bc-pharmacare-plan-c": { difficulty: 1, effort: "Usually automatic with qualifying assistance", wait: "Automatic when ministry status is active" },
  "bc-healthy-kids": { difficulty: 2, effort: "Health-benefit application + income information", wait: "Not published — ask the program" },
  "bc-medical-transportation": { difficulty: 2, effort: "Travel request + medical confirmation", wait: "Ask before arranging travel" },
  "handydart-translink": { difficulty: 2, effort: "Application + health-professional section", wait: "HandyDART application processed within 10 days of confirming receipt; HandyCard 4 to 6 weeks" },
  "handycard-translink": { difficulty: 2, effort: "Same application as HandyDART", wait: "Allow 4 to 6 weeks for processing" },
  "taxisaver-translink": { difficulty: 1, effort: "HandyCard first, then order coupons", wait: "After HandyCard approval" },
  "handydart-bctransit": { difficulty: 2, effort: "Regional registration + supporting information", wait: "Varies by transit system" },
  "taxi-saver-bctransit": { difficulty: 1, effort: "Register for handyDART, then buy coupons", wait: "Varies by transit system" },
  "bc-disability-assistance-pwd": { difficulty: 5, effort: "Financial application + PWD designation evidence", wait: "Not published — ask the ministry" },
  "bc-autism-funding-under-6": { difficulty: 3, effort: "Application + diagnosis form for your assessment route", wait: "Ask Autism Funding about current processing" },
  "bc-autism-funding-6-18": { difficulty: 3, effort: "Application + diagnosis form for your assessment route", wait: "Ask Autism Funding about current processing" },
  "bc-cy-disability-benefit": { difficulty: 3, effort: "Transition or needs-based ministry assessment", wait: "Phased rollout through April 2027" },
  "bc-monthly-nutritional-supplement": { difficulty: 3, effort: "Form HR2847 + practitioner or dietitian section", wait: "Not published — ask the ministry" },
  "bc-optical-supplement": { difficulty: 1, effort: "Show your BC Services Card to the provider", wait: "Coverage checked by the provider" },
  "bc-bus-pass": { difficulty: 1, effort: "Request online or by phone", wait: "Allow up to 6 weeks" },
  "sparc-parking-permit": { difficulty: 2, effort: "Application + medical-professional referral", wait: "About 2–3 weeks" },
  "bc-medical-equipment-devices": { difficulty: 4, effort: "Prescription, assessment and supplier quote before purchase", wait: "Varies with assessments and pre-approval" },
  "bc-at-home-medical": { difficulty: 4, effort: "Application + functional assessment and medical records", wait: "Not published — ask the program" },
  "bc-supported-child-development": { difficulty: 2, effort: "Contact the local program for intake", wait: "Varies by community and available services" },
  "bc-at-home-saet": { difficulty: 3, effort: "AHP enrolment + therapy request", wait: "Varies with assessment and local capacity" },
  "bc-clbc": { difficulty: 4, effort: "Eligibility request + diagnostic and adaptive-function records", wait: "Not published — ask your local CLBC office" },
  "bc-csg-students-disabilities": { difficulty: 2, effort: "StudentAid BC application + disability verification", wait: "With your student-aid assessment" },
  "bc-csg-services-equipment": { difficulty: 3, effort: "StudentAid BC application + disability status application (Appendix 8 if you applied before June 19, 2026) + services or equipment request through your school", wait: "With your student-aid assessment" },
  "bc-access-grant-students-disabilities": { difficulty: 2, effort: "Through StudentAid BC disability funding", wait: "With your student-aid assessment" },
  "bc-supplemental-bursary-students-disabilities": { difficulty: 2, effort: "Through StudentAid BC disability funding", wait: "With your student-aid assessment" },
  "bc-assistance-program-students-disabilities": { difficulty: 3, effort: "Student aid + documented exceptional education costs", wait: "After other disability funding is assessed" },
  "bc-learning-disability-assessment-bursary": { difficulty: 3, effort: "Accessibility-office referral + assessment paperwork", wait: "Confirm timing with your school" },
  "bc-access-grant-deaf-students": { difficulty: 3, effort: "StudentAid BC application + qualifying study plan", wait: "With your student-aid assessment" },
  "bc-dental-supplement": { difficulty: 1, effort: "Provider confirms ministry coverage", wait: "Coverage checked by the provider" },
  "bc-home-reno-tax-credit": { difficulty: 2, effort: "Keep receipts and claim on your tax return", wait: "At tax assessment" },
  "bc-work-able-internship": { difficulty: 3, effort: "Online application during an open intake", wait: "Depends on the current intake" },
  "bc-workbc-assistive-technology": { difficulty: 3, effort: "Online request + work-barrier assessment and quotes", wait: "Varies by assessment and equipment" },
  "bc-workbc-employment-services": { difficulty: 1, effort: "Online registration or local WorkBC intake", wait: "Contact your WorkBC centre" },
  "bc-fuel-tax-refund-disabilities": { difficulty: 2, effort: "Register once, then submit fuel receipts", wait: "Processing takes up to 4 weeks" },
  "bc-icbc-disability-discount": { difficulty: 1, effort: "Fuel-tax registration, then ask an Autoplan broker", wait: "At policy transaction" },
  "bc-property-tax-deferment-disabilities": { difficulty: 3, effort: "Annual online or paper application + eligibility records", wait: "Confirm before the property-tax deadline" },
  "bc-sales-tax-credit": { difficulty: 1, effort: "Claim on your income-tax return", wait: "With your tax assessment" },
  "vancouver-leisure-access": { difficulty: 2, effort: "Application + income or referral proof", wait: "Confirm with the City" },
  "surrey-leisure-access": { difficulty: 2, effort: "Application + income or assistance proof", wait: "Confirm with the City" },
  "burnaby-fair-play": { difficulty: 2, effort: "Application + residency and income proof", wait: "Confirm with the City" },
  "richmond-rec-fee-subsidy": { difficulty: 2, effort: "Application + residency and income proof", wait: "Confirm with the City" },
  "victoria-life": { difficulty: 2, effort: "Application + residency and income proof", wait: "Confirm with the City" },
  "saanich-life": { difficulty: 2, effort: "Online application + CRA income statements for most households, or documents for an alternative route", wait: "Allow time before registering" },
  "kelowna-recreation-assistance": { difficulty: 2, effort: "Email application + income assessment", wait: "Up to 2 weeks from submission, if all information is received" },
  "coquitlam-far": { difficulty: 2, effort: "Application + residency and income proof", wait: "Confirm with the City" },
  "kamloops-arch": { difficulty: 2, effort: "Annual ARCH/KamPASS application", wait: "Confirm with the City" },
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
     *  - all or almost all of the time = generally at least 90%
     *  - prolonged = has lasted, or is expected to last, 12+ continuous months
     *  - cumulative effect = limitations in 2+ categories that exist together
     *    all or almost all of the time and, even with appropriate therapy,
     *    devices and medication, combine to equal one marked restriction;
     *    life-sustaining therapy is a separate route
     * Do not add a criterion here that isn't on a CRA page. */
    plainTest: {
      lead:
        "Everything about the DTC hangs on four words: <b>severe and prolonged</b>. They don't mean what most people assume, and that misunderstanding is why people who qualify never apply.",
      points: [
        {
          h: "“Severe” is not about your diagnosis",
          p: "The CRA never asks how serious your condition sounds. It asks how much it limits you day to day. Two people with the identical diagnosis can get opposite answers — and someone with a condition you've never heard of can qualify. Never rule yourself out because your diagnosis doesn't sound bad enough.",
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
          h: "“All or almost all of the time” (generally at least 90%)",
          p: "This is where fluctuating conditions get lost. If you have good days, the question is not “are you always like this?” — it's whether the restriction is present all or almost all of the time (generally at least 90%). Describe your typical pattern, including good and bad days.",
        },
        {
          h: "Two smaller limits can add up to one big one",
          p: "For the <b>cumulative-effect</b> route, significant limitations in <b>two or more</b> categories must exist together all or almost all of the time (generally at least 90%). Even with appropriate therapy, devices and medication, their combined effect must be equivalent to being unable, or taking three times longer than someone of similar age without the impairment, to do an activity in one category, and must be present all or substantially all of the time (generally interpreted as 90% or more). Life-sustaining therapy is a separate route, not part of cumulative effect. Ask your practitioner about this route by name.",
        },
        {
          h: "“Prolonged” just means 12 months",
          p: "It has lasted, or is expected to last, a continuous 12 months. It does not mean permanent, and it does not mean forever — an impairment expected to last a year counts.",
        },
      ],
      foot:
        "The CRA's eight functional categories are walking, dressing, feeding, speaking, hearing, vision, eliminating (bladder or bowel), and mental functions. Life-sustaining therapy is a separate route. Your practitioner documents the impairment and its effects; the CRA decides eligibility.",
    },
    confirm: "CRA approval after an authorized practitioner certifies that the impairment is prolonged and its effects meet an official DTC route",
    taxNote: "The DTC is non-refundable — it only reduces income tax you owe. If your income is low, you can transfer it to a supporting spouse or parent instead, and the DTC approval still counts for the RDSP and the Canada Disability Benefit.",
    denials: [
      "The practitioner described the diagnosis instead of your day-to-day limitations.",
      "A section of Form T2201 was left incomplete.",
      "Limitations weren't shown to be present all or almost all of the time (generally at least 90%).",
      "Not enough detail on how much longer everyday tasks take you than others.",
    ],
    appeal: "Read the CRA decision letter and ask what information was missing. You may send additional medical information, request a review, or file a Notice of Objection within 90 days.",
    faqs: [
      { q: "Do I need a family doctor?", a: "Not always. A medical doctor or nurse practitioner can certify any impairment. Other practitioners can certify only the functional categories listed by the CRA, so check the official matrix before booking." },
      { q: "Does a diagnosis alone qualify me?", a: "No. Approval is about how much your condition limits daily functions, not the diagnosis name." },
      { q: "Worth checking if I don't pay much tax?", a: "It may still help. An unused amount may be transferable to an eligible supporting family member, and DTC approval is required for several other federal programs. Confirm the transfer and program rules for your situation." },
    ],
    related: ["rdsp", "cdb-adult", "child-disability-benefit", "cwb-disability"],
  },
  "cpp-disability": {
    confirm: "enough recent CPP contributions (usually 4 of the last 6 years) AND medical proof your disability is 'severe and prolonged' — it regularly stops you from any substantially gainful work",
    taxNote: "CPP-D is taxable income and can reduce income-tested benefits (AISH, GIS, provincial assistance). Private long-term disability (LTD) insurers usually subtract it from what they pay you.",
    denials: [
      "The disability wasn't shown to stop you from working at any job on a regular basis, not just your former job.",
      "Not enough CPP contributions in the qualifying period.",
      "The medical report was thin — describe your worst days, not your best.",
    ],
    appeal: "Request a reconsideration in writing within 90 days. If still denied, appeal to the Social Security Tribunal. Strong new medical evidence matters.",
    faqs: [
      { q: "Can I get CPP-D and the DTC?", a: "Yes — they're separate, and CPP-D can even support a DTC application." },
      { q: "What happens at 65?", a: "It automatically converts to your CPP retirement pension." },
      { q: "Can I work at all?", a: "There's a small allowable-earnings amount and a return-to-work provision so you can try working without losing benefits immediately." },
    ],
    related: ["dtc", "aish"],
  },
  aish: {
    confirm: "a severe disability that permanently prevents employment, AND income and assets under the AISH limits",
    taxNote: "AISH is not taxable. Other income and assets can affect assistance. If you receive AISH or ADAP, Alberta requires you to report the outcome of your Canada Disability Benefit and/or Disability Tax Credit application, including the approved CDB amount or a denial.",
    denials: [
      "The condition wasn't shown to be permanent, or was expected to improve with treatment.",
      "The medical didn't show that the disability permanently prevents employment.",
      "Income or assets over the limit.",
      "The financial assessment did not meet the program rules.",
    ],
    appeal: "Read Alberta's current decision and appeal information before acting; rules and routes can change during the AISH/ADAP transition.",
    faqs: [
      { q: "Do I apply separately for ADAP?", a: "No. Alberta's current application assesses both AISH and ADAP and places eligible applicants in the program that fits." },
      { q: "Do I need the DTC first?", a: "No, AISH is separate — but the DTC, CPP-D and RDSP are all worth applying for too." },
      { q: "How much will I receive?", a: "It depends on Alberta's current rules and your household. Use the official AISH/ADAP benefit estimator rather than relying on a general figure." },
    ],
    related: ["adap", "dtc", "cdb-adult", "cpp-disability", "aadl", "adult-health-benefit"],
  },
  adap: {
    confirm: "a severe disability that significantly impedes employment continuously or episodically, plus Alberta's age, residency, status and financial rules",
    taxNote: "Alberta's combined assessment decides the current benefit and how household income or assets affect it. If you receive ADAP or AISH, Alberta requires you to report the outcome of your Canada Disability Benefit and/or Disability Tax Credit application, including the approved CDB amount or a denial.",
    faqs: [
      { q: "Do I have to choose AISH or ADAP?", a: "No. Alberta's one application assesses both programs and places eligible applicants in the program that fits." },
      { q: "Can a fluctuating condition count?", a: "ADAP's official eligibility describes barriers that significantly impede employment continuously or episodically. Alberta makes the decision from the full application and medical report." },
    ],
    related: ["aish", "dtc", "cdb-adult", "cpp-disability", "aadl", "adult-health-benefit"],
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
    taxNote: "The Canada Disability Benefit is not taxable. If you receive AISH or ADAP, Alberta requires you to report the outcome of your CDB and/or DTC application, including the approved CDB amount or a denial.",
    faqs: [
      { q: "Do I need the DTC?", a: "Yes — get the DTC first; it's required." },
      { q: "How much will I get?", a: "For July 2026 to June 2027, the maximum is $204.20 per month. Your actual amount is recalculated from adjusted family net income on your 2025 federal tax return." },
      { q: "What is the $150 supplement?", a: "Starting in September 2026, eligible recipients may receive a separate fixed $150 lump sum toward the cost of obtaining the DTC. You do not apply for it separately." },
    ],
    related: ["dtc", "aish", "adap"],
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
    taxNote: "You usually pay a 25% cost-share (capped each year) — you do not pay it if you are low-income or receiving income assistance.",
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
};

/* =============================================================================
   SUPPORTS & STRATEGIES — practical, non-monetary help (accommodations, study /
   focus / memory / anxiety strategies, counselling, employment). Personalized by
   disability + situation; resource links are province-aware where relevant.
   Shown as their own group on the results page (not counted as "benefits").
   ========================================================================== */
const SUPPORTS = [
  {
    id: "early-learning-support", icon: "family", cat: "School & learning",
    dis: [], sit: ["childcare"],
    title: "A small preschool or child-care support plan",
    summary: "A short written plan can help caregivers respond consistently to communication, sensory, mobility and transition needs.",
    tips: [
      "Share two or three concrete things that help, such as a visual schedule, quiet space or extra transition time.",
      "Describe what a hard moment looks like and what usually helps the child recover.",
      "Ask who the main contact is and choose one simple way to share updates.",
      "Review the plan after a few weeks and keep only what is useful.",
    ],
    link: (a) => TWO_ELEVEN[a.province] || NATIONAL_211,
    linkText: "Find local child and family supports (2-1-1)",
  },
  {
    id: "school-support-plan", icon: "education", cat: "School & learning",
    dis: [], sit: ["elementary", "secondary"],
    title: "Prepare for a school support meeting",
    summary: "Bring concrete examples of what is hard at school and what already helps. The goal is a practical plan tied to the student's functional needs.",
    tips: [
      "Write down the three biggest barriers in class, at breaks or during transitions.",
      "Bring useful reports or examples of schoolwork, if you have them; do not delay asking for help while waiting for a diagnosis.",
      "Ask for instructions and agreed supports in writing so everyone can use the same plan.",
      "Choose a review date and one school contact for questions or changes.",
    ],
    link: (a) => TWO_ELEVEN[a.province] || NATIONAL_211,
    linkText: "Find local education and family navigation (2-1-1)",
  },
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
    needs: ["memorySafety"],
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
    needs: ["sensory"],
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
    needs: ["careCoordination", "memorySafety"],
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
    needs: ["homeAccess"],
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
    needs: ["communication"],
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
    needs: ["fatiguePain"],
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
      "Ask about your province's developmental-disability services and transition-to-adulthood planning.",
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
   Real Alberta, BC + national organizations that help people actually GET these
   benefits — filling out forms, appealing a denial, or finding local services.
   Free unless noted. Grouped by `cat` (see HELP_CATEGORIES). Links verified
   July 2026 — confirm hours/services on each site before relying on them.
   ========================================================================== */
const HELP_CATEGORIES = [
  { cat: "Help with the forms", icon: "check", blurb: "Free, patient help with disability-benefit, tax-credit and savings-plan paperwork." },
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
    coverage: ["AB"],
    verified: "2026-07-21",
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
    coverage: ["AB"],
    verified: "2026-07-21",
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
    coverage: ["CA"],
    verified: "2026-07-21",
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
    coverage: ["AB"],
    verified: "2026-07-21",
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
    coverage: ["AB"],
    verified: "2026-07-21",
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
    coverage: ["AB"],
    verified: "2026-07-21",
  },
  {
    id: "dabc-advocacy-access",
    cat: "Help with the forms",
    name: "Disability Alliance BC — Advocacy Access",
    summary:
      "Free one-to-one assistance with BC PWD and PPMB applications and appeals, health supplements, and CPP-Disability applications and appeals.",
    phone: "1-800-663-1278",
    url: "https://disabilityalliancebc.org/publications/publications-bc-disability-benefits-help-sheets/",
    urlText: "disabilityalliancebc.org",
    focus: ["pwd", "cppd", "appeals"],
    coverage: ["BC"],
    verified: "2026-07-21",
  },
  {
    id: "dabc-access-dtc",
    cat: "Help with the forms",
    name: "Disability Alliance BC — Access DTC",
    summary:
      "Free help with the Disability Tax Credit and related benefits, including a custom DTC preparation tool and direct program support.",
    phone: "1-800-663-1278",
    url: "https://disabilityalliancebc.org/direct-service/help-with-the-rdsp-and-dtc/",
    urlText: "disabilityalliancebc.org",
    focus: ["dtc", "rdsp", "tax"],
    coverage: ["BC"],
    verified: "2026-07-21",
  },
  {
    id: "dabc-law-clinic",
    cat: "If you're denied — legal help & appeals",
    name: "Disability Alliance BC — Disability Law Clinic",
    summary:
      "Free confidential summary advice and referrals for selected disability-rights problems, including discrimination, accommodations, access to services, transportation and post-secondary education.",
    phone: "1-800-663-1278",
    url: "https://disabilityalliancebc.org/program/disability-law-clinic/",
    urlText: "disabilityalliancebc.org",
    focus: ["appeals", "rights", "accommodation"],
    coverage: ["BC"],
    verified: "2026-07-21",
  },
  {
    id: "inclusion-bc-advocacy",
    cat: "If you're denied — legal help & appeals",
    name: "Inclusion BC — Individual & Family Advocacy",
    summary:
      "Free non-legal advocacy for BC residents facing barriers to inclusion. Advocates listen, help make a plan and connect you with the right service or organization.",
    phone: "1-844-488-4321",
    url: "https://inclusionbc.org/what-we-do/individual-family-advocacy/",
    urlText: "inclusionbc.org",
    focus: ["appeals", "family", "intellectual"],
    coverage: ["BC"],
    verified: "2026-07-21",
  },
  {
    id: "bc-211",
    cat: "Find local services near you",
    name: "211 British Columbia",
    summary:
      "Dial 2-1-1 or search online for disability, financial, food, housing, legal, health, employment, transportation and family services across BC.",
    phone: "211",
    url: "https://bc.211.ca/",
    urlText: "bc.211.ca",
    focus: ["local"],
    coverage: ["BC"],
    verified: "2026-07-21",
  },
  {
    id: "fsi-bc",
    cat: "Find local services near you",
    name: "Family Support Institute of BC",
    summary:
      "Free family-to-family support, information, service navigation and interpretation for BC families of a person of any age or disability. No diagnosis is required.",
    phone: "1-800-441-5403",
    url: "https://familysupportbc.com/",
    urlText: "familysupportbc.com",
    focus: ["local", "family"],
    coverage: ["BC"],
    verified: "2026-07-21",
  },
];

const BENEFITS = [
  {
    id: "waterloo-ontario-renovates",
    name: "Ontario Renovates home repair and accessibility funding (Region of Waterloo)",
    level: "Region of Waterloo",
    category: "Housing",
    amount: "Maximum $25,000 for homeowner repairs and/or up to $25,000 for eligible accessibility modifications — limits may be subject to change",
    amountTiers: {
      caption: "Maximum income by family size — All income maximums updated annually",
      headers: ["Family size", "Maximum income"],
      rows: [
        ["One person", "$41,210"],
        ["Two persons", "$51,204"],
        ["Three persons", "$63,072"],
        ["Four persons", "$76,577"],
        ["Five persons", "$86,853"],
        ["Six persons", "$97,956"],
        ["Seven+ persons", "$109,060"],
      ],
    },
    summary:
      "Limited funding for low- to moderate-income homeowners in Waterloo Region. It pays for eligible home repairs or accessibility changes for people with disabilities. It is a loan that is fully forgiven over 10 years. If accessibility changes are needed, up to $5,000 of the loan is a grant you do not repay.",
    note: "The fact sheet gives different dates. Households must apply before November 15, 2026 and have a signed agreement by December 15, 2026. It also says the deadline to submit an application is December 1, 2026. Check the current deadline with the Region. Eligible households are added to the Ontario Renovates List. It works on a first come, first served basis.",
    requires: ["waterlooRegion", "homeowner", "waterlooRenovatesEligibility"],
    eligibility: {
      mode: "all",
      items: [
        "You own an existing home in Waterloo Region as your sole and principal residence; you cannot own other property, including a cottage, or have partial ownership of a property",
        "The home has a maximum value of $600,000",
        "The total gross income of all household members (including those with disabilities) is at or below the maximum for the family size, or the household receives Ontario Works or Ontario Disability Support Program financial support as its sole source of income",
        "Property taxes and mortgage payments are up to date",
        "Insurance coverage is in place for the full value of the home",
      ],
      note: "All income maximums updated annually. If applicable, a household with disabled members can deduct the applicable Canada Revenue Agency tax credit for Persons with Disabilities for the previous year, from line 316 or 318.",
    },
    applyText: "See funding and application details",
    applyUrl: "https://www.regionofwaterloo.ca/programs-and-services/employment-and-financial-supports/financial-support-for-renters-and-homeowners/funding-for-home-repairs/",
    source: "https://www.regionofwaterloo.ca/programs-and-services/employment-and-financial-supports/financial-support-for-renters-and-homeowners/funding-for-home-repairs/",
    detail: {
      about:
        "The Region of Waterloo delivers Ontario Renovates with funding from the federal and provincial governments through the Ontario Priorities Housing Initiative. There is a maximum of $25,000 per dwelling for homeowner repairs as a fully forgivable loan and/or up to $25,000 for eligible accessibility modifications for persons with disabilities; the maximum funding limits may be subject to change. Repairs and accessibility modifications up to and including $25,000 must be secured by a promissory note. If funding exceeds $25,000, a mortgage registered on title is required. The Ontario Renovates loan is forgivable over 10 years and does not need to be repaid if the homeowner remains the owner, lives in the home and does not default during that period. The maximum loan amount for accessibility modifications, if required, includes a grant portion up to $5,000 that does not require repayment.",
      aboutList: {
        lead: "Limited Ontario Renovates funding helps qualified Waterloo Region homeowners with eligible repairs and accessibility modifications.",
        items: [
          "Maximum $25,000 per dwelling for homeowner repairs as a fully forgivable loan and/or up to $25,000 for eligible accessibility modifications; maximum funding limits may be subject to change.",
          "Up to and including $25,000 must be secured by a promissory note; if funding exceeds $25,000, a mortgage registered on title is required.",
          "The forgivable-loan period is 10 years. No repayment is needed if the homeowner remains the owner, lives in the home and does not default during those 10 years.",
          "Accessibility funding, if required, includes a grant portion up to $5,000 that does not require repayment.",
          "Eligible repairs include building exteriors such as roofs, walls or foundations; doors and windows; plumbing; fire safety; electrical systems; heating systems; and mold remediation.",
          "Eligible accessibility modifications include ramps; handrails; chair and bath lifts; height adjustments to counter tops; cues for doorbells or fire alarms; and bathroom modifications.",
        ],
      },
      steps: [
        "Check the family-size income table or the alternative of Ontario Works or Ontario Disability Support Program financial support as the household's sole source of income; confirm the home-value, ownership, tax, mortgage and insurance requirements",
        "Gather every required document — the application will not be processed unless all required documents are received",
        "Submit the application by email, fax, mail or in person",
        "If eligible, wait for the Region to contact you by phone to arrange a home inspection",
        "The fact sheet says apply before November 15, 2026 and have a signed agreement by December 15, 2026. It also says: Deadline to submit application is December 1, 2026. Check the current deadline with the Region",
      ],
      documents: [
        "Photo identification",
        "Income verification",
        "A recent property assessment notice or property tax bill",
        "Proof of home insurance",
        "Proof that property taxes and mortgage payments are up to date",
      ],
      tips: [
        "The Region must receive all required documents, or it will not process your application.",
        "The fact sheet says applications are accepted all year. 2026 funding is available after April 1, 2026, once the province confirms it.",
        "The fact sheet gives different application dates. It says to apply before November 15, 2026. It also says the deadline to submit an application is December 1, 2026. You also need a signed agreement by December 15, 2026. Check the current deadline with the Region.",
        "For emergencies such as heating problems or an urgent plumbing leak, call 519-575-4400.",
        "Apply by email at OntarioRenovates@regionofwaterloo.ca or by fax at 519-575-4026. You can also apply by mail or in person at 20 Weber St. E., Kitchener; 150 Main St., Cambridge; or 99 Regina St. S., Waterloo.",
      ],
      phone: "519-575-4400",
    },
  },
  {
    id: "waterloo-homemaking-support",
    name: "Homemaking Support Services Program (Region of Waterloo)",
    level: "Region of Waterloo",
    category: "Home support",
    amount: "Light housekeeping, meal planning and preparation, and laundry",
    summary:
      "The Region pays agencies to help eligible people live on their own. Help includes light housekeeping, meal planning and preparation, and laundry. The waitlist is about 2–3 years right now, except in special circumstances.",
    note: "When you reach the top of the waitlist, you must share all your financial and health information so they can confirm you are eligible. A crisis clean may be considered if there is a serious and immediate threat to a household's safety or housing, such as severe unsanitary conditions, infestation or hoarding.",
    requires: ["waterlooRegion", "waterlooHomemakingFinancial", "waterlooHomemakingNeed"],
    eligibility: {
      mode: "all",
      items: [
        "You live in Waterloo Region",
        "You meet the financial criteria through low income or social support",
        "You have significant functional impairments that affect your ability to complete homemaking tasks",
        "You need help at home due to illness, recovery from injury, aging or disability",
      ],
      note: "Full financial and health information is required to confirm eligibility once you reach the top of the waitlist.",
    },
    applyText: "Apply through Caredove",
    applyUrl: "https://www.regionofwaterloo.ca/programs-and-services/seniors-and-long-term-care/community-programs-for-older-adults/homemaking-support/",
    source: "https://www.regionofwaterloo.ca/programs-and-services/seniors-and-long-term-care/community-programs-for-older-adults/homemaking-support/",
    detail: {
      about:
        "The Region of Waterloo funds agencies to provide support to people who need assistance to live independently. Services are light housekeeping, meal planning and preparation, and laundry. The program is fully funded through the Ministry of Health and the Region of Waterloo. The waitlist is currently approximately 2–3 years, except under special circumstances.",
      aboutList: {
        lead: "Homemaking support helps eligible Waterloo Region residents live independently at home.",
        items: [
          "Light housekeeping.",
          "Meal planning and preparation.",
          "Laundry.",
          "The waitlist is currently approximately 2–3 years, except under special circumstances.",
          "Full financial and health information is required to confirm eligibility when you reach the top of the waitlist.",
        ],
      },
      steps: [
        "Open the Homemaking Support Services Program application through Caredove",
        "If you have trouble, choose “I'm signing up for myself, a family member or a friend” without requiring login credentials",
        "Join the waitlist",
        "When you reach the top, provide full financial and health information so the program can confirm eligibility",
      ],
      documents: [
        "Financial information when you reach the top of the waitlist",
        "Health information when you reach the top of the waitlist",
      ],
      tips: [
        "The waitlist is currently approximately 2–3 years, except under special circumstances.",
        "A crisis clean may be considered if there is a serious and immediate threat to household safety or housing. Examples are severe unsanitary conditions, infestation or hoarding. You are not automatically entitled to one.",
        "For help, call the Homemaking Coordinator at 519-893-8494 extension 6342.",
      ],
      phone: "519-893-8494 ext. 6342",
    },
  },
  {
    id: "waterloo-curbside-waste-support",
    name: "Curbside waste support programs (Region of Waterloo)",
    level: "Region of Waterloo",
    category: "Home support",
    amount: "Assisted cart collection, or 30 garbage bag tags a year at no charge for approved applicants",
    summary:
      "Two supports for Waterloo Region residents who make extra medical-related waste, or whose disability or physical limit makes it hard to put black and green carts at the curb. One is assisted cart set-out. The other is a medical exemption with 30 free garbage bag tags a year for approved applicants.",
    note: "Assisted Waste Collection moves your Region-issued black garbage cart and green organics cart from an agreed spot to the curb. Tagged bags are also collected. Staff do not empty indoor containers. They do not move carts from another location or collect outside the regular schedule. They do not go into homes or garages.",
    requires: ["waterlooRegion", "waterlooWasteSupportApproval"],
    eligibility: {
      mode: "any",
      items: [
        "For Assisted Waste Collection: you live with a disability or physical limitation, need help placing Region-issued black and green carts at the curb, and do not have someone available to help. It is available to eligible households that receive municipal curbside waste collection",
        "For the Medical Exemption Program: medical needs create extra garbage, such as packaging, incontinence products or unrecyclable medical waste",
      ],
      note: "The Region presents these as two support programs on one page. Approval depends on the requirements for the program you apply to.",
    },
    applyText: "See both waste support programs",
    applyUrl: "https://www.regionofwaterloo.ca/programs-and-services/garbage-and-organics/garbage/curbside-waste-support/",
    source: "https://www.regionofwaterloo.ca/programs-and-services/garbage-and-organics/garbage/curbside-waste-support/",
    detail: {
      about:
        "The Region of Waterloo offers two support programs for residents who create extra medical-related waste and/or live with a disability or physical limitation that makes it difficult to place black and green carts at the curb for collection. Assisted Waste Collection helps eligible residents move Region-issued black garbage and green organics carts to the curb when no one is available to help. The Medical Exemption Program gives approved applicants 30 garbage bag tags per year at no charge for extra garbage created by medical needs.",
      aboutList: {
        lead: "One page covers two different curbside waste supports.",
        items: [
          "Assisted Waste Collection is for residents with a disability or physical limitation who need help placing Region-issued black garbage and green organics carts at the curb and do not have someone available to help. It is available to eligible households that receive municipal curbside waste collection.",
          "It does not include emptying indoor containers into carts, moving carts from anywhere other than the agreed set-out location, or collecting waste outside the regular schedule.",
          "Collection staff will not enter homes or garages.",
          "The Medical Exemption Program is for medical needs that create extra garbage, such as packaging, incontinence products or unrecyclable medical waste.",
          "Approved Medical Exemption applicants receive 30 garbage bag tags per year at no charge.",
          "Extra garbage bags must be tagged and placed beside the garbage cart.",
        ],
      },
      steps: [
        "Choose Assisted Waste Collection if you need help moving the Region-issued carts, or the Medical Exemption Program if medical needs create extra garbage",
        "Review and apply through the Region's curbside waste support page",
        "For the assisted service, agree on the cart set-out location",
        "For the medical exemption, tag each extra garbage bag and place it beside the garbage cart",
      ],
      documents: [],
      tips: [
        "The assisted service does not include indoor waste handling, a different cart location, extra collection days, or going into a home or garage.",
        "If your Medical Exemption is approved, you get 30 garbage bag tags a year at no charge. Extra bags still need a tag and must be set beside the garbage cart.",
      ],
    },
  },
  {
    id: "grt-affordable-transit",
    name: "Affordable Transit Program (Grand River Transit)",
    level: "Region of Waterloo",
    category: "Transit",
    amount: "$47 monthly pass, $1.35 stored value per ride, or $6.75 for 5 MobilityPLUS tickets",
    amountTiers: {
      caption: "Household net income at or below this limit",
      headers: ["Household size", "Net income limit"],
      rows: [
        ["1 person", "$31,875"],
        ["2 people", "$45,078"],
        ["3 people", "$55,208"],
        ["4 people", "$63,749"],
        ["5 people", "$71,724"],
        ["6 people", "$78,077"],
      ],
    },
    summary:
      "The Affordable Transit Program gives discounted GRT fares to Waterloo Region residents on a low income. Eligibility depends on total household income.",
    note: "ATP costs $47 for a monthly pass instead of $104. Stored value is $1.35 per ride instead of the regular $3 stored-value fare or $4 cash fare. A strip of 5 ATP MobilityPLUS tickets costs $6.75 instead of $15.",
    requires: ["waterlooRegion", "lowIncome", "atpApproval"],
    eligibility: {
      mode: "all",
      items: [
        "You are 18 or older",
        "You live in the Region of Waterloo",
        "You are not a full-time college or university student",
        "Your household net income is at or below the limit",
      ],
      note: "Income is household NET income: add line 23600 from each member's tax return. A household includes people you live with, are related to and financially support. Everyone counts even if they do not need a pass, and members over 18 must provide income information. If approved, all household members can buy the discounted fares, including all children 17 or younger.",
    },
    applyText: "Apply for the Affordable Transit Program",
    applyUrl: "https://www.grt.ca/fares-and-payment/affordable-transit-program/",
    source: "https://www.grt.ca/fares-and-payment/affordable-transit-program/",
    detail: {
      about:
        "The Affordable Transit Program offers a discount on the price of GRT fare products for Waterloo Region residents living with low income. Eligibility is based on total household income and is managed by the Region of Waterloo Department of Community Services. The ATP monthly pass is $47 compared with the $104 regular monthly pass. ATP stored value is $1.35 per ride compared with $3 regular stored value and a $4 cash fare. ATP MobilityPLUS tickets are $6.75 for a strip of 5 compared with $15 regular.",
      aboutList: {
        lead: "ATP discounts GRT fares for Waterloo Region households living with low income.",
        items: [
          "$47 for an ATP monthly pass, compared with $104 for a regular monthly pass.",
          "$1.35 ATP stored value per ride, compared with $3 regular stored value and a $4 cash fare.",
          "$6.75 for a strip of 5 ATP MobilityPLUS tickets, compared with $15 regular.",
          "Eligibility is managed by the Region of Waterloo Department of Community Services.",
          "If approved, all household members can buy discounted fares, including all children 17 or younger.",
        ],
      },
      steps: [
        "Add line 23600 from each household member's tax return and compare the total with the table",
        "Gather the documents for your household's route",
        "Apply online at https://webapps.regionofwaterloo.ca/ATP/ApplicationWizard/Step/Info when the online application is available. The GRT page says it is temporarily unavailable.",
        "While it is unavailable you can still apply or get help from 8:30 to 4:30, Monday to Friday. Call Employment and Income Services at 519-883-2100 option 1, contact your Ontario Works caseworker directly, or visit a Community Services Welcome Space (150 Main St. Cambridge, 20 Weber St. Kitchener, 99 Regina St. S. Waterloo).",
        "The GRT page says applications received during the interruption are processed within 7 days.",
        "Ask for help at a Community Service Welcome Space if you need help completing the application",
      ],
      documents: [
        "If you receive Ontario Works or ODSP: your date of birth and your SAMS Member ID or SIN",
        "If you do not receive Ontario Works or ODSP: proof of address — a valid driver's licence, Ontario photo ID card, government-issued mail, current utility bill, rent receipt or lease, or mortgage document",
        "If you do not receive Ontario Works or ODSP: proof of income for each income-earning household member — a CRA Notice of Assessment showing line 23600, CRA Proof of income statement (Option C), or a letter from a Registered Social Worker",
        "If you were a student in the last calendar year: proof of completion or graduation documents",
        "If you are new to Canada in the current calendar year, you can submit one of: a PR or citizenship card, a refugee protection document, a verification of claim, a work permit, or confirmation of permanent residence",
      ],
      tips: [
        "Your household includes people you live with, are related to and support financially. Count everyone, even if they do not need a pass.",
        "Household members over 18 must give income information.",
        "If you are a registered MobilityPLUS customer on a low income, apply for ATP too. It lowers the cost of MobilityPLUS tickets.",
      ],
    },
  },
  {
    id: "grt-cnib-pass",
    name: "CNIB pass (Grand River Transit)",
    level: "Region of Waterloo",
    category: "Transit",
    amount: "Free unlimited travel on conventional GRT buses and ION light rail",
    summary:
      "An annual pass for CNIB customers. It gives unlimited use of regular GRT buses and ION light rail. CNIB customers ride free with a special CNIB EasyGO fare card.",
    note: "The source names conventional GRT buses and ION light rail. It does not say the pass includes MobilityPLUS.",
    requires: ["waterlooRegion", "cnibCustomer"],
    eligibility: {
      mode: "all",
      items: ["You are a CNIB customer"],
      note: "The CNIB pass is listed at no cost.",
    },
    applyText: "See the CNIB pass",
    applyUrl: "https://www.grt.ca/fares-and-payment/tickets-and-passes/passes/cnib-pass/",
    source: "https://www.grt.ca/fares-and-payment/tickets-and-passes/passes/cnib-pass/",
    detail: {
      about:
        "The annual CNIB pass gives CNIB customers unlimited use of conventional GRT buses and ION light rail at no cost through a special CNIB EasyGO fare card. The card has Braille and a small notch in its side to make it easier to identify by touch.",
      aboutList: {
        lead: "CNIB customers can ride conventional GRT buses and ION light rail free with a special EasyGO fare card.",
        items: [
          "The pass is annual and costs nothing.",
          "It provides unlimited use of conventional GRT buses and ION light rail.",
          "The card has Braille and a small notch in the side to make it easier to identify by touch.",
          "The source does not say MobilityPLUS is included.",
        ],
      },
      steps: ["Contact GRT at 519-585-7597 to arrange to get your EasyGO fare card"],
      documents: [],
      tips: ["The tactile Braille and side notch help distinguish this card by touch."],
      phone: "519-585-7597",
    },
  },
  {
    id: "grt-mobilityplus",
    name: "MobilityPLUS specialized transit (Grand River Transit)",
    level: "Region of Waterloo",
    category: "Transit",
    amount: "$15 for 5 tickets or $104 for a monthly pass; $6.75 for 5 tickets with ATP approval",
    summary:
      "MobilityPLUS runs in the urban areas of Waterloo Region. It is for eligible, registered customers whose disability affects their ability to travel on GRT buses or ION trains.",
    note: "This application is for residents of Cambridge, Kitchener and Waterloo. A separate specialized service exists for township residents.",
    requires: ["waterlooUrban", "waterlooMobilityPlusTransit"],
    needsPractitioner: true,
    eligibility: {
      mode: "any",
      items: [
        "Unconditional — a disability prevents you from using conventional transit",
        "Conditional — environmental or physical barriers limit your ability to consistently use conventional transit; you may be able to use conventional transit for all or part of a trip but may qualify for specialized transit under specific circumstances for some or all of your trip",
        "Temporary — a temporary disability that prevents you from using conventional transit and requires specialized transit for a defined period of time",
      ],
      note: "MobilityPLUS is only available to people who are eligible and registered.",
    },
    applyText: "Apply for MobilityPLUS",
    applyUrl: "https://www.grt.ca/mobilityplus/apply-for-mobilityplus/",
    source: "https://www.grt.ca/mobilityplus/apply-for-mobilityplus/",
    detail: {
      about:
        "Grand River Transit MobilityPLUS operates within the urban areas of Waterloo Region. It provides specialized transit to eligible, registered customers who have a disability that impacts their ability to travel on GRT buses or ION trains. Eligibility may be unconditional, conditional or temporary. The application is for Cambridge, Kitchener and Waterloo residents; a separate specialized service exists for township residents.",
      aboutList: {
        lead: "MobilityPLUS is specialized transit for eligible, registered Cambridge, Kitchener and Waterloo residents.",
        items: [
          "Unconditional eligibility is for a person with a disability that prevents them from using conventional transit.",
          "Conditional eligibility is for a person whose disability means environmental or physical barriers limit their ability to consistently use conventional transit. They may use conventional transit for all or part of a trip but qualify for specialized transit under specific circumstances for some or all of their trip.",
          "Temporary eligibility is for a person with a temporary disability that prevents them from using conventional transit and requires specialized transit for a defined period of time.",
          "MobilityPLUS tickets cost $15 for a strip of 5 and a monthly pass costs $104.",
          "With ATP approval, a strip of 5 MobilityPLUS tickets costs $6.75.",
        ],
      },
      steps: [
        "Complete Part A yourself or have your delegate complete it",
        "Have a professional who can speak to your disability and ability to take conventional transit complete the Part B Health/Disability Professional form",
        "Submit the two-part application",
      ],
      documents: [
        "Part A, completed by you or your delegate",
        "Part B Health/Disability Professional form, completed by a health/disability professional who can speak to your disability and ability to take conventional transit",
      ],
      tips: [
        "Appropriate professionals could include (but are not limited to) a physician, nurse practitioner, psychiatrist, psychologist, optometrist, physiotherapist, occupational therapist, social worker, orientation and mobility specialist, kinesiologist, managers from pre-approved adult day programs or long-term care centres, and other professionals approved by the Region.",
        "Township residents use a separate specialized service. This page does not give its rules.",
        "If you live on a low income, apply for ATP too. It lowers a strip of 5 MobilityPLUS tickets from $15 to $6.75.",
      ],
    },
  },
  {
    id: "grt-taxi-coupons",
    name: "MobilityPLUS taxi coupons (Grand River Transit)",
    level: "Region of Waterloo",
    category: "Transit",
    amount: "$60 coupon book for $30, up to 30 books a year",
    summary:
      "MobilityPLUS customers can buy a taxi coupon book for $30. It holds $60 in $5, $2 and $1 coupons. The coupons have punched holes to show each value.",
    note: "Coupons are for the MobilityPLUS customer's personal use. They cannot be resold or transferred. Proven abuse results in privileges being revoked, and lost or stolen coupons are not reimbursed. Coupons do not expire and are not refundable.",
    requires: ["waterlooUrban", "mobilityplusRegistered"],
    eligibility: {
      mode: "all",
      items: ["You are a MobilityPLUS customer who lives and travels in Cambridge, Kitchener and Waterloo", "You are not a MobilityPLUS North Dumfries or Kiwanis Transit customer (they are not eligible for taxi coupons)"],
      note: "Customers may purchase up to 30 coupon books between January 1 and December 31. Customers with seasonal eligibility may only buy during active registration periods.",
    },
    applyText: "See MobilityPLUS taxi coupons",
    applyUrl: "https://www.grt.ca/mobilityplus/taxi-coupons/",
    source: "https://www.grt.ca/mobilityplus/taxi-coupons/",
    detail: {
      about:
        "A taxi coupon book contains $5, $2 and $1 coupons adding up to $60 and is sold to MobilityPLUS customers for $30. Holes are punched to identify each value. Coupons do not expire and are not refundable. Customers may purchase up to 30 books between January 1 and December 31; customers with seasonal eligibility may only buy during active registration periods.",
      aboutList: {
        lead: "MobilityPLUS customers can buy $60 of taxi coupons for $30.",
        items: [
          "Each book contains $5, $2 and $1 coupons, with holes punched to identify each value.",
          "Coupons do not expire and are not refundable.",
          "Up to 30 books may be purchased between January 1 and December 31.",
          "Seasonal customers may buy only during active registration periods.",
          "Coupons are personal, cannot be resold or transferred, and lost or stolen coupons are not reimbursed. Proven abuse results in privileges being revoked.",
        ],
      },
      steps: [
        "Buy by phone at 519-585-7597 ext. 7347, Monday to Friday from 8:30 a.m. to 4 p.m.; a credit card is required",
        "Or buy in person at a GRT customer service location",
        "Or mail a cheque payable to Region of Waterloo to 250 Strasburg Rd., Kitchener, ON N2E 3M6, write your MobilityPLUS ID number on the front, and allow two weeks",
        "When booking a taxi, tell the company you are using taxi coupons and say if you use a mobility device so it can arrange a suitable vehicle",
      ],
      documents: [
        "Your MobilityPLUS ID number for mail orders",
        "A credit card for telephone orders, or a cheque payable to Region of Waterloo for mail orders",
      ],
      tips: [
        "Orders of three books or fewer go by Canada Post. Orders of four or more go by courier between 9 a.m. and 5 p.m. You must be home to accept the delivery.",
        "The taxi companies named are Golden Triangle Taxi in Cambridge, and City Cabs, United Taxi and Waterloo Taxi in Kitchener and Waterloo.",
        "Keep your coupons safe. Lost or stolen coupons are not paid back.",
      ],
      phone: "519-585-7597 ext. 7347",
    },
  },
  {
    id: "grt-support-person",
    name: "Transit Support Person program (Grand River Transit)",
    level: "Region of Waterloo",
    category: "Transit",
    amount: "A support person travels free while providing assistance",
    summary:
      "For people who need regular or occasional help while travelling because of a disability. It covers GRT regular buses, MobilityPLUS buses and ION trains. The support person who helps you does not pay a fare.",
    note: "Your support person travels free. They can be a family member, friend, paid attendant or volunteer. They must be 13 years old or older and travel with you to help you use transit.",
    requires: ["waterlooRegion", "supportPersonApproval"],
    eligibility: {
      mode: "all",
      items: ["Due to a disability, you cannot travel independently on conventional or specialized transit service"],
      note: "The assistance may be regular or occasional.",
    },
    applyText: "Apply for the Transit Support Person program",
    applyUrl: "https://www.grt.ca/rider-information/transit-support-person-program/",
    source: "https://www.grt.ca/rider-information/transit-support-person-program/",
    detail: {
      about:
        "The Transit Support Person program is for people who, because of disability, require regular or occasional assistance while travelling on GRT conventional buses, MobilityPLUS buses and/or ION trains. It is open to anyone who, due to a disability, cannot travel independently on conventional or specialized transit service. The support person providing assistance does not pay a fare.",
      aboutList: {
        lead: "A support person travels free while assisting a customer who cannot travel independently because of disability.",
        items: [
          "The program covers GRT conventional buses, MobilityPLUS buses and/or ION trains.",
          "Assistance can be regular or occasional.",
          "The support person can be a family member, friend, paid attendant or volunteer.",
          "The support person must be 13 years of age or older and travel with you to assist you in using transit.",
        ],
      },
      steps: [
        "Complete the online application",
        "Or call GRT customer service to have a form mailed to you",
        "Or pick up a form at any GRT customer service location",
        "If you are not enrolled in PAL, the application should be completed by a registered health-care professional with one of the designations GRT lists (for example physician, nurse practitioner, nurse or occupational therapist, or others approved by the Region)",
      ],
      documents: [
        "A completed Transit Support Person application",
        "If you are currently enrolled in the Personal Assistant for Leisure Activities program through the City of Kitchener, City of Waterloo or City of Cambridge: your PAL card number",
        "If you are not in PAL: the part of the application that should be completed by a registered health-care professional with a designation GRT lists",
      ],
      tips: [
        "You may be enrolled in the Personal Assistant for Leisure Activities (PAL) program through the City of Kitchener, City of Waterloo or City of Cambridge. If so, your health care professional does not have to fill out the application. Give your PAL card number instead.",
        "Your support person can be anyone 13 or older who travels with you to help. This includes a family member, friend, paid attendant or volunteer.",
        "GRT does not pay back any fees a health-care professional charges.",
      ],
    },
  },
  {
    id: "york-region-homemakers",
    name: "Homemakers Services (York Region)",
    level: "York Region",
    category: "Daily living supports",
    amount: "Help with the cost of an in-home homemaker",
    summary:
      "York Region can help pay for an in-home homemaker. It is for people who are ill or disabled, either for a short time or for good. A homemaker helps with laundry, meals and light housekeeping.",
    note: "York Region runs this, not your city. It is the same program whether you live in Markham, Vaughan, Richmond Hill, Newmarket or Aurora.",
    requires: ["yorkRegion", "yorkHomemakersNeed"],
    eligibility: {
      mode: "all",
      items: [
        "You are temporarily or permanently ill or disabled",
        "You meet the financial need requirements",
      ],
      note: "York Region does not publish the financial need thresholds or the amount of help on this page — ask when you call.",
    },
    applyText: "Call York Region to apply",
    applyUrl: "https://www.york.ca/support/financial-assistance/homemakers-services",
    source: "https://www.york.ca/support/financial-assistance/homemakers-services",
    detail: {
      about:
        "York Region can help cover the cost of an in-home homemaker for people who have a temporary or permanent illness or disability. Homemakers help with laundry, meals and light housekeeping. To be eligible you must be temporarily or permanently ill or disabled and meet financial need requirements.",
      aboutList: {
        lead: "York Region helps pay for an in-home homemaker if illness or disability makes housework hard.",
        items: [
          "A homemaker can help with laundry, meals and light housekeeping.",
          "It covers temporary illness as well as permanent disability.",
          "You need to meet financial need requirements.",
          "It is a regional program, so it works the same across York Region's municipalities.",
        ],
      },
      steps: [
        "Call York Region at 1-877-464-9675, or email ContactUs@york.ca",
        "Ask about the financial need requirements, which are not published online",
      ],
      documents: [
        "Information about your illness or disability",
        "Information about your finances, for the financial need assessment",
      ],
      tips: [
        "Short-term illness counts, not only lasting disability. It is worth asking about while you recover from surgery or a hospital stay.",
        "The amount of help and the financial limits are not published. Contact York Region to find out where you stand.",
      ],
      phone: "1-877-464-9675",
    },
  },
  {
    id: "york-region-recreation-subsidies",
    name: "Recreation subsidies (York Region)",
    level: "York Region",
    category: "Recreation",
    amount: "Subsidies for recreation programs, day camps and youth overnight camps",
    summary:
      "York Region funds subsidies for recreation and camps. Families who meet one of the Region's listed routes may be eligible. Children can join programs and camps run by their municipality. Overnight camp funding is for youth aged 12 to 17.",
    note: "York Region does not promise space in programs or camps. A subsidy is not a place. Searching your city's site will not find this. The Region funds it, and the city recreation departments run the programs.",
    requires: ["yorkRegion", "yorkRecreationAge", "yorkRecreationFamilyRoute"],
    eligibility: {
      mode: "all",
      items: [
        "A family that meets at least one listed route may be eligible if it lives in York Region, such as receiving a rent subsidy, Ontario Works, ODSP or ACSD, or a child care fee subsidy with an annual income of $43,000 or less",
      ],
      note: "Three subsidies are offered: Positive Leisure Activities for Youth (PLAY), summer day camp funding, and youth overnight camp funding. Overnight camp funding is for eligible youth aged 12 to 17. PLAY assists children ages four to 18 and single parents. Summer day camp is for children ages four to 12. Routes differ a little by subsidy. Day camp families on a child care fee subsidy contact their Children's Services Representative. Overnight camp also lists some housing communities.",
    },
    applyText: "See York Region recreation subsidies",
    applyUrl: "https://www.york.ca/support/financial-assistance/recreation-subsidies",
    source: "https://www.york.ca/support/financial-assistance/recreation-subsidies",
    detail: {
      about:
        "York Region offers subsidies for recreation programs, day camps and youth overnight camps. For the recreation program and day camp subsidies, families who meet one of the Region's listed routes may be eligible. Children take part in programs offered by the municipal recreation departments. The youth overnight camp funding helps eligible youth aged 12 to 17 attend an approved overnight camp.",
      aboutList: {
        lead: "York Region funds recreation and camp subsidies for children; families who meet one of the Region's listed routes may be eligible.",
        items: [
          "Positive Leisure Activities for Youth, known as PLAY.",
          "Summer day camp funding.",
          "Youth overnight camp funding for eligible youth aged 12 to 17.",
          "The programs themselves are run by your municipal recreation department.",
          "A subsidy does not guarantee a space in a program or camp.",
        ],
      },
      steps: [
        "Check which of the three subsidies fits — PLAY, summer day camp, or youth overnight camp",
        "Apply through York Region",
        "Register with your municipal recreation department for the program or camp itself",
      ],
      documents: ["Information about the benefit or subsidy your family receives (or, for the child care fee subsidy route, your income)"],
      tips: [
        "Your city's website will not show this program. York Region funds it, and the city runs the programs.",
        "The subsidy does not hold a spot for you, so register for the program early too.",
        "It covers Aurora, East Gwillimbury, Georgina, King, Newmarket, Markham, Richmond Hill, Vaughan and Whitchurch-Stouffville.",
      ],
    },
  },
  {
    id: "ottawa-community-pass",
    name: "Community Pass — OC Transpo discount for ODSP recipients (Ottawa)",
    level: "Ottawa",
    category: "Transit",
    amount: "$43.25 a month, or $1.75 a ride",
    summary:
      "A discounted OC Transpo pass for Ottawa residents who get ODSP. It covers every route, including Para Transpo, with no top-up charge. The Access pass costs the same but does not include this.",
    note: "Community and Access passes both cost $43.25 a month, but Access holders pay a $2.75 top-up for every Para Transpo ride while the Community Pass includes Para Transpo with no top-up. If you receive ODSP and use Para Transpo, the Community Pass is the cheaper of the two. The rural fare is not included in either.",
    requires: ["ottawa", "ottawaOdspReceipt"],
    eligibility: {
      mode: "all",
      items: [
        "You are an Ottawa resident",
        "You receive benefits under the Ontario Disability Support Program",
      ],
      note: "To prove it you need your ODSP number — the 9-digit identification number on an ODSP document — together with a Presto card number or a Para Transpo ID number. Discounted fares cannot be used when paying cash; you need a Presto card.",
    },
    applyText: "See reduced fares",
    applyUrl: "https://www.octranspo.com/en/fares/reduced-fares/",
    source: "https://www.octranspo.com/en/fares/reduced-fares/",
    detail: {
      about:
        "The Community Pass is OC Transpo's discounted fare for Ottawa residents who receive ODSP benefits. It costs $43.25 a month, or $1.75 per ride, and lets you ride on all routes including Para Transpo without paying a top-up. The rural fare is not included.",
      aboutList: {
        lead: "The Community Pass is OC Transpo's ODSP discount.",
        items: [
          "$43.25 for a monthly pass, or $1.75 per ride.",
          "Valid on all routes, including Para Transpo, with no top-up charge.",
          "The Para Transpo rural fare is not included.",
          "You must use a Presto card — discounted fares are not available when paying cash.",
          "For comparison, the regular adult fare is $4.10 a ride and $138.50 a month.",
        ],
      },
      steps: [
        "Get your ODSP identification number from an ODSP document",
        "Get a Presto card, or have your Para Transpo ID number to hand",
        "Set the Community discount on your card at an OC Transpo Customer Service Centre, or by calling OC Transpo Customer Service — discounted monthly passes cannot be set anywhere else",
        "Buy monthly passes up to 14 days before the month starts; a pass is valid only for the calendar month it is bought for",
      ],
      documents: [
        "Your 9-digit ODSP identification number from an ODSP document",
        "A Presto card number, or a Para Transpo ID number",
      ],
      tips: [
        "If you use Para Transpo and get ODSP, choose the Community Pass over the Access pass. It is the same $43.25, but with no $2.75 Para Transpo top-up per ride.",
        "You must set up discounted monthly passes at a Customer Service Centre or by phone, not at a store.",
        "If verification is needed, a lawyer, notary, registered social worker, or a member of one of the regulated health colleges can act as a guarantor.",
      ],
    },
  },
  {
    id: "ottawa-access-pass",
    name: "Access pass — OC Transpo discount for Para Transpo customers (Ottawa)",
    level: "Ottawa",
    category: "Transit",
    amount: "$43.25 a month, plus a $2.75 top-up per Para Transpo ride",
    summary:
      "A discounted monthly OC Transpo pass for registered Para Transpo customers. It gives unlimited travel on the O-Train and all buses except Para Transpo. It takes about a third off the cash fare on Para Transpo trips.",
    note: "Access pass holders pay a $2.75 top-up for each Para Transpo ride. If you also get ODSP, compare it with the Community Pass. The Community Pass costs the same $43.25 and includes Para Transpo with no top-up.",
    requires: ["ottawa", "paraTranspoRegistered"],
    eligibility: {
      mode: "all",
      items: ["You are registered as a Para Transpo customer"],
      note: "You will be asked for your Para Transpo registration number. Discounted fares cannot be used when paying cash.",
    },
    applyText: "See reduced fares",
    applyUrl: "https://www.octranspo.com/en/fares/reduced-fares/",
    source: "https://www.octranspo.com/en/fares/reduced-fares/",
    detail: {
      about:
        "The Access pass is a discounted monthly pass for people registered as Para Transpo customers. At $43.25 a month it gives unlimited rides on the O-Train and all buses that are not Para Transpo, and saves one third of the cash-fare price on each Para Transpo trip. Access pass holders pay a $2.75 top-up charge per ride to use Para Transpo.",
      aboutList: {
        lead: "The Access pass is OC Transpo's discounted monthly pass for Para Transpo customers.",
        items: [
          "$43.25 a month.",
          "Unlimited travel on the O-Train and all non-Para Transpo buses.",
          "Saves one third of the cash-fare price on each Para Transpo trip.",
          "A $2.75 top-up is charged for each Para Transpo ride.",
          "ParaPay and ParaPass cannot be used on OC Transpo buses or the O-Train.",
        ],
      },
      steps: [
        "Register as a Para Transpo customer and note your registration number",
        "Set the Access discount at an OC Transpo Customer Service Centre, or by calling OC Transpo Customer Service",
        "Buy the monthly pass up to 14 days before the month begins",
      ],
      documents: ["Your Para Transpo registration number"],
      tips: [
        "If you also get ODSP, check the Community Pass first. It costs the same and has no Para Transpo top-up.",
        "Fare capping means that paying as you go with Presto never costs more than $12.25 in a day. In a month, it never costs more than the monthly pass price.",
      ],
    },
  },
  {
    id: "ottawa-equipass",
    name: "EquiPass — OC Transpo low-income discount (Ottawa)",
    level: "Ottawa",
    category: "Transit",
    amount: "$58.25 a month, or $1.75 a ride — about half an adult pass",
    summary:
      "A discounted OC Transpo pass for Ottawa residents whose family income is below the federal low income threshold, provided they do not already receive transportation benefits from Social Services.",
    note: "You cannot get EquiPass if you get transportation benefits from Social Services. If you get ODSP, look at the Community Pass instead. It costs less at $43.25 and includes Para Transpo.",
    requires: ["ottawa", "lowIncome"],
    eligibility: {
      mode: "all",
      items: [
        "Your family income is below the low income threshold set by the Government of Canada",
        "You do not receive transportation benefits from Social Services",
      ],
      note: "You apply with a completed EquiPass Application and Consent Form plus a Notice of Assessment from the Canada Revenue Agency for the most recent taxation year. If you do not have a Notice of Assessment, other documentation can be used instead.",
    },
    applyText: "See reduced fares",
    applyUrl: "https://www.octranspo.com/en/fares/reduced-fares/",
    source: "https://www.octranspo.com/en/fares/reduced-fares/",
    detail: {
      about:
        "EquiPass is OC Transpo's fare discount for people on a low income. A monthly EquiPass costs $58.25, roughly half the $138.50 adult monthly pass, and the per-ride EquiPass fare is $1.75 against an adult fare of $4.10.",
      aboutList: {
        lead: "EquiPass is OC Transpo's low-income fare discount.",
        items: [
          "$58.25 for a monthly pass, about half the $138.50 adult pass.",
          "$1.75 per ride, against $4.10 for an adult.",
          "You must not be receiving transportation benefits from Social Services.",
          "You must use a Presto card — discounted fares are not available when paying cash.",
        ],
      },
      steps: [
        "Complete the EquiPass Application and Consent Form",
        "Include your Canada Revenue Agency Notice of Assessment for the most recent taxation year, or other accepted documentation if you do not have one",
        "Set the EquiPass discount at an OC Transpo Customer Service Centre, or by calling OC Transpo Customer Service",
        "Buy the monthly pass up to 14 days before the month begins",
      ],
      documents: [
        "A completed EquiPass Application and Consent Form",
        "A Canada Revenue Agency Notice of Assessment for the most recent taxation year, or other accepted documentation",
      ],
      tips: [
        "If you get ODSP, the Community Pass costs less at $43.25. It covers Para Transpo without a top-up.",
        "A lawyer, notary, registered social worker or a member of a regulated health college can act as a guarantor on the application.",
        "Paying per ride with Presto is capped at $12.25 a day. Over a month, it is capped at the monthly pass price.",
      ],
    },
  },
  {
    id: "ottawa-a-card",
    name: "a-card — free OC Transpo travel if you are blind or partially sighted (Ottawa)",
    level: "Ottawa",
    category: "Transit",
    amount: "Free travel on all routes except Para Transpo",
    summary:
      "The a-card lets people who are blind or partially sighted ride OC Transpo free on every route except Para Transpo. You qualify with a CNIB card or an Attorney-General of Ontario Guide Dog photo ID card.",
    note: "The a-card does not cover Para Transpo. If you use Para Transpo, look at the Access pass. If you also get ODSP, look at the Community Pass.",
    requires: ["ottawa", "visionDisability", "aCardProof"],
    eligibility: {
      mode: "any",
      items: [
        "You hold a CNIB card",
        "You hold an Attorney-General of Ontario Guide Dog photo ID card",
      ],
      note: "Proof is a CNIB one-piece photo ID card, or the Attorney-General of Ontario Guide Dog photo ID card.",
    },
    applyText: "See reduced fares",
    applyUrl: "https://www.octranspo.com/en/fares/reduced-fares/",
    source: "https://www.octranspo.com/en/fares/reduced-fares/",
    detail: {
      about:
        "The a-card gives free travel on all OC Transpo routes except Para Transpo to people who are blind or partially sighted. Eligibility is by holding a CNIB card or an Attorney-General of Ontario Guide Dog photo ID card.",
      aboutList: {
        lead: "The a-card is free OC Transpo travel for people who are blind or partially sighted.",
        items: [
          "Free on all routes except Para Transpo.",
          "Qualify with a CNIB card or an Attorney-General of Ontario Guide Dog photo ID card.",
          "Para Transpo trips are not covered by the a-card.",
        ],
      },
      steps: [
        "Have your CNIB one-piece photo ID card, or your Attorney-General of Ontario Guide Dog photo ID card",
        "Take it to an OC Transpo Customer Service Centre to get the a-card",
      ],
      documents: [
        "A CNIB one-piece photo ID card, or an Attorney-General of Ontario Guide Dog photo ID card",
      ],
      tips: [
        "The a-card does not cover Para Transpo. The Access pass does. If you get ODSP, the Community Pass does too.",
      ],
    },
  },
  {
    id: "london-ontario-renovates",
    name: "Ontario Renovates home repair and accessibility funding (London)",
    level: "London",
    category: "Home",
    amount: "A 10-year forgivable loan up to $25,000 — the first $5,000 is a grant for accessibility work",
    summary:
      "Federal and provincial funding, run by the City of London. It helps lower- and moderate-income homeowners make their home accessible or do essential repairs. They must be seniors aged 60 or older, or people with disabilities.",
    note: "Funding is limited. Applications are processed first come, first served until the money runs out, so applying early matters. You may be asked for more documents, such as a medical form, when they assess accessibility changes.",
    requires: ["london", "londonRenovatesEligibility"],
    eligibility: {
      mode: "all",
      items: [
        "A senior aged 60 or older, or a person with a disability",
        "Annual gross household income at or below $95,000, from line 15000 of last year's Notice of Assessment",
        "Total household liquid assets at or below $30,000, counting TFSAs, GICs, bonds, mutual funds and savings accounts",
        "The home is your sole and principal residence in London or Middlesex County",
        "Property tax assessment value at or below $320,000 — the assessed value, not the resale value",
        "Mortgage payments and property taxes are up to date, and the home is insured for its full value",
      ],
      note: "You are not eligible if you have received Ontario Renovates funding before, or if your household previously received funding from the Affordable Housing Program or the Off-Reserve Aboriginal Housing (Trust) Program. Community or social housing as defined under the Housing Services Act 2011 is excluded.",
    },
    applyText: "See how to apply",
    applyUrl: "https://london.ca/living-london/building-renovating/home-repair-accessibility-funding",
    source: "https://london.ca/living-london/building-renovating/home-repair-accessibility-funding",
    detail: {
      about:
        "The Ontario Renovates Program is funded by the federal and provincial governments and delivered locally by the City of London. It gives financial assistance to low-to-moderate income seniors aged 60 or older and to people with disabilities, to increase accessibility or complete essential repairs in their home. Assistance is a one-time 10-year forgivable loan of up to $25,000. If you are approved for accessibility modifications, the first $5,000 of that is a one-time grant rather than a loan.",
      aboutList: {
        lead: "Ontario Renovates helps London homeowners make their home accessible or carry out essential repairs.",
        items: [
          "A one-time 10-year forgivable loan of up to $25,000.",
          "For accessibility modifications, the first $5,000 is a grant, not a loan.",
          "For seniors aged 60 or older and people with disabilities.",
          "Accessibility work can include ramps, chair and bath lifts, handrails, grab bars, raised toilets, levered handles, accessible shower stalls, personal emergency response systems, height adjustable countertops and fire alarms.",
          "Essential repairs can include heating systems, roofs, walls, floors, foundations, chimneys, doors and windows, electrical, plumbing, septic systems and vents.",
        ],
      },
      steps: [
        "Check the income, liquid asset and property assessment limits before applying",
        "Get three estimates for the proposed repairs or modifications, and take photographs of the work areas",
        "Complete the 2026 Homeowner Application with supporting documentation",
        "Include photo ID for every adult homeowner, your CRA Notice of Assessment, property tax assessment, and confirmation of mortgage and insurance",
        "Apply as early as you can — funding is limited and processed first come, first served",
      ],
      documents: [
        "Completed and signed Ontario Renovates application forms with supporting documentation",
        "Government-issued photo ID for all homeowners, such as a driver's licence, passport, citizenship document or Ontario photo card",
        "Your CRA Notice of Assessment",
        "Property tax assessment showing the assessed value and that payments are up to date",
        "Confirmation of mortgage and of insurance coverage",
        "A list of liquid assets for every household member aged 18 and over",
        "Three estimates for the proposed repairs or modifications, plus pictures of the proposed work",
      ],
      tips: [
        "Do not start the work before you are approved. Work started or finished before approval is not eligible.",
        "Cosmetic work is not covered. This includes driveway paving, painting and flooring. Landscaping, central air conditioning and solar panels are also not covered.",
        "You may be asked for a medical form when they assess accessibility changes.",
        "You can only get Ontario Renovates funding once.",
        "Send questions to housingprograms@london.ca or call 519-661-2489 extension 7831.",
      ],
      phone: "519-661-2489 ext. 7831",
    },
  },
  {
    id: "windsor-affordable-pass",
    name: "Affordable Pass Program (Windsor)",
    level: "Windsor",
    category: "Transit",
    amount: "Transit Windsor 30-day APP pass: $63 adult or $43.50 youth, before taxes",
    summary:
      "A fee subsidy for Windsor-Essex residents and households on a low income. For approved applicants, Transit Windsor lists a 30-day bus pass at $63 for adults or $43.50 for youth, before taxes.",
    note: "These are Transit Windsor's prices. Eligibility rules may differ between municipalities. If you live elsewhere in Windsor-Essex, contact your local municipal transit department. Funding is first come, first served. The local transit department decides all approvals, based on local demand and budgets.",
    requires: ["windsor", "lowIncome", "p2pIncomeTest"],
    eligibility: {
      mode: "all",
      items: [
        "Residents who have lived within Windsor-Essex County for at least 30 days and who are able to demonstrate residency",
        "A combined household income that is at, or below, the Market Basket Measure (MBM) thresholds",
      ],
      note: "The programme page does not list the MBM thresholds; for further details it directs you to contact your local municipal transit department. International students, full-time post-secondary students and foreign workers are not eligible, although exceptions may apply within municipalities. Eligibility criteria may differ across municipalities.",
    },
    applyText: "See Affordable Pass details",
    applyUrl: "https://www.citywindsor.ca/residents/social-services/social-policy-and-pathway-to-potential/pathway-to-potential/p2p-programs/affordable-pass-program",
    source: "https://www.citywindsor.ca/residents/social-services/social-policy-and-pathway-to-potential/pathway-to-potential/p2p-programs/affordable-pass-program",
    detail: {
      about:
        "Pathway to Potential is a poverty-reduction strategy for the Windsor-Essex region, jointly funded by the City of Windsor and County of Essex. Its Affordable Pass Program is a fee subsidy that provides affordable transportation for Windsor-Essex residents and households living on a low income by subsidizing eligible residents' bus-pass costs before taxes. Transit Windsor publishes 30-day APP prices of $63 for an adult and $43.50 for a youth. Eligibility criteria may differ across municipalities, so applicants must contact their local municipal transit department.",
      aboutList: {
        lead: "The Affordable Pass Program lowers bus-pass costs for approved Windsor-Essex residents living on a low income.",
        items: [
          "Transit Windsor's APP prices are $63 for an adult 30-day pass and $43.50 for a youth 30-day pass, before taxes.",
          "Transit Windsor's regular Smart Pass prices are $124 for an adult aged 20 to 59, $85 for a youth aged 13 to 19, and $63 for a senior aged 60 and over.",
          "Transit Windsor charges $3.95 for a single adult, senior or youth fare, including a 2-hour transfer.",
          "The APP adult 30-day price and Transit Windsor's regular senior 30-day price are both $63, so the APP is worth less to a rider who is already 60 or over.",
          "Other municipalities may have different eligibility criteria; contact your local municipal transit department if you live elsewhere in Windsor-Essex.",
        ],
      },
      steps: [
        "Ask your local municipal transit department for the Market Basket Measure threshold for your family size — the programme page does not list it",
        "Gather your proof of residency and your combined-household-income documents — you must also have lived within Windsor-Essex County for at least 30 days",
        "Apply through your local municipal transit department; funding is available on a first-come, first-served basis",
        "If Transit Windsor approves you, get the APP pass at the Windsor International Transit Terminal, 300 Chatham Street West — it is available only there, with proof of identification",
        "Tell your municipality about any change to financial, residency or other circumstances within 30 days of the change taking effect",
      ],
      documents: [
        "Preferred proof of income: a Canada Child Benefit notice, a Notice of Assessment, or proof of Ontario Works or Ontario Disability Support Program benefits",
        "One proof of residency: Ontario Driver's Licence, Ontario Health Card, Ontario Photo Card, current utility bill, property tax bill, lease or rental agreement, mortgage statement, or current bank statement",
        "Proof of identification when getting a Transit Windsor APP pass at the Windsor International Transit Terminal",
        "Additional documentation may be requested",
        "If you cannot provide the required documents, or your circumstances recently changed in a way they do not reflect, a Letter of Endorsement may be used. It should be on professional letterhead, include the referring agency's contact information and the client's full name, outline the benefits the subsidy would provide, and indicate the barriers preventing application. Acceptance is at the discretion of the municipality",
      ],
      tips: [
        "Funding is first come, first served.",
        "Each eligible person can get the discount for 12 months from the date of approval.",
        "The local transit department decides all approvals. They depend on local demand and budgets.",
        "Report any change to your finances, residency or other circumstances within 30 days of it taking effect. If you do not, the provider reserves the right to end your eligibility.",
        "You cannot transfer your eligibility. You cannot sell, transfer, trade, give away or share passes.",
        "You can only get the Transit Windsor APP pass at the Windsor International Transit Terminal, 300 Chatham Street West. Bring proof of identification.",
      ],
    },
  },
  {
    id: "windsor-recreation-assistance",
    name: "90% Recreation Discount (Windsor)",
    level: "Windsor",
    category: "Recreation",
    amount: "90% off eligible program registration fees, before taxes",
    summary:
      "The 90% Recreation Discount is part of the Pathway to Potential Recreation Assistance Program. It gives eligible Windsor-Essex residents 90% off eligible recreation program registration fees, before taxes.",
    note: "Eligibility may differ between municipalities. Apply or ask questions through your local municipal recreation department. Funding is first come, first served. The local recreation department decides all approvals, based on local demand and budgets.",
    requires: ["windsorEssex", "lowIncome", "p2pIncomeTest"],
    eligibility: {
      mode: "all",
      items: [
        "Residents who have lived within Windsor-Essex County for at least 30 days and who are able to demonstrate residency",
        "A combined household income that is at, or below, the Market Basket Measure (MBM) thresholds",
        "A sustained sport, physical, cultural or artistic program — the City says these should run at least five weeks with at least one session per week — or a day camp or specialty camp, which must last at least five consecutive days for consideration",
      ],
      note: "The programme page does not list the MBM thresholds; for further details it directs you to contact your local municipal recreation department. Competitive activities, travel teams, fitness centre orientations, personal training and private lessons are not eligible. Program eligibility may differ across municipalities.",
    },
    applyText: "See recreation assistance details",
    applyUrl: "https://www.citywindsor.ca/residents/social-services/social-policy-and-pathway-to-potential/pathway-to-potential/p2p-programs/recreation-assistance-program",
    source: "https://www.citywindsor.ca/residents/social-services/social-policy-and-pathway-to-potential/pathway-to-potential/p2p-programs/recreation-assistance-program",
    detail: {
      about:
        "Pathway to Potential is a poverty-reduction strategy for the Windsor-Essex region, jointly funded by the City of Windsor and County of Essex. Its Recreation Assistance Program provides affordable recreational, cultural and artistic opportunities for Windsor-Essex residents living in low-income households. This record covers the 90% Recreation Discount, which subsidizes eligible residents for 90% off program registration fees before taxes. The Recreation Assistance Program also includes Third Party Partnerships, Targeted Initiatives and Universal Programs.",
      aboutList: {
        lead: "The 90% Recreation Discount lowers eligible program registration fees for approved Windsor-Essex residents.",
        items: [
          "90% off the program registration fee before taxes.",
          "Funding covers program registration fees, but not equipment or material costs.",
          "It extends to eligible programs and services delivered directly by municipal recreation departments and approved service organizations within Windsor-Essex County.",
          "Payment is issued directly to the program provider, or you can request reimbursement if registration fees were paid in advance. A reimbursement request must be made within 30 days of payment.",
          "Program eligibility may differ across municipalities; contact your local municipal recreation department.",
        ],
      },
      steps: [
        "Ask your local municipal recreation department for the Market Basket Measure threshold for your family size — the programme page does not list it",
        "Check that the activity meets the duration rules and is not one of the excluded activities",
        "If a service organization runs the program, ask your local recreation department whether that organization is approved",
        "Gather your proof of residency and your combined-household-income documents — you must also have lived within Windsor-Essex County for at least 30 days",
        "Apply through your local municipal recreation department; funding is available on a first-come, first-served basis",
        "Use approved funding within the calendar year, and tell your municipality about changes to your financial, residency or other circumstances within 30 days of the change taking effect",
      ],
      documents: [
        "Preferred proof of income: a Canada Child Benefit notice, a Notice of Assessment, or proof of Ontario Works or Ontario Disability Support Program benefits. The Canada Child Benefit notice is preferred for 90% Recreation Discount applicants",
        "One proof of residency: Ontario Driver's Licence, Ontario Health Card, Ontario Photo Card, current utility bill, property tax bill, lease or rental agreement, mortgage statement, or current bank statement",
        "Additional documentation may be requested",
        "If you cannot provide the required documents, or your circumstances recently changed in a way they do not reflect, a Letter of Endorsement may be used. It should be on professional letterhead, include the referring agency's contact information and the client's full name, outline the benefits the subsidy would provide, and indicate the barriers preventing application. Acceptance is at the discretion of the municipality",
      ],
      tips: [
        "Funding goes to ongoing sport, physical, cultural or artistic programs. The City says they should run at least five weeks, with at least one session each week. Day camps and specialty camps must last at least five days in a row to be considered.",
        "These are not eligible: competitive activities, travel teams, fitness centre orientations, personal training and private lessons.",
        "Funding is available per eligible person per calendar year, and approved funding must be used within that calendar year. It is not transferable from one year to the next.",
        "The local recreation department decides all approvals. They depend on local demand and budgets.",
        "You cannot transfer your eligibility.",
        "Before you register, ask your local recreation department if a service organization is approved.",
      ],
    },
  },
  {
    id: "hamilton-fare-assist",
    name: "HSR Fare Assist (Hamilton)",
    level: "Hamilton",
    category: "Transit",
    amount: "50% off single-ride PRESTO fares for a year",
    summary:
      "Half-price single-ride PRESTO fares on Hamilton transit. It is for households below the Low-Income Measure, including people who get ODSP or CPP Disability. It covers accessible DARTS trips and regular buses. It covers everyone eligible in the household.",
    note: "The discount does not apply to monthly or annual passes. It lasts one year from approval, and you re-apply each year. Fare Assist became permanent on January 1, 2026. It replaced two earlier programs. One was the Affordable Transit Pass for Ontario Works recipients. The other was the Temporary Transit Fare Special Program for people who use a personal mobility device such as a wheelchair, scooter or walker, and for CNIB cardholders.",
    requires: ["hamilton", "hamiltonFareRoute"],
    eligibility: {
      mode: "all",
      items: [
        "You live in Hamilton",
        "You receive Ontario Works or ODSP, or your total household income is below the Statistics Canada Low-Income Measure for your family size",
      ],
      note: "Eligibility is based on total household income regardless of where the income comes from — employment, Ontario Works, ODSP, the Canada Pension Plan disability benefit, Employment Insurance, or WSIB payments all count the same way. Recent refugees, newcomers to Canada, and people aged 18 or 19 who have not yet filed a tax return may also qualify. After-tax income limits by family size: $30,255 for 1 person, $42,787 for 2, $52,403 for 3, $60,510 for 4, $67,652 for 5, $74,109 for 6, $80,047 for 7, $85,574 for 8, $90,765 for 9 and $95,675 for 10.",
    },
    applyText: "Apply for Fare Assist",
    applyUrl: "https://www.hamilton.ca/home-neighbourhood/hsr/fares/hsr-fare-assist",
    source: "https://www.hamilton.ca/home-neighbourhood/hsr/fares/hsr-fare-assist",
    detail: {
      about:
        "Fare Assist gives Hamilton residents living below the Statistics Canada Low-Income Measure a 50 per cent discount on single-ride PRESTO fares, for themselves and their family, for one year following approval. Eligibility is based on total household income regardless of income source. The discount applies to both conventional and accessible transit, so it covers trips taken on DARTS vehicles as well as HSR buses. The City estimates about 88,000 Hamiltonians will benefit.",
      aboutList: {
        lead: "Fare Assist halves single-ride PRESTO fares for lower-income Hamilton households.",
        items: [
          "50 per cent off current single-ride PRESTO fares, for one year after approval.",
          "Applies to accessible transit as well as conventional buses, including trips on DARTS vehicles.",
          "Covers every eligible member of the household, including a spouse and children aged 13 to 17. Children 12 and under already ride free with PRESTO.",
          "After 11 paid PRESTO trips in the same week, from Monday 12:01 a.m. to Sunday 11:59 p.m., you are not charged again that week.",
          "It does not apply to monthly or annual passes.",
        ],
      },
      steps: [
        "Check your total household income against the Low-Income Measure for your family size",
        "Apply through the City of Hamilton — if you receive Ontario Works or ODSP you give your Member ID; otherwise your total household income, from any source, must be below the Low-Income Measure for your family size",
        "Once approved, the 50 per cent discount applies to single-ride PRESTO fares for one year",
        "Load funds onto your PRESTO card as you need them",
        "Re-apply each year to keep the discount",
      ],
      documents: [
        "If you receive Ontario Works or ODSP: your Member ID. Everyone else: a current Notice of Assessment for all family members",
        "Your PRESTO card, which the discount is applied to",
        "Identification showing your current address, such as a driver's license, health card or government-issued ID",
      ],
      tips: [
        "The discount covers DARTS accessible transit trips, not only regular HSR buses.",
        "Where your income comes from does not matter. ODSP, CPP Disability, WSIB, Employment Insurance, Ontario Works and employment income are all treated the same.",
        "Recent refugees, newcomers, and 18- or 19-year-olds who have not filed a tax return yet may still qualify.",
        "The weekly cap means you ride free after 11 paid trips in the same Monday-to-Sunday week.",
        "You may have been on the old Affordable Transit Pass or the mobility-device and CNIB fare program. Fare Assist replaced both on January 1, 2026.",
      ],
    },
  },
  {
    id: "brampton-activeassist",
    name: "ActiveAssist fee subsidy (Brampton)",
    level: "Brampton",
    category: "Recreation",
    amount: "$275 for each eligible family member, as one lump sum — a family of four receives $1,100",
    summary:
      "A City of Brampton fee subsidy that helps low-income families and individuals join recreation programs. It is added as a credit on your account. Once approved, you qualify for two years.",
    note: "An ActiveAssist amount that has expired is not renewed on its own. You have to re-apply. The City says it has received many more applications, so approvals are taking longer.",
    requires: ["brampton", "lowIncome"],
    eligibility: {
      mode: "all",
      items: [
        "You live in Brampton and can show proof of residency, such as a utility bill, lease agreement or driver's licence",
        "You can provide proof of total family net income",
        "You can provide proof of legal responsibility for every dependant listed on the application",
      ],
      note: "The City describes the program as being for low-income families and individuals but does not publish an income threshold on this page. Confidentiality is always maintained.",
    },
    applyText: "Apply for ActiveAssist",
    applyUrl: "https://www.brampton.ca/EN/residents/Recreation/Active-Assist/",
    source: "https://www.brampton.ca/EN/residents/Recreation/Active-Assist/",
    detail: {
      about:
        "ActiveAssist is a fee subsidy program offered by the City of Brampton, designed to help low-income families and individuals in Brampton participate in recreation programs. The assistance is given as a credit to your account. Once your application is approved, staff apply $275 for each eligible member of the family to the primary account holder as a single lump sum — so an approved family of four receives $1,100. Once approved, you qualify for the program for two years.",
      aboutList: {
        lead: "ActiveAssist is Brampton's recreation fee subsidy for low-income families and individuals.",
        items: [
          "$275 for each eligible family member, paid to the primary account holder as one lump sum.",
          "An approved family of four receives $1,100.",
          "Once approved, you qualify for two years.",
          "Credits can be used toward most registered programs, drop-in programs and memberships, though some exclusions apply.",
          "Confidentiality is always maintained.",
        ],
      },
      steps: [
        "Gather proof of Brampton residency, proof of total family net income, and proof of legal responsibility for each dependant on the application",
        "Apply online, attaching the required documentation",
        "Or pick up and drop off an application form at any Brampton Recreation Centre",
        "Or mail it to ActiveAssist Brampton, 2 Wellington St. W., Brampton, ON L6Y 4R2",
        "A member of the team contacts you once the completed application is received",
      ],
      documents: [
        "Proof of residency, such as a utility bill, lease agreement or driver's licence",
        "Proof of total family net income",
        "Proof of legal responsibility for all dependants listed on the application",
      ],
      tips: [
        "The subsidy lasts two years, longer than most municipal recreation subsidies. It does not renew on its own, so re-apply when it expires.",
        "Each eligible family member adds $275 to the lump sum, so list everyone who qualifies.",
        "Some limits apply to what you can spend credits on. Ask at your recreation centre before you register.",
        "The City says approvals are taking longer because of a rise in applications. Send questions to recreation@brampton.ca.",
      ],
    },
  },
  {
    id: "mississauga-activeassist",
    name: "ActiveAssist fee assistance (Mississauga)",
    level: "Mississauga",
    category: "Recreation",
    amount: "$275 a year for each eligible family member",
    summary:
      "Fee assistance that helps Mississauga residents in low-income households, and newcomers with refugee status, join City recreation and culture programs. Each eligible person on the application gets a credit for the year.",
    note: "The credit cannot be refunded and is good for one year. You re-apply with supporting documents every year. You cannot get ActiveAssist at the same time as another City fee assistance program, such as the Jerry Love Children's Fund.",
    requires: ["mississauga", "lowIncome"],
    eligibility: {
      mode: "any",
      items: [
        "An individual or family without dependants under 18, with net individual or combined family income below the Low Income Cut Off",
        "A family with dependants under 18, with combined net family income below the Low Income Cut Off, shown with documentation such as Canada Child Benefits forms",
        "A newcomer with refugee status, shown with a Confirmation of Permanent Residency, a Refugee Protection Claimant Document, or a document issued under a special IRCC program such as a CUAET visa, issued within the past year",
      ],
      note: "You are not eligible if you are a child under 18 applying alone — a parent or legal guardian must apply with you — if you are a full-time college or university student with no dependants, or if you already receive another City fee assistance program. Low Income Cut Off amounts, updated May 1, 2026: $26,440 for 1 person, $32,179 for 2, $40,071 for 3, $49,991 for 4, $56,925 for 5, $63,131 for 6, and $69,337 for 7 or more.",
    },
    applyText: "Apply for ActiveAssist",
    applyUrl: "https://www.mississauga.ca/recreation-and-sports/sports-and-activities/assistance-programs/active-assist/",
    source: "https://www.mississauga.ca/recreation-and-sports/sports-and-activities/assistance-programs/active-assist/",
    detail: {
      about:
        "ActiveAssist is the City of Mississauga's fee assistance program. It gives residents in low-income households, and newcomers with refugee status, access to recreation and culture programs. Each eligible family member listed on the application receives a non-refundable credit of $275 valid for one year, and applicants reapply with supporting documents annually.",
      aboutList: {
        lead: "ActiveAssist helps Mississauga residents afford City recreation and culture programs.",
        items: [
          "$275 for each eligible family member listed on the application.",
          "The credit is non-refundable and valid for one year.",
          "Open to low-income households and to newcomers with refugee status.",
          "You reapply and provide supporting documents every year.",
          "You cannot combine it with another City fee assistance program such as the Jerry Love Children's Fund.",
        ],
      },
      steps: [
        "Check your net income against the Low Income Cut Off amount for your family size, or gather your refugee status document if that is your route",
        "Complete the Fee Assistance Program Application at your local community centre, or apply online",
        "Provide one or more original current supporting documents when you submit",
        "The City processes applications within 15 business days",
        "Once approved you receive an email with your account start date and registration information",
      ],
      documents: [
        "Documentation showing net individual or combined family income below the Low Income Cut Off",
        "For a family with dependants under 18, documentation indicating those dependants, such as Canada Child Benefits forms",
        "For a newcomer with refugee status, a Confirmation of Permanent Residency, Refugee Protection Claimant Document, or a document under a special IRCC program such as a CUAET visa, issued within the past year",
      ],
      tips: [
        "A child under 18 cannot apply alone. A parent or legal guardian fills out the application with them.",
        "Full-time college and university students with no dependants are not eligible.",
        "Bring original, current documents, not photocopies, when you submit the application.",
        "Each eligible family member on the application gets their own $275, so list everyone who qualifies.",
      ],
    },
  },
  {
    id: "ottawa-hand-in-hand",
    name: "Ottawa Hand in Hand recreation fee support",
    level: "Ottawa",
    category: "Recreation",
    amount: "$185 a year per person toward City recreation and culture programs",
    summary:
      "Fee support for City of Ottawa recreation and culture programs, for residents with a low income, a family member with a disability, or who already take part in a community or social service agency program. Receiving ODSP or Assistance for Children with Severe Disabilities counts as proof of financial need.",
    note: "A parent or guardian can transfer all or part of their fee support to a child in their household. You are encouraged to pay at least 25 per cent of the program cost yourself.",
    requires: ["ottawa", "lowIncome"],
    eligibility: {
      mode: "all",
      items: [
        "You live in the City of Ottawa",
        "You are applying for yourself or for a dependant",
        "You can show proof of identity, residency and financial need",
      ],
      note: "Residents of all ages are eligible. Financial need can be shown by evidence of receiving Essential Health and Social Supports, the Ontario Disability Support Program, Assistance for Children with Severe Disabilities, or the Guaranteed Income Supplement; by a means test using the Low Income Cut-Off; or by a T451E Notice of Assessment or Child Tax Benefit form. Special circumstances may also be considered.",
    },
    applyText: "See how to apply for Hand in Hand",
    applyUrl: "https://ottawa.ca/en/recreation-and-parks/register-courses-and-camps/registration-terms-and-cancellations/financial-support-ottawa-hand-hand",
    source: "https://ottawa.ca/en/recreation-and-parks/register-courses-and-camps/registration-terms-and-cancellations/financial-support-ottawa-hand-hand",
    detail: {
      about:
        "Ottawa Hand in Hand is the City of Ottawa's recreation and culture fee support program. Each qualifying individual, or member of a family, is eligible for an annual amount of fee support of $185 per person, which can be used toward programs and activities offered by the Recreation, Cultural and Facility Services Department. Only City of Ottawa residents may apply, on their own behalf or for a dependant.",
      aboutList: {
        lead: "Ottawa Hand in Hand helps with the cost of City recreation and culture programs.",
        items: [
          "$185 a year for each qualifying person, including each member of a family.",
          "Covers programs and activities run by the City's Recreation, Cultural and Facility Services Department.",
          "Residents of all ages are eligible.",
          "A parent or guardian can transfer all or part of their entitlement to a child in their household.",
          "Applicants are encouraged to pay at least 25 per cent of the program cost themselves.",
        ],
      },
      steps: [
        "Gather proof of identity, residency and financial need — be ready to provide copies of formal documentation",
        "If you receive Ontario Works, ask your case worker to complete the application for you",
        "Otherwise complete the application form, or pick one up at most staffed recreation facilities or at a Client Service Centre",
        "Bring the completed form to your local recreation or cultural facility, where a supervisor reviews it for approval",
        "Apply as early as you can, before the program registration period opens",
      ],
      documents: [
        "Proof of identity and of Ottawa residency",
        "Proof of financial need — for example evidence of receiving ODSP, Assistance for Children with Severe Disabilities, Essential Health and Social Supports or the Guaranteed Income Supplement, a Low Income Cut-Off means test, a T451E Notice of Assessment, or a Child Tax Benefit form",
      ],
      tips: [
        "You can only get approved in person at a recreation or cultural facility, not online.",
        "Apply as early as you can before registration opens. Popular programs fill up.",
        "If you get ODSP or Assistance for Children with Severe Disabilities, that is accepted as proof of financial need.",
        "Unlike some other cities' subsidies, a parent or guardian can move their fee support to a child in the household.",
      ],
    },
  },
  {
    id: "toronto-fair-pass",
    name: "Fair Pass Transit Discount (Toronto)",
    level: "Toronto",
    category: "Transit",
    amount: "36% off adult single fares — $2.10 instead of $3.30, capped at $98.70 a month",
    summary:
      "A discount on TTC and Wheel-Trans fares for lower-income Toronto residents. It is loaded onto your PRESTO card for 12 months. If you get ODSP or Ontario Works, you already meet the income test.",
    note: "The TTC sets the amounts, and they may change. They are based on paying with PRESTO. From August 1, 2026, the program reviews eligibility every year. Active Ontario Works, ODSP and Child Care Fee Subsidy clients are reviewed for renewal. If the City cannot verify your eligibility from its records, it will contact you with next steps.",
    requires: ["toronto", "torontoFairPassAge", "lowIncome"],
    eligibility: {
      mode: "all",
      items: [
        "Between 20 and 64 years of age",
        "Live in the City of Toronto",
        "Have a PRESTO card number",
        "Total after-tax family income below 75% of the Low-Income Measure After-Tax threshold. The City counts income for family members aged 20 to 64 (one line of its page says over 18).",
      ],
      note: "Residents already receiving Ontario Works, Emergency Assistance or ODSP meet the financial eligibility criteria. If you are 13 to 19 or 65 and over, ask the TTC about youth, student and seniors fares instead. The City's income table says income is only calculated for family members aged 20 to 64, while another line says family members over 18; ask the City who is counted.",
    },
    applyText: "Apply for Fair Pass",
    applyUrl: "https://www.toronto.ca/community-people/employment-social-support/support-for-people-in-financial-need/assistance-through-ontario-works/transit-discount/",
    source: "https://www.toronto.ca/community-people/employment-social-support/support-for-people-in-financial-need/assistance-through-ontario-works/transit-discount/",
    detail: {
      about:
        "The Fair Pass Transit Discount Program gives a full year of savings on TTC and Wheel-Trans trips by taking 36 per cent off adult single fares, applied directly to your PRESTO card. The discount is programmed onto the card for 12 months and reduces each adult single ride by $1.20. Once you have paid for 47 trips in the same month you pay no more for TTC travel that month, so the most you pay is $98.70.",
      aboutList: {
        lead: "Fair Pass takes 36 per cent off adult single TTC fares for lower-income Toronto residents.",
        items: [
          "Covers both TTC and Wheel-Trans trips.",
          "A regular adult single fare of $3.30 costs you $2.10, saving $1.20 a ride.",
          "After 47 paid trips in the same month you pay nothing more that month — a cap of $98.70.",
          "The discount is loaded onto your PRESTO card and lasts 12 months.",
          "Receiving Ontario Works, Emergency Assistance or ODSP means you already meet the income test.",
        ],
      },
      steps: [
        "Get a PRESTO card and note its card number",
        "Gather proof of income for yourself and every family member 18 or older, or your Ontario Works, ODSP or Child Care Fee Subsidy program identification number instead",
        "Apply online, or call 416-338-8888 for a paper application, help by phone, or language interpretation",
        "Once approved, the discount is programmed onto your PRESTO card for 12 months",
      ],
      documents: [
        "Your PRESTO card number",
        "An email address and your Toronto address",
        "Information for yourself and each family member living with you",
        "Your Ontario Works member ID, ODSP member ID, or Child Care Fee Subsidy household or client file number — or proof of income documents instead",
      ],
      tips: [
        "If you get Ontario Works, Emergency Assistance or ODSP, you meet the financial criteria. You do not need income documents if you get Ontario Works, ODSP or Child Care Fee Subsidy. Emergency Assistance is not on that list, so you may need to give proof of income.",
        "The discount covers Wheel-Trans as well as regular TTC service.",
        "The Human Services Integration Office helps people who get social assistance apply by phone. It also offers language interpretation and paper applications if you ask.",
        "Some clients must reapply. If you actively get Ontario Works, ODSP or Child Care Fee Subsidy, you may not need to. If you do, the City contacts you 45 days before your discount expires. From August 1, 2026, eligibility is reviewed every year.",
      ],
      phone: "416-338-8888",
    },
  },
  {
    id: "toronto-welcome-policy",
    name: "Welcome Policy recreation fee subsidy (Toronto)",
    level: "Toronto",
    category: "Recreation",
    amount: "$683.04 a year for a child or youth up to 24; $314.60 a year at 25 and over",
    summary:
      "A yearly credit toward City of Toronto recreation programs for lower-income residents. It covers registered programs, instructional swim and sport, camps, after-school care, memberships and multi-use passes.",
    note: "The credit is valid for 12 months from the date your application is approved, does not carry over into the next year, and is not transferable between family members. You must re-apply and submit documents each year.",
    requires: ["toronto", "lowIncome"],
    eligibility: {
      mode: "all",
      items: [
        "The main applicant is 18 years of age or older",
        "You live in the city of Toronto",
        "Total after-tax family income, counting every family member over 18, is below the Low-Income Measure After-Tax threshold",
      ],
      note: "The Welcome Policy income thresholds were last updated on February 25, 2026 using Statistics Canada's LIM-AT 2023 data: $30,255 for 1 person, $42,787 for 2, $52,403 for 3, $60,510 for 4, $67,652 for 5, $74,109 for 6 and $80,047 for 7. Statistics Canada updates LIM-AT annually.",
    },
    applyText: "Apply for the Welcome Policy",
    applyUrl: "https://www.toronto.ca/community-people/employment-social-support/child-family-support/welcome-policy-recreation-fee-subsidy/",
    source: "https://www.toronto.ca/community-people/employment-social-support/child-family-support/welcome-policy-recreation-fee-subsidy/",
    detail: {
      about:
        "The Welcome Policy gives lower-income Toronto residents a financial credit toward City-operated recreation programs. The credit is valid for 12 months from the date an application is approved and is set per person per year: $683.04 for a child or youth up to age 24, and $314.60 for an adult or older adult aged 25 and over. Credits are not transferable between family members and do not carry over, so you re-apply each year. It is administered by the Human Services Integration Office.",
      aboutList: {
        lead: "The Welcome Policy is a yearly credit toward City of Toronto recreation programs for lower-income residents.",
        items: [
          "$683.04 a year for a child or youth up to age 24.",
          "$314.60 a year for an adult or older adult aged 25 and over.",
          "Can be used for registered recreation programs, instructional swim and sport programs, camps and after-school care.",
          "Also covers memberships and multi-use passes, including Junior Golf and Ski memberships.",
          "Valid 12 months from approval, not transferable between family members, and does not carry over.",
        ],
      },
      steps: [
        "Check your total after-tax family income against the Welcome Policy threshold for your family size",
        "Gather proof of income for each family member 18 or older, or your Ontario Works member ID, ODSP member ID or Child Care Fee Subsidy household or client file number instead",
        "Apply through the City of Toronto, or call 416-338-8888 for help",
        "Once approved, use the credit toward recreation registrations for the next 12 months",
        "Re-apply and submit documents again the following year",
      ],
      documents: [
        "Proof of income for each family member 18 or older — or your program identification number if you receive Ontario Works, ODSP or Child Care Fee Subsidy",
        "Documents for each family member included in the application",
      ],
      tips: [
        "Amounts are per person per year. You cannot move them between family members.",
        "The credit does not carry over, so use it within the 12 months.",
        "To add new family members or children in your temporary care to an existing file, call the Human Services Integration Office at 416-338-8888.",
        "Only income for family members aged 18 and over counts toward the threshold.",
      ],
      phone: "416-338-8888",
    },
  },
  {
    id: "trillium-drug-program",
    name: "Trillium Drug Program",
    level: "Ontario",
    category: "Health",
    amount: "Covers eligible drugs above a deductible that for most people is about 4% of after-tax household income, then up to $2 for each drug filled or refilled",
    summary:
      "Helps Ontario households with high prescription-drug costs compared with their income. For most people the deductible is about 4% of after-tax household income, paid in four quarterly amounts; once you have paid a quarter's amount, you pay up to $2 for each drug filled or refilled until the end of that quarter.",
    note: "For the deductible, your household income is the net income you reported to the Canada Revenue Agency for the previous tax year. This is the amount on line 23600 of your Notice of Assessment. Subtract any amount you withdrew from a Canadian Registered Disability Savings Plan, shown on line 12500 of your tax return. Only money your household actually pays out of pocket counts toward the deductible. Amounts covered by private insurance, a drug company or a discount card do not count.",
    requires: ["on", "tdpDeductible"],
    eligibility: {
      mode: "all",
      items: [
        "You live in Ontario and have a valid Ontario health card number",
        "You do not already qualify for the Ontario Drug Benefit program (for example, you are not enrolled in a program such as Ontario Works)",
        "You do not have an insurance plan that pays for 100% of your drugs",
        "You spend about 4% or more of your after-tax household income on prescription-drug costs",
      ],
      note: "You apply as a household. You can apply for yourself if you live alone or only with people the page does not list. Otherwise you have to include your spouse (the page lists married and some other partner cases) and another person you live with if one of you is a parent, grandparent or legal guardian of the other and one of you is dependent on the other for support.",
    },
    applyText: "Apply to the Trillium Drug Program",
    applyUrl: "https://www.ontario.ca/page/get-help-high-prescription-drug-costs",
    source: "https://www.ontario.ca/page/get-help-high-prescription-drug-costs",
    detail: {
      about:
        "The Trillium Drug Program helps Ontarians pay for high prescription-drug costs relative to their household income. It covers the cost of more than 5,900 medications available through the Ontario Drug Benefit program, plus almost 1,500 additional drug products that meet specific criteria through the Exceptional Access Program. You pay a deductible first — for most people about 4% of household income after taxes, split into four quarterly amounts — and once a quarter's amount is paid you pay up to $2 for each drug filled or refilled until the end of that quarter.",
      aboutList: {
        lead: "The Trillium Drug Program helps Ontario households with high prescription-drug costs relative to their income.",
        items: [
          "Covers more than 5,900 medications available through the Ontario Drug Benefit program, plus almost 1,500 more through the Exceptional Access Program.",
          "For most people the deductible is about 4% of household income after taxes.",
          "Once a quarter's deductible is paid, you pay up to $2 for each drug filled or refilled until the end of that quarter.",
          "The deductible is divided into four equal quarterly amounts across the four quarters of the program year.",
          "The program year runs from August 1 to July 31.",
        ],
      },
      steps: [
        "Check that you live in Ontario, have a valid Ontario health card, do not already qualify for the Ontario Drug Benefit, and do not have insurance covering 100% of your drugs",
        "Complete the Trillium Drug Program application on the Ontario Drug Benefit Program Online Applications and Forms website, applying as a household",
        "If you do not have a computer, request a paper form and guide by phone or email",
        "Once enrolled you receive a confirmation letter telling you your deductible for the year and listing everyone covered",
        "Tell your pharmacist, doctor or nurse practitioner that you have applied, so they can prescribe drugs covered by the Ontario Drug Benefit Program",
      ],
      documents: [
        "Your Ontario health card number",
        "Your household's income information from the previous tax year, including line 23600 of your Notice of Assessment",
        "Receipts for eligible drugs your household has paid for out of pocket",
      ],
      tips: [
        "Apply by September 30 to be repaid for eligible drugs you got in the previous program year. The program year runs August 1 to July 31.",
        "Your enrolment renews automatically every year if you file your income taxes on time. You get a yearly confirmation letter.",
        "Money you withdraw from a Canadian Registered Disability Savings Plan is subtracted from the income used to work out your deductible.",
        "Only what your household pays out of pocket counts toward the deductible. Amounts paid by private insurance, a drug company or a drug discount card do not count.",
        "You do not pay the whole deductible at once. It is split into four equal quarterly amounts across the program year.",
        "Each new quarter starts with that quarter's deductible. An unpaid amount carries over to the next quarter, but not into the next year.",
      ],
      phone: "1-800-575-5386",
    },
  },
  {
    id: "passport-program",
    needsPractitioner: true,
    name: "Passport program (adults with a developmental disability)",
    level: "Ontario",
    category: "Community supports",
    amount: "$5,665 a year, up to $45,604 based on assessed need",
    summary:
      "Funding for adults 18 or older with a developmental disability. It helps them take part in their community and live as independently as possible, and it gives their caregivers a break. It is a reimbursement program: you send in receipts and are repaid up to your annual allocation.",
    note: "Every Passport recipient gets at least $5,665 a year. You may get more, up to $45,604. This depends on your assessed level of need and on funding becoming available. Passport agencies keep a waiting list for the additional amounts.",
    requires: ["on", "age18plus", "passportDevelopmental", "passportDso"],
    eligibility: {
      mode: "all",
      items: [
        "Has a developmental disability",
        "Is 18 years old or older",
        "Is a resident of Ontario",
        "Either needs support to participate in the community while still in school, or has left school and is living with family or independently in a supportive living arrangement",
      ],
      note: "A developmental disability should be determined by a psychologist or psychological associate registered with the College of Psychologists of Ontario, or the equivalent body in another province.",
    },
    applyText: "Apply through Developmental Services Ontario",
    applyUrl: "https://www.ontario.ca/page/passport-program-adults-developmental-disability",
    source: "https://www.ontario.ca/page/passport-program-adults-developmental-disability",
    detail: {
      about:
        "Passport helps adults 18 or older with a developmental disability take part in their communities and live as independently as possible, and it helps their caregivers take a break from caregiving. It is a reimbursement program: you submit invoices and receipts for admissible expenses and are reimbursed up to your annual funding allocation. Passport is funded by the Ontario government and administered by local Passport agencies. All recipients receive a minimum of $5,665 a year, and it is possible to receive more, up to a maximum of $45,604, based on assessed need.",
      aboutList: {
        lead: "Passport funds services and supports for adults with a developmental disability.",
        items: [
          "Pays for taking part in community classes or recreational programs, developing work, volunteer and daily life skills, hiring a support worker, person-directed planning, and temporary respite for caregivers.",
          "It is a reimbursement program — you submit invoices and receipts and are repaid up to your annual allocation.",
          "Every recipient receives a minimum of $5,665 a year.",
          "More is possible, up to a maximum of $45,604, based on your assessed level of need and as funding becomes available.",
          "Funded by the Ontario government and administered by local Passport agencies.",
        ],
      },
      steps: [
        "Contact your local Developmental Services Ontario (DSO) office, which manages applications for provincially funded adult developmental services",
        "DSO confirms whether you are eligible for government-funded adult developmental services",
        "Once confirmed, DSO connects you with your local Passport agency for $5,665 a year in funding",
        "To seek more than $5,665, complete an application package so DSO can fully assess your needs; your information then goes to your local Passport agency",
        "Submit invoices and receipts for admissible expenses to be reimbursed up to your allocation",
      ],
      documents: [
        "The developmental disability should be determined by a psychologist or psychological associate registered with the College of Psychologists of Ontario, or the equivalent body in another province",
        "Invoices and receipts for admissible expenses, to claim reimbursement",
      ],
      tips: [
        "Tell DSO if anything in your application changes. They can then reassess you and re-prioritize you using the most up-to-date information.",
        "If you are approved for more than $5,665 and accept between April and September, you get a full 12-month amount in the first year. If you accept between October and March, you get a 6-month amount in the first year and a full year after that. Either way, you get at least $5,665 in your first year.",
        "Passport agencies keep the list of people waiting for additional funding above $5,665.",
        "Claims for a service or product you received on or before March 31, 2026 must be submitted by March 31, 2027.",
        "From March 31, 2027, you have 12 months after the end of each fiscal year (which ends March 31) to submit claims. This is for anything bought on or after April 1, 2026.",
      ],
    },
  },
  {
    id: "hvmp",
    name: "Home and Vehicle Modification Program",
    level: "Ontario",
    category: "Home",
    amount: "Funding for approved home or vehicle modifications (no published maximum)",
    summary:
      "Pays for changes to your home or vehicle. It is for children, adults and seniors with a disability that limits mobility. The changes help them keep living safely at home, take part in their community, and avoid losing a job. The Ontario page sends applicants to March of Dimes for eligibility and application details.",
    note: "You must first use any other public or private funding you can get before you can be considered eligible. If your household income is over $38,000, you may have to pay part of the cost of the modification.",
    requires: ["on", "hvmpMobility", "hvmpIncome", "hvmpCoordinator"],
    eligibility: {
      mode: "all",
      items: [
        "A permanent Ontario resident",
        "A household income that does not exceed the established threshold",
        "A disability that impedes mobility and results in substantial restriction in activities of daily living, such as personal care or accessing medical care or community services",
      ],
      note: "Applicants must also meet other criteria set out in the Home and Vehicle Modification Program Guidelines. The program's service coordinator decides whether an applicant is eligible and approves expenditures.",
    },
    applyText: "See how to apply",
    applyUrl: "https://www.ontario.ca/page/home-and-vehicle-modification-program",
    source: "https://www.ontario.ca/page/home-and-vehicle-modification-program",
    detail: {
      about:
        "The Home and Vehicle Modification Program provides home or vehicle modifications so that children, adults and seniors with disabilities that restrict mobility can continue living safely in their homes, participate in their communities, and avoid job loss. It is intended to serve individuals and families most in need of assistance. Applicants must first access any other sources of available public or private funding before being considered eligible, and applicants with a household income over $38,000 may be required to contribute toward the cost.",
      aboutList: {
        lead: "The Home and Vehicle Modification Program pays for changes to a home or vehicle for a person whose disability restricts their mobility.",
        items: [
          "Home changes can include ramps, platform and stairway lifts, elevating devices, widening doors, rearranging a bathroom or kitchen for safe use, environmental controls, and a wet room using universal design.",
          "Vehicle, garage and carport changes can include hand or foot controls, lifts, specialized seating, remote garage-door openers, raising a roof or lowering a floor, and barrier-free garage modifications.",
          "Funding can also cover an assessment completed after you apply, professional fees for planning the work, equipment and warranties, installation and labour, and training on how to use the equipment.",
          "You must first access any other available public or private funding.",
          "With a household income over $38,000 you may be required to contribute toward the cost.",
        ],
      },
      steps: [
        "Check that you are a permanent Ontario resident with a disability that restricts mobility and substantially limits your daily activities",
        "Access any other sources of public or private funding available to you first",
        "Visit the March of Dimes website to learn about eligibility and how to apply",
        "The program's service coordinator determines eligibility and approves expenditures, and may assess your home or vehicle if more information is needed",
      ],
      documents: [
        "Information about your household income",
        "Information about your disability and how it restricts your mobility and daily activities",
      ],
      tips: [
        "You must use other available public or private funding before the program will consider you eligible.",
        "A household income over $38,000 may mean you pay part of the cost of the modification.",
        "If a specialized adapted appliance is only sold as a whole item, the program pays the difference between its cost and the market value of a similar non-specialized appliance.",
        "Equipment such as hand controls and lifts should be fully convertible where possible, so it can move to another vehicle later.",
        "Special Services at Home will not repay structural home or vehicle changes that this program covers.",
      ],
    },
  },
  {
    id: "ssah",
    needsPractitioner: true,
    name: "Special Services at Home (SSAH)",
    level: "Ontario",
    category: "Children",
    amount: "Funding for respite and support services (no published amount)",
    summary:
      "Funding for families caring for a child under 18 with a physical and/or developmental disability. It buys respite for caregivers, support for the child's day-to-day activities, and activities that help the child grow and develop.",
    note: "SSAH is a discretionary program. Funding depends on available resources, so meeting the eligibility rules does not guarantee an amount. It is meant to add to other services a child gets. It will not repay anything already funded by another government program. This includes devices paid for by the Assistive Devices Program and home or vehicle changes covered by the Home and Vehicle Modification Program.",
    requires: ["on", "child", "ssahDocumentation"],
    eligibility: {
      mode: "all",
      items: [
        "The child needs extra support, beyond what is expected for their age, because of a physical and/or developmental disability, so they can take part in daily activities at home and in the community",
        "The child is under 18 years old",
        "The child is a resident of Ontario and legally entitled to live in Canada",
        "The child lives at home with their main caregiver, or lives separately without support from other government-funded out-of-home (residential) services",
      ],
      note: "\"Legally entitled to live in Canada\" includes a citizen, a permanent resident, a holder of a Canadian Temporary Resident Permit, or a refugee entitled to live in Canada. Visitors are not eligible. Only one person with decision-making responsibility for the child can apply.",
    },
    applyText: "See how to apply for SSAH",
    applyUrl: "https://www.ontario.ca/page/special-services-home",
    source: "https://www.ontario.ca/page/special-services-home",
    detail: {
      about:
        "Special Services at Home (SSAH) helps families taking care of a child with a developmental and/or physical disability. It provides funding to buy services and supports that help parents care for their child, or that help the child join activities at home and in the community. SSAH is meant to complement other services the child is already receiving, including clinical services. It is a discretionary program, so funding is provided according to available resources.",
      aboutList: {
        lead: "Special Services at Home (SSAH) funds services and supports for a family caring for a child with a physical and/or developmental disability.",
        items: [
          "Support for the child to take part in day-to-day activities — help with daily routines and self-care, sensory items, tutoring, and support that keeps the child safe.",
          "Support for the child's growth and development — building a skill, joining family and social activities, fitness, and planning for the future.",
          "Respite for main caregivers — a respite worker, camp fees, overnight or daytime respite, before and after school care, care on PA days and during March and summer breaks, household help while you care for your child, and training to support your child.",
          "It complements other services rather than replacing them, and it is discretionary — funding depends on available resources.",
        ],
      },
      steps: [
        "Gather documentation of your child's functional limitations from a regulated health professional",
        "Gather proof of the child's Ontario residency, proof they are legally entitled to live in Canada, and a document confirming their date of birth",
        "Complete the SSAH application form — only one person with decision-making responsibility for the child applies",
        "Send the application to your local Ministry regional office",
        "If approved, choose whether to manage the funding yourself or have an agency manage it for you, then submit your expenses to be reimbursed",
      ],
      documents: [
        "Documentation from a regulated health professional of the child's functional limitations resulting from a physical or developmental disability",
        "Proof of the child's residency in Ontario, such as a school registration document, your valid Ontario driver's licence, or a utility bill",
        "Proof the child is legally entitled to live in Canada, such as a Canadian passport or birth certificate, Certificate of Indian Status, Permanent Resident card, immigration documents, or a Canadian Temporary Resident Permit",
        "Proof of the child's age, such as a birth or baptismal certificate, Ontario health card, or passport",
      ],
      tips: [
        "A regulated health professional records the functional limitations. This can be a physician, psychologist, psychological associate, nurse practitioner, registered nurse or registered practical nurse, ophthalmologist, optometrist, audiologist, physiotherapist, occupational therapist, psychotherapist, social worker, speech language pathologist, or behaviour analyst.",
        "You can hire someone yourself, work through an agency, or pay a family member over 18 who is not the main caregiver, parent, step-parent or spouse. A parent, step-parent or spouse can never be paid.",
        "SSAH will not repay things another government program already funds. This includes devices paid for by the Assistive Devices Program and home or vehicle changes covered by the Home and Vehicle Modification Program.",
        "It also does not cover basic living expenses, transportation, dental care, private school tuition, or hands-on therapy and assessments. These include ABA, speech-language therapy, occupational or physical therapy, and psychotherapy.",
        "You have one year from your funding end date to submit expenses. Funding received between April 1, 2025 and March 31, 2026 must be claimed by March 31, 2027.",
        "For an infant without a definitive diagnosis, the regulated health professional gives a written statement. It describes the probability or presence of delay, and the risk of further delay that will cause ongoing functional limitations. Eligibility is then decided again at about age 6.",
      ],
    },
  },
  {
    id: "acsd",
    name: "Assistance for Children with Severe Disabilities (ACSD)",
    level: "Ontario",
    category: "Children",
    amount: "$25 to $678 a month",
    summary:
      "A monthly payment to help families with the extra costs of caring for a child under 18 who has a severe disability. This includes travel to appointments, special shoes and clothes, and parental relief such as respite. Children with severe disabilities may also get drug, dental and vision coverage.",
    note: "The federal Canada Disability Benefit is exempt as income for ACSD. It will not affect your eligibility or your payment. The maximum monthly payment is tied to inflation and adjusted each July. It rose 1.9% on July 1, 2026.",
    requires: ["on", "child", "acsdSeverity", "acsdIncome"],
    eligibility: {
      mode: "all",
      items: [
        "You are the parent or guardian of a child under 18 (17 and under) who has a severe disability",
        "The child lives at home",
        "Your total household income is $77,640 or less",
      ],
      note: "Your eligibility and the amount you receive also depend on the size of your family, the severity of your child's disability, and the extraordinary costs related to that disability.",
    },
    applyText: "Apply for ACSD",
    applyUrl: "https://www.ontario.ca/page/assistance-children-severe-disabilities-program",
    source: "https://www.ontario.ca/page/assistance-children-severe-disabilities-program",
    detail: {
      about:
        "The Assistance for Children with Severe Disabilities program (ACSD) gives parents and guardians financial support toward the extra costs of caring for a child with a severe disability. Eligible families receive between $25 and $678 a month, depending on household income, family size, and the child's disability-related costs. Alongside the monthly payment, children with severe disabilities may also receive coverage for an assistive-device assessment and/or the consumer contribution for a device under the Assistive Devices Program, prescription drugs, dental care, hearing aids and vision care.",
      aboutList: {
        lead: "ACSD gives parents and guardians money toward the extra costs of caring for a child with a severe disability.",
        items: [
          "Between $25 and $678 a month, depending on your household income, the size of your family, and your child's disability-related costs.",
          "Helps with travel to doctors' appointments, hospitals and other appointments related to the child's disability, special shoes and clothes, and parental relief such as respite.",
          "Children with severe disabilities may also receive coverage for an assessment for an assistive device and/or the consumer contribution for a device provided under the Assistive Devices Program, plus batteries and repairs for mobility devices.",
          "They may also receive coverage for prescription drugs through OHIP+, dental care through Healthy Smiles Ontario, and hearing aids and vision care including eyeglasses.",
          "The maximum is tied to inflation and adjusted each July; it rose 1.9% on July 1, 2026.",
        ],
      },
      steps: [
        "Check that your child is under 18, lives at home, has a severe disability, and that your household income is $77,640 or less",
        "Apply online — you can save, edit and submit later, but you have 90 days before the application expires",
        "Or download the paper application and send it to your local ministry regional office",
        "Submit one application per child; duplicate applications for the same child delay processing",
        "A special agreements officer reviews your application and may contact you for more information, then you receive a decision letter",
      ],
      documents: [
        "Information about your total household income",
        "Information about your child's disability and the extraordinary costs related to it",
      ],
      tips: [
        "Children with severe disabilities may also get coverage for batteries and repairs for mobility devices. The Assistive Devices Program itself does not fund these.",
        "If you have more than one child with a severe disability, submit a separate application for each.",
        "You have 90 days to finish and submit an online application. After that, you have to start a new one.",
        "If you need help with the application, a community agency, health care professional, social worker, family member or friend can help you complete it.",
        "If you disagree with the decision, you can ask for an internal review within 30 days of getting the decision letter.",
      ],
    },
  },
  {
    id: "on-adp",
    needsPractitioner: true,
    name: "Assistive Devices Program (Ontario)",
    level: "Ontario",
    category: "Equipment",
    amount: "Up to 75% of the approved amount (may be the full amount if you receive ODSP, Ontario Works or ACSD)",
    summary:
      "Helps pay for customized equipment and specialized supplies for a long-term physical disability. This includes wheelchairs and other mobility aids, hearing aids, visual aids, prosthetics, respiratory and ventilator equipment, and diabetic and ostomy supplies. Your income is not considered.",
    note: "ADP does not pay for repairs. Care and maintenance are yours to pay for. It also does not cover many common items. These include bath and shower aids, grab-bars, stair or chair lifts, hospital beds, incontinence supplies, home renovations such as ramps, and batteries, even for equipment first bought through ADP.",
    requires: ["on", "equipmentNeed", "adpClinical"],
    eligibility: {
      mode: "all",
      items: [
        "Generally, an Ontario resident with a valid Ontario health card",
        "Generally, a physical disability requiring the equipment or supplies for 6 months or longer",
        "Generally, meet the clinical criteria specific to the device you are applying for",
        "Not already qualifying for, or receiving, financial support for the same equipment or supplies from the Workplace Safety and Insurance Board. Group \"A\" veterans are also excluded if they already qualify for, or receive, support from Veterans Affairs Canada",
      ],
      note: "Your income is not considered.",
    },
    applyText: "See how to apply by device type",
    applyUrl: "https://www.ontario.ca/page/assistive-devices-program",
    source: "https://www.ontario.ca/page/assistive-devices-program",
    detail: {
      about:
        "The Assistive Devices Program (ADP) helps people with long-term physical disabilities pay for customized equipment, like wheelchairs and hearing aids, and for specialized supplies such as those used with ostomies. Income is not considered. How much you get depends on the device: ADP may pay 75% of an approved fixed price, up to 75% of an approved maximum contribution, or a set grant amount paid directly to you. If you receive Ontario Works, ODSP or Assistance for Children with Severe Disabilities, ADP may cover the full approved price, the full maximum contribution, or the full grant amount.",
      aboutList: {
        lead: "The Assistive Devices Program (ADP) helps pay for customized equipment and specialized supplies for a long-term physical disability.",
        items: [
          "Covers things like mobility aids, hearing aids, visual aids, prosthetics, respiratory and ventilator equipment, home oxygen therapy, communication aids, and diabetic, ostomy and enteral-feeding supplies.",
          "Your income is not considered.",
          "ADP may pay 75% of an approved fixed price, up to 75% of an approved maximum contribution, or a grant paid directly to you.",
          "If you receive Ontario Works, ODSP or Assistance for Children with Severe Disabilities, ADP may cover the full amount.",
          "Repairs are not covered, and many common items are excluded.",
        ],
      },
      steps: [
        "Check that the equipment or supplies you need are a category ADP funds",
        "See a registered authorizer for your device type, who assesses you and confirms you meet the clinical criteria for it",
        "Buy the device from an ADP-registered vendor, who usually bills ADP for its share directly. For a grant, ADP pays you directly and you can buy from any business you choose",
        "Pay your share of the cost, plus any optional accessories or services you choose",
      ],
      documents: [
        "A valid Ontario health card",
        "The application form for your device type, completed by a registered authorizer",
      ],
      tips: [
        "Income is not part of the test. ADP does not look at what you earn.",
        "Generally, you must need the equipment for 6 months or longer.",
        "ADP does not cover repairs, and you are responsible for care and maintenance.",
        "If you cannot afford your share, Easter Seals Ontario, The War Amps and Lions Clubs may be able to help.",
        "Replacement may be funded if your condition changes, or if the equipment is out of warranty and cannot be repaired at a reasonable cost.",
      ],
      phone: "1-800-268-6021 (TTY 1-800-387-5559)",
    },
  },
  {
    id: "ontario-autism-program",
    name: "Ontario Autism Program",
    level: "Ontario",
    category: "Children",
    amount: "Needs-based services and supports",
    summary:
      "Services and supports for children and youth on the autism spectrum in Ontario, until they turn 18. They include foundational family services, caregiver-mediated early years programs, core clinical services, an entry to school program, and urgent response services.",
    note: "Register once through AccessOAP, the program's independent intake organization. You do not need to register again if you already registered with the Ontario Autism Program. You also do not need to if you already sent a registration form and supporting documents to the Ministry of Children, Community and Social Services.",
    requires: ["on", "child", "autismSelected", "oapDiagnosis"],
    eligibility: {
      mode: "all",
      items: [
        "The child is under 18 years old",
        "The child currently lives in Ontario",
        "The child has a written diagnosis of autism from a qualified professional",
      ],
      note: "The written diagnosis must include the child's full name and date of birth, the date of the assessment, a statement that the child meets the diagnostic criteria for autism spectrum disorder, and the qualified professional's name and credentials.",
    },
    applyText: "Register through AccessOAP",
    applyUrl: "https://www.ontario.ca/page/ontario-autism-program",
    source: "https://www.ontario.ca/page/ontario-autism-program",
    detail: {
      about:
        "The Ontario Autism Program (OAP) supports families of children and youth on the autism spectrum. Children receive services and supports until they turn 18. Registration goes through AccessOAP, the program's independent intake organization, whose care coordinators answer questions, explain your service options, and help you find needs-based services in your community.",
      aboutList: {
        lead: "The Ontario Autism Program (OAP) supports families of children and youth on the autism spectrum.",
        items: [
          "Children receive services and supports until they turn 18.",
          "Foundational family services are available to everyone registered.",
          "Caregiver-mediated early years programs are for children between 12 and 48 months.",
          "There are also core clinical services, an entry to school program for children starting kindergarten or Grade 1, and urgent response services.",
          "AccessOAP care coordinators help you understand your options and find services near you.",
        ],
      },
      steps: [
        "Get a written autism diagnosis from a qualified professional, with the details the program requires",
        "Create an AccessOAP account",
        "Register your child through AccessOAP and provide all the supporting documentation they ask for",
        "Work with an AccessOAP care coordinator to understand your service options",
      ],
      documents: [
        "The written autism diagnosis, showing the child's full name and date of birth, the assessment date, a statement that the child meets the diagnostic criteria for autism spectrum disorder, and the professional's name and credentials",
      ],
      tips: [
        "Register once. You do not need to register again if you already registered with the OAP or already sent a registration form and supporting documents to the ministry.",
        "If you registered before April 2021, ask about interim one-time funding and childhood budgets.",
        "Behaviour plans are no longer part of the program. Other services have replaced them.",
        "Your child may also qualify for Special Services at Home or the Assistance for Children with Severe Disabilities program.",
      ],
      phone: "1-833-425-2445",
    },
  },
  {
    id: "odsp",
    needsPractitioner: true,
    name: "Ontario Disability Support Program (ODSP) — income support",
    level: "Ontario",
    category: "Income support",
    amount: "Up to $1,436/mo for a single person",
    summary:
      "Monthly income support for Ontario adults with a disability who are in financial need. It gives money toward basic needs and shelter, plus health benefits including prescription drugs and vision care. The amount depends on your family size, shelter costs and other income.",
    note: "If you already get CPP-D or QPP-D, you are in a \"prescribed class\", so you skip the disability determination process. You must still apply and meet all the other rules. The federal Canada Disability Benefit is exempt as income and does not reduce your ODSP payment.",
    requires: ["on", "age18plus", "odspMedical", "odspFinancial"],
    eligibility: {
      mode: "all",
      items: [
        "At least 18 years old (you can start applying up to six months before your 18th birthday)",
        "An Ontario resident",
        "Non-exempt assets at or under $40,000 for a single person, or $50,000 for a couple",
        "In financial need, based on your income, assets, living expenses, family size and shelter costs",
        "Meet the ODSP definition of a person with a disability, or be a member of a prescribed class",
      ],
      note:
        "The ODSP definition of disability: a substantial mental or physical impairment that is continuous or recurrent and is expected to last one year or more, whose direct and cumulative effect substantially restricts your ability to work, care for yourself, or take part in community life — verified by an approved health care professional.",
    },
    applyText: "Apply for ODSP",
    applyUrl: "https://www.ontario.ca/page/ontario-disability-support-program",
    source: "https://www.ontario.ca/page/ontario-disability-support-program",
    detail: {
      about:
        "ODSP is Ontario's disability income support program. It pays monthly money toward basic needs and shelter and comes with health benefits such as prescription drugs and vision care. A single person can receive up to $1,436 a month for basic needs and shelter; you may receive more for a spouse or children, or for benefits such as transportation to medical appointments. Eligibility has two parts: you must be in financial need, and you must meet the program's definition of a person with a disability (decided through the Disability Determination Process) unless you are in a prescribed class.",
      aboutList: {
        lead: "ODSP is Ontario's disability income support program.",
        items: [
          "Pays monthly money toward basic needs and shelter — up to $1,436 a month for a single person.",
          "You may receive more for a spouse or children, or for benefits such as transportation to medical appointments.",
          "Comes with health benefits, including prescription drugs and vision care.",
          "Eligibility has two parts: financial need, and either meeting the program's definition of a person with a disability or being a member of a prescribed class.",
          "Rates are tied to inflation and adjusted each July; they rose 1.9% on July 1, 2026.",
        ],
      },
      steps: [
        "Check the basic rules: 18 or older, an Ontario resident, in financial need, and within the asset limits",
        "Apply online with one application covering you and the immediate family who live with you (about 20 to 30 minutes), by phone at 1-888-999-1142, or in person at your local ODSP office",
        "A caseworker reviews your application and calls within 15 business days to book a verification appointment",
        "Meet the caseworker to verify your information and provide your documents",
        "Complete the Disability Determination Package with your health care professional and return it within 90 days — unless you are in a prescribed class",
      ],
      documents: [
        "Social insurance numbers (SIN) for everyone on the application",
        "OHIP cards and birth certificates",
        "Immigration papers, if they apply to you",
        "Tax returns and banking information",
        "Your housing costs and other expenses, such as child care and disability-related expenses",
      ],
      tips: [
        "If you need money now, one application covers both Ontario Works and ODSP. Ontario Works is assessed first. It can support you while your ODSP application is reviewed.",
        "The application process may take a few months.",
        "Return the completed Disability Determination Package to the Disability Adjudication Unit within 90 days. If you do not, the application is treated as withdrawn, unless you make a written request for an extension and it is approved.",
        "If you get CPP-D or QPP-D, you are in a prescribed class and skip the disability adjudication step.",
        "The Canada Disability Benefit does not count as income for ODSP.",
        "The Disability Adjudication Unit sends you a letter within 90 business days. It tells you whether your disability qualified.",
        "If no extra information is needed, your caseworker tells you within 15 business days whether you are financially eligible. If you are found not financially eligible, you have 30 days to ask ODSP to review your information again.",
        "If you left ODSP and need to come back for financial help, you may be eligible for rapid reinstatement. It can make it faster and easier to start getting ODSP again, without a disability assessment. Contact your local ODSP office to find out if you are eligible.",
        "Income support is paid monthly, on the last business day of each month. December payments may be available earlier in the month.",
        "If you are interested in working, ask ODSP staff about employment-related supports in your community. Employment Ontario also offers training, skills and experience help.",
      ],
      phone: "1-888-999-1142 (TTY 1-800-387-5559)",
    },
  },
  {
    id: "on-parking-permit",
    needsPractitioner: true,
    name: "Accessible Parking Permit (Ontario)",
    level: "Ontario",
    category: "Parking",
    amount: "Free",
    summary:
      "A free permit to park in designated accessible spaces. It is issued to a person, not a vehicle. You can only use it when the permit holder is driving or riding in the vehicle. A regulated health professional certifies your condition on the application.",
    note: "The permit belongs to the person, not the car. You can only use it when the permit holder is in the vehicle. Misuse can bring a fine of up to $5,000. Each municipality sets its own parking privileges through local bylaws, so follow the rules where you park.",
    requires: ["on", "mobility"],
    eligibility: {
      mode: "any",
      items: [
        "Cannot walk without the help of a brace, cane, crutch, lower-limb prosthetic, wheelchair, or another person",
        "Lung disease severe enough that forced expiratory volume is under one litre in one second",
        "Portable oxygen is a medical necessity",
        "Cardiovascular disease at Class III or Class IV functional capacity",
        "Severely limited in the ability to walk by an arthritic, neurological, musculoskeletal, or orthopaedic condition",
        "Visual acuity of 20/200 or poorer in the better eye with corrective lenses, or a maximum field of vision using both eyes with a diameter of 20 degrees or less",
        "Mobility is severely limited by one or more conditions or functional impairments",
      ],
      note:
        "A regulated health professional must certify one of these on your application: a physician, nurse practitioner (Extended Class), physiotherapist, occupational therapist, chiropractor, or podiatrist (chiropodist).",
    },
    applyText: "Apply through ServiceOntario",
    applyUrl: "https://www.ontario.ca/page/get-accessible-parking-permit",
    source: "https://www.ontario.ca/page/get-accessible-parking-permit",
    detail: {
      about:
        "The Ontario Accessible Parking Permit (APP) lets you park in designated accessible spaces. It is issued to a person, not a vehicle, so the named holder must be the driver or a passenger. There is no cost to get, renew, or replace it. Each municipality sets its own parking privileges through local bylaws, so always follow the rules where you park.",
      aboutList: {
        lead: "The Ontario Accessible Parking Permit (APP) lets you park in designated accessible spaces.",
        items: [
          "It is issued to a person, not a vehicle, so it can only be used when the permit holder is driving or riding in the vehicle.",
          "There is no cost to get, renew, or replace it.",
          "Each municipality sets its own parking privileges through local bylaws, so always follow the rules where you park.",
          "Using the permit when the holder is not present can bring a fine of up to $5,000 and loss of the permit.",
        ],
      },
      steps: [
        "Check the eligible conditions to see whether you may qualify",
        "Get the application form at any ServiceOntario centre or download it from ontario.ca",
        "Complete the applicant section and have a regulated health professional certify your condition",
        "Submit online with a ServiceOntario Account, by mail, or in person at a ServiceOntario centre",
        "Display the permit with its number and expiry date visible on the dashboard or sun visor when parked",
      ],
      documents: [
        "A completed application with both the applicant section and the health-professional certification section",
        "Acceptable identification",
      ],
      tips: [
        "There is no fee to get, renew, or replace the permit.",
        "A permanent permit is valid for 5 years and renews without needing to be re-certified. Temporary and subject-to-change permits need re-certification to renew.",
        "Municipalities set their own privileges (for example free or extended metered parking), so check your city's bylaws.",
        "Travelling outside Ontario? If you hold a valid permit, you can get a traveller's permit. It lets you park the car you leave behind (for example at an Ontario airport or train station) while you take your regular permit on the trip.",
      ],
    },
  },
  /* ---------------------------------------------------------------- FEDERAL */
  {
    id: "dtc",
    needsPractitioner: true,
    name: "Disability Tax Credit (DTC)",
    level: "Federal",
    category: "Money & taxes",
    amount: "Non-refundable tax credit — actual tax reduction varies",
    summary:
      "A non-refundable tax credit that may lower income tax for an approved person or an eligible supporting family member. You also need approval for several related federal programs.",
    requires: ["prolonged", "certifier"],
    note:
      "Approval is based on the effects of an impairment, not the name of the diagnosis. A medical doctor or nurse practitioner can certify all impairments. Other practitioners can certify only specific functional categories on Form T2201.",
    applyText: "Start the DTC application (T2201)",
    applyUrl:
      "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2201.html",
    source:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit.html",
    detail: {
      about:
        "A non-refundable federal tax credit that may reduce income tax payable. A medical practitioner must certify that you have a severe and prolonged impairment and meet one of three routes. For the marked-restriction route, you must be unable to do an activity, or take three times longer than someone of similar age without the impairment, even with appropriate therapy, medication and devices. The restriction must affect walking, mental functions, dressing, feeding, eliminating (bowel or bladder functions), hearing, speaking or vision; be present all or almost all of the time (generally at least 90%); and have lasted or be expected to last for a continuous period of at least 12 months. For the cumulative-effect route, significant limitations in two or more of those categories must exist together all or almost all of the time (generally at least 90%). Their combined effect must be equivalent to being unable, or taking three times longer than someone of similar age without the impairment, to do an activity in one category, and must be present all or substantially all of the time (generally interpreted as 90% or more), even with appropriate therapy, devices and medication. Life-sustaining therapy is excluded from the cumulative-effect route; receiving therapy to support a vital function is a separate third route. For this route, the therapy must be needed at least 2 times per week for an average of at least 14 hours per week, taking time away from everyday activities, and the impairment must have lasted or be expected to last for a continuous period of at least 12 months. DTC approval is a prerequisite for several related federal programs, but not for every disability benefit.",
      aboutList: { lead: "A non-refundable federal tax credit that may reduce income tax payable. A medical practitioner must certify that you have a severe and prolonged impairment and meet one of three routes.", items: ["For the marked-restriction route, you must be unable to do an activity, or take three times longer than someone of similar age without the impairment, even with appropriate therapy, medication and devices. The restriction must affect walking, mental functions, dressing, feeding, eliminating (bowel or bladder functions), hearing, speaking or vision; be present all or almost all of the time (generally at least 90%); and have lasted or be expected to last for a continuous period of at least 12 months.", "For the cumulative-effect route, significant limitations in two or more of those categories must exist together all or almost all of the time (generally at least 90%). Their combined effect must be equivalent to being unable, or taking three times longer than someone of similar age without the impairment, to do an activity in one category, and must be present all or substantially all of the time (generally interpreted as 90% or more), even with appropriate therapy, devices and medication. Life-sustaining therapy is excluded from the cumulative-effect route; receiving therapy to support a vital function is a separate third route.", "For the life-sustaining therapy route, the therapy must be needed at least 2 times per week for an average of at least 14 hours per week, taking time away from everyday activities, and the impairment must have lasted or be expected to last for a continuous period of at least 12 months.", "DTC approval is a prerequisite for several related federal programs, but not for every disability benefit."] },
      steps: [
        "Use the digital DTC application form, or print Form T2201 to fill out by hand and send by mail.",
        "Fill Part A (your personal information).",
        "Ask a medical practitioner who knows you to complete Part B, describing how your condition limits your daily life.",
        "Send it to the CRA using the digital DTC application form or by mail. The CRA says you may not send DTC forms through the “submit documents” section of your CRA account.",
        "If the CRA approves years you already filed, request the applicable tax-return adjustments. Past claims may go back up to 10 years, but any refund depends on the tax situation for each year.",
      ],
      documents: [
        "Your Social Insurance Number (SIN)",
        "Real examples of how it limits you (focus, memory, walking, self-care, etc.)",
      ],
      tips: [
        "The medical practitioner's section decides most approvals. Ask them to be specific and give concrete examples of your limitations.",
        "You do not need to pay a private company a percentage of your refund. Applying directly is free.",
        "Denied? Read the decision letter, ask what information was missing, and use the CRA review or objection process that applies to your case.",
        "List the everyday activities affected, and whether they fall under walking, mental functions, dressing, feeding, eliminating, hearing, speaking or vision.",
        "Discuss whether the difficulty continues even with appropriate therapy, medication and devices.",
        "Compare how long affected tasks take with someone of similar age without the impairment.",
        "Describe whether the restriction is there all or almost all of the time, and how long it has lasted or is expected to last.",
        "If no single category is markedly restricted, ask whether two or more limitations together have an equivalent effect.",
        "Ask how many times per week you need the therapy and how many hours it takes. Include setup, monitoring and dosage work.",
        "Ask which activities count toward the 14 hours. Travel does not count, and recovery counts only when medically required.",
        "The CRA says people with Type 1 diabetes meet the life-sustaining-therapy criteria. Practitioners no longer need to give therapy details for 2021 and later years. But a practitioner must still certify the application.",
        "These questions do not decide eligibility. Only the certifying practitioner and the CRA do.",
        "A medical practitioner familiar with your condition",
      ],
      time: "Processing time varies; check the CRA processing-times tool for a current estimate.",
      phone: "CRA: 1-800-959-8281",
    },
  },
  {
    id: "cdb-adult",
    name: "Canada Disability Benefit",
    level: "Federal",
    category: "Money",
    amount: "Up to $204.20 / month for July 2026–June 2027",
    summary:
      "A monthly payment for working-age adults with a disability and lower income.",
    requires: ["dtc", "workingAge", "cdbTaxFiling", "cdbStatus"],
    note:
      "The amount is reassessed each year from adjusted family net income. July 2026–June 2027 payments use the 2025 federal tax return. You must be approved for the DTC first.",
    applyText: "Learn how to apply",
    applyUrl:
      "https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit.html",
    source:
      "https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit.html",
    detail: {
      about:
        "A federal income top-up (started July 2025) for low-income adults aged 18–64 who are approved for the Disability Tax Credit.",
      aboutList: {
        lead: "A federal income top-up (started July 2025) for low-income adults aged 18–64 who are approved for the Disability Tax Credit.",
        items: [
          "Benefit amounts are based on your adjusted family net income.",
          "The benefit amount will start to decrease after your adjusted family net income reaches a certain threshold. <a href=\"https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit/amount.html\">Estimate your benefit amount</a>.",
          "If your adjusted family net income is considerably above that threshold, your benefit amount will be $0.",
        ],
      },
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
        "File your taxes every year, even with no income. Payments are calculated from your return.",
        "For July 2026 to June 2027, up to $10,210 of working income is exempt for a single person. For a couple, up to $14,294 of combined working income is exempt.",
        "Starting in September 2026, eligible recipients may get a separate fixed $150 lump sum toward the cost of getting the DTC. You do not apply for it separately. It is not included in the monthly maximum shown here.",
        "In Alberta: if you get AISH or ADAP, report the CDB and/or DTC application outcome to Alberta, including the approved CDB amount or a denial. Alberta says that if no CDB decision had been made by February 28, 2026, $200 was reduced from April 2026 AISH or ADAP benefits.",
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
    requires: ["dtc", "child", "ccbEligibility"],
    note:
      "Once your child is approved for the DTC and you already get the Canada Child Benefit, this is added automatically. There is no separate form.",
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
      ],
      tips: [
        "No separate application. The hard part is getting your child's DTC approved.",
        "The amount goes down gradually for family income over about $82,847.",
        "You must be the person receiving the CCB",
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
    amount: "Up to $3,500 grant + $1,000 bond per year (repayment rules apply)",
    summary:
      "A savings account where the government may add matching grants (up to 300%) and bonds, depending on your family income and how much is contributed — you don't even need to contribute to get the bond if your income is low.",
    requires: ["dtc", "under60", "rdspOpening", "rdspContributionWindow"],
    note:
      "Open one at most banks or credit unions after you're approved for the DTC.",
    applyText: "How to open an RDSP",
    applyUrl:
      "https://www.canada.ca/en/employment-social-development/programs/disability/savings.html",
    source:
      "https://www.canada.ca/en/employment-social-development/programs/disability/savings.html",
    detail: {
      about:
        "A long-term savings account for people approved for the DTC. The government may pay in grants (matching what you put in) and bonds (for lower incomes), depending on family income and contributions — potentially tens of thousands of dollars over time.",
      aboutList: {
        lead: "A long-term savings account for people approved for the DTC. The government may pay in grants (matching what you put in) and bonds (for lower incomes), depending on family income and contributions — potentially tens of thousands of dollars over time.",
        items: [
          "Grants and bonds follow a different, earlier deadline than contributions.",
          "A beneficiary's RDSP can receive a grant on contributions made until December 31 of the year in which the beneficiary turns 49.",
          "A bond can be paid into an RDSP until the year in which the beneficiary turns 49.",
          "Check which of the two windows applies to you. <a href=\"https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-disability-savings-plan-rdsp/canada-disability-savings-grant-canada-disability-savings-bond.html\">Grant and bond rules</a>.",
        ],
      },
      steps: [
        "Get approved for the DTC first.",
        "Choose a bank or credit union that offers RDSPs.",
        "Open the plan with your SIN and DTC approval.",
        "Contribute if you can — but even $0 contributions still earn the bond if your income is low.",
      ],
      documents: [
        "Your SIN and DTC approval",
      ],
      tips: [
        "The bond (up to $1,000/year) needs no contribution from you.",
        "Grants can match up to 300%. For lower incomes, the first $500 you put in can become $1,500.",
        "Ask the bank specifically for an 'RDSP'. Front-line staff are sometimes not familiar with it.",
        "Be a Canadian resident under age 60",
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
    requires: ["dtc", "working", "cwbEligibility"],
    note:
      "Claimed on your annual tax return once your DTC is on file with the CRA.",
    applyText: "Canada Workers Benefit details",
    applyUrl:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-45300-canada-workers-benefit-cwb.html",
    source:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-45300-canada-workers-benefit-cwb.html",
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
      "Does not require the DTC. You need enough past CPP work contributions and a disability severe enough that it regularly prevents any substantial work.",
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
        "A detailed medical report from your doctor",
        "Details of your work history and why you can't continue",
      ],
      tips: [
        "'Severe and prolonged' is a high bar. Describe your worst days honestly, not your best.",
        "If denied, you can request reconsideration. Don't give up after a first no.",
        "Apply as soon as you stop being able to work. There can be back-pay.",
        "Enough CPP contributions (generally 4 of the last 6 years)",
      ],
      time: "Around 120 days for a decision.",
      phone: "Service Canada: 1-800-277-9914",
    },
  },
  {
    id: "cpp-childrens-benefit",
    name: "CPP Children's Benefit",
    level: "Federal",
    category: "Money (for parents)",
    amount: "$307.81 / month per child in 2026 ($153.91 for a part-time student 18-25)",
    summary:
      "A monthly payment for the dependent child of someone getting a CPP disability benefit. The disability is the parent's, not the child's. The child does not need to have a disability at all. A child can be paid a maximum of two children's benefits.",
    requires: ["cppDisabilityContributorLink"],
    eligibility: {
      mode: "all",
      items: [
        "A parent or guardian is receiving a CPP disability benefit or a post-retirement disability benefit.",
        "The child is under 18, or age 18 to 25 and in full-time or part-time attendance at a recognized school or university.",
        "The child is the natural child of the contributor, a child adopted legally or in fact by the contributor while under the age of 21, or a child legally or in fact living with and under the contributor's decision-making responsibility while under the age of 21.",
      ],
      note: "If the disabled contributor is over the age of 65 and the child stops attending school, the child's eligibility for the disabled contributor's child's benefit ends.",
    },
    note:
      "Apply as soon as you can. The Canada Pension Plan can only make back payments for up to 12 months: 11 months plus the month you apply. You do not have to wait for the parent's CPP disability benefit to be approved before you apply for the child's benefit.",
    requiresNote:
      "A parent or guardian must be receiving a CPP disability benefit or a post-retirement disability benefit. The child must be under 18, or age 18 to 25 and in full-time or part-time attendance at a recognized school or university. The child must also be the natural child of the contributor, a child adopted legally or in fact by the contributor while under the age of 21, or a child legally or in fact living with and under the contributor's decision-making responsibility while under the age of 21. If the disabled contributor is over the age of 65 and the child stops attending school, the child's eligibility for the disabled contributor's child's benefit ends.",
    applyUrl:
      "https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-childrens-benefit.html",
    source:
      "https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-childrens-benefit.html",
    detail: {
      about:
        "The CPP children's benefit is a monthly payment to the dependent child of a disabled or deceased CPP contributor. The disabled contributor's child's benefit is for a child of someone receiving a CPP disability benefit or a post-retirement disability benefit. The amount is a flat rate that is adjusted annually: for benefits beginning in January 2026 it is $307.81 a month for a child under 18 and for a full-time student aged 18 to 25, and $153.91 a month for a part-time student aged 18 to 25. A child can be paid a maximum of two children's benefits. For a child under 18 the benefit is paid on behalf of the child to the disabled contributor when the child lives with them and they have decision-making responsibility. Otherwise the person or agency with decision-making responsibility may receive it. Students aged 18 to 25 apply for and are paid the benefit themselves.",
      aboutList: { lead: "The CPP children's benefit is a monthly payment to the dependent child of a disabled or deceased CPP contributor.", items: ["The disabled contributor's child's benefit is for a child of someone receiving a CPP disability benefit or a post-retirement disability benefit.", "The amount is a flat rate that is adjusted annually: for benefits beginning in January 2026 it is $307.81 a month for a child under 18 and for a full-time student aged 18 to 25, and $153.91 a month for a part-time student aged 18 to 25.", "A child can be paid a maximum of two children's benefits.", "For a child under 18 the benefit is paid on behalf of the child to the disabled contributor when the child lives with them and they have decision-making responsibility. Otherwise the person or agency with decision-making responsibility may receive it.", "Students aged 18 to 25 apply for and are paid the benefit themselves."] },
      steps: [
        "Apply as soon as the parent or guardian applies for a CPP disability benefit — you do not have to wait for that benefit to be approved",
        "For a child under 18, sign in to My Service Canada Account and select \"Apply for Canada Pension Plan disability benefits\" to complete the online application, or apply by mail",
        "For a student aged 18 to 25, complete the Canada Pension Plan Child's Benefit Application and Declaration for a student over 18 years of age in Attendance at School or University, form ISP1402",
        "Include proof of enrolment with the ISP1402, or have an authorized representative from the school complete Section E of the form, then mail the forms",
        "Submit the ISP1402 again at the beginning of every school year, and again if the student returns to school after a break from studies",
      ],
      documents: [
        "Form ISP1402, for a student aged 18 to 25",
        "Proof of enrolment for a student aged 18 to 25: an official document from the online student portal, an electronic attestation from a school official, or Section E of the ISP1402 completed by an authorized representative of the school",
        "Photocopies are accepted where proof is required, but Service Canada may request an original or certified copy at any time",
      ],
      tips: [
        "The child does not need to have a disability. This benefit is paid because of the parent's disability. This is easy to miss when you look for children's supports.",
        "A student aged 18 to 25, full-time or part-time, can apply and renew online through My Service Canada Account (upload proof of enrolment or the signed ISP1402). They can also apply by mail with the paper ISP1402.",
        "The benefit is paid during normal school vacation periods. It stops if the school attendance form is not sent in when the student returns to school.",
        "A part-time student gets half the flat rate: $153.91 a month in 2026 rather than $307.81.",
      ],
      time:
        "The program page does not publish a processing time. Back payments reach up to 12 months, 11 months plus the month you apply.",
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
    requires: ["student", "notBcStudentAidDuplicate", "csgNeedAndProgram"],
    note:
      "You apply through Alberta Student Aid. One application covers this grant and the Alberta grant.",
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
        "One Alberta Student Aid application covers the federal grants and the Alberta grant. You do not apply separately.",
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
    amount: "Up to $20,000 per school year (August 1 to July 31)",
    eligibility: {
      mode: "all",
      items: [
        "You have a financial need",
        "You are a student in a qualified program at a designated school",
        "You have a disability recognized by the Canada Student Financial Assistance Program",
        "You provide disability documents, written confirmation of need from a qualified person, and a document confirming related costs",
      ],
    },
    summary:
      "Helps pay for education-related services or equipment you need for your studies, if you qualify.",
    requires: ["student", "notBcStudentAidDuplicate", "csgNeedAndProgram", "csgServicesEquipment"],
    note:
      "Can help with services and equipment you need for your studies. What is approved depends on your needs and your application.",
    applyText: "Apply through your province's or territory's student aid",
    applyUrl: "https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans/disabilities-service-equipment.html",
    source:
      "https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans/disabilities-service-equipment.html",
    detail: {
      about:
        "You could receive up to $20,000 per school year (August 1 to July 31) for education-related services or equipment, if you meet all the eligibility and documentation requirements.",
      steps: [
        "Apply for student aid with your province or territory. You can apply for this grant at the same time.",
        "Send documents showing that you have a disability.",
        "Send written confirmation from a qualified person that you need education-related services or equipment, and a document confirming the related cost.",
      ],
      documents: [
        "Documents showing that you have a disability",
        "Written confirmation of need from a qualified person: a rehabilitation caseworker, an official from a centre for students with disabilities, a guidance counselor, or a financial aid administrator from your school",
        "A document confirming the related cost of equipment and services — required as well as the written confirmation of need",
      ],
      tips: [
        "Apply through your province's or territory's student aid.",
      ],
      time: "You can apply at the same time as you apply for student aid with your province or territory.",
    },
  },
  {
    id: "home-accessibility-tax-credit",
    name: "Home Accessibility Tax Credit (HATC)",
    level: "Federal",
    category: "Tax",
    amount: "Up to $20,000 per year in eligible expenses, claimed as a non-refundable tax credit",
    summary:
      "A non-refundable federal credit for home accessibility renovations. The person must be eligible for the Disability Tax Credit at any time in the year, or be 65 or older at year end. Certain family members may claim it for them.",
    requires: ["hatcQualifyingPerson", "hatcEligibleDwelling", "hatcQualifyingRenovationSpend"],
    eligibility: {
      mode: "all",
      items: [
        "The person the renovation is for is a qualifying individual — either eligible for the Disability Tax Credit at any time in the year, or 65 years of age or older at the end of the year.",
        "The renovation is of an enduring nature and integral to the dwelling, and either lets the person get into, move around or function within the home, or reduces their risk of harm.",
      ],
      note: "A spouse, common-law partner or certain other relatives may claim instead as an eligible individual.",
    },
    note:
      "You claim this on your tax return at line 31285. You do not apply in advance. It is non-refundable, so it lowers the tax you owe. It does not pay you money on its own.",
    requiresNote:
      "The person the renovation is for must be a qualifying individual — either eligible for the Disability Tax Credit at any time in the year, or 65 years of age or older at the end of the year. A spouse, common-law partner or certain other relatives may claim instead as an eligible individual. The renovation must be of an enduring nature and integral to the dwelling, and must either let the person get into, move around or function within the home, or reduce their risk of harm.",
    applyText: "Read the CRA guidance for line 31285",
    applyUrl:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-31285-home-accessibility-expenses.html",
    source:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-31285-home-accessibility-expenses.html",
    detail: {
      about:
        "The Home Accessibility Tax Credit is claimed at line 31285 of your federal return. A qualifying individual can claim up to $20,000 per year in eligible expenses. Where more than one qualifying individual lives in the same dwelling, the total for that dwelling is still $20,000, and where several people are entitled to claim, they can split it. The annual limit was $20,000 for 2022 through 2024, and $10,000 from 2015 through 2021. CRA states that an expense which also qualifies as a medical expense can be claimed both as a medical expense and as a home accessibility expense.",
      aboutList: { lead: "The Home Accessibility Tax Credit is claimed at line 31285 of your federal return.", items: ["A qualifying individual can claim up to $20,000 per year in eligible expenses.", "Where more than one qualifying individual lives in the same dwelling, the total for that dwelling is still $20,000, and where several people are entitled to claim, they can split it.", "The annual limit was $20,000 for 2022 through 2024, and $10,000 from 2015 through 2021.", "CRA states that an expense which also qualifies as a medical expense can be claimed both as a medical expense and as a home accessibility expense."] },
      steps: [
        "Keep every invoice and receipt, showing the vendor, their business address, their GST/HST number where applicable, a description of the work and the address, the amount, and proof of payment",
        "Complete the chart for line 31285 on the Federal Worksheet",
        "Enter the result on line 31285 of your federal return, and keep the documents rather than sending them",
      ],
      documents: [
        "Agreements, invoices and receipts identifying the vendor, the work, the address and the amount",
        "Proof of payment",
        "For a condominium or co-operative, a signed statement from the corporation setting out the amounts and your share",
      ],
      tips: [
        "You do not apply in advance, you claim it when you file",
        "It is non-refundable, so it lowers the tax you owe and does not pay you on its own",
        "These costs are not eligible: costs that mainly raise the value of the home, routine repairs, appliances and financing costs",
        "An item you buy that does not become a permanent part of the home is generally not eligible",
      ],
    },
  },
  {
    id: "multigenerational-home-renovation-tax-credit",
    eligibility: { mode: "all", items: ["The renovation must create a self-contained secondary unit.", "One of the people living in the existing home or in the new unit must be a qualifying individual: either 65 years of age or older at the end of the renovation period tax year, or 18 to 64 and eligible for the Disability Tax Credit at any time in that year.", "Only one renovation can be claimed for a qualifying individual during their lifetime.", "The person claiming must be an eligible individual: a resident of Canada from January 1 to December 31 of the claim year who either ordinarily resides, or intends to ordinarily reside, in the home within 12 months of the end of the renovation period and is the qualifying individual, their cohabiting spouse or common-law partner, or a qualifying relation of theirs; or who owns the home and is a qualifying relation of the qualifying individual.", "The home must be in Canada, owned by the qualifying individual or a qualifying relation during the renovation period tax year, and lived in by both the qualifying individual and a qualifying relation within 12 months after the renovation period ends."] },
    name: "Multigenerational Home Renovation Tax Credit (MHRTC)",
    level: "Federal",
    category: "Tax",
    amount: "14.5% of up to $50,000 in eligible expenses, to a maximum of $7,250 (2025 tax year)",
    summary:
      "A refundable federal credit for building a self-contained secondary unit in a home. It lets a senior, or an adult eligible for the Disability Tax Credit, live with a relative. It is worth 14.5% of up to $50,000 of eligible costs, to a maximum of $7,250 for the 2025 tax year.",
    requires: ["mhrtcQualifyingIndividual", "qualifyingRenovationSpend", "mhrtcSecondaryUnit"],
    note:
      "You can claim this only once in a lifetime for the person the unit is built for. Get it right before the work starts. Note the rate: for the 2025 tax year the credit is 14.5% to a maximum of $7,250. Figures of 15% and $7,500 are widely quoted, but they do not match the CRA's current page.",
    requiresNote:
      "The renovation must create a self-contained secondary unit. One of the people living in the existing home or in the new unit must be a qualifying individual: either 65 years of age or older at the end of the renovation period tax year, or 18 to 64 and eligible for the Disability Tax Credit at any time in that year. Only one renovation can be claimed for a qualifying individual during their lifetime. The person claiming must be an eligible individual: a resident of Canada from January 1 to December 31 of the claim year who either ordinarily resides, or intends to ordinarily reside, in the home within 12 months of the end of the renovation period and is the qualifying individual, their cohabiting spouse or common-law partner, or a qualifying relation of theirs; or who owns the home and is a qualifying relation of the qualifying individual. The home must be in Canada, owned by the qualifying individual or a qualifying relation during the renovation period tax year, and lived in by both the qualifying individual and a qualifying relation within 12 months after the renovation period ends.",
    applyText: "Open the official page on canada.ca",
    applyUrl:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-45355-mhrtc.html",
    source:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-45355-mhrtc.html",
    detail: {
      about:
        "The multigenerational home renovation tax credit is a refundable credit claimed on line 45355 of your income tax and benefit return for the 2024 and later tax years. A secondary unit is a self-contained housing unit with a private entrance, kitchen, bathroom and sleeping area. It must be newly constructed, or created from existing living space that did not already meet local requirements to be considered a secondary dwelling unit, and it must meet applicable local requirements, permits, codes and by-laws. A qualifying relation is someone 18 years of age or older at the end of the tax year being claimed who is a parent, grandparent, child, grandchild, brother, sister, aunt, uncle, niece or nephew of the qualifying individual, or of that individual's cohabiting spouse or common-law partner. You claim the renovation in the tax year in which the renovation period ended, even if the work took more than one year. The renovation period begins when the first qualifying expenditure is made or incurred, for example when you apply for a building permit, and ends when the renovation is completed, for example when it passes final inspection or proof of project completion is received. Where two or more people share the costs of the same qualifying renovation, the credit can be split between them, provided each is an eligible individual, the total claimed does not exceed the maximum, each claims only the expenditures they incurred, and no MHRTC was previously claimed for that qualifying individual.",
      aboutList: { lead: "The multigenerational home renovation tax credit is a refundable credit claimed on line 45355 of your income tax and benefit return for the 2024 and later tax years.", items: ["A secondary unit is a self-contained housing unit with a private entrance, kitchen, bathroom and sleeping area. It must be newly constructed, or created from existing living space that did not already meet local requirements to be considered a secondary dwelling unit, and it must meet applicable local requirements, permits, codes and by-laws.", "A qualifying relation is someone 18 years of age or older at the end of the tax year being claimed who is a parent, grandparent, child, grandchild, brother, sister, aunt, uncle, niece or nephew of the qualifying individual, or of that individual's cohabiting spouse or common-law partner.", "You claim the renovation in the tax year in which the renovation period ended, even if the work took more than one year.", "The renovation period begins when the first qualifying expenditure is made or incurred, for example when you apply for a building permit, and ends when the renovation is completed, for example when it passes final inspection or proof of project completion is received.", "Where two or more people share the costs of the same qualifying renovation, the credit can be split between them, provided each is an eligible individual, the total claimed does not exceed the maximum, each claims only the expenditures they incurred, and no MHRTC was previously claimed for that qualifying individual."] },
      steps: [
        "Confirm before starting that the person the unit is for is a qualifying individual, and that no MHRTC has ever been claimed for them",
        "Check that the planned unit will be self-contained, with its own private entrance, kitchen, bathroom and sleeping area, and that it will meet local requirements, permits, codes and by-laws",
        "Keep every invoice and proof of payment as the work proceeds",
        "Claim it in the tax year in which the renovation period ended, on line 45355 of your income tax and benefit return",
        "Use Schedule 12, Multigenerational Home Renovation Tax Credit, to report the expenses and calculate the credit",
      ],
      documents: [
        "Schedule 12, Multigenerational Home Renovation Tax Credit",
        "Invoices identifying the vendor or contractor, their business address and GST/HST registration number if any",
        "A description of the goods and the date they were bought, and the date the goods were delivered or the work was performed",
        "A description of the work done, including the address, and the amount of the invoice",
        "Proof of payment: receipts or invoices showing payment in full, or other proof such as a credit card slip or cancelled cheque",
      ],
      tips: [
        "You cannot claim the same expense under more than one credit. Expenses in an MHRTC claim cannot also be claimed for the medical expense tax credit or the home accessibility tax credit.",
        "You must reduce your expenses by anything you were paid back for. This includes any help you receive or are entitled to receive, and related rebates such as GST/HST rebates.",
        "The claim year depends on when the renovation period ended, not when it started. A project that spans two years is claimed once, in the later year.",
        "You may claim more than one qualifying renovation in the same year. But you can claim only one per qualifying individual per lifetime.",
      ],
    },
  },
  {
    id: "excise-gasoline-tax-refund",
    name: "Excise Gasoline Tax Refund",
    level: "Federal",
    category: "Tax",
    amount: "A refund of part of the federal excise tax on gasoline you buy; the CRA publishes no per-litre amount",
    summary:
      "If you have a permanent mobility impairment and cannot safely use public transportation, you can claim back part of the federal excise tax on the gasoline you buy. A qualified medical practitioner has to certify the impairment.",
    requires: ["exciseMobilityImpairment", "excisePermanentMobilityCertified"],
    eligibility: {
      mode: "all",
      items: [
        "You have a permanent mobility impairment.",
        "You are unable to safely use public transportation.",
        "A qualified medical practitioner certifies the impairment.",
      ],
    },
    note:
      "None of the CRA's pages for this program say how much the refund is per litre. This includes the program page, the Form XE8 page and Guide RC4064. Temporary cuts to the federal excise tax rates on certain types of fuel are in effect. Ask the CRA at 1-877-432-5472 what the current rate is. Do not rely on a figure from anywhere else.",
    requiresNote:
      "You must have a permanent mobility impairment and be unable to safely use public transportation. A qualified medical practitioner must certify the impairment.",
    applyText: "Open Form XE8 on canada.ca",
    applyUrl: "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/xe8.html",
    source:
      "https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/excise-gasoline-tax-refund.html",
    detail: {
      about:
        "This is a refund of part of the federal excise tax you pay on gasoline, for people with a permanent mobility impairment who cannot safely use public transportation. A qualified medical practitioner must certify the impairment. You claim it using Form XE8, Application for Refund of Federal Excise Tax on Gasoline, which can be filed electronically through My Account, My Business Account or Represent a Client in your CRA account, or downloaded and filled out. The same form is also used by registered Canadian amateur athletic associations and registered charities, so only part of it concerns an individual with a permanent mobility impairment. The CRA's pages for this program do not state the refund amount per litre, and the Form XE8 page notes that the government implemented temporary reductions of the federal excise tax rates on certain types of fuel.",
      aboutList: { lead: "This is a refund of part of the federal excise tax you pay on gasoline, for people with a permanent mobility impairment who cannot safely use public transportation.", items: ["A qualified medical practitioner must certify the impairment.", "You claim it using Form XE8, Application for Refund of Federal Excise Tax on Gasoline, which can be filed electronically through My Account, My Business Account or Represent a Client in your CRA account, or downloaded and filled out.", "The same form is also used by registered Canadian amateur athletic associations and registered charities, so only part of it concerns an individual with a permanent mobility impairment.", "The CRA's pages for this program do not state the refund amount per litre, and the Form XE8 page notes that the government implemented temporary reductions of the federal excise tax rates on certain types of fuel."] },
      steps: [
        "Ask a qualified medical practitioner to certify your permanent mobility impairment",
        "Get Form XE8, Application for Refund of Federal Excise Tax on Gasoline",
        "File it electronically through My Account, My Business Account or Represent a Client in your CRA account, or fill out the PDF and send it in",
        "Call the CRA at 1-877-432-5472 if you need help with the form or want the current refund rate",
      ],
      documents: [
        "Form XE8, Application for Refund of Federal Excise Tax on Gasoline",
        "A qualified medical practitioner's certification of the permanent mobility impairment",
      ],
      tips: [
        "Form XE8 comes as an accessible fillable PDF, a standard print PDF and a large print PDF. On request, the CRA will provide other formats, including braille, electronic text, digital audio and large print.",
        "Keep your gasoline receipts as you go. The refund is based on gasoline you have already bought.",
        "Do not budget using a per-litre figure from a third-party site. The CRA does not publish one here, and fuel excise rates are under temporary cuts. Call 1-877-432-5472.",
      ],
    },
  },
  {
    id: "canadian-dental-care-plan",
    name: "Canadian Dental Care Plan (CDCP)",
    level: "Federal",
    category: "Health",
    amount: "Covers 100% of eligible costs at CDCP established fees under $70,000 family income, 60% from $70,000 to $79,999, and 40% from $80,000 to $89,999",
    amountTiers: {
      caption: "What the plan pays by adjusted family net income",
      headers: ["Adjusted family net income", "Plan covers", "You pay"],
      rows: [
        ["Under $70,000", "100% of eligible costs at CDCP established fees", "None of those fees"],
        ["$70,000 to $79,999", "60%", "40%"],
        ["$80,000 to $89,999", "40%", "60%"],
      ],
    },
    requires: ["cdcpRequirements"],
    eligibility: {
      mode: "all",
      items: [
        "You have no access to private dental insurance or coverage, including a health spending account that covers dental costs. The only exception is if you retired and opted out of dental coverage through your pension plan before December 11, 2023 and cannot opt back in.",
        "You and your spouse or common-law partner have filed your Canadian tax returns for the previous year.",
        "Your adjusted family net income is less than $90,000.",
        "You are a Canadian resident.",
      ],
      note: "You can check the coverage question on your T4 or T4A: code 1 in the dental box means you do not have access, while 2, 3, 4 or 5 means your work or pension plan offers some dental coverage for you or your family.",
    },
    summary:
      "A federal plan that pays part of the cost of dental care. It is for people without private dental coverage whose adjusted family net income is under $90,000. It is based on income, not disability. Canada lists it among its disability benefits because many disabled people have no workplace dental coverage.",
    note:
      "The plan pays at CDCP established fees. These can be lower than what your provider charges, so you may still owe the difference to them. Ask your provider what the CDCP pays and what you will owe before treatment.",
    requiresNote:
      "You must meet all four requirements. First, you have no access to private dental insurance or coverage, including a health spending account that covers dental costs. The only exception is if you retired and opted out of dental coverage through your pension plan before December 11, 2023 and cannot opt back in. Second, you and your spouse or common-law partner have filed your Canadian tax returns for the previous year. Third, your adjusted family net income is less than $90,000. Fourth, you are a Canadian resident. You can check the coverage question on your T4 or T4A: code 1 in the dental box means you do not have access, while 2, 3, 4 or 5 means your work or pension plan offers some dental coverage for you or your family.",
    applyText: "Apply for the Canadian Dental Care Plan",
    applyUrl: "https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html",
    source: "https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html",
    detail: {
      about:
        "The CDCP pays a share of eligible oral health care at fees the plan sets. What it pays depends on adjusted family net income: under $70,000 the plan covers 100% of eligible costs at CDCP established fees and you cover none of those fees. From $70,000 to $79,999 the plan covers 60% and you cover 40%. From $80,000 to $89,999 the plan covers 40% and you cover 60%. Covered services include diagnostic and preventive care, complete dentures including standard and temporary, denture repairs, relines and rebases, and linings placed to condition oral tissues. Partial dentures and complete immediate and overdentures need preauthorization, as do services beyond the plan's frequency limits. Providers are paid by the plan directly, so you should not have to pay the whole cost up front, but you may owe additional charges to the provider.",
      aboutList: { lead: "The CDCP pays a share of eligible oral health care at fees the plan sets.", items: ["What it pays depends on adjusted family net income: under $70,000 the plan covers 100% of eligible costs at CDCP established fees and you cover none of those fees.", "From $70,000 to $79,999 the plan covers 60% and you cover 40%.", "From $80,000 to $89,999 the plan covers 40% and you cover 60%.", "Covered services include diagnostic and preventive care, complete dentures including standard and temporary, denture repairs, relines and rebases, and linings placed to condition oral tissues.", "Partial dentures and complete immediate and overdentures need preauthorization, as do services beyond the plan's frequency limits.", "Providers are paid by the plan directly, so you should not have to pay the whole cost up front, but you may owe additional charges to the provider."] },
      steps: [
        "Check all four requirements, including the dental code on your T4 or T4A",
        "Confirm your tax return and your spouse or partner's are filed for the previous year",
        "Apply through the Canadian Dental Care Plan",
        "Before treatment, ask your oral health provider what the CDCP will pay and what you will owe, and whether the service needs preauthorization.",
      ],
      documents: [
        "Your T4 or T4A slip showing the dental coverage code",
        "Your filed tax return for the previous year, and your spouse or common-law partner's",
        "Proof that you no longer have access to dental coverage, if CRA asks for it.",
      ],
      tips: [
        "The plan pays at CDCP established fees, which may be below your provider's fee, so ask what you will owe first",
        "Some services need preauthorization, and not every request is approved",
        "If you have any dental coverage at all, you are not eligible, even if it covers very little",
        "If you join while you actually had coverage, you may have to repay the government for services the plan paid.",
      ],
    },
  },
  {
    id: "disability-supports-deduction",
    eligibility: { mode: "all", items: ["You must have an impairment in physical or mental functions and have paid the expenses yourself so that you could work, attend school or do research for which you received a grant.", "Only the person with the disability can claim this deduction — a family member cannot claim it for them."], note: "Some expenses need a certification from a medical practitioner. Keep every receipt." },
    name: "Disability Supports Deduction (line 21500)",
    level: "Federal",
    category: "Tax",
    amount: "A deduction from your income for what you paid, with no fixed maximum",
    requires: ["disabilityMedicalExpensesPaid"],
    summary:
      "You may be able to deduct support costs if you have an impairment in physical or mental functions. Supports must let you work, attend school or do research for which you received a grant. Only the person with the disability can claim it.",
    note:
      "This is a deduction, not a credit. It lowers the income you are taxed on. It does not pay you money. You can put the same expense here or on the medical expense credit, or split it between them. The total you claim cannot be more than what you actually spent.",
    requiresNote:
      "You must have an impairment in physical or mental functions and have paid the expenses yourself so that you could work, attend school or do research for which you received a grant. Only the person with the disability can claim this deduction — a family member cannot claim it for them. Some expenses need a certification from a medical practitioner. Keep every receipt.",
    applyText: "Read the CRA guidance for line 21500",
    applyUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-21500-disability-supports-deduction.html",
    source: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-21500-disability-supports-deduction.html",
    detail: {
      about:
        "If you have an impairment in physical or mental functions, you may be able to deduct what you paid for supports. Supports must let you work, attend school or do research for which you received a grant. Use Form T929, Disability Supports Deduction, to work out the amount, then enter the figure from line 12 of that form on line 21500 of your return, in Step 3, net income. CRA notes that the same medical expense can be claimed on line 21500 or on line 33099, or split between the two, as long as the total claimed is not more than the expense. Do not send Form T929 or the receipts with your return; keep them in case CRA asks.",
      aboutList: { lead: "If you have an impairment in physical or mental functions, you may be able to deduct what you paid for supports. Supports must let you work, attend school or do research for which you received a grant.", items: ["Use Form T929, Disability Supports Deduction, to work out the amount, then enter the figure from line 12 of that form on line 21500 of your return, in Step 3, net income.", "CRA notes that the same medical expense can be claimed on line 21500 or on line 33099, or split between the two, as long as the total claimed is not more than the expense.", "Do not send Form T929 or the receipts with your return; keep them in case CRA asks."] },
      steps: [
        "Check the CRA list of eligible expenses for this deduction and whether any of yours need a medical practitioner's certification",
        "Complete Form T929, Disability Supports Deduction",
        "Enter the amount from line 12 of Form T929 on line 21500 of your return, and keep the form and receipts rather than sending them.",
      ],
      documents: [
        "Receipts for every expense claimed",
        "Form T929, Disability Supports Deduction",
        "Any certification from a medical practitioner that a particular expense requires.",
      ],
      tips: [
        "Only the person with the disability can claim this, so it cannot be moved to a parent or spouse",
        "Decide whether each expense is better on line 21500 or as a medical expense on line 33099, because you can split them but not double-count",
        "Because it is a deduction, it lowers taxable income. This can matter more than a credit at higher incomes.",
      ],
    },
  },
  {
    id: "medical-expense-tax-credit",
    name: "Medical Expense Tax Credit (lines 33099 and 33199)",
    level: "Federal",
    category: "Tax",
    amount: "Claimable on the part of your medical expenses above the lesser of 3% of net income or $2,834",
    requires: ["disabilityMedicalExpensesPaid"],
    summary:
      "The federal credit for medical expenses you pay yourself. Disability-related costs are often the largest medical expenses a household has. Most of them are claimed here.",
    note:
      "Only the part above a threshold counts. The threshold is the lesser of 3% of net income or $2,834. On a lower income, the 3% figure usually applies, so more of your expenses count. This amount is indexed and changes by tax year. Confirm the figure for the year you are filing.",
    requiresNote:
      "You claim expenses you paid for yourself, your spouse or common-law partner, and your children under 18 on line 33099. Expenses for a dependant who depended on you for support, other than a spouse, partner or child under 18, go on line 33199 (see CRA for who counts), where the same threshold is worked out separately using that dependant's net income. Keep all receipts.",
    applyText: "Read the CRA guidance for lines 33099 and 33199",
    applyUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/lines-33099-33199-eligible-medical-expenses-you-claim-on-your-tax-return.html",
    source: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/lines-33099-33199-eligible-medical-expenses-you-claim-on-your-tax-return.html",
    detail: {
      about:
        "For line 33099 you total the eligible expenses, then subtract the lesser of 3% of your net income from line 23600 or $2,834, and the remainder, entered on the line after the threshold, is what the credit is calculated on. CRA's own worked example: Pauline's net income is $55,000, 3% of that is $1,650, and because $1,650 is less than $2,834 she subtracts $1,650 from the $6,300 of combined expenses. Expenses for children under 18 can be combined with the parents' expenses. For a dependant who depended on you for support, other than a spouse, partner or child under 18, use line 33199 (see CRA for who counts) and run the same lesser-of calculation against that dependant's own net income. The $2,834 figure is indexed and changes by tax year.",
      aboutList: { lead: "For line 33099 you total the eligible expenses, then subtract the lesser of 3% of your net income from line 23600 or $2,834, and the remainder, entered on the line after the threshold, is what the credit is calculated on.", items: ["CRA's own worked example: Pauline's net income is $55,000, 3% of that is $1,650, and because $1,650 is less than $2,834 she subtracts $1,650 from the $6,300 of combined expenses.", "Expenses for children under 18 can be combined with the parents' expenses.", "For a dependant who depended on you for support, other than a spouse, partner or child under 18, use line 33199 (see CRA for who counts) and run the same lesser-of calculation against that dependant's own net income.", "The $2,834 figure is indexed and changes by tax year."] },
      steps: [
        "Collect receipts for every eligible medical expense for the year, for yourself, your spouse or partner and your children under 18",
        "Total them and enter the total on line 33099",
        "On the line below, enter the lesser of 3% of your net income from line 23600 or $2,834",
        "Subtract that amount from the line 33099 total and enter the result on the following line of your return",
        "Claim eligible expenses on line 33199 for other dependants who depended on you for support: your or your spouse's or common-law partner's children aged 18 or older at the end of the tax year, or grandchildren.",
        "Line 33199 also covers your or your spouse's or common-law partner's parents, grandparents, brothers, sisters, uncles, aunts, nephews or nieces who depended on you for support and were residents of Canada at any time in the year.",
        "For each eligible dependant on line 33199, run the same calculation against that dependant's net income.",
      ],
      documents: [
        "Receipts for every medical expense claimed",
        "Prescriptions or practitioner certifications where CRA requires them",
        "Your net income figure from line 23600.",
      ],
      tips: [
        "The threshold is the lesser of the two figures, so a lower income means a lower threshold and more of your expenses count",
        "You can choose any 12-month period ending in the tax year, as long as those expenses were not already claimed in the prior year. Check CRA's rule before choosing",
        "If you also claim the disability supports deduction on line 21500, split each expense between the two. Do not claim it twice",
        "The $2,834 threshold is indexed, so confirm the current figure for your filing year.",
      ],
    },
  },
  {
    id: "canada-caregiver-credit",
    eligibility: { mode: "all", items: ["You must be supporting a spouse or common-law partner, or a dependant, who has a mental or physical impairment."], note: "The amount depends on who you are supporting and on whether other credits are being claimed for that person. This is claimed by the supporter on their own return." },
    name: "Canada Caregiver Credit (CCC)",
    level: "Federal",
    category: "Tax",
    amount: "$2,687, and up to $8,601 depending on who you support and which line you claim",
    requires: ["caregiverSupportClaim"],
    summary:
      "A federal non-refundable credit for someone who supports a spouse, common-law partner or dependant with a mental or physical impairment. The person giving the support claims it, not the person with the disability.",
    note:
      "These amounts are indexed and change by tax year. Confirm the current figures for the year you are filing. Which line you use, and how much you can claim, depends on your relationship to the person. It also depends on what other credits are already claimed for them.",
    requiresNote:
      "You must be supporting a spouse or common-law partner, or a dependant, who has a mental or physical impairment. The amount depends on who you are supporting and on whether other credits are being claimed for that person. This is claimed by the supporter on their own return.",
    applyText: "Read the CRA guidance for the Canada caregiver credit",
    applyUrl: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/canada-caregiver-amount.html",
    source: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/canada-caregiver-amount.html",
    detail: {
      about:
        "The Canada caregiver credit is a non-refundable credit for people supporting a family member with a mental or physical impairment. As CRA currently publishes it: for a spouse or common-law partner you may claim $2,687 on line 30300 and up to $8,601 on line 30425. For an eligible dependant aged 18 or older who qualifies for line 30400, you may claim $2,687 on line 30400 and up to $8,601 on line 30425. For an eligible dependant under 18 who qualifies for line 30400, you may claim $2,687 on either line 30400 or line 30500. For each of your own or your spouse's or partner's children under 18 at the end of the year, you may claim $2,687 on line 30500. For each dependant aged 18 or older who is not your spouse or partner and is not an eligible dependant claimed on line 30300 or line 30400, you may claim up to $8,601 on line 30450. All of these amounts are indexed and change by tax year.",
      aboutList: { lead: "The Canada caregiver credit is a non-refundable credit for people supporting a family member with a mental or physical impairment. As CRA currently publishes it:", items: ["For a spouse or common-law partner you may claim $2,687 on line 30300 and up to $8,601 on line 30425.", "For an eligible dependant aged 18 or older who qualifies for line 30400, you may claim $2,687 on line 30400 and up to $8,601 on line 30425.", "For an eligible dependant under 18 who qualifies for line 30400, you may claim $2,687 on either line 30400 or line 30500.", "For each of your own or your spouse's or partner's children under 18 at the end of the year, you may claim $2,687 on line 30500.", "For each dependant aged 18 or older who is not your spouse or partner and is not an eligible dependant claimed on line 30300 or line 30400, you may claim up to $8,601 on line 30450.", "All of these amounts are indexed and change by tax year."] },
      steps: [
        "Work out your relationship to the person you support and whether they have a mental or physical impairment",
        "Check which line applies to that relationship, and whether any other credit is already being claimed for them",
        "Claim the amount on the correct line of your own return and keep the supporting documents.",
      ],
      documents: [
        "a signed statement from a medical practitioner describing the impairment, when it began and its expected duration, if CRA asks for it",
        "Records showing the support you provide.",
      ],
      tips: [
        "The supporter claims this, so it does not lower the tax of the person with the disability",
        "Which line to use depends on the relationship and on other credits already claimed for that person. Read CRA's table before filing",
        "The amounts are indexed and change each tax year, so do not rely on a figure you saw in a previous year.",
      ],
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
    requires: ["aishAge", "ab", "citizenPR", "aishMedical", "aishFinancial"],
    note:
      "AISH is for a severe, permanent disability that prevents employment. Alberta now uses one application to assess both AISH and ADAP — submit it once, not separately for each program.",
    applyText: "Apply for Alberta disability income assistance",
    applyUrl: "https://www.alberta.ca/how-to-apply-for-aish-and-adap",
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
        "Disability Income Assistance (DIA) application form, if you cannot apply online",
        "Disability Assistance Medical Report, completed by your health professional",
      ],
      tips: [
        "The medical form should focus on how your condition permanently prevents employment, not just the diagnosis.",
        "The combined application assesses AISH and ADAP. Alberta, not this tool, decides the program and benefit amount.",
        "Use Alberta's AISH/ADAP benefit estimator for a household-specific estimate before relying on any amount.",
        "If you receive AISH or ADAP, report the outcome of your CDB and/or DTC application to Alberta, including the approved CDB amount or a denial. Alberta says that when no CDB decision had been made by February 28, 2026, $200 was reduced from April 2026 benefits.",
        "Getting help with the online application: phone the Alberta Supports Contact Centre at 1-877-644-9992, or 780-644-9992 in Edmonton.",
        "Your health professional may charge you a fee to complete the Disability Assistance Medical Report, and you are responsible for paying it. If you are on Income Support that cost may be covered — ask your Income Support worker. For AISH clients who transitioned to ADAP and later choose to be assessed for AISH, Alberta says it will cover the cost of one Disability Income Assistance Medical Report; this support is not time-limited.",
        "Benefits are backdated to the month AISH or ADAP received all of the information needed to approve your application, so sending every document sooner can mean an earlier start date for your benefits.",
        "To check where your application is, phone 587-759-6810 in the Edmonton area, or 1-877-759-6810 toll free within Alberta.",
        "If you leave AISH or ADAP, your file may be reopened quickly if it has been less than 2 years since you got your last AISH benefits and you did not leave AISH or ADAP due to a change in your medical condition. Contact AISH or ADAP if this applies to you; if not, you will need to reapply.",
      ],
      time: "Ask Alberta Supports for the current processing time.",
      phone: "DIA Application Processing Centre (applications and status): 1-877-759-6810",
    },
  },
  {
    "id": "adap",
    "needsPractitioner": true,
    "name": "Alberta Disability Assistance Program (ADAP)",
    "level": "Alberta",
    "category": "Money",
    "amount": "Up to $1,740/month + health, personal and employment benefits",
    "summary": "Alberta disability income assistance when a severe disability significantly impedes employment, continuously or episodically, but does not prevent it.",
    "requires": [
      "adapAge",
      "ab",
      "citizenPR",
      "adapMedical",
      "adapFinancial"
    ],
    "note": "The same combined application assesses ADAP and AISH. This guide can only flag that ADAP may be worth asking about — Alberta makes the eligibility decision.",
    "applyText": "Apply for Alberta disability income assistance",
    "applyUrl": "https://www.alberta.ca/how-to-apply-for-aish-and-adap",
    "source": "https://www.alberta.ca/alberta-disability-assistance-program",
    "detail": {
      "about": "ADAP is Alberta disability income assistance for adults whose severe disability significantly impedes employment continuously or episodically. To be medically eligible, the severe disability must be determined to significantly restrict but not prevent a person from being employed. It can include a core monthly financial benefit, health benefits, personal benefits and employment supports.",
      "steps": [
        "Use Alberta's combined AISH/ADAP application — it assesses which program fits; you do not make two separate applications.",
        "Complete your part and arrange the required medical report with a medical professional registered in Alberta.",
        "Provide the residency, status and financial information requested by Alberta Supports."
      ],
      "documents": [
        "Medical report describing how the disability significantly impedes employment",
        "Proof of Alberta residency + Canadian citizenship / PR",
        "Financial details (income and assets)",
        "Disability Income Assistance (DIA) application form, if you cannot apply online",
        "Disability Assistance Medical Report, completed by your health professional"
      ],
      "tips": [
        "Describe functional limits and fluctuating or episodic barriers — not only your diagnosis name.",
        "One application is enough: Alberta decides whether AISH or ADAP is the appropriate program.",
        "Use Alberta's AISH/ADAP benefit estimator for a household-specific estimate before relying on any amount.",
        "If you receive ADAP or AISH, report the outcome of your CDB and/or DTC application to Alberta, including the approved CDB amount or a denial. Alberta says that when no CDB decision had been made by February 28, 2026, $200 was reduced from April 2026 benefits.",
        "Getting help with the online application: phone the Alberta Supports Contact Centre at 1-877-644-9992, or 780-644-9992 in Edmonton.",
        "Your health professional may charge you a fee to complete the Disability Assistance Medical Report, and you are responsible for paying it. If you are on Income Support that cost may be covered — ask your Income Support worker. For AISH clients who transitioned to ADAP and later choose to be assessed for AISH, Alberta says it will cover the cost of one Disability Income Assistance Medical Report; this support is not time-limited.",
        "Benefits are backdated to the month AISH or ADAP received all of the information needed to approve your application, so sending every document sooner can mean an earlier start date for your benefits.",
        "To check where your application is, phone 587-759-6810 in the Edmonton area, or 1-877-759-6810 toll free within Alberta.",
        "If you leave AISH or ADAP, your file may be reopened quickly if it has been less than 2 years since you got your last AISH benefits and you did not leave AISH or ADAP due to a change in your medical condition. Contact AISH or ADAP if this applies to you; if not, you will need to reapply."
      ],
      "time": "Ask Alberta Supports for the current processing time.",
      "phone": "DIA Application Processing Centre (applications and status): 1-877-759-6810"
    }
  },
  {
    id: "aadl",
    name: "Alberta Aids to Daily Living (AADL)",
    level: "Alberta",
    category: "Health & equipment",
    amount: "Funding for medical equipment & supplies (you pay a small share)",
    summary:
      "Helps pay for equipment and supplies you need for a long-term illness, disability or condition — wheelchairs, hearing aids, breathing supplies and much more.",
    requires: ["ab", "equipmentNeed", "ahcipRegistered", "aadlAssessment", "aadlOtherPayer"],
    note:
      "Covers a wide range of devices. You usually pay 25% (capped per year). Low-income households can have that waived.",
    applyText: "Open the official page on alberta.ca",
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
        "You don't apply to a general office. You go through an authorizer (often an OT, physio, or audiologist). Ask your doctor for a referral.",
        "The 25% cost-share is capped each year. Low-income Albertans and people receiving income assistance do not pay it.",
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
    requires: ["age18plus", "ab", "developmental", "pddEligibility"],
    note:
      "For adults whose developmental disability began before age 18 and significantly affects daily living. Provides services and supports, not direct cash.",
    applyText: "Open the official page on alberta.ca",
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
        "PDD funds services and supports. It does not pay you cash. Many people also receive AISH at the same time.",
        "Start early. Assessment and planning can take time.",
      ],
      time: "Varies; assessment-based.",
      phone: "Alberta Supports: 1-877-644-9992",
    },
  },
  {
    "id": "fscd",
    "name": "Family Support for Children with Disabilities (FSCD)",
    "level": "Alberta",
    "category": "Family supports",
    "amount": "Services + funding for families raising a child with a disability",
    "summary": "Support and funding for Alberta families raising a child under 18 with a disability — respite, aids, counselling, and reimbursement of some costs.",
    "requires": [
      "child",
      "ab",
      "fscdEligibility"
    ],
    "note": "Wide-ranging support for families: respite care, specialized services, and help with some out-of-pocket disability costs. It is separate from the federal Child Disability Benefit, and you can get both.",
    "applyText": "Open the official page on alberta.ca",
    "applyUrl": "https://www.alberta.ca/fscd",
    "source": "https://www.alberta.ca/fscd-eligibility",
    "detail": {
      "about": "A provincial program that helps families of children under 18 with disabilities cover the extra costs and stress of caregiving — respite, child-focused supports, family counselling, and reimbursement of some disability-related expenses.",
      "steps": [
        "Contact an FSCD office or Alberta Supports.",
        "Meet with an FSCD worker to identify your family's needs.",
        "A signed agreement sets out the services and funding you'll receive."
      ],
      "documents": [
        "Medical documentation confirming your child has a disability or is awaiting a diagnosis",
        "Proof of Alberta residency"
      ],
      "tips": [
        "Ask specifically about respite.",
        "You can receive FSCD and the federal Child Disability Benefit at the same time."
      ],
      "time": "Assessment-based; contact them to begin.",
      "phone": "Alberta Supports: 1-877-644-9992"
    }
  },
  {
    id: "dres",
    name: "Disability Related Employment Supports (DRES)",
    level: "Alberta",
    category: "Employment",
    amount: "Potential funding for approved disability-related accommodations",
    summary:
      "May fund approved accommodations for an Albertan who is employed or heading into employment. Their documented permanent or long-term disability must create a barrier to education, training, or employment.",
    requires: [
      "age16plus",
      "ab",
      "disabilityDoc",
      "dresResidencyAndStatus",
      "dresDisabilityBarrier",
      "dresEmploymentRoute",
    ],
    eligibility: {
      mode: "all",
      items: [
        "You are 16 or older.",
        "You reside in Alberta.",
        "You are legally entitled to work or train in Canada.",
        "You are a Canadian citizen, permanent resident, or Convention Refugee.",
        "You are employed or employment destined.",
        "You may be eligible for funding if you have a disability that is documented permanent or long-term and creating a barrier to education, training and/or employment.",
      ],
    },
    requiresNote:
      "You must be 16 or older, reside in Alberta, be legally entitled to work or train in Canada, and be a Canadian citizen, permanent resident, or Convention Refugee. You must be employed or employment destined. You may be eligible for funding if your disability is documented permanent or long-term and creating a barrier to education, training and/or employment.",
    note:
      "Alberta's published examples include: assistive devices, equipment or technology; ASL interpreting and captioning; an academic aide or note taker; communication or hearing devices for work; workplace access or changes; and work-related vehicle changes. Education or training supports are not available while you attend Alberta Education-funded K–12 or a publicly funded Alberta post-secondary institution. Contact the school or institution for disability accommodations. A separate eligible work route may still be considered.",
    applyText: "Open the official page on alberta.ca",
    applyUrl: "https://www.alberta.ca/disability-related-employment-supports",
    source: "https://www.alberta.ca/disability-related-employment-supports",
    detail: {
      about:
        "DRES may fund approved accommodations that address a documented permanent or long-term disability barrier for an employed or employment-destined person. Published examples are assistive devices, equipment or technology; ASL interpreting and captioning; an academic aide or note taker; communication or hearing devices for work; workplace access or modification; and work-related vehicle modifications. It does not fund medical treatments or therapies, daily-living items, job matching, employment and skills training, or wage subsidies.",
      steps: [
        "Open the official DRES page and use its current contact route to ask about an employment or employment-destined accommodation.",
        "Confirm the Alberta residency, age, legal entitlement, immigration-status, disability-duration, disability-barrier and employment-route criteria.",
        "Describe the disability-related barrier and the specific accommodation requested, using only the current DRES coverage rules.",
      ],
      documents: [
        "Documentation that the disability is permanent or long-term and creates a barrier to education, training or employment",
        "Information confirming Alberta residency and legal entitlement to work or train in Canada",
        "Information confirming Canadian citizen, permanent resident or Convention Refugee status",
        "Information showing that you are employed or employment destined and identifying the requested accommodation",
      ],
      tips: [
        "Alberta's published examples of what is covered include: assistive devices, equipment or technology; ASL interpreting and captioning; an academic aide or note taker; communication or hearing devices for work; workplace access or changes; and work-related vehicle changes.",
        "If the request is for education or training while you attend Alberta Education-funded K–12 or a publicly funded Alberta post-secondary institution, contact the school or institution for disability accommodations. This does not by itself rule out a separate eligible work route.",
      ],
      phone: "Alberta Supports Contact Centre 780-644-9992 or 1-877-644-9992",
    },
  },
  {
    id: "ab-grant-disability",
    name: "Alberta Grant for Students with Disabilities",
    level: "Alberta",
    category: "Education",
    amount: "Up to $3,000 per loan year for approved costs after federal funding",
    summary:
      "May fund approved disability-related services and equipment when the federal services-and-equipment grant is unavailable or does not cover all approved costs; federal funding is allocated first.",
    requires: [
      "student",
      "ab",
      "disabilityDoc",
      "abGrantStudyAidEligibility",
      "abGrantCurrentCostRequest",
    ],
    note:
      "You need Alberta student-funding eligibility, at least $1 of Alberta calculated need, and a full-time course load of at least 60% (or a documented reduced load of at least 40%). The provincial amount cannot exceed approved service and equipment costs left after federal-first allocation.",
    applyText: "Apply through Alberta Student Aid",
    applyUrl: (a) => STUDENT_AID[a.province] || FED_STUDENT_AID,
    source:
      "https://studentaid.alberta.ca/policy/student-aid-policy-manual/eligibility-for-student-loans-and-grants/alberta-student-grants/",
    detail: {
      about:
        "A provincial grant for approved disability-related services and equipment. The Canada Student Grant for Services and Equipment – Students with Disabilities is allocated first. Alberta funding may apply only when that federal grant is unavailable or leaves approved costs uncovered. The Alberta maximum is $3,000 per loan year and cannot exceed approved costs.",
      aboutList: { lead: "A provincial grant for approved disability-related services and equipment.", items: ["The Canada Student Grant for Services and Equipment – Students with Disabilities is allocated first.", "Alberta funding may apply only when that federal grant is unavailable or leaves approved costs uncovered.", "The Alberta maximum is $3,000 per loan year and cannot exceed approved costs."] },
      steps: [
        "Apply for financial assistance through Alberta Student Aid and request disability-related services or equipment.",
        "For each new financial-assistance application where disability-related services or equipment are requested, complete the current Schedule 4 with the services and equipment requested and their current costs.",
        "Attach quotes or estimates for every requested cost and include documentation describing why the items are needed if Alberta Student Aid does not already have it.",
        "Submit receipts by the end of the study period and return any unused or undocumented funding to avoid an overpayment.",
      ],
      documents: [
        "An approved Schedule 4 for the current financial-assistance application",
        "Current quotes or estimates showing the requested service and equipment costs",
        "Documentation of a permanent disability or persistent or prolonged disability",
        "Documentation describing the disability-related need for each service or item, if not previously provided",
        "Receipts for funded services and equipment, due by the end of the study period",
      ],
      tips: [
        "Disability-type verification already on file may sometimes be reusable, but every new application requesting services or equipment still needs a current Schedule 4 cost request and quotes or estimates.",
        "Ask your school's disability services office to help describe the need and prepare Schedule 4, but confirm all requested costs are current.",
        "Keep copies of approvals, quotes, invoices and receipts. Unused funding, or funding without required receipts, must be returned or becomes an overpayment.",
      ],
      time: "Assessed with your Alberta student aid application.",
      phone: "Alberta Student Aid Service Centre: 1-855-606-2096",
    },
  },
  {
    id: "adult-health-benefit",
    name: "Alberta Adult Health Benefit",
    level: "Alberta",
    category: "Health",
    amount: "Dental care, prescription drugs, eye exams and glasses, and more — ask your provider what is paid for",
    summary:
      "Health coverage for adults in lower-income households. It covers prescriptions, dental, eye care, and essential diabetic supplies.",
    requires: ["adult", "ab", "citizenPR", "adultHealthIncome", "adultHealthGateway"],
    note:
      "Helps cover the cost of medication if you're on a lower income and not already covered by AISH.",
    applyText: "Open the official page on alberta.ca",
    applyUrl: "https://www.alberta.ca/alberta-adult-health-benefit",
    source: "https://www.alberta.ca/alberta-adult-health-benefit",
    detail: {
      about:
        "Ongoing health coverage for adults and families with lower incomes — prescription drugs, dental, optical, emergency ambulance, and diabetic supplies — at no monthly premium.",
      steps: [
        "Check the income guidelines on the page.",
        "Complete the Alberta Adult Health Benefit application.",
        "Sign the consent for the Canada Revenue Agency to verify your income, add documentation of your high ongoing prescription drug needs if it applies, and submit the form by email, mail or fax.",
      ],
      documents: [
        "Signed Consent for Canada Revenue Agency to Verify Income (part of the application form)",
        "Alberta Health Care number",
        "If it applies: documentation of high ongoing prescription drug needs, such as a pharmacy dispensing history report",
      ],
      tips: [
        "If you leave AISH or Income Support because you started working, you may keep this coverage. Ask specifically.",
        "If your application is denied because of your income, Alberta describes a way to ask for a reassessment with extra income documents. The steps depend on when you were denied.",
      ],
      time: "A few weeks to process.",
      phone: "Health Benefits Contact Centre: 780-427-6848, or toll free 1-877-469-5437",
    },
  },
  {
    id: "child-health-benefit",
    name: "Alberta Child Health Benefit",
    level: "Alberta",
    category: "Health (for children)",
    amount: "Covers eligible prescription drugs, basic and preventative dental care and eyeglasses for children in low-income households",
    summary:
      "Health coverage for children under 18 in lower-income families. There is also a conditional route for 18- and 19-year-olds still in high school through grade 12.",
    requires: ["achbAge", "ab", "citizenPR", "lowIncome", "achbOlderDependent", "achbFamilyResidencyStatus", "achbCoverageCoordination"],
    note:
      "The applicant and family members must live in Alberta and be Canadian citizens or permanent residents. Income Support, AISH, the Child and Youth Support Program, and Non-Insured Health Benefits are excluded government coverage. Private plans are used first. They are not exclusions. For services covered by both ACHB and the Canadian Dental Care Plan, claims go to the Canadian Dental Care Plan first.",
    applyText: "Open the official page on alberta.ca",
    applyUrl: "https://www.alberta.ca/alberta-child-health-benefit",
    source: "https://www.alberta.ca/alberta-child-health-benefit",
    declarationText: "Declaration for an 18- or 19-year-old dependent (AEHB3654)",
    declarationUrl: "https://cfr.forms.gov.ab.ca/Form/AEHB3654",
    detail: {
      about:
        "No-premium prescription, dental, optical and other eligible health coverage for children under 18 in lower-income Alberta families. A child aged 18 or 19 can qualify only while living at home and attending high school through grade 12, with declaration AEHB3654.",
      steps: [
        "Check the income guidelines and confirm the whole family's Alberta residency, citizenship or permanent-resident status, and other government health coverage.",
        "Complete the Alberta Child Health Benefit application.",
        "For an eligible 18- or 19-year-old living at home and attending high school through grade 12, also submit Declaration of 18 and 19 Year Old Dependent AEHB3654: https://cfr.forms.gov.ab.ca/Form/AEHB3654",
        "Submit the application with proof of income.",
      ],
      documents: [
        "Proof of family income",
        "Your children's Alberta Health Care numbers",
        "Declaration AEHB3654 for an eligible 18- or 19-year-old dependent",
      ],
      tips: [
        "Income Support, AISH, the Child and Youth Support Program, and Non-Insured Health Benefits for First Nations and Inuit are excluded government health-benefit coverage.",
        "Private or other health insurance is not an exclusion. Use it first. ACHB may cover remaining eligible costs.",
        "If you also have the Canadian Dental Care Plan, claims for services covered by both plans go to the Canadian Dental Care Plan first. ACHB may then cover remaining eligible dental costs.",
      ],
      time: "A few weeks to process.",
      phone: "Health Benefits Contact Centre: 780-427-6848 or 1-877-469-5437",
    },
  },
  {
    id: "ramp",
    needsPractitioner: true,
    name: "Residential Access Modification Program (RAMP)",
    level: "Alberta",
    category: "Health & equipment",
    amount: "Up to \$12,000 per benefit year, to a maximum of \$24,000 over 10 years",
    summary:
      "Alberta grant that pays for permanent changes so you can get into and move around your own home. It is for wheelchair users of any age, seniors using a 4-wheel walker, and people living with certain progressive conditions.",
    requires: ["ab", "citizenPR", "homeAccessNeed", "rampMobilityRoute", "rampIncomeAndResidency"],
    note:
      "You can apply as a homeowner, a tenant, or someone living with family. Indigenous applicants can apply whether they live on- or off-reserve. Changes must be permanent. They must be finished within 90 days of approval unless RAMP allows more time.",
    applyText: "Apply for RAMP",
    applyUrl: "https://www.alberta.ca/residential-access-modification-program",
    source: "https://www.alberta.ca/residential-access-modification-program",
    detail: {
      about:
        "A provincial grant for permanent modifications that let you enter and move within your own living space. RAMP pays up to \$12,000 per person each benefit year, which runs April 1 to March 31, and up to \$24,000 per person within 10 years. You may be eligible if you are an Albertan of any age who uses a wheelchair, a senior (65+) who uses a 4-wheel walker on an ongoing basis, or living with a progressive neuro-degenerative disease including multiple sclerosis, muscular dystrophy, ALS, COPD, Parkinson's disease, Alzheimer's disease, spina bifida, spinal cord injuries or non-recovering stroke. You must be a Canadian citizen or permanent resident who has lived in Alberta for 90 continuous days, and your family income must be within the RAMP table — from \$36,900 for a single adult to \$94,500 for a couple with five children, plus \$7,131 when a child permanently uses a wheelchair. Alberta notes that exceptions may apply when income is within \$1,200 of the threshold.",
      aboutList: { lead: "A provincial grant for permanent modifications that let you enter and move within your own living space.", items: ["RAMP pays up to $12,000 per person each benefit year, which runs April 1 to March 31, and up to $24,000 per person within 10 years.", "You may be eligible if you are an Albertan of any age who uses a wheelchair, a senior (65+) who uses a 4-wheel walker on an ongoing basis, or living with a progressive neuro-degenerative disease including multiple sclerosis, muscular dystrophy, ALS, COPD, Parkinson's disease, Alzheimer's disease, spina bifida, spinal cord injuries or non-recovering stroke.", "You must be a Canadian citizen or permanent resident who has lived in Alberta for 90 continuous days, and your family income must be within the RAMP table — from $36,900 for a single adult to $94,500 for a couple with five children, plus $7,131 when a child permanently uses a wheelchair.", "Alberta notes that exceptions may apply when income is within $1,200 of the threshold."] },
      steps: [
        "Read the RAMP Guidelines and Criteria document before starting; Alberta says incomplete applications will not be processed.",
        "Complete the RAMP Application Checklist, the RAMP Application Form and the RAMP Modification Recommendation Form.",
        "Add any conditional forms that apply to you — Landlord Agreement, Band Council Resolution, Sponsor Income Verification, or Disclosure Consent.",
        "Mail the complete package to RAMP, Assisted Living and Social Services, PO Box 808 Edmonton Main, Edmonton, AB T5J 2L4, or use the email address on the RAMP page.",
      ],
      documents: [
        "RAMP Application Checklist, Application Form and Modification Recommendation Form",
        "Proof of Canadian citizenship or permanent residence, and of 90 continuous days in Alberta",
        "Family income verification for your household size",
        "Any conditional form that applies: Landlord Agreement, Band Council Resolution, Sponsor Income Verification, or Disclosure Consent",
      ],
      tips: [
        "Tell RAMP if you are waiting for hospital discharge or are in palliative care. Alberta gives those applications priority.",
        "Changes must be permanent. RAMP reviews requests for temporary changes case by case.",
        "There is no appeal process. If you are refused, you can reapply with updated information.",
        "Alberta has said the Guidelines and Criteria document and the Application Form are being updated. Use the current forms on the RAMP page until the new ones appear.",
      ],
      time: "Alberta says you should receive a decision letter in the mail within 30 days of applying.",
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
    requires: ["ab", "abPlacardMobility", "certifier"],
    note:
      "You may be eligible if you can't walk more than 50 metres (164 feet). You may also be eligible if a loss of vision greatly limits your safe and independent mobility in parking areas.",
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
        "You don't need to own a vehicle. The placard belongs to you, not a car.",
        "A physician, occupational therapist, physiotherapist, surgeon, podiatrist, nurse practitioner or chiropractor can complete the medical section.",
      ],
      time: "Issued at the registry, often same-day.",
      phone: "Any Alberta registry agent",
    },
  },
  {
    id: "ab-service-dog-id-card",
    name: "Alberta Service Dog Identification Card",
    level: "Alberta",
    category: "Daily living supports",
    amount: "No fee to apply",
    summary:
      "The provincial identification card for a qualified service dog team in Alberta. There is no fee, and the card is mailed in about two weeks.",
    requires: ["ab", "abServiceDogQualified"],
    eligibility: {
      mode: "any",
      items: [
        "Your service dog passed an assessment from one of Alberta's approved service dog providers.",
        "Your service dog graduated from a program accredited by Assistance Dogs International.",
        "Your service dog was qualified by an organization contracted by a provincial or territorial government in Canada to train or assess service dogs to standards equivalent to the Alberta Training Standard.",
      ],
    },
    note:
      "The card has an expiration date. Check it and renew before it ends. The Alberta.ca identification card page does not explain how to renew. Call the Service Dog Assessment team at 780-427-9136. In Alberta, dial 310-0000 first, before the phone number, to call toll free.",
    requiresNote:
      "Your service dog must have passed an assessment from one of Alberta's approved service dog providers, graduated from a program accredited by Assistance Dogs International, or been qualified by an organization contracted by a provincial or territorial government in Canada to train or assess service dogs to standards equivalent to the Alberta Training Standard.",
    applyUrl: "https://servicedogs.alberta.ca/",
    source: "https://www.alberta.ca/service-dog-identification-card",
    detail: {
      about:
        "Each card shows the handler's name, the dog's name, photos, a validation number and an expiration date. You apply online through the Service Dogs Portal, or you can ask the Service Dog Assessment team for a form. There is no fee, and the official identification card is mailed in approximately two weeks. Alberta.ca says qualified service dog teams must have the card to ensure access to public places, and that it verifies you and your service dog have protected public access rights in Alberta. Carry it with you at all times when in public.",
      aboutList: { lead: "Each card shows the handler's name, the dog's name, photos, a validation number and an expiration date.", items: ["You apply online through the Service Dogs Portal, or you can ask the Service Dog Assessment team for a form.", "There is no fee, and the official identification card is mailed in approximately two weeks.", "Alberta.ca says qualified service dog teams must have the card to ensure access to public places, and that it verifies you and your service dog have protected public access rights in Alberta. Carry it with you at all times when in public."] },
      steps: [
        "Make sure your dog has qualified by one of the three accepted routes: an assessment from one of Alberta's approved service dog providers, graduation from a program accredited by Assistance Dogs International, or qualification by an organization contracted by a provincial or territorial government in Canada to standards equivalent to the Alberta Training Standard",
        "Take one photo that clearly shows you and your service dog, with no other dogs or people in it",
        "Apply online at the Service Dogs Portal, servicedogs.alberta.ca, or contact the Service Dog Assessment team to request a form",
        "Wait about two weeks for the card to arrive in the mail",
      ],
      documents: [
        "One photo showing you and your service dog clearly, submitted in PDF format",
        "The photo must be close-up portrait format, taken from a minimum of 6 feet away, with you facing the camera and your face clear and visible",
        "Your dog's head and your head should be at approximately the same level in the photo",
      ],
      tips: [
        "The photo rules are specific and easy to get wrong. Use portrait format, taken from at least six feet away. Your face must be clear and facing the camera. No other people or dogs may be in it. Your dog's head should be at roughly the same height as yours.",
        "The photo has to go in as a PDF, not a JPEG or a phone screenshot.",
        "If you would rather use paper, phone the Service Dog Assessment team at 780-427-9136. In Alberta, dial 310-0000 before the phone number to call toll free. Ask for a form.",
      ],
      time: "The card is mailed in approximately 2 weeks.",
    },
  },
  {
    id: "ab-capcc",
    name: "Community Access for People in Continuing Care (CAPCC)",
    level: "Alberta",
    category: "Daily living supports",
    amount: "Support from a community access coordinator and an individual service plan",
    summary:
      "Help for adults with disabilities in facility-based continuing care in Alberta. It helps you take part in your community and feel less lonely. A community access coordinator works with you on an individual service plan.",
    requires: ["ab", "adult", "abCapccContinuingCareHome"],
    eligibility: {
      mode: "all",
      items: [
        "You are an adult Albertan under the age of 65.",
        "You live in a type A or type B continuing care home.",
        "You are able to actively participate in setting and following through with your goals, and to communicate your preferences.",
      ],
    },
    note:
      "Alberta.ca does not publish an application form or a cost for this program. Contact a community access coordinator directly. The program page lists them with phone numbers.",
    requiresNote:
      "You must be an adult Albertan under the age of 65, living in a type A or type B continuing care home, and able to actively participate in setting and following through with your goals and to communicate your preferences.",
    applyUrl: "https://www.alberta.ca/community-access-continuing-care",
    source: "https://www.alberta.ca/community-access-continuing-care",
    detail: {
      about:
        "CAPCC helps adults with disabilities in facility-based continuing care engage with their communities to reduce loneliness and social isolation. A community access coordinator helps you develop an individual service plan built around your own interests, which can include outings with family and friends, volunteer activities, church or spiritual activities, movies and continuing education. The program page lists the community access coordinators as Revolve Home Health Ltd. at 587-971-6779, Taproot Community Support Services at 780-439-5087, Catholic Social Services at 403-967-3533, and Calgary Alternative Support Services Inc. at 403-283-0611.",
      aboutList: { lead: "CAPCC helps adults with disabilities in facility-based continuing care engage with their communities to reduce loneliness and social isolation.", items: ["A community access coordinator helps you develop an individual service plan built around your own interests, which can include outings with family and friends, volunteer activities, church or spiritual activities, movies and continuing education.", "The program page lists the community access coordinators as Revolve Home Health Ltd. at 587-971-6779, Taproot Community Support Services at 780-439-5087, Catholic Social Services at 403-967-3533, and Calgary Alternative Support Services Inc. at 403-283-0611."] },
      steps: [
        "Check that you are an adult Albertan under 65 living in a type A or type B continuing care home",
        "Find your nearest community access coordinator from the list on the program page",
        "Contact that coordinator directly, since Alberta.ca does not publish an application form for this program",
        "Work with the coordinator to build an individual service plan around your own interests",
      ],
      documents: [
        "Alberta.ca does not publish a document list for this program, so ask the community access coordinator what they need",
      ],
      tips: [
        "This is one of the few supports aimed at isolation, not money or equipment. That is why it is easy to miss.",
        "It is limited to type A and type B continuing care homes. Supportive living and long-term care are not listed on the program page.",
        "The under-65 limit is unusual for a continuing care program. Confirm it before you spend time on this one.",
      ],
      time: "Alberta.ca does not publish a timeline; ask the coordinator when you contact them.",
    },
  },
  {
    id: "ab-special-needs-housing",
    name: "Special Needs Housing",
    level: "Alberta",
    category: "Daily living supports",
    amount: "Subsidized housing; no rent formula is published for this program type",
    summary:
      "Subsidized provincial housing for people with special housing needs. This includes people with developmental disabilities and people with physical challenges. There is no central application. Find a local housing provider and apply to them directly.",
    requires: ["ab", "abSpecialNeedsHousingStatus", "abSpecialNeedsHousingPlacement"],
    eligibility: {
      mode: "all",
      items: [
        "You have special housing needs. This includes people with developmental disabilities, people with physical challenges, victims of family violence, wards of the provincial government, the hard-to-house, and any other group with special housing needs.",
        "Your income is below the local income limits as determined by the market for your community.",
        "You are a Canadian citizen or permanent resident, a refugee sponsored by the Government of Canada, or a privately sponsored refugee whose sponsorship has broken down. Evacuees from Ukraine with a Canada-Ukraine Authorization for Emergency Travel are eligible to apply. Some housing providers may have additional eligibility criteria.",
      ],
    },
    note:
      "Applications are not centralized. Use the Find Housing tool to see what is available. Then contact the local housing provider for their application. Income limits are set community by community. Alberta.ca does not publish a single figure. Check the limit where you live instead of assuming.",
    requiresNote:
      "Special Needs Housing is for individuals who have special housing needs, including people with developmental disabilities, people with physical challenges, victims of family violence, wards of the provincial government, the hard-to-house, and any other group with special housing needs. You must have an income below the local income limits as determined by the market for your community, and be a Canadian citizen or permanent resident, a refugee sponsored by the Government of Canada, or a privately sponsored refugee whose sponsorship has broken down. Evacuees from Ukraine with a Canada-Ukraine Authorization for Emergency Travel are eligible to apply. Some housing providers may have additional eligibility criteria.",
    applyUrl: "https://findhousing.alberta.ca/",
    source: "https://www.alberta.ca/affordable-housing-programs",
    detail: {
      about:
        "Special Needs Housing is one of four provincial affordable housing program types, alongside Community Housing, Seniors apartments and Seniors Lodge. It serves individuals who have special housing needs and may include support services for residents. Applying takes three steps: use the Find Housing tool to see which options are available to meet your needs, choose a local housing provider offering a program that suits your situation, then contact that provider directly for their application. Alberta.ca states a rent formula for Community Housing (30% of a household's total annual income, non-senior household) and for Seniors apartments (30% of a household's adjusted income). It does not state one for Special Needs Housing. The requirement to be functionally independent is stated for the seniors programs. Alberta.ca refers to an income thresholds document rather than publishing a single income limit.",
      aboutList: { lead: "Special Needs Housing is one of four provincial affordable housing program types, alongside Community Housing, Seniors apartments and Seniors Lodge.", items: ["It serves individuals who have special housing needs and may include support services for residents.", "Applying takes three steps: use the Find Housing tool to see which options are available to meet your needs, choose a local housing provider offering a program that suits your situation, then contact that provider directly for their application.", "Alberta.ca states a rent formula for Community Housing (30% of a household's total annual income, non-senior household) and for Seniors apartments (30% of a household's adjusted income). It does not state one for Special Needs Housing.", "The requirement to be functionally independent is stated for the seniors programs.", "Alberta.ca refers to an income thresholds document rather than publishing a single income limit."] },
      steps: [
        "Use the Find Housing tool at findhousing.alberta.ca and answer its questions",
        "Look through the options it displays and choose a local housing provider offering a program that suits your situation",
        "Contact that provider directly to get and submit their application",
        "Check the income limit for your own community, because limits are set locally rather than province-wide",
      ],
      documents: [
        "Alberta.ca does not publish a province-wide document list, so ask the local housing provider what their application requires",
      ],
      tips: [
        "There is no single provincial application, so different providers may ask for different things. A housing operator may keep a waitlist when there are no current vacancies. Ask each provider how its list works.",
        "Alberta publishes rent formulas for Community Housing and Seniors apartments. For Community Housing, rent is 30% of a household's total annual income (non-senior household). For Seniors apartments, it is 30% of a household's adjusted income. No formula is stated for Special Needs Housing, so ask the provider how rent is worked out.",
        "Special Needs Housing may include support services for residents. Ask what support comes with the unit. Do not assume it is housing only.",
      ],
      time: "Alberta.ca does not publish a wait time. Each housing operator may keep a waitlist when there are no current vacancies.",
    },
  },

  /* ------------------------------------------------------------- MUNICIPAL */
  {
    id: "calgary-fair-entry",
    name: "Calgary Fair Entry — Transit & Recreation",
    level: "Calgary",
    category: "Getting around & recreation",
    amount: "Transit pass $6.30–$63/month by income band + lower-cost recreation",
    summary:
      "One application gets you a low-income monthly transit pass and lower-cost City of Calgary pools, fitness and recreation programs.",
    requires: ["calgary", "lowIncome"],
    note:
      "Apply once through Fair Entry. The transit pass has three 2026 income bands: $6.30, $44.10 or $63.00 per month.",
    applyText: "Apply through Calgary Fair Entry",
    applyUrl: "https://www.calgary.ca/social-services/low-income/fair-entry-subsidy.html",
    source: "https://www.calgary.ca/social-services/low-income/fair-entry-subsidy.html",
    detail: {
      about:
        "A single City of Calgary application ('Fair Entry') that qualifies you for several low-income discounts at once — the sliding-scale monthly transit pass and lower-cost recreation admission and programs. Calgary does not publish a fixed percentage for recreation fee assistance.",
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
        "One approval covers transit and recreation. You do not apply separately.",
        "The transit pass price changes with income. There are three 2026 bands: $6.30, $44.10 or $63.00 per month.",
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
    amount: "Reduced-cost monthly Arc transit card ($35 or $50 a month, depending on household income) + Leisure Access Pass",
    summary:
      "A subsidized monthly Arc transit card plus reduced-cost access to City of Edmonton recreation facilities.",
    requires: ["edmonton", "lowIncomeOrDisabilityIncome"],
    note:
      "You may be eligible if your household income is at or under the City's limits. The limits depend on household size. You may also be eligible if you get AISH or CPP Disability Benefits, among other programs the City lists. Use the City's eligibility questions to check.",
    applyText: "Open the official page on edmonton.ca",
    applyUrl: "https://www.edmonton.ca/ets/fare-assistance",
    source: "https://www.edmonton.ca/ets/fare-assistance",
    detail: {
      about:
        "City of Edmonton programs that give lower-income residents a discounted monthly transit pass (the Ride Transit Program) and reduced-cost recreation access (the Leisure Access Program).",
      steps: [
        "Complete the Leisure Access / Ride Transit application.",
        "Include proof of income or proof you receive AISH / CPP-D.",
        "Once approved, buy your reduced-cost monthly Arc card (the City lists $35 or $50 a month depending on household income) and use your Leisure Access pass.",
      ],
      documents: [
        "Proof of income or AISH / CPP-D statement",
        "Edmonton address",
      ],
      tips: [
        "Use the City's eligibility questions to check the Ride Transit Program and/or the Leisure Access Pass.",
        "If you get AISH or CPP Disability Benefits, the City's eligibility check says you may be eligible without meeting the income limit.",
      ],
      time: "Approximately 8 to 12 weeks for approval. If you ask for your Arc card by mail, allow up to 10 more business days; you can pick it up in person instead.",
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
     gives eligible residents free local fares. Assuming they all work like Calgary's
     Fair Entry would have sent people to the wrong program. */
  {
    id: "reddeer-fee-assistance",
    name: "Red Deer Transit & Recreation Fee Assistance",
    level: "Red Deer",
    category: "Getting around & recreation",
    amount: "$34/month transit pass + up to $200/year per eligible person for recreation programs (pending available funding)",
    summary:
      "A reduced monthly transit pass plus help with City recreation fees. If you are on AISH, you may automatically qualify when you show the City your documents.",
    requires: ["reddeer", "lowIncomeOrDisabilityIncome"],
    note:
      "If you're on AISH or Income Support, you may automatically qualify when you provide the listed document. You may not need to send a Notice of Assessment. The transit pass is a permanent program (not a pilot). Both programs need renewing each year.",
    applyText: "Open the official page on reddeer.ca",
    applyUrl:
      "https://www.reddeer.ca/city-services/transit/fares-and-passes/transit-fare-assistance-pass/",
    source:
      "https://www.reddeer.ca/recreation-and-culture/recreation/facility-admission-fees--pass-prices/fee-assistance-program/",
    detail: {
      about:
        "Two City of Red Deer programs. The Transit Fare Assistance Pass drops a monthly pass to $34 no matter which type you'd normally buy (regular passes run $62–$75). The Recreation Fee Assistance Program adds a Recreation Pass Card for drop-in use plus, pending available funding, up to $200 a year per eligible person toward Safe & Healthy Communities program registrations.",
      aboutList: { lead: "Two City of Red Deer programs.", items: ["The Transit Fare Assistance Pass drops a monthly pass to $34 no matter which type you'd normally buy (regular passes run $62–$75).", "The Recreation Fee Assistance Program adds a Recreation Pass Card for drop-in use.", "Plus, pending available funding, up to $200 a year per eligible person toward Safe & Healthy Communities program registrations."] },
      steps: [
        "Apply online for Recreation Fee Assistance, or for the Transit Fare Assistance Pass — being approved for recreation also qualifies you for transit.",
        "If you're on AISH, Income Support or Guaranteed Income Supplement, provide that document — the City says you may automatically qualify.",
        "Otherwise attach your CRA Notice of Assessment so they can check you against the low-income line.",
        "Allow up to 10 business days (recreation applications may take longer due to high volume), then buy the $34 pass.",
        "Re-apply every year — approval expires.",
      ],
      documents: [
        "Proof you're on AISH / Income Support / GIS — or a CRA Notice of Assessment",
        "Government-issued ID, and proof of residence if your ID does not show your current Red Deer address",
      ],
      tips: [
        "One application can cover both. Being approved for Recreation Fee Assistance is itself a way to qualify for the transit pass.",
        "Recreation funding is 'pending available funding'. Apply early in the year, not late.",
        "Sorensen Station staff will help you apply in person if the online form is hard to use.",
      ],
      time: "Transit pass: up to 10 business days. Recreation: the City says processing may take over 10 business days due to high volume.",
      phone: "Fee Assistance Program: 403-309-8411 (or feeassistance@reddeer.ca)",
    },
  },
  {
    id: "lethbridge-fee-assistance",
    name: "Lethbridge Fee Assistance Program",
    level: "Lethbridge",
    category: "Getting around & recreation",
    amount: "3 months of bus passes for the price of 1 (you pay for one month, two are free) + up to $150 per person per season toward one recreation or culture program, while funds are available",
    summary:
      "One City program covers transit, Access-A-Ride paratransit, and recreation fees. Each has a separate application form. AISH counts as proof of income.",
    requires: ["lethbridge", "lowIncomeOrDisabilityIncome"],
    note:
      "This is the only one of these city programs that also helps pay for paratransit (Access-A-Ride). This is worth knowing if you can't use a regular bus.",
    applyText: "Open the official page on lethbridge.ca",
    applyUrl:
      "https://www.lethbridge.ca/community-services-supports/community-social-development-csd/fee-assistance-program/",
    source:
      "https://www.lethbridge.ca/community-services-supports/community-social-development-csd/fee-assistance-program/",
    detail: {
      about:
        "A single City of Lethbridge program covering three things: bus passes (you pay for one month and get the next two free), Access-A-Ride paratransit at one-third of the usual cost, and recreation or culture programs.",
      steps: [
        "Apply online using the Fee Assistance application form for what you need (recreation and culture, bus pass, or Access-A-Ride), or call 311 for help.",
        "Send your AISH statement as proof of income — it's on their accepted list, so you don't need a Notice of Assessment.",
        "Choose what you need: bus pass, Access-A-Ride, recreation, or more than one — each has its own form.",
        "Buy your one paid month of bus pass and the next two come free.",
      ],
      documents: [
        "AISH statement — or a CRA Notice of Assessment, Alberta Works letter, housing authority letter, or a letter from a Registered Social Worker",
        "Proof of a Lethbridge address",
      ],
      tips: [
        "A letter from a Registered Social Worker is accepted on its own. This helps if your paperwork is a mess or your income is hard to document.",
        "Recreation funding has a limit per season. Claim it in a season when a program costs more.",
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
    amount: "up to 75% off transit (up to $630/yr per person) + up to $200/yr per person for City recreation, and a separate up to $200/yr per person for Esplanade education programs",
    summary:
      "One application, valid up to two years, for cheaper transit passes plus recreation and Esplanade education programs.",
    requires: ["medicinehat", "lowIncomeOrDisabilityIncome"],
    note:
      "Approval lasts up to two years, so you renew less often than with most programs here. A copy of your current AISH Health Benefits Card is accepted as proof.",
    applyText: "Open the application form on medicinehat.ca",
    applyUrl: "https://forms.medicinehat.ca/Community-Development/Fair-Entry-Application",
    source:
      "https://www.medicinehat.ca/community-support-culture-safety/community-support/fair-entry/",
    detail: {
      about:
        "The City of Medicine Hat's single low-income access program. It can take up to 75% off age-appropriate monthly transit passes (to an annual maximum of $630 subsidy per person). It gives each approved person up to $200 a year for regular-priced City recreation programs and admissions at City-run pools and leisure centres, plus a separate up to $200 a year for Esplanade education programs provided directly by Esplanade staff, at 75% off.",
      aboutList: {
        lead: "The City of Medicine Hat's single low-income access program has separate subsidies for each service area.",
        items: [
          "Transit: up to 75% off age-appropriate monthly passes, to an annual maximum of $630 subsidy per person.",
          "City recreation: up to $200 a year per approved person, at 75% off.",
          "Eligible recreation: regular-priced City programs and admissions at City-run pools and leisure centres.",
          "Esplanade: a separate up to $200 a year per approved person, at 75% off.",
          "Eligible Esplanade programs: education provided directly by Esplanade staff.",
        ],
      },
      steps: [
        "Fill in the Fair Entry application online, or call 403-502-8001.",
        "Attach a copy of your current AISH Health Benefits Card — it's accepted as proof of income. Provide a document for each household member aged 18 or older.",
        "Add proof of a Medicine Hat address.",
        "Your application should be processed within two weeks, but approval depends on the information you provide, and missing information may delay it.",
      ],
      documents: [
        "A copy of your current AISH Health Benefits Card — or another accepted proof of income from the City's list (for example a CRA Notice of Assessment or an Alberta Works document). Provide a document for each household member aged 18 or older.",
        "A letter from a social worker or support staff is accepted only when no other documents are available. It must be dated within the last 30 days and come from someone you have a current relationship with.",
        "The letter must state the length of the relationship, that the writer is aware of the Low Income Eligibility, and that your household meets the eligibility requirements.",
        "Proof of a Medicine Hat address",
      ],
      tips: [
        "List every family member on the one application. Each approved person gets their own $200 recreation subsidy.",
        "Approval is good for up to two years. Note the expiry date in your calendar, so you know when to re-apply.",
      ],
      time: "Processed within two weeks; missing information may delay approval.",
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
      "If you're on AISH, a monthly Grande Prairie transit pass costs $10.25 instead of $74.25. This is the deepest municipal transit discount in the province that we've found.",
    requires: ["grandeprairie", "municipalProgramEligibility"],
    note:
      "Important: AISH and ADAP recipients are not part of the general Transit Access Program. You get your own, cheaper pass instead ($10.25 vs $37.13). Ask for the AISH pass by name at City Hall.",
    applyText: "Open the official page on cityofgp.com",
    applyUrl: "https://cityofgp.com/roads-transportation/public-transit/fares-superpass",
    source: "https://cityofgp.com/roads-transportation/public-transit/transit-access-program",
    detail: {
      about:
        "Grande Prairie prices a monthly transit SUPERPASS at $10.25 for AISH recipients, against $74.25 at the regular adult rate. It's separate from the city's general low-income Transit Access Program, which AISH recipients are explicitly excluded from — because this is the better deal. The Recreation Access Program is a separate application giving 75% off memberships, punch passes and registered programs.",
      aboutList: { lead: "Grande Prairie prices a monthly transit SUPERPASS at $10.25 for AISH recipients, against $74.25 at the regular adult rate.", items: ["It's separate from the city's general low-income Transit Access Program, which AISH recipients are explicitly excluded from — because this is the better deal.", "The Recreation Access Program is a separate application giving 75% off memberships, punch passes and registered programs."] },
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
        "Don't let anyone put you in the Transit Access Program instead. It is a 50% discount ($37.13), and the AISH pass is $10.25. Say 'AISH pass' clearly.",
        "The Recreation Access Program uses a higher income line than most (the low-income cut-off plus 30%). Apply even if you've been refused elsewhere.",
      ],
      time: "Same day in person; about 2 days online.",
      phone: "City of Grande Prairie: 780-538-0300 or 311",
    },
  },
  {
    "id": "stalbert-subsidy",
    "name": "St. Albert Transit & Recreation Subsidy",
    "level": "St. Albert",
    "category": "Getting around & recreation",
    "amount": "Free local fares within St. Albert + free annual recreation membership for AISH and ADAP recipients",
    "summary": "St. Albert's subsidy gives eligible residents free local fares within St. Albert and free local Handibus tickets for approved riders. AISH and ADAP recipients are eligible for a free annual membership at City-run recreation facilities.",
    "requires": [
      "stalbert",
      "municipalProgramEligibility"
    ],
    "note": "AISH and ADAP recipients are eligible for a free annual recreation membership. The City's page also says your total annual household income (before taxes) must be within the low-income limits set by Statistics Canada. It does not say whether that rule applies to AISH or ADAP recipients, so confirm with the City.",
    "applyText": "Open the official page on stalbert.ca",
    "applyUrl": "https://stalbert.ca/city/fcss/programs-services/subsidy/",
    "source": "https://stalbert.ca/city/fcss/programs-services/subsidy/",
    "detail": {
      "about": "St. Albert's Family and Community Support Services runs one subsidy covering transit and recreation. For eligible residents: free local fares within St. Albert; free local tickets for approved Handibus riders for travel within St. Albert; 65% off monthly adult commuter fares for travel between St. Albert and Edmonton; AISH and ADAP recipients are eligible for a free annual membership at City-run recreation facilities, including Servus Credit Union Place, Fountain Park Recreation Centre and Grosvenor Outdoor Pool.",
      "aboutList": {
        "lead": "St. Albert's Family and Community Support Services runs one subsidy covering transit and recreation. For eligible residents:",
        "items": [
          "Free local fares within St. Albert",
          "Free local tickets for approved Handibus riders for travel within St. Albert",
          "65% off monthly adult commuter fares for travel between St. Albert and Edmonton",
          "AISH and ADAP recipients are eligible for a free annual membership at City-run recreation facilities, including Servus Credit Union Place, Fountain Park Recreation Centre and Grosvenor Outdoor Pool"
        ]
      },
      "steps": [
        "Fill in the subsidy application on the City's subsidy page.",
        "Say that you receive AISH or ADAP — AISH and ADAP recipients are eligible for the free annual recreation membership.",
        "If you use the Handibus, ask about approved-rider status at the same time.",
        "Call 780-459-1756 if you get stuck."
      ],
      "documents": [
        "Proof you receive AISH or ADAP",
        "Proof of a St. Albert address"
      ],
      "tips": [
        "You can't claim this if another source already funds the same thing. If a program already pays your bus fare, sort that out first.",
        "The commuter fare between St. Albert and Edmonton is separate from free local fares. Ask about both if you travel in."
      ],
      "time": "Allow a couple of weeks.",
      "phone": "St. Albert FCSS: 780-459-1756"
    }
  },
  {
    "id": "strathcona-subsidy",
    "name": "Strathcona County Everybody Rides & Everybody Gets to Play",
    "level": "Sherwood Park",
    "category": "Getting around & recreation",
    "amount": "Reduced transit fare cap + free annual Active Pass+",
    "summary": "Reduced transit fares on your Arc card and a no-cost annual Active Pass+ for County recreation facilities, for residents on a limited income.",
    "requires": [
      "strathcona",
      "lowIncomeOrDisabilityIncome"
    ],
    "note": "These programs are based on income, not disability. The income line is roughly $33,675/year for one person. AISH is below that, so it's worth applying.",
    "applyText": "Open the official page on strathcona.ca",
    "applyUrl": "https://www.strathcona.ca/community-families/affordable-services/subsidized-fares/",
    "source": "https://www.strathcona.ca/community-families/affordable-services/",
    "detail": {
      "about": "Two Strathcona County programs. Everybody Rides puts a reduced monthly fare cap on your Arc card profile for local and commuter travel. Everybody Gets to Play gives a free annual Active Pass+ for County recreation facilities plus reduced fees on programs.",
      "steps": [
        "Call Family and Community Services at 780-464-4044, or go to 401 Festival Lane (Community Centre, 2nd floor).",
        "Bring ID, proof you live in the County, and your Notice of Assessment (see the documents list for the exceptions).",
        "Ask about both programs in the one visit — they're separate but handled by the same team."
      ],
      "documents": [
        "Photo ID",
        "Proof of a Strathcona County address",
        "Notice of Assessment (NOA) from the Canada Revenue Agency — a 2025 NOA is required starting June 1, 2026, and a 2024 NOA is no longer accepted",
        "If your NOA no longer reflects your current finances, bring 3 months of bank statements as well",
        "New refugee or permanent resident in the first year with no NOA: 3 months of bank statements from a Canadian bank"
      ],
      "tips": [
        "The County raised its income limits. A refusal from years ago is not a reason to skip re-applying.",
        "Everybody Rides works by changing the fare cap on your Arc card. You keep using the same card."
      ],
      "time": "Ask when you apply — it isn't published.",
      "phone": "Family and Community Services: 780-464-4044"
    }
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
      "Airdrie checks your household income against its limits. The page does not say that being on AISH qualifies you automatically. An AISH or ADAP form showing your eligibility period is one of the accepted proof-of-income documents. AISH/ADAP recipients get a two-year term instead of one year.",
    applyText: "Open the official page on airdrie.ca",
    applyUrl: "https://www.airdrie.ca/index.cfm?serviceID=2414",
    source: "https://www.airdrie.ca/index.cfm?serviceID=2157",
    detail: {
      about:
        "The City of Airdrie's single low-income subsidy (formerly the Airdrie Participant Support Program). One application covers transit passes and Genesis Place recreation admissions, passes and registered programs. The discount is tiered: 75%, 50% or 25% depending where your household income falls against the low-income cut-off before tax.",
      aboutList: { lead: "The City of Airdrie's single low-income subsidy (formerly the Airdrie Participant Support Program).", items: ["One application covers transit passes and Genesis Place recreation admissions, passes and registered programs.", "The discount is tiered: 75%, 50% or 25% depending where your household income falls against the low-income cut-off before tax."] },
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
        "Income up to 25% above the low-income cut-off still gets you the 25% tier. Don't assume you earn too much.",
        "If you use Access Airdrie (paratransit), ask whether your subsidy applies to it. The program page doesn't say either way, so check.",
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
      "A $10 monthly transit pass, 75% off specialized SMART Bus passes, and 60% off regional recreation memberships through a community partner.",
    requires: ["woodbuffalo", "lowIncomeOrDisabilityIncome"],
    note:
      "This is one of only two municipal programs here that discount specialized (door-to-door) transit. The other is Lethbridge's Access-A-Ride. Your AISH statement is accepted as proof of income.",
    applyText: "Open the application form on rmwb.ca",
    applyUrl: "https://forms.rmwb.ca/Community-Services/LIFT-Program-Application",
    source: "https://www.rmwb.ca/LIFT",
    detail: {
      about:
        "The Regional Municipality of Wood Buffalo's Low-Income Fare Transit program: a monthly conventional transit pass for $10, and 75% off 10- and 25-ride passes for the SMART Bus (the specialized service for seniors and people with mobility needs). Everyone in the household is covered by the one application. The Wood Buffalo Recreation Support Program is a separate program that gives 60% off memberships at Syncrude Sport and Wellness Centre, Regional Recreation Corporation facilities and Vista Ridge. The LIFT page says only one application is required to assess eligibility for these community partner discounts.",
      aboutList: { lead: "The Regional Municipality of Wood Buffalo's Low-Income Fare Transit program: a monthly conventional transit pass for $10, and 75% off 10- and 25-ride passes for the SMART Bus (the specialized service for seniors and people with mobility needs).", items: ["Everyone in the household is covered by the one application.", "The Wood Buffalo Recreation Support Program is a separate program that gives 60% off memberships at:", "Syncrude Sport and Wellness Centre, Regional Recreation Corporation facilities and Vista Ridge.", "The LIFT page says only one application is required to assess eligibility for these community partner discounts."] },
      steps: [
        "Apply online for LIFT, or email community.services@rmwb.ca, or apply in person.",
        "Send your AISH statement as proof of income — it's accepted.",
        "You will be notified within 7–10 business days if you submit a complete application.",
        "For SMART Bus, buy the discounted 10- or 25-ride passes directly from the operator once you're approved.",
        "Ask the City or the Recreation Support Program how to claim the 60% recreation discount once you are approved; the LIFT page says one application assesses eligibility.",
      ],
      documents: [
        "AISH statement (or other proof of household income)",
        "Proof of a Wood Buffalo address",
      ],
      tips: [
        "The income line here is high: about $35,500 for one person, well above AISH.",
        "One application covers your partner and dependent children too, not just you.",
        "Call Pulse on 780-743-7000 if anything about the form is unclear.",
        "You must be 18 or older to apply (people under 18 who live independently may be considered)",
      ],
      time: "Notification within 7–10 business days of a complete application.",
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
    applyText: "Open the official page on sprucegrove.org",
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
    amount: "Half-price monthly bus pass of your choice (local, commuter or LATS)",
    summary: "Financial-navigation support that can provide a half-price monthly bus pass. You choose a local, commuter or LATS pass. The Recreation Assistance Program is now closed. It will reopen for new applications in January 2027.",
    requires: ["leduc", "lowIncome"],
    note: "Leduc lists half-price monthly bus passes. You can choose a local, commuter or LATS monthly pass. All Recreation Assistance Program funding for 2026 has been fully allocated. The program is now closed and will reopen for new applications in January 2027.",
    applyText: "Contact Leduc FCSS about subsidies",
    applyUrl: "https://www.leduc.ca/community/family-community-support-services/housing-financial-support",
    source: "https://www.leduc.ca/community/family-community-support-services/housing-financial-support",
    detail: {
      about: "Leduc Family and Community Support Services can help qualifying residents access a half-price monthly bus pass as part of its housing and financial-navigation support. The Recreation Assistance Program is now closed and will reopen for new applications in January 2027.",
      steps: ["Contact Leduc FCSS for a financial-navigation appointment.", "Ask about the transit subsidy when discussing your situation. Ask when the Recreation Assistance Program reopens.", "Follow their directions for the documents needed to assess eligibility."],
      documents: ["Proof of Leduc residence", "Financial information requested by FCSS"],
      tips: ["You choose a local, commuter or LATS monthly pass. Ask specifically about LATS if you use specialized transit.", "The City’s page describes an assessment. Do not assume you are eligible until FCSS confirms it."],
      time: "Ask FCSS when you contact them.",
    },
  },
  {
    id: "cochrane-connect-card",
    name: "Cochrane Connect Card",
    level: "Cochrane",
    category: "Getting around & recreation",
    amount: "25% off local transit + 50% off SLS Centre monthly passes",
    summary: "A Town card for residents facing financial or situational barriers, with local transit and recreation discounts.",
    requires: ["cochrane", "lowIncome"],
    note: "Cochrane assesses financial and situational need. Book an appointment and bring the requested income and address documents for all adults in the household.",
    applyText: "Open the official page on cochrane.ca",
    applyUrl: "https://www.cochrane.ca/node/241/financial-resources/cochrane-connect-card",
    source: "https://www.cochrane.ca/node/241/financial-resources/cochrane-connect-card",
    detail: {
      about: "The Cochrane Connect Card gives qualifying residents 25% off COLT monthly and 10-ticket transit passes, and 50% off SLS Centre 30-day and monthly passes.",
      steps: ["Book the appointment described on the Town’s Connect Card page.", "Bring proof of income and your Cochrane address for all adults in the household.", "Ask which current transit and SLS Centre discounts the card gives you."],
      documents: ["Proof of income (for all adults in the household)", "Proof of Cochrane address (for all adults in the household)"],
      tips: ["This is not only an income test; the Town also describes situational need.", "Confirm the current eligible passes at your appointment before purchasing."],
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
    requires: ["ab", "okotoksArea", "okotoksResidency", "lowIncome"],
    note: "The Town describes 80% support for most Town programs, passes and admission. Check current exclusions and camp limits before registering.",
    applyText: "Open the official page on okotoks.ca",
    applyUrl: "https://www.okotoks.ca/your-community/social-well-being/family-community-resources/okotoks-family-resource-centre-7",
    source: "https://www.okotoks.ca/your-community/social-well-being/family-community-resources/okotoks-family-resource-centre-7",
    detail: {
      about: "The Town’s Recreation Fee Assistance Program helps qualifying residents afford most Town recreation programs, passes and admission at an 80% discount.",
      steps: ["Read the Town’s current program information and eligibility rules.", "Apply with the income and residence documents requested.", "Check the program period and any limits before registering for an activity."],
      documents: ["Proof of income", "Proof of Okotoks residence"],
      tips: ["The Town also serves eligible Foothills County residents. If that is you, confirm the current boundary rule.", "Ask about exclusions before choosing a camp or program."],
      time: "Ask when you apply.",
    },
  },
  {
    id: "canmore-affordable-services",
    name: "Canmore Affordable Services Program",
    level: "Canmore",
    category: "Getting around & recreation",
    amount: "Discounts on Regional ROAM Transit, recreation and community services",
    summary: "A Town program that gives qualifying residents lower-cost services, including Regional ROAM Transit and recreation.",
    requires: ["canmore", "lowIncome"],
    note: "The Town lists discounts across Regional ROAM Transit, recreation and community services. Transit discount tiers differ, so confirm the current rate for your household.",
    applyText: "Open the official page on canmore.ca",
    applyUrl: "https://www.canmore.ca/your-community/community-supports-and-services/affordable-services-program",
    source: "https://www.canmore.ca/your-community/community-supports-and-services/affordable-services-program",
    detail: {
      about: "Canmore’s Affordable Services Program provides qualifying residents with discounts on Town and community services, including Regional ROAM Transit and recreation.",
      steps: ["Review the Town’s current eligibility and application instructions.", "Apply with the income and residency documents requested.", "Ask which discounts apply to the services you use."],
      documents: ["Proof of income", "Proof of Canmore residence"],
      tips: ["Transit discounts are tiered. The Town page has the current rate.", "Apply before assuming a discount is available for a specific community service."],
      time: "Ask when you apply.",
    },
  },
  {
    id: "lloydminster-recreation-access",
    name: "Lloydminster Recreation Access Program",
    level: "Lloydminster",
    category: "Recreation",
    amount: "$2 adult drop-in admission at City recreation facilities",
    summary: "Income-based recreation access for eligible Lloydminster residents. First Nations, Metis, and/or Inuit applicants do not need to meet the residency requirement. They must still meet the income eligibility.",
    requires: ["lloydminster", "lowIncome"],
    note: "The City lists income-based access to City recreation facilities, including $2 adult drop-in admission. Confirm all current discounts when applying.",
    applyText: "Open the official page on lloydminster.ca",
    applyUrl: "https://www.lloydminster.ca/recreation-culture-community/social-programs-and-services/recreation-access-program/",
    source: "https://www.lloydminster.ca/recreation-culture-community/social-programs-and-services/recreation-access-program/",
    detail: {
      about: "Lloydminster’s Recreation Access Program gives qualifying low-income residents reduced-cost access to City recreation facilities.",
      steps: ["Review the City’s current income criteria and application instructions.", "Apply with the documents the City requests.", "Ask the recreation desk which current facility admissions and passes are covered."],
      documents: ["Proof of household income", "Proof of Lloydminster residence (not required of First Nations, Metis, and/or Inuit applicants, who provide a copy of a Certificate of Indian Status card and/or a Certificate of Treaty Status card, as the page lists)"],
      tips: ["Use the official City page to confirm current rates before you plan around a discount.", "Ask whether your household members can be included in the application."],
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
    requires: ["fortsask", "fortsaskIncomeRoute"],
    note: "The City lists a fully discounted annual multi-facility membership and an Everyone Rides transit subsidy. It also accepts several approved income-support programs. Confirm your route when applying.",
    applyText: "Open the official page on fortsask.ca",
    applyUrl: "https://www.fortsask.ca/recreation-parks/program-registrations-drop-in-classes/access-for-everyone-program/",
    source: "https://www.fortsask.ca/recreation-parks/program-registrations-drop-in-classes/access-for-everyone-program/",
    detail: {
      about: "Fort Saskatchewan’s Access for Everyone Program combines recreation support with the Everyone Rides transit subsidy for eligible residents.",
      steps: ["Review the City’s current eligibility routes and application instructions.", "Apply with proof of limited income or the approved income-support document that applies to you.", "Ask about both the recreation membership and Everyone Rides transit subsidy."],
      documents: ["Proof of Fort Saskatchewan residence", "Proof of income or approved income support"],
      tips: ["The City lists AISH, CPP Disability, FSCD and Income Support as approved programs. Check the current page for full details.", "Ask whether your local or commuter transit trips qualify before buying a pass."],
      time: "Ask when you apply.",
    },
  },
  {
    "id": "local-supports",
    "name": "Local transit & recreation discounts",
    "level": "Your community",
    "category": "Getting around & recreation",
    "amount": "Varies by community",
    "summary": "Many cities and towns run their own low-income or disability discounts on transit passes and recreation. 2-1-1 can help you find yours.",
    "requires": [
      "provinceCovered",
      "cityOther"
    ],
    "note": "Programs are named and run differently in every community. 2-1-1 is a free, confidential service that finds the ones near you.",
    "applyText": "Find supports near me (2-1-1)",
    applyUrl: (a) => TWO_ELEVEN[a.province] || "https://211.ca/",
    source: (a) => TWO_ELEVEN[a.province] || "https://211.ca/",
    "detail": {
      "about": "Beyond the biggest cities, many municipalities offer their own low-income or disability discounts on transit and recreation — but they're all named and delivered differently. 2-1-1 is a free, confidential service that connects you to the specific programs in your community. In most of Canada you can reach it 24 hours a day, in more than 150 languages. In BC, 211 navigators are available 9am to 9pm, Monday to Friday, excluding statutory holidays.",
      "steps": [
        "Visit your provincial 2-1-1 site, or simply dial 2-1-1 from any phone.",
        "Tell them your town and what you need (transit, recreation, financial help).",
        "They can point you to local programs and how to apply."
      ],
      "documents": [
        "Your city or town name",
        "A rough idea of your household income"
      ],
      "tips": [
        "Dialing 2-1-1 is free. In most of Canada it is open 24 hours a day, in many languages. In BC, navigators are available 9am to 9pm on weekdays, excluding holidays.",
        "Also search your town's own website for 'recreation fee assistance' or 'low-income transit pass'."
      ],
      "time": "Immediate — it's an information service.",
      "phone": "Dial 2-1-1"
    }
  },

  /* ---- British Columbia (hidden until BC_ENABLED) ---- */
  {
    "id": "bc-pwd-designation",
    "needsPractitioner": true,
    "name": "Persons with Disabilities (PWD) Designation",
    "level": "British Columbia",
    "category": "Money",
    "amount": "No direct payment on its own. The designation is required to access disability assistance, and a recipient with it may be eligible for higher rates, health supplements, an annual earnings exemption and a bus pass.",
    "summary": "BC's disability status for adults 18 and over with a severe impairment expected to last at least two years. You need it to get disability assistance.",
    "requires": ["bc", "age18plus", "dailyLivingLimit", "bcPwdMedical", "bcPwdDesignationFinancial"],
    eligibility: {
      mode: "all",
      items: [
        "You are 18 or older.",
        "You are financially eligible, or likely to be within six months.",
        "You have a severe mental or physical impairment likely to continue for at least two years that significantly restricts daily living and requires an assistive device, the significant help or supervision of another person, or the services of an assistance animal.",
      ],
    },
    "requiresNote": "You are 18 or older; are financially eligible or likely to be within six months; and have a severe mental or physical impairment likely to continue for at least two years that significantly restricts daily living and requires an assistive device, the significant help or supervision of another person, or the services of an assistance animal.",
    "note": "The test is about what you can do, not your diagnosis. The impairment must directly and significantly restrict your ability to do daily living activities. And you must need an assistive device, the significant help or supervision of another person, or the services of an assistance animal.",
    "applyText": "Start on My Self Serve",
    "applyUrl": "https://myselfserve.gov.bc.ca/",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/pwd-designation-and-application/designation-application",
    "detail": {
      "about": "The standard application is form HR2883. Five prescribed classes can use the prescribed-class application (HR3642) instead: people enrolled in BC PharmaCare Plan P (palliative care); people the Ministry of Children and Family Development has determined to be eligible for the At Home Program; people Community Living BC has determined to be eligible for its supports and services; people determined as disabled by the Government of Canada and eligible for the CPP Disability Benefit or Post-Retirement Disability Benefit; and people designated as a Person with Disabilities by Indigenous Services Canada in the BC region. Prescribed-class applicants must still meet all other eligibility requirements (identification, financial, residency, etc.).",
      "aboutList": {
        "lead": "The standard application is form HR2883. Five prescribed classes can use the prescribed-class application (HR3642) instead:",
        "items": [
          "People enrolled in BC PharmaCare Plan P (palliative care).",
          "People the Ministry of Children and Family Development has determined to be eligible for the At Home Program.",
          "People Community Living BC has determined to be eligible for its supports and services.",
          "People determined as disabled by the Government of Canada and eligible for the CPP Disability Benefit or Post-Retirement Disability Benefit.",
          "People designated as a Person with Disabilities by Indigenous Services Canada in the BC region.",
          "Prescribed-class applicants must still meet all other eligibility requirements (identification, financial, residency, etc.)."
        ]
      },
      "steps": ["Start an assistance application through My Self Serve so the ministry can first check financial eligibility", "Ask the ministry for the PWD designation application (HR2883) after you start the assistance application", "Complete the applicant section, then have a doctor or nurse practitioner complete the medical report", "Have a medical practitioner, nurse practitioner or other prescribed professional complete the assessor report", "Submit all sections and keep a copy; respond if the ministry asks for more information"],
      "documents": ["Identification, income, asset and shelter information for the assistance application", "PWD designation application HR2883", "Medical and functional information describing how the impairment restricts daily living and what help or supervision is required"],
      "tips": ["You can start the PWD application at age 17 and a half. Disability assistance cannot begin before age 18.", "If you are in a prescribed class, ask whether the prescribed-class HR3642 application applies instead of the standard application", "The ministry gives the HR2883 application to people who intend to apply for disability assistance. It is not given out only so people can qualify for other programs.", "Ask each professional to describe your functional restrictions and support needs, not only the diagnosis"],
      "time": "The ministry does not publish one guaranteed decision time",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-fair-pharmacare",
    "name": "Fair PharmaCare",
    "level": "British Columbia",
    "category": "Health",
    "amount": "Income-based drug coverage. Family net income of $13,750 or less: PharmaCare pays 100 percent of eligible costs from the first prescription. Up to $30,000: no deductible, with a family maximum between $100 and $800. Above that a deductible applies, then PharmaCare pays 70 percent, and 100 percent once you reach your family maximum.",
    "summary": "BC's main drug plan for anyone enrolled in MSP. It pays a share of your eligible prescriptions based on family net income. The lower your income, the sooner and the more it pays. Free to register.",
    "requires": ["bc", "bcMsp"],
    amountTiers: {
      caption: "What PharmaCare pays by family net income",
      headers: ["Family net income", "What PharmaCare pays"],
      rows: [
        ["$13,750 or less", "100% of eligible costs from the first prescription"],
        ["Up to $30,000", "No deductible, with a family maximum between $100 and $800"],
        ["Above $30,000", "A deductible applies, then PharmaCare pays 70%, and 100% once you reach your family maximum"],
      ],
    },
    "requiresNote": "Any MSP-enrolled BC resident or family can register. Your assistance level is scaled to family net income from two years earlier, verified with the CRA.",
    "note": "Return the consent form within 30 days of registering. If you do not, temporary coverage ends and your family's deductible is set at $10,000. Also, if you are moving into a long-term care facility, ask whether it is enrolled in PharmaCare Plan B before you move in. Plan B gives permanent residents of enrolled facilities 100% coverage of eligible prescription drugs and pharmacy services. It also covers eligible medical supplies up to a maximum. It is automatic, with no application. But not all facilities are enrolled. It does not apply to assisted-living, extended-care, acute-care or temporary respite or hospice stays.",
    "applyText": "Register online",
    "applyUrl": "https://my.gov.bc.ca/ahdc",
    "source": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/fair-pharmacare-plan",
    "detail": {
      "about": "Assistance is tied to family net income from two years prior and coverage applies automatically at the pharmacy counter. After a family meets its deductible PharmaCare pays 70% of eligible costs, or 75% if a family member was born before 1940. After a family reaches its family maximum, Fair PharmaCare pays 100% of eligible costs for the rest of the year.",
      "aboutList": { "lead": "Assistance is tied to family net income from two years prior and coverage applies automatically at the pharmacy counter.", "items": ["After a family meets its deductible PharmaCare pays 70% of eligible costs, or 75% if a family member was born before 1940.", "After a family reaches its family maximum, Fair PharmaCare pays 100% of eligible costs for the rest of the year."] },
      "steps": ["Gather the Personal Health Number for every family member, Social Insurance Numbers for adults, and the adults' tax information from two years ago", "Register online, or call Health Insurance BC if online registration is not accessible to you", "Use the temporary coverage that begins the same day while income verification is pending", "Sign and return the CRA consent form within 30 days so temporary coverage does not end", "Check your registration status online or call if a pharmacy cannot see the coverage"],
      "documents": ["Personal Health Number for every family member", "Social Insurance Number for each adult", "Line 23600 from each adult's Notice of Assessment from two years ago", "Line 12500 Registered Disability Savings Plan income, if applicable"],
      "tips": ["Registration is free and temporary coverage begins the same day", "The CRA consent deadline matters: return it within 30 days", "If family income has dropped substantially, ask PharmaCare whether an income review is available", "If you or a family member is moving into long-term care, ask whether the facility is registered with PharmaCare Plan B before moving in. Plan B covers 100% of eligible prescription drugs and pharmacy services for permanent residents of registered facilities. It also covers eligible medical supplies up to a maximum price set by PharmaCare. It starts automatically. But not every facility is registered.", "Plan B does not apply to extended-care, acute-care, multi-level or assisted-living facilities. It also does not apply to a short-term stay in a long-term care facility, such as a temporary stay for respite care, hospice or palliative care.", "Since March 1, 2026, PharmaCare's National Pharmacare plan, Plan NP, has covered many diabetes medications, contraceptives and menopausal hormone therapy at no cost to you. Coverage is automatic at the pharmacy. There is nothing to register for and no receipts to submit. You must be a B.C. resident enrolled in MSP, and the prescription must be dispensed in B.C.", "Plan NP prescriptions do not count towards your Fair PharmaCare deductible or family maximum. So they cost you nothing, but they also do not move you closer to meeting your deductible.", "The Plan NP diabetes list includes insulins, metformin, glyburide, gliclazide, dapagliflozin and empagliflozin, and combinations of them. A few others need Special Authority approval before a pharmacy can fill them. These include saxagliptin, linagliptin and pioglitazone. Ask your prescriber.", "On April 1, 2026, Plan NP expanded to cover certain diabetes-related supplies and devices.", "PharmaCare also covers the full cost of nicotine gum, lozenges and patches for one continuous course of up to 12 weeks (84 days) in a calendar year. The allowance resets on January 1. You and the pharmacist both sign a declaration form at the pharmacy, so there is nothing to apply for in advance. You must be enrolled in MSP, but you do not need to be signed up for Fair PharmaCare. Certain prescription stop-smoking drugs are covered instead through Fair PharmaCare or through Plans B, C, G or W."],
      "time": "Temporary coverage begins the day you register; income verification follows",
      "phone": "1-800-663-7100"
    }
  },
  {
    "id": "bc-msp-supplementary-benefits",
    "name": "MSP Supplementary Benefits",
    "level": "British Columbia",
    "category": "Health",
    "amount": "$23 per visit toward acupuncture, chiropractic, massage therapy, naturopathy, physical therapy or non-surgical podiatry, up to a combined 10 visits each calendar year",
    "summary": "Partial MSP coverage for visits to six kinds of practitioners. It is for people who may be eligible, including lower-income B.C. residents and people enroled with MSP through the At Home Program or as Mental Health Clients. Families deemed eligible may also be eligible for the Healthy Kids Program.",
    "requires": ["bc", "bcMsp", "bcSupplementaryBenefitsEligibility"],
    eligibility: {
      mode: "all",
      items: [
        "You (and your spouse, if you have one) are enrolled in MSP.",
        "You may be eligible through your income or through one of the other groups the ministry lists.",
        "You live in B.C., have lived in Canada as a citizen or permanent resident for at least the last 12 months before applying, and are not exempt from paying income tax under another act.",
      ],
      note: {
        lead: "Those who may be eligible include:",
        items: [
          "Adjusted net income last year of less than $42,000 (your family may qualify).",
          "Income Assistance recipients.",
          "Convention refugees.",
          "Inmates of B.C. Correctional Facilities.",
          "People enroled with MSP through the At Home Program.",
          "Residents of long term care facilities receiving the Guaranteed Income Supplement.",
          "People enroled with MSP as Mental Health Clients.",
          "First Nations individuals with valid B.C. Medical Plan coverage through the First Nations Health Authority."
        ],
        after: "Adjusted net income is last year's net income confirmed by CRA — combined with your spouse's if you have one — after certain deductions. There is no cost to apply. Coverage does not apply to treatment received outside British Columbia."
      },
    },
    "requiresNote": "You must be enroled in MSP, and your spouse too if you have one, before Supplementary Benefits can be approved. You may be eligible through your income or through one of the other groups the ministry lists. You live in B.C., have lived in Canada as a citizen or permanent resident for at least the last 12 months before applying, and are not exempt from paying income tax under another act. Those who may be eligible include:\n- Adjusted net income last year of less than $42,000 (your family may qualify).\n- Income Assistance recipients.\n- Convention refugees.\n- Inmates of B.C. Correctional Facilities.\n- People enroled with MSP through the At Home Program.\n- Residents of long term care facilities receiving the Guaranteed Income Supplement.\n- People enroled with MSP as Mental Health Clients.\n- First Nations individuals with valid B.C. Medical Plan coverage through the First Nations Health Authority.\n Adjusted net income is last year's net income confirmed by CRA — combined with your spouse's if you have one — after certain deductions. There is no cost to apply. Coverage does not apply to treatment received outside British Columbia.",
    "note": "The $23 is a contribution, not the full fee — many practitioners are opted out of MSP and are allowed to charge more, and you pay the difference. Ask what the visit costs and what MSP covers before you book. The 10 visits are a combined limit across all six service types, not 10 of each.",
    "applyText": "Apply for Supplementary Benefits",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/benefits/services-covered-by-msp/supplementary-benefits",
    "source": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents/benefits/services-covered-by-msp/supplementary-benefits",
    "detail": {
      "about": "MSP contributes $23 per visit for a combined annual limit of 10 visits each calendar year, for acupuncture, chiropractic, massage therapy, naturopathy, physical therapy and non-surgical podiatry from approved providers. Eligibility is assessed from last year's net income as confirmed by the Canada Revenue Agency, or the combined net income of you and your spouse, less certain deductions. The figure that remains is called adjusted net income, and if it is less than $42,000 your family may qualify. People enroled with MSP through the At Home Program, and people enroled with MSP as Mental Health Clients, may also be eligible. Applying is free, and once approved you generally do not need to reapply while you stay eligible for MSP, because income is re-verified each year automatically. MSP does not cover supplementary benefit services received outside the province.",
      "aboutList": { "lead": "MSP contributes $23 per visit for a combined annual limit of 10 visits each calendar year, for acupuncture, chiropractic, massage therapy, naturopathy, physical therapy and non-surgical podiatry from approved providers.", "items": ["Eligibility is assessed from last year's net income as confirmed by the Canada Revenue Agency, or the combined net income of you and your spouse, less certain deductions.", "The figure that remains is called adjusted net income, and if it is less than $42,000 your family may qualify.", "People enroled with MSP through the At Home Program, and people enroled with MSP as Mental Health Clients, may also be eligible.", "Applying is free, and once approved you generally do not need to reapply while you stay eligible for MSP, because income is re-verified each year automatically.", "MSP does not cover supplementary benefit services received outside the province."] },
      "steps": ["Make sure MSP enrolment is complete for you and your spouse if you have one", "Complete the BC Application for Health and Drug Coverage, which applies for MSP enrolment, Supplementary Benefits and Fair PharmaCare on one form", "Give CRA permission on the application to release your Notice of Assessment so your income can be verified", "If you are newly eligible for MSP, book a B.C. driver licensing office appointment to get your Photo BC Services Card"],
      "documents": ["The BC Application for Health and Drug Coverage", "Your and your spouse's CRA Notice of Assessment or Reassessment information: on the application you give CRA permission to release it; if you apply by mail, include copies with the form", "Your Personal Health Number if you already have one"],
      "tips": ["The 10 visits are a combined limit across all six service types, so they run down together", "$23 is a contribution, not the full fee. Ask the practitioner what you will owe before booking.", "Keep filing your taxes every year. MSP checks your income automatically from your CRA return, and your eligibility may be affected if you do not file.", "Tell MSP if you marry or start living in a marriage-like relationship, because that changes how your income is assessed", "If your children are under 19, families deemed eligible for Supplementary Benefits may be eligible for basic dental treatment, optical care and hearing assistance through the Healthy Kids Program"]
    }
  },
  {
    "id": "bc-pharmacare-plan-c",
    "name": "PharmaCare Plan C (Income & Disability Assistance)",
    "level": "British Columbia",
    "category": "Health",
    "amount": "100% of the cost of eligible drugs and dispensing fees",
    "summary": "Automatic drug coverage from the first dollar if you are on BC income, disability or hardship assistance. PharmaCare pays the full cost of eligible drugs and dispensing fees at the pharmacy counter.",
    "requires": ["bc", "bcAssistanceStatus"],
    "requiresNote": "You are receiving income assistance, disability assistance, hardship assistance or Medical Services Only through the Ministry of Social Development and Poverty Reduction; or you are a child or youth in the care of the Ministry of Children and Family Development or of an Indigenous Governing Body; or you arrived in BC through the Canada-Ukraine authorization for emergency travel.",
    "note": "You cannot be charged for medications or dispensing fees covered by Plan C. Medical devices and supplies are the exception. They are exempt from PharmaCare's Full Payment Policy, so a pharmacy or device provider may charge you above the maximum eligible cost.",
    "applyText": "Automatic — learn more",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/plan-c",
    "source": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/plan-c",
    "detail": {
      "about": "Enrolment in those programs automatically enrols you in Plan C — there is no separate application. It also covers prostheses and orthoses including offloading devices for diabetic foot ulcers, ostomy supplies, and insulin and insulin pumps (insulin pumps need an approved Special Authority request from a doctor).",
      "steps": ["Confirm that your qualifying income, disability, hardship, care or protected status is active with the responsible ministry", "Give the pharmacy your BC Services Card or Personal Health Number so it can check Plan C", "If the status is active but the pharmacy cannot see Plan C, ask the ministry or Health Insurance BC to correct the enrolment", "If you are eligible for Plan C but not yet enrolled and need a prescription urgently, ask the prescriber or pharmacist whether they can request emergency Plan C coverage, which provides up to 48 hours of PharmaCare coverage"],
      "documents": ["BC Services Card or Personal Health Number", "Any recent ministry notice showing the qualifying assistance or care status"],
      "tips": ["There is no separate Plan C application", "Register for Fair PharmaCare as well, so coverage can continue if your assistance status changes", "Ask the pharmacy about any amount before you pay. Covered drugs and dispensing fees should not be charged under Plan C."],
      "time": "Automatic when the qualifying ministry status is active",
      "phone": "1-800-663-7100"
    }
  },
  {
    "id": "bc-pharmacare-plan-g",
    "name": "PharmaCare Plan G (Psychiatric Medications)",
    "level": "British Columbia",
    "category": "Health",
    "amount": "100% of eligible costs for covered psychiatric medications",
    "requires": ["bc", "psychiatricMedicationCandidate", "planGClinicalAndFinancialNeed"],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have both clinical and financial need.",
        "Your physician or nurse practitioner confirms the clinical side, together with your local mental health and substance use location, or the Child and Youth Mental Health team.",
        "Your annual income is lower than $42,000."
      ],
      "note": "If you are eligible, the prescriber submits the Application for PharmaCare Plan G form on your behalf — there is nothing for you to file. The plan covers certain psychiatric medications rather than all of them."
    },
    "summary": "Full coverage of certain psychiatric medications for B.C. residents of any age who have both clinical and financial need. Your prescriber applies for you, and you must renew coverage every year.",
    "note": "Coverage lasts up to one year and stops unless a new application is submitted. Know your renewal date. See a prescriber about a month before it, so your coverage does not lapse while you are still taking the medication.",
    "requiresNote": "You must have both clinical and financial need. Your physician or nurse practitioner confirms the clinical side together with your local mental health and substance use location, or the Child and Youth Mental Health team. The financial test is an annual income lower than $42,000. If you are eligible, the prescriber submits the Application for PharmaCare Plan G form on your behalf — there is nothing for you to file. The plan covers certain psychiatric medications rather than all of them.",
    "applyText": "See how to apply for Plan G",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover#plang",
    "source": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover#plang",
    "detail": {
      "about": "Plan G pays 100% of eligible costs for certain psychiatric medications, for B.C. residents of any age who have both clinical and financial need. The province describes the financial test as an annual income lower than $42,000. Eligibility is confirmed by your physician or nurse practitioner together with your local mental health and substance use location, or the Child and Youth Mental Health team, and the prescriber then submits the Application for PharmaCare Plan G form for you. Coverage runs for up to one year and must be renewed if you still need it. The province advises knowing your renewal date and seeing a healthcare provider about a month ahead to submit the new application.",
      "aboutList": { "lead": "Plan G pays 100% of eligible costs for certain psychiatric medications, for B.C. residents of any age who have both clinical and financial need.", "items": ["The province describes the financial test as an annual income lower than $42,000.", "Eligibility is confirmed by your physician or nurse practitioner together with your local mental health and substance use location, or the Child and Youth Mental Health team, and the prescriber then submits the Application for PharmaCare Plan G form for you.", "Coverage runs for up to one year and must be renewed if you still need it.", "The province advises knowing your renewal date and seeing a healthcare provider about a month ahead to submit the new application."] },
      "steps": ["Tell your physician or nurse practitioner that you have both clinical and financial need and ask about Plan G", "They confirm eligibility with your local mental health and substance use location, or the Child and Youth Mental Health team", "The prescriber submits the Application for PharmaCare Plan G form on your behalf", "Write down your renewal date and book an appointment about a month before it to submit a new application"],
      "documents": ["Nothing for you to submit — your prescriber completes and sends the Application for PharmaCare Plan G form", "Bring anything your prescriber asks for to show income if they need it"],
      "tips": ["Renewal is what catches people out. Coverage lasts up to 1 year and must be renewed. Put the date somewhere you will see it, and go in a month early.", "The plan covers certain psychiatric medications, not every drug. Ask your prescriber or pharmacist whether your medication is on Plan G before you rely on it.", "Your prescriber confirms eligibility together with your local mental health and substance use location, or the Child and Youth Mental Health team. Plan G covers certain psychiatric medications, so ask whether a specific medication is on the plan.", "Plan G's $42,000 test is based on annual income. This is worded differently from the adjusted net income test used for MSP Supplementary Benefits. Qualifying for one does not automatically mean qualifying for the other."]
    }
  },
  {
    "id": "bc-pharmacare-plan-p",
    "eligibility": { "mode": "all", "items": ["This is for B.C. residents of any age who have reached the end stage of a life-threatening disease or illness and who wish to receive palliative care at home."], "note": "\"Home\" means wherever the person is living — their own home, a family member's or friend's home, a supportive or assisted living residence, or a hospice unit in a long-term care facility, such as a community hospice bed not covered under PharmaCare Plan B. Registration is made by a physician or nurse practitioner, not by the patient or family." },
    "name": "PharmaCare Plan P (BC Palliative Care Benefits)",
    "level": "British Columbia",
    "category": "Health",
    "amount": "100% of eligible costs for medications on the Plan P formulary",
    "requires": ["bc", "palliativeCandidateCondition", "planPRegistration"],
    "summary": "Full coverage of palliative care medications for B.C. residents of any age who have reached the end stage of a life-threatening illness and want to be cared for at home. A doctor or nurse practitioner registers the patient. The family has nothing to submit.",
    "note": "The patient and family do not apply. A physician or nurse practitioner sends one registration form. That same form notifies both PharmaCare and the local health authority. If you want palliative care at home, talk to the doctor or nurse practitioner.",
    "requiresNote": "This is for B.C. residents of any age who have reached the end stage of a life-threatening disease or illness and who wish to receive palliative care at home. \"Home\" means wherever the person is living — their own home, a family member's or friend's home, a supportive or assisted living residence, or a hospice unit in a long-term care facility, such as a community hospice bed not covered under PharmaCare Plan B. Registration is made by a physician or nurse practitioner, not by the patient or family.",
    "applyText": "Read the BC Palliative Care Benefits information sheet",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/practitioner-professional-resources/pharmacare/pharmacare-publications/patient-information-sheets#planp",
    "source": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover#planp",
    "detail": {
      "about": "Plan P covers 100% of eligible costs for medications used in palliative care that appear on the Plan P formulary. It is for B.C. residents of any age who have reached the end stage of a life-threatening disease or illness and who wish to receive palliative care at home, and \"home\" is read broadly: the person's own home, living with family or friends, a supportive or assisted living residence, or a hospice unit at a long-term care facility such as a community hospice bed that is not covered under PharmaCare Plan B. Medications are only part of it — eligible patients can also receive medical supplies and equipment through their local health authority. A physician or nurse practitioner submits the registration form to PharmaCare, and the single form notifies both PharmaCare and the health authority that the patient is eligible.",
      "aboutList": { "lead": "Plan P covers 100% of eligible costs for medications used in palliative care that appear on the Plan P formulary.", "items": ["It is for B.C. residents of any age who have reached the end stage of a life-threatening disease or illness and who wish to receive palliative care at home, and \"home\" is read broadly: the person's own home, living with family or friends, a supportive or assisted living residence, or a hospice unit at a long-term care facility such as a community hospice bed that is not covered under PharmaCare Plan B.", "Medications are only part of it — eligible patients can also receive medical supplies and equipment through their local health authority.", "A physician or nurse practitioner submits the registration form to PharmaCare, and the single form notifies both PharmaCare and the health authority that the patient is eligible."] },
      "steps": ["Tell the doctor or nurse practitioner that palliative care at home is what the patient wants, and ask them to register the patient for BC Palliative Care Benefits", "Ask the same clinician, or the local health authority, about the medical supplies and equipment that eligible patients can also receive through their local health authority", "Ask for the BC Palliative Care Benefits patient information sheet, which is available in multiple languages"],
      "documents": ["Nothing for the patient or family to submit — the registration form is completed and sent by the physician or nurse practitioner"],
      "tips": ["The medications are covered at 100% when they are on the Plan P formulary. If something is not covered, ask the pharmacist to check the formulary.", "Eligible patients can also receive supplies and equipment through the local health authority, so ask about them separately", "A community hospice bed counts as home for this plan, as long as it is not already covered under PharmaCare Plan B", "Registration in Plan P is also one of the prescribed routes to B.C.'s Persons with Disabilities designation. This can matter if disability assistance is being applied for at the same time."]
    }
  },
  {
    "id": "bc-fnha-health-benefits",
    "eligibility": { "mode": "all", "items": ["You must be a First Nations person with Indian status living in British Columbia."], "note": "Infants up to 24 months are covered if at least one parent is eligible. You are not eligible if you have health insurance provided by the federal government, or by a First Nations organization as part of a self-government agreement with Canada. The pharmacy coverage, which B.C. calls PharmaCare Plan W, also requires active Medical Services Plan enrolment." },
    "name": "First Nations Health Benefits (FNHA)",
    "level": "British Columbia",
    "category": "Health",
    "amount": "100% of eligible prescriptions plus dental, vision, medical transportation, mental health and medical supplies",
    "requires": ["bc", "firstNationsStatus"],
    "summary": "Status First Nations people living in B.C. get health coverage through the First Nations Health Authority. It covers prescriptions, medical supplies and equipment, dental, vision, mental health and medical transportation. You enrol by phone with your status number.",
    "note": "Plan W is not a separate application. B.C. states that you do not apply for Plan W and must be enrolled with FNHA to be covered by it. So enrolling with FNHA is the whole route. Some items, including insulin pumps, need special authorization and are not covered automatically.",
    "requiresNote": "You must be a First Nations person with Indian status living in British Columbia. Infants up to 24 months are covered if at least one parent is eligible. You are not eligible if you have health insurance provided by the federal government, or by a First Nations organization as part of a self-government agreement with Canada. The pharmacy coverage, which B.C. calls PharmaCare Plan W, also requires active Medical Services Plan enrolment.",
    "applyText": "Open the official page on fnha.ca",
    "applyUrl": "https://www.fnha.ca/benefits",
    "source": "https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/who-we-cover/first-nations-health-authority-clients",
    "detail": {
      "about": "The FNHA Health Benefits program includes dental, medical supplies and equipment, medical transportation, mental health, pharmacy and vision care. The pharmacy part is PharmaCare Plan W, which covers 100 percent of eligible prescription costs, certain medical supplies, certain over-the-counter drugs, some natural health products, and pharmacy services. Covered medical supplies include diabetes supplies such as test strips, lancets and alcohol wipes, contraceptives, and ostomy supplies. Plan W requires active MSP coverage together with registered Indian status under the Indian Act, or being a child under two years old with at least one parent who is a registered Indian under the Indian Act.",
      "aboutList": { "lead": "The FNHA Health Benefits program includes dental, medical supplies and equipment, medical transportation, mental health, pharmacy and vision care.", "items": ["The pharmacy part is PharmaCare Plan W, which covers 100 percent of eligible prescription costs, certain medical supplies, certain over-the-counter drugs, some natural health products, and pharmacy services.", "Covered medical supplies include diabetes supplies such as test strips, lancets and alcohol wipes, contraceptives, and ostomy supplies.", "Plan W requires active MSP coverage together with registered Indian status under the Indian Act, or being a child under two years old with at least one parent who is a registered Indian under the Indian Act."] },
      "steps": ["Have your status number ready", "Call FNHA Health Benefits at 1-855-550-5454 to enrol, Monday to Friday, 8 a.m. to 4:30 p.m., excluding weekends and statutory holidays", "If you are registering for the first time, you may also need to complete the Pacific Blue Cross Enrollment Application for Group Benefits and the Medical Services Plan Application for Enrollment", "Email the completed forms to HealthBenefits@fnha.ca", "To enrol a child, register the birth with B.C. within three months so the child gets a Personal Health Number, and register the child for Indian Status with Indigenous Services Canada"],
      "documents": ["Status number", "Personal Health Number", "Pacific Blue Cross Enrollment Application for Group Benefits, for first-time registration", "Medical Services Plan Application for Enrollment, for first-time registration"],
      "tips": ["A child with a Personal Health Number can be covered under a parent's account until age two while waiting for their own status number. Once the child has their own status number, call 1-855-550-5454 to enrol them separately.", "You enrol by phone, not through an online form. Plan the call inside the weekday office hours.", "If you already have health insurance from the federal government, or through a First Nations self-government agreement with Canada, you are not eligible for this program"]
    }
  },
  {
    "id": "bc-healthy-kids",
    "name": "BC Healthy Kids Program",
    "level": "British Columbia",
    "category": "Health",
    "amount": "Up to $2,000 in basic dental every two years per child, prescription glasses once a year, plus hearing instruments",
    "summary": "Helps pay for basic dental care, prescription eyewear and hearing assistance for children under 19 in low-income families not on income, disability or hardship assistance.",
    "requires": ["bc", "under19", "bcMsp", "notBcAssistance", "bcHealthyKidsIncome"],
    eligibility: {
      mode: "all",
      items: [
        "Your family qualifies for MSP supplementary benefits — an adjusted net income of $42,000 or less.",
        "You are not receiving income assistance, disability assistance or hardship assistance.",
      ],
      note: "Children in families on assistance get equivalent dental and optical coverage through the ministry supplements instead.",
    },
    "requiresNote": "Your family qualifies for MSP supplementary benefits — that means an adjusted net income of $42,000 or less — and you are not receiving income assistance, disability assistance or hardship assistance. Children in families on assistance get equivalent dental and optical coverage through the ministry supplements instead.",
    "note": "Coverage stays active until the end of the month of your child's 19th birthday. If your child reaches the $2,000 dental limit, emergency treatment is still available, but only for the immediate relief of pain.",
    "applyText": "Apply for health & drug coverage",
    "applyUrl": "https://my.gov.bc.ca/ahdc",
    "source": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/family/child-teen-health/dental-eyeglasses",
    "detail": {
      "about": "Dental is up to $2,000 of basic services every two years. Optical is prescription glasses once a year, including lenses and basic frames. Hearing instruments include hearing aids, bone-anchored hearing aids, cochlear implants, repairs and related items — the least expensive appropriate option, based on an assessment by an audiologist or hearing instrument practitioner, when the family has no other resources to pay. Adjusted net income is your net income after deductions for age, family size, disability, and income from the Universal Child Care Benefit and a Registered Disability Savings Plan.",
      "aboutList": { "lead": "Dental is up to $2,000 of basic services every two years.", "items": ["Optical is prescription glasses once a year, including lenses and basic frames.", "Hearing instruments include hearing aids, bone-anchored hearing aids, cochlear implants, repairs and related items — the least expensive appropriate option, based on an assessment by an audiologist or hearing instrument practitioner, when the family has no other resources to pay.", "Adjusted net income is your net income after deductions for age, family size, disability, and income from the Universal Child Care Benefit and a Registered Disability Savings Plan."] },
      "steps": ["Apply for MSP supplementary benefits through the provincial health and drug coverage application", "File income taxes every year and keep the family's MSP information current", "Before treatment, ask the dental, optical or hearing provider to confirm the child's Healthy Kids coverage and any amount you would have to pay", "Show the child's BC Services Card or CareCard at the appointment", "For hearing instruments, have the provider obtain any required pre-authorization before ordering"],
      "documents": ["Child's BC Services Card or CareCard", "Family income information used for MSP supplementary benefits", "Provider assessment and recommendation for hearing instruments, when applicable"],
      "tips": ["Not every provider charges only the program fee; ask about extra charges before agreeing to treatment", "Tell Health Insurance BC when the family size, address or marital status changes", "Families on income, disability or hardship assistance receive comparable dental and optical supplements through the ministry instead"],
      "time": "Ask Health Insurance BC when you apply",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-medical-transportation",
    "name": "Medical Transportation Supplement",
    "level": "British Columbia",
    "category": "Health",
    "amount": "May pay $0.36 per kilometre by private vehicle, plus bus, ferry, air or train fares, accommodation for overnight travel, and travel escort costs if required",
    "summary": "Helps pay for extraordinary transportation costs to and from essential medical treatment, using the least expensive appropriate transportation.",
    "requires": ["bc", "bcMedTransportRoute", "bcMedTransportNeed"],
    eligibility: {
      mode: "any",
      items: [
        "You are on disability assistance.",
        "You are on income assistance in the Persons with Persistent Multiple Barriers category.",
        "You receive income assistance and reside in a special care facility.",
        "You are on Medical Services Only.",
        "You receive Transitional Health Services after income assistance in the PPMB category.",
        "You receive Transitional Health Services after income assistance while residing in a special care facility.",
        "You are a person or child approved as facing a life-threatening health need, with a direct and immediate life-threatening need for medical transportation.",
        "You are a child in a family receiving income assistance, disability assistance, hardship assistance, MSO or Transitional Health Services.",
      ],
      note: "The supplement is not available if you are only receiving income assistance.",
    },
    "requiresNote": "You may be eligible through disability assistance; income assistance in PPMB; income assistance while residing in a special care facility; or Medical Services Only. Other routes are Transitional Health Services after income assistance in PPMB or while residing in a special care facility; a person or child approved as facing a life-threatening health need with a direct and immediate life-threatening need for medical transportation; or a child in a family receiving income assistance, disability assistance, hardship assistance, MSO or Transitional Health Services. Only receiving income assistance is not a route on its own. You do not have resources available to cover your medical transportation costs.",
    "note": "Ask for pre-approval before you travel. In exceptional circumstances where you could not get funding beforehand, the ministry can consider a request afterwards, but do not count on it. Ambulance bills and the cost to buy, maintain, repair or insure a vehicle are not covered. Trips for non-essential services are not covered either.",
    "applyText": "Submit form HR3320",
    "applyUrl": "https://myselfserve.gov.bc.ca/",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/health-supplements-and-programs/medical-transportation",
    "detail": {
      "about": "Helps pay for extraordinary transportation costs to and from essential medical treatment. Essential treatment means services under the Medicare Protection Act or Hospital Insurance Act with a medical practitioner, nurse practitioner, specialist or hospital. Meal allowances are normally not provided; in exceptional circumstances the ministry may issue up to $8 per meal. Travel escort costs may be paid if required. Costs may only be considered when accompanying a child under 19 or an adult incapable of travelling alone due to verified medical reasons.",
      "aboutList": { "lead": "Helps pay for extraordinary transportation costs to and from essential medical treatment. Essential treatment means services under the Medicare Protection Act or Hospital Insurance Act with a medical practitioner, nurse practitioner, specialist or hospital.", "items": ["Meal allowances are normally not provided; in exceptional circumstances the ministry may issue up to $8 per meal.", "Travel escort costs may be paid if required.", "Costs may only be considered when accompanying a child under 19 or an adult incapable of travelling alone due to verified medical reasons."] },
      "steps": ["Ask for pre-approval before booking travel through My Self Serve, by phone, mail, fax or at a ministry office", "Complete the medical transportation request form HR3320", "Attach proof of the treatment and appointment, such as a provider note, appointment card, email, screenshot or Travel Assistance Program form", "Explain the least expensive appropriate travel method and whether an escort or overnight stay is medically required", "Keep approval and travel receipts in case the ministry requests them"],
      "documents": ["Form HR3320", "Proof of the medical appointment and why the treatment is essential", "Travel dates, destination, distance and expected fare or accommodation cost", "Medical confirmation that an escort or special travel method is required, if applicable"],
      "tips": ["Request approval before you travel; after-the-fact payment is limited to exceptional circumstances", "For repeated treatment, ask whether approval can cover ongoing trips for up to 12 months", "The ministry chooses the least expensive appropriate transportation, so explain accessibility or medical barriers clearly"],
      "time": "Apply before arranging the trip",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "handydart-translink",
    "name": "HandyDART (TransLink)",
    "level": "Metro Vancouver",
    "category": "Transit",
    "amount": "Every trip is a 1-Zone fare — $2.85 adult / $2.30 concession with Compass stored value, $3.50 adult / $2.30 concession in cash",
    "summary": "Door-to-door shared-ride transit across Metro Vancouver for people who cannot use regular public transit for all trips without assistance. Any distance, always a 1-Zone fare.",
    "requires": ["bc", "metroVancouver", "transitBarrier"],
    eligibility: {
      mode: "all",
      items: [
        "You live in Metro Vancouver.",
        "You have a physical, sensory or cognitive disability that means you cannot use conventional public transit for all trips without assistance.",
      ],
      note: "TransLink states there is no age or income test.",
    },
    "requiresNote": "You live in Metro Vancouver and have a physical, sensory or cognitive disability that means you cannot use conventional public transit for all trips without assistance. TransLink states no age or income test.",
    "note": "This is a Metro Vancouver service. Outside Metro Vancouver, look for BC Transit handyDART instead. Fares shown are current as of July 1, 2026 — TransLink usually changes fares on July 1.",
    "applyText": "Download the HandyDART & HandyCard application",
    "applyUrl": "https://www.translink.ca/handydart",
    "source": "https://www.translink.ca/handydart",
    "detail": {
      "about": "The earliest pickup is 6 a.m. and the last drop-off is 2 a.m. You can book your trip as far as seven days in advance and up until 4 p.m. the day before your trip. One combined HandyDART and HandyCard application form covers both services.",
      "steps": ["Download and complete the combined HandyDART and HandyCard application", "Describe the parts of conventional transit you cannot navigate without help, including temporary or changing barriers", "Include the optional medical verification if it will help explain the functional barrier", "Submit the application using the instructions on the form and wait for Access Transit to contact you", "After approval, call to book trips one to seven days ahead; bookings for the next day must be requested before 4 p.m."],
      "documents": ["Completed HandyDART and HandyCard application", "Recent photo for the HandyCard portion", "Optional functional or medical verification"],
      "tips": ["Explain what happens from your door to the stop, on the vehicle and during transfers. Eligibility is about the functional trip, not a diagnosis.", "A HandyDART taxi replacement costs the regular HandyDART fare; it is not a TaxiSaver trip", "Tell the booking agent about mobility aids, an attendant, a service dog or vehicle limitations"],
      "time": "TransLink says it processes HandyDART applications within 10 days of confirming receipt, and asks you to allow 4 to 6 weeks for HandyCard applications.",
      "phone": "604-953-3680"
    }
  },
  {
    "id": "handycard-translink",
    "name": "HandyCard (TransLink)",
    "level": "Metro Vancouver",
    "category": "Transit",
    "amount": "Free photo ID card — concession fares for you, free travel for your attendant, and access to half-price TaxiSaver coupons",
    "summary": "Photo ID card for Metro Vancouver riders who cannot use regular transit without assistance. It gets you concession fares, lets an attendant travel free, and gives you access to the TaxiSaver program.",
    "requires": [
      "bc",
      "metroVancouver",
      "transitBarrier"
    ],
    "requiresNote": "You apply on the same combined HandyDART and HandyCard application form. HandyDART users may also be eligible for HandyCard, a photo-identity card for customers who need assistance to use the conventional system. The HandyDART test is a physical, sensory or cognitive disability that means you cannot use conventional public transit for all trips without assistance; see the application form for detailed criteria.",
    "note": "The attendant travels free on buses, SkyTrain, SeaBus and West Coast Express. HandyDART trips are paid separately at the 1-Zone fare.",
    "applyText": "Apply with the HandyDART & HandyCard form",
    "applyUrl": "https://www.translink.ca/rider-guide/transit-accessibility/handydart",
    "source": "https://www.translink.ca/rider-guide/transit-accessibility/handydart",
    "detail": {
      "about": "HandyCard is for conventional TransLink services, not HandyDART. Carry the original photo card and show it when paying a concession fare or travelling with an attendant.",
      "steps": [
        "Complete the combined HandyDART and HandyCard application",
        "Describe why you cannot use conventional transit without an attendant",
        "Include the required photo and submit the form using its instructions",
        "When the card arrives, carry it on every eligible trip and show it when requested"
      ],
      "documents": [
        "Completed combined application",
        "A recent photo meeting the form requirements",
        "Optional supporting verification describing the transit barrier"
      ],
      "tips": [
        "HandyCard applicants must be at least 12 and live in the TransLink service region",
        "An attendant rides free with you on conventional transit, but you still pay your own concession fare",
        "The same application can request HandyDART and HandyCard together"
      ],
      "time": "Allow 4 to 6 weeks for HandyCard applications to be processed",
      "phone": "604-953-3680"
    }
  },
  {
    "id": "taxisaver-translink",
    "name": "TaxiSaver Program (TransLink)",
    "level": "Metro Vancouver",
    "category": "Transit",
    "amount": "Half-price taxi coupons — $25.00 buys one book with $50.00 worth of coupons, maximum two books per month",
    "summary": "Half-price taxi coupons for HandyCard holders.",
    "requires": ["bc", "metroVancouver", "transitBarrier", "translinkHandyCard"],
    "requiresNote": "You must be a TransLink HandyCard member.",
    "note": "Order by cheque or money order with a self-addressed envelope. Or buy in person at the TransLink Customer Service Centre at Waterfront Station, which takes cash, debit or credit. If you buy in person, you or your representative must show the original HandyCard.",
    "applyText": "Get a HandyCard, then order TaxiSavers",
    "applyUrl": "https://www.translink.ca/rider-guide/transit-accessibility/how-to-use-accessible-transit",
    "source": "https://www.translink.ca/rider-guide/transit-accessibility/how-to-use-accessible-transit",
    "detail": {
      "about": "TaxiSavers are coupon books for ordinary participating taxi trips. They are separate from taxis dispatched by HandyDART as part of a booked HandyDART trip.",
      "steps": ["Get and keep an active TransLink HandyCard", "Choose mail order or in-person purchase at the TransLink Customer Service Centre at Waterfront Station", "For mail order, send a cheque or money order with the required self-addressed envelope", "For an in-person purchase, bring the original HandyCard; a representative may purchase for you if they bring it", "Show the HandyCard to the taxi driver and use coupons toward the participating taxi fare"],
      "documents": ["Original TransLink HandyCard", "Cheque or money order for mail orders, or accepted payment for an in-person purchase"],
      "tips": ["One $25 book contains $50 in coupons and the limit is two books per month", "You can use post-dated cheques to pre-order future months", "Call before travelling to Waterfront Station if you need accessibility or current counter-hour information"],
      "time": "In person is immediate when stock and eligibility are confirmed; mail delivery varies",
      "phone": "604-953-3680"
    }
  },
  {
    "id": "handydart-bctransit",
    "name": "handyDART (BC Transit)",
    "level": "British Columbia",
    "category": "Transit",
    "amount": "Registration is free; attendants ride free",
    "summary": "Door-to-door shared-ride transit in BC Transit communities outside Metro Vancouver, for people whose disability prevents them from using fixed-route transit without assistance.",
    "requires": ["bc", "outsideMetroVancouver", "transitBarrier"],
    eligibility: {
      mode: "all",
      items: [
        "You live in a BC Transit community that has handyDART service.",
        "You have a permanent or temporary disability that prevents you from using fixed-route transit without assistance.",
      ],
    },
    "requiresNote": "You live in a BC Transit community that has handyDART service, and you have a permanent or temporary disability that prevents you from using fixed-route transit without assistance.",
    "note": "Attendants ride free and must board and exit at the same stop as you. Each region has its own handyDART page, contact and booking office — start from your community's page on bctransit.com.",
    "applyText": "Register with your region's handyDART office",
    "applyUrl": resolveBcTransitHandyDartUrl,
    "source": resolveBcTransitHandyDartUrl,
    "detail": {
      "about": "handyDART is shared, door-to-door service. Drivers drop you off at the closest accessible point near your destination. Registration is free. You can pay your fare with cash when you board, or buy fare products in advance.",
      "steps": ["Find your community on the BC Transit website and open its handyDART registration page", "Complete, sign and date the regional handyDART application", "Describe which parts of fixed-route transit you cannot use without assistance", "Include the optional medical verification if it helps explain the functional barrier", "Submit the form to the regional registrar, then follow the local instructions for booking after approval"],
      "documents": ["Completed regional handyDART application", "Optional Medical Verification of Eligibility form", "Mobility-aid measurements or travel-support details if requested by the region"],
      "tips": ["Registration is free and eligibility is based on functional ability, not diagnosis, age or mobility device", "Contacts, fares and booking hours differ by community — use your own regional page", "Ask whether your region offers a handyPASS for a free attendant and Taxi Saver access"],
      "time": "Varies by regional transit system",
      "phone": "Use the handyDART number on your community's BC Transit page"
    }
  },
  {
    "id": "taxi-saver-bctransit",
    "name": "Taxi Saver Program (BC Transit)",
    "level": "British Columbia",
    "category": "Transit",
    "amount": "Half-price taxi coupons — in the Victoria region, $40 buys an $80 package, one package per month",
    "summary": "Half-price taxi coupons for permanently registered handyDART riders, for one-off trips when handyDART does not work.",
    "requires": ["bc", "outsideMetroVancouver", "age12plus", "transitBarrier", "bcTransitHandyDart"],
    eligibility: {
      mode: "all",
      items: [
        "You are a permanently registered handyDART customer.",
        "You are 12 years of age or older.",
        "You have a handyPASS.",
      ],
    },
    "requiresNote": "You are a permanently registered handyDART customer, 12 years of age or older, and you have a handyPASS.",
    "note": "Coupons come in $1, $2 and $5 values. Taxi drivers do not give change for them, so pay any remainder in cash. Coupons cannot be transferred or used as a tip. The $40 for $80 package and the one-per-month limit are confirmed for the Victoria region. Other BC Transit regions run their own versions, so check your region's page.",
    "applyText": "Check your region's Taxi Saver page",
    "applyUrl": "https://www.bctransit.com/victoria/riderinfo/handydart/taxi-saver/",
    "source": "https://www.bctransit.com/victoria/riderinfo/handydart/taxi-saver/",
    "detail": {
      "about": "Taxi Saver is delivered by participating regional BC Transit systems. This guide uses Victoria's current rules; other regions can set different prices, purchase methods and taxi companies.",
      "steps": ["Confirm that you are permanently registered for handyDART, age 12 or older and have a handyPASS", "Open your region's Taxi Saver page and confirm the current package price and purchase method", "Buy vouchers from the regional Taxi Saver office or approved outlet", "Book a participating taxi directly and show your handyPASS", "Use vouchers toward the metered fare and pay any remainder in cash (for example, on a $5.80 fare you pay $5.00 in coupons and $0.80 in cash)"],
      "documents": ["Current handyPASS", "Payment accepted by the regional Taxi Saver office"],
      "tips": ["Vouchers cover 50% of eligible taxi fares. They cannot be transferred or used as a tip.", "Drivers do not give change for vouchers, so combine denominations carefully", "Check the participating taxi list before booking because companies can change"],
      "time": "Ask the regional Taxi Saver office",
      "phone": "Victoria region: 250-995-5618"
    }
  },
  {
    "id": "bc-disability-assistance-pwd",
    "needsPractitioner": true,
    "name": "BC Disability Assistance (PWD)",
    "level": "British Columbia",
    "category": "Money",
    "amount": "Up to $1,483.50/month single ($983.50 support + $500 shelter) plus $52/month transportation supplement; up to $2,662/month for a couple where both have PWD",
    "summary": "Monthly income support for adults with the Persons with Disabilities (PWD) designation — a support allowance plus shelter allowance, an automatic $52 transportation supplement, health supplements and PharmaCare Plan C coverage.",
    "requires": ["bc", "age18plus", "dailyLivingLimit", "bcPwdMedical", "bcDisabilityAssistanceFinancial"],
    "note": "Rates took effect December 1, 2025. As of July 2026, $1,483.50 for a single person is the current maximum. You can also work. Starting January 1, 2026, you can earn up to $16,200 a year before earnings change your payment. The limit is $23,400 for a couple where one of you has PWD and $32,400 where both do. There is no monthly cap, so you can earn it whenever suits you. Even if you go over the limit, you always keep 100% of the money you earn. Only the assistance payment is reduced.",
    "applyText": "Apply on My Self Serve",
    "applyUrl": "https://myselfserve.gov.bc.ca/",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/disability-assistance-rate-table",
    "detail": {
      "about": "Disability assistance is BC's core income program for people with the PWD designation. A single person receives a $983.50 monthly support allowance plus a shelter allowance of up to $500 (for one person the minimum is $75 if your actual shelter costs are less), and every PWD recipient gets a $52 transportation supplement as cash or an in-kind bus pass. It also opens the door to dental, optical, medical equipment, medical transportation and nutrition supplements, and 100% drug coverage under PharmaCare Plan C.",
      "aboutList": { "lead": "Disability assistance is BC's core income program for people with the PWD designation.", "items": ["A single person receives a $983.50 monthly support allowance plus a shelter allowance of up to $500 (for one person the minimum is $75 if your actual shelter costs are less), and every PWD recipient gets a $52 transportation supplement as cash or an in-kind bus pass.", "It also opens the door to dental, optical, medical equipment, medical transportation and nutrition supplements, and 100% drug coverage under PharmaCare Plan C."] },
      "steps": ["Create an account at myselfserve.gov.bc.ca (or call 1-866-866-0800) and complete the online application so the ministry can check financial eligibility", "Request the PWD designation application and complete the applicant section (form HR2883)", "Have your doctor or nurse practitioner complete the medical report section", "Have a doctor, nurse practitioner or prescribed professional (e.g., occupational therapist, social worker) complete the assessor report", "Submit everything and respond to any ministry follow-up. If you are approved for the designation and are financially eligible, assistance is paid in the month following designation (payments begin in the month of your 18th birthday if you were designated before turning 18).", "Report income and changes monthly as required to keep payments accurate"],
      "documents": ["ID and Social Insurance Number for all adults in the family unit", "Bank statements and details of assets and income", "Rent receipt, lease or proof of shelter costs", "Completed PWD application (applicant, medical and assessor sections)"],
      "tips": ["Already on CPP Disability, Community Living BC, the At Home Program, PharmaCare Plan P (palliative) or ISC PWD? A simplified prescribed-class application (HR3642) skips most of the medical paperwork", "You can take the $52 transportation supplement as a BC Bus Pass instead of cash. Choose whichever you actually use.", "PWD has higher asset limits than regular income assistance, so savings do not disqualify you as quickly", "At 65 most recipients move to federal Old Age Security and GIS. The ministry will contact you before then.", "The earnings exemption runs January 1 to December 31 and does not carry over. Anything you do not use is gone, and you get a fresh limit each year.", "There is no monthly limit. You can earn the whole exemption in one busy month or spread it across the year without your assistance changing.", "Going over the limit does not cost you your earnings. Your assistance is reduced by the amount you went over, and you keep 100% of what you earned.", "The ministry sends you a letter once you reach 75% of your exemption, and you can check what is left any time on My Self Serve.", "If you start disability assistance partway through the year, your exemption is prorated for the months left in the year. A change in your family also changes your limit.", "File monthly report HR0081 by the fifth of the month if you have income or any change to report. Report your income even when it is exactly the same as last month."],
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
    "summary": "Direct yearly funding to buy autism intervention services (behaviour consultants, therapists, supervised behaviour interventionists) for children under 6 with an autism diagnosis.",
    "requires": [
      "bc",
      "under6",
      "autismSelected",
      "autismDiagnosis"
    ],
    "requiresNote": "Child under age 6 with an autism spectrum disorder diagnosis meeting BC standards (BCAAN or qualified private assessment)",
    "note": "Autism Funding accepts new applications until March 2027 and ends March 31, 2027. The ministry says it will contact all recipients about their eligibility to transfer to the BC Children and Youth Disability Benefit ahead of the transition. Final aligned funding periods may be prorated to March 31, 2027.",
    "applyText": "Apply for autism funding",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/autism-funding/apply",
    "source": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/autism-funding/funding-amount",
    "detail": {
      "about": "Normally, up to 20% of the allocation can go to training, travel and equipment (TTE). For the final aligned funding period ending March 31, 2027, BC increased the allowable TTE portion to 50%. Requests must not exceed 50% of a child/youth’s annual funding amount for benefit plans that are 12 months or less. For benefit plans that are 13 months or longer, the limit is 50% on the adjusted portion, with the first 12 months being available at 20%. Families are encouraged to check their TTE balance on MyFamily Services (MyFS) or call Autism Funding to confirm their balance (Toll Free: 1 877 777-3530).",
      "coversList": {
        "lead": "Up to $22,000 per year per child covers:",
        "items": [
          "Professionals listed on the Registry of Autism Service Providers (RASP)",
          "Behaviour interventionists supervised by a RASP professional",
          "Family counselling or therapy (providers do not need to be on RASP)",
          "Employment-related costs when you hire staff",
          "Administrative costs up to $100/month"
        ]
      },
      "steps": [
        "Get an autism diagnosis through the BC Autism Assessment Network (BCAAN, free via physician referral) or a private assessment meeting BC standards",
        "Register for a Basic BCeID account to apply online, or complete the paper Application for Autism Funding",
        "Email the application and supporting documents to mcf.autismfundingintake@gov.bc.ca or submit through your local CYSN office",
        "Sign the funding agreement, then choose providers (RASP-listed professionals, supervised behaviour interventionists, or family counselling providers) and submit invoices or reimbursement claims"
      ],
      "documents": [
        "Proof of age and residency (for example a birth certificate or BC Services Card)",
        "BCAAN assessment: the BCAAN Clinical Outcome (PANTER) Form (BCAAN assessment reports are optional)",
        "Private (non-BCAAN) assessment: form CF0904 and a diagnostic report showing the ADOS-2 and ADI-R were used, signed by the assessor, with the speech-language and psychological evaluation findings",
        "Assessment outside B.C.: form CF0905 and a copy of the original diagnostic report or assessment information",
        "Basic BCeID account for online applications",
        "Assessment outside B.C.: a new assessment may be required if the BC specialist cannot confirm that the previous diagnosis meets the DSM-5 criteria"
      ],
      "tips": [
        "Intervention services must come from providers on the RASP registry, or from behaviour interventionists supervised by a RASP professional. Family counselling or therapy providers do not need to be on RASP.",
        "The normal training, travel and equipment limit is 20%, but BC raised it to 50% for the final aligned funding period ending March 31, 2027. Requests must not exceed 50% of a child/youth’s annual funding amount for benefit plans that are 12 months or less. For benefit plans that are 13 months or longer, the limit is 50% on the adjusted portion, with the first 12 months being available at 20%. Families are encouraged to check their TTE balance on MyFamily Services (MyFS) or call Autism Funding to confirm their balance (Toll Free: 1 877 777-3530).",
        "Approved services and purchases must be delivered by March 31, 2027; direct-payment supporting documents are due May 31, 2027, and final invoices or reimbursement requests are due September 30, 2027",
        "From July 2026 the ministry contacts Autism Funding families about moving to the new Disability Benefit ($6,500 or $17,000/year). You keep your current funding until your transition date.",
        "These professionals may be eligible to provide family counselling or therapy: Canadian Certified Counsellors, Registered Clinical Counsellors, Registered Marriage and Family Therapists, Registered Psychiatrists, Registered Psychologists, and Registered Social Workers or Registered Clinical Social Workers. Contact Autism Funding or Autism Information Services BC for more information."
      ],
      "time": "New applications are accepted until March 2027. The program and final aligned funding periods end March 31, 2027; later paperwork deadlines do not extend the service-delivery date.",
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
    "summary": "Yearly funding for autism intervention, therapies, life-skills programs, camps and out-of-school tutoring for children and youth aged 6 to 18.",
    "requires": [
      "bc",
      "age6to18",
      "autismSelected",
      "autismDiagnosis"
    ],
    "requiresNote": "Child or youth aged 6-18 with an autism spectrum disorder diagnosis meeting BC standards",
    "note": "Autism Funding accepts new applications until March 2027 and ends March 31, 2027. The ministry says it will contact all recipients about their eligibility to transfer to the BC Children and Youth Disability Benefit ahead of the transition. Final aligned funding periods may be prorated to March 31, 2027.",
    "applyText": "Apply for autism funding",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/autism-funding/apply",
    "source": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/autism-funding/funding-amount",
    "detail": {
      "about": "Administrative costs are limited to up to $50 a month for a bookkeeper, or $600 per funding period for direct payment accountant fees. The normal training, travel and equipment (TTE) limit is 20%. For the final aligned funding period ending March 31, 2027, BC increased the allowable TTE portion to 50%. Requests must not exceed 50% of a child/youth’s annual funding amount for benefit plans that are 12 months or less. For benefit plans that are 13 months or longer, the limit is 50% on the adjusted portion, with the first 12 months being available at 20%. Families are encouraged to check their TTE balance on MyFamily Services (MyFS) or call Autism Funding to confirm their balance (Toll Free: 1 877 777-3530). For families with youth aging out (turning 19) prior to March 31, 2027, requests for travel, training and equipment purchases must not exceed 20%.",
      "coversList": {
        "lead": "Up to $6,000 per year per child for:",
        "items": [
          "Behaviour consultants or analysts",
          "Speech-language pathologists",
          "Occupational or physical therapists",
          "Behaviour interventionists (should be supervised by one of the professionals listed above)",
          "Life skills and social skills programs",
          "Out-of-school learning support and tutoring",
          "Dietary counselling from registered dieticians",
          "Family counselling",
          "Specialized therapeutic camps for autism"
        ]
      },
      "steps": [
        "Have an autism diagnosis on file (BCAAN or qualified private assessment)",
        "Apply online with a Basic BCeID or send the Application for Autism Funding to mcf.autismfundingintake@gov.bc.ca, or go through your local CYSN office",
        "Sign the funding agreement and hire providers for the eligible services (behaviour interventionists should be supervised by a listed professional)",
        "Submit invoices for direct payment or claim reimbursements"
      ],
      "documents": [
        "Proof of age and residency (for example a birth certificate or BC Services Card)",
        "BCAAN assessment: the BCAAN Clinical Outcome (PANTER) Form (BCAAN assessment reports are optional)",
        "Private (non-BCAAN) assessment: form CF0904 and a diagnostic report showing the ADOS-2 and ADI-R were used, signed by the assessor",
        "Assessment outside B.C.: form CF0905 and a copy of the original diagnostic report or assessment information",
        "Basic BCeID account for the online portal",
        "Assessment outside B.C.: a new assessment may be required if the BC specialist cannot confirm that the previous diagnosis meets the DSM-5 criteria"
      ],
      "tips": [
        "For ages 6-18, providers do not have to be RASP-listed for every service type. So therapy, tutoring and camps are easier to fund than under the Under-6 program.",
        "The normal training, travel and equipment limit is 20%, but BC raised it to 50% for the final aligned funding period ending March 31, 2027. Requests must not exceed 50% of a child/youth’s annual funding amount for benefit plans that are 12 months or less. For benefit plans that are 13 months or longer, the limit is 50% on the adjusted portion, with the first 12 months being available at 20%. Families are encouraged to check their TTE balance on MyFamily Services (MyFS) or call Autism Funding to confirm their balance (Toll Free: 1 877 777-3530).",
        "Approved services and purchases must be delivered by March 31, 2027; direct-payment supporting documents are due May 31, 2027, and final invoices or reimbursement requests are due September 30, 2027",
        "For families with youth aging out (turning 19) before March 31, 2027, requests for travel, training and equipment purchases must not exceed 20%.",
        "Ask your CYSN office about the transition schedule if you have not been contacted by fall 2026"
      ],
      "time": "New applications are accepted until March 2027. The program and final aligned funding periods end March 31, 2027; later paperwork deadlines do not extend the service-delivery date.",
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
    "summary": "New direct funding for children and youth, from age 0 until the last day of their 19th birthday month, who have significant disabilities of any diagnosis (autism, Down syndrome, cerebral palsy, intellectual disability and more). It replaces Autism Funding and the School-Aged Extended Therapies stream.",
    "requires": ["bc", "bcCydbAge", "childHighNeeds", "bcCydbIntake"],
    eligibility: {
      mode: "all",
      items: [
        "The child is aged 0 until the last day of their 19th birthday month.",
        "The child has a long-term disability causing significant and complex developmental support needs, based on diagnosis and/or functional impact.",
      ],
    },
    "requiresNote": "Ages 0 until the last day of the 19th birthday month, with a long-term disability causing significant and complex developmental support needs, based on diagnosis and/or functional impact",
    "note": "Began April 1, 2026. Eligible families already receiving ministry services for children and youth with support needs, including autism funding, will not need to apply, although some may be asked to provide additional information. The benefit will be available province-wide by April 1, 2027.",
    "applyText": "Learn about the Disability Benefit",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/financial-supports/disability-benefit",
    "source": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/financial-supports/disability-benefit",
    "detail": {
      "about": "Two funding tiers: a base tier of $6,500/year and a higher tier of $17,000/year set through support planning with a ministry worker. Funding covers disability-related expenses including respite, paediatric therapies, behavioural intervention, and assistive and augmentative communication supports. Eligibility is needs-based, not diagnosis-specific: direct admission for conditions such as moderate-to-profound intellectual disability, autism with intellectual disability, and degenerative conditions with predictable decline (such as Duchenne muscular dystrophy and SMA types 1 and 2), plus a needs-based clinical review pathway for rare or atypical cases. Part of a $475-million, three-year provincial investment that also expands free community services (therapies from spring 2026, behaviour and mental-health supports 2027, navigation and school-aged programming 2027-2028).",
      "aboutList": { "lead": "Two funding tiers: a base tier of $6,500/year and a higher tier of $17,000/year set through support planning with a ministry worker.", "items": ["Funding covers disability-related expenses including respite, paediatric therapies, behavioural intervention, and assistive and augmentative communication supports.", "Eligibility is needs-based, not diagnosis-specific: direct admission for conditions such as moderate-to-profound intellectual disability, autism with intellectual disability, and degenerative conditions with predictable decline (such as Duchenne muscular dystrophy and SMA types 1 and 2), plus a needs-based clinical review pathway for rare or atypical cases.", "Part of a $475-million, three-year provincial investment that also expands free community services (therapies from spring 2026, behaviour and mental-health supports 2027, navigation and school-aged programming 2027-2028)."] },
      "steps": ["Already receiving Autism Funding or SAET: wait to be contacted — a ministry worker manages your transition between April 2026 and March 2027", "Not yet in a program: before March 31, 2027 you can apply through the current pathways (such as Autism Funding or the School-Aged Extended Therapies stream). Children and youth receiving CYSN services before March 31, 2027 will transition to the Disability Benefit if they are eligible.", "After April 1, 2027: new applicants apply directly to the Disability Benefit", "Work with a ministry worker on support planning if your child may qualify for the $17,000 higher tier"],
      "documents": ["Existing program enrolment (some children move directly based on information on file; others may be asked for additional information), or", "Diagnostic reports and functional assessments showing significant support needs (communication, cognitive/adaptive functioning, safety or behavioural complexity)"],
      "tips": ["Do not wait for 2027. Before March 31, 2027 you can apply through the current pathways. Those receiving CYSN services by then will move to the Disability Benefit if they are eligible.", "Funding is flexible across respite, therapy, behaviour intervention and AAC (augmentative and alternative communication), rather than tied to one diagnosis stream", "Services outside British Columbia and unresearched interventions are not eligible uses", "Call the toll-free helpline for families (1-844-442-2800) with questions. To ask about using the funding, call PAIRS (1-844-878-4700, 8:30am to 4:30pm Monday to Friday, excluding statutory holidays)."],
      "time": "Transition runs April 2026 to March 2027; new applicants apply directly after April 1, 2027.",
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
    "summary": "Extra monthly money on top of disability assistance for PWD recipients whose severe condition causes chronic, progressive deterioration of health, and who need extra nutrition to avoid serious decline.",
    "requires": ["bc", "age18plus", "bcPwdStatus", "nutritionNeed", "lowIncome"],
    "note": "A practitioner must confirm at least two symptoms. Examples are malnutrition, underweight status, significant weight loss, significant muscle-mass loss, significant neurological degeneration, deterioration of a vital organ, or moderate-to-severe immune suppression.",
    "applyText": "Get form HR2847 (PDF)",
    "applyUrl": "https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/policies-for-government/bc-employment-assistance-policy-procedure-manual/forms/pdfs/hr2847.pdf",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/health-supplements-and-programs-rate-table",
    "detail": {
      "about": "The MNS is for people on disability assistance with the PWD designation who have a severe medical condition causing chronic, progressive deterioration of health with wasting-type symptoms, and who need additional nutritional items or vitamins and minerals to prevent imminent danger to life. Current maximums (Health Supplements & Programs rate table, effective August 1, 2023) are $180/month for dietary items and $45/month for vitamins or minerals.",
      "aboutList": { "lead": "The MNS is for people on disability assistance with the PWD designation who have a severe medical condition causing chronic, progressive deterioration of health with wasting-type symptoms, and who need additional nutritional items or vitamins and minerals to prevent imminent danger to life.", "items": ["Current maximums (Health Supplements & Programs rate table, effective August 1, 2023) are $180/month for dietary items and $45/month for vitamins or minerals."] },
      "steps": ["Get form HR2847 (Application for Monthly Nutritional Supplement) from your ministry office, My Self Serve or the link above", "Complete Part B yourself", "Have a medical practitioner, nurse practitioner or registered dietitian complete Part C describing your condition, symptoms and the items needed", "Submit the form; the ministry's Health Assistance staff review and decide"],
      "documents": ["Form HR2847 with the practitioner or dietitian section completed"],
      "tips": ["A registered dietitian can complete Part C. This is often faster than waiting for a specialist appointment.", "Be specific about each symptom: two or more must be documented for approval", "If denied, request reconsideration. Better medical detail can help a reconsideration."],
      "time": "Typically a few weeks after the ministry receives the completed form",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-optical-supplement",
    "name": "Optical Supplements (Glasses & Eye Exams)",
    "level": "British Columbia",
    "category": "Health",
    "amount": "Routine eye exam up to $44.83 with an optometrist or $48.90 with an ophthalmologist once every 2 years; new prescription glasses at the ministry's maximum rates, plus new lenses if your eye doctor confirms a change in your prescription",
    "summary": "Eye exams and prescription eyewear for everyone on income or disability assistance. Show your BC Services Card at any eye clinic, and the ministry pays the optometrist or optician directly.",
    "requires": ["bc", "bcAssistanceStatus"],
    "note": "MSP already covers children's routine eye exams. The supplement pays for their glasses. You may be responsible for costs above the ministry's fee schedule, so ask the clinic first.",
    "applyText": "See what's covered",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/family-social-supports/income-assistance/on-assistance/supplements/optical",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/health-supplements-and-programs-rate-table",
    "detail": {
      "about": "Everyone receiving income or disability assistance gets specified optical services: routine eye exams for adults ($44.83 with an optometrist or $48.90 with an ophthalmologist every two years), new eyeglasses up to ministry maximum rates, new lenses if your eye doctor confirms a change in your prescription, and necessary repairs to lenses or frames. Payment goes straight from the ministry to the optometrist or optician.",
      "aboutList": { "lead": "Everyone receiving income or disability assistance gets specified optical services:", "items": ["Routine eye exams for adults ($44.83 with an optometrist or $48.90 with an ophthalmologist every two years)", "New eyeglasses up to ministry maximum rates", "New lenses if your eye doctor confirms a change in your prescription", "And necessary repairs to lenses or frames", "Payment goes straight from the ministry to the optometrist or optician."] },
      "steps": ["Take your BC Services Card to any eye clinic", "The clinic verifies your coverage through Pacific Blue Cross", "Get your exam and choose frames within the ministry rate (or pay the difference)", "The ministry pays the provider directly"],
      "documents": ["BC Services Card"],
      "tips": ["Ask the clinic which frames are fully covered at ministry rates before choosing", "If your eye doctor confirms a change in your prescription, new lenses are covered"],
      "time": "No application — coverage verified at the clinic on the spot",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-bus-pass",
    "name": "BC Bus Pass Program",
    "level": "British Columbia",
    "category": "Transit",
    "amount": "No annual fee for PWD recipients; $45/year for eligible low-income seniors",
    "summary": "A bus pass for people on BC disability assistance and for low-income seniors. It works on scheduled BC Transit services across the province. In Metro Vancouver it comes as a Compass Card.",
    "requires": ["bc", "bcBusPassStatus"],
    eligibility: {
      mode: "any",
      items: [
        "You receive BC disability assistance (PWD designation).",
        "You are a low-income senior who receives the Guaranteed Income Supplement (GIS).",
        "You are 60 to 64 and on provincial income assistance.",
        "You are 65 or older and would get the GIS but for residency rules.",
      ],
    },
    "requiresNote": "For people receiving BC disability assistance (PWD designation). Low-income seniors also qualify: GIS recipients, 60-64 year olds on provincial income assistance, and 65+ who would get GIS but for residency rules.",
    "note": "PWD recipients pay no annual fee. They choose the bus pass instead of the $52 monthly cash transportation supplement. The separate eligible low-income-senior stream costs $45 per year.",
    "applyText": "Request via My Self Serve or call 1-866-866-0800",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/transportation/passenger-travel/buses-taxis-limos/bus-pass/people-with-disabilities",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/general-supplements-and-programs/bc-bus-pass-program",
    "detail": {
      "about": "The BC Bus Pass Program provides a monthly pass at no annual cost to eligible people with the PWD designation who receive disability assistance, and a separate $45 annual pass to eligible low-income seniors. The pass works on scheduled BC Transit services across the province and as a Compass Card on TransLink in Metro Vancouver. A PWD recipient chooses either the pass or the $52 monthly cash transportation supplement.",
      "aboutList": { "lead": "The BC Bus Pass Program provides a monthly pass at no annual cost to eligible people with the PWD designation who receive disability assistance, and a separate $45 annual pass to eligible low-income seniors.", "items": ["The pass works on scheduled BC Transit services across the province and as a Compass Card on TransLink in Metro Vancouver.", "A PWD recipient chooses either the pass or the $52 monthly cash transportation supplement."] },
      "steps": ["Confirm whether you qualify through the PWD stream or the low-income-senior stream", "If you receive PWD disability assistance, choose either the no-fee bus pass or the $52 monthly cash transportation supplement", "Request the pass through My Self Serve or by calling 1-866-866-0800; PWD recipients switching from cash should contact the ministry by the 5th for the change to start the next month", "Allow 4 to 6 weeks for a new pass to arrive"],
      "documents": ["Seniors stream: SIN, name, date of birth, address and contact details"],
      "tips": ["PWD recipients pay no annual fee. The $45 annual fee applies to the eligible low-income-senior stream.", "The pass works in BC Transit communities across the whole province, not just your home city", "Replacement passes can have a fee, even when the original PWD pass had no annual fee. Report a lost pass quickly.", "PWD recipients can later cancel the pass and go back to the $52 monthly cash supplement. To do this, contact the ministry by the 5th.", "No new documents if you already receive disability assistance — just your request"],
      "time": "Allow 4 to 6 weeks for a new pass to arrive",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "sparc-parking-permit",
    "eligibility": { "mode": "all", "items": ["Mobility limitation confirmed by a medical professional — for example you use a wheelchair or a mobility aid like a cane or crutches, or your health prevents you from walking far."], "note": "You don't need to own a vehicle." },
    "needsPractitioner": true,
    "name": "Accessible Parking Permit (SPARC BC)",
    "level": "British Columbia",
    "category": "Parking",
    "amount": "Fees are set by SPARC BC; confirm the current fee on their site. Permanent permits are valid 3 years; temporary permits are valid 1-12 months and are not renewable.",
    "summary": "BC's accessible parking placard for people with mobility limitations. Hang it from the rear-view mirror. It is valid whether you drive or ride as a passenger.",
    "requires": ["bc", "bcParkingMobility"],
    "requiresNote": "Mobility limitation confirmed by a medical professional — for example you use a wheelchair or a mobility aid like a cane or crutches, or your health prevents you from walking far. You don't need to own a vehicle.",
    "note": "SPARC BC is the non-profit that runs BC's permit program. SPARC BC sets the fees. Check the current fee and any hardship help on its site.",
    "applyText": "Apply through SPARC BC",
    "applyUrl": "https://www.sparc.bc.ca/parking-permits/",
    "source": "https://www.sparc.bc.ca/parking-permits/",
    "detail": {
      "about": "SPARC BC issues the accessible parking permits recognized in designated spaces across British Columbia. Two types exist: permanent (valid 3 years, renewable) and temporary (1 to 12 months, not renewable — reapply if still needed). The permit belongs to the person, not a car, and must be displayed on the rear-view mirror while parked.",
      "aboutList": { "lead": "SPARC BC issues the accessible parking permits recognized in designated spaces across British Columbia.", "items": ["Two types exist: permanent (valid 3 years, renewable) and temporary (1 to 12 months, not renewable — reapply if still needed).", "The permit belongs to the person, not a car, and must be displayed on the rear-view mirror while parked."] },
      "steps": ["Download the application form from sparc.bc.ca or call 604-718-7744 / 1-888-718-7794 for a copy", "Have the referral section completed by a medical professional with a valid MSP number", "Check SPARC BC's site for the current fee and submit it with the application; ask about hardship assistance if needed", "Allow 2 to 3 weeks for processing", "Display the permit on the rear-view mirror whenever parked in an accessible space"],
      "documents": ["Application form including the medical professional referral section", "Payment of the current fee listed by SPARC BC, unless hardship assistance applies"],
      "tips": ["The permit is yours, not the vehicle's. Use it in any car you drive or ride in.", "Renew permanent permits online at online.sparc.bc.ca before they expire. Expired permits can't be renewed online.", "Temporary permits can't be renewed. Send a new application if you still need one.", "Email permits@sparc.bc.ca with questions"],
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
    "amount": "Full cost of pre-approved equipment — e.g., scooters up to $3,500 ($4,500 bariatric), floor/ceiling lifts up to $4,200 (more only if the excess is from unusual installation expenses); wheelchairs, walkers, hospital beds and bathing aids at ministry rates",
    "summary": "The ministry buys, repairs and replaces essential medical equipment — canes to power wheelchairs, hospital beds, transfer aids, pressure-relief mattresses, specialized glucose meters — for people on assistance with no other way to pay.",
    "requires": ["bc", "bcAssistanceStatus", "equipmentNeed"],
    "note": "Pre-approval is required: the ministry must approve the request before purchase, except in cases of a life-threatening emergency, and it is the payer of last resort — other available resources (for example ICBC, WorkSafeBC or private insurance) must be considered first. Co-funding may be considered when other resources cannot pay the entire cost.",
    "applyText": "Request via My Self Serve",
    "applyUrl": "https://myselfserve.gov.bc.ca/",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/health-supplements-and-programs/medical-equipment-and-devices",
    "detail": {
      "about": "Covered items include canes, crutches, walkers, manual and power wheelchairs, scooters, grab bars, bath seats, commodes, lift devices, hospital beds, pressure-relief mattresses and non-conventional glucose meters. The item must be prescribed by a medical practitioner or nurse practitioner, and/or the medical need confirmed by the assessment of a relevant therapist (occupational or physical therapist). Many items also need a therapist assessment. Most equipment can be replaced every five years (wheelchair seating after two; canes, crutches and walkers as needed). Scooters intended primarily for recreational or sports use, lift chairs, automatic turning beds and containment type beds are not provided.",
      "aboutList": { "lead": "Covered items include canes, crutches, walkers, manual and power wheelchairs, scooters, grab bars, bath seats, commodes, lift devices, hospital beds, pressure-relief mattresses and non-conventional glucose meters.", "items": ["The item must be prescribed by a medical practitioner or nurse practitioner, and/or the medical need confirmed by the assessment of a relevant therapist (occupational or physical therapist). Many items also need a therapist assessment.", "Most equipment can be replaced every five years (wheelchair seating after two; canes, crutches and walkers as needed).", "Scooters intended primarily for recreational or sports use, lift chairs, automatic turning beds and containment type beds are not provided."] },
      "steps": ["Contact the ministry through My Self Serve or 1-866-866-0800 to start an equipment request", "Get a prescription from your doctor or nurse practitioner, and/or an assessment from a relevant therapist confirming the medical need", "Complete an occupational or physical therapist assessment where required (wheelchairs, seating, scooters, lifts)", "Submit supplier quote(s); wait for written ministry pre-approval", "The ministry pays the supplier directly; repairs are requested the same way"],
      "documents": ["Doctor or nurse practitioner prescription and/or therapist assessment confirming the medical need", "Occupational/physical therapist assessment for mobility and positioning items", "Supplier quote"],
      "tips": ["Never buy first — the ministry will not accept payment responsibility for equipment purchased without prior approval, except in cases of a life-threatening emergency", "If you need specific features, ask your OT to note why the least-expensive option would not meet your medical need.", "Repairs and batteries can be covered between replacement cycles"],
      "time": "Weeks to a couple of months depending on assessments, quotes and pre-approval",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-at-home-medical",
    "needsPractitioner": true,
    "name": "At Home Program: Medical Benefits",
    "level": "British Columbia",
    "category": "Health",
    "amount": "Per-item coverage — wheelchair seating to $9,000, lifts to $8,000, hospital bed to $4,000, scooter to $3,700, dental $700 a year, optical $150 a year, plus 100% of eligible prescription drugs and designated medical supplies through PharmaCare Plan F",
    "summary": "Medical equipment, therapies, dental and optical care, medical travel and PharmaCare Plan F for eligible children. See the assessed daily-living, direct nursing care and palliative routes below.",
    "requires": ["bc", "child", "bcMsp", "bcAtHomeMedicalRoute"],
    eligibility: {
      mode: "all",
      items: [
        "Your child is 17 or younger.",
        "Your child is a BC resident enrolled in the Medical Services Plan.",
        "Your child lives at home with a parent or guardian, or with an Extended Family Program caregiver.",
        "Your child meets one of the routes listed below.",
      ],
    },
    "requiresNote": "Your child is 17 or younger, is a BC resident enrolled in the Medical Services Plan, and lives at home with a parent or guardian or with an Extended Family Program caregiver. Medical-benefit routes are alternatives: assessed dependence in at least three of eating, dressing, toileting and washing; eligibility for Nursing Support Services direct nursing care, without an eligibility assessment; or a palliative condition with life expectancy of up to six months as indicated by a physician or nurse practitioner, without an eligibility assessment.",
    "note": "Benefits last until the last day of the month your child turns 18. PharmaCare Plan F coverage ends the same day. Start the adult disability assistance application about six months before that birthday. Young people in the program get a streamlined route into it. New families can still apply until March 2027.",
    "applyText": "See eligibility and apply",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/complex-health-needs/at-home-program/at-home-program-eligibility",
    "source": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/complex-health-needs/at-home-program",
    "detail": {
      "about": "Medical Benefits can cover approved equipment, supplies, therapies, dental, optical, medical travel, and prescription drugs and designated medical supplies at 100% through PharmaCare Plan F. The program must approve many items before they are bought, and coverage ends on the last day of the month the child turns 18.",
      "aboutList": { "lead": "Medical Benefits can cover approved equipment, supplies, therapies, dental, optical, medical travel, and prescription drugs and designated medical supplies at 100% through PharmaCare Plan F.", "items": ["The program must approve many items before they are bought.", "Coverage ends on the last day of the month the child turns 18.", "Any one of these routes can apply: assessed dependence in at least three of eating, dressing, toileting and washing.", "Eligible for Nursing Support Services direct nursing care: no eligibility assessment is required.", "Palliative route: a palliative condition with life expectancy of up to six months.", "A physician or nurse practitioner must indicate this palliative life expectancy.", "No eligibility assessment is required for this palliative route."] },
      "steps": ["Complete the At Home Program application with a doctor or nurse practitioner", "Attach the requested identification and functional assessments; children under 3 may be asked for extra supporting information", "Send the application to the regional At Home Program office listed by the province", "Take part in the in-home assessment of eating, dressing, toileting and washing if one is required", "Wait for the written decision, then work with the CYSN worker or Medical Benefits branch before purchasing covered equipment or services"],
      "documents": ["Completed At Home Program application with parent and medical-professional sections", "Identification for the child and parent or guardian", "Child's Personal Health Number and proof of active MSP", "Requested functional assessments such as Vineland-3, PEDI-CAT or GMFCS, when applicable"],
      "tips": ["Families in current pilot areas use a different Medical Benefits application route. Check the official page for your community.", "Do not buy equipment, dental, optical or travel first when pre-approval is required", "Start adult PWD planning about six months before the child's 18th birthday", "PharmaCare Plan F is not a separate application. Once your child gets full benefits or medical benefits through the At Home Program, MCFD sends their information to PharmaCare. The drug coverage then follows automatically.", "Plan F covers designated medical supplies at 100%, as well as prescription drugs. Before you keep buying a supply yourself, ask the At Home Program or your pharmacist if it is on the designated list."],
      "time": "Assessment and regional review follow a complete application; no guaranteed timeline is published",
      "phone": "Medical Benefits: 1-888-613-3232"
    }
  },
  {
    "id": "bc-supported-child-development",
    "name": "Supported Child Development",
    "level": "British Columbia",
    "category": "Family",
    "amount": "Consulting and support services so a child with extra support needs can take part in inclusive child care",
    "summary": "Community programs that help children with extra support needs take part in regular, fully inclusive child care. They support the family and the child care centre, not just the child.",
    "requires": ["bc", "child", "childcare"],
    "requiresNote": "For children with extra support needs who are attending or want to attend a child care setting in BC.",
    "note": "Ask your public health nurse or physician, or contact your local Ministry of Children and Family Development office. Aboriginal Supported Child Development offers the same supports in a way that is culturally relevant and meaningful. See ascdp.bc.ca.",
    "applyText": "Find your local program",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/early-childhood-intervention",
    "source": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/early-childhood-intervention",
    "detail": {
      "about": "Supported Child Development is a set of community-based programs offering consulting and support to children, families and child care centres so children with extra support needs can participate in inclusive child care. Aboriginal Supported Child Development provides culturally relevant support.",
      "steps": ["Use the provincial early-intervention page to find the Supported Child Development program serving your community", "Contact the program directly, or ask a public health nurse or physician to help with the referral", "Tell the program which child care setting the child attends or hopes to attend and what participation barriers are present", "Work with the program and child care provider on an individual support plan"],
      "documents": ["Child and parent or guardian contact information", "Information from the child care provider about participation and support needs", "Relevant developmental or health reports if the local program requests them"],
      "tips": ["Contact the program even if the child does not yet have a child care placement", "Ask about Aboriginal Supported Child Development if culturally grounded service is a better fit", "Availability and intake steps are local, so the community program is the official contact"],
      "time": "Intake and availability vary by community"
    }
  },
  {
    "id": "bc-at-home-saet",
    "needsPractitioner": true,
    "name": "At Home Program: School-Aged Extended Therapies (SAET)",
    "level": "British Columbia",
    "category": "Health",
    "amount": "Up to $5,760/year each for OT, PT and speech therapy, plus up to $1,920/year for chiropractic or massage",
    "summary": "May help families with the cost of out-of-school occupational therapy, physiotherapy and speech-language pathology for school-aged children enrolled in the At Home Program.",
    "requires": [
      "bc",
      "schoolAge",
      "childThreeAdls",
      "atHomeProgram"
    ],
    "requiresNote": "School-aged children and youth enrolled in the At Home Program",
    "note": "SAET families were among the first moved to the new B.C. Children and Youth Disability Benefit. This began April 1, 2026. It started with children already in the At Home Program, autism funding and other children-and-youth-with-support-needs services. Therapies remain an approved use of the new benefit. SAET stays available until March 31, 2027, or until your child transitions, whichever comes first. All SAET authorizations are being updated to match that end date. New families are told to keep using the current pathways for now. The new benefit is fully operational provincewide from April 1, 2027. Ask AHP Medical Benefits which stream applies to your child.",
    "applyText": "Request through AHP Medical Benefits",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/complex-health-needs/at-home-program/medical-benefits",
    "source": "https://www2.gov.bc.ca/assets/gov/family-and-social-supports/children-teens-with-support-needs/at_home_program_guide.pdf",
    "detail": {
      "about": "Up to $5,760 per 12-month period for each of occupational therapy, physiotherapy and speech-language pathology (including therapist-assistant services), delivered one-to-one or in groups. Maximum billing rates: $160/hour for therapists, $60/hour for therapist assistants; up to $480 of the maximum can go to consultation, report writing and travel. A separate $1,920/year is available for chiropractic ($40/session) or massage ($40/hour). Exceptions to maximums are considered for post-surgical rehabilitation. Services must complement, not duplicate, school-based therapy.",
      "aboutList": {
        "lead": "Up to $5,760 per 12-month period for each of occupational therapy, physiotherapy and speech-language pathology (including therapist-assistant services), delivered one-to-one or in groups.",
        "items": [
          "Maximum billing rates: $160/hour for therapists, $60/hour for therapist assistants; up to $480 of the maximum can go to consultation, report writing and travel.",
          "A separate $1,920/year is available for chiropractic ($40/session) or massage ($40/hour).",
          "Exceptions to maximums are considered for post-surgical rehabilitation.",
          "Services must complement, not duplicate, school-based therapy."
        ]
      },
      "steps": [
        "Ensure the child is enrolled in the At Home Program",
        "Have the treating OT, PT, SLP, chiropractor or massage therapist complete the At Home Program Request for School-Aged Extended Therapies form, including intended functional outcomes",
        "Submit the request to AHP Medical Benefits for review",
        "Approved therapists invoice AHP Medical Benefits directly"
      ],
      "documents": [
        "Request for School-Aged Extended Therapies form completed by the treating therapist",
        "Functional outcomes for the child (Part 5 of the request form)"
      ],
      "tips": [
        "The therapist who requests services must work with the school-based therapy team so services do not overlap",
        "Sequential therapy blocks (one goal at a time) are preferred over running everything at once",
        "If your child moved to the Disability Benefit in April 2026, pay for the same therapies from the new $6,500/$17,000 allocation instead",
        "Post-surgical rehab can go over the annual maximum. Ask for an exception."
      ],
      "time": "Requests reviewed by AHP Medical Benefits; SAET recipients transitioned to the Disability Benefit starting April 2026.",
      "phone": "1-888-613-3232"
    }
  },
  {
    "id": "bc-clbc",
    "needsPractitioner": true,
    "name": "Community Living BC (CLBC) Adult Supports",
    "level": "British Columbia",
    "category": "Family",
    "amount": "Individually planned funded services — residential, employment, community inclusion, respite",
    "summary": "A provincial agency that funds lifelong supports for adults 19+ with developmental disabilities. Supports include home sharing and staffed living, employment services, community inclusion, respite and family support. Youth can apply from age 16. What funded support you get, and when, depends on how urgent your situation is and the funding CLBC has at the time of the request.",
    "requires": ["bc", "age16plus", "bcClbcStream", "disabilityDoc"],
    eligibility: {
      mode: "any",
      items: [
        "You are an adult 19 or older with significantly impaired intellectual and adaptive functioning that began before age 18.",
        "Under the PSI stream, you are an adult with an FASD or autism spectrum diagnosis plus significant adaptive-functioning limitations.",
      ],
      note: "You can apply from age 16, and supports continue beyond 65.",
    },
    "requiresNote": "Adults 19+ with significantly impaired intellectual and adaptive functioning that began before age 18; or, under the PSI stream, adults with an FASD or autism spectrum diagnosis plus significant adaptive-functioning limitations. Apply from age 16; supports continue beyond 65",
    "note": "There are two eligibility streams. Developmental Disability needs a psychologist's cognitive and adaptive assessments. The Personalized Supports Initiative needs an FASD or ASD diagnosis plus significant daily-living limitations. You do not need an intellectual disability for this stream. These assessments are sometimes already done when you were in school, so ask before arranging new ones.",
    "applyText": "Check CLBC eligibility",
    "applyUrl": "https://www.communitylivingbc.ca/who-does-clbc-support/eligible-clbc-support/",
    "source": "https://www.communitylivingbc.ca/what-support-is-available/",
    "detail": {
      "about": "Services are delivered through a network of contracted agencies and planned individually with a CLBC facilitator.",
      "coversList": { "lead": "CLBC funds and coordinates:", "items": ["Residential supports (living in your own place, shared living/home sharing with a contracted family, or staffed homes)", "Employment support to find and keep a job", "Community inclusion and connection programs", "Skill development", "Respite for families", "Wellness supports for daily responsibilities", "Behavioural support", "The Provincial Assessment Centre's mental-health services for people 14+ with developmental disabilities"] },
      "steps": ["From age 16, ask your MCFD/CYSN worker about transition planning to CLBC", "Contact your nearest CLBC office (1-877-660-2522) — a facilitator explains the required documents and approved assessors", "Submit assessments and forms completed by an approved professional (registered psychologist for the DD stream); school-years assessments may be reusable", "Once eligibility is confirmed, attend the CLBC Welcome Workshop series and work with your facilitator on a support plan", "CLBC connects you to funded services based on the plan and available resources"],
      "documents": ["Cognitive/psychoeducational assessment by a registered psychologist (DD stream)", "Adaptive functioning assessment completed by an approved professional", "Confirmed FASD or autism spectrum diagnosis for the PSI stream", "CLBC eligibility forms completed by approved professionals"],
      "tips": ["Start at 16, because assessments and planning take time. What funded support you get, and when, depends on how urgent your situation is and the funding CLBC has at the time of your request.", "If you were assessed in school, ask the school district for copies. You may not need a new assessment.", "Not eligible under the DD stream? Ask specifically about the Personalized Supports Initiative (PSI)", "Respite or equivalent funding is commonly the first service offered to families of transitioning youth. Ask your facilitator what is available in your region.", "Adults on CLBC services usually also qualify for BC PWD disability assistance. Apply for both."],
      "time": "When funded support starts depends on how urgent your situation is and the amount of funding CLBC has at the time of the request.",
      "phone": "1-877-660-2522"
    }
  },
  {
    "id": "bc-csg-students-disabilities",
    "needsPractitioner": true,
    "name": "Canada Student Grant for Students with Disabilities (StudentAid BC)",
    "level": "British Columbia",
    "category": "Education",
    "amount": "$2,800 per program year",
    "summary": "A grant of $2,800 per program year (August 1 to July 31) that you do not repay. It is for post-secondary students with a permanent, or persistent or prolonged, disability. In B.C. it is handled through your StudentAid BC application.",
    "requires": ["bc", "student", "disabilityDoc"],
    eligibility: {
      mode: "all",
      items: [
        "You qualify for federal student aid.",
        "You are enrolled full-time or part-time at a designated post-secondary institution.",
        "You have a permanent disability, or a persistent or prolonged disability (lasting at least 12 months) verified by a qualified medical assessor.",
      ],
    },
    "requiresNote": "You must qualify for federal student aid, be enrolled full-time or part-time at a designated post-secondary institution, and have a permanent disability or a persistent or prolonged disability (lasting at least 12 months) verified by a qualified medical assessor.",
    "note": "The current amount reflects a temporary 40% federal increase that runs until July 31, 2027. Once StudentAid BC verifies your disability status you are automatically considered for the province's other disability grants too. Note: StudentAid BC changed its process in June 2026 — new applicants use the online Disability status application instead of the old Appendix 8 form. This amount is a temporary increase in place until July 31, 2027 — check the current figure before you count on it.",
    "applyText": "Apply through StudentAid BC",
    "applyUrl": "https://studentaidbc.ca/apply/how-to-apply-disability-funding",
    "source": "https://studentaidbc.ca/explore/grants-scholarships/canada-student-grant-students-disabilities",
    "detail": {
      "about": "This federal grant, delivered through StudentAid BC, helps cover education costs for students with disabilities. It is money you do not pay back, and it is available whether you study full-time or part-time. Disability status can be a permanent disability (lifelong) or a persistent or prolonged disability (12+ months). Once your disability status is verified, you can also use reduced course-load rules (40-59% counts as full-time) and other B.C. disability grants.",
      "aboutList": { "lead": "This federal grant, delivered through StudentAid BC, helps cover education costs for students with disabilities.", "items": ["It is money you do not pay back, and it is available whether you study full-time or part-time.", "Disability status can be a permanent disability (lifelong) or a persistent or prolonged disability (12+ months).", "Once your disability status is verified, you can also use reduced course-load rules (40-59% counts as full-time) and other B.C. disability grants."] },
      "steps": ["Apply for StudentAid BC full-time or part-time funding online.", "In your StudentAid BC account, open the Disability status application in the Forms section (for applications submitted after June 23, 2026).", "Download the Disability Verification Form and have a qualified medical assessor complete it. Some disabilities (Specific Learning Disorders) do not require the form and have different verification requirements; check the instructions on the form.", "Upload the signed form (if your disability needs it) inside the Disability status application and submit your declaration.", "StudentAid BC reviews it (about 6 weeks) and posts the decision to your account; the grant is then included in your funding assessment."],
      "documents": ["StudentAid BC application (full-time or part-time)", "Disability Verification Form completed by a qualified medical assessor (not required for some disabilities, such as Specific Learning Disorders)", "Social Insurance Number and B.C. ID for your StudentAid BC account"],
      "tips": ["You can submit the disability verification any time. You do not have to wait for your loan application to finish.", "Permanent disabilities never need re-verification. Persistent or prolonged disabilities are re-verified when you enter repayment or after a break of more than 5 years.", "If you already get provincial disability assistance (PWD), tell your school's financial aid office. It can affect how your funding is set up."],
      "time": "About 6 weeks for disability verification",
      "phone": "1-800-561-1818"
    }
  },
  {
    "id": "bc-csg-services-equipment",
    "needsPractitioner": true,
    "name": "Canada Student Grant for Services and Equipment – Students with Disabilities",
    "level": "British Columbia",
    "category": "Education",
    "amount": "Up to $20,000 per loan year",
    "summary": "Up to $20,000 per year for disability-related education services and equipment, such as notetakers, tutors, interpreters and technical aids. It is for post-secondary students with disabilities and goes through StudentAid BC.",
    "requires": ["bc", "student", "disabilityDoc"],
    eligibility: {
      mode: "all",
      items: [
        "You qualify for a federal student loan.",
        "You study full-time or part-time at a designated institution.",
        "You have a verified permanent or persistent/prolonged disability.",
        "You have exceptional education-related costs caused by your disability.",
      ],
    },
    "requiresNote": "You must qualify for a federal student loan, study full-time or part-time at a designated institution, have a verified permanent or persistent/prolonged disability, and have exceptional education-related costs caused by your disability.",
    "note": "This grant is on top of the $2,800 Canada Student Grant for Students with Disabilities. If you use up the full $20,000 and still have costs, the B.C. Assistance Program for Students with Disabilities can add up to $10,000-$12,000 more.",
    "applyText": "Apply through StudentAid BC",
    "applyUrl": "https://studentaidbc.ca/apply/how-to-apply-disability-funding",
    "source": "https://studentaidbc.ca/explore/grants-scholarships/canada-student-grant-services-and-equipment-students-disabilities",
    "detail": {
      "about": "This grant pays for the specific services and equipment you need because of your disability while studying — things like notetakers, tutors, interpreters, assistive software and other technical aids. It is non-repayable and is assessed through your StudentAid BC application after your disability status is verified.",
      "steps": [
        "Complete a StudentAid BC application and get your disability status verified (Disability Verification Form from a qualified medical assessor; some disabilities, such as Specific Learning Disorders, have different verification requirements — see the form's instructions).",
        "Work with your school's accessibility services office to identify the services and equipment you need.",
        "Your school's accessibility services officer sends the Equipment Request form to Assistive Technology BC (for equipment), or the Services Request form to StudentAid BC (for services).",
        "For equipment, Assistive Technology BC contacts you to review your needs and your equipment is ordered. For services, you get a notification when your request is complete."
      ],
      "documents": ["Verified disability status with StudentAid BC", "Documentation of the services or equipment you need and their costs (your school's accessibility office helps prepare this)"],
      "tips": ["Book an appointment early with your school's accessibility services office. They know this process well and often start the paperwork for you.", "Keep receipts for everything the grant pays for."],
      "time": "About 6 weeks for disability verification, then with your funding assessment",
      "phone": "1-800-561-1818"
    }
  },
  {
    "id": "bc-access-grant-students-disabilities",
    "needsPractitioner": true,
    "name": "B.C. Access Grant for Students with Disabilities",
    "level": "British Columbia",
    "category": "Education",
    "amount": "Up to $1,560 per program year ($30 per week of study)",
    "summary": "Non-repayable grant money that replaces B.C. student loans for full-time students with a disability, so you borrow less.",
    "requires": [
      "bc",
      "student",
      "disabilityDoc"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are enrolled in a full-time program at a designated public post-secondary school in B.C.",
        "You qualify for federal and provincial student financial aid.",
        "You have a permanent disability, or a persistent or prolonged disability as defined by the Canada Student Financial Assistance Program."
      ],
      "note": "Students who received this grant at another school in 2025/26, for the same program at the same school, may request to continue until their program is complete or July 31, 2029, whichever is first."
    },
    "requiresNote": "You may be eligible if you are enrolled in a full-time program at a designated public post-secondary school, you qualify for federal and provincial student financial aid, and you have a permanent disability, or a persistent or prolonged disability as defined by the Canada Student Financial Assistance Program. See the limited continuing-grant exception below.",
    "note": "Only available to students attending B.C. public post-secondary schools. Students enrolled at another school in 2025/26 who received this grant for the same program at the same school may request to continue until their program is complete or until July 31, 2029, whichever occurs first. It replaces B.C. student loan funding with grant funding, so it lowers what you have to pay back.",
    "applyText": "See how to apply for disability funding",
    "applyUrl": "https://studentaidbc.ca/explore/grants-scholarships/bc-access-grant-students-disabilities",
    "source": "https://studentaidbc.ca/explore/grants-scholarships/bc-access-grant-students-disabilities",
    "detail": {
      "about": "This non-repayable grant replaces B.C. student loan funding with grant funding for eligible full-time students with a disability at B.C. public post-secondary schools (a limited exception applies to students already receiving it at another school), reducing the amount they borrow.",
      "steps": [
        "Apply for full-time StudentAid BC funding for the study period",
        "If disability status is not already verified, submit the StudentAid BC Disability Verification Form completed by an accepted medical assessor",
        "Confirm that your school is a B.C. public post-secondary institution, or ask about continuing if you received this grant there in 2025/26",
        "Review the assessment notice in your StudentAid BC account; the grant is assessed with the aid application"
      ],
      "documents": [
        "StudentAid BC application",
        "Disability Verification Form if status is not already verified",
        "Any follow-up financial information StudentAid BC requests"
      ],
      "tips": [
        "There is no separate grant application after disability status is verified",
        "Contact the school's accessibility services office early for accommodations and related disability funding"
      ],
      "time": "Assessed with the StudentAid BC application",
      "phone": "1-800-561-1818"
    }
  },
  {
    "id": "bc-supplemental-bursary-students-disabilities",
    "needsPractitioner": true,
    "name": "B.C. Supplemental Bursary for Students with Disabilities",
    "level": "British Columbia",
    "category": "Education",
    "amount": "$800 per program year full-time, or $400 per program year part-time",
    "summary": "A bursary you do not repay, to help with the cost of post-secondary education. It is for students with a permanent, or persistent or prolonged, disability. You may be eligible as a full-time or part-time student if you qualify for the Canada Student Grant for Students with Disabilities.",
    "requires": ["bc", "student", "disabilityDoc"],
    "requiresNote": "Full-time means a course load of 40% or more; part-time means 20% to 39%. Available to students attending B.C. public post-secondary schools only. You may be eligible if you qualify for the Canada Student Grant for Students with Disabilities.",
    "note": "There is a transition rule: students enrolled at a school other than a B.C. public school in 2025/26 who received this bursary for the same program at the same school may request to continue receiving it until their program is complete, or until July 31, 2029, whichever occurs first.",
    "applyText": "See how to apply for disability funding",
    "applyUrl": "https://studentaidbc.ca/explore/grants-scholarships/bc-supplemental-bursary-students-disabilities",
    "source": "https://studentaidbc.ca/explore/grants-scholarships/bc-supplemental-bursary-students-disabilities",
    "detail": {
      "about": "This non-repayable bursary helps eligible full-time and part-time students with a permanent, or persistent or prolonged, disability pay post-secondary education costs at B.C. public post-secondary schools.",
      "steps": ["Apply for StudentAid BC full-time or part-time funding for the study period", "Submit the Disability Verification Form if StudentAid BC has not already verified disability status", "Confirm that the school and course load meet the bursary rules", "Review the StudentAid BC assessment notice; the bursary is assessed automatically when the conditions are met"],
      "documents": ["StudentAid BC aid application", "Disability Verification Form when needed", "School and course-load information"],
      "tips": ["A 40% course load counts as full-time for this bursary; 20% to 39% counts as part-time", "Ask StudentAid BC about the published transition rule if you received this bursary at a non-public school in 2025/26"],
      "time": "Assessed with the StudentAid BC application",
      "phone": "1-800-561-1818"
    }
  },
  {
    "id": "bc-assistance-program-students-disabilities",
    "needsPractitioner": true,
    "name": "B.C. Assistance Program for Students with Disabilities",
    "level": "British Columbia",
    "category": "Education",
    "amount": "Up to $10,000, or up to $12,000 if an attendant is required at school",
    "summary": "Funding for exceptional education-related services and adaptive equipment. Use it after the federal services and equipment grant runs out.",
    "requires": ["bc", "student", "disabilityDoc"],
    eligibility: {
      mode: "all",
      items: [
        "You are enrolled at a designated private or public post-secondary institution in B.C.",
        "You have a permanent disability, or a persistent or prolonged disability.",
      ],
      note: "It also covers students in developmental programs or courses.",
    },
    "requiresNote": "You are enrolled at a designated private or public post-secondary institution in B.C. and have a permanent disability, or a persistent or prolonged disability. It also covers students in developmental programs or courses.",
    "note": "You can only get this grant once you have used up all available funds through the Canada Student Grant for Services and Equipment – Students with Disabilities. Apply for that federal grant first. The page does not say whether these amounts are per year or a lifetime limit.",
    "applyText": "See how to apply for disability funding",
    "applyUrl": "https://studentaidbc.ca/explore/grants-scholarships/bc-assistance-program-students-disabilities",
    "source": "https://studentaidbc.ca/explore/grants-scholarships/bc-assistance-program-students-disabilities",
    "detail": {
      "about": "This grant funds exceptional education-related services and adaptive equipment after all available funding from the Canada Student Grant for Services and Equipment – Students with Disabilities has been used. Apply for the federal grant first.",
      "steps": ["Have StudentAid BC verify your disability status", "Meet with the school's accessibility services office to document disability-related services and equipment", "Apply first for the Canada Student Grant for Services and Equipment – Students with Disabilities", "If eligible costs exceed that grant, have the accessibility office submit the B.C. Assistance Program request and quotes", "Wait for written approval before purchasing equipment or committing to services"],
      "documents": ["Verified disability status", "Accessibility-services assessment of required services or equipment", "Supplier quotes or service-cost estimates", "Evidence that the federal services-and-equipment grant has been used"],
      "tips": ["Do not buy equipment before you have written funding approval", "The official page does not say whether the maximum is annual or lifetime. Ask StudentAid BC before you plan around it."],
      "time": "Varies with assessment, quotes and funding review",
      "phone": "1-800-561-1818"
    }
  },
  {
    "id": "bc-learning-disability-assessment-bursary",
    "needsPractitioner": true,
    "name": "Learning Disability Assessment Bursary",
    "level": "British Columbia",
    "category": "Education",
    "amount": "Up to $3,500",
    "summary": "Covers the up-front cost of a learning disability assessment. This assessment is what opens the door to disability funding and academic accommodations.",
    "requires": ["bc", "student", "learningDisability", "bcLdAssessmentReferral"],
    eligibility: {
      mode: "all",
      items: [
        "You qualify for student funding through StudentAid BC.",
        "You are enrolled full-time or part-time in post-secondary level courses at a designated public post-secondary institution in B.C.",
        "The accessibility services office at your school has recommended that you have a learning disability assessment.",
      ],
    },
    "requiresNote": "You qualify for student funding through StudentAid BC, you are enrolled full-time or part-time in post-secondary level courses at a designated public post-secondary institution in B.C., and the accessibility services office at your school has recommended that you have a learning disability assessment.",
    "note": "Your school's accessibility services office must recommend you. This is part of the eligibility. Start by contacting the accessibility services office at the school you plan to attend.",
    "applyText": "Contact your school's accessibility services office",
    "applyUrl": "https://studentaidbc.ca/explore/grants-scholarships/learning-disability-assessment-bursary",
    "source": "https://studentaidbc.ca/explore/grants-scholarships/learning-disability-assessment-bursary",
    "detail": {
      "about": "This bursary covers up to $3,500 of the up-front cost of a learning disability assessment when the accessibility services office at an eligible B.C. public post-secondary institution recommends the assessment.",
      "steps": ["Apply for StudentAid BC funding and confirm that the school is an eligible B.C. public post-secondary institution", "Meet with the school's accessibility services office and ask whether it recommends a current learning-disability assessment", "Have the accessibility office start the bursary process before booking the assessment", "Use the approved qualified assessor and submit the required invoice or receipt through the school process"],
      "documents": ["StudentAid BC funding eligibility", "Accessibility-services recommendation", "Assessment quote or invoice and the completed assessment documentation requested by the school"],
      "tips": ["Start with accessibility services. Booking an assessment on your own does not make you eligible for the bursary.", "Ask how the assessor will be paid and what amount, if any, you must pay up front"],
      "time": "Ask the school's accessibility services office",
      "phone": "StudentAid BC: 1-800-561-1818"
    }
  },
  {
    "id": "bc-access-grant-deaf-students",
    "needsPractitioner": true,
    "name": "B.C. Access Grant for Deaf Students",
    "level": "British Columbia",
    "category": "Education",
    "amount": "Up to $30,000 per program year, based on financial need assessed by StudentAid BC",
    "summary": "Helps deaf and hard of hearing students with the extra cost of a specialized school that teaches in American Sign Language. It applies only to Gallaudet University in Washington, D.C. and the National Technical Institute for the Deaf in Rochester, New York. Both are in the United States.",
    "requires": ["bc", "student", "disabilityDoc", "hearingDisability"],
    eligibility: {
      mode: "all",
      items: [
        "You are deaf or hard of hearing.",
        "Your disability status is verified by StudentAid BC.",
        "You demonstrate financial need.",
        "You are enrolled in a full-time course load of 60% or more.",
        "You are attending an eligible school.",
      ],
      note: "The only eligible schools are Gallaudet University in Washington, D.C. and the National Technical Institute for the Deaf in Rochester, New York.",
    },
    "requiresNote": "You are deaf or hard of hearing, your disability status is verified by StudentAid BC, you demonstrate financial need, you are enrolled in a full-time course load of 60% or more, and you are attending an eligible school. The only eligible schools are Gallaudet University in Washington, D.C. and the National Technical Institute for the Deaf in Rochester, New York.",
    "note": "There is no separate application. If StudentAid BC has verified your disability status and you are attending one of the two eligible schools, they assess your eligibility automatically.",
    "applyText": "Learn more at StudentAid BC",
    "applyUrl": "https://studentaidbc.ca/explore/grants-scholarships/bc-access-grant-deaf-students",
    "source": "https://studentaidbc.ca/sites/all/files/school-officials/policy_manual_26_27.pdf",
    "detail": {
      "about": "This grant is only for eligible deaf or hard of hearing students attending Gallaudet University in Washington, D.C. or the National Technical Institute for the Deaf in Rochester, New York. StudentAid BC assesses it automatically when disability status is verified and the student attends one of those two schools.",
      "steps": ["Apply for StudentAid BC funding for full-time study at Gallaudet University or the National Technical Institute for the Deaf", "Submit the Disability Verification Form if StudentAid BC has not already verified deaf or hard-of-hearing status", "Provide any financial-need or enrolment information StudentAid BC requests", "Review the funding assessment; there is no separate application for this grant"],
      "documents": ["StudentAid BC application", "Verified disability status", "Full-time enrolment information for one of the two eligible schools"],
      "tips": ["Only the two named U.S. institutions qualify", "Ask StudentAid BC how cross-border tuition, currency and payments are handled before you commit to costs"],
      "time": "Assessed with the StudentAid BC application",
      "phone": "1-800-561-1818"
    }
  },
  {
    "id": "bc-dental-supplement",
    "eligibility": { "mode": "any", "items": ["Adults may be able to get basic dental coverage if they receive disability assistance, qualify as a person with persistent multiple barriers (PPMB), or are eligible for general health supplements.", "Children under 19 in families on any assistance are covered."], "note": "Everyone on assistance can get emergency dental treatment to relieve pain. Adults on income assistance may also be eligible for dentures if their complete upper and/or lower teeth were removed in the previous six months to relieve pain." },
    "name": "Dental Supplements (Income & Disability Assistance)",
    "level": "British Columbia",
    "category": "Health",
    "amount": "Up to $1,000 per 2 calendar years for adults (current period Jan 2025–Dec 2026); up to $2,000 per 2 years for children under 19, plus $1,000/year for hospital dental under general anesthesia",
    "summary": "Basic dental care for people on disability assistance, such as check-ups, fillings, extractions and dentures. The ministry pays the dentist directly. Emergency treatment to relieve pain is covered for everyone on assistance.",
    "requires": ["bc", "bcAssistanceStatus"],
    "requiresNote": "Adults may be able to get basic dental coverage if they receive disability assistance, qualify as a person with persistent multiple barriers (PPMB), or are eligible for general health supplements; children under 19 in families on any assistance are covered. Everyone on assistance can get emergency dental treatment to relieve pain. Adults on income assistance may also be eligible for dentures if their complete upper and/or lower teeth were removed in the previous six months to relieve pain.",
    "note": "The adult limit resets on January 1 of every odd-numbered year. The current $1,000 window runs January 2025 through December 2026. Unused room disappears in January 2027. Amounts and covered services are in BC's health supplements rate table. Check the current limits there.",
    "applyText": "See what's covered",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/family-social-supports/income-assistance/on-assistance/supplements/dental",
    "source": "https://www2.gov.bc.ca/gov/content/family-social-supports/income-assistance/on-assistance/supplements/dental",
    "detail": {
      "about": "Coverage includes restorations, extractions, preventative care, partial and replacement dentures, and crowns or bridges in certain cases, billed under ministry fee schedules. Adults with eligibility get up to $1,000 over each two-calendar-year period. Children get up to $2,000 plus an extra $1,000 per year for hospital dental treatment under general anesthesia. Emergency dental to relieve pain is available to everyone on assistance regardless of the limit.",
      "aboutList": { "lead": "Coverage includes restorations, extractions, preventative care, partial and replacement dentures, and crowns or bridges in certain cases, billed under ministry fee schedules.", "items": ["Adults with eligibility get up to $1,000 over each two-calendar-year period.", "Children get up to $2,000 plus an extra $1,000 per year for hospital dental treatment under general anesthesia.", "Emergency dental to relieve pain is available to everyone on assistance regardless of the limit."] },
      "steps": ["Confirm you receive disability assistance or otherwise qualify for general health supplements", "Book any dentist, denturist or dental hygienist and show your BC Services Card", "The office confirms your coverage with the ministry's insurer (Pacific Blue Cross) before treatment", "The ministry pays the provider directly — ask in advance about any costs above the fee schedule"],
      "documents": ["BC Services Card or Personal Health Number"],
      "tips": ["Ministry fee-schedule rates are below many dentists' usual fees. Ask the office to bill within the schedule, or to tell you the difference before work starts.", "Plan larger treatment around the 2-year cycle, so a January reset gives you a fresh $1,000", "Dentures have their own rules and limits. Ask the ministry before you order."],
      "time": "No application is described on the page — if you receive assistance you may be able to have basic dental costs covered; the provider verifies it at booking",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-additional-home-owner-grant",
    "name": "B.C. Home Owner Grant — additional grant for people with disabilities",
    "level": "British Columbia",
    "category": "Tax",
    "amount": "For 2026, up to $845 in the Capital, Fraser Valley and Metro Vancouver regional districts, or up to $1,045 elsewhere in B.C.",
    "summary": "A larger property tax grant for B.C. homeowners with a disability, or who live with a relative who has one. It reduces the property tax you owe; it is not a payment.",
    "requires": ["bc", "homeowner", "bcHomeOwnerGrantDisabilityRoute"],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are the registered owner, a Canadian citizen or permanent resident, live in B.C., and occupy the property as your principal residence.",
        "You pay at least $100 in property taxes.",
        "You qualify on one of two routes: you receive provincial disability assistance, hardship assistance or a supplement under the Employment and Assistance for Persons with Disabilities Act; or you pay at least $150 a month for assistance with daily living activities, or have spent at least $2,000 on structural modifications to the home."
      ]
    },
    "requiresNote": "You must be the registered owner, a Canadian citizen or permanent resident, live in B.C., and occupy the property as your principal residence. You must also pay at least $100 in property taxes. You qualify on one of two routes: you receive provincial disability assistance, hardship assistance or a supplement under the Employment and Assistance for Persons with Disabilities Act; or you pay at least $150 a month for assistance with daily living activities, or have spent at least $2,000 on structural modifications to the home.",
    "note": "The higher northern and rural amount ends on January 1, 2027. From that date, every B.C. property gets $570 regular or $845 with the additional amount. There is no separate northern or rural top-up.",
    "applyText": "Apply for the home owner grant",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/annual-property-tax/home-owner-grant/person-with-disabilities",
    "source": "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/annual-property-tax/home-owner-grant/person-with-disabilities",
    "detail": {
      "about": "The home owner grant lowers the property tax on your principal residence. The regular grant for 2026 is up to $570 in the Capital, Fraser Valley and Metro Vancouver regional districts and up to $770 elsewhere. If you are a person with a disability, or you live with a relative who has one, the additional grant raises that to up to $845 and up to $1,045. The 2026 grant threshold is an assessed value of $2,075,000, and the grant is reduced by $5 for each $1,000 of assessed value above it. For Option B (the daily-living or structural-modification route), a health professional must certify on Form B (FIN 74) that the person has a severe mental or physical impairment likely to continue for at least two years. If your assessed value is above the threshold, a separate low income grant supplement may apply when adjusted net income is $32,000 or less.",
      "aboutList": { "lead": "The home owner grant lowers the property tax on your principal residence.", "items": ["The regular grant for 2026 is up to $570 in the Capital, Fraser Valley and Metro Vancouver regional districts and up to $770 elsewhere.", "If you are a person with a disability, or you live with a relative who has one, the additional grant raises that to up to $845 and up to $1,045.", "The 2026 grant threshold is an assessed value of $2,075,000, and the grant is reduced by $5 for each $1,000 of assessed value above it.", "Option B is the daily-living or structural-modification route.", "For Option B, Form B (FIN 74) requires health-professional certification of a severe mental or physical impairment likely to continue for at least two years.", "If your assessed value is above the threshold, a separate low income grant supplement may apply when adjusted net income is $32,000 or less."] },
      "steps": ["Read the eligibility page for people with disabilities", "If you qualify through disability assistance, no health professional form is needed and you may optionally file Form FIN 81, Home Owner Grant Consent for Release of Information", "If you qualify on the daily-living or structural-modification route, have a health professional complete Form B (FIN 74), Certificate of Health Professional and Property Owner, with your first application", "Apply for the grant each year, through the province rather than your municipality"],
      "documents": ["Form B (FIN 74), Certificate of Health Professional and Property Owner, for the daily-living or structural-modification route on a first application", "Optionally Form FIN 81, Home Owner Grant Consent for Release of Information", "Your property tax notice"],
      "tips": ["You must apply every year, the grant is not automatic", "You must still pay at least $100 in property taxes", "The higher northern and rural amount ends January 1, 2027"],
      "phone": "Toll free 1-888-355-2700, or 250-387-0555"
    }
  },
  {
    "id": "bc-home-reno-tax-credit",
    "name": "Home Renovation Tax Credit for Seniors and Persons with Disabilities",
    "level": "British Columbia",
    "category": "Tax",
    "amount": "Up to $1,000 per year (10% of up to $10,000 in eligible renovation costs), refundable",
    "summary": "A refundable B.C. tax credit. It is worth 10% of up to $10,000 in accessibility renovations to your principal residence, so up to $1,000 back per year. It is for people who qualify for the disability tax credit, seniors 65+, and family members who live with them.",
    "requires": ["bc", "homeRenoCandidate", "homeowner", "bcHomeRenoSpend"],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a B.C. resident at year end.",
        "You either qualify for the federal disability tax credit (any age), are 65 or older, or are a family member living with (and claiming for) an eligible person."
      ]
    },
    "requiresNote": "You must be a B.C. resident at year end and either qualify for the federal disability tax credit (any age), be 65 or older, or be a family member living with (and claiming for) an eligible person.",
    "note": "Refundable means you get the money even if you owe no tax. Renovations must improve access, mobility or safety in the home. Examples are ramps, grab bars, walk-in tubs, widened doors and stair lifts. General repairs and upgrades that add value do not count. Active for the 2025 and 2026 tax years.",
    "applyText": "Claim on your tax return",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/taxes/income-taxes/personal/credits/seniors-renovation",
    "source": "https://www2.gov.bc.ca/gov/content/taxes/income-taxes/personal/credits/seniors-renovation",
    "detail": {
      "about": "This credit helps cover permanent renovations that make your principal residence more accessible, functional or safe — improving access to the home or land, helping you move around and function at home, or reducing risk of harm. Qualifying examples include wheelchair ramps, grab bars, handrails, walk-in bathtubs, raised toilets, lowered cupboards, adjustable counters, widened doorways, non-slip flooring, motion-activated lighting and stair lifts. Aesthetic upgrades, appliances, regular repairs, HVAC, windows, and mobility equipment like walkers or wheelchairs do not qualify.",
      "aboutList": { "lead": "This credit helps cover permanent renovations that make your principal residence more accessible, functional or safe — improving access to the home or land, helping you move around and function at home, or reducing risk of harm.", "items": ["Qualifying examples include wheelchair ramps, grab bars, handrails, walk-in bathtubs, raised toilets, lowered cupboards, adjustable counters, widened doorways, non-slip flooring, motion-activated lighting and stair lifts.", "Aesthetic upgrades, appliances, regular repairs, HVAC, windows, and mobility equipment like walkers or wheelchairs do not qualify."] },
      "steps": ["Complete eligible renovations to your principal residence and keep all receipts.", "At tax time, complete Schedule BC(S12) — the B.C. Home Renovation Tax Credit for Seniors and Persons with Disabilities form.", "Enter your renovation expenses beside box 60480 on the British Columbia Credits form (BC479).", "File with your T1 return; the credit is refunded even if you owe no tax."],
      "documents": ["Receipts from suppliers and contractors (with GST/HST numbers where applicable)", "Disability tax credit eligibility (if claiming as a person with a disability)"],
      "tips": ["Family members who live with a senior or a person with a disability can claim the credit for work on the shared home.", "The main purpose of the renovation cannot be to increase your property value. Keep documents that show the accessibility purpose.", "You can pair this with the federal Home Accessibility Tax Credit and Multigenerational Home Renovation Credit on the same expenses where the rules allow. Ask your tax preparer."],
      "time": "Claimed annually at tax time",
      "phone": "1-800-959-8281"
    }
  },
  {
    "id": "bc-raha",
    "needsPractitioner": true,
    "name": "B.C. Rebate for Accessible Home Adaptations (BC RAHA)",
    "level": "British Columbia",
    "category": "Health & equipment",
    "amount": "Up to $20,000 in rebates, as a lifetime maximum per household",
    "summary": "A B.C. rebate that pays back part of the cost of home adaptations for independent living. It is for lower-income households where someone has a permanent disability or loss of physical ability. Homeowners apply on their own. Tenants apply together with their landlord.",
    "requires": ["bc", "homeAccessNeed", "rahaEligibility"],
    "eligibility": {
      "mode": "all",
      "items": [
        "You or someone in your household has a permanent disability or loss of physical ability.",
        "The home is the principal residence of the owner(s) and of the person needing the adaptations.",
        "Your combined household assets are less than $100,000, not counting the value of the home being adapted.",
        "Your combined annual gross household income is less than $146,270.00.",
        "Everyone who owns the home, and the person needing the adaptations, is a Canadian citizen, authorized to take up permanent residence in Canada, or a Convention refugee, and not under private sponsorship."
      ],
      "note": "BC Housing also checks your community together with the assessed value of the home, so there is no single home-value cutoff. For this program \"household\" means the owner(s) plus any relative permanently living in the home. Some adaptations need an assessment from an occupational therapist or physical therapist."
    },
    "requiresNote": "You or someone in your household must have a permanent disability or loss of physical ability, and the home must be the principal residence of the owner(s) and of the person needing the adaptations. Your combined household assets must be less than $100,000, not counting the value of the home being adapted, and your combined annual gross household income must be less than $146,270.00. BC Housing also checks your community together with the assessed value of the home, so there is no single home-value cutoff. Everyone who owns the home, and the person needing the adaptations, must be a Canadian citizen, authorized to take up permanent residence in Canada, or a Convention refugee, and not under private sponsorship. For this program \"household\" means the owner(s) plus any relative permanently living in the home. Some adaptations need an assessment from an occupational therapist or physical therapist.",
    "note": "Adaptations completed before BC Housing gives written approval are not eligible for a rebate. Once approved you have 180 days to finish the work.",
    "applyText": "Apply for BC RAHA",
    "applyUrl": "https://www.bchousing.org/housing-assistance/BC-RAHA",
    "source": "https://www.bchousing.org/housing-assistance/BC-RAHA",
    "detail": {
      "about": "BC RAHA provides rebates so people can adapt their home for independent living. The lifetime maximum is $20,000 per household, and individual adaptations have their own caps set out in BC Housing.s Maximum Rebate Schedule. Applications are taken first-come, first-served until the funding for the year runs out, and the funding renews on April 1 each year. BC Housing aims to assess a completed application within 8 weeks, and pays within 3 weeks of receiving the final documents once the work is done. If you rent, the unit must be a legal, self-contained home with its own full kitchen and bathroom, and the tenant must be living independently rather than in assisted living. Tenants apply jointly with their landlord, and members of a housing co-operative use the landlord-and-tenant route.",
      "aboutList": { "lead": "BC RAHA provides rebates so people can adapt their home for independent living.", "items": ["The lifetime maximum is $20,000 per household, and individual adaptations have their own caps set out in BC Housing's Maximum Rebate Schedule.", "Applications are taken first-come, first-served until the funding for the year runs out, and the funding renews on April 1 each year.", "BC Housing aims to assess a completed application within 8 weeks, and pays within 3 weeks of receiving the final documents once the work is done.", "If you rent, the unit must be a legal, self-contained home with its own full kitchen and bathroom, and the tenant must be living independently rather than in assisted living.", "Tenants apply jointly with their landlord, and members of a housing co-operative use the landlord-and-tenant route."] },
      "steps": ["Check the property and adaptation eligibility pages, and use the BC RAHA Calculator to see whether you might qualify", "Get an occupational therapist or physical therapist assessment if your adaptation needs one", "Submit the BC RAHA Homeowner Application, or the Landlord and Tenant Application if you rent, with the documents it lists", "Wait for written approval from BC Housing before any work starts, then complete the work within 180 days"],
      "documents": ["The BC RAHA Homeowner Application, or the Landlord and Tenant Application if you rent", "An occupational therapist or physical therapist assessment where the adaptation requires one", "Contractor quotes", "Proof of household income and assets as listed in the application"],
      "tips": ["Do not start work before written approval, because anything finished first is not eligible", "Funding renews April 1 and applications are first-come first-served, so apply early in the year", "You have 180 days from written approval to finish", "The $20,000 is a lifetime maximum for the household, not per adaptation", "BC Housing publishes an eligibility calculator at bcrahacalculator.bchousing.org. It takes a few minutes. It tells you if you are likely to qualify before you fill in the full application."],
      "time": "BC Housing aims to assess completed applications within 8 weeks, and pays within 3 weeks after the work is done and documents are received.",
      "phone": "604-433-2218 in the Lower Mainland, or toll free 1-800-257-7756"
    }
  },
  {
    "id": "bc-work-able-internship",
    "name": "Work-Able Accessible Employment Program (BC Public Service)",
    "level": "British Columbia",
    "category": "Work",
    "amount": "Paid BC Public Service internship of up to 24 months",
    "summary": "A paid internship program in the BC Public Service for recent post-secondary graduates who self-identify as having a disability. This can be any physical, sensory, neurological, visible or invisible disability.",
    "requires": ["bc", "age18plus", "employmentActive", "bcWorkAbleSelfIdentify", "recentGraduate"],
    eligibility: {
      mode: "all",
      items: [
        "You are a recent post-secondary graduate with a two-year diploma, associate degree, bachelor's degree, master's degree or doctorate from a recognized post-secondary institution.",
        "Your graduation date is within 3 years of the program start date.",
        "You self-identify as having a disability.",
      ],
      note: "You do not have to disclose your specific diagnosis.",
    },
    "requiresNote": "You must be a recent post-secondary graduate with a two-year diploma, associate degree, bachelor's degree, master's degree or doctorate from a recognized post-secondary institution, with a graduation date within 3 years of the program start date, and self-identify as having a disability. You do not have to disclose your specific diagnosis.",
    "note": "Intake runs every year. Applications for the 2026/27 cohort are closed. The page says to check back in Spring 2027 for information on the 2027/28 intake. Graduates keep access to internal BC Public Service job postings for 24 months after they finish the program.",
    "applyText": "Check intake dates and apply",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/careers-myhr/job-seekers/internship-co-op-opportunities/work-able",
    "source": "https://www2.gov.bc.ca/gov/content/careers-myhr/job-seekers/internship-co-op-opportunities/work-able",
    "detail": {
      "about": "Work-Able coordinates paid internship opportunities across the BC Public Service for recent graduates with disabilities, for up to 24 months. Participants get government work experience, a peer cohort of other graduates with disabilities, exposure to different career paths, and post-program access to internal job postings.",
      "steps": ["Check the Work-Able page in Spring 2027 for information on the 2027/28 intake, or contact the Work-Able team to be notified when the next application period opens.", "Confirm you graduated within 3 years of the program start date.", "Apply online during the intake window; you self-identify as having a disability without disclosing a diagnosis.", "If selected, you are placed in a paid position with a ministry."],
      "documents": ["Proof of post-secondary graduation (within 3 years of program start)", "Resume"],
      "tips": ["Contact the Work-Able team to be notified when the next application period opens.", "Workplace accommodations are part of the program's design, so you do not need to negotiate them alone."],
      "time": "Annual intake; internships run up to 24 months"
    }
  },
  {
    "id": "bc-workbc-assistive-technology",
    "name": "WorkBC Assistive Technology Services",
    "level": "British Columbia",
    "category": "Equipment",
    "amount": "Equipment and supports funded fully or partially, based on your financial circumstances",
    "summary": "Funding for assistive technology you need to get or keep a job. This includes devices and equipment, ergonomic furniture, communication and hearing devices, ASL interpreting and captioning, and workplace modifications. It even includes vehicle modifications for getting to work.",
    "requires": ["bc", "age16plus", "employmentActive", "disabilityDoc"],
    eligibility: {
      mode: "all",
      items: [
        "You are 16 or older.",
        "You are a B.C. resident legally eligible to work.",
        "You are not a full-time student, unless you are in your final year.",
        "You have a work-related barrier due to a disability or functional limitation.",
      ],
      note: "Volunteering toward a longer-term employment goal counts. Self-employment counts if you can show proof of regular income.",
    },
    "requiresNote": "You must be 16 or older, a B.C. resident legally eligible to work, not a full-time student (unless in your final year), and have a work-related barrier due to a disability or functional limitation. Volunteering toward a longer-term employment goal counts, and so does self-employment with proof of regular income.",
    "note": "Covers employment-related needs, including volunteer work that is part of a longer-term employment goal. It does not cover medical treatments and therapies, items for daily living, or employment services such as job coaching or wage subsidies. It is delivered under contract to the province, with regional offices in Burnaby, Kelowna, Nanaimo and Victoria.",
    "applyText": "Apply online",
    "applyUrl": "https://apply.workbc.ca/",
    "source": "https://www.workbc.ca/get-support/assistive-technology-pwd",
    "detail": {
      "about": "Assistive Technology Services (ATS) removes equipment barriers between you and employment. It funds assistive devices and technology, ergonomic supports like furniture and lighting, restorative supports, ASL interpreting and captioning, communication and hearing devices for work, workplace access modifications, and vehicle modifications needed for employment. How much is covered depends on your financial circumstances.",
      "aboutList": { "lead": "Assistive Technology Services (ATS) removes equipment barriers between you and employment.", "items": ["It funds assistive devices and technology, ergonomic supports like furniture and lighting, restorative supports, ASL interpreting and captioning, communication and hearing devices for work, workplace access modifications, and vehicle modifications needed for employment.", "How much is covered depends on your financial circumstances."] },
      "steps": ["Apply through WorkBC Online Employment Services (apply.workbc.ca) or contact ATS directly.", "An ATS specialist works with you to understand your work barrier and equipment needs.", "Approved equipment and services are arranged fully or partially funded."],
      "documents": ["Proof you are a B.C. resident eligible to work", "Information about your job, job offer, self-employment (needs proof of regular income) or volunteer role", "Details of the disability-related barrier and equipment needs (ATS helps document this)"],
      "tips": ["Commuting barriers count. Vehicle modifications and travel-related equipment can be funded when needed for work.", "You can use ATS while you have a job to keep it, not just when job hunting.", "Email info-ats@workbc.ca if you are unsure whether your situation qualifies."],
      "time": "Varies by request; contact ATS for current timelines",
      "phone": "1-844-453-5506"
    }
  },
  {
    "id": "bc-workbc-employment-services",
    "name": "WorkBC Employment Services",
    "level": "British Columbia",
    "category": "Work",
    "amount": "Free employment services, including work experience and wage subsidies. Funding support for training, transportation, dependent care and employment-related disability supports may be available, typically for clients with an employment plan.",
    "summary": "BC's free public employment service. Help finding work, possible funding support for training, and possible financial supports, with services built specifically for people with disabilities.",
    "requires": ["bc", "age16plus", "bcWorkBcRoute"],
    "requiresNote": "Check whether you are eligible by applying online at apply.workbc.ca. Staff can support you in completing your application.",
    "note": "If you have a disability, job search help includes working with employers to shape or customize jobs to meet your needs. Funding for assistive technology is covered by a separate program in this catalog: WorkBC Assistive Technology Services.",
    "applyText": "Apply online at WorkBC",
    "applyUrl": "https://www.workbc.ca/get-support/workbc-centre-services",
    "source": "https://www.workbc.ca/get-support/workbc-centre-services",
    "detail": {
      "about": "WorkBC centres provide free employment services including job-search help, work experience and wage subsidies. Funding support for training and employment-related disability supports may be available, typically for clients with an employment plan. A WorkBC counsellor reviews eligibility and builds the plan with you.",
      "aboutList": {
        "lead": "WorkBC centre services and possible funding:",
        "items": [
          "Free employment services including job-search help, work experience and wage subsidies.",
          "Funding support for training and employment-related disability supports may be available, typically for clients with an employment plan.",
          "A WorkBC counsellor reviews eligibility and builds the plan with you."
        ]
      },
      "steps": ["Get a Basic BCeID or set up online access with a BC Services Card", "Register for Online Employment Services and select WorkBC Employment Services", "Complete the application, including work status, barriers and the WorkBC centre you want to use", "Upload requested documents and communicate with the centre through the secure portal", "Meet an employment counsellor to confirm eligibility and create a personal action plan"],
      "documents": ["Valid Social Insurance Number", "Information showing you are legally allowed to work in B.C.", "Work and education history", "Information about disability-related employment barriers if requesting specialized supports"],
      "tips": [
        "You do not need a phone number or a fixed mailing address to submit the online application",
        "Centre staff can help you complete the application",
        "People with disabilities can qualify in more work or student situations. These include being at risk of losing a job or being in the final year of school",
        "Financial supports are typically for clients who are case managed through WorkBC. That means you have an employment plan and work with an employment specialist.",
        "Dependent care covers childcare while you are job searching."
      ],
      "time": "The local WorkBC centre decides eligibility after reviewing the completed application",
      "phone": "Contact your selected WorkBC centre"
    }
  },
  {
    "id": "bc-fuel-tax-refund-disabilities",
    "name": "Fuel Tax Refund for Persons with Disabilities",
    "level": "British Columbia",
    "category": "Transit",
    "amount": "You may receive a fuel tax refund of up to $500 each calendar year for a qualifying vehicle registered in the program, and a 25% discount off ICBC basic Autoplan insurance (including electric vehicles)",
    "summary": "Refunds the provincial fuel tax on a vehicle you own, lease or have an ownership interest in. If you are eligible for the program, you may also receive 25% off your basic ICBC insurance.",
    "requires": ["bc", "vehicleOwner", "bcFuelTaxRoute"],
    eligibility: {
      mode: "any",
      items: [
        "B.C. Disability Assistance Certification",
        "Letter from the British Columbia Aboriginal Network on Disability Society (BCANDS) confirming you receive disability assistance or a supplement from the Social Assistance for Persons with Disability program in accordance with the Indigenous Services Canada Social Development Program – Policy and Procedures Handbook – BC Region. The letter from BCANDS must state the date you were enrolled in the Social Assistance for Persons with Disability program and the end date (if applicable)",
        "Letter from Veterans' Affairs confirming you receive a 100% disability pension. This letter must state: That you receive a 100% disability pension through service while in His Majesty's forces, and The date you began receiving the disability pension",
        "Letter from the Canadian National Institute for the Blind (CNIB) confirming permanent sight impairment. The letter from CNIB must state: That you have a permanent sight impairment, That you are not eligible to hold a driver's licence, and The effective date of the impairment",
        "Medical certification confirming one of the following conditions: Loss of a limb",
        "Medical certification confirming one of the following conditions: Permanent dependence on a wheelchair",
        "Medical certification confirming one of the following conditions: Complete and permanent functional loss of lower limbs",
        "Medical certification confirming one of the following conditions: Permanent impairment of movement to the extent that use of public transportation would be hazardous (whether or not it's available)",
        "Medical certification confirming one of the following conditions: Permanent mental disability to the extent that use of public transportation would be hazardous (whether or not it's available)",
        "Medical certification confirming one of the following conditions: Permanent sight impairment to the extent that you're not eligible to hold a driver's licence",
      ],
      note: "You must be 16 or older and must also own or lease a vehicle, or have an ownership interest in a vehicle",
    },
    "requiresNote": "You must be 16 years old or older and own or lease a vehicle, or have an ownership interest in a vehicle. Confirm your disability through one of the routes below, including all the listed letter conditions and dates.",
    "note": "Register first. You can apply for a refund only after your registration is confirmed. Register with the Ministry of Finance online or with a downloadable form. Then you get a registration confirmation letter. After that, you can claim refunds.",
    "applyText": "Register for the fuel tax refund",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/motor-fuel-carbon-tax/refund-disabilities",
    "source": "https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/motor-fuel-carbon-tax/refund-disabilities",
    "detail": {
      "about": "This is a two-stage program: register the person and qualifying vehicle first, then claim fuel-tax refunds using original receipts after the registration effective date.",
      "steps": ["Gather the disability confirmation and vehicle ownership or lease information listed by the Ministry of Finance", "Register online or submit form FIN 119 with every required supporting document", "Wait for the mailed registration confirmation letter and note the registration effective date", "Keep original fuel receipts from that effective date onward", "Submit the refund application with eligible receipts; the ministry must receive a claim within four years of the fuel purchase"],
      "documents": [
        "Accepted disability confirmation or medical certification, with all the conditions and dates listed above",
        "Your driver's licence number; if you do not have a valid driver's licence, a copy of other government-issued ID confirming your date of birth and legal name",
        "Vehicle registration or lease information; if you are not the registered owner or lessee but have an ownership interest, a completed Appendix 3 – Vehicle Ownership Declaration",
        "If you are registering and signing on behalf of another person who is 19 or older, a copy of a power of attorney or representation agreement with the registration documents",
        "Original receipts showing date, fuel type, litres, and seller name and address",
      ],
      "tips": ["Do not claim fuel bought before the registration effective date", "Incomplete registration packages delay approval"],
      "time": "Processing takes up to 4 weeks. Registration must be approved before any refund claim",
      "phone": "1-877-388-4440"
    }
  },
  {
    "id": "bc-icbc-disability-discount",
    "name": "ICBC Disability Discount (Basic Autoplan)",
    "level": "British Columbia",
    "category": "Transit",
    "amount": "You may receive 25% off ICBC basic Autoplan insurance (including electric vehicles) if you are eligible for the fuel tax refund program for persons with disabilities",
    "summary": "If you are eligible for the provincial fuel tax refund program for persons with disabilities, you may receive 25% off the basic part of your ICBC vehicle insurance.",
    "requires": ["bc", "bcVehicleDisabilityRoute", "vehicleOwner", "bcFuelTaxRegistered"],
    "requiresNote": "You must be 16 or older. You may receive it if you are eligible for the Fuel Tax Refund Program for Persons with Disabilities — the same disability confirmations listed there apply.",
    "note": "Register for the Fuel Tax Refund Program for Persons with Disabilities first. Then talk to an Autoplan broker about applying the discount to your policy.",
    "applyText": "Start with the fuel tax refund program",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/motor-fuel-carbon-tax/refund-disabilities",
    "source": "https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/motor-fuel-carbon-tax/refund-disabilities",
    "detail": {
      "about": "The discount is applied through an Autoplan broker after the Ministry of Finance registers you in the Fuel Tax Refund Program for Persons with Disabilities.",
      "steps": ["Complete the provincial Fuel Tax Refund Program registration", "Wait for the Ministry of Finance registration confirmation", "Bring the confirmation and vehicle information to an Autoplan broker", "Ask the broker to apply the disability discount to eligible Basic Autoplan coverage"],
      "documents": ["Fuel Tax Refund Program registration confirmation", "Vehicle registration and current Autoplan policy information", "Identification requested by the broker"],
      "tips": ["The discount applies to Basic Autoplan, not to every optional coverage charge", "Ask the broker when the discount will start if your policy is already active", "Electric vehicles can get the insurance discount even though they do not use fuel"],
      "time": "Ask an Autoplan broker after provincial registration is confirmed"
    }
  },
  {
    "id": "bc-property-tax-deferment-disabilities",
    "name": "Property Tax Deferment for Persons with Disabilities",
    "level": "British Columbia",
    "category": "Tax",
    "amount": "A low-interest provincial loan that pays your annual property taxes; interest is 2% above the prime rate, plus a $60 application fee and a $10 annual renewal fee",
    "summary": "Instead of you paying your property taxes each year, the province pays them and registers a loan against your home. You repay when you sell or transfer it.",
    "requires": ["bc", "age18plus", "dailyLivingLimit", "bcPwdStatus", "homeowner", "citizenPR", "bcDefermentProperty"],
    eligibility: {
      mode: "all",
      items: [
        "You are designated as a person with disabilities under the Employment and Assistance for Persons with Disabilities Act — a severe mental or physical impairment likely to continue at least two years that directly and significantly restricts your ability to perform daily living activities and requires an assistive device, supervision, or the services of an assistance animal.",
        "You have and maintain a minimum equity of 25 percent of the property's assessed value.",
      ],
    },
    "requiresNote": "You must be designated as a person with disabilities under the Employment and Assistance for Persons with Disabilities Act — a severe mental or physical impairment likely to continue at least two years that directly and significantly restricts your ability to perform daily living activities and requires an assistive device, supervision, or the services of an assistance animal. You must also have and maintain a minimum equity of 25 percent of the property's assessed value.",
    "note": "The 25 percent equity rule means your charges plus deferred taxes cannot be more than 75 percent of the BC Assessment value of your home. For taxes deferred for the 2026 tax year and later, interest compounds monthly. You are not charged interest on the application or renewal fees.",
    "applyText": "Check eligibility and apply",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/annual-property-tax/property-tax-deferment-program/eligibility",
    "source": "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/annual-property-tax/property-tax-deferment-program/eligibility",
    "detail": {
      "about": "Property tax deferment is a loan secured against the home, not a grant. Interest and fees are added to the account, and eligibility must be maintained.",
      "steps": ["Check the regular-program eligibility rules, including B.C. residency, citizenship or permanent residency, principal residence and at least 25% equity", "Pay all previous-year property taxes, utility user fees, penalties and interest", "Gather each owner's Social Insurance Number, birth date and property-tax notice", "Apply online between May 1 and December 31; applying after the local due date can still cause late penalties", "Check application status and renew each year unless you choose and remain eligible for auto-renewal"],
      "documents": ["Current property-tax notice and jurisdiction information", "Social Insurance Number and date of birth for each owner", "PWD designation information or physician certification requested by the program", "Mortgage and other registered-charge information needed to verify equity"],
      "tips": ["Apply before the municipality's tax due date. This avoids late penalties while the province reviews your application", "Confirm the current interest rate. Know that interest compounds for 2026 and later deferrals", "Do not use this program if you have already paid this year's property taxes in full"],
      "time": "Applications and renewals are accepted May 1 to December 31 each year"
    }
  },
  {
    "id": "bc-sales-tax-credit",
    "name": "B.C. Sales Tax Credit",
    "level": "British Columbia",
    "category": "Tax",
    "amount": "Up to $75 for yourself and $75 for a cohabiting spouse or common-law partner",
    "summary": "A small refundable credit you claim on your tax return. It is not a disability program. It helps people with a low income who file a return.",
    "requires": ["bc", "bcStcAgeOrFamily", "lowIncome"],
    eligibility: {
      mode: "all",
      items: [
        "You were a B.C. resident on December 31.",
        "You were 19 or older, or had a spouse or common-law partner, or were a parent.",
      ],
    },
    "requiresNote": "You were a B.C. resident on December 31 and were either 19 or older, or had a spouse or common-law partner, or were a parent.",
    "note": "The credit goes down by 2% of your net income over $15,000 if you are single. For couples, it goes down by 2% of family net income over $18,000. So it phases out at a low income. It is refundable up to the amount that is more than the income tax you owe. This means you can get it even if you owe no tax.",
    "applyText": "See how to claim it",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/taxes/income-taxes/personal/credits/sales-tax",
    "source": "https://www2.gov.bc.ca/gov/content/taxes/income-taxes/personal/credits/sales-tax",
    "detail": {
      "about": "Claim it when you file your T1 Income Tax Return using the British Columbia Credits form (BC479). You must claim within three years after the end of the tax year.",
      "steps": ["File the federal T1 income tax return for the year", "Complete the B.C. Credits form BC479", "Enter the sales tax credit claim from BC479 with the return", "If you missed it, ask the Canada Revenue Agency to adjust the return within three years after the tax year"],
      "documents": ["Tax slips and income information for the year", "Spouse or common-law partner income information when applicable", "Form BC479"],
      "tips": ["File even if you owe no income tax, because this credit is refundable", "The credit depends on your income and is not only for people with disabilities", "Ask the CRA if you have questions about the tax return and refund"],
      "time": "Claimed with the annual tax return",
      "phone": "Canada Revenue Agency: 1-800-959-8281"
    }
  },
  {
    "id": "vancouver-leisure-access",
    "name": "Leisure Access Program (LAP)",
    "level": "Vancouver",
    "category": "Recreation",
    "amount": "Free admission to pools and rinks, 50% off fitness centre admission and group swimming and skating lessons, and a pass valid for 3 years",
    "summary": "Vancouver's low-income recreation pass. Swimming and skating admission are free; outdoor pools require an online reservation. Fitness centre admission, group swimming and skating lessons and other listed programs are half price.",
    "requires": [
      "bc",
      "vancouver",
      "lowIncome"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "Child Disability Benefit: a family with a child up to 17 that receives the Child Disability Benefit, shown on its Canada Child Benefit notice",
        "Disability Tax Credit: you, your spouse or partner, or a dependent aged 18 or older qualifies for the Disability Tax Credit, and your family's combined net income is at or below the table maximum",
        "Income assistance: you receive income assistance or one of the listed provincial or federal subsidies (for example MSDPR assistance, Guaranteed Income Supplement, RAP, SAFER or a valid red bus pass)",
        "Agency referral: you are a client of a non-profit or government agency that can refer you",
        "Asylum seeker or temporary foreign worker: the non-profit or government agency you are a client of refers you (Third Party Referral form)",
        "Low income without income assistance, and you cannot be referred: your net family income is at or below the table maximum",
        "Employment Insurance: you are receiving EI benefits in 2026/2027, and your projected family income is at or below the table maximum"
      ],
      "note": "You must be a resident of the City of Vancouver (UBC and the University Endowment Lands are not in the City). Leisure Access is not available to immigrants classified as investors or entrepreneurs. It is also not available to individuals or families with combined interest and other investment income (line 12100) over $1,500, net rental income (line 12600) over $2,000, or capital gains (line 12700) over $2,000."
    },
    "requiresNote": "You must be a City of Vancouver resident and meet one of the routes below, including its income or referral conditions and the exclusions.",
    "note": "Starting January 1, 2026, Leisure Access passes are valid for 3 years. A pass issued in 2026 does not expire until 2029. Note that UBC and the University Endowment Lands are not in the City of Vancouver.",
    "applyText": "Apply for a Leisure Access pass",
    "applyUrl": "https://vancouver.ca/parks-recreation-culture/leisure-access-card.aspx",
    "source": "https://vancouver.ca/parks-recreation-culture/leisure-access-card.aspx",
    "detail": {
      "about": "The pass adds free or reduced recreation access to a Vancouver Park Board OneCard and ActiveNet account. The route and documents depend on whether you qualify through a listed benefit, an agency referral or the low-income application.",
      "steps": [
        "Open the City's page and choose the application route matching your situation",
        "Complete the Leisure Access application and gather the documents listed for that route",
        "Submit it at a Park Board community centre or by the stated mail process",
        "After approval, have the Leisure Access membership added to the OneCard and ActiveNet account",
        "For a child 16 or younger, complete the parent or guardian photo-consent form"
      ],
      "documents": [
        "Proof of a qualifying benefit or current Proof of Income Statement, depending on route",
        "Proof of a City of Vancouver address dated within 90 days",
        "Government-issued identification",
        "OneCard photo consent for children 16 and younger",
        "2025 Canada Child Benefit notice (Child Disability Benefit route)",
        "2025 Proof of Income Statement verifying receipt of the Disability Tax Credit (not a Notice of Assessment)",
        "Original Third Party Referral form completed by the referring agency within 90 days, signed and dated by you (agency referral routes)",
        "Family members' 2025 tax year Proof of Income Statement (EI route)",
        "Service Canada letter showing your Employment Insurance start and finish date and benefit rate (EI route)"
      ],
      "tips": [
        "A Notice of Assessment is not the same as the CRA Proof of Income Statement asked for on the low-income route",
        "UBC and University Endowment Lands addresses are outside the City of Vancouver",
        "Bring the pass and photo identification when a partner venue asks for both"
      ],
      "time": "Ask the Leisure Access office when submitting"
    },
    "amountTiers": {
      "caption": "Maximum net family income by route (EI route: projected family income)",
      "headers": [
        "Family size",
        "Disability Tax Credit route",
        "Low-income self-referral and EI routes"
      ],
      "rows": [
        [
          "1 person",
          "$53,166",
          "$43,028"
        ],
        [
          "2 people",
          "$70,972",
          "$60,834"
        ],
        [
          "3 people",
          "$84,645",
          "$74,507"
        ],
        [
          "4 people",
          "$96,171",
          "$86,033"
        ],
        [
          "5 people",
          "$106,325",
          "$96,187"
        ],
        [
          "6 people",
          "$115,506",
          "$105,368"
        ],
        [
          "7 people",
          "$123,948",
          "$113,810"
        ],
        [
          "Each additional person",
          "Not stated on the page",
          "Add $8,450"
        ]
      ]
    }
  },
  {
    "id": "surrey-leisure-access",
    "name": "Leisure Access Program (LAP)",
    "level": "Surrey",
    "category": "Recreation",
    "amount": "Free 1-year pass for ages 0-18 and 60+, or 75% off for adults 19-59, plus 75% off most registered courses",
    "summary": "Surrey's recreation subsidy. Children, youth and seniors get a free year-long pass to every City recreation facility. Adults get three quarters off.",
    "requires": [
      "bc",
      "surrey",
      "surreyLeisureRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "Income tax documents: your family's combined net income (line 23600) is less than the maximum for your family size in the table, and the City's other income-line limits are met",
        "Client of the Ministry of Social Development",
        "Disability Tax Credit applicants must meet the City's family-income and other income-line limits.",
        "Senior receiving the Guaranteed Income Supplement",
        "Child or youth in qualifying legal care, or a young adult supported by the Ministry's SAJE program.",
        "Refugee, with a referral application completed through an approved settlement services agency"
      ],
      "note": "You must be a Surrey resident. The City says you may qualify if one of these situations applies. For the Disability Tax Credit route, your family's combined net income, after subtracting the Disability Tax Credit amounts the City's page lists, must be less than the maximum for your family size, and the City's other income-line limits must be met. The legal-care route covers a child or youth aged 0-18 in the legal care of the Ministry of Children and Family Development, Métis Family Services or Vancouver Aboriginal Child and Family Services Society, or a young adult aged 19-25 supported by the Ministry's SAJE program; enrolment covers the child or youth and one legal guardian."
    },
    "requiresNote": "You may qualify if you are a Surrey resident and one of the City's routes applies. See the route list and its income, legal-care and referral conditions below.",
    "note": "Enrolment is valid for one year. If you apply with income tax documents, your family's combined net income must be less than the maximum for your family size in the table. This is line 23600 of your Notice of Assessment or Proof of Income Statement. A family is one or two married or common-law adults and their legal dependents aged 18 and under. In the year you are enrolled, course discounts have limits. For ages 0-18, the limit is up to $500 plus $500 at Semiahmoo Arts Society. For adults 19-59 and seniors 60+, it is up to $250 plus $250. Applicable day camps for children (0 to 12) and youth (13 to 18) get 75% off with no discount limits. A few specialty programs are not included.",
    "applyText": "Apply for the Leisure Access Program",
    "applyUrl": "https://www.surrey.ca/parks-recreation/activities-registration/admissions-passes/leisure-access-program",
    "source": "https://www.surrey.ca/parks-recreation/activities-registration/admissions-passes/leisure-access-program",
    "detail": {
      "about": "Surrey accepts several qualifying routes. Income-tax and Disability Tax Credit applicants must meet the family-income test and the line 12100, 12600, 20800 and 25400 limits on the City's page.",
      "steps": [
        "Review the City's qualifying routes and select the one that applies",
        "Complete the Leisure Access Program application and copy the documents required for that route",
        "Submit online and wait for staff to schedule an appointment, or submit in person at a listed Surrey facility",
        "After approval, use the pass through the MySurrey account or call registration staff"
      ],
      "documents": [
        "Application form",
        "Government-issued photo identification for one adult",
        "Proof of Income Statement for each adult in the family, when applying with income tax documents",
        "Program confirmation, DTC information or referral documents for another qualifying route",
        "Canada Child Benefit Notice, Goods and Services Tax Credit Notice or Canada Groceries and Essentials Benefit Notice (income-tax and DTC routes; MSD and GIS routes only if children aged 0-18 or a spouse in the family are not listed on the letter)"
      ],
      "tips": [
        "Translation and interpretation support are available free",
        "As of September 1, 2026, income tax documents must be for the 2025 or 2026 tax year.",
        "Ask whether a specialty program is excluded before you register"
      ],
      "time": "Online applicants are contacted for appointments on a first-come, first-served basis",
      "phone": "604-502-6325"
    },
    "amountTiers": {
      "caption": "Family net income maximum for the Leisure Access Program — only for patrons applying with income tax documents",
      "headers": [
        "Family size",
        "Family net income"
      ],
      "rows": [
        [
          "1",
          "$26,355"
        ],
        [
          "2",
          "$32,075"
        ],
        [
          "3",
          "$39,940"
        ],
        [
          "4",
          "$49,829"
        ],
        [
          "5",
          "$56,742"
        ],
        [
          "6",
          "$62,928"
        ],
        [
          "7",
          "$69,112"
        ],
        [
          "8 and more",
          "$6,186 for each additional person"
        ]
      ]
    }
  },
  {
    "id": "burnaby-fair-play",
    "name": "FAIR Play Program",
    "level": "Burnaby",
    "category": "Recreation",
    "amount": "$250 credit per youth, adult or senior, $500 per child, plus an annual Be Active Pass for each family member",
    "summary": "Burnaby gives every eligible family member a recreation credit and a free annual Be Active Pass. The pass is in addition to the credit. It is not paid for out of the credit.",
    "requires": ["bc", "burnaby", "burnabyFairPlayRoute"],
    eligibility: {
      mode: "any",
      items: [
        "You receive federal or provincial government income assistance.",
        "Your combined family income is within the FAIR Play income scale.",
        "You apply for a child with a disability and currently receive the Child Disability Benefit. This application is only for your child.",
        "You are a government or privately sponsored refugee.",
        "You have current Canadian Ukraine Emergency Travel Authorization (CUAET).",
        "You have an approved agency referral; no household application is required.",
      ],
      note: "You must also live in Burnaby.",
    },
    "requiresNote": "You must live in Burnaby and meet one of these: you receive federal or provincial government income assistance; you meet the income criteria; you apply on behalf of a child with a disability and currently receive the Child Disability Benefit (this application is only for your child); you are a government or privately sponsored refugee or have current Canadian Ukraine Emergency Travel Authorization (CUAET); or you have an approved agency referral.",
    "note": "You can apply once a year, and the credit is valid for a year. Unused credit is removed when it expires and has no cash value. The FAIR Play Program replaced the older Recreation Credit Program on March 1, 2024.",
    "applyText": "Apply for FAIR Play",
    "applyUrl": "https://www.burnaby.ca/services-and-payments/seniors-and-family-support/fair-play-program",
    "source": "https://www.burnaby.ca/services-and-payments/seniors-and-family-support/fair-play-program",
    "detail": {
      "about": "Each approved family member receives both a Be Active Pass and recreation credit. The City accepts income-assistance, income, child-disability, refugee or current CUAET, and approved-agency-referral routes.",
      "steps": ["For a household application, download and print the FAIR Play application or pick up a copy at a Burnaby recreation or culture facility", "Choose the qualifying route and gather the supporting documents listed on the form", "For a household application, complete the household information and submit using the City's instructions", "For an approved agency referral, no household application is required", "Instead, your approved referral agency worker can complete and submit a FAIR Play Agency Referral Form directly to the FAIR Play Office on your behalf", "After approval, use the Be Active Pass and apply the recreation credit during online or staff-assisted registration"],
      "documents": ["Completed FAIR Play application for the household application route", "FAIR Play Agency Referral Form submitted by your approved referral agency worker instead of a household application for the agency-referral route", "Proof of Burnaby residence", "Income, assistance, child-disability, refugee, current CUAET or agency-referral documentation for the chosen route"],
      "tips": ["Burnaby Community Services can help with translation, documents and the application", "Credit expires after one year and cannot be paid out as cash", "During online registration, check that the recreation-credit box is applied to the balance"],
      "time": "Apply once per year; ask the City for current processing time"
    }
  },
  {
    "id": "richmond-rec-fee-subsidy",
    "name": "Recreation Fee Subsidy Program (RFSP)",
    "level": "Richmond",
    "category": "Recreation",
    "amount": "Unlimited free admission to many drop-in programs and services plus 90% off most registered programs, up to $300 a year for children and youth or $100 a year for adults and seniors",
    "summary": "Richmond's recreation subsidy for residents in financial hardship — free admission to many drop-in programs and services with no cap on visits, and nine tenths off most registered programs.",
    "requires": ["bc", "richmondbc", "richmondFinancialHardship"],
    eligibility: {
      mode: "all",
      items: [
        "You live in Richmond.",
        "You are in financial hardship, shown either by receiving one of the government assistance programs the City lists (for example Disability Assistance or the Canada Disability Benefit), or, if you do not receive them, by meeting the City's family net income and other financial limits.",
      ],
    },
    "requiresNote": "You must live in Richmond and be in financial hardship, shown either by receiving one of the government assistance programs the City lists (for example Disability Assistance or the Canada Disability Benefit), or, if you do not receive them, by meeting the City's family net income and other financial limits. The City defines hardship as difficulty paying for basic living costs such as food, clothing and housing, without savings or other financial resources.",
    "note": "The 90% discount on most registered programs is capped at $300 per year in subsidy for children and youth 18 and under, and $100 per year for adults and seniors 19 and over. Free admission to eligible drop-in programs is not capped.",
    "applyText": "Apply for the Recreation Fee Subsidy",
    "applyUrl": "https://www.richmond.ca/culture/social/accessibility/subsidies/recreation-fee.htm",
    "source": "https://www.richmond.ca/culture/social/accessibility/subsidies/recreation-fee.htm",
    "detail": {
      "about": "Participants get unlimited free admission to many drop-in services and a 90% discount on most registered City and participating community programs, subject to the annual registered-program subsidy cap.",
      "steps": ["Download the application for the current program year and review the two financial-hardship qualification methods", "Complete one application per family or couple and attach the documents for the selected method", "Submit by email, mail or at a Richmond recreation facility, Cultural Centre or City Hall", "If help is needed, book an in-person support appointment at City Hall", "Keep the approval letter and use the subsidy when registering for eligible activities"],
      "documents": ["Completed current-year application", "Proof of Richmond residence", "Government-assistance confirmation or current income and financial-hardship documents required by the form"],
      "tips": ["Use the application for the correct program year", "Help with the application in person is by appointment, not drop-in", "Before you register, ask whether a program counts toward the annual discounted-program cap"],
      "time": "Current 2026–2027 applications cover September 1, 2026 to August 31, 2027",
      "phone": "604-247-4909"
    }
  },
  {
    "id": "victoria-life",
    "name": "L.I.F.E. Program (Leisure Involvement For Everyone)",
    "level": "Victoria",
    "category": "Recreation",
    "amount": "Two years of unlimited free drop-ins at Victoria Recreation Centre (opening planned early 2027) and public skating at Save-On-Foods Memorial Arena, 52 free regional drop-ins a year, plus a program credit of $80 to $120 depending on age",
    "summary": "Victoria's low-income recreation membership. It runs two years from your approval date, not by calendar year, and covers drop-ins at Victoria Recreation Centre (opening planned early 2027), public skating and regional partner drop-ins.",
    "requires": ["bc", "victoria", "lowIncome"],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a City of Victoria resident with a fixed address, have lived there for the previous 30 days, and can demonstrate proof of residency.",
        "Your household income is at or below the Statistics Canada low-income threshold for your household size (see the table below). All family members and dependants at the same address are included.",
      ],
    },
    "amountTiers": {
      "caption": "Income eligibility — Statistics Canada low-income threshold by household size",
      "headers": ["Household size", "Household income at or below"],
      "rows": [
        ["1 person", "$29,640"],
        ["2", "$38,493"],
        ["3", "$47,145"],
        ["4", "$55,076"],
        ["5", "$62,464"],
        ["6", "$70,451"],
        ["7", "$78,436"],
      ],
    },
    "requiresNote": "You must be a City of Victoria resident with a fixed address, have lived there for the previous 30 days, and be able to demonstrate proof of residency. Household income must be at or below the Statistics Canada low-income threshold: $29,640 for 1 person, $38,493 for 2, $47,145 for 3, $55,076 for 4, $62,464 for 5, $70,451 for 6 and $78,436 for 7. All family members and dependants at the same address are included.",
    "note": "Membership is valid for two years. The two years start on your approval date, so you do not have to apply in January. The registered-programming credit is for the whole two-year term, not for each year.",
    "applyText": "Apply for the L.I.F.E. Program",
    "applyUrl": "https://www.victoria.ca/parks-recreation/recreation/accessibility-inclusion/life-program",
    "source": "https://www.victoria.ca/parks-recreation/recreation/accessibility-inclusion/life-program",
    "detail": {
      "about": "The two-year membership combines unlimited drop-ins at Victoria Recreation Centre (opening planned early 2027) and public skating, a regional 52-visit benefit and a one-time registered-program credit. If you cannot provide the standard documents you may still be eligible to apply using an adjudicator. The City only accepts adjudicator applications when all required information is provided and audits all adjudicator forms.",
      "aboutList": {
        "lead": "The two-year membership includes:",
        "items": [
          "Unlimited drop-ins at Victoria Recreation Centre (opening planned early 2027) and public skating.",
          "A regional 52-visit benefit and a one-time registered-program credit.",
          "If you cannot provide the standard documents you may still be eligible to apply using an adjudicator.",
          "The City only accepts adjudicator applications when all required information is provided and audits all adjudicator forms."
        ]
      },
      "steps": ["Complete one L.I.F.E. application for family members living at the same address", "Gather current proof of City of Victoria residence and income documents for household adults", "If you cannot provide the documents, you may be able to use an adjudicator: a community professional familiar with your financial and residential situation completes the adjudicator form", "Submit through the method on the current City form", "After approval, obtain the regional visit sticker each calendar year and use the program credit before the two-year term ends"],
      "documents": ["Completed L.I.F.E. application", "Utility bill, phone bill or rental agreement from the last three months", "Most recent CRA Notice of Assessment for household members aged 19 and older, or completed adjudicator verification"],
      "tips": ["The $80 or $120 program credit is for the whole two-year term, not for each year", "You must renew the regional 52-visit sticker each calendar year", "Before you choose the discounted regional annual pass, ask staff which benefit option is better"],
      "time": "Membership lasts two years from approval"
    }
  },
  {
    "id": "saanich-life",
    "name": "L.I.F.E. Program (Leisure Involvement For Everyone)",
    "level": "Saanich",
    "category": "Recreation",
    "amount": "Choose one of two options for two years. Option 1: free drop-ins at Saanich facilities, 52 regional drop-in visits a year, and a one-time grant of $80 to $120 (by age) toward registered programs at Saanich centres. Option 2: 50% off an annual Regional Recreation Pass.",
    "summary": "Saanich's version of the regional L.I.F.E. program. Approval lasts two years. You pick one of two benefit options.",
    "requires": ["bc", "saanich", "lowIncome"],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have proof of Saanich residency — a utility or phone bill dated within the last three months, a current signed rental agreement, or a current driver's licence or BC identification card. One proof covers the whole family.",
        "Most households qualify with a Canada Revenue Agency Proof of Income Statement for every household member 19 and over, even those who will not use the program. Thresholds are based on their combined gross income."
      ],
      "note": "Other routes exist: newcomers can apply with landing papers showing a landing date within one year of applying; if your statement no longer reflects your current income (for example after an illness or job loss) you can use a completed adjudicator form; a youth in a local school without parental or guardian support can use the Youth Application form; if none fit, contact the financial-assistance office."
    },
    "requiresNote": "You need proof of Saanich residency — a utility or phone bill dated within the last three months, a current signed rental agreement, or a current driver's licence or BC identification card. One proof covers the whole family. Most households need a Canada Revenue Agency Proof of Income Statement for every household member 19 and over, even those who will not use the program; thresholds are based on their combined gross income. Other routes exist: newcomers with landing papers showing a landing date within one year of applying; a completed adjudicator form if the statement no longer reflects current income (for example after illness or job loss); a Youth Application form for a youth in a local school without parental or guardian support. Contact the financial-assistance office if none fit.",
    "note": "Approval is valid for two years from the date of approval. The grant amounts below are for the whole two-year term. For adults and preschool-age children, the grant is all that is available for the two years. For children (5–12) and youth (13–18), there may be some extra funds after the first grant is used. This has strict eligibility guidelines and no guarantee. Saanich only accepts CRA Proof of Income Statements, not Notices of Assessment. Allow at least 5 days between approval and registering, because grants take up to 5 days to appear on your account.",
    "applyText": "Apply online for L.I.F.E.",
    "applyUrl": "https://www.saanich.ca/EN/main/parks-recreation-community/community-services/financial-assistance/financial-assistance.html",
    "source": "https://www.saanich.ca/EN/main/parks-recreation-community/community-services/financial-assistance/financial-assistance.html",
    "detail": {
      "about": "Saanich's two-year L.I.F.E. approval lets you choose Option 1 (free drop-ins at Saanich facilities, regional drop-in visits, and an age-based one-time grant for Saanich registered programs) or Option 2 (50% off an annual Regional Recreation Pass). Current applications can be completed through the City's secure online form.",
      "aboutList": {
        "lead": "Saanich's two-year L.I.F.E. approval lets you choose one of two options.",
        "items": [
          "Option 1 includes free drop-ins at Saanich facilities and regional drop-in visits.",
          "Option 1 also includes an age-based one-time grant for registered programs at Saanich centres.",
          "Option 2 is 50% off an annual Regional Recreation Pass.",
          "Current applications can be completed through the City's secure online form."
        ]
      },
      "steps": ["Gather one current proof of Saanich residence for the household", "Get the current CRA Proof of Income Statement for every household member age 19 or older (or, if another route applies to you, the form for that route)", "Complete the secure online L.I.F.E. application and upload the documents", "If income shown is under $1,000 or the household has a special situation, contact the financial-assistance office directly", "Allow time after approval for the program grant to appear before registering"],
      "documents": ["Utility or phone bill from the last three months, signed rental agreement, driver's licence or BC identification", "Current CRA Proof of Income Statement for every household member 19 or older (most households), or the adjudicator form / Youth Application form where those routes apply", "Recent landing papers instead of income statements for eligible newcomers within one year of arrival"],
      "tips": ["Saanich accepts CRA Proof of Income Statements, not Notices of Assessment", "The first grant is for the whole two-year approval. Children and youth may be able to ask about extra funds, but they are not guaranteed", "Allow at least five days after approval before you try to spend the grant"],
      "time": "Grant setup can take up to five days after approval"
    }
  },
  {
    "id": "kelowna-recreation-assistance",
    "name": "Financial Assistance for Recreation (KFAP)",
    "level": "Kelowna",
    "category": "Recreation",
    "amount": "A credit toward a Parkinson Recreation Centre pass or City programs",
    "summary": "Kelowna's recreation subsidy for residents on a low income. It gives a credit you can spend on a facility pass or on programs.",
    "requires": ["bc", "kelowna", "lowIncome", "citizenPR", "notPostSecondaryStudent"],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Canadian citizen or permanent resident currently residing in Kelowna as a full-time resident.",
        "You meet the family net income threshold based on the after-tax Low Income Cut-off (see the table below). You must also meet income verification requirements and have all the necessary documentation. People receiving government financial assistance are eligible to apply, as are people who do not receive it but are experiencing financial hardship and meet the guidelines.",
      ],
      "note": "Post-secondary students are not eligible, though they can ask for the discounted student rate on passes instead. Also not eligible: temporary residents and visitors, including anyone on a study or work permit; immigrants classified as business class, investor or entrepreneur; and anyone banned from City recreation facilities, including Parkinson Recreation Centre and the Kelowna-area YMCAs. Recreation Services may exercise discretion when determining eligibility for Financial Assistance for individuals with previous suspensions or bans.",
    },
    "amountTiers": {
      "caption": "City of Kelowna — Low Income Cut-Offs (LICO) 2025 (family net income after tax)",
      "headers": ["Family size", "Family net income"],
      "rows": [
        ["1", "$26,926"],
        ["2", "$33,519"],
        ["3", "$41,208"],
        ["4", "$50,032"],
        ["5", "$56,744"],
        ["6", "$64,000"],
        ["7", "$71,254"],
      ],
    },
    "requiresNote": "You must be a Canadian citizen or permanent resident currently residing in Kelowna as a full-time resident, and meet the family net income threshold based on the after-tax Low Income Cut-off published by Statistics Canada. The City 2025 LICO table lists $26,926 for a family of 1, $33,519 for 2, $41,208 for 3, $50,032 for 4, $56,744 for 5, $64,000 for 6 and $71,254 for 7. You must also meet income verification requirements and have all the necessary documentation. People receiving government financial assistance are eligible to apply, as are people who do not receive it but are experiencing financial hardship and meet the guidelines. Post-secondary students are not eligible, though they can ask for the discounted student rate on passes instead. Also not eligible: temporary residents and visitors, including anyone on a study or work permit; immigrants classified as business class, investor or entrepreneur; and anyone banned from City recreation facilities, including Parkinson Recreation Centre and the Kelowna-area YMCAs. Recreation Services may exercise discretion when determining eligibility for Financial Assistance for individuals with previous suspensions or bans.",
    "note": "To apply, email the Access to Recreation Department. The assessment may take up to two weeks from the date you submit, if all required information is received. The income assessment counts income from all sources. This includes disability benefits and workers' compensation, as well as employment, investments, pensions, child and foster child support, rental income and funds held in trust.",
    "applyText": "Email Access to Recreation to apply",
    "applyUrl": "https://www.kelowna.ca/parks-recreation/recreation-sport/recreation-programs-registration/financial-assistance-recreation",
    "source": "https://www.kelowna.ca/parks-recreation/recreation-sport/recreation-programs-registration/financial-assistance-recreation",
    "detail": {
      "about": "Kelowna assesses combined household income from all sources and places an approved credit on the recreation account for passes or City programs.",
      "steps": ["Email the Access to Recreation Department to request the current application process", "Gather proof of a Kelowna address from the last three months", "Get a CRA Income Statement (Option C print, not Notice of Assessment) for each household member who contributes income or expenses", "Submit the completed application and all supporting documents", "Wait for approval before buying a pass or program; approved credit can then be used during registration"],
      "documents": ["Recent utility, cable or internet bill, rental agreement, or government document showing a Kelowna address", "CRA Income Statement for contributing household members", "Government-assistance confirmation when using that qualifying route", "Citizenship or permanent-resident information requested by the form"],
      "tips": ["Past purchases are not covered, so wait for approval", "All income sources count, including disability benefits and income from outside Canada", "A clerk at Parkinson Recreation Centre can check whether processing is complete", "You must re-apply every year. You can resubmit up to one month before your current term ends.", "If you are a post-secondary student, you cannot use this program. You can still get the discounted student rate on a pass. Show a valid student ID and proof of full-time enrolment."],
      "time": "The assessment may take up to two weeks from the date of submission, provided all required information is received."
    }
  },
  {
    "id": "coquitlam-far",
    "name": "Financial Assistance for Recreation (FAR)",
    "level": "Coquitlam",
    "category": "Recreation",
    "amount": "50 drop-in passes plus a $225 credit for every eligible family member",
    "summary": "Coquitlam gives each eligible family member their own 50 drop-in passes and their own $225 credit. The credit is for City admissions, passes and programs.",
    "requires": ["bc", "coquitlam", "coquitlamStatus", "coquitlamIncome"],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Coquitlam resident.",
        "You meet the 2025 Low Income Cut-off for your household size (see the table below).",
      ],
      "note": "A family here means one or two married or common-law adults and their legal dependents aged 18 and younger.",
    },
    "amountTiers": {
      "caption": "Income eligibility — 2025 Low Income Cut-off by household size",
      "headers": ["Household size", "Income at or below"],
      "rows": [
        ["1 person", "$27,478"],
        ["2", "$34,206"],
        ["3", "$42,053"],
        ["4", "$51,058"],
        ["5", "$57,908"],
        ["6", "$65,313"],
        ["7 or more", "$72,715"],
      ],
    },
    "requiresNote": "You must be a Coquitlam resident and meet the 2025 Low Income Cut-off for your household size: $27,478 for 1 person, $34,206 for 2, $42,053 for 3, $51,058 for 4, $57,908 for 5, $65,313 for 6 and $72,715 for 7 or more. A family here means one or two married or common-law adults and their legal dependents aged 18 and younger.",
    "note": "You can verify income in four ways. First: a CRA Income Statement (the Option C print, not a Notice of Assessment) for each family member who contributes to household income. Or: the main applicant's proof of government assistance. Or: the main applicant's proof of receiving a red Compass Card. Or: a completed adjudicator or agency signature section on the application. You also need proof of Coquitlam residency dated within two months. The red Compass Card route is worth noting. It is the same card BC transit concession holders already carry.",
    "applyText": "Apply for Financial Assistance for Recreation",
    "applyUrl": "https://www.coquitlam.ca/499/Financial-Assistance-for-Recreation",
    "source": "https://www.coquitlam.ca/499/Financial-Assistance-for-Recreation",
    "detail": {
      "about": "Each eligible family member receives 50 drop-in passes and a $225 credit. Income verification can use a CRA statement, government assistance, a red Compass Card or an approved adjudicator or agency signature.",
      "steps": ["Complete the online FAR form or download the paper application", "Attach proof of Coquitlam residence dated within two months", "Choose one accepted income-verification route and attach that evidence", "Submit online, by email, mail or in a sealed envelope at Glen Pine Pavilion", "After approval, use each family member's passes and credit in the recreation registration system"],
      "documents": ["Completed FAR application", "Recent Coquitlam bill or government-issued identification", "CRA Income Statement, assistance proof, red Compass Card proof, or adjudicator or agency section"],
      "tips": ["You may redact irrelevant licence, SIN and bank-account numbers. Leave your name, address, date and income visible", "Use an Option C Income Statement, not a Notice of Assessment", "Each eligible family member gets a separate set of passes and credit"],
      "time": "Ask Community Access and Support after submission",
      "phone": "604-927-6076"
    }
  },
  {
    "id": "kamloops-arch",
    "name": "ARCH (Affordable Recreation for Community Health)",
    "level": "Kamloops",
    "category": "Recreation",
    "amount": "Up to $400 in recreation credits per year",
    "summary": "Kamloops' recreation subsidy: up to $400 in recreation credits a year. The same form also asks to be considered for KamPASS, the City's affordable transit pass. KamPASS is a separate program with its own exclusions.",
    "requires": ["bc", "kamloops", "archIncomeOrAssistance"],
    "note": "ARCH is an annual program and requires a new application each year. One form covers both programs and applicants are automatically considered for both, but ARCH and KamPASS are two separate programs: being approved for ARCH does not establish that you are eligible for KamPASS. Check the KamPASS exclusions before counting on a transit pass.",
    "applyText": "Apply for ARCH",
    "applyUrl": "https://www.kamloops.ca/recreation-culture/programs-activities/accessible-recreation/arch-program",
    "source": "https://www.kamloops.ca/recreation-culture/programs-activities/accessible-recreation/arch-program",
    "detail": {
      "about": "ARCH provides up to $400 in recreation credits for permanent Kamloops residents. You qualify by meeting any one of three routes: you receive Income Assistance from the Ministry of Social Development and Poverty Reduction. Your annual income is below the Statistics Canada Low Income Guidelines listed on the application form. Or you receive a Canadian pension or long-term disability payment below those guidelines. The annual application also asks to be considered for KamPASS, the City's reduced-cost adult monthly transit pass. The City states that ARCH and KamPASS are two separate programs that share one application process, that applicants are automatically considered for both, and that qualified participants can use both programs or just one. Approval for ARCH does not establish KamPASS eligibility. A participating screening or referral agency reviews the application; City recreation facilities do not accept the application itself.",
      "aboutList": { "lead": "ARCH provides up to $400 in recreation credits for permanent Kamloops residents.", "items": ["You qualify by meeting any one of three routes: you receive Income Assistance from the Ministry of Social Development and Poverty Reduction. Your annual income is below the Statistics Canada Low Income Guidelines listed on the application form. Or you receive a Canadian pension or long-term disability payment below those guidelines.", "The annual application also asks to be considered for KamPASS, the City's reduced-cost adult monthly transit pass.", "The City states that ARCH and KamPASS are two separate programs that share one application process, that applicants are automatically considered for both, and that qualified participants can use both programs or just one.", "Approval for ARCH does not establish KamPASS eligibility.", "A participating screening or referral agency reviews the application; City recreation facilities do not accept the application itself."] },
      "steps": ["Download the current ARCH–KamPASS application or pick up a paper copy", "Gather photo identification, a second piece of identification, proof of a Kamloops address and proof of income for each adult", "Take the complete application to a participating ARCH public screening agency or, if you are a client, a listed referral agency", "If approved, take the approval letter and photo identification to a listed City facility to activate ARCH credit", "If also approved for KamPASS, purchase it at Kamloops Museum and Archives"],
      "documents": ["Photo identification and a second piece of identification", "Current utility bill or other accepted proof of Kamloops residence", "Ministry assistance confirmation, each adult's latest Notice of Assessment, or accepted disability or pension income evidence"],
      "tips": ["Applications are not accepted at City recreation facilities", "One form requests both, but ARCH and KamPASS have separate eligibility. Being approved for ARCH does not mean you qualify for KamPASS", "KamPASS is not available to people who receive disability assistance from the Ministry of Social Development and Poverty Reduction under the Employment and Assistance for Persons with Disabilities Act. So many people who qualify for ARCH are excluded from KamPASS", "KamPASS also excludes these people: people aged 60 and over who are eligible for the Provincial BC Bus Pass for Seniors and Others; people aged 18 or under eligible for the BC Transit Family Travel Program or School District No. 73 Transportation Assistance; post-secondary students enrolled in U-PASS; CNIB card holders; and anyone whose income is above the Statistics Canada Low Income Cut-Offs or who cannot provide income verification", "Apply again each year and use the application form for the current program year"],
      "time": "Annual approval; ask the screening agency for current review time",
      "phone": "250-828-3582"
    }
  },
  {
    "id": "niagara-transit-benefit-pass",
    "name": "Niagara Transit Benefit Pass",
    "level": "Niagara Region",
    "category": "Transit",
    "amount": "$50 monthly bus pass",
    "summary": "A discounted $50 monthly bus pass from Niagara Region Transit. It is for Niagara residents on Ontario Works or ODSP, or who qualify as low income. Full-time post-secondary students are not eligible.",
    "note": "Niagara Region must approve low-income applications before you buy a pass. It will not reimburse passes you already bought. The page does not give the low-income limits. Ask the Region how they apply to you.",
    "requires": [
      "niagaraRegion",
      "niagaraTbpRoute",
      "notFullTimePostSecondary"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Niagara resident",
        "You get Ontario Works or ODSP, or you qualify as a low-income individual or household",
        "You are not a full-time post-secondary student"
      ],
      "note": "OW and ODSP recipients have qualified automatically since July 1, 2025; others apply for an income check."
    },
    "applyText": "Apply for the Transit Benefit Pass",
    "applyUrl": "https://nrtransit.ca/fares/transit-benefit-pass/",
    "source": "https://nrtransit.ca/fares/transit-benefit-pass/",
    "detail": {
      "aboutList": {
        "lead": "This program gives eligible Niagara residents a discounted monthly bus pass.",
        "items": [
          "The pass costs $50 a month.",
          "It is for individuals and families on Ontario Works, ODSP, or who qualify based on low-income criteria.",
          "You pay for the pass yourself.",
          "If you use the Transit app, the approval lets you buy the $50 monthly pass in the app each month for one year."
        ]
      },
      "steps": [
        "If you get Ontario Works or ODSP, you already qualify. Get your monthly payment statement from the mail or online through MyBenefits",
        "If you do not get OW or ODSP, apply online at owbenefits.niagararegion.ca. You can also call 905-641-9960 ext. 6072, fax 905-984-6759, or mail the Ontario Works Discretionary Benefit Team at 234 Bunting Rd., St. Catharines, L2R 6Z4",
        "A staff member will contact you to review your application",
        "If you applied on low income, wait for Niagara Region to approve you before you buy a pass. You then get a Transit Benefit Pass Approval Form for each eligible family member",
        "Get verified in person with your ID and your benefit statement or approval form. For the Transit app, go to the St. Catharines Bus Terminal or the Welland Bus Terminal and give a unique email address. For a physical pass, go to a Transit Benefit Pass outlet",
        "Pay $50 for the monthly pass"
      ],
      "documents": [
        "One valid ID for each household member if you apply on low income: birth certificate, driver's licence, health card or citizenship document",
        "Proof of income if you apply on low income, such as bank statements, pay stubs or pension stubs",
        "If you get OW or ODSP: a recent benefit statement or proof of enrolment. OW clients can ask their caseworker for a proof of eligibility letter if they cannot get it online",
        "If you applied on low income: the approved letter from Niagara Region's Social Assistance and Employment Opportunities office, or the Transit Benefit Pass Approval Form",
        "A valid ID for each purchase. It must match your verification documents"
      ],
      "tips": [
        "Apply and get approved before you buy a pass. The Region does not reimburse passes you already bought.",
        "At a pass outlet, only the verified person can buy the pass. Bring your documents and ID each time.",
        "Be ready to pay when you get verified.",
        "In the Transit app, the pass is not available until that month's payment has been made.",
        "For help, email info@niagaratransit.ca or call 1-833-678-5463."
      ],
      "phone": "905-641-9960 ext. 6072"
    }
  },
  {
    "id": "kingston-affordable-transit-pass",
    "name": "Kingston Affordable Transit Pass",
    "level": "Kingston",
    "category": "Transit",
    "amount": "Discounted monthly transit pass",
    "summary": "A discounted, renewable monthly Kingston transit pass. You get it through the City's Municipal Fee Assistance Program (MFAP), which is income-based. You only need to apply once to MFAP.",
    "note": "The page does not give the pass price. Funding is first-come, first-served until the yearly budget runs out. Ask the City about the price and Kingston Transit's fares and passes page.",
    "requires": [
      "kingston",
      "kingstonMfapIncome"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "MFAP compares your household income with its limit for your household size",
        "You apply to the Municipal Fee Assistance Program (MFAP)"
      ],
      "note": "MFAP uses the after-tax Low-Income Measure plus 15 percent; the 2026 limits are in the tips below."
    },
    "applyText": "Apply for MFAP",
    "applyUrl": "https://www.cityofkingston.ca/MFAP",
    "source": "https://www.cityofkingston.ca/MFAP",
    "detail": {
      "aboutList": {
        "lead": "MFAP gives low- and moderate-income households access to City services at no cost or a lower cost. The transit pass is one of them.",
        "items": [
          "You can get a discounted renewable monthly transit pass.",
          "If you recently started a part-time or full-time job, the transit employment program gives a free two-month pass.",
          "MFAP also covers other things, such as free access to fitness centres, public skates and public swims through SPARK."
        ]
      },
      "steps": [
        "Compare your household income with the 2026 limits in the tips",
        "Create a MyKingston account and apply online. You can also email mfap@cityofkingston.ca or apply in person at Housing and Social Services, 362 Montreal St.",
        "See the City's Transit Fares and Passes page for the discounted monthly pass"
      ],
      "documents": [
        "The page does not list documents. Ask the City what to bring"
      ],
      "tips": [
        "2026 MFAP income limits (after tax): $34,793 for 1 person, $49,205 for 2, $60,263 for 3, $69,587 for 4, $77,800 for 5, $85,225 for 6, $92,054 for 7, $98,410 for 8, $104,380 for 9 and $110,020 for 10.",
        "Funding is first-come, first-served, so apply early.",
        "Questions: mfap@cityofkingston.ca or 613-546-2695 ext. 4906."
      ],
      "phone": "613-546-2695 ext. 4906"
    }
  },
  {
    "id": "halton-split",
    "name": "Halton SPLIT transit subsidy (Burlington, Oakville, Milton)",
    "level": "Halton Region",
    "category": "Transit",
    "amount": "Covers part of the cost of bus tickets or monthly passes",
    "summary": "A Halton Region subsidy that pays part of your local bus tickets or monthly passes on Burlington, Oakville or Milton Transit. It is for Halton residents with a low income, including people on Ontario Works or ODSP.",
    "note": "If you qualify, you are eligible for one year, then you re-apply. The page does not give the subsidy amount. Ask the Region what it covers for your age group and city.",
    "requires": [
      "haltonRegion",
      "haltonSplitRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Halton",
        "You are a student, adult or senior with a low income, or you get Ontario Works or ODSP"
      ],
      "note": "In Halton Hills the subsidy is for ActiVan or the Taxi Scrip Program instead of buses."
    },
    "applyText": "Apply for SPLIT",
    "applyUrl": "https://www.halton.ca/For-Residents/Employment-and-Financial-Assistance/Subsidized-Passes-for-Low-Income-Transit-(SPLIT)",
    "source": "https://www.halton.ca/For-Residents/Employment-and-Financial-Assistance/Subsidized-Passes-for-Low-Income-Transit-(SPLIT)",
    "detail": {
      "aboutList": {
        "lead": "SPLIT helps Halton residents with low incomes pay for local travel.",
        "items": [
          "Use it for bus tickets or monthly passes from Burlington Transit, Oakville Transit or Milton Transit.",
          "It also covers Handi-Van and Care-A-Van, but not GO Transit, taxis or ride-sharing.",
          "You can transfer into Hamilton or Peel Region if you finish the trip within two hours."
        ]
      },
      "steps": [
        "Check your eligibility with the SPLIT online tool. You do not need an account to check",
        "Apply online with a Halton 311 account, or call 311",
        "Send proof of address, income, date of birth and status in Canada within 10 business days, or the application is closed",
        "Staff contact you if they need more information, then tell you if you qualify",
        "Buy your pass or tickets: Burlington Transit at Burlington GO Station (2101 Fairview St.), Milton Town Hall (150 Mary St.) or Oakville Transit (430 Wyecroft Rd.)"
      ],
      "documents": [
        "Proof of address for you and your spouse, such as a driver's licence or utility bill",
        "A Notice of Assessment for every adult in your household",
        "Proof of status in Canada and date of birth for you, your spouse and your children"
      ],
      "tips": [
        "Only apply when your documents are ready. Missing documents close the application after 10 business days.",
        "Upload documents online, mail them to Halton Regional Centre (1151 Bronte Road, Oakville) or drop them off in person."
      ]
    }
  },
  {
    "id": "abbotsford-prc-subsidy",
    "name": "PRC Subsidy Program (Abbotsford)",
    "level": "Abbotsford",
    "category": "Recreation",
    "amount": "Recreation pass plus 25% off listed programs",
    "summary": "A recreation pass for Abbotsford recreation centres and 25% off some registered programs. It is for full-time Abbotsford residents whose family net income is under the City's low-income cutoff for their household size.",
    "note": "The program runs May 1 to April 30 and you re-apply each year. Group swim and skate lessons qualify, but private lessons do not. Some camps and other programs qualify, and the list is updated each year.",
    "requires": [
      "bc",
      "abbotsford",
      "abbotsfordPrcIncome"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a full-time Abbotsford resident",
        "Your family net income after tax is within the City's low-income cutoff chart"
      ],
      "note": "Income proof is usually your 2025 Notice of Assessment (line 236); other proofs are listed."
    },
    "applyText": "Apply for the PRC Subsidy",
    "applyUrl": "https://www.abbotsford.ca/node/10757",
    "source": "https://www.abbotsford.ca/node/10757",
    "detail": {
      "aboutList": {
        "lead": "The subsidy gives lower-income Abbotsford households a recreation pass and discounts on some programs.",
        "items": [
          "A recreation pass to City of Abbotsford recreation centres.",
          "25% off group swim and skate lessons; private lessons are excluded.",
          "25% off some neighbourhood and summer camps for ages 3 to 12, and other specified programs.",
          "Net income limit: $22,361 for 1 person (from $5,000), $27,214 for 2, $33,888 for 3.",
          "Net income limit: $42,278 for 4, $48,142 for 5, $53,390 for 6, $58,639 for 7 or more."
        ]
      },
      "steps": [
        "Compare your family's after-tax net income with the City's cutoff chart",
        "Fill in the application form with details for everyone in your household",
        "Take the form and your documents to City Hall, the Abbotsford Recreation Centre or the Matsqui Recreation Centre",
        "Wait for an email or letter telling you if you were approved",
        "If approved, go to the Abbotsford or Matsqui Recreation Centre to get your pass",
        "Re-apply each year"
      ],
      "documents": [
        "Proof of Abbotsford residency dated in the last 3 months, such as a utility bill, a letter from your bank or a rental agreement",
        "Valid government photo ID, such as a driver's licence, BC ID or passport",
        "One of these as proof of income: a 2025 Notice of Assessment for every adult 19 or older, an Independent Youth Letter, or a letter from a Registered Social Worker",
        "Canada Child Benefit Notice listing all dependent children, if children are on the application"
      ],
      "tips": [
        "A Tax Notice Summary is not accepted. You need the Notice of Assessment.",
        "The City does not accept faxed or emailed applications.",
        "New immigrants must visit Archway Community Services for an application form.",
        "If you are denied, you get a letter in the mail with the reasons."
      ],
      "time": "Up to 2 weeks to process",
      "phone": "604-859-3134"
    }
  },
  {
    "id": "abbotsford-specialized-access",
    "name": "Specialized Access Program (Abbotsford)",
    "level": "Abbotsford",
    "category": "Recreation",
    "amount": "50% off recreation centre drop-in admissions and passes",
    "summary": "Half-price drop-in admissions and passes at Abbotsford recreation centres. It is for full-time Abbotsford residents whose permanent disability a physician confirms. Support workers who are needed get in free.",
    "note": "There is no income test on the page. A physician completes a section of the form, so no medical copies are needed. The page does not give a renewal period.",
    "requires": [
      "bc",
      "abbotsford",
      "physicianConfirmedDisability"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a full-time Abbotsford resident",
        "You have a permanent disability confirmed by a physician"
      ]
    },
    "applyText": "Apply for Specialized Access",
    "applyUrl": "https://www.abbotsford.ca/node/10757",
    "source": "https://www.abbotsford.ca/node/10757",
    "detail": {
      "aboutList": {
        "lead": "This program lowers recreation centre costs for Abbotsford residents with permanent disabilities.",
        "items": [
          "50% off recreation centre drop-in admissions.",
          "50% off recreation centre passes.",
          "Support workers who are required to assist you are admitted at no charge."
        ]
      },
      "steps": [
        "Download and complete the application form, and review the FAQ",
        "Ask a physician to complete the disability section of the form",
        "Take the form and your documents to City Hall, the Abbotsford Recreation Centre or the Matsqui Recreation Centre",
        "Wait for an email or letter telling you if you were approved",
        "Go to the Abbotsford or Matsqui Recreation Centre to get your Specialized Access Card"
      ],
      "documents": [
        "Proof of permanent disability confirmed by a physician, on the application form only; no copies required",
        "Proof of Abbotsford residency dated in the last 3 months, such as a utility bill, a letter from your bank or a rental agreement",
        "Valid government photo ID of the applicant, or of the legal guardian if the applicant is a minor"
      ],
      "tips": [
        "The City does not accept faxed or emailed applications.",
        "If you are denied, you get a letter in the mail with the reasons."
      ],
      "phone": "604-859-3134"
    }
  },
  {
    "id": "maple-ridge-access-pass-financial",
    "name": "Access Pass, Financial (Maple Ridge)",
    "level": "Maple Ridge",
    "category": "Recreation",
    "amount": "75% off admissions, 90% under $18,000; 50% off programs up to $300",
    "summary": "A discount on Maple Ridge recreation for residents with a low household income. You get 75% off admissions and 50% off registered programs, up to $300 of spending. Income under $18,000 gets 90% off drop-in and 10- or 20-pass admissions.",
    "note": "The pass lasts one year from approval and you re-apply each year. The 90% rate excludes post-secondary students.",
    "requires": [
      "bc",
      "mapleRidge",
      "mapleRidgeIncome"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Maple Ridge (ask the City how this applies if you hold a study or visitor visa)",
        "The main applicant is 19 or older"
      ],
      "note": "Before-tax household income at or below the Low Income Cut-off (500,000+ community size), or third-party verification."
    },
    "applyText": "Apply for the Access Pass",
    "applyUrl": "https://mapleridge.ca/1465/Financial-Access",
    "source": "https://mapleridge.ca/1465/Financial-Access",
    "detail": {
      "aboutList": {
        "lead": "The Access Pass lowers admission and program costs for Maple Ridge residents with a low household income.",
        "items": [
          "75% off drop-in, 10-pass, 20-pass, 1-month and 3-month admissions.",
          "90% off drop-in, 10-pass and 20-pass admissions if income is below $18,000, excluding post-secondary students.",
          "50% off registered program fees, up to $300 of spending.",
          "The pass is valid for one year from the date of approval."
        ]
      },
      "steps": [
        "Choose how to apply: online, on paper at the Maple Ridge Leisure Centre, or through a third party",
        "Fill in the Financial application form",
        "Upload or hand in your documents, or have a third party complete the adjudicator section",
        "Wait for an email or phone call about your application",
        "Pick up your membership card at the Maple Ridge Leisure Centre or Albion Community Centre",
        "Re-apply each year"
      ],
      "documents": [
        "An address-related bill from the last 3 months. PO Box addresses are not accepted",
        "A Notice of Assessment for each person contributing to household income, or government assistance documents such as GIS, SAFER, EI or income assistance",
        "Not needed if a third party verifies you: proof of address and income"
      ],
      "tips": [
        "Not discounted, among others: private swimming lessons, high performance training camps, contracted or partner programs over $299.99, licensed afterschool care and employment certification.",
        "Rename your uploaded files with your last name.",
        "A third party can be a social worker, caseworker, counsellor, school principal, community agency or medical provider.",
        "Online registration applies your discount automatically. Email Registration@MapleRidge.ca for your first sign-in link.",
        "Applications needing extra screening can take up to 14 days."
      ],
      "time": "Up to 10 business days",
      "phone": "604-467-7422"
    }
  },
  {
    "id": "maple-ridge-access-pass-disability",
    "name": "Access Pass, Disability (Maple Ridge)",
    "level": "Maple Ridge",
    "category": "Recreation",
    "amount": "50% off admissions; 25% off programs up to $150 a year",
    "summary": "A discount on City of Maple Ridge recreation for residents with a diagnosed temporary or permanent disability. You get 50% off admissions and 25% off program fees, up to $150 a year. It is for the person with the disability, not the family.",
    "note": "The page lists no income test for this pass. The pass lasts one year from approval and you re-apply each year.",
    "requires": [
      "bc",
      "mapleRidge",
      "mapleRidgeDisabilityProof"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Maple Ridge (ask the City how this applies if you hold a study or visitor visa)",
        "You have a diagnosed temporary or permanent disability, with documents or third-party verification"
      ],
      "note": "The pass is for the person with the disability only, one applicant per application."
    },
    "applyText": "Apply for the Disability Access Pass",
    "applyUrl": "https://mapleridge.ca/1465/Financial-Access",
    "source": "https://mapleridge.ca/1465/Financial-Access",
    "detail": {
      "aboutList": {
        "lead": "The Disability Access Pass lowers admission and program costs for Maple Ridge residents with a diagnosed disability.",
        "items": [
          "50% off single, 10-pass, 20-pass, 1-month and 3-month admissions.",
          "The pass is valid for one year from the date of approval.",
          "A medical or para-medical provider can verify your disability on the form."
        ]
      },
      "steps": [
        "Choose how to apply: online, on paper at the Maple Ridge Leisure Centre, or through a third party",
        "Fill in the Individuals Diagnosed With Temporary or Permanent Disability form",
        "Upload or hand in your documents, or have a third party complete the adjudicator section",
        "Wait for an email or phone call about your application",
        "Pick up your membership card at the Maple Ridge Leisure Centre or Albion Community Centre",
        "Re-apply each year"
      ],
      "documents": [
        "An address-related bill from the last 3 months. PO Box addresses are not accepted",
        "Proof of disability, such as BC PWD designation, Disability Tax Credit approval, CPP Disability letter, Veterans Affairs or WorkSafeBC documents",
        "Not needed if a third party verifies you: proof of address"
      ],
      "tips": [
        "Not discounted, among others: private swimming lessons, high performance training camps, contracted or partner programs over $299.99, licensed afterschool care and employment certification.",
        "The page's list of disability documents is cut off at the end, so ask staff if yours is not listed.",
        "Online registration applies your discount automatically. Email Registration@MapleRidge.ca for your first sign-in link.",
        "Applications needing extra screening can take up to 14 days."
      ],
      "time": "Up to 10 business days",
      "phone": "604-467-7422"
    }
  },
  {
    "id": "nanaimo-leap",
    "name": "LEAP, Leisure Economic Access Pass (Nanaimo)",
    "level": "Nanaimo",
    "category": "Recreation",
    "amount": "50 free admissions a year, 50% off programs up to $40",
    "summary": "LEAP gives 50 free drop-in admissions a year per person, half-price registered programs (limits apply) and free art gallery and museum entry. You qualify through one of six listed routes, such as assistance or low income.",
    "note": "Post-secondary students are not eligible. The newcomer or refugee route works only once. After that you must re-apply with a Notice of Assessment.",
    "requires": [
      "bc",
      "nanaimo",
      "nanaimoLeapRoute",
      "nanaimoNotStudent"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Nanaimo, Lantzville or Electoral Area A, B or C of the Regional District of Nanaimo",
        "You show proof of financial need by one of the six routes on the page"
      ],
      "note": "Post-secondary students are not eligible for LEAP."
    },
    "applyText": "Apply for LEAP",
    "applyUrl": "https://nanaimo.ca/parks-recreation-culture/recreation-facilities-schedules/leap-(leisure-economic-access-pass)",
    "source": "https://nanaimo.ca/parks-recreation-culture/recreation-facilities-schedules/leap-(leisure-economic-access-pass)",
    "detail": {
      "aboutList": {
        "lead": "LEAP helps Nanaimo-area families in financial need use City recreation, art and museum services.",
        "items": [
          "50 free admissions per year per person for drop-in swimming, skating, weight rooms and drop-in gym.",
          "Half price on programs (to a $40 maximum) for all family members, up to four times a year per person.",
          "Free admission to the Nanaimo Art Gallery and Nanaimo Museum.",
          "Income limit if you use a Notice of Assessment: $26,290 for 1 person, $32,727 for 2, $40,234 for 3.",
          "Income limit: $48,851 for 4 people, $55,404 for 5, $62,488 for 6, $69,571 for 7."
        ]
      },
      "steps": [
        "Pick the route that fits: income assistance or disability assistance, Seniors GIS, CLBC support, child or youth in care, newcomer or refugee, or a Notice of Assessment",
        "Print the LEAP form, or apply online",
        "Attach your proof of need and photo ID, online or at the front desk",
        "Child or youth in care: ask your social worker or guardianship worker to email registration@nanaimo.ca"
      ],
      "documents": [
        "Photo ID for the main contact and other adults, showing current address",
        "Income or disability assistance: a recent proof such as an MHSD stub, notice of deposit or benefit statement from the last 3 months",
        "Seniors GIS: a confirmation letter from Service Canada or a cheque stub",
        "CLBC: proof of CLBC support",
        "None of the above: last tax year's Notice of Assessment for each adult in the family"
      ],
      "tips": [
        "Income assistance includes disability assistance from the Province of BC or the Government of Canada.",
        "If you are a CLBC client, bring proof of your approved support.",
        "Newcomers and refugees can contact the Central Vancouver Island Multicultural Society at info@cvims.org or 250-753-6911.",
        "Canadian Tire Jumpstart is a separate application and is not run by the City."
      ]
    }
  },
  {
    "id": "new-westminster-financial-assistance",
    "name": "Financial Assistance Program (New Westminster)",
    "level": "New Westminster",
    "category": "Recreation",
    "amount": "50% off eligible programs and two pass types",
    "summary": "Eligible New Westminster residents get a 50% discount on eligible registered programs, the Active 10 Visit pass and the Active 30 Day pass. You qualify by a social service agency referral or household income under $50,000.",
    "note": "Each family member gets 1,000 credits. They expire on December 31 each year, and you can then re-apply. Credits are non-transferable and have no cash value. You can buy one pass at a time.",
    "requires": [
      "bc",
      "newWestminster",
      "newWestRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "A social service agency completes the Financial Assistance Referral Form for you",
        "Your household income is below $50,000"
      ],
      "note": "Either route also needs proof of New Westminster residency."
    },
    "applyText": "Apply for Financial Assistance",
    "applyUrl": "https://www.newwestcity.ca/parks-and-recreation/access-and-inclusion/sb_expander_articles/973.php",
    "source": "https://www.newwestcity.ca/parks-and-recreation/access-and-inclusion/sb_expander_articles/973.php",
    "detail": {
      "aboutList": {
        "lead": "The program reduces fees for New Westminster residents who show a referral or lower household income.",
        "items": [
          "Every family member receives 1,000 credits; they reduce fees by up to 50% on eligible purchases.",
          "Credits work through staff or your online account, and expire December 31.",
          "$2 drop-in admissions are open to everyone, but they get no extra discount."
        ]
      },
      "steps": [
        "Choose a route: an agency referral, or proof that household income is below $50,000",
        "Bring your documents and proof of residency to Recreation Facility customer service staff during office hours",
        "Staff create accounts for you and eligible household family members",
        "Use your credits through staff or your online account",
        "After credits expire on December 31, apply again"
      ],
      "documents": [
        "Proof of New Westminster residency",
        "Agency route: the Financial Assistance Referral Form completed by a social service agency",
        "Income route: a CRA tax assessment or a federal Child Benefit Notice, dated within the past 12 months"
      ],
      "tips": [
        "Registered programs are not eligible if they involve a third-party operator, are already subsidized, are private or semi-private lessons, or involve transportation costs.",
        "An agency can also email the referral letter, and staff will contact you.",
        "Credits expire December 31; you can then re-apply."
      ]
    }
  },
  {
    "id": "prince-george-lap",
    "name": "Leisure Access Program (Prince George)",
    "level": "Prince George",
    "category": "Recreation",
    "amount": "52 free swims, then 75% off swim passes",
    "summary": "The Leisure Access Program gives 52 free public swims. After that it gives 75% off swim passes and 75% off swimming programs, up to a $50 credit. It is for Prince George residents with limited income.",
    "note": "The program covers a variety of aquatic activities. Referral agencies can submit applications for their clients.",
    "requires": [
      "bc",
      "princeGeorge",
      "princeGeorgeIncome"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Prince George (the City says “permanent residents of Prince George”)",
        "Your annual income is below the Statistics Canada Low Income Guidelines, or you get a BC Seniors Supplement below them"
      ],
      "note": "Income limits are on the page by household size, from 1 to 6 people."
    },
    "applyText": "Apply for the Leisure Access Program",
    "applyUrl": "https://www.princegeorge.ca/node/5327",
    "source": "https://www.princegeorge.ca/node/5327",
    "detail": {
      "aboutList": {
        "lead": "The program lowers swimming costs for residents on a limited income.",
        "items": [
          "52 complimentary public swimming admissions.",
          "75% off all swim passes once the 52 free admissions are used.",
          "75% off swimming programs, such as lessons, up to a $50 credit.",
          "Income under: $26,127 for 1 person, $32,525 for 2, $39,986 for 3.",
          "Income under: $48,550 for 4 people, $55,064 for 5, $62,103 for 6."
        ]
      },
      "steps": [
        "Fill in the LAP Participant Application form, online or on paper",
        "Get a paper copy at the Canfor Leisure Pool or P.G. Aquatic Centre if you prefer",
        "Include proof of yearly household income and photo ID",
        "Or ask an approved referral agency to apply for you with the LAP Referral Agency Application"
      ],
      "documents": [
        "Proof of yearly household income",
        "Photo ID"
      ],
      "tips": [
        "Applications are processed Monday to Friday, 9 a.m. to 4:30 p.m.",
        "Processing can take up to 10 days, but it is typically a day or two on weekdays.",
        "Agencies that are not yet approved can email leisureaccessprogram@princegeorge.ca to ask about becoming a referral agency."
      ],
      "time": "Up to 10 days; often 1 to 2 weekdays"
    }
  },
  {
    "id": "banff-access-program",
    "name": "Banff Access Program",
    "level": "Banff",
    "category": "Recreation",
    "amount": "Free Banff Access Card for reduced rates on recreation and transit passes",
    "summary": "A free card that lowers the cost of recreation programs, transit passes and other participating services for Banff residents with lower household income.",
    "note": "The card cannot be combined with other subsidies or discounts, and it is not transferable. It is cancelled if you no longer qualify, for example if you move out of Banff.",
    "requires": [
      "ab",
      "banff",
      "banffAccessProgramRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live at a street address in the Town of Banff",
        "Your gross household income is at or below the limit for your household size",
        "You can show a need to reside in Banff, such as an employment contract",
        "You are a Canadian citizen, permanent resident or closed work permit holder",
        "You have lived in Banff for 3 full months, or 6 with an eligible open work permit"
      ],
      "note": "Limits are tiered by household size; the one-person amounts are in the tips."
    },
    "applyText": "Apply for the Banff Access Card",
    "applyUrl": "https://banff.ca/963/Banff-Access-Program",
    "source": "https://banff.ca/963/Banff-Access-Program",
    "detail": {
      "aboutList": {
        "lead": "The Banff Access Card gives reduced rates on recreation, transit passes and other participating services.",
        "items": [
          "Adults 18 and older, and their children under 18 at the same address, can apply together.",
          "Staff living at the Rimrock Hotel or on Juniper Way apply through the ID9 Access Program instead.",
          "Open work permits that allow a 6-month wait include Working Holiday and Post-Graduate permits.",
          "Partner open work permits and International Student work permits also allow a 6-month wait.",
          "Post office boxes and General Delivery are not accepted as proof of address."
        ]
      },
      "steps": [
        "Check your household income against the limit for your household size.",
        "Gather your proof of income, address, need to reside and residency status.",
        "Email your documents to Community.Services@banff.ca with the subject line Banff Access Application.",
        "Wait for a decision, because sending documents does not guarantee access."
      ],
      "documents": [
        "Three current pay stubs from each job, or proof of government benefits such as AISH or EI",
        "Your most recent Notice of Assessment showing line 15000",
        "Proof of your Banff address, such as a utility bill, lease or financial document",
        "An employment contract or a signed employer letter on letterhead",
        "Proof of status, such as a Canadian passport, PR card or closed work permit",
        "If reapplying, a Notice of Assessment from your previous tax year"
      ],
      "tips": [
        "For one person, Tier 1 is $40,643.20 and Tier 2 is $48,771.84.",
        "If your hours were cut or you were laid off, ask Community Services about your situation.",
        "You can find your Notice of Assessment in your Canada Revenue Agency account.",
        "Free help with taxes may be available for residents with low income and simple returns."
      ],
      "phone": "403-762-1251"
    }
  },
  {
    "id": "blackfalds-recreation-fee-assistance",
    "name": "Recreation Fee Assistance Program (PASS)",
    "level": "Blackfalds",
    "category": "Recreation",
    "amount": "Subsidized fees for Town programs, memberships and admissions",
    "summary": "Helps Blackfalds residents with low household income pay fees for Town programs, memberships and admissions. The Town subsidizes fees when possible.",
    "note": "One application also assesses you for Tools for School, Winter Wear and the Christmas Bureau. When your approval period ends, you must re-apply with all documents.",
    "requires": [
      "ab",
      "blackfalds",
      "blackfaldsRecreationFeeAssistanceRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Blackfalds",
        "Your total household income is below the Statistics Canada Low Income Cut-Off",
        "You send proof of income with your application"
      ],
      "note": "Proof can be a Notice of Assessment, an AISH or Alberta Works health card, or a social worker letter."
    },
    "applyText": "Get the application form",
    "applyUrl": "https://irec.wolfcreek.ab.ca/download/108425",
    "source": "https://irec.wolfcreek.ab.ca/download/108425",
    "detail": {
      "aboutList": {
        "lead": "The Town of Blackfalds subsidizes fees for people who cannot pay for municipal recreation.",
        "items": [
          "Covers municipally operated programs, memberships and admissions.",
          "The subsidy is given when possible, so funding may limit it.",
          "FCSS assesses your income and sends you a notice telling you what to do next.",
          "Household means people in one dwelling who are related by blood, marriage, common-law or adoption.",
          "The limits are the Statistics Canada Low Income Cut-Offs, which are updated each year."
        ]
      },
      "steps": [
        "Fill in the Subsidized Program Application and tick the programs you want.",
        "Add a copy of one income document. Do not mail originals.",
        "Drop it off at the FCSS office, or send it by mail or fax.",
        "Expect a notice within two to four weeks.",
        "Show your approval notice, proof of identity and proof of Blackfalds residency to use the subsidy."
      ],
      "documents": [
        "A current Notice of Assessment for each family member 18 and over, not a tax return summary",
        "Or a current AISH or Alberta Works health benefits card that has not expired",
        "Or a Registered Social Worker letter dated within 30 days, only if no other document exists",
        "Or a Resettlement Assistance Program Start-Up and Monthly Allowance form",
        "Or, for independent youth, a school principal or guidance counsellor letter"
      ],
      "tips": [
        "If you are declined and your finances change, you can reapply with no waiting period.",
        "Processing can take up to four weeks, so allow time if you apply by mail.",
        "Call the FCSS Manager if you have trouble with the form."
      ],
      "time": "Notice in two to four weeks",
      "phone": "403-885-6247"
    }
  },
  {
    "id": "chestermere-community-access-program",
    "name": "Community Access Program (CAP)",
    "level": "Chestermere",
    "category": "Recreation",
    "amount": "CAP card for subsidies on memberships, classes and transit passes",
    "summary": "A card for low-income Chestermere residents. It gives access to community memberships, classes, transit passes and other offers from local businesses.",
    "note": "Each card expires on December 31 and must be renewed by Community Wellness Services staff. You can ask for the monthly transit subsidy only, or the full program.",
    "requires": [
      "ab",
      "chestermere",
      "chestermereCommunityAccessProgramRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Chestermere",
        "Your household income is low, based on the Low Income Cut-Offs (LICO)",
        "You can show proof of residence, ID for household members and proof of income"
      ],
      "note": "The page lists the proofs of income it accepts but does not give a dollar limit."
    },
    "applyText": "Register for CAP",
    "applyUrl": "https://thecityofchestermere.ca/community-services/cap-registration/",
    "source": "https://thecityofchestermere.ca/community-services/cap-registration/",
    "detail": {
      "aboutList": {
        "lead": "CAP supports low-income Chestermere residents with tax filing, memberships, classes and transit.",
        "items": [
          "The subsidies listed include a transportation subsidy and Kids Up Front tickets.",
          "Others listed are TELUS Spark Centre passes and the Community Volunteer Income Tax Program.",
          "Local partners listed include the Genesis Centre, Luna PLAY and Harmony Health and Fitness.",
          "The Chestermere Regional Community Association and Calgary Yacht Club also appear on the list.",
          "All information given to staff is kept strictly confidential."
        ]
      },
      "steps": [
        "Open the CAP registration form on the city page.",
        "Choose monthly transit subsidy only, or full Community Access Program membership.",
        "Enter your name, email and phone, then submit the form.",
        "Give Community Wellness staff your proof of residence, ID and income."
      ],
      "documents": [
        "Proof of Chestermere residence",
        "ID for household members",
        "Proof of income: a Notice of Assessment, AISH benefits, or Alberta Works Learners or Alberta Health Benefit",
        "Or a letter from a Registered Social Worker, or 3 months of bank statements",
        "Or a statement that your income is lower than the Chestermere Living Wage"
      ],
      "tips": [
        "The transit-only option is open to adults and youth.",
        "Renew your card each year, because every card ends on December 31."
      ]
    }
  },
  {
    "id": "drayton-valley-recreation-fee-assistance",
    "name": "Recreation Fee Assistance Program (RFAP)",
    "level": "Drayton Valley",
    "category": "Recreation",
    "amount": "75% subsidized cost at the aquatic and fitness centres",
    "summary": "Drayton Valley residents with gross household income below the Low Income Cut-Off get a 75% subsidized cost on Town programs at the Aquatic Centre and the Health and Fitness Centre.",
    "note": "Programs must be a Town program or activity that is 4 or more days or classes long, a camp, or a membership. Fundraising or uniform fees, travel to out-of-town competitions and programs of three days or less are not covered.",
    "requires": [
      "ab",
      "draytonValley",
      "draytonValleyRecreationFeeAssistanceRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in the Town of Drayton Valley",
        "Your gross household income is below the Statistics Canada Low Income Cut-Off",
        "You send documents that prove income and residency for all adults in the household"
      ],
      "note": "The 2025 gross limits run from $30,526 for 1 person to $80,784 for 7 persons."
    },
    "applyText": "Get the application form",
    "applyUrl": "https://www.draytonvalley.ca/recreation-fee-assistance-program/",
    "source": "https://www.draytonvalley.ca/recreation-fee-assistance-program/",
    "detail": {
      "aboutList": {
        "lead": "The program lowers the cost of recreation for Drayton Valley residents with low income.",
        "items": [
          "Aquatic Centre passes and swimming lessons are covered, as are children's camps of 4 or more days.",
          "Fitness Centre passes, the indoor track and racquetball or squash passes are covered.",
          "Passes can be yearly, 6-month, 3-month, monthly or a 10-visit punch pass.",
          "A family is up to two adults and their dependent children, and you may apply for up to 7 people."
        ]
      },
      "steps": [
        "Download the application form, or pick one up at a Town recreation or civic location.",
        "Attach your income and residency documents to the form.",
        "Seal it in an envelope and drop it at the Community Services Centre, or mail or email it.",
        "Wait to be contacted. If approved, you get a letter listing the programs you can use."
      ],
      "documents": [
        "Proof of residence: a driver's license or utility bill with your legal land address, not a P.O. box",
        "Alberta Health Benefits Card or Alberta Income Support Summary to verify income",
        "Or a Notice of Assessment from the most recent tax year for every adult",
        "Or your two most recent pay stubs or bank statements"
      ],
      "tips": [
        "You may need an appointment, depending on staff availability.",
        "To get a copy of your assessment, call the Canada Revenue Agency and ask for it by mail.",
        "Documents are needed for all adults in the household."
      ],
      "phone": "780.515.4250"
    }
  },
  {
    "id": "edson-leisure-assist",
    "name": "Leisure Assist (Fee Assistance Program)",
    "level": "Edson",
    "category": "Recreation",
    "amount": "$150 per person, up to $450 per family each year",
    "summary": "Eligible Edson residents get $150 each, or up to $450 per family, toward Town community programs and Leisure Centre admissions and programs.",
    "note": "Funding is limited and first come, first served. Group and facility rentals are excluded. You must reapply each year and give current documents.",
    "requires": [
      "ab",
      "edson",
      "edsonLeisureAssistRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in the Town of Edson or Yellowhead County",
        "You get AISH, Alberta Income Support, Alberta Works or the Guaranteed Income Supplement",
        "Or you have refugee status, low income below the LICO, or a reference letter"
      ],
      "note": "The Low Income Cut-Off runs from $24,486 for 1 person to $64,797 for 7 or more."
    },
    "applyText": "Get the application form",
    "applyUrl": "https://www.edson.ca/public/download/files/350852",
    "source": "https://www.edson.ca/public/download/files/350852",
    "detail": {
      "aboutList": {
        "lead": "Leisure Assist adds credit to your account to help with recreation registration fees.",
        "items": [
          "Once approved, your Active Net account is credited with $150 per person.",
          "The credit is capped at $450 per household.",
          "A reference letter can come from a teacher, family school liaison, doctor or social worker.",
          "Each application is valid for a maximum of twelve months."
        ]
      },
      "steps": [
        "Fill in the Leisure Assist application form and list your household members.",
        "Attach proof of identity and the documents for how you qualify.",
        "Drop it off at the Griffiths Park Centre, 5414-6th Ave, or email it to cserv@edson.ca.",
        "Wait for an email about your approval."
      ],
      "documents": [
        "Low income: your most recent Canada Revenue Agency Notice of Assessment",
        "AISH or Alberta Income Support: a Health Benefit Card, direct deposit statement or T5007",
        "Guaranteed Income Supplement: a letter or direct deposit statement",
        "Refugee status: a Protected Person Status document, or a Refugee Claimant document",
        "A signed reference letter with the writer's contact information"
      ],
      "tips": [
        "If you are declined and your situation changes, you can reapply with no waiting period.",
        "If you do not attend courses you registered for, later applications may be disqualified.",
        "Applications usually take ten business days to process."
      ],
      "time": "About ten business days"
    }
  },
  {
    "id": "rocky-mountain-house-rfap",
    "name": "Recreation Facility Access Program (Rocky Mountain House)",
    "level": "Rocky Mountain House",
    "category": "Recreation",
    "amount": "50% off Town drop-ins, programs and memberships",
    "summary": "Half price on Town of Rocky Mountain House recreation for families and individuals at or under an income limit. Each person gets an Access Card for one year.",
    "note": "Cards cannot be transferred or replaced if lost. The discount cannot be combined with other offers.",
    "requires": [
      "ab",
      "rockyMountainHouse",
      "rockyMountainHouseRfapRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "Your total family income is at or under the limit for your family size",
        "You have a referral form from a referral agency that confirms you are eligible"
      ],
      "note": "The limit uses line 150 of your latest tax return, from $35,000 for 1 person to $52,500 for 5."
    },
    "applyText": "See how to apply",
    "applyUrl": "https://www.rockymtnhouse.com/p/rfap",
    "source": "https://www.rockymtnhouse.com/p/rfap",
    "detail": {
      "aboutList": {
        "lead": "Each person in an eligible household gets an Access Card that halves the cost of Town recreation.",
        "items": [
          "Each card allows 24 drop-in admissions at 50% off.",
          "Each card allows 3 program or lesson registrations at 50% off.",
          "Each card allows 1 aquatic or recreation membership at 50% off.",
          "Cards are valid for one year from the day they are issued."
        ]
      },
      "steps": [
        "Check the income limit for your family size on the Town page.",
        "Go to the Clearwater Regional FCSS office with proof of income or a referral form.",
        "Pick up one Access Card for each person in your household.",
        "Use the cards at the Rocky Regional Recreation Centre or the Co-operative Aquatic Centre."
      ],
      "documents": [
        "Your most recent income tax return, showing line 150, or a referral form from a referral agency"
      ],
      "tips": [
        "Ask Guest Services which programs and lessons can use your card.",
        "Over five people adds $2,500 to the $52,000 base limit for each extra person."
      ],
      "time": "Monday to Friday, 8:30 AM to 4:00 PM",
      "phone": "403-847-5270"
    }
  },
  {
    "id": "strathmore-community-access-card",
    "name": "Community Access Card (Strathmore)",
    "level": "Strathmore",
    "category": "Recreation",
    "amount": "10%, 25%, 50% or 75% off entry fees and memberships",
    "summary": "A discount card for Strathmore residents facing financial barriers. It covers entry and membership fees at three Town recreation facilities. Your income and family size set the discount.",
    "note": "The card does not cover swimming lessons, fitness classes or other programs. Approved cards expire on December 31 and must be renewed each year.",
    "requires": [
      "ab",
      "strathmore",
      "strathmoreCommunityAccessCardRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Strathmore",
        "Your household income and size meet the financial criteria in Town Policy 5104"
      ],
      "note": "You must show proof of income and who lives in your household."
    },
    "applyText": "See how to apply",
    "applyUrl": "https://www.strathmore.ca/living-here/family-community-support-services/resources-financial-support/community-access-card/",
    "source": "https://www.strathmore.ca/living-here/family-community-support-services/resources-financial-support/community-access-card/",
    "detail": {
      "aboutList": {
        "lead": "The card lowers entry and membership fees at Town recreation facilities for residents who qualify.",
        "items": [
          "Discounts are 10, 25, 50 or 75 percent, set by household income and family size.",
          "It works at the Aquatic Centre, the Family Centre Arena and the Motor Products Sports Centre.",
          "The card lists your household members, so entry is private.",
          "Applications are accepted year-round."
        ]
      },
      "steps": [
        "Go to the FCSS office in person, since applications cannot be done any other way.",
        "Bring your documents for every household member.",
        "Submit the application. It is accepted any time of year.",
        "Renew each year, because approvals end on December 31."
      ],
      "documents": [
        "Line 15000 from last year's notice of assessment",
        "Alberta Health Care cards or valid ID for each family member applying",
        "Proof of residency",
        "Documents showing AISH, GIS or refugee status, if they apply"
      ],
      "tips": [
        "A mid-year approval still ends on December 31.",
        "The Town posts sub-levels and the policy on the same page."
      ],
      "phone": "(403) 934-9090"
    }
  },
  {
    "id": "whitecourt-recreation-fee-assistance",
    "name": "Recreational Fee Assistance Program (Whitecourt)",
    "level": "Whitecourt",
    "category": "Recreation",
    "amount": "Subsidy for 2 programs per session or a 3 month membership",
    "summary": "A subsidy for adults and their dependents under 18 who cannot pay the full fee. It covers programs and memberships at the Allan & Jean Millar Centre. Applications are kept confidential.",
    "note": "The page does not list income limits or the subsidy rate. Families must first apply to KidSport for programs it covers.",
    "requires": [
      "ab",
      "whitecourt",
      "whitecourtRecreationFeeAssistanceRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in the Town of Whitecourt or Woodlands County",
        "Your circumstances meet the financial criteria for people unable to pay the full fee",
        "You applied to KidSport first, if you need a program it covers"
      ],
      "note": "This is for adults and their dependents under 18."
    },
    "applyText": "Visit Guest Services to apply",
    "applyUrl": "https://whitecourt.ca/play/allan-jean-millar-centre/facility-admission-information",
    "source": "https://whitecourt.ca/play/allan-jean-millar-centre/facility-admission-information",
    "detail": {
      "aboutList": {
        "lead": "The program helps people who cannot pay full fees use Allan & Jean Millar Centre programs.",
        "items": [
          "Each family member may get help with 2 programs per session.",
          "A 3 month membership may be covered instead.",
          "You can apply again each year.",
          "All applications are held in strict confidence."
        ]
      },
      "steps": [
        "Apply to KidSport first for any programs it covers.",
        "Go to Guest Services at the Allan & Jean Millar Centre to apply.",
        "Call Guest Services at 780-778-3637 for more information."
      ],
      "documents": [],
      "tips": [
        "The page does not list the financial criteria, so call Guest Services for more information."
      ],
      "phone": "780-778-3637"
    }
  },
  {
    "id": "belleville-recreation-fee-assistance",
    "name": "Recreation Fee Assistance (Belleville)",
    "level": "Belleville",
    "category": "Recreation",
    "amount": "25%, 50% or 75% off City recreation program fees",
    "summary": "A discount on City of Belleville recreation programs and facility visits. Your household income sets the rate. Approval lasts from July 1 to June 30.",
    "note": "Private, semi-private and low-ratio lessons, personal training, exam fees and add-ons are not covered. You renew every year. An appointment is needed only every other year unless your address or other details change.",
    "requires": [
      "on",
      "belleville",
      "bellevilleRecreationFeeAssistanceRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Belleville",
        "Your total family income is within the City's chart limit for your family size"
      ],
      "note": "The City's chart gives the 75, 50 and 25 percent income limits for families of 1 to 7."
    },
    "applyText": "Apply for fee assistance",
    "applyUrl": "https://www.belleville.ca/learn-and-play/recreation/recreation-guide-and-registration-information/recreation-fee-assistance/",
    "source": "https://www.belleville.ca/learn-and-play/recreation/recreation-guide-and-registration-information/recreation-fee-assistance/",
    "detail": {
      "aboutList": {
        "lead": "Approved households pay a lower rate on eligible City programs without reapplying for each one.",
        "items": [
          "Eligible programs may include camps, group swim and skate lessons, and aquafit sessions.",
          "Eligible programs may also include session passes, drop-ins and facility memberships.",
          "Aquatic leadership courses, such as Bronze Cross, may be eligible.",
          "The rate is 25, 50 or 75 percent off, set by your income."
        ]
      },
      "steps": [
        "Fill in the application online, or call 613-966-4632 to ask for a form.",
        "Wait for an email with instructions to book an appointment.",
        "Expect a call within 10 business days to confirm the appointment.",
        "Bring your documents to the appointment.",
        "Register for eligible programs at your approved rate."
      ],
      "documents": [
        "Photo ID showing your address, for each household member 18 and over",
        "Proof of income for everyone in the household, such as a Notice of Assessment, ODSP or Ontario Works statement",
        "Proof of residency, such as a property tax bill or rental agreement"
      ],
      "tips": [
        "To reapply, apply online or in person and hand in documents at the Quinte Sports & Wellness Centre."
      ],
      "phone": "613-966-4632"
    }
  },
  {
    "id": "chatham-kent-affordable-bus-pass",
    "name": "Affordable Bus Pass (Chatham-Kent Transit)",
    "level": "Chatham-Kent",
    "category": "Transit",
    "amount": "30-day unlimited urban transit pass for $41.99",
    "summary": "A 30-day rolling pass with unlimited rides on urban routes for Chatham-Kent residents with a low family income. You can load 30, 60 or 90 days at a time.",
    "note": "The pass also covers specialized transit in Chatham and Wallaceburg. The card cannot be passed to someone else.",
    "requires": [
      "on",
      "chathamKent",
      "chathamKentAffordableBusPassRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Chatham-Kent",
        "Your yearly combined family income is at or below the Statistics Canada before-tax low-income measure"
      ],
      "note": "The limit depends on your family size, and ODSP clients can show current income statements."
    },
    "applyText": "Apply for the pass",
    "applyUrl": "https://www.chatham-kent.ca/transit/fares/Pages/Affordable-Pass.aspx",
    "source": "https://www.chatham-kent.ca/transit/fares/Pages/Affordable-Pass.aspx",
    "detail": {
      "aboutList": {
        "lead": "The pass gives low-income residents a fixed price for unlimited urban bus rides.",
        "items": [
          "It starts the first time you scan it and runs for 30 days in a row.",
          "It works on Chatham and Wallaceburg urban routes.",
          "It also covers specialized transit."
        ]
      },
      "steps": [
        "Fill in the application form.",
        "Gather a tax notice and ID for each family member.",
        "Submit everything to the Chatham-Kent Civic Centre.",
        "Load 30, 60 or 90 days onto your card after you are approved."
      ],
      "documents": [
        "A signed application form",
        "A current Canada Revenue Agency Notice of Assessment for every family member with income",
        "Identification for you and each family member, such as a birth certificate, license, passport or health card"
      ],
      "tips": [
        "The pass costs $41.99.",
        "The Affordable Bus Pass Policy on the transit site has more detail."
      ],
      "phone": "519-436-3233"
    }
  },
  {
    "id": "cornwall-fair",
    "name": "Fee Assistance in Recreation, FAIR (Cornwall)",
    "level": "Cornwall",
    "category": "Recreation",
    "amount": "75% of costs covered, up to $300 a year",
    "summary": "The City covers 75 percent of swimming lessons, City sports and other recreation programs for low-income residents. You pay 25 percent. It also covers pool memberships and public skating passes.",
    "note": "The $300 yearly cap applies. Each year on June 1 you send in the previous year's tax documents.",
    "requires": [
      "on",
      "cornwall",
      "cornwallFairRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in the City of Cornwall",
        "You are 18 or older to apply",
        "Your yearly combined family income is at or below the Statistics Canada Low Income Cut-Off",
        "You have not used up the yearly funding maximum"
      ]
    },
    "applyText": "Apply for FAIR",
    "applyUrl": "https://www.cornwall.ca/en/recreation-community-supports/recreation-and-sports/fee-assistance-in-recreation/",
    "source": "https://www.cornwall.ca/en/recreation-community-supports/recreation-and-sports/fee-assistance-in-recreation/",
    "detail": {
      "aboutList": {
        "lead": "FAIR lowers what you pay for City recreation so cost is not a barrier.",
        "items": [
          "You pay only 25 percent of eligible costs.",
          "Swimming lessons and City sports are included.",
          "Pool memberships and public skating passes are included.",
          "Support stops once you reach $300 for the year."
        ]
      },
      "steps": [
        "Fill in the FAIR client application form.",
        "Add ID for each family member and one proof of income.",
        "Add proof that you live in Cornwall.",
        "Email the full package to the City.",
        "Send last year's documents again each June 1."
      ],
      "documents": [
        "One photocopy of ID for each family member",
        "One of these, showing your address: a Notice of Assessment for each adult, an Ontario Works or ODSP statement of deposit, a Canada Child Benefit notice, or a GIS notice",
        "Proof of residency, such as a lease, utility bill or driver's licence"
      ],
      "tips": [
        "Canadian Tire Jumpstart can also help with youth sports costs."
      ]
    }
  },
  {
    "id": "peterborough-recreation-subsidy",
    "name": "Recreation Program Subsidy (Peterborough)",
    "level": "Peterborough",
    "category": "Recreation",
    "amount": "$100 or $200 a year toward recreation registration",
    "summary": "A yearly subsidy toward registration for sports, camps and recreation programs in Peterborough. People with a low income or on Ontario Works or ODSP can apply. Your income decides if you get $100 or $200.",
    "note": "It covers registration fees only, not equipment or after-school programs. Programs outside City limits are not covered.",
    "requires": [
      "on",
      "peterborough",
      "peterboroughRecreationSubsidyRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You live in Peterborough and your household income is under the low-income cut-off chart",
        "You live in Peterborough and receive Ontario Works or ODSP"
      ],
      "note": "The limit is $39,668 for a household of up to five for the full $200, and $39,669 to $43,993 for $100."
    },
    "applyText": "Apply for the subsidy",
    "applyUrl": "https://www.peterborough.ca/recsubsidy",
    "source": "https://www.peterborough.ca/recsubsidy",
    "detail": {
      "aboutList": {
        "lead": "The subsidy is paid straight to the program provider, or refunded if you already paid.",
        "items": [
          "Children aged 17 and under can get up to $200 a year each.",
          "Adults can get up to $200 a year for programs at City facilities.",
          "Sports leagues, camps, dance, martial arts and skating lessons count.",
          "You can apply for several programs and people at once."
        ]
      },
      "steps": [
        "Check your household income against the chart.",
        "Upload your documents in the online application.",
        "Register for your programs, then pay anything above your subsidy.",
        "For other groups, give them the Verification of Subsidy letter."
      ],
      "documents": [
        "Notice of Assessment or Canada Child Tax Benefit statement for each adult, since pay stubs are not accepted",
        "Statement of Assistance for anyone on Ontario Works or ODSP",
        "Proof of a City of Peterborough address",
        "The program name and start date"
      ],
      "tips": [
        "To be refunded, apply within 30 days of paying.",
        "Staff can help with your application by email or phone."
      ],
      "phone": "705-742-0050 ext. 1574"
    }
  },
  {
    "id": "peterborough-ow-odsp-transit-pass",
    "name": "Subsidized City Bus Pass (Peterborough, OW and ODSP)",
    "level": "Peterborough",
    "category": "Transit",
    "amount": "30-day City bus pass for $49",
    "summary": "A subsidized monthly Peterborough Transit pass for adults on Ontario Works and for people on ODSP. A 30-day pass costs $49.",
    "note": "Ontario Works clients may be eligible if they do not get transportation money from their Case Manager.",
    "requires": [
      "on",
      "peterborough",
      "peterboroughOwOdspTransitPassRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You are an adult on Ontario Works in the City or County and get no travel money from your Case Manager",
        "You are an ODSP client living in the City or County of Peterborough"
      ]
    },
    "applyText": "See how to get the pass",
    "applyUrl": "https://peterborough.ca/recreation-culture-social-services/social-services/ontario-works/transportation-help",
    "source": "https://peterborough.ca/recreation-culture-social-services/social-services/ontario-works/transportation-help",
    "detail": {
      "aboutList": {
        "lead": "The pass lowers the price of monthly City bus travel for people on Ontario Works or ODSP.",
        "items": [
          "You buy it in person at the Peterborough Transit bus terminal.",
          "Both city and county residents on these programs can use it."
        ]
      },
      "steps": [
        "Take your statement of assistance for the current month and personal ID.",
        "Go to the Peterborough Transit bus terminal at 190 Simcoe St.",
        "Buy the 30-day pass for $49."
      ],
      "documents": [
        "Your Ontario Works or ODSP statement of assistance for the current month",
        "Personal identification"
      ],
      "tips": [
        "Ontario Works clients can ask their Case Manager about the pass."
      ],
      "phone": "705-748-8830"
    }
  },
  {
    "id": "campbell-river-life",
    "name": "L.I.F.E. Program (Campbell River)",
    "level": "Campbell River",
    "category": "Recreation",
    "amount": "52 free drop-ins and 50% off three programs",
    "summary": "The L.I.F.E. card gives Campbell River residents who face financial challenges 52 free drop-in admissions. It also gives 50% off fees for three City recreation programs.",
    "note": "Some programs are excluded, including Summerside Express summer camps. Each family member can get a card. Cards last one calendar year.",
    "requires": [
      "bc",
      "campbellRiver",
      "campbellRiverLifeRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Campbell River",
        "You meet the income requirements on the application form"
      ],
      "note": "The income limits are on the application form, not on the page."
    },
    "applyText": "See L.I.F.E. program details",
    "applyUrl": "https://www.campbellriver.ca/parks-recreation-culture/recreation/affordable-recreation",
    "source": "https://www.campbellriver.ca/parks-recreation-culture/recreation/affordable-recreation",
    "detail": {
      "aboutList": {
        "lead": "The L.I.F.E. card lowers recreation costs for Campbell River residents with limited funds.",
        "items": [
          "52 free drop-in admissions, including Centennial Pool, the weight room and drop-in classes.",
          "50% off fees for three City of Campbell River recreation programs.",
          "Some exceptions apply to the discount, such as Summerside Express summer camps.",
          "Every family member can have one LIFE card."
        ]
      },
      "steps": [
        "Get the form at the Sportsplex or Community Centre, or print it from the page",
        "Fill in the whole form",
        "Hand it to office staff at the Sportsplex or Community Centre with your proof documents",
        "Show your card whenever you want the reduced fee"
      ],
      "documents": [
        "Proof of residency with your current address, such as a driver's licence or current utility bill",
        "Proof of income, such as a Notice of Assessment, EI, disability or pension stubs"
      ],
      "tips": [
        "Applications that are not filled in fully are not accepted.",
        "A card is cancelled if the information on the form is false.",
        "Cards are not transferable and have no cash value."
      ]
    }
  },
  {
    "id": "colwood-langford-life",
    "name": "LIFE Program (West Shore Parks & Recreation)",
    "level": "Colwood",
    "category": "Recreation",
    "amount": "Low-income access to recreation centres",
    "summary": "LIFE helps people and families with low incomes use recreation services and programs at municipal recreation centres in Greater Victoria. It is run by West Shore Parks & Recreation.",
    "note": "LIFE passes cannot be transferred or exchanged for cash or credit.",
    "requires": [
      "bc",
      "colwoodArea",
      "colwoodLangfordLifeRoute",
      "noPostSecondaryStudents"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Colwood, Langford, Highlands, Metchosin or View Royal",
        "Your combined gross household income is at or below the Statistics Canada low income thresholds",
        "You are not a full-time post-secondary student at Royal Roads, UVic or Camosun College"
      ],
      "note": "Newcomers within 5 years of immigrating may use travel documents instead of a Notice of Assessment in year one."
    },
    "applyText": "See LIFE program details",
    "applyUrl": "https://www.wspr.ca/inclusion-support/financial-support",
    "source": "https://www.wspr.ca/inclusion-support/financial-support",
    "detail": {
      "aboutList": {
        "lead": "LIFE opens Greater Victoria recreation centres to West Shore households with low incomes.",
        "items": [
          "Works at all municipal recreation centres in Greater Victoria.",
          "Members can book a free weight room orientation at Juan de Fuca.",
          "The page does not list a dollar amount or discount rate.",
          "A lost card costs $5 plus tax to replace."
        ]
      },
      "steps": [
        "Fill in one application per family",
        "Gather proof of residency and your Notice of Assessment",
        "Drop off the form at reception at the Juan de Fuca Recreation Centre, 1767 Island Highway, Victoria",
        "Have your picture taken for your LIFE card"
      ],
      "documents": [
        "Current proof of residency, such as a utility bill, rental agreement or government ID",
        "A 2024 or 2025 Notice of Assessment",
        "Newcomers: official travel documents for each family member in the first year"
      ],
      "tips": [
        "A separate form exists for youth without family support.",
        "An adjudicator form is also on the page.",
        "Replacement cards lose 4 visits a month from January up to the replacement date."
      ],
      "phone": "250-478-8384"
    }
  },
  {
    "id": "courtenay-comox-rap-leap",
    "name": "Recreation Access Program and LEAP (Comox Valley)",
    "level": "Courtenay",
    "category": "Recreation",
    "amount": "52 free drop-ins plus program discounts",
    "summary": "LEAP gives Comox Valley residents with lower incomes 52 free drop-in visits a year and a $350 subsidy per family member. Courtenay residents also get RAP discounts on registered programs.",
    "note": "RAP is for Courtenay residents only; LEAP is regional.",
    "requires": [
      "bc",
      "courtenayArea",
      "courtenayComoxRapLeapRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in the Comox Valley",
        "Your household income is within the Statistics Canada after-tax low-income measure (LIM-AT)"
      ],
      "note": "RAP is for City of Courtenay residents; other Comox Valley residents use LEAP."
    },
    "applyText": "See RAP and LEAP details",
    "applyUrl": "https://courtenay.ca/EN/main/community/recreation/recreation-access.html",
    "source": "https://courtenay.ca/EN/main/community/recreation/recreation-access.html",
    "detail": {
      "aboutList": {
        "lead": "One application covers both programs for lower-income Comox Valley residents.",
        "items": [
          "LEAP drop-in visits work at participating Comox Valley recreation centres.",
          "LEAP: a $350 subsidy per family member for registered programs.",
          "RAP for Courtenay residents: children get 75% off, up to $450 a year.",
          "RAP: youth get 75% off, up to $400 a year.",
          "RAP: adults get 50% off, up to $350 a year."
        ]
      },
      "steps": [
        "Download the combined Recreation Access and LEAP 2026 application form",
        "Complete it",
        "Take it to the Lewis or Florence Filberg centre with your documents",
        "Wait for staff to contact you when your recreation cards are ready"
      ],
      "documents": [
        "Proof of Comox Valley residency, such as a utility bill or rental receipt",
        "A B.C. Services Card for you and each family member applying"
      ],
      "tips": [
        "Drop-ins include swimming, fitness, the Wellness Centre, parent and tot programs, The LINC Youth Centre and skating.",
        "A program summary sheet is on the page."
      ],
      "phone": "250-338-1000"
    }
  },
  {
    "id": "cranbrook-leisure-access",
    "name": "Leisure Access Program (Cranbrook)",
    "level": "Cranbrook",
    "category": "Recreation",
    "amount": "75% off swim rates and free transit",
    "summary": "The Leisure Access Program gives Cranbrook residents with limited income 75% off regular swim rates and free transit passes. Children under seven swim free with an adult.",
    "note": "Transit passes are handed out monthly, cannot be transferred and are not replaced if lost or stolen. Benefits last one year, then you must re-apply.",
    "requires": [
      "bc",
      "cranbrook",
      "cranbrookLeisureAccessRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Cranbrook",
        "Your household income is at or below the limit for your family size"
      ],
      "note": "Limits run from $20,848 for 1 person to $55,172 for 7 people; a family of 4 is $38,740."
    },
    "applyText": "See Leisure Access Program details",
    "applyUrl": "https://cranbrook.ca/our-city/city-departments/leisure-services/services/leisure-access-program",
    "source": "https://cranbrook.ca/our-city/city-departments/leisure-services/services/leisure-access-program",
    "detail": {
      "aboutList": {
        "lead": "The program lowers swim and transit costs.",
        "items": [
          "75% off regular swim rates for public swims, Aquafit and joint mobility classes.",
          "Free public swims for children under seven, with an adult.",
          "Free transit access through monthly transit passes."
        ]
      },
      "steps": [
        "Check your family size against the income chart",
        "Contact one of the four adjudicating agencies listed on the page",
        "Meet the adjudicator, who checks your information and fills out your application",
        "Wait about a week, then book an appointment with Recreation & Culture to register",
        "Show residency and ID at that appointment"
      ],
      "documents": [
        "Government-issued photo ID with your current address",
        "Proof of address in one adult's name, such as a utility bill, bank statement or rental contract",
        "Notice of Assessment or T1 General for each adult, or a Release of Information from MSDSI",
        "Canada Child Benefit notice if children are on the application"
      ],
      "tips": [
        "The adjudicators are Salvation Army, Community Connections Society, Interior Health Mental Health Programs and MCFD.",
        "Release of Information forms are at Service BC, 101-100 Cranbrook Street N.",
        "If you do not qualify, check the pool schedule for Free Family Swims."
      ],
      "phone": "250-489-0220"
    }
  },
  {
    "id": "duncan-leisure-access",
    "name": "Leisure Access Program (Duncan)",
    "level": "Duncan",
    "category": "Recreation",
    "amount": "Annual drop-in access",
    "summary": "The Leisure Access Program gives economically disadvantaged residents annual access to drop-in programs at the Cowichan Aquatic Centre and Fuller Lake Arena. City of Duncan residents can apply.",
    "note": "North Cowichan runs the program for several areas, including the City of Duncan. The page gives no dollar value for the access.",
    "requires": [
      "bc",
      "duncan",
      "duncanLeisureAccessRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in the City of Duncan or another listed area",
        "Your gross household income is under the cutoff for your household size"
      ],
      "note": "Cutoffs run from $27,308 for 1 person to $72,268 for 7 or more; a household of 4 is $50,744."
    },
    "applyText": "Apply for the Leisure Access Program",
    "applyUrl": "https://www.northcowichan.ca/form/leisure-access-program-application",
    "source": "https://www.northcowichan.ca/form/leisure-access-program-application",
    "detail": {
      "aboutList": {
        "lead": "The program covers drop-in use of two Cowichan area facilities for lower-income households.",
        "items": [
          "Open to residents of North Cowichan, the CVRD, Duncan, Cowichan Tribes Reserve Lands and Ladysmith."
        ]
      },
      "steps": [
        "Fill in the online application",
        "List every person in your household",
        "Upload photo ID and your 2025 Notice of Assessment, or use an agency referral",
        "Submit the form"
      ],
      "documents": [
        "Current government-issued photo ID for each applicant over 18, with a matching address",
        "2025 Notice of Assessment, line 15000",
        "Or a referral completed by a listed agency, with its stamp or business card"
      ],
      "tips": [
        "Total gross household income means all income before taxes from every household member.",
        "Referral agencies are MCFD, Ministry of Housing and Social Development, Community Living BC, Cowichan Valley Youth Services and Cowichan Tribes Social Development.",
        "Passes can be cancelled for breaking facility rules or the Code of Conduct."
      ]
    }
  },
  {
    "id": "mission-play-pass",
    "name": "PLAY Pass (Mission)",
    "level": "Mission",
    "category": "Recreation",
    "amount": "Free Leisure Centre admissions",
    "summary": "The PLAY Pass gives free admissions to the Mission Leisure Centre. You qualify with a low income or by being on income assistance. There is a small admin fee.",
    "note": "The fee is $5 for an individual and $10 for a family. Processing can take up to three weeks.",
    "requires": [
      "bc",
      "mission",
      "missionPlayPassRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have lived in Mission for at least 3 months",
        "Your income is at or below the CRA low income thresholds, or you get Income Assistance"
      ],
      "note": "Income Assistance means the provincial ministry or the Federal Social Development Program."
    },
    "applyText": "Apply for a PLAY Pass",
    "applyUrl": "https://mission.ca/playpass",
    "source": "https://www.mission.ca/node/1114",
    "detail": {
      "aboutList": {
        "lead": "The PLAY Pass removes the entry cost at the Leisure Centre for lower-income residents.",
        "items": [
          "Free admissions to the Leisure Centre.",
          "Based on the CRA low income threshold or income assistance.",
          "The page does not say how many free visits you get."
        ]
      },
      "steps": [
        "Apply online at mission.ca/playpass or in person at the Leisure Centre",
        "Pay the admin fee when your application is approved",
        "Wait up to three weeks for processing"
      ],
      "documents": [],
      "tips": [
        "The page points to a more information link for the full rules."
      ]
    }
  },
  {
    "id": "penticton-life",
    "name": "LIFE Program (Penticton)",
    "level": "Penticton",
    "category": "Recreation",
    "amount": "Free and low-cost recreation",
    "summary": "The LIFE program gives free and low-cost recreation at the Penticton Community Centre. It is for Penticton residents with a limited family income.",
    "note": "The page does not list an income limit or the exact discount. Check the LIFE information form or ask at the Community Centre.",
    "requires": [
      "bc",
      "penticton",
      "pentictonLifeRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Penticton",
        "Your family income is limited"
      ],
      "note": "The page gives no income amount, so the form decides."
    },
    "applyText": "See LIFE program details",
    "applyUrl": "https://www.penticton.ca/node/71",
    "source": "https://www.penticton.ca/node/71",
    "detail": {
      "aboutList": {
        "lead": "LIFE lowers the cost of recreation.",
        "items": [
          "It is for residents of Penticton on a limited family income.",
          "The LIFE Pass Information Form and Application Form are online."
        ]
      },
      "steps": [
        "Read the LIFE Pass Information Form",
        "Fill in the application form",
        "Return it with all required documents to the Community Centre at 325 Power Street"
      ],
      "documents": [
        "All documents the application form asks for"
      ],
      "tips": [
        "You can pick up a paper form at the Community Centre."
      ]
    }
  },
  {
    "id": "penticton-access-pass",
    "name": "Access Pass (Penticton)",
    "level": "Penticton",
    "category": "Recreation",
    "amount": "25% off fitness room and pool passes",
    "summary": "The Access Pass gives 25% off passes to the fitness room, pool or both. It is for people with a permanent cognitive or physical disability.",
    "note": "The discount also applies to promotional deals. It covers 10-ticket, 1, 3, 6 and 12 month passes.",
    "requires": [
      "bc",
      "penticton",
      "pentictonAccessPassRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have a permanent cognitive or physical disability"
      ]
    },
    "applyText": "See Access Pass details",
    "applyUrl": "https://www.penticton.ca/node/71",
    "source": "https://www.penticton.ca/node/71",
    "detail": {
      "aboutList": {
        "lead": "Access Pass holders get a lower price on recreation passes.",
        "items": [
          "The discount is 25% off 10-ticket passes.",
          "It works for the fitness room, the pool, or the combined pass."
        ]
      },
      "steps": [
        "Download the Access Pass application form",
        "Complete it",
        "Follow the form's instructions for where to send it"
      ],
      "documents": [
        "The completed Access Pass application form"
      ],
      "tips": [
        "The page links to more information with the form."
      ]
    }
  },
  {
    "id": "pitt-meadows-fee-subsidy",
    "name": "Program and Admission Fee Subsidy (Pitt Meadows)",
    "level": "Pitt Meadows",
    "category": "Recreation",
    "amount": "Discounted program and admission fees for one year",
    "summary": "Pitt Meadows residents with a low income can get discounted recreation program and admission fees for one year. You pay part of each fee.",
    "note": "The policy does not state the discount amount. Temporary residents, including people on study or work permits, are excluded.",
    "requires": [
      "bc",
      "pittMeadows",
      "pittMeadowsFeeSubsidyRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Pitt Meadows",
        "Your income is at or below the federal low-income cut-off",
        "Your documents show at least $5,000 of income"
      ],
      "note": "Visitors and people on a study or work permit are excluded."
    },
    "applyText": "See the subsidy policy",
    "applyUrl": "https://www.pittmeadows.ca/media/5925",
    "source": "https://www.pittmeadows.ca/media/5925",
    "detail": {
      "aboutList": {
        "lead": "Council Policy C083 sets up a fee subsidy for local residents who cannot afford full fees.",
        "items": [
          "It covers program fees and admission fees.",
          "Approval lasts one year, and you can reapply each year.",
          "Everyone still pays a portion of the fee."
        ]
      },
      "steps": [
        "Gather proof that you live in Pitt Meadows",
        "Gather proof that your income meets the cut-off",
        "Complete the Fee Subsidy Application Form",
        "Reapply each year with the same documents"
      ],
      "documents": [
        "Proof of local residence",
        "Income documents showing you meet the cut-off and have at least $5,000 of income"
      ],
      "tips": [
        "Business class immigrants, investors and entrepreneurs are also excluded."
      ]
    }
  },
  {
    "id": "port-moody-leisure-access",
    "name": "Leisure Access Program (Port Moody)",
    "level": "Port Moody",
    "category": "Recreation",
    "amount": "50% off admissions, fitness passes and some programs",
    "summary": "Port Moody residents in financial need get 50% off admissions, fitness passes and some programs. The card lasts up to one year.",
    "note": "Your family income must fall between a minimum and a maximum that depend on family size. Free skate and helmet rentals are included.",
    "requires": [
      "bc",
      "portMoody",
      "portMoodyLeisureAccessRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Port Moody",
        "Your family income is above the minimum and below the maximum for your family size"
      ],
      "note": "For one person, income must be from $5,000 to $23,861."
    },
    "applyText": "See the application form",
    "applyUrl": "https://www.portmoody.ca/media/pybmlml1/leisure-access-application-form.pdf",
    "source": "https://www.portmoody.ca/media/pybmlml1/leisure-access-application-form.pdf",
    "detail": {
      "aboutList": {
        "lead": "The Leisure Access Card gives half-price recreation for the whole family.",
        "items": [
          "50% off single drop-ins, fitness passes and skating or aquatics passes.",
          "50% off up to four registered programs per family member each year.",
          "50% off up to two weeks of all-day summer camp per person.",
          "Free skate and helmet rentals."
        ]
      },
      "steps": [
        "Complete the Leisure Access application form",
        "Attach the checklist documents",
        "Take it to the Recreation Complex or Kyle Centre",
        "Have a photo taken for each family member",
        "Reapply each year, at least a month before expiry"
      ],
      "documents": [
        "Government photo ID",
        "Utility bill in an adult's name",
        "GST credit notice",
        "Child benefit notices if you have dependents",
        "Cheque stub from your income source",
        "Notice of Assessment for each income earner"
      ],
      "tips": [
        "Private lessons and party packages are not included.",
        "Students living at home must include their family's income."
      ],
      "time": "Valid up to one year"
    }
  },
  {
    "id": "prince-rupert-recreation-access",
    "name": "Recreation Access Program (Prince Rupert)",
    "level": "Prince Rupert",
    "category": "Recreation",
    "amount": "90% off for children and youth, 50% off for adults",
    "summary": "Prince Rupert subsidizes recreation fees by 90% for children and youth and 50% for adults. Each eligible family member also gets 50 free admissions a year.",
    "note": "Funding is first come, first served until the budget is used. Eligibility is based only on financial need.",
    "requires": [
      "bc",
      "princeRupert",
      "princeRupertRecreationAccessRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You get a named provincial benefit such as disability assistance, social assistance or a Seniors Supplement",
        "Your tax and benefit documents show financial need"
      ],
      "note": "You also need photo ID and proof you live in Prince Rupert."
    },
    "applyText": "Apply for the Recreation Access Program",
    "applyUrl": "https://www.princerupert.ca/node/988",
    "source": "https://www.princerupert.ca/node/988",
    "detail": {
      "aboutList": {
        "lead": "The program helps people in need use the Rec Complex at a lower cost.",
        "items": [
          "The subsidy works toward memberships, visit passes or registered programs.",
          "The 50 free admissions can be used for the gymnasium, swimming or skating.",
          "Approval lasts one year and is reviewed each year."
        ]
      },
      "steps": [
        "Check that you can show proof of financial assistance",
        "Get a referral letter if you need one",
        "Fill in the form, on paper or online",
        "Attach your documents",
        "Call to book an intake appointment if you want help"
      ],
      "documents": [
        "Photo ID for all adults",
        "Proof you live in Prince Rupert",
        "Proof of assistance, or a Notice of Assessment for all adults and a Child Tax Benefit notice for dependents"
      ],
      "tips": [
        "Applications are kept confidential.",
        "A missed program with no cancellation may affect later subsidy requests."
      ],
      "phone": "(250) 624 6707"
    }
  },
  {
    "id": "quesnel-leisure-access",
    "name": "Leisure Access Card (Quesnel)",
    "level": "Quesnel",
    "category": "Recreation",
    "amount": "50% off swimming and skating, 25% off programs",
    "summary": "Quesnel gives 50% off public swimming and skating admissions and 25% off programs. It is for people on income assistance or with a low household income.",
    "note": "The card is valid for one year from the day the application is accepted. Show both your Resident Card and your Leisure Access Card.",
    "requires": [
      "bc",
      "quesnel",
      "quesnelLeisureAccessRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You get income assistance from the provincial ministry",
        "Your household income is at or below the limit for your family size"
      ],
      "note": "The limit is $24,486 for one person and $64,797 for seven or more."
    },
    "applyText": "Apply for the Leisure Access Card",
    "applyUrl": "https://www.quesnel.ca/node/4489",
    "source": "https://www.quesnel.ca/node/4489",
    "detail": {
      "aboutList": {
        "lead": "The card lowers costs at the Arts and Recreation Centre and Quesnel Arenas.",
        "items": [
          "The swimming and skating discount is for children and adults.",
          "25% off programs at the Arts and Recreation Centre and the arenas."
        ]
      },
      "steps": [
        "Complete the application form",
        "Have proof of financial need ready",
        "Submit the form with your proof",
        "Renew with a new application when the card is about to expire"
      ],
      "documents": [
        "A signed Release of Personal Information form, or your latest Notice of Assessment",
        "A Seniors Supplement card or a current Employment Insurance form also works"
      ],
      "tips": [
        "New applicants and renewals both fill in a new application.",
        "The program is paid for by North Cariboo Parks and Recreation taxes."
      ]
    }
  },
  {
    "id": "squamish-recreation-access",
    "name": "Recreation Access Program (Squamish)",
    "level": "Squamish",
    "category": "Recreation",
    "amount": "50% off recreation services and registered programs",
    "summary": "Squamish residents in financial need get 50% off recreation services and registered programs. The card is valid for one year.",
    "note": "Gross household income must be under the limit for your size (from $26,570 for one person, 2024 form). The form also mentions a minimum; ask the District.",
    "requires": [
      "bc",
      "squamish",
      "squamishRecreationAccessRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in the District of Squamish",
        "Your household income is under the limit for your household size",
        "You have the original required documents"
      ],
      "note": "The page lists limits from $26,570 for one person to $70,298 for seven."
    },
    "applyText": "See the application form",
    "applyUrl": "https://squamish.ca/assets/000-Recreation-Services/000_Forms/RAP-updated-form_-2024.pdf",
    "source": "https://squamish.ca/assets/000-Recreation-Services/000_Forms/RAP-updated-form_-2024.pdf",
    "detail": {
      "aboutList": {
        "lead": "The Recreation Access Card lowers the cost of recreation for households in need.",
        "items": [
        ]
      },
      "steps": [
        "Check the self-assessment on the form",
        "Complete the application form",
        "Bring it with your documents to Brennan Park Recreation Centre"
      ],
      "documents": [
        "Government-issued ID for the main applicant",
        "For each adult, a Notice of Assessment, proof of income, or an income assistance or disability statement",
        "Proof of residency such as a lease or Canada Child Benefit notice"
      ],
      "tips": [
        "Approved agencies can take your application, including PearlSpace and Sea to Sky Community Services.",
        "Staff can help if you lack the documents."
      ],
      "phone": "604.898.3604"
    }
  },
  {
    "id": "terrace-affordable-recreation-access",
    "name": "Affordable Recreation Access Program (Terrace)",
    "level": "Terrace",
    "category": "Recreation",
    "amount": "50% off drop-in fees and short memberships",
    "summary": "Terrace gives a discount card for 50% off drop-in fees and short memberships. It is for people who get certain provincial or federal assistance or disability benefits.",
    "note": "Fitness class registration, rentals, swimming lessons and other registered activities are not included.",
    "requires": [
      "bc",
      "terrace",
      "terraceAffordableRecreationAccessRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You get regular income assistance, PWD or PPMB benefits",
        "You get Canada Pension Plan Disability",
        "You get the Guaranteed Income Supplement or the Child Disability Benefit"
      ]
    },
    "applyText": "See the program details",
    "applyUrl": "https://www.terrace.ca/sites/default/files/2026-06/Affordable%20Recreation%20Access%20Program%20-%20Revised%20June%2022%202026.pdf",
    "source": "https://www.terrace.ca/sites/default/files/2026-06/Affordable%20Recreation%20Access%20Program%20-%20Revised%20June%2022%202026.pdf",
    "detail": {
      "aboutList": {
        "lead": "A discount card lowers the price of drop-in visits and short memberships.",
        "items": [
          "It gives 50% off drop-in fees.",
          "It covers 10-visit, 1 month and 3 month memberships.",
          "Buy memberships before the card expires."
        ]
      },
      "steps": [
        "Pick up the application and letter at the Terrace and District Aquatic Centre",
        "Complete the form",
        "Take it to Service BC or Service Canada to verify your benefits",
        "Bring the paperwork back to the Aquatic Centre"
      ],
      "documents": [
        "The completed application form",
        "A Release of Personal Information form (HR0095) for provincial benefits",
        "The standard benefit letter for CPP Disability, the Guaranteed Income Supplement or the Child Disability Benefit",
        "Identification"
      ],
      "tips": [
        "Cards expire on a schedule: every six months for some benefits and yearly for PWD.",
        "People on regular income assistance get cards for up to 3 dependent children too."
      ],
      "phone": "250-615-3030"
    }
  },
  {
    "id": "white-rock-leisure-access",
    "name": "Leisure Access Program (White Rock)",
    "level": "White Rock",
    "category": "Recreation",
    "amount": "50% off programs and memberships, up to $300 a year",
    "summary": "White Rock gives low-income residents 50% off eligible recreation programs or memberships, up to $300 a year. Skating at Centennial Arena is free.",
    "note": "South Surrey residents are not eligible. They can apply to the City of Surrey program instead.",
    "requires": [
      "bc",
      "whiteRock",
      "whiteRockLeisureAccessRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a permanent resident of the City of White Rock",
        "Your family income is at or below the limit for your family size"
      ],
      "note": "The limit is $26,926 for one person and $64,000 for six."
    },
    "applyText": "Apply for the Leisure Access Program",
    "applyUrl": "https://www.whiterockcity.ca/825/Leisure-Access-Program",
    "source": "https://www.whiterockcity.ca/825/Leisure-Access-Program",
    "detail": {
      "aboutList": {
        "lead": "The program helps residents join recreation when money is tight.",
        "items": [
          "It gives 50% off eligible programs or memberships, up to $300 per year.",
          "It includes free public skating at Centennial Arena.",
          "Annual and 20-session passes for Grandview Heights Aquatic Centre and South Surrey Indoor Pool are 50% off."
        ]
      },
      "steps": [
        "Download the application form",
        "Include the total income of all adults in the household",
        "Complete one application per family",
        "Contact Recreation and Culture to arrange your submission"
      ],
      "documents": [
        "The completed application form and the documents it requires"
      ],
      "tips": [
        "Total income for all adults in the household must be included."
      ],
      "phone": "604-541-2199"
    }
  },
  {
    "id": "brantford-recreation-subsidy",
    "name": "Recreation Financial Assistance (Brantford)",
    "level": "Brantford",
    "category": "Recreation",
    "amount": "25%, 50% or 75% of program fees paid, or 100% on assistance",
    "summary": "The City pays part of drop-in and registered program fees for children and youth 17 and under. The share depends on family size and gross income. Ontario Works, ODSP and refugee-status families get 100% with documents.",
    "note": "Help is limited to two programs per person per season and two weeks of summer camp. Funds and programs must be available. Some restrictions apply. It is free to apply.",
    "requires": [
      "on",
      "brantford",
      "brantfordRecreationSubsidyRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "Your family's gross annual income falls within the City's chart for your family size",
        "You are on Ontario Works or ODSP, or your family has refugee status"
      ],
      "note": "The program is for children and youth 17 and under."
    },
    "applyText": "Apply for financial assistance",
    "applyUrl": "https://www.brantford.ca/en/things-to-do/recreational-programs-financial-assistance.aspx",
    "source": "https://www.brantford.ca/en/things-to-do/recreational-programs-financial-assistance.aspx",
    "detail": {
      "aboutList": {
        "lead": "The City pays a share of fees, based on family size and income.",
        "items": [
          "The City pays 75% if gross income is $0 to $22,000 for a family of 1 or 2.",
          "The share drops to 50% and then 25% at higher income bands in the chart.",
          "Bands run up to $51,900 for a family of 6 or more.",
          "It covers most drop-in and registered programs, if funds and programs are available."
        ]
      },
      "steps": [
        "Check the financial assistance chart for your family size",
        "Fill out the online application, or apply at the front reception desk",
        "Pay your share of the fee when you register"
      ],
      "documents": [
        "On Ontario Works or ODSP: a current pay stub and Child Tax Benefit showing the children's names",
        "Others: an income tax form or Notice of Assessment, and a current pay stub",
        "Or a pay stub and Child Tax Benefit, or an Employment Insurance stub and Child Tax Benefit"
      ],
      "tips": [
        "Assistance also depends on whether your family already got help this registration period.",
        "The Arnold Anderson Sport Fund is separate. It gives youth up to $350, and the City does not approve it."
      ],
      "phone": "519-759-4150"
    }
  },
  {
    "id": "cornwall-community-bus-pass",
    "name": "Community Bus Pass (Cornwall)",
    "level": "Cornwall",
    "category": "Transit",
    "amount": "Affordable bus pass; 175 passes available",
    "summary": "An affordable Cornwall Transit pass for people who get ODSP or Ontario Works. There are 175 passes, given first come, first served. The pass also works on Specialized Service if you have qualified for it.",
    "note": "You need documents each time you buy a pass. The page does not give the price. Contact Cornwall Transit to ask.",
    "requires": [
      "on",
      "cornwall",
      "cornwallCommunityBusPassRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You get benefits from the Ontario Disability Support Program",
        "You get Ontario Works assistance"
      ]
    },
    "applyText": "Buy a pass at the transit office",
    "applyUrl": "https://www.cornwall.ca/en/public-safety-transportation/transit/fares-and-passes/community-passes/",
    "source": "https://www.cornwall.ca/en/public-safety-transportation/transit/fares-and-passes/community-passes/",
    "detail": {
      "aboutList": {
        "lead": "A lower-cost pass for people on ODSP or Ontario Works.",
        "items": [
          "Qualified Specialized Service users can use it on that service too."
        ]
      },
      "steps": [
        "Go to the Cornwall Transit office at 863 Second St W",
        "Show your photo ID and proof of benefits",
        "Buy the pass"
      ],
      "documents": [
        "Photo ID",
        "An original or photocopied Ontario Works or ODSP cheque stub, or a drug or dental card"
      ],
      "tips": [
        "Bring proof every time you buy a pass."
      ],
      "phone": "613-930-2787"
    }
  },
  {
    "id": "dawson-creek-leisure-access",
    "name": "Leisure Access Program (Dawson Creek)",
    "level": "Dawson Creek",
    "category": "Recreation",
    "amount": "Funding toward drop-in and program fees; amount varies",
    "summary": "Funding for low-income Dawson Creek residents to pay for classes, drop-ins and events. You may get a drop-in punch card or credit toward a registered program. The amount depends on limited yearly funds.",
    "note": "Funding is not guaranteed, and the amount can be small. New applicants are considered before repeat applicants. Applications are considered on the first day of each month.",
    "requires": [
      "bc",
      "dawsonCreek",
      "dawsonCreekLeisureAccessRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a permanent resident living within city boundaries for at least three months",
        "Your family income is at or below the Statistics Canada Low-Income Cut-Off"
      ]
    },
    "applyText": "Get the application form",
    "applyUrl": "https://www.dawsoncreek.ca/parks-recreation/recreation-programs/leisure-access-and-funding-assistance/",
    "source": "https://www.dawsoncreek.ca/parks-recreation/recreation-programs/leisure-access-and-funding-assistance/",
    "detail": {
      "aboutList": {
        "lead": "Help paying for classes, drop-ins and events.",
        "items": [
          "Approved drop-in funding is used with a punch card at the front desk.",
          "For registered programs, you tell staff to use your funding on the fee.",
          "If you are approved for $30 on a $50 class, you pay the other $20."
        ]
      },
      "steps": [
        "Print the individual or group form, or pick one up at the Kenn Borek Aquatic Centre or Culture & Recreation front desk",
        "Fill out the main applicant section",
        "Ask a Trusted Partner to fill out the bottom section",
        "Email the form or drop it off at the aquatic centre or Kin Arena"
      ],
      "documents": [
        "The completed application form",
        "The bottom section completed by a Trusted Partner, verifying income and residency"
      ],
      "tips": [
        "A Trusted Partner is a social service agency, government agency or non-profit you work with.",
        "Applicants are told by mail, up to three weeks after the deadline.",
        "You can apply again, but funding is limited each calendar year."
      ],
      "time": "Up to three weeks after the deadline",
      "phone": "250-784-3604"
    }
  },
  {
    "id": "high-river-community-access-program",
    "name": "Community Access Program (High River)",
    "level": "High River",
    "category": "Recreation",
    "amount": "50% off programs and recreation admissions",
    "summary": "A CAP card gives lower-income High River residents half price on Town programs and on admissions and passes at the Bob Snodgrass Recreation Complex and Cargill Field House. It also gives a free library card and local discounts.",
    "note": "Apply at the Town of High River's FCSS Resource Centre, and renew your card by June 30 every year.",
    "requires": [
      "ab",
      "highRiver",
      "highRiverCommunityAccessProgramRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in High River",
        "Your household income is at or below the limit for your household size"
      ],
      "note": "The limits run from $45,000 for 1 person to $72,500 for 7 people."
    },
    "applyText": "Pick up an application at FCSS",
    "applyUrl": "https://highriver.ca/community/community-support-services/cap",
    "source": "https://highriver.ca/community/community-support-services/cap",
    "detail": {
      "aboutList": {
        "lead": "A card with recreation discounts and local business discounts.",
        "items": [
          "50 per cent off all programs in the Community Program Guide.",
          "50 per cent off admissions and passes at the two recreation facilities.",
          "A free High River library card.",
          "Discounts at some local health, music, thrift and pharmacy businesses."
        ]
      },
      "steps": [
        "Pick up an application at the FCSS Resource Centre, 251 9 Avenue SW",
        "Bring your ID, plus proof of where you live and what you earn",
        "Renew the card by June 30 each year"
      ],
      "documents": [
        "Proof you live in High River, such as ID or utility bills",
        "ID for household members, such as health cards or birth certificates",
        "A current Notice of Assessment, or 3 months of bank statements"
      ],
      "tips": [
        "Pharmacy discounts are for store-front items only, not prescriptions.",
        "Staff are at the Resource Centre Monday to Friday, 9:00am to 4:00pm."
      ],
      "phone": "403-652-8620"
    }
  },
  {
    "id": "langley-leisure-access-grant",
    "name": "Leisure Access Grant (City of Langley)",
    "level": "Langley",
    "category": "Recreation",
    "amount": "25% to 75% off a program or pass",
    "summary": "Low-income City of Langley residents can get a discount on a City program or pass, or an aquatic pass to the indoor pools in the area. If approved, each family member living permanently in the household gets the discount.",
    "note": "Temporary residents, including people on study and work permits, do not qualify. The aquatic pass option is for adults and seniors only. The City replies within three weeks.",
    "requires": [
      "bc",
      "langley",
      "langleyLeisureAccessGrantRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a low-income resident of the City of Langley",
        "You meet the Leisure Access Program income requirements",
        "You are not a temporary resident"
      ],
      "note": "Temporary residents include people on study and work permits."
    },
    "applyText": "Apply for the Leisure Access Grant",
    "applyUrl": "https://langleycity.ca/recreation-culture/recreation/admission-rates-passes-and-financial-assistance",
    "source": "https://langleycity.ca/recreation-culture/recreation/admission-rates-passes-and-financial-assistance",
    "detail": {
      "aboutList": {
        "lead": "The grant lowers the cost of recreation.",
        "items": [
          "The discount is 25% to 75%.",
          "It covers a City of Langley program or pass.",
          "Adults and seniors can choose an aquatic pass instead."
        ]
      },
      "steps": [
        "Complete the Leisure Access Grant application form",
        "Attach the required documents",
        "Submit it at a recreation facility, or email recreation@langleycity.ca",
        "Wait to be contacted"
      ],
      "documents": [
        "Proof of address, such as a recent utility bill in your name",
        "A pay stub from your employer",
        "A Notice of Assessment for all income earners in the family"
      ],
      "tips": [
        "The application cannot be processed without the documents.",
        "The page does not list the income limits. Ask the City about them."
      ],
      "time": "Contact within three weeks of submission",
      "phone": "604.514.2940"
    }
  },
  {
    "id": "morinville-wrap",
    "name": "Wellness and Recreation Access Program (Morinville)",
    "level": "Morinville",
    "category": "Recreation",
    "amount": "Up to $250 per person",
    "summary": "WRAP helps low-income Morinville people and families pay for leisure centre memberships, fitness classes, children's programs, sports and FCSS camps. Qualified applicants can get up to $250 per person.",
    "note": "You must renew every calendar year. The page says household income must meet the Low-Income Cut-Offs chart. Some applicants must also show AISH, Income Support or Seniors Benefits proof.",
    "requires": [
      "ab",
      "morinville",
      "morinvilleWrapRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a resident of the Town of Morinville",
        "Your household income is within the Low-Income Cut-Offs chart for your household size"
      ],
      "note": "Some applicants also give proof of AISH, Income Support or Seniors Benefits, or an FCSS social worker's assessment."
    },
    "applyText": "Apply for WRAP",
    "applyUrl": "https://www.morinville.ca/things-to-do/morinville-leisure-centre/get-energized/wellness-and-recreation-access-program/",
    "source": "https://www.morinville.ca/things-to-do/morinville-leisure-centre/get-energized/wellness-and-recreation-access-program/",
    "detail": {
      "aboutList": {
        "lead": "A subsidy for recreation and FCSS programs.",
        "items": [
          "It covers Morinville Leisure Centre memberships.",
          "It covers Town programs, such as children's sports and adult fitness classes.",
          "It covers FCSS summer, PD day, and fall and spring break camps.",
          "Local agencies with residential support may get Community Care day passes."
        ]
      },
      "steps": [
        "Complete the application form",
        "Contact Morinville FCSS by email or phone",
        "Submit your documents with the application"
      ],
      "documents": [
        "Alberta ID or a utility bill showing a Morinville address",
        "A current tax assessment or the last 90 days of bank statements",
        "If on AISH, Income Support or Alberta Seniors Benefits: proof of receipt"
      ],
      "tips": [
        "The income limit is $29,380 for 1 person and $77,751 for 7 people.",
        "Community Recreation and FCSS programs are in the Community Program Guide."
      ],
      "phone": "780-939-7839"
    }
  },
  {
    "id": "nelson-rdck-leisure-access",
    "name": "Leisure Access Program (RDCK, Nelson)",
    "level": "Nelson",
    "category": "Recreation",
    "amount": "$100 per adult or $150 per child credit a year",
    "summary": "The Regional District of Central Kootenay gives a yearly subsidy credit to people in financial hardship. It gives 50% off adult and 75% off youth admissions and memberships, and 50% off programs. Nelson residents can apply.",
    "note": "Apply with a Notice of Assessment or proof of government assistance. Assistance recipients get a second credit of up to $200 for adults and $300 for youth. The pass expires every May 31.",
    "requires": [
      "bc",
      "nelson",
      "nelsonRdckLeisureAccessRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in the Regional District of Central Kootenay, which includes the City of Nelson",
        "You are 19 or older, or a family applying together",
        "You show proof of residency and one qualifying route"
      ],
      "note": "Routes are listed assistance, income below the Low Income Measure, or a social service letter."
    },
    "applyText": "Open the application form",
    "applyUrl": "https://rdck.jotform.com/260834508820255",
    "source": "https://rdck.jotform.com/260834508820255",
    "detail": {
      "aboutList": {
        "lead": "A subsidy credit used for RDCK recreation.",
        "items": [
          "Admissions and memberships are 50% off for adults and 75% off for youth.",
          "Programs are 50% off the advertised rate.",
          "CHEER events have 100% subsidized admission.",
          "Discounts apply only while you have credit left."
        ]
      },
      "steps": [
        "Complete the online application form",
        "Upload ID or a household bill",
        "Upload your proof of assistance or Notice of Assessment",
        "Wait for approval, then show your card at each purchase"
      ],
      "documents": [
        "ID or a recent household bill showing your name and address",
        "A confirmation letter for the assistance you get, or a Notice of Assessment",
        "Or a letter from a pre-approved social service organization"
      ],
      "tips": [
        "Check your junk folder for the approval email.",
        "The page recommends reapplying at least three weeks before May 31. The 2026 to 2027 form is on the page.",
        "Expired passes get full rates, and fees are not refunded later."
      ],
      "time": "Up to three weeks"
    }
  },
  {
    "id": "port-coquitlam-financial-assistance",
    "name": "Financial Assistance for Recreation (Port Coquitlam)",
    "level": "Port Coquitlam",
    "category": "Recreation",
    "amount": "One City Pass plus a $200 adult or $500 child scholarship",
    "summary": "Approved Port Coquitlam residents get a One City Pass for the calendar year. They can also take a scholarship of $200 per adult or $500 per child or youth. The scholarship gives a 75% discount on registered program fees.",
    "note": "The scholarship cannot be used on programs you already registered for.",
    "requires": [
      "bc",
      "portCoquitlam",
      "portCoquitlamFinancialAssistanceRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Port Coquitlam resident",
        "Your income is within the LICO table, or a Community Partner or adjudicator refers you"
      ],
      "note": "Family means a maximum of 2 adults plus children or dependents in the home."
    },
    "applyText": "Apply online",
    "applyUrl": "https://www.portcoquitlam.ca/node/949",
    "source": "https://www.portcoquitlam.ca/node/949",
    "detail": {
      "aboutList": {
        "lead": "A pass and an optional scholarship for registered programs.",
        "items": [
          "A One City Pass is valid for each approved family member.",
          "The scholarship is $200 per adult and $500 per child or youth aged 0 to 18.",
          "You pay the other 25% of the program fee.",
          "Specialty programs, personal training, rentals and events are not included."
        ]
      },
      "steps": [
        "Fill out the online form, or download the paper form",
        "Provide proof of residency",
        "Provide a Proof of Income Statement or a Community Partner Reference Form",
        "Submit by email, mail or drop-off"
      ],
      "documents": [
        "A bill from the past 90 days showing your name and Port Coquitlam address",
        "A CRA Proof of Income Statement for adults in the family",
        "Or the Community Partner Reference Form"
      ],
      "tips": [
        "A Notice of Assessment, T1 or T4 cannot replace the Proof of Income Statement.",
        "January is busy. Staff reply within 10 to 14 business days.",
        "The income limit is $31,264 or less for 1 person."
      ],
      "time": "10 to 14 business days",
      "phone": "604-927-5371"
    }
  },
  {
    "id": "sarnia-cnib-pass",
    "name": "Annual CNIB Pass (Sarnia Transit)",
    "level": "Sarnia",
    "category": "Transit",
    "amount": "$36 per the fare table ($35.25 per a page note); regular annual pass is $1,065",
    "summary": "A discounted annual Sarnia Transit bus pass for riders with a valid CNIB card. The 2026 fare table says $36 but a note on the page says $35.25. Passes are sold at City Hall, Customer Service Department.",
    "note": "A note on the page lists the price as $35.25, while the fare table says $36. Ask Customer Service to confirm. Refunds are not available for transit passes.",
    "requires": [
      "on",
      "sarnia",
      "sarniaCnibPassRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a rider with a valid CNIB card"
      ]
    },
    "applyText": "Contact Customer Service for the pass",
    "applyUrl": "https://www.sarnia.ca/living-here/getting-around/sarnia-transit/transit-fares/",
    "source": "https://www.sarnia.ca/living-here/getting-around/sarnia-transit/transit-fares/",
    "detail": {
      "aboutList": {
        "lead": "A low-cost yearly bus pass for CNIB cardholders.",
        "items": [
          "It is a full year pass, against $1,065 for the regular annual pass.",
          "Children 12 and under already ride free."
        ]
      },
      "steps": [
        "Contact Customer Service about the CNIB pass",
        "Bring your valid CNIB card to City Hall, 255 Christina Street North",
        "Buy the pass"
      ],
      "documents": [
        "A valid CNIB card"
      ],
      "tips": [
        "Smartcard replacement costs $7.15."
      ],
      "phone": "519-332-0330 ext. 3131"
    }
  },
  {
    "id": "taber-fee-assistance",
    "name": "Fee Assistance Program (Taber)",
    "level": "Taber",
    "category": "Recreation",
    "amount": "50% off recreation programs and Aquafun Centre fees",
    "summary": "A 50% discount on Community Centre drop-in programs and summer kids day camps. It also gives 50% off Aquafun Centre membership, drop-ins and lessons. Some restrictions apply.",
    "note": "It is for residents of the Town of Taber and the Municipal District of Taber who are below the income thresholds. The card lasts one year, and you can reapply through FCSS.",
    "requires": [
      "ab",
      "taber",
      "taberFeeAssistanceRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in the Town of Taber or the Municipal District of Taber",
        "Your income is below the low-income thresholds",
        "FCSS confirms you are eligible"
      ],
      "note": "The page sends you to the Fee Assistance Procedure for the thresholds."
    },
    "applyText": "Apply through FCSS",
    "applyUrl": "https://www.taber.ca/town-services/recreation/fee-assistance",
    "source": "https://www.taber.ca/town-services/recreation/fee-assistance",
    "detail": {
      "aboutList": {
        "lead": "Half price on many Town recreation fees.",
        "items": [
          "50% off Community Centre drop-in programming and summer kids day camps.",
          "50% off Aquafun Centre membership and drop-ins.",
          "50% off lessons and courses, with some restrictions."
        ]
      },
      "steps": [
        "Fill out the application form and apply through FCSS",
        "If eligible, get a referral letter from FCSS",
        "Bring the letter to the Aquafun Centre reception desk",
        "Staff issue each family member a fee assistance card"
      ],
      "documents": [
        "The application form",
        "The FCSS referral letter"
      ],
      "tips": [
        "Staff try to keep your use of the program confidential.",
        "KidSport and Jumpstart are other programs listed on the page."
      ],
      "time": "Card valid one year from referral"
    }
  },
  {
    "id": "west-vancouver-recreation-financial-assistance",
    "name": "Recreation Financial Assistance Program (West Vancouver)",
    "level": "West Vancouver",
    "category": "Recreation",
    "amount": "50% off FitPasses and activities; some memberships free",
    "summary": "West Vancouver residents with low income and no significant savings or assets can get 50% off FitPasses and activities. Enhance West Van and Seniors' Activity Centre memberships are 100% subsidized.",
    "note": "FitPass subsidy is up to $362 per subsidy year, and activities up to $400. Birthday parties, personal training, private lessons and events are not eligible; other exclusions may apply. Review can take two to six weeks.",
    "requires": [
      "bc",
      "westVancouver",
      "westVancouverRecreationFinancialAssistanceRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a West Vancouver resident, with proof for all family members",
        "You are low income without significant savings or assets"
      ],
      "note": "Details are in the Qualifying for Financial Assistance handout."
    },
    "applyText": "Apply for RFAP",
    "applyUrl": "https://westvancouver.ca/parks-recreation/recreation-programs-services/financial-assistance-support",
    "source": "https://westvancouver.ca/parks-recreation/recreation-programs-services/financial-assistance-support",
    "detail": {
      "aboutList": {
        "lead": "A subsidy on community centre recreation.",
        "items": [
          "50% off FitPasses, up to a maximum per subsidy year.",
          "50% off activities, up to a maximum per subsidy year."
        ]
      },
      "steps": [
        "Read the information handout to confirm eligibility",
        "Create a recreation account at activewestvanrec",
        "Complete and sign the RFAP application form",
        "Drop off the sealed package at the West Vancouver Community Centre front desk",
        "Register for an RFAP interview at drop-off"
      ],
      "documents": [
        "The signed and dated application form",
        "Supporting documents listed in the handout, including recent tax information",
        "Copies of EI documents, if you received EI"
      ],
      "tips": [
        "Interview registration is not available online.",
        "Do not email supporting documents.",
        "Documents not collected within six weeks of your interview are shredded."
      ],
      "time": "Two to six weeks to review",
      "phone": "604-925-7279"
    }
  },
  {
    "id": "on-child-benefit",
    "name": "Ontario Child Benefit",
    "level": "Ontario",
    "category": "Money (for parents)",
    "amount": "Up to $1,760 per child each year",
    "summary": "A monthly payment for low-income to moderate-income families to help with the cost of raising children. The Canada Revenue Agency sets the amount for each family.",
    "note": "There is no separate application. The Canada Child Benefit application also assesses you, and you must file taxes each year.",
    "requires": [
      "on",
      "onChildBenefitRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a low-income to moderate-income family with children in your care.",
        "You apply for the Canada Child Benefit through the Canada Revenue Agency.",
        "You file your taxes every year, even if you have no income to declare."
      ],
      "note": "The amount depends on your family net income and the number of children under 18 in your care."
    },
    "applyText": "Apply for the Canada Child Benefit",
    "applyUrl": "https://www.ontario.ca/page/ontario-child-benefit",
    "source": "https://www.ontario.ca/page/ontario-child-benefit",
    "detail": {
      "aboutList": {
        "lead": "The Ontario Child Benefit helps families with the cost of raising children, including a child with a disability.",
        "items": [
          "Pays up to $1,760 per child per year, in monthly payments, if you are eligible.",
          "The amount depends on your adjusted family net income on your annual tax return.",
          "The number of children in your care who are under 18 also affects the amount.",
          "The Canada Revenue Agency runs the benefit for Ontario."
        ]
      },
      "steps": [
        "Send in your Canada Child Benefit application.",
        "Every year, file your taxes, even with nothing to declare.",
        "Wait for the Canada Revenue Agency to assess you for the Ontario Child Benefit and set your monthly payment."
      ],
      "documents": [
        "Your income tax return each year"
      ],
      "tips": [
        "Use the Canada Revenue Agency benefit calculator to see how much you may receive.",
        "If you need help with your taxes, the page points to free tax help and free tax clinics."
      ],
      "phone": "1-800-387-1193"
    }
  },
  {
    "id": "on-dso-adult-services",
    "name": "Developmental Services Ontario adult services",
    "level": "Ontario",
    "category": "Daily living supports",
    "amount": "Services and supports, based on your assessed needs",
    "summary": "Developmental Services Ontario (DSO) is the way in to provincially funded services for adults with a developmental disability. Staff help you apply, assess your needs and connect you with available supports.",
    "note": "Going through the application does not guarantee that you will receive services right away. Your risk-based priority is compared with everyone else waiting.",
    "requires": [
      "on",
      "age18plus",
      "developmental",
      "onDsoAdultServicesRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have a developmental disability, confirmed by a registered psychologist or psychological associate.",
        "You are at least 18 years old.",
        "You live in Ontario."
      ],
      "note": "These general rules come from the 2008 Act on social inclusion of people with developmental disabilities."
    },
    "applyText": "Contact Developmental Services Ontario",
    "applyUrl": "https://www.ontario.ca/page/programs-and-services-adults-developmental-disabilities-ontario",
    "source": "https://www.ontario.ca/page/programs-and-services-adults-developmental-disabilities-ontario",
    "detail": {
      "aboutList": {
        "lead": "This page explains the services and supports for adults with a developmental disability and their families.",
        "items": [
          "Helps you live, work and take part in your community.",
          "Includes Passport funding, specialized clinical supports and Adult Protective Service Worker help.",
          "Includes residential supports such as group living, supported independent living and the Host Family Program.",
          "You can use part of your Passport funding for person-directed planning."
        ]
      },
      "steps": [
        "Contact your local Developmental Services Ontario office to apply.",
        "Meet with a DSO assessor for the application for developmental services and supports (ADSS).",
        "Meet again for the Supports Intensity Scale for adults (SIS-A), which measures the supports you need.",
        "Staff use a province-wide tool to score your level of risk and set your priority for services."
      ],
      "documents": [
        "Confirmation of your developmental disability from a registered psychologist or psychological associate"
      ],
      "tips": [
        "Each of the two meetings may take a couple of hours.",
        "Family caregivers can share their needs in the application.",
        "Private providers are not government-funded; check what they offer and charge before you choose."
      ]
    }
  },
  {
    "id": "on-enhanced-respite",
    "name": "Enhanced Respite for medically fragile children",
    "level": "Ontario",
    "category": "Home support",
    "amount": "Up to $4,213 per child each fiscal year",
    "summary": "Pays families back for respite care for a child under 18 who is medically fragile or technology dependent and needs care 24 hours a day. You claim the cost of covered respite services or supports.",
    "note": "The services and supports covered are the same as those covered by the Special Services at Home program.",
    "requires": [
      "on",
      "child",
      "onEnhancedRespiteRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "Your child is under 18 years of age.",
        "Your child lives at home.",
        "Your child needs intensive care and constant monitoring on a 24-hour basis.",
        "Your child is medically fragile or technology dependent, in one of the listed ways."
      ],
      "note": "Listed ways include a ventilator, dialysis, IV drugs, tracheotomy care, suctioning, oxygen or tube feeding."
    },
    "applyText": "Contact your ministry regional office",
    "applyUrl": "https://www.ontario.ca/page/family-support-and-respite-children-and-youth-special-needs",
    "source": "https://www.ontario.ca/page/family-support-and-respite-children-and-youth-special-needs",
    "detail": {
      "aboutList": {
        "lead": "Enhanced Respite gives families a break from round-the-clock care of a medically fragile child.",
        "items": [
          "Gives back the cost of covered respite when you make a claim.",
          "Respite can be in your home or outside your home, from local agencies.",
          "Funding is for families caring for a child who depends on medical or technological equipment.",
          "Extra funding was added on July 1, 2022 to support personal support worker wages."
        ]
      },
      "steps": [
        "Contact the ministry regional office nearest to you to apply.",
        "Arrange respite care with a local agency in or outside your home.",
        "Make a claim to get the cost of covered respite back."
      ],
      "documents": [],
      "tips": [
        "Ask the regional office which respite supports are covered before you pay.",
        "The same page also covers Special Services at Home, and Assistance for Children with Severe Disabilities."
      ]
    }
  },
  {
    "id": "on-gains",
    "name": "Guaranteed Annual Income System (GAINS)",
    "level": "Ontario",
    "category": "Income support",
    "amount": "Up to $92 a month for the 2026 benefit year (July 1, 2026 to June 30, 2027)",
    "summary": "A monthly, non-taxable payment for Ontario seniors with low income. It is paid on top of any federal OAS and GIS payments you may get.",
    "note": "If you had no private income in 2025, you get the maximum amount. Different income limits apply if your spouse is under 65 or cannot get Old Age Security.",
    "requires": [
      "on",
      "age65plus",
      "onGainsRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are 65 years or older.",
        "You have been a Canadian resident for 10 years or more.",
        "You have lived in Ontario for 12 months, or for 20 years in total since age 18.",
        "You receive the federal Old Age Security (OAS) pension and Guaranteed Income Supplement (GIS).",
        "Your private income is up to $4,416 (single) or $8,832 (couple)."
      ],
      "note": "Private income can include a workplace pension, the Canada Pension Plan and bank interest."
    },
    "applyText": "File your tax return or complete a GIS application",
    "applyUrl": "https://www.ontario.ca/page/guaranteed-annual-income-system-payments-seniors",
    "source": "https://www.ontario.ca/page/guaranteed-annual-income-system-payments-seniors",
    "detail": {
      "aboutList": {
        "lead": "GAINS tops up the income of low-income seniors in Ontario.",
        "items": [
          "Paid about the 25th of each month, from July to June.",
          "Your payment can change during the year if your private income or marital status changes.",
          "The benefit year runs from July 1 to June 30 of the next year.",
          "Tables on the page show your amount by age and marital status."
        ]
      },
      "steps": [
        "If you already get Old Age Security and the Guaranteed Income Supplement, you do not have to apply.",
        "File your income tax return every year by April 30, even with no income to report.",
        "Or complete a Guaranteed Income Supplement application and send it to your nearest Service Canada office.",
        "Sign up for direct deposit through Service Canada."
      ],
      "documents": [
        "Your income tax and benefit return"
      ],
      "tips": [
        "If you disagree with a decision, contact the Ontario Ministry of Finance.",
        "You can file a Notice of Objection within 90 days of the written decision being mailed."
      ],
      "phone": "1-800-277-9914"
    }
  },
  {
    "id": "on-healthy-smiles",
    "name": "Healthy Smiles Ontario",
    "level": "Ontario",
    "category": "Health (for children)",
    "amount": "Free preventive, routine and emergency dental care for children 17 and under",
    "summary": "A government-funded dental program for children and youth 17 and under from low-income households. It pays for preventive, routine and emergency dental services.",
    "note": "Cosmetic dentistry such as teeth whitening and braces is not covered. Your child may still qualify if they already have dental insurance.",
    "requires": [
      "on",
      "child",
      "onHealthySmilesRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "Your child gets Temporary Care Assistance or Assistance for Children with Severe Disabilities.",
        "You or your family get Ontario Works or the Ontario Disability Support Program.",
        "Your child is 17 or under, lives in Ontario, and your family net income is at or under the table limit."
      ],
      "note": "As of July 1, 2026 the limit is $29,065 for 1 child, $31,265 for 2 children and $33,465 for 3 children."
    },
    "applyText": "Enrol in Healthy Smiles Ontario",
    "applyUrl": "https://www.ontario.ca/page/get-dental-care",
    "source": "https://www.ontario.ca/page/get-dental-care",
    "detail": {
      "aboutList": {
        "lead": "Healthy Smiles Ontario pays for dental care for eligible children and youth.",
        "items": [
          "Covers check-ups, cleaning, fillings, x-rays, scaling and tooth extraction.",
          "Covers urgent or emergency care, including a toothache.",
          "Covers a child for up to one benefit year (August 1 to July 31) or until their 18th birthday.",
          "Children in kindergarten and Grade 2 at public elementary schools can get free dental screening."
        ]
      },
      "steps": [
        "Check whether your child is enrolled automatically.",
        "If not, apply online or by mail with the General Application Form.",
        "Wait for the dental card to arrive by mail.",
        "Show the card to your dental provider at each visit."
      ],
      "documents": [
        "Your child's date of birth",
        "A valid Ontario address",
        "Your Social Insurance Number or Temporary Taxation Number",
        "Proof you filed taxes in the previous year (or a guarantor form if you did not file)"
      ],
      "tips": [
        "Ask your dentist if they take Healthy Smiles Ontario; your local public health unit can help find one.",
        "Emergency or essential care lasts 6 months and a child can use it a maximum of 3 times in their lifetime.",
        "Families on Ontario Works in a First Nations community are not enrolled automatically and must apply by mail."
      ],
      "phone": "1-844-296-6306"
    }
  },
  {
    "id": "on-ontario-works",
    "name": "Ontario Works",
    "level": "Ontario",
    "category": "Income support",
    "amount": "Up to $733 a month for basic needs and shelter if you are single",
    "summary": "Money for living costs such as food and rent, plus health benefits, for people in financial need. In most cases you take part in employment-related activities to get the money.",
    "note": "The Canada Disability Benefit is exempt as income and does not affect your Ontario Works eligibility or payment. You may get more for family members or other benefits.",
    "requires": [
      "on",
      "onOntarioWorksRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You need financial assistance for food and housing.",
        "You are in financial need."
      ],
      "note": "A worker checks your income and assets; if found not eligible, you have 30 days to ask for a review."
    },
    "applyText": "Apply for Ontario Works",
    "applyUrl": "https://www.ontario.ca/page/ontario-works",
    "source": "https://www.ontario.ca/page/ontario-works",
    "detail": {
      "aboutList": {
        "lead": "Ontario Works helps people in financial need with living costs.",
        "items": [
          "Pays money toward living expenses, including food and rent.",
          "Includes health benefits for you and your eligible family members.",
          "You may get more if you have a spouse or child.",
          "You may get extra money, for example for transport to medical appointments."
        ]
      },
      "steps": [
        "Apply online (20 to 30 minutes), by phone, or at your local Ontario Works office.",
        "An intake worker reviews your application and may ask for more documents.",
        "You are told within four business days if you are approved and how much you may receive.",
        "Your Ontario Works office schedules an appointment to make a plan for employment-related activities."
      ],
      "documents": [
        "Social insurance numbers, if applicable",
        "OHIP cards",
        "Birth certificates",
        "Immigration papers",
        "Tax returns",
        "Banking information and bank statements",
        "Proof of income, shelter costs and Ontario residency"
      ],
      "tips": [
        "One application covers you and the immediate family who live with you.",
        "All family members on the application should be with you when you start, so they can consent.",
        "A plan for work activities may be waived for reasons such as an illness or caregiving responsibilities.",
        "If you have a disability, one application can be used for Ontario Works or the Ontario Disability Support Program."
      ],
      "phone": "1-888-999-1142"
    }
  },
  {
    "id": "on-seniors-dental",
    "name": "Ontario Seniors Dental Care Program",
    "level": "Ontario",
    "category": "Health",
    "amount": "Free routine dental care",
    "summary": "Free, routine dental care for low-income Ontario seniors 65 or older. It covers check-ups, fillings, x-rays, tooth removal and treatment for infection, pain and gum disease.",
    "note": "Coverage ends on July 31 every year. Dentures are partially covered; some procedures have limits. You may still qualify if you also qualify for the Canadian Dental Care Plan.",
    "requires": [
      "on",
      "age65plus",
      "onSeniorsDentalRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are 65 years of age or older.",
        "You live in Ontario.",
        "Your annual net income is $25,480 or less (single), or $42,290 or less (couple, combined).",
        "You have no other dental benefits, apart from the Canadian Dental Care Plan."
      ],
      "note": "Other benefits include private insurance, Ontario Works and the Ontario Disability Support Program."
    },
    "applyText": "Apply to the Ontario Seniors Dental Care Program",
    "applyUrl": "https://www.ontario.ca/page/dental-care-seniors",
    "source": "https://www.ontario.ca/page/dental-care-seniors",
    "detail": {
      "aboutList": {
        "lead": "The program pays for routine dental care for low-income seniors.",
        "items": [
          "Covers check-ups, scaling, fluoride and polishing.",
          "Covers repairing broken teeth and cavities, and x-rays.",
          "Covers removing teeth or abnormal tissue, with anesthesia.",
          "Covers treating infection, pain and gum conditions."
        ]
      },
      "steps": [
        "Apply online or by mail.",
        "If you and your spouse both apply, send two separate applications.",
        "Wait for the welcome package and dental card by mail.",
        "Show your card at each dental visit."
      ],
      "documents": [
        "Your date of birth",
        "A valid Ontario address",
        "Your Social Insurance Number or Temporary Taxation Number",
        "Proof you filed taxes last year (or a guarantor form if you did not file)"
      ],
      "tips": [
        "Your local public health unit can help you apply and find where to get care.",
        "Care is available through public health units and partner community health centres.",
        "Most clients are re-checked automatically each year; you are told by mail if you must re-apply."
      ],
      "phone": "1-833-207-4435"
    }
  },
  {
    "id": "on-trillium-benefit",
    "name": "Ontario Trillium Benefit",
    "level": "Ontario",
    "category": "Money & taxes",
    "amount": "For the 2026 benefit year: up to $1,307 (age 18 to 64) or $1,488 (65 or older) from the energy and property tax credit, plus other credits",
    "summary": "A tax-free payment that helps low-to-moderate income Ontario residents pay for energy costs, sales tax and property tax. It combines three credits, and you need to be eligible for at least one.",
    "note": "You apply by filing your tax return and the ON-BEN form, even with no income. The Canada Revenue Agency decides if you are eligible. The last day to file is April 30.",
    "requires": [
      "on",
      "onTrilliumBenefitRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "Northern Ontario Energy Credit: you lived in Northern Ontario on December 31, 2025.",
        "Ontario Energy and Property Tax Credit: you lived in Ontario on December 31, 2025.",
        "Ontario Sales Tax Credit: you are an Ontario resident, 19 or older, or have a partner or child."
      ],
      "note": "Each credit also has conditions, such as age, family status, and rent or property tax paid in 2025."
    },
    "applyText": "File your tax return with the ON-BEN form",
    "applyUrl": "https://www.ontario.ca/page/ontario-trillium-benefit",
    "source": "https://www.ontario.ca/page/ontario-trillium-benefit",
    "detail": {
      "aboutList": {
        "lead": "The three credits are paid together for the 2026 benefit year (July 2026 to June 2027).",
        "items": [
          "Northern Ontario Energy Credit: up to $189 if single, up to $290 for families.",
          "Energy and Property Tax Credit: up to $290 if you live on a reserve or in a public long-term care home.",
          "Sales Tax Credit: up to $378, plus up to $378 for a spouse and each dependent child under 19.",
          "Amounts depend on your age, income, residence, family size and rent or property tax."
        ]
      },
      "steps": [
        "File your income tax and benefit return every year.",
        "Fill out and enclose the ON-BEN application form from your tax package.",
        "The Canada Revenue Agency tells you if you are entitled to the credits.",
        "Choose how you want to be paid if you qualify for more than $500."
      ],
      "documents": [
        "Your income tax return",
        "Form ON-BEN"
      ],
      "tips": [
        "If you are turning 18 before June 2027, file your tax return to be considered.",
        "If you cannot prepare your return yourself, the Community Volunteer Income Tax Program may help.",
        "If you file late, you still receive the benefit, but your payments may be delayed.",
        "Beware of text messages claiming you are owed a payment; the Government of Ontario will not send them."
      ]
    }
  },
  {
    "id": "on-drug-benefit",
    "name": "Ontario Drug Benefit",
    "level": "Ontario",
    "category": "Health",
    "amount": "Covers most of the cost of more than 5,900 listed drugs; what you pay (deductible and/or co-payment of up to $2 or $6.11 a prescription) depends on how you qualify",
    "summary": "Covers most of the cost of prescription drugs on the Ontario Drug Benefit Formulary. You can qualify at 65, or sooner through social assistance, home care and other routes.",
    "note": "Prescriptions must be filled in an Ontario pharmacy, and you may need to show your Ontario health card. Some drugs are Limited Use or covered only through the Exceptional Access Program.",
    "requires": [
      "on",
      "onDrugBenefitRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You are 65 or older (you join automatically the month after you turn 65).",
        "You get benefits from Ontario Works or the Ontario Disability Support Program.",
        "You get professional home and community care services.",
        "You live in a long-term care home or a Community Home for Opportunity.",
        "You are 24 or younger and not covered by private insurance.",
        "You are enrolled in the Trillium Drug Program."
      ],
      "note": "Some groups also need an Ontario health card number."
    },
    "applyText": "Learn how to get Ontario Drug Benefit coverage",
    "applyUrl": "https://www.ontario.ca/page/get-coverage-prescription-drugs",
    "source": "https://www.ontario.ca/page/get-coverage-prescription-drugs",
    "detail": {
      "aboutList": {
        "lead": "The program pays most of the cost of listed prescription drugs.",
        "items": [
          "Covers more than 5,900 drugs on the Formulary and almost 1,500 more through the Exceptional Access Program.",
          "Seniors pay the first $100 each program year, then a small co-payment per prescription.",
          "Seniors in the Seniors Co-Payment Program pay no deductible and up to $2 a prescription.",
          "Ontario Works and ODSP recipients pay up to $2 for each drug, with no deductible."
        ]
      },
      "steps": [
        "If you are turning 65, watch for the letter about 3 months before your birthday.",
        "Go to your pharmacy on the first day of the month after you turn 65.",
        "If you qualify another way, ask your caseworker, care coordinator or pharmacist how it works.",
        "If you paid for a covered drug, submit your receipts online or by mail for a refund."
      ],
      "documents": [
        "Ontario health card",
        "Official prescription receipt signed by a pharmacist (for refunds)"
      ],
      "tips": [
        "After the first $100, seniors pay up to $6.11 per prescription.",
        "The first-year deductible for seniors can be lower than $100, depending on your birth month.",
        "If you are 24 or younger and in some groups, you do not pay the $2.",
        "The program also covers allergy shots, epinephrine injectors, some diabetes testing strips and some nutrition products."
      ]
    }
  },
  {
    "id": "on-home-community-care",
    "name": "Home and community care (Ontario Health atHome)",
    "level": "Ontario",
    "category": "Home support",
    "amount": "Government pays for home care if you qualify; community support services may have a co-payment",
    "summary": "Care at home for people of all ages who need it, including seniors and people with disabilities. It also covers respite so a caregiver can take a break. Ontario Health atHome decides what you are eligible for.",
    "note": "If you qualify, the Ontario government pays for home care. Community support services can have a client co-payment. Respite at home is fully covered if you qualify, otherwise other providers charge a fee.",
    "requires": [
      "on",
      "onHomeCommunityCareRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You need care at home, at school or in the community.",
        "Ontario Health atHome assesses that you are eligible for the services.",
        "You have a valid Ontario health card (for respite at home).",
        "Your home is properly equipped for the services you need (for respite at home)."
      ],
      "note": "Homemaking needs personal support, or constant supervision due to cognitive impairment or acquired brain injury."
    },
    "applyText": "Call Ontario Health atHome",
    "applyUrl": "https://www.ontario.ca/page/homecare-seniors",
    "source": "https://www.ontario.ca/page/homecare-seniors",
    "detail": {
      "aboutList": {
        "lead": "Ontario Health atHome provides home care and links you to community support services.",
        "items": [
          "Nursing, physiotherapy, occupational therapy, speech-language pathology, social work and healthy eating help.",
          "Personal support such as bathing, dressing, eating and toileting.",
          "Homemaking such as cleaning, laundry, shopping and meal planning.",
          "Respite care at home, in a long-term care home for a short stay, or at an adult day program."
        ]
      },
      "steps": [
        "Call Ontario Health atHome or use their map to find care near you.",
        "A case manager or care coordinator assesses your needs and eligibility, and may visit your home.",
        "If you are eligible, you and anyone you choose make a home care plan.",
        "Your care is scheduled with Ontario Health atHome or a service provider."
      ],
      "documents": [
        "Ontario health card"
      ],
      "tips": [
        "A short respite stay in long-term care can be up to 60 days, and no more than 90 days in a calendar year.",
        "Adult day programs need a referral from Ontario Health atHome and usually charge a fee per day.",
        "If you are refused, you can complain to Ontario Health atHome or appeal to the Health Services Appeal and Review Board."
      ],
      "phone": "1-833-515-1234"
    }
  },
  {
    "id": "on-northern-health-travel-grant",
    "name": "Northern Health Travel Grant",
    "level": "Ontario",
    "category": "Health",
    "amount": "41 cents per km (round trip) plus $175 to $1,150 for lodging (service dates on or after December 1, 2024)",
    "summary": "Helps Northern Ontario residents pay part of the cost of travelling at least 100 km one way for specialist care. It does not cover all travel costs, such as meals or taxis.",
    "note": "Send your application to the Ministry of Health within 12 months of the treatment date. You need a separate application for each round trip, and original receipts for lodging and tickets.",
    "requires": [
      "on",
      "onNorthernHealthTravelGrantRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are an OHIP-insured Ontario resident on the date of treatment.",
        "Your home is in a listed Northern Ontario district.",
        "You are referred for specialist care or a procedure at a ministry-funded health-care facility.",
        "You travelled at least 100 km one way to the nearest specialist or facility that could help."
      ],
      "note": "Algoma, Cochrane, Kenora, Manitoulin, Nipissing, Parry Sound, Rainy River, Sudbury, Thunder Bay, Timiskaming."
    },
    "applyText": "Apply online for the Northern Health Travel Grant",
    "applyUrl": "https://www.ontario.ca/page/northern-health-travel-grant-program",
    "source": "https://www.ontario.ca/page/northern-health-travel-grant-program",
    "detail": {
      "aboutList": {
        "lead": "The grant pays part of the cost of long trips for specialist medical care.",
        "items": [
          "Pays 41 cents per km, based on the round-trip distance, for car, air, bus or rail.",
          "Pays a lodging allowance of $175 to $1,150 for medically necessary nights, if you paid for official lodging.",
          "A companion of a hospitalized patient can get a lodging allowance if aged 16 or older and meeting the conditions.",
          "Not covered: care linked to a WSIB claim, or travel paid by another program or employer."
        ]
      },
      "steps": [
        "Check that you meet the rules and that the care is not available closer.",
        "Ask the specialist or facility to complete their part of the form.",
        "Apply online, or by mail with the paper form.",
        "Include original receipts for lodging and for air, bus or rail tickets."
      ],
      "documents": [
        "Original itemized lodging receipts with the patient name, dates and fee",
        "Original tickets, receipts or itinerary for air, bus or rail",
        "Specialty-Service Provider Form (online application)"
      ],
      "tips": [
        "Telemedicine may let you see a specialist without travelling; ask your provider.",
        "Do not send meal or taxi receipts.",
        "Do not photograph documents for the online form; scan them to PDF, because photos are often too large.",
        "If patients share one car, only one grant is paid for the round trip."
      ]
    }
  },
  {
    "id": "on-odsp-employment-supports",
    "name": "ODSP employment supports and earnings rules",
    "level": "Ontario",
    "category": "Employment",
    "amount": "Earn up to $1,000 a month without losing ODSP income support; Work-Related Benefit up to $100 per family member",
    "summary": "If you get Ontario Disability Support Program (ODSP) income support, you can work and keep your support and benefits. Extra benefits help with child care and start-up costs for a job, training or a business.",
    "note": "You must report all earnings every month, even if they are exempt. If you miss a reporting deadline, your payments and benefits may stop temporarily.",
    "requires": [
      "on",
      "onOdspEmploymentSupportsRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You get ODSP income support.",
        "You want to work, train or start your own business."
      ],
      "note": "Family members can qualify for some benefits, with different age and schooling rules for each benefit."
    },
    "applyText": "Contact your ODSP caseworker",
    "applyUrl": "https://www.ontario.ca/page/working-and-earning-ontario-disability-support-program",
    "source": "https://www.ontario.ca/page/working-and-earning-ontario-disability-support-program",
    "detail": {
      "aboutList": {
        "lead": "ODSP lets you earn money while keeping your income support.",
        "items": [
          "Since February 1, 2023: up to $1,000 a month in net earnings with no reduction.",
          "After the first $1,000, 25% of net earnings is also exempt.",
          "The Work-Related Benefit gives up to $100 for each eligible family member who earns money.",
          "The Employment and Training Start Up Benefit gives up to $500 in a 12-month period.",
          "Up-front child care: the full cost of licensed care, or up to $600 per child in 12 months if unlicensed."
        ]
      },
      "steps": [
        "Tell your caseworker about the money you and your family earn.",
        "Report your earnings each month through MyBenefits, the phone system, or the Employment/Training Income Report form.",
        "Return the report by the seventh day of the following month.",
        "Contact your caseworker to ask for the child care or start-up benefits, and send proof."
      ],
      "documents": [
        "Pay stubs",
        "Business income and expense records, if self-employed",
        "Letter of employment or training registration",
        "Proof you need to pay for child care in advance"
      ],
      "tips": [
        "Report both gross and net pay.",
        "If you earn nothing that month, put $0 on the form and still send it in.",
        "If you stop working, tell your caseworker right away.",
        "You do not need proof of employment costs to get the Work-Related Benefit; it is added automatically."
      ]
    }
  },
  {
    "id": "on-odsp-health-benefits",
    "name": "ODSP health and disability benefits (including Special Diet Allowance)",
    "level": "Ontario",
    "category": "Health",
    "amount": "Varies by benefit; Special Diet Allowance up to $250 a month per person; Guide Dog Benefit $84 a month per dog",
    "summary": "Health and disability benefits for people who get Ontario Disability Support Program (ODSP) income support, and their families. They help with drugs, dental, vision, assistive devices, medical travel and special diets.",
    "note": "Many benefits need approval from your ODSP office or an approved health professional before you buy. Ask first so you are not left paying the cost yourself.",
    "requires": [
      "on",
      "onOdspHealthBenefitsRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You get ODSP income support.",
        "For some benefits, an approved health professional must complete a form.",
        "For the Special Diet Allowance, you or a family member has a listed medical condition."
      ],
      "note": "People who leave ODSP may get the Extended or Transitional Health Benefit, with their own rules."
    },
    "applyText": "Contact your local ODSP office",
    "applyUrl": "https://www.ontario.ca/page/ontario-disability-support-program-health-and-disability-benefits",
    "source": "https://www.ontario.ca/page/ontario-disability-support-program-health-and-disability-benefits",
    "detail": {
      "aboutList": {
        "lead": "The benefits cover many costs linked to a disability or medical condition.",
        "items": [
          "Prescription drugs on the Formulary, with a co-payment of up to $2 per prescription if you are 25 or older.",
          "Basic dental for you and your spouse; children under 18 get Healthy Smiles Ontario.",
          "Eye exams once every two years and eyeglasses once every three years, if OHIP does not cover them.",
          "Medical transportation, if you spend $15 or more a month, and medically necessary supplies.",
          "Help with hearing aids, mobility device repairs and costs the Assistive Devices Program does not cover.",
          "Special Diet Allowance: up to $250 a month for each member with an approved medical condition.",
          "Pregnancy and Breastfeeding Nutritional Allowance of $40 or $50 a month, until the baby is 12 months old."
        ]
      },
      "steps": [
        "Contact your local ODSP office and ask your caseworker for the form you need.",
        "Take the form to an approved health care professional to fill in.",
        "Return the form to your ODSP office in person or by mail.",
        "Wait for a letter saying whether the expense is approved."
      ],
      "documents": [
        "ODSP monthly statement or government photo ID",
        "Ontario health card",
        "Application for Special Diet Allowance (the original form)",
        "Receipts for health costs, for the Extended Health Benefit"
      ],
      "tips": [
        "You do not pay a fee to have the forms filled out.",
        "Only the original Special Diet Allowance form is accepted, not a photocopy.",
        "Residents of institutions are not eligible for the Special Diet Allowance.",
        "If you disagree with a decision, ask for an internal review."
      ],
      "phone": "1-888-789-4199"
    }
  },
  {
    "id": "on-oesp",
    "name": "Ontario Electricity Support Program (OESP)",
    "level": "Ontario",
    "category": "Home",
    "amount": "$35 to $75 a month on your bill; $52 to $113 for some households",
    "summary": "A monthly credit on your electricity bill for lower-income households. The amount depends on how many people live in the home and your combined after-tax household income.",
    "note": "Households using certain electricity-intensive medical devices may get a higher credit, between $52 and $113 a month. People on Ontario Works or ODSP qualify automatically and apply through their caseworker.",
    "requires": [
      "on",
      "onOespRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are the customer of an electricity utility, or a unit sub-meter provider bills you for your own meter.",
        "Your household size and combined after-tax income are within the program's levels."
      ],
      "note": "Ontario Works and ODSP recipients automatically qualify and must contact their caseworker to apply."
    },
    "applyText": "Apply for OESP",
    "applyUrl": "https://ontarioelectricitysupport.ca/",
    "source": "https://www.oeb.ca/consumer-information-and-protection/bill-assistance-programs/ontario-electricity-support-program",
    "detail": {
      "aboutList": {
        "lead": "The OESP puts an ongoing monthly credit directly on your electricity bill.",
        "items": [
          "For example, a 4-person home with $65,000 a year after tax gets a $40 credit each month.",
          "The credit chart covers household after-tax amounts up to $71,000 a year.",
          "Higher credits apply for Indigenous households, electric heating, or certain medical devices.",
          "Credits last 2 years before you reapply, or 5 years if you are 65+ or get a CPP disability pension."
        ]
      },
      "steps": [
        "Gather your electricity bill, the names and birthdates of everyone in your home, and SINs for adults",
        "Apply online at OESP.ca, by mail, or with help from a free intake agency",
        "Sign the consent form that lets the CRA verify your household income for the program",
        "Wait about 4 to 6 weeks for a decision; the credit appears on your bill about 6 to 8 weeks after approval"
      ],
      "documents": [
        "Your electricity bill",
        "Names and birthdates of everyone living in your home, as registered with the CRA",
        "Social Insurance Numbers or temporary tax numbers for household members 18 and older"
      ],
      "tips": [
        "If you have not filed a tax return recently, or your situation changed, apply through an intake agency and bring proof of income.",
        "If you already get OESP, you must reapply to get a higher credit under the newer income levels.",
        "If you qualify for OESP, you may also apply for emergency grants through the Low-income Energy Assistance Program (LEAP)."
      ],
      "time": "About 4 to 6 weeks for a decision",
      "phone": "1-855-831-8151 (TTY 1-800-855-1155)"
    }
  },
  {
    "id": "bc-csil",
    "name": "Choice in Supports for Independent Living (CSIL)",
    "level": "British Columbia",
    "category": "Home support",
    "amount": "Monthly funds from your health authority; minimum $38.19 an hour (April 1, 2024)",
    "summary": "Your health authority sends you money each month so you can hire and manage your own home support workers. For people with a significant physical disability who want more control.",
    "note": "You pay a daily rate based on income, and no more than $300 a month if you or your spouse has earned income. You pay no daily rate if you get GIS, support and shelter allowance, or War Veterans Allowance.",
    "requires": [
      "bc",
      "bcCsilRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are assessed as needing home support services as part of your care plan.",
        "You are assessed as having high physical care needs and a physical disability, and are medically stable.",
        "Your assessed needs can be met within CSIL, within available resources.",
        "You agree to pay the assessed client rate.",
        "You can safely manage CSIL, or a support group or representative acts as your employer."
      ],
      "note": "You must also meet the general eligibility criteria for home and community care services."
    },
    "applyText": "Contact your health authority",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/accessing-health-care/home-community-care/care-options-and-cost/choice-in-supports-for-independent-living",
    "source": "https://www2.gov.bc.ca/gov/content/health/accessing-health-care/home-community-care/care-options-and-cost/choice-in-supports-for-independent-living",
    "detail": {
      "aboutList": {
        "lead": "CSIL gives you control over who you hire, when services happen and how tasks are done.",
        "items": [
          "You become the employer and manage hiring, supervising and how the funds are spent.",
          "Funding is the hourly rate times the home support hours your assessment says you need each month.",
          "Your monthly contribution is taken out of the funding you receive."
        ]
      },
      "steps": [
        "Contact your health authority's home and community care office, or ask a health care professional to refer you.",
        "Have your health authority assess your care needs and your finances.",
        "Agree on funding in a written agreement between you and the health authority.",
        "Hire and supervise your own care providers and manage the funds."
      ],
      "documents": [
        "The page does not list documents. Ask your responsible assessor what to bring."
      ],
      "tips": [
        "Read the CSIL Online Workbook to see what being an employer involves.",
        "Tell your responsible assessor about any earned income during your financial assessment.",
        "If the daily rate would cause serious financial hardship, you can ask for a temporary reduction.",
        "If you cannot manage CSIL alone, a client support group or a representative can act as employer."
      ],
      "time": "Not published"
    }
  },
  {
    "id": "bc-family-benefit",
    "name": "B.C. Family Benefit",
    "level": "British Columbia",
    "category": "Money (for parents)",
    "amount": "Up to $1,750 first child, $1,100 second child, $900 each added child a year (July 2026 to June 2027)",
    "summary": "A tax-free monthly payment for families with children under 18. The CRA pays it together with the Canada child benefit and works out the amount from your tax return.",
    "note": "Amounts are for July 2026 to June 2027, based on 2025 income. Low-income single parents may get up to $500 more a year. Shared custody gets half the amount.",
    "requires": [
      "bc",
      "child",
      "bcFamilyBenefitRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "Your family has a child under 18.",
        "Your child is registered for the Canada child benefit.",
        "You (and your spouse or common-law partner) file a T1 income tax return."
      ],
      "note": "The amount depends on your family makeup and your adjusted family net income."
    },
    "applyText": "Register for the Canada child benefit",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/family-social-supports/affordability/family-benefit",
    "source": "https://www2.gov.bc.ca/gov/content/family-social-supports/affordability/family-benefit",
    "detail": {
      "aboutList": {
        "lead": "The CRA calculates the amount automatically from the tax returns you have filed.",
        "items": [
          "You get the maximum if 2025 adjusted family net income is less than $30,176.",
          "Between $30,176 and $96,562 you get a reduced amount of at least $775, $750 or $725 per child.",
          "Over $96,562 the amounts are reduced by 4 percent of the extra income until they reach zero.",
          "The monthly payment is the annual amount divided by 12."
        ]
      },
      "steps": [
        "File your T1 tax return, and your spouse or partner files theirs.",
        "If your child is not registered for the Canada child benefit, apply for it through the CRA.",
        "The CRA uses that registration to decide your eligibility and pays you each month."
      ],
      "documents": [
        "Your T1 Income Tax and Benefit Return"
      ],
      "tips": [
        "Use the federal child and family benefits calculator to estimate your monthly amount.",
        "If you move outside B.C., tell the CRA quickly to avoid an overpayment you would have to repay.",
        "From July 2027 a disability supplement will be paid with this benefit for eligible children."
      ],
      "time": "Not published"
    }
  },
  {
    "id": "bc-home-support",
    "name": "Home Support (Home and Community Care)",
    "level": "British Columbia",
    "category": "Home support",
    "amount": "Subsidized service; daily rate based on income, and no more than $300 a month with earned income",
    "summary": "Publicly subsidized help at home from community health workers with personal care such as bathing, dressing and mobility. It can also give a caregiver a break.",
    "note": "Short-term care may not need the three-month residency. You pay no daily rate if you get GIS, support or shelter allowance, or a War Veterans Allowance.",
    "requires": [
      "bc",
      "bcHomeSupportRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "A health authority professional assessed you as needing personal assistance or respite for your caregiver.",
        "You agree to pay the assessed client rate."
      ],
      "note": "You must also meet the general eligibility criteria for home and community care services."
    },
    "applyText": "Contact your health authority",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/health/accessing-health-care/home-community-care/care-options-and-cost/home-support",
    "source": "https://www2.gov.bc.ca/gov/content/health/accessing-health-care/home-community-care/care-options-and-cost/home-support",
    "detail": {
      "aboutList": {
        "lead": "Home support helps you stay independent and live at home as long as possible.",
        "items": [
          "Help covers mobility, nutrition, lifts and transfers, bathing and dressing, cueing, grooming and toileting.",
          "It may also include clean-up, laundry of soiled bedding or clothing, and meal preparation.",
          "Hours are set by your health, your supports, your care goals and the risk to staff.",
          "It is usually provided over months or years, or short term after a hospital discharge."
        ]
      },
      "steps": [
        "Contact the home and community care office of your health authority, or ask a health care professional to refer you.",
        "Have a health authority professional do a clinical assessment of your need.",
        "Complete the financial assessment with your responsible assessor.",
        "Confirm that you accept the assessed client rate."
      ],
      "documents": [
        "The page does not list documents. Ask your health authority what to bring."
      ],
      "tips": [
        "Tell your responsible assessor about any earned income when you do your financial assessment.",
        "If the daily rate would cause serious financial hardship, you can ask for a temporary reduction.",
        "If you and your spouse both get home support, you are both assessed, but only one is charged per service day.",
        "If your assessed daily rate is more than the actual cost, you pay no more than the actual cost."
      ],
      "time": "Not published"
    }
  },
  {
    "id": "bc-income-assistance",
    "name": "Income Assistance",
    "level": "British Columbia",
    "category": "Income support",
    "amount": "Monthly payment; the amount is not stated on this page",
    "summary": "Monthly help for people in need who have no other resources, meant to support a move into work. It is a different program from disability assistance (PWD).",
    "note": "Disability assistance (PWD) is listed separately. Income assistance asks for a three-week work search first, unless you are exempt. Some people with disabilities are exempt.",
    "requires": [
      "bc",
      "age18plus",
      "bcIncomeAssistanceRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You are out of work or not earning enough to meet your basic needs.",
        "You are waiting for other sources of money to arrive.",
        "You cannot work at all.",
        "You urgently need food, shelter or medical attention."
      ],
      "note": "You must look for and use all other income and assets before you apply."
    },
    "applyText": "Apply on My Self Serve",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/family-social-supports/income-assistance",
    "source": "https://www2.gov.bc.ca/gov/content/family-social-supports/income-assistance",
    "detail": {
      "aboutList": {
        "lead": "Income assistance is for people in need with no other resources.",
        "items": [
          "Income and disability assistance payments are issued monthly, but they are separate kinds of assistance.",
          "This page does not state a payment amount, so check the rate tables.",
          "The application also asks about EI or WCB benefits, outstanding warrants and sponsorship."
        ]
      },
      "steps": [
        "Use My Self Serve to check your eligibility and apply, or visit your local office if you cannot apply online.",
        "Look for work for three weeks and keep a record on the Work Search Activities form, unless you are exempt.",
        "If you do not find a job, attend an eligibility assessment in person or by phone.",
        "If you are eligible, you begin to receive assistance."
      ],
      "documents": [
        "Identification for you and your family",
        "Your Social Insurance Number (SIN)",
        "How much you pay for rent and utilities",
        "Your bank account balance",
        "How much you owe on your vehicle, if you have a car",
        "Tenancy agreement or Shelter Information form, if you rent"
      ],
      "tips": [
        "You may skip the work search if you are fleeing an abusive spouse or relative, are 65 or older, or cannot legally work in Canada.",
        "Single parents of a child under three, and people with a condition that prevents a work search, may also skip it.",
        "A work search is also not needed if you or a close family member is a person with disabilities (PWD).",
        "Not eligible but still in need? You may be able to get hardship assistance, so contact the ministry.",
        "If you disagree with a decision, speak to a worker first, then ask for a reconsideration."
      ],
      "time": "Not published",
      "phone": "1-866-866-0800"
    }
  },
  {
    "id": "bc-nursing-support-services",
    "name": "Nursing Support Services (BC Children's Hospital)",
    "level": "British Columbia",
    "category": "Health (for children)",
    "amount": "In-home nursing respite and school nursing support; cost not stated",
    "summary": "Scheduled in-home nursing respite so families get a break, and trained school staff who help children with complex medical needs do their care at school.",
    "note": "Office services run Monday to Friday, 8 a.m. to 4 p.m. For specific questions, contact your local NSS Coordinator, not the central line.",
    "requires": [
      "bc",
      "child",
      "bcNursingSupportServicesRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a child or youth in B.C. with a chronic, complex medical condition.",
        "Your care, or part of it, needs a registered nurse's knowledge, judgement and skill.",
        "A B.C.-licensed primary physician or nurse practitioner refers you."
      ]
    },
    "applyText": "Ask for a referral",
    "applyUrl": "https://www.bcchildrens.ca/clinics-services/nursing-support-services",
    "source": "https://www.bcchildrens.ca/clinics-services/nursing-support-services",
    "detail": {
      "aboutList": {
        "lead": "The program supports children and youth whose care needs a registered nurse's skill.",
        "items": [
          "It may include children with a tracheostomy, a ventilator (including BiPAP and CPAP) or a palliative diagnosis.",
          "In-home respite is scheduled and intermittent, so families can have a break from daily medical care.",
          "School staff are taught to help with diabetes care or tube feeds as the student builds independence.",
          "School staff are also trained for rescue steps if a student is at risk of a seizure or adrenal crisis."
        ]
      },
      "steps": [
        "Ask your child's primary physician or nurse practitioner for a referral.",
        "The referral is for home respite, delegated care in schools, or both.",
        "Contact your local NSS Coordinator for help with your situation."
      ],
      "documents": [
        "A referral from your child's primary physician or nurse practitioner licensed in B.C."
      ],
      "tips": [
        "Email nss@cw.bc.ca with general questions about the services or how to make a referral.",
        "The central inbox and phone do not handle specific queries about your child.",
        "Referral details are on the program's referral page."
      ],
      "time": "Not published",
      "phone": "236-427-9250"
    }
  },
  {
    "id": "bc-ppmb",
    "name": "Persons with Persistent Multiple Barriers (PPMB)",
    "level": "British Columbia",
    "category": "Income support",
    "amount": "May bring a higher support rate and extra supplements; see the rate table",
    "summary": "An income assistance category for people with a long-term health condition and other barriers to work. You have no job search duties, and your family may get a higher rate and extra supplements.",
    "note": "PPMB is part of income assistance, not disability assistance (PWD). Spouses of PWD recipients cannot be assessed for it. It is not permanent, and the ministry can review it.",
    "requires": [
      "bc",
      "bcPpmbRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You get income assistance or hardship assistance.",
        "In the Minister's opinion, your confirmed health condition seriously impedes searching for or keeping work.",
        "The condition has lasted a year, or has happened often in the past year.",
        "It is likely to continue for at least two more years.",
        "You have at least one more barrier that seriously impedes you from searching for, accepting or keeping work."
      ],
      "note": "An approved health professional must confirm the health condition."
    },
    "applyText": "Ask the ministry for a PPMB application",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/persons-with-persistent-multiple-barriers/persons-with-persistent-multiple-barriers-topic",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/persons-with-persistent-multiple-barriers/persons-with-persistent-multiple-barriers-topic",
    "detail": {
      "aboutList": {
        "lead": "PPMB differs from disability assistance (PWD) in who it covers and how it is assessed.",
        "items": [
          "PPMB is not part of the Employment and Assistance for Persons with Disabilities Act.",
          "PPMB is assessed with its own two-part application, form HR2892.",
          "PPMB recipients have no employability duties, but may take part on a voluntary basis.",
          "A family with one eligible adult may get a higher support rate and an earnings exemption.",
          "It may also get general health supplements, dental supplements and employability supports.",
          "Barriers include homelessness now or in the past 12 months, or domestic violence in the past six months.",
          "Others are less than Grade 12, English training needs, no basic work skills, or a criminal record.",
          "Also counted are multiple emergency health, mental health or addiction service visits in 12 months.",
          "Also counted are recent refugee status (within 24 months), former child in care, or another severe barrier."
        ]
      },
      "steps": [
        "Ask the ministry for a PPMB application. It first checks that you are a recipient.",
        "Complete and submit the PPMB application (HR2892).",
        "The ministry will contact you with an eligibility decision.",
        "If you leave assistance and reapply within 24 months, you keep your PPMB category."
      ],
      "documents": [
        "PPMB application (HR2892), with Section 1 completed by an approved health professional"
      ],
      "tips": [
        "Approved health professionals include a medical practitioner, nurse practitioner, registered psychologist, and registered nurse or registered psychiatric nurse.",
        "They also include an occupational therapist, physical therapist, registered social worker, chiropractor, registered clinical counsellor and school psychologist.",
        "The ministry looks at whether your condition limits you to part-time or sporadic work.",
        "If you were off assistance for longer than 24 months, you may be reassessed for PPMB when you reapply."
      ],
      "time": "Not published"
    }
  },
  {
    "id": "bc-rental-assistance-program",
    "name": "Rental Assistance Program (RAP)",
    "level": "British Columbia",
    "category": "Housing",
    "amount": "Pays a share of rent above 30% of household income, up to rent ceilings and benefit maximums",
    "summary": "Monthly help with private-market rent for low-income families with at least one dependent child. A child of any age can count if they have a disability as defined by the CRA.",
    "note": "RAP and income or disability assistance both pay a shelter subsidy, so you cannot get both. Existing clients must reapply each year.",
    "requires": [
      "bc",
      "bcRentalAssistanceProgramRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "Your total before-tax household income is $60,000 or less a year.",
        "You have at least one dependent child, mainly supported by you.",
        "You have less than $100,000 in assets.",
        "You file an annual income tax return.",
        "More than 30% of your household income goes to rent or pad rental for a home you own.",
        "You have lived in B.C. for 12 months.",
        "You do not get income or disability assistance, unless it ended and you only get Medical Services Only.",
        "You do not live in subsidized housing or own shares in a co-operative.",
        "You do not share a kitchen or bathroom with your landlord or the homeowner.",
        "You and your family meet the program residency and citizenship rules."
      ],
      "note": "A dependent child is under 19, under 25 in full-time school, or any age with a disability under CRA rules."
    },
    "applyText": "Get a RAP application",
    "applyUrl": "https://www.bchousing.org/housing-assistance/rental-assistance-programs/RAP",
    "source": "https://www.bchousing.org/housing-assistance/rental-assistance-programs/RAP",
    "detail": {
      "aboutList": {
        "lead": "RAP reimburses a percentage of the gap between your rent and 30 percent of gross income.",
        "items": [
          "Payments are subject to maximum rent ceilings and maximum benefit amounts.",
          "Rent ceilings since April 2025 are $1,950 for a family of 3 or less and $2,200 for 4 or more.",
          "Assistance is based on your previous year's income.",
          "Assets counted include real estate, stocks, cash and business equity.",
          "Vehicles, RESPs, RRSPs and RDSPs do not count toward the asset limit."
        ]
      },
      "steps": [
        "Download the RAP application form, request one by mail, or pick one up at a BC Housing office.",
        "Attach your supporting documents.",
        "Submit by upload, drop-off at a BC Housing office, fax or mail.",
        "BC Housing will contact you by mail to say if you are approved or ineligible, or need more information."
      ],
      "documents": [
        "Proof of income: CRA consent form, or last year's T1 and Notice of Assessment",
        "Proof of status in Canada for every household member",
        "Proof of rent, such as a tenancy agreement",
        "A void cheque or other direct deposit form",
        "Proof of assets, such as bank statements",
        "Proof of enrolment for children aged 19 to 24 in full-time school"
      ],
      "tips": [
        "Giving CRA consent is optional, but it streamlines your application and yearly reapplication.",
        "Send copies only. Do not send original documents.",
        "Payments are made by direct deposit on the last working day of each month, so you need a bank account.",
        "Rental assistance is non-taxable, but declare it on your taxes if you get more than $500 in a tax year.",
        "If you go on income or disability assistance, tell BC Housing at once or you may owe a debt.",
        "If CRA has not processed your tax return, you can still apply and have up to 90 days to send missing items."
      ],
      "time": "Not published",
      "phone": "604-433-2218 or 1-800-257-7756"
    }
  },
  {
    "id": "bc-safer",
    "name": "Shelter Aid for Elderly Renters (SAFER)",
    "level": "British Columbia",
    "category": "Housing",
    "amount": "Monthly rent supplement (minimum $50 a month)",
    "summary": "A monthly rent supplement for B.C. residents aged 60 or older with a low to moderate income who rent in the private market.",
    "note": "You are not eligible if you or your family get income or disability assistance, unless it ended and you only get Medical Services Only. Existing clients reapply each year.",
    "requires": [
      "bc",
      "age60plus",
      "bcSaferRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are age 60 or older.",
        "Your gross income is less than $3,333.34 a month or $40,000 a year.",
        "You file an annual income tax return.",
        "You have lived in B.C. for 12 months.",
        "You pay more than 30% of your gross monthly household income on rent.",
        "You and your spouse meet the Canadian citizenship requirements.",
        "You do not live in subsidized housing, Ministry of Health-funded care, or co-op housing as a shareholder."
      ],
      "note": "If you own and live in a manufactured home, pad rental counts as rent."
    },
    "applyText": "Get a SAFER application",
    "applyUrl": "https://www.bchousing.org/housing-assistance/rental-assistance-programs/SAFER",
    "source": "https://www.bchousing.org/housing-assistance/rental-assistance-programs/SAFER",
    "detail": {
      "aboutList": {
        "lead": "SAFER helps older renters in the private market pay their rent.",
        "items": [
          "The maximum rent ceiling as of April 2025 is $1,150 for both singles and couples.",
          "If your rent is over the ceiling, you may not get an increase in your subsidy.",
          "If your rent includes meals, care or personal services, rent is counted as 50% of what you pay."
        ]
      },
      "steps": [
        "Download the SAFER application form, request one by mail, or pick one up at a BC Housing office.",
        "Attach your supporting documents.",
        "Submit by upload, drop-off, fax or mail.",
        "BC Housing will contact you by mail to say if you are approved, ineligible or need to send more.",
        "Each year, complete the reapplication form sent three months before your birthday."
      ],
      "documents": [
        "Tax information: CRA consent form, or last year's tax return and Notice of Assessment",
        "Proof of current gross monthly income, if your income has stopped or dropped",
        "Proof of age and status in Canada for you and your spouse",
        "Proof of rent, such as a tenancy agreement",
        "A void cheque or other direct deposit form"
      ],
      "tips": [
        "Send copies only. Do not include original documents.",
        "Receiving the BC Bus Pass or Provincial Seniors Supplement does not affect SAFER, but send your T5007 slip.",
        "Your subsidy starts the month your application is received, and is paid in arrears.",
        "SAFER is non-taxable, but declare it on your taxes if you get more than $500 in a tax year.",
        "If you move or your rent changes, tell the SAFER office right away."
      ],
      "time": "Not published",
      "phone": "604-433-2218 or 1-800-257-7756"
    }
  },
  {
    "id": "bc-hearing-supplements",
    "name": "Hearing Instruments and Alternative Hearing Assistance Supplement",
    "level": "British Columbia",
    "category": "Health",
    "amount": "Up to $2,000 per hearing aid; the alternative supplement amount is in the rate table",
    "summary": "Pays for the least expensive, appropriate hearing aids, repairs and supplies for eligible recipients who lack the money. A separate monthly supplement helps with profound hearing loss in both ears.",
    "note": "Hearing aids and repairs are not provided in a month you get the alternative supplement. Buy only after approval, or the ministry will not accept payment responsibility.",
    "requires": [
      "bc",
      "bcAssistanceStatus",
      "hearingDisability"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You are a recipient who is eligible for general health supplements.",
        "You are a hard of hearing parent of a dependent child.",
        "You are a child under 19 in a family eligible for MSP supplementary benefits (Healthy Kids).",
        "You are in ministry-approved training.",
        "In the Supervisor's opinion you need one to get a job, and going without is a direct barrier.",
        "You are registered with the CNIB and are hard of hearing.",
        "You have a hearing impairment and are the sole homemaking support for an adult with a cognitive impairment."
      ],
      "note": "Each route also needs an assessment, prior approval, the least expensive option and no other resources."
    },
    "applyText": "Ask a hearing provider to start approval",
    "applyUrl": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/health-supplements-and-programs/medical-equipment-hearing-instruments",
    "source": "https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/health-supplements-and-programs/medical-equipment-hearing-instruments",
    "detail": {
      "aboutList": {
        "lead": "The main program covers hearing aids, bone anchored hearing aids, cochlear implants and repairs.",
        "items": [
          "New purchases include one year of batteries and one-time replacement coverage paid at $300 per aid.",
          "Repairs must cost less than replacing, and the damage must not be from misuse.",
          "Replacement is considered if it costs less than repair, there was no misuse, and 3 years have passed.",
          "The alternative hearing assistance supplement is a separate monthly payment.",
          "It is for permanent profound hearing loss in both ears.",
          "You must not be able to benefit significantly from a hearing instrument for speech comprehension.",
          "An audiologist or hearing instrument practitioner must assess you within the last 12 months.",
          "It is not available if you got a hearing instrument in the last 36 months, unless the loss developed since."
        ]
      },
      "steps": [
        "Get a hearing assessment at the health authority hearing clinic, or the nearest hospital audiology department.",
        "If those are unavailable, see an audiologist or registered hearing instrument practitioner. No referral is needed.",
        "Your provider contacts Pacific Blue Cross (PBC) to start the eligibility check, before you buy anything.",
        "The provider has 120 days to send PBC the records, and PBC makes the final decision.",
        "Once authorized, you get a 60-day trial period.",
        "For the alternative supplement, your hearing health professional contacts PBC, which notifies you in writing.",
        "If denied, you can ask the ministry for a reconsideration (form HR0100)."
      ],
      "documents": [
        "Assessment from an audiologist or a registered hearing instrument practitioner",
        "For the alternative supplement, an assessment from the last 12 months confirming profound hearing loss in both ears",
        "Other documents PBC asks your provider to send"
      ],
      "tips": [
        "The ministry does not accept hearing instrument request documents. Your provider sends them straight to PBC.",
        "You must use other resources first, such as PharmaCare, ICBC, WorkSafeBC, Veterans Affairs Canada or private insurance.",
        "If insurance pays only part, the ministry may consider paying the rest.",
        "The ministry is not responsible for fees for documentation for hearing instruments.",
        "WorkBC Assistive Technology Services may help with communication and hearing devices at work."
      ],
      "time": "Not published"
    }
  },
  {
    "id": "ab-blue-cross-non-group",
    "name": "Alberta Blue Cross Non-Group Coverage",
    "level": "Alberta",
    "category": "Health",
    "amount": "Monthly premium: $63.50 (single) or $118.00 (family). Subsidized: $44.45 or $82.60.",
    "summary": "Extra health coverage for Albertans under 65 and their dependants. It helps pay for prescriptions, diabetes supplies, ambulance and more. You pay a monthly premium.",
    "note": "From October 1, 2026, private or employer plans pay first. Non-Group Coverage then pays the remaining eligible costs. Lower-income people may get a premium subsidy.",
    "requires": [
      "ab",
      "abBlueCrossNonGroupRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are an Alberta resident under 65 years old.",
        "You are registered under the Alberta Health Care Insurance Plan (AHCIP).",
        "You pay the monthly premium."
      ],
      "note": "Premium subsidy: taxable income under $20,970 (single), $33,240 (family, no children) or $39,250 (with children)."
    },
    "applyText": "Open the official page on alberta.ca",
    "applyUrl": "https://www.alberta.ca/non-group-coverage",
    "source": "https://www.alberta.ca/non-group-coverage",
    "detail": {
      "aboutList": {
        "lead": "What the plan covers",
        "items": [
          "Prescription drugs on the Alberta Drug Benefit List, with a 30% co-payment up to $35.",
          "Diabetes supplies up to $2,400 a person each benefit year, no co-payment; the limit depends on how diabetes is managed.",
          "Ground ambulance to and from a hospital, up to the rate set by the Alberta government.",
          "Psychologist visits up to $60 each, to $300 per family each year.",
          "Home nursing up to $200 per family each year, with a physician's written order.",
          "A $50 yearly deductible applies to most other benefits."
        ]
      },
      "steps": [
        "Complete the application for Non-Group Coverage.",
        "Send it to the AHCIP office.",
        "To get a lower premium, also complete the Premium Subsidy application and use Line 260 of your tax return."
      ],
      "documents": [
        "Line 260 of your federal tax return, and your spouse's or partner's, for the premium subsidy"
      ],
      "tips": [
        "Coverage starts the first day of the fourth month after the AHCIP office gets your application.",
        "If you had a plan before, apply within 30 days of its end date. Coverage may start as early as the next month.",
        "You can ask for a subsidy for this benefit year plus two earlier ones.",
        "It does not cover travel. Buy travel insurance for trips outside Alberta.",
        "Albertans 65 and older use the Coverage for Seniors program instead."
      ],
      "time": "Coverage starts the first day of the fourth month after the AHCIP office gets your application."
    }
  },
  {
    "id": "ab-brain-injury",
    "name": "Alberta Brain Injury Initiative",
    "level": "Alberta",
    "category": "Community supports",
    "amount": "Service coordination and help finding supports. No dollar amount is published.",
    "summary": "A network of agencies that helps adults with an acquired brain injury, and their families, find and use supports. A service coordinator looks at your needs and helps build a plan.",
    "note": "Each agency serves set communities. Check the list on the official page to find the one that covers where you live.",
    "requires": [
      "ab",
      "age18plus",
      "brainInjuryDisability",
      "abBrainInjuryRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are an adult with an acquired brain injury."
      ],
      "note": "Families of survivors can also get help from the service coordinators."
    },
    "applyText": "Open the official page on alberta.ca",
    "applyUrl": "https://www.alberta.ca/brain-injury-supports",
    "source": "https://www.alberta.ca/brain-injury-supports",
    "detail": {
      "aboutList": {
        "lead": "A service coordinator can",
        "items": [
          "Give you information about brain injury and the supports that exist.",
          "Assess what you need.",
          "Work with you, your family and service providers on service plans and agreements.",
          "Refer you to community supports and independent living skills development.",
          "Help you find, apply for and coordinate benefits and services."
        ]
      },
      "steps": [
        "Find the agency that serves your community on the official page.",
        "Contact it by phone or email."
      ],
      "documents": [],
      "tips": [
        "The Brain Injury Survival Guide is for survivors and families. Ask your regional agency for a printed copy.",
        "The page also links to free brain injury videos on YouTube."
      ]
    }
  },
  {
    "id": "ab-child-family-benefit",
    "name": "Alberta Child and Family Benefit",
    "level": "Alberta",
    "category": "Money (for parents)",
    "amount": "Base: up to $1,529 (1 child) to $3,821 (4 or more), July 2026 to June 2027. Working part: up to $782 to $2,061.",
    "summary": "Payments for lower and middle-income families with children under 18. Getting AISH, Income Support or the Alberta child care subsidy does not stop you from getting it.",
    "note": "The Canada Revenue Agency (CRA) pays in August, November, February and May. The amount depends on your family income and how many children you have.",
    "requires": [
      "ab",
      "abChildFamilyBenefitRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a parent of one or more children under 18.",
        "You live in Alberta.",
        "You file a tax return.",
        "You meet the income criteria."
      ],
      "note": "In 2026–27, amounts are reduced once family net income goes over $28,116 or $47,115."
    },
    "applyText": "Open the official page on alberta.ca",
    "applyUrl": "https://www.alberta.ca/alberta-child-and-family-benefit",
    "source": "https://www.alberta.ca/alberta-child-and-family-benefit",
    "detail": {
      "aboutList": {
        "lead": "How it works",
        "items": [
          "The base part goes to lower-income families, whether or not they earn employment income.",
          "The working part starts when family employment income is over $2,760.",
          "The working part grows by 15% of each extra dollar earned, up to the maximum.",
          "Payments are not taxable and do not change your AISH or Income Support."
        ]
      },
      "steps": [
        "File your tax return each year.",
        "If you qualify for the Canada Child Benefit, you are considered automatically.",
        "If you have not applied for the Canada Child Benefit, apply for it online."
      ],
      "documents": [],
      "tips": [
        "Free tax clinics can prepare tax returns for eligible lower-income Albertans.",
        "Payments under $10 in a quarter may be joined and paid less often.",
        "Use the child and family benefits calculator to estimate your amount. Have your tax return handy.",
        "If your family leaves Alberta, you may have to return money for the months you were away."
      ],
      "phone": "Canada Revenue Agency: 1-800-959-2809"
    }
  },
  {
    "id": "ab-home-care",
    "name": "Home and Community Care (continuing care at home)",
    "level": "Alberta",
    "category": "Home support",
    "amount": "Publicly funded health and personal care. You pay for medications, nutrition products and long-term supplies.",
    "summary": "Health and personal care at home for people of any age, including help with dressing, bathing, meals and wound care. It also offers respite for caregivers.",
    "note": "Services are meant to add to help from family, friends and community, not replace it. Day program clients pay a daily fee.",
    "requires": [
      "ab",
      "abHomeCareRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Alberta.",
        "A professional assessment finds that you have unmet care needs."
      ],
      "note": "Age, diagnosis and how long you need support do not decide who can get services."
    },
    "applyText": "Open the official page on alberta.ca",
    "applyUrl": "https://www.alberta.ca/about-continuing-care",
    "source": "https://www.alberta.ca/about-continuing-care",
    "detail": {
      "aboutList": {
        "lead": "Services can include help with",
        "items": [
          "Dressing, eating and bathing.",
          "Meal preparation and medication administration.",
          "Wound care and respite.",
          "Short-term care after an accident, injury or illness, or long-term care for disease, disability or aging."
        ]
      },
      "steps": [
        "Read how to access continuing care on the official page.",
        "A professional assesses your unmet care needs."
      ],
      "documents": [],
      "tips": [
        "Providers are Assisted Living Alberta, contracted providers, or someone you hire under self-managed care.",
        "Programs such as Alberta Aids to Daily Living (AADL) may help pay for basic medical equipment and supplies.",
        "Palliative care coverage may help with drugs, diabetic supplies and ambulance if you are diagnosed as palliative."
      ]
    }
  },
  {
    "id": "ab-income-support",
    "name": "Alberta Income Support",
    "level": "Alberta",
    "category": "Income support",
    "amount": "Money for basic needs. The amount depends on your needs, ability to work and family size.",
    "summary": "Money for basic needs like food, clothing and shelter if you cannot pay for them. It can also include health benefits, employment services and help getting child support.",
    "note": "You can work while on Income Support. Only a portion of your earnings is counted when your benefit is worked out.",
    "requires": [
      "ab",
      "age18plus",
      "abIncomeSupportRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Alberta and are at least 18 years old.",
        "You are a Canadian citizen, permanent resident, refugee or refugee claimant.",
        "You cannot pay for your basic needs.",
        "You have no more than $5,000 in RRSPs per adult and $10,000 equity in vehicles.",
        "Your cash and savings are under the liquid asset limit.",
        "You are willing to apply for other income programs, such as Employment Insurance.",
        "You give personal and financial information for everyone in your household.",
        "You will make and follow a plan with your Income Support worker.",
        "You are looking for work, not earning enough, unable to work, or need job training help."
      ],
      "note": "Your income must not be more than what you would get from Income Support core benefits."
    },
    "applyText": "Apply online with an Alberta.ca account",
    "applyUrl": "https://www.alberta.ca/income-support-how-to-apply",
    "source": "https://www.alberta.ca/income-support-eligibility",
    "detail": {
      "aboutList": {
        "lead": "Depending on your needs, you may get money for",
        "items": [
          "Basic expenses like food, clothing and shelter.",
          "Childcare, special diets, and utility connection fees.",
          "Work-related expenses and school expenses for children.",
          "Unexpected emergencies and costs to leave family violence."
        ]
      },
      "steps": [
        "Create an Alberta.ca account. A verified account is recommended.",
        "Gather your documents.",
        "Apply online.",
        "If you cannot apply online, contact your local Alberta Supports Centre to make an appointment."
      ],
      "documents": [
        "Identification for you, your spouse or partner, and any dependents",
        "Bank statements for the 60 days before you apply, for all accounts",
        "A medical letter, if you cannot work for medical reasons"
      ],
      "tips": [
        "Income Support staff need you to verify your account before they approve your application.",
        "Emergency help for basic needs can be arranged in as little as 2 days. The 24-hour line is 1-866-644-5135.",
        "Ask for an interpreter if you need one to finish the application.",
        "The liquid asset limit is generally three times the core benefit you would get."
      ],
      "time": "The process typically takes 2 weeks.",
      "phone": "Alberta Supports Contact Centre: 1-877-644-9992"
    }
  },
  {
    "id": "ab-rent-assistance-benefit",
    "name": "Rent Assistance Benefit",
    "level": "Alberta",
    "category": "Housing",
    "amount": "The amount is calculated from your household income and local market rent.",
    "summary": "A long-term rent subsidy for Albertans with low income. It is paid directly to tenants and may be renewed each year.",
    "note": "People are given priority based on need. Need looks at factors such as income, assets, number of dependants and your current housing.",
    "requires": [
      "ab",
      "abRentAssistanceBenefitRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "Your income is below the local income limit for your community.",
        "You are a Canadian citizen, permanent resident or refugee, or an applicant for refugee or immigrant status."
      ],
      "note": "People with a broken private sponsorship and Ukraine evacuees with emergency travel papers can also apply."
    },
    "applyText": "Use the Find Housing tool on alberta.ca",
    "applyUrl": "https://www.alberta.ca/rent-assistance",
    "source": "https://www.alberta.ca/rent-assistance",
    "detail": {
      "aboutList": {
        "lead": "Benefit features",
        "items": [
          "It is available through most housing management bodies across Alberta.",
          "There is no limit on yearly renewals if you are still eligible."
        ]
      },
      "steps": [
        "Answer a few questions in the Find Housing tool.",
        "Pick a local housing provider that offers a program that suits you.",
        "Contact the provider for a rent assistance application."
      ],
      "documents": [],
      "tips": [
        "A separate Temporary Rent Assistance Benefit lasts 2 years. It has extra rules, such as recent work and not getting Income Support, AISH or the Alberta Seniors Benefit.",
        "Housing providers manage the program and choose tenants.",
        "The Private Landlord Rent Supplement is closed. Current recipients move to this benefit when funding ends."
      ],
      "phone": "Alberta Supports Contact Centre: 1-877-644-9992"
    }
  },
  {
    "id": "ab-seniors-benefit",
    "name": "Alberta Seniors Benefit",
    "level": "Alberta",
    "category": "Income support",
    "amount": "Up to $3,946 a year (single) or $5,918 (couple) for homeowners, renters and lodge residents, when income used is $0.",
    "summary": "Monthly money for lower-income seniors 65 and older. The amount depends on your income, where you live and whether you have a partner.",
    "note": "From July 1, 2026, income guidelines are $32,690 or less (single) and $53,800 or less (couple), for people who get full Old Age Security.",
    "requires": [
      "ab",
      "age65plus",
      "abSeniorsBenefitRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are 65 or older.",
        "You lived in Alberta for at least 3 months right before you apply.",
        "You are a Canadian citizen or permanent resident.",
        "You get the Old Age Security (OAS) pension.",
        "You meet the financial eligibility criteria."
      ],
      "note": "If you or your partner chose to delay OAS, you are not eligible."
    },
    "applyText": "Apply online or by mail",
    "applyUrl": "https://www.alberta.ca/alberta-seniors-benefit",
    "source": "https://www.alberta.ca/alberta-seniors-benefit",
    "detail": {
      "aboutList": {
        "lead": "How your benefit is worked out",
        "items": [
          "It uses your income and your partner's, last calendar year, from your tax return.",
          "It also depends on your residence type and your marital or cohabitation status.",
          "In a continuing care home: up to $12,466 a year for a single senior, or $16,412 for a couple with one partner at home.",
          "Other residence categories get up to $2,749 (single) or $5,496 (couple)."
        ]
      },
      "steps": [
        "Read the Seniors Financial Assistance information booklet.",
        "Apply online, print the form, or call to ask for a form by mail.",
        "Attach your supporting documents.",
        "Send your documents online, by fax or by mail."
      ],
      "documents": [
        "Proof of date of birth, unless you are 65 or older and get Old Age Security",
        "A pre-printed void cheque or direct deposit form (optional)",
        "Income estimate form, if your income dropped and you are applying for the first time"
      ],
      "tips": [
        "If you apply online with a verified Alberta.ca account, you can skip the supporting documents step.",
        "You may be paid up to 11 months back from the date the program gets your form, but not before age 65.",
        "Tell the program if you move, your marital status changes, your income changes or your OAS changes.",
        "The benefit year runs July 1 to June 30."
      ],
      "phone": "Alberta Supports Contact Centre: 1-877-644-9992"
    }
  },
  {
    "id": "ab-seniors-dental-optical",
    "name": "Dental and Optical Assistance for Seniors",
    "level": "Alberta",
    "category": "Health",
    "amount": "Dental: up to $5,000 every 5 years. Glasses: up to $230 every 3 years.",
    "summary": "Help paying for basic dental care and prescription glasses for lower-income seniors 65 and older. You must first be approved for Seniors Financial Assistance programs.",
    "note": "Dental coverage may not cover the full fees that dentists charge. Ask your dentist to request pre-authorization from Alberta Blue Cross first.",
    "requires": [
      "ab",
      "age65plus",
      "abSeniorsDentalOpticalRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are 65 or older.",
        "You are an Alberta resident and lived here at least 3 months before applying.",
        "You are a Canadian citizen or admitted to Canada for permanent residence.",
        "You are approved for Seniors Financial Assistance programs.",
        "Your annual income is within the program limits."
      ],
      "note": "For 2026–27, coverage needs 2025 total income of $0 to $32,690 (single) or $0 to $65,380 (couple)."
    },
    "applyText": "Apply through Seniors Financial Assistance",
    "applyUrl": "https://www.alberta.ca/dental-optical-assistance-seniors",
    "source": "https://www.alberta.ca/dental-optical-assistance-seniors",
    "detail": {
      "aboutList": {
        "lead": "What is covered",
        "items": [
          "Dental: exams, x-rays, cleaning, fillings, extractions, root canals, gum treatment and basic dentures.",
          "Not covered: crowns, bridges, braces, implants, fluoride and cosmetic work.",
          "Optical: prescription glasses, sunglasses, lenses, contact lenses, frames and repairs.",
          "Not covered: eye exams, eye surgery, cataract surgery lenses and magnifiers."
        ]
      },
      "steps": [
        "Apply for Seniors Financial Assistance programs. Skip this if you already did.",
        "Show your Alberta health card at the dental or optical office and say you are enrolled.",
        "Ask the office to bill Alberta Blue Cross directly.",
        "If they cannot, pay the bill and send in a reimbursement claim."
      ],
      "documents": [
        "Alberta health card",
        "Receipts and a completed claim form, if you claim a reimbursement"
      ],
      "tips": [
        "Unused dental money does not carry into the next 5-year period. Unused optical money does not carry into the next 3-year period.",
        "Claim within 12 months of the expense or it will not be paid.",
        "For services covered by both plans, claim from the Canadian Dental Care Plan first.",
        "If cataract surgery changes your prescription, you may get funding for another set of glasses. You need a medical note."
      ],
      "phone": "Alberta Blue Cross claims: 1-800-661-6995"
    }
  },
  {
    "id": "ab-seniors-special-needs-assistance",
    "name": "Special Needs Assistance for Seniors",
    "level": "Alberta",
    "category": "Daily living supports",
    "amount": "Up to $5,872 in a benefit year (July 1 to June 30).",
    "summary": "Money toward set items for lower-income seniors 65 and older, such as CPAP machines, diabetes supplies, prescription costs, clothing, and appliances or furniture.",
    "note": "A receipt or estimate is needed for all requests unless the page says otherwise. Items bought before you enrolled are not covered.",
    "requires": [
      "ab",
      "age65plus",
      "abSeniorsSpecialNeedsAssistanceRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are 65 or older and an Alberta resident.",
        "You are a Canadian citizen or lawfully admitted for permanent residence.",
        "You have provided a Seniors Financial Assistance application.",
        "You meet the financial criteria.",
        "Neither you nor your spouse has deferred Old Age Security."
      ],
      "note": "In general, $32,690 or less (single) or $53,800 or less (couple) may qualify."
    },
    "applyText": "Make a claim through MyAlberta Seniors or by mail",
    "applyUrl": "https://www.alberta.ca/seniors-special-needs-assistance",
    "source": "https://www.alberta.ca/seniors-special-needs-assistance",
    "detail": {
      "aboutList": {
        "lead": "How income sets what you can get",
        "items": [
          "Single with income of $28,290 or less: primary and secondary items.",
          "Single with income of $28,291 to $32,690: primary items only.",
          "Couple with income of $45,600 or less: primary and secondary items.",
          "Couple with income of $45,601 to $53,800: primary items only.",
          "Examples: CPAP up to $1,881 every 5 years, celiac groceries up to $63 a month, refrigerator up to $824 (one time only)."
        ]
      },
      "steps": [
        "Enrol in Seniors Financial Assistance programs if you have not.",
        "Get a receipt or estimate with your name, Personal Health Number, address and phone number.",
        "Add any medical notes the item needs.",
        "Send your claim through MyAlberta Seniors, or by mail or fax."
      ],
      "documents": [
        "Receipt or estimate for each item",
        "Medical notes for items that need them"
      ],
      "tips": [
        "The program accepts a receipt for an item bought up to 12 months before it gets your claim.",
        "You must have been eligible when you bought the item.",
        "Keep receipts for funded items for at least 2 years.",
        "You can appeal a decision. The page lists the steps."
      ],
      "phone": "Alberta Supports Contact Centre: 1-877-644-9992"
    }
  },
  {
    "id": "ab-sharp",
    "name": "Seniors Home Adaptation and Repair Program (SHARP)",
    "level": "Alberta",
    "category": "Home",
    "amount": "A low-interest loan of $500 to $40,000. The current interest rate is 4.45%.",
    "summary": "A low-interest home equity loan for seniors to repair or adapt their home, such as stair lifts, walk-in tubs or wider doorways. You do not make monthly repayments.",
    "note": "The loan is due when you sell, are no longer a registered owner, or the home is no longer your main home. The government registers a caveat on your land title.",
    "requires": [
      "ab",
      "age65plus",
      "abSharpRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are 65 or older. Only one spouse or partner needs to be 65 or older.",
        "You are a registered owner of a home in a Land Titles Office.",
        "Your annual income is $75,000 or less.",
        "You keep at least 25% equity in your main home after the loan.",
        "You are a Canadian citizen or lawfully admitted for permanent residence.",
        "You have lived in Alberta for at least 3 months."
      ],
      "note": "Your income is taken from line 15000 of last year's tax return."
    },
    "applyText": "Apply with the Loan Application and Agreement",
    "applyUrl": "https://www.alberta.ca/seniors-home-adaptation-repair-program",
    "source": "https://www.alberta.ca/seniors-home-adaptation-repair-program",
    "detail": {
      "aboutList": {
        "lead": "What the loan can pay for",
        "items": [
          "Repairs, adaptations and renovations to your main home.",
          "Projects that help you stay safe, independent and mobile, or improve energy efficiency.",
          "Work paid for in the 12 months before the program gets your application."
        ]
      },
      "steps": [
        "Read the information guide.",
        "Complete and sign the Loan Application and Agreement.",
        "Send it with your supporting documents online, by fax or by mail."
      ],
      "documents": [
        "A written cost estimate or receipts for all project costs",
        "Property tax assessment or bill",
        "Direct deposit form or void cheque (optional)"
      ],
      "tips": [
        "If you do not qualify for a loan, a single senior with income of $32,690 or less, or a couple with $53,800 or less, may be considered for a grant.",
        "Charges such as a reverse mortgage, bankruptcy or foreclosure on your land title must be removed first.",
        "If you sign a repair contract, apply within 45 days to keep your cancellation rights.",
        "Interest is simple interest and is reviewed in April and October."
      ],
      "phone": "Alberta Supports Contact Centre (ask for a call back from a loan specialist): 1-877-644-9992"
    }
  },
  {
    "id": "bc-subsidized-housing",
    "name": "Subsidized housing (BC Housing Registry) for people with disabilities",
    "level": "British Columbia",
    "category": "Housing",
    "amount": "Rent is 30% of household gross income, with a minimum rent",
    "summary": "Long-term rental housing for B.C. residents with disabilities and a low income. Rent is based on your income. Demand is high, so wait times cannot be predicted.",
    "note": "You must be able to live independently, with supports if they are available in your community. Your application must be kept up to date or it may be cancelled.",
    "requires": [
      "bc",
      "bcSubsidizedHousingRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in B.C. and can live independently.",
        "You get a recognized disability pension, or you are disabled for income tax purposes.",
        "Your household gross income is below the Housing Income Limits (HILs).",
        "Your household assets are under $100,000 in buildings managed by BC Housing.",
        "Everyone in your household meets the residency rules, such as being a citizen or permanent resident."
      ],
      "note": "Non-profit and co-op providers decide for themselves whether to apply an assets limit."
    },
    "applyText": "Apply to the Housing Registry",
    "applyUrl": "https://www.bchousing.org/housing-assistance/rental-housing/subsidized-housing",
    "source": "https://www.bchousing.org/housing-assistance/rental-housing/subsidized-housing",
    "detail": {
      "aboutList": {
        "lead": "This page covers subsidized housing in general. This is what it says for people with disabilities.",
        "items": [
          "Rent is 30% of household gross income, subject to a minimum rent based on the number of people.",
          "Single people with disabilities can apply for bachelor and one-bedroom units.",
          "Low-income people who need help to live independently can apply for specially modified rental homes.",
          "Those homes are in selected subsidized housing developments.",
          "The income limits are the Housing Income Limits, which BC Housing sets from time to time."
        ]
      },
      "steps": [
        "Use Housing Listings to find buildings and see how each one takes applications.",
        "Apply online to the Housing Registry, or download and fill in the paper form.",
        "Send copies of your documents by upload, in person at a BC Housing office, by mail or by fax.",
        "Also apply directly to non-profit and co-op providers that run their own lists.",
        "Update your application about once every six months and when your details change."
      ],
      "documents": [
        "Proof you get a recognized disability pension, or are disabled for income tax purposes",
        "Last year's tax return showing the Disability Tax Credit, or a Canada Revenue Agency approval letter",
        "Copies of documents only, because originals are not returned"
      ],
      "tips": [
        "Applying to many buildings may improve your chances of getting a unit.",
        "If you have no landlord reference, some providers may accept a professional or personal reference.",
        "A Supplemental Form can be filled in for a serious health condition that is affected by your housing.",
        "If BC Housing does not hear from you for over six months, your application is put on hold."
      ],
      "time": "Not published. Wait times depend on unit turnover and the needs of other households."
    }
  },
  {
    "id": "on-childrens-rehab",
    "name": "Children's Rehabilitation Services (Children's Treatment Centres)",
    "level": "Ontario",
    "category": "Health (for children)",
    "amount": "Physiotherapy, occupational therapy and speech and language therapy",
    "summary": "Therapy and family supports for children and youth with physical or developmental disabilities or communication difficulties. You do not need a formal referral.",
    "note": "Children's Treatment Centres also give these services in schools to students in Ontario public schools. Students in publicly funded schools may use them until they finish school.",
    "requires": [
      "on",
      "under19",
      "onChildrensRehabRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a child or youth up to 19 years old, or up to 21 if you are in school.",
        "You have a physical disability, a developmental disability, or communication difficulties or disorders."
      ],
      "note": "A formal referral is not needed, but education or health professionals may refer you."
    },
    "applyText": "Find a Children's Treatment Centre",
    "applyUrl": "https://www.ontario.ca/page/childrens-rehabilitation-services",
    "source": "https://www.ontario.ca/page/childrens-rehabilitation-services",
    "detail": {
      "aboutList": {
        "lead": "Children's Treatment Centres and Surrey Place in Toronto offer these services.",
        "items": [
          "Physiotherapy helps restore, maintain and make the most of a child's mobility and well-being.",
          "Occupational therapy helps with self-care, productivity and leisure.",
          "Speech and language therapy helps with oral motor and communication function.",
          "SmartStart Hubs in Toronto give families one entry point to assessment and services.",
          "Family supports include respite services and parent coaching."
        ]
      },
      "steps": [
        "Find your area in the table of Children's Treatment Centres on the page.",
        "Contact your local centre, or Surrey Place in Toronto, to talk about your child's development.",
        "The centre can explain which services your child should get and how to reach them.",
        "If you already know what your child needs, you can contact providers directly."
      ],
      "documents": [
        "A formal referral is not required"
      ],
      "tips": [
        "Contact Empowered Kids Ontario (EKO) for more information about services and locations.",
        "Children from birth until school may also qualify for preschool speech and language services.",
        "You can also call your local ministry regional office for more information."
      ]
    }
  },
  {
    "id": "sk-said",
    "name": "Saskatchewan Assured Income for Disability (SAID)",
    "level": "Saskatchewan",
    "category": "Income support",
    "amount": "Monthly income; payment tiers, no set maximum",
    "summary": "Long-term monthly income for adults with a significant and enduring disability who lack the money for basic needs. Benefits vary with your situation and needs.",
    "note": "New rules started September 1, 2026. The page says no current client will see a reduction in benefits.",
    "requires": [
      "sk",
      "age18plus",
      "skSaidRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Canadian citizen, permanent resident or refugee, or here under the Canada-Ukraine authorization.",
        "You live in Saskatchewan and are 18 or older.",
        "You lack the financial resources to meet your basic needs.",
        "You have a significant and enduring disability of a permanent nature that affects daily living.",
        "The disability means you need a device, another person, a service animal or other accommodation."
      ],
      "note": "A Disability Impact Assessment is part of the application and identifies a significant and enduring disability."
    },
    "applyText": "Apply for SAID",
    "applyUrl": "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/income-support-for-people-with-disabilities",
    "source": "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/income-support-for-people-with-disabilities",
    "detail": {
      "aboutList": {
        "lead": "SAID is Saskatchewan's long-term income support for people with disabilities.",
        "items": [
          "The Living Income benefit is a fixed monthly amount that you decide how to spend.",
          "Exceptional Needs benefits help with costs like starting work or training and urgent household needs.",
          "Benefits changed on September 1, 2026, and the page lists no set maximum monthly benefit.",
          "As of April 1, 2025, yearly earned income exemptions: $7,500 single, $8,700 couple, $9,500 family.",
          "Families with children earning over $500 a month can apply for the Saskatchewan Employment Incentive."
        ]
      },
      "steps": [
        "Apply online with a Saskatchewan Account, by phone, or at your local Social Services office.",
        "Give your SIN, health number, and details of your money, property, vehicles and other benefits.",
        "Finish the direct deposit form, the mandatory service questionnaire and money details within 30 days.",
        "Complete the Disability Impact Assessment as part of the application.",
        "If you apply as a couple, your spouse or partner must apply with you."
      ],
      "documents": [
        "Social Insurance Number and Saskatchewan Health Services Number, or proof you applied",
        "Spouse, partner and children's SINs and health numbers, if they apply",
        "A rental or tenancy agreement",
        "Bank statements for all accounts in your name and your spouse's name",
        "Direct deposit authorization form"
      ],
      "tips": [
        "An online application expires if you do not submit it within 15 days of starting.",
        "If your application is denied, you have 15 days from the date on the letter to appeal.",
        "Report changes such as a new job or a move right away. You may have to repay money if you do not.",
        "Current Saskatchewan Income Support clients who want to apply for SAID should speak with their Planning and Support Specialist first.",
        "A trustee or direct payment of shelter costs may be arranged if managing money is hard."
      ],
      "time": "Allow 25 minutes or more to apply online.",
      "phone": "1-888-567-SAID (7243)"
    }
  },
  {
    "id": "sk-income-support",
    "name": "Saskatchewan Income Support (SIS)",
    "level": "Saskatchewan",
    "category": "Income support",
    "amount": "Adult basic benefit $375 a month; shelter $615 to $1,287 (rates from May 1, 2026)",
    "summary": "Monthly money for shelter and basic needs for people with no or low income. The amount depends on your spouse, children, housing costs and where you live.",
    "note": "These rates are effective May 1, 2026. Your circumstances are assessed every month, so the amount may change.",
    "requires": [
      "sk",
      "age18plus",
      "skIncomeSupportRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Canadian citizen, permanent resident or refugee, or here under the Canada Ukraine authorization.",
        "You live in Saskatchewan and are 18 or older.",
        "You and your spouse or partner have no income or low income.",
        "You have explored every other reasonable way to support yourself, including work and child support."
      ],
      "note": "The page says any person who needs financial help can apply."
    },
    "applyText": "Apply for SIS",
    "applyUrl": "https://www.saskatchewan.ca/residents/family-and-social-support/financial-help/saskatchewan-income-support-sis",
    "source": "https://www.saskatchewan.ca/residents/family-and-social-support/financial-help/saskatchewan-income-support-sis",
    "detail": {
      "aboutList": {
        "lead": "SIS helps people in need meet basic needs while they become more self-sufficient.",
        "items": [
          "Adult basic benefit is $375 a month, or $445 in the Northern Administration District.",
          "Children's basic benefit is $65 a month per child.",
          "Shelter benefit runs from $615 to $1,287 a month by household and place.",
          "Other help can include a $190 monthly heating benefit if you lack natural gas, and $50 to $150 for medical diets.",
          "Monthly earned income exemptions are $375 single, $475 couple, $500 family."
        ]
      },
      "steps": [
        "Apply online with a Saskatchewan Account, by phone, or at a Social Services office.",
        "Give your SIN, health number and details of your money, property and other benefits.",
        "Complete the mandatory questionnaire online or by phone within 30 days of applying.",
        "Send in your direct deposit form and a bank account in your name."
      ],
      "documents": [
        "Social Insurance Number and Saskatchewan Health Services Number, or proof you applied",
        "Spouse, partner and children's SINs and health numbers",
        "Pay stubs or other income information",
        "A rental agreement or other proof of where you live",
        "Direct Deposit Authorization form"
      ],
      "tips": [
        "An online application expires if you do not finish it within 15 days.",
        "Families with children earning over $500 a month can apply for the Saskatchewan Employment Incentive.",
        "The ministry may pay rent and utilities for you, or arrange a trustee, if managing money is hard.",
        "Tell the ministry about changes right away. You may have to repay money if you do not."
      ],
      "time": "Allow 25 minutes or more to apply online.",
      "phone": "1-866-221-5200"
    }
  },
  {
    "id": "sk-employment-incentive",
    "name": "Saskatchewan Employment Incentive (SEI)",
    "level": "Saskatchewan",
    "category": "Money (for parents)",
    "amount": "$400 to $600 a month, by number of eligible children",
    "summary": "A monthly payment for working families with low incomes and children. It also comes with Supplementary Health Benefits review and discounted bus passes where available.",
    "note": "The most you can get is paid when family earned income is between $500 and $2,200 a month. Over $2,200, it drops 30 cents for each extra dollar.",
    "requires": [
      "sk",
      "skEmploymentIncentiveRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Canadian citizen or permanent resident living in Saskatchewan, and you are 18 or older.",
        "You have a valid Social Insurance Number and Saskatchewan Health Services Number.",
        "You do not receive Saskatchewan Income Support or SAID benefits.",
        "You have children aged 0-12, or aged 13-17 needing child care due to special circumstances.",
        "You get the Canada Child Benefit for them, or are a Person of Sufficient Interest.",
        "Your earned income is at least $500 a month, and family income is under the limit."
      ],
      "note": "The monthly family income limit depends on how many children you have."
    },
    "applyText": "Apply for SEI",
    "applyUrl": "https://www.saskatchewan.ca/residents/family-and-social-support/financial-help/saskatchewan-employment-incentive-sei",
    "source": "https://www.saskatchewan.ca/residents/family-and-social-support/financial-help/saskatchewan-employment-incentive-sei",
    "detail": {
      "aboutList": {
        "lead": "SEI supports working families who have low incomes.",
        "items": [
          "The most you can get is $400 a month for 1 child, $500 for 2, and $600 for 3 or more.",
          "Eligible families are automatically reviewed for Supplementary Health Benefits.",
          "You can ask to hear about the Saskatchewan Housing Benefit when you apply.",
          "Discounted bus passes are sold in seven municipalities, including Regina and Saskatoon."
        ]
      },
      "steps": [
        "Sign in to a Saskatchewan Account and apply online.",
        "Attach pay stubs and other documents that verify your income.",
        "Check your status through email or text alerts from your Saskatchewan Account.",
        "Report your family income every month and tell Social Services of any changes."
      ],
      "documents": [
        "Pay stubs for all pay received in the month before you apply",
        "Self-employed: last year's Notice of Assessment, or last month's gross income if new",
        "Social Insurance Numbers",
        "Family members' Health Services Numbers",
        "Direct deposit information"
      ],
      "tips": [
        "Monthly family income limits: $3,533.34 with 1 child, $3,866.67 with 2, and $4,200.00 with 3 or more.",
        "If you have a child aged 13-17 who needs child care, submit the special circumstance child care referral form.",
        "If you receive CPP, EI, OAS, GIS, child support or rental income, you must give the amount.",
        "If you need help, send the online communication form from your SEI account.",
        "Allow about 25 minutes for the application."
      ],
      "time": "A staff member replies within five business days of a help request."
    }
  },
  {
    "id": "sk-housing-benefit",
    "name": "Saskatchewan Housing Benefit",
    "level": "Saskatchewan",
    "category": "Housing",
    "amount": "$210 to $390 a month (effective July 1, 2026)",
    "summary": "A monthly benefit for renters whose rent and utilities take a large share of their income. The amount depends on household size and the share of income spent on shelter.",
    "note": "Amounts are effective July 1, 2026. Two other streams help people in vulnerable living situations.",
    "requires": [
      "sk",
      "skHousingBenefitRoute",
      "noPostSecondaryStudents"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You rent your home and spend 35 per cent or more of before-tax household income on rent and utilities.",
        "Your household has less than $300,000 in assets.",
        "Your before-tax household income is at or below the limit for your household."
      ],
      "note": "Limits are $43,100 (single or couple), $52,900 (one dependant), $63,800 (two or more dependants) a year."
    },
    "applyText": "Apply for the Housing Benefit",
    "applyUrl": "https://www.saskatchewan.ca/residents/housing-and-renting/renting-and-leasing/saskatchewan-housing-benefit",
    "source": "https://www.saskatchewan.ca/residents/housing-and-renting/renting-and-leasing/saskatchewan-housing-benefit",
    "detail": {
      "aboutList": {
        "lead": "The benefit is co-funded by the federal and Saskatchewan governments.",
        "items": [
          "Spending 35 to 45 per cent of income on shelter: $210, $270 or $330 a month.",
          "Spending over 45 per cent: $270, $330 or $390 a month, by household size.",
          "The higher amounts apply to households with one or more dependants.",
          "A Supportive Housing Stream and a Seeking Safety from Interpersonal Violence Stream also exist."
        ]
      },
      "steps": [
        "Complete the online application, or download the PDF application. You only need one.",
        "If you use the PDF, send it with required documents by email, fax or mail.",
        "Wait for Saskatchewan Housing Corporation to contact you if it needs more information."
      ],
      "documents": [
        "The completed application",
        "The documents the application asks for"
      ],
      "tips": [
        "You are not eligible if you get shelter support from another Saskatchewan assistance or training program.",
        "You are also not eligible if you rent from a housing authority under the Social Housing Program.",
        "Sponsored newcomers, people incarcerated in a facility, and full-time post-secondary students are not eligible.",
        "Allow extra time if you apply by mail."
      ],
      "time": "If you hear nothing within 14 business days, contact the housing corporation.",
      "phone": "1-844-787-4177"
    }
  },
  {
    "id": "sk-sail",
    "name": "Saskatchewan Aids to Independent Living (SAIL)",
    "level": "Saskatchewan",
    "category": "Daily living supports",
    "amount": "Coverage for disability-related equipment and supplies",
    "summary": "Basic coverage of equipment, devices, products and supplies for people with physical disabilities and certain chronic health conditions, so they can live more actively and independently.",
    "note": "A health care professional must refer you. The page lists the specific programs and their own criteria.",
    "requires": [
      "sk",
      "equipmentNeed",
      "skSailRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Saskatchewan resident with a valid Saskatchewan Health Services Number.",
        "An authorized health care professional refers you for service.",
        "You use a service in Saskatchewan, unless Saskatchewan Health pre-authorizes otherwise.",
        "You do not get benefits from other agencies such as SGI, WCB, Health Canada or Veterans Affairs."
      ]
    },
    "applyText": "See SAIL programs",
    "applyUrl": "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/saskatchewan-aids-to-independent-living",
    "source": "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/saskatchewan-aids-to-independent-living",
    "detail": {
      "aboutList": {
        "lead": "SAIL helps people with physical disabilities and some chronic conditions.",
        "items": [
          "Universal programs include prosthetics and orthotics, mobility and assistive devices, and respiratory equipment.",
          "Other universal programs cover nutritional products, home oxygen, CPAP loans and compression garments.",
          "Special programs include Paraplegia, Cystic Fibrosis, Ostomy, Haemophilia and the Insulin Pump Program.",
          "Special programs also cover Chronic End-Stage Renal Disease and Aids to the Blind."
        ]
      },
      "steps": [
        "Ask an authorized health care professional about a referral.",
        "Check the SAIL General Policies and the criteria for the program you need.",
        "Contact SAIL to ask about your program."
      ],
      "documents": [
        "Valid Saskatchewan Health Services Number",
        "Referral from an authorized health care professional"
      ],
      "tips": [
        "Special benefit programs have their own eligibility criteria.",
        "The page does not say how to submit a claim, so contact SAIL to ask how your program works."
      ],
      "phone": "1-888-787-8996"
    }
  },
  {
    "id": "sk-supplementary-health",
    "name": "Supplementary Health Benefits",
    "level": "Saskatchewan",
    "category": "Health",
    "amount": "Adults pay up to $2 per prescription; dental, vision, hearing, foot care",
    "summary": "Health services and products beyond basic coverage for people on SAID, Saskatchewan Income Support or the Employment Incentive, and some other groups.",
    "note": "The Ministry of Health sends a letter confirming approval. Payments go straight to providers.",
    "requires": [
      "sk",
      "skSupplementaryHealthRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You are enrolled in SAID, Saskatchewan Income Support or the Saskatchewan Employment Incentive.",
        "You are a government ward or an inmate of a provincial correctional institution.",
        "You live in a special care facility and qualify for the Seniors Income Plan."
      ],
      "note": "Covered services depend on your plan and often need prior approval."
    },
    "applyText": "See how coverage works",
    "applyUrl": "https://www.saskatchewan.ca/residents/health/prescription-drug-plans-and-health-coverage/extended-benefits-and-drug-plan/supplementary-health-benefits",
    "source": "https://www.saskatchewan.ca/residents/health/prescription-drug-plans-and-health-coverage/extended-benefits-and-drug-plan/supplementary-health-benefits",
    "detail": {
      "aboutList": {
        "lead": "This program pays for health services not covered by basic health insurance.",
        "items": [
          "Adults on Plan One pay no more than $2 for each benefit prescription.",
          "Under-18s get benefit prescriptions free, including insulin and diabetes pills.",
          "Dental, eye exam, glasses, hearing, podiatry and emergency ambulance services are covered.",
          "Adults able to work get emergency dental only for six months, then full benefits."
        ]
      },
      "steps": [
        "Enrol in a qualifying program such as SAID, SIS or SEI.",
        "Wait for the Ministry of Health letter confirming approval.",
        "Show your Saskatchewan Health card to the provider."
      ],
      "documents": [
        "Valid Saskatchewan Health card or temporary health coverage form"
      ],
      "tips": [
        "Many medical supplies need a prescription and prior approval.",
        "Hearing aid replacement has a 30 per cent co-payment for clients over 20.",
        "Coverage does not normally extend outside Saskatchewan without prior approval.",
        "Questions about SAID or SIS can go to the Ministry of Social Services."
      ],
      "phone": "1-800-266-0695"
    }
  },
  {
    "id": "sk-family-health-benefits",
    "name": "Family Health Benefits",
    "level": "Saskatchewan",
    "category": "Health (for children)",
    "amount": "Children's dental, eye care, drugs; limited cover for parents",
    "summary": "Health benefits for low-income working families who pass an income test. They help pay for several health services for children and some for parents.",
    "note": "The Ministry of Social Services decides eligibility. Call for a pre-assessment.",
    "requires": [
      "sk",
      "skFamilyHealthBenefitsRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a low-income working family.",
        "You meet the standards of an income test."
      ],
      "note": "The page does not list income limits."
    },
    "applyText": "Learn about Family Health Benefits",
    "applyUrl": "https://www.saskatchewan.ca/residents/health/prescription-drug-plans-and-health-coverage/extended-benefits-and-drug-plan/family-health-benefits",
    "source": "https://www.saskatchewan.ca/residents/health/prescription-drug-plans-and-health-coverage/extended-benefits-and-drug-plan/family-health-benefits",
    "detail": {
      "aboutList": {
        "lead": "Children are covered for most dental services and more.",
        "items": [
          "Children get eye exams once a year and basic eyeglasses.",
          "Children get emergency ambulance, basic medical supplies and Saskatchewan Formulary drugs.",
          "Parents get an eye exam every two years.",
          "Parents have drug coverage with a $100 semi-annual family deductible and 35 per cent co-payment."
        ]
      },
      "steps": [
        "Call the Ministry of Social Services to complete a pre-assessment.",
        "Present your Saskatchewan Health Services card for any health service."
      ],
      "documents": [
        "Saskatchewan Health Services card"
      ],
      "tips": [
        "Some basic medical supplies for children need prior approval.",
        "Parents or legal guardians may apply for more cover under the Special Support program."
      ],
      "phone": "1-888-488-6385"
    }
  },
  {
    "id": "sk-special-support",
    "name": "Special Support Program (drug costs)",
    "level": "Saskatchewan",
    "category": "Health",
    "amount": "Deductible and copayment set by family income and drug costs",
    "summary": "A voluntary, income-tested program that helps with prescription drug costs in relation to your income. Coverage is set for a calendar year.",
    "note": "Coverage begins when the Drug Plan receives your complete application with income documents.",
    "requires": [
      "sk",
      "skSpecialSupportRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "The Ministry of Health decides eligibility from your drug history and total income (line 15000).",
        "Families on GIS, the Seniors Income Plan or Family Health Benefits, or with the Seniors' Drug Plan, may apply.",
        "Other residents can be assessed too; the Ministry of Health decides from drug history and income."
      ],
      "note": "People covered by federal programs, such as Non-Insured Health Benefits or Veterans Affairs, are not eligible."
    },
    "applyText": "Apply for Special Support",
    "applyUrl": "https://www.saskatchewan.ca/residents/health/prescription-drug-plans-and-health-coverage/extended-benefits-and-drug-plan/drug-cost-assistance",
    "source": "https://www.saskatchewan.ca/residents/health/prescription-drug-plans-and-health-coverage/extended-benefits-and-drug-plan/drug-cost-assistance",
    "detail": {
      "aboutList": {
        "lead": "You pay for Formulary or Exception Drug Status drugs by a deductible and copayment.",
        "items": [
          "The deductible is based on total family income.",
          "The copayment is based on family income and total family drug costs.",
          "You can estimate both with the Special Support Estimate Calculator.",
          "You pay the lesser amount if another drug program charges less."
        ]
      },
      "steps": [
        "Choose Side A to let the CRA share your income, or Side B to send income documents yourself.",
        "Mail, fax or email the form to the Special Support Program.",
        "Wait for the confirmation of benefits letter."
      ],
      "documents": [
        "Special Support application form, Side A or Side B",
        "Income documentation, if you use Side B"
      ],
      "tips": [
        "Side A renews coverage automatically each year if you file your income tax return.",
        "Side B users must reapply each year. A renewal form is mailed in the fall.",
        "Ask your physician or pharmacist if your drugs may qualify for Exception Drug Status.",
        "You may ask for a reassessment in writing if your income or drug costs change."
      ],
      "phone": "1-800-667-7581"
    }
  },
  {
    "id": "sk-seniors-drug-plan",
    "name": "Seniors' Drug Plan",
    "level": "Saskatchewan",
    "category": "Health",
    "amount": "$25 per eligible prescription",
    "summary": "Eligible seniors 65 and older pay $25 for prescriptions on the Saskatchewan Formulary or approved under Exception Drug Status.",
    "note": "You pay the lesser amount if another program, such as Special Support, charges less.",
    "requires": [
      "sk",
      "age65plus",
      "skSeniorsDrugPlanRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Saskatchewan resident aged 65 or older with a valid Saskatchewan Health card.",
        "You qualify for the provincial age credit, based on net income (line 23600).",
        "Your net income is $81,633 or less on your 2025 return, for 2027 coverage."
      ],
      "note": "Seniors covered by federal programs, such as Non-Insured Health Benefits or Veterans Affairs, are not eligible."
    },
    "applyText": "Apply for the Seniors' Drug Plan",
    "applyUrl": "https://www.saskatchewan.ca/residents/health/accessing-health-care-services/seniors-drug-plan",
    "source": "https://www.saskatchewan.ca/residents/health/accessing-health-care-services/seniors-drug-plan",
    "detail": {
      "aboutList": {
        "lead": "The plan caps what you pay for each eligible prescription.",
        "items": [
          "Drugs must be on the Saskatchewan Formulary or have Exception Drug Status.",
          "GIS clients keep a $200 and SIP clients a $100 semi-annual deductible, then a 35 per cent copayment.",
          "There is no change for people with SAIL, palliative care, or SIP in long-term care."
        ]
      },
      "steps": [
        "Choose Form A to let the CRA share your income, or Form B to send income documents.",
        "Mail, fax or email the form to the Seniors' Drug Plan.",
        "Wait for the confirmation of benefits letter."
      ],
      "documents": [
        "Seniors' Drug Plan application form, Form A or Form B",
        "Income documentation, if you use Form B"
      ],
      "tips": [
        "You can apply up to two months before you turn 65.",
        "If you apply before turning 65, coverage starts the first day of that birthday month.",
        "Form A renews coverage automatically if you file your tax return each year.",
        "Ask your physician or pharmacist about Exception Drug Status."
      ],
      "phone": "1-800-667-7581"
    }
  },
  {
    "id": "sk-seniors-income-plan",
    "name": "Seniors Income Plan (SIP)",
    "level": "Saskatchewan",
    "category": "Income support",
    "amount": "Up to $360 a month at home (rates effective July 1, 2023)",
    "summary": "A monthly benefit for seniors who have little or no income other than Old Age Security and the Guaranteed Income Supplement. No application is needed.",
    "note": "Income cut-off levels are as of October 1, 2026. Maximum rates are effective July 1, 2023.",
    "requires": [
      "sk",
      "age65plus",
      "skSeniorsIncomePlanRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are 65 or older and a permanent resident of Saskatchewan.",
        "You receive full or partial OAS pension and GIS.",
        "Your annual income is below a specified level."
      ],
      "note": "Assets, OAS and GIS are not counted when judging eligibility."
    },
    "applyText": "Learn about SIP",
    "applyUrl": "https://www.saskatchewan.ca/residents/family-and-social-support/seniors-services/seniors-income-plan",
    "source": "https://www.saskatchewan.ca/residents/family-and-social-support/seniors-services/seniors-income-plan",
    "detail": {
      "aboutList": {
        "lead": "SIP tops up income for seniors who rely on OAS and GIS.",
        "items": [
          "A single person at home gets up to $360 a month (rates effective July 1, 2023).",
          "A married couple, both on OAS/GIS, gets up to $325 a month (rates effective July 1, 2023).",
          "In a special care home, the maximum is $50 a month (rates effective July 1, 2023).",
          "SIP ends at $4,560 yearly taxable income, not counting OAS/GIS, for a single person at home (Oct 1, 2026)."
        ]
      },
      "steps": [
        "File your income tax return each year.",
        "Apply for OAS and GIS through Service Canada.",
        "SIP is paid automatically if you qualify."
      ],
      "documents": [
        "Income tax return",
        "OAS/GIS application"
      ],
      "tips": [
        "If you get the maximum GIS, you also get the maximum SIP.",
        "More income lowers your GIS and SIP.",
        "Eligibility is reassessed each year in July.",
        "SIP clients with Saskatchewan Health coverage get extra health benefits.",
        "Status Indian clients get health coverage from Health Canada."
      ],
      "phone": "1-800-667-7161"
    }
  },
  {
    "id": "sk-autism-individualized-funding",
    "name": "Autism Spectrum Disorder Individualized Funding (ASD-IF)",
    "level": "Saskatchewan",
    "category": "Health (for children)",
    "amount": "Up to $8,000 a year under age 6; up to $6,000 a year ages 6 to 11",
    "summary": "Gives parents money each year to buy therapy and family supports for a child with an autism diagnosis. Up to $8,000 under age six, and up to $6,000 for ages six to 11.",
    "note": "You choose from a list of approved services and expenses, then send in proof of what you spent.",
    "requires": [
      "sk",
      "child",
      "autismSelected",
      "skAutismIndividualizedFundingRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "Your child has a diagnosis of Autism Spectrum Disorder (ASD).",
        "Your child is under age 12.",
        "You can show proof of Saskatchewan residency."
      ],
      "note": "Only one parent can apply; out-of-province diagnoses need Saskatchewan Health Authority review."
    },
    "applyText": "Apply online for ASD-IF",
    "applyUrl": "https://www.saskatchewan.ca/residents/health/accessing-health-care-services/health-services-for-people-with-disabilities/autism-services",
    "source": "https://www.saskatchewan.ca/residents/health/accessing-health-care-services/health-services-for-people-with-disabilities/autism-services",
    "detail": {
      "aboutList": {
        "lead": "ASD-IF pays for services that suit your child, chosen by you.",
        "items": [
          "You pick from approved therapies and family supports.",
          "Funding is up to $8,000 a year under age six.",
          "Funding is up to $6,000 a year for ages six to 11.",
          "A registry lists autism service providers near you."
        ]
      },
      "steps": [
        "If you think your child may have ASD, contact a local autism program to arrange an assessment.",
        "Gather your documents and apply online.",
        "Once approved, send proof of expenses with the Submit an Expense Online form.",
        "Renew each year, after sending all proof of expenses for the previous year."
      ],
      "documents": [
        "Social Insurance Numbers",
        "Your child's Health Services Number",
        "Proof of Saskatchewan residency (SGI photo ID, SaskPower, SaskEnergy or a utility bill from the last three months)",
        "ASD Diagnostic Form",
        "Direct Deposit Payment Request Form"
      ],
      "tips": [
        "Check the List of Eligible Services and Expenses before you spend.",
        "Tell the Ministry of Social Services right away if your address or bank details change.",
        "Private providers set their own fees, so ask them for rates."
      ],
      "phone": "1-833-304-1774"
    }
  },
  {
    "id": "sk-cognitive-disability-strategy",
    "name": "Cognitive Disability Strategy (CDS) Support",
    "level": "Saskatchewan",
    "category": "Daily living supports",
    "amount": "Income-tested benefit; amount set by need and disability impact",
    "summary": "Offers behaviour-support help and an income-tested money benefit to people with a cognitive disability, or their families, who have an unmet need. The benefit amount is not published.",
    "note": "The page does not give a dollar amount. It depends on financial need and the assessed effect of the disability.",
    "requires": [
      "sk",
      "skCognitiveDisability",
      "skCognitiveDisabilityStrategyRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have a cognitive disability.",
        "You have an unmet need linked to the disability.",
        "An evidence-based intervention could meet that need.",
        "No other system can support the need."
      ],
      "note": "The disability must be long-term and present from an early age, except for an acquired brain injury."
    },
    "applyText": "Apply to the Cognitive Disability Strategy",
    "applyUrl": "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/financial-help-and-support-for-people-with-cognitive-disabilities",
    "source": "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/financial-help-and-support-for-people-with-cognitive-disabilities",
    "detail": {
      "aboutList": {
        "lead": "CDS helps people with cognitive disabilities and their families.",
        "items": [
          "Cognitive Disability Consultants help families make behaviour support plans.",
          "The Cognitive Disability Benefit is income-tested money for an unmet need.",
          "Benefit levels depend on financial need and assessed disability impact."
        ]
      },
      "steps": [
        "Download the application package.",
        "Send the form to the Cognitive Disability Consultant.",
        "Or ask someone who works with you, like a case worker, to help.",
        "If you have no case worker, the consultant can help you fill it in."
      ],
      "documents": [
        "Cognitive Disability Strategy application package",
        "Renewal package, when you renew"
      ],
      "tips": [
        "Call the provincial office if you are unsure where to start."
      ],
      "phone": "1-833-304-1774"
    }
  },
  {
    "id": "sk-family-respite-intellectual-disability",
    "name": "Family Respite Benefit (child with an intellectual disability)",
    "level": "Saskatchewan",
    "category": "Home support",
    "amount": "Monthly income-tested benefit; amount set by need and disability impact",
    "summary": "Pays parents or guardians a monthly amount to arrange short-term care for a child under 18 with an intellectual disability. It gives caregivers a break. The amount depends on need.",
    "note": "The benefit is income-tested, and the page gives no dollar amounts. You work with Community Living Service Delivery on a respite plan.",
    "requires": [
      "sk",
      "child",
      "intellectualDisability",
      "skFamilyRespiteIntellectualDisabilityRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Saskatchewan resident.",
        "Your child under age 18 lives in your family home.",
        "Your child is accepted for Community Living Service Delivery (CLSD) services.",
        "You meet the financial eligibility criteria."
      ],
      "note": "You must agree to an annual income test, an annual review and to use the benefit for respite care."
    },
    "applyText": "Contact your nearest CLSD office",
    "applyUrl": "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/temporary-help-for-families-caring-for-a-child-with-intellectual-disabilities",
    "source": "https://www.saskatchewan.ca/residents/family-and-social-support/people-with-disabilities/temporary-help-for-families-caring-for-a-child-with-intellectual-disabilities",
    "detail": {
      "aboutList": {
        "lead": "Respite gives caregivers a short-term break from daily care of a child.",
        "items": [
          "The benefit is paid monthly.",
          "Levels depend on financial need and assessed disability impact.",
          "It pays for short-term extra or alternative supervision and care.",
          "You cannot pay yourself or use it for work-related child care."
        ]
      },
      "steps": [
        "Contact the nearest Community Living Service Delivery office.",
        "Complete the application and sign the declaration.",
        "Take part in the child and family assessments.",
        "Agree to income checks with the Canada Revenue Agency.",
        "Work with CLSD on your respite plan."
      ],
      "documents": [
        "Signed application with declaration",
        "Consent to income verification using your Notice of Assessment",
        "You may be asked to provide records"
      ],
      "tips": [
        "Expect two assessments: the child's support needs and the family impact.",
        "Report any change in your circumstances."
      ],
      "phone": "1-833-304-1774"
    }
  },
  {
    "id": "sk-home-care",
    "name": "Home Care and Individualized Funding for Home Care",
    "level": "Saskatchewan",
    "category": "Home support",
    "amount": "Services based on assessed need; fees based on income",
    "summary": "The Saskatchewan Health Authority provides home care, such as nursing, homemaking and meals, based on assessed need. Some services have fees based on income, and you can apply for a subsidy.",
    "note": "Individualized funding lets you arrange and manage your own support services if you are assessed as eligible.",
    "requires": [
      "sk",
      "skHomeCareRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You need home care and the health authority assesses your need for services.",
        "For individualized funding, you must be eligible for home care support services and need long-term supportive care.",
        "For individualized funding, you must also be able to manage the funding and willing to accept the responsibilities."
      ],
      "note": "The health authority decides your services and funding level after an assessment."
    },
    "applyText": "Contact your Saskatchewan Health Authority home care program",
    "applyUrl": "https://www.saskatchewan.ca/residents/health/accessing-health-care-services/care-at-home-and-outside-the-hospital/home-care",
    "source": "https://www.saskatchewan.ca/residents/health/accessing-health-care-services/care-at-home-and-outside-the-hospital/home-care",
    "detail": {
      "aboutList": {
        "lead": "Home care helps people stay independent at home.",
        "items": [
          "Services include assessment, nursing, homemaking, personal care, respite and meals.",
          "Nursing assessment, therapy and volunteer services are free to clients.",
          "Fees for some services depend on your income and services used.",
          "Individualized funding does not cover nursing or therapies."
        ]
      },
      "steps": [
        "Contact the Saskatchewan Health Authority Home Care Program in your community.",
        "They assess your care needs.",
        "They set the type of service and funding level.",
        "For individualized funding, sign an agreement with the health authority."
      ],
      "documents": [
        "Signed individualized funding agreement, if you choose that option"
      ],
      "tips": [
        "Individualized funding means you hire, schedule and pay staff yourself.",
        "You must have a backup care plan that does not rely on home care.",
        "Hiring family members is not permitted."
      ]
    }
  },
  {
    "id": "sk-adaptations-for-independence",
    "name": "Home Repair Program - Adaptations for Independence",
    "level": "Saskatchewan",
    "category": "Home",
    "amount": "Forgivable loan of up to $23,000",
    "summary": "A forgivable loan of up to $23,000 to make a home more accessible for a person with a housing-related disability. For owners with low incomes, and rental owners who rent to low-income households.",
    "note": "Repairs done before written approval do not qualify. Work must be finished within six months of approval.",
    "requires": [
      "sk",
      "skAdaptationsForIndependenceRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You own and live in the home, and a household member has a housing-related disability.",
        "Or you rent the modified units to low-income households that include a person with that disability.",
        "Household income and assets are at or below the limits set by Saskatchewan Housing Corporation."
      ],
      "note": "Income and rent limits are dated July 1, 2026; a health practitioner must identify the changes."
    },
    "applyText": "Send the Repair and Renovation Application Form",
    "applyUrl": "https://www.saskatchewan.ca/residents/housing-and-renting/home-repairs-and-renovations/adapt-a-home-for-a-person-with-a-disability",
    "source": "https://www.saskatchewan.ca/residents/housing-and-renting/home-repairs-and-renovations/adapt-a-home-for-a-person-with-a-disability",
    "detail": {
      "aboutList": {
        "lead": "This program helps pay to make a home accessible.",
        "items": [
          "The loan is forgivable and up to $23,000.",
          "Homeowner income maximums by bedrooms: $58,100, $71,300, $86,300, $103,500 (July 1, 2026).",
          "The asset level is $300,000 for all households.",
          "Rental monthly maximum rents: $1,262, $1,550, $1,875, $2,250 (July 1, 2026)."
        ]
      },
      "steps": [
        "Download the Homeowner or Rental application form.",
        "Complete it and mail, deliver or email it to Saskatchewan Housing Corporation.",
        "Wait for written approval before any work starts.",
        "Finish the work within six months of approval."
      ],
      "documents": [
        "Completed Repair and Renovation Application Form",
        "Modifications identified by a qualified health practitioner",
        "Required supporting documents listed on the form"
      ],
      "tips": [
        "You pay any costs above the approved amount.",
        "Liens or judgments on the property title can affect eligibility."
      ],
      "phone": "1-800-667-7567"
    }
  },
  {
    "id": "sk-eapd",
    "name": "Employability Assistance for Persons with Disabilities (EAPD)",
    "level": "Saskatchewan",
    "category": "Employment",
    "amount": "Funding for disability-related costs; no amount published",
    "summary": "Pays for disability-related supports that help you prepare for, find and keep work, or take needed training or education. Employers hiring you may also get help with accommodation costs.",
    "note": "The page gives no dollar amount. Funding covers disability-related costs only.",
    "requires": [
      "sk",
      "age16plus",
      "skEapdRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You need specialized supports because of a disability to prepare for, get or keep work.",
        "You are legally entitled to work in Canada and Saskatchewan.",
        "You are at least 16 years of age.",
        "You will give a self-declaration of your disability.",
        "You will develop an approved career action plan or service plan."
      ],
      "note": "The disability may be learning, developmental, mental health, physical or other, as you declare it."
    },
    "applyText": "Contact SaskJobs Career Services",
    "applyUrl": "https://www.saskatchewan.ca/residents/jobs-working-and-training/job-training-and-financial-support-programs/employability-assistance-for-persons-with-disabilities",
    "source": "https://www.saskatchewan.ca/residents/jobs-working-and-training/job-training-and-financial-support-programs/employability-assistance-for-persons-with-disabilities",
    "detail": {
      "aboutList": {
        "lead": "EAPD helps people with disabilities move into work.",
        "items": [
          "It funds supports to take part in training or education for work.",
          "It funds supports to get and keep a job.",
          "Funding may pay for an assessment of your disability's impact.",
          "Employers may get help with costs like job coaching and technical supports."
        ]
      },
      "steps": [
        "Contact SaskJobs Career Services to learn about the program.",
        "Get your career action plan or service plan approved.",
        "The plan lists your career goals and needed supports."
      ],
      "documents": [
        "Self-declaration of disability",
        "Approved career action plan or service plan"
      ],
      "tips": [
        "Funding is for disability-related costs only."
      ],
      "phone": "1-833-613-0485"
    }
  },
  {
    "id": "sk-personal-care-home-benefit",
    "name": "Personal Care Home Benefit (PCHB)",
    "level": "Saskatchewan",
    "category": "Money",
    "amount": "Monthly top-up to a $3,500 monthly income threshold",
    "summary": "A monthly payment for seniors who live in a licensed personal care home. It is the difference between a $3,500 monthly income threshold and your monthly income.",
    "note": "Married or common-law applicants give both incomes, and half of the combined household income is counted.",
    "requires": [
      "sk",
      "age65plus",
      "skPersonalCareHomeBenefitRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are 65 years of age or older.",
        "You are a Saskatchewan resident.",
        "You live in a Saskatchewan licensed personal care home.",
        "You receive an Old Age Security pension.",
        "Your monthly income is below specified levels."
      ],
      "note": "Approved clients do not re-apply every year but must send income documents before September."
    },
    "applyText": "Send the Personal Care Home Benefit application",
    "applyUrl": "https://www.saskatchewan.ca/residents/family-and-social-support/seniors-services/seniors-living-in-personal-care-homes",
    "source": "https://www.saskatchewan.ca/residents/family-and-social-support/seniors-services/seniors-living-in-personal-care-homes",
    "detail": {
      "aboutList": {
        "lead": "PCHB helps with the cost of living in a licensed personal care home.",
        "items": [
          "The amount depends on your income and marital status.",
          "Benefits are paid from the date the ministry receives your application.",
          "You have up to 60 days to send your documents.",
          "Recipients send income documents before the next benefit year starts."
        ]
      },
      "steps": [
        "Review the Application Guide and the list of licensed personal care homes.",
        "Download and complete the application form.",
        "Send documents within 60 days to the Client Service Centre in Regina.",
        "By mail, email or fax; contact details are on the application page."
      ],
      "documents": [
        "Signed application form",
        "Direct deposit form",
        "GIS Entitlement letter, or most recent tax return and a bank statement showing OAS/GIS deposit",
        "Responsible Person Consent Form (if required)",
        "Confirmation of Admission Form (if required)"
      ],
      "tips": [
        "Apply as soon as you meet the eligibility rules.",
        "A spouse sends their own GIS letter or tax return and bank statement, if applicable."
      ],
      "phone": "1-855-544-7242"
    }
  },
  {
    "id": "sk-accessible-parking",
    "name": "Accessible Parking Program (SaskAbilities)",
    "level": "Saskatchewan",
    "category": "Daily living supports",
    "amount": "$10 fee each time a permit is issued",
    "summary": "A parking permit for people who cannot walk more than 50 metres unassisted without great difficulty or danger. It lets you use accessible parking spaces in any vehicle you ride in.",
    "note": "SaskAbilities runs the program. A health professional must confirm the medical details on the first application.",
    "requires": [
      "sk",
      "bcParkingMobility"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You cannot walk unassisted more than 50 metres without great difficulty or danger to your health and safety."
      ],
      "note": "Legally blind people are also eligible, and no driver's licence is needed if you meet the medical criteria."
    },
    "applyText": "Complete the parking permit application",
    "applyUrl": "https://www.saskabilities.ca/services/independent-living/accessible-parking/",
    "source": "https://www.saskabilities.ca/services/independent-living/accessible-parking/",
    "detail": {
      "aboutList": {
        "lead": "The permit lets you park in accessible spaces.",
        "items": [
          "The permit is used in any vehicle carrying the permit holder.",
          "It can only be used when the holder enters or exits the vehicle.",
          "Other provinces and territories will recognize the permit, but you must follow local rules there.",
          "Each person gets one permit."
        ]
      },
      "steps": [
        "Fill in Section 1 in the name of the person with the disability.",
        "Ask a chiropractor, nurse practitioner, occupational therapist, physical therapist or physician to fill in Section 2.",
        "Mail it to the Saskatoon office, or bring it to a SaskAbilities location, with the $10 fee."
      ],
      "documents": [
        "Application form with your signature and your health professional's original signature",
        "$10 permit fee"
      ],
      "tips": [
        "Emailed and faxed forms are not accepted.",
        "The health professional may charge their own fee to complete the form.",
        "Permanent permit holders can renew by filling in Section 1 only.",
        "If you are denied, you can appeal in writing within 30 days."
      ],
      "phone": "306.385.7213"
    }
  },
  {
    "id": "sk-active-families-benefit",
    "name": "Active Families Benefit",
    "level": "Saskatchewan",
    "category": "Money (for parents)",
    "amount": "Up to $300 per child, or up to $400 per child who qualifies for the federal Disability Tax Credit (2025 and later)",
    "summary": "A refundable provincial tax benefit toward sport, recreation and culture fees for your child. The amount is higher for a child eligible for the federal Disability Tax Credit.",
    "note": "For 2024 and earlier, it was up to $150 per child, or $200 if eligible for the Disability Tax Credit, with income of $60,000 or less.",
    "requires": [
      "sk",
      "skActiveFamiliesBenefitRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are the parent or legal guardian of a child 18 or younger at the end of the tax year.",
        "Your family's adjusted income is $120,000 or less.",
        "Your child took part in an eligible sport, recreation or culture program."
      ],
      "note": "If parents live apart, only the parent who mainly cares for the child can claim."
    },
    "applyText": "Claim it on your Saskatchewan income tax return",
    "applyUrl": "https://www.saskatchewan.ca/residents/parks-culture-heritage-and-sport/sport-and-recreation/programs-and-supports/active-families-benefit",
    "source": "https://www.saskatchewan.ca/residents/parks-culture-heritage-and-sport/sport-and-recreation/programs-and-supports/active-families-benefit",
    "detail": {
      "aboutList": {
        "lead": "The benefit helps with registration or membership fees for a child's activity.",
        "items": [
          "Up to $400 per child if your child qualifies for the Disability Tax Credit.",
          "The activity must include instruction and supervision.",
          "The activity must need registration and a paid registration or membership fee.",
          "The provider must be located in Saskatchewan."
        ]
      },
      "steps": [
        "File your Saskatchewan personal income tax return for the year you are claiming.",
        "Complete the Active Families Benefit section when you file.",
        "Keep your receipts for six years in case you are asked to check your claim."
      ],
      "documents": [
        "Receipts for registration or membership fees (keep them; do not send them with your return)"
      ],
      "tips": [
        "Claim the fee in the year you pay it, not the year the activity takes place.",
        "Only one parent can claim a child in a tax year, and each expense only once.",
        "Equipment, uniforms, school-curriculum or child-care-hours activities, and fees paid with fundraising credits are not covered.",
        "For help with the form, call the Canada Revenue Agency at 1-800-387-1193."
      ],
      "phone": "306-798-9043"
    }
  },
  {
    "id": "sk-low-income-tax-credit",
    "name": "Saskatchewan Low-Income Tax Credit",
    "level": "Saskatchewan",
    "category": "Money & taxes",
    "amount": "Up to $1,196 a year for families earning less than $38,590 (July 1, 2025 to June 30, 2026)",
    "summary": "A refundable, non-taxable payment for Saskatchewan residents with low and modest incomes. You do not need to pay income tax to get it. There is no application.",
    "note": "The benefit is reduced by 2.88 per cent of family net income above $38,590. Amounts are indexed to inflation each year.",
    "requires": [
      "sk",
      "skLowIncomeTaxCreditRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You file an income tax return as a Saskatchewan resident.",
        "You meet the income and family criteria.",
        "The Canada Revenue Agency decides if you are entitled."
      ],
      "note": "You do not need to owe income tax to get the credit."
    },
    "applyText": "File your income tax return; the CRA decides",
    "applyUrl": "https://www.saskatchewan.ca/residents/taxes-and-investments/tax-credits/low-income-tax-credit",
    "source": "https://www.saskatchewan.ca/residents/taxes-and-investments/tax-credits/low-income-tax-credit",
    "detail": {
      "aboutList": {
        "lead": "For July 1, 2025 to June 30, 2026, the maximum amounts are:",
        "items": [
          "$429 each for the basic adult and the spousal or equivalent component.",
          "$169 per child, to a maximum of $338 per family.",
          "Up to $1,196 a year for families earning less than $38,590."
        ]
      },
      "steps": [
        "File your income tax and benefit return.",
        "The CRA works out if you are entitled and tells you.",
        "The CRA pays the credit every three months."
      ],
      "documents": [
        "Your income tax and benefit return"
      ],
      "tips": [
        "There is no need to apply for this credit.",
        "It is paid with the federal Goods and Services Tax Credit."
      ],
      "phone": "1-800-959-8281"
    }
  },
  {
    "id": "sk-early-childhood-intervention",
    "name": "Early Childhood Intervention Program (ECIP)",
    "level": "Saskatchewan",
    "category": "Health (for children)",
    "amount": "Home-based services (no cost stated)",
    "summary": "Home-based specialized services for families of children with a developmental delay or disability, or at risk of one. No diagnosis is needed to start.",
    "note": "ECIP is delivered in 14 regions by 12 community organizations and two school divisions.",
    "requires": [
      "sk",
      "under6"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "Your child has a developmental delay or disability.",
        "Your child may be at risk of a developmental delay."
      ],
      "note": "Delays may be cognitive, physical, social, emotional or in communication."
    },
    "applyText": "Contact your regional ECIP",
    "applyUrl": "https://www.saskatchewan.ca/residents/family-and-social-support/child-care/community-programs-for-families-with-young-children",
    "source": "https://www.saskatchewan.ca/residents/family-and-social-support/child-care/community-programs-for-families-with-young-children",
    "detail": {
      "aboutList": {
        "lead": "Services include:",
        "items": [
          "Child assessment and developmental strategies.",
          "Information and case co-ordination.",
          "Transition support and referrals."
        ]
      },
      "steps": [
        "Find your region on the official page.",
        "Call your regional ECIP to refer your child.",
        "A health care professional or educator can refer your child, with your consent."
      ],
      "documents": [
        "No diagnosis is needed to start"
      ],
      "tips": [
        "You can start as soon as you notice a delay, even from birth.",
        "The program gives you activities to do at home and connects you to services as your child moves into school or other programming."
      ]
    }
  },
  {
    "id": "sk-cochlear-processor",
    "name": "Cochlear Implant Processor Replacement Program",
    "level": "Saskatchewan",
    "category": "Health",
    "amount": "You pay an $840 co-pay per processor; the program is cost-shared",
    "summary": "Help toward the cost of a replacement external sound processor for a cochlear implant, for children and adults. You pay an $840 co-pay per processor.",
    "note": "Meant for people without coverage through other programs. Typical replacement is once every five to seven years, or the processor's lifespan.",
    "requires": [
      "sk",
      "hearingDisability",
      "skCochlearProcessorRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have a valid Saskatchewan health card.",
        "Your sound processor was provided through the Saskatchewan Health Authority (used to set priority).",
        "You meet the clinical indicators for a replacement."
      ],
      "note": "Clients are prioritized by greatest need; people with no sound are a priority."
    },
    "applyText": "Contact the Saskatchewan Health Authority",
    "applyUrl": "https://www.saskatchewan.ca/residents/health/accessing-health-care-services/audiology-and-hearing-services",
    "source": "https://www.saskatchewan.ca/residents/health/accessing-health-care-services/audiology-and-hearing-services",
    "detail": {
      "aboutList": {
        "lead": "Priority is based on these criteria:",
        "items": [
          "Your current processor is within the five to seven year replacement time.",
          "Your current processor has been deemed obsolete by the manufacturer.",
          "Wanting newer technology while your processor works is not covered."
        ]
      },
      "steps": [
        "Contact the Saskatchewan Health Authority about a processor replacement.",
        "Clients must meet the clinical indicators and are assessed based on greatest need."
      ],
      "documents": [
        "Valid Saskatchewan health card"
      ],
      "tips": [
        "Implants other than cochlear implants are not covered.",
        "The program started on December 1, 2022.",
        "The program is administered by the Saskatchewan Health Authority under the direction of the Ministry of Health."
      ]
    }
  },
  {
    "id": "regina-affordable-access",
    "name": "Affordable Access Program (Regina)",
    "level": "Regina",
    "category": "Recreation",
    "amount": "50% to 80% off recreation; 20% off transit passes",
    "summary": "Regina residents with a household income under set limits get reduced rates on recreation programs and on adult and youth transit passes.",
    "note": "Approval lasts until the end of each year. You must re-apply every year.",
    "requires": [
      "sk",
      "regina",
      "reginaAffordableAccessRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "Your household income is under the limit for your household size."
      ],
      "note": "Limits for 1 to 4 people: $27,478, $34,206, $42,053 and $51,058 (larger sizes on the page)."
    },
    "applyText": "Fill out the application form and include income verification.",
    "applyUrl": "https://www.regina.ca/parks-recreation-culture/classes-programs/affordable-access-program/",
    "source": "https://www.regina.ca/parks-recreation-culture/classes-programs/affordable-access-program/",
    "detail": {
      "aboutList": {
        "lead": "Once approved, you get:",
        "items": [
          "Single admissions at 50 per cent off the regular price.",
          "Leisure Passes at 80 per cent off the regular price.",
          "Class registration at 80 per cent off, up to $160 off per family member.",
          "Adult and Youth transit passes at 20 per cent off the regular price."
        ]
      },
      "steps": [
        "Fill out the Affordable Access Program Application Form.",
        "Add the required income verification.",
        "Submit it in person at the North West Leisure Centre, Sportplex or Sandra Schmirler Leisure Centre, or by email, fax or mail.",
        "If approved, buy transit passes at the Transit Information Centre, 2124 11th Avenue."
      ],
      "documents": [
        "Completed application form",
        "Income verification"
      ],
      "tips": [
        "Processing takes about three weeks on average, so apply early.",
        "Passes that are already discounted (Discount, Post-Secondary, Senior) do not get the extra 20 per cent off."
      ],
      "time": "About three weeks to process",
      "phone": "306-777-7733"
    }
  },
  {
    "id": "regina-paratransit",
    "name": "Regina Paratransit",
    "level": "Regina",
    "category": "Transit",
    "amount": "Shared door-to-door rides at regular transit fares",
    "summary": "Scheduled shared door-to-door rides for people with a disability who are restricted in using regular buses some of the time. You must register first.",
    "note": "Fares match regular transit. You must be registered before you can ride.",
    "requires": [
      "sk",
      "regina",
      "transitBarrier"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You have trouble walking or wheeling to a bus stop.",
        "You have trouble following directions or using regular buses.",
        "You are easily confused or disoriented.",
        "You have a risk of falling.",
        "You cannot board a regular bus on your own.",
        "You tire easily."
      ],
      "note": "You must be restricted in at least one of these ways."
    },
    "applyText": "Complete the electronic Paratransit application form.",
    "applyUrl": "https://www.regina.ca/transportation-roads-parking/transit/paratransit/",
    "source": "https://www.regina.ca/transportation-roads-parking/transit/paratransit/",
    "detail": {
      "aboutList": {
        "lead": "There are five types of registration:",
        "items": [
          "Unconditional, for Regina residents who need Paratransit all the time.",
          "Temporary, for a short-term disability such as a broken leg.",
          "Winter, issued from November 1 until March 31.",
          "Visitor, for people visiting Regina.",
          "Conditional, for certain times or conditions, such as after dark."
        ]
      },
      "steps": [
        "Complete the electronic application to create your rider profile.",
        "Staff review your eligibility and may contact the professionals you listed.",
        "You may be asked to attend an in-person interview.",
        "Once registered, book trips by phone, email or the app, up to seven days ahead."
      ],
      "documents": [
        "Completed application with professionals listed"
      ],
      "tips": [
        "Evening calls are easier, since the lines are busy during the day.",
        "An unconditional registration ends if you do not ride for 18 months."
      ],
      "time": "Most applications are reviewed within two weeks",
      "phone": "306-777-7726"
    }
  },
  {
    "id": "saskatoon-access-transit",
    "name": "Access Transit (Saskatoon)",
    "level": "Saskatoon",
    "category": "Transit",
    "amount": "On-demand shared rides at regular fares",
    "summary": "On-demand rides on lift-equipped buses for people with a temporary or permanent disability who cannot use regular buses.",
    "note": "Regular fares apply, paid the same ways as on regular buses.",
    "requires": [
      "sk",
      "saskatoon",
      "transitBarrier"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have a temporary or permanent disability.",
        "You cannot use regular transit because of physical or cognitive limits."
      ],
      "note": "The page links to a How to Apply section for the application."
    },
    "applyText": "See the How to Apply page on Saskatoon Transit.",
    "applyUrl": "https://saskatoontransit.ca/access-transit/about-access-transit",
    "source": "https://saskatoontransit.ca/access-transit/about-access-transit",
    "detail": {
      "aboutList": {
        "lead": "The service works like this:",
        "items": [
          "It runs 7 days a week, including stat holidays, within Saskatoon.",
          "Rides are shared, with a pick-up window of 0 to 20 minutes.",
          "Operators help from one accessible door to another.",
          "You can book up to four one-way trips per day."
        ]
      },
      "steps": [
        "Check the How to Apply page on Saskatoon Transit.",
        "Book trips up to seven days in advance."
      ],
      "documents": [],
      "tips": [
        "Attendants are mandatory for riders who need help for medical or behavioural reasons.",
        "Late cancellations and no-shows earn points that can limit your use."
      ],
      "time": "Not published",
      "phone": "306-975-3555"
    }
  },
  {
    "id": "saskatoon-leisure-access-program",
    "name": "Leisure Access Program (Saskatoon)",
    "level": "Saskatoon",
    "category": "Recreation",
    "amount": "Free drop-ins, one registered program per year",
    "summary": "Low-income Saskatoon residents get unlimited drop-in admission at Leisure Centres and one registered recreation program per year.",
    "note": "Apply any time. You hear back by email in three to six weeks.",
    "requires": [
      "sk",
      "saskatoon",
      "saskatoonLeisureAccessProgramRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Saskatoon.",
        "Your household income before tax is at or below the limit for your household size."
      ],
      "note": "Limits for 1 to 4 people: $27,478, $34,206, $42,053 and $51,058 (larger sizes on the page)."
    },
    "applyText": "Fill out the online application, or use the printable form.",
    "applyUrl": "https://www.saskatoon.ca/parks-recreation-attractions/recreational-programs-activities/leisure-access-program",
    "source": "https://www.saskatoon.ca/parks-recreation-attractions/recreational-programs-activities/leisure-access-program",
    "detail": {
      "aboutList": {
        "lead": "The program includes:",
        "items": [
          "Unlimited admission to drop-in programs at the Leisure Centres.",
          "One registered recreation program per year.",
          "Complimentary tickets to the Nutrien Playland rides at Kinsmen Park.",
          "Single-use family passes to the Western Development Museum, while supplies last.",
          "Free child minding for children six and under at three centres."
        ]
      },
      "steps": [
        "Fill out the online application, or pick up a paper copy at any indoor leisure centre.",
        "Attach last year's Notice of Assessment for each adult in the household.",
        "Attach a utility bill or government letter showing your current address.",
        "Wait for an email about your application."
      ],
      "documents": [
        "Notice of Assessment from the Canada Revenue Agency",
        "Utility bill or government-issued letter with your address"
      ],
      "tips": [
        "Social service recipients use a different route, through the Social Services office.",
        "Child minding is at Lakewood Civic Centre, Shaw Centre and Saskatoon Field House."
      ],
      "time": "Three to six weeks",
      "phone": "306-975-3378"
    }
  },
  {
    "id": "saskatoon-low-income-bus-pass",
    "name": "Low-Income Bus Pass (Saskatoon)",
    "level": "Saskatoon",
    "category": "Transit",
    "amount": "Adult $66.40 a month; high school $47.20 a month",
    "summary": "Low-income Saskatoon residents can buy a monthly bus pass at a reduced rate. You qualify using last year's Notice of Assessment.",
    "note": "You are accepted for one year at a time and must requalify after that.",
    "requires": [
      "sk",
      "saskatoon",
      "saskatoonLowIncomeBusPassRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Saskatoon.",
        "Your household income on last year's Notice of Assessment is under the limit."
      ],
      "note": "Limits for 1 to 4 people: $27,478, $34,206, $42,053 and $51,058 (larger sizes on the page)."
    },
    "applyText": "Fill out the online application, or use the printable form.",
    "applyUrl": "https://saskatoontransit.ca/fares-passes/low-income-bus-pass-programs",
    "source": "https://saskatoontransit.ca/fares-passes/low-income-bus-pass-programs",
    "detail": {
      "aboutList": {
        "lead": "The monthly prices are in the tips below.",
        "items": [
          "A $5 activation fee applies to a new reloadable pass card."
        ]
      },
      "steps": [
        "Fill out the online application, or get a paper copy at a leisure centre or the Transit Customer Service Centre.",
        "Include your Notice of Assessment and a utility bill with your address.",
        "Mail it to Community Development, 3130 Laurier Drive, Saskatoon SK S7L 5J7.",
        "Take the returned form to the Customer Services Centre, 226 23rd Street East, to buy the pass."
      ],
      "documents": [
        "Notice of Assessment from the Canada Revenue Agency",
        "Utility bill with your current address"
      ],
      "tips": [
        "Low-income monthly pass prices: adult $66.40, high school $47.20.",
        "The page says the Notice of Assessment is the only tool used to qualify you.",
        "Rates stay the same after the July 1, 2026 fare change."
      ],
      "time": "Three to four weeks",
      "phone": "306-975-3100"
    }
  },
  {
    "id": "north-battleford-handi-bus",
    "name": "Battlefords Handi-Bus",
    "level": "North Battleford",
    "category": "Transit",
    "amount": "On-demand rides, Monday to Friday",
    "summary": "On-demand transportation for people who cannot use the regular transit service because of a disability. It runs Monday to Friday.",
    "note": "The page does not state a fare or a registration process.",
    "requires": [
      "sk",
      "northBattleford",
      "transitBarrier"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have a disability.",
        "Because of it, you cannot use the regular transit service."
      ]
    },
    "applyText": "Call to ask about the service and to book a ride.",
    "applyUrl": "https://www.cityofnb.ca/roads-parking-transportation/public-transportation/",
    "source": "https://www.cityofnb.ca/roads-parking-transportation/public-transportation/",
    "detail": {
      "aboutList": {
        "lead": "What the service is:",
        "items": [
          "A specialized on-demand service for people with disabilities.",
          "Jointly funded by North Battleford and the Town of Battleford."
        ]
      },
      "steps": [
        "Call to ask for more information or to book a ride."
      ],
      "documents": [],
      "tips": [
        "Regular buses run Monday to Friday, so check the page for route hours."
      ],
      "time": "Not published",
      "phone": "306-445-7797"
    }
  },
  {
    "id": "regina-discounted-31-day-pass",
    "name": "Regina Discounted 31-Day Transit Pass",
    "level": "Regina",
    "category": "Transit",
    "amount": "$28 for a 31-day pass",
    "summary": "A $28 Regina Transit 31-day pass for people on SAID, SIS, SES or SEI. The City runs it with the Saskatchewan Ministry of Social Services.",
    "note": "Call the Transit Information Centre to find out how to get the pass. Your first discounted pass must be bought at the Transit Information Centre.",
    "requires": [
      "sk",
      "regina",
      "reginaDiscounted31DayPassRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You are in Saskatchewan Assured Income for Disability (SAID)",
        "You are in Saskatchewan Income Support (SIS)",
        "You are in the Saskatchewan Employment Supplement (SES)",
        "You are in the Saskatchewan Employment Incentive (SEI)"
      ]
    },
    "applyText": "See how to get the pass",
    "applyUrl": "https://www.regina.ca/transportation-roads-parking/transit/fares-passes/",
    "source": "https://www.regina.ca/transportation-roads-parking/transit/fares-passes/",
    "detail": {
      "aboutList": {
        "lead": "The City of Regina and the Ministry of Social Services offer this pass to eligible low-income earners in Regina.",
        "items": [
          "The pass costs $28 and covers 31 days."
        ]
      },
      "steps": [
        "Check that you are in one of the four provincial programs",
        "Call the Transit Information Centre to ask how to get your pass",
        "Buy your first discounted pass at 2124 11th Avenue"
      ],
      "documents": [
        "The page does not list documents. Ask the Transit Information Centre what to bring."
      ],
      "tips": [
        "The Transit Information Centre is open Monday to Friday, 8:30 a.m. to 4:30 p.m."
      ],
      "phone": "306-777-7433"
    }
  },
  {
    "id": "moose-jaw-discounted-monthly-pass",
    "name": "Moose Jaw Discounted Monthly Bus Pass",
    "level": "Moose Jaw",
    "category": "Transit",
    "amount": "$25 monthly pass",
    "summary": "A discounted Moose Jaw monthly bus pass for people on social assistance. You show proof that you are in an eligible program when you buy it.",
    "note": "The pass looks the same as other passes. Proof of the program must be shown at the time you buy a pass.",
    "requires": [
      "sk",
      "mooseJaw",
      "mooseJawDiscountedMonthlyPassRoute"
    ],
    "eligibility": {
      "mode": "any",
      "items": [
        "You are in Saskatchewan Income Support (SIS)",
        "You are in the Saskatchewan Employment Incentive (SEI)",
        "You are in Saskatchewan Assured Income Disability (SAID)",
        "You are in the Saskatchewan Employment Supplement (SES)"
      ],
      "note": "Your proof must show your name, the program name and the date for the month you buy."
    },
    "applyText": "See fares and passes",
    "applyUrl": "https://moosejaw.ca/transit/transit-fares-passes/",
    "source": "https://moosejaw.ca/transit/transit-fares-passes/",
    "detail": {
      "aboutList": {
        "lead": "The City partners with the Ministry of Social Services to sell monthly passes at a lower price.",
        "items": [
          "The discounted monthly pass costs $25.",
          "The fares table lists the discounted price for fixed route and paratransit."
        ]
      },
      "steps": [
        "Get proof of your program, such as a cheque stub, program letter or bank statement",
        "Buy the pass in person with your proof",
        "Ask the Transit office if you have questions"
      ],
      "documents": [
        "A cheque stub, a letter from the program or a bank statement with your name, the program name and the date for the month of purchase."
      ],
      "tips": [
        "Passes are sold at City Hall, Yara Centre and Kinsmen Sportsplex."
      ],
      "phone": "306-694-4488"
    }
  },
  {
    "id": "moose-jaw-paratransit",
    "name": "Moose Jaw Paratransit Service",
    "level": "Moose Jaw",
    "category": "Transit",
    "amount": "Accessible door-to-door shared rides",
    "summary": "A shared ride service from one accessible door to another. It is for people who cannot use regular transit because of a physical or mental challenge.",
    "note": "You must apply and be approved first. Regular tickets and passes do not work on Paratransit, so ask for Paratransit ones.",
    "requires": [
      "sk",
      "mooseJaw",
      "transitBarrier"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You live in Moose Jaw, or you are a registered visitor",
        "A physical or mental challenge stops you using the regular bus",
        "You complete an application form and are approved"
      ],
      "note": "Visitors can also register."
    },
    "applyText": "See the Paratransit page",
    "applyUrl": "https://moosejaw.ca/transit/paratransit-service/",
    "source": "https://moosejaw.ca/transit/paratransit-service/",
    "detail": {
      "aboutList": {
        "lead": "Paratransit is a shared ride service, not a taxi.",
        "items": [
          "Drivers help you between the van and the door.",
          "It does not run on Sundays or statutory holidays.",
          "Regular subscription trips are available for work, school or medical visits."
        ]
      },
      "steps": [
        "Get the application form online, at City Hall or at the Kinsmen Sportsplex",
        "Send it to Moose Jaw Transit, 228 Main Street North, or email transit@moosejaw.ca",
        "Wait for the written decision, then book your rides"
      ],
      "documents": [
        "The completed application form."
      ],
      "tips": [
        "Eligibility is decided in consultation with professionals you designate.",
        "Cancel a trip at least 24 hours ahead, or you may be charged."
      ],
      "time": "Decision within 21 days of a complete application.",
      "phone": "306-694-4488"
    }
  },
  {
    "id": "prince-albert-access-transit",
    "name": "Prince Albert Access Transit",
    "level": "Prince Albert",
    "category": "Transit",
    "amount": "Door-to-door rides with ramps and lifts",
    "summary": "A door-to-door ride service for people who cannot use the public transit system. It has ramps and lifts for wheelchairs. The Community Service Centre runs it.",
    "note": "Rides must be booked ahead. The page does not give fares, hours or how to register.",
    "requires": [
      "sk",
      "princeAlbert",
      "transitBarrier"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You cannot use the public transit system",
        "The reason is a permanent or temporary disability"
      ]
    },
    "applyText": "See Access Transit",
    "applyUrl": "https://www.citypa.ca/parking-streets-and-transportation/transit/access-transit/",
    "source": "https://www.citypa.ca/parking-streets-and-transportation/transit/access-transit/",
    "detail": {
      "aboutList": {
        "lead": "The Community Service Centre can help you get where you want to go.",
        "items": [
          "Access Transit is a door-to-door service.",
          "Vehicles have ramps and lifts for wheelchair passengers."
        ]
      },
      "steps": [
        "Contact the Community Service Centre to ask how to book",
        "Book each ride ahead of time"
      ],
      "documents": [
        "The page does not list documents. Ask the Community Service Centre."
      ],
      "tips": [
        "People over 60 can also use the Seniors Transportation service, booked 24 hours ahead."
      ]
    }
  },
  {
    "id": "saskatoon-accessible-parking-permit-subsidy",
    "name": "Saskatoon Accessible Parking Permit Subsidy",
    "level": "Saskatoon",
    "category": "Parking",
    "amount": "Permit at half price, $50 plus GST a year",
    "summary": "Low-income Saskatoon residents with a SaskAbilities placard can buy the City's Accessible Parking Permit at 50 percent off. You must be approved first.",
    "note": "You need subsidy approval before you buy the permit. The prorated price is $25 plus GST from May 1.",
    "requires": [
      "sk",
      "saskatoon",
      "saskatoonAccessibleParkingPermitSubsidyRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are a Saskatoon resident",
        "You have a valid and current SaskAbilities Accessible Parking placard",
        "Your household income is below the Low Income Cut-Off (LICO)"
      ]
    },
    "applyText": "Apply for the subsidy",
    "applyUrl": "https://www.saskatoon.ca/moving-around/parking/parking-programs-permits/parking-people-disability/accessible-parking-permit",
    "source": "https://www.saskatoon.ca/moving-around/parking/parking-programs-permits/parking-people-disability/accessible-parking-permit",
    "detail": {
      "aboutList": {
        "lead": "The permit lets you park on the street in pay parking zones without paying at a pay station.",
        "items": [
          "You can park up to 4 hours in regular pay spaces, accessible zones and loading zones.",
          "The regular permit costs $100 plus GST a year.",
          "The permit does not work in parking lots, residential zones or bus stops."
        ]
      },
      "steps": [
        "Fill in the online form, or print the form and mail or bring it to City Hall",
        "Wait for your subsidy approval",
        "Buy your permit at City Hall"
      ],
      "documents": [
        "Your provincial disability placard and a piece of ID, when you buy the permit."
      ],
      "tips": [
        "Permits expire at the end of October each year.",
        "Questions go to parkingsubsidy@saskatoon.ca."
      ]
    }
  },
  {
    "id": "yorkton-access-transit",
    "name": "Yorkton Access Transit",
    "level": "Yorkton",
    "category": "Transit",
    "amount": "Shared door-to-door rides",
    "summary": "A shared door-to-door ride service for people with disabilities who cannot use regular public transportation. SaskAbilities runs it in Yorkton.",
    "note": "You must register ahead of time. The page does not give Access Transit fares. Yorkton transit is due to change in January 2027.",
    "requires": [
      "sk",
      "yorkton",
      "transitBarrier"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You have a disability",
        "You cannot use regular public transportation",
        "You register in advance"
      ]
    },
    "applyText": "See Access Transit",
    "applyUrl": "https://www.yorkton.ca/living-in-yorkton/transit/",
    "source": "https://www.yorkton.ca/living-in-yorkton/transit/",
    "detail": {
      "aboutList": {
        "lead": "The City offers this service with SaskAbilities.",
        "items": [
          "It helps you travel safely and independently within Yorkton."
        ]
      },
      "steps": [
        "Call or email SaskAbilities to ask how to register",
        "Register before your first ride"
      ],
      "documents": [
        "The page does not list documents. Ask SaskAbilities."
      ],
      "tips": [
        "The new service planned for January 2027 will combine regular and accessible transit."
      ],
      "phone": "306-621-6580"
    }
  },
  {
    "id": "yorkton-discounted-monthly-pass",
    "name": "Yorkton Discounted Monthly Transit Pass",
    "level": "Yorkton",
    "category": "Transit",
    "amount": "$27.50 monthly pass",
    "summary": "A discounted Yorkton monthly bus pass for people in provincially sponsored social assistance programs. You buy it at City Hall.",
    "note": "The page does not name the programs or say what proof to bring. Ask City Hall.",
    "requires": [
      "sk",
      "yorkton",
      "yorktonDiscountedMonthlyPassRoute"
    ],
    "eligibility": {
      "mode": "all",
      "items": [
        "You are in a provincially sponsored social assistance program"
      ]
    },
    "applyText": "See transit fees",
    "applyUrl": "https://www.yorkton.ca/living-in-yorkton/transit/",
    "source": "https://www.yorkton.ca/living-in-yorkton/transit/",
    "detail": {
      "aboutList": {
        "lead": "This pass costs less than the regular monthly pass.",
        "items": [
          "The adult monthly pass costs $90 in 2026.",
          "The discounted pass is sold at City Hall."
        ]
      },
      "steps": [
        "Ask City Hall which programs and proof they accept",
        "Buy the pass at City Hall"
      ],
      "documents": [
        "The page does not list documents. Ask City Hall."
      ],
      "tips": [
        "Transit runs Monday to Friday, 8 a.m. to 7 p.m. Hours may change on statutory holidays."
      ]
    }
  }

];

/* Time-limited programs: one plain status line, shown as a badge on result
   cards and at the top of the guide, so the end date is visible where people
   decide (site audit 2026-10, C-CONTENT-TRUST P2-11). Text restates only facts
   already in the record; update it with the record. kind: "closing" | "closed"
   | "deadline". */
/* Abbreviations (site audit 2026-10, C-CONTENT-TRUST P2-05). Each expansion was
   confirmed from the program text, an official page snapshot or standard federal
   usage; ambiguous acronyms (APP, ATS, CCC, RAP) and brand names are left out on
   purpose. Guides list the ones that appear on that page. */
const GLOSSARY = {
  "AAC": "Augmentative and Alternative Communication",
  "AADL": "Alberta Aids to Daily Living",
  "ABA": "Applied Behaviour Analysis",
  "ACHB": "Alberta Child Health Benefit",
  "ACSD": "Assistance for Children with Severe Disabilities",
  "ADAP": "Alberta Disability Assistance Program",
  "ADP": "Assistive Devices Program",
  "AHP": "At Home Program",
  "AISH": "Assured Income for the Severely Handicapped",
  "ARCH": "Affordable Recreation for Community Health",
  "ASD": "Autism Spectrum Disorder",
  "ASL": "American Sign Language",
  "ATP": "Affordable Transit Program",
  "BCAAN": "British Columbia Autism Assessment Network",
  "BCANDS": "British Columbia Aboriginal Network on Disability Society",
  "CAPCC": "Community Access for People in Continuing Care",
  "CCB": "Canada Child Benefit",
  "CDB": "Canada Disability Benefit",
  "CDCP": "Canadian Dental Care Plan",
  "CLBC": "Community Living BC",
  "COLT": "Cochrane On Demand Local Transit",
  "CPP": "Canada Pension Plan",
  "CPP-D": "Canada Pension Plan Disability",
  "CRA": "Canada Revenue Agency",
  "CUAET": "Canada-Ukraine Authorization for Emergency Travel",
  "CYSN": "Children and Youth with Support Needs",
  "DIA": "Disability Income Assistance",
  "DRES": "Disability Related Employment Supports",
  "DSO": "Developmental Services Ontario",
  "DTC": "Disability Tax Credit",
  "EI": "Employment Insurance",
  "FAR": "Financial Assistance for Recreation",
  "FASD": "Fetal Alcohol Spectrum Disorder",
  "FCSS": "Family and Community Support Services",
  "FNHA": "First Nations Health Authority",
  "FSCD": "Family Support for Children with Disabilities",
  "GIS": "Guaranteed Income Supplement",
  "GST": "Goods and Services Tax",
  "HATC": "Home Accessibility Tax Credit",
  "HST": "Harmonized Sales Tax",
  "ICBC": "Insurance Corporation of British Columbia",
  "IRCC": "Immigration, Refugees and Citizenship Canada",
  "ISC": "Indigenous Services Canada",
  "LAP": "Leisure Access Program",
  "LICO": "Low Income Cut-Off",
  "LIFT": "Low-Income Fare Transit Program",
  "LIM-AT": "Low-Income Measure After-Tax",
  "MBM": "Market Basket Measure",
  "MCFD": "Ministry of Children and Family Development",
  "MHRTC": "Multigenerational Home Renovation Tax Credit",
  "MSDPR": "Ministry of Social Development and Poverty Reduction",
  "MSO": "Medical Services Only",
  "MSP": "Medical Services Plan",
  "NOA": "Notice of Assessment",
  "OAP": "Ontario Autism Program",
  "ODSP": "Ontario Disability Support Program",
  "OHIP": "Ontario Health Insurance Plan",
  "OT": "Occupational Therapist",
  "PAIRS": "Provincial Access, Information and Resource Services",
  "PAL": "Personal Assistant for Leisure Activities",
  "PDD": "Persons with Developmental Disabilities",
  "PLAY": "Positive Leisure Activities for Youth",
  "PPMB": "Persons with Persistent Multiple Barriers",
  "PSI": "Personalized Supports Initiative",
  "PT": "Physical Therapist",
  "PWD": "Persons with Disabilities designation",
  "RAMP": "Residential Access Modification Program",
  "RASP": "Registry of Autism Service Providers",
  "RDSP": "Registered Disability Savings Plan",
  "RFSP": "Recreation Fee Subsidy Program",
  "SAET": "School-Aged Extended Therapies",
  "SAFER": "Shelter Aid for Elderly Renters",
  "SIN": "Social Insurance Number",
  "SLP": "Speech-Language Pathologist",
  "SSAH": "Special Services at Home",
  "TTC": "Toronto Transit Commission",
  "TTE": "Training, Travel and Equipment",
  "WSIB": "Workplace Safety and Insurance Board",
};
/* [abbreviation, expansion] pairs that appear in a program's own text, A to Z. */
function glossaryTermsFor(b) {
  const text = JSON.stringify(b, (k, v) => (/url$/i.test(k) || k === "source" ? undefined : v)).replace(/<[^>]+>/g, " ");
  return Object.keys(GLOSSARY)
    .filter((abbr) => new RegExp("(^|[^A-Za-z0-9-])" + abbr.replace(/-/g, "\\-") + "(?![A-Za-z0-9])").test(text))
    .map((abbr) => [abbr, GLOSSARY[abbr]]);
}

const BENEFIT_STATUS = {
  "bc-autism-funding-under-6": { kind: "closing", text: "Ending: new applications until March 2027; the program ends March 31, 2027" },
  "bc-autism-funding-6-18": { kind: "closing", text: "Ending: new applications until March 2027; the program ends March 31, 2027" },
  "bc-at-home-medical": { kind: "closing", text: "New families can apply until March 2027" },
  "bc-at-home-saet": { kind: "closing", text: "Available until March 31, 2027, or until your child moves to the new benefit" },
  "waterloo-ontario-renovates": { kind: "deadline", text: "Deadline: the Region lists December 1, 2026 in one place; check the current date with the Region" },
  "leduc-subsidies": { kind: "closed", text: "Recreation Assistance is closed until January 2027; the bus pass support is separate" },
};

const BENEFIT_VERIFIED = {
  "yorkton-discounted-monthly-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "yorkton-access-transit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "saskatoon-accessible-parking-permit-subsidy": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "prince-albert-access-transit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "moose-jaw-paratransit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "moose-jaw-discounted-monthly-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "regina-discounted-31-day-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "north-battleford-handi-bus": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "saskatoon-low-income-bus-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "saskatoon-leisure-access-program": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "saskatoon-access-transit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "regina-paratransit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "regina-affordable-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-saskatchewan/city-snapshots)
  "sk-cochlear-processor": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-early-childhood-intervention": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-low-income-tax-credit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-active-families-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-accessible-parking": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-personal-care-home-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-eapd": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-adaptations-for-independence": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-home-care": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-family-respite-intellectual-disability": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-cognitive-disability-strategy": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-autism-individualized-funding": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-seniors-income-plan": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-seniors-drug-plan": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-special-support": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-family-health-benefits": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-supplementary-health": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-sail": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-housing-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-employment-incentive": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-income-support": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "sk-said": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-childrens-rehab": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-subsidized-housing": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-sharp": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-seniors-special-needs-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-seniors-dental-optical": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-seniors-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-rent-assistance-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-income-support": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-home-care": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-child-family-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-brain-injury": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "ab-blue-cross-non-group": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-hearing-supplements": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-safer": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-rental-assistance-program": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-ppmb": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-nursing-support-services": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-income-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-home-support": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-family-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "bc-csil": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-oesp": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-odsp-health-benefits": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-odsp-employment-supports": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-northern-health-travel-grant": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-home-community-care": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-drug-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-trillium-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-seniors-dental": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-ontario-works": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-healthy-smiles": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-gains": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-enhanced-respite": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-dso-adult-services": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "on-child-benefit": "2026-10", // new 2026-10-17 from the official page (research/2026-10-prov-sweep/snapshots)
  "west-vancouver-recreation-financial-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "taber-fee-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "sarnia-cnib-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "port-coquitlam-financial-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "nelson-rdck-leisure-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "morinville-wrap": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "langley-leisure-access-grant": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "high-river-community-access-program": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "dawson-creek-leisure-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "cornwall-community-bus-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "brantford-recreation-subsidy": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "white-rock-leisure-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "terrace-affordable-recreation-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "squamish-recreation-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "quesnel-leisure-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "prince-rupert-recreation-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "port-moody-leisure-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "pitt-meadows-fee-subsidy": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "penticton-access-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "penticton-life": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "mission-play-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "duncan-leisure-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "cranbrook-leisure-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "courtenay-comox-rap-leap": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "colwood-langford-life": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "campbell-river-life": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "peterborough-ow-odsp-transit-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "peterborough-recreation-subsidy": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "cornwall-fair": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "chatham-kent-affordable-bus-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "belleville-recreation-fee-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "whitecourt-recreation-fee-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "strathmore-community-access-card": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "rocky-mountain-house-rfap": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "edson-leisure-assist": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "drayton-valley-recreation-fee-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "chestermere-community-access-program": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "blackfalds-recreation-fee-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "banff-access-program": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "prince-george-lap": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "new-westminster-financial-assistance": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "nanaimo-leap": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "maple-ridge-access-pass-disability": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "maple-ridge-access-pass-financial": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "abbotsford-specialized-access": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "abbotsford-prc-subsidy": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "halton-split": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "kingston-affordable-transit-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  "niagara-transit-benefit-pass": "2026-10", // new 2026-10-17 from the official page (research/2026-10-city-sweep/snapshots)
  // 2026-10: records whose every fact row was CONFIRMED, or DIFFERS then FIXED/KEPT
  // (more conservative), with no NOT ON PAGE amount/threshold/age/date row and no
  // OPEN item; see research/reverify/VERIFIED-DATES-2026-10-17.md.
  // #216: amount calculation (CDB) and grant/bond window (RDSP) re-checked
  // against the supplied official pages on 2026-10-14; month granularity.
  "cdb-adult": "2026-07",
  "waterloo-ontario-renovates": "2026-10", "waterloo-homemaking-support": "2026-10",
  "waterloo-curbside-waste-support": "2026-10",
  "grt-affordable-transit": "2026-09", "grt-cnib-pass": "2026-10",
  "grt-mobilityplus": "2026-09", "grt-taxi-coupons": "2026-10",
  "grt-support-person": "2026-10",
  // Toronto municipal records, verified against the City of Toronto's own pages
  // on 2026-09-04.
  "toronto-fair-pass": "2026-10", "toronto-welcome-policy": "2026-10",
  "ottawa-hand-in-hand": "2026-09", "mississauga-activeassist": "2026-09",
  "brampton-activeassist": "2026-10", "hamilton-fare-assist": "2026-09",
  "london-ontario-renovates": "2026-09",
  "windsor-affordable-pass": "2026-09", "windsor-recreation-assistance": "2026-09",
  "ottawa-community-pass": "2026-09", "ottawa-access-pass": "2026-09",
  "ottawa-equipass": "2026-09", "ottawa-a-card": "2026-10",
  "york-region-homemakers": "2026-10", "york-region-recreation-subsidies": "2026-10",
  // Ontario province-level records, each verified against its official ontario.ca
  // page on 2026-09-04. Month granularity only — no fabricated day.
  "on-parking-permit": "2026-09", odsp: "2026-09", "on-adp": "2026-10",
  "ontario-autism-program": "2026-10", ssah: "2026-10", acsd: "2026-10",
  "passport-program": "2026-10", hvmp: "2026-10", "trillium-drug-program": "2026-10",
  dtc: "2026-07", aish: "2026-07", adap: "2026-07",
  "adult-health-benefit": "2026-07",
  ramp: "2026-07",
  "cpp-disability": "2026-07", "cpp-childrens-benefit": "2026-07", "parking-placard": "2026-07",
  "ab-service-dog-id-card": "2026-10", "ab-capcc": "2026-07", "ab-special-needs-housing": "2026-10",
  "multigenerational-home-renovation-tax-credit": "2026-07", "excise-gasoline-tax-refund": "2026-07",
  "canmore-affordable-services": "2026-10", "cochrane-connect-card": "2026-10",
  "fortsask-access": "2026-10", "leduc-subsidies": "2026-07",
  "lloydminster-recreation-access": "2026-10", "okotoks-fee-assistance": "2026-10",
  "sprucegrove-low-income-transit": "2026-10",
  "bc-access-grant-deaf-students": "2026-07", "bc-access-grant-students-disabilities": "2026-10",
  "bc-assistance-program-students-disabilities": "2026-07", "bc-at-home-saet": "2026-07",
  "bc-autism-funding-6-18": "2026-07", "bc-autism-funding-under-6": "2026-07",
  "bc-bus-pass": "2026-10", "bc-clbc": "2026-07", "bc-csg-services-equipment": "2026-07",
  "bc-csg-students-disabilities": "2026-10", "bc-cy-disability-benefit": "2026-10",
  "bc-dental-supplement": "2026-07", "bc-disability-assistance-pwd": "2026-07",
  "bc-fnha-health-benefits": "2026-07", "bc-home-reno-tax-credit": "2026-10", "bc-learning-disability-assessment-bursary": "2026-07",
  "bc-medical-equipment-devices": "2026-07", "bc-monthly-nutritional-supplement": "2026-07",
  "bc-msp-supplementary-benefits": "2026-07", "bc-optical-supplement": "2026-07", "bc-pharmacare-plan-g": "2026-10", "bc-pharmacare-plan-p": "2026-10", "bc-supplemental-bursary-students-disabilities": "2026-10",
  "bc-work-able-internship": "2026-07", "bc-workbc-assistive-technology": "2026-10",
  "kamloops-arch": "2026-07", "sparc-parking-permit": "2026-07",
  // 2026-10 additions (same review, VERIFIED-DATES-2026-10-17.md):
  "csg-disability": "2026-10", "csg-dse": "2026-10", "taxi-saver-bctransit": "2026-10",
  "home-accessibility-tax-credit": "2026-10", "fscd": "2026-10", "ab-grant-disability": "2026-10",
  "lethbridge-fee-assistance": "2026-10", "medicinehat-fair-entry": "2026-10",
  "bc-fuel-tax-refund-disabilities": "2026-10", "bc-icbc-disability-discount": "2026-10",
  "surrey-leisure-access": "2026-10", "burnaby-fair-play": "2026-10",
  "richmond-rec-fee-subsidy": "2026-10", "saanich-life": "2026-10", "coquitlam-far": "2026-10",
};
