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
it is **decay**: 43 official government and support links and every dollar figure in
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

### Phase 5 — Keep it true (re-scoped 2026-07-15) — 5A/5B/5C ✅ ALL DONE

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
- [x] **5A · Broken-link monitor** ✅ **DONE & LIVE (2026-07-15).** A bounded,
      rotating batch runs every three hours → `runLinkCheck()` in
      `src/link-check.js` → report in KV → **`GET /api/link-health`** (public
      JSON, noindex; it holds no user data, only the health of links we already
      publish). Link list is generated into `src/links.js` by
      `npm run gen:context`. A run checks at most 10 links × 4 manual GET hops =
      40 external subrequests, below the Free-plan 50 cap even with redirects;
      the KV report retains last-known results and shows sweep coverage. This
      means coverage grows with the catalog rather than breaking at 50.

      **It reports three states, not two** — `broken` (server answered badly),
      `unreachable` (no answer at all — *not* claimed dead), `redirected` (fine
      today, but this is how a link quietly goes wrong). That distinction is
      load-bearing: the first run called `www.edmonton.ca/ets/fare-assistance`
      broken, but it returns 200 to curl and to a browser and simply refuses
      Cloudflare Workers fetch, every time. Shipping that would have put a
      permanent false alarm in every report, and a report that cries wolf
      is a report nobody reads. **Only `broken` logs an error.**

      ⚠️ **Open finding from run 1 — needs a decision, not yet fixed:**
      `inclusionalberta.org/individuals-families/rdsp/` returns 200 but redirects
      to `/event/rdsp-dtc-info-session-virtual/`. The RDSP resource page is gone,
      so anyone clicking "Inclusion Alberta — RDSP help" lands on an unrelated
      event. Pick a replacement URL (the Access RDSP / Plan Institute entry may
      already cover this need) rather than guessing one.
- [x] **5B · Renewal & deadline reminders — as a calendar file** ✅ **DONE & LIVE.**
      14-list #7, with no backend: `buildReminderIcs()` in `app.js` builds an
      `.ics` the visitor downloads, so **their own** calendar does the
      reminding — no account, no stored address, offline, and it outlives the
      site. Button lives in the progress strip (`trackerSummary`).
      Events: a follow-up for every benefit marked *submitted*/*waiting*, dated
      from that benefit's own published wait, plus a yearly "re-check" (amounts
      change most years).
      **It refuses to invent a date:** `waitToDays()` only converts real
      durations ("8–20 weeks" → 140d, "~4 months" → 124d). "at tax time",
      "next CCB payment", "same day to open" return `null` and get no event.
      RFC 5545 details that bit: fold at **75 octets, not characters** — our own
      en-dashes ("8–20") are 3 bytes each, so a 75-char line was 79 bytes.
- [x] **5C · Data-freshness surfacing** ✅ **DONE & LIVE.** `DATA_VERIFIED` ("July
      2026") is human-readable and cannot age — in two years it still says
      "verified". Added `DATA_VERIFIED_ISO` (comparable), `BENEFIT_VERIFIED`
      (per-benefit `"id": "YYYY-MM"` overrides) and `verifiedFor()`.
      Guides show that benefit's own date, and past `STALE_MONTHS` (9) a warn
      callout tells the reader to confirm the number on the official page.
      **Seeded empty on purpose** — anything without an override falls back to
      the catalog-wide date, which is the truth. Add an entry only when you have
      actually re-checked that benefit; a fake date defeats the whole feature.

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

## Accessibility — audited 2026-07-15 ✅

Run with **axe-core 4.12.1** (WCAG 2.0/2.1 A + AA) over **8 views × 2 themes**,
plus the in-app high-contrast mode: landing, wizard, results (with every tracker
stage incl. *denied*), guide, browse, privacy, the a11y panel and the assistant.
**Result: 0 violations everywhere.** It was not clean when it started.

### How to re-run it (the tooling is not committed, on purpose)
The strict CSP (`script-src 'self'`) blocks CDN tooling — so serve axe from our
own origin, which satisfies it:
```sh
curl -sL -o public/axe.min.js https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js  # gitignored
npx wrangler dev
# in the page console:
#   await new Promise(r=>{const s=document.createElement('script');s.src='/axe.min.js';s.onload=r;document.head.appendChild(s)});
#   (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}})).violations
rm public/axe.min.js   # NEVER ship it
```
⚠️ **Load the page fresh for each theme** (set `localStorage.abilityfinder.theme`
then reload). Flipping `data-theme` in-page and re-running gave *wildly* wrong
counts — 47 phantom violations on a view that is actually clean. Don't trust a
run that didn't start from a reload.

### What it found — all fixed
1. **Placeholders were never styled**, so every input inherited the browser's
   default `#757575`: **3.58:1** on the feedback form, **3.94:1** in the
   assistant. Both under the AA minimum of 4.5:1. Now `::placeholder` uses
   `--text-dim` (the only dim token that clears AA in *both* themes) with
   `opacity: 1` — Firefox dims placeholders by default and would have eaten the
   fix.
2. **`--text-dimmer` was unreadable in light theme** — `#938a7d` = **3.05:1**,
   hitting `.opt-tag`, `.disclaimer`, `#fb-status`. The light theme inverted the
   backgrounds without re-checking this token. Now `#6b6256`.
3. **The light theme's semantic colours all failed** — and one of them mattered
   more than the rest: `--ok` is the colour of **`.amount`, every dollar figure
   on the site**, sitting at **3.57:1**. `--warn` was 3.24:1 and a hardcoded
   `#e0605e` "denied" red was 3.14:1 — a rejected applicant read their status in
   failing-contrast text. Now `--ok: #106843`, `--warn: #855511`, and the red is
   tokenised as **`--danger`** (dark `#e0605e`, light `#b53a38`), which also
   caught 5 other hardcoded uses axe never reached.

**Two lessons worth keeping:**
- Check a colour against **every background it lands on, including its own soft
  tint**. `--ok` at `#15764f` passed on `--bg` (5.04) but failed at **4.41** on
  `--ok-soft` composited over `--bg` — the exact place `.amount` sits.
- **axe cannot check contrast over the gradient hero** (`body::before`) — it
  reports `incomplete`, ~15–30 nodes per view, not `pass`. Those are unverified,
  not verified. Anything placed on the gradient still needs a human eye.

### Not covered by this audit
Automated rules catch roughly a third of WCAG. Still unverified: real
screen-reader passes (VoiceOver/NVDA), keyboard-only journeys end to end,
zoom/reflow at 200–400%, and whether the plain-language copy actually lands for
people with cognitive disabilities. Those need humans — ideally disabled testers.

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

**Phases 1–5 are complete and live, and the accessibility audit is done.**
There is no headline feature missing and no known WCAG AA violation.

The highest-value work left is **not code**:
1. **Feed the monitor's findings back into the data.** 5A already found real rot
   (Inclusion Alberta's RDSP page) within a minute of existing. The monitor
   updates `/api/link-health` every three hours and records whether the current
   sweep is complete.
2. **Get a real disabled person to use it.** The audit clears the automated
   third of WCAG; the other two thirds (screen readers, keyboard-only, 400%
   zoom, whether the plain-language copy actually lands) need humans. This is
   now the single biggest unknown in the project.
3. **Do not guess AISH/ADAP signers.** CPP-D and the parking placard now have
   official signer lists in `BENEFIT_SIGNERS`; Alberta's public AISH/ADAP
   material still does not publish an exhaustive list, so it correctly remains
   absent. Re-check before changing that safety boundary.

### Still-open smaller items
- **Per-disability browse filter** — needs benefit→disability tags in `data.js`;
  the wizard covers this today, so it is a nice-to-have.
- ~~**More Alberta municipalities**~~ ✅ **DONE 2026-07-15.** Now 8 cities, each
  researched against its own official page: Calgary, Edmonton, **Red Deer,
  Lethbridge, Medicine Hat, Grande Prairie, St. Albert, Sherwood Park**.
  Now **17 municipal guides across 18 communities** (follow-up added the Spruce
  Grove area, Leduc, Cochrane, Okotoks, Canmore, Lloydminster and Fort
  Saskatchewan; Spruce Grove's guide also covers Stony Plain).
  The monitor now uses safe rotating batches, so more municipal links increase
  the time for a full sweep rather than breaking the Free-plan cap. It checks
  every current link and reports the sweep's coverage at `/api/link-health`.
  Everywhere else still falls through to the 2-1-1 finder via `REQS.cityOther`,
  which now reads `CITIES_WITH_PROGRAMS` — **add a city there when you add its
  program**, or its residents keep getting the generic fallback.

  They are NOT the same program with different logos, and assuming so would have
  hurt people:
  - **Grande Prairie explicitly excludes AISH** from its low-income transit
    subsidy and gives AISH recipients a *better* separate pass — **$10.25/mo vs
    $74.25** regular (the 50% subsidy would have been $37.13). Pattern-matching
    from Calgary would have cost someone ~$27/month.
  - **St. Albert** gives AISH/ADAP **free** local transit, free Handibus, and a
    **free annual rec membership** — not a discount.
  - **Lethbridge** is the only one that subsidises **paratransit** (Access-A-Ride).
  - **Red Deer** auto-qualifies you on AISH with no income test.

  Every figure came off the city's own page (2026-07-15) and each entry carries
  its `source`. If you add one: verify it the same way. Inventing a municipal
  program sends a disabled person chasing a benefit that never existed.
- ~~**Accessibility audit**~~ ✅ **DONE 2026-07-15 — see "Accessibility" below.**
- **Real feedback inbox — HALF DONE, blocked on one owner action.**
  `FEEDBACK_EMAIL` in `app.js` is `feedback@abilityfinder.ca`, which **has never
  existed**: Email Routing on the zone reads `unconfigured` with 0 destinations,
  so every feedback click since launch has mailed a black hole. This also means
  the only channel a user has to report a dead link or a wrong amount is
  disconnected — it directly feeds the decay problem Phase 5 exists to fix.

  Done: `abeehaconstruction@gmail.com` added as a destination address (a
  Cloudflare verification email was sent to it).

  **Remaining (owner):** enabling Email Routing writes **MX + SPF records** to
  `abilityfinder.ca`. That is a DNS change on a live domain and needs explicit
  authorization; the OAuth token also cannot read DNS (`zone (read)` only), so
  it cannot be pre-checked for conflicts from here. Do it in the dashboard
  (Email → Email Routing → enable), then add the rule
  `feedback@abilityfinder.ca → abeehaconstruction@gmail.com`. Email Routing is
  free and unlimited inbound on the Workers Free plan.

  > Bonus once this exists: sending **to a verified destination address is free
  > on any plan** (arbitrary recipients need Workers Paid), so the 5A monitor
  > could then email the owner when a link actually breaks — instead of relying
  > on someone remembering to open `/api/link-health`.
- **Re-integrate the other 12 provinces** from `data-provinces-later.js` once
  Alberta is genuinely "done" (steps at the top of that file).
- **French** — paused; `i18n.js` has the scaffolding and partial `fr` strings.
