# Codex critique A — current-situation relevance

2026-10-16 · Critique only; no product changes or new official-source verification.
Read A-RESULTS-RELEVANCE.md and B-USER-JOURNEY.md in full, AGENTS.md, project constraints,
and the production evaluator, wizard, results, geographic helpers and persistence boundary.
Re-ran `node research/2026-10-site-audit/tools/measure-relevance.js` without output-file flags.

## Verdict: accept the diagnosis, narrow the implementation

The owner wants fewer false leads, not a finer vocabulary of uncertainty. A's design improves
that substantially, but four headings plus a DTC pathway, an existing exclusions list and a
scenario panel is too much classification work for a tired reader. Use **two visible groups
and one collapsed group**, compact rows, and item-level explanations. Do not turn an absence
of evidence into a reason to hide a program.

The proposed phase 1 is **not safe as written**. Some predicates contradict the criteria
already in the code; “uses only existing answers” does not make an inference sound.
Also bring receipt capture forward: the AISH persona still cannot tell the app its most
important current fact after A's first phase.

## 1. What the measurements do and do not establish

- Reproduced A's 29 ready + 285 almost items, including 58 classified contradictions,
  and 34 such items in today's first-ten slots. These are synthetic profile observations,
  **not approval probabilities**, and the 58 are not all proven exclusions.
- B's roughly 40–50% includes unasked circumstances; A's 20% counts its contradiction
  class. They measure different things. Neither supports “most likely to get” numerically.
- A's 144 full-card result uses the full A2 prototype, including judged predicates;
  it is not a validated effect size for the proposed answer-only phase 1.
- The tool's income ceilings include admitted placeholders (e.g. AISH/ODSP). Do not ship
  them, cite them as established ceilings, or use 58/285 as a release oracle.
- The headline should be **“Programs based on your answers”**, not a giant sum of leads.
  Counts belong on groups. Delete the no-estimate money band; do not replace it with
  another reassurance paragraph. Never sum mutually exclusive or already-received support.

## 2. Simpler grouping and safer copy

Keep the ready badge **“Matches your answers”**, with one group-level “The program decides
if you qualify.” It means the checked answers match, not that the person is eligible.
For unresolved items prefer **“Requirements to check”** over “May fit you now.” The latter,
“Fits what you told us,” “closest,” and “Worth checking” all suggest positive suitability
that unasked requirements have not established. Alternatives: “Check these requirements”
or “More information needed.” Avoid French “Prêt à demander” too; safety parity is not later work.

Distinguish items by the **nature of the missing information**, not just the number of
unmet gates. A single unasked care-home residency can matter more than three medical checks.
An all-external-gates program is not automatically personally relevant: an adjudicator's
role does not establish that the user needs housing or can use a mobility refund.
Use a small reviewed per-program route classification, not “no answer-based gate ⇒ general”
or a raw STATUS_GATES set. CDCP is broadly checkable; a service-dog card has a specific trigger.
Keep unreviewed uncertain cases in the visible second group rather than silently excluding them.

DTC: keep its application route visible when not approved, but **do not universally say
“Start with the DTC.”** Immediate income/health help can matter first; DTC approval is not
assured and does not establish every dependent program's eligibility. Use “Don't have the
Disability Tax Credit? Check how to apply.” For unsure: “Not sure about the DTC? Check your
status.” Show dependent names once under the collapsed group, linked from that row.
Replace “could open up N more programs for you” with “Some programs require DTC approval.
They have other rules too.” No prospective benefit count.

## 3. Gate-by-gate challenge to the proposed later rules

| Gate class | Safe interpretation and necessary exception |
|---|---|
| DTC `no` | Explicitly not approved **now** supports moving programs requiring prior approval out of the primary list, not a permanent refusal. DTC itself stays visible. Filing/preparation can begin now; label the dependent item “DTC approval needed first,” not “you cannot apply.” `unsure` stays visible for checking. |
| DTC-or-65 / HATC | `hatcQualifyingPerson` says DTC **eligibility during the year**, or age 65 **at year end**. “Not approved” does not prove no qualifying year; the 60–64 band includes someone turning 65 this year. A's predicate wrongly treats both as ruled out. Keep a visible conditional row until the relevant tax year and route are established. |
| MHRTC | `mhrtcQualifyingIndividual` concerns the person the unit is for; current answers may describe a different household member. A child also cannot become an eligible adult merely by obtaining DTC. Preserve adult/senior and relative-route qualifiers; no generic “DTC or turn 65” cue. |
| AISH / ADAP age | `aishAge`/`adapAge` deliberately leave 65+ soft because **OAS eligibility**, not age alone, is decisive. A's “later: senior” hides help a senior not eligible for OAS may get now. Keep visible: “65 or older? Check OAS eligibility.” Do not hard-cap ODSP at 64 without verifying its exceptions. |
| City | Explicit incompatible residence can exclude; Other/null is unknown. Program boundaries can include counties/regions or exceptions, not just the delivery city's name. Okotoks includes Foothills County; Lloydminster's existing text exempts some Indigenous applicants from residency. No universal “different city ⇒ no.” |
| Working / not working | Working does **not** automatically exclude AISH or CPP-D: capacity, earnings and adjudication differ from having a job. “Unable to work” is not a verified exclusion from employment-destined accommodation routes. Keep DRES conditional unless its precise route is disproved; a student answer does not establish its education funding route either. |
| PWD / assistance | `bcAssistance=pwd` combines designation **or** assistance; it cannot establish current receipt. `none` may support a prerequisite cue for a route genuinely requiring designation, but not elimination of a benefit with other routes. A's non-senior bus-pass rule needs source review: the senior age band is not proof of every listed route's age/status rules. PWD designation application itself stays visible. |
| AISH / other receipt | Low income, unable to work, an approved tracker stage, and medical documentation do not prove receipt. Positive, current, program-specific self-report can label the received program. Use exclusions only where verified for the actual recipient/household and program. Do not infer AISH↔ADAP exclusivity or transition timing from their names. |
| Documentation / autism diagnosis | “No documentation yet” can justify a prerequisite cue, not burying the documentation/assessment route. Verify program-specific entry and application rules; no automatic permanent exclusion. Make the action available now even when dependent funding is later. |
| Functional need / mobility | Not selecting a checkbox is not necessarily a definite denial. Specifically `medicalTravel` asks about **outside-community** travel, while `bcMedTransportNeed` includes **daily appointments**. A's phase-1 predicate hides a legitimate local-treatment route. Walking 50 m also does not disprove all SPARC mobility limitations or permanent transit-safety impairment. No excise exclusion from `canWalkFar !== false` (which includes null). |
| Home ownership | BC's “none” about the subject does not disprove ownership by an eligible relative, expected residence, or another qualifying dwelling route. Do not use it to move HATC later. Outside BC, `circumstances=[]` is unasked, not no: fix `homeowner`'s false refusal before using it for grouping. |
| Income | Household bands are not adjusted net income, assets, exempt earnings or current hardship. Alternative assistance routes and family size matter. Do not ship blanket high-band later rules, including Hamilton/Richmond/Waterloo, without checking each alternative and the income definition. |

General rule: a later predicate needs proof that **all alternative routes relevant to that
requirement** fail now. It must be false for unasked/skipped/null/unsure, and must not
infer a clinical fact from a diagnosis checkbox. Each predicate needs an exceptions test,
not just `later ⇒ !met`: failure of the current `met` proxy is not proof of ineligibility.

## 4. Add receipt capture, but separate receipt from approval/designation

**Yes, soon after the correctness fixes, not after an open-ended usability phase.** One
optional province-aware step after province and before detailed financial/results questions:
“Which programs does [person] currently receive? Select all that apply.” Show CPP-D plus
AB AISH / ADAP / Income Support, ON ODSP / Ontario Works, or BC disability/income assistance.
Use age-appropriate options; ask about the person whose results these are, not the helper.
“None of these” and “I'm not sure / Skip” must be exclusive and distinct from missing data.

DTC approval remains the existing separate question: it is not a monthly benefit receipt.
For BC, replace/refactor the existing step rather than adding a redundant question: distinguish
“PWD designation, not receiving disability assistance” from current assistance and unsure.
Do not migrate old `pwd` answers to “receives disability assistance.” Preserve legacy uncertainty.

Results: a compact **“You told us you get this”** strip with guide/manage links, no application
CTA, no new-opportunity count, and no claim of verified payment. DTC copy: “You told us you're
approved.” A received program should not still appear as “check” elsewhere. Do not infer
receipt from tracker `approved`; conversely, don't rewrite tracking history from this answer.
Receipt is a display state, not an override that marks every requirement met.

Use receipt to resolve **only** verified receipt gates and exclusions: e.g. review AHB's
AISH/Income Support exclusion, and accepted municipal assistance routes. Shared-application
AISH/ADAP should not prompt two redundant applications. Keep transition advice discoverable.
If receipt conflicts with another answer, explain and offer review; do not silently revoke it.

Cost is moderate, not just one checkbox list: BLANK, wizard/edit chips, allowed selections,
state validation/migration, clearing province-incompatible receipts, restore/cross-tab behavior,
privacy wording and self/child/family copy all change. The payoff is direct and testable for
AISH/ODSP users, unlike an uncalibrated likelihood score. No server storage or new telemetry.

## 5. Ordering without inventing editorial weights

Use evidence buckets, not money, difficulty, unmet-count or presumed urgency:
1. In the primary group, ready items first; unresolved but personally supported routes next.
2. Within each bucket, alphabetical by localized display name, then stable benefit ID.
3. Put the short DTC application/status row after ready items, before remaining unresolved
   items only when it is relevant to a surviving dependent route; otherwise normal name order.
4. Other-to-check and collapsed lists: alphabetical; received strip: alphabetical.

Label the mode “By your answers,” not “Priority.” This is a proposed transparent presentation
order, **not validation or replacement weights for `priorityScore`**. Leave that function and
#68 blocked; explicitly review the ordering change before shipping. If only grouping is
approved initially, retain its existing stable order inside buckets and disclose that it is
not a likelihood/urgency order. Do not add a hidden weighted score through tier tie-breakers.
Category mode must nest inside these groups, never flatten their evidence distinctions.

## 6. Confirmed leaks and exact correction boundaries

- `renderResults()` (4016+) filters only the `no` array by `benefitProvince`; ready/almost
  have no province scope filter. `browseCatalog()` is a feature-flag filter, not user scope.
- `benefitProvince()` (4086+) recognizes province gate names and Calgary/Edmonton only.
  Waterloo and most other local records therefore return null. Null means federal to its
  caller. The Ontario-local exclusions leak is confirmed, not merely a copy issue.
- Reuse existing `benefitIsBritishColumbia` / `benefitIsOntario` (including ON_REGIONS),
  province-name lookup, and an exhaustive reviewed AB-local level set to resolve current
  `level` values. Prefer explicit `coverage: [province]` metadata long term; existing grants'
  coverage helper cannot be applied to benefits blindly because those fields are absent.
  Make nationwide status explicit for Federal; **unknown local level must fail a catalogue
  test, never silently become national**. Keep any cross-border record's actual scope.
- Apply one scope predicate to **all personalized result groups**, counts, scenarios, print,
  document collection and update/tracker summaries. Browse-all and direct guide routes remain
  available; tracked out-of-scope items can be retained separately with a clear label.
- `okotoks-fee-assistance` (`data.js:4625+`) requires only `okotoksResidency` and `lowIncome`;
  add `ab`. Make residency satisfied for explicit Okotoks; unknown for Other/null (including
  possible Foothills County); incompatible definite city gets the geographic exclusion.
  Re-read its official boundary rule before changing gate behavior. Do not make Foothills
  users claim to live in Okotoks; a future named county option is preferable.
- Audit county/region/exception gates individually. Do not turn every `*Residency` gate fixed.
  Keep wrong-town programs out of opportunity groups; relocation ideas belong in browse or
  the scenario tool, not dozens of personalized “future benefits.”

## 7. Additional misses / guardrails

- `FACT_REGISTRY` currently contains only three GRT benefit-scoped confirmation definitions,
  not every gate. B's proposed lifeFact/programDecision tags belong in separate reviewed
  relevance metadata (or REQS), not in that persistence registry as if it were comprehensive.
- The audit harness uses empty scoped confirmations. Test actual yes/no/unsure confirmations:
  production `evaluate()` can pass a soft gate on a versioned confirmation. A confirmed **no**
  must not look like an unasked requirement; stale confirmations must not elevate relevance.
- Fix false refusals independently: `homeowner.fixed = !circumstanceUnknown()` interprets
  skipped empty circumstances as no. Require an applicable, actually answered question before
  a negative exclusion; also correct family ownership semantics. Do not merely preserve every
  existing `no` in a “no status changes” invariant when known false negatives exist.
- B's keyboard auto-advance can corrupt the answers driving all this. Fix it separately and
  early; an attractive relevance grouping over accidental answers still fails the owner.
- Do not promote generic checklist documents into universal application requirements. Keep
  checklists derived from selected programs; print should not secretly resurrect hidden leads.
- Show compact rows first, one short reason and one action. Moving 112 items to one-liners
  helps, but leaving 144 roughly screen-tall cards is still too much phone scrolling.
- Test with actual disabled readers for “what would you do first?” and “which programs are
  already yours?” Success is comprehension and fewer false leads, not guaranteed approvals.

## Recommended final design

**Above groups:** H1 “Programs based on your answers”; one sentence “We did not ask every
requirement. Each program decides if you qualify.” Optional received strip described above.
No giant combined count, no empty money estimate, answer chips behind “Review your answers.”

**1. “Programs to check” — visible compact rows, count of new leads only.**
Ready items carry “Matches your answers.” Other items require a reviewed present-route signal
and no proven blocking fact; carry “Requirements to check” plus the specific missing check.
DTC's own application/status row stays visible when approval is absent/unknown, regardless of
where dependent programs sit. Never upgrade evaluator status to manufacture matches.

**2. “Other programs to check” — visible one-line conditional rows.**
“We did not ask about these situations.” Include unasked/unconfirmed trigger-specific or
unreviewed routes: “If you have [specific condition]: [program] — Read guide.” Retain potentially
useful uncertain cases, including the senior/OAS and tax-year exceptions above. Do not label
these situations as future changes. No separate DTC heading or medical/program-decides tier.

**3. “Not for your situation now (N)” — one closed native details element.**
Within it, distinguish prerequisite rows (“DTC approval needed first — check how to apply”)
from definite exclusions (“Your selected city is outside this program's area — Edit answers”).
Only reviewed definite contradictions enter here. Unknown is never later. Keep all blockers
accessible, not only the DTC one. Cross-province local programs are omitted entirely, not counted.
Move the existing scenario tool below this disclosure; same pure classification on hypothetical
answers, no persistence. No second competing exclusions accordion.

**Assignment precedence:** scope → explicit receipt display → evaluate → reviewed proven
blocker/exclusion → ready/present-route group → other-to-check group. Preserve all in-scope
unreceived ready/almost IDs exactly once; preserve legitimate exclusions in the closed list.
Known evaluator correctness fixes get explicit separate test changes. Use the evidence/name
order in §5; categories remain subordinate. Empty groups disappear; with zero primary leads,
say “We need more information to narrow this down,” not “These are the closest.”

## Build plan

1. Freeze persona outputs and add counterexample fixtures before altering UI. Record separate
   evaluator and presentation expectations; retain current oracle contracts except explicit bug fixes.
2. Fix province scope and Okotoks in isolated changes, after source checks; test AB/BC/ON/other,
   all municipal levels/regions, Other/null city, Foothills path, scenarios and print. Assert no
   unknown local level resolves to nationwide and no out-of-province result inflates any count.
3. Fix unasked-homeowner false negatives and keyboard auto-advance separately. Test Kitchener
   unknown ownership, child/family ownership routes, radio arrows, Back/Next and restored answers.
4. Add a pure, exception-reviewed presentation classifier. Start with DTC-prerequisite separation
   and trigger-specific compact rows; do **not** ship the rejected age/function/income heuristics.
   Test missing/unsure/skipped inputs, alternatives, year-end age, seniors without OAS, local
   medical travel, working benefit recipients, scoped confirmations, and multiple unmet routes.
5. Render the three groups and DTC row; replace inflated headline/money shell; align EN/FR,
   category mode, scenario diff, print, tracker and document inputs. Assert unique membership,
   counts, unchanged ready status outside documented fixes, and guide links from every row.
6. Add optional receipt capture as the next bounded change. Test old BC `pwd` migration remains
   unknown receipt, none vs skipped, province edits, multi-program receipt, conflict review,
   approved tracker independence, local-only persistence, reload and stale-tab clearing.
7. Run unit/oracle and browser suites, readability surfaces, keyboard/screen-reader heading and
   disclosure checks, 320px/400% reflow and fresh light/dark/high-contrast runs for self/child/family.
   Bump shared asset pins for product asset changes. Review real-user comprehension before
   expanding predicates; keep #68's editorial/likelihood work explicitly separate.
