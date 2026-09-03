# Benefit Readability Report

**Date:** 2026-09-02

This non-blocking report checks the user-facing prose stored for every benefit. It includes each benefit's summary, note, requirements note, detail description, tips, and eligibility items/note. It excludes amounts, URLs, tables, IDs, procedural step lists, and other structured data. The checker splits sentences at periods, exclamation marks, and question marks; counts whitespace-separated words after removing surrounding punctuation; and estimates syllables from vowel runs with a silent-final-e adjustment. Flesch–Kincaid grades and average sentence lengths are rounded to one decimal place.

The thresholds are guidance for finding content to review, not build gates:

- **Flesch–Kincaid grade ≤ 9.** This is an operational proxy for the lower-secondary reading-level direction in [WCAG 2.1 Success Criterion 3.1.5](https://www.w3.org/WAI/WCAG21/Understanding/reading-level.html). WCAG 3.1.5 is Level AAA and calls for supplemental content or a simpler version when text requires reading ability above lower-secondary level.
- **Average sentence length ≤ 20 words.** The [Canada.ca Content Style Guide](https://design.canada.ca/style-guide/) advises aiming for an average sentence length of 15 to 20 words.
- **Longest sentence ≤ 25 words.** [GOV.UK content design guidance](https://www.gov.uk/guidance/content-design/writing-for-gov-uk) recommends sentences of 25 words or fewer as a plain-language benchmark.

A benefit is flagged when it exceeds any one of these targets.

## All benefits, highest FK grade first

| id | level | FK grade | avg sentence | longest sentence | flagged? |
|---|---|---:|---:|---:|:---:|
| bc-monthly-nutritional-supplement | British Columbia | 21.2 | 33.4 | 43 | Yes |
| bc-cy-disability-benefit | British Columbia | 20.1 | 30.4 | 71 | Yes |
| bc-clbc | British Columbia | 19.3 | 29.5 | 67 | Yes |
| bc-autism-funding-6-18 | British Columbia | 17.9 | 32.9 | 100 | Yes |
| kamloops-arch | Kamloops | 17.3 | 29.4 | 108 | Yes |
| bc-fuel-tax-refund-disabilities | British Columbia | 17.3 | 28.5 | 74 | Yes |
| bc-pwd-designation | British Columbia | 17.2 | 28.2 | 57 | Yes |
| vancouver-leisure-access | Vancouver | 17.1 | 32.6 | 104 | Yes |
| bc-pharmacare-plan-c | British Columbia | 17.0 | 27.1 | 58 | Yes |
| bc-autism-funding-under-6 | British Columbia | 16.9 | 29.2 | 97 | Yes |
| dres | Alberta | 16.7 | 18.8 | 35 | Yes |
| bc-dental-supplement | British Columbia | 16.4 | 26.1 | 53 | Yes |
| bc-medical-equipment-devices | British Columbia | 16.2 | 25.1 | 39 | Yes |
| bc-healthy-kids | British Columbia | 15.8 | 23.6 | 61 | Yes |
| bc-property-tax-deferment-disabilities | British Columbia | 15.7 | 26.5 | 103 | Yes |
| ab-grant-disability | Alberta | 15.6 | 19.5 | 30 | Yes |
| surrey-leisure-access | Surrey | 15.5 | 28.3 | 61 | Yes |
| richmond-rec-fee-subsidy | Richmond | 15.1 | 25.9 | 34 | Yes |
| fscd | Alberta | 15.1 | 17.3 | 31 | Yes |
| kelowna-recreation-assistance | Kelowna | 15.0 | 24.1 | 38 | Yes |
| multigenerational-home-renovation-tax-credit | Federal | 14.8 | 28.4 | 75 | Yes |
| bc-learning-disability-assessment-bursary | British Columbia | 14.7 | 16.3 | 38 | Yes |
| burnaby-fair-play | Burnaby | 14.3 | 24.2 | 45 | Yes |
| bc-at-home-saet | British Columbia | 14.3 | 19.6 | 62 | Yes |
| leduc-subsidies | Leduc | 14.3 | 16.6 | 24 | Yes |
| bc-at-home-medical | British Columbia | 14.2 | 26.0 | 53 | Yes |
| fortsask-access | Fort Saskatchewan | 14.1 | 15.8 | 21 | Yes |
| lloydminster-recreation-access | Lloydminster | 14.1 | 11.2 | 15 | Yes |
| csg-dse | Federal | 13.9 | 17.0 | 29 | Yes |
| coquitlam-far | Coquitlam | 13.8 | 25.8 | 59 | Yes |
| bc-medical-transportation | British Columbia | 13.8 | 18.6 | 47 | Yes |
| pdd | Alberta | 13.8 | 14.8 | 25 | Yes |
| bc-icbc-disability-discount | British Columbia | 13.7 | 21.5 | 40 | Yes |
| dtc | Federal | 13.7 | 21.3 | 53 | Yes |
| home-accessibility-tax-credit | Federal | 13.5 | 28.1 | 99 | Yes |
| ab-special-needs-housing | Alberta | 13.5 | 19.4 | 47 | Yes |
| adap | Alberta | 13.4 | 18.3 | 32 | Yes |
| bc-bus-pass | British Columbia | 13.3 | 22.8 | 82 | Yes |
| bc-supported-child-development | British Columbia | 13.3 | 18.7 | 43 | Yes |
| adult-health-benefit | Alberta | 13.3 | 18.5 | 23 | Yes |
| bc-optical-supplement | British Columbia | 13.3 | 17.6 | 30 | Yes |
| bc-csg-services-equipment | British Columbia | 13.3 | 14.7 | 32 | Yes |
| bc-csg-students-disabilities | British Columbia | 13.1 | 15.4 | 39 | Yes |
| csg-disability | Federal | 13.0 | 14.8 | 22 | Yes |
| edmonton-fare-assistance | Edmonton | 12.7 | 14.5 | 25 | Yes |
| handycard-translink | Metro Vancouver | 12.6 | 18.1 | 40 | Yes |
| excise-gasoline-tax-refund | Federal | 12.4 | 20.1 | 41 | Yes |
| bc-work-able-internship | British Columbia | 12.4 | 15.4 | 27 | Yes |
| canmore-affordable-services | Canmore | 12.4 | 14.2 | 19 | Yes |
| bc-fair-pharmacare | British Columbia | 12.3 | 19.3 | 58 | Yes |
| bc-assistance-program-students-disabilities | British Columbia | 12.3 | 14.1 | 41 | Yes |
| child-health-benefit | Alberta | 12.2 | 18.3 | 30 | Yes |
| victoria-life | Victoria | 12.1 | 21.5 | 64 | Yes |
| aish | Alberta | 12.1 | 17.4 | 32 | Yes |
| bc-msp-supplementary-benefits | British Columbia | 12.0 | 22.8 | 106 | Yes |
| ramp | Alberta | 12.0 | 21.5 | 52 | Yes |
| bc-workbc-employment-services | British Columbia | 12.0 | 14.5 | 46 | Yes |
| handydart-bctransit | British Columbia | 11.9 | 17.2 | 55 | Yes |
| bc-workbc-assistive-technology | British Columbia | 11.9 | 11.5 | 34 | Yes |
| taxisaver-translink | Metro Vancouver | 11.8 | 18.0 | 38 | Yes |
| bc-raha | British Columbia | 11.8 | 17.9 | 58 | Yes |
| canadian-dental-care-plan | Federal | 11.7 | 23.8 | 69 | Yes |
| woodbuffalo-lift | Fort McMurray | 11.7 | 17.4 | 38 | Yes |
| bc-pharmacare-plan-p | British Columbia | 11.6 | 20.0 | 80 | Yes |
| taxi-saver-bctransit | British Columbia | 11.5 | 17.7 | 45 | Yes |
| bc-disability-assistance-pwd | British Columbia | 11.4 | 22.1 | 81 | Yes |
| bc-pharmacare-plan-g | British Columbia | 11.4 | 20.9 | 122 | Yes |
| cpp-childrens-benefit | Federal | 11.4 | 19.6 | 48 | Yes |
| ab-capcc | Alberta | 11.4 | 16.9 | 40 | Yes |
| airdrie-fair-access | Airdrie | 11.3 | 19.4 | 25 | Yes |
| ab-service-dog-id-card | Alberta | 11.2 | 19.9 | 54 | Yes |
| aadl | Alberta | 11.2 | 17.3 | 35 | Yes |
| disability-supports-deduction | Federal | 11.1 | 24.2 | 63 | Yes |
| strathcona-subsidy | Sherwood Park | 11.1 | 17.7 | 24 | Yes |
| bc-home-reno-tax-credit | British Columbia | 11.1 | 16.1 | 39 | Yes |
| medical-expense-tax-credit | Federal | 11.0 | 22.6 | 81 | Yes |
| bc-fnha-health-benefits | British Columbia | 11.0 | 16.5 | 85 | Yes |
| okotoks-fee-assistance | Okotoks | 11.0 | 13.0 | 21 | Yes |
| lethbridge-fee-assistance | Lethbridge | 10.9 | 18.9 | 35 | Yes |
| canada-caregiver-credit | Federal | 10.7 | 24.1 | 64 | Yes |
| cochrane-connect-card | Cochrane | 10.7 | 13.3 | 24 | Yes |
| child-disability-benefit | Federal | 10.6 | 15.0 | 23 | Yes |
| stalbert-subsidy | St. Albert | 10.3 | 16.4 | 29 | Yes |
| bc-access-grant-students-disabilities | British Columbia | 10.3 | 7.9 | 33 | Yes |
| parking-placard | Alberta | 10.2 | 14.8 | 20 | Yes |
| local-supports | Your community | 10.2 | 13.5 | 24 | Yes |
| cdb-adult | Federal | 10.0 | 17.5 | 29 | Yes |
| bc-additional-home-owner-grant | British Columbia | 10.0 | 17.1 | 53 | Yes |
| bc-supplemental-bursary-students-disabilities | British Columbia | 10.0 | 13.5 | 38 | Yes |
| medicinehat-fair-entry | Medicine Hat | 9.9 | 16.9 | 33 | Yes |
| sparc-parking-permit | British Columbia | 9.6 | 14.2 | 30 | Yes |
| bc-access-grant-deaf-students | British Columbia | 9.6 | 11.1 | 38 | Yes |
| sprucegrove-low-income-transit | Spruce Grove area | 9.2 | 11.4 | 19 | Yes |
| handydart-translink | Metro Vancouver | 9.1 | 12.4 | 59 | Yes |
| reddeer-fee-assistance | Red Deer | 9.0 | 14.7 | 22 | No |
| saanich-life | Saanich | 8.9 | 13.5 | 64 | Yes |
| cpp-disability | Federal | 8.8 | 15.0 | 31 | Yes |
| cwb-disability | Federal | 8.7 | 17.2 | 22 | No |
| rdsp | Federal | 7.8 | 16.5 | 29 | Yes |
| calgary-fair-entry | Calgary | 7.6 | 8.7 | 28 | Yes |
| bc-sales-tax-credit | British Columbia | 6.9 | 15.3 | 36 | Yes |
| grandeprairie-aish-pass | Grande Prairie | 6.8 | 10.0 | 25 | No |

## Flagged

- `bc-monthly-nutritional-supplement` — FK grade 21.2 > 9; average sentence 33.4 > 20 words; longest sentence 43 > 25 words
- `bc-cy-disability-benefit` — FK grade 20.1 > 9; average sentence 30.4 > 20 words; longest sentence 71 > 25 words
- `bc-clbc` — FK grade 19.3 > 9; average sentence 29.5 > 20 words; longest sentence 67 > 25 words
- `bc-autism-funding-6-18` — FK grade 17.9 > 9; average sentence 32.9 > 20 words; longest sentence 100 > 25 words
- `kamloops-arch` — FK grade 17.3 > 9; average sentence 29.4 > 20 words; longest sentence 108 > 25 words
- `bc-fuel-tax-refund-disabilities` — FK grade 17.3 > 9; average sentence 28.5 > 20 words; longest sentence 74 > 25 words
- `bc-pwd-designation` — FK grade 17.2 > 9; average sentence 28.2 > 20 words; longest sentence 57 > 25 words
- `vancouver-leisure-access` — FK grade 17.1 > 9; average sentence 32.6 > 20 words; longest sentence 104 > 25 words
- `bc-pharmacare-plan-c` — FK grade 17.0 > 9; average sentence 27.1 > 20 words; longest sentence 58 > 25 words
- `bc-autism-funding-under-6` — FK grade 16.9 > 9; average sentence 29.2 > 20 words; longest sentence 97 > 25 words
- `dres` — FK grade 16.7 > 9; longest sentence 35 > 25 words
- `bc-dental-supplement` — FK grade 16.4 > 9; average sentence 26.1 > 20 words; longest sentence 53 > 25 words
- `bc-medical-equipment-devices` — FK grade 16.2 > 9; average sentence 25.1 > 20 words; longest sentence 39 > 25 words
- `bc-healthy-kids` — FK grade 15.8 > 9; average sentence 23.6 > 20 words; longest sentence 61 > 25 words
- `bc-property-tax-deferment-disabilities` — FK grade 15.7 > 9; average sentence 26.5 > 20 words; longest sentence 103 > 25 words
- `ab-grant-disability` — FK grade 15.6 > 9; longest sentence 30 > 25 words
- `surrey-leisure-access` — FK grade 15.5 > 9; average sentence 28.3 > 20 words; longest sentence 61 > 25 words
- `richmond-rec-fee-subsidy` — FK grade 15.1 > 9; average sentence 25.9 > 20 words; longest sentence 34 > 25 words
- `fscd` — FK grade 15.1 > 9; longest sentence 31 > 25 words
- `kelowna-recreation-assistance` — FK grade 15.0 > 9; average sentence 24.1 > 20 words; longest sentence 38 > 25 words
- `multigenerational-home-renovation-tax-credit` — FK grade 14.8 > 9; average sentence 28.4 > 20 words; longest sentence 75 > 25 words
- `bc-learning-disability-assessment-bursary` — FK grade 14.7 > 9; longest sentence 38 > 25 words
- `burnaby-fair-play` — FK grade 14.3 > 9; average sentence 24.2 > 20 words; longest sentence 45 > 25 words
- `bc-at-home-saet` — FK grade 14.3 > 9; longest sentence 62 > 25 words
- `leduc-subsidies` — FK grade 14.3 > 9
- `bc-at-home-medical` — FK grade 14.2 > 9; average sentence 26.0 > 20 words; longest sentence 53 > 25 words
- `fortsask-access` — FK grade 14.1 > 9
- `lloydminster-recreation-access` — FK grade 14.1 > 9
- `csg-dse` — FK grade 13.9 > 9; longest sentence 29 > 25 words
- `coquitlam-far` — FK grade 13.8 > 9; average sentence 25.8 > 20 words; longest sentence 59 > 25 words
- `bc-medical-transportation` — FK grade 13.8 > 9; longest sentence 47 > 25 words
- `pdd` — FK grade 13.8 > 9
- `bc-icbc-disability-discount` — FK grade 13.7 > 9; average sentence 21.5 > 20 words; longest sentence 40 > 25 words
- `dtc` — FK grade 13.7 > 9; average sentence 21.3 > 20 words; longest sentence 53 > 25 words
- `home-accessibility-tax-credit` — FK grade 13.5 > 9; average sentence 28.1 > 20 words; longest sentence 99 > 25 words
- `ab-special-needs-housing` — FK grade 13.5 > 9; longest sentence 47 > 25 words
- `adap` — FK grade 13.4 > 9; longest sentence 32 > 25 words
- `bc-bus-pass` — FK grade 13.3 > 9; average sentence 22.8 > 20 words; longest sentence 82 > 25 words
- `bc-supported-child-development` — FK grade 13.3 > 9; longest sentence 43 > 25 words
- `adult-health-benefit` — FK grade 13.3 > 9
- `bc-optical-supplement` — FK grade 13.3 > 9; longest sentence 30 > 25 words
- `bc-csg-services-equipment` — FK grade 13.3 > 9; longest sentence 32 > 25 words
- `bc-csg-students-disabilities` — FK grade 13.1 > 9; longest sentence 39 > 25 words
- `csg-disability` — FK grade 13.0 > 9
- `edmonton-fare-assistance` — FK grade 12.7 > 9
- `handycard-translink` — FK grade 12.6 > 9; longest sentence 40 > 25 words
- `excise-gasoline-tax-refund` — FK grade 12.4 > 9; average sentence 20.1 > 20 words; longest sentence 41 > 25 words
- `bc-work-able-internship` — FK grade 12.4 > 9; longest sentence 27 > 25 words
- `canmore-affordable-services` — FK grade 12.4 > 9
- `bc-fair-pharmacare` — FK grade 12.3 > 9; longest sentence 58 > 25 words
- `bc-assistance-program-students-disabilities` — FK grade 12.3 > 9; longest sentence 41 > 25 words
- `child-health-benefit` — FK grade 12.2 > 9; longest sentence 30 > 25 words
- `victoria-life` — FK grade 12.1 > 9; average sentence 21.5 > 20 words; longest sentence 64 > 25 words
- `aish` — FK grade 12.1 > 9; longest sentence 32 > 25 words
- `bc-msp-supplementary-benefits` — FK grade 12.0 > 9; average sentence 22.8 > 20 words; longest sentence 106 > 25 words
- `ramp` — FK grade 12.0 > 9; average sentence 21.5 > 20 words; longest sentence 52 > 25 words
- `bc-workbc-employment-services` — FK grade 12.0 > 9; longest sentence 46 > 25 words
- `handydart-bctransit` — FK grade 11.9 > 9; longest sentence 55 > 25 words
- `bc-workbc-assistive-technology` — FK grade 11.9 > 9; longest sentence 34 > 25 words
- `taxisaver-translink` — FK grade 11.8 > 9; longest sentence 38 > 25 words
- `bc-raha` — FK grade 11.8 > 9; longest sentence 58 > 25 words
- `canadian-dental-care-plan` — FK grade 11.7 > 9; average sentence 23.8 > 20 words; longest sentence 69 > 25 words
- `woodbuffalo-lift` — FK grade 11.7 > 9; longest sentence 38 > 25 words
- `bc-pharmacare-plan-p` — FK grade 11.6 > 9; longest sentence 80 > 25 words
- `taxi-saver-bctransit` — FK grade 11.5 > 9; longest sentence 45 > 25 words
- `bc-disability-assistance-pwd` — FK grade 11.4 > 9; average sentence 22.1 > 20 words; longest sentence 81 > 25 words
- `bc-pharmacare-plan-g` — FK grade 11.4 > 9; average sentence 20.9 > 20 words; longest sentence 122 > 25 words
- `cpp-childrens-benefit` — FK grade 11.4 > 9; longest sentence 48 > 25 words
- `ab-capcc` — FK grade 11.4 > 9; longest sentence 40 > 25 words
- `airdrie-fair-access` — FK grade 11.3 > 9
- `ab-service-dog-id-card` — FK grade 11.2 > 9; longest sentence 54 > 25 words
- `aadl` — FK grade 11.2 > 9; longest sentence 35 > 25 words
- `disability-supports-deduction` — FK grade 11.1 > 9; average sentence 24.2 > 20 words; longest sentence 63 > 25 words
- `strathcona-subsidy` — FK grade 11.1 > 9
- `bc-home-reno-tax-credit` — FK grade 11.1 > 9; longest sentence 39 > 25 words
- `medical-expense-tax-credit` — FK grade 11.0 > 9; average sentence 22.6 > 20 words; longest sentence 81 > 25 words
- `bc-fnha-health-benefits` — FK grade 11.0 > 9; longest sentence 85 > 25 words
- `okotoks-fee-assistance` — FK grade 11.0 > 9
- `lethbridge-fee-assistance` — FK grade 10.9 > 9; longest sentence 35 > 25 words
- `canada-caregiver-credit` — FK grade 10.7 > 9; average sentence 24.1 > 20 words; longest sentence 64 > 25 words
- `cochrane-connect-card` — FK grade 10.7 > 9
- `child-disability-benefit` — FK grade 10.6 > 9
- `stalbert-subsidy` — FK grade 10.3 > 9; longest sentence 29 > 25 words
- `bc-access-grant-students-disabilities` — FK grade 10.3 > 9; longest sentence 33 > 25 words
- `parking-placard` — FK grade 10.2 > 9
- `local-supports` — FK grade 10.2 > 9
- `cdb-adult` — FK grade 10.0 > 9; longest sentence 29 > 25 words
- `bc-additional-home-owner-grant` — FK grade 10.0 > 9; longest sentence 53 > 25 words
- `bc-supplemental-bursary-students-disabilities` — FK grade 10.0 > 9; longest sentence 38 > 25 words
- `medicinehat-fair-entry` — FK grade 9.9 > 9; longest sentence 33 > 25 words
- `sparc-parking-permit` — FK grade 9.6 > 9; longest sentence 30 > 25 words
- `bc-access-grant-deaf-students` — FK grade 9.6 > 9; longest sentence 38 > 25 words
- `sprucegrove-low-income-transit` — FK grade 9.2 > 9
- `handydart-translink` — FK grade 9.1 > 9; longest sentence 59 > 25 words
- `saanich-life` — longest sentence 64 > 25 words
- `cpp-disability` — longest sentence 31 > 25 words
- `rdsp` — longest sentence 29 > 25 words
- `calgary-fair-entry` — longest sentence 28 > 25 words
- `bc-sales-tax-credit` — longest sentence 36 > 25 words
