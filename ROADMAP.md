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

| Question | State | Gap |
|---|---|---|
| 1. What can I get? | ✅ Strong | — |
| 2. How much am I missing? | 🟡 Partial | amounts shown, but no $ estimate / totals / retroactive |
| 3. Am I eligible & why? | ✅ Mostly | add per-benefit Eligible/Maybe/No badge + deeper "why" |
| 4. What should I apply for first? | ❌ Missing | no priority / difficulty / value ranking |
| 5. How do I get it? | ✅ Strong | — |

**Biggest gaps vs. the vision: #2 (money value) and #4 (priority).** → Phase 1.

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

### Phase 1 — Money & Priority (highest value, client-side) 🎯 in progress
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

### Phase 4 — Smart help (needs an API — first server piece)
- [ ] **AI assistant** (Claude API): "What can I get with autism + part-time
      work?", "Explain this government wording," eligibility Q&A.
  - ⚠️ Requires a tiny serverless proxy to hold the API key (can't ship keys to
    the browser). First break from the pure-static model.

### Phase 5 — Accounts, live data & community (needs a backend)
- [ ] Optional **accounts** + cross-device sync (keep anonymous/no-login default —
      privacy is a selling point).
- [ ] **Renewal reminders**, email/SMS alerts, **benefit-change alerts** (e.g.,
      "2027 budget: DTC +4%").
- [ ] **Community**: anonymous reviews, success timelines ("my DTC took 9 weeks").
- [ ] **Admin CMS**, broken-link monitor, version history, amount/threshold
      update workflow.
- [ ] **Far future**: CRA / Service Canada integration, form auto-fill, OCR,
      native app, browser extension.

---

## Architecture note (important)
Today the site is **100% static, client-side, no account, fully private** — a
genuine advantage. Everything through **Phase 3 stays that way.** Phase 4 needs a
small serverless function (API key). Phase 5 needs a real backend + database.
Decision to make later: keep anonymous-by-default and make accounts *optional*.

## Data-accuracy note
Phases 1–2 require **researching & verifying real Alberta/federal numbers**
(DTC amounts, RDSP grant/bond formula, AISH & Alberta health-benefit income
cutoffs, processing times, denial reasons). Each benefit gets a small structured
data upgrade. This is the real work — and where the value is.

---

## Suggested immediate next step
**Phases 1–3 are complete.** The next frontier is **Phase 4 — the AI assistant**,
which is the first feature needing a server piece (a tiny serverless proxy to hold
the Anthropic API key). Before that, two client-side polish options worth
considering: (a) tag each benefit with the disabilities it's most relevant to so
the browse view can filter by disability; (b) broaden the catalog with more
Alberta municipalities. Otherwise, begin scaffolding the Phase 4 proxy.
