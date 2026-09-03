VERDICT: APPROVED

Findings: 0

## Adversarial review evidence

### Functional parity after removing `statusBanner`

- **Pre-wizard CTA is preserved.** In `public/app.js:4584-4586`, the `!wizardDone()` branch renders a real `<button class="linklike af-check" data-guide-check>`. `wireGuideInteractions` still queries all `[data-guide-check]` descendants of its root at `public/app.js:4677`, so the replacement control is present and wired on full guides.
- **Post-wizard status is preserved.** In `public/app.js:4586`, completed-wizard states render `${sideStatus.txt}` with `${sideStatus.cls}`. The `sideStatus` branches at `public/app.js:4566-4570` cover `almost` (“One step away”), confirmation-required (“Possible match — confirm rules”), and ready (“Close match — confirm rules”). No completed state becomes blank; the prior `almost` top banner was already intentionally blank, while the new card now exposes that state.

### Rendering correctness

- `inline`, `d`, and `x` are defined before use; `v` is defined at `public/app.js:4540` and `sideStatus` at `public/app.js:4566`, before `afEligible` / `answerFirst` at `public/app.js:4584-4591`. There is no use-before-definition.
- `answerFirst` is explicitly `""` when `options.inline` is true, avoiding duplication with the inline guide’s full-guide CTA.
- The main template now inserts `${answerFirst}` exactly where `${statusBanner}` was. Repository search found no remaining `statusBanner` identifier or dangling reference.

### Trust and XSS boundary

- The new HTML uses static i18n strings, static status strings, catalogue-authored `b.applyText`, catalogue/structured-value output in `v.head`, catalogue `d.time`, and the existing `resolveUrl(b.applyUrl)` path. These are the same trusted catalogue sources and direct-interpolation pattern already used by the detail hero, value section, metadata, and sidebar apply link.
- No questionnaire free text, URL parameter, persisted user input, assistant/model output, or other newly untrusted value is introduced into the card’s HTML.

### Internationalization and accessibility

- All six keys—`af.aria`, `af.eligible`, `af.howMuch`, `af.howApply`, `af.eligiblePrompt`, and `af.check`—exist in both English (`public/i18n.js:383-388`) and French (`public/i18n.js:778-783`). They are UI labels; benefit catalogue content remains unchanged.
- The card is a labelled `<section aria-label="…">`. The eligibility action is a native `<button>`. The apply action remains an `<a>` with `target="_blank"` and `rel="noopener noreferrer"`. Eligibility, amount (when the catalogue publishes one), apply action, and processing time remain visible rather than hidden behind disclosure.

### CSS and asset versioning

- `.answer-first` uses the existing `--hair`, `--panel-2`, `--text-dim`, `--text`, `--ok`, `--warn`, and `--r-sm` tokens. It is a three-column grid and changes to one column at `max-width: 680px`; wrapping and auto-height avoid French truncation.
- The referenced dark-theme token values provide light text/status colours over the dark panel, and the existing light-theme overrides supply dark text/status colours over the light panel. No obvious contrast regression was introduced.
- Asset version `125` is consistent across `public/index.html` scripts, stylesheet, icon, and font preloads, and across the two font URLs in `public/styles.css`.

## Tests

- `npm test`: **123 tests total; 121 passed, 0 failed, 0 cancelled, 2 skipped, 0 todo** (1 suite). The two skips are the baseline-dependent data-procedure checks reported as not confirmable without `DATA_PROCEDURE_BASELINE`; no test failed.
