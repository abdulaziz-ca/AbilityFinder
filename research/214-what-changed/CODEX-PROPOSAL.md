# TaskView #214 — Codex design proposal

Design only; no implementation or tests run. Scope: public catalogue changes joined to local program IDs, with no account, analytics, remote storage, or personalized request.

## What the changelog can support today

- `DATA_CHANGELOG` is an array of `{ date, text }` entries, newest first (`public/changelog.js:1-20`). Dates are machine-readable day strings; they describe catalogue edits, not necessarily when a government changed a rule.
- **No entry has structured record IDs.** Some prose names programs, but others describe batches of 11–14 records without enumerating them (`public/changelog.js:9-12`). Task numbers, asset versions, and record counts are not record IDs. Do not extract IDs with name matching or an LLM.
- Many same-day entries exist (`public/changelog.js:3-7`, `public/changelog.js:11-15`). A day-only last-seen date misses later edits that day. Array position is also unstable when entries are prepended.
- Specificity varies: Kelowna's corrected income table is precise (`public/changelog.js:13`); batch summaries mix amounts, eligibility checks, guide caveats and application steps (`public/changelog.js:5-9`). Review-date updates explicitly change no facts (`public/changelog.js:3`), and presentation changes explicitly preserve rules (`public/changelog.js:16-20`). Do not notify for every entry.
- Today the Updates route sorts by date and renders escaped prose, separately from recently verified benefits (`public/app.js:3562-3595`). That public, unpersonalized feed must remain available.

### Minimal additive contract

Keep `date` and `text`; add two fields for entries eligible for personalized notices:

```js
{
  date: "2026-10-15", text: "Existing public explanation…",
  revision: 1, // example only: immutable, unique positive integer
  changes: [
    { recordId: "benefit-id", kind: "amount", summary: "The income limits were corrected." }
  ]
}
```

- `revision` is a publication sequence, not a date, asset version, or array index. Allocate strictly increasing revisions at publication; never reuse one or silently rewrite an acknowledged material change. A later correction gets a new revision, even if its effective date is older.
- `changes` is the minimal structured per-record link plus editorial materiality. Allowed `kind`: `amount`, `rule`, `deadline`, `application`, `coverage`, `contact`. One short plain-language `summary` per record/kind avoids exposing multi-program technical batch prose as a personal alert.
- IDs must be actual catalogue IDs, not program names. Unannotated entries remain public-feed-only. Reject malformed metadata locally without breaking results. No guessed all-record scope, automatic diffs, or use of `lastVerified` as a change signal.
- Typed targets such as grants/organizations can be added later; v1 covers benefit records in `browseCatalog()`, which backs results and the tracker (`public/app.js:3921-3939`, `public/app.js:4793-4800`). Never match an organization ID to a benefit merely because its string matches.

### Honest October 2026 back-fill

- Yes, **selectively**, after comparing the actual historical changes/review evidence with IDs in the catalogue. The narrow Kelowna entry is a good candidate; CDB/RDSP guide corrections need a materiality decision (`public/changelog.js:13`, `public/changelog.js:18`). No inferred amounts or eligibility claims are needed for neutral summaries.
- Batch entries can be annotated only where the historical diff proves both the affected ID and material assertion. A count or vague list is insufficient (`public/changelog.js:10-12`). Leave uncertain entries unannotated; do not fabricate completeness.
- Pure review-date/UI changes get no personal `changes` (`public/changelog.js:3`, `public/changelog.js:16-17`, `public/changelog.js:19-20`). A mixed batch lists only material changes for the relevant records, not every file/record touched.
- Assign initial revisions deterministically in documented publication order and freeze them before shipping. Same-day historical ordering needs evidence; otherwise treat it as one initial baseline, not a claim about which edit happened first.
- This checkout contains October 16–17 entries despite the session date being October 15 (`public/changelog.js:3-10`). Confirm publication status before annotation. Never use the device clock to decide whether an entry was published; the shipped catalogue defines the available revision set.
- Back-fill and rollout belong in the eventual implementation/review, not this design file. Existing users with no new marker establish a silent baseline, so back-fill will not create retrospective first-use alerts.

## Options

| Option | Benefits | Costs / safeguards |
| --- | --- | --- |
| Results banner: “Program details were updated” with a link | Small footprint; easy to find on return; one keyboard target | Generic banners fatigue users and can imply every match changed. Count unique affected programs, not entries; no alert role or automatic dismissal. |
| Text badge on affected cards | Puts a change next to the relevant program; easy to scan | Repeated badges burden screen readers and crowded cards. Hidden/off-list tracked programs can be missed. No color-only signal; avoid repeating full change text in each accessible name. |
| “What's new for you” panel with grouped program links | Explains what changed, includes saved/in-progress records that no longer match; one review action | Can become long and distracting. Collapse details behind a native summary; short per-program bullets, dates and guide links; explicit acknowledgment rather than scroll tracking. |
| Public Updates page only, optionally filtered locally | Reuses the existing feed and avoids results clutter | Too easy to miss; current feed lacks ID links and batch prose can cause false alarms. Keep as fallback, not the primary experience. |

**Trade-off:** completeness matters more than a decorative badge, but absence of metadata must never mean “nothing changed.” Only claim that listed details were updated in AbilityFinder, not that government rules just changed or someone now qualifies.

## Recommendation

Ship a compact, non-modal **“Updates to your programs” panel on Results**, after the results heading and before the money/scenario sections (`public/app.js:3944-3953`). Show one count and a native expandable list; no badge in v1, no popup, no auto-open, no motion. Mirror a relevant program's pending items in its guide so a restored detail route does not hide the notice (`public/app.js:2390-2399`). Keep public Updates unchanged.

### Scope and materiality

- Relevant IDs = current `ready`/`almost` results + all valid tracker IDs + the previous displayed results IDs. Deduplicate by program. Results already separate matches from nonmatches (`public/app.js:3921-3939`).
- “Saved” is an application stage, not a separate saved-program database. Include every valid tracker stage, including submitted/waiting/approved/denied; a rule or renewal change may still matter (`public/app.js:145-154`, `public/app.js:4356-4383`).
- Preserve prior results IDs so a material rule update that moves a previous match to `no` can still be noticed. Describe those as “From your earlier results,” never as current matches. Retain the previous results set while its relevant notices remain pending; refresh it to the newly displayed matched set once those notices are acknowledged. Tracked IDs remain relevant independently.
- Material = an edited amount/limit/cost; eligibility rule or exception (including a record-specific matching correction); application/renewal deadline; benefit coverage; necessary documents, application route or availability; or an important application contact correction. Editorial review must decide, not a substring test.
- Exclude styling, generic label changes, grammar, unchanged source checks, review timestamps and routine link replacement to the same functioning information. A restored qualifier can be material even when it corrects our description rather than a government's policy.
- Group multiple pending changes under each program with a date and short summaries. Link to its current guide and official source. Do not invent old/new values if the entry does not supply them.

### Exact local storage contract

Use the **existing** IndexedDB record, not a new localStorage key or database:

- DB `abilityfinder`, DB version **1**, store `sessionState`, keyPath `session_uuid`, record key `00000000-0000-4000-8000-000000000001` (`public/dbManager.js:19-23`, `public/dbManager.js:38-68`). No IndexedDB schema upgrade is needed.
- Proposed payload `schemaVersion: 2` (currently 1), with exact key **`ui.programChanges`**:

```json
{
  "version": 1,
  "seenByProgram": { "benefit-id": 12 },
  "lastResultIds": ["benefit-id"]
}
```

- `seenByProgram[id]` is the highest publication revision this device has baselined or explicitly reviewed for that record, **not a visit timestamp**. No wall clock, browsing-event history, profile hash or user identifier is added.
- Add build/restore validation in `stateManager.js`; arbitrary properties are currently dropped by construction (`public/stateManager.js:126-185`). Accept only version 1, plain objects, known benefit IDs, unique bounded ID lists and finite nonnegative integer cursors no higher than the shipped revision watermark. Bound map/list size by catalogue size and strip unknown nested keys.
- Missing, malformed or unknown-version metadata becomes an uninitialized marker, not an exception. Preserve the existing field-tolerant handling of other payload schemas; future/old/unversioned snapshots already have chaos fixtures (`e2e/persistence-chaos.spec.js:139-154`). A missing feature marker never proves an earlier visit date.
- Round-trip the new value via `persistentState()` and `loadState()`, currently explicit field-by-field bridges (`public/app.js:1968-1975`, `public/app.js:1992-1999`, `public/app.js:2008-2023`). Legacy migration supplies no invented marker. All raw IDB remains in `dbManager.js` (AGENTS.md:207-215).

### Marker lifecycle

1. **Await restore before computing any personal notice.** Preserve startup order: `await loadState()` precedes accessibility wiring, history readiness and `render()` (`public/app.js:5840-5858`). Rendering itself has no persistence side effects.
2. **First visit / first rollout use:** show nothing. After the first successful meaningful app render, initialize missing feature metadata silently to the current published watermark for all current benefit IDs, with `lastResultIds` empty until Results is displayed. This establishes a device-wide starting point, not a claim that each guide was read. Persist through the existing save path.
3. On a successful Results render, record the relevant matched IDs subject to the pending-prior-results retention rule above. A new catalogue ID without a cursor is silently baselined when first relevant; do not announce a newly added program as a changed one.
4. Existing initialized cursors advance **only on explicit “Mark reviewed”** for a program, or **“Mark these updates reviewed”** for all listed programs. Opening the panel, viewing a guide, opening Updates, navigating, printing, scrolling and ordinary reloads do not acknowledge anything.
5. The action advances only the affected records to the **captured revision watermark of that rendered notice**, not unseen later changes. Other records keep their cursors, so reviewing one program cannot swallow updates to another. Merely closing the expander does not dismiss the notices.
6. Save optimistically through the normal snapshot writer. Confirm acknowledgment only after successful persistence; disable duplicate clicks while saving. Conflict uses existing authoritative reload, never a stale retry (`public/app.js:1978-1983`, `public/dbManager.js:122-166`). Keep a session-only reviewed set on a non-conflict write failure, with truthful failure copy.
7. Clearing local data removes the marker with answers/progress through the same metadata-only tombstone. Reset then behaves as first use; a stale tab must not resurrect it (`public/dbManager.js:230-260`, `ARCHIVAL_KNOWLEDGE_BASE.md:168-177`).

### Exact copy

- Heading: **“Updates to your programs”**
- Summary, singular: **“Details for 1 program were updated in AbilityFinder.”**
- Summary, plural: **“Details for {N} programs were updated in AbilityFinder.”**
- Explanation: **“These are recorded updates since your last review on this device. They may correct our guide, not a change to the program itself. Other updates may not be listed. The program decides if you qualify.”**
- Expander: **“Show the updates”**; program link: **“Read the {program name} guide”**.
- Per-program provenance: **“In your results”**, **“Saved or tracked”**, or **“From your earlier results”**; use one appropriate label, not three repeated labels.
- Date label: **“Guide update: {plain-language date}”**. Example summary: **“The income limits were corrected.”** Only show a summary supported by the metadata.
- Actions: **“Mark reviewed”**, **“Mark these updates reviewed”**. Do not say “You have read these” or “All changes.”
- Successful aggregate action: **“These updates are marked reviewed on this device.”**
- Failed write: **“We could not save this review on this device. These updates may appear again next time.”**

The deliberately narrower “last review” copy matches acknowledgment semantics; do not promise a literal last visit or per-guide read time that we do not measure. Localize before release, or explicitly mark English-only text with `lang="en"` until translation is supplied.

### Storage unavailable / incomplete data

- No restored marker means **no personalized notice**, including when reads fail. Clean defaults cannot distinguish a first visit from blocked storage (`public/dbManager.js:92-110`). Never guess a prior date from legacy answers or `updatedAt`.
- If a valid marker was restored but writes later fail, keep changes visible/reviewable in memory; show the failed-write copy on acknowledgment. No persistent fallback, localStorage writes, cookie or remote request.
- Results/guides and the public Updates link remain usable. Do not show a storage warning merely to explain why a first visitor has no panel. Missing/malformed changelog metadata omits that item rather than breaking the whole screen.

## Risks and guard tests

These are proposed implementation gates, **not tests run in this design session**.

- **Restore-before-render / never blank:** delay restore; verify no default personalized notice, no premature baseline write, then the correct results/detail notice on the first meaningful render. Keep the initial visible loading/fallback surface and route `renderSafely()` (`AGENTS.md:61`, `AGENTS.md:211`, `public/app.js:2346-2399`). Bad optional metadata should omit the panel, not replace valid results with an error. Historical failures explain why (`ARCHIVAL_KNOWLEDGE_BASE.md:70-78`, `ARCHIVAL_KNOWLEDGE_BASE.md:151-157`).
- **Chaos:** extend real preboot seed fixtures, not async-init-script races (`e2e/persistence-chaos.spec.js:13-47`). Cover null/scalar/array markers, invalid versions, negative/oversized/noninteger revisions, huge lists, deleted IDs and unknown keys. Retain nonempty main, visible heading, usable a11y dialog/save, no pageerrors (`e2e/persistence-chaos.spec.js:50-75`).
- **Storage faults:** denied localStorage reads, denied IDB open, asynchronous VersionError, blocked open, aborted read/write and quota failure; no rejection escapes boot, no false saved confirmation. Existing guards cover SecurityError/VersionError but do not establish all transaction-failure behavior (`e2e/persistence-chaos.spec.js:198-249`).
- **Revision semantics:** first use silent; reload without acknowledgment repeats; expansion/guide view does not clear; same-day second revision appears; backdated newly published change appears; review only advances captured relevant records; new ID baselines silently; duplicate program mentions count once. Correct a published entry with a new revision.
- **Relevance:** unrelated-program edits show nothing. Tracked `no` programs and prior results that became `no` still appear, without a match claim. Changed answers do not by themselves generate a notice. Verify saved/gathering/submitted/waiting/approved/denied and self/child/family routes.
- **Cross-tab/clear:** stale acknowledgment after newer save, stale save after clear, stale clear after save and legacy import after tombstone; retain optimistic revisions and no resurrection (`public/dbManager.js:133-149`, `ARCHIVAL_KNOWLEDGE_BASE.md:159-177`). Older open app code must not silently erase the new field; rollout needs cache/version handling and an explicit compatibility decision.
- **No network / no PII:** with static assets loaded, block network and exercise notice/review/reload. Intercept fetch/XHR/beacon/WebSocket and assert this feature initiates none. Inspect actual stored payload: only approved program IDs/revisions plus existing allowlisted state; no new wizard copies, postal text, names, messages, arbitrary prose, or device identifier. Program IDs are potentially sensitive local data too; never put the personalized list in URLs/logs/telemetry (AGENTS.md:54-56, AGENTS.md:207-215, AGENTS.md:232-236).
- **Accessibility/readability:** semantic heading, native details/summary and buttons, descriptive guide links, escaped catalogue text; no `role="alert"` on entry or per-card live regions. Announce only user-triggered review outcome in one polite status. Preserve focus after removal (next item or panel heading, not body); if the panel disappears, leave a transient confirmation/focus target. Keyboard/screen-reader, 200–400% zoom, reduced motion, all themes and 4.5:1 contrast; enforce `[hidden]` precedence and surface readability gates (AGENTS.md:123-130, AGENTS.md:195-204, AGENTS.md:227-230).

## Questions for Claude

1. Agree that explicit review is safer than auto-clearing on a visit, and therefore “since your last review on this device” is the honest user-facing wording?
2. Can we audit October historical diffs for typed per-record changes without guessing batch membership, and settle the apparent future-dated entries before assigning immutable revisions?
3. Is the proposed retention of previous results IDs worth its extra local state, or should v1 explicitly miss untracked programs that drop out of matches? I favor retaining them to avoid the most consequential false negative.
4. Should all tracker stages remain in scope, as proposed, rather than only saved/gathering? Any fatigue concern should be weighed against renewal/application consequences.
5. How will a pre-feature open tab/build preserve or safely retire `ui.programChanges` on a later save? Existing revision checks reject stale snapshots, but an old build can reload a fresh revision and then drop unknown fields.
6. Can we agree on initial publication-order allocation and a maintenance guard requiring structured metadata for every newly logged material benefit edit, while allowing historical omissions?
7. Do we have an established localized status/focus pattern to reuse, and disabled-user reviewers who can check whether the panel is useful rather than another task to dismiss?
