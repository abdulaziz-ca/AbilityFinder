# Decisions on REPORT-2026-10-15-batch2 (items 1-24)

Reviewer: agent:claude, 2026-10-15. Read-only review; no data.js / app.js edits made. Rule applied: never add or harden beyond the official source; when in doubt, the more conservative wording wins.

Tally: FIX 24, KEEP 0, OPEN 0. Several are minor (partly hedged elsewhere in the record): 6, 11, 12, 17, 19, 24. Item 1 also exposes a wrong `source` URL for csg-dse.

Gate-sharing summary (grep of `requires` in public/data.js):
- `homeowner`: SHARED (waterloo-ontario-renovates, home-accessibility-tax-credit, bc-additional-home-owner-grant, bc-home-reno-tax-credit, bc-property-tax-deferment-disabilities). Do NOT edit.
- `homeRenoCandidate`: SHARED (home-accessibility-tax-credit, multigenerational-home-renovation-tax-credit, bc-home-reno-tax-credit). Do NOT edit.
- `qualifyingRenovationSpend`: SHARED (same three; the other two ARE refundable credits, so "pays back" is right for them). Do NOT edit.
- `lowIncome`: SHARED by 30 records. Do NOT edit.
- `lowIncomeOrDisabilityIncome`: shared by 7 Alberta records, already fixed:false; no change needed.

---

## csg-dse

### 1. csg-dse, coverage certainty (summary / note / about) — FIX
Evidence (csg-dse--3.txt, StudentAid BC): "This grant helps pay for extra education-related costs, such as services and equipment you need to support your studies." and "You may be able to receive additional funding for equipment, services, and supports". Record says "Covers ..." / "A large grant that pays for the specific services and equipment a student needs". Claim is real: certainty hardened.
Caveats found: (a) the specific list (tutoring, note-taking, coaching, specialized transportation) is NOT ON PAGE in any snapshot (--1 is the general $2,800 grant at the same canada.ca URL as `source`, not the Services & Equipment grant; --3 is a BC page). Do not add anything, but soften. (b) `source` points to the general-disabilities grant page, not the Services & Equipment page ("Related links: Canada Student Grant for Services and Equipment - Students with Disabilities"). Flag for a separate source-URL fix; I did not fetch the right page.
Instructions (public/data.js, record csg-dse):
- `summary`: "Helps pay for extra education-related costs, such as services and equipment you need to support your studies, if you qualify. Supports can include assistive technology, note-taking, tutoring and coaching, depending on your needs."  (keeps the examples but turns "Covers" into "can include ... depending on your needs").
- `note`: replace "Covers a lot: assistive tech, tutors, note-takers, learning coaches, specialized transportation and more." with "Can help with services and equipment you need for your studies. What is approved depends on your needs and your application."
- `detail.about`: replace "A large grant that pays for the specific services and equipment a student needs because of their disability — from screen readers ..." with "A grant that helps pay for extra education-related costs, such as services and equipment you need to support your studies. Examples can include screen readers, hearing supports, coaching, tutoring and note-taking, depending on your needs."
- No gate change. Keep `amount` "Up to $20,000 / year" (the "/ year" is NOT ON PAGE; leave to the pipeline owner, not a DIFFERS).

---

## edmonton-fare-assistance

### 2. Edmonton, "$36/month" — FIX (number is wrong)
Evidence (edmonton-fare-assistance--1.txt): "Is your household income $33,579 or less? Yes You may be eligible for the Ride Transit Program and/or Leisure Access Pass ... between $33,580 and $38,158? ... You may be eligible for the $50 monthly Ride Transit Arc card"; for larger households "$41,803 or less? ... You may be eligible for the $35 monthly Ride Transit Arc card". So the page shows $35 (lower household-income band) or $50 (upper band), never $36. The price for the benefit-recipient route (AISH/CPP-D) is not stated on the page. Codex is right; $36 appears unsupported.
Instructions (record edmonton-fare-assistance):
- `amount`: "Reduced-cost monthly Arc transit card ($35 or $50 a month, depending on household income) + Leisure Access Pass"
- `detail.steps[2]`: "Once approved, buy your reduced-cost monthly Arc card (the City lists $35 or $50 a month depending on household income) and use your Leisure Access pass." (Do not state which price AISH/CPP-D recipients pay; the page does not say.)
- `summary` "A subsidized monthly Arc transit card plus reduced-cost access ..." : keep. `detail.about` unchanged.
- No gate change.

### 3. Edmonton, "You qualify on low income OR if you receive AISH / CPP Disability" — FIX (hedge)
Evidence: "Do any of the following currently apply to you: receiving income support and Foundational Learning Assistance ..., AISH, CPP Disability Benefits, Employment Insurance (EI), a Newcomer to Canada or a Child under Government Care? Yes You may be eligible for the Ride Transit Program and/or the Leisure Access Pass" and "Is your household income $33,579 or less? Yes You may be eligible ...". Page is "may be eligible" throughout; Ride Transit is "for eligible low-income Edmontonians". Also the page's list is a check, not a guarantee, and it lists other qualifying statuses (EI, newcomer, etc.).
Instructions:
- `note`: "You may be eligible if your household income is at or under the City's limits (they depend on household size), or if you receive AISH or CPP Disability Benefits, among other programs the City lists. Use the City's eligibility questions to check."
- `detail.tips[1]`: "If you're on AISH or CPP Disability you likely qualify regardless of the income cutoff." -> "If you receive AISH or CPP Disability Benefits, the City's eligibility check says you may be eligible without meeting the income limit."
- Also NOT ON PAGE (not raised by Codex, hedge or verify against another City page before keeping): "One application covers both transit and leisure access" (note) and tips[0] "Applying for Leisure Access automatically considers you for the transit discount too". The snapshot says only "Ride Transit Program and/or the Leisure Access Pass". Recommend removing "One application covers both ..." from `note` unless a City page confirms it.
- No gate change (`lowIncomeOrDisabilityIncome` is fixed:false, already conservative).

---

## home-accessibility-tax-credit

### 4. HATC, REQS.homeowner.unmet "own and live in the home" — FIX (new HATC-specific gate; do NOT edit shared `homeowner`)
Evidence (home-accessibility-tax-credit--1.txt): "An eligible dwelling is a housing unit located in Canada that is owned (jointly or otherwise) by: the qualifying individual and is ordinarily inhabited (or is expected to be ordinarily inhabited) in the year by the qualifying individual / the eligible individual and is ordinarily inhabited (or is expected to be ordinarily inhabited) in the year by the eligible individual and the qualifying individual". Also covers co-op shares. Claim is real: someone who has not yet moved in but is expected to is included by CRA, and the shared gate is `fixed:` true unless the user ticked "Owns and lives in a home" (or "unsure"), so it can wrongly exclude such users and those who do not tick it.
Instructions: add in public/app.js REQS a new key `hatcEligibleDwelling` and use it in the HATC record's `requires` in place of `homeowner`:
```
hatcEligibleDwelling: {
  met: () => hasCircumstance("homeowner"),
  fixed: false,
  unmet: "The home must be in Canada and owned (jointly or otherwise) by the person the renovation is for or by the family member claiming for them, and ordinarily lived in (or expected to be ordinarily lived in) during the year by the owner. Co-op shares can count.",
},
```
fixed:false is required (conservative: shows "one step away", not "not a match"). Leave `homeowner` untouched for the other four records. Update HATC `requires` to ["homeRenoCandidate"-replacement, "hatcEligibleDwelling", "qualifyingRenovationSpend"-replacement] (see 5 and 6).

### 5. HATC, REQS.homeRenoCandidate.unmet "or an eligible supporting family member living with the person" — FIX (new HATC-specific gate; do NOT edit shared gate)
Evidence: "You are a qualifying individual, or an eligible individual making the claim for a qualifying individual"; "A qualifying individual is either of the following: an individual who is eligible for the disability tax credit at any time in the year / an individual who is 65 years of age or older at the end of the year"; "An eligible individual is any of the following: a spouse or common-law partner of a qualifying individual / a parent, grandparent, child ... who has claimed [or could have claimed] the amount for an eligible dependant, Canada caregiver amount ...". Codex's "claimant, not an alternative" point is partly a nit (a family member claiming FOR a DTC/65+ person is genuinely an eligible route), but the gate is wrong in two real ways: (1) its `met` ignores family claimants, so a spouse/relative of a DTC-eligible or 65+ person (who answers dtc "no" for themselves) is excluded with fixed:true, although CRA allows them to claim; (2) it is fixed:true for dtc "no"/"unsure", but CRA only needs DTC eligibility "at any time in the year" (can be approved retroactively), so excluding is not source-supported. The "living with the person" phrase is true only for the dwelling rule (owned by eligible individual and inhabited by both), not a general claimant rule; it belongs to the BC credit, which shares this gate.
Instructions: new gate for HATC only; leave `homeRenoCandidate` for the multigenerational and BC records.
```
hatcQualifyingPerson: {
  met: () => answers.dtc === "yes" || isSeniorAge(),
  fixed: false,
  unmet: "The renovation must be for a qualifying individual: someone eligible for the Disability Tax Credit at any time in the year, or aged 65 or older at the end of the year. A spouse, common-law partner or certain other relatives can make the claim for them.",
  action: <copy the DTC action from REQS.dtc>,
},
```
fixed:false is required.

### 6. HATC, REQS.qualifyingRenovationSpend.unmet "This credit pays back part of what you spend" — FIX (minor; new HATC gate)
Evidence: "The Home Accessibility Tax Credit (HATC) is a non-refundable tax credit". The record's own note/tips already say non-refundable, so this is a wording defect only in the shared gate text, and the shared gate is correct for the other two (refundable) credits. For HATC the unmet message still reads as a refund.
Instructions: new gate `hatcQualifyingRenovationSpend`, same shape as `qualifyingRenovationSpend` (copy `short` and `who`), fixed:false, with
`unmet: "This credit is non-refundable: it reduces the tax you owe based on eligible expenses (up to $20,000 a year), so it applies only once a qualifying renovation has actually been done and paid for in the tax year. Keep your invoices and receipts."`
Do not edit the shared gate. Replace in HATC `requires`.

---

## lethbridge-fee-assistance

### 7. Lethbridge, `amount` "$150/season recreation" — FIX
Evidence: "Funding is available for one program/activity, to a maximum of $150 per person, per season, while funds are available. Seasons span from January 1 – June 30, and July 1 – December 31". Real: maximum, per person, one program/activity are dropped.
Instructions: `amount`: "3 months of bus passes for the price of 1 (you pay for one month, two are free) + up to $150 per person per season toward one recreation or culture program, while funds are available". Check any `tips` still match ("Recreation funding is capped per season ..." is fine; add "for one program or activity" if desired).

### 8. Lethbridge, summary "One application covers transit, Access-A-Ride, and recreation fees" — FIX
Evidence: "Rec and culture Fee Assistance application form Bus pass Fee Assistance application form Access-A-Ride Fee Assistance application form" (three forms); "Those apply/re-applying for a bus pass ... must use the online application process". Real.
Instructions:
- `summary`: "One City program covers transit, Access-A-Ride paratransit, and recreation fees, with a separate application form for each. AISH counts as proof of income."
- `detail.steps[0]`: "Apply online using the Fee Assistance application form for what you need (recreation and culture, bus pass, or Access-A-Ride), or call 311 for help." (311 not verified on page; leave as is if previously confirmed elsewhere.)
- `detail.steps[2]`: "Choose what you need: bus pass, Access-A-Ride, recreation, or more than one — each has its own form."
- `detail.about` "A single City of Lethbridge program covering three things" is fine (program, not application); leave.

---

## medical-expense-tax-credit

### 9. METC, "claim expenses for any other dependant" — FIX
Evidence: "Use line 33199 to claim the part of eligible medical expenses ... for any of the following persons who depended on you for support: your or your spouse or common-law partner's children who were 18 years of age or older at the end of the tax year, or grandchildren / your or your spouse or common-law partner's parents, grand-parents, brothers, sisters, uncles, aunts, nephews, or nieces who were residents of Canada at any time in the year". Real: "any other dependant" is wider than the list, and the residency condition applies to the second group. Appears in steps[3], about, aboutList.items[2], and `requiresNote` ("Expenses for other dependants go on line 33199").
Instructions: replace "any other dependant" with "other dependants who depended on you for support (your or your spouse's or partner's children aged 18 or older at the end of the year, or grandchildren, or parents, grandparents, brothers, sisters, uncles, aunts, nephews or nieces who were residents of Canada at any time in the year)" in steps[3] (shorten in about/aboutList to "a dependant who depended on you for support, other than a spouse, partner or child under 18, on line 33199 (see CRA for who counts)"). Keep the "same calculation against that dependant's net income" (source: "You have to do the following calculation for each dependant ... 3% of your dependant's net income").

### 10. METC, "enter the result on line 33099" — FIX
Evidence: "Step 1 On line 33099 ... enter the total amount that you or your spouse or common-law partner paid in 2025 for eligible medical expenses. Step 2 On the line below line 33099, enter the lesser of the following amounts: 3% of your net income ( line 23600 ) or $2,834. Step 3 Subtract the amount of step 2 from the amount on line 33099, and enter the result on the following line". Real: the record puts the remainder on 33099.
Instructions: `detail.steps[1]` and `steps[2]` become: "total them and enter the total on line 33099", "on the line below, enter the lesser of 3% of your net income from line 23600 or $2,834", "subtract that amount from the line 33099 total and enter the result on the following line of your return". Update `detail.about` first sentence ("For line 33099 you total the eligible expenses, then subtract...") so it does not say the remainder is on 33099: "...and the remainder, entered on the line after the threshold, is what the credit is calculated on." Same for aboutList.lead. Keep the threshold ($2,834 indexed) hedges.

### 11. METC, "you can pick the 12-month period ..." — FIX (minor)
Evidence: "You can claim only eligible medical expenses ... if you, or your spouse or common-law partner: paid for the medical expenses in any 12-month period ending in 2025 did not claim them in 2024". The record's "check CRA's rule" is a hedge but omits the known restriction.
Instructions: `detail.tips[1]`: "you can choose any 12-month period ending in the tax year, as long as those expenses were not already claimed in the prior year, so check CRA's rule before choosing".

---

## medicinehat-fair-entry

### 12. Medicine Hat, "75% off transit" vs "up to 75%" — FIX (minor; conservative wording)
Evidence: --1 (program page and FAQ): "Save 75% on monthly transit passes, to an annual maximum of $630 subsidy per person per year (the equivalent of 24 adult passes in a two-year period)"; --2 (City's own application form): "Receive a reduction of up to 75% from the regular price of an age-appropriate monthly transit pass for up to two years. (User must purchase monthly.) User pays: 25%". Same site wording differs, not contradictory in substance ("User pays: 25%"), but the application form is the more hedged text. Conservative wins. No new percentage.
Instructions: `amount`: "up to 75% off transit (up to $630/yr per person) + ..."; `detail.about`: "It can take up to 75% off age-appropriate monthly transit passes (to an annual maximum of $630 subsidy per person)". Keep the $630 figure (matches both sources: "$630 per person/year", "$630 per individual in the same household").

### 13. Medicine Hat, "$200/yr recreation & arts" shared — FIX
Evidence: "Your application ... allows you to access various services with separate subsidies for each service area." Recreation: "Each family member listed on your approved application form will receive $200 per year. The $200 subsidy can only be applied to the specified family member and cannot be combined, transferred, or shared." Esplanade: "The maximum user fee assistance per eligible resident (adult or child) per eligible year is $200." Application form: "Max yearly subsidy amount: $200 per individual" for each. Real: the sources give separate $200 allocations; the record's "$200/yr recreation & arts" and "$200 a year toward City recreation and Esplanade arts programs" can be read either as one shared $200 or ambiguous. Not a number error, but fix for clarity.
Instructions: `amount`: "up to 75% off transit (up to $630/yr per person) + up to $200/yr per person for City recreation, and a separate up to $200/yr per person for Esplanade education programs". `detail.about`: "...and gives each approved person up to $200 a year for City recreation, plus a separate up to $200 a year for Esplanade education programs, at 75% off." Tip[0] ("each approved person gets their own $200 recreation subsidy") is fine; leave.

### 14. Medicine Hat, "City recreation and Esplanade arts programs at 75% off" — FIX
Evidence: "75% reduced rates for City of Medicine Hat regular-priced recreation program and admissions at City-run swimming pools and leisure centres" and "75% reduced rates for educational programs directly provided by staff of the Esplanade" (also "Esplanade Arts and Heritage Centre education programs"). Real: record implies all Esplanade arts programming and all City recreation. Also applies to `amount` and `summary` ("recreation and Esplanade arts programs").
Instructions: replace "City recreation and Esplanade arts programs" everywhere (amount, summary, about) with "regular-priced City recreation programs and admissions at City-run pools and leisure centres, and Esplanade education programs provided directly by Esplanade staff". Suggested short form for `summary`/`amount`: "recreation and Esplanade education programs". Keep "75%" with "up to" only for transit (see 12); for recreation/Esplanade the sources say "75% reduced rates" and "User pays: 25%", so keep "75% off".

### 15. Medicine Hat, "a social worker's letter" — FIX
Evidence (--1): "Letter from a social worker/support staff: Only when no other documents are available. A letter dated within the last 30 days from a social worker/support staff with whom a current relationship exists. The letter should outline the length of the relationship, that the person writing the letter is aware of the Low Income Eligibility and that the household meets the eligibility requirements." Real; the record presents it as an equal alternative. Also "AISH benefits card" is "a copy of your current Health Benefits Card" for AISH; and a document is required "for each member of your household 18 years or older".
Instructions: `detail.documents[0]`: "A copy of your current AISH Health Benefits Card — or another accepted proof of income from the City's list (for example a CRA Notice of Assessment or an Alberta Works document). A letter from a social worker or support staff is accepted only when no other documents are available: dated within the last 30 days, from someone you have a current relationship with, and stating the length of the relationship, that they are aware of the Low Income Eligibility, and that your household meets the eligibility requirements." Optionally add: "Provide a document for each household member aged 18 or older." Same softening wherever the letter appears (grep "social worker" in the record).

### 16. Medicine Hat, "Wait about two weeks for a decision" / time — FIX (hedge)
Evidence: "How long will it take to get approved? Your application will be processed within two weeks but your approval depends on the information you provide. If information is missing, it may delay your approval." Real: "about two weeks" is firmer than "within two weeks" and the delay caveat is dropped.
Instructions: `detail.steps[3]`: "Your application should be processed within two weeks, but approval depends on the information you provide, and missing information may delay it." `detail.time`: "Processed within two weeks; missing information may delay approval." Note `note` "Approval lasts up to two years" is correct.

---

## rdsp

### 17. RDSP, "government adds matching grants ... and bonds" — FIX (minor; partly softened elsewhere)
Evidence: "When you open a plan, you may also get grants and bonds from the Government of Canada" and "Family income and amount of contributions determine how much matching grants and bonds you could get." The record already says "up to $3,500 ... up to 300%", "bonds (free money for lower incomes)" and "potentially tens of thousands", so Codex is partly overstating; but "adds"/"pays" are flat.
Instructions: `summary`: "A savings account where the government may add matching grants (up to 300%) and bonds, depending on your family income and how much is contributed — you don't even need to contribute to get the bond if your income is low." `detail.about` and `aboutList.lead` (identical text): "The government may pay in grants (matching what you put in) and bonds (for lower incomes), depending on family income and contributions — potentially tens of thousands of dollars over time." Keep `amount` and tips unchanged.

---

## richmond-rec-fee-subsidy

### 18. Richmond, "Unlimited free drop-in admission" / "free drop-ins with no cap" — FIX
Evidence: "Unlimited free admission to many drop-in programs and services". Real: "many" dropped in `amount`, `summary`, and `note` ("Free drop-in admission is not capped").
Instructions: `amount`: "Unlimited free admission to many drop-in programs and services plus 90% off most registered programs, up to $300 a year ..." ; `summary`: "... free admission to many drop-in programs and services with no cap on visits, and nine tenths off most registered programs."; `note` last sentence: "Free admission to eligible drop-in programs is not capped."

### 19. Richmond, "90% off registered programs" (amount) — FIX (minor)
Evidence: "A 90 per cent discount on most registered programs". Note the `amount` as quoted by Codex is the short form; the current `amount` already reads "plus 90% off registered programs, up to $300 ..." Add "most" (covered in 18's `amount` text above). summary and detail already say "most".

### 20. Richmond, REQS.lowIncome "This is for lower-income households." — FIX (new record-specific gate, fixed:false; shared `lowIncome` has 30 users, do not edit)
Evidence: "individuals/households must live in Richmond AND be experiencing financial hardship as determined by one of the following two methods. Individuals/households who are receiving government financial assistance from one of the following programs: Youth Agreements, SAJE, Income Assistance, Disability Assistance, Resettlement Assistance, Rental Assistance Program (RAP), SAFER, Guaranteed Income Supplement (GIS), Canada Disability Benefit (CDB) OR Individuals/households who do not receive government financial assistance but meet the following financial limits: Family Net Income ...". Real and important: route 1 has no income test, but the `lowIncome` gate requires answers.income === "low" with fixed:true, so someone on Disability Assistance or CDB who reports a moderate/high household income is shown "not a match". (Another snapshot-wide clue: the record's `eligibility.items[1]` defines "financial hardship" only by the City's definition; the two methods are not stated.)
Instructions: add `richmondFinancialHardship` to REQS:
```
richmondFinancialHardship: {
  met: () => answers.income === "low" || answers.bcAssistance === "pwd",
  fixed: false,
  unmet: "You must be in financial hardship in one of two ways: you receive one of the government assistance programs the City lists (for example Disability Assistance, Income Assistance, the Guaranteed Income Supplement or the Canada Disability Benefit), or you do not receive them but meet the City's family net income and other financial limits.",
},
```
and use it in the Richmond record's `requires` instead of `lowIncome`. `bcAssistance === "pwd"` is an approximation (PWD ~ Disability Assistance); keep fixed:false so nobody is hard-excluded. Also update `eligibility.items[1]`/`requiresNote` to name the two methods: "You are in financial hardship, shown either by receiving one of the government assistance programs the City lists (for example Disability Assistance or the Canada Disability Benefit), or by meeting the City's family net income and other financial limits."

---

## saanich-life

### 21. Saanich, `amount` / about "approval includes ..." — FIX
Evidence: "your application ... will be valid for two years from date of approval and you can select from one of two options: Option 1: Free Drop Ins and Discounts ... Option 2: 50% off Regional Recreation Pass"; "Clients selecting Option 1 will receive the following: Unlimited free drop-in sessions at SAANICH facilities only ... 52x free drop in sessions annually ... at participating greater Victoria Regional ... Below is the list of additional discounts and grants ... Adult (19-59): $80 grant ... Youth (13-18yrs): $120 ... Child (5-12yrs): $120 ... Preschool (0-4yrs): $80 ...". Option 2: "Purchase an Annual Regional Pass valid for one year from date of purchase at 50% off regular price." Real; the `summary` mentions choice but `amount` and `about` do not.
Instructions:
- `amount`: "Choose one of two options for two years. Option 1: free drop-ins at Saanich facilities, 52 regional drop-in visits a year, and a one-time grant of $80 to $120 (by age) toward registered programs at Saanich centres. Option 2: 50% off an annual Regional Recreation Pass."
- `detail.about`: "Saanich's two-year L.I.F.E. approval lets you choose Option 1 (free drop-ins at Saanich facilities, regional drop-in visits, and an age-based one-time grant for Saanich registered programs) or Option 2 (50% off an annual Regional Recreation Pass). Current applications can be completed through the City's secure online form."
(The "52 regional visits" and 50% figure are in the snapshot.)

### 22. Saanich, "there are no further funds once the initial grant is used" — FIX
Evidence: adult 19-59, 60+, preschool: "Note: there is no additional funds after the initial grant is used. This amount is all that is available for the full two-year term." Youth 13-18 and child 5-12: "There may be some additional funds for children and youth only after initial funding has been utilized. ... Please be aware that there are some strict guidelines for eligibility, and funds are not guaranteed." Real: the blanket statement is true for adults and preschool only.
Instructions: `note`: replace the clause with "for adults and preschool-age children the grant is all that is available for the two-year term; for children (5-12) and youth (13-18) there may be some additional funds after the initial grant is used, with strict eligibility guidelines and no guarantee." Also `detail.tips[1]` "The initial grant is for the whole two-year approval": append "(children and youth may be able to ask about additional funds, not guaranteed)". The 5-day grant processing note is sourced; keep.

### 23. Saanich, "You have a Canada Revenue Agency Proof of Income Statement for every household member 19 and over" — FIX (gate unchanged)
Evidence: "Most clients fall under general eligibility where they are approved based on their proof of income shown by their most recent CRA Proof of Income Statement. There are other forms of eligibility based on other scenarios." Alternatives: "Your Proof of Income Statement does not accurately reflect your current income level due to an experience such as an illness or job loss ... Have an adjudicator form filled out ... Or apply online using your adjudicator form as proof of income"; newcomer/refugee landing papers; "You are a youth in a local school who does not have parental/guardian support to apply. Have a school administrator, teacher or councilor fill out the Youth Application form"; "If you do not fall into one of the above groups, but are still a resident of Saanich, please contact financialassistance@saanich.ca". Real: all-mode eligibility imposes the general route on everyone and would exclude people the source includes.
Instructions:
- `eligibility.items[1]`: "Most households qualify with a Canada Revenue Agency Proof of Income Statement for every household member 19 and over, even those who will not use the program. Thresholds are based on their combined gross income." and change `eligibility.note` to: "Other routes exist: newcomers can apply with landing papers showing a landing date within one year of applying; if your statement no longer reflects your current income (for example after an illness or job loss) you can use a completed adjudicator form; a youth in a local school without parental or guardian support can use the Youth Application form; if none fit, contact the financial-assistance office."
- `requiresNote`: change "You also need a Canada Revenue Agency Proof of Income Statement ..." to "Most households need a Canada Revenue Agency Proof of Income Statement for every household member 19 and over ... Other routes exist (newcomers with landing papers, an adjudicator form if your income has changed, a Youth Application form for a youth without parental/guardian support); contact the financial-assistance office if none fit."
- `detail.steps[1]`: "Get the current CRA Proof of Income Statement for every household member age 19 or older (or, if another route applies to you, the form for that route)".
- `detail.documents[1]`: "Current CRA Proof of Income Statement for every household member 19 or older (most households), or the adjudicator form / Youth Application form where those routes apply".
- Keep `lowIncome` gate (fixed:true acceptable: every route still requires financial need; adjudicator route is an income-based route). Note that the shared lowIncome gate could mislead on "unmet" text but is not a defect here.
- Keep the existing under-$1,000 step.

---

## taxi-saver-bctransit

### 24. Taxi Saver, "pay any remainder using a method the taxi accepts" — FIX (minor)
Evidence: "Use coupons to pay the metered fare. If the fare is $5.80, you pay $5.00 in coupons and $0.80 in cash. Taxi drivers do not give change for vouchers." The snapshot never says other payment methods are accepted; the record's `note` already says "pay any remainder in cash". Steps[4] is the unsourced broadening.
Instructions: `detail.steps[4]`: "Use vouchers toward the metered fare and pay any remainder in cash (for example, on a $5.80 fare you pay $5.00 in coupons and $0.80 in cash)". Leave `note` and tips as is. Optional: `detail.documents[1]` "Payment accepted by the regional Taxi Saver office" is NOT ON PAGE here; leave.

---

