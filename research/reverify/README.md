# Benefit re-verification queue

This local review queue ranks benefit facts to re-check; it never edits facts.
It reads BENEFITS and BENEFIT_VERIFIED from public/data.js and
DATA_VERIFIED_MONTH from public/app.js. Scope preserves each record's level.
Official URLs come from source and applyUrl (deduplicated); dynamic URLs
are resolved for AB, BC and ON without using personal wizard answers.

Commands (run from the repository root):

1. `npm run reverify:queue` — write QUEUE.md and print five summary lines.
2. `npm run reverify:queue -- --snapshot <id>[,<id>...]` — fetch selected URLs;
   use `--snapshot-top N` instead to select the highest-priority records.
3. `npm run reverify:queue -- --snapshot-top 5 --diff` — preserve existing
   snapshots and write .new.txt files with sentence-level change summaries.

Priority = ageDays + 60 for inherited dates + 30 for dollar figures in
summary/amount fields. Month-only dates remain month-only; age uses the first
of that month as a ranking convention, not a claimed verification day.
Snapshots use GET, a 15-second timeout, sequential requests, a one-second pause
and a hard limit of 25 URLs. Redirects are not followed (they need a browser).
Non-200 responses/errors produce status-only snapshots and NEEDS BROWSER;
canada.ca automated-fetch 403 responses are expected, not a failed fact check.
Sentence comparisons are heuristic text leads, not authoritative page parsing.
A snapshot diff is a LEAD: a fact changes only after same-day verification
on the official page plus cross-agent review.
