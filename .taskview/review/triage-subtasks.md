# Triage of the subtask review — orchestrator rulings

Apply every finding below. Where a ruling conflicts with a finding, the ruling wins.

## ACCEPTED — DELETE these 5 subtasks outright

- **AF-T04011** — the reviewer is right: it is AF-S0401 rewritten as a child. Its goal and all
  three doneWhen lines restate the parent's oracle-coverage, separate-landing and mutation
  criteria. DELETE.
- **AF-T04012** — the reviewer is right on the sourcing. REMAINING-WORK's "small separate
  landings" and "treat the first red run as findings to triage separately" sit under the
  **TEST-02** procedure heading and describe the browser-matrix work, not TEST-01. Applying that
  procedure to TEST-01 was an unsupported import, and the ticket also pre-creates triage work for
  failures that do not yet exist. DELETE.
- **AF-T14011, AF-T14012, AF-T14013** — AF-T14012 is the parent's entire deliverable restated,
  and once it goes AF-T14011 is setup for a deleted ticket. A single remaining child adds nothing
  over its parent. **AF-S1401 receives no subtasks**; its documented `gh`-not-installed fallback
  and the branch/PR convention stay in the parent's own constraints, which already carry them.

**Consequence: AF-S0401 and AF-S1401 receive ZERO subtasks.** Final set is 9 subtasks under 4
parents: AF-S0103 (2), AF-S0805 (3), AF-S1404 (2), AF-S1406 (2).

## ACCEPTED — fixes to the 9 survivors

**T1 — resolve every `TBD — owner to specify`.** No surviving subtask may keep a TBD in
`filesToTouch` or `readExactly`. Use the concrete path where one exists, or
`none — validation ticket` for the AF-S0805 children, which exercise running systems rather than
edit files. Every `readExactly` must be an exact minimal list.

**T2 — AF-T01032 must be self-contained.** Its doneWhen currently reads "same shape as
AF-T01031". A cross-reference is not an acceptance criterion. Write the full ORGS_DIRECTORY
criteria out.

**T3 — both AF-S0103 children carry the full data workflow, stated directly.** Each must include
as separate doneWhen items: the entry is re-checked against the organisation's own page **on the
day**; every changed record retains its `source`; `npm run gen:context` is run; `npm run
gen:guides` is run where applicable; the generated diffs in `src/benefits-context.js` and
`src/links.js` are reviewed; a `DATA_CHANGELOG` entry is appended in `public/changelog.js` for
every benefit-fact change; the shared `?v=N` in `public/index.html` is bumped for every changed
browser-loaded asset; `npm test` passes; `npm run test:e2e` passes. Do not rely on the parent or
the sibling to supply a non-negotiable.

**T4 — AF-T08053: drop the 64 KB clauses.** `MAX_BODY_BYTES` is SEC-04, a different and already
closed control. Scope this subtask to reproducible feedback email **header sanitation** in a safe
non-delivery environment only, with no credential value in any evidence.

**T5 — AF-T14041 expands to cover the note template and handoff convention.** The parent requires
both documents to carry them; repointing the URL alone leaves `TASKVIEW-WORKFLOW.md` short. Add
those to this subtask so the two children together satisfy the parent.

**T6 — AF-T14041 must not assert the route segment as a documented fact.** State it as: goalId 3
is confirmed, and the board URL `http://localhost:8888/org-fbbce12c/3/-1401` was confirmed by the
owner on 2026-08-01 and is recorded in `.taskview/board-checkpoint.json`; the first acceptance
step is to read the live board URL and use the observed route segment. Do not present `-1401` as
something the repository documents establish.

## REJECTED — do not apply

- **AF-T14013 "worktree rule is invented"** — factually wrong. `TASKVIEW-WORKFLOW.md`, which was
  in the reviewer's own read list, states "Every concurrently active task uses a separate git
  worktree and branch." The finding is moot anyway because AF-T14013 is deleted.

## DEFERRED to the owner — do not act

- **AF-S0805 missing a Core Web Vitals / field-INP child.** The reviewer proposes either adding a
  fourth child or removing those criteria from the parent. Both are plausible, but the parent's
  own criteria already cover the manual assessment and the INP record, and AF-S0602 exists as the
  standing field-INP record. Changing the parent is out of scope here because all 94 existing
  entries must stay unchanged. Record it as an open owner decision; add no subtask.

## HARD CONSTRAINTS

- Do not touch the 94 existing epic/story entries.
- Keep every surviving key, `level`, `parentKey`, `title` and `area` unchanged.
- Preserve the two dependencies only if their endpoints survive. AF-T04012→AF-T04011 and
  AF-T14012→AF-T14011 both disappear with their tickets, so **the final set has no
  dependencies at all** and every `dependsOnKeys` must be `[]`.
- Invent no facts. Anything not in the ground-truth docs or this triage is `TBD — owner to
  specify`, and no surviving ticket may keep a TBD in `filesToTouch` or `readExactly`.
