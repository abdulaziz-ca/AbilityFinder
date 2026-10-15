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
| bc-clbc | British Columbia | 17.9 | 26.5 | 66 | Yes |
| bc-pwd-designation | British Columbia | 17.7 | 28.2 | 87 | Yes |
| grt-mobilityplus | Region of Waterloo | 17.7 | 22.0 | 85 | Yes |
| richmond-rec-fee-subsidy | Richmond | 17.6 | 31.0 | 50 | Yes |
| vancouver-leisure-access | Vancouver | 17.1 | 32.6 | 104 | Yes |
| bc-pharmacare-plan-c | British Columbia | 17.0 | 27.1 | 58 | Yes |
| bc-autism-funding-under-6 | British Columbia | 16.9 | 30.3 | 97 | Yes |
| ssah | Ontario | 16.8 | 25.5 | 102 | Yes |
| dres | Alberta | 16.3 | 18.8 | 35 | Yes |
| bc-autism-funding-6-18 | British Columbia | 16.2 | 31.3 | 100 | Yes |
| waterloo-curbside-waste-support | Region of Waterloo | 16.2 | 29.8 | 61 | Yes |
| bc-medical-equipment-devices | British Columbia | 16.2 | 25.1 | 39 | Yes |
| bc-healthy-kids | British Columbia | 16.0 | 23.6 | 61 | Yes |
| kamloops-arch | Kamloops | 15.8 | 25.5 | 108 | Yes |
| multigenerational-home-renovation-tax-credit | Federal | 15.7 | 30.1 | 75 | Yes |
| bc-property-tax-deferment-disabilities | British Columbia | 15.7 | 26.5 | 103 | Yes |
| surrey-leisure-access | Surrey | 15.5 | 28.3 | 61 | Yes |
| hvmp | Ontario | 15.5 | 24.0 | 56 | Yes |
| mississauga-activeassist | Mississauga | 15.1 | 26.0 | 127 | Yes |
| london-ontario-renovates | London | 15.1 | 22.8 | 123 | Yes |
| waterloo-homemaking-support | Region of Waterloo | 15.1 | 20.4 | 61 | Yes |
| fscd | Alberta | 15.1 | 17.3 | 31 | Yes |
| trillium-drug-program | Ontario | 15.0 | 30.4 | 69 | Yes |
| kelowna-recreation-assistance | Kelowna | 15.0 | 23.6 | 38 | Yes |
| ontario-autism-program | Ontario | 15.0 | 23.5 | 63 | Yes |
| windsor-recreation-assistance | Windsor | 14.9 | 19.6 | 98 | Yes |
| ab-grant-disability | Alberta | 14.9 | 17.7 | 30 | Yes |
| bc-dental-supplement | British Columbia | 14.8 | 21.2 | 74 | Yes |
| acsd | Ontario | 14.7 | 24.1 | 61 | Yes |
| bc-learning-disability-assessment-bursary | British Columbia | 14.7 | 16.3 | 38 | Yes |
| bc-medical-transportation | British Columbia | 14.5 | 18.9 | 58 | Yes |
| bc-at-home-saet | British Columbia | 14.3 | 19.6 | 62 | Yes |
| leduc-subsidies | Leduc | 14.3 | 16.6 | 24 | Yes |
| on-parking-permit | Ontario | 14.2 | 24.5 | 122 | Yes |
| passport-program | Ontario | 14.1 | 26.0 | 70 | Yes |
| bc-at-home-medical | British Columbia | 14.1 | 23.6 | 52 | Yes |
| grt-support-person | Region of Waterloo | 14.1 | 21.1 | 38 | Yes |
| fortsask-access | Fort Saskatchewan | 14.1 | 15.8 | 21 | Yes |
| lloydminster-recreation-access | Lloydminster | 14.1 | 11.2 | 15 | Yes |
| bc-fuel-tax-refund-disabilities | British Columbia | 14.0 | 19.3 | 109 | Yes |
| edmonton-fare-assistance | Edmonton | 13.9 | 20.0 | 35 | Yes |
| bc-icbc-disability-discount | British Columbia | 13.8 | 24.2 | 40 | Yes |
| odsp | Ontario | 13.8 | 24.1 | 120 | Yes |
| pdd | Alberta | 13.8 | 14.8 | 25 | Yes |
| dtc | Federal | 13.7 | 21.3 | 53 | Yes |
| ottawa-hand-in-hand | Ottawa | 13.5 | 21.9 | 51 | Yes |
| bc-fair-pharmacare | British Columbia | 13.5 | 21.3 | 72 | Yes |
| ab-special-needs-housing | Alberta | 13.5 | 19.4 | 47 | Yes |
| windsor-affordable-pass | Windsor | 13.5 | 16.3 | 56 | Yes |
| adap | Alberta | 13.4 | 18.3 | 32 | Yes |
| on-adp | Ontario | 13.3 | 23.3 | 64 | Yes |
| bc-bus-pass | British Columbia | 13.3 | 22.8 | 82 | Yes |
| bc-supported-child-development | British Columbia | 13.3 | 18.7 | 43 | Yes |
| adult-health-benefit | Alberta | 13.3 | 18.5 | 23 | Yes |
| bc-optical-supplement | British Columbia | 13.3 | 17.6 | 30 | Yes |
| bc-csg-services-equipment | British Columbia | 13.3 | 14.7 | 32 | Yes |
| hamilton-fare-assist | Hamilton | 13.2 | 22.9 | 55 | Yes |
| burnaby-fair-play | Burnaby | 13.2 | 18.5 | 71 | Yes |
| victoria-life | Victoria | 13.1 | 22.8 | 64 | Yes |
| bc-csg-students-disabilities | British Columbia | 13.1 | 15.4 | 39 | Yes |
| csg-disability | Federal | 13.0 | 14.8 | 22 | Yes |
| handycard-translink | Metro Vancouver | 12.6 | 18.1 | 40 | Yes |
| home-accessibility-tax-credit | Federal | 12.5 | 25.1 | 99 | Yes |
| excise-gasoline-tax-refund | Federal | 12.4 | 20.1 | 41 | Yes |
| waterloo-ontario-renovates | Region of Waterloo | 12.4 | 19.1 | 73 | Yes |
| bc-work-able-internship | British Columbia | 12.4 | 15.4 | 27 | Yes |
| canmore-affordable-services | Canmore | 12.4 | 14.2 | 19 | Yes |
| airdrie-fair-access | Airdrie | 12.3 | 19.9 | 27 | Yes |
| bc-assistance-program-students-disabilities | British Columbia | 12.3 | 14.1 | 41 | Yes |
| york-region-homemakers | York Region | 12.2 | 20.0 | 35 | Yes |
| woodbuffalo-lift | Fort McMurray | 12.2 | 17.9 | 38 | Yes |
| aish | Alberta | 12.1 | 17.4 | 32 | Yes |
| bc-workbc-employment-services | British Columbia | 12.1 | 15.6 | 69 | Yes |
| medical-expense-tax-credit | Federal | 12.0 | 25.9 | 89 | Yes |
| brampton-activeassist | Brampton | 12.0 | 17.4 | 65 | Yes |
| handydart-bctransit | British Columbia | 11.9 | 17.2 | 55 | Yes |
| bc-workbc-assistive-technology | British Columbia | 11.9 | 11.5 | 34 | Yes |
| york-region-recreation-subsidies | York Region | 11.8 | 21.4 | 42 | Yes |
| bc-msp-supplementary-benefits | British Columbia | 11.6 | 21.8 | 106 | Yes |
| coquitlam-far | Coquitlam | 11.6 | 20.3 | 45 | Yes |
| bc-pharmacare-plan-p | British Columbia | 11.6 | 20.2 | 80 | Yes |
| toronto-fair-pass | Toronto | 11.6 | 20.1 | 50 | Yes |
| toronto-welcome-policy | Toronto | 11.6 | 19.1 | 75 | Yes |
| bc-raha | British Columbia | 11.6 | 17.4 | 58 | Yes |
| medicinehat-fair-entry | Medicine Hat | 11.5 | 19.1 | 43 | Yes |
| child-health-benefit | Alberta | 11.5 | 18.0 | 32 | Yes |
| taxi-saver-bctransit | British Columbia | 11.5 | 17.7 | 45 | Yes |
| taxisaver-translink | Metro Vancouver | 11.5 | 16.6 | 38 | Yes |
| bc-disability-assistance-pwd | British Columbia | 11.4 | 22.1 | 81 | Yes |
| ab-capcc | Alberta | 11.4 | 16.9 | 40 | Yes |
| lethbridge-fee-assistance | Lethbridge | 11.3 | 20.0 | 35 | Yes |
| ab-service-dog-id-card | Alberta | 11.2 | 19.9 | 54 | Yes |
| saanich-life | Saanich | 11.2 | 19.0 | 77 | Yes |
| aadl | Alberta | 11.2 | 17.3 | 35 | Yes |
| csg-dse | Federal | 11.2 | 14.9 | 20 | Yes |
| bc-pharmacare-plan-g | British Columbia | 11.1 | 20.0 | 122 | Yes |
| cpp-childrens-benefit | Federal | 11.1 | 18.9 | 48 | Yes |
| strathcona-subsidy | Sherwood Park | 11.1 | 17.7 | 24 | Yes |
| bc-home-reno-tax-credit | British Columbia | 11.1 | 16.1 | 39 | Yes |
| canadian-dental-care-plan | Federal | 11.0 | 21.9 | 69 | Yes |
| ramp | Alberta | 11.0 | 19.0 | 51 | Yes |
| okotoks-fee-assistance | Okotoks | 11.0 | 13.0 | 21 | Yes |
| bc-fnha-health-benefits | British Columbia | 10.9 | 16.1 | 99 | Yes |
| cochrane-connect-card | Cochrane | 10.7 | 13.3 | 24 | Yes |
| child-disability-benefit | Federal | 10.6 | 15.0 | 23 | Yes |
| canada-caregiver-credit | Federal | 10.3 | 22.8 | 64 | Yes |
| ottawa-a-card | Ottawa | 10.3 | 19.0 | 34 | Yes |
| bc-additional-home-owner-grant | British Columbia | 10.3 | 17.4 | 53 | Yes |
| stalbert-subsidy | St. Albert | 10.3 | 16.4 | 29 | Yes |
| bc-access-grant-students-disabilities | British Columbia | 10.3 | 7.9 | 33 | Yes |
| reddeer-fee-assistance | Red Deer | 10.2 | 18.0 | 31 | Yes |
| parking-placard | Alberta | 10.2 | 14.8 | 20 | Yes |
| local-supports | Your community | 10.2 | 13.5 | 24 | Yes |
| sparc-parking-permit | British Columbia | 10.1 | 15.7 | 33 | Yes |
| cdb-adult | Federal | 10.0 | 17.5 | 29 | Yes |
| bc-supplemental-bursary-students-disabilities | British Columbia | 10.0 | 13.5 | 38 | Yes |
| disability-supports-deduction | Federal | 9.9 | 20.9 | 63 | Yes |
| bc-access-grant-deaf-students | British Columbia | 9.6 | 11.1 | 38 | Yes |
| rdsp | Federal | 9.2 | 18.5 | 40 | Yes |
| sprucegrove-low-income-transit | Spruce Grove area | 9.2 | 11.4 | 19 | Yes |
| grt-affordable-transit | Region of Waterloo | 9.1 | 13.2 | 44 | Yes |
| ottawa-equipass | Ottawa | 9.1 | 13.1 | 50 | Yes |
| handydart-translink | Metro Vancouver | 9.1 | 12.4 | 59 | Yes |
| cpp-disability | Federal | 8.8 | 15.0 | 31 | Yes |
| grt-taxi-coupons | Region of Waterloo | 8.8 | 10.8 | 24 | No |
| cwb-disability | Federal | 8.7 | 17.2 | 22 | No |
| ottawa-community-pass | Ottawa | 8.5 | 13.7 | 42 | Yes |
| calgary-fair-entry | Calgary | 7.6 | 8.7 | 28 | Yes |
| grt-cnib-pass | Region of Waterloo | 7.0 | 14.8 | 27 | Yes |
| ottawa-access-pass | Ottawa | 7.0 | 13.1 | 31 | Yes |
| bc-sales-tax-credit | British Columbia | 6.9 | 15.3 | 36 | Yes |
| grandeprairie-aish-pass | Grande Prairie | 6.8 | 10.0 | 25 | No |

## Flagged

- `bc-monthly-nutritional-supplement` — FK grade 21.2 > 9; average sentence 33.4 > 20 words; longest sentence 43 > 25 words
- `bc-cy-disability-benefit` — FK grade 20.1 > 9; average sentence 30.4 > 20 words; longest sentence 71 > 25 words
- `bc-clbc` — FK grade 17.9 > 9; average sentence 26.5 > 20 words; longest sentence 66 > 25 words
- `bc-pwd-designation` — FK grade 17.7 > 9; average sentence 28.2 > 20 words; longest sentence 87 > 25 words
- `grt-mobilityplus` — FK grade 17.7 > 9; average sentence 22.0 > 20 words; longest sentence 85 > 25 words
- `richmond-rec-fee-subsidy` — FK grade 17.6 > 9; average sentence 31.0 > 20 words; longest sentence 50 > 25 words
- `vancouver-leisure-access` — FK grade 17.1 > 9; average sentence 32.6 > 20 words; longest sentence 104 > 25 words
- `bc-pharmacare-plan-c` — FK grade 17.0 > 9; average sentence 27.1 > 20 words; longest sentence 58 > 25 words
- `bc-autism-funding-under-6` — FK grade 16.9 > 9; average sentence 30.3 > 20 words; longest sentence 97 > 25 words
- `ssah` — FK grade 16.8 > 9; average sentence 25.5 > 20 words; longest sentence 102 > 25 words
- `dres` — FK grade 16.3 > 9; longest sentence 35 > 25 words
- `bc-autism-funding-6-18` — FK grade 16.2 > 9; average sentence 31.3 > 20 words; longest sentence 100 > 25 words
- `waterloo-curbside-waste-support` — FK grade 16.2 > 9; average sentence 29.8 > 20 words; longest sentence 61 > 25 words
- `bc-medical-equipment-devices` — FK grade 16.2 > 9; average sentence 25.1 > 20 words; longest sentence 39 > 25 words
- `bc-healthy-kids` — FK grade 16.0 > 9; average sentence 23.6 > 20 words; longest sentence 61 > 25 words
- `kamloops-arch` — FK grade 15.8 > 9; average sentence 25.5 > 20 words; longest sentence 108 > 25 words
- `multigenerational-home-renovation-tax-credit` — FK grade 15.7 > 9; average sentence 30.1 > 20 words; longest sentence 75 > 25 words
- `bc-property-tax-deferment-disabilities` — FK grade 15.7 > 9; average sentence 26.5 > 20 words; longest sentence 103 > 25 words
- `surrey-leisure-access` — FK grade 15.5 > 9; average sentence 28.3 > 20 words; longest sentence 61 > 25 words
- `hvmp` — FK grade 15.5 > 9; average sentence 24.0 > 20 words; longest sentence 56 > 25 words
- `mississauga-activeassist` — FK grade 15.1 > 9; average sentence 26.0 > 20 words; longest sentence 127 > 25 words
- `london-ontario-renovates` — FK grade 15.1 > 9; average sentence 22.8 > 20 words; longest sentence 123 > 25 words
- `waterloo-homemaking-support` — FK grade 15.1 > 9; average sentence 20.4 > 20 words; longest sentence 61 > 25 words
- `fscd` — FK grade 15.1 > 9; longest sentence 31 > 25 words
- `trillium-drug-program` — FK grade 15.0 > 9; average sentence 30.4 > 20 words; longest sentence 69 > 25 words
- `kelowna-recreation-assistance` — FK grade 15.0 > 9; average sentence 23.6 > 20 words; longest sentence 38 > 25 words
- `ontario-autism-program` — FK grade 15.0 > 9; average sentence 23.5 > 20 words; longest sentence 63 > 25 words
- `windsor-recreation-assistance` — FK grade 14.9 > 9; longest sentence 98 > 25 words
- `ab-grant-disability` — FK grade 14.9 > 9; longest sentence 30 > 25 words
- `bc-dental-supplement` — FK grade 14.8 > 9; average sentence 21.2 > 20 words; longest sentence 74 > 25 words
- `acsd` — FK grade 14.7 > 9; average sentence 24.1 > 20 words; longest sentence 61 > 25 words
- `bc-learning-disability-assessment-bursary` — FK grade 14.7 > 9; longest sentence 38 > 25 words
- `bc-medical-transportation` — FK grade 14.5 > 9; longest sentence 58 > 25 words
- `bc-at-home-saet` — FK grade 14.3 > 9; longest sentence 62 > 25 words
- `leduc-subsidies` — FK grade 14.3 > 9
- `on-parking-permit` — FK grade 14.2 > 9; average sentence 24.5 > 20 words; longest sentence 122 > 25 words
- `passport-program` — FK grade 14.1 > 9; average sentence 26.0 > 20 words; longest sentence 70 > 25 words
- `bc-at-home-medical` — FK grade 14.1 > 9; average sentence 23.6 > 20 words; longest sentence 52 > 25 words
- `grt-support-person` — FK grade 14.1 > 9; average sentence 21.1 > 20 words; longest sentence 38 > 25 words
- `fortsask-access` — FK grade 14.1 > 9
- `lloydminster-recreation-access` — FK grade 14.1 > 9
- `bc-fuel-tax-refund-disabilities` — FK grade 14.0 > 9; longest sentence 109 > 25 words
- `edmonton-fare-assistance` — FK grade 13.9 > 9; longest sentence 35 > 25 words
- `bc-icbc-disability-discount` — FK grade 13.8 > 9; average sentence 24.2 > 20 words; longest sentence 40 > 25 words
- `odsp` — FK grade 13.8 > 9; average sentence 24.1 > 20 words; longest sentence 120 > 25 words
- `pdd` — FK grade 13.8 > 9
- `dtc` — FK grade 13.7 > 9; average sentence 21.3 > 20 words; longest sentence 53 > 25 words
- `ottawa-hand-in-hand` — FK grade 13.5 > 9; average sentence 21.9 > 20 words; longest sentence 51 > 25 words
- `bc-fair-pharmacare` — FK grade 13.5 > 9; average sentence 21.3 > 20 words; longest sentence 72 > 25 words
- `ab-special-needs-housing` — FK grade 13.5 > 9; longest sentence 47 > 25 words
- `windsor-affordable-pass` — FK grade 13.5 > 9; longest sentence 56 > 25 words
- `adap` — FK grade 13.4 > 9; longest sentence 32 > 25 words
- `on-adp` — FK grade 13.3 > 9; average sentence 23.3 > 20 words; longest sentence 64 > 25 words
- `bc-bus-pass` — FK grade 13.3 > 9; average sentence 22.8 > 20 words; longest sentence 82 > 25 words
- `bc-supported-child-development` — FK grade 13.3 > 9; longest sentence 43 > 25 words
- `adult-health-benefit` — FK grade 13.3 > 9
- `bc-optical-supplement` — FK grade 13.3 > 9; longest sentence 30 > 25 words
- `bc-csg-services-equipment` — FK grade 13.3 > 9; longest sentence 32 > 25 words
- `hamilton-fare-assist` — FK grade 13.2 > 9; average sentence 22.9 > 20 words; longest sentence 55 > 25 words
- `burnaby-fair-play` — FK grade 13.2 > 9; longest sentence 71 > 25 words
- `victoria-life` — FK grade 13.1 > 9; average sentence 22.8 > 20 words; longest sentence 64 > 25 words
- `bc-csg-students-disabilities` — FK grade 13.1 > 9; longest sentence 39 > 25 words
- `csg-disability` — FK grade 13.0 > 9
- `handycard-translink` — FK grade 12.6 > 9; longest sentence 40 > 25 words
- `home-accessibility-tax-credit` — FK grade 12.5 > 9; average sentence 25.1 > 20 words; longest sentence 99 > 25 words
- `excise-gasoline-tax-refund` — FK grade 12.4 > 9; average sentence 20.1 > 20 words; longest sentence 41 > 25 words
- `waterloo-ontario-renovates` — FK grade 12.4 > 9; longest sentence 73 > 25 words
- `bc-work-able-internship` — FK grade 12.4 > 9; longest sentence 27 > 25 words
- `canmore-affordable-services` — FK grade 12.4 > 9
- `airdrie-fair-access` — FK grade 12.3 > 9; longest sentence 27 > 25 words
- `bc-assistance-program-students-disabilities` — FK grade 12.3 > 9; longest sentence 41 > 25 words
- `york-region-homemakers` — FK grade 12.2 > 9; longest sentence 35 > 25 words
- `woodbuffalo-lift` — FK grade 12.2 > 9; longest sentence 38 > 25 words
- `aish` — FK grade 12.1 > 9; longest sentence 32 > 25 words
- `bc-workbc-employment-services` — FK grade 12.1 > 9; longest sentence 69 > 25 words
- `medical-expense-tax-credit` — FK grade 12.0 > 9; average sentence 25.9 > 20 words; longest sentence 89 > 25 words
- `brampton-activeassist` — FK grade 12.0 > 9; longest sentence 65 > 25 words
- `handydart-bctransit` — FK grade 11.9 > 9; longest sentence 55 > 25 words
- `bc-workbc-assistive-technology` — FK grade 11.9 > 9; longest sentence 34 > 25 words
- `york-region-recreation-subsidies` — FK grade 11.8 > 9; average sentence 21.4 > 20 words; longest sentence 42 > 25 words
- `bc-msp-supplementary-benefits` — FK grade 11.6 > 9; average sentence 21.8 > 20 words; longest sentence 106 > 25 words
- `coquitlam-far` — FK grade 11.6 > 9; average sentence 20.3 > 20 words; longest sentence 45 > 25 words
- `bc-pharmacare-plan-p` — FK grade 11.6 > 9; average sentence 20.2 > 20 words; longest sentence 80 > 25 words
- `toronto-fair-pass` — FK grade 11.6 > 9; average sentence 20.1 > 20 words; longest sentence 50 > 25 words
- `toronto-welcome-policy` — FK grade 11.6 > 9; longest sentence 75 > 25 words
- `bc-raha` — FK grade 11.6 > 9; longest sentence 58 > 25 words
- `medicinehat-fair-entry` — FK grade 11.5 > 9; longest sentence 43 > 25 words
- `child-health-benefit` — FK grade 11.5 > 9; longest sentence 32 > 25 words
- `taxi-saver-bctransit` — FK grade 11.5 > 9; longest sentence 45 > 25 words
- `taxisaver-translink` — FK grade 11.5 > 9; longest sentence 38 > 25 words
- `bc-disability-assistance-pwd` — FK grade 11.4 > 9; average sentence 22.1 > 20 words; longest sentence 81 > 25 words
- `ab-capcc` — FK grade 11.4 > 9; longest sentence 40 > 25 words
- `lethbridge-fee-assistance` — FK grade 11.3 > 9; longest sentence 35 > 25 words
- `ab-service-dog-id-card` — FK grade 11.2 > 9; longest sentence 54 > 25 words
- `saanich-life` — FK grade 11.2 > 9; longest sentence 77 > 25 words
- `aadl` — FK grade 11.2 > 9; longest sentence 35 > 25 words
- `csg-dse` — FK grade 11.2 > 9
- `bc-pharmacare-plan-g` — FK grade 11.1 > 9; longest sentence 122 > 25 words
- `cpp-childrens-benefit` — FK grade 11.1 > 9; longest sentence 48 > 25 words
- `strathcona-subsidy` — FK grade 11.1 > 9
- `bc-home-reno-tax-credit` — FK grade 11.1 > 9; longest sentence 39 > 25 words
- `canadian-dental-care-plan` — FK grade 11.0 > 9; average sentence 21.9 > 20 words; longest sentence 69 > 25 words
- `ramp` — FK grade 11.0 > 9; longest sentence 51 > 25 words
- `okotoks-fee-assistance` — FK grade 11.0 > 9
- `bc-fnha-health-benefits` — FK grade 10.9 > 9; longest sentence 99 > 25 words
- `cochrane-connect-card` — FK grade 10.7 > 9
- `child-disability-benefit` — FK grade 10.6 > 9
- `canada-caregiver-credit` — FK grade 10.3 > 9; average sentence 22.8 > 20 words; longest sentence 64 > 25 words
- `ottawa-a-card` — FK grade 10.3 > 9; longest sentence 34 > 25 words
- `bc-additional-home-owner-grant` — FK grade 10.3 > 9; longest sentence 53 > 25 words
- `stalbert-subsidy` — FK grade 10.3 > 9; longest sentence 29 > 25 words
- `bc-access-grant-students-disabilities` — FK grade 10.3 > 9; longest sentence 33 > 25 words
- `reddeer-fee-assistance` — FK grade 10.2 > 9; longest sentence 31 > 25 words
- `parking-placard` — FK grade 10.2 > 9
- `local-supports` — FK grade 10.2 > 9
- `sparc-parking-permit` — FK grade 10.1 > 9; longest sentence 33 > 25 words
- `cdb-adult` — FK grade 10.0 > 9; longest sentence 29 > 25 words
- `bc-supplemental-bursary-students-disabilities` — FK grade 10.0 > 9; longest sentence 38 > 25 words
- `disability-supports-deduction` — FK grade 9.9 > 9; average sentence 20.9 > 20 words; longest sentence 63 > 25 words
- `bc-access-grant-deaf-students` — FK grade 9.6 > 9; longest sentence 38 > 25 words
- `rdsp` — FK grade 9.2 > 9; longest sentence 40 > 25 words
- `sprucegrove-low-income-transit` — FK grade 9.2 > 9
- `grt-affordable-transit` — FK grade 9.1 > 9; longest sentence 44 > 25 words
- `ottawa-equipass` — FK grade 9.1 > 9; longest sentence 50 > 25 words
- `handydart-translink` — FK grade 9.1 > 9; longest sentence 59 > 25 words
- `cpp-disability` — longest sentence 31 > 25 words
- `ottawa-community-pass` — longest sentence 42 > 25 words
- `calgary-fair-entry` — longest sentence 28 > 25 words
- `grt-cnib-pass` — longest sentence 27 > 25 words
- `ottawa-access-pass` — longest sentence 31 > 25 words
- `bc-sales-tax-credit` — longest sentence 36 > 25 words
