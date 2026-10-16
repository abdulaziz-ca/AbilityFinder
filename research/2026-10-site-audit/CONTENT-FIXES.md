# Content P1 fixes — 2026-10-16

Scope: DECISION.md Order of work, step 2; the eight requested content fixes. Not a benefit re-verification. No benefit amount, program rule, program date, source URL, matcher gate, or verification month was changed. The only edits in public/data.js are the two RDSP wording corrections below, using its existing repayment FAQ. P1-08 (large-scale duplication) and P1-09 (potentially conflicting facts) remain separate work: resolving those by changing benefit facts was expressly out of scope.

## Counts

- October 2026 individual review markers: **51**, computed from Object.values(BENEFIT_VERIFIED).filter(d => d === "2026-10").length; the changelog's 54 is now 51.
- **19 historical changelog dates corrected**, including all **9 future-dated entries**; one new entry dated 2026-10-16, with no revision/changes metadata. Existing revisions 12 through 1 and their changes are intact, in descending order.
- Audit said 46 amount differences. Recomputing against this worktree's HEAD gives **42**: 41 real static guides plus the local-supports routing placeholder. All **134 live guide amounts** now use b.amount; equality is tested against **133 static benefit guides**. local-supports has no official source URL and deliberately has no generated static guide.
- Asset version **190 → 191**: 14 index references + 2 CSS font URLs; generated guides propagate 134 stylesheet pins (133 benefit pages + index).
- **7 new content regression tests**, plus a narrowly enumerated historical-correction migration in the existing data-procedure test. The latter still requires retention of all old entries and a genuinely new entry: it recognizes only the 19 listed date corrections and the exact 54 → 51 sentence correction, not arbitrary historical rewrites.

## P1-01 — accurate local-storage privacy

Files: public/i18n.js; public/app.js disability help. Results disclaimer: “never saved or sent anywhere” → “Your answers are saved only in this browser on this device. We don't send them anywhere.” It separately discloses the optional assistant and feedback submissions. Removed the misleading blanket “2025–2026 figures” sentence; individual guide periods remain unchanged. French results disclaimer and income help now explicitly say answers are recorded only in this browser on this device, rather than “nous ne conservons ni n'envoyons rien”. The existing privacy page already accurately describes IndexedDB and both opt-in sends; that boundary did not change.

## P1-03 — honest landing illustration

File: public/app.js, renderLanding. “8 benefits found” and “Matches your answers” preview badge/note → “Example programs” and “Illustration only — not matched to anyone's answers.” DTC/RDSP check marks removed, as are the transit check and CDB lock. “+$4,500 / year” and “from $5.90 / month” → “Check the guide for details” on all four generic example rows. “Example results” and “Amounts vary” remain. No persona, eligibility outcome, figure or price is invented.

## P1-02 — real release dates and count

File: public/changelog.js. Used the requested git log --format='%ad %s' --date=short -- public/data.js public/app.js and cross-checked original text introductions with git log --reverse -S <entry prefix> -- public/changelog.js. Git blame alone is insufficient: later revision-metadata edits reattribute old entries. Earlier July entries were checked against the underlying feature commits rather than the date they were later summarized in the changelog (e.g. 72503a8, 2026-07-18 trust/static/print; 71a0246, 2026-07-15 IndexedDB; 5c84add, 2026-07-19 directories; 5f431f3/a1b31b1, 2026-07-20 directory expansions). Changelog dates are commit evidence, not a claim of live deployment. Dates are now newest-first; no date is later than its introducing feature commit. “Review dates moved to October 2026 for 54 benefits” → “…for 51 benefits”.

| Entry prefix | Old date | New date | Original commit evidence |
| --- | --- | --- | --- |
| Resolved 12 targeted directory follow-ups. Shine's FAQ specifies ages 11–21; Bear … | 2026-10-19 | 2026-10-16 | 89647d5 2026-10-16 fix(#223): directory ages, deadlines and need flags checked against the organisations' own pages |
| Re-checked all 18 grant and 30 organization directory entries against supplied off… | 2026-10-19 | 2026-10-16 | 6168c25 2026-10-16 fix(#43): grants and organizations directories re-checked against their official pages |
| Saved Ontario cities now restore with your answers, so reloading results no longer… | 2026-10-17 | 2026-10-15 | 619fcda 2026-10-15 fix: Ontario users' saved city now survives a reload; add the assistive-technology test kit (#215b) |
| Results can now show recorded updates to matching and tracked programs on a return… | 2026-10-17 | 2026-10-15 | 5866955 2026-10-15 feat(#214): 'Updates to your programs' — what changed since your last review, on this device only |
| Review dates moved to October 2026 for 54 benefits whose facts were fully re-check… | 2026-10-17 | 2026-10-15 | 8f085e6 2026-10-15 data: 51 guides now say 'Info verified October 2026' |
| Resolved autism TTE items 34 and 39. Preserved the normal 20% and final aligned pe… | 2026-10-17 | 2026-10-15 | 36e0d5a 2026-10-15 fix: BC autism funding TTE limits in the program's own words; readable fuel-tax requirement |
| Applied all fifteen snapshot follow-up fixes and resolved batch eight open item tw… | 2026-10-17 | 2026-10-15 | afce811 2026-10-15 fix: re-verification follow-ups — Waterloo Ontario Renovates, CSG services & equipment (#220), BC fuel-tax refund |
| Applied sixteen batch nine snapshot re-verification fixes. Restored ADP qualificat… | 2026-10-17 | 2026-10-15 | 2e32179 2026-10-15 fix: re-verification batch 9 — the last 11 records; whole catalogue now re-checked |
| Applied fifteen batch eight re-verification fixes from supplied snapshots: ODSP ef… | 2026-10-17 | 2026-10-15 | e4c3198 2026-10-15 fix: re-verification batch 8 — 15 Ontario benefit facts corrected against official pages |
| Applied seventeen re-verification batch seven snapshot-wording fixes to ten record… | 2026-10-16 | 2026-10-14 | a4d73c1 2026-10-14 fix: re-verification batch 7 — 17 benefit facts corrected (NOT YET RELEASED: Codex review owed) |
| Applied all twenty-eight re-verification batch six snapshot-wording fixes to fourt… | 2026-10-16 | 2026-10-14 | b31c1cf 2026-10-14 fix: re-verification batch 6 — 28 benefit facts corrected against official pages |
| Applied all thirty-six re-verification batch five snapshot-wording fixes to eleven… | 2026-10-16 | 2026-10-14 | fd10cb0 2026-10-14 fix: re-verification batch 5 — 36 benefit facts corrected against official pages |
| Applied re-verification batch four snapshot-wording fixes to twelve records: resto… | 2026-10-15 | 2026-10-14 | fafd506 2026-10-14 fix: re-verification batch 4 — 38 benefit facts corrected against official pages |
| Applied re-verification batch three source-wording fixes to transit, recreation, h… | 2026-10-15 | 2026-10-14 | dc23374 2026-10-14 fix(#221): re-verification batch 3 — 35 benefit facts corrected against official pages |
| Corrected the Kelowna recreation assistance income table to the City's published 2… | 2026-10-15 | 2026-10-14 | 93d1655 2026-10-14 fix: Kelowna recreation assistance income limits match the City's 2025 LICO table |
| Applied twenty-four source-wording corrections: student equipment help; Edmonton m… | 2026-10-15 | 2026-10-14 | 4c0f4e4 2026-10-14 fix(#219): re-verification batch 2 — 24 benefit facts corrected against official pages |
| Corrected Healthy Kids cost-help wording and its inclusive income limit; medical t… | 2026-10-15 | 2026-10-14 | b608154 2026-10-14 fix(#219): correct 19 benefit facts that differed from today's official pages |
| Toronto programs added. Ontario residents can now choose their city, and Toronto r… | 2026-09-04 | 2026-09-05 | dfe1a6d 2026-09-05 feat(#91): add Ontario city list and Toronto's two municipal programs |
| Repointed the Easter Seals Alberta directory link to the organisation's main site … | 2026-08-14 | 2026-08-15 | af90387 2026-08-15 fix(data): repoint dead Easter Seals link and record the link-health cadence |

## P1-04 — one qualified amount headline

Files: public/app.js renderGuideBody; test/content-trust.test.js; regenerated public/guides/*.html. Both the live “How much?” answer and live “What it can provide” amount now render the escaped b.amount, exactly as scripts/gen-guide-pages.js already does. Existing lifetime sub-lines, structured tiers, notes, eligibility, documents, FAQs and official sources are retained. No benefit figures or qualifiers were rewritten to create parity. All differing old → new headlines follow (the old is valueParts().head evaluated against HEAD, not a hand-transcribed audit sample):

| Record | Old live amount | New live/static amount |
| --- | --- | --- |
| grt-affordable-transit | $47 monthly pass vs $104 regular; $1.35 stored value per ride vs $3 regular and $4 cash; $6.75 for 5 MobilityPLUS tickets vs $15 regular | $47 monthly pass, $1.35 stored value per ride, or $6.75 for 5 MobilityPLUS tickets |
| grt-taxi-coupons | $60 coupon book for $30, up to 30 books between January 1 and December 31 | $60 coupon book for $30, up to 30 books a year |
| ottawa-community-pass | $43.25/month or $1.75/ride, all routes including Para Transpo with no top-up | $43.25 a month, or $1.75 a ride |
| ottawa-access-pass | $43.25/month, unlimited O-Train and non-Para buses, $2.75 top-up per Para Transpo ride | $43.25 a month, plus a $2.75 top-up per Para Transpo ride |
| ottawa-equipass | $58.25/month or $1.75/ride, about half the adult fare | $58.25 a month, or $1.75 a ride — about half an adult pass |
| windsor-affordable-pass | Transit Windsor APP 30-day pass: $63 adult or $43.50 youth, before taxes; regular 30-day Smart Pass: $124 adult, $85 youth or $63 senior | Transit Windsor 30-day APP pass: $63 adult or $43.50 youth, before taxes |
| windsor-recreation-assistance | 90% off eligible recreation program registration fees before taxes; equipment and materials are not covered | 90% off eligible program registration fees, before taxes |
| hamilton-fare-assist | 50% off single-ride PRESTO fares for one year; does not apply to monthly or annual passes | 50% off single-ride PRESTO fares for a year |
| brampton-activeassist | $275 per eligible family member as one lump sum; approval lasts two years | $275 for each eligible family member, as one lump sum — a family of four receives $1,100 |
| mississauga-activeassist | $275 per eligible family member per year, non-refundable | $275 a year for each eligible family member |
| ottawa-hand-in-hand | $185 per person per year toward City recreation and culture programs | $185 a year per person toward City recreation and culture programs |
| toronto-fair-pass | 36% off adult single TTC fares — $2.10 instead of $3.30, monthly cap $98.70 | 36% off adult single fares — $2.10 instead of $3.30, capped at $98.70 a month |
| toronto-welcome-policy | $683.04/year up to age 24; $314.60/year at 25 and over | $683.04 a year for a child or youth up to 24; $314.60 a year at 25 and over |
| cdb-adult | Up to $2,450.40 / year ($204.20/mo) | Up to $204.20 / month for July 2026–June 2027 |
| child-disability-benefit | Up to $3,480 / year ($290/mo) | Up to $3,480 / year per child ($290 / month) |
| rdsp | Up to $4,500 / year | Up to $3,500 grant + $1,000 bond per year (repayment rules apply) |
| cwb-disability | Up to $843 / year | Extra refundable tax credit on top of the base benefit |
| cpp-disability | $611–$1,741 / month | Monthly payment based on your CPP contributions |
| csg-disability | Up to $2,800 / year | Up to $2,800 / year (a grant — you don't pay it back) |
| csg-dse | Up to $20,000 / year | Up to $20,000 per school year (August 1 to July 31) |
| aadl | covers ~75% of approved equipment & supplies | Funding for medical equipment & supplies (you pay a small share) |
| pdd | funded daily-living, community & employment services | Funded support services (not a cash payment) |
| fscd | respite, services & help with some disability costs | Services + funding for families raising a child with a disability |
| dres | may fund approved disability-related accommodations for work or eligible education or training routes | Potential funding for approved disability-related accommodations |
| ab-grant-disability | Up to $3,000 / year | Up to $3,000 per loan year for approved costs after federal funding |
| adult-health-benefit | prescriptions, dental, optical, ambulance and diabetes supplies — Alberta publishes no annual dollar value | Dental care, prescription drugs, eye exams and glasses, and more — ask your provider what is paid for |
| child-health-benefit | eligible prescription drugs, basic and preventative dental care and eyeglasses for children in low-income households | Covers eligible prescription drugs, basic and preventative dental care and eyeglasses for children in low-income households |
| parking-placard | low-cost accessible parking permit | Low-cost accessible parking permit |
| calgary-fair-entry | transit $6.30–$63/mo by income band + lower-cost recreation | Transit pass $6.30–$63/month by income band + lower-cost recreation |
| edmonton-fare-assistance | Reduced-cost monthly Arc card ($35 or $50 depending on household income) + Leisure Access Pass | Reduced-cost monthly Arc transit card ($35 or $50 a month, depending on household income) + Leisure Access Pass |
| reddeer-fee-assistance | $34/mo transit pass + up to $200/yr recreation | $34/month transit pass + up to $200/year per eligible person for recreation programs (pending available funding) |
| lethbridge-fee-assistance | 3 months of bus passes for the price of 1 + up to $150 per person per season toward one recreation or culture program, while funds are available | 3 months of bus passes for the price of 1 (you pay for one month, two are free) + up to $150 per person per season toward one recreation or culture program, while funds are available |
| medicinehat-fair-entry | up to 75% off transit (up to $630/yr per person) + up to $200/yr per person for City recreation and a separate up to $200/yr per person for Esplanade education programs | up to 75% off transit (up to $630/yr per person) + up to $200/yr per person for City recreation, and a separate up to $200/yr per person for Esplanade education programs |
| grandeprairie-aish-pass | $10.25/mo transit pass (vs $74.25) + 75% off recreation | $10.25/month transit pass + 75% off recreation |
| stalbert-subsidy | Free local fares + free annual rec membership (AISH/ADAP) | Free local fares within St. Albert + free annual recreation membership for AISH and ADAP recipients |
| airdrie-fair-access | 25–75% off transit + Genesis Place recreation | 25–75% off transit passes + Genesis Place recreation |
| woodbuffalo-lift | $10/mo transit pass + 75% off SMART Bus + 60% off recreation | $10/month transit pass + 75% off SMART Bus + 60% off recreation |
| sprucegrove-low-income-transit | $25/mo local or $50/mo commuter transit pass | $25/month local or $50/month commuter transit pass |
| leduc-subsidies | half-price monthly bus pass of your choice (local, commuter or LATS); recreation program now closed, reopening for new applications in January 2027 | Half-price monthly bus pass of your choice (local, commuter or LATS) |
| canmore-affordable-services | discounts on Regional ROAM Transit, recreation and community services | Discounts on Regional ROAM Transit, recreation and community services |
| fortsask-access | free multi-facility membership and reduced local or commuter transit fares | Free multi-facility membership + reduced local or commuter transit fares |
| local-supports | varies by community | Varies by community |

## P1-07 — category help and province-safe resources

File: public/app.js HELP_PAGES.disabilities.

- “This question does not decide anything” → “Some programs depend on the category”.
- “picking the ‘wrong’ one doesn't disqualify you” → “Some programs depend on the category you pick, so it can change which results you see. Picking a category does not establish eligibility — the program decides. You can change your answers anytime.”
- “‘Something else / not listed’ … that choice will not disqualify you” → “‘Something else / not listed’. Some programs depend on a specific category, so check each guide's requirements. You can change your answers anytime.”
- Unconditional Voice of Albertans with Disabilities / Inclusion Alberta / Alberta 211 paragraph → “The ‘Real people who can help’ section on your results lists help for your province. Check each organization's listing for who it serves and how to contact it.” No new organizations, services or contact facts added.

## P1-05/06 — maximums, not estimates or free money

Files: public/data.js, public/app.js, generated public/guides/rdsp.html.

- RDSP amount: “Up to $3,500 grant + $1,000 bond per year (free government money)” → “Up to $3,500 grant + $1,000 bond per year (repayment rules apply)”. Numbers are unchanged; qualifier comes from the existing FAQ about possible early-withdrawal repayment.
- RDSP value note: “in free government grants & bonds” → “in government grants & bonds; repayment rules apply”.
- Result and browse cards: “Est. value” → “Published maximum”; existing “Up to” limit headlines remain. The guide now presents b.amount without the estimate tag.
- Privacy/print explanatory text: “Dollar figures are estimates” / “Amounts are estimates” → published amounts or limits, not a personal payment estimate. No summing, amount, priority weighting or matcher behavior was changed.

## P1-10 — verification and link-health wording

Files: public/app.js, public/i18n.js.

- Landing footer “Info verified July 2026” (DATA_VERIFIED) → “Each guide shows when it was last checked”. Same replacement on privacy disclaimer and printed action-plan footer. Per-guide explicit and inherited review dates are retained, not advanced.
- About/Impact “around the clock” → “Every few hours, automated monitoring checks a rotating set of official links and flags pages that break or move. A working link does not mean the rules or amounts are unchanged.” French monitoring overclaim is likewise aligned.

## P1-11 — French scope and overclaims only

Files: public/i18n.js, public/app.js resultsBlurb and SCOPE_RESIDENCY_HELP_FR. No catalogue translations added; French remains partial. All five French scope substitutions and the wizard residency explanation now include Ontario when ON_ENABLED is true (and omit it when false); the English scopeProgramList omission is also fixed. French match/conditional/guide labels and DTC help now mirror the English caveats rather than implying approval, a one-condition path, or immediate application readiness. See exact localized text changes below. ResultsBlurb now uses the same localized acknowledgement for every count combination, exactly as English already did.

### Exact localized string changes (public/i18n.js)

| Key | Old text | New text |
| --- | --- | --- |
| en.impact.truth.monitor | Automated link monitoring re-checks official links around the clock and flags pages that break or move. | Every few hours, automated monitoring checks a rotating set of official links and flags pages that break or move. A working link does not mean the rules or amounts are unchanged. |
| en.disclaimer | AbilityFinder is a free helper tool, not legal, medical, or financial advice. Benefit rules and amounts change — always confirm on the official government page (linked in each guide) before applying. Amounts shown are 2025–2026 figures. Your answers stay in your browser and are never saved or sent anywhere. | AbilityFinder is a free helper tool, not legal, medical, or financial advice. Benefit rules and amounts change — always confirm on the official government page (linked in each guide) before applying. Your answers are saved only in this browser on this device. We don't send them anywhere. The optional assistant and feedback form send what you choose to submit. |
| fr.impact.truth.monitor | Une surveillance automatisée revérifie les liens officiels en tout temps et signale les pages brisées ou déplacées. | Toutes les quelques heures, une surveillance automatisée vérifie un ensemble tournant de liens officiels et signale les pages brisées ou déplacées. Un lien fonctionnel ne signifie pas que les règles ou les montants sont inchangés. |
| fr.how.2p | Une liste personnalisée d'argent, de rabais et de soutiens — ce qui est prêt et ce qui est à une étape près. | Une liste personnalisée d’argent, de rabais et de soutiens — avec ce qui correspond à vos réponses et ce qui demande d’autres vérifications. |
| fr.disclaimer | AbilityFinder est un outil d'aide gratuit, et non un conseil juridique, médical ou financier. Les règles et montants changent — confirmez toujours sur la page gouvernementale officielle (liée dans chaque guide) avant de faire une demande. Les montants indiqués sont ceux de 2025–2026. Vos réponses restent dans votre navigateur et ne sont jamais enregistrées ni envoyées. | AbilityFinder est un outil d'aide gratuit, et non un conseil juridique, médical ou financier. Les règles et montants changent — confirmez toujours sur la page gouvernementale officielle (liée dans chaque guide) avant de faire une demande. Vos réponses sont enregistrées uniquement dans ce navigateur, sur cet appareil. Nous ne les envoyons nulle part. L’assistant et le formulaire de rétroaction facultatifs envoient ce que vous choisissez de soumettre. |
| fr.res.conditionalOne | Ce programme n’est pas écarté. Il faut d’abord confirmer une condition, et la carte indique exactement laquelle. | D’autres points à vérifier. Lisez les exigences sur la carte de ce programme. |
| fr.res.conditionalMany | Ces {count} programmes ne sont pas écartés. Il faut d’abord confirmer une condition pour chacun, et chaque carte indique exactement laquelle. | D’autres points à vérifier pour ces {count} programmes. Lisez les exigences sur chaque carte. |
| fr.mb.readySub | en soutien représenté par vos correspondances prêtes | Correspond à vos réponses — soutien représenté par ces programmes |
| fr.mb.noTotalTitle | Prêt à demander — la valeur varie selon le programme | Correspond à vos réponses — la valeur varie selon le programme |
| fr.mb.noTotalSub | Vos correspondances prêtes peuvent être une couverture, des services, un accès ou des rabais, ou de l’argent que nous n’estimons délibérément pas. | Ces programmes peuvent offrir une couverture, des services, un accès ou des rabais, ou de l’argent que nous n’estimons délibérément pas. |
| fr.mb.conditionalTitle | Votre prochaine étape : confirmer une chose | D’autres points à vérifier |
| fr.mb.conditionalSub | Aucun de ces programmes n’est écarté. Chacun comporte une condition à vérifier d’abord, et chaque carte indique laquelle. | Ces programmes ont des exigences à vérifier. Ouvrez chaque carte pour les lire. |
| fr.mb.conditionalCaveat | Aucun montant n’est estimé tant qu’un programme n’est pas confirmé; ouvrez une carte pour voir quoi confirmer et ce qu’il pourrait offrir. | Les montants ne sont pas estimés pour ces programmes. Ouvrez une carte pour voir les exigences et ce que le programme pourrait offrir. |
| fr.scenario.newReady | Nouvellement prêt à demander : | Nouveaux programmes dans « Correspond à vos réponses » : |
| fr.scenario.noReady | Plus prêt à demander : | Programmes quittant « Correspond à vos réponses » : |
| fr.grp.ready | Correspondance probable — vérifiez le guide | Correspond à vos réponses |
| fr.res.acknowledgement | (English fallback) | Nous n’avons pas posé de question sur chaque exigence. Vous pouvez quand même lire comment faire une demande. |
| fr.grp.almost | Correspondance possible — confirmez une condition | D’autres points à vérifier |
| fr.grp.almostOnly | Programmes à confirmer | D’autres points à vérifier |
| fr.nm.summary | Pas admissible pour l'instant | Ne correspond pas à ces réponses |
| fr.apply.unlock | Voir comment y accéder | Lire comment faire la demande |
| fr.det.eligible | Ce programme correspond étroitement à vos réponses. Confirmez chaque règle sur la page officielle — le programme prend la décision. | Selon ce que vous nous avez indiqué. Le programme décide si vous êtes admissible. |
| fr.det.almostH | À une étape près. | D’autres points à vérifier |
| fr.det.almostSub | Pour y accéder, il vous faut encore : | Exigences à vérifier : |
| fr.guide.mustMeetAny | Vous êtes admissible si l'une de ces conditions s'applique : | Le programme exige au moins une des conditions suivantes : |
| fr.af.eligible | Suis-je admissible ? | Cela correspond-il à mes réponses ? |
| fr.af.eligiblePrompt | Répondez à quelques questions pour le savoir. | Répondez à quelques questions pour voir les programmes à vérifier. |
| fr.af.check | Vérifier mon admissibilité | Répondre aux questions |
| STEP_I18N.fr.dtc.kicker | La clé maîtresse | Programmes fédéraux |
| STEP_I18N.fr.dtc.help | Le CIPH est l'élément numéro un qui débloque la plupart des prestations. Si vous ne l'avez pas, pas de souci — nous vous montrerons comment l'obtenir. | L’approbation au CIPH est requise pour plusieurs programmes fédéraux, mais pas pour toutes les prestations pour personnes handicapées. |
| STEP_I18N.fr.income.help | Certaines prestations visent les faibles revenus. Une réponse approximative suffit — nous ne conservons ni n'envoyons rien. | Certaines prestations visent les faibles revenus. Une réponse approximative suffit — elle est enregistrée uniquement dans ce navigateur, sur cet appareil. Nous ne l’envoyons nulle part. |

### Scope substitutions (public/i18n.js and public/app.js)

- scopeBenefits: “Alberta · C.-B. + prestations fédérales” → “Alberta · C.-B. · Ontario + prestations fédérales”.
- scopeResidents: “Albertains et Britanno-Colombiens” → “Albertains et Britanno-Colombiens et Ontariens”.
- scopeResidentsPrep: “de l’Alberta et de la Colombie-Britannique” → “… et de l’Ontario”.
- scopeProgramList FR: “albertains, britanno-colombiens, fédéraux et municipaux” → “albertains, britanno-colombiens, ontariens, fédéraux et municipaux”.
- scopeDestination: “Alberta ou Colombie-Britannique” → “Alberta ou Colombie-Britannique ou Ontario”.
- scopeProgramList EN: “Alberta, British Columbia, federal, and municipal” → “Alberta, British Columbia, Ontario, federal, and municipal”.
- Residency help ending “pour l'Alberta et la Colombie-Britannique” → “… et l'Ontario”, composed from enabled flags.
- French results “Voici ce que vous pouvez demander dès maintenant” / “correspondent étroitement” → localized res.acknowledgement for ready-only, mixed, almost-only and empty results alike.

## Generation, checks and limitations

- npm run gen:guides: passed; regenerated 133 benefit pages + index (134 stylesheet pins). sitemap unchanged.
- npm run gen:context: passed; generated outputs byte-identical because its amount grounding is redacted and neither changed RDSP field enters that narrative. src/links.js unchanged; no source URLs changed.
- npm test: **216 passed, 0 failed, 0 skipped** (includes 7 new tests).
- npm run check:surfaces: passed. Flagged counts unchanged: gate.unmet 115/226; eligibility.note 44/68; detail.about 95/134; detail.aboutList.items 150/334; summary 26/134; note 67/134. Report is byte-identical; no baseline raised.
- git diff --check: passed.
- Chromium listing: **299 tests in 29 files**. Final complete project run (`npx playwright test --project=app-chromium --workers=1`): **298 passed / 299 listed; 1 failed; 0 skipped**, 5.1 minutes. This is **not a green full suite**. The failure was `matcher-safety.spec.js:1835`, “Brampton and Mississauga ActiveAssist are separate programs”: it exhausted 45 seconds waiting for `window.evaluateAnswers` before reaching any matcher assertion. The saved trace shows `/app.js?v=191` with no completed response (status/time -1); all other app assets returned 200 in under 8 ms. The error-context page shows the existing “AbilityFinder did not finish loading” fallback. No server-infrastructure change, timeout increase, retry setting, or assertion bypass was made for this failure. Work remains unverified at the full-suite gate.
- Separate diagnostic on unchanged final code: the startup-failed Brampton/Mississauga test and the updated EN/FR copy test both passed (**2/2**, 1.9 seconds). This does **not** replace or erase the **298/299** full-run outcome. Logs: outputs/content-chromium-verified.log and outputs/content-chromium-diagnostic.log.
- The preceding complete browser run was also **298/299**, with its sole failure expecting the old French wording (“Ce programme n’est pas écarté”). Updated `e2e/matcher-safety.spec.js` to require the exact new French acknowledgement, “D’autres points à vérifier”, and absence of the old one-condition promise; then ran the entire project again as reported above. Existing limit, RDSP lifetime, and group-layout assertions are retained. Evidence: outputs/content-chromium-final.log.
- Initial browser run caught an implementation error: esc was local to other functions, not shared. Changed the guide to reqEscape, and made the unit regression evaluate that exact real helper (no stub). That invalid run was interrupted after 19 passes / 9 failures / 1 interrupted / 270 not run; it is not claimed as a pass. Evidence: outputs/content-chromium.log. The complete project was restarted without retries after the helper fix.
- Evidence logs: outputs/content-{guides,context,unit,surfaces,chromium-listed,chromium-final}.log.
- Semantic data comparison against HEAD: after accounting for the two documented RDSP copy fields, BENEFITS, BENEFIT_VALUES and BENEFIT_VERIFIED are deeply identical. All other benefit fields, numbers, qualifiers, source URLs and review markers are unchanged.
- No commit, push or deploy. Protected files were not edited by this task. OWNER-DIGEST.md was already dirty when inspected and left untouched; existing untracked outputs/node_modules were preserved. Cross-agent review and disabled-user assistive-technology testing are not claimed.
