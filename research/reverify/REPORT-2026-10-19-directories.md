# Directory re-verification — 2026-10-19

## Scope and method

TaskView #43. Loaded `GRANTS_DIRECTORY` from `public/grants-data.js` and `ORGS_DIRECTORY` from `public/orgs-data.js` in separate Node `vm` contexts: **18 grants + 30 organizations = 48 entries**. Reviewed only the supplied `research/reverify/dir-snapshots/<grant|org>-<id>.txt` snapshots; no live fetches, linked pages, prior reports, or outside knowledge were used as evidence. All 48 headers report status 200; Variety BC was read in a real browser. The requested report filename/date is a batch label: the supplied fetch headers say **2026-10-16**, not October 19.

This is an assertion audit of the pre-fix wording, not a blanket verification of each entry. Every concrete service, population, age, geographic, eligibility, funding and application/contact assertion is classified below, including factual matching metadata (`coverage`, `ageBands`, `lowIncome`, `disabilities`, `functionalNeeds`, `cities`, `situations`, `audience`) alongside its matching prose assertion. Repeated assertions are consolidated; independent services have separate rows. Related geography and matching metadata share rows. Names/organization identities are included where identifiable. Internal IDs, URL strings, review dates, focus labels and matchOnResults flags are not substantive program facts and are excluded from counts. Source contact details not asserted by an entry are not invented as entry facts.

**CONFIRMED** requires a verbatim supporting quote; **DIFFERS** requires a quote and a specific contradiction, dropped condition or hedge; **NOT ON PAGE** means insufficient snapshot evidence, not false. A name, a single city event or an organization’s province-branded domain alone is not proof of province-wide service eligibility. Menu items can confirm that a service is listed, but cannot establish its unquoted eligibility or age limits. Broad adult/child labels do not establish exact numeric boundaries; generic program descriptions do not guarantee funding. Inseparable conditions are kept together, and source-only amounts/limits are not added just because the page has them. Quotations are substring-validated by `research/reverify/build-directories-report.cjs`; `⟂` in the builder separates independent excerpts. All filenames below are relative to `dir-snapshots/`.

## Summary table

| Record id | Facts | Confirmed | Differs | Not on page |
|---|---|---|---|---|
| grant:champ | 9 | 9 | 0 | 0 |
| grant:cp-cares | 9 | 6 | 1 | 2 |
| grant:tetra | 9 | 4 | 0 | 5 |
| grant:easter-seals-ab | 9 | 6 | 0 | 3 |
| grant:variety-ab | 8 | 1 | 0 | 7 |
| grant:hope-air | 11 | 11 | 0 | 0 |
| grant:dog-guides | 14 | 4 | 0 | 10 |
| grant:als-ab-equipment | 10 | 9 | 0 | 1 |
| grant:kids-cancer-care | 11 | 10 | 0 | 1 |
| grant:dayforce-cares | 11 | 9 | 0 | 2 |
| grant:shine-dreams | 8 | 4 | 0 | 4 |
| grant:variety-bc | 19 | 14 | 4 | 1 |
| grant:cknw-kids-fund | 9 | 8 | 0 | 1 |
| grant:kinsmen-bc-equipment | 8 | 7 | 0 | 1 |
| grant:bc-rehab-equipment | 16 | 14 | 1 | 1 |
| grant:bc-rehab-bursary | 8 | 6 | 0 | 2 |
| grant:cpabc-equipment | 13 | 11 | 2 | 0 |
| grant:bear-essentials | 10 | 1 | 0 | 9 |
| org:vad | 10 | 9 | 0 | 1 |
| org:inclusion-alberta | 9 | 8 | 0 | 1 |
| org:cnib-ab | 9 | 5 | 0 | 4 |
| org:gateway | 8 | 8 | 0 | 0 |
| org:momentum | 7 | 5 | 0 | 2 |
| org:sci-alberta | 11 | 9 | 0 | 2 |
| org:autism-edmonton | 8 | 7 | 0 | 1 |
| org:employabilities | 8 | 8 | 0 | 0 |
| org:skills-society | 5 | 4 | 0 | 1 |
| org:chrysalis | 6 | 6 | 0 | 0 |
| org:eclc | 9 | 9 | 0 | 0 |
| org:calgary-legal-guidance | 7 | 7 | 0 | 0 |
| org:between-friends | 7 | 7 | 0 | 0 |
| org:dabc | 9 | 8 | 0 | 1 |
| org:dabc-law-clinic | 11 | 10 | 1 | 0 |
| org:fsi-bc | 9 | 9 | 0 | 0 |
| org:inclusion-bc | 7 | 7 | 0 | 0 |
| org:neil-squire | 7 | 7 | 0 | 0 |
| org:autism-bc | 9 | 9 | 0 | 0 |
| org:wavefront | 10 | 10 | 0 | 0 |
| org:sci-bc | 7 | 7 | 0 | 0 |
| org:bc-211 | 13 | 12 | 0 | 1 |
| org:arch-disability-law | 9 | 9 | 0 | 0 |
| org:autism-ontario | 13 | 2 | 0 | 11 |
| org:sci-ontario | 9 | 9 | 0 | 0 |
| org:easter-seals-ontario | 8 | 7 | 0 | 1 |
| org:march-of-dimes-canada | 6 | 0 | 0 | 6 |
| org:canadian-hearing-services | 18 | 7 | 0 | 11 |
| org:211-ontario | 6 | 5 | 0 | 1 |
| org:steps-to-justice | 9 | 9 | 0 | 0 |
| **Total (48 entries)** | **456** | **353** | **9** | **94** |

Counts are evidence-limited. **9 DIFFERS assertions fixed through 8 field changes in 5 entries. 94 NOT ON PAGE assertions remain open**, plus the two cross-cutting decisions listed below. No whole-entry `verified` date was advanced: many entries retain unsupported facts.

## DIFFERS — numbered findings

1. **grant:cp-cares — `whoFor`**
   - Current (pre-fix): Disability community without membership condition.
   - Snapshot: “individuals must be a paid member of the CPAA for at least 3 months and have completed a Member Intake Form.”.
   - Difference: Drops paid membership duration and completed intake requirement.
   - Disposition: **FIXED**; see Fixes applied.

2. **grant:variety-bc — `whoFor`**
   - Current (pre-fix): BC/Yukon residence without duration.
   - Snapshot: “must have resided here for a minimum of three months.”.
   - Difference: Drops minimum residence duration.
   - Disposition: **FIXED**; see Fixes applied.

3. **grant:variety-bc — `howToApply`**
   - Current (pre-fix): Submit matching individual application without submitter rule.
   - Snapshot: “must be signed and submitted by the primary parent/caregiver.”.
   - Difference: Application may be started by others but must be signed/submitted by primary parent/caregiver.
   - Disposition: **FIXED**; see Fixes applied.

4. **grant:variety-bc — `whoFor`**
   - Current (pre-fix): Disability/complex-needs eligibility without professional-recognition condition or exceptions.
   - Snapshot: “The grant must be for a child with a qualified medical or developmental need recognized by a designated professional.”; “This does not apply to private autism and psychoeducational assessments or mental wellness requests”.
   - Difference: Drops recognition requirement and the listed exceptions.
   - Disposition: **FIXED**; see Fixes applied.

5. **grant:variety-bc — `offers`**
   - Current (pre-fix): Private assessments without autism-specific age restriction.
   - Snapshot: “for autism assessment, the benefitting child must be 4 years or under.”.
   - Difference: General ages 0–19 wording must not imply autism assessments are available at all those ages.
   - Disposition: **FIXED**; see Fixes applied.

6. **grant:bc-rehab-equipment — `howToApply`**
   - Current (pre-fix): Two equipment quotes without new/used distinction.
   - Snapshot: “one must be a new quote from a vendor, and the other must be a used quote”.
   - Difference: Drops required quote types; page also requires online-only submission.
   - Disposition: **FIXED**; see Fixes applied.

7. **grant:cpabc-equipment — `howToApply`**
   - Current (pre-fix): Download current application and submit before published cycle deadline.
   - Snapshot: “The current application cycle for minors (ages 0–18) closes on August 31, 2026 at 11:59pm PST”.
   - Difference: Snapshot cycle deadline is past; do not imply a currently open cycle or that the whole program ended.
   - Disposition: **FIXED**; see Fixes applied.

8. **grant:cpabc-equipment — `offers`**
   - Current (pre-fix): Unqualified equipment-category list.
   - Snapshot: “Funding may be available but is not limited to the following:”.
   - Difference: Restore the page’s may-be-available qualifier.
   - Disposition: **FIXED**; see Fixes applied.

9. **org:dabc-law-clinic — `whatTheyDo`**
   - Current (pre-fix): Currently providing summary advice without intake closure warning.
   - Snapshot: “the Disability Law Clinic has made the difficult decision to close intake, starting August 1, 2026 .”; “We expect to reopen early in 2027.”.
   - Difference: Intake closed; referrals continue but responses may be delayed. Not a permanent program end.
   - Disposition: **FIXED**; see Fixes applied.

## Dead, changed or ended pages

- **No snapshot clearly shows a 404 page, unrelated replacement page, or permanent program termination.** HTTP 200 alone is not proof that substantive content is available.
- **grant:variety-ab**: body is only “Variety Alberta | The Children's Charity of Alberta”. **grant:bear-essentials**: only “Bear Essentials”. **org:march-of-dimes-canada**: empty body after its 200 header. Flagged as **insufficient page content**, not assumed dead or redirected. Leave substantive claims unchanged pending a decision.
- **org:dabc-law-clinic**: explicit temporary intake closure from August 1, 2026. The top says “for at least one month”; the later contact section says “We expect to reopen early in 2027.” Both support closed intake; the more specific expected date is retained as an expectation, not a promise. Referral responses continue but “may be delayed”. Fixed the published description; this is not a permanent closure.
- **grant:cpabc-equipment**: published 2026 application cycle ended August 31, 2026 at 11:59pm PST. Fixed the stale application instruction; no evidence that the whole program ended or that another cycle is open.
- **grant:easter-seals-ab**: current home page emphasizes camp, family resources and housing; equipment funding is not stated. Stories about equipment do not establish a present equipment-funding program. Leave equipment and post-secondary scholarship claims open, not silently removed.
- **grant:dog-guides**: title includes “The Difference Campaign”, but the body is still the official Dog Guides organization and no-cost program site, not clearly an unrelated page. Individual program eligibility remains evidence-limited.

## Fixes applied

Each row records **entry → field → old → new → snapshot quote**. Public text uses the source’s terminology; no source-only amount or income threshold was added.

| Entry | Field | Old | New | Snapshot quote |
|---|---|---|---|---|
| grant:cp-cares | `whoFor` | Children and adults in Alberta's disability community | Children and adults in Alberta's disability community who have been paid CPAA members for at least 3 months and have completed a Member Intake Form | “individuals must be a paid member of the CPAA for at least 3 months and have completed a Member Intake Form.” |
| grant:variety-bc | `whoFor` | BC or Yukon children ages 0–19 with disabilities or complex health needs; household income and health-card rules apply | Children ages 0–19 resident in BC or Yukon for at least 3 months; household income and health-card rules apply. A qualified medical or developmental need recognized by a designated professional is required, except for private autism and psychoeducational assessments or mental wellness requests | “must have resided here for a minimum of three months.”; “The grant must be for a child with a qualified medical or developmental need recognized by a designated professional.”; “This does not apply to private autism and psychoeducational assessments or mental wellness requests” |
| grant:variety-bc | `offers` | Adaptive and mobility equipment, mental-wellness counselling, specialized therapies, private assessments, learning-disability tutoring or tuition, and Type 1 diabetes support | Adaptive and mobility equipment, mental-wellness counselling, specialized therapies, private autism assessments for children 4 years or under, psychoeducational assessments, learning-disability tutoring or tuition, and Type 1 diabetes support | “for autism assessment, the benefitting child must be 4 years or under.” |
| grant:variety-bc | `howToApply` | Review the grant area and submit the matching individual application | Review the grant area; the application must be signed and submitted by the primary parent/caregiver | “must be signed and submitted by the primary parent/caregiver.” |
| grant:bc-rehab-equipment | `howToApply` | Submit the application with an OT or PT assessment, household financial documents and two equipment quotes by a listed deadline | Submit online by a listed deadline with an OT or PT assessment, household financial documents and two quotes: one new quote from a vendor and one used quote | “All applications must be completed and submitted through our online application system.”; “one must be a new quote from a vendor, and the other must be a used quote” |
| grant:cpabc-equipment | `offers` | Communication and writing aids, orthotics, positioning and mobility aids, home-accessibility equipment, electronic daily-living aids, and vision or hearing aids | Funding may be available for communication and writing aids, orthotics, positioning and mobility aids, home-accessibility equipment, electronic daily-living aids, and vision or hearing aids | “Funding may be available but is not limited to the following:” |
| grant:cpabc-equipment | `howToApply` | Download the current Equipment Subsidy application and submit it before the published cycle deadline | The published 2026 application cycle for minors ages 0–18 closed August 31, 2026 at 11:59pm PST; contact CPABC for assistance | “The current application cycle for minors (ages 0–18) closes on August 31, 2026 at 11:59pm PST .”; “If you have any questions or need assistance with your application, please contact us” |
| org:dabc-law-clinic | `whatTheyDo` | Free confidential summary legal advice and referrals on selected disability-rights issues including discrimination, accommodations, services, transportation and post-secondary education | Free confidential summary legal advice and referrals on selected disability-rights issues including discrimination, accommodations, services, transportation and post-secondary education. Intake closed August 1, 2026; expects to reopen early in 2027. Referral responses continue but may be delayed | “the Disability Law Clinic has made the difficult decision to close intake, starting August 1, 2026 .”; “We will continue to respond to clients with referral options, but our responses may be delayed.”; “We expect to reopen early in 2027.” |

### Claude review wording follow-up (supersedes the corresponding New cells above)

Five wording fixes applied using `dir-snapshots/`; asset version remains **188**:

1. **grant:cpabc-equipment — `howToApply`**: “The page lists the current application cycle for minors (ages 0–18) as closing August 31, 2026 at 11:59pm PST; check the page for the current status or contact CPABC for assistance.” This reports the published deadline without asserting that intake is currently closed.
2. **org:dabc-law-clinic — `whatTheyDo`**: Lead with “Summary advice intake is closed as of August 1, 2026; the page says it expects to reopen early in 2027, so check the page for the current status. Referral responses continue but may be delayed.” Retain the existing service description after this notice.
3. **grant:variety-bc — `offers`**: Use “private autism and psychoeducational assessments (for autism, the child must be 4 years or under)” within the existing list.
4. **grant:cpabc-equipment — `offers`**: Use “Funding may be available, including (but not limited to) …” and retain the existing equipment list.
5. **grant:variety-bc — `whoFor`**: Append “Type 1 diabetes support has different eligibility requirements.” No income figure or grant caps added.

Validation after wording follow-up: `npm run gen:context` completed (134 benefit entries, 219 checkable links); generated outputs unchanged. `npm test`: **207 passed, 0 failed**. Whole-project `npx playwright test --project=app-chromium --workers=1`: **278 passed, 0 failed**. Logs: `outputs/directories-wording-{context,unit,playwright}.log`. No commit created.

## OPEN - needs a decision

All NOT ON PAGE assertions are unchanged; this is a follow-up queue, not a finding that they are wrong. Each item corresponds to one NOT ON PAGE row below. Do not remove, narrow, relabel or mark fully verified without a decision/additional authorized evidence.

1. **grant:cp-cares — `whoFor / audience`**: Explicit children and adults scope. Snapshot: `grant-cp-cares.txt`.
2. **grant:cp-cares — `org`**: Full name Cerebral Palsy Association in Alberta (only CPAA appears). Snapshot: `grant-cp-cares.txt`.
3. **grant:tetra — `org / whoFor / coverage`**: Prairie Region chapter and Alberta coverage. Snapshot: `grant-tetra.txt`.
4. **grant:tetra — `audience`**: All ages. Snapshot: `grant-tetra.txt`.
5. **grant:tetra — `offers`**: Volunteer engineers design and build. Snapshot: `grant-tetra.txt`.
6. **grant:tetra — `offers`**: Only when nothing off-the-shelf fits. Snapshot: `grant-tetra.txt`.
7. **grant:tetra — `org`**: Full name Tetra Society of North America (only Tetra appears). Snapshot: `grant-tetra.txt`.
8. **grant:easter-seals-ab — `name / offers`**: Equipment funding programs. Snapshot: `grant-easter-seals-ab.txt`.
9. **grant:easter-seals-ab — `offers`**: Scholarships specifically post-secondary. Snapshot: `grant-easter-seals-ab.txt`.
10. **grant:easter-seals-ab — `howToApply`**: Program pages explain each application. Snapshot: `grant-easter-seals-ab.txt`.
11. **grant:variety-ab — `whoFor / audience / ageBands`**: Children and youth with disabilities; listed under-18 bands. Snapshot: `grant-variety-ab.txt`.
12. **grant:variety-ab — `whoFor / coverage`**: Across Alberta service coverage (title alone does not establish coverage). Snapshot: `grant-variety-ab.txt`.
13. **grant:variety-ab — `name / offers`**: Adaptive equipment. Snapshot: `grant-variety-ab.txt`.
14. **grant:variety-ab — `name / offers`**: Inclusive programs. Snapshot: `grant-variety-ab.txt`.
15. **grant:variety-ab — `offers`**: Go Baby Go. Snapshot: `grant-variety-ab.txt`.
16. **grant:variety-ab — `offers`**: Volt Hockey. Snapshot: `grant-variety-ab.txt`.
17. **grant:variety-ab — `howToApply`**: Contact or programs section. Snapshot: `grant-variety-ab.txt`.
18. **grant:dog-guides — `whoFor`**: Meets program-specific requirements. Snapshot: `grant-dog-guides.txt`.
19. **grant:dog-guides — `audience`**: All ages. Snapshot: `grant-dog-guides.txt`.
20. **grant:dog-guides — `offers`**: Professionally trained. Snapshot: `grant-dog-guides.txt`.
21. **grant:dog-guides — `offers / disabilities`**: Vision program. Snapshot: `grant-dog-guides.txt`.
22. **grant:dog-guides — `offers / disabilities`**: Hearing program. Snapshot: `grant-dog-guides.txt`.
23. **grant:dog-guides — `offers / disabilities`**: Service program. Snapshot: `grant-dog-guides.txt`.
24. **grant:dog-guides — `offers / disabilities`**: Seizure response program. Snapshot: `grant-dog-guides.txt`.
25. **grant:dog-guides — `offers / disabilities`**: Diabetes alert program. Snapshot: `grant-dog-guides.txt`.
26. **grant:dog-guides — `offers / disabilities`**: Facility-support program. Snapshot: `grant-dog-guides.txt`.
27. **grant:dog-guides — `howToApply`**: Get a Dog Guide application section. Snapshot: `grant-dog-guides.txt`.
28. **grant:als-ab-equipment — `audience`**: All ages explicitly eligible. Snapshot: `grant-als-ab-equipment.txt`.
29. **grant:kids-cancer-care — `offers`**: Scholarships specifically post-secondary. Snapshot: `grant-kids-cancer-care.txt`.
30. **grant:dayforce-cares — `whoFor / coverage`**: Canada-wide eligibility (Canada recipient story is not coverage). Snapshot: `grant-dayforce-cares.txt`.
31. **grant:dayforce-cares — `howToApply`**: Section specifically called Apply Now (page says Learn how to apply). Snapshot: `grant-dayforce-cares.txt`.
32. **grant:shine-dreams — `audience / ageBands`**: Child scope and exact bands including under six and 18. Snapshot: `grant-shine-dreams.txt`.
33. **grant:shine-dreams — `offers`**: Personalized. Snapshot: `grant-shine-dreams.txt`.
34. **grant:shine-dreams — `offers`**: Once-in-a-lifetime. Snapshot: `grant-shine-dreams.txt`.
35. **grant:shine-dreams — `whoFor / howToApply`**: Foundation criteria, contact or eligibility information. Snapshot: `grant-shine-dreams.txt`.
36. **grant:variety-bc — `org`**: Full formal name Variety – the Children’s Charity of BC (only Variety and BC appear). Snapshot: `grant-variety-bc.txt`.
37. **grant:cknw-kids-fund — `ageBands`**: Exact listed age bands including 18. Snapshot: `grant-cknw-kids-fund.txt`.
38. **grant:kinsmen-bc-equipment — `ageBands`**: Exact lower boundary of adult bands (18). Snapshot: `grant-kinsmen-bc-equipment.txt`.
39. **grant:bc-rehab-equipment — `whoFor / coverage`**: BC residence requirement explicit on this page. Snapshot: `grant-bc-rehab-equipment.txt`.
40. **grant:bc-rehab-bursary — `audience / ageBands`**: Adults only, exact age bands (18–25 preference belongs to different scholarship). Snapshot: `grant-bc-rehab-bursary.txt`.
41. **grant:bc-rehab-bursary — `offers`**: Current application deadline on this page. Snapshot: `grant-bc-rehab-bursary.txt`.
42. **grant:bear-essentials — `org`**: Children’s Health Foundation of Vancouver Island. Snapshot: `grant-bear-essentials.txt`.
43. **grant:bear-essentials — `whoFor / audience / ageBands`**: Children and youth up to 19, listed age bands. Snapshot: `grant-bear-essentials.txt`.
44. **grant:bear-essentials — `whoFor / coverage / cities`**: Vancouver Island or surrounding islands, Victoria and Saanich. Snapshot: `grant-bear-essentials.txt`.
45. **grant:bear-essentials — `whoFor`**: Confirmed health challenge or disability. Snapshot: `grant-bear-essentials.txt`.
46. **grant:bear-essentials — `whoFor / lowIncome`**: Financial need. Snapshot: `grant-bear-essentials.txt`.
47. **grant:bear-essentials — `name / offers / functionalNeeds`**: Partial or supplementary health travel funding. Snapshot: `grant-bear-essentials.txt`.
48. **grant:bear-essentials — `name / offers / functionalNeeds`**: Partial or supplementary equipment funding. Snapshot: `grant-bear-essentials.txt`.
49. **grant:bear-essentials — `howToApply`**: Health professional familiar with child submits referral-only application. Snapshot: `grant-bear-essentials.txt`.
50. **grant:bear-essentials — `howToApply`**: Apply before travel or purchase. Snapshot: `grant-bear-essentials.txt`.
51. **org:vad — `whatTheyDo`**: Referrals. Snapshot: `org-vad.txt`.
52. **org:inclusion-alberta — `whatTheyDo`**: Developmental disabilities as additional scope. Snapshot: `org-inclusion-alberta.txt`.
53. **org:cnib-ab — `name / region / coverage`**: Alberta province-wide programs (national page has no Alberta detail). Snapshot: `org-cnib-ab.txt`.
54. **org:cnib-ab — `whatTheyDo`**: Daily-living skills. Snapshot: `org-cnib-ab.txt`.
55. **org:cnib-ab — `whatTheyDo`**: Employment support. Snapshot: `org-cnib-ab.txt`.
56. **org:cnib-ab — `whatTheyDo`**: Education support. Snapshot: `org-cnib-ab.txt`.
57. **org:momentum — `region / coverage`**: Calgary, Alberta. Snapshot: `org-momentum.txt`.
58. **org:momentum — `whatTheyDo`**: Specifically low-income participants. Snapshot: `org-momentum.txt`.
59. **org:sci-alberta — `region / coverage`**: Alberta-wide. Snapshot: `org-sci-alberta.txt`.
60. **org:sci-alberta — `region`**: Calgary location. Snapshot: `org-sci-alberta.txt`.
61. **org:autism-edmonton — `region / coverage`**: Edmonton and area service boundary (name alone is not a boundary). Snapshot: `org-autism-edmonton.txt`.
62. **org:skills-society — `region / coverage`**: Edmonton service boundary (Edmonton-based project is not whole organization coverage). Snapshot: `org-skills-society.txt`.
63. **org:dabc — `whatTheyDo`**: Help sheets specifically plain-language. Snapshot: `org-dabc.txt`.
64. **org:bc-211 — `region / coverage`**: Explicit whole-province service boundary. Snapshot: `org-bc-211.txt`.
65. **org:autism-ontario — `region / coverage`**: Ontario-wide service coverage (local events do not establish full coverage). Snapshot: `org-autism-ontario.txt`.
66. **org:autism-ontario — `region`**: Seven regions. Snapshot: `org-autism-ontario.txt`.
67. **org:autism-ontario — `whatTheyDo`**: Information and referral. Snapshot: `org-autism-ontario.txt`.
68. **org:autism-ontario — `whatTheyDo`**: Community representation. Snapshot: `org-autism-ontario.txt`.
69. **org:autism-ontario — `whatTheyDo`**: Adult assessment resources. Snapshot: `org-autism-ontario.txt`.
70. **org:autism-ontario — `whatTheyDo`**: Awards and funding. Snapshot: `org-autism-ontario.txt`.
71. **org:autism-ontario — `whatTheyDo`**: Mental-health resources. Snapshot: `org-autism-ontario.txt`.
72. **org:autism-ontario — `whatTheyDo`**: ODSP-transition resources. Snapshot: `org-autism-ontario.txt`.
73. **org:autism-ontario — `whatTheyDo`**: Housing resources. Snapshot: `org-autism-ontario.txt`.
74. **org:autism-ontario — `whatTheyDo`**: Autism Career Connections. Snapshot: `org-autism-ontario.txt`.
75. **org:autism-ontario — `whatTheyDo`**: Webinars. Snapshot: `org-autism-ontario.txt`.
76. **org:easter-seals-ontario — `region / coverage`**: Explicit Ontario-wide service boundary. Snapshot: `org-easter-seals-ontario.txt`.
77. **org:march-of-dimes-canada — `name`**: March of Dimes Canada (empty snapshot body). Snapshot: `org-march-of-dimes-canada.txt`.
78. **org:march-of-dimes-canada — `region / whatTheyDo`**: Canada-wide disability services. Snapshot: `org-march-of-dimes-canada.txt`.
79. **org:march-of-dimes-canada — `region / coverage / whatTheyDo`**: Ontario HVMP delivery. Snapshot: `org-march-of-dimes-canada.txt`.
80. **org:march-of-dimes-canada — `whatTheyDo`**: HVMP applicants apply to this organization (internal match advice depends on this external fact). Snapshot: `org-march-of-dimes-canada.txt`.
81. **org:march-of-dimes-canada — `whatTheyDo`**: Manitoba Safe and Healthy Home for Seniors. Snapshot: `org-march-of-dimes-canada.txt`.
82. **org:march-of-dimes-canada — `whatTheyDo`**: Low-cost or no-cost home-modification resources. Snapshot: `org-march-of-dimes-canada.txt`.
83. **org:canadian-hearing-services — `region`**: Hearing clinic in Toronto. Snapshot: `org-canadian-hearing-services.txt`.
84. **org:canadian-hearing-services — `region`**: Hearing clinic in Mississauga. Snapshot: `org-canadian-hearing-services.txt`.
85. **org:canadian-hearing-services — `region`**: Hearing clinic in Hamilton. Snapshot: `org-canadian-hearing-services.txt`.
86. **org:canadian-hearing-services — `region`**: Hearing clinic in London. Snapshot: `org-canadian-hearing-services.txt`.
87. **org:canadian-hearing-services — `region`**: Hearing clinic in Windsor. Snapshot: `org-canadian-hearing-services.txt`.
88. **org:canadian-hearing-services — `region`**: Hearing clinic in Kingston. Snapshot: `org-canadian-hearing-services.txt`.
89. **org:canadian-hearing-services — `region`**: Hearing clinic in Ottawa. Snapshot: `org-canadian-hearing-services.txt`.
90. **org:canadian-hearing-services — `region`**: Hearing clinic in Sudbury. Snapshot: `org-canadian-hearing-services.txt`.
91. **org:canadian-hearing-services — `coverage`**: Ontario service coverage. Snapshot: `org-canadian-hearing-services.txt`.
92. **org:canadian-hearing-services — `whatTheyDo`**: Products. Snapshot: `org-canadian-hearing-services.txt`.
93. **org:canadian-hearing-services — `whatTheyDo`**: Canadian not-for-profit status. Snapshot: `org-canadian-hearing-services.txt`.
94. **org:211-ontario — `region / coverage`**: Explicit Ontario-wide service boundary. Snapshot: `org-211-ontario.txt`.

Additional cross-cutting decisions (not extra entry-fact counts):

95. **Filter representation**: some source areas exceed configured filters (Variety BC includes Yukon; ALS Alberta says it also serves Northwest Territories “when required”; national organizations can have Ontario-only directory coverage). These arrays drive supported-province discovery, not necessarily exhaustive service maps. Do not add provinces, change matching behavior or infer exact ages from “adult” without a product decision.
96. **Variety BC differentiated routes**: the snapshot explicitly says “Type 1 Diabetes support has different eligibility requirements.” Generic household income and health-card wording is not a complete diabetes eligibility definition; the snapshot does not give that route’s full rules. Leave existing filter flags unchanged and decide whether the directory should separate routes. The diabetes support amount is “based on your PharmaCare Maximum Family Deductible”, not a fixed amount. No threshold or cap invented.

**Open count:** 94 unsupported assertion decisions + 2 cross-cutting decisions = **96 open items**; zero unresolved DIFFERS findings.

## Per-entry tables

The “Entry assertion” column describes the original assertion, not the replacement wording. Confirmations of individual service categories do not override a separate DIFFERS row for a missing eligibility qualifier.

### grant:champ

Source: [`grant-champ.txt`](dir-snapshots/grant-champ.txt) — URL: https://www.waramps.ca/ways-we-help/child-amputees/ \| fetched: 2026-10-16T07:35:36.531642Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "CHAMP Program",
  "org": "The War Amps",
  "whoFor": "Children under 18 in Canada born without a limb or who lost a limb",
  "offers": "Financial help for artificial limbs, recreational limbs and devices, travel to prosthetic clinics, and family peer support",
  "howToApply": "Complete the CHAMP enrolment form on their site",
  "audience": "children",
  "coverage": [
    "CA"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name / org` | CHAMP; The War Amps | **CONFIRMED** | “Child Amputee (CHAMP) Program \| The War Amps” |
| `whoFor / audience` | Children under 18 | **CONFIRMED** | “CHAMP serves children in Canada (under 18)” |
| `whoFor / coverage` | Canada | **CONFIRMED** | “CHAMP serves children in Canada (under 18)” |
| `whoFor` | Born without a limb or lost a limb | **CONFIRMED** | “who are born without a limb or have lost a limb due to an accident or medical causes.” |
| `offers` | Financial help for artificial limbs | **CONFIRMED** | “CHAMP assists with the costs of standard or “everyday” artificial limbs” |
| `offers` | Recreational limbs and devices | **CONFIRMED** | “The program covers 100 per cent of the cost of recreational limbs and devices” |
| `offers` | Travel to prosthetic clinics | **CONFIRMED** | “CHAMP provides financial assistance towards travel costs to and from prosthetic clinics for its members.” |
| `offers` | Family peer support | **CONFIRMED** | “CHAMP provides a network of support to child amputees and their families.” |
| `howToApply` | Complete enrolment form | **CONFIRMED** | “Please complete the enrolment form. Online \| Download PDF” |

### grant:cp-cares

Source: [`grant-cp-cares.txt`](dir-snapshots/grant-cp-cares.txt) — URL: https://cpalberta.com/funding-request \| fetched: 2026-10-16T07:35:37.572873Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "CP CARES funding requests",
  "org": "Cerebral Palsy Association in Alberta",
  "whoFor": "Children and adults in Alberta's disability community",
  "offers": "Funding requests for equipment and programs — current criteria and limits are on their page",
  "howToApply": "Submit a funding request on their site",
  "audience": "all",
  "coverage": [
    "AB"
  ],
  "functionalNeeds": [
    "equipment"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name / org` | CP Cares; CPAA | **CONFIRMED** | “CP CARES PROGRAM FUNDING ELIGIBILITY” |
| `whoFor / coverage` | Albertans with disabilities | **CONFIRMED** | “The CP Cares Program assists Albertans with disabilities” |
| `whoFor / audience` | Explicit children and adults scope | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor` | Disability community without membership condition | **DIFFERS** | “individuals must be a paid member of the CPAA for at least 3 months and have completed a Member Intake Form.” — Drops paid membership duration and completed intake requirement. |
| `offers / functionalNeeds` | Equipment funding | **CONFIRMED** | “Mobility and/or adaptive equipment including adapted bikes” |
| `offers` | Programs funding | **CONFIRMED** | “programs,  educational courses, treatments and therapies” |
| `offers` | Criteria and limits on page | **CONFIRMED** | “Available support is not guaranteed and subject to change.” |
| `howToApply` | Online funding request | **CONFIRMED** | “CP Cares Program Application Form Submission” |
| `org` | Full name Cerebral Palsy Association in Alberta (only CPAA appears) | **NOT ON PAGE** | Not stated in this snapshot. |

### grant:tetra

Source: [`grant-tetra.txt`](dir-snapshots/grant-tetra.txt) — URL: https://tetrasociety.org \| fetched: 2026-10-16T07:35:39.175777Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Custom assistive devices",
  "org": "Tetra Society of North America (Prairie Region)",
  "whoFor": "People with physical disabilities in Alberta (Prairie Region chapter)",
  "offers": "Volunteer engineers design and build custom assistive devices when nothing off-the-shelf fits",
  "howToApply": "Use the Request Assistance section on their site",
  "audience": "all",
  "coverage": [
    "AB"
  ],
  "disabilities": [
    "physical"
  ],
  "functionalNeeds": [
    "equipment"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Custom assistive devices | **CONFIRMED** | “Need a custom assistive device? Tetra is here to help!” |
| `whoFor / disabilities` | Physical disabilities | **CONFIRMED** | “Tetra builds innovative solutions for people with physical disabilities.” |
| `org / whoFor / coverage` | Prairie Region chapter and Alberta coverage | **NOT ON PAGE** | Not stated in this snapshot. |
| `audience` | All ages | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers / functionalNeeds` | Custom assistive device solutions | **CONFIRMED** | “Need a custom assistive device? Tetra is here to help!” |
| `offers` | Volunteer engineers design and build | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers` | Only when nothing off-the-shelf fits | **NOT ON PAGE** | Not stated in this snapshot. |
| `howToApply` | Request Assistance section | **CONFIRMED** | “Request Assistance” |
| `org` | Full name Tetra Society of North America (only Tetra appears) | **NOT ON PAGE** | Not stated in this snapshot. |

### grant:easter-seals-ab

Source: [`grant-easter-seals-ab.txt`](dir-snapshots/grant-easter-seals-ab.txt) — URL: https://easterseals.ab.ca/ \| fetched: 2026-10-16T07:35:39.675121Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Equipment programs, camp and scholarships",
  "org": "Easter Seals Alberta",
  "whoFor": "Albertans with disabilities and medical conditions",
  "offers": "Equipment funding programs, Camp Horizon, post-secondary scholarships, and family resource navigation",
  "howToApply": "Program pages on their site explain each application",
  "audience": "all",
  "coverage": [
    "AB"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | Easter Seals Alberta | **CONFIRMED** | “Easter Seals Alberta has been a cornerstone of support” |
| `whoFor / coverage` | Albertans with disabilities and medical conditions | **CONFIRMED** | “Albertans living with disabilities and medical conditions.” |
| `audience` | Children and adults | **CONFIRMED** | “Unforgettable adventures for kids, youth, and adults with disabilities.” |
| `name / offers` | Equipment funding programs | **NOT ON PAGE** | Not stated in this snapshot. |
| `name / offers` | Camp Horizon | **CONFIRMED** | “Camp Horizon Unforgettable adventures” |
| `name / offers` | Scholarships | **CONFIRMED** | “Scholarships” |
| `offers` | Scholarships specifically post-secondary | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers` | Family resource navigation | **CONFIRMED** | “Family Resource Centre PDD & FSCD Navigation Family Support Transition to Adulthood” |
| `howToApply` | Program pages explain each application | **NOT ON PAGE** | Not stated in this snapshot. |

### grant:variety-ab

Source: [`grant-variety-ab.txt`](dir-snapshots/grant-variety-ab.txt) — URL: https://varietyalberta.ca \| fetched: 2026-10-16T07:35:40.545483Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Adaptive equipment and inclusive programs",
  "org": "Variety Alberta",
  "whoFor": "Children and youth with disabilities across Alberta",
  "offers": "Adaptive equipment and inclusive programs such as Go Baby Go and Volt Hockey",
  "howToApply": "Contact them or see the programs section of their site",
  "audience": "children",
  "coverage": [
    "AB"
  ],
  "ageBands": [
    "under6",
    "6to11",
    "12to15",
    "16to17"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | Variety Alberta | **CONFIRMED** | “Variety Alberta \| The Children's Charity of Alberta” |
| `whoFor / audience / ageBands` | Children and youth with disabilities; listed under-18 bands | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor / coverage` | Across Alberta service coverage (title alone does not establish coverage) | **NOT ON PAGE** | Not stated in this snapshot. |
| `name / offers` | Adaptive equipment | **NOT ON PAGE** | Not stated in this snapshot. |
| `name / offers` | Inclusive programs | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers` | Go Baby Go | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers` | Volt Hockey | **NOT ON PAGE** | Not stated in this snapshot. |
| `howToApply` | Contact or programs section | **NOT ON PAGE** | Not stated in this snapshot. |

### grant:hope-air

Source: [`grant-hope-air.txt`](dir-snapshots/grant-hope-air.txt) — URL: https://www.hopeair.ca \| fetched: 2026-10-16T07:35:41.349031Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Free medical travel",
  "org": "Hope Air",
  "whoFor": "Canadians who must travel away from home for medical care and cannot afford the cost",
  "offers": "Flights, accommodation, airport ground transportation, and meal vouchers for eligible medical travel; availability varies by province",
  "howToApply": "Use the Apply for Travel section on their site, or contact their Help Centre",
  "audience": "all",
  "coverage": [
    "CA"
  ],
  "functionalNeeds": [
    "medicalTravel"
  ],
  "lowIncome": true
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | Hope Air | **CONFIRMED** | “Medical Travel Assistance Program \| Hope Air” |
| `whoFor / coverage` | Canadians travelling for medical care | **CONFIRMED** | “travel support for Canadians in financial need from coast to coast.” |
| `whoFor / lowIncome` | Financial need | **CONFIRMED** | “Canadians in financial need” |
| `whoFor` | Travel away from home | **CONFIRMED** | “requiring access to medical care far from home.” |
| `name / offers / functionalNeeds` | Free flights for medical travel | **CONFIRMED** | “Hope Air provides free flights, accommodations, airport ground transportation and meal vouchers for families and individuals who must travel for medical care.” |
| `offers` | Accommodation | **CONFIRMED** | “Hope Air provides accommodations to support travel to medical appointments” |
| `offers` | Airport ground transportation | **CONFIRMED** | “airport ground transportation” |
| `offers` | Meal vouchers | **CONFIRMED** | “meal vouchers for families and individuals who must travel for medical care.” |
| `offers` | Eligible travel; availability varies by province | **CONFIRMED** | “Programs and eligibility may vary based upon province of residence.” |
| `audience` | Families and individuals | **CONFIRMED** | “families and individuals” |
| `howToApply` | Apply for Travel or Help Centre | **CONFIRMED** | “Apply for Travel”; “Help Centre” |

### grant:dog-guides

Source: [`grant-dog-guides.txt`](dir-snapshots/grant-dog-guides.txt) — URL: https://www.dogguides.com \| fetched: 2026-10-16T07:35:42.066321Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Dog Guides at no cost",
  "org": "Lions Foundation of Canada Dog Guides",
  "whoFor": "Canadians who meet the requirements of one of the foundation's Dog Guide programs",
  "offers": "Professionally trained Dog Guides at no cost for qualifying vision, hearing, service, seizure response, autism assistance, diabetes alert, and facility-support applicants",
  "howToApply": "Apply through the Get a Dog Guide section on their site",
  "audience": "all",
  "coverage": [
    "CA"
  ],
  "disabilities": [
    "vision",
    "hearing",
    "physical",
    "autism"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | Lions Foundation of Canada Dog Guides | **CONFIRMED** | “Lions Foundation of Canada Dog Guides” |
| `whoFor / coverage` | Canadians | **CONFIRMED** | “empower a Canadian living with a disability with a Dog Guide at no cost to them.” |
| `whoFor` | Meets program-specific requirements | **NOT ON PAGE** | Not stated in this snapshot. |
| `audience` | All ages | **NOT ON PAGE** | Not stated in this snapshot. |
| `name / offers` | Dog Guides at no cost | **CONFIRMED** | “a Dog Guide at no cost to them.” |
| `offers` | Professionally trained | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers / disabilities` | Vision program | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers / disabilities` | Hearing program | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers / disabilities` | Service program | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers / disabilities` | Seizure response program | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers / disabilities` | Diabetes alert program | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers / disabilities` | Facility-support program | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers / disabilities` | Autism Assistance | **CONFIRMED** | “Autism Assistance” |
| `howToApply` | Get a Dog Guide application section | **NOT ON PAGE** | Not stated in this snapshot. |

### grant:als-ab-equipment

Source: [`grant-als-ab-equipment.txt`](dir-snapshots/grant-als-ab-equipment.txt) — URL: https://alsab.ca \| fetched: 2026-10-16T07:35:42.692480Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Equipment loan and client support",
  "org": "ALS Society of Alberta",
  "whoFor": "People living with ALS in Alberta and their families",
  "offers": "A provincial equipment loan program, home visits, support groups, information, and referrals",
  "howToApply": "Contact the Society through their site",
  "audience": "all",
  "coverage": [
    "AB"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | ALS Society of Alberta | **CONFIRMED** | “ALS Society of Alberta” |
| `whoFor / coverage` | People with ALS in Alberta | **CONFIRMED** | “directly supporting Albertans living with ALS” |
| `whoFor` | Families | **CONFIRMED** | “supported over 450 clients and their loved ones.” |
| `audience` | All ages explicitly eligible | **NOT ON PAGE** | Not stated in this snapshot. |
| `name / offers` | Provincial equipment loan program | **CONFIRMED** | “Through our provincial Equipment Loan Program” |
| `offers` | Home visits | **CONFIRMED** | “we provide home visits, support groups, information, referrals” |
| `offers` | Support groups | **CONFIRMED** | “we provide home visits, support groups, information, referrals” |
| `offers` | Information | **CONFIRMED** | “we provide home visits, support groups, information, referrals” |
| `offers` | Referrals | **CONFIRMED** | “we provide home visits, support groups, information, referrals” |
| `howToApply` | Contact Society | **CONFIRMED** | “Contact Us” |

### grant:kids-cancer-care

Source: [`grant-kids-cancer-care.txt`](dir-snapshots/grant-kids-cancer-care.txt) — URL: https://kidscancercare.ab.ca \| fetched: 2026-10-16T07:35:43.367421Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Family programs, camps and scholarships",
  "org": "Kids Cancer Care Foundation of Alberta",
  "whoFor": "Children and youth affected by cancer and their families in Alberta",
  "offers": "Camps, counselling, tutoring, exercise programs, family support, and post-secondary scholarships",
  "howToApply": "Get started through the For Families section on their site",
  "audience": "children",
  "coverage": [
    "AB"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | Kids Cancer Care Foundation of Alberta | **CONFIRMED** | “Kids Cancer Care Foundation of Alberta” |
| `whoFor / audience` | Children, teens and families affected by cancer | **CONFIRMED** | “Kids Cancer Care offers year-round programs for kids, teens, parents and the whole family.” |
| `whoFor / coverage` | Alberta | **CONFIRMED** | “Our hospital programs help Alberta children receive the care they need right here in Alberta” |
| `name / offers` | Camps | **CONFIRMED** | “Summer Camps Year Round Camps” |
| `offers` | Counselling | **CONFIRMED** | “Counselling Services” |
| `offers` | Tutoring | **CONFIRMED** | “Tutoring” |
| `offers` | Exercise | **CONFIRMED** | “PEER Exercise” |
| `name / offers` | Family support | **CONFIRMED** | “Helping families fight childhood cancer” |
| `name / offers` | Scholarships | **CONFIRMED** | “Scholarships” |
| `offers` | Scholarships specifically post-secondary | **NOT ON PAGE** | Not stated in this snapshot. |
| `howToApply` | For Families section | **CONFIRMED** | “For Families”; “Get Started with Us” |

### grant:dayforce-cares

Source: [`grant-dayforce-cares.txt`](dir-snapshots/grant-dayforce-cares.txt) — URL: https://www.dayforcecares.com \| fetched: 2026-10-16T07:35:43.827604Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Grants for basic needs and equipment",
  "org": "Dayforce Cares",
  "whoFor": "Individuals and families in Canada facing financial hardship",
  "offers": "Grants toward eligible necessities and quality-of-life needs such as medical or dental equipment, prosthetics, eyewear, and barrier-free home adjustments",
  "howToApply": "Apply through the Apply Now section on their site",
  "audience": "all",
  "coverage": [
    "CA"
  ],
  "functionalNeeds": [
    "equipment"
  ],
  "lowIncome": true
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | Dayforce Cares | **CONFIRMED** | “Dayforce Cares” |
| `whoFor / audience` | Individuals and families facing hardship | **CONFIRMED** | “support individuals and families through difficult times” |
| `whoFor / coverage` | Canada-wide eligibility (Canada recipient story is not coverage) | **NOT ON PAGE** | Not stated in this snapshot. |
| `lowIncome` | Financial hardship | **CONFIRMED** | “helps people get access to basic needs like food, clothing, and essential household items.” |
| `name / offers` | Grants toward eligible basic necessities | **CONFIRMED** | “We provide financial assistance for a wide range of basic necessities.” |
| `offers / functionalNeeds` | Medical equipment | **CONFIRMED** | “medical and dental equipment” |
| `offers / functionalNeeds` | Dental equipment | **CONFIRMED** | “medical and dental equipment” |
| `offers / functionalNeeds` | Prosthetics | **CONFIRMED** | “prosthetics” |
| `offers / functionalNeeds` | Eyewear | **CONFIRMED** | “eyewear” |
| `offers / functionalNeeds` | Barrier-free home adjustments | **CONFIRMED** | “home adjustments for barrier-free living” |
| `howToApply` | Section specifically called Apply Now (page says Learn how to apply) | **NOT ON PAGE** | Not stated in this snapshot. |

### grant:shine-dreams

Source: [`grant-shine-dreams.txt`](dir-snapshots/grant-shine-dreams.txt) — URL: https://www.shinefoundation.ca \| fetched: 2026-10-16T07:35:44.246406Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Dreams for young people with severe physical disabilities",
  "org": "Shine Foundation",
  "whoFor": "Young people in Canada living with severe physical disabilities who meet the foundation's criteria",
  "offers": "A personalized once-in-a-lifetime Dream",
  "howToApply": "Contact the foundation or review its eligibility information",
  "audience": "children",
  "coverage": [
    "CA"
  ],
  "disabilities": [
    "physical"
  ],
  "ageBands": [
    "under6",
    "6to11",
    "12to15",
    "16to17",
    "18"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | Shine Foundation | **CONFIRMED** | “Shine Foundation” |
| `whoFor / coverage` | Young people in Canada | **CONFIRMED** | “young people in Canada living with severe physical disabilities” |
| `whoFor / disabilities` | Severe physical disabilities | **CONFIRMED** | “young people in Canada living with severe physical disabilities” |
| `audience / ageBands` | Child scope and exact bands including under six and 18 | **NOT ON PAGE** | Not stated in this snapshot. |
| `name / offers` | Dream | **CONFIRMED** | “with a Dream come true.” |
| `offers` | Personalized | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers` | Once-in-a-lifetime | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor / howToApply` | Foundation criteria, contact or eligibility information | **NOT ON PAGE** | Not stated in this snapshot. |

### grant:variety-bc

Source: [`grant-variety-bc.txt`](dir-snapshots/grant-variety-bc.txt) — URL: https://www.variety.bc.ca/grant-qualifications/ \| fetched: 2026-10-16 \| status: 200 (read in a real browser; automated fetch refused).

Original factual fields (matching metadata included):

```json
{
  "name": "Individual grants for equipment, therapies and assessments",
  "org": "Variety – the Children's Charity of BC",
  "whoFor": "BC or Yukon children ages 0–19 with disabilities or complex health needs; household income and health-card rules apply",
  "offers": "Adaptive and mobility equipment, mental-wellness counselling, specialized therapies, private assessments, learning-disability tutoring or tuition, and Type 1 diabetes support",
  "howToApply": "Review the grant area and submit the matching individual application",
  "audience": "children",
  "coverage": [
    "BC"
  ],
  "ageBands": [
    "under6",
    "6to11",
    "12to15",
    "16to17",
    "18"
  ],
  "lowIncome": true
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | Variety BC | **CONFIRMED** | “Variety’s fiscal year” |
| `whoFor / coverage` | BC or Yukon residents | **CONFIRMED** | “The child must be a resident of B.C. or Yukon” |
| `whoFor / audience / ageBands` | Children ages 0–19 | **CONFIRMED** | “The grant must be for a child who is 0-19 years of age.” |
| `whoFor` | Disabilities or complex health needs | **CONFIRMED** | “BC children with disabilities and complex health needs.” |
| `whoFor / lowIncome` | Household income rule applies | **CONFIRMED** | “The family must have total household income of $85,000 or less.” |
| `whoFor` | Health-card rule applies | **CONFIRMED** | “The child must have a valid Health Care Card.” |
| `whoFor` | BC/Yukon residence without duration | **DIFFERS** | “must have resided here for a minimum of three months.” — Drops minimum residence duration. |
| `offers` | Adaptive and mobility equipment | **CONFIRMED** | “Adaptive & mobility equipment” |
| `offers` | Mental-wellness counselling | **CONFIRMED** | “Mental wellness counselling” |
| `offers` | Specialized therapies | **CONFIRMED** | “Specialized therapies” |
| `offers` | Private assessments | **CONFIRMED** | “private autism and psychoeducational assessments” |
| `offers` | Learning-disability tutoring | **CONFIRMED** | “Tutoring bursary for learning disabilities” |
| `offers` | Tuition | **CONFIRMED** | “Tuition (school fees)” |
| `offers` | Type 1 diabetes support | **CONFIRMED** | “Type 1 Diabetes Support” |
| `howToApply` | Submit matching individual application without submitter rule | **DIFFERS** | “must be signed and submitted by the primary parent/caregiver.” — Application may be started by others but must be signed/submitted by primary parent/caregiver. |
| `name` | Individual grants | **CONFIRMED** | “Maximum individual grant amounts” |
| `org` | Full formal name Variety – the Children’s Charity of BC (only Variety and BC appear) | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor` | Disability/complex-needs eligibility without professional-recognition condition or exceptions | **DIFFERS** | “The grant must be for a child with a qualified medical or developmental need recognized by a designated professional.”; “This does not apply to private autism and psychoeducational assessments or mental wellness requests” — Drops recognition requirement and the listed exceptions. |
| `offers` | Private assessments without autism-specific age restriction | **DIFFERS** | “for autism assessment, the benefitting child must be 4 years or under.” — General ages 0–19 wording must not imply autism assessments are available at all those ages. |

### grant:cknw-kids-fund

Source: [`grant-cknw-kids-fund.txt`](dir-snapshots/grant-cknw-kids-fund.txt) — URL: https://www.cknwkidsfund.com/what-is-cknw-kids-fund-adgrant \| fetched: 2026-10-16T07:35:45.335644Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Individual funding for equipment, therapies and education",
  "org": "CKNW Kids' Fund",
  "whoFor": "Families in British Columbia seeking support for a child with physical, mental or social challenges",
  "offers": "Specialized medical equipment, therapies, tuition to integrated education or clinical programs, and other eligible child-focused needs",
  "howToApply": "Download the Request for Individual Funding application",
  "audience": "children",
  "coverage": [
    "BC"
  ],
  "ageBands": [
    "under6",
    "6to11",
    "12to15",
    "16to17",
    "18"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | CKNW Kids’ Fund | **CONFIRMED** | “CKNW Kids' Fund” |
| `whoFor / audience` | Child with physical, mental or social challenges | **CONFIRMED** | “a vulnerable child facing physical, mental and social challenges” |
| `whoFor / coverage` | BC families | **CONFIRMED** | “grant applications from both individual families and organizations in BC” |
| `ageBands` | Exact listed age bands including 18 | **NOT ON PAGE** | Not stated in this snapshot. |
| `name / offers` | Specialized medical equipment | **CONFIRMED** | “Specialized medical equipment” |
| `offers` | Therapies | **CONFIRMED** | “Innovative therapies” |
| `name / offers` | Tuition to integrated education or clinical programs | **CONFIRMED** | “Tuition to integrated education and clinical programs” |
| `offers` | Other child-focused needs | **CONFIRMED** | “Projects that focus on children with special needs” |
| `howToApply` | Download individual funding application | **CONFIRMED** | “download the application forms. Request for Individual Funding” |

### grant:kinsmen-bc-equipment

Source: [`grant-kinsmen-bc-equipment.txt`](dir-snapshots/grant-kinsmen-bc-equipment.txt) — URL: https://www.kinsmenfoundationofbc.ca/apply-for-funding/ \| fetched: 2026-10-16T07:35:46.758023Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Equipment grants for adults with physical disabilities",
  "org": "Kinsmen Foundation of BC",
  "whoFor": "Adults living in British Columbia with a physical disability and severe equipment need who cannot obtain funding elsewhere",
  "offers": "Funding for equipment that improves mobility, independence or quality of life",
  "howToApply": "Review the criteria and complete the individual grant application",
  "audience": "adults",
  "coverage": [
    "BC"
  ],
  "disabilities": [
    "physical",
    "braininjury",
    "chronic"
  ],
  "ageBands": [
    "18",
    "19to59",
    "60to64",
    "65plus"
  ],
  "functionalNeeds": [
    "equipment"
  ],
  "lowIncome": true
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | Kinsmen Foundation of BC | **CONFIRMED** | “operating as Kinsmen Foundation of BC” |
| `whoFor / audience / coverage` | Adults in BC | **CONFIRMED** | “Our mandate is to support adults in British Columbia” |
| `whoFor / disabilities` | Physical disabilities including brain injury and chronic conditions | **CONFIRMED** | “physical disabilities, including but not limited to: Acquired Brain Injury ALS” |
| `ageBands` | Exact lower boundary of adult bands (18) | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor` | Severe need and inability to obtain elsewhere | **CONFIRMED** | “including severe need and an inability to obtain the necessary funding and equipment through other means.” |
| `lowIncome` | Financial need | **CONFIRMED** | “Assessment of the applicant’s financial need” |
| `name / offers / functionalNeeds` | Equipment for mobility, independence and quality of life | **CONFIRMED** | “How the equipment request will improve the applicant’s quality of life and increase personal independence” |
| `howToApply` | Criteria and funding application | **CONFIRMED** | “Funding Application” |

### grant:bc-rehab-equipment

Source: [`grant-bc-rehab-equipment.txt`](dir-snapshots/grant-bc-rehab-equipment.txt) — URL: https://bcrehab.org/applications/individual-grant/ \| fetched: 2026-10-16T07:35:47.131480Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Individual equipment grants",
  "org": "BC Rehab Foundation",
  "whoFor": "British Columbians with eligible physical disabilities, financial need and no other way to obtain required equipment",
  "offers": "New or used mobility and assistive equipment, ramps, lifts, repairs, driver rehabilitation and some recreation-therapy requests",
  "howToApply": "Submit the application with an OT or PT assessment, household financial documents and two equipment quotes by a listed deadline",
  "audience": "all",
  "coverage": [
    "BC"
  ],
  "disabilities": [
    "physical",
    "braininjury",
    "chronic"
  ],
  "functionalNeeds": [
    "equipment"
  ],
  "lowIncome": true
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `org` | BC Rehab Foundation (short name only on page) | **CONFIRMED** | “BC Rehab” |
| `whoFor / coverage` | BC residence requirement explicit on this page | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor / disabilities` | Eligible physical disabilities including brain injury and chronic conditions | **CONFIRMED** | “Eligible physical disabilities are: Spinal cord injury Acquired brain injury Stroke Cerebral Palsy” |
| `whoFor / lowIncome` | Financial need | **CONFIRMED** | “financial need of the applicant” |
| `whoFor` | No other means | **CONFIRMED** | “an inability to acquire the needed equipment through other means” |
| `audience` | Adults and children | **CONFIRMED** | “If you are applying for a child under the age of 18” |
| `name / offers / functionalNeeds` | New or used mobility and assistive equipment | **CONFIRMED** | “funds a range of new and used equipment” |
| `offers` | Ramps | **CONFIRMED** | “Ramps” |
| `offers` | Lifts | **CONFIRMED** | “lifts and repairs” |
| `offers` | Repairs | **CONFIRMED** | “lifts and repairs” |
| `offers` | Driver rehabilitation | **CONFIRMED** | “Driver’s rehab lessons” |
| `offers` | Recreation therapy requests considered | **CONFIRMED** | “funding for recreation therapy programs” |
| `howToApply` | OT or PT assessment | **CONFIRMED** | “an assessment from an OT or PT” |
| `howToApply` | Household financial documents | **CONFIRMED** | “Financial Disclosure for Household income:” |
| `howToApply` | Listed deadlines | **CONFIRMED** | “February 15th May 15th September 15th November 15th” |
| `howToApply` | Two equipment quotes without new/used distinction | **DIFFERS** | “one must be a new quote from a vendor, and the other must be a used quote” — Drops required quote types; page also requires online-only submission. |

### grant:bc-rehab-bursary

Source: [`grant-bc-rehab-bursary.txt`](dir-snapshots/grant-bc-rehab-bursary.txt) — URL: https://bcrehab.org/applications/gert-vorsteher-education/ \| fetched: 2026-10-16T07:35:47.337193Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Gert Vorsteher Educational Bursary",
  "org": "BC Rehab Foundation",
  "whoFor": "British Columbians with a physical disability pursuing post-secondary education leading toward employment and greater independence",
  "offers": "A limited number of educational bursary awards; confirm the current application amount and deadline on the official page",
  "howToApply": "Review the current bursary page and submit its application",
  "audience": "adults",
  "coverage": [
    "BC"
  ],
  "disabilities": [
    "physical"
  ],
  "situations": [
    "student"
  ],
  "ageBands": [
    "18",
    "19to59",
    "60to64",
    "65plus"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name / org` | Gert Vorsteher Educational Bursary; BC Rehab | **CONFIRMED** | “The BC Rehab Gert Vorsteher Educational Bursary” |
| `whoFor / coverage` | British Columbians | **CONFIRMED** | “British Columbians with a physical disability” |
| `whoFor / disabilities` | Physical disability | **CONFIRMED** | “British Columbians with a physical disability” |
| `whoFor / situations` | Post-secondary studies toward employment and independence | **CONFIRMED** | “intend to pursue post-secondary education that will lead to employment and greater personal independence.” |
| `audience / ageBands` | Adults only, exact age bands (18–25 preference belongs to different scholarship) | **NOT ON PAGE** | Not stated in this snapshot. |
| `offers` | Limited number of educational awards | **CONFIRMED** | “two educational grants of $5,000 each” |
| `offers` | Current application deadline on this page | **NOT ON PAGE** | Not stated in this snapshot. |
| `howToApply` | Apply through bursary page | **CONFIRMED** | “Apply Now for the Gert Vorsteher Educational Bursary” |

### grant:cpabc-equipment

Source: [`grant-cpabc-equipment.txt`](dir-snapshots/grant-cpabc-equipment.txt) — URL: https://bccerebralpalsy.com/programs/equipment-funding-program/ \| fetched: 2026-10-16T07:35:50.219093Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Equipment Subsidy",
  "org": "Cerebral Palsy Association of BC",
  "whoFor": "BC minors with cerebral palsy who are current CPABC members and provide the required documentation",
  "offers": "Communication and writing aids, orthotics, positioning and mobility aids, home-accessibility equipment, electronic daily-living aids, and vision or hearing aids",
  "howToApply": "Download the current Equipment Subsidy application and submit it before the published cycle deadline",
  "audience": "children",
  "coverage": [
    "BC"
  ]
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name / org` | Equipment Subsidy; CPABC | **CONFIRMED** | “Equipment Subsidy – CPABC Financial Aids” |
| `whoFor / coverage` | BC | **CONFIRMED** | “supporting people in BC with cerebral palsy.” |
| `whoFor / audience` | Minors with cerebral palsy | **CONFIRMED** | “financial assistance to support minors with cerebral palsy” |
| `whoFor` | Current CPABC members | **CONFIRMED** | “The applicant must be a current member of the Cerebral Palsy Association of BC.” |
| `whoFor` | Required documentation | **CONFIRMED** | “The applicant must have a diagnosis of cerebral palsy. Documentation is required” |
| `offers` | Communication and writing aids | **CONFIRMED** | “Communication and writing aids” |
| `offers` | Orthotics | **CONFIRMED** | “Orthotic devices” |
| `offers` | Positioning and mobility aids | **CONFIRMED** | “Positioning and mobility aids” |
| `offers` | Home accessibility | **CONFIRMED** | “Home accessibility aids” |
| `offers` | Electronic daily-living aids | **CONFIRMED** | “Electronic aids to daily living” |
| `offers` | Vision or hearing aids | **CONFIRMED** | “Vision and hearing aids” |
| `howToApply` | Download current application and submit before published cycle deadline | **DIFFERS** | “The current application cycle for minors (ages 0–18) closes on August 31, 2026 at 11:59pm PST” — Snapshot cycle deadline is past; do not imply a currently open cycle or that the whole program ended. |
| `offers` | Unqualified equipment-category list | **DIFFERS** | “Funding may be available but is not limited to the following:” — Restore the page’s may-be-available qualifier. |

### grant:bear-essentials

Source: [`grant-bear-essentials.txt`](dir-snapshots/grant-bear-essentials.txt) — URL: https://islandkidsfirst.com/bear-essentials/ \| fetched: 2026-10-16T07:35:51.748550Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Bear Essentials health travel and equipment funding",
  "org": "Children's Health Foundation of Vancouver Island",
  "whoFor": "Children and youth up to age 19 living on Vancouver Island or surrounding islands who have a confirmed health challenge or disability and financial need",
  "offers": "Partial or supplementary help with health-related travel and equipment",
  "howToApply": "Ask a health professional familiar with the child to submit the referral-only application before travel or purchase",
  "audience": "children",
  "coverage": [
    "BC"
  ],
  "cities": [
    "Victoria",
    "Saanich"
  ],
  "ageBands": [
    "under6",
    "6to11",
    "12to15",
    "16to17",
    "18"
  ],
  "functionalNeeds": [
    "medicalTravel",
    "equipment"
  ],
  "lowIncome": true
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Bear Essentials | **CONFIRMED** | “Bear Essentials” |
| `org` | Children’s Health Foundation of Vancouver Island | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor / audience / ageBands` | Children and youth up to 19, listed age bands | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor / coverage / cities` | Vancouver Island or surrounding islands, Victoria and Saanich | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor` | Confirmed health challenge or disability | **NOT ON PAGE** | Not stated in this snapshot. |
| `whoFor / lowIncome` | Financial need | **NOT ON PAGE** | Not stated in this snapshot. |
| `name / offers / functionalNeeds` | Partial or supplementary health travel funding | **NOT ON PAGE** | Not stated in this snapshot. |
| `name / offers / functionalNeeds` | Partial or supplementary equipment funding | **NOT ON PAGE** | Not stated in this snapshot. |
| `howToApply` | Health professional familiar with child submits referral-only application | **NOT ON PAGE** | Not stated in this snapshot. |
| `howToApply` | Apply before travel or purchase | **NOT ON PAGE** | Not stated in this snapshot. |

### org:vad

Source: [`org-vad.txt`](dir-snapshots/org-vad.txt) — URL: https://vadsociety.ca \| fetched: 2026-10-16T07:35:52.597642Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Voice of Albertans with Disabilities",
  "region": "Alberta-wide (Edmonton office)",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Application appointments for AISH, CPP Disability, the Disability Tax Credit and the Canada Disability Benefit, plus advocacy, accessibility consulting and referrals"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Voice of Albertans with Disabilities | **CONFIRMED** | “Voice of Albertans with Disabilities (VAD)” |
| `region / coverage` | Alberta-wide | **CONFIRMED** | “across Alberta.” |
| `region` | Edmonton office | **CONFIRMED** | “105 Royal Alex Place 10106 111 Ave NW Edmonton, AB T5G 0B4” |
| `whatTheyDo` | AISH application appointments | **CONFIRMED** | “Type of Appointment Needed: * Canadian Disability Benefit (CDB) AISH CPPD” |
| `whatTheyDo` | CPP Disability application appointments | **CONFIRMED** | “Book An Appointment”; “AISH CPPD” |
| `whatTheyDo` | DTC appointments | **CONFIRMED** | “Disability Tax Credit” |
| `whatTheyDo` | Canada Disability Benefit appointments | **CONFIRMED** | “Canadian Disability Benefit (CDB)” |
| `whatTheyDo` | Advocacy | **CONFIRMED** | “Thank you for the recent disability advocacy” |
| `whatTheyDo` | Accessibility consulting | **CONFIRMED** | “Accessibility Consultation” |
| `whatTheyDo` | Referrals | **NOT ON PAGE** | Not stated in this snapshot. |

### org:inclusion-alberta

Source: [`org-inclusion-alberta.txt`](dir-snapshots/org-inclusion-alberta.txt) — URL: https://inclusionalberta.org \| fetched: 2026-10-16T07:35:53.982266Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Inclusion Alberta",
  "region": "Alberta-wide",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Individual and family advocacy for people with intellectual and developmental disabilities, family support, inclusive education and employment resources, and DTC/RDSP guidance"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Inclusion Alberta | **CONFIRMED** | “Inclusion Alberta” |
| `region / coverage` | Alberta-wide | **CONFIRMED** | “throughout the province both in-person and virtually.” |
| `whatTheyDo` | Individual and family advocacy | **CONFIRMED** | “Individual & Family Advocacy” |
| `whatTheyDo` | People with intellectual disabilities | **CONFIRMED** | “advocates on behalf of children and adults with intellectual disabilities and their families.” |
| `whatTheyDo` | Developmental disabilities as additional scope | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Family support | **CONFIRMED** | “Supportive Communities: Strengthening Families” |
| `whatTheyDo` | Inclusive education | **CONFIRMED** | “Inclusive Education” |
| `whatTheyDo` | Employment resources | **CONFIRMED** | “Inclusive Employment” |
| `whatTheyDo` | DTC/RDSP guidance | **CONFIRMED** | “RDSP/DTC” |

### org:cnib-ab

Source: [`org-cnib-ab.txt`](dir-snapshots/org-cnib-ab.txt) — URL: https://www.cnib.ca/en \| fetched: 2026-10-16T07:35:54.459277Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "CNIB Alberta",
  "region": "Alberta (province-wide programs)",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Programs for people who are blind or partially sighted, including daily-living skills, technology, employment and education support, guide dogs and community programming"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | CNIB | **CONFIRMED** | “CNIB” |
| `name / region / coverage` | Alberta province-wide programs (national page has no Alberta detail) | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Blind or partially sighted people | **CONFIRMED** | “Canadians who are blind or have low vision” |
| `whatTheyDo` | Daily-living skills | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Technology | **CONFIRMED** | “technology workshops” |
| `whatTheyDo` | Employment support | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Education support | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Guide dogs | **CONFIRMED** | “CNIB Guide Dogs” |
| `whatTheyDo` | Community programming | **CONFIRMED** | “Enjoy a day of recreational and social activities” |

### org:gateway

Source: [`org-gateway.txt`](dir-snapshots/org-gateway.txt) — URL: https://gatewayassociation.ca \| fetched: 2026-10-16T07:35:54.777271Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Gateway Association",
  "region": "Edmonton and Calgary",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Family and employment resource centres, one-to-one support and workshops for people with disabilities and families, including transition-to-adulthood help"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Gateway Association | **CONFIRMED** | “Gateway Association” |
| `region / coverage` | Edmonton and Calgary, Alberta | **CONFIRMED** | “EDMONTON AND CALGARY, AB” |
| `whatTheyDo` | Families and people with disabilities | **CONFIRMED** | “Empowering families and people who live with disabilities” |
| `whatTheyDo` | Family resource centre | **CONFIRMED** | “Family Resource Centre” |
| `whatTheyDo` | Employment resource centre | **CONFIRMED** | “Employment Resource Centre” |
| `whatTheyDo` | One-to-one support | **CONFIRMED** | “Job seekers receive one-on-one assistance” |
| `whatTheyDo` | Workshops | **CONFIRMED** | “We offer workshops for families, job seekers, employers” |
| `whatTheyDo` | Transition to adulthood | **CONFIRMED** | “Workshops cover topics such as transitioning to adulthood” |

### org:momentum

Source: [`org-momentum.txt`](dir-snapshots/org-momentum.txt) — URL: https://momentum.org \| fetched: 2026-10-16T07:35:55.181326Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Momentum",
  "region": "Calgary",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Financial empowerment for people living on low incomes through money-management programs, matched savings, skills training and microloans"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Momentum | **CONFIRMED** | “At Momentum, we believe in people.” |
| `region / coverage` | Calgary, Alberta | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Specifically low-income participants | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Financial empowerment / money-management programs | **CONFIRMED** | “Manage Your Money” |
| `whatTheyDo` | Matched savings | **CONFIRMED** | “$4.8M in matched savings earned” |
| `whatTheyDo` | Skills training | **CONFIRMED** | “Skills Training Program Alum” |
| `whatTheyDo` | Microloans | **CONFIRMED** | “3,100+ microloans” |

### org:sci-alberta

Source: [`org-sci-alberta.txt`](dir-snapshots/org-sci-alberta.txt) — URL: https://www.sci-ab.ca \| fetched: 2026-10-16T07:35:55.859213Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Spinal Cord Injury Alberta",
  "region": "Alberta-wide (Edmonton and Calgary)",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Peer and client support, service coordination, information and active-living programs for people with spinal cord injuries and other physical disabilities"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Spinal Cord Injury Alberta | **CONFIRMED** | “SCI Alberta” |
| `region / coverage` | Alberta-wide | **NOT ON PAGE** | Not stated in this snapshot. |
| `region` | Edmonton | **CONFIRMED** | “EDMONTON Neuro Rehab Centre” |
| `region` | Calgary location | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | People with spinal cord injuries | **CONFIRMED** | “persons with spinal cord injuries” |
| `whatTheyDo` | Other physical disabilities | **CONFIRMED** | “and other physical disabilities” |
| `whatTheyDo` | Peer support | **CONFIRMED** | “Peer Support” |
| `whatTheyDo` | Client support | **CONFIRMED** | “client support” |
| `whatTheyDo` | Service coordination | **CONFIRMED** | “service coordination” |
| `whatTheyDo` | Information services | **CONFIRMED** | “i nformation services” |
| `whatTheyDo` | Active living | **CONFIRMED** | “a ctive living” |

### org:autism-edmonton

Source: [`org-autism-edmonton.txt`](dir-snapshots/org-autism-edmonton.txt) — URL: https://www.autismedmonton.org \| fetched: 2026-10-16T07:35:57.455136Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Autism Edmonton",
  "region": "Edmonton and area",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Support, navigation, peer groups, workshops and community programs for autistic people and their families"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Autism Edmonton | **CONFIRMED** | “Autism Edmonton” |
| `region / coverage` | Edmonton and area service boundary (name alone is not a boundary) | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Autistic people | **CONFIRMED** | “Enhancing The Lives of Autistic People” |
| `whatTheyDo` | Families | **CONFIRMED** | “networking to support families is so important.” |
| `whatTheyDo` | Support and navigation | **CONFIRMED** | “Support & Resource Navigation” |
| `whatTheyDo` | Peer groups | **CONFIRMED** | “Peer Discussion Groups” |
| `whatTheyDo` | Workshops | **CONFIRMED** | “Workshops & Educational Events” |
| `whatTheyDo` | Community programs | **CONFIRMED** | “Community Connections” |

### org:employabilities

Source: [`org-employabilities.txt`](dir-snapshots/org-employabilities.txt) — URL: https://employabilities.ab.ca \| fetched: 2026-10-16T07:35:58.183918Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "EmployAbilities",
  "region": "Edmonton and northern Alberta",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Employment preparation, job support and training programs for people with disabilities, medical conditions and mental-health barriers"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | EmployAbilities | **CONFIRMED** | “EmployAbilities” |
| `region / coverage` | Edmonton and northern Alberta | **CONFIRMED** | “programs catered to different audiences across northern Alberta.”; “Our programs located in the Edmonton region” |
| `whatTheyDo` | Employment preparation | **CONFIRMED** | “Employment readiness” |
| `whatTheyDo` | Job support | **CONFIRMED** | “Strategies for job search” |
| `whatTheyDo` | Training | **CONFIRMED** | “skill development, education, employment programs” |
| `whatTheyDo` | People with disabilities | **CONFIRMED** | “adults and youth with disabilities” |
| `whatTheyDo` | Medical conditions | **CONFIRMED** | “medical conditions” |
| `whatTheyDo` | Mental-health barriers | **CONFIRMED** | “mental health challenges” |

### org:skills-society

Source: [`org-skills-society.txt`](dir-snapshots/org-skills-society.txt) — URL: https://www.skillssociety.ca \| fetched: 2026-10-16T07:35:58.746854Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Skills Society",
  "region": "Edmonton",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Daily-living and community supports for people with disabilities"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Skills Society | **CONFIRMED** | “Skills Society” |
| `region / coverage` | Edmonton service boundary (Edmonton-based project is not whole organization coverage) | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Daily-living supports | **CONFIRMED** | “Through daily living supports” |
| `whatTheyDo` | Community supports | **CONFIRMED** | “meaningful lives as valued citizens in community” |
| `whatTheyDo` | People with disabilities | **CONFIRMED** | “we work to help people with disabilities” |

### org:chrysalis

Source: [`org-chrysalis.txt`](dir-snapshots/org-chrysalis.txt) — URL: https://chrysalis.ca \| fetched: 2026-10-16T07:35:59.149021Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Chrysalis",
  "region": "Edmonton and Calgary",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Employment services, day programs and creative arts spaces for Albertans with developmental disabilities"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Chrysalis | **CONFIRMED** | “Chrysalis” |
| `region / coverage` | Edmonton and Calgary, Alberta | **CONFIRMED** | “Edmonton & calgary”; “Albertans with developmental disabilities” |
| `whatTheyDo` | Employment services | **CONFIRMED** | “Employment Services” |
| `whatTheyDo` | Day programs | **CONFIRMED** | “Day Programs” |
| `whatTheyDo` | Creative arts spaces | **CONFIRMED** | “Creative Arts Space” |
| `whatTheyDo` | Albertans with developmental disabilities | **CONFIRMED** | “Albertans with developmental disabilities” |

### org:eclc

Source: [`org-eclc.txt`](dir-snapshots/org-eclc.txt) — URL: https://www.eclc.ca \| fetched: 2026-10-16T07:35:59.728088Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Edmonton Community Legal Centre",
  "region": "Edmonton and northern Alberta",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Free legal help when income is a barrier, including income supports, employment, human rights, tenancy, debt and family law"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Edmonton Community Legal Centre | **CONFIRMED** | “The Edmonton Community Legal Centre (ECLC)” |
| `region / coverage` | Edmonton and northern Alberta | **CONFIRMED** | “free legal services to those in Edmonton and Northern Alberta.” |
| `whatTheyDo` | Free legal help when income is a barrier | **CONFIRMED** | “Where income poses a barrier to legal services” |
| `whatTheyDo` | Income supports | **CONFIRMED** | “Income Supports issues” |
| `whatTheyDo` | Employment | **CONFIRMED** | “Employment” |
| `whatTheyDo` | Human rights | **CONFIRMED** | “Human Rights” |
| `whatTheyDo` | Tenancy | **CONFIRMED** | “Landlord and Tenant” |
| `whatTheyDo` | Debt | **CONFIRMED** | “Debt” |
| `whatTheyDo` | Family law | **CONFIRMED** | “Family Law” |

### org:calgary-legal-guidance

Source: [`org-calgary-legal-guidance.txt`](dir-snapshots/org-calgary-legal-guidance.txt) — URL: https://clg.ab.ca \| fetched: 2026-10-16T07:36:01.575093Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Calgary Legal Guidance",
  "region": "Calgary",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Free legal information, advice and assistance for people who cannot afford a lawyer, including social benefits and other civil-law matters"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Calgary Legal Guidance | **CONFIRMED** | “Calgary Legal Guidance (CLG)” |
| `region / coverage` | Calgary, Alberta | **CONFIRMED** | “Alberta’s justice sector”; “support Calgarians” |
| `whatTheyDo` | Free legal help for people who cannot afford a lawyer | **CONFIRMED** | “CLG offers free legal guidance to people who cannot afford a lawyer” |
| `whatTheyDo` | Information | **CONFIRMED** | “Legal Information & Referral” |
| `whatTheyDo` | Advice and assistance | **CONFIRMED** | “legal education, advice, assistance and navigation.” |
| `whatTheyDo` | Social benefits | **CONFIRMED** | “Social Benefits Advocacy Program” |
| `whatTheyDo` | Other civil matters | **CONFIRMED** | “Family Law Program” |

### org:between-friends

Source: [`org-between-friends.txt`](dir-snapshots/org-between-friends.txt) — URL: https://www.betweenfriends.ab.ca \| fetched: 2026-10-16T07:36:02.185525Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Between Friends",
  "region": "Calgary",
  "coverage": [
    "AB"
  ],
  "whatTheyDo": "Social, recreation and camp programs where people with disabilities build friendships and community"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Between Friends | **CONFIRMED** | “Between Friends” |
| `region / coverage` | Calgary | **CONFIRMED** | “The Calgary Between Friends Club” |
| `whatTheyDo` | Social programs | **CONFIRMED** | “Social & Recreation Programs” |
| `whatTheyDo` | Recreation | **CONFIRMED** | “Social & Recreation Programs” |
| `whatTheyDo` | Camp | **CONFIRMED** | “Camp Bonaventure” |
| `whatTheyDo` | People with disabilities | **CONFIRMED** | “individuals with disabilities to have social interaction with peers” |
| `whatTheyDo` | Friendships and community | **CONFIRMED** | “helping create inclusive communities” |

### org:dabc

Source: [`org-dabc.txt`](dir-snapshots/org-dabc.txt) — URL: https://disabilityalliancebc.org \| fetched: 2026-10-16T07:36:02.514887Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Disability Alliance BC",
  "region": "British Columbia-wide",
  "coverage": [
    "BC"
  ],
  "whatTheyDo": "Cross-disability advocacy, benefits-navigation programs, plain-language help sheets, tax and DTC resources, and direct support through its Advocacy Access programs"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Disability Alliance BC | **CONFIRMED** | “Disability Alliance BC” |
| `region / coverage` | British Columbia-wide | **CONFIRMED** | “a provincial, cross-disability voice in British Columbia.” |
| `whatTheyDo` | Cross-disability advocacy | **CONFIRMED** | “systemic advocacy” |
| `whatTheyDo` | Benefits navigation | **CONFIRMED** | “Advocacy Access provides support, info & assistance with provincial & federal disability benefits.” |
| `whatTheyDo` | Help sheets | **CONFIRMED** | “BC Disability Benefits Help Sheets” |
| `whatTheyDo` | Help sheets specifically plain-language | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Tax resources | **CONFIRMED** | “File Income Taxes” |
| `whatTheyDo` | DTC resources | **CONFIRMED** | “Help with the DTC and Related Benefits” |
| `whatTheyDo` | Direct Advocacy Access support | **CONFIRMED** | “Advocacy Access provides support, info & assistance” |

### org:dabc-law-clinic

Source: [`org-dabc-law-clinic.txt`](dir-snapshots/org-dabc-law-clinic.txt) — URL: https://disabilityalliancebc.org/program/disability-law-clinic/ \| fetched: 2026-10-16T07:36:02.735389Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Disability Law Clinic",
  "region": "British Columbia-wide",
  "coverage": [
    "BC"
  ],
  "whatTheyDo": "Free confidential summary legal advice and referrals on selected disability-rights issues including discrimination, accommodations, services, transportation and post-secondary education"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Disability Law Clinic | **CONFIRMED** | “Disability Law Clinic” |
| `region / coverage` | BC-wide | **CONFIRMED** | “directly to persons with disabilities from across BC” |
| `whatTheyDo` | Free | **CONFIRMED** | “a free, confidential legal service” |
| `whatTheyDo` | Confidential | **CONFIRMED** | “a free, confidential legal service” |
| `whatTheyDo` | Summary advice and referrals in selected areas | **CONFIRMED** | “Summary Advice and Referral Service” |
| `whatTheyDo` | Discrimination | **CONFIRMED** | “Discrimination/human rights” |
| `whatTheyDo` | Accommodations | **CONFIRMED** | “Accommodation in the workplace” |
| `whatTheyDo` | Services | **CONFIRMED** | “Access to Services” |
| `whatTheyDo` | Transportation | **CONFIRMED** | “Transportation” |
| `whatTheyDo` | Post-secondary education | **CONFIRMED** | “Post-secondary education” |
| `whatTheyDo` | Currently providing summary advice without intake closure warning | **DIFFERS** | “the Disability Law Clinic has made the difficult decision to close intake, starting August 1, 2026 .”; “We expect to reopen early in 2027.” — Intake closed; referrals continue but responses may be delayed. Not a permanent program end. |

### org:fsi-bc

Source: [`org-fsi-bc.txt`](dir-snapshots/org-fsi-bc.txt) — URL: https://familysupportbc.com \| fetched: 2026-10-16T07:36:04.514756Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Family Support Institute of BC",
  "region": "British Columbia-wide",
  "coverage": [
    "BC"
  ],
  "whatTheyDo": "Free family-to-family support, information, training, resource navigation and interpretation for families of people of any age or disability; no diagnosis is required"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Family Support Institute of BC | **CONFIRMED** | “Family Support Institute of BC” |
| `region / coverage` | BC-wide | **CONFIRMED** | “For anyone, any age, any disability (including mental health and other concurrent conditions) within British Columbia.” |
| `whatTheyDo` | Free | **CONFIRMED** | “Free Supports and Services” |
| `whatTheyDo` | Family-to-family support | **CONFIRMED** | “Our free, family-to-family support network” |
| `whatTheyDo` | Information and resource navigation | **CONFIRMED** | “Tools and Resources Discover the tools and resources” |
| `whatTheyDo` | Training | **CONFIRMED** | “Workshops and Training” |
| `whatTheyDo` | Interpretation | **CONFIRMED** | “Free language interpretation for disability-related appointments and meetings.” |
| `whatTheyDo` | Families of any age or disability | **CONFIRMED** | “For anyone, any age, any disability” |
| `whatTheyDo` | No diagnosis required | **CONFIRMED** | “NO DIAGNOSIS NEEDED” |

### org:inclusion-bc

Source: [`org-inclusion-bc.txt`](dir-snapshots/org-inclusion-bc.txt) — URL: https://inclusionbc.org/what-we-do/individual-family-advocacy/ \| fetched: 2026-10-16T07:36:05.441099Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Inclusion BC",
  "region": "British Columbia-wide",
  "coverage": [
    "BC"
  ],
  "whatTheyDo": "Free individual and family advocacy for BC residents facing barriers to inclusion, with guidance and connections to appropriate services"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Inclusion BC | **CONFIRMED** | “Inclusion BC” |
| `region / coverage` | BC-wide | **CONFIRMED** | “We serve the entire province” |
| `whatTheyDo` | Free | **CONFIRMED** | “Our advocacy services are free” |
| `whatTheyDo` | Individual and family advocacy | **CONFIRMED** | “Individual & Family Advocacy” |
| `whatTheyDo` | BC residents facing inclusion barriers | **CONFIRMED** | “If you are a resident of British Columbia, and are facing barriers to inclusion yourself, or have a family member who is, the answer is yes!” |
| `whatTheyDo` | Guidance | **CONFIRMED** | “listen, support, guide, inform, and advise” |
| `whatTheyDo` | Connections to appropriate services | **CONFIRMED** | “we can connect you with the right person or organization.” |

### org:neil-squire

Source: [`org-neil-squire.txt`](dir-snapshots/org-neil-squire.txt) — URL: https://www.neilsquire.ca/individual-programs-services/ \| fetched: 2026-10-16T07:36:06.252771Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Neil Squire",
  "region": "British Columbia and national programs",
  "coverage": [
    "BC"
  ],
  "whatTheyDo": "Employment programs, digital-skills support and assistive-technology services, including province-wide WorkBC Assistive Technology Services"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Neil Squire | **CONFIRMED** | “Neil Squire Society” |
| `region / coverage` | BC and national programs | **CONFIRMED** | “available online anywhere in Canada.”; “WorkBC Assistive Technology Services” |
| `whatTheyDo` | Employment programs | **CONFIRMED** | “Creative Employment Options” |
| `whatTheyDo` | Digital skills | **CONFIRMED** | “Computer Comfort” |
| `whatTheyDo` | Assistive technology services | **CONFIRMED** | “Assistive Technology Programs” |
| `whatTheyDo` | WorkBC Assistive Technology Services | **CONFIRMED** | “WorkBC Assistive Technology Services (new window) , operated by Neil Squire” |
| `whatTheyDo` | WorkBC service province-wide | **CONFIRMED** | “Services are provided to employers, employees, and self-employed individuals located in all communities in British Columbia, either in-person, via outreach, or virtually.” |

### org:autism-bc

Source: [`org-autism-bc.txt`](dir-snapshots/org-autism-bc.txt) — URL: https://www.autismbc.ca/programs/support/ask-autismbc/ \| fetched: 2026-10-16T07:36:07.293996Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "AutismBC",
  "region": "British Columbia-wide",
  "coverage": [
    "BC"
  ],
  "whatTheyDo": "Credible autism information, guidance about BC systems and funding, workshops, peer connection and community programs; it does not complete forms or provide case advocacy"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | AutismBC | **CONFIRMED** | “AutismBC” |
| `region / coverage` | BC-wide | **CONFIRMED** | “information and support across British Columbia” |
| `whatTheyDo` | Credible autism information | **CONFIRMED** | “accurate, community-grounded” |
| `whatTheyDo` | Guidance on BC systems and funding | **CONFIRMED** | “local services, funding, education, assessments, or supports.” |
| `whatTheyDo` | Workshops | **CONFIRMED** | “Educational workshops” |
| `whatTheyDo` | Peer connection | **CONFIRMED** | “Peer support groups” |
| `whatTheyDo` | Community programs | **CONFIRMED** | “AutismBC’s community programs” |
| `whatTheyDo` | Does not complete forms | **CONFIRMED** | “We do not complete or submit funding forms” |
| `whatTheyDo` | Does not provide case advocacy | **CONFIRMED** | “We do not offer individual advocacy or case-specific intervention.” |

### org:wavefront

Source: [`org-wavefront.txt`](dir-snapshots/org-wavefront.txt) — URL: https://www.wavefrontcentre.ca \| fetched: 2026-10-16T07:36:08.802739Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Wavefront Centre for Communication Accessibility",
  "region": "British Columbia (Lower Mainland offices and outreach)",
  "coverage": [
    "BC"
  ],
  "whatTheyDo": "Non-profit hearing healthcare, accessibility services, DeafBlind services, employment support and community outreach for people who are Deaf, DeafBlind or Hard of Hearing"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Wavefront Centre for Communication Accessibility | **CONFIRMED** | “Wavefront Centre for Communication Accessibility” |
| `region` | Lower Mainland offices | **CONFIRMED** | “Mount Pleasant Vancouver More Info Kitsilano Vancouver More Info Tri-Cities Port Coquitlam” |
| `region / coverage` | British Columbia offices/services (entry does not say province-wide) | **CONFIRMED** | “Vancouver, BC V5T 2Z6”; “Port Coquitlam, BC, V3B 5Y9” |
| `whatTheyDo` | Non-profit | **CONFIRMED** | “As a charitable non-profit and social enterprise” |
| `whatTheyDo` | Hearing healthcare | **CONFIRMED** | “hearing healthcare” |
| `whatTheyDo` | Accessibility services | **CONFIRMED** | “accessibility services” |
| `whatTheyDo` | DeafBlind services | **CONFIRMED** | “DeafBlind services” |
| `whatTheyDo` | Employment support | **CONFIRMED** | “employment support” |
| `whatTheyDo / region` | Community outreach | **CONFIRMED** | “community outreach” |
| `whatTheyDo` | Deaf, DeafBlind or Hard of Hearing | **CONFIRMED** | “people who are Deaf, DeafBlind, and Hard of Hearing.” |

### org:sci-bc

Source: [`org-sci-bc.txt`](dir-snapshots/org-sci-bc.txt) — URL: https://sci-bc.ca \| fetched: 2026-10-16T07:36:09.309573Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Spinal Cord Injury BC",
  "region": "British Columbia-wide",
  "coverage": [
    "BC"
  ],
  "whatTheyDo": "Peer support, practical information and community connection for people with spinal cord injuries and related disabilities and their families"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Spinal Cord Injury BC | **CONFIRMED** | “Spinal Cord Injury BC” |
| `region / coverage` | British Columbia-wide | **CONFIRMED** | “events happening throughout the province every week.” |
| `whatTheyDo` | People with spinal cord injuries and related disabilities | **CONFIRMED** | “people with spinal cord injuries and related disabilities in British Columbia” |
| `whatTheyDo` | Families | **CONFIRMED** | “their families, and other stakeholders in British Columbia.” |
| `whatTheyDo` | Peer support | **CONFIRMED** | “Our Peer Program” |
| `whatTheyDo` | Practical information | **CONFIRMED** | “information on living well with a spinal cord injury in BC.” |
| `whatTheyDo` | Community connection | **CONFIRMED** | “events happening throughout the province every week.” |

### org:bc-211

Source: [`org-bc-211.txt`](dir-snapshots/org-bc-211.txt) — URL: https://bc.211.ca \| fetched: 2026-10-16T07:36:09.677861Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "211 British Columbia",
  "region": "British Columbia-wide",
  "coverage": [
    "BC"
  ],
  "whatTheyDo": "Searchable and phone-based navigation for disability, financial, food, housing, legal, health, employment, transportation and family services"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | 211 British Columbia | **CONFIRMED** | “211 British Columbia” |
| `region / coverage` | Explicit whole-province service boundary | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Searchable navigation | **CONFIRMED** | “Try a keyword search below.” |
| `whatTheyDo` | Phone navigation | **CONFIRMED** | “Resource Navigators will be available by phone, text, or web chat” |
| `whatTheyDo` | Disability services | **CONFIRMED** | “Disabilities” |
| `whatTheyDo` | Financial services | **CONFIRMED** | “Financial Assistance” |
| `whatTheyDo` | Food services | **CONFIRMED** | “Food and Basic Goods” |
| `whatTheyDo` | Housing services | **CONFIRMED** | “Housing” |
| `whatTheyDo` | Legal services | **CONFIRMED** | “Legal and Advocacy” |
| `whatTheyDo` | Health services | **CONFIRMED** | “Health Care” |
| `whatTheyDo` | Employment services | **CONFIRMED** | “Employment” |
| `whatTheyDo` | Transportation services | **CONFIRMED** | “Transportation” |
| `whatTheyDo` | Family services | **CONFIRMED** | “Children and Families” |

### org:arch-disability-law

Source: [`org-arch-disability-law.txt`](dir-snapshots/org-arch-disability-law.txt) — URL: https://archdisabilitylaw.ca \| fetched: 2026-10-16T07:36:10.980824Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "ARCH Disability Law Centre",
  "region": "Ontario-wide",
  "coverage": [
    "ON"
  ],
  "whatTheyDo": "Specialty legal clinic providing legal services directly to persons with disabilities with low income in Ontario, dedicated to defending and advancing their equality rights, entitlements, fundamental freedoms and inclusion"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | ARCH Disability Law Centre | **CONFIRMED** | “ARCH Disability Law Centre” |
| `region / coverage` | Ontario-wide | **CONFIRMED** | “persons with disabilities with low income in Ontario.” |
| `whatTheyDo` | Specialty legal clinic | **CONFIRMED** | “specialty legal clinic” |
| `whatTheyDo` | Direct legal services to disabled persons | **CONFIRMED** | “ARCH provides a range of legal services directly to persons with disabilities.” |
| `whatTheyDo` | Low income | **CONFIRMED** | “with low income in Ontario.” |
| `whatTheyDo` | Defending and advancing equality rights | **CONFIRMED** | “equality rights” |
| `whatTheyDo` | Defending and advancing entitlements | **CONFIRMED** | “entitlements” |
| `whatTheyDo` | Defending and advancing fundamental freedoms | **CONFIRMED** | “fundamental freedoms” |
| `whatTheyDo` | Defending and advancing inclusion | **CONFIRMED** | “inclusion” |

### org:autism-ontario

Source: [`org-autism-ontario.txt`](dir-snapshots/org-autism-ontario.txt) — URL: https://www.autismontario.com \| fetched: 2026-10-16T07:36:11.394108Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Autism Ontario",
  "region": "Ontario-wide (seven regions)",
  "coverage": [
    "ON"
  ],
  "whatTheyDo": "Ontario autism information and referral, community representation, adult assessment resources, awards and funding, mental-health and ODSP-transition resources, housing resources, Autism Career Connections, children and youth programs, and webinars"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Autism Ontario | **CONFIRMED** | “Autism Ontario” |
| `region / coverage` | Ontario-wide service coverage (local events do not establish full coverage) | **NOT ON PAGE** | Not stated in this snapshot. |
| `region` | Seven regions | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Information and referral | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Community representation | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Adult assessment resources | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Awards and funding | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Mental-health resources | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | ODSP-transition resources | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Housing resources | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Autism Career Connections | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Webinars | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Children and youth programs | **CONFIRMED** | “Autism Ontario Brings Robotics to Life for Scarborough Youth” |

### org:sci-ontario

Source: [`org-sci-ontario.txt`](dir-snapshots/org-sci-ontario.txt) — URL: https://www.sciontario.org \| fetched: 2026-10-16T07:36:12.004167Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Spinal Cord Injury Ontario",
  "region": "Ontario-wide",
  "coverage": [
    "ON"
  ],
  "whatTheyDo": "A consultation to learn how its services can be tailored to your situation, for free, followed by peer support, employment support, service navigation and equipment access for people with disabilities"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Spinal Cord Injury Ontario | **CONFIRMED** | “Spinal Cord Injury Ontario” |
| `region / coverage` | Ontario-wide | **CONFIRMED** | “services to individuals living with spinal cord injuries across Ontario.” |
| `whatTheyDo` | Tailored consultation | **CONFIRMED** | “Begin with a consultation to learn how SCIO can provide tailored services to your unique situation, for free.” |
| `whatTheyDo` | Free consultation | **CONFIRMED** | “for free.” |
| `whatTheyDo` | Peer support | **CONFIRMED** | “Peer Support” |
| `whatTheyDo` | Employment support | **CONFIRMED** | “Accessible Employment Services” |
| `whatTheyDo` | Service navigation | **CONFIRMED** | “Service Navigation” |
| `whatTheyDo` | Equipment access | **CONFIRMED** | “Access the equipment you need to live your life.” |
| `whatTheyDo` | People with disabilities | **CONFIRMED** | “Empowering people with a disability.” |

### org:easter-seals-ontario

Source: [`org-easter-seals-ontario.txt`](dir-snapshots/org-easter-seals-ontario.txt) — URL: https://services.easterseals.org \| fetched: 2026-10-16T07:36:12.419037Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Easter Seals Ontario",
  "region": "Ontario-wide, for children, youth and young adults",
  "coverage": [
    "ON"
  ],
  "whatTheyDo": "Help for children, youth and young adults with physical disabilities. Child registration comes first and is required before applying for equipment funding or camp; services also include mobility and accessibility equipment funding, incontinence-supplies grants, and Camp Merrywood and Camp Woodeden"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Easter Seals Ontario | **CONFIRMED** | “Easter Seals Ontario” |
| `region / coverage` | Explicit Ontario-wide service boundary | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo / region` | Children, youth and young adults with physical disabilities | **CONFIRMED** | “kids, youth, and young adults with physical disabilities.” |
| `whatTheyDo` | Child registration before equipment or camp | **CONFIRMED** | “Your child must be registered as an Easter Seals Ontario client to apply to the Equipment Funding Program or to attend an Easter Seals Ontario camp.” |
| `whatTheyDo` | Mobility and accessibility equipment funding | **CONFIRMED** | “funding for essential mobility and accessibility equipment” |
| `whatTheyDo` | Incontinence supplies grants | **CONFIRMED** | “Incontinence Supplies Grant and Top Up Grant” |
| `whatTheyDo` | Camp Merrywood | **CONFIRMED** | “Camp Merrywood” |
| `whatTheyDo` | Camp Woodeden | **CONFIRMED** | “Camp Woodeden” |

### org:march-of-dimes-canada

Source: [`org-march-of-dimes-canada.txt`](dir-snapshots/org-march-of-dimes-canada.txt) — URL: https://www.marchofdimes.ca/en-ca \| fetched: 2026-10-16T07:36:12.684265Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "March of Dimes Canada",
  "region": "Canada-wide; delivers Ontario's Home and Vehicle Modification Program",
  "coverage": [
    "ON"
  ],
  "whatTheyDo": "Disability services throughout Canada, including the Home and Vehicle Modification® Program (HVMP). If you matched AbilityFinder's HVMP benefit record, this is the organization you apply to; its site also lists Manitoba Safe and Healthy Home for Seniors and low-cost or no-cost home-modification resources"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | March of Dimes Canada (empty snapshot body) | **NOT ON PAGE** | Not stated in this snapshot. |
| `region / whatTheyDo` | Canada-wide disability services | **NOT ON PAGE** | Not stated in this snapshot. |
| `region / coverage / whatTheyDo` | Ontario HVMP delivery | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | HVMP applicants apply to this organization (internal match advice depends on this external fact) | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Manitoba Safe and Healthy Home for Seniors | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Low-cost or no-cost home-modification resources | **NOT ON PAGE** | Not stated in this snapshot. |

### org:canadian-hearing-services

Source: [`org-canadian-hearing-services.txt`](dir-snapshots/org-canadian-hearing-services.txt) — URL: https://www.chs.ca \| fetched: 2026-10-16T07:36:13.066622Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Canadian Hearing Services",
  "region": "National organization; hearing clinics in Toronto, Mississauga, Hamilton, London, Windsor, Kingston, Ottawa and Sudbury",
  "coverage": [
    "ON"
  ],
  "whatTheyDo": "Programs, services, education and products that help Deaf and hard of hearing people overcome barriers to participation, building on 85 years of experience as a Canadian not-for-profit"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Canadian Hearing Services | **CONFIRMED** | “Canadian Hearing Services” |
| `region` | National organization | **CONFIRMED** | “Deaf and Hard of Hearing Canadians” |
| `region` | Hearing clinic in Toronto | **NOT ON PAGE** | Not stated in this snapshot. |
| `region` | Hearing clinic in Mississauga | **NOT ON PAGE** | Not stated in this snapshot. |
| `region` | Hearing clinic in Hamilton | **NOT ON PAGE** | Not stated in this snapshot. |
| `region` | Hearing clinic in London | **NOT ON PAGE** | Not stated in this snapshot. |
| `region` | Hearing clinic in Windsor | **NOT ON PAGE** | Not stated in this snapshot. |
| `region` | Hearing clinic in Kingston | **NOT ON PAGE** | Not stated in this snapshot. |
| `region` | Hearing clinic in Ottawa | **NOT ON PAGE** | Not stated in this snapshot. |
| `region` | Hearing clinic in Sudbury | **NOT ON PAGE** | Not stated in this snapshot. |
| `coverage` | Ontario service coverage | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Programs and services | **CONFIRMED** | “free counselling, literacy programs, and newcomer services” |
| `whatTheyDo` | Education | **CONFIRMED** | “National Scholarship Program” |
| `whatTheyDo` | Products | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Deaf and hard of hearing people | **CONFIRMED** | “Deaf and hard of hearing Canadians” |
| `whatTheyDo` | Overcoming participation barriers | **CONFIRMED** | “fully participate in your community.” |
| `whatTheyDo` | 85 years of experience | **CONFIRMED** | “For over 85 years, Canadian Hearing Services has provided trusted solutions” |
| `whatTheyDo` | Canadian not-for-profit status | **NOT ON PAGE** | Not stated in this snapshot. |

### org:211-ontario

Source: [`org-211-ontario.txt`](dir-snapshots/org-211-ontario.txt) — URL: https://211ontario.ca \| fetched: 2026-10-16T07:36:13.645698Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "211 Ontario",
  "region": "Ontario-wide",
  "coverage": [
    "ON"
  ],
  "whatTheyDo": "A bilingual helpline that connects people to the social services, programs and community supports they need"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | 211 Ontario | **CONFIRMED** | “211 Ontario” |
| `region / coverage` | Explicit Ontario-wide service boundary | **NOT ON PAGE** | Not stated in this snapshot. |
| `whatTheyDo` | Bilingual helpline | **CONFIRMED** | “English Welcome Français Bienvenue”; “211 is a helpline” |
| `whatTheyDo` | Connects people to social services | **CONFIRMED** | “connects people to the social services” |
| `whatTheyDo` | Programs | **CONFIRMED** | “programs and community supports they need.” |
| `whatTheyDo` | Community supports | **CONFIRMED** | “programs and community supports they need.” |

### org:steps-to-justice

Source: [`org-steps-to-justice.txt`](dir-snapshots/org-steps-to-justice.txt) — URL: https://stepstojustice.ca \| fetched: 2026-10-16T07:36:14.807731Z \| status: 200.

Original factual fields (matching metadata included):

```json
{
  "name": "Steps to Justice",
  "region": "Ontario-wide",
  "coverage": [
    "ON"
  ],
  "whatTheyDo": "Self-serve practical legal information from Community Legal Education Ontario (CLEO), with printable tipsheets and free online Guided Pathways interviews to fill out legal forms, draft documents and identify next steps"
}
```

| Field(s) | Entry assertion | Classification | Snapshot quote / difference |
|---|---|---|---|
| `name` | Steps to Justice | **CONFIRMED** | “Steps to Justice” |
| `region / coverage` | Ontario legal information | **CONFIRMED** | “Free information about legal problems in Ontario.” |
| `whatTheyDo` | Self-serve practical legal information | **CONFIRMED** | “Reliable, practical, and easy to understand.” |
| `whatTheyDo` | CLEO | **CONFIRMED** | “CLEO is pleased to announce 3 new collections of Guided Pathways” |
| `whatTheyDo` | Printable tipsheets | **CONFIRMED** | “Steps to Justice has printable tipsheets” |
| `whatTheyDo` | Free online Guided Pathways interviews | **CONFIRMED** | “Guided Pathways Use CLEO's free online interviews” |
| `whatTheyDo` | Fill out legal forms | **CONFIRMED** | “fill out legal forms” |
| `whatTheyDo` | Draft documents | **CONFIRMED** | “draft documents” |
| `whatTheyDo` | Identify next steps | **CONFIRMED** | “identify your next steps.” |

## Shipping procedure and verification

- Asset version **187 → 188** in all shared pins in `public/index.html` and matching font URLs in `public/styles.css`; regenerated guide stylesheet references inherit version 188. No monetary data containing the digits 187 was altered.
- Added a dated `DATA_CHANGELOG` entry in `public/changelog.js`. Kept entry verification dates unchanged rather than implying unsupported facts were confirmed.
- Checked `scripts/` for grants/orgs consumers: `scripts/gen-benefits-context.js` loads both directory files and passes them to `scripts/link-sources.js`'s `buildLinkCatalogue`. Ran `npm run gen:context`: 219 checkable links, 4 dynamic links skipped. Reviewed generated diffs: `src/benefits-context.js` and `src/links.js` are unchanged because directory descriptions are not emitted into benefit grounding and no source URL changed.
- Ran `npm run gen:guides`: 133 benefit pages + guide index regenerated (134 benefits; `local-supports` has no static official source and is deliberately skipped). Guide changes are version pins only; sitemap unchanged.
- `npm test`: **207 passed, 0 failed, 0 skipped**. Log: `outputs/directories-unit.log`.
- `npx playwright test --project=app-chromium --workers=1`: **278 passed, 0 failed**, whole project, 4.0 minutes (final run after preserving original CP Cares age scope and legal-clinic topic examples). Log: `outputs/directories-playwright.log`. Listing parity: `npx playwright test --project=app-chromium --workers=1 --list` lists **278 tests in 25 files**, matching all 278 executed and passed. Listing log: `outputs/directories-playwright-listed.log`.
- No commit, push or deployment. No edits to `TASKVIEW-*.md`, `AGENTS.md`, `OWNER-DIGEST.md` or `.taskview/`. Existing unrelated untracked files were preserved.

## #223 follow-up

Resolved the 12 requested risky NOT ON PAGE follow-ups, using the supplied official snapshots (including the existing real-browser re-reads) and three additional official pages fetched with a browser User-Agent on 2026-10-16. New source files have a first line `URL | fetched | status`. The October 19 report/changelog date remains the batch label, not a claim of an October 19 fetch. Earlier tables and the original open queue are historical; the decisions below supersede only the listed items. Whole-entry verification dates are unchanged.

`audience: "all"` is an internal no-exclusion value, not a displayed promise of all-ages eligibility. Numeric `ageBands` are omitted where no official numeric boundary was found. The app's `children` audience gate excludes self-applicants aged 18 or older; its `adults` gate can exclude someone applying for their adult child. Broad children/youth/adults labels therefore remain in the fund's own wording rather than becoming unsupported hard gates. Overlapping bands are included in full: `6to11` includes Shine's 11-year-olds, and `19to59` includes Shine's 19–21-year-olds and Bear's 19-year-olds. These are leads to check, not promises that every age in a coarse band qualifies.

| Item | Decision | Quote / official source |
| --- | --- | --- |
| #41 bc-rehab-bursary deadline | **Supported differently → fix.** The linked application does state a deadline, but it is past. Remove the suggestion of a current deadline on the landing page; application instructions state September 1, 2026 for the completed application and required documents, note that it has passed, and advise checking the next cycle. | “This completed application and all required supporting documentation must be received by BC Rehab on or before September 1st, 2026 to be eligible for consideration.” `bc-rehab-bursary--extra.txt`, https://bcrehab.org/applications/gert-vorsteher-education/gert-vorsteher-education-application/ |
| #43 bear-essentials age bands | **Supported differently → fix.** Make ages 0–19, up to the 20th birthday, explicit. Add overlapping `19to59` and use no audience exclusion, so 18/19-year-old self-applicants are not hidden. | “Age: 0 to 19 years old (up to 20th birthday)” `grant-bear-essentials.txt`; also `bear-essentials--extra.txt`, https://islandkidsfirst.com/bear-essentials/ |
| #11 variety-ab under-18 bands | **Scope confirmed, numeric cutoff unstated → soften.** Keep children/youth wording, add specialized needs as stated, remove under-18 bands and use no audience exclusion; advise checking individual program eligibility. No linked program eligibility text was available in the browser snapshot (program list showed “Loading programs...”). | “supports children and youth with disabilities and specialized needs across Alberta” `grant-variety-ab.txt`, https://varietyalberta.ca |
| #32 shine-dreams age bands | **Supported differently → fix.** FAQ states 11–21, not the previous under-six-through-18 bands. State exact range and residence-status conditions in `whoFor`; remove `under6`, include overlapping `6to11` through `19to59`, use no audience exclusion. | “Young people in Canada aged 11–21 living with severe physical disabilities”; “You must be a Canadian citizen, permanent resident, or a person to whom refugee protection has been conferred under the Immigration and Refugee Protection Act.” `shine-dreams--extra.txt`, https://www.shinefoundation.ca/dream-faq |
| #37 cknw-kids-fund age bands | **Numeric cutoff still unstated → soften.** Keep child/family scope, remove numeric bands and audience exclusion; direct readers to the application for age eligibility. | “CKNW Kids' Fund accepts grant applications from both individual families and organizations in BC that are focused on children’s programs and special projects.” The snapshot gives no numeric age cutoff. `grant-cknw-kids-fund.txt`, https://www.cknwkidsfund.com/what-is-cknw-kids-fund-adgrant |
| #38 kinsmen-bc-equipment age bands | **Adult scope confirmed, exact boundary unstated → soften.** Retain “Adults” in `whoFor`, remove numeric bands and audience exclusion, advise checking age eligibility. This avoids interpreting an unnumbered adult label as an exact 18 boundary or excluding an adult child because of the questionnaire's `forWho` answer. | “Our mandate is to support adults in British Columbia living with a wide range of physical disabilities” `grant-kinsmen-bc-equipment.txt`, https://www.kinsmenfoundationofbc.ca/apply-for-funding/ |
| #40 bc-rehab-bursary age bands | **Adult-only restriction still unstated → soften.** Remove adult-only audience and numeric bands; keep post-secondary scope and direct readers to eligibility. The 18–25 preference on the landing page belongs to the separate GRAGOPEAN scholarship, not this bursary. The linked bursary application asks date of birth but sets no numeric eligibility limit. | “British Columbians with a physical disability who intend to pursue post-secondary education that will lead to employment and greater personal independence.” `grant-bc-rehab-bursary.txt` and `bc-rehab-bursary--extra.txt`, official URLs above. |
| #4 tetra “all ages” | **All-ages eligibility unstated → keep only the least-excluding internal flag.** Keep `audience: "all"` and no numeric bands. No visible all-ages promise exists or is added; existing physical-disability wording remains. | “Tetra builds innovative solutions for people with physical disabilities.” `grant-tetra.txt`, https://tetrasociety.org |
| #19 dog-guides “all ages” | **All-ages eligibility unstated → keep only the least-excluding internal flag.** Keep `audience: "all"` and no numeric bands, not an all-ages claim. `whoFor` already says applicants must meet the requirements of one of the foundation's programs. | “Your support will empower a Canadian living with a disability with a Dog Guide at no cost to them.” `grant-dog-guides.txt`, https://www.dogguides.com |
| #28 als-ab-equipment “all ages” | **All-ages eligibility unstated → keep only the least-excluding internal flag.** Keep `audience: "all"` and no numeric bands; no all-ages promise. Preserve `matchOnResults: false` for the diagnosis-specific program. | “Through our provincial Equipment Loan Program, we are able to assist people living with ALS” `grant-als-ab-equipment.txt`, https://alsab.ca |
| #46 bear-essentials financial need / lowIncome | **Financial need CONFIRMED → keep; filter supported differently → fix.** Preserve need in the wording, set `lowIncome: false`: need for support with the requested costs is not a stated household-income threshold. The app's generic flag rejects `income: "high"`, which could exclude a family the page may include. Also state the lifetime maximum, not an annual or per-request amount. | “Financial need: Require financial support to cover the cost of the item(s) in the application”; “Funding limit: Have not exceeded the lifetime Bear Essentials maximum of $15,000” `grant-bear-essentials.txt` and `bear-essentials--extra.txt`, https://islandkidsfirst.com/bear-essentials/ |
| #50 bear-essentials apply before travel or purchase | **Supported differently → strengthen.** Advance application alone is insufficient: explicitly require receipt **and approval** before travel or equipment purchase. Retain referral-only application by a health care professional familiar with the child's needs/family circumstances, with parent/primary guardian consent. | Expanded FAQ: “No. Applications must be received and approved in advance of travel or equipment purchase.” Referral text: “A health care professional familiar with a child's needs and family circumstances must complete the online application on their behalf, with the consent of the applicant's parent or primary guardian.” `bear-essentials--extra.txt` (apostrophe typography normalized for this quote), https://islandkidsfirst.com/bear-essentials/ |

### Counts and verification

- **12 items dispositioned across 9 grants: 5 supported differently and corrected (#41, #43, #32, #46, #50), 4 unsupported numeric restrictions softened (#11, #37, #38, #40), 3 no-exclusion flags retained without claiming official all-ages eligibility (#4, #19, #28).** Financial need within #46 is confirmed; only its inappropriate generic income gate is removed. Six grant records changed (22 field changes); three remain unchanged. Other original open items remain out of scope.
- Province/coverage arrays, cities, diagnosis/functional-need filters and whole-entry `verified` dates are unchanged. No organization data changed.
- Asset version **188 → 189** in all shared index/font pins; generated guide stylesheet pins inherit 189. Historical changelog mentions of older versions remain historical.
- Added a dated changelog entry and targeted unit/browser regressions for age-band overlap, unknown age boundaries, high-income financial need, and displayed deadline/approval wording.
- Ran `npm run gen:context`: 219 checkable links, 4 dynamic links skipped; generated `src/benefits-context.js` and `src/links.js` are unchanged. Ran `npm run gen:guides`: 133 benefit pages plus guide index; all 134 generated HTML files have version-pin-only changes; sitemap unchanged.
- `npm test`: **209 passed, 0 failed, 0 skipped**, including two new #223 regressions. Log: `outputs/task223-unit.log`.
- `npx playwright test --project=app-chromium --workers=1`: **280 passed, 0 failed**, whole project, no retries, 4.1 minutes, including two new #223 regressions. Log: `outputs/task223-playwright.log`. Listing parity: **280 tests in 25 files**, log `outputs/task223-playwright-listed.log`.
- Compared every grant against `HEAD`: coverage/cities, disabilities/functionalNeeds and verification dates are unchanged. Checked every current index/font/generated-guide pin: all use 189, none retain `v=188`. `git diff --check` passed.
- Preserved the three pre-existing snapshot edits and unrelated untracked files. Saved only three new official-page snapshots: `bear-essentials--extra.txt`, `bc-rehab-bursary--extra.txt`, `shine-dreams--extra.txt`. No commit, push or deployment.
