# AbilityFinder — AI entry point

Read this file first, then `REMAINING-WORK.md`. Load anything else only when the
task needs it:

- **`REMAINING-WORK.md` — what is done, what is left, and what must not be
  "fixed". Always read this second. It is the working record.**
- `HANDOFF.md` — current architecture, data model, and change workflows.
- `DEPLOY.md` — Cloudflare bindings, zero-spend constraints, and release checks.
- `ROADMAP.md` — active priorities and deliberately rejected features.
- `ARCHIVAL_KNOWLEDGE_BASE.md` — failures and decisions that must not be re-learned.
- `PROVINCE-EXPANSION-CHECKLIST.md` — the bar an additional province must clear.
  Read only when adding one.
- `README.md` — short public/project overview.
- `archive/` — superseded handoffs, kept for history. Do not read unless digging
  into why an old decision was made.

**Never load `AUDIT_REPORT_2026-07-22.md` whole — it is 120 KB and will eat the
context window.** `REMAINING-WORK.md` already carries the status of every finding.
Grep the audit for a specific ID (e.g. `grep -n "DATA-46" AUDIT_REPORT_2026-07-22.md`)
only when you need the original evidence for that one finding. The same applies to
`AUDIT_EVIDENCE_2026-07-22/`, which is 1.7 MB.

Treat the audit as a lead, not an authority: three of its findings have been
disproved against primary sources. Re-verify against the current official page
before changing anything.

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

`git push origin main` **starts** the GitHub Actions deployment workflow. It releases
only when the suite is green — the `deploy` job has `needs: test` — *and* the
`CLOUDFLARE_API_TOKEN` secret is present; without the token the job warns, exits 0 and
deploys nothing, so a green run is not by itself proof that a release happened. Confirm
against the live site (see `DEPLOY.md`, "Post-deploy verification"). `npx wrangler
deploy` bypasses this gate entirely and is the documented recovery path. Workers Builds'
git integration was disconnected on 2026-07-28, which is Cloudflare dashboard state no
file here can assert; if it were ever reconnected, pushes would deploy regardless of
tests. Do not commit, push, or deploy unless the user asks.

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

### Coverage-gap proposals

Before recording anywhere — a ticket, `ROADMAP.md`, a research note — that the
catalogue is **missing** a program, run both searches below and put their results in
the proposal. **A gap proposal without both searches and their output is not
accepted.** "I looked" is not a search result.

1. **By record id.** Try the id you would assign, plus obvious variants:

   ```sh
   grep -rn '"bc-pharmacare-plan-x"' public/data.js public/grants-data.js public/orgs-data.js
   ```

2. **By keyword.** Search the program name, the body you believe administers it, and
   the plain-language term a user would use. A record often exists under a different id
   than the one you would have chosen, which is exactly how these get missed:

   ```sh
   grep -rin 'pharmacare\|plan x\|ministry of health\|deductible' public/data.js public/grants-data.js public/orgs-data.js
   ```

   All three categories go in the proposal, each with its own result. In the example
   above `pharmacare` and `deductible` match while `plan x` and `ministry of health`
   return nothing — **a category that matches nothing is a result, not a search you
   can leave out.** Copying only the terms you expect to hit reproduces the miss this
   section exists to prevent.

3. **Record both**, including a genuine `no match` — that is the result, not the
   absence of one. State the commands, the terms, and the output.

A match does not automatically mean there is no gap: the record may be present but
wrong, incomplete, or gated so it never surfaces. It does mean the proposal must
describe **that record** rather than claim absence.

*Why this is required rather than advised.* ROADMAP records two BC PharmaCare
entries as "the **fourth and fifth** gap entries written from a hub sweep without
first reading the record that already covered it" — both were already in the
catalogue, one of them complete with `requiresNote`, `detail`, `applyUrl` and
`source`. And on 2026-08-16 a ticket asked to "re-check Camrose", which a record-id
search answered in one command: in `public/data.js` Camrose appears **only** inside
the `ALBERTA_CITIES` dropdown, so there is **no Camrose municipal benefit record**.
That single search turned a re-check into a coverage question and produced a
different, correct outcome — an organisation entry rather than an invented municipal
benefit.

That entry has since been **removed** (2026-08-17, owner decision, #192): the
organisation had no working site of its own, so its listing pointed at a municipal
page, and this directory publishes "must have a verifiable official website" to
users. Searching all three files today therefore returns **no Camrose record of any
kind** — and that is still the point, not a contradiction. The searches distinguish
**"no benefit record"** from **"no coverage at all"**, and a proposal has to say
which it means. Here the honest answer turned out to be the second, which is a
finding worth stating plainly rather than papering over with a listing that broke a
published rule. The search is cheap; the research it prevents is not.

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
