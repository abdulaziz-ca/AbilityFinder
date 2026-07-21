# British Columbia expansion — working handoff

Active work as of 2026-07-21. Delete this file when BC is live and the notes below
have been folded into `HANDOFF.md` / `ROADMAP.md`.

## Status in one line

17 BC programs are merged into `public/data.js` and **completely hidden** behind
`BC_ENABLED = false` in `public/app.js`. BC is **not launchable yet** only because
~34 programs remain unverified; the blocking bug is cleared.

## Launch decisions already made (owner)

- BC is the first province after Alberta.
- Launch bar is **full Alberta depth**: provincial + federal + municipal coverage for
  the biggest cities. No shallow launches (that is the competitor's weakness).
- Alberta ships as-is meanwhile. Real assistive-technology user testing and the French
  catalog stay open but do not block province work.

## RESOLVED — no Alberta leak (verified 2026-07-21)

The hardened Playwright gate is permanently stored at `e2e/bc-dryrun.spec.js`. Do not
delete it. Re-run it at any time with:

`npx playwright test e2e/bc-dryrun.spec.js`

The gate enables BC without editing source files: `page.route` intercepts the `app.js`
response and rewrites `const BC_ENABLED = false;` to `const BC_ENABLED = true;`. It
hard-fails if that exact string is absent. The old flip-the-flag, run, revert, and delete
the spec ritual is obsolete.

All 4 tests pass: a BC adult in Vancouver, a BC child persona, a BC resident in an
unlisted city, and the BC-enabled browse view. Persona checks expand the not-a-match
disclosure and inspect every `.benefit` card in the DOM, not only visible cards. Zero
Alberta programs appear, visible or hidden, for every persona.

The original blocker was a false alarm. All 10 Alberta provincial entries in
`public/data.js` already carry `"ab"` in `requires`, and municipal entries are gated by
their city key. The earlier reported leak was almost certainly the browse view. With BC
enabled, browse intentionally lists the full Alberta and BC catalog; the gate now
asserts that behaviour explicitly instead of treating it as a leak.

The pre-launch province-gate audit was completed: Alberta provincial entries have the
`"ab"` gate, municipal entries have city gates, and federal entries have no province
key.

## Verification standard (do not lower it)

Every fact must be confirmed on an official page before it reaches users. Amounts in BC
usually live in the **BCEA rate tables**, not on program pages — cite the rate table as
`source` when quoting a figure:

- Disability Assistance Rate Table
- Health Supplements and Programs Rate Table
- General Supplements and Programs Rate Table

## What is verified and merged (17 entries)

Batch 1 — `bc-disability-assistance-pwd`, `bc-autism-funding-under-6`,
`bc-autism-funding-6-18`, `bc-cy-disability-benefit`, `bc-monthly-nutritional-supplement`,
`bc-optical-supplement`, `bc-bus-pass`, `sparc-parking-permit`,
`bc-medical-equipment-devices`.

Batch 2 — `bc-at-home-saet`, `bc-clbc`, `bc-csg-students-disabilities`,
`bc-csg-services-equipment`, `bc-dental-supplement`, `bc-home-reno-tax-credit`,
`bc-work-able-internship`, `bc-workbc-assistive-technology`.

### Facts confirmed against official sources

- PWD disability assistance: `$983.50` support + `$500` shelter = **$1,483.50/month**
  for a single person, plus the `$52`/month transportation supplement.
- Autism funding: **$22,000/year** under 6, **$6,000/year** ages 6–18.
- Monthly Nutritional Supplement: up to **$180**/month dietary + **$45**/month
  vitamins or minerals.

### Corrections already applied (research had these wrong)

- Bus pass costs **$45/year**; it is *not* a straight swap for the $52 transportation
  supplement. Entry now tells people to confirm the interaction.
- SPARC parking permit: the **$31 fee claim was removed** — it is not on SPARC's page.
  Permit validity (3 years permanent, 1–12 months temporary) is confirmed.
- Optical: **$44.83** with an optometrist, **$48.90** with an ophthalmologist. The
  research had conflated these into one figure.

### Time-sensitive BC transition — keep these in sync

BC is mid-restructure of children's disability programs:

- Autism Funding **ends 2027-03-31**; new applications accepted until March 2027.
- The **Children and Youth Disability Benefit** ($6,500 or $17,000/year) started
  2026-04-01 for families already receiving ministry services (they do not reapply),
  province-wide by 2027-04-01.
- The Canada Student Grant figure of `$2,800` is a **temporary increase until
  2027-07-31** — re-check before that date.

Both autism entries already carry the replacement notice. Re-verify this cluster before
launch and again after 2027-04-01.

## Remaining work

1. **Verify ~34 remaining candidates**, then merge. Raw research for all 51 candidates
   is at `test-results/bc-research.json` (gitignored; master copy lives in the session
   scratchpad — **`test-results/` is wiped by every e2e run**, so never stage handoff
   data there). Unverified groups: PWD designation process, At Home medical/respite,
   Healthy Kids, PharmaCare (Fair + Plan C), medical transportation and equipment
   supplements, WorkBC employment services, five StudentAid BC grants/bursaries, sales
   tax credit, fuel tax refund, ICBC discount, property tax deferment, TransLink
   (HandyDART / HandyCard / TaxiSaver), BC Transit (handyDART / Taxi Saver), and eight
   municipal recreation programs (Vancouver, Surrey, Burnaby, Richmond, Victoria,
   Saanich, Kelowna, Coquitlam, Kamloops).
2. **Launch sequence** once item 1 is done:
   - Run the BC gate: `npx playwright test e2e/bc-dryrun.spec.js` — 4 tests must pass.
   - Flip `BC_ENABLED = true` in `public/app.js`.
   - Update the static scope strings marked with `SCOPE:` comments in
     `public/index.html`, `public/embed.html`, and `scripts/gen-guide-pages.js`
     (see the Province launch checklist in `DEPLOY.md`).
   - `npm run gen:context` (assistant grounding) and `npm run gen:guides` (SEO pages
     and sitemap) — both currently Alberta-only by design.
   - Add BC cities to whatever the impact page counts as covered municipalities.
   - `npm test`, `npm run test:e2e`, `npx wrangler deploy --dry-run`, then push.
   - Confirm live by content marker, not by HTTP status.

## Machinery notes (saves rediscovery)

- The BC gate patches the flag over the network, so BC can be tested without editing
  source files or creating a dirty working tree.
- Running any e2e suite **wipes `test-results/`**. Never keep handoff data there.
- `browseCatalog()` in `public/app.js` filters BC entries out of the browse view while
  the flag is off. Without it, hidden BC entries leaked into Alberta's browse list —
  check it still holds after any browse change.
- `SCOPE_LABEL` / `SCOPE_LABEL_LONG` centralize province wording for JS-rendered copy.
- `test/privacy-contract.test.js` forbids the pattern `Phase <digit>` in `data.js`.
  Reword government "phase" language.
- The GPT build worker cannot run shell commands, cannot delete files, and has **no web
  access** — all fact verification must be done by the orchestrator, not the worker.
- Link monitoring covers the directory URLs too (74 monitored links); regenerate with
  `npm run gen:context` after any directory or catalog change.

## Unrelated standing item

The Cloudflare API token `tight-boat-341e` still has account-wide permissions and was
exposed in a screenshot. Delete it and create a scoped replacement (Account → Web
Analytics: Edit, Zone → Zone: Read).
