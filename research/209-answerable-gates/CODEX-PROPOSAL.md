# TaskView #209 — answer facts, not eligibility verdicts

Design only · Codex · 2026-10-14. Recommendation: **B + C, with no new wizard questions.**
Start with 11 optional checks of existing registrations, approvals or documents.
Do not optimize a match ratio by asking tired people to adjudicate themselves.

## Measured baseline

Re-measured today using a read-only Node heredoc: load `public/data.js` in a VM;
load the app prefix through REQS and `evaluate()` without running browser startup;
build each persona with `buildBestCase()`; set `answers`; evaluate all BENEFITS.
Parse the 47 ANSWERABLE keys from the #208 triage, then count programs whose
**entire unmet set is exactly that key**. No tests, generators or writes were run
for measurement. Relevant code: `public/app.js:38–59,214–1201,1355–1376`;
`e2e/oracle/build-personas.js:156–164`; frozen expectations:
`e2e/oracle/oracle-spec.js:635–771`.

Results: **134 programs; ready 54 (40.3%), almost 80 (59.7%), no 0.**
No persona-builder conflicts; no mismatches with PROGRAM_BEST_CASE.
There are now **87**, not 89, always-false predicates: #216 removed
`cdbAmountCalculation` and `rdspGrantWindow`. That did not unlock either program.
`rdspContributionWindow` and `bcCydbIntake` remain intentionally unresolved
(`research/216-misfiled/PROPOSAL.md:26–37,78–90`).

### Rank of all 47 ANSWERABLE gates

Order: solo unlock count descending, then references descending, then key.
“Solo” means changing only that gate for the program's best-case persona.
“Uses” includes programs needing other checks. IDs are current BENEFITS IDs.
An asterisk selects the gate for this recommendation; every other gate is deferred.
Gate links cite the current app declaration, not the older #208 line numbers.

| Rank | Gate (`public/app.js` line) | Solo / uses | Programs unlocked alone, or remaining blockers |
|---|---|---:|---|
| 1 | `lowIncomeOrDisabilityIncome` :420 | 7 / 7 | `edmonton-fare-assistance`, `reddeer-fee-assistance`, `lethbridge-fee-assistance`, `medicinehat-fair-entry`, `strathcona-subsidy`, `airdrie-fair-access`, `woodbuffalo-lift` |
| 2 | `qualifyingRenovationSpend` :848 | 2 / 3 | `home-accessibility-tax-credit`, `bc-home-reno-tax-credit`; M HRTC also needs `mhrtcSecondaryUnit` |
| 3 | `disabilityMedicalExpensesPaid` :876 | 2 / 2 | `disability-supports-deduction`, `medical-expense-tax-credit` |
| 4 | `municipalProgramEligibility` :427 | 2 / 2 | `grandeprairie-aish-pass`, `stalbert-subsidy` |
| 5 | `abCapccContinuingCareHome` :595 | 1 / 1 | `ab-capcc` |
| 6 | **`abServiceDogQualified`*** :588 | 1 / 1 | `ab-service-dog-id-card` |
| 7 | **`aCardProof`*** :1138 | 1 / 1 | `ottawa-a-card` |
| 8 | `archIncomeOrAssistance` :938 | 1 / 1 | `kamloops-arch` |
| 9 | **`atHomeProgram`*** :1011 | 1 / 1 | `bc-at-home-saet` |
| 10 | **`atpApproval`*** :1116 | 1 / 1 | `grt-affordable-transit` |
| 11 | `bcDefermentProperty` :840 | 1 / 1 | `bc-property-tax-deferment-disabilities` |
| 12 | **`bcFuelTaxRegistered`*** :832 | 1 / 1 | `bc-icbc-disability-discount` |
| 13 | `bcFuelTaxRoute` :824 | 1 / 1 | `bc-fuel-tax-refund-disabilities` |
| 14 | `bcHealthyKidsIncome` :906 | 1 / 1 | `bc-healthy-kids` |
| 15 | `bcSupplementaryBenefitsEligibility` :756 | 1 / 1 | `bc-msp-supplementary-benefits` |
| 16 | **`bcTransitHandyDart`*** :1010 | 1 / 1 | `taxi-saver-bctransit` |
| 17 | `bcWorkBcRoute` :914 | 1 / 1 | `bc-workbc-employment-services` |
| 18 | `caregiverSupportClaim` :883 | 1 / 1 | `canada-caregiver-credit` |
| 19 | `ccbEligibility` :480 | 1 / 1 | `child-disability-benefit` |
| 20 | `cdcpRequirements` :869 | 1 / 1 | `canadian-dental-care-plan` |
| 21 | **`cnibCustomer`*** :1128 | 1 / 1 | `grt-cnib-pass` |
| 22 | `cppContrib` :450 | 1 / 1 | `cpp-disability` |
| 23 | `cppDisabilityContributorLink` :456 | 1 / 1 | `cpp-childrens-benefit` |
| 24 | `cwbEligibility` :504 | 1 / 1 | `cwb-disability` |
| 25 | `firstNationsStatus` :764 | 1 / 1 | `bc-fnha-health-benefits` |
| 26 | `fscdEligibility` :609 | 1 / 1 | `fscd` |
| 27 | **`mobilityplusRegistered`*** :1123 | 1 / 1 | `grt-taxi-coupons` |
| 28 | **`ottawaOdspReceipt`*** :1101 | 1 / 1 | `ottawa-community-pass` |
| 29 | **`paraTranspoRegistered`*** :1110 | 1 / 1 | `ottawa-access-pass` |
| 30 | `tdpDeductible` :280 | 1 / 1 | `trillium-drug-program` |
| 31 | **`translinkHandyCard`*** :1009 | 1 / 1 | `taxisaver-translink` |
| 32 | `aadlOtherPayer` :660 | 0 / 1 | `aadl`: `ahcipRegistered` + EXTERNAL `aadlAssessment` |
| 33 | `achbCoverageCoordination` :410 | 0 / 1 | `child-health-benefit`: `achbFamilyResidencyStatus` |
| 34 | `achbFamilyResidencyStatus` :402 | 0 / 1 | `child-health-benefit`: `achbCoverageCoordination` |
| 35 | `acsdIncome` :337 | 0 / 1 | `acsd`: EXTERNAL `acsdSeverity` |
| 36 | `adultHealthGateway` :696 | 0 / 1 | `adult-health-benefit`: `adultHealthIncome` |
| 37 | `adultHealthIncome` :688 | 0 / 1 | `adult-health-benefit`: `adultHealthGateway` |
| 38 | `ahcipRegistered` :646 | 0 / 1 | `aadl`: EXTERNAL `aadlAssessment` + `aadlOtherPayer` |
| 39 | `cdbStatus` :472 | 0 / 1 | `cdb-adult`: `cdbTaxFiling` |
| 40 | `cdbTaxFiling` :464 | 0 / 1 | `cdb-adult`: `cdbStatus` |
| 41 | `coquitlamIncome` :930 | 0 / 1 | `coquitlam-far`: `coquitlamStatus` |
| 42 | `coquitlamStatus` :922 | 0 / 1 | `coquitlam-far`: `coquitlamIncome` |
| 43 | `dresResidencyAndStatus` :553 | 0 / 1 | `dres`: EXTERNAL `dresDisabilityBarrier` + `dresEmploymentRoute` |
| 44 | `mhrtcSecondaryUnit` :855 | 0 / 1 | `multigenerational-home-renovation-tax-credit`: `qualifyingRenovationSpend` |
| 45 | `rampIncomeAndResidency` :680 | 0 / 1 | `ramp`: `rampMobilityRoute` |
| 46 | `rampMobilityRoute` :672 | 0 / 1 | `ramp`: `rampIncomeAndResidency` |
| 47 | `rdspOpening` :488 | 0 / 1 | `rdsp`: retained MISFILED `rdspContributionWindow` |

The solo columns sum to **40 programs**, not 47. Converting all 47 together could
unlock **46 distinct programs**, yielding 100 ready / 34 almost. Six additional
programs need pairs: CDB, child health, adult health, RAMP, Coquitlam FAR and M HRTC.
AADL, ACSD, DRES and RDSP still cannot become ready from these conversions.
This is a structural ceiling, **not a promise that 100 programs suit one person**.
Every program has a different synthetic best-case person; no catalogue split
predicts a real user's list, and registration holders are not new applicants.

## Options

### A — a few adaptive wizard questions

Ask relevant provincial benefit receipt, tax filing and transit registration.
- Burden: extra compulsory navigation, even for people not pursuing those benefits;
  city is currently late in STEPS (`public/app.js:1688`), so city branching requires
  reordering or a post-city step. Neither “ODSP?” nor “AHCIP?” is a high-yield win
  today: one and zero solo unlocks respectively.
- Overclaim: medium/high if broad receipt is used for exact local thresholds,
  coverage coordination, contribution years or program-specific certification.
- A11y: native radios and existing wizard navigation help; additional steps still
  cost memory, energy and screen-reader time. Always offer Not sure.
- Privacy: only closed-choice facts locally; no numbers/documents. Extend the
  persisted-answer allowlist, never API payloads.
- Effort: M/L; `public/app.js` BLANK/STEPS/REQS, `public/stateManager.js`,
  `public/i18n.js`, `public/index.html`, oracle/spec/builder and wizard tests.
- Verdict: reject now. No shared simple question in this baseline justifies a
  wizard tax. The ticket's historical “ODSP unlocks several” is not true today.

### B — optional benefit-scoped “Check this fact”

One disclosure on a relevant result/detail, containing only reviewed factual checks.
- Burden: zero extra wizard steps; 1–3 questions only after choosing a program.
  Does not improve the untouched first results screen's numerical ratio.
- Overclaim: low for an existing registration; high for “do you meet the rules?”
  tickboxes. Use explicit component questions, never a blanket eligibility tick.
- A11y: named native disclosure, fieldset/legend, radios, restrained status live
  region; keep focus and card position when a check changes grouping.
- Privacy: closed choices on-device, like progress but **not stored as progress**;
  no text boxes, uploads, ID numbers or network submissions.
- Effort: M/L; app engine/UI, state manager validation, i18n/styles/index version,
  oracle/spec/builder, persistence and matcher/a11y tests. DB manager only if the
  existing state object cannot carry the new allowlisted field.
- Verdict: best safe status lever, even for single-record registrations. The
  ticket's one-record wizard prohibition should not forbid voluntary detail checks.

### C — honest status vocabulary, no new evidence

Keep matcher statuses, relabel ready “Matches your answers” and almost
“More to check”; explain unanswered facts separately from program decisions.
- Burden: almost none; short visible explanation, qualifications behind disclosure.
- Overclaim: low if we avoid “likely eligible” and “confirm 1 thing” when it means
  medical adjudication or a composite test. Never promote a status by renaming it.
- A11y: neutral headings, text counts, no color-only meaning; avoids false “one step”.
- Privacy: no new data.
- Effort: S/M; `public/app.js`, `public/i18n.js`, styles if needed, print/status copy
  tests, `public/index.html`. Audit generated guides if they repeat status wording.
- Verdict: do this regardless. Numerical split stays 54/80; clearer words address
  trust but do not solve the factual dead ends.

### D — B + C, then separately reviewed local-rule checks

Ship C with the 11 simple checks below. Later address the 9 municipal programs
behind the two highest-yield gates using verified per-program routes and exact
threshold comparisons, **not one reusable “low income” yes**.
- Burden: optional now; later income/household questions cost more and need evidence
  of usability benefit before expansion.
- Overclaim: lower than A; explicit fact provenance and program scoping are essential.
- A11y/privacy: B/C safeguards; any later calculator must be local and avoid storing
  raw finances when a categorical comparison suffices.
- Effort: M/L now, L later; B/C files plus `public/data.js` if route metadata is added,
  official-source review, and generated artifacts through normal implementation tools.
- Verdict: **recommended**, but only the first stage is specified for implementation.

## Recommendation

### Exact scope and wording

All 11 starred gates become **scoped factual evidence**, established only by the
explicit answers below. All other 36 ANSWERABLE gates remain false for now.
No derivation from diagnosis, income bands, progress stage, MSP, PWD designation,
DTC approval, employment or generic “documentation” is permitted.

Use “Check this fact (optional)” on the result card, collapsed by default;
place the same controls under “Requirements to check” on its detail page.
Show them only for the relevant program, never on unrelated cards or as a modal.
For a `no` result, keep the fixed refusal and offer checks only on detail; they
cannot override that refusal. Browsing without a completed wizard cannot produce
an answer-based ready badge. Sharing/printing a generic guide carries no saved checks.

Each row below is a separate native radio group: **Yes / No / Not sure**.
Start unselected. “Not sure” is always visible and never counts as yes.
For child/family mode, replace “you/your” with the existing subject/possessive
helpers (`public/app.js:69–86`); show “Answer about the person this benefit is for.”
This is not a request for the helper's registration.

| Gate | Exact question(s); every component must be Yes |
|---|---|
| `ottawaOdspReceipt` | “Do you live in Ottawa?”; “Do you get ODSP payments now?”; “Do you have an ODSP document with your ODSP ID number?”; “Do you have a Presto card number or a Para Transpo ID number?” |
| `paraTranspoRegistered` | “Are you registered with Para Transpo?”; “Can you find your Para Transpo registration number?” |
| `atpApproval` | “Has the Region of Waterloo approved you for the Affordable Transit Program?” Help: “Applying is not the same as being approved.” |
| `mobilityplusRegistered` | “Are you registered with MobilityPLUS?” |
| `cnibCustomer` | “Are you a CNIB customer?” Help: “This asks about your CNIB customer status, not your vision.” |
| `aCardProof` | “Do you have either a CNIB one-piece photo ID card or an Attorney-General of Ontario Guide Dog photo ID card?” |
| `translinkHandyCard` | “Are you registered with TransLink HandyDART or HandyCard?” |
| `bcTransitHandyDart` | “Are you registered as a permanent handyDART customer?”; “Do you have a handyPASS?” |
| `atHomeProgram` | “Is your child enrolled in B.C.'s At Home Program?” Use “Is the child…” when the selected subject is not the user's child. |
| `bcFuelTaxRegistered` | “Has B.C. approved your registration in the Fuel Tax Refund Program for Persons with Disabilities?” Help: “Applying is not the same as being approved.” |
| `abServiceDogQualified` | “Has your service dog already qualified through one of the routes listed below?” Display the three existing accepted routes from `public/app.js:588–594` as bullets immediately before the radios; do not ask the person to assess training quality. |

Global helper: “Tell us only yes, no, or not sure. Do not enter any ID numbers.
These answers stay on this device. The program still decides.”
Existing program names and accepted routes sometimes exceed grade 6; preserve
those names, use short sentences, and do not simplify away legal distinctions.
The source-reading wording above is a design candidate: implementation must
re-read each official source that day before enabling its check (AGENTS.md:48–50).
If a source does not support the full check, defer that gate; reduce the prediction.
In particular verify the HandyDART/HandyCard OR and service-dog provider routes.

### Engine and local state contract

Add a small explicit reviewed registry keyed by **program ID + gate key**, with
named components and a question-version integer. Pass scoped evidence into
`evaluate(benefit)`; do not let a shared REQS predicate consult an unscoped yes.
A gate passes only when every declared component is exactly `yes`, the version
matches, and the confirmation belongs to the current subject/context.
Existing fixed gates, other unmet gates and EXTERNAL gates still run normally.
Do not special-case ready: it remains “no fixed refusals and no unmet gates”
(`public/app.js:1355–1376`). No and Not sure both leave these actionable gates unmet;
No may offer the official registration link, not declare permanent ineligibility.

Persist `confirmedFacts[programId][gateKey]` as versioned component choices in
IndexedDB through the state manager, independently of `progress` (app.js:128).
Allowlist program/gate/component/value/version; reject unknowns, malformed objects
and stale versions (`public/stateManager.js:15–34,128–139,166–173`). Absence is unknown.
On relevant wizard edits (subject, province, city, age or other requirement inputs),
clear affected confirmations before re-evaluation; changing subject clears all.
Provide “Clear these checks” per program; existing forget/reset must clear all.
Show saved answers for editing, never preselect Yes from an application stage.
If storage fails, session answers still work with a visible “Not saved on this device”
message. No identifiers, documents, raw finances, telemetry or new remote storage.
Exclude confirmations from URLs, assistant/feedback payloads and scenario sandboxes;
a hypothetical preview must not write real confirmations.

### Status copy and grouping

Internal `ready`: **“Matches your answers”**. Visible adjacent sentence on results
and detail: **“Based on what you told us. The program decides if you qualify.”**
Where confirmations contributed, add “Includes facts you checked on this device.”
Never “eligible”, “approved”, “guaranteed” or “all official rules checked”.
Internal `almost`: **“More to check”**. Put “A fact you can check” beside deferred
factual gates, and “The program or a professional must check this” beside external
ones. Preserve the full requirement text and actions in the #208 disclosure.
Internal `no`: **“Does not match these answers”**, not a denial by the program.

Use two main result groups, not four badge classes or an extra results questionnaire.
Display the exact unresolved gate count; a composite is “1 requirement to check”,
never “1 question” or “one step away”. Avoid “likely” because no likelihood was measured.
Acknowledge: “We did not ask about every requirement. You can still read how to apply.”
Audit money-band, detail, saved list and print copy too: current contradictory
strings live in `public/i18n.js:342,387` and `public/app.js:4599,4652–4653,5069`.
Do not immediately move the focused result card after its check turns ready:
announce “Matches your answers. The program still decides.” and regroup on return
or explicit refresh; counts may update while DOM order/focus remain stable.

### Predicted split and deliberate limits

With all 11 selected facts explicitly Yes in their own best-case personas:
**65 ready / 69 almost / 0 no (48.5% / 51.5%)**, a gain of 11 programs / 8.2 points.
The table identifies exactly those 11 program IDs. Without optional answers,
including every fresh first results view: **54 / 80 / 0**, unchanged.
This is a conditional capability improvement, not a promised user conversion rate.
If later reviewed municipal checks cover all nine programs, the conditional ceiling
would be 74 / 60; that work is not authorized by this proposal's question wording.

The 38 EXTERNAL gates stay unresolved on purpose, including ODSP medical/financial,
CRA certification, AADL assessment and local housing adjudication. The two retained
MISFILED gates also stay. Complex answerable finance/tax/property composites remain
almost, not because they are impossible to ask but because a generic lay yes would
hide exceptions and cost too much. Highest yield does not mean lowest effort:
`lowIncomeOrDisabilityIncome` is seven **different** municipal rule checks, not seven
wins from one universal question. Favor usefulness over a prettier catalogue ratio.
This follows the no-lay-verdict rule in `REMAINING-WORK.md:59–65`, the privacy and
fatigue rules in `AGENTS.md:43–61`, and the limits/low-fatigue ideas in
`research/brainstorm-2026-10/CODEX-IDEAS.md:58–70`.

## Risks and guard tests

Implementation requirements, not tests executed in this design session:
- Deliberately bump oracle SPEC_VERSION; add a distinct scoped-fact evidence model
  and update its documentation (current invariant/dimensions are wizard-only:
  `e2e/oracle/oracle-spec.js:14–33,54–70`). Keep genuine external evidence invariant.
  Never reclassify all 47 as answers or add an unconditional satisfy fragment.
- Add explicit scoped best-case fragments for the 11 gates and change exactly their
  11 PROGRAM_BEST_CASE entries. Preserve a separate no-confirmations 54/80 baseline.
  Builder must model confirmations separately from wizard answers, not quietly
  spread arbitrary facts into `answers`; verify no persona conflicts.
- Each component: Yes passes only that component; No, Not sure, absent, null,
  invalid value and missing sibling all leave the gate unmet. Not sure == unanswered
  for status. All-Yes still cannot bypass a fixed refusal or remaining external gate.
- Program isolation: Ottawa receipt cannot pass GRT/other municipal gates; HandyDART
  in one region cannot pass the other. Every deferred gate remains unsatisfied even
  if a saved object or wizard band seems relevant. Application progress is not approval.
- Persistence: reload, backward-compatible restore, subject/context change, reset,
  stale question version, malicious unknown keys, IndexedDB failure and two-tab
  updates cannot leak stale Yes. No confirmation reaches any network request or URL.
- Copy assertions across results/detail/money summaries/saved list/print: self-reported
  Yes never produces wording asserting official eligibility or approval. No “one step”
  claim for composites or decisions. Official links remain available when unsure.
- Keyboard/SR: radio labels include program and component context, Not sure is
  reachable, focus survives status updates, disclosure announces expansion, status
  announcement is polite and not repeated per keystroke. Test 400% reflow, touch
  targets, high contrast, reduced motion and storage-error messaging.
- Disabled-reader review must test whether optional checks feel voluntary and whether
  “Matches your answers” is understood as a shortlist, not approval. Browser tests
  cannot certify fatigue reduction or comprehension (AGENTS.md:229,245).
- Static/no-JS guides must never import personal readiness or imply registration is
  established; a printable personalized plan must retain the qualification caveat.

## Questions for Claude

1. Agree to relaxing the ticket's single-record constraint **only for optional
   detail/card checks**, while adding no wizard steps? Otherwise C alone is honest
   but cannot change the ready ceiling.
2. Can we model scoped facts as a new oracle evidence category with negative cases,
   rather than redefining “answers” to mean anything a saved object says?
3. Will source review confirm HandyDART OR HandyCard and each dog qualification route?
   Any additional proof requirement must become its own component, not disappear.
4. Agree that the high-yield municipal gates need nine source-backed rule adapters,
   not shared generic income/receipt questions? Which two local rules should be the
   next design prototype after we establish comprehension of this first stage?
5. Can results keep a card in place until navigation after it changes status, while
   counts update, or does current grouping require a stronger focus-preservation design?
6. Who reviews the two candidate status labels with disabled readers and screen-reader
   users? Until then report usability as unverified, not a finished fatigue fix.

Session boundary: only this proposal is written. Existing untracked node_modules
and outputs were present before this session and are left untouched. No production,
oracle, workflow, generated or ticket files changed; no tests, generators, commits,
pushes, deployment or TaskView status updates performed.
