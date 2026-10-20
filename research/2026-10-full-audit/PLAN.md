# Full audit — accuracy, speed, optimization (owner directive 2026-10-19)

Owner: "going over all and everything for the website, the benefits, the organizations, the helpers, everything
needs to be checked and optimized for speed, accurate, and optimization". Then: features and fixes, then the
redesign. Work continues across usage resets; this file is the resume point.

## Phases (in order)

1. **Link health** — every `source`, `applyUrl`, help-org and directory URL (577 unique). Script:
   `scratchpad/linkcheck.sh` over `urls.tsv` → `link-status.tsv` (kind, id, HTTP, final URL, original URL).
   Re-check 000/5xx at low concurrency before acting (the network was flaky on 2026-10-19). For each 404 or
   moved page: find the official replacement, re-snapshot, and re-review the record.
2. **Accuracy re-verification** — `npm run reverify:queue` gives the oldest-verified records first. Records built
   in October 2026 from snapshots are fresh; the July–September AB/BC/ON records are re-verified first, in
   batches of ~15: re-snapshot the official page → independent review (PROV-REVIEW-BRIEF / QC-REVIEW-BRIEF for
   French) → apply fixes → bump `BENEFIT_VERIFIED`. Amounts and income limits first (they change yearly).
3. **Directories** — HELP_ORGS and ORGS_DIRECTORY: phone numbers, names, coverage, still-active check.
4. **Speed** — today the page ships ~560 KB of compressed JavaScript; `data.js` alone is 369 KB br
   (1.6 MB raw) and holds every province. Plan: load only the federal set plus the chosen province's records
   (split `data.js` per province, loaded on demand), keep static guides as they are, measure with
   `research/2026-10-site-audit/tools/D-perf.js` before and after. This is an architectural change: own commit,
   full test pass on all browsers, dark-flag if needed.
5. **Optimization pass** — dead code, duplicate helpers, oversized CSS, image weight in `public/`.

## Status

- 2026-10-19: Phase 1 sweep started (`link-status.tsv`).
- 2026-10-19: Phase 1 done. No 404s; 403s are bot walls (RAMQ, Revenu Québec, Morden, some cities); the 000s were
  canada.ca refusing curl (HTTP/2) and read fine in the browser pane. Results in `link-status.tsv`, `recheck-*.tsv`.
- 2026-10-19: Phase 2, federal set (13 records) re-read in the browser pane (same-origin fetch of the program
  pages and their eligibility/amount sub-pages). Every dollar figure matched the record (CDB $204.20 and
  $10,210/$14,294 exemptions, CPP-D $1,741.20 / $610.46, CWB disability $843, DTC $10,138/$5,914, MHRTC 14.5% to
  $7,250, CDCP $70k/$80k/$90k tiers, CDB-child $3,480 / $82,847, CPP children's $307.81/$153.91). Fixed two CDB
  wording points (supplement "fall 2026"; apply step no longer says "once applications are open"). Bumped to 2026-10.
- 2026-10-20: Phase 2, remaining 70 AB/BC/ON records: fresh snapshots (5 re-read in the browser pane), record
  extracts in `rv/<id>.record.json`, reviews by Codex (batches 1–3) and Sonnet (4–7) per `rv/REVIEW-BRIEF.md`,
  results in `rv/out-<n>.json`. Every DIFFERS row is checked by hand before `rv/apply.py --apply`.
- 2026-10-20: Phase 4 baseline (live v228, `D-perf.js`, iPhone 13 profile, 4x CPU): FCP 960 ms, LCP 1256 ms,
  ready 1458 ms, results render 142 ms (AB) / 72 ms (ON), browse-all 191 ms. Payload: data.js 284 KB br of
  ~470 KB total JS br. Biggest win left is network: per-province data split.
