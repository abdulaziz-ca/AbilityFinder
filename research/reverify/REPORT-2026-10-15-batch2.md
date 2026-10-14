# Snapshot re-verification report — 2026-10-15, batch 2

Completed 2026-10-15.

**Original verification report below; implementation progress is recorded in “Fixes applied 2026-10-15”.**

## Implementation progress

Implementation started after reading the complete decisions and evidence report.
Scope: all twenty-four FIX decisions; snapshots only. The csg-dse source URL
is intentionally unchanged (separate ticket). Shared gates and unrelated records
will remain unchanged. Per-item changes and verification results follow as applied.

### Applied: items eighteen through twenty-four; gates and oracle

- 18–19 → Richmond amount, summary, note and BENEFIT_VALUES.note: unlimited
  free admission to “many” drop-in programs/services, “most” registered programs
  at ninety percent off; eligible drop-in visits uncapped. Existing age/cap
  qualifiers remain.
- 20 → requires, eligibility.items, requiresNote: financial hardship through
  listed government assistance, or, without it, family net income and other
  financial limits. The City's basic-needs/no-other-resources definition remains
  in requiresNote. New richmondFinancialHardship gate replaces lowIncome only here.
- 21 → Saanich amount, detail.about/aboutList and BENEFIT_VALUES.note: choose
  one of two options for two years. Option one: Saanich drop-ins, fifty-two
  regional visits annually, one-time age-based eighty-to-one-hundred-twenty-dollar
  Saanich program grant. Option two: fifty percent off an annual Regional
  Recreation Pass. Split the guide explanation into list items.
- 22 → note, detail.tips: no further adult/preschool funds in the two-year term;
  children and youth may have additional funds after initial funding is used,
  strict eligibility and no guarantee. Five-day grant setup caveat retained.
- 23 → eligibility.items/note, requiresNote, detail.steps/documents and
  BENEFIT_META.effort: CRA statements for most households, not every route.
  Newcomer landing papers within one year, completed adjudicator form when
  statements no longer reflect current income, and local-school youth without
  parental/guardian support using the Youth Application form. Contact the office
  if none fit. Under-one-thousand-dollar direct-contact step and lowIncome kept.
- 24 → detail.steps: pay the metered-fare remainder in cash; source's five-dollar
  eighty-cent example retained. Existing cash note and tips unchanged.

New gates in public/app.js, all fixed:false, all with digit-free short cues
no longer than eighty characters and who cues:

- hatcEligibleDwelling → met only for existing homeowner answer. Canada,
  joint ownership, ordinary/expected residence, both residents in the family-owner
  route, that route's no-other-owned-and-inhabited-home condition, and co-op shares.
  The extra family-owner residence qualifiers follow the snapshot's own wording.
- hatcQualifyingPerson → met only for DTC yes or senior age; any-time-in-year
  DTC eligibility, end-of-year senior age and certain family claimants in unmet;
  action copied from REQS.dtc.
- hatcQualifyingRenovationSpend → always unresolved because spending is unasked;
  non-refundable, tax owed, eligible expenses up to twenty thousand annually,
  work completed and paid in the tax year, invoices/receipts. Shared short/who copied.
- richmondFinancialHardship → met for income low or BC assistance pwd as the
  decisions specify; other listed assistance/financial-limit routes stay actionable.

Oracle version 1.18.0 → 1.19.0 deliberately adds the four isolated gate meanings.
HATC missing homeowner/personal-DTC answers: no → almost (expected residence,
family claimants and year-specific eligibility were unasked). Spending remains
external and HATC best case remains almost. Richmond high income plus PWD:
no → ready through the separate Disability Assistance route; high income without
recognized assistance: no → almost, because other routes are unasked. Richmond's
best case remains ready. The old shared oracle gates are unchanged.

Calculations inspected: all three changed municipal prices/subsidies are discount
metadata, with no annual/monthly numeric estimate fields. No met or estimate
computation uses those old numbers. Updated valueParts display notes as well as
record amounts; added regression tests for both representations and absence of
cash-estimate fields, plus tax-line/dependant and gate-isolation checks.
Browser regressions exercise PWD/high-income and unresolved alternative routes,
and each new gate's met/fixed/short/who contract. No BENEFIT_VERIFIED dates advanced:
NOT ON PAGE facts remain outside this correction pass.

### Applied: items one through seventeen

- 1 → summary, note, detail.about: “Helps pay for extra education-related
  costs”; examples “can include” supports “depending on your needs”. Approval
  depends on needs and application. Source URL and annual amount unchanged.
- 2 → amount, detail.steps, BENEFIT_VALUES.note: reduced-cost monthly Arc card,
  “$35 or $50 a month, depending on household income”. No price inferred for
  the AISH or CPP Disability route.
- 3 → note, detail.tips: “may be eligible”, household-size limits and other
  City-listed programs retained. Removed unsupported combined-application and
  automatic-consideration promises; directs readers to City eligibility questions.
- 4–6 → HATC requires now names the three new HATC gates; gate implementation
  and regression checks are recorded below as completed.
- 7 → amount: “up to $150 per person per season toward one recreation or culture
  program, while funds are available”; transit pay-one/get-two wording retained.
- 8 → summary and detail.steps: one City program, separate forms for recreation
  and culture, bus pass and Access-A-Ride; online application and telephone help.
- 9 → requiresNote, detail.about, aboutList.items and steps: supported dependants
  only; short explanations point to CRA for who counts. Full steps split the
  listed relationships and applicable Canadian-residency condition into items.
  Separate calculation against each dependant's income retained.
- 10 → detail.about, aboutList.lead, steps: total on line 33099; lesser-of
  threshold on the line below; remainder on the following line. Threshold and
  filing-year caveats retained.
- 11 → detail.tips: any twelve-month period ending in the tax year, only expenses
  not already claimed in the prior year.
- 12 → amount, detail.about: “up to 75%” for age-appropriate transit passes;
  “up to $630/yr per person”.
- 13 → amount, detail.about: separate “up to $200” annual per-person allocations
  for City recreation and Esplanade education programs.
- 14 → summary, amount, detail.about: Esplanade education, not general arts;
  full detail limits recreation to regular-priced City programs and admissions
  at City-run pools and leisure centres, and education directly provided by
  Esplanade staff. Recreation/education rate remains “75% off”.
- 15 → note, detail.steps, documents: current AISH Health Benefits Card copy;
  document per adult household member. Letter fallback only when no other
  documents are available, dated within thirty days, current relationship,
  relationship length and both Low Income Eligibility attestations. Split into
  document list items rather than deleting qualifiers.
- 16 → detail.steps, time: processing within two weeks; information-dependent
  approval and possible missing-information delays, not guaranteed decision time.
- 17 → summary, detail.about, aboutList.lead: government “may” add/pay grants
  and bonds, depending on family income and contributions. Other amounts unchanged.



## Method and scope

Evaluated `public/data.js` in a Node `vm` with `{window:{}, document:{}, console}` and exported `BENEFITS`, as in `scripts/check-readability.js`; did not grep-parse the data. Read both `REQS` unmet and short messages in `public/app.js` for each record's `requires` keys. Reviewed 15 status-200 snapshots covering 11 records. Checked the supplied snapshots re-fetched 2026-10-15; their headers retain 2026-10-14 fetch timestamps. No additional pages were fetched. Skipped every non-200 snapshot. Filenames below are relative to `research/reverify/snapshots/`.

Facts are counted as distinct assertions, not appearances or numeric tokens: repeated amounts/conditions in summary, eligibility, requiresNote, tables, about/aboutList, documents, steps and tips are consolidated. A paired amount and its period, a percentage and its threshold, and a named route's constituent conditions form one assertion when inseparable. Independent assertions have separate rows. Record quotes are verbatim excerpts, including gate text where identified. Advice without a published factual claim is not counted. Names, UI labels, URLs and internal flags are not themselves benefit facts. Procedural promises and required documents are included.

**CONFIRMED** requires a supporting snapshot quotation. **DIFFERS** identifies a substantive inconsistency, including lost conditional language or changed boundary/route. **NOT ON PAGE** means absent from this supplied record-specific snapshot set, not false; linked pages, PDFs and JavaScript applications were not treated as their contents. A weaker record hedge is not treated as evidence of a different maximum unless the source explicitly specifies a fixed amount. A citation to a table/list is quoted as a literal contiguous passage where there is no prose sentence. Hedges are checked in both directions.

## Summary table

| Record id | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| csg-dse | 20 | 7 | 1 | 12 |
| edmonton-fare-assistance | 15 | 5 | 2 | 8 |
| grandeprairie-aish-pass | 20 | 9 | 0 | 11 |
| home-accessibility-tax-credit | 24 | 21 | 3 | 0 |
| lethbridge-fee-assistance | 18 | 14 | 2 | 2 |
| medical-expense-tax-credit | 16 | 11 | 3 | 2 |
| medicinehat-fair-entry | 15 | 9 | 5 | 1 |
| rdsp | 27 | 3 | 1 | 23 |
| reddeer-fee-assistance | — | — | — | — (no status-200 snapshot) |
| richmond-rec-fee-subsidy | 22 | 15 | 3 | 4 |
| saanich-life | 19 | 16 | 3 | 0 |
| taxi-saver-bctransit | 23 | 18 | 1 | 4 |
| **Total (11 checked records)** | **219** | **128** | **24** | **67** |

## DIFFERS — needs a decision

Each numbered item corresponds to one DIFFERS assertion row, not one occurrence. Current-text quotations are exact field text or verbatim excerpts; repeated occurrences are consolidated.

1. **csg-dse — `summary / note / detail.about`**
   - Current text: “Covers assistive technology, note-taking, tutoring, coaching and other supports for students with disabilities.”; “A large grant that pays for the specific services and equipment a student needs because of their disability”
   - Snapshot sentence / finding: (`csg-dse--3.txt`): “This grant helps pay for extra education-related costs, such as services and equipment you need to support your studies.” “You may be able to receive additional funding for equipment, services, and supports”. Hedge / scope: unconditional coverage/payment replaces possible assistance with costs.
   - Difference: Hedge / scope: unconditional coverage/payment replaces possible assistance with costs.

2. **edmonton-fare-assistance — `amount / detail.steps[2]`**
   - Current text: “$36/month transit pass”; “buy the $36 monthly Arc card”
   - Snapshot sentence / finding: (`edmonton-fare-assistance--1.txt`): “You may be eligible for the $35 monthly Ride Transit Arc card.” Also: “You may be eligible for the $50 monthly Ride Transit Arc card.” Number / scope: $36 is not either published tier.
   - Difference: Number / scope: $36 differs from the published $35 and $50 monthly tiers.

3. **edmonton-fare-assistance — `note`**
   - Current text: “You qualify on low income OR if you receive AISH / CPP Disability.”
   - Snapshot sentence / finding: (`edmonton-fare-assistance--1.txt`): “receiving income support and Foundational Learning Assistance (formerly Learner's Income Support), AISH, CPP Disability Benefits, Employment Insurance (EI), a Newcomer to Canada or a Child under Government Care?” followed by “You may be eligible for the Ride Transit Program and/or the Leisure Access Pass.” Hedge: asserted qualification replaces possible eligibility.
   - Difference: Hedge: qualification is certain in the record but only possible on the page.

4. **home-accessibility-tax-credit — `REQS.homeowner.unmet`**
   - Current text: “You or the eligible family member must own and live in the home and meet the program's other property rules.”
   - Snapshot sentence / finding: (`home-accessibility-tax-credit--1.txt`): “ordinarily inhabited (or is expected to be ordinarily inhabited) in the year”. Boundary / dropped alternative: current residence is mandatory in the gate; expected inhabitation is allowed by the page.
   - Difference: Boundary / dropped alternative: mandatory current residence excludes expected inhabitation in the year.

5. **home-accessibility-tax-credit — `REQS.homeRenoCandidate.unmet`**
   - Current text: “This credit requires DTC eligibility (any age), age 65+, or an eligible supporting family member living with the person.”
   - Snapshot sentence / finding: (`home-accessibility-tax-credit--1.txt`): “A qualifying individual is either of the following:” “an individual who is eligible for the disability tax credit at any time in the year” “an individual who is 65 years of age or older at the end of the year”. Scope: an eligible supporting family member is a claimant, not a third alternative to the beneficiary's DTC/age qualification.
   - Difference: Scope: supporting family member is a claimant, not an alternative to the beneficiary’s DTC/age qualification.

6. **home-accessibility-tax-credit — `REQS.qualifyingRenovationSpend.unmet`**
   - Current text: “This credit pays back part of what you spend”
   - Snapshot sentence / finding: (`home-accessibility-tax-credit--1.txt`): “The Home Accessibility Tax Credit (HATC) is a non-refundable tax credit”. Scope: pays-back assertion drops the tax-owing limitation, despite its presence elsewhere.
   - Difference: Scope: pays-back assertion omits the non-refundable tax-owing limitation.

7. **lethbridge-fee-assistance — `amount`**
   - Current text: “$150/season recreation”
   - Snapshot sentence / finding: (`lethbridge-fee-assistance--1.txt`): “Funding is available for one program/activity, to a maximum of $150 per person, per season, while funds are available.” Hedge / dropped conditions: unqualified $150 drops maximum, per-person basis and one-program limit; general availability warning elsewhere does not qualify the amount field.
   - Difference: Hedge / dropped conditions: $150 is a maximum per person for one program/activity, not an unqualified seasonal allocation.

8. **lethbridge-fee-assistance — `summary`**
   - Current text: “One application covers transit, Access-A-Ride paratransit, and recreation fees.”
   - Snapshot sentence / finding: (`lethbridge-fee-assistance--1.txt`): “Rec and culture Fee Assistance application form Bus pass Fee Assistance application form Access-A-Ride Fee Assistance application form”. Scope: page supplies three separate application forms, not a single covering form.
   - Difference: Scope: source supplies three separate application forms, not one form covering all three services.

9. **medical-expense-tax-credit — `detail.steps[3] / detail.about / detail.aboutList.items[2]`**
   - Current text: “claim expenses for any other dependant separately on line 33199”
   - Snapshot sentence / finding: (`medical-expense-tax-credit--1.txt`): “persons who depended on you for support: your or your spouse or common-law partner's children who were 18 years of age or older ... or grandchildren”; enumerated parents/grandparents/siblings/uncles/aunts/nephews/nieces “who were residents of Canada at any time in the year”. Scope / dropped conditions: “any other dependant” drops the specified relationships and Canadian-residency condition for the latter relatives.
   - Difference: Scope / dropped conditions: “any other dependant” omits specified relationships and applicable Canadian-residency condition.

10. **medical-expense-tax-credit — `detail.steps[1–2]`**
   - Current text: “total them and subtract the lesser of 3% of your net income from line 23600 or $2,834”; “enter the result on line 33099”
   - Snapshot sentence / finding: (`medical-expense-tax-credit--1.txt`): “On line 33099 ... enter the total amount”; “Subtract the amount of step 2 ... and enter the result on the following line”. Scope: the remainder is entered on the following line, not line 33099.
   - Difference: Scope: line 33099 takes the total expenses; the post-threshold remainder goes on the following line.

11. **medical-expense-tax-credit — `detail.tips[1]`**
   - Current text: “you can pick the 12-month period ending in the tax year that captures the most expenses”
   - Snapshot sentence / finding: (`medical-expense-tax-credit--1.txt`): “paid for the medical expenses in any 12-month period ending in 2025 did not claim them in 2024”. Dropped condition: the period-selection statement omits the no-prior-year-claim restriction; “check CRA's rule” does not express it.
   - Difference: Dropped condition: 12-month selection omits the restriction against expenses already claimed in the prior year.

12. **medicinehat-fair-entry — `amount / detail.about`**
   - Current text: “75% off transit”; “It cuts 75% off monthly transit passes”
   - Snapshot sentence / finding: (`medicinehat-fair-entry--2.txt`): “Receive a reduction of up to 75% from the regular price of an age-appropriate monthly transit pass for up to two years.” Hedge: record drops “up to”. --1 says “Save 75%”; the supplied sources disagree on the hedge, requiring a decision, not a new percentage.
   - Difference: Hedge: record fixes 75%; application says up to 75%, while overview says 75%.

13. **medicinehat-fair-entry — `amount / detail.about`**
   - Current text: “$200/yr recreation & arts”; “gives each approved person $200 a year toward City recreation and Esplanade arts programs”
   - Snapshot sentence / finding: (`medicinehat-fair-entry--1.txt`): “separate subsidies for each service area”; recreation: “Each family member ... will receive $200 per year”; Esplanade: “maximum user fee assistance ... per eligible year is $200.” Scope: record describes one shared $200 rather than separate $200 allocations.
   - Difference: Scope: record describes a shared $200; source has separate recreation and Esplanade allocations.

14. **medicinehat-fair-entry — `detail.about`**
   - Current text: “City recreation and Esplanade arts programs at 75% off.”
   - Snapshot sentence / finding: (`medicinehat-fair-entry--1.txt`): “City of Medicine Hat regular-priced recreation program and admissions at City-run swimming pools and leisure centres”; “educational programs directly provided by staff of the Esplanade”. Dropped conditions / scope: recreation regular-price and Esplanade educational/direct-provider restrictions are omitted. Percentage itself agrees.
   - Difference: Dropped conditions / scope: regular-price recreation and directly staff-provided Esplanade educational-program restrictions are omitted.

15. **medicinehat-fair-entry — `detail.documents[0]`**
   - Current text: “or a social worker's letter”
   - Snapshot sentence / finding: (`medicinehat-fair-entry--1.txt`): “Only when no other documents are available. A letter dated within the last 30 days from a social worker/support staff with whom a current relationship exists.” Dropped conditions: fallback-only, recency, current relationship and required eligibility attestation omitted. FAQ gives the broad alternative; detailed proof section specifies its restrictions.
   - Difference: Dropped conditions: social-worker letter loses fallback-only, 30-day, current-relationship and eligibility-attestation restrictions.

16. **medicinehat-fair-entry — `detail.steps[3] / detail.time`**
   - Current text: “Wait about two weeks for a decision.”; “About two weeks.”
   - Snapshot sentence / finding: (`medicinehat-fair-entry--1.txt`): “Your application will be processed within two weeks but your approval depends on the information you provide. If information is missing, it may delay your approval.” Hedge / scope: processing duration becomes decision duration without the information-dependent caveat.
   - Difference: Hedge / scope: two-week processing becomes decision timing without the information-dependent delay caveat.

17. **rdsp — `summary / detail.about / detail.aboutList.lead`**
   - Current text: “A savings account where the government adds matching grants ... and bonds”; “The government pays in grants ... and bonds”
   - Snapshot sentence / finding: (`rdsp--1.txt`): “When you open a plan, you may also get grants and bonds”; “Family income and amount of contributions determine how much matching grants and bonds you could get.” Hedge / dropped conditions: certain additions replace possible income/contribution-dependent additions.
   - Difference: Hedge / dropped conditions: certain government additions replace possible income/contribution-dependent grants and bonds.

18. **richmond-rec-fee-subsidy — `amount / summary`**
   - Current text: “Unlimited free drop-in admission”; “free drop-ins with no cap”
   - Snapshot sentence / finding: (`richmond-rec-fee-subsidy--1.txt`): “Unlimited free admission to many drop-in programs and services”. Scope / dropped qualification: unlimited visits become unqualified drop-in coverage; “many” appears in detail but not these assertions.
   - Difference: Scope / dropped qualification: unlimited visits to many eligible drop-ins becomes unqualified drop-in coverage.

19. **richmond-rec-fee-subsidy — `amount`**
   - Current text: “90% off registered programs”
   - Snapshot sentence / finding: (`richmond-rec-fee-subsidy--1.txt`): “A 90 per cent discount on most registered programs”. Scope / dropped hedge: the amount field omits “most”; summary and detail retain it but do not qualify the amount-field assertion.
   - Difference: Scope / dropped hedge: registered-program coverage omits “most”.

20. **richmond-rec-fee-subsidy — `REQS.lowIncome.unmet`**
   - Current text: “This is for lower-income households.”
   - Snapshot sentence / finding: (`richmond-rec-fee-subsidy--1.txt`): “Individuals/households who are receiving government financial assistance from one of the following programs” OR those who “meet the following financial limits”. Scope: lower-income gate makes the income route universal despite separate government-assistance qualification with no listed income-limit test.
   - Difference: Scope: mandatory lower-income gate applies the income route to the separate government-assistance route.

21. **saanich-life — `amount / detail.about`**
   - Current text: “Two years of free drop-ins at Saanich facilities plus a one-time grant of $80 to $120 toward registered programs”; “approval includes local drop-ins, regional visits and an age-based one-time program grant.”
   - Snapshot sentence / finding: (`saanich-life--1.txt`): “you can select from one of two options: Option 1: Free Drop Ins and Discounts”; “Option 2: 50% off Regional Recreation Pass”. Scope: Option 1 benefits described as inherent to approval without the option restriction. Summary acknowledges choice but does not qualify these assertions.
   - Difference: Scope: Option 1 benefits are described as inherent to approval rather than conditional on selecting that option.

22. **saanich-life — `note`**
   - Current text: “there are no further funds once the initial grant is used.”
   - Snapshot sentence / finding: --1, youth/children: “There may be some additional funds for children and youth only after initial funding has been utilized.” “funds are not guaranteed.” Scope / hedge: absolute denial omits possible child/youth supplementary funding.
   - Difference: Scope / hedge: absolute no-further-funds statement omits possible additional child/youth funding.

23. **saanich-life — `eligibility.items[1] / requiresNote / detail.steps[1] / detail.documents[1]`**
   - Current text: “You have a Canada Revenue Agency Proof of Income Statement for every household member 19 and over, even those who will not use the program.”
   - Snapshot sentence / finding: (`saanich-life--1.txt`): “There are other forms of eligibility based on other scenarios.” Changed-income route: “apply online using your adjudicator form as proof of income”; unsupported youth: “Youth Application form”. Scope: all-mode eligibility and steps impose the general-route statement on alternative routes; newcomer exception alone does not cover these other alternatives. The age/use criteria themselves match the general route.
   - Difference: Scope: universal CRA-statement requirement omits adjudicator-form and unsupported-youth routes.

24. **taxi-saver-bctransit — `detail.steps[4]`**
   - Current text: “pay any remainder using a method the taxi accepts”
   - Snapshot sentence / finding: (`taxi-saver-bctransit--1.txt`): “If the fare is $5.80, you pay $5.00 in coupons and $0.80 in cash.” Scope / dropped condition: cash remainder becomes any taxi-accepted method; note retains cash, but steps broaden it.
   - Difference: Scope / dropped condition: source’s cash remainder becomes any payment method the taxi accepts.

No replacement wording is proposed. These are evidence/decision items only; NOT ON PAGE is not a correction recommendation.

## Not checked: no snapshot

- handydart-translink
- kelowna-recreation-assistance
- reddeer-fee-assistance — both supplied snapshots have `status: ERROR`; no usable status-200 snapshot.

## Per-record detail

### csg-dse

Sources: `csg-dse--1.txt`, `--2.txt`, `--3.txt`. --1 is the general disability grant, not the services/equipment grant; --2 is the Alberta Student Aid landing page; --3 describes B.C. disability funding.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Maximum | “Up to $20,000” | CONFIRMED | --3: “the maximum $20,000 available through the CSG-DSE.” |
| Annual period | “/ year” | NOT ON PAGE | --3 does not give the DSE maximum's period; --1's annual amount is a different grant. |
| Coverage certainty (summary / note / about) | “Covers assistive technology, note-taking, tutoring, coaching and other supports for students with disabilities.”; “A large grant that pays for the specific services and equipment a student needs because of their disability” | DIFFERS | --3: “This grant helps pay for extra education-related costs, such as services and equipment you need to support your studies.” “You may be able to receive additional funding for equipment, services, and supports”. Hedge / scope: unconditional coverage/payment replaces possible assistance with costs. |
| Individual support types | “assistive tech, tutors, note-takers, learning coaches, specialized transportation”; “screen readers and hearing supports”; “Can cover ADHD/learning coaching, tutoring, and organization tools” | NOT ON PAGE | Services/equipment are described generally; none of these specific support types or ADHD is enumerated. |
| Post-secondary students (REQS.student) | “This is for post-secondary students.” | CONFIRMED | --3: “help students with disabilities pay for extra costs during college or university.” |
| Provincial application | “Apply through your provincial student aid” | CONFIRMED | --1: “Apply for student aid with your province or territory.” --3: “you can access these programs through your StudentAid BC loan application.” |
| Alberta disability-section procedure | “Apply through Alberta Student Aid and complete the disability section.” | NOT ON PAGE | --2 supplies login/application links, not a disability-section procedure. |
| School accessibility office | “Work with your school's Accessibility / Disability Services office to identify what you need.” | CONFIRMED | --3: “Visit the accessibility services office at your school.” “help you identify the equipment that may support your studies”. |
| Quotes/recommendation and disability on file | “Submit quotes or a recommendation for the equipment/services.”; “Disability documentation on file” | CONFIRMED | --3: “Make sure your disability status is established.” “complete and submit the Equipment Request form”; “complete the Services Request form”. Confirms documented status and school recommendation/request, not quote as a substitute (next row). |
| Quote as alternative to recommendation | “A recommendation or quote for the specific supports” | NOT ON PAGE | --3 does not state a quote alone is an alternative. |
| Campus routinely guides paperwork | “Your campus Accessibility Services office does this all the time”; “they'll guide the paperwork.” | NOT ON PAGE | Frequency and guidance promise not stated. |
| Concurrent assessment timing | “Assessed with your student aid application.” | NOT ON PAGE | --3 requires a separate services/equipment request after verified status; no concurrent DSE assessment timing is stated. |
| Phone | “Alberta Student Aid: 1-855-606-2096” | CONFIRMED | --2: “Dial Toll Free in North America: 1-855-606-2096”. |
| B.C. federal-grant route (REQS.notBcStudentAidDuplicate, short/unmet) | “Use the StudentAid BC version of this federal grant; it is the same program with B.C.-specific application steps.” | CONFIRMED | --3: “you can apply for the Canada Student Grant for Services and Equipment – Students with Disabilities.” |
| Financial need (REQS.csgNeedAndProgram) | “You must have an assessed financial need” | NOT ON PAGE | --1 states need for the general disability grant; --3 does not state DSE assessed-need criteria. |
| Qualified designated program (same gate) | “be enrolled in a qualified program at a designated school” | NOT ON PAGE | --1 states this for the different grant; no DSE criterion here. |
| Recognized disability and documentation (same gate) | “have a disability recognized by the Canada Student Financial Assistance Program, and include documentation of your disability with your application.” | NOT ON PAGE | --3 establishes B.C. disability verification, not this federal recognition/application rule for DSE. |
| Territorial/Quebec exclusion (same gate, short) | “The Northwest Territories, Nunavut and Quebec run their own student aid programs; if you live there, apply through that program instead.” | NOT ON PAGE | --1 excludes these jurisdictions for the general grant, not expressly DSE. |
| Qualified-person written confirmation (REQS.csgServicesEquipment, short/unmet) | “written confirmation from a qualified person — a rehabilitation caseworker, an official from a centre for students with disabilities, a guidance counsellor, or your school's financial aid administrator” | NOT ON PAGE | --3 describes school officers but does not enumerate these alternatives or their written-confirmation rule. |
| Cost confirmation (same gate) | “plus a document confirming their cost.” | NOT ON PAGE | Not stated for DSE requests on the supplied pages. |

### edmonton-fare-assistance

Source: `edmonton-fare-assistance--1.txt` (fare-assistance overview and eligibility questionnaire, not the linked program/application pages).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Monthly transit price (amount / steps) | “$36/month transit pass”; “buy the $36 monthly Arc card” | DIFFERS | --1: “You may be eligible for the $35 monthly Ride Transit Arc card.” Also: “You may be eligible for the $50 monthly Ride Transit Arc card.” Number / scope: $36 is not either published tier. |
| Reduced-price Arc product | “A subsidized monthly Arc transit card” | CONFIRMED | --1: “The Ride Transit Program offers a reduced-cost Arc card to eligible low-income Edmontonians.” The questionnaire names monthly products. |
| Free/reduced recreation | “free/low-cost recreation”; “reduced-cost access to City of Edmonton recreation facilities.” | NOT ON PAGE | Leisure Access is linked but recreation coverage/prices are not described. |
| Edmonton scope (REQS.edmonton / address) | “Edmonton address”; “This is a City of Edmonton program.” | CONFIRMED | --1: “eligible low-income Edmontonians.” |
| Income/benefit routes, certainty (note) | “You qualify on low income OR if you receive AISH / CPP Disability.” | DIFFERS | --1: “receiving income support and Foundational Learning Assistance (formerly Learner's Income Support), AISH, CPP Disability Benefits, Employment Insurance (EI), a Newcomer to Canada or a Child under Government Care?” followed by “You may be eligible for the Ride Transit Program and/or the Leisure Access Pass.” Hedge: asserted qualification replaces possible eligibility. |
| Income/recipient-route check (REQS.lowIncomeOrDisabilityIncome) | “Confirm the municipality's household-income limit or an accepted benefit-recipient route.” | CONFIRMED | --1: “Is your household income $33,579 or less?” and the benefit-recipient question quoted above. |
| One application / automatic consideration | “One application covers both transit and leisure access.”; “Applying for Leisure Access automatically considers you for the transit discount too.” | NOT ON PAGE | No combined-application procedure stated. |
| Application requirement | “Complete the Leisure Access / Ride Transit application.” | NOT ON PAGE | Application contents/procedure not stated. |
| Income/benefit proof | “Proof of income OR AISH / CPP-D statement” | NOT ON PAGE | Required documentation not enumerated. |
| Leisure pass usage after approval | “use your Leisure Access pass.” | NOT ON PAGE | No pass-issuance/usage procedure stated. |
| Likely qualification irrespective of income | “If you're on AISH or CPP Disability you likely qualify regardless of the income cutoff.” | CONFIRMED | --1 asks benefit-receipt before income and answers “You may be eligible for the Ride Transit Program and/or the Leisure Access Pass.” This is hedged, unlike the note. |
| Approval time | “Approximately 8 to 12 weeks for approval.” | NOT ON PAGE | No approval duration stated. |
| Mailing time | “allow up to 10 more business days” | NOT ON PAGE | No mailing duration stated. |
| In-person pickup | “you can pick it up in person instead.” | NOT ON PAGE | Not stated. |
| Phone | “City of Edmonton 311” | CONFIRMED | --1: “If you need more information, please contact 311.” |

### grandeprairie-aish-pass

Sources: `grandeprairie-aish-pass--1.txt` (Transit Access Program), `--2.txt` (fares/SUPERPASS). Neither is the Recreation Access Program page.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| AISH monthly pass price | “$10.25/month transit pass” | CONFIRMED | --1: “AISH recipients qualify for a $10.25 monthly transit SUPERPASS that can be picked up at the City Hall.” |
| Regular adult monthly price | “instead of $74.25” | CONFIRMED | --1: “Fare Category Monthly Pass TAP Subsidy Fare Adult $74.25 $37.13”. |
| Provincial superlative | “the deepest municipal transit discount in the province that we've found.” | NOT ON PAGE | No provincial comparison stated. |
| Separate AISH/ADAP route / TAP exclusion | “AISH and ADAP recipients are NOT part of the general Transit Access Program” | CONFIRMED | --1: “Does the program apply to me if I am currently receiving benefits from Assured Income for the Severely Handicapped (AISH) or the Alberta Disability Assistance Program (ADAP) No”. |
| ADAP pass eligibility / proof route | “Proof you receive AISH (or ADAP)” | CONFIRMED | --1: “The monthly AISH / ADAP Transit Pass rate has changed. New Monthly Rate $10.25”. Confirms recipients; required proof format is separate below. |
| General TAP discount | “a 50% discount ($37.13)” | CONFIRMED | --1: “It offers a 50% subsidy on the monthly Grande Prairie Transit SUPERPASS to qualifying applicants.” “Adult $74.25 $37.13”. |
| Reason for exclusion | “because this is the better deal.” | NOT ON PAGE | Prices confirm cheaper fare, but source does not state this as reason for exclusion. |
| Recreation discount / products | “75% off memberships, punch passes and registered programs.” | NOT ON PAGE | Recreation program not described. |
| Separate recreation application / channels | “apply separately to the Recreation Access Program, online or in person.” | NOT ON PAGE | Only TAP application described. |
| City Hall pickup / address | “go to City Hall (10205 98 Street)” | CONFIRMED | --1: “can be picked up at the City Hall.” --2: “City Hall 10205 98 Street”. |
| AISH documentation required | “bring your AISH documentation.” | NOT ON PAGE | No AISH-pass documentation requirement stated. |
| Address proof for this route | “Proof of a Grande Prairie address” | NOT ON PAGE | --1 requires address proof for TAP, which expressly excludes AISH/ADAP; no AISH/recreation proof requirement stated. |
| Recreation income / dependent documents | “For recreation: household income and any dependent children's details” | NOT ON PAGE | TAP documents cannot verify recreation documents. |
| In-person approval duration | “In-person applications are approved on the spot — about 10 minutes.”; “Same day in person” | NOT ON PAGE | Not stated. |
| Online approval duration | “Online takes about 2 days.” | NOT ON PAGE | Not stated. |
| Recreation income line | “the low-income cut-off plus 30%” | NOT ON PAGE | --1 uses this line for TAP, not recreation. |
| More generous than most | “uses a more generous income line than most” | NOT ON PAGE | No intermunicipal comparison. |
| Phone | “780-538-0300 or 311” | CONFIRMED | --1/--2: “Transit Inquiries Phone: 780-538-0300 or 311”. |
| City scope (REQS.grandeprairie) | “This is a City of Grande Prairie program.” | CONFIRMED | --1: “all residents of Grande Prairie have access to public transit”. |
| Municipal route check (REQS.municipalProgramEligibility) | “Confirm the program's household-income or qualifying benefit-recipient route.” | CONFIRMED | --1: “AISH recipients qualify for a $10.25 monthly transit SUPERPASS”; TAP uses the “Low-Income Cut-Off level”. |

### home-accessibility-tax-credit

Source: `home-accessibility-tax-credit--1.txt` (CRA detailed line 31285 page, tax year 2025).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Non-refundable federal credit | “A federal non-refundable tax credit”; “it reduces tax you owe rather than producing a payment on its own.” | CONFIRMED | --1: “Federal: Line 31285 Provincial or territorial: Not applicable”; “a non-refundable tax credit”. |
| Annual expense maximum | “Up to $20,000 per year in eligible expenses” | CONFIRMED | --1: “A qualifying individual can claim up to $20,000 per year in eligible expenses.” |
| DTC route and timing | “eligible for the Disability Tax Credit at any time in the year” | CONFIRMED | --1: “an individual who is eligible for the disability tax credit at any time in the year”. |
| Senior route and timing | “65 years of age or older at the end of the year.” | CONFIRMED | --1: “an individual who is 65 years of age or older at the end of the year”. |
| Family claimant possibility | “A spouse, common-law partner or certain other relatives may claim instead as an eligible individual.” | CONFIRMED | --1: “a spouse or common-law partner of a qualifying individual”; enumerated relatives subject to dependent-credit/disability-amount criteria. The record says “certain” and “may”, not all relatives. |
| Renovation permanence / purpose | “of an enduring nature and integral to the dwelling”; “get into, move around or function within the home, or reduces their risk of harm.” | CONFIRMED | --1: “of an enduring nature and is integral to the eligible dwelling”; “allow the qualifying individual to gain access to, or be mobile or functional within, the dwelling”; “reduce the risk of harm”. |
| Line / return instead of advance application | “claimed on your tax return at line 31285, not applied for in advance.” | CONFIRMED | --1: “Next, enter the result on line 31285 of your federal tax return.” |
| Shared-dwelling maximum | “the total for that dwelling is still $20,000” | CONFIRMED | --1: “When there is more than one qualifying individual for an eligible dwelling, the total eligible expenses cannot be more than $20,000 for the dwelling.” |
| Claim splitting | “where several people are entitled to claim, they can split it.” | CONFIRMED | --1: “The claim can be split between the qualifying individual and the eligible individuals for the qualifying individual.” |
| 2022–2024 limit | “$20,000 for 2022 through 2024” | CONFIRMED | --1: “2024 $20,000 2023 $20,000 2022 $20,000”. |
| 2015–2021 limit | “$10,000 from 2015 through 2021.” | CONFIRMED | --1: “2021 $10,000 2020 $10,000 2019 $10,000 2018 $10,000 2017 $10,000 2016 $10,000 2015 $10,000”. |
| Dual medical/home claim | “an expense which also qualifies as a medical expense can be claimed both” | CONFIRMED | --1: “If you have an eligible expense that also qualifies as a medical expense, you can claim the expense as a medical expense and a home accessibility expense.” |
| Invoice identity/content | “vendor, their business address, their GST/HST number where applicable, a description of the work and the address, the amount” | CONFIRMED | --1: “information that clearly identifies the vendor or contractor, their business address, and, if applicable, their GST/HST registration number”; “a description of the work done, including the address where it was done the amount of the invoice”. |
| Proof of payment | “proof of payment” | CONFIRMED | --1: “proof of payment (receipts or invoices must show that bills were paid in full or be accompanied by other proof of payment”. |
| Federal Worksheet chart | “complete the chart for line 31285 on the Federal Worksheet” | CONFIRMED | --1: “Complete the chart for line 31285 using your Federal Worksheet.” |
| Keep, do not send documents | “keep the documents rather than sending them” | CONFIRMED | --1: “Do not send any supporting documents when you file your tax return. Keep them in case the CRA asks to see them later.” |
| Agreements/invoices/receipts | “agreements, invoices and receipts” | CONFIRMED | --1: “acceptable documentation, such as agreements, invoices, and receipts.” |
| Condo/co-op signed share statement | “a signed statement from the corporation setting out the amounts and your share” | CONFIRMED | --1: “a statement from a co-operative housing corporation or condominium corporation ... signed by an authorized individual identifying: the amounts incurred ... your part of these expenses”. |
| Ineligible value/repair/appliance/financing costs | “costs that mainly raise the value of the home, routine repairs, appliances and financing costs are not eligible” | CONFIRMED | --1: “the cost of annual, recurring, or routine repairs or maintenance amount paid to buy household appliances”; “financing costs”; “the cost of renovation incurred mainly to increase or maintain the value of the dwelling”. |
| Nonpermanent items, hedge | “an item you buy that does not become a permanent part of the home is generally not eligible” | CONFIRMED | --1: “An item that you buy that will not become a permanent part of your dwelling is generally not eligible.” |
| Ownership/inhabitation gate (REQS.homeowner) | “You or the eligible family member must own and live in the home and meet the program's other property rules.” | DIFFERS | --1: “ordinarily inhabited (or is expected to be ordinarily inhabited) in the year”. Boundary / dropped alternative: current residence is mandatory in the gate; expected inhabitation is allowed by the page. |
| Qualifying-person alternatives (REQS.homeRenoCandidate) | “This credit requires DTC eligibility (any age), age 65+, or an eligible supporting family member living with the person.” | DIFFERS | --1: “A qualifying individual is either of the following:” “an individual who is eligible for the disability tax credit at any time in the year” “an individual who is 65 years of age or older at the end of the year”. Scope: an eligible supporting family member is a claimant, not a third alternative to the beneficiary's DTC/age qualification. |
| Reimbursement assertion (REQS.qualifyingRenovationSpend.unmet) | “This credit pays back part of what you spend” | DIFFERS | --1: “The Home Accessibility Tax Credit (HATC) is a non-refundable tax credit”. Scope: pays-back assertion drops the tax-owing limitation, despite its presence elsewhere. |
| Completed/paid work and receipts (same gate, short/unmet) | “only once the qualifying renovation has actually been done and paid for. Keep your invoices and receipts.” | CONFIRMED | --1: “The expenses must be for work performed and goods acquired in the tax year.” “receipts or invoices must show that bills were paid in full”. |

### lethbridge-fee-assistance

Source: `lethbridge-fee-assistance--1.txt` (detailed program page).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Transit subsidy | “3 months of bus passes for the price of 1” | CONFIRMED | --1: “participants pay for a 1 month bus pass and receive 2 additional months for free.” |
| Recreation amount/conditions | “$150/season recreation” | DIFFERS | --1: “Funding is available for one program/activity, to a maximum of $150 per person, per season, while funds are available.” Hedge / dropped conditions: unqualified $150 drops maximum, per-person basis and one-program limit; general availability warning elsewhere does not qualify the amount field. |
| Single application (summary) | “One application covers transit, Access-A-Ride paratransit, and recreation fees.” | DIFFERS | --1: “Rec and culture Fee Assistance application form Bus pass Fee Assistance application form Access-A-Ride Fee Assistance application form”. Scope: page supplies three separate application forms, not a single covering form. |
| AISH accepted as income proof / no NOA needed | “AISH counts as proof of income.”; “you don't need a Notice of Assessment.” | CONFIRMED | --1: “Upload one of the following for each adult household member: Canada Revenue Agency: Notice of Assessment ... Assured Income for Severely Handicapped benefits (AISH)”. |
| Paratransit subsidy | “Access-A-Ride paratransit at one-third of the usual cost” | CONFIRMED | --1: “offering 2/3 of the funding required for Lethbridge Transit Access-A-Ride”; “pay for 1/3 of the funding request”. |
| Exclusive among city programs | “the only one of these city programs that also subsidizes paratransit” | NOT ON PAGE | No cross-program comparison stated. |
| Online application | “Apply online through the City's Fee Assistance form” | CONFIRMED | --1: “must use the online application process”; three linked application forms. |
| Telephone help | “or call 311 for help.” | CONFIRMED | --1: “Phone: 311 or 403-320-3111 (if outside of Lethbridge)”. |
| Select multiple supports in application | “Choose what you need: bus pass, Access-A-Ride, recreation, or more than one.” | NOT ON PAGE | Separate forms exist; selecting multiple supports in a single form is not stated. |
| Accepted income alternatives | “a CRA Notice of Assessment, Alberta Works letter, housing authority letter, or a letter from a Registered Social Worker” | CONFIRMED | --1: “Canada Revenue Agency: Notice of Assessment”; “Alberta Works: Income subsidy/support”; “Lethbridge Housing Authority or other housing program letter”; “Advocacy letter from a Registered Social Worker (RSW)”. |
| Residency proof | “Proof of a Lethbridge address” | CONFIRMED | --1: “Proof of Lethbridge Residency (provide one of the following)”. |
| RSW letter as standalone income proof | “A letter from a Registered Social Worker is accepted on its own” | CONFIRMED | --1: “Upload one of the following for each adult household member”; “Advocacy letter from a Registered Social Worker (RSW)”. In context this is an income-proof alternative; the record separately requires residence proof, so it does not assert that a letter alone completes the whole application. |
| Season cap | “Recreation funding is capped per season” | CONFIRMED | --1: “to a maximum of $150 per person, per season”. |
| CommunityLINKS help / location | “CommunityLINKS at the main library will sit with you and do the application.” | CONFIRMED | --1: “Those needing help with their application can visit CommunityLINKS at the Lethbridge Public Library Main Branch”. Confirms hands-on application assistance, not an approval promise. |
| Year-round / availability | “Apply any time; funding runs while it lasts.” | CONFIRMED | --1: “Applicants can apply for this program at any time throughout the year”; “while funds are available.” |
| Phone numbers | “311, or 403-320-3111 from outside Lethbridge” | CONFIRMED | --1: “Phone: 311 or 403-320-3111 (if outside of Lethbridge)”. |
| City scope (REQS.lethbridge) | “This is a City of Lethbridge program.” | CONFIRMED | --1: “supports Lethbridge residents who face financial barriers.” |
| Route check (REQS.lowIncomeOrDisabilityIncome) | “Confirm the municipality's household-income limit or an accepted benefit-recipient route.” | CONFIRMED | --1: “Qualification ... is based on gross adult household income”; accepted income-status documents include AISH. Gate asks confirmation, not automatic eligibility from receipt. |

### medical-expense-tax-credit

Source: `medical-expense-tax-credit--1.txt` (CRA detailed page; calculations for 2025).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Federal medical credit / paid expenses (REQS.disabilityMedicalExpensesPaid short/unmet) | “The federal credit for out-of-pocket medical expenses.”; “once you have paid the expenses and have the receipts.” | CONFIRMED | --1: “Step 5 – Federal tax”; “paid for the medical expenses”; “Receipts – Receipts must show the name of the company or individual to whom the expense was paid.” |
| Disability costs largest / most claimed here | “Disability-related costs are often the largest medical expenses a household has, and this is where most of them are claimed.” | NOT ON PAGE | No household comparison or majority-claim statistic stated. |
| Lesser-of threshold / line 23600 | “the lesser of 3% of your net income from line 23600 or $2,834” | CONFIRMED | --1: “enter the lesser of the following amounts: 3% of your net income ( line 23600 ) or $2,834”. |
| Above-threshold calculation / lower income effect | “Only the portion above a threshold counts.”; “a lower income means a lower threshold and more of your expenses count” | CONFIRMED | --1: “Subtract the amount of step 2 from the amount on line 33099”; “It may be better for the spouse or common-law partner with the lower net income ... to claim”. |
| Indexed / changes by year | “This amount is indexed and changes by tax year” | NOT ON PAGE | Snapshot specifies the 2025 figure but does not state indexing or annual changes. |
| Self/spouse/child route | “yourself, your spouse or common-law partner, and your children under 18 on line 33099.” | CONFIRMED | --1: “yourself your spouse or common-law partner your or your spouse or common-law partner's children who were under 18 years of age at the end of the tax year”. |
| Other-dependant threshold | “the same threshold is worked out separately using that dependant's net income.” | CONFIRMED | --1: “You have to do the following calculation for each dependant.” “3% of your dependant's net income ( line 23600 ) or $2,834”. |
| Other-dependant scope (steps / about) | “claim expenses for any other dependant separately on line 33199” | DIFFERS | --1: “persons who depended on you for support: your or your spouse or common-law partner's children who were 18 years of age or older ... or grandchildren”; enumerated parents/grandparents/siblings/uncles/aunts/nephews/nieces “who were residents of Canada at any time in the year”. Scope / dropped conditions: “any other dependant” drops the specified relationships and Canadian-residency condition for the latter relatives. |
| Pauline income / percentage result | “Pauline's net income is $55,000, 3% of that is $1,650” | CONFIRMED | --1: “Pauline’s net income ... is $55,000. She calculates 3% of that amount, which is $1,650.” |
| Pauline expenses / subtraction | “because $1,650 is less than $2,834 she subtracts $1,650 from the $6,300 of combined expenses.” | CONFIRMED | --1: “Because the result is less than $2,834, she subtracts $1,650 from $6,300.” |
| Combine under-18 expenses | “Expenses for children under 18 can be combined with the parents' expenses.” | CONFIRMED | --1: “Since Jen is under 18, Richard and Pauline can combine her medical expenses with theirs”. |
| Where to enter remainder (steps) | “total them and subtract the lesser of 3% of your net income from line 23600 or $2,834”; “enter the result on line 33099” | DIFFERS | --1: “On line 33099 ... enter the total amount”; “Subtract the amount of step 2 ... and enter the result on the following line”. Scope: the remainder is entered on the following line, not line 33099. |
| Receipts kept | “receipts for every medical expense claimed”; “Keep all receipts.” | CONFIRMED | --1: “Do not send any documents with your tax return. Keep them”; “Receipts – Receipts must show the name”. |
| Conditional prescriptions / certifications | “prescriptions or practitioner certifications where CRA requires them” | CONFIRMED | --1: “The List of common medical expenses indicates if you need a prescription”; “if you need a certification in writing”. |
| Choose 12-month period | “you can pick the 12-month period ending in the tax year that captures the most expenses” | DIFFERS | --1: “paid for the medical expenses in any 12-month period ending in 2025 did not claim them in 2024”. Dropped condition: the period-selection statement omits the no-prior-year-claim restriction; “check CRA's rule” does not express it. |
| Supports deduction / no double claim | “if you also claim the disability supports deduction on line 21500, split each expense between the two rather than claiming it twice” | CONFIRMED | --1: “You can claim these expenses on line 21500 or line 33099. You can also split the claim between these two lines, as long as the total ... is not more than the total expenses paid.” |

### medicinehat-fair-entry

Sources: `medicinehat-fair-entry--1.txt` (program page), `--2.txt` (application).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Transit percentage hedge | “75% off transit”; “It cuts 75% off monthly transit passes” | DIFFERS | --2: “Receive a reduction of up to 75% from the regular price of an age-appropriate monthly transit pass for up to two years.” Hedge: record drops “up to”. --1 says “Save 75%”; the supplied sources disagree on the hedge, requiring a decision, not a new percentage. |
| Annual transit maximum | “up to $630/yr”; “annual maximum of $630 of subsidy” | CONFIRMED | --1: “to an annual maximum of $630 per person/year”. |
| Recreation/arts allocation scope | “$200/yr recreation & arts”; “gives each approved person $200 a year toward City recreation and Esplanade arts programs” | DIFFERS | --1: “separate subsidies for each service area”; recreation: “Each family member ... will receive $200 per year”; Esplanade: “maximum user fee assistance ... per eligible year is $200.” Scope: record describes one shared $200 rather than separate $200 allocations. |
| Recreation/arts reduced rate / eligible program scope | “City recreation and Esplanade arts programs at 75% off.” | DIFFERS | --1: “City of Medicine Hat regular-priced recreation program and admissions at City-run swimming pools and leisure centres”; “educational programs directly provided by staff of the Esplanade”. Dropped conditions / scope: recreation regular-price and Esplanade educational/direct-provider restrictions are omitted. Percentage itself agrees. |
| One application | “One application” | CONFIRMED | --2: “I'd like access to the following offers (select only the ones you plan to use): Recreation user fee assistance Esplanade Arts and Heritage Centre education programs Transit pass”. |
| Up-to-two-year validity | “valid up to two years”; “Approval lasts up to two years” | CONFIRMED | --2: “access programs and supports throughout the city for up to two years (24 months).” |
| Least repetitive comparison | “one of the least repetitive programs to stay on” | NOT ON PAGE | No comparative renewal-frequency statement. |
| AISH proof | “Your AISH benefits card is accepted as proof.” | CONFIRMED | --1: “Assured Income for Severely Handicapped benefits (AISH): a copy of your current Health Benefits Card”. |
| Online application / phone | “Fill in the Fair Entry application online, or call 403-502-8001.”; “Fair Entry: 403-502-8001” | CONFIRMED | --1: “You can apply online”; “Please call us at 403-502-8001 ... assist you with your application.” |
| Residency proof / city scope (REQS.medicinehat) | “Proof of a Medicine Hat address”; “This is a City of Medicine Hat program.” | CONFIRMED | --1: “you must be a resident of Medicine Hat”; “You must provide proof of your address”. |
| CRA / Alberta Works alternatives | “a CRA notice, Alberta Works document” | CONFIRMED | --1: “Canada Revenue Agency: Notice of Assessment”; “Alberta Works: Income Subsidy/Support ... current Health Benefits Card”; “Alberta Works (Learners): an approval letter ... and the current Health Benefits Card”. Generic categories are supported, not an assertion that any document suffices. |
| Social-worker letter hedge / conditions | “or a social worker's letter” | DIFFERS | --1: “Only when no other documents are available. A letter dated within the last 30 days from a social worker/support staff with whom a current relationship exists.” Dropped conditions: fallback-only, recency, current relationship and required eligibility attestation omitted. FAQ gives the broad alternative; detailed proof section specifies its restrictions. |
| Decision timing (steps / time) | “Wait about two weeks for a decision.”; “About two weeks.” | DIFFERS | --1: “Your application will be processed within two weeks but your approval depends on the information you provide. If information is missing, it may delay your approval.” Hedge / scope: processing duration becomes decision duration without the information-dependent caveat. |
| Family listed / individual recreation subsidy | “List every family member on the one application — each approved person gets their own $200 recreation subsidy.” | CONFIRMED | --1: “Each family member listed on your approved application form will receive $200 per year.” |
| Route check (REQS.lowIncomeOrDisabilityIncome) | “Confirm the municipality's household-income limit or an accepted benefit-recipient route.” | CONFIRMED | --1: “Total household income must be less than the Low Income Cut-Off”; proof list includes AISH. The gate requests confirmation, not an unconditional AISH income exemption. |

### rdsp

Source: `rdsp--1.txt` (overview only; eligibility, amounts, contribution and contact details are linked, not reproduced).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Long-term DTC savings plan (REQS.dtc) | “A long-term savings account for people approved for the DTC.”; “Get approved for the Disability Tax Credit first — it unlocks this.” | CONFIRMED | --1: “a long-term savings plan to help people with disabilities who are approved for the Disability Tax Credit save for the future.” |
| Annual grant maximum | “Up to $3,500 grant” | NOT ON PAGE | No grant dollar amount or annual maximum stated. |
| Annual bond maximum | “$1,000 bond per year”; “up to $1,000/year” | NOT ON PAGE | No bond dollar amount or annual maximum stated. |
| Matching percentage | “matching grants (up to 300%)” | NOT ON PAGE | “matching grants” stated, but no percentage. |
| No contribution needed for low-income bond | “you don't even need to contribute to get the bond if your income is low.”; “even $0 contributions still earn the bond if your income is low.” | NOT ON PAGE | Contribution-free bond rule not stated. |
| Certain government additions (summary / about) | “A savings account where the government adds matching grants ... and bonds”; “The government pays in grants ... and bonds” | DIFFERS | --1: “When you open a plan, you may also get grants and bonds”; “Family income and amount of contributions determine how much matching grants and bonds you could get.” Hedge / dropped conditions: certain additions replace possible income/contribution-dependent additions. |
| Matching basis | “grants (matching what you put in)” | CONFIRMED | --1: “Family income and amount of contributions determine how much matching grants and bonds you could get.” |
| Bond lower-income characterization | “bonds (free money for lower incomes)” | NOT ON PAGE | Overview says family income determines amounts but does not state bond income eligibility or nonrepayability. |
| Free government money / repayment scope (amount) | “(free government money)” | NOT ON PAGE | --1 warns “Closing a plan may involve repayments” but does not establish when the record's grant/bond money is free to retain. No specific grant/bond repayment conditions reproduced. |
| Best-value comparison (note) | “One of the best-value benefits available.” | NOT ON PAGE | No comparison of benefit values stated. |
| Potential tens of thousands | “potentially tens of thousands of dollars over time.” | NOT ON PAGE | No aggregate dollar scale stated. |
| Most banks/credit unions | “Open one at most banks or credit unions” | NOT ON PAGE | “financial organization” stated, not prevalence or these institution types. |
| Financial organization opening | “Choose a bank or credit union that offers RDSPs.” | CONFIRMED | --1: “A plan can be opened for an eligible beneficiary directly at a financial organization.” Advice to choose an offering institution agrees; no universal bank availability asserted here. |
| Grant/bond earlier deadline than contributions | “Grants and bonds follow a different, earlier deadline than contributions.” | NOT ON PAGE | No age deadlines stated. |
| Grant age / calendar boundary | “until December 31 of the year in which the beneficiary turns 49.” | NOT ON PAGE | Not stated. |
| Bond age boundary | “until the year in which the beneficiary turns 49.” | NOT ON PAGE | Not stated. |
| SIN for opening (documents / REQS.rdspOpening short/unmet) | “the beneficiary needs a valid social insurance number” | NOT ON PAGE | Linked opening guidance not reproduced. |
| Canada residency when opened | “must be a resident of Canada when the plan is opened” | NOT ON PAGE | Not stated. |
| Canada residency each contribution | “and when each contribution is made.” | NOT ON PAGE | Not stated. |
| Opening age (documents / REQS.under60) | “You must be under 60 to open this.” | NOT ON PAGE | Not stated. |
| Contribution deadline (REQS.rdspContributionWindow short/unmet) | “until the end of the year in which the beneficiary turns 59.” | NOT ON PAGE | Not stated. |
| No annual contribution limit (same gate) | “There is no annual contribution limit” | NOT ON PAGE | Not stated. |
| Lifetime contribution limit (same gate) | “the lifetime contribution limit for a beneficiary is $200,000.” | NOT ON PAGE | Not stated. |
| First-$500 example | “for lower incomes, the first $500 you put in can become $1,500.” | NOT ON PAGE | No tier/example; cannot decide whether this refers to matching addition or total balance from the supplied overview. |
| Front-line familiarity | “front-line staff sometimes aren't familiar with it.” | NOT ON PAGE | Not stated. |
| Same-day opening | “Can be opened same-day once you have DTC approval.” | NOT ON PAGE | No opening duration stated. |
| Phone | “RDSP info: 1-866-204-0357” | NOT ON PAGE | Contact page linked, number not reproduced. |

### reddeer-fee-assistance — not checked

Both supplied files, `reddeer-fee-assistance--1.txt` and `--2.txt`, have first-line `status: ERROR`. Skipped both as instructed. No status-200 source remains, so no facts are classified or counted for this record. It is also listed under “Not checked: no snapshot”.

### richmond-rec-fee-subsidy

Source: `richmond-rec-fee-subsidy--1.txt` (detailed program page; linked form/FAQ not read as page contents).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Free drop-in scope (amount / summary) | “Unlimited free drop-in admission”; “free drop-ins with no cap” | DIFFERS | --1: “Unlimited free admission to many drop-in programs and services”. Scope / dropped qualification: unlimited visits become unqualified drop-in coverage; “many” appears in detail but not these assertions. |
| Detail drop-in scope | “unlimited free admission to many drop-in services” | CONFIRMED | --1: “Unlimited free admission to many drop-in programs and services”. |
| Registered-program scope (amount) | “90% off registered programs” | DIFFERS | --1: “A 90 per cent discount on most registered programs”. Scope / dropped hedge: the amount field omits “most”; summary and detail retain it but do not qualify the amount-field assertion. |
| Registered-program percentage / hedge (summary / detail) | “nine tenths off most registered programs.” | CONFIRMED | --1: “A 90 per cent discount on most registered programs”. |
| Child/youth cap and age | “$300 per year in subsidy for children and youth 18 and under” | CONFIRMED | --1: “Up to a maximum of $300 per year in subsidy for children and youth (18 years and under)”. |
| Adult/senior cap and age | “$100 per year for adults and seniors 19 and over.” | CONFIRMED | --1: “Up to a maximum of $100 per year in subsidy for adults and seniors (19+ years)”. |
| Financial hardship definition | “difficulty paying for basic living costs such as food, clothing and housing, without savings or other financial resources.” | CONFIRMED | --1: “difficulty paying for basic living costs such as food, clothing and housing, and does not have savings or other financial resources.” |
| Richmond / B.C. residence (REQS.bc / richmondbc) | “You live in Richmond.”; “This is a British Columbia program.”; “This is a City of Richmond program.” | CONFIRMED | --1: “individuals/households must live in Richmond”; footer “Richmond, British Columbia”. |
| City/participating-community programs | “most registered City and participating community programs” | CONFIRMED | --1: “offered by the City of Richmond and Community Associations and Societies.” |
| Two hardship methods | “review the two financial-hardship qualification methods” | CONFIRMED | --1: “financial hardship as determined by one of the following two methods.” |
| Current program-year application / dates | “Current 2026–2027 applications cover September 1, 2026 to August 31, 2027” | CONFIRMED | --1: “Applications are now being accepted for the 2026−2027 program year (Sep 1, 2026–Aug 31, 2027).” |
| Download application | “Download the application for the current program year” | NOT ON PAGE | “Apply for RFSP 2026-2027” link shown, but downloadable format not established. |
| One application per family/couple | “Complete one application per family or couple” | NOT ON PAGE | Household eligibility stated; application-count rule not reproduced. |
| Completed application with supporting documents | “Completed current-year application”; “attach the documents for the selected method” | CONFIRMED | --1: “Completed applications and supporting documents can be submitted”. |
| Residence proof requirement | “Proof of Richmond residence” | NOT ON PAGE | Residence is required, but required proof is in linked instructions, not enumerated here. |
| Government-assistance / income-hardship documentation | “Government-assistance confirmation or current income and financial-hardship documents required by the form” | CONFIRMED | --1: assistance and financial-limit routes; “Instructions for Required Documents ... supporting documents required to apply”. Confirms documentation tied to routes, not specific unseen documents. |
| Submission channels / locations | “Submit by email, mail or at a Richmond recreation facility, Cultural Centre or City Hall” | CONFIRMED | --1: “Email: subsidy@richmond.ca Mail: Recreation Fee Subsidy Program”; “In-person: at any City of Richmond recreation facility, the Richmond Cultural Centre or Richmond City Hall.” |
| Appointment-only help at City Hall | “book an in-person support appointment at City Hall”; “not drop-in” | CONFIRMED | --1: “In-person application support (by appointment only) is available at City Hall”; “no drop-in session.” |
| Approval letter | “Keep the approval letter” | NOT ON PAGE | Letter issuance/content not stated. |
| Subsidy when registering | “use the subsidy when registering for eligible activities” | CONFIRMED | --1: “A 90 per cent discount on most registered programs”. |
| Phone | “604-247-4909” | CONFIRMED | --1: “Phone: 604-247-4909”. |
| Lower-income gate (REQS.lowIncome) | “This is for lower-income households.” | DIFFERS | --1: “Individuals/households who are receiving government financial assistance from one of the following programs” OR those who “meet the following financial limits”. Scope: lower-income gate makes the income route universal despite separate government-assistance qualification with no listed income-limit test. |

### saanich-life

Source: `saanich-life--1.txt` (detailed L.I.F.E. page).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Benefit option scope (amount / about) | “Two years of free drop-ins at Saanich facilities plus a one-time grant of $80 to $120 toward registered programs”; “approval includes local drop-ins, regional visits and an age-based one-time program grant.” | DIFFERS | --1: “you can select from one of two options: Option 1: Free Drop Ins and Discounts”; “Option 2: 50% off Regional Recreation Pass”. Scope: Option 1 benefits described as inherent to approval without the option restriction. Summary acknowledges choice but does not qualify these assertions. |
| Two-year approval / two options | “Approval lasts two years and you pick one of two benefit options.” | CONFIRMED | --1: “valid for two years from date of approval and you can select from one of two options”. |
| Regional L.I.F.E. connection | “Saanich's version of the regional L.I.F.E. program.” | CONFIRMED | --1: “Other Greater Victoria Municipal Applications You must apply for the LIFE program in the Municipality you are a resident in.” |
| Grant amount range | “one-time grant of $80 to $120” | CONFIRMED | --1: “Adult (19-59): $80 grant”; “Youth (13-18yrs ): $120 grant”; “Child (5-12yrs): $120 grant”; “Preschool (0-4yrs): $80 grant”. |
| Initial grant term | “grant amounts below are for that whole two-year term” | CONFIRMED | --1: “This amount is all that is available for the full two-year term”; youth/child grants “valid until the expiry of L.I.F.E. pass.” |
| No further funds, universal hedge (note) | “there are no further funds once the initial grant is used.” | DIFFERS | --1, youth/children: “There may be some additional funds for children and youth only after initial funding has been utilized.” “funds are not guaranteed.” Scope / hedge: absolute denial omits possible child/youth supplementary funding. |
| Saanich residency / B.C. / district gates | “proof of Saanich residency”; “This is a British Columbia program.”; “This is a District of Saanich program.” | CONFIRMED | --1: “Saanich Resident”; “District of Saanich”; “BC identification card” and address “Victoria, BC”. |
| Utility/phone proof recency | “a utility or phone bill dated within the last three months” | CONFIRMED | --1: “a utility bill, phone bill dated in the last three months”. |
| Rental agreement | “a current signed rental agreement” | CONFIRMED | --1: “a current rental agreement with all applicable signatures”. |
| Driver's licence / BC ID | “a current driver's licence or BC identification card” | CONFIRMED | --1: “a current drivers license or BC identification card.” |
| One residence proof per family | “One proof covers the whole family.” | CONFIRMED | --1: “Only one proof of residency is required for all family members.” |
| Universal CRA statements (eligibility / requiresNote / steps / documents) | “You have a Canada Revenue Agency Proof of Income Statement for every household member 19 and over, even those who will not use the program.” | DIFFERS | --1: “There are other forms of eligibility based on other scenarios.” Changed-income route: “apply online using your adjudicator form as proof of income”; unsupported youth: “Youth Application form”. Scope: all-mode eligibility and steps impose the general-route statement on alternative routes; newcomer exception alone does not cover these other alternatives. The age/use criteria themselves match the general route. |
| Combined gross income | “Thresholds are based on their combined gross income.” | CONFIRMED | --1: “Financial thresholds are determined on the combined gross income from these statements of all adults in the household family.” |
| Newcomer landing papers / one-year boundary | “Newcomers to Canada without that statement can apply with landing papers showing a landing date within one year of applying.” | CONFIRMED | --1: “if ... a newcomer to Canada you can apply with a copy of your landing papers ... date of landing within one year of application.” |
| No Notices of Assessment | “Saanich only accepts CRA Proof of Income Statements, not Notices of Assessment.” | CONFIRMED | --1: “Effective immediately we will only be accepting Revenue Canada Proof of Income Statements.” Confirms income-statement type, not absence of explicitly published alternate routes. |
| Secure online application / upload copies | “Complete the secure online L.I.F.E. application and upload the documents” | CONFIRMED | --1: “Applications can now be completed privately and securely online”; “apply online with electronic copies.” |
| Under-$1,000 / special-situation direct contact | “If income shown is under $1,000 or the household has a special situation, contact the financial-assistance office directly” | CONFIRMED | --1: “If the income ... shows under $1,000 ... contact ... directly to apply”; “Other Forms of Eligibilty Documentation”; “please contact ... to see how we can assist.” |
| Grant setup duration / registration buffer | “grants take up to 5 days to appear on your account.”; “Allow at least five days after approval before trying to spend the grant” | CONFIRMED | --1: “Grants are added to your account after L.I.F.E. approval and can take up to 5 days to show on your account.” Advice preserves maximum setup time, not a mandatory five-day wait. |
| Low-income scope (REQS.lowIncome) | “This is for lower-income households.” | CONFIRMED | --1: “assists individuals and families living on a low income”. |

### taxi-saver-bctransit

Source: `taxi-saver-bctransit--1.txt` (Victoria region Taxi Saver page). Regional statements elsewhere are not inferred from Victoria's rules.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Half-price / 50% subsidy | “Half-price taxi coupons”; “Vouchers cover 50% of eligible taxi fares” | CONFIRMED | --1: “Provides a 50 percent subsidy on taxi fares”. |
| Victoria package price | “in the Victoria region, $40 buys an $80 package” | CONFIRMED | --1: “Eligible riders can buy: An $80 package of coupons for $40”. |
| Monthly package limit | “one package per month” | CONFIRMED | --1: “One package per month”. |
| Permanent registration (REQS.bcTransitHandyDart) | “You are a permanently registered handyDART customer.”; “Register as a permanent handyDART customer and obtain a handyPASS first.” | CONFIRMED | --1: “To use Taxi Saver, you must: Be a permanently registered handyDART customer”. |
| Minimum age (REQS.age12plus) | “You are 12 years of age or older.”; “You must be at least 12.” | CONFIRMED | --1: “Be 12 years of age or older”. |
| handyPASS required for purchase/use | “You have a handyPASS.”; “Current handyPASS” | CONFIRMED | --1: “You need a handyPASS to buy and use Taxi Saver coupons.” |
| One-off unavailable-handyDART trips | “for one-off trips when handyDART does not work.” | CONFIRMED | --1: “Taxi Saver vouchers help cover the cost of one time taxi trips when handyDART is not available.” |
| Denominations | “$1, $2 and $5 values” | CONFIRMED | --1: “Coupons in $1, $2, and $5 values”. |
| No change | “taxi drivers do not give change for them” | CONFIRMED | --1: “Taxi drivers do not give change for vouchers.” |
| Cash remainder (note) | “pay any remainder in cash.” | CONFIRMED | --1: “If the fare is $5.80, you pay $5.00 in coupons and $0.80 in cash.” |
| No transfer | “Coupons cannot be transferred” | CONFIRMED | --1: “Vouchers cannot be transferred to other people or transit systems”. |
| No tips | “or used as a tip.” | CONFIRMED | --1: “Vouchers cannot be used as tips”. |
| Other regions' program versions / varying rules | “other BC Transit regions run their own versions”; “other regions can set different prices, purchase methods and taxi companies.” | NOT ON PAGE | Transit-system directory shown, but Taxi Saver versions/rule variation not stated. |
| Regional office / approved outlet purchase | “Buy vouchers from the regional Taxi Saver office or approved outlet” | NOT ON PAGE | --1 gives mail-order procedure, not these purchase outlets. |
| Accepted purchase payment | “Payment accepted by the regional Taxi Saver office” | CONFIRMED | --1: “A cheque for $40 payable to BC Transit”. Record does not assert a particular unlisted payment option. |
| Direct participating-company booking / pass use | “Book a participating taxi directly and show your handyPASS” | CONFIRMED | --1: “Book your taxi directly with a participating company. Confirm they accept Taxi Saver vouchers.” “Requires a handyPASS to use”. |
| Metered fare | “Use vouchers for part of the metered fare” | CONFIRMED | --1: “Use coupons to pay the metered fare.” |
| Remainder method (steps) | “pay any remainder using a method the taxi accepts” | DIFFERS | --1: “If the fare is $5.80, you pay $5.00 in coupons and $0.80 in cash.” Scope / dropped condition: cash remainder becomes any taxi-accepted method; note retains cash, but steps broaden it. |
| Participating companies can change | “companies can change” | CONFIRMED | --1: “Yellow Cab is no longer part of the Taxi Saver program.” |
| Phone | “Victoria region: 250-995-5618” | CONFIRMED | --1: “Contact the Taxi Saver Office Call 250-995-5618”. |
| B.C. scope (REQS.bc) | “This is a British Columbia program.” | CONFIRMED | --1: “BC Transit operates ... throughout British Columbia”. Victoria-specific benefit rules are expressly labelled in the record. |
| Metro Vancouver alternative (REQS.outsideMetroVancouver short/unmet) | “Use the TransLink program in Metro Vancouver; this listing is for B.C. Transit communities.” | NOT ON PAGE | No TransLink or Metro Vancouver program comparison stated. |
| Functional transit barrier (REQS.transitBarrier) | “This is for someone who cannot use regular public transit without assistance for some or all trips.” | NOT ON PAGE | Permanent handyDART registration required, but its functional eligibility criteria not reproduced. |

## Fixes applied 2026-10-15

- Consistency follow-up to review round 2026-10-15 F1: Richmond's financial-hardship gate now meets only via the existing low-income route; `bcAssistance: pwd` does not establish current receipt of listed assistance. Fixed status, unmet text and cue remain unchanged; oracle and matcher regressions now expect non-low-income Richmond PWD profiles to be `almost` (asset version remains 173).

All twenty-four decisions have been applied. The item → fields → new wording
ledger, new gate semantics and deliberate oracle status changes are recorded in
Implementation progress above (written during the work, not reconstructed at end).
The original evidence tables remain historical findings, not reclassified facts.

### Additional repeated surfaces and validation

- Item 5 also updates the HATC summary to DTC eligibility at any time in the year,
  or senior age at year end, with certain family claimants; not personal approval only.
- Repeated BENEFIT_VALUES notes corrected for Edmonton, Lethbridge, Medicine Hat,
  Richmond and Saanich. Medicine Hat processing caveats and Saanich alternative
  documents also carried into BENEFIT_META. No numeric estimate computation used
  the changed amounts: these values are discounts, not cash/grant/tax-credit totals.
- Medicine Hat's full eligibility and separate allocations are split across five
  aboutList items. Saanich's choices are split across four aboutList items.
  Medical-expense supported relatives/residency and social-worker letter conditions
  are split into steps/document items without deleting qualifiers.
- Added four short/who entries to research/207-shorts/shorts-applied.json, matching
  the new REQS metadata and preserving the reviewed-cue inventory contract.
- Grep of every requires array confirms only HATC and Richmond changed gate keys.
  Shared homeowner, homeRenoCandidate, qualifyingRenovationSpend and lowIncome
  definitions are byte-identical to HEAD. Remaining users: four, two, two and
  twenty-nine respectively. Saanich still uses lowIncome. The other seven Alberta
  lowIncomeOrDisabilityIncome users and gate are unchanged.
- csg-dse source URL and the complete BENEFIT_VERIFIED map compare unchanged to HEAD.
  No unrelated NOT ON PAGE facts were promoted to verified.
- Asset pins advanced from 172 to 173 in index and font CSS; generated guides all
  inherit 173. DATA_CHANGELOG entry added. gen:context and gen:guides succeeded
  (134 context records; 133 benefit guide pages plus the index).

### Surface baseline decision

Allowed increases are solely qualifier-preserving source wording:

- gate.unmet: 90 → 94, the four new source-qualified isolated gates, each with a
  short cue; no existing shared gate was made denser.
- detail.about: 88 → 90, RDSP's income/contribution-dependent possibility and
  Saanich's explicit choice. Saanich also has a short-item guide list.
- note: 57 → 58, Edmonton's “may”, household-size limits and listed-program check.
- eligibility.note remains 37; detail.aboutList.items remains 144 after splitting
  Medicine Hat's full conditions; summary remains 25. Uncued flagged gates remain one.

The baseline was edited deliberately for these three counts only; no blanket
ratchet reset. npm run check:surfaces succeeded and regenerated its review report.

### Test progress

- Initial npm test: five failures (four density ratchets and the short-cue inventory).
  Corrected by the justified baseline changes, list splitting and inventory additions;
  no assertions weakened or skipped.
- Subsequent npm test: 160 passed, zero failed, zero skipped. After one further
  wording regression test, final npm test: **161 passed, zero failed, zero skipped**.
- First full Chromium run: 230 passed of 232 listed, two failed. The new direct-gate
  test initially read answers after evaluateAnswers restored the real model;
  fixed the test to scope and restore the model itself. The existing renovation
  regression expected “the qualifying renovation” for all credits; HATC's decision
  says “a qualifying renovation”. It now checks HATC's exact new wording plus its
  non-refundable/tax-owed restriction, retaining the original shared-credit check.
- Final whole-project command: `npx playwright test --project=app-chromium --workers=1`.
  **232 passed of 232 listed, zero failed** (22 files; 3.7 minutes), no grep,
  retries, skips or narrowed rerun. Includes the full eligibility oracle and both
  new browser regressions. Log: outputs/task219-batch2-playwright-final.log.
- Final npm run check:surfaces: succeeded, counts as documented above.
  Final git diff --check and JavaScript syntax checks: passed.

### Changed files

146 tracked files changed, plus this supplied, initially untracked report:

- public/data.js — ten benefit records and repeated display metadata.
- public/app.js — only the four new isolated REQS entries.
- public/changelog.js — new DATA_CHANGELOG entry.
- public/index.html; public/styles.css — all pinned assets/fonts use 173.
- public/guides/*.html — all 134 generated HTML files (133 benefits plus index),
  including wording updates for affected guides and version-only updates elsewhere.
- src/benefits-context.js — regenerated assistant summaries and benefit details.
- e2e/oracle/oracle-spec.js — deliberate gate/status semantics, version 1.19.0.
- e2e/matcher-safety.spec.js — two new regressions and HATC-specific wording check.
- test/factual-batch.test.js — four new tests covering changed prices, subsidy
  limits, conditional wording, tax-return lines, documents and gate isolation.
- research/207-shorts/shorts-applied.json — four new reviewed short/who entries.
- research/197-info-density/dense-surface-baseline.json — only three justified
  qualifier-preserving count increases.
- research/197-info-density/DENSE-SURFACES-REPORT.md — regenerated density review.
- research/reverify/REPORT-2026-10-15-batch2.md — this implementation ledger.

New run artifacts only: outputs/task219-batch2-{context,guides,unit-initial,unit,
surfaces-initial,surfaces,playwright,playwright-listed,playwright-final}.log.
The supplied decisions and snapshots, existing output artifacts and node_modules
remain untouched. No TASKVIEW-*.md, AGENTS.md, OWNER-DIGEST.md or .taskview/ edits.
No commit or push.


