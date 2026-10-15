# Snapshot re-verification report — 2026-10-16, batch 6

Original verification follows; implementation progress is recorded below.

## Implementation progress

- Read all twenty-eight FIX decisions and the full evidence report before editing.
- Scope: the thirteen affected records; snapshots are the only factual authority.
- Preserve all adjacent NOT ON PAGE claims, shared gates, AISH medical and financial confirmation, and every verification date.
- Items one and twenty-four preserve readiness. Planned status changes: MHRTC non-senior/no-DTC and Special Needs Housing non-citizen/PR become almost instead of no; AISH seniors become almost with an OAS check (under-eighteen stays no); CLBC intellectual/autism profiles with later onset become almost instead of no. No new AISH ready path.
- Validation and final changed-file inventory will be appended after regeneration and testing.

## Method and scope

Evaluated `public/data.js` in a Node `vm` with `{window:{}, document:{}, console}` and exported `BENEFITS`, `BENEFIT_VALUES`, and `BENEFIT_META`, as in `scripts/check-readability.js`. Evaluated the isolated `REQS` declaration for each record's requires; read unmet and short text without calling matchers, with external references stubbed. No grep-parsing of benefit records. Repeated assertions are consolidated; distinct factual metadata is included. Internal flags, labels, URLs, difficulty ratings, and advice without factual assertions are not counted.

Facts count distinct assertions, not occurrences or numeric tokens. Inseparable amount/period and route/conditions may share a row; independent assertions are separate. CONFIRMED requires a supporting quotation. DIFFERS identifies number, boundary, hedge, dropped condition or scope inconsistencies. NOT ON PAGE means absent from supplied usable sources, not false. Hedges are checked both ways; a maximum hedge alone does not contradict a maximum unless the source fixes the amount. Source-only facts are not invented as record assertions, but conditions dropped from asserted routes are identified. Quotes are verbatim excerpts; filenames are relative to `research/reverify/snapshots/`. No linked content is presumed read.

The report date is the requested batch label, not a fetch-date claim. Supplied headers retain their actual timestamps. AISH and RAMP changes need extra care: `AGENTS.md`, `e2e/aish-profiles.spec.js`, and matcher-safety preserve conservative confirmation; AISH must never become ready from work-impact answers. This is a factual report, not permission to change gates.

## Summary table

| Record id | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| lloydminster-recreation-access | 5 | 4 | 1 | 0 |
| multigenerational-home-renovation-tax-credit | 29 | 5 | 1 | 23 |
| ramp | 28 | 24 | 1 | 3 |
| sprucegrove-low-income-transit | 9 | 9 | 0 | 0 |
| ab-capcc | 20 | 17 | 0 | 3 |
| ab-service-dog-id-card | 20 | 17 | 2 | 1 |
| ab-special-needs-housing | 23 | 16 | 5 | 2 |
| adult-health-benefit | 25 | 17 | 3 | 5 |
| aish | 32 | 22 | 3 | 7 |
| bc-clbc | 30 | 15 | 3 | 12 |
| bc-fnha-health-benefits | 22 | 5 | 0 | 17 |
| bc-pharmacare-plan-g | 13 | 9 | 2 | 2 |
| bc-pharmacare-plan-p | 13 | 11 | 1 | 1 |
| bc-work-able-internship | 22 | 15 | 3 | 4 |
| bc-workbc-assistive-technology | 33 | 19 | 2 | 12 |
| canmore-affordable-services | 8 | 7 | 1 | 0 |
| **Total (16 records)** | **332** | **212** | **28** | **92** |

Counts are evidence-limited, not a declaration that unsupported assertions are false.

## DIFFERS — needs a decision

Each numbered item corresponds to one DIFFERS assertion row. No wording is proposed.

1. **lloydminster-recreation-access — `summary / detail.documents[1] / REQS.lloydminster`**
   - Current: “qualifying Lloydminster residents”; “Proof of Lloydminster residence”
   - Snapshot quote / difference: “The residency requirement does not apply to First Nations, Metis, and/or Inuit applicants.” Dropped exception in blanket residence requirement.

2. **multigenerational-home-renovation-tax-credit — `REQS.homeRenoCandidate`**
   - Current: “DTC eligibility (any age), age 65+, or ... supporting family member living with the person”
   - Snapshot quote / difference: “a senior or an adult who is eligible for the disability tax credit”. Boundary/scope: any-age DTC route is wider than adult DTC; supporting-family route cannot alone replace the qualifying individual.

3. **ramp — `detail.about / detail.aboutList.items[1]`**
   - Current: “You qualify by one of three routes”
   - Snapshot quote / difference: “You may be eligible ... if you are”; requires income/residency and project rules as well. Hedge/scope: mobility route is not a qualification decision.

4. **ab-service-dog-id-card — `note / detail.tips[2]`**
   - Current: “or ... 310-0000 toll-free inside Alberta”
   - Snapshot quote / difference: --1: “Toll free: 310-0000 before the phone number (in Alberta)”. Scope: access prefix presented as standalone alternative team number.

5. **ab-service-dog-id-card — `detail.about / detail.aboutList.items[2]`**
   - Current: “identification card page does not itself set out the access rights the card confers”
   - Snapshot quote / difference: --1: “verifies that an individual and their service dog have protected public access rights in Alberta”; “ensure access to public places”. Scope: page now expressly describes public access rights.

6. **ab-special-needs-housing — `eligibility.items[2] / requiresNote`**
   - Current: “Ukrainian evacuees ... also qualify”
   - Snapshot quote / difference: --1: “evacuees from Ukraine with Canada-Ukraine Authorization for Emergency Travel are eligible to apply”; “Some housing providers may have additional eligibility criteria”. Hedge/scope: eligible to apply becomes qualification.

7. **ab-special-needs-housing — `REQS.citizenPR`**
   - Current: “must be a Canadian citizen or permanent resident”
   - Snapshot quote / difference: --1: “refugee sponsored by the Government of Canada, or privately sponsored refugee whose sponsorship has broken down”; “evacuees from Ukraine with Canada-Ukraine Authorization for Emergency Travel are eligible to apply”. Dropped alternatives in shared gate despite broader record text.

8. **ab-special-needs-housing — `detail.about / detail.aboutList.items[2]`**
   - Current: “30% of total annual household income ... Community Housing”
   - Snapshot quote / difference: --1: “30% of a household total annual income (non-senior household)”. Dropped non-senior-household restriction in the generalized comparison.

9. **ab-special-needs-housing — `detail.about / detail.aboutList.items[2] / detail.tips[1]`**
   - Current: “30% of total annual household income ... Seniors apartments”
   - Snapshot quote / difference: --1: “30% of a households adjusted income”. Number unchanged; basis differs from total annual income.

10. **ab-special-needs-housing — `detail.time / detail.tips[0] / REQS.abSpecialNeedsHousingPlacement`**
   - Current: “each provider keeps its own waiting list”; “Applying to one does not put you on another's list”
   - Snapshot quote / difference: --2: “Each housing operator may keep a waitlist when there are no current vacancies”. Hedge: possible vacancy-dependent lists become universal; nontransfer rule not stated.

11. **adult-health-benefit — `amount`**
   - Current: “Free prescriptions, dental, optical and more”
   - Snapshot quote / difference: “Talk to ... provider ... to learn what is paid for”; “may cover your remaining costs”; eligible lists/agreements restrict coverage. Scope/hedge: not all these services are unconditionally free.

12. **adult-health-benefit — `detail.steps[2] / detail.documents[0] / BENEFIT_META.effort`**
   - Current: “Submit it with proof of income”; “tax assessment”
   - Snapshot quote / difference: Standard application: “Consent for Canada Revenue Agency to Verify Income”; NOA/income documents appear in reassessment routes. Scope: reassessment documents presented as universal initial requirement.

13. **adult-health-benefit — `detail.phone`**
   - Current: “Alberta Supports: 1-877-644-9992”
   - Snapshot quote / difference: “Connect with the Health Benefits Contact Centre: Phone: 780‑427‑6848 Toll free: 1‑877‑469‑5437”. Number/purpose: generic Supports is not the program contact provided for health-benefit questions.

14. **aish — `REQS.adult`**
   - Current: “people aged 18–64”
   - Snapshot quote / difference: --1: “at least 18 years old and not eligible to receive an Old Age Security pension”. Boundary: OAS eligibility, not fixed age 65, is the upper restriction.

15. **aish — `detail.tips[5]`**
   - Current: “you are responsible for paying it”
   - Snapshot quote / difference: --1: “government will cover the cost of one ... Medical Report for AISH clients who transitioned to ADAP and later choose to be assessed for AISH”; “not time-limited”. Dropped exception despite retained Income Support exception.

16. **aish — `detail.tips[8]`**
   - Current: “left AISH or ADAP less than 2 years ago”
   - Snapshot quote / difference: --2: “less than 2 years since you got your last AISH benefits”. Boundary: departure from either program is not the stated last-AISH-benefit clock.

17. **bc-clbc — `summary / detail.tips[0]`**
   - Current: “to have services ready at 19”; “means supports can begin right at 19”
   - Snapshot quote / difference: --1: “What funded support people get, and when, depends on how urgent their situation is and the amount of funding CLBC has at the time of the request”. Dropped timing/resource contingency.

18. **bc-clbc — `REQS.developmental`**
   - Current: “For an intellectual / developmental disability that began before age 18”
   - Snapshot quote / difference: --2: PSI supports an adult who “does not have a developmental disability” but has ASD/FASD and adaptive limits. Dropped PSI alternative from universal gate.

19. **bc-clbc — `note`**
   - Current: “can often be reused”
   - Snapshot quote / difference: --2: “Sometimes these assessments have already been done when you were in school”. Hedge/frequency: sometimes existing is not often reusable.

20. **bc-pharmacare-plan-g — `detail.tips[0]`**
   - Current: “coverage simply stops after a year”
   - Snapshot quote / difference: “Coverage is for up to 1 year”. Boundary: tip fixes duration at one year instead of retaining up-to.

21. **bc-pharmacare-plan-g — `detail.tips[2]`**
   - Current: “Substance use is covered by the same route”
   - Snapshot quote / difference: “covers certain psychiatric medications”; team is “mental health and substance use location”. Scope: team's name does not establish substance-use treatment coverage (page separately places OAT under Plan Z).

22. **bc-pharmacare-plan-p — `detail.steps[1] / detail.tips[1]`**
   - Current: “equipment that come with eligibility”; “Supplies and equipment come through”
   - Snapshot quote / difference: --1: “Eligible patients can also receive”. Hedge: possible provision becomes assured entitlement.

23. **bc-work-able-internship — `eligibility.items[0] / requiresNote / REQS.recentGraduate`**
   - Current: “recent post-secondary graduate ... within 3 years”
   - Snapshot quote / difference: “Two-year diploma, associate degree, bachelor&rsquo;s degree, master&rsquo;s degree or doctorate from a recognized post-secondary institution”. Dropped credential/institution restriction in broad graduate rule.

24. **bc-work-able-internship — `REQS.disabilityDoc`**
   - Current: “Have a qualified professional verify ... first”
   - Snapshot quote / difference: “Self-identify as having a disability”; “does not ask ... specific disability or diagnosis”. Scope: professional verification imposed in addition to the self-identification route.

25. **bc-work-able-internship — `note / detail.steps[0]`**
   - Current: “next intake ... opens in spring 2027”
   - Snapshot quote / difference: “check back in Spring 2027 for information on the 2027/28 ... intake”. Hedge: information timing becomes definite application opening.

26. **bc-workbc-assistive-technology — `eligibility.note / requiresNote`**
   - Current: “self-employment count”
   - Snapshot quote / difference: --1: “self-employment (proof of regular income is required)”. Dropped regular-income proof condition.

27. **bc-workbc-assistive-technology — `note`**
   - Current: “Covers work-related needs only”
   - Snapshot quote / difference: --1 excludes services “not employment or volunteer related”. Scope: only-work framing drops eligible employment-goal volunteer needs, despite elsewhere retaining volunteer route.

28. **canmore-affordable-services — `amount / summary / note / detail.about / BENEFIT_VALUES.note`**
   - Current: “local transit”
   - Snapshot quote / difference: “Regional ROAM Transit ... adult ten-ride and adult monthly passes”. Scope: page's transit offer is regional, not local transit generically.

## Skipped snapshots

None: all 23 requested-record snapshots have first-line `status: 200`.

Evidence limitations, not non-200 skips: the two FNHA sources duplicate the landing page; the MHRTC overview does not reproduce its linked eligibility/expense/claim pages; the Plan P information-sheet index does not reproduce PDF contents. These omissions remain NOT ON PAGE. Contact numbers are compared for the same stated purpose; absent numbers are not treated as conflicting numbers.

## Per-record detail

### lloydminster-recreation-access

Sources: `lloydminster-recreation-access--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Adult admission; amount, note, values | “$2 adult drop-in admission at City recreation facilities” | CONFIRMED | “$2.00 Adult (18+ years) admission”; “only applicable for drop-in or memberships at select city-operated facilities”. |
| Reduced-cost low-income route; summary, about, REQS.lowIncome | “qualifying low-income residents” | CONFIRMED | “income-based”; “access these facilities at a reduced cost”. Nonexclusive income route. |
| Residency; summary, documents, REQS.lloydminster | “qualifying Lloydminster residents”; “Proof of Lloydminster residence” | DIFFERS | “The residency requirement does not apply to First Nations, Metis, and/or Inuit applicants.” Dropped exception in blanket residence requirement. |
| Income evidence; documents, metadata effort | “Proof of household income” | CONFIRMED | “Proof of Income Please submit a copy of ONE of these documents”. |
| Application | “Apply with the documents the City requests” | CONFIRMED | “Submit your signed application with supporting documents”. |

### multigenerational-home-renovation-tax-credit

Sources: `multigenerational-home-renovation-tax-credit--1.txt` (overview only; linked subpages not supplied).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Rate, ceiling, year; amount, summary, note, values | “14.5% of up to $50,000 ... maximum of $7,250 (2025 tax year)” | CONFIRMED | “Tax year: 2025”; “up to $50,000”; “14.5% of your costs, up to a maximum of $7,250”. |
| Refundable federal tax-return credit; metadata effort | “refundable federal credit” | CONFIRMED | “Federal: Line 45355”; “refundable tax credit ... claimed on your income tax and benefit return”. |
| Secondary-unit purpose; eligibility, REQS.mhrtcSecondaryUnit | “self-contained secondary unit ... senior ... adult ... Disability Tax Credit ... relative” | CONFIRMED | “create a self-contained secondary unit”; “allow a senior or an adult who is eligible for the disability tax credit to live with a qualifying relative”. |
| Completion requirement / completion-year limit | “qualifying renovation has actually been done” | CONFIRMED | “for each qualifying renovation that is completed”. Completion requirement only; claim-year allocation separately unsupported. |
| Claim line | “line 45355” | CONFIRMED | “Federal: Line 45355”. |
| 2024-and-later scope | “for the 2024 and later tax years” | NOT ON PAGE | “Prior tax years: 2024 and earlier” does not establish the asserted start year. |
| Qualifying individual ages and year boundaries | “65 ... at the end ... or 18 to 64 ... at any time in that year” | NOT ON PAGE | Overview names senior/adult DTC, not exact ages or timing. |
| Lifetime limit; note, eligibility, REQS.mhrtcSecondaryUnit | “Only one renovation ... during their lifetime” | NOT ON PAGE | No lifetime restriction in overview. |
| Claimant residency dates | “resident of Canada from January 1 to December 31” | NOT ON PAGE | Claimant definitions on linked page only. |
| Claimant residence intention / deadline | “ordinarily resides ... within 12 months” | NOT ON PAGE | No 12-month claimant rule. |
| Claimant spouse/relation/owner alternatives | “cohabiting spouse or common-law partner ... owns the home ... qualifying relation” | NOT ON PAGE | No claimant alternatives enumerated. |
| Home Canada location, ownership year and shared residence deadline | “in Canada ... owned ... during ... tax year ... both ... within 12 months” | NOT ON PAGE | No dwelling ownership/location/time conditions reproduced. |
| Unit facilities; REQS short/unmet, about, steps | “private entrance, kitchen, bathroom and sleeping area” | NOT ON PAGE | Self-contained named, facilities not enumerated. |
| New construction / nonqualifying existing space | “newly constructed ... did not already meet local requirements” | NOT ON PAGE | No such construction rule in overview. |
| Local permits/codes/by-laws | “must meet applicable local requirements, permits, codes and by-laws” | NOT ON PAGE | Not reproduced. |
| Relation age/year boundary | “18 ... at the end of the tax year” | NOT ON PAGE | No relation age definition. |
| Named relations | “parent, grandparent, child, grandchild, brother, sister, aunt, uncle, niece or nephew ... spouse or common-law partner” | NOT ON PAGE | “qualifying relative” only. |
| Claim completion tax year / multiyear allocation; metadata wait | “tax year in which the renovation period ended”; “at tax time” | NOT ON PAGE | Completed renovations named, no allocation rule or filing schedule. |
| Renovation period start/end and examples | “first qualifying expenditure ... made or incurred ... building permit ... final inspection ... proof of project completion” | NOT ON PAGE | Period not defined. |
| Splitting credit and all four restrictions | “split ... each ... eligible ... total ... maximum ... only ... expenditures they incurred ... no MHRTC ... previously claimed” | NOT ON PAGE | No sharing rule. |
| Schedule / form | “Schedule 12” | NOT ON PAGE | Overview links How to claim, no schedule number. |
| Invoice particulars | “vendor ... business address and GST/HST registration number if any”; goods/delivery/work dates, description, address, invoice amount | NOT ON PAGE | Documentary particulars absent. |
| Proof-of-payment types | “payment in full ... credit card slip or cancelled cheque” | NOT ON PAGE | No proof-of-payment instructions. |
| Actual-payment prerequisite; REQS.qualifyingRenovationSpend short/unmet | “only once ... done and paid for” | NOT ON PAGE | Completion supported; actual-payment prerequisite is not stated. |
| No double claim / named credits | “cannot also be claimed for ... medical expense tax credit or ... home accessibility tax credit” | NOT ON PAGE | No stacking restrictions. |
| Reimbursements/assistance/rebate reduction | “receive or are entitled to receive ... GST/HST rebates” | NOT ON PAGE | No offset rules. |
| Multiple renovations in year | “more than one qualifying renovation in the same year” | NOT ON PAGE | No explicit same-year multiple-renovation permission. |
| Shared home-candidate gate; REQS.homeRenoCandidate | “DTC eligibility (any age), age 65+, or ... supporting family member living with the person” | DIFFERS | “a senior or an adult who is eligible for the disability tax credit”. Boundary/scope: any-age DTC route is wider than adult DTC; supporting-family route cannot alone replace the qualifying individual. |
| Historical popularity claim | “15% and $7,500 are widely quoted” | NOT ON PAGE | Overview supplies current rate, not prevalence of old figures. |

### ramp

Sources: `ramp--1.txt`. **Extra-care flag:** preserve conservative mobility and income/residency confirmation; no diagnosis-only eligibility verdict.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Annual amount / benefit year; values | “up to $12,000 per person ... April 1 to March 31” | CONFIRMED | “up to $12,000 per person each benefit year (April 1 to March 31)”. |
| Ten-year maximum; values | “up to $24,000 ... within 10 years” | CONFIRMED | “up to $24,000 per person within 10 years”. |
| Alberta grant / access purpose; REQS.ab, homeAccessNeed | “enter and move within your own living space” | CONFIRMED | “enable you to enter and move within your own living space”; “properties in Alberta”. |
| Safety-only alternative; REQS.homeAccessNeed | “for access or safety” | NOT ON PAGE | Access supported; independent safety-only route not specified. |
| Wheelchair route; REQS.rampMobilityRoute | “any age ... wheelchair” | CONFIRMED | “an Albertan of any age who uses a wheelchair”. |
| Walker route / age / ongoing condition | “65 or older ... 4-wheel walker on an ongoing basis” | CONFIRMED | “a senior (65+ years) who uses a 4-wheel walker on an ongoing basis”. |
| Named conditions; REQS.rampMobilityRoute | “multiple sclerosis, muscular dystrophy, ALS, COPD, Parkinson's ... Alzheimer's ... spina bifida ... spinal cord injury ... non-recovering stroke” | CONFIRMED | “multiple sclerosis muscular dystrophy ALS (Lou Gehrig's disease) COPD ... Parkinson's disease Alzheimer's disease spina bifida spinal cord injuries non-recovering stroke”. |
| Eligibility certainty; about/aboutList | “You qualify by one of three routes” | DIFFERS | “You may be eligible ... if you are”; requires income/residency and project rules as well. Hedge/scope: mobility route is not a qualification decision. |
| Citizenship; REQS.citizenPR | “Canadian citizen or permanent resident” | CONFIRMED | “a Canadian citizen or permanent resident”. |
| Alberta residence duration; REQS.rampIncomeAndResidency | “90 continuous days” | CONFIRMED | “lived in Alberta for 90 continuous days”. |
| Income endpoint single | “$36,900 for a single adult” | CONFIRMED | “Single Adult $36,900”. |
| Income endpoint couple/five children | “$94,500 for a couple with five children” | CONFIRMED | “Couple, 5 children $94,500”. No intermediate table amounts asserted. |
| Wheelchair child increment | “plus $7,131 when a child permanently uses a wheelchair” | CONFIRMED | “An additional $7,131 ... child who permanently uses a wheelchair”. |
| Income exception hedge | “exceptions may apply ... within $1,200” | CONFIRMED | “exceptions may be made for income within $1200”. |
| Occupancy routes | “homeowner, a tenant ... living with family” | CONFIRMED | “a homeowner, tenant or living with family”. |
| Indigenous reserve scope | “on- or off-reserve” | CONFIRMED | “an Indigenous person living off- or on-reserve”. |
| Permanence exception; note/tips | “must be permanent”; “temporary ... case by case” | CONFIRMED | “be permanent – RAMP will review requests for temporary modifications on a case-by-case basis”. Read together, exception retained. |
| Completion deadline / exception | “within 90 days of approval unless ... longer” | CONFIRMED | “completed within 90 days of approval, unless authorized by RAMP”. |
| Guidelines and incomplete applications | “incomplete applications will not be processed” | CONFIRMED | “Incomplete applications will not be processed”; “Step 1. Read the guidelines”. |
| Three universal forms | “Checklist ... Application Form ... Modification Recommendation Form” | CONFIRMED | “All applicants RAMP Application Checklist RAMP Application Form RAMP Modification Recommendation Form”. |
| Four conditional forms | “Landlord Agreement, Band Council Resolution, Sponsor Income Verification, or Disclosure Consent” | CONFIRMED | “Landlord Property Modification Agreement Form”; “Band Council Resolution Form”; “Sponsor Income Verification Form”; “Consent to Disclose Personal and/or Health Information Form”. |
| Postal/email route and full address | “RAMP, Assisted Living and Social Services, PO Box 808 Edmonton Main, Edmonton, AB T5J 2L4” | CONFIRMED | “RAMP Assisted Living and Social Services PO Box 808 Edmonton Main Edmonton, Alberta T5J 2L4 Email”. |
| Citizenship/residence proof documents | “Proof ... citizenship ... 90 continuous days” | NOT ON PAGE | Eligibility specified; particular proof requirements in unsupplied checklist. |
| Income verification documents; metadata effort | “Family income verification” | NOT ON PAGE | Income eligibility and sponsor form supported; general verification documents not reproduced. |
| Priority routes | “awaiting hospital discharge or ... palliative care” | CONFIRMED | “will be prioritized ... awaiting hospital discharge or are in palliative care”. |
| No appeal / updated reapplication | “no appeal process ... reapply with updated information” | CONFIRMED | “does not have an appeal process”; “reapply by updating ... new or additional information”. |
| Form updates / interim use | “being updated ... use the current forms ... until the new ones appear” | CONFIRMED | “will be updated in the next several weeks and existing forms should be used in the meantime”. |
| Decision timing / hedge; metadata wait | “should receive ... within 30 days”; “About 30 days” | CONFIRMED | “You should receive a letter ... within 30 days of applying”. |

### sprucegrove-low-income-transit

Sources: `sprucegrove-low-income-transit--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Local monthly price; values | “$25/month local” | CONFIRMED | “Low Income Transit Pass) $25 $50”; “Local and Commuter monthly passes”. |
| Commuter monthly price; values | “$50/month commuter” | CONFIRMED | “Low Income Transit Pass) $25 $50”. |
| Subsidized City program | “City of Spruce Grove subsidized transit pass” | CONFIRMED | “Subsidized rates are offered”. |
| Geographic scope; REQS.sprucegrovearea | “Spruce Grove ... Stony Plain and Parkland County residents” | CONFIRMED | “All Spruce Grove, Stony Plain, and Parkland County residents are eligible”. |
| Income gate; REQS.lowIncome | “qualifying ... lower-income households” | CONFIRMED | “household income ... must not exceed the Low-Income Cut-Off ... +25%”. Record states no exact threshold. |
| Year-round applications; metadata wait | “accepted year-round” | CONFIRMED | “Applications ... can be completed year-round”. |
| Address evidence | “Proof of address” | CONFIRMED | “Proof of address and household income are required”. |
| Income evidence; metadata effort | “Proof of household income” | CONFIRMED | “Proof of address and household income are required”. |
| Adult price applicability | “Qualifying adults can buy” | CONFIRMED | Fare table labels “Low Income Adult (Low Income Transit Pass)”. |

### ab-capcc

Sources: `ab-capcc--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Alberta adult disability / facility scope | “adults with disabilities ... facility-based continuing care in Alberta” | CONFIRMED | “adults with disabilities in facility-based continuing care”; “adult Albertan”. |
| Upper age boundary; eligibility, REQS.adult | “under ... 65”; “18–64” upper boundary | CONFIRMED | “an adult Albertan under the age of 65”. |
| Exact lower age; REQS.adult | “18–64” lower boundary | NOT ON PAGE | Page says adult but does not publish numeric age 18. |
| Home type; eligibility, REQS.abCapccContinuingCareHome | “type A or type B continuing care home” | CONFIRMED | “living in type A or type B continuing care home”. |
| Participation and communication conditions | “actively participate ... following through ... communicate ... preferences” | CONFIRMED | “able to actively participate in establishing and following through with your goals and able to communicate your preferences”. |
| Isolation purpose; values | “reduce loneliness and social isolation” | CONFIRMED | “reduce loneliness and social isolation”. |
| Service plan / coordinator; amount | “coordinator ... individual service plan ... interests” | CONFIRMED | “developing an individual service plan, based on your interests”. |
| Named activities | “outings ... volunteer ... church or spiritual ... movies ... continuing education” | CONFIRMED | “outings with family and friends volunteer activities church or spiritual activities movies continuing education”. |
| Revolve number | “587-971-6779” | CONFIRMED | “Revolve Home Health Ltd. ... Phone: 587-971-6779”. |
| Taproot number | “780-439-5087” | CONFIRMED | “Taproot Community Support Services ... Phone: 780-439-5087”. |
| Catholic Social Services number | “403-967-3533” | CONFIRMED | “Catholic Social Services (CSS) ... Phone: 403-967-3533”. |
| Calgary Alternative number | “403-283-0611” | CONFIRMED | “Calgary Alternative Support Services Inc. (CASS) ... Phone: 403-283-0611”. |
| Contact route | “contact a community access coordinator directly” | CONFIRMED | “Find your nearest community access coordinator to learn more”. |
| No published form | “does not publish an application form” | CONFIRMED | Page supplies coordinator contact list, no application form. |
| No published cost | “does not publish ... a cost” | CONFIRMED | No cost stated anywhere in supplied page. |
| No published documents | “does not publish a document list” | CONFIRMED | No document list in supplied page. |
| No published timeline | “does not publish a timeline” | CONFIRMED | No timeline in supplied page. |
| Care category exclusions / page naming | “Supportive living and long-term care are not listed” | CONFIRMED | Page names “type A or type B continuing care home”, not those terms. This verifies page naming, not equivalence of care categories. |
| Comparative rarity | “one of the few supports aimed at isolation” | NOT ON PAGE | No cross-program comparison. |
| Metadata application route | “Application through continuing care” | NOT ON PAGE | Contact coordinators specified; application through continuing care not stated. |

### ab-service-dog-id-card

Sources: `ab-service-dog-id-card--1.txt` (card), `--2.txt` (portal).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Alberta identification / qualified team | “provincial identification card for a qualified service dog team in Alberta” | CONFIRMED | --1: “Qualified service dog teams must have an Alberta Service Dog Identification Card”. |
| Fee; amount, values | “No fee to apply” | CONFIRMED | --1: “There is no cost for a service dog identification card”. |
| Mail time / approximate hedge; time, values | “mailed in about two weeks” | CONFIRMED | --1: “mailed to you in approximately 2 weeks”. |
| Assessment route; REQS.abServiceDogQualified | “passed an assessment ... Alberta's approved service dog providers” | CONFIRMED | --1: “passed an assessment from one of Alberta’s approved service dog providers”. |
| ADI graduation route | “program accredited by Assistance Dogs International” | CONFIRMED | --1: “graduated from a program accredited by Assistance Dogs International”. |
| Government-contracted equivalent-standard route | “organization contracted by a provincial or territorial government ... equivalent ... Alberta Training Standard” | CONFIRMED | --1: “been qualified by an organization contracted by a provincial or territorial government in Canada to train or assess service dogs to standards equivalent to the Alberta Training Standard”. |
| Card contents | “handler's ... dog's name, photos, a validation number and an expiration date” | CONFIRMED | --1: “name of the handler and dog a photo of the handler and dog a validation number a date of expiration”. |
| Online portal | “apply online through the Service Dogs Portal” | CONFIRMED | --1: “apply online for an ID card”; --2: “Apply for a Qualified Service Dog Identification Card”. |
| Form by request | “ask the Service Dog Assessment team for a form” | CONFIRMED | --1: “request an application form by contacting the Service Dog Assessment team”. |
| Team number | “780-427-9136” | CONFIRMED | --1: “Phone: 780-427-9136”. |
| Toll-free dialing instruction; note/tips | “or ... 310-0000 toll-free inside Alberta” | DIFFERS | --1: “Toll free: 310-0000 before the phone number (in Alberta)”. Scope: access prefix presented as standalone alternative team number. |
| Photo shows user/dog exclusively | “no other dogs or people” | CONFIRMED | --1: “There can be no other dogs or people in the photo”. |
| Facing camera / clear visible face | “facing the camera ... face clear and visible” | CONFIRMED | --1: “user must be facing the camera”; “face ... clear and visible”. |
| Close-up portrait | “close-up portrait format” | CONFIRMED | --1: “image must be a close-up portrait format”. |
| Photo minimum distance | “minimum of 6 feet away” | CONFIRMED | --1: “Photographer a minimum of 6 feet away from candidate and dog”. |
| Head alignment / hedge | “approximately the same level” | CONFIRMED | --1: “should be at approximately the same level”. |
| PDF-only photo | “PDF, not a JPEG or a phone screenshot” | CONFIRMED | --1: “File containing the photograph should be sent in .pdf format only”. Screenshot distinction concerns submission format, not image origin. |
| Page does not explain renewal | “identification card page does not set out the renewal process” | CONFIRMED | --1 has no renewal procedure. --2 separately offers “Renew an ID Card – Owner-Managed ... annual reassessment”; record explicitly refers to --1. |
| Page does not explain access rights | “identification card page does not itself set out the access rights the card confers” | DIFFERS | --1: “verifies that an individual and their service dog have protected public access rights in Alberta”; “ensure access to public places”. Scope: page now expressly describes public access rights. |
| Metadata assessment proof | “Application + proof of assessment” | NOT ON PAGE | Qualification required; no universal assessment-proof document requirement (other routes exist). |

### ab-special-needs-housing

Sources: `ab-special-needs-housing--1.txt` (programs), `--2.txt` (Find Housing).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Subsidized provincial housing | “Subsidized provincial housing” | CONFIRMED | --1: “4 types of provincially-subsidized housing”. |
| Four types / names | “Community Housing, Seniors apartments and Seniors Lodge” | CONFIRMED | --1: “Community Housing”; “Seniors apartments”; “Seniors Lodge”; “Special Needs Housing”. |
| Special needs named categories | “developmental disabilities ... physical challenges ... victims of family violence ... wards ... hard-to-house ... any other group” | CONFIRMED | --1: “people with developmental disabilities people with physical challenges victims of family violence wards of the provincial government the hard-to-house any other group with special housing needs”. |
| Community income below limit | “below the local income limits ... market for your community” | CONFIRMED | --1: “income below local income limits as determined by the market for that community”. |
| Income-document link / no single limit | “income thresholds document ... rather than ... single income limit” | CONFIRMED | --1: “Check the income thresholds document”. No single numeric threshold in page. |
| Citizenship/PR route | “Canadian citizen or permanent resident” | CONFIRMED | --1: “Canadian citizen or permanent resident”. |
| Federal-sponsored refugee | “refugee sponsored by the Government of Canada” | CONFIRMED | --1: “refugee sponsored by the Government of Canada”. |
| Private sponsorship breakdown | “privately sponsored refugee whose sponsorship has broken down” | CONFIRMED | --1: “privately sponsored refugee whose sponsorship has broken down”. |
| Ukrainian eligibility certainty | “Ukrainian evacuees ... also qualify” | DIFFERS | --1: “evacuees from Ukraine with Canada-Ukraine Authorization for Emergency Travel are eligible to apply”; “Some housing providers may have additional eligibility criteria”. Hedge/scope: eligible to apply becomes qualification. |
| Citizenship gate excluding alternatives; REQS.citizenPR | “must be a Canadian citizen or permanent resident” | DIFFERS | --1: “refugee sponsored by the Government of Canada, or privately sponsored refugee whose sponsorship has broken down”; “evacuees from Ukraine with Canada-Ukraine Authorization for Emergency Travel are eligible to apply”. Dropped alternatives in shared gate despite broader record text. |
| Optional support services | “may include support services” | CONFIRMED | --1: “may include support services for residents”. |
| Tool → choose provider → contact application | “Find Housing ... local housing provider ... contact ... directly” | CONFIRMED | --1: “Use the Find Housing tool”; “choose a local housing provider”; “Contact the housing provider for an application”. |
| No central application | “Applications are not centralized” | CONFIRMED | --1: “Local housing providers are responsible for managing programs ... selecting tenants”; application obtained from provider. |
| Community Housing rent | “30% of total annual household income ... Community Housing” | DIFFERS | --1: “30% of a household total annual income (non-senior household)”. Dropped non-senior-household restriction in the generalized comparison. |
| Seniors apartments rent basis | “30% of total annual household income ... Seniors apartments” | DIFFERS | --1: “30% of a households adjusted income”. Number unchanged; basis differs from total annual income. |
| No Special Needs rent formula | “no rent formula is published for this program type” | CONFIRMED | --1 gives no Special Needs rent formula. |
| Seniors functional independence | “functionally independent ... seniors programs” | CONFIRMED | --1: “functionally independent, with or without the assistance of community-based services” in both seniors sections. |
| No province-wide documents | “does not publish a province-wide document list” | CONFIRMED | Neither supplied page publishes one. |
| Separate universal waiting lists; time, tips, REQS.abSpecialNeedsHousingPlacement | “each provider keeps its own waiting list”; “Applying to one does not put you on another's list” | DIFFERS | --2: “Each housing operator may keep a waitlist when there are no current vacancies”. Hedge: possible vacancy-dependent lists become universal; nontransfer rule not stated. |
| Provider confirms eligibility; REQS.abSpecialNeedsHousingPlacement | “that provider confirms eligibility” | CONFIRMED | --1: “selecting tenants”; “Some housing providers may have additional eligibility criteria”. |
| No published wait time; metadata wait | “does not publish a wait time”; “waitlists vary” | CONFIRMED | --2: “there may be significant delay”; no quantified wait. |
| Different providers' documents | “different providers may ask for different things” | NOT ON PAGE | Additional eligibility criteria supported, not documentary variation explicitly. |
| Metadata income verification | “Housing application + income verification” | NOT ON PAGE | Income gate supported, verification documents not described. |

### adult-health-benefit

Sources: `adult-health-benefit--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Alberta scope / residence; REQS.ab | “Alberta Adult Health Benefit” | CONFIRMED | “live in Alberta”. |
| Lower-income adults/families | “adults and families with lower incomes” | CONFIRMED | “Albertans in low-income households”; “you and members of your family”. |
| Age restriction; REQS.adult | “people aged 18–64” | NOT ON PAGE | No overall 18–64 restriction stated; page separately includes 18/19-year-old dependent children and excludes Seniors Benefit recipients. |
| Citizenship/PR; REQS.citizenPR | “Canadian citizen or permanent resident” | CONFIRMED | “be Canadian citizens or have permanent resident status”. |
| Prescriptions | “prescriptions” | CONFIRMED | “prescription drugs”; “list of eligible prescription drugs”. |
| Dental | “dental” | CONFIRMED | “dental care”; “Basic services ... Preventative care”. |
| Optical | “eye care” | CONFIRMED | “eye exams and glasses”. |
| Diabetes | “essential diabetic supplies” | CONFIRMED | “essential diabetes supplies”. |
| Emergency ambulance | “emergency ambulance” | CONFIRMED | “emergency ambulance services”. |
| Unqualified free services; amount | “Free prescriptions, dental, optical and more” | DIFFERS | “Talk to ... provider ... to learn what is paid for”; “may cover your remaining costs”; eligible lists/agreements restrict coverage. Scope/hedge: not all these services are unconditionally free. |
| No monthly premium | “at no monthly premium” | NOT ON PAGE | Page does not state a premium policy. |
| Not receiving AISH; note/gateway | “not already covered by AISH” | CONFIRMED | “not be receiving health benefits from ... Assured Income for the Severely Handicapped (AISH)”. |
| Single maximum; REQS.adultHealthIncome | “$16,580 for a single adult” | CONFIRMED | “Single adult $16,580”. |
| Couple/no-child maximum | “$23,212 for a couple with no children” | CONFIRMED | “Couple, no children $23,212”. |
| Increasing child thresholds | “rising with each child” | CONFIRMED | “1 adult + 1 child $26,023 ... 4 children ... $41,957”; “For each additional child, add $4,973”. No other exact amounts asserted. |
| Pregnancy/high ongoing prescription route; gateway | “pregnancy, high ongoing prescription drug needs” | CONFIRMED | “are pregnant have high ongoing prescription drug needs”. |
| Transition hedge; tips/gateway | “leave AISH or Income Support because ... working ... may keep” | CONFIRMED | “Clients leaving ... may be eligible ... household income from employment, self-employment or ... CPP-D”. |
| Other coverage exclusions; gateway | “Income Support ... NIHB ... another federal First Nations or Inuit program ... Alberta Seniors Benefit” | CONFIRMED | “not be receiving health benefits from other government programs: Income Support ... Canadian government programs for First Nations people and Inuit ... Alberta Seniors Benefit”. Necessary exclusions, not asserted exhaustive. |
| Child and Youth Support exclusion; gateway | “Child and Youth Support Program” | NOT ON PAGE | This named program not in supplied exclusion list. |
| Application | “Complete ... application” | CONFIRMED | “Download the Alberta Adult Health Benefit application form AEHB3931”. Record does not assert form number. |
| Universal income-proof submission; steps/documents/metadata | “Submit it with proof of income”; “tax assessment” | DIFFERS | Standard application: “Consent for Canada Revenue Agency to Verify Income”; NOA/income documents appear in reassessment routes. Scope: reassessment documents presented as universal initial requirement. |
| Alberta Health Care number document | “Alberta Health Care number” | NOT ON PAGE | Not reproduced in page body; form not supplied. |
| Processing duration; time/metadata | “A few weeks to process” | NOT ON PAGE | No processing-duration estimate. |
| Contact number/purpose; detail.phone | “Alberta Supports: 1-877-644-9992” | DIFFERS | “Connect with the Health Benefits Contact Centre: Phone: 780‑427‑6848 Toll free: 1‑877‑469‑5437”. Number/purpose: generic Supports is not the program contact provided for health-benefit questions. |
| No annual dollar valuation; values | “Alberta publishes no annual dollar value” | CONFIRMED | No annual dollar valuation in supplied page; individual service limits are not an annual total value. |

### aish

Sources: `aish--1.txt` (eligibility), `--2.txt` (application). **Extra-care flag:** AISH is never ready for a work-impact answer; retain both conservative medical and financial confirmation needs. No gates or tests changed.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Alberta residence; REQS.ab | “Alberta disability income assistance” | CONFIRMED | --1: “You live in Alberta”. |
| Citizenship/PR; documents, REQS.citizenPR | “Canadian citizenship / PR” | CONFIRMED | --1: “Canadian citizen or permanent resident”. |
| Age boundary; REQS.adult | “people aged 18–64” | DIFFERS | --1: “at least 18 years old and not eligible to receive an Old Age Security pension”. Boundary: OAS eligibility, not fixed age 65, is the upper restriction. |
| Severe permanent disability / employment prevention; REQS.aishMedical | “severe disability that permanently prevents employment” | CONFIRMED | --1: “You must have a severe disability that permanently prevents employment”. |
| Program medical review | “treatments, therapies, rehabilitation and training ... might improve” | CONFIRMED | --1: “review the medical treatments, therapies, rehabilitation services, and training options available that may help improve your impairment”. |
| Monthly living allowance; amount/values | “Monthly living allowance” | CONFIRMED | --1: “AISH monthly living allowance”. No numeric allowance asserted. |
| Health benefit possibility | “may include health ... benefits” | CONFIRMED | --2: “apply for AISH and ADAP financial and health benefits”; approval required, possibility supported. |
| Personal benefits; amount/values/about | “personal benefits” | NOT ON PAGE | Not named in these pages. |
| One combined application; note/steps/tips | “combined AISH/ADAP application ... not ... two separate applications” | CONFIRMED | --2: “Disability Income Assistance (DIA) Application”; “Apply for AISH and ADAP online”; approval letter for “AISH or ADAP”. |
| Alberta decides program/amount; estimator advice | “Alberta ... decides the program and benefit amount” | CONFIRMED | --2: “If your application is approved ... confirming you are eligible for AISH or ADAP”; --1 describes amount deductions. No calculator relied upon for amount. |
| Estimator existence | “Alberta's AISH/ADAP benefit estimator” | NOT ON PAGE | Neither supplied page names estimator. |
| Medical report / professional | “required medical report ... health professional” | CONFIRMED | --2: “Your health professional will need to complete the Disability Assistance Medical Report”. |
| Doctor-only report; REQS.aishMedical | “A doctor must complete the medical report” | NOT ON PAGE | --2 says “Your health professional will need to complete”; authorized professions and doctor-only restriction are not enumerated. A broader generic label alone does not prove another profession is authorized. |
| Alberta professional registration | “medical professional registered in Alberta” | NOT ON PAGE | No registration jurisdiction stated. |
| Online/non-online routes; form documents | “Submit online ... DIA ... form, if you cannot apply online” | CONFIRMED | --2: “If you cannot apply online, complete the Disability Income Assistance Application form”; “Submit ... online or by ... Fax ... Mail”. |
| Residence/citizenship proof documents | “Proof of Alberta residency + Canadian citizenship / PR” | NOT ON PAGE | Eligibility established; specific documentary proof not reproduced. |
| Financial application information | “Financial details (income and assets)” | CONFIRMED | --2: “general, financial or medical information required”; --1: “income and assets you and your spouse or partner have”. |
| Household income counted; REQS.aishFinancial | “income and your spouse or partner's income” | CONFIRMED | --1: “AISH looks at the income and assets you and your spouse or partner have”. |
| Nonexempt asset limit; REQS.aishFinancial | “must stay at or under $100,000” | CONFIRMED | --1: “Non-exempt assets cannot be worth more than $100,000 when they are added together”. The 365-day temporary exemption changes asset classification, not this non-exempt cap; no contradictory cap exception inferred. |
| Other income applications / named programs | “CPP-D ... Canada Disability Benefit, EI or WCB” | CONFIRMED | --1: “apply for all other income ... Canada Pension Plan Disability (CPP-D), Canada Disability Benefit, Employment Insurance (EI) or Workers’ Compensation Board (WCB)”. |
| Report CDB/DTC outcome and CDB amount/denial | “report the outcome ... including ... approved CDB amount or a denial” | NOT ON PAGE | --2 links CDB/DTC resources but does not reproduce reporting rule. |
| Historical CDB reduction/date condition | “no CDB decision ... February 28, 2026, $200 ... April 2026 benefits” | NOT ON PAGE | These amount/date/decision conditions absent. |
| Online help toll-free | “1-877-644-9992” | CONFIRMED | --2: “online, call ... 1-877-644-9992”. |
| Online help Edmonton | “780-644-9992” | CONFIRMED | --2: “in Edmonton 780-644-9992”. |
| Medical fee responsibility / hedge | “may charge ... responsible for paying it” | CONFIRMED | --2: “may charge you ... You are responsible for paying the fee”. --1 separately gives government-paid report to former AISH clients transitioned to ADAP. |
| Income Support fee exception | “If ... Income Support ... may be covered” | CONFIRMED | --2: “If you are on Income Support, the cost ... may be covered”. |
| Transition-report payment exception omitted; tips[5] | “you are responsible for paying it” | DIFFERS | --1: “government will cover the cost of one ... Medical Report for AISH clients who transitioned to ADAP and later choose to be assessed for AISH”; “not time-limited”. Dropped exception despite retained Income Support exception. |
| Backdating month / approval condition | “month ... received all ... information needed to approve” | CONFIRMED | --2: “your benefits will be backdated to the month ... received all ... information ... required to approve”. |
| Status Edmonton number | “587-759-6810” | CONFIRMED | --2: “587-759-6810 (Edmonton area)”. |
| Status toll-free number; phone | “1-877-759-6810” | CONFIRMED | --2: “1-877-759-6810 (toll free, Alberta)”. |
| Reopening medical condition / hedge | “not because ... medical condition changed ... may be reopened quickly” | CONFIRMED | --2: “may have your file reopened quickly ... did not leave ... due to a change in your medical condition”. |
| Reopening two-year measurement | “left AISH or ADAP less than 2 years ago” | DIFFERS | --2: “less than 2 years since you got your last AISH benefits”. Boundary: departure from either program is not the stated last-AISH-benefit clock. |

### bc-clbc

Sources: `bc-clbc--1.txt` (supports), `--2.txt` (eligibility).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| BC funded adult support | “Provincial agency funding ... adults 19+” | CONFIRMED | --1: “Community Living BC funds a range of services”; --2: “people in B.C. who are 19 or older”. |
| Lifelong / beyond-65 duration | “lifelong supports”; “supports continue beyond 65” | NOT ON PAGE | No end-age or lifelong commitment in supplied prose. Aging resources in navigation do not establish this. |
| Application age; REQS.age16plus | “apply from age 16” | NOT ON PAGE | --2 links fact sheet for “When you can apply”; no age 16 in body. |
| Ready-at-19 assurance | “to have services ready at 19”; “means supports can begin right at 19” | DIFFERS | --1: “What funded support people get, and when, depends on how urgent their situation is and the amount of funding CLBC has at the time of the request”. Dropped timing/resource contingency. |
| DD intellectual/adaptive impairment and onset | “significantly impaired intellectual AND adaptive ... before age 18” | CONFIRMED | --2: “significantly impaired intellectual functioning significantly impaired adaptive functioning ... started before the age of 18”. |
| PSI named conditions / limitation | “FASD or autism spectrum diagnosis plus significant adaptive-functioning limitations” | CONFIRMED | --2: “diagnosis of ... FASD ... Autism Spectrum Disorder AND significant limitation in adaptive functioning”. |
| PSI no intellectual disability | “no intellectual disability required” | CONFIRMED | --2: “An adult does not have a developmental disability but has either” diagnosis/limitations. No intellectual-disability requirement supported; eligibility overlap not inferred. |
| DD-only shared gate; REQS.developmental | “For an intellectual / developmental disability that began before age 18” | DIFFERS | --2: PSI supports an adult who “does not have a developmental disability” but has ASD/FASD and adaptive limits. Dropped PSI alternative from universal gate. |
| Professional assessments/forms; REQS.disabilityDoc | “assessments and forms completed by an approved professional” | CONFIRMED | --2: “assessments and forms completed by an approved professional”. |
| Psychologist-only DD / named cognitive and adaptive documents | “registered psychologist for the DD stream”; “Cognitive/psychoeducational ... Adaptive functioning assessment” | NOT ON PAGE | --2: “like a psychologist”; specific registration, DD-only professional mandate, and document titles not reproduced. |
| School assessments reuse frequency | “can often be reused” | DIFFERS | --2: “Sometimes these assessments have already been done when you were in school”. Hedge/frequency: sometimes existing is not often reusable. |
| School reuse possibility; tips | “a new assessment may not be needed” | CONFIRMED | --2: “Sometimes these assessments have already been done when you were in school”. Possible prior assessments supported, no guaranteed acceptance. |
| Contracted-agency delivery | “network of contracted agencies” | NOT ON PAGE | Not in supplied body. |
| Facilitator planning / eligibility | “planned individually with a CLBC facilitator” | CONFIRMED | --2: “facilitator ... confirm eligibility”; “meet you to help begin the welcome and planning process”. |
| Residential types | “own place ... shared living/home sharing ... staffed homes” | CONFIRMED | --1: “own place, with a roommate or family in shared living, or in a staffed home”. |
| Contracted family home-sharing | “home sharing with a contracted family” | NOT ON PAGE | “family in shared living” supported, contract not stated. |
| Employment and skills | “employment support ... skill development” | CONFIRMED | --1: “help you get a job, learn new things”. |
| Keep-job support | “find and keep a job” | NOT ON PAGE | Getting job supported; retention not described. |
| Community inclusion | “community inclusion and connection programs” | CONFIRMED | --1: “connecting to your community”. |
| Wellness daily responsibilities | “wellness supports for daily responsibilities” | CONFIRMED | --1: “Wellness support ... make daily responsibilities easier”. |
| Respite / family support | “respite for families” | NOT ON PAGE | Family well-being named; respite not specified. |
| Behavioural support | “behavioural support” | NOT ON PAGE | Not named. |
| Provincial Assessment Centre mental-health / age | “mental-health services ... 14+ ... developmental disabilities” | NOT ON PAGE | Centre, age and mandate absent. |
| MCFD youth transition route | “ask your MCFD/CYSN worker ... transition” | CONFIRMED | --2: “youth ... already accessing ... MCFD supports ... contact your MCFD worker for assistance with transition”. Age 16 separately unsupported. |
| Office phone; detail.phone | “1-877-660-2522” | CONFIRMED | Both: “Call 1.877.660.2522”. |
| Workshop attendance | “attend the CLBC Welcome Workshop series” | NOT ON PAGE | Navigation links “Attend ... series”; body promises welcome/planning meeting, not universal workshop attendance. |
| Funding contingency | “based on the plan and available resources” | CONFIRMED | --1: “amount of funding CLBC has at the time of the request”. |
| Respite common first service | “commonly the first service ... transitioning youth” | NOT ON PAGE | No first-service/frequency claim. |
| PWD usual eligibility | “usually also qualify for BC PWD disability assistance” | NOT ON PAGE | No PWD frequency statement. |
| No published wait; metadata | “Not published — ask your local CLBC office” | CONFIRMED | --1 publishes contingencies, no fixed wait. |

### bc-fnha-health-benefits

Sources: `bc-fnha-health-benefits--1.txt`, `--2.txt`. Both supplied snapshots are the same FNHA benefits landing page (not Plan W or enrollment subpages).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Status First Nations / BC scope; eligibility, REQS.firstNationsStatus | “First Nations person with Indian status living in British Columbia” | CONFIRMED | Both: “health benefits plan for status First Nations people in BC”. |
| Named coverage types; summary, values | “dental, medical supplies and equipment, medical transportation, mental health, pharmacy and vision care” | CONFIRMED | Both: “includes dental, medical supplies and equipment, medical transportation, mental health, pharmacy and vision care”. |
| Prescription percentage; amount/values/about | “100% of eligible prescriptions” | NOT ON PAGE | Pharmacy named; no percentage or Plan W coverage level. |
| Infant parent-eligibility exception/boundary | “Infants up to 24 months ... at least one parent is eligible” | NOT ON PAGE | No infant rule; no boundary comparison possible against linked eligibility page. |
| Federal/self-government exclusions | “not eligible if ... federal government ... self-government agreement with Canada” | NOT ON PAGE | Exclusion criteria not reproduced. |
| Plan W name / pharmacy identity | “pharmacy ... PharmaCare Plan W” | NOT ON PAGE | Page says “majority of pharmacy benefits ... administered through a…”; Plan W not named. |
| Active MSP Plan W requirement | “requires active ... MSP enrolment” | NOT ON PAGE | MSP overview linked; pharmacy eligibility not specified. |
| Plan W no separate application / FNHA whole route | “do not apply for Plan W ... enrolling with FNHA is the whole route” | NOT ON PAGE | No Plan W application rule. |
| Special authorization / insulin pumps | “including insulin pumps, need special authorization” | NOT ON PAGE | Pumps and authorization absent. |
| Specific pharmacy scope and hedges | “certain medical supplies ... certain over-the-counter drugs ... some natural health products ... pharmacy services” | NOT ON PAGE | No detailed pharmacy list. |
| Named supplies | “test strips, lancets and alcohol wipes, contraceptives, and ostomy supplies” | NOT ON PAGE | Specific supplies not named. |
| Indian Act / under-two parent status pharmacy alternative | “registered Indian ... Indian Act ... child under two ... parent ... registered Indian” | NOT ON PAGE | No Indian Act or infant Plan W criteria. |
| Phone enrollment / no online form | “enrol by phone ... rather than ... online form” | NOT ON PAGE | Contact phone supplied; exclusive enrollment method not described. |
| Phone number | “1-855-550-5454” | CONFIRMED | Both: “Phone (toll-free): 1-855-550-5454”. |
| Hours / exclusions | “Monday to Friday, 8 a.m. to 4:30 p.m. ... statutory holidays” | CONFIRMED | Both: “Open Mon. to Fri. 8 a.m. to 4:30 p.m. except weekends and statutory holidays”. |
| Status number / PHN documents | “Status number”; “Personal Health Number” | NOT ON PAGE | No registration document list. |
| First-registration forms / may hedge | “may ... Pacific Blue Cross Enrollment Application for Group Benefits ... Medical Services Plan Application for Enrollment” | NOT ON PAGE | PBC/MSP described, these forms not named. |
| Email contact | “HealthBenefits@fnha.ca” | CONFIRMED | Both: “health​benefits@fnha.ca” (snapshot includes zero-width character). |
| Completed-form submission by email | “Email the completed forms” | NOT ON PAGE | Contact email given; enrollment form submission not specified. |
| Birth registration deadline / PHN | “register the birth ... within three months ... Personal Health Number” | NOT ON PAGE | No birth-registration deadline/process. |
| Child Indian Status registration agency | “Indigenous Services Canada” | NOT ON PAGE | Not stated. |
| Parent account until two / own status separate enrollment | “covered under a parent's account until age two ... call ... enrol ... separately” | NOT ON PAGE | No parent-account or separate-registration procedure. |

### bc-pharmacare-plan-g

Sources: `bc-pharmacare-plan-g--1.txt` (plans overview, Plan G section).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Percentage / limited psychiatric formulary; amount, values, REQS.psychiatricMedicationCandidate | “100% of eligible costs ... certain psychiatric medications” | CONFIRMED | “100% coverage of eligible costs”; “covers certain psychiatric medications”. |
| BC / any age | “B.C. residents of any age” | CONFIRMED | “B.C. residents of any age”. |
| Both needs; eligibility, REQS.planGClinicalAndFinancialNeed | “both clinical and financial need” | CONFIRMED | “with clinical and financial need”. |
| Income strict boundary | “annual income ... lower than $42,000” | CONFIRMED | “if your annual income is lower than $42,000”. |
| Clinician / team confirmation | “physician or nurse practitioner ... local mental health and substance use ... or ... Child and Youth Mental Health team” | CONFIRMED | “Your physician or nurse practitioner ... confirms your eligibility, together with the local mental health and substance use location or Child and Youth Mental Health team”. |
| Prescriber application / named form; metadata effort | “Application for PharmaCare Plan G ... on your behalf” | CONFIRMED | “If you are eligible, your prescriber will submit an Application for PharmaCare Plan G form ... on your behalf”. |
| No patient filing | “nothing for you to file” | CONFIRMED | “prescriber will submit ... on your behalf”. Concerns filing, not supplying prescriber with information. |
| Coverage maximum / renewal | “up to one year ... renewed ... still need it” | CONFIRMED | “Coverage is for up to 1 year and needs to be renewed if you require further coverage”. |
| Fixed one-year stop; tips[0] | “coverage simply stops after a year” | DIFFERS | “Coverage is for up to 1 year”. Boundary: tip fixes duration at one year instead of retaining up-to. |
| Renewal advance | “about a month ahead” | CONFIRMED | “visit a healthcare provider about a month ahead to submit a new application”. |
| Income information requested | “Bring anything your prescriber asks for ... if they need it” | NOT ON PAGE | No income evidence/document requests described. |
| Substance-use scope; tips[2] | “Substance use is covered by the same route” | DIFFERS | “covers certain psychiatric medications”; team is “mental health and substance use location”. Scope: team's name does not establish substance-use treatment coverage (page separately places OAT under Plan Z). |
| MSP test comparison; tips[3] | “worded differently from the adjusted net income test ... MSP Supplementary Benefits ... not automatically” | NOT ON PAGE | MSP Supplementary Benefits financial test not reproduced in supplied plans page. |

### bc-pharmacare-plan-p

Sources: `bc-pharmacare-plan-p--1.txt` (plans), `--2.txt` (sheet index, not linked PDF contents).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Percentage / eligible formulary; amount, values | “100% ... medications ... Plan P formulary” | CONFIRMED | --1: “100% coverage of eligible costs for medications used in palliative care and in the Plan P formulary”. |
| BC / any age | “B.C. residents of any age” | CONFIRMED | --1: “For B.C. residents of any age”. |
| End-stage condition; REQS.palliativeCandidateCondition | “end stage of a life-threatening disease or illness” | CONFIRMED | --1: “reached the end stage of a life-threatening disease or illness”. |
| Home care preference | “wish to receive palliative care at home” | CONFIRMED | --1: “wish to receive palliative care at home”. |
| Broad home scope | “own home ... family ... friends ... supportive or assisted living ... hospice ... long-term care” | CONFIRMED | --1: “own home, with family or friends, in a supportive/assisted living residence, or in a hospice unit at a long-term care facility”. |
| Community hospice / Plan B exception | “community hospice bed ... not covered under ... Plan B” | CONFIRMED | --1: “a community hospice bed that is not covered under PharmaCare Plan B”. |
| Clinician registration / form; REQS.planPRegistration, metadata effort | “physician or nurse practitioner ... registration form ... PharmaCare” | CONFIRMED | --1: “Physicians or nurse practitioners submit a registration form to PharmaCare for their patients”. |
| No family form filing | “nothing for the patient or family to submit” | CONFIRMED | --1: “Physician or nurse practitioner registers patients”. Filing route only, not blanket absence of consent or information needs. |
| One form / both notified | “single form notifies both PharmaCare and the health authority” | CONFIRMED | --1: “single registration form is used to notify both PharmaCare and the health authority”. |
| Supplies/equipment possible / health authority route | “eligible patients can also receive ... through ... local health authority” | CONFIRMED | --1: “Eligible patients can also receive medical supplies and equipment through their local health authority”. |
| Assured equipment; steps[1]/tips[1] | “equipment that come with eligibility”; “Supplies and equipment come through” | DIFFERS | --1: “Eligible patients can also receive”. Hedge: possible provision becomes assured entitlement. |
| Multilingual patient sheet | “available in multiple languages” | CONFIRMED | --1: “available in multiple languages”; --2 lists translated Plan P sheets. |
| PWD prescribed route | “Registration in Plan P ... prescribed routes ... Persons with Disabilities designation” | NOT ON PAGE | PWD designation routes not described. |

### bc-work-able-internship

Sources: `bc-work-able-internship--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Paid BC Public Service employment; amount/values | “Paid BC Public Service internship” | CONFIRMED | “paid employment opportunities across the BC Public Service”. |
| Maximum placement duration; time | “up to 24 months” | CONFIRMED | “All placements are currently up to 24 months long”. |
| Graduate criterion / missing credentials; eligibility, REQS.recentGraduate | “recent post-secondary graduate ... within 3 years” | DIFFERS | “Two-year diploma, associate degree, bachelor&rsquo;s degree, master&rsquo;s degree or doctorate from a recognized post-secondary institution”. Dropped credential/institution restriction in broad graduate rule. |
| Graduation timing boundary | “within 3 years of the program start date” | CONFIRMED | “Graduation date must be within 3 years of the Program start date”. |
| Self-identification | “self-identify as having a disability” | CONFIRMED | “Self-identify as having a disability”. |
| Named disability types | “physical, sensory, neurological, visible or invisible” | CONFIRMED | “any physical, sensory, neurological, visible or invisible disabilities”. |
| No diagnosis disclosure | “do not have to disclose ... specific diagnosis” | CONFIRMED | “does not ask applicants to disclose their specific disability or diagnosis”. |
| Professional verification gate; REQS.disabilityDoc | “Have a qualified professional verify ... first” | DIFFERS | “Self-identify as having a disability”; “does not ask ... specific disability or diagnosis”. Scope: professional verification imposed in addition to the self-identification route. |
| BC resident; REQS.bc | “British Columbia” | CONFIRMED | “Resident of British Columbia”. |
| Age gate; REQS.age18plus | “at least 18” | NOT ON PAGE | No numeric minimum age in supplied page. |
| Work/search gate; REQS.employmentActive | “working or looking for work” | CONFIRMED | “interested in pursuing a career in the BC Public Service”. Work-seeking scope supported, not an employment-status guarantee. |
| Annual intake | “Intake runs annually” | CONFIRMED | “What are the annual timelines for Work-Able?”; “April to May: Job posting is open”. |
| 2026/27 intake closed | “Applications ... closed” | CONFIRMED | “Applications for the 2026/27 Work-Able cohort are now closed”. |
| 2027/28 opening certainty; note/steps[0] | “next intake ... opens in spring 2027” | DIFFERS | “check back in Spring 2027 for information on the 2027/28 ... intake”. Hedge: information timing becomes definite application opening. |
| Post-program internal postings period / completion | “24 months after completing the program” | CONFIRMED | “Access to internal ... job postings for 24 months after successfully completing the program”. Graduate/completion phrasing denotes successful finish, not mere participation. |
| Work experience, peers and career exposure | “government work experience ... peer cohort ... different career paths” | CONFIRMED | “Paid experience”; “different roles and potential career paths”; “Peer support in a cohort”. |
| Selected placement with ministry | “If selected ... paid position with a ministry” | CONFIRMED | “temporary positions developed by host ministries”; “Successful candidates receive letters for positions”. |
| Online application | “Apply online during the intake window” | NOT ON PAGE | Page discusses application window but no explicit applicant online submission instruction in supplied body. |
| Graduation evidence | “Proof of post-secondary graduation” | NOT ON PAGE | Degree criterion given, documentary list not reproduced. |
| Resume document | “Resume” | NOT ON PAGE | No resume requirement in supplied body. |
| Notification contact | “Contact ... notified when ... opens” | CONFIRMED | “To be notified when the next application period opens, please contact the Work-Able team”. |
| Accommodation support | “do not need to negotiate them alone” | CONFIRMED | “Dedicated support for disability accommodations in the workplace if needed”. |

### bc-workbc-assistive-technology

Sources: `bc-workbc-assistive-technology--1.txt` (services), `--2.txt` (OES portal).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Funding scope / financial contingency; amount | “fully or partially ... financial circumstances” | CONFIRMED | --1: “Depending on your financial situation ... covered fully or partially”. |
| Work disability/functional barrier | “work-related barrier due to a disability or functional limitation” | CONFIRMED | --1: “work-related barriers due to disability or a functional limitation”. |
| Minimum age; REQS.age16plus | “16 or older” | CONFIRMED | --1: “Be 16 years of age or older”. |
| BC residence / legal work eligibility | “B.C. resident legally eligible to work” | CONFIRMED | --1: “Be a resident of and be legally eligible to work in British Columbia”. |
| Student exception | “not a full-time student ... final year” | CONFIRMED | --1: “Not be a full-time student, unless you are in your last year of high school or post-secondary school”. |
| Volunteer employment goal | “Volunteering toward an employment goal ... count” | CONFIRMED | --1: “volunteer work that is part of a longer-term goal of employment”. |
| Self-employment dropped proof | “self-employment count” | DIFFERS | --1: “self-employment (proof of regular income is required)”. Dropped regular-income proof condition. |
| Start/retain employment; REQS.employmentActive | “get or keep a job” | CONFIRMED | --1: “to start work or avoid losing your current work”. |
| Devices and equipment | “assistive devices and technology” | CONFIRMED | --1: “Assistive devices, equipment and technology”. |
| Ergonomic furniture/lighting | “furniture and lighting” | CONFIRMED | --1: “ergonomic furniture, lighting systems”. |
| Restorative supports | “restorative supports” | CONFIRMED | --1: “Restorative supports”. |
| ASL / captioning | “ASL interpreting and captioning” | CONFIRMED | --1: “American Sign Language (ASL) interpreting and captioning services”. |
| Communication/hearing for work | “communication and hearing devices for work” | CONFIRMED | --1: “Communication and hearing devices related to work”. |
| Workplace access/modification | “workplace access modifications” | CONFIRMED | --1: “Workplace access and modification”. |
| Work vehicle modifications / commuting | “vehicle modifications for getting to work” | CONFIRMED | --1: “Vehicle modifications for work related purpose”. Commuting is a work purpose; no universal commuting approval claimed. |
| Travel-related equipment | “travel-related equipment can be funded” | NOT ON PAGE | No separate travel-equipment category. |
| Medical/daily-living exclusions | “not medical treatments or daily-living items” | CONFIRMED | --1: “Medical treatments and therapies Items for daily living”. |
| Work-only claim / volunteer exception; note | “Covers work-related needs only” | DIFFERS | --1 excludes services “not employment or volunteer related”. Scope: only-work framing drops eligible employment-goal volunteer needs, despite elsewhere retaining volunteer route. |
| Provincial contracted delivery | “Delivered under contract to the province” | NOT ON PAGE | Service providers named generically; provincial contract not described. |
| Four named regional locations | “Burnaby, Kelowna, Nanaimo and Victoria” | CONFIRMED | --1: related topics list “KELOWNA”, “NANAIMO”, “VICTORIA”, “BURNABY”. |
| Office status of regional listings | “regional offices” | NOT ON PAGE | Related service pages listed; physical office status not stated. |
| OES application | “Apply through WorkBC Online Employment Services” | CONFIRMED | --2: “services ... apply for through OES ... WorkBC Assistive Technology Services”. |
| Direct ATS contact route | “or contact ATS directly” | NOT ON PAGE | Direct ATS application/contact procedure not reproduced. |
| Specialist needs assistance | “works with you ... work barrier and equipment needs” | CONFIRMED | --1: “service providers will work with you to understand your employment-related needs and present available options”. |
| Work-eligibility proof | “Proof ... eligible to work” | CONFIRMED | --2: “valid, verifiable SIN to confirm your identity and eligibility to work in Canada”. |
| Residence proof document | “Proof ... B.C. resident” | NOT ON PAGE | Residence is an eligibility condition, but required residence evidence not reproduced. |
| Job/offer/volunteer document list | “Information about your job, job offer ... volunteer role” | NOT ON PAGE | Eligibility routes given, specific application documents not listed. |
| Barrier documents / ATS helps document | “Details ... barrier and equipment needs (ATS helps document this)” | NOT ON PAGE | Needs discussion supported, documentary-assistance promise not explicit. |
| Professional verification gate; REQS.disabilityDoc | “qualified professional verify ... first” | NOT ON PAGE | No prior professional-verification mandate. |
| Contact email | “info-ats@workbc.ca” | NOT ON PAGE | Not in either supplied snapshot; no competing same-purpose ATS email. |
| Contact phone | “1-844-453-5506” | NOT ON PAGE | Neither supplied page gives an ATS contact number, so no same-purpose number mismatch established. |
| Metadata quotes/assessment | “work-barrier assessment and quotes” | NOT ON PAGE | Needs discussion supported, formal assessment and quotes not specified. |
| Variable time | “Varies by request”; “Varies by assessment and equipment” | NOT ON PAGE | No timing or timing factors stated. Asking for timeline is advice; assertion of variation is unsupported. |

### canmore-affordable-services

Sources: `canmore-affordable-services--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Town/community discount program; amount, values | “Town ... discounts ... community services ... recreation” | CONFIRMED | “Town of Canmore Services and Discounts”; “Local Community Partners - Offers and Discounts”; “Elevation Place Monthly ... Membership”. |
| Canmore residency; documents, REQS.canmore | “Canmore residence” | CONFIRMED | “program is for Canmore residents only”. |
| Income eligibility; REQS.lowIncome | “qualifying ... lower-income households” | CONFIRMED | “applicants must fall within the maximum household incomes listed below”. No exact threshold asserted. |
| Transit scope; amount, summary, note, about, values | “local transit” | DIFFERS | “Regional ROAM Transit ... adult ten-ride and adult monthly passes”. Scope: page's transit offer is regional, not local transit generically. |
| Tiered transit | “Transit discount tiers differ” | CONFIRMED | “Regional ROAM Transit 50% discount ... 25% discount”. Record asserts no exact percentage. |
| Application | “Apply ... documents requested” | CONFIRMED | “completed application ... FCSS office”; “bring all required documentation”. |
| Income evidence; metadata effort | “Proof of income” | CONFIRMED | “Proof of Income: Most recent Notice of Assessment showing line 15000 total income”. |
| Residency evidence | “Proof of Canmore residence” | CONFIRMED | “Proof of Residency for at least 3 months”. Record does not assert an exhaustive document list or a shorter duration. |
