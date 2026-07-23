# AbilityFinder — remaining British Columbia content-integrity audit

Access date: 2026-07-22
Scope: read-only review; no repository, data, generated-file, commit, deployment, or production mutation.

## Reconciled coverage

- Main catalogue: all 48 BC records in `public/data.js:2111-3198`.
- Atomic user-facing assertions reviewed: 1,314 benefit-record assertions plus 144 `BENEFIT_META` assertions = 1,458. This count includes every scalar display assertion, every eligibility token, every step/document/tip, source/apply URL, timing and phone. `BENEFIT_VALUES` contributed zero assertions because all 48 records are absent from that model.
- Main-record status: 32 verified; 13 correction required; 2 outdated; 1 manual follow-up required.
- BC directories: all 7 BC grant entries (112 atomic assertions), all 9 BC organization entries (72), all 6 BC `HELP_ORGS` entries (69), and 8 BC-resolving support entries (100). Total directory/support assertions: 353.
- Total BC assertions accounted for in this pass: 1,811.
- Municipal recreation: all nine records checked separately against that municipality's own source; no municipal rule was copied from another municipality.
- Full main-record ledger: `/tmp/abilityfinder-audit/remaining-bc-claims.csv`.
- Safe live-link limitation: official pages were opened through read-only retrieval and search. A single proposed GET of production `/api/link-health` was not completed after the environment approval request was interrupted; no production link-health result is claimed.

Status means the material eligibility, amount, application and interaction assertions were supported by the current official source. “Verified” is not a guarantee that a program owner will approve an individual.

## Immediate BC findings

### BC-BC-01 — all 48 BC records are absent from `BENEFIT_VALUES`

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Defect, UX, maintainability
- Evidence: Code-confirmed.
- Affected users: every BC user viewing the money band, “Priority order,” or printed annual total.
- Affected code: `public/data.js:107` (`BENEFIT_VALUES` ends after Alberta/local records); `public/app.js:428-455` (`valueParts`); `public/app.js:473-484` (`priorityScore`); `public/app.js:487+` (`renderMoneyBand`); `public/app.js:3553-3560` (`reportAnnualTotal`).
- Observed/code path: each BC record falls back to raw `b.amount` on its card, but `renderMoneyBand` and `reportAnnualTotal` only sum entries present in `BENEFIT_VALUES`. `priorityScore` assigns every BC record zero value and therefore sorts almost entirely by application difficulty. All 48 rows in the CSV have `benefit_value_present=no`.
- User harm: BC cash, grants, refundable credits and discounts are omitted from the annual estimate; priority recommendations systematically ignore their value. This can move a low-value easy item ahead of a material income benefit and makes the print summary understate help.
- Expected: structured, source-backed values with explicit non-additive/exclusion rules.
- Correction: add reviewed BC value entries, including `excludeFromEstimate`, mutually-exclusive groups, transition-program de-duplication, periodicity and non-cash kinds. Do not naïvely sum Autism Funding with its replacement benefit, transit pass with the $52 transport supplement, or overlapping student grants.
- Verification: fixture with a BC answer set must assert a non-zero annual total only for additive ready cash/grants/credits; assert the expected priority order; assert print and screen totals match; assert mutually exclusive/replacement benefits are not double-counted.

### BC-BC-02 — PWD record gives the wrong prescribed-class count and route

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Data accuracy
- Evidence: Source-confirmed at `public/data.js:2124`.
- Official source: https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/pwd-designation-and-application/designation-application
- Actual: “Five prescribed classes” includes Indigenous Services Canada PWD designation as an HR3642 route.
- Official rule: the current prescribed-class list has four classes: Plan P, At Home Program, CLBC, and CPP Disability/Post-Retirement Disability. An ISC-designated person moving off reserve follows a consent/file-review process and may still be asked for HR2883.
- Correction/test: correct count and process; test the guide and assistant grounding for the same wording.

### BC-BC-03 — both Autism Funding records use a stale 20% final-period TTE cap

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Data accuracy
- Evidence: Source-confirmed at `public/data.js:2355-2401`.
- Official sources: https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs and https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/autism-spectrum-disorder/autism-funding/purchase-equipment-supplies
- Actual: both details say training/travel/equipment is capped at 20%.
- Current transition guidance: the final funding period increased the allowance from 20% to 50%. The older equipment subpage still says 20%, an intra-government inconsistency that must be disclosed rather than silently resolved.
- Correction/test: state 50% for the final aligned period, tell users to confirm their agreement, and add a source-conflict regression fixture.

### BC-BC-04 — unsupported claim that “most” transitioning Autism Funding families receive an increase

- Severity/Priority: Medium / P2
- Confidence/Type: High confidence / Data accuracy
- Evidence: `public/data.js:2397`; no current official source reviewed directly supports this population claim.
- Correction: remove “most” or cite a current official distribution that actually proves it. Individual $6,000-to-$6,500 arithmetic does not prove how many families receive a tier or whether their usable allocation increases.

### BC-BC-05 — new families can receive a false “ready” result for the Children and Youth Disability Benefit

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Defect, data accuracy
- Evidence: Code-confirmed predicate at `public/data.js:2403-2425`; Source-confirmed official intake schedule.
- Official source: https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/financial-supports/disability-benefit
- Actual: `["bc","under19","childHighNeeds"]` is enough for “ready,” although new-family direct intake opens April 1, 2027; before then new families use current pathways while existing recipients transition.
- Correction/test: encode existing-recipient/transition/current-pathway/direct-intake states or use a non-eligibility “coming/transition” result status. Test a current recipient, a new family before April 2027 and a post-April-2027 state.

### BC-BC-06 — province-wide BC Transit handyDART result links everyone to Victoria

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Defect
- Evidence: Code-confirmed at `public/data.js:2288-2308`; Source-confirmed that BC Transit intake/forms/fare rules are community-specific.
- Actual: both source and apply URL are Victoria-specific while the result covers BC Transit communities province-wide.
- Correction/test: use a community selector/general route or resolve the user's selected BC Transit system. Test Victoria and at least two non-Victoria systems.

### BC-BC-07 — Monthly Nutritional Supplement contains unsupported success/timing claims

- Severity/Priority: Low / P2
- Confidence/Type: High confidence / Content
- Evidence: `public/data.js:2445-2446`; the official policy/form publishes eligibility and reconsideration, not “typically a few weeks” or a frequency of overturned denials.
- Official sources: https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/health-supplements-and-programs/monthly-nutritional-supplement and https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/policies-for-government/bc-employment-assistance-policy-procedure-manual/forms/pdfs/hr2847.pdf
- Correction: say no guaranteed time is published and describe reconsideration without asserting outcomes.

### BC-BC-08 — BC Bus Pass charges PWD recipients the wrong fee

- Severity/Priority: High / P1
- Confidence/Type: Confirmed / Data accuracy
- Evidence: Source-confirmed at `public/data.js:2472-2493`.
- Official sources: https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/general-supplements-and-programs/bc-bus-pass-program and https://www2.gov.bc.ca/gov/content/transportation/passenger-travel/buses-taxis-limos/bus-pass/people-with-disabilities
- Actual: record repeatedly says PWD recipients pay $45/year and should ask how the pass affects the $52/month supplement.
- Official rule: PWD disability-assistance recipients receive the pass at no cost and choose the pass instead of the $52/month transportation supplement. The $45 fee applies to the eligible senior/other stream.
- Correction/test: split the PWD and senior streams in amount, note, detail and value model. Test that no PWD result states a $45 charge and that the pass/supplement choice is explicit.

### BC-BC-09 — SAET intake/current-program state requires government clarification

- Severity/Priority: Medium / P1
- Confidence/Type: Needs manual validation / Data accuracy
- Evidence: Manual validation required.
- Sources: current transition page and the October 2025 At Home Program Guide.
- Conflict: the guide still publishes SAET caps, while current transition material says SAET-only recipients began moving in April 2026. It does not clearly establish whether a newly eligible family can newly enter SAET now.
- Safe treatment: do not show an unqualified “ready” result. Ask the program which stream applies and record the clarification before advancing the verification date.

### BC-BC-10 — CLBC tips overstate service sequencing and PWD assistance

- Severity/Priority: Medium / P2
- Confidence/Type: High confidence / Data accuracy
- Evidence: `public/data.js:2629`; official CLBC sources support eligibility/services but not “respite commonly the first service.”
- Official source: https://www.communitylivingbc.ca/who-does-clbc-support/eligible-clbc-support/
- Correction: remove the “commonly first” assertion. Explain that CLBC eligibility is a prescribed-class path to PWD designation, but disability-assistance financial, residency and identity requirements still apply.

### BC-BC-11 — CSG services/equipment META still tells users to use Appendix 8

- Severity/Priority: Low / P2
- Confidence/Type: Confirmed / Maintainability, data accuracy
- Evidence: Code-confirmed in `BENEFIT_META` for `bc-csg-services-equipment`; the visible benefit correctly notes the June 2026 online Disability status process.
- Official source: https://studentaidbc.ca/apply/how-to-apply-disability-funding
- Correction/test: align META, guide, context and all instructions; assert “Appendix 8” is absent from current rendered BC StudentAid instructions unless an official exception still requires it.

### BC-BC-12 — Deaf Students grant says an official amount is not published

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Data accuracy
- Evidence: Source-confirmed at `public/data.js:2778-2800`.
- Official sources: https://studentaidbc.ca/explore/grants-scholarships/bc-access-grant-deaf-students and https://studentaidbc.ca/sites/all/files/school-officials/policy_manual_26_27.pdf
- Actual: “Amount not published.”
- Current official policy manual: up to $30,000 per program year, assessed by StudentAid BC.
- Correction/test: show the capped/assessed amount with policy-manual citation and add it to the value model without promising the maximum.

### BC-BC-13 — home-renovation credit copy implies a 2026 expiry

- Severity/Priority: Low / P3
- Confidence/Type: High confidence / Content
- Evidence: Source-confirmed at `public/data.js:2825-2846`.
- Official source: https://www2.gov.bc.ca/gov/content/taxes/income-taxes/personal/credits/seniors-renovation
- Correction: remove “Active for the 2025 and 2026 tax years” or say the amounts were checked for those years; the current source describes an ongoing annual credit and no 2026 sunset.

### BC-BC-14 — WorkBC Employment Services predicate is materially broader than official eligibility

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Defect
- Evidence: Code-confirmed at `public/data.js:2893-2913`; Source-confirmed official eligibility page.
- Official source: https://www.workbc.ca/discover-employment-services/workbc-centres/employment-services/employment-services-eligibility
- Actual: BC + age 16+ + `employmentActive` can produce “ready” for users who do not meet labour-force criteria; official rules have unemployment/underemployment and disability-related employed/student exceptions.
- Correction/test: encode the official partitions or label the result “check eligibility,” then test unemployed, underemployed, stable employed, at-risk employed, full-time student and final-year student.

### BC-BC-15 — Kelowna result omits the post-secondary-student exclusion

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Defect, data accuracy
- Evidence: Source-confirmed at `public/data.js:3129-3148`.
- Official source: https://www.kelowna.ca/parks-recreation/recreation-sport/recreation-programs-registration/financial-assistance-recreation
- Correction/test: add the exclusion to visible eligibility and predicate; test an otherwise qualifying student does not get “ready.”

### BC-BC-16 — Coquitlam result omits immigration-status eligibility/exclusions

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Defect, data accuracy
- Evidence: Source-confirmed at `public/data.js:3150-3170`.
- Official source: https://www.coquitlam.ca/499/Financial-Assistance-for-Recreation
- Official rules include citizens/permanent residents and refugees, and exclude temporary residents/work or study permit holders and business-class investors/entrepreneurs.
- Correction/test: add these branches to copy and evaluation; cover every included/excluded status.

### BC-BC-17 — Kamloops copy implies one form produces both ARCH and KamPASS

- Severity/Priority: Medium / P1
- Confidence/Type: Confirmed / Data accuracy
- Evidence: Source-confirmed at `public/data.js:3172-3197`.
- Official sources: https://www.kamloops.ca/recreation-culture/programs-activities/accessible-recreation/arch-program and https://www.kamloops.ca/our-community/accessibility-inclusion/getting-around-town/kampass-program
- Actual: “the same application also gets you KamPASS.”
- Official rule: one form can request both, but eligibility differs; KamPASS excludes several groups, including recipients of PWD disability assistance.
- Correction/test: say “can also request” and surface exclusions before application. Reverify when the current 2025-26 form expires.

### BC-BC-18 — BC local-support fallback incorrectly promises 24/7 2-1-1

- Severity/Priority: Low / P2
- Confidence/Type: Confirmed / Data accuracy
- Evidence: Source-confirmed at `public/data.js:2083-2109`.
- Official source: https://bc.211.ca/contact-us/
- Actual: “24/7” and “available 24/7 in many languages.”
- Current BC service: Navigators are advertised 9 a.m.–9 p.m. weekdays excluding holidays; calling is free/confidential and interpretation is available in 240+ languages/dialects.
- Correction/test: make hours province-specific and avoid applying another province's 2-1-1 schedule to BC.

## Verification ledger — BC grants

All seven entries were checked against the named program owner's site. Six were materially supported. One requires cycle follow-up.

| ID | Official source | Status | Result |
|---|---|---|---|
| `variety-bc` | https://www.variety.bc.ca/grant-qualifications/ | Verified | 0–19, BC/Yukon residence, health card, professional need, household-income rule and listed funding areas supported. |
| `cknw-kids-fund` | https://www.cknwkidsfund.com/what-is-cknw-kids-fund-adgrant | Verified | Individual BC family applications and equipment/therapy/education categories supported. |
| `kinsmen-bc-equipment` | https://www.kinsmenfoundationofbc.ca/apply-for-funding/ | Verified | BC adults 19+, permanent physical-disability equipment need and last-resort factors supported. |
| `bc-rehab-equipment` | https://bcrehab.org/applications/individual-grant/ | Verified | Physical-disability/financial need, OT/PT assessment, household financials, two quotes, listed equipment and 2026 deadlines supported. |
| `bc-rehab-bursary` | https://bcrehab.org/applications/gert-vorsteher-education/ | Manual follow-up required | Purpose and two $5,000 awards are published, but the application page still exposes a 2025 deadline; obtain the 2026 cycle before presenting a deadline. Current conservative directory copy does not invent one. |
| `cpabc-equipment` | https://bccerebralpalsy.com/programs/equipment-funding-program/ | Verified | CP diagnosis, minor/current member, required evidence, listed devices and August 31, 2026 cycle supported. |
| `bear-essentials` | https://islandkidsfirst.com/bear-essentials/ | Verified | Age through 19, Island residence, confirmed health need, financial need, referral-only application, travel/equipment scope and pre-approval supported. Current page lists a $15,000 lifetime cap; the directory safely omits the amount. |

## Verification ledger — BC organizations and help entries

- `dabc` and `dabc-advocacy-access`: https://disabilityalliancebc.org/ and the current Advocacy Access brochure support cross-disability navigation and help with PWD/PPMB/CPP-D applications/appeals. Phone 1-800-663-1278 supported.
- `dabc-access-dtc`: https://disabilityalliancebc.org/direct-service/help-with-the-rdsp-and-dtc/ supports free DTC/RDSP help. Phone supported.
- `dabc-law-clinic`: https://disabilityalliancebc.org/program/disability-law-clinic/ supports free confidential summary advice/referral on the listed selected issues. Phone supported. It does not advise every disability-related legal matter.
- `fsi-bc`: https://familysupportbc.com/ supports free province-wide family support, interpretation and “no diagnosis needed.” Phone 1-800-441-5403 supported.
- `inclusion-bc` / `inclusion-bc-advocacy`: https://inclusionbc.org/what-we-do/individual-family-advocacy/ supports free non-legal advocacy and the 1-844-488-4321 line.
- `neil-squire`: https://www.neilsquire.ca/individual-programs-services/ supports employment, digital-skills and assistive-technology services, including province-wide WorkBC ATS.
- `autism-bc`: https://www.autismbc.ca/programs/support/ask-autismbc/ supports information/guidance/workshops and expressly says it does not complete forms or provide individual advocacy.
- `wavefront`: https://www.wavefrontcentre.ca/ supports hearing health, communication accessibility, DeafBlind and employment/community services. Employment availability varies by service/location; directory wording is appropriately high-level.
- `sci-bc`: https://sci-bc.ca/ supports peer help, practical information and family/community connection province-wide.
- `bc-211`: https://bc.211.ca/ supports the listed resource categories. The help entry itself does not claim 24/7; only `local-supports` contains the erroneous hours claim described in BC-BC-18.

## BC-resolving support entries

The eight entries are `early-learning-support`, `school-support-plan`, `accommodations`, `calm`, `employment`, `mobility-supports`, `speech-aac`, and `energy-pacing`. Their BC destinations resolve to StudentAid BC, WorkBC or BC 211 and those destinations are current. The broad strategy text is general informational advice, not a verified benefit-eligibility rule. It should not be used to calculate “ready/almost/not a match,” amounts, or application priority. Clinical claims such as the effectiveness of CBT and generalized accommodation duties need a separately scoped evidence/legal review if the product wants to present them as authoritative.

## Propagation and consistency

Material `public/data.js` errors propagate into:

- result cards and benefit details;
- printable results (raw `b.amount`, details and `BENEFIT_META`);
- application guides generated from the catalogue;
- `src/benefits-context.js` assistant grounding after generation;
- `src/links.js` monitored source/apply links after generation.

The missing `BENEFIT_VALUES` defect additionally affects the screen money band, priority sorting and printed annual total, but not the raw amount shown on an individual card. Generated files must be regenerated from corrected source and never hand-edited.

## Limitations and required follow-up

- SAET current/new intake requires direct clarification from the At Home Program.
- BC Rehab must publish or confirm the current bursary cycle before any deadline is shown.
- Real application acceptance, processing time and individual eligibility cannot be proven from public pages.
- A production `/api/link-health` response was not obtained; URL retrieval in this pass does not replace the project's rotating monitor, redirect/soft-404 review or manual form submission.
- This pass did not advance any `verified` date and did not submit forms or personal information.
