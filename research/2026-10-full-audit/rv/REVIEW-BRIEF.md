# Re-verification review brief (full audit, 2026-10-19)

You are checking existing AbilityFinder benefit records against a fresh copy of the official page.
Work only from the two files per record. Do not browse, do not use outside knowledge.

For each record id in your batch:
- Record: `research/2026-10-full-audit/rv/<id>.record.json` (benefit = the card/guide, values = amounts used
  by the estimator, meta = effort/wait, extra = FAQs/confirm/taxNote). `requires` lists internal gate names;
  ignore those.
- Official page text: `research/2026-10-full-audit/snapshots/<id>.txt` (fetched 2026-10-19; one or more
  `=== PAGE:` sections). If it appears in the snapshot, it is sourced. Do not flag it as unsupported.

Check every factual claim in the record: amounts, percentages, income and asset limits, ages, dates, deadlines,
who qualifies, what is covered, how to apply, documents, phone numbers, and names. Classify each:
- CONFIRMED: the snapshot supports it (give a short verbatim quote).
- DIFFERS: the snapshot says something different. That includes a changed number, a dropped condition, or a
  hedge hardened into a promise. For example, "may" becoming "will", or "up to" disappearing. Give the
  verbatim quote and the exact fix.
- NOT_ON_PAGE: the snapshot does not say it either way.

Special cases:
- If the snapshot is an error page or clearly not the program page, return `"snapshot":"bad"` for that id
  and skip it.
- Process steps, tips and phone numbers that are NOT_ON_PAGE are not blocking. Do not report them unless
  they look wrong.
- A NOT_ON_PAGE amount, percentage, income/asset limit, age limit, deadline or date is blocking. Report it.

Fix rules (strict):
- `old` must be an exact substring of a string in the record JSON (copy it character for character, as it
  appears inside the JSON string). `new` is the replacement. Keep the record's plain, short style.
- Keep the source's hedge words ("up to", "may", "about", "in most cases").
- Never add a fact that is not in the snapshot.
- Do not rewrite for style. Only fix what is wrong or out of date.
- If a value in `values` (numbers such as annualMax/monthlyMax) is wrong, report it as a fix with `field`
  `values.<key>`, `old` and `new` as numbers.

Write ONE JSON file (path given in your task), an array with one object per id:
{"id": "...", "snapshot": "ok"|"bad", "confirmed": <count>,
 "differs": [{"field": "...", "old": "...", "new": "...", "quote": "...", "why": "..."}],
 "blocking_not_on_page": [{"field": "...", "claim": "...", "why": "..."}],
 "verdict": "bump"|"fix-then-bump"|"keep"}
verdict: "bump" means everything that matters is confirmed. "fix-then-bump" means all DIFFERS rows have exact
fixes and nothing is blocking. "keep" means something is blocking or unsure.
Be strict, but do not invent problems. A third of past findings were false positives from reviewers who
skimmed. Read the whole snapshot before flagging anything.
