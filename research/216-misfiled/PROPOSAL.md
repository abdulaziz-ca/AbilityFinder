# TaskView #216 — source-backed disposition of four MISFILED gates

Reviewed 2026-10-14. The only factual authorities for this change are the supplied
`sources/src1.txt` through `src4.txt`, each carrying its URL, retrieval date and
HTTP status. The #209 triage was a lead, not permission to remove all four checks.
Quotes below preserve the source wording (non-breaking whitespace displayed as
ordinary spaces). No additional pages or linked PDFs were used.

## 1. `cdbAmountCalculation` — CONVERT to guide context

Source: `src1.txt`, Canada Disability Benefit amount page:

> Benefit amounts are based on your adjusted family net income.

> Your benefit entitlement is reevaluated every year based on your adjusted family net income from the previous year.

> Earning more than the working income exemption does not necessarily mean that your benefit amount will be reduced.

> For every dollar of income that's over this threshold, your benefit will be reduced by 20 cents (20%).

This is the calculation of the amount, not an additional action that must be
completed before applying. The source separately says:

> To be eligible for the benefit, both you and your spouse or common-law partner (if applicable) must have filed your federal income tax return .

That actual prerequisite stays in `cdbTaxFiling`; `cdbStatus` also stays. Remove
`cdbAmountCalculation` from `cdb-adult.requires` and the unused REQS/oracle entries.
Carry its **entire existing unmet information**, near-verbatim with the compound
calculation sentence split into two short bullets, into `detail.aboutList.items`: meeting other conditions is not a promise of money;
Service Canada's adjusted-family-net-income calculation may reduce it to zero.
No new income threshold, calculation, guarantee or `met` function is introduced.

**Users:** one fewer unresolved requirement, with the same warning in More about
on the live and generated guides. **No almost → ready persona:** even a DTC-approved
working-age person still has external tax-filing and status checks.

## 2. `rdspContributionWindow` — KEEP unchanged (source does not settle whole gate)

Source: `src2.txt`, RDSP limits, transfers and rollovers:

> There is no annual limit on amounts that can be contributed to an RDSP of a particular beneficiary in a given year.

> However, the overall lifetime limit for a particular beneficiary is $200,000 (all previous contributions and rollovers that have been made to an RDSP of a particular beneficiary will reduce this amount).

> Contributions are permitted until the end of the year in which the beneficiary turns 59 .

The annual/lifetime limits are context, and the contribution age window overlaps
`under60`. However, the existing unmet text also says **a plan can be opened**
until that year-end. This supplied page establishes the contribution deadline,
not the opening deadline. It discusses transfers to a new plan after age 59;
that is not authority for a general opening rule. It also establishes that prior
contributions/rollovers reduce remaining lifetime room, which the wizard does
not collect. The supplied source therefore does not settle the entire mixed
gate, or justify making a true `met` from an age band alone. Under the task's
explicit uncertainty rule, keep its requires entry, REQS definition, oracle
classification and **unmet text exactly unchanged**. This is a conservative
hold, not a claim that the original MISFILED classification was disproved or
that this is definitely an application prerequisite. Further opening-eligibility
evidence is needed to safely separate it.

**Users:** unchanged, including DTC-approved under-60 personas. No status changes.

## 3. `rdspGrantWindow` — CONVERT to guide context, not an age gate on the plan

Source: `src3.txt`, Canada disability savings grant and bond:

> A beneficiary's RDSP can receive a grant on contributions made until December 31 of the year in which the beneficiary turns 49 .

> A bond can be paid into an RDSP until the year in which the beneficiary turns 49 .

> No contributions have to be made to get the bond.

Source `src2.txt` separately permits contributions until the year the beneficiary
turns 59 (quoted above). These are distinct windows. The `rdsp` record is a savings
plan, not a separate grant/bond application record. Making the earlier deadline
an always-false plan prerequisite conflates those windows. Nor should it become
an under-50 gate on the **plan**; the existing `19to59` answer band cannot resolve
49 versus 50 anyway. Remove it from `rdsp.requires` and unused REQS/oracle entries.
Move **all information in the three existing unmet sentences**, near-verbatim,
to the RDSP `detail.aboutList.items`. Split the long joint deadline sentence into
one grant deadline bullet and one bond-same-deadline bullet; no deadline or hedge
is lost. Retain the entire existing description as the lead too. No grant/bond
entitlement is asserted by this change; the deadline warning remains on guides.

**Users:** one fewer unresolved requirement, including users in the 50–59 portion
of the adult band, without suggesting they can receive new grants/bonds.
**No almost → ready persona:** `rdspOpening` and the conservatively retained
`rdspContributionWindow` remain external checks; DTC and `under60` stay too.

## 4. `bcCydbIntake` — KEEP unchanged (real, unresolved intake/transition check)

Source: `src4.txt`, BC Children and Youth Disability Benefit, updated October 9:

> Prior to March 31, 2027 families can apply for supports using current pathways.

> Children and youth receiving CYSN services before March 31, 2027 will transition to the Disability Benefit if they are eligible.

> These transition processes only apply to children and youth in existing programs until March 31, 2027.

> New applicants after April 1, 2027 will apply directly for the Disability Benefit.

> Children and youth who are enrolled in and remain eligible for the At Home Program will transition to the Disability Benefit first.

> Temporary eligibility rules may be used during this time

Current support pathways exist, but they are not unconditional direct intake for
this benefit. **If they are eligible**, **remain eligible**, and **may** must not
be discarded. The wizard has no enrolment/transition-completion answer, and the
source does not say all children with the broad `childHighNeeds` answer can apply
directly today or have completed transition. Keep the requires entry and the
always-false gate, including its unmet string verbatim as requested for kept
gates. Do not replace it with an age-only or clock-only `met` function.

The existing string's automatic-transition wording is stronger than these source
hedges; the surrounding guide also makes automatic-transition claims. This is
recorded as unresolved, **not endorsed or freshly verified**. The task expressly
requires preserving kept unmet text; no unsupported claim is added or strengthened.
A separate source-aligned intake/guide correction should retain the quoted hedges
and distinguish program enrolment and transition eligibility before relaxing the
gate. In particular, the source's “after April 1” is not silently changed here to
an exact “on April 1” eligibility promise.

**Users:** BC high-needs child personas remain almost, including current recipients
whose actual transition cannot be established from answers. No ready promotion.

## Oracle and status ledger

`e2e/oracle/oracle-spec.js` advances **1.15.0 → 1.16.0** deliberately. Delete the
two converted gate declarations so the no-orphan invariant remains meaningful;
leave the two kept gate declarations and all `PROGRAM_BEST_CASE` values intact.

| Record / personas | Before | After | Reason |
| --- | --- | --- | --- |
| `cdb-adult`, best case / DTC-approved working-age | almost | almost | Tax-filing and status evidence is still external. |
| `rdsp`, best case / DTC-approved under-60 | almost | almost | Opening and contribution checks are still external. |
| `bc-cy-disability-benefit`, best case / BC high-needs child | almost | almost | Intake/transition check is retained. |
| All other records and answer-gate violation personas | unchanged | unchanged | No other requires list or gate predicate changed. |

**Status changes: zero; benefits promoted from almost to ready: none.** The user
improvement is removing two non-prerequisite checklist items while keeping their
information visible, not fabricating readiness. Regression tests check both
requires lists, kept gates, guide text and all three best-case outcomes.

## Data procedure / freshness

- Preserve all official record source URLs.
- Record the change in `public/changelog.js` (`DATA_CHANGELOG`).
- Shared browser asset pins advance **168 → 169** in index and fonts; generated
  guides inherit the stylesheet pin from index via `gen:guides`.
- `BENEFIT_VERIFIED` uses month granularity. AGENTS requires reading official
  evidence that day, and COVERAGE-GAPS rule 2 requires entries in the same change
  for **new** records; it does not prohibit updating re-reviewed existing records.
  Update CDB and RDSP to `2026-10` for the amount/window facts rechecked here,
  explicitly scope the code comment to those facts. This is not a full-catalogue
  re-verification. BC has no changed/re-verified record facts and keeps its date;
  unresolved old transition prose must not receive a new freshness claim.
- Run `gen:context`, inspect grounding/link diffs, then `gen:guides` and inspect
  guide changes. Generated files are not hand-edited.
- Run `npm test`, `npm run check:surfaces`, and the entire serial app-chromium
  Playwright project; counts and results recorded below after execution.

## Verification results

Final runs:

| Command | Passed / listed | Result |
| --- | --- | --- |
| `npm test` | **143 / 143** | 0 failures, 0 skipped/cancelled/todo |
| `npm run check:surfaces` | **6 / 6 surfaces inspected** | Density ratchets pass in the Node suite; no count increased. |
| `npx playwright test --project=app-chromium --workers=1` | **221 / 221** | Whole project, 0 failures, no retries; 3 new regressions included. |
| `npm run gen:context` | 134 records | Completed; grounding and link outputs reviewed and unchanged. |
| `npm run gen:guides` | 133 benefit guides + index | Completed; `local-supports` intentionally has no static guide. |

The initial Node run exposed the new month allowlist, inherited-date count,
applied-gate inventory and dense-bullet ratchets. The initial whole browser run
passed 216/221: three old tests expected the converted context in requirement
lists, one new test used the wrong persona ID field, and the Ottawa transit test
timed out in app readiness. Corrected the four relevant assertions/payloads;
no Ottawa assertion or timeout was changed. The final whole-project run passed
221/221 without retries. Initial logs were replaced by the final evidence logs.

The shortened near-verbatim bullets keep all moved information while keeping
`detail.aboutList.items` flagged count at **141**, not raising its baseline.
`gate.unmet` decreases **88 → 86**; lower **only** that baseline with the documented
`--surfaces --update-baseline` command. All other flagged counts are unchanged.

Deliberate secondary baselines: remove the two unused entries from
`research/207-shorts/shorts-applied.json` (the live applied-cue inventory), add the
source-backed October review month to `test/data-verification.test.js`, and update
`test/freshness-labels.test.js` inherited count **54 → 53** because RDSP now has its
own month. CDB already had an individual month. Matcher-safety assertions now
verify the relocated information and its absence from needs; the RDSP layout test
expects its two remaining unmet checks rather than three. The catalogue-wide
rendering test still verifies every actual unmet need, unchanged.

Evidence: `outputs/task216-{context,guides,node,surfaces,surfaces-baseline,playwright}.log`.
`git diff --check` passes. No `?v=168` pins remain in deployed public assets.
Kept REQS definitions/unmet wording and the BC record are unchanged; its generated
guide changes only its stylesheet version. No commits, pushes or deployments.

## Changed paths

- `research/216-misfiled/PROPOSAL.md` (this decision/evidence record).
- `public/app.js`, `public/data.js`, `public/changelog.js`.
- `public/index.html`, `public/styles.css` (shared asset version).
- `public/guides/*.html`: 133 benefit guides plus index inherit `v=169`; only CDB
  and RDSP also change More about text and their individual review labels.
- `e2e/oracle/oracle-spec.js`, `e2e/matcher-safety.spec.js`,
  `e2e/requirements-layout.spec.js`, new `e2e/misfiled-gates.spec.js`.
- `test/data-verification.test.js`, `test/freshness-labels.test.js`.
- `research/207-shorts/shorts-applied.json`;
  `research/197-info-density/DENSE-SURFACES-REPORT.md` and
  `research/197-info-density/dense-surface-baseline.json`.
- Six `outputs/task216-*.log` evidence files.

`src/benefits-context.js`, `src/links.js` and `public/sitemap.xml` were regenerated
and reviewed but have no diff. The existing summaries/about strings and source
URLs consumed by context generation did not change; new More about bullets are
rendered on guides. Supplied `sources/src1..4.txt` remain untouched. Pre-existing
`TASKVIEW-WORKFLOW.md`, `OWNER-DIGEST.md`, `.taskview/`, dependency links and other
agents' logs were not modified by this task.

## Fix round

All Claude review findings accepted. This section supersedes the earlier claims
that the two record-month bumps were justified and that the kept gate wording
was unchanged. Only supplied src1–4 were used; no broader verification claimed.

- **MEDIUM — lost official links: fixed.** Restored “Estimate your benefit amount”
  and “Grant and bond rules” as anchors in the corresponding More about items.
  src1: “Benefit amounts are based on your adjusted family net income.”
  src3: “A bond can be paid into an RDSP until the year in which the beneficiary
  turns 49.” The links point to those supplied official pages. Extended the
  shared catalogue extractor to collect More about anchors; added an independent
  fixture test. Both URLs now appear in generated `src/links.js`.
- **MEDIUM — partial checks labelled as full record reviews: fixed.** CDB restored
  to `2026-07`; RDSP restored to its inherited catalogue month by removing its
  override. Restored both freshness test baselines to HEAD. src1's limited scope:
  “Benefit amounts are based on your adjusted family net income.” src3's limited
  scope: “A bond can be paid into an RDSP until the year in which the beneficiary
  turns 49.” Neither sentence establishes a full-record review.
- **LOW — CDB attribution and inference: fixed.** Replaced the Service Canada
  attribution with src1: “Benefit amounts are based on your adjusted family net
  income.” Replaced the inference with src1: “If your adjusted family net income
  is considerably above that threshold, your benefit amount will be $0.” The
  reduction bullet now also uses source wording: “the benefit amount will start
  to decrease after your adjusted family net income reaches a certain threshold.”
- **LOW — RDSP grant/bond wording: fixed.** Dropped “only” and the inferred shared
  deadline. src3: “A beneficiary's RDSP can receive a grant on contributions made
  until December 31 of the year in which the beneficiary turns 49.” Also src3:
  “A bond can be paid into an RDSP until the year in which the beneficiary turns
  49.” Both sentences are retained in their own words.
- **LOW — kept gates: fixed.** RDSP unmet now uses src2: “Contributions are
  permitted until the end of the year in which the beneficiary turns 59.” The
  remaining contribution-limit string is unchanged. Its short is now “Check the
  age deadline for adding money to an RDSP” (no digits, under eighty characters)
  in both live code and the applied-cue inventory. BC uses src4: “Children and
  youth receiving CYSN services before March 31, 2027 will transition to the
  Disability Benefit if they are eligible.” Timing uses src4: “New applicants
  after April 1, 2027 will apply directly for the Disability Benefit.” No new BC
  short was introduced; the eligibility hedge remains in the unmet text.

Exact source sentences increase flagged More about items from 141 to 144.
The three newly flagged items are the CDB income-threshold/$0 sentences and
RDSP grant sentence. Updated this density baseline explicitly rather than
shortening away source wording or qualifiers; other surface counts are unchanged.
Regression assertions now check the corrected source wording rather than the
superseded paraphrases.

Final verification (logs `outputs/task216-fix-*.log`):

- `gen:context`: completed, 134 records; restored links included.
- `gen:guides`: completed, 133 benefit guides plus index.
- `npm test`: **144 passed, 0 failed**, including the link-catalogue tests.
- `npm run check:surfaces`: **6 surfaces inspected**, ratchets pass in Node suite.
- Requested serial app-chromium subset: **89 passed, 0 failed**.
- `git diff --check`: passed.

Initial checks caught the exact-wording density increase and five stale browser
assertions; corrected those explicitly and reran all requested commands. Asset
version remains **169**. No commits or pushes; protected workflow/owner/agent
files and `.taskview/` untouched.
