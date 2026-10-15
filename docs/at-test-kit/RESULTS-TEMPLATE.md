# Human AT results — fill in, do not pre-mark passes

Preparation for epic #28, not automated sign-off. Use **initials only**. Do not
include names, personal answers, contact details, postal text, account identifiers,
full profile exports or recordings containing personal data.

## Run environment

Use a separate row/run ID for each device/AT combination, including a separate
Safari keyboard-only run. Record exact versions where available, not “latest.”

| Run ID | Date (YYYY-MM-DD) | Tester initials | Device/model | OS + version | Browser + version | AT + version | App revision / asset version | Input (keyboard/touch) | Installed speech language(s) |
|---|---|---|---|---|---|---|---|---|---|
| N | | | | | Firefox: | NVDA: | | | |
| T | | | | | Chrome: | TalkBack: | | | |
| V | | | | | Safari: | VoiceOver: | | | |
| K | | | | | Safari: | Off (keyboard only) | | Keyboard | N/A |

Safari settings before/after (exact labels and values):
- macOS Keyboard navigation / Full Keyboard Access: ______ / ______
- Safari Tab-to-highlight-each-item setting: ______ / ______
- VoiceOver Quick Nav during form input: ______
- Browser zoom / theme / reduced motion: ______
- Setup method: seed console / manual wizard / facilitator: ______
- Setup problems or blocked steps (no personal data): ______
- Run started / ended / minutes: ______

## Journey × screen reader

Status: **P** pass, **F** fail, **B** blocked, **NR** not run, **NT** not testable.
An empty cell is not a pass. Put a status in every row after the run. A known
product problem still fails its affected check; do not hide it behind an AT pass.
Use notes for the exact check that passed or failed. Copy rows for retests; keep
original evidence. The README has detailed tick checks and failure prompts.

| Journey | Screen reader / run ID | P/F/B/NR/NT | Persona used | Notes: observed speech, focus, navigation mode; failure reference |
|---|---|---|---|---|
| J1 Wizard → results | NVDA / N | | bc-child | |
| J1 Wizard → results | TalkBack / T | | bc-child | |
| J1 Wizard → results | VoiceOver / V | | bc-child | |
| J2 Guide + Requirements | NVDA / N | | bc-child + regression guide | |
| J2 Guide + Requirements | TalkBack / T | | bc-child + regression guide | |
| J2 Guide + Requirements | VoiceOver / V | | bc-child + regression guide | |
| J3 Print action plan | NVDA / N | | bc-self | Dialog: ___ Preview: ___ Return: ___ |
| J3 Print action plan | TalkBack / T | | bc-self | Dialog: ___ Preview: ___ Return: ___ |
| J3 Print action plan | VoiceOver / V | | bc-self | Dialog: ___ Preview: ___ Return: ___ |
| J4 Documents checklist | NVDA / N | | bc-self | |
| J4 Documents checklist | TalkBack / T | | bc-self | |
| J4 Documents checklist | VoiceOver / V | | bc-self | |
| J5 Updates “Got it” | NVDA / N | | returning | |
| J5 Updates “Got it” | TalkBack / T | | returning | |
| J5 Updates “Got it” | VoiceOver / V | | returning | |
| J6 Accessibility dialog | NVDA / N | | ab-self | |
| J6 Accessibility dialog | TalkBack / T | | ab-self | Keyboard portion: ___ |
| J6 Accessibility dialog | VoiceOver / V | | ab-self | |
| J7 Language switch | NVDA / N | | ab-self | |
| J7 Language switch | TalkBack / T | | ab-self | |
| J7 Language switch | VoiceOver / V | | ab-self | |
| J8 Restore after reload | NVDA / N | | bc-self + on-family | BC: ___ ON: ___ (known city restore failure; verify) |
| J8 Restore after reload | TalkBack / T | | bc-self + on-family | BC: ___ ON: ___ (known city restore failure; verify) |
| J8 Restore after reload | VoiceOver / V | | bc-self + on-family | BC: ___ ON: ___ (known city restore failure; verify) |
| Safari keyboard baseline (settings off/default) | No AT / K | | ab-self | Tab reaches: ___ |
| Safari Full Keyboard Access enabled | No AT / K | | ab-self | Skip/main: ___ Links/buttons: ___ Modal/restore: ___ |

## Six-persona setup sweep (not an AT sign-off)

Enter observed ready/more-to-check totals, panel present/absent and status. Use
one table per run if needed. “No matches” below means no **ready** matches; a
true zero-total state is not available with current valid wizard answers.

| Persona | Expected ready / more-to-check | NVDA observations/status | TalkBack observations/status | VoiceOver observations/status |
|---|---|---|---|---|
| ab-self | 0 / 22; no updates | | | |
| bc-child | 4 / 21; no updates | | | |
| on-family | 3 / 17 after Toronto workaround; no updates | | | |
| bc-self | 10 / 20; no updates | | | |
| no-matches | 0 / 11; no updates (zero-total coverage unavailable) | | | |
| returning | 0 / 22; updates visible before Got it | | | |

## Failure / retest detail (copy for each finding)

- Finding reference / journey / run ID / date / initials: ______
- Persona and program ID if relevant: ______
- Steps immediately before failure (numbered keys, swipe or VO commands): ______
- Reading mode (item-by-item, heading, landmark, browse/focus, Quick Nav): ______
- Expected name / role / state / text: ______
- Actual words heard (brief, synthetic content only): ______
- Focus before / after; visible focus if known: ______
- Disclosure open/closed; settings; loading or save error: ______
- Reproduces once more? Workaround used? ______
- Effect on completing the task: ______
- Follow-up ticket / sanitized evidence reference: ______
- Retest version / date / initials / result (keep original result): ______

### Required VoiceOver regression evidence

Guide `bc-csg-services-equipment`; item-by-item commands used: ______

Actual order heard from title, through summary and explanatory body, including
Good to know and More about this benefit (older report: “What it is”): ______

Did any body text disappear only during heading/landmark navigation, or also
item-by-item? Which exact text? ______

## Hand-off summary

- Completed journey rows: ___ / 24 (8 × 3 ATs; fill only the ATs actually run)
- P: ___ F: ___ B: ___ NR: ___ NT: ___
- Safari keyboard-only pass actually performed? ___ Settings/evidence: ___
- Known ON restore outcome and any new blockers: ___
- Human follow-up needed: ___

**This record is evidence for human review, not permission to lift the NO-GO.**
Automated smoke counts belong in build evidence, not these human result cells.
