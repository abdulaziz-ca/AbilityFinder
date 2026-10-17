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
| vancouver-leisure-access | Vancouver | 18.1 | 34.2 | 235 | Yes |
| richmond-rec-fee-subsidy | Richmond | 17.5 | 31.5 | 50 | Yes |
| bc-fuel-tax-refund-disabilities | British Columbia | 16.9 | 28.0 | 171 | Yes |
| bc-medical-equipment-devices | British Columbia | 16.3 | 23.5 | 43 | Yes |
| bc-healthy-kids | British Columbia | 16.0 | 23.6 | 61 | Yes |
| bc-monthly-nutritional-supplement | British Columbia | 15.8 | 18.9 | 43 | Yes |
| bc-cy-disability-benefit | British Columbia | 15.7 | 22.0 | 50 | Yes |
| grt-mobilityplus | Region of Waterloo | 15.7 | 18.1 | 85 | Yes |
| dres | Alberta | 15.1 | 17.5 | 37 | Yes |
| ab-grant-disability | Alberta | 14.9 | 17.7 | 30 | Yes |
| bc-pharmacare-plan-c | British Columbia | 14.8 | 22.1 | 58 | Yes |
| bc-pwd-designation | British Columbia | 14.8 | 21.9 | 87 | Yes |
| bc-medical-transportation | British Columbia | 14.3 | 18.1 | 58 | Yes |
| kamloops-arch | Kamloops | 14.2 | 21.3 | 51 | Yes |
| bc-property-tax-deferment-disabilities | British Columbia | 13.9 | 22.7 | 81 | Yes |
| csg-dse | Federal | 13.9 | 19.8 | 47 | Yes |
| ssah | Ontario | 13.9 | 18.6 | 102 | Yes |
| bc-autism-funding-under-6 | British Columbia | 13.8 | 22.3 | 49 | Yes |
| kelowna-recreation-assistance | Kelowna | 13.8 | 19.7 | 38 | Yes |
| fscd | Alberta | 13.8 | 15.1 | 31 | Yes |
| hvmp | Ontario | 13.7 | 21.4 | 56 | Yes |
| mississauga-activeassist | Mississauga | 13.6 | 22.6 | 127 | Yes |
| multigenerational-home-renovation-tax-credit | Federal | 13.5 | 24.8 | 75 | Yes |
| adap | Alberta | 13.3 | 20.0 | 43 | Yes |
| lloydminster-recreation-access | Lloydminster | 13.1 | 11.0 | 15 | Yes |
| windsor-recreation-assistance | Windsor | 12.9 | 16.3 | 98 | Yes |
| ontario-autism-program | Ontario | 12.8 | 18.5 | 63 | Yes |
| ottawa-hand-in-hand | Ottawa | 12.5 | 20.5 | 51 | Yes |
| handycard-translink | Metro Vancouver | 12.5 | 18.1 | 40 | Yes |
| victoria-life | Victoria | 12.4 | 21.4 | 66 | Yes |
| burnaby-fair-play | Burnaby | 12.4 | 16.5 | 71 | Yes |
| bc-work-able-internship | British Columbia | 12.3 | 15.6 | 42 | Yes |
| bc-icbc-disability-discount | British Columbia | 12.2 | 21.3 | 40 | Yes |
| waterloo-homemaking-support | Region of Waterloo | 12.2 | 17.0 | 61 | Yes |
| fortsask-access | Fort Saskatchewan | 12.2 | 11.8 | 18 | Yes |
| acsd | Ontario | 12.1 | 17.9 | 61 | Yes |
| bc-csg-services-equipment | British Columbia | 12.1 | 13.2 | 32 | Yes |
| bc-learning-disability-assessment-bursary | British Columbia | 12.1 | 11.8 | 26 | Yes |
| canmore-affordable-services | Canmore | 12.1 | 11.7 | 20 | Yes |
| edmonton-fare-assistance | Edmonton | 12.0 | 15.6 | 25 | Yes |
| aish | Alberta | 11.9 | 18.7 | 43 | Yes |
| handydart-bctransit | British Columbia | 11.9 | 17.2 | 55 | Yes |
| bc-at-home-saet | British Columbia | 11.9 | 14.6 | 62 | Yes |
| london-ontario-renovates | London | 11.8 | 17.0 | 123 | Yes |
| dtc | Federal | 11.8 | 16.9 | 53 | Yes |
| bc-csg-students-disabilities | British Columbia | 11.8 | 13.3 | 39 | Yes |
| bc-autism-funding-6-18 | British Columbia | 11.7 | 22.3 | 53 | Yes |
| on-adp | Ontario | 11.6 | 18.5 | 58 | Yes |
| on-parking-permit | Ontario | 11.6 | 18.0 | 129 | Yes |
| bc-supported-child-development | British Columbia | 11.6 | 15.4 | 43 | Yes |
| pdd | Alberta | 11.6 | 10.0 | 25 | Yes |
| waterloo-curbside-waste-support | Region of Waterloo | 11.5 | 19.2 | 42 | Yes |
| odsp | Ontario | 11.5 | 18.6 | 120 | Yes |
| bc-at-home-medical | British Columbia | 11.5 | 16.8 | 52 | Yes |
| bc-dental-supplement | British Columbia | 11.5 | 15.3 | 40 | Yes |
| surrey-leisure-access | Surrey | 11.4 | 19.1 | 60 | Yes |
| bc-clbc | British Columbia | 11.4 | 14.1 | 31 | Yes |
| ab-special-needs-housing | Alberta | 11.4 | 13.2 | 44 | Yes |
| windsor-affordable-pass | Windsor | 11.4 | 13.0 | 56 | Yes |
| woodbuffalo-lift | Fort McMurray | 11.3 | 16.3 | 38 | Yes |
| home-accessibility-tax-credit | Federal | 11.2 | 22.8 | 104 | Yes |
| bc-assistance-program-students-disabilities | British Columbia | 11.2 | 11.6 | 28 | Yes |
| csg-disability | Federal | 11.2 | 10.9 | 22 | Yes |
| bc-workbc-assistive-technology | British Columbia | 11.1 | 11.3 | 33 | Yes |
| passport-program | Ontario | 11.0 | 18.8 | 70 | Yes |
| bc-optical-supplement | British Columbia | 11.0 | 15.0 | 33 | Yes |
| bc-access-grant-students-disabilities | British Columbia | 11.0 | 12.6 | 48 | Yes |
| trillium-drug-program | Ontario | 10.8 | 20.8 | 69 | Yes |
| bc-raha | British Columbia | 10.8 | 15.5 | 58 | Yes |
| toronto-welcome-policy | Toronto | 10.7 | 17.0 | 75 | Yes |
| hamilton-fare-assist | Hamilton | 10.6 | 16.5 | 60 | Yes |
| taxisaver-translink | Metro Vancouver | 10.6 | 14.8 | 38 | Yes |
| cochrane-connect-card | Cochrane | 10.6 | 14.3 | 24 | Yes |
| waterloo-ontario-renovates | Region of Waterloo | 10.5 | 14.7 | 104 | Yes |
| bc-fair-pharmacare | British Columbia | 10.4 | 13.7 | 58 | Yes |
| adult-health-benefit | Alberta | 10.3 | 13.3 | 23 | Yes |
| cpp-childrens-benefit | Federal | 10.2 | 16.9 | 48 | Yes |
| excise-gasoline-tax-refund | Federal | 10.2 | 15.1 | 39 | Yes |
| grt-support-person | Region of Waterloo | 10.2 | 14.2 | 28 | Yes |
| bc-workbc-employment-services | British Columbia | 10.2 | 14.1 | 36 | Yes |
| okotoks-fee-assistance | Okotoks | 10.2 | 11.1 | 21 | Yes |
| bc-pharmacare-plan-p | British Columbia | 10.1 | 16.0 | 68 | Yes |
| bc-additional-home-owner-grant | British Columbia | 10.0 | 16.6 | 53 | Yes |
| brampton-activeassist | Brampton | 10.0 | 14.1 | 65 | Yes |
| canadian-dental-care-plan | Federal | 9.9 | 19.5 | 69 | Yes |
| ab-capcc | Alberta | 9.9 | 13.4 | 40 | Yes |
| ramp | Alberta | 9.8 | 16.5 | 54 | Yes |
| medicinehat-fair-entry | Medicine Hat | 9.8 | 15.6 | 43 | Yes |
| bc-fnha-health-benefits | British Columbia | 9.8 | 13.4 | 40 | Yes |
| coquitlam-far | Coquitlam | 9.7 | 15.9 | 42 | Yes |
| saanich-life | Saanich | 9.6 | 15.4 | 66 | Yes |
| stalbert-subsidy | St. Albert | 9.6 | 11.6 | 31 | Yes |
| child-health-benefit | Alberta | 9.5 | 13.5 | 24 | Yes |
| local-supports | Your community | 9.5 | 13.3 | 24 | Yes |
| airdrie-fair-access | Airdrie | 9.5 | 12.9 | 20 | Yes |
| taxi-saver-bctransit | British Columbia | 9.5 | 12.6 | 29 | Yes |
| bc-supplemental-bursary-students-disabilities | British Columbia | 9.3 | 13.1 | 35 | Yes |
| medical-expense-tax-credit | Federal | 9.2 | 18.9 | 47 | Yes |
| bc-bus-pass | British Columbia | 9.2 | 13.4 | 34 | Yes |
| bc-home-reno-tax-credit | British Columbia | 9.2 | 12.8 | 36 | Yes |
| aadl | Alberta | 9.2 | 12.0 | 35 | Yes |
| sprucegrove-low-income-transit | Spruce Grove area | 9.2 | 11.4 | 19 | Yes |
| bc-access-grant-deaf-students | British Columbia | 9.2 | 10.7 | 38 | Yes |
| leduc-subsidies | Leduc | 9.1 | 10.6 | 24 | Yes |
| canada-caregiver-credit | Federal | 9.0 | 19.3 | 36 | Yes |
| bc-pharmacare-plan-g | British Columbia | 8.8 | 13.8 | 41 | Yes |
| cwb-disability | Federal | 8.7 | 17.2 | 22 | No |
| york-region-homemakers | York Region | 8.7 | 13.9 | 35 | Yes |
| grt-affordable-transit | Region of Waterloo | 8.7 | 12.7 | 44 | Yes |
| bc-disability-assistance-pwd | British Columbia | 8.6 | 15.5 | 42 | Yes |
| bc-msp-supplementary-benefits | British Columbia | 8.6 | 12.1 | 61 | Yes |
| parking-placard | Alberta | 8.6 | 11.7 | 20 | No |
| child-disability-benefit | Federal | 8.6 | 11.5 | 20 | No |
| grt-taxi-coupons | Region of Waterloo | 8.6 | 11.3 | 46 | Yes |
| handydart-translink | Metro Vancouver | 8.5 | 11.2 | 35 | Yes |
| ab-service-dog-id-card | Alberta | 8.4 | 13.7 | 54 | Yes |
| cdb-adult | Federal | 8.4 | 13.7 | 24 | No |
| disability-supports-deduction | Federal | 8.3 | 17.4 | 53 | Yes |
| toronto-fair-pass | Toronto | 8.3 | 14.5 | 32 | Yes |
| york-region-recreation-subsidies | York Region | 8.2 | 13.3 | 62 | Yes |
| reddeer-fee-assistance | Red Deer | 8.2 | 12.9 | 31 | Yes |
| strathcona-subsidy | Sherwood Park | 8.1 | 11.4 | 23 | No |
| ottawa-equipass | Ottawa | 8.1 | 11.2 | 50 | Yes |
| ottawa-a-card | Ottawa | 8.0 | 14.1 | 34 | Yes |
| lethbridge-fee-assistance | Lethbridge | 7.8 | 12.8 | 35 | Yes |
| rdsp | Federal | 7.7 | 15.2 | 40 | Yes |
| ottawa-community-pass | Ottawa | 7.7 | 12.5 | 42 | Yes |
| cpp-disability | Federal | 7.5 | 11.4 | 31 | Yes |
| sparc-parking-permit | British Columbia | 7.1 | 9.5 | 33 | Yes |
| calgary-fair-entry | Calgary | 6.6 | 7.1 | 28 | Yes |
| grt-cnib-pass | Region of Waterloo | 6.3 | 13.1 | 27 | Yes |
| ottawa-access-pass | Ottawa | 6.1 | 10.6 | 31 | Yes |
| grandeprairie-aish-pass | Grande Prairie | 5.8 | 8.1 | 23 | No |
| bc-sales-tax-credit | British Columbia | 5.1 | 12.4 | 44 | Yes |

## Flagged

- `vancouver-leisure-access` — FK grade 18.1 > 9; average sentence 34.2 > 20 words; longest sentence 235 > 25 words
- `richmond-rec-fee-subsidy` — FK grade 17.5 > 9; average sentence 31.5 > 20 words; longest sentence 50 > 25 words
- `bc-fuel-tax-refund-disabilities` — FK grade 16.9 > 9; average sentence 28.0 > 20 words; longest sentence 171 > 25 words
- `bc-medical-equipment-devices` — FK grade 16.3 > 9; average sentence 23.5 > 20 words; longest sentence 43 > 25 words
- `bc-healthy-kids` — FK grade 16.0 > 9; average sentence 23.6 > 20 words; longest sentence 61 > 25 words
- `bc-monthly-nutritional-supplement` — FK grade 15.8 > 9; longest sentence 43 > 25 words
- `bc-cy-disability-benefit` — FK grade 15.7 > 9; average sentence 22.0 > 20 words; longest sentence 50 > 25 words
- `grt-mobilityplus` — FK grade 15.7 > 9; longest sentence 85 > 25 words
- `dres` — FK grade 15.1 > 9; longest sentence 37 > 25 words
- `ab-grant-disability` — FK grade 14.9 > 9; longest sentence 30 > 25 words
- `bc-pharmacare-plan-c` — FK grade 14.8 > 9; average sentence 22.1 > 20 words; longest sentence 58 > 25 words
- `bc-pwd-designation` — FK grade 14.8 > 9; average sentence 21.9 > 20 words; longest sentence 87 > 25 words
- `bc-medical-transportation` — FK grade 14.3 > 9; longest sentence 58 > 25 words
- `kamloops-arch` — FK grade 14.2 > 9; average sentence 21.3 > 20 words; longest sentence 51 > 25 words
- `bc-property-tax-deferment-disabilities` — FK grade 13.9 > 9; average sentence 22.7 > 20 words; longest sentence 81 > 25 words
- `csg-dse` — FK grade 13.9 > 9; longest sentence 47 > 25 words
- `ssah` — FK grade 13.9 > 9; longest sentence 102 > 25 words
- `bc-autism-funding-under-6` — FK grade 13.8 > 9; average sentence 22.3 > 20 words; longest sentence 49 > 25 words
- `kelowna-recreation-assistance` — FK grade 13.8 > 9; longest sentence 38 > 25 words
- `fscd` — FK grade 13.8 > 9; longest sentence 31 > 25 words
- `hvmp` — FK grade 13.7 > 9; average sentence 21.4 > 20 words; longest sentence 56 > 25 words
- `mississauga-activeassist` — FK grade 13.6 > 9; average sentence 22.6 > 20 words; longest sentence 127 > 25 words
- `multigenerational-home-renovation-tax-credit` — FK grade 13.5 > 9; average sentence 24.8 > 20 words; longest sentence 75 > 25 words
- `adap` — FK grade 13.3 > 9; longest sentence 43 > 25 words
- `lloydminster-recreation-access` — FK grade 13.1 > 9
- `windsor-recreation-assistance` — FK grade 12.9 > 9; longest sentence 98 > 25 words
- `ontario-autism-program` — FK grade 12.8 > 9; longest sentence 63 > 25 words
- `ottawa-hand-in-hand` — FK grade 12.5 > 9; average sentence 20.5 > 20 words; longest sentence 51 > 25 words
- `handycard-translink` — FK grade 12.5 > 9; longest sentence 40 > 25 words
- `victoria-life` — FK grade 12.4 > 9; average sentence 21.4 > 20 words; longest sentence 66 > 25 words
- `burnaby-fair-play` — FK grade 12.4 > 9; longest sentence 71 > 25 words
- `bc-work-able-internship` — FK grade 12.3 > 9; longest sentence 42 > 25 words
- `bc-icbc-disability-discount` — FK grade 12.2 > 9; average sentence 21.3 > 20 words; longest sentence 40 > 25 words
- `waterloo-homemaking-support` — FK grade 12.2 > 9; longest sentence 61 > 25 words
- `fortsask-access` — FK grade 12.2 > 9
- `acsd` — FK grade 12.1 > 9; longest sentence 61 > 25 words
- `bc-csg-services-equipment` — FK grade 12.1 > 9; longest sentence 32 > 25 words
- `bc-learning-disability-assessment-bursary` — FK grade 12.1 > 9; longest sentence 26 > 25 words
- `canmore-affordable-services` — FK grade 12.1 > 9
- `edmonton-fare-assistance` — FK grade 12.0 > 9
- `aish` — FK grade 11.9 > 9; longest sentence 43 > 25 words
- `handydart-bctransit` — FK grade 11.9 > 9; longest sentence 55 > 25 words
- `bc-at-home-saet` — FK grade 11.9 > 9; longest sentence 62 > 25 words
- `london-ontario-renovates` — FK grade 11.8 > 9; longest sentence 123 > 25 words
- `dtc` — FK grade 11.8 > 9; longest sentence 53 > 25 words
- `bc-csg-students-disabilities` — FK grade 11.8 > 9; longest sentence 39 > 25 words
- `bc-autism-funding-6-18` — FK grade 11.7 > 9; average sentence 22.3 > 20 words; longest sentence 53 > 25 words
- `on-adp` — FK grade 11.6 > 9; longest sentence 58 > 25 words
- `on-parking-permit` — FK grade 11.6 > 9; longest sentence 129 > 25 words
- `bc-supported-child-development` — FK grade 11.6 > 9; longest sentence 43 > 25 words
- `pdd` — FK grade 11.6 > 9
- `waterloo-curbside-waste-support` — FK grade 11.5 > 9; longest sentence 42 > 25 words
- `odsp` — FK grade 11.5 > 9; longest sentence 120 > 25 words
- `bc-at-home-medical` — FK grade 11.5 > 9; longest sentence 52 > 25 words
- `bc-dental-supplement` — FK grade 11.5 > 9; longest sentence 40 > 25 words
- `surrey-leisure-access` — FK grade 11.4 > 9; longest sentence 60 > 25 words
- `bc-clbc` — FK grade 11.4 > 9; longest sentence 31 > 25 words
- `ab-special-needs-housing` — FK grade 11.4 > 9; longest sentence 44 > 25 words
- `windsor-affordable-pass` — FK grade 11.4 > 9; longest sentence 56 > 25 words
- `woodbuffalo-lift` — FK grade 11.3 > 9; longest sentence 38 > 25 words
- `home-accessibility-tax-credit` — FK grade 11.2 > 9; average sentence 22.8 > 20 words; longest sentence 104 > 25 words
- `bc-assistance-program-students-disabilities` — FK grade 11.2 > 9; longest sentence 28 > 25 words
- `csg-disability` — FK grade 11.2 > 9
- `bc-workbc-assistive-technology` — FK grade 11.1 > 9; longest sentence 33 > 25 words
- `passport-program` — FK grade 11.0 > 9; longest sentence 70 > 25 words
- `bc-optical-supplement` — FK grade 11.0 > 9; longest sentence 33 > 25 words
- `bc-access-grant-students-disabilities` — FK grade 11.0 > 9; longest sentence 48 > 25 words
- `trillium-drug-program` — FK grade 10.8 > 9; average sentence 20.8 > 20 words; longest sentence 69 > 25 words
- `bc-raha` — FK grade 10.8 > 9; longest sentence 58 > 25 words
- `toronto-welcome-policy` — FK grade 10.7 > 9; longest sentence 75 > 25 words
- `hamilton-fare-assist` — FK grade 10.6 > 9; longest sentence 60 > 25 words
- `taxisaver-translink` — FK grade 10.6 > 9; longest sentence 38 > 25 words
- `cochrane-connect-card` — FK grade 10.6 > 9
- `waterloo-ontario-renovates` — FK grade 10.5 > 9; longest sentence 104 > 25 words
- `bc-fair-pharmacare` — FK grade 10.4 > 9; longest sentence 58 > 25 words
- `adult-health-benefit` — FK grade 10.3 > 9
- `cpp-childrens-benefit` — FK grade 10.2 > 9; longest sentence 48 > 25 words
- `excise-gasoline-tax-refund` — FK grade 10.2 > 9; longest sentence 39 > 25 words
- `grt-support-person` — FK grade 10.2 > 9; longest sentence 28 > 25 words
- `bc-workbc-employment-services` — FK grade 10.2 > 9; longest sentence 36 > 25 words
- `okotoks-fee-assistance` — FK grade 10.2 > 9
- `bc-pharmacare-plan-p` — FK grade 10.1 > 9; longest sentence 68 > 25 words
- `bc-additional-home-owner-grant` — FK grade 10.0 > 9; longest sentence 53 > 25 words
- `brampton-activeassist` — FK grade 10.0 > 9; longest sentence 65 > 25 words
- `canadian-dental-care-plan` — FK grade 9.9 > 9; longest sentence 69 > 25 words
- `ab-capcc` — FK grade 9.9 > 9; longest sentence 40 > 25 words
- `ramp` — FK grade 9.8 > 9; longest sentence 54 > 25 words
- `medicinehat-fair-entry` — FK grade 9.8 > 9; longest sentence 43 > 25 words
- `bc-fnha-health-benefits` — FK grade 9.8 > 9; longest sentence 40 > 25 words
- `coquitlam-far` — FK grade 9.7 > 9; longest sentence 42 > 25 words
- `saanich-life` — FK grade 9.6 > 9; longest sentence 66 > 25 words
- `stalbert-subsidy` — FK grade 9.6 > 9; longest sentence 31 > 25 words
- `child-health-benefit` — FK grade 9.5 > 9
- `local-supports` — FK grade 9.5 > 9
- `airdrie-fair-access` — FK grade 9.5 > 9
- `taxi-saver-bctransit` — FK grade 9.5 > 9; longest sentence 29 > 25 words
- `bc-supplemental-bursary-students-disabilities` — FK grade 9.3 > 9; longest sentence 35 > 25 words
- `medical-expense-tax-credit` — FK grade 9.2 > 9; longest sentence 47 > 25 words
- `bc-bus-pass` — FK grade 9.2 > 9; longest sentence 34 > 25 words
- `bc-home-reno-tax-credit` — FK grade 9.2 > 9; longest sentence 36 > 25 words
- `aadl` — FK grade 9.2 > 9; longest sentence 35 > 25 words
- `sprucegrove-low-income-transit` — FK grade 9.2 > 9
- `bc-access-grant-deaf-students` — FK grade 9.2 > 9; longest sentence 38 > 25 words
- `leduc-subsidies` — FK grade 9.1 > 9
- `canada-caregiver-credit` — longest sentence 36 > 25 words
- `bc-pharmacare-plan-g` — longest sentence 41 > 25 words
- `york-region-homemakers` — longest sentence 35 > 25 words
- `grt-affordable-transit` — longest sentence 44 > 25 words
- `bc-disability-assistance-pwd` — longest sentence 42 > 25 words
- `bc-msp-supplementary-benefits` — longest sentence 61 > 25 words
- `grt-taxi-coupons` — longest sentence 46 > 25 words
- `handydart-translink` — longest sentence 35 > 25 words
- `ab-service-dog-id-card` — longest sentence 54 > 25 words
- `disability-supports-deduction` — longest sentence 53 > 25 words
- `toronto-fair-pass` — longest sentence 32 > 25 words
- `york-region-recreation-subsidies` — longest sentence 62 > 25 words
- `reddeer-fee-assistance` — longest sentence 31 > 25 words
- `ottawa-equipass` — longest sentence 50 > 25 words
- `ottawa-a-card` — longest sentence 34 > 25 words
- `lethbridge-fee-assistance` — longest sentence 35 > 25 words
- `rdsp` — longest sentence 40 > 25 words
- `ottawa-community-pass` — longest sentence 42 > 25 words
- `cpp-disability` — longest sentence 31 > 25 words
- `sparc-parking-permit` — longest sentence 33 > 25 words
- `calgary-fair-entry` — longest sentence 28 > 25 words
- `grt-cnib-pass` — longest sentence 27 > 25 words
- `ottawa-access-pass` — longest sentence 31 > 25 words
- `bc-sales-tax-credit` — longest sentence 44 > 25 words
