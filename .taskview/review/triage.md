# Triage of the review findings — apply these, by the orchestrator

Apply **every** finding in your `findings<N>.json` EXCEPT the rejections listed below, and
subject to the global rulings, which override an individual finding where they conflict.

## REJECTED — do not apply

- **AF-S1404, "INVENTED FACTS: attributes the scratch-board URL to TASKVIEW-WORKFLOW.md".**
  The reviewer did not open that file. It genuinely contains
  `http://localhost:8888/org-fbbce12c/2/-1401` in its "Project and lifecycle" section. The
  spec's statement is correct — leave it. (Apply the reviewer's *other* AF-S1404 finding, the
  priority drop to Low.)

## GLOBAL RULINGS

**G1 — Settled decisions become Done, not Backlog.** Any entry whose only `doneWhen` was
"already decided" or which records a closed/won't-fix/do-not-reopen decision must have
`status` set to `"Done"`, keep `type:decision` in tags, and have `doneWhen` state the closure
condition that was met plus the trigger that would re-open it. This applies to: AF-S0309,
AF-S0310, AF-S0403, AF-S0404, AF-S0405, AF-S0602, AF-S0803, AF-S0904, AF-S1302. It does NOT
apply to AF-S0106 — see G6.

**G2 — AF-E06 becomes a Done epic.** Set AF-E06 `status` to `"Done"`. Do not delete it and do
not move its content into AF-E15. AF-S0601 and AF-S0602 stay its children, both `status`
`"Done"`. Its summary must say the first-load work is closed and recorded, not that it is
pending.

**G3 — Link-monitor ownership goes to AF-E01.** Remove link-monitor review from AF-E08's goal,
constraints and doneWhen. AF-S0101 stays under AF-E01 and is the single owner. AF-E08 keeps
only deploy, release-proof, credential and edge-configuration scope.

**G4 — Release-verification split.** AF-S0807 is the reusable post-deploy checklist and owns
the generic per-deploy checks. AF-S0703 is the finite final-RC execution and gains
`dependsOnKeys: ["AF-S0807"]`. AF-S0802 becomes `status: "Done"` covering the built-and-proven
CI gate invariant and its three observed states; remove its perpetual "every release" criterion
and remove the live-release verification that AF-S0807 now owns.

**G5 — Accessibility statements must not erase the testing that did happen.** Nowhere may the
spec say no screen-reader user has ever used the product, or that human accessibility testing
has not happened at all. The supported facts are: a real VoiceOver + Safari pass happened
2026-07-28 with one unresolved navigation-mode question; the owner completed 200% text, 400%
zoom/reflow, 320px portrait, forced-colours and print/print-to-PDF spot checks 2026-07-28 with
no defects found; NVDA and TalkBack have never been run; touch-target sizing and a specialist's
judgement are outstanding; the disabled-user study has not happened. Fix AF-E03, AF-S0302 and
AF-S0310 to say exactly that.

**G6 — AF-S0106 stays Backlog as a triggered ticket.** Its acceptance criteria begin only when
Alberta publishes an official signer-profession list; until then the ticket's content is the
hold itself. State the trigger explicitly. Do not mark it Done.

**G7 — AF-S0306 conducts, AF-S0308 dispositions.** AF-S0306 closes when the specialist review
has happened and its findings are recorded reproducibly. AF-S0308 owns fix/won't-fix
disposition for every AT and user-testing finding and gains
`dependsOnKeys: ["AF-S0301","AF-S0302","AF-S0303","AF-S0304","AF-S0305","AF-S0306","AF-S0307"]`.

**G8 — AF-S1002 gains `dependsOnKeys: ["AF-S0501"]`** and replaces its placeholder criterion
with explicit requirements plus same-day CRA verification.

**G9 — The benefit-data workflow must appear in full wherever benefit facts can change.**
Every ticket that can change a benefit fact (AF-S0102, AF-S0103, AF-S0105, AF-S0501, AF-S1001,
AF-S1002, AF-S1102) gets these as explicit separate `doneWhen` items: the fact was verified
against the current official source **on the day**; the record retains its `source`;
`npm run gen:context` was run where applicable; `npm run gen:guides` was run where applicable;
the generated diffs in `src/benefits-context.js` and `src/links.js` were reviewed; a
`DATA_CHANGELOG` entry was appended in `public/changelog.js`; the shared `?v=N` in
`public/index.html` was bumped for any changed browser-loaded asset; `npm test` and
`npm run test:e2e` pass. Do not compress these into one line and do not soften "every benefit
fact" to "every figure".

**G10 — No severity counts or closure percentages anywhere.** Delete "only High/P1 outstanding"
from AF-S0501, "12 closed of 12" as an authoritative fact from AF-S1505, and "~83%" from
AF-S1516. Where a count must be referenced, attribute it — "the working record's table labels
this row complete" — and always carry the requirement to re-map finding IDs to severities
before quoting any total. The 65-row audit-table count is verified and may stay.

**G11 — Priority changes to apply**: AF-S0305 → 3 and add `blocker:release`; AF-S0401 → 2;
AF-S1004 → 1 (rationale: a Horizon 2 guard with no active arrangement, which becomes High the
moment a concrete clinic arrangement is proposed); AF-S1403 → 2; AF-S1404 → 1; AF-S1406 → 1;
AF-S0202 → 1. No other priorities change.

**G12 — AF-S0105 is not split into invented tickets.** Camrose is the only municipality the
docs name. Keep one story, scoped to one municipality at a time starting with Camrose, with
per-municipality acceptance criteria and the G9 workflow. Do not invent other municipality
names.

**G13 — Uncheckable acceptance criteria.** Where a finding says a `doneWhen` is not objectively
checkable, rewrite it into criteria a reviewer could verify from evidence alone: a named
artifact, a recorded date, a stated threshold, or a specific command and its expected output.
Never satisfy this by adding a criterion that is already true when the ticket is created. If a
required detail is genuinely not in the ground-truth docs, write
`TBD — owner to specify` rather than inventing a threshold, protocol or participant count.

**G14 — Fact corrections to apply verbatim**:
- AF-S0402: the job cap has blocked two good releases from two *different* causes — a slow
  Playwright browser-install mirror on 2026-07-28, and the `[app-chromium]` 90-second-timeout
  family on 2026-07-30. Do not say this timeout family blocked two releases.
- AF-S0804: root cause found 2026-07-28; the `run_worker_first` fix was attempted and reverted
  2026-07-29. Do not state a single WON'T FIX closure date of 2026-07-28.
- AF-S0808: paths are `public/robots.txt`, `public/sitemap.xml`, `public/404.html`, and
  `public/sitemap.xml` is generated, never hand-edited.
- AF-S1004: the rationale is "avoid **violating** CPSA standards and fee-splitting rules".
- AF-S1512: ABFED-16/17 concerned directory records in `public/grants-data.js` — Easter Seals
  and Dog Guides specifically. Do not attribute it to `public/orgs-data.js` or
  `PRACTITIONER_FORMS`, and do not generalise it to all directory records.
- AF-S1514: "All 13 PharmaCare plans were assessed. For the seven remaining plans, the
  assessment produced one new record, not seven."
- AF-S0204: remove the invented five-item list. ROADMAP says only that these were "the fourth
  and fifth gap entries written from a hub sweep without first reading the record that already
  covered it". State the rule and cite that wording; do not enumerate a list of five.
- AF-S1402: do not assert that no stable HTTPS callback exists. Make verifying whether one
  exists the first acceptance step.
- AF-S1406: add the tracker's "Decide whether B.C. PharmaCare Plan X fits the product scope"
  row to the enumerated stale rows — Plan X was closed out of scope 2026-07-29 by owner
  decision and must not be reopened.
- AF-E15: delete the sentence requiring a roll-up closing date to be verified against an
  official benefit source. Same-day official-source verification applies to benefit facts, not
  to project history dates.

**G15 — Do not change** any entry's `key`, `level`, `parentKey`, `title` or `area`, and do not
add or delete entries. Only `priority`, `status`, `tags`, `note.*` and `dependsOnKeys` may
change. The entry count in each file must be identical before and after.
