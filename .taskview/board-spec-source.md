# board-spec source outline (Phase 0)

Fact-carrying outline for `.taskview/board-spec.json`. Every fact here was read out of
the repo docs on 2026-08-01. **Do not add facts that are not in this file.** If a field
needs a fact that is not here, write `TBD — verify against official source on the day`.

Priority mapping: High=3, Medium=2, Low=1.
Statuses used: `Backlog`, `Done`.

## Corrections applied to the brief's proposed epic set (evidence-based)

1. **AF-E06 reframed.** The brief calls it "PERF-01 residual JS gating + async IndexedDB
   restore". `REMAINING-WORK.md` records PERF-01 **closed 2026-07-30 as WON'T FIX by owner
   decision** after live measurement. There is no residual JS-gating work item. E06 becomes
   a keep-closed decision record plus the unmeasurable-INP note.
2. **AF-E05 shrunk.** The brief lists "money-band prominence" and "conditional-results
   framing" as open decisions. Both **closed 2026-07-30 (`00fb18f`)**. E05 keeps DATA-25,
   UX-02, UX-03 only.
3. **AF-E02 shrunk.** The brief's coverage gaps are mostly built. Excise gasoline tax
   refund, CPP children's benefits, multigenerational home renovation tax credit, Alberta
   CAPCC, Alberta service-dog ID and Alberta special-needs housing were **all built and
   deployed 2026-07-29**. Real remaining: Plan B placement, provincial child/family scope,
   Plan X stays closed.
4. **Two epics gained work the brief did not name**: the un-rotated Cloudflare API token
   (E08, High, security) and the `[app-chromium]` CI timeout family that has now blocked
   two good releases (E04, High).
5. **`WEBSITE-PROJECT-TRACKER.md` and `ROADMAP.md` carry stale rows** relative to
   `REMAINING-WORK.md`. Reconciling them is its own story (AF-S1406), not a silent fix.
6. **Dependency deviation.** The brief says "AF-E11 blocked by the province source-audit
   checklist story". That checklist is a *child* of E11, so an epic→own-child edge would be
   circular. Modelled instead as AF-S1102 dependsOn AF-S1101. Flagged for the owner.

---

# EPICS

| key | title | pri | status | area | tags |
|---|---|---|---|---|---|
| AF-E01 | EPIC — Data accuracy and freshness | 3 | Backlog | data | type:epic, area:data |
| AF-E02 | EPIC — Coverage gaps and scope decisions | 2 | Backlog | research | type:epic, area:research |
| AF-E03 | EPIC — Human accessibility and usability testing | 3 | Backlog | a11y | type:epic, area:a11y, blocker:release, human-only |
| AF-E04 | EPIC — Testing and quality infrastructure | 3 | Backlog | testing | type:epic, area:testing |
| AF-E05 | EPIC — Open product decisions | 2 | Backlog | ux | type:epic, area:ux |
| AF-E06 | EPIC — Performance and first load | 1 | Backlog | perf | type:epic, area:perf |
| AF-E07 | EPIC — Release readiness and NO-GO lift | 3 | Backlog | ops | type:epic, area:ops, blocker:release |
| AF-E08 | EPIC — Deploy, ops, and link monitoring | 3 | Backlog | deploy | type:epic, area:deploy |
| AF-E09 | EPIC — Horizon 1: Alberta polish | 2 | Backlog | content | type:epic, area:content |
| AF-E10 | EPIC — Horizon 2: For Professionals v1 | 1 | Backlog | content | type:epic, area:content |
| AF-E11 | EPIC — Horizon 3: Canada-wide, province by province | 1 | Backlog | research | type:epic, area:research |
| AF-E12 | EPIC — Horizon 4: Multi-audience streams | 1 | Backlog | research | type:epic, area:research |
| AF-E13 | EPIC — Horizon 5: Agency product | 1 | Backlog | research | type:epic, area:research |
| AF-E14 | EPIC — Agent ops and board integration | 2 | Backlog | ops | type:epic, area:ops |
| AF-E15 | EPIC — Shipped and closed (history) | 1 | Done | ops | type:epic, area:ops |

Epic goals / why-it-matters (one line each, use verbatim):

- **AF-E01** — Keep every published amount, rule, form, phone number and date true on the
  day a user reads it. The product's largest ongoing risk is silent factual decay, not a
  missing feature; a wrong figure costs a disabled person money or a scarce appointment.
- **AF-E02** — Close the remaining catalogue coverage questions that are genuinely scope
  decisions rather than research tasks, and stop re-opening ones already decided.
- **AF-E03** — The sole remaining NO-GO condition. No screen-reader user has ever completed
  a journey through this product; automated checks cover roughly a third of real problems.
- **AF-E04** — Give eligibility outcomes a systematic regression net, and stop CI flakiness
  from blocking good releases.
- **AF-E05** — Three audit findings are mitigated rather than closed and each needs a
  product decision, not more code.
- **AF-E06** — Record why first-load work is closed, so the rejected optimisations are not
  re-attempted, and keep the unmeasurable field metric visible.
- **AF-E07** — The gate everything else feeds. The audit's original NO-GO has never been
  formally lifted.
- **AF-E08** — Keep production correct, free, and provably released, and keep the link
  monitor acted on.
- **AF-E09** — Owner horizon 1: make the Alberta service complete enough that organizations
  and clinics have no comparable alternative.
- **AF-E10** — Owner horizon 2: adviser-facing material, built only through legally clean
  practitioner structures.
- **AF-E11** — Owner horizon 3: one province at a time to the Alberta/B.C. depth bar.
  National-but-shallow is explicitly rejected.
- **AF-E12** — Owner horizon 4: additional audience streams, one at a time, same
  verified-depth treatment.
- **AF-E13** — Owner horizon 5: a separate paid agency portal — the deliberate, scoped
  revisit of the no-accounts rule, applying to that product only.
- **AF-E14** — Make the board, GitHub and Slack one coherent system, and keep the project
  docs honest.
- **AF-E15** — Rolled-up history, including the disproved and rejected outcomes, so no agent
  re-does or re-opens settled work.

---

# STORIES

Format per story: `key | title | pri | status | area | extra tags | facts | doneWhen`.
`facts` is what goes into Summary + Context. Use nothing else.

## Under AF-E01 (area:data)

**AF-S0101 | [DATA] Establish the /api/link-health review cadence | 2 | Backlog**
Facts: ROADMAP priority 1 says review `/api/link-health` regularly and replace genuinely
broken or soft-404 links using official destinations. The link monitor runs on a cron with
KV report storage. The rotating monitor lives in `src/link-check.js`; `src/links.js` is
generated and never hand-edited.
DoneWhen: a stated review cadence exists; the latest report has been reviewed; every broken,
redirected, stale, unreachable or inconclusive source has a disposition.

**AF-S0102 | [DATA] Re-verify benefit figures before their freshness dates age out | 3 | Backlog**
Facts: `BENEFIT_VERIFIED` is updated only after an actual official-source review. Verify
amounts, cutoffs, eligibility rules, forms, phone numbers, processing times, application
status and municipal details against the current official page **on the day of the change**.
`canada.ca` returns 403 to automated fetch — read the CRA page in a real browser rather than
trusting a search summary. Refuse a figure the official page does not state: the HATC has no
percentage rate or maximum dollar credit in the record on purpose, and "$3,000" is a figure to
refuse, not copy; `excise-gasoline-tax-refund` states no per-litre amount on purpose and gives
the CRA number 1-877-432-5472 instead. Third-party figures have been wrong: BC RAHA's widely
quoted $134,140 limit, the multigenerational credit's "15%" and "$7,500".
DoneWhen: no record is past its verification date without a same-day official-source check;
every changed figure has its source URL; a `DATA_CHANGELOG` entry exists for each fact change.

**AF-S0103 | [DATA] Re-verify GRANTS_DIRECTORY and ORGS_DIRECTORY entries | 2 | Backlog**
Facts: both directories carry verified dates that age out. `public/grants-data.js` and
`public/orgs-data.js` changes require `npm run gen:context`. Directory records describe what
an organisation offers and route to its own program pages — that is correct behaviour for a
directory and is not an intake-status claim (see ABFED-16/17, disproved).
DoneWhen: every entry past its verified date is re-checked against the organisation's own page
and its date refreshed or its record corrected.

**AF-S0104 | [DATA] Keep the data-change procedure enforced | 2 | Backlog**
Facts: after `BENEFITS`, `HELP_ORGS`, `PRACTITIONER_FORMS`, `public/grants-data.js` or
`public/orgs-data.js` change, run `npm run gen:context`; after `BENEFITS` changes run
`npm run gen:guides`; append a `DATA_CHANGELOG` entry in `public/changelog.js`; bump the shared
`?v=N` in `public/index.html` when a browser-loaded asset changes and update matching font URLs
in `public/styles.css`. Generated files (`src/**`, `public/guides/**`, `public/sitemap.xml`)
are regenerated by their scripts, never hand-edited. `test/docs-consistency.test.js` fails if
the docs drift from the catalogue.
DoneWhen: the procedure is stated in the ticket and every data landing shows the generator
runs and the version bump in its evidence.

**AF-S0105 | [DATA] Re-check Camrose and other municipalities one program at a time | 1 | Backlog**
Facts: ROADMAP priority 3. Keep local transit and recreation rules distinct; never clone
another city's policy. Programs that look similar have materially different AISH exclusions,
transit prices and recreation coverage. Calgary's "75% off recreation" was invented and the
2026-07-28 sweep proved Calgary was the outlier, not the pattern — `medicinehat-fair-entry`,
`grandeprairie-aish-pass`, `airdrie-fair-access`, `surrey-leisure-access` and `aadl` were all
correct; `woodbuffalo-lift` had one error fixed (official is "10 and 25-ride passes", the
record said 20-ride in `detail.about` while its own tip already said 25).
DoneWhen: each municipality researched program by program against its own city source, with
no rule carried over from another city.

**AF-S0106 | [DATA] Hold AISH/ADAP signer guidance until Alberta publishes an official list | 1 | Backlog | type:decision**
Facts: do not publish an exhaustive AISH/ADAP signer-profession list until Alberta provides
one. Existing CPP-D and parking-placard signer guidance may remain because those lists have
official support. AGENTS.md priority 3 states the same.
DoneWhen: the ticket records the hold; it moves only when Alberta publishes an official list.

## Under AF-E02 (area:research)

**AF-S0201 | [SCOPE] Decide where the PharmaCare Plan B long-term-care warning belongs | 2 | Backlog | type:decision, needs-owner-decision**
Facts: Plan B was verified 2026-07-29 but deliberately **not built** — it needs a scope
decision first. Facts verified: 100% of eligible prescription drugs and medical supplies for
permanent residents of licensed long-term care facilities **registered with Plan B**; coverage
is automatic on becoming a permanent resident, so like Plan F it has no application of its own;
**not all facilities are registered** and the province suggests asking before moving in; it
does not apply to extended-care, acute-care, multi-level or assisted-living facilities, nor to
short-term or respite stays. The scope problem: the questionnaire never asks whether someone
lives in long-term care, and there is no existing record to attach this to the way Plan F
attached to `bc-at-home-medical`. The genuinely useful content is the warning to check a
facility's Plan B registration **before** moving in.
DoneWhen: an owner decision records where that warning lives, or that it is not carried.

**AF-S0202 | [SCOPE] Decide whether provincial child/family benefits are in scope | 2 | Backlog | type:decision, needs-owner-decision**
Facts: the Alberta Child and Family Benefit and the B.C. Family Benefit are income-based
rather than disability-based. ROADMAP files these as scope questions rather than gaps.
DoneWhen: an owner decision is recorded either way, and ROADMAP's "Scope questions rather than
gaps" entry reflects it.

**AF-S0203 | [SCOPE] PharmaCare Plan X stays closed — do not re-open | 1 | Done | type:decision**
Facts: closed as out of scope 2026-07-29 by owner decision. Unlike the other plans without
records it does have a real enrolment route — PharmaCare "cannot determine eligibility for the
program or enrol individuals in it", and the BC Centre for Excellence in HIV/AIDS Drug
Treatment Program does. It was excluded because it is condition-specific rather than
disability-based, not because the route is unclear. If condition-specific records ever come
into scope, re-verify against `bccfe.ca` — the `gov.bc.ca` page is a 2012 policy-manual entry
last updated March 2025.
DoneWhen: already done. The ticket exists so the decision is discoverable from the board.

**AF-S0204 | [PROCESS] Check the catalogue by record id before recording a coverage gap | 1 | Backlog**
Facts: five gap entries were written from a hub sweep without first reading the record that
already covered it — B.C. MSP Supplementary Benefits (shipped 2026-07-28 in `7b8e9db`),
PharmaCare Plan P (shipped 2026-07-29), Plan F (no application of its own; MCFD submits the
information, so it arrives with At Home Program enrolment), the B.C. annual earnings exemption
(already in `bc-disability-assistance-pwd`'s note), and Plan S. The 2026-07-29 re-audit checked
every remaining open item against `public/data.js` by record id and by keyword. Note the
standalone per-plan PharmaCare URLs are unreliable — the Plan P one 404s — so read the section
anchors on the `who-we-cover` hub instead.
DoneWhen: the check is stated as a required step before any new coverage-gap entry.

## Under AF-E03 (area:a11y — every story also carries `human-only`)

**AF-S0301 | [A11Y] Repeat the VoiceOver guide test with item-by-item navigation | 3 | Backlog | blocker:release**
Facts: first real VoiceOver + Safari pass done 2026-07-28. On guide page
`bc-csg-services-equipment` VoiceOver read the full h1, then jumped straight to "Good to know",
skipping the `.detail-lede` summary and the whole "What it is" block, then jumped far down the
page. **Not explained by our markup**: the Chromium accessibility tree exposes every section as
a heading plus its text in document order, with "What it is" present between the title and
"Good to know", nothing `aria-hidden`, heading order h1 → h2×10. What is still needed: how
VoiceOver was being driven — item-by-item (VO+Right / swipe right), heading rotor, or landmark
rotor. Heading and landmark navigation legitimately skip body text; **only item-by-item
navigation skipping it would be a defect.**
DoneWhen: the test is repeated with the navigation mode recorded, and the finding is either
reproduced as a defect or closed as expected rotor behaviour.

**AF-S0302 | [A11Y] Run a real NVDA pass | 3 | Backlog | blocker:release**
Facts: NVDA has never been run. ROADMAP priority 2 asks for VoiceOver/NVDA and meaningful
reading order. Automated axe is deliberately excluded and cannot substitute.
DoneWhen: a real NVDA pass covers the wizard, a results page and a guide page, with findings
written as reproducible issues rather than broad redesign requests.

**AF-S0303 | [A11Y] Run a real TalkBack pass | 3 | Backlog | blocker:release**
Facts: TalkBack has never been run.
DoneWhen: as above, on Android.

**AF-S0304 | [A11Y] Confirm Safari behaviour with Full Keyboard Access on and off | 3 | Backlog**
Facts: found 2026-07-28 by the new WebKit project. Chromium tabs
`A#skipLink → BUTTON#headerMenuToggle → A#brandHome…`; WebKit tabs
`SELECT → INPUT → TEXTAREA → BODY`, skipping links and buttons entirely. That is **Safari's
default until the user enables Full Keyboard Access — not an app defect.** But it means a
Safari keyboard-only user cannot Tab to the skip link, and the accessibility dialog, which
contains only `<button>`s, cannot be Tab-traversed at all. VoiceOver users are unaffected
because they navigate with the VO cursor, not Tab.
DoneWhen: behaviour recorded with FKA both enabled and disabled, and a decision recorded on
whether the product says anything to Safari keyboard users.

**AF-S0305 | [A11Y] Complete the touch-target sizing review | 2 | Backlog**
Facts: still outstanding from the 2026-07-28 owner pass, which did cover 200% text, 400%
zoom/reflow, 320px portrait, forced-colours and print/print-to-PDF with no cut-offs, no
horizontal scrolling and nothing hidden.
DoneWhen: every interactive target is measured and any undersized target is fixed or recorded.

**AF-S0306 | [A11Y] Obtain an accessibility specialist's judgement | 3 | Backlog | blocker:release**
Facts: the 2026-07-28 owner pass was a spot check. A specialist's judgement rather than a spot
check is still outstanding. Contrast must clear 4.5:1 on every background including semantic
soft tints.
DoneWhen: a specialist has reviewed and their findings are dispositioned.

**AF-S0307 | [A11Y] Run the disabled-user study | 3 | Backlog | blocker:release**
Facts: keyboard, switch, voice, magnification and assistive technology, plus cognitive
fatigue, pain and financial stress. Users may be tired, in pain, short on money, or
experiencing cognitive fatigue. Document findings as reproducible issues, not broad redesign
requests. ROADMAP priority 2 also asks for keyboard-only completion of the full journey,
200–400% zoom and reflow, reduced-motion behaviour and scroll reveals, and plain-language
comprehension.
DoneWhen: the study has actually happened with real disabled participants and every finding is
written up reproducibly.

**AF-S0308 | [A11Y] Disposition every finding from AT and user testing | 3 | Backlog | blocker:release**
Facts: release gate item — "resolve or disposition every issue found during that testing".
DoneWhen: each finding is fixed, or recorded with an explicit reason for not fixing.

**AF-S0309 | [A11Y] Guide sections stay without accessible names | 1 | Backlog | type:decision**
Facts: observation, deliberately NOT changed 2026-07-28. Each guide page has 10
`<section class="guide-block">` with no `aria-label`, no `aria-labelledby` and no `id` on the
`h2`s, so they map to `generic` rather than `region`. Adding `aria-labelledby` would turn them
into 10 named landmarks per page, which is rotor **noise**, not help. Screen-reader users
navigate long documents by heading, and the headings are correct and complete. Recorded so
nobody "fixes" it reflexively — but confirm it during the real AT testing.
DoneWhen: already decided. Re-open only with evidence from real screen-reader users.

**AF-S0310 | [A11Y] Automated axe stays deliberately excluded | 1 | Backlog | type:decision**
Facts: the audit lists axe as supplemental and the recommendation is to skip it for now.
Automated tooling catches roughly a third of real accessibility problems, and here it would
produce a green check reading "accessible" while the actual documented gap is that **no human
using a screen reader has ever used this product**. A passing axe run would make that gap feel
closed. Leave the absence visible until the AT testing actually happens.
DoneWhen: already decided. Revisit only after the AT testing has happened.

## Under AF-E04 (area:testing)

**AF-S0401 | [TEST] TEST-01 — build the eligibility oracle and regression suite | 3 | Backlog**
Facts: TEST-01 is one of the two genuinely open audit findings. There is no systematic
eligibility oracle across all programs, and that gap is what allowed the false-ready cluster
(DATA-42/43/44, DATA-30/47/48/49/50, DATA-33/35/36/37/39/40/41, ABFED-02/08, BC-BC-05/14/16 —
all fixed individually). It must cover outcome sets across every program. Land it as its own
small change: do not mix new test infrastructure with fixes for what it surfaces, because that
produces an unreviewable diff and un-bisectable failures. Treat the first red run as findings
to triage separately, not as something to force green in the same change.
DoneWhen: every program has asserted outcome sets; a plausible mutation makes the suite fail;
the first red run's findings are triaged as separate tickets.

**AF-S0402 | [TEST] Root-cause the [app-chromium] 90-second timeouts that only appear on CI | 3 | Backlog**
Facts: run `30574672375` on `47bee58` was cancelled at the 45-minute job cap, so `deploy` was
skipped and a good commit never reached production. It was **not** the browser-install problem
— the Playwright cache hit, system dependencies took 3.8 min and unit tests 0.13 min. All
**39.2 minutes** went into the single "Browser and Worker tests" step, accumulating 90-second
timeouts: `bc-live.spec.js:194`, `:205`, `:366` (one failing on `locator.click`),
`persistence.spec.js:184` failing inside `pick("I'm not sure…")`, and
`reminder-calendar.spec.js:185`, `:214`, `:245`. **Every one was `[app-chromium]`.** With
`retries: 0` by design each failure costs a full 90 seconds, which is how one bad run reaches
the cap. The commit is exonerated: an empty re-trigger commit (`f19fc23`) put the identical
tree through CI in **16.5 minutes, green**, inside the 14.9–16.4 minute band of the seven runs
before it. Same tree, same suite, opposite outcome — the run was the variable, not the code.
This is the **second** time the job cap blocked a good release (30 min 2026-07-28, 45 min
2026-07-30). Raising the cap treats the symptom. Related but distinct and already fixed: the
wizard `rise` animation race (`public/styles.css:371`, 0.5s, 10px, `.options` gap 10px) that
`settleWizardCard` now covers — 2 stalls in 5 full runs before the fix, 0 in 4 after. The
honest state of this family is **rarer, not eliminated**.
DoneWhen: the mechanism is understood by measurement rather than guessed; the cap is not raised
as the fix; a full CI run is reproducibly inside the normal band.

**AF-S0403 | [TEST] Keep retries:0 and read results with grep -E "passed|failed|flaky" | 1 | Backlog | type:decision**
Facts: `retries: 0` is deliberate, so a flake surfaces instead of being laundered into a pass.
Always read Playwright results with `grep -E "passed|failed|flaky"`, never a truncated tail —
a truncated tail produced a wrong report once already. A flaky baseline trains you to skim
failures, which is the habit behind that reporting error.
DoneWhen: already decided. The ticket exists so neither is changed for convenience.

**AF-S0404 | [TEST] Reduced-motion stays out of the suite default | 1 | Backlog | type:decision**
Facts: deliberately not fixed by defaulting the suite to `reducedMotion: "reduce"`. That would
buy green by deleting a real accessibility surface from the tests — motion is something this
product has to get right, and `e2e/a11y-batch.spec.js:103` opts into `no-preference` precisely
to exercise it. The same reasoning rejected adding `reducedMotion` to the Firefox
`wizard-accessibility.spec.js:38` fix.
DoneWhen: already decided.

**AF-S0405 | [TEST] Preserve the mutation-tested guards | 1 | Backlog**
Facts: guards that exist because something went dark or shipped broken —
`test/requires-note-rendered.test.js` (44 records, mutation-tested three ways),
`test/guide-note-heading.test.js` (fails if the old "Who it is for" heading returns),
`e2e/matcher-safety.spec.js` (the renovation-credit gate, and the `mb.upTo` money-band case
asserting `"Jusqu'à ~$4,500 / an"`), `test/worker-transport.test.js` (asserts `wrangler.jsonc`
does not match `/run_worker_first/`), `test/docs-consistency.test.js`. The `mb.upTo` branch is
unreachable from any real catalogue profile — 540 were probed — but it is **not dead code**;
deleting it would have broken a passing test and removed correct behaviour.
DoneWhen: no guard is weakened or deleted to make a change pass.

## Under AF-E05 (area:ux)

**AF-S0501 | [DATA] DATA-25 — replace mitigated DTC readiness with verified CRA criteria | 3 | Backlog**
Facts: DATA-25 is mitigated, not closed, and is the only High/P1 finding still outstanding —
every other High/P1 release blocker is closed. It needs properly verified CRA
functional-criteria questions. Eligibility is about functional limitation, not diagnosis:
never imply a diagnosis alone guarantees a benefit or that a universal list of qualifying
disabilities exists. Never turn an unasked or lay questionnaire answer into an official
eligibility verdict.
DoneWhen: the DTC questions come from the current CRA functional criteria verified that day;
no unasked criterion produces a "ready" verdict.

**AF-S0502 | [UX] UX-02 — stop the homepage overpromising completeness or certainty | 2 | Backlog**
Facts: mitigated only. Needs a content pass plus comprehension testing. `renderSafely()`
covers every route and must keep doing so; never allow a blank page.
DoneWhen: the copy no longer claims completeness or certainty, and comprehension testing
confirms readers do not infer it.

**AF-S0503 | [UX] UX-03 — explain or replace the editorial priority-order weights | 2 | Backlog**
Facts: mitigated only. "Priority order" uses unexplained editorial weights; the formula is
still unexplained and unvalidated.
DoneWhen: the ordering is either explained to the user in plain language or replaced with one
that can be justified, and it is validated against real profiles.

## Under AF-E06 (area:perf)

**AF-S0601 | [PERF] PERF-01 stays WON'T FIX — do not re-attempt the rejected optimisations | 1 | Done | type:decision**
Facts: closed 2026-07-30 as WON'T FIX by owner decision after measuring production directly.
Live measurement of `https://abilityfinder.ca/`: TTFB **168 ms**, domInteractive **754 ms**,
load **759 ms**, total script transfer **212 KB**. `data.js` is 96 KB and finishes at 636 ms;
`app.js` is 76 KB and finishes at **751 ms**, so **`app.js` is the critical path and deferring
or splitting the catalogue would not move first paint** — the obvious optimisation does not pay.
The earlier throttled re-measurement already had LCP **2364 ms**, inside the "good" band, with
CLS **0** and long tasks **0 ms**. The only change that would actually move first paint is real
above-the-fold markup in `<main id="app">` instead of the loading placeholder, and it was
rejected on risk: it duplicates `renderLanding` as a second, language-less copy, and it would
flash the landing hero at any returning user whose restore routes them to a saved wizard step —
against the "restore must complete before the first meaningful render" rule and the
persisted-blank-page incident in `ARCHIVAL_KNOWLEDGE_BASE.md`. Confirmed in passing: Cloudflare
still injects its beacon at the edge and the CSP still blocks it, `transferSize` 0. First-load
CLS was separately reduced from a measured `0.0905` to `0.0000` and duplicate font downloads
were removed.
DoneWhen: already done. Re-open only with an owner decision and new measurement.

**AF-S0602 | [PERF] Record that field INP stays unmeasurable | 1 | Backlog**
Facts: INP stays unmeasurable in the field because that needs real users and there is no
analytics by design. Assess real-user Core Web Vitals manually when practical; do not add
analytics by default.
DoneWhen: the limitation is recorded where a future agent will see it before proposing
analytics.

## Under AF-E07 (area:ops — all carry `blocker:release`)

**AF-S0701 | [REL] Lift the NO-GO only when all four conditions have evidence | 3 | Backlog**
Facts: the audit's original NO-GO has not been formally lifted. All four must be true and the
first two are not: (1) the remaining code findings are fixed or visibly qualified; (2) manual
disabled-user and assistive-technology testing has actually happened; (3) the outstanding
official clarifications are resolved — BC-BC-09, BC-BC-15, ABFED-16/17 and DATA-11 were all
closed 2026-07-28, so this condition is met; (4) a clean production smoke test follows the
final release candidate. Code completeness is not the blocker; the untested accessibility is.
DependsOn: AF-S0307, AF-S0308, AF-S0702, AF-S0703.
DoneWhen: all four conditions carry evidence and the owner changes the release status.

**AF-S0702 | [REL] Run the full release-candidate test and generation checklist | 3 | Backlog**
Facts: review the complete local diff and separate intentional source changes from generated
changes; confirm generated guides match `public/data.js`; confirm `src/benefits-context.js`
matches the generator output; confirm `?v=N` references are consistent; run `npm run
gen:context`, `npm run gen:guides`, `npm test`, `npm run test:e2e`, `git diff --check`,
`npx wrangler deploy --dry-run`; review generated diffs; record test totals, date and the
commit candidate. Current baseline is 110 unit and 420 e2e across six projects. Commit, push
or deploy only with explicit owner authorization.
DoneWhen: every checklist item has recorded output and the totals are written down.

**AF-S0703 | [REL] Clean production smoke test after the final release candidate | 3 | Backlog**
Facts: a `deploy` job reporting success does not prove it deployed — it exits 0 either way,
warning and skipping when the token is absent. Confirm a real release against the live site's
asset `?v=N`, never from the job's own conclusion. And a successful deploy does not mean the
edge is serving it yet: on 2026-07-29 a smoke test fired immediately after deploy returned 200
for new guide URLs while `/` still advertised the previous `?v=N` and every content check
returned 0. Nothing was wrong — propagation was mid-flight, and re-running a moment later
showed the correct version and content. **When a post-deploy check disagrees with itself, re-run
it before concluding anything.** Do not report the zeros as a failure and do not explain them
away. Also: between a push and the next green deploy the earlier commit's new pages 404 in
production, so do not push a second change while the first still needs live verification.
DoneWhen: the smoke test is clean on a re-run, against the live site, on the final RC.

## Under AF-E08 (area:deploy / area:ops)

**AF-S0801 | [SEC] Rotate the Cloudflare API token | 3 | Backlog | human-only, needs-owner-decision**
Facts: owner's call, still open. The token in GitHub has **not been rotated** and its value was
pasted into a chat transcript. It is live, Workers-edit scoped, and demonstrably able to
deploy. `CLOUDFLARE_API_TOKEN` is set as a repository secret and CI is the only path to
production. **Never put the token value in a ticket, branch, commit, PR, log or command line.**
DoneWhen: the token is rotated by the owner and the repository secret is updated, with a
release proven after the rotation.

**AF-S0802 | [OPS] Keep the CI deploy gate intact and prove releases against the live site | 3 | Backlog**
Facts: the gate is live and proven, not advisory. `.github/workflows/ci.yml` runs `npm test`
plus the six-project Playwright matrix on every push to `main`, and the `deploy` job has
`needs: test`, so a red suite physically cannot reach production. Workers Builds is
disconnected. All three states were observed: `73a1ddf` red/skipped but Workers Builds still
shipped it via the old ungated path; `f718bfa` and `974b0c5` red/skipped with nothing shipped;
`db92994` green/deployed and verified live at `?v=73`. **A CANCELLED test job blocks the deploy
exactly like a red one**, through `needs: test`. Pushing again cancels an in-flight run by
design (`concurrency: cancel-in-progress`) — harmless when the newer commit contains the older
one (on 2026-07-29 `be6d5e9` was cancelled by `e226332` and `?v=87` shipped both, so `?v=86`
never deployed as its own step).
DoneWhen: the gate is unchanged and every release is confirmed against the live site.

**AF-S0803 | [OPS] Preserve the Playwright browser cache conditions | 1 | Backlog**
Facts: on 2026-07-28 the `Install Playwright browsers` step took **16m37s** on one runner, the
job hit its then-30-minute cap mid-suite and was cancelled, and a good release was blocked by a
slow mirror. Browsers are now cached at `~/.cache/ms-playwright`, keyed on the resolved
`@playwright/test` version so a bump invalidates it automatically, and the cap is **45
minutes**; normal runs land near 14 minutes. If those cache conditions are ever touched:
`cache-hit` is a **string**, so comparisons must be against a quoted `'true'`. GitHub coerces
mixed-type comparisons to numbers — `"true"` → NaN, `true` → 1 — so an unquoted `== true` is
always false and `!= true` always true. Written unquoted, the cache is populated and never
read and the whole step is silently pointless.
DoneWhen: the conditions stay quoted and the cache is observed to hit.

**AF-S0804 | [OPS] REL-06 stays WON'T FIX on zero-spend grounds | 1 | Done | type:decision**
Facts: root cause found 2026-07-28. The "contradictory API routing" is **request-mode
dependent**, not network- or region-dependent: `/api/link-health` returns **200
application/json** to `curl`/`fetch` and **404 `text/html`** (our own 404 page) to a top-level
browser navigation. Bisected to a single header — **`Sec-Fetch-Mode: navigate`** alone flips
it; `Sec-Fetch-Dest`, `Sec-Fetch-Site`, `Sec-Fetch-User` and `Upgrade-Insecure-Requests` do
not. Our Worker never reads `Sec-Fetch-*`, and `wrangler dev --local` reproduces it, so this is
Cloudflare's static-asset routing (`assets.not_found_handling: "404-page"` in `wrangler.jsonc`)
answering navigations before the Worker runs. The fix `assets.run_worker_first: ["/api/*"]`
**works** — wrangler 4.114.0 accepts the array form, `deploy --dry-run` validates, and against
`wrangler dev --local` the navigation returns 200 application/json while `/`, `/guides/`, a
guide page, `styles.css`, `app.js` and an unknown path keep their correct status codes — but it
is **forbidden on purpose**: `test/worker-transport.test.js` asserts `wrangler.jsonc` does not
match `/run_worker_first/`, because on Workers Free static-asset requests are free while Worker
invocations count against the daily request limit. Shipping it would have required weakening
that assertion. Severity is **low**: the app's own `/api/*` calls use `fetch`, which sends
`Sec-Fetch-Mode: cors`/`same-origin` and is unaffected — only a human typing a monitoring URL
sees the 404. The behaviour still exists in production. **Do not re-attempt without an explicit
owner decision to relax the zero-spend guard.** If revisited, note that scoping to `/api/*`
adds only the handful of navigations a human makes, not site-wide traffic — but that is the
owner's judgement, not a workaround.
DoneWhen: already done.

**AF-S0805 | [OPS] Production-only validation sweep | 2 | Backlog**
Facts: three things can only be validated in production or a safe non-delivery environment —
AI quota-exhaustion behaviour (Workers AI has no overage billing on the free plan; requests
fail after the free allocation), adversarial assistant prompts, and feedback email header
sanitation. The assistant is intentionally narrow and grounded: it must not state dollar
figures or eligibility verdicts, figures are redacted from generated grounding, and its role
is not widened without a demonstrably stronger model and a new safety review. Keep assistant
output on `textContent`; never render model output as HTML. Workers AI can emit numeric
streaming tokens as numbers — do not replace explicit null/undefined checks with truthiness
checks. Assistant rate limiting and a feedback email binding pinned to one verified destination
are already live, and `MAX_BODY_BYTES` (64 KB) rejects an oversized declared body with 413
before any binding is touched.
DoneWhen: all three are exercised with recorded evidence, and no secret appears in any log.

**AF-S0806 | [OPS] Confirm Cloudflare edge injection stays disabled | 1 | Backlog**
Facts: Cloudflare may inject Browser Insights or challenge scripts at the edge and the strict
CSP blocks them (`transferSize` 0, confirmed 2026-07-30). **Do not weaken CSP to allow
analytics** — disable injection in the Cloudflare dashboard instead if console noise needs
removal. No analytics is an intentional privacy decision, not missing work.
DoneWhen: the dashboard setting is confirmed and the CSP is unchanged.

**AF-S0807 | [OPS] Post-deploy verification routine | 2 | Backlog**
Facts: after every deployment — wait for propagation and repeat inconsistent smoke results
before declaring success or failure; confirm the deployed cache version and changed assets;
test a fresh wizard start, reload and IndexedDB restore on the custom domain; test
`/api/link-health` and every changed Worker endpoint; check page and console errors without
weakening CSP for Cloudflare injection; confirm the intended commit matches `origin/main` and
the CI deploy completed. Re-run privacy contract checks whenever a data flow changes.
DoneWhen: the routine is written down and followed on the next deploy with recorded output.

**AF-S0808 | [SEO] Review search appearance after major content or scope changes | 1 | Backlog | area:content**
Facts: canonical `abilityfinder.ca` metadata, title and description, Open Graph and Twitter
metadata, a social sharing image, `robots.txt`, a generated `sitemap.xml`, static guide pages,
a searchable guide index and a custom `404.html` are all live. Keep canonical, social, robot,
sitemap, guide and embed wording synchronized if the domain or supported provinces change.
DoneWhen: reviewed after the next major content or scope change, with the wording confirmed
consistent.

## Under AF-E09 (area:content)

**AF-S0901 | [CONTENT] Finish Alberta polish | 2 | Backlog**
Facts: owner horizon 1, set 2026-07-19 — make the Alberta disability service so complete that
organizations and clinics have no comparable alternative. Feature additions come from the
comparative research backlog and the **owner picks** them.
DoneWhen: the owner's chosen additions are shipped to the Alberta/B.C. depth bar.

**AF-S0902 | [CONTENT] Build the trust and credibility artifacts for outreach | 2 | Backlog**
Facts: horizon 1 explicitly includes trust/credibility artifacts for organization outreach.
Revenue sequencing is credibility → partnerships/grants (e.g. VAD) → sponsorships → agency
licensing, so credibility comes first.
DoneWhen: the artifacts exist and are usable in an outreach conversation.

**AF-S0903 | [UX] Improve discovery only when evidence supports it | 1 | Backlog**
Facts: potential low-risk enhancements, none yet justified — per-disability browse
sorting/filtering backed by explicit benefit tags; safe guide deep links containing only a
guide ID, never user answers; client-side export/import only if users demonstrate a real need
for cross-device transfer. Never put sensitive wizard or profile data in a URL.
DoneWhen: an enhancement ships only after user or outreach evidence justifies it.

**AF-S0904 | [CONTENT] French stays paused | 1 | Backlog | type:decision**
Facts: keep French paused until there is capacity to translate and maintain the **benefit
catalog**, not only the interface. French strings already exist in places (a French e2e
assertion pins `"Jusqu'à ~$4,500 / an"`, and the money-band rewording updated French in step),
which is interface-level only.
DoneWhen: already decided. Re-open when catalogue-maintenance capacity exists.

## Under AF-E10 (area:content)

**AF-S1001 | [CONTENT] Adviser-facing quick reference | 1 | Backlog**
Facts: owner horizon 2, For Professionals v1.
DoneWhen: shipped, with every figure verified same-day like any other benefit content.

**AF-S1002 | [CONTENT] DTC / T2201 appointment-preparation sheets | 1 | Backlog**
Facts: owner horizon 2. Related open work: DATA-25's DTC readiness is mitigated, not closed,
so the prep sheets must not imply a verdict the matcher cannot support.
DoneWhen: shipped, and consistent with whatever DATA-25 settles.

**AF-S1003 | [CONTENT] "For professionals" page | 1 | Backlog**
Facts: owner horizon 2.
DoneWhen: shipped.

**AF-S1004 | [LEGAL] Keep practitioner relationships legally clean | 3 | Backlog | needs-owner-decision, area:ops**
Facts: practitioner involvement must use legally clean structures only — transparent
directories and disclosed sponsorships. **NO paid referral inducements**: physician referral
payments risk violating CPSA standards and fee-splitting rules. **Verify before any clinic
arrangement.**
DoneWhen: any practitioner arrangement is verified against CPSA standards before it is entered
into, with the verification recorded.

## Under AF-E11 (area:research)

**AF-S1101 | [RESEARCH] Write the province source-audit checklist | 2 | Backlog**
Facts: the Alberta and B.C. depth bar is the standard. Provinces are re-integrated from
`archive/data-provinces-later.js`, which sits outside the deployed `public/` directory and is
not served. National-but-shallow (the Disability Benefits Compass approach) is explicitly
rejected. The checklist must encode the lessons already paid for: check the catalogue by record
id before recording a gap; grep every field of a record, not just `note`, before declaring it
clean; hub pages can be out of scope and must be filtered, not harvested; per-plan or per-program
URLs can 404 while the hub anchor is correct; and a third-party figure is not a source.
DoneWhen: the checklist exists and covers source audit, metadata pass, matcher gating and the
generator runs.

**AF-S1102 | [RESEARCH] Re-integrate the first additional province | 1 | Backlog**
Facts: one province at a time, each with a full source audit. B.C. is done and live.
DependsOn: AF-S1101.
DoneWhen: the province passes the checklist end to end and ships with every figure verified
same-day.

## Under AF-E12 (area:research)

**AF-S1201 | [RESEARCH] Choose and scope the first additional audience stream | 1 | Backlog | needs-owner-decision**
Facts: owner horizon 4 — beyond disability, audience streams like Benefits Wayfinder's starting
points: newcomers, seniors, veterans, job loss, caregivers, Indigenous peoples, housing,
education, emergency money. **One audience at a time, same verified-depth treatment**, and only
after the disability service is mature.
DoneWhen: one audience is chosen and scoped, with the depth bar stated.

**AF-S1202 | [SCOPE] VAC disability benefits stay out of scope | 1 | Done | type:decision**
Facts: decided out of scope 2026-07-28. VAC is a parallel federal system with service-related
eligibility, its own adjudication and its own vocabulary. Covering it properly is a research
programme in itself; covering it partially would imply this catalogue speaks for a population
it has never verified anything for. Point veterans at VAC's own Benefits Browser instead.
Revisit only as a deliberate, separately scoped expansion.
DoneWhen: already done.

## Under AF-E13 (area:research)

**AF-S1301 | [SCOPE] Scope the paid agency portal as a separate product | 1 | Backlog | needs-owner-decision**
Facts: owner horizon 5 — a separate, paid portal for organizations and agents managing multiple
clients: caseloads, saved scenarios, reports, white-label. It requires accounts and server-side
state, which is a **deliberate, scoped revisit of the free site's no-accounts privacy rule,
applying to the separate product only**. It is the first genuine paid-infrastructure need. Treat
it as a separate product with a new privacy and infrastructure review. The public site's rules
do not move: no accounts, no analytics, no remote storage of wizard answers, zero spend.
DoneWhen: a scoping document exists with its own privacy and infrastructure review, and the
public site's guarantees are demonstrably untouched.

**AF-S1302 | [SCOPE] Revenue sequencing stays credibility-first | 1 | Backlog | type:decision**
Facts: revenue sequencing unchanged — credibility → partnerships/grants (e.g. VAD) →
sponsorships → agency licensing.
DoneWhen: already decided. Recorded so a later monetisation idea is sequenced, not inserted.

## Under AF-E14 (area:ops)

**AF-S1401 | [OPS] GitHub issue sync for every open ticket | 2 | Backlog**
Facts: GitHub is the permanent engineering record — issues, branches, commits, PRs, reviews.
Repo `abdulaziz-ca/AbilityFinder`. Every open story and subtask gets a matching issue whose
body carries the TaskView id and URL, and whose ticket note carries the issue URL. Branch
convention `taskview-<id>-<slug>`; the PR says `Closes #N` so merging closes the issue. **No
issues for the rolled-up history tickets.** `gh` CLI is **not installed** — use the Codex
agent's browser, or install `gh` and ask the owner to authenticate. An agent marks a ticket
Done only after its PR is merged **and** verification passes.
DoneWhen: every open ticket has an issue URL and every issue maps back to a ticket.

**AF-S1402 | [OPS] Stable HTTPS callback for the local TaskView | 2 | Backlog**
Facts: TaskView runs locally — UI `http://localhost:8888`, API/MCP `http://localhost:1725`.
Slack notifications need a stable HTTPS callback that does not exist yet. Any solution must
respect zero spend.
DoneWhen: a stable HTTPS callback reaches the local TaskView, or the owner decides it is not
worth it.

**AF-S1403 | [OPS] Slack notifications for Blocked / Review / Verification / Done | 1 | Backlog**
Facts: Slack is the **notification layer only**. Never store essential project context in
Slack. Notify on Blocked, Review, Verification and Done for this board only.
DependsOn: AF-S1402.
DoneWhen: configured and observed firing, or correctly Blocked on AF-S1402 with evidence.

**AF-S1404 | [DOCS] Update the TaskView docs for the new board | 2 | Backlog**
Facts: `TASKVIEW-WORKFLOW.md` still points at `http://localhost:8888/org-fbbce12c/2/-1401`,
which is now the scratch board. Update it and `TASKVIEW-QUICK-REFERENCE.md` with goalId 3, the
note template and the handoff convention. `TASKVIEW-WORKFLOW.md` is authoritative for
TaskView-tracked coordination and `AGENTS.md` for everything else; if they conflict, stop and
ask the owner. **Changing this workflow is a human gate** — a doc-pointer update is not a
workflow change, but any rule change is.
DoneWhen: both docs name goalId 3 and carry the note and handoff conventions, with no rule
altered.

**AF-S1405 | [OPS] Repoint .taskview/policy.json to the Ability Finder board | 2 | Backlog**
Facts: `policy.json` has `"project_id": 2` and
`"project_url": "http://localhost:8888/org-fbbce12c/2/-1401"`. Board 2 is now the scratch
board. Repoint `project_id` to 3, `project_url` to the Ability Finder board, and read
`kanban_route_segment` from the real URL. This is a **factual pointer correction, not a
workflow change** — do not edit any rule, gate or status list in that file.
DoneWhen: the three pointer fields are correct, the diff shows nothing else changed, and the
diff is reported to the owner.

**AF-S1406 | [DOCS] Reconcile the stale rows in the tracker and roadmap | 2 | Backlog**
Facts: `WEBSITE-PROJECT-TRACKER.md` and `ROADMAP.md` disagree with `REMAINING-WORK.md`, which
is the working record. Specifically — tracker §1 "Remaining" still lists the money-band
prominence decision and the conditional-results framing, both **closed 2026-07-30 (`00fb18f`)**;
tracker §1 still lists "Reduce or redesign the first-load dependency on the main JavaScript
payload and asynchronous IndexedDB restore", though PERF-01 **closed 2026-07-30 as WON'T FIX**;
tracker §2 "Optional coverage backlog" lists the excise gasoline tax refund, CPP children's
benefits, the multigenerational home renovation tax credit, Alberta CAPCC, Alberta service-dog
qualification and ID, and Alberta special-needs housing as research items, though **all six
were built and deployed 2026-07-29**, and lists "verify Plan S in detail" though Plan S was
verified in detail 2026-07-29 and written as tips on `bc-fair-pharmacare`. Tracker §9 asks to
"recount all 65 audit rows and remap their severity/status totals" — that recount is real work,
and until it is done **no per-severity number may be stated**, because deriving one by
assumption is exactly the unverified-number habit the docs forbid.
DoneWhen: each stale row is corrected or dated, and no new number is stated without a re-map.

**AF-S1407 | [OPS] Board hygiene sweep | 2 | Backlog**
Facts: the board's own integrity contract — no duplicate `spec-key`; every ticket has a
priority with a one-line rationale and a full context block; no orphan parents; the graph
matches the spec; `add_task_dependency` is used only for non-parent/child prerequisites.
Mistakes and duplicates move to **Cancelled** with a note and are reported to the owner —
**only the owner permanently deletes.** Agents may not delete tickets, merge duplicates,
overwrite user content, change board configuration, or alter another agent's work without
explicit approval.
DoneWhen: a sweep reports zero duplicates, zero orphans and full priority coverage.

**AF-S1408 | [OPS] Keep WEBSITE-PROJECT-TRACKER.md untracked | 1 | Backlog**
Facts: as of 2026-07-30 `main` and `origin/main` are both at `622bf35`, the working tree is
clean, and `WEBSITE-PROJECT-TRACKER.md` is the only untracked file — keep it that way.
`FABSOL-RESUME-PROMPT.md` was deleted 2026-07-30 as stale (it described HEAD `68b8dfc` and a
baseline of 44 unit / 33 e2e against a current 110 / 420) and stays untracked and never
committed.
DoneWhen: the tracker is still untracked and no resume prompt has been committed.

## Under AF-E15 (area:ops, all status Done, all `type:story` except where noted)

Each history story's note lists its IDs and dates and nothing invented. **Do not state a
per-severity count anywhere.**

**AF-S1501 | [HISTORY] Audit closures — DATA family | 1 | Done**
Facts: closed and deployed — DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, DATA-07,
DATA-08, DATA-09, DATA-10, DATA-14, DATA-15, DATA-28, DATA-30, DATA-33, DATA-35, DATA-36,
DATA-37, DATA-38, DATA-39, DATA-40, DATA-41, DATA-42, DATA-43, DATA-44, DATA-46 (`a7c648d`),
DATA-47, DATA-48, DATA-49, DATA-50, DATA-51. **DATA-11 closed 2026-07-28** — the owner called
Medicine Hat and confirmed **$630** is the correct 2026 figure; the record already said $630, so
no data edit was needed, but it is now confirmed by the program owner rather than merely
matching one of two conflicting sources, and the $635 in the 2026 PDF is superseded.
**DATA-12 closed 2026-07-28** — RAMP, `bc-additional-home-owner-grant`, `bc-raha` and
`home-accessibility-tax-credit` are all in the catalogue with every figure verified that day.
Still open and NOT part of this closure: DATA-25.

**AF-S1502 | [HISTORY] Audit closures — BC-BC family (complete) | 1 | Done**
Facts: BC-BC is complete. BC-BC-05, BC-BC-06 (`9ab36d8`), BC-BC-12 (`f4eb57c`), BC-BC-14,
BC-BC-16, BC-BC-17 (`2891c17`). **BC-BC-09 closed 2026-07-28** — new intake is open, "new
families should continue using current pathways for assistance"; SAET stays available until
**March 31, 2027** or until the child transitions, and the **BC Children and Youth Disability
Benefit begins April 1, 2027**; **April 1, 2026** is when implementation begins, focusing first
on children already in the At Home Program (BC Gov release `2026CFD0002-000136`) — both dates
are correct and mean different things. **BC-BC-15 closed 2026-07-28 and was a live false
positive**: Kelowna's FAQ states "Post-secondary students are not eligible for financial
assistance. However, students can access a discounted student rate on passes." The record had
no student rule, so KFAP was shown to people Kelowna excludes — without the fix a Kelowna
post-secondary student got status `"ready"`. Now gated by `notPostSecondaryStudent`
(`met: () => !isStudent()`, `fixed: true`, correct because the wizard does ask "In
post-secondary school"), and the message hands over the student-rate alternative. Also captured:
temporary residents including study/work permits, business-class/investor/entrepreneur
immigrants and anyone banned from City facilities are excluded; applicants re-apply yearly up
to one month before the term expires; the LICO table is the **2025** one. **BC RAHA limits
closed 2026-07-28** from BC Housing's own calculator at `https://bcrahacalculator.bchousing.org`
(© 2026 BC Housing, Ver 1.01), which is not linked from the overview or FAQ: assets under
**$100,000** excluding the home being adapted and gross household income under **$146,270.00**,
identical on the Homeowner and Landlord/Tenant paths; there is **no single home-value cutoff**.
Lesson recorded: BC-BC-09's first attempt verified only the `note` field and asserted the whole
record was clean — grep every field.

**AF-S1503 | [HISTORY] Audit closures — ABFED family | 1 | Done**
Facts: ABFED-01, ABFED-02, ABFED-03, ABFED-04, ABFED-05 (`f438915`), ABFED-06,
ABFED-07 (`3aa85cd`), ABFED-08, ABFED-09 (`3ef9a32`), ABFED-A01 (`fdd6d25`). ABFED-16/17 were
**closed as incorrect** — see AF-S1506.

**AF-S1504 | [HISTORY] Audit closures — reliability, security, deploy, AI, calendar, supply, docs | 1 | Done**
Facts: REL-01, REL-02, REL-03, REL-04, and the quick-win bundle REL-05, SEC-05, UX-01, AQ-03,
AQ-04, DEPLOY-01 (`8042e42`). AI-01, AI-02. CAL-01. SEC-02, SEC-03. **SEC-01** — HTTP
301-redirects to HTTPS on root, guides, assets and API, with HSTS `max-age=15552000`.
**SEC-04** — `MAX_BODY_BYTES` (64 KB) rejects an oversized declared body with 413 **before any
binding is touched**, so it never consumes the KV rate limiter or reaches AI/email quota.
**PRIV-01** — self-only CSP, zero analytics beacons. **SUPPLY-01** — resolved by upgrading to
wrangler `^4.114.0` (→ miniflare 4.20260722.0 → sharp 0.35.2); `npm audit` reports 0
vulnerabilities with no downgrade. **DOC-01** — `HANDOFF.md` and `ROADMAP.md` corrected, and
`test/docs-consistency.test.js` now fails if the docs drift from the catalogue again.
**REL-06 is root-caused but WON'T FIX** and is tracked separately at AF-S0804 — it is not part
of this closure.

**AF-S1505 | [HISTORY] Audit closures — Low and Informational (complete) | 1 | Done**
Facts: `REMAINING-WORK.md` records Low + Informational as **12 closed of 12, complete**. That
is the one severity row it does state, because it is complete; every other severity row is
deliberately not restated.

**AF-S1506 | [HISTORY] Disproved and stale findings — do not "fix" these | 1 | Done | type:decision**
Facts: **three** findings have been disproved against primary sources, plus one stale figure.
**BC-BC-02, verified false positive 2026-07-27** — the audit claims four PWD prescribed classes
excluding Indigenous Services Canada; the current BCEA policy page (effective 2021-10-05, page
updated 2026-07-13) lists **five**, explicitly including "People who have been designated as a
Person with Disabilities by Indigenous Services Canada (ISC) within the BC region", and routes
prescribed-class applicants to **HR3642** — exactly what the record already said. The audit
appears to have conflated this with the separate "moving on reserve" policy; ISC designations
are adjudicated by BCANDS. **ABFED-16/17, verified false positive 2026-07-28** — the audit
claims the Easter Seals and Dog Guides entries "present closed intakes as actionable"; neither
entry states an intake status at all, both are directory records in `public/grants-data.js`
that describe what the organisation offers and route to its own program pages, which is correct
directory behaviour, and the owner confirmed both are currently accepting applications. Only
the `verified` dates were refreshed. **PERF-01's headline LCP figure was simply stale.**
Standing rule: treat the audit as a lead, not an authority, and re-verify against the current
official page before changing anything.

**AF-S1507 | [HISTORY] Shipped — B.C. launch and the benefit catalogue | 1 | Done**
Facts: British Columbia is done and live. **Do not restate a single catalogue total without
re-counting `public/data.js`** — the docs carry counts written at different times: DOC-01
corrected `HANDOFF.md`/`ROADMAP.md` to 84 total (8 federal, 10 Alberta, 36 B.C.), the Plan F
note says the catalogue was unchanged at 95, and the 2026-07-29 re-audit states federal 13 and
Alberta 11 matching the catalogue counts. `test/docs-consistency.test.js` guards against drift.
Also: the parked-provinces file is at `archive/data-provinces-later.js`, not `public/`.

**AF-S1508 | [HISTORY] Shipped — wizard, functional-limitation matching, and matcher safety | 1 | Done**
Facts: adaptive questionnaire for self, child and family; functional-limitation matching rather
than diagnosis-only; ready / one-step-away / not-a-match explanations; value, effort, wait-time
and priority presentation. Matcher safety — no unsupported "ready" verdict anywhere:
DATA-42/43/44 + ABFED-02 (`fc0a8f9`), DATA-30/47/48/49/50 + BC-BC-05/14/16 (`eb0210d`),
DATA-33/35/36/37/39/40/41 + ABFED-08 (`f4bc205`). **Renovation tax credits, 2026-07-28** —
`home-accessibility-tax-credit` and `bc-home-reno-tax-credit` could both reach "ready" from
`homeRenoCandidate` + `homeowner`, but both are reimbursements of money already spent, so
"Ready to apply" was a false verdict about money; a shared `qualifyingRenovationSpend`
predicate (`met: () => false`, `fixed: false`) now puts both at "One step away", and
`fixed: false` matters because a hard "no" would wrongly drop the credit for people who simply
have not done the work yet. Guarded in `e2e/matcher-safety.spec.js` and mutation-tested —
removing the gate fails with `Expected: "almost" / Received: "ready"`. **Matcher
under-inclusion** — Kamloops ARCH income-or-assistance route (`86512cc`): a resident on MSDPR
assistance is no longer denied for reporting moderate income.

**AF-S1509 | [HISTORY] Shipped — guides, progress tracking, printable reports, .ics reminders | 1 | Done**
Facts: benefit browsing, search, filters and detailed application guides; progress tracking;
printable reports; local calendar reminders. Guides are generated by `npm run gen:guides` and
`public/guides/**` is never hand-edited. A searchable guide index and static guide pages are
live. `requiresNote` is rendered as a "What you must meet" block on both guide pages and the
in-app detail view and added to `benefitSearchText` — it was 46 records, of which 0 were
verbatim duplicates of their own `detail.about`, only 2 exceeded 80% keyword overlap and 42 sat
below 50%, median 263 characters; the field was removed from exactly two records (`ramp`,
`kamloops-arch`) whose `detail.about` already states the same routes more completely, and
`test/requires-note-rendered.test.js` guards the remaining 44. `b.note` was relabelled **"Good
to know"** after auditing all 85 records — 48 notes are practical caveats, 7 are imperative
instructions, only ~10–15 are genuinely eligibility-first — and no benefit text was touched, so
nothing needed re-verification.

**AF-S1510 | [HISTORY] Shipped — IndexedDB persistence and recovery | 1 | Done**
Facts: local IndexedDB persistence with a privacy allowlist and catalog-backed validation; safe
recovery from stale tabs, cleared data and legacy local storage. Raw IndexedDB calls stay in
`public/dbManager.js`; the allowlist and validation stay in `public/stateManager.js`. Never
persist postal text, feedback, assistant history, DOM state or arbitrary runtime objects.
Restore must complete before the first meaningful render. Optimistic record revisions and
metadata-only tombstones stop a stale tab from overwriting or resurrecting cleared answers.
Legacy `abilityfinder.*` localStorage values pass through the current allowlist before
migration and are removed only after a successful sanitized write or when an authoritative
snapshot or tombstone already exists. **WebKit `Database deletion blocked` closed 2026-07-28** —
per spec `blocked` is not a failure, it means another connection is still open and the delete
fires `success` once they close; WebKit does not release the handle synchronously after
`close()`. It broke both CI runs on `f718bfa` and `974b0c5` and 1 of 9 local runs; the code now
waits for the real outcome and fails only on a bounded 15s timeout, reporting whether `blocked`
fired.

**AF-S1511 | [HISTORY] Shipped — grounded assistant and feedback endpoint | 1 | Done**
Facts: an optional grounded assistant with generated benefit context, and optional feedback
submission through the Worker. `/api/ask` and `/api/feedback` are the only two opt-in
submissions of user-entered content. Generated grounding lives in `src/benefits-context.js`
(never hand-edited) and figures are redacted from it. The model is intentionally narrow: it
must not state dollar figures or eligibility verdicts. Assistant output stays on `textContent`,
never rendered as HTML. `#askLive` announces only the final answer and the streaming chat log
deliberately has no `aria-live`. Assistant rate limiting and a feedback email binding pinned to
one verified destination are live.

**AF-S1512 | [HISTORY] Shipped — organization and practitioner directories | 1 | Done**
Facts: organization and practitioner-help directories are live, backed by `public/orgs-data.js`
and `PRACTITIONER_FORMS`, both feeding `npm run gen:context`. Practitioner searches put postal
or coordinate text in a **user-initiated** Google Maps URL; that text is not persisted.
Directory records correctly describe what an organisation offers and route to its own pages
rather than asserting intake status — the basis on which ABFED-16/17 was disproved.

**AF-S1513 | [HISTORY] Shipped — the six-project Playwright matrix (TEST-02) | 1 | Done**
Facts: closed 2026-07-29; all three planned items implemented. **Sleeps** — zero
`waitForTimeout` remain in `e2e/` or `test/`, replaced by 22 `waitForFunction`, 51
`toBeVisible` and 12 `settleWizardCard`. **Engines** — `playwright.config.js` builds six
projects from an ENGINES array of chromium, firefox and webkit; WebKit matters most because a
disability audience skews toward iOS and VoiceOver runs on Safari. **Wrangler** — the three
`worker-*` projects run against `npx wrangler dev --port 8788 --local`, so `_headers`, the
production CSP and the real `/api/*` contracts are exercised; that was the blind spot that let
REL-05 ship, and it also covers SEC-02, SEC-04 and Cloudflare asset routing. The three `app-*`
projects keep the python3 static server, which is correct and faster for product journeys.
`retries: 0` is deliberate. Green at 420/420 across all six projects on repeated full runs on
2026-07-29. **Correction recorded 2026-07-30:** this closure read as more settled than the suite
actually is — the three items remain done, but the flakiness they were meant to reduce is not
gone. See AF-S0402.

**AF-S1514 | [HISTORY] Shipped — the 2026-07-29 federal, Alberta and B.C. additions | 1 | Done**
Facts: built and deployed 2026-07-29 — `cpp-childrens-benefit` ($307.81/month in 2026 for a
child under 18 or a full-time student 18–25, $153.91 part-time; the disability is the PARENT's,
so it is deliberately not gated on the `child` predicate);
`multigenerational-home-renovation-tax-credit` (14.5% of up to $50,000, max $7,250 for 2025 —
a search summary said 15% and third-party sources say $7,500, and both are wrong; once per
qualifying individual per lifetime, and its expenses cannot also be claimed under the home
accessibility or medical expense credits); `excise-gasoline-tax-refund` (states no per-litre
amount on purpose — three official pages publish none and temporary federal fuel excise
reductions are in effect, so the record gives the CRA number 1-877-432-5472).
`ab-service-dog-id-card` (no fee, mailed in about 2 weeks; the fiddly part is the photo — PDF
only, portrait, from at least 6 feet, dog's head level with yours). `ab-capcc` (adult Albertans
**under 65** in a **type A or type B** continuing care home only; alberta.ca publishes no form
or cost, so the route is phoning a listed community access coordinator).
`ab-special-needs-housing` (no central application; find a provider through
`findhousing.alberta.ca`; three figures deliberately refused because alberta.ca states them only
for other program types — the 30%-of-income rent formula and the functional-independence rule
belong to Community Housing / Seniors programs, and no dollar income limit is published; its
`category` is "Daily living supports", not "Health & equipment", because `public/app.js`
substring-matches category into a value bucket so "equipment" would file housing as health and
a new "Housing" category would fall through to "income"). B.C.: `bc-pharmacare-plan-g`
(highest priority because `mental` is one of the twelve disability categories the questionnaire
offers and had no drug-coverage record), `bc-pharmacare-plan-p`, `bc-fnha-health-benefits`
(Plan W, framed as the FNHA enrolment route because a phone call to FNHA with a status number
is what the person actually does), `bc-msp-supplementary-benefits` (shipped 2026-07-28 in
`7b8e9db`, gated on `bcSupplementaryBenefitsEligibility` — `met: () => false, fixed: false`,
the correct unasked-criterion pattern yielding "One step away" rather than a false "ready").
Plan F's wording was corrected in place — it covers 100% of eligible prescription drugs **and
designated medical supplies**, not "free prescriptions" — with no new record. Plan NP and Plan
S were written as tips on `bc-fair-pharmacare`: Plan NP dispenses do not count towards the Fair
PharmaCare deductible or family maximum, and Plan S covers the full cost of nicotine gum,
lozenges and patches for one continuous course of up to 12 weeks (84 days) per calendar year,
requires a declaration signed by both the person and the pharmacist at the counter, resets each
January 1, and needs MSP but not Fair PharmaCare registration. All 13 PharmaCare plans were
assessed against the `who-we-cover` hub and the test that decided each was "does this have its
own application?" — the result was one new record, not seven.

**AF-S1515 | [HISTORY] The deliberately-rejected list | 1 | Done | type:decision**
Facts: do not "just add" these without revisiting the product's privacy and zero-spend model.
**Accounts or server sync** — creates identifiable disability/income records; prefer local
export/import. **Email or SMS reminders** — requires contact storage and SMS can cost money;
the local `.ics` download provides reminders without a backend. **Community reviews or
free-text timelines** — moderation, abuse and PII risk. **Admin CMS** — `data.js` plus git
already provides reviewable version history. **"Describe your disability and AI will choose"
matcher** — invites sensitive free text and false certainty; the structured limitation-based
wizard is safer. **Unverified automated government integration or form filling** — high factual
and privacy risk. **Veterans Affairs Canada disability benefits** — out of scope 2026-07-28,
see AF-S1202. Also confirmed scope decisions rather than unfinished failures: no analytics, no
paid infrastructure for the public website.

**AF-S1516 | [HISTORY] The audit row count, and why the severity totals are not restated | 1 | Done**
Facts: the audit's findings table has **65 rows**. Fully closed and deployed is recorded as
**54+**, "was ~83% before 2026-07-28, several more closed that day, not yet recounted". Partly
closed is **0** — BC-BC is complete and DATA-12 is fully closed. Mitigated but not closed is
**3** — DATA-25, UX-02, UX-03. Open is **2** — TEST-01 and the accessibility/user testing.
Low + Informational is **12 of 12, complete**. High/P1 is **22 of 23** with only DATA-25
outstanding. The Medium/P1 and Medium/P2 rows are **deliberately not recounted**: closing a
finding does not reveal its severity band without re-reading the audit, and doing that
arithmetic by assumption would be exactly the kind of unverified number the docs forbid
everywhere else. **Re-map the finding IDs before quoting any percentage.** Never load
`AUDIT_REPORT_2026-07-22.md` whole (120 KB) or `AUDIT_EVIDENCE_2026-07-22/` (1.7 MB) — grep by
finding ID.

---

# NON-PARENT/CHILD DEPENDENCIES

Only these. Everything else is expressed by `parentKey`.

| blocked | blocked by | why |
|---|---|---|
| AF-E07 | AF-E03 | the NO-GO lift is gated on human accessibility testing |
| AF-S0701 | AF-S0307 | condition 2 of the NO-GO lift |
| AF-S0701 | AF-S0308 | findings must be dispositioned |
| AF-S0701 | AF-S0702 | the RC checklist must pass first |
| AF-S0701 | AF-S0703 | condition 4, the clean production smoke test |
| AF-S1102 | AF-S1101 | no province ships before the source-audit checklist exists |
| AF-S1403 | AF-S1402 | Slack needs a stable HTTPS callback |
