# TaskView #209 — Phase 2 three-gate pilot

Implemented and verified 2026-10-16. No commit, push, deployment, ticket changes,
or changes to protected workflow files.

## Scope and source review

Only these reviewed pairs are enabled. `grep -n
'mobilityplusRegistered\|cnibCustomer\|atpApproval' public/data.js` identifies
exactly one catalogue use per gate (lines 1329, 1387 and 1475).
All three are single-component questions. MobilityPLUS registration and ATP
approval are question version **2** after the accepted wording review; CNIB
customer status remains version **1**. Older version-1 answers to the two changed
questions are discarded rather than silently reused.

| Program ID | Gate / component | Question | Source snapshot re-read before implementation |
|---|---|---|---|
| `grt-taxi-coupons` | `mobilityplusRegistered` / `registered` | Are you currently registered with MobilityPLUS? | `research/reverify/snapshots/grt-taxi-coupons--1.txt` |
| `grt-cnib-pass` | `cnibCustomer` / `customer` | Are you a CNIB customer? | `research/reverify/snapshots/grt-cnib-pass--1.txt` |
| `grt-affordable-transit` | `atpApproval` / `approved` | Are you currently approved by the Region of Waterloo for the Affordable Transit Program? | `research/reverify/snapshots/grt-affordable-transit--1.txt` |

The snapshots were fetched 2026-10-16 and supplied in the working tree:

- Taxi coupons: “MobilityPLUS customers who live and travel in Cambridge,
  Kitchener and Waterloo can purchase taxi coupons.” Township trips are excluded;
  MobilityPLUS North Dumfries and Kiwanis Transit customers are not eligible.
  Help now quotes “Customers with seasonal eligibility may only purchase during
  active registration periods” and the exclusion for customers on MobilityPLUS
  North Dumfries or Kiwanis Transit services. The question explicitly asks about
  current registration; help also retains the three-city travel restriction. The existing `waterlooUrban` gate and complete
  requirement wording remain intact. This is a self-report about registration,
  not a new assertion that every individual trip is covered.
- CNIB: “Annual pass for CNIB customers” and “CNIB customers can ride GRT for
  free with a special CNIB EasyGO fare card.” Retained question and exact help:
  “This asks about your CNIB customer status, not your vision.”
- ATP: “Once you are approved for ATP” and “Who determines eligibility? ATP is
  managed by Region of Waterloo Community Services.” Eligibility lasts one year;
  children can participate through their household. The revised question asks
  explicitly about current Region of Waterloo approval. Help retains
  “Applying is not the same as being approved” and the one-year reminder. The separate residence and low-income gates still apply.

No gate was dropped; no benefit facts, amounts, sources, REQS predicates,
application-progress meanings, or `public/data.js` records were changed.
The other proposed gates remain disabled.

## Registry, engine and local state

The small registry lives in `public/stateManager.js`, exported as
`AbilityFinderState.FACT_REGISTRY`. Locating it at the persistence boundary gives
validation, the engine and UI one reviewed allowlist without another asset or
question-definition copy. The independent oracle has its own explicit evidence
fixtures rather than importing this production registry.

Persisted shape, separate from wizard `answers` and application `progress`:

```js
confirmedFacts: {
  "grt-cnib-pass": {
    cnibCustomer: { version: 1, components: { customer: "yes" } }
  }
}
```

- Schema version remains **2**; absent confirmations restore as `{}`.
- Plain-object validation bounds programs, gates, fields and components to the
  reviewed registry. Unknown, malformed, stale-version, oversized and invalid
  choices are discarded; hostile access errors cannot escape the fact validator.
  Accepted values are only `yes`, `no`, `unsure`; missing components remain unknown.
- `evaluate(benefit, scopedConfirmations = confirmedFacts)` permits a reviewed
  gate only for that program, matching version, and every component exactly yes.
  Fixed refusals run before the optional override. Other gates are unaffected;
  shared REQS predicates remain unchanged and never consult a global yes.
- `evaluateAnswers(answerModel, scopedConfirmations = {})` explicitly separates
  oracle evidence from answers. The scenario panel explicitly passes
  `confirmedFacts`, so real and hypothetical evaluations use the same checks.
  An unrelated scenario change therefore cannot falsely list a confirmed program
  as no longer ready. Preview evaluation never writes answers or confirmations.
- Changing subject clears all checks. Conservatively, other real wizard edits
  also clear all checks, including city-select edits. All existing start-over,
  reset and forget paths clear checks. Existing IndexedDB revisions, stale-tab
  conflict handling and tombstones are unchanged.
- Save failure leaves session controls usable and reports “Not saved on this
  device.” No new storage transport, database store or remote request was added.

## UI, privacy and accessibility

Relevant result cards contain collapsed native `<details>` titled
“Check this fact (optional)” inside Requirements to check. Detail and inline-guide
Requirements to check have the same controls. Ready programs retain the controls
for editing/clearing; a fixed refusal (`status === "no"`) hides checks in both
card and detail views. Guide unmet needs use the original `almost`-only condition;
only a non-refused pilot program may additionally retain its controls when ready.
Non-pilot refusal guides do not gain a Requirements block.

Each component uses native radio semantics: Yes / No / Not sure, initially
unselected. Each fieldset's visible legend names both program and question;
there is no competing `aria-label`. Child/family questions use
existing `who()` / `subj()` helpers, help uses `poss()`, and the person-to-answer-
about reminder is shown. The exact requested global helper is present. New
questions, help, announcements and checked-fact notes are marked `lang="en"`.

A change reevaluates only the affected program and patches status, requirement
text and mirrored radio state without replacing the focused controls, rendering
the whole page or moving/reordering cards. Regrouping occurs on the next normal
render/navigation; aggregate group counts/summaries remain at that render's
snapshot until then. The active disclosure alone politely announces
“Matches your answers. The program still decides.” A ready-to-not-ready change
politely announces “Checks updated.” (including clearing a ready check).
Empty status regions remain
in the accessibility tree before their first update.

Ready copy remains “Matches your answers” plus the existing program-decides
caveat. Contributions add “Includes facts you checked on this device.” Results,
detail summaries and the person's own personalized printout carry this qualifier.
The radios have themed borders/fills/focus indicators, 44px label targets,
forced-colors fallback, and narrow-screen wrapping. No animation was added.

Facts never enter URLs, generic/static guides, copy-guide links, calendar text,
assistant messages or feedback. The two existing network payloads remain
`{ messages: askHistory }` and `{ kind, email, message }`; no fact state is added.
Personalized print output remains local and includes the caveat; interactive
checks are hidden in print. Static guide regeneration changes asset pins only.

## Oracle change

`SPEC_VERSION`: **1.29.0 → 1.30.0**.

Added evidence category **`scoped-fact`**, not a redefinition of `answers` or an
unconditional satisfy fragment. Three explicit, program/version/component-scoped
fixtures live separately in `SCOPED_FACTS`. Best-case personas pass them separately
to the real engine; refusal/violation cases retain that explicit channel too.
Actual external-evidence gates keep the invariant that they cannot yield ready.

The proposal's historical 54 / 80 baseline no longer describes this checkout:
subsequent gate reviews had already changed the frozen table. Verified current
no-confirmation baseline is **45 ready / 89 almost / 0 no**, across 134 programs.
`PROGRAM_NO_CONFIRMATION` and a full-catalogue test preserve every one of those
program outcomes. With explicit confirmations only:

| Program | Without checks | Explicit current-version Yes |
|---|---|---|
| `grt-affordable-transit` | almost | ready |
| `grt-cnib-pass` | almost | ready |
| `grt-taxi-coupons` | almost | ready |

Thus the conditional best-case split is **48 ready / 86 almost / 0 no**.
No/no confirmation/Not sure cannot produce those gains. Oracle log:
134 programs, 212 gates, 97 external gates, 19 unchanged answer dimensions,
470 asserted best/violation outcomes: 48 ready, 160 almost, 262 no.

## Files changed by this implementation

- `public/stateManager.js`: reviewed registry, strict sanitizer and scoped gate
  helper; allowlisted compatible snapshot field.
- `public/app.js`: local checks, evaluation contract, reset/invalidation, controls,
  in-place updates, notices and personalized print qualifier.
- `public/styles.css`: themed controls, reflow, focus, forced-colors and print;
  font asset pins.
- `public/index.html`: all shared pinned assets **186 → 187**.
- `public/changelog.js`: plain changelog entry, **no `revision` or `changes`**.
- `public/guides/*.html`: `npm run gen:guides`; 133 benefit pages plus index,
  **134 files**, each only changing the stylesheet version pin. Generic guides
  do not gain controls or personal evidence.
- `e2e/oracle/oracle-spec.js`, `e2e/oracle/build-personas.js`,
  `e2e/eligibility-oracle.spec.js`: separate scoped evidence and baseline guard.
- `test/confirmed-facts.test.js` (new): registry/catalogue agreement, sanitizer,
  compatible round trip and engine acceptance/refusal cases.
- `test/requirements-layout.test.js`: supply the production registry dependency
  and no-wizard stub to the existing extracted-renderer test harness.
- `e2e/scoped-facts.spec.js` (new): ten pilot journeys.
- This implementation note and `outputs/pilot-*.log` verification evidence.

Existing reverify queue/snapshot diffs and unrelated output files were left
untouched. Whole-tree `git diff --check` reports pre-existing Markdown hard-break
trailing spaces in `research/reverify/QUEUE.md`; implementation paths pass the
scoped whitespace check. No protected file was edited.

## Final verification (no retries)

| Command | Result |
|---|---|
| `npm run gen:guides` | Passed; 133 benefit pages plus index; usual `local-supports` static-source skip |
| `npm test` | **207 passed / 207**, 0 failed/skipped |
| `npm run check:surfaces` | Passed; no benefit-text density increases |
| `npx playwright test --project=app-chromium --workers=1` | **278 passed / 278 listed**, 25 files, 0 failed/skipped |
| `npx playwright test --project=app-webkit --workers=1 e2e/scoped-facts.spec.js e2e/persistence*.spec.js` | **63 passed / 63 listed**, 3 files, 0 failed/skipped |
| `npx playwright test --project=app-webkit --workers=1 e2e/at-kit.spec.js` | **6 passed / 6**, 0 failed/skipped |

The full Chromium project includes the new ten pilot tests, all eight oracle
tests, persistence-chaos, persistence, AT-kit and requirements-layout checks.
WebKit covers the same ten pilot tests plus all 53 persistence/chaos tests;
AT-kit was also run separately there. The existing requirements/persistence
journeys exercise every route with self/child/family and fresh themed reloads.

Pilot browser coverage: exact program placement; initially unselected native
radios; No/Not sure stay almost; Yes flips only scoped evaluation; preserved
focus and DOM card order; polite live text; reload restores Yes; clear survives
reload; subject change clears persisted facts; no requests while answering;
no page errors; detail subject wording; fresh dark/light/contrast reloads;
keyboard operation; 320px viewport (400%-equivalent reflow); fixed refusal
survives Yes; failed-save notice with usable session answers.

Accepted-review verification logs: `outputs/pilot-review-unit.log`,
`pilot-review-surfaces.log`, `pilot-review-chromium.log`,
`pilot-review-chromium-listed.log`, `pilot-review-webkit.log`, and
`pilot-review-webkit-listed.log`. Asset version remains **187**. Guide generation
and the separate WebKit AT-kit row above are retained from the original pilot run,
not rerun for this review. Earlier `pilot-*.log` and the focused
`pilot-review-targeted.log` capture development history (including a test that
initially queried an accessibility group inside a collapsed disclosure); they are
not the final verdict. Final browser project runs used no retries.

Added review regressions cover scenario fact parity without changing real state,
a non-pilot fixed-refusal guide without a Requirements block, a pilot refusal
without checks in either view, an actual persisted old snapshot with no
`confirmedFacts`, legend-derived group names, and the polite ready-to-not-ready
announcement. The changed-question oracle fixtures now use version 2; unit
validation exercises rejection of their stale version-1 answers.

### Human review still required

Automated DOM/keyboard/reflow tests do not certify actual VoiceOver/NVDA speech,
comprehension, fatigue, or usability for disabled readers. The 320px test is a
400%-equivalent layout check, not a claim of a human browser-zoom/SR session.
The optional wording and status labels remain unverified for comprehension until
owner-led disabled-reader review. No production deployment was performed.
