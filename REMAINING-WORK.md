# AbilityFinder — remaining work

**Purpose:** the single place to see what is actually finished and what still needs doing.
Update this file whenever a finding is closed, reopened, or found to be wrong.

**Last updated:** 2026-07-27 · **Source of findings:** `AUDIT_REPORT_2026-07-22.md`

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
| **`requiresNote` is never rendered** | 45 benefit records carry a `requiresNote` field, but no surface displays it — not `public/app.js`, not `scripts/gen-guide-pages.js`, not `scripts/gen-benefits-context.js`. Every eligibility clarification written into that field since the project began is invisible to users. Decide whether to render it or drop it; until then, put user-facing eligibility detail in `detail.about`, which **is** rendered. Discovered 2026-07-27 while fixing the ARCH income route |

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
