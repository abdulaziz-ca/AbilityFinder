# Re-verification batch 3, part C — 2026-10-15

Written by a Claude worker (Codex was out of usage). Sources: research/reverify/snapshots/<id>--<n>.txt
(fetched 2026-10-15; Kelowna read in a real browser including its FAQ answers). Records evaluated in a node vm;
REQS gate text checked. Codex review of this batch is owed.

## Count table

| record | facts | confirmed | differs | not on page |
|---|---|---|---|---|
| child-health-benefit | 16 | 8 | 2 | 6 |
| cwb-disability | 16 | 2 | 0 | 14 |
| disability-supports-deduction | 15 | 12 | 1 | 2 |
| dres | 19 | 12 | 2 | 5 |
| kelowna-recreation-assistance | 30 | 18 | 9 | 3 |
| handydart-translink | 25 | 15 | 0 | 10 |
| reddeer-fee-assistance | 22 | 15 | 4 | 3 |
| Total | 143 | 82 | 18 | 43 |

## DIFFERS — needs a decision

1. child-health-benefit `amount`: "Free prescriptions, dental, optical for kids" — page narrows: "Dental care basic and preventative services like fillings, x-rays…", "Eye glasses every year", "list of eligible prescription drugs". Scope; "Free" itself not on page.
2. child-health-benefit `detail.tips` (CDCP): record "ACHB may cover remaining eligible dental costs" — page "For services covered by both plans, claims must be submitted to the CDCP first, with any remaining eligible costs then covered by ACHB." Adds "may"; drops the both-plans condition.
3. disability-supports-deduction `eligibility`/`requiresNote`: "work, attend school or carry out research" — page "do research for which you received a grant". Dropped condition.
4. dres `eligibility.items[5]`/`requiresNote` (SAFETY GUARDRAIL): record makes the barrier criterion a "must" — page lists four "must" items, then separately "You may be eligible for funding if you have a disability that is: documented permanent or long-term and creating a barrier…". Hedge.
5. dres gate `dresEmploymentRoute` (SAFETY GUARDRAIL): "does not fund ordinary job matching…" — page "employment services (for example, job matching, employment and skills training, or wage subsidies)". "ordinary" narrows the exclusion.
6–12. kelowna-recreation-assistance `amountTiers.rows` + `requiresNote`: page heading "Low Income Cut-Offs (LICO) 2025" — record vs page: 1 person $31,264 vs $26,926; 2 $38,922 vs $33,519; 3 $47,851 vs $41,208; 4 $58,096 vs $50,032; 5 $65,892 vs $56,744; 6 $74,315 vs $64,000; 7 $82,739 vs $71,254. All seven rows overstate the limit.
13. kelowna `eligibility.items[1]`/`requiresNote`: "qualify" — page "eligible to apply"; drops "meet income verification requirements and have all the necessary documentation".
14. kelowna `note`/`detail.time`: "up to two weeks once all information is received" — page "may take up to two weeks from the date of submission, provided all required information is received".
15. reddeer `amount`/`about`: "up to $200 a year toward registered programs" — page "Pending available funding… up to $200 per year to each eligible person for Safe & Healthy Communities program registrations".
16. reddeer `summary`/`note`/`steps`: "qualifies you automatically", "no income test needed" — page "You may automatically qualify… if you are a Red Deer resident and one of the following applies to you."
17. reddeer `documents`: "Proof of a Red Deer address" — page "proof of residence if your ID does not show your current Red Deer address".
18. reddeer `time`/`steps`: "Up to 10 business days" for recreation — recreation page "processing may take over 10 business days due to high volume"; only the transit page says "up to 10 business days".

## Phone numbers to check (NOT ON PAGE, but the page shows a different number)
- child-health-benefit: record 1-877-644-9992; page lists Health Benefits Contact Centre 780-427-6848 and 1-877-469-5437.
- reddeer-fee-assistance: record 403-342-8111; page gives 403-309-8411 and feeassistance@reddeer.ca.

## Other notes
- handydart: record `detail.time` "Ask Access Transit"; page states 10 days (HandyDART) and 4–6 weeks (HandyCard) — omission.
- dres: page's "or your dependant child" contact-the-school clause omitted — omission.
