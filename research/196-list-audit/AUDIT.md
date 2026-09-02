# List-shaped prose audit + content-model report (ticket #196)

**Agent:** claude · **Date:** 2026-09-02 · **Status:** audit complete, for review

> This is the "check first and report before mass-editing" deliverable that
> Scope step 3 of #196 requires. It reports (1) which benefit pages have prose
> that is semantically a list/table/steps, (2) whether the content model/renderer
> can express those structures today, and (3) a verified before/after for the
> CDCP page as proof. **No production benefit record was edited by this session.**

---

## 1. Methodology

Swept all **79 benefit records** in `public/data.js` for list/table/step signals:
enumerators ("First, Second, Third, Fourth", "all N requirements"), coordinated
conditions ("either…or", "both…and", comma/semicolon series), numeric tiers
(income bands, percentages, `$NN,000` thresholds), and sequential instructions.
Cross-checked how each carrier field renders in `renderGuideBody()`
(`public/app.js:4481`).

## 2. How each content field renders TODAY (capability baseline)

| Field | Renders as | List-capable today? |
|---|---|---|
| `detail.steps` | ordered list via `listBlock(...)` (`app.js:4575`) | **Yes** — already a real list |
| `detail.documents` | bulleted list via `listBlock` (`app.js:4577`) | **Yes** |
| `detail.tips` | bulleted list via `listBlock` (`app.js:4578`) | **Yes** |
| `requiresNote` (eligibility) | **single `<p>`** (`app.js:4567`) | **No** — prose only |
| `amount` (value / tiers) | single string in `valueSection` (`app.js:4520`) | **No** — no table |
| `note` / `taxNote` | single-paragraph callout | prose (usually fine) |

**Verdict: PARTIAL support.** Steps/documents/tips are already structured and
need no schema change. **Eligibility and amount-tiers are the gap** — they are
the two places where genuinely list/table-shaped facts are rendered as prose,
and they cannot be fixed by editing copy alone. This is the schema blocker the
ticket asked us to find *before* mass-editing.

## 3. Findings — eligibility prose that is semantically a list

12 records use `requiresNote`; **~10 are multi-condition ALL/ANY lists** rendered
as one paragraph. These are the primary conversion targets:

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

- **17** `amount` strings carry multiple tiers/ranges (percentages, `$NN,000`
  bands, dashes). **CDCP** is the clearest table: three income bands × (plan
  covers / you pay).
- **18** municipal `amount` strings are "transit + recreation" combos
  (e.g. `medicinehat-fair-entry`: "75% off transit (up to $630/yr) + $200/yr
  recreation & arts"). These are 2-part facts better shown as a small list or
  mini-table than a run-on string.
- Overlap makes the realistic **table/mini-table candidate set ≈ 20 records**.

## 5. Scale estimate

Of 79 benefits: **~10 eligibility-list conversions + ~20 amount table/mini-table
conversions**, some overlapping → **≈ 25–30 benefit records** would be touched by
the full site-wide fix. The egregious dense-enumeration pattern
("First…Second…Third…Fourth") is **rare — CDCP is the only true wall**; most cases
are 2–4 coordinated conditions or a tier string.

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

**AFTER** — `amountTiers` (verbatim from the record):

| Family income | Plan covers | You pay |
|---|---|---|
| Under $70,000 | 100% | 0% |
| $70,000 to $79,999 | 60% | 40% |
| $80,000 to $89,999 | 40% | 60% |

Every figure, threshold, date, and the T4/T4A code wording is copied
character-for-character. Meaning unchanged; only shape changes. A live rendering
of this AFTER state is in `../197-info-density/prototypes/cdcp.html`.

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
