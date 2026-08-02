# Phase 4 subtask source outline

Fact-carrying outline for the `level: "subtask"` entries to be appended to
`.taskview/board-spec.json`. Every fact was read out of the repo docs or measured on this
machine. **Do not add facts that are not in this file.**

## Selection rule applied

A story gets subtasks only where the source documents show **separately assignable work** —
different files, different environments, different tools, or an explicitly documented
"land these separately" instruction. A story does **not** get subtasks merely because its
`doneWhen` has many lines: restating acceptance criteria as child tickets is duplication, not
decomposition, and it is what the owner asked to avoid.

**49 Backlog stories were considered. 6 qualify. 43 do not.** The 30 Done stories are closed
history and are ineligible by definition.

### Rejected candidates and why (recorded so this is not re-litigated)

- **AF-S0702** (release-candidate checklist, 12 doneWhen lines) — the checklist items ARE the
  acceptance criteria. Splitting them creates 12 tickets that each restate one line. Rejected.
- **AF-S0102** (re-verify benefit figures) — ROADMAP names the swept source hubs, but this is a
  standing freshness duty rather than a bounded piece of work, and no document breaks it into
  assignable units. Splitting it by jurisdiction would be an invented work-breakdown. Rejected.
- **AF-S0402** (CI timeout root cause) — one investigation with one mechanism to find. The seven
  named failing spec locations are evidence, not separate assignments. Rejected.
- **AF-S0807 / AF-S0703** — authoring the post-deploy routine and executing it on the final RC
  are already two separate stories under the Phase 0 ruling G4. Rejected as already decomposed.
- **AF-S0301–AF-S0308** (accessibility) — AF-E03 is already decomposed one story per assistive
  technology and per reviewer. Further splitting would duplicate. Rejected.
- **Every story carrying `TBD — owner to specify`** — cannot be decomposed into concrete work
  until the owner supplies the missing scope. Rejected pending those decisions.

## Key convention

`AF-T<parent's four digits><index>`, e.g. the first subtask of `AF-S0103` is `AF-T01031`.
`AF-T` is unused elsewhere in the spec, so no collision with `AF-E*` or `AF-S*`.

## Shared field rules

- `level`: `"subtask"`; `parentKey`: the story key; `status`: `"Backlog"`.
- `tags`: always `type:subtask` plus the parent's `area:*`; carry a parent flag only where it
  genuinely applies to that child.
- `priority`: inherit the parent's priority unless stated otherwise below.
- `doNotRead` is the standard line. `detailedActivity` and `handoff` are empty strings.
- `sources`: the repo docs the facts came from.

---

# SUBTASKS

## Under AF-S0103 — [DATA] Re-verify GRANTS_DIRECTORY and ORGS_DIRECTORY entries (parent p2, area:data)

Evidence: ROADMAP lists these as two separate maintenance bullets — "Re-verify
`GRANTS_DIRECTORY` entries before their verified dates age out" and "Re-verify
`ORGS_DIRECTORY` entries before their verified dates age out". They live in two different
files, `public/grants-data.js` and `public/orgs-data.js`, both confirmed present in the repo.
Each can be re-verified and landed independently.

**AF-T01031 | [DATA] Re-verify GRANTS_DIRECTORY entries in public/grants-data.js | p2**
Facts: `public/grants-data.js` holds the grants directory. Its records describe what an
organisation offers and route to its own program pages; that is correct directory behaviour and
is not an intake-status claim — the basis on which ABFED-16/17 was disproved, with Easter Seals
and Dog Guides the two records concerned. Changes to this file require `npm run gen:context`.
DoneWhen: every entry past its verified date is re-checked against the organisation's own page on
the day; each is refreshed, corrected, or recorded as unchanged with its date; `npm run
gen:context` is run and the generated diffs in `src/benefits-context.js` and `src/links.js` are
reviewed; `npm test` and `npm run test:e2e` pass.

**AF-T01032 | [DATA] Re-verify ORGS_DIRECTORY entries in public/orgs-data.js | p2**
Facts: `public/orgs-data.js` holds the organisation directory and feeds `npm run gen:context`.
Practitioner searches put postal or coordinate text in a user-initiated Google Maps URL and that
text is not persisted.
DoneWhen: same shape as AF-T01031, against `public/orgs-data.js`.

## Under AF-S0401 — [TEST] TEST-01 eligibility oracle (parent p2, area:testing)

Evidence: REMAINING-WORK states the procedure directly — "Do these as **small separate
landings**. Do not combine them: mixing new test infrastructure with fixes for what it surfaces
produces an unreviewable diff and un-bisectable failures", and "treat the first red run as
**findings to triage separately**, not as something to force green in the same change". That is
an explicit instruction to split building the oracle from acting on what it finds.

**AF-T04011 | [TEST] Land the eligibility oracle as its own change | p2**
Facts: there is no systematic eligibility oracle across all programs; that gap allowed the
false-ready cluster. The oracle must cover outcome sets across every program. Land it alone,
with no fixes for anything it surfaces in the same diff.
DoneWhen: a machine-generated comparison shows every current catalogue program ID is covered;
the change contains no fixes for findings the oracle surfaces; removing the
`qualifyingRenovationSpend` gate makes the matcher-safety test fail with `Expected: "almost" /
Received: "ready"` and the failing output is recorded.

**AF-T04012 | [TEST] Triage the oracle's first red run into separate tickets | p2**
Facts: the first red run is to be treated as findings to triage separately rather than forced
green in the same change. DependsOn: AF-T04011.
DoneWhen: the first full oracle run's output is recorded; every failure is either raised as its
own ticket or recorded as an expected outcome with its reason; no failure is fixed inside the
oracle-landing change.

## Under AF-S0805 — [OPS] Production-only validation sweep (parent p2, area:ops)

Evidence: REMAINING-WORK's "Production-only validation" row enumerates these as distinct items:
"AI quota exhaustion, adversarial assistant prompts, email header sanitation in a non-delivery
environment, field Core Web Vitals without analytics". The first three need different
environments and techniques and are separately exercisable. The fourth is already covered by
AF-S0602 and the parent's own criteria, so it is not repeated as a subtask.

**AF-T08051 | [OPS] Exercise AI quota-exhaustion behaviour | p2**
Facts: Workers AI has no overage billing on the free plan; requests fail after the free
allocation. Workers AI can emit numeric streaming tokens as numbers — do not replace explicit
null/undefined checks with truthiness checks. Assistant rate limiting is live.
DoneWhen: quota-exhaustion behaviour is exercised with recorded evidence; the failure path is
shown not to produce a blank page or an unhandled error; no secret appears in any log.

**AF-T08052 | [OPS] Exercise adversarial assistant prompts | p2**
Facts: the assistant is intentionally narrow and grounded. It must not state dollar figures or
eligibility verdicts; figures are redacted from generated grounding. Assistant output stays on
`textContent` and is never rendered as HTML. Its role is not widened without a demonstrably
stronger model and a new safety review.
DoneWhen: adversarial prompts are run with recorded evidence; no response states a dollar figure
or an eligibility verdict; no response is rendered as HTML; no secret appears in any log.

**AF-T08053 | [OPS] Exercise feedback email header sanitation in a safe non-delivery environment | p2**
Facts: the feedback email binding is pinned to one verified destination. `MAX_BODY_BYTES`
(64 KB) rejects an oversized declared body with 413 **before any binding is touched**, so it
never consumes the KV rate limiter or reaches AI or email quota. The test must run in a
non-delivery environment.
DoneWhen: header sanitation is exercised in a safe non-delivery environment with recorded
evidence; the 64 KB rejection is confirmed to occur before any binding is touched; no secret
appears in any log.

## Under AF-S1401 — [OPS] GitHub issue sync for every open ticket (parent p2, area:ops)

Evidence: BOARD-BUILD-PROMPT §0 states `gh` CLI is "**not installed.** Use the Codex agent's
browser for GitHub, or install `gh` first and ask the user to authenticate." Confirmed on this
machine 2026-08-02: `command -v gh` finds nothing. That is a real enabling blocker, separate
from the sync itself. The branch and PR convention is a durable rule recorded once, separate
from creating issues.

**AF-T14011 | [OPS] Resolve GitHub tooling access | p2 | needs-owner-decision**
Facts: `gh` is not installed. The two documented routes are the Codex agent's browser, or
installing `gh` and having the owner authenticate. Repo is `abdulaziz-ca/AbilityFinder`. Never
put a token or credential value in a ticket, branch, commit, PR, log or command line.
DoneWhen: the owner records which route is used; the chosen route is demonstrated by reading one
existing item from `abdulaziz-ca/AbilityFinder`; no credential value appears in any record.

**AF-T14012 | [OPS] Create the matching GitHub issue for every open ticket | p2**
Facts: every open story and subtask gets an issue whose body carries the TaskView id and URL,
and whose ticket note carries the issue URL. **No issues for the rolled-up history tickets** —
that is the 32 entries with status Done. DependsOn: AF-T14011.
DoneWhen: every open ticket has an issue URL recorded in its note; every created issue carries
its TaskView id and URL; no issue exists for any Done history ticket; a listing reconciles
open tickets to issues one-to-one in both directions.

**AF-T14013 | [OPS] Record the branch and PR convention | p1**
Facts: branch convention is `taskview-<id>-<slug>`; the PR says `Closes #N` so merging closes the
issue. An agent marks a ticket Done only after its PR is merged **and** verification passes.
Every concurrently active task uses a separate git worktree and branch.
DoneWhen: the convention is written into the TaskView workflow documentation; it states the
branch pattern, the `Closes #N` requirement, and the merged-plus-verified rule for Done.

## Under AF-S1404 — [DOCS] Update the TaskView docs for the new board (parent p1, area:ops)

Evidence: the story names two files, both confirmed present: `TASKVIEW-WORKFLOW.md` and
`TASKVIEW-QUICK-REFERENCE.md`. They are separately editable and have different roles —
TASKVIEW-WORKFLOW.md is authoritative for TaskView-tracked coordination.

**AF-T14041 | [DOCS] Repoint TASKVIEW-WORKFLOW.md to goalId 3 | p1**
Facts: `TASKVIEW-WORKFLOW.md` still names `http://localhost:8888/org-fbbce12c/2/-1401`, which is
now the scratch board. The Ability Finder board is goalId 3 at
`http://localhost:8888/org-fbbce12c/3/-1401`, owner-confirmed. Changing this workflow is a human
gate — a doc-pointer update is not a workflow change, but any rule change is.
DoneWhen: the file names goalId 3 and the confirmed URL; the diff shows no rule, gate or status
list altered.

**AF-T14042 | [DOCS] Carry the note template and handoff convention into TASKVIEW-QUICK-REFERENCE.md | p1**
Facts: the note template order is Summary, Context block, Detailed activity, Handoff, then the
trailing `<!-- spec-key: KEY -->` comment as the last line. The Handoff section is written so the
next chat needs nothing else: Done so far, Left to do, Next concrete command, Gotchas found,
Revision and Board state.
DoneWhen: the quick reference names goalId 3, carries the note template in that order, and
carries the handoff convention; no workflow rule is altered.

## Under AF-S1406 — [DOCS] Reconcile the stale rows in the tracker and roadmap (parent p1, area:ops)

Evidence: the story names two files with distinct row sets, both confirmed present. The tracker
rows and the roadmap rows are independently editable.

**AF-T14061 | [DOCS] Correct the stale WEBSITE-PROJECT-TRACKER.md rows | p1**
Facts: tracker §1 still lists the money-band prominence decision and the conditional-results
framing as remaining, though both closed 2026-07-30 (`00fb18f`); it still lists the first-load
JavaScript and asynchronous IndexedDB restore item, though PERF-01 closed 2026-07-30 as WON'T
FIX. Tracker §2's optional coverage backlog lists the excise gasoline tax refund, CPP children's
benefits, the multigenerational home renovation tax credit, Alberta CAPCC, the Alberta
service-dog qualification and ID, and Alberta special-needs housing, though all six were built
and deployed 2026-07-29; it lists "verify Plan S", though Plan S was verified in detail
2026-07-29 and written as tips on `bc-fair-pharmacare`; and it asks whether PharmaCare Plan X
fits scope, though Plan X closed out of scope 2026-07-29 by owner decision and must not be
reopened. Tracker §9's recount of all 65 audit rows is real outstanding work: until it is done no
per-severity number may be stated.
DoneWhen: each listed stale row is corrected or dated against REMAINING-WORK; the Plan X row
records the closed owner decision and the do-not-reopen caveat; no per-severity number is stated
unless the 65 rows have been recounted and finding IDs re-mapped.

**AF-T14062 | [DOCS] Correct the stale ROADMAP.md rows | p1**
Facts: ROADMAP's coverage-gap section carries entries the working record supersedes. Its
"Deliberately rejected" list and its horizon direction stay as they are — only stale
coverage-gap and status rows are corrected. REMAINING-WORK is the working record and overrides
ROADMAP where they disagree.
DoneWhen: each stale ROADMAP coverage-gap or status row is corrected or dated against
REMAINING-WORK; the "Deliberately rejected" list and the horizon direction are unchanged; no new
number is stated without a re-count.

---

# DEPENDENCIES

Only these. Both are parent-internal, forward-only, and non-circular.

| blocked | blocked by | why |
|---|---|---|
| AF-T04012 | AF-T04011 | the red run cannot be triaged before the oracle lands |
| AF-T14012 | AF-T14011 | issues cannot be created before GitHub tooling access exists |

# COUNTS

14 subtasks under 6 parent stories: AF-S0103 (2), AF-S0401 (2), AF-S0805 (3), AF-S1401 (3),
AF-S1404 (2), AF-S1406 (2). No other story receives a subtask.
