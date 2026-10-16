# Owner digest

The one place to see what Claude and Codex did while you were away. Newest entry first.
Each entry: **Shipped** (commit + live version) · **Verified how** · **Decisions we made for you**
(all reversible) · **Needs you** (only things an agent may not decide).

## 2026-10-19

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

### Needs you
- Nothing.

## 2026-10-18

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

## 2026-10-17

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

## 2026-10-16

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

## 2026-10-15

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

## 2026-10-14 (evening)

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
