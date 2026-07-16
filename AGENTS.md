# AbilityFinder — AI entry point

Read this file first. Load deeper docs only when the task needs them:

- `HANDOFF.md` — current architecture, data model, and change workflows.
- `DEPLOY.md` — Cloudflare bindings, zero-spend constraints, and release checks.
- `ROADMAP.md` — active priorities and deliberately rejected features.
- `ARCHIVAL_KNOWLEDGE_BASE.md` — failures and decisions that must not be re-learned.
- `README.md` — short public/project overview.

Do not load every document by default. The source code is authoritative when a
document and implementation disagree.

## Product and stakes

AbilityFinder helps disabled Albertans and their families find federal, provincial,
and municipal benefits, then gives them plain-English application guides.

A wrong amount, rule, form, phone number, or deadline can cost someone money or a
scarce appointment. Optimize in this order: **accuracy, usefulness, presentation**.
Users may be tired, in pain, short on money, or experiencing cognitive fatigue.
Keep journeys forgiving and copy concrete.

## Non-negotiable rules

1. **Never invent benefit facts.** Verify every amount, cutoff, eligibility rule,
   form, phone number, date, and municipal detail on an official source before
   changing `public/data.js`. Every benefit must retain its `source`.
2. **Zero spend.** Production stays on Cloudflare Workers Free. Workers AI has no
   overage billing on that plan; requests fail after the free allocation. Read
   `DEPLOY.md` before changing plans, bindings, or model usage.
3. **Privacy is part of the product.** No accounts, analytics, or remote storage of
   wizard answers. The two opt-in submissions of user-entered content to our Worker
   are `/api/ask` and `/api/feedback`. Update the privacy page in the same change if
   that boundary moves.
4. **Eligibility is about functional limitation, not diagnosis.** Never imply that
   a diagnosis alone guarantees a benefit or that there is a universal list of
   qualifying disabilities.
5. **Never allow a blank page.** Every route renders through `renderSafely()` and
   motion effects fail visible.

## Current architecture

```text
public/                    only deployed static directory
  data.js                  benefits, values, metadata, guides, sources
  app.js                   state, wizard, eligibility, router, rendering
  dbManager.js             all raw IndexedDB operations and legacy import
  stateManager.js          persisted-state allowlist and validation
  styles.css               single design system; no build step
src/index.js               Worker APIs and static-asset fallthrough
src/link-check.js          rotating link-health monitor
src/benefits-context.js    generated AI grounding; never hand-edit
src/links.js               generated monitor link list; never hand-edit
scripts/gen-benefits-context.js
wrangler.jsonc             Worker, assets, AI, email, KV, rate limit, cron
```

Root documentation is not deployed. Never move it into `public/`.

## Commands

```sh
npm install                 # dependencies
npm run dev                 # Worker + static assets locally
npm run gen:context         # after BENEFITS, HELP_ORGS, or PRACTITIONER_FORMS changes
npm test                    # Node unit and persistence-boundary tests
npm run test:e2e            # Playwright browser journeys
npx wrangler deploy --dry-run
npx wrangler deploy
```

`git push origin main` also deploys through Workers Builds. Do not commit, push, or
deploy unless the user asks.

When a browser-loaded CSS, JavaScript, font, or icon asset changes, bump the shared
`?v=N` references in `public/index.html`; update matching font URLs in
`public/styles.css` when needed.

## Required workflow by change type

### Benefit or guide data

1. Read the official page that day; do not extrapolate from another program/city.
2. Edit `BENEFITS`, `HELP_ORGS`, or `PRACTITIONER_FORMS` in `public/data.js` and
   keep each official source URL.
3. Run `npm run gen:context`.
4. Review generated diffs in `src/benefits-context.js` and `src/links.js`.
5. Run unit and browser tests. Check the real user path, not only the changed object.

Never hand-copy municipal rules. Programs that look similar have materially
different AISH exclusions, transit prices, and recreation coverage.

### Shared UI, routing, or CSS

- Exercise every route for `self`, `child`, and `family`; persisted broken routes
  can otherwise reload into a permanent blank screen.
- Check dark, light, and high-contrast modes with a fresh reload per theme.
- Respect both `prefers-reduced-motion` and `.a11y-nomotion`.
- Keep assistant output on `textContent`; never render model output as HTML.
- Do not add `aria-live` to the streaming chat log. Announce only the final answer
  through `#askLive`.
- Base CSS rules must precede equal-specificity media-query overrides. Any class
  that sets `display` needs an explicit `[hidden] { display:none }` rule.

### Persistence

- Raw IndexedDB calls stay in `public/dbManager.js`.
- The allowlist and catalog-backed validation stay in `public/stateManager.js`.
- Never persist postal text, feedback, assistant history, DOM state, or arbitrary
  runtime objects.
- Restore must complete before the first meaningful render.
- Preserve optimistic record revisions and metadata-only tombstones: they stop a
  stale tab from overwriting or resurrecting cleared answers.
- Legacy `abilityfinder.*` localStorage values must pass through the current
  allowlist before migration. Remove them only after a successful sanitized write,
  or when an authoritative IndexedDB snapshot or tombstone already exists.

### Assistant or Worker APIs

The free model is intentionally narrow and grounded. It must not state dollar
figures or eligibility verdicts. Figures are redacted from generated grounding.
Do not widen its role without a demonstrably stronger model and a new safety review.
Workers AI can emit numeric streaming tokens as numbers; do not replace explicit
null/undefined checks with truthiness checks.

## Accessibility and privacy gates

- Automated axe results do not replace screen-reader, keyboard-only, 200–400%
  zoom/reflow, motion, and cognitive-usability testing with real people.
- Contrast must clear 4.5:1 on every background, including semantic soft tints.
- The assistant and feedback form are opt-in server requests. Nonsensitive
  `browseQuery` text may persist locally, and practitioner searches put postal or
  coordinate text in a user-initiated Google Maps URL. Never put sensitive wizard
  or profile data in URLs or persist unapproved free text.
- Cloudflare may inject Browser Insights/challenge scripts at the edge; the strict
  CSP blocks them. Do not weaken CSP to allow analytics. Disable injection in the
  Cloudflare dashboard instead if console noise needs removal.

## Current priorities

The major feature phases are complete. The main risk is **data decay**, not feature
count. In order:

1. Act on `/api/link-health` and re-verify stale figures against official sources.
2. Conduct real disabled-user accessibility/usability testing.
3. Add AISH/ADAP signer guidance only when Alberta publishes an official list.
4. Expand municipalities/provinces only with program-by-program official research.

Do not casually add accounts/sync, email or SMS reminders, community reviews, an
admin CMS, or a free-text disability-to-benefit matcher. Reasons and safer
alternatives are in `ROADMAP.md`.

For detailed incidents—including hallucinated AISH facts, blank-page persistence,
soft 404s, CSS ordering, accessibility contrast, link-monitor false alarms,
calendar folding, and IndexedDB cross-tab races—read
`ARCHIVAL_KNOWLEDGE_BASE.md`.
