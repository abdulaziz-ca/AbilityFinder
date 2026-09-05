# Coverage gaps — what AbilityFinder does NOT cover

TaskView #206. Last reviewed 2026-09-05.

The catalogue holds **117 records**: 16 federal, 14 Alberta, 42 British Columbia,
9 Ontario, and the rest municipal. This file is about everything else.

**Why this file exists.** A user or a partner organization currently cannot tell the
difference between three very different things: a benefit that does not exist, one we
have not added yet, and one we have deliberately decided not to add. Without that
distinction, silence looks like coverage. Someone deciding whether to trust this site
for their caseload deserves a straight answer, and so does the next person picking up
the work.

**This file is not a backlog.** It is a statement of known absence. Items move out of
it when they are built, or when the reason not to build them is settled.

## The four buckets

| Bucket | Means |
|---|---|
| **NOT YET BUILT** | Real, in scope, just not done. Needs same-day official-source verification like any other record. |
| **CANNOT MODEL** | Does not fit the record schema or the matcher — usually because there is no province-wide fact to state. |
| **OUT OF SCOPE** | A decision was made not to build it. The reason is recorded so it is not "fixed" later by mistake. |
| **NOT YET SWEPT** | Nobody has audited this area. Stated as unknown rather than implied complete. |

---

## Ontario

Ontario went live 2026-09-04 with province-level records and, initially, no municipal
coverage at all. This is where the largest gaps are.

### NOT YET BUILT
- **Municipal programs for 37 of the 42 listed Ontario cities.** Five are built —
  Toronto (Fair Pass, Welcome Policy), Ottawa (Hand in Hand), Mississauga
  (ActiveAssist), Brampton (ActiveAssist) and Hamilton (HSR Fare Assist), together
  reaching roughly 5 million people. Still unbuilt and known to run their own
  recreation or transit subsidies: London, Markham, Vaughan, Kitchener, Windsor, and
  the rest of the list. For comparison, Alberta and B.C. have 27 cities with programs
  between them. **This remains the single largest gap on the site.** Being listed in
  `ON_CITIES` only means a resident can pick the city; it does not mean the city has
  programs — `CITIES_WITH_PROGRAMS` is that list.
  Every one of the five built so far had materially different rules from its
  neighbours, so none of the remaining cities can be inferred from a built one. The
  clearest case: Brampton and Mississauga share the program name "ActiveAssist" AND
  the same $275 per-person figure, but Brampton approves for two years and pays a
  lump sum while Mississauga runs one year and is reapplied for annually.
- **Ontario organizations: zero.** `ORGS_DIRECTORY` covers Alberta (13) and B.C. (9).
  An Ontario resident opens the organizations directory and sees nothing. The page now
  says so honestly rather than telling them to pick a province, but the content gap is
  real.
- **Ontario-specific grants: zero.** `GRANTS_DIRECTORY` has 6 Alberta, 7 B.C. and 5
  Canada-wide entries. The 5 Canada-wide ones do apply to Ontario residents.
- **Toronto beyond the first two programs.** The City's own Programs & Benefits
  directory lists 41 programs. Two are built (Fair Pass, Welcome Policy). Several
  others are Ontario Works/ODSP-linked health coverages that may already be represented
  provincially — that needs assessing rather than assuming, in either direction.

### CANNOT MODEL
- **Ontario Renovates.** Delivered by municipal service managers under the Ontario
  Priorities Housing Initiative. Income limits, maximum forgivable loan amounts and
  eligible work all vary by service manager, so a single province-level record would
  have to state amounts that are not province-wide. Belongs in a future municipal
  stage, verified one service manager at a time. The repo rule against inferring one
  municipality's policy from another applies directly.

### OUT OF SCOPE
- **ODSP Employment Supports.** The official section states no eligibility criteria, no
  amounts and no application process — only "ask ODSP staff" and a pointer to
  Employment Ontario. There is nothing actionable to build a record on, so it is a tip
  on the `odsp` record instead. Revisit only if Ontario publishes real criteria.

### COULD NOT READ — blocked by the source site
- **Ottawa's EquiPass, Community Pass and Para Transpo.** All three live on
  octranspo.com, which returns 403 to automated fetches, including from a real browser
  session. Their fares and eligibility could not be read on 2026-09-05, so no transit
  record was written for Ottawa rather than guessing at figures. The Community Pass
  matters most here: it is the discounted pass for ODSP recipients specifically.
  Needs a human, or a different tool, to read and verify.

### NOT YET SWEPT
- No systematic sweep of which of the 42 listed Ontario cities run disability or
  low-income programs. The nine largest are the obvious starting point, since reach
  per verified record is highest there.
- No exhaustive sweep of ontario.ca for provincial disability programs beyond the nine
  built. The nine were chosen as the province-level MVP, not proven exhaustive.

---

## Alberta

### NOT YET SWEPT
- `ROADMAP.md` holds the 2026-07-28 official-source sweep and its still-open items.
  That sweep found the earlier DATA-12 list of four missing programs was **not
  exhaustive**, which is the honest state: Alberta coverage is deep but not proven
  complete.
- 24 of the 51 listed Alberta cities have no municipal programs recorded. Some
  genuinely have none; nobody has confirmed which.

---

## British Columbia

### ASSESSED, NOT ALL BUILT
- **PharmaCare: all 13 plans were assessed as of 2026-07-29.** Which plans are
  represented as records and which were judged out of scope should be listed here
  explicitly rather than living only in the ROADMAP note.

### NOT YET SWEPT
- 45 cities listed; those without programs have not been individually confirmed.

---

## All provinces

- **French is paused.** Interface strings exist in `public/i18n.js`; the benefit
  catalogue itself is not translated. A French-speaking user gets a translated
  interface wrapped around English benefit content.
- **54 of 113 records have no per-record `BENEFIT_VERIFIED` date** and inherit the
  catalogue review month (`DATA_VERIFIED_MONTH`, currently 2026-07). That is by design
  — the map is for records actually re-reviewed — but it means the displayed review
  month for those 54 is a catalogue-level claim, not a per-record one.

---

## Maintenance rules

1. **Record the reason when the decision is made, not later from memory.** Both
   Ontario "out of scope" entries above had to be reconstructed after the fact. The
   reasoning was still recoverable; next time it may not be.
2. **A new record needs a `BENEFIT_VERIFIED` entry in the same change.** Twice on
   2026-09-04 a new record silently inherited a review month it had not earned — the
   nine Ontario records, then the two Toronto ones. Adding the date is part of adding
   the record, not a follow-up.
3. **"We could not read it" is a finding, not a failure.** If a figure sits behind a
   lazy-loading accordion or a JS-rendered page, record that here rather than guessing.
   For the record: `document.body.textContent` reaches collapsed accordion content that
   `innerText` skips — that is how Toronto's Fair Pass fare table was read.
4. **Do not infer one municipality's policy from another.** It is a repo rule and the
   reason Ontario Renovates cannot be a province-level record.
