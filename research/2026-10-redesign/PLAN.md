> **2026-10-17: the three drafts (Quiet Paper, Calm Green, Clear Ink) were scrapped at the owner's request.**
> Next step: the owner reviews 15 well-designed reference websites from any industry
> (`REFERENCE-SITES-15.md`) and picks which to base the redesign on. The accessibility criteria in
> `A11Y-PATTERNS.md` still apply to whatever design is chosen. The text below is kept for the record.

# AbilityFinder redesign — research summary, drafts and plan (2026-10-17)

Status: **research and drafts only. The live site has not been changed.** Implementation is its own
project, tracked as tickets on the TaskView board (see the end of this file).

## What was done

- **Reference research** (`REFERENCES.md`): 16 sites checked — public-service and benefits sites
  (GOV.UK, NHS, Citizens Advice, Government of Canada Design System, Ontario Design System, USWDS,
  GetCalFresh), disability and health organisations (Scope, Macmillan, Mencap) and modern product sites
  judged for accessibility (Linear, Stripe, Notion, Headspace, Oura). For each: what to borrow, what to
  avoid, an accessibility note.
- **Accessibility and cognitive-load research** (`A11Y-PATTERNS.md`): WCAG 2.2, W3C COGA, GOV.UK and
  NHS guidance, Nielsen Norman Group. Seven areas with sources and evidence strength, ending in **30
  testable acceptance criteria** the new design must meet.
- **Three visual drafts** (`drafts/`, open `drafts/index.html`), each showing the same four screens —
  home, one question, results, a program guide — so the directions compare like for like. Screenshots
  at desktop and phone width are in `screens/`. All three reflow at 390 px with no horizontal scroll.

## The three directions

| | Quiet Paper | Calm Green | Clear Ink |
|---|---|---|---|
| Feel | Public-service clarity, warm printed page | Gentle, reassuring, rounded | Modern product polish |
| Type | Atkinson Hyperlegible Next (built for low vision) | Fraunces headings + Figtree body | Inter |
| Colour | Teal `#0B5C75` on warm paper `#FAF8F4` | Green `#1F6B55`, clay accent, on `#F6F4EE` | Indigo `#3B2F8F` on white |
| Body contrast | AAA | AAA body, AA primary | AAA throughout |
| Home idea | "Before you start" panel + trust cues | "Start from where you are" situation tiles | Number tiles (programs, provinces, no accounts) |
| Inspired by | GOV.UK, NHS, Citizens Advice, GetCalFresh | GetCalFresh, Macmillan, Headspace | Linear, Stripe, Scope, USWDS |
| Risk | Can feel plain | Serif headings need care at small sizes | Can feel "techy" to older users |

Shared by all three (these come from the research, not taste): 18–19 px body text, 48 px targets, a thick
visible focus ring, one question per page with a Back link and an "I'm not sure" path, status shown with
text + icon (never colour alone), short line first with official wording behind an expander, no carousels
or decorative motion.

## Recommendation

**Calm Green for the home page and results, with Quiet Paper's discipline in the questionnaire and
guides** — i.e. one system: Calm Green's palette and warmth, Atkinson-level legibility in long text, and
GOV.UK-style question pages. Reasons: our users are often tired, anxious or in pain, and the research
points to warmth through language and layout rather than decoration; Clear Ink is the most "modern" but
the furthest from what older and low-vision users find calm. This is a recommendation for you to choose;
any of the three can be built.

"Reverse engineering" a reference is not needed: the drafts already capture the useful patterns, and the
government design systems (GOV.UK, GCDS, Ontario) are open-source if we want their exact components.

## Plan (tickets)

1. **Choose a direction** (owner) — look at the three drafts; pick one or a mix.
2. **Design tokens** — one CSS variable set (colour, type scale, spacing, radius, focus) for light, dark and
   high-contrast; contrast checked by a script in CI.
3. **Typography and base styles** — new fonts (self-hosted, no third-party requests, to keep the CSP),
   18–19 px body, line length, link styles.
4. **Home page** — new hero and situation entry points.
5. **Questionnaire** — one question per page, Back link, "Not sure", "Question 3" label, check-answers page.
6. **Results** — card, badge and checklist components; keep the three groups and the "You already get" group.
7. **Program guides** — app and static guide templates together (they share one design).
8. **Accessibility verification** — the 30 acceptance criteria as automated tests where possible, plus a
   manual screen-reader and keyboard pass.
9. **Rollout** — behind a flag first, compare, then switch; no content or matching changes in the same
   release.
