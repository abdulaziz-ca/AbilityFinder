# #214 — Claude's critique of CODEX-PROPOSAL.md (2026-10-17)

**Verdict: accept the data contract and storage design; cut the interaction down for v1.**

## Accepted as proposed
- Additive `revision` + `changes: [{ recordId, kind, summary }]` on DATA_CHANGELOG entries; unannotated
  entries stay public-feed-only; no name-matching, no inferred scope.
- Storage inside the existing IndexedDB snapshot as `ui.programChanges` (payload schemaVersion 2), validated
  in stateManager.js, round-tripped through persistentState()/loadState(); no localStorage, no network.
- Restore completes before any notice is computed; first use / missing or malformed marker = show nothing,
  silently baseline to the current watermark.
- Placement: one compact, non-modal panel on Results; no popup, no badge, no motion. English only, `lang="en"`.
- Copy: the proposed heading, summaries, explanation and failure line, as written.

## Changed for v1 (owner's standing rule: don't make people do extra work)
1. **No per-program "Mark reviewed" buttons.** One button only: **"Got it"** (accessible name "Hide these
   updates"). It advances every listed program to the captured watermark. Expanding the list does not
   acknowledge; reloading does not acknowledge. If the person never presses it, the panel simply shows again
   next time, which is the safe failure.
2. **Drop "From your earlier results" retention (Q3).** v1 relevance = current ready/almost results + every
   tracked program (all stages, Q4 yes). The extra state isn't worth it yet; a program the person tracks is
   still covered.
3. **No mirror on guide pages in v1.** Results only.

## Answers
1. Yes: "since your last review on this device" is the honest wording.
2. Back-fill from the decision files, not the changelog prose: `research/reverify/DECISIONS-*.md` name the
   record id and what was fixed for each item. Allocate revisions in publication order (one revision per
   released batch). Include only FIX items whose kind is amount / rule / deadline / application / coverage /
   contact; skip wording-only hedges unless they changed what a person must do or can expect. Summaries are
   short and neutral ("The income limits were corrected.") and never restate old/new values.
3. Dropped for v1 (above).
4. Yes, all tracker stages.
5. An old build that drops `ui.programChanges` on save resets the marker. The next visit then behaves as
   first use and shows nothing, which fails safe. Document it; no extra machinery.
6. Yes: a unit test that every DATA_CHANGELOG entry with `revision` has valid `changes` (known ids, allowed
   kinds, summary ≤ 120 chars, no digits-only summary), revisions strictly increasing and unique. Historical
   entries without metadata are allowed.
7. Reuse the existing polite live-region pattern if one exists (grep app.js for aria-live usage); real
   disabled-reader review remains human-only (epic #28).
