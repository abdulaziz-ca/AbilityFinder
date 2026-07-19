# AbilityFinder — technical handoff

This is the current architecture reference. Read `AGENTS.md` first for operating
rules. Use `ROADMAP.md` for active work, `DEPLOY.md` for production operations, and
`ARCHIVAL_KNOWLEDGE_BASE.md` for failure history.

## Scope

AbilityFinder is an Alberta-first disability-benefit finder with federal,
provincial, and municipal guides. It answers five questions:

1. What can I get?
2. What may it be worth?
3. Am I likely eligible, and why?
4. What should I apply for first?
5. How do I apply?

Other jurisdictions are parked in `public/data-provinces-later.js` and are not
loaded. French scaffolding exists in `public/i18n.js`, but catalog translation is
paused.

## Runtime architecture

AbilityFinder is one Cloudflare Worker with static assets:

- `public/` is the only deployed directory.
- `src/index.js` handles `/api/*` and falls through to `env.ASSETS`.
- The front end is plain HTML, CSS, and classic JavaScript; there is no site build.
- Root docs and `serve.py` never ship.

### Worker routes

| Route | Purpose | Data boundary |
|---|---|---|
| `POST /api/ask` | Opt-in, grounded Workers AI assistant | Entire current in-memory conversation, up to 20 messages |
| `POST /api/feedback` | Opt-in feedback through the pinned email binding | Kind, optional reply email, and message |
| `GET /api/link-health` | Public noindex link-monitor report | Official catalog links only; no user state |

The scheduled handler runs a bounded rotating link batch every three hours and
stores aggregate health in `LINK_HEALTH` KV.

## File map

| Path | Responsibility |
|---|---|
| `public/index.html` | Page shell, navigation, accessibility and assistant panels, script order |
| `public/styles.css` | Dark/light/high-contrast design, responsive layout, print, motion |
| `public/icons.js` | Inline SVG icon map; UI avoids emoji |
| `public/i18n.js` | English/French UI strings and fallback helpers |
| `public/data.js` | Catalog, official sources, values, metadata, guides, supports, help organizations |
| `public/app.js` | In-memory state, wizard, eligibility, router, all render/wire functions |
| `public/dbManager.js` | IndexedDB open/upgrade/read/write/clear/close, revisions, tombstones, legacy reads |
| `public/stateManager.js` | Persistence allowlist, catalog-backed validation, legacy sanitization, change emitter |
| `src/index.js` | Assistant, feedback, link-health API, static-asset fallthrough |
| `src/link-check.js` | Redirect-aware bounded checker and KV merge |
| `src/benefits-context.js` | Generated assistant grounding; do not edit |
| `src/links.js` | Generated canonical monitor links; do not edit |
| `scripts/gen-benefits-context.js` | Generates both files above from current source data |
| `scripts/gen-guide-pages.js` | Generates static benefit guides and updates the sitemap from the active catalog |
| `public/guides/` | Generated indexable HTML guide pages; do not edit by hand |
| `test/` | Node tests for persistence, migration, privacy boundary, and races |
| `e2e/` | Playwright reload, route/persona, migration, privacy, and failure tests |
| `wrangler.jsonc` | Assets, AI, KV, email, rate limit, observability, and cron bindings |

## Data model

The product lives in `public/data.js`. Important structures:

- `DISABILITIES`: wizard categories, not a list of diagnoses that guarantee aid.
- `ALBERTA_CITIES` / `CITIES_BY_PROVINCE`: city options and local routing.
- `BENEFITS`: guide records with `id`, display fields, `requires`, application URL,
  official `source`, and `detail` steps/documents/tips/time/phone.
- `BENEFIT_VALUES`: structured estimates and value type.
- `BENEFIT_META`: effort, difficulty, wait, and estimate exclusions.
- `BENEFIT_EXTRA`: confirmation language, denials, appeals, interaction warnings,
  FAQs, and related benefits.
- `SUPPORTS`: non-monetary supports matched by disability/situation.
- `HELP_ORGS`: form, appeal, legal, and local-service help.

Metadata maps are keyed by benefit ID rather than copied onto every benefit. URLs
may be functions of current answers and must be resolved through existing helpers.

### Adding or changing a benefit

1. Verify every factual field on the official source that day.
2. Edit the relevant `BENEFITS` record and ID-keyed metadata maps.
3. Add/update `BENEFIT_VERIFIED` only for records actually re-checked.
4. Run `npm run gen:context` after changing `BENEFITS`, `HELP_ORGS`, or
   `PRACTITIONER_FORMS`.
5. Review generated grounding and links; figures must remain redacted from model
   context.
6. Run `npm test` and `npm run test:e2e`.
7. Smoke-test the affected persona, result card, guide, print report, and source URL.

If a published wait-time string changes, also regression-test `waitToDays()`, the
generated calendar dates, and UTF-8 line folding in `buildReminderIcs()`. Do not
advance a freshness date merely because reminder logic was tested; freshness dates
record official-source verification only.

When adding a municipal program, also update the city-routing set used by
`REQS.cityOther`; otherwise residents may continue seeing the generic fallback.
Never infer one municipality from another.

## Front-end architecture

`public/app.js` intentionally remains a single vanilla-JS application module.
Useful concepts:

- `answers`: wizard selections created by `BLANK()`.
- `view`: landing, wizard, results, browse, detail, privacy, about, support, updates, or help.
- `about`: the public About & how we verify page.
- `support`: the public Support AbilityFinder page.
- `progress`: benefit ID to application stage.
- `groupMode`: priority or category.
- browse filters, accessibility preferences, language, theme, assistant consent,
  help context, and route context are explicit state—not arbitrary serialized data.
- `REQS`: eligibility predicates. Fixed traits produce not-a-match; actionable
  requirements produce one-step-away.
- `evaluate(benefit)`: returns the status, missing actions, and reasons.
- `STEPS` / `visibleSteps()`: adaptive wizard flow.
- `renderSafely()`: required boundary around every route.
- `setState()`: route/history transition; semantic changes emit through the central
  state-change mechanism.

Results include priority/category grouping, estimate summaries, progress stages,
supports, and human-help organizations. Details include confirmation language,
steps, documents, practitioner help, denial/appeal guidance, related guides, and
official sources. `printResults()` creates a local printable report rather than a
URL containing sensitive selections.

## Persistence architecture

Startup is asynchronous: restore completes before normal rendering.

1. `dbManager.js` opens versioned IndexedDB store `sessionState`.
2. `stateManager.js` supplies an explicit snapshot allowlist and authoritative
   selection sets from the app.
3. A one-time importer reads legacy `abilityfinder.*` localStorage values, converts
   old progress/group fields, and sanitizes them through the current allowlist. It
   removes old keys only after a successful sanitized write, or when an
   authoritative IndexedDB snapshot or tombstone already exists.
4. Writes are queued per tab and use optimistic revisions inside a read-write
   transaction.
5. Clear writes a metadata-only revision tombstone. A stale tab cannot overwrite a
   newer snapshot, clear newer work, or resurrect deleted answers.
6. On conflict the app reloads the authoritative snapshot instead of retrying stale
   full state.

Persisted: validated answers, route/help context, progress, approved filters,
`browseQuery` text, accessibility, language, theme, grouping, and assistant consent.

Excluded: postal/geolocation input, assistant messages, feedback, DOM/function
state, rendering internals, and unknown future properties.

## Assistant grounding

The Workers AI model is cheap enough for the zero-spend constraint but weak at
following negative instructions. Therefore:

- `npm run gen:context` builds a compact catalog and per-benefit details from source.
- `retrieveDetails()` sends only matched detail, including recent turns for follow-up
  resolution.
- Amounts and percentages are redacted from grounding. The model is told to point
  to the verified guide instead of stating figures or eligibility verdicts.
- Output is streamed and rendered with `textContent`.
- Each request transmits the entire current in-memory conversation, up to the
  Worker's 20-message limit; it is not trimmed to only the latest turn.
- Numeric stream fragments may be JSON numbers; explicit null/undefined checks are
  required.

Regression prompts and the history behind these limits are in
`ARCHIVAL_KNOWLEDGE_BASE.md`.

## Testing

```sh
npm test
npm run test:e2e
npx wrangler deploy --dry-run
npm audit
```

The Playwright suite covers normal and mid-wizard recovery, filters/preferences,
legacy migration privacy, all persisted routes for all personas, unavailable
IndexedDB, and stale-tab conflicts.

Before release:

- Run both themes from fresh reloads.
- Exercise self/child/family across all routes.
- Check console/page errors and fail-visible behavior.
- Verify sensitive wizard/profile data and unapproved free text do not appear in
  IndexedDB or app URLs. The allowlisted `browseQuery` persists locally; postal or
  coordinate text enters a user-initiated Google Maps URL only when that link opens.
- For Worker/CSP changes, test through `wrangler dev`, not only a static server.
- For data changes, verify official live destinations and `/api/link-health`.

Automated accessibility checks do not cover real screen readers, full keyboard
journeys, high zoom/reflow, or cognitive usability.

## Design constraints

- Editorial warm-black dark theme and warm-paper light theme.
- Fraunces display type and Inter body type are self-hosted.
- Near-monochrome UI lets semantic status colors carry meaning.
- Full-width, left-aligned layout; avoid narrow centered stacks and unnecessary
  boxed panels.
- SVG icons instead of emoji.
- Reduced motion is respected at OS and in-app levels; hidden reveal content has a
  fail-visible watchdog.

Do not preserve old visual iteration numbers in docs. The current CSS is the source
of truth; durable CSS failures are archived separately.

## Documentation policy

Keep documents current-state-oriented:

- Completed implementation briefs belong in git history, not the working tree.
- `ROADMAP.md` lists only active/rejected work, not every completed phase.
- Durable mistakes and rationale go in `ARCHIVAL_KNOWLEDGE_BASE.md` once, then are
  linked rather than copied.
- Avoid exact counts that silently become stale unless a test generates them.
- Never put owner PII or private medical context in handoff documentation.
