# List-shaped prose audit + content-model report (ticket #196)

**Agent:** claude · **Date:** 2026-09-02 · **Status:** audit complete, for review

> This is the "check first and report before mass-editing" deliverable that
> Scope step 3 of #196 requires. It reports (1) which benefit pages have prose
> that is semantically a list/table/steps, (2) whether the content model/renderer
> can express those structures today, and (3) a verified before/after for the
> CDCP page as proof. **No production benefit record was edited by this session.**

---

## 1. Methodology

> **Correction (2026-09-02).** An earlier version of this audit reported 79
> benefit records / 12 requiresNote, derived by `grep` over `public/data.js`.
> That undercounted badly — `grep` missed records whose fields don't sit on a
> matching line (notably the entire B.C. block). Re-run **programmatically** by
> evaluating `public/data.js` in a `vm` context (the same way the test suite
> loads it), the real figures are **102 benefit records** and **61 with
> `requiresNote`**. All numbers below are the corrected, node-evaluated counts.

Evaluated all **102 benefit records** in `public/data.js` for list/table/step
signals: enumerators ("First, Second, Third, Fourth", "all N requirements"),
coordinated conditions ("either…or", "both…and", comma/semicolon series),
multiple sentences/clauses joined by and/or, numeric tiers (income bands,
percentages, `$NN,000` thresholds), and sequential instructions. Cross-checked
how each carrier field renders in `renderGuideBody()` (`public/app.js`; the
function's exact line shifts between branches).

## 2. How each content field renders TODAY (capability baseline)

| Field | Renders as | List-capable today? |
|---|---|---|
| `detail.steps` | ordered list via `listBlock(...)` (`renderGuideBody`, ~`app.js:4610` on `main`; `listBlock` defined ~`4421`) | **Yes** — already a real list |
| `detail.documents` | bulleted list via `listBlock` (~`app.js:4611`) | **Yes** |
| `detail.tips` | bulleted list via `listBlock` (~`app.js:4612`) | **Yes** |
| `requiresNote` (eligibility) | **single `<p class="detail-about">`** (~`app.js:4602`) | **No** — prose only |
| `amount` (value / tiers) | prose value via `valueParts` → `detail-amount` (~`app.js:4553`) | **No** — no table |

*(Line numbers are for the current `main`; they shift between branches — trust the
function names. The behaviour was independently confirmed by the Codex review.)*
| `note` / `taxNote` | single-paragraph callout | prose (usually fine) |

**Verdict: PARTIAL support.** Steps/documents/tips are already structured and
need no schema change. **Eligibility and amount-tiers are the gap** — they are
the two places where genuinely list/table-shaped facts are rendered as prose,
and they cannot be fixed by editing copy alone. This is the schema blocker the
ticket asked us to find *before* mass-editing.

## 3. Findings — eligibility prose that is semantically a list

**61 records use `requiresNote`; ~55 are multi-condition ALL/ANY lists** rendered
as one paragraph (node-evaluated, up from the earlier grep undercount of ~10).
The scope is therefore **site-wide across federal, Alberta, and the full B.C.
catalogue** — not a handful of pages. A representative sample of the primary
conversion targets:

| Benefit id | Shape | Lead-in should be |
|---|---|---|
| `canadian-dental-care-plan` | 4 discrete requirements ("First…Fourth") | **ALL** of these |
| `dres` | 5 conditions (age, residence, work eligibility, citizenship, employed/…) | **ALL** of these |
| `ab-capcc` | adult <65 **and** in type A/B care home **and** able to participate **and** communicate | **ALL** of these |
| `cpp-childrens-benefit` | parent receiving CPP-D **and** child under 18 (or 18–25 in study) | **ALL** (with a sub-condition) |
| `excise-gasoline-tax-refund` | permanent mobility impairment **and** unable to use transit **and** practitioner certifies | **ALL** of these |
| `home-accessibility-tax-credit` | DTC-eligible **or** 65+ | **ANY** of these |
| `multigenerational-home-renovation-tax-credit` | qualifying individual: 65+ **or** DTC-eligible | **ANY** of these |
| `ab-service-dog-id-card` | passed approved assessment **or** ADI-accredited **or** qualified by org | **ANY** of these |
| `ab-special-needs-housing` | list of qualifying groups (developmental, physical, family-violence, wards…) | one **of** these groups |
| `canada-caregiver-credit` | supporting spouse **or** dependant with impairment | context-dependent |

`medical-expense-tax-credit` and `disability-supports-deduction` are borderline —
they reference line numbers/statutory wording; keep as prose or convert lightly.
**Do not over-fragment.**

The ALL-vs-ANY distinction *changes the meaning*, so it must be an explicit
lead-in on every converted list — not left implicit.

## 4. Findings — amounts/tiers that are semantically a table

- **~39** `amount` strings carry multiple tiers/ranges (percentages, `$NN,000`
  bands, dashes) — again larger than the earlier grep estimate. **CDCP** is the
  clearest table: three income bands × (plan covers / you pay).
- **18** municipal `amount` strings are "transit + recreation" combos
  (e.g. `medicinehat-fair-entry`: "75% off transit (up to $630/yr) + $200/yr
  recreation & arts"). These are 2-part facts better shown as a small list or
  mini-table than a run-on string.
- Overlap with the tiered set above keeps the realistic **table/mini-table
  candidate set in the low-to-mid tens**.

## 5. Scale estimate (corrected)

Of **102 benefits**: **~55 eligibility-list conversions + ~39 amount
table/mini-table conversions**, with overlap → on the order of **60–70 benefit
records** touched by the full site-wide fix. This is materially larger than the
first grep-based estimate (~25–30) and reinforces the core conclusion: at this
volume the conversions must be driven by a **structured schema**, not hand-edited
prose — a per-record manual rewrite of 60+ records is both error-prone and
exactly where verbatim-accuracy mistakes creep in. The dense
"First…Second…Third…Fourth" wall is still rare (CDCP is the clearest), but
multi-condition eligibility prose is the norm, not the exception.

## 6. Schema recommendation (the change that must land before mass edits)

Add optional structured fields; keep prose fields as fallback so nothing breaks:

```js
// eligibility as a list (drives #197's template too)
eligibility: { mode: "all" | "any", items: ["…", "…"] }   // replaces requiresNote prose
amountTiers: [ { band: "Under $70,000", covers: "100%", youPay: "0%" }, … ]  // optional
```

Renderer additions in `renderGuideBody()`:
- If `b.eligibility`, render the lead-in ("You must meet **all** of these" /
  "You qualify if **any** apply") + a `<ul>` instead of the `requiresNote` `<p>`.
  Fall back to `requiresNote` when `eligibility` is absent.
- If `b.amountTiers`, render a `<table>` under the headline amount.
Both are small, additive, and independently testable. Steps/docs/tips unchanged.

## 7. Proof conversion — CDCP (verbatim, before → after)

**BEFORE** (`requiresNote`, one paragraph):
> "You must meet all four requirements. First, you have no access to private
> dental insurance or coverage, including a health spending account that covers
> dental costs. The only exception is if you retired and opted out of dental
> coverage through your pension plan before December 11, 2023 and cannot opt back
> in. Second, you and your spouse or common-law partner have filed your Canadian
> tax returns for the previous year. Third, your adjusted family net income is
> less than $90,000. Fourth, you are a Canadian resident. …"

**AFTER** — `eligibility` (mode: **all**), verbatim facts preserved:
- No access to private dental insurance or coverage (including a health spending
  account that covers dental costs). *Exception:* you retired and opted out of
  dental coverage through your pension plan before **December 11, 2023** and
  cannot opt back in.
- You and your spouse/common-law partner filed your Canadian tax returns for the
  previous year.
- Your adjusted family net income is **less than $90,000**.
- You are a Canadian resident.
- *(Check:* code **1** in the dental box on your T4/T4A means no access; **2, 3,
  4 or 5** means you have some coverage.*)*

**AFTER** — `amountTiers` (figures verbatim from the record; the "You pay" column
uses the record's own wording, not a derived percentage):

| Family income | Plan covers | You pay |
|---|---|---|
| under $70,000 | 100% | none of those fees |
| $70,000 to $79,999 | 60% | 40% |
| $80,000 to $89,999 | 40% | 60% |

**Honesty note (per review).** This AFTER state is a **meaning-preserving
editorial rewrite**, *not* a character-for-character copy: every dollar amount,
income threshold, percentage, date, and the T4/T4A dental-code *meaning* is
preserved, but sentence wording is adapted for the list format (e.g. the "First,
… Second, …" scaffolding is dropped). Where a value has no percentage in the
source ("you cover none of those fees"), the table shows that phrase rather than
inventing "0%". A live rendering of this AFTER state is in
`../197-info-density/prototypes/cdcp.html`.

## 8. Blocked-by-schema flag (per Deliverable)

**All eligibility-list and amount-table conversions are blocked on the §6 schema +
renderer change.** They cannot land as copy-only edits. Steps/documents/tips
conversions are NOT blocked (already structured). Recommended sequencing:

1. Land the additive `eligibility` / `amountTiers` schema + renderer branches
   (small PR, unit-tested, `npm run gen:context`, `?v` bump). ← unblocks everything
2. Convert records in reviewed batches by level (federal → provincial → municipal),
   each batch verifying verbatim accuracy, EN/FR render, light/dark, mobile.
3. Adopt #197's template once the structured fields exist.

## 9. Why nothing was pushed to production this session
Site-wide benefit-content edits touch the live site, and `git push origin main`
deploys (Workers Builds). Production deploy is human-gated (TASKVIEW-WORKFLOW §
Human-only gates) and this ticket explicitly says *report before mass-editing*.
So this session delivers the audit + schema recommendation + verified CDCP proof,
and leaves the schema PR and the batch conversions for review/approval. Ticket
moves to **Review**, not Done.
