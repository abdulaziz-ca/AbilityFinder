# AbilityFinder comprehensive audit

**Audit date:** 2026-07-22 (America/Edmonton)
**Repository:** `/Users/abdulaziz/Claude Random Apps/benefit-finder`
**Production:** [abilityfinder.ca](https://abilityfinder.ca)
**Commit reviewed:** `6171404` on `main`
**Disposition:** **NO-GO for the next release until the P1 release blockers are corrected and retested.**

## Executive summary

AbilityFinder has a thoughtful privacy-oriented architecture, strong defensive persistence work, a useful plain-language guide model, and a substantial automated browser suite. The completed evaluator sample produced deterministic results without exceptions, generated artifacts reproduce exactly, model output is rendered as text, and the application has a deliberate last-resort rendering boundary.

It is not yet safe enough for its intended high-stakes purpose as represented to users. The most serious root problem is systemic: unasked, unknown or merely proxied official conditions are often treated as met, so “ready” can look like an eligibility determination that the questionnaire did not establish. Confirmed examples include universal DTC readiness, inferred CPP contribution history, incomplete CDB/CCB/RDSP/student-grant/AISH/ADAP/AADL/PDD/FSCD/Adult Health tests, city-only municipal matches, and overbroad BC vehicle/transition/property rules. Separate content defects misstate DTC value, BC Bus Pass fees, Autism Funding transition use, CDB values, contacts, timing and application procedures. The assistant's supposedly redacted grounding contains prohibited numeric facts. Production serves the full app over HTTP without HSTS. Critical wizard choices do not expose their selected state and rerendering discards focus.

There are **no Critical/P0 findings** in the evidence collected. The findings table contains **23 High/P1 release-blocker groups** plus a substantial Medium/P1 set; grouped rows consolidate symptoms sharing one matcher/content root cause. Severity was not raised merely because the service is high stakes.

All 84 benefit records and every directory dataset were accounted for against current official sources. Exact scalar claim ledgers cover the 45 federal/Alberta/initial records and associated datasets; the BC ledger accounts for 1,458 main-record assertions in 48 grouped rows plus 353 directory/support assertions. This is comprehensive record coverage, but not a blanket accuracy assurance: hundreds of rows remain outdated, unsupported, ambiguous or manual, and the BC ledger's grouped granularity is a disclosed limitation.

## Post-audit remediation update — 2026-07-22

The owner authorized the first recommended correction group after the audit. This update records work performed after the audited `6171404` snapshot; it does not rewrite the original evidence or imply that all related findings are closed.

### Implemented safety changes

- **DATA-25:** DTC can no longer be marked `ready` merely because a profile is complete. The CRA functional-impact criteria and authorized-practitioner certification remain unresolved until the product collects official-rule evidence.
- **DATA-38:** current employment or inability to work no longer stands in for CPP contribution history. The result directs users to confirm their CPP Statement of Contributions.
- **DATA-04 and DATA-28:** DTC status, inability to work, or city residence no longer establishes a municipal income/benefit-recipient route. Affected results remain conditional until the program-specific route is confirmed.
- **ABFED-01:** the shared disability-document requirement no longer sends Alberta applicants to StudentAid BC.
- **ABFED-02/03/04:** Adult Health Benefit, FSCD, and PDD now retain their unasked defining eligibility gates as unresolved. PDD no longer excludes people solely because they are 65 or older.
- **ABFED-06:** Alberta parking-placard matching now uses the official 50-metre or qualifying-vision route and still requires authorized certification.
- Browser asset references were advanced from `v=43` through `v=46`, including matching self-hosted font URLs.

These are conservative harm-reduction changes. Most matcher findings are **mitigated, not closed**: the safer matcher now avoids unsupported `ready` verdicts, but the next iteration should add concrete, program-specific questions and revalidate every answer-to-rule mapping. The audit's **NO-GO recommendation remains in effect** because accessibility, security, privacy, assistant-grounding, intake-state and other matcher/data blockers remain.

### Verification performed after the changes

| Check | Observed result |
|---|---|
| `npm run gen:context` | PASS; 84 context entries, 151 monitored links, 5 dynamic links skipped |
| `npm run gen:guides` | PASS; 83 benefit pages plus guide index and sitemap generated |
| `npm test` | PASS; 29/29 |
| `npx playwright test e2e/matcher-safety.spec.js e2e/data-integrity.spec.js` | PASS; 11/11 matcher, DTC and corrected-data regressions |
| `npm run test:e2e` | Final clean run PASS; 32/32 in Chromium, including four new data-integrity tests. |
| `npx wrangler deploy --dry-run` | PASS; 110 assets, 199.70 KiB / 51.76 KiB gzip, expected KV/email/AI/rate-limit/assets bindings. Wrangler could not write its optional home log in the sandbox, but packaging completed and exited successfully. |
| Static invariants | PASS for duplicate IDs, unknown requirements, benefit metadata, and city coverage |
| Reduced matcher enumeration | 250,000 deterministic models; 186,927 distinct status vectors; no evaluator exceptions |
| `git diff --check` | PASS |

### Second remediation batch: DTC information integrity

The next recommended group corrected DATA-01 and DATA-02 across source, generated guides, assistant grounding, practitioner guidance, result estimates, print paths and the homepage preview.

- **DATA-01 — completed locally:** the DTC disability amount is no longer represented as cash received, an annual tax saving, or a guaranteed back-payment. DTC is excluded from estimated totals; the obsolete retroactive-value estimator and persisted `retroYears` field were removed. User-facing copy now states that the credit is non-refundable and that the actual reduction depends on tax payable and other circumstances.
- **DATA-02 — completed locally:** the practitioner finder now encodes the current CRA certification matrix. A medical doctor or nurse practitioner is shown as able to certify all impairment categories; each other profession is limited to the function CRA currently authorizes. Proposed 2026 signer expansions and podiatrists were deliberately not treated as current rules.
- **UX-02 — mitigated, not closed:** the landing preview no longer advertises a hardcoded `$14,600/year` total or a `$10,138/year` DTC value. Broader completeness and eligibility-verdict wording still requires a separate content pass and comprehension testing.
- **UX-03 — mitigated, not closed:** the fixed DTC `+12` ranking boost and “master key” styling/copy were removed. The remaining editorial priority formula is still not explained or validated and therefore remains open.
- **TEST-01 — improved, not closed:** three DTC-specific browser regressions were added; the existing privacy test was made independent of editorial result ordering. A full program-by-program eligibility oracle is still required.

Official re-verification used the current [CRA DTC explanation](https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit/about-dtc.html), [CRA application and practitioner matrix](https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit/how-apply-dtc.html), and [CRA claiming guidance](https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit/claiming-dtc.html), accessed 2026-07-22. Finance Canada's 2026 expansion material was reviewed as a proposal and was not implemented as current eligibility or signer policy.

No commit, push, or deployment was performed.

### Third remediation batch: time-sensitive benefit integrity

The next immediate data group corrected DATA-03, DATA-05, DATA-06 and DATA-14 across the catalog, generated guides, assistant detail grounding, monitored source links and visible changelog.

- **DATA-03 — completed locally:** CDB now shows the official July 2026–June 2027 maximum of `$204.20/month`. The structured value is `$2,450.40/year`; result formatting preserves cents. The separate fixed `$150` supplement beginning September 2026 is described as conditional and excluded from the recurring annual total.
- **DATA-05 — completed locally:** BC Bus Pass copy now separates the two streams. Eligible PWD disability-assistance recipients pay no annual fee and choose the pass instead of the `$52/month` cash transportation supplement; the `$45/year` fee is attached only to the eligible low-income-senior stream.
- **DATA-06 — completed locally:** both Autism Funding records retain the normal 20% training/travel/equipment rule while documenting BC's 50% exception for the final aligned funding period ending March 31, 2027. The March 31 service date, May 31 direct-payment-document date and September 30 invoice/reimbursement date are explicit.
- **DATA-14 — completed locally:** CDB, AISH and ADAP surfaces now state Alberta's required CDB/DTC outcome update, including an approved CDB amount or denial, and date the published `$200` no-decision reduction scenario. The current federal `$204.20` maximum is not conflated with Alberta's separately worded `$200` administrative scenario.
- **Regression coverage:** `e2e/data-integrity.spec.js` asserts the source records and six affected static guides. The full 32-test Chromium suite passed, as did 29 unit tests, static invariants, the 250,000-model enumeration and Worker dry-run.

Official re-verification used the [federal CDB amount page](https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit/amount.html), [Alberta's federal-support action page](https://www.alberta.ca/aish-apply-for-federal-disability-supports), [BC Bus Pass policy](https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/general-supplements-and-programs/bc-bus-pass-program), and [BC's current support-needs transition page](https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs), accessed 2026-07-22.

No commit, push, or deployment was performed.

## 1. Scope and authorization boundary

This was an authorized defensive assessment of the repository, the local Worker, a local static-server build, and production. It combined architecture, QA, security, Canadian digital-service, benefit-integrity, WCAG, privacy, cognitive-accessibility, Cloudflare reliability, plain-language, and adversarial-user perspectives into one risk model.

Production activity was limited to normal page navigation, header and route checks, a few synthetic assistant questions, malformed/empty API validation requests, and the public link-health endpoint. No real personal data, destructive payloads, high-volume traffic, government form submission, email delivery test, credential test, denial of service, or third-party system abuse was performed.

No source code or benefit data was changed. Nothing was committed, pushed, or deployed. The only repository additions are this report and a standalone audit-evidence directory containing claim ledgers and raw audit traces.

Legal note: WCAG 2.2 AA, OWASP ASVS/Top 10, and government digital-service practices are used as technical or service-design benchmarks. This report does not assert legal compliance or non-compliance. Privacy-law conclusions, statutory entitlement language, and appeal-right representations require qualified legal review.

## 2. Environment and tools

| Area | Actually used | Limitation |
|---|---|---|
| Repository | macOS/zsh workspace, Node project at commit `6171404` | Audit did not inspect Cloudflare dashboard state |
| Automated browser | Playwright 1.61.1; Chromium 149 executed by the existing suite. Firefox 151 and WebKit 26.5 binaries were installed but **not run**. | The repository config is Chromium-only; no audit result implies Firefox/WebKit support |
| Interactive production | Codex in-app browser, desktop viewport | Browser version and edge location unavailable; no accessibility-tree export retained |
| Local production-like server | Wrangler 4.112.0 at `127.0.0.1:8799` | Real email was not sent; AI quota/failure was not forced |
| Network validation | `curl` against the Cloudflare SEA edge; safe GET/HEAD/OPTIONS/invalid POSTs | No high-volume or regional edge sweep |
| Accessibility | Source semantics review, keyboard-oriented code paths, existing browser journeys | No VoiceOver, NVDA, TalkBack, switch control, forced-colours session, or real disabled-user study |
| Performance | Lighthouse 13.4.1 lab runs against production, mobile and desktop, with raw JSON retained | Lab data is not field Core Web Vitals and does not measure real-user INP |
| Benefit sources | Current official federal, Alberta, BC, municipal, and official program-owner pages, accessed 2026-07-22 | Unsupported/ambiguous/manual rows remain unresolved; a ledger status is not a legal eligibility opinion |

## 3. System mapped and reviewed

- **17 client views:** `landing`, `wizard`, `results`, `browse`, `detail`, `privacy`, `about`, `support`, `updates`, `help`, `accessibility`, `professionals`, `partner-overview`, `impact`, `dtc-prep`, `grants`, and `organizations`.
- **Static surfaces:** the app shell, embed, 83 generated benefit guides plus guide index, 404 page, robots and sitemap. `local-supports` is the one dynamic benefit without a static guide.
- **Questionnaire:** 17 declared steps; 10–17 are visible depending on persona and earlier answers. Personas are self, child, and family. It includes 12 limitation categories, 8 age bands, 51 Alberta places, 45 BC places, generic fallback, functional limits, situations, employment, income, tax, residence, documents and DTC state.
- **Eligibility engine:** 97 requirement predicates; 86 are used by 84 benefits. Ready/almost/not-match status, one-step-away logic, estimates, priority ordering, scenarios, and local fallbacks were reviewed.
- **Content:** 84 benefits, 36 structured value records, 84 metadata records, 12 extra-guidance blocks, 19 supports, 12 help organizations, 18 grants, 22 organizations, practitioner forms, guides, reminders and printable views.
- **Persistence:** IndexedDB manager, allowlisted state manager, optimistic revisions, tombstones, storage events, migration from `abilityfinder.*` localStorage, route restoration and sanitization.
- **Worker:** `/api/ask`, `/api/feedback`, `/api/link-health`, static fallback, Workers AI, Email Service, rate-limit binding, KV, cron, error and streaming paths.
- **Reliability/security:** CSP and headers, generated context/link scripts, link batches, calendar folding/Unicode paths, read-aloud, motion/theme controls, print CSS, asset versioning, and existing failure tests.

Source is authoritative. The important documentation drift is recorded in section 15.

## 4. Commands and automated checks

| Command/check | Result observed |
|---|---|
| `npm test` | **PASS: 29/29**, 0 skipped, about 56 ms |
| `npm run test:e2e` | Initial sandbox run could not bind a port; approved rerun **PASS: 21/21 Chromium tests**, 2 workers, 2.1 minutes |
| `npx wrangler deploy --dry-run` | **PASS**, 110 public files, upload 197.66 KiB / 51.49 KiB gzip; bindings for KV, email, AI, rate limit, assets present. A non-fatal EPERM prevented writing Wrangler's home log. |
| `npm audit --json` | **Completed online; exit 1.** Three high-severity dependency nodes (`sharp`, `miniflare`, `wrangler`) trace to one `sharp <0.35.0` libvips advisory. The vulnerable path is development tooling; no AbilityFinder path accepts untrusted images. Do not blindly apply npm's suggested Wrangler downgrade. |
| `npm audit --omit=dev --json` | **PASS: 0 production-dependency vulnerabilities.** |
| Generated-artifact reproducibility | In a temporary copy, both generators reproduced `src/benefits-context.js`, `src/links.js`, 83 guides, guide index and sitemap byte-for-byte. 84 context benefits, 151 links, 5 dynamic URLs skipped. |
| Local Worker smoke | `/api/link-health` 200 JSON; GET `/api/ask` 405 JSON; invalid ask/feedback POSTs 400; unknown API 404. |
| Production transport | HTTP root 200 full HTML; HTTPS root 200 without HSTS; API HEAD/GET at SEA reached Worker; headers otherwise included CSP, DENY framing, nosniff, referrer and permissions policies. |
| Production assistant | Four synthetic prompts were restrained in this narrow observation, including refusal to provide an AISH amount/verdict. This is not a safety guarantee. |
| Production link health | 151 total; 80 had a recorded result, 79 OK, 1 timeout, 71 pending, 5 dynamic links skipped, and `lastFullSweepAt:null`. Three redirects were recorded. This is a partial sweep, not a clean-link attestation. |
| Lighthouse production mobile | Performance 79, accessibility 100, best practices 92, SEO 100; FCP 3.1 s, LCP 4.0 s, TBT 0 ms, CLS 0.081, Speed Index 3.5 s. |
| Lighthouse production desktop | Performance 93, accessibility 100, best practices 92, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.052, Speed Index 1.2 s. Automated accessibility 100 is not proof of accessibility. |

## 5. Coverage ledger

### Routes and features

All 17 views were represented in the existing reload matrix for each persona: **51 persona/view reload cases**. The suite also exercised an Alberta complete journey, multiple Alberta/BC branches, persistence restore, legacy migration, stale-tab protection and unavailable IndexedDB. Direct static guide and production header/API checks were separate.

Not covered by executable browser evidence: Firefox, WebKit, 320 CSS px, landscape mobile, 200–400% zoom, forced colours, real print preview, calendar import in external calendar software, read-aloud with AT, offline transitions, BFCache, storage quota exhaustion, delayed/blocked IDB upgrade, stream cancellation, and actual email delivery.

### Questionnaire state space

The state model was derived from implementation, not documentation.

| Measure | Result |
|---|---:|
| Exact completed semantic reachable states | **3,268,249,940,272,320** |
| States actually evaluated | **250,000 unique reduced-equivalence completed states** |
| Distinct 84-benefit status vectors observed | **186,927** |
| Ready statuses across sample | 2,027,983 |
| One-step-away statuses across sample | 1,887,499 |
| Not-a-match statuses across sample | 17,084,518 |
| Evaluator exceptions | **0** |
| States with one ready match | 9 |
| States with multiple ready matches | 249,991 |
| States with zero ready matches | 0 |

The sample covered all personas, age bands, province values, 96 listed cities plus generic fallback, all document/DTC/income values, 64 predicate-relevant disability combinations, 392 functional projections, 94 situation projections and 10 circumstance projections. Results were deterministic in the sampling run.

This is **not exhaustive Cartesian coverage**. The exact space is computationally impractical. The reduction used actual conditional rules and predicate-equivalence projections. The zero-result path remains structurally unreachable because DTC retains unresolved functional-impact and certifier requirements and therefore remains one step away in every sampled completed profile; the authored zero-result UI has no completed-state witness.

Malformed, partial and conflict coverage exists but is incomplete: current tests cover valid restore, legacy migration, stale-tab write and unavailable IDB. They do not cover every corrupt record shape, quota error, delayed transaction, blocked schema upgrade, multi-tab clear race, or removed-ID history transition.

## 6. Immediate release blockers

1. Stop presenting “ready” when mandatory official conditions were not asked or were inferred from proxies; correct every High/P1 matcher witness in section 8.
2. Correct DTC value semantics, universal readiness, signer matrix and unsupported “master key” ranking across every propagated surface.
3. Correct the BC Bus Pass fee, Autism Funding final-period allowance, CDB values/AISH interaction and every other outdated/incorrect High/P1 ledger row.
4. Add the missing reviewed BC structured values or suppress incomplete totals/priority; do not mechanically sum mutually exclusive or replacement programs.
5. Fix cross-jurisdiction and city-only requirement actions/matches, including Alberta applicants sent to StudentAid BC.
6. Remove prohibited numeric facts from assistant grounding and reconcile its BC scope; test prompts, numeric tokens and interrupted streams.
7. Restore the documented no-analytics boundary and strict CSP; disable Cloudflare injection rather than weakening policy.
8. Redirect HTTP to HTTPS and add a deliberately reviewed HSTS policy.
9. Give wizard choices native/complete selection semantics, remove the whole-app live region, and manage focus predictably.
10. Resolve current closed/intake/transition uncertainties (Easter Seals, Dog Guides, SAET, BC Rehab) before presenting an actionable lead.

The same release should address linked Medium/P1 rows: route titles/announcements, link-monitor integrity, CORS abuse, assistant reset/timeouts, unexplained priority, current contacts/timing, and source/date governance. Unsupported or manual ledger rows must not be advertised as recently verified.

## 7. Findings summary, sorted by user harm

| ID | Sev / priority | Confidence | Type | Finding |
|---|---|---|---|---|
| DATA-01 | High / P1 | Confirmed | Data accuracy | DTC base amount is presented as an annual tax saving/value |
| DATA-02 | High / P1 | Confirmed | Data accuracy | DTC practitioner types are falsely treated as interchangeable |
| DATA-04 | High / P1 | Confirmed | Data accuracy / Defect | Broad proxy can mark municipal programs ready without their required route |
| DATA-06 | High / P1 | Confirmed | Data accuracy | BC Autism Funding transition expenditure guidance is stale |
| DATA-05 | High / P1 | Confirmed | Data accuracy | BC Bus Pass charges PWD recipients a fee that belongs to another stream |
| DATA-14 | High / P1 | Confirmed | Data accuracy | AISH/CDB interaction omits current required action/treatment |
| SEC-01 | High / P1 | Confirmed | Security | Plain HTTP serves the app; HTTPS has no HSTS |
| AI-01 | High / P1 | Confirmed | Reliability / Data accuracy | “Redacted” assistant grounding exposes prohibited numeric facts |
| A11Y-01 | High / P1 | High confidence | Accessibility | Wizard selection state is not exposed and every click destroys focus |
| DATA-25 | High / P1 | Confirmed | Defect / Data accuracy | DTC is marked ready for every completed profile without evaluating CRA's functional criteria |
| DATA-38 | High / P1 | Confirmed | Defect / Data accuracy | CPP-D contribution history is inferred from present work status |
| DATA-28 | High / P1 | Confirmed | Defect / Data accuracy | Grande Prairie and St. Albert programs require only city residence in the matcher |
| DATA-49 | High / P1 | Confirmed | Defect / Data accuracy | BC fuel-tax/ICBC rules are replaced by an overbroad disability proxy |
| DATA-33/35 | High / P1 | Confirmed | Data accuracy | Adult and child federal disability-benefit matchers omit mandatory tax/CCB criteria |
| DATA-36/37 | High / P1 | Confirmed | Data accuracy | RDSP account, contribution and grant/bond age/eligibility rules are conflated |
| DATA-39/40/41 | High / P1 | Confirmed | Data accuracy | Student-grant matchers omit financial/program/documentation and cost gates |
| DATA-42/43/44 | High / P1 | Confirmed | Data accuracy | AISH, ADAP and AADL are marked ready without core official gates |
| DATA-30 | High / P1 | Confirmed | Data accuracy | Shared income band excludes part of BC Healthy Kids' official range |
| DATA-47/48/50 | High / P1 | Confirmed | Data accuracy | BC PWD, child-transition and property-deferral records overstate readiness |
| ABFED-01 | High / P1 | Confirmed | Defect | Shared disability-document action sends Alberta applicants to StudentAid BC |
| ABFED-02/03/04 | High / P1 | Confirmed | Data accuracy | Adult Health, FSCD and PDD readiness omit defining eligibility gates |
| ABFED-05/06 | High / P1 | Confirmed | Data accuracy | Alberta student-grant and parking-placard guidance/matching misstate official rules |
| DATA-51 | High / P1 | Confirmed | Defect / Data accuracy | All 48 BC benefits are omitted from structured values, totals and value-based priority |
| DATA-03 | Medium / P1 | Confirmed | Data accuracy | Canada Disability Benefit maximum and new supplement are stale/absent |
| DATA-08 | Medium / P1 | Confirmed | Data accuracy | Edmonton processing time is materially understated |
| DATA-10 | Medium / P1 | Confirmed | Data accuracy / Maintainability | Verification dates are synthetic/inconsistent and freshness copy overclaims |
| DATA-46 | Medium / P1 | Confirmed | Data accuracy / UX | AISH extra guidance contradicts Alberta's current employment test |
| PRIV-01 | Medium / P1 | Confirmed | Privacy / Maintainability | Active analytics and widened CSP contradict mandatory project policy |
| AI-02 | Medium / P1 | Confirmed | Reliability | Assistant says BC is unsupported while BC is live |
| A11Y-02 | Medium / P1 | High confidence | Accessibility | Route focus/title handling is absent while the whole main region is live |
| REL-01 | Medium / P1 | Confirmed | Reliability | Link monitor cannot detect normal body-based soft 404s |
| SEC-02 | Medium / P1 | Confirmed | Security / Reliability | Wildcard CORS enables third-party quota/email invocation |
| UX-02 | Medium / P1 | Confirmed | UX / Data accuracy | Homepage overpromises eligibility/completeness and uses a misleading preview |
| TEST-01 | Medium / P1 | Confirmed | Test gap | Eligibility predicates/outcome sets lack systematic regression tests |
| UX-03 | Medium / P1 | Confirmed | UX / Data accuracy | “Priority order” uses unexplained editorial weights and a fixed DTC bonus |
| ABFED-07/08/09 | Medium / P1 | Confirmed | Data accuracy | DRES, CWB and Child Health omit or contradict material official gates |
| ABFED-16/17 | Medium / P1 | Confirmed | Data accuracy | Easter Seals/Dog Guides entries present closed intakes as actionable |
| ABFED-A01 | Medium / P1 | Confirmed | Data accuracy / UX | Adult Health shows an unsupported `$1,000+/yr` coverage value |
| BC-BC-02/05/06/12/14/15/16/17 | Medium / P1 | Confirmed | Data accuracy / Defect | Eight BC records contain current rule, intake, routing, amount or matcher errors |
| BC-BC-09 | Medium / P1 | Needs manual validation | Data accuracy | SAET new-intake status is unclear in current official transition material |
| REL-06 | Medium / P1 | Needs manual validation | Reliability | Two production clients received contradictory API routing results |
| AQ-04 | Medium / P2 | Confirmed | Defect / Privacy | Persisted province/city combinations can be cross-jurisdictional |
| SEC-03 | Medium / P2 | Needs isolated validation | Security | Feedback kind permits CR/LF in an email subject |
| REL-02 | Medium / P2 | Confirmed | Reliability / UX | Assistant becomes permanently stuck after ten exchanges |
| REL-03 | Medium / P2 | High confidence | Reliability | Assistant/feedback have no timeout or cancellation |
| REL-04 | Medium / P2 | Confirmed | Reliability | Missing/throwing rate-limit or KV bindings become generic failures |
| A11Y-03 | Medium / P2 | High confidence | Accessibility | No bypass link; accessibility dialog and feedback errors lack key behavior |
| A11Y-06 | Medium / P2 | High confidence | Accessibility | Visible language label “EN” is absent from the control's accessible name |
| PERF-01 | Medium / P2 | Confirmed | Reliability / UX | Production mobile lab LCP is 4.0 seconds and scripts block rendering |
| TEST-02 | Medium / P2 | Confirmed | Test gap | E2E is static-server Chromium only and uses fixed sleeps |
| DATA-09 | Medium / P2 | Confirmed | Data accuracy | ADAP contact is mislabeled |
| DATA-11 | Medium / P2 | Confirmed | Data accuracy | Medicine Hat official page and PDF conflict |
| DATA-12 | Medium / P2 | High confidence | Enhancement / Program integrity | Several in-scope, high-value programs are absent |
| A11Y-05 | Low / P2 | High confidence | Accessibility | OS reduced-motion does not suppress every route/panel animation |
| CAL-01 | Low / P2 | High confidence | Reliability | Reminder dates use UTC and can shift a local evening selection to the next day |
| SUPPLY-01 | Low / P2 | Confirmed | Security / Maintainability | Wrangler's development-only image stack has one current high upstream advisory |
| DEPLOY-01 | Low / P2 | Confirmed | Maintainability / Data accuracy | Unused stale `data-provinces-later.js` is publicly deployed |
| REL-05 | Low / P2 | Confirmed | Reliability | Render-error “Try again” is blocked by CSP |
| DATA-07 | Low / P2 | Confirmed | Data accuracy | Calgary Fair Entry uses 2025 prices |
| DATA-15 | Low / P2 | Confirmed | Data accuracy | Organization cards hardcode the wrong verification date |
| AQ-03 | Low / P2 | Confirmed | Defect | BC browse filter is lost on reload |
| UX-01 | Low / P3 | Confirmed | UX | Static-guide privacy link goes to the homepage |
| SEC-04 | Low / P3 | High confidence | Security hardening | Full request body is parsed before app-level size limits |
| SEC-05 | Low / Backlog | Confirmed | Security / Defect | Postal text is reinserted into HTML without escaping |
| DOC-01 | Informational / P3 | Confirmed | Maintainability | HANDOFF and public claims disagree with the live BC architecture |

## 8. Detailed findings

Evidence labels used below: **Observed** means directly reproduced; **Code-confirmed** means an executable source path demonstrates it; **Source-confirmed** means a current official page supports it; **Inferred** is not reproduced; **Manual validation required** needs a person, specialist, AT, or external environment.

### DATA-01 — DTC base amount is presented as the value of the credit

- **Remediation status (2026-07-22): Completed locally; not deployed.** The misleading estimate, homepage amount and retroactive-value calculator were removed from source and regenerated surfaces. Focused browser assertions and the complete 28-test Chromium suite pass.
- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy.
- **Affected users:** DTC applicants and supporting relatives, especially users budgeting under financial pressure.
- **Affected surfaces:** `public/data.js` DTC value/summary/detail, result/detail/print value path, `public/guides/dtc.html`, and the homepage preview.
- **Evidence:** **Code-confirmed; Source-confirmed.** The site calls approximately $10,138 the annual tax credit/value. The official 2026 base amount is $10,341; because the DTC is a non-refundable credit, the federal tax reduction is up to about $1,448 before provincial effects. The base is not cash and not the tax saving.
- **Reproduction:** Open the homepage preview, DTC result/detail or generated DTC guide and compare the displayed characterization with the current federal measure and CRA explanation.
- **Expected / actual:** Expected a clearly labelled non-refundable credit with an honest, jurisdiction-sensitive estimate. Actual text conflates the base amount with the value received.
- **Root cause:** The base amount, structured estimate and marketing preview use different concepts, and generated surfaces propagate the source record.
- **Correction / verification:** Define one structured concept for base amount versus estimated tax reduction; correct all renderers and generated files; verify against [Finance Canada’s 2026 tax measure](https://budget.canada.ca/update-miseajour/2026/report-rapport/tm-mf-en.html) and the [CRA DTC page](https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit.html). Re-run generation and compare result, detail, print and guide.
- **Regression:** Assert that the base is never labelled cash/value received and that federal/provincial estimates remain explicitly conditional.

### DATA-02 — DTC practitioner guidance ignores the impairment matrix

- **Remediation status (2026-07-22): Completed locally; not deployed.** The current CRA function-by-practitioner matrix is encoded and covered by an exact table assertion. Proposed signer expansions are not presented as current.
- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy.
- **Affected users:** Applicants who may pay for or wait for the wrong practitioner.
- **Affected surfaces:** practitioner finder, `PRACTITIONER_FORMS`, DTC detail/static guide and assistant grounding.
- **Evidence:** **Code-confirmed; Source-confirmed.** The site presents listed practitioners as interchangeable signers. CRA allows a doctor or nurse practitioner for all impairment categories, but other professions are limited: optometrists for vision, audiologists for hearing, occupational therapists for walking/feeding/dressing, physiotherapists for walking, psychologists for mental functions, and speech-language pathologists for speaking.
- **Reproduction:** Complete a DTC path, open practitioner guidance and compare its flat options with the CRA matrix.
- **Expected / actual:** Expected the correct signer for the claimed impairment. Actual guidance can direct a user to a professional who cannot certify that section.
- **Root cause:** A single form-to-practitioner list is used where official rules are category-specific.
- **Correction / verification:** Encode the [CRA practitioner matrix](https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit/how-apply-dtc.html), retain doctor/NP general coverage, and verify every limitation category and multi-limitation combination.
- **Regression:** Table-driven tests for every CRA impairment/practitioner pair, including rejected pairs and multiple impairments.

### DATA-04 — municipal readiness uses an invalid proxy

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy and defect.
- **Affected users:** Edmonton, Red Deer, Lethbridge, Medicine Hat, Strathcona, Airdrie and Wood Buffalo users.
- **Affected code:** `public/app.js:234-239` (`lowIncomeOrDisabilityIncome`) and municipal benefit requirements.
- **Evidence:** **Code-confirmed; Source-confirmed.** `lowIncome() || dtc === "yes" || unableToWork` is treated as “lower income, or on AISH / CPP Disability.” DTC approval and inability to work are not proof that a person receives AISH/CPP-D or meets municipal income documents. Sample enumeration produced false-ready paths.
- **Reproduction:** Choose a listed city, select higher income, mark unable to work or DTC yes without AISH/CPP-D status, and inspect the municipal result.
- **Expected / actual:** Expected “check this route” or a direct qualifying-program question. Actual may be “ready.”
- **Root cause:** Questionnaire variables were repurposed as a convenience proxy for evidence the questionnaire never asks for.
- **Correction / verification:** Ask only the minimum concrete qualifying-route question, or classify as “may qualify/check income” without a ready verdict. Verify each municipality from its own official source; never share a municipal predicate merely because programs look similar.
- **Regression:** One table per city covering income route, AISH route, CPP-D route, no qualifying route and unknown.

### DATA-06 — BC Autism Funding final-period expenditure rule is stale

- **Remediation status (2026-07-22): Completed locally; not deployed.** Both age records now distinguish the normal 20% TTE rule from the 50% final-aligned-period exception and include all three transition deadlines. Source, generated guides and assistant detail grounding were regenerated; focused and full browser regressions pass.
- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy.
- **Affected users:** Families transitioning from Autism Funding who could lose usable funds.
- **Affected surfaces:** both autism records, guides and generated assistant detail.
- **Evidence:** **Code-confirmed; Source-confirmed.** The site says 20% may be spent on travel, training and equipment in the final period; BC’s current transition page states 50%.
- **Reproduction:** Open either autism guide and compare the transition-use statement with BC’s current support-needs page.
- **Expected / actual:** Expected the current 50% rule, with its transition dates and scope. Actual is 20%.
- **Correction / verification:** Correct both records from the [official BC support-needs page](https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs), regenerate and recheck both age paths.
- **Regression:** Shared fact fixture asserted across under-6, 6–18, guides, assistant context and print.

### DATA-14 — AISH/CDB interaction guidance omits current required action

- **Remediation status (2026-07-22): Completed locally; not deployed.** CDB, AISH and ADAP surfaces now give the mandatory outcome-reporting action and date the published no-decision reduction scenario. Current federal indexation remains separate from Alberta's `$200` wording.
- **Severity / priority / confidence / type:** High / P1 / Confirmed / Data accuracy.
- **Affected users:** AISH recipients applying for or receiving the Canada Disability Benefit.
- **Affected surfaces:** AISH/CDB details, interactions and sequencing guidance.
- **Evidence:** **Code-confirmed; Source-confirmed.** The site merely says to check how Alberta treats CDB alongside AISH. Alberta says AISH recipients must apply for other government programs, update AISH with CDB/DTC outcomes, and describes a $200 AISH reduction in a specified no-decision scenario beginning with April 2026 benefits.
- **Expected / actual:** Expected a dated, prominent action and interaction warning. Actual leaves a mandatory administrative step vague and can imply benefits are additive.
- **Correction / verification:** Add only the exact, current Alberta action after reconciling July 2026 CDB indexation and ADAP transition with the program owner. Source: [Alberta AISH—federal disability supports](https://www.alberta.ca/index.php/aish-apply-for-federal-disability-supports).
- **Regression:** Pending, approved, denied and no-decision scenarios; ensure combined estimates never add incompatible amounts.

### SEC-01 — production is available over plaintext HTTP

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Security.
- **Affected users:** Anyone whose first visit occurs on an untrusted or compromised network.
- **Affected surface:** `http://abilityfinder.ca` and HTTPS response headers.
- **Evidence:** **Observed twice.** `curl -I http://abilityfinder.ca/` returned `HTTP/1.1 200 OK` with the full app and Cloudflare SEA `CF-RAY`; HTTPS returned 200 without `Strict-Transport-Security`.
- **Expected / actual:** Expected an unconditional 301/308 redirect to HTTPS and a reviewed HSTS policy. Actual permits plaintext content/script substitution before a secure visit.
- **Root cause:** Cloudflare zone redirect/HSTS is not enabled; these controls are not in repository `_headers`.
- **Correction / verification:** Enable Always Use HTTPS or an equivalent zone redirect. After confirming every required subdomain is HTTPS-ready, add HSTS deliberately. Assert every HTTP path and asset redirects and HTTPS carries the intended header. This is security best practice, not a legal conclusion.
- **Regression:** Production smoke test for root, guide, asset and API HTTP redirects plus HTTPS HSTS.

### AI-01 — numeric facts survive the assistant redaction generator

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Reliability and data accuracy.
- **Affected users:** Anyone asking the assistant about amounts, cutoffs, percentages or age.
- **Affected files:** `scripts/gen-benefits-context.js:104-117,147-176`, `src/benefits-context.js`, `src/index.js:52-58,108`.
- **Evidence:** **Code-confirmed.** `redactFigures()` is applied to per-benefit detail but not `b.summary` in the always-sent catalogue. Generated grounding contains at least 18 money/percentage expressions plus age limits, while the prompt and generated comment claim figures are redacted.
- **Reproduction:** Run the generator; search `BENEFITS_CONTEXT` for `$`, `%` and age expressions. The source defect reproduces deterministically.
- **Expected / actual:** Expected the model never to receive facts it is prohibited from stating. Actual safety relies on a small model obeying negative instructions despite seeing the facts.
- **Root cause:** Redaction is applied only to the retrieved-detail path.
- **Correction / verification:** Redact every grounding surface and make generation fail if prohibited numeric patterns remain. Preserve allowed verified phone/form tokens through explicit typed fields, not regex exceptions.
- **Regression:** Generator tests for money, percent, age, income, asset, ranges, Unicode currency and words such as “per month”; Worker-level adversarial prompts must still refuse.

### A11Y-01 — wizard selection semantics and focus are broken

- **Severity / priority / confidence / type:** High / P1 / High confidence / Accessibility.
- **Affected users:** Screen-reader, keyboard, switch, voice-control and motor-limited users.
- **Affected code:** `public/app.js:2465-2482,2578-2587`.
- **Evidence:** **Code-confirmed; Manual validation required for AT impact.** Choices are ordinary buttons whose selected state exists only in `.selected` CSS. They expose no `aria-pressed`, radio/checkbox state, fieldset/legend or group. Every click replaces `#app`, destroying the focused element; multi-select users remain on the same question with focus lost.
- **Expected / actual:** Expected programmatic state and predictable focus. Actual selection is visually conveyed only and keyboard navigation can restart at the document beginning.
- **Root cause:** Full-app string rendering is coupled to every answer update.
- **Correction / verification:** Prefer native radio/checkbox groups. If custom buttons remain, implement complete name/role/state/group semantics. Update a multi-select in place or restore focus; move focus to the new question heading only on deliberate step navigation.
- **Regression:** Playwright accessibility assertions plus keyboard tests for every single/multi/select step; then VoiceOver, NVDA and TalkBack validation.

### Medium/P1 data findings

#### DATA-03 — Canada Disability Benefit

- **Remediation status (2026-07-22): Completed locally; not deployed.** Catalog, estimates and generated guide now use `$204.20/month` for July 2026–June 2027. The conditional fixed `$150` supplement is shown separately and excluded from annual recurring totals.
- **Affected/evidence:** Adults considering CDB; `public/data.js`, guide and estimates. **Source-confirmed** current July 2026–June 2027 maximum is $204.20/month and a September 2026 DTC-cost supplement of up to $150 exists; site shows $200/$2,400 and omits the supplement.
- **Cause/correction:** annual indexation and the new measure were not propagated. Reverify and update from the [official CDB amount page](https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit/amount.html), then regenerate.
- **Verify/regression:** boundary tests for benefit year, indexed monthly/annual display and supplement eligibility wording.

#### DATA-05 — BC Bus Pass fee

- **Remediation status (2026-07-22): Completed locally; not deployed.** The record and guide now state no annual fee for the PWD stream, attach `$45/year` only to the eligible low-income-senior stream and explain the PWD pass-versus-`$52/month` choice.
- **Affected/evidence:** PWD recipients; record/guide/estimate. **Source-confirmed** PWD recipients choose the pass or $52/month transportation support, and the PWD pass stream has no annual fee; the site states $45.
- **Cause/correction:** rules from a different eligibility stream were combined. Correct from the [official BC Bus Pass page](https://www2.gov.bc.ca/gov/content/transportation/passenger-travel/buses-taxis-limos/bus-pass/people-with-disabilities).
- **Verify/regression:** separate PWD and other program streams; never reuse a fee across them.

#### DATA-08 — Edmonton wait time

- **Affected/evidence:** Edmonton applicants planning transit. **Source-confirmed** current processing is 8–12 weeks plus card delivery; site says 1–2 weeks.
- **Correction/regression:** update from [Edmonton subsidized transit](https://www.edmonton.ca/ets/subsidized-transit); test time display in result, guide and assistant detail.

#### DATA-10 — verification dates do not mean one thing

- **Affected/evidence:** all users; metadata, BC record-level `verified`, About/Updates and guide freshness. **Code-confirmed.** Seventy-three benefits fall back to a synthetic July 1 date, exact BC record dates are ignored in one renderer, static guides omit the date that public copy says they show, and three date models compete.
- **Expected/correction:** one authoritative date that advances only after substantive official-source review. Render an honest “not independently reverified” state rather than a synthetic fresh date.
- **Regression:** schema validation, exact source-to-card/guide date equality and a test that generation cannot advance dates.

#### DATA-46 — AISH extra guidance contradicts the current official test

- **Affected/evidence:** AISH applicants; questionnaire, result/guide, print and assistant copies. **Source-confirmed; Code-confirmed.** The Alberta page accessed 2026-07-22 says the severe disability “permanently prevents you from employment.” The site separately tells users to confirm only that disability “substantially limits your ability to earn.” The earlier audit hypothesis that the site's stricter “stops work” wording was necessarily too narrow is withdrawn.
- **Correction:** reconcile all AISH surfaces with the current official wording. Keep medical adjudication, financial, residency, age and exclusion criteria unresolved until they have actually been established; do not turn a lay work-impact answer into an official verdict.
- **Regression:** compare questionnaire, matcher, detail, print, static guide and assistant grounding against one reviewed official fixture; include work, episodic work, leave and unable-to-work profiles.

### PRIV-01 — analytics conflicts with the mandatory privacy model

- **Severity / priority / confidence / type:** Medium / P1 / Confirmed / Privacy and maintainability.
- **Affected users:** all visitors; guide URLs can reveal interest in a particular disability benefit.
- **Evidence:** **Observed; Code-confirmed.** `public/index.html:201` and generated guides load Cloudflare Web Analytics; production loaded both the explicit beacon and an edge-injected beacon. `public/_headers:10` permits the analytics script/connection. AGENTS, DEPLOY, ARCHIVAL and README say no analytics or self-only CSP; privacy copy instead discloses analytics.
- **Expected / actual:** Expected the documented no-analytics boundary. Actual third-party scripts execute on app and guide pages. No questionnaire-answer exfiltration was observed, so this is not reported as confirmed sensitive-data leakage.
- **Correction / verification:** Resolve the product decision explicitly. Under current mandatory instructions, remove the beacon and CSP exceptions, disable dashboard injection, update privacy text, and confirm no analytics requests on any route/guide.
- **Regression:** production network/CSP assertion rejecting third-party scripts.

### AI-02 — assistant scope contradicts the product

- **Severity / priority / confidence / type:** Medium / P1 / Confirmed / Reliability.
- **Evidence:** **Code-confirmed; Observed narrow production check.** `public/app.js:9` enables BC, while `src/index.js:72` says Alberta/federal only. A BC prompt happened to get a BC answer because BC catalogue text competes with the stale instruction; that does not make the contract deterministic.
- **Correction / verification:** Generate scope wording from the same source as catalogue inclusion. Test BC, Alberta, federal and unsupported-province prompts.

### A11Y-02 — route announcements and page structure

- **Severity / priority / confidence / type:** Medium / P1 / High confidence / Accessibility.
- **Affected users:** screen-reader and keyboard users, including cognitively fatigued users.
- **Evidence:** **Code-confirmed; Manual validation required.** `setState()` replaces route content but does not update `document.title` or focus a route heading/main. `public/index.html:102` makes the entire changing main `aria-live="polite"`, likely announcing full rerenders. Wizard/results start with `h2`, not a page `h1`.
- **Correction / verification:** Add route titles and one page-level heading, focus it/main only on route or step changes, preserve focus on same-question updates, and restrict live regions to targeted final status. Validate with VoiceOver/NVDA/TalkBack.
- **Regression:** title/focus assertions for all 17 views, history back/forward and errors.

### REL-01 — link monitor misses common soft 404s

- **Severity / priority / confidence / type:** Medium / P1 / Confirmed / Reliability.
- **Affected users:** anyone following a government/program link that now returns a 200 “not found” page.
- **Evidence:** **Code-confirmed; Observed production report.** `src/link-check.js:34` deliberately does not read bodies. Lines 98–101 only match not-found words in the final URL. Production had 50/151 recorded results, one timeout, 101 pending and no full sweep. At 10 links every three hours, 16 batches can take up to 48 hours; the old comment describes a 43-link/15-hour catalogue.
- **Correction / verification:** Read a bounded title/body sample, use conservative localized indicators, classify uncertain pages for manual review, and show full-sweep age prominently.
- **Regression:** 200 soft-404 fixtures, localized pages, legitimate “not found” prose, redirects, timeout and oversized body.

### SEC-02 — same-origin APIs are exposed cross-origin

- **Severity / priority / confidence / type:** Medium / P1 / Confirmed / Security and reliability.
- **Affected users/system:** shared Workers AI free allocation and pinned feedback inbox.
- **Evidence:** **Observed; Code-confirmed.** `src/index.js:113-117` returns `Access-Control-Allow-Origin: *`; production preflight accepted cross-origin calls. These endpoints have no cross-origin UI requirement. This is not conventional authenticated CSRF, but arbitrary sites can spend a visitor IP's quota or trigger owner-bound email. Per-IP limiting reduces, not removes, distributed abuse.
- **Correction / verification:** Omit CORS for same-origin calls or allow only production origins; validate `Origin` when present. Cross-origin preflight/POST should fail while same-origin UI works.
- **Regression:** same-origin, hostile-origin, absent-origin and malformed-origin tests.

### UX-02 — the homepage overpromises certainty and completeness

- **Remediation status (2026-07-22): Mitigated, still open.** The misleading numeric preview was removed. Broader completeness/verdict wording and user comprehension remain unresolved.
- **Severity / priority / confidence / type:** Medium / P1 / Confirmed / UX and data accuracy.
- **Affected users:** applicants who may treat the tool as an official determination.
- **Evidence:** **Observed; Code-confirmed.** Phrases such as “Every benefit you're owed,” “all benefits,” and “we’ll tell you if you qualify” conflict with the catalogue's known omissions and the rule that only government decides. The preview hardcodes an estimated total around $14,600/year, DTC about $10,138/year and RDSP +$4,500, while the DTC structured estimate is $1,500–$2,700 and grant/bond values are conditional.
- **Expected / actual:** Expected “programs you may qualify for” with example values clearly labelled illustrative. Actual copy can be understood as a complete official verdict and guaranteed value.
- **Correction / verification:** Use bounded, non-official language; explain ready/almost/not-match at the decision point; remove or rebuild the preview from a labelled synthetic scenario with current structured semantics.
- **Regression:** content assertions and moderated comprehension testing; ask users what “ready” means before and after correction.

### TEST-01 — the eligibility engine lacks a systematic oracle suite

- **Remediation status (2026-07-22): Improved, still open.** Seven matcher/DTC safety tests now cover several high-harm negative cases, but they do not form a complete official-rule oracle for all programs.
- **Severity / priority / confidence / type:** Medium / P1 / Confirmed / Test gap.
- **Evidence:** **Code-confirmed.** Current unit/E2E coverage is valuable but does not table-test all 97 requirements, 84 benefit requirement lists, fixed/unfixed status transitions, or jurisdictional negative cases. This audit's 250,000-state sample found no exceptions but is not a maintained test and does not prove factual correctness.
- **Correction / verification:** Add generated table-driven predicate tests, per-benefit minimum ready/almost/no witnesses, municipal route tests and invariant/property tests. A content change must update its official-source fixture intentionally.

### DATA-25 — DTC is universally marked ready

- **Remediation status (2026-07-22): Mitigated, still open.** DTC no longer becomes `ready` from hardcoded true conditions; the reduced 250,000-profile rerun observed it as conditional rather than ready. Exact official functional-category questions and qualifying witnesses are still required.
- **Severity / priority / confidence / type:** High / P1 / Confirmed / Defect and data accuracy.
- **Affected users/surfaces:** every completed questionnaire profile; results, totals, priority plan, print and DTC-dependent follow-on guidance.
- **Evidence:** **Observed in the 250,000-state run; Code-confirmed; Source-confirmed.** `REQS.prolonged` and `REQS.certifier` at `public/app.js:202-203` both return `true`; the DTC record requires only those two names. DTC was ready in all 250,000 sampled completed states, including no-limitation profiles. CRA instead requires the relevant severe/prolonged functional test, marked restriction/cumulative effect or qualifying life-sustaining therapy, and an authorized practitioner.
- **Expected/actual:** Unasked official conditions remain unknown and the site avoids a verdict. Instead, both are asserted met and the authored zero-result branch becomes unreachable.
- **Correction:** until the official tests can be represented accurately, display “eligibility not determined—review these criteria,” not ready. Never substitute diagnosis or generic access to a certifier.
- **Verification/regression:** no-limitation, single/cumulative restriction, life-sustaining therapy, incomplete, and certifier-unknown fixtures; assert result/detail/print agree and no unasked criterion is met.

### Additional High/P1 eligibility and routing defects

Each row is **Code-confirmed and Source-confirmed**, affects result/detail/print priority surfaces, and can turn an unknown or ineligible case into “ready” (or suppress an eligible lead). Exact claim text, official URLs, access date, status and correction are in the claim ledgers in section 9.

| ID | Affected users / executable evidence | Expected, correction, and verification |
|---|---|---|
| DATA-38 | CPP-D applicants. `REQS.cppContrib` treats current work or “unable to work” as sufficient contribution history; no contribution record is asked. | Keep unknown until the user confirms the official 4-of-6 or 3-of-6-plus-25-years route. Test sufficient, insufficient and unknown statements of contributions. |
| DATA-28 | Grande Prairie and St. Albert residents. Their records require only the city key although the displayed routes require actual AISH/ADAP receipt or a separate income test. | Ask the exact categorical/income route; test resident recipient, resident nonrecipient, income route and incomplete state. Remove unsupported province-wide superlatives. |
| DATA-49 | BC drivers/passengers. `vehicleDisability` accepts any physical/vision limitation or transit barrier; ICBC also depends on confirmed fuel-tax-program registration. | Model only enumerated official routes and registration. Test qualifying/nonqualifying mobility, vision and hazardous-transit cases plus registration absent/present. |
| DATA-33 | Adult CDB applicants. Matcher omits tax-residency/status and filed applicant/spouse returns and reduces the graduated amount formula to a rough income band. | Missing criteria stay unknown; any estimate uses the current payment-period formula. Test return/status/spouse combinations and income boundaries. |
| DATA-35 | Parents/guardians seeking Child Disability Benefit. Child age plus DTC is treated as enough; Canada Child Benefit eligibility is not established. | Condition the lead on CCB eligibility; test CCB yes/no/unknown independently of DTC. |
| DATA-36, DATA-37 | RDSP users. Under-60 wording conflates opening/contributing through 59 with grants/bonds only through the year the beneficiary turns 49; residence and SIN are omitted. | Split plan-opening, contribution, grant and bond outcomes; test age 49/50 and 59/60 plus residence/SIN. |
| DATA-39, DATA-40, DATA-41 | Federal/Alberta student-aid users. Matchers omit financial need, qualifying program/designated institution, documentation and exceptional-cost evidence; transportation is attributed to the wrong grant stream. | Preserve unknown criteria and distinguish programs/annual forms. Test new/repeat applications, persistent/prolonged documentation, no cost, estimates/receipts and federal-first allocation. |
| DATA-42, DATA-43, DATA-44 | AISH, ADAP and AADL applicants. Financial/assets/spouse, medical adjudication, age/exclusion, ADAP employment-impact, AHCIP/clinical assessment/approved item/vendor and other-payer gates are omitted. | Never assert an unasked gate. Add per-program ready/almost/no witnesses, including institutional/OAS/other-payer and unknown cases. |
| DATA-30 | BC Healthy Kids families. Shared “under about $35,000” logic excludes part of the official adjusted-net-income range under $42,000; “free dental” hides possible provider charges above schedule. | Use the official supplementary-benefit test and say coverage toward basic dental. Test the full threshold range and extra-charge warning. |
| DATA-47 | BC PWD applicants. Ready status omits ministry family-unit income/assets and the designation process. | Leave ministry adjudication unknown; test financial/designation stages and absence of an official processing-time promise. |
| DATA-48 | Families transitioning from BC Autism Funding/SAET. The new child benefit route is generalized beyond eligible autism diagnosis or At Home Program eligibility. | Preserve the source program's gateway and test each transition stream separately. |
| DATA-50 | BC property-tax-deferral applicants. Citizenship/status, one-year BC residence, registered ownership, principal residence/property, arrears and 25% equity are omitted. | Model/confirm every official gate; test ownership, equity, arrears, residence and status boundaries. |
| ABFED-01 | Alberta DRES/student-grant users. A shared `disabilityDoc` action links to StudentAid BC. | Route by province/program and test every requirement action URL from every jurisdiction. |
| ABFED-02 | Alberta Adult Health users. Low income alone yields ready although the official gateway also requires pregnancy, high ongoing prescription needs, or leaving AISH/Income Support for specified income, plus status/residency/exclusions. | Represent the categorical gateway and exclusions; test every route and low-income-only negative case. |
| ABFED-03 | FSCD families. Child + Alberta is enough; guardian/status/residence and disability evidence or awaiting-diagnosis route are omitted. | Test guardian/status, diagnosed, awaiting diagnosis and no disability-evidence cases. |
| ABFED-04 | PDD applicants. Matcher omits the official assessed intellectual/adaptive criteria and status; `adult` wrongly excludes users 65+. | Use age 18+ without an upper limit and preserve assessment/status as unknown. Test age 18, 64, 65+ and qualifying/nonqualifying assessments. |
| ABFED-05 | Alberta student-grant users. The guide promises stacking and says Schedule 4 is one-time/no extra form, conflicting with federal-first and annual support/cost request rules. | Correct the procedure and test first/repeat applications, no requested cost and costs fully covered federally. |
| ABFED-06 | Alberta parking-placard applicants. Any vision selection counts as qualifying, instead of inability to walk 50 m or vision loss substantially limiting safe independent navigation. | Ask the official functional threshold; test mild/corrected vision, qualifying navigation restriction and 50 m mobility boundary. |

### DATA-51 — BC benefits are excluded from structured values and ranking totals

- **Severity / priority / confidence / type:** High / P1 / Confirmed / Defect and data accuracy.
- **Affected users/surfaces:** every BC user; money band, estimated annual total, application priority, result cards and print.
- **Evidence/reproduction:** **Code-confirmed.** The catalogue contains 48 BC benefits and `BENEFIT_VALUES` contains structured values for none of them. `renderMoneyBand()` and annual totals therefore omit all BC cash/grant/credit values; `priorityScore()` gives those records no value weight even when raw `amount` text contains a figure.
- **Expected/actual/root cause:** Comparable programs use comparable structured inputs or the UI clearly avoids totals/ranking it cannot compute. BC was launched without extending the parallel value map, while the ranking/totals silently assume its completeness.
- **Correction:** do not copy numbers from raw text mechanically. Reverify each official value and either add reviewed structured data or suppress incomplete totals/ranking with an explicit limitation.
- **Verification/regression:** schema invariant for every monetary benefit, AB/BC parity fixtures, zero/one/many totals, and priority explanations that expose every factor.

### UX-03 — application “Priority order” is not defensible or explained

- **Remediation status (2026-07-22): Mitigated, still open.** The fixed DTC gateway bonus was removed. Remaining editorial value/difficulty/kind weights are not yet explained or validated.
- **Severity / priority / confidence / type:** Medium / P1 / Confirmed / UX and data accuracy.
- **Evidence:** **Code-confirmed.** `priorityScore()` at `public/app.js:472-484` combines structured value, editorial difficulty/ease, kind weights and a fixed `+12` DTC gateway bonus. Only four of 84 records actually depend on DTC, all BC values are absent, and users see “Priority order” without the formula or a reason.
- **Affected/actual harm:** financially or cognitively stressed users may delay urgent/high-value applications because an unvalidated ranking looks authoritative.
- **Correction:** make explicit prerequisites/deadlines the primary ordering facts; remove the universal DTC boost; document/label editorial estimates and explain each recommendation. Validate ordering with applicants and program experts.
- **Verification/regression:** deterministic factor-level tests, dependency/urgency fixtures, AB/BC parity, and a comprehension test asking users why the first item is first.

### REL-06 — contradictory production API routing observations

- **Severity / priority / confidence / type:** Medium / P1 / Needs manual validation / Reliability.
- **Evidence:** **Observed, contradictory.** The in-app browser directly navigated twice to `/api/ask` and `/api/link-health`, including a cache-busting query, and received the static AbilityFinder 404 page. Independent `curl` requests at the SEA edge repeatedly received Worker JSON (405 for GET/HEAD ask, 200 link-health), and POST assistant requests succeeded. Local Wrangler also behaved correctly.
- **Interpretation:** This is not evidence that APIs are globally down. It may be a browser proxy/cache artifact or region/routing inconsistency.
- **Correction / verification:** Test multiple real networks/regions and browsers with CF-Ray capture; audit Workers custom-domain/assets routing and caches. Add synthetic same-client monitoring of both static app and Worker endpoints.
- **Regression:** Repeat GET/POST API contract from at least two external vantage points after each deployment.

### Medium/P2 findings

#### AQ-04 — cross-province persisted city

- **Evidence/root cause:** **Code-confirmed.** Allowlist validation accepts a valid province and any valid catalogue city independently, so `AB + Vancouver` can survive restore and suppress the generic local-support fallback.
- **Affected/expected:** returning users with stale/corrupt state; expected city to belong to province.
- **Correction/verification/regression:** validate `city ∈ CITIES_BY_PROVINCE[province]`, clear/re-ask on province change, and test all cross-jurisdiction pairs plus removed IDs.

#### SEC-03 — possible feedback subject header injection

- **Evidence:** **Code-confirmed; isolated validation required.** `kind` is trimmed/truncated, then inserted into the subject at `src/index.js:289-310`. A local mock accepted `Bug\r\nBcc: victim@example.test` into the subject. Cloudflare Email Service documents restrictions, but actual `EmailMessage` sanitation was not tested because that would send email.
- **Correction/verification:** allowlist exact UI kinds and reject control characters; validate with a non-delivery binding/test account. Add CR, LF, Unicode control and long-kind tests. Do not report arbitrary-recipient injection as confirmed.

#### REL-02 — assistant cannot recover from message cap

- **Evidence/root cause:** **Code-confirmed.** Server rejects over 20 messages. After ten user/assistant pairs the client adds the 21st user, gets 400, pops only that user, and remains at 20 forever. No “new conversation” action exists.
- **Correction/verification:** warn before cap and reset or safely roll off complete pairs. Complete ten exchanges, observe refusal, reset, and verify a new request succeeds.

#### REL-03 — no network timeout/cancel

- **Evidence:** **Code-confirmed.** Feedback disables its button around unbounded fetch; assistant fetch/stream has no `AbortController`, connection/inactivity timeout or dismissal cancellation.
- **Affected/actual:** unreliable-network users can wait indefinitely; hidden work may consume quota.
- **Correction/regression:** finite connection/inactivity timeouts, visible retry/cancel, cancel on explicit close; simulate stalled headers, stalled stream and disconnect.

#### REL-04 — binding exceptions are not handled consistently

- **Evidence:** **Code-confirmed.** `env.ASK_LIMIT.limit` is called directly in both APIs; a missing binding throws. AI/email absence is handled, but rate-limit exceptions and KV reads fall to generic Worker failure.
- **Correction/regression:** choose documented fail-closed/open behavior consistent with zero-spend safety, return an honest 503, and test missing, throwing, timed-out and quota-exhausted bindings.

#### A11Y-03 — bypass, dialog and error gaps

- **Evidence:** **Code-confirmed; manual validation required.** No skip link precedes repeated navigation. The accessibility `role="dialog"` does not receive entry focus, trap focus or restore opener focus. Feedback errors are not associated with fields and have no targeted status announcement.
- **Correction/regression:** visible-on-focus skip link; proper modal or non-modal semantics; entry/return focus; `aria-invalid`/described error and final status. Verify keyboard, VoiceOver, NVDA and zoom.

#### TEST-02 — browser suite does not test production behavior

- **Evidence:** **Observed; Code-confirmed.** `playwright.config.js` launches only Chromium against `python3 -m http.server`; it cannot exercise Worker APIs, `_headers` CSP, Cloudflare asset routing or non-Chromium behavior. Fixed 150/200/230 ms waits create timing fragility.
- **Correction/regression:** a Wrangler-backed project for API/header journeys; Chromium/Firefox/WebKit matrix; event/state assertions instead of sleeps; mobile/reflow and axe as supplemental checks.

#### DATA-09 — ADAP contact label

- **Evidence:** **Source-confirmed.** A displayed number is the AISH application-status line but is labelled Alberta Supports; Alberta Supports is 1-877-644-9992.
- **Correction/regression:** label each number by exact purpose using the [official ADAP page](https://www.alberta.ca/alberta-disability-assistance-program); test click-to-call text and generated guide.

#### DATA-11 — Medicine Hat official conflict

- **Evidence:** **Source-confirmed ambiguity.** The current city webpage and 2026 PDF disagree ($630 versus $635 annual transit cap). Neither value should be declared wrong without program-owner clarification.
- **Correction/regression:** mark manual follow-up, contact the city, cite the controlling source/date, and add a single-source consistency test.

#### DATA-12 — missing in-scope programs

- **Evidence/type:** **High confidence enhancement**, not a defect in an explicitly exhaustive catalogue. RAMP, BC Additional Home Owner Grant, BC Rebate for Accessible Home Adaptations, and the federal Home Accessibility Tax Credit are high-value candidates.
- **Recommendation gate:** ROADMAP permits expansion only program by program. Each needs official research, maintenance ownership and honest completeness wording; no AI matching, accounts or remote questionnaire storage is needed.

### Additional P2, low and informational findings

| ID | Evidence and affected behavior | Correction and verification |
|---|---|---|
| A11Y-05 | **Code-confirmed, manual validation required.** OS reduced motion leaves general card/accessibility-panel animations active; in-app `.a11y-nomotion` is broader. | Make OS and in-app settings suppress equivalent nonessential motion; inspect every animation/transition and validate vestibular comfort with users. |
| A11Y-06 | **Observed by Lighthouse; Code-confirmed.** The visible `EN` in `#langBtn` is not present in `aria-label="Change language"`, so voice users cannot reliably use the visible label. | Include the visible token in the accessible name; test speech-input label matching and both language states. |
| PERF-01 | **Observed lab evidence.** Production mobile simulation measured LCP 4.0 s (performance 79) versus desktop 1.4 s; classic app/data/i18n scripts and CSS were render blocking. One run is not field data. | Profile critical-script ordering and defer safe noncritical work without breaking restore-before-render; repeat mobile runs and track a budget locally without analytics. |
| CAL-01 | **Code-confirmed; timezone-boundary validation required.** `icsDate()` derives an all-day reminder date with UTC components although the marked date is created/displayed locally. Edmonton evening use near UTC midnight can produce the following calendar day. | Use local calendar components for a local all-day intent; test before/after UTC midnight, DST boundaries, leap day and imports in common calendar clients. |
| SUPPLY-01 | **Observed.** Online `npm audit` reports one underlying `sharp <0.35.0` libvips advisory through Miniflare/Wrangler (three dependency nodes); production dependencies audit clean and no untrusted-image path exists. | Monitor/update the toolchain when Wrangler resolves it; do not apply npm's suggested blind downgrade. Add lockfile advisory review to CI. |
| DEPLOY-01 | **Observed production; Code-confirmed.** `/data-provinces-later.js` returns 200 from `public/` although it is unused parked data with stale duplicate jurisdiction facts. No source maps, secrets or debug files were found. | Move archival/parked data outside `public/`; assert an explicit deploy allowlist and 404 for source-only files. |
| REL-05 | **Code-confirmed.** `renderSafely()` uses inline `onclick` at `public/app.js:1247`; production CSP blocks it. Start over remains separately wired. | Bind the reload action in script like reset; inject a render exception and assert both recovery actions work under production CSP. |
| DATA-07 | **Source-confirmed.** Calgary Fair Entry displays 2025 prices; current 2026 rates are $6.30/$44.10/$63. | Update from the [official 2026 fare notice](https://transit-prd.calgary.ca/news/calgary-transit-fares-changing-for-2026.html); test all tiers in card/guide/print. |
| DATA-15 | **Code-confirmed.** Organization cards hardcode July 19 while records range July 19–21. | Render `record.verified`; validate missing/invalid dates and exact equality. |
| AQ-03 | **Code-confirmed.** BC browse province filter is omitted from persisted allowlist and resets to All on reload. | Either persist the non-sensitive enum or state that it resets; reload-test both provinces. |
| UX-01 | **Code-confirmed.** Static guide “Privacy & disclaimer” links to `/`, not the privacy view. | Provide a stable privacy URL/route and generation test for every guide footer. |
| SEC-04 | **Code-confirmed hardening.** `request.json()` reads the body before message/field caps; Cloudflare platform limits still apply. | Reject unreasonable `Content-Length`, document platform cap, and test oversized/chunked bodies locally. |
| SEC-05 | **Observed locally; Code-confirmed.** `public/app.js:3322` interpolates postal text into a value attribute. A synthetic string created a `#postal-canary` element after rerender. It is local, non-persisted and CSP blocked inline script; no remote XSS was established. | Escape attribute values or build the input through DOM APIs; regression with quotes/tags/Unicode. |
| DOC-01 | **Code-confirmed.** HANDOFF says jurisdictions are parked/not loaded and describes an incomplete route model; app has `BC_ENABLED=true` and 84 benefits. | Update architecture docs after fixes; never use docs as the factual oracle. |

## 9. Benefit-information verification ledger

### Method and limits

The audit extracted user-facing fields rather than checking names alone: amount/value strings, executable eligibility, details, steps, documents, tips, timing, phone, forms, application/source URLs, metadata, interactions, signers, municipal exclusions, grants, organizations, supports and help records. Official sources were accessed on 2026-07-22. Search snippets, blogs, aggregators, social media and another municipality's rules were not accepted as authority.

The durable ledgers are in `AUDIT_EVIDENCE_2026-07-22/`:

- `initial-catalog-claims.csv`: **925 exact claim rows**, 27 benefits plus associated values/meta/extra/signers — 672 verified, 21 outdated, 65 unsupported, 4 ambiguous, 163 manual follow-up.
- `remaining-ab-federal-claims.csv`: **772 exact rows** — 18 remaining benefits (343), 11 Alberta/federal grants (112), 13 organizations (78), 6 help organizations (40), and 19 supports (199): 335 verified, 17 outdated, 19 unsupported, 163 ambiguous and 238 manual.
- `remaining-ab-federal-associated-claims.csv`: **109 exact associated-field rows** for those 18 benefits — 40 verified, 1 outdated, 10 unsupported, 18 ambiguous/partial and 40 manual.
- `remaining-bc-claims.csv` and `remaining-bc.md`: all **48 BC benefits and 1,458 main-record assertions**, plus **353** assertions across 7 BC grants, 9 organizations, 6 help entries and 8 BC-resolving supports. Main records: 32 verified, 13 correction required, 2 outdated, 1 manual. The BC CSV groups atomic claims per record instead of one scalar per row; this is a granularity limitation, not an exhaustive scalar-row attestation.

All **84/84 benefit records** therefore received current official-source review at record level, and every directory dataset was accounted for. “Verified” applies only to the reviewed row/record claims and is not a program-wide guarantee or eligibility decision. Unsupported, ambiguous and manual rows remain unresolved; no verification date should advance because this audit ran or because a link responded.

### Substantive checks completed on 2026-07-22

| Program | Exact high-risk claims checked | Current official source | Status / correction |
|---|---|---|---|
| Disability Tax Credit | base/value, non-refundable character, practitioners | [CRA DTC/application](https://www.canada.ca/en/revenue-agency/services/tax/individuals/segments/tax-credits-deductions-persons-disabilities/disability-tax-credit/how-apply-dtc.html); [Finance Canada 2026](https://budget.canada.ca/update-miseajour/2026/report-rapport/tm-mf-en.html) | **Corrected locally on 2026-07-22; not deployed:** DATA-01/02 |
| Canada Disability Benefit | Jul 2026 maximum, threshold concept, Sep supplement, AISH interaction | [CDB amount](https://www.canada.ca/en/services/benefits/disability/canada-disability-benefit/amount.html); [Alberta interaction](https://www.alberta.ca/aish-apply-for-federal-disability-supports) | **Corrected locally on 2026-07-22; not deployed:** DATA-03/14 |
| Child Disability Benefit | $3,480/$290, $82,847 threshold, automatic CCB/DTC, phone | [CRA CDB for children](https://www.canada.ca/en/revenue-agency/services/child-family-benefits/child-disability-benefit.html) | Verified for checked fields |
| RDSP grant/bond | $3,500 grant, $1,000 bond, no contribution for bond, carry-forward | [CRA grant/bond](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/registered-disability-savings-plan-rdsp/canada-disability-savings-grant-canada-disability-savings-bond.html) | Verified checked fields; lifetime total still follow-up |
| CPP Disability | 2026 $610.46 basic/$1,741.20 max, under 65, severe/prolonged | [CPP-D amount](https://www.canada.ca/en/services/benefits/publicpensions/cpp-disability-benefit/benefit-amount.html) | Verified; displayed rounding should be labelled |
| Canada Student Grant—Disabilities | $2,800 for 2026–27 | [Federal 2026 extension](https://www.canada.ca/en/employment-social-development/news/2026/03/government-of-canada-extends-financial-supports-for-post-secondary-students.html) | Verified |
| Canada Student Grant—Services/Equipment | up to $20,000/year, provincial delivery | [Official grant page](https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans/disabilities-service-equipment.html) | Verified checked fields |
| AISH | employment/earning framing, combined transition, CDB interaction, contact | [AISH](https://www.alberta.ca/aish); [how to apply](https://www.alberta.ca/aish-how-to-apply); [federal supports](https://www.alberta.ca/index.php/aish-apply-for-federal-disability-supports) | **Ambiguous/unsupported parts:** DATA-09/13/14 |
| ADAP | $1,740, $700 exemption, combined application, employment wording/contact | [ADAP](https://www.alberta.ca/alberta-disability-assistance-program) | Mostly verified; contact mislabeled |
| AADL | 25% share capped $500/year, waiver, 6+ month condition | [AADL eligibility](https://www.alberta.ca/aadl-eligibility-and-application-for-benefits) | Verified checked fields |
| Calgary Fair Entry | 2026 low-income transit tiers, recreation discount | [2026 transit fares](https://transit-prd.calgary.ca/news/calgary-transit-fares-changing-for-2026.html); [recreation subsidy](https://www.calgary.ca/rec-locations/pools/southland-subsidy.html) | **Old prices:** DATA-07 |
| Edmonton Ride/Leisure | $36/$51, routes, wait | [Edmonton subsidized transit](https://www.edmonton.ca/ets/subsidized-transit) | **Wait stale; matching proxy unsupported:** DATA-04/08 |
| Red Deer | $34, AISH/GIS/Income Support routes | [Red Deer transit assistance](https://www.reddeer.ca/city-services/transit/fares-and-passes/transit-fare-assistance-pass/) | Fields verified; shared proxy unsupported |
| Lethbridge | 3-for-1 passes, $150/season, subsidy | [Lethbridge Fee Assistance](https://www.lethbridge.ca/community-services-supports/community-social-development-csd/fee-assistance-program/) | Fields verified; shared proxy unsupported |
| Medicine Hat | 75%, recreation, annual transit cap | [City Fair Entry](https://www.medicinehat.ca/community-support-culture-safety/community-support/fair-entry/) and linked 2026 PDF | **Official conflict:** DATA-11 |
| Grande Prairie | $10.25 vs $74.25, separate TAP route | [Transit Access Program](https://cityofgp.com/roads-transportation/public-transit/transit-access-program) | Verified checked fields |
| St. Albert | local/commuter fares, recreation for AISH/ADAP | [City subsidy](https://stalbert.ca/city/fcss/programs-services/subsidy/) | Verified checked fields |
| Strathcona County | Arc cap, no-cost Active Pass | [Subsidized fares](https://www.strathcona.ca/community-families/affordable-services/subsidized-fares/); [affordable services](https://www.strathcona.ca/community-families/affordable-services/) | Fields verified; shared proxy unsupported |
| BC Disability Assistance | support/shelter maximums and 2026 earnings exemptions | [BC rate table](https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/bc-employment-and-assistance-rate-tables/disability-assistance-rate-table); [BC release](https://news.gov.bc.ca/releases/2025SDPR0017-001110) | Verified checked fields |
| BC Autism Funding, both age records | amounts, end date, transition spending | [BC support needs](https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs) | **Corrected locally on 2026-07-22; not deployed:** DATA-06 |
| BC Children and Youth Disability Benefit | $6,500/$17,000, needs basis, timing | [Official program page](https://www2.gov.bc.ca/gov/content/health/managing-your-health/child-behaviour-development/support-needs/financial-supports/disability-benefit) | Verified checked fields; use canonical page as source |
| BC Bus Pass | $52-or-pass choice, fee stream, delivery | [BC Bus Pass policy](https://www2.gov.bc.ca/gov/content/governments/policies-for-government/bcea-policy-and-procedure-manual/general-supplements-and-programs/bc-bus-pass-program) | **Corrected locally on 2026-07-22; not deployed:** DATA-05 |
| BC Property Tax Deferment | prime + 2%, fees, 2026 compounding | [Interest/fees](https://www2.gov.bc.ca/gov/content/taxes/property-taxes/annual-property-tax/property-tax-deferment-program/tax-deferment-interest-fees) | Verified checked fields; quarterly monitoring needed |
| BC Fuel Tax Refund / ICBC discount | up to $500/year; 25% Basic Autoplan | [BC refund](https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/motor-fuel-carbon-tax/refund-disabilities) | Verified checked fields |
| BC Healthy Kids | dental maximum/period, glasses, hearing | [BC Healthy Kids](https://www2.gov.bc.ca/gov/content/health/managing-your-health/family/child-teen-health/dental-eyeglasses) | Verified checked fields; page should be periodically reconfirmed |

### Additional official-source corrections from the completed ledgers

The detailed evidence files contain reproduction, source and correction for every row. Release-significant additions not already described above include:

- **ABFED-07/08/09 (Medium/P1):** DRES includes excluded/unsupported services and rejects an eligible refugee route; CWB omits statutory age/residence/student/prison/diplomat rules; Child Health excludes eligible 18/19-year-old high-school students and omits status/exclusions.
- **ABFED-16/17 (Medium/P1):** Easter Seals equipment intake has been closed since 2026-03-19; only Dog Guides' Facility Support intake was open while six other programs were presented as generally available.
- **BC-BC-02/05/06/12/14/15/16/17 (Medium/P1):** PWD prescribed-class guidance is wrong; the new child benefit can false-ready before its 2027 intake; province-wide handyDART routes to Victoria; the Deaf Students grant omits the published $30,000 cap; WorkBC, Kelowna and Coquitlam matchers omit core partitions; and Kamloops implies ARCH automatically produces KamPASS.
- **BC-BC-09 (Medium/P1, manual):** SAET new-intake availability is not clear in current transition sources and requires direct government clarification.
- **ABFED-A01 (Medium/P1):** Adult Health's unsourced “$1,000+/yr” is rendered as an unlabelled factual coverage headline.
- **ABFED-A04 (Medium/P2):** generic “Works well with” links imply unsupported stacking where the relationship may be replacement, transition, alternative funding or non-duplication.
- **ABFED-11/12/13/14 and BC-BC-18 (Medium/Low P2):** Wood Buffalo ride count is inconsistent, Spruce Grove prices need direct confirmation, several municipal/county and alternate eligibility routes are missing, Canmore omits residence/status rules, and BC 211 hours are incorrectly stated as Alberta-style 24/7.
- **ABFED-18/19 (Medium/Low P2):** Shine uses the wrong age range; CP CARES and Tetra leads omit material prerequisites/routing.
- **ABFED-20 (Medium/P2):** 199 support assertions lack a governance boundary separating low-risk planning tips from clinical, legal, accommodation and funding claims.

### Cross-surface consistency

Current generation is mechanically consistent, but it consistently propagates bad source facts:

- CDB $200/$2,400: data and static guide.
- DTC approximately $10,138 “tax credit”: data, homepage, result/detail/print and static guide.
- BC Bus Pass $45: data, guide and assistant concept.
- Autism 20% transition use: both records, both guides and assistant detail.
- Calgary old prices and Edmonton old timing: data and guides; timing also appears as “verified” assistant detail.

Static guides do not display the per-benefit verification date that About/Updates says guides show. Link-health reachability and byte-for-byte generation do not establish factual correctness.

## 10. Accessibility conformance observations

WCAG 2.2 AA is the technical benchmark, not a legal finding. Automated coverage is insufficient to make a conformance claim.

| Area | Observation |
|---|---|
| Keyboard | Core controls are native buttons/links, but wizard rerenders destroy focus; dialog and route focus are incomplete. Full manual journey not performed. |
| Name/role/state | Critical wizard selected state and grouping fail the source review; accessibility toggles themselves correctly use `aria-pressed`. |
| Focus order/visible focus | DOM order is generally logical. Select/text controls use outline suppression and need forced visual verification on every theme/background. |
| Landmarks/headings | Main and header exist; no skip link; wizard/results lack page `h1`; route titles do not change. |
| Dynamic status | Final assistant reply has a targeted live region and streamed deltas use `textContent`, both positive. Whole-main live region is excessive; feedback errors lack association/status. |
| Zoom/reflow | Responsive CSS exists, but 200%, 400%, 320px and landscape were not measured; status is manual validation required. |
| Contrast | Code comments and palette work show deliberate contrast tuning, but every actual composite/semantic tint was not measured in all three themes. No claim of AA pass. |
| Motion | In-app no-motion is broad and fail-visible motion architecture is positive. OS reduced motion misses some card/panel motion. |
| Forced colours | No dedicated forced-colours rules found; actual Windows High Contrast session required. |
| Touch | Many controls appear generously padded, but WCAG 2.2 target-size/spacing was not measured across mobile layouts. |
| Read aloud | Uses browser speech and highlights text; interruption/pronunciation/focus and route-change behavior require real testing. |
| Hidden content | Explicit `[hidden]` rules exist for components that set display, a positive known-failure control. Dialog state still needs AT inspection. |
| Print | Print CSS exists; zero/one/many results, long guides, URLs, stale/interaction warnings and page breaks were not visually verified. |
| Cognitive | Short questions, uncertainty help, saved progress and no timeouts are positives. Auto-advance, undefined “ready,” dense result sets, focus loss and mixed partial French increase memory/cognitive burden. |

Required disabled-user study: people using screen readers, magnification, switch/voice input, reduced motion, cognitive supports, and users experiencing pain/fatigue/financial stress. Test comprehension of status labels, recovery after mistakes, trust in amounts, and ability to complete/return without assistance.

## 11. Security and privacy assessment

### Confirmed vulnerabilities

- **SEC-01:** plaintext application/no HSTS.
- **SEC-02:** unnecessary wildcard cross-origin API invocation. It is an abuse/quota issue, not authenticated CSRF.
- **SEC-05:** local self-markup injection through unescaped postal attribute. Impact is low; no stored/remote XSS or model-output XSS was found.

### Likely issue requiring isolated validation

- **SEC-03:** CR/LF can reach the email subject in the local binding mock; Cloudflare's final sanitation was not tested. Do not characterize Bcc injection as confirmed.

### Defence-in-depth improvements

- Apply app-level request-size rejection before JSON parsing where possible.
- Restrict origins, explicitly handle binding failures, add request/stream timeouts, and test AI quota exhaustion.
- Remove analytics scripts/CSP exceptions under the current privacy decision.

### Positive controls

- Assistant output, including streamed tokens, is inserted with `textContent`, never HTML.
- Message roles/count/content and feedback length/email are constrained; numeric streaming tokens use explicit null/undefined checks.
- No user-controlled SSRF path was found: link monitor URLs are generated from trusted catalogue sources.
- Questionnaire answers, assistant history and postal text were not found in application URLs or explicit logging. Postal/map text goes to Google Maps only after a user-initiated link.
- Raw IndexedDB use is isolated; allowlist/catalog validation, optimistic revisions and metadata-only tombstones defend against stale resurrection.
- `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, referrer policy and permissions policy are present on the main site; embed is intentionally isolated.
- Root documentation, config, tests and scripts returned 404 in production; only `public/` is deployed.
- No credential, secret or arbitrary-recipient email path was found in the repository. The pinned destination limits feedback abuse impact.
- No source maps, tracked environment/key files, debug bundles or obvious secrets were found in `public/`; however, the unused parked jurisdiction file is deployed (DEPLOY-01).
- `npm audit --omit=dev` found no production vulnerability. The one current advisory path is in the Wrangler/Miniflare `sharp` development stack and is not reachable through an AbilityFinder untrusted-image feature (SUPPLY-01).

Privacy conclusion: the implemented local-answer model is strong, but active analytics is a direct policy inconsistency. No evidence showed questionnaire answers being transmitted by the application. External analytics JavaScript technically executes with page origin context, and guide URLs can reveal program interest; remove it to restore the promised boundary.

## 12. UI/UX, plain language and cognitive accessibility

### What works

- The opening page explains the local-storage concept, offers browse and guided paths, and uses concrete calls to action.
- The questionnaire uses respectful functional-impact examples rather than diagnosis as eligibility proof.
- Help notes appear before difficult choices, saved progress reduces accidental loss, and users can revise answers.
- Guides contain action steps, documents, timing, phone/source links and practitioner help rather than merely listing programs.
- Failure copy generally avoids blaming the user.

### Main problems

- “Every benefit you're owed,” “all,” “qualify,” and “ready” can be read as a complete official determination. The catalogue is known to be incomplete and the engine intentionally approximates.
- Hardcoded homepage figures create an anchoring effect before the user understands conditional/non-cash values.
- Auto-advance moves users before they can confirm a choice; rerender/focus loss makes correction harder for fatigue, memory and motor limitations.
- No-result copy exists but is unreachable in completed states. That hides whether the product has a compassionate, actionable true-zero-result experience.
- Important interaction warnings and the distinction between cash, tax reduction, coverage, discounts and savings can be buried beneath totals.
- Partial French is exposed while much content/data remains English. A mixed-language critical journey should be labelled incomplete or withheld until it is coherent.
- Static guide privacy links misdirect, and assistant cap/network failures do not offer an obvious recovery action.

Plain-language recommendation: replace verdict-like labels with “strong match,” “one detail to check,” and “does not match the answers you gave,” followed immediately by “This is not a government decision.” Test those exact concepts with users rather than assuming they work.

## 13. Reliability, resilience and limits

| Limit/failure | Current behavior | Risk/action |
|---|---|---|
| Workers AI daily free allocation | AI calls fail after the free allocation; app returns a generic busy message | Correct zero-spend behavior; add clear retry/later guidance and quota-specific test without enabling paid overage |
| Per-IP rate limit | 8/minute; missing/throwing binding produces generic failure | Handle explicitly and keep fail behavior protective of shared quota |
| Assistant 20-message cap | Permanent failure after ten completed exchanges | Add reset/rolloff and test |
| Stalled API/stream | No client timeout/cancel | Add connection/inactivity timers and abort |
| Feedback email failure | Honest error and mail-app alternative | Positive; test binding exception without sending real mail |
| KV/link monitor | Partial rotating report; up to ~48h full sweep; body soft 404s missed | Improve detection, full-sweep freshness and binding handling |
| Static asset failure | `renderSafely` only helps after JS loads; missing app/data JS cannot invoke it | Add no-JS/static fallback and asset-failure production smoke; retain cache-version discipline |
| Render exception | Error card rather than blank; reload action currently CSP-blocked | Wire both recovery controls and inject failures in tests |
| IndexedDB unavailable | Existing test shows graceful in-memory operation | Add delayed, corrupt, quota, blocked-upgrade and clear-race cases |
| Multi-tab stale write | Revision/tombstone tests pass | Add simultaneous clear/edit/reload E2E and removed-catalog migration |
| Offline/connection loss | Static shell may cache at browser/edge, but no explicit offline experience | Do not add complex PWA state casually; provide honest retry and preserve local answers |
| Calendar | Escaping/folding code exists; all-day date uses UTC components for a local marked date | Fix/test local evening UTC rollover, DST, Unicode, commas/semicolons/newlines, long wait strings and imports (CAL-01) |
| Print | Dedicated CSS exists | Visually inspect long/many/zero result reports and ensure sources/warnings remain present |
| Edge/API routing | SEA curl correct; in-app browser repeatedly saw static 404 | Multi-region/client validation with CF-Ray and deployment smoke |

Cloudflare Free constraints remain feasible: static assets, KV, cron, rate limit, Email Service to a verified destination and Workers AI are configured without a paid third-party API. Current Cloudflare documentation should be rechecked before any plan/binding change. Do not enable paid AI overage, analytics, or remote questionnaire storage as a reliability shortcut.

## 14. Test-suite gaps

1. No maintained exhaustive/equivalence evaluator suite or per-benefit witness matrix.
2. No Worker-backed E2E for APIs, SSE parsing, CSP/headers, static fallthrough, binding errors or quota.
3. Chromium only; no Firefox/WebKit/mobile projects.
4. No axe integration; more importantly, no real keyboard/AT/zoom/forced-colours evidence.
5. No history back/forward assertions across all routes or route-title/focus assertions.
6. No injected render exception under production CSP.
7. No print/calendar current tests.
8. No assistant 20-message/reset, truncated SSE, numeric zero token, cancellation or follow-up grounding suite.
9. No feedback header-control, stalled request, cross-origin or isolated email-binding test.
10. No IDB corruption, delay, quota, blocked upgrade, BFCache, simultaneous clear/edit or catalogue-removal matrix.
11. No offline/failed asset/slow network tests.
12. No link-monitor 200 body soft-404 fixtures or full-sweep-age alarm.
13. Fixed waits make E2E slower and can be flaky; use state/event waits.
14. Online audit found one development-toolchain advisory path; keep current lockfile advisory review in CI and distinguish production reachability from npm's node count.

## 15. Documentation-versus-code inconsistencies

- `HANDOFF.md` predates BC launch and says jurisdictions are parked/not loaded; `public/app.js` enables BC and catalogue/guides contain BC programs.
- `BC-EXPANSION-HANDOFF.md` says to delete it when BC is live, says `BC_ENABLED=false`, and characterizes BC facts as verified; source has BC enabled and this audit found current BC corrections/manual items.
- AGENTS/DEPLOY/ARCHIVAL/README say no analytics and self-only CSP; production/source explicitly load and allow Cloudflare Web Analytics, while privacy copy was changed to disclose it.
- Assistant prompt says Alberta/federal only; application and grounding include BC.
- Generated context comment says figures are redacted; always-sent summaries contain numeric facts.
- Link-monitor comments describe 43 links and a ~15-hour sweep; generated catalogue has 151 links and 16 batches, up to ~48 hours.
- About/Updates imply guides show verification dates; static guides do not.
- Data header/value comments broadly say 2025–2026/verified July 2026 while actual date ownership is fragmented and several checked facts are stale.
- `public/data-provinces-later.js` remains a deployed, directly fetchable parked-data file even though it is unused and duplicates stale jurisdiction content.

## 16. Suggested additions: value, cost and risk

ROADMAP was reviewed before recommending additions.

| Addition | Value | Build/maintenance cost | Privacy/accessibility/data risk |
|---|---|---|---|
| Per-benefit verification ledger and expiry queue | Highest; prevents silent data decay | Moderate recurring research | No new user data; make reviewer UI/file accessible; reduces incorrect-guidance risk |
| Evaluator witness generator/property tests | High; catches false-ready/false-no | Moderate initial, low recurring | No privacy change; improves consistent AT experience indirectly |
| Production contract smoke from two vantage points | High reliability/security | Low/moderate | No analytics needed; log only endpoint/status/CF-Ray, never user data |
| Native wizard choice groups/focus framework | High access and completion | Moderate | Strong accessibility gain; no privacy/cost impact |
| Link monitor bounded body/title classifier | Medium/high integrity | Moderate; ongoing false-positive tuning | No user data; stays within subrequest/CPU limits if bounded |
| Candidate catalogue additions in DATA-12 | Potentially high user value | High recurring official research | No privacy change if declarative; each new program increases stale-guidance risk |
| User-tested status terminology | High comprehension | Moderate study cost, no production spend | Must include disabled users; reduces false-official-verdict risk |

Not recommended: accounts/sync, analytics, advertising, community reviews, CMS, unrestricted diagnosis-to-benefit AI, email reminders or SMS reminders. They conflict with privacy/zero-spend/maintenance decisions and do not address the primary data-decay risk. Safer alternatives are local state, printable/calendar exports, static declarative data and owner-reviewed source ledgers.

## 17. Prioritized remediation roadmap

### Immediate — before release

- Every High/P1 matcher group: DATA-25/28/30/33/35–44/47–51 and ABFED-01–06, using the exact ledger source and negative witnesses.
- DATA-01, DATA-02, DATA-03, DATA-05, DATA-06 and DATA-14 are corrected locally and await final release-candidate review/deployment; closed/intake records ABFED-16/17 and BC-BC-05/09 remain open.
- AI-01, SEC-01 and A11Y-01.
- Re-run generators only after source records are corrected; inspect every propagated diff.
- Resolve PRIV-01 under the current no-analytics instruction.
- Reconcile every affected app/detail/print/static-guide/context surface and keep unresolved ledger rows visibly unverified.

### Short term — next iteration

- DATA-08, DATA-10, DATA-46, ABFED-07/08/09/A01 and BC-BC-02/06/12/14–17.
- AI-02, A11Y-02, REL-01, SEC-02, UX-02, TEST-01 and REL-06 validation.
- Worker-backed/cross-browser tests, route focus/title, assistant reset/timeouts and binding failures.
- Resolve ambiguous/manual program-owner questions and convert the audit ledgers into an owned review workflow.

### Medium term

- AQ-04, SEC-03, REL-02/03/04, A11Y-03, TEST-02, DATA-09/11.
- Disabled-user study, print/calendar/forced-colours/zoom validation.
- One authoritative freshness schema and operational link-health alerting without analytics.

### Backlog

- Candidate program expansion (DATA-12) only after official research and maintenance ownership.
- Low findings A11Y-05, REL-05, DATA-07/15, AQ-03, UX-01, SEC-04/05 and documentation cleanup.

## 18. Proposed regression plan for every P1/P2

| Finding(s) | Required regression evidence |
|---|---|
| DATA-25/28/30/33/35–44/47–51; ABFED-01–09; BC-BC-02/05/06/09/12/14–17 | Per-program official-rule decision table with ready/almost/no/unknown and jurisdiction-negative witnesses; card/detail/print equality; clean, restored and failure runs |
| DATA-01/03/05/06/07/08/09/11/14 | Exact official-source fixture + app card/detail/print/static-guide/generated-context equality; date cannot advance automatically |
| DATA-02 | Full CRA impairment × practitioner allow/deny matrix; multi-limitation path |
| DATA-04/13, AQ-04 | Per-program ready/almost/no witnesses; unknown; cross-province and stale state; no surrogate facts |
| DATA-10/15/16 | Schema-level source/date/claim ledger; missing or stale states visible; every directory record validated |
| AI-01/02 | Generator prohibited-number scan; Alberta/BC/federal/unsupported scope; adversarial amount/verdict/form prompts; numeric token and SSE fragmentation |
| SEC-01 | HTTP root/guide/asset/API 301/308; HTTPS HSTS and no mixed content |
| PRIV-01 | Network/CSP test on app and every generated guide; zero analytics requests |
| SEC-02/03/04 | hostile-origin rejection; same-origin success; CR/LF/control allowlist; oversized/chunked body; isolated email mock |
| A11Y-01/02/03/05 | role/name/state, focus persistence/transition, title/h1, live-region scope, skip link, dialog/error, reduced motion; automated plus AT/manual |
| REL-01 | body/title soft 404, localized indicators, false positives, redirects, timeout, partial/full sweep and stale report |
| REL-02/03/04/05/06 | message cap/reset, stalled fetch/SSE cancel, missing/throwing bindings, injected render error under CSP, multi-vantage API smoke |
| TEST-01/02 | generated predicate/witness suite; Wrangler-backed Chromium/Firefox/WebKit/mobile projects; no fixed sleeps |
| UX-02 | comprehension study for completeness/status/value language; consistent example with no guarantee inference |
| DATA-12 | For each accepted addition: official claim ledger, source owner, negative eligibility paths, guide/print/context generation and annual review owner |

Every P1 path should be run three ways: clean profile, valid persisted restore, and injected failure/interruption. Every reproduced failure should be rerun after the fix and once in the independent release-candidate pass.

## 19. Required external/manual work

- **Real disabled-user study:** keyboard/switch/voice, VoiceOver/NVDA/TalkBack, magnification, reduced motion, cognitive fatigue, pain and financial stress.
- **Accessibility specialist/manual:** 200% text, 400% zoom/reflow, 320px portrait/landscape, forced colours, touch targets, print and read-aloud.
- **Government/program clarification:** Medicine Hat $630/$635; Alberta AISH/ADAP/CDB operational treatment after July 2026; any source conflicts discovered in the remaining ledger.
- **Legal review:** only before claims about statutory entitlement, legal compliance, appeal rights or privacy-law compliance. None are asserted here.
- **Production-only validation:** HTTP redirect/HSTS after dashboard change; multi-region API/static routing with CF-Ray; AI quota exhaustion; Cloudflare EmailMessage header sanitation using a non-delivery environment; edge-injected analytics disabled.
- **Dependency/toolchain:** confirm a Wrangler/Miniflare release carrying `sharp >=0.35.0`; do not process untrusted images or follow npm's rollback suggestion in the meantime.
- **Performance:** repeat Lighthouse on slow-device/network profiles and obtain field Core Web Vitals without adding analytics; INP remains unmeasured.

## 20. Independent regression/consistency pass

- Clean/full E2E after the third remediation batch: 32/32 passed in Chromium.
- All persona/view persisted reload cases in the suite passed.
- 250,000-state evaluator run was deterministic with zero exceptions.
- Generated context, links, guides and sitemap reproduced byte-for-byte.
- Production HTTP/no-HSTS was repeated and remained reproducible.
- Production API curl contracts were repeated and worked at SEA; contradictory in-app 404 was repeated with a cache-busting query and remains unresolved, so REL-06 is not dismissed as an artifact.
- Production analytics scripts were observed again (two beacon script URLs).
- Local postal self-markup was reproduced once through the visible UI and independently confirmed from the renderer; it still needs a post-fix rerun.
- Confirmed data discrepancies were checked across their propagated app/guide/context surfaces.

The original audit was read-only. Post-audit remediation batches were independently rerun through focused tests, the complete 32-test Chromium suite, static invariants, the 250,000-model evaluator and Worker packaging. Nothing was committed, pushed or deployed.

## Top 10 actions with the greatest reduction in user harm

1. Replace every false-ready matcher witness with asked, exact official criteria or an explicit unknown/check status.
2. Correct DTC universal readiness, value semantics, signer matrix and unsupported gateway priority together.
3. Correct all current High/P1 program facts and procedures, beginning with BC Bus Pass, CDB/AISH and Autism Funding.
4. Add reviewed BC structured values or suppress incomplete totals/priority; prevent double counting of alternatives and transitions.
5. Correct cross-jurisdiction actions and municipal/geographic/recipient routes.
6. Strip numeric facts from assistant grounding, correct BC scope and add adversarial/stream-failure contracts.
7. Give wizard choices programmatic state, remove the whole-app live region and manage focus on every transition.
8. Enforce HTTPS with reviewed HSTS and restore the documented no-analytics/CSP boundary.
9. Replace unverifiable freshness with the claim ledgers, explicit owners and expiry/review queues.
10. Replace verdict/completeness/priority marketing with explained, tested non-official match language and actionable recovery.

## Quick wins without privacy-model or production-cost change

- Remove Web Analytics beacon/CSP exceptions and disable edge injection.
- Fix stale BC assistant scope text.
- Bind the render-error reload button without inline JavaScript.
- Fix static-guide privacy links.
- Persist or intentionally reset the non-sensitive BC browse enum.
- Validate province/city as one pair.
- Allowlist feedback kinds and reject control characters.
- Add an assistant “new conversation” action and client timeout/cancel.
- Render record-specific organization verification dates.
- Add a skip link, route-specific `document.title`, page `h1`, and targeted status region.
- Include the visible `EN`/`FR` token in the language control's accessible name.
- Move `data-provinces-later.js` outside `public/` and assert it is not deployed.
- Update link-monitor catalogue timing comments and display full-sweep age.
- Replace fixed E2E sleeps with state-based waits.

## Final recommendation

**NO-GO for the next release.** The existing production site has valuable safeguards and is not assessed as wholly unusable, but its current high-impact factual, matcher, assistant-safety, transport-security and critical-journey accessibility defects are incompatible with the intended high-stakes promise. Correct and independently retest all 23 High/P1 finding groups, resolve linked Medium/P1 data/intake issues, restore the documented privacy boundary, and establish that every unresolved ledger row is either corrected or visibly qualified before release.

After those conditions pass, a release candidate can move to a conditional go only after keyboard/AT/manual reflow validation and a clean production smoke. Broader claims that AbilityFinder contains “all” benefits or determines qualification should remain out of scope even after the defects are fixed.

Owner decision requested: choose the first correction group—**(1) matcher/eligibility safety, (2) incorrect/outdated benefit facts, (3) accessibility critical journey, or (4) security/privacy/reliability**—and fixes can begin in that order without changing the privacy model or production cost.
