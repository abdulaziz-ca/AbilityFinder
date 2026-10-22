# Owner digest

The one place to see what Claude and Codex did while you were away. Newest entry first.
Each entry: **Shipped** (commit + live version) · **Verified how** · **Decisions we made for you**
(all reversible) · **Needs you** (only things an agent may not decide).

> Dates corrected 2026-10-16: earlier headings counted work sessions as days and ran ahead of the calendar. They now follow the real commit dates.

## 2026-10-21 — Home page, second pass (your feedback)

### Shipped (`?v=242`)
- **Canada-wide** label at the top (no province list), and the header tag says "Canada" until a province is picked.
- **Header centred** on the page column (it was stuck to the left).
- **Catalog explorer** replaces the placeholder preview: pick a province and a topic and see real counts
  (federal / provincial / local) and the five most useful programs; click one to open its guide
  ("Back to the home page" returns). Clearly labelled "our catalog, not your match".
- **Search vs AbilityFinder demo** and **How it works demo** moved up under "Every program links to its official
  source": a search that ends at 40 tabs, beside a three-answer short list; then the real first question, an example
  list and the real Disability Tax Credit checklist. Both have a pause button (Mercury-style).
- **Everything you need to apply**: four small product screens (list with reasons, a calendar of dates, a document
  checklist, free help including 211).
- **Where are you starting from**: one tidy 3×2 grid, reworded (e.g. "Just moved to a new province").
- **What you could find**: six topic cards with real program counts and a federal/provincial/local bar; each opens
  the catalog on that topic.
- Codex reviewed it; fixed what it found (a too-confident "Matches your answers" in the demo, the 211 wording, screen
  reader announcements, the French "Play" label, and "less motion" now stopping everything immediately).

## 2026-10-21 — The redesign is live

### Shipped
- **New design across the whole site** (live as `?v=241`), built from your picks: Stripe and Mercury for the feel, Linear
  for lists, Notion/Wise/Oscar for questions and guides. **Dark by default**, with the light switch kept.
  - Home: a flowing silk-ribbon background, large gradient headline, slim pill buttons, a lit example window that
    straightens as you scroll, a strip of the official government sources, and a Mercury-style feature section
    whose tabs cycle on their own and pause when you hover or use the keyboard.
  - Questions: big, calm question pages with answer cards that lift on hover and tick when chosen.
  - Results: Linear-style rows with a coloured status edge, calm amounts and compact "Dates to know".
  - Guides (app and the 462 static pages): large titles, glass fact tiles and a glowing "next step" card.
  - Motion is gentle (pages fade in when you move between them, the home page rises in, a sweep of light on the
    main button) and switches off for anyone who asks their device or our accessibility menu for less motion.
  - Speed: the ribbon starts only after the page has loaded, so the home page shows up as fast as before.
- **Words and results did not change**: only the look. All programs, answers and rules are as before.
- Found and fixed along the way: two static guides (Canada Disability Benefit, RDSP) printed raw link code
  instead of a link.

### Backup and undo
- The old site is saved as tag `pre-redesign-v238` (and branch `backup/pre-redesign-v238`) on GitHub, with
  screenshots in `research/2026-10-redesign/before-v238/`. **One line switches the old design back**:
  `DESIGN_V2 = false` in `public/theme-init.js` and `public/guide-prefs.js`. See `research/2026-10-redesign/BACKUP.md`.

### Verified how
- Unit tests 259/259; browser tests 335/335 on Chromium locally, then Chromium, Firefox and WebKit in CI before
  the deploy. Every text colour passes contrast checks in both themes (lowest 4.6:1); no sideways scrolling at
  phone width.
- Prototypes you can click are in `research/2026-10-redesign/prototype/v2/` (home, question, results with a
  slide-out detail panel, guide).

### Needs you
- Have a look and tell me what to adjust. Anything from colours to motion can be tuned quickly.

## 2026-10-20 — Visitor statistics on (Cloudflare Web Analytics)

### Shipped
- At your request, AbilityFinder now counts visits with **Cloudflare Web Analytics** (`?v=238`). See them in the
  Cloudflare dashboard → Analytics & Logs → Web Analytics → abilityfinder.ca: visits, page views, top pages and
  guides, referrers, countries, devices and page speed.
- It is cookieless, does not follow people to other sites, and never sees questionnaire answers (they still
  stay on the device). It counts only on abilityfinder.ca, never tests, previews or partner embeds.
- The privacy, About, Impact and partner pages (English and French) now say exactly this; the old "no analytics /
  no third-party trackers" lines are gone.
- In Cloudflare, the site was switched from automatic injection (which had recorded 0 visits) to snippet
  installation; the snippet is in our own `analytics.js`.

### Verified how
- Live check: the beacon loads and Cloudflare accepted the visit report (HTTP 204). CI green on all browsers.

### Decisions we made for you
- Cloudflare's bot-check inline script stays blocked (it is separate from analytics and only adds console noise).
- To undo later: tell me, and I will remove analytics.js and restore the privacy wording in one change.

## 2026-10-20 — Features: dates to know, what we can't tell you, browse by need

### Shipped
- **Dates to know** (`?v=235`): results and guides show real dates for programs whose official page gives one,
  for example **London Ontario Renovates closes October 30, 2026 at 4:30 p.m.**, with a one-click calendar
  reminder (a week before and on the day). Dates that are not final (Waterloo's two conflicting deadlines,
  "expected to reopen", month-only dates) are shown with "Check the official page; this date is not final." and
  get no calendar button. 12 programs have dates, each restated from its verified record; past dates disappear
  automatically.
- **What this list can't tell you** (`?v=236`): a closed panel at the end of results covers three things:
  programs we have not added yet (links "What we don't cover yet"), whether you will be approved, and details we
  did not ask about. Guides say: "What this guide can't tell you: whether you will be approved."
- **Browse by need** (`?v=237`): picking a disability in Browse now brings forward the programs aimed at it, using
  21 disability gates instead of 3. A new row does the same for needs: getting around, equipment, special diet,
  travel for medical care and home changes. Nothing is ever hidden; matches only move to the top.
- **Fixes** (`?v=234`): the guide index files SK–QC provincial programs under Provincial (they showed as
  Municipal); help texts that named only Alberta now fit every province; French province labels; the embed
  widget no longer says "Alberta and BC".

### Verified how
- Unit tests 254/254; the full Chromium suite passes locally for each feature (328, 331, 335 tests); CI runs all
  three browsers before each deploy. A live sweep of 20 journeys (10 provinces × adult/child) found no broken
  pages or wrong-province programs.
- Codex built the first two from my specs and I reviewed them (fixed a doubled program name for screen readers).
  Codex then hit its usage limit; a Claude agent built Browse by need. **Codex review owed** for that one.

### Needs you
- **Cloudflare is injecting its analytics beacon** into every page. Our security policy blocks it, so nothing is
  tracked, but it contradicts the "no third-party trackers" promise and logs an error. Turn off Web Analytics
  automatic setup for abilityfinder.ca in the Cloudflare dashboard (board ticket #79).

## 2026-10-20 — Full audit: the site is faster

### Shipped
- **Only the programs you need are downloaded now.** The landing page loads the federal programs and a small index
  of all 463; your province's programs load when you choose it. First visit: **720 KB → 423 KB**; on a slow 3G
  phone the app is ready in about **3 s instead of 4.2 s**. An Ontario visitor downloads 131 KB of program data
  instead of 373 KB, and each data update re-downloads only what changed. `?v=232`, plus a small cleanup `?v=233`.
- Nothing looks different. Results are identical (checked on the live site with an Ontario profile).

### Verified how
- Unit tests 242/242; browser tests pass on Chromium, Firefox and WebKit in CI before the deploy.
- A safety switch (`DATA_PACKS` in app.js) puts the old single data file back in one line if anything goes wrong.

### Decisions we made for you
- Not done: serving our own stronger compression. It would route every file through the Worker and use up the free
  plan's daily request allowance, and the site would break if it ran out.

### Needs you
- Nothing. The audit is finished; next is features and fixes, then the redesign.

## 2026-10-20 — Full audit: accuracy pass on the older programs

### Shipped
- **71 older programs re-checked** (federal, Alberta, BC, Ontario: the ones last reviewed July–September) against
  fresh copies of their official pages, including the fare tables and rate pages they depend on. They now show
  October 2026 review dates. Commits 7c0e3a02 (`?v=229`) and 59d97af2 (`?v=230`).
- Real corrections found: London Ontario Renovates closes **October 30, 2026**; Red Deer recreation does not accept
  GIS as proof; Ottawa Hand in Hand's full proof list; BC Plan F pays only part of medical supplies; the BC home
  owner grant's $200 northern/rural top-up ends January 1, 2027; Community Living BC no longer runs the Provincial
  Assessment Centre; Grande Prairie in-person approval is about 15 minutes; several "up to"/"may" hedges restored.
- All 36 phone numbers in the help directories still appear on each organization's own site.

### Verified how
- Codex (gpt-6.1-sol, low) and Sonnet (low) reviewed in parallel batches; I checked every quoted sentence against
  the saved official text and every bump figure by figure before applying anything. About a third of proposed
  deletions were rejected (e.g. one reviewer missed BC's autism transition page and wanted to delete true dates).
- Unit tests 239/239 and the eligibility oracle pass before each push; CI and the live version checked after.

### Decisions we made for you
- A fact that is probably true but not on any page we could fetch was **kept, not deleted**; that record simply
  keeps its older review date (9 records: Hamilton, BC PWD, Alberta Adult Health Benefit, AISH, RAHA, Autism
  under-6, Airdrie, ADAP, BC At Home medical). Hamilton stays because the city still prints a limit as "$74.109".

### Needs you
- Nothing. Next: speed (load only the chosen province's programs; about 200 KB less on a first visit).

## 2026-10-18 — Quebec tax credits and RAMQ programs added

### Shipped
- After you passed the Revenu Québec and RAMQ checks in the browser pane, I read 14 official pages there and added
  8 programs in French: the solidarity tax credit, caregiver tax credit, severe and prolonged impairment amount,
  adapted work premium, seniors' home-support credit (70+), home-help discount (PEFSAD), ocular prostheses and
  300 $ for children's glasses. Hearing, vision and physical-aid programs and the drug plan were rewritten from
  their RAMQ pages, so they now state the real criteria. **Catalogue: 457 programs.** `?v=227`.
- The Quebec notice no longer says these sites could not be read.

### Verified how
- Unit tests (239) and the full Chromium suite pass locally; every record was checked by a separate reviewer.

## 2026-10-18 — Quebec live, in French

### Shipped
- **Quebec** (`?v=226`): 39 provincial and 10 city programs, written in French from each official French page
  and checked by a separate French-language reviewer, after five research passes and a completeness check
  against the government's own disability-program list. **All 10 provinces are now covered: 449 programs.**
- **French done properly:** each Quebec record is marked French, so screen readers and translators read it
  right in the English interface; Quebec's static guide pages are fully French (headings, navigation, dates).
  A notice on Quebec results (English or French, matching the interface) explains this.
- Help sections in French: OPHQ, aide juridique, Éducaloi, 211, AQRIPH and seven Quebec organizations.
- The static guides' header now uses the same short province list as the app (it overlapped the logo).

### Verified how
- Unit tests (239) and the full Chromium suite (324) pass locally; screenshots of a Quebec guide in the English
  and French interfaces checked. CI runs all three browsers before deploying.

### Decisions we made for you
- Quebec program text is French in both interface languages (as you asked); the interface itself is unchanged.
- Programs whose rules sit with RAMQ or a professional assessment show as "almost", with the reason.

### Needs you
- **Revenu Québec** (tax credits) and **RAMQ** pages block automated reading. If you want the tax credits (solidarity,
  caregiver, home support for seniors, severe and prolonged impairment), pass those sites' checks in the browser
  pane like you did for PEI and I will read and add them. Tracked in `research/2026-10-quebec/GAPS.md`.

## 2026-10-18 — Newfoundland and Labrador live

### Shipped
- **Newfoundland and Labrador** (`?v=225`): 28 provincial and 7 city programs (St. John's, Mount Pearl, Paradise,
  Corner Brook), each built from its official page and checked by a separate reviewer, plus a completeness check
  of the department hub pages (added Moving into the Workforce, dental programs and the Caregiver Benefit). Help
  sections: Legal Aid NL, 211 NL, Empower, Spinal Cord Injury NL, CHHA-NL. **Catalogue: 400 programs, nine
  provinces.** Only Quebec is left.
- Medical travel programs (NL MTAP and PEI's out-of-province travel) now use the wizard's existing "must travel for
  medical care" answer, so people who said so can reach "ready".
- Not built and tracked in `research/2026-10-newfoundland-labrador/GAPS.md`: the Home Heating Supplement (intake
  closed January 2026), the Aging Well at Home Grant (page only covers 2025–26), Mount Pearl's PEARL subsidy (no
  real test on the page), and Easter Seals NL (site behind a bot check, not bypassed).

### Verified how
- Unit tests (239) and the full Chromium suite (324) pass locally; CI runs all three browsers before deploying.

### Decisions we made for you
- Dental: children up to 12 can show "ready"; older youth and adults show "almost" because they qualify only through
  Income Support or a drug plan enrolment the wizard does not ask about.

## 2026-10-18 — Prince Edward Island live

### Shipped
- **Prince Edward Island** (`?v=224`): 27 provincial programs, each built from its official page and checked by a
  separate reviewer. princeedwardisland.ca is behind a bot check: you passed it once in the browser pane and I read
  the pages there (PDFs downloaded directly). A completeness check of PEI's topic pages added Home Care, COACH,
  Adult Day Programs, Children with Complex Needs and the Seniors Property Tax Deferral. Help sections: 211 PEI,
  ResourceAbilities, PEI Legal Aid, Disability Alliance Canada, Plan Institute. **Catalogue: 365 programs, eight
  provinces.**
- No PEI city programs: T3 Transit, Summerside Transit and the town sites have no low-income or disability
  program. Tracked in `research/2026-10-pei/GAPS.md` with the dated PDFs (Home Renovation brochure 2021, dental
  brochure about 2021–22) whose amounts need re-checking.

### Verified how
- Unit tests (239) and the full Chromium suite (324) pass locally; Firefox cannot launch in the local sandbox, so
  CI runs all three browsers before deploying.

### Decisions we made for you
- Seniors Housing (60+, or 55+ with a disability) and AccessAbility Supports (apply before 65) show as "almost"
  for the age bands the wizard cannot split, instead of hiding them.

### Needs you
- Re-checking PEI pages later needs you to pass the site's check again; agents cannot read it.

## 2026-10-18 — Nova Scotia live

### Shipped
- **Nova Scotia** (`?v=223`): 31 provincial programs and Bridgewater's PROKids, each built from its official page
  and checked by a separate reviewer, after two research passes and a completeness check. Help sections include
  Nova Scotia Legal Aid, Dalhousie Legal Aid, the Legal Information Society, the Human Rights Commission, 211 and
  seven disability organizations. **Catalogue: 338 programs, seven provinces.**
- Not listed and tracked in `research/2026-10-nova-scotia/GAPS.md`: Halifax's own programs (Access-A-Bus,
  Affordable Access), because halifax.ca refuses access and I did not try to get around it; Cape Breton's
  Handi-Trans page, which was removed in a site redesign. The provincial Community Bus Pass (free passes for people
  on income assistance or the Disability Support Program in Halifax and Cape Breton) is listed.

### Verified how
- Unit tests and the Chromium suite pass locally; WebKit showed a different single flaky failure on each local run
  (timing), and CI runs all three browsers before deploying.

### Next
- Prince Edward Island, then Newfoundland and Labrador.

## 2026-10-18 — overnight: Manitoba live with a caution, New Brunswick live

### Shipped
- **Manitoba is live** (`?v=217`) with the caution you asked for: anyone who picks Manitoba sees it on their
  results, on every Manitoba program page and on the Manitoba guides. It says the EIA → MSPD move is under way,
  MSPD amounts are not published, EIA dental changed on September 1, some income limits are old or yearly,
  Winnipeg Transit Plus has proposed rules not in effect, and cities are Winnipeg (and now Brandon) only.
- **Manitoba finished** (`?v=218`): 5 more programs from a completeness check (disability employment help,
  Rent Supplement, Prenatal Benefit, Brandon Access Transit, Brandon CNIB free rides). Everything we could not
  build or confirm is tracked in `research/2026-10-manitoba/GAPS.md` (to re-check monthly).
- **Help sections for every new province:** Ontario, Saskatchewan, Manitoba and New Brunswick now have form help,
  legal and appeal help and 211 in the help section, plus disability organizations and student aid and
  employment links. Each entry was checked on its own page by a second agent. (Ontario had been missing these.)
- **New Brunswick is live** (`?v=221`): 26 provincial and 5 city programs (Dieppe, Fredericton, Saint John,
  Moncton), each from its official page and checked by a separate reviewer, after a completeness check.
  Gaps tracked in `research/2026-10-new-brunswick/GAPS.md`.
- **Catalogue: 306 programs.** Six provinces covered.

### Verified how
- Unit tests (239) and the Chromium and WebKit browser suites (670) pass locally; CI runs all three browsers
  before deploying.

### Decisions we made for you
- New Brunswick has no province-wide caution like Manitoba: its pages are thin in places, but nothing is
  mid-transition. Individual records say when a page lists no criteria.
- Programs decided by an assessment or by something the questions do not ask (other drug coverage, a health
  card) show under "More to check", never as a full match.

### Next
- Province 7 (by the plan: all 10 provinces, then the redesign, then French).

## 2026-10-18 — Saskatchewan city programs

### Shipped
- **13 city programs** (`?v=214`), each from its official page and checked by a separate reviewer:
  - Regina: Affordable Access (recreation and transit discounts), Paratransit, and the $28 pass for SAID, SIS, SES
    and SEI clients.
  - Saskatoon: Access Transit, Leisure Access, the low-income bus pass, and the accessible parking permit subsidy.
  - Moose Jaw: the $25 discounted monthly pass and Paratransit.
  - Prince Albert: Access Transit.
  - Yorkton: Access Transit and the discounted monthly pass.
  - North Battleford: the Battlefords Handi-Bus.
- **Catalogue: 253 programs.**

### Decisions we made for you
- Paratransit shows as a match when you say regular transit is hard to use, the same rule as HandyDART in B.C.
- Swift Current Access Transit was added afterwards (`?v=215`), once its moved page turned up. Not built:
  Prince Albert's discounted pass (its page does not say who qualifies). Estevan, Weyburn, Martensville and Warman have no official program page,
  so the "What we don't cover yet" page lists them.

## 2026-10-18 — Saskatchewan is live (provincial programs)

### Shipped
- **Saskatchewan** (`?v=213`): choose it in the questionnaire to see **22 provincial programs**, including SAID,
  Income Support, the Housing Benefit, SAIL equipment, the drug plans, autism funding, home care, Adapt a Home,
  EAPD, accessible parking, the Active Families Benefit (higher amount for a child with the DTC) and the
  Low-Income Tax Credit. Each one was built from its official page and checked by a separate reviewer. A
  completeness check added 4 more. **Catalogue: 240 programs.**
- As you asked: general low-income programs are included, and **Lloydminster is under both Alberta and
  Saskatchewan**. Its recreation program shows for residents of either province.
- City programs come next. The questionnaire already lists 12 Saskatchewan cities, so the "What we don't cover yet"
  page names them honestly until their programs are added.

### Verified how
- Built behind a hidden flag first, then switched on with everything regenerated. Unit tests (239), the Chromium
  and WebKit browser suites (668) and the eligibility oracle all pass; CI also runs Firefox.

### Decisions we made for you
- Saskatchewan figures keep the dates their pages give, because SAID and the housing benefit changed this fall
  and some pages mix old and new figures (for example the Seniors Income Plan's 2023 maximums).
- Not built: programs with no published eligibility (ABI services, therapy services, housing for people with
  intellectual disabilities). Full list in `research/2026-10-saskatchewan/PLAN.md`.

## 2026-10-17 — night: provincial sweep (Alberta, B.C., Ontario) and 15 reference websites

### Shipped
- **35 provincial programs** (`?v=209`, `?v=210`). Each one was checked on its official page, written from the
  saved page text only, and checked line by line by a separate reviewer. Ontario now has 24 provincial records
  (was 9): Ontario Works, the Ontario Drug Benefit, ODSP health benefits, Healthy Smiles, seniors' dental, DSO,
  respite, home care, the Northern Health Travel Grant, GAINS, the Child Benefit, the Trillium Benefit, OESP and
  children's treatment centres. B.C. gained 10 (Income Assistance, PPMB, hearing supplements, home support, CSIL,
  Nursing Support Services, SAFER, RAP, the B.C. Family Benefit, subsidized housing). Alberta gained 10 (Income
  Support, the Seniors Benefit, Special Needs Assistance for Seniors, seniors' dental and optical, SHARP, the Child
  and Family Benefit, the Rent Assistance Benefit, the Brain Injury Initiative, home care, Blue Cross Non-Group).
  **Catalogue: 218 programs.** Full list, matching decisions and what was not built: `research/2026-10-prov-sweep/SWEEP.md`.

### Verified how
- Unit tests (239), the Chromium and WebKit browser suites and the eligibility oracle, all passing; CI runs Firefox.
- A final completeness check by a fresh agent found 2 more programs, now built. Nothing else in scope is missing
  that has a public provincial eligibility page.

### Decisions we made for you
- Programs decided by a care assessment (home care, CSIL, Nursing Support Services) never show as a full match.
  They show under "More to check", with what to ask for.
- Child benefits are a full match only for a child profile, because we don't ask adults whether they have children.
- Not built: the B.C. Family Benefit disability supplement (proposed for July 2027, re-check then) and the Ontario
  Bursary for Students with Disabilities (no public eligibility page; the federal grants are already listed).

### Design
- The three drafts are scrapped, as you asked. **15 reference websites** with homepage screenshots:
  `research/2026-10-redesign/REFERENCE-SITES-15.md` and `reference-screens/`.

### Needs you
- **#225: tell me which of the 15 sites to base the redesign on.**

## 2026-10-17 — evening: retried leads, coverage page, redesign research

### Shipped
- **11 more local programs** (`?v=208`) after finding each lead's current official page: High River, Morinville,
  Taber, Dawson Creek, Langley, Nelson (RDCK), Port Coquitlam, West Vancouver, Brantford, Cornwall's community bus
  pass and Sarnia's CNIB pass. **Catalogue: 183 programs.** The leads that remain are listed with reasons in
  `research/2026-10-city-sweep/LEADS.md` (closed this year, funding ended, page gone, bot check, no official page).
- **"What we don't cover yet" page** (`?v=207`, in the menu), as you asked. It lists the communities with no local
  program yet (worked out from the matcher itself, so it stays accurate), the kinds of help we don't list, and 211
  links for each province.

### Redesign: research and drafts (nothing on the live site changed)
- `research/2026-10-redesign/`: 16 reference sites reviewed, accessibility research with 30 testable criteria,
  and **three drafts** of the same four screens: Quiet Paper, Calm Green, Clear Ink. Open
  `research/2026-10-redesign/drafts/index.html`, or look at `screens/`.
- My recommendation is in `PLAN.md` (Calm Green for home and results, Quiet Paper's discipline for questions and
  guides). Board: epic #224 with tickets #225–#233.

### Needs you
- **#225: pick a design direction** (or a mix). Every other redesign ticket waits on it.

## 2026-10-17 — afternoon: the rest of the city leads

### Shipped (`?v=206`)
- **28 more local programs**, each built from its official page and checked by a separate Claude reviewer (20
  corrections made before shipping, e.g. Belleville's income limit is about 144% of LICO, not "at or under"):
  8 Alberta towns (Banff, Blackfalds, Chestermere, Drayton Valley, Edson, Rocky Mountain House, Strathmore,
  Whitecourt), 15 B.C. communities (Campbell River, Colwood/Langford, Comox Valley, Cranbrook, Duncan, Mission,
  Penticton x2, Pitt Meadows, Port Moody, Prince Rupert, Quesnel, Squamish, Terrace, White Rock) and 4 Ontario
  cities (Belleville, Chatham-Kent, Cornwall, Peterborough x2). **The catalogue is now 172 programs.**
- Not built: 17 pages that did not state who qualifies or what you get (often a home page, a news story or a
  directory listing), and 13 lead links that were dead or blocked. All listed with reasons in
  `research/2026-10-city-sweep/LEADS.md`, so they can be picked up later.

### Decisions we made for you
- Squamish's 2024 form says income must "meet the minimum ,570"; that is almost certainly the one-person limit.
  The record states the limits and tells people to ask the District, rather than turning away very low incomes.
- Two programs only for people on Ontario Works/ODSP or B.C. assistance (Peterborough transit, Terrace) can never
  show as "matches your answers", because the wizard does not ask about receiving them; they show as a check.

## 2026-10-17 — morning: glossary, last content items, three new programs

### Shipped (`?v=201` → `?v=204`)
- **Abbreviations on every guide.** 78 expansions (AISH, CYSN, TTE, PWD…), each confirmed from the program's
  own text, an official page or standard federal usage. Acronyms with two meanings in the catalogue (APP, ATS, CCC,
  RAP) are left out on purpose. Program text is unchanged.
- **Content audit finished**, apart from the items below: one category label instead of two inconsistent ones,
  the last overclaims ("can qualify easily", "many are approved"), the third DTC route named, CDB items in a sensible
  order, stale "new"/"now" wording, a news-release source replaced by the program page, directory dates explained,
  the error card's "Start over" says it clears answers. Three tips that repeated the guide were removed, and a new
  test stops repeated facts from growing.
- **Three new Ontario programs**, the first built from the city sweep, each from its official page with an
  independent Claude review: **Niagara Transit Benefit Pass** ($50 monthly pass; St. Catharines, Welland, Niagara
  Falls), **Kingston Affordable Transit Pass** (through the City's fee assistance program), and **Halton SPLIT**
  (Burlington, Oakville, Milton).
- **Seven B.C. recreation programs** (`?v=205`): Abbotsford (low-income subsidy and a disability access pass),
  Maple Ridge (financial and disability access passes), Nanaimo LEAP, New Westminster financial assistance and
  Prince George's Leisure Access Program. The independent review caught and fixed hardened wording and two pieces
  of invented advice in the drafts before they shipped. The catalogue is now **144 programs**.
- **Link monitor**: three city pages that block automated checks (Vancouver, Kelowna, Variety BC) were reported as
  "broken" every few hours. I confirmed each loads in a real browser; they now show as "blocks automated checks"
  instead, so a real broken link stands out.
- **City sweep for task #206**: 96 listed cities with no local program were checked for leads
  (`research/2026-10-city-sweep/LEADS.md`): Alberta 22 with leads, B.C. 30, Ontario 25. These are leads, not facts:
  two lead links I tried were already dead. The B.C. PharmaCare plans are now itemised in COVERAGE-GAPS.md.

### Decisions we made for you
- Not built: Durham's transit program (its only official sheet now returns 404) and Guelph's fee assistance (the page
  found had no amount, limits or steps). They stay as leads.
- Left as they are: the fuel-tax eligibility list (a reviewed wording test pins it), "More about this benefit"
  fine print (needs program-by-program judgement), unit formats, and long program names.

### Needs you
- Whether a public "what we don't cover yet" page should exist (task #206).

## 2026-10-17 — overnight: plain language and the rest of the audit list

### Shipped (`?v=197` → `?v=200`)
- **Plain-language rewrite** (`b3b4fe7`). 473 summaries, "Good to know" notes and tips rewritten in plainer words
  and shorter sentences. Median reading grade for that text went from 11.8 to 9.1, and the programs at grade 9 or
  below from 19 to 67 (card summaries alone: 13.5 → 10.8). How it was kept safe: seven Claude rewriters with one
  brief; an automatic check that rejected any change to a figure, link, hedge word ("may", "up to", "not"…) or list
  length; four Claude reviewers reading every before/after pair, plus my own sample; and the existing wording
  guards, which put 27 fields back to their reviewed official wording. Eligibility rules were not touched.
- **Style guide + ratchet.** `docs/CONTENT-STYLE-GUIDE.md` (rules and length limits) and a test that fails if the
  reading level slides back.
- **Facts that disagreed inside a program** (`52d7ade`), re-read against the official pages: PharmaCare Plan B,
  AADL cost-share, Canada Workers Benefit, CPP disability, and one consistent timing for DTC, CDB, HandyDART and the
  Alberta service dog card. BC Bus Pass no longer says "annual" (the government's own pages disagree).
- **Closing programs show it.** BC Autism Funding, the At Home Program, Waterloo renovations and Leduc recreation
  now carry an end-date badge on results and guides.
- **More honest wording**: buttons say where they go ("Open the official page on alberta.ca"); guides no longer say
  "You qualify if any of these apply"; homepage claims fixed ("more than 35 programs" → no false count, "about a
  minute" → "a few minutes"); no ALL-CAPS emphasis; "the program decides" once per guide; documents lists hold only
  documents; one "Good to know" box per guide.
- **Accessibility**: guide pages now follow your light/dark theme, text size and contrast; 400% zoom no longer
  hides the questions; results buttons are at least 44 px; the logo asks before wiping your answers.
- **Worker/security**: request size is now capped even without a size header; the assistant points BC and Ontario
  users to their own legal aid office.

### Decisions we made for you
- Kept BC RAHA's 8-week assessment and 3-week payment timing. The fact-checker couldn't find them on the one page
  it loaded, but missing from a page isn't proof they're wrong.
- Left the unit formats ("/month" vs "per month") alone: cosmetic, and risky to normalise across 134 programs.

### Still open (bigger, or needs you)
- Content: a shared acronym glossary, repeated facts across fields (P1-08), category labels, eligibility list
  structure for a few records. Engineering: merge the two guide renderers, split `app.js`.
- Human-only (unchanged): reader comprehension test, screen-reader passes, a study with disabled users.

## 2026-10-17 — engineering

### Shipped (`9f17a4e`, `?v=196`)
- **Faster repeat visits.** App files are cached by version, so a returning visitor's browser no longer re-checks
  each file. Fonts (116 KB) are no longer re-downloaded after every update. A CI check now fails if code changes
  without a version bump, so nobody gets stuck on an old file.
- **Safer matching.** If a program ever names a requirement the app doesn't know (a typo), it shows "We could not
  check one requirement" instead of silently counting it as met.
- **Tests no longer flaky.** The local test server was dropping connections under load. Replaced it: the Chromium suite
  went from 32 failures to 308/308 at full speed; WebKit 319/319.
- **CI faster.** Split into one job per browser running side by side: 14 min on the first run (which also re-downloaded
  browsers), down from 19–26. A Claude review also found an old CI bug that kept browser downloads from ever refreshing.

### Verified how
229 unit tests, all three browsers in CI, deploy check 10/10, and the live cache headers read back from abilityfinder.ca.

## 2026-10-16 — night: more "Not for your situation now" rules

### Shipped
- **Autism diagnosis needed first** — `a939c14`, `?v=194`. If the autism diagnosis answer is "No / not yet", BC
  Autism Funding (under 6, 6–18) and the Ontario Autism Program move to the closed list as "An autism diagnosis is
  needed first". Both official pages require the diagnosis before applying. "Not sure" never moves them.
- **Bursary fix** — `a9c04ef`, `?v=195`. The B.C. Learning Disability Assessment Bursary asked for disability
  documentation first, but it *pays for* the assessment. It now checks what the official page asks: StudentAid BC
  eligibility, a designated public school, and a recommendation from the school's accessibility office.

### Decisions we made for you
A Claude agent checked 16 candidate programs against their official pages; only 3 were safe. We did **not**
add rules for missing documentation, B.C. PWD status, age, working status or income: in every case the program
has another route, or sorts it out inside the application (student aid even repays the assessment). Those programs
stay as cards. Full record: research/2026-10-site-audit/G3-RULES.md.

## 2026-10-16 — evening: "already get" question

### Shipped
- **"Do you already get any of these?"** — `ee094d5`, `?v=193`. An optional question after the DTC question:
  AISH / ADAP (Alberta), B.C. disability assistance, ODSP (Ontario), CPP disability benefit. Picked programs move to a
  "You already get" group at the top of results, and out of every other list (including "not a match", the
  print-out and the what-if panel). No match or status changes. Getting ODSP turns the Ottawa Community Pass into a
  full card. Children aren't asked; skipping is fine; older saved answers still open straight to results.

### Verified how
223 unit tests, the Chromium browser suite locally, screenshots of the question and results, and an independent
Claude review (its two findings, the print-out and the what-if rows, are fixed). Built Claude-only, as you asked.

## 2026-10-16 — afternoon: full site audit

### What we found (research/2026-10-site-audit/)
Four Claude Opus researchers audited the whole site (results relevance, a real-browser walkthrough of 4 people on
desktop and phone, content and trust, engineering), and Codex critiqued the plan. Your "fluke" feeling is confirmed
by measurement: across 15 test people only 9% of listed programs matched, and 20% of the "More to check" items were
already ruled out by the person's own answers - usually as cards 2 to 4.

### Shipped
- **Results grouped by what fits now** — `63a31f0`, `?v=192`. "Programs to check" (real matches first, unchanged),
  "Other programs to check" (one line each: "If you have …"), and a closed "Not for your situation now" (e.g. programs
  that need Disability Tax Credit approval first). Full cards across the 15 people: 307 → 208; nothing hidden.
- **Bugs** — `d0bbe52`, `b673382`: keyboard arrows no longer pick answers; other provinces' city programs no longer
  leak in; Calgary no longer sees Okotoks; Ontario users aren't refused for a question they were never asked; a failed
  script no longer leaves the page stuck on "Loading"; high-contrast fixes; and a Safari regression CI caught
  before it shipped.
- **Content** — accurate privacy wording; honest landing examples (no invented prices); changelog dates fixed (my
  session numbering had future-dated 9 entries); one "How much?" text for live and static guides; no more
  "free government money" for the RDSP.

### Next (in research/2026-10-site-audit/DECISION.md)
- ~~Phase 2: "already get" question~~ — shipped the same evening (see above).
- More reviewed "not for your situation" rules (age, working status), one class at a time.
- Engineering: caching (each visit re-checks 13 files), faster CI, plain-language rewrite (median reading level is
  grade 12.5).

### Owner decisions (2026-10-16)
- Easter Seals Alberta: **paused** — no phone call. The equipment entry stays as it is; agents won't raise it again.
- French: **stays paused** — the toggle stays, the catalogue stays English. No translation work.

## 2026-10-16 — morning

### Shipped
- **"Check this fact" pilot** (#209 phase 2) — `6ecaee6`, `?v=187` (CI 867/867). Three Waterloo transit programs
  (GRT taxi coupons, CNIB pass, Affordable Transit Program) each offer one optional Yes / No / Not sure question,
  e.g. "Are you currently approved by the Region of Waterloo for the Affordable Transit Program?". Only an explicit
  Yes on that program's own question can move it to "Matches your answers" (with "Includes facts you checked on
  this device"); every other requirement still applies, and nothing leaves the device. Without anyone answering,
  results are exactly as before. Claude's review caught a what-if panel that would have falsely said "no longer
  ready", a change that leaked beyond the three programs, and approval wording that ignored the one-year expiry -
  all fixed before release.
- If this pilot reads well to you, the same pattern can extend to other "registered with / approved for" checks.
- **Grants and organizations directories re-checked** (#43) — `6168c25`, `?v=188` (CI 867/867). All 48 entries
  against their official pages: 353 facts confirmed, 13 field changes in 5 entries. Disability Alliance BC's law
  clinic has closed summary-advice intake until early 2027; CPABC's funding "may be available"; Variety BC's
  residency, age and diabetes-route conditions. Follow-up #223 (`89647d5`, `?v=189`, CI 873/873): Bear Essentials, Shine, BC Rehab bursary and others now state only ages and deadlines their own pages give.

### Needs you
- **One contact only a person can make (#43, decided by you in August):** ask Easter Seals Alberta whether their
  equipment funding program still runs — their own menu links to a page that no longer exists. Our entry is
  unchanged until they answer.

## 2026-10-15 — afternoon

### Shipped
- **"Updates to your programs"** (#214) — `5866955`, `?v=185` (CI 816/816). A returning visitor's results show one
  collapsed panel listing which of their programs had a recorded correction since they last pressed "Got it"
  (e.g. "The income limits were corrected."). First visits show nothing; nothing leaves the device. Built from a
  Codex design that Claude cut down to one button and results-only; Claude's review caught a missing Kelowna entry,
  an accessibility naming issue and default-blue links before release.
- **Ontario restore bug fixed** — `619fcda`, `?v=186`. Ontario users' saved city was wiped on every reload (the
  restore code only knew Alberta and BC had cities). Found while building the AT test kit.
- **Assistive-technology test kit** (#215b) — `docs/at-test-kit/`: six personas, eight journeys, what NVDA /
  VoiceOver / TalkBack should announce, a results template and one-command setup. It prepares the human
  screen-reader passes; it does not replace them.
- Codex has now reviewed everything Claude built while it was out of usage.

### Needs you
- Nothing. When you want the real screen-reader testing done (epic #28), `docs/at-test-kit/README.md` is the
  script to hand a tester.

## 2026-10-15 — early morning

### Shipped — the full catalogue re-check is finished
- **Batch 7** — `7c3940a`, `?v=179` (CI 732/732). Codex reviewed what Claude built while it was out of usage and
  caught two over-matches (MobilityPLUS and Okotoks) plus an unsourced Leduc claim; all fixed before release.
  DTC applications now point to the digital DTC form or mail (not CRA's "submit documents"); Leduc recreation is
  closed until January 2027; GRT's online application is temporarily down.
- **Batch 6 follow-up** — Codex's review found CLBC could show "Matches your answers" from an autism answer alone;
  the page also requires significant help with day-to-day tasks. Fixed (CLBC now shows "More to check").
- **Batch 8** — `e4c3198`, `?v=180` (CI 738/738). Ontario Passport amounts are now $5,665 a year and up to
  $45,604 (we had last year's $5,500 / $44,275); Toronto Fair Pass ages 20 to 64; Hamilton no longer turns
  away people on Ontario Works or ODSP; Trillium's quarterly deductible.
- **Batch 9** — the last 11 records (ADP, Ontario parking permit, autism program, SSAH, Waterloo, Windsor,
  York Region). York Region recreation now shows "More to check" because its real routes are benefits the
  questionnaire doesn't ask about.
- **All 134 records have now been checked against their official pages** (since 2026-10-14). Across nine
  batches roughly 220 published facts were corrected. Every change was decided against the full page text
  and checked by the other agent before release; nothing was made to look more certain than the page.

- **Follow-ups** — `afce811`, `?v=182`: Waterloo Ontario Renovates now matches the Region's 2026 fact sheet
  (separate repair and accessibility limits; the $600,000 home-value limit is confirmed); the Services &
  Equipment student grant links to its own official page (#220); the BC fuel-tax refund no longer turns away
  people on routes the page accepts.
- **BC autism funding** — `36e0d5a`, `?v=183`: the travel/training/equipment limit now uses the newest page's
  exact rule (50% for plans of 12 months or less, 50% of the adjusted portion for longer plans, 20% for youth
  turning 19 before March 31, 2027). The fuel-tax requirement, which had grown to 1,148 characters, is now one
  sentence plus a bullet list.
- **51 guides now say "Info verified October 2026"** — `8f085e6`, `?v=184`. Only records where every fact was
  confirmed or fixed, nothing is open, and no figure, age or date is missing from the page. The other 83 keep
  their older date; the reason for each is in `research/reverify/VERIFIED-DATES-2026-10-17.md`.

### Still open (small)
- Codex review owed on two small commits it couldn't finish (`36e0d5a` autism/fuel-tax, and the batch 6 build).
- Two official pages contain typos ("$74.109", "$600,00"); we kept the correct figures.

### Needs you
- Nothing.

## 2026-10-14 — evening

### Shipped
- **Re-verification batch 3** (#221) — `dc23374`, `?v=175` (CI 729/729, verify-deploy 10/10). 35 facts fixed
  across 17 records, e.g. ICBC "may receive 25%"; BC PWD designation's closed list of three supports;
  WorkBC training "may" be funded; corrected contact numbers for the Alberta Child Health Benefit and
  Red Deer. Codex has now also reviewed Claude's Kelowna fix (two small follow-ups applied).
- **Re-verification batch 4** — `fafd506`, `?v=176`. 16 records, 334 facts, 41 differed, 38 fixed.
  **Surrey Leisure Access's income limits were all lower than the City's table** ($25,588 vs $26,355 for one
  person, etc.), wrongly turning people away. Vancouver now shows its two separate income tables. ADAP
  follows "18 or older and not eligible for Old Age Security".
- **Re-verification batch 5** — `fd10cb0`, `?v=177`. 16 records, 391 facts, 36 differed, all 36 fixed. BC MSP
  Supplementary Benefits now lists all eight eligible groups (we said "three ways"); the child and youth
  disability benefit's age and helpline numbers corrected; Medical Equipment's emergency exception restored.
- **Re-verification batch 6** — `b31c1cf`, `?v=178` (CI 732/732). 16 records, 28 differences, all fixed. AISH follows
  "18 or older and not eligible for Old Age Security" (65+ now "More to check", never "Matches"; the AISH safety
  tests passed unchanged); Special Needs Housing's rent rules; the Adult Health Benefit's correct contact centre.
  Codex ran out of usage mid-build, so a Claude worker finished it and a separate Claude reviewer checked it —
  **Codex review owed**.
- **Batch 7 built but NOT released** (14 records, 18 differences: DTC must be submitted with the digital DTC form or
  by mail, not "submit documents"; Leduc recreation is closed until January 2027; GRT's online application is
  temporarily down; and more). Committed locally on the work branch only, because Claude hit its own usage limit
  before an independent review. Next session: Codex reviews it, then it ships.
- Progress: **93 of 134 records re-checked and released** (107 including batch 7).
- Note: the readability ratchet's baseline rose slightly (about a dozen passages) because the official wording,
  qualifiers included, is longer than our old shortened text. Accuracy wins over brevity here.

### Decisions we made for you
- Two autism-funding rules (the 50%/20% travel and training limits) were left as they were: today's pages
  don't mention them, and they were verified against the program policy earlier. Absence on a page is not
  treated as proof something is wrong.

### Needs you
- Nothing.

## 2026-10-14 — day

### Shipped
- **Re-verification batch 1** (#219) — `b608154`, `?v=172` (CI 723/723, live). 17 records checked against
  their official pages: 415 facts, 223 confirmed, 20 differed, 19 fixed. Examples: BC Healthy Kids now says
  "$42,000 or less"; the BC fuel-tax refund's routes say "permanent" again; Medical Transportation "helps pay"
  instead of promising to pay. BC sales tax credit, Burnaby and Medical Transportation no longer
  shut out people on routes the official page lists.
- **Re-verification batch 2** — `4c0f4e4`, `?v=173`. 11 more records: 219 facts, 128 confirmed, 24 differed,
  all 24 fixed. Examples: Edmonton fare assistance is $35 or $50 by income (we said $36); Medicine Hat
  has separate recreation and Esplanade amounts; Lethbridge's $150 is a per-person, per-season maximum.
- **OC Transpo link** (#218): not broken. Its firewall blocks our monitor but serves browsers.

- **Kelowna recreation assistance income limits** — `93d1655`, `?v=174`. All seven family-size limits
  were higher than the City's own "LICO 2025" table (1 person: we said $31,264, the City says $26,926), so
  some people were told they were under the limit when they weren't. Fixed straight away because it was
  misleading people; built and reviewed by Claude while Codex was out of usage (Codex review owed).
- **Batch 3 checked, fixes waiting for Codex** — 17 records (taxi savers, Victoria, Wood Buffalo, AADL,
  Airdrie, ICBC, PharmaCare Plan C, PWD designation, WorkBC, child health, CWB, DRES, HandyDART, Red Deer…).
  A Claude reviewer decided 37 exact fixes (`research/reverify/DECISIONS-2026-10-15-batch3.md`), e.g. ICBC
  "may receive 25%" not a flat 25%; PWD's closed list of three supports; two wrong phone numbers (child
  health, Red Deer). Codex builds them when its usage resets.

### Verified how
- Every difference went through three steps: Codex found it, a Claude reviewer confirmed it against the
  full official page text and decided the fix, Codex applied it, and a second Claude review checked the
  edit. One Codex-suggested fix was rejected: the MSP Supplementary page itself says "less than
  $42,000", while the Healthy Kids page says "or less". The two official pages disagree, so each record
  follows its own page.
- Verified dates were NOT moved forward: each record still has facts the page doesn't state, which
  need a different page to confirm.

### Decisions we made for you
- "Up to $2,800" kept on the student grant even though the page says "$2,800", because it's the
  more cautious wording.
- Having a PWD designation is not treated as proof someone *receives* assistance (Burnaby, Medical
  Transportation, Richmond). Those programs show "More to check" instead of "Matches your answers".

### Needs you
- Nothing.

## 2026-10-13 — late night (commit times on 2026-10-14)

### Shipped
- **Honest status labels** (#209 phase 1) — `f86116e`, live as `?v=170` (CI 702/702). Results now say
  "Matches your answers" (with "The program decides if you qualify"), "More to check" and
  "Does not match these answers", plus "We did not ask about every requirement." Overclaiming words
  ("eligible", "likely", "one step away") are gone from status text, and a test keeps them out.
  Which programs match did not change. Codex proposed adding optional per-program checks too;
  Claude deferred that to a 3-program pilot (`research/209-answerable-gates/CLAUDE-CRITIQUE.md`).
- **"Documents several programs ask for"** (#213) — `0799863`, `?v=171`. Results and the printed
  action plan list the documents that two or more of your programs need, plus one line counting
  the rest. Codex's first version listed 52 items for one person; Claude cut it to the shared 4.
- **Outreach one-pager approved** (#83): https://claude.ai/artifact/1EKW9enWE3zrZMU7REykcf
- **Workflow envelope committed**, and GPT workers now default to fast mode, at your request.

### Found, not yet fixed — first job tomorrow
- Fact check of the 25 oldest records against today's official pages
  (`research/reverify/REPORT-2026-10-14.md`, **unfinished**: Codex ran out of usage after 15
  records). 184 facts confirmed, **16 differ** from the official page. Examples: BC Healthy Kids
  says "less than $42,000" where the page says "$42,000 or less"; the BC fuel-tax refund drops
  "permanent"; Medical Transportation hardens "may be provided" into a promise. None changed yet —
  each needs a same-day check and cross-review before editing.

### Needs you
- Nothing.

## 2026-10-13

### Shipped
- **"Requirements to check" replaces "To unlock this you still need"** (#208, #207) — commits
  `b662019`, `7635bcf`, live as `?v=166`. Each unmet requirement now shows a one-line cue grouped by
  who acts (you / a professional / the program), with the full official wording under one
  "Read full requirements for …" disclosure. Results cards show up to three cues plus
  "and N other checks". The detail view used to drop every requirement after the second; it now
  shows them all. 87 of the 88 long requirements have a cue.
- **Honest freshness labels** (#212) — commit `8346345`, `?v=167`. 54 of 134 guides only carry the
  July 2026 catalogue review date; they now say "Part of the July 2026 catalogue review" instead of
  "Info verified". The About page states the live counts.
- **Readability ratchet** (#210) — `npm run check:surfaces` and a test that fails if the number of
  long, dense passages ever goes up.
- **Re-verification queue** (#211) — `npm run reverify:queue` ranks which records most need
  re-checking against their official page, and can snapshot and diff those pages.

- **Saved-progress crash fix** (#215a) — `6d9fac6`, `?v=168`. New chaos tests feed the app
  corrupt, truncated, oversized and failing saved data; one case (an old saved value that was a
  bare number) left the page stuck on "Loading your saved progress…" forever. Fixed.
- **Two misfiled requirements moved** (#216) — `03b5b26`, `1ec4dc0`, live as `?v=169`. The CDB
  payment calculation and the RDSP grant/bond deadline were blocking matches although they are
  not conditions for applying; their text now sits under "More about" in the official pages' own
  words (fetched 2026-10-14). The other two suspects were kept, with sourced reasons.
  `research/216-misfiled/`.
- Final state: CI **696 of 696** passed, `verify:deploy` 9 of 9 against production at `?v=169`.

### Verified how
- CI on `7635bcf`: 546 of 546 browser and Worker tests passed, both jobs green; the live site
  serves `?v=166` with the new layout. `?v=167` was in CI when this entry was written.
- Each change was built by Codex and reviewed by Claude, or the reverse. The cue review approved 75
  of 88 drafts and rewrote 13, two of which could have misled someone (an AISH coverage cue and a
  CPP children's benefit cue). The layout review caught link text left at the browser's default
  blue, unreadable in dark and high-contrast themes; that was fixed before release.
- Screenshots checked in light, dark and mobile.
- Link monitor: it reported 10 broken links. Claude opened each in a real browser; 9 load fine
  (the sites block bots). Only OC Transpo's reduced-fares page refused a browser too (#218).

- Two red CI runs on 2026-10-14, both caught by the deploy gate, so nothing broken reached users:
  a Firefox-only test assertion (fixed in `59f6fcd`), and a generated-file entry Claude forgot to
  stage (`1ec4dc0`). Claude also pushed once without reading the previous run's result first;
  that is now a written rule.

### Decisions we made for you
- The heading is now the neutral "Requirements to check" on both surfaces, replacing
  "To unlock this you still need" and "Before you can apply".
- English only for the new wording; French stays paused.
- `bcCydbIntake` has no cue on purpose; Codex judged it misfiled, and #216 will verify that.
- Codex's idea list is in `research/brainstorm-2026-10/CODEX-IDEAS.md`; seven became tickets
  #211–#217.

### Needs you
- ~~Commit the workflow change~~ — done 2026-10-14 after your approval (`fe2c5e3`, `9748e3a`).
- ~~#83 outreach one-pager~~ — refreshed (134 programs, 46 municipalities, AB · BC · ON) and approved by you 2026-10-14: https://claude.ai/artifact/1EKW9enWE3zrZMU7REykcf (private until you share it).
