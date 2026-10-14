# AbilityFinder TaskView workflow

This is the authoritative shared workflow for Claude Code and Codex whenever work is tracked in TaskView. `AGENTS.md` remains authoritative for product, safety, architecture, and repository-specific rules; if these documents appear to conflict, stop and ask the user rather than guessing.

## Project and lifecycle

- TaskView project: **Ability Finder**, `goalId = 3`, at `http://localhost:8888/org-fbbce12c/3/-1401`. The local UI is `http://localhost:8888`; the API/MCP URL is `http://localhost:1725`. (`goalId = 2` is the retired "Kanban Setup" scratch board — leave it alone.)
- TaskView’s built-in **Inbox** is the untriaged capture area only; it is separate from the project board and is not a project status.
- Project board lifecycle, in order: **Backlog → Ready → In Progress → Blocked → Review → Verification → Done**. **Cancelled** is a terminal alternative, not a success state.
- Use full, linked child tasks for independently assignable work. Use lightweight native subtasks only as checklists within one owner’s task; checklist items are not substitutes for ownership, status, dependencies, or evidence.
- Identify the acting agent with exactly one identity tag: `agent:claude` or `agent:codex`. Keep identity separate from status, priority, and domain tags.

## Board composition and integrations (verified 2026-08-02)

- Board: project **Ability Finder**, `goalId = 3`, `http://localhost:8888/org-fbbce12c/3/-1401`.
- Composition: **15 epics + 79 stories + 9 subtasks = 103 tickets**. Every ticket carries a `<!-- spec-key: AF-… -->` marker; it is the idempotency anchor and must never be edited or removed.
- Graph: **104 edges = 88 automatic parent/child edges + 16 explicit dependency edges**. Parent/child edges are generated from `parentId`; `add_task_dependency` is used only for prerequisites that are *not* parent/child.
- GitHub: the **58 eligible tickets** (49 stories + 9 subtasks, none of them Done) are linked reciprocally to issues **#2–#59** in `abdulaziz-ca/AbilityFinder`. Epics and rolled-up history (Done) tickets deliberately have no issues. Each ticket note carries its issue URL and branch `taskview-<id>-<slug>`; each issue body carries `<!-- taskview-spec-key: KEY -->` and `<!-- taskview-task-id: N -->`, and its PR says `Closes #N`.
- Tooling: the `gh` CLI (2.97.0) is installed and authenticated as `abdulaziz-ca`. It is the supported route for GitHub work on this board.
- Slack: connected to `goalId 3`, channel `#ability-finder`, with exactly two lifecycle events enabled — **Task status changed** and **Task completed** — and all other lifecycle events disabled. **PRODUCT-LIMIT-01 (owner-accepted 2026-08-02):** TaskView exposes lifecycle-event toggles, not per-workflow-state toggles, so notifications **cannot** be filtered to only Blocked / Review / Verification / Done. The enabled pair is a deliberately accepted superset that also fires on Backlog, Ready, In Progress and Cancelled transitions. End-to-end delivery is **unverified** and stays so until a real lifecycle event occurs naturally.

### Reading the board programmatically

- `list_tasks` returns **top-level tickets only** — on this board, the 15 epics. Stories and subtasks are reached through their parent, so a full roster requires **recursive `get_task` traversal**; depth-2 subtasks are visible no other way.
- `showCompleted` is **exclusive, not additive**: the `false` pass and the `true` pass return disjoint sets. A complete roster is the **union of both passes**, de-duplicated by task id.
- A parent's `get_task` payload reports child tags as `[]`. Re-read the child to get its real tags.

### Note template (every ticket, in this order)

`## Summary` → `## Context block — a fresh agent starts here` → `## Detailed activity` → `## Handoff` → the `<!-- spec-key: AF-… -->` marker last.

The context block carries, in order: **Goal**, **Why it matters**, **Files to touch**, **Read exactly this and nothing more**, **Do NOT read**, **Constraints**, **Done when**, **Priority** plus a one-line rationale, **Parent / Children / Blocked by**, and **GitHub** (issue URL · branch · PR).

**Handoff convention:** an agent appends `## Handoff` when it finishes *or* when it is running low on context, written so the next chat needs nothing else — **Done so far**, **Left to do**, **Next concrete command / step**, **Gotchas found**, **Revision** (git SHA / branch), and **Board state**.

## Creating tickets: search before you create

Before creating any ticket, search the board for an existing one covering the same work, including completed and archived tasks. Retrying a failed creation is the usual cause of duplicates: if a create call errors or times out, re-read the board and confirm the ticket is genuinely absent before trying again. If a near-match exists, update or link it rather than creating a second copy.

Child work is created with `parentId` set to the parent ticket. The dependency edge that makes the relationship visible on the Graph is created automatically from that parent link — do not hand-build a duplicate edge for a parent/child pair. Use explicit dependency links only for prerequisites that are *not* parent/child.

## Before editing: claim and isolate

1. Read `AGENTS.md`, `REMAINING-WORK.md`, this file, and the full ticket, including dependencies and linked work.
2. Claim the task in TaskView **before any repository edit**: assign the agent, add its identity tag, move the task to **In Progress**, and add the initial claim update.
3. In that claim update, state the intended approach, expected files/directories, checks, dependencies, and known uncertainty. If another active task may touch the same files or generated outputs, do not edit: record the overlap and move to **Blocked** until ownership or sequencing is resolved.
4. Every concurrently active task uses a separate git worktree and branch. Name the branch `taskview-ID-short-title`, where `ID` is the TaskView ID and the suffix is short, lowercase, and hyphenated. Never share a mutable worktree between concurrent tasks.
5. Confirm the worktree is based on the intended revision and preserve all existing user changes. Never move, erase, stage, or rewrite unrelated changes.

## Ticket notes and update cadence

Every substantive ticket note must put a concise `## Summary` section first and a `## Detailed activity` section after it. The summary states current outcome/status in a few lines. Detailed activity records relevant files, decisions, commands, evidence, links, dependencies, and follow-ups.

Update TaskView only at these useful transition points:

- claim;
- a meaningful milestone that changes what is known or completed;
- a blocker or dependency change;
- handoff to Review;
- review result;
- verification result;
- completion or cancellation.

Do not stream routine command-by-command narration into tickets.

## Scope, discoveries, blockers, and dependencies

- Work only the claimed scope. Newly discovered independent work goes to the built-in **Inbox** as untriaged capture. Once triaged and added to the project board, place understood but not-ready work in **Backlog**. Do not auto-start it unless it blocks the current task.
- If discovered work blocks the task, create/link it, record the exact dependency and evidence, move the current task to **Blocked**, and say what event or decision unblocks it.
- A blocker note must identify: what is blocked, why, evidence or reproduction, attempted safe mitigations, owner/dependency, and the next action needed. Use explicit TaskView dependency links rather than prose alone.
- Before changing expected files, update the ticket. If scope begins to overlap another active task, stop and block rather than racing or silently merging responsibilities.

## Git and external linkage

- Link the TaskView task to any corresponding GitHub issue, branch, commits, and pull request. Put the TaskView ID in branch and PR context and put durable URLs/identifiers in the ticket.
- Commits should remain scoped to the claimed task. A commit or PR is evidence, not proof of correctness.
- Never put API tokens, credentials, private user data, `.env` values, or other secrets in the repository, ticket notes, branch names, commits, PRs, logs, or command lines.

## Evidence-based completion

The definition of done is evidence-based and task-specific. Before Review, the implementer must:

- re-read the ticket requirements and repository rules;
- inspect the complete diff and confirm no unrelated user change was altered;
- run the relevant tests, linters, generators, syntax/schema checks, security/privacy checks, and manual journeys required by `AGENTS.md`;
- record commands and outcomes, including limitations and checks that could not run;
- link the issue/branch/commits/PR when they exist;
- ensure documentation and generated artifacts are updated when required.

Never move a task to **Done** while a required check fails. Do not hide, waive, retry away, or relabel a failure without evidence and explicit authorization. A task with unresolved required checks remains **In Progress** or **Blocked**.

## Review, verification, and approval

Substantial work requires review by the other agent identity: Claude work is reviewed by Codex, and Codex work by Claude. The implementer cannot approve their own substantial task.

The reviewer must actively try to **disprove correctness**, while remaining evidence-based and professional. Independently inspect:

- the original requirements, acceptance criteria, dependencies, and claimed scope;
- the full diff and repository state, not only the implementer’s summary;
- tests and whether they meaningfully fail under a plausible mutation;
- security boundaries and abuse cases;
- accessibility, including relevant keyboard, screen-reader, zoom/reflow, motion, contrast, and cognitive-use implications;
- privacy, data retention, network requests, and secret handling;
- regression risk, generated artifacts, compatibility, failure paths, and unrelated changes.

Review findings must cite concrete evidence, severity, and a reproducible correction path. Avoid speculative accusations or style-only blocking comments. A failed review returns the task to **In Progress** or **Blocked**.

A substantial task follows **Review → Verification → Done**:

1. **Review:** the other agent challenges requirements and implementation and records approval or findings.
2. **Verification:** after approved review and any fixes, independently execute or inspect the acceptance evidence on the final revision. Review approval alone is not verification.
3. **Done:** only after required checks pass, review is approved, verification evidence is attached, and no blocker remains.

Tiny documentation/checklist work may use proportionate review only when policy permits, but it still needs evidence and cannot bypass failed checks.

## Operating envelope (owner-approved 2026-10-13)

The owner approved this in chat on 2026-10-13: "optimise the workflow between you two and do it so that I dont have to do anything and you guys judge work together and fix each others mistakes ... just do as you think is best among yourselves", and, after being told it loosens human-only gates, "i give you permission to go ahead with it". Inside this envelope Claude and Codex run the project between them; outside it, the human-only gates below still apply.

- **Task selection is autonomous.** Order: (1) finish anything in Review or Verification; (2) owner-reported complaints (tickets quoting the owner); (3) Ready; (4) Backlog by priority. Never start a task tagged `human-only` or `needs-owner-decision` — list it in `OWNER-DIGEST.md` instead.
- **Agents may add their own ideas** as tickets titled `[IDEA] …` (search-before-create still applies) and build them when S/M sized and inside the hard constraints of `AGENTS.md`. L-sized ideas, or anything that adds product scope, wait for the owner via the digest.
- **Concurrency:** at most 3 parallel workers; one implementer owns a given file at a time.
- **Pushing to `main` is allowed without asking.** The post-push verification in `DEPLOY.md` is mandatory: CI green on both jobs, and the live `?v=N` matching the committed tree. Never push while a run is in flight.
- **Cross-agent review stays mandatory** for substantial work, using `research/review-packet-template.md`. The reviewer tries to disprove. Benefit-fact findings are checked against the live official page before acting — reviewer false positives are real.
- **Disagreements:** two rounds of evidence. If still unresolved, the position more conservative for the end user wins (less certainty shown, qualifier kept, claim not shipped), and the disagreement is recorded in `OWNER-DIGEST.md`. No owner escalation unless a human-only gate is involved.
- **Thinking together:** for design decisions one agent writes a proposal and the other a critique, both in `research/<ticket>/`; the accepted design is recorded in the ticket before building. Medium effort for these, low effort for well-specified builds.
- **If the Codex/GPT usage limit runs out:** tell the owner; if there is no reply, Claude continues alone and marks the ticket "review owed by Codex". It stays in Review, not Done, until Codex reviews.
- **`OWNER-DIGEST.md`** at the repo root is the owner's single place to look: newest entry first; each entry gives the date, Shipped (commit + live version), Verified how, Decisions we made for you (reversible), and Needs you (true human gates only).

## Human-only gates

Only a human may authorize or perform:

- deleting a TaskView project or task;
- widening the operating envelope above, or otherwise relaxing this workflow or the TaskView policy (agents may refine process *inside* the envelope, never widen it themselves);
- major cancellations or cancellation of committed product scope;
- security-sensitive approvals, credential changes, incident closure, or acceptance of security/privacy exposure;
- spending money or adding paid infrastructure; adding accounts, analytics or remote storage of answers;
- new product scope outside `ROADMAP.md`, or un-pausing French;
- human accessibility-testing sign-off, or lifting the NO-GO;
- resolving unclear product requirements.

Stop at the gate, document the decision needed and options in `OWNER-DIGEST.md` and the ticket, and move on to other work in the envelope.

## Task selection

Next-task selection is **automatic within the operating envelope** (owner-approved 2026-10-13); see the order above. After completing or blocking a task, the agent picks the next eligible one without asking.

## Offline operation and synchronization

When TaskView is unavailable, do not invent server state. Record intended operations in `.taskview/offline-log.md` using the template, with stable local entry IDs, timestamps, task IDs, prior/desired state, and evidence. Continue offline only when the existing assignment and scope are unambiguous and no human gate or overlap is involved; otherwise stop.

When TaskView returns, reconcile against current server state and sync entries once. Deduplicate by stable local entry ID and the remote task/update identifier, skip already-applied transitions, preserve newer remote decisions, and record conflicts for human resolution. Never replay blindly or duplicate comments.
