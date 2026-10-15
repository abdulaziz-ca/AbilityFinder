# TaskView #214 — implementation and evidence inventory

## Shipped scope

- Results-only compact English panel, marked `lang="en"`, after the Results heading.
- Current ready/almost matches plus every valid tracker stage; no previous-results history and no guide-page mirror.
- Native `details` / “Show the updates”; one “Got it” button with accessible name “Got it, hide these updates” (contains the visible text for WCAG 2.5.3).
- Explicit acknowledgment advances only listed program IDs to the rendered notice's captured publication watermark.
- A stable, focused polite status reports successful persistence or the specified failure copy. Non-conflict failure restores the previous listed-program cursors in memory, retains the panel and re-enables “Got it” with the failure copy; later unrelated saves cannot persist the failed acknowledgment. Conflicts retain the existing authoritative reload, without stale retries.
- Guide links follow the generator's static-official-URL publication criterion; unpublished records such as `local-supports` omit the guide link while retaining the official-source link.
- No feature localStorage, cookies, network calls, event history, timestamps, or remote identifier.
- Existing snapshot payload schema is now 2; `ui.programChanges` contains only `version` and `seenByProgram`. No IndexedDB database/store version change.
- Invalid/missing markers show no notice; baseline writes occur after restore and a successful initial meaningful render. Newly added IDs baseline silently. Clear/tombstone behavior remains in the existing DB manager.
- Old builds may drop this optional field when saving: the next new-build visit safely establishes a silent baseline. No compatibility-retention machinery was added.

## Backfill

**12 annotated changelog entries / revisions, 96 distinct catalogue records, 100 record–batch pairs, 106 record/kind summaries.**

Evidence includes FIX dispositions in the supplied `research/reverify/DECISIONS-*.md`, applied fixes in `REPORT-2026-10-17-followups.md`, batch one's DIFFERS/applied-fixes/review-round sections in `REPORT-2026-10-14.md`, and Kelowna items 6–13 in `REPORT-2026-10-15-batch3-partC.md` as released in `93d1655`. Batch one annotates only the seven actually fixed records (ten record/kind summaries): Healthy Kids, medical transportation, At Home Medical, Additional Home Owner Grant, fuel tax, Sales Tax Credit and Burnaby FAIR Play. CSG item 1 was NO CHANGE; MSP Supplementary Benefits and the unresolved Healthy Kids exclusion remain unannotated. No historical membership was inferred from counts, names in public prose, review dates, or automatic diffs. Summaries do not repeat figures. This is an intentionally non-exhaustive description of each affected record, not a catalogue-wide change detector.

The supplied public changelog is newest first. Revisions follow release order, oldest first, including same-day releases. This review safely renumbered the still-undeployed metadata: `b608154` (batch 1), `4c0f4e4` (batch 2), `93d1655` (Kelowna), then `dc23374` (batch 3). The shipped catalogue determines availability, not the device clock. These revisions describe the supplied checkout's releases, not a claim about a live deployment; this task did not deploy anything.

| Revision | Supplied date | Evidence | Distinct records | Summaries |
|---|---|---|---:|---:|
| 1 | 2026-10-15 | REPORT-2026-10-14.md — batch 1, applied fixes and review round (`b608154`) | 7 | 10 |
| 2 | 2026-10-15 | DECISIONS-2026-10-15-batch2.md (`4c0f4e4`) | 10 | 10 |
| 3 | 2026-10-15 | REPORT-2026-10-15-batch3-partC.md — Kelowna items 6–13 (`93d1655`) | 1 | 2 |
| 4 | 2026-10-15 | DECISIONS-2026-10-15-batch3.md (`dc23374`) | 14 | 14 |
| 5 | 2026-10-15 | DECISIONS-2026-10-15-batch4.md | 12 | 12 |
| 6 | 2026-10-16 | DECISIONS-2026-10-16-batch5.md | 11 | 11 |
| 7 | 2026-10-16 | DECISIONS-2026-10-16-batch6.md | 13 | 13 |
| 8 | 2026-10-16 | DECISIONS-2026-10-16-batch7.md | 11 | 11 |
| 9 | 2026-10-17 | DECISIONS-2026-10-17-batch8.md | 7 | 7 |
| 10 | 2026-10-17 | DECISIONS-2026-10-17-batch9.md | 9 | 9 |
| 11 | 2026-10-17 | REPORT-2026-10-17-followups.md (applied FIX items; also resolves batch eight item 12) | 3 | 5 |
| 12 | 2026-10-17 | DECISIONS-2026-10-15-batch4.md — TTE resolution 2026-10-17 (34 and 39) | 2 | 2 |

Material coverage includes source-backed amounts/limits, eligibility/matcher corrections, application and document routes, deadlines, coverage, contacts and important payment instructions. Restored hedges are included where they alter what someone must do or can expect (for example conditional RDSP grants, RAMP's non-exhaustive routes and Taxi Saver cash payments), not simply because wording changed.

Batch eight's initially OPEN Waterloo funding item is attributed to revision 11, where it was actually resolved and released, not retroactively to revision 9. Autism TTE items 34 and 39 belong to revision 12, not the earlier batch-four release. At Home SAET's OPEN group-therapy item is not represented; only its FIX summary item is. KEEP items, unsupported adjacent observations and routine editorial changes are not turned into notices.

### Entries deliberately left public-feed-only

**83 entries have no metadata: 82 historical entries plus the new feature announcement.** This complete inventory uses one-based array ordinals **in this implementation snapshot**, not revision identifiers; these ordinals have no runtime meaning. Historical entries outside the permitted FIX evidence remain unannotated even where their prose describes a material change.

| Snapshot ordinal | Date | Existing entry opening | Why no metadata |
|---:|---|---|---|
| 1 | 2026-10-17 | Results can now show recorded updates to matching and tracked programs on a returning device. The optional lis… | Feature/UI announcement; intentionally has no revision or changes. |
| 2 | 2026-10-17 | Review dates moved to October 2026 for 54 benefits whose facts were fully re-checked against their official pa… | Review-date-only release; facts and guide wording unchanged. |
| 15 | 2026-10-14 | Results and Print my action plan now include a combined Documents to gather checklist, using the unchanged wor… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 16 | 2026-10-14 | English results now say Matches your answers, More to check, or Does not match these answers. Matching answers… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 17 | 2026-10-14 | The Canada Disability Benefit guide now explains the income calculation under More about instead of treating i… | Separate guide/matching release, not attributed by the permitted FIX evidence. |
| 18 | 2026-10-13 | Guide freshness labels now distinguish individual source checks from the catalogue review. About shows live co… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 19 | 2026-10-13 | Requirements now show short checks with the full official wording available underneath. Mixed results keep the… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 20 | 2026-09-05 | The organizations directory now covers Ontario; it previously showed Ontario residents nothing. Eight listings… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 21 | 2026-09-05 | Windsor residents will now see two Pathway to Potential programs: the Affordable Pass Program, with a Transit … | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 22 | 2026-09-05 | Three more Region of Waterloo services added. Ontario Renovates lists a maximum of $25,000 per dwelling for ho… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 23 | 2026-09-05 | Grand River Transit programs added, along with the Region of Waterloo's four townships — North Dumfries, Welle… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 24 | 2026-09-05 | York Region programs added, covering Aurora, Markham, Newmarket, Richmond Hill and Vaughan. Residents will now… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 25 | 2026-09-05 | Ottawa transit discounts added. Ottawa residents will now see the Community Pass for people receiving ODSP ($4… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 26 | 2026-09-05 | London added. Homeowners in London and Middlesex County who are seniors 60 or older or people with disabilitie… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 27 | 2026-09-05 | Hamilton added. Residents will now see HSR Fare Assist, which halves single-ride PRESTO fares for a year for h… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 28 | 2026-09-05 | Brampton added. Residents will now see ActiveAssist, the City's recreation fee subsidy, worth $275 for each el… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 29 | 2026-09-05 | Mississauga added. Residents will now see ActiveAssist, the City's fee assistance program for recreation and c… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 30 | 2026-09-05 | Ottawa added. Residents of Ottawa will now see Hand in Hand, the City's recreation and culture fee support pro… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 31 | 2026-09-04 | Toronto programs added. Ontario residents can now choose their city, and Toronto residents will see the Fair P… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 32 | 2026-09-04 | Fixed the questionnaire for Ontario residents. Ontario launched with province-wide programs and no municipal o… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 33 | 2026-09-04 | Ontario is now covered. Nine provincial programs were added: the Ontario Disability Support Program (ODSP), th… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 34 | 2026-09-04 | Recorded review dates for groundwork records and logged this month's link-health review. Nothing shown on the … | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 35 | 2026-09-04 | Groundwork for future provincial coverage, including a fix found while rehearsing the switch-on. Nothing shown… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 36 | 2026-09-04 | Final round of behind-the-scenes groundwork for future provincial coverage. Nothing shown on the site today ha… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 37 | 2026-09-04 | Continued behind-the-scenes groundwork for future provincial coverage. Nothing shown on the site today has cha… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 38 | 2026-09-04 | More groundwork for future provincial coverage. Nothing shown on the site today has changed, and every publish… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 39 | 2026-09-04 | Continued groundwork for future provincial coverage. Nothing shown on the site today has changed, and every pu… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 40 | 2026-09-04 | Further groundwork for future provincial coverage, including the data plumbing and tests behind it. Nothing sh… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 41 | 2026-09-04 | More behind-the-scenes groundwork for future provincial coverage. Nothing shown on the site today has changed. | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 42 | 2026-09-04 | Behind-the-scenes groundwork to support adding more provinces in the future. Nothing the site shows today has … | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 43 | 2026-09-03 | The Fair PharmaCare guide now adds a note for people moving into long-term care: check the facility is enrolle… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 44 | 2026-09-03 | Five more benefit descriptions (More about) — the Disability Tax Credit, the Multigenerational Home Renovation… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 45 | 2026-09-03 | Five more benefit descriptions (More about) — PharmaCare Plan P, First Nations Health Benefits, the Disability… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 46 | 2026-09-03 | Eight more benefit descriptions (More about) — the Canada Caregiver Credit, the Canadian Dental Care Plan, CAP… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 47 | 2026-09-03 | Eight more benefit descriptions (More about) — WorkBC Assistive Technology, BC disability assistance (PWD), th… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 48 | 2026-09-03 | Eight more benefit descriptions (More about) — the BC additional home owner grant, PharmaCare Plan G, the Home… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 49 | 2026-09-03 | Eight benefit descriptions (More about) that were long paragraphs — BC RAHA, RAMP, Special Needs Housing, the … | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 50 | 2026-09-03 | Seven more benefit guides — the Multigenerational Home Renovation Tax Credit, PharmaCare Plan P (palliative), … | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 51 | 2026-09-03 | Benefit pages now lead with the essentials and tuck secondary detail (full description, documents, tips, denia… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 52 | 2026-09-03 | The Disability Related Employment Supports (DRES) guide is intentionally kept without the at-a-glance difficul… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 53 | 2026-09-02 | Added the at-a-glance difficulty, apply-time and wait row to 18 benefits that were missing it. | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 54 | 2026-09-02 | The Community Living BC and Autism Funding (under 6 / 6–18) guides now show what they cover as a bulleted list… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 55 | 2026-09-02 | Split several long run-on sentences in benefit descriptions into shorter ones for easier reading. Only punctua… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 56 | 2026-09-02 | The Fair PharmaCare guide now shows what the plan pays at each family-net-income band in a table, instead of a… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 57 | 2026-09-02 | Five more BC benefit guides (Saanich recreation, the home renovation tax credit, the additional home owner gra… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 58 | 2026-09-02 | Three municipal recreation-access programs (Victoria, Kelowna, Coquitlam) now show their eligibility as a chec… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 59 | 2026-09-02 | Employment supports and four municipal recreation-access programs (Vancouver, Surrey, Burnaby, Richmond) now l… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 60 | 2026-09-02 | Six more British Columbia benefit guides — HandyDART and taxi programs, the fuel tax refund, property tax defe… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 61 | 2026-09-02 | Six British Columbia student-aid disability grants and bursaries now list their eligibility as a checklist ins… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 62 | 2026-09-02 | Three more British Columbia benefit guides — MSP Supplementary Benefits, the At Home Program medical benefits,… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 63 | 2026-09-02 | Five more British Columbia benefit guides now list their eligibility as a checklist instead of a paragraph, in… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 64 | 2026-09-02 | Four more Alberta benefit guides — Disability Related Employment Supports, the Client and Family Support conti… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 65 | 2026-09-02 | Three more benefit guides — the Excise Gasoline Tax Refund, the Home Accessibility Tax Credit, and the CPP chi… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 66 | 2026-09-02 | The Canadian Dental Care Plan guide now lists its four eligibility requirements as a checklist under a clear "… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 67 | 2026-09-02 | The Canadian Dental Care Plan guide now shows what the plan pays at each adjusted-family-net-income band in a … | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 68 | 2026-08-17 | Removed the Rose City Handi-Van Society listing from the organization directory. The society is real and runs … | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 69 | 2026-08-16 | The Rose City Handi-Van listing now names its link as the City of Camrose service page instead of the generic … | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 70 | 2026-08-16 | Softened a homepage line that said every program hides its rules behind walls of text; it now says many progra… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 71 | 2026-08-16 | Added Rose City Handi-Van Society to the organization directory so Camrose residents can find local accessible… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 72 | 2026-08-16 | The out-of-province option no longer says you will see all Canada-wide benefits, since the catalog holds selec… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 73 | 2026-08-16 | The browse buttons on the landing page and in the footer now follow the interface language instead of always s… | Presentation, verification or groundwork release; no attributable material FIX in the permitted evidence. |
| 74 | 2026-08-16 | Finished matching the browse wording across the app, corrected the embed to say every benefit links to its off… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 75 | 2026-08-16 | Corrected the search and sharing text so it matches the site: the page description, social share titles, 404 p… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 76 | 2026-08-16 | Replaced a homepage line that claimed half of the benefits you are entitled to go unheard. The fraction had no… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 77 | 2026-08-16 | Removed remaining copy that implied the questionnaire decides eligibility, that provincial coverage is complet… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 78 | 2026-08-15 | Updated the results list description to say programs are ordered by likely value and ease of applying, rather … | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 79 | 2026-08-15 | Updated the homepage headline and supporting copy to describe answering questions, seeing possible benefit mat… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 80 | 2026-08-15 | Disability Tax Credit guidance now explains the CRA's three eligibility routes and their thresholds, with shor… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 81 | 2026-08-14 | Repointed the Easter Seals Alberta directory link to the organisation's main site after its equipment-programs… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 82 | 2026-07-22 | Updated the Canada Disability Benefit maximum for July 2026–June 2027 and its separate September 2026 suppleme… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 83 | 2026-07-22 | Corrected Disability Tax Credit guidance: removed the disability amount and unsupported back-pay estimate from… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 84 | 2026-07-21 | Restored the quicker tap-to-select age question with eight eligibility-relevant ranges. Exact ages are no long… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 85 | 2026-07-21 | Replaced age-band guessing with a private exact-age field, expanded daily-life and school situations, and rebu… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 86 | 2026-07-21 | Added contextual help for every questionnaire uncertainty choice, repaired older child sessions so they return… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 87 | 2026-07-21 | Questionnaire matching tightened with exact age bands, child school stages, disability documentation, function… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 88 | 2026-07-21 | British Columbia coverage launched, including provincial programs and nine verified municipal recreation progr… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 89 | 2026-07-20 | Expanded the verified grants and disability-organization directories, strengthened automatic link monitoring, … | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 90 | 2026-07-19 | Results now expand in place to full program guides. | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 91 | 2026-07-19 | Published grants and disability-organization directories, life-situation entry points, DTC appointment prepara… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 92 | 2026-07-18 | 35 printable program guide pages published; printable action plan added. | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 93 | 2026-07-18 | Added trust, privacy, accessibility and verification pages; improved navigation, benefit-card guidance and sea… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 94 | 2026-07-15 | Added privacy-preserving browser persistence, cross-tab safety, municipal benefit coverage, blank-page recover… | No attributable FIX in the permitted evidence; not backfilled from public prose. |
| 95 | 2026-07-14 | AbilityFinder launched with a sourced Alberta and federal catalog, a plain-language questionnaire and guides, … | No attributable FIX in the permitted evidence; not backfilled from public prose. |

## Validation and tests

- `npm run gen:guides`: success; 133 published benefit guides plus guide index regenerated for asset pin 185. Guide content is unchanged; no mirror added.
Final accepted-review validation (logs: `outputs/214-review-*.log`; asset version stays **185**):

- `npm test`: **203 passed / 203**, no skips or failures.
- `npm run check:surfaces`: passed; generated report has no tracked diff and no density baseline increase.
- `npx playwright test --project=app-chromium --workers=1 --list`: **259 listed in 23 files**.
- `npx playwright test --project=app-chromium --workers=1`: **259 executed and passed / 259 listed**, zero retries/skips/failures in the whole-project run (3.9 minutes).
- `npx playwright test --project=app-webkit --workers=1 e2e/what-changed*.spec.js e2e/persistence*.spec.js`: **76 executed and passed / 76**, zero retries/skips/failures (53.7 seconds). Includes all 44 persistence-chaos cases, 9 ordinary persistence cases, and 23 what-changed cases.
- Added release-order/applied-only metadata assertions and a browser regression for unpublished guide links. The failed-save browser regression verifies restored in-memory cursors, retained panel, focused failure status, enabled retry, unchanged cursors after a later successful unrelated theme save, and pending updates after reload.
- `git diff --check`: passed.
- Unit tests cover metadata contracts, revision ordering/uniqueness, known IDs, kinds, summary bounds, schema-two round trips, malformed/scalar/array/oversized/unknown-key markers, non-plain objects and bounded cursors.
- Browser tests use committed same-origin preboot IndexedDB seeds; cover first use, older cursors, all tracker stages, exact relevance, child/family results, expansion/reload without acknowledgment, captured listed-only advancement, persistence across reload, no requests during expansion/acknowledgment, boot storage denial, failed writes, malformed baselines, delayed restore, no guide mirror, keyboard/focus/status, fresh dark/light/contrast restores, minimum text contrast and narrow reflow.
- The older migration test now seeds localStorage on a script-free page **before** boot. Its former post-boot seeding was correctly ignored once the new silent baseline created an authoritative IDB snapshot. Migration policy itself is unchanged.
- Earlier combined WebKit runs stalled at the delayed-restore test's initial seed navigation, before app code loaded; the test passed in isolation. Changing load-event readiness did not cure it. The final full selection passed with no retries (final run available memory was substantially higher). Those earlier failures remain in the logs; no tests were skipped or weakened to make the final run pass.
- Automated browser checks do not replace human screen-reader/cognitive-usability review (epic #28).

## Changed files

- `public/app.js`: Results panel, marker bridge/lifecycle, explicit acknowledgment and status/focus handling.
- `public/stateManager.js`: strict all-or-nothing marker boundary and schemaVersion 2.
- `public/changelog.js`: selective metadata, optional metadata validator/collector, unannotated feature entry.
- `public/styles.css`: token-based static panel styling and pinned font version 185.
- `public/index.html`: shared asset pins 184 → 185.
- `public/guides/*.html`: 134 generated files (133 published benefit guides plus index), CSS pin only.
- `test/program-changes.test.js`: new unit coverage.
- `test/state-manager.test.js`: schema/allowlist expectations.
- `e2e/what-changed.spec.js`: new real-browser coverage.
- `e2e/persistence.spec.js`: legacy preboot fixture correction.
- This report; `outputs/214-*` holds local logs and the backfill construction helper. Initial proposal/critique files were read, not edited.

No commit, push, deployment, forbidden workflow-file edits, or changes under `.taskview/`.
