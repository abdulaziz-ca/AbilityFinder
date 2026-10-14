# Decisions — re-verification batch 3 (2026-10-15)

Every claim below was re-checked against `research/reverify/snapshots/<record>--<n>.txt`, the record in `public/data.js` (node vm) and the `REQS` gate in `public/app.js`. All 35 DIFFERS claims were real (no false positives), and the Kelowna items were skipped as instructed. Because the guides and AI context are generated, after any `data.js` or `app.js` edit run `npm run gen:guides`, `npm run gen:context`, `npm run check:surfaces` and the unit and e2e suites.

Conventions:
- "Record" means the field in `public/data.js`.
- "Gate" means the `REQS.<key>` entry in `public/app.js`.
- "Shared gate" means other benefits use it too.
- I mention a `BENEFIT_VALUES` or `BENEFIT_META` note only where it repeats the wrong claim.

## A. Report batch3 main tables

1. **taxisaver-translink, gate `translinkHandyCard`: FIX.**
   - Evidence: the page says "HandyCards are for use on conventional transit only and cannot be used on HandyDART". TaxiSavers are "available to purchase and be used by HandyCard members", and HandyCard eligibility is applied for through the HandyDART page.
   - Instruction: change the gate `unmet` from "Register for TransLink HandyDART/HandyCard first." to "Get a TransLink HandyCard first (TaxiSavers are sold to HandyCard members)."
   - The gate is used only by taxisaver-translink, so edit it in place. Keep `met: () => false` and `fixed: false`.
   - No test references this text.
   - Optional extra, not a DIFFERS: the summary clause "for trips where a scheduled HandyDART ride does not work" is not on the page (it is a narrowing, so low risk). Drop it if you want a strict match.

2. **victoria-life, `amount` and `summary` (also `detail.about` and the BENEFIT_VALUES note): FIX.**
   - Evidence: the page says "Unlimited free drop-in sessions at Victoria Recreation Centre (opening early 2027)". Crystal Pool is closed, and the pass can be swapped for "50% off instead of unlimited access".
   - New `amount`: "Two years of unlimited free drop-ins at Victoria Recreation Centre (opening planned early 2027) and public skating at Save-On-Foods Memorial Arena, 52 free regional drop-ins a year, plus a program credit of $80 to $120 depending on age".
   - New `summary` ending: replace "covers pool, skating and regional partner facilities" with "covers drop-ins at Victoria Recreation Centre (opening planned early 2027), public skating and regional partner drop-ins".
   - In `detail.about`, change "local unlimited drop-ins" to "unlimited drop-ins at Victoria Recreation Centre (opening planned early 2027) and public skating".
   - Optionally add a tip: "Instead of unlimited access you can choose the Annual Regional Recreation Pass at 50% off."
   - The BENEFIT_VALUES note "2 yrs free drop-ins + $80-120 program credit" should name the Victoria Recreation Centre or say "(opens early 2027)".
   - The "$80 to $120" range is correct ($80 preschooler, $120 youth, $80 adult). No gate change.

3. **victoria-life, `detail.about` and `detail.steps[2]`, adjudicator route: FIX.**
   - Evidence: applicants "may still be eligible to apply ... using an adjudicator". Also: "Adjudicator applications will only be accepted when all required information is provided. Auditing is done for ALL adjudicator forms."
   - `about`: replace the last sentence with "If you cannot provide the standard documents you may still be eligible to apply using an adjudicator. The City only accepts adjudicator applications when all required information is provided and audits all adjudicator forms."
   - `steps[2]`: change to "If you cannot provide the documents, you may be able to use an adjudicator: a community professional familiar with your financial and residential situation completes the adjudicator form".

4. **victoria-life, `detail.documents[2]` (Notice of Assessment age): FIX.**
   - Evidence: "for all household members aged 19 and older".
   - Change "household members over 19" to "household members aged 19 and older".

## B. Report part B, DIFFERS 1–14 and observations

5. **aadl, gate `aadlAssessment` (used only by aadl): FIX.**
   - Evidence: "long-term and chronic are defined as being 6 months or longer". The page has no "expected to" and does not apply the test to terminal illness.
   - New `unmet`: "An authorized health professional must assess you, and the item must be an AADL benefit bought from an approved AADL vendor. AADL defines long-term and chronic as 6 months or longer."
   - I kept "AADL-listed" out, but it is harmless, since "Benefits covered" is a page of the AADL site. Drop it if you want a strict match.
   - The oracle entry (`e2e/oracle/oracle-spec.js:574`) is `external(...)` and does not assert the text.

6. **aadl, gate `aadlOtherPayer` (used only by aadl): FIX.**
   - Evidence: "You may not be eligible for AADL benefits if you are eligible to receive comparable benefits from another source". Veterans Affairs applies "(if you are a veteran who needs help because of a medical condition from active duty)". Also: "If a benefit is not available through NIHB, and if clients are eligible for AADL, then AADL benefits can be accessed."
   - New `unmet`: "You may not be eligible for AADL if you are eligible to receive comparable benefits from another source: Veterans Affairs (for a medical condition from active duty), Workers' Compensation Board, Non-Insured Health Benefits (NIHB) or a private insurance plan. If a benefit is not available through NIHB and you are eligible for AADL, AADL benefits can be accessed."
   - This restores the hedge, the active-duty scope and the NIHB fallback.

7. **airdrie-fair-access, `note` (and the generated guide): FIX.**
   - Evidence: `--2` lists "A copy of your current Assured Income for Severely Handicapped (AISH) or Alberta Disability Assistance Program (ADAP) form" as one accepted proof of income. Also: "your income will be assessed". AISH/ADAP recipients "qualify for two-year terms".
   - The page never says AISH does or does not qualify automatically.
   - New `note`: "Airdrie assesses your household income against its thresholds; the page does not say that being on AISH qualifies you automatically. An AISH or ADAP form showing your eligibility period is one of the accepted proof-of-income documents, and AISH/ADAP recipients get a two-year term instead of one year."
   - Remove two further claims that are not on any snapshot: "Unlike Red Deer or Medicine Hat" and "AISH income is well under the line".
   - The text is in `public/data.js` (~4470) and `public/guides/airdrie-fair-access.html`; regenerate the guide, don't hand-edit it.

8. **bc-icbc-disability-discount, `amount` and `summary` (and the BENEFIT_VALUES note "25% off ICBC basic Autoplan"): FIX.**
   - Evidence: "If you're eligible for the fuel tax refund program ... you may receive ... a 25% discount off your ICBC basic Autoplan insurance (including electric vehicles)".
   - New `amount`: "You may receive 25% off ICBC basic Autoplan insurance (including electric vehicles) if you are eligible for the fuel tax refund program for persons with disabilities".
   - New `summary`: "If you are eligible for the provincial fuel tax refund program for persons with disabilities, you may receive 25% off the basic part of your ICBC vehicle insurance."
   - The BENEFIT_VALUES note should become "may get 25% off ICBC basic Autoplan".

9. **bc-icbc-disability-discount, gate `vehicleDisability` and `requiresNote`: FIX with a NEW record-specific gate.**
   - Evidence: the page's routes are B.C. Disability Assistance Certification, BCANDS letter, Veterans' Affairs 100% pension letter, CNIB letter, or medical certification (including "Permanent mental disability ... hazardous"). They are all "permanent".
   - `vehicleDisability` is shared with `excise-gasoline-tax-refund` and `bc-fuel-tax-refund-disabilities`, and it is `fixed: () => !functionalNeedUnknown()`. It therefore hard-rejects profiles with no physical, vision or transit need, even though the page includes other routes. Do NOT edit it.
   - Add a gate `bcVehicleDisabilityRoute` with `met: () => false` and `fixed: false`, `who: ["you","program"]`, `short: "Check which disability confirmation the registration page accepts"`, and an action linking to the fuel-tax page.
   - `unmet`: "Confirm your disability with one of the routes the registration page lists: B.C. Disability Assistance Certification; a letter from BCANDS, Veterans' Affairs (100% disability pension) or CNIB; or medical certification of a listed permanent condition."
   - In the ICBC `requires`, replace `vehicleDisability` with `bcVehicleDisabilityRoute`.
   - Tests: add an `external("...")` entry for the new key in `e2e/oracle/oracle-spec.js` (next to line ~578). The ICBC status stays "almost" (`matcher-safety.spec.js:953` and `:1418`, `oracle-spec.js:791`), and the "registration is confirmed" assertion (`:982`) comes from `bcFuelTaxRegistered`, which is untouched.
   - Follow-up for the caller: `bc-fuel-tax-refund-disabilities` has the same problem. It is outside this batch, so raise it as a separate item.
   - The `requiresNote` "same disability confirmations listed there apply" can stay, since it points at the page.

10. **bc-pharmacare-plan-c, `detail.steps[3]`: FIX.**
    - Evidence: "Emergency Plan C provides up to 48 hours of PharmaCare coverage". A provider "may request" it if you are "eligible for Plan C ... but have not been enrolled in the plan yet".
    - New step: "If you are eligible for Plan C but not yet enrolled and need a prescription urgently, ask the prescriber or pharmacist whether they can request emergency Plan C coverage, which provides up to 48 hours of PharmaCare coverage".
    - Separate note: "protected status" in `steps[0]` and the phone number 1-800-663-7100 are NOT ON PAGE. Neither was a DIFFERS item, so I left them.

11. **bc-pwd-designation, `eligibility.items[2]`, `requiresNote` and gate `dailyLivingLimit` ("or similar support"): FIX.**
    - Evidence: "requires an assistive device, the significant help or supervision of another person, or the services of an assistance animal". That is a closed list of three.
    - Record text: end with "...and requires an assistive device, the significant help or supervision of another person, or the services of an assistance animal."
    - Gate `unmet`: "PWD requires significant restrictions in daily living plus an assistive device, the significant help or supervision of another person, or the services of an assistance animal."
    - `dailyLivingLimit` is shared with bc-disability-assistance-pwd and bc-property-tax-deferment-disabilities. Both describe the same PWD test (the property-tax record already lists the three supports without "similar"), so an in-place edit is accurate for all three. No new gate is needed.
    - The only e2e text matches involving PWD needs are `/prescribed-class/i`, `/not automatically lost/i` and `/at least two years/`, and none of them touches this text.

12. **bc-pwd-designation, `summary` and tips ("credential behind most other BC disability programs"): FIX.**
    - Evidence: the form "is provided only to new applicants or recipients of income assistance who intend to apply for disability assistance". "Applicants who want to apply for the PWD designation to access other programs or benefits should not be provided with a PWD application (HR2883)."
    - Delete "It is the credential behind most other BC disability programs."
    - Replace it with: "It is required to access disability assistance."
    - Add a tip: "The ministry provides the HR2883 application to people who intend to apply for disability assistance; it is not given out only to qualify for other programs."

13. **bc-pwd-designation, `amount`: FIX (same record, hedge).**
    - Evidence: "The PWD designation is required to access disability assistance". "A recipient with the PWD designation may be eligible for: Higher rates ... Health supplements ... An Annual Earnings Exemption ... A bus pass."
    - New `amount`: "No direct payment on its own. The designation is required to access disability assistance, and a recipient with it may be eligible for higher rates, health supplements, an annual earnings exemption and a bus pass."
    - Drop "unlocks" and "transportation supplement". Update the BENEFIT_VALUES note only if it repeats them; "gateway designation — no payment on its own" is fine.

14. **bc-pwd-designation, `detail.about`, `aboutList.items[0]` and the "shorter HR3642" tip: FIX.**
    - Evidence: the classes are "People enrolled in BC PharmaCare plan p"; "determined by the Ministry of Children and Family Development to be eligible for the At Home Program"; "determined by Community Living British Columbia to be eligible"; "determined as disabled by the Government of Canada and eligible for the Canada Pension Plan Disability Benefit or the ... Post-Retirement Disability Benefit"; "designated ... by Indigenous Services Canada ... within the BC region".
    - New text: "Five prescribed classes can use the prescribed-class application (HR3642) instead: people enrolled in BC PharmaCare Plan P (palliative care); people the Ministry of Children and Family Development has determined to be eligible for the At Home Program; people Community Living BC has determined to be eligible for its supports and services; people determined as disabled by the Government of Canada and eligible for the CPP Disability Benefit or Post-Retirement Disability Benefit; and people designated as a Person with Disabilities by Indigenous Services Canada in the BC region."
    - Replace "shorter" with "prescribed-class". The page does not call it shorter.
    - Soften the tip to "If you are in a prescribed class, ask whether the prescribed-class HR3642 application applies instead of the standard application".
    - Add the page's caveat: prescribed-class applicants "must still meet all other eligibility requirements (identification, financial, residency, etc.)".
    - The gate `bcPwdDesignationFinancial` is fine as written.

15. **bc-pwd-designation, `detail.steps[3]` and gate `bcPwdMedical`: FIX.**
    - Evidence: "Section 3 is an assessor report to be completed by a medical practitioner, nurse practitioner or other prescribed professional".
    - New step: "Have a medical practitioner, nurse practitioner or other prescribed professional complete the assessor report".
    - Gate: end with "A medical practitioner or nurse practitioner completes the medical report, and a medical practitioner, nurse practitioner or other prescribed professional completes the assessor report."
    - `bcPwdMedical` is shared only with bc-disability-assistance-pwd, which uses the same HR2883 sections, so an in-place edit is fine.
    - The phrase "who knows your daily limitations" is not on the page, so drop it.

16. **bc-workbc-employment-services, `summary` and `amount` ("paid training", "Free — including skills training"): FIX.**
    - Evidence: "WorkBC may provide funding support for tuition, books, living expenses, childcare and other related costs". The page also describes "a wide range of free employment services".
    - `summary`: change "paid training" to "possible funding support for training".
    - `amount`: see item 17, which rewrites it in full.

17. **bc-workbc-employment-services, `amount` (transportation and dependent care): FIX.**
    - Evidence: "Dependent care supports to cover childcare while you are job searching". Also: "typically available to clients who are case managed through WorkBC, meaning you have an employment plan in place and are working with an employment specialist."
    - New `amount`: "Free employment services, including work experience and wage subsidies. Funding support for training, transportation, dependent care and employment-related disability supports may be available, typically for clients with an employment plan."
    - Add a `detail.tips` entry: "Financial supports are typically available to clients who are case managed through WorkBC (an employment plan in place, working with an employment specialist). Dependent care covers childcare while you are job searching."
    - Delete "practical supports that remove the barriers around a job" from the summary or soften it to "possible financial supports".

18. **bc-workbc-employment-services, `amount` (assistive technology): FIX.**
    - Evidence: "Assistive Technology for Disabilities" and "Assistive Technology Services" are separate services on the page. The Centre Services list names only "Employment-related disability supports" (typically for case-managed clients) and "Specialized equipment for persons with disabilities" (self-serve).
    - Remove "assistive technology" from the Centre Services list in item 17's `amount`, and use "employment-related disability supports" instead.
    - Keep the existing `note` that points to the separate WorkBC Assistive Technology program.
    - Readability: the BENEFIT_VALUES note "free employment services" and the age16plus and `bcWorkBcRoute` gates need no change.

19. **bc-icbc-disability-discount, `note` (raw record id): FIX.**
    - The text "Register for bc-fuel-tax-refund-disabilities first" shows an internal id to users.
    - Change to "Register for the Fuel Tax Refund Program for Persons with Disabilities first, then talk to an Autoplan broker about applying the discount to your policy."

20. **bc-icbc-disability-discount, "16 years old or older": FIX (text only).**
    - Evidence: the eligibility list begins "Be 16 years old or older".
    - Add "You must be 16 or older." to the front of `requiresNote`, with no new gate. The fuel-tax record omits the age too, so treat that as the same follow-up as item 9.
    - Adding the existing `age16plus` gate would also be accurate: it is fixed and its text is "You must be at least 16." It would hard-reject under-16 profiles, which matches the source. I left that to the caller because the ICBC status expectations are asserted in the oracle.

## C. Report part C, items 1–5 and 15–18

21. **child-health-benefit, `amount` (and the BENEFIT_VALUES note "free prescriptions, dental & optical for kids"): FIX.**
    - Evidence: the page offers "eyeglasses, prescription drugs and dental care" and lists "Dental care basic and preventative services like fillings, x-rays ...", "Eye glasses every year", and "The list of eligible prescription drugs". The page never says "Free".
    - New `amount`: "Covers eligible prescription drugs, basic and preventative dental care and eyeglasses for children in low-income households".
    - The note on line ~218 of `data.js` should follow. The `detail.about` text "No-premium prescription, dental, optical and other eligible health coverage" is accurate, so leave it.

22. **child-health-benefit, `detail.tips[2]` and gate `achbCoverageCoordination`: FIX.**
    - Evidence: "For services covered by both plans, claims must be submitted to the CDCP first, with any remaining eligible costs then covered by ACHB." The page also says Albertans "may also be eligible for" the CDCP.
    - New tip: "If you also have the Canadian Dental Care Plan, claims for services covered by both plans go to the Canadian Dental Care Plan first; ACHB may then cover remaining eligible dental costs."
    - Keep the "may". It is more conservative than the page.
    - The gate (used only by ACHB) is asserted at `matcher-safety.spec.js:318–319`: `/Private or other health plans are not exclusions.*use them first.*remaining eligible costs/i` and `/Canadian Dental Care Plan first.*remaining eligible dental costs/i`.
    - New gate sentence: "For dental services covered by both plans, claim from the Canadian Dental Care Plan first; ACHB may then cover remaining eligible dental costs."
    - This still matches both regexes. Do not change the private-plan sentence.

23. **disability-supports-deduction, `eligibility.items[0]`, `requiresNote`, `summary`, `detail.about` and `aboutList.lead`: FIX.**
    - Evidence: "do research for which you received a grant". The page also hedges: "you may be able to deduct".
    - Change "carry out research" / "do research" / "research" to "do research for which you received a grant" in each place (`data.js` ~3452–3470).
    - Optionally restore the "may be able to" hedge in `requiresNote` and `eligibility`.
    - The shared gate `disabilityMedicalExpensesPaid` is not touched.

24. **dres, `eligibility.items[5]` and `requiresNote` (SAFETY GUARDRAIL): FIX.**
    - Evidence: after four "you must be" items the page says "You may be eligible for funding if you have a disability that is: documented permanent or long-term and creating a barrier to education, training and/or employment".
    - `items[5]`: "You may be eligible for funding if you have a disability that is documented permanent or long-term and creating a barrier to education, training and/or employment."
    - `requiresNote`: keep the first sentence (age, Alberta, legal entitlement, status, "employed or employment destined" are all "must be" on the page). Change the second sentence to "You may be eligible for funding if your disability is documented permanent or long-term and creating a barrier to education, training and/or employment."
    - Guardrail check: this text does not affect any assertion. The e2e checks are the status ("almost", `matcher-safety.spec.js:354`), `needs` length 3 with the DRES URL (`:361`, `:414`), the `requires` list (`:461`) and the published-example, exclusion and K–12/post-secondary strings. None of them match this field. AGENTS.md rule 4 (functional limitation, not diagnosis) is respected, and the new wording is more hedged.
    - The gate `dresDisabilityBarrier` already says "Confirm", so leave it.

25. **dres, gate `dresEmploymentRoute`, "ordinary job matching" (SAFETY GUARDRAIL): FIX (narrow exclusion).**
    - Evidence: "Items not funded through DRES: ... employment services (for example, job matching, employment and skills training, or wage subsidies)".
    - The word "ordinary" is not on the page, and it implies some job matching is funded.
    - New sentence: "DRES does not fund employment services, for example job matching, employment or skills training, or wage subsidies."
    - This touches exactly ONE assertion: `e2e/matcher-safety.spec.js:400`, `expect(warning).toMatch(/does not fund ordinary job matching, employment or skills training, or wage subsidies/i)`.
    - Change it to `/does not fund employment services, for example job matching, employment or skills training, or wage subsidies/i`. The exclusion stays asserted.
    - Untouched: the test title at `:390`; the copy test at `:418–459` (it scans the benefit record, not the gate, and needs "job matching", "employment and skills training" and "wage subsidies" in the record, which `about` and `tips` still have); and the negative regex at `:453`. The "not fund ..." wording is not matched by it.
    - The e2e K–12 and "contact the school or institution for disability accommodations" regexes (`:394–396`) stay satisfied.

26. **reddeer-fee-assistance, `amount` and `about` ($200): FIX.**
    - Evidence: "Pending available funding, the program provides a subsidy of up to $200 per year to each eligible person for Safe & Healthy Communities program registrations".
    - `amount`: "$34/month transit pass + up to $200/year per eligible person for recreation programs (pending available funding)".
    - `about`/`aboutList`: "...plus, pending available funding, up to $200 a year per eligible person toward Safe & Healthy Communities program registrations."
    - Keep the existing tip about funding.

27. **reddeer-fee-assistance, `summary`, `note`, `steps[1]`, `steps[2]` ("qualifies you automatically", "no income test needed"): FIX.**
    - Evidence: recreation page: "You may automatically qualify ... if you are a Red Deer resident and one of the following applies to you", with documentation. Transit page: "riders must meet one of the following criteria: Receiving ... AISH, GIS, Alberta Income Supports ...". The CRA Notice of Assessment is for "If you are not a recipient of any of these".
    - `summary` sentence: "If you are on AISH you may automatically qualify when you show the City your documents."
    - `note`: "If you're on AISH or Income Support you may automatically qualify when you provide the listed document, so you may not need to send a Notice of Assessment."
    - `steps[1]`: "If you're on AISH, Income Support or Guaranteed Income Supplement, provide that document — the City says you may automatically qualify."
    - `steps[2]`: keep.
    - No gate change (`lowIncomeOrDisabilityIncome` is shared and its text is accurate). Check `check-readability` still passes.

28. **reddeer-fee-assistance, `documents[1]`: FIX.**
    - Evidence: "Government issued ID, and proof of residence if your ID does not show your current Red Deer address".
    - New documents line: "Government-issued ID, and proof of residence if your ID does not show your current Red Deer address".

29. **reddeer-fee-assistance, `time` and `steps[3]`: FIX.**
    - Evidence: recreation page: "processing may take over 10 business days due to high volume". Transit page: "it could take up to 10 business days to process".
    - `time`: "Transit pass: up to 10 business days. Recreation: the City says processing may take over 10 business days due to high volume."
    - `steps[3]`: "Allow up to 10 business days (recreation applications may take longer due to high volume), then buy the $34 pass."

30. **child-health-benefit, `detail.phone` (page gives different numbers): FIX (replace).**
    - Evidence: the snapshot has no "644-9992". The page's contact section reads "Health Benefits Contact Centre: Phone: 780‑427‑6848 Toll free: 1‑877‑469‑5437".
    - New `phone`: "Health Benefits Contact Centre: 780-427-6848 or 1-877-469-5437".
    - This is the number the page gives for the same purpose. No test pins the old value. (The DRES phone assertion at `matcher-safety.spec.js:458` is a different record.)

31. **reddeer-fee-assistance, `detail.phone` (page gives a different number): FIX (replace).**
    - Evidence: 403-342-8111 is in neither snapshot. The page says "To talk to a staff member for more information regarding the program, call 403-309-8411" and gives feeassistance@reddeer.ca.
    - New `phone`: "Fee Assistance Program: 403-309-8411 (or feeassistance@reddeer.ca)".
    - No test pins the old value.

32. **handydart-translink, `detail.time` (Other notes): FIX.**
    - Evidence: "We will process your HandyDART application within 10 days of confirming receipt. Please allow 4 to 6 weeks processing time for HandyCard applications."
    - New `time`: "TransLink says it processes HandyDART applications within 10 days of confirming receipt, and asks you to allow 4 to 6 weeks for HandyCard applications."

33. **dres, omitted "or your dependant child" clause (Other notes): KEEP.**
    - Evidence: "If you or your dependant child are attending one of these programs, connect with the school or institution". The exclusion itself is "not available to individuals who are attending".
    - It is an omission only, with no hardening. Adding it near the exclusion risks suggesting that a dependant's attendance blocks the parent's DRES eligibility.
    - It would also touch the regexes at `matcher-safety.spec.js:394–396`. Leave the text as is.

34. **victoria-life, `detail.tips[1]` and `steps[4]` (sticker renewal "each calendar year"): KEEP.**
    - Evidence: the page says "You will require a new sticker each calendar year". It also says second-year members get a sticker "based on their application anniversary date", and "ensure your 52-visit sticker is current by checking the end date printed on it".
    - The record matches one explicit page sentence, and the page contradicts itself. If you want to be safe, add "check the end date printed on your sticker", which is within the source. This was listed as a source tension, not a DIFFERS item, so no change is required.

35. **woodbuffalo-lift, observations beyond the DIFFERS rows (no action decided, flagged for the caller): KEEP for now.**
    - The comparative note "One of only two municipal programs here ..." and "well above AISH" are NOT ON PAGE.
    - The record omits the page's exclusions (international students, sponsored individuals in their first year, temporary foreign workers). Consider adding them in a later pass.
    - Both are outside the ten DIFFERS the reviewer was asked to decide, so I made no change decision.

36. **woodbuffalo-lift, `detail.about`, `aboutList.items[1]`, `steps[4]` ("separate application"): FIX.**
    - Evidence: the page says "Only one application is required to assess Eligibility for the discounted programs". The Wood Buffalo Recreation Support Program is listed under "Local Community Partners - Offers and Discounts".
    - Replace "is separate ... it's a different application" with: "The Wood Buffalo Recreation Support Program is a separate program that gives 60% off ... memberships. The LIFT page says only one application is required to assess eligibility for these community partner discounts."
    - `steps[4]`: "Ask the City or the Recreation Support Program how to claim the 60% recreation discount once you are approved; the LIFT page says one application assesses eligibility."
    - Update the `summary` word "separate" to "a 60% discount on regional recreation memberships through a community partner".

37. **woodbuffalo-lift, `steps[2]` and `time` (7–10 business days): FIX.**
    - Evidence: "You will be notified within 7-10 business days. Applicants must submit a complete application."
    - `steps[2]`: "You will be notified within 7–10 business days if you submit a complete application."
    - `time`: "Notification within 7–10 business days of a complete application."
    - The BENEFIT_META wait "7–10 business days" is fine.

38. **woodbuffalo-lift, `detail.documents[2]` ("18 or older"): FIX.**
    - Evidence: "Be 18 years old or older". Also: "Individuals under 18 who are living independently may be considered."
    - New line: "You must be 18 or older to apply (people under 18 who live independently may be considered)".

**Count: 37 FIX / 3 KEEP / 0 OPEN.**

(Items 33, 34 and 35 are the three KEEPs. Note that the reviewer's original claim list had 35 findings; items 12–13, 16–18 and 19–20 were split from claims that spanned several fields, which is why the numbered list runs to 38.)
