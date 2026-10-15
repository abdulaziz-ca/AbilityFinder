# Decisions — re-verification batch 6 (2026-10-16)

Every DIFFERS item 1-28 in `REPORT-2026-10-16-batch6.md` was re-checked against `research/reverify/snapshots/<record>--<n>.txt` (fetched 2026-10-15), the record in `public/data.js` (node vm) and the `REQS` gate in `public/app.js`. All 28 claims were real (no false positives). Every item is a FIX; none is KEEP or OPEN. Most FIXes are text-only; five need a new record-specific gate (items 2, 7, 14, 18, 24) and four edit the wording of a record-only gate (items 1, 3, 10, 23). After any `data.js` or `app.js` edit run `npm run gen:guides`, `npm run gen:context`, `npm run check:surfaces` and the unit and e2e suites. Run e2e alone.

Conventions (as in batch 5):
- "Record" means the field in `public/data.js`. "Gate" means `REQS.<key>` in `public/app.js`.
- "Shared gate" means other benefits use it too. I never reword or re-logic a shared gate; I specify a record-specific gate instead (`fixed: false` unless the source states a hard refusal; `met` true only when existing answers clearly establish a listed route). Non-fixed gates carry `short` and `who: ["you"]` (or the paired actors) to satisfy the cue inventory, as in batch 5.
- Replacement text uses only the snapshot's wording. Where the source hedges ("may", "up to", "including"), the hedge stays.
- BENEFIT_VALUES / BENEFIT_META are named only where they repeat the wrong claim. Elsewhere they are unchanged.
- Oracle: a new gate needs an entry in `e2e/oracle/oracle-spec.js`; bump `SPEC_VERSION` (currently `1.22.0`, so `1.23.0`) once for the whole batch.
- `answers.bcAssistance === "pwd"` is not used anywhere below as evidence of receipt of assistance.

## AISH / RAMP safety review (read first)

I read `AGENTS.md`, `e2e/aish-profiles.spec.js`, `e2e/ramp-routes.spec.js`, `test/ramp.test.js` and the AISH/RAMP assertions in `e2e/matcher-safety.spec.js`. `AGENTS.md` has no AISH/RAMP guardrail section beyond the hallucinated-AISH-facts incident pointer; the guardrails live in the specs.

Assertions that must stay true (and that the fixes below keep):
- `aish-profiles.spec.js` "never ready for any work-impact answer": AISH `almost`, never `ready`, for all five work profiles (all use `ageBand: 19to59`). Kept: items 14-16 do not touch `aishMedical`/`aishFinancial` (both stay `met: () => false`, `fixed: false`).
- `aish-profiles.spec.js` "always shows both conservative confirmation needs": exactly 2 needs, matching `/permanently prevents employment/` and `/\$100,000/`. Kept: the new age gate (item 14) is met for 19to59, so it adds no third need on these profiles.
- `aish-profiles.spec.js` "a lay work-impact answer never becomes an official verdict" and "same reviewed wording for every profile": needs text matches `/AISH decides/`, never `/you qualify|you are eligible|approved/i`; identical across profiles. Kept: the new age gate text contains none of those phrases and does not depend on the work profile.
- `matcher-safety.spec.js:810-823`, `:1147`, `:1415`: AISH `almost` with `needs` length 2 for 19to59 profiles. Kept (same reason).
- `matcher-safety.spec.js:1319-1360` "no Alberta answer combination reaches ready" includes `65plus`: AISH stays `almost` at most, never `ready`, because `aishMedical`/`aishFinancial` stay unmet.
- `ramp-routes.spec.js`: RAMP `almost`, never `ready`, never `no` for income; needs text matches `/4-wheel walker/`, `/multiple sclerosis/`, `/\$36,900/`, `/90 continuous days/` and not `/you qualify|you are eligible|approved/i`; preserved hard gates (outside Alberta, non-citizen, no home-access need) stay `no`. `test/ramp.test.js` requires the exact `requires` list and the dollar-figure set. Kept: item 3 changes wording only, adds no figure, keeps all four matched phrases, and does not touch `requires`.
- The one AISH assertion that DOES change is `matcher-safety.spec.js:895-897` (see item 14). That change is toward less exclusion (65+ becomes `almost`, never `ready`), which is the conservative direction for the end user under the rule "never exclude people the source includes".

## A. lloydminster-recreation-access (item 1)

1. **lloydminster-recreation-access, `summary`, `detail.documents[1]`, `REQS.lloydminster.unmet`: FIX (text only).**
   - Evidence (`--1`): "NOTE: The residency requirement does not apply to First Nations, Metis, and/or Inuit applicants. However, they must still meet the income eligibility." Documents: "Residency Exemption for First Nations, Metis, and/or Inuit applicants: A copy of your Certificate of Indian Status card ... A copy of your Certificate of Treaty Status card".
   - `summary`: "Income-based recreation access for eligible Lloydminster residents. The residency requirement does not apply to First Nations, Metis, and/or Inuit applicants, who must still meet the income eligibility." (The page says "eligible Lloydminster residents"; "qualifying" is close but the exception is the fix.)
   - `detail.documents[1]`: "Proof of Lloydminster residence (not required of First Nations, Metis, and/or Inuit applicants, who instead provide a Certificate of Indian Status card or a Certificate of Treaty Status card)". Keep `documents[0]` as is.
   - `REQS.lloydminster.unmet` (record-only gate; only this record uses it): "This is a City of Lloydminster program. The residency requirement does not apply to First Nations, Metis, and/or Inuit applicants, who must still meet the income eligibility."
   - Gate logic NOT changed: the wizard has no First Nations/Metis/Inuit answer, so `met`/`fixed: true` cannot be relaxed without turning every non-Lloydminster user into "almost" and breaking the oracle violation "different community -> no". Tests: none read these strings; oracle `lloydminster` entry unchanged.
   - POINT FOR YOU: the matcher still says "no" for a First Nations/Metis/Inuit person outside Lloydminster who the page says is exempt from residency. Without a wizard answer I cannot soften it safely. Adjacent (not an item): `lowIncome` is `fixed: true` but the page also admits AISH/SAID recipients and newcomers under 18 months without the income test; and `detail.documents[0]` "Proof of household income" is not required on those routes. Left alone, flag if you want a follow-up.

## B. multigenerational-home-renovation-tax-credit (item 2)

2. **multigenerational-home-renovation-tax-credit, `REQS.homeRenoCandidate` (shared with `bc-home-reno-tax-credit`): FIX (new record-specific gate).**
   - Evidence (`--1`): "The secondary unit must allow a senior or an adult who is eligible for the disability tax credit to live with a qualifying relative." The record's own `eligibility.items[1]` ("65 or older ... or 18 to 64 and eligible for the Disability Tax Credit") matches this; only the gate drifts. The gate is wrong in two ways: the any-age DTC route is wider than the source (adult only), and the gate is `fixed: true` on the user's own age/DTC, so a 40-year-old without DTC who is building a unit for a parent is refused although the source includes them (the qualifying individual need not be the person answering).
   - Do not edit `homeRenoCandidate` (the BC credit uses it; its source is separate and out of this batch). Add `REQS.mhrtcQualifyingIndividual`:
     - `short: "Check who the unit is for"`, `who: ["you"]`
     - `met: () => isSeniorAge() || (answers.dtc === "yes" && ageIn("18", "19to59", "60to64"))` (both are listed routes: a senior, or an adult eligible for the DTC)
     - `fixed: false`
     - `unmet: "The secondary unit must allow a senior or an adult who is eligible for the disability tax credit to live with a qualifying relative. Check whether the person the unit is for is one of these."`
   - `data.js`: replace `"homeRenoCandidate"` with `"mhrtcQualifyingIndividual"` in this record's `requires` (first of three; keep order).
   - Tests: `test/factual-batch.test.js:188` asserts `requires.includes("homeRenoCandidate")` for this record; change to `mhrtcQualifyingIndividual`. Add to `e2e/oracle/oracle-spec.js` (beside `homeRenoCandidate`, ~line 441): `mhrtcQualifyingIndividual: { evidence: "answers", satisfy: { set: { dtc: "yes", ageBand: "19to59" } }, violations: [{ name: "no DTC and not a senior: the unit may be for a relative", fragment: { set: { dtc: "no", ageBand: "19to59" } }, expect: "almost" }] }` and bump `SPEC_VERSION`. The existing `homeRenoCandidate` entry (still used by the BC credit) is unchanged. `matcher-safety.spec.js:1486` (MHRTC `almost`, never `ready`) still holds because `qualifyingRenovationSpend` and `mhrtcSecondaryUnit` stay unmet.
   - Status change: non-senior, non-DTC users go from `no` to `almost` for this record only. That is the intended conservative direction.
   - `REQS.mhrtcSecondaryUnit.unmet` already says "a senior or an adult eligible for the Disability Tax Credit" and stays.

## C. ramp (item 3)

3. **ramp, `detail.about`, `detail.aboutList.items[1]`, `REQS.rampMobilityRoute.unmet`: FIX (wording only).**
   - Evidence (`--1`): "You may be eligible for a RAMP grant if you are: a Canadian citizen or permanent resident ... an Albertan of any age who uses a wheelchair or a senior (65+ years) who uses a 4-wheel walker on an ongoing basis / living with a progressive neuro-degenerative disease including: multiple sclerosis ..." The page frames this as a list of "may be eligible" conditions, says "including" (not an exhaustive list), and also lists residence, tenure and income conditions. The record's "You qualify by one of three routes" and "one of the listed progressive conditions" harden both points. The page does not say the three mobility items are numbered alternatives.
   - New `aboutList.items[1]` (and the matching sentence inside `detail.about`): "You may be eligible if you are an Albertan of any age who uses a wheelchair, a senior (65+) who uses a 4-wheel walker on an ongoing basis, or living with a progressive neuro-degenerative disease including multiple sclerosis, muscular dystrophy, ALS, COPD, Parkinson's disease, Alzheimer's disease, spina bifida, spinal cord injuries or non-recovering stroke."
   - `REQS.rampMobilityRoute.unmet`: "RAMP may be for an Albertan of any age who uses a wheelchair, a senior (65+) who uses a 4-wheel walker on an ongoing basis, or someone living with a progressive neuro-degenerative disease including multiple sclerosis, muscular dystrophy, ALS, COPD, Parkinson's disease, Alzheimer's disease, spina bifida, a spinal cord injury, or non-recovering stroke." `met: () => false`, `fixed: false`, `short`, `who` and `action` unchanged.
   - Assertions touched, all kept: `ramp-routes.spec.js` "needs name both unasked official routes" (`/4-wheel walker/` and `/multiple sclerosis/` still match; `/you qualify|you are eligible|approved/i` still absent: "may be for" and "may be eligible" are not "you are eligible"); `test/ramp.test.js` dollar-figure set (no figure added or removed; `about` keeps $12,000, $24,000, $36,900, $94,500, $7,131, $1,200). RAMP stays `almost`, never `ready`, never `no` for income; hard gates untouched. `test/factual-batch.test.js:270` (`doesNotMatch(/one of three ways/)`) is about another record and is unaffected.
   - Conservatism: strictly increased (hedge restored, non-exhaustive list restored).

## D. ab-service-dog-id-card (items 4-5)

4. **ab-service-dog-id-card, `note` and `detail.tips[2]`: FIX.**
   - Evidence (`--1`): "Phone: 780-427-9136 Toll free: 310-0000 before the phone number (in Alberta)". 310-0000 is a dial-first prefix, not a team number.
   - `note` (end): "call the Service Dog Assessment team at 780-427-9136 (in Alberta, dial 310-0000 first, before the phone number to call toll free)."
   - `tips[2]`: "If you would rather use paper, phone the Service Dog Assessment team at 780-427-9136 (in Alberta, dial 310-0000 before the phone number to call toll free), and ask for a form."
   - Tests: none.

5. **ab-service-dog-id-card, `detail.about` and `detail.aboutList.items[2]`: FIX.**
   - Evidence (`--1`): "Qualified service dog teams must have an Alberta Service Dog Identification Card to ensure access to public places"; "A Service Dog Identification Card verifies that an individual and their service dog have protected public access rights in Alberta."; "Service dog owners should carry their ID with them at all times when in public."
   - Replace the sentence in `about` and `aboutList.items[2]` with: "Alberta.ca says qualified service dog teams must have the card to ensure access to public places, and that it verifies you and your service dog have protected public access rights in Alberta. Carry it with you at all times when in public." The "do not assume the card is the whole legal picture" clause is dropped because it rested on the false premise that the page is silent on access rights; the page does not list the rights in detail, and the new wording does not claim it does.
   - Tests: none.

## E. ab-special-needs-housing (items 6-10)

6. **ab-special-needs-housing, `eligibility.items[2]`, `requiresNote`: FIX.**
   - Evidence (`--1`): "evacuees from Ukraine with Canada-Ukraine Authorization for Emergency Travel are eligible to apply"; "Note: Some housing providers may have additional eligibility criteria."
   - Replace "Ukrainian evacuees with a Canada-Ukraine Authorization for Emergency Travel also qualify." with "Evacuees from Ukraine with a Canada-Ukraine Authorization for Emergency Travel are eligible to apply. Some housing providers may have additional eligibility criteria." in both fields (split into its own list item in `eligibility.items` if the density ratchet complains).
   - Tests: none.

7. **ab-special-needs-housing, `REQS.citizenPR` (shared, 8+ benefits): FIX (new record-specific gate).**
   - Evidence (`--1`): "be a Canadian citizen or permanent resident, refugee sponsored by the Government of Canada, or privately sponsored refugee whose sponsorship has broken down"; Ukraine evacuees "are eligible to apply". The record text already lists all of these; only the gate refuses them.
   - Do not edit `citizenPR`. Add `REQS.abSpecialNeedsHousingStatus`:
     - `short: "Check your status against the listed routes"`, `who: ["you"]`
     - `met: () => answers.citizenPR === true` (Canadian citizen or permanent resident is a listed route)
     - `fixed: false`
     - `unmet: "You must be a Canadian citizen or permanent resident, a refugee sponsored by the Government of Canada, or a privately sponsored refugee whose sponsorship has broken down. Evacuees from Ukraine with a Canada-Ukraine Authorization for Emergency Travel are eligible to apply. Some housing providers may have additional eligibility criteria."`
   - `data.js`: replace `"citizenPR"` with `"abSpecialNeedsHousingStatus"` in this record's `requires` (second of three).
   - Tests: add to `e2e/oracle/oracle-spec.js`: `abSpecialNeedsHousingStatus: { evidence: "answers", satisfy: { set: { citizenPR: true } }, violations: [{ name: "not a citizen or PR: other listed routes exist", fragment: { set: { citizenPR: false } }, expect: "almost" }] }`; bump `SPEC_VERSION`. No other test names this record's `requires`. `matcher-safety.spec.js:895-902` hard-no checks name only `aish`/`adult-health-benefit`/`adap`, not this record. Record stays `almost` (`abSpecialNeedsHousingPlacement` stays external).
   - Status change: non-citizen/PR users go from `no` to `almost` for this record only.

8. **ab-special-needs-housing, `detail.about`, `detail.aboutList.items[2]`: FIX.**
   - Evidence (`--1`): Community Housing "is based on 30% of a household total annual income (non-senior household)".
   - See combined text under item 9.

9. **ab-special-needs-housing, `detail.about`, `detail.aboutList.items[2]`, `detail.tips[1]`: FIX (same edit as item 8).**
   - Evidence (`--1`): Seniors apartments: "based on 30% of a households adjusted income". Community Housing: 30% of "a household total annual income (non-senior household)". Number unchanged; basis differs per program.
   - Replace `aboutList.items[2]` with two items (and mirror both sentences in `about`):
     - "Alberta.ca states a rent formula for Community Housing (30% of a household's total annual income, non-senior household) and for Seniors apartments (30% of a household's adjusted income). It does not state one for Special Needs Housing."
     - "The requirement to be functionally independent is stated for the seniors programs."
   - `tips[1]`: "The rent formulas Alberta publishes are for Community Housing (30% of a household's total annual income, non-senior household) and Seniors apartments (30% of a household's adjusted income). None is stated for Special Needs Housing, so ask the provider how rent is worked out."
   - Tests: none. Expect the `detail.aboutList.items` count ratchet to rise by one; the new item is source-wording, not padding.

10. **ab-special-needs-housing, `detail.time`, `detail.tips[0]`, `REQS.abSpecialNeedsHousingPlacement.unmet`: FIX.**
   - Evidence (`--2`): "Each housing operator may keep a waitlist when there are no current vacancies." The page says nothing about whether applying to one provider adds you to another's list.
   - `time`: "Alberta.ca does not publish a wait time. Each housing operator may keep a waitlist when there are no current vacancies."
   - `tips[0]`: "There is no single provincial application, so different providers may ask for different things. Each housing operator may keep a waitlist when there are no current vacancies; ask each provider how its list works." (The sentence "Applying to one does not put you on another's list" is removed: not on the page.)
   - `REQS.abSpecialNeedsHousingPlacement.unmet` (record-only): "Income limits are set community by community, and you apply to a local housing provider rather than to the province, so that provider confirms eligibility. Each housing operator may keep a waitlist when there are no current vacancies." `met`/`fixed`/`short`/`who` unchanged; oracle entry (external) unchanged.
   - Tests: none.

## F. adult-health-benefit (items 11-13)

11. **adult-health-benefit, `amount`: FIX.**
   - Evidence (`--1`): "Talk to your doctor, dental provider, optical provider or pharmacist to learn what is paid for by this health benefit plan"; "The Alberta Adult Health Benefit plan may cover your remaining costs" after other plans; eye exam and glasses "for adults every 2 years"; prescriptions limited to the "Interactive Drug Benefit List".
   - New `amount`: "Dental care, prescription drugs, eye exams and glasses, and more — ask your provider what is paid for".
   - `BENEFIT_VALUES` already says "prescriptions, dental, optical, ambulance and diabetes supplies — Alberta publishes no annual dollar value" and is unchanged. `summary`, `about` list the same services without "free"; unchanged.
   - Tests: `test/adult-health-benefit-value.test.js` (no `$` figure on any surface; `value.note` mentions prescriptions, dental, optical, ambulance, diabetes) still passes. No other test reads `amount`.
   - Adjacent, not DIFFERS: `detail.about` says "at no monthly premium", which the snapshot does not state (NOT ON PAGE; left, absence is not evidence). The Overview limits the benefit to low-income households "who are pregnant or have high ongoing prescription drug needs"; the record's `adultHealthGateway` gate already carries that, but `summary` ("adults in lower-income households") does not. Flag if you want it added.

12. **adult-health-benefit, `detail.steps[2]`, `detail.documents[0]`, `BENEFIT_META.effort`: FIX.**
   - Evidence (`--1`, How to apply): sign "Consent for Canada Revenue Agency to Verify Income – this gives the Alberta government permission to confirm your income with the CRA"; "If applicable, include documentation that demonstrates your high ongoing prescription drug needs, such as a pharmacy dispensing history report"; submit "by email, mail or fax". The Notice of Assessment and income documents appear only in the reassessment routes after a denial.
   - `steps[2]`: "Sign the consent for the Canada Revenue Agency to verify your income, add documentation of your high ongoing prescription drug needs if it applies, and submit the form by email, mail or fax."
   - `documents[0]`: "Signed Consent for Canada Revenue Agency to Verify Income (part of the application form)".
   - Add `documents[2]` (after the Alberta Health Care number): "If it applies: documentation of high ongoing prescription drug needs, such as a pharmacy dispensing history report".
   - Add a tip: "If your application is denied based on your income, Alberta describes a reassessment route with extra income documents; the steps depend on when you were denied."
   - `BENEFIT_META.effort`: "Form + consent for CRA to verify income".
   - Tests: none read these fields.

13. **adult-health-benefit, `detail.phone`: FIX.**
   - Evidence (`--1`): "Connect with the Health Benefits Contact Centre: Phone: 780‑427‑6848 Toll free: 1‑877‑469‑5437".
   - New `phone`: "Health Benefits Contact Centre: 780-427-6848, or toll free 1-877-469-5437". The old Alberta Supports number (1-877-644-9992) is the AISH/Income Support line and is correct on other records. The `matcher-safety.spec.js:459` assertion checks the DRES record's phone, not this one.

## G. aish (items 14-16) — see the AISH safety review above

14. **aish, `REQS.adult` (shared): FIX (new record-specific gate, modelled on the existing `adapAge`).**
   - Evidence (`--1`, General criteria): "You are at least 18 years old and not eligible to receive an Old Age Security pension." The gate says "people aged 18–64" and refuses anyone 65+ (`fixed: true`), which excludes people the source includes (a 65+ person who is not OAS-eligible).
   - Do not edit `adult` (used elsewhere; the Adult Health Benefit snapshot states no upper age, so it is NOT ON PAGE there, not a DIFFERS). Add `REQS.aishAge`:
     - `short: "Check your age and Old Age Security eligibility"`, `who: ["you"]`
     - `met: () => isAdultAge()`
     - `fixed: () => isUnder18()`
     - `unmet: "AISH is for adults aged 18 and older who are not eligible to receive an Old Age Security pension. If you are 65 or older, check whether you are eligible to receive an Old Age Security pension."`
   - `data.js`: replace `"adult"` with `"aishAge"` in the `aish` record's `requires` (first of five; keep order).
   - Assertions touched:
     - `e2e/matcher-safety.spec.js:895-897`: `const senior = ... ageBand: "65plus"; for (const id of adultProgramIds) expect(senior[id].status).toBe("no")`. Split it: `adult-health-benefit` stays `no`; `aish` becomes `almost` (and add `expect(senior.aish.status).not.toBe("ready")`), mirroring the next line for ADAP. This is the only assertion whose expected value changes.
     - `e2e/aish-profiles.spec.js` (all five tests) and `matcher-safety.spec.js:810-823`, `:1147`, `:1415`: unchanged and still pass. They use `ageBand: 19to59`, where `aishAge` is met, so AISH keeps exactly 2 needs, the `/permanently prevents employment/` and `/\$100,000/` text, `/AISH decides/`, and "never ready".
     - `matcher-safety.spec.js:1319-1360` ("no Alberta answer combination reaches ready", includes 60to64 and 65plus): AISH can show `almost` for 65plus but never `ready`, since `aishMedical` and `aishFinancial` stay `met: () => false`.
     - `e2e/oracle/oracle-spec.js`: add `aishAge` as a copy of the `adapAge` entry (satisfy `ageBand: 19to59`; `under6` -> `no`; `65plus` -> `almost`); the oracle's AISH status stays `almost`. Bump `SPEC_VERSION`. Optionally add `assert.ok(aish.requires.includes("aishAge"))` beside `test/factual-batch.test.js:96`.
   - Conservatism: increased. A 65+ person who is not OAS-eligible is no longer told "no"; they get an `almost` with an OAS-check need. No path to `ready` is opened.
   - POINT FOR YOU: AISH now shows 3 needs (not 2) for a 65+ profile. The "exactly 2 needs" assertions only use 19to59, so they pass, but if you want the 2-needs promise to hold for 65+ as well, say so and I will fold the OAS check into `aishFinancial`'s text instead.

15. **aish, `detail.tips[5]`: FIX.**
   - Evidence (`--1`): "Alberta's government will cover the cost of one Disability Income Assistance Medical Report for AISH clients who transitioned to ADAP and later choose to be assessed for AISH. This support is not time-limited and will be available whenever clients choose to access it." `--2`: "your health professional may charge you for this service. You are responsible for paying the fee ... If you are on Income Support, the cost to fill in these reports may be covered."
   - New `tips[5]`: "Your health professional may charge you a fee to complete the Disability Assistance Medical Report, and you are responsible for paying it. If you are on Income Support that cost may be covered — ask your Income Support worker. For AISH clients who transitioned to ADAP and later choose to be assessed for AISH, Alberta says it will cover the cost of one Disability Income Assistance Medical Report; this support is not time-limited."
   - Tests: none read this tip; AISH needs text is unaffected.

16. **aish, `detail.tips[8]`: FIX.**
   - Evidence (`--2`): "If you leave AISH or ADAP, you may have your file reopened quickly if: it has been less than 2 years since you got your last AISH benefits / you did not leave AISH or ADAP due to a change in your medical condition. Contact AISH or ADAP if these criteria apply to you. If these criteria do not apply, you will need to reapply."
   - New `tips[8]`: "If you leave AISH or ADAP, your file may be reopened quickly if it has been less than 2 years since you got your last AISH benefits and you did not leave AISH or ADAP due to a change in your medical condition. Contact AISH or ADAP if this applies to you; if not, you will need to reapply."
   - Tests: none.

## H. bc-clbc (items 17-19)

17. **bc-clbc, `summary`, `detail.tips[0]` (and sibling `detail.time`): FIX.**
   - Evidence (`--1`): "What funded support people get, and when, depends on how urgent their situation is and the amount of funding CLBC has at the time of the request." The "apply from age 16" claim itself is not on either snapshot (NOT ON PAGE; kept, absence is not evidence); the page's `--2` says youth already with MCFD should start transition with their MCFD worker.
   - `summary` (last sentence): "Youth can apply from age 16 to start planning for adult services. What funded support you get, and when, depends on how urgent your situation is and the funding CLBC has at the time of the request."
   - `tips[0]`: "Start at 16 — assessments and planning take time. What funded support you get, and when, depends on how urgent your situation is and the funding CLBC has at the time of your request."
   - `time`: replace "so services start on time" so it reads: "Apply from age 16; eligibility confirmation before the 19th birthday is recommended. When funded support starts depends on urgency and the funding CLBC has at the time of the request." (Same unhedged timing claim as the report's two fields; "recommended" is unsourced and is left for you to judge.)
   - Tests: `test/bc-values.test.js` checks the values entry only.

18. **bc-clbc, `REQS.developmental` (shared with the Alberta PDD record): FIX (new record-specific gate).**
   - Evidence (`--2`): "What are the criteria for the Personalized Support Initiative? An adult does not have a developmental disability but has either a: diagnosis of Fetal Alcohol Spectrum Disorder (FASD) OR a diagnosis of Autism Spectrum Disorder AND significant limitation in adaptive functioning". The PSI stream has no before-18 onset requirement, but the shared gate is `fixed: true` on `onsetBefore18 === true`, so an autism or FASD user who answered "began as an adult" is refused although the record's own `eligibility.items[1]` includes the PSI stream. (In the wizard FASD sits under "Intellectual / developmental".)
   - Do not edit `developmental` (the Alberta PDD record needs the onset rule). Add `REQS.bcClbcStream`:
     - `short: "Check which CLBC stream fits"`, `who: ["you", "program"]`
     - `met: () => (hasDisability("intellectual") || hasDisability("autism")) && answers.onsetBefore18 === true` (the Developmental Disability stream, exactly as the old gate)
     - `fixed: () => !(hasDisability("intellectual") || hasDisability("autism"))` (still a clean "no" when neither category is chosen)
     - `unmet: "CLBC supports adults with a developmental disability (significantly impaired intellectual and adaptive functioning that started before age 18). Through the Personalized Supports Initiative it also supports adults without a developmental disability who have a diagnosis of FASD, or a diagnosis of Autism Spectrum Disorder and significant limitation in adaptive functioning."`
   - `data.js`: replace `"developmental"` with `"bcClbcStream"` in the `bc-clbc` record's `requires` (third of four; keep order).
   - Tests: add to `e2e/oracle/oracle-spec.js` near `developmental`: `bcClbcStream: { evidence: "answers", satisfy: { add: { disabilities: ["intellectual"] }, set: { onsetBefore18: true } }, violations: [{ name: "onset not before 18: PSI stream may still apply", fragment: { set: { onsetBefore18: false } }, expect: "almost" }, { name: "no developmental category", fragment: { drop: { disabilities: ["intellectual", "autism"] } }, expect: "no" }] }`; bump `SPEC_VERSION`. The oracle's `bc-clbc: "ready"` stays (onset true satisfies). The existing `developmental` entry (Alberta PDD) is unchanged.
   - Status change: autism/intellectual users with onset "no" go from `no` to `almost` for `bc-clbc` only.

19. **bc-clbc, `note`: FIX.**
   - Evidence (`--2`): "Sometimes these assessments have already been done when you were in school."
   - Replace "School-era assessments can often be reused." with "Sometimes these assessments have already been done when you were in school, so ask before arranging new ones." (`steps[2]` "school-years assessments may be reusable" and `tips[1]` "a new assessment may not be needed" already carry the hedge and stay.)
   - Tests: none.

## I. bc-pharmacare-plan-g (items 20-21)

20. **bc-pharmacare-plan-g, `detail.tips[0]`: FIX.**
   - Evidence (`--1`): "Coverage is for up to 1 year and needs to be renewed if you require further coverage."
   - New `tips[0]`: "The renewal is the thing that catches people out, because coverage is for up to 1 year and needs to be renewed, so put the date somewhere you will see it and go in a month early". (`note`, `about` already say "up to one year".)
   - Tests: none.

21. **bc-pharmacare-plan-g, `detail.tips[2]`: FIX.**
   - Evidence (`--1`): "The plan covers certain psychiatric medications. Your physician or nurse practitioner ... confirms your eligibility, together with the local mental health and substance use location or Child and Youth Mental Health team." Plan Z, a separate plan on the same page, is where opioid use disorder treatment is listed.
   - New `tips[2]`: "Your prescriber confirms eligibility together with your local mental health and substance use location, or the Child and Youth Mental Health team. Plan G covers certain psychiatric medications, so ask whether a specific medication is on the plan."
   - Tests: none. (`tips[1]` already makes a similar point; if the density ratchet objects, merge them.)

## J. bc-pharmacare-plan-p (item 22)

22. **bc-pharmacare-plan-p, `detail.steps[1]`, `detail.tips[1]`: FIX.**
   - Evidence (`--1`): "Eligible patients can also receive medical supplies and equipment through their local health authority." (`about` already uses this hedge.)
   - `steps[1]`: "Ask the same clinician, or the local health authority, about the medical supplies and equipment that eligible patients can also receive through their local health authority"
   - `tips[1]`: "Eligible patients can also receive supplies and equipment through the local health authority, so ask about them separately"
   - The old "come with eligibility" and "arranged separately from the medications" are removed (neither is on the page).
   - Tests: none.

## K. bc-work-able-internship (items 23-25)

23. **bc-work-able-internship, `eligibility.items[0]`, `requiresNote`, `REQS.recentGraduate.unmet`: FIX.**
   - Evidence (`--1`): "Recent post-secondary graduate with one of the following: Two-year diploma, associate degree, bachelor's degree, master's degree or doctorate from a recognized post-secondary institution. Graduation date must be within 3 years of the Program start date".
   - `eligibility.items[0]`: "You are a recent post-secondary graduate with a two-year diploma, associate degree, bachelor's degree, master's degree or doctorate from a recognized post-secondary institution." Add a new `items[1]`: "Your graduation date is within 3 years of the program start date." (existing `items[1]` becomes `items[2]`).
   - `requiresNote`: "You must be a recent post-secondary graduate with a two-year diploma, associate degree, bachelor's degree, master's degree or doctorate from a recognized post-secondary institution, with a graduation date within 3 years of the program start date, and self-identify as having a disability. You do not have to disclose your specific diagnosis."
   - `REQS.recentGraduate.unmet` (record-only gate): "Work-Able requires a recent graduate of a recognized post-secondary institution (two-year diploma, associate degree, bachelor's degree, master's degree or doctorate) with a graduation date within three years of the program start date." Gate logic unchanged. `summary` ("recent post-secondary graduates") is a fair short form and stays; `documents[0]` "Proof of post-secondary graduation (within 3 years of program start)" stays.
   - Tests: `e2e/oracle/oracle-spec.js` `recentGraduate` entry is unchanged (logic same). Regenerate guides (`requiresNote` is compared with the guide).
   - Adjacent (not DIFFERS): the page also requires "Resident of British Columbia" and "Legally entitled to work in Canada"; the record has the `bc` gate but no entitlement-to-work line. Flag if you want an item added.

24. **bc-work-able-internship, `REQS.disabilityDoc` (shared, 12 users): FIX (new record-specific gate).**
   - Evidence (`--1`): "Self-identify as having a disability"; "Work-Able does not ask applicants to disclose their specific disability or diagnosis." The page asks for self-identification; it does not ask for professional verification.
   - Do not edit `disabilityDoc`. Add `REQS.bcWorkAbleSelfIdentify`:
     - `short: "Check that you self-identify as having a disability"`, `who: ["you"]`
     - `met: () => answers.disabilityVerified === "yes"` (a documented disability clearly satisfies self-identification; unchanged readiness behaviour)
     - `fixed: false`
     - `unmet: "Work-Able asks you to self-identify as having a disability. It does not ask you to disclose your specific disability or diagnosis, and the page does not say a professional must verify it."`
   - `data.js`: replace `"disabilityDoc"` with `"bcWorkAbleSelfIdentify"` in this record's `requires` (fourth of five; keep order).
   - Tests: add to `e2e/oracle/oracle-spec.js` beside `disabilityDoc`: `bcWorkAbleSelfIdentify: { evidence: "answers", satisfy: { set: { disabilityVerified: "yes" } }, violations: [{ name: "not yet documented, self-identification still possible", fragment: { set: { disabilityVerified: "no" } }, expect: "almost" }] }`; bump `SPEC_VERSION`. Oracle's `bc-work-able-internship: "ready"` is unchanged. `matcher-safety.spec.js:910-920` ("shared predicates unchanged") filters on `disabilityDoc`/`lowIncome` consumers and excludes none for this record, so it simply sees one fewer consumer; its `>= 6` count still holds (11 others).
   - POINT FOR YOU: I kept `met` tied to `disabilityVerified === "yes"` so no user gets more certain. The practical effect is only the cue text ("self-identify; no diagnosis disclosure"), because a user who answered "no/unsure" to documentation is still `almost`. If you want self-identification (any disability category chosen for yourself) to count as met, that would move those users from `almost` to `ready` and needs your call.

25. **bc-work-able-internship, `note`, `detail.steps[0]`: FIX.**
   - Evidence (`--1`): "Applications for the 2026/27 Work-Able cohort are now closed. Please check back in Spring 2027 for information on the 2027/28 Work-Able Accessible Employment Program intake. To be notified when the next application period opens, please contact the Work-Able team."
   - New `note`: "Intake runs annually. Applications for the 2026/27 cohort are closed — the page says to check back in Spring 2027 for information on the 2027/28 intake. Graduates keep access to internal BC Public Service job postings for 24 months after completing the program."
   - `steps[0]`: "Check the Work-Able page in Spring 2027 for information on the 2027/28 intake, or contact the Work-Able team to be notified when the next application period opens."
   - Leave `tips[0]` as is (it already says notify). Tests: none.


## L. bc-workbc-assistive-technology (items 26-27)

26. **bc-workbc-assistive-technology, `eligibility.note`, `requiresNote`: FIX.**
   - Evidence (`--1`): "self-employment (proof of regular income is required) or, volunteer work that is part of a longer-term goal of employment".
   - `eligibility.note`: "Volunteering toward a longer-term employment goal counts. Self-employment counts if you can show proof of regular income."
   - `requiresNote` last sentence: "Volunteering toward a longer-term employment goal counts, and so does self-employment with proof of regular income."
   - `detail.documents[2]` ("self-employment or volunteer role") already lists self-employment; add "(self-employment needs proof of regular income)". Tests: none.

27. **bc-workbc-assistive-technology, `note`: FIX.**
   - Evidence (`--1`): "Items not funded ...: Medical treatments and therapies / Items for daily living / Employment services and case-management supports (e.g. job coaching, employment and skills training, wage subsidies, etc.) / Supports and services that are not employment or volunteer related." Eligibility includes "volunteer work that is part of a longer-term goal of employment".
   - New `note` (first sentence): "Covers employment-related needs, including volunteer work that is part of a longer-term employment goal — not medical treatments and therapies, items for daily living, or employment services such as job coaching or wage subsidies." Keep the second sentence about regional offices unchanged.
   - Tests: the "work-related needs only" phrase has no test; `matcher-safety.spec.js:441-451` asserts exclusion wording for the Alberta DRES record, not this one.

## M. canmore-affordable-services (item 28)

28. **canmore-affordable-services, `amount`, `summary`, `note`, `detail.about`, `BENEFIT_VALUES.note`: FIX.**
   - Evidence (`--1`): the fee table lists "Regional ROAM Transit: 50% discount on adult ten-ride and adult monthly passes" (Tier 1) and "25% discount" (Tier 2). The page's transit offer is Regional ROAM Transit, not a generic local service.
   - `amount`: "Discounts on Regional ROAM Transit, recreation and community services".
   - `summary`: "A Town program that provides qualifying residents with lower-cost services, including Regional ROAM Transit and recreation."
   - `note`: "The Town lists discounts across Regional ROAM Transit, recreation and community services. Transit discount tiers differ, so confirm the current rate for your household."
   - `detail.about`: "... discounts on Town and community services, including Regional ROAM Transit and recreation."
   - `BENEFIT_VALUES.note`: "discounts on Regional ROAM Transit, recreation and community services".
   - The tier percentages (50% / 25% on adult ten-ride and adult monthly passes) are on the page but are not added; `tips[0]` already sends people to the Town page for the current rate. Tests: none.

## Test and oracle summary

- `e2e/oracle/oracle-spec.js`: add `mhrtcQualifyingIndividual` (2), `abSpecialNeedsHousingStatus` (7), `aishAge` (14), `bcClbcStream` (18), `bcWorkAbleSelfIdentify` (24); bump `SPEC_VERSION` to `1.23.0`. No existing entry is edited.
- `e2e/matcher-safety.spec.js:895-897`: AISH 65+ expectation changes `no` -> `almost` (item 14); `adult-health-benefit` stays `no`.
- `test/factual-batch.test.js:188`: expected gate key `mhrtcQualifyingIndividual` (item 2). Optional: add regression asserts for items 7, 14, 18, 24 requires lists and for the corrected wording (3, 4, 5, 13, 28).
- Cue inventory (if the repo test lists non-fixed gates): add the five new gates.
- Regenerate: `npm run gen:guides`, `npm run gen:context`, `npm run check:surfaces`; update the asset pin and `DATA_CHANGELOG` as in batch 5. Expect small bumps to the surface-density baselines for source-wording additions (items 6, 8-9, 15, 23, 26); no qualifier is to be removed to pass a threshold.
- No change to: `aishMedical`, `aishFinancial`, `rampIncomeAndResidency`, `homeAccessNeed`, any shared gate (`adult`, `citizenPR`, `disabilityDoc`, `developmental`, `homeRenoCandidate`), or any `BENEFIT_VERIFIED` date.

## Adjacent claims noticed, not DIFFERS items (left alone)

- lloydminster: `lowIncome` fixed on routes the page waives (AISH/SAID, newcomers).
- adult-health-benefit: "at no monthly premium" and the pregnancy / high-prescription-needs scope in `summary`.
- bc-work-able-internship: BC residency and legal entitlement to work not both on the record.
- bc-clbc: `eligibility.items[1]` reads "FASD or autism spectrum diagnosis plus significant adaptive-functioning limitations"; the page's wording could be read as FASD alone, or ASD plus limitations. The record is the more conservative reading; left as is. "Respite ... commonly the first service offered" and "Adults on CLBC services usually also qualify for BC PWD" are NOT ON PAGE.

Count: 28 FIX / 0 KEEP / 0 OPEN

## Fixes applied

All 28 items applied exactly as decided (new text is the text quoted in each item above; the first worker's already-finished data.js edits were checked against the decisions and kept). Asset version 177 -> 178 (`public/index.html`, `public/styles.css`), DATA_CHANGELOG entry added, `npm run gen:context` and `npm run gen:guides` run.

- 1 lloydminster-recreation-access: `summary`, `detail.documents[1]`, `REQS.lloydminster.unmet` (text only; gate logic unchanged).
- 2 multigenerational-home-renovation-tax-credit: `requires[0]` homeRenoCandidate -> `mhrtcQualifyingIndividual` (new gate).
- 3 ramp: `detail.about`, `detail.aboutList.items[1]`, `REQS.rampMobilityRoute.unmet` ("may be eligible", non-exhaustive "including").
- 4 ab-service-dog-id-card: `note`, `detail.tips[2]` (310-0000 is a dial-first prefix).
- 5 ab-service-dog-id-card: `detail.about`, `detail.aboutList.items[2]`.
- 6 ab-special-needs-housing: `eligibility.items[2]`, `requiresNote` (Evacuees from Ukraine ... eligible to apply; providers may add criteria).
- 7 ab-special-needs-housing: `requires[1]` citizenPR -> `abSpecialNeedsHousingStatus` (new gate).
- 8-9 ab-special-needs-housing: `detail.about`, `detail.aboutList.items` (rent-formula item split into two), `detail.tips[1]`.
- 10 ab-special-needs-housing: `detail.time`, `detail.tips[0]`, `REQS.abSpecialNeedsHousingPlacement.unmet`.
- 11 adult-health-benefit: `amount`.
- 12 adult-health-benefit: `detail.steps[2]`, `detail.documents[0]` + new `documents[2]`, new tip (reassessment route), `BENEFIT_META.effort`.
- 13 adult-health-benefit: `detail.phone` (Health Benefits Contact Centre).
- 14 aish: `requires[0]` adult -> `aishAge` (new gate).
- 15 aish: `detail.tips[5]`. 16 aish: `detail.tips[8]` (the AISH text exists in two detail copies in data.js; both updated).
- 17 bc-clbc: `summary`, `detail.tips[0]`, `detail.time`.
- 18 bc-clbc: `requires[2]` developmental -> `bcClbcStream` (new gate).
- 19 bc-clbc: `note`.
- 20 bc-pharmacare-plan-g: `detail.tips[0]`. 21: `detail.tips[2]`.
- 22 bc-pharmacare-plan-p: `detail.steps[1]`, `detail.tips[1]`.
- 23 bc-work-able-internship: `eligibility.items[0]` + new `items[1]`, `requiresNote`, `REQS.recentGraduate.unmet`.
- 24 bc-work-able-internship: `requires[3]` disabilityDoc -> `bcWorkAbleSelfIdentify` (new gate).
- 25 bc-work-able-internship: `note`, `detail.steps[0]`.
- 26 bc-workbc-assistive-technology: `eligibility.note`, `requiresNote`, `detail.documents[1]` ("self-employment (needs proof of regular income)").
- 27 bc-workbc-assistive-technology: `note` (first sentence).
- 28 canmore-affordable-services: `amount`, `summary`, `note`, `detail.about`, `BENEFIT_VALUES.note` (Regional ROAM Transit).

### New gates (`public/app.js`, all record-specific; shared gates adult, citizenPR, disabilityDoc, developmental, homeRenoCandidate untouched)
- `mhrtcQualifyingIndividual`: met = senior, or dtc yes and age 18/19to59/60to64; fixed false.
- `abSpecialNeedsHousingStatus`: met = citizenPR true; fixed false.
- `aishAge`: met = isAdultAge(); fixed = isUnder18() (65+ is soft, modelled on adapAge).
- `bcClbcStream`: met = (intellectual or autism) and onsetBefore18 true; fixed = neither category chosen.
- `bcWorkAbleSelfIdentify`: met = disabilityVerified "yes"; fixed false. `bcAssistance === "pwd"` is not used anywhere.
- Each has a `short` (<=80 chars, no digits) and `who`; registered in `research/207-shorts/shorts-applied.json` (required by the cue-inventory test).
- Also added `short`/`who` to the record-only gates `lloydminster` and `recentGraduate` (their longer faithful text became flagged; a cue keeps the long wording behind the expander and avoids raising the flaggedWithoutShort ratchet). Logic of both unchanged; applied inventory entries added.

### Oracle and test changes
- `e2e/oracle/oracle-spec.js`: entries for the five gates; `SPEC_VERSION` 1.22.0 -> 1.23.0.
- `e2e/matcher-safety.spec.js` (~895-900): senior `adult-health-benefit` still `no`; senior `aish` now `almost` and `not.toBe("ready")`. Only changed assertion. `e2e/aish-profiles.spec.js` unchanged and passing.
- `test/factual-batch.test.js:188`: requires gate key `mhrtcQualifyingIndividual`.
- `test/aish-wording.test.js:75` ("matcher gates are unchanged"): AISH `requires` list expects `aishAge` in place of `adult` (a direct consequence of item 14; not named in the decisions).

### Status changes
- MHRTC: non-senior, non-DTC users `no` -> `almost`.
- ab-special-needs-housing: non-citizen/PR users `no` -> `almost`.
- AISH: 65+ `no` -> `almost` (never `ready`); under 18 still `no`; 19-64 unchanged (`almost`, 2 needs).
- bc-clbc: autism/intellectual users with onset "no" `no` -> `almost`.
- bc-work-able-internship: no status change (cue text only).

### Density baseline (`research/197-info-density/dense-surface-baseline.json`, updated via `--surfaces --update-baseline`)
Because faithful source wording and the five new gate texts are longer: gate.unmet flagged 98 -> 105 (five new gates, plus lloydminster and recentGraduate now over the threshold), eligibility.note 43 -> 44, note 64 -> 66; maxChars eligibility.note 548 -> 684 and summary 361 -> 393 (bc-clbc). detail.about, aboutList.items and flaggedWithoutShort unchanged (93, 150, 1).

### Test results
`npm test` 170/170; `npm run check:surfaces` passes; `npx playwright test --project=app-chromium --workers=1` 233 passed of 233 listed.

## Codex review round

Sources: `research/reverify/snapshots/bc-clbc--1.txt` and `bc-clbc--2.txt` only. These corrections supersede the original batch 6 decisions above where they conflict.

1. **HIGH — `REQS.bcClbcStream`:** Set `met: () => false`. Category selection and onset do not establish significantly impaired intellectual AND adaptive functioning (DD), or the significant day-to-day help required for ASD/FASD (PSI). Preserve `fixed`, `short`, and `who`; leave shared `developmental` unchanged. Mark the oracle gate external and change `bc-clbc` best case from `ready` to `almost`; bump oracle spec to 1.26.0, preserving batch 7 fixes.
2. **MEDIUM — gate unmet text:** Explicitly attach significant day-to-day help / adaptive-function limitations to both FASD and autism, consistent with snapshot 2's introductory eligibility wording and the record.
3. **LOW — `bc-clbc.detail.time` only:** Remove the age-16 instruction and unsupported recommendation to confirm eligibility before the 19th birthday. Retain snapshot 1's contingency on urgency and available CLBC funding. Leave age-16 text elsewhere untouched.

The oracle persona builder now applies optional category hints on external gates and exercises their declared fixed-refusal violations. The CLBC category hint is not evidence of full eligibility; the redundant onset-only violation is removed because the external gate is already unmet in the best case.

Validation: `npm run gen:context` succeeded (134 entries); `npm run gen:guides` succeeded (133 benefit pages plus index and sitemap); `npm test` passed 170/170; `npm run check:surfaces` passed; final whole-project `npx playwright test --project=app-chromium --workers=1` passed **233 of 233 listed**, zero failures. Earlier runs exposed and resolved oracle persona issues; unrelated browser timeouts cleared on the final whole-project rerun. `git diff --check` passed.

Asset version remains 179. No commit. Existing batch 7 review changes are preserved.
