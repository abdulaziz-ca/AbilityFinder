# British Columbia expansion — working handoff

Active work as of 2026-07-21. Delete this file when BC is live and the notes below
have been folded into `HANDOFF.md` / `ROADMAP.md`.

## Status in one line

All 51 researched BC candidates are resolved. 48 entries are merged into
`public/data.js` and **completely hidden** behind `BC_ENABLED = false` in
`public/app.js`. BC is no longer blocked by research. What remains is the launch
sequence itself, which is an owner decision.

## Launch decisions already made (owner)

- BC is the first province after Alberta.
- Launch bar is **full Alberta depth**: provincial + federal + municipal coverage for
  the biggest cities. No shallow launches (that is the competitor's weakness).
- Alberta ships as-is meanwhile. Real assistive-technology user testing and the French
  catalog stay open but do not block province work.

## RESOLVED — no Alberta leak (verified 2026-07-21)

The hardened Playwright gate is stored at `e2e/bc-dryrun.spec.js` for pre-launch use.
Run it while `BC_ENABLED` is still `false` with:

`npx playwright test e2e/bc-dryrun.spec.js`

The gate enables BC without editing source files: `page.route` intercepts the `app.js`
response and rewrites `const BC_ENABLED = false;` to `const BC_ENABLED = true;`. It
hard-fails if that exact string is absent. That refusal to run vacuously is intentional.
Delete the gate in the same commit that permanently flips the flag to `true`.

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

## What is verified and merged (48 entries)

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

Batch 4 — `bc-at-home-medical`, `bc-supported-child-development`.

Batch 5 (verified and merged 2026-07-21) — `bc-access-grant-students-disabilities`,
`bc-supplemental-bursary-students-disabilities`,
`bc-assistance-program-students-disabilities`,
`bc-learning-disability-assessment-bursary`, `bc-access-grant-deaf-students`.

Batch 6 (verified and merged 2026-07-21) — `bc-workbc-employment-services`,
`bc-fuel-tax-refund-disabilities`, `bc-icbc-disability-discount`,
`bc-property-tax-deferment-disabilities`, `bc-sales-tax-credit`.

Batch 7 was split into two commits:

- Batch 7a — `vancouver-leisure-access`, `surrey-leisure-access`,
  `burnaby-fair-play`, `richmond-rec-fee-subsidy`.
- Batch 7b — `victoria-life`, `saanich-life`, `kelowna-recreation-assistance`,
  `coquitlam-far`, `kamloops-arch`.

### Municipal gating (new machinery, batch 7a)

Nine BC city requirement keys were added to the `REQUIREMENTS` map in
`public/app.js`, matching the existing Alberta city-gate pattern: `vancouver`,
`surrey`, `burnaby`, `richmondbc`, `victoria`, `saanich`, `kelowna`, `coquitlam`,
and `kamloops`. The Richmond key is deliberately named `richmondbc` to avoid any
collision.

Every municipal entry carries both `"bc"` and its city key in `requires`, and its
`level` is the exact city name from `BC_CITIES`. Both matter: `benefitProvince()`
keys off `"bc"`, and the `BC_ENABLED` generator filter keys off `level`.

VERIFIED WORKING: the BC gate run shows a BC adult in Vancouver sees exactly one
municipal program, Vancouver Leisure Access, and none of the other eight cities.

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
- At Home Program Medical Benefits figures below come from the official **At Home
  Program Guide dated October 2025**, a PDF. These figures are not on the program web
  pages.
- At Home Program Medical Benefits equipment limits: wheelchair seating system up to
  **$9,000**; basic manual wheelchair **$4,000**; basic scooter up to **$3,700**;
  electric hospital bed up to **$4,000**; floor or ceiling lift up to **$8,000**,
  including two slings and installation; alternate positioning devices up to **$5,000**;
  floor therapy mat **$500 lifetime**; step stools **$200**; and audiology equipment up
  to **$8,000** for all devices combined per three-year period.
- At Home Program therapies: **$5,760 per twelve months for each** of occupational
  therapy, physiotherapy, and speech-language pathology, at **$160 per hour** for a
  therapist and **$60 per hour** for an assistant. Chiropractic or massage is limited
  to **$1,920 per twelve months**.
- At Home Program dental and optical limits: **$700 per year** for restorative dental,
  **$5,000 lifetime** for orthodontics, and **$150 per year** for optical. All three
  require pre-approval and must be purchased within six months of approval. Routine
  dental is not eligible.
- At Home Program medical travel requires pre-approval and is available only when the
  service is unavailable in the home community and the round trip exceeds 80 km. Car
  travel is reimbursed at **$0.63 per km**; accommodation is limited to **$150 per
  night**, plus **$15 per night** for hotel parking. Meals are not reimbursed. Claims
  more than six months old are refused.
- At Home Program eligibility: age 17 or younger; a BC resident enrolled in MSP; living
  at home with a parent or guardian or with an Extended Family Program caregiver; and
  assessed as dependent in at least three of four activities of daily living. Benefits
  and Plan F end on the last day of the month the youth turns 18. New families can apply
  until March 2027.
- B.C. Access Grant for Students with Disabilities: up to **$1,560 per program year**,
  which is **$30 per week of study**. It is full-time only and non-repayable. It replaces
  B.C. student loan funding rather than adding to it.
- B.C. Supplemental Bursary: **$800 per program year** for full-time study at a course
  load of 40 percent or more, or **$400** for part-time study at 20 to 39 percent. It is
  non-repayable.
- B.C. Assistance Program for Students with Disabilities: up to **$10,000**, or
  **$12,000** if an attendant is required at school, for exceptional education-related
  services and adaptive equipment.
- Learning Disability Assessment Bursary: up to **$3,500** for the up-front cost of the
  assessment.
- Fuel Tax Refund for Persons with Disabilities: up to **$500 per calendar year** for a
  qualifying registered vehicle, plus a **25 percent discount** off ICBC basic Autoplan
  insurance, including for electric vehicles. The person must register with the Ministry
  of Finance and be confirmed before claiming a refund.
- B.C. Sales Tax Credit: up to **$75** for the claimant and **$75** for a cohabiting spouse
  or common-law partner. It is reduced by 2 percent of net income over **$15,000** for a
  single person, or 2 percent of family net income over **$18,000** for couples. It is a
  refundable credit claimed on the T1 return using form BC479, within three years of the
  end of the tax year.
- Property Tax Deferment: qualification is through the PWD designation under the
  Employment and Assistance for Persons with Disabilities Act. The owner must maintain
  minimum equity of 25 percent of the assessed value, so charges plus deferred taxes
  cannot exceed 75 percent of the BC Assessment value. The fees are a **$60 application
  fee** and a **$10 annual renewal fee**, with no interest charged on those fees.
- WorkBC Employment Services is free and includes academic upgrading, sector-specific
  training, work experience placements and wage subsidies lasting from a few weeks up to
  12 months, equipment and devices that reduce work-related barriers, transportation
  supports, and dependent care supports. For clients with disabilities, the job-search
  service includes working with employers to carve or customize jobs.

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

### Corrections applied in batch 4

- **The At Home Program has no respite benefit.** The researched candidate
  `bc-at-home-respite` was dropped, not merged. In the entire 33-page official guide,
  the only mention of respite is an exclusion: children receiving in-home respite care
  through Nursing Support Services are not eligible. Do not re-add this candidate in a
  future pass.
- Because of that, the Children and Youth Disability Benefit entry was corrected. It
  previously said the new benefit replaces "Autism Funding and At Home respite/SAET
  streams." Only the School-Aged Extended Therapies stream transitions. At Home Medical
  Benefits remain and are not being replaced. The entry summary, steps, and tips were
  updated to match.
- The research claim of a **$9,000** wheelchair figure was right but nearly got
  mis-corrected. **$9,000** is the wheelchair seating system limit, while a basic manual
  wheelchair is **$4,000**. They are different lines in the guide.
- `bc-supported-child-development` was merged deliberately thin. The government page
  does not state an age range, say the program is free, mention extra staffing, or state
  whether a diagnosis is required. None of those claims are in the entry. The research
  had asserted that it was free with extra staffing. If a future pass finds an official
  page stating those facts, the entry can be enriched.

### Corrections and constraints found in batch 5

- **The B.C. Access Grant for Deaf Students is not general funding for deaf students in
  B.C.** The only eligible schools are Gallaudet University in Washington, D.C. and the
  National Technical Institute for the Deaf in Rochester, New York. It also requires a
  full-time course load of 60 percent or more, verified disability status, and
  demonstrated financial need. No dollar amount is published, so the entry states none.
  The research had described it as general grant funding based on assessed need, which
  would have badly misled users.
- Institution type varies per program and the research captured none of it. The Access
  Grant and the Supplemental Bursary are for B.C. public post-secondary institutions
  only. The Assistance Program covers designated private or public institutions. The
  Learning Disability Assessment Bursary is for designated public institutions only.
- The Assistance Program is a top-up of last resort. A student can receive it only after
  using all available funds through the federal Canada Student Grant for Services and
  Equipment. Its page does not say whether the **$10,000** and **$12,000** figures are
  annual or lifetime, so the entry does not claim "per year."
- Only the Access Grant and the Supplemental Bursary are explicitly described as
  non-repayable on their pages. The other three do not state repayment terms, so those
  entries make no repayment claim. Do not add one without checking.
- The Supplemental Bursary has a transition rule. Students at a non-public school in
  2025/26 who already received it may request to continue until they finish their program
  or until 2029-07-31.
- The Learning Disability Assessment Bursary requires the school accessibility services
  office to have recommended the assessment. That recommendation is part of eligibility,
  not a formality.

### Corrections and constraints found in batch 6

- **NO INTEREST-RATE PERCENTAGE WAS PUT IN THE PROPERTY TAX DEFERMENT ENTRY,
  DELIBERATELY.** The research had 6.45 percent. The rate is set at 2 percent above the
  prime rate of the government's principal banker, and the published rate only holds
  until 2026-09-30, so a hardcoded figure would rot. The entry states the prime-plus-2-
  percent formula and tells the user to check the current rate. Keep it that way.
- The research claim that the program defers "100 percent" of annual property taxes was
  not verified. The eligibility page states no percentage, so the entry does not claim
  one.
- The 25 percent minimum equity requirement was missing from the research entirely and is
  a real gate. It is now in the entry.
- The ICBC discount could not be verified on ICBC's own page, which loads its content
  dynamically and returned nothing readable. Every fact in that entry comes from the B.C.
  government fuel tax refund page, which states the 25 percent discount. Broker-visit
  document lists and any minimum age rule were not verified and are not in the entry.
- The ICBC discount and the fuel tax refund are one pathway, not two independent programs.
  Both entries cross-reference each other so users register once.
- The B.C. Sales Tax Credit is not a disability program. It is a general low-income
  refundable credit that phases out at a low income. The entry says so plainly rather
  than implying disability relevance.
- WorkBC Assistive Technology Services was already merged separately as
  `bc-workbc-assistive-technology`. The new employment services entry points to it rather
  than duplicating it.

### Corrections and constraints found in batch 7

- All nine city sites (`vancouver.ca`, `surrey.ca`, `burnaby.ca`, `richmond.ca`,
  `victoria.ca`, `saanich.ca`, `kelowna.ca`, `coquitlam.ca`, and `kamloops.ca`)
  return HTTP 403 to plain fetches. They were read through the in-app browser pane
  instead. Vancouver additionally shows a bot-verification interstitial that clears
  itself after a few seconds. Expect to use the browser pane for any future municipal
  work.
- The Disability Tax Credit is itself a qualifying route for Vancouver and Surrey.
  Vancouver also accepts a family with a child up to 17 who qualifies for the Child
  Disability Benefit. These are the strongest disability hooks in the municipal set.
- Burnaby's disability route is specifically a child with a disability, not adults. The
  entry says so.
- Vancouver Leisure Access passes became valid for three years on January 1, 2026. A pass
  issued in 2026 does not expire until 2029.
- Victoria and Saanich program credits cover the full two-year term, not per year. Saying
  "per year" would overstate them.
- Kelowna has no dollar figure in the entry. The City publishes the credit amount only
  inside a collapsed FAQ that could not be read. Do not add a figure without verifying
  it. The claim that it is renewed yearly was also not verified and is not in the entry.
- Coquitlam accepts a red Compass Card as proof of income, which is the same concession
  card BC transit riders already carry.
- Kamloops ARCH and KamPASS, the affordable transit program, share one application.

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

## Launch rehearsal findings (2026-07-21)

A local launch rehearsal flipped `BC_ENABLED` to `true`, ran the full suite, and then
reverted the flag. The flip was never committed, and the working tree is clean again.

With the flag on, the generators correctly produced 84 entries (36 Alberta and federal +
48 BC) and 84 guide pages. All 26 unit tests passed. Two e2e tests failed, and both must
be handled as part of the launch rather than treated as surprises.

### Finding 1 — launch blocker

`e2e/persistence.spec.js` is coupled to the Alberta-only wizard wording. It asserts that
the residency step contains `live in Alberta` and selects `Yes, I live in Alberta` at
lines 81, 84, 87, and 131. With `BC_ENABLED = true`, the residency question becomes
`Where do you live?` and the option label becomes `Alberta`, so those assertions fail.

This must be fixed before launch. Update `e2e/persistence.spec.js` to the flag-on wording
before the test and deploy step. Until that update is made, `npm run test:e2e` will fail
with the flag on.

### Finding 2 — expected pre-launch gate behaviour

`e2e/bc-dryrun.spec.js` hard-fails when the source flag is already `true` because it
exists to patch `const BC_ENABLED = false;` over the network and refuses to run vacuously
when that exact string is absent. This is correct behaviour, not a bug.

The BC dry-run gate is a pre-launch tool. Run it while the flag is still `false` as the
final check before flipping. Once the flag is permanently `true`, the gate is obsolete.
Delete `e2e/bc-dryrun.spec.js` in the same commit that flips the flag.

## Remaining work

Candidate verification is complete. All 51 researched candidates are resolved. The two
research duplicates were correctly skipped:

- `workbc-assistive-technology` duplicates `bc-workbc-assistive-technology`.
- `bc-medical-equipment-supplement` duplicates `bc-medical-equipment-devices`.

The researched candidate `bc-at-home-respite` was dropped because the program does not
exist. The raw research file is gitignored, and **`test-results/` is wiped by every e2e
run**, so the master copy of `bc-research.json` now lives only in the session scratchpad.

The only remaining item is the launch sequence, which needs an owner go-ahead:

1. While `BC_ENABLED` is still `false`, run the final BC dry-run gate:
   `npx playwright test e2e/bc-dryrun.spec.js` — 4 tests must pass.
2. Update `e2e/persistence.spec.js` to the flag-on residency wording: `Where do you live?`
   and the `Alberta` option. This is a launch prerequisite, not a post-flip test fix.
3. Flip `BC_ENABLED` to `true` in `public/app.js` and delete
   `e2e/bc-dryrun.spec.js` in the same commit.
4. Update the static scope strings marked `SCOPE:` in `public/index.html`,
   `public/embed.html`, and `scripts/gen-guide-pages.js`.
5. Run `npm run gen:context` and `npm run gen:guides`. Both respect the flag, so flipping
   it will add 48 BC entries to the assistant grounding context and generate 84 total
   guide pages plus the corresponding sitemap entries. Expect a large diff. That is
   correct, not a bug.
6. Add BC cities to whatever the impact page counts as covered municipalities.
7. Run `npm test`, `npm run test:e2e`, and `npx wrangler deploy --dry-run`.
8. Push and confirm live by content marker, not by HTTP status.

Immediately before launch, re-verify the autism funding and Children and Youth Disability
Benefit cluster. Re-verify it again after April 1, 2027. Re-check the Canada Student Grant
temporary increase before July 31, 2027.

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
- PDF fact-checking works through Python `pypdf`. `pdftotext` and `pdftoppm` are not
  installed on this machine, and WebFetch cannot read these government PDFs. Download
  the PDF and extract it locally instead.
- Link monitoring covers the directory URLs too (74 monitored links); regenerate with
  `npm run gen:context` after any directory or catalog change.

## Unrelated standing item

The Cloudflare API token `tight-boat-341e` still has account-wide permissions and was
exposed in a screenshot. Delete it and create a scoped replacement (Account → Web
Analytics: Edit, Zone → Zone: Read).
