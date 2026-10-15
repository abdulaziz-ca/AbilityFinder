# Decisions — re-verification batch 4 (2026-10-15)

Every DIFFERS item 1-41 in `REPORT-2026-10-15-batch4.md` was re-checked against `research/reverify/snapshots/<record>--<n>.txt` (fetched 2026-10-15), the record in `public/data.js` (node vm) and the `REQS` gate in `public/app.js`. All 41 claims were real (no false positives). One (item 31) cannot be settled from the readable sources and stays OPEN. Because the guides and AI context are generated, after any `data.js` or `app.js` edit run `npm run gen:guides`, `npm run gen:context`, `npm run check:surfaces` and the unit and e2e suites. Run e2e alone.

Conventions:
- "Record" means the field in `public/data.js`. "Gate" means `REQS.<key>` in `public/app.js`.
- "Shared gate" means other benefits use it too. I never reword a shared gate; I specify a record-specific gate instead (`fixed: false`, `met` true only when existing answers clearly establish a listed route).
- Quoted replacement text uses only the snapshot's wording. Where the source hedges ("may", "should", "most"), the hedge stays.
- BENEFIT_VALUES / BENEFIT_META are mentioned only where they repeat the wrong claim.
- No test asserts the old text of any record field below unless I name the test.

## Source-limitation notes

- `bc-at-home-saet--1.txt` (the PDF guide) is flattened PDF stream text and unreadable; only `--2` is usable for SAET. `bc-access-grant-deaf-students--1.txt` is not part of the 41 items.
- Vancouver's snapshot is a browser copy. The `...` markers are omitted promotional notes; the eligibility, income tables, documents and exclusions I rely on are present in full.

## A. fscd, handycard-translink, local-supports (items 1-4)

1. **fscd, `detail.documents[0]`: FIX.**
   - Evidence (`fscd--1`): "Medical documentation must be provided confirming the child has a disability or is awaiting a diagnosis." The record's "A diagnosis of your child's disability from a professional" excludes the awaiting-diagnosis route.
   - New `documents[0]`: "Medical documentation confirming your child has a disability or is awaiting a diagnosis".
   - Gate `fscdEligibility` (only fscd, `met: false`, `fixed: false`) already says "disability or an awaiting-diagnosis assessment". No change.
   - Tests: none reference the text. `e2e/matcher-safety.spec.js:126` (fscd "almost") and the oracle entry `fscdEligibility: external(...)` are unaffected.

2. **handycard-translink, `requiresNote`: FIX.**
   - Evidence (`--1`): "HandyDART users may also be eligible for HandyCard, which is a photo-identity card for customers who need assistance to use the conventional system." The HandyDART test ("physical, sensory, or cognitive disability and cannot use conventional public transit for all trips without assistance, you may be eligible to use HandyDART") is stated for HandyDART only; the combined form is "the HandyDART and HandyCard Application Form".
   - New `requiresNote` (short lines): "You apply on the same combined HandyDART and HandyCard application form. HandyDART users may also be eligible for HandyCard, a photo-identity card for customers who need assistance to use the conventional system. The HandyDART test is a physical, sensory or cognitive disability that means you cannot use conventional public transit for all trips without assistance; see the application form for detailed criteria."
   - `BENEFIT_META.effort` "Same application as HandyDART" stays (the form is shared).
   - Gate `transitBarrier` is SHARED (grt-mobilityplus, handydart-translink, handycard-translink, taxisaver-translink, handydart-bctransit, taxi-saver-bctransit). Do not edit it. Its text ("cannot use regular public transit without assistance for some or all trips") is close enough to "need assistance to use the conventional system".
   - Tests: `test/requires-note-rendered.test.js` needs the regenerated guide to contain the new `requiresNote`. `e2e/oracle` status for the record stays "ready".

3. **handycard-translink, `BENEFIT_META.wait`: FIX.**
   - Evidence: "Please allow 4 to 6 weeks processing time for HandyCard applications." (HandyDART applications are processed "within 10 days of confirming receipt".)
   - New `wait`: "Allow 4 to 6 weeks for processing".
   - Also change `detail.time` "Ask Access Transit when you apply" to "Allow 4 to 6 weeks for HandyCard applications to be processed" so the two fields agree.
   - Tests: none (`test/bc-values.test.js` checks only that the id has a values entry).

4. **local-supports, `detail.about` and `detail.tips[0]`: FIX.**
   - Evidence: `--3` "In most of Canada, the free and confidential service can be accessed 24 hours a day, in more than 150 languages". `--2` (BC): "Talk to a ... 211 Navigator 9am-9pm Weekdays (excl. Holidays)" and "Resource Navigators will be available by phone, text, or web chat from 9am to 9pm, Monday to Friday, excluding statutory holidays". `--1` (Alberta) says "Live Answer 24/7", so Alberta's 24/7 is supported, BC's is not.
   - `about` (last sentence): "2-1-1 is a free, confidential service that connects you to the specific programs in your community. In most of Canada you can reach it 24 hours a day, in more than 150 languages. In BC, 211 navigators are available 9am to 9pm, Monday to Friday, excluding statutory holidays."
   - `tips[0]`: "Dialing 2-1-1 is free. In most of Canada it is open 24 hours a day, in many languages; BC navigators are available 9am to 9pm on weekdays."
   - The `note` ("free, confidential service") is accurate. Gates `provinceCovered` and `cityOther` unchanged. No test references the text.

## B. St. Albert and Strathcona (items 5-8)

5. **stalbert-subsidy, `summary`: FIX.**
   - Evidence (`--1`): "Free local tickets for approved Handibus riders for travel within St. Albert." and "Free local fares for travel within St. Albert."
   - The page lists transit under "eligible residents", not under AISH/ADAP (only the free annual recreation membership is tied to AISH/ADAP). So the rewrite must not attach AISH to the transit lines.
   - New `summary`: "St. Albert's subsidy gives eligible residents free local fares within St. Albert and free local Handibus tickets for approved riders, and AISH and ADAP recipients are eligible for a free annual membership at City-run recreation facilities."
   - `amount`: "Free local fares within St. Albert + free annual recreation membership for AISH and ADAP recipients". BENEFIT_VALUES note "Free local transit + free annual rec membership" becomes "Free local fares + free annual rec membership (AISH/ADAP)".
   - Also fix `detail.about` and `detail.aboutList.lead` ("For AISH and ADAP recipients: ...") the same way. New lead: "St. Albert's Family and Community Support Services runs one subsidy covering transit and recreation. For eligible residents:" with items: "free local fares within St. Albert", "free local tickets for approved Handibus riders for travel within St. Albert", "65% off monthly adult commuter fares for travel between St. Albert and Edmonton", "AISH and ADAP recipients are eligible for a free annual membership at City-run recreation facilities, including Servus Credit Union Place, Fountain Park Recreation Centre and Grosvenor Outdoor Pool".
   - Gate `municipalProgramEligibility` is shared with grandeprairie-aish-pass; its text ("Confirm the program's household-income or qualifying benefit-recipient route") is neutral. No change. No test references the text.

6. **stalbert-subsidy, `detail.about` / `detail.aboutList.items[2]`: FIX.**
   - Evidence: "65% off monthly adult commuter fares for travel between St. Albert and Edmonton."
   - New item: "65% off monthly adult commuter fares for travel between St. Albert and Edmonton".
   - `tips[1]`: "The commuter fare between St. Albert and Edmonton is separate from free local fares — ask about both if you travel in." (Drop "commuter pass".)

7. **stalbert-subsidy, `note` and `detail.steps[1]`: FIX.**
   - Evidence: "AISH and ADAP recipients are eligible for a free annual membership." The same page lists "Who Can Apply": "You must be a resident of St. Albert", "You must not be recieving funding from another source for the same option", "Your total annual household income (before taxes) must be within the low-income limits set by Statistics Canada" (1 person $31,264 to 7+ $82,739). The page never says AISH/ADAP recipients skip the income rule or are "automatic".
   - New `note`: "AISH and ADAP recipients are eligible for a free annual recreation membership. The City's page also says your total annual household income (before taxes) must be within the low-income limits set by Statistics Canada, and it does not say whether that rule applies to AISH or ADAP recipients, so confirm with the City."
   - `steps[1]`: "Say that you receive AISH or ADAP — AISH and ADAP recipients are eligible for the free annual recreation membership."
   - Remove "automatic eligibility", "isn't income-tested for you" and "local transit is free rather than discounted" (the last line is also unsupported as stated for AISH).
   - Optional: add the Statistics Canada household-income table as `amountTiers` (headers "Household size", "Household income"; rows 1 $31,264, 2 $38,922, 3 $47,851, 4 $58,096, 5 $65,892, 6 $74,315, 7+ $82,739). Not required for this fix.
   - No test references the text.

8. **strathcona-subsidy, `detail.documents[2]` and `detail.steps[1]`: FIX.**
   - Evidence (`--2`): "2024 Notice of Assessment (NOA) ... (valid until May 31 of the following year). Starting June 1, 2026 - a 2025 Notice of Assessment (NOA) ... will be required and a 2024 Notice of Assessment (NOA) will no longer be accepted. If your NOA no longer reflects your current financial situation, please bring your NOA in addition to 3 months of bank statements for review. If you are new to Canada and are a refugee or permanent resident within the first year and don't have an NOA, please bring 3 months bank statements from a Canadian bank." The page offers no general "other proof of income".
   - `documents[2]`: replace "CRA Notice of Assessment (or other proof of income)" with "Notice of Assessment (NOA) from the Canada Revenue Agency — a 2025 NOA is required starting June 1, 2026, and a 2024 NOA is no longer accepted".
   - Add `documents[3]`: "If your NOA no longer reflects your current finances, bring 3 months of bank statements as well".
   - Add `documents[4]`: "New refugee or permanent resident in the first year with no NOA: 3 months of bank statements from a Canadian bank".
   - `steps[1]`: "Bring ID, proof you live in the County, and your Notice of Assessment (see the documents list for the exceptions)."
   - Date-sensitive: today is after June 1, 2026, so the 2025 NOA wording is current. Re-check at the next reverify.
   - No test references the text.

## C. surrey-leisure-access (items 9-20)

The page states one table, headed "Family size & income table — Only applicable for patrons applying with income tax documents", with no year. It states separately "As of September 1, 2026 all income tax documents submitted must be for the 2025 or 2026 tax year." Do not label the table with a year. The page says "less than the number allowed" (strict), and defines a family as "one or two adults who are married or in a common law relationship and their legal dependents aged 18 and under".

9. **surrey-leisure-access, `amount` and BENEFIT_VALUES note: FIX.**
   - Evidence: "75% discount on most registered courses"; "children and youth ages 0-18 receive up to $500 in program discounts and $500 in Semiahmoo Arts Society program discounts. Adults 19-59 and seniors 60+ receive up to $250 in program discounts and $250 in Semiahmoo Arts Society program discounts"; "There are a few specialty programs that aren't included"; "Applicable day camps ... receive a 75% discount and have no discount limits".
   - New `amount`: "Free 1-year pass for ages 0-18 and 60+, or 75% off for adults 19-59, plus 75% off most registered courses". BENEFIT_VALUES note: "free pass (0-18/60+) or 75% off adults; 75% off most courses".
   - Add to `note` (own sentence): "In the year you are enrolled, course discounts are limited: up to $500 plus $500 at Semiahmoo Arts Society for ages 0-18, and up to $250 plus $250 for adults 19-59 and seniors 60+. Applicable day camps get 75% off with no limit. A few specialty programs are not included."
   - Test: `test/factual-batch.test.js` (~line 312) needs at least 5 records containing "75%"; Surrey keeps it. Ready/estimate status unchanged (`excludeFromEstimate: true`).

10. **surrey-leisure-access, `eligibility.items[1]` and `requiresNote`: FIX.**
   - Evidence: "You may qualify for the program if you are a Surrey resident and one of the following situations applies". The DTC route needs "Your family's combined net income subtracted by your Disability Tax Credit is less than the number allowed for your family size" plus the line 12100/12600/20800/25400 limits. The MCFD route covers children and youth 0-18 "under the legal care of" MCFD, Métis Family Services or VACFSS, and "Young adults (19-25) who are supported by the Ministry of Children and Family Development's (MCFD) SAJE Program"; enrolment "will apply to the foster child(ren) and only one adult who is the legal guardian". The refugee route needs the "Leisure Access Program Refugee Referral Application" completed with an approved settlement agency.
   - Restructure `eligibility` to `mode: "any"` (one short line per route) and move residency into `eligibility.note` (the guide renders "The program requires at least one of these"):
     - "Income tax documents: your family's combined net income (line 23600) is less than the maximum for your family size in the table, and the City's other income-line limits are met"
     - "Client of the Ministry of Social Development"
     - "Disability Tax Credit: your family's combined net income, after subtracting the Disability Tax Credit amounts the City's page lists, is less than the maximum for your family size"
     - "Senior receiving the Guaranteed Income Supplement"
     - "Child or youth aged 0-18 in the legal care of the Ministry of Children and Family Development, Métis Family Services or Vancouver Aboriginal Child and Family Services Society, or a young adult aged 19-25 supported by the Ministry's SAJE program (enrolment covers the child or youth and one legal guardian)"
     - "Refugee, with a referral application completed through an approved settlement services agency"
   - `eligibility.note`: "You must be a Surrey resident. The City says you may qualify if one of these situations applies."
   - `requiresNote`: "You may qualify if you are a Surrey resident and one of the City's routes applies: income tax documents, Ministry of Social Development client, Disability Tax Credit, Guaranteed Income Supplement for seniors, a child or young adult in Ministry of Children and Family Development legal care, or a refugee referred by an approved agency."
   - Test: `test/requires-note-rendered.test.js` requires every `eligibility.items` entry, the `eligibility.note` and the `requiresNote` to appear in the regenerated guide. Run `npm run gen:guides` first.

11. **surrey-leisure-access, gate `lowIncome`: FIX (new record-specific gate; do not touch `lowIncome`).**
   - Evidence: the foster-care route is not income-tested on the page (referral letter, ID, application only); the refugee, MSD and GIS routes are documented by status, not by the household-income answer. `REQS.lowIncome` ("This is for lower-income households.", `met: answers.income === "low"`, `fixed: true`) is SHARED with about 29 benefits and must not change. With `fixed: true` it also marks a higher-income refugee or foster family as a clean "no".
   - Replace `"lowIncome"` in Surrey's `requires` with a new gate `surreyLeisureRoute`:
     - `short`: "Check which Surrey Leisure Access route applies"
     - `who: ["you"]`, `fixed: false`
     - `met: () => answers.bcAssistance === "pwd"` (the "PWD designation or disability assistance" answer clearly establishes the Ministry of Social Development client route). Nothing else in the wizard clearly establishes a route: the "Lower income (under ~$35,000)" answer does not establish that net family income is under the table maximum (for example $26,355 for one person), and there is no GIS, MCFD, refugee or DTC-with-income answer. So `income: "low"` alone no longer makes Surrey "ready".
     - `unmet`: "Surrey's Leisure Access Program has several routes: income tax documents against the family size and income table, Ministry of Social Development client, Disability Tax Credit with a lower net income, Guaranteed Income Supplement for seniors, a child or young adult in Ministry of Children and Family Development legal care, or a refugee referred by an approved agency. Check which one applies."
   - Tests and oracle:
     - `e2e/oracle/oracle-spec.js`: add a gate entry (the coverage test fails without it): `surreyLeisureRoute: { evidence: "answers", satisfy: { set: { bcAssistance: "pwd" } }, violations: [{ name: "no PWD or disability assistance status", fragment: { set: { bcAssistance: "none" } }, expect: "almost" }] }` (mirrors `bcPwdStatus`, line ~487). The `lowIncome` entry (line ~332) stays. Bump `SPEC_VERSION` (1.20.0 to 1.21.0) because Surrey's requirements change.
     - The expected status table entry `"surrey-leisure-access": "ready"` (line ~796) stays valid only because the best-case persona sets `bcAssistance: "pwd"`. Verify by running the oracle spec.
     - `e2e/matcher-safety.spec.js` "shared predicates are unchanged for other programs" (~line 888) needs at least 6 other consumers of `lowIncome`; there are many. No change expected.
   - Related, not one of the 41: vancouver-leisure-access has the same shared-gate problem (see item 25). It deserves its own gate, but the gate text is for the owner to decide.

12-19. **surrey-leisure-access, `note` family-size maxima: FIX (all eight numbers confirmed against `--1`).**
   - Page table ("Family net income maximum for LAP"): 1 $26,355; 2 $32,075; 3 $39,940; 4 $49,829; 5 $56,742; 6 $62,928; 7 $69,112; "8 and more $6,186 for each additional person". The record's $25,588 / $31,140 / $38,777 / $48,377 / $55,089 / $61,095 / $67,099 / $6,006 are an older table and all differ (items 12 to 19). The page states no year for this table.
   - Items 12 to 18 are one-for-one number replacements; item 19 is the increment ($6,186). The page's row says "8 and more" and does not say the increment is added to the 7-person figure, so keep the page's wording rather than computing an 8-person maximum.
   - Readability: move all eight figures out of the `note` into `amountTiers` (supports one table; Kelowna's record is the model):
     - `caption`: "Family net income maximum for the Leisure Access Program — only for patrons applying with income tax documents"
     - `headers`: ["Family size", "Family net income"]
     - `rows`: ["1","$26,355"], ["2","$32,075"], ["3","$39,940"], ["4","$49,829"], ["5","$56,742"], ["6","$62,928"], ["7","$69,112"], ["8 and more","$6,186 for each additional person"]
   - New `note`: "Enrolment is valid for one year. If you apply with income tax documents, your family's combined net income (line 23600 of your Notice of Assessment or Proof of Income Statement) must be less than the maximum for your family size in the table. A family is one or two married or common-law adults and their legal dependents aged 18 and under."
   - Tests: no test asserts Surrey's numbers. Recommended new unit test mirroring `test/factual-batch.test.js` Kelowna test ("LICO table equals the City's page"): assert the rows above and `headers[1] === "Family net income"`.
   - `research/197-info-density/DENSE-SURFACES-REPORT.md` quotes the old note; it is a generated report, so regenerate rather than hand-edit.

20. **surrey-leisure-access, `detail.documents[2]`: FIX.**
   - Evidence: required documents for the income-tax route: "1. Proof of Income Statement for each adult in the family." and "2. Canada Child Benefit Notice, Goods and Services Tax Credit Notice or Canada Groceries and Essentials Benefit Notice." The Notice of Assessment appears only as the source of line 23600 for the income calculation, not as a required-document substitute.
   - New `documents[2]`: "Proof of Income Statement for each adult in the family, when applying with income tax documents".
   - Add: "Canada Child Benefit Notice, Goods and Services Tax Credit Notice or Canada Groceries and Essentials Benefit Notice" (required on the income-tax and DTC routes; for MSD and GIS only if the family includes children aged 0-18 or a spouse not listed on the letter).
   - Also `tips[1]` ("currently accepted year") can say: "As of September 1, 2026 income tax documents must be for the 2025 or 2026 tax year."
   - No test references the text.

## D. vancouver-leisure-access (items 21-26)

The page gives two different income tables. The Disability Tax Credit route: "1 person $53,166 ... 7 people $123,948" (no increment stated). The self-referral route and the EI route (same figures; for EI the test is "Projected family income must be at or below"): "1 person $43,028 ... 7 people $113,810. For each additional person, add $8,450." `amountTiers` supports one table, so present both as one table with two value columns:
- `caption`: "Maximum net family income by route (EI route: projected family income)"
- `headers`: ["Family size", "Disability Tax Credit route", "Low-income self-referral and EI routes"]
- `rows`: ["1 person","$53,166","$43,028"], ["2 people","$70,972","$60,834"], ["3 people","$84,645","$74,507"], ["4 people","$96,171","$86,033"], ["5 people","$106,325","$96,187"], ["6 people","$115,506","$105,368"], ["7 people","$123,948","$113,810"], ["Each additional person","Not stated on the page","Add $8,450"]
- Recommended unit test mirroring Kelowna's: assert these rows verbatim.
- The financial exclusions apply to the DTC, self-referral and EI routes, and "Who can't apply" repeats them: "Individuals or families with a combined: Interest and other investment income (Line 12100) over $1,500; Net Rental Income (Line 12600) over $2000; Capital Gains (Line 12700) over $2,000", plus "Immigrants classified as investors or entrepreneurs" and "Non-residents of the City of Vancouver". Put them once in `eligibility.note`, not per route.

Restructure `eligibility` to `mode: "any"`, one short line per route (items 22 to 26 below give the lines), with `eligibility.note`: "You must be a resident of the City of Vancouver (UBC and the University Endowment Lands are not in the City). Leisure Access is not available to immigrants classified as investors or entrepreneurs, or to individuals or families with combined interest and other investment income (line 12100) over $1,500, net rental income (line 12600) over $2,000, or capital gains (line 12700) over $2,000." Keep the other routes (income assistance or listed subsidy; agency client referral) as they are, one line each: "Income assistance: you receive income assistance or one of the listed provincial or federal subsidies (for example MSDPR assistance, Guaranteed Income Supplement, RAP, SAFER or a valid red bus pass)", and "Agency referral: you are a client of a non-profit or government agency that can refer you". Rewrite `requiresNote` as a short sentence pointing to those routes.
Tests: `test/requires-note-rendered.test.js` (regenerated guide must contain every item, the note and `requiresNote`).

21. **vancouver-leisure-access, `amount`: FIX.**
   - Evidence: "Fitness centres 50% admission discount"; "50% discount for group skating lessons"; "50% discount for group swimming lessons"; "Aquatics Academy 100% discount on courses ... Course materials are not discounted"; outdoor pools need a reservation ("Leisure Access participants can reserve an outdoor pool session online").
   - New `amount`: "Free admission to pools and rinks, 50% off fitness centre admission and group swimming and skating lessons, and a pass now valid for 3 years".
   - `summary`: replace "most other Park Board recreation is half price" with "fitness centre admission, group swimming and skating lessons and other listed programs are half price". Outdoor pools: "free admission with an online reservation".
   - BENEFIT_VALUES note ("free pool/rink admission + 50% off fitness") is accurate. No test references the text.

22. **vancouver-leisure-access, route Child Disability Benefit: FIX.**
   - Evidence: "You are a family with a child up to 17 years old who qualifies for the Child Disability Benefit." then "To qualify a family must: Receive the Child Disability Benefit in their Canada Child Benefit notice ... Confirmation of eligibility is noted on page 2 of the Canada Child Benefit under 'Explanation'; Reside in the City of Vancouver; Complete the application form". The page adds: "Disability status does not determine eligibility ... eligibility is based on economic need, and receiving the Child Disability Benefit verifies that need."
   - Item: "Child Disability Benefit: a family with a child up to 17 that receives the Child Disability Benefit, shown on its Canada Child Benefit notice".
   - Add to `documents`: "2025 Canada Child Benefit notice (Child Disability Benefit route)".

23. **vancouver-leisure-access, route Disability Tax Credit: FIX.**
   - Evidence: heading "You, your spouse/partner, or dependent, age 18 and older, qualify for the Disability Tax Credit"; "You and your family are eligible if your family's combined net income is less than or equal to the following amount based on family size and receipt of the Disability Tax Credit"; documents "A copy of your 2025 Proof of Income Statement (not Notice of Assessment) verifying receipt of the Disability Tax Credit".
   - Item: "Disability Tax Credit: you, your spouse or partner, or a dependent aged 18 or older qualifies for the Disability Tax Credit, and your family's combined net income is at or below the table maximum".
   - Table: the two-column table above. Exclusions: in `eligibility.note`.
   - `documents`: "Proof of Income Statement verifying receipt of the Disability Tax Credit (the page says not a Notice of Assessment)".

24. **vancouver-leisure-access, route asylum seeker / temporary foreign worker: FIX.**
   - Evidence: "Ask the non-profit or government agency to refer you to the Park Board Leisure Access program"; "The agency will use a Third Party Referral form"; "Take the original Third Party Referral form completed by the referring agency within 90 days to a Park Board community centre. It must be signed and dated by you."
   - Item: "Asylum seeker or temporary foreign worker: the non-profit or government agency you are a client of refers you (Third Party Referral form)".
   - Add to `documents`: "Original Third Party Referral form completed by the referring agency within 90 days, signed and dated by you (agency referral routes)".

25. **vancouver-leisure-access, route low-income self-referral: FIX.**
   - Evidence: heading "You are a resident with low-income and do not receive income assistance and cannot be referred"; "eligible if your net family income is less than or equal to the following amount based on your family size. (Source: Statistics Canada)"; "For each additional person, add $8,450."
   - Item: "Low income without income assistance, and you cannot be referred: your net family income is at or below the table maximum".
   - Table: third column above.
   - Page contradiction to keep hedged: this route lists "2025 Proof of Income Statement (not Notice of Assessment) is required to complete application", while the verification note says "a Proof of Income Statement is not required when submitting a declaration" and a random monthly sample must provide it within 30 days "or Leisure Access will be deleted". Keep the `documents` wording "or current Proof of Income Statement, depending on route" and the tip that a Notice of Assessment is not the same; do not state an absolute requirement beyond the page.
   - Gate: Vancouver requires `lowIncome` (shared, `fixed: true`). The same concern as item 11 applies (income-assistance, agency, asylum and CDB routes are not household-income-answer routes; the DTC table reaches $53,166 for one person against the wizard's "under ~$35,000"). Not one of the 41 items. Recommend a parallel `vancouverLeisureRoute` gate (`met` true when `answers.bcAssistance` is "pwd" or "other"; `fixed: false`) with its own oracle entry, but the owner should decide.

26. **vancouver-leisure-access, route Employment Insurance: FIX.**
   - Evidence: "You are receiving Employment Insurance (EI) benefits in 2026/2027 ... Projected family income must be at or below the low-income threshold below. (Source: Statistics Canada)". Documents: "Family members' 2025 tax year Proof of Income Statement" and a "Service Canada letter outlining Employment Insurance benefits information (start and finish date, benefit rate)".
   - Item: "Employment Insurance: you are receiving EI benefits in 2026/2027, and your projected family income is at or below the table maximum".
   - Add to `documents`: "Service Canada letter showing your Employment Insurance start and finish date and benefit rate (EI route)".

## E. adap (items 27-28)

27. **adap, `REQS.adult` (age): FIX with a new ADAP-only gate; do NOT change `adult`.**
   - Evidence (`adap--1`): "You are at least 18 years old and not eligible to receive an Old Age Security pension." The record's "This is for people aged 18–64." replaces the OAS test with a fixed ceiling, so a person aged 65 or older who is not eligible for OAS is turned away.
   - `REQS.adult` is `met: isAdultAge` (18 to 64), `fixed: true`, text "This is for people aged 18–64." It is SHARED with toronto-fair-pass, aish, adap, adult-health-benefit and ab-capcc (and the same function backs `workingAge`). Do not loosen it.
   - In ADAP's `requires`, replace `"adult"` with new `adapAge`:
     - `short`: "Check your age and Old Age Security eligibility"; `who: ["you"]`
     - `met: () => isAdultAge()`
     - `fixed: () => !ageIn("65plus")` (under 18 stays a clean "no"; 65 or older becomes "almost")
     - `unmet`: "ADAP is for adults aged 18 and older who are not eligible to receive an Old Age Security pension. If you are 65 or older, check whether you are eligible to receive an Old Age Security pension."
   - Tests and oracle:
     - `e2e/matcher-safety.spec.js` test "jurisdiction, age and status produce a clean no-match" (~lines 878-879): `adultProgramIds` includes "adap" and expects "no" for `ageBand: "65plus"`. Remove "adap" from that loop and add `expect(senior.adap.status).toBe("almost")`.
     - `e2e/oracle/oracle-spec.js`: add `adapAge: { evidence: "answers", satisfy: { set: { ageBand: "19to59" } }, violations: [{ name: "under 18", fragment: { set: { ageBand: "under6" } }, expect: "no" }, { name: "65 or older: OAS eligibility not asked", fragment: { set: { ageBand: "65plus" } }, expect: "almost" }] }`. Bump `SPEC_VERSION`. The adap expected status ("almost", line ~687) is unchanged.
     - The "needs" length assertions for adap (`toHaveLength(2)` at ~824, ~1128, ~1397) are unaffected for a 19-59 profile because `adapAge` is met.
     - `e2e/matcher-safety.spec.js:135` (pdd, "18–64" text) is about the shared `adult` text and is unaffected.

28. **adap, `summary`, `detail.about` and `REQS.adapMedical.unmet`: FIX.**
   - Evidence (`adap--1`): "You must have a severe disability that significantly impedes employment continuously or episodically." and "To be medically eligible for ADAP, the severe disability must be determined to significantly restrict but not prevent a person from being employed." Also "In general, an individual with a severe disability who is assessed as able to work will qualify for ADAP", and a severe disability that makes a person "permanently unable to work" qualifies for AISH.
   - `summary`: "Alberta disability income assistance when a severe disability significantly impedes employment, continuously or episodically, but does not prevent it." (The current "including episodically" drops "continuously".)
   - `about` (first sentence): "ADAP is Alberta disability income assistance for adults whose severe disability significantly impedes employment continuously or episodically. To be medically eligible, the severe disability must be determined to significantly restrict but not prevent a person from being employed."
   - Gate `adapMedical` is used only by adap, so edit in place; keep `met: false`, `fixed: false`. New `unmet`: "Alberta decides whether your severe disability significantly impedes employment, continuously or episodically. For ADAP it must be determined to significantly restrict but not prevent you from being employed. One application assesses both AISH and ADAP."
   - Tests: `e2e/matcher-safety.spec.js:814` asserts `/significantly impedes/` on the needs text; the new text keeps "significantly impedes". `adap.needs` length stays 2. The oracle treats `adapMedical` as external; no change.

## F. bc-access-grant-students-disabilities (item 29)

29. **bc-access-grant-students-disabilities, `note`, `eligibility.items[0]`, `requiresNote`, `detail.about`, `detail.steps[2]`: FIX.**
   - Evidence: "only available to students attending B.C. public post-secondary schools. Note: Students enrolled at schools other than a B.C. public school during the 2025/26 program year who received BCAG-D funding for the same program at the same school, may request to continue to receive these grants until their program is complete, or until July 31, 2029, whichever occurs first." Eligibility line: "enrolled in a full-time program at a designated public post-secondary school". The page says "You may be eligible if you".
   - `note` (first sentence): "Only available to students attending B.C. public post-secondary schools. Students enrolled at another school in 2025/26 who received this grant for the same program at the same school may request to continue until their program is complete or until July 31, 2029, whichever occurs first."
   - `eligibility.items[0]`: "You are enrolled in a full-time program at a designated public post-secondary school in B.C." Add `eligibility.note`: "Students who received this grant at another school in 2025/26, for the same program at the same school, may request to continue until their program is complete or July 31, 2029, whichever is first."
   - `requiresNote`: start with "You may be eligible if you are enrolled in a full-time program at a designated public post-secondary school, you qualify for federal and provincial student financial aid, and you have a permanent disability, or a persistent or prolonged disability as defined by the Canada Student Financial Assistance Program."
   - `about`: "...for eligible full-time students with a disability at B.C. public post-secondary schools (a limited exception applies to students already receiving it at another school), reducing the amount they borrow."
   - `steps[2]`: "Confirm that your school is a B.C. public post-secondary institution, or ask about continuing if you received this grant there in 2025/26".
   - Gates `student` and `disabilityDoc` are shared and need no change; the school exception is not representable as an answer. Tests: `test/requires-note-rendered.test.js` (regenerated guide). The `bc-live` / student e2e specs do not assert this text.

## G. bc-at-home-saet (items 30-31)

30. **bc-at-home-saet, `summary`: FIX.**
   - Evidence (`--2`): "Occupational therapy, physiotherapy and speech language therapy services may be available to assist families with the cost of purchasing out-of-school direct (one-to-one) therapy services". "private" is not on the page.
   - New `summary`: "May help families with the cost of out-of-school occupational therapy, physiotherapy and speech-language pathology for school-aged children enrolled in the At Home Program."
   - The `amount` ("Up to $5,760/year ...") comes from the PDF guide, which is unreadable in the snapshot; leave it for a PDF re-extraction. BENEFIT_VALUES note "OT/PT/speech therapy (<=$5,760/yr each)" stays. No test references the text.

31. **bc-at-home-saet, `detail.about` / `detail.aboutList.lead` ("delivered one-to-one or in groups"): OPEN.**
   - The only readable source (`--2`) says "out-of-school direct (one-to-one) therapy services". The record's source is the PDF guide (`--1`), which is a binary stream and cannot confirm or refute group delivery. Neither supports "in groups".
   - Interim conservative wording: remove "or in groups" and say "delivered one-to-one (direct, out-of-school services)". Restore it only if the PDF text (extracted properly, e.g. with a PDF text tool) states groups. Resolving it needs the At Home Program guide text.

## H. bc-autism-funding-6-18 (items 32-36)

32. **bc-autism-funding-6-18, `detail.coversList.items[3]` and `detail.steps[2]`: FIX.**
   - Evidence: "Behaviour interventionists (BI) (should be supervised by a professional listed above)".
   - `coversList.items[3]`: "behaviour interventionists (should be supervised by one of the professionals listed above)".
   - `steps[2]`: "Sign the funding agreement and hire providers for the eligible services (behaviour interventionists should be supervised by a listed professional)".

33. **bc-autism-funding-6-18, `detail.about` (accountant): FIX.**
   - Evidence: "up to $50 monthly to pay a bookkeeper or $600 per funding period for direct payment accountant fees".
   - New wording: "Administrative costs are limited to $50/month for a bookkeeper, or $600 per funding period for direct payment accountant fees." Keep "normally" only if the owner has another source for it; the page does not use it.

34. **bc-autism-funding-6-18, `detail.about` / `detail.tips[1]` (training, travel and equipment): FIX.**
   - Evidence (`--1`, "Use funding for other types of support"): "Requests must not exceed 50% of a child/youth's annual funding amount (for families with benefit plans that are 12 months or less), or 50% on the adjusted portion (for families with benefit plans that are 13 months or longer, with the first 12 months being available at 20%). Purchase equipment or supplies; Sign-up for training; Travel to access support services or take training. For families with youth aging out (turning 19) prior to March 31, 2027, requests must not exceed 20%."
   - The page never says "normal limit is 20%", "increased" or "final aligned funding period". Those framings are not on the snapshot; the snapshot is the only truth, so replace them with the page's rule.
   - New `about` sentence: "Requests for equipment or supplies, training and travel must not exceed 50% of the annual funding amount if your plan is 12 months or less. For plans of 13 months or longer, it is 50% on the adjusted portion, and the first 12 months are available at 20%. For youth turning 19 before March 31, 2027, requests must not exceed 20%."
   - New `tips[1]`: "Equipment, training and travel requests are capped at 50% of the annual amount for plans of 12 months or less; for plans of 13 months or longer the first 12 months are available at 20%, and youth turning 19 before March 31, 2027 are capped at 20%."
   - Test to rewrite: `e2e/data-integrity.spec.js` "both Autism Funding records preserve the normal limit and the final-period exception" (~lines 49-64). It asserts `/normal.*20%/`, `/50%.*final aligned funding period/` and, on the guide, `/increased the allowable TTE portion to 50%|raised it to 50%/`. Replace those with assertions on the page's rule (50% of annual funding for plans of 12 months or less; 50% on the adjusted portion with the first 12 months at 20% for plans of 13 months or longer; 20% for youth turning 19 before March 31, 2027 for 6-18 only). Keep the March 31, May 31 and September 30, 2027 assertions.
   - This reverses an earlier owner-verified framing. The `time` field and `tips[2]` use "final aligned funding period" too; that term is also absent from the snapshots, so flag it for the owner. I have not changed it (outside the 41 items).

35. **bc-autism-funding-6-18, `note`: FIX.**
   - Evidence (`--2`): "The current Autism Funding system is in effect until March of 2027, and we will continue to receive applications and onboard eligible families until then. We will contact all recipients about their eligibility to transfer to the new BC Children and Youth Disability Benefit ahead of the transition."
   - Replace "Current families transition to the BC Children and Youth Disability Benefit in phases; the ministry will contact them." with: "The ministry says it will contact all recipients about their eligibility to transfer to the BC Children and Youth Disability Benefit ahead of the transition."
   - "In phases" is not on the page; drop it. Leave the rest of the note as is (the exact "ends March 31, 2027" and "prorated" claims are reported NOT ON PAGE, an evidence gap for the owner, not part of this item).
   - `tips[3]` ("Ask your CYSN office about the transition schedule if you have not been contacted by fall 2026") also assumes a schedule; not on the page. Flag only.

36. **bc-autism-funding-6-18, `detail.documents[0]`: FIX.**
   - Evidence (`--2`, "Gather required documents"):
     - BCAAN assessment: "Proof of age and residency (example: birth certificate, BC Services Card)"; "Copy of the BCAAN Clinical Outcome (PANTER) Form"; "Optional: Copy of BCAAN assessment report(s)".
     - Non-BCAAN (private) assessment, ages 6-18: proof of age and residency; "Copy of the Non-BCAAN (Private) Diagnosis of Autism Spectrum Disorder Form (CF0904)"; a diagnostic report from the qualified professional with "Evidence that the ADOS-2 and ADI-R assessment tools were used" and the assessor's signature.
     - Out of province or country (ages 0-18): proof of age and residency; "Confirmation of Previous Diagnosis of Autism Spectrum Disorder Form (CF0905)"; "Copy of the original Diagnostic Report and/or any assessment information that supports the diagnosis". "A new assessment may be required if the BC specialist cannot confirm that the previous diagnosis meets the DSM-5 criteria."
   - Replace `documents[0]` with route lines:
     - "Proof of age and residency (for example a birth certificate or BC Services Card)"
     - "BCAAN assessment: the BCAAN Clinical Outcome (PANTER) Form (BCAAN assessment reports are optional)"
     - "Private (non-BCAAN) assessment: form CF0904 and a diagnostic report showing the ADOS-2 and ADI-R were used, signed by the assessor"
     - "Assessment outside B.C.: form CF0905 and a copy of the original diagnostic report or assessment information"
   - `documents[1]` "Child's Personal Health Number" is not on either page (report: NOT ON PAGE). Keep only if the application form (not snapshotted) is cited. `documents[2]` (Basic BCeID) applies "to apply online".
   - `BENEFIT_META.effort` "Application + qualifying diagnostic report" has the same flaw; change to "Application + diagnosis form for your assessment route".
   - Tests: none reference these strings.

## I. bc-autism-funding-under-6 (items 37-41)

37. **bc-autism-funding-under-6, `detail.coversList.items[2]`: FIX.**
   - Evidence: "Family counselling/therapy providers do not need to be listed on the Registry of Autism Service Providers (RASP). The following professionals may be eligible to provide family counselling/therapy services: Canadian Certified Counsellors (CCC); Registered Clinical Counsellors (RCC); Registered Marriage and Family Therapists (RMFT); Registered Psychiatrists; Registered Psychologists; Registered Social Workers (RSW)/Registered Clinical Social Workers (RCSW)".
   - `items[2]`: "family counselling or therapy (providers do not need to be on RASP)".
   - Add a tip: "These professionals may be eligible to provide family counselling or therapy: Canadian Certified Counsellors, Registered Clinical Counsellors, Registered Marriage and Family Therapists, Registered Psychiatrists, Registered Psychologists, and Registered Social Workers or Registered Clinical Social Workers. Contact Autism Funding or Autism Information Services BC for more information."

38. **bc-autism-funding-under-6, `detail.tips[0]` and `detail.steps[3]`: FIX.**
   - Evidence: "Up to $22,000 per year ... may only be used for: Professionals listed on the Registry of Autism Service Providers (RASP); Behaviour interventionists (BI) who are supervised by a RASP professional; administrative costs ...; costs related to employing a service provider; Family counselling/therapy". Family counselling providers "do not need to be listed".
   - `tips[0]`: "Intervention services must come from providers on the RASP registry, or from behaviour interventionists supervised by a RASP professional. Family counselling or therapy providers do not need to be on RASP."
   - `steps[3]`: "Sign the funding agreement, then choose providers (RASP-listed professionals, supervised behaviour interventionists, or family counselling providers) and submit invoices or reimbursement claims".

39. **bc-autism-funding-under-6, `detail.about` / `detail.tips[1]`: FIX.**
   - Evidence: same paragraph as item 34. The aging-out sentence (turning 19) does not apply to an under-six child.
   - `about` sentence: "Requests for equipment or supplies, training and travel must not exceed 50% of the annual funding amount if your plan is 12 months or less. For plans of 13 months or longer, it is 50% on the adjusted portion, and the first 12 months are available at 20%."
   - `tips[1]`: "Equipment, training and travel requests are capped at 50% of the annual amount for plans of 12 months or less; for plans of 13 months or longer the first 12 months are available at 20%."
   - Remove "Normally, up to 20% ..." and "BC increased ... final aligned funding period" (not on the page).
   - Same test rewrite as item 34 (`e2e/data-integrity.spec.js`, both ids in one loop; the loop must not require the aging-out assertion for the under-6 record).

40. **bc-autism-funding-under-6, `note`: FIX.**
   - Same evidence and wording as item 35. Replace the "in phases" sentence with: "The ministry says it will contact all recipients about their eligibility to transfer to the BC Children and Youth Disability Benefit ahead of the transition."
   - `tips[3]` ("From July 2026 the ministry contacts Autism Funding families ... you keep current funding until your transition date") contains claims not on the snapshots; flag only.

41. **bc-autism-funding-under-6, `detail.documents[0]` and `BENEFIT_META.effort`: FIX.**
   - Evidence (`--2`): under age six with BCAAN: "Proof of age and residency"; "Copy of the BCAAN Clinical Outcome (PANTER) Form"; "Optional: Copy of BCAAN assessment report(s)". Under six with private assessment: proof of age and residency; form CF0904; a diagnostic report with ADOS-2 and ADI-R evidence, assessor signature, and a multidisciplinary assessment with "findings of speech-language and psychological evaluations incorporated (and/or provided as an attachment)". Out of province or country (ages 0-18): CF0905 and the original diagnostic report or assessment information.
   - Replace `documents[0]` and the CF0905 line with route lines:
     - "Proof of age and residency (for example a birth certificate or BC Services Card)"
     - "BCAAN assessment: the BCAAN Clinical Outcome (PANTER) Form (BCAAN assessment reports are optional)"
     - "Private (non-BCAAN) assessment: form CF0904 and a diagnostic report showing the ADOS-2 and ADI-R were used, signed by the assessor, with the speech-language and psychological evaluation findings"
     - "Assessment outside B.C.: form CF0905 and a copy of the original diagnostic report or assessment information"
   - Replace "Child's Personal Health Number and proof of BC residency": the page asks for "proof of age and residency". The Personal Health Number is not on the page.
   - `BENEFIT_META.effort`: "Application + diagnosis form for your assessment route".
   - Tests: none reference these strings.

## Outside the 41 items (flagged, not counted)

- handycard-translink `detail.tips[0]` says applicants "must be at least 12"; the snapshot has no HandyCard minimum age (12 appears only for free HandyDART fares).
- bc-autism-funding-6-18 and -under-6 `time`, `tips[2]` and the phrase "final aligned funding period" are absent from the snapshots; see item 34.
- vancouver-leisure-access and surrey-leisure-access both show "ready" in the oracle with only a lower-income answer; items 11 and 25 explain why that is generous.

Count (original decisions): 40 FIX / 0 KEEP / 1 OPEN

## Fixes applied

Follow-up wording fixes (asset version remains 176):
1. Surrey day-camp note specifies children (0 to 12) and youth (13 to 18), 75% off and no discount limits.
2. Surrey about replaces RRSP-deduction wording with the source's line 12100, 12600, 20800 and 25400 limits on the City's page.
3. Surrey eligibility items 2 and 4 now have short first sentences; all DTC income and legal-care/SAJE age, agency and guardian qualifiers are retained in eligibility.note.
4. Autism funding ages 6–18 about says "up to $50 a month" for a bookkeeper.
5. Local supports first tip specifies "weekdays, excluding holidays".

Implementation in progress. Claude's overrides leave items 31, 34 and 39 OPEN; no changes to their assertions or `e2e/data-integrity.spec.js`. Numbered scope is 38 FIX items, not 39 (41 minus three OPEN).

- Surrey route gate: PWD designation alone does not establish Ministry client status. No existing wizard answer clearly establishes a listed route, so `surreyLeisureRoute.met` is always false; `fixed: false`. Best-case Surrey status changes ready → almost. Low income alone and PWD alone both require confirmation.
- ADAP age gate correction: `fixed: () => isUnder18()` is true only when the age answer establishes under eighteen. Under-eighteen profiles stay a hard `no`, matching the shared adult gate; sixty-five-plus profiles remain `almost` because OAS eligibility is not asked. Kept met/unmet/short/who and asset version 176 unchanged. Updated the oracle underage expectation to `no` and matcher-safety coverage for all four under-eighteen age bands; senior expectation remains `almost`. Shared adult and lowIncome gates remain unchanged. This correction supersedes the fixed:false override described in the original implementation notes below.
- No whole-record verification dates will be bumped: unresolved evidence gaps remain.

### Per-item ledger

| Item | Result and changed assertions |
|---|---|
| 1 | FIX: FSCD medical documents now include awaiting diagnosis. |
| 2 | FIX: HandyCard requiresNote distinguishes the shared form from possible eligibility; retains HandyDART's own test. |
| 3 | FIX: HandyCard metadata wait and detail.time both say allow four to six weeks. |
| 4 | FIX: local supports about and first tip retain most-of-Canada hours and BC weekday/holiday limits. |
| 5 | FIX: St. Albert summary, amount, values note, about and aboutList distinguish eligible local transit riders from AISH/ADAP recreation recipients. |
| 6 | FIX: St. Albert about/list retain monthly adult commuter fares and both cities; tip no longer says commuter pass. |
| 7 | FIX: St. Albert note and step remove automatic/income-waiver claims and preserve the unresolved income-rule scope. |
| 8 | FIX: Strathcona documents and step retain the current NOA year, changed-finances supplement and first-year refugee/PR exception. |
| 9 | FIX: Surrey amount and values retain most courses; note retains age-specific course caps, Semiahmoo caps, uncapped applicable camps and specialty exclusions. |
| 10 | FIX: Surrey eligibility is any-route, with residency/may qualifier in its note. DTC retains income and other line limits; legal-care/SAJE and refugee routes retain their conditions. RequiresNote points to the full route list rather than dropping qualifiers. |
| 11 | FIX: Surrey alone replaces lowIncome with surreyLeisureRoute; met false and fixed false under the PWD/receipt override. |
| 12 | FIX: Surrey one-person maximum is $26,355 in amountTiers. |
| 13 | FIX: Surrey two-person maximum is $32,075 in amountTiers. |
| 14 | FIX: Surrey three-person maximum is $39,940 in amountTiers. |
| 15 | FIX: Surrey four-person maximum is $49,829 in amountTiers. |
| 16 | FIX: Surrey five-person maximum is $56,742 in amountTiers. |
| 17 | FIX: Surrey six-person maximum is $62,928 in amountTiers. |
| 18 | FIX: Surrey seven-person maximum is $69,112 in amountTiers. |
| 19 | FIX: Surrey eight-and-more row is $6,186 for each additional person; no computed maximum or invented year. Family definition and strict less-than rule remain in note. |
| 20 | FIX: Surrey income-route document is Proof of Income Statement, not NOA; added benefit notice with route-specific conditions and accepted tax-year tip. |
| 21 | FIX: Vancouver amount and summary specify fitness admission, group lessons, listed programs and outdoor reservation. |
| 22 | FIX: Vancouver CDB route requires receipt on CCB notice; added the source's 2025 CCB document. |
| 23 | FIX: Vancouver DTC route retains adult-dependent age and income maximum; added 2025 Proof of Income Statement, not NOA. |
| 24 | FIX: Vancouver asylum/temporary-worker route retains agency referral and original signed/dated form within ninety days. |
| 25 | FIX: Vancouver self-referral route retains no assistance, cannot be referred and income maximum. Generic document wording/tip retained for the declaration contradiction. Shared lowIncome gate untouched; proposed Vancouver gate not authorized. |
| 26 | FIX: Vancouver EI route retains 2026/2027 and projected income; added family 2025 income statements and Service Canada benefit letter. Items 23/25/26 use one three-column table; DTC extra-person increment is Not stated on the page. Financial exclusions retained once in eligibility.note. |
| 27 | FIX with explicit request override: ADAP alone replaces adult with adapAge; adult-age answers meet it, older answers remain almost and underage answers are no under `fixed: () => isUnder18()`. No digits in gate prose. |
| 28 | FIX: ADAP summary/about and in-place adapMedical retain severe disability, continuously or episodically, and significantly restrict but not prevent employment. Medical gate remains external/non-fixed. |
| 29 | FIX: B.C. access grant note, eligibility item/note, requiresNote, about and step retain the same-school/same-program continuing exception, may request, and earlier completion/July 2029 cutoff. |
| 30 | FIX: SAET summary says may help, out-of-school therapies; no private claim. Amount and values unchanged. |
| 31 | OPEN: SAET group-delivery assertion untouched. |
| 32 | FIX: older autism covers item and step retain should be supervised (not must). |
| 33 | FIX: older autism administrative sentence distinguishes bookkeeper monthly cap from direct-payment accountant funding-period cap; no normally hedge. TTE assertions retained. |
| 34 | OPEN: older autism TTE rule and tip untouched; integrity test untouched. |
| 35 | FIX: older autism note says ministry will contact recipients about eligibility to transfer, not guaranteed phased transition. Other unresolved transition assertions untouched. |
| 36 | FIX: older autism documents split by BCAAN/private/outside-BC routes; optional BCAAN reports, signed assessment tools and possible reassessment retained. Removed unsupported PHN document; online BCeID retained. Metadata effort now route-specific. |
| 37 | FIX: younger autism covers item exempts counselling from RASP; new tip retains may-be-eligible professional list. |
| 38 | FIX: younger autism first tip and provider step retain supervised BI and counselling alternatives. |
| 39 | OPEN: younger autism TTE about and tip untouched; integrity test untouched. |
| 40 | FIX: younger autism note uses eligibility-to-transfer wording; other flagged transition claims untouched. |
| 41 | FIX: younger autism route documents and metadata effort retain optional BCAAN reports, private multidisciplinary findings and outside-BC form/report; proof of age/residency replaces unsupported PHN. |

### Interim verification

- Generated context and guides successfully. Added four unit regressions for tables, route/document qualifiers and medical/provider wording, plus a Surrey matcher regression.
- Initial unit run: 166 tests, 160 passed, six failed. Five failures are density ratchet counts from restored source qualifiers; one is the reviewed short-cue inventory missing the two new gates. Inventory now includes both gates.
- Source-wording baseline increases allowed by this request: gate.unmet 95→97 (new record-specific full checks), eligibility.note 37→40 (Surrey may/residency, Vancouver exclusions, grant exception), detail.about 92→93 (B.C. access grant continuing-school exception; ADAP's expanded restriction was already above the threshold), aboutList.items 146→149 (St. Albert approved local Handibus, adult commuter and recreation scope), note 59→61 (St. Albert uncertainty and student continuing exception). Summary stays 25; maximum character counts and the one gate without a short cue do not rise. These preserve source qualifiers rather than adding unsupported facts.
- Oracle version 1.20.0→1.21.0. Surrey best-case ready→almost because designation alone is not receipt; Surrey gate is external since no answer establishes a route. ADAP best-case stays almost; senior no→almost because OAS eligibility is unasked; underage no→almost solely due to the explicit fixed:false override. Shared adult/lowIncome entries unchanged. Named safety test still checks ADAP non-citizen no separately.

### Browser verification, first whole-project run

- `npx playwright test --project=app-chromium --workers=1`: 233 executed/listed, 232 passed, one failed; no skipped tests. Failure: `persistence-chaos.spec.js` / localStorage.getItem throws SecurityError, timed out at the existing forty-five-second app-ready wait. No timeout or test weakening applied. This is an observed failure, not assumed to be a flake.
- Final audit caught and restored the local-supports dynamic applyUrl/source functions before regenerating. Added a regression assertion for them. The unrelated source-link dynamic-count change is thereby removed on regeneration.
- All twelve changed records identified by VM comparison; all original dynamic fields retained. BENEFIT_VERIFIED is unchanged. Both TTE tips/time fields, younger autism about and SAET about/aboutList are unchanged; older autism TTE assertions remain while its accountant sentence is corrected.

### Final verification

| Command | Final result | Evidence |
|---|---|---|
| `npm run gen:context` | PASS; 134 records, 218 checkable links and five dynamic URLs retained | `outputs/batch4-context.log` |
| `npm run gen:guides` | PASS; 133 benefit pages plus guide index; local-supports retains its dynamic URL and has no static guide | `outputs/batch4-guides.log` |
| `npm test` | PASS: 166 tests, 166 passed, zero failed/skipped/cancelled | `outputs/batch4-unit.log` |
| `npm run check:surfaces` | PASS; qualifier-preserving baseline changes documented above | `outputs/batch4-surfaces.log` |
| `npx playwright test --project=app-chromium --workers=1` | PASS: 233 passed, zero failed/skipped, 3.8 minutes; whole project, not a filtered suite | `outputs/batch4-playwright-final.log` |
| Same project `--list` | 233 listed tests in 22 files; matches 233 final passes | `outputs/batch4-playwright-listed.log` |
| Batch-only `git diff --check` | PASS excluding the pre-existing QUEUE.md change | Final command audit |

The initial whole-project failure remains recorded above. The final whole-project rerun passed without changing the persistence-chaos test, its timeout, retries or runner configuration. The oracle suite reports spec 1.21.0, 134 programs, 196 used gates (93 external), nineteen persona dimensions and 476 asserted outcomes. The unchanged autism integrity test passed in both whole-project runs.

### Gate and scope audit

- Grep and declaration comparison confirm shared `adult`, `workingAge`, `lowIncome`, `transitBarrier` and `municipalProgramEligibility` remain byte-for-byte unchanged. Consumer comparison: lowIncome twenty-nine→twenty-eight, removing only Surrey; adult five→four, removing only ADAP; transitBarrier six→six and municipalProgramEligibility two→two. All other consumers retain the same gates. Vancouver's lowIncome and oracle entries remain unchanged.
- New gates alone have record-specific short/who cues (bounded, no digits); unmet prose spells ages out. `surreyLeisureRoute` always needs external confirmation. `adapAge` uses the existing adult-age predicate with `fixed: () => isUnder18()`. `adapMedical` was edited in place, not replaced, and stays `met: false`, `fixed: false`.
- No whole-record verified dates changed. Remaining NOT ON PAGE rows, including amounts/thresholds and autism transition claims, have not been promoted to verified facts.
- VM scope audit confirms exactly twelve changed records, with all original dynamic fields preserved. Items 31, 34 and 39 remain OPEN. No changes to `e2e/data-integrity.spec.js`, protected task/agent/digest files or `.taskview/`. No commits or pushes.
- Version pins are 176 in the entry page, font CSS and all generated guides; no old `?v=175` pin remains in public/scripts/tests. Historical changelog text is retained. `DATA_CHANGELOG` has the new batch entry.
- The source snapshots and original evidence report were read only. The pre-existing `research/reverify/QUEUE.md` modification, other pre-existing output logs and untracked node_modules were not part of this batch. The pre-existing queue's trailing whitespace is the only unfiltered diff-check warning; it was not edited.

### Every changed file

The exact, exhaustive path manifest is [outputs/batch4-changed-files.txt](../../outputs/batch4-changed-files.txt): **158 batch files** (147 implementation/generated/report files plus ten execution logs and the manifest itself). It individually lists all **134 generated guide HTML paths**, rather than hiding them behind a glob.

Non-guide implementation and report files:

- `public/data.js` — twelve benefit records and repeated values/metadata; a stale St. Albert source comment corrected too.
- `public/app.js` — Surrey route and ADAP age gates, plus in-place ADAP medical wording only.
- `public/changelog.js` — DATA_CHANGELOG entry.
- `public/index.html` — all pinned entry assets 175→176.
- `public/styles.css` — both pinned font URLs 175→176; no styling change.
- `e2e/oracle/oracle-spec.js` — spec bump, two gate entries and Surrey best-case status change.
- `e2e/matcher-safety.spec.js` — deliberate ADAP senior expectation, preserved citizenship check, and new Surrey route/PWD regression.
- `test/factual-batch.test.js` — four new regression tests covering both exact tables, route/document/medical qualifiers and dynamic local-supports URLs.
- `research/207-shorts/shorts-applied.json` — the two reviewed gate cue entries.
- `research/197-info-density/DENSE-SURFACES-REPORT.md` — regenerated density report.
- `research/197-info-density/dense-surface-baseline.json` — only the documented qualifier-preserving counts rise; no maximum or missing-cue allowance rises.
- `src/benefits-context.js` — regenerated affected record details and catalog summaries.
- `research/reverify/DECISIONS-2026-10-15-batch4.md` — this per-item, gate, oracle, test and file ledger appended; original decision entries retained as historical instructions subject to the explicit overrides.

Generated guides: the eleven affected records with static sources have their corrected content plus version 176; the other 122 benefit pages and guide index change only the stylesheet pin. `src/links.js` and `public/sitemap.xml` were regenerated but are byte-identical to HEAD and are not counted as changed files.

Execution artifacts (also individually included in the manifest):

- `outputs/batch4-context.log`
- `outputs/batch4-guides.log`
- `outputs/batch4-unit-initial.log`
- `outputs/batch4-unit.log`
- `outputs/batch4-surfaces-initial.log`
- `outputs/batch4-surfaces-baseline.log`
- `outputs/batch4-surfaces.log`
- `outputs/batch4-playwright.log`
- `outputs/batch4-playwright-final.log`
- `outputs/batch4-playwright-listed.log`
- `outputs/batch4-changed-files.txt`

### Remaining owner questions (not silently fixed)

Items 31/34/39 remain OPEN. HandyCard's unsupported minimum-age tip, SAET's unreadable PDF-dependent facts, autism transition dates/schedules and other NOT ON PAGE observations remain evidence gaps as recorded in the original report. Vancouver's broader gate proposal remains outside authorized scope. The request's fixed:false instruction for ADAP intentionally differs from the original decisions' conditional underage refusal; its changed underage outcome is explicitly covered by the oracle and documented above.
