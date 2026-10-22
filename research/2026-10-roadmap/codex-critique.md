# AbilityFinder roadmap review

**Scoring:** Value 1–5; Effort S/M/L; Risk L/M/H. “DO” means commit, not necessarily immediately.

## Candidate verdicts

| ID | Verdict | V | E | R | Why |
|---|---|---:|:---:|:---:|---|
| A1 | **DO** | 5 | S | L | Current derived claims are wrong and some users receive a misleading fallback; correctness fix. |
| A2 | **DO** | 3 | S | L | Shortcuts promise convenience or a journey they do not provide; first make them honest and preserve valid answers. |
| A3 | **DO** | 5 | S | L | Calendar text currently invents a submission date, an avoidable factual error. |
| B1 | **DO** | 5 | M | M | Strong journey gap and reuses the tracker, provided next actions and wait times are official or user-entered. |
| B2 | **LATER** | 5 | L | H | Valuable, but appeal routes and deadlines change; only three programs have structured coverage today. |
| B3 | **DO** | 5 | M | H | Missed renewals matter, but ship only after explicit, sourced renewal data—not prose inference. |
| C1 | **LATER** | 4 | M | H | Potentially useful, but risks coaching medical claims; requires practitioner and disability-community review. |
| C2 | **LATER** | 4 | L | H | Overlaps guides/checklists and creates a large per-program medical-evidence maintenance burden. |
| C3 | **LATER** | 4 | L | H | Form-version drift could make companions actively harmful; pilot only after monitoring exists. |
| C4 | **DO** | 5 | L | H | Best-supported paperwork problem; begin with common documents and explicitly non-guaranteed alternatives. |
| D1 | **LATER** | 5 | L | H | Pairwise interaction rules create combinatorial accuracy and maintenance costs. |
| D2 | **DO** | 4 | S | M | Existing `amountTiers` can improve clarity if always labelled published information, never an estimate. |
| D3 | **DO** | 3 | S | M | Cheap consumer protection, especially for DTC firms; wording needs legal/source review. |
| D4 | **DO** | 4 | S | L | Proven clarity pattern, low factual burden, and helps expose skipped answers before matching. |
| D5 | **LATER** | 4 | L | H | Better matching, but adds fatigue and substantially expands rule testing; introduce one question at a time. |
| E1 | **DO** | 3 | S | L | Makes existing destinations discoverable without building another substantive feature. |
| E2 | **LATER** | 3 | M | M | Useful mainly to repeat/professional users; existing catalog search reduces urgency. |
| E3 | **DO** | 4 | S | M | Helps users whose need is outside a benefits questionnaire; keep calm, provincial and source-verified. |
| E4 | **DO** | 4 | S | M | Clear-answer and honest quick-exit controls fit sensitive shared-device use. |
| F1 | **DROP** | 3 | L | H | Link leakage, Worker/KV operations and metadata undermine the benefit for a one-owner service; prefer files/print. |
| F2 | **LATER** | 4 | L | H | Real caregiver need, but state migration and wrong-person confusion are substantial. |
| F3 | **DO** | 5 | M | M | Builds on 67 organizations and addresses accessibility directly; omit unverified hours/channels. |
| F4 | **DO** | 4 | M | M | Local-only storage is fragile; validated, optionally encrypted export preserves the privacy model. |
| G1 | **LATER** | 4 | L | H | “Easy Read” is dishonest without reader testing; pilot a few programs before using the label. |
| G2 | **LATER** | 3 | M | H | Offline stale rules are a serious downside; confirm demand before owning service-worker caching. |
| G3 | **LATER** | 4 | L | H | Native review and ongoing synchronized updates exceed current owner capacity. |
| G4 | **LATER** | 4 | M | M | Helpful, but creates a second interaction surface to test; first simplify the default flow. |
| H1 | **DO** | 5 | S | L | Per-record corrections improve the highest-risk asset—the catalog—at little cost. |
| H2 | **DO** | 4 | S | L | Appropriate evidence gathering if strictly opt-in and no answers, identifiers or fingerprinting are sent. |
| H3 | **DO** | 4 | S | L | Necessary before any export, sharing or AI expansion; must match actual Worker/Cloudflare behaviour. |
| I1 | **DO** | 3 | M | M | Removes unnecessary guide rendering while preserving current behaviour; test focus and announcements. |
| I2 | **LATER** | 3 | L | M | Performance concern is credible, but measure catalog responsiveness before accepting accessibility trade-offs. |
| I3 | **DO** | 5 | M | M | Link checks miss changed rules; change detection directly supports content integrity despite noisy diffs. |
| I4 | **LATER** | 3 | L | H | Desirable maintenance work, but a large regression surface; normalize new fields first. |
| I5 | **DO** | 3 | M | M | Helps one-owner throughput, provided deploys still require the full integrity/accessibility suite. |
| I6 | **DROP** | 1 | L | H | A standalone rewrite has no user outcome; extract modules incrementally while delivering features. |

## Missing ideas

| Idea | Verdict | V | E | R | Rationale |
|---|---|---:|:---:|:---:|---|
| **M1. Actionable-data schema validator** | **DO** | 5 | M | L | Require source, verified date and valid shape for renewals, waits, deadlines and appeal fields; manual lists have already drifted. |
| **M2. Program lifecycle state** | **DO** | 5 | M | M | Add active/paused/closed/replaced-by states so expired windows do not silently remain ordinary catalog results. |
| **M3. Coverage-limit disclosure** | **DO** | 4 | S | L | Clearly say municipal depth varies and absence is not proof no support exists, especially for PE and thin provinces. |
| **M4. Disabled-user usability release gate** | **DO** | 5 | M | L | Automated WCAG tests cannot validate cognitive clarity, Easy Read, tracker comprehension or screen-reader workflow. |
| **M5. Feature-level privacy threat checklist** | **DO** | 4 | S | L | Before backup, polling or Workers changes, document payload, retention, logs, deletion and shared-device exposure. |

## Sequenced roadmap

### Phase 0 — correctness and honesty, under one week
1. **A3** store real submission dates; suppress follow-up dates for legacy entries lacking one.
2. **A1** derive municipality coverage and stop PE city questioning.
3. **A2** make shortcuts resume at the first unanswered question; rename/remove unsupported move/transition promises.
4. **H1** add contextual correction links.
5. **H3 + M3** publish accurate privacy and coverage-limit wording.
6. **D4** add check-your-answers and skipped-answer review.

### Phase 1 — next four weeks
1. **M1**, then migrate tracker state for **B1**.
2. Ship **B1** with dated statuses and conservative next actions.
3. Research a small renewal pilot, then ship **B3** only for verified programs.
4. **D2, D3, E3, E4** as bounded content/safety improvements.
5. **H2** anonymous poll; establish baseline measures.
6. **I1** lazy guide rendering.

### Phase 2 — roughly two to three months
1. Expand **B3** after renewal-content QA.
2. **C4** common-document helper, followed by selected program-specific documents.
3. **F3** helper-channel metadata.
4. **F4**, preceded by privacy threat review and import-schema validation.
5. **I3**, **M2**, then **I5**.
6. Measure catalog performance; do **I2** only if budgets fail.

### Phase 3 — later
Pilot **B2, C1, C2, C3, D1, D5, F2, G1, G3, G4, E2**. Consider **G2/I4** only after demonstrated demand. Keep **F1/I6** dropped.

## Top-five implementation specs

### 1. A1 — derived municipal coverage
- **Model:** Generate municipality sets from records’ local `level`/service-area metadata; add explicit `serviceAreas` only where regional levels are ambiguous.
- **UI/files:** City question, fallback rule, impact/partner counts; `data.js`, `gen-data-packs.js`, `app.js`, `stateManager.js`.
- **Tests:** Every local record maps to selectable areas; no covered city receives generic fallback; PE has no city step; generated counts match records.
- **Acceptance:** No hand-maintained coverage count/list; regional municipalities behave correctly.
- **Verify:** Each local program’s actual service boundary—not merely mailing address.

### 2. A3 — truthful submission dates
- **Model:** Migrate `progress[id]` from a stage string to `{stage, stageChangedOn, submittedOn, history[]}`; legacy stages retain unknown dates.
- **UI/files:** Date prompt/default when choosing Submitted; editable timeline; `app.js`, `stateManager.js`, `dbManager.js`, `i18n.js`.
- **Tests:** Migration, invalid-date cleaning, calendar generation, timezone boundaries, no invented legacy date.
- **Acceptance:** Every follow-up is based on stored submission date; unknown means no calculated follow-up.
- **Verify:** No program research needed beyond existing sourced wait periods.

### 3. B1 — application caseboard
- **Model:** Use tracker history plus structured `statusGuidance` containing stage, action text, source, verified date and optional official wait.
- **UI/files:** “My applications” section, dated timeline, one next action, calendar action; `data.js`, `app.js`, styles/i18n, guide generator where reused.
- **Tests:** Ordering, persistence, keyboard/screen-reader operation, missing-guidance fallback, no approval prediction.
- **Acceptance:** Every tracked program has a truthful generic action; enhanced claims appear only when sourced.
- **Verify per program:** Submission channel, acknowledgement process, published service standard, contact route and required follow-up.

### 4. B3 — structured renewals
- **Model:** `renewal: {type, cadence, dueRule, leadDays, conditional, source, verified}` plus optional user-entered approval/expiry date in local state.
- **UI/files:** Upcoming list and `.ics`; `data.js`, `app.js`, `stateManager.js`, static guides.
- **Tests:** RRULE/VALARM validity, conditional suppression, unknown dates, calendar privacy, source/date completeness.
- **Acceptance:** No renewal is inferred from prose; uncertain rules tell users to confirm; only deterministic rules recur.
- **Verify per program:** Who renews, cadence, trigger, deadline, auto-renewal, notice method and consequences of missing it.

### 5. H1 — contextual corrections
- **Model:** Feedback payload may include record ID, page type and public URL—never answers, tracker state or query history.
- **UI/files:** “Suggest a fix” on program and organization pages; preselected category; `app.js`, guide generator, Worker, changelog.
- **Tests:** Privacy payload contract, static/in-app coverage, keyboard flow, failed submission fallback.
- **Acceptance:** Two clicks reach a prefilled correction form; public log records material resolved corrections without reporter details.
- **Verify:** Worker logging/retention, email retention and rate limiting.

## Privacy-compatible success measures

- Cookieless Cloudflare page views for caseboard, Upcoming, document-help and correction pages.
- Anonymous opt-in poll: “Did this show you a useful next step?” with only yes/no/skip and page type.
- Correction volume, validated-correction rate, median resolution time and repeat reports.
- Aggregate feedback themes, manually coded without retaining unnecessary personal text.
- Percentage of catalog records with structured renewal/status guidance and current verification.
- Content-integrity measures: source changes detected, reviewed and resolved; stale-record count.
- Accessibility/usability task completion from small consented sessions, reported only in aggregate.
- Performance budgets such as catalog interaction latency and initial payload size, without user tracking.

No files were changed and no build or tests were run. Verification is left to the orchestrator.
