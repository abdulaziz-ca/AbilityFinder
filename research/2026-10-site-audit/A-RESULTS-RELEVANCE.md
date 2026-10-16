# A — Results relevance: what people see first, and why

Audit date 2026-10-16 · worktree `oct-resume` · read-only on product code.
Tools and raw output: `research/2026-10-site-audit/tools/` (see §8).

## 0. The complaint, restated as something we can measure

> "it felt fluke when I got my benefits, there was just so many others that I just didn't
> qualify for … I want what the users are most likely to get based on their current
> situation; if that changes then of course we change it with the new benefits."

Measurable version: for real people, how much of the list is (1) a real match, (2) a
genuine "maybe — the program decides", or (3) something their own answers already rule
out for now? Where does group (3) appear on screen? What causes it?

## 1. Measurement

### Method

- `tools/load-engine.js` loads `public/data.js` and the production slice of
  `public/app.js` (helpers → `REQS` → `evaluate()` → `STEPS`/`visibleSteps`, plus
  `evaluateAnswers()` and `benefitProvince()`) into a Node `vm`. This is the same slice
  approach as `test/confirmed-facts.test.js` and the #209 measurement. No browser start-up
  and no re-implementation of the engine.
- `tools/personas.js`: 15 personas, written **only** with the wizard's own answer model
  (`BLANK()`, `app.js:39`). Steps the wizard skips for that person keep their `BLANK()`
  defaults, as in the live app. Example: `circumstances` is BC-only (`app.js:1816`).
- `tools/measure-relevance.js` reproduces `renderResults()` (`app.js:4016`). It takes the
  ready and almost groups sorted by `priorityScore`, and the "no" list filtered by
  `benefitProvince`. It then classifies every unmet requirement of every "More to check"
  program:
  - **(a) program decides.** An always-false gate triaged EXTERNAL in #208, such as a
    clinical, adjudication or assessor decision.
  - **(b) a fact we did not ask, or the person said "not sure".** Either an always-false
    gate triaged ANSWERABLE (a registration, receipt, money already spent, status), or an
    answer-driven gate whose answer is "unsure" or was never asked.
  - **(c) contradicted by the situation they described.**
    - **c-step:** an answer-driven *soft* gate their definite answer fails, where a step
      could change it. Examples: `dtc`=no, no professional documentation, no PWD
      designation, no autism diagnosis yet.
    - **c-mismatch:** the same kind of gate, but the mismatch is with age, function or
      ownership.
    - **c-judged:** an always-false gate whose own published criterion is contradicted by
      a definite answer. Examples: Okotoks residency for someone in Toronto, an
      employment program for someone who said they are not working, looking or studying,
      a mobility refund with no mobility limit, or an income band wholly above the largest
      published ceiling. This is a conservative analysis judgement, not an engine fact.
  - **(d) other.** Claimed by someone else (Canada Caregiver Credit).
  - The class of a program is its worst need, in the order c > d > b > a.
- I cross-checked the persona model against the live site. The audit screenshot
  `screens/p1-desk-light-r0-results-fold.png` (Calgary, mental health + chronic, 19–59,
  documented, no DTC, unable to work, lower income) shows **"21 benefits you may be able
  to get"**. That is the exact count the harness produces for P01.

### Results: 15 personas, current production logic

| Persona | Ready | Almost | Shown "no" | (a) | (b) | **(c)** step / mismatch / judged | (d) | Programs shown to everyone † | Position of first (c) item | (c) in top 10 |
|---|---:|---:|---:|---:|---:|---|---:|---:|---:|---:|
| P01 single adult on AISH, 45, Calgary | 1 | 20 | 50 | 4 | 8 | **7** (4/0/3) | 1 | 7 | 2 | 5 |
| P02 working wheelchair user with DTC, Vancouver | 5 | 18 | 86 | 2 | 12 | **3** (1/2/0) | 1 | 7 | 10 | 1 |
| P03 parent of autistic 8-year-old, Surrey | 2 | 20 | 87 | 3 | 9 | **7** (5/1/1) | 1 | 7 | 3 | 4 |
| P04 senior 67, mobility, Toronto | 2 | 14 | 48 | 5 | 6 | **2** (0/0/2) | 1 | 7 | 3 | 2 |
| P05 on ODSP, 50, Ottawa | 2 | 18 | 44 | 3 | 13 | **1** (0/0/1) | 1 | 7 | 6 | 1 |
| P06 low-income LD student, 20, Edmonton | 0 | 23 | 48 | 7 | 9 | **6** (4/0/2) | 1 | 7 | 2 | 3 |
| P07 chronic pain, no DTC, middle income, Kelowna | 1 | 23 | 85 | 3 | 11 | **8** (6/1/1) | 1 | 7 | 2 | 5 |
| P08 PWD designation, 55, Victoria | 10 | 21 | 78 | 5 | 12 | **3** (0/2/1) | 1 | 7 | 14 | 0 |
| P09 Deaf worker, middle income, Red Deer | 0 | 20 | 51 | 4 | 9 | **6** (5/0/1) | 1 | 7 | **1** | 4 |
| P10 parent of 4-year-old wheelchair user, Hamilton | 1 | 17 | 46 | 5 | 9 | **2** (1/1/0) | 1 | 7 | 4 | 1 |
| P11 MS, higher income, has DTC, Burnaby | 3 | 24 | 82 | 5 | 14 | **4** (1/1/2) | 1 | 7 | 6 | 2 |
| P12 intellectual disability, 24, Lethbridge | 0 | 21 | 50 | 5 | 12 | **3** (0/0/3) | 1 | 7 | 5 | 2 |
| P13 senior 70, low vision, Kingston | 2 | 12 | 50 | 4 | 6 | **1** (0/0/1) | 1 | 7 | 4 | 1 |
| P14 parent of 15-year-old, anxiety + ADHD, Calgary | 0 | 16 | 55 | 3 | 12 | **0** | 1 | 7 | — | 0 |
| P15 senior 66, low income, mobility, Edmonton | 0 | 18 | 53 | 4 | 8 | **5** (0/2/3) | 1 | 7 | 2 | 3 |
| **Total** | **29** | **285** | 913 | 62 | 150 | **58** (27/10/21) | 15 | 105 | median ≈ 3.5 | **34** |

† These programs have no answer-based gate at all, so they appear for every persona.

**Key numbers**

- **Only 29 of 314 listed programs (9%) "Match your answers."** The other 285 (91%) are
  "More to check". 5 of 15 personas get **zero** matches, and their whole list is
  "More to check".
- The headline counts both groups, so the page opens with "21 benefits you may be able
  to get" when 1 matches (P01; confirmed live).
- Of the 285 "More to check" items:
  - (a) 62 (22%) are genuinely program-decides.
  - (b) 150 (53%) hinge on a fact we did not ask.
  - **(c) 58 (20%) are ruled out for now by the person's own answers.** 37 of these are
    purely mechanical (answer-driven soft gates); 21 are judged from the gate's own
    published rule.
  - (d) 15 (5%) are claimed by someone else.
- **(c) items sit high on the page.** The median first (c) item is the **2nd–4th card**.
  13 of 15 personas have at least one (c) in their first 10 cards: 34 of 150 top-10
  slots. For P09 the **first card on the page** is RDSP, which requires a DTC they said
  they don't have.
- **7 programs (37% of all "More to check" slots) are identical for everyone.** They have
  no answer-based gate:
  - DTC
  - CDCP
  - Medical Expense Tax Credit
  - Disability Supports Deduction
  - Canada Caregiver Credit
  - CPP Children's Benefit
  - Excise Gasoline Tax Refund
- **The collapsed "Does not match these answers" list holds 44–88 items.** For every
  persona, 14–38 of them belong to a different province (§2, R6).

### Three walk-throughs: the list a user sees today, in order

"Proposed" is the recommended layout from §3. Need classes appear as `gate: class`.

**P01 — Single adult, 45, on AISH, Calgary.** Answers: mental health + chronic,
documented, fatigue/pain + care coordination, no DTC, "a disability stops me from
working", lower income, Calgary. Page header today: **"21 benefits you may be able to
get"**.

| # | Today | Program | Why it is not ready | Proposed |
|---|---|---|---|---|
| 1 | Matches | Calgary Fair Entry | — | Matches your answers |
| 2 | More to check | RDSP | `dtc`: **c-step**; `rdspOpening`: b; window: a | If your situation changes → after the DTC |
| 3 | More to check | CPP Disability | `cppContrib`: b | May fit you now |
| 4 | More to check | Alberta Adult Health Benefit | income: b; gateway: b | May fit you now |
| 5 | More to check | Canada Disability Benefit | `dtc`: **c-step**; tax filing: b; status: b | If your situation changes → after the DTC |
| 6 | More to check | DRES (employment supports) | `dresEmploymentRoute`: **c-judged** (said unable to work) | If your situation changes |
| 7 | More to check | **Okotoks** Recreation Fee Assistance | `okotoksResidency`: **c-judged** (lives in Calgary) | If your situation changes |
| 8 | More to check | CPP Children's Benefit † | b | Check if these apply to you (one line) |
| 9 | More to check | Home Accessibility Tax Credit | `hatcQualifyingPerson`: **c-step** (no DTC, under 65) | If your situation changes |
| 10 | More to check | CDCP † | b | one line |
| 11 | More to check | Medical Expense Tax Credit † | b | one line |
| 12 | More to check | Canada Caregiver Credit † | d | one line |
| 13 | More to check | AB Service Dog ID Card | b | one line |
| 14 | More to check | DTC † | a, a | DTC pathway card |
| 15 | More to check | Multigenerational Home Reno Credit | **c-step** | If your situation changes |
| 16 | More to check | Excise Gasoline Tax Refund † | **c-judged** (no mobility limit) | If your situation changes |
| 17 | More to check | Disability Supports Deduction † | b | one line |
| 18 | More to check | CAPCC (continuing-care residents) | b | one line |
| 19 | More to check | Special Needs Housing | a | May fit you now |
| 20 | More to check | **AISH** | a, a | May fit you now |
| 21 | More to check | ADAP | a, a | May fit you now |

Today, the AISH-type person sees **AISH 20th of 21**. Ahead of it are RDSP and the Canada
Disability Benefit, which need a DTC they said they lack, plus a program from another
town. Proposed: 1 match, 1 DTC card, 5 "May fit you now" cards (AISH 4th, behind CPP-D, Adult Health
and Special Needs Housing), 7 one-line items, and 7 items behind "If your situation changes".

**P03 — Parent of an autistic 8-year-old, Surrey.** Answers: diagnosis yes, documented,
communication + sensory, MSP yes, no BC assistance, homeowner, no DTC yet, elementary
school, middle income. Header today: **"22 benefits you may be able to get"**, with
2 matches: Fair PharmaCare and Autism Funding 6–18.

Cards 3–5 are RDSP (`dtc` c-step), Child Disability Benefit (`dtc` c-step) and **BC Bus
Pass** (`bcBusPassStatus`, c-step: PWD designation is for adults). Later cards include
the Medical Transportation Supplement (`bcMedTransportNeed`, c-mismatch: no medical-travel
need selected), the HATC and MHRTC (c-step) and the Excise Gasoline Tax Refund
(c-judged). In total, 7 of the 20 "More to check" items are (c).

Proposed:

- 2 matches
- DTC card: "It could open up 2 more programs for you", which are the Child Disability
  Benefit and the RDSP
- 6 "May fit you now" cards: MSP Supplementary, Healthy Kids, SPARC parking, Home Owner
  Grant, Surrey LAP, At Home Medical
- 6 one-liners: CDCP, METC, CCC, CPP Children's, FNHA, Disability Supports Deduction
- 7 items behind "If your situation changes"

**P07 — Adult, 42, chronic pain, no DTC, middle income, Kelowna.** Header today:
**"24 benefits you may be able to get"**, with 1 match (Fair PharmaCare). Cards 2–4 are
RDSP, Canada Disability Benefit and CWB Disability Supplement, all DTC-gated (`dtc`=no).
Card 6 is the BC Bus Pass (`bcBusPassStatus`: needs PWD status, answered "none"). 8 of 23
are (c).

Proposed:

- 1 match
- DTC card: "could open up 3 more"
- 8 "May fit you now" cards
- 6 one-liners
- 8 later items, 3 of them under the DTC sub-list

Full per-persona listings: run the tool with `--walk P01,P03,P07` (or any ID prefix).

## 2. Root cause: what produces category (c)

`evaluate()` (`app.js:1579–1605`) has three outcomes. Any unmet `fixed` gate gives "no".
Otherwise any unmet gate gives "almost". A gate's `fixed` flag means "a trait the user
can't easily change" (`app.js:201–205`). **Nothing distinguishes "we don't know this" from
"you told us this is not true today".** Both become "More to check", in one list sorted by
`priorityScore`. That score is editorial value plus ease; it knows nothing about evidence
(`app.js:1519`).

| # | Pattern | Gate keys (`public/app.js` line of the REQS entry) | Measured (c) |
|---|---|---|---|
| R1 | **The DTC gate is soft and ignores a "No, not yet" answer.** `met: dtc==="yes"`, `fixed:false`, so `dtc`=no and `dtc`=unsure give the same "More to check". These programs score high on value, so they sort to the top. | `dtc` :216 (RDSP, Canada Disability Benefit, Child Disability Benefit, CWB Disability Supplement); DTC-or-65 gates `hatcQualifyingPerson` :942, `mhrtcQualifyingIndividual` :1148 | 12 DTC-gated + 11 HATC/MHRTC c-step items; RDSP is card #1–2 for every `dtc`=no adult under 60 (P01, P06, P07, P09) |
| R2 | **Other soft "step" gates ignore a definite no.** | `disabilityDoc` :568, `bcPwdStatus` :859, `bcBusPassStatus` :874, `autismDiagnosis` :766, `oapDiagnosis` :368 | 4 (BC Bus Pass for a child and for non-PWD adults) |
| R3 | **Soft age, function or ownership gates.** Deliberately soft for edge cases, but they also catch the plain case. | `aishAge` :666 / `adapAge` :673 (65+: AISH/ADAP listed for seniors; per their own text, OAS-eligible people are not eligible), `bcMedTransportNeed` :830, `bcParkingMobility` :1083, `abPlacardMobility` :753, `hatcEligibleDwelling` :935, `hamiltonFareRoute` :433 (soft low-income gate) | 10 c-mismatch (bcMedTransportNeed 5, hatcEligibleDwelling 2, aish/adapAge 2, hamiltonFareRoute 1) |
| R4 | **Always-false "external" gates that a definite answer already contradicts.** The engine can't see it, because `met` is `() => false` whatever the answers. | `okotoksResidency` :1386 (the Okotoks program has **no** province or city fixed gate, `data.js:4625`, so every low-income user in AB, BC or ON sees it; it is card #3 for the Toronto senior), `dresEmploymentRoute` :593 (DRES for people who said they are not working, looking or studying), `exciseMobilityImpairment` :1168, `cppDisabilityContributorLink` :476 for 60+ adults, income-ceiling gates for the "higher income" band (`acsdIncome` :350, `bcSupplementaryBenefitsEligibility` :806, `bcHealthyKidsIncome` :1029, `planGClinicalAndFinancialNeed` :784, `coquitlamIncome` :1053, `cwbEligibility` :524, `lowIncomeOrDisabilityIncome` :440, AISH, ADAP, ODSP and BC assistance financial gates) | 21 c-judged |
| R5 | **Seven programs have no answer-based gate at all**, so everyone sees them as "More to check". | `dtc` (`prolonged` :222, `certifier` :234), `cdcpRequirements` :992, `disabilityMedicalExpensesPaid` :999, `caregiverSupportClaim` :1006, `cppDisabilityContributorLink` :476, `exciseMobilityImpairment` :1168 | 105 slots (37%) — noise rather than (c), but the main reason the list "felt fluke" |
| R6 | **The "Does not match these answers" list leaks other provinces.** `benefitProvince()` (`app.js:4086`) recognises only the `calgary` and `edmonton` city gates. Every other municipal program (Red Deer, Ottawa, Toronto, Waterloo…) counts as national. | — | 14–38 out-of-province items per persona in the collapsed list (a BC user sees 38 Ontario and Alberta municipal programs) |

### Two correctness bugs found on the way (they hide or mislabel programs)

- **B1. False refusal of a legitimately possible program.**
  - The `homeowner` gate is `fixed: () => !circumstanceUnknown()` (`app.js:1147`), but
    the `circumstances` question is **BC-only** (`skipIf`, `app.js:1816`).
  - So every Ontario user gets **Waterloo Ontario Renovates** (`data.js:1132`) under
    "Does not match these answers", with the reason "You or the eligible family member
    must own and live in the home…", even though they were never asked. Verified with a
    Kitchener persona.
  - For the same reason, `hatcEligibleDwelling` can never be met outside BC.
- **B2. The DTC record says "More to check" to people who said they have the DTC.**
  `prolonged` and `certifier` are always false (`dtc` for `dtc`="yes" → almost; verified).
  It should read "You told us you have this".
- **To verify against sources (not asserted).**
  - ODSP is listed for a 67-year-old: the gate is `age18plus` (`data.js:2752`).
  - `bcWorkAbleSelfIdentify` (`app.js:1189`) uses professional documentation, but the
    program, by its own text, asks only for self-identification.

The scenario panel is not a cause: it is closed by default and never writes answers. But
it sits **above** the results list (`app.js:4047`). It invites "what if" thinking before
the person has seen what fits them now.

## 3. Design options

All options leave `evaluate()` statuses and `priorityScore` weights untouched. Changing
the weights is blocked on #68 / UX-03 (REMAINING-WORK.md:79): the owner has not yet
supplied a profile set or threshold. The 15 personas here could seed that set.

"Visible full cards" = cards rendered expanded on first load. Today: 314 across the 15
personas, all 29 matches included.

| | **A. Situation tiers** (relabel by evidence) | **B. Likelihood score** (one list, re-sorted) | **C. Contradicted → "no"** (make soft gates fixed) | **D. DTC-first pathway** |
|---|---|---|---|---|
| What changes | Split "More to check" into "May fit you now", a one-line "Check if these apply to you" list, and a collapsed "If your situation changes" group. The DTC becomes a pathway card. | Sort the ready + almost list by an evidence score (c −40, d −15, b −8, a −5). | Contradicting answers refuse the program. | One DTC card at the top. DTC-gated programs are nested under it ("could open up N"). |
| Effect on the 15 personas | Visible full cards **314 → 144 (−54%)**; 112 become one-line items; 58 sit collapsed (46 + 12 under DTC). (c) in the top 10: **34 → 0**. Matches: 29 → 29. | Visible cards 314 → 314; (c) in the top 10: 34 → **0**; first (c) moves to position 14–29. Length unchanged. | Same 58 leave "More to check", but go into the "no" list (913 → 971). The 12 DTC-gated items are labelled "Does not match". | Moves 12 DTC-gated items + 15 DTC cards; (c) in the top 10 drops only by the DTC share. |
| Overclaim risk | None for ready: status untouched. "May fit you now" stays hedged. | Low, but a numeric "likelihood" invites false precision. The weights are editorial, which is exactly what UX-03 refused. | **Under-claim/hiding risk.** DTC, documentation and PWD are obtainable. It breaks the oracle's declared product promises (`oracle-spec.js:383–393` `dtc`/`disabilityDoc` "no yet → almost", `:561–565`, `:648–655`). | None |
| Hiding legit programs | No: every program stays on the page with a count; collapsed groups are named. | No | Yes, behind a refusal tone in a list of 44–88 items | No |
| Cognitive load / a11y | Shorter first screen. Native `<details>` with the count in `<summary>`. Headings per group. No colour-only meaning. One-line list = less reading. | Same long list. Order changes without a visible reason. | Shorter, but "Does not match" grows and reads as rejection | Small |
| Effort / files | M: `app.js` (REQS `later`/`laterCue` on ~13 gates in phase 1, `evaluate()` flag, `renderResults`/`renderMatchedGroups`, compact list, DTC card, scenario panel), `i18n.js`, `styles.css`, `index.html` pin, oracle + tests | S/M, but blocked on #68 | M, plus oracle rewrite and re-review of every soft gate | S |
| Verdict | **Recommend (with D folded in)** | Reject: does not shorten the list and needs editorial weights | Reject: hides obtainable programs, breaks product promises | Fold into A |

Option E, considered but out of scope: one wizard question, "Which of these do you already
get? AISH/ADAP · ODSP/OW · CPP-D · GIS · none". It would resolve many (b) items:
`lowIncomeOrDisabilityIncome` ×7, `municipalProgramEligibility` ×2, `ottawaOdspReceipt`,
the `adultHealthGateway` exclusion, and AISH-holder relevance. #209 rejected new wizard
questions for *readiness*; the case for *relevance* is different. Revisit after A ships,
with usability evidence. Today the AISH persona cannot even say they are on AISH.

### Phasing (for the recommended A + D)

- **Phase 1 needs no new benefit facts.** Add `later` predicates only on answer-driven
  soft gates (R1–R3): 37 of the 58 (c) items move.
- **Phase 2 adds the 21 judged items** (R4). Each predicate quotes a threshold or route
  already in that gate's `unmet` text, and each must be re-read against the official
  source that day (AGENTS rule 1). That covers the Okotoks, DRES, excise, CPP-children
  and higher-income-band rules.
- The fixes for R6, B1 and B2 are separate, independent correctness changes.

## 4. Recommendation: exact rules

**Invariant:** grouping never changes `status`. The set rendered under "Matches your
answers" is exactly today's `status === "ready"` set, and "no" stays "no".

### New gate fields (REQS)

- `later: () => boolean`. It is true only when the person's own *definite* answer says
  the requirement is not met now. It must return false when the relevant answer is
  "unsure", unanswered or never asked. It must imply `!met()`.
- `laterCue: string` (≤80 code points, no trailing period). It says what would need to
  change, in the person's terms (subject-aware via `who()` where needed).
- `evaluate()` copies `later` onto each need: `needs.push({..., later: !!(req.later && req.later())})`.

### Phase 1 predicates (answer-driven only)

| Gate | `later` | `laterCue` |
|---|---|---|
| `dtc` | `answers.dtc === "no"` | You get the Disability Tax Credit |
| `hatcQualifyingPerson`, `mhrtcQualifyingIndividual` | `answers.dtc === "no" && !isSeniorAge()` | You get the Disability Tax Credit or turn sixty-five |
| `disabilityDoc` | `answers.disabilityVerified === "no"` | A professional documents the disability |
| `bcPwdStatus` | `["none","other"].includes(answers.bcAssistance)` | You get PWD designation |
| `bcBusPassStatus` | `["none","other"].includes(answers.bcAssistance) && !isSeniorAge()` | You get PWD designation or a listed senior benefit |
| `autismDiagnosis`, `oapDiagnosis` | `answers.autismDiagnosis === "no"` | An autism diagnosis is made |
| `aishAge`, `adapAge` | `isSeniorAge()` | You cannot get Old Age Security |
| `bcMedTransportNeed` | `!hasFunctionalNeed("medicalTravel") && !functionalNeedUnknown() && answers.functionalNeeds.length > 0` | You must travel for essential medical care |
| `bcParkingMobility`, `abPlacardMobility` | `answers.canWalkFar === true && !hasDisability("vision")` | Walking becomes hard for you |
| `hatcEligibleDwelling` | `answers.province === "BC" && hasCircumstance("none")` | You or a relative own the home you live in |

Also in phase 1, for the soft income gates `hamiltonFareRoute` :433, `richmondFinancialHardship` :957
and `waterlooHomemakingFinancial` :1238: `answers.income === "high"`, with the cue "Your household
income is lower". This is deliberately more conservative than the measurement: P10's
moderate-income Hamilton item would stay "May fit". So phase 1 moves 36, not 37, of the
measured items.

Not given `later`, because a route we never asked about still fits:
`bcStcAgeOrFamily`, `yorkRecreationAge`, `abSpecialNeedsHousingStatus`,
`achbOlderDependent`, `bcWorkAbleSelfIdentify`.

### Phase 2 predicates (source re-read required)

| Gate | `later` | `laterCue` |
|---|---|---|
| `okotoksResidency` | city is set and not Okotoks/Other | You live in Okotoks or Foothills County |
| `dresEmploymentRoute` | no working, looking or student in `situation` | You work, look for work, or study |
| `exciseMobilityImpairment` | `canWalkFar !== false` and no `transitBarrier` or `unsure` | A lasting mobility limit makes transit unsafe |
| `cppDisabilityContributorLink` | `forWho !== "child"` and age 60+ | For a child of someone on CPP disability |
| Income-ceiling gates | `answers.income === "high"` **only where the largest published ceiling across family sizes is under $80,000** | Your household income is lower |

Okotoks also needs the data fix of adding the `ab` gate.

### Group assignment for `status === "almost"`, in this order

1. Any need has `later` → **"If your situation changes"** (collapsed). If one of those
   needs is `dtc`, or a DTC-or-65 gate while `dtc`=no, it goes in the sub-list **"After
   you get the Disability Tax Credit"**.
2. `b.id === "dtc"`:
   - `answers.dtc !== "yes"` → **DTC pathway card**, the first card after the matches.
   - `answers.dtc === "yes"` → a one-line "You told us you have this" (fixes B2).
3. Either of these → **"Check if these apply to you"** (a one-line list: name, its
   `short` cue, guide link):
   - every unmet need is a self-known status/possession/spend fact (`STATUS_GATES` in the
     tool: continuing-care home, service dog, First Nations status, a parent on CPP-D,
     transit registrations and cards, renovation or medical money already spent, a
     secondary unit, a supporter's claim, ATP approval);
   - the program has no answer gate other than a province gate.
4. Otherwise → **"May fit you now"** (full cards).

Within each group, keep today's `priorityScore` order (weights are #68's decision).

### Copy (grade ~6, honest, English; FR later)

- Headline: **"{n} programs to look at now"**, where n = matches + "May fit" + DTC card.
  Sub-line: **"{m} match your answers. The program decides if you qualify."** If
  m = 0: **"None match all your answers yet. These are the closest. The program decides
  if you qualify."**
- Matches: unchanged, "Matches your answers" plus "Based on what you told us. The
  program decides if you qualify."
- DTC card: **"Start with the Disability Tax Credit"** / "Many programs need it first. A
  medical practitioner fills in part of the form. The CRA decides." If k > 0, add: "It
  could open up {k} more programs for you."
- **"May fit you now"** / "Your answers fit these so far. Each has rules we did not ask
  about. The program decides if you qualify."
- **"Check if these apply to you"** / "We did not ask about these. Read the line under
  each one."
- Collapsed: **"If your situation changes ({n})"** / inside: "These do not fit what you
  told us today. Each one says what would need to change. You can still read how to
  apply." Per item: "**What would need to change:** {laterCue}".
- Remove the conditional-only money band title "More to check" when there are no
  matches. Use the "May fit" wording instead.

### How the "What if my situation changes?" panel relates

- **Move it** from above the list (`app.js:4047`) to directly under the collapsed "If
  your situation changes" group. Current situation comes first; "what if" comes after.
- Give each later item whose cue maps to a panel control (situation, age, income, city)
  a **"Try this change"** button. It opens the panel with that change pre-selected. It
  stays memory-only and never writes answers (`app.js:136`).
- **Add a DTC control** ("If you get the Disability Tax Credit"). The DTC is the most
  common lever, and today it is not in the panel.
- The panel's diff must use the **same tier function** on the hypothetical answers.
  Report "Would move to Matches your answers / to May fit you now / would leave …" rather
  than today's ready+almost "gain", which counts later-to-later moves as a gain
  (`app.js:3913–3923`).
- Rule of one source: the group membership shown on the page equals the tier function on
  the real answers, and the panel shows the tier function on the hypothetical answers.

## 5. Guard tests needed

1. **Matches invariance (blocking).** For every oracle persona (best case + all
   violations) and the 15 audit personas, the rendered "Matches your answers" id set ==
   `status==="ready"` set, and statuses equal pre-change statuses. Mutation: a tier that
   upgrades must fail.
2. **No hiding.** Every ready+almost program appears exactly once across the groups. The
   group counts sum to the evaluated totals. The collapsed group exists with its count in
   `<summary>`, and every item in it has a `laterCue` and a guide link.
3. **`later` honesty, per gate.**
   - `later()` ⇒ `!met()`.
   - `later()` is false when any answer it reads is "unsure", null or never asked.
   - Add `tier` to the oracle violations. For example `dtc` "no DTC yet" → almost + later;
     `dtc` "unsure" → almost + mayFit. Bump `SPEC_VERSION`.
   - The best case is never later.
4. **Fixed precedence.** A program with any unmet fixed gate is "no" whatever its
   `later` flags.
5. **Persona regressions** (the 15 personas as a fixture):
   - Okotoks is never "May fit" outside Okotoks.
   - DTC-gated programs are later-dtc when `dtc`=no and mayFit when `dtc`=unsure.
   - AISH/ADAP are later for 65+.
   - No (c)-class program is among the first 10 visible cards.
6. **Scenario parity.** With no hypothetical change, the panel's tiers equal the page's
   tiers. The panel never mutates `answers` or `confirmedFacts`.
7. **Cue lint.** `laterCue` ≤80 code points, no trailing period, passes
   `npm run check:surfaces` (dense-surface ratchet must not rise).
8. **Province leak (R6).** No "Does not match" item belongs to another province's
   municipality.
9. **B1.** An Ontario (Kitchener) homeowner-unknown persona is not refused for Waterloo
   Ontario Renovates. Re-run after asking `circumstances` in all covered provinces or
   softening `homeowner` when unasked.
10. **B2.** `dtc`="yes" renders the DTC as "You told us you have this", not "More to
    check".
11. **Print / a11y.**
    - The personal action plan includes Matches + May fit, and lists later items as
      names only.
    - Keyboard and screen-reader names for the collapsed groups.
    - No `aria-live` on regrouping.
    - 320 px reflow.
    - Dark, light and contrast themes with fresh reloads, for self, child and family.

## 6. What this does *not* fix

- **(b) remains the largest class: 53%.** These are facts we never asked, such as
  receipts, registrations and money spent. The recommendation moves self-known ones into
  one-liners, but only the #209 optional checks or option E can resolve them.
- **Ordering inside a group is still editorial** (`priorityScore`). AISH stays 4th of 5
  in P01's "May fit". That is #68's call; these personas are offered as its profile set.
- The income bands are coarse. Phase 2 uses only the high band against ceilings under
  $80k. Moderate income is never treated as contradicting.

## 7. Limitations of this measurement

- The personas are synthetic, though built from the real answer model. One was
  cross-checked against a live screenshot. This is not user research.
- The (c-judged) class is an analysis judgement, quoted from each gate's `unmet` text and
  deliberately conservative. Treat INCOME_CEILING values for needs-tested programs (set
  at $50–60k so that no moderate-income household is ever judged out) as placeholders,
  not facts.
- The #208 triage was used as-is for always-false gates. 13 newer gates were triaged by
  me from their `unmet` text (`LATE_TRIAGE` in the tool).

## 8. Reproduce

```sh
node research/2026-10-site-audit/tools/measure-relevance.js                         # all tables
node research/2026-10-site-audit/tools/measure-relevance.js --walk P01,P03,P07       # walk-throughs
node research/2026-10-site-audit/tools/measure-relevance.js --json research/2026-10-site-audit/tools/relevance-results.json
```

Files:

- `tools/load-engine.js`: vm loader of the production engine
- `tools/personas.js`: the 15 personas
- `tools/measure-relevance.js`: classifier, prototype tiers, options B/C counts
- `tools/relevance-results.json`: per-persona, per-program classification and proposed
  group

No product file was edited.
