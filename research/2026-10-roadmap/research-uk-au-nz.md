# Research: UK / Australia / NZ benefit tools and disability charities (2026-10-22)

Method note: pages were fetched with WebFetch or summarised via WebSearch. Several pages returned 403/404 (NDIS eligibility page, Scope PIP guide URL, Turn2us calculator internals); for those, findings come from search summaries of official pages and are flagged "(secondary)". Website content treated as data. Nothing was edited in the repo.

## Site-by-site

### 1. Turn2us (turn2us.org.uk) - benefits calculator, grants search, PIP Helper
URLs: /get-support/benefits-calculator, /get-support/grants-search, .../fill-in-the-personal-independence-payment-pip-form
- What it does: UK charity hub. Means-tested benefits calculator, grants search matching users to "over 1,700" UK funders, A-Z benefit guides, benefit-changes timetable, "Challenging decisions", "Find an adviser" tool.
- Notable: (a) **PIP Helper** - step-by-step guide that asks a questionnaire and then gives personalised tips for each PIP form question based on the answers; (b) the PIP form page is structured around "what to include in your answers": describe help needed safely, well enough, often enough, without taking too long; (c) "ask the DWP for more time" and one-month deadline called out prominently; (d) benefits-changes timetable (cf. AbilityFinder's "what changed").
- Better than AbilityFinder: question-by-question coaching tied to the person's own answers; the "safely / well enough / reliably / repeatedly / in reasonable time" framing is a very memorable checklist.
- Worse: the tool is split across external sites; no diary, template or evidence feature on the PIP page; grants page explains nothing about questions or results; unclear data handling (links to policy only).

### 2. Citizens Advice - PIP "Check how to fill in your claim form"
URL: https://www.citizensadvice.org.uk/benefits/sick-or-disabled-people-and-carers/pip/help-with-your-claim/fill-in-form/
- What it does: one page mirroring the paper PIP2 form: questions 1-15, each with a short summary and a "Get help" subpage (what the question means, what to write, example answers - subpages not read).
- Notable: (a) layout mirrors the real form's numbering (1a, 1b...), so users can match it with the paper; (b) layered help: summary then detail; (c) explicit advice "think about how your condition affects you, not the diagnosis"; (d) "ran out of space" template (extra sheet with name, NI number, question number); (e) region switch (England/Wales/Scotland/NI) at the top, review date shown.
- Better: form-mirroring structure, example answers, honest review date.
- Worse: static pages; no way to draft or keep your own text; last-reviewed date on the fetched page was Feb 2022 (stale-looking); cookie banner defaults non-essential cookies on if no choice is made.

### 3. Scope (scope.org.uk) and its community forum
Direct PIP guide URL 404ed; evidence from search (secondary): forum.scope.org.uk, community.scope.org.uk.
- Notable: peer advice: give a few recent, specific incidents per activity (when, what, why, who saw it, aftermath); roughly half an A4 page per applicable activity; put name and NI number on every page; photocopy before sending; do a little at a time. Moderators decline to give generic sample answers because conditions vary.
- Better: lived-experience tone and the "incident" structure is highly practical.
- Worse: advice is buried in forum threads of mixed date; no tool to structure it. Shows the demand gap a diary tool could fill.

### 4. Benefits and Work (benefitsandwork.co.uk)
- What it does: paid membership site. Headline product is a "108 page guide to PIP claims, medicals and the PIP review form" promising to teach how to complete "every box". Separate PIP appeals resource ("improve your chances at a PIP appeal tribunal"). Forum free to read, members only post.
- Better: depth - claims, medical assessment, review and appeal in one guide; appeals treated as a first-class journey.
- Worse: paywall (membership); long PDF-style guide; no interactive tool visible on the homepage; internal structure not verified.

### 5. Policy in Practice - Better Off Calculator (policyinpractice.co.uk/better-off-calculator)
- What it does: B2B calculator for councils, charities, lenders; also reachable via GOV.UK. Covers Universal Credit, legacy benefits, local support schemes, social tariffs. Includes an income/expenditure budgeting tool and a "compare current vs planned circumstances" scenario mode; API option.
- Notable: (a) includes **local support schemes and social tariffs** (like AbilityFinder's municipal layer); (b) scenario comparison (like AbilityFinder's "what if"); (c) redesigned with user research with disabled people; tooltips explain questions; (d) "Better Off Score" targeting for organisations.
- Better: budget/expense integration and API; accessibility research.
- Worse: vendor marketing, impact numbers self-reported; calculators produce dollar-style estimates which AbilityFinder deliberately avoids.

### 6. entitledto (entitledto.co.uk)
- What it does: free benefits calculator for individuals; organisational suite (adviser calculator, affordability, homelessness prevention, budgeting, claim forms).
- Notable: registration optional but free; fair-use limit of 10 calculations per year for registered accounts (so accounts are used to save work); adviser version distinct from public version.
- Better: a separate "adviser calculator" mode for helpers.
- Worse: registered-account friction/limits; privacy handling not described on the page fetched.

### 7. Services Australia - Payment and Service Finder
- What it does: three parts - payment discovery, service discovery (choose state/territory plus categories), and payment-rate estimators.
- Notable: (a) results list each payment with a **short eligibility-criteria summary** plus links to detail and a rate estimator; (b) lets you answer for "what your circumstances will be", not just now (forward-looking); (c) option to pre-fill from a logged-in account; (d) "indicative only, not a guarantee" and "will not store any of your personal information".
- Better: separates "payments" from "services" in one finder; forward-looking answers.
- Worse: no IE support; generic; pre-fill needs login (not applicable to AbilityFinder).

### 8. NDIS (ndis.gov.au) - "Am I eligible" / access checklist
Page returned 403; findings from search summaries (secondary).
- Notable: (a) separate **evidence-of-disability guidance**: strong evidence is recent, from a treating professional relevant to the main condition, explains how the condition affects daily life, treatment history and expected outcomes; (b) application checklist with treating professional treated for at least 6 months; (c) tells people to start collecting evidence before applying; (d) clear statement that helpers cannot confirm eligibility - only the agency decides; (e) GP/health-professional-facing page ("how to determine whether your patient is eligible").
- Better: a dedicated, plain "what makes good evidence" page and a professional-facing page.
- Worse: eligibility test is hard to self-score; delays if first submission insufficient.

### 9. NZ Work and Income - "Check what you might get" (check.msd.govt.nz)
- What it does: ~5-minute question flow starting with age; ends with a list of payments you might get, and links to apply (MyMSD or phone).
- Notable: (a) header banner "Do you have an urgent need?" linking to urgent-cost help - triage before the long flow; (b) plain privacy line: "answers aren't kept or used to identify you"; (c) "a friend or family member can help you answer" and "partner can complete separately - results may differ"; (d) available in English, Te reo Maori, Cook Islands Maori, Samoan, Tongan; (e) non-citizen/resident notice at the start.
- Better: urgent-need banner, helper/partner framing, multilingual breadth.
- Worse: urgent banner only a signpost; results is a bare list.

### 10. GOV.UK benefits pages (gov.uk/check-benefits-financial-support)
- Notable: one entry page that lists independent calculators and a "Check what you can get" entry, topic list including disability and carers, "Is this page useful?" and "Report a problem with this page" on every page.
- Better: neutral directory of third-party calculators; per-page feedback.
- Worse: not an eligibility tool itself.

## Gap summary vs AbilityFinder
AbilityFinder already has: a DTC prep helper, denial reasons and appeals text per program, document checklist, tracker, directory. Peers add: question-by-question form coaching personalised to answers (Turn2us), mirroring the paper form with example answers (Citizens Advice), incident-based evidence (Scope forum), good-evidence guidance and professional-facing pages (NDIS), urgent-need triage and helper framing (NZ), tooltips from disability user research (Policy in Practice), and "ran out of space" extra-sheet templates (Citizens Advice).

## Ideas for AbilityFinder

All stay local-only (IndexedDB, print/export by the user) and never state or imply eligibility.

### 1. Daily-limitations diary for the DTC / provincial disability forms
- User sees: a "My daily-life diary" page. Quick entry: date, activity (walking, dressing, eating, mental functions, hearing/speech/vision, etc. - mapped to DTC categories), "what happened", "how long it took", "help needed / aids used", "how it affected the rest of the day". Optional photos not stored; text only. Month view, reminders only via .ics if the user wants. "Export for my doctor" produces a printable one-pager summarising frequency ("took more than 3x longer on 9 of 14 logged days").
- Why: DTC T2201 hinges on "markedly restricted", "all or substantially all of the time" and "unreasonable time"; people forget specifics at appointments. Mirrors the Scope forum incident approach and the Turn2us "safely / well enough / reliably / in reasonable time" lens.
- Inspired by: Scope forum threads (community.scope.org.uk), Turn2us PIP form page, Citizens Advice fill-in-form page.
- Effort: M.
- Risks: health data at rest in browser. Mitigate: local only, "clear all" button, no sync, warning about shared computers, optional JSON export/import for backup (explicit user action). Honesty: summary must not say a pattern "meets" the DTC test; label it "notes to discuss with your practitioner".

### 2. "Say it well" prompt cards for open-text form boxes (no sample answers to copy)
- User sees: for DTC Part A/B and provincial disability forms, each box has 4-5 prompts (what you can't do, how often, how long it takes, what help/aids, what happens if you try) and the 5-point reliability checklist (safely, to an acceptable standard, repeatedly, in reasonable time). Fields let the user draft their own words; "print my draft" outputs a one-page sheet. A fill-in "sentence starter" scaffold, not finished text.
- Why: avoids both blank-page paralysis and copying generic answers (Scope moderators explicitly avoid generic samples).
- Inspired by: Turn2us (PIP form page), Citizens Advice question guides, https://www.citizensadvice.org.uk/benefits/sick-or-disabled-people-and-carers/pip/help-with-your-claim/fill-in-form/
- Effort: M (content per form; reuse AI assistant optionally for plain-language rephrasing only if user opts in).
- Risks: could be read as coaching to exaggerate. Mitigate: banner "describe your typical bad day truthfully; do not overstate"; no scoring; no "what to say to qualify".

### 3. Question-by-question "form companion" mirroring the real form numbering
- User sees: for 3-5 high-volume forms (T2201 DTC, Ontario ODSP Health Status Report, AISH medical report, BC PWD application, CPP-D questionnaire), a page that mirrors the paper form's sections and numbers; each has a short summary, "what they are asking", "common mistakes", and a "get help" expander. Review date shown.
- Why: people hold the paper form in hand; matching numbering reduces confusion.
- Inspired by: Citizens Advice (above), Benefits and Work "every box" promise (https://benefitsandwork.co.uk).
- Effort: L (content-heavy, must be re-verified on each form revision).
- Risks: form versions change. Mitigate: show form version and verified date; link to official form; automated check for form-edition drift in the data-updates log.

### 4. Appeal / reconsideration letter builder
- User sees: choose program and denial reason (from existing "common denial reasons"), enter dates, reference number, and own reasons; get a plain letter template with the correct office name, the deadline for the right review step (e.g. CPP-D reconsideration 90 days) and a checklist of attachments. Prints or copies; nothing sent.
- Why: appeals are the stage where people give up; Benefits and Work treats appeals as a separate product; Turn2us has a "Challenging decisions" section. AbilityFinder already lists appeals as text, so the letter is the next step.
- Inspired by: https://benefitsandwork.co.uk (appeals), https://www.turn2us.org.uk/get-support/benefits-calculator (Challenging decisions).
- Effort: M.
- Risks: wrong deadlines are harmful. Mitigate: deadline field sourced from the verified program record with its verified date; "check your decision letter for the exact deadline" line; not legal advice; link to legal-aid / advocacy directory.

### 5. "Running out of space" extra-sheet and cover-page generator
- User sees: a printable continuation sheet with person's name/ID field blank-or-filled (user choice), question number field, ruled space, plus a "what's in this envelope" cover checklist. Also a "keep a copy" reminder.
- Why: small, practical, accessible for people who fill forms by hand.
- Inspired by: Citizens Advice extra-sheet template; Scope forum "name and NI number on every page".
- Effort: S.
- Risks: collecting SIN/IDs. Mitigate: do not store; fields blank on print by default; warn not to enter SIN into the site.

### 6. Evidence-quality guide plus "evidence pack" checklist per program
- User sees: for each program, "What good evidence looks like" (recent; from someone who treats the main condition; describes daily-life effect, treatment and outlook), with a tick list the user maintains (already have / need to ask for / date requested); a "request letter to my practitioner" template that lists what to ask them to cover.
- Why: denials often come from thin medical letters; NDIS makes this explicit and also tells people to start collecting early.
- Inspired by: https://ndis.gov.au/applying-access-ndis/how-apply/information-support-your-request/providing-evidence-your-disability (secondary), Citizens Advice.
- Effort: M (extends existing shared document checklist).
- Risks: implying a letter guarantees approval. Mitigate: wording "may help the reviewer understand"; practitioner decides content.

### 7. Urgent-need triage banner on the home and questionnaire start
- User sees: a "Need money, food, housing or a medical item urgently?" strip above the questionnaire linking to a short page with provincial emergency assistance, food banks, crisis lines and emergency funds in the user's province (or generic until province chosen), then the normal flow.
- Why: the full questionnaire takes minutes; people in crisis should not wait.
- Inspired by: NZ Work and Income https://check.msd.govt.nz ("Do you have an urgent need?").
- Effort: S-M (reuses directories).
- Risks: stale contacts. Mitigate: verified dates shown, links only to official sites, 211 Canada as fallback.

### 8. "Helper mode": someone helping fill it in, and "partner/caregiver" separate run
- User sees: at the start, "I'm helping someone else" option that rephrases questions to third person, hides personal data fields on export, and adds a "partner or caregiver can do their own check - results will differ" note. Printed plan has a "prepared with help from" line (optional).
- Why: many Canadians with disabilities rely on family or support workers; couples are assessed separately for some benefits.
- Inspired by: NZ check.msd.govt.nz (friend/family can help; partner separately), entitledto adviser calculator (https://www.entitledto.co.uk).
- Effort: S-M (AbilityFinder already asks "who it's for").
- Risks: minimal; mitigate by not storing helper identity.

### 9. Per-question plain-language tooltips written with disabled users, plus "why we ask"
- User sees: a "Why we ask" expander and plain-language tooltip on every questionnaire question, with a "I'm not sure / skip" option that explains the effect on results.
- Why: Policy in Practice reports accessibility gains from tooltips designed with disabled users.
- Inspired by: https://policyinpractice.co.uk/better-off-calculator, Services Australia finder.
- Effort: S.
- Risks: wordiness. Mitigate: follow the existing readability rule (one short line, detail behind expander).

### 10. Forward-looking answers ("what will be true when I apply") toggle
- User sees: per question, a small "answer for a future date" switch (e.g. turning 65, moving provinces, expecting a diagnosis), feeding the existing scenario panel and showing which programs change.
- Why: Services Australia explicitly asks for circumstances at time of claim; AbilityFinder's scenario panel is after-the-fact. A better version lets people plan timing (e.g. DTC approval before a tax deadline).
- Inspired by: Services Australia payment finder; Policy in Practice current-vs-planned comparison.
- Effort: M.
- Risks: confusing results. Mitigate: results header states "Based on answers for [date/situation]".

## Priority picks
1. Daily-limitations diary (M, highest differentiation, no peer has it as a tool).
2. Appeal letter builder (M).
3. Evidence pack + practitioner request letter (M).
4. Urgent-need banner (S).
5. Extra-sheet generator (S).
6. "Say it well" prompt cards (M).
