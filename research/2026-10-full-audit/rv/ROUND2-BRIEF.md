# Round 2: resolve blocked claims (full audit, 2026-10-20)

Read `rv/REVIEW-BRIEF.md` first. It holds the classification and fix rules, and they still apply.
Round 1 results are in `rv/out-*.json`. For each id in your batch, the `blocking_not_on_page` rows (and any
`differs` rows) list the claims that could not be confirmed from the round-1 snapshot.

For each id:
1. Find the official page(s) that state the blocked facts. Use only the program owner's official domains:
   gov.bc.ca, alberta.ca, ontario.ca, canada.ca, translink.ca, bctransit.com, octranspo.com, grt.ca,
   bchousing.org, the city's own site, and so on. Good leads are links in the record JSON (applyUrl, source,
   hrefs inside text) and links on the round-1 snapshot pages. You can find the links by fetching the
   snapshot's own URL and reading its anchors.
2. Fetch each page with `curl -sL -A "Mozilla/5.0" --max-time 30 <url>`, convert it to plain text, and
   APPEND it to `snapshots/<id>.txt` as a new section:
   `=== PAGE: <url> (HTTP <code>, <n> chars) [round 2]` followed by the text. Never delete existing sections.
   For PDFs, use `pdftotext -layout file.pdf -` if it is available. Otherwise skip the PDF.
3. If a site shows a CAPTCHA, bot check or 403, do not try to get around it. Note `"blocked": "<url>"` and
   move on.
4. Re-check only the blocked or differing claims against the new text, then classify them per the
   REVIEW-BRIEF.

Write ONE JSON array to the output path in your task. Use the same schema as round 1, with two extra fields:
`"new_pages": [urls appended]` and `"blocked": [urls]`. `confirmed` counts the round-1 blockers that are
now confirmed. Fixes must have an exact `old` substring from `rv/<id>.record.json` and keep hedges.
A claim the official pages truly no longer support is a DIFFERS whose fix removes it or softens it (e.g. drop
an amount the page no longer states). The fix should not invent a replacement.
