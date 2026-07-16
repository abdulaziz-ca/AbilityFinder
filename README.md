# AbilityFinder

AbilityFinder is a free, privacy-first web app that helps disabled Albertans and
their families find federal, provincial, and municipal benefits. It provides a
short limitation-based questionnaire, estimated value and priority guidance, and
plain-English application guides linked to official sources.

**Live:** https://abilityfinder.ca

## What it includes

- Adaptive eligibility wizard for self, child, or family searches.
- Ready / one-step-away / not-a-match explanations.
- Estimated values, application effort, wait information, and priority ordering.
- Detailed guides with steps, documents, practitioner help, denials, appeals, and
  official application/source links.
- Progress tracking, printable reports, calendar reminders, and browse/search.
- Non-monetary supports and organizations that help with forms or appeals.
- Accessibility controls, dark/light themes, reduced motion, and read-aloud.
- Optional grounded assistant and feedback form.

Eligibility is based on functional limitations and official program rules—not a
universal list of qualifying diagnoses.

## Privacy

Wizard answers and approved UI preferences stay in the browser's IndexedDB. There
are no accounts or analytics. Postal/geolocation input, assistant history, and
feedback text are not persisted.

Two opt-in actions contact the Worker:

- `/api/ask` receives the typed assistant question and recent assistant context.
- `/api/feedback` receives the submitted feedback form.

Clearing site data or the browser profile removes local progress.

## Run locally

```sh
npm install
npm run dev
```

Wrangler serves the Worker and static assets. For static-only viewing, run
`python3 serve.py` and open http://localhost:8731.

## Test

```sh
npm test
npm run test:e2e
npx wrangler deploy --dry-run
```

After changing benefits or practitioner forms:

```sh
npm run gen:context
```

This regenerates assistant grounding and the link-monitor list. Do not hand-edit
`src/benefits-context.js` or `src/links.js`.

## Project layout

```text
public/       deployed vanilla HTML/CSS/JS and benefit data
src/          Cloudflare Worker APIs and link monitor
scripts/      generated-context tooling
test/         Node unit/privacy tests
e2e/          Playwright browser tests
```

Key files:

- `public/data.js` — catalog and official sources.
- `public/app.js` — wizard, eligibility, routing, and rendering.
- `public/dbManager.js` — raw IndexedDB operations.
- `public/stateManager.js` — persistence allowlist and validation.
- `src/index.js` — assistant, feedback, link-health APIs.
- `wrangler.jsonc` — Cloudflare bindings, assets, cron, and rate limits.

## Documentation for maintainers and AI agents

Start with `AGENTS.md`; it is intentionally compact and contains the mandatory
rules. Load other files only when needed:

- `HANDOFF.md` — technical architecture and change workflows.
- `DEPLOY.md` — Cloudflare operations and zero-spend safeguards.
- `ROADMAP.md` — active priorities and rejected features.
- `ARCHIVAL_KNOWLEDGE_BASE.md` — durable mistakes and design decisions.

Completed briefs and milestone diaries are kept in git history rather than active
documentation so future agents receive current, high-signal context.

## Contributing data

Never add a benefit fact from memory or from another municipality's pattern.
Verify amounts, cutoffs, forms, rules, phone numbers, and timelines on the current
official page; keep the source URL in the catalog; regenerate context; and run the
full tests. A confidently wrong benefits directory is worse than an incomplete one.
