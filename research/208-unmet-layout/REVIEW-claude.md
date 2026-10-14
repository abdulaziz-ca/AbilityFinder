# Adversarial review (claude) - ticket #208 unmet requirements layout

Verdict: FINDINGS (1 blocker, 3 should-fix, several nits). Read-only review; no suites run.

## Blocker

B1. New links are unstyled, so they render in browser-default blue/purple on dark and high-contrast themes.
- Evidence: `public/styles.css` has no global `a` colour rule (grep of every `a` selector shows only scoped ones: `.disclaimer a`, `.stable-links a`, `.grant-card a`, `.dtc-prep a`). The diff adds only `.req-action { margin-left: .3rem; }` (styles.css ~685) and nothing at all for `.req-guide-link` / `.js-req-guide` (app.js:4043) or `.req-action` colour. No `color-scheme` is declared. Default `#0000EE` on `--bg` near-black is about 2:1, and visited purple is worse; this also ignores `body.a11y-contrast`.
- Fix: add `.req-checks a, .req-preview a { color: var(--accent-hi); text-decoration: underline; text-underline-offset: 3px; overflow-wrap: anywhere; }` (works in the light, dark and `a11y-contrast` token sets), a visible `:focus-visible` outline with the existing `outline: 2px solid var(--accent)` pattern, `min-height` target of 24px or more for the guide link, and `@media (forced-colors: active)` `LinkText`. In the print block, set these links to `color:#000`. Add an e2e that asserts computed colour contrast against the card background in dark and contrast themes.

## Should-fix

S1. app.js:5005 - print-only article is emitted even when `unmet` is empty and it hides the whole detail page when printing.
- Evidence: `#app > :not(.print-action-plan){display:none}` (styles.css ~1474) now leaves the detail print as just `<h1>name</h1>` plus requirements. When the wizard is not done or status is ready, the printout is a page containing only the benefit name. Previously blank, now misleading.
- Fix: emit the article only when `unmet.length`, and include the official link and summary (reuse `renderPrintActionPlan` item markup) or do not hide the detail body in print.

S2. app.js:4284 - focus handling only partially covers the real-navigation path and leaves the card title context behind.
- `render()` already focuses the first `h1,h2` on route change (app.js ~2093), then the handler overrides it by focusing `req-detail-{id}` and scrolls the heading into view (default `focus()` scrolls). Screen reader users hear the requirements heading without the benefit name (routeLive announces the page label first, so acceptable) but there is no test that the `tabindex=-1` heading is not a tab stop and that Ctrl/middle-click navigation to `/guides/{slug}` loads the static guide. Also `focus()` is called with no `preventScroll` semantics decided, so with `scroll-behavior: smooth` on `html` (styles.css:116) reduced-motion users get smooth scroll; gate on `a11y.motion` like app.js:1823.
- Fix: `el.focus({ preventScroll: true }); el.scrollIntoView({ block: "start", behavior: a11y.motion ? "auto" : "smooth" })` and add an assertion that `document.activeElement` is the heading and a Tab press moves to the next link.

S3. Results card shows only a count for any benefit whose needs are not all migrated (193 of 199 gates).
- app.js:4037-4043: `allCues ? needs.slice(0,3) : []`. For nearly every "almost" card the user now sees "N requirements not yet confirmed" plus a link and no hint of what to do (previously "To unlock this you still need: Get your DTC"). This is a real information loss on the primary surface and the dtc-unsure override (`short` undefined) is exactly the highest-value cue.
- Fix: when exactly one need is unmigrated and its text is under about 120 characters, show it on the card (or show migrated cues even when others are unmigrated, with "and N other checks"). At minimum, confirm with the owner that count-only is intended.

## Nits that affect users

N1. i18n: only `en` keys were added (`req.*`); French falls back to English strings under `lang="en"`, which is correctly marked, and `det.enNote` is shown inside the section, but the detail page already shows its own `enNote` (app.js:4857), so French users see the note twice.
N2. app.js:4005 `reqEscape` and `reqEscape(t("req.full").replace("{name}", b.name))`: string `.replace` with a name containing `$&`/`$'` would be interpreted; no current benefit name has a `$` (checked), so latent only. Use a replacer function.
N3. `data-req-key="${n.key}"`, `id="req-card-${b.id}"`, `data-id="${b.id}"` are not escaped; matches neighbouring code and ids are code constants, so not exploitable.
N4. Side status pill and section count duplicate each other ("2 requirements not yet confirmed" twice) on the detail page.

## Checked and found correct

1. Escaping: every interpolated `short`, `text`, benefit name, action text and href passes `reqEscape` (quotes included). No `unmet` string contains HTML, `&` only appears in two fixed gates (`nl`, `provinceCovered`) that go to `reasons`, not `needs`, and no escaped-dollar strings exist, so no double-escape and nothing newly raw. Old `${n.text}` raw output is now safely escaped.
2. Evaluation: `evaluate()` only adds `key/short/who` to pushed needs; `met`, `fixed`, status, priority and `nextAction` logic are untouched. Consumers of `needs`: benefitCard (4037), `reqPrint`, `renderGuideBody` (4851, 4920, 4923), print paths, and `evaluate()` callers at 3465, 3552, 4433; none depends on object shape beyond `.text/.action`. `fixed` failures still produce status "no", so card counts never include age/residency failures.
3. Accessibility structure: detail h2 with h3 groups matches the prior h2; inline guide uses h4/h5; ids use distinct prefixes (`req-card-`, `req-inline-`, `req-detail-`) so a benefit shown as a card and an expanded inline guide does not collide. The summary text "Read full requirements for {name}" is a unique accessible name. `lang="en"` is on the section, preview, lists and print article, with a separate `lang="fr"` note.
4. "One step away" is now only used for exactly one unmet need; otherwise the count text is used. Truthful.
5. Asset version: all 150 `?v=` references under `public/` are 165 (index.html, styles.css font URLs and generated guides); none left at 164.
6. Reduced motion and print: no animations added; `forced-colors` handled for the summary and border.

## Test mutation analysis

- `test/requirements-layout.test.js` test 2 (static full text verbatim): fails if the disclosure drops full text, because migrated text only lives in `.req-full`. Test 1 enforces the 80-character bound (fails if `short` exceeds it). Test 3 asserts `Full 4` is present with 5 needs (fails if `slice(0,2)` or a cap is reintroduced) and the 3-cue budget.
- e2e catalogue test (`checked > 100`) fails if any need is dropped from `renderGuideBody`.
- Weak: unit test 2 computes `expected` with the same `reqEscape` it is checking, so a broken `reqEscape` is not caught. There is no test with `<`/`"`/`&` in `name` or `short`, none for `reqPrint`, none for the "One step away" vs count label, none for link colour/contrast (hence B1 escaped), and none that the print article is absent when there are no unmet needs (S1).
- e2e theme loop test sets theme classes then asserts only `scrollWidth`; it does not exercise contrast and is partly decorative.
