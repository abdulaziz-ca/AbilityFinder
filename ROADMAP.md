# AbilityFinder — active roadmap

The core finder, guides, progress tracking, assistant, feedback UI/endpoint, link monitoring,
calendar reminders, data-freshness warnings, accessibility controls, and local
IndexedDB recovery are live. Completed phase-by-phase history remains available in
git and is intentionally not repeated here.

## Product north star

Answer five questions accurately and with low cognitive load:

1. What can I get?
2. What may it be worth?
3. Am I likely eligible, and why?
4. What should I apply for first?
5. How do I apply?

The largest ongoing risk is **silent factual decay**, not a missing headline
feature.

## Priorities

### 1. Maintain data accuracy

- Review `/api/link-health` regularly and replace genuinely broken/soft-404 links
  using official destinations.
- Re-verify figures, eligibility rules, forms, phone numbers, processing times, and
  municipal details before their freshness dates age out.
- Update `BENEFIT_VERIFIED` only after an actual official-source review.
- Re-verify `GRANTS_DIRECTORY` entries before their verified dates age out.
- Re-verify `ORGS_DIRECTORY` entries before their verified dates age out.
- Append a `DATA_CHANGELOG` entry in `public/changelog.js` when benefit facts change.
- Run `npm run gen:context` after `BENEFITS`, `HELP_ORGS`,
  `PRACTITIONER_FORMS`, `public/grants-data.js`, or `public/orgs-data.js` changes.
- Run `npm run gen:guides` after `BENEFITS` changes.

### 2. Human accessibility and usability testing

Automated checks cover only part of accessibility. Arrange testing with disabled
users for:

- VoiceOver/NVDA and meaningful reading order.
- Keyboard-only completion of the full journey.
- 200–400% zoom and reflow.
- Reduced-motion behavior and scroll reveals.
- Cognitive load and plain-language comprehension.

Document findings as reproducible issues, not broad redesign requests.

### 3. Carefully expand verified coverage

- Re-check Camrose and other municipalities one program at a time.
- Keep local transit/recreation rules distinct; never clone another city's policy.
- Re-integrate other provinces from `archive/data-provinces-later.js` only after a
  province-specific source audit and metadata pass. That file sits outside the
  deployed `public/` directory and is not served.
- Keep French paused until there is capacity to translate and maintain the benefit
  catalog, not only the interface.

### 4. Improve discovery only when evidence supports it

Potential low-risk enhancements:

- Per-disability browse sorting/filtering backed by explicit benefit tags.
- Safe guide deep links containing only a guide ID, never user answers.
- Client-side export/import if users demonstrate a real need for cross-device
  transfer.

## Horizon (owner direction, set 2026-07-19)

1. **Now — Alberta polish.** Make the Alberta disability service so complete that
   organizations and clinics have no comparable alternative. Feature additions come
   from the comparative research backlog (owner picks). Includes trust/credibility
   artifacts for organization outreach.
2. **Next — For Professionals v1.** Adviser-facing quick reference, DTC/T2201
   appointment-prep sheets, and a "For professionals" page. Practitioner involvement
   must use legally clean structures only: transparent directories and disclosed
   sponsorships — **NO paid referral inducements** (physician referral payments risk
   violating CPSA standards / fee-splitting rules; verify before any clinic
   arrangement).
3. **Then — Canada-wide, province by province.** British Columbia is done and live.
   Re-integrate the remaining provinces from `archive/data-provinces-later.js` one at
   a time, each with a full source audit; the Alberta and B.C. depth bar is the
   standard. National-but-shallow (the Disability Benefits Compass approach) is
   explicitly rejected.
4. **Later — Multi-audience expansion.** Beyond disability, add audience streams like
   Benefits Wayfinder's starting points: newcomers, seniors, veterans, job loss,
   caregivers, Indigenous peoples, housing, education, emergency money. One audience
   at a time, same verified-depth treatment.
5. **Future — Agency product.** A separate, paid portal for organizations/agents
   managing multiple clients (caseloads, saved scenarios, reports, white-label).
   Requires accounts and server-side state — a deliberate, scoped revisit of the free
   site's no-accounts privacy rule, applying to the separate product only. First
   genuine paid-infrastructure need.

Revenue sequencing unchanged: credibility → partnerships/grants (e.g. VAD) →
sponsorships → agency licensing.

## Safety boundaries awaiting official evidence

Do not publish an exhaustive AISH/ADAP signer-profession list until Alberta provides
one. Existing CPP-D and parking-placard signer guidance may remain because those
lists have official support.

## Known coverage gaps (official-source sweep, 2026-07-28)

A sweep of the federal, Alberta and B.C. government benefit hubs found that DATA-12's
list of four missing programs was **not exhaustive**. Four federal gaps were closed
that day (Canadian Dental Care Plan, disability supports deduction, medical expense
tax credit, Canada caregiver credit). These remain **open and unbuilt**, each needing
same-day verification of every figure before it ships:

- ~~**Federal:** excise gasoline tax refund; CPP children's benefits; multigenerational home
  renovation tax credit.~~ **All three built and deployed 2026-07-29.**
  `cpp-childrens-benefit` — $307.81/month in 2026 for a child under 18 or a full-time student
  18-25, $153.91 part-time; the disability is the PARENT's, so it is deliberately not gated on
  the `child` predicate. `multigenerational-home-renovation-tax-credit` — 14.5% of up to
  $50,000, max $7,250 for 2025; a search summary said 15% and third-party sources say $7,500,
  and both are wrong. Once per qualifying individual per lifetime, and its expenses cannot also
  be claimed under the home accessibility or medical expense credits. It was added to the
  existing renovation-credit e2e guard, whose id list is enumerated.
  `excise-gasoline-tax-refund` — states NO per-litre amount on purpose: three official pages
  publish none and temporary federal fuel excise reductions are in effect, so the record gives
  the CRA number 1-877-432-5472 instead.
- **B.C.:** ~~the annual earnings exemption~~ **done 2026-07-28** — and my note above
  overstated it: the exemption was already in `bc-disability-assistance-pwd`'s note, not
  absent. Its figures were re-verified as still current ($16,200 single, $23,400 one PWD,
  $32,400 both, effective January 1, 2026) and the record gained the rules that were
  genuinely missing. It was deliberately NOT given its own record: there is no application,
  no award and no amount received, so a catalogue entry would need a fabricated applyUrl and
  would read as a benefit to apply for.
  ~~Still open: PharmaCare Plan P (palliative); MSP Supplementary Benefits, which the
  matcher references via `bcMsp` but has no record for.~~ **Both were already closed when
  this was written or within a day of it — audited 2026-07-29, and neither was a gap.**
  `bc-pharmacare-plan-p` shipped 2026-07-29 and is listed as carried three lines below, so
  this sentence contradicted its own section. `bc-msp-supplementary-benefits` shipped
  2026-07-28 in `7b8e9db`, complete with `requiresNote`, full `detail`, `applyUrl` and
  `source`; the matcher gates it on `bcSupplementaryBenefitsEligibility`
  (`met: () => false, fixed: false`), the correct unasked-criterion pattern, which yields
  "One step away" rather than a false "ready". These were the **fourth and fifth** gap
  entries written from a hub sweep without first reading the record that already covered
  it. Check the catalogue before recording a gap.
- **B.C. PharmaCare has 13 plans, and as of 2026-07-29 all 13 have been assessed.** The
  catalogue carries five: Fair PharmaCare, Plan C, Plan G and Plan P as their own records,
  plus Plan W through `bc-fnha-health-benefits`. Plan F is handled inside
  `bc-at-home-medical` and Plans B, NP and S inside `bc-fair-pharmacare`, because none of
  them has an application of its own. Per-plan verdicts:
  ~~**Plan G (Psychiatric Medications)**~~ **done 2026-07-29** (`bc-pharmacare-plan-g`) — it was
  the highest priority because `mental` is one of the twelve disability categories the
  questionnaire offers and had no drug-coverage record at all.
  ~~**Plan F (Children in the At Home Program)**~~ **handled 2026-07-29, and my entry above was
  wrong to call it a gap.** Plan F has **no application of its own**: the province says "MCFD
  submits your information to PharmaCare" and "For coverage, apply to the At Home Program", so it
  arrives automatically with At Home Program enrolment. It was already referenced by
  `bc-at-home-medical`, and a separate record would have read as another thing to apply for. What
  the record actually had wrong was the coverage: it said "free prescriptions", while Plan F covers
  **100% of eligible prescription drugs AND designated medical supplies**. Corrected in place, no
  new record, catalogue unchanged at 95.
  **Plan B (Long-term Care)** — verified 2026-07-29 but **not built, and it needs a scope decision
  first.** Facts: 100% of eligible prescription drugs and medical supplies for permanent residents
  of licensed long-term care facilities **registered with Plan B**; coverage is **automatic** on
  becoming a permanent resident, so like Plan F it has no application of its own; **not all
  facilities are registered**, and the province suggests asking before moving in; it does **not**
  apply to extended-care, acute-care, multi-level or assisted-living facilities, nor to short-term
  or respite stays. The scope problem: the questionnaire never asks whether someone lives in long-term
  care, and there is no existing record for this to attach to the way Plan F attached to
  `bc-at-home-medical`. The genuinely useful content is the warning to check a facility's Plan B
  registration **before** moving in — decide where that belongs before writing a record for it.
  **All seven remaining plans were assessed 2026-07-29 against the `who-we-cover` hub, and
  the result is one record, not seven.** The test that decided each was "does this have its
  own application?":
  **Plan W (First Nations Health Benefits)** — **BUILT** as `bc-fnha-health-benefits`. B.C.
  states "You do not need to apply for Plan W. You must be enrolled with FNHA to be covered
  by Plan W", and unlike Plan F there was **no existing record to attach it to**, so it
  earned its own. It is framed as the FNHA enrolment route rather than as "Plan W", because
  a phone call to FNHA with a status number is what the person actually does.
  **Plan D (Cystic Fibrosis)** — no record: "the cystic fibrosis clinic arranges Plan D
  coverage for their patients", so it is automatic, exactly like Plan F.
  **Plan Z (Assurance)** — no record: "automatic coverage for anyone with MSP coverage".
  **Plan NP (National Pharmacare)** — no record: "automatic coverage for anyone enrolled in
  MSP". Its content is still useful — full cost of many contraceptives, diabetes medications
  and menopausal hormone therapy. **Done 2026-07-29** — written as four tips on
  `bc-fair-pharmacare` rather than a record, since coverage is "automatic at the pharmacy"
  with nothing to register for. The tip worth having is that Plan NP dispenses do not count
  towards the Fair PharmaCare deductible or family maximum, which is not obvious from the
  Fair PharmaCare record on its own.
  **Plan M (Medication Management)** — no record: "automatic coverage for B.C. residents".
  A tip at most.
  **Plan X (HIV/AIDS)** — **closed as out of scope 2026-07-29, by owner decision.** Unlike
  the other plans without records, this one does have a real enrolment route: PharmaCare
  "cannot determine eligibility for the program or enrol individuals in it", and the BC
  Centre for Excellence in HIV/AIDS Drug Treatment Program does. It was excluded because it
  is condition-specific rather than disability-based, not because the route is unclear. Do
  not re-open it as a coverage gap. If condition-specific records ever come into scope, note
  that the `gov.bc.ca` page for it is a 2012 policy-manual entry last updated March 2025,
  so re-verify against `bccfe.ca` rather than that page.
  **Plan S (Smoking Cessation)** — **verified in detail 2026-07-29, no record, written as a
  tip on `bc-fair-pharmacare`.** There is no application and no annual re-registration:
  "you and the pharmacist must both sign a declaration form" at the counter, and the
  allowance resets each January 1. Full cost of nicotine gum, lozenges and patches, one
  continuous course of up to 12 weeks (84 days) per calendar year. MSP is required but Fair
  PharmaCare registration is not — "you do not need to be signed up for Fair PharmaCare, but
  you do need to be enrolled in MSP". Prescription stop-smoking drugs route through Fair
  PharmaCare or Plans B, C, G or W instead. It stays a tip rather than a record because it
  is a general-population program with nothing to apply for.
  The list lives at `gov.bc.ca` → PharmaCare → who-we-cover. **Note the standalone per-plan URLs
  are unreliable — the Plan P one 404s — so read the section anchors on that hub instead.**
- ~~**Alberta:** community access for people in continuing care (CAPCC); the Alberta service
  dog qualification and ID; special needs housing.~~
  **All three built and deployed 2026-07-29.** `ab-service-dog-id-card` — no fee,
  mailed in about 2 weeks; the fiddly part is the photo (PDF only, portrait, from at least 6
  feet, dog's head level with yours).
  `ab-capcc` — narrower than this entry implied: adult Albertans **under 65** in a **type A or
  type B** continuing care home only, and alberta.ca publishes no form or cost, so the route is
  phoning a listed community access coordinator. `ab-special-needs-housing` — no central
  application; find a local provider through `findhousing.alberta.ca` and apply to them. Three
  figures were deliberately refused because alberta.ca states them only for OTHER program
  types: the 30%-of-income rent formula and the functional-independence rule both belong to
  Community Housing / Seniors programs, and no dollar income limit is published at all.
  Its `category` is "Daily living supports", not "Health & equipment": `public/app.js`
  substring-matches category into a value bucket, so "equipment" would file housing as health
  and a new "Housing" category would fall through to "income".
- **Scope questions rather than gaps:** provincial child/family benefits such as the
  Alberta Child and Family Benefit and the B.C. Family Benefit are income-based rather
  than disability-based. **Decided OUT of scope 2026-09-03 (owner decision, TaskView #48):**
  AbilityFinder is a disability-benefits finder, so these general income-tested family
  benefits are not carried. Families with a disabled child are already served by the
  disability-specific records (FSCD, the Child Disability Benefit, autism funding, the
  Alberta/B.C. child health benefits). Do not re-file them as missing coverage.

**Remaining entries re-audited against the catalogue, 2026-07-29.** After the two stale
entries above, every other open item in this section was checked against `public/data.js`
by record id and by keyword. All are **genuinely absent**: the excise gasoline tax refund,
CPP children's benefits, the multigenerational home renovation tax credit, CAPCC, the
Alberta service dog qualification and ID, special needs housing, and PharmaCare Plans D, X,
Z, M, NP and S. The only keyword hits were incidental mentions inside other records' tips,
not records. Plan W was on that list when the audit ran and has since been built as
`bc-fnha-health-benefits`.
Federal stands at 13 records and Alberta at 11, matching the catalogue counts.

Sources swept: `canada.ca/en/services/benefits/disability.html`, the CRA
persons-with-disabilities tax hub, `alberta.ca/disability-supports`,
`alberta.ca/supports-for-people-with-disabilities`, `gov.bc.ca` benefits hub and the
B.C. disability-assistance page. Note that the B.C. general benefits hub is mostly
out of scope (minimum wage, EV rebates, business services) and was filtered, not
harvested.

## Deliberately rejected

Do not "just add" these without revisiting the product's privacy/zero-spend model:

- **Accounts or server sync:** creates identifiable disability/income records. If
  needed, prefer local export/import.
- **Email/SMS reminders:** requires contact storage and SMS can cost money. The
  local `.ics` download provides reminders without a backend.
- **Community reviews or free-text timelines:** creates moderation, abuse, and PII
  risk.
- **Admin CMS:** `data.js` plus git already provides reviewable version history.
- **"Describe your disability and AI will choose" matcher:** invites sensitive free
  text and false certainty. The structured limitation-based wizard is safer.
- **Unverified automated government integration/form filling:** high factual and
  privacy risk.
- **Veterans Affairs Canada (VAC) disability benefits:** decided out of scope
  2026-07-28. VAC is a parallel federal system with service-related eligibility, its
  own adjudication and its own vocabulary. Covering it properly is a research
  programme in itself; covering it partially would imply this catalogue speaks for a
  population it has never verified anything for. Point veterans at VAC's own Benefits
  Browser instead. Revisit only as a deliberate, separately scoped expansion.

## Definition of done for future changes

A change is not done until:

- Every new benefit fact is backed by a current official source.
- Generated grounding/link files are refreshed when applicable.
- Privacy copy matches any changed data flow.
- Unit and Playwright tests pass.
- Relevant routes/personas/themes are exercised without blank or hidden content.
- Cache versions are bumped for deployed assets.
- Worker changes pass a Wrangler dry run and production smoke test when deployed.
