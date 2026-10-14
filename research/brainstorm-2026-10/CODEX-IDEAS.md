# Codex ideas — October 2026 restart

Brainstorm, 2026-10-13. These are proposals, not authorization to change workflow, deploy, or publish benefit facts. I skimmed `AGENTS.md`, `ROADMAP.md`, `COVERAGE-GAPS.md`, the first 80 lines of `REMAINING-WORK.md`, `package.json`, and the requested directory inventories; I also inspected existing print-plan code, the changelog, CI, and TaskView's review/selection gates. I did not load the large audit or perform live official-source verification.

The useful restart is maintenance plus a less exhausting application journey, not another headline feature. Print plans/reports, document lists, calendar reminders, local recovery, freshness warnings, and an eligibility oracle already exist: the proposals below extend them. Coverage notes contain historical counts and resolved items, so they are leads rather than current catalogue truth; none of these ideas asserts a newly discovered missing program.

All proposals preserve no accounts, no analytics, no remote questionnaire storage, and zero paid infrastructure. New scripts/workflows/tests named below are explicitly proposed files. Browser asset changes also require the existing shared version bump in `public/index.html`; affected generated context, links, guides, and sitemap must be regenerated through their scripts, never hand-edited. Any benefit-fact change requires same-day official-page and relevant PDF review, real `BENEFIT_VERIFIED` evidence, and a material `DATA_CHANGELOG` entry.

### 1. A privacy-previewed action plan people can actually hand over
- What: Extend `renderPrintActionPlan()`, `printResults()`, and `reportProfileLine()` with an accessible on-screen preview and a choice between a minimal next-steps sheet and a detailed personal report. Default the handover sheet to omit disability, income, age, city, and approval-status profile details; show exactly what will appear before browser print/Save as PDF, with guide links and review dates alongside each selected benefit. Keep sharing user-mediated through a downloaded PDF, never a profile-bearing URL or an upload service.
- Why it helps a real user (or protects accuracy): A caregiver or clinic can help with concrete next steps without receiving an accidental dossier; the preview also makes the existing print-only plan usable before printing.
- Effort: M; `public/app.js`, `public/styles.css`, `public/i18n.js`, `e2e/quick-wins.spec.js`, `test/privacy-contract.test.js`, proposed `e2e/action-plan.spec.js`.
- Risk / which hard constraint it brushes against: Exported PDFs can contain sensitive benefit selections even without profile text. Warn about sharing and shared-device downloads; never imply a match is an award or include an unsupported combined entitlement total.
- Can agents do it end-to-end without the owner? yes — implementation and synthetic-browser verification can be peer-reviewed within an approved task; production deployment remains separately authorized.

### 2. One document-gathering checklist across selected applications
- What: Aggregate existing `BENEFITS[].detail.documents` into an opt-in checklist for selected/tracked benefits, showing which application needs each item and retaining each original wording. Initially merge only identical text, not supposedly equivalent income proofs; let users tick “ready” locally without recording document contents, numbers, filenames, or uploads. Provide a printable blank checklist even when persistence is unavailable.
- Why it helps a real user (or protects accuracy): Someone applying to several programs can gather papers once while still seeing each program's exact requirements.
- Effort: M; `public/app.js`, `public/styles.css`, `public/stateManager.js`, `public/dbManager.js`, `test/state-manager.test.js`, `test/persistence-boundary.test.js`, proposed `e2e/document-checklist.spec.js`; reads `public/data.js` without requiring fact edits.
- Risk / which hard constraint it brushes against: Deduplication must not erase distinct requirements. Any new requirement or claim that two documents are interchangeable needs official-source verification; checklist flags require an explicit local allowlist and clearing behavior.
- Can agents do it end-to-end without the owner? yes — conservative exact-text grouping and catalog-backed boolean state need no new benefit facts or product-scope decision.

### 3. Deadline awareness without pretending dates are settled
- What: Add structured, source-backed application-window metadata and an “Upcoming or uncertain dates” section that feeds the existing local `.ics` flow. Pilot with `waterloo-ontario-renovates`, whose recorded web-page/fact-sheet conflict must be rechecked rather than converted into one confident deadline; distinguish application deadlines, user-chosen reminders, and age-window rules. Show expired or disputed windows as “check current intake,” not as proof that an application is impossible.
- Why it helps a real user (or protects accuracy): A time-sensitive opportunity is harder to miss, while conflicting official information remains visible instead of becoming a misleading calendar event.
- Effort: M; `public/data.js`, `public/app.js`, `public/changelog.js`, `e2e/reminder-calendar.spec.js`, `test/data-verification.test.js`; regenerate context and guides.
- Risk / which hard constraint it brushes against: Deadline facts decay quickly; timezone handling, annual recurrence, and stale intake dates can harm users. No email/SMS, inferred recurrence, or automatic reuse of last year's date.
- Can agents do it end-to-end without the owner? partly — agents can build and verify readable official sources; inaccessible sources or unresolved conflicting dates require escalation, not guessing.

### 4. “What changed since your last visit,” entirely on this device
- What: Give future `DATA_CHANGELOG` entries stable IDs plus affected benefit IDs and change categories, then add an opt-in local last-seen cursor. Show relevant material changes for tracked benefits, with an option to see all updates; suppress routine groundwork entries from the default view. First visit gets a clear baseline, and clearing local data also clears the cursor.
- Why it helps a real user (or protects accuracy): Returning users can find a changed form, rule, or application route without rereading the whole catalogue or confusing maintenance commits with new benefits.
- Effort: M; `public/changelog.js`, `public/app.js`, `public/stateManager.js`, `test/state-manager.test.js`, proposed `test/changelog-schema.test.js`, `e2e/persistence.spec.js`.
- Risk / which hard constraint it brushes against: This must not become visit analytics. Store only a validated local changelog cursor; do not infer structured historical facts from old prose or transmit tracked IDs.
- Can agents do it end-to-end without the owner? yes — start with future structured entries and retain the old public changelog unchanged rather than reconstructing uncertain history.

### 5. A scheduled re-verification queue, not an automatic fact editor
- What: Build a deterministic queue from `BENEFIT_VERIFIED`, catalogue fallback dates, `GRANTS_DIRECTORY`, and `ORGS_DIRECTORY`, prioritizing dated figures, deadlines, high-impact income programs, and records without individual evidence. A bounded weekly free-CI job produces a maintainer report; agents review a small assigned batch against official pages and linked PDFs that same day, with one agent researching and the other checking the complete evidence. Never advance a verification date because a fetch succeeded or an amount string was found.
- Why it helps a real user (or protects accuracy): Regular, manageable reviews attack silent factual decay, including eligibility and forms that link monitoring cannot validate.
- Effort: M; proposed `scripts/build-verification-queue.js`, `.github/workflows/accuracy-review.yml`, `test/verification-queue.test.js`; reads `public/data.js`, `public/grants-data.js`, `public/orgs-data.js`; verified patches use `public/changelog.js` and existing generators.
- Risk / which hard constraint it brushes against: Automated checks are only triage, not same-day official verification. Cap run time, requests, artifact retention, and free Actions usage; if no free allowance is available, use manual/local orchestration rather than paid runners.
- Can agents do it end-to-end without the owner? partly — queue and accessible-source batches are autonomous; blocked sources, authority conflicts, CI configuration, and release gates may need a person.

### 6. Official-page diffs that point reviewers to changed paragraphs
- What: Add a bounded official-source watcher alongside, not inside, the existing rotating link monitor. Normalize relevant public page sections and linked PDF text, preserve fetch date/URL/content hash, and compare with the last successful baseline in short-lived CI artifacts; highlight changes near amounts, rules, forms, and dates. A blocked fetch, parser failure, or missing baseline is “unknown,” never “unchanged,” and no content patch is applied automatically.
- Why it helps a real user (or protects accuracy): Review effort goes toward suspicious changes rather than repeatedly reading unchanged pages, while a working URL is no longer mistaken for current facts.
- Effort: L; proposed `scripts/diff-official-sources.js`, `test/official-source-diff.test.js`, `.github/workflows/accuracy-review.yml`; reuse `scripts/link-sources.js` and generated `src/links.js`; keep `src/link-check.js` dedicated to link health.
- Risk / which hard constraint it brushes against: Navigation noise, dynamic pages, PDF extraction errors, and artifact expiry create false positives/negatives. Use public sources only, bounded free infrastructure, and same-day independent review before any fact update.
- Can agents do it end-to-end without the owner? partly — agents can implement extraction and fixture tests; anti-bot barriers require an authorized human reading path, never circumvention or third-party summaries.

### 7. Freshness labels that distinguish evidence from inherited dates
- What: Replace ambiguous freshness presentation with explicit “This program reviewed on…” versus “Catalogue review month; no individual review recorded.” Add a static public overview of individual-review coverage and overdue/unknown records, plus a maintainer report joining those records to `/api/link-health`; calculate counts from the current filtered catalogue rather than repeating historical documentation totals. Do not stamp legacy records with new dates just to make the dashboard green.
- Why it helps a real user (or protects accuracy): Users can judge the strength of the review claim, and maintainers can see whether the apparent freshness is actually record-level evidence.
- Effort: M; `public/app.js`, `public/data.js` (metadata only unless separately verified), `public/styles.css`, `test/data-verification.test.js`, `e2e/org-verified-dates.spec.js`, proposed `test/freshness-summary.test.js`.
- Risk / which hard constraint it brushes against: “Recently reviewed” is not an eligibility guarantee, and broken links do not prove program closure. Do not expose Worker/KV internals or turn the page into traffic analytics.
- Can agents do it end-to-end without the owner? yes — honest labels and derived summaries need no invented verification dates.

### 8. A visible explanation of what the finder cannot conclude
- What: Add a short results/guide disclosure separating “not covered here,” “not assessed,” and “a requirement we did not ask about.” Use the existing `COVERAGE-GAPS.md` categories as editorial input, reconcile them against the actual catalogue before publishing, and explain unprovable gates on `dtc` and `bc-msp-supplementary-benefits` without changing their matcher behavior. Offer existing official routes and the organizations directory rather than interpreting no match as no help.
- Why it helps a real user (or protects accuracy): People are less likely to abandon a real application or believe the site has checked every municipal program and every eligibility condition.
- Effort: M; `public/app.js`, `public/i18n.js`, `public/styles.css`, `COVERAGE-GAPS.md`, `e2e/matcher-safety.spec.js`, `e2e/eligibility-oracle.spec.js`; reads existing gates in `public/data.js`.
- Risk / which hard constraint it brushes against: Root documentation is not deployable content and may be stale. Do not claim new gaps without AGENTS.md's record-ID and keyword searches; no new scope expansion or false eligibility certainty.
- Can agents do it end-to-end without the owner? partly — implementation and consistency checks are autonomous, but the still-open UX-02 comprehension gate needs real readers, not agent self-certification.

### 9. Low-fatigue guide reading with an always-visible next step
- What: Prototype a “short view” of existing guides: next application step, official link, documents, and unresolved eligibility cautions first, with longer background in clearly labeled disclosures. Preserve all original content and caveats, keep an equivalent expanded/print view, and run `scripts/check-readability.js` to identify confusing passages rather than automatically rewriting legal thresholds. Trial the layout on `dtc`, `cpp-disability`, and `odsp` before generalizing.
- Why it helps a real user (or protects accuracy): Someone with pain, fatigue, or cognitive overload can locate a useful action without losing qualifications that prevent misunderstanding.
- Effort: M; `public/app.js`, `public/styles.css`, `scripts/gen-guide-pages.js`, `scripts/check-readability.js`, `test/guide-note-heading.test.js`, `e2e/a11y-batch.spec.js`; generated `public/guides/**` changes through the generator.
- Risk / which hard constraint it brushes against: Shortening can hide exceptions or imply entitlement. Reordering existing text is safer than paraphrasing facts; altered factual wording still needs same-day verification, and French remains paused.
- Can agents do it end-to-end without the owner? partly — agents can ship a reviewed prototype, but comprehension and fatigue reduction require disabled-user testing before claiming improvement.

### 10. A reproducible assistive-technology test kit
- What: Turn the unresolved human accessibility work into a compact test protocol with synthetic self/child/family scenarios, expected focus/announcement behavior, 200–400% reflow checks, and a findings template. Extend browser tests for keyboard completion, disclosures, print preview, reduced motion, and forced colors; document exact manual VoiceOver/NVDA steps alongside the automated evidence. Keep an explicit “not yet tested by people” status until actual sessions happen.
- Why it helps a real user (or protects accuracy): Accessibility regressions become reproducible issues, and the owner needs to arrange focused sessions rather than design a testing program from scratch.
- Effort: M; proposed `research/accessibility-test-protocol.md`; `e2e/wizard-accessibility.spec.js`, `e2e/a11y-batch.spec.js`, `e2e/layout-stability.spec.js`, `REMAINING-WORK.md` only when evidence changes status.
- Risk / which hard constraint it brushes against: Accessibility is the product; browser automation is not evidence of lived usability. Use synthetic profiles and consented, minimized human feedback, with no new remote questionnaire storage.
- Can agents do it end-to-end without the owner? partly — protocol, automated checks, and issue preparation are autonomous; participant recruitment and actual human/AT validation need people.

### 11. Accurate value labels for forgivable loans
- What: Add a distinct `loan` value kind and migrate both `london-ontario-renovates` and `waterloo-ontario-renovates` together after same-day source/PDF review. Label repayability/forgiveness clearly in results, guides, and reports; keep mixed grant portions explicit and ensure loan principal is never summed as ordinary annual benefit income. Update the machine-readable vocabulary and every rendering/estimate path together.
- Why it helps a real user (or protects accuracy): A homeowner can distinguish assistance with conditions from cash they will never have to repay; this resolves a concrete schema compromise already documented in coverage gaps.
- Effort: M; `public/data.js` (`BENEFIT_VALUES`), `public/app.js` (`valueParts()` and report totals), `public/changelog.js`, `scripts/gen-guide-pages.js`, `test/benefit-meta-complete.test.js`, proposed `test/loan-values.test.js`; regenerate grounding and guides.
- Risk / which hard constraint it brushes against: Money classification is a factual change, not cosmetic cleanup. Do not invent amortization, guaranteed forgiveness, or combined grant-plus-loan entitlement; reverify both records, not just one.
- Can agents do it end-to-end without the owner? yes — provided both official sources are readable and consistent; otherwise stop with a documented source blocker.

### 12. Persistence chaos tests for the journeys that must never go blank
- What: Expand the existing IndexedDB suite to cover denied/quota-exhausted storage, interrupted migration, catalogue ID removals, and two-tab clear-versus-save races. Browser scenarios should prove the current session remains usable, stale tabs cannot resurrect cleared answers, and recovery errors have accessible explanations with a usable restart path. Add the new checklist/cursor state from ideas 2 and 4 to the same boundary tests rather than inventing another storage layer.
- Why it helps a real user (or protects accuracy): A user does not lose the whole journey because their browser blocks storage or an old tab writes after they clear private information.
- Effort: M; `test/db-manager.test.js`, `test/state-manager.test.js`, `test/persistence-boundary.test.js`, `e2e/persistence.spec.js`, `e2e/app-ready.spec.js`; fixes, if demonstrated, in `public/dbManager.js`, `public/stateManager.js`, and `public/app.js`.
- Risk / which hard constraint it brushes against: Recovery must preserve allowlists, revisions, and metadata-only tombstones. Never persist assistant history, postal text, document contents, or arbitrary free text to make tests pass.
- Can agents do it end-to-end without the owner? yes — deterministic synthetic cases and cross-browser verification fit normal peer review without a new privacy boundary.

### 13. Release evidence that proves what actually went live
- What: Strengthen the current deploy job to distinguish “skipped because credentials absent” from “deployed,” then invoke the existing `scripts/verify-deploy.js` checks against the released assets/routes after an authorized deployment. Record commit identity, generated-file reproducibility, final test results, and smoke outcome together; test the skip and failure branches, not just the success path. Capture setup/test durations before changing CI timeouts, since the documented cache-miss budget is already tight.
- Why it helps a real user (or protects accuracy): A green workflow can no longer be mistaken for a delivered correction, and a route or asset mismatch is detected before agents announce a fix as live.
- Effort: M; `.github/workflows/ci.yml`, `scripts/verify-deploy.js`, `DEPLOY.md`, `test/asset-version-consistency.test.js`, proposed `test/release-evidence.test.js`.
- Risk / which hard constraint it brushes against: Do not bypass `needs: test`, reconnect Workers Builds, alter credentials, or introduce paid runners. Live probes use public synthetic routes only and must not submit real profiles or private content.
- Can agents do it end-to-end without the owner? partly — repository changes are autonomous; credential/dashboard state and production release authorization remain human gates, and live verification must actually run before claiming success.

### 14. One owner-approved operating envelope instead of per-task permission
- What: Propose a one-time policy amendment allowing Claude/Codex to select narrowly specified, dependency-clear Ready tasks in approved categories: tests, bounded UI repairs, and evidence-backed maintenance. Keep limits on concurrent tasks, diff scope, blocked-source attempts, and release authority; reserve new product scope, security/privacy exposure, cancellations, credentials, and human-test signoff for the owner. Send a short periodic digest of completed evidence, current blockers, and decisions needed, not a request to pick every next ticket.
- Why it helps a real user (or protects accuracy): Maintenance continues between owner visits without agents silently acquiring authority to change eligibility, privacy, or launch scope.
- Effort: S; proposed amendments to `TASKVIEW-WORKFLOW.md`, `TASKVIEW-QUICK-REFERENCE.md`, `AGENTS.md`; align `scripts/check-taskview-config.mjs`, `scripts/taskview-audit.mjs`, and `scripts/taskview-sync-board.mjs` only where their existing checks encode the approved rules.
- Risk / which hard constraint it brushes against: Current TaskView policy explicitly forbids automatic next-task selection and reserves policy changes/deployment for humans. This brainstorm is not consent to amend it; default remains ask-and-stop until approved.
- Can agents do it end-to-end without the owner? no — agents can draft the envelope, but the owner must approve the delegation once; after that bounded task selection can be autonomous.

### 15. Reciprocal review packets with final-revision verification
- What: Standardize a compact review packet: task/acceptance criteria, exact commit or diff identity, full changed-file list, complete official-page/PDF evidence with retrieval dates, generated diffs, and check results explicitly separating run/passed/not run. Rotate researcher/implementer and adversarial reviewer by task; use independent workers for source checking and browser verification, but only one implementer owns shared files at a time. Review findings must cite evidence and a failing scenario; after fixes, the other identity verifies the final revision before Done, with deduplicated updates if TaskView was offline.
- Why it helps a real user (or protects accuracy): Full source text prevents the false positives already recorded in `COVERAGE-GAPS.md`, and revision-specific evidence prevents a pre-fix approval from blessing an untested final patch.
- Effort: M; proposed `research/review-packet-template.md`; policy proposal in `TASKVIEW-WORKFLOW.md` and `TASKVIEW-QUICK-REFERENCE.md`; review artifacts following existing `research/REVIEW-codex-*.md`; targeted checks in `scripts/taskview-audit.mjs` if supported.
- Risk / which hard constraint it brushes against: Agent consensus is not official verification or human usability validation. Packets contain public-source evidence and synthetic test data only; never raw user submissions, and no worker may claim checks it could not execute.
- Can agents do it end-to-end without the owner? partly — the template and reciprocal review practice fit existing rules; formal policy amendments and any relaxation of human gates need owner approval.

## Top 5 I would do first

1. **5 — Scheduled re-verification queue:** restart with a small evidence-backed review batch, because silent factual decay is the largest existing risk.
2. **14 — Owner-approved operating envelope:** one explicit delegation decision removes recurring task-picking friction without abolishing safety gates.
3. **15 — Reciprocal review packets:** inexpensive structure makes longer runs and parallel workers safer immediately, especially with full official-source text.
4. **7 — Honest freshness labels:** distinguish inherited catalogue dates from individual evidence before asking users to trust another review badge.
5. **1 — Privacy-previewed action plan:** improve an already-built feature into a useful handover artifact without accounts, uploads, or sensitive share URLs.
