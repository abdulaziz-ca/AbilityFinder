# Codex Review — Ticket #197 Readability Checker

**VERDICT: APPROVED**  
**Findings: 0**

Reviewed `scripts/check-readability.js` and the `package.json` change at `HEAD` (`f8fcc8c`), then ran the checker and the full test suite.

## 1. Formula correctness

Confirmed. `analyzeBenefit` computes:

```js
averageSentenceLength = wordCount / sentenceCount
0.39 * averageSentenceLength + 11.8 * (syllableCount / wordCount) - 15.59
```

This is exactly the Flesch–Kincaid Grade formula `0.39*(words/sentences) + 11.8*(syllables/words) - 15.59`.

The syllable heuristic matches the ticket requirement:

- lowercases and strips non-letters;
- counts vowel runs with `/[aeiouy]+/g`;
- subtracts one for a final silent `e`;
- clamps every word to at least one syllable with `Math.max(1, count)`.

Zero denominators are guarded. Sentence count is clamped to at least 1, and the grade calculation returns 0 when `wordCount` is 0, so `syllableCount / wordCount` is never evaluated for empty prose. Longest-sentence calculation also returns 0 when there are no sentence fragments.

## 2. Non-blocking behavior

Confirmed by control flow. Reading, VM parsing/evaluation, benefit mapping, report construction, and report writing are all inside one `try`; malformed or unexpected input and write failures are caught and logged. After the `catch`, the script unconditionally calls `process.exit(0)`. There is no failure exit path in the script, so malformed `public/data.js` cannot fail the build.

## 3. Side effects and package change

Confirmed from the implementation and commit diff:

- the only file read explicitly is `public/data.js`, via `fs.readFileSync`;
- the only write is `research/197-info-density/READABILITY-REPORT.md`, via the single `fs.writeFileSync` call;
- there are no writes to `public/data.js`, `public/`, or any other path;
- the data file is evaluated in a restricted `vm` context containing only `window`, `document`, and `console`, with no `require` or `process` exposed;
- `git diff HEAD^ HEAD --name-only` showed only `package.json`, the generated report, and the checker itself;
- running the checker left the tracked report unchanged and did not modify any tracked file.

`package.json` remains valid—as also demonstrated by both npm commands parsing and running successfully. Its diff adds only:

```json
"check:readability": "node scripts/check-readability.js"
```

No prior script was removed or changed.

## 4. Field selection

Confirmed. `proseFor` includes only the requested user-facing prose:

- `summary`
- `note`
- `requiresNote`
- `detail.about`
- `detail.tips`
- `eligibility.items`
- `eligibility.note`

It does not traverse the benefit object generically, so amounts, URLs, tables, IDs, requirements, procedural `detail.steps`, documents, times, phone numbers, and other structured fields are excluded. The ID is retained only as the report row identifier, not included in scored prose.

## 5. Runtime and sanity checks

`npm run check:readability` exited 0, wrote `research/197-info-density/READABILITY-REPORT.md`, and printed:

- `Total benefits analyzed: 102`
- `FK grade > 9: 94`
- `Average sentence length > 20: 35`
- `Longest sentence > 25: 83`

The ranking is plausible. `bc-monthly-nutritional-supplement` is first at FK grade **21.2**, average sentence length **33.4**, and longest sentence **43** words. Its source prose genuinely contains long, multi-clause sentences—for example, the `detail.about` sentence combines the qualifying status, severe-condition test, chronic deterioration, wasting symptoms, nutritional need, and danger-to-life test in one sentence.

A short simple sanity string such as `Cats run.` has 2 words, 1 sentence, and 2 estimated syllables under this implementation, yielding:

`0.39*2 + 11.8*(2/2) - 15.59 = -3.01`, rounded to **-3.0**.

That is appropriately much lower than the long, polysyllabic, multi-clause catalogue prose, confirming the expected score direction.

## 6. Regression tests

`npm test` completed with **123 tests, 0 failures**: 121 passed and 2 baseline-dependent data-procedure checks were skipped with their existing “cannot confirm” diagnostics. No new failure was introduced.

## Findings

None.
