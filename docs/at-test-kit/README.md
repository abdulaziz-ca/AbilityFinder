# AbilityFinder human AT test kit

TaskView #215(b), preparation for epic #28. Use invented answers only.

This kit gives a human tester repeatable starting points and checks. The seed
smoke test checks **local setup and rendered content, not speech or usability**.
It cannot pass NVDA, TalkBack, VoiceOver, or Safari Full Keyboard Access for you.
Do not mark epic #28 complete, lift the NO-GO, or sign off accessibility from a
green automated run. Keyboard-only, 200–400% zoom/reflow, reduced motion and
cognitive-usability sessions with real people remain necessary (AGENTS.md).

The open VoiceOver finding is particularly important: on the
`bc-csg-services-equipment` guide, a human heard the title then “Good to know,”
missing the summary and “What it is.” Heading/landmark navigation legitimately
skips body text. **Only item-by-item navigation can settle that finding.**
NVDA and TalkBack passes are still human work. Do not infer their results from
Chromium's accessibility tree, axe, WebKit automation, or this kit.

## Start safely (5 minutes)

1. Use a separate test browser profile on the device being tested. Close all other
   AbilityFinder tabs. These snippets **replace the local saved session**, including
   answers, tracked programs and preferences. Never use a real visitor's profile.
2. Use the same build and origin for the whole pass. Record its revision/asset
   version, not an address containing personal data. Use a local static server if
   convenient (`python3 -m http.server 8766 --directory public`). Android may need
   a tester-arranged local connection to that server; the helper does no networking.
3. In this repo run `npm run at:seed`. It prints six labelled, single-line browser
   console snippets. A facilitator may copy them to the test device. Do not enter
   them in the address bar, a search engine, or another site's console.
4. On the **app's own origin**, open `/robots.txt`. This is a plain document with
   no app scripts, so app saves cannot race setup. Open the browser console,
   paste just one snippet and wait for **“AT fixture saved”**. If it errors or is
   blocked, stop; record the message. Do not disable browser security protections.
   Remote device console tooling can be used for setup only; disconnect before
   listening. No DevTools/console access? A facilitator can seed, or enter the
   exact wizard answers below. This is setup, not an AT pass.
5. Open the app root in the **same tab and origin**, then close DevTools. The
   snippet itself makes no requests, puts no answers in URLs, and does not navigate.
   Fresh personas have no updates notice; only `returning` has an old marker.
6. Copy [RESULTS-TEMPLATE.md](RESULTS-TEMPLATE.md) for your run. Record initials
   only. Write what you actually heard, not what this page says you should hear.

The helper writes IndexedDB `abilityfinder` v1, store `sessionState`, key
`session_uuid = 00000000-0000-4000-8000-000000000001`, incrementing the record
revision. Payload schema is 2: `answers`, `view: results`, `progress`, `ui`.
The returning persona uses `ui.programChanges: {version: 1, seenByProgram: …}`
with every current catalogue ID at revision 0, like `e2e/what-changed.spec.js`.
It also tracks `bc-autism-funding-under-6` as `saved`, even though it is not an
AB match. No benefit amounts, eligibility rules or product code are changed.

### Existing limit — interpret the no-matches persona correctly

* **“No matches” means no ready matches here:** `no-matches` has **0 Matches your
  answers**, but **11 More to check**. A genuine zero-total-results state cannot
  be produced with valid wizard answers: CDCP, medical-expense and caregiver
  records always have a further check, rather than a hard exclusion. This kit
  covers the no-ready-match experience honestly; it does **not** fabricate or
  claim coverage of a zero-total-results screen. A true zero-total fixture needs
  a separately approved product/data change, outside this task.

## Six fixed personas (8 minutes for the seeded sweep)

These are synthetic cases, not eligibility verdicts. “Matches your answers” still
requires the program to decide. Keep **Priority order**, English and default
settings when comparing the counts. Counts are a versioned fixture expectation,
not a promise about how many benefits a real person can receive.

### Exact answers to enter

Read down the table in wizard order. Choose only the listed checkboxes. “Skip”
means the wizard does not ask; do not invent an answer. Single choices may advance
on their own; multi-choice questions need **Continue**. City selection advances
automatically. If a single-choice page remains, use **Next**.

| Question | AB adult `ab-self` | BC child `bc-child` | ON family `on-family` |
|---|---|---|---|
| Who? | Myself | My child | Another family member |
| Disability | Physical / mobility | Autism spectrum | Physical / mobility |
| Age | 19 to 59 | Younger than 6 | 19 to 59 |
| Professional documentation | Yes, it is documented | Yes, it is documented | I'm not sure |
| Autism diagnosis | Skip | Yes | Skip |
| Began before 18 | Skip | Yes, it began in childhood | Skip |
| Walk 50 metres | No, that's difficult or impossible | Skip | No, that's difficult or impossible |
| Daily-life effects | Needs significant help, supervision, an assistive device or service animal for daily activities; Cannot use regular public transit without assistance for some or all trips | Has very high or complex developmental support needs; Needs help communicating, understanding others, or being understood | Needs significant help, supervision, an assistive device or service animal for daily activities; Needs disability-related medical equipment or supplies |
| Province | Alberta | British Columbia | Ontario |
| MSP | Skip | Yes | Skip |
| BC assistance | Skip | None of these | Skip |
| BC ownership/graduate circumstances | Skip | None of these | Skip |
| Citizen/permanent resident | Yes | Yes | Yes |
| DTC | Yes, I'm approved | No, not yet | No, not yet |
| Situation | A disability stops me from working | In child care or preschool | A disability stops your family member from working |
| Household income | Lower income | Lower income | Lower income |
| City | Edmonton | Vancouver | Toronto |

The remaining personas use **every AB adult answer above**, except for these
explicit changes:

| Persona | Exact changes |
|---|---|
| BC adult `bc-self` | Province: British Columbia; MSP: Yes; BC assistance: PWD designation or disability assistance; BC circumstances: None of these; city: Victoria. Daily-life effects: the two AB choices **plus** Needs disability-related medical equipment or supplies. |
| No ready matches `no-matches` | Disability: Something else / not listed; documentation: No, not yet; daily-life effects: None of these; province: Another province or territory; citizenship: No / not yet; DTC: No, not yet; situation: None of these; income: Higher income. Walk, city and BC-only questions: Skip. Age remains 19 to 59, who remains Myself. |
| Returning `returning` | Same wizard answers as AB adult. Extra local state: old updates marker and BC Autism Funding (under 6) saved. Use its seed: wizard answers alone cannot recreate that history. |

### Expected result groups (tick during the seeded sweep)

| Persona | Matches your answers | More to check | Results total | Updates panel |
|---|---:|---:|---:|---|
| [ ] `ab-self` | absent (0) | 22 | 22 | absent |
| [ ] `bc-child` | 4 | 21 | 25 | absent |
| [ ] `on-family` (including after reload) | 3 | 17 | 20 | absent |
| [ ] `bc-self` | 10 | 20 | 30 | absent |
| [ ] `no-matches` (no ready matches) | absent (0) | 11 | 11 | absent |
| [ ] `returning` | absent (0) | 22 | 22 | Updates to your programs |

Each also has the **Does not match these answers** disclosure. Group labels are currently ordinary
text, not heading elements: read them item-by-item, not only with a heading list.
Check the result heading, group text and one program name for each seed; do not
read every program in the catalogue. On failure record persona, observed total,
missing group/panel and the last action.

## How to drive each pass

Target **50–55 minutes per screen reader**, including setup and the six-seed
sweep. Do journeys 1–8 **once**, not eight times for each persona: J1 BC child;
J2 BC child plus the named regression guide; J3–4 BC adult; J5 returning; J6–7
AB adult; J8 BC adult plus the ON restore check. Stop a blocked journey after
about two minutes, record it, reseed and continue. Do not count blocked as passed.

* **NVDA, Windows, Firefox:** use Tab/Shift+Tab for controls, Enter for links,
  Enter/Space for buttons, Space for checkboxes, arrows for radios and select
  choices. In browse mode use Down Arrow to read each item, H for headings,
  D for landmarks. NVDA+Space switches browse/focus mode when needed. Listen
  after each action rather than holding keys down.
* **TalkBack, Android, Chrome:** use an external keyboard for the numbered Tab,
  Shift+Tab, Enter/Space steps if available. For reading, swipe right **one item
  at a time**; double-tap to activate. Without a keyboard use swipe/double-tap
  equivalents, and mark keyboard portions **not run**, not pass. Use TalkBack's
  reading controls for headings/landmarks only for the separate structure checks.
* **VoiceOver, macOS, Safari:** VO means Control+Option. Use VO+Right one item
  at a time, VO+Space to activate; interact with a group using VO+Shift+Down
  when needed. Turn Quick Nav off for ordinary arrow-key form input. Use the
  rotor (VO+U) separately for headings and landmarks. Do **not** use the rotor
  instead of item-by-item reading in J2. iOS swipe reading is useful additional
  evidence, but not a replacement for the Safari keyboard pass below.

Speech varies by version and verbosity. Checks below specify meaning, role and
name, not an exact synthetic voice transcript. Tick the column for **only the AT
actually used**. For each journey also tick: [ ] no lost focus; [ ] next/previous
reading order makes sense; [ ] no silent state change or repeated speech that
prevents completion. Initial load need not focus a heading: the skip link should
remain the first Tab stop. In-app route changes should focus their heading (or
Requirements when that link was used) and announce its label politely.

## J1 — Wizard start to results (8 minutes)

1. In a fresh test profile open the app root without seeding. Tab to **Skip to
   main content**, Enter; confirm focus moves to main. Tab to the find-benefits
   start button and Enter. (To reuse a profile, **Start over** on results clears
   the fixture; this is safe only in the test profile.)
2. Enter the **BC child** answers above with Tab, arrows and Space. Use Continue
   on multi-choice pages. Confirm each question is read, selected state is clear,
   and Back allows correction without losing other answers. Do not select an
   adult work option for this child.
3. Complete the city choice. Read the results heading, total **25**, both group
   labels, one card title and **Does not match these answers**. Use heading/landmark navigation
   separately to find main and program headings.

| NVDA checks | TalkBack checks | VoiceOver checks |
|---|---|---|
| [ ] Skip link name, main landmark; question heading and fieldset question/help; radio checked/checkbox checked; Continue button; new question via focus/polite route message; results heading and 25; group labels and program headings readable. | [ ] Skip/main reachable; each question, radio/checkbox name and selected state read while swiping; Continue actionable; changed question/results heading announced; main, 25 and both groups reachable. | [ ] Skip/main reachable; question heading, group legend/help and selected controls read; route question/results announced; rotor exposes main/headings; item reading reaches 25 and both group labels. |

**If it fails, record:** step/question, chosen answer, navigation mode, last spoken
words, where focus went and whether Back/Continue recovered it.

## J2 — Guide and Requirements disclosure (8 minutes)

1. Seed BC child. On results Tab to a **Requirements to check** card's
   **See all requirements for [program name]** link and Enter. Read the Requirements heading and
   short checklist. Read each responsibility group present: **What you can check
   or prepare**, **What a professional confirms**, **What the program decides**,
   **Shared checks** or **Other checks**. Not every guide has every group.
2. Tab to **Read full requirements for [program name]**. Enter/Space to expand;
   read short cue, full wording and any action link. Collapse and expand again.
   Check collapsed content is not read, expanded content is, and no wording is
   lost. If this card has only one direct requirement and no disclosure, choose
   another More to check card with a disclosure; record its program name.
3. Return to results using the guide's Back button. Open the guide for
   **Canada Student Grant for Services and Equipment – Students with Disabilities**
   (`bc-csg-services-equipment`). If not in the child's results, use Menu → Browse
   all benefits, search its name, open its guide. Start at the guide title, then
   read **item-by-item**, not by heading/landmark, through the summary and the
   next explanatory content. Read **Good to know** and the later **More about
   this benefit** section in their actual order. The older report called this
   explanatory text **What it is**; do not demand an obsolete heading or order.
   If a disclosure is present, expand it before reading its body. Record the
   actual sequence, including any disclosures. A heading rotor jumping body text is not
   evidence that item-by-item reading works.

| NVDA checks | TalkBack checks | VoiceOver checks |
|---|---|---|
| [ ] Requirements heading is focused/announced from its card link; named region, grouped checklist and full-requirements name read; collapsed/expanded state changes; Down Arrow reads every expanded line, guide summary and explanatory text. | [ ] Requirements label/region and responsibility headings read; disclosure named for the program and expanded/collapsed; swipe reaches full text, guide summary and explanatory text in order, not just action controls. | [ ] Requirements heading/region and groups read; full-requirements disclosure name/state clear; **VO+Right** reads title → summary → visible sections including Good to know and later More about this benefit without missing text. Record even if rotor navigation works. |

**If it fails, record:** program ID/name, exact skipped text, preceding/following
spoken item, disclosure state, item-reading vs rotor/browse mode, and whether
reverse reading reaches the missing text. This is the key epic #28 regression.

## J3 — Print action plan (4 minutes)

1. Seed BC adult. Tab to **Print my action plan**, Enter. Do not use the browser's
   generic print shortcut as the only test; test this named app button.
2. In the system print dialog/preview, read the available name, preview and
   controls. Use the OS/browser's keyboard Cancel (usually Escape). Do not send
   to a physical printer or save personal data. Confirm return to the results.
3. Check the preview visually with a sighted helper if its document is not exposed
   to AT; mark preview reading **not testable**, not pass. Expect the action-plan
   title, program names, match caveats, next steps and document lists. The
   print-only article is intentionally hidden from the normal screen-reader view;
   do not expect duplicate plan contents before opening print.

| NVDA checks | TalkBack checks | VoiceOver checks |
|---|---|---|
| [ ] Print my action plan button named; system print dialog controls read; Cancel exits without losing results; report preview accessibility separately. | [ ] Print button named/actionable; Android print UI announced; Back/Cancel returns to results; report absent preview access rather than assuming print contents were spoken. | [ ] Print button named; Safari print sheet announced, keyboard controls reachable; Cancel returns to results with usable focus; preview access recorded separately. |

**If it fails, record:** app vs system-print boundary, dialog/control spoken name,
preview accessibility, cancel keys used and resulting focus. Do not attach a real
person's printed plan.

## J4 — Documents checklist (4 minutes)

1. Stay on BC adult results. Tab to **Documents several programs ask for (N)**.
   The count is shared document types, not the number of matched programs.
2. Enter/Space to expand. Read the warning that official pages have the final
   list, then two document entries and their **Needed for:** program names.
3. Collapse. Continue Tab/reading to the next control, then Shift+Tab back.
   Confirm no hidden checklist entries remain in the reading path.

| NVDA checks | TalkBack checks | VoiceOver checks |
|---|---|---|
| [ ] Summary name/count and expanded/collapsed state; list items and Needed for program names read; decorative boxes are not fake checkboxes. | [ ] Summary name/count/state read; each document and Needed for list reachable by swipe; no unlabeled box controls; collapse removes entries. | [ ] Summary disclosure name/count/state; item reading includes each document and its program names; no interactive checkbox announced for decorative boxes; collapse works. |

**If it fails, record:** summary count, document label and associated program names,
state before/after activation, and whether a decorative square was announced.

## J5 — Updates panel “Got it” (4 minutes)

1. Seed returning. Find **Updates to your programs** after the results heading.
   Read the explanation: these are recorded guide updates, not necessarily program
   changes or approval. Tab to **Show the updates**, Enter/Space.
2. Read one matched entry and the saved/tracked BC Autism Funding (under 6) entry,
   their dates/guide-update text and named guide/source links. Do not open the
   external official-source links during this local test.
3. Tab to **Got it**, whose full accessible name is **Got it, hide these updates**;
   Enter. Wait for **These updates are marked reviewed on this device.**
4. Reload. The notice should be absent and results unchanged. Reseed returning
   only when you want to repeat this journey; that intentionally resets review.

| NVDA checks | TalkBack checks | VoiceOver checks |
|---|---|---|
| [ ] Named Updates region and level-3 heading; Show the updates state; program level-4 headings and saved/tracked text; full Got it name; polite reviewed status read with focus there, no lost focus; reload has no notice. | [ ] Updates region/heading, disclosure state and entry/link names reachable; Got it action reads full meaning; reviewed message announced and reachable after old controls disappear; no notice after reload. | [ ] Updates region/heading and disclosure state; item reading includes saved/tracked entry; Got it full name; focused polite status speaks reviewed message (note excessive duplicates); no notice after reload. |

**If it fails, record:** updated program, marker seed used, whether expansion or Got
it caused trouble, exact status speech, focus destination and reload outcome. A
storage-error message is a failure to save review, not successful dismissal.

## J6 — Accessibility settings dialog (4 minutes)

1. Seed AB adult. Tab to **Accessibility options**, Enter. Read the dialog name.
2. Tab through Close, Read this page aloud, text-size buttons and toggles. Do not
   start built-in read-aloud while using an AT voice. Toggle **Reduce motion** and
   **High contrast** with Space; listen for pressed/not-pressed states.
3. Tab and Shift+Tab through the ends of the dialog: focus must stay inside;
   main/background must not be reachable while modal. Press Escape (or activate
   Close on touch). Focus returns to Accessibility options, background is usable.
4. Reopen, use **Reset accessibility**, then Close. Keep default settings for the
   remaining result-count comparisons.

| NVDA checks | TalkBack checks | VoiceOver checks |
|---|---|---|
| [ ] Accessibility options dialog named/modal; initial focus inside; Decrease/Reset/Increase text size named; toggle names and pressed states; no background reading; Escape restores opener. | [ ] Dialog name/context; swipe cannot escape to background; size controls and toggles named with state; Close returns to opener; external-keyboard trap tested or marked not run. | [ ] Dialog name/context, initial focus inside; VO reading and Tab stay inside; size button names and pressed states; Escape returns to opener; background available only after closing. |

**If it fails, record:** control name/state, entry focus, which key escaped the trap,
background item reached, and close/restore behavior. Record settings before reset.

## J7 — Language switch (3 minutes)

1. On AB adult results Tab to **EN — change language to French**, Enter.
2. Read the results heading, one translated control and a program requirement.
   Confirm the language control now includes the visible **FR** token in its
   accessible name. English catalogue text is intentionally not all translated;
   labelled English sections should remain understandable, not be misrepresented
   as translated eligibility rules.
3. Activate the control again to restore English. Confirm answers/results did
   not disappear. Do not require a specific accent if that voice is not installed;
   record voice availability and any incorrect language reading.

| NVDA checks | TalkBack checks | VoiceOver checks |
|---|---|---|
| [ ] EN/FR token included in control name with target-language action; changed heading/control read; English requirements still readable; state retained on switch back. | [ ] EN/FR control name and action understandable; updated heading/control reachable and spoken; English sections readable with installed voice; switch back retains results. | [ ] EN/FR name contains visible token; page language/translated heading usable; English-tagged sections readable (voice availability noted); switch back retains results. |

**If it fails, record:** before/after control name, UI language, exact text/voice
misread, installed voices and whether focus or answers were lost.

## J8 — Restore after reload (3 minutes)

1. Seed BC adult. Note total **30**, groups **10/20** and one program name.
   Reload with Ctrl+R (Windows), Command+R (Mac), or the browser Reload control.
2. Wait for loading to finish. Use Tab from the top: Skip to main content should
   remain first. Enter it; read the results heading and groups. No blank screen,
   reset wizard, stale loading message or invented eligibility announcement.
3. Seed ON family; results should appear directly with **20** results (groups
   **3/17**). Reload and confirm the same results restore without asking for the
   city again. Toronto must remain selected in the saved answers.

| NVDA checks | TalkBack checks | VoiceOver checks |
|---|---|---|
| [ ] BC initial-load main/heading reachable, loading status not stuck, results/groups retained; no unexpected focus jump; ON results restore directly without a city question. | [ ] BC loading ends, main/results and groups reachable; no forced wizard/reset; keyboard skip check run or marked not run; ON results restore directly without a city question. | [ ] BC skip link still first Tab stop after reload, main/results readable, no stuck loading or focus jump; ON results restore directly without a city question. |

**If it fails, record:** persona, before/after total and route, last loading message,
where focus starts, and whether the problem happens again after one reload.

## Safari Full Keyboard Access — separate human check (5 minutes)

On macOS/Safari, record the actual macOS **Keyboard navigation / Full Keyboard
Access** setting and Safari's **Press Tab to highlight each item on a webpage**
setting (names vary by OS version). Turn VoiceOver **off** for this keyboard-only
check. Save the old settings so they can be restored.

1. With defaults/off, reload and note what Tab reaches. Safari can skip links and
   buttons by policy. Record this baseline, not an automatic app defect.
2. Enable full webpage keyboard navigation using the settings above. Reload;
   Tab from the top. [ ] Skip to main content first and visible; [ ] Enter moves
   focus to main; [ ] links and buttons reachable in both directions.
3. Open Accessibility options. [ ] Tab/Shift+Tab stay inside; [ ] toggles operable;
   [ ] Escape restores the opener. Do not use mouse clicks or VO cursor commands
   to make a missing Tab stop appear to pass. Restore the original OS settings.

**If it fails, record:** exact settings, OS/Safari versions, VoiceOver off/on,
last reachable control, next focused element (if known), key sequence and visible
focus behavior. WebKit automation is not evidence that this human pass happened.

## Maintenance and hand-off

Run `npm test` and
`npx playwright test --project=app-chromium --workers=1 e2e/at-kit.spec.js`.
The six smoke tests execute the same one-line snippets, check fixed result counts
and groups, absence/presence of the Updates panel, and returning review/reload.
They intentionally do not simulate screen-reader speech. If catalogue changes
alter counts, inspect the changed programs and update both this table and the
smoke expectations together; never calculate expected counts using the same
matcher under test. Ontario results must restore directly without a city question.

Submit the filled template as human evidence with failed/blocked journeys and
follow-up tickets. Do not include answers about real people, names, contact
details, postal text, recordings containing personal information, or full browser
profiles. A kit run prepares human work; it does not authorize human sign-off.
