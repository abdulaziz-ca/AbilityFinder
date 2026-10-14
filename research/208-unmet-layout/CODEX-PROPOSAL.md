# Codex proposal: unmet requirements (#207 / #208 / #209)

Design review, 2026-10-13. Only this document is in scope; no production changes.
Read AGENTS.md, REMAINING-WORK.md, TASKVIEW-WORKFLOW.md and the three complete tickets, including the owner's verbatim complaints. TaskView tools are unavailable here; no server claim/status is asserted. The explicit assignment is this isolated design document, not implementation or approval.

## Verdict on Claude's proposal

**Keep progressive disclosure; reject compulsory single-actor classification, universal per-item disclosures, and “things left” as an eligibility promise.**

- **(a) Schema:** retaining `unmet` is correct, but it is existing editorial wording, not necessarily a verbatim quotation from an official source. Call it “Full requirement”, not “Official wording”. `who` cannot always be singular: `ssahDocumentation` combines professional documentation and discretionary funding (public/app.js:305–310); `bcHomeOwnerGrantDisabilityRoute` combines alternative receipt/spending routes and professional certification (770–774). Assigning either solely to “you” or “program” misrepresents the work. `fixed` can be a function (599–602, 837–840), not just `true`; evaluate it before presentation. Do not force action-first language onto age or adjudication.
- **(a), hedges:** a safe full paragraph does not rescue a misleading visible summary. “ODSP must approve your disability” hides the prescribed-class bypass in `odspMedical` (255–260); “Get a professional to approve you” would change who decides. Prefer “Check ODSP's disability decision or prescribed-class route”. For `hvmpIncome` (291–296), “Pay toward modifications above $38,000” would harden “may be required”. A short must be a navigation/task cue, not a replacement eligibility assertion.
- **(b), a11y:** native `<details>` is appropriate, but 3 group headings plus 6 identical “Full wording” summaries create six tab stops and ambiguous screen-reader control names. Nesting a group disclosure around item disclosures compounds navigation/state announcements; do not do it. An expander inside an inline guide panel is not intrinsically inaccessible, but must not disappear with focus inside when that panel closes. Avoid `aria-live`, redundant `role=button`, and manual `aria-expanded` on native summary. Use one clearly named disclosure for the full requirement list on the detail surface, not one per gate.
- **(b), actual expander precedent:** comments still describe #201 expanders (public/app.js:4818–4823; public/styles.css:659–661), but current `aboutMore`, documents and FAQs are ordinary visible sections (4831–4840, 4915–4920). Do not copy a comment instead of the markup. Actual native examples are `.faq` (4760), `.notmatch` (3586–3593) and `.support-section` (3626–3637). `.notmatch` suppresses the marker (styles.css:734–736); our new disclosure should retain its native triangle, focus outline and generous summary padding.
- **(b), FR:** today's gate texts are English in both languages. `evaluate()` passes the string directly, including a special English DTC-unsure override (app.js:1197–1212); it does not translate gate keys. Only `det.almostSub` is translated (public/i18n.js:374, 775). Detail guides show an English-content note (app.js:4792, 4898; i18n.js:401, 802). `t()` falls back to English (i18n.js:844–846). Ticket #208 explicitly says “No new French strings (rule #85)”; the request for EN+FR keys is a design deliverable, **not authorization to ship new FR copy**. Supply proposed FR wording below, hold FR additions for approval, and mark English gate blocks `lang="en"` so speech switches correctly.
- **(b), no JS:** scripts/gen-guide-pages.js evaluates `data.js`, not `REQS`; it reads app source for province flags (14–26, 34–48). Static guides render `eligibility` / `requiresNote` (214), not personalized unmet gates. Claiming this schema automatically fixes static guides would be false. Preserve that accurate unpersonalized fallback; do not execute the entire app in the generator or manufacture unanswered personalization.
- **(c):** three lines are a sensible budget, but 80 characters are not one rendered line at 400% zoom, and three unmigrated paragraphs are still a wall. No clipping or ellipsis. Also, the detail sidebar **already silently drops gates after two** (`r.needs.slice(0, 2)`, app.js:4860). A card link cannot promise completeness until detail uses all needs. “And N more” alone is ambiguous in a screen-reader links list: name the benefit and destination. Use a real guide URL with SPA interception, not a link that exists only when JS handles it.
- **(d):** a length/`who` test catches syntax, not hardening, lost exceptions, hidden content, output parity, or changes to eligibility. Require a verbatim preservation test, oracle equality, branch coverage and independent copy review. An 80-character limit is an authoring ceiling, not permission to remove qualifiers; omit `short` if a safe cue will not fit.

## Alternatives considered

| Layout | Advantages | Costs / rejection reason |
|---|---|---|
| Actor groups + per-item full-wording disclosures | Each explanation is adjacent; good for isolated complex criteria. | Many repetitive controls; multi-actor gates fit badly; long lists demand serial opening. Reject as the default. |
| One nearest task on card; chronological numbered detail list | Lowest scan burden; clear next move. | Needs a verified dependency graph and knowledge of work already done; REQS order does not establish chronology. “Nearest” could imply one task guarantees eligibility. Reject until such evidence exists. |
| Single count + grouped cues; one full-list disclosure on detail | Bounded card; two reading depths; one extra tab stop; all qualifiers remain available together. | More scrolling after opening; reader must match cues to full entries. **Recommend**, with stable gate labels/order and no “steps to approval” claims. |
| Real checkbox task list linked to benefit progress | Tangible sense of progress; attractive for paperwork tasks. | `progress` tracks application stages, not proof of criteria (app.js:3979–3988). A checked medical/adjudication gate would imply certification; new per-gate persistence expands scope. Reject for #208. |

## Recommended final design

### Exact schema and presentation contract

Keep `met`, `fixed`, `unmet` and `action` unchanged. Add optional, display-only fields at the gate's top level:

```js
short: "Check ODSP's disability decision or prescribed-class route",
who: ["you", "professional", "program"]
```

- `short`: a nonempty plain-text string, maximum 80 Unicode code points including spaces; no HTML/newlines. No function in v1. Do not auto-generate it from prose or use an LLM at runtime.
- `who`: a nonempty, duplicate-free array drawn from `you`, `professional`, `program`; canonical order as written above. Required iff `short` exists. Multiple actors mean “Shared checks”, not duplicate gate rows. Do not store `who` alone during migration.
- No second `detail` field, no persistence, no gate checkbox, no inferred dependency order. `unmet` remains string-or-function, including the existing escaped-dollar literals and both `achbOlderDependent` branches (app.js:369–371).
- Extend each evaluated need to `{ key, text, action, short, who }` (current shape loses the key at app.js:1211). Resolve full `text` exactly as today. For DTC-unsure's special override, withhold `short` until that branch has an explicitly reviewed cue; it must not be contradicted by the default DTC cue.
- Do not use actor metadata to change `met`, `fixed`, status, priority or `nextAction`. Classification here is **who participates**, independent of #209's evidence classification.
- For detail, take all `r.needs`, not the slice at 4860. Partition safe cues into `you`, `professional`, `program`, `shared`; preserve `benefit.requires` order within each. Unmigrated needs form “Other checks” and display their full text directly. No empty headings. Fixed failures stay on the “not a match” reason path: never relabel age/residency as tasks.

### Exact HTML: results card

This replaces only the needs area inside `benefitCard`. `{...}` denotes escaped text or a validated catalogue URL; repeated items are shown structurally, not literal template code. `{slug}` uses the generator's `slugify(id)` and extensionless canonical route, without a trailing slash (scripts/gen-guide-pages.js:92, 182–183, 281).

```html
<section class="needs req-preview" aria-labelledby="req-card-{id}">
  <h4 class="needs-h" id="req-card-{id}">Requirements to check</h4>
  <p class="req-count">{total} requirements not yet confirmed</p>
  <ul class="req-list" lang="en">
    <li class="req-cue">{short}</li>
    <!-- Repeat in requires order; at most 3, without actor group headings. -->
  </ul>
  <a class="req-guide-link js-req-guide" href="/guides/{slug}"
     data-id="{id}">See all requirements for {benefitName}{moreSuffix}</a>
</section>
```

`moreSuffix` is empty when all entries are shown, otherwise “ — {n} more”. Always show the link even when there are only 1–3 gates: full explanations live at the destination. For a fully migrated card, `{n} = total - shown`. Do not call these “3 things left” or preserve the “unlock” metaphor; they include unknown facts and decisions, not necessarily unmet conditions.

If **any** need lacks a safe cue, show the count and link only (omit `<ul>` and suffix); do not reintroduce the three longest paragraphs or show an apparently complete migrated subset. This still supports incremental migration. Gate wording remains available in full on the personalized detail view. Link interception opens that view and focuses its requirements heading; copying/opening the real URL yields the generic static guide, not a personalized verdict. Do not put answers into the URL. Do not add a fragment before confirming the router's hash behavior.

### Exact HTML: detail sidebar / inline guide

```html
<section class="side-next req-checks" aria-labelledby="req-detail-{surface}-{id}">
  <h2 id="req-detail-{surface}-{id}" tabindex="-1">Requirements to check</h2>
  <p class="req-count">{total} requirements not yet confirmed</p>
  <p class="req-context">Some checks involve a professional or a program decision.</p>
  <div class="req-group">
    <h3 class="req-group-title">What you can check or prepare</h3>
    <ul class="req-list" lang="en">
      <li class="req-cue" data-req-key="{key}">{short}</li>
    </ul>
  </div>
  <!-- Same structure for professional / program / shared, only if nonempty. -->
  <div class="req-group req-fallback">
    <h3 class="req-group-title">Other checks</h3>
    <ul class="req-list" lang="en">
      <li data-req-key="{key}">{resolved full text for unmigrated need}</li>
    </ul>
  </div>
  <details class="req-full">
    <summary>Read full requirements for {benefitName}</summary>
    <ol class="req-full-list" lang="en">
      <li data-req-key="{key}">
        <p class="req-cue">{short}</p>
        <p class="req-wording">{resolved full text}</p>
        <a class="req-action" href="{action.url}" target="_blank"
           rel="noopener noreferrer" data-ext>{action.text}</a>
      </li>
      <!-- Migrated needs only, in the same grouped order as above. -->
    </ol>
  </details>
</section>
```

Omit the fallback group when empty; omit the disclosure when no safe cues exist. Omit an action link when none exists. Unmigrated rows may have their existing action adjacent, without duplicating full text in the disclosure. With a one-item migrated list whose cue equals full text, render that text once and omit the disclosure. Unique `{surface}` values (`detail`, `inline`) prevent duplicate IDs when a guide is also expanded in results. In inline guide markup use the surrounding heading hierarchy (group headings one level below the section heading), not a new h2 under h3 by rote.

One disclosure is **not** nested in another disclosure; groups are plain divs. The accessible summary name is its visible text; no extra screen-reader-only copy or entire-paragraph `aria-describedby`. Keep a single section-wide English-content notice in FR, and set `lang="en"` on gate/action text rather than the translated headings. The standalone sidebar still has the existing next-action CTA (app.js:4928); avoid repeating that identical link both outside and inside the disclosure if it would create redundant controls.

The full wording must appear intact, in the DOM, without fetching or delayed JS reveal. Existing print paths must render all resolved texts visibly, not the three-card budget; see app.js:4311–4338 and 4369–4402, which currently primarily export application steps/documents. Explicit print markup should be plain lists, not closed disclosures. Do not assume CSS alone opens native `<details>` in every print engine. Keep screen-reader exclusion on print-only duplicates, and verify those duplicates remain visible in print.

### CSS contract

Retain `.needs` and `.side-next` container conventions; introduce only `.req-preview`, `.req-checks`, `.req-count`, `.req-context`, `.req-group`, `.req-group-title`, `.req-list`, `.req-cue`, `.req-fallback`, `.req-full`, `.req-full-list`, `.req-wording`, `.req-action`, `.req-guide-link`.

- Single column; no fixed heights, line clamp, truncation, fixed line count, or tiny text. Cues wrap normally; `overflow-wrap:anywhere` for exceptional long tokens.
- Text at least 0.95rem, line-height 1.55; list items separated by 0.6rem, groups by 1rem. Group labels semibold, not badge grids or success ticks.
- Use `--text`, `--panel`, `--hair`, existing focus tokens; do not rely on `--warn` text contrast without measuring it (current styling: styles.css:671–674). Separate groups with space, not color alone.
- `.req-full > summary`: native marker retained; padding 0.75rem 0; cursor:pointer; visible `:focus-visible` outline. Body padding 0.5rem 0. No opening-height animation or transform; reduced-motion and `.a11y-nomotion` therefore have nothing new to suppress.
- Match existing theme tokens; forced-colors borders/focus use system colors. Base styles precede media overrides. Any new `display` rule gets a matching `[hidden] { display:none }` rule (AGENTS.md).
- No reveal observer on these requirements; essential text must not wait for animation/watchdog recovery. Add print-only full lists rather than styling a closed disclosure as if it were open.

### i18n keys (proposed, not a translation release)

EN keys ship with the implementation. FR values below are design-review candidates only: #208's EN-only constraint needs owner resolution before adding them to `I18N.fr`. Until then use the existing English fallback deliberately with language annotation, not unreviewed French.

| Key | EN | FR candidate |
|---|---|---|
| `req.heading` | Requirements to check | Conditions à vérifier |
| `req.count.one` | 1 requirement not yet confirmed | 1 condition pas encore confirmée |
| `req.count.other` | {n} requirements not yet confirmed | {n} conditions pas encore confirmées |
| `req.context` | Some checks involve a professional or a program decision. | Certaines vérifications nécessitent un professionnel ou une décision du programme. |
| `req.you` | What you can check or prepare | Ce que vous pouvez vérifier ou préparer |
| `req.professional` | What a professional confirms | Ce qu'un professionnel confirme |
| `req.program` | What the program decides | Ce que le programme décide |
| `req.shared` | Shared checks | Vérifications partagées |
| `req.other` | Other checks | Autres vérifications |
| `req.full` | Read full requirements for {name} | Lire toutes les conditions pour {name} |
| `req.guide` | See all requirements for {name} | Voir toutes les conditions pour {name} |
| `req.more.one` | — 1 more | — 1 autre |
| `req.more.other` | — {n} more | — {n} autres |

Select count forms explicitly; the current `t()` is not an ICU plural engine. Escape interpolated names. Catalogue names/requirements stay English as today (i18n.js:1–5). Prefer reusing `det.enNote` to adding another language-warning string. Do not quietly translate all 199 gate strings as part of a layout ticket.

### Rules for authoring `short` safely

1. Read the full gate and its linked official source that day; keep the existing `unmet` bytes untouched in this migration. If existing wording is wrong, separate the source-backed correction from shortening.
2. Write a **check/preparation cue**, not “You qualify”, “You must pay”, “Get approved” or a promise that completing it unlocks money. “Check whether…” is legitimate action-first language for uncertain facts.
3. Preserve any proposition the cue actually states: “may”, “up to”, “generally”, “for most people”, thresholds, dates, exceptions and any/all alternatives cannot silently change. A threshold-free cue may point to “income rules”; it must not assert a simplified threshold that drops family-size or exemption rules.
4. Put the entire qualifier-bearing proposition in the full requirement if omitted from the cue. Never publish a contradictory/harder headline and argue that the explanation fixes it. If uncertainty/alternatives are central, mention the route/check rather than a single mandatory path.
5. Record all participating actors, not just the official decision-maker. No imperative for immutable traits; no diagnosis-to-eligibility shortcut; no general `disabilityVerified` substitute for a specific certification.
6. Independent reviewer checks cue + full text side-by-side, including the “reader only sees the cue” interpretation. If 80 characters cannot be safe, leave this gate unmigrated. No mechanical sentence cutting.

## Migration plan

**Measured with read-only grep pipelines, not Node or app execution.** The source has 199 `unmet:` occurrences and 89 `met: () => false` occurrences. Counts include the dynamic gate declaration once. Ticket #207's 198 is historical; its repeated `action` labels were extraction artifacts, not gate keys. Character counts below count decoded text (quotes removed, escaped-dollar backslashes removed), including spaces/punctuation; no execution needed. Example method: match the unique wording line, extract the quoted string with `grep -o '"[^"]*"'`, then `grep -o '[^"\\]' | grep -c .`. Newlines are not part of these single-line literals.

### Actual 20 longest gates, descending

Line refers to the full wording literal in public/app.js, not the `action` subobject.

| Rank | Gate key | Wording line | Characters |
|---|---|---:|---:|
| 1 | `cwbEligibility` | 473 | 626 |
| 2 | `odspMedical` | 259 | 570 |
| 3 | `bcPwdDesignationFinancial` | 707 | 429 |
| 4 | `dresEmploymentRoute` | 530 | 418 |
| 5 | `bcHomeOwnerGrantDisabilityRoute` | 773 | 412 |
| 6 | `achbCoverageCoordination` | 383 | 400 |
| 7 | `csgNeedAndProgram` | 479 | 386 |
| 8 | `cdbStatus` | 437 | 369 |
| 9 | `rampMobilityRoute` | 607 | 347 |
| 10 | `bcWorkBcRoute` | 791 | 341 |
| 11 | `odspFinancial` | 342 | 336 |
| 12 | `archIncomeOrAssistance` | 814 | 328 |
| 13 | `csgServicesEquipment` | 485 | 320 |
| 14 | `adultHealthGateway` | 625 | 314 |
| 15 | `waterlooHomemakingNeed` | 931 | 308 |
| 16 | `abServiceDogQualified` | 541 | 295 |
| 17 | `ccbEligibility` | 449 | 289 |
| 18 | `mhrtcSecondaryUnit` | 748 | 288 |
| 19 | `p2pIncomeTest` | 1008 | 279 |
| 20 | `londonRenovatesEligibility` | 1001 | 275 |

Cutoff checks: `bcCydbIntake` 273, `passportDso` 271, `bcFuelTaxRoute` 270, `cppDisabilityContributorLink` 268, `bcDisabilityAssistanceFinancial` and `rdspGrantWindow` 265 each. Dynamic `achbOlderDependent` branches are shorter than this cutoff.

### Batches ordered by user impact

1. **Presentation skeleton + representative cues:** ODSP (`odspMedical`, `odspFinancial`), RDSP (`dtc`, `rdspOpening`, both window gates), federal student grants (`csgNeedAndProgram`, `csgServicesEquipment`, `disabilityDoc`). These are the owner's actual screenshot journeys. Fix the detail two-gate truncation before card links. Window gates get neutral check cues pending #209 semantics review, not eligibility deletion in a layout PR.
2. **Shared federal/high-cost summaries:** `cwbEligibility`, `cdbStatus`, `cdbTaxFiling`, `cdbAmountCalculation`, `ccbEligibility`, `prolonged`, `certifier`, `cdcpRequirements`. Broad reuse and the longest paragraph outweigh province-first scheduling.
3. **AB/BC long and multi-route gates:** the rest of the top-20 AB/BC entries above, then AISH/ADAP, AADL, PWD financial/medical, RAMP income, fuel-tax routes and RAHA. Review shared-actor decisions; no forced split of one gate into several matcher gates.
4. **Municipal / remaining long text:** Waterloo and London top-20 entries, `p2pIncomeTest`, Ottawa fare proofs, ARCH/Coquitlam income routes, and all remaining >120-character gates. Length is a prioritization signal, not eligibility importance.
5. **Short remainder and conditional text:** migrate only where a cue adds clarity. Leave `fixed:true` traits as reasons; test function-valued `fixed` and `unmet` branches. Do not add a disclosure to repeat an identical 40-character sentence.

### Tests / review guards for implementation

- Schema test: every cue is plain, nonempty and <=80 code points; every cue has a valid canonical actor array; no orphan actor metadata. Validate every author-provided variant if variant support is added later.
- Verbatim preservation test: baseline every static `unmet` value and both dynamic branch outputs, plus DTC-unsure; comparing only counts will miss hardening. Presentation tests assert resolved full text is present in detail DOM and visible in exports.
- Matcher/oracle equality before/after #208/#207: identical `met`, `fixed`, `requires`, `PROGRAM_BEST_CASE` and outcome matrix. Do not “update” oracle outcomes for a display-only change. #209 changes require separate evidence review, SPEC_VERSION/baseline updates and before/after ready/almost counts.
- DOM tests: 3-cue budget, correct total/more counts, count-only mixed fallback, no missing third/fourth detail gate, no empty groups, one disclosure maximum, no nested disclosures, unique IDs across inline/standalone, escaped text, usable real guide links, no private answers in URLs.
- Screenshot/interaction coverage: ODSP detail, RDSP and student-grant cards, synthetic 4+ needs; self/child/family, fresh dark/light/high-contrast reloads, forced colors, 200–400% reflow, keyboard, VoiceOver/Safari and NVDA/Firefox. Verify summary open/close and focus when inline panels close. Axe does not substitute for AT/readability testing.
- Print/action-plan tests assert **all** full requirements even when closed or absent on cards; source labels and next steps remain. Static guides with JS disabled retain visible generic eligibility/source content; no personalized claims or blank page. Regenerate guides and bump shared browser asset version for eventual app changes per REMAINING-WORK.md:65–67.
- Run the full Playwright suite alone and record collected vs passed, not just a green tail. These are proposed guards, **not tests run in this session**.

## #209 triage

This table covers all 89 current always-false declarations in public/app.js:226–1005. Line numbers are the `met` line. **EXTERNAL** means retain an honest unresolved decision/clinical assessment; **ANSWERABLE** means a fact could be established by explicit scoped answers or a sound derivation, not that current answers already establish it; **MISFILED** means the gate mixes eligibility with amount/timing context and needs a separate semantic review before removal. These judgments are source-reading triage, not newly verified benefit rules.

A recorded approval/registration can be answerable without pretending to adjudicate a pending application. Composite gates remain false until **every** component is established. Do not replace whole composites with one “yes” proxy. “Derived” is a subtype of ANSWERABLE, not a fourth bucket; current broad income/age/status bands generally cannot establish these exact tests. No blanket free conversion was found: even `bcAssistance=pwd` mixes designation and receipt, and 19–59 straddles RDSP's age-49 deadline.

| Gate key (met line) | Bucket | One-line reason |
|---|---|---|
| `prolonged` (226) | EXTERNAL | CRA comparative/duration routes require practitioner evidence, not a lay disability answer. |
| `certifier` (235) | EXTERNAL | Program-specific authorized certification is not generic documentation; keep unresolved. |
| `odspMedical` (256) | EXTERNAL | ODSP adjudicates; prescribed-class bypass needs its own reviewed route. |
| `passportDso` (268) | EXTERNAL | DSO eligibility confirmation and professional determination are external. |
| `tdpDeductible` (275) | ANSWERABLE | Exact after-tax drug-cost ratio, ODB status and coverage can be asked, not inferred from low income. |
| `hvmpIncome` (292) | EXTERNAL | Unpublished established threshold and possible contribution require program confirmation. |
| `hvmpCoordinator` (299) | EXTERNAL | Funding exhaustion plus coordinator approval cannot be inferred from work/need answers. |
| `ssahDocumentation` (306) | EXTERNAL | Professional limitations evidence and discretionary funding remain outside self-report eligibility. |
| `acsdSeverity` (313) | EXTERNAL | ACSD assesses severity/costs and determines amount. |
| `acsdIncome` (320) | ANSWERABLE | Exact total household income is answerable; family size/costs still affect amount. |
| `adpClinical` (327) | EXTERNAL | Device-category authorizer assessment and duration criterion are clinical. |
| `odspFinancial` (339) | EXTERNAL | Exemptions and case-specific financial-need assessment belong to ODSP. |
| `achbFamilyResidencyStatus` (375) | ANSWERABLE | Every included family member's residency/status is factual, not just applicant province. |
| `achbCoverageCoordination` (381) | ANSWERABLE | Existing public coverage and payer coordination can be confirmed explicitly. |
| `lowIncomeOrDisabilityIncome` (391) | ANSWERABLE | Exact municipality thresholds or actual accepted benefit receipt can be established by route. |
| `municipalProgramEligibility` (396) | ANSWERABLE | Program-specific household thresholds/benefit receipt are facts; generic income bands are insufficient. |
| `cppContrib` (418) | ANSWERABLE | Statement-based contribution history can be reported; current employment proves nothing. |
| `cppDisabilityContributorLink` (423) | ANSWERABLE | Parent/guardian receipt, exact age and recognized attendance are factual, not child's disability. |
| `cdbTaxFiling` (429) | ANSWERABLE | Tax residency and filing by applicant and partner can be confirmed for the relevant year. |
| `cdbStatus` (435) | ANSWERABLE | Status, residence duration and incarceration exceptions need explicit facts, not citizen/PR alone. |
| `cdbAmountCalculation` (441) | MISFILED | Payment calculation/possible zero is amount context, not an application eligibility prerequisite. |
| `ccbEligibility` (447) | ANSWERABLE | Living/care/tax facts or confirmed CCB eligibility can be asked; household role is not implied. |
| `rdspOpening` (453) | ANSWERABLE | Valid SIN and current Canadian residence are confirmable; never collect the SIN itself. |
| `rdspContributionWindow` (459) | MISFILED | Mixes age window already partly gated by under60 with contribution-limit context. |
| `rdspGrantWindow` (465) | MISFILED | Grant/bond age-49 deadline should not block opening a valid age-50–59 plan. |
| `cwbEligibility` (471) | ANSWERABLE | Exact annual tax/age/student/dependant/income facts can establish routes; current wizard cannot. |
| `csgNeedAndProgram` (477) | EXTERNAL | Assessed need and recognized disability/program status require student-aid confirmation. |
| `csgServicesEquipment` (483) | EXTERNAL | Qualified-person confirmation of services/equipment need is not general documentation. |
| `abGrantStudyAidEligibility` (491) | EXTERNAL | Alberta funding eligibility and calculated need remain assessed results. |
| `abGrantCurrentCostRequest` (499) | EXTERNAL | Current Schedule 4 approval, approved costs and federal allocation are program determinations. |
| `dresResidencyAndStatus` (512) | ANSWERABLE | Actual AB residence, work/training authorization and accepted status are factual. |
| `dresDisabilityBarrier` (520) | EXTERNAL | DRES-specific documented permanence/barrier test is not a general disability answer. |
| `dresEmploymentRoute` (528) | EXTERNAL | Eligible funded accommodation and institutional exclusions require route review, not employment alone. |
| `pddEligibility` (534) | EXTERNAL | Assessed intellectual/adaptive-function criteria are program/professional decisions. |
| `abServiceDogQualified` (539) | ANSWERABLE | Already-qualified dog/provider route can be reported; not a question about a prospective dog. |
| `abCapccContinuingCareHome` (544) | ANSWERABLE | Home type and ability to express goals/preferences can be confirmed with accessible help. |
| `abSpecialNeedsHousingPlacement` (549) | EXTERNAL | Local provider eligibility/placement and waiting list are external determinations. |
| `fscdEligibility` (554) | ANSWERABLE | Guardianship, child's status and existing documentation/assessment are factual, not funding approval. |
| `aishMedical` (559) | EXTERNAL | AISH reviews medical report, severity and potential employment improvement. |
| `aishFinancial` (565) | EXTERNAL | Exemptions, partner income and other-income pursuit require AISH review. |
| `adapMedical` (571) | EXTERNAL | Alberta determines significant continuous/episodic employment impairment. |
| `adapFinancial` (577) | EXTERNAL | Monthly income, exemptions and other-income obligations require program review. |
| `ahcipRegistered` (583) | ANSWERABLE | Existing AHCIP enrollment/valid card is a simple known fact; ask no card number. |
| `aadlAssessment` (589) | EXTERNAL | Authorized assessment, eligible item/vendor and duration must be confirmed specifically. |
| `aadlOtherPayer` (595) | ANSWERABLE | Coverage for this particular item can be reported, not inferred from holding any insurance. |
| `rampMobilityRoute` (605) | ANSWERABLE | Exact wheelchair/walker/age/listed-condition route can be established without inventing a diagnosis guarantee. |
| `rampIncomeAndResidency` (611) | ANSWERABLE | Family size, applicable adjustments, exact income and 90-day residency are factual. |
| `adultHealthIncome` (617) | ANSWERABLE | Exact household income and family size can be compared with the verified table. |
| `adultHealthGateway` (623) | ANSWERABLE | Pregnancy/drug-needs/transition route and excluded current coverage are explicit facts. |
| `planGClinicalAndFinancialNeed` (655) | EXTERNAL | Prescriber/team clinical confirmation remains necessary even if income is known. |
| `planPRegistration` (660) | EXTERNAL | Physician/NP registers the patient; don't imply the applicant submits this form. |
| `bcSupplementaryBenefitsEligibility` (671) | ANSWERABLE | Exact adjusted income or existing MSP enrollment category can establish an accepted route. |
| `firstNationsStatus` (677) | ANSWERABLE | Status/residence is known to the person; optional, scoped, and never collect identifying numbers. |
| `bcPwdMedical` (699) | EXTERNAL | Ministry decision plus medical and assessor reports cannot be replaced by lay answers. |
| `bcPwdDesignationFinancial` (705) | EXTERNAL | Financial screen and prescribed-class designation routes need ministry confirmation. |
| `bcDisabilityAssistanceFinancial` (711) | EXTERNAL | Ministry family-unit income/exempt-asset test is not a broad-income derivation. |
| `bcCydbIntake` (717) | MISFILED | Intake date/transition routing describes application availability, not personal eligibility. |
| `bcFuelTaxRoute` (723) | ANSWERABLE | Existing accepted certification/letter route can be confirmed; generic disability does not suffice. |
| `bcFuelTaxRegistered` (729) | ANSWERABLE | Approved existing refund-program registration is a factual status. |
| `bcDefermentProperty` (735) | ANSWERABLE | Ownership, residence duration, equity and paid prior charges can be confirmed explicitly. |
| `qualifyingRenovationSpend` (741) | ANSWERABLE | Completed/paid qualifying work and receipts are factual, distinct from planning a renovation. |
| `mhrtcSecondaryUnit` (746) | ANSWERABLE | Actual unit features, occupant/relative route and prior claim history are answerable. |
| `excisePermanentMobilityCertified` (751) | EXTERNAL | Permanent impairment and inability to use transit require medical certification. |
| `cdcpRequirements` (756) | ANSWERABLE | Dental coverage access, both tax filings, exact family net income and residence are confirmable. |
| `disabilityMedicalExpensesPaid` (761) | ANSWERABLE | Actual qualifying expenses paid and receipts can be reported. |
| `caregiverSupportClaim` (766) | ANSWERABLE | Claimant role, relationship and support facts can be confirmed; not implied by family mode. |
| `bcHomeOwnerGrantDisabilityRoute` (771) | EXTERNAL | Receipt route may become answerable, but alternate spending route includes Form B certification. |
| `rahaEligibility` (777) | EXTERNAL | BC Housing limits/approval and timing are program-specific; do not infer from home-access need. |
| `bcHealthyKidsIncome` (783) | ANSWERABLE | Confirm supplementary-benefits enrollment and exact family income, not just MSP. |
| `bcWorkBcRoute` (789) | ANSWERABLE | Exact unemployment/underemployment, job-risk, hours or final-year student route can be asked. |
| `coquitlamStatus` (795) | ANSWERABLE | Settled residency/status and explicit excluded categories can be confirmed. |
| `coquitlamIncome` (801) | ANSWERABLE | Exact household size/income can establish the listed threshold; current income band cannot. |
| `archIncomeOrAssistance` (812) | ANSWERABLE | Actual Income Assistance receipt or verified guideline-based income/pension route is confirmable. |
| `translinkHandyCard` (869) | ANSWERABLE | Existing HandyDART/HandyCard registration is known to the applicant. |
| `bcTransitHandyDart` (870) | ANSWERABLE | Permanent handyDART registration plus handyPASS is a known status, not transit limitation alone. |
| `atHomeProgram` (871) | ANSWERABLE | Existing child's enrollment can be confirmed without adjudicating a new application. |
| `waterlooRenovatesEligibility` (921) | EXTERNAL | Region must validate multiple property/financial criteria; retain as requested in #209. |
| `waterlooHomemakingNeed` (928) | EXTERNAL | Program confirms functional and financial need after waitlist review. |
| `waterlooWasteSupportApproval` (935) | EXTERNAL | Region approval and availability-of-help assessment remain necessary. |
| `yorkHomemakersNeed` (942) | EXTERNAL | Program's unpublished financial thresholds and need review require direct contact. |
| `ottawaOdspReceipt` (954) | ANSWERABLE | Actual ODSP receipt and possession of required IDs are facts; Ottawa derives from city. |
| `paraTranspoRegistered` (961) | ANSWERABLE | Existing registration and ability to supply its number are known; do not store the number. |
| `atpApproval` (967) | ANSWERABLE | Already-approved ATP status can be reported, without assessing a pending income application. |
| `mobilityplusRegistered` (972) | ANSWERABLE | Existing MobilityPLUS enrollment is a simple fact. |
| `cnibCustomer` (977) | ANSWERABLE | Existing CNIB customer status is factual; blindness alone is insufficient. |
| `supportPersonApproval` (982) | EXTERNAL | Name/copy disagree on application vs approval; verify required status before designing a question. |
| `aCardProof` (987) | ANSWERABLE | Possession of either accepted photo ID is answerable; do not collect images/numbers. |
| `londonRenovatesEligibility` (998) | EXTERNAL | London checks income/assets/property/residence; do not replace review with “low income”. |
| `p2pIncomeTest` (1005) | EXTERNAL | Unpublished local MBM thresholds require municipal confirmation. |

**Question priority, not a wizard expansion shopping list:** start with contextual benefit-receipt statuses (ODSP, verified assistance receipt distinct from designation), then existing transit registration/proof clusters. Ask these only in relevant province/city/benefit paths; show “not sure” and preserve `almost`. Favor one reused question over separate one-program questions. A single-record registration can be an optional detail-page confirmation rather than a new wizard step, subject to persistence-model review. Next consider reusable filing, household-size and exact-threshold confirmation questions; exact finances have greater privacy/cognitive costs, so do not collect tax documents, SINs or ID numbers.

No predicted numerical shift off 40/60: per-program `requires` intersections, existing approval vs prospective application, and source re-verification determine that. Each ANSWERABLE conversion needs explicit oracle fragments, negative/unknown cases and deliberate best-case changes (e2e/oracle/oracle-spec.js:1–47, DIMENSIONS:64–70). EXTERNAL can include a future already-approved route, but is not permission to turn pending adjudication into readiness.

## Open questions for Claude

1. Agree to actor arrays/shared group and a **single** full-list disclosure, or provide evidence that per-item disclosures improve fatigued-reader comprehension enough to justify their control count?
2. Can we replace “unlock”/“Before you can apply” with neutral “Requirements to check” without a broader copy review? Both currently imply that program decisions must happen before an application.
3. How should the new label coexist with “One step away” (app.js:4857), which remains false for multi-gate programs? Keep this separate but do not call the inconsistency fixed.
4. Resolve the ticket EN-only rule vs requested FR design keys before implementation. These FR candidates are not reviewed translations or authorization to add them.
5. Does static guide policy need a future shared display-only requirements catalogue, or is current generic `eligibility`/`requiresNote` the intended no-JS contract? Do not copy REQS prose into data.js by hand.
6. Confirm MISFILED handling of RDSP windows, CDB amount calculation and CYDB intake with official sources and oracle review; none should be deleted merely to improve the ready/almost ratio.
7. For `supportPersonApproval`, is the actual prerequisite application, approval, or possession of a pass? Resolve the code-name/copy mismatch before asking users.
8. Which actual disabled readers and AT combinations will review the ODSP/RDSP/student-grant prototypes, and what demonstrates a scannable first pass without losing exceptions?

### Session evidence / handoff

Read-only source inspection and grep character/occurrence measurement completed; no code, build, generator or tests executed. Re-read the complete document; grep confirms 316 lines, six required sections and 89 triage rows. Repository status shows only the new research directory plus the pre-existing untracked `node_modules`; no tracked file was changed. Corrected the proposed link to match the generator's extensionless canonical route on reinspection. **Implementation, browser/accessibility testing, numerical oracle remeasurement and final verification are left to the orchestrator.** No claim of deployment, TaskView synchronization or official-source re-verification is made.
