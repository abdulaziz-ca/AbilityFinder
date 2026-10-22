# AbilityFinder — next-phase plan (features & improvements)

Prepared 2026-10-22, after the redesign. Built from: 5 research agents covering ~45 websites (Canada, US, UK/AU/NZ,
accessibility/civic-tech, modern product UX), Codex's inside-out code and data audit, Codex's critique and sequencing
round, and a persona review (5 realistic users). Source files are in this folder.

## The one-line diagnosis
AbilityFinder is already ahead of every peer on **privacy, verification dates, honesty and bilingual Quebec content**.
Its biggest gap is that the journey **stops at "how to apply"**: nothing helps people after they submit, when they're
denied, when a benefit needs renewing, or when they're filling in the hard medical forms. Every strong peer
(GetCalFresh, Turn2us, Disability Alliance BC, MyFriendBen) invests there.

## Guardrails (apply to every item)
- Never say or imply "you qualify"; no personal dollar totals. Published ranges only, labelled as such.
- Nothing about a person leaves their device unless they choose (files/print, not cloud sync or share links).
- Every factual claim (deadline, wait time, renewal rule, appeal route) has a source link and verified date, and is
  hidden — not guessed — when unverified.
- No streaks, nagging, countdown pressure or default notifications (audience includes fatigue and cognitive disabilities).
- WCAG 2.2 AA, plus a short usability check with disabled users before calling a feature done (new gate, see M4).

---

## Phase 0 — Fix first (under 1 week)
Correctness and honesty problems the audit found in the current site.

| # | What | Why | Effort |
|---|---|---|---|
| 0.1 | **Derive the list of cities with local programs from the records** (it is hand-kept and only lists AB/BC/ON). Stop asking PEI residents for a city (PEI has no municipal records). | People in SK–QC and newer AB/BC cities get an extra generic "local supports / 211" card; the impact and partner pages undercount cities. | S |
| 0.2 | **Store the real "submitted on" date** in the tracker (asked when you choose Submitted); old entries show no calculated follow-up. | The calendar follow-up currently uses the day you download it as the submission date — a made-up fact. | S |
| 0.3 | **Make the home-page shortcuts honest**: resume at the first unanswered question; "Turning 18" supports ages 16–17; "Just moved" explains what changes. | They restart at question 1 and don't do what their names promise. | S |
| 0.4 | **"Suggest a fix" on every program and organization** (prefilled feedback with the record id; no answers sent) + a public corrections log. | The catalog is the highest-value, highest-risk asset; peers (Findhelp) crowdsource corrections. | S |
| 0.5 | **Coverage and privacy honesty cards**: "local coverage varies; no listing ≠ no support"; "what we can and cannot see" beside print/backup/AI. | Thin provinces (PEI 0 local, NS/NB/MB few) need saying; required before backup files. | S |
| 0.6 | **Check your answers** page before results, with Change links and a list of skipped questions; "Why we ask" under every question. | Proven GOV.UK pattern; catches mistakes that silently change results. | S |

## Phase 1 — After you apply (next ~4 weeks)

1. **Data rules first (M1, M):** a validator so any new structured field (renewal, wait time, deadline, appeal route)
   must carry a source URL and verified date; add a **program status** field (active / paused / closed / replaced) so
   expired programs stop appearing as normal results.
2. **My applications caseboard (B1, M):** the tracker becomes a dated timeline per program with **one next action**
   ("Call to confirm they received it", "Watch for a letter from…") and a "what happens next" card for Submitted/Waiting
   — wait times and contact routes only when published (with source). Includes a low-energy **"do just this next"**
   view (persona review: Dev, Maria).
3. **Renewals (B3, M, pilot):** structured renewal rules for a verified pilot set (DTC re-certification, AISH/ODSP
   reviews, RDSP grants, accessible parking permits), an "Upcoming" list, and .ics reminders with alarms — your own
   calendar does the reminding, no server. Programs without verified rules say "confirm with the program".
4. **Safety and clarity content (S each):**
   - **Scam / paid-consultant panel** (D3): applying is free; how contingency-fee DTC firms work; where to report fraud.
   - **Urgent-need link** before the questionnaire (E3): provincial emergency help, 211, crisis lines — a calm link, not a modal.
   - **Exit this page + clear my answers** (E4), and a **shared-computer mode** that keeps nothing after the tab closes
     (persona review: Lise's office computers, Gordon's daughter).
   - **Published amount ranges** (D2) from existing amount tables, labelled "published range, not your estimate".
5. **"I want to…" task entry** on the home page (E1): I got a denial letter · I need money this week · see everything
   without questions · I'm helping someone.
6. **One-question opt-in poll** (H2): "Did this show you a useful next step?" yes/no/skip — no answers attached.
7. **Faster results page** (I1): build each in-app guide only when opened.

## Phase 2 — Help with the hard parts (~2–3 months)

1. **Document helper (C4, L):** for common documents (Notice of Assessment, proof of address, SIN, medical forms):
   what counts, where to get it, and "if you don't have it, ask the program whether they accept…" (sourced).
   GetCalFresh found 17% of denials came from missing documents.
2. **Free-help ladder per program (F3, M):** reuse the 67-organization directory; show free helpers by province and
   topic, with channels (phone, TTY/relay, ASL/LSQ video, chat, in person) and what they can and can't do.
3. **Backup / move-to-another-device file (F4, M)** with optional passphrase encryption, plus a **phone-friendly
   one-page summary** (programs, status, phone numbers) a helper can read over the phone (persona: Gordon).
4. **"Working while on disability assistance" guide per province (narrow D1, M):** earnings exemptions, what to report,
   and how to return to assistance — from official pages, with a published worked example. Answers Aisha's worry
   without building a risky pair-by-pair calculator.
5. **Daily-limitations diary — DTC pilot (C1, M):** log real examples (what, how long, help needed) by T2201 category;
   export "notes for my practitioner". Your own notes, never suggested wording; reviewed by a practitioner and
   disability community members before launch.
6. **Content integrity (I3, M):** fingerprint official pages and flag real text changes next to the stale-age queue
   (link checks only catch broken links today). Then **tiered CI** (I5): fast checks on every change, the full
   three-browser suite before deploy.

## Phase 3 — Later (pilot when Phases 1–2 are stable)
Appeal mode with a letter builder (B2) · evidence pack and practitioner request letter (C2) · form companions that
mirror the paper forms (C3) · smarter optional questions such as household size and renter/owner (D5) · multi-person
profiles on one device (F2) · plain/Easy Read summaries tested with readers (G1) · simple mode, one question per screen
(G4) · translated printable sheets (G3) · Cmd/Ctrl-K search (E2) · offline app (G2) · catalog lazy rendering if
performance budgets fail (I2) · shared guide renderer (I4).

**Dropped:** encrypted share links (link-leak and server risk for a one-person service — files and print instead);
a big-bang rewrite of app.js (extract modules gradually while building features).

## How we'll know it's working (no personal data)
- Cookieless page views on the new pages (caseboard, Upcoming, document help, corrections).
- The opt-in yes/no poll; correction volume and time-to-fix.
- Share of catalog records with structured, sourced renewal/next-step data; stale-record count trending down.
- Small, consented usability sessions with disabled users per feature (task completion, reported in aggregate).
- Performance budgets (results/catalog responsiveness, initial download size).

## Decisions for the owner
1. Approve Phase 0 to start right after the redesign is fully signed off.
2. Renewal pilot set: DTC, AISH/ODSP reviews, RDSP, parking permits — or different programs?
3. The DTC diary pilot needs a practitioner and 2–3 disabled reviewers; do you have contacts, or should we ask partner
   organizations?
4. Shared-computer mode: should it be offered on the home page, or only from the accessibility menu?
