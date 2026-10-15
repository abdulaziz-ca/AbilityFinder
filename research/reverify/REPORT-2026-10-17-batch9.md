# Snapshot re-verification report — 2026-10-17, batch 9

## Method and scope

Evaluated `public/data.js` in a Node `vm` with `{window:{}, document:{}, console}`, exporting `BENEFITS`, `BENEFIT_VALUES`, and `BENEFIT_META`, as in `scripts/check-readability.js`. Both current scripts parsed successfully; no HEAD fallback was needed. Evaluated the isolated `REQS` declaration with external references stubbed; inspected unmet and short text for each requirement without calling matchers. No grep-parsing of benefit records. Public files were read only; no tests or generators were run.

Repeated assertions are consolidated; distinct factual metadata is included. Internal flags, labels, URLs, difficulty ratings, and advice without factual assertions are excluded. Facts count distinct assertions, not occurrences or numeric tokens. Inseparable amount/period and route/conditions may share a row; independent assertions are separate. CONFIRMED requires a supporting quotation. DIFFERS identifies number, boundary, hedge, dropped condition or scope inconsistencies. NOT ON PAGE means absent from supplied usable sources, not false. Hedges are checked both ways; a maximum hedge alone does not contradict a maximum unless the source fixes the amount. Source-only facts are not invented as record assertions, but dropped conditions in asserted routes are identified. Quotes are verbatim excerpts; filenames are relative to `research/reverify/snapshots/`. No linked content is presumed read. Phone numbers are compared against contacts for the same purpose, not unrelated navigation numbers.

The requested report date is a batch label: supplied fetch headers say 2026-10-15.

## Summary table

| Record id | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| hvmp | 20 | 17 | 0 | 3 |
| on-adp | 22 | 14 | 6 | 2 |
| on-parking-permit | 23 | 19 | 2 | 2 |
| ontario-autism-program | 17 | 16 | 1 | 0 |
| ottawa-a-card | 8 | 7 | 0 | 1 |
| ssah | 30 | 29 | 1 | 0 |
| waterloo-curbside-waste-support | 9 | 7 | 2 | 0 |
| waterloo-homemaking-support | 14 | 13 | 1 | 0 |
| windsor-recreation-assistance | 28 | 17 | 2 | 9 |
| york-region-homemakers | 14 | 8 | 1 | 5 |
| york-region-recreation-subsidies | 16 | 11 | 2 | 3 |
| **Total (11 records)** | **201** | **158** | **18** | **25** |

Counts are evidence-limited, not a declaration that unsupported assertions are false.

## DIFFERS — needs a decision

Each numbered item corresponds to one DIFFERS assertion row. No wording is proposed.

1. **on-adp — `detail.about / detail.aboutList.items[2]`**
   - Current: “may pay 75% of an approved fixed price”.
   - Snapshot quote / difference: “Fixed Price ADP will pay 75% of the approved price”. Hedge: fixed-price payment is stated as will, not may, once that model applies.

2. **on-adp — `eligibility.items[0] / detail.documents[0]`**
   - Current: “An Ontario resident with a valid Ontario health card”.
   - Snapshot quote / difference: “To qualify, generally you must: be an Ontario resident have a valid Ontario health card”. Dropped general-qualification hedge.

3. **on-adp — `eligibility.items[1] / detail.tips[1] / REQS.adpClinical`**
   - Current: “A physical disability requiring the equipment or supplies for 6 months or longer”.
   - Snapshot quote / difference: “To qualify, generally you must”; “have a physical disability requiring the equipment or supplies for 6 months or longer”. Dropped “generally” hedge on disability/duration requirement.

4. **on-adp — `eligibility.items[2] / REQS.adpClinical`**
   - Current: “Meet the clinical criteria specific to the device you are applying for”.
   - Snapshot quote / difference: “To qualify, generally you must”; “meet clinical criteria specific to the device you are applying for”. Dropped general-qualification hedge.

5. **on-adp — `eligibility.items[3]`**
   - Current: “Not already receiving support for the same equipment” from WSIB / Group A Veterans Affairs coverage.
   - Snapshot quote / difference: “already qualify for or are receiving financial support”. Dropped qualifying-but-not-yet-receiving exclusion for both routes.

6. **on-adp — `detail.steps[2] / BENEFIT_META.effort`**
   - Current: “Buy the device from an ADP-registered vendor”.
   - Snapshot quote / difference: grant funding permits “purchase the equipment from any business you choose”. Dropped grant-model exception to mandatory registered-vendor route.

7. **on-parking-permit — `eligibility.items[5]`**
   - Current: “a field of vision of 20 degrees or less”.
   - Snapshot quote / difference: “maximum field of vision using both eyes has a diameter of 20 degrees or less”. Dropped both-eyes/diameter measurement conditions.

8. **on-parking-permit — `BENEFIT_META.wait`**
   - Current: “about 7 weeks (in person)”.
   - Snapshot quote / difference: “In person at a ServiceOntario centre 7 weeks”. Added approximation hedge to stated duration.

9. **ontario-autism-program — `note / detail.tips[0]`**
   - Current: “Do not register again”; “already submitted a registration form”.
   - Snapshot quote / difference: “You do not need to register again”; “already submitted a registration form and supporting documents”. Exemption becomes prohibition, and supporting-document condition is dropped.

10. **ssah — `detail.tips[5]`**
    - Current: “probability of delay and risk of further delay”.
    - Snapshot quote / difference: “probability or presence of delay and risk of further delay that will result in ongoing functional limitations”. Dropped presence-of-delay alternative and ongoing-functional-limitations condition.

11. **waterloo-curbside-waste-support — `eligibility.items[0] / detail.aboutList.items[0] / REQS.waterlooWasteSupportApproval`**
    - Current: disability/physical limitation, help placing carts and nobody available to help.
    - Snapshot quote / difference: “available to eligible households that receive municipal curbside waste collection”. Dropped municipal-curbside-collection condition in stated assisted route.

12. **waterloo-curbside-waste-support — `note`**
    - Current: “only for moving ... black garbage and green organics carts”.
    - Snapshot quote / difference: “Collected: Region-issued black garbage cart Region-issued green organics cart Tagged bags”. Exclusive cart-only scope omits tagged bags.

13. **waterloo-homemaking-support — `REQS.lowIncome`**
    - Current: “This is for lower-income households.”
    - Snapshot quote / difference: “financial criteria (low income/social support)”. Scope: categorical social-support alternative not preserved in generic low-income gate text.

14. **windsor-recreation-assistance — `detail.aboutList.items[3]`**
    - Current: “you can request reimbursement if registration fees were paid in advance”.
    - Snapshot quote / difference: “If you are requesting a reimbursement, it must be done within thirty [30] days of payment.” Dropped reimbursement deadline.

15. **windsor-recreation-assistance — `REQS.windsor`**
    - Current: “This is a City of Windsor program.”
    - Snapshot quote / difference: “Windsor-Essex residents”; “program eligibility may differ across municipalities”. City-specific gate text narrows regional scope.

16. **york-region-homemakers — `detail.tips[1] / REQS.yorkHomemakersNeed`**
    - Current: “calling is the only way”; “you need to call”.
    - Snapshot quote / difference: “please call 1-877-464-9675 or email @email”. Exclusive phone assertion drops email alternative; actual email address is not exposed in snapshot.

17. **york-region-recreation-subsidies — `eligibility.items[0] / REQS.lowIncome`**
    - Current: “The child is from a family with low income”.
    - Snapshot quote / difference: PLAY requires at least one listed route: “Receive Rent Subsidy”; “Receive Ontario Works , Ontario Disability Support Program or Assistance for Children with Severe Disabilities”; “Receive Child Care Fee Subsidy with an annual income of $43,000 or less”. Overnight also lists housing communities, and day camp has its own list. Generic low income omits categorical routes and the $43,000 boundary for the specified child-care-subsidy route.

18. **york-region-recreation-subsidies — `REQS.child`**
    - Current: “This is for children under 18.”
    - Snapshot quote / difference: PLAY assists “children ages four to 18 and single parents”. Boundary/scope: universal under-18 gate excludes age 18 and single parents, while not preserving PLAY's minimum age four.


## Skipped snapshots

None: all eleven supplied requested-record snapshots have first-line `status: 200`.

Evidence limitations: linked device-specific ADP pages, March of Dimes application details, Windsor Eligibility Requirements and York linked guides were not supplied and are not presumed read. York's homemaker email renders as `@email`; the record's actual email cannot be verified from that rendering. No recorded phone number differs from a contact number supplied for the same purpose. Public files may continue changing concurrently; findings refer to the evaluated working-tree prose quoted below.

## Per-record detail

### hvmp

Sources: `hvmp--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Funding / ages / purposes; amount, summary, about, values | “children, adults and seniors ... living safely ... community ... avoid ... job” | CONFIRMED | “children and adults, including seniors ... continue living safely in their homes, participate in their communities and avoid job loss”. |
| Published maximum; amount, values | “no published maximum” | CONFIRMED | Page describes funding without publishing a maximum. |
| Priority | “individuals and families most in need” | CONFIRMED | “intended to serve individuals and families most in need of assistance”. |
| Prior funding; note, steps, tips, REQS.hvmpCoordinator | “must first access any other ... public or private funding” | CONFIRMED | “must first access any other sources of available public or private funding before being considered eligible”. |
| Contribution boundary and hedge; note, about, tips, REQS.hvmpIncome | “over $38,000 ... may be required to contribute” | CONFIRMED | “household income of over $38,000 may be required to contribute”. |
| Residence; eligibility, steps, REQS.on | “permanent Ontario resident” | CONFIRMED | “a permanent Ontario resident”. |
| Income ceiling; eligibility, REQS.hvmpIncome | “does not exceed the established threshold” | CONFIRMED | “household income that does not exceed the established threshold”. |
| Disability restriction; eligibility, REQS.hvmpMobility | “impedes mobility ... substantial restriction ... personal care ... medical care or community services” | CONFIRMED | “disability that impedes mobility and results in substantial restriction in activities of daily living (for example, personal care and/or accessing medical care or community services)”. |
| Other criteria / coordinator; eligibility.note, steps, metadata, REQS.hvmpCoordinator | “other criteria ... coordinator decides ... approves expenditures” | CONFIRMED | “other eligibility criteria identified in ... Guidelines”; “determining whether or not an applicant meets the eligibility criteria, approving expenditures that comply with program guidelines”. |
| Application referral; summary, steps, metadata | “March of Dimes website” | CONFIRMED | “Please visit the March of Dimes website to learn more about eligibility and how to apply.” |
| Home examples; aboutList.items[0] | “ramps, platform and stairway lifts, elevating devices, widening doors ... bathroom or kitchen ... environmental controls ... wet room” | CONFIRMED | “ramps inside and outside”; “platform lifts, stairway lifts”; “elevating devices”; “widening of doors”; “rearrangement of bathrooms”; “rearrangement and lowering or raising of kitchen equipment”; “environmental controls may be provided as appropriate”; “wet room with universal design principles”. |
| Vehicle examples; aboutList.items[1] | “hand or foot controls, lifts, specialized seating, remote garage-door openers, raising a roof or lowering a floor ... barrier-free garage” | CONFIRMED | “hand controls, foot controls, lifts”; “specialized seating”; “remote control devices to open garage doors”; “raising the roof”; “lowering of the floor”; “barrier-free modifications to garages or carports”. |
| Ancillary funding / assessment timing; aboutList.items[2] | “assessment completed after you apply ... professional fees ... equipment and warranties ... installation and labour ... training” | CONFIRMED | “assessment completed after application”; “design schematics and professional fees”; “equipment ... cost of any warranties”; “installation ... including labour”; “training on the use of equipment”. |
| Conditional home/vehicle assessment; steps[3] | “may assess ... if more information is needed” | CONFIRMED | “will assess ... if they believe that further information is needed”. |
| Income documentation; documents[0] | “Information about your household income” | NOT ON PAGE | Income criterion stated; no document list. |
| Disability documentation; documents[1] | “Information about your disability and how it restricts your mobility and daily activities” | NOT ON PAGE | Disability criterion stated; no document list. |
| Appliance difference funding; tips[2] | “only sold as a whole item ... difference ... market value ... non-specialized” | CONFIRMED | “only sold as a whole item ... fund the difference between the cost of the appliance and the market value of a similar non-specialized appliance”. |
| Convertible equipment hedge; tips[3] | “should be fully convertible where possible” | CONFIRMED | “should be fully convertible — if possible — to any type of vehicle”. |
| SSAH exclusion; tips[4] | “Special Services at Home will not reimburse structural home or vehicle changes” | NOT ON PAGE | SSAH not mentioned. |
| Wait; metadata | “Not published” | CONFIRMED | No processing interval is published. |

### on-adp

Sources: `on-adp--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Purpose; summary, about, REQS.equipmentNeed | “customized equipment and specialized supplies ... long-term physical disability” | CONFIRMED | “people with long-term physical disabilities pay for customized equipment”; “specialized supplies”. |
| Categories; summary, aboutList | “mobility ... hearing ... visual ... prosthetics ... respiratory and ventilator ... oxygen ... communication ... diabetic, ostomy and enteral-feeding” | CONFIRMED | “communication aids”; “diabetic equipment and supplies”; “enteral-feeding pumps and ostomy supplies”; “hearing aids”; “home oxygen therapy”; “mobility aids”; “prosthetic breasts or limbs”; “respiratory equipment”; “ventilator equipment”; “visual aids”. |
| Income | “income is not considered” | CONFIRMED | “We do not consider your income.” |
| General percentage and benefit-client hedge; amount, values | “Up to 75% ... may be the full amount ... ODSP, Ontario Works or ACSD” | CONFIRMED | “up to 75%”; “Ontario Works ... Ontario Disability Support Program or Assistance for Children with Severe Disabilities”; “This could be: 100% ... full grant amount”. |
| Fixed-price hedge; about, aboutList.items[2] | “may pay 75% of an approved fixed price” | DIFFERS | “Fixed Price ADP will pay 75% of the approved price”. Hedge: once fixed-price model applies, page says will, record says may. |
| Maximum contribution model | “up to 75% of an approved maximum contribution” | CONFIRMED | “Maximum Contribution ADP will pay up to 75% of an approved maximum amount”. |
| Direct grant | “set grant amount paid directly to you” | CONFIRMED | “Grant ADP will pay you directly for a portion of the cost”. |
| Benefit-client model-specific funding; about | “full approved price ... full maximum contribution ... full grant amount” | CONFIRMED | “100% of the approved price ... 100% of the approved maximum contribution amount ... full grant amount”. |
| Residence/card; eligibility, documents, REQS.on | “Ontario resident with a valid Ontario health card” | DIFFERS | “To qualify, generally you must: be an Ontario resident have a valid Ontario health card”. Hedge: general qualifications rendered universal. |
| Physical disability / six months; eligibility, tips, REQS.adpClinical | “physical disability ... for 6 months or longer” | DIFFERS | “To qualify, generally you must ... have a physical disability requiring the equipment or supplies for 6 months or longer”. Dropped “generally”. |
| Device clinical criteria; eligibility, REQS.adpClinical | “Meet the clinical criteria specific to the device” | DIFFERS | “To qualify, generally you must ... meet clinical criteria specific to the device you are applying for”. Dropped “generally”. |
| Other coverage exclusion; eligibility.items[3] | “Not already receiving support ... WSIB ... Group ‘A’ veteran ... Veterans Affairs Canada” | DIFFERS | “already qualify for or are receiving financial support ... same equipment or supplies”. Dropped qualifying-but-not-yet-receiving exclusion for both routes. |
| Authorizer assessment/form; steps, documents, metadata, REQS.adpClinical | “registered authorizer ... assesses ... confirms ... application form” | NOT ON PAGE | Overview links device-specific application pages; no authorizer assessment/form requirement stated. |
| Mandatory registered vendor; steps, metadata | “Buy the device from an ADP-registered vendor” | DIFFERS | Grant model permits “purchase the equipment from any business you choose”. Scope: universal registered-vendor route excludes grant exception. |
| Direct vendor billing hedge | “usually bills ADP ... directly” | NOT ON PAGE | No usual billing practice described. |
| Own share / extras | “Pay your share ... optional accessories or services” | CONFIRMED | “remaining 25% ... plus any optional accessories or services you choose to buy”; “remaining cost”. |
| Repairs / maintenance | “does not pay for repairs ... care and maintenance are yours” | CONFIRMED | “does not cover repair costs ... Care and maintenance ... is your responsibility”. |
| Exclusions | “bath and shower aids, grab-bars, stair or chair lifts, hospital beds, incontinence supplies, home renovations ... ramps ... batteries” | CONFIRMED | “bath and shower aids”; “grab-bars”; “stair lifts”; “chair lifts”; “hospital beds and mattresses”; “incontinence supplies”; “home renovations (including ramps”; “batteries (even for equipment originally purchased through ADP )”. |
| Replacement hedge | “may be funded if ... condition changes ... out of warranty and cannot be repaired at a reasonable cost” | CONFIRMED | “may contribute ... if your condition changes or your equipment is no longer under warranty and cannot be repaired at a reasonable cost”. |
| Charity help hedge | “Easter Seals Ontario, The War Amps and Lions Clubs may be able to help” | CONFIRMED | “contact ... about additional support: Easter Seals Ontario The War Amps Lions Clubs”. |
| Phone / TTY | “1-800-268-6021 (TTY 1-800-387-5559)” | CONFIRMED | “Toll-free: 1-800-268-6021 TTY : 1-800-387-5559”. |
| Application wait | “Not published” | CONFIRMED | Complaint timelines are published, not application processing times. |

### on-parking-permit

Sources: `on-parking-permit--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Free issue / renewal / replacement; amount, about, values, tips | “no cost to get, renew, or replace” | CONFIRMED | “There is no cost to get, renew or replace an accessible parking permit.” |
| Designated parking / display | “number and expiry date visible on the dashboard or sun visor” | CONFIRMED | “permit number and expiry date visible on your vehicle&rsquo;s sun visor or dashboard to park in an accessible parking space”. |
| Personal permit / presence | “issued to a person, not a vehicle ... driving or riding” | CONFIRMED | “An individual APP is issued to a person and is not specific to a vehicle”; “passenger or driver ... moving to and from the designated parking space”. |
| Fine / seizure hedge | “can bring a fine of up to $5,000 and loss of the permit” | CONFIRMED | “could be fined up to $5,000 and the permit may be seized”. |
| Municipal rules; note, about, tips | “Each municipality sets its own ... bylaws” | CONFIRMED | “each municipality determines the rules and privileges ... through bylaws”. |
| Local privilege examples | “free or extended metered parking” | NOT ON PAGE | No such examples supplied. |
| Walking assistance condition | “brace, cane, crutch, lower-limb prosthetic, wheelchair, or another person” | CONFIRMED | “cannot walk without a brace, cane, crutch, lower limb prosthetic device ... wheelchair ... another individual”. |
| Lung threshold | “under one litre in one second” | CONFIRMED | “forced expiratory volume in one second is less than one litre”. |
| Oxygen condition | “Portable oxygen is a medical necessity” | CONFIRMED | “portable oxygen is a medical necessity”. |
| Heart classification | “Class III or Class IV functional capacity” | CONFIRMED | “functional capacity is classified as Class III or Class IV”. |
| Walking-limiting conditions | “arthritic, neurological, musculoskeletal, or orthopaedic” | CONFIRMED | “severely limited in the ability to walk due to an arthritic, neurological, musculoskeletal or orthopaedic condition”. |
| Visual acuity | “20/200 or poorer ... better eye with corrective lenses” | CONFIRMED | “visual acuity is 20/200 or poorer in the better eye with corrective lenses”. |
| Visual field | “field of vision of 20 degrees or less” | DIFFERS | “maximum field of vision using both eyes has a diameter of 20 degrees or less”. Dropped both-eyes/diameter measurement conditions. |
| Other severe mobility condition | “Mobility is severely limited by one or more conditions or functional impairments” | CONFIRMED | “mobility is severely limited by one or more conditions or functional impairments”. |
| Certification / professions; eligibility.note, documents, metadata | “physician, nurse practitioner (Extended Class), physiotherapist, occupational therapist, chiropractor, or podiatrist (chiropodist)” | CONFIRMED | “registered member of: College of Chiropodists (Podiatrist) College of Chiropractors College of Nurses (Nurse Practitioner Extended Class) College of Physicians and Surgeons College of Physiotherapists College of Occupational Therapists”. |
| Application / identity / channels | “ServiceOntario ... download ... applicant section ... certification ... online ... Account, by mail, or in person ... identification” | CONFIRMED | “visiting any ServiceOntario centre or downloading”; “Complete both part A and part B”; “identity documents”; “online by mail in-person”; “with a ServiceOntario Account”. |
| Permanent validity / recertification | “5 years ... without ... re-certified” | CONFIRMED | “valid for 5 years ... renewed without needing to be re-certified”. |
| Temporary / change renewal | “temporary and subject-to-change ... require re-certification” | CONFIRMED | “To renew, you must be re-certified” (both permit descriptions). |
| Traveller route | “valid permit ... car you leave behind ... Ontario airport or train station ... regular permit ... trip” | CONFIRMED | “travelling outside Ontario and hold a valid accessible parking permit ... park your car where you depart (for example, Ontario airport or train station) while you use your regular permit during your trip”. |
| Online/mail wait | “Up to 3 weeks” | CONFIRMED | “Online or mail Up to 3 weeks”. |
| In-person wait hedge; metadata | “about 7 weeks” | DIFFERS | “In person at a ServiceOntario centre 7 weeks”. Added approximation hedge to stated duration. |
| Ontario program; REQS.on | “Ontario program” | CONFIRMED | “Ontario accessible parking permits”. |
| Gate mobility threshold; REQS.mobility | “can't walk ~50m” | NOT ON PAGE | No distance threshold stated. Vision loss supported by visual criteria above. |

### ontario-autism-program

Sources: `ontario-autism-program--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Program / needs-based support; amount, summary, about, values, REQS.autismSelected | “children and youth on the autism spectrum ... needs-based services” | CONFIRMED | “offers support to families of children and youth on the autism spectrum”; “access needs-based services and supports”. |
| Age; eligibility, about, REQS.child | “under 18”; “until they turn 18” | CONFIRMED | “be under age 18”; “until the age of 18”. |
| Residence; eligibility, REQS.on | “currently lives in Ontario” | CONFIRMED | “currently live in Ontario”. |
| Diagnosis; eligibility, steps, REQS.oapDiagnosis | “written diagnosis of autism from a qualified professional” | CONFIRMED | “have a written diagnosis of autism from a qualified professional”. |
| Diagnosis contents; eligibility.note, documents | “full name and date of birth ... assessment ... diagnostic criteria ... name and credentials” | CONFIRMED | “full name and date of birth ... date of your child’s assessment ... meets the diagnostic criteria for autism spectrum disorder ... professional’s name and credentials”. |
| Intake and account; note, steps, metadata | “AccessOAP ... independent intake organization”; “Create ... account ... supporting documentation” | CONFIRMED | “Independent Intake Organization”; “create an Access OAP account”; “Register ... through AccessOAP and provide all supporting documentation that they ask for”. |
| Coordinator services | “answer questions ... service options ... community” | CONFIRMED | “answer your questions ... understand your service options ... access needs-based services and supports in your community”. |
| Re-registration prohibition; note, tips[0] | “Do not register again ... already ... submitted a registration form” | DIFFERS | “You do not need to register again if you ... already submitted a registration form and supporting documents”. Hedge and dropped condition: exemption is not a prohibition and ministry submission exemption includes supporting documents. |
| Foundational family services | “available to everyone registered” | CONFIRMED | “foundational family services for everyone registered”. |
| Early-years ages | “between 12 and 48 months” | CONFIRMED | “between 12 and 48 months old and registered”. |
| Other service types / school entry | “core clinical ... entry to school ... kindergarten or Grade 1 ... urgent response” | CONFIRMED | “Core clinical services”; “starting kindergarten or Grade 1”; “Urgent response services”. |
| Historical registration boundary | “before April 2021 ... interim one-time funding and childhood budgets” | CONFIRMED | “If you registered for the program before April 2021 Interim one-time funding”; “Childhood budgets ... registered ... before April 2021”. |
| Behaviour plans ended / replaced | “no longer part ... replaced” | CONFIRMED | “Behaviour plans are no longer offered ... replaced by other types of services and supports”. |
| Other programs hedge | “may also qualify for Special Services at Home or ... ACSD” | CONFIRMED | “may be eligible ... Special Services at Home program Assistance for Children with Severe Disabilities program”. |
| Contact phone | “1-833-425-2445” | CONFIRMED | “AccessOAP ... Toll-free: 1-833-425-2445”. |
| Published dollar amount; values | “no published dollar amount” | CONFIRMED | No dollar amount published on supplied overview. |
| Wait; metadata | “Not published” | CONFIRMED | No application processing interval published. |

### ottawa-a-card

Sources: `ottawa-a-card--1.txt` (reduced-fares overview).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Free route coverage / exclusion; amount, about, values | “free on every route except Para Transpo” | CONFIRMED | “The a-card , which lets you ride free on all routes except Para Transpo”. |
| Vision audience; summary, REQS.visionDisability | “blind or partially sighted” | CONFIRMED | “Persons who are blind or partially sighted”. |
| Proof / alternatives; eligibility, documents, REQS.aCardProof | “CNIB one-piece photo ID card ... Attorney-General of Ontario Guide Dog photo ID card” | CONFIRMED | “CNIB one-piece photo ID card or Attorney-General of Ontario Guide Dog photo ID card”. |
| Access Para alternative; note, tips | “Access pass ... Para Transpo” | CONFIRMED | “save one-third of the cash-fare price (per ride) on your Para Transpo trips”. |
| ODSP Community alternative | “Community Pass if you also receive ODSP” | CONFIRMED | “Persons receiving ODSP benefits”; “Community pass ... including Para Transpo”. This is a cross-reference, not a complete claim of Community eligibility. |
| Issuance channel; steps[1], metadata | “Customer Service Centre to get the a-card” | NOT ON PAGE | No a-card issuance channel provided; navigation and youth discount locations do not establish this. |
| City program; REQS.ottawa | “City of Ottawa program” | CONFIRMED | “OC Transpo”; “City of Ottawa”. |
| Wait; metadata | “Not published” | CONFIRMED | No a-card processing interval published. |

### ssah

Sources: `ssah--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Funding purpose / disability types; amount, summary, about | “respite ... day-to-day activities ... grow and develop ... physical and/or developmental disability” | CONFIRMED | “child with a developmental and/or physical disability”; “day-to-day activities”; “growth and development”; “respite services”. |
| Discretion/resources / no guarantee; note, about, values, REQS.ssahDocumentation | “discretionary ... according to available resources” | CONFIRMED | “SSAH is a discretionary program where funding is provided according to available resources.” |
| Complementary services | “complement ... including clinical services” | CONFIRMED | “meant to complement other services and supports a child may be receiving, including clinical services”. |
| Age; eligibility, REQS.child | “under 18” | CONFIRMED | “be under 18 years old”. |
| Disability support level | “extra support, beyond what is expected for their age ... daily activities” | CONFIRMED | “need extra support, beyond what is expected for their age ... daily activities at home and in the community”. |
| Residence / legal status; eligibility, REQS.on | “resident of Ontario and legally entitled to live in Canada” | CONFIRMED | “be a resident of Ontario and legally entitled to live in Canada”. |
| Home / separate residence route | “main caregiver ... separately without ... government-funded ... residential” | CONFIRMED | “live at home with their main caregiver or live separately ... without support from other government-funded out-of-home (residential) services”. |
| Status examples / visitors | “citizen ... permanent resident ... Temporary Resident Permit ... refugee ... Visitors ... not eligible” | CONFIRMED | “citizen, permanent resident, holder of a Canadian Temporary Resident Permit or a refugee entitled to live in Canada”; “Visitors are not eligible.” |
| One decision-maker applies | “Only one person with decision-making responsibility” | CONFIRMED | “Only one individual with decision-making responsibility for the child can apply”. |
| Functional documentation; steps, documents, metadata, REQS.ssahDocumentation | “regulated health professional ... functional limitations” | CONFIRMED | “documentation of the child's functional limitations ... A regulated health professional must provide this documentation.” |
| Professional list; tips[0] | “physician, psychologist, psychological associate, nurse practitioner, registered nurse or registered practical nurse, ophthalmologist, optometrist, audiologist, physiotherapist, occupational therapist, psychotherapist, social worker, speech language pathologist, or behaviour analyst” | CONFIRMED | “physician psychologist psychological associate nurse practitioner registered practical nurse registered nurse ophthalmologist audiologist optometrist physiotherapist psychotherapist occupational therapist social worker speech language pathologist behaviour analyst”. |
| Ontario proof examples | “school registration ... valid Ontario driver's licence ... utility bill” | CONFIRMED | “child's school registration document, your valid Ontario driver’s license or your utility bill”. |
| Legal proof examples | “Canadian passport or birth certificate, Certificate of Indian Status, Permanent Resident card, immigration documents ... Temporary Resident Permit” | CONFIRMED | “Canadian passport Canadian birth certificate Certificate of Indian Status Permanent Resident card ... immigration documents ... Canadian Temporary Resident Permit”. |
| Age proof examples | “birth or baptismal certificate, Ontario health card, or passport” | CONFIRMED | “birth or baptismal certificate Ontario health card passport”. |
| Daily support examples | “daily routines and self-care, sensory items, tutoring ... safe” | CONFIRMED | “daily routines”; “sensory needs”; “self-care”; “keep the child safe”; “tutoring”. |
| Growth examples | “building a skill ... family and social ... fitness ... future” | CONFIRMED | “build a skill”; “family activity”; “social activity”; “physical activity”; “plan for the child’s future”. |
| Respite examples | “worker, camp fees, overnight or daytime ... school care ... PA days ... March and summer breaks ... household help ... training” | CONFIRMED | “hiring someone”; “Camp expenses”; “overnight respite”; “daytime program”; “before and/or after school care and care during PA Days, March breaks, summer breaks”; “household responsibilities”; “Training for the main caregiver”. |
| Hiring / family age / exclusions | “hire ... agency ... family member over 18 ... not ... main caregiver, parent, step-parent or spouse” | CONFIRMED | “hire someone yourself work with an agency ... hire a family member over 18 who isn't the main caregiver, parent, step-parent, or spouse”. Page itself uses over 18 here, although elsewhere excludes under 18. |
| Parent payment absolute bar | “parent, step-parent or spouse can never be paid” | CONFIRMED | “A parent, step-parent, or spouse cannot be paid for any services they provide with SSAH funding”. |
| Other government funding / ADP / HVMP exclusions | “will not reimburse anything already funded ... devices ... ADP ... home or vehicle changes ... HVMP” | CONFIRMED | “Items, supports and services that are funded/provided through other government programs”; “Assistive devices ... Assistive Devices Program”; “Structural changes ... Home and Vehicle Modification Program”. |
| Living / transport / dental / school exclusions | “basic living expenses, transportation, dental care, private school tuition” | CONFIRMED | “Basic Living Expenses”; “Transportation expenses”; “Dental care and related services”; “Private school tuition”. |
| Therapy / assessments exclusions | “ABA, speech-language ... occupational or physical therapy ... psychotherapy” | CONFIRMED | “Assessments and hands-on therapy such as: applied behavioral analysis ( aba ) speech-language therapy occupational therapy physical therapy ... psychotherapy”. |
| Application regional submission; steps, metadata | “Send ... local Ministry regional office” | CONFIRMED | “paper copy ... fill out and send to your local regional office”. This is a valid paper route, not asserted as the only available route. |
| Funding administration / reimbursement | “manage ... yourself or ... agency ... expenses ... reimbursed” | CONFIRMED | “two options ... Managing your own SSAH funding ... submit expense claims ... Funding managed by an agency”. |
| Claim duration | “one year from your funding end date” | CONFIRMED | “You have one year from your Funding End Date to submit your expenses.” |
| Dated claim deadline | “April 1, 2025 and March 31, 2026 ... March 31, 2027” | CONFIRMED | “between April 1, 2025, and March 31, 2026 ... submit your expense claims by March 31, 2027”. |
| Infant statement | “without a definitive diagnosis ... probability of delay and risk of further delay” | DIFFERS | “written statement describing the probability or presence of delay and risk of further delay that will result in ongoing functional limitations”. Dropped presence-of-delay alternative and ongoing-functional-limitations condition. |
| Infant re-evaluation age | “decided again at about age 6” | CONFIRMED | “in the case of an infant without a diagnosis ... again at approximately 6 years of age”. |
| Dollar amount; amount, values | “no published amount” | CONFIRMED | No dollar entitlement published. |
| Application wait; metadata | “Not published” | CONFIRMED | Reimbursement/review intervals exist, not initial application processing interval. |

### waterloo-curbside-waste-support

Sources: `waterloo-curbside-waste-support--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Two regional routes; summary, about, eligibility.note, REQS.waterlooRegion | “two support programs ... extra medical-related waste and/or ... disability or physical limitation” | CONFIRMED | “offers two support programs for residents who create extra medical-related waste, and/or live with a disability or physical limitation”. |
| Assisted audience; eligibility.items[0], aboutList.items[0], REQS.waterlooWasteSupportApproval | “disability or physical limitation ... no ... someone available to help” | DIFFERS | “do not have someone available to help them”; “available to eligible households that receive municipal curbside waste collection”. Dropped municipal-curbside-collection household condition in stated assisted route. |
| Assisted scope; note | “only for moving ... black ... and green ... carts” | DIFFERS | “Collected: Region-issued black garbage cart Region-issued green organics cart Tagged bags”. Scope: “only” omits tagged bags included by page. |
| Handling restrictions; note, aboutList, tips | “not empty indoor containers ... agreed set-out location ... regular schedule ... not enter homes or garages” | CONFIRMED | “does not include emptying indoor containers into carts, moving carts from anywhere other than the agreed upon set-out location, or collecting waste outside your regular schedule”; “will not enter homes or garages”. |
| Medical waste categories; eligibility.items[1], aboutList.items[3] | “extra garbage ... packaging, incontinence products or unrecyclable medical waste” | CONFIRMED | “medical needs that create extra garbage (such as packaging, incontinence products, or unrecyclable medical waste)”. These examples repeat the page; not an express assertion that hazardous waste is accepted. |
| Medical benefit / approval hedge; amount, about, values, tips, REQS.waterlooWasteSupportApproval | “approved applicants ... 30 ... per year at no charge” | CONFIRMED | “Approved applicants receive 30 garbage bag tags per year at no charge.” |
| Extra bag placement | “tagged and placed beside the garbage cart” | CONFIRMED | “Extra garbage bags must be tagged and placed beside the garbage cart.” |
| Application to Region; steps, metadata, REQS.waterlooWasteSupportApproval | “apply ... Region ... first” | CONFIRMED | “Submit an online application form”; “You can also apply by calling our Service First Contact Centre”. General direction to apply, not a claim that no medical confirmation is needed. |
| Agreed set-out location; steps[2] | “agree on the cart set-out location” | CONFIRMED | “staff will contact you to schedule a site visit to determine an agreed upon set-out location”. |

Metadata wait “Ask the Region about current processing time” is advice, not a claim that no time is published; excluded from counts. Page does publish “staff will typically review within 5 business days”.

### waterloo-homemaking-support

Sources: `waterloo-homemaking-support--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Delivery / independence; summary, about | “Region funds agencies ... live independently” | CONFIRMED | “Region of Waterloo funds agencies to provide support to people who need assistance to live independently”. |
| Services; amount, summary, aboutList, values | “Light housekeeping, meal planning and preparation, and laundry” | CONFIRMED | “Light housekeeping Meal planning and preparation Laundry”. |
| Waitlist / hedges / exception; summary, about, tips, values, metadata | “currently approximately 2–3 years, except under special circumstances” | CONFIRMED | “The waitlist is currently approximately 2–3 years , except under special circumstances.” |
| Top-of-list disclosures; note, eligibility.note, steps, documents, metadata, REQS.waterlooHomemakingNeed | “full ... financial and health information ... top of the waitlist” | CONFIRMED | “Once you reach the top of the waitlist, full disclosure of financial and health information is required to confirm eligibility.” |
| Region residence; eligibility, REQS.waterlooRegion | “live in Waterloo Region” | CONFIRMED | “Live in Waterloo Region”. |
| Financial alternatives; eligibility.items[1], REQS.waterlooHomemakingNeed | “low income or social support” | CONFIRMED | “Meet the financial criteria (low income/social support)”. |
| Generic low-income gate; REQS.lowIncome | “for lower-income households” | DIFFERS | “financial criteria (low income/social support)”. Scope: categorical social-support route is not preserved in the unqualified low-income gate description. |
| Functional impairment | “significant functional impairments ... homemaking tasks” | CONFIRMED | “Have significant functional impairments that affect your ability to complete homemaking tasks”. |
| Health/aging reasons | “illness, recovery from injury, aging or disability” | CONFIRMED | “Need help at home due to illness, recovery from injury, aging, or disability”. |
| Funding sources | “fully funded ... Ministry of Health and ... Region of Waterloo” | CONFIRMED | “fully funded through the Ministry of Health and the Region of Waterloo”. |
| Caredove application / waitlist; steps, metadata | “application through Caredove”; “Join the waitlist” | CONFIRMED | “Applications ... managed through Caredove. To apply or be added to the waitlist”. |
| No-login troubleshooting route | “I'm signing up for myself, a family member or a friend ... without ... login” | CONFIRMED | “select “I'm signing up for myself, a family member or a friend” without requiring login credentials”. |
| Crisis cleans / conditions / hedge | “may be considered ... serious and immediate threat ... safety and/or housing stability ... unsanitary ... infestation or hoarding” | CONFIRMED | “Crisis cleans may be considered when there is a serious and immediate threat to a household’s safety and/or housing stability (e.g., severe unsanitary conditions, infestation, or hoarding).” |
| Coordinator phone / extension; tips, phone | “519-893-8494 ... 6342” | CONFIRMED | “Homemaking Coordinator at 519-893-8494 , extension 6342”. |

### windsor-recreation-assistance

Sources: `windsor-recreation-assistance--1.txt`. Linked Eligibility Requirements page is not supplied.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Discount / tax basis; amount, summary, about, values | “90% ... registration fees, before taxes” | CONFIRMED | “90% off the program registration fee (before taxes)”. |
| Low-income regional audience; summary, REQS.lowIncome | “Windsor-Essex ... low-income households” | CONFIRMED | “Windsor-Essex residents living in low-income households”. |
| Local variability / application; note, steps, metadata | “may differ across municipalities ... local ... recreation department” | CONFIRMED | “program eligibility may differ across municipalities”; “To apply ... contact their local municipal recreation department”. |
| First-come funding | “first-come, first-served” | CONFIRMED | “Funding availability is based on a first-come, first-served basis.” |
| Local approval / budget limits | “all approvals ... local recreation department ... demands and budgets” | CONFIRMED | “All approvals will be determined by the local recreation department and are subject to local demands and budgets.” |
| Residence duration | “at least 30 days” | NOT ON PAGE | No residence duration on supplied page. |
| Residency proof requirement; eligibility, steps, documents, metadata | “demonstrate residency”; “proof of residency” | NOT ON PAGE | Required documents referenced generally; residency-document requirement not specified. |
| MBM boundary; eligibility.items[1], steps[0], REQS.p2pIncomeTest | “at, or below, the Market Basket Measure ... family size” | NOT ON PAGE | “income of all members within the household, as well as family size and availability of funding”; no MBM or income boundary published here. |
| Combined income assessment | “combined household income” | CONFIRMED | “income of all members within the household”. |
| No numeric thresholds / recreation referral | “page does not list ... thresholds ... local ... recreation department” | CONFIRMED | No income table or figures; “contact your local municipal recreation department”. |
| Transit threshold referral; REQS.p2pIncomeTest | “local municipal transit or recreation department” | NOT ON PAGE | Recreation department referral only; transit referral absent. |
| Sustained activity duration / hedge | “should run ... five weeks ... one session per week” | CONFIRMED | “Programs should be a minimum of five weeks in duration and include at least one session per week.” |
| Camp duration | “must last at least five consecutive days” | CONFIRMED | “day camps or specialty camps ... must last at least five consecutive days for consideration”. |
| Excluded activities | “competitive ... travel teams ... fitness centre orientations, personal training and private lessons” | CONFIRMED | “competitive activities, travel teams, fitness centre orientations, personal training and private lessons”. |
| P2P strategy / funding sources | “poverty-reduction strategy ... jointly funded ... City of Windsor and County of Essex” | NOT ON PAGE | Supplied recreation page does not state strategy/funding provenance. |
| Other program components | “Third Party Partnerships, Targeted Initiatives and Universal Programs” | CONFIRMED | “90% Recreation Discount, Third Party Partnerships, Targeted Initiatives and Universal Programs”. |
| Equipment/material exclusion; aboutList, values | “not equipment or material costs” | CONFIRMED | “Funding does not cover equipment and material costs.” |
| Delivery scope / organization approval | “municipal ... approved service organizations within Windsor-Essex County” | CONFIRMED | “directly delivered by municipal recreation departments and approved service organizations within Windsor-Essex County”. |
| Payment / advance reimbursement; aboutList.items[3] | “payment ... directly ... or ... reimbursement if ... paid in advance” | DIFFERS | “Payment is either issued directly ... or ... reimbursement”; “If you are requesting a reimbursement, it must be done within thirty [30] days of payment.” Dropped reimbursement deadline from asserted route. |
| Annual per-person funding / use / carryover | “per eligible person per calendar year ... used within ... not transferable ... next” | CONFIRMED | “per eligible person per calendar year”; “Approved funding must be used within the calendar year”; “not transferable from one year to the next”. |
| Change reporting deadline | “within 30 days ... change taking effect” | CONFIRMED | “notify their municipality of changes within thirty (30) days of the change taking effect”. |
| Individual transfer bar | “Eligibility is non-transferable” | CONFIRMED | “Program eligibility is non-transferable between individuals.” |
| Preferred income documents; documents[0] | “Canada Child Benefit ... Notice of Assessment ... OW ... ODSP ... CCB ... preferred” | NOT ON PAGE | No named income-document list or preference on supplied overview. |
| Residency document examples; documents[1] | “Driver's Licence ... Health Card ... Photo Card ... utility ... property tax ... lease ... mortgage ... bank statement” | NOT ON PAGE | No residency-document examples supplied. |
| Additional documents hedge | “Additional documentation may be requested” | NOT ON PAGE | Requires documents generally, not an additional-document request rule. |
| Endorsement route / contents / discretion; documents[3] | “Letter of Endorsement ... professional letterhead ... referring agency ... client's full name ... benefits ... barriers ... discretion” | NOT ON PAGE | No endorsement route or letter requirements stated. |
| City-only gate; REQS.windsor | “City of Windsor program” | DIFFERS | “Windsor-Essex residents”; “program eligibility may differ across municipalities”. Scope: generic city-specific requirement text is narrower than regional program coverage. |
| Wait; metadata | “Not published” | CONFIRMED | No processing interval published. |

### york-region-homemakers

Sources: `york-region-homemakers--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Cost help / hedge; amount, summary, about, values | “can help cover the cost of an in-home homemaker” | CONFIRMED | “York Region can help cover the cost of an in-home homemaker”. |
| Illness / disability duration; eligibility, tips, REQS.yorkHomemakersNeed | “temporarily or permanently ill or disabled” | CONFIRMED | “Be temporarily or permanently ill or disabled”. |
| Services | “laundry, meals and light housekeeping” | CONFIRMED | “Homemakers can help with laundry, meals and light housekeeping.” |
| Financial need; eligibility, about, metadata, REQS.yorkHomemakersNeed | “meet ... financial need requirements” | CONFIRMED | “Meet financial need requirements”. |
| Regional delivery; note, aboutList, REQS.yorkRegion | “York Region ... rather than your city” | CONFIRMED | “York Region can help cover the cost”; regional application contact provided. |
| Uniform municipalities / named coverage | “same ... Markham, Vaughan, Richmond Hill, Newmarket or Aurora”; “works the same across ... municipalities” | NOT ON PAGE | No municipal coverage list or assertion of uniform delivery rules. |
| Thresholds and amount absent; eligibility.note, values, REQS.yorkHomemakersNeed | “does not publish ... thresholds or ... amount ... on this page” | CONFIRMED | Eligibility mentions financial need without figures; no amount stated. |
| Broader absence online; steps[1] | “not published online” | NOT ON PAGE | Supplied page cannot establish absence from all online sources. |
| Application phone; steps[0], phone, metadata | “1-877-464-9675” | CONFIRMED | “To apply ... please call 1-877-464-9675”. |
| Application email; steps[0] | “ContactUs@york.ca” | NOT ON PAGE | Page rendering says “or email @email”; actual email address not exposed. |
| Health documentation; documents[0] | “Information about your illness or disability” | NOT ON PAGE | No document requirements stated. |
| Financial documentation; documents[1] | “Information about your finances” | NOT ON PAGE | Financial need rule stated, but no required information/documents enumerated. |
| Phone exclusivity; tips[1], REQS.yorkHomemakersNeed | “calling is the only way”; “need to call” | DIFFERS | “please call 1-877-464-9675 or email @email”. Scope: email alternative dropped from exclusive phone assertion. |
| Wait; metadata | “Not published” | CONFIRMED | No processing interval published. |

### york-region-recreation-subsidies

Sources: `york-region-recreation-subsidies--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Three subsidy types; amount, summary, aboutList | “PLAY ... summer day camp ... youth overnight camp” | CONFIRMED | “Positive Leisure Activities for Youth (PLAY) Summer day camp funding Youth overnight camp funding”. |
| Regional provision; summary, REQS.yorkRegion | “York Region funds subsidies” | CONFIRMED | “York Region offers subsidies for recreation programs, day camps and youth overnight camps.” |
| Low-income eligibility; eligibility.items[0], REQS.lowIncome | “child ... family with low income” | DIFFERS | “meet at least one ... Receive Rent Subsidy Receive Ontario Works , Ontario Disability Support Program or Assistance for Children with Severe Disabilities Receive Child Care Fee Subsidy with an annual income of $43,000 or less” (PLAY); overnight also lists housing communities; day camp has its own list. Dropped categorical routes and the $43,000 boundary for the specified child-care-subsidy route; low income alone does not reproduce published eligibility. |
| Regional residence | “live in a York Region municipality” | CONFIRMED | “Families who live in York Region”. |
| Under-18-only gate; REQS.child | “children under 18” | DIFFERS | “assist children ages four to 18 and single parents”. Boundary/scope: PLAY includes age 18 and single parents; universal child gate excludes these routes and does not preserve PLAY's minimum age four. |
| Overnight age / approved camp; summary, about, eligibility.note | “eligible youth aged 12 to 17 ... approved overnight camp” | CONFIRMED | “eligible youth ages 12 to 17 attend an approved overnight camp”. |
| Municipal delivery, recreation/day camp | “recreation program and day camp ... municipal recreation departments” | CONFIRMED | “Recreation programs and day camp subsidies ... programs offered by the municipal recreation departments”. |
| Universal municipal delivery; aboutList.items[3] | “programs themselves are run by your municipal recreation department” | NOT ON PAGE | Municipal operation is explicit for recreation/day camps, but overnight funding is for an “approved overnight camp”. Page does give municipal registration instructions for overnight funding too; that does not establish that every approved overnight camp is municipally operated. |
| No guaranteed space; note, aboutList, tips | “does not guarantee ... space” | CONFIRMED | “York Region does not guarantee space in programs or camps.” |
| City-site search impossibility; note, tips[0] | “Search on your city's site will not find this” | NOT ON PAGE | No assertion that municipal websites cannot surface regional subsidies. |
| Regional application; steps[1], metadata | “Apply through York Region” | CONFIRMED | “Online Application for Recreation Subsidy”; “Call: Access York at 1-877-464-9675”. |
| Approval / municipal registration; steps[2], metadata | “Apply ... then register”; “Register with your municipal recreation department” | CONFIRMED | “confirmation of your eligibility along with detailed municipal program registration instructions”; “Once you are approved, please check with your local municipality for program registration dates.” These instructions appear for all three subsidies. |
| Family income document; documents[0] | “Information about your family's income” | NOT ON PAGE | Eligibility criteria stated but no general income-document requirement on supplied page. |
| Named municipalities; tips[2] | “Aurora, East Gwillimbury, Georgina, King, Newmarket, Markham, Richmond Hill, Vaughan and Whitchurch-Stouffville” | CONFIRMED | “Town of Aurora Town of East Gwillimbury Town of Georgina Township of King Town of Newmarket City of Markham City of Richmond Hill City of Vaughan Town of Whitchurch-Stouffville”. |
| Dollar entitlement; values | “no published amount” | CONFIRMED | No subsidy entitlement amount published; $43,000 is an income threshold, not funding amount. |
| Wait; metadata | “Not published” | CONFIRMED | Phone queue warning but no application decision interval published. |
