# Codex review — UX #201/#202/#203

**Commit:** `102f0f7`  
**VERDICT: APPROVED**  
**Findings: 0**

## Evidence

### #203 — Apply as link
- `renderGuideBody` now renders the answer-card action as `<a class="af-apply-link">`; it no longer carries `.apply`/`.af-apply`, so it is a text link rather than the pill CTA.
- `.af-apply-link` uses the accent colour, hover underline, a visible `:focus-visible` outline, and a fixed 14px external icon.
- The sidebar primary action remains `<a class="apply" ...>` and is unchanged.
- URL handling is unchanged: both locations continue to interpolate the authored catalogue value through `resolveUrl(b.applyUrl)`, with `target="_blank"` and `rel="noopener noreferrer"`. This change adds no new input or XSS path.

### #201 — Progressive disclosure
- Essentials remain outside expanders: answer card, language note, short `about`, benefit note, eligibility/`requiresNote`, value, amount tiers, covers, DTC prep CTA, tax note, how-to-apply steps, practitioner finder, and related benefits.
- Secondary sections remain present and move to labelled native `<details class="guide-more">`: long `about` plus `plainTest`, documents, tips, denials, appeal, and FAQs.
- Proportional behavior is correct: `aboutText` excludes the already-duplicated summary; `aboutLong` is strictly `length > 240`; `aboutVisible` renders only non-long text; `aboutMore` renders the about text only when long. Therefore a short about appears once outside an expander, while a long about appears once inside it.
- Content parity against the prior renderer is intact: the previous `p2.plainTest`, documents, tips, denials, appeal, and FAQ payloads are all emitted by the new builders; only their wrappers/order and initial collapsed state changed. Related content and all essential sections remain visible.
- A record containing only a short about and steps creates no `.guide-more`: every expander is conditional on long-about/`plainTest`, a non-empty documents/tips/denials/FAQ list, or appeal text.
- Native `<details>/<summary>` provides keyboard operation without custom JS. Every outer summary has an EN/FR label; content remains in the HTML and the static no-JS guides continue to expose guide content. CSS supplies focus indication and disables the arrow transition under `prefers-reduced-motion: reduce`.
- No content shown twice or dropped was found.

### #202 — DRES metadata
- `BENEFIT_META.dres` is exactly `{ difficulty: 3, effort: "Application + disability documentation", wait: "varies" }`.
- `matcher-safety.spec.js` uses `toEqual` on that exact object, so missing, changed, or additional enumerable fields fail; `dres.extra` is still independently required to be `null`.
- `test/benefit-meta-complete.test.js` loads the live catalogue and metadata, checks the full-catalogue floor, then requires every benefit ID to have integer difficulty 1–5 plus non-empty string `effort` and `wait`. The guard is sound for the stated completeness contract and passes.

### Procedure
- Shared asset version moved consistently from 129 to 130 in `public/index.html`, generated guide stylesheet links, and the font URLs in `public/styles.css`.
- A new `DATA_CHANGELOG` entry is prepended.
- Generated guides are updated, including the DRES at-a-glance row. Generated context/link outputs have no committed delta because this metadata does not enter those artifacts; the data-procedure synchronization check passes.

## Verification
- `npm test` — **PASS**: 124/124 tests. Its data-procedure suite resolved baseline `f0469b4` and passed all four checks, including changelog, version bump, and generated context/link synchronization.
- `npx playwright test --project=app-chromium e2e/matcher-safety.spec.js` — **PASS**: 49/49 tests.
- Requested standalone command `DATA_PROCEDURE_BASELINE=f0469b4 node --test test/data-procedure.test.js` — the execution harness required external approval and did not run it separately. The same test file did run successfully inside `npm test`, resolving the same `f0469b4` baseline (reported there as inferred rather than declared).
