# AbilityFinder inside-out audit

## 1. Gaps users would hit

### Journey gaps

- **“Turning 18 soon” is not a transition journey.** The shortcut sets the person’s age to exactly 18, clears all existing answers/progress, then returns to question one. It neither supports ages 16–17 nor compares child and adult programs (`public/i18n.js:411-412`; `public/app.js:5711-5733`).
- **“Just moved to a new province” does nothing special.** Its preset is empty, and every shortcut starts a fresh questionnaire, so users cannot compare old/new supports or preserve application history (`public/app.js:5714,5722-5733`).
- **Life-event shortcuts save few steps.** Even when answers are prefilled, the wizard restarts at step 0 rather than the first unanswered question (`public/app.js:5728-5733`).
- **Post-application tracking is status-only.** “Submitted,” “Waiting,” “Approved,” and “Denied” are simple select values; changing status reveals no tailored next action (`public/app.js:202-208,7889-7898`). A denial does not surface the guide’s appeal section, and only three programs have structured appeal guidance (`public/data.js:1306-1404`).
- **Submission dates are not stored.** Calendar follow-up text says the application was marked submitted on the day the calendar is downloaded, potentially months later (`public/app.js:7817-7833`).
- **Renewals are mostly buried in prose.** The calendar handles structured deadlines and a generic annual re-check, but renewal periods/expiry rules are generally free text, so they cannot drive reliable reminders (`public/app.js:7836-7851`; examples at `public/data.js:6222-6233,7453-7473`).
- **One device supports only one person.** `answers`, `confirmedFacts`, and `progress` are singleton objects persisted as one snapshot. A caregiver must erase or overwrite one person to manage another (`public/app.js:175-184,4397-4405,4814`).
- **Bilingual expectations are uneven.** Navigation can be French, but the product itself acknowledges that program details are generally English; Quebec records are the main exception (`public/app.js:6193`).

### Questions that could sharpen matching

- Income has only three broad bands; there is no household size, despite many programs using family-size thresholds (`public/app.js:4273-4281`).
- Home ownership is asked only in the BC-specific circumstances branch; renter/owner status affects adaptation, property-tax and rent programs nationally (`public/app.js:4155-4173`).
- Citizenship is binary citizen/PR versus neither, while catalog rules repeatedly distinguish protected persons and temporary-resident routes (`public/app.js:4175-4183`; e.g. `public/app.js:2645-2649`).
- Useful optional branches are missing for drug/private insurance, current provincial assistance, assets, caregiving/living arrangement, and whether support is unpaid or co-resident. These should only refine ranking—not claim eligibility.

### Catalog coverage signals

- Municipal depth is uneven: generated packs contain 28 local AB records, 39 BC, 34 ON and 15 SK, but only 6 MB, 5 NB, 4 NS, 7 NL, 10 QC and **none in PE**. Yet PE residents are still asked for a municipality (`public/data.js:181-186`; generated `public/data-pack-PE.js:2`).
- `CITIES_WITH_PROGRAMS` lists only AB/BC/ON municipalities (`public/data.js:40-53`) even though later packs contain SK–QC local records. Because `cityOther` relies on that manual list, residents can receive the generic 2-1-1 fallback despite a listed local program (`public/app.js:3664-3670`). Coverage counts on impact pages use the same stale list.
- Appeals/denial coverage is far thinner than the 463-program catalog: structured guidance exists for DTC, CPP-D and AISH only (`public/data.js:1306-1404`).

## 2. Efficiency

### Performance

- Current uncompressed core payload is substantial: `app.js` 512 KB, `data-core.js` 352 KB, `i18n.js` 89 KB and `styles.css` 234 KB. Province packs add 42–299 KB.
- The catalog route intentionally downloads every province pack (`public/app.js:44-48`), then creates all 463 cards with one `map(...).join("")` (`public/app.js:8695-8700`). Every search/filter repeats full scans, sorting and large `innerHTML` replacement.
- Results cards contain hidden inline guide markup for every match, meaning full guide HTML is generated even when never opened (`public/app.js:8000-8040`).
- Static guide generation evaluates the 1.6 MB source catalog and separately implements guide markup. That is acceptable at 462 pages today, but every content/schema change increases regeneration and drift cost.

### Maintainability

- `app.js` is 9,677 lines and combines routing, eligibility, persistence orchestration, calendars, catalog, guides, accessibility and API UI.
- Live and static guides are separate renderers (`public/app.js:9024-9199`; `scripts/gen-guide-pages.js:260-389`). Amount tiers, dates, coverage lists and freshness logic must remain synchronized manually; the generator even extracts `verifiedFor()` from source text (`scripts/gen-guide-pages.js:49-55`).
- `data.js` mixes taxonomy, UI options, requirement-adjacent metadata, directories and 463 records across 25,632 lines. Generated packs reduce transfer size but not owner editing/review burden.
- Manual derived lists such as `CITIES_WITH_PROGRAMS` have already drifted from actual records.

### Freshness and CI

- Good foundations exist: per-record dates, stale warnings, a priority queue and rotating link monitoring.
- Weaknesses: inherited month-level dates can conceal uneven review depth; link checks detect availability, not changed rules; snapshot fetching is capped at 25 URLs and dynamic URLs are resolved only for AB/BC/ON (`scripts/reverify-queue.js:19-36,82-111`).
- Full CI runs unit/generated checks plus three parallel Playwright jobs. A normal matrix is about 13–14 minutes; cache misses can approach the 45-minute cap (`.github/workflows/ci.yml:100-112,149-166,194-205`).

## 3. Concrete ideas

| Enhancement | What users see / why | Main files | Effort | Main risk |
|---|---|---|---|---|
| Transition-to-18 planner | Child programs ending, adult programs to investigate, preparation timeline | `app.js`, `data.js`, `i18n.js` | L | Transition rules vary |
| Province-move comparison | “Current province vs destination” without overwriting answers | `app.js`, state manager | M | Users may mistake comparison for portability |
| Local multi-person profiles | Device-only “Person 1 / Child / Parent” workspaces | `app.js`, `stateManager.js`, `dbManager.js` | L | Migration and caregiver confusion |
| Stage-aware caseboard | Submitted date, expected follow-up, approved/denied next steps | `app.js`, state manager, CSS/i18n | M | Dates must remain user-entered or sourced |
| Denial action mode | Selecting Denied opens appeal deadline, evidence and help organization | `data.js`, `app.js`, guide generator | L | High accuracy burden |
| Structured renewals | Expiry/renewal card plus private `.ics` reminder | `data.js`, `app.js`, generator | M | Conditional renewal rules |
| Smarter optional questions | Household size, tenure, coverage and care arrangement branches | `app.js`, state manager, i18n | L | Questionnaire fatigue |
| True life-event shortcuts | Skip preanswered steps and preserve relevant progress | `app.js` | S | Hidden stale answers |
| Virtualized catalog | First 30 cards, “show more,” lazy province loading | `app.js`, CSS, pack generator | L | Keyboard/find-in-page behavior |
| Lazy inline guides | Build guide HTML only when expanded | `app.js` | M | Focus and screen-reader state |
| Shared guide view model | One normalized renderer model for SPA/static pages | `app.js`, `gen-guide-pages.js` | L | Large regression surface |
| Derived coverage map | Generate city counts/fallback rules from actual records | `gen-data-packs.js`, `data.js`, tests | M | Shared/regional municipalities |
| Source-change queue | Fingerprint meaningful page text and flag diffs beside stale age | Worker, `link-check.js`, reverify script | M | Bot blocks and noisy diffs |
| Tiered CI | Fast changed-surface PR gate; full three-engine suite nightly and before deploy | CI, Playwright config | M | Incorrect change classification |
| Translation coverage labels | Clearly label English-only guides and prioritize high-use translations | `i18n.js`, `data.js`, generator | M–L | Translation maintenance |

No files were edited, and no build or tests were run. Verification is left to the orchestrator.
