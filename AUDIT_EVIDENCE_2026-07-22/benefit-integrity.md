# AbilityFinder benefit and content integrity audit notes

Audit date: 2026-07-22 (America/Edmonton)
Scope owner: benefit/content-integrity pass only
Method: read-only source review plus current official-source verification. No repository files or benefit data were changed.

## Scope, inventory, and limitations

- Read completely: `AGENTS.md`; also read the relevant architecture and decision material in `HANDOFF.md`, `README.md`, and `ARCHIVAL_KNOWLEDGE_BASE.md`.
- Source-of-truth datasets inspected: `public/data.js`, `public/grants-data.js`, `public/orgs-data.js`, `public/changelog.js`, `public/app.js` practitioner/freshness sections, generated `src/benefits-context.js`, generated `src/links.js`, and all `public/guides/*.html` outputs implicated by findings.
- Catalog inventory: 84 benefit records; 36 structured value records; 84 metadata records; 12 extra-guidance records; 19 non-monetary supports; 12 help organizations; 18 charitable grant records; 22 independent organization records.
- Every benefit has an application URL and source: 80 static + 4 dynamic `applyUrl`s; 83 static + 1 dynamic `source`; 168 URL fields in total. The generated monitor contains 151 unique links and reports five dynamic URLs skipped.
- The 84 benefit records contain 1,395 user-facing factual/guidance claim units under a reproducible definition: each `name`, `amount`, `summary`, `requiresNote`, `note`, `detail.about`, `detail.time`, `detail.phone`, and each `detail.steps/documents/tips` item. Add 168 URL claims, 84 structured-value leaves, 252 metadata leaves, and 108 extra-guide leaves: **2,007 main-catalog claim units**. IDs, eligibility predicate names, category labels, and the directories are excluded from that 2,007 count.
- Generated coverage: assistant grounding contains all 84 benefit names. Static guide files exist for 83/84 benefits; `local-supports` is the sole dynamic/no-static-guide record. Confirmed incorrect claims are copied into static guides. Contrary to the generator's stated safety design, the always-sent catalog does **not** redact figures from benefit summaries; 11/84 summaries expose dollar or percentage figures to the model (DATA-16). Per-benefit detail fields do redact figures but explicitly label `detail.time` and `detail.phone` as “verified.”
- Current official source/program-owner pages were opened for **84/84 benefit records (100% record-level source coverage)** and high-risk fields were compared for every record. Those 84 records contain 1,395 defined benefit claim units. The records checked account for all 1,395 units, but this was **not a claim-by-claim attestation**: amount, eligibility, transition, contact, timing, and prominent guide claims received priority, while every supporting-document/tip sentence was not independently corroborated. The 18 grant + 22 organization records were inventoried and source-inspected but not independently fact-verified claim-by-claim. The full 2,007-claim universe was not verified; do not call this exhaustive factual verification.
- Search snippets were not used as authority. Findings below cite direct official government/program-owner pages. Where two current official sources conflict, status is “ambiguous/manual follow-up,” not “wrong.”

## Immediate release blockers from this pass

1. DATA-01: DTC card/guide calls the $10,138 claim base a ~$10,138 annual tax credit; the current official 2026 source says the $10,341 amount produces a federal tax reduction of up to $1,448.
2. DATA-02: The DTC practitioner finder says all listed practitioners can sign the form regardless of impairment; the CRA restricts each non-physician practitioner to specified impairment categories.
3. DATA-04: Seven municipal programs treat DTC approval or merely being unable to work as equivalent to actually receiving AISH/CPP-D, yielding false “ready” matches.
4. DATA-06: Both BC Autism Funding guides tell families only 20% may be used for travel/training/equipment; BC raised the current final-period allowance to 50%.
5. DATA-14: AISH/CDB interaction guidance omits Alberta’s current mandatory update action and concrete benefit treatment.
6. DATA-16: the always-sent assistant catalog leaks numeric benefit figures despite the explicit no-figures safety boundary.
7. DATA-18: BC medical-transportation matching excludes income-assistance recipients whom current official policy includes, risking missed essential medical travel.

## Findings summary

| ID | Severity / priority | Confidence | Type | Finding |
|---|---|---|---|---|
| DATA-01 | High / P1 | Confirmed | Data accuracy | DTC disability amount is presented as the value of the tax credit and uses the old 2025 figure |
| DATA-02 | High / P1 | Confirmed | Data accuracy / UX | DTC signer finder ignores impairment-specific practitioner authority |
| DATA-04 | High / P1 | Confirmed | Defect / Data accuracy | DTC or “unable to work” is used as a proxy for receiving AISH/CPP-D across seven municipal matches |
| DATA-06 | High / P1 | Confirmed | Data accuracy | BC Autism Funding TTE allowance is 50%, not the displayed 20%, for the current final period |
| DATA-14 | High / P1 | Confirmed | Data accuracy / Program integrity | AISH/CDB interaction omits mandatory reporting/current deduction treatment |
| DATA-16 | High / P1 | Confirmed | Data accuracy / Reliability | Always-sent assistant grounding exposes figures from 11 benefit summaries despite the no-figures safety design |
| DATA-18 | High / P1 | Confirmed | Defect / Data accuracy | BC Medical Transportation falsely excludes eligible income-assistance recipients |
| DATA-03 | Medium / P1 | Confirmed | Data accuracy | Canada Disability Benefit amount and new supplement are stale |
| DATA-05 | Medium / P1 | Confirmed | Data accuracy | BC Bus Pass incorrectly charges PWD recipients the $45 senior-stream fee |
| DATA-08 | Medium / P1 | Confirmed | Data accuracy / Reliability | Edmonton application timing says ~2 weeks; current City page says approximately 8–12 weeks |
| DATA-10 | Medium / P1 | Confirmed | Program integrity / Maintainability | “Recently verified” and per-benefit freshness are not supported by the implemented date model |
| DATA-13 | Medium / P1 | High confidence | Data accuracy / UX | AISH matching and copy use an over-narrow “stops working” proxy |
| DATA-17 | Medium / P1 | Confirmed | Data accuracy / Program integrity | Current BC autism/SAET records omit the active 2026 transition to the new Disability Benefit |
| DATA-19 | Medium / P1 | Confirmed | Defect / Data accuracy | Alberta Adult Health Benefit is matched to any low-income adult without the program's additional eligibility gateway |
| DATA-20 | Medium / P1 | Confirmed | Data accuracy / UX | FSCD guide says a diagnosis is required although Alberta accepts children awaiting diagnosis |
| DATA-09 | Medium / P2 | High confidence | Data accuracy | ADAP contact number is the AISH application-status line, mislabeled as Alberta Supports |
| DATA-11 | Medium / P2 | Confirmed ambiguity | Data accuracy | Medicine Hat’s current webpage and 2026 application disagree ($630 vs $635 maximum transit subsidy) |
| DATA-12 | Medium / P2 | Confirmed gap | Enhancement / Program integrity | Several high-value official home-accessibility/property programs are absent |
| DATA-21 | Medium / P2 | Confirmed | Data accuracy / UX | Vancouver LAP copy implies DTC/CDB status itself qualifies, while the City says eligibility remains income-tested |
| DATA-23 | Medium / P2 | Needs manual validation | Data accuracy | Spruce Grove's current page omits the catalog's $25/$50 pass amounts; only an older official fee bylaw was located |
| DATA-07 | Low / P2 | Confirmed | Data accuracy | Calgary Fair Entry uses 2025 transit prices in a July 2026-verified catalog |
| DATA-15 | Low / P2 | Confirmed | Maintainability / Trust | Organization directory renders one hard-coded July 19 date for records verified on different dates |
| DATA-22 | Low / P2 | Confirmed | Data accuracy / UX | Kamloops summary implies ARCH approval also gets KamPASS despite explicit KamPASS exclusions |
| DATA-24 | Low / P2 | High confidence | Data accuracy / UX | DRES guide makes unsupported “easiest support” and coaching/training claims beyond the current public program page |

## Detailed findings

### DATA-01 — DTC value is materially misrepresented

- **Evidence labels:** Observed in source; Code-confirmed; Source-confirmed.
- **Affected users:** Any DTC applicant, especially a low-income user budgeting around an expected refund.
- **Affected surfaces/files:** `public/data.js:109-110`, `public/data.js:917-955`; `public/guides/dtc.html:60`; result cards, detail, print/estimate surfaces.
- **Actual:** “≈ $10,138 tax credit / year + up to 10 years back-pay.” Structured value separately estimates $1,500–$2,700/year and $25,000 retroactive, with no jurisdiction/year support in the record.
- **Official evidence:** Finance Canada’s current 2026 measure says the DTC amount is $10,341 and provides a **federal tax reduction of up to $1,448**, not a $10,341 payment or saving: https://budget.canada.ca/update-miseajour/2026/report-rapport/tm-mf-en.html . CRA’s 2025 return page confirms $10,138 was the 2025 disability **amount** entered on line 31600: https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/deductions-credits-expenses/line-31600-disability-amount-self.html
- **Root cause:** The claim base was confused with the payable credit and then treated as a user-facing value; 2025 and 2026 concepts were mixed.
- **Expected:** Name the applicable tax year; distinguish claim base from maximum federal tax reduction; explain that actual tax saved depends on tax payable and that provincial credits/transferability differ. Do not publish a universal retroactive maximum.
- **Correction:** Replace the headline and structured estimate using current official year-specific wording. If showing a combined federal/provincial estimate, calculate and label it per province and cite both sources.
- **Verification/regression:** Assert the card never equates the disability amount with cash/tax saving; snapshot the current tax-year label; test $0 tax payable, transferred credit, AB and BC, adult/child supplement, and retroactive wording.

### DATA-02 — DTC signer recommendations can send users to a practitioner who cannot certify their impairment

- **Evidence labels:** Code-confirmed; Source-confirmed.
- **Affected users:** DTC applicants without a family doctor; users may pay for an unusable appointment.
- **Affected files:** `public/data.js:164-174`, `public/data.js:927-928`, `public/app.js:3270-3295`.
- **Reproduction:** Complete a mental-health or other non-vision journey, open the DTC practitioner finder. It renders “Any of these can sign this form — whoever you can get in to see soonest” and may link an optometrist and audiologist.
- **Actual:** A flat benefit-level list makes psychologist, optometrist and audiologist interchangeable and omits occupational therapist, physiotherapist, and speech-language pathologist.
- **Official evidence:** CRA’s current table permits doctor/NP for all impairments; optometrist only vision; audiologist only hearing; OT walking/feeding/dressing; physiotherapist walking; psychologist mental functions; SLP speaking: https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit/how-apply-dtc.html
- **Root cause:** Practitioner authority is modeled only by benefit ID, not by impairment category; a comment incorrectly treats the benefit note as verification.
- **Correction:** Represent the official practitioner-to-impairment matrix. Render doctor/NP universally and only condition-appropriate alternatives; cover cumulative restrictions and multiple impairment categories carefully.
- **Verification/regression:** Table-driven tests for every CRA category and multi-category combination; assert optometrist never appears for mental-only and psychologist never appears for vision-only; assert OT/PT/SLP appear where authorized.

### DATA-03 — Canada Disability Benefit figure is stale and omits a new supplement

- **Evidence labels:** Code-confirmed; Source-confirmed.
- **Affected files/surfaces:** `public/data.js:111`, `public/data.js:959-992`, `public/data.js:392-398`, `public/guides/cdb-adult.html:60`.
- **Actual:** $200/month, $2,400/year, including FAQ and estimate.
- **Official evidence:** July 2026–June 2027 maximum is $204.20/month; a $150 lump-sum DTC-cost supplement begins September 2026: https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit/amount.html and https://www.canada.ca/en/employment-social-development/programs/disability-benefit.html
- **Correction:** Use payment-period-specific value and describe supplement eligibility/timing without implying all applicants receive it immediately.
- **Regression:** Boundary around June/July payment period, annualization, supplement effective date, income thresholds, and static/generated copies.

### DATA-04 — False municipal “ready” matches from invalid benefit-status proxies

- **Evidence labels:** Code-confirmed; Source-confirmed.
- **Affected users:** Higher-income or otherwise ineligible users with DTC approval, or users who report that disability stops work but do not receive AISH/CPP-D.
- **Affected files/programs:** `public/app.js:234-239`; `public/data.js:1606`, `1652`, `1691`, `1729`, `1835`, `1870`, `1904` (Edmonton, Red Deer, Lethbridge, Medicine Hat, Strathcona County, Airdrie, Wood Buffalo).
- **Actual:** `lowIncomeOrDisabilityIncome.met()` is true for `lowIncome() || answers.dtc === "yes" || isUnableToWork()`, while the copy says the alternative is receiving AISH/CPP Disability.
- **Official evidence example:** Edmonton’s City page lists low-income thresholds and actual receipt of AISH/CPP-D (among other enumerated routes), not DTC approval or self-reported inability to work: https://www.edmonton.ca/ets/subsidized-transit . Red Deer likewise names actual AISH/GIS/Income Support: https://www.reddeer.ca/city-services/transit/fares-and-passes/transit-fare-assistance-pass/
- **Reproduction:** Edmonton resident; select a non-low income band; answer DTC=yes (or “disability stops me from working”); program predicate reports met despite no question establishing receipt of AISH/CPP-D.
- **Correction:** Ask an explicit, privacy-preserving categorical question about receipt of the exact qualifying programs, or keep these as “confirm”/one-step-away unless income independently qualifies. Model each municipality’s routes separately rather than sharing one predicate.
- **Regression:** For all seven programs, table-test low/high income × DTC yes/no × unable-to-work yes/no × actual qualifying-program receipt; DTC alone must never establish assistance receipt.

### DATA-05 — BC Bus Pass fee is applied to the wrong eligibility stream

- **Evidence labels:** Code-confirmed; Source-confirmed.
- **Affected files/surfaces:** `public/data.js:2472-2491`; `public/guides/bc-bus-pass.html:58-60`; assistant grounding retains the incorrect fee concept.
- **Actual:** “$45 per year” and “The fee is $45 per year” for PWD recipients and seniors together.
- **Official evidence:** Current rate table explicitly says **no annual fee** for applicants/recipients with PWD designation; $45 applies to listed senior/other categories: https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/general-supplements-and-programs-rate-table . PWD recipients choose the pass instead of the $52/month transportation supplement: https://www2.gov.bc.ca/gov/content/transportation/passenger-travel/buses-taxis-limos/bus-pass/people-with-disabilities
- **Correction:** Split PWD and low-income-senior cost/tradeoff copy. State clearly that PWD recipients choose either pass or $52/month and do not pay the annual fee.
- **Regression:** PWD vs senior rendering and value calculations; never subtract both $45 and $52 for a PWD recipient.

### DATA-06 — BC Autism Funding final-period TTE allowance is understated

- **Evidence labels:** Code-confirmed; Source-confirmed.
- **Affected files:** `public/data.js:2370`, `2373`, `2394`; `public/guides/bc-autism-funding-under-6.html:58,84`; `public/guides/bc-autism-funding-6-18.html:58`; generated assistant detail redacts the number but preserves the stale concept.
- **Actual:** Up to 20% for training, travel and equipment.
- **Official evidence:** BC’s current transition page says the allowable portion was increased from 20% to **50%** for the final funding period: https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs
- **User harm:** A family could unnecessarily forgo thousands of dollars of eligible equipment/training/travel spending in the final, non-renewable program period.
- **Correction:** Update both age streams with the effective/final-period context and transition dates. Confirm whether any individual agreement limits differ before making a universal claim.
- **Regression:** Both age streams, old vs final funding agreement period, transition date, generated guides, grounding redaction.

### DATA-07 — Calgary’s displayed 2026 Fair Entry transit prices are 2025 prices

- **Evidence labels:** Code-confirmed; Source-confirmed.
- **Affected files:** `public/data.js:134`, `1565-1594`; `public/guides/calgary-fair-entry.html:59-81`.
- **Actual:** $5.90–$59/month.
- **Official evidence:** City/Calgary Transit’s 2026 prices are $6.30, $44.10 and $63.00 for bands A/B/C: https://transit-prd.calgary.ca/news/calgary-transit-fares-changing-for-2026.html
- **Correction/regression:** Store effective year; test all three bands and annual price rollover.

### DATA-08 — Edmonton wait estimate is materially optimistic

- **Evidence labels:** Code-confirmed; Source-confirmed.
- **Affected:** `public/data.js:197`, `1599-1629`; `public/guides/edmonton-fare-assistance.html:61`; assistant detail labels this timing verified.
- **Actual:** “A couple of weeks” / 1–2 weeks.
- **Official evidence:** Current City page says typical approval waits are approximately **8–12 weeks** (then up to 10 business days for Arc package delivery): https://www.edmonton.ca/ets/subsidized-transit
- **Correction:** Separate application approval from card delivery, and advise applying well before need.
- **Regression:** Timing parser/calendar must not collapse 8–12 weeks to two weeks; slow-path UX.

### DATA-09 — ADAP contact uses the AISH status line and labels it Alberta Supports

- **Evidence labels:** Code-confirmed; Source-confirmed.
- **Affected:** `public/data.js:1255-1288`; generated guide and assistant phone.
- **Actual:** “Alberta Supports: 1-877-759-6810.”
- **Official evidence:** ADAP page lists Alberta Supports toll-free **1-877-644-9992**: https://www.alberta.ca/alberta-disability-assistance-program . Alberta’s AISH application page uses 1-877-759-6810 specifically for questions about AISH application status: https://www.alberta.ca/aish-how-to-apply
- **Correction:** Label each line by purpose; use the official combined-application/help contact supported for ADAP. Reverify routing by a non-sensitive test call if authorized.
- **Regression:** Contact-purpose snapshot per program; reject a number copied between programs without source support.

### DATA-10 — User-facing freshness is more precise and comprehensive than the evidence model

- **Evidence labels:** Code-confirmed; Source-confirmed through the stale examples above.
- **Affected:** `public/app.js:2388-2400`, `3878-3925`, `4091-4092`; `public/data.js` 22 records with daily `verified` fields; `public/i18n.js:96-98`; all benefit guides in app.
- **Actual:** 73 benefits lack `BENEFIT_VERIFIED` overrides and fall back to `DATA_VERIFIED_ISO = 2026-07-01`; “Recently verified” sorts ties by catalog order and displays July 1. Separately, 22 BC records carry exact `b.verified` dates, but both `recentlyVerifiedBenefits()` and `verifiedFor()` ignore them. The UI says every fact carries its last-verified date. Multiple claims published/changed before those asserted checks remained stale.
- **Root cause:** Three competing freshness stores (`DATA_VERIFIED_ISO`, `BENEFIT_VERIFIED`, `b.verified`) and a global fallback are treated as factual evidence.
- **Correction:** One source of truth, claim/benefit-level evidence date only after actual source review; never synthesize day 1 from a month. “Recently verified” must be driven by real per-record dates.
- **Regression:** Exact ordering using known dates; absent date shows “verification date unavailable,” not catalog date; stale current-year fixture tests for payment-period figures.

### DATA-11 — Medicine Hat official sources disagree

- **Evidence labels:** Source-confirmed ambiguity; Manual follow-up required.
- **Affected:** `public/data.js:1722-1754`; generated guide.
- **Actual:** $630 annual maximum transit subsidy.
- **Official evidence:** Current webpage says $630: https://www.medicinehat.ca/community-support-culture-safety/community-support/fair-entry/ . The City’s 2026 Fair Entry application says $635: https://www.medicinehat.ca/media/ylglovkv/2026-fair-entry-application.pdf
- **Correction:** Ask Fair Entry (403-502-8001) which applies to current approvals; retain evidence/date. Do not pick one by inference.

### DATA-12 — High-value, closely in-scope programs are absent

- **Evidence labels:** Code-confirmed absence via repository search; Source-confirmed program existence.
- **Type:** Program-integrity enhancement, not a claim that the current catalog promised exhaustiveness.
- **Examples:**
  - Alberta RAMP: up to $12,000/benefit year and $24,000/10 years: https://www.alberta.ca/residential-access-modification-program
  - BC additional Home Owner Grant for disability: total up to $845 in named urban regions/$1,045 elsewhere for 2026: https://www2.gov.bc.ca/gov/content?id=1BDE78032A6F47A7938497BC9E63BD02
  - BC Rebate for Accessible Home Adaptations: up to $20,000: https://www2.gov.bc.ca/gov/content/housing-tenancy/building-or-renovating/financial-incentives
  - Federal Home Accessibility Tax Credit and changed 2026 interaction with the medical expense credit: https://www.canada.ca/en/revenue-agency/programs/about-canada-revenue-agency-cra/federal-government-budgets/budget-2025-cra-information-select-measures.html
- **Recommendation:** Add only after program-by-program official research and regression coverage. Privacy/cost impact is low if implemented as existing static structured records; data-maintenance burden is high because amounts/rules change annually.

### DATA-13 — AISH content/matching uses an over-narrow “stops working” proxy

- **Evidence labels:** Code-confirmed; Source-confirmed tension; High confidence, requires policy clarification before correction.
- **Affected:** `public/app.js:249,252-255,834`; `public/data.js:1223-1248`.
- **Actual:** User must choose “A disability stops me from working”; content repeatedly says AISH “prevents employment.”
- **Official evidence:** Current AISH eligibility page says a medical condition “substantially limits your ability to earn a living,” is permanent, and cannot be improved by available treatment; it does not say an applicant can perform no work: https://www.alberta.ca/aish . The ADAP overview separately uses “permanently unable to work” as a general AISH/ADAP placement distinction: https://www.alberta.ca/alberta-disability-assistance-program
- **Risk:** People with intermittent/minimal work or accommodated employment may self-exclude even though AISH has employment-income rules.
- **Correction:** Do not make a lay “stops working” answer a fixed not-a-match. Ask about substantial restriction/ability to earn and leave official medical/financial determination to Alberta; reconcile the two official framings explicitly.
- **Regression:** Working a small amount, episodic work, on leave, failed work attempts, and unable-to-work paths.

### DATA-14 — AISH/CDB interaction guidance omits current mandatory action and concrete treatment

- **Evidence labels:** Code-confirmed; Source-confirmed.
- **Affected:** `public/data.js:392-399` and related AISH/CDB detail.
- **Actual:** “check how Alberta treats it alongside AISH.”
- **Official evidence:** Alberta says AISH recipients must apply for other government programs, must update AISH with CDB/DTC outcomes, and describes a $200 AISH reduction where a CDB decision was not made by February 28, 2026 (starting with April 2026 benefits): https://www.alberta.ca/index.php/aish-apply-for-federal-disability-supports
- **User harm:** Missed reporting can produce incorrect expectations or benefit administration problems; users may assume CDB is additive.
- **Correction:** Add a prominently dated Alberta interaction warning and official reporting action. Reverify how the July 2026 $204.20 CDB indexation and ADAP transition are administered before stating an offset amount beyond the official page.
- **Regression:** AISH recipient + CDB pending/approved/denied; due-date banner; no combined estimate implying both are additive.

### DATA-15 — Organization verification date is hard-coded and disagrees with records

- **Evidence labels:** Code-confirmed.
- **Affected:** `public/i18n.js:35`, `public/app.js:2269`, `public/orgs-data.js:4-25`.
- **Actual:** Every organization card says “Verified July 19, 2026”; records range July 19–21.
- **Correction:** Render `record.verified` like the grants directory; include missing/invalid-date fallback.

## Verification ledger (official sources accessed 2026-07-22)

Status reflects only the claims checked in this pass, not every sentence in that record.

| Program | High-risk claim(s) checked | Official source | Status | Notes |
|---|---|---|---|---|
| Disability Tax Credit | 2025/2026 amount/value; practitioner types; non-refundable nature | https://budget.canada.ca/update-miseajour/2026/report-rapport/tm-mf-en.html ; https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit/how-apply-dtc.html | **Outdated/misleading** | DATA-01, DATA-02 |
| Canada Disability Benefit | July 2026 maximum; September supplement; threshold concept | https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit/amount.html | **Outdated** | DATA-03; interaction also DATA-14 |
| Child Disability Benefit | $3,480/$290; $82,847 threshold; automatic with CCB/DTC; phone | https://www.canada.ca/en/revenue-agency/services/child-family-benefits/child-disability-benefit.html | Verified for checked fields | Direct support |
| RDSP grant/bond | $3,500 grant + $1,000 bond; no contribution for bond; ten-year carry-forward | https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-disability-savings-plan-rdsp/canada-disability-savings-grant-canada-disability-savings-bond.html | Verified for checked fields | Lifetime total not independently checked here |
| CPP Disability | 2026 $610.46 basic and $1,741.20 max; under 65; severe/prolonged | https://www.canada.ca/en/services/benefits/publicpensions/cpp-disability-benefit/benefit-amount.html | Verified/rounded | Structured $611/$1,741 rounding is reasonable but should label rounding |
| Canada Student Grant—Disabilities | $2,800 for 2026–27 | https://www.canada.ca/en/employment-social-development/news/2026/03/government-of-canada-extends-financial-supports-for-post-secondary-students.html | Verified | Current official extension |
| Canada Student Grant—Services/Equipment | Up to $20,000/year; application with provincial aid | https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans/disabilities-service-equipment.html | Verified for checked fields | Page older but still current; 2026 federal material also confirms amount |
| AISH | eligibility framing; combined transition; CDB interaction; contact | https://www.alberta.ca/aish ; https://www.alberta.ca/aish-how-to-apply ; https://www.alberta.ca/index.php/aish-apply-for-federal-disability-supports | **Ambiguous/unsupported in parts** | DATA-09, 13, 14 |
| ADAP | $1,740; $700 exemption; combined application; employment framing; contact | https://www.alberta.ca/alberta-disability-assistance-program | Mostly verified; contact unsupported | DATA-09 |
| AADL | 25% cost-share capped $500/year; low-income/AISH waiver; 6+ month condition | https://www.alberta.ca/aadl-eligibility-and-application-for-benefits | Verified for checked fields | Site’s “~75%” shorthand is broadly supported |
| Calgary Fair Entry | 2026 low-income transit rates; 75% recreation | https://transit-prd.calgary.ca/news/calgary-transit-fares-changing-for-2026.html ; https://www.calgary.ca/rec-locations/pools/southland-subsidy.html | **Outdated price** | DATA-07 |
| Edmonton Ride Transit/Leisure Access | $36/$51; AISH/CPP-D routes; wait | https://www.edmonton.ca/ets/subsidized-transit | **Timing outdated; matching unsupported** | DATA-04, DATA-08 |
| Red Deer Transit Fee Assistance | $34; AISH/GIS/Income Support routes | https://www.reddeer.ca/city-services/transit/fares-and-passes/transit-fare-assistance-pass/ | Verified for checked fields; matching implementation unsupported | DATA-04 |
| Lethbridge Fee Assistance | pay one month/get two; $150/season; 2/3 subsidy | https://www.lethbridge.ca/community-services-supports/community-social-development-csd/fee-assistance-program/ | Verified for checked fields | Shared proxy still invalid (DATA-04) |
| Medicine Hat Fair Entry | 75%; $200 rec; annual transit cap | webpage + current 2026 PDF listed in DATA-11 | **Ambiguous** | $630 vs $635; manual confirmation |
| Grande Prairie AISH/ADAP pass | $10.25 vs $74.25; separate from $37.13 TAP | https://cityofgp.com/roads-transportation/public-transit/transit-access-program | Verified for checked fields | Current Jan 1, 2026 table |
| St. Albert subsidy | free local fares; 65% commuter; free annual recreation for AISH/ADAP | https://stalbert.ca/city/fcss/programs-services/subsidy/ | Verified for checked fields | Direct support |
| Strathcona County | reduced Arc cap; no-cost recreation Active Pass | https://www.strathcona.ca/community-families/affordable-services/subsidized-fares/ ; https://www.strathcona.ca/community-families/affordable-services/ | Verified for checked fields; implementation proxy unsupported | DATA-04 |
| BC Disability Assistance (PWD) | $983.50 support + shelter; $2,662 both-PWD couple; earnings figures | https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/disability-assistance-rate-table ; https://news.gov.bc.ca/releases/2025SDPR0017-001110 | Verified for checked fields | Current effective Dec 1, 2025 / 2026 earnings |
| BC Autism Funding under 6 | $22,000; transition; TTE percentage | https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs | **TTE outdated** | DATA-06 |
| BC Autism Funding 6–18 | $6,000; March 31, 2027 end; TTE percentage | same as above | **TTE outdated** | DATA-06 |
| BC Children and Youth Disability Benefit | $6,500/$17,000; needs-based; transition/direct application timing | https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/financial-supports/disability-benefit | Verified for checked fields | Prefer canonical program page over news release as `source` |
| BC Bus Pass | $52-or-pass choice; fee; six-week delivery | https://www2.gov.bc.ca/gov/content/transportation/passenger-travel/buses-taxis-limos/bus-pass/people-with-disabilities ; current rate table | **Incorrect fee stream** | DATA-05 |
| BC Property Tax Deferment | prime + 2%; $60/$10 fee; compound rules for 2026 | https://www2.gov.bc.ca/gov/content/taxes/property-taxes/annual-property-tax/property-tax-deferment-program/tax-deferment-interest-fees | Verified for checked fields | Time-sensitive interest needs quarterly monitoring |
| BC Fuel Tax Refund / ICBC discount | up to $500/year; 25% basic Autoplan | https://www2.gov.bc.ca//fueltaxrefund | Verified for checked fields | Direct support |
| BC Healthy Kids | $2,000 dental/two years; annual glasses; hearing instruments | https://www2.gov.bc.ca/gov/content/health/managing-your-health/family/child-teen-health/dental-eyeglasses | Verified for checked fields | Official page old but current; should be periodically confirmed |

## Generated/visible consistency conclusions

- Incorrect source claims are consistently propagated, which is operationally worse than a single stale field:
  - CDB $200/$2,400: `public/data.js` and `public/guides/cdb-adult.html`.
  - DTC ~$10,138 “tax credit”: data, result/detail/print value path, `public/guides/dtc.html`.
  - BC Bus Pass $45: data, static guide, and assistant detail concept.
  - Autism 20% TTE: data, both static guides, assistant detail concept.
  - Calgary old prices and Edmonton old timing: data + static guides; timing is additionally asserted “verified” in assistant grounding.
- `src/benefits-context.js` contains all 84 program names and `src/links.js` declares 151 unique monitor links. I did not regenerate because the audit forbids source changes.
- `public/guides/` has 83 program pages plus index; the only benefit with no static page is the dynamic “local-supports” fallback.
- Static guide pages do not show the per-benefit verification date that About/Updates copy says guides show. App-rendered guides do show the synthetic/fallback month.

## Coverage gap and required next work

- Independently verify the remaining 58 benefits, all 18 grants, all 22 organization-directory entries, 19 supports, and 12 help organizations. Highest next priority: BC medical/health supplement caps; all nine BC municipal recreation programs; remaining Alberta municipal programs; Alberta adult/child health income limits; DRES/PDD/FSCD forms and practitioner roles; grant deadlines.
- Resolve current official conflicts by contacting the program owner (Medicine Hat is already identified).
- Run the generated link monitor report and manually inspect redirects/soft-404s in a browser. This pass reviewed link inventory/generation but did not claim all 151 live destinations passed.
- Have an Alberta benefits specialist review the AISH/ADAP placement wording and CDB offset after the July 2026 operational transition; the public pages currently use different shorthand.
- Legal review is not needed to recognize the factual discrepancies above, but any statement about statutory entitlement, appeal rights, or legal compliance should be reviewed separately.

## Recommended remediation order

1. Before release: DATA-01, 02, 04, 06, 14; then regenerate guides/context/links and test real journeys.
2. Same release if feasible: DATA-03, 05, 08, 10, 13.
3. Next iteration: DATA-09, 11; complete the remaining 58-program official-source ledger.
4. Planned catalog expansion after ROADMAP review and official research: DATA-12.
5. Maintenance cleanup: DATA-07, 15 and one authoritative verification-date model.
