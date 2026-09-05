# Coverage gaps — what AbilityFinder does NOT cover

TaskView #206. Last reviewed 2026-09-05.

The catalogue holds **134 records**: 16 federal, 14 Alberta, 42 British Columbia,
9 Ontario, and the rest municipal or regional. Ontario's municipal and regional coverage
is now 23 of those, across Toronto, Ottawa, Mississauga, Brampton, Hamilton, London,
Windsor, York Region and the Region of Waterloo. This file is about everything else.

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
- **Municipal programs for 27 of the 46 listed Ontario cities.** Nineteen now route to
  at least one program: Toronto (Fair Pass, Welcome Policy), Ottawa (Hand in Hand plus
  four OC Transpo fare programs), Mississauga and Brampton (each its own ActiveAssist),
  Hamilton (HSR Fare Assist), London (Ontario Renovates), Windsor (two Pathway to
  Potential programs), the five York Region municipalities, and the seven Region of
  Waterloo municipalities. **This is still the largest gap on the site**, but it is now a
  minority of the list rather than a large majority. Being listed in `ON_CITIES` only
  means a resident can pick the city; `CITIES_WITH_PROGRAMS` is the list that actually has
  programs, and a regional record only reaches a resident if their city is in both.

  Every city built so far had materially different rules from its neighbours, so none of
  the remaining cities can be inferred from a built one. The clearest case: Brampton and
  Mississauga share the program name "ActiveAssist" AND the same $275 per-person figure,
  but Brampton approves for two years and pays a lump sum while Mississauga runs one year
  and is reapplied for annually.

### SWEPT — the "nothing found" list from 2026-09-05 is now RESOLVED
  Markham, Vaughan, Kitchener and Windsor were all recorded as searched-but-empty. Every
  one of them was a search in the wrong place, not an absence. **The structural hypothesis
  was tested and held in all four cases**, so the entries are cleared:

  - **Markham and Vaughan** — nothing on markham.ca because the money is York Region's.
    York Region's own page says its subsidies let children "take part in programs offered
    by the municipal recreation departments". Built as `york-region-*`, covering Aurora,
    Markham, Newmarket, Richmond Hill and Vaughan.
  - **Kitchener** — nothing on kitchener.ca because it is the Region of Waterloo and Grand
    River Transit. Built as `grt-*` and `waterloo-*`, eight records.
  - **Windsor** — nothing in citywindsor.ca's recreation section because Windsor is
    single-tier AND the service manager for Windsor-Essex, so both subsidies sit under
    Social Services in the Pathway to Potential strategy. Built as `windsor-*`.

  **The rule this produced, worth applying to every remaining Ontario city.** When a city
  search comes up empty, the search was probably in the wrong place. Check, in order:
  the upper-tier region; the transit operator's own site, which is often a separate domain
  (grt.ca, not regionofwaterloo.ca); and the city's social-services section rather than its
  recreation section. Only after all three should a city be recorded as genuinely having
  nothing. It remains genuinely mixed and must never be assumed either way — Mississauga
  and Brampton are both in Peel Region and each runs its own municipal ActiveAssist.

  **Still not swept at all:** the remaining Ontario cities in `ON_CITIES` with no programs.

### NOT YET BUILT — Windsor-Essex and Waterloo, beyond the seat city
- **Essex County's seven other municipalities.** Windsor's two Pathway to Potential
  programs are Windsor-Essex-wide, jointly funded by the City of Windsor and the County of
  Essex, and delivered by each local municipal department. Amherstburg, Essex, Kingsville,
  Lakeshore, LaSalle, Leamington and Tecumseh are none of them in `ON_CITIES`, so a
  resident of any of them cannot reach these records. Adding them means verifying each
  municipality's own delivery — the source says "eligibility criteria may differ across
  municipalities", so their terms must NOT be cloned from Windsor's. The APP prices held
  in `windsor-affordable-pass` are Transit Windsor's specifically.
- **MobilityPLUS for Region of Waterloo township residents.** GRT says "We also offer
  specialized service for township residents", separate from the MobilityPLUS application
  for Cambridge, Kitchener and Waterloo. That separate service was not read and is not
  built; `grt-mobilityplus` sits behind the `waterlooUrban` gate for exactly this reason.

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
- **Ontario Renovates, as a single province-wide record.** Delivered by municipal
  service managers under the Ontario Priorities Housing Initiative. Income limits,
  maximum forgivable loan amounts and eligible work all vary by service manager, so one
  province-level record would have to state amounts that are not province-wide.
  CONFIRMED by building it: London publishes its own figures — a 10-year forgivable loan
  up to $25,000, the first $5,000 a grant for accessibility work, a $95,000 household
  income ceiling, $30,000 liquid assets and a $320,000 property assessment cap, limited
  to London and Middlesex County. Those numbers are London's, not Ontario's. So this
  moves from "cannot model" to "build it per service manager": `london-ontario-renovates`
  is the first. Every other service manager delivering Ontario Renovates is now a
  NOT YET BUILT item rather than an impossibility.

  CONFIRMED AGAIN by the Region of Waterloo, 2026-09-05: same programme name, different
  numbers. Waterloo's income ceilings run by family size from $41,210 for one person to
  $109,060 for seven or more; the home must be a sole and principal residence worth at
  most $600,000, with no other property owned anywhere; and the deadline is its own.
  None of those figures resemble London's. The two records share only the $25,000 ceiling
  and the 10-year term. Anyone tempted to generalise these should read both records
  side by side first.

- **A forgivable loan, as a distinct value kind.** `BENEFIT_VALUES.kind` offers cash,
  access, taxCredit, grant, coverage, services and discount — there is no loan. Both
  Ontario Renovates records are therefore `grant`, which is the closest fit but overstates
  the thing: the money is a forgivable loan that only stops being repayable after ten
  years of continued ownership and occupancy, and only the accessibility grant portion of
  up to $5,000 is genuinely never repaid. Codex flagged this on the Waterloo record and it
  is a fair flag; the record text says "fully forgivable loan" in the summary, amount and
  detail, so the user is not misled, but the machine-readable kind is a compromise. If a
  loan kind is ever added, these two records and any future Ontario Renovates record are
  the ones to reclassify. Do not reclassify only one of them.

### OUT OF SCOPE
- **ODSP Employment Supports.** The official section states no eligibility criteria, no
  amounts and no application process — only "ask ODSP staff" and a pointer to
  Employment Ontario. There is nothing actionable to build a record on, so it is a tip
  on the `odsp` record instead. Revisit only if Ontario publishes real criteria.

### RESOLVED — was blocked by the source site
- **Ottawa's OC Transpo reduced fares — now built.** octranspo.com returns 403 to
  automated fetch, including from a browser session driven by automation, so these could
  not be read on 2026-09-05. The owner opened the official Fares and Reduced fares pages
  themselves and supplied them, and four records were built from those pages: the
  Community Pass for ODSP recipients, the Access pass for Para Transpo customers,
  EquiPass for low income, and the a-card for people who are blind or partially sighted.
  The lesson generalises: when a source blocks automation, a person reading the page is a
  valid verification path, and it is worth asking rather than leaving the gap open.

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
5. **Read the linked PDF, not just the web page.** The Region of Waterloo's Ontario
   Renovates page prints its home-value cap as "$600,00" — a typo — and says nothing about
   an accessibility grant. Its linked fact sheet gives the real cap, $600,000, and
   describes a grant portion of up to $5,000 that never has to be repaid. A record built
   from the page alone would have carried a mistyped figure and understated what people
   can get. Where a programme page links a fact sheet, guidelines or application PDF, that
   document is the better source.
6. **When two official sources disagree, say so in the record.** Waterloo's fact sheet
   says apply by November 15 with a signed agreement by December 15; its own programme
   page says apply before December 1. `waterloo-ontario-renovates` leads with the dated
   fact sheet and tells the reader the page shows a different date, rather than silently
   picking one and presenting it as settled.
7. **Send the review agent the full page text, not a summary.** Codex review of the two
   Waterloo batches produced findings that looked like inventions but were real facts my
   own abridged excerpt had left out — the ATP application URL and the Community Service
   Welcome Spaces. The Windsor batch, reviewed against complete page text, returned four
   findings and zero false positives. Abridging the source manufactures false positives
   and wastes a review round.
