# AbilityFinder remaining Alberta/federal benefit-integrity review

Access date: **2026-07-22** (America/Edmonton)
Scope owner: `/root/verify_ab_federal`
Repository: `/Users/abdulaziz/Claude Random Apps/benefit-finder`
Method: source/code comparison against current official government or program-owner pages. No source, benefit-data, or generated-file changes were made.

## Coverage and claim-count ledger

This pass completes the Alberta/federal records omitted from the earlier 26-program benefit review and checks the Alberta/Canada portions of the support, help, grant, and organization directories.

I used a repeatable, conservative counting rule. A “claim-shaped unit” is one scalar user-facing fact or applicability predicate: program identity/jurisdiction, amount, summary, note, official/apply URL, each `requires` predicate, each guide about/step/document/tip/time/phone item; equivalent fields and result-match filters for grants; and each title/summary/applicability/link/tip item for supports. Display-only icons/categories and `verified` metadata are excluded.

| Dataset | Records reviewed | Claim-shaped units |
|---|---:|---:|
| Remaining `BENEFITS` | 18 | 343 |
| Alberta/Canada `GRANTS_DIRECTORY` | 11 | 112 |
| Alberta `ORGS_DIRECTORY` | 13 | 78 |
| Alberta/Canada `HELP_ORGS` | 6 | 40 |
| `SUPPORTS` | 19 | 199 |
| **Total** | **67** | **772** |

All 573 government/program/directory claim units received an owner-source review at record level. The 199 support-strategy units were inventoried and risk-reviewed, but most are general educational, legal-accommodation, or health advice rather than official program facts; they do not have claim-level evidence citations in the product. They therefore remain **manual evidence/editorial validation required**, except for directly checkable service claims such as 9-8-8, CNIB/CELA, and 2-1-1.

Known verification gaps:

- Spruce Grove’s current official page confirms a subsidized local and commuter pass but no longer publishes the `$25`/`$50` prices stored in the catalogue. Direct City confirmation is required before calling those figures wrong or fresh.
- LawCentral Alberta’s official site returned an anti-bot verification page to the audit client. The URL is live, but its current service description needs a normal-browser/manual confirmation.
- Several charity programs are budget/window dependent. Their existence and current published rules were verified, but funds and intake availability can change between access and user action.
- No legal opinion was obtained on the accommodation wording, and no clinician or real disabled-user panel evaluated the 199 support-strategy claims.

## Immediate high-harm findings

### ABFED-01 — Alberta documentation action sends users to British Columbia

- Severity/Priority/Confidence/Type: **High / P1 / Confirmed / Data accuracy + UX**
- Affected users: Alberta users missing disability documentation for DRES or the Alberta Student Grant (also Alberta users viewing federal disability student grants).
- Evidence: `public/app.js:258-263` defines the shared `disabilityDoc` action as “See B.C. disability verification steps” and links to `studentaidbc.ca`. DRES requires it at `public/data.js:1401`; Alberta Grant requires it at `public/data.js:1435`. `evaluate()` returns this action for every unmet non-fixed predicate (`public/app.js:525-544`).
- Reproduction: create an Alberta post-secondary/student or employment profile, answer that disability documentation is not confirmed, and open the one-step-away action for DRES/Alberta Grant.
- Expected: Alberta-specific documentation/application instructions.
- Actual: a B.C. StudentAid action.
- Root cause: a province-specific action was placed on a global requirement key.
- Correction: make the action contextual by program/province, or omit the action and link the affected official guide.
- Verification/regression: assert the exact action URL for unmet `disabilityDoc` across AB DRES, AB Student Grant, federal grants in AB, and each B.C. record.

### ABFED-02 — Alberta Adult Health Benefit is presented as a general low-income plan

- Severity/Priority/Confidence/Type: **High / P1 / Confirmed / Data accuracy**
- Affected users: lower-income Alberta adults who are not pregnant, do not have high ongoing prescription-drug needs, and are not leaving AISH/Income Support because of qualifying income.
- Evidence: `public/data.js:1467-1490` says lower income is sufficient and `requires: ["adult","ab","lowIncome"]`. Alberta’s official page limits the program to lower-income Albertans who are pregnant, have high ongoing prescription needs, or are leaving AISH/Income Support because of excess employment, self-employment, or CPP-D income; citizenship/PR and Alberta residence also apply: https://www.alberta.ca/alberta-adult-health-benefit
- Reproduction: Alberta, age 19–59, lower income, no relevant categorical circumstance; complete all current required answers.
- Expected: not “ready”; the categorical route and status rules must be confirmed.
- Actual: `evaluate()` has no unmet requirement and returns `ready`.
- Root cause: the catalogue models only income, age, and province.
- Correction: add the official categorical routes and immigration/residency limits; rewrite “free” to explain eligible benefits, limits, and other-insurer-first rules.
- Verification/regression: one positive test per official route and negative tests for low income alone, other health coverage, non-residency, and unsupported status.

### ABFED-03 — FSCD can be “ready” for every Alberta child profile

- Severity/Priority/Confidence/Type: **High / P1 / Confirmed / Data accuracy**
- Evidence: `public/data.js:1360-1387` uses only `requires: ["child","ab"]`. Official rules require a guardian applicant, Alberta residence, child citizenship/PR, and medical documentation confirming an eligible disability **or that the child is awaiting diagnosis**: https://www.alberta.ca/fscd-eligibility
- Harm: the site can call an ordinary Alberta child profile “ready,” while the guide incorrectly says a diagnosis is required and may discourage a family whose child is awaiting diagnosis.
- Correction: model/confirm disability-or-awaiting-diagnosis, guardian, status, and residence; change the document wording to match the official alternative.
- Regression: eligible diagnosed child; awaiting-diagnosis child; no disability concern; non-guardian; non-resident/status cases.

### ABFED-04 — PDD matching omits central assessed eligibility and excludes older adults

- Severity/Priority/Confidence/Type: **High / P1 / Confirmed / Data accuracy**
- Evidence: `public/data.js:1326-1354` requires `adult`, Alberta, and `developmental`. `developmental` accepts autism or intellectual-disability selection plus onset before 18 (`public/app.js:362-368`), but official PDD eligibility also requires citizen/PR status and assessment evidence including IQ of 70 or lower and significant adaptive/daily-living limitations: https://www.alberta.ca/pdd-eligibility. The shared `adult` predicate is hard-coded to age 18–64 (`public/app.js:205`), while PDD begins at 18 and publishes no upper-age exclusion.
- Actual: a diagnosis/type selection can produce “ready” without official assessed criteria; a person 65+ is rejected.
- Correction: avoid diagnosis-only readiness; represent eligibility as needing official psychological/adaptive assessment and status confirmation, and use a PDD-specific age 18+ rule.
- Regression: autism without qualifying intellectual/adaptive findings; confirmed qualifying assessment; 65+ adult; non-citizen/PR.

### ABFED-05 — Alberta Student Grant instructions repeatedly describe the wrong annual process

- Severity/Priority/Confidence/Type: **High / P1 / Confirmed / Data accuracy**
- Evidence: `public/data.js:1432-1457` says the grant automatically stacks on federal grants, says Schedule 4/medical documents are only submitted the first time, and says there is no extra form. Alberta’s current policy says the up-to-$3,000 Grant for Students with Disabilities supports approved disability-related services/equipment, is allocated only when federal CSG-DSE is unavailable or insufficient (federal funding is allocated first), and requires Schedule 4 with requested supports/quotes for the application: https://studentaid.alberta.ca/policy/student-aid-policy-manual/eligibility-for-student-loans-and-grants/alberta-student-grants/ and https://studentaid.alberta.ca/student-aid-funding-guide/loans-and-grants-funding-guide/students-with-disabilities/students-with-disabilities-and-required-documentation/
- Other missing gates: eligible full-time/reduced course load, at least `$1` calculated need, approved costs, and CSG-DSE ordering.
- Correction: distinguish reusable disability verification from the Schedule 4/services-and-equipment request required for the relevant application; explain federal-first allocation without promising stacking.
- Regression: first and repeat applications, no requested costs, federal amount fully covers costs, and approved excess costs.

### ABFED-06 — Parking placard turns any vision selection into a ready result

- Severity/Priority/Confidence/Type: **High / P1 / Confirmed / Data accuracy**
- Evidence: official eligibility is inability to walk 50 metres or vision loss that substantially limits safe independent navigation in a parking area: https://www.alberta.ca/get-parking-placard-people-disabilities. The matcher accepts `hasDisability("vision")` with no functional threshold (`public/app.js:299-305`), and the record requires only Alberta plus `mobility` (`public/data.js:1529-1539`).
- Harm: this violates the project’s functional-limitation-not-diagnosis rule and can label mild/corrected vision loss “ready.”
- Correction: ask/confirm the official navigation limitation and keep practitioner certification as unresolved until completed.
- Regression: mild vision loss, qualifying navigation limit, physical disability with ability to walk over 50m, and qualifying inability to walk 50m.

## Other confirmed or actionable findings

### ABFED-07 — DRES copy includes unsupported/excluded services and misses eligible refugees

- Severity/Priority/Confidence/Type: **Medium / P1 / Confirmed / Data accuracy**
- Evidence: `public/data.js:1398-1421` promises coaching, training, tutoring and exam accommodations and calls DRES “one of the easiest” supports for selected diagnoses. Alberta’s page lists disability-related devices, communication services, aides, workplace/vehicle modifications, and explicitly excludes ordinary employment services and skills/employment training. It also excludes publicly funded Alberta post-secondary and K–12 education supports because those institutions must accommodate. Convention Refugees are eligible, but `citizenPR` rejects them: https://www.alberta.ca/disability-related-employment-supports
- Correction: use only published covered supports/exclusions; add age 16+, currently employed/employment-destined and Convention Refugee routes; remove unsupported ease/diagnosis claims.
- Regression: employed person, public-postsecondary student, training-only request, Convention Refugee, and covered assistive-device request.

### ABFED-08 — CWB disability supplement matcher omits statutory exclusions

- Severity/Priority/Confidence/Type: **Medium / P1 / Confirmed / Data accuracy**
- Evidence: `public/data.js:1070-1102` requires only DTC, working and lower income. CRA’s 2025 rules also require Canadian residence and age 19+ unless the person has a spouse/common-law partner or eligible dependant; exclusions include many full-time students, 90+ days in prison, and diplomats. The `$843` 2025 disability maximum and Alberta-specific calculations are supported: https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-45300-canada-workers-benefit-cwb/how-much-you-can-get.html and https://www.canada.ca/content/dam/cra-arc/formspubs/pbg/5009-s6/5009-s6-25e.pdf
- Correction: do not call the record ready without the age/residence/student/exclusion checks, or present it as a lead requiring Schedule 6 confirmation.

### ABFED-09 — Child Health Benefit excludes eligible 18/19-year-old students and omits exclusions

- Severity/Priority/Confidence/Type: **Medium / P1 / Confirmed / Data accuracy**
- Evidence: official coverage can include an 18- or 19-year-old living at home and attending high school; status/residency and exclusions for children already receiving specified government/NIHB coverage also apply: https://www.alberta.ca/alberta-child-health-benefit. `requires: ["child","ab","lowIncome"]` (`public/data.js:1496-1524`) uses `child`, which is strictly under 18 (`public/app.js:207`).
- Correction/regression: model the high-school extension and exclusion/status rules; test age 18 and 19 in high school, age 19 not in school, and existing assistance coverage.

### ABFED-10 — Health-benefit contact and timing guidance is unsupported

- Severity/Priority/Confidence/Type: **Medium / P2 / Confirmed / Data accuracy**
- Evidence: both Alberta health records publish “a few weeks” and Alberta Supports `1-877-644-9992` (`public/data.js:1491-1492`, `1524-1525`). Official pages do not publish that processing time and direct applicants to Health Benefits at `1-877-469-5437` (Edmonton `780-427-6848` for Adult Health).
- Correction: use the official program contact and say to ask for current processing time.

### ABFED-11 — Wood Buffalo guide contradicts the current specialized-transit product

- Severity/Priority/Confidence/Type: **Medium / P2 / Confirmed / Data accuracy**
- Evidence: `public/data.js:1912` says 10- and 20-ride SMART Bus passes, while its own step at line 1917 says 10- or 25-ride. The current RMWB page says 75% off 10- and 25-ride Specialized Transit passes, `$10` conventional monthly fare, 60% recreation support, age 18+, and 7–10 business days: https://www.rmwb.ca/programs-and-services/transit/low-income-fare-transit-program-lift/
- Correction: use current “Specialized Transit” terminology and 10/25 rides consistently.

### ABFED-12 — Spruce Grove exact prices are not supported by the current source

- Severity/Priority/Confidence/Type: **Medium / P2 / Needs manual validation / Data accuracy**
- Evidence: `$25` local/`$50` commuter appears at `public/data.js:1939,1947`. The current official page confirms subsidized local and commuter passes, year-round applications, LICO+25%, and Spruce Grove/Stony Plain/Parkland County scope, but does not publish those figures: https://www.sprucegrove.org/services/spruce-grove-transit/transit-fares/
- Correction: obtain direct City confirmation or remove exact prices; do not advance the verified date merely because the page loads.

### ABFED-13 — Municipal matchers omit valid geographic/eligibility routes

- Severity/Priority/Confidence/Type: **Medium / P2 / Confirmed / Data accuracy**
- Evidence:
  - Okotoks official scope includes Foothills County, but the matcher accepts only city `Okotoks` (`public/app.js:385`; record `public/data.js:1995-2010`): https://www.okotoks.ca/your-community/social-well-being/family-community-resources/okotoks-family-resource-centre-7
  - Lloydminster accepts qualifying income **or** AISH/SAID **or** newcomer status under 18 months, but the record only requires `lowIncome` (`public/data.js:2035-2050`): https://www.lloydminster.ca/recreation-culture-community/social-programs-and-services/recreation-access-program/
  - Fort Saskatchewan accepts AISH, CPP Disability, FSCD or Income Support as alternate routes, but the record only requires `lowIncome` (`public/data.js:2055-2070`): https://www.fortsask.ca/recreation-parks/program-registrations-drop-in-classes/access-for-everyone-program/
  - Spruce Grove’s city predicate omits Parkland County (`public/app.js:382`) even though the record/source says the area serves it.
- Correction: represent these as exact alternate routes, and add a safe location choice/fallback for eligible county residents.

### ABFED-14 — Canmore readiness omits material residence/status rules

- Severity/Priority/Confidence/Type: **Medium / P2 / Confirmed / Data accuracy**
- Evidence: `public/data.js:2015-2030` requires only city and low income. The official program requires three months’ Canmore residence plus accepted citizenship/PR/immigration status; open work permits and working-holiday status are not accepted: https://www.canmore.ca/your-community/community-supports-and-services/affordable-services-program
- Correction/regression: add a confirm-first status for length of residence and status; test newcomer and permit variants.

### ABFED-15 — Shared municipal income proxy remains unsafe for Airdrie/Wood Buffalo

- Severity/Priority/Confidence/Type: **High / P1 / Confirmed / Data accuracy**
- Cross-reference: this is the same root cause already recorded in the earlier audit as **DATA-04**, so it should not receive a second top-level report ID.
- Additional evidence: Airdrie and Wood Buffalo use `lowIncomeOrDisabilityIncome` (`public/data.js:1870,1904`); that predicate treats DTC approval or “unable to work” as proof of low income (`public/app.js:235-239`). Both official programs use household-income tests. Airdrie: https://www.airdrie.ca/index.cfm?serviceID=2157. Wood Buffalo source above.

### ABFED-16 — Easter Seals directory advertises equipment intake after it closed

- Severity/Priority/Confidence/Type: **Medium / P1 / Confirmed / Data accuracy**
- Evidence: `public/grants-data.js:8` advertises “Equipment programs” and “equipment funding programs,” verified `2026-07-19`. The linked owner page says no new equipment-loan applications have been accepted since **2026-03-19** and the program is winding down: https://easterseals.ab.ca/equipment-programs/
- Correction: clearly mark equipment intake closed/remove it as an active equipment lead; retain separately verified camp/scholarship/navigation programs only.

### ABFED-17 — Dog Guides lead does not disclose that six applicant programs are closed

- Severity/Priority/Confidence/Type: **Medium / P1 / Confirmed / Data accuracy**
- Evidence: `public/grants-data.js:11` lists all seven programs and tells users to apply. The current official FAQ says applications are only being accepted for Facility Support; the current program list remains visible but the other six are not open: https://www.dogguides.com/about-us/faqs/ and https://www.dogguides.com/get-a-dog-guide/
- Correction: describe availability explicitly and require users to check whether their program’s intake has reopened.

### ABFED-18 — Shine result matching uses the wrong age range

- Severity/Priority/Confidence/Type: **Medium / P2 / Confirmed / Data accuracy**
- Evidence: official eligibility is age **11–21**, severe physical disability, and qualifying Canadian status/referral: https://www.shinefoundation.ca/dream-faq. The entry includes every band under 6 through 18 and omits 19–21 (`public/grants-data.js:15`). `grantMatchesAnswers()` enforces those stored bands (`public/app.js:2893-2905`).
- Actual: children under 11 can receive a matched lead; eligible 19–21-year-olds cannot.
- Correction/regression: model 11–21 and keep severity/status/referral criteria as “confirm with owner.”

### ABFED-19 — CP CARES and Tetra result leads omit material routing prerequisites

- Severity/Priority/Confidence/Type: **Low / P2 / Confirmed / Data accuracy/UX**
- CP CARES (`public/grants-data.js:6`) can match any AB equipment need, but official rules require paid CPAA membership for at least three months, a member intake, diagnosis/support/funding evidence, three quotes or recent receipts, once per 12 months, maximum request `$1,500`, funds not guaranteed: https://www.cpalberta.com/funding-request
- Tetra (`public/grants-data.js:7`) tells all Alberta users to use Tetra’s request route, but Calgary requests are now handled by the independent Ability Workshop Society: https://tetrasociety.org/prairie-region/
- Correction: add these prerequisites/routing to the visible lead so a fatigued user need not discover them only after leaving the site.

### ABFED-20 — Support-strategy content lacks an evidence/clinical governance boundary

- Severity/Priority/Confidence/Type: **Medium / P2 / High confidence / Maintainability + content integrity**
- Evidence: 19 `SUPPORTS` records contain 199 claim-shaped units (`public/data.js:432-717`) without per-record source or verification metadata. Some are ordinary planning suggestions; others make legal/clinical/service claims, for example “CBT works very well” and gradual exposure (`public/data.js:547-548`), “Employers can get funding” (`public/data.js:577`), interpreter availability for appointments/school/work (`public/data.js:605`), and post-secondary accommodation wording/list (`public/data.js:464-476`). These vary by individual, jurisdiction, institution, program, and clinical context.
- This is not evidence that every suggestion is wrong. It is a governance gap: the product cannot demonstrate when or against what these claims were reviewed.
- Correction: separate low-risk lived-experience planning tips from legal entitlements, clinical advice and funding claims; cite authoritative/clinical sources for the latter, qualify variability, add review ownership/date, and obtain legal/clinical and disabled-user review. Do not present specific accommodations as guaranteed.

## Benefit verification ledger (18 records, 343 units)

| Record (units) | Current official source | Status and correction needed |
|---|---|---|
| `cwb-disability` (20) | CRA amount page and 2025 Alberta Schedule 6 linked above | **Partly verified / incomplete.** Refundable nature, DTC link, advance possibility and `$843` 2025 max supported. Add age/residence/student/prison/diplomat rules and Alberta thresholds; ABFED-08. |
| `pdd` (20) | https://www.alberta.ca/pdd-eligibility; https://www.alberta.ca/pdd-supports-and-services; https://www.alberta.ca/pdd-how-to-apply | **Partly verified / unsafe matching.** Service categories/phone supported. Add citizenship/PR and assessed IQ/adaptive criteria; remove 64 upper bound; ABFED-04. |
| `fscd` (19) | https://www.alberta.ca/fscd-eligibility | **Partly verified / unsafe matching.** Under-18/AB and broad support purpose supported. Awaiting diagnosis can qualify; guardian/status/disability evidence missing; ABFED-03. The “can combine with CDB” claim was not directly supported by this source and needs an authoritative interaction source. |
| `dres` (21) | https://www.alberta.ca/disability-related-employment-supports | **Incorrect/incomplete.** Covered devices/services and contact supported; training/coaching/tutoring claims and public-postsecondary omission conflict with current page; ABFED-01/07. |
| `ab-grant-disability` (20) | Alberta Student Grants policy and disability-documentation pages linked above | **Procedurally incorrect.** `$3,000` ceiling supported; federal-first and annual Schedule 4/cost request misdescribed; ABFED-01/05. |
| `adult-health-benefit` (19) | https://www.alberta.ca/alberta-adult-health-benefit | **Materially incomplete.** Benefits supported, but categorical eligibility/contact/timing are wrong or omitted; ABFED-02/10. |
| `child-health-benefit` (19) | https://www.alberta.ca/alberta-child-health-benefit | **Partly verified / incomplete.** Benefits and income-based structure supported; age extension/status/exclusions/contact/timing missing or wrong; ABFED-09/10. |
| `parking-placard` (18) | https://www.alberta.ca/get-parking-placard-people-disabilities | **Core facts verified; matcher unsafe.** 50m/navigation criteria, duration, signers, ID and registry route supported. “Low-cost” and often same-day are unsupported; ABFED-06. |
| `airdrie-fair-access` (19) | https://www.airdrie.ca/index.cfm?serviceID=2157 | **Program facts mostly verified / matcher unsafe.** Tiered 75/50/25 and LICO+25% supported. Community Links phone is not supported by this program page. DATA-04/ABFED-15. |
| `woodbuffalo-lift` (23) | RMWB LIFT source linked above | **One outdated contradiction; matcher unsafe.** `$10`, 75%, 60%, age 18+, household application, AISH statement and 7–10 days supported. Fix 20 vs 25 rides; ABFED-11/15. |
| `sprucegrove-low-income-transit` (18) | https://www.sprucegrove.org/services/spruce-grove-transit/transit-fares/ | **Ambiguous/manual follow-up.** Subsidy/scope/year-round/income proof supported; `$25/$50` not published; Parkland matcher gap; ABFED-12/13. |
| `leduc-subsidies` (18) | https://www.leduc.ca/community/family-community-support-services/housing-financial-support | **Verified at published-detail level.** Half-price local/commuter/LATS and free annual LRC membership supported. Exact assessment eligibility remains with FCSS, as the copy warns. |
| `cochrane-connect-card` (18) | https://www.cochrane.ca/node/241/financial-resources/cochrane-connect-card | **Verified.** Financial/situational assessment, 25% COLT, 50% SLS, documentation and appointment are supported. |
| `okotoks-fee-assistance` (18) | Okotoks source linked above | **Facts verified / geographic false negative.** 80% and Foothills County supported; stored document wording says Okotoks residence and matcher excludes county; ABFED-13. |
| `canmore-affordable-services` (18) | Canmore source linked above | **Partly verified / incomplete.** Tiered transit/recreation/community discounts supported; residence-duration/status rules absent; ABFED-14. |
| `lloydminster-recreation-access` (18) | Lloydminster source linked above | **Partly verified / false negatives.** `$2` adult is supported, but `$1` child, 75% memberships and theatre benefit are omitted; AISH/SAID/newcomer routes omitted; ABFED-13. |
| `fortsask-access` (18) | Fort Saskatchewan source linked above | **Core values verified / false negatives.** Free membership and transit subsidy supported; official program-based routes are not matched; ABFED-13. |
| `local-supports` (19) | https://ab.211.ca/ | **Mostly verified for Alberta.** Free/confidential/live 24/7, phone/text/chat, transport/recreation/disability topics supported. “Many languages” was not directly supported on the reviewed page and needs a national/Alberta source. |

## Grant verification ledger (11 records, 112 units)

| Record | Official owner source | Status |
|---|---|---|
| `champ` | https://www.waramps.ca/ways-we-help/child-amputees/ | **Verified.** Under 18, Canada, limb absence/loss, artificial/recreational limbs, clinic travel, peer support and enrolment form supported. |
| `cp-cares` | https://www.cpalberta.com/funding-request | **Partly verified / important prerequisites omitted.** ABFED-19. |
| `tetra` | https://tetrasociety.org/about/; https://tetrasociety.org/prairie-region/ | **Service verified / Calgary routing incomplete.** ABFED-19. |
| `easter-seals-ab` | https://easterseals.ab.ca/equipment-programs/ | **Outdated for equipment intake.** ABFED-16. |
| `variety-ab` | https://varietyalberta.ca/ | **Verified at directory level.** Alberta children/youth, adaptive equipment, Go Baby Go and Volt Hockey supported. Current program-specific intake still must be checked. |
| `hope-air` | https://hopeair.ca/travel-support-services/ | **Verified.** Financial need/travel-away-from-home, flights, accommodation, meals and airport ground transport supported; availability varies. |
| `dog-guides` | https://www.dogguides.com/get-a-dog-guide/; https://www.dogguides.com/about-us/faqs/ | **Programs/no-cost verified; intake availability misleading.** ABFED-17. |
| `als-ab-equipment` | https://www.alsab.ca/get-help/getting-equipment/ | **Partly verified.** Free provincial equipment loan and professional request route supported. The additional “home visits” claim was not established by the reviewed current page and needs follow-up. |
| `kids-cancer-care` | https://www.kidscancercare.ab.ca/for-families/ | **Verified.** Camp, counselling, tutoring/education, therapeutic exercise, family support and scholarships supported and currently offered at no cost. |
| `dayforce-cares` | https://www.dayforcecares.com/ca/apply | **Broad description verified but materially thin.** Current rules include four two-week windows, 490 applications/year, citizenship/PR and income documents, two quotes, vendor credit-card payment from July 2026, once-per-household lifetime approval and maximum `$5,000`. The directory tells users to check criteria, so omission is a content gap rather than a false rule. |
| `shine-dreams` | https://www.shinefoundation.ca/dream-faq | **Program verified / matcher age wrong.** ABFED-18. |

## Help and organization verification ledger (19 records, 118 units)

| Record(s) | Owner source | Status |
|---|---|---|
| HELP `vad`; ORG `vad` | https://vadsociety.ca/ | **Mostly verified.** Current appointment form lists CDB, AISH, CPP-D, DTC, Alberta Health Benefit and other support; phone is correct; advocacy/consulting/referrals supported. “Free” and appeal scope were not directly established by the reviewed service page and should be confirmed. |
| HELP `inclusion-ab`; ORG `inclusion-alberta` | https://inclusionalberta.org/dtc-rdsp-info/; https://inclusionalberta.org/what-we-do/individual-family-advocacy/ | **Verified at current service level.** DTC/RDSP information, external free navigation, phone, province-wide family advocacy, education/employment/family supports are supported. Wording should not imply Inclusion Alberta itself necessarily delivers every one-to-one federal navigator service named on the page. |
| HELP `rdsp-helpline` | https://www.rdsp.com/access-rdsp/; https://www.rdsp.com/resources/helpline/ | **Verified.** Free national helpline and phone supported. Current response is stated as 4–8 business days after voicemail; the AbilityFinder record makes no immediate-response promise. |
| HELP `legal-aid-ab` | https://www.legalaid.ab.ca/resources/application-processes/ | **Verified with qualification.** AISH/EI/AB Works income-support appeals are covered only after internal appeals and subject to financial/service eligibility. Legal Aid is generally low-cost, not free. |
| HELP `lawcentral-ab` | https://www.lawcentralalberta.ca/ | **Manual content validation required.** Live URL returned anti-bot verification to the audit client. Do not advance verification date without a normal-browser review. |
| HELP `ab-211` | https://ab.211.ca/ | **Verified.** Free/confidential/live 24/7, call/text/chat and listed service categories supported. |
| ORG `cnib-ab` | https://www.cnib.ca/en/blog/cnib-alberta-summer-programs-2026; https://www.cnib.ca/en/programs-and-services/live/cnib-guide-dogs | **Verified at directory level.** Alberta programs, accessible technology, peer/community, independent-living and guide-dog services supported. |
| ORG `gateway` | https://gatewayassociation.ca/frc/; https://gatewayassociation.ca/erc/ | **Verified.** Calgary/Edmonton family and employment resource centres, transition help, workshops and individualized job-seeker support supported. |
| ORG `momentum` | https://momentum.org/; https://momentum.org/programs/matched-savings-adults | **Verified.** Calgary/low-income financial learning, matched savings, training and microloan activity supported. |
| ORG `sci-alberta` | https://sci-ab.ca/services/support/ | **Verified.** SCI/similar physical disabilities, peer/client support and service coordination supported. |
| ORG `autism-edmonton` | https://www.autismedmonton.org/programs/ | **Verified.** Navigation, information, skills/activity and peer-support groups supported. |
| ORG `employabilities` | https://employabilities.ab.ca/ | **Verified.** Edmonton/northern AB, disability/medical/mental-health barriers, skill development, education and employment support supported. |
| ORG `skills-society` | https://www.skillssociety.ca/services/ | **Verified with specificity.** Edmonton-area customized PDD/daily-living/community support and acquired-brain-injury services supported. |
| ORG `chrysalis` | https://chrysalis.ca/edmonton-programs-and-services/ | **Verified with eligibility qualifier.** Employment/day/creative-arts services supported; core programs serve PDD-funded adults with developmental disabilities. |
| ORG `eclc` | https://www.eclc.ca/ | **Verified.** Free legal help where income is a barrier, Edmonton/northern Alberta, including income support and listed civil areas. |
| ORG `calgary-legal-guidance` | https://clg.ab.ca/; https://clg.ab.ca/index.php/summary-advice/ | **Verified.** Free short-term advice/assistance and Social Benefits Advocacy for financially barred Calgarians supported; not general representation. |
| ORG `between-friends` | https://betweenfriends.ab.ca/camp-bonaventure/ | **Verified.** Calgary social/recreation/camp programming and inclusive/adapted activities supported. |

## Supports ledger (19 records, 199 units)

| Record (units) | Status |
|---|---|
| `early-learning-support` (9) | **Manual disabled-user/early-childhood review required.** Low-risk planning suggestions; 2-1-1 destination valid. |
| `school-support-plan` (10) | **Manual education/legal review required.** Functional-needs framing is appropriate; “do not delay while waiting for diagnosis” can vary by requested formal support. |
| `accommodations` (11) | **Manual legal/institutional review required.** Duty to accommodate is a benchmark, but every listed accommodation is request/assessment dependent, not guaranteed. |
| `study-tools` (12) | **Manual efficacy/accessibility review required.** Tools exist; effectiveness and product references are individualized. |
| `exam-strategy` (9) | **Manual education/cognitive-accessibility review required.** General strategy, not an entitlement. |
| `focus` (10) | **Manual ADHD/clinical and disabled-user review required.** Avoid universal efficacy wording. |
| `memory` (12) | **Manual neuropsychology/ABI review required.** General advice; no source/contraindication boundary. |
| `calm` (12) | **Clinical review required.** CBT/exposure and breathing advice should be qualified and sourced; not individualized care. |
| `time` (14) | **Manual occupational/cognitive review required.** Product examples and strategy efficacy are not sourced. |
| `employment` (10) | **Legal/program review required.** Accommodation examples are requests, and employer funding is program/eligibility dependent. |
| `vision-tech` (10) | **Mostly service-verifiable; disabled-user review required.** Screen readers/settings, CELA and CNIB services exist; suitability varies. |
| `hearing-tech` (10) | **Service/funding review required.** Technology exists, but hearing-device funding and interpreter availability vary by province/context. |
| `mobility-supports` (11) | **Program-by-program review required.** AADL/parking/municipal transit are covered elsewhere; home-modification availability is conditional and RAMP is absent from the catalogue (cross-reference earlier DATA-12). |
| `speech-aac` (10) | **SLP/AAC and funding review required.** General device/assessment pathway is plausible; coverage varies. |
| `energy-pacing` (11) | **Clinical/occupational review required.** General chronic-illness advice; flexible work/school arrangements are request-dependent. |
| `autism-supports` (10) | **Autistic-user/OT review required.** Avoid treating sensory/transition strategies as universally suitable. |
| `intellectual-supports` (9) | **Disabled-user/legal/service review required.** Supported decision-making and local service availability vary. |
| `braininjury-support` (10) | **ABI clinician/lived-experience review required.** External-aid/pacing suggestions are general, not treatment advice. |
| `mental-resources` (9) | **Partly verified / clinical review required.** 9-8-8 is free 24/7 call/text at https://988.ca/. Family-doctor referral and free/low-cost therapy availability vary. |

## Clean correction/verification plan for this scope

P1 regression gates:

1. Assert Alberta vs B.C. documentation action URLs per benefit.
2. Table-driven matcher tests for every official categorical route and exclusion of Adult Health, FSCD, PDD, DRES, CWB, Child Health and parking placard.
3. Explicit functional-limit tests so a diagnosis/type alone cannot make parking/PDD ready.
4. Age boundaries: CWB 18/19 exception scenarios, PDD 64/65+, Child Health 17/18/19/high-school, DRES 15/16.
5. Municipality tests for household-income-only programs and exact alternate AISH/SAID/CPP-D/FSCD/newcomer/county routes.
6. Student-grant guide snapshot/content tests for federal-first ordering and current Schedule 4 requirements.
7. Directory availability tests/fixtures for closed or windowed programs; make verified-date advancement require claim-source review, not merely HTTP success.

P2/P3 evidence governance:

- Give each non-program support record an owner, review type (clinical/legal/lived experience), sources where applicable, and last-reviewed date distinct from benefit-data verification.
- Add a scheduled manual checklist for program intake states that a link monitor cannot detect (Easter Seals, Dog Guides, Dayforce, charities).
- Re-run the generated assistant-grounding comparison after approved source corrections; do not edit generated files by hand.

## Bottom line for the parent audit

This omitted scope is **not clean enough to describe as fully verified**. At least six P1 data/matcher issues can materially misdirect an applicant: wrong-province document action, general-low-income Adult Health matching, unconditional FSCD child matching, diagnosis/age-biased PDD matching, incorrect Alberta Student Grant process, and diagnosis-only vision readiness for parking. Directory freshness also failed in two actionable places (Easter Seals equipment closure and Dog Guide intake availability). The precise scope completed is **67 records / 772 claim-shaped units**, with the explicitly disclosed evidence gaps above.
