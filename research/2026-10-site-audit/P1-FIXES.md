# Site audit P1 fixes

2026-10-16. Five isolated corrections; **no results-grouping redesign**. No commit,
push or deploy. Protected TaskView/agent/digest files were not edited.

## 1. Keyboard navigation / WCAG 3.2.2

- **Files:** `public/app.js`; new `e2e/p1-keyboard.spec.js`.
- Radio arrows move focus only. They do not update answers, persist an answer, or
  advance. Space and Enter explicitly select; Next advances. Pointer clicks on
  radio labels retain one-tap auto-advance, including an already-selected option.
- City selection is a draft until Next: native keyboard changes cannot record or
  advance. Removed select auto-advance altogether, as recommended in D P1-1.
- Updated only city-confirmation interactions in `e2e/bc-live.spec.js`,
  `e2e/persistence.spec.js` and `e2e/reminder-calendar.spec.js` to press Next.
- **Tests:** first-question ArrowDown leaves `forWho=null`, focuses My child, and
  stays on the question; Space records child but stays; Next advances. City draft
  remains unrecorded until Next. Existing pointer and persistence journeys pass.
- **Eligibility changes:** none; prevents accidentally recorded answers.

## 2. Province scope and Okotoks

- **Files:** `public/app.js`, `public/data.js`, `e2e/oracle/oracle-spec.js`,
  `e2e/at-kit.spec.js`; scope cases in new `e2e/p1-scope-homeowner.spec.js`.
- `benefitProvince()` now classifies local delivery levels using Ontario cities
  and regions, BC cities/Metro Vancouver, and Alberta cities/Spruce Grove area.
  Every current municipal/regional record is classified. The nationwide 2-1-1
  `local-supports` fallback deliberately remains nationwide, not municipal.
- Shared result-scope filtering runs **before** results/counts, hypothetical
  scenario comparison and print evaluation. Browse remains an all-program
  directory, not a personalized result list. Existing grouping/sorting is unchanged.
- Added the existing style of fixed answer-based geographic gate (`ab` and
  `okotoksArea`) to Okotoks, retaining its external `okotoksResidency` confirmation.
  Calgary is outside the service area and omitted, not added to no-match counts.
  Okotoks/Foothills County are included; an Alberta null/unlisted city remains
  unknown and conditional, not a refusal. Other provinces never get this record.
- **Official-source check:** fetched the record's existing source on 2026-10-16:
  <https://www.okotoks.ca/your-community/social-well-being/family-community-resources/okotoks-family-resource-centre-7>.
  Its eligibility section says applicants must live in the Town of Okotoks or
  Foothills County; its FAQ explicitly excludes residents outside those areas.
  Capture: `outputs/p1-okotoks-source.html`. No amount or other benefit fact changed.
- **Tests:** AB/Calgary, BC/Vancouver and ON/Kitchener each exclude every
  other-province local name from results, no-match HTML, scenarios and print;
  no-match counts agree with the scoped list. Also tests classification
  completeness, Foothills, null/unlisted city and `other` province.
- **Deliberate status changes:** Okotoks becomes evaluator `no` for a known
  incompatible city or non-AB province (formerly `almost` for low-income users),
  then is omitted from personalized surfaces. Its best-case and no-confirmation
  oracle expectations stay `almost`: residence still needs confirmation.
  Alberta unknown-city cases remain `almost`.
- **Fixture count changes, each explained by removing Okotoks:**

  | AT fixture | Ready (unchanged) | Almost before → after |
  |---|---:|---:|
  | ab-self | 0 | 22 → 21 |
  | bc-child | 4 | 21 → 20 |
  | on-family | 3 | 17 → 16 |
  | bc-self | 10 | 20 → 19 |
  | returning | 0 | 22 → 21 |
  | no-matches | 0 | 11 → 11 |

  Other out-of-province locals retain their evaluator statuses; presentation
  omission removes them from no-match lists/counts rather than changing status.

## 3. Unasked homeowner is unknown

- **Files:** `public/app.js`, `e2e/oracle/oracle-spec.js`; homeowner case in
  `e2e/p1-scope-homeowner.spec.js`.
- One predicate change: an empty circumstances array cannot be a fixed refusal.
  Explicit `none` still refuses; `unsure` remains conditional. The BC-only wizard
  question and the relative/dwelling-specific tax-credit gates are unchanged.
- **Test:** Ontario/Kitchener with no homeowner answer gets Waterloo Ontario
  Renovates as `almost`, with a homeowner check, not in the no-match section.
  Explicit `none` still produces `no`.
- **Deliberate oracle update:** version 1.30.0 → 1.31.0; added unasked-ownership
  `almost` counterexamples for every record using `homeowner`. When the other fixed
  gates pass, these records change `no` → `almost` for `circumstances=[]`:
  1. `waterloo-ontario-renovates`
  2. `bc-additional-home-owner-grant`
  3. `bc-home-reno-tax-credit`
  4. `bc-property-tax-deferment-disabilities`
- No universal promotion to ready, no relaxation of explicit refusals. Added
  independent Okotoks area/city counterexamples to the oracle for fix 2; no bulk
  snapshot replacement or unrelated expectation changes.

## 4. Loading-screen recovery

- **Files:** `public/theme-init.js`, `public/app.js`; new `e2e/p1-startup.spec.js`.
- Early, independent startup guard handles script/runtime failures, unhandled
  rejections and a 10-second watchdog. It offers a plain-language message, wired
  Reload button and `/guides/` link; no inline script or CSP exception is needed.
  Non-script resource errors are not mistaken for fatal startup failures.
- Startup is caught and readiness is marked only after wiring finishes. Existing
  render-error protection remains in place.
- Missing changelog is optional: empty notices, no new review baseline, and no
  update panel. Existing saved review markers survive the missing feed instead
  of being invalidated against a fabricated zero watermark.
- **Tests:** abort changelog (including a returning saved-marker case), inject an
  exception in startup and exercise Reload after removing the fault, abort core
  app script and verify the recovery screen.
- **Eligibility changes:** none. No new persistence fields or remote requests.

## 5. Accessibility quick fixes

- **Files:** `public/styles.css`, `public/app.js`, `public/i18n.js`,
  `scripts/gen-guide-pages.js`, regenerated `public/guides/*.html`;
  new `e2e/p1-accessibility.spec.js`.
- High contrast now overrides danger, primary-button fill/ink and semantic tints;
  hides hero/mountain artwork and removes hero text shadow even with light theme.
- Practitioner postal input has a visible associated label, in English/French.
- Static guide privacy footer uses the existing themed `guide-link` tokens.
- Visible results headline is now h1; styling is preserved. The existing hidden
  print-only action-plan heading is unchanged.
- **Tests:** fresh dark/light × contrast-off/on cases; calculated text/danger
  contrast ≥4.5:1, button text ≥4.5:1 and edge ≥3:1 in high contrast; static footer
  link ≥4.5:1 in dark/light; visible label; results h1. All 17 app routes render
  without exceptions/render-error cards for self, child and family.
- Browser tests are not a substitute for disabled-user/screen-reader review.
- **Eligibility changes:** none.

## Shared release procedure / generated output

- All deployed `?v=189` pins advanced to **190** in `public/index.html`, stylesheet
  font URLs and generated guide stylesheet URLs. No old pin remains in public,
  scripts or tests.
- Added a plain changelog entry **without revision/changes metadata**.
- Ran `npm run gen:guides`: 133 benefit guides plus guide index regenerated
  (134 pages); only footer-link class and asset-version changes in those pages.
- Ran `npm run gen:context`: no generated context/link diff required.
- Surface check updates the generated density report's gate total 225 → 226 for
  the new short area gate. Flagged counts remain unchanged; baseline not raised.

## Final validation — executed passes, not just listed tests

| Command / scope | Result | Evidence |
|---|---|---|
| `npm test` | **209 passed, 0 failed, 0 skipped** | `outputs/p1-unit-final.log` |
| `npm run check:surfaces` | **Passed**, no flagged-count increase | `outputs/p1-surfaces-final.log` |
| `npm run gen:guides` | Passed | `outputs/p1-gen-guides-final.log` |
| `npm run gen:context` | Passed; no generated context/link diff | `outputs/p1-gen-context-final.log` |
| `npx playwright test --project=app-chromium --workers=1` | **298 passed, 0 failed** (whole project) | `outputs/p1-chromium-verified.log` |
| Chromium `--list` (not execution) | **298 listed in 29 files** | `outputs/p1-chromium-listed.log` |
| New four specs, `app-webkit --workers=1` | **18 passed, 0 failed** | `outputs/p1-webkit-final.log` |
| New four specs, `app-firefox` | **Blocked at browser launch; 0 validated passes** | `outputs/p1-cross-browser-final.log`, `outputs/p1-firefox-bounded.log` |
| `git diff --check` | Passed | executed after final tests |

The exact combined WebKit/Firefox command requested was attempted twice, each
reaching the shell's ten-minute cap: Firefox is first in configured project order
and repeatedly fails launch before entering a test. Logs show
`sandbox_extension_issue_file_to_process ... Operation not permitted` and
`RenderCompositorSWGL failed mapping default framebuffer`, followed by 180-second
launch timeouts. Running outside the shell sandbox and trying native sandbox
environment workarounds did not resolve it. No test was skipped or weakened to
claim a Firefox pass, and no browser/configuration files were modified.

The final bounded combined run (`--global-timeout=90000`) lists **36 cases**
(18 per engine), but reports **36 did not run** because Firefox never launches;
it is **not** a passing run. See `outputs/p1-cross-browser-bounded-final.log`.
WebKit was therefore run separately and all 18 final cases actually passed.
Firefox validation remains an environment-blocked release check.

The initial Chromium run was 282/297; its 15 failures were five stale Okotoks
fixture counts and ten journeys assuming select auto-advance. After narrowly
updating those expectations, a full run passed 297/297. After adding the final
unknown-city/Foothills regression, the final full run passed **298/298**.

## Review follow-up: Okotoks scope

Okotoks is shown conditionally for Alberta users whose city is “Other” or
unanswered. Users who pick another listed city do not see it. This is an
accepted trade-off: Foothills County is not a selectable city.

**Status:** all five implementation fixes complete; Chromium, unit, surfaces and
WebKit checks green. Firefox execution remains blocked by the local browser
launch environment. Results grouping, receipt capture and broader relevance
changes have not been started.
