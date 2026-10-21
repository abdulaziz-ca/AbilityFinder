# Feature: "Dates to know" (deadlines), owner pick 2026-10-20

## Goal
A person whose results include a program with a real application date sees it plainly, and can add an
exact date to their calendar, without the site ever guessing or merging conflicting official dates.

## Data (already in `public/data.js`, do not edit facts)
`BENEFIT_DATES` (declared just above `BENEFIT_META`): `id → [{ kind, date, time?, expected?, conflict?, label, text }]`.
- `date` is "YYYY-MM-DD" (exact) or "YYYY-MM" (month only).
- `kind` is "deadline" | "opens" | "ends".
- `expected: true` means the source says "expected".
- `conflict: [...]` lists other dates the official pages give for the same step.
- `label` is a short heading and `text` is the official wording. Show both verbatim.
It must reach the browser through the data packs: `scripts/gen-data-packs.js` keeps all non-BENEFITS
declarations in `data-core.js`, so it is already there. Confirm that it is, and add it to the `Object.assign`
export list if needed.

## Rules
1. **Upcoming only.** An entry is shown while its date has not passed, using the visitor's local date:
   - for an exact date, the shown day itself still counts (it is the last day);
   - for a month-only date, the whole month counts;
   - with a conflict, use the LATEST of `date` and `conflict` for this test.
2. **Calendar only when it is safe.** "Add to calendar" is offered only for an exact date with no
   `conflict` and not `expected`. Month-only, conflicting and expected entries show the sentence "Check the
   official page; this date is not final." in place of the button.
3. **Never invent.** No recurrence, no "next year" dates, no reminders before the date unless they are
   computed from that exact date (see the .ics rules below).
4. **Nothing hidden or reordered in the results groups.** This is an extra block; it never changes any
   program's status or group (resultsGroups.js stays untouched).

## Results page
- Add a "Dates to know" block in `renderResults()`, directly below the results headline area and above the
  first group. It appears only if at least one upcoming entry belongs to a program shown in the visible
  groups ("Programs to check" or "Other programs to check"), never one from the "Not for your situation now"
  disclosure.
- One row per entry, sorted by date (month-only entries sort as the first of their month):
  - the formatted date in en-CA long form: "October 30, 2026", "October 30, 2026 at 4:30 p.m." when `time` is
    set, or "January 2027" for month-only;
  - the `label`, and "(expected)" when `expected`;
  - the program name as a link to its guide, using the existing detail-opening mechanism the results cards use;
  - the `text`;
  - then either an "Add to calendar" button or the not-final sentence.
- Use existing classes and components, for example the notice/callout styles already used on results. No new
  colours, fonts or layout system: the redesign comes later. Add minimal CSS only if nothing existing fits.
- Accessible: a real heading (h2) "Dates to know", a list (ul/li), and buttons with names that include the
  program, e.g. "Add Ontario Renovates (London) closing date to calendar".

## Program guide (app detail page)
- `renderDetail(id)` shows the same block, for that program only, near the top of the "how to apply" area.
  Upcoming entries only, with the same calendar rules.

## Static guides (`scripts/gen-guide-pages.js`)
- Show "Dates to know" with all entries (static pages cannot hide past dates). Add the line "Dates as of the
  last review (Month YYYY). Check the official page." using the record's verified month. No calendar buttons.

## Calendar file
- Reuse `icsDate`, `icsEsc`, `icsFold` and `icsUtcTimestamp`. Factor the VCALENDAR assembly in
  `buildReminderIcs` into a shared helper if that is clean.
- One all-day event on the date. `SUMMARY`: "<label>: <program name>". `DESCRIPTION`: the `text` plus
  " Official page: <applyUrl or source>". `UID`: `date-<id>-<YYYYMMDD>@abilityfinder.ca`.
- Two alarms: 7 days before at 9am (`TRIGGER:-P6DT15H`), and on the day at 9am (`TRIGGER:PT9H`).
- File name: `abilityfinder-<id>-date.ics`.
- The existing tracker "Remind me" calendar also gains these events for programs the person has tracked
  (stage set in `progress`), under the same rules. Its count and the existing tests must keep passing.

## i18n
- Chrome strings ("Dates to know", "Add to calendar", "(expected)", the not-final sentence, the static line) go
  through `t()` with English and French entries in `public/i18n.js`, like the surrounding strings. Data
  `label`/`text` stay as written; mark them with `recAttr(b)` like other record text.

## Tests
- `test/benefit-dates.test.js`:
  - schema: ids exist in BENEFITS, `kind` is in the enum, `date` and every `conflict` entry match
    /^\d{4}-\d{2}(-\d{2})?$/ and are real dates, label and text are non-empty;
  - **sourcing**: every date and conflict date appears in the record's own text (JSON of the BENEFITS entry +
    BENEFIT_META + BENEFIT_EXTRA) as "Month D, YYYY", "D Month YYYY", or "Month YYYY" for month-only;
  - `data-core.js` exports BENEFIT_DATES.
- `test/` unit coverage for the pure helpers: upcoming filter (exact, month-only, conflict uses the latest),
  calendar eligibility, date formatting, ICS for one entry (two alarms, folding, escaping).
- `e2e/dates-to-know.spec.js` (chromium):
  - an Ontario London profile (senior or disability, homeowner if asked, low income) sees "Dates to know"
    with "Applications close" for Ontario Renovates (London) and an "Add to calendar" button. The download is
    a valid .ics with the right DTSTART, use `page.clock` / `timezoneId` like reminder-calendar.spec.js;
  - with the clock set to 2026-10-31, that row is gone and the "Expected to reopen" row shows the not-final
    sentence with no button;
  - a Waterloo profile shows the conflicting deadline with the not-final sentence and no button;
  - a profile with no dated programs shows no "Dates to know" block;
  - the London program guide (detail) shows the block.
- `npm test` passes. Do not run the whole Playwright suite (the orchestrator does); you may run your new spec
  with `--project=app-chromium`. First check that no other server is on port 8766
  (`lsof -nP -iTCP:8766 -sTCP:LISTEN`) and stop it if it belongs to another checkout.

## Versioning and procedure
- Bump `?v=` from 234 to 235 in `public/index.html` and the `dataAssetVersion()` fallback in `public/app.js`, and
  regenerate with `npm run gen:guides` (this also regenerates the packs).
- Add a DATA_CHANGELOG entry dated 2026-10-20: "Results and guides now show dates to know (for example an
  application deadline) for programs whose official page gives one, with a calendar reminder for exact dates."
- Commit on the branch with a message ending `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do not push.
