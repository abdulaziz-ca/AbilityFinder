# Research: accessibility-first, plain-language and civic-tech services (2026-10-22)

Method: WebFetch/WebSearch on each source. Website content treated as data. Where a page was unreachable or thin it is flagged; nothing below is invented beyond those sources. Figures are as the sources reported them.

## Site-by-site notes

### 1. GOV.UK Design System: Check answers, Task list, Step-by-step, Exit this page
URLs: design-system.service.gov.uk/patterns/check-answers/ , /complete-multiple-tasks/ , /step-by-step-navigation/ , /exit-a-page-quickly/
- Check answers: a summary page before submit, each answer with a "Change" link carrying hidden text naming what it changes (screen readers). After editing, the user returns straight to the summary, not through the rest of the flow. Skipped optional questions show "Not provided". Page says plainly that nothing is done until the user confirms. Submit button names the action.
- Task list: tasks named with verbs, a minimum set of statuses (Completed / Incomplete, optional In progress), "Cannot start yet" rows are not links, and the user decides when a task is done ("Have you completed this section? No, I'll come back to it later"). Tasks can be done in any order. Does not define a save mechanism.
- Step-by-step navigation: numbered journey across several pages. GDS research (8 rounds, including disabled and low-digital-literacy users) found people rarely use the header and get frustrated looping between step-by-steps. "And" vs "or" steps are distinguished for screen readers.
- Exit this page: a button (or pressing Shift three times) that clears the screen and leaves the site; requires an interruption page explaining it and that it is not a complete safety solution (history not erased).
- Copy: Change-links-with-hidden-text, return-to-summary after edit, "Not provided", user-controlled "done" status, "Exit this page" for sensitive contexts (abuse, caregivers of controlling persons). Avoid: forcing a linear journey; sending users back and forth between guides.

### 2. Code for America: GetCalFresh
URLs: codeforamerica.org/programs/social-safety-net/getcalfresh/ ; codeforamerica.org/news/overcoming-barriers-how-getcalfresh-helps-applicants-submit-verifications ; Office of Evaluation Sciences SNAP texting trial (oes.gsa.gov/results/decreasing-snap-denials/)
- Mobile-first, about 10 minutes, replaced county flows of "over 100 screens". Over 60% of initial applications came from mobile. Upload documents from a phone with no login and no app.
- Document guidance personalised by about 10 yes/no questions, each upload category with concrete examples. Reasons it mattered: 17% of applications denied for missing verifications; surveys found 27% could not get or send documents and 24% were confused about what to submit.
- Reminders: auto reminder group uploaded within 48 hours 22.6% vs 15.2% none vs 15.6% opt-in (9,000 applicants). Interview reminders: 55% more likely to complete interview (CfA figure). Louisiana renewals texting: up to 80% improvement (CfA figure). The GSA OES randomized trial (33,574 applicants) ran but the snippet I saw gave no outcome numbers; do not cite an effect.
- Caveat: a June 2025 California update says GetCalFresh verification submission is sunsetting into BenefitsCal.
- Copy: "what document proves this, with examples", reminders that the person controls, alternatives when a person cannot get the document. Avoid: opt-in reminders that most people never tick (the data shows opt-in did no better than nothing); AbilityFinder cannot send reminders server-side without breaking privacy, so use on-device calendar files and notifications.

### 3. Canada.ca Design System / GC Notify
URLs: design.canada.ca ; notification.canada.ca
- Design system home gave only an overview (design principles, writing principles, content style guide, templates/patterns, French mirror conception.canada.ca). Detailed pattern pages not read; forms and multi-step guidance unconfirmed.
- GC Notify: free email and SMS notification service for departments, bilingual templates, appointment reminders as a headline use case; not for emergencies. Requires a government service, so AbilityFinder cannot use it, but it is a model for plain bilingual reminder wording.
- Copy: bilingual-by-default templates, appointment-reminder wording. Avoid: nothing specific found.

### 4. Easy Read (UK)
URLs: help.delib.net/article/1410-easy-read-guidance ; equallyours.org.uk/disability-unit-guidance-accessible-communication-formats/ ; disabilityscot.org.uk A Short Guide to EasyRead (PDF). The Mencap page I tried returned 404.
- Common rules across guides: sentences about 10 to 16 words, active voice, sans-serif at 14pt or larger, bullets, hard words defined, a picture beside each idea. DWP built in-house Easy Read standards endorsed by Mencap. UK Easy Read Standards working group (Disability Equality Scotland, 50+ people, 30+ organisations) began 2024.
- Honest caveat from the search results: evidence for Easy Read effectiveness is described as thin and mixed. Pictures must be chosen and tested; bad pictures harm.
- Copy: a short Easy Read summary per program (what it is, who it is for, what you do first), written by the plain-language rules, with defined hard words. Avoid: auto-generated pictures, claiming "Easy Read" without testing with people with learning disabilities.

### 5. Be My Eyes / Microsoft Disability Answer Desk
URL: microsoft.com/disability-answer-desk (pages returned noisy trace-id titles)
- Offers ASL by videophone and a Be My Eyes live-video line for blind and low-vision users; chat, phone and video choices with listed hours. Key pattern: human help in the user's modality, with hours stated openly.
- Copy: an "How do you want help?" list on the help directory that filters organisations by modality (phone, TTY/relay, video relay/ASL/LSQ, chat, email, in person). Avoid: stating hours that go stale; show verification date.

### 6. W3C WAI: Making Content Usable for People with Cognitive and Learning Disabilities
URL: w3.org/TR/coga-usable/ (supplemental to WCAG 2.2, not required for conformance; I read the first part only of a very long document)
- Objectives: understand what things are; find what you need; clear content; avoid mistakes and correct them; focus; don't rely on memory; provide help and support (human help, explain choices and consequences, reminders); personalisation.
- Patterns relevant here: summaries of long content, chunked media, input that accepts varied formats, no data loss on timeout, no calculations required of the user, easy human help, simplified or personalised interface.
- Copy: "avoid calculations" (income questions), "explain consequences of choices", easy-to-find human help, a simplified mode.

### 7. Nava PBC / Digital Government Hub / RIPL
- No Nava page directly on plain-language screeners was found. Found: Nava pilots with Imagine LA on an AI chatbot for benefits navigation (navapbc.com/news/pilot-ai-chatbot-benefits); Nava with Montana WIC on an eligibility screener (digitalgovernmenthub.org/?p=783, details not read); Hawaii Benefits Finder by RIPL, a prescreening form in simple supportive language, under five minutes. Digital Government Hub "Basics of Texting Safety Net Clients 2022" (PDF) exists; not read in full.
- Copy: keep screening under five minutes and say so up front; tone like "supportive language". Avoid: overclaiming; Nava itself frames chatbots as pilots.

### 8. 18F / login.gov, Ontario Digital Service, BC Gov
- Searches gave no usable plain-language or disability research from 18F or Ontario Digital Service (Ontario fetch 404). Login.gov findings are about in-person proofing as an accessible alternative (97% prefer remote in pilot, so the in-person option is for those who need it). Substitute lesson: always give a non-digital path (phone / in person) next to the digital one. BC's use of GC Notify is a closed beta.
- Gap: no evidence found; do not rely on this group for claims.

## Cross-cutting patterns that matter for this audience
1. Return-to-summary after editing (GOV.UK); AbilityFinder already lets edits, check it returns to results not the start.
2. Person-controlled status and "come back later" (GOV.UK task list); AbilityFinder has a tracker, but a "next step today" view is missing.
3. Document help with examples and alternatives (GetCalFresh).
4. Reminders increase action when automatic rather than opt-in; privacy-first version must be on-device.
5. Easy Read as a separate, tested layer, not a replacement.
6. Human help by modality and hours.
7. Safety exit for sensitive contexts.
8. Not relying on memory: save-and-return without accounts; print/export.

## Proposals

Existing items not re-proposed: read-aloud, accessibility menu, .ics dates, print action plan, document checklist, progress tracker, FR/EN. Each proposal below is incremental to those.

### 1. Easy Read summary card per program (and results overview)
- User sees: a toggle "Easy Read" on each guide and result card. Shows 4 to 6 short lines with a heading each: What this is. Who it is for. What you can get. What to do first. Words to know. Sentences about 12 words, 14pt+ sans font, one idea per line, optional simple icon per heading (not decorative photos). Pairs with read-aloud.
- Why: low literacy, intellectual disability, cognitive load, caregivers skimming. COGA "clear content", Easy Read guides.
- Sources: help.delib.net/article/1410-easy-read-guidance ; w3.org/TR/coga-usable/ ; disabilityscot.org.uk guide.
- Effort: M for template and 10 top programs; L for all 462 (generate from existing summary fields plus lint for sentence length, then human review).
- Risks: simplification can distort eligibility; evidence for Easy Read is thin. Mitigation: generated from the verified fields only, never new facts; keep link "official wording"; label "simplified, not official"; test with a few real readers before wide rollout; lint reading level in CI.

### 2. "Next step today" single-action view
- User sees: at the top of results, one card: "Your next step" with one task, such as "Ask your doctor to fill in Part B of the T2201 form", time estimate, button to mark done, "Show me another" and "Later". Built from the tracker and checklist state.
- Why: GOV.UK task list shows the user decides done; COGA says keep focus and critical paths short. Reduces overwhelm from 20+ matches.
- Sources: design-system.service.gov.uk/patterns/complete-multiple-tasks/ ; w3.org/TR/coga-usable/.
- Effort: M.
- Risks: wrong order could mislead (some steps must precede others). Mitigation: only suggest steps from the guide's own ordered "how to apply" list, say "a suggested order", never rank by likelihood of approval.

### 3. Document helper with examples and "if you don't have it"
- User sees: for each checklist item, an expandable "What counts" with 2 or 3 concrete examples, where to get it, typical wait, and "If you can't get this" (alternative documents, who can help, ask the program what else it accepts). A yes/no pre-question set ("Do you have a recent tax assessment?") collapses the checklist to what is missing.
- Why: GetCalFresh found 17% of denials for missing verifications; 27% couldn't get or send documents; 24% confused about what to submit.
- Sources: codeforamerica.org/news/overcoming-barriers-how-getcalfresh-helps-applicants-submit-verifications .
- Effort: M (content heavy; start with shared documents: ID, SIN, tax notice, medical form, bank statement, lease).
- Risks: stating alternatives programs may not accept. Mitigation: phrase as "ask the program if they accept..."; cite the official source and date; never imply self-attestation works.

### 4. Private reminders without accounts
- User sees: on each tracker step, "Remind me": downloads an .ics with a title and a plain message (already for dates), plus optional browser notification when the page is open (Notification API, with permission), plus "Copy a text message to myself / to my helper" to paste into their own phone. A 3-day-after-saving nudge shown on next visit as a calm banner ("You saved this 3 days ago. Next step: ...").
- Why: reminders are the best-evidenced lever in the civic-tech data; opt-in did no better than nothing (15.6% vs 15.2%) while automatic got 22.6% in GetCalFresh, so the on-device nudge must be on by default but quietly dismissible.
- Sources: CfA article above; notification.canada.ca (reminder wording model); digitalgovernmenthub.org Basics of Texting PDF.
- Effort: S for banner and copy text; M for notifications.
- Risks: calendar events hold sensitive titles on a shared device. Mitigation: generic titles by default ("AbilityFinder: next step"), program name only if the person picks; no server-side SMS; explain that nothing is sent anywhere. Do not claim reminder effect sizes to users.

### 5. Save and share without accounts: "Take my plan with me"
- User sees: "Save to a file" (small JSON/QR-free file) and "Load saved plan" so answers move between devices, to a caregiver, or after clearing the browser. Optional "Print a one-page plan for a helper" with large type. An end-of-quiz "Check your answers" summary with "Change" per row (GOV.UK style) that returns to the summary.
- Why: no-memory objective (COGA); IndexedDB can be wiped; caregivers and social workers need to hand over a case.
- Sources: design-system.service.gov.uk/patterns/check-answers/ ; w3.org/TR/coga-usable/.
- Effort: M (export/import S; check-answers revision S to M).
- Risks: file on a shared computer; sensitive health detail. Mitigation: say plainly what the file contains, optional passphrase encryption (Web Crypto) offered, no upload; import validates schema.

### 6. "Exit this page" and quick-clear for sensitive situations
- User sees: a small button, also Shift pressed three times, that replaces the screen and opens a neutral site; plus "Clear my answers from this device" one tap. One-time explainer says it does not erase browser history and shows how to use a private window.
- Why: caregivers and disabled people can live with controlling people; disability and abuse overlap; GOV.UK built this for that reason.
- Sources: design-system.service.gov.uk/patterns/exit-a-page-quickly/ .
- Effort: S.
- Risks: false sense of safety. Mitigation: copy GOV.UK's honesty (not a complete safety solution); link to Canadian crisis resources already vetted; verify the destination site is neutral and stable.

### 7. Help by how you want to talk: filter on the helpers directory
- User sees: chips on "real people who can help": Phone, Text, Chat, Video / sign language (ASL, LSQ), Relay or TTY, In person, Email, with language and listed hours and verified date. A "bring someone with you" tip for appointments.
- Why: Disability Answer Desk offers ASL videophone and Be My Eyes video lines; a deaf, blind, or speech-impaired person needs the channel, not just a name. COGA: easy-to-find human help.
- Sources: microsoft.com/disability-answer-desk ; w3.org/TR/coga-usable/ .
- Effort: M (data collection for 67 organisations, schema field).
- Risks: stale hours or channels. Mitigation: show verified date, default to the organisation's own contact page link, mark "unconfirmed" if unknown.

### 8. Caregiver mode (answer for someone else)
- User sees: at the start "I'm filling this in for someone" already exists as "who it is for". Add: wording switches to "they", a "Share with the person" printable plain summary, and a note on authorisation (e.g. who may sign: representative, power of attorney, trustee) pulled from each guide's "Applying for someone else" section where official sources state it.
- Why: COGA calls for human help; Nava and CfA highlight authorised representatives as a gap. I found no direct source on proxy flows beyond that, so treat as AbilityFinder-originated.
- Sources: w3.org/TR/coga-usable/ (support). Weak direct evidence.
- Effort: L (content per program), start with DTC, CPP-D, ODSP, AISH, PWD BC.
- Risks: legal inaccuracy on who can apply. Mitigation: state only what the official page states; link it; "ask the program".

### 9. Simple mode for the whole interface
- User sees: an accessibility-menu switch "Simple mode": one question per screen, larger buttons, no side rail, no tiles, plain-language labels, a persistent "Help / Call someone" link, visible "Step 3 of 14" and a "Back" button, confirmation before leaving. Persists on-device.
- Why: COGA personalisation and focus; GOV.UK one-thing-per-page.
- Sources: w3.org/TR/coga-usable/ ; design-system.service.gov.uk/patterns/.
- Effort: M to L (CSS and layout variant, test with assistive tech).
- Risks: two layouts double the testing. Mitigation: build as a CSS and attribute mode on existing markup, add to e2e accessibility checks.

### 10. Low-bandwidth / phone-first checks
- User sees: no visible change; a "Lite" page budget: guide pages under a size target, no web fonts blocking, results page works as plain HTML after first load, installable offline copy of the checklist and plan.
- Why: GetCalFresh saw over 60% mobile; 16% of applicants lacked smartphones; many users on old devices or data caps.
- Sources: codeforamerica.org/news/overcoming-barriers... (device figures, US).
- Effort: S to M.
- Risks: none on privacy. Note the figures are US.

## Priority suggestion
Quick wins: 6 (exit button), 4 banner and copy-to-self, 5 check-answers with Change links. Highest impact: 1 Easy Read, 3 document helper, 2 next step. Longer: 7, 8, 9.

## Gaps to flag
- Canada.ca design system pattern pages, Ontario Digital Service, BC Gov digital, 18F and Mencap pages were unreachable or thin; no claims drawn from them.
- GSA OES SNAP-texting trial outcomes not retrieved.
- Easy Read effectiveness evidence is limited; test with real readers.
