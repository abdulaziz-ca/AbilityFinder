# Snapshot re-verification report — 2026-10-17, batch 8

## Method and scope

Evaluated `public/data.js` in a Node `vm` with `{window:{}, document:{}, console}` and exported `BENEFITS`, `BENEFIT_VALUES`, and `BENEFIT_META`, as in `scripts/check-readability.js`. Evaluated the isolated `REQS` declaration with external references stubbed; inspected unmet and short text for every listed requirement without calling matchers. No grep-parsing of benefit records. Repeated assertions are consolidated; distinct factual metadata is included. Internal flags, labels, URLs, difficulty ratings, and advice without factual assertions are not counted.

Facts count distinct assertions, not occurrences or numeric tokens. Inseparable amount/period and route/conditions may share a row; independent assertions are separate. CONFIRMED requires a supporting quotation. DIFFERS identifies number, boundary, hedge, dropped condition or scope inconsistencies. NOT ON PAGE means absent from supplied usable sources, not false. Hedges are checked both ways; a maximum hedge alone does not contradict a maximum unless the source fixes the amount. Source-only facts are not invented as record assertions, but conditions dropped from asserted routes are identified. Quotes are verbatim excerpts; filenames are relative to `research/reverify/snapshots/`. No linked content is presumed read. Contact numbers are compared for the same purpose, not against unrelated navigation numbers.

The report date is the requested batch label, not a fetch-date claim: supplied headers say 2026-10-15. **ODSP extra-care flag:** the `odspMedical` gate, ODSP's own disability determination, and the prescribed-class route are guardrails. Findings below are factual evidence classifications, not permission to alter gates or infer ODSP eligibility from disability answers.

## Summary table

| Record id | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| odsp | 32 | 23 | 1 | 8 |
| ottawa-access-pass | 14 | 7 | 0 | 7 |
| ottawa-community-pass | 16 | 8 | 0 | 8 |
| ottawa-equipass | 19 | 8 | 0 | 11 |
| ottawa-hand-in-hand | 22 | 0 | 0 | 22 |
| passport-program | 20 | 18 | 2 | 0 |
| toronto-fair-pass | 23 | 19 | 4 | 0 |
| toronto-welcome-policy | 25 | 23 | 2 | 0 |
| trillium-drug-program | 25 | 23 | 2 | 0 |
| waterloo-ontario-renovates | 42 | 13 | 2 | 27 |
| windsor-affordable-pass | 31 | 14 | 0 | 17 |
| grt-cnib-pass | 9 | 9 | 0 | 0 |
| grt-support-person | 12 | 10 | 2 | 0 |
| hamilton-fare-assist | 31 | 28 | 3 | 0 |
| **Total (14 records)** | **321** | **203** | **18** | **100** |

Counts are evidence-limited, not a declaration that unsupported assertions are false.

## DIFFERS — needs a decision

Each numbered item corresponds to one DIFFERS assertion row. No wording is proposed.

1. **odsp — `BENEFIT_META.effort`**
   - Current: “application + a Disability Determination Package”
   - Snapshot quote / difference: “If you are a member of a prescribed class, you do not have to complete this step.” Dropped prescribed-class exception in unqualified effort description.

2. **passport-program — `amount / note / detail.about / detail.aboutList / detail.steps[2–3] / detail.tips[1–2] / BENEFIT_VALUES.note`**
   - Current: “Every Passport recipient receives at least $5,500 a year”; “$5,500” additional-funding boundary
   - Snapshot quote / difference: “All Passport recipients receive the minimum funding amount of $5,665 annually”; “Apply to receive more than $5,665”. Number: baseline and additional-funding boundary increased.

3. **passport-program — `amount / note / detail.about / detail.aboutList.items[3] / BENEFIT_VALUES.note`**
   - Current: “up to $44,275”
   - Snapshot quote / difference: “up to a maximum of $45,604”. Number.

4. **toronto-fair-pass — `REQS.adult`**
   - Current: “people aged 18–64”
   - Snapshot quote / difference: “Be between 20 and 64 years of age”. Boundary: gate includes ages 18–19.

5. **toronto-fair-pass — `eligibility.items[3]`**
   - Current: “counting every family member over 18”
   - Snapshot quote / difference: Page also says “for all family members over the age of 18”, but calculation note says “Total annual net income will only be calculated for family members aged 20 to 64.” Scope/boundary conflict within page; record omits calculation restriction.

6. **toronto-fair-pass — `detail.tips[3]`**
   - Current: “Existing clients do not need to reapply”
   - Snapshot quote / difference: Intro repeats that phrase, but detailed section says “Some Fair Pass clients will be required to submit a new application”; active benefit clients “may not need to reapply”. Hedge/dropped condition: universal exemption conflicts with detailed renewal rules.

7. **toronto-fair-pass — `detail.tips[0]`**
   - Current: “Ontario Works, Emergency Assistance or ODSP ... without providing income documents”
   - Snapshot quote / difference: No-proof list is “Ontario Works (OW) ... Ontario Disability Support Program (ODSP) ... Toronto Children’s Services Child Care Fee Subsidy”. Scope: financial eligibility for EA is supported, but automatic proof waiver is extended beyond the stated list.

8. **toronto-welcome-policy — `detail.documents[0] / detail.steps[1] / BENEFIT_META.effort`**
   - Current: “Proof of income for each family member 18 or older”
   - Snapshot quote / difference: “You do not need to provide any proof of documents if ... Ontario Works (OW) ... ODSP ... Child Care Fee Subsidy”; “Program identification number ... OR Proof of documentation”. Dropped benefit-client alternative in mandatory document list.

9. **toronto-welcome-policy — `BENEFIT_META.wait`**
   - Current: “Not published”
   - Snapshot quote / difference: “outcome of your application within 5 business days”; “Processing times for paper applications can take up to 8 weeks”. Scope: page publishes processing times.

10. **trillium-drug-program — `summary / detail.about / detail.aboutList.items[2]`**
   - Current: “once you have paid it ... for the rest of the program year”
   - Snapshot quote / difference: Overview also says “until the end of the program year”, but detailed rule: “As each new quarter begins ... until you have paid off your deductible for that quarter ... coverage ... until the end of that quarter.” Dropped quarterly reset makes year-long copay assurance overbroad.

11. **trillium-drug-program — `eligibility.note`**
   - Current: “can include another person ... parent, grandparent or legal guardian ... dependent ... support”
   - Snapshot quote / difference: “Otherwise, you have to include ... another person, if you live together, one of you is a parent, grandparent or the legal guardian of the other, and one of you is dependent for support on the other”. Hedge: required inclusion presented as optional.

12. **waterloo-ontario-renovates — `amount / detail.about / detail.aboutList.items[0–1] / BENEFIT_VALUES.note`**
   - Current: “$25,000 ... repairs ... and/or up to $25,000 ... accessibility”
   - Snapshot quote / difference: “up to $25,000 in forgivable loans to keep your home in good repair or install accessibility features”. Scope: record describes separate repair/accessibility limits and contemplates funding above $25,000; overview states one up-to limit. Linked fact sheet not supplied to resolve this.

13. **waterloo-ontario-renovates — `eligibility.items[1] / REQS.waterlooRenovatesEligibility`**
   - Current: “maximum value of $600,000”
   - Snapshot quote / difference: “Assessed value of your home (Maximum of $600,00) (MPAC Assessment)”. Literal number discrepancy / malformed source figure; cannot confirm $600,000 from this snapshot.

14. **grt-support-person — `detail.steps[3] / detail.documents[2] / BENEFIT_META.effort`**
   - Current: “Unless the PAL shortcut applies, have a registered health professional complete”; “Otherwise: the part ... completed”
   - Snapshot quote / difference: “If you are not enrolled in the PAL program, the application should be completed by a registered health-care professional”. Hedge: should becomes required completed documentation; page also limits professionals to listed designations/Region approval, not any registered professional.

15. **grt-support-person — `BENEFIT_META.wait`**
   - Current: “Not published”
   - Snapshot quote / difference: “GRT will send you a letter within 14 calendar days of receiving your application indicating whether you have been approved.” Scope: decision turnaround is published.

16. **hamilton-fare-assist — `eligibility.items[1] / detail.steps[1]`**
   - Current: “Your total household income is at or below ... for your family size”
   - Snapshot quote / difference: “Hamilton residents who are recipients of Ontario Works, the Ontario Disability Support Program (ODSP) OR whose Total Household Net Income Amount is less than the amounts below, can apply”. Dropped categorical OW/ODSP route in universal income-test formulation.

17. **hamilton-fare-assist — `eligibility.note (six-person income limit)`**
   - Current: “$74,109”
   - Snapshot quote / difference: “6 persons $74.109”. Literal numeric punctuation differs (apparently a source typo); no silent normalization or claim that the intended threshold changed.

18. **hamilton-fare-assist — `detail.documents[0] / BENEFIT_META.effort`**
   - Current: “Proof of total household income for everyone in the household”
   - Snapshot quote / difference: “OW/ODSP Applicants: Provide Member ID. All Others: Include a current Notice of Assessment for all family members”; renewals “OW/ODSP Applicants: No income documentation needed”. Dropped benefit-client alternative.

## Skipped snapshots

None: all fourteen supplied requested-record snapshots have first-line `status: 200`.

Evidence limitations: `ottawa-hand-in-hand--1.txt` has no page body. It is not a non-200 skip; absent evidence remains NOT ON PAGE. Duplicate OC Transpo reduced-fares pages do not reproduce their linked pass-specific pages. Waterloo's linked fact sheet/application and Windsor's linked eligibility/fare details are not supplied. Literal source anomalies and internal page inconsistencies are identified rather than silently resolved.

## Per-record detail

### odsp

Sources: `odsp--1.txt`. **Extra-care flag:** preserve the medical gate, ODSP's own determination and prescribed-class route; see Method.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Single maximum; amount, about, values | “Up to $1,436/mo for a single person”; “July 2026” | CONFIRMED | “You could receive up to $1,436 a month for basic needs and shelter if you are single”; “took effect on July 1, 2026”. |
| Living expenses / health benefits | “basic needs and shelter ... prescription drugs and vision care” | CONFIRMED | “living expenses, including food, and rent”; “health benefits, including prescription drugs and vision care”. |
| Variable amount / family and medical travel | “depends on your family size, shelter costs and other income”; “may receive more ... transportation to medical appointments” | CONFIRMED | “total monthly income and available assets”; “housing costs”; “You may receive more ... transportation to medical appointments ... spouse or child”. |
| Ontario residence; REQS.on | “An Ontario resident” | CONFIRMED | “proof of residency in Ontario”. |
| Age; eligibility, steps, REQS.age18plus | “At least 18 years old” | NOT ON PAGE | Overview does not state minimum eligibility age. |
| Early application boundary | “up to six months before your 18th birthday” | NOT ON PAGE | No early-application age window. |
| Single asset ceiling; REQS.odspFinancial | “at or under $40,000 for a single person” | NOT ON PAGE | Asset verification described; no ceiling. |
| Couple asset ceiling; REQS.odspFinancial | “$50,000 for a couple” | NOT ON PAGE | No ceiling. |
| Financial need and factors; REQS.odspFinancial | “income, assets, living expenses, family size and shelter costs” | CONFIRMED | “in financial need”; application asks “total monthly income and available assets”, “housing costs”, “other expenses”; “immediate family members who live with you”. |
| Disability determination or prescribed class; about, eligibility, REQS.odspMedical | “meet the program's definition ... unless you are in a prescribed class” | CONFIRMED | “If you are a member of a prescribed class, you do not have to complete this step”; staff “determine if you meet the legislative definition of a person with a disability”. |
| Detailed disability definition; eligibility.note, REQS.odspMedical | “substantial mental or physical impairment ... continuous or recurrent ... one year or more ... direct and cumulative effect ... substantially restricts ... work, care for yourself, or ... community life” | NOT ON PAGE | Package asks duration, impairments and daily-life effects, but statutory definition and one-year threshold not reproduced. |
| Approved health professional / DDP | “verified by an approved health care professional” | CONFIRMED | “This package must be completed by an approved health care professional”. |
| CPP-D / QPP-D prescribed-class route; note, tips, REQS.odspMedical | “If you ... receive CPP-D or QPP-D ... prescribed class” | NOT ON PAGE | Prescribed-class exemption stated but class members not enumerated. |
| CDB exemption | “does not reduce your ODSP payment” | CONFIRMED | “it will not affect your eligibility for ODSP or the amount of your payment”. |
| Annual inflation adjustment and 2026 change | “adjusted each July; they rose 1.9% on July 1, 2026” | CONFIRMED | “tied to inflation and adjusted annually in July”; “increase of 1.9%”; “July 1, 2026”. |
| Online / phone / in-person and family application | “one application covering you and the immediate family who live with you ... by phone ... or in person” | CONFIRMED | “Submit one application for you and your immediate family members who live with you”; “over the phone”; “in-person by booking an appointment”. |
| Online duration | “about 20 to 30 minutes” | CONFIRMED | “In most cases, it takes 20 to 30 minutes”. |
| Application and TTY phone | “1-888-999-1142 (TTY 1-800-387-5559)” | CONFIRMED | “Social Assistance Support Line Toll-free: 1-888-999-1142 ... TTY: 1-800-387-5559”. |
| Review call deadline | “within 15 business days to book a verification appointment” | CONFIRMED | “will call you within 15 business days to schedule an appointment”. |
| Verification appointment | “verify your information and provide your documents” | CONFIRMED | “provide more information, like copies of bills or other documents, so we can verify”. |
| DDP return deadline and withdrawal/extension; steps, tips, REQS.odspMedical | “within 90 days ... treated as withdrawn unless ... written request for an extension ... approved” | NOT ON PAGE | Overview gives 90 business days for the adjudication letter, not a 90-day return deadline or withdrawal rule. |
| Identification / financial documents | “SIN ... OHIP cards and birth certificates ... Immigration papers ... Tax returns and banking information” | CONFIRMED | “social insurance numbers (SIN) OHIP cards birth certificates immigration papers tax returns banking information”. |
| Housing / child-care / disability expenses | “housing costs and other expenses, such as child care and disability-related expenses” | CONFIRMED | “housing costs other expenses (such as child care and disability related expenses)”. |
| Concurrent OW application and interim support | “Ontario Works is assessed first and can support you while ... reviewed” | CONFIRMED | “assessed first, and if you are eligible, you can receive financial assistance ... while we assess”. |
| Processing duration; tips, metadata wait | “may take a few months”; “A few months” | CONFIRMED | “The application process may take a few months.” Metadata is a duration estimate, not a guarantee. |
| Disability decision letter deadline | “within 90 business days” | CONFIRMED | “letter ... within 90 business days to let you know if your disability qualified”. |
| Financial decision deadline / review | “If no extra information ... within 15 business days ... 30 days to ask ... review” | CONFIRMED | “If no additional information is required ... within 15 business days”; “30 days to request ... review”. |
| Rapid reinstatement hedge | “may be eligible ... without ... disability assessment” | CONFIRMED | “you may be eligible for rapid reinstatement”; “without having to go through a disability assessment”. |
| Monthly payment timing / December hedge | “last business day ... December payments may be ... earlier” | CONFIRMED | “Payments are on the last business day of each month. December payments may be available earlier”. |
| Employment supports | “Employment Ontario also offers training, skills and experience help” | CONFIRMED | “Employment Ontario can help you get the training, skills, and experience ... find and keep a job”. |
| Exempt income/assets; REQS.odspFinancial | “child support, the Ontario Child Benefit, RDSP payments, and the home you own and live in” | NOT ON PAGE | Exemptions not enumerated; CDB exemption separately confirmed. |
| Universal DDP effort; BENEFIT_META.effort | “application + a Disability Determination Package” | DIFFERS | “If you are a member of a prescribed class, you do not have to complete this step.” Dropped prescribed-class exception in unqualified effort description. |

### ottawa-access-pass

Sources: `ottawa-access-pass--1.txt` (reduced-fares overview).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Monthly amount; amount, note, about, values | “$43.25 a month” | CONFIRMED | “Discounted monthly Access pass”; “ride for only $43.25”. |
| Para Transpo registration / proof; eligibility, documents, REQS.paraTranspoRegistered | “registered as a Para Transpo customer”; “registration number” | CONFIRMED | “Be registered as a Para Transpo customer”; “Para Transpo registration number”. |
| Ottawa program; REQS.ottawa | “City of Ottawa program” | CONFIRMED | “OC Transpo”; “City of Ottawa”. |
| Unlimited regular-system coverage | “unlimited travel on the O-Train and all non-Para Transpo buses” | CONFIRMED | “ride unlimited on the O-Train and all non Para Transpo buses”. |
| Per-trip saving | “about a third”; “one third of the cash-fare price” | CONFIRMED | “save one-third of the cash-fare price (per ride) on your Para Transpo trips”. |
| Para top-up; amount, note, about, values | “$2.75 ... each Para Transpo ride” | NOT ON PAGE | No top-up amount stated for Access. |
| ODSP Community comparison / price / no top-up | “Community Pass ... same $43.25 ... no top-up” | CONFIRMED | “Persons receiving ODSP benefits”; “Community pass ($43.25) ... including Para Transpo, without a top-up”. |
| Cash restriction | “Discounted fares cannot be used when paying cash” | NOT ON PAGE | Overview does not state cash-payment restriction. |
| ParaPay / ParaPass regular-system exclusion | “cannot be used on OC Transpo buses or the O-Train” | NOT ON PAGE | No such exclusion stated. |
| Discount setup; steps, metadata effort | “at ... Customer Service Centre, or by calling ... Customer Service” | NOT ON PAGE | No Access setup instructions. |
| Purchase window | “up to 14 days before the month begins” | NOT ON PAGE | No purchase window. |
| Daily fare cap | “Presto never costs more than $12.25 in a day” | NOT ON PAGE | No fare cap. |
| Monthly fare cap | “more than the monthly pass price in a month” | NOT ON PAGE | No monthly cap. |
| Published wait; metadata | “Not published” | CONFIRMED | Overview provides eligibility/proof/discounts, no processing time. |

### ottawa-community-pass

Sources: `ottawa-community-pass--1.txt` (body identical to Access overview).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Monthly and per-ride amounts; values | “$43.25 a month, or $1.75 a ride” | CONFIRMED | “Community pass ($43.25) or per-ride fare ($1.75)”. |
| Ottawa residence and ODSP receipt; eligibility, REQS.ottawa / ottawaOdspReceipt | “Ottawa resident ... receive benefits under ... ODSP” | CONFIRMED | “Be an Ottawa resident Receive benefits under the Ontario Disability Support Program (ODSP)”. |
| All-route coverage / Para no top-up | “all routes including Para Transpo ... no top-up” | CONFIRMED | “all routes, including Para Transpo, without a top-up”. |
| Community rural exclusion | “rural fare is not included” | CONFIRMED | “Rural fare not included”. |
| Access comparison monthly price | “Access passes ... $43.25 a month” | CONFIRMED | “Discounted monthly Access pass”; “ride for only $43.25”. |
| Access top-up comparison | “Access holders pay a $2.75 top-up ... Community ... cheaper” | NOT ON PAGE | Access top-up amount/comparative cost not given. |
| Access rural exclusion | “rural fare is not included in either” | NOT ON PAGE | Rural exclusion stated for Community, not Access. |
| ODSP proof / nine-digit number; REQS.ottawaOdspReceipt | “9-digit identification number on an ODSP document” | CONFIRMED | “ODSP number (9-digit identification number found on an ODSP document)”. |
| Transit proof alternatives; documents, REQS.ottawaOdspReceipt | “Presto card number or a Para Transpo ID number” | CONFIRMED | “a Presto card number OR Para Transpo ID number”. |
| Mandatory Presto / no cash | “you need a Presto card”; “must use a Presto card” | NOT ON PAGE | Proof alternatives do not establish universal payment-card rule; cash restriction not stated. |
| Discount setup channel / exclusivity; steps, tips, metadata effort | “Customer Service Centre ... or ... phone ... cannot be set anywhere else”; “not at a store” | NOT ON PAGE | No Community setup instructions or exclusivity. |
| Advance purchase window | “up to 14 days before the month starts” | NOT ON PAGE | No advance window. |
| Calendar-month validity | “only for the calendar month it is bought for” | NOT ON PAGE | No validity boundary. |
| Adult comparison | “$4.10 a ride and $138.50 a month” | NOT ON PAGE | “regular fare ($4.10)” in youth section does not state adult monthly price or the full adult comparison. |
| Guarantor professions | “lawyer, notary, registered social worker ... regulated health colleges” | NOT ON PAGE | Eligible guarantors link only; professions not enumerated. |
| Published wait; metadata | “Not published” | CONFIRMED | Eligibility/proof/discounts listed; no processing time. |

### ottawa-equipass

Sources: `ottawa-equipass--1.txt` (body identical to Access overview).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Monthly fare; amount, about, values | “$58.25 a month” | NOT ON PAGE | EquiPass amount not stated. |
| Per-ride fare; amount, about, values | “$1.75 a ride” | NOT ON PAGE | $1.75 belongs to Community in overview, not EquiPass. |
| Relative price hedge | “about half”; “roughly half”; “approximately half” | CONFIRMED | “EquiPass, which costs approximately half the cost of an Adult pass”. |
| Adult monthly comparison | “$138.50 adult monthly pass” | NOT ON PAGE | No adult monthly amount. |
| Adult per-ride comparison | “adult fare of $4.10” | NOT ON PAGE | Youth “regular fare ($4.10)” is not explicitly an adult comparison. |
| Ottawa program; summary, REQS.ottawa | “Ottawa”; “City of Ottawa program” | CONFIRMED | “OC Transpo”; “City of Ottawa”. Geographic eligibility not explicitly stated. |
| Ottawa-resident eligibility | “for Ottawa residents” | NOT ON PAGE | EquiPass eligibility table omits residence rule. |
| Income boundary; eligibility, REQS.lowIncome | “family income ... below ... Government of Canada” | CONFIRMED | “Have a family income below the low income threshold set by the Government of Canada”. |
| Social Services transport exclusion | “do not already receive transportation benefits from Social Services” | CONFIRMED | “DO NOT receive transportation benefits from Social Services”. |
| Form requirement; steps, documents, metadata effort | “EquiPass Application and Consent Form” | CONFIRMED | “Completed EquiPass Application and Consent Form”. |
| Tax year / alternate proof | “Notice of Assessment ... most recent taxation year ... other documentation” | CONFIRMED | “for the most recent taxation year”; “If you don&rsquo;t have a NOA, other documentation (question #28) can be used to apply.” |
| Community ODSP alternative | “Community Pass ... $43.25 ... includes Para Transpo ... without a top-up” | CONFIRMED | “Persons receiving ODSP benefits”; “Community pass ($43.25) ... including Para Transpo, without a top-up”. Comparison to $58.25 remains unsupported. |
| Mandatory Presto / no cash | “must use a Presto card ... not ... cash” | NOT ON PAGE | No payment-medium restriction for EquiPass. |
| Discount setup | “Customer Service Centre, or ... calling ... Customer Service” | NOT ON PAGE | No EquiPass setup channel stated. |
| Advance purchase | “up to 14 days before the month begins” | NOT ON PAGE | No advance window. |
| Guarantor professions | “lawyer, notary, registered social worker ... regulated health college” | NOT ON PAGE | Link only; no profession list. |
| Daily cap | “capped at $12.25 a day” | NOT ON PAGE | No cap. |
| Monthly cap | “monthly pass price over a month” | NOT ON PAGE | No cap. |
| Published wait; metadata | “Not published” | CONFIRMED | No processing time in overview. |

### ottawa-hand-in-hand

Sources: `ottawa-hand-in-hand--1.txt` (status 200, header only). No factual page-body evidence; not a non-200 skip.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Annual entitlement; amount, about, values | “$185 a year per person”; “each ... member of a family” | NOT ON PAGE | Empty body. |
| Eligible programming / department | “recreation and culture ... Recreation, Cultural and Facility Services Department” | NOT ON PAGE | Empty body. |
| Residence; eligibility, REQS.ottawa | “Only City of Ottawa residents” | NOT ON PAGE | Empty body. |
| Low-income route; summary, REQS.lowIncome | “residents with a low income” | NOT ON PAGE | Empty body. |
| Disability-family alternative | “a family member with a disability” | NOT ON PAGE | Empty body. |
| Agency-program alternative | “already take part in a community or social service agency program” | NOT ON PAGE | Empty body. |
| Applicant / dependant route | “on their own behalf or for a dependant” | NOT ON PAGE | Empty body. |
| All ages | “Residents of all ages are eligible” | NOT ON PAGE | Empty body. |
| Transfer rule | “parent or guardian ... all or part ... child in their household” | NOT ON PAGE | Empty body. |
| Contribution hedge | “encouraged to pay ... minimum of 25 per cent” | NOT ON PAGE | Empty body. |
| Identity / residence / financial proof | “proof of identity, residency and financial need ... copies of formal documentation” | NOT ON PAGE | Empty body. |
| ODSP / ACSD proof | “ODSP or Assistance for Children with Severe Disabilities ... proof of financial need” | NOT ON PAGE | Empty body. |
| Other benefit proof | “Essential Health and Social Supports ... Guaranteed Income Supplement” | NOT ON PAGE | Empty body. |
| Means-test proof | “means test using the Low Income Cut-Off” | NOT ON PAGE | Empty body. |
| Tax form proof | “T451E Notice of Assessment or Child Tax Benefit form” | NOT ON PAGE | Empty body. |
| Special circumstances hedge | “Special circumstances may also be considered” | NOT ON PAGE | Empty body. |
| OW application assistance | “ask your case worker to complete the application for you” | NOT ON PAGE | Empty body. |
| Form collection channels | “most staffed recreation facilities or ... Client Service Centre” | NOT ON PAGE | Empty body. |
| Submission / supervisor approval / in-person only; steps, tips, metadata effort | “supervisor reviews”; “only ... in person ... not online” | NOT ON PAGE | Empty body. |
| Registration timing / demand | “before ... registration ... popular programs fill up” | NOT ON PAGE | Empty body. |
| Comparison to other cities | “Unlike some other cities' subsidies” | NOT ON PAGE | Empty body; no comparative evidence. |
| Published wait; metadata | “Not published” | NOT ON PAGE | Empty body cannot establish what the page publishes. |

### passport-program

Sources: `passport-program--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Annual baseline; amount, note, about, steps, tips, values | “Every Passport recipient receives at least $5,500 a year”; “$5,500” additional-funding boundary | DIFFERS | “All Passport recipients receive the minimum funding amount of $5,665 annually”; “Apply to receive more than $5,665”. Number: baseline and additional-funding boundary increased. |
| Annual maximum; amount, note, about, values | “up to $44,275” | DIFFERS | “up to a maximum of $45,604”. Number. |
| Age; eligibility, REQS.age18plus | “18 or older” | CONFIRMED | “adults 18 years or older”. |
| Developmental disability; REQS.passportDevelopmental | “with a developmental disability” | CONFIRMED | “people with a developmental disability”. |
| Ontario residence; REQS.on | “resident of Ontario” | CONFIRMED | “residents of Ontario”. |
| School / living arrangement routes | “support ... while still in school ... left school ... family or independently in a supportive living arrangement” | CONFIRMED | “need support to participate in the community while still in school”; “have left school and are living either with family or independently in a supportive living arrangement”. |
| Assessment professional / registration / equivalent; documents, REQS.passportDso | “should be determined by a psychologist or psychological associate registered with the College of Psychologists of Ontario ... equivalent body in another province” | CONFIRMED | “should be determined by a psychologist or psychological associate registered with the College of Psychologists of Ontario or equivalent body in another province”. Shared requirement states Ontario professional; full record retains equivalent route. |
| Reimbursement / admissibility / annual allocation; summary, documents | “submit invoices and receipts ... admissible expenses ... up to ... annual ... allocation” | CONFIRMED | “submit invoices and receipts for admissible expenses”; “reimburse ... up to the amount of the annual funding allocation”. |
| Community / independence / caregiver respite purpose | “participate ... live as independently as possible ... caregivers ... break” | CONFIRMED | “participate in their communities and live as independently as possible”; “caregivers ... take a break”. |
| Covered supports | “community classes ... work, volunteer and daily life skills ... support worker ... person-directed planning ... temporary respite” | CONFIRMED | “take part in community classes or recreational programs develop work, volunteer and daily life skills hire a support worker create their own life plans ... person-directed planning ... get temporary respite”. |
| Administration | “funded by ... Ontario ... administered by local Passport agencies” | CONFIRMED | “funded by the Ontario Government and administered by local Passport Agencies”. |
| DSO application and confirmation; steps, REQS.passportDso, metadata effort | “DSO ... confirms ... eligible ... connects ... local Passport agency” | CONFIRMED | “DSO ... confirm if you are eligible”; “connect you with your local Passport agency”. |
| Additional funding contingency / assessment | “based on ... need and ... funding becoming available” | CONFIRMED | “After your local DSO fully assesses your needs, we might provide you with additional funding as it becomes available.” |
| Additional-funding package / transfer | “complete an application package ... information then goes to ... Passport agency” | CONFIRMED | “complete an application package”; “your information will be transferred to your local Passport Agency”. |
| Additional-funding waiting list | “agencies keep a waiting list for the additional amounts” | CONFIRMED | “Passport agencies keep the list of people who are waiting to receive additional Passport funding”. |
| Update / reprioritize | “Tell DSO if anything ... changes ... reassess and re-prioritize” | CONFIRMED | “let the DSO know if there are any changes ... reassess and prioritize you”. |
| First-year funding windows | “April and September ... full 12-month ... October and March ... 6-month ... full year after” | CONFIRMED | “April and September ... full year ... (12 months)”; “October and March ... half year ... (6 months) ... full year ... following year”. Baseline dollar amount separately differs. |
| Old-expense claim deadline | “on or before March 31, 2026 ... submitted by March 31, 2027” | CONFIRMED | “service or product received on or before March 31, 2026 ... claims by March 31, 2027”. |
| New-expense deadline / fiscal year | “From March 31, 2027 ... 12 months ... fiscal year ... March 31 ... bought on or after April 1, 2026” | CONFIRMED | “Starting March 31, 2027 ... 12 months after the end of each fiscal year (which ends every March 31)”; “on or after April 1, 2026”. |
| Published wait; metadata | “Not published” | CONFIRMED | “as it becomes available”; no fixed processing/wait duration. |

### toronto-fair-pass

Sources: `toronto-fair-pass--1.txt`. Page internally mixes over-18 income wording with a 20–64 calculation restriction; both are recorded below rather than silently choosing one.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Discount rate; amount, summary, values | “36% off adult single fares” | CONFIRMED | “36 per cent discount on adult single fares”. |
| Ride amounts / saving | “$2.10 instead of $3.30”; “$1.20” | CONFIRMED | “saving $1.20”; “$2.10 instead of the regular adult fare of $3.30”. |
| Monthly cap / trip count | “47 trips ... $98.70” | CONFIRMED | “no more than $98.70 per month ... after 47 paid trips in the same month”. |
| Coverage | “TTC and Wheel-Trans” | CONFIRMED | “TTC and Wheel‑Trans trips”. |
| Discount duration / PRESTO | “loaded ... PRESTO card for 12 months” | CONFIRMED | “12‑month discount on their PRESTO card”. |
| Fare-change hedge / payment basis | “subject to change ... paying with PRESTO” | CONFIRMED | “Amounts are subject to change and based on TTC fares using PRESTO payment”. |
| Toronto residence; REQS.toronto | “Live in the City of Toronto” | CONFIRMED | “Live in the City of Toronto”. |
| Record-specific age | “Between 20 and 64 years of age” | CONFIRMED | “Be between 20 and 64 years of age”. |
| Shared age gate; REQS.adult | “people aged 18–64” | DIFFERS | “Be between 20 and 64 years of age”. Boundary: gate includes ages 18–19. |
| PRESTO number | “Have a PRESTO card number” | CONFIRMED | “Have a PRESTO Card Number”. |
| Low-income boundary; eligibility, REQS.lowIncome | “below 75% ... Low-Income Measure After-Tax” | CONFIRMED | “below 75 per cent of the ... Low-Income Measure After-Tax (LIM-AT) threshold”. |
| Income ages; eligibility | “counting every family member over 18” | DIFFERS | Page also says “for all family members over the age of 18”, but calculation note says “Total annual net income will only be calculated for family members aged 20 to 64.” Scope/boundary conflict within page; record omits calculation restriction. |
| OW / EA / ODSP financial eligibility | “Ontario Works, Emergency Assistance or ODSP meet ... financial eligibility” | CONFIRMED | “Residents currently receiving assistance from Ontario Works (OW), Emergency Assistance or Ontario Disability Support Program (ODSP) meet the financial eligibility criteria”. |
| Alternative fare ages | “13 to 19 or 65 and over ... youth, student and seniors fares” | CONFIRMED | “between the ages of 13 and 19, or 65 and up, see TTC Fare Types ... youth, student and seniors fares”. |
| Annual review date / active-client review / contact contingency | “From August 1, 2026 ... active ... OW, ODSP and Child Care Fee Subsidy ... if ... cannot be verified ... contacted” | CONFIRMED | “Starting August 1, 2026 ... annual eligibility reviews. Active OW, ODSP and CCFS clients will be reviewed for renewal. If eligibility cannot be verified through City records, clients will be contacted”. |
| Universal no-reapplication claim; tips[3] | “Existing clients do not need to reapply” | DIFFERS | Intro repeats that phrase, but detailed section says “Some Fair Pass clients will be required to submit a new application”; active benefit clients “may not need to reapply”. Hedge/dropped condition: universal exemption conflicts with detailed renewal rules. |
| Income documents age; steps[1] | “proof of income ... every family member 18 or older” | CONFIRMED | “Income documents for you and any family members 18 years old or older”. Phone route separately restricts to 20–64; this is the general application instruction. |
| OW / ODSP / CCFS ID alternative; documents, steps, metadata effort | “program identification number instead” | CONFIRMED | “Program identification number ... OW Member ID ... ODSP Member ID ... Household/ Client File Number ... OR Proof of income documentation”. |
| EA no-income-documents claim; tips[0] | “Ontario Works, Emergency Assistance or ODSP ... without providing income documents” | DIFFERS | No-proof list is “Ontario Works (OW) ... Ontario Disability Support Program (ODSP) ... Toronto Children’s Services Child Care Fee Subsidy”. Scope: financial eligibility for EA is supported, but automatic proof waiver is extended beyond the stated list. |
| Application channels / interpretation / paper / office | “online ... Human Services Integration Office ... phone for social assistance recipients ... language interpretation ... paper” | CONFIRMED | “apply online”; “Human Services Integration Office also supports applications by phone for Social Assistance recipients, access to language interpretation and paper applications upon request”. |
| Application phone; detail.phone | “416-338-8888” | CONFIRMED | “assistance ... questions about the application ... 416-338-8888”. |
| Email / address / family information | “email address ... Toronto address ... each family member living with you” | CONFIRMED | “Provide an email address Provide your Toronto address Enter information for yourself and each family member living with you”. |
| Published wait; metadata | “Not published” | CONFIRMED | No fixed application processing duration; missing documents “increase the processing time”. |

### toronto-welcome-policy

Sources: `toronto-welcome-policy--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Child/youth annual credit / age; amount, values | “$683.04 ... up to 24” | CONFIRMED | “Amounts Per Year”; “Child/Youth (up to age 24): $683.04”. |
| Adult annual credit / age; amount, values | “$314.60 ... 25 and over” | CONFIRMED | “Adult/Older Adult (age 25 and over): $314.60”. |
| City recreation credit / programming | “registered programs, instructional swim and sport, camps, after-school care” | CONFIRMED | “all registered recreation programs including any instructional swim and sports programs, camps, after-school care programs”. |
| Membership scope | “memberships and multi-use passes, including Junior Golf and Ski memberships” | CONFIRMED | “all memberships and multi-use passes (including Junior Golf and Ski memberships)”. |
| Duration / start | “12 months from ... application ... approved” | CONFIRMED | “valid for 12 months, from the date an application is approved”. |
| No carryover | “does not carry over into the next year” | CONFIRMED | “Financial credits do not carry over into the next year”. |
| No transfer | “not transferable between family members” | CONFIRMED | “Amounts are non-transferable between family members”. |
| Annual renewal / documents | “re-apply and submit documents each year” | CONFIRMED | “re-apply and submit required documents each year”. |
| Main applicant age | “18 years of age or older” | CONFIRMED | “Be 18 years of age or older (Main Applicant)”. |
| Toronto residence; REQS.toronto | “live in the city of Toronto” | CONFIRMED | “Live in the city of Toronto”. |
| Income threshold / age; eligibility, tips, REQS.lowIncome | “below ... LIM-AT”; “Only income ... aged 18 and over” | CONFIRMED | “below the Low-Income Measure After-Tax (LIM-AT) threshold”; “only ... family members aged 18+”. Page also uses “over the age of 18”; explicit 18+ calculation note supports inclusive tip. |
| Threshold update / data year / annual changes | “February 25, 2026 ... LIM-AT 2023 ... updates ... annually” | CONFIRMED | “last updated February 25, 2026 to reflect LIM-AT 2023 data”; “LIM-AT changes annually”. |
| Income table: one | “$30,255 for 1 person” | CONFIRMED | “1 person $30,255”. |
| Income table: two | “$42,787 for 2” | CONFIRMED | “2 people $42,787”. |
| Income table: three | “$52,403 for 3” | CONFIRMED | “3 people $52,403”. |
| Income table: four | “$60,510 for 4” | CONFIRMED | “4 people $60,510”. |
| Income table: five | “$67,652 for 5” | CONFIRMED | “5 people $67,652”. |
| Income table: six | “$74,109 for 6” | CONFIRMED | “6 people $74,109”. |
| Income table: seven | “$80,047 for 7” | CONFIRMED | “7 people $80,047”. |
| Administration | “Human Services Integration Office” | CONFIRMED | “administered by the Social Development Division, Human Services Integration Office (HSIO)”. |
| Universal income-document requirement; documents[0], steps, metadata effort | “Proof of income for each family member 18 or older” | DIFFERS | “You do not need to provide any proof of documents if ... Ontario Works (OW) ... ODSP ... Child Care Fee Subsidy”; “Program identification number ... OR Proof of documentation”. Dropped benefit-client alternative in mandatory document list. |
| Family information / required documents | “Documents for each family member included in the application” | CONFIRMED | “provide required documents for each family member”. Specific proof waiver separately differs above. |
| City application / help phone | “Apply through the City ... 416-338-8888” | CONFIRMED | “Apply for Welcome Policy”; “questions about the application ... 416-338-8888”. |
| Adding family / temporary-care children and phone | “new family members or children in your temporary care ... 416-338-8888” | CONFIRMED | “new family members or new children in your temporary care ... Human Service Integration Office at 416-338-8888”. |
| Published wait; metadata | “Not published” | DIFFERS | “outcome of your application within 5 business days”; “Processing times for paper applications can take up to 8 weeks”. Scope: page publishes processing times. |

### trillium-drug-program

Sources: `trillium-drug-program--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Ontario / health card; REQS.on | “live in Ontario ... valid Ontario health card number” | CONFIRMED | “live in Ontario have a valid Ontario health card number”. |
| ODB exclusion / OW example; REQS.tdpDeductible | “do not already qualify ... Ontario Drug Benefit ... Ontario Works” | CONFIRMED | “do not already qualify for the Ontario Drug Benefit program (for example ... Ontario Works)”. |
| Insurance exclusion; REQS.tdpDeductible | “not ... insurance ... 100% of your drugs” | CONFIRMED | “do not have an insurance plan that pays for 100% of your drugs”. |
| Drug-spending threshold; REQS.tdpDeductible | “about 4% or more ... after-tax household income” | CONFIRMED | “spend about 4% or more of your after-tax household income on prescription-drug costs”. |
| Deductible hedge / basis; amount, about, values | “For most people ... about 4% ... after-tax household income” | CONFIRMED | “For most people, the deductible ... equals about 4% of the household income after taxes”. |
| Post-deductible copay maximum | “up to $2 for each drug filled or refilled” | CONFIRMED | “up to $2 for each drug that is filled or refilled”. |
| Post-payment duration; summary, about/aboutList | “once you have paid it ... for the rest of the program year” | DIFFERS | Overview also says “until the end of the program year”, but detailed rule: “As each new quarter begins ... until you have paid off your deductible for that quarter ... coverage ... until the end of that quarter.” Dropped quarterly reset makes year-long copay assurance overbroad. |
| ODB medication count | “more than 5,900 medications” | CONFIRMED | “more than 5,900 medications ... Ontario Drug Benefit program”. |
| EAP count / hedge | “almost 1,500 additional drug products ... specific criteria” | CONFIRMED | “almost 1,500 additional drug products that meet specific criteria through the Exceptional Access Program”. |
| Household application / spouse | “apply as a household ... includes your spouse” | CONFIRMED | “apply ... as a household”; “you have to include: your spouse”. |
| Related dependent household inclusion hedge; eligibility.note | “can include another person ... parent, grandparent or legal guardian ... dependent ... support” | DIFFERS | “Otherwise, you have to include ... another person, if you live together, one of you is a parent, grandparent or the legal guardian of the other, and one of you is dependent for support on the other”. Hedge: required inclusion presented as optional. |
| Previous-year net income / line | “previous tax year ... line 23600 ... Notice of Assessment” | CONFIRMED | “previous tax year ... amount shown on line 23600 of your Notice of Assessment”. |
| RDSP subtraction / line | “minus ... Canadian Registered Disability Savings Plan ... line 12500” | CONFIRMED | “minus any amount you withdraw from your Canadian Registered Disability Savings Plan (amount shown on line 12500 of your tax return)”. |
| Out-of-pocket / excluded payers | “Only ... out of pocket ... private insurance, a drug company or a discount card do not” | CONFIRMED | “Only money ... spent out-of-pocket on eligible drugs”; “private insurance, a drug company or a drug discount card ... will not count”. |
| Four equal quarterly amounts | “four equal quarterly amounts ... four quarters” | CONFIRMED | “divide it into four equal amounts (quarterly deductible) ... four equal periods (quarters)”. |
| Program year | “August 1 to July 31” | CONFIRMED | “program year is from August 1 to July 31”. |
| Application cutoff for prior-year drugs | “Apply by September 30 ... previous program year” | CONFIRMED | “apply by September 30 to be reimbursed ... previous program year”. |
| Online application site; metadata effort | “Ontario Drug Benefit Program Online Applications and Forms website” | CONFIRMED | “Application available on the Ontario Drug Benefit Program Online Applications and Forms website”. |
| Paper request / phone / email | “request a paper form and guide by phone or email” | CONFIRMED | “request a paper copy ... telephone ... email”. |
| Confirmation letter | “deductible for the year and ... everyone covered” | CONFIRMED | “annual deductible and list all the household members included in the coverage”. |
| Provider notice | “Tell your pharmacist, doctor or nurse practitioner ... covered” | CONFIRMED | “Tell your pharmacist, doctor, or nurse practitioner ... prescribe ... drugs covered by the Ontario Drug Benefit Program”. |
| Receipt evidence | “Receipts for eligible drugs ... paid ... out of pocket” | CONFIRMED | “submit your receipts online”; “Out-of-pocket expenses ... ODB-eligible drug products ... counted toward ... deductible”. |
| Automatic renewal condition | “automatically every year if you file ... taxes on time ... annual confirmation letter” | CONFIRMED | “renewed automatically every year if you file your income taxes on time ... annual confirmation letter”. |
| Program phone | “1-800-575-5386” | CONFIRMED | “toll-free: 1-800-575-5386”. |
| Published wait; metadata | “Not published” | CONFIRMED | Page discusses “timely processing” without a processing-time figure. |

### waterloo-ontario-renovates

Sources: `waterloo-ontario-renovates--1.txt` (program page only; linked fact sheet/application not supplied). Literal malformed home-value figure is retained below, not silently repaired.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Repair/accessibility maximum; amount, about/aboutList, values | “$25,000 ... repairs ... and/or up to $25,000 ... accessibility” | DIFFERS | “up to $25,000 in forgivable loans to keep your home in good repair or install accessibility features”. Scope: record describes separate repair/accessibility limits and contemplates funding above $25,000; overview states one up-to limit. Linked fact sheet not supplied to resolve this. |
| Per-dwelling limit | “per dwelling” | NOT ON PAGE | No per-dwelling unit stated. |
| Funding-limit hedge | “limits may be subject to change” | NOT ON PAGE | Page says limited funding each year, not that limits may change. |
| Qualified homeowner / regional / income route; REQS.waterlooRegion, homeowner, lowIncome | “qualified ... homeowners in Waterloo Region”; “must own” | CONFIRMED | “Region of Waterloo”; “income eligibility criteria and own a home”; “keep your home in good repair”. Occupancy/sole-principal-residence rule separately unsupported. |
| Forgivable loan | “fully forgivable loan” | CONFIRMED | “forgivable loans”. Conditions/duration separately unsupported. |
| Forgiveness period | “over 10 years” | NOT ON PAGE | No loan duration. |
| No-repayment conditions | “remains the owner, lives in the home and does not default” | NOT ON PAGE | No forgiveness conditions. |
| Accessibility grant portion | “up to $5,000 ... does not require repayment” | NOT ON PAGE | No grant portion. |
| Security threshold / promissory note | “up to and including $25,000 ... promissory note” | NOT ON PAGE | No security requirements. |
| Mortgage security boundary | “exceeds $25,000 ... mortgage registered on title” | NOT ON PAGE | No registered-mortgage rule. |
| Annual income-limit updates; table caption, eligibility.note | “All income maximums updated annually” | NOT ON PAGE | No income table or update frequency. |
| Income maximum: one | “$41,210” | NOT ON PAGE | No income table. |
| Income maximum: two | “$51,204” | NOT ON PAGE | No income table. |
| Income maximum: three | “$63,072” | NOT ON PAGE | No income table. |
| Income maximum: four | “$76,577” | NOT ON PAGE | No income table. |
| Income maximum: five | “$86,853” | NOT ON PAGE | No income table. |
| Income maximum: six | “$97,956” | NOT ON PAGE | No income table. |
| Income maximum: seven-plus | “$109,060” | NOT ON PAGE | No income table or seven-plus boundary. |
| Family-size calculation; eligibility, REQS.waterlooRenovatesEligibility | “maximum income for its family size” | NOT ON PAGE | Income eligibility stated, not family-size calculation. |
| Sole/principal home / other-property exclusion; REQS.waterlooRenovatesEligibility | “sole and principal residence ... cannot own other property ... cottage ... partial ownership” | NOT ON PAGE | No sole-residence or other-property exclusion. |
| Home value; eligibility, REQS.waterlooRenovatesEligibility | “maximum value of $600,000” | DIFFERS | “Assessed value of your home (Maximum of $600,00) (MPAC Assessment)”. Literal number discrepancy / malformed source figure; cannot confirm $600,000 from this snapshot. |
| Current taxes / mortgage; documents, REQS.waterlooRenovatesEligibility | “Property taxes and mortgage payments are up to date” | NOT ON PAGE | No payment-status condition. |
| Full-value insurance; documents, REQS.waterlooRenovatesEligibility | “Insurance coverage ... full value of the home” | NOT ON PAGE | No insurance condition. |
| Disability tax-credit deduction / lines / year | “previous year ... line 316 or 318 ... tax credit for Persons with Disabilities” | NOT ON PAGE | No income deduction rule. |
| Government funding / delivery | “Region ... federal and provincial ... Ontario Priorities Housing Initiative” | CONFIRMED | “funded by the federal and provincial governments through the Ontario Priorities Housing Initiative (OPHI)”. |
| Eligible repairs | “roofs, walls or foundations; doors and windows; plumbing; fire safety; electrical ... heating ... mold” | CONFIRMED | “Building exterior such as roofs, walls or foundations Doors and windows Plumbing Fire safety Electrical systems Heating systems Mold remediation”. |
| Eligible accessibility modifications | “ramps; handrails; chair and bath lifts; ... counter tops; ... doorbells or fire alarms; ... bathroom” | CONFIRMED | “Ramps Handrails Chair and bath lifts Height adjustments to counter tops Cues for doorbells/fire alarms Bathroom modifications”. |
| Annual funding limitation | “Limited funding” | CONFIRMED | “A limited amount of funding is available each year”. |
| 2026 fact-sheet application deadline; note, steps, tips | “before November 15, 2026” | NOT ON PAGE | Fact sheet linked, not reproduced. Program-page December 1 deadline separately confirmed. |
| Signed-agreement deadline | “December 15, 2026” | NOT ON PAGE | No agreement deadline. |
| Program-page deadline | “before December 1 to receive a loan this year” | CONFIRMED | “To receive a loan this year you will need to apply before December 1.” |
| Ongoing intake / provincial timing | “ongoing basis ... starting after April 1, 2026 once confirmed by the province” | NOT ON PAGE | No ongoing-intake or 2026 start date. |
| First-come list; note, metadata wait | “Ontario Renovates List ... first come first serve” | NOT ON PAGE | No list or allocation-order rule. |
| All-documents prerequisite | “will not be processed unless ALL required documents are received” | NOT ON PAGE | No processing prerequisite reproduced. |
| ID / income / property proof; documents, metadata effort | “Photo identification ... Income verification ... property assessment notice or property tax bill” | NOT ON PAGE | Application link only; no document list. |
| Application submission | “email, fax, mail or in person” | CONFIRMED | “Submit your completed form by email, fax, mail or in person”. |
| Eligible inspection | “If eligible ... home inspection” | CONFIRMED | “We will set up a home inspection if you qualify”. |
| Telephone inspection contact; steps, metadata wait | “contact you by phone to arrange a home inspection” | NOT ON PAGE | Inspection promised, contact medium not specified. |
| Program / urgent-repair phone | “519-575-4400” | CONFIRMED | “Call 519-575-4400 ... questions”; “water leak or other urgent issue, call 519-575-4400”. Heating example is an illustrative urgent repair, not an asserted exclusion. |
| Application email | “OntarioRenovates@regionofwaterloo.ca” | CONFIRMED | “Email: OntarioRenovates@regionofwaterloo.ca”. |
| Application fax | “519-575-4026” | CONFIRMED | “Fax: 519-575-4026”. Footer fax has a different general purpose. |
| Drop-off / mail offices | “20 Weber St. E., Kitchener; 150 Main St., Cambridge; ... 99 Regina St. S., Waterloo” | CONFIRMED | “20 Weber St. E., Kitchener”; “150 Main St., Cambridge”; “99 Regina St. S., Waterloo”. |

### windsor-affordable-pass

Sources: `windsor-affordable-pass--1.txt` (linked eligibility and Transit Windsor fare pages not supplied).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Transit Windsor adult APP price / duration; amount, values | “$63 ... 30-day ... before taxes” | NOT ON PAGE | No APP fare amounts or 30-day duration. |
| Transit Windsor youth APP price / duration; amount, values | “$43.50 youth ... 30-day ... before taxes” | NOT ON PAGE | No APP fare amounts. |
| Low-income Windsor-Essex scope; summary, REQS.lowIncome | “Windsor-Essex residents and households living on a low income” | CONFIRMED | “Windsor-Essex residents and households living on a low income”. |
| Subsidy tax basis | “bus-pass costs before taxes” | CONFIRMED | “cost of bus passes (before taxes)”. |
| Municipal program identity; REQS.windsor | “City of Windsor program” | CONFIRMED | “Affordable Pass Program ... City of Windsor”; “Windsor-Essex residents”. This identifies the municipal program, not an explicit city-resident-only condition; regional scope is retained in the record. |
| Municipal variation / local application | “criteria may differ ... contact ... local municipal transit department” | CONFIRMED | “eligibility criteria may differ across municipalities”; “To apply ... contact your local municipal transit department”. |
| Residency duration / proof | “at least 30 days ... demonstrate residency” | NOT ON PAGE | Eligibility page linked, duration/proof not reproduced. |
| MBM income boundary; eligibility, REQS.p2pIncomeTest | “combined household income ... at, or below ... Market Basket Measure” | NOT ON PAGE | Page says household income/family size, not MBM or its boundary. |
| All-household income / family size | “combined household income”; “family size” | CONFIRMED | “income of all members within the household, as well as family size”. |
| No MBM table / transit contact; REQS.p2pIncomeTest | “page does not list ... thresholds ... contact ... local municipal transit” | CONFIRMED | “Please refer to the Eligibility Requirements web page”; “for further details ... local municipal transit department”; no MBM table supplied. |
| Recreation-department contact; REQS.p2pIncomeTest | “transit or recreation department” | NOT ON PAGE | APP page names transit, not recreation, for this program. No conflicting phone given. |
| Student / worker exclusions and hedge | “International students, full-time post-secondary students and foreign workers ... exceptions may apply” | CONFIRMED | “International students, full-time post-secondary students and foreign workers are not eligible (Exceptions may apply within municipalities.” |
| P2P strategy / joint funding | “poverty-reduction ... jointly funded by ... City ... County” | NOT ON PAGE | Breadcrumb names Pathway to Potential; strategy/funders not described. |
| Regular adult Smart Pass price / age | “$124 ... aged 20 to 59” | NOT ON PAGE | No regular fare table. |
| Regular youth Smart Pass price / age | “$85 ... aged 13 to 19” | NOT ON PAGE | No regular fare table. |
| Regular senior Smart Pass / age | “$63 ... aged 60 and over” | NOT ON PAGE | No regular fare table. |
| Single fare / transfer | “$3.95 ... adult, senior or youth ... 2-hour transfer” | NOT ON PAGE | No single fare/transfer information. |
| Senior comparison | “both $63 ... worth less ... already 60 or over” | NOT ON PAGE | No comparative fares or age thresholds. |
| Terminal-only distribution / address / ID | “only ... Windsor International Transit Terminal, 300 Chatham Street West ... proof of identification” | NOT ON PAGE | No distribution location or ID rule. |
| Preferred income documents | “Canada Child Benefit ... Notice of Assessment ... OW ... ODSP” | NOT ON PAGE | Required documents delegated to linked page. |
| Residency proof options | “Driver's Licence ... Health Card ... Photo Card ... utility ... tax ... lease ... mortgage ... bank” | NOT ON PAGE | No proof list. |
| Extra-document hedge | “Additional documentation may be requested” | NOT ON PAGE | No extra-document provision reproduced. |
| Endorsement route / professional letterhead / contents / municipal discretion | “Letter of Endorsement ... cannot provide ... recently changed ... agency ... client's full name ... benefits ... barriers ... discretion” | NOT ON PAGE | No endorsement route or conditions reproduced. |
| First-come allocation; note, steps, tips, metadata wait | “first-come, first-served” | CONFIRMED | “Funding availability is based on a first-come, first-served basis”. |
| Local approval / demand and budget contingency | “local transit department subject to local demands and budgets” | CONFIRMED | “All approvals will be determined by the local transit department and are subject to local demands and budgets”. |
| Discount duration / start | “12-month period from ... approval” | CONFIRMED | “twelve (12) month period from the date of approval”. |
| Change-report deadline / subjects | “financial, residency or other circumstances within 30 days” | CONFIRMED | “financial, residency or other circumstances”; “within thirty (30) days of the change taking effect”. |
| Termination reservation | “provider reserves the right to terminate eligibility” | CONFIRMED | “fails to inform ... reserves the right to terminate eligibility”. |
| Nontransferability / prohibited dealings | “cannot be sold, transferred, traded, given away or shared” | CONFIRMED | “Passes cannot be sold, transferred, traded, given away or shared with anyone else”. |
| Income/residency application documents; metadata effort, steps | “proof of income and residency” | NOT ON PAGE | Required-document link only; exact categories not reproduced. |
| Published wait; metadata | “Not published” | CONFIRMED | Allocation and budget contingencies given, no processing-time duration. |

### grt-cnib-pass

Sources: `grt-cnib-pass--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Free annual pass; amount, eligibility, about, values | “annual ... at no cost” | CONFIRMED | “Annual pass for CNIB customers”; “ride GRT for free”. |
| Customer criterion; REQS.cnibCustomer | “You are a CNIB customer” | CONFIRMED | “Annual pass for CNIB customers”. |
| Unlimited named services | “unlimited ... conventional GRT buses and ION light rail” | CONFIRMED | “unlimited use of conventional GRT buses and ION light rail”. |
| Special fare card | “special CNIB EasyGO fare card” | CONFIRMED | “with a special CNIB EasyGO fare card”. |
| Tactile features / purpose | “Braille and a small notch ... identify by touch” | CONFIRMED | “Braille and a small notch in the side of the card to make it easier to identify by touch”. |
| MobilityPLUS evidence limitation | “does not say ... MobilityPLUS” | CONFIRMED | “conventional GRT buses and ION light rail”; no MobilityPLUS inclusion in pass description. Navigation alone is not coverage evidence. |
| Regional program; REQS.waterlooRegion | “Region of Waterloo program” | CONFIRMED | “Grand River Transit”; contact “Kitchener, ON”. GRT regional identity is consistent with the supplied regional sources. No residence gate asserted in copy. |
| Arrangement phone; steps, detail.phone, metadata effort | “Contact GRT at 519-585-7597 ... arrange ... fare card” | CONFIRMED | “Contact GRT at 519-585-7597 to arrange to get your EasyGO fare card.” Footer 519-585-7555 is general contact, not this specific card-arrangement number; no same-purpose discrepancy. |
| Published wait; metadata | “Not published” | CONFIRMED | Card arrangement instruction gives no processing time. |

### grt-support-person

Sources: `grt-support-person--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Disability-related independent-travel criterion | “due to a disability, cannot travel independently on conventional or specialized transit” | CONFIRMED | “open to anyone who, due to a disability, cannot travel independently on conventional or specialized transit service”. |
| Regular/occasional assistance | “regular or occasional” | CONFIRMED | “require regular or occasional assistance”. |
| Service scope | “GRT conventional buses, MobilityPLUS buses and/or ION trains” | CONFIRMED | “GRT conventional buses, MobilityPLUS buses and/or ION trains”. |
| Free assisting person; amount, values | “support person providing assistance does not pay a fare” | CONFIRMED | “The support person providing assistance will not pay a fare.” |
| Companion categories / age | “family member, friend, paid attendant or volunteer ... 13 ... or older ... travels with you to assist” | CONFIRMED | “family member, friend, paid attendant or volunteer - anyone 13 years of age or older - who travels with you to assist you in using transit”. |
| Regional program; REQS.waterlooRegion | “Region of Waterloo program” | CONFIRMED | “Other professionals approved by the Region”; GRT/Kitchener contact. |
| Application requirement / online route; REQS.supportPersonApproval | “apply ... online application” | CONFIRMED | “Complete the Transit Support Person online application”. |
| Mailed-form route | “call GRT customer service ... form mailed” | CONFIRMED | “Call GRT customer service to have a form mailed to you”. |
| Pickup route | “any GRT customer service location” | CONFIRMED | “Pick up a form in person at any GRT customer service location”. |
| PAL exception / cities / card proof | “currently enrolled ... PAL ... Kitchener ... Waterloo ... Cambridge ... card number instead” | CONFIRMED | “currently enrolled ... (PAL) ... City of Kitchener, City of Waterloo or City of Cambridge ... do not have to have your health care professional fill out ... provide your PAL card number”. |
| Professional-completion hedge; steps[3], documents[2], metadata effort | “Unless the PAL shortcut applies, have a registered health professional complete”; “Otherwise: the part ... completed” | DIFFERS | “If you are not enrolled in the PAL program, the application should be completed by a registered health-care professional”. Hedge: should becomes required completed documentation; page also limits professionals to listed designations/Region approval, not any registered professional. |
| Published wait; metadata | “Not published” | DIFFERS | “GRT will send you a letter within 14 calendar days of receiving your application indicating whether you have been approved.” Scope: decision turnaround is published. |

### hamilton-fare-assist

Sources: `hamilton-fare-assist--1.txt`. Page mixes “below”/“less than” and “at or below”; inclusive eligibility is explicitly supported in Key Features. The six-person income entry has a punctuation anomaly, recorded literally below.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Single-ride PRESTO discount; amount, values | “50% off single-ride PRESTO fares” | CONFIRMED | “50% discount on current single-ride PRESTO fares”. |
| Annual duration / approval start | “one year from approval” | CONFIRMED | “one year following application approval”. |
| Hamilton residence; REQS.hamilton | “You live in Hamilton” | CONFIRMED | “Hamilton residents”; “Hamiltonians”. |
| Inclusive income boundary; eligibility, REQS.lowIncome | “at or below ... Low-Income Measure” | CONFIRMED | “Hamiltonians who live at or below the Stats Canada Low-Income Measure (LIM) can apply.” Other sections use stricter language, but inclusive claim has explicit support. |
| OW / ODSP financial eligibility condition; eligibility.items[1] / steps[1] | “Your total household income is at or below ... for your family size” | DIFFERS | “Hamilton residents who are recipients of Ontario Works, the Ontario Disability Support Program (ODSP) OR whose Total Household Net Income Amount is less than the amounts below, can apply”. Dropped categorical OW/ODSP route in universal income-test formulation. |
| Income sources / named benefits | “employment, Ontario Works, ODSP, ... CPP ... disability ... Employment Insurance ... WSIB” | CONFIRMED | “regardless of income source”; “employment income ... Ontario Works (OW) ... ODSP ... CPP Disability ... EI ... WSIB”. |
| Accessible/conventional coverage | “DARTS ... HSR buses” | CONFIRMED | “both conventional and accessible transit ... trips taken on DARTS vehicles”. |
| Household scope / spouse / child boundary | “every eligible ... spouse and children aged 13 to 17” | CONFIRMED | “all eligible members of the household, including a spouse and children ages 13-17”. |
| Child free travel | “Children 12 and under ... free with PRESTO” | CONFIRMED | “Children 12-and-under ride free with PRESTO”. |
| Excluded pass products | “not ... monthly or annual passes” | CONFIRMED | “does not apply to monthly or annual passes”. |
| Annual renewal | “re-apply each year” | CONFIRMED | “Applicants can re-apply each year”; “benefits will expire after one year ... email reminder to re-apply”. |
| Permanent-program date | “January 1, 2026” | CONFIRMED | “permanent effective January 1, 2026”. |
| Replaced programs / affected groups | “Affordable Transit Pass for Ontario Works ... Temporary Transit Fare Special ... wheelchair, scooter or walker ... CNIB” | CONFIRMED | “Affordable Transit Pass for Ontario Works recipients ... Temporary Transit Fare Special Program for persons who use a personal mobility device (PMD), such as a wheelchair, scooter, walker, and CNIB cardholders”; FAQ “programs will end”. |
| Refugee / newcomer / young nonfiler hedge | “Recent refugees, newcomers ... 18 or 19 ... not ... filed ... may ... qualify” | CONFIRMED | “Recent refugees, newcomers to Canada, and individuals aged 18 or 19 who have not yet filed a tax return may also qualify”. |
| Income table: one | “$30,255” | CONFIRMED | “1 person $30,255”. |
| Income table: two | “$42,787” | CONFIRMED | “2 persons $42,787”. |
| Income table: three | “$52,403” | CONFIRMED | “3 persons $52,403”. |
| Income table: four | “$60,510” | CONFIRMED | “4 persons $60,510”. |
| Income table: five | “$67,652” | CONFIRMED | “5 persons $67,652”. |
| Income table: six | “$74,109” | DIFFERS | “6 persons $74.109”. Literal numeric punctuation differs (apparently a source typo); no silent normalization or claim that the intended threshold changed. |
| Income table: seven | “$80,047” | CONFIRMED | “7 persons $80,047”. |
| Income table: eight | “$85,574” | CONFIRMED | “8 persons $85,574”. |
| Income table: nine | “$90,765” | CONFIRMED | “9 persons $90,765”. |
| Income table: ten | “$95,675” | CONFIRMED | “10 persons $95,675”. |
| Table income basis | “After-tax income limits by family size” | CONFIRMED | “Family Size After Tax Income”. |
| Estimated beneficiaries | “City estimates about 88,000” | CONFIRMED | “We estimate approximately 88,000 Hamiltonians will benefit”. |
| Weekly cap / exact boundaries | “after 11 paid PRESTO trips ... Monday 12:01 a.m. to Sunday 11:59 p.m.” | CONFIRMED | “not ... charged an additional fare after 11 paid PRESTO trips in the same week (Monday 12:01 AM to Sunday 11:59 PM)”. |
| As-needed loading | “Load funds ... as you need them” | CONFIRMED | “Funds can be loaded to a PRESTO card as-needed”. |
| Universal income-document requirement; documents[0], metadata effort | “Proof of total household income for everyone in the household” | DIFFERS | “OW/ODSP Applicants: Provide Member ID. All Others: Include a current Notice of Assessment for all family members”; renewals “OW/ODSP Applicants: No income documentation needed”. Dropped benefit-client alternative. |
| PRESTO card / discount application | “Your PRESTO card, which the discount is applied to” | CONFIRMED | “Each approved family member must have their own PRESTO card to use the discount”; “voucher code ... applying it to your PRESTO card”. |
| Published wait; metadata | “Not published” | CONFIRMED | “Renewing early allows sufficient time for processing”; no fixed decision turnaround published. |
