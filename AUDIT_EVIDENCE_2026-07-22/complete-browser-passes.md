# AbilityFinder audit — browser/accessibility/resilience completion checkpoint

Date: 2026-07-22 (America/Edmonton)
Repository: `/Users/abdulaziz/Claude Random Apps/benefit-finder`
Production: `https://abilityfinder.ca`
Audit boundary: defensive local/source review; only ordinary, non-mutating production GET navigation; no real personal data; no email or AI submission; no repository edits.

## Status and artifact paths

This checkpoint records the evidence available when the completion pass was stopped. It is **not** a completed substitute for Passes 4, 5, 8, or 9. No screenshot, trace, PDF, or calendar artifact was produced in this completion pass because the local Worker launch was interrupted before the planned matrix ran.

Durable checkpoint:

- `/tmp/abilityfinder-audit/complete-browser-passes.md`

Earlier audit evidence supplied to this pass:

- `/tmp/abilityfinder-audit/architecture-qa.md`
- `/tmp/abilityfinder-audit/benefit-integrity.md`
- `/tmp/abilityfinder-audit/enumerate-questionnaire.js`
- `/tmp/abilityfinder-audit/static-invariants.js`

## Skills, documents, and tooling checked

- Read `AGENTS.md` completely.
- Read the relevant architecture, persistence, route, and testing portions of `HANDOFF.md`.
- Read `DEPLOY.md` completely before attempting Worker validation.
- Read the relevant failure histories in `ARCHIVAL_KNOWLEDGE_BASE.md`.
- Read the in-app browser control skill completely.
- Read the web-performance skill completely.
- Read the Cloudflare platform skill completely.
- The in-app browser runtime reported `No browser is available`; browser discovery returned `[]`. Per its instructions, it was not replaced with an unrelated interactive browser surface.
- Chrome DevTools MCP was not configured. Therefore no performance trace or Core Web Vitals measurements were taken. No performance value should be inferred from this audit.
- Playwright package version in the project: `^1.61.1`.
- Browser binaries found initially: Chromium 149.0.7827.55 (`chromium-1228` / headless shell `1228`). The owner later reported Firefox 151.0 (`firefox-1532`) and WebKit 26.5 (`webkit-2311`) installed, but the cross-browser run was stopped before execution.
- Existing Playwright configuration uses only the default Chromium project and a static Python server at `http://127.0.0.1:8766`; no Firefox/WebKit projects are declared.

## Evidence inherited from completed earlier passes

The following is included here only to keep the matrix auditable; it was completed before this completion attempt:

- `npm test`: 29/29 passed, 0 skipped.
- `npm run test:e2e`: 21/21 passed in Chromium, two workers, about 2.1 minutes.
- `npx wrangler deploy --dry-run`: passed; 110 public files; 197.66 KiB uploaded, 51.49 KiB gzip; bindings listed for `LINK_HEALTH`, `FEEDBACK_MAIL`, `AI`, `ASK_LIMIT`, and `ASSETS`.
- Generated context/link/guide output was regenerated in a temporary copy and matched the committed generated files byte-for-byte.
- A reduced-equivalence questionnaire run tested 250,000 unique complete states out of 3,268,249,940,272,320 calculated semantic reachable states.
- That run covered all 3 personas, 8 age bands, all 96 catalogued cities plus generic fallback, 64 predicate-relevant disability combinations, 392 functional projections, 94 situation projections, and 10 circumstance projections.
- It observed 186,872 distinct 84-benefit status vectors and no evaluator exceptions.
- Existing Playwright coverage included a fresh Alberta path, Alberta/BC journeys, mid-wizard reload, legacy migration, stale-tab conflict, IndexedDB unavailable, and 3 personas across 17 views.
- Production ordinary GET checks observed `/api/link-health` and GET `/api/ask` returning the application’s static 404 rather than the Worker’s expected JSON behavior. Local Worker checks in the earlier pass returned the expected API responses.
- Earlier browser evidence reproduced raw postal text being inserted as HTML after navigating from DTC practitioner help to RDSP and back to DTC.
- Earlier production inspection observed two Cloudflare Web Analytics scripts executing despite the project’s documented no-analytics rule.

These inherited results do not establish Firefox/WebKit support, real assistive-technology usability, 320 px/400% reflow, print correctness, offline resilience, API interruption recovery, or current production API functionality.

## Completion-pass setup result

The local command:

```text
npx wrangler dev --local --port 8799
```

first failed in the sandbox because Wrangler could not bind to loopback (`127.0.0.1:9229: permission denied`) and could not write its normal home-directory log. An escalated local-only rerun was requested, but that run was interrupted before the Worker was available and before any new browser matrix began. No production active testing was substituted.

## Route and blank-page evidence

Source-authoritative route count: 17 client views:

`landing`, `wizard`, `results`, `browse`, `detail`, `privacy`, `about`, `support`, `updates`, `help`, `accessibility`, `professionals`, `partner-overview`, `impact`, `dtc-prep`, `grants`, `organizations`.

Earlier completed E2E coverage exercised the 17 persisted routes for `self`, `child`, and `family` (51 route/persona combinations). It also exercised IndexedDB unavailable and stale-tab behavior. No blank page was reported in those 21 passing Chromium tests.

**Not established in this completion pass:**

- clean-profile route sweep in Firefox and WebKit;
- console-error and page-error counts for all 51 combinations;
- route sweep at 320 CSS px, mobile landscape, 200% text, or 400% zoom-equivalent reflow;
- old/removed benefit identifiers and arbitrary malformed history snapshots in a real browser;
- interrupted render injection followed by deterministic rerun;
- BFCache preservation/restoration;
- production route sweep after clearing all site data.

Therefore the defensible counts are:

- Browser route/persona combinations represented by earlier E2E: 51.
- New combinations executed in this completion pass: 0.
- New console errors counted in this completion pass: not measured.
- New blank pages counted in this completion pass: not measured.

## Critical-path three-way matrix

| Critical pathway | Fresh | Persisted reload | Failure/interruption | Evidence status |
|---|---:|---:|---:|---|
| Start/continue wizard | Earlier Chromium E2E | Earlier Chromium E2E | Earlier IndexedDB-unavailable E2E | Covered only in Chromium |
| Results and all persisted routes | Earlier Chromium E2E | Earlier Chromium E2E | No forced render exception | Partial |
| Clear/reset and stale-tab resurrection | Unit tests cover tombstones/stale writes | Partial E2E stale-tab coverage | No new browser clear/reset rerun | Partial |
| Assistant | Dialog/UI source review | Consent persistence covered by boundary tests | Production API observed routed to static 404; no malformed/truncated SSE run | Partial |
| Feedback | UI/source review | Not applicable | Production submission deliberately not sent; no local mail-binding failure run | Not functionally validated |
| Print results | Source review only | Not run | Not run | Gap |
| Calendar reminders | Existing unit/source history only | Not run | Not run | Gap |
| Practitioner postal flow | Earlier browser reproduction | Postal excluded from persistence by tests | Raw HTML insertion earlier reproduced | Partial |

## Code-confirmed browser/accessibility findings that remain actionable

### CB-01 — Entire changing application region is live

- Severity/Priority: High / P1
- Type: Accessibility
- Confidence: Code-confirmed; real screen-reader impact requires manual validation
- Evidence: `public/index.html:102` gives the complete `#app` container `aria-live="polite"`. Each answer causes the application route/content to rerender.
- Risk: A screen reader may announce large parts of the page after every answer or navigation, increasing cognitive load and obscuring the intended question/status announcement.
- Expected: Only concise, purposeful status messages should be live.
- Correction: Remove the broad live region and announce route/question/result changes through small atomic status elements with deliberate focus management.
- Verification: NVDA/Firefox, JAWS/Chrome, and VoiceOver/Safari walkthroughs by an experienced user; confirm one concise announcement per transition and no token-by-token assistant announcements.

### CB-02 — Wizard multiselect state is visual only

- Severity/Priority: High / P1
- Type: Accessibility
- Confidence: Code-confirmed
- Evidence: wizard option buttons toggle visual `.selected` state in `public/app.js`, but do not expose `aria-pressed`, checked semantics, or a named group/fieldset.
- Risk: Screen-reader users cannot reliably determine which functional limitations or situations are selected.
- Expected: Each selectable option conveys role, group label, and current selected state programmatically.
- Correction: Use native checkbox semantics or correctly maintain `aria-pressed`, with a named question group and persistent focus.
- Verification: Accessibility-tree assertion plus keyboard and NVDA/VoiceOver confirmation of selected/unselected state.

### CB-03 — Wizard rerenders can discard keyboard focus

- Severity/Priority: High / P1
- Type: Accessibility/Reliability
- Confidence: High confidence from executable render path; manual AT validation required
- Evidence: answer handlers rerender the wizard and single-choice questions auto-advance after a timer; the focused element is replaced without an explicit focus target.
- Risk: Keyboard and screen-reader users may be returned to the document body or header after each response and lose question context.
- Expected: Focus moves predictably to the next question heading/instruction, or remains on the toggled multiselect option.
- Correction: Define and test focus restoration for every wizard transition and back navigation.
- Verification: keyboard-only and screen-reader journey through all visible step types in all three personas.

### CB-04 — Failure recovery button conflicts with CSP

- Severity/Priority: Medium / P1
- Type: Reliability/Accessibility
- Confidence: Code-confirmed
- Evidence: the `renderSafely()` error card uses inline `onclick="location.reload()"` while the project CSP excludes `unsafe-inline`.
- Risk: “Try again” can be inert precisely when a rendering failure occurs.
- Expected: Recovery controls remain operable under production CSP.
- Correction: render a normal button and attach its listener through the existing wiring layer.
- Verification: deliberately throw within each route renderer under Wrangler CSP; activate retry by mouse, keyboard, and touch.

### CB-05 — Some form controls remove the standard outline

- Severity/Priority: Medium / P2
- Type: Accessibility
- Confidence: Code-confirmed; actual contrast/visibility needs visual validation
- Evidence: `public/styles.css:655` (`.track-sel:focus`) and `:799` (`.select-input:focus, .text-input:focus`) remove outlines, relying on border changes.
- Risk: Focus indication may be difficult to perceive, especially in high contrast or forced-colors mode.
- Expected: A visible 2 CSS-pixel-equivalent focus indicator with sufficient contrast and area survives forced colors.
- Correction: retain or replace the outline with a `:focus-visible` indicator and explicit forced-colors support.
- Verification: Chromium forced-colors emulation plus Windows High Contrast manual check.

### CB-06 — No skip link and no forced-colors-specific styling found

- Severity/Priority: Medium / P2
- Type: Accessibility
- Confidence: Code-confirmed for source absence; usability impact requires manual validation
- Evidence: source search found no skip-link implementation and no `@media (forced-colors: active)` rules.
- Risk: repeated navigation is costly for keyboard/switch users; custom semantic colors/icons may lose meaning in forced colors.
- Expected: Repeated blocks can be bypassed; controls/status remain distinguishable when author colors are overridden.
- Correction: add a visible-on-focus skip link and validate forced-colors behavior before adding only necessary targeted rules.
- Verification: complete keyboard route sweep and Windows forced-colors walkthrough.

### CB-07 — Route titles are not updated

- Severity/Priority: Medium / P2
- Type: Accessibility/UX
- Confidence: Code-confirmed
- Evidence: route transitions change application content/history but source review found no corresponding `document.title` update per view.
- Risk: screen-reader and browser-history users receive weak page context across client routes.
- Expected: Each view has a concise unique title and purposeful route announcement/focus.
- Correction: centralize route title and focus behavior in navigation.
- Verification: assert title, H1, and focus target for every route and browser back/forward.

### CB-08 — Production Worker API routing mismatch

- Severity/Priority: High / P1
- Type: Reliability
- Confidence: Observed in earlier ordinary production GET validation
- Evidence: production GET `/api/link-health` and GET `/api/ask` rendered the static application 404, while the local Worker returned link-health JSON and a 405 JSON response for GET `/api/ask`.
- Risk: link-health, assistant, and feedback may not reach the Worker on the custom domain. POSTs were deliberately not sent to production, so assistant/feedback outage is high-confidence, not separately observed.
- Expected: `/api/*` is routed through `src/index.js` before static fallthrough.
- Correction: inspect custom-domain/Worker route and Workers Builds deployment association; restore only after assistant safety defects are addressed.
- Verification: safe GET contract checks, one synthetic assistant request, and one synthetic feedback delivery with owner confirmation.

### CB-09 — Raw postal input is interpolated into HTML

- Severity/Priority: Low / P2
- Type: Security/Defect
- Confidence: Observed in earlier local browser flow
- Evidence: synthetic postal value containing markup created a canary DOM element after DTC → related RDSP → back to DTC. Root is raw `answers.postal` interpolation into an input `value` in `public/app.js`.
- Risk: self-originated DOM injection and broken UI; CSP blocks straightforward inline script and postal is not persisted, so no cross-user stored-XSS impact was demonstrated.
- Expected: Free text remains text/attribute data and cannot alter DOM structure.
- Correction: assign through the DOM `value` property or escape attribute values.
- Verification: payload corpus across navigation, print, Maps-link construction, and reload; assert no new element/event handler and no network request.

## Resilience and production-readiness observations

- `wrangler dev --local` reports the AI binding as “not supported.” AI quota exhaustion and malformed stream behavior therefore require a stubbed isolated Worker test or a carefully bounded remote-binding test; neither was completed here.
- Static Python-server E2E cannot validate Worker routing, CSP headers, CORS, email/AI/KV/rate-limit bindings, cache behavior, or unknown `/api/*` fallthrough.
- The absence of Firefox/WebKit projects means `npm run test:e2e` passing is not evidence of cross-browser compatibility.
- The existing fixed waits (including approximately 230 ms timing in browser tests) create avoidable flake/latency risk; prefer observable state or event assertions.
- The repository’s recovery design (restore before first meaningful render, optimistic revisions, metadata tombstones, fail-visible reveal watchdog) is strong in code and unit coverage, but quota exhaustion, delayed/corrupt IDB, blocked upgrades, and browser BFCache remain unvalidated.
- No service worker/offline application shell was found. Offline degradation should be described as unavailable unless a cached page happens to remain usable; this was not browser-tested.

## Items explicitly not tested in this completion pass

- Firefox 151 and WebKit 26.5 journeys.
- Chromium 149 added viewport matrix: 320×800, common mobile portrait, landscape, tablet, desktop.
- 200% text resize and 400% zoom-equivalent reflow.
- OS reduced-motion and in-app `.a11y-nomotion` screenshots/behavior.
- Forced-colors emulation and real Windows High Contrast.
- Dark, light, and high-contrast themes from a fresh persisted reload.
- Automated axe scan. No axe package/configuration was found in `package.json`; automated findings must not substitute for manual testing.
- Real keyboard-only full journey.
- Any real screen reader (NVDA, JAWS, VoiceOver, TalkBack) or switch/voice-control testing.
- Real disabled-user cognitive/usability study.
- Print preview/PDF with zero, one, and many results or long content.
- Calendar download inspection for Unicode, 75-octet folding, CRLF, timezone, vague waits, and duplicate events.
- Browser back/forward and BFCache across all routes.
- Clear/reset followed by stale-tab and reload resurrection in real browsers.
- Old/invalid route and unknown benefit-ID corpus in all engines.
- CSS/JS/font/icon/data failure and slow-network interception.
- Malformed, truncated, numeric-token, cancelled, or quota-exhausted assistant streams.
- KV, email, rate-limit, AI, and static-asset binding failure injection.
- Storage quota, delayed/corrupt database, rejected transactions, and blocked database upgrade.
- Full production console/blank-page sweep.
- Screenshots, traces, HAR, video, or PDFs.
- Formal Core Web Vitals trace (Chrome DevTools MCP unavailable).

## Minimum next-run matrix

To close the gap without attacking production, create a temporary audit-only Playwright configuration (outside the repository) with Chromium 149, Firefox 151, and WebKit 26.5. Point it first at a static server for layout/storage cases and then at local Wrangler for CSP/API cases. For each engine:

1. Run all 17 routes for all 3 personas from clean state, valid restored state, and a forced render/storage failure.
2. Record page errors, console errors, empty `main`, titles, headings, and focused element.
3. Repeat critical journeys at 320×800, 390×844, 844×390, and 1280×800.
4. Run fresh light/dark/high-contrast reloads; reduced-motion; 200% text; 400% reflow; forced colors where supported.
5. Run keyboard traversal and accessible-state assertions for all wizard option types and dialogs.
6. Intercept assets and APIs to return timeout, 404, 500, malformed JSON/SSE, truncated streams, and connection aborts.
7. Capture print PDFs and calendar downloads; validate HTML/text completeness and RFC 5545 octet folding.
8. Rerun every failure once, then run clean regression journeys and compare deterministic result summaries.

Real screen-reader, forced-colors OS, cognitive-usability, and disabled-user study items must remain labeled “manual validation required” even after automation passes.
