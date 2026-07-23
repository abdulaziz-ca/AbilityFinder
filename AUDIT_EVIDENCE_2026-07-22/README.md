# AbilityFinder audit evidence index

Audit date: 2026-07-22 (America/Edmonton). Commit reviewed: `6171404` on `main`.

These are read-only audit artifacts. They are not application source, generated production data, or corrections to benefit records. No audit command committed, pushed, deployed, emailed, or submitted personal information.

## Evidence files

- `architecture-qa.md` — architecture, automated-check and state-space evidence.
- `benefit-integrity.md` — initial program-integrity findings and official-source checks.
- `initial-catalog-claims.csv` — 925 exact claim rows for 27 benefits and associated value/meta/extra/signer fields.
- `initial-catalog-expanded.md` and `initial-ledger-counts.json` — method, findings and reconciled status counts for that ledger.
- `remaining-ab-federal-claims.csv` — 772 exact benefit/directory/support claim rows for the remaining Alberta/federal scope.
- `remaining-ab-federal.md` — source ledger, findings and limitations for those rows.
- `remaining-ab-federal-associated-claims.csv` — 109 associated value/meta/extra/signer rows for the remaining 18 Alberta/federal benefits.
- `remaining-ab-federal-associated-summary.md` — counts and findings for those associated fields.
- `complete-browser-passes.md` — explicit browser/manual/resilience coverage checkpoint; distinguishes inherited evidence from unrun tests.
- `remaining-bc-claims.csv` — 48-record BC ledger accounting for 1,458 atomic main-record assertions and associated metadata. Claims are grouped per record rather than one CSV row per scalar; this is a disclosed granularity limitation.
- `remaining-bc.md` — detailed BC findings plus 353 assertions across BC grants, organizations, help entries and BC-resolving supports.
- `lighthouse-production.json` and `lighthouse-production-desktop.json` — raw production Lighthouse 13.4.1 lab reports.

## Status vocabulary

- Verified: a current official source directly supports the exact claim, or a clearly internal display classification is accurately represented.
- Outdated: current official information supersedes the claim.
- Unsupported: the reviewed official source does not support the claim or the executable rule is broader than the official rule.
- Ambiguous: current official evidence conflicts or is not specific enough to resolve safely.
- Manual follow-up required: direct program-owner, specialist, legal, assistive-technology, production, or real-user validation remains necessary.

“Verified” applies only to the row, not the program as a whole. Link reachability is not factual verification, and no verification date should be advanced merely because a link responded.
