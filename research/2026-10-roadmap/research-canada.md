# Research: Canadian benefit finders, navigators and disability organizations (2026-10-22)

Method: WebFetch of each homepage / key page (summarised by a small model, so detail is shallow), plus one web search. Page content is treated as data. Sites the tool could not read are flagged. Observations are from landing pages only; interactive tools (questionnaires/results) were not exercised.

## Site-by-site

### 1. Prosper Canada, Benefits Wayfinder (benefitswayfinder.org)
- Does: questionnaire-driven benefit finder, sponsored by TD; bilingual; dashboard; "benefit updates"; three money-management modules hosted on yourtrove.org; separate Agency portal for workers who help clients.
- Notable: (a) agency/worker portal as a first-class entry; (b) intro video + "how to use this tool" video; (c) benefit updates feed; (d) "Not sure where to start?" entry.
- Better than us: the intermediary (agency) channel and the money-management follow-on (budgeting, reducing costs) after finding benefits.
- Avoid: no visible privacy/data-use info on the landing page despite asking income questions; content split to an external domain; recommendations area did not render in capture.

### 2. Canada.ca Benefits Finder (canada.ca/en/services/benefits/finder.html)
- Does: 4-step filter (12 life situations, 11 audiences, province/territory, Find). 157 federal results.
- Notable: (a) fraud/scam warnings before the tool; (b) life-event framing instead of program names; (c) "See all 157 results without filtering" escape hatch; (d) skip links, language toggle.
- Better than us: scam-warning placement and the explicit show-everything escape.
- Avoid: two filter modes (additive vs AND) not explained; no tool-specific privacy statement; federal only, pushing users to hunt provincial benefits separately.

### 3. Disability Alliance BC (disabilityalliancebc.org)
- Does: advocacy and direct service (PWD, CPP-D, DTC/RDSP help); publications library; help sheets HS02-HS19 as PDFs.
- Notable: (a) help sheets translated into Arabic, Persian, Punjabi, Spanish via MOSAIC; (b) "Checklist for the PWD Benefit" (HS03) and paired appeal sheets (HS05A/B, HS11A/B) so each stage of a process has its own short sheet; (c) emergency preparedness and anti-violence resources alongside benefits; (d) webinars on reconsiderations and a BC elections toolkit.
- Better than us: multilingual (non-French) plain guides; stage-specific appeal sheets.
- Avoid: sheets listed without dates or sizes (stale-risk invisible), no search/filter on publications, broken Facebook embed, DTC card mislinked, walk-ins not accepted (appointment only).

### 4. Plan Institute / Access RDSP (rdsp.com)
- Does: free RDSP education; calculator; tutorial; step-by-step downloadable guide; webinars (levels 1 and 2, DTC webinar); Disability Planning Helpline (phone/email); RDSP Awareness Month.
- Notable: (a) layered depth ("use the tutorial at your own depth"); (b) DTC framed explicitly as the gateway to RDSP; (c) the helpline is always visible; (d) multiple entry points (calculator, guide, webinar) to one topic.
- Better than us: depth ladder for a single complex product; live Q&A; RDSP calculator.
- Avoid: split across domains (planinstitute.ca), heavy repetition, calculator inputs unexplained, obscured helpline email.

### 5. Disability Without Poverty (disabilitywithoutpoverty.ca)
- Does: advocacy for an adequate Canada Disability Benefit (max about $200/month, DTC-gated); guides "How to get the CDB", CDB and clawbacks, CDB and the poverty line, CDB FAQ; DTC guide; cost-of-living survey for applicants; stories; Advokits.
- Notable: (a) clawback guide addresses the real fear ("will applying cost me other benefits?"); (b) application banner pinned at top linking to the official site; (c) lived-experience stories; (d) data collection via survey from people who already applied.
- Better than us: interplay/clawback explanation as a standalone, plain guide.
- Avoid: advocacy framing mixed with how-to; homepage slideshow carousel.

### 6. 211.ca
- Does: location-first routing to the local 211; phone, text, chat, web, app; 150+ languages; anonymous.
- Notable: (a) "no name or personal details needed" stated up front; (b) many channels for different abilities; (c) language breadth; (d) category tiles (shelter, mental health, food).
- Better than us: human fallback and channels; language breadth.
- Avoid: no keyword search/filters described, unlabeled icon tiles, unfinished counters ("0 +") and typos damage trust, hours vague.

### 7. Alberta Supports (alberta.ca/alberta-supports)
- Does: provincial hub for AISH, ADAP, FSCD, PDD, Income Support, 30+ programs and 120 services.
- Notable: (a) "I want to..." task shortcuts; (b) clear hours and a 24/7 emergency line; (c) 100+ languages by phone; (d) "Was this page helpful?" with a privacy warning not to enter personal info.
- Better than us: task-oriented entry ("I want to apply for emergency help / report fraud / find an office"), clearly stated contact hours.
- Avoid: no eligibility tool at all; feedback gets no reply; inconsistent naming.

### 8. ODSP Action Coalition (odspaction.ca) plus search results
- Does: grassroots coalition of ODSP recipients, advocates, legal clinics; policy submissions, press, events; members-only meetings. An old (2013) "Know Your Benefits" webinar is hosted via CLEO.
- Notable: (a) explicit statement of what they cannot do (no legal advice, cannot change caseworkers) and a referral to community legal clinics; (b) a stale-content warning is needed for their old webinar; (c) obfuscated email.
- Better than us: honest scope-of-service statement.
- Avoid: dated resources with no visible date; conflicting figures across third-party sources (earnings exemption $200 vs $1,000 in search snippets) show how fast ODSP numbers get mangled, which supports AbilityFinder's verification-date practice.

### 9. Inclusion Canada (inclusioncanada.ca)
- Does: family-led national advocacy; Barrier-Free Benefits page; resources hub; impact stories.
- Notable: short headings and plain language; feedback link at top of site.
- Avoid: missing alt text, unlabeled social icons, leftover template text ("Page Title", "Edited in CMS"); no easy-read section. A reminder that WCAG failures on disability sites are common and noticed.

### 10. Disability Credit Canada (paid DTC consultant; observed, not emulated)
- Conversion drivers: "Find out if you qualify" free assessment CTA; refund calculator giving a personal dollar figure ("up to $40,000"); fear framing ("65% of CPP-D applications denied"); no-win-no-fee; testimonials with amounts; SMS opt-in; lead-magnet guides.
- Problems: undefined "90% success" claim, placeholder counters, duplicated reviews, outcome promises without assumptions. Lessons: people respond to concrete numbers on retroactive DTC money and to "someone does the work for me"; AbilityFinder should give the honest free version of that value (clear process, free helpers) without dollar promises or fear marketing.

### Unreachable / thin
- March of Dimes Canada: fetch returned empty both attempts; not assessed. Worth a manual look for its ODSP/assistive-device navigation.
- odsp-ac.ca does not resolve; real domain is odspaction.ca (only partially readable).

## Cross-cutting patterns
1. Everyone with a human service stresses a human fallback (helpline, navigator, caseworker line). AbilityFinder has a "real people who can help" directory; it could be woven into results more.
2. Stage-specific short documents (checklist / appeal / reconsideration) beat one long guide.
3. Clawbacks and "will this hurt my other benefits" is the top unmet worry across advocacy groups.
4. Scam warnings are standard on the federal tool; disability benefits attract fraud and paid "consultants".
5. Translations beyond French (Arabic, Persian, Punjabi, Spanish) are a gap among peers that a few do fill.
6. Missing dates on guides is a common failure; AbilityFinder already shows verification dates and should keep that as a differentiator.
7. Nobody evaluated shows tool-level privacy messaging well; AbilityFinder's local-only storage is a strength to state prominently.

## Ideas for AbilityFinder

### 1. "Will it affect my other benefits?" interaction check
- User sees: on a results page and a program guide, a compact panel "Before you apply: how this interacts with what you already get". It reads their "already receive" answers and lists plain-language, source-linked notes per pair (e.g. CDB vs provincial assistance: clawback/exemption status, RDSP income not counted vs ODSP/PWD, earnings exemptions), each marked "confirm with the program".
- Why: the clawback fear stops people applying or leads to unpleasant surprises; DWP has dedicated clawback guides, no finder shows it per person.
- Inspired by: Disability Without Poverty (disabilitywithoutpoverty.ca); ODSP Action Coalition (odspaction.ca) numbers confusion.
- Effort: M (needs curated pair data, about 40-60 high-value pairs first).
- Risks: stale or wrong rules cause harm. Avoid by sourcing every pair to an official page with a verified date, and hiding any pair lacking a verified source. No claim of dollar outcome.

### 2. Stage-based mini-sheets: checklist, denial, appeal
- User sees: each program guide gets three short printable tabs (1-page "Application checklist", "If you are denied", "How to appeal") with deadlines, in the style of DABC's HS03/HS05/HS11 sheets. Large PDF download plus on-page text.
- Why: people in crisis need one page for the step they are on, not a long guide. Links to the existing progress tracker (Denied state opens the appeal sheet).
- Inspired by: Disability Alliance BC help sheets (disabilityalliancebc.org/publications/publications-bc-disability-benefits-help-sheets/).
- Effort: M (template generation from existing denial/appeal data; S per program once templated).
- Risks: appeal deadlines are legally sensitive. Show source and verified date on each sheet; "check your decision letter, it overrides this".

### 3. "I want to..." task entry on the home page
- User sees: below or beside "Start", 6-8 task buttons: "I just got a denial letter", "I need money this week (emergency help)", "I want to open an RDSP", "I am helping a parent/child", "I got a scam call about benefits", "I want to see what I could get without answering questions". Each opens a focused mini-flow or guide.
- Why: many visitors arrive with a task, not a profile; Alberta Supports and Canada.ca both use task/life-event entry. Partly addresses people who will not complete a 15-question form.
- Inspired by: Alberta Supports (alberta.ca/alberta-supports), Canada.ca Benefits Finder.
- Effort: S-M (mostly routing to existing content plus 2-3 new pages).
- Risks: low. Keep it a shortcut, not a second source of truth.

### 4. Scam and paid-consultant safety panel
- User sees: a plain "Stay safe" box on the start page and in the DTC and CPP-D guides: no one can guarantee approval, the government never asks for payment to apply, how contingency-fee DTC claim companies work (percentage of refund; you can apply free yourself), link to the Canadian Anti-Fraud Centre and CRA scam page.
- Why: DTC consultants market heavily with fear and "up to $40,000" claims; people lose a share of retroactive refunds they could claim free. Canada.ca puts fraud warnings before its finder.
- Inspired by: Canada.ca Benefits Finder, Disability Credit Canada (as the counter-example).
- Effort: S.
- Risks: avoid naming or defaming specific companies. State facts about fee models generally and cite CRA guidance.

### 5. Free-help ladder ("who can do this with me")
- User sees: on each program guide and in the action plan, a "Get a person to help" block ordered: free official/non-profit helplines first (211, Disability Planning Helpline for RDSP/DTC, provincial advocacy groups, community legal clinics), with phone hours, and the channels offered (phone/text/chat/in-person), pulled from the existing 67-organization directory filtered by province and topic. Includes "what they can and cannot do" (the ODSP Action Coalition model).
- Why: the finder cannot judge cases; peers all end in a human. Honest scope statements build trust.
- Inspired by: 211.ca, Plan Institute (rdsp.com), Alberta Supports, ODSP Action Coalition.
- Effort: S-M (add tags for topic, channels, "can/cannot help with" fields to directory).
- Risks: stale phone numbers; reuse verified dates and show them. No tracking of which helper is clicked beyond cookieless counts.

### 6. Caseworker / helper "bring your results" mode
- User sees: a "Print or save a summary for a helper" button that produces a one-page, answer-free-by-default summary (program list, docs checklist, open steps) with an optional toggle to include their answers; a "Helper view" link in the partner page explaining how workers can use it with a client on a shared screen and clear data afterward. Includes a visible "Clear all my answers" button.
- Why: Wayfinder has an agency portal; many applicants are helped by community workers or caregivers, often on shared devices. Works without accounts.
- Inspired by: Benefits Wayfinder agency portal (benefitswayfinder.org).
- Effort: S-M (mostly layout of existing print view plus a shared-device clear-and-lock tip).
- Risks: shared-device exposure. Default to omit answers, show a clear-data prompt on finish, never store server-side.

### 7. Depth ladder per topic (Quick / Walkthrough / Official wording)
- User sees: for the three complex ones (DTC, RDSP, CPP-D), a three-level switch on the guide: "5-minute summary", "Step-by-step", "Forms and official wording", plus links to live webinars and the Disability Planning Helpline when they exist.
- Why: Plan Institute's layered tutorials suit people at different stages; fits AbilityFinder's own short-line-first readability rule.
- Inspired by: Plan Institute / Access RDSP (rdsp.com).
- Effort: M (restructure 3 guides; extend later).
- Risks: duplication drift between layers; generate layers from one source record.

### 8. More languages for the stage sheets (start with the sheets, not the app)
- User sees: language links on the printable action plan and the new mini-sheets (idea 2) for the most-asked languages (candidates: Punjabi, Arabic, Simplified/Traditional Chinese, Spanish, Tagalog; confirm with 211 and census data), with a banner "translated from English on [date]; English is the official version".
- Why: DABC proves newcomer-community demand; 211 reaches 150+ languages; AbilityFinder only has English/French.
- Inspired by: Disability Alliance BC (MOSAIC translations), 211.ca.
- Effort: L (translation quality review per language) but S per sheet once templated; start with 2 languages.
- Risks: machine-translation errors on legal text. Label machine-assisted translations plainly and use a native-speaker reviewer; keep the translated set small and dated.

### 9. Staleness badges on every guide and a public "last checked" index
- User sees: each guide and program card shows "Checked on [date] against [official source]" (exists) plus a colour/text badge for age (checked in last 90 days / over 6 months: confirm on official site), and a single "Freshness" page listing the oldest items.
- Why: peers hide dates (DABC help sheets, old ODSP webinar), and third-party sources conflict on the same figures. Visible freshness is a trust differentiator.
- Inspired by: DABC (negative example), ODSP Action Coalition snippets.
- Effort: S.
- Risks: exposes backlog; accept that and treat it as a prompt to re-verify.

### 10. Honest "money at stake" explainer for DTC retroactive claims (no personal estimate)
- User sees: in the DTC prep helper, a static explainer: "If approved, you can usually ask the CRA to reassess up to 10 previous years. What you get back depends on your past taxes, not a fixed amount", with a worked example using clearly fictional numbers and a link to CRA's reassessment steps. No calculator that produces a personal dollar figure.
- Why: Disability Credit Canada converts via a personal dollar figure; people need to know the rule without the sales pitch.
- Inspired by: Disability Credit Canada (as contrast), DWP DTC guide.
- Effort: S.
- Risks: oversimplification. Verify against current CRA wording, show the verified date, say it is not an estimate.

## Priority recommendation
Best value-for-effort: 4 (scam panel), 3 (task entry), 9 (freshness badges), 1 (benefit interaction check), 2 (stage sheets), 5 (free-help ladder). Larger bets: 8 (languages), 7 (depth ladder).
