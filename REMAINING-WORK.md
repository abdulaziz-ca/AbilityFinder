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
| DATA-07 | Calgary Fair Entry shows 2025 prices; 2026 rates are $6.30/$44.10/$63 | Verify against the current Calgary Transit fare notice |
| DATA-08 | Edmonton processing time understated (site 1–2 weeks; official 8–12 weeks + card delivery) | |
| DATA-09 | ADAP contact mislabeled — the number shown is the AISH application-status line | Alberta Supports is 1-877-644-9992 |
| DATA-15 | Organization cards render a hardcoded "Verified July 2026" | `orgs-data.js` holds real per-org dates; render `record.verified` |
| DATA-12 | Several in-scope programs absent (RAMP, BC Additional Home Owner Grant, BC Rebate for Accessible Home Adaptations, federal Home Accessibility Tax Credit) | Enhancement. ROADMAP allows expansion only program by program |
| UX-02 | Homepage still overpromises completeness/certainty | Mitigated only; needs a content pass + comprehension testing |
| UX-03 | "Priority order" uses unexplained editorial weights | Mitigated only; formula still unexplained and unvalidated |
| DATA-25 | DTC readiness | Mitigated, not closed — needs real CRA functional-criteria questions |
| TEST-01 | No systematic eligibility oracle across all programs | The gap that allowed the false-ready cluster |
| TEST-02 | E2E is Chromium-only on a Python static server, with fixed sleeps | Needs a Wrangler-backed project + browser matrix. **Observed flake 2026-07-27:** `e2e/a11y-batch.spec.js` "A11Y-03: skip link is first focusable" failed once inside the full suite and passed on isolated re-run and on full-suite re-run — exactly the timing fragility this finding describes |
| PERF-01 | Production mobile lab LCP 4.0s; render-blocking scripts | INP still unmeasured |
| SEC-04 | Request body parsed before app-level size limits | Hardening only |
| DOC-01 | HANDOFF and public claims disagree with the live BC architecture | Update after the remaining fixes land |
| SUPPLY-01 | 3 high advisories via `wrangler` → `miniflare` → `sharp` | **Dev-only**; production deps audit clean. Monitor, do not blind-downgrade |

## Still open — found during remediation, not in the audit

| Item | What is wrong |
|---|---|
| Money band never shows an amount | The `mb.upTo` "Up to ~$X / year" path is now **unreachable** — 540 profiles probed, none produces a countable annual total, because every cash benefit correctly requires adjudication and DTC is excluded from estimates. Decide whether the band earns its prominence |
| All-conditional results framing | Some realistic profiles (e.g. an Alberta adult unable to work) yield **zero** ready results — accurate, but the page should read as actionable rather than as a downgrade |
| ARCH income route under-inclusion | `kamloops-arch` gates on `lowIncome` (`fixed: true`, ~$35k band), but ARCH officially accepts **MSDPR Income Assistance _or_ income below StatCan LICO**. A Kamloops resident on disability assistance reporting moderate income gets a wrong hard "not a match". Same pattern as the fixed Coquitlam/Healthy Kids cases |

## Still open — needs a human, cannot be automated

| ID | What is needed |
|---|---|
| BC-BC-15 | Kelowna KFAP post-secondary-student exclusion. `kelowna.ca` returns **403** to automated fetch; verify on the live page or call 250-469-8759 |
| BC-BC-09 | SAET new-intake status unclear in current transition material — needs government clarification |
| ABFED-16/17 | Easter Seals and Dog Guides entries present closed intakes as actionable — confirm current intake status with each organization |
| DATA-11 | Medicine Hat city page and 2026 PDF disagree ($630 vs $635) — needs program-owner clarification |
| REL-06 | Two production clients returned contradictory API routing — retest from ≥2 real networks/regions capturing CF-Ray |
| A11Y-01/02/03/05/06 | Wizard rebuild passes automated checks but has **never** been through VoiceOver, NVDA or TalkBack |
| Accessibility specialist | 200% text, 400% zoom/reflow, 320px portrait, forced colours, touch targets, print |
| Real disabled-user study | Keyboard/switch/voice, magnification, cognitive fatigue, pain, financial stress |
| Production-only validation | AI quota exhaustion, adversarial assistant prompts, email header sanitation in a non-delivery environment, field Core Web Vitals without analytics |

---

## Closed as incorrect — do not "fix" these

| ID | Why |
|---|---|
| BC-BC-02 | **Verified false positive, 2026-07-27.** The audit claims four PWD prescribed classes excluding Indigenous Services Canada. The current BCEA policy page (effective 2021-10-05, page updated 2026-07-13) lists **five**, explicitly including "People who have been designated as a Person with Disabilities by Indigenous Services Canada (ISC) within the BC region", and routes prescribed-class applicants to **HR3642** — exactly what the record already says. The audit appears to have conflated this with the separate "moving on reserve" policy. ISC designations are adjudicated by BCANDS |

---

## Done and deployed

Matcher safety (no unsupported "ready" verdict anywhere): **DATA-42/43/44 + ABFED-02** (`fc0a8f9`),
**DATA-30/47/48/49/50 + BC-BC-05/14/16** (`eb0210d`), **DATA-33/35/36/37/39/40/41 + ABFED-08** (`f4bc205`).

Data accuracy: DATA-01, DATA-02, DATA-03, DATA-05, DATA-06, DATA-10, DATA-14,
DATA-46 (`a7c648d`), ABFED-05 (`f438915`), ABFED-07 (`3aa85cd`), ABFED-09 (`3ef9a32`),
ABFED-A01, BC-BC-06 (`9ab36d8`), BC-BC-12 (`f4eb57c`), BC-BC-17 (`2891c17`), DATA-51.

Defects and hardening: DATA-04, DATA-28, DATA-38, ABFED-01/03/04/06, AI-01, AI-02,
A11Y-01/02/03/05/06, REL-01, REL-02, REL-03, REL-04, CAL-01, SEC-02, SEC-03,
and the quick-win bundle REL-05, SEC-05, UX-01, AQ-03, AQ-04, DEPLOY-01 (`8042e42`).

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
