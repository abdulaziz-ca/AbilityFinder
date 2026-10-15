# Snapshot re-verification report — 2026-10-16, batch 5

Verification only; no replacement wording proposed.

## Method and scope

Evaluated `public/data.js` in a Node `vm` with `{window:{}, document:{}, console}` and exported `BENEFITS`, `BENEFIT_VALUES`, and `BENEFIT_META`, as in `scripts/check-readability.js`. Evaluated the isolated `REQS` declaration for every record's requires, reading unmet and short text without calling matchers (external matcher references and URL constants stubbed). No grep-parsing of benefit records. Repeated assertions are consolidated; distinct factual metadata is included. Internal flags, labels, URLs, difficulty ratings, and advice without factual assertions are not counted.

Facts count distinct assertions, not occurrences or numeric tokens. Inseparable amount/period and route/conditions may share a row; independent assertions are separate. CONFIRMED requires a supporting quotation. DIFFERS identifies number, boundary, hedge, dropped condition or scope inconsistencies. NOT ON PAGE means absent from supplied usable sources, not false. Hedges are checked both ways; a maximum hedge alone does not contradict a maximum unless the source fixes the amount. Source-only facts are not invented as record assertions, but conditions dropped from asserted routes are identified. Quotes are verbatim excerpts; filenames are relative to `research/reverify/snapshots/`. No linked content is presumed read.

The report date is the requested batch label, not a claim about fetch timestamps: snapshots retain their supplied fetched dates. The prior partial CDB/RDSP review in `research/216-misfiled/` was read as context, not substituted for this batch's evidence. MSP is checked against its own page's “less than $42,000”, not Healthy Kids' different boundary.

## Summary table

| Record id | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| bc-bus-pass | 17 | 15 | 0 | 2 |
| bc-csg-services-equipment | 23 | 12 | 3 | 8 |
| bc-csg-students-disabilities | 23 | 19 | 1 | 3 |
| bc-cy-disability-benefit | 30 | 19 | 7 | 4 |
| bc-dental-supplement | 19 | 12 | 3 | 4 |
| bc-disability-assistance-pwd | 46 | 12 | 2 | 32 |
| bc-home-reno-tax-credit | 22 | 18 | 1 | 3 |
| bc-learning-disability-assessment-bursary | 15 | 8 | 0 | 7 |
| bc-medical-equipment-devices | 25 | 16 | 5 | 4 |
| bc-monthly-nutritional-supplement | 24 | 6 | 0 | 18 |
| bc-msp-supplementary-benefits | 24 | 15 | 7 | 2 |
| bc-optical-supplement | 16 | 10 | 3 | 3 |
| bc-supplemental-bursary-students-disabilities | 16 | 7 | 3 | 6 |
| cdb-adult | 32 | 8 | 0 | 24 |
| cpp-childrens-benefit | 29 | 26 | 1 | 2 |
| kamloops-arch | 30 | 16 | 0 | 14 |
| **Total (16 records)** | **391** | **219** | **36** | **136** |

Counts are evidence-limited, not a declaration that unsupported assertions are false. All 24 supplied snapshot first lines have status 200.

## DIFFERS — needs a decision

Each numbered item corresponds to one DIFFERS assertion row. No wording is proposed.

1. **bc-csg-services-equipment — `detail.steps[0]`**
   - Current: “Disability Verification Form from a qualified medical assessor”
   - Snapshot quote / difference: --2: “Some disabilities (Specific Learning Disorders) do not require completion of the Disability Verification Form”. Dropped exception in blanket form instruction.

2. **bc-csg-services-equipment — `detail.steps[2]`**
   - Current: “Submit the services-and-equipment request ... through StudentAid BC”
   - Snapshot quote / difference: --2: equipment form goes “to Assistive Technology BC”; services form goes “to StudentAid BC”. Scope: single StudentAid route conflates two routes.

3. **bc-csg-services-equipment — `BENEFIT_META.effort`**
   - Current: “Student aid + Appendix 8 and cost estimates”
   - Snapshot quote / difference: --2: Appendix 8 only for applications “BEFORE June 19, 2026”; later route uses “Disability status application”. Dropped date restriction. Cost estimates independently unsupported above.

4. **bc-csg-students-disabilities — `detail.steps[2] / detail.documents[1]`**
   - Current: “Download the Disability Verification Form”; documents: “Disability Verification Form completed”
   - Snapshot quote / difference: --2: “Some disabilities (Specific Learning Disorders) do not require completion”. Dropped exception in universal instruction/document list.

5. **bc-cy-disability-benefit — `REQS.under19.unmet`**
   - Current: “younger than 19”
   - Snapshot quote / difference: --2: “until the last day of their 19th birthday month”. Boundary: gate excludes the eligible birthday-month period.

6. **bc-cy-disability-benefit — `eligibility.items[0] / requiresNote / summary`**
   - Current: “aged 0 to 19”; “up to age 19”
   - Snapshot quote / difference: --2: “until the last day of their 19th birthday month”. Boundary: unqualified age 19 extends beyond the birthday month.

7. **bc-cy-disability-benefit — `detail.about / detail.aboutList.items[1]`**
   - Current: “direct admission ... degenerative conditions”
   - Snapshot quote / difference: --2: “Degenerative conditions with predictable decline”. Dropped condition: not all degenerative conditions are specified for automatic admission.

8. **bc-cy-disability-benefit — `note`**
   - Current: “families already receiving ministry services ... they do not need to apply”
   - Snapshot quote / difference: --1: “Eligible families ... will not need to apply”; --2: “if they are eligible”; “others may be asked to provide additional information”. Dropped eligibility condition in blanket existing-family statement.

9. **bc-cy-disability-benefit — `detail.steps[1] / detail.tips[0] / detail.documents[0]`**
   - Current: “apply ... before March 2027 and you will move ... automatically in April 2027”; “locks in an automatic transition”
   - Snapshot quote / difference: --2: “before March 31, 2027 ... if they are eligible”; “Some ... move directly ... others may be asked to provide additional information”. Hedge / dropped condition: no guaranteed April transfer by merely enrolling.

10. **bc-cy-disability-benefit — `detail.steps[2] / detail.time`**
   - Current: “From April 1, 2027: apply directly”
   - Snapshot quote / difference: --2: “New applicants after April 1, 2027”; “After April 1, 2027”. Boundary: on-date opening asserted instead of after-date wording.

11. **bc-cy-disability-benefit — `detail.tips[3]`**
   - Current: “CYSN Resource Line (1-833-882-0024)”
   - Snapshot quote / difference: --1: “Toll-free helpline for families: 1-844-442-2800”; --2 PAIRS information/support: “Phone: 1-844-878-4700”. Number / purpose: neither supplied family-information line matches the tip's resource number.

12. **bc-dental-supplement — `eligibility.items[0] / requiresNote`**
   - Current: “Adults qualify ... receive disability assistance, have the PPMB designation, or otherwise qualify for general health supplements”
   - Snapshot quote / difference: “You may be able to get basic dental coverage if you” meet these categories. Hedge: definite qualification replaces possible coverage.

13. **bc-dental-supplement — `eligibility.note / requiresNote`**
   - Current: “Adults on plain income assistance get emergency dental only”
   - Snapshot quote / difference: “You may be eligible for dentures if you: Receive any kind of income assistance” and complete teeth removed in previous six months for pain. Dropped exception: dentures route not limited to routine-coverage categories.

14. **bc-dental-supplement — `detail.time`**
   - Current: “No application — coverage is active while you are on assistance”
   - Snapshot quote / difference: “you may be able to have basic dental costs covered”; “You may be able to get basic dental coverage”. Hedge / scope: assistance alone does not establish active routine coverage.

15. **bc-disability-assistance-pwd — `detail.about / detail.aboutList.items[0]`**
   - Current: “actual shelter costs up to $500”
   - Snapshot quote / difference: --1: “If actual shelter costs are less than the minimum shelter allowance, the minimum shelter allowance will be provided.” Dropped floor: single minimum is $75, not actual costs below that amount.

16. **bc-disability-assistance-pwd — `detail.steps[4]`**
   - Current: “once the designation is approved and you are financially eligible, payments begin”
   - Snapshot quote / difference: --1: “paid in the month following designation”; pre-18 designation begins birthday month. Boundary / timing: immediate-on-approval statement loses specified start month.

17. **bc-home-reno-tax-credit — `REQS.qualifyingRenovationSpend.unmet`**
   - Current: “only once ... actually been done and paid for”
   - Snapshot quote / difference: “deemed to have been paid ... date it becomes payable”; invoice paid next year claimed “based on when you received the invoice”. Boundary: actual payment is not required before that tax-year claim.

18. **bc-medical-equipment-devices — `amount`**
   - Current: “floor/ceiling lifts up to $4,200”
   - Snapshot quote / difference: --1: “does exceed $4,200 ... excess cost is a result of unusual installation expenses”. Dropped exception to asserted cap.

19. **bc-medical-equipment-devices — `note / detail.tips[0]`**
   - Current: “Pre-approval is mandatory”; “purchased before pre-approval is not reimbursed”
   - Snapshot quote / difference: --1: “will not accept payment responsibility, except in cases of a life-threatening emergency ... without prior approval”. Dropped emergency exception.

20. **bc-medical-equipment-devices — `note`**
   - Current: “no other program (ICBC, WorkSafeBC, extended health) can pay”
   - Snapshot quote / difference: --1: “Co-funding may be considered when other resources cannot pay the entire cost”. Scope: any ability to pay is not disqualifying; partial funding can coexist. Named other resources supported.

21. **bc-medical-equipment-devices — `detail.about / detail.aboutList.items[1] / detail.steps[1] / detail.documents[0]`**
   - Current: “A prescription from a doctor or nurse practitioner is required”
   - Snapshot quote / difference: --1: “prescribed ... and/or the medical need must be confirmed by the assessment of a relevant therapist”. Dropped therapist-assessment alternative.

22. **bc-medical-equipment-devices — `detail.about / detail.aboutList.items[2]`**
   - Current: “automatic beds are excluded”
   - Snapshot quote / difference: --1: “Automatic turning beds”. Scope: generic automatic beds is wider than specified turning beds.

23. **bc-msp-supplementary-benefits — `note`**
   - Current: “most practitioners charge more”
   - Snapshot quote / difference: “Many ... practitioners are opted-out”; “allowed to charge ... more”. Hedge / frequency: many and permission become most and actual charging.

24. **bc-msp-supplementary-benefits — `eligibility.items[1] / requiresNote / REQS.bcSupplementaryBenefitsEligibility.unmet`**
   - Current: “You qualify ... adjusted net income ... less than $42,000”
   - Snapshot quote / difference: “may qualify”; must have citizen/PR residence “at least the last 12 months” and “not be exempt ... income tax”. Hedge / dropped conditions: income plus MSP is not alone sufficient.

25. **bc-msp-supplementary-benefits — `eligibility.items[1] / requiresNote / REQS.bcSupplementaryBenefitsEligibility.unmet`**
   - Current: “one of three ways”
   - Snapshot quote / difference: Page also lists “Income Assistance recipients”, “Convention refugees”, “Inmates”, long-term-care GIS residents and First Nations coverage. Scope: exclusive three-route framing drops additional named categories.

26. **bc-msp-supplementary-benefits — `detail.about / detail.aboutList.items[2] / eligibility.items[1] / requiresNote / REQS.bcSupplementaryBenefitsEligibility.unmet`**
   - Current: “enroled with MSP through the At Home Program”; “as Mental Health Clients ... eligible”
   - Snapshot quote / difference: Introduced as “Those who may be eligible ... include” those categories. Hedge: categorical eligibility removes source's may.

27. **bc-msp-supplementary-benefits — `detail.tips[2]`**
   - Current: “lapses if you stop filing”
   - Snapshot quote / difference: “Eligibility ... may be impacted if you do not file”; “To avoid losing your eligibility or having to reapply”. Hedge: possible loss becomes certain lapse.

28. **bc-msp-supplementary-benefits — `summary / detail.tips[4]`**
   - Current: “unlocks the Healthy Kids Program”; “also opens ... dental and optical”
   - Snapshot quote / difference: “families deemed eligible ... may be eligible for basic dental treatment, optical care, and hearing assistance”. Hedge: possible separate eligibility becomes assured access.

29. **bc-msp-supplementary-benefits — `detail.documents[1]`**
   - Current: “authorise on the application rather than sending”
   - Snapshot quote / difference: Mail route: “along with copies of a Notice of Assessment or Reassessment ... (and your spouse)”. Scope: no-sending instruction incorrectly extends online procedure to mail route.

30. **bc-optical-supplement — `amount / detail.about / detail.aboutList.items[2] / detail.tips[1]`**
   - Current: “lens replacements when your prescription changes”; “even between exam cycles”
   - Snapshot quote / difference: --2: “New lenses if your eye doctor confirms a change in your prescription”. Dropped condition: replacement is not established by an unverified change alone. No separate lens-cycle limit stated.

31. **bc-optical-supplement — `detail.about / detail.aboutList.items[3]`**
   - Current: “repairs to frames and lenses”
   - Snapshot quote / difference: --2: “Necessary repairs to lenses or frames”. Dropped necessity qualifier.

32. **bc-optical-supplement — `note`**
   - Current: “Costs above ... are your responsibility”
   - Snapshot quote / difference: --2: “You may be responsible for any additional costs.” Hedge: possible liability becomes categorical.

33. **bc-supplemental-bursary-students-disabilities — `summary`**
   - Current: “Full-time and part-time students both qualify”
   - Snapshot quote / difference: “You may be eligible”; each amount requires “qualify for Canada Student Grant for Students with Disabilities”. Hedge / dropped condition: student/disability status alone is insufficient.

34. **bc-supplemental-bursary-students-disabilities — `note`**
   - Current: “at a non-public school in 2025/26 and had already received this bursary ... may request to continue”
   - Snapshot quote / difference: “received SBSD funding for the same program at the same school”. Dropped continuity conditions.

35. **bc-supplemental-bursary-students-disabilities — `note`**
   - Current: “until they finish their program or until July 31, 2029”
   - Snapshot quote / difference: “whichever occurs first”. Boundary: disjunction without first-occurring restriction can imply later continuation.

36. **cpp-childrens-benefit — `detail.tips[1]`**
   - Current: “a part-time student must submit the paper ISP1402 both to apply and to renew”
   - Snapshot quote / difference: Application section covers “full-time or part-time” online; renewal: “Full-time and part-time students: can renew ... online”. Scope: paper-only restriction conflicts with both online routes.

## Skipped snapshots

None: all 24 requested-record snapshots have first-line `status: 200`.

Evidence limitation, **not a non-200 skip**: `bc-monthly-nutritional-supplement--2.txt` is a flattened PDF stream with replacement characters, not readable extracted HR2847 prose. Its first-line URL can identify the form number, but the body is not used to verify form sections or medical criteria. No outside fetch or inferred PDF content was used. All other supplied sources are readable (including the long navigation-heavy Kamloops page). Contact numbers are compared only for the same stated purpose; missing numbers and differently labelled service lines are distinguished in the tables.

## Per-record detail

### bc-bus-pass

Sources: `bc-bus-pass--1.txt` (policy), `--2.txt` (PWD transportation supplement).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| BC scope / disability-assistance route; REQS.bc, bcBusPassStatus | “BC disability assistance (PWD designation)” | CONFIRMED | --1: “Clients with the PWD designation that receive disability assistance”. |
| Senior GIS route | “low-income senior who receives the Guaranteed Income Supplement (GIS)” | CONFIRMED | --1: “Old Age Security (OAS) and GIS”. |
| Income-assistance senior age | “60 to 64 and on provincial income assistance” | CONFIRMED | --1: “60 or older and receive income assistance”; stated subset is supported, not asserted as the only route. |
| GIS residence exception | “65 or older and would get the GIS but for residency rules” | CONFIRMED | --1: “65 or older and would qualify ... but haven&rsquo;t lived in Canada for 10 years”. |
| PWD annual fee | “No annual fee for PWD recipients” | CONFIRMED | --1: “There is no annual fee.” |
| Senior price | “$45/year” | CONFIRMED | --1: “pay the $45 yearly fee”. |
| Pass period | “Annual bus pass”; “monthly pass” | CONFIRMED | --2: “An annual BC Bus Pass”; --1: “works on a month-by-month basis”. |
| Cash alternative | “instead of the $52 monthly cash transportation supplement” | CONFIRMED | --2: “choose to get $52 a month or a bus pass”. |
| Named transit systems / Compass | “Compass Card on TransLink”; “BC Transit” | CONFIRMED | --1: “TransLink and BC Transit buses”; “BC Transit buses in communities without card readers”; “Compass Card”. |
| Full geographic / scheduled-service scope | “scheduled BC Transit services provincewide”; “Metro Vancouver”; “not just your home city” | NOT ON PAGE | --1 describes using the card in different BC Transit communities, but does not explicitly establish all scheduled-service coverage provincewide or name Metro Vancouver as the TransLink geography. Linked usage page not supplied. |
| Online/phone request and number; metadata effort | “My Self Serve or by calling 1-866-866-0800” | CONFIRMED | --2: “On My Self Serve via the Service Request tab”; “telephone toll-free at 1-866-866-0800”. |
| Switching deadline / next month | “by the 5th for the change to start the next month” | CONFIRMED | --1: “start the next month if you notify the ministry by the 5 th”. |
| Delivery time; metadata wait | “Allow 4 to 6 weeks”; “Allow up to 6 weeks” | CONFIRMED | --1: “usually within four to six weeks”; --2: “may take up to 6 weeks”. Instruction to allow this time does not promise delivery. |
| PWD no new documents | “No new documents ... just your request” | NOT ON PAGE | Request procedure given, but no categorical waiver of new documents. |
| Seniors identifying documents | “SIN, name, date of birth, address and contact details” | CONFIRMED | --1: “Social Insurance Number (SIN) Last name First name Date of birth Phone number How you prefer to be contacted Your address”. |
| Replacement fee hedge | “Replacement passes can carry a fee” | CONFIRMED | --2: “Fees may apply.” |
| Cancel / cash restoration deadline | “return to the $52 monthly cash supplement ... by the 5th” | CONFIRMED | --2: “Let the ministry know by the 5th day ... $52 on the following month”. |

### bc-csg-services-equipment

Sources: `bc-csg-services-equipment--1.txt` (grant), `--2.txt` (application).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Amount / period; values | “Up to $20,000 per loan year” | CONFIRMED | --1: “Up to $20,000 per loan year”. |
| BC delivery / post-secondary; REQS.bc, student | “delivered through StudentAid BC” | CONFIRMED | --2: “during college or university”; “through your StudentAid BC loan application”. |
| Loan qualification | “qualify for a federal student loan” | CONFIRMED | --1: “qualify for a federal student loan”. Necessary requirement, not a sufficient-eligibility promise. |
| Study / designation | “full-time or part-time at a designated institution” | CONFIRMED | --1: “full-time or part-time studies at a designated post-secondary institution”. |
| Disability / professional verification; REQS.disabilityDoc | “verified permanent or persistent/prolonged disability” | CONFIRMED | --1: “permanent disability, or a persistent or prolonged disability”; --2: “medical assessment by a qualified medical assessor”. |
| Exceptional costs | “exceptional education-related costs caused by your disability” | CONFIRMED | --1: “exceptional education related costs for services or equipment due to your disability”. |
| Named services | “notetakers, tutors, interpreters and technical aids” | CONFIRMED | --1: “Notetakers Tutors Interpreters Technical aids”. |
| Assistive software | “assistive software” | NOT ON PAGE | Technical aids are named, software is not specified. |
| Non-repayable | “It is non-repayable” | CONFIRMED | --2: “non-repayable grant and bursary funding”. |
| Supplement to $2,800 grant | “on top of the $2,800 Canada Student Grant” | NOT ON PAGE | Other grant named, amount and stacking not stated in these sources. |
| Additional provincial maximum | “full $20,000 ... add up to $10,000-$12,000 more” | NOT ON PAGE | B.C. Assistance Program linked/named; exhaustion rule and amounts absent. |
| Application / status first | “Complete a StudentAid BC application and get your disability status verified” | CONFIRMED | --2: “Once StudentAid BC verifies and establishes your disability status, you can apply”. |
| Mandatory verification form | “Disability Verification Form from a qualified medical assessor” | DIFFERS | --2: “Some disabilities (Specific Learning Disorders) do not require completion of the Disability Verification Form”. Dropped exception in blanket form instruction. |
| Accessibility office identifies needs | “Work with your school's accessibility services office” | CONFIRMED | --2: “Visit the accessibility services office at your school”. |
| Submission route | “Submit the services-and-equipment request ... through StudentAid BC” | DIFFERS | --2: equipment form goes “to Assistive Technology BC”; services form goes “to StudentAid BC”. Scope: single StudentAid route conflates two routes. |
| Cost documentation | “Documentation ... and their costs” | NOT ON PAGE | Request forms are named, but their cost-documentation requirements not reproduced. |
| Funding decision location | “Funding decisions are posted to your StudentAid BC account” | NOT ON PAGE | Account posting specified for disability status; services request only promises “a notification”. |
| Office frequently starts paperwork | “often start the paperwork for you” | CONFIRMED | --2: officer will “complete the Services Request form”; equipment officer will “complete and submit”. Source specifies a stronger regular role. |
| Receipts for all purchases | “Keep receipts for everything the grant pays for” | NOT ON PAGE | Assessment reimbursement receipt required; universal purchase-record rule not stated. |
| Verification time | “About 6 weeks for disability verification” | CONFIRMED | --2: “usually takes about 6 weeks”. |
| Funding assessment timing; metadata wait | “then with your funding assessment” | NOT ON PAGE | Services/equipment decision timing not specified. |
| Phone | “1-800-561-1818” | NOT ON PAGE | No contact phone printed; no same-purpose conflicting number established. |
| Metadata form | “Student aid + Appendix 8 and cost estimates” | DIFFERS | --2: Appendix 8 only for applications “BEFORE June 19, 2026”; later route uses “Disability status application”. Dropped date restriction. Cost estimates independently unsupported above. |

### bc-csg-students-disabilities

Sources: `bc-csg-students-disabilities--1.txt` (grant), `--2.txt` (application).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Amount / program year; values | “$2,800 per program year (August 1 to July 31)” | CONFIRMED | --1: “$2,800* $2,000 per program year (August 1 to July 31)”; footnote identifies temporary amount. |
| Temporary increase | “40% ... until July 31, 2027” | CONFIRMED | --1: “temporarily increased by 40% ... until July 31, 2027”. |
| Non-repayable | “money you do not pay back” | CONFIRMED | --2: “non-repayable grant and bursary funding”. |
| Federal / BC delivery; REQS.bc | “federal grant, delivered through StudentAid BC” | CONFIRMED | --1: “Canada Student Grant”; --2: “through your StudentAid BC loan application”. |
| Federal aid qualification | “qualify for federal student aid” | CONFIRMED | --1: “qualify for a federal student loan”. In context of the loan application, supported necessary requirement. |
| Post-secondary / designated / study intensity; REQS.student | “full-time or part-time at a designated post-secondary institution” | CONFIRMED | --1: “full-time or part-time studies at a designated post-secondary institution”. |
| Permanent duration | “permanent disability (lifelong)” | CONFIRMED | --2: “expected to remain ... for the person’s expected life”. |
| PPD duration | “persistent or prolonged disability (12+ months)” | CONFIRMED | --2: “has lasted, or is expected to last ... at least 12 months”. |
| Qualified verification; REQS.disabilityDoc | “verified by a qualified medical assessor” | CONFIRMED | --2: “medical assessment by a qualified medical assessor”. |
| Reduced load | “40-59% counts as full-time” | CONFIRMED | --2: “reduced course load (40-59%) and still receive full-time funding”. |
| Automatic consideration other grants | “automatically considered ... other disability grants” | CONFIRMED | --2: “automatically assessed ... when they apply for student aid”. Record context includes student-aid application. |
| New process / dated route | “after June 23, 2026”; “online Disability status application” | CONFIRMED | --2: “AFTER June 23, 2026”; “Complete the online Disability status application”. |
| Form mandatory | “Download the Disability Verification Form”; documents: “Disability Verification Form completed” | DIFFERS | --2: “Some disabilities (Specific Learning Disorders) do not require completion”. Dropped exception in universal instruction/document list. |
| Signed upload / declaration | “Upload the signed form inside ... and submit your declaration” | CONFIRMED | --2: “Upload the completed, signed form”; “Complete your Declaration and submit”. |
| Review time | “about 6 weeks” | CONFIRMED | --2: “usually takes about 6 weeks”. |
| Account decision | “posts the decision to your account” | CONFIRMED | --2: “post the decision to your Student Account”. |
| Grant assessment / metadata timing | “grant is then included in your funding assessment”; “With your student-aid assessment” | CONFIRMED | --2: “automatically assessed ... when they apply for student aid”; includes this grant. |
| SIN and BC ID | “Social Insurance Number and B.C. ID for your StudentAid BC account” | NOT ON PAGE | Account creation linked, requirements not reproduced. |
| Apply for status anytime | “any time ... do not have to wait for your loan application” | CONFIRMED | --2: “at any time”; “don’t need to wait until you have completed your student loan application”. |
| Permanent re-verification | “never need re-verification” | CONFIRMED | --2: “you don’t need to re-verify again”. |
| PPD re-verification | “enter repayment or after a break of more than 5 years” | CONFIRMED | --2: “enter loan repayment or ... break in study ... greater than 5 years from the original disability assessment”. |
| PWD affects funding structure | “it can affect how your funding is structured” | NOT ON PAGE | No PWD interaction stated. |
| Phone | “1-800-561-1818” | NOT ON PAGE | No contact number printed; no same-purpose numeric conflict established. |

### bc-cy-disability-benefit

Sources: `bc-cy-disability-benefit--1.txt` (announcement/backgrounders), `--2.txt` (October 9 current page). Where these differ in specificity, the current page governs current operations. The earlier partial review's outdated gate quotation is not used in place of the evaluated current gate.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| BC direct funding; REQS.bc | “New direct-funding benefit” | CONFIRMED | --2: “BC Children and Youth Disability Benefit provides direct funding”. |
| Base amount | “base tier of $6,500/year” | CONFIRMED | --2: “Base tier: $6,500 per year”. |
| Higher amount; values | “higher tier of $17,000/year” | CONFIRMED | --2: “Higher tier: $17,000 per year”. |
| Higher-tier support planning | “set through support planning with a ministry worker” | NOT ON PAGE | Funding based on support needs; this specific determination process not stated. |
| Age gate; REQS.under19 | “younger than 19” | DIFFERS | --2: “until the last day of their 19th birthday month”. Boundary: gate excludes the eligible birthday-month period. |
| Age prose | “aged 0 to 19”; “up to age 19” | DIFFERS | --2: “until the last day of their 19th birthday month”. Boundary: unqualified age 19 extends beyond the birthday month. |
| Functional needs; REQS.childHighNeeds | “long-term disability causing significant and complex developmental support needs”; “highest functional support needs” | CONFIRMED | --2: “long-term disability ... significant and complex developmental support needs”; --1: “highest functional support needs”. |
| Diagnosis breadth / examples | “any diagnosis (autism, Down syndrome, cerebral palsy, intellectual disability and more)” | CONFIRMED | --1: “across all diagnoses”; examples include “Down syndrome”, “cerebral palsy”, “intellectual disability”, “autism”. This is scope, not a diagnosis-alone eligibility promise. |
| Direct admit conditions | “moderate-to-profound intellectual disability, autism with intellectual disability, and degenerative conditions” | CONFIRMED | --2: “Moderate to profound intellectual disability”; “Autism combined with any level of intellectual disability”; “Degenerative conditions with predictable decline”. Predictable decline is part of direct-admit scope (next row). |
| Degenerative admission qualification | “direct admission ... degenerative conditions” | DIFFERS | --2: “Degenerative conditions with predictable decline”. Dropped condition: not all degenerative conditions are specified for automatic admission. |
| Clinical alternative | “needs-based clinical review pathway for rare or atypical cases” | CONFIRMED | --2: “children with rare, complex, or atypical needs”; “Clinical expertise is applied”. |
| Replacement programs | “replacing Autism Funding and the School-Aged Extended Therapies stream” | CONFIRMED | --2: “current School Aged Extended Therapy and Autism Funding end”. |
| Disability-related funding | “Funding covers disability-related expenses” | CONFIRMED | --2: “Supports must be disability-related”. |
| Specific funding uses / flexibility | “respite, paediatric therapies, behavioural intervention, and assistive and augmentative communication supports” | NOT ON PAGE | Current page delegates expense lists to unread policy PDF; announcement does not establish this benefit's full named expense list (supplement uses are separate). |
| Provincial investment | “$475-million, three-year provincial investment” | CONFIRMED | --1: “$475 million over three years”. |
| Free community expansion | “expands free community services” | CONFIRMED | --1: “expand access to more free community services”. |
| Therapy expansion start | “therapies from spring 2026” | CONFIRMED | --1: “April 1, 2026 ... expansion of existing early-intervention therapies”. |
| Behaviour/mental health expansion | “behaviour and mental-health supports 2027” | CONFIRMED | --1: “spring 2027 ... behaviour and mental-health supports”. |
| Navigation / school-age expansion | “navigation and school-aged programming 2027-2028” | CONFIRMED | --1: “winter 2027 ... navigation”; “spring 2028 ... programming for children 6 to 18”. |
| Launch / full operation; metadata wait | “Starts April 1, 2026”; “province-wide by April 1, 2027” | CONFIRMED | --1: “April 1, 2026: Implementation ... begin”; “April 1, 2027 ... fully operational”. |
| Existing-family no-application scope | “families already receiving ministry services ... they do not need to apply” | DIFFERS | --1: “Eligible families ... will not need to apply”; --2: “if they are eligible”; “others may be asked to provide additional information”. Dropped eligibility condition in blanket existing-family statement. |
| Existing transition / contact | “wait to be contacted ... between April 2026 and March 2027” | CONFIRMED | --2: “Phase 1 (April 2026-March 2027)”; “Ministry will contact each family”. |
| New-family automatic transition; documents/tips | “apply ... before March 2027 and you will move ... automatically in April 2027”; “locks in an automatic transition” | DIFFERS | --2: “before March 31, 2027 ... if they are eligible”; “Some ... move directly ... others may be asked to provide additional information”. Hedge / dropped condition: no guaranteed April transfer by merely enrolling. |
| Direct applications date; time/steps | “From April 1, 2027: apply directly” | DIFFERS | --2: “New applicants after April 1, 2027”; “After April 1, 2027”. Boundary: on-date opening asserted instead of after-date wording. |
| Current gate routes and conditional transition; REQS.bcCydbIntake | “Autism Funding or the At Home Program”; “before March 31, 2027 ... if they are eligible”; “after April 1, 2027” | CONFIRMED | --2: “current pathways”; names “At Home Program”, “Autism Funding”; “before March 31, 2027 ... if they are eligible”; “after April 1, 2027”. |
| Diagnostic/functional evidence domains | “Diagnostic reports and functional assessments ... communication, cognitive/adaptive functioning, safety or behavioural complexity” | NOT ON PAGE | --2 mentions assessments, “behavioural profile”, “adaptive limitations”, not this exact document/domain requirement. |
| Excluded expenses | “Services outside British Columbia and unresearched interventions are not eligible uses” | NOT ON PAGE | Policy PDF not supplied; general “safe and evidence-based supports” does not establish these categorical exclusions. |
| Resource-line phone | “CYSN Resource Line (1-833-882-0024)” | DIFFERS | --1: “Toll-free helpline for families: 1-844-442-2800”; --2 PAIRS information/support: “Phone: 1-844-878-4700”. Number / purpose: neither supplied family-information line matches the tip's resource number. |
| General phone | “1-844-442-2800” | CONFIRMED | --1: “Toll-free helpline for families: 1-844-442-2800”. Current page instead gives PAIRS as a specifically labelled service; no claim those distinct contacts are identical. |
| Metadata assessment effort | “Transition or needs-based ministry assessment” | CONFIRMED | --2: “needs-based review”; “transition ... gradually”. |

### bc-dental-supplement

Source: `bc-dental-supplement--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| BC assistance categories; REQS.bc, bcAssistanceStatus | “qualifying B.C. assistance, care, or protected-status category” | NOT ON PAGE | Assistance categories supported; care/protected-status alternatives not described on supplied page. |
| Adult routine eligibility | “Adults qualify ... receive disability assistance, have the PPMB designation, or otherwise qualify for general health supplements” | DIFFERS | “You may be able to get basic dental coverage if you” meet these categories. Hedge: definite qualification replaces possible coverage. |
| Child eligibility / age | “Children under 19 in families on any assistance are covered” | CONFIRMED | “Children under 19 in families on assistance have basic dental coverage”. |
| Plain-income-assistance restriction | “Adults on plain income assistance get emergency dental only” | DIFFERS | “You may be eligible for dentures if you: Receive any kind of income assistance” and complete teeth removed in previous six months for pain. Dropped exception: dentures route not limited to routine-coverage categories. |
| Adult amount / period | “Up to $1,000 per 2 calendar years” | CONFIRMED | “Up to $1,000 over two calendar years”. |
| Reset / current window | “January 1 of every odd-numbered year”; “Jan 2025–Dec 2026”; “January 2027” | CONFIRMED | “beginning on January 1 of every odd-numbered year”. Current/next windows follow directly from calendar rule. |
| Child amount / period | “up to $2,000 per 2 years” | CONFIRMED | “Up to $2,000 over two calendar years”. |
| Child hospital increment | “plus $1,000/year ... under general anesthesia” | CONFIRMED | “An additional $1,000 per year ... in a hospital under a general anaesthetic”. |
| Basic covered treatments | “restorations, extractions, preventative care, partial and replacement dentures” | CONFIRMED | “restorations, extractions and preventative services”; “Partial dentures, replacement dentures”. |
| Crowns / bridges hedge | “in certain cases” | CONFIRMED | “Crowns and bridges, under certain circumstances”. |
| Emergency access | “everyone on assistance ... regardless of the limit” | CONFIRMED | “Everyone who receives assistance can access emergency dental services to relieve pain.” No ordinary-limit condition attached. |
| Direct payment / fee schedules | “paid ... directly to the dentist”; “fee schedules” | CONFIRMED | “paid directly to the dentist, denturist or hygienist”; “Fee schedules determine the maximum amount”. |
| Possible balance billing | “any costs above the fee schedule” | CONFIRMED | “You may be responsible for any additional costs.” |
| Fees below usual | “below many dentists' usual fees” | NOT ON PAGE | Possible extra costs stated; comparative frequency/prices not given. |
| Provider / card | “Book any dentist, denturist or dental hygienist and show your BC Services Card”; “or Personal Health Number” | NOT ON PAGE | Providers named; unrestricted provider acceptance and card/PHN requirements not stated. |
| Insurer confirmation; metadata | “Pacific Blue Cross”; “before treatment”; “at booking” | NOT ON PAGE | No insurer or verification timing named. |
| No application / active coverage | “No application — coverage is active while you are on assistance” | DIFFERS | “you may be able to have basic dental costs covered”; “You may be able to get basic dental coverage”. Hedge / scope: assistance alone does not establish active routine coverage. |
| Denture-specific limits | “Dentures have their own rules and limits” | CONFIRMED | “You may be eligible for dentures if ... complete upper and/or lower teeth removed in the previous six months”. |
| Phone | “1-866-866-0800” | CONFIRMED | “Dental information line ... Toll free: 1-866-866-0800”. |

### bc-home-reno-tax-credit

Source: `bc-home-reno-tax-credit--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Maximum / percentage / spending cap; values | “$1,000 per year (10% of up to $10,000 ... costs)” | CONFIRMED | “$1,000 per tax year ... 10% ... (maximum $10,000 in expenses)”. |
| Refundability | “even if you owe no tax” | CONFIRMED | “refundable ... if the credit is higher than the taxes you owe, you&rsquo;ll receive the difference as a refund”. |
| BC year-end residence; REQS.bc | “B.C. resident at year end” | CONFIRMED | “on the last day of the tax year you are a resident of B.C.” |
| Age / DTC / co-resident family; REQS.homeRenoCandidate | “DTC eligibility (any age), age 65+, or ... family member living with the person” | CONFIRMED | “65 or older”; “If you qualify for the disability tax credit, you're eligible”; “family member living with a person with a disability”. No disability-route minimum age. |
| Principal residence | “your principal residence” | CONFIRMED | “principal residence, which is the home you primarily live in”. |
| Ownership gate; REQS.homeowner | “must own and live in the home” | NOT ON PAGE | Principal residence specified, ownership not required in supplied text; no express tenure alternatives printed. |
| Qualifying function | “permanent renovations ... access ... mobility ... reducing risk of harm” | CONFIRMED | “permanent home renovations”; “Improving access”; “Improving mobility and functions”; “Reducing the risk of harm”. |
| Ramps / bars / rails | “wheelchair ramps, grab bars, handrails” | CONFIRMED | “Wheelchair ramps”; “Grab bars”; “Hand rails in corridors”. |
| Bath / toilet / counters | “walk-in bathtubs, raised toilets, lowered cupboards, adjustable counters” | CONFIRMED | “Bathtubs ... walk-in”; “Toilets ... raised”; “lowering existing ones”; “installing adjustable ones”. |
| Doors / flooring / lighting / lifts | “widened doorways, non-slip flooring, motion-activated lighting and stair lifts” | CONFIRMED | “Doors that are widened”; “Flooring ... non-slip”; “Lighting ... motion-activated”; “stair/wheelchair lifts”. |
| Exclusions | “Aesthetic upgrades, appliances, regular repairs, HVAC, windows ... walkers or wheelchairs” | CONFIRMED | “Aesthetic enhancements”; “Appliances”; “General maintenance”; “Heating or air conditioning”; “Window installation”; “Walkers Wheelchairs”. |
| Main-purpose restriction | “cannot be increasing your property value” | CONFIRMED | “main purpose ... cannot be to increase the value”. |
| Current tax years | “Active for the 2025 and 2026 tax years” | CONFIRMED | “for 2016 and later tax years”; no end year given. |
| Claim form | “Schedule BC(S12)” | CONFIRMED | “form (Schedule BC(S12))”. |
| Box / provincial form | “box 60480 ... (BC479)” | CONFIRMED | “box 60480 ... (BC479)”. |
| Annual T1 claim / metadata effort | “File with your T1 return”; “Claimed annually at tax time” | CONFIRMED | “claim ... when you file your T1 income tax return”; “credit for the year”. |
| Receipts / GST documentation | “Receipts ... GST/HST numbers where applicable” | CONFIRMED | “receipts from suppliers and contractors”; family-member work receipts “must have a GST/HST number”. |
| DTC documentation | “Disability tax credit eligibility” | CONFIRMED | “retain documentation to support your claim”; “If you qualify for the disability tax credit”. Does not assert a particular certificate format. |
| Actually paid first; REQS.qualifyingRenovationSpend | “only once ... actually been done and paid for” | DIFFERS | “deemed to have been paid ... date it becomes payable”; invoice paid next year claimed “based on when you received the invoice”. Boundary: actual payment is not required before that tax-year claim. |
| Federal credit stacking | “Home Accessibility Tax Credit and Multigenerational Home Renovation Credit on the same expenses where rules allow” | NOT ON PAGE | Neither federal credit discussed; conditional wording does not supply evidence. |
| Phone / purpose | “1-800-959-8281” | CONFIRMED | “questions about your tax credit claims and refunds ... 1-800-959-8281”; separate general program line 1-877-387-3332 is a different purpose. |
| Assessment wait | “At tax assessment” | NOT ON PAGE | Filing route stated, payment/assessment timing not specified. |

### bc-learning-disability-assessment-bursary

Source: `bc-learning-disability-assessment-bursary--1.txt`.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Maximum; values | “Up to $3,500” | CONFIRMED | “Up to $3,500 is available to eligible students.” |
| Up-front assessment purpose | “up-front cost of a learning disability assessment” | CONFIRMED | “helps ... with the up-front costs of the learning disabilities assessment”. |
| StudentAid qualification | “qualify for student funding through StudentAid BC” | CONFIRMED | “qualify for student funding through StudentAid BC”. Necessary criterion, not sufficient promise. |
| Study / school / BC; REQS.bc, student | “full-time or part-time ... designated public post-secondary institution in B.C.” | CONFIRMED | “full-time or part-time post-secondary level courses at a designated public post-secondary institution in B.C.” |
| Recommendation; REQS.learningDisability | “specifically for a recommended learning-disability assessment” | CONFIRMED | “recommended ... by the accessibility services office at your school”. |
| Contact school / metadata effort | “contact ... school you plan to attend” | CONFIRMED | “contact the accessibility services office ... institution you are planning to attend”. |
| Assessment unlocks services/equipment | “assessment that unlocks disability funding” | CONFIRMED | “need a recent learning disability assessment to determine eligibility for services and/or equipment”. This describes assessment purpose, not automatic funding. |
| Academic accommodations | “and academic accommodations” | NOT ON PAGE | Services/equipment mentioned, accommodations not explicitly described. |
| Prior professional verification; REQS.disabilityDoc | “verify the disability or functional limitation first” | NOT ON PAGE | School recommendation required, not prior completed professional verification. Page does not expressly prohibit other verification, so no contradiction inferred. |
| School starts before booking | “start the bursary process before booking the assessment” | NOT ON PAGE | Only contact instruction, no booking-order rule. |
| Approved assessor / invoice route | “Use the approved qualified assessor and submit ... invoice or receipt through the school process” | NOT ON PAGE | Assessor approval, payment and submission mechanics absent. |
| Documentation list | “Assessment quote or invoice and the completed assessment documentation requested by the school” | NOT ON PAGE | No documentary checklist supplied. |
| Independent booking insufficient | “independently booking ... does not establish bursary eligibility” | CONFIRMED | “have been recommended ... by the accessibility services office”; booking alone does not satisfy named criterion. |
| One-time frequency; values | “one-time” | NOT ON PAGE | No frequency limit stated. |
| Phone | “StudentAid BC: 1-800-561-1818” | NOT ON PAGE | No phone printed; no conflicting same-purpose number established. |

Timing text and tip asking the school about payment are requests for information, not claims of a published processing time or particular payment mechanism.

### bc-disability-assistance-pwd

Sources: `bc-disability-assistance-pwd--1.txt` (rates), `--2.txt` (My Self Serve landing page). Neither is the designation, earnings-exemption or general eligibility policy page.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| BC scope; REQS.bc | “BC's core income program” | CONFIRMED | --2: “income and disability assistance for residents of British Columbia”. |
| Single support | “$983.50 monthly support allowance” | CONFIRMED | --1: “1 $983.50”; “All rates are monthly.” |
| Single shelter maximum | “up to $500” | CONFIRMED | --1: “1 person $75 ... $500”. |
| Actual shelter without minimum | “actual shelter costs up to $500” | DIFFERS | --1: “If actual shelter costs are less than the minimum shelter allowance, the minimum shelter allowance will be provided.” Dropped floor: single minimum is $75, not actual costs below that amount. |
| Single total | “Up to $1,483.50/month” | CONFIRMED | --1: “$983.50” support + “$500” maximum shelter = $1,483.50. |
| Both-PWD couple total | “up to $2,662/month” | CONFIRMED | --1: B unit 2 “$1,967.00”; shelter 2 “$695” = $2,662. |
| Transportation / choice | “$52 ... cash or an in-kind bus pass” | CONFIRMED | --1: “$52 in cash or as an in-kind bus pass”. |
| Values inclusive monthly maximum | “1535.5”; “support + max shelter + $52 transport” | CONFIRMED | --1 component figures: $983.50 + $500 + $52 = $1,535.50. |
| Rate effective / update dates | “effective December 1, 2025, re-verified July 2026” | CONFIRMED | --1: “Last updated on July 7, 2026 Effective: December 1, 2025”. July update supports rate currency, not an independent audit-history claim. |
| Adult age; REQS.age18plus | “at least 18” | CONFIRMED | --1: “payments begin in the month of the 18th birthday”. |
| General health supplements | “full health supplements” | NOT ON PAGE | --2 links “General Health and Supplements”; full entitlement not described. |
| Named health supports | “dental, optical, medical equipment, medical transportation and nutrition supplements” | NOT ON PAGE | No named coverage list in supplied pages. |
| PharmaCare coverage | “100% drug coverage under PharmaCare Plan C” | NOT ON PAGE | Plan C not discussed. |
| Single earnings exemption | “$16,200 a year” | NOT ON PAGE | No earnings table. |
| One-PWD couple earnings exemption | “$23,400” | NOT ON PAGE | No earnings table. |
| Both-PWD couple earnings exemption | “$32,400” | NOT ON PAGE | No earnings table. |
| Earnings change date | “effective January 1, 2026” | NOT ON PAGE | No earnings effective date. |
| No monthly earnings cap | “earn the whole exemption in one busy month” | NOT ON PAGE | No earnings-exemption distribution rule. |
| Keep earnings / dollar reduction | “keep 100%”; “assistance is reduced by the amount you went over” | NOT ON PAGE | No earnings retention or reduction formula. |
| Annual window / no carry-over | “January 1 to December 31 and does not carry over” | NOT ON PAGE | No earnings annual-window rule. |
| Warning threshold | “letter once you reach 75%” | NOT ON PAGE | No warning rule. |
| Online remaining exemption | “check what is left ... My Self Serve” | NOT ON PAGE | Current information access stated, specific exemption balance not described. |
| Proration / family changes | “prorated for the months left”; “change in your family ... changes your limit” | NOT ON PAGE | No proration or family-change calculation rule. |
| Online application / account; metadata effort | “Create an account ... complete the online application” | CONFIRMED | --2: “Create an account”; “guide you through the Application for Assistance”. |
| Application/help phone | “1-866-866-0800” | CONFIRMED | --2: “help with your application ... 1-866-866-0800”. |
| Designation form / applicant section | “form HR2883” | NOT ON PAGE | Form number/sections absent. |
| Medical reporter; REQS.bcPwdMedical | “doctor or nurse practitioner ... medical report” | NOT ON PAGE | Professional roles not described. |
| Assessor reporter | “doctor, nurse practitioner or prescribed professional (e.g., occupational therapist, social worker)” | NOT ON PAGE | Assessor roles/examples absent. |
| Ministry severity / duration decision; REQS.bcPwdMedical | “severe and likely to continue for at least two years” | NOT ON PAGE | No medical criteria. |
| Daily restriction / assistance alternatives; REQS.dailyLivingLimit | “significant restrictions ... assistive device ... significant help or supervision ... assistance animal” | NOT ON PAGE | No daily-living eligibility criteria. |
| Family income/asset test; REQS.bcDisabilityAssistanceFinancial | “ministry's own family-unit income and asset test” | NOT ON PAGE | Landing page offers eligibility link; test not reproduced. |
| One-PWD exempt assets | “$100,000 ... single person, couple or family” | NOT ON PAGE | No asset limits. |
| Both-PWD exempt assets | “$200,000 for a couple where both adults ... designation” | NOT ON PAGE | No asset limits. |
| Higher assets than income assistance | “higher asset limits than regular income assistance” | NOT ON PAGE | No asset comparison. |
| Payment start | “once the designation is approved and you are financially eligible, payments begin” | DIFFERS | --1: “paid in the month following designation”; pre-18 designation begins birthday month. Boundary / timing: immediate-on-approval statement loses specified start month. |
| Monthly reporting availability | “Report income and changes monthly as required” | CONFIRMED | --2: “submit your monthly report”. General reporting route supported; detailed triggers below are not. |
| Monthly form/deadline / unchanged income | “HR0081 by the fifth ... income ... change”; “even ... same as last month” | NOT ON PAGE | Form, deadline and triggers not stated. |
| Adult ID / SIN | “ID and Social Insurance Number for all adults” | NOT ON PAGE | No application documentary checklist. |
| Finances documents | “Bank statements and details of assets and income” | NOT ON PAGE | No checklist. |
| Shelter documents | “Rent receipt, lease or proof of shelter costs” | NOT ON PAGE | No checklist. |
| Three-section application | “applicant, medical and assessor sections” | NOT ON PAGE | No designation-form contents. |
| Prescribed classes / simplified form | “CPP Disability, Community Living BC, the At Home Program, PharmaCare Plan P (palliative) or ISC PWD”; “HR3642 ... skips most ... medical paperwork” | NOT ON PAGE | No prescribed-class list, form or paperwork waiver. |
| Age-65 transition / contact | “At 65 most ... Old Age Security and GIS ... contact you before then” | NOT ON PAGE | Rate table mentions OAS for shelter rules, not this transition/promise. |
| Financial processing time | “usually confirmed within days” | NOT ON PAGE | No financial-processing estimate. |
| Designation processing time | “several weeks to a few months once all three report sections ... submitted” | NOT ON PAGE | No designation-processing estimate. |
| Unpublished wait; metadata | “Not published — ask the ministry” | NOT ON PAGE | No wait on these pages; cannot establish absence of publication elsewhere. |

### bc-medical-equipment-devices

Sources: `bc-medical-equipment-devices--1.txt` (policy), `--2.txt` (My Self Serve).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| BC / qualifying status; REQS.bc, bcAssistanceStatus | “qualifying B.C. assistance, care, or protected-status category” | NOT ON PAGE | --1 requires “eligible for general health supplements”; supplied page does not enumerate every care/protected-status category. BC scope itself explicit. |
| Medical need; REQS.equipmentNeed | “needs disability-related medical equipment or supplies” | CONFIRMED | --1: “assist with a medically essential need”. Gate is a necessary need, not complete eligibility. |
| Funding scope / values | “Full cost of pre-approved equipment”; “at ministry rates” | CONFIRMED | --1: “purchase authorization ... to the service provider”; “least expensive, appropriate medical equipment or device”. Approval/rate limits retained. |
| Conventional scooter cap | “up to $3,500” | CONFIRMED | --1: “conventional scooter and any accessories does not exceed $3,500”. |
| Bariatric cap | “$4,500 bariatric” | CONFIRMED | --1: “bariatric scooter and any accessories does not exceed $4,500”. |
| Lift maximum | “floor/ceiling lifts up to $4,200” | DIFFERS | --1: “does exceed $4,200 ... excess cost is a result of unusual installation expenses”. Dropped exception to asserted cap. |
| Mobility items | “canes, crutches, walkers, manual and power wheelchairs, scooters” | CONFIRMED | --1: “Canes Crutches Walkers Manual and power wheelchairs ... Scooters”. |
| Bath / positioning items | “grab bars, bath seats, commodes, lift devices” | CONFIRMED | --1: “grab bar in a bathroom”; “bath or shower seat”; “portable commode chair”; “Floor or ceiling lift devices”. |
| Beds / mattresses / meters | “hospital beds, pressure-relief mattresses and non-conventional glucose meters” | CONFIRMED | --1: “Hospital beds”; “Pressure relief mattresses”; “Non-conventional glucose meters”. |
| Pre-approval categorical | “Pre-approval is mandatory”; “purchased before pre-approval is not reimbursed” | DIFFERS | --1: “will not accept payment responsibility, except in cases of a life-threatening emergency ... without prior approval”. Dropped emergency exception. |
| Last-resort categorical | “no other program (ICBC, WorkSafeBC, extended health) can pay” | DIFFERS | --1: “Co-funding may be considered when other resources cannot pay the entire cost”. Scope: any ability to pay is not disqualifying; partial funding can coexist. Named other resources supported. |
| Prescription categorical | “A prescription from a doctor or nurse practitioner is required” | DIFFERS | --1: “prescribed ... and/or the medical need must be confirmed by the assessment of a relevant therapist”. Dropped therapist-assessment alternative. |
| Therapist assessments | “many items also need an occupational or physical therapist assessment” | CONFIRMED | --1: bariatric scooter “assessment from an occupational or physical therapist must confirm”; scooter assessment and mobility review described. Not every item asserted to require both. |
| Replacement periods | “five years (wheelchair seating after two; canes, crutches and walkers as needed)” | CONFIRMED | --1 table: “5 years”; “Wheelchair Seating Systems 2 years”; “Canes, crutches, walkers As needed”. “Can be replaced” preserves possibility, not guaranteed entitlement. |
| Recreation / lift chair exclusions | “Recreational scooters, lift chairs” | CONFIRMED | --1: “Scooters intended primarily for recreational or sports use”; “Lift chairs”. |
| Bed exclusion | “automatic beds are excluded” | DIFFERS | --1: “Automatic turning beds”. Scope: generic automatic beds is wider than specified turning beds. |
| MySS / phone request | “My Self Serve or 1-866-866-0800” | CONFIRMED | --2: “guide you through the Application for Assistance”; “upload forms”; “help with your application ... 1-866-866-0800”. General ministry application contact, not a distinct equipment helpline. |
| Supplier quotes / estimated repairs | “Submit supplier quote(s)” | CONFIRMED | --1: “documentation outlining the repairs and the estimated cost are needed”; purchase application information supplied by staff. Quote requirement explicit for repairs; separate universal purchase quote below. |
| Universal purchase supplier quote; documents/meta | “Supplier quote”; “supplier quote before purchase” | NOT ON PAGE | Purchase documentation directed by staff; universal supplier-quote checklist not printed. |
| Written approval | “wait for written ministry pre-approval” | CONFIRMED | --1: “an approval letter will be issued to the client”. |
| Direct supplier payment / repairs route | “pays the supplier directly; repairs are requested the same way” | CONFIRMED | --1: “purchase authorization ... to the service provider”; purchase and repairs assessed by HA. |
| Least-expensive suitability evidence | “why the least-expensive option would not meet your medical need” | CONFIRMED | --1: “why a manual wheelchair with a standard frame would not be sufficient”. |
| Repairs / batteries hedge | “Repairs and batteries can be covered between replacement cycles” | CONFIRMED | --1: “may consider repairing”; service coverage includes “battery replacement for powered device”. |
| Processing duration | “Weeks to a couple of months” | NOT ON PAGE | No application decision-time range. Ten-day delivery after approval is a different clock. |
| Metadata variable wait | “Varies with assessments and pre-approval” | NOT ON PAGE | Assessments and approval required, but no wait variation statement published. |

### bc-monthly-nutritional-supplement

Sources: `bc-monthly-nutritional-supplement--1.txt` (rates), `--2.txt` (status-200 flattened PDF stream, not readable form text). Form URL identifies HR2847 but does not verify the unread form's content.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Dietary maximum | “Up to $180/month for dietary items” | CONFIRMED | --1: “Dietary items ... Up to $180 per calendar month”. |
| Vitamins/minerals maximum | “up to $45/month” | CONFIRMED | --1: “Vitamins or minerals ... Up to $45 per calendar month”. |
| Combined maximum; values | “monthlyMax: 225” | CONFIRMED | --1 component caps $180 + $45 = $225; table also prints “$225 per calendar month”. |
| Rate effective date | “effective August 1, 2023” | CONFIRMED | --1: “Effective: August 1, 2023”. |
| BC scope; REQS.bc | “British Columbia” | CONFIRMED | --1: “Province of British Columbia”. |
| Adult age; REQS.age18plus | “at least 18” | NOT ON PAGE | No recipient age stated. |
| PWD / assistance prerequisites; REQS.bcPwdStatus | “people on disability assistance with the PWD designation”; gate “PWD designation or disability assistance first” | NOT ON PAGE | Rates do not specify eligibility or verify the gate's disjunction. |
| Low income; REQS.lowIncome | “lower-income households” | NOT ON PAGE | No financial test. |
| Supplemental money stacking | “on top of disability assistance” | NOT ON PAGE | Supplement amounts named, stacking rule not given. |
| Severe deteriorating condition | “severe ... chronic, progressive deterioration ... wasting-type symptoms” | NOT ON PAGE | Medical criteria not on rate page; PDF not readable. |
| Life danger | “prevent imminent danger to life” | NOT ON PAGE | No clinical threshold in usable evidence. |
| Qualifying nutrition need; REQS.nutritionNeed | “qualifying medical need for a special diet or nutritional products” | NOT ON PAGE | Rate table names dietary items but no MNS need criteria. |
| Two-symptom minimum | “at least two symptoms”; “two or more ... documented” | NOT ON PAGE | No symptom-count rule. |
| Named clinical symptoms | “malnutrition, underweight ... significant weight loss ... muscle-mass loss ... neurological degeneration ... vital organ ... moderate-to-severe immune suppression” | NOT ON PAGE | None of these named conditions/hedges stated in readable rate table. |
| Form identification | “form HR2847” | CONFIRMED | --2 first-line URL ends “hr2847.pdf”. Identifier only, not contents. |
| Form title / availability | “Application for Monthly Nutritional Supplement”; “ministry office, My Self Serve” | NOT ON PAGE | Form body not readable; alternative distribution routes not stated. |
| Applicant section | “Complete Part B yourself” | NOT ON PAGE | Form contents unreadable. |
| Clinical section / professions; metadata effort | “medical practitioner, nurse practitioner or registered dietitian complete Part C” | NOT ON PAGE | Form contents unreadable. |
| Ministry decision | “Health Assistance staff review and decide” | NOT ON PAGE | Rate table does not name adjudicator. |
| Dietitian faster | “often faster than waiting for a specialist” | NOT ON PAGE | No comparative wait evidence. |
| Reconsideration / frequent overturn | “request reconsideration ... frequently overturned with better medical detail” | NOT ON PAGE | No review right or reversal-frequency evidence. |
| Processing time | “Typically a few weeks” | NOT ON PAGE | No decision-time estimate. |
| Unpublished wait; metadata | “Not published — ask the ministry” | NOT ON PAGE | Supplied rate page lacks time, not proof no publication exists. |
| Phone | “1-866-866-0800” | NOT ON PAGE | No program contact number in usable rate text. No same-purpose conflict established. |

### bc-msp-supplementary-benefits

Source: `bc-msp-supplementary-benefits--1.txt`. Its own page confirms the strict “less than $42,000” boundary. The Healthy Kids cross-page boundary conflict is not a DIFFERS finding against this record.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Contribution; values | “$23 per visit” | CONFIRMED | “MSP contributes $23 per visit”. |
| Combined calendar-year cap | “combined 10 visits each calendar year”; “not 10 of each” | CONFIRMED | “combined annual limit of 10 visits each calendar year”. |
| Six services / providers | “acupuncture, chiropractic, massage therapy, naturopathy, physical therapy and non-surgical podiatry from approved providers” | CONFIRMED | “acupuncture, chiropractic, massage therapy, naturopathy, physical therapy and non-surgical podiatry”; “approved providers”. |
| Partial payment / difference owed | “contribution, not the full fee”; “you pay the difference” | CONFIRMED | “partial payment”; “how much the patient will be paying in addition to the MSP fee”. |
| Frequency of extra charges | “most practitioners charge more” | DIFFERS | “Many ... practitioners are opted-out”; “allowed to charge ... more”. Hedge / frequency: many and permission become most and actual charging. |
| BC / MSP prerequisite; REQS.bc, bcMsp | “you and your spouse ... enrolled in MSP” | CONFIRMED | “MSP enrolment must be complete for you (and your spouse, if applicable)”. |
| Income calculation | “last year's net income confirmed by CRA ... combined with your spouse's ... after certain deductions” | CONFIRMED | “net income from last year as confirmed by ... CRA (or combined net income for you and your spouse), less deductions”. |
| Strict income boundary | “less than $42,000 ... may qualify” | CONFIRMED | “If it is less than $42,000, your family may qualify”. No boundary flag. |
| Certain qualification / omitted general conditions; eligibility/requiresNote/REQS.bcSupplementaryBenefitsEligibility | “You qualify ... adjusted net income ... less than $42,000” | DIFFERS | “may qualify”; must have citizen/PR residence “at least the last 12 months” and “not be exempt ... income tax”. Hedge / dropped conditions: income plus MSP is not alone sufficient. |
| Exactly three routes; same gate | “one of three ways” | DIFFERS | Page also lists “Income Assistance recipients”, “Convention refugees”, “Inmates”, long-term-care GIS residents and First Nations coverage. Scope: exclusive three-route framing drops additional named categories. |
| At Home / Mental Health routes | “enroled with MSP through the At Home Program”; “as Mental Health Clients ... eligible” | DIFFERS | Introduced as “Those who may be eligible ... include” those categories. Hedge: categorical eligibility removes source's may. |
| No-cost application; metadata effort | “Applying is free” | CONFIRMED | “There is no cost to apply for MSP, PharmaCare or Supplementary Benefits.” |
| Out-of-province exclusion | “does not ... cover ... outside the province” | CONFIRMED | “does not provide any coverage ... outside of the province”. |
| One application / annual recheck | “generally do not need to reapply ... income ... re-verified each year automatically” | CONFIRMED | “only need to apply once” if MSP-eligible and yearly taxes; “verify your income each year ... automatically”. |
| Nonfiling consequence | “lapses if you stop filing” | DIFFERS | “Eligibility ... may be impacted if you do not file”; “To avoid losing your eligibility or having to reapply”. Hedge: possible loss becomes certain lapse. |
| Marriage income update | “Tell MSP if you marry or start living in a marriage-like relationship” | CONFIRMED | “may be impacted ... if you do not update your MSP account if you marry or begin living in a marriage-like relationship”. |
| Healthy Kids access | “unlocks the Healthy Kids Program”; “also opens ... dental and optical” | DIFFERS | “families deemed eligible ... may be eligible for basic dental treatment, optical care, and hearing assistance”. Hedge: possible separate eligibility becomes assured access. |
| Healthy Kids child age | “children are under 19” | NOT ON PAGE | Source refers to children, without the age boundary. |
| Unified application | “BC Application for Health and Drug Coverage ... MSP ... Supplementary Benefits and Fair PharmaCare” | CONFIRMED | “Using one form ... apply for” these three programs. |
| CRA consent | “Give CRA permission ... release your Notice of Assessment” | CONFIRMED | “giving permission to CRA to release Notice of Assessment or Notice of Reassessment information”. |
| Do not send NOA; documents | “authorise on the application rather than sending” | DIFFERS | Mail route: “along with copies of a Notice of Assessment or Reassessment ... (and your spouse)”. Scope: no-sending instruction incorrectly extends online procedure to mail route. |
| PHN | “Personal Health Number if you already have one” | CONFIRMED | Online prerequisites: “personal health number for you and your spouse, if applicable”. |
| Newly enrolled photo card | “book a B.C. driver licensing office appointment to get your Photo BC Services Card” | CONFIRMED | “must obtain a Photo BC Services Card by visiting a BC driver licensing office”; “can book an appointment”. Advice to book is not a no-walk-ins claim. |
| Variable wait; metadata | “varies” | NOT ON PAGE | No processing range or wait variation statement. |

### bc-optical-supplement

Sources: `bc-optical-supplement--1.txt` (rate table), `--2.txt` (optical coverage).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| BC / assistance entitlement; REQS.bc | “Everyone receiving income or disability assistance gets specified optical services” | CONFIRMED | --2: “Everyone who receives income or disability assistance gets specified optical services.” |
| Additional status gate; REQS.bcAssistanceStatus | “assistance, care, or protected-status category” | NOT ON PAGE | --2 adds medical-services-only; no full care/protected-status enumeration. |
| Optometrist exam cap | “up to $44.83” | CONFIRMED | --1: “Eye exam provided by an optometrist $44.83”. |
| Ophthalmologist exam cap | “$48.90” | CONFIRMED | --1: “Eye exam provided by an ophthalmologist $48.90”. |
| Adult routine interval | “once every 2 years” | CONFIRMED | --2: “routine eye exams once every two years”. |
| New eyewear rate limits; values | “new ... glasses at the ministry's maximum rates” | CONFIRMED | --2: “New eyeglasses, up to the ministry&rsquo;s maximum rate”. |
| Changed-prescription lenses | “lens replacements when your prescription changes”; “even between exam cycles” | DIFFERS | --2: “New lenses if your eye doctor confirms a change in your prescription”. Dropped condition: replacement is not established by an unverified change alone. No separate lens-cycle limit stated. |
| Repairs | “repairs to frames and lenses” | DIFFERS | --2: “Necessary repairs to lenses or frames”. Dropped necessity qualifier. |
| Child MSP exams | “Children's routine eye exams ... covered by MSP” | CONFIRMED | --2: “Children under 19 ... Routine eye exams ... covered by ... MSP”. |
| Child eyewear | “supplement pays for their glasses” | CONFIRMED | --2: children “New eyeglasses, up to ... maximum rate”; record's general maximum-rate qualification retained. |
| Direct payment | “directly to the optometrist or optician” | CONFIRMED | --2: “paid ... directly to the optometrist or optician”. |
| Card / provider check; metadata effort | “BC Services Card”; “verifies ... Pacific Blue Cross” | CONFIRMED | --2: “give them your BC Services Card”; “verify your coverage with Pacific Blue Cross”. |
| Any clinic | “any eye clinic” | NOT ON PAGE | “Tell the eye clinic” does not state unrestricted provider participation. |
| Extra costs / hedge | “Costs above ... are your responsibility” | DIFFERS | --2: “You may be responsible for any additional costs.” Hedge: possible liability becomes categorical. |
| No application / instant verification | “No application ... on the spot” | NOT ON PAGE | Card/verification procedure given; no express no-application or instant-turnaround promise. |
| Phone | “1-866-866-0800” | CONFIRMED | --2: “Toll Free 1-866-866-0800”. |

### bc-supplemental-bursary-students-disabilities

Source: `bc-supplemental-bursary-students-disabilities--1.txt`. Application page is linked but not supplied for this record; other records' companion snapshots are not silently imported.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Full-time amount / period; values | “$800 per program year full-time” | CONFIRMED | “$800 bursary per program year”. |
| Part-time amount / period | “$400 per program year part-time” | CONFIRMED | “$400 bursary per program year”. |
| Non-repayable purpose | “non-repayable ... post-secondary education” | CONFIRMED | “non-repayable grant funding ... cost of their post-secondary education”. |
| Disability types; REQS.student | “permanent, or persistent or prolonged, disability” | CONFIRMED | “permanent, or a persistent or prolonged, disability”; “post-secondary level course(s)”. |
| Full-time load | “40% or more” | CONFIRMED | “full-time course load of 40% or greater”. |
| Part-time load | “20% to 39%” | CONFIRMED | “part-time course load of 20% to 39%”. |
| Definite qualification / dropped CSG requirement; summary | “Full-time and part-time students both qualify” | DIFFERS | “You may be eligible”; each amount requires “qualify for Canada Student Grant for Students with Disabilities”. Hedge / dropped condition: student/disability status alone is insufficient. |
| Public BC schools; REQS.bc | “B.C. public post-secondary schools only” | CONFIRMED | “available to students attending B.C. public post-secondary schools only”; record also states transition exception. |
| Transition eligibility | “at a non-public school in 2025/26 and had already received this bursary ... may request to continue” | DIFFERS | “received SBSD funding for the same program at the same school”. Dropped continuity conditions. |
| Transition end | “until they finish their program or until July 31, 2029” | DIFFERS | “whichever occurs first”. Boundary: disjunction without first-occurring restriction can imply later continuation. |
| Professional verification; REQS.disabilityDoc | “Have a qualified professional verify ... first” | NOT ON PAGE | Disability named, professional verification process not described. |
| StudentAid application | “Apply for StudentAid BC full-time or part-time funding” | NOT ON PAGE | Linked application instructions not reproduced. |
| Verification form | “Disability Verification Form if ... not already verified” | NOT ON PAGE | Form not named on supplied page. |
| Documents / school-load data | “StudentAid BC aid application”; “School and course-load information” | NOT ON PAGE | Eligibility criteria stated, documentary submission checklist not given. |
| Automatic assessment / timing; metadata | “assessed automatically”; “With your student-aid assessment” | NOT ON PAGE | Supplied page only directs reader to application link. |
| Phone | “1-800-561-1818” | NOT ON PAGE | No phone printed; no same-purpose conflict established. |

### cdb-adult

Source: `cdb-adult--1.txt` (overview only). The 2026-10-14 partial recheck in `research/216-misfiled/` covers amount-page assertions but is not this record's supplied snapshot; those claims remain evidence gaps here. Current evaluated aboutList already differs from the earlier review's quoted version; this table checks current code, not historical prose.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Federal financial support | “federal income top-up” | CONFIRMED | “Canada Disability Benefit ... provides direct financial support”. |
| Age; REQS.workingAge | “aged 18–64” | CONFIRMED | “between 18 and 64 years old”. |
| Monthly payment / metadata wait | “Paid monthly once approved” | CONFIRMED | “first payment ... third Thursday of the month following your approval”; “Payments ... managing your payments”. Monthly cadence explicit. |
| Launch | “started July 2025” | CONFIRMED | “Payments began in July 2025.” |
| Lower-income scope | “lower income”; “low-income adults” | NOT ON PAGE | Overview does not give income criteria. |
| Monthly maximum / period; values | “Up to $204.20 / month for July 2026–June 2027” | NOT ON PAGE | Amount page linked, contents not supplied. |
| Annual maximum; values | “2450.4” | NOT ON PAGE | Monthly maximum not on overview; multiplying absent number does not confirm annual total. |
| Income-based amount | “Benefit amounts are based on your adjusted family net income” | NOT ON PAGE | Overview links calculation page, no AFNI text. |
| Threshold reduction | “start to decrease after ... reaches a certain threshold” | NOT ON PAGE | No reduction formula/threshold statement. |
| Zero-payment hedge | “considerably above that threshold ... $0” | NOT ON PAGE | No zero-payment threshold discussion. |
| Annual reassessment | “reassessed each year” | NOT ON PAGE | Annual assessment not described. |
| Tax base year | “July 2026–June 2027 ... 2025 federal tax return” | NOT ON PAGE | No tax base year. |
| DTC prerequisite / approval document; REQS.dtc | “must be approved for the DTC first”; “DTC approval on file with the CRA” | NOT ON PAGE | “Disability Tax Credit” related link does not establish prerequisite/approval-file rule. |
| DTC form; REQS.dtc action | “T2201” | NOT ON PAGE | Form number absent. |
| Tax residency; REQS.cdbTaxFiling | “Canadian resident for income tax purposes” | NOT ON PAGE | Eligibility subpage linked, not supplied. |
| Applicant and partner filing; same gate | “you and your spouse or common-law partner ... filed your 2025 federal income tax return before payments can start” | NOT ON PAGE | Filing/year/partner conditions absent. |
| Legal status alternatives; REQS.cdbStatus | “Canadian citizen ... permanent resident ... protected person ... temporary resident ... previous 18 months ... Indian Act” | NOT ON PAGE | No legal-status list or duration. |
| Federal prison boundary / exception; same gate | “2 years or more ... except for the first and last month” | NOT ON PAGE | No imprisonment criteria. |
| Online application | “Apply online” | CONFIRMED | “All individuals who meet the eligibility requirements can now apply online”. |
| Other application channels | “by phone, by mail, or in person” | NOT ON PAGE | Only online application described. |
| Direct deposit / banking | “Provide direct-deposit details”; “Banking info for direct deposit” | NOT ON PAGE | No banking procedure/checklist. |
| Annual taxes / no-income filing | “File your taxes every year even with no income” | NOT ON PAGE | No tax filing instructions. |
| Single working-income exemption | “up to $10,210 ... July 2026 to June 2027” | NOT ON PAGE | No working-income thresholds. |
| Couple working-income exemption | “up to $14,294 ... combined working income” | NOT ON PAGE | No working-income thresholds. |
| Separate fixed supplemental amount / start | “Starting in September 2026 ... separate fixed $150 lump sum” | CONFIRMED | “supplemental payment of $150 ... September 17, 2026”; first payments after June receive supplement “at a later date”. Record preserves conditional receipt. |
| Supplement purpose | “toward the cost of obtaining the DTC” | NOT ON PAGE | Purpose not stated in overview. |
| No separate application | “You do not apply for it separately” | CONFIRMED | For prior recipients it “will be issued to you”; later first recipients “will be issued at a later date”. Describes automatic issuance. |
| Supplement separate from monthly max; values | “not included in the monthly maximum shown here” | CONFIRMED | Source labels it a “supplemental payment” with distinct issuance date. Does not confirm absent monthly maximum. |
| Alberta reporting obligation | “AISH or ADAP ... report ... outcome ... approved ... amount or a denial” | NOT ON PAGE | Alberta not discussed. |
| Alberta decision deadline / reduction | “no CDB decision ... February 28, 2026 ... $200 ... April 2026” | NOT ON PAGE | Alberta timing/amount not discussed. |
| Metadata effort | “15–30 min (after DTC)” | NOT ON PAGE | No completion-time estimate. |
| Phone | “Service Canada: 1-800-O-Canada” | NOT ON PAGE | Contact page linked, no phone printed; cannot establish a conflicting same-purpose number from this snapshot. |

### cpp-childrens-benefit

Source: `cpp-childrens-benefit--1.txt` (all-step program page; current payment-amount table linked but not included).

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Monthly dependent benefit / disabled or deceased | “monthly payment ... dependent child of a disabled or deceased CPP contributor” | CONFIRMED | “monthly payments to the dependent children of disabled or deceased CPP contributors”. |
| Disability contributor link; REQS.cppDisabilityContributorLink | “CPP disability benefit or a post-retirement disability benefit” | CONFIRMED | “child of the person receiving a CPP disability benefit or a post-retirement disability benefit”. This record focuses on disabled-contributor route, not an assertion that survivor route does not exist. |
| No child-disability requirement | “child does not need to have a disability” | CONFIRMED | Source eligibility lists relationship, age and attendance; benefit is “disabled contributor's child's benefit”. Disability attaches to contributor, not child. |
| Maximum number | “maximum of two children's benefits” | CONFIRMED | “A child can be paid a maximum of two children's benefits.” |
| Child/student age and attendance; same gate | “under 18, or age 18 to 25 ... full-time or part-time ... recognized school or university” | CONFIRMED | “under age 18, or age 18 to 25 and in full-time or part-time attendance at a recognized school or university”. |
| Natural child | “natural child of the contributor” | CONFIRMED | “the natural child of the contributor”. |
| Adoption route / age | “adopted legally or in fact ... while under ... 21” | CONFIRMED | “adopted ... by the contributor while under the age of 21”. |
| Living/decision-making route / age | “legally or in fact living with and under ... decision-making responsibility ... under ... 21” | CONFIRMED | “living with and under the contributor’s decision-making responsibility while under the age of 21”. |
| Contributor over 65 / school stops | “over ... 65 and the child stops attending school ... eligibility ... ends” | CONFIRMED | “If the disabled contributor is over the age of 65 and the child stops attending school ... eligibility ... ends.” |
| Full rate amount / date; values | “$307.81 ... beginning in January 2026” | NOT ON PAGE | Source links current payment table; dollar amount and January 2026 base date not printed. |
| Part-time dollar amount; values | “$153.91 ... in 2026” | NOT ON PAGE | Dollar amount absent. |
| Annual adjustment | “flat rate ... adjusted annually” | CONFIRMED | “flat rate that is adjusted annually”. |
| Full-rate recipients | “child under 18 ... full-time student aged 18 to 25” | CONFIRMED | “Children under the age of 18 receive the flat rate”; full-time 18–25 “receive the flat rate”. |
| Part-time ratio | “half the flat rate” | CONFIRMED | “part-time ... receive half of the flat rate”. |
| Under-18 payee / exceptions | “paid ... to the disabled contributor when ... lives with them ... decision-making responsibility”; “Otherwise ... person or agency ... may receive it” | CONFIRMED | “if: the child lives with ... contributor ... decision-making responsibility ... under age 18”; “person or agency ... may receive”. |
| Student applies / receives | “Students aged 18 to 25 apply for and are paid ... themselves” | CONFIRMED | “should apply ... yourself”; “paid directly to the child”. |
| Apply before parent approval; metadata effort | “do not ... wait ... approved” | CONFIRMED | “you do not have to wait for the benefit to be approved before applying”. |
| Retroactivity | “up to 12 months — 11 months plus the month you apply” | CONFIRMED | “up to 12 months (11 months plus the month you apply)”. |
| Under-18 online/mail route | “My Service Canada Account ... Apply for Canada Pension Plan disability benefits”; “or ... mail” | CONFIRMED | Same quoted selection and “By mail” alternative printed. |
| Student form | “ISP1402”; “Canada Pension Plan Child's Benefit Application and Declaration ... Attendance at School or University” | CONFIRMED | Full title and “(ISP1402)” printed under paper application. |
| Enrolment alternatives | “proof of enrolment ... or ... Section E ... authorized representative” | CONFIRMED | “include a proof of enrolment or have an authorized representative ... complete Section E”. |
| Annual / return-from-break renewal | “beginning of every school year ... after a break” | CONFIRMED | “at the beginning of every school year, and when you return to school after taking a break”. Source can additionally request semester renewal; record does not claim annual renewal is always sufficient. |
| Proof types | “official document ... student portal ... electronic attestation ... Section E” | CONFIRMED | “official document from your online student portal”; “electronic attestation from a school official”; “section E ... completed”. |
| Photocopies / originals | “Photocopies ... accepted”; “may request an original or certified copy at any time” | CONFIRMED | “Photocopies ... will be accepted”; “may request an original copy or certified copy at any time”. |
| Part-time application/renewal restricted to paper | “a part-time student must submit the paper ISP1402 both to apply and to renew” | DIFFERS | Application section covers “full-time or part-time” online; renewal: “Full-time and part-time students: can renew ... online”. Scope: paper-only restriction conflicts with both online routes. |
| Full-time online renewal | “full-time student ... can renew online” | CONFIRMED | “Full-time and part-time students ... can renew ... online”. |
| Vacation payment / failure to renew | “paid during normal school vacation periods ... stops if ... form is not sent in” | CONFIRMED | “paid during normal school vacation periods”; “will stop if you do not send ... completed school attendance form when you return”. |
| No published processing time on this page | “program page does not publish a processing time” | CONFIRMED | Entire supplied program page checked: entitlement-start and retroactivity rules, but no processing-time estimate. Claim limited to this page, not all publications. |
| Monthly approval timing; metadata | “monthly once approved” | CONFIRMED | “provide monthly payments”; “Your first payment” section defines entitlement start. Does not promise a particular approval turnaround. |

### kamloops-arch

Source: `kamloops-arch--1.txt` (ARCH page). Navigation contains a KamPASS link, but KamPASS's own page, brochure and application form are not supplied. No linked-page contents inferred.

| Fact | Record quote | Classification | Snapshot quote / finding |
|---|---|---|---|
| Recreation credits / cap; values | “Up to $400 in recreation credits per year” | CONFIRMED | “provides up to $400 in recreation credits”; “annual program”. Maximum hedge accommodates source's $200 for applications after February 1. |
| Permanent Kamloops / BC scope; REQS.bc, kamloops | “permanent Kamloops residents” | CONFIRMED | “must be a permanent resident of Kamloops”; City of Kamloops address “BC”. |
| Any-one route; REQS.archIncomeOrAssistance | “any ONE of three routes” | CONFIRMED | “meet ONE (1) of the options below”. |
| Assistance route | “Income Assistance from the Ministry of Social Development and Poverty Reduction” | CONFIRMED | “Receive Income Assistance from the Ministry of Social Development and Poverty Reduction (MSDPR)”. |
| Income boundary | “annual income is below the Statistics Canada Low Income Guidelines listed on the application form” | CONFIRMED | “annual income ... below the Statistics Canada Low Income Guidelines (see Application Form for Low Income Guidelines)”. Numeric table not asserted by record or reproduced on this snapshot. |
| Pension / LTD route | “Canadian pension or long-term disability payment below those guidelines” | CONFIRMED | “Receive a Canadian Pension or Long-term Disability that is below the Low Income Guidelines”. |
| Annual reapplication; metadata effort | “new application each year” | CONFIRMED | “annual program that requires an application each year”. |
| Shared application | “same form also asks to be considered for KamPASS” | CONFIRMED | “Applying for KamPASS ... is done through the ARCH application.” |
| KamPASS affordable transit | “City's affordable transit pass” | CONFIRMED | “KamPASS, the City's affordable transit program”. |
| Adult monthly pass specification | “reduced-cost adult monthly transit pass” | NOT ON PAGE | Affordable transit program described, not age/fare-product period. |
| Distinct eligibility / exclusions | “separate program with its own exclusions”; “Approval for ARCH does not establish KamPASS eligibility” | NOT ON PAGE | Supplied ARCH page does not describe independent KamPASS eligibility/exclusions. |
| City statement / automatic consideration / choice | “City states ... two separate programs ... automatically considered for both ... both programs or just one” | NOT ON PAGE | Shared application established, but these claimed City statements absent from supplied ARCH page. |
| Screening / referral agency | “Take ... application to ... screening ... or ... referral agency” | CONFIRMED | “Applications MUST be taken to an ARCH Public Screening Agency or Referral Agency”. |
| Agency reviews / referral client restriction | “agency reviews”; “if you are a client, a listed referral agency” | NOT ON PAGE | Submission locations specified, review role and client-only restriction not described. |
| Not accepted at facilities | “City recreation facilities do not accept the application itself” | CONFIRMED | “ARCH Applications will NOT be accepted at City of Kamloops facilities.” |
| Download / paper | “Download ... or pick up a paper copy” | CONFIRMED | “Download Application”; “hard copy ... Tournament Capital Centre ... screening agencies”. |
| Photo and second ID | “Photo identification and a second piece of identification” | CONFIRMED | “Photo ID”; “Second piece of ID”. |
| Address proof | “Current utility bill or other accepted proof of Kamloops residence” | CONFIRMED | “Proof of where you live—current utility bill (BC Hydro, telephone, or cable TV bill)”. “Other accepted” does not assert an unconditionally accepted substitute. |
| Adult income documents | “Ministry assistance confirmation, each adult's latest Notice of Assessment” | CONFIRMED | “MSDPR confirmation OR ... latest ... Notice of Assessment for each adult in the house”. |
| Pension/disability document alternative | “or accepted disability or pension income evidence” | NOT ON PAGE | Eligibility route exists, but documentary alternative not listed. |
| ARCH activation | “approval letter and photo identification ... City facility to activate ARCH credit” | NOT ON PAGE | No activation procedure printed. |
| KamPASS sales outlet | “purchase it at Kamloops Museum and Archives” | NOT ON PAGE | Museum named as application pickup site, not KamPASS sales location. |
| KamPASS disability-assistance exclusion | “not available ... disability assistance ... Employment and Assistance for Persons with Disabilities Act” | NOT ON PAGE | Exclusion/Act not stated. |
| KamPASS age-60 exclusion | “aged 60 and over ... eligible for ... BC Bus Pass for Seniors and Others” | NOT ON PAGE | No KamPASS senior exclusion. |
| KamPASS youth exclusion | “18 or under ... BC Transit Family Travel Program or School District No. 73 Transportation Assistance” | NOT ON PAGE | Named programs and age exclusion absent. |
| KamPASS U-PASS exclusion | “post-secondary students enrolled in U-PASS” | NOT ON PAGE | No U-PASS exclusion. |
| KamPASS CNIB exclusion | “CNIB card holders” | NOT ON PAGE | No CNIB exclusion. |
| KamPASS income / evidence exclusions | “income ... above ... Low Income Cut-Offs or ... cannot provide income verification” | NOT ON PAGE | ARCH income rules do not establish KamPASS exclusion rules. |
| Annual approval / wait | “Annual approval; ask ... current review time”; “Confirm with the City” | CONFIRMED | “annual program ... application each year”. Questions about review time do not assert a published turnaround. |
| Phone | “250-828-3582” | NOT ON PAGE | Only printed service number is “BC Transit ... 250-376-1216 for bus schedules and prices”, a different purpose; no conflicting ARCH contact number established. |

## Fixes applied — implementation and final verification

The tables above remain the historical verification evidence, not a rewritten audit of the new catalogue. All **36 DIFFERS items have FIX applied** according to `DECISIONS-2026-10-16-batch5.md`; its appended **Fixes applied** section records the change and reason for each item, gate isolation, oracle changes and density allowances. No matching-status declaration changed. No whole-record verification date was advanced, and remaining NOT ON PAGE facts were not silently promoted to CONFIRMED. Item 2 also replaces the unsupported account-posting statement with the snapshot's distinct equipment-ordering and services-notification wording.

### Reviewer resolutions and gate checks

- `bcCydbAge` remains fixed. Its age-band predicate is unchanged from `under19`; only this record uses the new gate. The wizard cannot represent the narrow eligibility interval through the last day of the nineteenth birthday month; adult-band users in that interval still receive “no”. The limitation is documented in the decisions file.
- `bcHomeRenoSpend` is non-fixed and external. Only the provincial renovation credit uses it; the shared federal gate is unchanged.
- MSP's gate is edited in place and remains external, with all eight possible routes, residency and tax qualifiers. Its guide presents eight separate list items, never one exclusive three-route sentence. PWD designation is not newly treated as assistance receipt; MSP's gate remains unmet even if `answers.bcAssistance === "pwd"`.
- Grep plus evaluated field comparison confirms unchanged shared gates: `dailyLivingLimit`, `bcPwdMedical`, `bcAssistanceStatus`, `disabilityDoc`, `under19`, `qualifyingRenovationSpend`.
- Item 8's province-wide wording is unchanged.
- Oracle version is `1.22.0` (from `1.21.0`): added the two isolated gate entries and corrected the provincial renovation explanation. Youth age-band outcomes and adult “no” stay the same; provincial renovation and MSP best cases remain “almost”. No oracle status was weakened to make tests pass.

### Verification results

| Check | Result |
|---|---|
| `npm run gen:context` | Success; 134 entries. `src/links.js` regenerated with no content difference. |
| `npm run gen:guides` | Success; 133 benefit pages and guide index. Sitemap regenerated with no content difference. |
| `npm test` | **170 passed / 170 tests**, zero failures, skips or todos. Four new batch-five tests. |
| `npm run check:surfaces` | Success; all full structured-note parts counted. Baseline rises only for qualifier-preserving source wording, documented per surface in decisions. |
| Chromium `--list` | **233 listed tests in 22 files**. |
| `npx playwright test --project=app-chromium --workers=1` | **233 passed / 233 listed**, zero failures or skips; whole project, serial workers, run alone, no retries. |
| `git diff --check` | Success. |
| Asset pins | All live pins are 177; no remaining 176 pins in index, CSS or generated guides. Historical changelog numbers retained. |

Surface flagged counts: gate.unmet **98**, eligibility.note **43**, detail.about **93**, detail.aboutList.items **150**, summary **26**, note **64**. Uncued flagged gates remain **one**. The initial unit run was **160 passed / 166**, with six failures; the decisions file records each class of failure and the source-preserving resolution. Final logs are listed below.

### Every changed file

Product, test, generator and audit files changed by this batch:

- `e2e/oracle/oracle-spec.js`
- `public/app.js`
- `public/changelog.js`
- `public/data.js`
- `public/index.html`
- `public/styles.css`
- `research/197-info-density/DENSE-SURFACES-REPORT.md`
- `research/197-info-density/dense-surface-baseline.json`
- `research/207-shorts/shorts-applied.json`
- `research/reverify/DECISIONS-2026-10-16-batch5.md`
- `research/reverify/REPORT-2026-10-16-batch5.md`
- `scripts/check-readability.js`
- `scripts/gen-guide-pages.js`
- `scripts/lib/dense-surfaces.js`
- `src/benefits-context.js`
- `test/factual-batch.test.js`
- `test/requires-note-rendered.test.js`

The following **134 changed generated files** are all under `public/guides/`. Ten benefit guides contain factual changes; the provincial renovation correction is in its live requirement gate, so its static guide is pin-only. Other guide changes are asset pins only (the index also repeats summaries):

```text
aadl.html
ab-capcc.html
ab-grant-disability.html
ab-service-dog-id-card.html
ab-special-needs-housing.html
acsd.html
adap.html
adult-health-benefit.html
airdrie-fair-access.html
aish.html
bc-access-grant-deaf-students.html
bc-access-grant-students-disabilities.html
bc-additional-home-owner-grant.html
bc-assistance-program-students-disabilities.html
bc-at-home-medical.html
bc-at-home-saet.html
bc-autism-funding-6-18.html
bc-autism-funding-under-6.html
bc-bus-pass.html
bc-clbc.html
bc-csg-services-equipment.html
bc-csg-students-disabilities.html
bc-cy-disability-benefit.html
bc-dental-supplement.html
bc-disability-assistance-pwd.html
bc-fair-pharmacare.html
bc-fnha-health-benefits.html
bc-fuel-tax-refund-disabilities.html
bc-healthy-kids.html
bc-home-reno-tax-credit.html
bc-icbc-disability-discount.html
bc-learning-disability-assessment-bursary.html
bc-medical-equipment-devices.html
bc-medical-transportation.html
bc-monthly-nutritional-supplement.html
bc-msp-supplementary-benefits.html
bc-optical-supplement.html
bc-pharmacare-plan-c.html
bc-pharmacare-plan-g.html
bc-pharmacare-plan-p.html
bc-property-tax-deferment-disabilities.html
bc-pwd-designation.html
bc-raha.html
bc-sales-tax-credit.html
bc-supplemental-bursary-students-disabilities.html
bc-supported-child-development.html
bc-work-able-internship.html
bc-workbc-assistive-technology.html
bc-workbc-employment-services.html
brampton-activeassist.html
burnaby-fair-play.html
calgary-fair-entry.html
canada-caregiver-credit.html
canadian-dental-care-plan.html
canmore-affordable-services.html
cdb-adult.html
child-disability-benefit.html
child-health-benefit.html
cochrane-connect-card.html
coquitlam-far.html
cpp-childrens-benefit.html
cpp-disability.html
csg-disability.html
csg-dse.html
cwb-disability.html
disability-supports-deduction.html
dres.html
dtc.html
edmonton-fare-assistance.html
excise-gasoline-tax-refund.html
fortsask-access.html
fscd.html
grandeprairie-aish-pass.html
grt-affordable-transit.html
grt-cnib-pass.html
grt-mobilityplus.html
grt-support-person.html
grt-taxi-coupons.html
hamilton-fare-assist.html
handycard-translink.html
handydart-bctransit.html
handydart-translink.html
home-accessibility-tax-credit.html
hvmp.html
index.html
kamloops-arch.html
kelowna-recreation-assistance.html
leduc-subsidies.html
lethbridge-fee-assistance.html
lloydminster-recreation-access.html
london-ontario-renovates.html
medical-expense-tax-credit.html
medicinehat-fair-entry.html
mississauga-activeassist.html
multigenerational-home-renovation-tax-credit.html
odsp.html
okotoks-fee-assistance.html
on-adp.html
on-parking-permit.html
ontario-autism-program.html
ottawa-a-card.html
ottawa-access-pass.html
ottawa-community-pass.html
ottawa-equipass.html
ottawa-hand-in-hand.html
parking-placard.html
passport-program.html
pdd.html
ramp.html
rdsp.html
reddeer-fee-assistance.html
richmond-rec-fee-subsidy.html
saanich-life.html
sparc-parking-permit.html
sprucegrove-low-income-transit.html
ssah.html
stalbert-subsidy.html
strathcona-subsidy.html
surrey-leisure-access.html
taxi-saver-bctransit.html
taxisaver-translink.html
toronto-fair-pass.html
toronto-welcome-policy.html
trillium-drug-program.html
vancouver-leisure-access.html
victoria-life.html
waterloo-curbside-waste-support.html
waterloo-homemaking-support.html
waterloo-ontario-renovates.html
windsor-affordable-pass.html
windsor-recreation-assistance.html
woodbuffalo-lift.html
york-region-homemakers.html
york-region-recreation-subsidies.html
```

Generated execution logs created by this batch:

- `outputs/batch5-context.log`
- `outputs/batch5-guides.log`
- `outputs/batch5-surfaces.log`
- `outputs/batch5-unit-initial.log`
- `outputs/batch5-unit.log`
- `outputs/batch5-playwright-listed.log`
- `outputs/batch5-playwright.log`

Pre-existing modified `OWNER-DIGEST.md` and `research/reverify/QUEUE.md` were not edited by this batch. Other pre-existing output files and untracked inputs remain untouched. No `TASKVIEW-*.md`, `AGENTS.md`, `OWNER-DIGEST.md` or `.taskview/` was edited. No commit or push was made.

