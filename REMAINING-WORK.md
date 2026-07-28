# AbilityFinder — remaining work

**Purpose:** the single place to see what is actually finished and what still needs doing.
Update this file whenever a finding is closed, reopened, or found to be wrong.

**Last updated:** 2026-07-28 · **Source of findings:** `AUDIT_REPORT_2026-07-22.md`

> **Start here.** This file is the working record. `AUDIT_REPORT_2026-07-22.md` is
> 120 KB — do not load it whole. Grep it for a specific finding ID when you need the
> original evidence.

## Audit completion

The audit's findings table has **65 rows**. Current state:

| Status | Rows | Notes |
|---|---|---|
| **Fully closed and deployed** | **54** | ~83% |
| Partly closed | 2 | BC-BC group (7 of 8 done, BC-BC-15 needs a human); DATA-12 (RAMP added, 3 candidates remain) |
| Mitigated, not closed | 3 | DATA-25, UX-02, UX-03 — all need product decisions or user testing |
| Open | 6 | TEST-01, PERF-01, and 4 needing a human |

By severity:

| Severity | Closed | Total | |
|---|---|---|---|
| **High / P1** | **22** | 23 | only DATA-25 outstanding, and it is mitigated |
| Medium / P1 | 12 | 18 | 2 mitigated, 4 need a human |
| Medium / P2 | 9 | 12 | PERF-01, DATA-11, DATA-12 |
| Low + Informational | 12 | 12 | complete |

**Every High/P1 release blocker except DATA-25 is closed.** What remains is
concentrated in two places: work that needs a product decision (DATA-25, UX-02,
UX-03, TEST-01) and work that needs a person (see the human-only table).

The NO-GO has still not been lifted — see *Release status* at the end. Code
completeness is not the blocker; the untested accessibility is.

> **Treat the audit as a lead, not an authority.** Two of its findings have now been
> disproved against primary sources (see *Closed as incorrect*). Always re-verify a
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
| DATA-12 | Several in-scope programs absent (RAMP, BC Additional Home Owner Grant, BC Rebate for Accessible Home Adaptations, federal Home Accessibility Tax Credit) | Enhancement. ROADMAP allows expansion only program by program |
| ~~Other municipal percentages~~ | **Verification pass completed 2026-07-28 — see "Closed after verification" below.** |
| UX-02 | Homepage still overpromises completeness/certainty | Mitigated only; needs a content pass + comprehension testing |
| UX-03 | "Priority order" uses unexplained editorial weights | Mitigated only; formula still unexplained and unvalidated |
| DATA-25 | DTC readiness | Mitigated, not closed — needs real CRA functional-criteria questions |
| TEST-01 | No systematic eligibility oracle across all programs | The gap that allowed the false-ready cluster |
| TEST-02 | E2E is Chromium-only on a Python static server, with fixed sleeps | Needs a Wrangler-backed project + browser matrix. **Observed flake 2026-07-27:** `e2e/a11y-batch.spec.js` "A11Y-03: skip link is first focusable" failed once inside the full suite and passed on isolated re-run and on full-suite re-run — exactly the timing fragility this finding describes |
| PERF-01 | Production mobile lab LCP 4.0s; render-blocking scripts | INP still unmeasured |

## Planned procedure — deploy gate and TEST-02 (agreed 2026-07-28, not started)

Do these as **four small separate landings**, in this order. Do not combine them: mixing new
test infrastructure with fixes for what it surfaces produces an unreviewable diff and
un-bisectable failures.

### 0. Pre-deploy gate — higher value than all of TEST-02

**The problem is not test quality, it is that nothing gates deployment.** There is no CI, no
git hooks, and no pre-deploy check: `git push origin main` triggers Workers Builds directly.
On 2026-07-27 two `e2e/reminder-calendar.spec.js` tests were red across two deploys and were
reported as passing, because a truncated `tail` of the Playwright output hid the `N failed`
header. The suite worked correctly; the human control failed. Better tests would not have
prevented this. A gate would.

This is not in the audit — the audit assumed a competent human reads the output. It matters
more on a solo-maintained project, not less, because there is no second reviewer.

- Add a GitHub Actions workflow running `npm test && npx playwright test` on push to `main`.
- Move `wrangler deploy` **into** that workflow behind a Cloudflare API token so a red suite
  physically cannot reach production.
- **Open decision for the owner:** this needs a Cloudflare API token stored as a GitHub
  secret, and it changes how deploys work — pushing would no longer deploy directly, the
  workflow would. Fallback if declined: a pre-push hook, which is weaker (local-only,
  bypassable with `--no-verify`) but better than nothing.
- Always read Playwright results with `grep -E "passed|failed|flaky"`, never a truncated tail.

### 1. Remove the 5 fixed sleeps in `e2e/`

Replace `waitForTimeout` with state-based waits. Small and purely mechanical, but do it
**before** adding surface area: a flaky baseline trains you to skim failures, which is the
habit behind the reporting error above. Establish a green you trust first.

### 2. Wrangler-backed Playwright project

Highest value of the three original TEST-02 items, because it closes a **demonstrated**
escape rather than a theoretical one. REL-05 — the crash-recovery button broken by the
production CSP — shipped and lived in production, and the suite could never have caught it:
`python3 -m http.server` serves no `_headers` and no Worker. The same blind spot covers
SEC-02, SEC-04 and Cloudflare asset routing, all currently verified only by hand against
production after each deploy, which is not a sustainable control.

### 3. Browser matrix (Chromium + Firefox + WebKit) — last, and expect it red

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
| **WebKit: `Database deletion blocked`** | Found 2026-07-28. `deleteAppStorage()` in `e2e/persistence.spec.js:22` rejects on IndexedDB's `onblocked`, which fired once in 9 full-suite runs on `[app-webkit] persistence.spec.js:311`. `onblocked` does not mean failure — it means the delete is deferred until other connections close, so rejecting on it is too strict. The helper already calls `AbilityFinderDB.close()` first, so something reopens the connection (a pending restore or a `notifyStateChange` write racing back). Same family as the `pick()` defects: a test helper turning a benign async state into a hard failure. Runs before any wizard interaction, so it is unrelated to the animation race above |

## Still open — needs a human, cannot be automated

| ID | What is needed |
|---|---|
| BC-BC-15 | Kelowna KFAP post-secondary-student exclusion. `kelowna.ca` returns **403** to automated fetch; verify on the live page or call 250-469-8759 |
| BC-BC-09 | SAET new-intake status unclear in current transition material — needs government clarification |
| ABFED-16/17 | Easter Seals and Dog Guides entries present closed intakes as actionable — confirm current intake status with each organization |
| DATA-11 | Medicine Hat city page and 2026 PDF disagree ($630 vs $635) — needs program-owner clarification |
| REL-06 | Two production clients returned contradictory API routing — retest from ≥2 real networks/regions capturing CF-Ray |
| A11Y-01/02/03/05/06 | Wizard rebuild passes automated checks but has **never** been through VoiceOver, NVDA or TalkBack |
| **Safari keyboard reachability** | Found 2026-07-28 by the new WebKit project. Chromium tabs `A#skipLink → BUTTON#headerMenuToggle → A#brandHome…`; WebKit tabs `SELECT → INPUT → TEXTAREA → BODY`, skipping **links and buttons entirely**. That is Safari's default until the user enables Full Keyboard Access — not an app defect. But it means a Safari keyboard-only user cannot Tab to the skip link, and the accessibility dialog (which contains only `<button>`s) cannot be Tab-traversed at all. VoiceOver users are unaffected because they navigate with the VO cursor, not Tab. **Confirm this during the real AT testing** — it is exactly the kind of thing automated checks cannot settle |
| Accessibility specialist | 200% text, 400% zoom/reflow, 320px portrait, forced colours, touch targets, print |
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
| BC-BC-02 | **Verified false positive, 2026-07-27.** The audit claims four PWD prescribed classes excluding Indigenous Services Canada. The current BCEA policy page (effective 2021-10-05, page updated 2026-07-13) lists **five**, explicitly including "People who have been designated as a Person with Disabilities by Indigenous Services Canada (ISC) within the BC region", and routes prescribed-class applicants to **HR3642** — exactly what the record already says. The audit appears to have conflated this with the separate "moving on reserve" policy. ISC designations are adjudicated by BCANDS |

---

## Done and deployed

Matcher safety (no unsupported "ready" verdict anywhere): **DATA-42/43/44 + ABFED-02** (`fc0a8f9`),
**DATA-30/47/48/49/50 + BC-BC-05/14/16** (`eb0210d`), **DATA-33/35/36/37/39/40/41 + ABFED-08** (`f4bc205`).

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
