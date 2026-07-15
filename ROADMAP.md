# AbilityFinder — Roadmap & Audit

**Strategy:** perfect everything for **Alberta + federal** first (the engine is
province-agnostic, so we prove the pattern on one dataset), then clone to the
other 12 jurisdictions.

> **App is now Alberta-only.** The other 12 provinces/territories (cities, map
> entries, and 16 benefit programs — all researched & verified) are parked in
> `data-provinces-later.js` (not loaded). Re-integration steps are documented at
> the top of that file. The residency question is now Alberta / "another
> province (coming soon)".

**The 5 questions a real user actually asks** (our north star):
1. What can I get? 2. How much money am I missing? 3. Am I eligible (and why)?
4. What should I apply for first? 5. How do I actually get it?

---

## Scorecard — how we answer the 5 questions today

*(Updated 2026-07-15. Phases 1–4 are done and live at https://abilityfinder.ca.)*

| Question | State | Gap |
|---|---|---|
| 1. What can I get? | ✅ Strong | — |
| 2. How much am I missing? | ✅ Strong | Phase 1: value model, totals, retro estimator |
| 3. Am I eligible & why? | ✅ Strong | Phase 2: badges, "why", denials, appeals |
| 4. What should I apply for first? | ✅ Strong | Phase 1: priority rank = value × ease |
| 5. How do I get it? | ✅ Strong | — |

**All five questions are answered.** The remaining risk is not a missing feature —
it is **decay**: 29 official government links and every dollar figure in
`data.js` go stale silently, and a benefits directory that is quietly wrong is
worse than no directory. That is what Phase 5 should protect. → see Phase 5.

---

## What we've already built ✅

- **Personalized eligibility checker** — wizard (province, self/child, disabilities
  [multi], onset, mobility, age, citizen/PR, DTC, work situation, income, city,
  postal). Dynamic questions per disability.
- **Results in one place**, grouped **Ready to apply / One step away / Not a match**
  (province-filtered), with plain-English reasons and "what you still need."
- **Federal + provincial + municipal** coverage (all 13 jurisdictions; Alberta has
  AISH, AADL, PDD, FSCD, DRES, health benefits, parking placard, Calgary/Edmonton
  transit+rec, + generic 2-1-1).
- **Plain-English guides** per benefit: what it is, numbered how-to-apply steps,
  document checklist, "tips to skip the runaround," processing time, phone.
- **Direct official links**, always open in a new tab.
- **Practitioner finder** — maps disability → practitioner type, searches Google
  Maps by postal code / geolocation / city.
- **Supports & strategies** (non-monetary) in collapsible category sections
  (school, work, focus, memory, wellbeing, autism, vision, hearing, mobility,
  brain injury, etc.), each with a resource link.
- **Edit answers after results** (tap-a-chip → change one → recalculated).
- **Mark as applied** + **Save / print my list**.
- **Accessibility toolbar** — read-aloud w/ per-sentence highlight, text size,
  high contrast, highlight links, reading guide, reduce motion, dyslexia spacing.
- **Light/dark theme**, **EN/FR interface** (paused), **auto-saved progress**
  (localStorage, no account, fully private), responsive/mobile.

---

## The Alberta-first roadmap

### Phase 1 — Money & Priority (highest value, client-side) ✅ COMPLETE
Directly closes gaps #2 and #4.
- [x] **Structured value model** per benefit — `BENEFIT_VALUES` in `data.js`
      (kind + annual/monthly/lifetime/retro), verified 2025–2026 figures for all
      AB + federal benefits. ✅ done
- [x] **Value estimate on every card + detail** — "EST. VALUE ≈ $1,500–$2,700 /
      year" headline + sub-line (lifetime / back-pay), via `valueParts()`. ✅ done
- [x] **Difficulty rating** (dots + Easy/Med/Hard) and **time-to-apply + wait**
      surfaced on every card & guide, via `BENEFIT_META`. ✅ done
- [x] **Priority ranking** — cards numbered #1..N by `priorityScore()` (value ×
      ease, DTC boosted); shown as a rank badge. ✅ done
- [x] **Retroactive estimator** — "how long have you had your disability?" →
      live DTC back-pay estimate (up to 10 yrs). ✅ done
- [x] **"Money on the table" total** — green money band: "Up to ~$X / year" +
      one-time back-pay + lifetime RDSP, with a stacking caveat. ✅ done

**Phase 1 is complete.** Next: Phase 2 (eligibility depth — Eligible/Maybe/No
badges, common denial reasons, appeals, FAQs, related benefits) — or start the
14-item list additions (stacking map, tax warnings, human-help directory).

### Phase 2 — Eligibility depth & trust (client-side, data) ✅ COMPLETE
Delivered via `BENEFIT_EXTRA` in `data.js` + `p2Sections()` on the guide page.
- [x] Per-benefit **Likely-eligible (🟡) vs Eligible (✅)** banner with plain
      "why" (the `confirm` field — e.g. DTC "needs a practitioner to confirm…").
      "Not eligible" stays in the province-filtered not-a-match list.
- [x] **Common reasons people get denied** (DTC, CPP-D, AISH).
- [x] **If you're denied** — appeals guidance per benefit.
- [x] **Tax / interaction warnings** ("Good to know" callout — #13 on the 14-list).
- [x] **FAQs** (expandable) per benefit.
- [x] **Related benefits / stacking map** — clickable "Works well with" chips,
      bidirectional (DTC ↔ RDSP, CDB, CWB…). Covers #3 on the 14-list.
- [x] **Trust signal** — "Info verified July 2026" + official source link.

### Phase 3 — Organize & act (client-side) ✅ COMPLETE
- [x] **Category dashboard** — results have a **"Priority order / By category"**
      toggle (`groupMode`). Category view buckets matched benefits into 6 themes
      (Money / Health / Getting around / Work / Education / Family) via
      `benefitTheme()` + `THEMES`. Choice persists. ✅ done
- [x] **Multi-stage progress tracker** (Not started → Saved → Getting documents →
      Submitted → Waiting → Approved/Denied) — per-card `<select>` (`STAGES`,
      `progress{}`), a **"Your progress"** summary strip (`trackerSummary`), and
      stage-colored card bars. "Saved" doubles as bookmark. Old binary `applied`
      data auto-migrates to `submitted`. ✅ done
- [x] **Human-help directory** — `HELP_ORGS` + `HELP_CATEGORIES` in `data.js`,
      rendered by `renderHelpDirectory()` on results: VAD, Inclusion Alberta,
      Access RDSP helpline, Legal Aid Alberta, LawCentral, Alberta 211 — grouped
      into form-help / legal-appeals / local-services, with click-to-call. ✅ done
      (was listed below as "Local resources finder".)
- [x] **Browse / search** — a new **browse view** (`renderBrowse`): keyword
      search + category-theme + level (Federal/Alberta/local) filter chips over
      all `BENEFITS`, neutral cards → guides. Entry from the landing hero
      ("Browse all benefits"). Guides opened without doing the wizard show a
      neutral "Check my eligibility" banner (`wizardDone()`). ✅ done
      *(Keyword + category + level covered; per-disability filtering is still
      better served by the wizard — a future nice-to-have would tag benefits with
      disabilities for a browse filter.)*
- [x] **Printable / shareable report** — `printResults()` now builds a full
      white-background, PDF-ready report: profile summary, total est. value,
      priority-grouped benefits with value + progress status + steps + docs +
      official links + phone, disclaimer. Framed as "share with a family member,
      caregiver, or case worker" (Save as PDF → send the file). ✅ done
      *(Chose a savable/printable file over a URL-hash link so we never put
      disability/income data in a URL — see privacy note.)*
- [x] **Doctor finder upgrade** — `practitionerFinder(b)` now names the exact
      form the practitioner must sign (T2201 / CPP-D report / AISH Part B /
      placard form via `PRACTITIONER_FORMS`), flags that not all clinics do them,
      and adds "what to ask when you call" (incl. the form-fee question). ✅ done

### Phase 4 — Smart help ✅ COMPLETE (shipped 2026-07-14/15, live)
Shipped, but **not as planned here** — read this before touching it.
- [x] **AI assistant** — bottom-left FAB + panel, opt-in behind a consent gate,
      streaming. `POST /api/ask` in `src/index.js`; same Worker, same origin, so
      no separate proxy and no CSP change was needed. ✅ done
- [x] **Not the Claude API — Workers AI** (`env.AI`,
      `@cf/meta/llama-4-scout-17b-16e-instruct`). The owner's hard rule is zero
      spend and there is no free Claude tier. On the **Workers Free plan**
      (confirmed) Workers AI has a 10k Neuron/day allocation and **no overage
      price**, so the endpoint cannot bill. ~134 questions/day. ✅ done
- [x] **Grounded in `data.js`** — `npm run gen:context` generates
      `src/benefits-context.js`; the Worker retrieves the matching benefit's
      detail per question. Ungrounded, the free model invented benefit facts
      (called AISH "Alberta Income Support for the Homeless", invented a phone
      number) *despite* prompt rules forbidding it. Prompt rules alone do not
      contain this model. **Do not widen its job without a stronger model.** ✅ done
- [x] **Privacy reconciled** — the assistant is the only thing that leaves the
      device, so the privacy page and landing badge now say so plainly. ✅ done

> Full detail + the six regression checks: **HANDOFF §9**.

### Phase 5 — Keep it true (re-scoped 2026-07-15)

The original Phase 5 (accounts, sync, email/SMS, community) assumed a paid
backend and a willingness to hold user data. **Two constraints kill most of it:**
1. **Zero spend** — owner's hard rule, and the reason Phase 4 uses Workers AI.
2. **Privacy is the product** — the site's promise is that your answers never
   leave your device. Accounts and email reminders both mean storing disability
   and income data about identifiable people. That is a breach liability and a
   broken promise, for a population that can least afford either.

So Phase 5 is re-aimed at the *real* remaining risk: **silent decay**. All five
user questions are already answered; what can still hurt someone is the answers
quietly going wrong.

**Possible now — free, no PII, no new promises:**
- [ ] **5A · Broken-link monitor** (cron Worker). 29 official links rot silently;
      a dead "Apply" link is a dead end for someone who needed it. Free-plan
      facts checked: Cron Triggers are free (5/account) and 29 links fit inside
      the **50-subrequest/invocation** cap in a single run, with room to spare.
      Report to KV, surfaced on a small owner-only page. No user data touched.
- [ ] **5B · Renewal & deadline reminders — as a calendar file.** 14-list #7,
      delivered *without* a backend: generate an `.ics` the user downloads, so
      **their own** calendar does the reminding. Zero infra, zero PII, no
      account, works offline, and survives the site being down.
- [ ] **5C · Data-freshness surfacing.** `DATA_VERIFIED` is a single date for the
      whole catalog. Make staleness visible (per-benefit `verified` date + a
      "check the official page, this is N months old" nudge past a threshold)
      rather than implying everything was checked yesterday.

**Shelved — and why (do not "just add" these):**
- ~~Accounts + cross-device sync~~ — breaks the privacy promise and creates a
  breach liability for disability/income data. If sync is ever wanted, do it as
  **export/import a file** (client-side, no server, no account).
- ~~Email / SMS alerts~~ — requires storing an address (PII); SMS costs money.
  5B delivers the same user value with neither. Revisit only if 5B proves
  insufficient.
- ~~Community reviews / success timelines~~ — needs a backend *and* ongoing
  moderation. Free-text from users invites PII and abuse, and the moderation
  burden lands on one person. High risk, low certainty of payoff.
- ~~Admin CMS~~ — `data.js` + git already is the CMS, with better version
  history than we would build.

**Far future (unchanged):** CRA / Service Canada integration, form auto-fill,
OCR, native app, browser extension.

---

## Architecture note (important) — updated 2026-07-15
The site is a **Cloudflare Worker with static assets** (not Pages). `public/` is
the only deployed directory; `src/index.js` serves `/api/ask` and passes
everything else through. A push to `main` auto-deploys in ~35s.

**Still no account, and everything except the assistant stays on the device.**
Phases 1–3 are pure client-side. Phase 4 added one server route, which is why the
privacy copy had to change. **Phase 5 as re-scoped adds no user data at all** —
the link monitor touches only our own links, and reminders are a file the browser
generates. Keep it that way: the moment we hold disability or income data about
an identifiable person, the promise on the landing page stops being true.

## Data-accuracy note
Phases 1–2 required **researching & verifying real Alberta/federal numbers**
(DTC amounts, RDSP grant/bond formula, AISH & Alberta health-benefit income
cutoffs, processing times, denial reasons). That research is the product.

**It is also a decaying asset**, and that is now the main risk (see Phase 5).
Two consequences already visible:
- The assistant is forbidden from stating any figure, and figures are *redacted*
  from its grounding, precisely so the verified `data.js` numbers stay the single
  source of truth rather than being paraphrased by a model.
- `DATA_VERIFIED` is one date for the whole catalog, which quietly claims more
  than it should → Phase 5C.

---

## Suggested immediate next step

**Phases 1–4 are complete and live.** All five user questions are answered, so
there is no headline feature missing. The next most valuable work is **5A, the
broken-link monitor** — it defends what is already built. 29 official links carry
the entire "how do I get it?" promise, they were verified once (July 2026), and
nothing tells us when one dies. A dead Apply link is a dead end for the person
who needed it most, and today we would only find out if a user told us.

Then **5B (calendar reminders)** for user-facing value, and **5C (per-benefit
verified dates)** to stop over-claiming freshness.

### Still-open smaller items
- **Per-disability browse filter** — needs benefit→disability tags in `data.js`;
  the wizard covers this today, so it is a nice-to-have.
- **More Alberta municipalities** in the catalog (currently Calgary + Edmonton +
  a generic 2-1-1 fallback).
- **Accessibility audit** (Lighthouse/axe) — deferred since before launch, and
  overdue: the audience is disabled users, so contrast/keyboard/screen-reader
  checks matter more here than almost anywhere.
- **Real feedback inbox** — `FEEDBACK_EMAIL` in `app.js` is still the
  `feedback@abilityfinder.ca` placeholder, so user feedback currently goes
  nowhere. Cheapest fix that keeps the no-PII stance: a form service, or just a
  real mailbox on the domain.
- **Re-integrate the other 12 provinces** from `data-provinces-later.js` once
  Alberta is genuinely "done" (steps at the top of that file).
- **French** — paused; `i18n.js` has the scaffolding and partial `fr` strings.
