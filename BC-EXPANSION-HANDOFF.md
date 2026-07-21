# British Columbia expansion — working handoff

Active work as of 2026-07-21. Delete this file when BC is live and the notes below
have been folded into `HANDOFF.md` / `ROADMAP.md`.

## Status in one line

17 BC programs are merged into `public/data.js` and **completely hidden** behind
`BC_ENABLED = false` in `public/app.js`. BC is **not launchable yet** — one blocking
bug plus ~34 unverified programs remain.

## Launch decisions already made (owner)

- BC is the first province after Alberta.
- Launch bar is **full Alberta depth**: provincial + federal + municipal coverage for
  the biggest cities. No shallow launches (that is the competitor's weakness).
- Alberta ships as-is meanwhile. Real assistive-technology user testing and the French
  catalog stay open but do not block province work.

## BLOCKER — Alberta programs leak into BC results

A temporary dry-run (flag flipped on locally, Playwright walking the wizard as a BC
resident in Vancouver) reached results with BC programs present, but **Alberta programs
appeared too**: the assertion `albertaLeak === false` failed on names matching
`/AISH|Alberta Adult Health|AADL/i`.

Most likely cause: the catalog was written while the app was Alberta-only, so some
Alberta entries never needed an explicit province requirement and therefore do not
carry `"ab"` in their `requires` array. With BC selectable, anything lacking a province
gate matches every province.

Fix before launch:
1. Audit every non-federal entry in `public/data.js` — each provincial/municipal entry
   must carry its province key (`"ab"` or `"bc"`) in `requires`.
2. Federal entries must carry no province key.
3. Re-run the dry-run (below) until `albertaLeak` is false and `bcMatched` is true.

The dry-run spec was deliberately deleted after use. Recreate it by asking the worker
for: a Playwright spec in `e2e/` that clears storage, walks the wizard as self / adult /
British Columbia / Vancouver, then asserts no `.render-error`, at least 5 result cards,
at least one BC program, and zero Alberta programs — plus the same checks on the browse
view. Run it with `BC_ENABLED = true`, then revert the flag and delete the spec.

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

1. **Fix the Alberta leak** (above). Blocking.
2. **Verify ~34 remaining candidates**, then merge. Raw research for all 51 candidates
   is at `test-results/bc-research.json` (gitignored; master copy lives in the session
   scratchpad — **`test-results/` is wiped by every e2e run**, so never stage handoff
   data there). Unverified groups: PWD designation process, At Home medical/respite,
   Healthy Kids, PharmaCare (Fair + Plan C), medical transportation and equipment
   supplements, WorkBC employment services, five StudentAid BC grants/bursaries, sales
   tax credit, fuel tax refund, ICBC discount, property tax deferment, TransLink
   (HandyDART / HandyCard / TaxiSaver), BC Transit (handyDART / Taxi Saver), and eight
   municipal recreation programs (Vancouver, Surrey, Burnaby, Richmond, Victoria,
   Saanich, Kelowna, Coquitlam, Kamloops).
3. **Launch sequence** once 1 and 2 are done:
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
