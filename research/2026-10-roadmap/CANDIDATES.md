# Candidate list — merged from 5 research reports (~45 sites) + Codex inside-out audit

Sources: research-canada.md, research-us.md, research-uk-au-nz.md, research-accessibility.md, research-product.md,
codex-inside-audit.md (same folder). IDs are for discussion.

## A. Fix first (correctness / honesty, found by the audit)
A1. Derive `CITIES_WITH_PROGRAMS` from the records (it lists only AB/BC/ON; SK–QC and newer AB/BC cities get the extra
    generic 211 card and the impact/partner "46 municipalities" count is understated). Also stop asking PEI residents
    for a city while PEI has no municipal records.
A2. Life-event shortcuts restart at question 1 even when answers are pre-filled; "Turning 18" sets age to exactly 18 and
    "Just moved" does nothing special.
A3. Calendar follow-up text uses the download date as the "submitted" date (submission dates are not stored).

## B. After you apply (biggest gap vs peers: the journey stops at "how to apply")
B1. Application caseboard / inbox: tracker records dates (submitted on…), shows one "Next action" per program and a
    dated timeline; Submitted/Waiting shows "what happens next" (calls, letters, missed-call advice) from official
    sources only. (GetCalFresh, Wise status timelines, GOV.UK task list)
B2. Denial → appeal mode: choosing Denied opens deadline, evidence advice, free help organizations, and an appeal /
    reconsideration letter builder (local only). Needs structured appeal data beyond DTC/CPP-D/AISH.
    (Disability Alliance BC help sheets, Citizens Advice, ODSP Action Coalition)
B3. Renewals: structured renewal/expiry fields per program → "Upcoming" list + .ics with alarms (RRULE/VALARM);
    calm return banner "2 tracked programs have updates / a renewal is coming". (MyFriendBen, Propel)

## C. Help people fill the hard forms (unique value; nobody in Canada does this well)
C1. Daily-limitations diary for the Disability Tax Credit (and later CPP-D/ODSP/AISH/PWD): log incidents, time taken,
    help needed, mapped to the T2201 categories; export "notes for my practitioner". Local only, clear-all button.
    (Turn2us PIP helper, Scope community advice, Citizens Advice PIP)
C2. Evidence pack + practitioner request letter: what good medical evidence looks like per program, a letter asking
    the practitioner for a form, a printable cover checklist. (NDIS evidence page, GetCalFresh document research)
C3. Form companions that mirror the paper form numbering (T2201 first; then ODSP, AISH, BC PWD, CPP-D) with "say it
    well" prompts (no copyable answers), form version + verified date. (Citizens Advice PIP Q1–15)
C4. Document helper: per document, examples of what counts and "if you don't have it" (ask the program, with source).
    GetCalFresh: 17% of denials were missing documents.

## D. Clarity before applying
D1. Benefit interaction check: "will this affect my other benefits?" for pairs the person already receives (clawbacks,
    exemptions) — each pair sourced and dated, hidden if unverified. Most common unmet worry in Canadian research.
    (Disability Without Poverty, GetCalFresh SSI pages)
D2. Published amount ranges shown as "published range, not your estimate" (existing amountTiers), no personal totals.
D3. Scam / paid-consultant safety panel: applying is free; how contingency-fee DTC firms work; anti-fraud links.
D4. Check-your-answers page before results (GOV.UK pattern) with Change links and a list of skipped questions;
    "Why we ask" under every question.
D5. Smarter optional questions: household size, renter/owner, drug/private insurance, current provincial assistance
    (audit: income has 3 bands and no household size though many rules use family-size tables).

## E. Find & navigate faster
E1. "I want to…" task entry on the home page (I got a denial letter; I need money this week; see everything without
    questions; I'm helping someone). (Alberta Supports, Canada.ca)
E2. Cmd/Ctrl-K and "/" search palette over programs, guides, organizations and actions, province-first ranking.
E3. Urgent-need banner before the questionnaire (provincial emergency help, 211, crisis lines). (NZ Work and Income)
E4. "Exit this page" button + one-tap clear answers for shared/unsafe devices. (GOV.UK)

## F. People who help (caregivers, caseworkers, family)
F1. Share with my helper: encrypted link (key in URL fragment, ciphertext in KV with 7-day expiry, revoke) or an
    answer-free printable / encrypted backup file. (Excalidraw E2EE, Single Stop staff tools)
F2. Local multi-person profiles on one device (caregiver managing a child and a parent). (audit)
F3. Free-help ladder per program: free human helpers by province and topic, channel (phone, TTY/relay, ASL/LSQ video,
    chat, in person), hours, and what they can/cannot do. Reuses the 67-organization directory.
F4. Backup / restore file (optionally passphrase-encrypted) to move devices without an account.

## G. Reach & inclusion
G1. Easy Read / plain summary card per program (top programs first), generated only from verified fields, tested
    with readers. (UK Easy Read, W3C COGA)
G2. Installable PWA with offline guides and a "data as of" banner. (web.dev)
G3. Translated printable sheets in 2 more languages (machine-assisted + native review). (DABC)
G4. Simple mode: one question per screen, bigger controls (CSS mode). (COGA)

## H. Trust & evidence
H1. "Suggest a fix" on every program/organization (prefilled feedback) + public corrections log. (Findhelp, PolicyEngine)
H2. Opt-in one-question outcome poll ("did this show you something new?") — anonymous, no answers sent.
H3. "What we can and cannot see" privacy card next to sharing, backup and AI features. (Proton)

## I. Efficiency (audit)
I1. Lazy inline guides on results (build only when expanded); I2. Catalog: lazy rendering of the 463 cards;
I3. Source-change detection (fingerprint official page text, flag diffs beside stale age);
I4. Shared guide view-model for app + static pages; I5. Tiered CI (fast PR gate, full matrix before deploy);
I6. Split app.js into modules (routing, matching, guides, catalog) without a framework.
