# Live journey sweep, abilityfinder.ca (2026-10-20)

Script: /private/tmp/claude-501/sweep/sweep.js (Playwright, real UI clicks). 10 provinces x 2 profiles (adult 19-59 working, low income, cannot walk far/transit barrier; child 6-11 learning disability, elementary, low income) = 20 journeys, plus guides index and 5 sampled static guide pages per province.

## Real problems

| Province | Profile | Step | What happened | Evidence |
|---|---|---|---|---|
| All 10 | both | any page load / results | Browser console error on every journey (CSP). Cloudflare analytics beacon and an inline script are blocked by the site's Content Security Policy. Cosmetic; no functional break seen. | `Loading the script 'https://static.cloudflareinsights.com/beacon.min.js/...' violates the following Content Security Policy directive` and `Executing inline script violates the following Content Security Policy directive 'script-src 'self''` |

No page errors, failed requests or HTTP >= 400 responses other than the CSP messages above.

## Checked and fine
- All 20 journeys reached results through the real UI (province step, city step picks first city). Result counts 22-30 programs each.
- No listed program name mentions another province or city (regex on names for all 10 provinces).
- Province notice present for MB and QC (.province-notice); QC results and guides in French.
- First 3 program guides opened from results (View guide button) for all 20 journeys: each shows an h1 and no "Not found".
- /guides/ returns 200 with an h1 (it has no external official-source links, which is expected for an index).
- 5 sampled static guide pages per province (50 pages): all 200, h1 present, external official-source link present.
- Caveat: the organizations/helpers check used generic class selectors (org/helper); it flagged nothing, but it may not have matched the real org block, so treat the "no other-province orgs" result as low confidence.
- Caveat: static-guide province matching is by title/URL/first 6 KB text, so samples may include cross-province pages.
