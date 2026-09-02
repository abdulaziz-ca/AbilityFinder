# Benefit page template — proposed spec (ticket #197)

Status: PROPOSAL for review. Standalone prototypes implement this against 3 real
benefit pages. No production file is changed by this ticket.

This spec turns the current single-weight benefit page into a **three-tier,
answer-first** page: a scannable summary anyone can read in ~5 seconds, the
working detail in the default view, and the fine print behind labelled
disclosure. It is grounded in the research in `RESEARCH.md`.

## Design principles (traceable to RESEARCH.md)

1. **Answer-first / inverted pyramid.** The three questions a benefit user
   actually arrives with — *Am I eligible? How much? How do I apply?* — are
   answered at the very top, above the fold, before any explanatory prose.
2. **Progressive disclosure, never for critical facts.** Default view carries
   everything needed to decide and act. Only *supporting* detail (full rules,
   fine print, FAQs, appeals) sits behind expand/collapse. Eligibility, amount,
   deadlines and the apply link are NEVER collapsed.
3. **Degrade gracefully.** Collapsed sections use native `<details>`, which stays
   fully keyboard-operable with **no JS** (an unopened `<details>` is closed by
   default — disabling JS/CSS does *not* auto-open it). Disclosure is an
   enhancement, not a JS gate. If any *critical* content would otherwise sit
   inside a collapsed block, give that block the `open` attribute (or keep the
   content in the always-visible default view) so it is visible without scripting.
4. **Structure over prose.** Multi-part eligibility → a list with an explicit
   "you must meet ALL / ANY of these" lead-in. Amount tiers → a table. Steps →
   an ordered list. (This is exactly what #196 produces as structured content.)
5. **Cognitive-accessibility first.** Short sentences, one idea per paragraph,
   plain words. No hover-only affordances. Every control is keyboard-operable and
   labelled.

## Page structure (top to bottom)

### 1. Hero (unchanged in spirit)
- Level + category tags, benefit name (`h1`), one-line lede (`b.summary`).

### 2. Answer-first summary card — NEW, the core of this ticket
A compact card, directly under the hero, above all prose. Three cells:

| Cell | Content source | Notes |
|---|---|---|
| **Am I eligible?** | eligibility status + a one-line "who it's for" | Before the wizard is done: "Check my eligibility →" CTA. After: the matched status (ready / almost / confirm). Mirrors existing `sideStatus` logic. |
| **How much?** | `b.amount` (the headline value only) | Tiered amounts show the headline figure + a "see full breakdown" link to the table below. Never bury the number. |
| **How do I apply?** | primary apply button (`b.applyText` → `b.applyUrl`) + `d.time` (processing time) | The single most important action, repeated in the sticky sidebar. |

- Must fit three cells side-by-side on desktop, stack on mobile.
- **FR safety:** cells are min-height auto, text wraps; no fixed heights, no
  truncation. Test with ~+20% longer French strings.
- Contrast ≥ 4.5:1 on the card tint.

### 3. Default (always-visible) body — the "working" view
In priority order:
- **Eligibility, as a structured list** (from #196): lead-in sentence stating
  ALL vs ANY, then `<ul>`/checklist. This replaces the `requiresNote` prose wall.
- **What you get** (`valueSection`) — headline value; **tiered amounts render as
  a `<table>`** with column headers (e.g. Family income / Plan covers / You pay).
- **How to apply** — ordered list of `d.steps` (already a list today; keep).
- **One "Good to know" callout** if `b.note` / `taxNote` is genuinely important.

### 4. Disclosed (collapsed) detail — `<details>` blocks, labelled
Default-closed `<details>` with clear `<summary>` labels:
- **Full coverage rules / mechanics** (the long `detail.about` mechanics prose).
- **Documents you'll need** (`d.documents`).
- **Tips** (`d.tips`).
- **Common reasons people get denied** (`x.denials`).
- **If you're denied** (`x.appeal`).
- **Questions people ask** (`x.faqs` — already `<details>`; keep nested pattern).
Rationale per NN/g: primary/secondary split; keep frequent info up, defer the
rest. Never more than one level of nesting beyond the FAQ pattern.

### 5. Callout taxonomy — NEW, small extension of "Good to know"
Keep the existing "Good to know" (info) callout and add three typed variants,
each a coloured box with an icon and a visible text label (not colour-only):
- **`info` — "Good to know"** (existing).
- **`warning` — "Watch out"** — e.g. CDCP "you may still owe the difference".
- **`deadline` — "Deadline"** — time-sensitive dates.
- **`mistake` — "Common mistake"** — e.g. misreading the T4 dental code.
Contrast ≥ 4.5:1 on every tint; the label carries the meaning for
colour-blind / screen-reader users (never rely on the tint alone).

### 6. Sticky sidebar (keep current)
`side-card`: status pill, next step, apply button(s), at-a-glance facts (`dl`),
verified date. This already embodies answer-first; keep it and make the top
summary card consistent with it.

### 7. Personalization hook (recommendation, not built in prototypes)
Once the wizard is done and the user is a match, the eligibility list can visually
check off criteria the user already satisfies and de-emphasise them, surfacing
only outstanding items ("Before you can apply"). The current `r.needs` already
computes unmet items — the template should consume that. Prototypes show the
pre-wizard state; RESEARCH.md covers the personalized state as a recommendation.

## Content-model changes this template needs (flag for #196)

The prototypes prove the template, but production adoption needs these fields on
each benefit record in `public/data.js` (today they're implicit or prose):
- `whatYouGet` — one-line plain summary value (some exists as `b.amount`; needs a
  guaranteed short form distinct from the tiered detail).
- `eligibility` — **structured**: `{ mode: "all" | "any", items: [string] }`
  instead of `requiresNote` prose. (#196's core deliverable.)
- `amountTiers` — optional `[{ band, covers, youPay }]` for table rendering.
- `steps` — already structured (`detail.steps`). Keep.
- `callouts` — optional `[{ type: "info"|"warning"|"deadline"|"mistake", text }]`.

None of these are invented facts; they are re-shapings of existing verbatim
content. Amounts, thresholds, dates and codes are copied character-for-character.

## Prototype build instructions (for the worker)

Build 3 standalone `.html` files under `prototypes/` — self-contained (inline
`<style>`, no external fetch, no build step), each showing the SAME real benefit
rendered TWO ways side by side: **"Current"** (a faithful reproduction of today's
dense layout) vs **"Proposed"** (this template). Plus a `compare.html` index that
links the three.

- Pull the real content **verbatim** from `public/data.js` for these ids:
  `canadian-dental-care-plan` (dense federal), `aish` (provincial), `cwb-disability` (simple).
  Read the record's `name`, `summary`, `amount`, `note`, `requiresNote`,
  `detail.about/steps/documents/tips`, `applyText`, `source`. Do not alter any
  number, threshold, date, or the T4 dental-code wording.
- Implement the CDCP eligibility as an ALL-of list (its 4 requirements) and the
  income tiers as a 3-row table (Family income / Plan covers / You pay), taken
  verbatim from the record.
- Collapsed detail uses native `<details>`, which stays keyboard-operable with
  JavaScript disabled (it does not auto-open — it simply remains a working
  native disclosure). Keep every *critical* fact in the always-visible view, not
  inside a closed `<details>`.
- Light + dark via `prefers-color-scheme`; both must clear 4.5:1 contrast.
- Add a visible FR stress-test note on the summary card (a commented or toggled
  longer French string) to show it doesn't break — or simply size cells to wrap.
- Keep it dependency-free and small. This is a design artifact for review, not
  production code.
