# AbilityFinder — Handoff Document

> Read this first in a fresh chat. It's the single source of truth for the
> project's state, architecture, conventions, and what's next. Pair it with
> **ROADMAP.md** (feature audit + phases) and **README.md** (user-facing docs).

---

## 1. What this is

**AbilityFinder** is a web app that helps people with disabilities in Canada find
**every government benefit + support they qualify for**, with plain-language
guides and direct links to apply — solving the real problem that benefits are
scattered across dozens of confusing federal/provincial/municipal sites written
in legal language.

The guiding principle (from the product vision): answer the 5 questions a real
user asks — **What can I get? · How much money? · Am I eligible & why? · What do I
apply for first? · How do I actually get it?**

**Owner:** azizkhan123454321@gmail.com. Location context: Alberta, Canada.
The owner has ADHD and shared a real psychologist's accommodation report, which
we generalized (privately) into the "supports & strategies" content.

---

## 2. Current scope & big decisions

- **Alberta + federal only, right now.** We deliberately narrowed to Alberta to
  perfect the feature set on one dataset before cloning to other provinces. The
  other 12 provinces/territories (16 verified benefit programs + city lists +
  map entries) are **parked in `data-provinces-later.js`** (NOT loaded). The
  residency question is now just **Alberta / "another province (coming soon)."**
- **100% static, client-side, no accounts, fully private.** All state lives in
  `localStorage`. This is a genuine selling point and holds through Phase 3.
  Phase 4 (AI assistant) is the first thing needing a serverless function (to
  hold an API key). Phase 5 (accounts, reminders, community) needs a real backend.
- **French is PAUSED.** The i18n framework + a French UI translation exist, but
  we're not maintaining/expanding French for now. `t()` falls back to English.
- **All dollar figures are estimates, clearly labelled "Est. value."** All links
  were researched and verified (most recently July 2026); each guide links its
  official source.

---

## 3. How to run it

```bash
cd "/Users/abdulaziz/Claude Random Apps/benefit-finder"
python3 serve.py        # serves http://localhost:8731 with NO-CACHE headers
```

`serve.py` sends `Cache-Control: no-store` so the browser always gets fresh
files. (Plain `python3 -m http.server 8731` also works but caches — hard-refresh
with Cmd/Ctrl+Shift+R if you see stale content.)

The **site** still has no build step — plain HTML/CSS/vanilla JS in `public/`.
The **Worker** (`src/index.js`, Phase 4) does use npm + wrangler to bundle. The
site half is unchanged; you can still edit `public/*.js` and reload.

### Directory layout (changed 2026-07-14)

```
public/          <- the ONLY deployed directory (site files)
src/index.js     <- Worker: /api/ask, else pass through to public/
wrangler.jsonc   <- deploy config      package.json <- npm deps
*.md, serve.py   <- docs + dev server; at root so they are NEVER served
```

Docs used to sit beside `index.html` and were **publicly readable** on the live
site. Keep them out of `public/`.

---

## 4. File map

Paths below are relative to `public/` unless stated otherwise.

| File | Role |
|---|---|
| `../src/index.js` | **Phase 4 Worker.** Serves `POST /api/ask` (streaming SSE, backed by **Workers AI** — no paid API, no key); every other path falls through to `env.ASSETS` → `public/`. Holds the assistant's system prompt, input validation, and per-IP rate limiting. |
| `../wrangler.jsonc` | Deploy config: worker name, `assets.directory = ./public`, `AI` binding, `ASK_LIMIT` rate-limit binding. **No secrets.** |
| `index.html` | Shell: sticky nav (logo→home, theme toggle, language switch), progress bar, `#app`, reading-guide element, accessibility toolbar (FAB + panel). Inline `<head>` script sets theme before paint. Preloads the self-hosted serif; loads `icons.js`, `i18n.js`, `data.js`, `app.js` at `?v=5` (bump on CSS/JS changes). |
| `styles.css` | Whole design system — see §12. Dark default; light via `:root[data-theme="light"]`. Editorial, borderless, left-aligned, wide (1120px) layout. |
| `fonts/*.woff2` | Self-hosted **Fraunces** (display serif) + **Inter** (body), both OFL. `@font-face` at the top of `styles.css`. **No font CDN** → nothing leaks to a third party. |
| `theme-init.js` | Tiny pre-paint theme setter (external, not inline, so a strict CSP with `script-src 'self'` works). |
| `_headers` `404.html` `robots.txt` `sitemap.xml` `favicon.svg` `apple-touch-icon.png` `og-image.jpg` | **Launch assets** — see `DEPLOY.md`. Security/CSP headers, SEO, social share image, icons. |
| `DEPLOY.md` | Cloudflare **Workers** deploy guide (not Pages) + API-key setup + pre-launch checklist. |
| `icons.js` | `ICONS` map of inline SVGs + `icon(name, cls)` helper. **No emoji anywhere** — the owner dislikes them. |
| `i18n.js` | `LANG`, `I18N` (en/fr), `t(key)` (English fallback), `STEP_I18N`, `stepText()`, `optionText()`. |
| `data.js` | **Alberta + federal data only.** See §5. |
| `data-provinces-later.js` | **PARKED, not loaded.** Other 12 jurisdictions' cities, map fragments, and `OTHER_PROVINCE_BENEFITS` (16 programs). Re-integration steps at the top of the file. |
| `app.js` | The entire app — state, wizard, eligibility engine, router (landing/wizard/results/**browse**/detail), all render functions, accessibility engine, value/priority/retro logic, Phase-2 sections, Phase-3 progress tracker + category toggle + help directory + browse/search + caregiver report. See §6. |
| `serve.py` | No-cache dev server on :8731. |
| `README.md` | User-facing feature docs. |
| `ROADMAP.md` | Feature audit vs. the vision + phased roadmap (Phase 1 & 2 = done). |
| `HANDOFF.md` | This file. |

---

## 5. Data conventions (`data.js`)

Benefit metadata is stored in **id-keyed maps**, NOT on the benefit objects — so
adding a benefit's value/difficulty/depth is just a map entry. Key structures:

- `DISABILITIES` — 12 disability categories `{value, icon, label, sub?}`.
- `ALBERTA_CITIES` — cities >5,000 pop. `CITIES_BY_PROVINCE = {AB: ALBERTA_CITIES}`.
- `COVERED_PROVINCES = ["AB"]`. `STUDENT_AID/TWO_ELEVEN/EMPLOYMENT` = AB only (+
  `FED_STUDENT_AID`, `NATIONAL_211` fallbacks for non-AB users).
- `BENEFITS` (20) — federal + Alberta + municipal + a generic `local-supports`.
  Each: `{id, name, level, category, masterKey?, needsPractitioner?, amount,
  summary, requires:[reqKeys], note, applyText, applyUrl, source, detail:{about,
  steps[], documents[], tips[], time, phone}}`. `applyUrl`/`source` may be
  **functions of `answers`** (province-specific) — resolved by `resolveUrl()`.
- `BENEFIT_VALUES[id]` (Phase 1) — `{kind, annualMin/Max, monthlyMin/Max,
  lifetimeMax, retroMax, note}`. kind ∈ cash|taxCredit|grant|services|coverage|
  access|discount. Rendered by `valueParts()`.
- `BENEFIT_META[id]` (Phase 1) — `{difficulty:1–5, effort, wait}`. Rendered by
  `metaRow()`; also feeds `priorityScore()`.
- `BENEFIT_EXTRA[id]` (Phase 2) — `{confirm, taxNote, denials[], appeal,
  faqs:[{q,a}], related:[ids]}`. Rendered by `p2Sections()`.
- `SUPPORTS` — non-monetary help items `{id, icon, cat, dis:[], sit:[], title,
  summary, tips[], link, linkText}`. `link` can be a function of `answers`.
- `SUPPORT_CATEGORIES` — ordered `{cat, icon}` for the collapsible sections.
- `HELP_ORGS` (Phase 3) — human-help directory `{id, cat, name, summary, phone,
  url, urlText, focus[]}`. `HELP_CATEGORIES` — ordered `{cat, icon, blurb}`
  buckets (form help / legal & appeals / local services). Links verified July
  2026. Rendered by `renderHelpDirectory()`.

---

## 6. App architecture (`app.js`)

- **State (module globals):** `answers` (from `BLANK()`), `view`
  (landing|wizard|results|**browse**|detail), `stepIndex`, `detailId`,
  `detailFrom` ("results"|"browse" — where a guide was opened from, drives the
  back button), `progress{}` (Phase 3 — `{benefitId: stageKey}`), `groupMode`
  ("priority"|"category"), `browseQuery`/`browseTheme`/`browseLevel` (browse
  filters), `editingReturn`, `a11y{}`, `LANG` (from i18n). Helper `wizardDone()`
  = has the user finished the questionnaire (gates eligibility banners).
  `answers` fields: forWho,
  disabilities[], ageGroup, onsetBefore18, canWalkFar, province, citizenPR, dtc,
  situation[], income, city, postal.
- **Progress tracker (Phase 3):** `STAGES[]` = saved → gathering → submitted →
  waiting → approved → denied (`STAGE` is the key→obj map). No entry = "Not
  started". `progress{}` replaced the old binary `applied{}`; `restore()`
  migrates any legacy `applied:true` → `"submitted"` and drops unknown stages.
- **localStorage keys:** `abilityfinder.v2` (answers/view/**progress**/groupMode
  — still reads a legacy `applied` for migration), `abilityfinder.a11y`,
  `abilityfinder.theme`, `abilityfinder.lang`.
- **Eligibility engine:** `REQS` (requirement key → `{met(), fixed, unmet,
  action?}`). `fixed:true` = unchangeable trait → "not a match"; `fixed:false` =
  actionable → "one step away". `evaluate(benefit)` → `{status:
  ready|almost|no, needs[], reasons[]}`. NOTE: REQS still contains all province
  codes (bc/on/qc/…) even though those benefits are parked — harmless, and ready
  for re-integration.
- **Wizard:** `STEPS[]` (single/multi/select), `skipIf`/`onPick`, dynamic steps
  (onset shows for autism/intellectual; mobilityQ for physical). `visibleSteps()`
  filters. Province step is Alberta/other.
- **Browse (`renderBrowse`/`wireBrowse`):** status-agnostic exploration of all
  `BENEFITS` — search box + theme/level filter chips (`browseFiltered`,
  `browseCard`). Filtering updates only `#browseResults`/`#browseCount`
  (`refreshBrowse`) so the search input keeps focus; "View guide" is delegated.
  Entry via the landing hero's "Browse all benefits" (`.js-browse`).
- **Report (`printResults`):** opens a white-background, PDF-ready report window
  (profile via `reportProfileLine`, total via `reportAnnualTotal`, priority
  groups, per-benefit value/status/steps/docs/links). Deliberately a
  savable/printable **file**, not a URL-hash link — never put disability/income
  data in a URL.
- **Doctor-finder (`practitionerFinder(b)`):** names the exact form to sign
  (`PRACTITIONER_FORMS`), flags that not all clinics do them, and lists "what to
  ask when you call" (incl. the fee question).
- **Router:** `render()` switches on `view`; `setState(view, opts, push)` drives
  history (pushState/replaceState) + persist + render. `popstate` restores.
  `lastRenderKey` avoids scroll-jump on same-page re-render.
- **Results (`renderResults`):** the green **money band** (`renderMoneyBand` —
  total + back-pay + lifetime + interactive **retro estimator**), a **group-by
  toggle** (Priority / Category → `renderMatchedGroups`, buckets via
  `benefitTheme`/`THEMES`), a **"Your progress"** strip (`trackerSummary`),
  editable **answer chips**, benefit cards (each with a `statusControl` progress
  `<select>` — see `STAGES`), **supports** collapsible sections, the **human-help
  directory** (`renderHelpDirectory` — `HELP_ORGS`), province-filtered
  **not-a-match**. Rank badges (1..N) come from a `rankOf` map (ready items only)
  reused in both group modes.
- **Detail (`renderDetail`):** value + `metaRow` + status banner (Eligible/Maybe
  via `BENEFIT_EXTRA.confirm`) + about + note + `p2.tax` callout + how-to-apply +
  **practitioner finder** (Maps search by postal/geolocation) + docs + tips +
  `p2.denials/appeal/faqs/related` + meta grid + apply buttons + "verified"
  footer. Related chips navigate between guides.
- **Accessibility engine:** read-aloud with **per-sentence highlight**
  (SpeechSynthesis, sentence-by-sentence), text size, high contrast, highlight
  links, reading guide (cursor ruler), reduce motion, dyslexia spacing. All
  persisted; panel in `index.html`.
- **Helpers to know:** `valueParts(b)`, `metaRow(b)`, `priorityScore(b)`,
  `renderMoneyBand()`, `p2Sections(b)`, `benefitProvince(b)`, `resolveUrl(u)`,
  `mapsSearchUrl(query, coords)`, `practitionerType()`, `DATA_VERIFIED`.

---

## 7. Testing workflow (important)

- Use the in-app **browser preview** at `http://localhost:8731`.
- **After editing JS/CSS you MUST reload the page** (navigate to the URL) to load
  new code. Driving the already-loaded page with `setState(...)` runs the OLD
  code until reload — this bites you constantly.
- To render a specific screen via console: set `answers`, then
  `lastRenderKey = null; setState('results')` (nulling the key forces a re-render
  of the same view).
- Always check console for errors after a change (there should be none).
- Verify logic with `BENEFITS.filter(b => evaluate(b).status !== 'no')` etc.

---

## 8. What's DONE

**Core:** eligibility wizard · ready/almost/not-a-match grouping (province-
filtered) · plain-English guides (steps, docs, tips, processing time, phone) ·
direct official links (new tab) · practitioner finder (Maps + postal/geo) ·
supports & strategies (collapsible per-category, disability+situation matched) ·
edit-answers-via-chips · mark-as-applied · save/print list · accessibility
toolbar · dark/light theme (animated day/night toggle) · EN/FR interface
(paused) · auto-save/history/never-lose-answers · responsive.

**Phase 1 (money & priority) — COMPLETE:** structured `BENEFIT_VALUES` + value
headline on cards/guides ("Est. value ≈ $1,500–$2,700/yr") · difficulty + apply-
time + wait (`BENEFIT_META`) · **priority ranking** (numbered #1..N,
`priorityScore`) · **money band total** + back-pay + lifetime · **interactive
retroactive back-pay estimator**.

**Phase 3 (organize & act) — COMPLETE:** ✅ **category dashboard** (Priority /
By-category toggle, persisted) · ✅ **multi-stage progress tracker** (per-card
Saved→…→Approved/Denied `<select>`, "Your progress" strip, stage-colored cards,
auto-migrates old `applied`) · ✅ **human-help directory** (`HELP_ORGS` — VAD,
Inclusion Alberta, RDSP helpline, Legal Aid AB, LawCentral, AB 211) · ✅
**browse/search** (`renderBrowse` — keyword + category + level filters; neutral
guides get a "check eligibility" banner) · ✅ **printable/shareable caregiver
report** (`printResults` — full white-bg PDF-ready report) · ✅ **doctor-finder
upgrade** (`practitionerFinder(b)` names the form + "what to ask the clinic").

**Phase 2 (eligibility depth & trust) — COMPLETE:** Likely-eligible vs Eligible
banner (honest "why") · common **denial reasons** · **appeals** guidance ·
**tax/interaction warnings** ("Good to know") · **FAQs** · **related-benefit
stacking map** (clickable, bidirectional) · **"Info verified July 2026"** trust
signal. (This also covered 14-item-list items #3, #8, #11, #13.)

---

## 9. What's NEXT (from ROADMAP.md)

**Phase 3 — Organize & act (client-side, no backend): ✅ ALL DONE** (see §8) —
category dashboard, progress tracker + bookmark, human-help directory,
browse/search, printable caregiver report, doctor-finder upgrade.

**Nice-to-haves before Phase 4 (still client-side):**
- Tag each benefit with the disabilities it's most relevant to, so the **browse
  view** can filter by disability (currently keyword + category + level only).
- More Alberta municipalities in the catalog.
- The browse view is not history-pushed specially; fine, but a shareable
  deep-link to a single guide could be nice (guide id in the URL hash — safe, no
  personal data).

**Phase 4 — AI assistant: backend DONE (2026-07-14), UI still to build.**

`POST /api/ask` lives in `src/index.js`. Streaming SSE, per-IP rate limited.

Two decisions worth not re-litigating:

1. **Workers AI, not the Anthropic API — the owner's hard rule is zero spend.**
   There is no free Claude tier. On the **Workers Free plan** Workers AI has a
   10,000 Neuron/day allocation and *no overage price*, so it physically cannot
   bill; it just errors until 00:00 UTC. Model is
   `@cf/meta/llama-4-scout-17b-16e-instruct` (~60 Neurons/question ⇒ ~150
   questions/day). **Do not move to Workers Paid without re-reading DEPLOY.md
   §1b** — Paid reintroduces billing on this endpoint.
2. **The assistant's job is deliberately narrow, because the model is weak.**
   Llama 4 Scout is much worse than a frontier model at holding "never guess"
   under pressure, and the audience is disabled people making money decisions —
   a hallucinated AISH cutoff is real harm. So the prompt forbids it from
   stating *any* dollar amount, cutoff, percentage, or eligibility verdict, and
   makes it hand off to the verified numbers already in `data.js` and to the
   official links. **If you swap in a stronger model later, that restriction can
   loosen — until then, do not widen its job.**

⚠️ **Not done: the privacy story.** The site's promise is that nothing leaves the
browser, and the privacy page says so. `/api/ask` sends the user's question to
Cloudflare. The assistant must be **opt-in** and the privacy page must say
plainly what is sent and where, before this ships.

**Phase 5 — Accounts, live data, community** (needs backend): optional accounts +
sync, renewal/benefit-change reminders (email/SMS), anonymous reviews/timelines,
admin CMS, broken-link monitor. (14-list #7 reminders, #12 accounts live here.)

**The 14-item user list** is essentially done. Browse/search (#9) now covers
keyword + category + level; only per-*symptom*/disability filtering is left (needs
benefit→disability tags). Remaining: renewal *reminders* (#7, backend), amount
*calculator* beyond the current estimator (#5, mostly done). Human-help directory
(#14) ✅ done.

---

## 10. Re-integrating the other provinces (later)

When Alberta is "done," follow the steps at the top of
`data-provinces-later.js`: restore city arrays into `CITIES_BY_PROVINCE`, extend
`COVERED_PROVINCES`, merge the `*_OTHER` map fragments, spread
`OTHER_PROVINCE_BENEFITS` into `BENEFITS`, and restore the full 13-option
residency step in `app.js` (the per-province `REQS` keys already exist). Then
give each province its own `BENEFIT_VALUES`/`BENEFIT_META`/`BENEFIT_EXTRA`
entries (the Alberta pattern).

---

## 11. Style / working preferences (owner feedback over the project)

- **No emoji** in UI — use SVG icons (`icon()`).
- Modern, "real engineer" look — blended/borderless, not boxy; content fills the
  screen left-aligned, not a narrow centered column. (Still true — the redesign
  in §12 kept functional pages left-aligned; only the *look* changed.)
- Genuinely helpful & **personalized**, not a generic government-info repeat.
- Be honest about estimates/limitations; verify links; don't overstate.
- Keep it accessible (the audience is disabled users) and low cognitive load.

---

## 12. Design system — "editorial warm-black" (redesigned July 2026)

Restyled to the aesthetic of **Giga** (giga.ai — "AI agents for enterprise
support"), which the owner picked as the reference. Giga isn't on Mobbin, so the
cues came from the live site. Tokens + type + a self-hosted font in `styles.css`,
plus markup changes for the hero and cards (below). No app *logic* changed.

- **Palette (`:root` in `styles.css`):** warm near-black canvas (`--bg #14110e`),
  warm-white text. **Near-monochrome on purpose** — `--accent` is a warm **bone**
  (light on dark; it flips to a dark ink in the light theme), so the semantic
  **status colours (green `--ok` / amber `--warn` / red) are the ONLY saturated
  hues** on the page — which makes eligibility/tracker state read louder. Light
  theme is a **warm paper/cream** editorial variant. High-contrast a11y mode still
  overrides everything.
- **Because `--accent` is now light**, anything that used it as a *background* with
  white text was flipped to `color: var(--bg)` (rank badge, a11y FAB, option tick,
  read-aloud active). Watch for this if you add accent-bg elements.
- **Type:** display **serif = Fraunces** (self-hosted `fonts/fraunces-latin.woff2`,
  variable 300–500, `@font-face` + `--font-display`), used on hero/section/results
  /detail/wizard-question headings + big numbers (weight ~350–400, `font-optical-
  sizing: auto`). Body stays **Inter** (`--font-sans`). Eyebrow/section labels are
  **monospace** (`--font-mono`, system stack), UPPERCASE, letter-spaced, with a ●
  dot (`.eyebrow`, `.section-label`, `.step-kicker`, `.group-title`).
- **Privacy note:** the serif is **self-hosted** (downloaded from Google Fonts once,
  OFL-licensed) so no third party is contacted for it — matches the app's
  privacy-first stance. ⚠️ The **Inter** `<link>` in `index.html` still hits Google
  Fonts (pre-existing); self-hosting Inter too would fully close that gap.
- Buttons are already white/ink **pills** (matches Giga). Cache-bust is `?v=7`
  (⚠️ the preview browser caches `styles.css`/`app.js` within a session despite
  the no-store header — **bump `?v=N` in `index.html` after CSS/JS edits** or the
  browser serves stale files).

### Open, full-width layout (second-pass feedback — "stop putting blocks in the middle")
Owner compared to Giga's real product pages (full-width containers, ~36px gutters,
left-aligned) and disliked the narrow centered column + boxy panels. So:
- `.wrap` is now **full-bleed**: `max-width: none; margin: 0; padding: 40px
  clamp(28px,5vw,72px) 130px`. Content runs edge-to-edge from the left, not a
  centered ~1120px column. (Intro text blocks keep local `max-width` ~1000px for
  readable measure, but start at the left edge.)
- **No more boxes.** Benefit cards are **open rows** — transparent bg, a top
  hairline separator, the status bar at the far left, content left + value/actions
  at the right edge (`.benefits-grid { flex column; gap:0 }`, `.benefits-grid
  .benefit { border-top; background:transparent }`). The **money band**, **wizard
  card**, and **aside** lost their panels too (hairline framing / a left rail
  instead). Wizard options are **outline** rows now, not filled blocks.
- Dark-theme text was too dim → brightened `--text-dim`/`--text-dimmer`; hero text
  got a scrim + brighter eyebrow/sub for legibility over the atmosphere.
- Hero bottom now animates: a warm glow drifts along the horizon
  (`.hero-atmos::after` + `@keyframes horizonDrift`) and the ridges drift
  (`ridgeDrift`) — both gated by reduced-motion. The preview card is wider/glassier
  with hover rows.

### Third-pass polish (nav align, ambient fill, animated logo) — cache `?v=9`
- **Nav** is now full-bleed like `.wrap` (`.nav-inner { max-width:none;
  padding: 0 clamp(28px,5vw,72px) }`) so the logo lines up with the content's left
  edge and the controls sit at the right edge. The `.nav` has a **persistent
  full-width** bottom hairline (was a centered/scrolled-only border before).
- **Ambient layer** fills the open right/empty space on every page: `body::before`
  is now a fixed, slowly-drifting stack of **cool + warm radial blooms** (blue /
  teal / violet / sand) behind all content (reduced-motion-gated). Per-view caps
  were widened (browse 1000→1400, supports/help 860→1180) so content uses more
  width; the ambient covers the rest.
- **Logo** redesigned in `index.html`: a bigger rounded-badge mark (`.brand-mark`,
  40px, cool-glow bg) with the compass **needle animating** (`.brand-needle` +
  `@keyframes compassSeek`, faster on hover), and a Fraunces serif wordmark.

### Fourth-pass polish — cache `?v=10` (nav-h now 72px)
- **Logo v2:** bigger 47px **app-icon badge** with a cool gradient (blue→teal→violet
  `#brandGrad`), a **spinning compass bezel** (`.brand-bezel` dashed ring +
  `bezelSpin`), a **sheen sweep** (`.brand-mark::after` + `brandSheen`), and the
  seeking needle. Wordmark is Fraunces serif, larger.
- **Ambient** made much stronger (both themes) — light theme gets its own deeper,
  more-saturated blue/teal/violet/amber blooms so it's actually visible on cream.
- **Hero wave:** a flowing two-layer SVG wave at the hero→content boundary
  (`.hero-wave .hw-a/.hw-b`, seamless `waveFlow` translateX loop, cool teal/blue).
- **Preview card** enriched into a mini product mockup: a Giga-style **value gauge**
  (`.pv-gauge` gradient meter that fills on load) + "Estimated total" headline
  (`.pv-hero`), a status dot, richer rows.
- **Benefit cards** stretched fuller (tighter `.benefit-row` gap, wider side column
  & summary measure).
- **Guide/detail page → its own two-column layout** (`renderDetail`): a full-width
  header (tags + serif title + lede), then `.detail-body` = the guide (`.detail-main`,
  readable width) + a **sticky "at a glance" sidebar** (`.detail-side`/`.side-card`)
  with value, difficulty/time/wait/processing/phone facts, the apply CTA, and the
  verified stamp — which fills the previously-wasted right space. Stacks under 960px
  (sidebar first via `order:-1`).

### Fifth pass — launch prep + polish (cache `?v=14`, nav-h back consideration)
- **Wizard page** got an animated **mountain scene** (`.wiz-mountains`, 3 parallax
  SVG ridges drifting via `wmDrift`) filling the empty space, both themes.
- **Logo v3:** cool gradient app-icon badge + spinning bezel + sheen + needle.
- **Ambient** strengthened again (both themes, light gets its own saturated blooms);
  **hero wave** + **preview value-gauge** (`.pv-gauge`) added; cards stretched.
- **Preview card** is a mini product mockup with a Giga-style gradient value gauge.
- **Privacy & disclaimer page** (`renderPrivacy` / view `"privacy"`, linked from a new
  landing `.site-footer`). Honest copy: no accounts, no tracking, localStorage only.
- **Fonts fully self-hosted** — Google Fonts `<link>` removed; Inter now in `fonts/`.
  Verified at runtime: **zero external requests**.
- **Deploy-ready:** `_headers` (strict CSP `script-src 'self'` — hence external
  `theme-init.js`), SEO/OG/Twitter tags, `favicon.svg`, `apple-touch-icon.png`,
  `og-image.jpg` (canvas-generated), `robots.txt`, `sitemap.xml`, `404.html`,
  `DEPLOY.md`. **Domain is a placeholder** (`abilityfinder.ca`) — find-and-replace
  before go-live (see DEPLOY.md §0).
- **QA done:** all 42 gov/resource links return 200 · print/PDF report OK · mobile
  /tablet responsive (no h-scroll, detail stacks) · no console errors.
- **Bug fixes:** the doctor-finder no longer shows "family doctor" twice when the
  disability has no specialist; "Find a/an <type>" article is now correct.
- **Still owner's to-do before public:** real feedback inbox (`FEEDBACK_EMAIL`),
  buy domain, accessibility (Lighthouse/axe) audit.

### Hotfix (cache `?v=15`) — detail sidebar covering content on narrow screens
The `@media (max-width:960px)` rule that set `.detail-side { position: static }`
was written **before** the base `.detail-side { position: sticky }`, so equal
specificity + later source order kept it sticky at every width → below 960px the
sticky card rode up over the guide text on scroll. Fixed by putting the base rule
first, then the media query. Also made `.side-card` **opaque** (the old
`color-mix` with a translucent `--accent-soft` left it ~46% see-through).
**Lesson:** in this single CSS file, put base rules before their media-query
overrides (there's no cascade layering). This fix is `?v=15` and is **live** —
verified 2026-07-14: abilityfinder.ca serves `?v=15`, matching the repo.

### Full-bleed atmospheric hero (added after first-pass feedback)
The owner compared v1 to the real giga.ai and wanted it *open, wide, atmospheric*
— not a tight left column on flat black. So the landing hero is now full-bleed:
- `.hero-full` breaks out of `.wrap` (`width:100vw; margin-left:calc(50% - 50vw)`),
  min-height ~90vh, content centered.
- `.hero-atmos` = a dawn gradient (dusty blue → warm peach → into `--bg`), theme-
  aware; `.hero-bloom` = a soft light "sun" that slowly drifts (`@keyframes
  heroBloom`); `.hero-ridges` = an inline **SVG mountain silhouette** (3 layered
  ridge paths w/ gradient fills) fading into the page; `.hero-fade` blends the
  bottom into `--bg`. `.hero-inner::before` is a radial scrim so the text stays
  legible over the bright middle.
- The app-preview card (`.hero-preview-wrap` / `.preview`) is a centered "peek"
  that overlaps the fade. All motion is gated by `prefers-reduced-motion` **and**
  the a11y "reduce motion" toggle. Markup lives in `renderLanding()`.

### Full-width, one-per-row cards
Owner disliked the congested 2-col grid. `.benefits-grid` is now a **flex column**
(one card per row, full content width). Each card uses `.benefit-row` = a
`main | side` grid: `.benefit-main` (title, tags, summary, meta, needs) +
`.benefit-side` (the est-value headline, right-aligned, + apply button & progress
tracker). Both `benefitCard()` and `browseCard()` emit this structure; stacks to a
single column under 760px.
