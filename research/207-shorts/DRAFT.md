# TaskView #207 — draft requirement cues

Drafting only; not approved copy or production metadata. No benefit facts were added or re-verified against official sources: this is an editorial review of the current `REQS` text under AGENTS.md rule 1. `unmet`, `met`, `fixed` and application behavior are unchanged. Follow the accepted #208 design: cues navigate, never decide eligibility; full wording remains available intact under one disclosure.

## Coverage and method

Used `collectDenseSurfaces(process.cwd())` from `scripts/lib/dense-surfaces.js`, selecting `surface === "gate.unmet" && (chars > 120 || sentences > 1)`. Read each selected full text and its `met`/`fixed` through `extractReqs`; predicates were inspected, not executed. All 88 selected top-level gate keys are included, plus `achbOlderDependent` and `dtc` as explicit null exceptions. Counts below use the collector’s chars (JavaScript string length); the cue limit is checked separately by Unicode code points. The collector splits punctuation in B.C. and St. Albert as sentences, so even short abbreviation-only flags are retained.

`who` describes participation in this particular check, not everyone involved in the entire benefit application. `you` includes the person answering for a child or family member. Multiple actors can be conditional across alternative routes; they are not a claim that every route requires each actor. `professional` includes an authorized assessor/provider, not just doctors; `program` marks explicit decisions, approvals, verification or allocation in this check. A reader checking a known fact does not replace the program’s ultimate authority. Fixed gates are still mismatch/routing reasons, never tasks that promise eligibility if completed. Null cues also have null actor metadata, consistent with the accepted schema.

## Draft table

| gate | chars | short | who |
| --- | ---: | --- | --- |
| prolonged | 213 | Ask a medical practitioner which CRA route to check | you, professional |
| odspMedical | 570 | Check ODSP's disability review or the route that skips it | you, professional, program |
| passportDso | 271 | Ask DSO about its review and the psychologist's assessment | you, professional, program |
| tdpDeductible | 230 | Check household drug costs, insurance and other drug coverage | you |
| hvmpMobility | 189 | Check how your disability limits movement and daily tasks | you |
| hvmpIncome | 182 | Check the income limit and whether you may need to pay a share | you, program |
| hvmpCoordinator | 234 | Check other funding first and ask the coordinator about approval | you, program |
| ssahDocumentation | 232 | Ask about health records and how SSAH decides funding | you, professional, program |
| acsdSeverity | 145 | Ask ACSD how it reviews your child's disability and extra costs | you, program |
| acsdIncome | 164 | Check family income, family size and disability costs with ACSD | you, program |
| adpClinical | 200 | Ask an ADP authorizer about the assessment for your device | you, professional |
| odspFinancial | 336 | Check with ODSP about income, assets and what does not count | you, program |
| notBcStudentAidDuplicate | 113 | Check the StudentAid BC guide for this grant | you |
| achbAge | 148 | Check the child's age and high school rules for coverage | you |
| achbFamilyResidencyStatus | 139 | Check where each family member lives and their status in Canada | you |
| achbCoverageCoordination | 400 | Check other health plans and whether ACHB may cover costs left over | you, program |
| notPostSecondaryStudent | 219 | Check Kelowna's student rule and ask about student pass rates | you |
| cppDisabilityContributorLink | 268 | Check the parent's CPP benefit and the child's age and school status | you |
| cdbTaxFiling | 181 | Check tax residency and tax returns for you and your partner | you |
| cdbStatus | 369 | Check the rules for status in Canada and time in federal prison | you |
| cdbAmountCalculation | 211 | Ask Service Canada how family income may affect your payment | you, program |
| ccbEligibility | 289 | Check Canada Child Benefit rules and yearly tax filing | you |
| rdspOpening | 161 | Check the RDSP beneficiary's social insurance number and residency | you |
| rdspContributionWindow | 201 | Check the RDSP rules for opening a plan and adding money | you |
| rdspGrantWindow | 265 | Check the RDSP grant and bond window, not just the savings window | you |
| cwbEligibility | 626 | Check the Canada Workers Benefit rules and exceptions | you |
| csgNeedAndProgram | 386 | Check student aid rules, school eligibility and disability records | you, program |
| csgServicesEquipment | 320 | Ask a qualified person to confirm school support needs and costs | you, professional |
| abGrantStudyAidEligibility | 176 | Check Alberta student aid rules, course load and assessed need | you, program |
| abGrantCurrentCostRequest | 232 | Check approved cost records and what is left after federal funding | you, program |
| dresResidencyAndStatus | 155 | Check Alberta residency and your right to work or train in Canada | you |
| dresDisabilityBarrier | 126 | Check records of how your disability affects school or work | you |
| dresEmploymentRoute | 418 | Check whether DRES or your school handles the support you need | you, program |
| abServiceDogQualified | 295 | Check your service dog's records against Alberta's accepted routes | you, professional |
| abCapccContinuingCareHome | 206 | Check your care home type and how you can share your goals | you |
| abSpecialNeedsHousingPlacement | 182 | Ask your local housing provider about its rules and waiting list | you, program |
| aishMedical | 237 | Ask about AISH's disability review and your doctor's report | you, professional, program |
| aishFinancial | 243 | Check income, assets and other benefits you may need to apply for | you, program |
| adapMedical | 148 | Check Alberta's disability review for AISH and ADAP | you, program |
| adapFinancial | 206 | Check ADAP income reviews, assets and other possible benefits | you, program |
| aadlAssessment | 185 | Ask an AADL health professional about the item and assessment rules | you, professional |
| aadlOtherPayer | 149 | Check whether another plan already covers the item | you |
| rampMobilityRoute | 347 | Check RAMP's routes for mobility aids or listed conditions | you |
| rampIncomeAndResidency | 224 | Check RAMP's family income and Alberta residency rules | you |
| adultHealthIncome | 190 | Check your family size against Alberta's current income table | you |
| adultHealthGateway | 314 | Check the health benefit routes and other coverage exclusions | you |
| abPlacardMobility | 123 | Check the parking permit rules for walking or vision limits | you |
| autismDiagnosis | 73 | Check whether the autism diagnosis meets B.C. standards | you, professional |
| planGClinicalAndFinancialNeed | 202 | Ask your prescriber about Plan G's health and income checks | you, professional |
| planPRegistration | 223 | Ask a doctor or nurse practitioner to send the registration form | you, professional |
| bcMsp | 51 | Check your Medical Services Plan enrolment | you |
| bcSupplementaryBenefitsEligibility | 200 | Check the income, At Home or Mental Health Client routes | you |
| firstNationsStatus | 164 | Ask FNHA Health Benefits about status and B.C. residency rules | you, program |
| bcPwdStatus | 66 | Check your B.C. PWD designation or disability assistance status | you |
| bcAssistanceStatus | 102 | Check the guide for accepted B.C. assistance or status categories | you |
| bcBusPassStatus | 102 | Check the bus pass routes for disability assistance or senior status | you |
| bcPwdMedical | 222 | Ask about the ministry review and the health reports it needs | you, professional, program |
| bcPwdDesignationFinancial | 429 | Check the usual PWD application path and routes that may skip it | you, program |
| bcDisabilityAssistanceFinancial | 265 | Ask the ministry about its family income and asset test | you, program |
| bcCydbIntake | 273 | Check current Autism Funding or At Home routes and transition plans | you, program |
| bcFuelTaxRoute | 270 | Check which disability proof the fuel tax refund program accepts | you, professional, program |
| bcFuelTaxRegistered | 166 | Check your fuel tax refund registration approval before claiming | you, program |
| bcDefermentProperty | 239 | Check residency, home ownership, equity and unpaid property bills | you |
| qualifyingRenovationSpend | 165 | Check the renovation is done and paid for, and keep the receipts | you |
| mhrtcSecondaryUnit | 288 | Check the separate-unit rules and who the renovation is for | you |
| excisePermanentMobilityCertified | 136 | Ask a medical practitioner about certifying your mobility limits | you, professional |
| cdcpRequirements | 253 | Check dental coverage, tax returns, family income and residency | you |
| disabilityMedicalExpensesPaid | 137 | Check paid medical costs and receipts for your tax return | you |
| caregiverSupportClaim | 146 | Check who gives support and who claims it on their tax return | you |
| bcHomeOwnerGrantDisabilityRoute | 412 | Check the assistance or spending route and whether a health form is needed | you, professional |
| rahaEligibility | 243 | Check household rules and get written approval before work is done | you, program |
| bcHealthyKidsIncome | 180 | Check income rules and apply for MSP supplementary benefits first | you, program |
| bcWorkBcRoute | 341 | Check which WorkBC route fits your work or school situation | you, program |
| coquitlamStatus | 249 | Check Coquitlam's residency and immigration status rules | you |
| coquitlamIncome | 215 | Check your household size against Coquitlam's income table | you, program |
| archIncomeOrAssistance | 328 | Check Kamloops' assistance, income or pension routes | you |
| notBcAssistance | 154 | Check whether Healthy Kids or ministry coverage is the right route | you |
| dailyLivingLimit | 134 | Check daily living limits and the help or supports you need | you |
| outsideMetroVancouver | 91 | Check whether to use B.C. Transit or TransLink for your area | you |
| waterlooRenovatesEligibility | 233 | Ask the Region to check income, home value and home records | you, program |
| waterlooHomemakingNeed | 308 | Ask about the program's home help review and the records it needs | you, program |
| waterlooWasteSupportApproval | 198 | Ask the Region which waste support route you can apply for | you, program |
| yorkHomemakersNeed | 180 | Call York Region to ask about health and financial need rules | you, program |
| ottawaOdspReceipt | 200 | Check your Ottawa residency and ODSP and transit proof | you |
| atpApproval | 153 | Ask about transit program approval and household tax records | you, program |
| londonRenovatesEligibility | 275 | Ask London to check income, assets, home value and residency | you, program |
| p2pIncomeTest | 279 | Ask local transit or recreation staff for your family's income limit | you, program |
| stalbert | 37 | Check whether the City of St. Albert program is for your area | you |
| achbOlderDependent | dynamic | null | null |
| dtc | 67 default; 81 override | null | null |

## Hardest calls

These are the ten least certain cues, not approvals. Please challenge lost distinctions, actor scope and implied certainty against the quoted source. Full unmet quotations below are the application’s current wording, not independently verified official quotations.

### odspMedical

> ODSP decides whether you meet its definition of a person with a disability: a substantial mental or physical impairment that is continuous or recurrent and expected to last a year or more, where the direct and cumulative effect results in a substantial restriction in your ability to work, care for yourself, or take part in community life, verified by an approved health care professional. Your caseworker gives you a Disability Determination Package to complete and return within 90 days. If you receive CPP-D or QPP-D you are in a prescribed class and skip this step.

**Draft:** Check ODSP's disability review or the route that skips it

The cue must leave room for the prescribed-class bypass, not tell every reader to obtain a new disability decision. “Route that skips it” is plainer than prescribed class but less specific. All three actors participate across routes; not every route needs fresh professional evidence. The full text must identify CPP-D/QPP-D and the package deadline.

### hvmpIncome

> Your household income must not exceed the program's established threshold. With a household income over $38,000 you may be required to contribute toward the cost of the modification.

**Draft:** Check the income limit and whether you may need to pay a share

A payment cue can easily turn a possible contribution into a bill. “Whether” plus “may” deliberately retains uncertainty. Program participation reflects its threshold and possible contribution decision; the full text, not this cue, supplies the dollar cutoff.

### ssahDocumentation

> SSAH needs a regulated health professional to document your child's functional limitations, and it is a discretionary program — funding is provided according to available resources, so meeting the rules does not guarantee an amount.

**Draft:** Ask about health records and how SSAH decides funding

Professional evidence and resource-based funding are separate hurdles. Asking how funding is decided avoids a promise after submitting records, but “health records” is broader than documented functional limitations. The full requirement must retain the regulated-professional requirement and explicit no-guarantee warning.

### bcHomeOwnerGrantDisabilityRoute

> You must qualify on one of two routes: you receive provincial disability assistance, hardship assistance or a supplement under the Employment and Assistance for Persons with Disabilities Act; or you pay at least $150 a month for assistance with daily living activities, or have spent at least $2,000 on structural modifications to the home. The second route needs Form B (FIN 74) signed by a health professional.

**Draft:** Check the assistance or spending route and whether a health form is needed

Assistance and spending are alternatives, and only the second route needs a health professional. “Whether” is essential: “get a health form” would incorrectly burden all applicants. Professional participation is conditional, not universal. Review whether “assistance” is clear enough without naming each benefit.

### bcPwdDesignationFinancial

> The standard designation application is generally reached through a financial eligibility screen for assistance. An existing designation is not automatically lost if you later become financially ineligible, and prescribed-class routes — including CPP disability benefits, the At Home Program, Community Living BC support services and PharmaCare palliative care benefits — can lead to designation without the standard application.

**Draft:** Check the usual PWD application path and routes that may skip it

“Usual” and “may skip” preserve generally and can lead without making the financial screen universal or a bypass certain. A cue cannot safely describe both entry routes and retention of an existing designation. Retention and prescribed-class examples remain in full, and ministry adjudication stays with the program.

### achbCoverageCoordination

> Confirm the family is not receiving government health-benefit coverage through Income Support, AISH, the Child and Youth Support Program, or Non-Insured Health Benefits for First Nations and Inuit. Private or other health plans are not exclusions: use them first and ACHB may cover remaining eligible costs. Use the Canadian Dental Care Plan first too; ACHB may cover remaining eligible dental costs.

**Draft:** Check other health plans and whether ACHB may cover costs left over

Other plans include excluded government coverage and plans that must be used first. The cue deliberately does not say that all other coverage excludes ACHB or that leftover costs will be paid. “May” remains visible. The full requirement must distinguish private plans, CDCP and government exclusions.

### cwbEligibility

> You must be a resident of Canada throughout the year, be 19 or older on December 31 or live with your spouse, common-law partner or child, and have net income below the level set for your province or territory. You are not eligible if you were enrolled as a full-time student for more than 13 weeks in the year unless you have an eligible dependant on December 31, if you were confined to a prison or similar institution for at least 90 days during the year, or if you do not have to pay tax in Canada because you are an officer or servant of another country, such as a diplomat, or a family member or employee of that person.

**Draft:** Check the Canada Workers Benefit rules and exceptions

The combined age/family alternatives and student/dependant, prison and foreign-official exclusions cannot be restated safely in a tiny line. This is intentionally a broad rules-and-exceptions navigation cue, not a checklist or positive verdict. “You” marks facts the reader knows; it is not a transfer of tax adjudication authority.

### bcCydbIntake

> Support is available now: new families apply through the existing pathways — Autism Funding or the At Home Program — and current recipients are being moved to this benefit automatically as their transition completes. Direct applications for this benefit open April 1, 2027.

**Draft:** Check current Autism Funding or At Home routes and transition plans

Do not turn a future direct intake into an instruction to apply directly now. The cue points to existing pathways and transition plans without promising a completed automatic transfer. The full text must keep the direct-intake date and current-recipient transition timing. Program participation reflects the automatic transition, not an invented professional step.

### waterlooWasteSupportApproval

> Assisted collection is for a disability or physical limitation when nobody is available to help; the medical exemption's bag tags go to approved applicants. Either way you apply to the Region first.

**Draft:** Ask the Region which waste support route you can apply for

The no-helper condition belongs to assisted collection, while bag tags have their own approval route. A generic “apply for assisted waste collection” would erase that split. Asking which route you can apply for preserves the choice and approval uncertainty; the full text still supplies the conditions.

### rampMobilityRoute

> RAMP is for an Albertan of any age who uses a wheelchair, a senior 65 or older who uses a 4-wheel walker on an ongoing basis, or someone living with one of the listed progressive conditions: multiple sclerosis, muscular dystrophy, ALS, COPD, Parkinson's disease, Alzheimer's disease, spina bifida, a spinal cord injury, or a non-recovering stroke.

**Draft:** Check RAMP's routes for mobility aids or listed conditions

The source joins a wheelchair route, an older walker-user route and listed progressive-condition routes. This cue avoids ages, equipment specifications and diagnosis-based approval. “Listed conditions” is a pointer to the full list, not a claim that any diagnosis qualifies. Actor metadata describes checking known facts rather than the whole RAMP application.

## Explicit omissions

- `achbOlderDependent`: function-valued full text. Both branch texts remain runtime-specific; no static short or actor grouping is proposed. Source function:

```js
() => ageIn("19to59")
      ? "Confirm the person is exactly 19 (the selected age band also includes older adults), lives at home, is attending high school through grade 12, and submit the Declaration of 18 and 19 Year Old Dependent (AEHB3654)."
      : "Confirm the 18-year-old lives at home, is attending high school through grade 12, and submit the Declaration of 18 and 19 Year Old Dependent (AEHB3654)."
```
- `dtc`: the real top-level key for the DTC-unsure override (not a synthetic dotted key). Null is conservative for the gate as a whole; this draft does not propose a default cue that could leak into the unsure branch. Default full text:

> Get approved for the Disability Tax Credit first — it unlocks this.

Unsure full text from `evaluate()`:

> You're not sure about your Disability Tax Credit — apply for it; it unlocks this.

## Validation and review boundary

88 drafted cues; 2 null entries; 90 entries total. Node validation checks JSON parsing, complete selected-gate coverage, real top-level keys, Unicode code-point length, no numeric characters, legal nonempty/duplicate-free actor arrays and null pairing. No npm tests, Playwright or generators were run. No production migration is implied: independent copy review must test uncertainty and exceptions before adoption.
