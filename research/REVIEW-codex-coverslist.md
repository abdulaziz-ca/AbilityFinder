# Codex review — coversList conversion

**VERDICT: APPROVED — 0 findings.**

## Faithfulness

- **bc-clbc — PASS.** All 8 `coversList.items` are verbatim substrings of the original `detail.about`; the remaining `about` is the original final sentence unchanged. Lead preserves the record's exact framing, `CLBC funds and coordinates:`. No covered service or figure (`14+`) was dropped or altered.
- **bc-autism-funding-under-6 — PASS.** All 5 items are verbatim original substrings; the remaining two `about` sentences are unchanged. Lead preserves the `$22,000 per year per child` framing. Preserved figures: `$22,000`, `$100/month`, `20%`, `50%`, and `March 31, 2027`; no covered item was lost.
- **bc-autism-funding-6-18 — PASS.** All 9 items are verbatim original substrings; the remaining two `about` sentences are unchanged. Lead preserves the `$6,000 per year per child` framing. Preserved figures: `$6,000`, `$50/month`, `$600 per period`, `20%`, `50%`, and `March 31, 2027`; no covered item was lost.

## Render — PASS

- SPA `renderGuideBody` conditionally inserts a translated `guide.covers` section with the lead and an `<ul>` of items. Its direct interpolation matches the existing authored-catalogue-data pattern.
- `scripts/gen-guide-pages.js` conditionally emits the same lead + `<ul>` structure and applies `esc()` to both lead and each item.
- `guide.covers` exists in English (`What it covers`) and French (`Ce qui est couvert`).

## Scope — PASS

- In `public/data.js`, only the three named records' `detail.about` fields changed and only their new `detail.coversList` fields were added. No `requiresNote`, `eligibility`, `amountTiers`, `amount`, or other record changed.
- Shared asset version moved consistently from `126` to `127` (14/14 references before and after).
- A newest-first `DATA_CHANGELOG` entry records the three-guide presentation change.

## Tests — PASS

`npm test`: **123 tests, 123 passed, 0 failed** (1 suite; 0 skipped/cancelled/todo).
