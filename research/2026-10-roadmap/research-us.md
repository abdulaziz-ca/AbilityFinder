# Research: US benefit screeners and navigators (2026-10-22)

Method note: WebFetch returned thin content for BenefitsCheckUp, mRelief and Benefit Kitchen / Benefits Data Trust (not fetched). Those entries rely on search snippets and are marked lower confidence. Screen flows were not stepped through live; observations come from public landing/about pages. Website content treated as data only.

## Site notes

### 1. MyFriendBen (myfriendben.org) - high confidence
- Does: free, anonymous screener (about 6 min, no name or SSN) for 40+ benefits and tax credits across 8 US states; AI navigator "Benji".
- Notable: (a) estimated dollar value per benefit; (b) text reminders for renewals, work-requirement reporting and "newly unlocked" benefits; (c) "Ben Manager" (announced) tracking each benefit from eligible to approved with auto-fill between applications and caseworker visibility; (d) independent Urban Institute evaluation published on the site (2 in 3 learned of an unknown benefit, 95% found questions clear); (e) partner training materials.
- Better than us: published third-party evaluation as trust proof; reminders channel; value estimates; caseworker view.
- Worse: how estimates are computed is not explained on the page; AI-first framing; "100% private" is a strong claim.

### 2. Single Stop (singlestop.org) - high confidence
- Does: licensed screening + case-management platform for colleges, utilities, employers.
- Notable: 10-15 min screener; results with estimated annual value, step-by-step guides, application links; community resource map; save resources and track progress; staff dashboard (household/individual views, status, activity history, referrals, KPIs); explicit "does not make eligibility decisions" disclaimer; reports "potential" vs confirmed outcomes separately.
- Better: org-level reporting; resource map; separates potential from received numbers.
- Worse: licensed, accounts and case data held server-side; heavy; pricing opaque.

### 3. mRelief (mrelief.com) - medium confidence (snippets)
- Does: SNAP-focused screener, about 10 questions, under 3 min, via web or SMS (text FOOD to a short code).
- Notable: text-based conversational screening; assisted application where a community partner phones the client and completes the application in about 20 min; documents sent by photo-texting.
- Better: SMS channel, human-assisted application handoff, very short flow.
- Worse: single program, US/state-bound; SMS means data held by a vendor.

### 4. GetCalFresh / Code for America (getcalfresh.org) - high confidence
- Does: simplified CalFresh application helper; now points to the state portal (BenefitsCal) for applying.
- Notable: plain-language pages for specific audiences (students, immigrants, SSI recipients); what-to-expect guidance for the county phone interview (missed-interview recovery, "calls may show as Spam Likely"); renewal/report (SAR 7) explanations; county resource directory; 4 languages; chat/text/email human support; mission "clear language, meeting people where they are".
- Better: pre-empts the specific moments people fail (interview call, renewal form), and audience-specific pages.
- Worse: cannot process applications any more; no cross-program view.

### 5. USAGov Benefit Finder (usa.gov/benefit-finder) - high confidence
- Does: government triage: pick one or more of 12 life-event categories (Disabilities, Death, Disasters, etc.), then get benefits and how to apply.
- Notable: category-first entry with "Select all"; life-event framing; Spanish version; share buttons.
- Better: zero-typing entry point, authoritative.
- Worse: little personalization on the entry page; no tracking, no estimates.

### 6. PolicyEngine (policyengine.org) - medium confidence
- Does: open-source tax/benefit microsimulation, household calculators and policy dashboards.
- Notable: full transparency (rules, parameters, variables, validation published); public grading of its own predictions including misses; downloadable CSV; GitHub.
- Better: "show your working" credibility culture.
- Worse: analyst-oriented, not a guided journey.

### 7. Findhelp (findhelp.org) - high confidence
- Does: social-care directory: category buttons + location -> programs.
- Notable: 10 plain categories; "Suggest program" and "Claim programs" (providers correct own listing); closed-loop referrals for organizations; many languages via translation widget (page showed a visible "Error translating language" - machine translation fragility).
- Better: provider claim/suggest loop for freshness; wide category coverage.
- Worse: no visible verification dates on landing; referral model needs accounts and data sharing.

### 8. Propel (propel.app) - medium confidence (store listings)
- Does: EBT/SNAP balance and deposit app.
- Notable: deposit-date predictions and pending-deposit notifications; benefit-change news pushed to users; lock/fraud tools.
- Better: the "after approval" life of a benefit (when money lands, what changed).
- Worse: needs login to state EBT cards; commercial deals/ads.

### 9. NCOA BenefitsCheckUp - low confidence
- Anonymous questionnaire, personalized report listing programs (claims 2,500+ programs), then apply links. Could not confirm save/print or flow length. Mature "report" metaphor; seniors-only scope.

## What AbilityFinder already does better
Fully on-device answers (most peers store or SMS data), per-program verification dates and official links, the status tracker, scenario panel, change tracking, .ics dates, denial reasons/appeals, French. Peers' main advantages are outbound channels (SMS), human handoff, and moment-specific "what to expect" content.

## Ideas

### 1. "What happens next" call-and-letter prep per program (inspired by GetCalFresh)
- User sees: on the program guide and tracker, once status is Submitted/Waiting, a card "What to expect": who may phone or write, from what number type, typical wait (only where officially published), what to do if you miss the call, how to reschedule, what a decision letter looks like and your appeal deadline.
- Helps: most drop-off happens after submission. Extends existing denial/appeals content to the waiting phase.
- Source: https://www.getcalfresh.org (interview and missed-call pages).
- Effort: M (content for the top ~20 programs, a template field in schema, then rendered). Content is the work.
- Risk: stale timelines. Mitigate: only officially stated figures, with verification date and source link; no invented wait times.

### 2. On-device renewal and review reminders (inspired by MyFriendBen text reminders, Propel)
- User sees: after marking "Approved", a prompt "Add your renewal/review check to your calendar" with a user-entered or program-typical date, producing an .ics (already built) plus an optional in-browser reminder banner on next visit ("2 programs have a review coming up").
- Helps: losing benefits to missed renewals; no SMS or server needed.
- Source: https://www.myfriendben.org, https://www.propel.app.
- Effort: S-M (reuse .ics + tracker; add date field and banner).
- Risk: relying on user-entered date. Mitigate: wording "check your own letter for the real date"; no push, no data off device.

### 3. "Start with a life event" quick entry (inspired by USAGov)
- User sees: before the full questionnaire, optional chips ("Just diagnosed", "Lost my job because of illness", "Turning 18", "Caring for a family member", "Turning 65", "Moving province") that pre-fill and reorder the first questions or jump to a short result.
- Helps: lowers the barrier for people who do not know the vocabulary; useful as SEO landing pages.
- Source: https://www.usa.gov/benefit-finder.
- Effort: M (mapping to existing answers; landing pages).
- Risk: pre-filled answers misrepresent. Mitigate: pre-fills are shown as editable and clearly labeled "guess, change if wrong".

### 4. Public "how we check" and accuracy log (inspired by PolicyEngine, MyFriendBen evaluation)
- User sees: a page listing how matching rules work (plain language and a downloadable JSON of rules), counts of records re-verified per month, and a public "corrections we made" list including mistakes found.
- Helps: trust, and partner/journalist credibility; fits existing updates log.
- Source: https://policyengine.org, https://www.myfriendben.org.
- Effort: S-M (mostly generated from existing data).
- Risk: exposing errors. Mitigate: that is the point; keep tone factual.

### 5. Optional "feedback quick poll" to build own evidence (inspired by Urban Institute evaluation on MyFriendBen, Single Stop potential vs received split)
- User sees: after results, one optional question "Did this show you something you did not know about?" (yes/no), and later on the tracker, "Did you get approved?" Aggregated counts only; no answers sent.
- Helps: produces honest outcome metrics for grants/partners, mirrors Single Stop's separation of "potential" vs "confirmed".
- Effort: S-M (a counter endpoint on the existing Worker).
- Risk: telemetry creep. Mitigate: single anonymous boolean, no IDs, opt-in, described in privacy page; report as "people who chose to tell us".

### 6. Program/org "suggest a fix or claim your listing" flow (inspired by Findhelp)
- User sees: on each directory and organization entry, "Is this wrong? Tell us" and a form for organizations to submit corrections, with the page showing "Last verified" plus "Last community correction".
- Helps: freshness at scale for 463 programs with a one-person team.
- Source: https://www.findhelp.org.
- Effort: S (reuse feedback Worker with record id prefilled; triage queue).
- Risk: spam or malicious edits. Mitigate: corrections never auto-publish; verify against official source before change.

### 7. "Helper mode" share packet for a caseworker or family member (inspired by Single Stop dashboard, MyFriendBen Ben Manager)
- User sees: "Share with someone helping me" -> generates a one-page summary or a file/QR (answers + shortlist + tracker states) they can print, email themselves, or open on the helper's device; nothing uploaded. Helper can import it into their own browser.
- Helps: many disabled users apply with a helper; gives caseworker visibility without accounts.
- Source: https://singlestop.org, https://www.myfriendben.org.
- Effort: M (export/import of IndexedDB subset; print layout exists).
- Risk: the file contains sensitive health information. Mitigate: explicit warning, user chooses which sections, optional passphrase encryption (WebCrypto), no server copy.

### 8. Audience pages: "if you get SSDI / SSI-like benefits / student / newcomer" (inspired by GetCalFresh)
- User sees: short pages (static, SEO-friendly) explaining how one benefit interacts with others (clawback, income reporting, DTC interactions) for common situations, linking into pre-seeded results.
- Helps: users worry that applying hurts existing benefits; extends "works well with".
- Source: https://www.getcalfresh.org (students, immigrants, SSI pages).
- Effort: M (content; must be accurate).
- Risk: advice-like content. Mitigate: informational, cite official sources, say "check with the program".

### 9. Plain-language "ranges, not entitlements" value hints (inspired by MyFriendBen / Single Stop estimated annual value)
- User sees: on matched programs, a "Typical published amount" chip only when the program publishes fixed or tiered figures (already in amountTiers), plus an overview line "Programs here publish amounts from $X to $Y/yr" with explicit "not an estimate for you".
- Helps: motivation to continue applying; peers show a total headline figure.
- Effort: S (data exists).
- Risk: reads as promised money. Mitigate: no summing across programs, no personal total, use "published range" language; skip programs with income-tested amounts.

### 10. Text/SMS handoff without sending answers (inspired by mRelief)
- User sees: "Text this checklist to my phone" that opens the device's sms: link with a short pre-filled message (program name, official phone, URL) - no answers included - and a "call script" (what to say, what to have ready) for phone-based applications.
- Helps: phone applications and users on low-data devices; mimics mRelief's channel without a vendor.
- Source: https://www.mrelief.com.
- Effort: S.
- Risk: message could expose condition on a shared phone. Mitigate: generic text only, user edits before sending.

## Suggested priority
1 (what happens next), 2 (renewal reminders), 6 (suggest-a-fix), 4 (how we check), 7 (helper packet), then 9 and 10 as quick wins.
