# AbilityFinder initial-catalog benefit-integrity review

**Review date and official-source access date:** 2026-07-22
**Scope:** 27 assigned `BENEFITS` records plus every scalar claim in their associated `BENEFIT_VALUES`, `BENEFIT_META`, `BENEFIT_EXTRA`, and `BENEFIT_SIGNERS` entries; relevant executable requirements/result logic; and four linked practitioner-form labels.
**Repository changes:** none. This report and its CSV are audit artifacts under `/tmp/abilityfinder-audit` only.

## Deliverables and method

- Claim ledger: `/tmp/abilityfinder-audit/initial-catalog-claims.csv`
- Machine-readable counts: `/tmp/abilityfinder-audit/initial-ledger-counts.json`
- Source snapshot used to enumerate records: `/tmp/abilityfinder-audit/initial-target-records.json`
- This expanded findings report: `/tmp/abilityfinder-audit/initial-catalog-expanded.md`

The ledger contains one row for every non-null scalar leaf in the selected records and associated maps. It additionally contains 19 rows expressing the user-visible meaning of executable requirements/evaluator logic and four practitioner-form rows. This is a reproducible inclusion rule, not a hand-selected sample. Questions in FAQ objects and internal display classifications are included even when they are not independently falsifiable program facts.

Statuses are conservative:

- **Verified**: a current official source directly supports the claim or the row is an internal, non-factual display field that is accurately represented.
- **Outdated**: current official information supersedes the claim.
- **Unsupported**: no official support was found, the claim is materially broader than the official rule, or executable logic treats an unestablished condition as established.
- **Ambiguous**: current official sources conflict or the wording cannot safely be resolved without clarification.
- **Manual follow-up required**: project-authored estimates/advice, freshness attestations without retained claim-level evidence, or facts for which the source does not publish a service standard.

`Verified` is not a certification of the entire benefit. A benefit can have verified amount rows while its matcher is incomplete or unsafe. Conversely, `Manual follow-up required` does not necessarily mean wrong; it means the official source does not directly establish the exact wording.

## Reconciled coverage and counts

Structural checks: 925 data rows; 27 unique record IDs; 0 empty claim cells; 0 empty official-source cells; 0 invalid statuses; 0 duplicate `(record, location, claim)` rows.

| Record | Total | Verified | Outdated | Unsupported | Ambiguous | Manual follow-up |
|---|---:|---:|---:|---:|---:|---:|
| `dtc` | 74 | 49 | 4 | 16 | 1 | 4 |
| `cdb-adult` | 37 | 24 | 6 | 2 | 0 | 5 |
| `child-disability-benefit` | 32 | 25 | 0 | 3 | 0 | 4 |
| `rdsp` | 40 | 28 | 0 | 7 | 0 | 5 |
| `cpp-disability` | 51 | 41 | 0 | 4 | 0 | 6 |
| `csg-disability` | 27 | 20 | 0 | 2 | 0 | 5 |
| `csg-dse` | 27 | 19 | 0 | 2 | 0 | 6 |
| `aish` | 53 | 43 | 1 | 2 | 0 | 7 |
| `adap` | 46 | 37 | 0 | 2 | 0 | 7 |
| `aadl` | 30 | 23 | 0 | 1 | 0 | 6 |
| `calgary-fair-entry` | 27 | 17 | 4 | 1 | 0 | 5 |
| `edmonton-fare-assistance` | 26 | 17 | 2 | 3 | 0 | 4 |
| `reddeer-fee-assistance` | 29 | 22 | 0 | 0 | 0 | 7 |
| `lethbridge-fee-assistance` | 28 | 20 | 0 | 1 | 0 | 7 |
| `medicinehat-fair-entry` | 27 | 18 | 0 | 0 | 3 | 6 |
| `grandeprairie-aish-pass` | 27 | 19 | 0 | 3 | 0 | 5 |
| `stalbert-subsidy` | 27 | 20 | 0 | 1 | 0 | 6 |
| `strathcona-subsidy` | 27 | 21 | 0 | 0 | 0 | 6 |
| `bc-healthy-kids` | 33 | 24 | 0 | 2 | 0 | 7 |
| `bc-disability-assistance-pwd` | 36 | 27 | 0 | 2 | 0 | 7 |
| `bc-autism-funding-under-6` | 34 | 25 | 2 | 1 | 0 | 6 |
| `bc-autism-funding-6-18` | 33 | 24 | 1 | 1 | 0 | 7 |
| `bc-cy-disability-benefit` | 31 | 22 | 0 | 2 | 0 | 7 |
| `bc-bus-pass` | 29 | 18 | 1 | 3 | 0 | 7 |
| `bc-fuel-tax-refund-disabilities` | 32 | 24 | 0 | 1 | 0 | 7 |
| `bc-icbc-disability-discount` | 29 | 21 | 0 | 1 | 0 | 7 |
| `bc-property-tax-deferment-disabilities` | 33 | 24 | 0 | 2 | 0 | 7 |
| **Total** | **925** | **672** | **21** | **65** | **4** | **163** |

## Release-significant findings

The following findings are Code-confirmed and/or Source-confirmed. Exact affected claim rows, source URLs, access dates, and corrections are in the CSV.

### DATA-25 — DTC is “ready” for every completed profile

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy, Defect
- **Affected users:** Every user who completes the questionnaire, especially anyone planning around DTC-dependent programs.
- **Affected code:** `public/app.js:202-203` (`REQS.prolonged` and `REQS.certifier`); `public/data.js:917` DTC requirements.
- **Evidence:** Code-confirmed. Both predicates return `true`, so the two DTC requirements cannot fail or be one-step-away. Official CRA criteria require a severe and prolonged impairment, a marked restriction/cumulative effect or qualifying life-sustaining therapy, and certification by an authorized practitioner for the relevant functional category.
- **Reproduction:** Complete any profile, including one with no reported functional limitation; inspect DTC result status. The evaluator receives two met requirements and shows ready.
- **Expected:** The site must not imply the official DTC functional-impact criteria have been established when they were never asked or computed.
- **Actual:** DTC is universally ready.
- **Root cause:** Placeholder predicates were made executable and are presented as eligibility evidence.
- **Correction:** Until the questionnaire can accurately represent the official tests, use an explicit “eligibility not determined—review these criteria” status. Do not substitute diagnosis or generic practitioner access.
- **Verification/regression:** Unit-test no-limitation, one limitation, life-sustaining-therapy, cumulative-effects, and incomplete profiles; assert that no unasked criterion is `met` and that result/print/detail views agree.
- **Official sources:** CRA DTC overview and current DTC application pages, accessed 2026-07-22.

### DATA-38 — CPP contribution sufficiency is inferred from work-status answers

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy, Defect
- **Affected users:** People unable to work who have insufficient CPP contribution history, and workers whose contribution record is unknown.
- **Affected code:** `public/app.js:251` (`REQS.cppContrib`), CPP-D record at `public/data.js:1106`.
- **Evidence:** Code-confirmed and Source-confirmed. The predicate treats current work or selecting “unable to work” as evidence of sufficient CPP contributions. Service Canada instead requires contributions in 4 of the last 6 years, or 3 of the last 6 after at least 25 years of contributions.
- **Reproduction:** Select unable to work without entering any contribution record. CPP-D can be ready even though no contribution evidence exists.
- **Correction:** Never infer contribution history. Ask users to check their CPP Statement of Contributions and keep the criterion unknown unless confirmed.
- **Regression:** Explicit cases for 4/6, 3/6 plus 25 years, insufficient, and unknown history.
- **Official source:** Canada CPP disability eligibility page, accessed 2026-07-22.

### DATA-28 — Grande Prairie and St. Albert city residence alone produces ready status

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy, Defect
- **Affected users:** Residents not receiving AISH/ADAP and not meeting the relevant income program.
- **Affected code:** `public/data.js:1766` and `public/data.js:1801` `requires` lists; evaluator in `public/app.js:525-544`.
- **Evidence:** Code-confirmed and Source-confirmed. These records require only the city key, while the services require actual AISH/ADAP receipt or a separate income-tested access route. The Grande Prairie “deepest in the province” and “more generous than most” comparisons also lack a maintained complete official comparison.
- **Reproduction:** Choose either municipality with no disability-income receipt/low-income basis. The program is ready based only on residence.
- **Correction:** Require actual program receipt or assess the separate income route; remove unmaintained province-wide comparisons.
- **Regression:** City resident/nonrecipient, program recipient, income-route applicant, and incomplete-state cases.

### DATA-49 — BC fuel-tax and ICBC eligibility use an overbroad disability proxy

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy, Defect
- **Affected users:** BC users with any physical or vision limitation or a transit barrier who do not meet the enumerated statutory/program criteria.
- **Affected code:** `public/app.js:355-358` (`REQS.vehicleDisability`); fuel-tax and ICBC records.
- **Evidence:** Code-confirmed and Source-confirmed. The predicate accepts any physical limitation, any vision limitation, or a self-selected transit barrier. The official refund program uses specific certification/registration routes; the ICBC discount depends on confirmed Fuel Tax Refund Program registration.
- **Correction:** Model the enumerated routes or keep the criterion unknown; require confirmed program registration for ICBC.
- **Regression:** Include qualifying/nonqualifying mobility limitation, nonqualifying low vision, qualifying vision criterion, hazardous-transit route, and registration absent/present.

### DATA-26 — DTC is described and ranked as a universal “master key”

- **Severity / priority / confidence / type:** Medium / P1 / Confirmed / UX, Data accuracy
- **Affected users:** Users under cognitive/financial pressure who may delay a higher-value or time-sensitive application.
- **Affected code/content:** `public/data.js:917` summary/about; `public/app.js:472-484` fixed `+12` priority boost; related help copy.
- **Evidence:** Code-confirmed. The site says DTC “unlocks most,” is the “single most important step,” and receives a fixed priority boost because it “unlocks the rest.” Only 4 of 84 catalog entries use the DTC requirement (`cdb-adult`, child disability benefit, RDSP, and the CWB disability supplement). Official sources establish those dependencies but do not support a universal application ranking.
- **Actual harm:** A user eligible for CPP-D, AISH/ADAP, municipal support, equipment, or a time-limited program may be told to prioritize DTC despite no evidence this is best for them.
- **Correction:** Name the specific DTC-linked programs; explain sequencing only where a dependency exists; rank using urgency, deadlines, prerequisite status, and user-specific value rather than a universal gateway bonus.
- **Regression:** Assert that priority order is explainable from explicit dependencies and that unrelated benefits are not displaced by DTC solely because of the fixed bonus.

### DATA-33 — Canada Disability Benefit matcher omits mandatory eligibility and models income as binary

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy
- **Affected:** CDB adult result and amount expectations.
- **Evidence:** Official eligibility also depends on tax residency/status and filed applicant/spouse returns. The amount uses a graduated income formula, not a rough low-income yes/no boundary. Current July 2026–June 2027 maximum is $204.20/month, with indexed working-income exemptions $10,210/$14,294 and a separate September 2026 $150 DTC-cost supplement.
- **Correction:** Add/retain unknown states for mandatory criteria and calculate only as an estimate from official formula inputs; never turn a rough questionnaire band into a definitive no-match.

### DATA-35 — Child Disability Benefit matcher omits CCB eligibility

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy
- **Evidence:** The record treats child age plus DTC as enough; the official program also requires Canada Child Benefit eligibility. “Added to your next CCB payment” is not a guaranteed processing outcome; CRA automatically recalculates current and two prior benefit years after eligibility is established.
- **Correction/regression:** Require or explicitly condition on CCB eligibility; test CCB yes/no/unknown independently of DTC.

### DATA-36 / DATA-37 — RDSP readiness and age rules conflate account access with grants/bonds

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy
- **Evidence:** The headline advertises up to $4,500/year in grant+bond with an under-60 requirement. Grants/bonds are available only through the year the beneficiary turns 49; opening/contributing may continue through the year they turn 59. Residency and valid SIN are also mandatory. “Most banks or credit unions,” “same-day,” and “~1 hr” are unsupported service claims.
- **Correction:** Separate plan-opening, contribution, grant, and bond outcomes. Add Canadian residency/SIN conditions and official issuer guidance. Test boundaries at 49/50 and 59/60.

### DATA-39 / DATA-40 / DATA-41 — Student-grant matchers and documentation guidance are incomplete

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy
- **Evidence:** Both grants require financial need, a qualifying program, a designated institution, and recognized disability documentation. CSG-DSE also requires exceptional disability-related costs supported by estimates/recommendations and receipts. “Documentation once” omits persistent/prolonged disability re-verification/attestation and Schedule 4 exceptions. Alberta identifies disability-related transportation through a provincial-grant route, so listing it as a federal CSG-DSE expense is unsupported.
- **Correction:** Keep readiness conditional on unasked mandatory criteria; distinguish the two grants and Alberta’s administration rules.

### DATA-42 / DATA-43 / DATA-44 — AISH, ADAP and AADL ready statuses omit core official gates

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy
- **Evidence:** AISH also requires full financial/assets/spouse assessment, not being OAS-eligible, institutional exclusions, applying for other income, and medical adjudication. ADAP requires a severe disability that significantly impedes employment continuously or episodically; any “documented disability” is not enough. AADL requires valid AHCIP, a six-month/chronic or terminal need, clinical assessment, an approved item/vendor, and no comparable payer.
- **Correction:** Missing mandatory criteria must remain unknown/conditional rather than `met` or be explicitly asked. AADL should be marked as involving a clinical assessor.
- **Important source change:** The current Alberta AISH page now says the severe disability “permanently prevents you from employment.” An earlier audit theory that this work-impact wording was necessarily too narrow (`DATA-13`) is not supported by the official page accessed 2026-07-22 and should be withdrawn/reframed. In contrast, the `BENEFIT_EXTRA[aish].confirm` phrase “substantially limits your ability to earn” is now stale (`DATA-46`).

### DATA-45 / DATA-04 — Shared municipal low-income/disability proxies do not implement municipal rules

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy
- **Evidence:** A shared under-about-$35,000 household band and a `lowIncomeOrDisabilityIncome` proxy are reused across municipal programs with household-size thresholds or enumerated benefit-recipient categories. DTC approval or self-reported inability to work does not prove receipt of AISH, CPP-D, or another municipality-accepted category.
- **Correction:** Ask for actual program receipt where the municipality uses categorical eligibility; otherwise use maintained household-size thresholds or leave eligibility conditional.

### DATA-30 — BC Healthy Kids matcher excludes part of the official income range

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy, UX
- **Evidence:** The official adjusted-net-income threshold is under $42,000 for MSP supplementary-benefit eligibility, while the shared site band treats roughly $35,000 and above as not low income. The summary says “Free basic dental,” although providers may charge above the program fee schedule.
- **Correction:** Use the official adjusted-net-income/supplementary-benefit test; say “coverage toward basic dental” and disclose potential extra charges.

### DATA-47 / DATA-48 / DATA-50 — BC PWD, child transition and property-deferral matchers overstate readiness

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy
- **Evidence:** BC PWD remains conditional on ministry family-unit income/assets and the three-part designation process; no public service standard was found for the “days/weeks-to-months” timing. The new child/youth disability route is overgeneralized: Autism Funding requires an eligible autism diagnosis and SAET requires At Home Program eligibility. Property deferral additionally requires Canadian/PR status, one-year BC residency, registered ownership, principal-residence/property rules, cleared arrears, and 25% equity.
- **Correction:** Preserve unknown criteria, qualify transition routes, and remove unsupported processing promises.

## Outdated or ambiguous headline facts

- **DATA-01 (Medium/P1):** DTC `BENEFIT_VALUES` publishes a universal $1,500–$2,700 annual range and $25,000 retroactive maximum. The official 2026 DTC amount is a $10,341 tax-base amount; the maximum federal tax reduction is $1,448. Provincial tax effects and unused-credit transfers vary, so a universal combined saving/retroactive maximum is unsupported.
- **DATA-03 (High/P1):** CDB adult still says $200/month/$2,400/year and $10,000/$14,000 working exemptions. Current July 2026–June 2027 figures are $204.20/month and $10,210/$14,294; September 2026 includes a separate $150 DTC-cost supplement.
- **DATA-07 (Medium/P1):** Calgary Fair Entry uses 2025 prices. Current 2026 bands are $6.30, $44.10, and $63.00.
- **DATA-08 (Medium/P1):** Edmonton presents a universal $36 fare cap and 1–2 week timing. Current caps are $36 or $51 depending on route; the City says approximately 8–12 weeks, plus up to 10 business days for Arc delivery.
- **DATA-06 (Medium/P1):** Both BC Autism Funding records state a 20% training/travel/equipment limit. The current final-period allowance is up to 50% during transition.
- **DATA-05 (Medium/P1):** BC Bus Pass says $45/year for PWD users. The official PWD route has no annual fee; recipients choose the pass instead of the $52 monthly transportation supplement. The $45 fee applies to listed senior/other streams.
- **DATA-11 (Medium/P1, ambiguous):** Medicine Hat’s current webpage says a $630 maximum annual transit subsidy while its 2026 application PDF says $635. The site must not select one without clarification from the program owner.
- **DATA-27 (Medium/P1):** DTC step “Submit through CRA My Account” is outdated. As of 2026-07-14, CRA Account “Submit Documents” does not accept DTC applications; the current digital Part A/reference-number flow submits automatically, or the current paper T2201 is mailed. The fixed “about 8 weeks” must be tied to CRA’s live targeted processing tool and distinguish tax adjustments.
- **DATA-09 (Medium/P1):** `1-877-759-6810` is the Disability Income Assistance application-status line, not the general Alberta Supports help number. Alberta Supports online-application help is `1-877-644-9992`.
- **DATA-34 (Low/P2):** CDB adult uses generic 1-800-O-Canada. The dedicated CDB contact is `1-833-486-3007`, with official TTY/VRS options.

## Other unsupported high-impact guidance

- **DATA-02 (Medium/P1):** DTC practitioner copy collapses an impairment-specific matrix. Doctors and nurse practitioners cover all listed functions; optometrists, audiologists, occupational therapists, physiotherapists, psychologists, and speech-language pathologists certify only their authorized categories. The current signer array is also incomplete because it omits OT, PT, and SLP.
- **DATA-31 (Medium/P1):** DTC “or would, without therapy” is too broad. The official alternative is the detailed life-sustaining-therapy test, not ordinary treatment response.
- **DATA-32 (Medium/P1):** “Yes—transfer it to a supporting family member” omits that only an unused amount can be transferred and only to a qualifying supporting person under CRA rules.
- **DATA-14 (Medium/P1):** CDB/AISH interaction copy says to “check” Alberta treatment rather than giving a sourced, current reporting/action statement. This is actionable sequencing information and should not remain vague.
- Unquantified “many are approved,” “most transitioning families see an increase,” “private assessment is faster,” comparative municipal superlatives, and precise effort/timing estimates have no direct current official support. They should be removed, explicitly labelled as project estimates, or backed by maintained evidence.

## Official sources used (all accessed 2026-07-22)

The exact source set is repeated per row in the CSV. Primary pages included:

- CRA DTC overview/application pages and the Government of Canada 2026 tax-measures table.
- Government of Canada CDB eligibility, amount, application, and contact pages.
- CRA Child Disability Benefit page.
- Government of Canada RDSP and grant/bond pages.
- Service Canada CPP disability eligibility, amount, and application pages.
- Government of Canada disability student-grant pages and Alberta Student Aid disability-documentation guidance.
- Alberta AISH eligibility, combined AISH/ADAP application, ADAP, and AADL pages.
- Official Calgary, Edmonton, Red Deer, Lethbridge, Medicine Hat, Grande Prairie, St. Albert, and Strathcona County program pages; Medicine Hat’s official 2026 PDF.
- Official BC Healthy Kids, disability assistance/rate table, Autism Funding/transition, child and youth disability benefit, Bus Pass/rate table, Fuel Tax Refund, and Property Tax Deferment pages.

No aggregators, blogs, social-media posts, search snippets, or other municipalities were used as program authority.

## Limitations and required follow-up

- This deliverable covers the 27 records assigned to this review, not the remainder of the full catalog.
- Current official pages were verified, but official sources sometimes do not publish processing times, applicant-experience claims, comparative rankings, or local intake nuances. Those rows are marked Manual follow-up or Unsupported rather than guessed.
- Medicine Hat must directly reconcile its live webpage/PDF discrepancy.
- Real applicants and program staff should validate cognitive clarity and practical application sequencing; source verification alone cannot prove usability.
- Legal interpretation was not undertaken. Findings compare user-facing claims and executable matching to current official program-owner statements; they do not assert statutory legal compliance.
