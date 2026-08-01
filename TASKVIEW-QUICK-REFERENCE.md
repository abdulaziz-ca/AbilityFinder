# TaskView quick reference

This is a **summary aid**, not the policy. It is distilled from `TASKVIEW-WORKFLOW.md`,
which remains authoritative — if anything here ever disagrees with it (or with
`AGENTS.md` for product/safety/architecture matters), the source document wins,
not this one. When in doubt, open `TASKVIEW-WORKFLOW.md`.

## Board lifecycle

```
Backlog → Ready → In Progress → Blocked → Review → Verification → Done
                                                            (Cancelled = terminal alternative)
```

- **Inbox** is untriaged capture only — it is not a project status and is separate
  from the board.
- Use full, linked **child tasks** for independently assignable work. Use lightweight
  native **subtasks** only as a checklist inside one owner's task — checklist items
  are not a substitute for ownership, status, dependencies, or evidence.

## Creating tickets: search first

- **Search the board before creating anything**, including completed *and archived*
  tasks. If a near-match exists, update or link it instead of creating a second copy.
- If a create call errors or times out, **re-read the board before retrying**. A
  retried create that actually succeeded the first time is how duplicates happen.
- Create child work by setting `parentId` on the child. The dependency edge that
  makes the relationship visible on the Graph is generated **automatically** from
  that parent link — don't hand-build a second edge for a parent/child pair.
- Use explicit dependency links only for prerequisites that are *not* parent/child.

## Before touching the repo: claim and isolate

1. Read `AGENTS.md`, `REMAINING-WORK.md`, `TASKVIEW-WORKFLOW.md`, and the full ticket
   (including dependencies/linked work) first.
2. Claim in TaskView **before any repository edit**: assign, add the identity tag
   (`agent:claude` or `agent:codex` — exactly one), move to **In Progress**, and post
   the initial claim update.
3. That claim update states approach, expected files/directories, checks,
   dependencies, and known uncertainty. If another active task might touch the same
   files/generated outputs, don't edit — record the overlap and move to **Blocked**
   until it's resolved.
4. Every concurrently active task gets its **own git worktree and branch**:
   `taskview-ID-short-title`. Never share a mutable worktree between concurrent tasks.
5. Confirm the worktree is on the intended revision and preserve all existing user
   changes — never move, erase, stage, or rewrite unrelated changes.

## Ticket notes

Every substantive note: **`## Summary`** first (current outcome/status, a few lines),
**`## Detailed activity`** after (files, decisions, commands, evidence, links,
dependencies, follow-ups).

Update TaskView only at these points — not routine command-by-command narration:

- claim
- a meaningful milestone (changes what's known/completed)
- a blocker or dependency change
- handoff to Review
- review result
- verification result
- completion or cancellation

## Scope, discoveries, blockers

- Work only the claimed scope. New independent work discovered along the way goes to
  **Inbox** as untriaged capture; once triaged, place not-yet-ready work in
  **Backlog** rather than auto-starting it.
- If discovered work *blocks* the current task: create/link it, record the exact
  dependency + evidence, move the current task to **Blocked**, and state what
  unblocks it. Use explicit TaskView dependency links, not just prose.
- A blocker note must state all six: **what** is blocked, **why**, **evidence** or
  reproduction, **safe mitigations already attempted**, the **owner/dependency**, and
  the **next action** needed.
- Before changing expected files, update the ticket. If scope starts to overlap
  another active task, stop and block — don't race or silently merge responsibilities.

## Git and linkage

- Link the TaskView task to its GitHub issue/branch/commits/PR; put the TaskView ID
  in branch and PR context and durable URLs/identifiers in the ticket.
- Commits should remain scoped to the claimed task. A commit or PR is evidence, not
  proof of correctness.
- Never put tokens, credentials, private user data, `.env` values, or other secrets
  in the repo, ticket notes, branch names, commits, PRs, logs, or command lines.

## Evidence-based completion (before Review)

- Re-read the ticket requirements and repository rules.
- Inspect the complete diff; confirm no unrelated user change was altered.
- Run the relevant tests, linters, generators, syntax/schema checks,
  security/privacy checks, and manual journeys `AGENTS.md` requires.
- Record commands and outcomes, including limitations/checks that couldn't run.
- Link issue/branch/commits/PR when they exist.
- Update documentation/generated artifacts when required.

Never move a task to **Done** while a required check fails. Don't hide, waive, retry
away, or relabel a failure without evidence and explicit authorization — it stays
**In Progress** or **Blocked** instead.

## Review → Verification → Done

- **Substantial work is reviewed by the other agent identity**: Claude's work is
  reviewed by Codex, Codex's by Claude. The implementer cannot approve their own
  substantial task (no self-approval).
- The reviewer actively tries to **disprove correctness** — independently checking
  requirements/acceptance criteria/scope, the full diff and repo state (not just the
  implementer's summary), whether tests meaningfully fail under a plausible mutation,
  security boundaries and abuse cases, accessibility, privacy/data/network/secrets,
  and regression risk/generated artifacts/compatibility/unrelated changes.
- Findings must cite concrete evidence, severity, and a reproducible correction path
  — no speculative accusations or style-only blocking.
- Sequence: **Review** (other agent challenges + records approval or findings) →
  **Verification** (after approved review + fixes, independently execute/inspect the
  acceptance evidence on the final revision — review approval alone is not
  verification) → **Done** (only once required checks pass, review is approved,
  verification evidence is attached, and no blocker remains).
- A failed review sends the task back to **In Progress** or **Blocked**.
- Tiny documentation/checklist work may use proportionate review only when policy
  permits — it still needs evidence and can't bypass failed checks.

## Human-only gates

By default, only a human may authorize or perform:

- deleting a TaskView project or task;
- changing the TaskView workflow or policy;
- major cancellations or cancelling committed product scope;
- production deployment;
- security-sensitive approvals, credential changes, incident closure, or accepting
  security/privacy exposure;
- resolving unclear product requirements.

Stop at the gate, document the decision needed and the options, and ask the user.
Agents must not relax these defaults themselves.

## Task selection

No automatic next-task pickup. After completing or blocking the current task, ask
the user what to do next and continue only with explicit approval — don't claim the
next Ready item just because it's available.

## Offline operation and reconciliation

- If TaskView is unavailable, don't invent server state. Record intended operations
  in `.taskview/offline-log.md` using its template: stable local entry IDs,
  timestamps, task IDs, prior/desired state, evidence.
- Continue offline only when the existing assignment/scope is unambiguous and no
  human gate or overlap is involved — otherwise stop.
- When TaskView returns: reconcile against current server state and sync entries
  once. Deduplicate by stable local entry ID and remote task/update identifier, skip
  already-applied transitions, preserve newer remote decisions, and record conflicts
  for human resolution. Never replay blindly or duplicate comments.

---

*Source of truth: `TASKVIEW-WORKFLOW.md`. This file summarizes it as of the date this
file was added and is not updated automatically when the workflow changes — if it
looks stale, trust `TASKVIEW-WORKFLOW.md`.*
