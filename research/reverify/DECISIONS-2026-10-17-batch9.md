# Decisions — re-verification batch 9 (2026-10-17)

DIFFERS items 1-18 in `REPORT-2026-10-17-batch9.md` were re-checked against `research/reverify/snapshots/<record>--1.txt` (fetched 2026-10-15), the record in `public/data.js` (node vm) and the `REQS` gates in `public/app.js`. Result: 16 FIX, 2 KEEP, 0 OPEN. Most FIXes are text only. Four new record-specific gates are needed (items 13, 15, 17, 18). Items 17 and 18 change the York recreation outcome from "ready" to "almost" on purpose, so one e2e assertion and one oracle baseline change with them. After any `data.js` or `app.js` edit run `npm run gen:guides`, `npm run gen:context`, `npm run check:surfaces` and the unit and e2e suites. Run e2e alone.

Conventions (as in batch 8):
- "Record" means the field in `public/data.js`. "Gate" means `REQS.<key>` in `public/app.js`.
- Replacement text uses only the snapshot's wording. Where the source hedges ("generally", "may", "at least one"), the hedge stays.
- BENEFIT_VALUES / BENEFIT_META are named only where they repeat the claim.
- A shared gate is never reworded; a record-specific gate replaces it in `requires`.
- Oracle: each new gate needs an entry in `e2e/oracle/oracle-spec.js`. `SPEC_VERSION` is already `1.27.0`; bump once for the batch to `1.28.0`.
- `test/benefit-meta-complete.test.js` only needs `effort` and `wait` to be non-empty strings. No test or e2e assertion reads the text of any field changed below, except where named (items 17 and 18).

## A. on-adp (items 1-6)

Snapshot (`on-adp--1.txt`): "To qualify, generally you must: be an Ontario resident have a valid Ontario health card have a physical disability requiring the equipment or supplies for 6 months or longer meet clinical criteria specific to the device you are applying for". "Who does not qualify" is a separate list with no "generally". Guardrails: `e2e/matcher-safety.spec.js:1583-1587` (Ontario equipment profile is `almost`, never `ready`) and oracle `adpClinical` (external, line ~614) and baseline `on-adp: almost`. None reads any text below. Statuses do not change.

1. **on-adp, "may pay 75% of an approved fixed price": KEEP.**
   - Evidence: "Depending on the type of equipment you are purchasing, ADP may provide coverage based on: Fixed Price ADP will pay 75% of the approved price". The page itself hedges the whole list ("may provide coverage"), because which model applies depends on the device. The record's "may" is the same umbrella hedge and is more cautious, not less. Also `amount` ("Up to 75% ...") and `BENEFIT_VALUES.note` stay.

2. **on-adp, resident and health card: FIX.**
   - Evidence: "To qualify, generally you must: be an Ontario resident have a valid Ontario health card".
   - `eligibility.items[0]`: "Generally, an Ontario resident with a valid Ontario health card".
   - `detail.documents[0]` ("A valid Ontario health card") is a document list entry, not a universal rule: KEEP.

3. **on-adp, physical disability for 6 months or longer: FIX.**
   - Evidence: "have a physical disability requiring the equipment or supplies for 6 months or longer", under "generally you must".
   - `eligibility.items[1]`: "Generally, a physical disability requiring the equipment or supplies for 6 months or longer".
   - `detail.tips[1]`: "Generally, the equipment must be needed for 6 months or longer."
   - `REQS.adpClinical.unmet` (record-specific gate, already `fixed: false`): change the end to "...confirm you meet them, and that the equipment is generally needed for 6 months or longer."
   - Also `eligibility.note` is unchanged ("Your income is not considered." matches "We do not consider your income.").

4. **on-adp, clinical criteria: FIX.**
   - Evidence: "meet clinical criteria specific to the device you are applying for", under "generally you must".
   - `eligibility.items[2]`: "Generally, meet the clinical criteria specific to the device you are applying for".
   - `REQS.adpClinical` first sentence ("Each ADP device category has its own clinical criteria.") matches the source's device-specific wording: unchanged.

5. **on-adp, other-coverage exclusion: FIX.**
   - Evidence: "already qualify for or are receiving financial support for the same equipment or supplies from the Workplace Safety and Insurance Board"; "are a Group "A" veteran and already qualify for or are receiving financial support from Veterans Affairs Canada for the same equipment or supplies".
   - `eligibility.items[3]`: "Not already qualifying for, or receiving, financial support for the same equipment or supplies from the Workplace Safety and Insurance Board. Group "A" veterans are also excluded if they already qualify for, or receive, support from Veterans Affairs Canada".
   - Qualifier moves, not dropped: "qualify for or are receiving" applies to both routes.

6. **on-adp, registered vendor: FIX.**
   - Evidence: "Grant ADP will pay you directly for a portion of the cost to purchase the equipment from any business you choose". The page mentions "ADP-registered vendor" only in the complaints section.
   - `detail.steps[2]`: "Buy the device from an ADP-registered vendor, who usually bills ADP for its share directly. For a grant, ADP pays you directly and you can buy from any business you choose".
   - `BENEFIT_META["on-adp"].effort`: "Assessment by a registered authorizer, then purchase (through a registered vendor, except for grant-funded equipment)".
   - Note for the owner: "who usually bills ADP for its share directly" is not on today's page (absence is not evidence it is wrong, so it stays). Worth a look on a later pass.
   - Tests: none read `effort` or `steps`.

## B. on-parking-permit (items 7-8)

7. **on-parking-permit, field of vision: FIX.**
   - Evidence: "visual acuity is 20/200 or poorer in the better eye with corrective lenses or whose maximum field of vision using both eyes has a diameter of 20 degrees or less".
   - `eligibility.items[5]`: "Visual acuity of 20/200 or poorer in the better eye with corrective lenses, or a maximum field of vision using both eyes with a diameter of 20 degrees or less".
   - No other field repeats it. `REQS.mobility` is shared and unchanged.

8. **on-parking-permit, `BENEFIT_META.wait` "about 7 weeks (in person)": KEEP.**
   - Evidence: "Delivery Online or mail Up to 3 weeks In person at a ServiceOntario centre 7 weeks". The record is more cautious than the page ("about" a stated duration). The "Up to 3 weeks" half matches. Not a hardened fact.

## C. ontario-autism-program (item 9)

9. **ontario-autism-program, "do not register again": FIX.**
   - Evidence: "You do not need to register again if you: have previously registered your child for the Ontario Autism Program already submitted a registration form and supporting documents to the Ministry of Children, Community and Social Services".
   - `note` second sentence: "You do not need to register again if you already registered with the Ontario Autism Program or already submitted a registration form and supporting documents to the Ministry of Children, Community and Social Services."
   - `detail.tips[0]`: "Register once — you do not need to register again if you already registered with the OAP or already sent a registration form and supporting documents to the ministry."
   - Tests: `matcher-safety.spec.js:1583+` checks status only.

## D. ssah (item 10)

10. **ssah, `detail.tips[5]`: FIX.**
    - Evidence: "a regulated health professional must provide a written statement describing the probability or presence of delay and risk of further delay that will result in ongoing functional limitations"; "the determination of eligibility must be undertaken again at approximately 6 years of age".
    - New tip, two short sentences: "For an infant without a definitive diagnosis, the regulated health professional gives a written statement describing the probability or presence of delay and risk of further delay that will result in ongoing functional limitations. Eligibility is then decided again at about age 6."
    - Tests: `matcher-safety.spec.js:1606-1622` check status only.

## E. waterloo-curbside-waste-support (items 11-12)

11. **waterloo-curbside-waste-support, municipal collection condition: FIX.**
    - Evidence: "It is available to eligible households that receive municipal curbside waste collection."
    - `eligibility.items[0]`: "For Assisted Waste Collection: you live with a disability or physical limitation, need help placing Region-issued black and green carts at the curb, and do not have someone available to help. It is available to eligible households that receive municipal curbside waste collection".
    - `detail.aboutList.items[0]`: append "It is available to eligible households that receive municipal curbside waste collection."
    - `REQS.waterlooWasteSupportApproval.unmet` (record-specific, `fixed: false`, oracle external): insert after the first clause "...when nobody is available to help, and only for eligible households that receive municipal curbside waste collection; the medical exemption's bag tags go to approved applicants. Either way you apply to the Region first."
    - Oracle `why` string is unchanged. Status stays `almost`.

12. **waterloo-curbside-waste-support, `note` "only for moving ... carts": FIX.**
    - Evidence: "Collected: Region-issued black garbage cart Region-issued green organics cart Tagged bags"; and "This service does not include emptying indoor containers into carts, moving carts from anywhere other than the agreed upon set-out location, or collecting waste outside your regular schedule."
    - New `note`: "Assisted Waste Collection moves Region-issued black garbage and green organics carts from an agreed set-out location to the curb. Tagged bags are also collected. Staff do not empty indoor containers, move carts from another location, collect outside the regular schedule, or enter homes or garages."
    - `aboutList.items[1]`, `items[2]` and `tips[0]` already match the source: unchanged.

## F. waterloo-homemaking-support (item 13)

13. **waterloo-homemaking-support, `REQS.lowIncome` (shared): FIX (new record-specific gate).**
    - Evidence: "Meet the financial criteria (low income/social support)". The record's own `eligibility.items[1]` ("through low income or social support") is already right; only the shared gate text narrows it. `lowIncome` (`answers.income === "low"`, `fixed: true`) refuses everyone else.
    - New gate `waterlooHomemakingFinancial`, modelled on `hamiltonFareRoute` (`app.js:432`):
      - `short`: "Ask the Region about the low income or social support route"
      - `who`: ["you", "program"]
      - `met: () => lowIncome()` (a "low" answer clearly establishes the low-income route; the wizard cannot establish the social-support route)
      - `fixed: false`
      - `unmet`: "The Region lists financial criteria of low income or social support. Ask the Region which applies to you."
    - `requires`: replace `lowIncome` with `waterlooHomemakingFinancial` (keep `waterlooRegion`, `waterlooHomemakingNeed`).
    - Oracle: add `waterlooHomemakingFinancial` like `hamiltonFareRoute`: `evidence: "answers"`, `satisfy: { set: { income: "low" } }`, violations moderate and high income, both `expect: "almost"`. Baseline `waterloo-homemaking-support: almost` is unchanged (the need gate is external).

## G. windsor-recreation-assistance (items 14-15)

14. **windsor-recreation-assistance, reimbursement deadline: FIX.**
    - Evidence: "you can request a reimbursement if the registration fees were paid in advance. (Note: If you are requesting a reimbursement, it must be done within thirty [30] days of payment.)"
    - `detail.aboutList.items[3]`: "Payment is issued directly to the program provider, or you can request reimbursement if registration fees were paid in advance. A reimbursement request must be made within 30 days of payment."
    - Not repeated elsewhere (`steps[5]` is the separate 30-day change-notice rule, which is correct).

15. **windsor-recreation-assistance, `REQS.windsor` (shared): FIX (new record-specific gate, same behaviour, new wording).**
    - Evidence: "Windsor-Essex residents"; "Please note that program eligibility may differ across municipalities". The record's `eligibility.items[0]` already says Windsor-Essex County for at least 30 days.
    - The page states a residency requirement, so a hard gate is justified. The wizard's city list (`ON_CITIES`) only offers Windsor from Windsor-Essex, so `answers.city === "Windsor"` is the only way to place a resident. Making this gate `fixed: false` would surface the program to every Ontario user, so it stays `fixed: true`.
    - New gate `windsorEssex`: `met: () => answers.city === "Windsor"`, `fixed: true`, `unmet`: "This is for Windsor-Essex residents. This tool can only place residents of the City of Windsor, and the program says eligibility may differ across municipalities."
    - `requires`: replace `windsor` with `windsorEssex` (`lowIncome` and `p2pIncomeTest` stay). `windsor-affordable-pass` keeps the shared `windsor`.
    - Oracle: `windsorEssex: municipality("Windsor", "ON")` (identical behaviour, so no baseline change).
    - For the owner: residents of other Essex County towns cannot be selected in the wizard. That is a city-list limitation, not new here.

## H. york-region-homemakers (item 16)

16. **york-region-homemakers, "calling is the only way": FIX.**
    - Evidence: "To apply for in-home homemaker services, please call 1-877-464-9675 or email @email". The email address itself is a template placeholder in the snapshot, so it cannot be checked.
    - `detail.tips[1]`: "Neither the amount of help nor the financial thresholds are published, so contact York Region to find out where you stand."
    - `REQS.yorkHomemakersNeed.unmet` (record-specific, external in oracle): "...The thresholds are not published, so you need to contact York Region." `short`: "Contact York Region to ask about health and financial need rules".
    - Optional for consistency: `applyText` "Call York Region to apply" is fine (phone is an allowed route); `steps[0]` ("or email ContactUs@york.ca") is unchanged. That address is not visible in today's snapshot (absence is not evidence it is wrong), so a human should confirm it on the live page once.
    - Tests: `matcher-safety.spec.js:1859` checks status only.

## I. york-region-recreation-subsidies (items 17-18)

Snapshot facts (`--1`): PLAY "assist children ages four to 18 and single parents"; eligible if families "who live in York Region, who have children and meet at least one of the following criteria": "Receive Rent Subsidy"; "Receive Ontario Works , Ontario Disability Support Program or Assistance for Children with Severe Disabilities"; "Receive Child Care Fee Subsidy with an annual income of $43,000 or less". Summer day camp: "children ages four to 12", same first two routes, and "Families receiving Child Care Fee Subsidy must contact their Children's Services Representative to discuss their summer camp options". Youth overnight camp: "children ages 12 to 17", first route also lists "Housing York Inc., York Region non-profit Housing, Co-operative Housing Community in York Region", plus the OW/ODSP/ACSD and the $43,000 child care route. The wizard has no answer for any of these benefits, only `income`.

17. **york-region-recreation-subsidies, `REQS.lowIncome` (shared): FIX (new record-specific gate; outcome becomes `almost`).**
    - The page never says "low income". It lists benefit routes, and the only income figure belongs to the child care subsidy route. A low-income answer does not establish any listed route.
    - New gate `yorkRecreationFamilyRoute`: `short`: "Check which York Region subsidy route applies to your family"; `who`: ["you", "program"]; `met: () => false`; `fixed: false`; `unmet`: "York Region lists routes such as receiving a rent subsidy, Ontario Works, ODSP or ACSD, or a child care fee subsidy with an annual income of $43,000 or less. Overnight camp also lists some housing communities. A family meeting at least one may be eligible."
    - `requires`: `["yorkRegion", "yorkRecreationAge", "yorkRecreationFamilyRoute"]` (drops `child` and `lowIncome`).
    - Text edits:
      - `eligibility.items[0]`: "The family lives in York Region and meets at least one listed route, such as receiving a rent subsidy, Ontario Works, ODSP or ACSD, or a child care fee subsidy with an annual income of $43,000 or less". Remove the now-duplicate `items[1]` ("You live in a York Region municipality") or keep it, either is accurate.
      - `eligibility.note`: add "Routes differ a little by subsidy: day camp families on a child care fee subsidy contact their Children's Services Representative, and overnight camp also lists some housing communities."
      - `summary`: replace "children from low-income families" with "children from families who meet the Region's listed routes"; `detail.about`: "let children from families who meet the Region's listed routes take part in..."; `aboutList.lead`: "...subsidies for children from families who meet the listed routes."
    - Tests that change: `e2e/matcher-safety.spec.js:1848` expects `ready` for the five York cities; change to `almost` (the loop name and the Guelph `no` assertion at line 1855 stay valid because `yorkRegion` is still fixed). `e2e/oracle/oracle-spec.js:823` baseline `york-region-recreation-subsidies: "ready"` -> `"almost"`. Add an `external` entry for `yorkRecreationFamilyRoute` with `why`: "The wizard does not ask about rent subsidy, Ontario Works, ODSP, ACSD or child care fee subsidy receipt, so no answer can establish a listed route."
    - This is a deliberate demotion: a "ready" would claim more than the wizard knows.

18. **york-region-recreation-subsidies, `REQS.child` (shared): FIX (new record-specific gate).**
    - Evidence: PLAY "children ages four to 18 and single parents"; day camp "ages four to 12"; overnight "ages 12 to 17". `child` (`isUnder18`) wrongly excludes age 18 and single parents, and the record has no minimum age.
    - New gate `yorkRecreationAge`: `short`: "Check the age range for the subsidy you want"; `who`: ["you"]; `met: () => ageIn("6to11", "12to15", "16to17", "18")`; `fixed: false`; `unmet`: "PLAY assists children ages four to 18 and single parents. Summer day camp is for ages four to 12, and youth overnight camp for ages 12 to 17."
    - Under-6 is left unmet-but-not-fixed because the band cannot tell four-year-olds from younger children.
    - `eligibility.note` already names the 12 to 17 overnight range; add the other two ranges in the same sentence if wanted: "PLAY assists children ages four to 18 and single parents; summer day camp is for children ages four to 12."
    - Oracle: `yorkRecreationAge: { evidence: "answers", satisfy: { set: { ageBand: "6to11" } }, violations: [{ name: "age under 6: four to five not distinguishable", fragment: { set: { ageBand: "under6" } }, expect: "almost" }] }`.
    - Because of item 17 the baseline already moves to `almost`, so no extra status change comes from this gate.

## Test and file checklist

- `public/data.js`: items 2-7, 9-14, 16-18 records; `BENEFIT_META["on-adp"].effort` (item 6).
- `public/app.js`: edit `adpClinical`, `waterlooWasteSupportApproval`, `yorkHomemakersNeed`; add `waterlooHomemakingFinancial`, `windsorEssex`, `yorkRecreationFamilyRoute`, `yorkRecreationAge`.
- `e2e/oracle/oracle-spec.js`: four new gate entries, one baseline change (`york-region-recreation-subsidies` -> `almost`), `SPEC_VERSION` 1.28.0.
- `e2e/matcher-safety.spec.js:1848`: `ready` -> `almost`.
- Regenerate guides and context; run unit and e2e suites (e2e alone).

Count: 16 FIX / 2 KEEP / 0 OPEN
