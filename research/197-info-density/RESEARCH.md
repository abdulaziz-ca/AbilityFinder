# Benefit page information density — research & recommendation (ticket #197)

**Agent:** claude · **Date:** 2026-09-02 · **Status:** research complete, for review

> Scope note. This is the "research first" deliverable the ticket demands: what
> the evidence says, then a concrete recommendation. The page template it points
> to is in `TEMPLATE-SPEC.md`; standalone prototypes are in `prototypes/`.

---

## 1. The problem, precisely

A benefit page (CDCP is the worst case) presents an intro, a coverage-mechanics
paragraph, a "Good to know" callout, and a "What you must meet" paragraph — all
at the **same visual weight**. A user arrives with three questions:

1. **Am I eligible?**
2. **How much do I get?**
3. **How do I apply?**

Today they must read a wall of prose to extract those three facts. The content is
good; the *hierarchy* is missing. Our audience skews toward disabled users — some
with cognitive disabilities, low vision, or limited literacy — so this is an
accessibility problem, not a cosmetic one.

---

## 2. What the evidence says

Sources fetched and quoted below are marked **[verbatim]**; where a source's live
page could not be machine-fetched, its long-standing published guidance is
**[paraphrased]** with the canonical URL so a reviewer can confirm wording.

### 2.1 Progressive disclosure — Nielsen Norman Group **[verbatim]**
NN/g, *Progressive Disclosure*
(https://www.nngroup.com/articles/progressive-disclosure/):

- Core strategy: *"Initially, show users only a few of the most important
  options. Offer a larger set of specialized options upon request."*
- *"You must get the right split between initial and secondary features"* —
  include everything used **frequently** up front; defer only rarely-used detail.
- It improves *"learnability, efficiency of use, and error rate."*
- *"It must be obvious how users progress from the primary to the secondary
  disclosure levels"* — clear labelling of the control.
- **Avoid over-nesting:** designs needing 3+ disclosure levels typically fail.

**Implication for us:** an answer-first summary is the "primary" level;
eligibility rules' fine print, appeals, and FAQs are the "secondary" level. But
the *split* must be calibrated so nothing needed to decide is hidden — and never
more than one level of nesting (our FAQ `<details>` is the deepest we go).

### 2.2 Reading level — WCAG 2.1 SC 3.1.5 (Level AAA) **[verbatim]**
W3C, *Understanding SC 3.1.5 Reading Level*
(https://www.w3.org/WAI/WCAG21/Understanding/reading-level.html):

- Requirement: when text requires reading ability *"more advanced than the lower
  secondary education level"* (≈ 7–9 years of schooling), a **supplemental
  version or summary** that does not must be available.
- Sufficient techniques include *"providing a text summary"* and *"making the
  text easier to read."*

**Implication for us:** SC 3.1.5 is *conditional* — it applies when the text
requires reading ability above the lower-secondary level, and it is satisfied by
providing a supplemental version or summary that does not. So an answer-first
summary is **aligned with a recognised 3.1.5 technique** ("providing a text
summary") and is good practice regardless; it is not *automatic* conformance —
claiming conformance would require actually measuring the source text's reading
level and showing the summary is an adequate alternative. Target the
lower-secondary reading level.

### 2.3 Canada.ca Content Style Guide **[quoted and summarized]**
Canada.ca / design.canada.ca style guide (https://design.canada.ca/style-guide/).
The figures below are the guide's stated *targets/averages* — a reviewer should
confirm exact wording against the live guide before quoting any as a hard limit:

- Plain language is **mandatory** under the Directive on the Management of
  Communications; audiences must *"find what they need, understand what they
  find, use the information."*
- **Sentence length:** aim for an **average** of roughly **15–20 words** (a
  guidance target, not a per-sentence cap).
- **Lists:** aim for a **maximum of ~7 items**.
- **Paragraphs:** one main idea, ideally no more than ~3 sentences.
- **Headings:** roughly every ~200 words.
- **Inverted pyramid:** most important information first, then prioritized
  details, then supporting links.
- Numbered lists for steps/ranking; bulleted lists for standalone ideas; **tables
  for organized data.**
- *"Almost 50% of Canadians have literacy challenges."*

**Implication for us:** this is a Canadian government product; the Canada.ca guide
is our closest authoritative standard, and it directly prescribes lists+tables
over prose, the inverted pyramid, and concrete sentence/paragraph limits. These
become our enforceable targets.

### 2.4 GOV.UK content design **[paraphrased]**
GOV.UK style guide & content design manual
(https://www.gov.uk/guidance/style-guide and the GOV.UK content design manual).
GOV.UK's live guidance pages could not be machine-fetched (301/404 to their
publishing-guidance site), so the following are GOV.UK's well-established,
long-published principles, paraphrased — **a reviewer should confirm exact
wording against the live style guide before quoting**:

- **Front-load** content: put the most important information first.
- **Write for a reading age of ~9**; make content simple enough for everyone.
- Prefer short sentences (GOV.UK targets roughly **≤ 25 words**), bullets and
  headings over dense paragraphs.
- *"Do the hard work to make it simple"* — GOV.UK's design principle #4 (this
  phrase is a widely-cited GOV.UK principle; confirm before quoting verbatim).

**Implication for us:** GOV.UK reinforces Canada.ca — front-loading, plain
language, structure over prose. We treat Canada.ca's specific numbers as
authoritative and GOV.UK as corroborating direction.

---

## 3. Recommendation

### 3.1 Answer-first summary (the headline change)
Add a compact **summary card directly under the hero, above all prose**, with
three cells answering *Am I eligible? / How much? / How do I apply?* This is the
inverted pyramid (Canada.ca) and a WCAG 3.1.5 summary in one move. Details in
`TEMPLATE-SPEC.md §2`.

### 3.2 Default view vs. behind disclosure
- **Always visible (never collapsed):** eligibility (as a structured list),
  headline amount / tier table, how-to-apply steps, apply button, deadlines, one
  key callout. These are needed to *decide and act*.
- **Behind labelled `<details>` (default-closed):** full coverage mechanics,
  documents list, tips, denial reasons, appeals, FAQs. These are *supporting*.
- **Rule:** never collapse eligibility, amount, deadline, or the apply link. Per
  NN/g, defer only what's used less often; per the ticket, no critical info
  behind an unlabelled control, and nothing hover-only.

### 3.3 Reading-level & sentence targets — and CI
Adopt Canada.ca's targets as house-style *guidance* (averages/aims, not hard
per-sentence caps — benefit rules sometimes need one long precise clause):
- **Average** sentence length ~15–20 words; paragraphs one idea, ~≤ 3 sentences.
- Lists ~≤ 7 items; headings roughly every ~200 words.
- Reading level at/**below lower-secondary** (WCAG 3.1.5); aim ~grade 8.

**CI enforcement — recommend YES, but as a *warning gate*, not a hard fail.**
Add a lint step that runs a readability metric (e.g. Flesch–Kincaid grade) and a
sentence-length check over the user-facing strings in `public/data.js`, and
**warns** above threshold. Rationale: benefit rules sometimes *require* a long
legal clause (exact thresholds, statutory wording) that must not be dumbed down —
a hard fail would pressure agents to alter meaning, which AGENTS.md forbids.
A warning surfaces the density without risking factual accuracy. (Flag as a
follow-up ticket; not part of this template change.)

### 3.4 Callout taxonomy
Keep **"Good to know" (info)** and add three typed callouts, each with a **visible
text label** (never colour-only), contrast ≥ 4.5:1:
- **Watch out (warning)** — e.g. CDCP "you may still owe the difference."
- **Deadline** — time-sensitive dates.
- **Common mistake** — e.g. misreading the T4/T4A dental code.
These map real content that today hides inside prose into scannable, typed boxes.

### 3.5 Personalize with the questionnaire result
We already compute a match (`evaluate()` / `r.needs`). Once the wizard is done and
the user is a match, the eligibility list should **check off satisfied criteria
and de-emphasise them**, surfacing outstanding items as "Before you can apply."
Show, don't hide: a matched user still sees the full list, but the *unmet* items
lead. (Recommendation; prototypes show the pre-wizard state.)

### 3.6 Content-model dependency (coordinate with #196)
This template consumes **structured** content: `eligibility {mode, items}`,
optional `amountTiers[]`, `steps[]`, `callouts[]`, and a one-line `whatYouGet`.
#196 produces exactly these by converting today's list-shaped prose. **#196 is the
prerequisite for production adoption** — see that ticket's `AUDIT.md`.

---

## 4. What ships from this ticket
- This research summary (cited).
- `TEMPLATE-SPEC.md` — the concrete template.
- `prototypes/` — CDCP (dense federal), AISH (provincial), cwb-disability
  (simple), each showing Current vs Proposed side by side, plus `compare.html`.

All prototypes are **standalone mockups** in a non-deployed `research/` dir; no
production page is changed by #197. Adoption is a follow-up once #196 lands the
structured content model and this template is reviewed.

## 5. Sources
- Nielsen Norman Group — Progressive Disclosure: https://www.nngroup.com/articles/progressive-disclosure/ **[fetched, verbatim]**
- W3C — Understanding WCAG 2.1 SC 3.1.5 Reading Level: https://www.w3.org/WAI/WCAG21/Understanding/reading-level.html **[fetched, verbatim]**
- Canada.ca Content Style Guide: https://design.canada.ca/style-guide/ **[fetched; quoted + summarized — confirm hard limits against live guide]**
- GOV.UK style guide / content design manual: https://www.gov.uk/guidance/style-guide **[paraphrased — confirm exact wording before quoting]**
