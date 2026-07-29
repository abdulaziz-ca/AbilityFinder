# AbilityFinder — remaining work

**Purpose:** the single place to see what is actually finished and what still needs doing.
Update this file whenever a finding is closed, reopened, or found to be wrong.

**Last updated:** 2026-07-28 · **Source of findings:** `AUDIT_REPORT_2026-07-22.md`

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

| Status | Rows | Notes |
|---|---|---|
| **Fully closed and deployed** | **54+** | was ~83% before 2026-07-28; several more closed that day, not yet recounted |
| Partly closed | 0 | **BC-BC is now complete** (BC-BC-15 and BC-BC-09 both closed 2026-07-28) and **DATA-12 is fully closed** |
| Mitigated, not closed | 3 | DATA-25, UX-02, UX-03 — all need product decisions or user testing |
| Open | 2 | TEST-01, and the accessibility/user testing. **PERF-01** measured with its two real defects fixed. **BC-BC-09/15**, **ABFED-16/17** and **DATA-11** closed 2026-07-28. **REL-06 is root-caused but WON'T FIX** — the behaviour still exists in production; the fix was declined on zero-spend grounds, see its row below |

By severity:

| Severity | Closed | Total | |
|---|---|---|---|
| **High / P1** | **22** | 23 | only DATA-25 outstanding, and it is mitigated |
| Medium / P1 | see note | 18 | 2 mitigated. The human-only clarifications (BC-BC-09/15, ABFED-16/17, DATA-11) closed 2026-07-28; **REL-06 is root-caused but WON'T FIX, not fixed**. **Nobody has re-mapped finding IDs to severities**, so no count is stated rather than an invented one |
| Medium / P2 | see note | 12 | DATA-11 and DATA-12 closed 2026-07-28; only PERF-01's residual JS-gating remains. Count not restated for the same reason as the row above |
| Low + Informational | 12 | 12 | complete |

**Every High/P1 release blocker except DATA-25 is closed.** What remains is
concentrated in two places: work that needs a product decision (DATA-25, UX-02,
UX-03, TEST-01) and work that needs a person (see the human-only table).

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
| UX-02 | Homepage still overpromises completeness/certainty | Mitigated only; needs a content pass + comprehension testing |
| UX-03 | "Priority order" uses unexplained editorial weights | Mitigated only; formula still unexplained and unvalidated |
| DATA-25 | DTC readiness | Mitigated, not closed — needs real CRA functional-criteria questions |
| TEST-01 | No systematic eligibility oracle across all programs | The gap that allowed the false-ready cluster |
| ~~TEST-02~~ | **Closed 2026-07-29.** All three planned items are implemented, and the row above was stale on every count. **Sleeps:** zero `waitForTimeout` remain in `e2e/` or `test/` — replaced by 22 `waitForFunction`, 51 `toBeVisible` and 12 `settleWizardCard`. **Engines:** `playwright.config.js` builds six projects from an ENGINES array of chromium, firefox and webkit. **Wrangler:** the three `worker-*` projects run against `npx wrangler dev --port 8788 --local`, so `_headers`, the production CSP and the real `/api/*` contracts are now exercised — the blind spot that let REL-05 ship. The three `app-*` projects still use the python3 static server, which is correct and faster for product journeys. `retries: 0` is deliberate, so a flake surfaces instead of being laundered into a pass. Green at 420/420 across all six projects on repeated full runs on 2026-07-29. The 2026-07-27 `a11y-batch.spec.js` A11Y-03 flake noted here has not recurred, but with `retries: 0` it would be visible if it did |
| PERF-01 | **Re-measured 2026-07-28 — the audit's headline figure is stale.** On a throttled Pixel 5 profile (4× CPU, ~1.6 Mbps, 150 ms RTT) production was **LCP 2364 ms, not 4.0 s**, and **long tasks totalled 0 ms**, so "render-blocking scripts" is not the right framing — the main thread is not the bottleneck. Two real defects were found by measuring and are now **fixed**: both webfonts were downloaded **twice** on every cold load (preload/`@font-face` URL drift, 113 KB wasted, LCP → 2196 ms), and first-load **CLS was 0.0905 → now 0.0000**. What remains: above-the-fold content is still gated on ~170 KB gzipped of script plus an async IndexedDB restore, because `<main id="app">` ships only a loading placeholder. **INP still unmeasured in the field** — it needs real users, and there is no analytics by design, so it belongs with the production-only validation in the human table |

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
| Money band never shows an amount | The `mb.upTo` "Up to ~$X / year" path is now **unreachable** — 540 profiles probed, none produces a countable annual total, because every cash benefit correctly requires adjudication and DTC is excluded from estimates. Decide whether the band earns its prominence |
| All-conditional results framing | Some realistic profiles (e.g. an Alberta adult unable to work) yield **zero** ready results — accurate, but the page should read as actionable rather than as a downgrade |
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

---

## Closed as incorrect — do not "fix" these

| ID | Why |
|---|---|
| ABFED-16/17 | **Verified false positive, 2026-07-28.** The audit claims the Easter Seals and Dog Guides entries "present closed intakes as actionable". Neither entry states an intake status **at all** — both are directory records in `public/grants-data.js` that describe what the organisation offers and route to its own program pages (*"Program pages on their site explain each application"*, *"Apply through the Get a Dog Guide section on their site"*), which is the correct behaviour for a directory. The owner also confirmed directly that **both are currently accepting applications**. So there was nothing to fix; only the `verified` dates were refreshed to 2026-07-28. This is the **third** audit finding disproved against primary sources |
| BC-BC-02 | **Verified false positive, 2026-07-27.** The audit claims four PWD prescribed classes excluding Indigenous Services Canada. The current BCEA policy page (effective 2021-10-05, page updated 2026-07-13) lists **five**, explicitly including "People who have been designated as a Person with Disabilities by Indigenous Services Canada (ISC) within the BC region", and routes prescribed-class applicants to **HR3642** — exactly what the record already says. The audit appears to have conflated this with the separate "moving on reserve" policy. ISC designations are adjudicated by BCANDS |

---

## Done and deployed

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
closed, all of the following must be true, and none of them is yet:

1. The remaining code findings above are fixed or visibly qualified.
2. Manual disabled-user and assistive-technology testing has actually happened.
3. The outstanding official clarifications (BC-BC-09/15, ABFED-16/17, DATA-11) are resolved.
4. A clean production smoke test follows the final release candidate.
