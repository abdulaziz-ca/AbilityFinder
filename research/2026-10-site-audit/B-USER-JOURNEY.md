# B — User-journey audit (Oct 16 2026)

**Method.** I served `public/` locally (`python3 -m http.server 8771`) and drove it with Playwright Chromium. I waited for app readiness with `history.state !== null`. I walked 4 personas end to end at desktop 1280×800 and phone 390×844 (touch), in light and dark mode: 10 full runs plus 2 exploration passes. I read the DOM text and structure and took **160 screenshots**, all under `research/2026-10-site-audit/screens/`. File names follow `p{persona}-{desk|phone}-{light|dark}-{step|r}…png` for the persona runs and `x-…png` for the exploration passes. I changed no product code. No assistant message was sent.

Personas (answers given):

| # | Who | Key answers |
|---|---|---|
| P1 | Adult on **AISH**, Calgary | self · mental health + chronic illness · 19–59 · documented · pain/fatigue + needs help organizing · AB · citizen · DTC "No, not yet" · "A disability stops me from working" · lower income · Calgary |
| P2 | Parent of autistic **7-year-old**, Surrey BC | my child · autism · 6–11 · documented · autism dx yes · began in childhood · sensory + communication · BC · MSP yes · BC assistance none · homeowner + vehicle owner · citizen · DTC no · elementary school · middle income · Surrey |
| P3 | **67-year-old**, mobility, Toronto | self · physical · 65+ · documented · cannot walk 50 m · transit barrier + equipment + home access · ON · citizen · DTC "not sure what that is" · none of these · middle income · Toronto |
| P4 | **Working** adult, learning disability, no DTC, Edmonton | self · learning disability · 19–59 · documented · none of these · AB · citizen · DTC no · working · middle income · Edmonton |

---

## 0. Headline: why results feel like a fluke (the owner's complaint, reproduced)

The complaint reproduces for every persona. The results page shows a large number with "benefits you may be able to get" under it. Almost every item below it is "More to check", and roughly **40–50% of those are programs that do not fit the person's current situation**. They appear only because the matcher keeps any program whose remaining requirements were never asked about.

| Persona | Big number shown | "Matches your answers" | "More to check" | Items that clearly don't fit the person *as they described themselves today* |
|---|---|---|---|---|
| P1 AISH Calgary | **21** | 1 (Calgary Fair Entry) | 20 | **Okotoks Recreation Fee Assistance** ("Check that you live in the Town of Okotoks…", though they chose Calgary) · **CPP Children's Benefit** (no children mentioned; it's for children of a CPP-D recipient) · **Canada Caregiver Credit** (claimed by a *supporter*; they chose "Myself") · **Home Accessibility Tax Credit** + **Multigenerational Home Renovation Tax Credit** (no renovation, no DTC, not 65) · **Excise Gasoline Tax Refund** (no mobility answer) · **CAPCC** (for people living in continuing-care facilities) · **Alberta Service Dog ID card** (no service dog) · **ADAP** and **Adult Health Benefit** (the person is *already on AISH*; the guide data itself says AHB excludes AISH recipients) · **AISH itself** shown as "More to check", ranked **20th of 21** |
| P2 Surrey child | **24** | 2 (Fair PharmaCare, Autism Funding 6–18) | 22 | CPP Children's Benefit · **First Nations Health Benefits (FNHA)** (no Indigenous-status question was asked) · **BC Bus Pass** (PWD/low-income seniors only; "BC assistance: none") · **SPARC parking permit** (no mobility need) · Medical Transportation Supplement · At Home Program Medical · **B.C. Home Owner Grant – disability addition**, triggered because the "homeowner" question asks about *the child* · MHRTC · Excise gasoline refund · Disability Supports Deduction (a 7-year-old's work/school support costs) |
| P3 Toronto 67 | **14** | 1 (Ontario parking permit) | 13 | CPP Children's Benefit · Canada Caregiver Credit · MHRTC · Disability Supports Deduction (not working or studying) · **ODSP income support** for a 65+ person (the record only checks `age18plus`; ODSP's own BC-equivalent tip says recipients move to OAS/GIS at 65; the Ontario rule needs verifying) |
| P4 Edmonton working LD | **20** | **0** | 20 | **AISH** ("permanent disability prevents employment") for someone who is *working* · CPP Children's Benefit · Canada Caregiver Credit · Service Dog ID card · CAPCC · Special Needs Housing · MHRTC · HATC · Excise gasoline refund (no mobility) |

`screens/p1-desk-light-r1-results-full.png`, `screens/p2-desk-light-r1-results-full.png`, `screens/p3-desk-light-r1-results-full.png`, `screens/p4-desk-dark-r1-results-full.png`

**Root cause, verified with `evaluateAnswers()` in the page.** Every "almost" card for P1 is produced by needs the wizard never asked about. Examples:

| Program | Requirement driving the card |
|---|---|
| `okotoks-fee-assistance` | `okotoksResidency` |
| `cpp-childrens-benefit` | `cppDisabilityContributorLink` |
| `canada-caregiver-credit` | `caregiverSupportClaim` |
| `ab-capcc` | `abCapccContinuingCareHome` |
| `ab-service-dog-id-card` | `abServiceDogQualified` |
| `excise-gasoline-tax-refund` | `exciseMobilityImpairment` |

An unanswerable gate resolves to "almost" rather than being hidden or grouped as "only if…". Under the current presentation, "almost" is indistinguishable from "this probably fits you".

**What the person sees, in order (P1, desktop, `screens/p1-desk-light-r0-results-fold.png`):**
1. A huge "**21**" and "benefits you may be able to get".
2. "We did not ask about every requirement. You can still read how to apply." The page undercuts the number in its first sentence.
3. A money band titled "**Matches your answers** — value varies by program" with icon and sub-text. This reuses the exact label of the 1-item "Matches" group, so it reads as if all 21 match.
4. A collapsed "What if my situation changes?" panel.
5. The Print / Priority / By category toolbar.
6. 11 answer chips.
7. "MATCHES YOUR ANSWERS **1**". The first benefit card starts at **y = 893 px on desktop** (below the fold) and **y = 1,197 px on phone**.
8. "MORE TO CHECK **20**", 20 cards ordered by an editorial value/ease score (RDSP, CPP-D, AHB, CDB, DRES, **Okotoks**, **CPP Children's**…). AISH comes 20th.
9. "Documents several programs ask for (4)", collapsed **after all 21 cards**.
10. Charitable funds (2).
11. "Does not match these answers (**50**)". For a Calgary resident this list includes **~23 Ontario municipal programs** (Region of Waterloo, Ottawa, Toronto, Windsor, Brampton…). See `screens/x-desk-notmatch.png`.
12. "Practical steps you can start this week" (18 tips in 3 accordions).
13. "Real people who can help".
14. "Start over" and the disclaimer.

Phone page height: **24,744 px for P1 (~29 screens)** and **29,647 px for P2**. The average card is **~905–960 px tall** on phone.

---

## 1. Prioritized findings

### P1 — must fix

**P1-1. Results are padded with programs that need an unasked life fact. "More to check" mixes "probably for you" with "only if you happen to have X".**
*Evidence:* section 0 table. Across the 4 personas, about 9–11 of 14–24 cards are conditional on something the user never said (a child, a service dog, a renovation, a care facility, Indigenous status, a CPP-D parent, living in another town). `screens/p1-desk-light-r1-results-full.png`, `screens/x-phone-cpp-children-card.png`, `screens/x-phone-fnha-card.png`.
*Improvement:* split the evaluator output into three tiers and render them differently:
- **"Fits what you told us"**: all gates answered, or only needs the program itself decides (medical review, income test).
- **"Worth checking"**: unanswered gates the person can plausibly have, such as CPP contributions, dental coverage or receipts.
- **"Only if… (collapsed)"**: gates that describe a life fact the person didn't mention (has a child, a service dog, a renovation, a care home, First Nations status, lives in Okotoks). Each one gets a one-line "Only if you…" lead-in.

The headline number should count only the first two tiers. A data-only route exists: tag each fact in `FACT_REGISTRY` as `kind: "lifeFact"` vs `kind: "programDecision"`.

**P1-2. The wizard never asks "What do you already receive?" (AISH, ADAP, PWD/BC disability assistance, ODSP, CPP-D, DTC).**
*Evidence:* P1 is on AISH. Their own primary benefit appears as "More to check" at **rank 20/21**, with "Ask about AISH's disability review and your doctor's report". ADAP and the Adult Health Benefit are also listed, though the guide text (`app.js` ~l.751) says AHB excludes AISH recipients. Only BC has an assistance-status step (`bcAssistance`); Alberta and Ontario have none. `screens/p1-desk-light-r1-results-full.png`.
*Improvement:* add one province-aware multi-select, "Do you already get any of these?" (AISH / ADAP / Income Support; PWD; ODSP / OW; CPP-D; DTC approved). Use it to:
- move received programs to a top "You already have" strip (with renewal/reporting tips);
- drop mutually exclusive ones (ADAP vs AISH, AHB vs AISH);
- unlock "on-AISH" routes, e.g. the Calgary/Grande Prairie AISH transit passes.

This single question fixes the largest share of the "fluke" feeling for the AISH persona.

**P1-3. City answer is ignored for town-specific programs (Okotoks shown to a Calgary resident).**
*Evidence:* P1 chose Calgary and still sees "Okotoks Recreation Fee Assistance … Check that you live in the Town of Okotoks or Foothills County". `evaluate()` returns `almost` with that single need. The scenario panel even lists "You would lose: … Okotoks Recreation Fee Assistance" when income changes. `screens/p1-desk-light-r1-results-full.png`, `screens/x-desk-scenario-diff.png`.
*Improvement:* when a specific city is selected and it isn't Okotoks, treat `okotoksResidency` as `no`. Show it as "unknown" only for "Other / my town isn't listed". Audit every `*Residency` fact the same way.

**P1-4. "Does not match" lists ~23 Ontario municipal programs to an Alberta user (50 items, mostly noise).**
*Evidence:* `screens/x-desk-notmatch.png`. `benefitProvince()` only recognises `ab|calgary|edmonton` and 2-letter province codes. Ontario local records gate on `waterlooRegion`, Ottawa and similar keys, so they return `null` (treated as federal) and leak into the AB list.
*Improvement:* derive province from the record's `level` or coverage metadata instead of `requires` sniffing. Hide other provinces' local programs entirely. Then the "Does not match" list becomes useful: these are the reasons *you* were excluded.

**P1-5. Headline number and money band overstate fit.**
*Evidence:* P4 sees "**20** benefits you may be able to get" with **0** matches. P1 sees a money band titled "**Matches your answers** — value varies by program" above a 1-item "Matches" group. `screens/p4-desk-dark-r0-results-fold.png`, `screens/p1-desk-light-r0-results-fold.png`. The landing preview promises "8 benefits found · Matches your answers" (`screens/p1-desk-light-00-landing.png`).
*Improvement:*
- Make the headline honest and two-part: "**1 program fits what you told us · 9 more worth checking**".
- Rename the money band (it duplicates a group label), or delete it when it carries no number. Today it is three lines of text saying "we do not estimate".
- Align the landing preview with real output.

**P1-6. Arrow keys on a wizard radio group auto-submit the answer.**
*Evidence:* on step 1, I pressed Tab to the first option, then ArrowDown. The browser checks "My child", the `change` handler fires `setTimeout(goNext, 200)`, and the user lands on step 2 having never chosen. Verified state: `{step:1, forWho:"child"}` (`screens/x-desk-wizard-after-arrowkey.png`). Keyboard and screen-reader users browse radios with arrows. This is a WCAG 3.2.2 (On Input) failure and silently records wrong answers (here it wipes age and situation via `onPick`).
*Improvement:* auto-advance only on pointer/tap (`pointerup` or `click` with `event.detail > 0`). For keyboard, select on arrow and advance on Enter/Space or the Next button.

**P1-7. Result cards are far too tall on phone, and the value line becomes a wall of bold text.**
*Evidence:*
- Average card is ~905–960 px on phone, about 1.1 screens per card.
- The Fair PharmaCare "value" renders its full income-band sentence as a ~30 px bold green headline running 8+ lines (`screens/x-phone-fairpharmacare-card.png`). The same happens with At Home Program, CDCP and the ICBC discount.
- Each card repeats "Matches your answers" three times: the group note, the card tag, and the card note "Based on what you told us. The program decides if you qualify."
- Every card carries a 7-option status `<select>`.

*Improvement:*
- Card = name, one-line "what it is", a short value (≤ 40 characters; long text goes behind "How much?"), one status pill, and one primary action.
- Move difficulty/apply/wait and the requirement preview behind a "Details" disclosure.
- Show the status selector only after the user opens the guide or taps "Track".
- Target ≤ 350 px per card on phone. This aligns with the project's own readability rule: short line up front, official wording behind the expander.

**P1-8. Questionnaire progress is not honest: the total jumps mid-way ("Step 6 of 10" → "Step 7 of 11", and for P2 10 → 12 → 16).**
*Evidence:* the `step-kicker` totals across runs were P1 10→11, P2 **10→12→16**, P3 10→11→12. The landing says "Takes about a minute". In practice it is 11–16 screens and 15–23 taps, with ~1,000–1,300 words on screen (that count includes the repeated "Why we ask" sidebar). `screens/p2-desk-light-step*.png`.
*Improvement:*
- Ask province first. It determines most branching (MSP, BC assistance, circumstances, city).
- Show sections rather than a step count ("About you · Health & daily life · Money & home"), or compute the maximum and count down.
- Change "about a minute" to "about 3–5 minutes".

**P1-9. BC "circumstances" question asks about the child: "Which of these are true for your child? Owns and lives in a home / Owns … a vehicle".**
*Evidence:* `screens/p2-desk-light-step11-circumstances.png`. A parent will answer for the household, which then surfaces the homeowner-grant disability addition and the fuel-tax/ICBC discounts as if the 7-year-old owned them.
*Improvement:* for `forWho` = child or family, word it "Which of these are true for your household?" and handle the program rules accordingly (whose disability, whose vehicle). For a child, hide "Graduated from post-secondary".

### P2 — should fix

**P2-1. Child-irrelevant and region-irrelevant wording in branch questions.**
- "Did this begin before age 18?" is asked of a 7-year-old's parent. Its help text says "Some **Alberta** programs (like PDD)…" to a BC family, because it is asked before province (`screens/p2-desk-light-step06-onset.png`). Skip it automatically when age < 18, and ask it after province.
- Onset, citizenship, mobility (50 m), and income have **no "I'm not sure" / "Prefer not to say"** option. Income in particular will stall a stressed user.

**P2-2. Documents checklist is buried, and empty for 2 of 4 personas.**
*Evidence:* "Documents several programs ask for (4)" sits after all 21 cards (~y 10,000 px). For P2 and P3 it reads "(0)". P1's checklist covers only AISH/ADAP documents, followed by "53 more documents are each needed by only one program". `screens/x-desk-docs-checklist.png`.
*Improvement:* move a compact "Start here: 3 things to gather" box above the cards (SIN, last Notice of Assessment, proof of address, a medical professional for forms). Hide the box when the count is 0 rather than showing "(0)".

**P2-3. "What if my situation changes?" is useful but has confusing wording and a 52-item select.**
*Evidence:* options read "Now: Working / have a job" and "No longer: A disability stops me from working". The city select has 52 options. The diff shows four rows of counts, and the "New programs under Matches your answers" row repeats the eligibility note inline. The footer says "Estimate only — answer the questions for real to see full guides". `screens/x-desk-scenario-diff.png`, `screens/x-phone-scenario-open.png`.
*Improvement:*
- Phrase options as "If I start working", "If I could no longer work", "If my income goes up".
- Show only gains and losses as named chips, each linking to its card.
- Keep city out of it (moving is rare) or make it a search field.

**P2-4. Inline "Full guide" duplicates the guide page and is enormous.**
*Evidence:* expanding AISH inline adds ~900 words and ~3,500 px. It shows "Requirements to check" twice (card preview plus sidebar), "Good to know" twice, and "What it can provide" repeating the value line (`screens/x-desk-aish-card-expanded.png`). The detail page also has **two H1s** (the second is the hidden print header).
*Improvement:* keep a single path. Either the card's "How to apply" opens the guide page, or the inline expander shows only Next step, Documents and the Official link. Remove the duplicated sections.

**P2-5. Guide pages have long paragraph-bullets.**
*Evidence:*
- DTC "More about this benefit" has bullets of ~90–110 words each (`screens/x-phone-dark-detail-dtc-full.png`).
- AISH "Tips to skip the runaround" has 9 bullets, several 50–70 words (`screens/x-desk-detail-aish.png`).
- The longest paragraph is 165 words on "What changed" and 109 words on results.

*Improvement:* apply the "short line up front, official wording behind expander" rule to `more`, `tips` and `requiresNote` fields. Cap the visible tips at 3, with the rest under "More tips".

**P2-6. Broken templated copy in the practitioner finder.**
*Evidence:* the Autism Funding guide says **"Do you complete disability forms like your disability form?"** and "This benefit needs a medical practitioner to complete a form" generically (`screens/x-phone-detail-autism-full.png`). The fallback text runs when `PRACTITIONER_FORMS` has no entry.
*Improvement:* when there's no named form, drop the quoted question or use "…like the [program] diagnosis/assessment form". For autism, point to the BCAAN/qualified-assessor route instead of "Find a family doctor".

**P2-7. Floating buttons cover content on phone.**
*Evidence:* the Ask (bottom-left) and Accessibility (bottom-right) FABs sit over:
- the landing "Browse benefits" button (`screens/x-phone-landing-fold.png`);
- the right-hand radio ticks on long option lists (`screens/p1-phone-dark-step05-functionalNeeds.png`);
- the value text on cards (`screens/x-phone-fairpharmacare-card.png`).

*Improvement:* add `padding-bottom` equal to FAB height plus 16 px on `main`. On phone, merge both into one "Help" FAB, or move Ask into the header menu.

**P2-8. French mode is half-translated and uses stronger eligibility wording than English.**
*Evidence:* results in FR mix FR chrome with EN cards, chips, "Priority order/By category", the Updates panel and status options (`screens/x-desk-results-fr.png`). FR strings read "**Prêt à demander**" ("Ready to apply") and "**SUIS-JE ADMISSIBLE ?**" ("Am I eligible?"), where English deliberately says "Matches your answers" and "Does it match my answers?" (`screens/x-desk-detail-fr.png`). There is also a grammar slip: "1 programmes correspondent". The guide does say "Les guides des prestations sont fournis en anglais", which is good.
*Improvement:* bring the FR `grp.*`, `det.*` and money-band strings in line with the English safety wording. Pluralise correctly. Label the toggle "Français (partiel)" until coverage is complete.

**P2-9. Returning visitor drops straight into old results with no context.**
*Evidence:* a new tab or a reload lands on the results view instantly, with no "Welcome back — these are results from your answers on [date]. Update answers / Start over" (`screens/x-desk-returning-visitor.png`, `screens/x-desk-after-reload.png`). On a shared or family computer, the next person sees someone else's disability answers.
*Improvement:* show a one-line restore banner with "Review my answers" and "Start fresh (clear this device)". Restore stays local.

**P2-10. "Updates to your programs" panel is vague and appears above everything.**
*Evidence:* when triggered (I simulated an older watermark), it sits above the money band. It reads "Details for 15 programs were updated… They may correct our guide, not a change to the program itself. Other updates may not be listed. The program decides if you qualify.", followed by "Show the updates / Got it" (`screens/x-desk-updates-panel.png`, `screens/x-desk-updates-panel-open.png`). A user can't tell whether anything affects *them*.
*Improvement:* lead with the most material change ("AISH: reporting rule for CDB changed"), mark which ones are corrections vs real program changes, and place the panel under the headline, not above the list.

**P2-11. Browse catalogue is one giant page.**
*Evidence:* 134 cards, **9,565 words, 37,823 px on desktop and ~79,900 px on phone**. There are 3 rows of filter chips (6 category, 6 level, 12 disability) before the first card (`screens/x-desk-page-browse.png`, `screens/x-phone-browse-fold.png`). Search works ("autism" → 5 results, `screens/x-desk-browse-search-autism.png`).
*Improvement:* default the level filter to the user's province (when known) plus Federal. Collapse the filters behind "Filter (3)" on phone. Paginate or lazy-load in groups of 20, or show compact one-line rows.

**P2-12. Senior persona gets no senior programs.**
*Evidence:* P3 (67, Toronto) sees 14 items, none of them OAS/GIS/GAINS or Ontario seniors programs. The catalogue has no OAS/GIS record. ODSP (18–64 working-age income support) is shown as "More to check" for a 67-year-old. CPP Children's Benefit and the Disability Supports Deduction are also shown.
*Improvement:* if seniors are out of scope, say so on the results for a 65+ profile, with links to official senior-benefit pages. Verify the ODSP age rule officially and gate `odsp` on `age18to64` if confirmed.

**P2-13. Stale scope copy on static and professional pages.**
*Evidence:*
- The static guide header says "**Alberta + BC**" (`screens/x-desk-static-guide-aish.png`).
- The `/guides/` index says "ALBERTA, BC + FEDERAL BENEFITS" (`screens/x-phone-dark-guides-index.png`).
- The For-professionals page says "more than **35** verified Alberta, British Columbia, federal, and municipal programs" while the catalogue has 134 and covers Ontario (`screens/x-desk-page-professionals.png`).

*Improvement:* source these from the same scope constants as the SPA.

**P2-14. Disclaimer contradicts the privacy page.**
*Evidence:* the footer disclaimer says answers "are **never saved** or sent anywhere". The landing and privacy page say they are saved in this browser's IndexedDB, and the income step says "saved only in your browser so your progress survives a reload".
*Improvement:* use "stay on this device and are never sent to us".

### P3 — nice to have

- **P3-1. Answer chips are long and truncated.** "Pain, fatigue, seizures, or chan…" and "A disability stops me from work…". On phone the chip bar is 324 px tall for P2. Use short labels ("Pain/fatigue", "Can't work") and collapse the chips behind "Your answers (11) · Edit" on phone.
- **P3-2. No results heading hierarchy.** Results have no visible H1 (the H1 is the aria-hidden print plan). Group titles are styled divs, not headings. Screen-reader users can't jump between "Matches" and "More to check". Make the group titles H2 and the cards H3.
- **P3-3. Single-choice steps show a disabled "Next" button that is never needed** (auto-advance). It reads as broken to some users (`screens/p2-desk-light-step06-onset.png`). Hide it, or label it "Choose an answer".
- **P3-4. Visual seam.** A hard horizontal colour change runs through the wizard options at ~y 383 desktop / ~y 370 phone where the background layer ends (`screens/p2-desk-light-step06-onset.png`, `screens/p1-phone-dark-step05-functionalNeeds.png`).
- **P3-5. Phone header hides the brand name** (logo only), and the province tag disappears. Fine visually, but there is no way to see "Alberta" context on phone.
- **P3-6. Kicker wraps awkwardly on phone.** "HOW DAILY LIFE IS AFFECTED · STEP 5 OF / 10" splits the step count.
- **P3-7. City step help says "Start typing to find yours", but it is a native `<select>`** with 46–52 options (no typing on iOS). Change the copy, or use a combobox with search.
- **P3-8. Disability step is 213 words** of sub-labels (12 cards). The landing says "Answer a few checkboxes — no reading required". Shorten the sub-labels to about 4 examples each.
- **P3-9. The "Does not match" reason for the parking placard is an instruction**, not a reason: "Confirm inability to walk 50 metres…". Write reasons as "You said you can walk 50 m."
- **P3-10. Rank badges ("1", "2") only on "Matches" items.** P1's AISH/CPP-D, the highest-stakes items, get no ordering cue and sit in an editorial order. Consider a "Start with these 3" strip.
- **P3-11. The a11y panel has no theme or dark toggle** (it lives in the header switch, which is fine). The panel covers the bottom ~60% of the phone screen. Reset is the last item. These are fine, just noting it was checked: `screens/x-phone-a11y-panel.png`.
- **P3-12. Support page is thin** (87 words) and the About page is short. Both are fine, but both could link to "How matching works / why you see 'More to check'". That page would directly answer the "fluke" feeling.

---

## 2. Screen-by-screen notes

### Landing (`p1-desk-light-00-landing*.png`, `x-phone-landing-fold.png`, `x-desk-dark-landing-full.png`, `x-phone-dark-landing-full.png`)
- **Works:** clear H1 and two CTAs. Trust row (private / free / official links). Six "Where are you starting from?" life-event shortcuts. The feedback form offers a mailto alternative. Skip link is first in tab order. All header controls have a visible 2 px outline.
- **Confusing:** "takes about a minute" and "no reading required" (real flow: 11–16 screens). The preview card promises "8 benefits found · Matches your answers". The "Searching doesn't work" section is a marketing comparison that adds scroll for tired users. Landing is 630 words and ~4,000 px tall on desktop.
- **Phone:** FABs overlap the second CTA. Dark mode is fine.

### Questionnaire (`p*-step*.png`)
- **P1 steps (11):** Who → Disability (12 cards, 213 words) → Age (8 bands) → Documented? → Daily-life (13 options) → Province → Citizen → DTC → Situation → Income → City.
- **P2 (16):** adds Autism dx, Onset, MSP, BC assistance, Circumstances.
- **P3 (12):** adds Mobility 50 m.
- **Back:** works, and browser Back returns to landing from step 1. Every step has a Back/Exit button.
- **"Not sure":** present on documented, autism dx, MSP, BC assistance, circumstances, daily-life and DTC (with a helpful side-note link "How to check in 2 minutes"). Missing on onset, citizen, mobility, income and situation.
- **Side notes** are placed above the options, which is good. They open a help page and return to the same step.
- **Progress:** a thin bar plus "Step x of y", where y grows (P1-8).
- **Multi-select steps need "Continue"; single-select auto-advances.** This inconsistency is the root of P1-6.
- **Daily-life step on phone** is ~2,100 px with 13 options. Continue is far below the fold, and the FABs cover the option ticks.

### Results — see section 0 and P1-1…P1-7, P2-2…P2-4, P2-10.
- **Priority vs category:** by category gives 6 groups (Income 5, Tax credits 7, Services 3, Health 2, Discounts 3, Savings 1). That is more scannable than "priority", but it loses the Matches/More-to-check distinction entirely (`x-desk-results-bycategory.png`).
- **Print action plan** (`x-print-action-plan.png`) includes all 21 programs with official links and next steps. That is good, but it prints the Okotoks, CPP Children's and similar items too. Print only "Fits" plus items the user marked "Saved for later".
- **Tracker status select** on every card (7 states) is good for returning users, but noisy on first view.
- **Charitable funds:** clearly labelled "Separate from government programs… not included in the benefit count". Good.
- **Keyboard:** 16 Tabs from page top to the first card's action. Acceptable, but a "Skip to your programs" link would help.

### Benefit guide (`x-desk-detail-aish.png`, `x-phone-detail-autism-*.png`, `x-phone-dark-detail-dtc-full.png`, static `x-desk-static-guide-aish.png`)
- **Works:** the top block answers Does it match? / How much? / How do I apply? with the primary official CTA. The sidebar has difficulty, wait and phone. "Info verified July 2026" is shown. Back to results restores the scroll position (verified y = 7,301). "Requirements to check" has a "Read full requirements" disclosure.
- **Problems:** ~1,030 words for AISH. The "Good to know" heading appears twice. There are long tips (P2-5) and the broken practitioner copy (P2-6). AISH's guide has nothing for people *already on* AISH, other than buried tips about reporting and reopening.
- **URL routing:** the static guides (`/guides/aish.html`) are shareable, and `?view=privacy` works. In-app views (results, guides) have no URL of their own, so "Copy link to this guide" is the only share path.

### Grants / Organizations (`x-desk-page-grants.png`, `x-desk-page-organizations.png`, `x-phone-organizations.png`)
- Clean cards with WHO / WHAT / HOW TO APPLY and verified dates. Both filter to the user's province ("Showing Alberta and Canada-wide funds").
- Organizations have no filter (by need: forms help, legal, autism…). The page is 5,000 px. Add a "Help with forms / Legal / Employment / Family" chip row.

### About / Accessibility / Privacy / Support / Updates / Professionals / Impact
- About (201 words), Accessibility statement (266) and Privacy (558) are clear, plain-language and honest.
- "Data updates" is 5,562 words with a 165-word paragraph. It lists Ontario municipal records first to an Alberta user.
- Professionals has the stale "35 programs" copy (P2-13).

### AI assistant (`x-desk-assistant-consent.png`, `x-desk-assistant-ready.png`, `x-phone-assistant.png`)
- The consent gate is clear: it explains what is sent, says not to include name or health details, and says it won't decide eligibility or quote amounts. Focus moves to "I understand", then to the textarea. Close works.
- **Note:** the first sentence ("The feedback form is the other optional submission") is confusing in this context; drop it. On phone the panel is 432 px tall, which is fine.

### Accessibility panel (`x-desk-a11y-panel.png`, `x-phone-a11y-panel.png`, `x-desk-results-highcontrast-bigtext.png`)
- Read aloud, text size A−/A/A+, spacing, contrast, link highlight, reading guide, reduce motion and reset all work. Escape closes it and returns focus to the FAB.
- Text-size up ×2 (19 px root) plus high contrast produced no horizontal overflow on results.
- Focus is trapped inside the dialog (12 Tabs cycle within it). That is correct for a modal.

### Language switch (`x-desk-results-fr.png`, `x-desk-detail-fr.png`, `x-desk-landing-fr.png`) — see P2-8.

### Returning visitor (`x-desk-returning-visitor.png`, `x-desk-after-reload.png`) — see P2-9. Restore itself is fast and correct (same view, same results).

### Dark mode
No contrast failures spotted in the screenshots of the landing, results, guide, browse, grants, about or privacy pages (`p*-dark-*.png`, `x-*-dark-*.png`). The theme toggle is in the header. Dark-mode problems are the same layout issues as light mode, not colour issues.

---

## 3. Top 10 improvements (ranked by user impact ÷ effort)

| Rank | Improvement | Impact | Effort | Fixes |
|---|---|---|---|---|
| 1 | **Hide or collapse "only if…" programs** (unasked life-fact gates) under a closed "Programs that apply only in specific situations (n)" section with one-line "Only if you…" leads; count only fitting items in the headline | Very high: directly removes the "fluke" | Low–Med (tag facts in `FACT_REGISTRY`, filter in `renderResults`) | P1-1, P1-5 |
| 2 | **Add "What do you already receive?"** (AISH/ADAP/IS, PWD, ODSP/OW, CPP-D, DTC) and show a "You already have" strip; drop excluded combos | Very high for the AISH/ODSP/PWD majority | Med | P1-2 |
| 3 | **Use the chosen city to exclude other towns' programs** (Okotoks etc.) and **fix the province filter** so Ontario local programs don't appear in AB/BC lists | High, and trust-restoring | Low | P1-3, P1-4 |
| 4 | **Honest headline**: "X fit what you told us · Y worth checking". Remove or rename the "Matches your answers — value varies" money band. Align the landing preview | High | Low | P1-5 |
| 5 | **Fix the keyboard auto-advance** (arrow keys must not submit) | High for keyboard/SR users; legal risk | Low | P1-6 |
| 6 | **Compact result cards** (≤ 350 px on phone): short value line, details behind a disclosure, status selector only on demand, one "Matches" label not three | High on phone (page from ~25,000 px to ~8,000 px) | Med | P1-7, P3-1 |
| 7 | **Ask province first, show stable progress, and correct the time claim** (3–5 min); add "Not sure / Prefer not to say" to income, citizen, onset and mobility | Med–High | Low–Med | P1-8, P2-1 |
| 8 | **Household wording for BC circumstances when answering for a child**, skip onset for under-18s, and remove "Alberta" help text for BC | Med (P2 accuracy) | Low | P1-9, P2-1 |
| 9 | **"Start here" box above the cards**: top 3 next actions plus the 3–4 shared documents; hide when empty | Med | Low | P2-2, P3-10 |
| 10 | **Returning-visitor banner + FR wording parity + stale scope copy fixes** (Alberta + BC → AB/BC/ON, "35 programs", disclaimer "never saved") | Med (trust, shared devices, francophones) | Low | P2-8, P2-9, P2-13, P2-14 |

Also worth scheduling after the top 10: phone FAB overlap (P2-7), broken practitioner copy (P2-6), browse paging and default-province filter (P2-11), and guide de-duplication and tip trimming (P2-4, P2-5).

---

*Artifacts:* all screenshots are in `research/2026-10-site-audit/screens/` (160 PNGs). The Playwright walkers were throwaway scratchpad scripts and are not committed. The local server on port 8771 was stopped after the run.
