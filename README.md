# AbilityFinder 🧭

A friendly, low-clutter web app that helps people with a disability find **every
government benefit, grant, and discount they can get** — with a plain-language
guide and a **direct link to apply** for each one. No walls of text, no
click-maze.

**Current coverage:** all disabilities · **Alberta + Canada-wide federal
benefits** (the residency question is Alberta / "another province — coming soon").
The other 12 provinces/territories are researched and parked in
`data-provinces-later.js`, ready to switch back on once Alberta is perfected.

## Run it locally

Plain HTML/CSS/JS — no build step, no dependencies. Use the included no-cache
server so the browser always gets the latest files:

```bash
cd benefit-finder
python3 serve.py
# then open http://localhost:8731
```

(`serve.py` sends `Cache-Control: no-store`, which avoids stale/blank pages
during development. `python3 -m http.server 8731` also works but can serve
cached files — hard-refresh with Cmd/Ctrl+Shift+R if you see something old.)

### Provinces & cities
The residency question picks a province (AB/BC/ON/QC, or "other"). Federal
benefits apply everywhere; provincial programs are gated by `ab`/`bc`/`on`/`qc`
requirements in `REQS`. The city dropdown swaps to that province's list
(`CITIES_BY_PROVINCE` in `data.js`) — Alberta > 5,000 pop; BC/ON/QC > 10,000.
Province-specific links (student aid, 2-1-1) are functions of `answers.province`
resolved by `resolveUrl()`.

## What it does

1. **Landing page** — introduces the idea and why searching "what benefits can I
   get?" doesn't work, then invites the user to start.
2. **A ~1-minute questionnaire** — disability (pick any of 12 categories), age,
   Alberta residency, Disability Tax Credit status, work/school situation,
   income, city. Big buttons, one question per screen.
3. **A personal results list** grouped into **Ready to apply**, **One step away**
   (usually just needing the DTC — the "master key"), and a collapsed **Not a
   match** list that explains *why*.
4. **An in-app guide for every benefit** — what it is, how to apply (numbered
   steps), what you'll need, tips to skip the government-website runaround,
   processing time, and a phone number. The official application link opens in a
   **new tab** so the user never loses their place.

### Accessibility toolbar
A floating ♿ button (bottom-right, on every page) opens a panel with:
**Read this page aloud** (text-to-speech via the Web Speech API), **text size**
(A−/A/A+), **readable spacing** (dyslexia-friendly font + spacing), **high
contrast**, **highlight links**, a **reading guide** ruler that follows the
cursor, and **reduce motion**. Preferences are saved to their own `localStorage`
key so they survive reloads and are *not* wiped by "Start over".

### Edit answers after results
The results page shows your answers as chips ("tap any to change"). Clicking one
jumps to just that question in edit mode ("Done"/"Cancel"); changing it returns
straight to the results, recalculated — no restarting the whole flow.

### Supports & strategies (not just money)
Beyond government benefits, the results page shows a **"Supports & strategies for
you"** group — practical, non-monetary help matched to the user's disability and
situation: school accommodations, study/assistive-tech, focus, memory,
anxiety/CBT, time-management, exam strategy, and employment supports. Defined in
`SUPPORTS` (`data.js`) and targeted by `dis`/`sit`. Resource links are
province-aware (`STUDENT_AID`, `TWO_ELEVEN` counselling, `EMPLOYMENT`). Content is
generalized best-practice guidance — no personal data.

### Personalized practitioner finder
Benefits that need a medical form (`needsPractitioner: true` in `data.js`) show a
"Find help near you" block. It maps the user's disability to the right kind of
practitioner (`PRACTITIONERS` in `app.js` — e.g. vision → optometrist, hearing →
audiologist) and builds a Google Maps search using their **postal code** or the
browser's **geolocation** ("Use my location"), falling back to their city. Goal:
help people who don't yet have a practitioner actually find one, not just link to
the government form.

### Track your progress on each benefit
Each result card has a **progress tracker** — a small dropdown that moves a
benefit through the real application journey: **Not started → Saved → Getting
documents / doctor → Submitted → Waiting to hear back → Approved / Denied**
(great for ADHD executive function; "Saved" also works as a bookmark). A **"Your
progress"** strip at the top summarizes where things stand ("1 Waiting ·
1 Approved"), and cards are tinted by stage. **"Save / share my report"** opens a
clean, white-background, **PDF-ready report** (use your browser's *Save as PDF*):
your profile, your total estimated value, and every matched benefit grouped by
priority with its value, current status, how-to steps, documents, and official
links — framed to **share with a family member, caregiver, or case worker**. Your
progress is saved locally and survives reloads (older "marked as applied" data is
migrated automatically).

### Browse every benefit (no questionnaire)
From the landing page you can **"Browse all benefits"** without answering anything.
The browse view has a live **keyword search** plus **category** and **level**
(Federal / Alberta / local) filters over the whole catalog. Each result links to
its full guide; if you haven't done the questionnaire yet, the guide shows a
friendly "Check my eligibility" prompt instead of a definitive verdict.

### Group by priority or by category
The results page has a **"Priority order / By category"** toggle. *Priority order*
lists benefits in the suggested order to apply (value × ease, DTC first).
*By category* regroups them into themes — **Money & income, Health & equipment,
Getting around, Work & employment, Education, Family & daily living** — so you can
zero in on one area. Your choice is remembered.

### Real people who can help
Beyond the benefits themselves, the results page ends with a **human-help
directory** — real Alberta and national organizations that help people *get* these
benefits: fill out the DTC/AISH/CPP-D and RDSP forms (Voice of Albertans with
Disabilities, Inclusion Alberta, the Access RDSP helpline), appeal a denial (Legal
Aid Alberta, LawCentral Alberta), and find local services (Alberta 211). Each has
click-to-call and a direct link. Defined in `HELP_ORGS` (`data.js`).

### Home button = start over
Clicking the **AbilityFinder** logo clears all answers and applied progress and
returns to the landing page (accessibility preferences are kept).

### Never lose your answers
All state (answers + which page you're on) is saved to `localStorage` and wired
to the browser history. Reloading, pressing Back, or returning from an external
gov link all restore exactly where you were — no re-entering anything. External
links always open in a **new tab**, and the logo returns you to the start.

### Dynamic questions
The questionnaire adapts to the disabilities picked: e.g. choosing autism or an
intellectual/developmental disability adds a "did it begin before 18?" question
(for PDD), and a physical/mobility condition adds a walking-distance question
(for the parking placard). ADHD-only users get the shortest path.

### Feedback
The landing page has a feedback form (feature requests / bugs / missing
benefits). On submit it opens the user's email app addressed to
`FEEDBACK_EMAIL`. **Change that constant at the top of `app.js`** to your real
inbox once it's set up. (To collect feedback without an email client, swap the
`mailto:` in `wireLanding()` for a POST to a form service like Formspree.)

### Cities
`ALBERTA_CITIES` in `data.js` lists ~50 communities with population over 5,000.
Calgary and Edmonton have their own programs; every other community is routed to
the "Local transit & recreation discounts" card (Alberta 211).

## File map

| File | What it holds |
|------|---------------|
| `index.html` | Page shell, sticky nav, language switcher, accessibility toolbar |
| `styles.css` | Editorial dark/light design system (blended, no heavy boxes) |
| `icons.js` | Inline SVG icon set (`icon(name)`) — replaces all emoji |
| `i18n.js` | English + French dictionaries, `t(key)`, and step/option translation |
| `data.js` | **The data** — `DISABILITIES`, `ALBERTA_CITIES`, `BENEFITS` (amounts, links, notes, rich `detail` guides) |
| `app.js` | Router (landing/wizard/results/detail) + eligibility engine (`REQS`) + persistence/history + read-aloud |

### Look & feel — "editorial warm-black"
The interface uses a warm near-black canvas with an elegant **display serif**
(Fraunces) for headings and big numbers, a **monospace** for the small uppercase
"eyebrow" labels, and near-monochrome UI — so the green / amber / red status
colours are the *only* saturated hues, which makes your eligibility and progress
stand out. The serif is **self-hosted** (in `fonts/`), so no font server is
contacted — in keeping with the app's privacy-first design.

The layout is wide (1120px) and **left-aligned**: a two-column hero with a
floating results preview, a three-column "how it works", a wizard with a "why we
ask" rail, and results as a responsive card grid — so content fills the screen
instead of sitting in a narrow centered column.

A **day/night theme toggle** in the nav switches between the warm-black dark theme
and a warm-paper/cream light theme; the choice is saved and the initial theme is
set before first paint (inline `<head>` script) to avoid a flash. Light-mode
tokens live under `:root[data-theme="light"]` in `styles.css`.

### Language (English / Français)
The globe button in the nav flips the whole interface between English and
French (Canada's two official languages). Choice is remembered. Translations
live in `i18n.js` — the UI, landing, and questions are translated; the benefit
**catalog** (names, amounts, and step-by-step guides) is currently shown in
official English, with a note when French is active. Adding more languages =
adding another dictionary to `i18n.js`.

### Read aloud with per-sentence highlighting
The accessibility panel's "Read this page aloud" now highlights each sentence as
it's spoken and scrolls it into view, using the Web Speech API sentence-by-
sentence (which also dodges the browser's long-utterance cut-off bug).

### Icons
All emoji were replaced with a consistent inline-SVG set in `icons.js`
(`icon("money")`, etc.). No external icon fonts or images.

> Dev note: `index.html` loads CSS/JS with `?v=N` cache-busting params. Bump the
> number when you change those files so browsers fetch the new version.

## How to expand it

- **Add a benefit:** append to `BENEFITS` in `data.js`. Give it a `requires`
  array (keys from `REQS`) and a `detail` object (`about`, `steps`, `documents`,
  `tips`, `time`, `phone`).
- **Add a disability:** append to `DISABILITIES`. If a benefit is specific to it,
  add a requirement key in `REQS` (see `mobility`, `equipmentNeed`,
  `developmental` for the pattern) and reference it in the benefit's `requires`.
- **Add a province:** add province-specific benefits with a residency requirement
  key, and extend the residency/city steps in `STEPS`.

## Data sources

Every guide links to its **official government page** (`source` / `applyUrl` in
`data.js`). Amounts are 2025–2026 figures. Always confirm current rules on the
official page — this tool is a helper, not legal/medical/financial advice.

## Roadmap

- [ ] More Alberta municipalities (Red Deer, Lethbridge, etc.)
- [ ] Other provinces (BC, Ontario, …)
- [ ] Save / print my results as a checklist
- [ ] Publish to a static host (Netlify / GitHub Pages / Cloudflare Pages)
