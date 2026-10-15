# Snapshot re-verification report — 2026-10-16, batch 7 part A

## Method and scope

Same method as `REPORT-2026-10-16-batch6.md`. `public/data.js` was evaluated in a Node `vm` with `{window:{}, document:{}, console}` and `BENEFITS`, `BENEFIT_VALUES`, `BENEFIT_META` read out, as in `scripts/check-readability.js`. The `unmet`/`short` text of each record's `requires` gates was read from `REQS` in `public/app.js` without calling matchers. Snapshots in `research/reverify/snapshots/` (fetched 2026-10-15) are the only truth. Facts count distinct assertions; internal flags, labels, URLs, difficulty ratings and advice with no factual assertion are not counted. CONFIRMED carries a snapshot quotation. DIFFERS names the number, boundary, hedge, dropped condition or scope that differs. NOT ON PAGE means absent from the supplied snapshots, not false. Hedges are checked both ways. Phone numbers are compared only with a number the page gives for the same purpose. No wording is proposed. This is a factual report, not permission to change gates.

DTC caution: `AGENTS.md` and the e2e tests on DTC readiness apply. The DTC gates (`prolonged`, `certifier`) are deliberately unresolved (`met: () => false`) so a lay answer never makes DTC ready. Any change to `dtc` needs care. Note the two DTC snapshots are only the CRA hub page and the T2201 form-download page. They do not reproduce the eligibility criteria, so most DTC detail is NOT ON PAGE. That is an evidence limit, not a finding that the text is wrong.

Evidence limits noted per record: cpp-disability snapshot is the overview page only (eligibility/apply subpages not supplied); excise snapshots are the program page and XE8 download page (Guide RC4064 not supplied).

## Summary table

| Record id | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| cochrane-connect-card | 10 | 7 | 2 | 1 |
| cpp-disability | 22 | 5 | 1 | 16 |
| dtc | 32 | 7 | 1 | 24 |
| excise-gasoline-tax-refund | 16 | 10 | 1 | 5 |
| fortsask-access | 8 | 6 | 1 | 1 |
| leduc-subsidies | 11 | 3 | 2 | 6 |
| okotoks-fee-assistance | 9 | 7 | 1 | 1 |
| **Total (7 records)** | **108** | **45** | **9** | **54** |

Counts are evidence-limited, not a declaration that unsupported assertions are false.

## Per-record detail

### cochrane-connect-card

Sources: `cochrane-connect-card--1.txt`. REQS: `cochrane` unmet "This is a Town of Cochrane program."; `lowIncome` unmet "This is for lower-income households."

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Transit discount; amount, about, values | "25% off local transit"; "25% off COLT monthly and 10-ticket transit passes" | CONFIRMED | "Cochrane On Demand Local Transit (COLT) 25% off monthly pass or 10 ticket books". |
| Recreation discount; amount, about, values | "50% off SLS Centre monthly passes"; "SLS Centre 30-day and monthly passes" | CONFIRMED | "SLS Centre 50% off 30-day pass or monthly pass". |
| Basis of eligibility; summary, note, tips[0] | "financial or situational barriers"; "assesses financial and situational need" | CONFIRMED | "Eligibility for the Cochrane Connect Card program is based on financial and situational assessment." |
| Low-income households; summary, REQS.lowIncome | "qualifying residents"; "lower-income households" | CONFIRMED | "The card provides low-income households access to services and programs with a discount." Income table (1 person $54,500 ... 5 people $96,500 (maximum)) is not asserted by the record. |
| Appointment required; note, steps[0] | "Book an appointment" | CONFIRMED | "you must book an appointment with a resource worker". |
| Proof of income; documents, steps[1] | "Proof of income" | CONFIRMED | "Canada Revenue Agency Notice of Assessment (with line 15000), or AB Works, EI or AISH confirmation (income support)". |
| Proof of address; documents | "Proof of address" part of "Proof of Cochrane address" | CONFIRMED | "Proof of address Mortgage or lease agreement, or Current bill (showing name and address, dated within three months)". |
| Who supplies documents; note, steps[1], documents | "bring the requested income and address documents"; "Bring proof of income and your Cochrane address." | DIFFERS | "provide the following documentation for all adults in the household". Dropped condition: documents are required for every adult in the household, not only the applicant. |
| Operator name; summary, steps[0], tips[0] | "A City card"; "the City’s Connect Card page"; "the City also describes" | DIFFERS | Page is the "Town of Cochrane"; "Eligibility for the Cochrane Connect Card program ..." Name/scope: Town, not City (REQS says Town). Minor. |
| Must live in Cochrane; REQS.cochrane, documents "Cochrane address" | "Proof of Cochrane address"; "This is a Town of Cochrane program." | NOT ON PAGE | Page asks only for "Proof of address" and never states a Cochrane-residency rule. It mentions "rural residents" booking through FCSS ("Individuals or families with children 18+, older adults or rural residents, book an appointment with Family and community Support Services"). |

Source-only (not asserted by record): reapply every year with the previous year's Notice of Assessment; FCSS 403-851-2250 and FRN 403-851-2265 (families with children under 18 go to FRN); discounts exclude GST and "can not be used in combination with other subsidies or discounts". No phone number in the record, so no phone conflict.

### cpp-disability

Sources: `cpp-disability--1.txt` (overview only). REQS: `workingAge` "This is for people aged 18–64."; `cppContrib` "Check your CPP Statement of Contributions for the required contribution history."; `unableToWork` "This is for people a disability regularly stops from working."

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Monthly payment from CPP; summary, about | "A monthly payment ... from the Canada Pension Plan" | CONFIRMED | "A Canada Pension Plan (CPP) disability benefit is a monthly payment that you could receive". |
| Under 65; about | "people under 65" | CONFIRMED | "if you are over 18 and under 65 years old". |
| Lower age bound; REQS.workingAge | "people aged 18–64" | DIFFERS | "over 18 and under 65 years old". Boundary: page says over 18; gate includes age 18 (`isAdultAge` = 18, 19–59, 60–64). Wording is ambiguous, flagged for the strict reading. |
| Unable to work because of a disability; summary, about, REQS.unableToWork | "stops you from working"; "can no longer work regularly" | CONFIRMED | "unable to work because of a disability". The words "regularly" and "any substantial work" are covered in the next block. |
| Severe and prolonged / regularly prevents any substantial work; summary, note, about, tips[0] | "severe, long-term disability"; "regularly prevents any substantial work"; "'Severe and prolonged' is a high bar" | NOT ON PAGE | "severe and prolonged" appears only for a different benefit (the Post-Retirement Disability Benefit). Eligibility subpage not supplied. |
| Does not require the DTC; note | "Does NOT require the DTC" | NOT ON PAGE | DTC not mentioned as a CPP-D condition either way. |
| CPP contributions required; note, REQS.cppContrib, about | "enough past CPP work contributions" | NOT ON PAGE | Contribution requirement not on the overview. |
| Contribution test; documents[0] | "generally 4 of the last 6 years" | NOT ON PAGE | No contribution years on page. |
| Maximum monthly amount; values.monthlyMax | 1741 | CONFIRMED | "Maximum amount (2026): $1,741.20/month". Rounded down; year not stated by record. |
| Annual maximum; values.annualMax | 20894 | NOT ON PAGE | Page gives no annual figure. It equals 12 x $1,741.20 = $20,894.40, a derived value. |
| Monthly minimum; values.monthlyMin | 611 | NOT ON PAGE | Page gives a maximum and "Average amount (July 2026): $1,236.32/month" only. |
| Amount based on contributions; amount | "based on your CPP contributions" | NOT ON PAGE | Page links "How much you could receive" but does not say what it is based on. |
| Apply online via My Service Canada Account or on paper; steps[1] | "online through My Service Canada Account, or on paper" | NOT ON PAGE | Page: "Sign in or register for My Service Canada Account to access Canada Pension Plan (CPP) disability benefits and services"; "Apply You must apply." No application channels stated. |
| Doctor completes medical section; steps[2], documents[1] | "Have your doctor complete the medical report section." | CONFIRMED | "Information for health care professionals: Information on when and how to complete the medical forms and billing." Page says health care professionals; "doctor" is narrower. |
| Reconsideration if denied; tips[1] | "you can request reconsideration" | NOT ON PAGE | Page only says "what to do if you disagree with the decision". |
| Many approved at reconsideration; tips[1] | "many are approved at that stage" | NOT ON PAGE | No approval statistics. |
| Back-pay; tips[2] | "there can be back-pay" | NOT ON PAGE | Not mentioned. |
| Decision time; time, meta.wait | "Around 120 days"; "~4 months" | NOT ON PAGE | No processing time on page. |
| Phone; detail.phone | "Service Canada: 1-800-277-9914" | NOT ON PAGE | Page gives no phone number (only a "Contact us" link). |
| Effort; meta.effort | "2–4 hrs + a doctor's report" | NOT ON PAGE | Not mentioned. |
| Work-history documents; steps[0], documents[2] | "Details of your work history and why you can't continue" | NOT ON PAGE | Not mentioned. |
| "High bar" characterization; tips[0] | "a high bar" | NOT ON PAGE | Not mentioned (also counted with severe-and-prolonged above only as to the term). |

### dtc

Sources: `dtc--1.txt` (CRA DTC hub page), `dtc--2.txt` (T2201 form page). REQS: `prolonged` short "Ask a medical practitioner which CRA route to check", unmet "Ask a medical practitioner to decide with you whether you meet a CRA route: a marked restriction in one category, combined limitations in two or more categories, or life-sustaining therapy. Read the full criteria."; `certifier` unmet "Have an authorized practitioner certify the program's required form." Both are `met: () => false`. Guardrails: AGENTS.md and the DTC readiness e2e tests apply; changes need care.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Non-refundable federal tax credit; amount, summary, about | "A non-refundable tax credit" | CONFIRMED | "The disability tax credit (DTC) is a non-refundable tax credit". |
| May reduce income tax; summary, about, values.note | "may reduce income tax" | CONFIRMED | "reduce the amount of income tax they may have to pay". Hedge preserved. |
| Approved person or supporting family member; summary | "an approved person or an eligible supporting family member" | CONFIRMED | "helps people with disabilities, or their supporting family member"; "If you are approved, you may claim the credit at tax time." |
| Actual reduction varies; amount, values.note | "actual tax reduction varies" | NOT ON PAGE | Page gives no amount and no statement that it varies. |
| Severe and prolonged impairment as the basis; about | "a severe and prolonged impairment" | CONFIRMED | "If you have a severe and prolonged impairment, you may apply for the credit."; T2201: "Individuals with a severe and prolonged impairment in physical or mental functions can use this form". |
| Medical practitioner must certify; about, note, tips, REQS.certifier | "A medical practitioner must certify" | NOT ON PAGE | Hub links "Digital application for medical practitioners" and the form is titled "Disability Tax Credit Certificate", but no sentence states the certification requirement. |
| Three routes; about, aboutList, REQS.prolonged | "one of three routes" | NOT ON PAGE | Eligibility page not supplied. |
| Marked-restriction definition; about | "unable ... or take three times longer ... even with appropriate therapy, medication and devices" | NOT ON PAGE | Not on supplied pages. |
| Eight categories; about, tips | "walking, mental functions, dressing, feeding, eliminating ... hearing, speaking or vision" | NOT ON PAGE | Not on supplied pages. |
| "All or almost all of the time (generally at least 90%)"; about | 90% | NOT ON PAGE | Not on supplied pages. |
| 12 continuous months; about | "at least 12 months" | NOT ON PAGE | Not on supplied pages. |
| Cumulative-effect route; about | "two or more of those categories" | NOT ON PAGE | Not on supplied pages. |
| Life-sustaining therapy; about | "at least 2 times per week for an average of at least 14 hours per week" | NOT ON PAGE | Not on supplied pages. |
| Prerequisite for related federal programs; summary, about | "required for several related federal programs, but not for every disability benefit" | NOT ON PAGE | Not on supplied pages. |
| Two-part application; steps | "Part A ... Part B" | CONFIRMED | "How to complete and submit the 2-part application". |
| Part A personal information, Part B practitioner; steps[1], steps[2] | "Part A (your personal information)"; "Part B" completed by practitioner | NOT ON PAGE | Page says only "2-part". |
| Paper submission; steps[0] | "or use the paper form" | CONFIRMED | "you must send your DTC application to the CRA using the digital DTC application form or by mail." |
| CRA My Account route; steps[0], steps[3] | "Sign in to (or create) CRA My Account"; "Submit through CRA My Account" | DIFFERS | "you must send your DTC application ... using the digital DTC application form or by mail. You may not send DTC forms through the 'submit documents' section of your CRA account." Route differs: page names the digital DTC application form, not My Account, and excludes the 'submit documents' section. |
| "Fastest processing" via My Account; steps[3] | "for the fastest processing" | NOT ON PAGE | No comparison of channels. |
| Form T2201; applyText | "T2201" | CONFIRMED | "T2201 Disability Tax Credit Certificate". |
| Past years up to 10 years, tax-return adjustments; steps[4] | "Past claims may go back up to 10 years" | NOT ON PAGE | Not on supplied pages. |
| SIN; documents[0] | "Your Social Insurance Number (SIN)" | NOT ON PAGE | Not on supplied pages. |
| Practitioner familiar with condition; real examples; documents[1], documents[2] | "A medical practitioner familiar with your condition" | NOT ON PAGE | Not on supplied pages. |
| Free to apply, no private company; tips[1] | "Applying directly is free." | NOT ON PAGE | Not on supplied pages. |
| Denied: decision letter, review or objection; tips[2] | "CRA review or objection process" | NOT ON PAGE | Hub names a section "CRA's decision ... what to do if your application is approved or denied" but gives no review/objection detail. |
| Processing time varies, processing-times tool; time, meta.wait | "check the CRA processing-times tool"; "8–20 weeks" | NOT ON PAGE | Hub only says "Understand our review process and check the status of your application". |
| Phone; detail.phone | "CRA: 1-800-959-8281" | NOT ON PAGE | Hub: "Contact the CRA online, by phone, or by mail"; no number. |
| Effects not diagnosis; note | "Approval is based on the effects of an impairment, not the diagnosis name." | NOT ON PAGE | Not on supplied pages. |
| Who can certify what; note | "A medical doctor or nurse practitioner can certify all impairments; other practitioners ... specific functional categories" | NOT ON PAGE | Not on supplied pages. |
| Type 1 diabetes statement; tips | "people with Type 1 diabetes meet the life-sustaining-therapy criteria" | NOT ON PAGE | Not on supplied pages. |
| What counts toward 14 hours; tips | "travel does not count and recovery counts only when medically required" | NOT ON PAGE | Not on supplied pages. |
| Effort; meta.effort | "30–60 min + a doctor visit" | NOT ON PAGE | Not on supplied pages. |

Source-only: the hub page says as of July 14 the application must be sent using the digital DTC application form or by mail and may not be sent through the "submit documents" section of the CRA account. The record does not state this.

### excise-gasoline-tax-refund

Sources: `excise-gasoline-tax-refund--1.txt` (program page), `excise-gasoline-tax-refund--2.txt` (XE8 form page). REQS: `vehicleDisability` unmet "The vehicle programs require one of the listed mobility, vision, or public-transit disability criteria."; `excisePermanentMobilityCertified` short "Ask a medical practitioner about certifying your mobility limits", unmet "A qualified medical practitioner must certify that you have a permanent mobility impairment and cannot safely use public transportation."

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Refund of part of federal excise tax on gasoline bought; amount, summary, about, values | "a refund of part of the federal excise tax on the gasoline you buy" | CONFIRMED | "you can ask for a refund of part of the federal excise tax on the gasoline you buy." |
| Permanent mobility impairment; eligibility, requiresNote, REQS | "a permanent mobility impairment" | CONFIRMED | "If you have a permanent mobility impairment ..." |
| Cannot safely use public transportation | "unable to safely use public transportation" | CONFIRMED | "and cannot safely use public transportation". |
| Practitioner certifies; summary, eligibility, steps, documents, REQS | "A qualified medical practitioner has to certify the impairment" | CONFIRMED | "A qualified medical practitioner must certify the impairment." |
| Form XE8 name; applyText, about, documents | "Form XE8, Application for Refund of Federal Excise Tax on Gasoline" | CONFIRMED | "XE8 Excise Tax Act – Application for Refund of Federal Excise Tax on Gasoline". |
| Same form used by athletic associations and charities; about | "registered Canadian amateur athletic associations and registered charities" | CONFIRMED | "if you are a registered Canadian amateur athletic association, registered charity, or individual with a permanent mobility impairment". |
| Electronic filing through My Account, My Business Account or Represent a Client; about, steps[2] | "filed electronically through My Account, My Business Account or Represent a Client" | NOT ON PAGE | XE8 page offers only fillable PDF download or print. No electronic filing channel named. |
| Download and fill out the PDF; about, steps[2] | "downloaded and filled out" | CONFIRMED | "Download and fill out with Acrobat Reader". Where to send it ("send it in") is not on the page. |
| Program and XE8 pages state no per-litre amount; about, note, amount | "The CRA's pages for this program do not state the refund amount per litre" | CONFIRMED | Neither supplied page contains an amount or the word litre (absence confirmed on both). |
| Guide RC4064 also states no amount; note | "the program page, the Form XE8 page, or Guide RC4064" | NOT ON PAGE | Guide RC4064 not supplied; the program page only links it. |
| Temporary reductions of excise tax rates on certain fuel, attributed to the XE8 page; note, about, tips[2] | "temporary reductions of the federal excise tax rates on certain types of fuel are in effect"; "the Form XE8 page notes that the government implemented temporary reductions" | NOT ON PAGE | The supplied XE8 snapshot contains no such note. |
| Phone; note, steps[3], tips[2] | "1-877-432-5472" | NOT ON PAGE | Neither page gives any phone number. |
| Accessible, standard and large print PDFs; tips[0] | "accessible fillable PDF, a standard print PDF and a large print PDF" | CONFIRMED | "Accessible Fillable PDF ... Standard print PDF ... Large print PDF". |
| Alternate formats on request; tips[0] | "braille, electronic text, digital audio and large print on request" | CONFIRMED | "You can order alternate formats such as digital audio, electronic text, braille, and large print." |
| Keep receipts; refund based on gasoline already bought; tips[1] | "refund is based on gasoline you have already bought" | NOT ON PAGE | Not mentioned. |
| Disability gate scope; REQS.vehicleDisability | "one of the listed mobility, vision, or public-transit disability criteria" | DIFFERS | "If you have a permanent mobility impairment and cannot safely use public transportation". Scope: page names only permanent mobility impairment; vision and transit-barrier answers do not appear. The gate is shared with other vehicle programs. |

### fortsask-access

Sources: `fortsask-access--1.txt`. REQS: `fortsask` unmet "This is a City of Fort Saskatchewan program."; `lowIncome` unmet "This is for lower-income households."

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Free annual multi-facility membership; amount, note, values | "Free multi-facility membership"; "fully discounted annual multi-facility membership" | CONFIRMED | "An Annual Multi-Facility Membership Now offered at a 100% discount". |
| Everyone Rides local or commuter fares; amount, note, about | "reduced local or commuter transit fares" | CONFIRMED | "Everyone Rides Fares Local Cash Fare (one way) $3.25 ... Commuter Cash Fare (one way) $5.50". |
| Approved programs; note, tips[0] | "AISH, CPP Disability, FSCD and Income Support" | CONFIRMED | "an approved Government program (such as: AISH, CPPD, FSCD or Income Support)". |
| Income route; summary, documents | "limited income"; "Proof of income" | CONFIRMED | "have a combined household income at or under the amounts listed on the Statistics Canada Low Income Thresholds. Proof of income verification is required." |
| Residency; summary, documents | "Proof of Fort Saskatchewan residence" | CONFIRMED | "The applicant must be a resident of the City of Fort Saskatchewan. Proof of residency is required." |
| Either-or structure vs gate; REQS.lowIncome | "This is for lower-income households." | DIFFERS | "receiving funding from: an approved Government program ... OR have a combined household income at or under" the thresholds. Dropped alternative: the AISH/CPPD/FSCD/Income Support route needs no income test, but the gate requires a low-income answer. |
| Transit subsidy comes with approval; about, amount, steps[2] | "combines recreation support with the Everyone Rides transit subsidy for eligible residents" | NOT ON PAGE | The "If your application is approved ... you will receive" list names the membership and registered programs only. Transit fares appear in a separate "Transit for Everyone" section with no stated eligibility link. |
| Application route; steps | "Apply with proof of limited income or the approved income-support document" | CONFIRMED | "Download the Access for Everyone Application Form and provide the requested documents." |

Source-only: registered programs for children and youth "up to 4 registered programs or a maximum value of $245"; membership valid January 1 to December 31, Childminding not included; income table (1 person at or below $26,246 ... 7+ $69,647); contact 780-992-6417. Record states none of these, so no phone conflict.

### leduc-subsidies

Sources: `leduc-subsidies--1.txt`. REQS: `leduc` unmet "This is a City of Leduc program."; `lowIncome` unmet "This is for lower-income households."

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Half-price monthly bus passes; amount, note, values | "Half-price transit"; "half-price ... passes" | CONFIRMED | "Provides half-price monthly bus passes." |
| Local, commuter and LATS; amount, summary, note, values, tips[0] | "half-price local, commuter and LATS transit passes"; "reduce local, commuter and LATS transit costs" | DIFFERS | "Client’s choice between local, commuter or LATS monthly pass." Scope: one monthly pass of the client's choice, not half-price on all three or on transit generally. |
| Free annual Leduc Recreation Centre membership; amount, note, values, about | "a free Leduc Recreation Centre annual membership" | NOT ON PAGE | Page describes no recreation-centre membership. The only recreation item is the "Recreation Assistance Program" with no benefit described. |
| Recreation program availability; amount, summary, note, about | "provide recreation access" as currently available | DIFFERS | "all Recreation Assistance Program funding for 2026 has been fully allocated. As a result, the program is now CLOSED and will reopen for new applications in January 2027." Dropped condition: the recreation program is closed to new applications. |
| Financial-navigation support; summary, about, steps | "Financial-navigation support" | CONFIRMED | "FCSS provides free, confidential support to help you understand your options, strengthen financial stability, access benefits, and stay safely housed." |
| Eligible residents; about | "qualifying residents" | CONFIRMED | "making it easier for eligible residents to get to work, appointments and essential services." |
| Leduc residency and proof; REQS.leduc, documents[0] | "Proof of Leduc residence" | NOT ON PAGE | No residency rule or document stated for the transit subsidy (residency appears only for the Volunteer Income Tax Program). |
| Low-income criterion; REQS.lowIncome | "lower-income households" | NOT ON PAGE | No income test stated for the transit subsidy. |
| Appointment and documents; steps[0], steps[2], documents[1] | "financial-navigation appointment"; "Financial information requested by FCSS" | NOT ON PAGE | No appointment or document list described. |
| Page describes an assessment; tips[1] | "The City’s page describes an assessment" | NOT ON PAGE | No assessment is described. |
| LATS is specialized transit; tips[0] | "if you use specialized transit" | NOT ON PAGE | Page says only "Apply to LATS". |

Source-only: Utility Arrears Program "up to $400 ... once every two years"; Creative Culture Connections "Up to $200 per eligible person, per year". Not asserted by record. The City general number (780)-980-7177 is not in the record.

### okotoks-fee-assistance

Sources: `okotoks-fee-assistance--1.txt`. REQS: `okotoks` unmet "This is a Town of Okotoks program."; `lowIncome` unmet "This is for lower-income households."

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| 80% off most programs, passes and admission; amount, summary, note, about, values | "80% off most Town programs, passes and admission" | CONFIRMED | "Qualified applicants will receive 80% off most Town of Okotoks programs ... as well as recreation passes/admissions." Hedge "most" preserved. |
| Camp limits; note, tips[1] | "camp limits" | CONFIRMED | "Children’s Day Camps are limited to a $200 subsidy per year." |
| Low-income qualifying residents; summary, REQS.lowIncome | "qualifying low-income ... residents" | CONFIRMED | "qualifying residents experiencing low income or financial stress"; income guidelines are a LICO table by family size. |
| Foothills County residents eligible; summary, tips[0] | "Okotoks and Foothills County residents" | CONFIRMED | "you must live in the Town of Okotoks or Foothills County and meet the income guidelines". |
| Gate excludes Foothills County; REQS.okotoks | "This is a Town of Okotoks program." (met only when city is Okotoks) | DIFFERS | "live in the Town of Okotoks or Foothills County". Scope: gate allows Okotoks only, though page also qualifies Foothills County residents (record tips[0] acknowledges them). |
| Proof of income; documents, steps[1] | "Proof of income" | CONFIRMED | "Line 23600 Net Income on the most recent Canada Revenue Agency Notice of Assessment is used to determine income." Alternatives listed if no Notice of Assessment. |
| Proof of Okotoks residence; documents | "Proof of Okotoks residence" | NOT ON PAGE | Page requires living in Okotoks or Foothills County but names no residence document; it says the online form "requires proof of eligibility". |
| Apply with requested documents; steps | "Apply with the income and residence documents requested" | CONFIRMED | "Submit the online form (which requires proof of eligibility)." |
| Program period and limits; steps[2] | "Check the program period" | CONFIRMED | "subsidy is valid for 1 year from date of approval." |

Source-only: income table (1 person $31,906 ... 7 or more $84,436, net income line 23600, all adults combined); children from three months to 18 years; contacts 403-995-2626 and 403-938-8954. Record states none of these, so no phone conflict.

## Count table

| Record | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| cochrane-connect-card | 10 | 7 | 2 | 1 |
| cpp-disability | 22 | 5 | 1 | 16 |
| dtc | 32 | 7 | 1 | 24 |
| excise-gasoline-tax-refund | 16 | 10 | 1 | 5 |
| fortsask-access | 8 | 6 | 1 | 1 |
| leduc-subsidies | 11 | 3 | 2 | 6 |
| okotoks-fee-assistance | 9 | 7 | 1 | 1 |
| Total | 108 | 45 | 9 | 54 |

## DIFFERS list

No wording is proposed.

1. **cochrane-connect-card — `note / detail.steps[1] / detail.documents`**
   - Current: "bring the requested income and address documents"; "Bring proof of income and your Cochrane address."
   - Snapshot: "provide the following documentation for all adults in the household".
   - Difference: dropped condition; documents are needed for every adult in the household.

2. **cochrane-connect-card — `summary / detail.steps[0] / detail.tips[0]`**
   - Current: "A City card"; "the City’s Connect Card page"; "the City also describes situational need"
   - Snapshot: "Town of Cochrane" page; "Eligibility ... is based on financial and situational assessment."
   - Difference: operator is the Town, not the City (minor; REQS already says Town).

3. **cpp-disability — `REQS.workingAge`**
   - Current: "This is for people aged 18–64."
   - Snapshot: "if you are over 18 and under 65 years old".
   - Difference: boundary; page says over 18, gate includes 18 (ambiguous wording).

4. **dtc — `detail.steps[0] / detail.steps[3]`**
   - Current: "Sign in to (or create) CRA My Account — or use the paper form."; "Submit through CRA My Account for the fastest processing."
   - Snapshot: "you must send your DTC application ... using the digital DTC application form or by mail. You may not send DTC forms through the 'submit documents' section of your CRA account."
   - Difference: route; page names the digital DTC application form or mail, not My Account. Guardrails apply; changes need care.

5. **excise-gasoline-tax-refund — `REQS.vehicleDisability`**
   - Current: "The vehicle programs require one of the listed mobility, vision, or public-transit disability criteria."
   - Snapshot: "If you have a permanent mobility impairment and cannot safely use public transportation".
   - Difference: scope; page names only a permanent mobility impairment (gate is shared with other vehicle programs).

6. **fortsask-access — `REQS.lowIncome`**
   - Current: "This is for lower-income households."
   - Snapshot: "receiving funding from: an approved Government program (such as: AISH, CPPD, FSCD or Income Support); OR have a combined household income at or under the amounts listed".
   - Difference: dropped alternative; the approved-program route needs no income test.

7. **leduc-subsidies — `amount / summary / note / values.note / tips[0]`**
   - Current: "half-price local, commuter and LATS transit passes"; "reduce local, commuter and LATS transit costs"
   - Snapshot: "Client’s choice between local, commuter or LATS monthly pass."
   - Difference: scope; one monthly pass of the client's choice, not all three or transit generally.

8. **leduc-subsidies — `amount / summary / note / about` (recreation)**
   - Current: free Leduc Recreation Centre membership and "recreation access" presented as available.
   - Snapshot: "the program is now CLOSED and will reopen for new applications in January 2027".
   - Difference: dropped condition; the Recreation Assistance Program is closed to new applications.

9. **okotoks-fee-assistance — `REQS.okotoks`**
   - Current: "This is a Town of Okotoks program." (met only when city is Okotoks)
   - Snapshot: "you must live in the Town of Okotoks or Foothills County".
   - Difference: scope; Foothills County residents also qualify but the gate excludes them.
