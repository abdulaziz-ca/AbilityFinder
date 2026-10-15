# Snapshot re-verification report — 2026-10-15, batch 4

Completed 2026-10-15. Verification only; no replacement wording proposed.

## Method and scope

Evaluated `public/data.js` in a Node `vm` with `{window:{}, document:{}, console}` and exported `BENEFITS`, as in `scripts/check-readability.js`. Also evaluated the isolated `REQS` declaration (without invoking its matcher functions) and read unmet and short text for every requested record's requires. No grep-parsing of benefit records. Also evaluated `BENEFIT_VALUES` and `BENEFIT_META`: repeated assertions are consolidated with record facts; distinct factual metadata is listed explicitly. Editorial difficulty scores and estimate flags are not published benefit claims. Only supplied record-specific snapshots were used; no linked page, PDF or application is assumed read. Only first-line status 200 sources are used. Snapshot filenames below are relative to `research/reverify/snapshots/`.

Facts count distinct assertions, not occurrences or numeric tokens. Repetitions across fields are consolidated; inseparable amount/period or route/conditions may occupy one row. Independent assertions have separate rows. Quotes are verbatim excerpts. Names, UI labels, URLs and internal flags are not benefit facts; procedural promises and documents are. Advice without a factual assertion is not counted. CONFIRMED requires a supporting quotation; DIFFERS identifies a number, boundary, hedge, dropped condition or scope inconsistency; NOT ON PAGE means absent from the supplied usable sources, not false. Hedges are checked both ways; a weaker maximum hedge alone does not establish a different maximum unless the source specifies a fixed amount. Missing source-only facts are not invented as record assertions, but conditions dropped from an asserted route are identified.

Vancouver's browser-read snapshot has promotional omissions marked `...`; per the supplied provenance, eligibility, amounts, dates and documents were not omitted. Those markers are not treated as missing substantive evidence. `local-supports` is a generic catch-all, not a municipal benefit: only applicable referral/service assertions are checked, not unrelated individual program rules. Its gates describe application coverage/routing, not 211 eligibility.

## Summary table

| Record id | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| fscd | 15 | 7 | 1 | 7 |
| handycard-translink | 17 | 9 | 2 | 6 |
| handydart-bctransit | 18 | 2 | 0 | 16 |
| local-supports | 11 | 6 | 1 | 4 |
| pdd | 15 | 3 | 0 | 12 |
| stalbert-subsidy | 15 | 9 | 3 | 3 |
| strathcona-subsidy | 15 | 9 | 1 | 5 |
| surrey-leisure-access | 28 | 16 | 12 | 0 |
| vancouver-leisure-access | 24 | 17 | 6 | 1 |
| adap | 24 | 15 | 2 | 7 |
| bc-access-grant-deaf-students | 15 | 8 | 0 | 7 |
| bc-access-grant-students-disabilities | 15 | 6 | 1 | 8 |
| bc-assistance-program-students-disabilities | 20 | 9 | 0 | 11 |
| bc-at-home-saet | 34 | 9 | 2 | 23 |
| bc-autism-funding-6-18 | 34 | 18 | 5 | 11 |
| bc-autism-funding-under-6 | 34 | 16 | 5 | 13 |
| **Total (16 records)** | **334** | **159** | **41** | **134** |

Reviewed all 25 supplied snapshots' first lines: all have status 200. Two are malformed/flattened PDF-stream text rather than readable policy prose; see source limitations below. Counts are evidence-limited, not a declaration that unsupported facts are false.

## DIFFERS — needs a decision

Each numbered item corresponds to one DIFFERS assertion row, not one occurrence. Current quotations are exact excerpts; source quotations and fuller context also appear in the per-record tables. No wording is proposed.

1. **fscd — `detail.documents[0]`**
   - Current: “A diagnosis of your child's disability from a professional”.
   - Snapshot (`fscd--1.txt`): “has a disability or is awaiting a diagnosis.”
   - Difference: Boundary / dropped alternative: mandatory completed diagnosis excludes the awaiting-diagnosis route.

2. **handycard-translink — `requiresNote`**
   - Current: “Same eligibility and the same combined application form as HandyDART”.
   - Snapshot (`handycard-translink--1.txt`): “HandyDART users may also be eligible for HandyCard”.
   - Difference: Scope / hedge: same form is supported, identical eligibility is not; page preserves possible HandyCard eligibility.

3. **handycard-translink — `BENEFIT_META.wait`**
   - Current: “Not published — confirm with TransLink”.
   - Snapshot (`handycard-translink--1.txt`): “Please allow 4 to 6 weeks processing time for HandyCard applications.”
   - Difference: Scope: timing is explicitly published, contrary to metadata.

4. **local-supports — `detail.about / detail.tips[0]`**
   - Current: “a free, confidential, 24/7 service”; “available 24/7 in many languages.”
   - Snapshot (`local-supports--3.txt`): “In most of Canada ... can be accessed 24 hours a day”; `--2.txt`: “9am-9pm Weekdays (excl. Holidays)”.
   - Difference: Dropped hedge / scope: universal 24/7 omits “most” and BC's restricted navigator hours.

5. **stalbert-subsidy — `summary`**
   - Current: “local buses and the Handibus are free”.
   - Snapshot (`stalbert-subsidy--1.txt`): “Free local tickets for approved Handibus riders for travel within St. Albert.”
   - Difference: Dropped conditions: summary omits approved-rider and local-trip limits for Handibus.

6. **stalbert-subsidy — `detail.about / detail.aboutList.items[2]`**
   - Current: “65% off the monthly Edmonton commuter pass”.
   - Snapshot (`stalbert-subsidy--1.txt`): “65% off monthly adult commuter fares for travel between St. Albert and Edmonton.”
   - Difference: Dropped condition: adult commuter fare becomes unqualified commuter coverage.

7. **stalbert-subsidy — `note / detail.steps[1]`**
   - Current: “AISH and ADAP recipients get automatic eligibility here”; “isn't income-tested for you”; “that's automatic eligibility for the free annual recreation membership.”
   - Snapshot (`stalbert-subsidy--1.txt`): “AISH and ADAP recipients are eligible for a free annual membership”; “Your total annual household income (before taxes) must be within the low-income limits set by Statistics Canada.”
   - Difference: Scope / hedge: record asserts an income-test waiver not expressed alongside the source's general household-income rule.

8. **strathcona-subsidy — `detail.documents[2] / detail.steps[1]`**
   - Current: “CRA Notice of Assessment (or other proof of income)”; “your Notice of Assessment.”
   - Snapshot (`strathcona-subsidy--2.txt`): “Starting June 1, 2026 - a 2025 Notice of Assessment (NOA) ... will be required”; changed circumstances require “your NOA in addition to 3 months of bank statements”; new refugee/PR without NOA: “3 months bank statements from a Canadian bank”.
   - Difference: Dropped conditions / scope: generic alternative proof loses current-year and restricted substitution/supplement rules.

9. **surrey-leisure-access — `amount / BENEFIT_VALUES.note`**
   - Current: “plus 75% off registered courses”; “75% off courses”.
   - Snapshot (`surrey-leisure-access--1.txt`): “75% discount on most registered courses”; “children and youth ages 0-18 receive up to $500 in program discounts and $500 in Semiahmoo Arts Society program discounts”; adults/seniors “up to $250 ... and $250”.
   - Difference: Dropped hedge / caps: unqualified registered-course discount omits most and age-based annual limits; applicable day camps are separately uncapped.

10. **surrey-leisure-access — `eligibility.items[1] / requiresNote`**
    - Current: “You qualify one of these ways”; “with a Disability Tax Credit”; “as a client of the Ministry of Children and Family Development”.
    - Snapshot (`surrey-leisure-access--1.txt`): “You may qualify”; DTC: “family’s combined net income subtracted by your Disability Tax Credit is less than the number allowed for your family size”; MCFD refers to children in legal care and supported SAJE young adults.
    - Difference: Hedge / dropped conditions: status routes become certain qualification without DTC financial or MCFD legal-care limits.

11. **surrey-leisure-access — `REQS.lowIncome.unmet`**
    - Current: “This is for lower-income households.”
    - Snapshot (`surrey-leisure-access--1.txt`): foster-care route “enrollment ... will apply to the foster child(ren) and only one adult who is the legal guardian for the child(ren).”
    - Difference: Scope: universal household-income prerequisite extends income-route rules to legal-care qualification without a published household-income test there.

12. **surrey-leisure-access — `note` (family size 1)**
    - Current: “$25,588 for a family of 1”.
    - Snapshot (`surrey-leisure-access--1.txt`): “1 $26,355”.
    - Difference: Number: $25,588 versus $26,355.

13. **surrey-leisure-access — `note` (family size 2)**
    - Current: “$31,140 for 2”.
    - Snapshot (`surrey-leisure-access--1.txt`): “2 $32,075”.
    - Difference: Number: $31,140 versus $32,075.

14. **surrey-leisure-access — `note` (family size 3)**
    - Current: “$38,777 for 3”.
    - Snapshot (`surrey-leisure-access--1.txt`): “3 $39,940”.
    - Difference: Number: $38,777 versus $39,940.

15. **surrey-leisure-access — `note` (family size 4)**
    - Current: “$48,377 for 4”.
    - Snapshot (`surrey-leisure-access--1.txt`): “4 $49,829”.
    - Difference: Number: $48,377 versus $49,829.

16. **surrey-leisure-access — `note` (family size 5)**
    - Current: “$55,089 for 5”.
    - Snapshot (`surrey-leisure-access--1.txt`): “5 $56,742”.
    - Difference: Number: $55,089 versus $56,742.

17. **surrey-leisure-access — `note` (family size 6)**
    - Current: “$61,095 for 6”.
    - Snapshot (`surrey-leisure-access--1.txt`): “6 $62,928”.
    - Difference: Number: $61,095 versus $62,928.

18. **surrey-leisure-access — `note` (family size 7)**
    - Current: “$67,099 for 7”.
    - Snapshot (`surrey-leisure-access--1.txt`): “7 $69,112”.
    - Difference: Number: $67,099 versus $69,112.

19. **surrey-leisure-access — `note` (additional people)**
    - Current: “$6,006 more for each additional person.”
    - Snapshot (`surrey-leisure-access--1.txt`): “8 and more $6,186 for each additional person”.
    - Difference: Number: $6,006 versus $6,186 increment.

20. **surrey-leisure-access — `detail.documents[2]`**
    - Current: “Proof of Income Statement or Notice of Assessment for each adult when applying by income”.
    - Snapshot (`surrey-leisure-access--1.txt`), required documents: “Proof of Income Statement for each adult in the family.”
    - Difference: Scope: NOA is mentioned for income calculation, not as the required-document substitute asserted here.

21. **vancouver-leisure-access — `amount`**
    - Current: “50% off fitness centres and lessons”.
    - Snapshot (`vancouver-leisure-access--1.txt`): “50% discount for group skating lessons”; “50% discount for group swimming lessons”.
    - Difference: Scope: unqualified lessons drops group and named-discipline restrictions.

22. **vancouver-leisure-access — `eligibility.items[1] / requiresNote` (CDB)**
    - Current: “You qualify if you are a family with a child up to 17 who qualifies for the Child Disability Benefit”.
    - Snapshot (`vancouver-leisure-access--1.txt`): “To qualify a family must: Receive the Child Disability Benefit in their Canada Child Benefit notice”.
    - Difference: Boundary: eligibility alone replaces documented receipt; child age agrees.

23. **vancouver-leisure-access — `eligibility.items[1] / requiresNote` (DTC)**
    - Current: “or if you, your spouse or partner, or a dependent aged 18 or older qualifies for the Disability Tax Credit.”
    - Snapshot (`vancouver-leisure-access--1.txt`): “eligible if your family’s combined net income is less than or equal to ... based on family size and receipt of the Disability Tax Credit”; table “1 person $53,166” through “7 people $123,948”; financial exclusions follow.
    - Difference: Dropped conditions: definite DTC qualification omits income table, investment/rental/capital limits and receipt verification.

24. **vancouver-leisure-access — `eligibility.items[1] / requiresNote` (asylum/temporary worker)**
    - Current: “are an asylum seeker or temporary foreign worker”.
    - Snapshot (`vancouver-leisure-access--1.txt`): “Ask the non-profit or government agency to refer you”; “Take the original Third Party Referral form ... within 90 days”.
    - Difference: Dropped condition: status alone replaces mandatory agency-referral route.

25. **vancouver-leisure-access — `eligibility.items[1] / requiresNote` (low-income self-referral)**
    - Current: “a low-income resident who does not receive income assistance and cannot be referred”.
    - Snapshot (`vancouver-leisure-access--1.txt`): “eligible if your net family income is less than or equal to ... based on your family size”; table “1 person $43,028” through “7 people $113,810”; “For each additional person, add $8,450”; financial exclusions follow.
    - Difference: Dropped conditions: broad low-income label omits specific income table and investment/rental/capital exclusions.

26. **vancouver-leisure-access — `eligibility.items[1] / requiresNote` (EI)**
    - Current: “receiving Employment Insurance benefits in 2026/2027.”
    - Snapshot (`vancouver-leisure-access--1.txt`): “Projected family income must be at or below the low-income threshold below.”
    - Difference: Dropped conditions: EI years retained, projected-income table and financial exclusions omitted.

27. **adap — `REQS.adult.unmet`**
    - Current: “This is for people aged 18–64.”
    - Snapshot (`adap--1.txt`): “at least 18 years old and not eligible to receive an Old Age Security pension.”
    - Difference: Boundary: fixed under-65 ceiling replaces OAS-eligibility exclusion.

28. **adap — `summary / detail.about / REQS.adapMedical.unmet`**
    - Current: “severe disability significantly impedes employment, including episodically”; “significantly impedes employment, continuously or episodically.”
    - Snapshot (`adap--1.txt`): “To be medically eligible for ADAP, the severe disability must be determined to significantly restrict but not prevent a person from being employed.”
    - Difference: Dropped condition: retained ability to work distinguishing ADAP from AISH is omitted.

29. **bc-access-grant-students-disabilities — `note / eligibility.items[0] / requiresNote / detail.about / detail.steps[2]`**
    - Current: “B.C. public post-secondary schools only”; “a B.C. public post-secondary school”.
    - Snapshot (`bc-access-grant-students-disabilities--1.txt`): students at other schools in “2025/26” with the same program/school grant “may request to continue ... until their program is complete, or until July 31, 2029, whichever occurs first.”
    - Difference: Boundary / dropped exception: public-only rule excludes grandfathered other-school recipients.

30. **bc-at-home-saet — `summary`**
    - Current: “Pays for private occupational therapy, physiotherapy and speech-language pathology outside school hours”.
    - Snapshot (`bc-at-home-saet--2.txt`): those services “may be available to assist families with the cost of purchasing out-of-school direct (one-to-one) therapy services”.
    - Difference: Hedge: certain payment replaces possible cost assistance.

31. **bc-at-home-saet — `detail.about / detail.aboutList.lead`**
    - Current: “delivered one-to-one or in groups.”
    - Snapshot (`bc-at-home-saet--2.txt`): “out-of-school direct (one-to-one) therapy services”.
    - Difference: Scope: group delivery broadens the readable source's one-to-one description; unreadable PDF snapshot cannot resolve it.

32. **bc-autism-funding-6-18 — `detail.coversList.items[3] / detail.steps[2]`**
    - Current: “behaviour interventionists”; “hire qualified providers”.
    - Snapshot (`bc-autism-funding-6-18--1.txt`): “Behaviour interventionists (BI) (should be supervised by a professional listed above)”.
    - Difference: Dropped recommendation/hedge: professional supervision omitted; generic qualification is not supervision.

33. **bc-autism-funding-6-18 — `detail.about`**
    - Current: “or $600 per period for an accountant”.
    - Snapshot (`bc-autism-funding-6-18--1.txt`): “$600 per funding period for direct payment accountant fees”.
    - Difference: Dropped condition: accountant allocation loses direct-payment restriction.

34. **bc-autism-funding-6-18 — `detail.about / detail.tips[1]`**
    - Current: “For the final aligned funding period ending March 31, 2027, BC increased the allowable TTE portion to 50%.”
    - Snapshot (`bc-autism-funding-6-18--1.txt`): “50% on the adjusted portion” of plans 13 months or longer, “first 12 months ... at 20%”; youth “aging out (turning 19) prior to March 31, 2027 ... must not exceed 20%.”
    - Difference: Dropped conditions: blanket 50% loses long-plan adjusted-portion restriction and aging-out exception.

35. **bc-autism-funding-6-18 — `note`**
    - Current: “Current families transition to the BC Children and Youth Disability Benefit in phases; the ministry will contact them.”
    - Snapshot (`bc-autism-funding-6-18--2.txt`): “We will contact all recipients about their eligibility to transfer ... ahead of the transition.”
    - Difference: Hedge / scope: eligibility-to-transfer contact becomes assured transfer for current families; phases not established here.

36. **bc-autism-funding-6-18 — `detail.documents[0]`**
    - Current: “Diagnostic report or CF0905 confirmation form”.
    - Snapshot (`bc-autism-funding-6-18--2.txt`): out-of-province route requires CF0905 and “Copy of the original Diagnostic Report and/or any assessment information”; BCAAN requires “Clinical Outcome (PANTER) Form”; private route requires CF0904 plus report.
    - Difference: Scope / dropped documents: report and CF0905 are not unrestricted alternatives across diagnostic routes.

37. **bc-autism-funding-under-6 — `detail.coversList.items[2]`**
    - Current: “family counselling from certified counsellors, psychologists, social workers or psychiatrists”.
    - Snapshot (`bc-autism-funding-under-6--1.txt`): “The following professionals may be eligible” followed by specified certified/registered counsellors, registered psychiatrists, psychologists and social workers.
    - Difference: Hedge / dropped qualifications: generic occupational categories replace possible eligibility of specified qualified practitioners.

38. **bc-autism-funding-under-6 — `detail.tips[0] / detail.steps[3]`**
    - Current: “Providers must be on the RASP registry for children under 6”; “choose RASP-listed providers”.
    - Snapshot (`bc-autism-funding-under-6--1.txt`): “Family counselling/therapy providers do not need to be listed” on RASP; BIs “are supervised by a RASP professional”.
    - Difference: Scope / dropped exceptions: blanket registry rule excludes nonlisted counsellors and supervised BIs.

39. **bc-autism-funding-under-6 — `detail.about / detail.tips[1]`**
    - Current: “For the final aligned funding period ending March 31, 2027, BC increased the allowable TTE portion to 50%.”
    - Snapshot (`bc-autism-funding-under-6--1.txt`): “50% on the adjusted portion” for plans “13 months or longer, with the first 12 months being available at 20%”.
    - Difference: Dropped condition: 50% does not apply to an entire long plan, only its adjusted portion.

40. **bc-autism-funding-under-6 — `note`**
    - Current: “Current families transition to the BC Children and Youth Disability Benefit in phases; the ministry will contact them.”
    - Snapshot (`bc-autism-funding-under-6--2.txt`): “contact all recipients about their eligibility to transfer”.
    - Difference: Hedge / scope: eligibility-to-transfer contact becomes assured transfer; phases not established here.

41. **bc-autism-funding-under-6 — `detail.documents[0] / BENEFIT_META.effort`**
    - Current: “Diagnostic report confirming autism spectrum disorder”; “Application + qualifying diagnostic report”.
    - Snapshot (`bc-autism-funding-under-6--2.txt`), BCAAN route: “Copy of the BCAAN Clinical Outcome (PANTER) Form”; “Optional: Copy of BCAAN assessment report(s)”.
    - Difference: Scope / hedge: universal diagnostic-report requirement loses BCAAN's mandatory PANTER/optional-report distinction.

No replacement wording is proposed. NOT ON PAGE rows are evidence gaps, not correction recommendations. Phone comparisons found no conflicting same-purpose number in readable supplied evidence; absent numbers and differently labelled booking, registration, technical-support, local and toll-free lines are distinguished in the tables.

## Skipped snapshots

None: all 25 first lines contain `status: 200`, including Vancouver's annotated browser copy.

Evidence limitations, **not non-200 skips**:

- `bc-access-grant-deaf-students--1.txt`: status-200 PDF stream flattened to text, with replacement characters; not readable policy-manual contents.
- `bc-at-home-saet--1.txt`: status-200 PDF stream flattened to text, with replacement characters; not readable guide contents.

Neither was silently treated as extracted PDF prose. Their readable companion HTML snapshots were checked. No outside PDF fetch or inferred linked-page content was used. All other listed sources were readable; BC Transit's generic directory is usable only for the limited facts it actually states.

## Per-record detail

### fscd

Sources: `fscd--1.txt` (eligibility), `--2.txt` (overview).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Child age (summary/about; REQS.child) | “child under 18”; “This is for children under 18.” | CONFIRMED | --1: “your child with a disability must be under 18 years”. |
| Alberta residence (documents; REQS.ab) | “Proof of Alberta residency”; “This is an Alberta program.” | CONFIRMED | --1: “the child must reside in Alberta”. Residence confirmed; proof format not specified (below). |
| Guardianship/status check (REQS.fscdEligibility) | “Confirm guardianship, the child's status” | CONFIRMED | --1: “your child must be a Canadian citizen or permanent resident”; “the person applying for the program must be the child’s guardian”. |
| Medical documentation or awaiting diagnosis (same gate) | “medical documentation of disability or an awaiting-diagnosis assessment.” | CONFIRMED | --1: “Medical documentation must be provided confirming the child has a disability or is awaiting a diagnosis.” |
| Completed diagnosis mandatory (documents) | “A diagnosis of your child's disability from a professional” | DIFFERS | --1: “has a disability or is awaiting a diagnosis.” Boundary / dropped alternative: document list requires a diagnosis despite the awaiting-diagnosis route preserved in the gate. |
| Needs-based services and some extra-cost assistance | “Services + funding”; “reimbursement of some costs”; “helps families ... cover the extra costs and stress of caregiving” | CONFIRMED | --2: “provide support and services based on each child and family’s needs”; “with some of the extraordinary costs related to your child's disability”. Supports partial cost help, not particular reimbursement mechanics. |
| Specific support types | “respite, aids, counselling”; “specialized services”; “child-focused supports, family counselling” | NOT ON PAGE | --2 links “Specialized services” but does not describe coverage of these individual services; linked contents not read. |
| Reimbursement mechanism | “reimbursement of some disability-related expenses” | NOT ON PAGE | Some extraordinary costs are supported; reimbursement procedure not stated. |
| Concurrent federal Child Disability Benefit | “Separate from (and can be combined with) the federal Child Disability Benefit.”; “You can receive FSCD AND the federal Child Disability Benefit at the same time.” | NOT ON PAGE | Neither source discusses the federal Child Disability Benefit. |
| Contact / needs discussion | “Contact an FSCD office or Alberta Supports.”; “Meet with an FSCD worker to identify your family's needs.” | CONFIRMED | --1: “If your child is eligible, a worker will contact you to set a time to discuss your needs.” “Contact FSCD office locations Alberta Supports”. |
| Agreement describes services/funding; signed | “A signed agreement sets out the services and funding you'll receive.” | NOT ON PAGE | --1: “You may receive an Agreement for FSS”; agreement signature/content not reproduced. |
| Residence-proof document | “Proof of Alberta residency” | NOT ON PAGE | Residence required, but document requirement not stated. |
| Public awareness claim | “many families don't realize it's covered.” | NOT ON PAGE | No awareness/frequency assertion. |
| Assessment-based timing | “Assessment-based; contact them to begin.” | CONFIRMED | --1: “a FSCD caseworker who will assess your needs and update your agreement as required.” Does not assert all services await assessment. |
| Phone | “Alberta Supports: 1-877-644-9992” | NOT ON PAGE | Alberta Supports linked; no phone printed, so no same-purpose numeric conflict established. |

### handycard-translink

Source: `handycard-translink--1.txt` (HandyDART page with HandyCard section).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Photo identity card / conventional services | “Photo ID card”; “HandyCard is for conventional TransLink services, not HandyDART.” | CONFIRMED | “a photo-identity card for customers who need assistance to use the conventional system”; “HandyCard fares are valid only on conventional transit and cannot be used on HandyDART.” |
| Free card | “Free photo ID card” | NOT ON PAGE | Card issuance price not stated. |
| Concession fare entitlement | “concession fares for you” | CONFIRMED | “Cardholders are entitled to Concession fares”. |
| Free attendant and named modes | “The attendant travels free on buses, SkyTrain, SeaBus and West Coast Express.” | CONFIRMED | “their attendant travels for free when traveling on buses, SkyTrain, SeaBus, and West Coast Express.” |
| TaxiSaver access and half price | “access to half-price TaxiSaver coupons”; “unlocks the TaxiSaver program.” | NOT ON PAGE | No TaxiSaver described. |
| Metro Vancouver / BC scope (REQS.bc, metroVancouver) | “Metro Vancouver riders”; “This TransLink program is for Metro Vancouver residents.” | CONFIRMED | “If you’re a resident of Metro Vancouver, please complete the HandyDART and HandyCard Application Form.” Page locates service in Metro Vancouver, British Columbia address in footer. |
| Assistance barrier (REQS.transitBarrier) | “cannot use regular public transit without assistance for some or all trips.” | CONFIRMED | “unable to navigate conventional public transit without assistance for part or all of their trip due to disability”. |
| Same eligibility as HandyDART (requiresNote) | “Same eligibility and the same combined application form as HandyDART” | DIFFERS | “HandyDART users may also be eligible for HandyCard”; “Please refer to the application form for detailed eligibility criteria.” Scope / hedge: shared form is supported, but identity of eligibility is not; the page retains possible additional HandyCard qualification. |
| Named disability types | “a physical, sensory or cognitive disability” | CONFIRMED | “If you have a physical, sensory, or cognitive disability and cannot use conventional public transit for all trips without assistance, you may be eligible to use HandyDART.” Confirms listed barrier types; not identity of the two programs' criteria. |
| Combined application / simultaneous request | “Complete the combined HandyDART and HandyCard application”; “The same application can request HandyDART and HandyCard together” | CONFIRMED | “please complete the HandyDART and HandyCard Application Form.” |
| Separate HandyDART fare / one zone | “HandyDART trips are paid separately at the 1-Zone fare.” | CONFIRMED | “HandyCard fares ... cannot be used on HandyDART”; “All HandyDART trips are a 1-Zone fare.” |
| Carry original/show card every trip | “Carry the original photo card and show it”; “carry it on every eligible trip and show it when requested” | NOT ON PAGE | Photo identity and entitlement stated, not original-card/showing rules. |
| Application description/photo | “Describe why you cannot use conventional transit without an attendant”; “Include the required photo”; “A recent photo meeting the form requirements” | NOT ON PAGE | Form contents/required photo recency not reproduced. |
| Optional verification | “Optional supporting verification describing the transit barrier” | NOT ON PAGE | No optional-verification rule. |
| Minimum age | “must be at least 12” | NOT ON PAGE | Age criteria for HandyCard not given; HandyDART child fares do not verify this. |
| Phone / application help | “604-953-3680”; “Ask Access Transit when you apply” | CONFIRMED | “For general questions about HandyDART, HandyCard, or the Access Transit program, call us at 604.953.3680”. No same-purpose phone conflict. |
| Published timing (BENEFIT_META.wait) | “Not published — confirm with TransLink” | DIFFERS | “Please allow 4 to 6 weeks processing time for HandyCard applications.” Scope: metadata claims timing is unpublished despite an explicit HandyCard processing range. |

### handydart-bctransit

Source: `handydart-bctransit--1.txt` is the general BC Transit system selector, not a handyDART program/registration page. Its service directory is not evidence of the detailed regional rules.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| BC scope (REQS.bc) | “This is a British Columbia program.” | CONFIRMED | “BC Transit operates across ... British Columbia”. |
| Regional directory starting point | “Find your community on the BC Transit website” | CONFIRMED | “Choose a Transit System”; “Or Search Our Transit System Directory”; “Check out our community list by region”. |
| Door-to-door shared ride / closest accessible point | “shared, door-to-door service”; “Drivers drop you off at the closest accessible point near your destination.” | NOT ON PAGE | No handyDART service description. |
| Free registration | “Registration is free” | NOT ON PAGE | No registration price. |
| Free attendant | “attendants ride free” | NOT ON PAGE | No attendant fares. |
| Same-stop attendant condition | “must board and exit at the same stop as you” | NOT ON PAGE | No attendant condition. |
| Regional service residence | “You live in a BC Transit community that has handyDART service.” | NOT ON PAGE | Directory does not state handyDART availability/residence criteria. |
| Functional disability barrier / temporary or permanent (REQS.transitBarrier) | “permanent or temporary disability that prevents you from using fixed-route transit without assistance.”; “for some or all trips.” | NOT ON PAGE | No functional eligibility criteria. |
| Outside Metro Vancouver / TransLink alternative (REQS.outsideMetroVancouver unmet/short) | “Use the TransLink program in Metro Vancouver; this listing is for B.C. Transit communities.”; “Check whether to use B.C. Transit or TransLink for your area” | NOT ON PAGE | “Connecting with BC Ferries & TransLink” navigation is not evidence of handyDART jurisdiction. |
| Cash on boarding / advance fare products | “pay your fare with cash when you board, or buy fare products in advance.” | NOT ON PAGE | How to Pay linked only. |
| Regional contacts, fares, booking hours and timing vary | “Contacts, fares and booking hours differ by community”; “Varies by regional transit system”; “Each region has its own handyDART page, contact and booking office” | NOT ON PAGE | Regional directory only; no handyDART contact/booking comparison. |
| Regional application signature/date/submission/approval | “Complete, sign and date the regional handyDART application”; “Submit the form to the regional registrar ... booking after approval” | NOT ON PAGE | No application contents or process. |
| Describe barrier on application | “Describe which parts of fixed-route transit you cannot use without assistance” | NOT ON PAGE | Application not reproduced. |
| Optional medical form | “Optional Medical Verification of Eligibility form” | NOT ON PAGE | No form or optionality stated. |
| Requested mobility/travel details | “Mobility-aid measurements or travel-support details if requested by the region” | NOT ON PAGE | No handyDART document requirements. |
| Diagnosis/age/device not basis | “eligibility is based on functional ability, not diagnosis, age or mobility device” | NOT ON PAGE | Not stated. |
| Possible handyPASS / Taxi Saver | “Ask whether your region offers a handyPASS for a free attendant and Taxi Saver access” | NOT ON PAGE | Neither product described. |
| Local phone referral | “Use the handyDART number on your community's BC Transit page” | NOT ON PAGE | No handyDART number or contact instruction; no numeric conflict can be established. |

### local-supports

Sources: `local-supports--1.txt` (Alberta 211), `--2.txt` (BC 211), `--3.txt` (Canada 211). Generic catch-all referral record, not a particular municipal subsidy. No attempt made to apply any unrelated city's income thresholds. `provinceCovered` and `cityOther` are internal coverage/routing labels, not published 211 eligibility restrictions.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Community referral service | “2-1-1 can point you to yours”; “connects you to the specific programs in your community” | CONFIRMED | --3: “211 connects people to the right information and services”; “Dial 2-1-1 to connect to community services near you.” |
| Free and confidential | “a free, confidential service” | CONFIRMED | --1: “Free. Confidential.”; --3: “the free and confidential service”. |
| Universal 24/7 availability (about/tips) | “a free, confidential, 24/7 service”; “available 24/7 in many languages.” | DIFFERS | --3: “In most of Canada ... can be accessed 24 hours a day”; --2: “9am-9pm Weekdays (excl. Holidays)”. Scope / dropped hedge: record makes national 24/7 universal; BC explicitly has narrower navigator hours. Alberta does say “Live Answer 24/7.” |
| Multilingual | “in many languages” | CONFIRMED | --3: “in more than 150 languages”. The number is source evidence, not an additional record assertion. |
| Phone / provincial site channels | “Visit your provincial 2-1-1 site, or simply dial 2-1-1”; “Dial 2-1-1” | CONFIRMED | --3: “Choose your province/city to be directed to the correct 211 service”; “Call 2-1-1 to connect with your local 211 provider.” No phone conflict. |
| Any phone | “from any phone” | NOT ON PAGE | No universal device/network reachability claim. |
| Immediate information | “Immediate — it's an information service.” | CONFIRMED | --3: “Our online tools and live navigators will provide immediate information and support.” This does not independently establish out-of-hours live access. |
| Guaranteed exact programs and application instructions | “They'll point you to the exact local programs and how to apply.” | NOT ON PAGE | Referral guidance stated generally; no guarantee of exact applicable programs/application instructions. |
| Income information as document | “A rough idea of your household income” | NOT ON PAGE | --3 says “You do not have to give your name or personal details to ask for information.” It does not require/describe an income document; record list is informational preparation, not an explicit compulsory disclosure. |
| Locality information | “Your city or town name”; “Tell them your town” | CONFIRMED | --1: “Enter Your Location”; --3: “Choose your province/city”. |
| Municipal discounts/prevalence/names and amounts vary | “Many cities and towns run their own low-income or disability discounts on transit passes and recreation”; “Programs are named and run differently in every community”; “Varies by community” | NOT ON PAGE | Sources list transportation/recreation/financial/disability referral topics, not municipal discount prevalence, names, delivery or amounts. |

### pdd

Source: `pdd--1.txt` (overview; linked eligibility/services pages not supplied).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Alberta program (REQS.ab) | “This is an Alberta program.” | CONFIRMED | “Get help to navigate and access disability supports and services in Alberta”. |
| Adult developmental disability / independence | “Support services for adults with a developmental disability”; “live as independently as possible” | CONFIRMED | “PDD helps adults with developmental disabilities to live as independently as possible in their community.” |
| Exact adult age (documents; REQS.age18plus) | “You must be at least 18.”; “age 18+” | NOT ON PAGE | Overview says adults, no numeric age boundary. |
| Onset before 18 (note/steps/documents; REQS.developmental) | “developmental disability began before age 18”; “intellectual / developmental disability that began before age 18.” | NOT ON PAGE | Eligibility page linked, onset age not stated here. |
| Daily-living severity | “significantly affects daily living” | NOT ON PAGE | No functional severity threshold. |
| Specific services | “community access, home living supports, employment supports and specialized services” | NOT ON PAGE | Only general “planning and services to meet personal needs and goals.” |
| Services not direct cash / funding | “Funded support services (not a cash payment)”; “not direct cash” | NOT ON PAGE | Access to services stated, but funding/payment exclusions not stated. |
| Contact route | “Contact a PDD office or Alberta Supports to start.” | CONFIRMED | “Contact Disability Services offices Alberta Supports”. |
| Assessment confirms eligibility / timing | “An assessment confirms eligibility”; “Varies; assessment-based.” | NOT ON PAGE | No assessment/timing description. |
| Coordinator/support plan/provider connection | “Work with a coordinator to build a support plan and connect with service providers.” | NOT ON PAGE | “plan, coordinate and access services” describes program, not an assigned coordinator or these procedural steps. |
| Psychological assessment document | “Psychological assessment showing a developmental disability before age 18” | NOT ON PAGE | No required document list. |
| Alberta residence and proof | “Proof of Alberta residency” | NOT ON PAGE | Alberta program scope is not an explicit residency/document criterion. |
| Concurrent AISH / prevalence | “many people also receive AISH at the same time.” | NOT ON PAGE | No AISH/concurrency statement. |
| Citizenship and assessed intellectual/adaptive criteria (REQS.pddEligibility) | “Confirm PDD's citizenship and assessed intellectual/adaptive-function criteria.” | NOT ON PAGE | Detailed criteria not reproduced. |
| Phone | “Alberta Supports: 1-877-644-9992” | NOT ON PAGE | No phone printed; no same-purpose numeric conflict established. |

### stalbert-subsidy

Source: `stalbert-subsidy--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| City residence (REQS.stalbert unmet/short) | “This is a City of St. Albert program.”; “Check whether the City of St. Albert program is for your area” | CONFIRMED | “You must be a resident of St. Albert.” |
| Local transit free | “Free local transit”; “free local fares within St. Albert” | CONFIRMED | “Free local fares for travel within St. Albert.” |
| Handibus approved-rider condition | “free Handibus rides if you're an approved rider” | CONFIRMED | “Free local tickets for approved Handibus riders for travel within St. Albert.” |
| Handibus unrestricted scope in summary | “local buses and the Handibus are free” | DIFFERS | “Free local tickets for approved Handibus riders for travel within St. Albert.” Dropped condition / scope: summary omits both approved-rider and local-trip restrictions on Handibus. |
| Edmonton monthly commuter discount | “65% off the monthly Edmonton commuter pass” | DIFFERS | “65% off monthly adult commuter fares for travel between St. Albert and Edmonton.” Dropped condition: record does not retain adult restriction. |
| Free annual AISH/ADAP recreation membership | “AISH and ADAP recipients ... free annual recreation membership”; “Servus Place, Fountain Park and Grosvenor Pool” | CONFIRMED | “AISH and ADAP recipients are eligible for a free annual membership.” “all City-run recreation facilities including Servis Credit Union Place, Fountain Park Recreation Centre and Grosvner Outdoor Pool.” Source spellings retained here. |
| Automatic eligibility / no income test | “AISH and ADAP recipients get automatic eligibility here”; “isn't income-tested for you” | DIFFERS | “AISH and ADAP recipients are eligible for a free annual membership” but “Who Can Apply ... Your total annual household income (before taxes) must be within the low-income limits set by Statistics Canada.” Scope / hedge: source does not expressly waive its general household-income criterion; record asserts automatic eligibility/no income test. |
| One FCSS transit/recreation subsidy | “Family and Community Support Services runs one subsidy covering transit and recreation.” | CONFIRMED | “Apply for a Subsidy”; “Transit ... Recreation”; “For More Information Please Contact Family & Community Support Services”. |
| Application on City site | “Fill in the subsidy application on the City's subsidy page.” | CONFIRMED | “uses the Sharevision online platform for application intake. Apply for the City of St. Albert Subsidy”. |
| Benefit proof document | “Proof you receive AISH or ADAP” | NOT ON PAGE | Membership route stated, document requirement not described. |
| Address proof document | “Proof of a St. Albert address” | NOT ON PAGE | Residence required, proof format not stated. |
| Duplicate funding excluded | “You can't claim this if another source already funds the same thing” | CONFIRMED | “You must not be recieving funding from another source for the same option.” |
| Duration (detail.time / BENEFIT_META.wait) | “Allow a couple of weeks.”; “1–2 weeks” | NOT ON PAGE | No processing duration. |
| Phone | “St. Albert FCSS: 780-459-1756” | CONFIRMED | “Family & Community Support Services Phone: 780-459-1756”. General City 780-459-1500 is not the same purpose. |
| Municipal eligibility check (REQS.municipalProgramEligibility) | “Confirm the program's household-income or qualifying benefit-recipient route.” | CONFIRMED | “total annual household income ... within the low-income limits”; “AISH and ADAP recipients are eligible for a free annual membership.” Gate requests confirmation, not the note's explicit exemption. |

### strathcona-subsidy

Sources: `strathcona-subsidy--1.txt` (affordable services), `--2.txt` (Everybody Rides). Recreation detail page not supplied.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| County residence/scope (REQS.strathcona) | “for residents on a limited income”; “This is a Strathcona County program.” | CONFIRMED | --2: “resident of Strathcona County”; --1: “subsidies to residents with low incomes”. |
| Two named programs | “Everybody Rides”; “Everybody Gets to Play” | CONFIRMED | --1: “The Recreation Access Program (Everybody gets to play)”; “The Everybody Rides Program”. Names here identify two claimed program routes, not standalone counts. |
| Reduced Arc monthly fare cap local/commuter | “Everybody Rides puts a reduced monthly fare cap on your Arc card profile for local and commuter travel.” | CONFIRMED | --2: “Approved applicants receive a reduced monthly fare cap on their Arc card profile”; “Reduced monthly caps are available for both commuter and local service.” |
| Same card/profile mechanism | “you keep using the same card.” | CONFIRMED | --2: “receive a reduced monthly fare cap on their Arc card profile.” Does not assert new-card availability. |
| Free recreation pass / reduced program fees | “free ... Active Pass ... plus reduced fees on programs” | CONFIRMED | --1: “provides a free Active Pass and reduced-fee programs for residents with limited incomes.” |
| Annual Active Pass+ / facility scope | “free annual Active Pass+ for County recreation facilities” | NOT ON PAGE | --1 says Active Pass, not Active Pass+, annual duration or facility coverage. No contrary product definition supplied. |
| Income-tested not disability-specific (REQS.lowIncomeOrDisabilityIncome) | “These are income-tested rather than disability-specific”; “Confirm the municipality's household-income limit or an accepted benefit-recipient route.” | CONFIRMED | --2: “In addition to the household income requirement, you must be a resident ... and either a Canadian citizen, refugee or permanent resident.” --1 limits recreation to “residents with limited incomes.” Gate asks route confirmation, not automatic AISH qualification. |
| One-person annual income | “roughly $33,675/year for one person” | CONFIRMED | --2: “1 person Net household income is less than $2,806 per month ($33,675 per year)”. Weaker approximation is not a contradictory maximum. |
| AISH below threshold | “AISH is below that” | NOT ON PAGE | No AISH amount or recipient household-income exemption stated. |
| Office application / phone and address | “Call Family and Community Services at 780-464-4044, or go to 401 Festival Lane (Community Centre, 2nd floor).” | CONFIRMED | --2: “call 780-464-4044 or walk in to Family and Community Services (401 Festival Lane - in the Community Centre on the second floor of the east wing)”. No same-purpose phone conflict. |
| ID and address documents | “Photo ID”; “Proof of a Strathcona County address” | CONFIRMED | --2: “Identification showing birth date and photo ID”; “Proof of Strathcona County residency (only one required)”. |
| Generic alternative income proof | “CRA Notice of Assessment (or other proof of income)” | DIFFERS | --2: “Starting June 1, 2026 - a 2025 Notice of Assessment (NOA) ... will be required”; changed finances: “bring your NOA in addition to 3 months of bank statements”; first-year refugee/PR without NOA: “3 months bank statements from a Canadian bank.” Scope / dropped conditions: record makes other proof a general substitute instead of preserving restricted alternatives and current-year rule. |
| Same team / one visit both | “they're separate but handled by the same team.” | NOT ON PAGE | Shared affordable-services directory does not establish joint application handling for recreation. |
| Raised thresholds historically | “The County raised its income thresholds” | NOT ON PAGE | --2: “adjusted annually” does not establish a historical increase. |
| No published processing time | “Ask when you apply — it isn't published.” | NOT ON PAGE | No timing in these snapshots; absence here cannot establish nothing is published elsewhere. |

### surrey-leisure-access

Source: `surrey-leisure-access--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| City/BC residence (REQS.bc, surrey) | “You are a Surrey resident.” | CONFIRMED | “You may qualify ... if you are a Surrey resident”; footer “Surrey, BC, Canada”. |
| Free pass child/youth ages | “Free 1-year pass for ages 0-18” | CONFIRMED | “Children (0 to 12), youth (13 to 18) ... receive a free 1-year pass to all City of Surrey recreation facilities”. |
| Free senior pass age | “60+” | CONFIRMED | “seniors (60 and older) receive a free 1-year pass”. |
| Adult age/discount | “75% off for adults 19-59” | CONFIRMED | “Adults (19 to 59) receive a 75% discount on single admission, monthly or 1-year passes to all City of Surrey recreation facilities”. |
| Registered-course scope/caps (amount) | “plus 75% off registered courses” | DIFFERS | “75% discount on most registered courses”; “children and youth ages 0-18 receive up to $500 in program discounts and $500 in Semiahmoo Arts Society program discounts”; “Adults 19-59 and seniors 60+ receive up to $250 ... and $250”. Scope / dropped hedge and caps: unqualified amount omits most and age-based annual discount limits (applicable day camps have no limits). |
| Enrolment duration | “Enrolment is valid for one year.” | CONFIRMED | “your enrollment is valid for one year.” |
| Eligibility certainty / named routes (eligibility/requiresNote) | “You qualify one of these ways”; “with a Disability Tax Credit”; “as a client of the Ministry of Children and Family Development” | DIFFERS | “You may qualify ... if ... one of the following situations applies”; DTC: “family’s combined net income subtracted by your Disability Tax Credit is less than ... family size” plus investment/rental/RRSP/capital limits; MCFD: specified legal-care children/SAJE young adults. Hedge / dropped conditions: listed status alone becomes qualification, without DTC financial or MCFD legal-care restrictions. The page does list income-tax, Social Development, DTC, GIS, MCFD and refugee routes. |
| Mandatory low-income gate (REQS.lowIncome) | “This is for lower-income households.” | DIFFERS | “Clients of the Ministry of Children & Family Development ... enrollment ... foster child(ren) and only one adult who is the legal guardian”; no household income test imposed there. Scope: a universal household low-income prerequisite is broader than the route-specific published tests. Page's general financial-need framing does not make each route an income-table test. |
| Income line | “line 23600 of your Notice of Assessment” | CONFIRMED | “combined net income from line 23600 of your Notice of Assessment(s)”. |
| Income table 1 | “$25,588 for a family of 1” | DIFFERS | “1 $26,355”. Number: old maximum differs. |
| Income table 2 | “$31,140 for 2” | DIFFERS | “2 $32,075”. Number. |
| Income table 3 | “$38,777 for 3” | DIFFERS | “3 $39,940”. Number. |
| Income table 4 | “$48,377 for 4” | DIFFERS | “4 $49,829”. Number. |
| Income table 5 | “$55,089 for 5” | DIFFERS | “5 $56,742”. Number. |
| Income table 6 | “$61,095 for 6” | DIFFERS | “6 $62,928”. Number. |
| Income table 7 | “$67,099 for 7” | DIFFERS | “7 $69,112”. Number. |
| Additional-person increment | “$6,006 more for each additional person.” | DIFFERS | “8 and more $6,186 for each additional person”. Number. |
| Additional income-route financial limits | “must meet both the family-income table and the additional investment, rental, RRSP-deduction and capital-gain limits” | CONFIRMED | “line 12100 is $500 or less”; “line 12600 is $2000 or less”; “line 20800 is $2000 or less”; “line 25400 is $2000 or less”. Confirms existence/types, not numbers absent from the record. |
| Route-specific application/documents | “select the one that applies”; “Application form”; “Program confirmation, DTC information or referral documents for another qualifying route” | CONFIRMED | “Choose your application method and get copies of your required documents”; route sections enumerate confirmations/referrals. |
| Photo ID one adult | “Government-issued photo identification for one adult” | CONFIRMED | “Government issued photo ID for one adult in the family.” |
| NOA document alternative | “Proof of Income Statement or Notice of Assessment for each adult when applying by income” | DIFFERS | Required documents: “Proof of Income Statement for each adult in the family.” The calculation mentions NOA, but required documents do not name NOA as a substitute. Scope / dropped condition. |
| Submission channels / online appointment | “Submit online and wait for staff to schedule an appointment, or submit in person at a listed Surrey facility” | CONFIRMED | “Apply Online”; “Staff will contact you to schedule an appointment on a first come first served basis”; “In person ... Surrey Recreation Facility, Surrey City Hall – Healthy Communities office, Surrey Museum or Surrey Arts Centre.” |
| Pass registration via account/call | “use the pass through the MySurrey account or call registration staff” | CONFIRMED | “Register for an activity using your MySurrey account or call 604-501-5100”. |
| Free language support | “Translation and interpretation support are available free” | CONFIRMED | “Language translation services are available for free”; “Interpretation services are also available at all Surrey recreation facilities.” Free interpretation not separately priced, but described as part of the language support. |
| Accepted current tax year | “Check that tax documents are from a currently accepted year” | CONFIRMED | “As of September 1, 2026 all income tax documents submitted must be for the 2025 or 2026 tax year.” No specific year claimed by the record. |
| Specialty exclusions | “Ask whether a specialty program is excluded” | CONFIRMED | “There are a few specialty programs that aren't included”. |
| Appointment ordering | “first-come, first-served basis” | CONFIRMED | “schedule an appointment on a first come first served basis.” |
| Phone | “604-502-6325” | CONFIRMED | “Questions? Call 604-502-6325”. Registration 604-501-5100 serves a different purpose; not a conflicting general LAP number. |

### vancouver-leisure-access

Source: `vancouver-leisure-access--1.txt`, real-browser main content including collapsed sections; only promotional/account-help omissions as specified by user.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Vancouver/BC residence (REQS.bc, vancouver) | “You are a resident of the City of Vancouver.” | CONFIRMED | “Reside in the City of Vancouver”; office address “Vancouver BC”. |
| Low-income scope (REQS.lowIncome) | “This is for lower-income households.” | CONFIRMED | “supports low-income residents of Vancouver”; “eligibility is based on economic need”. |
| Free pool admission | “Free admission to pools” | CONFIRMED | “Indoor pools 100% admission discount”; “Outdoor pools 100% admission discount”. |
| Free rink admission | “and rinks” | CONFIRMED | “Ice rinks 100% admission discount”. |
| Fitness-centre half price | “50% off fitness centres” | CONFIRMED | “Fitness centres 50% admission discount”. |
| Lessons coverage | “50% off ... lessons” | DIFFERS | “50% discount for group skating lessons”; “50% discount for group swimming lessons”. Scope: unqualified lessons omits group and specified disciplines. |
| Most other recreation half price | “most other Park Board recreation is half price.” | NOT ON PAGE | Page lists diverse discounts and conditions, but no quantified “most” characterization of all other recreation. |
| Three-year duration / start / expiry | “Starting January 1, 2026 ... valid for 3 years”; “a pass issued in 2026 does not expire until 2029.” | CONFIRMED | “Starting January 1, 2026, Leisure Access passes will be valid for 3 years. Any pass issued in 2026 will not expire until 2029”. |
| UBC/UEL exclusion | “UBC and the University Endowment Lands are not in the City of Vancouver.” | CONFIRMED | “UBC and the University Endowment lands are not in the City of Vancouver”. |
| CDB route certainty / child age | “You qualify if you are a family with a child up to 17 who qualifies for the Child Disability Benefit” | DIFFERS | “To qualify a family must: Receive the Child Disability Benefit in their Canada Child Benefit notice”; “2025 Canada Child Benefit”. Boundary / dropped condition: entitlement alone replaces documented receipt. Child age up to 17 agrees. |
| DTC route certainty / financial restrictions | “You can also qualify”; “or if you, your spouse or partner, or a dependent aged 18 or older qualifies for the Disability Tax Credit.” | DIFFERS | “eligible if your family’s combined net income is less than or equal to ... based on family size and receipt of the Disability Tax Credit”; table 1–7: “$53,166 ... $123,948”; exclusions “Interest and Investment Income ... over $1,500”, rental and capital gains “over $2,000”. Dropped conditions: record's definite DTC route omits financial table and investment/rental/capital limits, plus required verification of receipt. |
| Income-assistance/listed subsidy route | “you receive income assistance or another listed provincial or federal subsidy” | CONFIRMED | “You receive income assistance or one of the following provincial or federal financial subsidies”. Record defers to list, not any subsidy. |
| Agency referral | “a client of a non-profit or government agency that can refer you” | CONFIRMED | “You are a client of a non-profit or government agency, which can refer you”. |
| Asylum/temporary-worker route | “are an asylum seeker or temporary foreign worker” | DIFFERS | Under that heading: “Ask the non-profit or government agency to refer you”; “Take the original Third Party Referral form ... within 90 days”. Dropped condition: status is presented as sufficient without required agency referral. |
| Low-income self-referral route | “a low-income resident who does not receive income assistance and cannot be referred” | DIFFERS | “eligible if your net family income is less than or equal to” listed family-size limits, with investment/rental/capital exclusions. Scope / dropped conditions: broad low-income label replaces specified threshold and financial exclusions; record never directs readers to those limits. |
| EI route year / projected-income condition | “receiving Employment Insurance benefits in 2026/2027.” | DIFFERS | “You are receiving Employment Insurance (EI) benefits in 2026/2027”; “Projected family income must be at or below the low-income threshold below.” Dropped condition: record retains years but omits projected-income table and financial exclusions. |
| OneCard/ActiveNet | “membership added to the OneCard and ActiveNet account” | CONFIRMED | “a Leisure Access membership will be added to your OneCard and linked to your ActiveNet account.” |
| Route-specific form/benefit/income documents | “Complete the Leisure Access application”; “Proof of a qualifying benefit or current Proof of Income Statement, depending on route” | CONFIRMED | “Complete the application form”; DTC “2025 Proof of Income Statement ... verifying receipt”; subsidy “One of the following income assistance confirmations”. General categories confirmed, not universal substitute documents. |
| Address proof and 90-day recency | “Proof of a City of Vancouver address dated within 90 days” | CONFIRMED | “Proof of address ... in the City of Vancouver dated within 90 days”. |
| Government ID | “Government-issued identification” | CONFIRMED | “Identification, such as: Government-issued photo identification”. |
| In-person or mail submission | “at a Park Board community centre or by the stated mail process” | CONFIRMED | “Drop off application at a Park Board community centre”; “Mail application to: Leisure Access Office”. |
| Photo consent age and guardian | “For a child 16 or younger, complete the parent or guardian photo-consent form” | CONFIRMED | “Children and youth aged 16 and under require a signed OneCard photo consent form ... from a parent or guardian.” |
| POI not NOA | “A Notice of Assessment is not the same as the CRA Proof of Income Statement requested for the low-income route” | CONFIRMED | “2025 Proof of Income Statement (not Notice of Assessment) is required”. |
| Partner venue pass/photo ID | “Bring the pass and photo identification when a partner venue requires both” | CONFIRMED | PNE/Playland: “Present your Leisure Access pass (OneCard) and photo ID”; Aquarium: “present your valid LAP card, photo ID, and your ticket”. |

No numeric phone is present in this record; no same-purpose phone discrepancy to flag. “Ask ... when submitting” is advice, not a processing-time assertion.

### adap

Sources: `adap--1.txt` (overview), `--2.txt` (application).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Monthly maximum | “Up to $1,740/month” | CONFIRMED | --1: “ADAP’s core financial benefit is $1,740 per month.” Income-dependent deductions described; up-to hedge does not contradict the core rate. |
| Health/personal/employment supports | “health, personal and employment benefits”; “It can include a core monthly financial benefit” | CONFIRMED | --1: “Depending on your situation, you may receive” living allowance, health and personal benefits; “Employment supports ... customized, one-on-one support”. |
| Alberta residence/status (REQS.ab, citizenPR) | “Proof of Alberta residency + Canadian citizenship / PR”; “You must be a Canadian citizen or permanent resident.” | CONFIRMED | --1: “You live in Alberta and are a Canadian citizen or permanent resident.” Proof format not specified (below). |
| Age ceiling (REQS.adult) | “This is for people aged 18–64.” | DIFFERS | --1: “at least 18 years old and not eligible to receive an Old Age Security pension.” Boundary: numeric under-65 ceiling replaces OAS eligibility exclusion. |
| Medical definition / route (summary/about; REQS.adapMedical unmet/short) | “severe disability significantly impedes employment, including episodically”; “Alberta decides whether your disability significantly impedes employment, continuously or episodically.”; “Check Alberta's disability review for AISH and ADAP” | DIFFERS | --1 repeats the impedes criterion but adds “To be medically eligible for ADAP, the severe disability must be determined to significantly restrict but not prevent a person from being employed.” Dropped condition / scope: record omits retained ability to work, which distinguishes ADAP from AISH. |
| Combined assessment / Alberta decides | “same combined application assesses ADAP and AISH”; “you do not make two separate applications.” | CONFIRMED | --1: “There is one application for both AISH and ADAP”; “Eligible applicants will be placed into the program that best suits their unique needs and abilities.” |
| Required medical report | “Disability Assistance Medical Report, completed by your health professional” | CONFIRMED | --2: “Your health professional will need to complete the Disability Assistance Medical Report”. |
| Alberta-registered practitioner | “medical professional registered in Alberta” | NOT ON PAGE | Registration jurisdiction not stated in supplied pages. |
| Medical report employment content | “Medical report describing how the disability significantly impedes employment” | CONFIRMED | --1: application collects medical information to decide medical eligibility; “significantly restrict but not prevent ... employed”. Confirms medical evidence relevant to employment, not unseen form fields. |
| Status/residence proof format | “Proof of Alberta residency + Canadian citizenship / PR” | NOT ON PAGE | Criteria stated, specific documents not listed. |
| Financial information | “Financial details (income and assets)” | CONFIRMED | --1: “basic, financial, and medical requirements”; --2: “general, financial or medical information required”. General financial information supported; detailed asset criteria below not given. |
| Paper DIA form if not online | “Disability Income Assistance (DIA) application form, if you cannot apply online” | CONFIRMED | --2: “If you cannot apply online, complete the Disability Income Assistance Application form”. |
| Benefit estimator | “Use Alberta's AISH/ADAP benefit estimator for a household-specific estimate” | CONFIRMED | --1: “See the Disability Assistance Benefits Calculator to determine benefits based on your unique situation”. |
| CDB/DTC approval/denial reporting | “report the outcome of your CDB and/or DTC application to Alberta” | CONFIRMED | --1: “must inform the ADAP program of the approval or denial of your Canada Disability Benefit and/or Disability Tax Credit application.” |
| Reporting approved CDB amount | “including the approved CDB amount” | NOT ON PAGE | Approval/denial reporting stated, amount reporting not stated. |
| CDB deduction dates/amount | “when no CDB decision had been made by February 28, 2026, $200 was reduced from April 2026 benefits.” | NOT ON PAGE | No such February/April rule. Other $200 transition benefit on --1 is not this deduction. |
| Online-help phones | “1-877-644-9992, or 780-644-9992 in Edmonton.” | CONFIRMED | --2: “Alberta Supports Contact Centre at 1-877-644-9992 or in Edmonton 780-644-9992”. |
| Medical-report fee / payer / possible Income Support coverage | “may charge you a fee”; “responsible for paying it”; “on Income Support that cost may be covered” | CONFIRMED | --2: “may charge you”; “responsible for paying the fee”; “If you are on Income Support, the cost ... may be covered”. |
| Backdating month after complete information | “backdated to the month AISH or ADAP received all of the information needed to approve your application” | CONFIRMED | --2: “benefits will be backdated to the month ... received all of the information that was required to approve your application”. |
| Application/status phones | “587-759-6810 ... Edmonton”; “1-877-759-6810 toll free within Alberta”; “DIA Application Processing Centre (applications and status): 1-877-759-6810” | CONFIRMED | --2: “questions about the status ... 587-759-6810 (Edmonton area), or 1-877-759-6810 (toll free, Alberta).” No same-purpose phone conflict. |
| Quick reopening conditions / possibility | “If you left AISH or ADAP less than 2 years ago, and not because your medical condition changed, your file may be reopened quickly” | CONFIRMED | --2: “may have your file reopened quickly if: it has been less than 2 years since you got your last AISH benefits you did not leave AISH or ADAP due to a change in your medical condition”. Last-benefit timing is expressed as leaving in the record, not a guaranteed reopening or a longer window. |
| Monthly income review (REQS.adapFinancial) | “ADAP reviews your income monthly” | NOT ON PAGE | Employment deductions described but review frequency not stated. |
| Asset ceiling (same gate) | “non-exempt assets must stay at or under $100,000” | NOT ON PAGE | No asset ceiling here. |
| Other-income application obligation/examples (same gate and short) | “must also apply for other income ... such as CPP-D, the Canada Disability Benefit, EI or WCB”; “Check ADAP income reviews, assets and other possible benefits” | NOT ON PAGE | --2 offers other-benefit help while waiting, not an obligation to apply for this list. |

### bc-access-grant-deaf-students

Sources: `bc-access-grant-deaf-students--2.txt` is readable HTML text. `--1.txt` has status 200 but contains a flattened PDF stream (`%PDF-1.6`, `/FlateDecode`, replacement characters), not extracted policy prose. No readable grant sentences/amounts can be recovered from that supplied text; it is not treated as a non-200 skip, nor as evidence from the original linked PDF. NOT ON PAGE here includes this evidence limitation.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Annual need-based maximum | “Up to $30,000 per program year, based on financial need assessed by StudentAid BC” | NOT ON PAGE | --2 gives financial need but no $30,000 maximum or annual period; --1 is not readable policy text. |
| Specialized ASL-school extra costs | “Helps deaf and hard of hearing students with the extra cost of attending a specialized school that teaches in American Sign Language.” | CONFIRMED | --2: “helps deaf and hard of hearing students cover the extra costs of attending specialized schools that offer American Sign Language.” |
| Deaf/hard-of-hearing status (REQS.hearingDisability) | “You are deaf or hard of hearing.”; “This grant is specifically for Deaf or hard-of-hearing students.” | CONFIRMED | --2: “Are deaf or hard of hearing”. |
| Verified disability status | “Your disability status is verified by StudentAid BC.” | CONFIRMED | --2: “Have disability status verified by StudentAid BC”. |
| Financial need | “You demonstrate financial need.” | CONFIRMED | --2: “Demonstrate financial need”. |
| Full-time course load boundary | “60% or more” | CONFIRMED | --2: “full-time course load (60% or more)”. |
| Only eligible schools / places | “only ... Gallaudet University in Washington, D.C. and the National Technical Institute for the Deaf in Rochester, New York”; “both in the United States.” | CONFIRMED | --2: “Eligible schools: Gallaudet University in Washington, D.C. National Technical Institute for the Deaf in Rochester, New York”. Named US locations support geography. |
| No separate application / automatic assessment with verified status and school | “There is no separate application”; “they assess your eligibility automatically.” | CONFIRMED | --2: “You don't need to submit a separate application. If StudentAid BC has verified your disability status and you are attending one of the eligible schools, we will assess your eligibility”. Assessment, not guaranteed award. |
| BC student program (REQS.bc, student) | “This is a British Columbia program.”; “This is for post-secondary students.” | CONFIRMED | --2: “B.C. Access Grant for Deaf Students”; named university/institute and full-time course-load requirement. This verifies program scope, not an unprinted residency rule. |
| Professional disability verification (REQS.disabilityDoc) | “Have a qualified professional verify the disability or functional limitation first.” | NOT ON PAGE | StudentAid verification required, qualified-professional method not described. |
| StudentAid application/full-time enrolment documentation | “StudentAid BC application”; “Full-time enrolment information for one of the two eligible schools” | NOT ON PAGE | --2 says no separate application and lists criteria, not the initial aid application's procedure/document list. |
| Disability Verification Form | “Submit the Disability Verification Form if StudentAid BC has not already verified deaf or hard-of-hearing status” | NOT ON PAGE | Named form not reproduced. |
| Financial/enrolment follow-up | “Provide any financial-need or enrolment information StudentAid BC requests” | NOT ON PAGE | No follow-up procedure described. |
| Concurrent assessment time | “Assessed with the StudentAid BC application” | NOT ON PAGE | Automatic eligibility assessment stated, but timing relative to initial aid application not given. |
| Phone | “1-800-561-1818” | NOT ON PAGE | Contact Information linked, no number printed in readable source; no numeric conflict established. |

### bc-access-grant-students-disabilities

Source: `bc-access-grant-students-disabilities--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Annual amount/week | “Up to $1,560 per program year ($30 per week of study)” | CONFIRMED | “up to $1,560 ($30 per week of study) per program year”. |
| Nonrepayable replaces BC loan | “Non-repayable grant money that replaces B.C. student loans”; “so you borrow less” | CONFIRMED | “replacing ... B.C. student loan funding with non-repayable grant funding.” |
| Full-time study (REQS.student) | “You are a full-time student”; “This is for post-secondary students.” | CONFIRMED | “are enrolled in a full-time program at a designated public post-secondary school”. |
| Public-BC-schools-only restriction | “B.C. public post-secondary schools only”; “You are a full-time student at a B.C. public post-secondary school.” | DIFFERS | “Students enrolled at schools other than a B.C. public school during the 2025/26 program year who received BCAG-D funding for the same program at the same school, may request to continue ... until their program is complete, or until July 31, 2029, whichever occurs first.” Boundary / dropped exception: universal public-only condition excludes grandfathered other-school recipients. |
| Federal/provincial aid eligibility | “You qualify for federal and provincial student financial aid.” | CONFIRMED | “qualify for federal and provincial student financial aid”. |
| Disability types/definition | “permanent disability, or a persistent or prolonged disability as defined by the Canada Student Financial Assistance Program.” | CONFIRMED | “have a permanent disability, or a persistent or prolonged disability as defined by the Canada Student Financial Assistance Program”. |
| BC program (REQS.bc) | “This is a British Columbia program.” | CONFIRMED | “B.C. Access Grant”; “B.C. student loan funding”. |
| Professional verification (REQS.disabilityDoc) | “Have a qualified professional verify the disability or functional limitation first.” | NOT ON PAGE | Disability types stated; verification procedure in linked page only. |
| Initial full-time aid application | “Apply for full-time StudentAid BC funding for the study period”; “StudentAid BC application” | NOT ON PAGE | “Visit How to apply for disability funding to learn more.” Procedure not reproduced. |
| Conditional verification form/accepted medical assessor | “Disability Verification Form completed by an accepted medical assessor”; “if status is not already verified” | NOT ON PAGE | No named form, assessor or prior-verification exception. |
| Account assessment notice/concurrent assessment | “Review the assessment notice in your StudentAid BC account”; “Assessed with the StudentAid BC application” | NOT ON PAGE | Account/assessment timing not described. |
| Follow-up financial information | “Any follow-up financial information StudentAid BC requests” | NOT ON PAGE | Not stated. |
| No separate application after verification | “There is no separate grant application after disability status is verified” | NOT ON PAGE | Not stated on this page; cannot import Deaf grant procedure. |
| Accessibility office related funding/accommodations | “Contact the school's accessibility services office early for accommodations and related disability funding” | NOT ON PAGE | Office role not described here. |
| Phone | “1-800-561-1818” | NOT ON PAGE | No number printed; no same-purpose numeric conflict established. |

### bc-assistance-program-students-disabilities

Source: `bc-assistance-program-students-disabilities--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Maximum | “Up to $10,000” | CONFIRMED | “Depending on your need, grants of up to $10,000 ... are available”. |
| Attendant maximum/condition | “or up to $12,000 if an attendant is required at school” | CONFIRMED | “($12,000 if an attendant is required at school)”. |
| Services/adaptive-equipment purpose | “Funding for exceptional education-related services and adaptive equipment” | CONFIRMED | “helps students with disabilities pay for exceptional education-related services and adaptive equipment.” Describes funding purpose, not full reimbursement of every cost. |
| Federal grant exhausted / first route | “only receive this grant once you have used up all available funds through the Canada Student Grant for Services and Equipment – Students with Disabilities”; “Apply ... first.” | CONFIRMED | “You can only receive this grant when you have used up all available funds through the Canada Student Grant for Services and Equipment ... (CSG-DSE).” Source's general sentence coexists with developmental route; record follows that general sentence. |
| Institution scope | “designated private or public post-secondary institution in B.C.” | CONFIRMED | “are enrolled at a designated private or public post-secondary institution in B.C.” |
| Disability types | “permanent disability, or a persistent or prolonged disability.” | CONFIRMED | “a permanent disability, or a persistent or prolonged disability”. |
| Developmental programs/courses | “It also covers students in developmental programs or courses.” | CONFIRMED | “are in developmental program/courses (upgrading, English as a Second Language or Accessible Education and Training)”. |
| Annual/lifetime maximum not specified | “The page does not say whether these amounts are per year or a lifetime limit.” | CONFIRMED | “grants of up to $10,000 ($12,000 if an attendant is required at school)” with no period qualifier in the complete readable page. This is a bounded assertion about this page, not all publications. |
| Annual estimate basis (BENEFIT_VALUES.annualMax) | `annualMax: 10000` | NOT ON PAGE | No annual period specified by the page; the internal annual amount encodes a period not established here. Excluded from estimates does not establish that period. |
| Documented exceptional costs (BENEFIT_META.effort) | “Student aid + documented exceptional education costs” | NOT ON PAGE | Exceptional-cost purpose confirmed above, but no specific cost-documentation requirement in this source. |
| Sequential assessment timing (BENEFIT_META.wait) | “After other disability funding is assessed” | NOT ON PAGE | Exhaustion required; exact assessment timing relative to other applications not stated. |
| BC/post-secondary scope (REQS.bc, student) | “This is a British Columbia program.”; “This is for post-secondary students.” | CONFIRMED | “B.C. Assistance Program”; “students attending public and private post-secondary schools in B.C.” Developmental students already retained in record. |
| Professional verification (REQS.disabilityDoc) | “Have a qualified professional verify the disability or functional limitation first.” | NOT ON PAGE | No verification procedure here. |
| StudentAid verifies status | “Have StudentAid BC verify your disability status”; “Verified disability status” | NOT ON PAGE | No explicit verification step. |
| School accessibility assessment / submission | “Meet with the school's accessibility services office”; “have the accessibility office submit the B.C. Assistance Program request and quotes” | NOT ON PAGE | Linked disability-funding procedure not reproduced; office's role not described. |
| Quotes/cost estimates | “Supplier quotes or service-cost estimates” | NOT ON PAGE | Not listed. |
| Exhaustion evidence document | “Evidence that the federal services-and-equipment grant has been used” | NOT ON PAGE | Exhaustion criterion confirmed, separate required evidence document not listed. |
| Prior written approval / purchase restriction | “Wait for written approval before purchasing equipment or committing to services”; “Do not buy equipment before written funding approval” | NOT ON PAGE | Not stated. |
| Processing variability and drivers | “Varies with assessment, quotes and funding review” | NOT ON PAGE | No processing duration/drivers described. |
| Phone | “1-800-561-1818” | NOT ON PAGE | Contact Information linked, number not printed; no numeric conflict established. |

### bc-at-home-saet

Sources: `bc-at-home-saet--2.txt` is readable medical-benefits HTML. `--1.txt` has status 200 but is flattened PDF object/stream data (`%PDF-1.7`, replacement characters), not extracted guide prose. It cannot verify the guide's benefit tables. It is not skipped as non-200, and the original PDF was not fetched. NOT ON PAGE includes this limitation; readable PDF metadata/link titles are not guide coverage evidence.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| BC program (REQS.bc) | “This is a British Columbia program.” | CONFIRMED | --2: “At Home Program medical benefits - Province of British Columbia”. |
| School age (requiresNote; REQS.schoolAge) | “School-aged children and youth”; “This is for school-aged children and youth.” | CONFIRMED | --2: “School-Aged Extended Therapy (SAET)”. |
| At Home enrolment (REQS.atHomeProgram) | “The child must first be enrolled in the At Home Program.” | CONFIRMED | --2 describes SAET as “At Home Program Medical Benefits” for “eligible children and youth”; “Children receiving SAET funding transition ... At Home Program Medical Benefits remain.” Confirms program stream, not detailed unseen entry assessment. |
| Three ADL dependence threshold (REQS.childThreeAdls) | “dependence in at least 3 of eating, dressing, toileting and washing.” | NOT ON PAGE | No ADL criteria in readable source. |
| OT annual maximum/period | “Up to $5,760/year each for OT”; “per 12-month period” | NOT ON PAGE | No amounts in readable SAET section. |
| PT annual maximum/period | “$5,760/year each for ... PT” | NOT ON PAGE | No PT amount. |
| SLP annual maximum/period | “$5,760/year each for ... speech therapy” | NOT ON PAGE | No SLP amount. |
| Chiropractic/massage shared annual allocation | “up to $1,920/year for chiropractic or massage” | NOT ON PAGE | Neither service/allocation described. |
| Therapy coverage certainty | “Pays for private occupational therapy, physiotherapy and speech-language pathology outside school hours” | DIFFERS | --2: “Occupational therapy, physiotherapy and speech language therapy services may be available to assist families with the cost of purchasing out-of-school direct (one-to-one) therapy services”. Hedge: certain payment replaces possible assistance with costs. Named disciplines and out-of-school scope agree. |
| Group delivery | “delivered one-to-one or in groups.” | DIFFERS | --2: “out-of-school direct (one-to-one) therapy services”. Scope: record extends described coverage to groups; unusable guide snapshot cannot resolve that conflict. |
| Therapist-assistant eligibility | “including therapist-assistant services” | NOT ON PAGE | --2 links “Therapists assistants (PDF)” but no eligibility/coverage prose. |
| Therapist maximum rate | “$160/hour for therapists” | NOT ON PAGE | No billing rate. |
| Assistant maximum rate | “$60/hour for therapist assistants” | NOT ON PAGE | No billing rate. |
| Consultation/report/travel allocation | “up to $480 of the maximum can go to consultation, report writing and travel.” | NOT ON PAGE | No allocation. |
| Chiropractic rate | “$40/session” | NOT ON PAGE | No rate. |
| Massage rate | “$40/hour” | NOT ON PAGE | No rate. |
| Post-surgical exceptions above maxima | “Exceptions to maximums are considered for post-surgical rehabilitation”; “can exceed the annual maximum” | NOT ON PAGE | --2: “Address post-surgical rehabilitation needs” supports purpose, not above-maximum exceptions. |
| Complements school therapy | “Services must complement, not duplicate, school-based therapy.” | CONFIRMED | --2: “SAET services enhance the primary OT and PT services made available through the SAT program and school district SLP services”. Confirms complementary role, not separate coordination protocol (below). |
| Request form / review / preapproval | “Request for School-Aged Extended Therapies form”; “Submit the request to AHP Medical Benefits for review” | CONFIRMED | --2: “Medical Benefits require pre-approval”; “Request Forms ... School-Aged Extended Therapies (PDF)”. Confirms a request/preapproval process, not unseen form contents. |
| Treating professional completes form | “Have the treating OT, PT, SLP, chiropractor or massage therapist complete” | NOT ON PAGE | Form linked, completion/signature/provider instructions not reproduced. |
| Functional outcomes / Part 5 | “Functional outcomes for the child (Part 5 of the request form)” | NOT ON PAGE | No numbered form contents. |
| Direct invoice/payment | “Approved therapists invoice AHP Medical Benefits directly” | CONFIRMED | --2: “paid for directly by the program”; service-provider portal enables “creating and submitting invoices”. |
| School-team coordination requirement | “requesting therapist must coordinate with the school-based therapy team” | NOT ON PAGE | Enhancing school services stated, mandatory coordination not stated. |
| Sequential blocks preferred | “Sequential therapy blocks (one goal at a time) are preferred” | NOT ON PAGE | No scheduling preference. |
| Transition start month and contact | “SAET recipients transitioned to the Disability Benefit starting April 2026.” | CONFIRMED | --2: “Children receiving SAET funding transition to the new Disability Benefit starting April 2026. All families will be contacted.” |
| Exact implementation day | “implementation began April 1, 2026” | NOT ON PAGE | April 2026 stated, not day one. |
| Other cohorts/order | “SAET families were among the first moved”; “starting with children already in the At Home Program, autism funding and other ... services” | NOT ON PAGE | No comparative order or other cohort list. |
| Therapies approved under new benefit | “therapies remain an approved use of the new benefit” | NOT ON PAGE | No new benefit approved-use rules. |
| SAET end / earlier child transition / authorizations | “until March 31, 2027, or until your child transitions, whichever comes first”; “all SAET authorizations are being updated to align with that end date.” | NOT ON PAGE | --2 only says new families can still apply until March 2027; does not specify termination/authorization rules. |
| New-family current applications | “New families are told to keep using the current pathways for now.” | CONFIRMED | --2: “New families can still apply until March 2027.” |
| Full provincewide operation date | “fully operational provincewide from April 1, 2027.” | NOT ON PAGE | No full-operation date. |
| New annual benefit allocations | “new $6,500/$17,000 allocation” | NOT ON PAGE | No new benefit amounts; both tiers unsupported here. |
| Capacity-dependent wait (BENEFIT_META.wait) | “Varies with assessment and local capacity” | NOT ON PAGE | No local-capacity processing-time rule in readable source. |
| Phone | “1-888-613-3232” | CONFIRMED | --2: “Contact Medical Benefits ... Office 1-888-613-3232 (Toll free)”. Victoria 250-387-9649 is a labelled local alternative, not a conflicting number. |

### bc-autism-funding-6-18

Sources: `bc-autism-funding-6-18--1.txt` (amounts/uses), `--2.txt` (application). Their bodies are byte-identical to the corresponding under-six snapshots, excluding first-line headers. No linked transition page or handbook assumed read.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Annual child maximum | “Up to $6,000/year”; “per year per child” | CONFIRMED | --1: “Children aged 6 to 18 Up to $6,000 per year for each child”. |
| Age boundary (REQS.age6to18) | “children and youth aged 6 to 18”; “This program is for children and youth aged 6–18.” | CONFIRMED | --1: “Children aged 6 to 18”. |
| Autism diagnosis / BC-standard assessment (requiresNote; REQS.autismSelected, autismDiagnosis unmet/short) | “autism spectrum disorder diagnosis meeting BC standards”; “Check whether the autism diagnosis meets B.C. standards” | CONFIRMED | --2: “ensure you have had an assessment and diagnosis”; private assessment requires “ADOS-2 and ADI-R”; prior diagnosis must meet “DSM-5 criteria”. Confirms recognized assessment, not diagnosis-name alone. |
| BC program (REQS.bc) | “This is a British Columbia program.” | CONFIRMED | --2: “BC Children and Youth Disability Benefit Transition”; required “Proof of age and residency (example: birth certificate, BC Services Card)”. |
| Consultants/analysts, SLP, OT/PT | “behaviour consultants or analysts”; “speech-language pathologists”; “occupational or physical therapists” | CONFIRMED | --1: “Behaviour consultants or analysts, speech-language pathologists, occupational therapists or physical therapists”. |
| Interventionist coverage condition | “behaviour interventionists”; “hire qualified providers” | DIFFERS | --1: “Behaviour interventionists (BI) (should be supervised by a professional listed above)”. Dropped condition / hedge: record's unqualified item omits the recommended professional supervision; “qualified” is not supervision. |
| Life/social skills | “life skills and social skills programs” | CONFIRMED | --1: “Life skills and social skills programs”. |
| Out-of-school learning/tutoring | “out-of-school learning support and tutoring” | CONFIRMED | --1: “Out-of-school learning support that's not part of a regular school program ... support and tutoring that takes places outside of school hours”. Record's summary also says out-of-school tutoring; no in-school coverage asserted. |
| Dietician qualification | “dietary counselling from registered dieticians” | CONFIRMED | --1: “Dietary counselling from a registered dietician”. |
| Family counselling | “family counselling” | CONFIRMED | --1: “Family counselling/therapy”. |
| Specialized camps | “specialized therapeutic camps for autism” | CONFIRMED | --1: “Specialized therapeutic activities and camps designed for children with autism”. |
| Monthly administrative limit | “Administrative costs are normally limited to $50/month” | CONFIRMED | --1: “Administrative costs related to managing service providers – up to $50 monthly to pay a bookkeeper”. General administrative category corresponds to service-provider management in context. |
| Accountant alternative scope | “or $600 per period for an accountant” | DIFFERS | --1: “$600 per funding period for direct payment accountant fees”. Dropped condition: accountant limit is specifically direct-payment accountant fees, not any accountant. |
| Historical normal TTE limit | “normal training, travel and equipment (TTE) limit is 20%.” | NOT ON PAGE | --1 gives current 50%, first 12 months of long plans at 20%, and aging-out 20%; it does not establish the record's general historical “normal” rate. |
| Final-period TTE 50% scope | “For the final aligned funding period ending March 31, 2027, BC increased the allowable TTE portion to 50%.” | DIFFERS | --1: “50% ... annual funding amount (for families with benefit plans that are 12 months or less), or 50% on the adjusted portion (for ... 13 months or longer, with the first 12 months being available at 20%)”; “For families with youth aging out (turning 19) prior to March 31, 2027, requests must not exceed 20%.” Dropped conditions: blanket final-period 50% loses adjusted-portion restriction and aging-out exception. |
| Mutual exclusivity with successor (BENEFIT_VALUES.note) | “replaced by bc-cy-disability-benefit — mutually exclusive” | NOT ON PAGE | Successor transition is described; simultaneous-benefit exclusion not stated in supplied pages. |
| New applications until March 2027 | “accepts new applications until March 2027” | CONFIRMED | --1/--2: “accepting new applications until March 2027”. |
| Transition contact / eligibility | “Current families transition ... in phases; the ministry will contact them.” | DIFFERS | --2: “We will contact all recipients about their eligibility to transfer to the new BC Children and Youth Disability Benefit ahead of the transition.” Hedge / scope: record states current families transition, whereas contact is about eligibility to transfer, not a guaranteed universal transfer. Phased scheduling not stated here. |
| Exact end and prorating | “ends March 31, 2027”; “Final aligned funding periods may be prorated to March 31, 2027.” | NOT ON PAGE | --2: “current ... system is in effect until March of 2027”; no day-31 termination or prorating rule. |
| BCAAN / qualified private diagnosis | “BCAAN or qualified private assessment” | CONFIRMED | --2 separates “Ages 6 to 18 with BCAAN Assessment” and “Ages 6-18 with non-BCAAN Assessment”; private report from “qualified professional”. |
| Online Basic BCeID | “Apply online with a Basic BCeID”; “Basic BCeID account for the online portal” | CONFIRMED | --2: “You must register for a Basic BCeID before you can complete your online application.” |
| Email/paper/local office application | “send the Application for Autism Funding to mcf.autismfundingintake@gov.bc.ca, or go through your local CYSN office” | CONFIRMED | --2: “Complete the Application for Autism Funding”; “Email ... to mcf.autismfundingintake@gov.bc.ca, or contact your local CYSN office”. |
| Agreement before hiring | “Sign the funding agreement and hire qualified providers” | CONFIRMED | --2: “Both copies must be signed and returned”; followed by “Hire service providers or purchase other types of support”. |
| Invoice/direct-pay or reimbursement procedure | “Submit invoices for direct payment or claim reimbursements” | NOT ON PAGE | --1/--2: “set-up service providers for payment ... get reimbursed”; confirms payment/reimbursement options, not invoice submission as the direct-payment procedure. |
| Payment/reimbursement options | “direct payment or ... reimbursements” | CONFIRMED | --1 mentions “direct payment accountant fees”; online service “set-up service providers for payment ... get reimbursed”. |
| Diagnostic report or CF0905 alternative | “Diagnostic report or CF0905 confirmation form” | DIFFERS | --2 out-of-province: “Copy of the Confirmation of Previous Diagnosis ... (CF0905). Copy of the original Diagnostic Report and/or any assessment information that supports the diagnosis”. BCAAN route requires “Clinical Outcome (PANTER) Form”; private route requires CF0904 plus report. Scope / dropped documents: report/CF0905 are not unrestricted alternatives. |
| PHN document | “Child's Personal Health Number” | NOT ON PAGE | Proof of age/residence and example BC Services Card stated, but PHN as a separate required data/document not stated. |
| Not every provider RASP / comparison | “providers do not have to be RASP-listed for every service type, so therapy, tutoring and camps are easier to fund than under the Under-6 program” | NOT ON PAGE | --1 explicitly requires RASP for under-six professionals but gives no 6–18 registry rule or comparative ease assertion. |
| Service/purchase delivery deadline | “must be delivered by March 31, 2027” | NOT ON PAGE | No exact service-delivery deadline. |
| Direct-payment supporting-document deadline | “due May 31, 2027” | NOT ON PAGE | No such deadline. |
| Final invoice/reimbursement deadline | “due September 30, 2027” | NOT ON PAGE | No such deadline. |
| Fall-2026 contact checkpoint | “if you have not been contacted by fall 2026” | NOT ON PAGE | No fall-2026 contact milestone. Advice to ask is not itself classified; the implied timeline is unsupported. |
| Later paperwork does not extend service date | “later paperwork deadlines do not extend the service-delivery date.” | NOT ON PAGE | No deadline relationship described. |
| Phone | “1-877-777-3530” | CONFIRMED | --2: “Ask the Autism Funding team for help with funding paperwork or processes ... Toll Free 1-877-777-3530”. Online-application technical assistance 1-844-878-4700 is a different purpose, not a replacement for this funding-team number. |

### bc-autism-funding-under-6

Sources: `bc-autism-funding-under-6--1.txt` (amounts/uses), `--2.txt` (application); shared source bodies verified identical to corresponding 6–18 snapshots. Each record's claims checked separately.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Annual child maximum | “Up to $22,000/year”; “per year per child” | CONFIRMED | --1: “Children under age six Up to $22,000 per year for each child”. |
| Under-six boundary (REQS.under6) | “children under 6”; “only for children younger than 6.” | CONFIRMED | --1: “Children under age six”. |
| Autism / BC-standard diagnosis (REQS.autismSelected, autismDiagnosis unmet/short) | “autism spectrum disorder diagnosis meeting BC standards”; “Check whether the autism diagnosis meets B.C. standards” | CONFIRMED | --2: “ensure you have had an assessment and diagnosis”; private report must show “ADOS-2 and ADI-R” and “multidisciplinary assessment”; prior diagnosis subject to “DSM-5 criteria”. |
| BC residence (REQS.bc) | “proof of BC residency”; “This is a British Columbia program.” | CONFIRMED | --2: “Proof of age and residency (example: birth certificate, BC Services Card)”. |
| RASP professional coverage | “professionals listed on the Registry of Autism Service Providers (RASP)” | CONFIRMED | --1: “Professionals listed on the Registry of Autism Service Providers (RASP)”. |
| Supervised interventionists | “behaviour interventionists supervised by a RASP professional” | CONFIRMED | --1: “Behaviour interventionists (BI) who are supervised by a RASP professional”. |
| Family-counselling providers / hedge | “family counselling from certified counsellors, psychologists, social workers or psychiatrists” | DIFFERS | --1: “The following professionals may be eligible ... Canadian Certified Counsellors (CCC) Registered Clinical Counsellors (RCC) Registered Marriage and Family Therapists (RMFT) Registered Psychiatrists Registered Psychologists Registered Social Workers ...”. Hedge / dropped qualifications: record makes generic occupational categories covered rather than potentially eligible registered/specified certified practitioners. |
| Employment costs | “employment-related costs when you hire staff” | CONFIRMED | --1: “Costs related to employing a service provider ... vacation pay, income tax, Canada Pension Plan or Employment Insurance benefits, and WorkSafeBC premiums”. |
| Administrative monthly cap | “administrative costs up to $100/month” | CONFIRMED | --1: “Administrative costs related to managing service providers, up to $100 monthly”. |
| Blanket RASP requirement (tips/steps) | “Providers must be on the RASP registry for children under 6”; “then choose RASP-listed providers” | DIFFERS | --1: “Family counselling/therapy providers do not need to be listed on the Registry of Autism Service Providers (RASP)”; BIs only need RASP supervision. Scope / dropped exceptions: blanket provider rule excludes permitted counsellors and supervised BIs. |
| Historical normal TTE rate | “Normally, up to 20% of the allocation can go to training, travel and equipment” | NOT ON PAGE | --1 current rules describe 50%, first 12 months of long plans at 20%, and aging-out rule; no general historical normal rate stated. |
| Final-period 50% scope | “For the final aligned funding period ending March 31, 2027, BC increased the allowable TTE portion to 50%.” | DIFFERS | --1: “50% ... (for families with benefit plans that are 12 months or less), or 50% on the adjusted portion (for ... 13 months or longer, with the first 12 months being available at 20%)”. Dropped condition: record applies 50% to the final period without restricting long-plan adjusted portion. Aging-out exception in the same paragraph does not apply to an under-six child. |
| Mutual exclusivity with successor (BENEFIT_VALUES.note) | “replaced by bc-cy-disability-benefit — mutually exclusive” | NOT ON PAGE | Successor transition is described; simultaneous-benefit exclusion not stated in supplied pages. |
| New applications until March 2027 | “accepts new applications until March 2027” | CONFIRMED | --2: “accepting new applications until March 2027”. |
| Guaranteed transition / contact | “Current families transition ... in phases; the ministry will contact them.” | DIFFERS | --2: “contact all recipients about their eligibility to transfer”. Hedge / scope: eligibility-to-transfer contact becomes assured transfer for current families; phases not described. |
| Exact end and prorating | “ends March 31, 2027”; “Final aligned funding periods may be prorated to March 31, 2027.” | NOT ON PAGE | --2: “system is in effect until March of 2027”, no exact last-day/proration rule. |
| BCAAN/private diagnostic routes | “through the BC Autism Assessment Network ... or a private assessment meeting BC standards” | CONFIRMED | --2: “Under age six with British Columbia Autism Assessment Network (BCAAN) Assessment”; “Under age six with Private Assessment (Non BCAAN)” and specified diagnostic standards. |
| Free BCAAN / physician referral | “BCAAN, free via physician referral” | NOT ON PAGE | Assessment route named, cost/referral method not given. |
| Online Basic BCeID | “Register for a Basic BCeID account to apply online” | CONFIRMED | --2: “You must register for a Basic BCeID before you can complete your online application.” |
| Paper/email/CYSN process | “complete the paper Application for Autism Funding”; “Email ... to mcf.autismfundingintake@gov.bc.ca or submit through your local CYSN office” | CONFIRMED | --2: “Complete the Application for Autism Funding”; “Email your completed application and all supporting documents to mcf.autismfundingintake@gov.bc.ca, or contact your local CYSN office”. |
| Sign agreement before providers | “Sign the funding agreement, then choose ... providers” | CONFIRMED | --2: “Both copies must be signed and returned”; next stage “Hire service providers or purchase other types of support”. Registry scope assessed separately. |
| Invoice/reimbursement procedure | “submit invoices or reimbursement claims” | NOT ON PAGE | --2 online management includes “set-up service providers for payment ... get reimbursed”; no invoice/claim submission instructions reproduced. |
| Reimbursement availability | “reimbursement claims” | CONFIRMED | --2: “get reimbursed”. Confirms payment option only, not above procedural specifics. |
| Universal diagnostic report | “Diagnostic report confirming autism spectrum disorder” | DIFFERS | --2 BCAAN route requires “Copy of the BCAAN Clinical Outcome (PANTER) Form”; “Optional: Copy of BCAAN assessment report(s)”. Scope / hedge: record's general required-document list makes a diagnostic report mandatory where reports are optional and PANTER is required. |
| Previous-diagnosis CF0905 | “Confirmation of Previous Diagnosis of Autism Spectrum Disorder form (CF0905) if diagnosed elsewhere” | CONFIRMED | --2: “Out of Province/Country Assessment (Ages 0-18) ... Copy of the Confirmation of Previous Diagnosis ... (CF0905). Copy of the original Diagnostic Report and/or any assessment information”. Record also lists a diagnostic report, so does not assert CF0905 alone is sufficient. |
| PHN | “Child's Personal Health Number” | NOT ON PAGE | BC Services Card example is residence/age proof, not explicit PHN requirement. |
| Service/purchase deadline | “must be delivered by March 31, 2027” | NOT ON PAGE | No exact delivery deadline. |
| Direct-payment supporting-document deadline | “due May 31, 2027” | NOT ON PAGE | No such deadline. |
| Final invoice/reimbursement deadline | “due September 30, 2027” | NOT ON PAGE | No such deadline. |
| Later paperwork does not extend service date | “later paperwork deadlines do not extend the service-delivery date.” | NOT ON PAGE | No deadline relationship stated. |
| Ministry contacts from July 2026 | “From July 2026 the ministry contacts Autism Funding families” | NOT ON PAGE | Contact before transition stated, no July start. |
| New annual benefit tiers | “$6,500 or $17,000/year” | NOT ON PAGE | No new benefit amount in supplied pages; both tiers unsupported. |
| Current funding until individual transition date | “you keep current funding until your transition date” | NOT ON PAGE | “program continues unchanged ... until March 2027” does not establish an individual entitlement/termination boundary. |
| Phone | “1-877-777-3530” | CONFIRMED | --2: “Ask the Autism Funding team for help with funding paperwork or processes ... Toll Free 1-877-777-3530”. Application technical help 1-844-878-4700 serves a different purpose; no same-purpose number discrepancy. |
