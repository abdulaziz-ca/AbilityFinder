# Site audit — decision (Claude, 2026-10-16)

Inputs: A-RESULTS-RELEVANCE.md, B-USER-JOURNEY.md, C-CONTENT-TRUST.md, D-ENGINEERING.md (Claude Opus
researchers) and CODEX-CRITIQUE-A.md (Codex, medium). The owner's complaint is confirmed by measurement:
across 15 personas only 9% of listed programs match the person's answers, and 20% of the "More to check"
items are already ruled out by what the person told us. These usually appear as cards 2–4.

## Results design — adopt Codex's simplified three-group version

1. **"Programs to check"** — visible, full cards. "Matches your answers" items first (that set is unchanged),
   then programs with a present route and no proven blocking fact, each with its specific missing check. The
   Disability Tax Credit's own row always stays here when DTC approval is absent or unknown.
2. **"Other programs to check"** — visible, one line each: "If you have [specific situation]: [program] — Read
   the guide." For programs that depend on a fact we did not ask about. Wording: "We did not ask about these
   situations."
3. **"Not for your situation now (N)"** — one closed disclosure. Prerequisite rows ("Disability Tax Credit
   approval needed first — see how to apply") are kept separate from definite exclusions ("Your city is outside
   this program's area — Edit answers"). Only reviewed, definite contradictions go here; "unknown" never does.
   The "What if my situation changes?" tool moves just below it, using the same classifier on hypothetical
   answers.

Headline: "Programs based on your answers". No big combined count, no money total until confirmable. If nothing
fits: "We need more information to narrow this down."

**Hard rules:** never change which programs are "Matches your answers" (outside separately tested bug fixes);
nothing is hidden (every in-scope program appears exactly once); out-of-province local programs are omitted
entirely; no editorial likelihood weights (#68 stays the owner's decision); within a group, order by evidence
strength, then name.

**Phase 1 classifier (own-answer facts only):** DTC "No, not yet" → DTC-dependent programs become prerequisite
rows; selected city or province outside a local program's area → exclusion. Further definite contradictions (age
limits, working status, receipt-based programs) are added one reviewed gate class at a time, each checked
against its official source.

**Phase 2 (next):** an optional "What do you already receive?" question (AISH / ADAP / ODSP / PWD / Income
Support / CPP-D), so recipients see "You get this" instead of being told to check it.

## Order of work
1. P1 bugs (in progress): keyboard auto-advance, province/city leaks + Okotoks, unasked-homeowner false
   negative, stuck loading screen, high-contrast/labels/guide footer link, results h1.
2. Content P1s: privacy contradiction; landing example results; future-dated changelog entries (Claude's
   error: session numbering used as dates) and the 54-vs-51 count; one amount source for live and static guides;
   disability-help page's false "never disqualifies" promise; RDSP "free government money"; verification-date
   wording.
3. Results three-group redesign (phase 1).
4. Engineering: cache headers for versioned assets; fail-closed unknown requirement keys; test server backlog
   (flaky e2e); CI split.
5. Phase 2 "already receive" question; content style guide and length budgets; French decision (owner).
