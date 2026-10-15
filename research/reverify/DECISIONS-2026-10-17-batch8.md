# Decisions — re-verification batch 8 (2026-10-17)

DIFFERS items 1-18 in `REPORT-2026-10-17-batch8.md` were re-checked against `research/reverify/snapshots/<record>--<n>.txt` (fetched 2026-10-15), the record in `public/data.js` (node vm) and the `REQS` gates in `public/app.js`. Result: 15 FIX, 2 KEEP, 1 OPEN. Most FIXes are text-only; one needs a new record-specific gate (item 4). After any `data.js` or `app.js` edit run `npm run gen:guides`, `npm run gen:context`, `npm run check:surfaces` and the unit and e2e suites. Run e2e alone.

Conventions (as in batch 6):
- "Record" means the field in `public/data.js`. "Gate" means `REQS.<key>` in `public/app.js`.
- Replacement text uses only the snapshot's wording. Where the source hedges ("may", "up to", "should"), the hedge stays.
- BENEFIT_VALUES / BENEFIT_META are named only where they repeat the claim.
- A shared gate is never reworded; a record-specific gate replaces it in `requires`.
- Oracle: a new gate needs an entry in `e2e/oracle/oracle-spec.js`; bump `SPEC_VERSION` (currently `1.26.0`, so `1.27.0`) once for the batch.
- `test/benefit-meta-complete.test.js` only needs `effort` and `wait` to be non-empty strings. No test or e2e assertion reads the text of any field changed below, except where named.

## A. odsp (item 1)

ODSP guardrails I checked: `e2e/matcher-safety.spec.js:1549-1557` (ODSP `almost` for an Ontario adult, `no` for Alberta; never `ready`), `e2e/requirements-layout.spec.js:182-198` (inline requirement heading), `e2e/oracle/oracle-spec.js:604-605` (`odspMedical`, `odspFinancial` external). `odspMedical` and `odspFinancial` stay `met: () => false`. The fix below touches only `BENEFIT_META.odsp.effort`; none of these assertions read it. Gates, `requires`, `eligibility`, the prescribed-class wording in `note`, `about`, `steps[4]` and `tips[3]` are unchanged (they already carry the route).

1. **odsp, `BENEFIT_META.effort`: FIX.**
   - Evidence (`--1`, Step 4): "If you are a member of a prescribed class , you do not have to complete this step." and "If you are financially eligible for ODSP , you will receive a paper Disability Determination Package ( DDP )."
   - New `effort`: "Online, phone or in-person application, plus a Disability Determination Package unless you are in a prescribed class".
   - Tests: none read `effort`.

## B. passport-program (items 2-3)

Snapshot facts (`--1`): "receive $5,665 per year in annual Passport funding"; "Apply to receive more than $5,665"; "All Passport recipients receive the minimum funding amount of $5,665 annually"; "You will receive at least $5,665 in your first year, no matter when you start"; "funding above $5,665, up to a maximum of $45,604"; "we might provide additional funding as it becomes available". The page gives no fiscal-year or calendar-year label on either figure: only "per year", "annually" and "first year". The record likewise names no year, so none is added. The half-year first-year rule (accept April-September full 12 months; October-March a 6-month amount) is unchanged and still correct.

Every field that repeats the figures (all in `public/data.js`; `BENEFIT_VALUES` is line ~170, the record ~2420-2465): `amount`, `note`, `detail.about`, `detail.aboutList.items[2]` and `[3]`, `detail.steps[2]` and `[3]`, `detail.tips[1]` and `[2]`, `BENEFIT_VALUES["passport-program"].note`. `summary`, `eligibility`, `documents` and `BENEFIT_META` carry no figure. `public/guides/passport-program.html` and the context files regenerate from these.

2. **passport-program, minimum $5,500 -> $5,665: FIX (text only).** Replace "$5,500" with "$5,665" in:
   - `amount`: "$5,665 a year, up to $45,604 based on assessed need" (covers item 3 too).
   - `note`: "Every Passport recipient receives at least $5,665 a year. More than that is possible, up to $45,604, but it depends on your assessed level of need and on funding becoming available — Passport agencies keep a waiting list for the additional amounts."
   - `detail.about` last sentence: "All recipients receive a minimum of $5,665 a year, and it is possible to receive more, up to a maximum of $45,604, based on assessed need."
   - `aboutList.items[2]`: "Every recipient receives a minimum of $5,665 a year."
   - `steps[2]`: "Once confirmed, DSO connects you with your local Passport agency for $5,665 a year in funding"
   - `steps[3]`: "To seek more than $5,665, complete an application package so DSO can fully assess your needs; your information then goes to your local Passport agency"
   - `tips[1]`: "If you are approved for more than $5,665 and accept between April and September, ..." and "Either way you receive at least $5,665 in your first year." (rest unchanged)
   - `tips[2]`: "...waiting to receive additional funding above $5,665."
   - `BENEFIT_VALUES.note`: "$5,665 a year minimum; up to $45,604 based on assessed need"
   - Tests: none read these figures (`e2e/matcher-safety.spec.js:1610-1621` check status only).

3. **passport-program, maximum $44,275 -> $45,604: FIX (text only).** Same edit set as item 2; the maximum appears in `amount`, `note`, `detail.about`, `aboutList.items[3]` ("More is possible, up to a maximum of $45,604, based on your assessed level of need and as funding becomes available."), and `BENEFIT_VALUES.note`. Keep "based on assessed need" and "as funding becomes available"; the source says "might provide additional funding as it becomes available".

## C. toronto-fair-pass (items 4-7)

4. **toronto-fair-pass, `REQS.adult` (shared): FIX (new record-specific gate).**
   - Evidence (`--1`, twice): "Be between 20 and 64 years of age*" and "*If you are between the ages of 13 and 19, or 65 and up, see TTC Fare Types for details about youth, student and seniors fares." The record's own `eligibility.items[0]` ("Between 20 and 64 years of age") and `eligibility.note` are already correct; only the matcher gate differs. `adult` (`isAdultAge`: bands 18, 19to59, 60to64; unmet "This is for people aged 18–64.") treats 18-year-olds as a match, and the page excludes them.
   - Do not edit `adult` (shared). Add `REQS.torontoFairPassAge`:
     - `met: () => ageIn("19to59", "60to64")`
     - `fixed: () => true` (the page states a hard rule: "Applicant must: Be between 20 and 64")
     - `unmet: "Fair Pass lists applicants as between 20 and 64 years of age. If you are 13 to 19 or 65 and over, the City points you to the TTC's youth, student and seniors fares instead."`
   - `data.js`: in the `toronto-fair-pass` record replace `"adult"` with `"torontoFairPassAge"` in `requires` (second of three; keep order).
   - The band `19to59` cannot separate 19-year-olds, whom the page excludes, from 20-year-olds, whom it includes. I keep that band as met, so nobody the page includes is excluded; the record's `eligibility.items[0]` already says 20 to 64 for the person to check.
   - Status changes: an 18-year-old in Toronto with low income goes from `ready` to `no`; 65+ stays `no`; 19-64 unchanged.
   - Oracle (`e2e/oracle/oracle-spec.js`): add `torontoFairPassAge: { evidence: "answers", satisfy: { set: { ageBand: "19to59" } }, violations: [ { name: "age 18: page says 20 to 64", fragment: { set: { ageBand: "18" } }, expect: "no" }, { name: "senior", fragment: { set: { ageBand: "65plus" } }, expect: "no" } ] }`. Bump `SPEC_VERSION` to `1.27.0`.
   - Tests touched: `e2e/matcher-safety.spec.js:1719` ("Toronto municipal programs are city-gated") uses `ageBand: "19to59"` and still gets `ready`. No other test names the gate. If the oracle's best-case profile for `toronto-fair-pass` (`oracle-spec.js:819`, `ready`) uses band 18, change it to 19to59.
   - Adjacent, not changed: `toronto-fair-pass` shares `lowIncome` (`income === "low"`, "Under ~$35,000", `fixed: true`). The page income limits go up to $71,756 for 10 people, so a larger household above that wizard band is refused although the source includes it. This is an app-wide approximation, not a DIFFERS; flag only.

5. **toronto-fair-pass, `eligibility.items[3]`: FIX (text only; reading chosen to exclude nobody).**
   - Evidence (`--1`): "Have a total after tax family income (for all family members over the age of 18) below 75 per cent of the ... LIM-AT"; but "**Total annual net income will only be calculated for family members aged 20 to 64." and, for phone applications, "Provide income information for yourself and all immediate family members aged 20 to 64". The page contradicts itself on who is counted.
   - I choose the 20-to-64 reading as the one stated in the calculation rule. It counts less income, so it does not turn away a household that the page includes. The text keeps the other wording visible so nobody relies on one reading.
   - New `items[3]`: "Total after-tax family income below 75% of the Low-Income Measure After-Tax threshold. The City counts income for family members aged 20 to 64 (one line of its page says over 18)."
   - Add to `eligibility.note`: "The City's income table says income is only calculated for family members aged 20 to 64, while another line says family members over 18; ask the City who is counted."
   - `steps[1]` ("proof of income for yourself and every family member 18 or older") is unchanged: the page says documents for "any family members 18 years old or older" in one place and "aged 20 to 64" in another; asking for more documents is the conservative reading and the page does not forbid it.
   - Tests: none.

6. **toronto-fair-pass, `detail.tips[3]`: FIX (text only).**
   - Evidence (`--1`): intro says "Existing clients do not need to reapply and should go to the Using and Maintaining Your Discount section"; detailed rules say "Some Fair Pass clients will be required to submit a new application", "If you are actively receiving ... (OW), ... (ODSP) or ... (CCFS) benefits, you may not need to reapply", "If you are not actively receiving these benefits, you may be required to submit a new application", and "will be notified 45 days before their discount expiry date".
   - New `tips[3]`: "Some clients must reapply. If you actively receive Ontario Works, ODSP or Child Care Fee Subsidy, you may not need to; if you do, the City contacts you 45 days before your discount expires. From August 1, 2026 eligibility is reviewed annually."
   - `note` (already "reviewed for renewal ... you will be contacted") unchanged.
   - Tests: none.

7. **toronto-fair-pass, `detail.tips[0]`: FIX (text only).**
   - Evidence (`--1`): "Residents currently receiving assistance from Ontario Works (OW), Emergency Assistance or Ontario Disability Support Program (ODSP) meet the financial eligibility criteria". The no-proof list is different: "You do not need to provide any proof of income documents if you are receiving financial support from any of the following programs: Ontario Works (OW) Ontario Disability Support Program (ODSP) Toronto Children's Services Child Care Fee Subsidy". Emergency Assistance is not on the no-proof list.
   - New `tips[0]`: "Receiving Ontario Works, Emergency Assistance or ODSP means you meet the financial criteria. You do not need income documents if you receive Ontario Works, ODSP or Child Care Fee Subsidy; Emergency Assistance is not on that list, so you may need to give proof of income."
   - `summary`, `aboutList.items[4]`, `eligibility.note`, `eligibility` and `steps[1]` / `documents[3]` are unchanged: they say "meet the income test" or list OW/ODSP/CCFS, which the page supports.
   - Tests: none.

## D. toronto-welcome-policy (items 8-9)

8. **toronto-welcome-policy, `detail.documents[0]`, `detail.steps[1]`, `BENEFIT_META.effort`: FIX (text only).**
   - Evidence (`--1`): "You do not need to provide any proof of documents if you are receiving financial support from the following programs: Ontario Works (OW) Ontario Disability Support Program (ODSP) Toronto Children's Services Child Care Fee Subsidy"; "Provide one of the following as proof of income: Income documents for you and any family members 18 years old or older ... OR Program identification number for recipients of: Ontario Works (OW) ... (ODSP) ... Child Care Fee Subsidy"; "Program identification number if you are an active recipient of ... OR Proof of documentation (income, identification and address)".
   - `documents[0]`: "Proof of income for each family member 18 or older — or your program identification number if you receive Ontario Works, ODSP or Child Care Fee Subsidy"
   - `steps[1]`: "Gather proof of income for each family member 18 or older, or your Ontario Works member ID, ODSP member ID or Child Care Fee Subsidy household or client file number instead"
   - `BENEFIT_META.effort`: "Application with proof of income for each family member 18 or older, or an OW, ODSP or Child Care Fee Subsidy ID"
   - `documents[1]` ("Documents for each family member included in the application") is unchanged. The page also lists proof of identity and address "if required"; not a DIFFERS, left.
   - Tests: none.

9. **toronto-welcome-policy, `BENEFIT_META.wait`: FIX (text only).**
   - Evidence (`--1`, Timelines & Approvals): "You will receive an email notification regarding the outcome of your application within 5 business days"; "Processing times for paper applications can take up to 8 weeks and any missing documents will increase the processing time of your application."
   - New `wait`: "Email on the outcome within 5 business days; paper applications can take up to 8 weeks; missing documents add time".
   - Tests: `test/benefit-meta-complete.test.js` needs a non-empty string only.

## E. trillium-drug-program (items 10-11)

10. **trillium-drug-program, `summary`, `detail.about`, `detail.aboutList.items[2]`: FIX (text only).**
   - Evidence (`--1`): overview: "your Trillium Drug Program coverage begins and you will only pay up to $2 for each drug that is filled or refilled until the end of the program year". Detailed rule: "we divide it into four equal amounts (quarterly deductible) ... As each new quarter begins, you will pay for your prescription drugs out-of-pocket until you have paid off your deductible for that quarter. After that, your Trillium Drug Program coverage will begin and will continue until the end of that quarter." Unpaid deductible carries to the next quarter, "only to the fourth quarter, not into the next year".
   - The two statements pull against each other; the detailed rule is the narrower and the conservative one, and the existing aboutList item [3] ("The deductible is divided into four equal quarterly amounts") already points at it.
   - `summary` (replace the clause after the semicolon): "...For most people the deductible is about 4% of after-tax household income, paid in four quarterly amounts; once you have paid a quarter's amount, you pay up to $2 for each drug filled or refilled until the end of that quarter."
   - `about` last sentence: "You pay a deductible first — for most people about 4% of household income after taxes, split into four quarterly amounts — and once a quarter's amount is paid you pay up to $2 for each drug filled or refilled until the end of that quarter."
   - `aboutList.items[2]`: "Once a quarter's deductible is paid, you pay up to $2 for each drug filled or refilled until the end of that quarter."
   - Add one tip (optional but recommended): "Each new quarter starts with that quarter's deductible; an unpaid amount carries over to the next quarter, but not into the next year."
   - `amount` and `BENEFIT_VALUES.note` ("then up to $2 for each drug filled or refilled") make no year claim; unchanged. `tips[4]` already says the deductible is split in four.
   - Tests: `e2e/matcher-safety.spec.js:1643-1647` check status only.

11. **trillium-drug-program, `eligibility.note`: FIX (text only).**
   - Evidence (`--1`): "You can apply to the TDP for yourself, if you live alone or you live only with people not listed below. Otherwise, you have to include: your spouse, if: [married / conjugal for 1 year / parents of a child / cohabitation agreement] ... another person, if you live together, one of you is a parent, grandparent or the legal guardian of the other, and one of you is dependent for support on the other, including if one of you is under 25 years of age who is eligible for OHIP+ if that person is dependent on the other person for support".
   - New `note`: "You apply as a household. You can apply for yourself if you live alone or only with people the page does not list. Otherwise you have to include your spouse (the page lists married and some other partner cases) and another person you live with if one of you is a parent, grandparent or legal guardian of the other and one of you is dependent on the other for support."
   - Tests: none.

## F. waterloo-ontario-renovates (items 12-13)

12. **waterloo-ontario-renovates, `amount`, `detail.about`, `detail.aboutList.items[0-1]`, `BENEFIT_VALUES.note`: OPEN.**
   - Evidence (`--1`, the program page): "You may qualify for up to $25,000 in forgivable loans to keep your home in good repair or install accessibility features". The only snapshot is the program page; the linked Ontario Renovates Fact Sheet is not supplied. The record's separate "$25,000 for repairs and/or up to $25,000 accessibility", the $5,000 grant portion, the promissory-note and mortgage-above-$25,000 rules, and the November 15 / December 15 dates come from the fact sheet (the record `note` and `tips[2]` already say so and warn that the page gives December 1).
   - Absence on today's page is not evidence the fact-sheet figures are wrong, and the overview's single "up to $25,000" is compatible with a $25,000 maximum per dwelling. But the overview does not confirm a separate second $25,000 or funding above it. Nothing here is safe to change from this snapshot.
   - Needed: fetch the Ontario Renovates Fact Sheet and confirm (a) whether repairs and accessibility have separate $25,000 limits and (b) the over-$25,000 mortgage rule. If it states a single $25,000 limit, change `amount` to "Up to $25,000 in forgivable loans for home repairs or accessibility features" and align `about`, `aboutList.items[0-1]` and `BENEFIT_VALUES.note`. If it supports the current wording, KEEP.
   - Until then the existing hedge "limits may be subject to change" stays; the gate `waterlooRenovatesEligibility` already sends the user to the Region.

13. **waterloo-ontario-renovates, `eligibility.items[1]`, `REQS.waterlooRenovatesEligibility`: KEEP.**
   - Evidence (`--1`): "Assessed value of your home (Maximum of $600,00) (MPAC Assessment)". That is a malformed figure ("$600,00" has five digits). No other sentence on the page gives a home-value figure or supports a different amount, so there is nothing to replace $600,000 with. Source typo recorded here. The gate is `met: () => false`, `fixed: false`, external in the oracle, so a wrong value cannot exclude anyone. Leave the "maximum value of $600,000" wording; confirm against the fact sheet together with item 12.
   - No change. Tests: none.

## G. grt-support-person (items 14-15)

14. **grt-support-person, `detail.steps[3]`, `detail.documents[2]`, `BENEFIT_META.effort`: FIX (text only).**
   - Evidence (`--1`): "If you are currently enrolled in the Personal Assistant for Leisure Activities (PAL) program ... you do not have to have your health care professional fill out your application, you can provide your PAL card number on your application. If you are not enrolled in the PAL program, the application should be completed by a registered health-care professional with one of the following designations: Physician, Nurse practitioner, Nurse, Psychologist/psychiatrist, Physiotherapist, Occupational therapist, Optometrist/ophthalmologist, Social worker with the Ontario College of Social Workers and Social Service Workers, Orientation and mobility specialist, Developmental services resource centre service coordinator, Other professionals approved by the Region. Any fees charged by a health-care professional will not be reimbursed by GRT."
   - `steps[3]`: "If you are not enrolled in PAL, the application should be completed by a registered health-care professional with one of the designations GRT lists (for example physician, nurse practitioner, nurse or occupational therapist, or others approved by the Region)"
   - `documents[2]`: "If you are not in PAL: the part of the application that should be completed by a registered health-care professional with a designation GRT lists"
   - `BENEFIT_META.effort`: "Online or paper application; a PAL card number, or the health-care professional's section (completed by a professional with a listed designation)"
   - Add a tip: "Any fees a health-care professional charges are not reimbursed by GRT."
   - Tests: none.

15. **grt-support-person, `BENEFIT_META.wait`: FIX (text only).**
   - Evidence (`--1`): "GRT will send you a letter within 14 calendar days of receiving your application indicating whether you have been approved."
   - New `wait`: "GRT sends a letter within 14 calendar days of receiving your application saying whether you are approved".
   - Tests: none.

## H. hamilton-fare-assist (items 16-18)

16. **hamilton-fare-assist, `eligibility.items[1]`, `detail.steps[1]`: FIX (text only).**
   - Evidence (`--1`): "Hamilton residents who are recipients of Ontario Works, the Ontario Disability Support Program (ODSP) OR whose Total Household Net Income Amount is less than the amounts below, can apply for themselves and their family." Overview: "household incomes below the Low-Income Measure". The record says "at or below", which adds equality the page does not state, and it drops the OW/ODSP route.
   - `eligibility.items[1]`: "You receive Ontario Works or ODSP, or your total household income is below the Statistics Canada Low-Income Measure for your family size"
   - `steps[1]`: "Apply through the City of Hamilton — if you receive Ontario Works or ODSP you give your Member ID; otherwise your total household income, from any source, must be below the Low-Income Measure for your family size"
   - Same "at or below" appears in `summary` ("at or below the Low-Income Measure") and `detail.about` ("living at or below"): change to "below" in both for consistency with the page's "below the Low-Income Measure" and "less than the amounts".
   - Gate: the shared `lowIncome` gate (`income === "low"`, `fixed: true`) stays; there is no OW/ODSP receipt answer to build a route gate on, so I do not create one. Flag: an OW/ODSP household whose income answer is not "low" is refused although the page includes it; this is the same app-wide approximation as in item 4's note.
   - Tests: `e2e/matcher-safety.spec.js:1773-1777` (Hamilton profile `ready`, Toronto `no`) unaffected.

17. **hamilton-fare-assist, `eligibility.note` (six-person limit "$74,109"): KEEP.**
   - Evidence (`--1`): "6 persons $74.109". The other nine figures use commas ("$67,652", "$80,047"); the period is a typo, and $74.109 would sit far below $67,652 for five persons, so only $74,109 fits the ascending table. No other sentence on the page gives a different six-person figure. Record the source typo; no change. (The Toronto Welcome Policy snapshot lists "6 people $74,109" for the same LIM-AT 2023 data; not used as the basis for the decision, only consistent with it.)
   - Tests: none.

18. **hamilton-fare-assist, `detail.documents[0]`, `BENEFIT_META.effort`: FIX (text only).**
   - Evidence (`--1`): "Provide Required Documents OW/ODSP Applicants: Provide Member ID. All Others : Include a current Notice of Assessment for all family members." Renewal: "OW/ODSP Applicants : No income documentation needed. All Others : Include a current Notice of Assessment." Also: "You will need to attach a copy of identification showing your current address such as a driver's license, health card or government issued ID."
   - `documents[0]`: "If you receive Ontario Works or ODSP: your Member ID. Everyone else: a current Notice of Assessment for all family members"
   - Add `documents[2]`: "Identification showing your current address, such as a driver's license, health card or government-issued ID"
   - `BENEFIT_META.effort`: "Application with your Ontario Works or ODSP Member ID, or a Notice of Assessment for each family member"
   - Not changed: the page also gives other documents for 18- or 19-year-olds and newcomers who have not filed a return; `summary`, `note`, `tips[2]` already say they "may also qualify".
   - Tests: none.

## Summary of changes to code, not just text
- New gate: `torontoFairPassAge` (`public/app.js`, `REQS`); `toronto-fair-pass.requires` swaps `adult` for it. No other gate edited. `adult`, `lowIncome`, `odspMedical`, `odspFinancial`, `waterlooRenovatesEligibility` untouched.
- `e2e/oracle/oracle-spec.js`: add the `torontoFairPassAge` entry; `SPEC_VERSION` `1.26.0` -> `1.27.0`.
- If a `research/207-shorts/shorts-applied.json` entry or cue-inventory test needs a `short` for any gate: `torontoFairPassAge` is always fixed and, like `adult`, carries no `short`; run the cue-inventory test to confirm.
- Regenerate guides and context; re-run the surface density check (several faithful texts are longer).

Count: 15 FIX / 2 KEEP / 1 OPEN

## Fixes applied

Applied the fifteen FIX items using the supplied snapshots only. Items 12, 13
and 17 are unchanged. The item 16 implementation below follows the explicit
request override, superseding the text-only gate decision above.

### Per item

| Item | Result | Applied change |
|---|---|---|
| 1 | FIX | Only `BENEFIT_META.odsp.effort`: prescribed-class exception. ODSP record, gates and all existing e2e assertions unchanged. |
| 2 | FIX | Passport minimum is $5,665 in every repeated field, including `BENEFIT_VALUES`; first-year rules retained. |
| 3 | FIX | Passport maximum is $45,604 throughout; assessed-need and funding-availability qualifications retained; no year invented. |
| 4 | FIX | Fair Pass alone uses `torontoFairPassAge`; shared `adult` unchanged. The mixed nineteen-to-fifty-nine band stays met. |
| 5 | FIX | Fair Pass counts income for ages twenty to sixty-four in the chosen calculation reading; both conflicting source statements remain explicit. |
| 6 | FIX | Fair Pass renewal tip preserves “some”, “may not”, active benefit conditions, advance notice and annual review date. |
| 7 | FIX | Fair Pass separates financial eligibility from the no-income-documents list; Emergency Assistance is not promised a waiver. |
| 8 | FIX | Welcome Policy documents, steps and effort retain the program-ID alternative. |
| 9 | FIX | Welcome Policy wait gives email outcome timing, paper timing and missing-document delay. |
| 10 | FIX | Trillium summary, about and list now end copay coverage at the quarter boundary; added unpaid-deductible carryover tip. |
| 11 | FIX | Trillium household note makes listed dependent inclusion mandatory and retains the apply-alone exception. |
| 12 | OPEN | Waterloo funding fields unchanged: linked fact sheet is absent. |
| 13 | KEEP | Waterloo home-value fields and external gate unchanged: malformed source figure cannot justify a replacement. |
| 14 | FIX | GRT retains PAL alternative, “should”, listed professional designations/Region approval and unreimbursed professional fees. |
| 15 | FIX | GRT wait is a letter within fourteen calendar days of receiving the application. |
| 16 | FIX + override | Hamilton income text says below, not at or below; OW/ODSP alternative restored. Replaced only this record's `lowIncome` requirement with soft `hamiltonFareRoute`. |
| 17 | KEEP | Hamilton six-person figure and eligibility note unchanged: source punctuation typo recorded above. |
| 18 | FIX | Hamilton Member ID or current family Notices of Assessment route in documents and effort; added current-address identification. |

### Gates and every matcher-status change

- `torontoFairPassAge`: met for `19to59` and `60to64`, fixed otherwise.
  For otherwise-matching Toronto low-income profiles, band `18` changes
  `ready` → `no` because the page explicitly requires ages twenty to sixty-four.
  `65plus` stays `no`; younger bands stay `no`. `19to59` and `60to64` stay
  `ready`. The mixed band cannot distinguish nineteen from twenty and is not
  refused. Other failing requirements still determine the overall outcome.
- `hamiltonFareRoute`: met uses the same existing low-income answer check;
  `fixed: false`. For Hamilton profiles with `moderate` or `high` income,
  `no` → `almost`: OW/ODSP receipt is an alternative the wizard does not ask.
  Low income stays `ready`; wrong municipality stays `no`. This does not infer
  OW/ODSP receipt or promise approval.
- Both new gates have digit-free cues shorter than eighty characters and
  paired actor metadata in the reviewed cue inventory. The Toronto cue is an
  intentional addition to the optional-cue guidance above: full age/referral
  wording remains intact behind the short cue rather than increasing uncued
  dense requirements.
- Grep and a HEAD-versus-working-tree comparison confirm shared `adult`,
  `lowIncome`, `odspMedical` and `odspFinancial` unchanged. Only Hamilton and
  Fair Pass `requires` arrays changed; every other record's gates stay as-is.
- Remaining approximation: Fair Pass still shares the low-income band check;
  larger households above that wizard band can still be refused. Not broadened
  in this batch and not described as an exact income determination.

### Oracle and verification

- `SPEC_VERSION`: `1.26.0` → `1.27.0`.
- Added answer-evidence entries for both new gates. Toronto violations: band
  eighteen and senior → `no`. Hamilton moderate/high income → `almost`.
  Both satisfy fragments use existing supported answer values.
- Added two matcher regressions and two factual unit regressions. Existing
  ODSP assertions are unchanged. No `BENEFIT_VERIFIED` date was bumped:
  targeted fixes do not assert a new whole-record verification.
- Asset pins `179` → `180` in index, stylesheet fonts and generated guides;
  added `DATA_CHANGELOG` entry; regenerated context and guides.
- Surface ratchet: only `gate.unmet` count rises, `109` → `111`, for the two
  qualifier-preserving source rules. Full text remains behind short cues.
  All other baseline counts/maxima and uncued allowance remain unchanged.
- Generation, surface check and final unit run completed: **172/172 passed**,
  no skips. Initial unit run found the new source-qualified gate density and
  missing age cue; resolved without deleting source wording.
- Whole `app-chromium` final run: **235 listed / 235 passed**, zero failures
  or skips, one worker, about four minutes. All existing ODSP assertions pass
  unchanged. Initial whole run was 234 passed / one failure in the new Hamilton
  regression: the existing helper omits gate keys. Corrected only that new
  test's lookup to use its returned text, then reran the entire project.
- Logs: `outputs/batch8-{context,guides,surfaces,unit}.log`,
  `outputs/batch8-playwright-listed.log`, initial
  `outputs/batch8-playwright.log`, and final
  `outputs/batch8-playwright-final.log`.
- Changed source/test files: `public/data.js`, `public/app.js`,
  `public/changelog.js`, `public/index.html`, `public/styles.css`,
  `e2e/oracle/oracle-spec.js`, `e2e/matcher-safety.spec.js`,
  `test/factual-batch.test.js`, `research/207-shorts/shorts-applied.json`,
  `research/197-info-density/dense-surface-baseline.json`, and this decisions
  file. Derived files: `src/benefits-context.js`,
  `research/197-info-density/DENSE-SURFACES-REPORT.md`, and all 134 changed
  files under `public/guides/` (asset pins throughout; substantive content only
  for affected guides and their index).
- `git diff --check` passes. No old asset pin remains under `public/`.
  Protected task/agent/digest files and `.taskview/` were not touched.
  No commit or push performed.

