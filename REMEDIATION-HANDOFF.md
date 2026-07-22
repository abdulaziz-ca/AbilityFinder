# AbilityFinder — post-BC launch remediation handoff

Last updated: 2026-07-21

This is the working checklist for the defects and content gaps reported after the
British Columbia launch. Keep it current after every chunk so another agent can
continue without repeating the audit. Do not delete completed changelog history.

## Safety and release rules

- Read `AGENTS.md` first. The source code is authoritative.
- Never infer or invent a benefit rule. Re-check official sources on the day that
  `public/data.js`, `public/grants-data.js`, or `public/orgs-data.js` is changed.
- Treat questionnaire output as a conservative likely-match screen, never a
  guarantee of eligibility. Known conflicting answers must exclude a program.
- Run `npm run gen:context` after catalog/help/grants/organization changes and
  `npm run gen:guides` after benefit changes.
- Do not commit, push, deploy, or rotate credentials unless the owner asks.
- When a browser-loaded asset changes, bump the shared `?v=N` references in
  `public/index.html`.

## Confirmed root causes from the initial audit

- `public/app.js` gives `forWho: "child"` an automatic coarse `ageGroup: "child"`
  and skips the age question. The matcher cannot distinguish under 6, elementary
  age, secondary age, age 18, or an adult son/daughter.
- The situation question offers post-secondary/work choices to children but has no
  preschool, elementary, or secondary-school choices.
- Many BC catalog entries use only `"bc"` (or `"bc"` plus a coarse age/income
  requirement). That makes unrelated programs appear matched even when the
  questionnaire provides contradictory disability, mobility, school, work, PWD,
  vehicle, or home-ownership information.
- The results total combines ready and one-step-away programs and calls them things
  the person “may qualify for”; this must remain cautious and must not hide material
  unmet conditions in `requiresNote`.
- `HELP_ORGS` in `public/data.js` contains Alberta and national entries only and is
  rendered without province filtering.
- `GRANTS_DIRECTORY` in `public/grants-data.js` mixes Alberta and national entries,
  has no province field, and contains no verified BC-specific directory entries.
- `ORGS_DIRECTORY` in `public/orgs-data.js` is Alberta-only and has no province
  field/filtering.
- `STUDENT_AID`, `TWO_ELEVEN`, and `EMPLOYMENT` fallbacks in `public/data.js` have
  Alberta mappings only, despite BC being live.
- `public/stateManager.js` currently clears any restored city when the province is
  not Alberta (`if (clean.province !== "AB")`), so a persisted BC city is lost.
- The footer uses `justify-content: space-between`, leaving the legal/navigation
  material visually left/right weighted instead of centered.
- `public/changelog.js` currently contains only four entries (2026-07-14 onward).
  Preserve them and reconstruct older launch history from git; never replace the
  array with only the newest release.

## Chunked implementation checklist

### Chunk 1 — questionnaire and conservative matching (highest priority)

- [x] Collect a meaningful age band for every persona, including “My child.”
- [x] Add age-appropriate preschool, elementary, secondary, post-secondary, work,
      job-search/training, and unable-to-work situation choices.
- [x] Keep old persisted sessions safe through catalog-backed validation/migration.
- [x] Add explicit requirements needed to prevent known false positives (under-6,
      school-age, transition ages, disability/functional need, mobility, work,
      student, assistance/PWD prerequisites, and other facts the wizard can know).
- [x] Treat unknown/actionable prerequisites as “check this first” rather than
      “ready to apply.”
- [~] Add regression journeys for BC/AB adult students, young children, elementary
      children, teens, adults, seniors, and restored BC cities.
      Adult-student, elementary-child, adult, senior, persisted-route and restored
      BC-city coverage is complete. Add focused young-child and teen journeys in a
      later verification pass.

### Chunk 2 — result taxonomy and end-page directories (complete)

- [x] Separate government benefits, tax credits, grants/bursaries, funded services,
      health/equipment coverage, discounts/passes, and charitable funds.
- [x] Show matched charitable funds/grants on the final results page, filtered by
      province, age/audience, and any verified disability/life-stage tags.
- [x] Ensure totals count only program matches and explain “ready” versus “one step
      away” accurately.

### Chunk 3 — verified BC grants, funds, and organizations (complete)

- [x] Research BC-specific charitable grants/funds on official organization sites.
- [x] Add a province/coverage field to grant and organization records and filter AB,
      BC, and national records correctly.
- [x] Research current BC form/navigation, legal/appeal, 2-1-1, family, sensory,
      developmental, employment, and local-service organizations.
- [x] Re-verify existing Alberta/national entries that appear in results; remove or
      correct only when the official source proves they are stale.

### Chunk 4 — guide metadata and immediate supports (complete)

- [x] Audit every BC guide for `BENEFIT_META` difficulty, application effort, wait,
      apply URL/text, and complete step-by-step details.
- [x] Add BC mappings for province-aware student aid, employment, 2-1-1, and other
      immediate-support links.
- [x] Modernize “Things you can use this week” so content is disability-, age-,
      situation-, and province-aware and avoids unsupported promises.

### Chunk 5 — history and presentation polish (complete)

- [x] Reconstruct the public data changelog from repository history back to launch,
      keeping every existing entry and adding the remediation entries.
- [x] Center the footer brand, legal links, and verification note responsively.
- [x] Check dark, light, high-contrast, reduced-motion, keyboard, and narrow reflow.
      Automated checks cover a 320px CSS viewport (equivalent to 400% zoom on a
      1280px desktop viewport); real-user assistive-technology testing remains an
      ongoing product responsibility, not something automation can certify.
- [x] Bump shared browser asset cache versions to `v=40`.

### Chunk 6 — generation and release verification (complete)

- [x] Run `npm run gen:context` and review `src/benefits-context.js` / `src/links.js`.
- [x] Run `npm run gen:guides` and review generated guides/sitemap.
- [x] Run `npm test`, `npm run test:e2e`, `git diff --check`, and
      `npx wrangler deploy --dry-run`.
- [x] Exercise landing, wizard, results, browse, detail, grants, organizations,
      updates, privacy, and other persisted routes for self/child/family in AB/BC.
- [x] Deploy to production and smoke-test the custom domain. Commit and push the
      matching source after recording the live release in this handoff.

## Work log

- 2026-07-21: Initial audit completed and root causes recorded. No deployment,
  commit, push, or credential rotation performed.
- 2026-07-21: Chunk 1 implemented. Added exact age bands for every persona,
  age-aware life stages, documentation/functional-needs questions, BC MSP and
  assistance prerequisites, and conservative requirement gates across the BC and
  federal catalogs. Existing answers are catalog-validated, incomplete legacy
  questionnaires resume at the first missing question, and BC cities now persist.
  Result language now distinguishes likely matches from possible matches and says
  explicitly that the screen is not an approval decision. Added BC and Alberta
  false-positive regression journeys. Generated catalog context/guides and bumped
  browser assets to `v=39`; final verification results are recorded below.
- 2026-07-21: Chunks 2–5 implemented. Added result program taxonomy and a separate
  conservative charitable-fund section; verified seven BC charitable programs and
  nine BC organizations; filtered all directories and human-help cards by province;
  added BC StudentAid, WorkBC and 2-1-1 mappings; added application effort/difficulty/
  timing metadata for every BC program; and gave every live/static guide a safe
  official-page application workflow when no program-specific steps exist. Added
  preschool and K–12 practical supports, corrected immediate-support promises,
  rebuilt the public history back to launch, centred the footer, fixed mobile
  assistant/accessibility control overlap, and bumped browser assets to `v=40`.
- 2026-07-21: Published the remediation through Wrangler 4.112.0. Cloudflare
  version `0bc5f3dd-f61d-4d6e-adec-4ded84ab0b0e` uploaded 93 changed assets.
  Production returned HTTP 200, served the `v=40` application/grant/organization
  assets and new PWD guide metadata, and retained CSP, permissions, referrer,
  MIME-sniffing and frame-denial headers. The matching source was then prepared
  for the authorized commit and push.

## Latest verification

- `npm test`: passed, 27/27.
- `npm run test:e2e`: passed, 16/16 after fixing the mobile overlay collision.
- `npm run gen:context`: passed (84 catalog entries).
- `npm run gen:guides`: passed (83 guide pages plus sitemap).
- `git diff --check`: passed.
- JavaScript syntax checks: passed for changed application, data, generator and
  test files. Catalog integrity check passed: 84 sourced programs, 48/48 BC
  metadata records, 18 grants, 22 organizations, 12 helper records, no duplicate
  IDs and no missing coverage fields.
- `npx wrangler deploy --dry-run`: passed with Wrangler 4.112.0; 110 static
  assets validated, 169.34 KiB raw / 44.93 KiB gzip.
- Production smoke test: passed on `https://abilityfinder.ca/`; verified the
  versioned application assets, BC grants and organizations, static guide metadata,
  conservative result wording, and expected security headers.

## Explicitly deferred

- The account credential rotation mentioned in the previous launch handoff remains
  an owner-authorized security task. No credential was read, printed, or changed.

## Follow-up: questionnaire clarity and footer alignment (`v=41`)

Status: implemented and verified locally on 2026-07-21. This follow-up has not
been committed, pushed, or deployed; those release actions require explicit user
authorization for this change set.

### Root cause and fixes

- Old persisted child questionnaires could contain the broad legacy value
  `ageGroup: "child"` without the newer exact `ageBand`, while also restoring at a
  later wizard step. The situation screen then fell through to adult choices such
  as post-secondary school. Restore now moves any incomplete wizard session back
  to its earliest unanswered current question, so the exact-age question cannot be
  skipped. A conservative regular-school fallback also protects legacy child
  sessions if an age band is still unavailable.
- Situation choices now follow the selected child age: preschool/child care for
  under six, elementary/middle school for ages 6–11, and junior/high school for
  ages 12–18. Age 18 can select either regular school or post-secondary, while
  children under 18 are not shown the post-secondary choice.
- Every questionnaire branch that offers an uncertainty answer now includes a
  contextual help button. Help is available for disability/condition selection,
  disability documentation, autism assessment, functional needs, Disability Tax
  Credit status, B.C. Medical Services Plan enrolment, B.C. income/disability
  assistance, and changing circumstances. Each page returns to the exact question
  without discarding answers, and all new help routes pass the persisted-state
  allowlist.
- The legal/privacy disclaimer itself, not only the surrounding site footer, now
  has a centred bounded layout. The shared browser cache was advanced from `v=40`
  to `v=41`, including the 83 generated static guides.
- The public changelog gained a new entry; no older launch or release history was
  removed.

### Follow-up verification

- `npm test`: passed, 28/28.
- `npm run test:e2e -- --reporter=dot`: passed, 19/19.
- `npm run gen:guides`: passed, 83 guide pages plus guide index and sitemap.
- `git diff --check`: passed.
- JavaScript syntax checks: passed for the changed application, state manager and
  browser-test files.
- In-app browser verification: the disclaimer centre offset was 0 px at both a
  1280 px desktop viewport and a 320 px narrow viewport, with no horizontal
  overflow at 320 px. The child-age journeys and contextual help/return flow were
  also exercised directly.

## Follow-up: exact age, broader needs, and readable guides (`v=42`)

Status: deployed to production on 2026-07-21 as Cloudflare version
`9ca33b76-b07b-43a1-b254-20ee2dc04d7b`. This section describes the matching v42
source release submitted after the production verification passed.

### Questionnaire and matching

- Replaced the long age-band list with one whole-number age field accepting ages
  0 through 120. The value remains in the browser and derives the existing exact
  catalog cutoffs internally, so under-six, school-age, transition-age, adult and
  senior rules are not blurred together. Old band-only sessions are not assigned
  a guessed exact age; they resume at the age question.
- The school choices remain age-aware: child care/preschool under six, elementary
  school from 6–11, junior/high school from 12–18, and both regular school and
  post-secondary at age 18. Post-secondary is not offered below age 18.
- Expanded the daily-life question with communication, memory/safety, sensory,
  home-access, care-coordination, and fatigue/pain needs. These additions tailor
  practical supports only; they do not imply that a diagnosis or selected need
  guarantees benefit eligibility.
- All current uncertainty choices retain contextual help and return to the exact
  questionnaire page without losing answers.

### BC guide usefulness and design

- Re-verified the relevant official sources and replaced generic application
  filler with program-specific steps, document lists, timing, phone details and
  practical tips for 31 BC provincial, transit and municipal guides. A catalog
  audit now reports zero BC guides using the generic fallback workflow.
- Applied the approved compact action-card design to live and generated guides.
  Long value text now wraps in the main guide column under a semantic “What it can
  provide” heading. The side card shows at most two unmet prerequisites, a direct
  next-action link when one exists, concise facts and official application/source
  links. It has no fixed maximum height or internal scrolling.
- Added direct prerequisite actions for StudentAid BC disability verification,
  B.C. MSP enrolment and My Self Serve/PWD status. Generated static guides use the
  same compact card pattern.
- Advanced every browser-loaded asset and all 83 generated guides to `v=42` and
  appended a public changelog entry without removing any earlier history.

### v42 verification and release

- `npm test`: passed, 29/29.
- `npx playwright test --reporter=dot`: passed, 21/21.
- `npm run gen:context`: passed (84 catalog entries; 151 monitored links).
- `npm run gen:guides`: passed (83 guide pages plus guide index and sitemap).
- JavaScript syntax checks and `git diff --check`: passed.
- BC guide workflow audit: 0 entries missing program-specific application steps.
- In-app browser QA passed in dark, light, high-contrast and reduced-motion modes,
  at the default desktop viewport and 320 px. Exact-age and guide pages had no
  horizontal overflow; the guide card's `scrollHeight` equalled `clientHeight` at
  both sizes, confirming there is no clipped internal content.
- `npx wrangler deploy --dry-run`: passed with Wrangler 4.112.0; 110 static assets,
  197.66 KiB raw / 51.49 KiB gzip, with the existing zero-spend bindings intact.
- Production deployment uploaded 90 changed assets. `https://abilityfinder.ca/`
  returned HTTP 200 and served `v=42`; the live script contained the exact-age,
  direct-action and main-column value implementations, and the Fair PharmaCare
  guide contained its specific steps and compact guide card. CSP, permissions,
  referrer, MIME-sniffing and frame-denial headers remained present.
