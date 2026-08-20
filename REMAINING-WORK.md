# AbilityFinder — remaining work

**Purpose:** the single place to see what is actually finished and what still needs doing.
Update this file whenever a finding is closed, reopened, or found to be wrong.

**Last updated:** 2026-08-16 · **Source of findings:** `AUDIT_REPORT_2026-07-22.md`

> **Start here.** This file is the working record. `AUDIT_REPORT_2026-07-22.md` is
> 120 KB — do not load it whole. Grep it for a specific finding ID when you need the
> original evidence.

## Audit completion

The audit's findings table has **65 rows**. Current state:

> ⚠️ **Trust the tables below, not this summary.** The status rows were updated for the
> 2026-07-28 closures — **DATA-12**, **BC-BC-09**, **BC-BC-15**, **ABFED-16/17**,
> **DATA-11**, the BC RAHA limits, and PERF-01's two measurable defects. The **per-severity rows
> below are deliberately NOT recounted**: closing a finding does not reveal its severity band
> without re-reading the audit, and doing that arithmetic by assumption would be exactly the kind
> of unverified number this file forbids everywhere else. Re-map the IDs before quoting any
> percentage.
>
> **One exception, 2026-08-16:** the High/P1 row now reads 23/23. That is not a recount — the row
> already identified DATA-25 as the *sole* outstanding High/P1, so closing it completes the band
> without re-mapping anything. The other severity rows are still uncounted.

| Status | Rows | Notes |
|---|---|---|
| **Fully closed and deployed** | **54+** | was ~83% before 2026-07-28; several more closed that day, not yet recounted |
| Partly closed | 0 | **BC-BC is now complete** (BC-BC-15 and BC-BC-09 both closed 2026-07-28) and **DATA-12 is fully closed** |
| Mitigated, not closed | 2 | UX-02 and UX-03 — **both had their code landed and deployed 2026-08-16**, and both still need reader/profile testing before they close. **DATA-25 closed 2026-08-16** |
| Open | 1 | the accessibility/user testing. **TEST-01 closed 2026-08-16** — the eligibility oracle is built, landed and running in CI. **PERF-01** measured with its two real defects fixed. **BC-BC-09/15**, **ABFED-16/17** and **DATA-11** closed 2026-07-28. **REL-06 is root-caused but WON'T FIX** — the behaviour still exists in production; the fix was declined on zero-spend grounds, see its row below |

By severity:

| Severity | Closed | Total | |
|---|---|---|---|
| **High / P1** | **23** | 23 | **complete — DATA-25 closed and deployed 2026-08-16.** No High/P1 release blocker remains |
| Medium / P1 | see note | 18 | 2 mitigated. The human-only clarifications (BC-BC-09/15, ABFED-16/17, DATA-11) closed 2026-07-28; **REL-06 is root-caused but WON'T FIX, not fixed**. **Nobody has re-mapped finding IDs to severities**, so no count is stated rather than an invented one |
| Medium / P2 | see note | 12 | DATA-11 and DATA-12 closed 2026-07-28; only PERF-01's residual JS-gating remains. Count not restated for the same reason as the row above |
| Low + Informational | 12 | 12 | complete |

**Every High/P1 release blocker is now closed**, DATA-25 last, on 2026-08-16. What
remains needs a person, not code: comprehension testing for UX-02, profile
validation for UX-03, and the accessibility/AT testing (see the human-only table).

The NO-GO has still not been lifted — see *Release status* at the end. Code
completeness is not the blocker; the untested accessibility is.

> **Treat the audit as a lead, not an authority.** **Three** of its findings have now been
> disproved against primary sources (see *Closed as incorrect*) — BC-BC-02 and ABFED-16/17 outright,
> and PERF-01's headline LCP figure was simply stale. Always re-verify a
> finding against the current official page before changing anything.

---

## Rules that still bind every change

- Accuracy, then usefulness, then presentation.
- Never invent or extrapolate an amount, rule, cutoff, form, phone number, deadline or date.
- Verify benefit facts against the current official source **on the day of the change**.
- Never turn an unasked or lay questionnaire answer into an official eligibility verdict.
- No accounts, analytics, remote questionnaire storage, or paid infrastructure.
- Generated files (`src/**`, `public/guides/**`, `public/sitemap.xml`) are regenerated
  through their scripts, never hand-edited. `gen:context` legitimately writes `src/**`.
- Bump the browser asset version and regenerate guides whenever `public/app.js` changes.
- `FABSOL-RESUME-PROMPT.md` stays untracked and is never committed.

---

## Still open — code work

| ID | What is wrong | Notes |
|---|---|---|
| ~~DATA-12~~ | **Closed 2026-07-28.** All four programs are now in the catalogue: RAMP earlier, then `bc-additional-home-owner-grant`, `bc-raha` and `home-accessibility-tax-credit`. Every figure was verified against its official source that day. `canada.ca` returns 403 to automated fetch, so the CRA page was read in a real browser instead — do the same next time rather than trusting a search summary. **One gap remains, in the human-only table below: BC RAHA's income and asset limits.** Deliberately absent: no percentage rate or maximum dollar credit for the HATC, because the CRA page states neither and the lowest federal rate has moved recently — "$3,000" is a figure to refuse, not to copy |
| ~~Other municipal percentages~~ | **Verification pass completed 2026-07-28 — see "Closed after verification" below.** |
| UX-02 | Homepage still overpromises completeness/certainty | **Content pass landed and deployed 2026-08-16 (`37b3215`, `?v=101`); comprehension testing still outstanding.** The headline *"Every benefit you're owed, found in one minute"* made three claims in eight words — completeness, entitlement and a time — and the French *"qui vous reviennent"* carried the entitlement sense too. Both now describe answering questions and seeing possible matches. The entitlement claim was quantifiably wrong: #61's oracle shows **59 of 102 programs can never return "ready"**. Two further completeness claims (`aside.3`, `prob.good4`, both languages) said the tool shows "what you're missing", which asserts knowledge of the complete set a person is not receiving — arguably stronger than the headline. Two **false coverage labels** were also corrected: the French scope fallback and `SCOPE_RESIDENCY_HELP_FR` both advertised **Ontario and Québec**, which the catalogue has never covered. **Still open, and it is the whole remaining substance:** four owner TBDs — the comprehension-test script and its location, the inference questions, the results artifact, and the pass/fail rule — then the test itself with real readers. Do not mark UX-02 closed on the copy change alone; the audit's complaint was about what readers *infer*, which is unmeasured |
| UX-03 | "Priority order" uses unexplained editorial weights | **Explained and deployed 2026-08-16 (`b7f2274`, `?v=102`); the weights are still unvalidated.** The actionable defect was a false claim, not the formula: `prob.good2` said results are "sorted by ease" (French more strongly, "du plus simple au plus complexe"). Measured against the real catalogue, **88 of 102 programs (86%) score on ease alone**, so the claim was exact for most of the list — but **14 carry a value component and in 10 of those value outweighs ease**, and since ease spans only 1–5 while the weighted value term reaches 19.6, any program with a dollar figure jumps the queue. The consequence lands where users look: `cpp-disability` has `difficulty: 5` — the hardest on the scale — and still ranks **third**. Both languages now describe `value * 1.4 + ease` honestly. `priorityScore()`'s body is **byte-identical**; only its comment changed, and that comment now records that all eight constants are editorial, hand-chosen, unjustified anywhere in the repo, and never validated. **Replacing the weights was deliberately refused** — substituting one unvalidated editorial judgement for another would read as progress while reproducing the exact defect, in the code that decides what a disabled person sees first. **Still open:** four owner TBDs — a representative profile set, the expected ordering recorded *before* validation, the method, and an objective threshold |
| ~~DATA-25~~ | DTC readiness | **Closed and deployed 2026-08-16 (`8be02fe`, `?v=99`) — the last outstanding High/P1 release blocker.** The `dtc` record now states the CRA's three eligibility routes with their real thresholds: marked restriction (unable, or **3 times longer** than someone of similar age, **even with therapy, medication and devices**, present **all or almost all of the time (generally at least 90%)**, lasting **at least 12 months**); cumulative effect (2+ limitations, with the explicit exclusion of life-sustaining therapy); and life-sustaining therapy (**at least 2 times per week**, averaging **at least 14 hours per week**, 12 months). Six practitioner-discussion prompts live in `detail.tips` — **that location is the safety property**: tips are display-only, cannot reach the matcher, cannot change `met`, readiness or ranking, and store no answer. **The gates stay unprovable on purpose:** `prolonged` and `certifier` remain `met: () => false`, because CRA's own clause is "if a medical practitioner certifies" and the thresholds are comparative in a way no lay person can self-assess. The DTC still returns "almost" for everyone. **A trap in the source:** that CRA page contradicts itself — its embedded video transcript says 3 times per week, its operative eligibility checklist says **2**. Writing 3 would have turned away people who genuinely qualify. Verified live after deploy: 0 occurrences of "3 times per week" |
| ~~TEST-01~~ | No systematic eligibility oracle across all programs | **Closed and deployed 2026-08-16 (`01de333`).** The oracle is a versioned **specification**, never a snapshot — a snapshot would agree with the false-ready cluster and be worthless against the regression TEST-01 names. Each of the **150 gates** carries a hand-declared `evidence` classification, "answers" or "external"; **66 are external**, and from that one classification the invariant follows that a program with any external gate can never legitimately return ready. **59 programs are in that class; the other 43 must stay reachable** and are asserted too — an oracle proving only that nothing is ever ready would pass against a matcher returning "almost" for everything. A frozen baseline of all 102 outcomes forces **declared == derived == actual** every run, because derivation alone cannot catch a gate being *deleted*. **387 asserted outcomes — ready 43, almost 119, no 225.** The matrix runs 441 tests. No production file was changed at any point |
| ~~TEST-02~~ | **Closed 2026-07-29.** All three planned items are implemented, and the row above was stale on every count. **Sleeps:** zero `waitForTimeout` remain in `e2e/` or `test/` — replaced by 22 `waitForFunction`, 51 `toBeVisible` and 12 `settleWizardCard`. **Engines:** `playwright.config.js` builds six projects from an ENGINES array of chromium, firefox and webkit. **Wrangler:** the three `worker-*` projects run against `npx wrangler dev --port 8788 --local`, so `_headers`, the production CSP and the real `/api/*` contracts are now exercised — the blind spot that let REL-05 ship. The three `app-*` projects still use the python3 static server, which is correct and faster for product journeys. `retries: 0` is deliberate, so a flake surfaces instead of being laundered into a pass. Green at 420/420 across all six projects on repeated full runs on 2026-07-29. The 2026-07-27 `a11y-batch.spec.js` A11Y-03 flake noted here has not recurred, but with `retries: 0` it would be visible if it did |
| ~~PERF-01~~ | **Closed 2026-07-30 as WON'T FIX, by owner decision, after measuring production directly.** Live measurement of `https://abilityfinder.ca/`: TTFB **168 ms**, domInteractive **754 ms**, load **759 ms**, total script transfer **212 KB**. `data.js` is 96 KB and finishes at 636 ms; `app.js` is 76 KB and finishes at **751 ms**, so **`app.js` is the critical path and deferring or splitting the catalogue would not move first paint** — the obvious optimisation does not pay. The earlier throttled re-measurement already had LCP **2364 ms**, inside the "good" band, with CLS **0** and long tasks **0 ms**. The only change that would actually move first paint is real above-the-fold markup in `<main id="app">` instead of the loading placeholder, and it was rejected on risk: it duplicates `renderLanding` as a second, language-less copy, and it would flash the landing hero at any returning user whose restore routes them to a saved wizard step — against the "restore must complete before the first meaningful render" rule and the persisted-blank-page incident in `ARCHIVAL_KNOWLEDGE_BASE.md`. **INP stays unmeasurable in the field**, because that needs real users and there is no analytics by design. Confirmed in passing: Cloudflare still injects its beacon at the edge and the CSP still blocks it, `transferSize` 0, exactly as `AGENTS.md` documents |

## Planned procedure — deploy gate and TEST-02 (agreed 2026-07-28)

Do these as **small separate landings**. Do not combine them: mixing new test infrastructure
with fixes for what it surfaces produces an unreviewable diff and un-bisectable failures.

### 0. Pre-deploy gate — **DONE and PROVEN, 2026-07-28**

**The gate is live and no longer advisory. Do not describe it as inert.** Earlier notes in this
file said otherwise; they were wrong and are corrected here.

`.github/workflows/ci.yml` runs `npm test` plus the full six-project Playwright matrix on every
push to `main`, and the `deploy` job has `needs: test`, so a red suite physically cannot reach
production. `CLOUDFLARE_API_TOKEN` **is** set as a repository secret, and Workers Builds **is**
disconnected, so CI is the only path to production.

All three states have now been observed, which is what makes it proven rather than assumed:

| Commit | Tests | Deploy | Meaning |
|---|---|---|---|
| `73a1ddf` | red | **skipped** | but Workers Builds still shipped it — the old ungated path |
| `f718bfa`, `974b0c5` | red | **skipped** | Workers Builds now disconnected, so nothing shipped |
| `db92994` | **green** | **deployed** | verified live: `?v=73` and the new blocks served from production |

A `deploy` job reporting **success does not prove it deployed** — it exits 0 either way, warning
and skipping when the token is absent. Confirm a real release against the live site (the asset
`?v=N` in `https://abilityfinder.ca/`), never from the job's own conclusion.

**And a successful deploy does not mean the edge is serving it yet.** On 2026-07-29 a smoke test
fired immediately after `deploy` reported success and produced a genuinely confusing result: the new
guide URLs returned **200** while `/` still advertised the **previous** `?v=N` and every content
check returned **0**. Nothing was wrong — propagation was simply mid-flight. Re-running it a moment
later showed the correct version and content. So when a post-deploy check disagrees with itself
— new URLs live but old version string, or 200s with missing content — **re-run it before
concluding anything**. Do not report the zeros as a failure, and do not explain them away either.

**Pushing again cancels an in-flight run**, by design (`concurrency: cancel-in-progress`). That is
harmless when the newer commit contains the older one — on 2026-07-29 `be6d5e9` (Plan P) was
cancelled by `e226332` (Plan G) and `?v=87` shipped both, so `?v=86` never deployed as its own step.
But between the push and the next green deploy, the earlier commit's new pages **404 in production**.
Do not push a second change while you still need the first one verified live.

**A CANCELLED test job blocks the deploy exactly like a red one**, through `needs: test`. On
2026-07-28 the `Install Playwright browsers` step took **16m37s** on one runner, the job hit its
then-30-minute cap mid-suite and was cancelled, and a perfectly good release was blocked by a slow
mirror. The browsers are now cached at `~/.cache/ms-playwright`, keyed on the resolved
`@playwright/test` version so a bump invalidates it automatically, and the cap is **45 minutes**.
Normal runs land near 14 minutes.

**That fix moved the exposure rather than removing it — proven on 2026-08-19 (#199).** Run
`32234329014` was cancelled at the 45-minute cap with `npx playwright install-deps` stalled inside
`apt`: it fetched the InRelease files and then emitted **nothing for 44 minutes**. The suite never
ran, and the deploy was blocked on a comment-only commit. The cache had **worked**. That is the
point: the two install steps are mutually exclusive, and a cache **hit** is precisely what routes
execution into the apt-only step, i.e. onto the common path. The apt packages live outside
`~/.cache/ms-playwright` and WebKit will not launch without them, so that step cannot be dropped.
It now carries `timeout-minutes: 20`, so a stall fails in 20 minutes naming the step instead of
consuming the budget silently.

**Why 20 and not less, and do not "tidy" it downwards:** that step is apt-only but it is *not* fast.
Measured across the 12 runs of 2026-08-18/19, every one successful: 0m25s, 0m39s, 0m40s, 0m57s,
1m15s, 2m14s, 4m48s, 6m17s, 7m01s, 7m23s, 9m00s, 13m11s. A "few minutes" bound — which the ticket
originally proposed on an unmeasured assumption — would have failed about half of all legitimate
builds. Read 20 as *reasonable on current evidence*, not *proven safe*; if a real run exceeds it,
**raise** the bound and record the measurement rather than deleting it.

**The cache-MISS path is still unbounded, deliberately, and may already be over budget.** It did not
execute once in the 40 most recent runs — it only runs on a `@playwright/test` bump or an eviction —
so there is nothing to set a bound from, and a guess would fire on exactly that rare, important run.
But note the arithmetic before assuming a cancelled cache-miss run means a bad commit: the recorded
16m37s browser download plus the observed 13m11s apt half is 29m48s, plus the ~13-minute engine
matrix is 42m48s, leaving **2m12s** for checkout, Node setup and `npm ci`, which exceed that. If you
ever get a cache-miss run, **capture the step durations** — they are the measurement needed to bound
it.

If you ever touch those cache conditions: `cache-hit` is a **string**, so they must compare against
a quoted `'true'`. GitHub coerces mixed-type comparisons to numbers — `"true"` → NaN, `true` → 1 —
so an unquoted `== true` is *always false* and `!= true` *always true*. Written unquoted, the cache
is populated and never read, and the whole step is silently pointless.

Remaining risk, owner's call: the token in GitHub has **not been rotated** and its value was
pasted into a chat transcript. It is live, Workers-edit scoped, and demonstrably able to deploy.

- Always read Playwright results with `grep -E "passed|failed|flaky"`, never a truncated tail.

### 1. Remove the 5 fixed sleeps in `e2e/` — **DONE, verified 2026-07-29**

Replace `waitForTimeout` with state-based waits. Small and purely mechanical, but do it
**before** adding surface area: a flaky baseline trains you to skim failures, which is the
habit behind the reporting error above. Establish a green you trust first.

### 2. Wrangler-backed Playwright project — **DONE, verified 2026-07-29**

Highest value of the three original TEST-02 items, because it closes a **demonstrated**
escape rather than a theoretical one. REL-05 — the crash-recovery button broken by the
production CSP — shipped and lived in production, and the suite could never have caught it:
`python3 -m http.server` serves no `_headers` and no Worker. The same blind spot covers
SEC-02, SEC-04 and Cloudflare asset routing, all currently verified only by hand against
production after each deploy, which is not a sustainable control.

### 3. Browser matrix (Chromium + Firefox + WebKit) — **DONE, verified 2026-07-29**

The app is plain HTML/CSS/classic JS with no build, which lowers risk, but it leans on
exactly the APIs that diverge across engines: IndexedDB, `<dialog>`, focus management,
`prefers-reduced-motion`, forced-colors, and date handling. **WebKit matters most** — a
disability audience skews toward iOS, and VoiceOver runs on Safari. Firefox is nearly free
once the matrix exists.

Land it on a stable base and treat the first red run as **findings to triage separately**,
not as something to force green in the same change.

### Deliberately excluded: automated axe

The audit lists it as supplemental; the recommendation is to skip it for now. Automated
tooling catches roughly a third of real accessibility problems, and here it would produce a
green check reading "accessible" while the actual documented gap is that **no human using a
screen reader has ever used this product**. A passing axe run would make that gap feel
closed. Leave the absence visible until the AT testing actually happens.

## Still open — found during remediation, not in the audit

| Item | What is wrong |
|---|---|
| ~~Money band never shows an amount~~ | **Closed 2026-07-30 (`00fb18f`).** The band's two reachable states were reworded to lead with the next step instead of an absence: "No single yearly amount to total" became "Ready to apply — value varies by program", and "No amount is estimated yet" became "Your next step is to confirm one thing", with French updated in step. The `mb.upTo` branch is **deliberately kept**. It is unreachable from any real catalogue profile — 540 were probed — but it is **not dead code**: it renders whenever a cash, grant or taxCredit benefit with an `annualMax` and `excludeFromEstimate: false` becomes ready, and `e2e/matcher-safety.spec.js` constructs exactly that case and asserts `"Jusqu'à ~$4,500 / an"` against it. Deleting it on the grounds that it "never happens" would have broken a passing test and removed correct behaviour |
| ~~All-conditional results framing~~ | **Closed 2026-07-30 (`00fb18f`).** The zero-ready state now opens "Your next step is to confirm one thing" and continues "None of these is ruled out. Each has one requirement to check first, and each card says exactly what" — the same register the result cards already use — rather than "No amount is estimated yet" followed by "Each program has a requirement to confirm first". The caveat now explains **why** no amount appears instead of only telling people to go and look. Five e2e assertions pinned the old copy. The single French one missed on the first pass produced three failures, which served as an unplanned mutation test proving these assertions genuinely go red when the copy and the expectation disagree |
| ~~`requiresNote` is never rendered~~ | **Closed 2026-07-28 (`e1d9e68`).** It was 46 records, not 45. Measured before deciding: **0** were verbatim duplicates of their own `detail.about`, only 2 exceeded 80% keyword overlap, and **42 sat below 50%** — eligibility detail available nowhere else, median 263 characters. Rendered as a "What you must meet" block on both guide pages and the in-app detail view, and added to `benefitSearchText`. De-duplicated by removing the field from exactly two records, `ramp` and `kamloops-arch`, whose `detail.about` already states the same routes more completely. `test/requires-note-rendered.test.js` guards all 44 remaining records against going dark again, and was **mutation-tested** three ways rather than assumed |
| ~~WebKit: `Database deletion blocked`~~ | **Closed 2026-07-28.** `deleteAppStorage()` rejected on IndexedDB's `onblocked` in both copies (`persistence.spec.js`, `bc-live.spec.js`). Per spec, `blocked` is **not** a failure — it means another connection is still open, so the delete stays pending and fires `success` once they close. WebKit evidently does not release the handle synchronously after `close()`. It broke **both** of the CI runs on `f718bfa` and `974b0c5`, and 1 of 9 local runs. Now waits for the real outcome and fails only on a bounded 15s timeout, reporting whether `blocked` fired |
| ~~Guide pages label `b.note` "Who it is for"~~ | **Closed 2026-07-28.** Audited all 85 records: **48** notes are practical caveats/timing/gotchas, **7** are imperative instructions (`taxisaver-translink` "Order by cheque or money order…", `bc-fuel-tax-refund-disabilities` "Register FIRST…"), and only ~10–15 are genuinely eligibility-first. So the heading was wrong for most of them, and it existed **only** on the generated guides — `public/app.js` rendered the field as a bare unlabelled `<div class="note">`, which is why it went unnoticed. Since the eligibility question now has its own correct "What you must meet" block, `b.note` was relabelled **"Good to know"** on guides and given the same heading in the app. **No benefit text was touched**, so nothing needed re-verification. `test/guide-note-heading.test.js` fails if the old heading ever returns, and was mutation-tested |
| ~~`[app-firefox] wizard-accessibility.spec.js:38`~~ | **Closed 2026-07-28, mechanism proven by measurement.** After `page.locator("#next").click()` the question stayed on "Which of these apply to you?" for the full 5s — the click did nothing. The earlier note here guessed the 500ms `rise` animation "had probably finished" by then. **That guess was wrong.** Instrumenting the exact sequence in Firefox showed the card animation still **running at t = 75, 100, 108 and 99 ms** of its 500ms across four iterations — the `#next` click always lands mid-translate. Fixed by adding the same `settleWizardCard(page)` wait used by the `pick()` specs before both the `.opt` and `#next` clicks. Re-measured after the fix: `getAnimations()` returns `[]` at click time. `reducedMotion` was deliberately **not** added — motion is a real accessibility surface and switching it off would delete coverage rather than fix the race |

## Still open — needs a human, cannot be automated

| ID | What is needed |
|---|---|
| ~~BC RAHA income and asset limits~~ | **Closed 2026-07-28.** Source found: BC Housing's own eligibility calculator at **`https://bcrahacalculator.bchousing.org`** (© 2026 BC Housing, Ver 1.01) — not linked from the program overview or FAQ, which is why it was missed. It states the thresholds directly, and **identically on the Homeowner and Landlord/Tenant paths**: combined household assets **under $100,000** excluding the home being adapted, and combined annual gross household income **under $146,270.00**. There is **no single home-value cutoff** — the calculator asks for the community *and* the assessed value and evaluates them together, so none is stated in the record. Note for the future: the third-party figure of **$134,140** that advocacy sites quote is **wrong** as a general limit; refusing to copy it was correct |
| ~~BC-BC-15~~ | **Closed 2026-07-28, and it was a live false positive.** The owner supplied the page URL; the FAQ accordion (Drupal, collapsed, which is why it was missed) states verbatim: *"Post-secondary students are not eligible for financial assistance. However, students can access a discounted student rate on passes."* The record had **no** student rule, so KFAP was being shown to people Kelowna explicitly excludes — mutation-tested and confirmed: without the fix a Kelowna post-secondary student got status **`"ready"`**. Now gated by `notPostSecondaryStudent` (`met: () => !isStudent()`, `fixed: true` — correct here because the wizard *does* ask "In post-secondary school", so this is an answered criterion, not an unasked one), and the message hands the person the student-rate alternative rather than dead-ending them. Also captured from the same FAQ: temporary residents including study/work permits, business-class/investor/entrepreneur immigrants, and anyone banned from City facilities are excluded; applicants must re-apply yearly, up to one month before the term expires; and the LICO table is the **2025** one |
| ~~BC-BC-09~~ | **Closed 2026-07-28.** Answered from the official page the owner supplied (`gov.bc.ca` → Children and Youth with Support Needs): **new intake is open** — *"new families should continue using current pathways for assistance"*. SAET stays available until **March 31, 2027**, or until the child transitions to the new benefit, and all SAET authorizations are being aligned to that end date; the **BC Children and Youth Disability Benefit begins April 1, 2027**. The record's note now says exactly that. **Correction to my own first attempt:** I initially deleted the record's "starting April 2026" claim, believing it conflicted with the April 1 2027 start. It does not — the two dates mean different things, and the BC Gov news release timeline (`2026CFD0002-000136`) states both: **April 1, 2026** is when *implementation begins, focusing first on children already in the At Home Program*, and **April 1, 2027** is when the benefit is *fully operational provincewide*. So the original fact was correct and well-sourced, and deleting it also left the record contradicting its own `detail.time` and `detail.tips`. Restored, with both dates carrying their right meaning. The lesson worth keeping: I verified only the `note` field and then asserted the whole record was clean — a grep across every field would have caught it immediately |
| ~~ABFED-16/17~~ | **Closed as incorrect 2026-07-28 — see *Closed as incorrect* below.** |
| DATA-11 | Medicine Hat city page and 2026 PDF disagree ($630 vs $635) — needs program-owner clarification |
| ~~REL-06~~ | **Root cause found 2026-07-28 — no longer needs a human.** The "contradictory API routing" was not network- or region-dependent at all: it is **request-mode** dependent. `/api/link-health` returns **200 `application/json`** to `curl`/`fetch`, and **404 `text/html`** (our own 404 page) to a top-level browser navigation. Bisected to a single header: **`Sec-Fetch-Mode: navigate`** alone flips it; `Sec-Fetch-Dest`, `Sec-Fetch-Site`, `Sec-Fetch-User` and `Upgrade-Insecure-Requests` do not. Our Worker never reads `Sec-Fetch-*`, and **`wrangler dev --local` reproduces it**, so this is Cloudflare's static-asset routing (`assets.not_found_handling: "404-page"` in `wrangler.jsonc`) answering navigations before the Worker runs. **Severity is low**: the app's own `/api/*` calls use `fetch`, which sends `Sec-Fetch-Mode: cors`/`same-origin` and is unaffected — only a human typing an API URL sees it. **WON'T FIX — attempted 2026-07-29 and reverted.** The obvious fix is `assets.run_worker_first: ["/api/*"]` in `wrangler.jsonc`. It **works**: wrangler 4.114.0 accepts the array form, `deploy --dry-run` validates, and against `wrangler dev --local` the navigation returns **200 application/json** while `/`, `/guides/`, a guide page, `styles.css`, `app.js` and an unknown path all keep their correct status codes. **But it is forbidden on purpose.** `test/worker-transport.test.js` has a test literally named *"static assets declare HSTS without preload/subdomain expansion or **Worker-first billing pressure**"* which asserts `wrangler.jsonc` does not match `/run_worker_first/`. On Workers Free, static-asset requests are free while Worker invocations count against the daily request limit, so `run_worker_first` converts free asset serving into metered invocations — against AGENTS.md rule 2 ("Zero spend. Production stays on Cloudflare Workers Free") and DEPLOY.md ("Production must remain on **Workers Free**"). Shipping it would have required weakening that assertion, which is never the right move. And the trade is bad anyway: severity is **low** — the app's own `/api/*` calls use `fetch`, send `Sec-Fetch-Mode: cors`/`same-origin` and are unaffected, so the only person who ever sees the 404 is a human typing a monitoring URL. **Do not re-attempt without an explicit owner decision to relax the zero-spend guard.** If it is ever revisited, note that scoping to `/api/*` adds only the handful of navigations a human makes, not site-wide traffic — but that is a judgement for the owner, not a workaround |
| A11Y-01/02/03/05/06 | **First real VoiceOver + Safari pass done 2026-07-28 — one unresolved finding, everything else reported fine.** On a guide page (`bc-csg-services-equipment`) VoiceOver read the full h1, then **jumped straight to "Good to know", skipping the `.detail-lede` summary and the whole "What it is" block**, then jumped far down the page. **Not explained by our markup**: the Chromium accessibility tree exposes every section as a `heading` plus its text in document order, with "What it is" present between the title and "Good to know", nothing `aria-hidden`, and heading order h1 → h2×10. So the content is in the tree. **What is still needed to resolve it:** how VoiceOver was being driven at the time — item-by-item (VO+Right / swipe right), by heading rotor, or by landmark rotor — because heading and landmark navigation legitimately skip body text, and only item-by-item navigation skipping it would be a defect. NVDA and TalkBack still not run |
| Guide `<section>`s have no accessible name | **Observation, deliberately NOT changed 2026-07-28.** Each guide page has 10 `<section class="guide-block">` with no `aria-label`, no `aria-labelledby`, and no `id` on the `h2`s, so they map to `generic` rather than `region`. Adding `aria-labelledby` would turn them into 10 named landmarks per page, which is rotor **noise**, not help. Screen-reader users navigate long documents by heading, and the headings are correct and complete. Recorded so nobody "fixes" it reflexively |
| **Safari keyboard reachability** | Found 2026-07-28 by the new WebKit project. Chromium tabs `A#skipLink → BUTTON#headerMenuToggle → A#brandHome…`; WebKit tabs `SELECT → INPUT → TEXTAREA → BODY`, skipping **links and buttons entirely**. That is Safari's default until the user enables Full Keyboard Access — not an app defect. But it means a Safari keyboard-only user cannot Tab to the skip link, and the accessibility dialog (which contains only `<button>`s) cannot be Tab-traversed at all. VoiceOver users are unaffected because they navigate with the VO cursor, not Tab. **Confirm this during the real AT testing** — it is exactly the kind of thing automated checks cannot settle |
| Accessibility specialist | **Partly done 2026-07-28 by the owner: 200% text, 400% zoom/reflow and 320px portrait showed no cut-offs and no horizontal scrolling; forced-colours/contrast mode hid nothing; print and print-to-PDF both render correctly.** Still outstanding from this row: **touch-target sizing**, and a specialist's judgement rather than a spot check |
| ~~DATA-11~~ | **Closed 2026-07-28.** The owner called Medicine Hat and confirmed **$630** is the correct 2026 figure. The record already stated $630, so no data edit was needed — but it is now *confirmed by the program owner* rather than merely matching one of two conflicting sources. The $635 in the 2026 PDF is superseded. |
| Real disabled-user study | Keyboard/switch/voice, magnification, cognitive fatigue, pain, financial stress |
| Production-only validation | AI quota exhaustion, adversarial assistant prompts, email header sanitation in a non-delivery environment, field Core Web Vitals without analytics |

---

## Closed after verification

**Municipal percentage claims — checked one by one, 2026-07-28.** Calgary's "75% off
recreation" turned out to be invented, so every remaining municipal percentage was
re-verified against its own city source. **Calgary was the outlier, not the pattern.**

| Record | Claim | Verdict |
|---|---|---|
| `medicinehat-fair-entry` | 75% off transit, $630/yr max, $200/yr recreation | **Correct** — all three published |
| `grandeprairie-aish-pass` | $10.25 vs $74.25 pass, 75% recreation | **Correct** — the 75% comes from the separate Recreation Access Program, which does publish it |
| `airdrie-fair-access` | 25% / 50% / 75% by income | **Correct** — published as Levels C / B / A |
| `surrey-leisure-access` | free pass 0–18 and 60+, 75% adults, 75% courses | **Correct** — all published |
| `woodbuffalo-lift` | $10 pass, 75% specialized, 60% recreation | **One error fixed** — official is "10 and **25**-ride passes"; the record said 20-ride in `detail.about` while its own tip already said 25, so it contradicted itself |
| `aadl` | "~75% of approved equipment" | **Correct** — the official 25% client cost-share inverted |

Remaining caveat: DATA-11's Medicine Hat $630 vs $635 conflict is unrelated to the
percentage and still needs program-owner clarification (see the human-only table).

**The `[app-firefox]` reminder-calendar flake — diagnosed and made diagnosable, 2026-07-28.**
On run `73a1ddf`, `e2e/reminder-calendar.spec.js:111` timed out at 90s on CI. The reported
symptom ("waiting for `.opt` to become clickable") was wrong: the call log has no
actionability lines at all, so the locator matched **zero** elements for the full 90s and the
wizard was never on the `onset` step.

Three defects in the copy-pasted `pick()` helper let one stalled advance surface, one or two
steps later, as an undiagnosable timeout:

1. `hasText` is a **substring** match, and labels overlap across steps — `"Yes"` is a
   substring of `"Yes, it is documented"`, `"Yes, usually fine"` and
   `"Yes, it began in childhood"`. A pick could click a plausible option on the **wrong** step.
2. The settle wait was bounded at 3s but its rejection was swallowed by `.catch(() => {})`,
   so a late advance returned **silently** with the wizard one step behind.
3. Auto-advance rides the radio's `change` event (`public/app.js:2999`). Re-clicking an
   already-checked option fires no `change`, so `goNext` never runs — one step behind became
   **permanently wedged**, not merely late.

Compounding all three: the wizard is adaptive, so `skipIf` predicates keyed off
`answers.disabilities` mean the walk's shape is not fixed, and nothing asserted which
question was being answered. Every divergence path produced a byte-identical failure.

Fixed in all three copies (`reminder-calendar`, `persistence`, `bc-live`): `pick()` now reads
the wizard's real step from the page and asserts the option belongs to it **before** clicking,
and the settle wait throws with context. **No timeout was raised and no sleep was added**, and
no production code changed. Verified by inducing both failure modes deliberately — a
divergence now reports `wizard is on step "autismDiagnosis", whose options are [...]` and a
frozen `goNext` reports `the wizard did not settle within 3000ms` — plus 107 unit and 411 e2e
green across all six projects.

Caveat kept on purpose: **the original CI stall was never reproduced.** 3 sequential spec runs,
the full 126-test Firefox project and 22 instrumented replays (12 under CPU contention) were
all clean, and Firefox advance latency measured 240ms median / 269ms max. The CI trace needs
auth to download.

**Then the new guard found the root cause, 2026-07-28.** Made fatal, the settle wait failed
twice on full-suite runs — `[app-firefox] bc-live.spec.js:151` and `[app-webkit]
persistence.spec.js:152` — the second time after **20 seconds** on an *unchecked* radio, which
is not a slow machine. Both failures were in tests where **animation is on**, which is what
gave it away:

`public/styles.css:371` sets `.card { animation: rise 0.5s var(--ease); }`, and `@keyframes
rise` is `from { opacity: 0; transform: translateY(10px); }`. The wizard step container carries
`class="card wizard-card"`, so **every step render animates the whole card — every `.opt`
included — 10px upward over 500ms.** `.options` has a `gap: 10px`: the same distance.
Playwright decides an element is "stable" from two same-valued bounding-box samples, and under
load both samples can land inside one animation frame, so the click is dispatched at stale
coordinates and can fall into the gap **between** two options. Nothing is hit, no `change`
event fires, `goNext` never runs, and the wizard sits.

`pick()` already had the right wait — a race of `card.getAnimations()` against 1000ms — but it
was **unreachable on the steps that needed it**, gated behind `includes("Continue")`, and only
multi-answer steps render a Continue button (`t("wiz.continue")` vs `t("wiz.next")`). So
single-answer steps, which are most of every walk, had never waited for the entrance animation.
The wait is now unconditional and filters to finite animations, because the decorative aurora
and `.wiz-mountains` drift animations are `infinite` and their `finished` promise never resolves.

Deliberately **not** fixed by defaulting the suite to `reducedMotion: "reduce"`. That would buy
the same green by deleting a real accessibility surface from the tests — motion is something
this product has to get right, and `e2e/a11y-batch.spec.js:103` opts into
`no-preference` precisely to exercise it.

Evidence: **2 wizard stalls in 5 full runs before the fix, 0 in 4 after.** Suggestive, not
proof — but the mechanism is now understood rather than guessed, which matters more than the
sample count.

**The family recurred on CI, 2026-07-30, and it cost a release.** Run `30574672375` on
`47bee58` was **cancelled at the 45-minute job cap**, so `deploy` was skipped and a good
commit never reached production.

It was **not** the 2026-07-28 browser-install problem. The Playwright cache hit and the
install step was skipped; system dependencies took 3.8 min and unit tests 0.13 min. All
**39.2 minutes** went into the single "Browser and Worker tests" step, and the public
annotations show it was accumulating 90-second timeouts rather than merely running slowly:
`bc-live.spec.js:194`, `:205` and `:366` (one failing on `locator.click`),
`persistence.spec.js:184` failing inside `pick("I'm not sure…")`, and
`reminder-calendar.spec.js:185`, `:214` and `:245`. **Every one was `[app-chromium]`.** With
`retries: 0` by design each failure costs a full 90 seconds, which is how a single bad run
reaches the cap.

The commit is exonerated by re-running it unchanged. `47bee58` touched four URLs, one archive
section and the asset version — nothing that can affect wizard interaction or calendar
arithmetic — it was **420/420 green locally**, and an empty re-trigger commit (`f19fc23`) put
the identical tree through CI in **16.5 minutes, green**, inside the 14.9–16.4 minute band of
the seven runs before it. Same tree, same suite, opposite outcome: the run was the variable,
not the code.

**This is the second time the job cap has blocked a good release** — 30 minutes on 2026-07-28,
45 minutes on 2026-07-30. Raising the cap treats the symptom, and the honest state of this
family is **rarer, not eliminated**.

**Root-caused 2026-08-15, and this section's own explanation was wrong.** The paragraphs above
frame the open question as why *`[app-chromium]`* accumulates 90-second timeouts. That framing
is a false lead and should not be inherited. The family was **reproduced locally three times**
and the mechanism reclassified as a **browser / CDP connection wedge under resource
exhaustion**, not a wizard, locator or animation problem: the errors are **not assertions** but
`page.goto`, `page.evaluate`, `page.route`, `locator.click` and decisively `browserContext.close`
and "Target page, context or browser has been closed". No product code runs during a context
close. It is **not engine-specific** — the third reproduction hit all three engines (3 chromium,
3 firefox, 7 webkit). CI most plausibly reported chromium because chromium runs first and
longest, so it is likeliest to be running when the machine degrades. Machine state at one wedge:
**load average 146 on a 15-core machine, swap 79% used**. Note that the causal resource is still
**unidentified** — an earlier "CPU contention is ruled out" experiment ran at only ~1.6×
oversubscription against measured wedge conditions of ~10×, so it was about six times too weak
to test what it claimed.

Two palliatives landed with it (`0f3f9a4`), and they are **palliative, not causal**: the
`pick()` click is bounded at 30s and reports live wizard state on expiry, and
`e2e/failure-context-reporter.js` prints a `FAILCTX` line per non-passing test carrying free/total
memory, load average, RSS and elapsed time. The next CI failure should be read straight off its
FAILCTX annotation — low `freeMemMb` at failure moves memory from correlation toward evidence.

**Reproducibility sample, completed 2026-08-16: 6 consecutive green CI runs on `main` — one more
than the agreed sample of 5 — zero 90-second-timeout annotations, all inside tolerance.** The
trailing median of the seven runs before the bad one was ~15.4 min, so the agreed 1.5× band is
≈23.1 min; the bad run was 39.2 min. Measured, in landing order from the commit that carried the
instrumentation: **15.5, 15.6, 15.5, 13.5, 15.2, 15.0 min** — every one inside the band, and the
spread (13.5–15.6) is tighter than the pre-existing 14.9–15.8 band. Two observations kept deliberately: free memory
hit **57–71 MB** at the low-water mark on *green* local runs of 441 tests, and one local full run
during this sequence failed a single oracle test and then passed 441/441 on a re-run of the
identical tree — so the family is demonstrably still present, just rare. Its FAILCTX line was not
captured before the re-run, which was a missed observation.

**A wedge also poisons the next run.** A killed run leaves orphaned servers holding 8766 and 8788
(a python http.server and a half-dead `workerd`), and the following suite then fails to start at
all with "Process from config.webServer was not able to start". On CI that surfaces as an
unexplained infrastructure error on a *later* build with no visible link to the wedge. Clear both
ports before re-running.

**Correction to the TEST-02 closure written 2026-07-29:** that row notes the A11Y-03 flake had
not recurred and that `retries: 0` would make one visible if it did. Both statements are still
true, and the mechanism worked exactly as described — but the row read as more settled than the
suite actually is. TEST-02's three planned items remain done; the flakiness they were meant to
reduce is not gone.

---

## Closed as incorrect — do not "fix" these

| ID | Why |
|---|---|
| ABFED-16/17 | **Verified false positive, 2026-07-28.** The audit claims the Easter Seals and Dog Guides entries "present closed intakes as actionable". Neither entry states an intake status **at all** — both are directory records in `public/grants-data.js` that describe what the organisation offers and route to its own program pages (*"Program pages on their site explain each application"*, *"Apply through the Get a Dog Guide section on their site"*), which is the correct behaviour for a directory. The owner also confirmed directly that **both are currently accepting applications**. So there was nothing to fix; only the `verified` dates were refreshed to 2026-07-28. This is the **third** audit finding disproved against primary sources |
| BC-BC-02 | **Verified false positive, 2026-07-27.** The audit claims four PWD prescribed classes excluding Indigenous Services Canada. The current BCEA policy page (effective 2021-10-05, page updated 2026-07-13) lists **five**, explicitly including "People who have been designated as a Person with Disabilities by Indigenous Services Canada (ISC) within the BC region", and routes prescribed-class applicants to **HR3642** — exactly what the record already says. The audit appears to have conflated this with the separate "moving on reserve" policy. ISC designations are adjudicated by BCANDS |

---

## Done and deployed

**The 2026-08-16 landing sequence.** Seven TaskView tickets had been built, reviewed and pushed to
feature branches but **nothing had reached `main`**, so none of it was deployed — a feature-branch
push triggers no CI and no release. They were landed one at a time, each gated on a green CI run
and verified against the live site, because the repo's own rule is small separate landings and
`concurrency: cancel-in-progress` means a second push cancels an in-flight run. Order and result:
board chores (canary, no `public/` change), **#61** TEST-01 oracle (`01de333`), **#62** test
infrastructure (`0f3f9a4`), **#44** data-procedure guard (`5181b9e`), **#66** DATA-25 (`8be02fe`,
`?v=99`), **#41** link-health cadence (`af90387`, `?v=100`), **#67** UX-02 copy (`37b3215`,
`?v=101`), **#68** UX-03 ordering (`b7f2274`, `?v=102`). Every landing was verified live, not from
the deploy job's own conclusion.

Two things worth keeping from that sequence. **The four data/copy branches could not be merged in
parallel**: each independently bumped `?v=98→99` and regenerated the same 102 guides. Sequential
landing forced 99 → 100 → 101 → 102, and the guides had to be *regenerated* at each step rather
than merge-resolved — the only genuine conflict each time was `public/changelog.js`, where each
branch appends its own entry. **And #44's guard was inert in CI as delivered**: `actions/checkout`
defaults to depth 1, and the guard resolves a git baseline to prove a data change also moved the
shared `?v=N` and appended a changelog entry. Proven three ways before changing anything — shallow
checkout fails closed with "the git baseline is unavailable"; full history passes 4/4 on a correct
change; full history fails the *right* test (`a data change moves the index asset version`) when
`grants-data.js` changes but the version does not. `fetch-depth: 0` was added to the test job in
the same landing. Without it the guard would have gone red on #66 and blocked that deploy.

**#41 — the link-health review cadence.** Stated beside the constants that produce it: cron
`0 */3 * * *` × 18 batches × `LINKS_PER_RUN` 10 over 180 links = a full sweep about every **54
hours**. Weekly review sees the latest cumulative report within seven days but does **not** review
every sweep. Of 14 flagged sources, **13 were noise** — five false alarms confirmed live in a real
browser (two `403` bot challenges, a transient `526`, two Worker timeouts) and eight single-hop
redirect canonicalisations deliberately not rewritten. One genuine break: the Easter Seals
equipment-programs page, repointed to the verified-200 root. *Had the monitor been trusted at face
value, the two 403s would have "fixed" two live municipal pages disabled users rely on.*

Matcher safety (no unsupported "ready" verdict anywhere): **DATA-42/43/44 + ABFED-02** (`fc0a8f9`),
**DATA-30/47/48/49/50 + BC-BC-05/14/16** (`eb0210d`), **DATA-33/35/36/37/39/40/41 + ABFED-08** (`f4bc205`).

**Renovation tax credits, 2026-07-28.** `home-accessibility-tax-credit` and
`bc-home-reno-tax-credit` could both reach "ready" from `homeRenoCandidate` + `homeowner`. Both are
**reimbursements of money already spent**: with no renovation there is no credit and nothing to
apply for, so "Ready to apply" was a false verdict about money. The questionnaire never asks
whether a qualifying renovation happened, and that is not incidental — it is the whole substance of
both credits. A shared `qualifyingRenovationSpend` predicate (`met: () => false`, `fixed: false`)
now puts both at "One step away" instead. `fixed: false` matters: a hard "no" would wrongly drop the
credit for people who simply have not done the work yet. The shared `unmet` text deliberately states
**no program-specific rule**, because B.C.'s credit was not re-verified against its source that day;
each record's own `requiresNote` carries its own definition. Guarded by "renovation tax credits stay
conditional on the work actually being done, never ready" in `e2e/matcher-safety.spec.js`, which was
mutation-tested — removing the gate fails it with `Expected: "almost" / Received: "ready"`.

Data accuracy: DATA-01, DATA-02, DATA-03, DATA-05, DATA-06, DATA-07, DATA-08,
DATA-09, DATA-10, DATA-14, DATA-15, DATA-46 (`a7c648d`), ABFED-05 (`f438915`),
ABFED-07 (`3aa85cd`), ABFED-09 (`3ef9a32`), ABFED-A01 (`fdd6d25`),
BC-BC-06 (`9ab36d8`), BC-BC-12 (`f4eb57c`), BC-BC-17 (`2891c17`), DATA-51.

Matcher under-inclusion: Kamloops ARCH income-or-assistance route (`86512cc`) —
a resident on MSDPR assistance is no longer denied for reporting moderate income.

Defects and hardening: DATA-04, DATA-28, DATA-38, ABFED-01/03/04/06, AI-01, AI-02,
A11Y-01/02/03/05/06, REL-01, REL-02, REL-03, REL-04, CAL-01, SEC-02, SEC-03,
and the quick-win bundle REL-05, SEC-05, UX-01, AQ-03, AQ-04, DEPLOY-01 (`8042e42`).

Hardening, toolchain and docs: **SEC-04** — `MAX_BODY_BYTES` (64 KB) rejects an oversized
declared body with 413 **before any binding is touched**, so it never consumes the KV rate
limiter or reaches AI/email quota. **SUPPLY-01** — resolved by upgrading to wrangler
`^4.114.0` (→ miniflare 4.20260722.0 → sharp 0.35.2); `npm audit` reports 0 vulnerabilities,
with no downgrade. **DOC-01** — `HANDOFF.md` and `ROADMAP.md` corrected: B.C. is live with
real counts (84 total; 8 federal, 10 Alberta, 36 B.C.) and the parked-provinces file is at
`archive/`, not `public/`. `test/docs-consistency.test.js` now fails if the docs drift from
the catalogue again.

Edge/infrastructure: **SEC-01** — HTTP now 301-redirects to HTTPS on root, guides, assets and
API, with HSTS `max-age=15552000`. **PRIV-01** — self-only CSP, zero analytics beacons.

---

## Release status

The audit's original **NO-GO** has not been formally lifted. Before claiming the audit is
closed, all of the following must be true. As of 2026-08-16, **three of the four are**:

1. ~~The remaining code findings above are fixed or visibly qualified.~~ **Met 2026-08-16.**
   DATA-25 and TEST-01 closed and deployed; UX-02 and UX-03 have their code landed and are
   visibly qualified here as awaiting reader/profile testing; REL-06 and PERF-01 are recorded
   as WON'T FIX with reasons.
2. **Manual disabled-user and assistive-technology testing has actually happened. — NOT MET.
   This is now the sole barrier to lifting the NO-GO.** One VoiceOver + Safari pass happened
   2026-07-28 with one finding still unresolved; NVDA and TalkBack have never been run, and no
   real disabled-user study has taken place.
3. ~~The outstanding official clarifications (BC-BC-09/15, ABFED-16/17, DATA-11) are resolved.~~
   **Met 2026-07-28** — all four closed, two of them as verified false positives.
4. ~~A clean production smoke test follows the final release candidate.~~ **Met 2026-08-16** —
   each of the eight landings was verified against the live site after its deploy, including the
   DTC criteria and the corrected headline in both languages. Re-run this against whatever the
   final release candidate turns out to be.

**Code completeness is no longer the blocker, and has not been for some time.** Do not let the
closed rows above read as readiness: the product still has not been used by a single person
navigating it with a screen reader.
