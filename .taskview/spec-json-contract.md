# JSON contract for board-spec parts

Every entry is an object with EXACTLY these keys, in this order:

```json
{
  "key": "AF-E01",
  "level": "epic",
  "parentKey": null,
  "title": "EPIC — Data accuracy and freshness",
  "area": "data",
  "priority": 3,
  "status": "Backlog",
  "tags": ["type:epic", "area:data"],
  "note": {
    "summary": "2–4 sentences: what this is and its current outcome/status. Nothing else.",
    "goal": "one unambiguous sentence",
    "whyItMatters": "user/product/release impact",
    "filesToTouch": "explicit paths, or 'none — decision ticket'",
    "readExactly": "AGENTS.md, TASKVIEW-WORKFLOW.md, this ticket, + any specific file or grep command needed",
    "doNotRead": "AUDIT_REPORT_2026-07-22.md whole, AUDIT_EVIDENCE_2026-07-22/, archive/",
    "constraints": "the binding rules for this ticket",
    "doneWhen": ["one checkable criterion per array item"],
    "priorityRationale": "one line explaining the priority",
    "detailedActivity": "",
    "handoff": ""
  },
  "dependsOnKeys": [],
  "sources": ["REMAINING-WORK.md"]
}
```

Rules:

- `level` is `"epic"` or `"story"`. `parentKey` is `null` for epics, the epic key for stories.
- `priority` is an integer: 3=High, 2=Medium, 1=Low. It must match the outline.
- `status` is `"Backlog"` or `"Done"`, exactly as the outline states.
- `tags` always includes `type:epic` or `type:story`, plus `area:<area>`, plus every extra tag
  the outline lists for that entry (`type:decision`, `blocker:release`, `human-only`,
  `needs-owner-decision`). When the outline gives a row both `type:story` and `type:decision`,
  include both. Do NOT add `agent:claude` or `agent:codex` — those are claimed at work time.
- `dependsOnKeys` is `[]` unless the outline's DEPENDENCIES table or the entry's `DependsOn:`
  line names one.
- `sources` lists only the repo doc filenames the facts came from, e.g.
  `["REMAINING-WORK.md", "ROADMAP.md", "WEBSITE-PROJECT-TRACKER.md", "AGENTS.md",
  "TASKVIEW-WORKFLOW.md", ".taskview/BOARD-BUILD-PROMPT.md"]`.
- `detailedActivity` and `handoff` are always empty strings — they are filled in at work time.
- `filesToTouch` is `"none — decision ticket"` for every epic and for every entry tagged
  `type:decision`.
- For entries whose status is `"Done"`, the `summary` must state that it is already closed and
  give the closing date the outline provides, and `doneWhen` states the closure condition that
  was met.

**Fact discipline — this is the whole point of the ticket:**

- Use ONLY facts present in `.taskview/board-spec-source.md`. Do not add a figure, date,
  commit SHA, file path, count, percentage or program name that is not in that file.
- Copy figures, dates, SHAs and quoted strings VERBATIM. Do not round, convert or paraphrase a
  number. Do not compute a total from parts.
- If a field would need a fact the outline does not give, write
  `TBD — verify against official source on the day`.
- Preserve the outline's emphasis on what must NOT be done (won't-fix decisions, rejected
  approaches, do-not-reopen items) — those are the most valuable content on the board.
- Write plain prose. No markdown headings inside note fields. Apostrophes and em dashes are
  fine; make sure the JSON stays valid.

Output: a single JSON array of entries. Nothing else in the file — no prose, no code fences.
