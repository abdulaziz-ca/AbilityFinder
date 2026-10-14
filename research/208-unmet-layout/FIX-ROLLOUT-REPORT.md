# TaskView #208 + #207 fix and rollout report

Base: b662019. Local implementation only; no commit, push or deployment.
Both Claude reviews were read in full. All findings accepted; none disputed.

## #208 per-finding disposition

| Finding | Disposition and evidence |
|---|---|
| B1 / A1 links | Fixed: accent-hi token, underline, anywhere wrapping, accent focus outline, minimum 24px guide-link height, forced-colors LinkText and black print links. Browser tests check both preview and detail link computed colors against tokens, exclude UA blue/purple and assert at least 4.5:1 contrast in light, dark and contrast themes. |
| S1 / A2 print | Fixed: detail print-only article exists only with unmet needs and includes summary and official URL. Print hiding applies only when an action-plan article exists. Browser test asserts no article and visible detail heading for a fully matched benefit. |
| S2 / A3 focus | Fixed: preventScroll focus followed by scrollIntoView with the existing a11y.motion auto/smooth convention. Browser test checks focused requirements heading and that Tab advances to the next interactive control. |
| S3 / A4 mixed preview | Fixed: up to three migrated cues in requires order; one plain EN-only i18n “and N other checks” line for all remaining needs. Sole unmigrated text appears in full if at most 120 code points. Unit tests cover mixed, all migrated, single short/long fallback, budget and no empty list. |
| N1 French note | Fixed: removed the section's duplicate det.enNote; page note retained. Browser test asserts exactly one page note. |
| N2 name substitution | Fixed: function replacers for both full-requirements and guide-link names. Literal dollar replacement and HTML special characters tested. |
| N3 constant identifiers | Hardened conservatively: escaped requirement keys, heading IDs, card IDs, guide slugs and guide-link data IDs, even though current identifiers are code constants. |
| N4 duplicate count | Fixed: detail section repeated count removed; status pill retained. |
| Test weakness / A5 | Fixed: independently derived expected escaping, special-character name/short/print tests, zero-unmet print test, link token/contrast tests, and one-versus-many “One step away” status assertions. |

## #207 per-finding disposition

All twelve applied reviewer replacement cues satisfy the 80-code-point limit, no-digit rule and no-trailing-period rule without shortening. Existing actors retained except the requested aadlAssessment actor correction.

| Gate | Disposition |
|---|---|
| achbCoverageCoordination (high) | Fixed with exact reviewer replacement: government coverage first, other plans before ACHB. |
| cppDisabilityContributorLink (high) | Fixed with exact reviewer replacement specifying CPP disability benefit. |
| ssahDocumentation (medium) | Fixed with exact reviewer replacement preserving professional documentation and funding-not-guaranteed hedge. |
| csgNeedAndProgram (medium) | Fixed with exact reviewer replacement preserving separate provincial aid routes. |
| abServiceDogQualified (medium) | Fixed with exact reviewer replacement without Alberta-only implication. |
| aadlAssessment (medium) | Fixed with exact reviewer replacement; who is you, professional. |
| planGClinicalAndFinancialNeed (medium) | Fixed with exact reviewer replacement separating clinical and income checks. |
| bcCydbIntake (medium) | Conservative alternative explicitly required by owner: no short or who written to gate; applied inventory short/who null pending #216. No intake/transition cue shipped. |
| passportDso (low) | Fixed with exact reviewer replacement spelling out Developmental Services Ontario. |
| notBcStudentAidDuplicate (low) | Fixed with exact reviewer replacement directing application through StudentAid BC. |
| abCapccContinuingCareHome (low) | Fixed with exact reviewer replacement treating sharing goals as a condition. |
| rdspContributionWindow (low) | Fixed with exact reviewer replacement specifying an age deadline. |
| rahaEligibility (low) | Fixed with exact reviewer replacement preserving wait-for-approval-before-work instruction. |

The six already shipped pilots were preserved exactly (none flagged). Their existing values, rather than the draft's proposed variations, are recorded in shorts-applied.json. The draft was renamed to that applied inventory.

## Counts and preservation

- Total REQS gates: **199**; with short cues: **87**; without cues: **112**.
- Applied inventory: **90** entries, **87** string cues and **3** null exceptions (achbOlderDependent, dtc, bcCydbIntake). Null gates remain unmigrated rather than getting literal short:null in REQS.
- Flagged static gate.unmet entries: **88**; with cues: **87**; without cues: **1**.
- All **597** unmet/met/fixed fields compared unchanged against b662019, including function source text.
- Existing dense baseline counts, maxima and generated timestamp unchanged. Only flaggedWithoutShort:1 added.
- All **150** asset version pins under public are **166**. Guides regenerated through npm run gen:guides. Public changelog entry added.

## Verification

| Command | Final result |
|---|---|
| npm run gen:guides | Passed |
| npm run check:surfaces | Passed; reports “gates with a short cue: 87 of 88 flagged”; dense counters unchanged |
| npm test | 142 discovered, 140 passed, 2 skipped, 0 failed |
| Playwright layout file, serial app-chromium | 18/18 passed |
| Playwright --project=app-chromium --workers=1 --list | 171 tests in 18 files |
| Whole Playwright --project=app-chromium --workers=1 | **171/171 passed**, no retries, about 3.6 minutes |
| git diff --check | Passed |

Earlier fixture failures were diagnosed and corrected, not waived: theme contrast tests initially sampled the transitioning body background; the fixture now disables its theme transition before setting the theme. The label fixture needed completed wizard answers. The first full project run was 170/171 because bc-live still expected the pre-#208 heading and unexpanded full MSP text. That test now asserts the cue, opens the disclosure, and preserves its exact full wording, official URL and no-clipping checks; the entire project was then rerun green.

Logs: outputs/task208-fix-{guides,surfaces,node,layout,list,chromium}.log.

## Limitations

The two npm-test skips remain skipped, not claimed passed. Firefox, WebKit, Worker browser projects, production deployment/smoke checks and human assistive-technology/usability testing were not run in this task. Forced-colors and print link colors are implemented but were not individually computed-color tested; the print no-unmet/detail-content path was browser tested. No TaskView server state transition is claimed. Existing untracked node_modules and earlier output/review files were preserved. AGENTS.md, TASKVIEW-*.md and .taskview/ were not edited.
