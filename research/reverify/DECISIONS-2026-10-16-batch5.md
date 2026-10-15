# Decisions — re-verification batch 5 (2026-10-16)

Every DIFFERS item 1-36 in `REPORT-2026-10-16-batch5.md` was re-checked against `research/reverify/snapshots/<record>--<n>.txt` (fetched 2026-10-15/16), the record in `public/data.js` (node vm) and the `REQS` gate in `public/app.js`. All 36 claims were real (no false positives); a few are only partly right and the note says so. Nothing needs OPEN. Because the guides and AI context are generated, after any `data.js` or `app.js` edit run `npm run gen:guides`, `npm run gen:context`, `npm run check:surfaces` and the unit and e2e suites. Run e2e alone.

Conventions:
- "Record" means the field in `public/data.js`. "Gate" means `REQS.<key>` in `public/app.js`.
- "Shared gate" means other benefits use it too. I never reword a shared gate; I specify a record-specific gate instead (`fixed: false` unless the source states a hard refusal; `met` true only when existing answers clearly establish a listed route).
- Quoted replacement text uses only the snapshot's wording. Where the source hedges ("may", "include", "many"), the hedge stays.
- BENEFIT_VALUES / BENEFIT_META are mentioned only where they repeat the wrong claim. Elsewhere they are unchanged.
- Tests: only the ones named below touch changed text, gate keys or the oracle. Text-only record edits need the guide regeneration above (`test/requires-note-rendered.test.js` compares each `requiresNote` with the generated guide).

## Source-limitation notes

- Snapshots are navigation-heavy page copies. I rely on the body text near "Last updated" / "Eligibility" in each.
- `bc-cy-disability-benefit--1.txt` is a government news release; `--2` is the ministry page and wins where they differ.
- Adjacent claims I noticed but that are not DIFFERS items (left alone, listed at the end).

## A. bc-csg-services-equipment (items 1-3)

1. **bc-csg-services-equipment, `detail.steps[0]`: FIX.**
   - Evidence (`--2`): "Some disabilities (Specific Learning Disorders) do not require completion of the Disability Verification Form and have different verification requirements."
   - New `steps[0]`: "Complete a StudentAid BC application and get your disability status verified (Disability Verification Form from a qualified medical assessor; some disabilities, such as Specific Learning Disorders, have different verification requirements — see the form's instructions)."
   - Gate `disabilityDoc` is shared and unchanged. Tests: none.

2. **bc-csg-services-equipment, `detail.steps[2]` (and `steps[3]`): FIX.**
   - Evidence (`--2`): equipment — the officer completes the Equipment Request form "and send it to Assistive Technology BC"; "Assistive Technology BC will contact you to set up a meeting to review equipment needs"; "Your equipment will be ordered". Services — "submit the Services Request form to StudentAid BC, who will review your services needs"; "You will receive a notification when your request is complete".
   - New `steps[2]`: "Your school's accessibility services officer sends the Equipment Request form to Assistive Technology BC (for equipment), or the Services Request form to StudentAid BC (for services)."
   - New `steps[3]` (the "decisions posted to your StudentAid BC account" line is not on the page): "For equipment, Assistive Technology BC contacts you to review your needs and your equipment is ordered. For services, you get a notification when your request is complete."
   - The summary's "delivered through StudentAid BC" can stay (the page says you access the programs through your StudentAid BC loan application). Tests: none.

3. **bc-csg-services-equipment, `BENEFIT_META.effort`: FIX.**
   - Evidence (`--2`): the Appendix 8 route is only "for applicants who applied for student aid before June 19, 2026"; later applicants use the "Disability status application". The page names no cost estimates.
   - New `effort`: "StudentAid BC application + disability status application (Appendix 8 if you applied before June 19, 2026) + services or equipment request through your school".
   - `detail.steps` / `documents[1]` still say "cost details". The page is silent on costs, so that is NOT ON PAGE, not wrong; keep (absence is not evidence). Tests: none (`test/bc-values.test.js` checks only the values entry).

## B. bc-csg-students-disabilities (item 4)

4. **bc-csg-students-disabilities, `detail.steps[2]` and `detail.documents[1]`: FIX.**
   - Evidence (`--2`): "Some disabilities (Specific Learning Disorders) do not require completion of the Disability Verification Form and have different verification requirements. Please review the instructions on the Disability Verification Form for additional information."
   - New `steps[2]`: "Download the Disability Verification Form and have a qualified medical assessor complete it. Some disabilities (Specific Learning Disorders) do not require the form and have different verification requirements; check the instructions on the form."
   - New `steps[3]` lead-in: "Upload the signed form (if your disability needs it) inside the Disability status application and submit your declaration."
   - New `documents[1]`: "Disability Verification Form completed by a qualified medical assessor (not required for some disabilities, such as Specific Learning Disorders)".
   - `eligibility.items[2]` / `requiresNote` ("verified by a qualified medical assessor") match the page's general rule ("You need a medical assessment by a qualified medical assessor") and stay. Tests: `e2e/matcher-safety.spec.js:1393` only checks the id is present; unaffected.

## C. bc-cy-disability-benefit (items 5-11)

5. **bc-cy-disability-benefit, `REQS.under19.unmet`: FIX (new record-specific gate).**
   - Evidence (`--2`): "ages 0 until the last day of their 19th birthday month".
   - `under19` is SHARED with `bc-healthy-kids`. Do not edit it. Add `REQS.bcCydbAge`: `met: () => isUnder18() || ageIn("18")` (same as `under19`), `fixed: true`, `short: "Check the age range"`, `unmet: "This benefit is for children and youth from age 0 until the last day of their 19th birthday month."`
   - In `data.js` replace `"under19"` with `"bcCydbAge"` in this record's `requires` (first of four; keep order).
   - Tests: add `bcCydbAge: ageGate("16to17", "19to59")` beside `under19` in `e2e/oracle/oracle-spec.js` (~line 296) and bump `SPEC_VERSION`. `e2e/misfiled-gates.spec.js:20` checks only `bcCydbIntake`; `e2e/matcher-safety.spec.js:982`, `:998-999` and `:1102` (19to59 adult stays "no") are unchanged.
   - POINT FOR YOU: the wizard's age bands cannot tell a 19-year-old in their birthday month (eligible) from other 19to59 adults, so `fixed: true` still refuses that small group. Making it non-fixed would turn every 19-59 adult into "almost" and break `:1102`. I kept it hard; say if you want it softened.

6. **bc-cy-disability-benefit, `eligibility.items[0]`, `requiresNote`, `summary`: FIX.**
   - Evidence (`--2`): "ages 0 until the last day of their 19th birthday month".
   - `items[0]`: "The child is aged 0 until the last day of their 19th birthday month."
   - `requiresNote`: "Ages 0 until the last day of the 19th birthday month, with a long-term disability causing significant and complex developmental support needs, based on diagnosis and/or functional impact"
   - `summary`: replace "children and youth up to age 19" with "children and youth from age 0 until the last day of their 19th birthday month".
   - Tests: none reference the text.

7. **bc-cy-disability-benefit, `detail.about` and `detail.aboutList.items[1]`: FIX.**
   - Evidence (`--2`): direct admit list says "Degenerative conditions with predictable decline (Duchenne muscular dystrophy, SMA types 1 & 2)".
   - Replace "and degenerative conditions" with "and degenerative conditions with predictable decline (such as Duchenne muscular dystrophy and SMA types 1 and 2)". The rest of the list (moderate to profound intellectual disability, autism combined with any level of intellectual disability) is on the page. Tests: none.

8. **bc-cy-disability-benefit, `note`: FIX.**
   - Evidence: `--1` "Eligible families who are currently receiving services ... will not need to apply"; `--2` "will transition to the Disability Benefit if they are eligible ... others may be asked to provide additional information".
   - New `note`: "Starts April 1, 2026. Eligible families already receiving ministry services for children and youth with support needs, including autism funding, will not need to apply, although some may be asked to provide additional information. The benefit will be available province-wide by April 1, 2027."
   - Note: `--1` says the benefit "will be fully operational" on April 1, 2027 (the supplement is the part "available provincewide"); "province-wide by April 1, 2027" is close but not exact. Left as is because it is not a DIFFERS item; flag if you want it tightened. Tests: none.

9. **bc-cy-disability-benefit, `detail.steps[1]`, `detail.tips[0]`, `detail.documents[0]`: FIX.**
   - Evidence (`--2`): "Prior to March 31, 2027 families can apply for supports using current pathways"; "Children and youth receiving CYSN services before March 31, 2027 will transition to the Disability Benefit if they are eligible. Some ... will move directly ... while others may be asked to provide additional information".
   - `steps[1]`: "Not yet in a program: before March 31, 2027 you can apply through the current pathways (such as Autism Funding or the School-Aged Extended Therapies stream). Children and youth receiving CYSN services before March 31, 2027 will transition to the Disability Benefit if they are eligible."
   - `tips[0]`: "Do not wait for 2027 — before March 31, 2027 you can apply through the current pathways. Those receiving CYSN services by then will transition to the Disability Benefit if they are eligible."
   - `documents[0]`: "Existing program enrolment (some children move directly based on information on file; others may be asked for additional information), or"
   - Tests: `e2e/matcher-safety.spec.js:998-999` match the gate text, not these fields.

10. **bc-cy-disability-benefit, `detail.steps[2]` and `detail.time`: FIX.**
   - Evidence (`--2`): "New applicants after April 1, 2027 will apply directly"; "After April 1, 2027: New families can apply directly".
   - `steps[2]`: "After April 1, 2027: new applicants apply directly to the Disability Benefit"
   - `time`: "Transition runs April 2026 to March 2027; new applicants apply directly after April 1, 2027."
   - Gate `bcCydbIntake` already says "after April 1, 2027". Tests: none.

11. **bc-cy-disability-benefit, `detail.tips[3]`: FIX.**
   - Evidence: `--1` "Toll-free helpline for families: 1-844-442-2800" (the record's own `phone`); `--2` PAIRS "Phone: 1-844-878-4700 ... 8:30am - 4:30pm (M-F) Excluding statutory holidays", for information on using the funding, building a support team and planning. No page gives 1-833-882-0024 or a "CYSN Resource Line", and neither page mentions "your local CYSN office".
   - New `tips[3]`: "Call the toll-free helpline for families (1-844-442-2800) with questions. For information on using the funding, call PAIRS (1-844-878-4700, 8:30am to 4:30pm Monday to Friday, excluding statutory holidays)."
   - Tests: none.

## D. bc-dental-supplement (items 12-14)

12. **bc-dental-supplement, `eligibility.items[0]` and `requiresNote`: FIX.**
   - Evidence: "You may be able to get basic dental coverage if you: Are eligible for general health supplements; Receive disability assistance; Qualify as a person with persistent multiple barriers".
   - `items[0]`: "Adults may be able to get basic dental coverage if they receive disability assistance, qualify as a person with persistent multiple barriers (PPMB), or are eligible for general health supplements."
   - `requiresNote` first sentence: the same wording; the children sentence stays ("children under 19 in families on assistance have basic dental coverage" matches the page). Gate `bcAssistanceStatus` is shared and unchanged. Tests: none.

13. **bc-dental-supplement, `eligibility.note` and `requiresNote`: FIX.**
   - Evidence: "Everyone who receives assistance can access emergency dental services to relieve pain." and "You may be eligible for dentures if you: Receive any kind of income assistance, and Had your complete upper and/or lower teeth removed in the previous six months to relieve pain".
   - New `eligibility.note`: "Everyone on assistance can get emergency dental treatment to relieve pain. Adults on income assistance may also be eligible for dentures if their complete upper and/or lower teeth were removed in the previous six months to relieve pain."
   - In `requiresNote` replace the last sentence ("Adults on plain income assistance get emergency dental only.") with the same two sentences. Tests: none.

14. **bc-dental-supplement, `detail.time`: FIX.**
   - Evidence: "you may be able to have basic dental costs covered"; coverage depends on the listed adult categories.
   - New `time`: "No application is described on the page — if you receive assistance you may be able to have basic dental costs covered; the provider verifies it at booking"
   - `BENEFIT_META.wait` / `effort` ("Provider confirms ministry coverage") are unchanged. Tests: none.

## E. bc-disability-assistance-pwd (items 15-16)

15. **bc-disability-assistance-pwd, `detail.about` and `detail.aboutList.items[0]`: FIX.**
   - Evidence (`--1`): one-person shelter allowance "Minimum $75, Maximum $500"; "If actual shelter costs are less than the minimum shelter allowance, the minimum shelter allowance will be provided."
   - Replace "plus actual shelter costs up to $500" with "plus a shelter allowance of up to $500 (for one person the minimum is $75 if your actual shelter costs are less)". The `amount` ("$983.50 support + $500 shelter") is a maximum and stays; `BENEFIT_VALUES.monthlyMax` 1535.5 is unchanged.
   - This record shares gates `dailyLivingLimit` and `bcPwdMedical` with `bc-pwd-designation`; I touch no gate. Tests: `test/bc-values.test.js:133` (monthlyMax) unaffected.

16. **bc-disability-assistance-pwd, `detail.steps[4]`: FIX.**
   - Evidence (`--1`): "Disability assistance is paid in the month following designation. In cases where designation occurs prior to the individual's 18th birthday, payments begin in the month of the 18th birthday."
   - New `steps[4]`: "Submit everything and respond to any ministry follow-up. If you are approved for the designation and are financially eligible, assistance is paid in the month following designation (payments begin in the month of your 18th birthday if you were designated before turning 18)."
   - Tests: none.

## F. bc-home-reno-tax-credit (item 17)

17. **bc-home-reno-tax-credit, `REQS.qualifyingRenovationSpend.unmet`: FIX (new record-specific gate).**
   - Evidence: "An eligible expense is deemed to have been paid on the earlier of the date on which the expense was paid or the date it becomes payable."; "If you receive an invoice at the end of the calendar year and pay it in the following calendar year, the credit is to be claimed for the taxation year based on when you received the invoice."
   - `qualifyingRenovationSpend` is SHARED (`multigenerational-home-renovation-tax-credit` at `data.js` ~3310; the federal HATC uses a different gate). Do not edit it. Add `REQS.bcHomeRenoSpend`: `met: () => false`, `fixed: false`, `short: "Check the renovation expenses qualify, and keep the receipts"`, `who: ["you"]`, `unmet: "This credit pays back part of what you spend, so it applies only once the qualifying renovation has actually been done. An eligible expense is deemed to have been paid on the earlier of the date it was paid or the date it becomes payable. Keep your invoices and receipts."`
   - Replace `"qualifyingRenovationSpend"` with `"bcHomeRenoSpend"` in the record's `requires`.
   - Tests touched: `test/factual-batch.test.js:187` (change the key to `bcHomeRenoSpend`); `e2e/oracle/oracle-spec.js` — add `bcHomeRenoSpend: external("Depends on the renovation having actually been done; the expense is deemed paid when paid or payable.")` next to line 537, update the `why` at ~line 846 ("Same renovation-spend gate...") and bump `SPEC_VERSION`; the declared best case stays "almost" (`:796`). `e2e/matcher-safety.spec.js:1496` still passes because the new text keeps "only once the qualifying renovation has actually been done".

## G. bc-medical-equipment-devices (items 18-22)

18. **bc-medical-equipment-devices, `amount`: FIX.**
   - Evidence (`--1`): "does not exceed $4,200, or if the cost ... does exceed $4,200, the ministry is satisfied that the excess cost is a result of unusual installation expenses".
   - Replace "floor/ceiling lifts up to $4,200" with "floor/ceiling lifts up to $4,200 (more only if the excess is from unusual installation expenses)". Tests: none.

19. **bc-medical-equipment-devices, `note` and `detail.tips[0]`: FIX.**
   - Evidence (`--1`): "the ministry will not accept payment responsibility, except in cases of a life-threatening emergency, for medical equipment purchased without prior approval."
   - `note` start: "Pre-approval is required: the ministry must approve the request before purchase, except in cases of a life-threatening emergency, ..."
   - `tips[0]`: "Never buy first — the ministry will not accept payment responsibility for equipment purchased without prior approval, except in cases of a life-threatening emergency".
   - Tests: none.

20. **bc-medical-equipment-devices, `note`: FIX.**
   - Evidence (`--1`): "There are no resources available to the family unit ..."; other resources include "Other government programs or funding sources (e.g., Fair PharmaCare, Health Authorities, ICBC, WorkSafeBC, Veterans Affairs Canada)" and "Private insurance"; "Co-funding may be considered when other resources cannot pay the entire cost."
   - Replace the clause after "payer of last resort" with: "other available resources (for example ICBC, WorkSafeBC or private insurance) must be considered first. Co-funding may be considered when other resources cannot pay the entire cost." ("extended health" is not named; "private insurance" is.) Tests: none.

21. **bc-medical-equipment-devices, `detail.about`, `detail.aboutList.items[0]`, `detail.steps[1]`, `detail.documents[0]`: FIX.**
   - Evidence (`--1`): "must be prescribed by a medical practitioner or nurse practitioner; and/or the medical need must be confirmed by the assessment of a relevant therapist (occupational or physical therapist)."
   - `about` and `items[0]`: "The item must be prescribed by a medical practitioner or nurse practitioner, and/or the medical need confirmed by the assessment of a relevant therapist (occupational or physical therapist). Many items also need a therapist assessment."
   - `steps[1]`: "Get a prescription from your doctor or nurse practitioner, and/or an assessment from a relevant therapist confirming the medical need"
   - `documents[0]`: "Doctor or nurse practitioner prescription and/or therapist assessment confirming the medical need"
   - `steps[2]` ("where required") and `documents[1]` stay. Tests: none.

22. **bc-medical-equipment-devices, `detail.about` and `detail.aboutList.items[2]`: FIX.**
   - Evidence (`--1`): non-eligible items include "Scooters intended primarily for recreational or sports use; Automatic turning beds; Containment type beds; Lift chairs".
   - New: "Scooters intended primarily for recreational or sports use, lift chairs, automatic turning beds and containment type beds are not provided." Tests: none.

## H. bc-msp-supplementary-benefits (items 23-29)

Known (kept): `eligibility`/`about` keep "less than $42,000" (this page: "If it is less than $42,000, your family may qualify"; the Healthy Kids page says "or less"; recorded conflict, not touched). `REQS.bcSupplementaryBenefitsEligibility` is used only by this record, so it can be edited directly.

23. **bc-msp-supplementary-benefits, `note`: FIX.**
   - Evidence: "Many supplementary benefits practitioners are opted-out of the MSP. This means they are allowed to charge patients more ...", and opted-out practitioners "must advise their patients, prior to the treatment" what MSP reimburses and what the patient pays in addition.
   - New first sentence: "The $23 is a contribution, not the full fee — many practitioners are opted out of MSP and are allowed to charge more, and you pay the difference." Remaining sentences stay. Tests: none.

24. **bc-msp-supplementary-benefits, `eligibility.items[1]`, `requiresNote`, `REQS.bcSupplementaryBenefitsEligibility.unmet`: FIX.**
   - Evidence: "Those who may be eligible ... include"; "To be eligible ... you must: be enrolled in MSP; be a resident of British Columbia as defined by the Medicare Protection Act; have resided in Canada as a Canadian citizen or holder of permanent resident status (landed immigrant) for at least the last 12 months immediately preceding this application; and not be exempt from liability to pay income tax by reason of any other act"; "If it is less than $42,000, your family may qualify".
   - Add `eligibility.items[2]` (mode all): "You live in B.C., have lived in Canada as a citizen or permanent resident for at least the last 12 months before applying, and are not exempt from paying income tax under another act."
   - `items[1]` and the gate `unmet`: see item 25 (one sentence handles both). `requiresNote`: add the same residency/tax sentence and change "qualify" to "may qualify".
   - Tests: oracle entry for the gate (`e2e/oracle/oracle-spec.js:610`) is an `external(...)` with generic text; unchanged.

25. **bc-msp-supplementary-benefits, same fields: FIX.**
   - Evidence: the page lists, as people who may be eligible, those "deemed eligible based on their annual net income"; "Income Assistance recipients"; "Convention refugees"; "Inmates of B.C. Correctional Facilities"; "Individuals enroled with MSP through the At Home Program"; "Residents of long term care facilities receiving the Guaranteed Income Supplement (GIS)"; "Individuals enroled with MSP as Mental Health Clients"; "First Nations individuals with valid B.C. Medical Plan coverage through the First Nations Health Authority".
   - New `items[1]`: "You may be eligible if you are in one of these groups: adjusted net income last year of less than $42,000 (your family may qualify); Income Assistance recipients; Convention refugees; inmates of B.C. Correctional Facilities; people enroled with MSP through the At Home Program; residents of long term care facilities receiving the Guaranteed Income Supplement; people enroled with MSP as Mental Health Clients; First Nations individuals with valid B.C. Medical Plan coverage through the First Nations Health Authority."
   - Gate `unmet`: "You may be eligible in several ways: your adjusted net income last year was less than $42,000, or you are an Income Assistance recipient, a Convention refugee, an inmate of a B.C. Correctional Facility, enroled with MSP through the At Home Program, a long term care resident receiving the GIS, enroled with MSP as a Mental Health Client, or a First Nations individual with valid B.C. Medical Plan coverage through FNHA." Change `short` to "Check the income and other eligibility routes".
   - Readability: the long item reads better as a semicolon list; if the check-readability report flags it, move the list into `eligibility.note` and keep `items[1]` as "You may be eligible through your income or through one of the other groups the ministry lists."

26. **bc-msp-supplementary-benefits, `detail.about`, `detail.aboutList.items[2]`, `eligibility.items[1]`, `requiresNote`, gate `unmet`, `summary`: FIX.**
   - Evidence: the groups are introduced as "Those who may be eligible for MSP coverage ... include".
   - `aboutList.items[2]` (and the same sentence in `about`): "People enroled with MSP through the At Home Program, and people enroled with MSP as Mental Health Clients, may also be eligible."
   - `summary` first sentence: "Partial MSP coverage for six kinds of practitioner visits, for people who may be eligible, including lower-income B.C. residents and people enroled with MSP through the At Home Program or as Mental Health Clients."
   - Tests: none.

27. **bc-msp-supplementary-benefits, `detail.tips[2]`: FIX.**
   - Evidence: "Eligibility ... may be impacted if you do not file your taxes each year"; "To avoid losing your eligibility or having to reapply, make sure to file your taxes each year."
   - New: "Keep filing your taxes every year, because your income is re-verified automatically from your CRA return and your eligibility may be affected if you do not file". Tests: none.

28. **bc-msp-supplementary-benefits, `summary` and `detail.tips[4]`: FIX.**
   - Evidence: "Under Healthy Kids, families deemed eligible for Supplementary Benefits may be eligible for basic dental treatment, optical care, and hearing assistance".
   - `summary` last sentence: "Families deemed eligible may also be eligible for the Healthy Kids Program."
   - `tips[4]`: "If your children are under 19, families deemed eligible for Supplementary Benefits may be eligible for basic dental treatment, optical care and hearing assistance through the Healthy Kids Program". Tests: none.

29. **bc-msp-supplementary-benefits, `detail.documents[1]`: FIX.**
   - Evidence: online/combined application "includes giving permission to CRA to release Notice of Assessment or Notice of Reassessment information"; mail: "Mail the completed application form along with copies of a Notice of Assessment or Reassessment from CRA for you (and your spouse)".
   - New: "Your and your spouse's CRA Notice of Assessment or Reassessment information: on the application you give CRA permission to release it; if you apply by mail, include copies with the form". Step 3 ("Give CRA permission on the application") stays. Tests: none.

## I. bc-optical-supplement (items 30-32)

30. **bc-optical-supplement, `amount`, `detail.about`, `detail.aboutList.items[2]`, `detail.tips[1]`: FIX.**
   - Evidence (`--2`): "New lenses if your eye doctor confirms a change in your prescription". The page states no lens-replacement cycle, so "even between exam cycles" is dropped.
   - `amount`: "...plus new lenses if your eye doctor confirms a change in your prescription"
   - `about` / `items[2]`: "new lenses if your eye doctor confirms a change in your prescription"
   - `tips[1]`: "If your eye doctor confirms a change in your prescription, new lenses are covered"
   - Tests: none.

31. **bc-optical-supplement, `detail.about` and `detail.aboutList.items[3]`: FIX.**
   - Evidence (`--2`): "Necessary repairs to lenses or frames".
   - Replace "and repairs to frames and lenses" with "and necessary repairs to lenses or frames". Tests: none.

32. **bc-optical-supplement, `note`: FIX.**
   - Evidence (`--2`): "Fee schedules determine the maximum amount the ministry will pay for services. You may be responsible for any additional costs."
   - New second sentence: "You may be responsible for costs above the ministry's fee schedule, so ask the clinic first." Tests: none.

## J. bc-supplemental-bursary-students-disabilities (items 33-35)

33. **bc-supplemental-bursary-students-disabilities, `summary`: FIX.**
   - Evidence: "You may be eligible if you: are a part-time or full-time student with a permanent disability, or a persistent or prolonged disability; are enrolled at a designated public post-secondary school; are taking post-secondary level course(s)"; each amount applies "if you qualify for Canada Student Grant for Students with Disabilities".
   - Replace "Full-time and part-time students both qualify." with "You may be eligible as a full-time or part-time student if you qualify for the Canada Student Grant for Students with Disabilities." Add the same Canada Student Grant condition to `requiresNote`. Tests: none.

34. **bc-supplemental-bursary-students-disabilities, `note`: FIX.**
   - Evidence: "Students enrolled at schools other than a B.C. public schools during the 2025/26 program year who received SBSD funding for the same program at the same school, may request to continue to receive these grants".
   - New `note`: "There is a transition rule: students enrolled at a school other than a B.C. public school in 2025/26 who received this bursary for the same program at the same school may request to continue receiving it until their program is complete, or until July 31, 2029, whichever occurs first."

35. **bc-supplemental-bursary-students-disabilities, `note`: FIX.** Same sentence as item 34 ("whichever occurs first"). Tests: none for 34-35.

## K. cpp-childrens-benefit (item 36)

36. **cpp-childrens-benefit, `detail.tips[1]`: FIX.**
   - Evidence (`--1`): "Apply for the CPP children's benefit for students aged 18 to 25 in full-time or part-time attendance ... To apply online ... upload your proof of enrolment or ... ISP1402 ... Other way to apply: By mail"; renewal: "Full-time and part-time students: can renew their benefits online through their My Service Canada Account".
   - New `tips[1]`: "A student aged 18 to 25, full-time or part-time, can apply and renew online through My Service Canada Account (upload proof of enrolment or the signed ISP1402), or by mail with the paper ISP1402."
   - `steps[2]`/`steps[3]` describe the paper form and mailing only and are not wrong, but could add "or apply online" (not a DIFFERS item). Tests: none.

## Adjacent points not in the 36 items (no action taken)

- `bc-csg-services-equipment`: "assistive software" and "on top of the $2,800 Canada Student Grant" are NOT ON PAGE (per the report), not contradicted. Left.
- `bc-optical-supplement`: `$44.83` optometrist exam rate does not appear on the fetched page (it says "Up to $48.90"); NOT ON PAGE, left.
- `bc-cy-disability-benefit`: `steps[0]` ("wait to be contacted") matches "The Ministry will contact each family"; Phase 1 starts with At Home Program families, which the record does not say. Left.

Count: 36 FIX / 0 KEEP / 0 OPEN

## Fixes applied

Implementation and verification complete for items 1–36. Final results: **170/170 unit tests passed** and **233/233 listed Chromium tests passed**, zero failures or skips. `npm run check:surfaces` completed with the source-preserving baseline changes documented below. Full changed-file inventory and execution-log paths are in the appended implementation section of `REPORT-2026-10-16-batch5.md`.

### Per-item application record

| Item | Applied change |
|---|---|
| 1 | Equipment grant verification step includes the Specific Learning Disorders exception. |
| 2 | Equipment goes to Assistive Technology BC; services go to StudentAid BC. Follow-up distinguishes ordering from notification. |
| 3 | `BENEFIT_META.effort` limits Appendix 8 to applications before June 19, 2026 and names the disability status application. |
| 4 | Student disability grant steps and documents retain the form exception and conditional upload. |
| 5 | New `bcCydbAge` replaces only this record's `under19`; fixed gate retained with the birthday-month limitation documented below. |
| 6 | Summary, eligibility and requirements note use the last day of the nineteenth birthday month. |
| 7 | Both about surfaces restrict degenerative conditions to predictable decline and retain the examples. |
| 8 | Note restricts no-application transition to eligible families and retains possible requests for additional information. Province-wide wording unchanged. |
| 9 | Steps, tips and documents retain conditional eligibility and possible additional information, not guaranteed automatic transfer. |
| 10 | Direct applications use “after April 1, 2027” in step and timing text. |
| 11 | Family helpline and PAIRS contacts replace the unsupported resource line; PAIRS hours and holiday exception retained. |
| 12 | Dental eligibility and requirements note use “may be able” and preserve the three adult routes. |
| 13 | Emergency dental remains available to everyone on assistance; possible dentures retain complete teeth removal, prior six months and pain conditions. |
| 14 | Dental timing no longer equates assistance receipt with active basic coverage. |
| 15 | Both PWD about surfaces retain the one-person minimum shelter allowance of $75. Maximum and values unchanged. |
| 16 | PWD payment step uses the month following designation and the pre-eighteen birthday-month exception. |
| 17 | New `bcHomeRenoSpend` replaces only the provincial renovation gate. Full wording preserves the earlier paid-or-payable date. |
| 18 | Lift amount retains the unusual-installation excess-cost exception. |
| 19 | Equipment note and tip retain the life-threatening emergency exception to pre-approval. |
| 20 | Note considers other available resources first, names private insurance and retains possible co-funding. |
| 21 | Both about surfaces, step and document list retain prescription and/or therapist-assessment routes. |
| 22 | Both about surfaces name recreational/sports scooters, lift chairs, automatic turning beds and containment type beds. |
| 23 | MSP note uses “many”, opted-out status and permission to charge more, not “most” actually charging more. |
| 24 | MSP eligibility, requirements note and gate preserve citizenship/PR residence for the last twelve months and tax-liability conditions, with “may”. |
| 25 | All eight MSP groups are separate list items in `eligibility.note`; requirements note uses bullet lines. Gate lists all eight alternatives and has the decided short cue. |
| 26 | MSP summary, both about surfaces and route wording retain possible eligibility. |
| 27 | Tax-filing tip says eligibility may be affected, not certain lapse. |
| 28 | MSP summary and Healthy Kids tip preserve possible eligibility; tip includes hearing assistance. |
| 29 | MSP document list distinguishes CRA permission from copies required with mail applications, including reassessment. |
| 30 | Optical amount, both about surfaces and tip require the eye doctor's confirmation; unsupported between-cycle statement removed. |
| 31 | Both optical about surfaces retain necessary repairs to lenses or frames. |
| 32 | Optical note retains possible responsibility for additional costs. |
| 33 | Bursary summary and requirements note retain possible eligibility and the Canada Student Grant condition. |
| 34 | Transition note retains the same-program, same-school conditions and school scope. |
| 35 | Transition note retains “whichever occurs first”. |
| 36 | CPP student tip allows full-time and part-time online application and renewal, or paper ISP1402 by mail. |

### Gates, oracle and test changes

- `bcCydbAge`: same age predicate as `under19`, `fixed: true`, decided short cue, `who: ["you"]` to satisfy paired actor metadata. Only the children/youth disability benefit uses it.
- `bcHomeRenoSpend`: `met: () => false`, `fixed: false`, decided short cue and `who: ["you"]`. Only the provincial home renovation credit uses it.
- `bcSupplementaryBenefitsEligibility`: MSP-only in-place wording and cue change. `met` remains false and `fixed` remains false. The eight routes are possible routes, not proven matches.
- Grep of data/app usage plus comparison of evaluated gate fields against HEAD confirms `dailyLivingLimit`, `bcPwdMedical`, `bcAssistanceStatus`, `disabilityDoc`, `under19` and `qualifyingRenovationSpend` are unchanged. Other records' `requires` arrays are unchanged. No new inference of assistance receipt from `answers.bcAssistance === "pwd"` was introduced; MSP remains external even with that answer. No existing shared status predicate changed.
- Oracle `SPEC_VERSION`: `1.21.0` → `1.22.0`. Added `bcCydbAge: ageGate("16to17", "19to59")` and `bcHomeRenoSpend: external(...)`. Updated only the provincial renovation best-case explanation to paid-or-payable wording.
- Status changes: none declared. The youth gate has the same age-band outcomes, including adult “no”; the provincial renovation best case remains “almost”; MSP remains external and “almost”. The birthday-month edge case is a known model limitation, not newly claimed coverage. Existing shared-gate oracle entries remain unchanged.
- `test/factual-batch.test.js:187`: changed expected key to `bcHomeRenoSpend`, deliberately following item 17; added four batch-five regression tests covering the corrections and isolation.
- `test/requires-note-rendered.test.js`: structured note parts must survive verbatim and all eight MSP groups must render as `<li>` elements. App and static guide renderer support structured `eligibility.note` without changing plain-string notes. Both readability collectors inspect the structured parts rather than dropping them.
- Cue inventory adds only the two new gates and updates the MSP cue. First unit run: 166 tests, 160 passed, six failed (four density ratchets and two cue/renderer guards). The guards exposed missing paired age actor metadata, now supplied, and the required inventory update. Structured-note counting was then added so no prose disappears from the density audit.

### Readability and data procedure

- Asset pins: 176 → 177 in `public/index.html` and `public/styles.css`; generated guides derive all their pins from the index. Historic changelog references to 176 are retained. Added a `DATA_CHANGELOG` entry.
- `npm run gen:context` regenerated 134 entries; `npm run gen:guides` regenerated 133 benefit pages plus the index (local-supports has no static source URL).
- Surface baseline rises **only for qualifier-preserving source wording**: gate.unmet 97 → 98 (isolated paid-or-payable wording); eligibility.note 40 → 43 (denture conditions and two short source list items whose “B.C.” periods are counted as sentence breaks); detail.about remains 93; detail.aboutList.items 149 → 150 (precise equipment exclusions); summary 25 → 26 (bursary possible eligibility and grant condition); note 61 → 64 (eligible transition, emergency/co-funding exceptions, and bursary continuity/first-ending conditions). MSP's retained adjusted-income note is still counted, now as `.after`; it is not a new factual claim. No qualifier was removed to pass a readability threshold.
- Maximum-length metadata remains unchanged; no maximum-length allowance was raised. Whole-record verification dates and values are unchanged.

- Reviewer resolutions: item 5 keeps `bcCydbAge.fixed: true`. The wizard cannot distinguish a nineteen-year-old in their birthday month from other adults in its nineteen-to-fifty-nine band. That narrow eligible group remains refused by the matcher; source-facing wording includes the last day of the birthday month. Item 25 uses eight list items, not a long sentence. Item 8 keeps “province-wide by April 1, 2027” unchanged.
- Items 1–4: corrected disability verification exceptions, equipment/services routing and notifications, and the dated Appendix 8 route. Shared `disabilityDoc` stays unchanged. Cost documentation remains as the decisions direct.
- `BENEFIT_VERIFIED` remains unchanged: this batch does not claim that every fact row has been confirmed; NOT ON PAGE claims remain, including an optical amount.
