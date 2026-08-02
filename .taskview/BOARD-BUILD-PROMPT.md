# AbilityFinder — TaskView board build brief

This file is the **master brief** for building the AbilityFinder TaskView board.
It is written to be re-read from a cold start. A fresh chat should be able to read
**only this file + `.taskview/board-checkpoint.json`** and know exactly what to do next.

**How to use it:** in a new chat, run the FabSol flow with:

> `/fabsol Read .taskview/BOARD-BUILD-PROMPT.md and .taskview/board-checkpoint.json. Execute the next unfinished phase only. Stop at the phase gate.`

Do not read this file's phases you are not executing. Do not read the repo beyond
the read-list for your phase.

---

## 0. Ground truth (do not re-derive)

| Thing | Value |
|---|---|
| Repo | `/Users/abdulaziz/Claude Random Apps/benefit-finder` |
| GitHub | `git@github.com:abdulaziz-ca/AbilityFinder.git` (`abdulaziz-ca/AbilityFinder`) |
| Live site | `https://abilityfinder.ca` (Cloudflare Worker, free plan, zero spend) |
| TaskView org | `org-fbbce12c`, organizationId `1` |
| **Target board** | project **"Ability Finder"**, `goalId = 3` — currently **empty**, 3 default columns |
| Existing columns on goal 3 | `18 TODO`, `19 In Progress`, `20 Done` |
| Old scratch board | "Kanban Setup", `goalId = 2` — **leave it entirely alone.** Do not read, copy, move, or delete anything on it |
| TaskView UI | `http://localhost:8888` · API/MCP `http://localhost:1725` |
| `gh` CLI | **not installed.** Use the Codex agent's browser for GitHub, or install `gh` first and ask the user to authenticate |

**Known stale pointer:** `.taskview/policy.json` has `"project_id": 2` and
`"project_url": ".../org-fbbce12c/2/-1401"`. Board 2 is now the scratch board.
This must be repointed to the Ability Finder board (Phase 1) — this is a factual
pointer correction, **not** a workflow change. Do not edit any rule, gate, or
status list in that file.

### Source-of-truth documents (all in repo root)

| File | Use it for | Size warning |
|---|---|---|
| `AGENTS.md` | product rules, safety non-negotiables, architecture, commands | 174 lines, read whole |
| `TASKVIEW-WORKFLOW.md` | the authoritative ticket lifecycle rules | 114 lines, read whole |
| `REMAINING-WORK.md` | **what is done / open / must-not-be-fixed.** The working record | 383 lines |
| `ROADMAP.md` | active priorities, horizon 1–5, coverage gaps, rejected features | 276 lines |
| `WEBSITE-PROJECT-TRACKER.md` | master checklist, completed vs remaining | 329 lines |
| `HANDOFF.md` | architecture + data model | 234 lines |
| `DEPLOY.md` | Cloudflare bindings, zero-spend, release checks | 155 lines |
| `ARCHIVAL_KNOWLEDGE_BASE.md` | failure history that must not be re-learned | 245 lines |
| `.taskview/policy.json` | statuses, agent tags, human gates | small |

**NEVER load whole:** `AUDIT_REPORT_2026-07-22.md` (120 KB) and
`AUDIT_EVIDENCE_2026-07-22/` (1.7 MB). Grep for one finding ID only when you need
its original evidence. `archive/` is off-limits unless a ticket names it.

---

## 1. What is being built

A three-level board on goalId 3 that is the single planning surface for the
Claude and Codex agents working on AbilityFinder, and readable by the owner.

```
Epic  →  Story  →  Subtask ticket
```

Every level is a **real TaskView ticket** with its own ID, note, priority, status
and tags. Child tickets are created with `parentId` set to their parent, which
makes them clickable in the parent's Subtasks panel and draws the edge on the
Graph automatically. **Never** use plain-text checklist subtasks for anything an
agent could be assigned — that is the exact problem this board is replacing.

### Non-negotiable outcomes

1. **No duplicates.** Every ticket carries a stable spec key. Re-running any phase
   must be a no-op. Search the board (including completed) before every create.
2. **Every parent/child link is a real `parentId`**, not a text list and not a
   hand-built dependency edge.
3. **Graph is correct.** Parent links draw themselves. `add_task_dependency` is used
   **only** for prerequisites that are *not* parent/child (e.g. "BC provincial
   expansion is blocked by the province-audit checklist").
4. **Every ticket is self-contained** — see the note template in §4.
5. **Priority is set on every ticket** with a one-line rationale.

---

## 2. Division of responsibility (owner's rule — do not reinterpret)

- **TaskView** — primary planning system: ticket hierarchy, agent ownership, status,
  summaries, dependencies, handoffs.
- **GitHub** — permanent engineering record: issues, branches, commits, PRs, reviews,
  code history. PRs link to issues and auto-close them on merge.
- **Slack** — notification layer only, for **Blocked / Review / Verification / Done**.
  Never store essential project context in Slack.

**Hard rule:** an agent marks a TaskView ticket **Done** only after its PR is merged
**and** verification passes. TaskView completion and GitHub issue closure stay consistent.

---

## 3. Permissions and safety (owner's rule — do not relax)

Agents **may**: create tickets; update status, notes, evidence, dependencies and
assignment **on tickets they own**.

Agents **may not**, without explicit user approval:
- delete tickets, projects, or columns;
- merge duplicates;
- overwrite user-written content;
- change board configuration (status list, workflow, gates);
- alter another agent's work.

Mistakes and duplicates are moved to **Cancelled** with a note explaining why, and
reported to the user. **Only the user permanently deletes.** These permissions may
be widened later by the user, never by an agent.

Also carried over from `TASKVIEW-WORKFLOW.md` and `AGENTS.md`, unchanged:
- Do not commit, push, or deploy unless the user asks.
- No secrets in tickets, branches, commits, PRs, logs, or command lines.
- Human gates: delete project/task, workflow changes, major cancellations,
  production deploy, security-sensitive approvals, unclear product requirements.
- Substantial work is reviewed by the *other* agent identity. No self-approval.

---

## 4. Ticket format

### Title
`[AREA] Imperative phrase` — e.g. `[DATA] Re-verify Medicine Hat 2026 figures`.
Epics are prefixed `EPIC —`. Keep under ~70 characters.

### Note template (every ticket, in this order)

```markdown
## Summary
<2–4 lines: what this is and its current outcome/status. Nothing else.>

## Context block — a fresh agent starts here
- **Goal:** <one sentence, unambiguous>
- **Why it matters:** <user/product/release impact>
- **Files to touch:** <explicit paths, or "none — decision ticket">
- **Read exactly this and nothing more:** AGENTS.md, TASKVIEW-WORKFLOW.md, this ticket
  <+ any specific file or `grep -n "ID" FILE` command needed>
- **Do NOT read:** AUDIT_REPORT_2026-07-22.md whole, AUDIT_EVIDENCE_2026-07-22/, archive/
- **Constraints:** <zero spend / no accounts / verify facts same-day / a11y gate / etc.>
- **Done when:** <checkable acceptance criteria, one per line>
- **Priority: <Low|Medium|High>** — <one-line rationale>
- **Parent:** #<id> · **Children:** #<id>, #<id> · **Blocked by:** #<id>
- **GitHub:** issue <url> · branch `taskview-<id>-<slug>` · PR <url>

## Detailed activity
<appended at the transition points listed in TASKVIEW-WORKFLOW.md only.
No command-by-command narration.>

## Handoff
<Appended by an agent when it finishes OR is running low on context.
Written so the NEXT chat needs nothing else:>
- **Done so far:**
- **Left to do:**
- **Next concrete command / step:**
- **Gotchas found:**
- **Revision:** <git SHA / branch> · **Board state:** <status at handoff>

<!-- spec-key: AF-XXX -->
```

The `spec-key` HTML comment is the idempotency anchor. It is invisible in the UI and
must never be edited or removed.

### Parent tickets additionally get

A child index table in `Detailed activity`, so IDs are copyable even outside the UI:

```
| # | Child ticket | Status | Priority |
|---|---|---|---|
| 41 | [DATA] Re-verify AISH figures | Backlog | High |
```

### Tags

Identity (exactly one per claimed ticket): `agent:claude`, `agent:codex`.
Level: `type:epic`, `type:story`, `type:subtask`, `type:decision`.
Area: `area:data`, `area:a11y`, `area:testing`, `area:perf`, `area:deploy`,
`area:ux`, `area:content`, `area:ops`, `area:research`.
Flags: `blocker:release`, `human-only`, `needs-owner-decision`.
Keep identity separate from status, priority, and domain.

### Priority mapping (owner's rule)

- **High (3)** — security/privacy risk, data loss, production outage, release
  blocker, or work blocking multiple other tickets.
- **Medium (2)** — active user-facing features, meaningful bugs, dependencies,
  normal engineering work.
- **Low (1)** — cleanup, documentation, optimization, archival work, experiments,
  future ideas.

The agent **proposes** priority with a one-line rationale; the owner may override.

---

## 5. Board structure to build

Statuses on goal 3 must end as, in order:

`Backlog → Ready → In Progress → Blocked → Review → Verification → Done`, plus
terminal `Cancelled`.

Achieve this by **renaming and adding only** — never delete a column:
rename `18 TODO` → `Backlog`, keep `19 In Progress`, keep `20 Done`, create
`Ready`, `Blocked`, `Review`, `Verification`, `Cancelled`, then set `viewOrder`.

### Epic set (proposed — confirm against the docs in Phase 0, adjust with evidence)

| Key | Epic | Notes |
|---|---|---|
| `AF-E01` | EPIC — Data accuracy and freshness | ROADMAP priority 1; the standing top risk (silent factual decay) |
| `AF-E02` | EPIC — Coverage gaps and scope decisions | Plan B placement, Plan X (closed, don't reopen), provincial child/family scope |
| `AF-E03` | EPIC — Human accessibility and usability testing | **The sole remaining NO-GO condition.** `blocker:release`, `human-only` |
| `AF-E04` | EPIC — Testing and quality infrastructure | TEST-01 eligibility oracle / regression suite |
| `AF-E05` | EPIC — Open product decisions | DATA-25, UX-02, UX-03, money-band prominence, conditional-results framing |
| `AF-E06` | EPIC — Performance and first load | PERF-01 residual JS gating + async IndexedDB restore |
| `AF-E07` | EPIC — Release readiness and NO-GO lift | The gate ticket everything above feeds |
| `AF-E08` | EPIC — Deploy, ops, and link monitoring | `/api/link-health`, Cloudflare zero-spend, cache `?v=N`, smoke tests |
| `AF-E09` | EPIC — Horizon 1: Alberta polish | Owner horizon 1, incl. trust/credibility artifacts |
| `AF-E10` | EPIC — Horizon 2: For Professionals v1 | Adviser quick reference, DTC/T2201 prep sheets. **NO paid referral inducements** — CPSA fee-splitting risk |
| `AF-E11` | EPIC — Horizon 3: Canada-wide, province by province | One province at a time, full source audit each |
| `AF-E12` | EPIC — Horizon 4: Multi-audience streams | Newcomers, seniors, veterans, caregivers… one at a time |
| `AF-E13` | EPIC — Horizon 5: Agency product | Separate paid portal; the deliberate revisit of the no-accounts rule |
| `AF-E14` | EPIC — Agent ops and board integration | GitHub sync, Slack notifications, workflow docs, board hygiene |
| `AF-E15` | EPIC — Shipped and closed (history) | **Done column.** Rolled-up only — see below |

### The history epic (`AF-E15`) — rolled up, not per-finding

The owner chose **rolled-up Done epics**, not one ticket per closed audit finding.
Under `AF-E15`, create one **story per closed cluster**, each listing its finding
IDs and dates in the note. Roughly:

- Audit closures by family: `DATA-*`, `BC-BC-*` (complete), `ABFED-*`, `DEPLOY-*`,
  `REL-*`, `PERF-01`, `UX-*`, and the 12 Low/Informational.
- Shipped product history: B.C. launch and the ~102-benefit catalog; wizard and
  functional-limitation matching; guides, progress tracking, printable reports,
  `.ics` reminders; IndexedDB persistence and recovery; grounded assistant and
  feedback endpoint; org/practitioner directories; Playwright matrix; the
  2026-07-29 federal/Alberta/B.C. record additions.

**Record the disproved and rejected outcomes too** — they are the most valuable
history to keep an agent from redoing work:
- BC-BC-02 and ABFED-16/17 disproved against primary sources; PERF-01's headline
  LCP figure was stale.
- **REL-06 — root-caused, WON'T FIX** on zero-spend grounds; behaviour still exists
  in production.
- PharmaCare Plan X closed as out of scope by owner decision — **do not reopen**.
- VAC disability benefits out of scope (2026-07-28).
- The `ROADMAP.md` "Deliberately rejected" list — give it its own `type:decision`
  ticket in Done so it is discoverable from the board.

Do **not** invent counts. `REMAINING-WORK.md` explicitly refuses to restate the
per-severity numbers because nobody re-mapped finding IDs to severities. Carry that
caveat into the ticket rather than computing a number.

### Non-parent/child dependencies to draw with `add_task_dependency`

Only where a real prerequisite exists, for example:
- `AF-E07` (NO-GO lift) blocked by `AF-E03` (a11y testing).
- `AF-E11` (province expansion) blocked by the province source-audit checklist story.
- Slack notification story blocked by the stable-HTTPS-callback story.

Do not add an edge for anything already expressed by `parentId`.

---

## 6. Execution model — spec-first, phased, restartable

The owner's requirement: *generate a spec first, review it skeptically, then create in
small idempotent batches with a checkpoint after each, so no chat runs out of context
mid-task and a rerun never duplicates.*

### Artifacts

| File | Role |
|---|---|
| `.taskview/board-spec.json` | Full ticket spec. Every entry has `key`, `level`, `parentKey`, `title`, `area`, `priority`, `status`, `tags`, `note` sections, `dependsOnKeys`, `sources` |
| `.taskview/board-checkpoint.json` | `{ phase, batch, keyToTaskId: {…}, completed: [...], notes: [...] }` — the only state a fresh chat needs |
| `scripts/taskview-sync-board.mjs` | Idempotent creator/updater driven by the spec + checkpoint |

**Idempotency contract for the script:** for each spec entry, resolve in this order —
(1) `keyToTaskId` in the checkpoint, (2) a board search for the `<!-- spec-key: KEY -->`
marker (including completed tasks), (3) only then create. After every single create,
write the new id into the checkpoint **before** the next call. If a create call errors
or times out, **re-read the board and confirm absence before retrying** — a retried
create is the single most common cause of duplicates.

### Phases — one phase per chat, then stop

| Phase | Work | Ends when |
|---|---|---|
| **0 — Recon & spec** | Read the source docs (respecting the size warnings), confirm/adjust the epic set, write `board-spec.json`. **Create nothing in TaskView.** | Spec written; **hand it to the other agent (Codex↔Claude) for a skeptical review** — duplicates, wrong priority, missing acceptance criteria, invented facts, orphan parents. Fix findings. Then present the epic + story counts to the owner and **stop for approval.** |
| **1 — Scaffolding** | Columns (rename/add only, then `viewOrder`), tags, and the `.taskview/policy.json` pointer fix (`project_id` → 3, `project_url` → the Ability Finder board, `kanban_route_segment` read from the real URL). Write the script. | Columns and tags verified by re-listing. Report the policy.json diff to the owner. Stop. |
| **2 — Epics** | Create the ~15 epics only. | All epics exist, ids in checkpoint. Stop. |
| **3 — Stories** | Create stories, **one epic per batch, max 10 tickets per batch**, checkpoint after each batch. | All stories exist. Stop after each epic if context is tight. |
| **4 — Subtask tickets** | Create subtask tickets with `parentId`, same batching. Then write each parent's child-index table. | Subtasks exist and are clickable from their parent. Stop. |
| **5 — Dependencies** | Add non-parent/child edges only. Verify on the Graph. | `list_task_dependencies` matches the spec exactly. Stop. |
| **6 — GitHub sync** | For each **open** story/subtask, create the matching GitHub issue (Codex browser, or `gh` if installed and authenticated). Issue body carries the TaskView id + URL; ticket note carries the issue URL. Establish the branch/PR convention `taskview-<id>-<slug>` and `Closes #N`. Do **not** create issues for the rolled-up history tickets. | Every open ticket has an issue URL and vice-versa. Stop. |
| **7 — Slack notifications** | Configure TaskView → Slack for **Blocked / Review / Verification / Done** on this board. This needs a stable HTTPS callback for the local TaskView; if that does not exist yet, create the enabling ticket under `AF-E14`, mark the Slack story **Blocked** with the dependency, and report it. | Configured, or correctly blocked with evidence. Stop. |
| **8 — Verify & document** | Full sweep: no duplicate `spec-key`; every ticket has priority + rationale + context block; no orphan parents; graph matches spec; counts reported. Update `TASKVIEW-QUICK-REFERENCE.md` and `TASKVIEW-WORKFLOW.md` with the new goalId, the note template, and the handoff convention. | Verification report handed to the owner with the board URL and counts. |

### Token discipline (applies to every phase)

- Never read `AUDIT_REPORT_2026-07-22.md` or `AUDIT_EVIDENCE_2026-07-22/` whole. Grep by ID.
- Never dump a full `list_tasks` payload into reasoning — request what you need,
  page through (`page` is 0-based, ~30/page, `showCompleted` for closed ones).
- Max **10 ticket creations** between checkpoints.
- When you judge you are past roughly 60% of your context, **stop mid-phase**: write
  the checkpoint, append a Handoff section to any ticket you own, and tell the owner
  the exact `/fabsol` line to paste into the next chat.
- Do not re-read this brief's phases you are not running.

### Phase gate

At the end of every phase, output exactly:

1. what was created/changed (with ids),
2. what was verified and how,
3. anything that needs an owner decision,
4. the copy-paste line to start the next chat.

Then **stop.** Do not roll into the next phase.

---

## 7. Rules that must survive into the tickets themselves

These come from `AGENTS.md` and must not be softened when writing acceptance criteria:

- **Never invent benefit facts.** Verify every amount, cutoff, rule, form, phone
  number, date and municipal detail against an official source **on the day**.
  Every benefit keeps its `source`.
- **Zero spend.** Production stays on Cloudflare Workers Free.
- **Privacy is part of the product.** No accounts, analytics, or remote storage of
  wizard answers. Only `/api/ask` and `/api/feedback` are opt-in server submissions.
- **Eligibility is functional limitation, not diagnosis.**
- **Never allow a blank page.** Everything renders through `renderSafely()`.
- Data changes require `npm run gen:context` and `npm run gen:guides`, a
  `DATA_CHANGELOG` entry, and a `?v=N` bump for changed browser assets.
- Automated axe results never substitute for testing with real disabled users.
- Treat the audit as a lead, not an authority — three findings were disproved.

---

## 8. First message to send

```
/fabsol Read .taskview/BOARD-BUILD-PROMPT.md in full, then execute Phase 0 only.
Create nothing in TaskView. Produce .taskview/board-spec.json, have the other agent
review it skeptically, fix what the review finds, then report the epic and story
counts and stop for my approval.
```

Every later chat:

```
/fabsol Read .taskview/BOARD-BUILD-PROMPT.md and .taskview/board-checkpoint.json.
Execute the next unfinished phase only, in batches of 10 with a checkpoint after
each. Stop at the phase gate.
```
