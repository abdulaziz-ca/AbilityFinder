# AbilityFinder redesign: accessibility and cognitive-load patterns

Compiled 2026-10-17. Only sources I opened are cited. Evidence labels: **Normative** (W3C/WCAG requirement), **Official guidance** (government design system, tested by their teams), **Research** (peer-reviewed or user study), **Judgement** (my synthesis, no source; flagged).

Gaps I could not close: GOV.UK typography page and Canada.ca line-length page returned 404; the BDA style guide PDF was not opened (only secondhand copies in search results, so BDA numbers are labelled secondary); no NN/g page on multi-step form progress was opened; I found no real "likely / maybe / not now" benefit-tool example I could open, so section 6 is mostly adapted from the GOV.UK pattern plus judgement.

## 1. Typography

| Recommendation | Source | Evidence |
|---|---|---|
| Body text at least 16px (1rem), in rem units so browser zoom/text-size settings work. GOV.UK's scale starts at 16px. I suggest 18px on mobile and desktop for this audience. | https://design-system.service.gov.uk/styles/font-override-classes/ | Official guidance for 16px; 18px is Judgement |
| Line height 1.5 for body. WCAG 1.4.12 requires that layout survives line height 1.5, paragraph spacing 2x, letter spacing 0.12em, word spacing 0.16em applied by the user. Test with those overrides. | https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html | Normative (AA) |
| Line length max about 80 characters (AAA 1.4.8); I suggest 60-70ch via `max-width: 65ch`. Left-align, never justify. | https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html ; https://design-system.service.gov.uk/styles/font-override-classes/ (left-align, no justify) | Normative (AAA) for 80; 65ch is Judgement |
| Paragraph spacing at least 1.5x line spacing (AAA). | visual-presentation URL above | Normative (AAA) |
| Use a plain sans-serif system or widely available face (Arial, Verdana, Calibri class). Do not ship OpenDyslexic or a "dyslexia font" as default. | https://pmc.ncbi.nlm.nih.gov/articles/PMC7188700 | Research, see below |
| Honest dyslexia evidence: Galliussi et al. 2020 (64 children with dyslexia, 64 typical readers) found the dyslexia-friendly letterform had no effect on speed or accuracy. Added letter spacing without added word spacing slowed reading slightly. Spacing effects were small (under 0.20 syllables/s). Search summaries also cite Zorzi 2012 (extra letter spacing helped) and Wery and Diliberto 2017 (no OpenDyslexic benefit), but I did not open those papers. Takeaway: spacing and layout matter more than font choice; do not claim a dyslexia benefit. | PMC7188700 above (opened); Zorzi/Wery only via search snippets | Research, mixed and small effects |
| BDA guide reportedly says 12-14pt minimum and 1.5 line spacing, sans-serif; Dyslexia Scotland says recent evidence shows no consistent sans-serif advantage. I could not open the BDA PDF. | Search results only (dyslexiascotland.org.uk/dyslexia-friendly-typed-formats); not opened | Weak (secondary) |
| Bold sparingly; avoid italics, ALL CAPS and underline except for links; sentence case headings. | https://design.canada.ca/style-guide/ | Official guidance |
| Allow long strings (emails, URLs) to wrap so nothing overflows on phones. | font-override-classes URL | Official guidance |

## 2. Colour and contrast

| Recommendation | Source | Evidence |
|---|---|---|
| Text contrast at least 4.5:1 (3:1 for 18pt / 14pt bold). Target 7:1 (AAA) for body text because the audience includes low vision and older adults. Ratios are not rounded: 4.499 fails. | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html | Normative AA; 7:1 AAA |
| UI components and focus indicators at least 3:1 against adjacent colours (1.4.11). The fetched page did not state 3:1 outright; it is implied by its examples. | contrast-minimum URL; GOV.UK focus rationale below | Normative (AA) |
| Never rely on colour alone (1.4.1). Pair status colours with text and an icon; links in body text need a non-colour cue (underline) or 3:1 contrast with surrounding text. Colour-only error/required marking is a named failure (F81). | https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html | Normative (A) |
| Focus style: thick, high-contrast, works on any background. GOV.UK uses yellow plus a thick black bottom border so it meets non-text contrast on all backgrounds. | https://design-system.service.gov.uk/get-started/focus-states/ | Official guidance |
| Dark mode: offer it, do not force it. NN/g summarises studies where light mode read better for normal vision (more so at small sizes), while some low-vision users (for example cataracts) read faster in dark mode. Recommendation: respect `prefers-color-scheme` plus a visible toggle; re-check every contrast pair in both themes; do not use pure #000/#FFF pairing if halation is a concern (that last point is Judgement). | https://www.nngroup.com/articles/dark-mode/ | Research (small samples) |
| High-contrast pitfalls: do not remove borders/focus rings that Windows forced-colours mode needs; use real borders (not only shadows or background tints) on cards, inputs and buttons; avoid background-image-only icons. | Not opened; Judgement | Judgement |

## 3. Layout and navigation

| Recommendation | Source | Evidence |
|---|---|---|
| One question per page. Make the `<legend>`/`<label>` the page `<h1>`, specific to that question; show the section via a caption. | https://design-system.service.gov.uk/patterns/question-pages/ | Official guidance (tested) |
| Always provide a Back link at the top of question pages; browser Back must return to the previous page in the state the user left it (answers preserved). | question-pages URL; https://design-system.service.gov.uk/components/back-link/ | Official guidance |
| Button label "Continue" (not "Next"), left-aligned. Hint text one short sentence. Mark optional fields "(optional)" rather than asterisks. | question-pages URL | Official guidance |
| Progress indicator: GOV.UK says only add one if research shows users need it. COGA recommends showing progress in multi-step tasks (completed, current, pending). For a variable-length questionnaire (skip logic), I suggest a text "Question 3 of about 8" or section captions, not a precise bar that jumps. | question-pages URL; https://www.w3.org/TR/coga-usable/ (4.2.4) | Official guidance + COGA; wording is Judgement |
| Check-answers page before showing results: "Change" links with hidden text naming what changes, answers pre-filled, return straight to the summary after editing. | https://design-system.service.gov.uk/patterns/check-answers/ | Official guidance |
| Do not ask the same thing twice in a flow (3.3.7 Redundant Entry). | https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html | Normative (A) |
| Reflow: no two-dimensional scrolling at 320 CSS px width (equals 400% zoom of 1280px). Data tables are an exception; cards and checklists are not. | https://www.w3.org/WAI/WCAG22/Understanding/reflow.html | Normative (AA) |
| Target size: 2.5.8 (AA) needs 24x24 CSS px or 24px spacing; 2.5.5 (AAA) needs 44x44. Use 44x44 minimum for all primary controls (radios, buttons, back link, expander toggles) given motor-impairment users. Inline links in sentences are exempt from both. | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ; https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html | Normative; 44px choice is Judgement |
| Focus not obscured (2.4.11 AA): a sticky header/footer or cookie bar must not completely hide the focused element; use `scroll-padding`. Failure F110. | https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html | Normative (AA) |
| Consistent Help (3.2.6): if you offer help/contact, keep it in the same place on every page. | https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html | Normative (A) |
| Make the whole radio/option row clickable and keep a visible label (COGA: visible labels, familiar layouts, icons paired with text). | COGA 4.2.2, 4.2.7, 4.5.4 | COGA (beyond WCAG) |

## 4. Cognitive load

| Recommendation | Source | Evidence |
|---|---|---|
| Plain language: sentences about 15-20 words, one idea each; paragraphs 3 sentences max; familiar words (two syllables or fewer where possible); active voice, positive form; no idioms or metaphors; lists of 7 items or fewer; headings roughly every 200 words. About half of Canadians face literacy challenges (their statement). | https://design.canada.ca/style-guide/ | Official guidance |
| COGA objectives to adopt: clear page purpose heading, consistent patterns, summaries, tell users what they need before starting (4.6.4), keep critical paths short (4.6.2), avoid excess content (4.6.3), state results and trade-offs of choices (4.8.3), non-numerical alternatives to numbers (4.4.13). COGA states its guidance goes beyond WCAG and is not required for conformance. | https://www.w3.org/TR/coga-usable/ | Official guidance (W3C Note) |
| "Before you start" on the landing page: list documents/information needed (for example date of birth, income range, province) so users do not abandon mid-way. | COGA 4.6.4 | Official guidance |
| Reduce choices: one question per page, 2-5 options where possible, a "Not sure" option that never blocks progress. | question-pages URL; "Not sure" is Judgement | Mixed |
| No timeouts. If any session limit exists, it must be off, adjustable to 10x, or warn 20+ seconds before expiry with simple extend. For AbilityFinder: persist answers in the tab (and offer resume) so an interrupted user loses nothing. COGA also flags data loss/timeouts. | https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html ; COGA 4.5.9 | Normative (A) |
| Errors: error summary at top with focus moved to it, "Error:" prefix in `<title>`, message beside the field saying how to fix it, keep entered values. Validate on Continue, not on blur or while typing. | https://design-system.service.gov.uk/patterns/validation/ | Official guidance |
| Error prevention for submissions that change data (WCAG 3.3.4 reversible, checked or confirmed); a check-answers step covers the "confirmed" option. AbilityFinder submits nothing legally binding, so this is mostly relevant if accounts or saved results are added. | https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html | Normative (AA) |
| If sign-in or saving is ever added: no cognitive-function tests, allow paste and password managers (3.3.8). | https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html | Normative (AA) |
| Do not move content or controls unexpectedly (COGA 4.5.1); give clear feedback after actions (4.5.10). | COGA | Official guidance |

## 5. Motion and sensory

| Recommendation | Source | Evidence |
|---|---|---|
| Honour `prefers-reduced-motion: reduce`: remove scaling/panning/parallax; replace with a gentle opacity change or nothing. MDN notes scaling and panning large objects can trigger vestibular discomfort. | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion | Official docs |
| Interaction-triggered motion must be switchable off unless essential (2.3.3, AAA); prefers-reduced-motion is the sufficient technique (C39). | https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html | Normative (AAA) |
| No auto-playing or auto-updating content; anything moving over 5 seconds beside other content needs pause/stop/hide (2.2.2). Simplest: nothing autoplays, no carousels. | https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html | Normative (A) |
| Feedback: show a visible state change on press; use a spinner only for 2-10 s waits, a percent/step indicator for longer (NN/g). Results are computed client-side so should appear instantly; avoid fake loading animations (Judgement). | https://www.nngroup.com/articles/progress-indicators/ | Research-backed guidance |
| Nothing flashes more than 3 times per second (WCAG 2.3.1; I did not open that page, standard requirement). | Not opened | Normative (A), unverified here |

## 6. Result and eligibility presentation

What I opened: the GOV.UK "Check a service is suitable" pattern (https://design-system.service.gov.uk/patterns/check-a-service-is-suitable) and the GOV.UK check-benefits service page (https://www.gov.uk/check-benefits-state-pension-payments). I did not find or open a real "likely / maybe / not now" tool, so those labels below are Judgement adapted from the pattern.

| Recommendation | Source | Evidence |
|---|---|---|
| State the outcome in a heading in plain terms, then one sentence saying it is based on their answers. | check-a-service-is-suitable | Official guidance |
| Show what matters up front where applicable: how much money, how long it takes, cost, whether they must use it. | same | Official guidance |
| For "not eligible", explain why in plain terms and say what to do instead. Do not leave a dead end. So for "not now": say what would change it (for example "if your income drops below X") and offer an alternative program. | same | Official guidance (pattern); wording Judgement |
| Use three labelled groups, each with text label plus icon plus colour: "Likely a fit", "Worth checking" (maybe), "Not a fit right now". Avoid percentages or scores that imply false precision (Judgement, in line with hedge-hardening rule). | Judgement | Judgement |
| Per program: name, one-line value, requirement checklist where each item reads as "You meet this / Check this / You may not meet this" using text and icons, not colour alone; the official wording behind an expander (matches existing AbilityFinder readability rule). | use-of-color URL for non-colour cue | Normative for non-colour; layout is Judgement |
| One clear next step per program ("How to apply") with the single most important action first. Offer a printable/saveable summary and "Change my answers" back to the check-answers page. | check-answers URL; Judgement for print | Mixed |
| The GOV.UK check-benefits page structure (heading, one "Start now" button, "Before you start", "Who cannot use this service" with contacts) is a usable template for program guides. | https://www.gov.uk/check-benefits-state-pension-payments | Official example |
| DWP reported dropping a separate start page for Carer's Allowance and moving users straight to eligibility questions, with a reported 22% increase in online applications. I only saw this in a search snippet (dwpdigital.blog.gov.uk), not the page itself. | Search snippet only | Weak |

## 7. Visual trends for 2026

None of these come from an opened source; they are Judgement filtered through the WCAG items above. I did not open any trend report.

Use:
- Generous whitespace and a single-column reading flow (supports COGA 4.6.3 and reflow).
- Soft but sufficiently dark colour: pastel backgrounds with dark text at 7:1; one saturated accent used only for primary action and focus.
- Cards for program results, with a real 1-2px border (visible in forced-colours mode), 44px+ controls and one heading per card.
- Simple flat illustration used sparingly, decorative with empty alt, never carrying information; icons always with text.
- Rounded corners and large type (supports 400% zoom).
- Light default with a dark option (see NN/g above).

Avoid:
- Low-contrast grey-on-white "minimal" text, thin font weights, placeholder-as-label.
- Glassmorphism/blur and gradient text (unpredictable contrast, high-contrast mode breakage).
- Parallax, scroll-jacking, auto-advancing carousels, animated backgrounds, lottie hero loops.
- Hover-only or gesture-only interactions, floating action buttons that cover focus (2.4.11), sticky bars taller than a quarter of a phone viewport.
- Dark mode as the only theme, neon-on-black, colour-only status chips, emoji as the only icon.
- Chatbot overlays that obscure content or are the only help route.

## Acceptance criteria (testable)

1. Body text computed size is at least 18px (never below 16px) and set in rem; page works at browser text size 200%.
2. Body line-height is at least 1.5; paragraph gap is at least 1.5x line spacing.
3. Text blocks max-width is 80 characters or fewer (target 65ch); no `text-align: justify` anywhere.
4. Applying the WCAG 1.4.12 overrides (line 1.5, paragraph 2em, letter 0.12em, word 0.16em) loses no content or controls on landing, question, results and guide pages.
5. Font stack is a standard sans-serif; no font claims dyslexia benefit.
6. All body text meets 7:1; all text meets at least 4.5:1 (large 3:1), in both light and dark themes, verified by tool.
7. All input borders, button boundaries, icons and focus rings meet 3:1 against adjacent colours.
8. Every status (likely / maybe / not now, error, success, required) has a text label and an icon in addition to colour; screenshot in greyscale remains understandable.
9. Body-text links are underlined (or have 3:1 plus another cue).
10. Dark theme follows `prefers-color-scheme`, has a visible toggle, and no pair falls below the targets in item 6.
11. In Windows forced-colours mode every control, card edge and focus ring is visible.
12. Focus indicator is at least 3px thick, 3:1 contrast, visible on every focusable element on all backgrounds.
13. No sticky or fixed element fully covers the focused element at 320px width or 400% zoom (2.4.11).
14. At 320 CSS px width and 400% zoom, no horizontal scrolling on any page (excluding data tables if any).
15. Every interactive control (radio rows, buttons, expanders, back link, nav) is at least 44x44 CSS px; inline text links exempt.
16. Questionnaire shows exactly one question per page, with the question as the `<h1>`/legend, and a visible "Continue" button (not "Next").
17. Every question page has a Back link at top; browser Back and the Back link both restore the prior answer; no answer is lost on refresh within the session.
18. Each question offers a "Not sure" or "Prefer not to say" path that still lets users reach results.
19. A check-answers page lists all answers with Change links (hidden text naming the question) that return directly to the summary.
20. No question asks for information already given in the flow (3.3.7).
21. No timeouts or session expiry; if one exists it gives a 20+ second warning and a one-step extend.
22. Validation runs only on Continue; error summary receives focus, `<title>` begins "Error:", each message sits beside its field and says how to fix it, and entered values are kept.
23. Copy audit: average sentence 20 words or fewer, paragraphs 3 sentences or fewer, no idioms, headings at least every 200 words, readability check passed, and sampled with real users.
24. Landing page lists what information users need before starting and shows roughly how many questions.
25. Results page opens with a plain-language outcome heading; each program group has a text label; "not now" items state why and what would change the outcome or what to do instead.
26. Each program card shows its requirement checklist with text+icon states; official wording is available behind an expander and the default view is a short line (no wall of prose).
27. Under `prefers-reduced-motion: reduce`, no transform/parallax/slide animation runs; with no preference, no animation lasts over 5 seconds, loops, or autoplays.
28. No flashing content above 3 flashes per second; no autoplaying media or carousels.
29. Help/contact link appears in the same position on every page (3.2.6).
30. Passes axe/Lighthouse with zero critical issues, plus a manual pass with a screen reader (VoiceOver on iOS and NVDA/JAWS) on one full journey, and keyboard-only completion of the questionnaire and results.
