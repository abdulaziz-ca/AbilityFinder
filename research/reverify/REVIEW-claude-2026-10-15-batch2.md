# Review (agent:claude) of Codex batch-2 fixes, 2026-10-15

Scope: git diff of public/data.js, public/app.js, e2e, test. Syntax: node --check passes on app.js, data.js, oracle-spec.js, factual-batch.test.js.
Verdict: APPROVED (no blocking findings). Four low/medium non-blocking notes below.

## 1. Item-by-item (decision followed, all surfaces)
1 csg-dse: summary, note, about all changed as prescribed; source URL unchanged (deliberately, per decision). Leftover tips[1] "Can cover ADHD/learning coaching, tutoring..." is hedged by "Can" (low, see N3).
2 Edmonton $36: gone from amount, BENEFIT_VALUES, steps[2]; grep "$36" in data.js/app.js hits only RAMP $36,900 (unrelated). $35/$50 by household income matches snapshot ("$35 monthly Ride Transit Arc card", "$50 monthly ... Arc card" per band). AISH-route price not stated: correct.
3 Edmonton hedge: note and tips[1] replaced with "may be eligible" wording; "One application covers both" and "automatically considers" removed. Source: "You may be eligible for the Ride Transit Program and/or the Leisure Access Pass".
4-6 HATC: requires = [hatcQualifyingPerson, hatcEligibleDwelling, hatcQualifyingRenovationSpend]. Dwelling text matches snapshot ("owned (jointly or otherwise) by the qualifying individual ... ordinarily inhabited (or is expected to be ordinarily inhabited)"; family-owner "does not, throughout the year, own ... and ordinarily inhabit another housing unit in Canada"; co-op share). "$20,000 a year" and "non-refundable" in snapshot. HATC summary rewritten, now matches.
7 Lethbridge amount: "up to $150 per person per season toward one recreation or culture program, while funds are available" + "you pay for one month, two are free" (snapshot: "participants pay for a 1 month bus pass and receive 2 additional months for free"). BENEFIT_VALUES updated.
8 Lethbridge summary/steps: "separate application form for each" (three forms in snapshot). Done.
9 METC dependants: no leftover "any other dependant" (grep). steps split in three with residency only on the second group, as snapshot lists. about, aboutList.items[2] and the requiresNote-level sentence at ~3500 updated.
10 METC line 33099: steps now total on 33099, threshold on the line below, remainder on following line; about/aboutList.lead updated. Matches Steps 1-3 in snapshot.
11 METC 12-month tip: "not already claimed in the prior year" matches "did not claim them in 2024".
12-14 Medicine Hat: "up to 75%", per person, separate $200s, "regular-priced City recreation programs and admissions at City-run pools and leisure centres", "Esplanade education programs provided directly by Esplanade staff" in amount, summary, about, new aboutList, BENEFIT_VALUES. All quoted in snapshots. No "arts programs" leftovers (grep).
15 Medicine Hat letter: social-worker letter now "only when no other documents are available", 30 days, current relationship, three statements, per-household-member 18+; all verbatim-supported.
16 Medicine Hat time: "within two weeks ... missing information may delay" in steps[3], detail.time, BENEFIT_META.wait. No "about two weeks" left for this record (Alberta service-dog hit at 4018/4042 is another record).
17 RDSP: "may add/pay", "depending on family income/contributions" in summary, about, aboutList.lead. Snapshot: "may also get grants and bonds"; "Family income and amount of contributions determine".
18-19 Richmond: "many drop-in programs and services", "most registered programs" in amount, summary, note, BENEFIT_VALUES. No bare "Unlimited"/"90% off registered" left.
20 Richmond gate: richmondFinancialHardship {fixed:false, met: income low OR bcAssistance pwd}; eligibility.items[1] and requiresNote now name the two methods. Snapshot-supported.
21 Saanich amount/about: two options, 52 regional visits, $80-120, Option 2 50% off annual Regional Recreation Pass. All in snapshot.
22 Saanich note/tips: adult/preschool final; 5-12 and 13-18 "may be some additional funds ... not guaranteed". Matches.
23 Saanich routes: "Most households", note and requiresNote list newcomer, adjudicator, Youth Application, contact office; steps/documents softened. lowIncome kept (as decided).
24 Taxi: steps[4] "pay any remainder in cash" with CRA example; no "method the taxi accepts" left.

## 2. Unsupported or hardened wording
None found in changed sentences. Every number ($35/$50, $150, $630, $200, 52, $80-$120, 50%, $2,834, 33099/33199) is in a snapshot.

## 3. Gates
- hatcEligibleDwelling, hatcQualifyingPerson, hatcQualifyingRenovationSpend, richmondFinancialHardship: all fixed:false. `met` is true only for: homeowner circumstance; dtc==="yes" or 65plus; never (spend, always "almost" like the shared gate); income low or bcAssistance pwd. All route-clear.
- app.js diff is 29 insertions, 0 deletions: shared homeowner, homeRenoCandidate, qualifyingRenovationSpend, lowIncome byte-unchanged. Remaining users: homeowner 4 (waterloo, bc-additional-home-owner-grant, bc-home-reno, bc-property-tax-deferment), homeRenoCandidate 2, qualifyingRenovationSpend 2, lowIncome 29 (Saanich still on it).
- DTC_URL defined at app.js:206, before REQS (214): no TDZ problem.

## 4. Oracle status changes (spec 1.18.0 -> 1.19.0)
- HATC with dtc no/unsure and under 65: no -> almost. Justified: CRA allows DTC eligibility "at any time in the year" and a spouse/relative may claim for a qualifying individual; neither is asked.
- HATC without homeowner circumstance: no -> almost. Justified: "expected to be ordinarily inhabited" and family-owner route.
- Richmond with income high/moderate and bcAssistance none/other/unsure: no -> almost; with bcAssistance pwd: ready regardless of income. Justified: route 1 (listed government assistance) has no income test; GIS, CDB and Income Assistance are not asked.
- HATC spend gate listed external (never ready), unchanged behaviour. Oracle PROGRAM_NOTES text updated; HATC bestCase stays almost.
No change makes anything "ready" that the source does not support.

## 5. Readability
- Gate cues (short): 71, 66 and 73 chars, 62 for spend; no digits; asserted in the new e2e test.
- See N1/N2 below.

## Non-blocking notes
N1 (low, public/app.js:885-893) hatcEligibleDwelling.unmet is ~560 chars in five sentences, a wall of prose in the "needs" list. Source-faithful but breaks the short-line rule; consider splitting into the headline sentence plus the official wording behind an expander if the needs list supports one.
N2 (low, public/data.js ~4272, 4310, 6135) New amount strings are long for a card headline: Lethbridge ~190 chars, Medicine Hat ~175, Saanich ~250 (and the Saanich note ~620). Accurate but dense; consider a short headline with details in aboutList. Density baselines were raised for these on purpose.
N3 (low, residual, outside the decisions) csg-dse tips[1] "Can cover ADHD/learning coaching, tutoring, and organization tools" is the old hard list (not on any snapshot); RDSP amount "(free government money)" and tip "don't leave it on the table" untouched (decision said keep); Lethbridge tips[0] "A letter from a Registered Social Worker is accepted on its own" (snapshot lists an "Advocacy letter from a Registered Social Worker (RSW)" among accepted documents, nothing about "on its own"). Candidates for the next batch.
N4 (info) Saanich still hard-gates on lowIncome (fixed:true) although it now documents newcomer/youth/adjudicator routes; decided "keep" by the reviewer. Mild risk of excluding a newcomer or youth with unrelated income answers.
