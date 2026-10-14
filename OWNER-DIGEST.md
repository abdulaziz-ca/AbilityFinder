# Owner digest

The one place to see what Claude and Codex did while you were away. Newest entry first.
Each entry: **Shipped** (commit + live version) · **Verified how** · **Decisions we made for you**
(all reversible) · **Needs you** (only things an agent may not decide).

## 2026-10-13

### Shipped
- **"Requirements to check" replaces "To unlock this you still need"** (#208, #207) — commits
  `b662019`, `7635bcf`, live as `?v=166`. Each unmet requirement now shows a one-line cue grouped by
  who acts (you / a professional / the program), with the full official wording under one
  "Read full requirements for …" disclosure. Results cards show up to three cues plus
  "and N other checks". The detail view used to drop every requirement after the second; it now
  shows them all. 87 of the 88 long requirements have a cue.
- **Honest freshness labels** (#212) — commit `8346345`, `?v=167`. 54 of 134 guides only carry the
  July 2026 catalogue review date; they now say "Part of the July 2026 catalogue review" instead of
  "Info verified". The About page states the live counts.
- **Readability ratchet** (#210) — `npm run check:surfaces` and a test that fails if the number of
  long, dense passages ever goes up.
- **Re-verification queue** (#211) — `npm run reverify:queue` ranks which records most need
  re-checking against their official page, and can snapshot and diff those pages.

- **Saved-progress crash fix** (#215a) — `6d9fac6`, `?v=168`. New chaos tests feed the app
  corrupt, truncated, oversized and failing saved data; one case (an old saved value that was a
  bare number) left the page stuck on "Loading your saved progress…" forever. Fixed.
- **Two misfiled requirements moved** (#216) — `03b5b26`, `1ec4dc0`, live as `?v=169`. The CDB
  payment calculation and the RDSP grant/bond deadline were blocking matches although they are
  not conditions for applying; their text now sits under "More about" in the official pages' own
  words (fetched 2026-10-14). The other two suspects were kept, with sourced reasons.
  `research/216-misfiled/`.
- Final state: CI **696 of 696** passed, `verify:deploy` 9 of 9 against production at `?v=169`.

### Verified how
- CI on `7635bcf`: 546 of 546 browser and Worker tests passed, both jobs green; the live site
  serves `?v=166` with the new layout. `?v=167` was in CI when this entry was written.
- Each change was built by Codex and reviewed by Claude, or the reverse. The cue review approved 75
  of 88 drafts and rewrote 13, two of which could have misled someone (an AISH coverage cue and a
  CPP children's benefit cue). The layout review caught link text left at the browser's default
  blue, unreadable in dark and high-contrast themes; that was fixed before release.
- Screenshots checked in light, dark and mobile.
- Link monitor: it reported 10 broken links. Claude opened each in a real browser; 9 load fine
  (the sites block bots). Only OC Transpo's reduced-fares page refused a browser too (#218).

- Two red CI runs on 2026-10-14, both caught by the deploy gate, so nothing broken reached users:
  a Firefox-only test assertion (fixed in `59f6fcd`), and a generated-file entry Claude forgot to
  stage (`1ec4dc0`). Claude also pushed once without reading the previous run's result first;
  that is now a written rule.

### Decisions we made for you
- The heading is now the neutral "Requirements to check" on both surfaces, replacing
  "To unlock this you still need" and "Before you can apply".
- English only for the new wording; French stays paused.
- `bcCydbIntake` has no cue on purpose; Codex judged it misfiled, and #216 will verify that.
- Codex's idea list is in `research/brainstorm-2026-10/CODEX-IDEAS.md`; seven became tickets
  #211–#217.

### Needs you
- **Commit the workflow change.** `TASKVIEW-WORKFLOW.md` now contains the operating envelope you
  approved, but Claude Code's safety classifier would not let Claude commit it (or edit
  `.taskview/policy.json`, `TASKVIEW-QUICK-REFERENCE.md` and the pointer in `AGENTS.md`). The edit
  is sitting uncommitted in `.taskview-worktrees/oct-resume`. Commit it yourself, or allow those
  edits in your Claude Code permission settings. Ticket #217.
- #83 (outreach one-pager) still awaits your sign-off from September.
