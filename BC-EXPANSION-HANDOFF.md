# British Columbia expansion — working handoff

Active work as of 2026-07-21. Delete this file when BC is live and the notes below
have been folded into `HANDOFF.md` / `ROADMAP.md`.

## Status in one line

27 BC programs are merged into `public/data.js` and **completely hidden** behind
`BC_ENABLED = false` in `public/app.js`. BC is **not launchable yet** only because
~24 programs remain unverified; the blocking bug is cleared.

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

## What is verified and merged (27 entries)

Batch 1 — `bc-disability-assistance-pwd`, `bc-autism-funding-under-6`,
`bc-autism-funding-6-18`, `bc-cy-disability-benefit`, `bc-monthly-nutritional-supplement`,
`bc-optical-supplement`, `bc-bus-pass`, `sparc-parking-permit`,
`bc-medical-equipment-devices`.

Batch 2 — `bc-at-home-saet`, `bc-clbc`, `bc-csg-students-disabilities`,
`bc-csg-services-equipment`, `bc-dental-supplement`, `bc-home-reno-tax-credit`,
`bc-work-able-internship`, `bc-workbc-assistive-technology`.

Batch 3 — `bc-pwd-designation`, `bc-fair-pharmacare`, `bc-pharmacare-plan-c`,
`bc-healthy-kids`, `bc-medical-transportation`, `handydart-translink`,
`handycard-translink`, `taxisaver-translink`, `handydart-bctransit`,
`taxi-saver-bctransit`.

### Facts confirmed against official sources

- PWD disability assistance: `$983.50` support + `$500` shelter = **$1,483.50/month**
  for a single person, plus the `$52`/month transportation supplement.
- Autism funding: **$22,000/year** under 6, **$6,000/year** ages 6–18.
- Monthly Nutritional Supplement: up to **$180**/month dietary + **$45**/month
  vitamins or minerals.
- Fair PharmaCare: family net income of **$13,750 or less** means no deductible and no
  family maximum, so PharmaCare pays 100 percent from the first prescription. Up to
  **$30,000** there is still no deductible, with a family maximum of **$100–$800**. The
  deductible starts at **$650** just above $30,000. After the deductible, PharmaCare pays
  70 percent, or 75 percent if a family member was born before 1940. Source: the Fair
  PharmaCare assistance levels table.
- Medical transportation: **$0.36 per kilometre** and **$8 per meal**, from the Health
  Supplements and Programs Rate Table effective 2023-08-01. The same table reconfirms
  the Monthly Nutritional Supplement figures of **$180** dietary and **$45** vitamins,
  and the optical figures of **$44.83** for an optometrist and **$48.90** for an
  ophthalmologist.
- Healthy Kids: up to **$2,000** in basic dental services every two years, prescription
  glasses once a year, and hearing instruments. Eligibility is gated by MSP supplementary
  benefits, which require adjusted net income under **$42,000**.
- TransLink 1-Zone fares current as of 2026-07-01: **$2.85** adult and **$2.30**
  concession on Compass stored value, and **$3.50** adult cash. TransLink normally
  changes fares each July 1, so re-check after 2027-07-01.

### Corrections already applied (research had these wrong)

- Bus pass costs **$45/year**; it is *not* a straight swap for the $52 transportation
  supplement. Entry now tells people to confirm the interaction.
- SPARC parking permit: the **$31 fee claim was removed** — it is not on SPARC's page.
  Permit validity (3 years permanent, 1–12 months temporary) is confirmed.
- Optical: **$44.83** with an optometrist, **$48.90** with an ophthalmologist. The
  research had conflated these into one figure.

### Corrections applied in batch 3

- Medical transportation meals: the **$8** meal rate is not a standard entitlement.
  Policy says meal allowances are normally not provided and may be issued only in
  exceptional circumstances. The entry says so.
- Medical transportation pre-approval: the earlier "after-the-fact requests are routinely
  refused" framing was too strong. Policy allows a request after travel in exceptional
  circumstances where funding could not be obtained beforehand.
- Plan C: devices and supplies are exempt from PharmaCare's Full Payment Policy, so a
  pharmacy or device provider may charge above the maximum eligible cost even though
  drugs and dispensing fees cannot be charged. This caveat is now in the entry.
- Plan C covers more groups than income and disability assistance: it also covers children
  and youth in the care of MCFD or of an Indigenous Governing Body, and people who
  arrived through the Canada-Ukraine authorization for emergency travel.
- TransLink HandyDART: two unsupported claims were dropped — that attendants ride free
  on HandyDART itself, and that a professional must sign a verification section. Neither
  is on TransLink's page. Attendant-free travel is confirmed for HandyCard holders on
  buses, SkyTrain, SeaBus, and West Coast Express.
- BC Transit handyDART: the claim that DayPASS, ticket books, and monthly passes work on
  both handyDART and fixed-route buses was dropped, as was the specific Victoria fare
  figure. Neither is stated on BC Transit's page.
- BC Transit Taxi Saver: the **$40 for $80** package and one-per-month limit are confirmed
  for the Victoria region only. The earlier list of other participating regions was
  dropped as unverified.
- PWD designation: no earnings-exemption dollar figure was included because it was not
  verified.

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

1. **Verify ~24 remaining candidates**, then merge. The raw research file is gitignored,
   and **`test-results/` is wiped by every e2e run**, so the master copy of
   `bc-research.json` now lives only in the session scratchpad. Unverified groups: At Home
   Program medical and respite benefits, WorkBC employment services, five StudentAid BC
   grants and bursaries, sales tax credit, fuel tax refund, ICBC discount, property tax
   deferment, and eight municipal recreation programs. The At Home Program entries were
   deliberately deferred because the program is mid-restructure and its transition dates
   need to be re-checked alongside the autism and Children and Youth Disability Benefit
   cluster.
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
