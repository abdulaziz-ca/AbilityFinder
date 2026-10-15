# Decisions — re-verification batch 7 (2026-10-16)

All 18 DIFFERS items (partA 1-9, partB 1-9) were re-checked against `research/reverify/snapshots/<record>--<n>.txt` (fetched 2026-10-15), the record in `public/data.js` and the gate in `public/app.js`. All 18 claims are real. Result: 17 FIX, 1 KEEP (partA 3), 0 OPEN.

Conventions (as in batch 6): "shared gate" means other benefits use it; I never reword or re-logic a shared gate and instead add a record-specific gate (`fixed: false` unless the source states a hard refusal the wizard can express; `met` true only when existing answers clearly establish a listed route; `answers.bcAssistance === "pwd"` is never evidence of receipt). Replacement text uses only the snapshot's wording and keeps its hedges. New gates carry `short` (<=80 chars, no digits) and `who`, are listed in `research/207-shorts/shorts-applied.json`, and get an oracle entry (SPEC_VERSION 1.23.0 -> 1.24.0).

## Part A

**A1 cochrane-connect-card, documents: FIX (text).**
- Evidence (`--1`): "you must book an appointment with a resource worker and provide the following documentation for all adults in the household. Financial information ... Proof of address".
- `note` (end), `detail.steps[1]`, `detail.documents`: add "for all adults in the household". New `documents`: "Proof of income (for all adults in the household)", "Proof of Cochrane address (for all adults in the household)".

**A2 cochrane-connect-card, operator: FIX (text).**
- Evidence: page title "Cochrane Connect Card | Town of Cochrane"; REQS.cochrane already says Town.
- `summary` "A Town card ..."; `steps[0]` "the Town’s Connect Card page"; `tips[0]` "the Town also describes situational need".

**A3 cpp-disability, REQS.workingAge: KEEP.**
- Evidence (`--1`): "if you are over 18 and under 65 years old and unable to work because of a disability". "Over 18" is ambiguous (older than 18, or an adult aged 18 and over). `workingAge` is shared (CDB and others); the current gate includes 18-year-olds, so it never excludes anyone the page might include. Not clearly wrong; no change. Nothing to touch.

**A4 dtc, route wording: FIX (steps[0], steps[3] only).**
- Evidence (`--1`): "As of July 14, you must send your DTC application to the CRA using the digital DTC application form or by mail. You may not send DTC forms through the “submit documents” section of your CRA account." (`--2`: "Print and fill out by hand").
- `steps[0]`: "Use the digital DTC application form, or print Form T2201 to fill out by hand and send by mail."
- `steps[3]`: "Send it to the CRA using the digital DTC application form or by mail. The CRA says you may not send DTC forms through the “submit documents” section of your CRA account." The unsupported "for the fastest processing" is dropped with the My Account route.
- Guardrails (AGENTS.md; e2e): gates `prolonged`/`certifier` and `requires` untouched, so DTC stays unresolved and never "ready". Assertions touched: none. I grepped `e2e/` and `test/`: no assertion reads the DTC `steps`, "My Account" or "fastest processing" text (dtc assertions are in matcher-safety, misfiled-gates, requirements-layout, quick-wins, persistence*, oracle, all about gates/ids/progress). Generated `public/guides/dtc.html` and `src/benefits-context.js` regenerate.

**A5 excise-gasoline-tax-refund, REQS.vehicleDisability: FIX (new record-specific gate `exciseMobilityImpairment`).**
- Evidence (`--1`): "If you have a permanent mobility impairment and cannot safely use public transportation, you can ask for a refund". Shared `vehicleDisability` (also BC fuel tax) accepts physical, vision or transit-barrier answers and is `fixed` on the functional-need answer.
- The record text already matches the page; only the gate drifts. A hard "physical category only" gate would exclude people the page includes (stroke, brain injury, chronic illness, "something else" users with a permanent mobility impairment), so: `met: () => false`, `fixed: false` (the wizard cannot establish permanence or transit safety).
- `unmet`: "This refund is for people with a permanent mobility impairment who cannot safely use public transportation."; `short`: "Check whether your mobility impairment is permanent and affects transit".
- `requires`: replace `vehicleDisability` with `exciseMobilityImpairment` (certifier gate kept). Status change: users with no physical/vision/transit answer go `no` -> `almost` for this record only.

**A6 fortsask-access, REQS.lowIncome: FIX (new gate `fortsaskIncomeRoute`).**
- Evidence (`--1`): "The applicant must be receiving funding from: an approved Government program (such as: AISH, CPPD, FSCD or Income Support); OR have a combined household income at or under the amounts listed on the Statistics Canada Low Income Thresholds."
- The wizard's "lower income (under ~$35,000)" does not clearly establish the City's thresholds (1 person $26,246, up to $69,647 for 7+), and nothing asks about AISH/CPPD/FSCD/Income Support receipt. So: `met: () => false`, `fixed: false`.
- `unmet`: "The applicant must be receiving funding from an approved Government program (such as AISH, CPPD, FSCD or Income Support), or have a combined household income at or under the Statistics Canada Low Income Thresholds listed on the City’s page. Proof of income verification is required."; `short`: "Check your income route (approved program or income limit)".
- `requires` ["fortsask","fortsaskIncomeRoute"]. Status change: `ready` -> `almost` for matching low-income users; `no` -> `almost` for higher-income users (they may be on an approved program). Conservative direction; shared `lowIncome` unchanged.

**A7 leduc-subsidies, transit scope: FIX (text).**
- Evidence (`--1`): "Provides half-price monthly bus passes. Client’s choice between local, commuter or LATS monthly pass."
- `amount`: "Half-price monthly bus pass of your choice (local, commuter or LATS)"; `summary`: "Financial-navigation support that can provide a half-price monthly bus pass (your choice of local, commuter or LATS pass)."; `note`, `BENEFIT_VALUES.note` ("half-price monthly bus pass of your choice (local, commuter or LATS)"); `tips[0]`: "You choose a local, commuter or LATS monthly pass. Ask specifically about LATS if you use specialized transit."; `about`: "reduced transit" -> "a half-price monthly bus pass".

**A8 leduc-subsidies, recreation closed: FIX (text).**
- Evidence (`--1`): "all Recreation Assistance Program funding for 2026 has been fully allocated. As a result, the program is now CLOSED and will reopen for new applications in January 2027."
- The page does not describe a "free annual Leduc Recreation Centre membership" (NOT ON PAGE, kept). It is not presented as available: `summary` and `note` say: "The Recreation Assistance Program is now CLOSED and will reopen for new applications in January 2027." `note` keeps the membership claim only as part of that program line. `amount` no longer promises recreation. `about`/`tips` carry the closure. No status change (the transit subsidy stays open).

**A9 okotoks-fee-assistance, REQS.okotoks: FIX (new gate `okotoksResidency`).**
- Evidence (`--1`): "To be eligible for Recreation Fee Assistance, you must live in the Town of Okotoks or Foothills County and meet the income guidelines".
- The city question asks where you live "in or near" and offers no Foothills County option, so a county resident may have picked Okotoks, High River, Calgary or "Other". `met: city === "Okotoks"`, `fixed: false`.
- `unmet`: "You must live in the Town of Okotoks or Foothills County."; `short`: "Check that you live in the Town of Okotoks or Foothills County". `requires` ["okotoksResidency","lowIncome"]. Status change: other Alberta communities `no` -> `almost`. The old `okotoks` gate had no other users, so it and its oracle entry are removed (the oracle fails on orphaned gates).

## Part B

**B1 parking-placard, 50 metres: FIX (text).** Evidence (`--2`): "can’t walk more than 50 metres (164 feet)". `note`: "For people who can’t walk more than 50 metres (164 feet), or ..." ("about" removed).

**B2 parking-placard, vision: FIX (text).** Evidence (`--2`): "a loss of vision that substantially limits safe and independent mobility while navigating parking areas ... you may be eligible". `note`: "... or who have a loss of vision that substantially limits safe and independent mobility while navigating parking areas. The page says you may be eligible." (gate `abPlacardMobility` already matches.)

**B3 sparc-parking-permit, permit types: FIX (text).** Evidence (`--1`): "There are two (2) types of parking permits for people with disabilities: Permanent Parking Permit: Valid for a period of three (3) years, and renewable. Temporary Parking Permit: Valid for ... one (1) month to twelve (12) months, and not renewable." `about` and `aboutList.items[0]`: "Two types exist: permanent (valid 3 years, renewable) and temporary (1 to 12 months, not renewable — reapply if still needed)." Conditional permit removed (the page states two types and names none).

**B4 sparc-parking-permit, vision route: FIX (new gate `bcParkingMobility`).**
- Evidence (`--1`): "People with mobility limitations are entitled to a permit"; users "use crutches, a cane or other mobility aid, or need to park close to a building entrance because their health prevents them from walking very far". Vision loss is never mentioned (the 50 m figure is also absent). Shared `mobility` (also Ontario) is unchanged.
- `met: physical and canWalkFar === false`, `fixed: false` (mobility limitations arise under other categories). `unmet`: "People with mobility limitations are entitled to a permit, for example people who use a wheelchair, crutches, a cane or other mobility aid, or whose health prevents them from walking very far."; `short`: "Check that a mobility limitation applies".
- `requires` ["bc","bcParkingMobility"]. Status change: vision-only users `ready` -> `almost`; users with no physical answer `no` -> `almost`.

**B5 grt-affordable-transit, online route: FIX (steps).** Evidence (`--1`): "The Affordable Transit Program online application is temporarily unavailable. You can still apply or receive help between 8:30 and 4:30 Monday to Friday by Calling Employment and Income Services at 519-883-2100 option 1 / Contacting your Ontario Works caseworker directly / Visiting a Community Services Welcome Space at 150 Main St. Cambridge, 20 Weber St., Kitchener 99 Regina St. S., Waterloo ... Applications received during this interruption will be processed within 7 days." The URL is not on the page; kept (absence is not evidence). `steps[2]`: "Apply online at <url> when the online application is available. The GRT page says it is temporarily unavailable." New `steps[3]`: "While it is unavailable you can still apply or get help from 8:30 to 4:30, Monday to Friday: call Employment and Income Services at 519-883-2100 option 1, contact your Ontario Works caseworker directly, or visit a Community Services Welcome Space (150 Main St. Cambridge, 20 Weber St. Kitchener, 99 Regina St. S. Waterloo)." and `steps[4]` "Applications received during the interruption are processed within 7 days." Old welcome-space step kept last.

**B6 grt-affordable-transit, documents: FIX.** Evidence (`--1`): "If you were a student in the last calendar year, you will need to provide proof of completion/graduation documents." and "If you are new to Canada in the current calendar year, you can submit one of the following: PR or citizenship card / Refugee protection document / Verification of claim / Work permit / Confirmation of permanent residence". Added two `documents` entries with exactly those conditions; no claim about which route they replace.

**B7 grt-mobilityplus, professionals: FIX (text).** Evidence (`--1`): "Appropriate professionals could include (but are not limited to): Physician ... Other professionals approved by the Region". `tips[0]`: "Appropriate professionals could include (but are not limited to) a physician, nurse practitioner, ..., or other professionals approved by the Region."; `documents[1]`: "Part B Health/Disability Professional form, completed by a health/disability professional who can speak to your disability and ability to take conventional transit".

**B8 grt-mobilityplus, REQS.transitBarrier: FIX (new gate `waterlooMobilityPlusTransit`).**
- Evidence (`--1`): "Unconditional - A person with a disability that prevents them from using conventional transit. Conditional - ... environmental or physical barriers limit their ability to consistently use conventional transit ... Temporary - ... prevents them from using conventional transit." "Without assistance" is not on the page. Shared `transitBarrier` (BC handyDART etc.) unchanged.
- `met: hasFunctionalNeed("transitBarrier")` (the answer "cannot use regular public transit ... for some or all trips" matches the conditional/unconditional routes; kept as today), `fixed: false` (the other eligibility types are not asked). `unmet`: "MobilityPLUS eligibility may be unconditional (a disability prevents you from using conventional transit), conditional (environmental or physical barriers limit your ability to consistently use it) or temporary (a temporary disability prevents you from using it)."; `short`: "Check which MobilityPLUS eligibility type fits"; `who` ["you","professional"].
- `requires` ["waterlooUrban","waterlooMobilityPlusTransit"]. Status change: users without the transit answer `no` -> `almost`.

**B9 grt-taxi-coupons, eligibility: FIX (text; gate wording).** Evidence (`--1`): "MobilityPLUS customers who live and travel in Cambridge, Kitchener and Waterloo can purchase taxi coupons ... customers on MobilityPLUS North Dumfries or Kiwanis Transit services are not eligible for taxi coupons." `eligibility.items`: "You are a MobilityPLUS customer who lives and travels in Cambridge, Kitchener and Waterloo", "You are not a MobilityPLUS North Dumfries or Kiwanis Transit customer (they are not eligible for taxi coupons)". `REQS.mobilityplusRegistered` is record-only, so its `unmet` is reworded in place: "You need to be registered with MobilityPLUS. MobilityPLUS customers who live and travel in Cambridge, Kitchener and Waterloo can buy taxi coupons; customers on MobilityPLUS North Dumfries or Kiwanis Transit services are not eligible." Logic unchanged (`met` false, `fixed` false).

## Procedure
Asset version 178 -> 179 everywhere pinned; DATA_CHANGELOG entry; `npm run gen:context`; `npm run gen:guides`; `npm test`; `npm run check:surfaces`; `npx playwright test --project=app-chromium --workers=1` alone.

## Fixes applied

- Records edited in `public/data.js`: cochrane-connect-card (A1, A2), dtc (A4: `steps[0]`, `steps[3]` only), excise-gasoline-tax-refund (A5, requires), fortsask-access (A6, requires), leduc-subsidies (A7, A8: amount, summary, note, about, steps, tips, `BENEFIT_VALUES.note`), okotoks-fee-assistance (A9, requires), parking-placard (B1, B2: note), sparc-parking-permit (B3 about + aboutList.items[0]; B4 requires), grt-affordable-transit (B5 steps, B6 documents), grt-mobilityplus (B7 tips[0], documents[1]; B8 requires), grt-taxi-coupons (B9 eligibility.items). A3 cpp-disability: KEEP, no change.
- New gates in `public/app.js` (all record-specific, `short` + `who`, all `fixed: false`): `waterlooMobilityPlusTransit`, `exciseMobilityImpairment` (met false), `fortsaskIncomeRoute` (met false), `okotoksResidency`, `bcParkingMobility`. Reworded record-only `mobilityplusRegistered` (also given `short`/`who`). Removed dead `okotoks`. Shared `transitBarrier`, `vehicleDisability`, `mobility`, `lowIncome`, `workingAge` untouched.
- `research/207-shorts/shorts-applied.json`: six entries added.
- `e2e/oracle/oracle-spec.js`: SPEC_VERSION 1.23.0 -> 1.24.0; entries for the five gates; `fortsask-access` expected status `ready` -> `almost`; `okotoks` entry removed.
- Status changes: excise (no physical/vision/transit answer) `no` -> `almost`; fortsask-access `ready` -> `almost` (and higher-income `no` -> `almost`); okotoks-fee-assistance other communities `no` -> `almost`; sparc-parking-permit vision-only `ready` -> `almost`, no physical answer `no` -> `almost`; grt-mobilityplus without the transit answer `no` -> `almost`. No test assertion changed.
- Asset version 178 -> 179 (`public/index.html`, `public/styles.css`, regenerated guides); `DATA_CHANGELOG` entry; `npm run gen:context` and `npm run gen:guides` rerun.
- Density baseline updated (`--surfaces --update-baseline`) because faithful wording is longer: gate.unmet flagged 105 -> 109, detail.about 93 -> 94, note 66 -> 67. eligibility.note 44, aboutList.items 150, summary 26, flaggedWithoutShort 1 unchanged (the summary maxChars baseline of 393 was stale; the real maximum is 361).
- Results: `npm test` 170/170; `npm run check:surfaces` passes; `npx playwright test --project=app-chromium --workers=1` 233 passed of 233 listed (first run had one failure, an orphaned `okotoks` oracle entry, fixed).

## Codex review round

These corrections supersede the corresponding initial decisions above; evidence remains exclusively the saved snapshots.

1. **HIGH — Waterloo MobilityPLUS (B8):** `waterlooMobilityPlusTransit.met` is now always false; `fixed: false`, short, who and unmet wording are unchanged. The answer “Cannot use regular public transit without assistance” does not establish the snapshot’s prevention or consistent-use-barrier routes. Shared `transitBarrier` is unchanged. Oracle evidence is now external; `grt-mobilityplus` best case changes from `ready` to `almost`, including users selecting the transit-barrier answer.
2. **MEDIUM — Okotoks residency (A9):** `okotoksResidency.met` is now always false, retaining `fixed: false` and all wording. Selecting a city “in or near” cannot establish residence in the Town of Okotoks or Foothills County. Oracle evidence is now external; `okotoks-fee-assistance` best case changes from `ready` to `almost`, including low-income users selecting Okotoks.
3. **MEDIUM — Leduc recreation (A8):** Removed the unsourced free annual Leduc Recreation Centre membership association from the note. It now states that all Recreation Assistance Program funding for 2026 has been fully allocated and the program “will reopen for new applications in January 2027”. No other field in the record, BENEFIT_VALUES or BENEFIT_META repeats the membership claim. Transit eligibility/status is unchanged.

Oracle SPEC_VERSION is 1.25.0; both explicit best-case status expectations are now `almost`. Asset version stays 179. Regenerated context and guides (134 context entries; 133 benefit pages plus guide index). Validation: `npm test` **170 passed / 170**; `npm run check:surfaces` **passed**, with unchanged flagged counts; whole `app-chromium` project **233 passed / 233 listed**, zero failures (`--workers=1`). No commit or push.
