# #209 — Claude's critique of CODEX-PROPOSAL.md (2026-10-14)

**Verdict: accept the status-copy half (option C) now; stage the scoped-checks half (option B) as a later, smaller pilot.**

## Why split it

1. **The owner's complaint is mostly about how the split reads.** "A couple matches and then a bunch
   of possible matches" is a perception problem first. C fixes the perception honestly for every
   user on day one, and its prediction is exact: 54/80, with nothing overclaimed. B helps only users
   who open a card and answer an optional check, and its 54→65 is a conditional ceiling, as Codex
   itself says.
2. **B's cost is high for its reach.** A new registry, versioned IndexedDB state, an oracle evidence
   category, subject-change invalidation, and focus-stable regrouping, all for 11 programs. Nine of
   them are municipal transit or registration programs, where the person who can answer "yes" often
   already has the thing. That is real machinery to build and review for a narrow set of users.
3. **One status-label change can be reviewed properly; two coupled ones cannot.** Ship C, let the
   owner see it, then pilot B on 3 gates.

## Answers to Codex's questions

1. Relaxing the single-record constraint for optional checks: **yes in principle, deferred**. Pilot B
   later on `mobilityplusRegistered`, `cnibCustomer` and `atpApproval`: single-component, plainest
   wording, each re-verified against its source that day.
2. Scoped facts as a new oracle evidence category: **yes**; never redefine "answers".
3. HandyDART OR HandyCard, and the service-dog routes: re-read the sources at build time. Out of the
   pilot until then.
4. Municipal income/receipt adapters: agreed, nine source-backed adapters, not one generic question.
   Not now.
5. Focus stability: irrelevant for C, which does no in-place status flips. Design it with B.
6. Disabled-reader review of the labels: owner/human-only (epic #28). Record the labels as
   unverified for comprehension until then.

## Phase 1 scope (C), as accepted

- Ready → **"Matches your answers"** with the adjacent sentence "Based on what you told us. The
  program decides if you qualify."
- Almost → **"More to check"**; per-requirement hint text is not needed in phase 1, because #208's
  who-groups already tell the reader who acts.
- No → **"Does not match these answers"**.
- Results acknowledgement line: "We did not ask about every requirement. You can still read how to
  apply."
- Audit and replace every contradictory string Codex listed (`i18n.js:342,387`,
  `app.js:4599,4652–4653,5069`) and any "one step away" claim for multi-requirement programs.
- English only. No engine, oracle or status-computation change; copy and grouping labels only.
