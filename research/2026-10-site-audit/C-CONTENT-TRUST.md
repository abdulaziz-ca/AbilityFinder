# C — Content, plain language and trust audit (Oct 16 2026)

**Scope.** This audit covers the words on AbilityFinder: the benefit records in `public/data.js`, the requirement texts (`REQS` in `public/app.js`), the interface copy (`public/i18n.js` EN, plus copy that is hard-coded in `app.js`), the trust signals, how money is shown, and what a French-speaking user sees. Matching logic and result relevance are covered in `A-RESULTS-RELEVANCE.md` and `B-USER-JOURNEY.md`. I refer to them where content and logic meet, but I do not repeat them.

**Method.**
- I loaded `public/data.js` in a Node `vm`, the same way `scripts/check-readability.js` does. I extracted every field of every record, as well as `BENEFIT_VALUES`, `BENEFIT_META`, `BENEFIT_EXTRA` and `BENEFIT_VERIFIED`.
- I evaluated the `REQS` block (lines 207–1423 of `app.js`) with stubbed answers. This gave me all **226** requirement objects with their `unmet`, `short`, `who` and `fixed` values.
- I ran `npm run check:readability` and `npm run check:surfaces`. Both scripts rewrite their reports. `READABILITY-REPORT.md` changed because the catalogue has changed since Oct 14. I saved the fresh copy to my scratchpad and restored the tracked file with `git checkout`, so the worktree stays read-only. The numbers below come from the fresh run. `DENSE-SURFACES-REPORT.md` came out byte-identical.
- I read `research/197-info-density/` (RESEARCH, TEMPLATE-SPEC, both reports).
- I compared the SPA guide (`renderGuideBody`) with the static guide generator (`scripts/gen-guide-pages.js`) field by field.
- **Sample: 47 records, read in full.**
  - Federal: `dtc`, `cdb-adult`, `rdsp`, `cpp-disability`, `cwb-disability`, `medical-expense-tax-credit`, `home-accessibility-tax-credit`, `canadian-dental-care-plan`, `multigenerational-home-renovation-tax-credit`, `child-disability-benefit`, `cpp-childrens-benefit`.
  - Alberta: `aish`, `adap`, `pdd`, `fscd`, `aadl`, `parking-placard`, `calgary-fair-entry`, `edmonton-fare-assistance`, `leduc-subsidies`, `reddeer-fee-assistance`, `local-supports`.
  - BC: `bc-disability-assistance-pwd`, `bc-pwd-designation`, `bc-autism-funding-under-6`, `bc-autism-funding-6-18`, `bc-cy-disability-benefit`, `bc-fair-pharmacare`, `bc-bus-pass`, `bc-monthly-nutritional-supplement`, `bc-fuel-tax-refund-disabilities`, `bc-icbc-disability-discount`, `vancouver-leisure-access`, `handydart-translink`, `kamloops-arch`.
  - Ontario: `odsp`, `ontario-autism-program`, `ssah`, `passport-program`, `trillium-drug-program`, `on-adp`, `toronto-fair-pass`, `grt-mobilityplus`, `waterloo-ontario-renovates`, `ottawa-equipass`, `mississauga-activeassist`, `windsor-affordable-pass`.
  - Every systemic number below is measured across **all 134** records, not just the sample.

**Concurrent edits.** While I was auditing, another session left uncommitted changes in this worktree: `app.js` (+81 lines), an `okotoks` gate in `data.js`, one new change log entry, `finder.postalLabel` in `i18n.js`, regenerated guides, and `DENSE-SURFACES-REPORT.md`. I did not make those changes. At the end I re-checked every quoted string in the P1 findings, and all of them are still present in the working copy.

**Ground rule followed.** No fact in this report is new. Where two places in the repo disagree, I quote both and say **"verify against the official page"**. I do not pick a winner. Every suggested rewrite keeps every official qualifier: it moves wording, it never deletes it.

---

## Executive summary — the ten things that matter most

1. **The site contradicts itself about privacy.** The results-page disclaimer says answers "are never saved or sent anywhere". The privacy page (correctly) says they are saved in this browser's IndexedDB, and that the assistant and feedback form send data. French goes further: "nous ne conservons ni n'envoyons rien" ("we neither keep nor send anything"). *(P1-01)*
2. **The public change log is dated in the future.** Nine entries are dated **Oct 17 and Oct 19, 2026**. Today is Oct 16 and the commit is from Oct 16. One of them also says "54 benefits" moved to October 2026, but `BENEFIT_VERIFIED` holds **51**. *(P1-02)*
3. **The landing-page "example results" show something the product cannot produce, plus a figure that is not in the catalogue.** It shows the DTC and the RDSP ticked as "Matches your answers"; both can only ever be "More to check". The transit row says "from **$5.90** / month". That figure appears nowhere in `data.js`, and Calgary's lowest 2026 band is **$6.30**. *(P1-03)*
4. **Two sources of truth for "How much?"** For 46 programs, the SPA's "How much?" shows a different string (`BENEFIT_VALUES.note` or a computed range) from the static guide page (`b.amount`). Official qualifiers are lost along the way. For example, Alberta Grant for Students with Disabilities reads "Up to $3,000 / year" instead of "per loan year for approved costs after federal funding". Red Deer loses "(pending available funding)". *(P1-04)*
5. **"Est. value" labels published *maximums* as estimates.** The RDSP is presented as "+$4,500 / year … free government money", while its own FAQ says grants and bonds from the last 10 years may have to be repaid. *(P1-05, P1-06)*
6. **The wizard's "Not sure which to pick?" help says the disability category never disqualifies you.** The matcher does the opposite for PDD, Passport, both BC Autism Funding programs and the Ontario Autism Program. Those use fixed category gates and show "Does not match these answers". *(P1-07)*
7. **Repeated facts are everywhere.** 86 of 134 records (64%) repeat sentences verbatim across fields. The amount appears twice on every guide. The CDCP income tiers appear **four** times on one page. Leduc's closure appears in five fields. *(P1-08)*
8. **Some repeated facts disagree with each other**, and the user sees both versions. Examples: Plan B exclusions in Fair PharmaCare; the AADL cost-share ("can have that waived" vs "waived entirely" vs "~75%"); CWB ("claimed automatically" vs "claim … (Schedule 6)"); DTC timing ("8–20 weeks" vs "Processing time varies"). *(P1-09)*
9. **"Info verified July 2026" is stamped site-wide** (footer, privacy page, printed report), even though 64 records now show September or October 2026. On guides, the same month gets two different phrasings ("Info verified July 2026" / "Part of the July 2026 catalogue review"), and nothing explains the difference. *(P1-10)*
10. **French is live but half-built.** The requirements panel, most wizard options and the whole catalogue fall back to English, and several French strings make stronger claims than the English. Examples: the DTC "unlocks most benefits"; results are "what you can apply for right now". *(P1-11)*

The **writing quality** is uneven by batch. Ontario and the September–October BC/AB re-verifications are careful and consistent. The original July records (DTC, RDSP, CPP-D, AADL, PDD, FSCD) still carry marketing voice: "One of the best-value benefits available", "free government money", "don't leave it on the table", "many are approved", "can qualify easily". Readability is far above target everywhere: median FK grade **12.5**, and 126 of 134 records are above grade 9. No record has a standard "What you get / Who it's for / How to apply" shape. The three fields that should carry that shape (`summary`, `amount`, `note`) are used inconsistently.

---

## P1 — fix first (accuracy, honesty, or a contradiction a user will see)

### P1-01 Privacy claims contradict each other (EN and FR)
| Where | Current text |
|---|---|
| `i18n.js` `disclaimer` (bottom of every results page) | "…Amounts shown are 2025–2026 figures. Your answers stay in your browser and are **never saved or sent anywhere**." |
| Privacy page (`app.js` ~3084) | "Your wizard answers, progress, bookmarks … live only in your own browser, in this site's **IndexedDB** database." It then documents two opt-in sends (assistant, feedback). |
| Wizard `income.help` (EN) | "This rough category is **saved only in your browser** … it is never sent to us." (correct) |
| `STEP_I18N.fr.income.help` | "**nous ne conservons ni n'envoyons rien**" (we neither keep nor send anything) |
| `STEP_I18N.fr.disabilities.help` | "ne quitte jamais votre navigateur" (fine) |

**Why it matters.** "Never saved" is false, because answers are saved locally so a reload restores them. A user who finds their answers still there the next day has caught the site in an untruth. Privacy is listed as part of the product (AGENTS.md rule 3).
**Direction.** Use one sentence everywhere, built from the privacy page: "Your answers are saved only in this browser. We don't receive them. The assistant and feedback form send only what you type, and only when you choose to." Also drop "Amounts shown are 2025–2026 figures": records now carry July 2026–June 2027 and 2026 figures (see P2-19).

### P1-02 Future-dated public change log, and a count that does not match the data
- `public/changelog.js` has 7 entries dated `2026-10-17` and 2 dated `2026-10-19`. `git log` shows they were committed on **2026-10-16**. The "What changed" page renders them with `plainEnglishDate`, so users see **October 19, 2026** on Oct 16.
- The Oct-17 entry says: "Review dates moved to October 2026 for **54** benefits…". `BENEFIT_VERIFIED` contains **51** `"2026-10"` values (plus 13 `2026-09`, 31 `2026-07`, 39 inherited).
- The `BENEFIT_VERIFIED` comment cites `research/reverify/VERIFIED-DATES-2026-10-17.md`. That file does not exist; the folder holds `DECISIONS-2026-10-17-batch8/9.md`, which are also future-dated.

**Why it matters.** A public "record of material changes" with impossible dates is a credibility failure that anyone can see. It also defeats the change log's main job: proving when a fact was checked.
**Direction.** Change log dates must be the publish date, never a planned or batch date. Make the count derived from the data, or reconcile it with `BENEFIT_VERIFIED`. Suggested guard: a unit test that fails when any changelog date is later than the commit/build date. The existing `docs-consistency.test.js` is the natural home.

### P1-03 Landing "example results" mock shows impossible outcomes and an unsourced price
In `renderLanding` (`app.js` ~2555–2568), the preview is `aria-hidden`, so screen-reader users do not get it. Sighted users do see:
- "**8** benefits found · ✓ Matches your answers", followed by "Based on what you told us. The program decides if you qualify."
- DTC "Non-refundable tax credit" ✓ and RDSP "**+ $4,500 / year**" ✓. In the real matcher both have `met: () => false` gates (`prolonged`/`certifier`, `rdspOpening`/`rdspContributionWindow`), so they can **never** appear under "Matches your answers" (REMAINING-WORK TEST-01: 59 programs can never be ready).
- "Low-income transit pass · **from $5.90 / month**". `grep 5.90 public/*.js` finds this line and nothing else. `calgary-fair-entry` says "three 2026 income bands — **$6.30**, $44.10 or $63.00".

**Why it matters.** This is the first thing a visitor sees, and it sets an expectation the results will break. It is also the only dollar figure on the site with no source behind it.
**Direction.** Rebuild the mock from real behaviour: most items "More to check", one "Matches your answers". Either remove the figures or read them live from `BENEFIT_VALUES`/the record, so they cannot go stale. Keep "Example" on the preview itself, not only in a side label.

### P1-04 "How much?" has two sources of truth, and the SPA headline drops official qualifiers
`valueParts()` shows `BENEFIT_VALUES[id].note` (38 discount/coverage/service records) or a computed range (8 cash/grant records) instead of `b.amount`. Meanwhile the static `/guides/*` pages show `b.amount` under "Amount or value". In the SPA, `b.amount` is **never displayed** for those 46 records. Selected pairs (SPA ⇢ static):

| Record | SPA "How much?" / card | Static guide `b.amount` | Qualifier lost |
|---|---|---|---|
| `ab-grant-disability` | "**Est. value** Up to $3,000 / year" | "Up to $3,000 per loan year for approved costs after federal funding" | per loan year; approved costs only; federal first. `BENEFIT_VALUES.note` has the qualifier but is never shown, because `sub` only shows notes for `taxCredit` |
| `csg-dse` | "Up to $20,000 / year" | "Up to $20,000 per school year (August 1 to July 31)" | the period, and that it is reimbursement for approved services/equipment |
| `cdb-adult` | "Up to $2,450.40 / year ($204.20/mo)" | "Up to $204.20 / month for July 2026–June 2027" | the benefit period; "excludes the separate conditional $150 supplement" (in VALUES.note, never shown) |
| `cpp-disability` | "**Est. value** $611–$1,741 / month" | "Monthly payment based on your CPP contributions" | the dependence on contributions; also verify that $611 is a real floor before presenting it as the bottom of a range |
| `cwb-disability` | "Up to $843 / year" | "Extra refundable tax credit on top of the base benefit" | static page gives no figure at all |
| `reddeer-fee-assistance` | "$34/mo transit pass + up to $200/yr recreation" | "…up to $200/year **per eligible person** … (**pending available funding**)" | per person; funding-dependent |
| `aadl` | "covers ~75% of approved equipment & supplies" | "Funding … (you pay a small share)" | the annual cap and waiver; the two framings conflict (see P1-09) |
| `leduc-subsidies` | "…recreation program now closed, reopening for new applications in January 2027" | "Half-price monthly bus pass…" | here the **static** page loses the closure |
| `brampton-activeassist` | "…approval lasts two years" | "…a family of four receives $1,100" | each side keeps a different qualifier |
| `stalbert-subsidy` | "Free local fares + free annual rec membership (AISH/ADAP)" | "…within St. Albert + … for AISH and ADAP recipients" | "within St. Albert" |

This also departs from `TEMPLATE-SPEC.md` §2, which says the "How much?" cell uses `b.amount`.
**Direction.** Make `b.amount` (or a new `whatYouGet` short form, see Recommendation R3) the only headline on both surfaces. Demote `BENEFIT_VALUES.note` to internal or `sub` use. Add a test asserting that SPA and static guides render the same headline string.

### P1-05 "Est. value" is used for maximums, and the one total that could show mixes unlike money
- `amount-tag` "Est. value" appears on 8 programs (cdb-adult, child-disability-benefit, rdsp, cwb-disability, cpp-disability, csg-disability, csg-dse, ab-grant-disability). Every one of those headlines is an "Up to" maximum or a published range, not an estimate. The impact page itself says "Value estimates show **program maximums** for illustration".
- `renderMoneyBand` sums `annualMax` across ready cash, grant and taxCredit programs into "Up to ~$X / year". The sum can mix monthly income (CDB), an RDSP deposit locked in a savings plan, reimbursement-only student grants (csg-dse, ab-grant, where the record says federal funding is allocated first), and a tax-time credit (CWB). REMAINING-WORK says this branch is unreachable today (540 profiles probed), so this is a **latent** risk. It becomes live the day any of those gates becomes confirmable through the new "Check this fact" pilot.
- `mb.caveat` uses AISH as its example ("not everything stacks (e.g. AISH has income limits)"). That example means nothing to BC and Ontario users, and AISH is never in the total anyway (`excludeFromEstimate`).

**Direction.** Rename the tag to what it is: "Maximum" or "Up to", or remove it. Before the total can ever render: (a) count only cash paid to the person; (b) never add RDSP, reimbursement grants or tax credits into a yearly income figure; (c) make the caveat province-neutral ("Some benefits reduce others. Each guide explains how."). Add a test that fails if `mb.upTo` can include `kind: "grant"` with a reimbursement note, or the RDSP.

### P1-06 RDSP framed as "free government money"
- `rdsp.amount`: "Up to $3,500 grant + $1,000 bond per year **(free government money)**". `BENEFIT_VALUES.rdsp.note`: "in **free** government grants & bonds". `rdsp.note`: "**One of the best-value benefits available.**"
- The record's own FAQ: "grants/bonds from the last 10 years **may be repaid if you withdraw early**."
- `rdsp.detail.tips[1]`: "for lower incomes, the first $500 you put in **can become $1,500**". If the grant on the first $500 is $1,500, the plan holds $2,000, not $1,500. **Verify the arithmetic and wording against the official grant page.**
- `rdsp.detail.documents[1]`: "Be a Canadian resident under age 60". That is a rule, not a document.

**Direction.** Replace "free" with the official mechanics: "The government may add grants and bonds. You may have to pay some back if money is taken out within 10 years." Move "best-value" opinion out. Keep the 300% and $1,000-bond facts.

### P1-07 Disability-category help tells users the category cannot disqualify them; the matcher disagrees
`HELP_PAGES.disabilities` (`app.js` ~2866–2878):
> "Picking one doesn't make you eligible, and **picking the 'wrong' one doesn't disqualify you**." … "pick 'Something else / not listed' and carry on; that choice **will not disqualify you, because most programs don't depend on the category at all**."

The matcher has **fixed** category gates: `autismSelected` (both BC Autism Funding programs, `ontario-autism-program`), `developmental` (PDD: intellectual or autism, plus onset), and `passportDevelopmental`. A person who picks "Something else" gets "Does not match these answers" for those programs. The same help page says "Someone with a condition nobody's heard of can **qualify easily**." The DTC `plainTest` repeats "can qualify easily". That overclaims a program the record itself calls hard to get.
The same block names **Alberta-only** help ("Voice of Albertans with Disabilities and Inclusion Alberta … Alberta 211"). BC and Ontario users see it as well.
**Direction.** Keep the core message ("there is no official list; function matters"), and add one true line: "A few programs are only for autism or developmental disabilities. For those, the category you pick matters." Remove "easily". Make the "talk to a person" block province-aware (the help directory already uses `coverageApplies`).

### P1-08 Duplicated facts at scale (wall-of-text source)
Measured across all 134 records: **86 records (64%)** share at least three 7-word runs verbatim between two user-visible fields. The most common pairs are summary↔about (30), note↔tips (19), note↔about (17), about↔eligibility (13), about↔tips (13), steps↔documents (13), amount↔about (12). Rendering adds more repeats:
- Every guide with an amount shows the same `v.head` twice: once in the answer-first "How much?" and again in "What it can provide".
- `canadian-dental-care-plan`: the 100%/60%/40% income tiers appear in `amount` (×2 rendered), the `amountTiers` table, and `aboutList.items[0–2]`. "Established fees … you may still owe" appears in `note`, `BENEFIT_VALUES.note` and `tips[0]`.
- `leduc-subsidies`: "CLOSED … reopen … January 2027" appears in `summary`, `note`, `about`, `steps[1]` and `BENEFIT_VALUES.note`.
- `kamloops-arch`: "ARCH and KamPASS are separate" appears in `summary`, `note`, `aboutList` ×2 and `tips[1]`.
- `bc-autism-funding-6-18`/`under-6`: the 70-word TTE (training, travel and equipment) paragraph appears in `detail.about` **and** a tip, word for word, in both records.
- `aish`/`adap`: 9 tips each, 7 of them identical across the two records.
- `passport-program`: "$5,665" is stated 7 times (amount, summary, note, about, aboutList, steps ×2, tips ×3).
- `cdb-adult`: "approved for the DTC first" appears in note, about, steps, docs and the gate cue.

**Why it matters.** This is the owner's "wall of text" rule broken by repetition, not by length alone. A tired reader cannot tell whether the third mention is new information.
**Direction.** Recommendation R2 gives each field one job. Add a duplication check to `check:surfaces` (R8).

### P1-09 Repeated facts that disagree with each other
These are pairs inside one record where both versions reach the user. **I have not checked which is right. Each needs a re-read of the official page.**

| Record | Version A | Version B |
|---|---|---|
| `bc-fair-pharmacare` | `note`: Plan B "does not apply to assisted-living, extended-care, acute-care or temporary respite or **hospice** stays" and covers "eligible medical supplies **up to a maximum**" | `tips[4–5]`: "does not apply to extended-care, acute-care, **multi-level** or assisted-living facilities"; "Plan B covers **100%** of eligible prescription drugs and medical supplies" (no maximum) |
| `aadl` | `note`: "You usually pay 25% (capped per year), and low-income households **can have that waived**" | `tips[1]` / `taxNote`: "**waived entirely** for low-income households and people on AISH"; `BENEFIT_VALUES`: "covers ~75%"; `amount`: "you pay a small share" |
| `cwb-disability` | `note`: "**Claimed automatically** on your annual tax return once your DTC is on file" | `steps[1]`: "File your income tax return — **claim the disability supplement (Schedule 6)**" |
| `dtc` | `BENEFIT_META.wait`: "**8–20 weeks**" (sidebar "Wait for a decision") | `detail.time`: "Processing time **varies**; check the CRA processing-times tool" (sidebar "Processing", directly below) |
| `cdb-adult` | `BENEFIT_META.wait`: "monthly once approved" (shown as "Wait for a decision") | `detail.time`: "Paid monthly once approved." (not a decision time) |
| `bc-bus-pass` | `summary`: "**Annual** bus pass" | `about`: "provides a **monthly** pass at no annual cost" |
| `handydart-translink`, `ab-service-dog-id-card`, `bc-raha` | `wait`: "Not published" / "varies" | `time`: "within 10 days…" / "approximately 2 weeks" / "aim to assess … within 8 weeks" |
| `cpp-disability` | `note`: disability "regularly prevents **any substantial** work" | `denials[0]`: "prevent **ALL** suitable work" |

**Direction.** Re-read each official page and keep one statement per fact, in one field. The sidebar's "Wait for a decision" and "Processing" rows should merge into one row fed by one field (see P2-07).

### P1-10 Verification signals understate and confuse
- **Site-wide stamp.** `DATA_VERIFIED = "July 2026"` feeds the footer ("Info verified July 2026 · Not government-affiliated"), the privacy disclaimer ("Information was last verified July 2026") and the printed report. 51 records say October 2026 and 13 say September 2026. A user who sees "Info verified October 2026" on a guide and "July 2026" in the footer reasonably wonders which is true.
- **Two labels for the same month.** 31 records dated `2026-07` show "**Info verified July 2026**". The 39 records with no entry show "**Part of the July 2026 catalogue review**". `verifiedFor()` produces both. Nothing explains the difference, so the second reads like a weaker, vaguer version of the first. That is roughly what it means, but the reader cannot know.
- **About page** counts the 31 July-dated records among "individually re-checked against their official source" (95 of 134). Under the Oct-17 change log definition, "individually re-checked" meant "every fact confirmed". It is unclear whether the July dates meet that bar.
- **Link monitoring.** "checks official links **around the clock**" (About, Impact). `wrangler.jsonc` runs every 3 hours over 10 links per run, so the 180 links take about 54 hours to cycle. Also, a link check proves a page loads, not that its facts are unchanged, yet it sits under "How we verify facts".

**Direction.** One clear model (R6): every guide shows "Checked against the official page: {Month Year}". The footer says "Each guide shows when it was last checked" instead of a single month. Describe link monitoring honestly: "We check official links regularly and fix broken ones. A working link doesn't mean the rules haven't changed."

### P1-11 French: live, but partial, and in places it overclaims
French is "paused" in ROADMAP, but the EN/FR toggle (`#langBtn`) is live. What a French-speaking user gets:
- **Missing keys → English fallback:** all 14 `req.*` keys (the whole "Requirements to check" panel), `res.acknowledgement`, `partner.impact.link`. Every requirement cue and its wording are English and marked `lang="en"`.
- **Out-of-date wizard translations** (`STEP_I18N.fr`):
  - `age.options` are `child/adult/senior`, but the wizard now uses 8 bands (`under6`, `6to11`, …). Every age label falls back to English.
  - `forWho.options` has no `family`.
  - `residency.options` still lists `QC: "Québec"`.
  - `mobilityQ`, `dtc` and `disabilities` are hard-coded in the second person ("Pouvez-vous…", "Êtes-vous approuvé…"), while EN adapts to "your child". Steps `disabilityVerified`, `autismDiagnosis`, `functionalNeeds`, `msp`, `bcAssistance` and `circumstances` have no FR at all.
- **French says more than English** (each is a UX-02-class overclaim):

| Key | EN | FR (gloss) |
|---|---|---|
| `STEP_I18N.fr.dtc.help` | "DTC approval is required for several federal programs, but not for every disability benefit." | "Le CIPH est l'élément numéro un qui débloque **la plupart des prestations**" (unlocks *most benefits*) |
| `det.eligible` | "Based on what you told us. The program decides if you qualify." | "Ce programme correspond **étroitement** à vos réponses…" (*closely* matches) |
| `grp.ready` | "Matches your answers" | "Correspondance **probable**…" (*probable* match) |
| `resultsBlurb` (FR branch hard-coded in `app.js`) | "We did not ask about every requirement…" | "Voici ce que vous pouvez demander **dès maintenant**" (what you can apply for *right now*) |
| `income.help` | "saved only in your browser" | "nous ne conservons … rien" (see P1-01) |

- **Scope labels:** French `scopeBenefits`/`scopeResidents`/`scopeProgramList` (`i18n.js` 866–870) leave out **Ontario**. EN `scopeProgramList` leaves it out too (P2-14).
- **Terminology:** "prestations d'**invalidité**" (landing title) carries a disability-insurance or pension sense. Canadian federal French more commonly uses "prestations pour personnes handicapées". Have a translator confirm.
- The only notice that guides are English is `det.enNote` inside a guide. Results cards, the requirement panel and the browse list carry no notice.

**Direction.** Either hide the toggle until the catalogue is translated (consistent with ROADMAP), or relabel it "Français (interface seulement)". Show one clear banner on first switch: "Le contenu des prestations est en anglais." Fix the five overclaims now; they are short strings.

---

## P2 — fix soon (clarity, consistency, load)

### P2-01 Reading level and length are far above target, catalogue-wide
- `check:readability` (fresh run): **126/134** above FK 9; **52** average sentence > 20 words; **120** with a sentence > 25 words. Median FK **12.5** (p10 9.2, p90 15.7). By level: Ontario 14.8, BC 13.1, Alberta 12.8, municipal 12.1, federal 11.4.
- `check:surfaces`: gate.unmet 115/225 flagged; eligibility.note 44/68; detail.about 95/134; aboutList items 150/334; summary 26/134; note 67/134.
- Field lengths: summary median 190 chars (p90 273, max 361); note median 243 (p90 385, max 694); about median 369 (max 1,697); amount median 69 (p90 166, max 333). A median guide carries ~**418 words** of record prose (p90 649). Top five: `dtc` 1,180, `multigenerational-home-renovation-tax-credit` 1,073, `cpp-childrens-benefit` 814, `waterloo-ontario-renovates` 805, `ssah` 795.
- Tips: six records carry 9–12 tips (`dtc` 12, `odsp` 10, `bc-fair-pharmacare` 10, `bc-disability-assistance-pwd` 10, `aish` 9, `adap` 9). RESEARCH.md's own guidance is lists of about 7 items or fewer.
- Worst sampled prose: `bc-monthly-nutritional-supplement` FK 21.2; `bc-fuel-tax-refund-disabilities` 20.5; `vancouver-leisure-access` 19.3; `bc-pwd-designation` 17.7; `grt-mobilityplus` 17.7.
- **Checker artefact to know about:** the "longest sentence" for list-heavy records (Vancouver LAP 233, fuel tax 171) is inflated. 886 of 1,403 list items have no terminal punctuation, so the checker glues whole lists into one "sentence". The FK scores are still meaningful; the max-sentence values for those records are not.

### P2-02 The `about` field is often not "about" the program
`detail.about` collapses into "More about this benefit" when it is longer than 240 chars. In several records it holds fine print instead of a description, so "More about" opens on the wrong thing:
- `bc-autism-funding-under-6`: the about text **starts with** "Normally, up to 20% of the allocation can go to training, travel and equipment (TTE)…". It never says what the program is.
- `handydart-translink`: "The earliest pickup is 6 a.m. and the last drop-off is 2 a.m. …" (booking rules).
- `medical-expense-tax-credit`: line-by-line tax arithmetic, including the CRA's "Pauline" worked example.
- `home-accessibility-tax-credit`: includes the history "The annual limit was $20,000 for 2022 through 2024, and $10,000 from 2015 through 2021" (not useful for a 2026 claim).
- `bc-cy-disability-benefit`: ends with "Part of a $475-million, three-year provincial investment…" (policy context, not user help).

### P2-03 Two "Good to know" blocks on one guide; `taxNote` used for non-tax facts
`b.note` renders under `guide.goodToKnow` ("Good to know"), and `BENEFIT_EXTRA[id].taxNote` renders as a second callout also titled "Good to know". Ten records have both (dtc, cpp-disability, aish, adap, rdsp, cdb-adult, cwb-disability, aadl, adult-health-benefit, child-disability-benefit via faqs/related). `aadl.taxNote` is about cost-sharing, not tax. TEMPLATE-SPEC §3 calls for "One 'Good to know' callout".

### P2-04 Federal records carry Alberta-only content
- `cdb-adult` tip and taxNote: "If you receive AISH or ADAP, report … Alberta says that when no CDB decision had been made by February 28, 2026, $200 was reduced from April 2026…". BC and Ontario users see this on a federal benefit. It is also a past event phrased as current advice.
- `rdsp` taxNote and FAQ: "exempt from **AISH** and most provincial benefits"; FAQ question "Does it affect my AISH?". The "most provincial benefits" generalization needs a source for each province.
- `cpp-disability` taxNote: "can reduce income-tested benefits (**AISH**, GIS, provincial assistance)".
- `HELP_PAGES.disabilities` (P1-07), and `mb.caveat` (P1-05).

**Direction.** Add an optional `province` key to tips and notes, or move province interactions into the provincial record ("If you get CDB, tell AISH…" belongs on `aish`, where it already exists).

### P2-05 Unexplained acronyms and internal codes
Examples where a user meets an acronym with no expansion in the same view:
- **REQS:** `bcMedTransportRoute` "PPMB", "MSO"; `burnabyFairPlayRoute` "CUAET"; `odspMedical` "CPP-D or QPP-D"; `bcPwdDesignationFinancial` "prescribed-class routes".
- **Records:** `vancouver-leisure-access` "MSDPR assistance … RAP, SAFER"; `bc-cy-disability-benefit` "SAET", "CYSN", "AAC", "SMA types 1 and 2"; `leduc-subsidies` "LATS"; `grt-mobilityplus` "ATP"; `bc-autism-*` "RASP", "BCAAN", "TTE", "MyFS", "PANTER", "ADOS-2 and ADI-R"; `toronto-fair-pass` "OW/ODSP member ID" (in META effort).
- **Card tag:** `stalbert-subsidy` head "(AISH/ADAP)".
- `waterloo-ontario-renovates.eligibility.note` quotes "line 316 or 318". Those look like pre-2019 CRA line numbers; current returns use 5-digit lines. **Verify against the Region's page** before rewording.

**Direction.** Add a shared glossary in `data.js` (`GLOSSARY = { PPMB: "Persons with Persistent Multiple Barriers", … }`), with each expansion copied from the official page. Render the first use per guide as `<abbr>`, or as an expansion in brackets. The checker can flag 2–6-letter capitalised tokens that are not in the glossary.

### P2-06 "Meta-language" that exposes our research process to the user
22 records contain phrases like "the page says", "the City says", "Alberta says", "the fact sheet", "this page does not". Examples:
- `parking-placard.note`: "…The page says you may be eligible."
- `waterloo-ontario-renovates`: "The fact sheet gives both dates…", repeated in note, steps and tips.
- `toronto-fair-pass.eligibility.items[3]`: "…(one line of its page says over 18)".
- `trillium-drug-program.eligibility.note`: "people the page does not list".
- `vancouver-leisure-access.documents`: "(the page says not a Notice of Assessment)".

Some of these are honest and necessary, because the official page really is inconsistent (Toronto, Waterloo). The problem is repetition, and pages named without saying which page. **Direction:** state the conflict **once**, in a "Watch out" callout naming the source ("The City of Toronto's Fair Pass page gives two different ages. Ask the City who is counted."). Elsewhere, say the rule plainly with its qualifier ("You may be eligible if…").

### P2-07 Sidebar "At a glance" labels don't match their content
In `renderGuideBody`'s `facts`:
- "**Time to apply**" shows `BENEFIT_META.effort`. Only 5 of 134 effort strings are durations ("30–60 min + a doctor visit"). The rest are descriptions ("Two-part application, including a Health/Disability Professional form", up to 158 chars). Static pages label the same field "Application".
- "**Wait for a decision**" (`META.wait`) and "**Processing**" (`detail.time`) both render. 89 records have both, and several disagree (P1-09). `detail.time` is also used for deadlines (autism funding "New applications are accepted until March 2027…"). 74 of 134 waits are "Not published", "varies" or "ask". On result cards, `metaRow` prints "Wait: Not published" 31 times.
- The answer-first card repeats `d.time` as "How long:", so the same sentence can appear three times on one page.
- Static vs SPA labels differ for the same data: "Application"/"Time to apply", "Decision timing"/"Wait for a decision", "Timing"/"Processing".

**Direction.** Use two labelled facts: "**How to apply**" (effort) and "**How long it takes**" (one merged, sourced field). Hide the row when the answer is "Not published" (or show "Not published by the program" once, in the guide only). Move deadlines to a `deadline` callout.

### P2-08 Category taxonomy: 26 overlapping values, shown as a tag on every card and guide
Values: Transit (20), Recreation (17), Health (16), Getting around & recreation (15), Education (10), Tax (10), Money (9), Daily living supports (5), Children (3), Equipment (3), Health & equipment (3), Home support (2), Home (2), Parking (2), Money & taxes (2), Money (for parents) (2), Getting around (2), Family (2), Work (2), Housing (1), Community supports (1), Income support (1), Money & savings (1), Family supports (1), Employment (1), Health (for children) (1). Inconsistencies a user can see:
- ODSP is "Income support" while AISH, ADAP and BC PWD assistance are "Money".
- The DTC and CWB are "Money & taxes" while METC and HATC are "Tax".
- `bc-pwd-designation` is "Money", though its amount says "No direct payment".
- `bc-fuel-tax-refund-disabilities` and `bc-icbc-disability-discount` are "Transit" (vehicle tax and insurance).
- `bc-clbc` (adults) is "Family".
- `sprucegrove-low-income-transit` is "Getting around" while other transit is "Transit".

The card also shows `PROGRAM_TYPES` badges ("Tax credit", "Income benefit"…) next to the category tag, giving two taxonomies on one card. **Direction:** keep `PROGRAM_TYPES` as the single user-facing "what kind of help" badge (7 values). Collapse `category` to the 6 landing themes (`cat.*`), or stop showing it.

### P2-09 Overclaiming or unsourced adjectives in the July-era records
- "One of the best-value benefits available" (`rdsp.note`).
- "free government money" (`rdsp`).
- "don't leave it on the table" (`rdsp` tip).
- "many are approved at that stage" (`cpp-disability` tip and appeal).
- "MNS denials are frequently overturned with better medical detail" (`bc-monthly-nutritional-supplement` tip).
- "many people also receive AISH at the same time" (`pdd`).
- "many families don't realize it's covered" (`fscd`).
- "Covers a huge range of devices" (`aadl`).
- "so getting every document in sooner is worth real money" (`aish`/`adap`).
- "it still unlocks the RDSP and Canada Disability Benefit" (`dtc.taxNote`).
- "The Disability Tax Credit unlocks more than anything else here" (DTC help lead).
- "it unlocks this" (REQS `dtc.unmet`).
- "They'll point you to the exact local programs" (`local-supports`).
- "full health supplements" (`bc-disability-assistance-pwd.summary`; each supplement has its own criteria).
- "Canada lists it … **because** so many disabled people have no workplace dental coverage" (`canadian-dental-care-plan.summary`: a reason attributed to the government that needs a source).

"Unlocks" implies that the DTC alone gets you the benefit; it is a prerequisite, not sufficient. **Direction:** replace with the official mechanism ("is required before you can apply for…"). Delete frequency claims ("many", "frequently") unless the program publishes them.

### P2-10 Stale tense and dated facts phrased as current
- `bc-cy-disability-benefit.note`: "**Starts** April 1, 2026." (past); summary "**New** direct-funding benefit".
- `cdb-adult.about`: "A **new** federal income top-up (started July 2025)".
- `vancouver-leisure-access.amount`: "a pass **now** valid for 3 years".
- `bc-disability-assistance-pwd.note`: "Rates effective December 1, 2025, **re-verified July 2026** — $1,483.50 single is still the current maximum." That is internal QA language in a user-facing note.
- `ontario-autism-program` tip: "If you registered before April 2021, ask about interim one-time funding".
- `aish`/`adap`/`cdb-adult`: the Feb 28, 2026 CDB reporting deduction.

**Direction.** Write dated facts with their date ("From April 1, 2026, …"), never "new", "now" or "starts". Put QA provenance in comments, not in `note`.

### P2-11 Time-limited programs don't say so where people decide
`bc-autism-funding-under-6` shows "Up to $22,000/year" on its card. `bc-autism-funding-6-18` shows "Up to $6,000/year". Neither card summary says the program **ends March 31, 2027** (it is only in `note`, which is guide-only). `waterloo-ontario-renovates` has a fall-2026 deadline that appears only inside the guide. `leduc-subsidies` puts "CLOSED" in capitals in five fields instead of one status badge.
**Direction.** Add a structured `status: { kind: "closing" | "closed" | "deadline", date, text }` rendered as a badge on cards and the guide hero (R4). Remove the repeated prose and the capitals.

### P2-12 "Documents" lists contain rules and people, not documents
11 items are not documents:
- `rdsp`: "Be a Canadian resident under age 60".
- `cpp-disability`: "Enough CPP contributions (generally 4 of the last 6 years)".
- `dtc`: "A medical practitioner familiar with your condition", "Real examples of how it limits you…".
- `child-disability-benefit`: "You must be the person receiving the CCB".
- `passport-program`: "The developmental disability should be determined by a psychologist…".
- `aadl`: "An assessment from an authorized professional…".
- `local-supports`: "Your city or town name", "A rough idea of your household income".
- `woodbuffalo-lift`: "You must be 18 or older…".
- `bc-bus-pass`: "No new documents if you already receive…" (useful, but it is a note).

These feed the shared "Documents several programs ask for" checklist, so rules end up in a document checklist.

### P2-13 Eligibility list logic and lead-ins
- `home-accessibility-tax-credit` is `mode: "all"` ("You must meet all of these:"), but item 2 is an option, not a requirement: "A spouse, common-law partner or certain other relatives may claim instead".
- `dtc.aboutList.items[2]` starts "For this route, the therapy must be…". It refers back to the end of the previous item, so the third route has no name on its own line.
- `cdb-adult.aboutList.items[0]`: "If your adjusted family net income is considerably above **that threshold**, your benefit amount will be $0." It comes **before** the item that introduces the threshold.
- `bc-fuel-tax-refund-disabilities.eligibility.items`: "Medical certification confirming one of the following conditions:" is repeated as the prefix of six separate items. The official structure is a nested list.
- **Static guides only:** for `mode: "any"` the lead-in is "**You qualify if any of these apply:**" (`gen-guide-pages.js` line ~220). That is an eligibility verdict, and it ignores the other conditions (residency, exclusions) on the same page. The SPA correctly says "The program requires at least one of these:". This is close to P1, because it is an overclaim on the indexed SEO pages. Fix it with a one-line change.
- 40 records (including `dtc`, `cdb-adult`, `cpp-disability`, `aish`, `adap`, `bc-disability-assistance-pwd`) have **no** `eligibility` and no `requiresNote`, so the guide has no "What you must meet" section. Their criteria are buried in `about` or `note`, or reachable only through the post-wizard requirement panel.

### P2-14 Interface claims that are out of date or too strong
- `pro.what.p`: "more than **35** verified {scopeProgramList} programs". The catalogue has 134. The EN `scopeProgramList` is "Alberta, British Columbia, federal, and municipal" (no Ontario), and FR is the same.
- `how.1p` / `final.sub`: "Takes **about a minute**". The wizard has 12–17 visible steps depending on answers; `pro.use.1` says "a few minutes". Use one honest figure, or none.
- `prob.good1`: "Answer a few checkboxes — **no reading required**". Several steps have long option lists and help pages.
- `how.3h`: "Apply **with confidence**"; `prob.bad3`: "You never actually find out what *you* qualify for". The product does not tell people what they qualify for either, so the contrast implies more than it delivers.
- `land.sub`: "screens out **known conflicts**". That is jargon; the reader cannot tell what a conflict is.
- `mobilityQ.help`: "This **decides** whether an accessible parking placard applies to you." The program decides.
- `dtc` wizard side note: "How to check in 2 minutes — **it's worth the most here**". The DTC is non-refundable and `excludeFromEstimate`, so its value is unknown.
- `rank-badge title`: "Suggested order to apply". UX-03 records that the weights behind it are editorial and unvalidated. "Suggested order" sounds like advice; "Our rough order (not official)" says what it is.
- `res.headline`: "**21** benefits you may be able to get". The count includes every "More to check" item, which B-USER-JOURNEY shows is mostly items that do not fit. Content-only fix: "21 programs to look at" or "1 matches your answers · 20 to check".
- Supports hook: "**Many** can be tried without an application" (unsourced count).

### P2-15 Requirement texts (REQS) — voice, length and fallbacks
Measured over 226 `REQS` entries:
- **Openings** mix five voices: "This is for…" (69), "You must…" (20), "You need…" (8), program-as-subject ("ODSP decides…", "AISH decides…", "ACSD assesses…"), and imperative ("Confirm that…", "Check…"). In one panel, a reader moves between being told, being ordered and being described.
- **Length:** median 108 chars, p90 336, max 626 (`cwbEligibility`); 72 are over 200 chars and 14 over 400. Of the 115 flagged texts, 114 have a short cue (good). **30 actionable (non-fixed) gates have no cue**. They fall into the "Other checks" group in full, e.g. `bcCydbIntake` (327 chars), `achbOlderDependent` (218), `fscdEligibility`, `homeowner`, `aCardProof`.
- **Short cues:** 94 of 118 start with "Check" and 20 with "Ask" (consistent and good). Four break the pattern: `ssahDocumentation` "A health professional documents your child's limits; funding is not guaranteed" (a statement, not an action); `planGClinicalAndFinancialNeed` "Your prescriber confirms…"; `notBcStudentAidDuplicate` "In B.C., apply for this…"; `yorkHomemakersNeed` "Contact York Region…".
- **Fixed gates with "Check…" cues** (9: `stalbert`, `lloydminster`, `windsorEssex`, `outsideMetroVancouver`, `torontoFairPassAge`, `bcCydbAge`, `achbAge`, `notPostSecondaryStudent`, `notBcStudentAidDuplicate`). A fixed gate produces "Does not match these answers", and the "not a match" list shows `unmet`, not the cue. So these cues are dead copy, and "Check whether…" contradicts a final "no".
- **Duplicates:** `adult` and `workingAge` have identical text ("This is for people aged 18–64."). `under60` "You must be under 60 to **open this**" works only on the RDSP.
- **"Unlocks"** in `dtc.unmet` ("Get approved for the Disability Tax Credit first — it unlocks this.") and in the unsure override ("…apply for it; it unlocks this."). See P2-09.
- **Group labels:** "What you can check or prepare / What a professional confirms / What the program decides / **Shared checks** / Other checks". "Shared checks" (needs with more than one `who`) is unclear. Try "Checks you'll do with someone else".
- **Count wording:** `req.count` "2 requirements not yet confirmed". For DTC the `prolonged` and `certifier` gates can never be confirmed by the user, so "not yet" implies a step the user cannot take. Try "2 things the program or a professional must confirm".
- **Rendering inconsistency:** after a "Check this fact" change, `wireFactChecks` rebuilds the requirement list from `n.text` (the full official wording) with no grouping and no cues, so the tidy cue list turns into the long list mid-interaction (`app.js` ~4559). That is a content-presentation regression to fix with the pilot.
- **Spelling:** "enroled" appears 10 times (e.g. `bcSupplementaryBenefitsEligibility`, `bc-msp-supplementary-benefits.about`) against "enrolled" 38 times. Check whether the BC source uses "enrolled" before changing it. If it is verbatim, keep it inside the quoted wording and use "enrolled" in our own words.

### P2-16 Next-step clarity: apply buttons that don't say what happens
`applyText` labels fall into three groups. 61 are actions ("Apply for…", "Register…"). 37 are information links ("See reduced fares", "Learn how to apply", "See funding and application details"). 36 are just the program name ("Alberta Aids to Daily Living", "Persons with Developmental Disabilities", "Form XE8, Application for…"), and 4 are missing (`cpp-childrens-benefit`, `ab-service-dog-id-card`, `ab-capcc`, `ab-special-needs-housing`), which fall back to "Open the application". A button reading "Family Support for Children with Disabilities" doesn't tell a tired user whether it opens a form or a description.
**Direction.** Use verb + destination: "Read how to apply on alberta.ca" / "Start the online application (CRA)". Several programs (AADL, PDD, FSCD) have **no** self-serve application, because you start through a person. The button should say that: "Find an AADL authorizer". Each record's step 1 already holds the right verb.

### P2-17 Disclaimers repeated until they become noise (and miss where they matter)
On one guide page after the wizard:
- "Based on what you told us. The program decides if you qualify." appears twice (answer-first cell and side card).
- `req.context` "Some checks involve a professional or a program decision."
- The fact-check block "…The program still decides."
- The side-next text "Confirm the current rules, then use the official application."
- The stale warning, `det.enNote` and the footer.

On the results page, every ready card repeats `det.eligible`, and the money band repeats it again. Then `mb.caveat`, `res.acknowledgement` and the long `disclaimer` follow. Meanwhile, **money** headlines carry no caveat at the point of reading (P1-04/05), and the static guide pages carry three: "Confirm before applying", "Your next step: … check the current rules", and "Benefit rules and amounts can change."
**Direction (R7).** Say "the program decides" **once per page**, next to the status. Attach the money caveat to the number ("Up to $X/month — the program works out your amount"). Leave the rest to the footer.

### P2-18 Privacy and About pages use developer vocabulary
"IndexedDB database", "sent to our Worker", "Cloudflare's AI service", "Browser Insights beacon" and "Asset version 189" (in change log entries) are accurate but unreadable for the audience. The change log also exposes internal batch language: "batch eig100", "TTE items 34 and 39", "supplied official-page snapshots", "whole-entry verification dates". Keep the precise text as a "Technical details" expander, and lead with a plain sentence ("Your answers are stored in this browser, like a bookmark. We can't see them.").
The privacy page also says "Click the **AbilityFinder logo** (or 'Start over') to wipe your answers." If the logo really clears answers, that is a surprising, destructive action that people trigger while trying to "go home", and the logo and button need a warning. If it doesn't, the sentence is wrong. **Verify the behaviour.**

### P2-19 Units and periods are inconsistent
- `b.amount` units across 134 records: per year (31), per month (24), one-time (5), and **74 with no unit**. Many of those are legitimately non-cash, but the unit-less ones include "Up to $22,000/year"-style strings in other fields.
- Some records state no period at all. "Up to 75% of the approved amount" (`on-adp`) is fine. "Up to $3,500 grant + $1,000 bond per year" is fine. `kamloops-arch` "Up to $400 in recreation credits per year" says "per year" in one place and "a year" in another.
- Formats mix "/month", " a month", "/mo", "per month", "monthly", and "per cent" (7), "percent" (11), "%" (236). B.C. (77) and BC (212) also mix, though BC Transit is a brand name.
- The `disclaimer` says "Amounts shown are 2025–2026 figures", but records now carry July 2026–June 2027 (CDB), 2026 (CPP children's, Calgary), "2025 tax year" (MHRTC) and Aug 1, 2023 (BC MNS rate table). A single global year is no longer true. Show the period on each figure instead.

---

## P3 — polish / latent

- **P3-01** List-item style: 69 list items in 7 records start lowercase (`home-accessibility-tax-credit`, `canadian-dental-care-plan`, `disability-supports-deduction`, `medical-expense-tax-credit`, `canada-caregiver-credit`, `bc-additional-home-owner-grant`, `bc-raha`). 886 of 1,403 items have no full stop while the rest do. Pick one rule: sentence case, and full stops on items that are sentences.
- **P3-02** All-caps emphasis in 21 records (NOT ×8, AND ×7, OR ×5, ALL ×4, CLOSED ×3, LESSER ×2, BEFORE ×2, ONE ×2, FIRST). Screen readers may spell some of these out letter by letter. Use `<strong>` and the callout types instead.
- **P3-03** Program names up to 78 chars ("a-card — free OC Transpo travel if you are blind or partially sighted (Ottawa)"). The descriptive tails belong in `summary`. Keep the official name plus a place qualifier.
- **P3-04** `bc-cy-disability-benefit.source` is a **news release** (`news.gov.bc.ca/releases/2026CFD0002-000136`), the only record whose source is not a program page. Now that the program page exists (it is the `applyUrl`), make that the source.
- **P3-05** `bc-icbc-disability-discount` duplicates the 25% ICBC discount already stated in `bc-fuel-tax-refund-disabilities.amount`. Keep both records if matching needs them, but say "same registration as the Fuel Tax Refund" once and link with `related`.
- **P3-06** `cpp-childrens-benefit.about` opens with "disabled **or deceased** CPP contributor". The survivor case is out of scope here and adds a confusing branch.
- **P3-07** The 404 page ("Let's get you back to finding benefits you may qualify for") and the render-error copy ("This is our bug, not anything you did. Your answers are still saved.") are good, reassuring models. The "Start over" button on the error card should say it clears answers.
- **P3-08** Dead-but-tested money branch (`mb.upTo`). It is fine to keep, but make it obey P1-05 before anything makes it reachable.
- **P3-09** Directory pages: the Oct-19 change log says all 48 grant and organization entries were "re-checked", but their "Verified {date}" stays July/Sept 2026 ("whole-entry verification dates are unchanged"). Readers will take "re-checked" plus an old date as a contradiction. Explain it in one line on the directory page, or update the dates.
- **P3-10** Landing `cats.note` lists diagnoses ("for ADHD, autism, mental health…"). That is consistent with recognition goals, but pair it with the function-first line already used in help ("You don't need a diagnosis").
- **P3-11** `orgs`/`grants` "Verified {date}" vs benefits "Info verified {Month Year}" vs updates "Recently verified": three phrasings.

---

## Sample records — per-record notes

FK = Flesch–Kincaid grade from the fresh `check:readability` run (target ≤ 9). "What you get" asks whether the headline tells you what arrives and how often. "Next step" asks whether the apply button and step 1 make the first action obvious.

| Record | FK | Main issues (field → problem) | What you get | Next step |
|---|---:|---|---|---|
| `dtc` | 13.7 | about 1,697 chars mirrored in aboutList; 12 tips; two "Good to know"; wait "8–20 weeks" vs time "varies"; plainTest "qualify easily"; aboutList item 3 "For this route" | clear and honest ("actual tax reduction varies") | good (T2201) |
| `cdb-adult` | 10.0 | Alberta AISH tip on a federal record; aboutList item order (the "$0" line before the threshold); meta wait "monthly once approved"; "new" | SPA annual vs static monthly; period dropped in SPA | "Learn how to apply" (info, not action) |
| `rdsp` | 9.2 | "free government money", "best-value", "$500 can become $1,500" (verify); rule in docs; AISH FAQ for all provinces; inherited July date | overstated (P1-06) | good |
| `cpp-disability` | 8.8 | "many are approved" ×2; "ALL suitable work" vs "any substantial work"; contribution rule in docs | SPA "Est. value $611–$1,741/month" vs static "based on contributions" | good |
| `cwb-disability` | 8.7 | "claimed automatically" vs "claim … Schedule 6"; inherited July | static has no figure; SPA "Up to $843/year" | "Canada Workers Benefit details" |
| `medical-expense-tax-credit` | 12.0 | about is line arithmetic; lowercase steps; "this is where most of them are claimed" | clear threshold rule | good |
| `home-accessibility-tax-credit` | 12.5 | "Up to $20,000 per year in eligible expenses" reads as money received; historic limits; option listed as an "all" requirement | **unclear**: needs "this is a spending limit, not your credit". The record correctly withholds the rate | good (line 31285) |
| `canadian-dental-care-plan` | 11.0 | tiers ×4; "established fees" ×3; requiresNote 731 duplicates eligibility; summary "because…" | clear (table) | good |
| `multigenerational-home-renovation-tax-credit` | 15.7 | requiresNote 1,100 chars; about 1,508; 1,073 words total | clear (14.5%, $7,250, 2025) | good |
| `child-disability-benefit` | 10.6 | "about $82,847" (exact figure plus "about", no benefit year); inherited July | clear | "How the Child Disability Benefit works" (info) |
| `cpp-childrens-benefit` | 11.2 | no applyText; "or deceased"; "maximum of two" ×2 | clear | fallback label |
| `aish` | 11.9 | 9 tips (7 shared with ADAP); 4 phone numbers in tips plus PHONE; past Feb-2026 deduction | **no figure** while ADAP shows "Up to $1,740/month". Verify whether Alberta publishes the AISH living-allowance amount and show it if so | good |
| `adap` | 13.3 | same duplication as AISH | figure present | good |
| `pdd` | 13.8 | "many people also receive AISH"; inherited July | honest ("not a cash payment") | button is the program name |
| `fscd` | 15.1 | "many families don't realize it's covered" | vague ("Services + funding") | program name |
| `aadl` | 11.2 | cost-share stated 5 ways, inconsistently; taxNote misuse; "huge range" | conflicting (P1-09) | program name; real first step is an authorizer |
| `parking-placard` | 10.2 | "The page says you may be eligible"; "Low-cost" (fee not stated; verify) | vague | good |
| `calgary-fair-entry` | 7.6 | bands stated 3× | clear ($6.30–$63) | good |
| `edmonton-fare-assistance` | 13.9 | inherited July; clear otherwise | clear | info-style label |
| `leduc-subsidies` | 11.0 | "CLOSED" ×5 in capitals; static page omits the closure | SPA clear | good |
| `reddeer-fee-assistance` | 10.2 | SPA head drops "per eligible person" and "pending available funding"; "automatically … when you show documents" | partly | good |
| `local-supports` | 10.0 | "exact local programs"; docs are not documents | "Varies" (honest) | good (211) |
| `bc-disability-assistance-pwd` | 11.7 | QA text in note ("re-verified July 2026"); "full health supplements"; 10 tips repeat the note | clear | good |
| `bc-pwd-designation` | 17.7 | category "Money" for a no-payment status; inherited July | clear ("No direct payment…") | good |
| `bc-autism-funding-under-6` | 14.8 | about is TTE fine print; TTE text ×2; end date not on card | figure clear, **end date hidden** | good |
| `bc-autism-funding-6-18` | 12.7 | same; "easier to fund" editorial | same | good |
| `bc-cy-disability-benefit` | 16.8 | source is a news release; "Starts April 1, 2026"; diagnoses listed in the summary may read as automatic eligibility; $475M context | clear tiers | good |
| `bc-fair-pharmacare` | 13.5 | note is 621 chars about Plan B (another plan); Plan B lists disagree; 10 tips including Plan NP and nicotine | 333-char amount as a headline | good |
| `bc-bus-pass` | 13.3 | "Annual" vs "monthly pass" | clear fee | good |
| `bc-monthly-nutritional-supplement` | 21.2 | "frequently overturned"; FK 21 | clear | button is "Get form HR2847 (PDF)" (good) |
| `bc-fuel-tax-refund-disabilities` | 20.5 | category "Transit"; repeated "Medical certification…" prefix ×6; amount 201 chars | clear ($500 + 25%) | good |
| `bc-icbc-disability-discount` | 13.7 | duplicates the fuel record; category "Transit" | clear | good |
| `vancouver-leisure-access` | 19.3 | UBC note ×3; MSDPR/RAP/SAFER; 9 docs; "now"; inherited July | clear | good |
| `handydart-translink` | 9.1 | about holds booking hours; wait vs time conflict; inherited July | clear fare | download link (good) |
| `kamloops-arch` | 15.8 | ARCH ≠ KamPASS ×5; "ONE" | clear | good |
| `odsp` | 13.8 | 10 tips; CDB exemption ×2; no `time` | clear | good |
| `ontario-autism-program` | 15.5 | pre-2021 tip | honest ("no published amount") | good |
| `ssah` | 16.6 | long professional list in tip; discretionary stated ×3 | honest | info label |
| `passport-program` | 14.1 | $5,665 ×7; rule in docs | clear | good |
| `trillium-drug-program` | 14.9 | "4%" ×5; "the page does not list" | clear | good |
| `on-adp` | 13.6 | "Generally," on three items (official, keep) | clear | info label |
| `toronto-fair-pass` | 10.5 | source inconsistency stated ×3 | clear | good |
| `grt-mobilityplus` | 17.7 | summary doesn't say what the service is in plain words; "ATP" | fares clear | good |
| `waterloo-ontario-renovates` | 12.9 | deadline conflict ×3; "line 316 or 318" (verify); 805 words | clear but long | info label |
| `ottawa-equipass` | 9.1 | "Social Services" vague | clear | info label |
| `mississauga-activeassist` | 15.1 | good structure; LICO table in a note | clear | good |
| `windsor-affordable-pass` | 13.5 | first-come-first-served ×3; 721 words | clear | info label |

**Pattern.** The Ontario and September–October re-verified records are the quality bar: structured eligibility with an explicit all/any, verbatim qualifiers, no hype. Their weakness is length and repetition, not accuracy. The July-era AB and federal records need the voice and accuracy passes (P1-06, P1-09, P2-09).

---

## Trust signals — how they read today

| Signal | Where | Reads as | Problem |
|---|---|---|---|
| "Info verified {Month}" | guide side card (SPA) and static guides | strong | the same month also appears as the weaker "Part of the … catalogue review", unexplained |
| "Info verified July 2026" | footer, privacy, print | site-wide claim | out of date for 64 records (P1-10) |
| Stale warning (≥ 9 months) | guide side card | good, specific ("Amounts and income rules usually change each year…") | none |
| "official info page" link | side card | fine | lower-case label; the apply link and the source link often go to the **same URL** (e.g. ODSP, Trillium), so users see two buttons with one destination |
| "The program decides if you qualify" | everywhere | honest | repeated until it is noise (P2-17) |
| Change log | Updates page | strong in principle | future dates, internal jargon, count mismatch (P1-02, P2-18) |
| "Not government-affiliated" | footer, static | good | none |
| Link monitoring | About, Impact, partner page | reassuring | "around the clock" overstates; it is about links, not facts (P1-10) |
| "Includes facts you checked on this device." | cards and guide when a fact check is used | clear | none |
| Honest gaps ("no published amount", "the CRA publishes no per-litre amount", "Alberta publishes no annual dollar value") | ~15 records | **excellent: the strongest trust builder on the site** | make this a standard field (R3: "What you get: Not published by the program") |

---

## Systemic recommendations

### R1 — A one-page content style guide (put it in `HANDOFF.md` or `docs/CONTENT-STYLE.md`)
1. **Voice:** second person and present tense ("You can…", "You must…"). Use the program as subject only for decisions ("ODSP decides…").
2. **No unsourced adjectives:** no best, huge, easily, free money, many or frequently, unless the program publishes the claim. Never "unlocks"; write "is required before".
3. **Dates:** absolute dates ("From April 1, 2026"), never "new", "now" or "starts". Every dollar figure carries its period ("/month", "per school year (Aug 1–Jul 31)", "for the 2025 tax year").
4. **Units:** "$X a month" in prose and "$X/month" in headlines. Use "%" (never "per cent"/"percent" in our own words). Pick "B.C." or "BC" once for our own prose; brand names (BC Transit) stay as they are.
5. **Acronyms:** expand on first use per page, using the glossary.
6. **Source conflicts:** say them once, in a "Watch out" callout naming the source. No "the page says" elsewhere.
7. **Lists:** sentence case. A full stop only when the item is a sentence. 7 items maximum, or split under subheadings.
8. **Emphasis:** no capitals. Use callout types.
9. **Province scope:** a tip that only applies in one province goes on that province's record, or carries `province:`.
10. **Internal QA language never goes in user fields.** Use comments or the change log.

### R2 — Give each field one job (removes most of P1-08)
| Field | One job | Must not contain |
|---|---|---|
| `name` | official name + place | descriptions |
| `summary` | one sentence: who it's for + what kind of help | amounts already in `amount`, rules, history |
| `amount` / `whatYouGet` | the headline value with its period and key qualifier, or "Not published by the program" | eligibility |
| `eligibility` | the rules (all/any), verbatim qualifiers | how-to steps |
| `note` → `callouts[]` | at most one each of **Watch out** (common mistake/conflict) and **Deadline** | anything repeated elsewhere |
| `detail.about` | what the program is and does, behind the expander | fine print, booking hours, history, policy budgets |
| `detail.steps` | ordered actions, starting with a verb | documents |
| `detail.documents` | things to gather | rules, people |
| `detail.tips` | ≤ 5 non-obvious, sourced tips | restated rules or notes |
| `META.effort` / `detail.time` | "How to apply" / "How long it takes", one field each | deadlines |

### R3 — A standard card ("What you get / Who it's for / How to apply / Watch out")
This should be the same on the result card, the SPA guide header and the static guide:

```
[Badge: Income benefit]  [Status: Ends Mar 31, 2027]   Alberta
Program name
What you get   Up to $1,740 a month, plus health benefits        ← b.amount (one source)
Who it's for   Adults whose severe disability limits work        ← summary, one line
How to apply   One combined AISH/ADAP application → [Start the application on alberta.ca]
Watch out      Alberta, not this tool, decides the program and amount.   ← single callout
Checked against alberta.ca: July 2026
```
Every value comes from an existing field. Nothing new is invented. The existing `answer-first` section is 80% of this already; it needs the single amount source (P1-04) and the status badge (R4).

### R4 — Structured status
Use `status: { kind: "closed" | "closing" | "deadline" | "waitlist", date: "YYYY-MM-DD", text }`. Render it as one badge on the card, the guide hero and the static page. Candidates found: `leduc-subsidies` (recreation closed until Jan 2027), both `bc-autism-funding-*` (ends Mar 31, 2027), `waterloo-ontario-renovates` (fall 2026 deadline, conflicting dates), `waterloo-homemaking-support` (2–3-year waitlist). Remove the repeated prose.

### R5 — Field-length budgets (enforced by `check:surfaces`, ratchet-style like today)
| Surface | Budget | Today (median / p90 / max) |
|---|---|---|
| `summary` | ≤ 160 chars, 1 sentence | 190 / 273 / 361 |
| `amount` (headline) | ≤ 90 chars; the rest goes to `amountTiers` | 69 / 166 / 333 |
| callout (`note`) | ≤ 200 chars, ≤ 2 sentences | 243 / 385 / 694 |
| `about` (visible) | ≤ 240 (anything longer → aboutList) | 369 / 836 / 1,697 |
| eligibility item | ≤ 160 chars, 1 rule (existing 120-char cue rule) | — |
| REQS `short` | ≤ 70 chars, starts with Check/Ask/Gather | 61 / — / 78 |
| tips | ≤ 5 items, ≤ 160 chars each | 3 / 5 / 12 items |
| guide total (record prose) | ≤ 450 words visible before expanders | 418 / 649 / 1,180 |

### R6 — One verification model
- Per guide: "Checked against {source host}: {Month Year}". If you keep the inherited state, say what it means: "Last full catalogue review: July 2026 — this guide hasn't been re-checked since."
- Footer: "Each guide shows when it was checked", not one month.
- Change log: publish date only, generated counts, plain-language summary first, technical detail behind an expander.
- Link monitoring: "We check official links regularly. A working link doesn't mean the rules haven't changed."

### R7 — Disclaimer placement policy
| Message | Where (once) |
|---|---|
| "The program decides if you qualify." | next to each status, once per page; not repeated in the money band |
| Money caveat | attached to the number ("Up to $X a month · the program works out your amount") |
| Not advice / not government | footer only |
| Language notice (FR) | one banner on switch, plus a tag on English content |

### R8 — Make the checker catch these classes (all read-only checks, no data changes)
1. Cross-field duplication: 7-gram overlap ≥ 3 between user-visible fields of one record (finds the 86).
2. Acronym tokens that are neither in the glossary nor expanded in the record.
3. Banned phrases list (R1 #2) and capital-letter emphasis.
4. Changelog dates later than the build date; changelog counts against `BENEFIT_VERIFIED`.
5. SPA headline vs static headline equality (P1-04).
6. Province-specific terms (AISH, ADAP, ODSP, PWD, MSP) in records of another level, with an allowlist for real cross-references.
7. `documents` items that start with "Be ", "You must", "Enough", "A … practitioner".
8. A fix to the sentence splitter: treat list items as sentence boundaries, so max-sentence stops reporting 233-word "sentences".
9. FR key parity for `req.*` and a stale-`STEP_I18N` check (option keys must exist in the EN step's options).

### R9 — Owner decisions needed (not things a writer should decide alone)
- French: hide the toggle, or ship an explicit "interface only" mode (P1-11).
- Whether "Est. value" survives at all (P1-05).
- Whether `category` stays user-visible (P2-08).
- Whether to keep the DTC `plainTest` encouragement voice, minus "easily" (P1-07, P2-09).

---

## Items that need an official-source re-read before any wording change
These are listed so nobody "fixes" them by guessing:
1. `rdsp`: the "$500 can become $1,500" arithmetic, and the 10-year repayment rule wording.
2. `aadl`: the cost-share wording (25%, cap, waiver conditions).
3. `bc-fair-pharmacare`: the Plan B exclusion list and the supplies maximum.
4. `cwb-disability`: automatic vs Schedule 6 claim.
5. `dtc`: whether any decision-time figure should appear (META "8–20 weeks").
6. `cpp-disability`: whether $611 is a published minimum.
7. `aish`: whether a published monthly living-allowance amount exists.
8. `bc-bus-pass`: annual vs monthly pass wording.
9. `parking-placard`: the fee ("Low-cost").
10. `waterloo-ontario-renovates`: the current line numbers, and the deadline once the Region resolves it.
11. "enroled" vs "enrolled" in BC records.
12. The landing transit figure ($5.90 vs $6.30).
13. The changelog count (54 vs 51).
14. The privacy-page claim that clicking the logo wipes answers.
