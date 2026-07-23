# Supplemental Alberta/federal associated-field review

Access date: **2026-07-22**
CSV: `/tmp/abilityfinder-audit/remaining-ab-federal-associated-claims.csv`
Scope: every leaf under `BENEFIT_VALUES`, `BENEFIT_META`, `BENEFIT_EXTRA`, and `BENEFIT_SIGNERS` for the same 18 remaining Alberta/federal `BENEFITS` IDs. No repository files were changed.

## Counts

| Associated object | Records represented | Leaf claims |
|---|---:|---:|
| `BENEFIT_VALUES` | 18 | 37 |
| `BENEFIT_META` | 18 | 54 |
| `BENEFIT_EXTRA` | 4 | 11 |
| `BENEFIT_SIGNERS` | 1 | 7 |
| **Total** | **18 unique benefit IDs** | **109** |

Per-record reconciliation:

| Record | Claims | Record | Claims |
|---|---:|---|---:|
| `cwb-disability` | 8 | `pdd` | 5 |
| `fscd` | 5 | `dres` | 7 |
| `ab-grant-disability` | 5 | `adult-health-benefit` | 8 |
| `child-health-benefit` | 5 | `parking-placard` | 16 |
| Each of the 10 municipal/fallback records | 5 each | **Municipal subtotal** | 50 |

Status totals: **40 verified**, **18 ambiguous/partial**, **10 unsupported**, **1 outdated**, and **40 manual follow-up required**. The large manual group is intentional: 18 `kind` classifications and 18 `difficulty` scores are internal product judgements, not government facts, and four FAQ-question/relationship items also require editorial validation.

## New findings from associated fields

### ABFED-A01 — Unsourced Adult Health value is rendered as a factual headline

- Severity/Priority/Confidence/Type: **Medium / P1 / Confirmed / Data accuracy + UX**
- Evidence: `public/data.js:131` says “free prescriptions, dental & optical — often $1,000+/yr.” For `coverage`, `valueParts()` uses this note as the result/detail headline (`public/app.js:429-445`) and does not add the “Est. value” marker reserved for cash/tax/grant (`public/app.js:450-451,4014-4016`). The official Adult Health page publishes eligible benefit categories, not a typical `$1,000+` annual value: https://www.alberta.ca/alberta-adult-health-benefit
- Harm: a financially stressed user may read an unsupported estimate as a normal or guaranteed amount; “free” also hides eligible-service schedules and other-plan-first rules.
- Correction: remove the `$1,000+/yr` estimate unless a current, directly supporting official methodology exists; describe eligible coverage and limitations instead.
- Regression: assert no unsourced currency value appears for non-cash coverage; require an estimate label/source/method for every rendered estimate.

### ABFED-A02 — Unvalidated taxonomy/difficulty scores control priority ordering

- Severity/Priority/Confidence/Type: **Medium / P2 / Confirmed / UX + Maintainability**
- Evidence: all 18 selected records have `BENEFIT_VALUES.kind` and `BENEFIT_META.difficulty` judgements (`public/data.js:115-152,182-213`). Difficulty is rendered as Easy/Medium/Hard (`public/app.js:456-470`) and directly changes `priorityScore`; `kind` adds value weight to services/coverage and decides inclusion in monetary totals (`public/app.js:473-484,487-520`). No rubric, empirical timing data, disabled-user validation, or explanation of ranking was found.
- Harm: arbitrary “ease” and type weights can reorder application priorities, even though the product presents the ranking as an action plan.
- Correction: document a reproducible rubric, separate published facts from editorial ranking factors, explain ordering to users, and validate difficulty/cognitive effort with real disabled applicants. Until then, label these as editorial estimates rather than verified program data.
- Regression: deterministic scoring tests plus fixtures showing how each input affects rank; content test requiring an explanation wherever rank/priority appears.

### ABFED-A03 — Spruce Grove intake availability is displayed as a decision wait

- Severity/Priority/Confidence/Type: **Low / P2 / Confirmed / UX**
- Evidence: `public/data.js:206` stores `wait: "Apply year-round"`. The UI labels it “Wait” on cards (`public/app.js:462-470`) and “Wait for a decision” in guide facts (`public/app.js:4019-4025`). The official page supports year-round applications, but that is not a processing duration: https://www.sprucegrove.org/services/spruce-grove-transit/transit-fares/
- Correction: move year-round availability to a note/deadline field and use “not published — ask the City” for decision timing.
- Regression: schema/content test that rejects intake/deadline phrases in the processing-wait field.

### ABFED-A04 — “Works well with” relationships imply unsupported stacking

- Severity/Priority/Confidence/Type: **Medium / P2 / Confirmed / Data accuracy + UX**
- Evidence: `public/data.js:413-415` relates Adult Health to AISH/AADL; `public/data.js:423` relates DRES to the Alberta and federal student disability grants. Every `related` entry is rendered under the unqualified heading “Works well with” (`public/app.js:3967-3973`). Active AISH already includes health benefits, while Adult Health’s relevant AISH route is for people leaving AISH because of qualifying income. DRES explicitly excludes supports at Alberta K–12 and publicly funded Alberta post-secondary institutions, where school accommodations/funding apply: https://www.alberta.ca/alberta-adult-health-benefit and https://www.alberta.ca/disability-related-employment-supports
- Harm: users may infer simultaneous eligibility or stacking when the relationship is replacement, transition, alternative funding, or context-dependent.
- Correction: replace the generic relationship with typed relations such as prerequisite, alternative, transition-after, may-stack, or cannot-duplicate; source each interaction.
- Regression: relationship-schema tests and specific checks that Adult Health/AISH and DRES/student grants are not labelled unconditional stacking relationships.

### ABFED-A05 — Parking signer finder omits professions named by Alberta

- Severity/Priority/Confidence/Type: **Low / P2 / Confirmed / UX + Data accuracy**
- Evidence: every stored signer at `public/data.js:174` is supported, but Alberta’s current list also explicitly names `physician` and `physical therapist`: https://www.alberta.ca/get-parking-placard-people-disabilities. The stored list uses only `family doctor` for physician and does not include `physical therapist`. These values drive “find one near you” signer chips (`public/app.js:3269-3295`). The FAQ answer at `public/data.js:420` is also incomplete relative to the current page.
- Harm: safe omission is preferable to a false signer, but a user without a family doctor may miss another authorized practitioner route.
- Correction: map official terms carefully to practitioner-directory categories, determining whether `physical therapist` and `physiotherapist` must remain distinct for Alberta’s form/search experience; then include all verified authorized provider types without implying every clinic will complete the form.
- Regression: compare the signer list and FAQ against a reviewed official fixture; assert each displayed search chip is allowed and each official category is deliberately mapped or documented as omitted.

## Existing findings reinforced

- **ABFED-05:** `BENEFIT_META["ab-grant-disability"].effort` repeats the incorrect “Schedule 4 (once)” procedure.
- **ABFED-10:** Adult and Child Health both repeat the unsupported `wait: "a few weeks"` guidance.
- **ABFED-06:** Parking repeats unsupported “low-cost” and “often same day” claims.
- **ABFED-07:** DRES structured value repeats “training,” and its related chips imply student grants work alongside DRES without the official post-secondary exclusion.
- **ABFED-12:** Spruce Grove exact `$25/$50` prices are duplicated in `BENEFIT_VALUES` even though the current official page does not publish them.
- **ABFED-08:** `$843` is directly supported for the 2025 CWB disability supplement, but its inclusion in estimated totals inherits the main matcher’s missing statutory gates.

## Verification notes

- The CSV contains exactly **109 data rows plus one header**, with no missing source, access-date, status, or correction fields.
- All seven stored parking signers are directly supported; ABFED-A05 concerns completeness and terminology, not a false signer.
- `difficulty` and `kind` are marked manual rather than “unsupported official facts” because they are product taxonomies. Their user-facing/ranking effect is nevertheless material.
- No verification date should be advanced for a record based only on reviewing these companion objects; underlying official claims must be rechecked as a complete user-facing unit.
