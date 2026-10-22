# Persona review of candidate features (2026-10-22)

Based on BRIEF.md and CANDIDATES.md. The live site was not fetched; the brief was treated as the description of current behaviour.

## 1. Maria, 41, Ontario, parent of an autistic 8-year-old
Situation: She uses her phone at night after the child is asleep. She has maybe 20 minutes, spotty attention, and a pile of forms (Disability Tax Credit, ODSP, Ontario Autism Program, Special Services at Home). She mostly wants to know what she is missing and what to do next, then pick the thread up again days later. She often loses her place between sessions. Her husband helps on weekends.
Help most: B1 (next action per program), C2 (evidence pack and practitioner letter), C1 (diary, for DTC for her son), C4 (document helper), E1 ("I want to..." entry, e.g. "I got a denial letter").
Confuse/burden/worry: D5 (more questions at 11pm), F1 (an encrypted link feels risky, sharing a child's health data), C3 (long form companions on a phone), E2 (keyboard palette, irrelevant on mobile).

## 2. Dev, 29, Alberta, ME/CFS with brain fog, on AISH application
Situation: He has a few good-energy hours a week. He reads slowly and loses his place. He is mid-application and needs to track what is done, what is waiting, and what the next single step is. He needs the AISH medical report and daily-living evidence, which he struggles to describe on bad days. He may abandon any long flow.
Help most: B1, C1 (diary he can fill in 30 seconds on bad days, so evidence reflects worst days), G4 (simple mode), G1 (Easy Read cards), D4 ("why we ask" and check-your-answers).
Burden: C3 (long form companions), D5, B2 and the long guide pages unless collapsed, any feature that creates a daily obligation (diary nagging, reminders), E2.

## 3. Lise, 58, Quebec, French-speaking settlement worker, ~30 clients a month, shared office computers
Situation: She screens newcomers and disabled clients one after another on a shared desktop, often with the client beside her. She needs a fast reset between clients, no leftover data, French throughout, and printable sheets she can hand over. Newcomers may be unsure of residency and citizenship rules and often prefer other languages. She cares that she is never exposing one client's health details to the next.
Help most: E4 (clear answers, exit), F3 (free-help ladder with channels and languages), G3 (translated printables), E1 (the "I'm helping someone" door), F2 only if it is strictly per-session (see risks).
Worry: F2 (profiles of 30 clients stored on a shared machine), F4 backup files (health data left in Downloads), F1 links, C1 diary stored locally, B1 and B3 tracking (persistent client data on a shared browser), H2.

## 4. Gordon, 72, Nova Scotia, low vision, large-text Android; daughter helps from Calgary
Situation: He browses with system font scaling at maximum and zoom. He prefers short, linear screens and phone calls. His daughter does the research and wants to see what he has answered, then phone him through the next step. Typing is slow. He may not use the camera or a QR scanner confidently.
Help most: G4 (simple mode, large controls), F1 (daughter sees his answers) or F4 as a fallback, E1, G2 (installable, offline), F3 (phone-first help with hours).
Confuse/worry: E2 (palette), a dense B1 timeline, the tracker with many statuses, long encrypted URLs that are hard to read out over the phone, D2 numbers he may read as a promise.

## 5. Aisha, 23, BC, wheelchair user starting her first job
Situation: She receives BC PWD assistance and fears an earnings cut or losing health coverage (medical, extended health, bus pass). She wants the exemption amounts, how reporting works, and what happens if the job ends. She reads the websites and is comfortable with tools. The "what if my situation changes" panel is her entry point.
Help most: D1 (benefit interaction check), D2 (published ranges, if clearly labelled), B3 (reporting and renewal dates), D3 (scam and paid-consultant safety), H1 (suggest a fix when the exemption rule is out of date).
Worry: D2 if it looks like a personal estimate, D5, anything that implies she should not tell the ministry, F2.

## (a) Top 8 by people helped times depth
1. B1 Application caseboard / next action: all five are mid-journey and the journey currently stops at "how to apply".
2. E4 Exit and one-tap clear: critical on shared devices (Lise) and good hygiene for everyone with health data.
3. D1 Benefit interaction check: Aisha's central need and a top unmet worry for the others.
4. C1 Limitations diary: highest-value evidence help for Maria and Dev (and DTC for Gordon's daughter), but needs low effort.
5. G4 Simple mode: serves Dev, Gordon, and Maria late at night with the same switch.
6. E1 "I want to..." task entry: shortens the path for helpers, the denied, and the urgent.
7. C2 Evidence pack and practitioner letter: the real bottleneck for most medical forms.
8. F3 Free-help ladder: Lise, Gordon, and anyone who is stuck; reuses data that already exists.
Close next: C4, F4, G1, A1 (cheap correctness).

## (b) Risks and safeguards
- F2 local profiles: a shared machine now holds many clients' health data. Safeguard: off by default, hidden unless a "shared computer" mode is chosen; per-profile PIN-free "forget" button; auto-expiring session profiles; never list profile names on the home screen.
- F1 share link and F4 backup: sensitive data in Downloads or in a chat thread. Safeguard: show the "what we can and cannot see" card (H3) first; expiry and revoke visible; a file name with no personal detail; a reminder to delete; passphrase prompt defaults on.
- C1 diary, B1 tracker, B3 renewals: persistent notes on a shared device, and a pull to return daily. Safeguard: a "this stays in this browser" line at first use, a clear-all button, no streaks or nag notifications, and reminders only by explicit opt-in.
- D1 and D2: false reassurance, e.g. "no effect on your benefits" when rules are individual. Safeguard: show only sourced and dated pairs, hide when unverified, wording "published rule, confirm with your worker", no totals, and a link to the official calculator.
- D5: more questions means more fatigue. Safeguard: all optional, one per screen, under "refine results", skip by default.
- G1: simplified text may drop a condition. Safeguard: generate from verified fields only, include an "official wording" link and a verified date.
- H2: even an anonymous poll can feel like tracking. Safeguard: opt-in, one tap, no answers attached, and skip on shared-device mode.
- E3 urgent banner: must not push crisis lines on people who did not ask. Safeguard: a small, dismissible link, not a modal.

## (c) Gaps none of the candidates cover
1. Shared-computer mode, a single switch at the start ("I'm helping someone / this is a shared computer") that disables local persistence, auto-clears on idle, and removes profile and backup features. Lise's main need, and it changes how E4 and F2 should behave.
2. Low-energy save-and-resume: a "save my place" line at every step, a three-item "do just this next" view, and fatigue-aware pacing (Dev, Maria, Gordon). B1 gives next actions but not a resume-in-30-seconds path.
3. Phone-and-voice friendly handoff: a short readable code or a printed one-page "what I told the site" summary the daughter or worker can read over the phone without a long URL (Gordon, Maria's spouse), with a callable-help number for each program.
4. Working-while-on-benefits guide (Aisha): income exemption, reporting steps, "trial work" and return-to-benefit rules per province, with a worked example of the published rule. Distinct from D1 because it is about earnings, not benefit pairs.
