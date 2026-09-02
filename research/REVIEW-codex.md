VERDICT: CHANGES-REQUESTED

## Findings

### 1. Blocker — CDCP invents a percentage despite the character-for-character requirement

**File + evidence:** `research/197-info-density/prototypes/cdcp.html:11` renders the first co-payment cell as `0%`. That character sequence does not occur anywhere in the `canadian-dental-care-plan` record. The source says, at `public/data.js:1515`, `you cover none of those fees`; its headline amount at `public/data.js:1502` gives only the plan-covered percentages. This also contradicts `TEMPLATE-SPEC.md:102-103`, which says figures are copied character-for-character.

**Required exact correction:** `0%` → `none of those fees` (or remove the derived percentage and redesign that cell without introducing a number not present in the record).

**Correction path:** Generate every CDCP amount/tier cell from exact source substrings, then assert that every dollar amount, income threshold, percentage, date, and the complete T4/T4A dental-code sentence in the prototype occurs character-for-character in the record. The other reviewed CDCP strings pass this narrow check: `$90,000`, `$70,000`, `$70,000 to $79,999`, `$80,000 to $89,999`, `100%`, `60%`, `40%`, `December 11, 2023`, and the sentence beginning `You can check the coverage question on your T4 or T4A:` match the record.

### 2. Major — AUDIT.md's “character-for-character” CDCP proof is demonstrably not verbatim

**File + evidence:** `research/196-list-audit/AUDIT.md:111-132` claims that the AFTER facts and figures are verbatim and “copied character-for-character,” but several displayed strings differ from `public/data.js:1509`:

- `No access to private dental insurance or coverage (including a health spending account that covers dental costs).` should preserve `First, you have no access to private dental insurance or coverage, including a health spending account that covers dental costs.`
- `You and your spouse/common-law partner filed your Canadian tax returns for the previous year.` should preserve `Second, you and your spouse or common-law partner have filed your Canadian tax returns for the previous year.`
- `You are a Canadian resident.` should preserve `Fourth, you are a Canadian resident.`
- `(Check: code 1 in the dental box on your T4/T4A means no access; 2, 3, 4 or 5 means you have some coverage.)` should preserve `You can check the coverage question on your T4 or T4A: code 1 in the dental box means you do not have access, while 2, 3, 4 or 5 means your work or pension plan offers some dental coverage for you or your family.`

The table also changes `under $70,000` (`public/data.js:1502,1515`) to `Under $70,000` (`AUDIT.md:127`) and introduces `0%` (`AUDIT.md:127`), which is absent from the source record.

**Correction path:** Either copy exact source sentences/substrings into the proof (including capitalization and T4/T4A wording) and replace `0%` as described in finding 1, or relabel the section honestly as a meaning-preserving editorial rewrite rather than a character-for-character conversion.

### 3. Major — All three “Current” prototypes falsely flatten fields that production already renders as lists

**File + evidence:** The Current columns render each step, document, and tip as a separate `<p>`: `cdcp.html:6`, `aish.html:2`, and `cwb-disability.html:2`. That is not a faithful reproduction of today's renderer. `public/app.js:4421-4428` makes `listBlock` emit `<ol>` or `<ul>`, and `renderGuideBody` calls it for steps, documents, and tips at `public/app.js:4610-4613`. This conflicts with the requirement for a “faithful reproduction of today's dense layout” (`TEMPLATE-SPEC.md:107-111`) and artificially makes Current look less structured.

The underlying audit claim is otherwise confirmed: `requiresNote` is emitted in a single `<p class="detail-about">` at `public/app.js:4602`; `amount` remains a prose value passed through `valueParts` and emitted in `detail-amount` / `detail-amount-sub` at `public/app.js:4553-4555`; and steps/documents/tips are lists at `public/app.js:4610-4613`. The line numbers quoted in `AUDIT.md:26-30` are stale, but the substance is correct.

**Correction path:** Rebuild every Current column from actual `renderGuideBody` semantics and order: about paragraph, note callout, requiresNote paragraph, prose amount section, ordered steps, unordered documents, and unordered tips. Keep the Proposed changes separate so the comparison measures the template rather than a fabricated baseline.

### 4. Major — AISH eligibility substitutes document labels for substantive rules

**File + evidence:** `research/197-info-density/prototypes/aish.html:2` labels `Proof of Alberta residency + Canadian citizenship / PR` and `Financial details (income and assets)` as ALL-of eligibility items. Those strings come from `detail.documents` (`public/data.js:1671-1672`), so they are not wholly invented, but they are evidence to submit, not the criteria encoded by the record. The record requires `adult`, `ab`, `citizenPR`, `aishMedical`, and `aishFinancial` (`public/data.js:1655`). In particular, `aishFinancial` says income is counted, combined non-exempt assets must be `at or under $100,000`, and the applicant must pursue other income (`public/app.js:464-468`). The proposed list omits that substantive financial rule while implying that having financial details itself establishes eligibility.

**Correction path:** Build eligibility from the five `requires` rule definitions (plus summary/about only where they restate those rules), not from `detail.documents`. Keep proof/document strings under “Documents you'll need.” Include the exact unresolved financial rule rather than implying that merely having financial details is sufficient.

### 5. Major — CWB's proposed eligibility omits most of the explicit rule

**File + evidence:** `research/197-info-density/prototypes/cwb-disability.html:2` reduces eligibility to `work and earn a lower income` and `approved for the DTC`. The record actually requires `dtc`, `working`, and `cwbEligibility` (`public/data.js:1198`). `cwbEligibility` contains residence, age/family, province-specific net-income, full-time-student, incarceration, and diplomat/tax-status conditions (`public/app.js:370-374`). Calling the two-item list “You must meet ALL of these” materially overstates completeness and undermines the claimed same-record comparison. No fabricated dollar figure was found in this file; it contains no dollar amount.

**Correction path:** Include the unresolved `cwbEligibility` text, or explicitly label the short list as a non-exhaustive summary with a visible instruction to confirm the remaining official CWB rules. Do not present it as the complete ALL-of list.

### 6. Major — Citation framing turns qualified guidance into unsupported mandates

**File + evidence:** `research/197-info-density/RESEARCH.md:52-64` correctly identifies WCAG 2.1 SC 3.1.5 as Level AAA and quotes fragments of the criterion, but then says the three-cell answer card is “exactly what 3.1.5 asks for.” That overstates the citation. SC 3.1.5 is conditional on text requiring reading ability above lower-secondary level and requires supplemental content or a version that does not require that advanced ability; the document does not measure the source text's reading level or demonstrate that a three-answer card is an adequate supplement/version for all complex rules.

Likewise, the Canada.ca section is labelled `[verbatim]`, but `RESEARCH.md:72` converts guidance framed as aiming for an **average** sentence length of 15–20 words into `keep sentences "under 15 to 20 words"`, and `RESEARCH.md:127-130` promotes that into an enforceable per-sentence target (`Sentences < 15–20 words`). A sentence cannot coherently be “under 15 to 20,” and this is stronger than the cited guidance.

**Correction path:** Describe the summary card as a design that may support SC 3.1.5 rather than automatic conformance, and document a reading-level evaluation if conformance is claimed. Quote the Canada.ca guidance exactly and preserve “average”/“aim” qualifiers; separate quotations from proposed lint thresholds. Mark mixed-summary sections as `[quoted and summarized]`, not globally `[verbatim]`.

### 7. Minor — The no-JS rationale incorrectly says native details become open

**File + evidence:** `TEMPLATE-SPEC.md:20-21` says native `<details>` elements “with no JS and no CSS ... render fully open,” and lines 121-123 repeat that rationale. Native `<details>` is interactive without JavaScript, but an element without the `open` attribute remains closed by default; disabling JavaScript or CSS does not make it open. The prototype details in `cdcp.html:14-16` and the corresponding markup in `aish.html:2` and `cwb-disability.html:2` have no `open` attribute, so they remain collapsed but natively keyboard-operable with JavaScript disabled.

The narrower accessibility checks otherwise pass: disclosures use native `<details>/<summary>`; no critical content is available only on hover (the only hover rule is a redundant link underline in `compare.html:2`); and every typed prototype callout has a visible text label (`Common mistake`, `Watch out`, or `Good to know`) rather than relying on colour alone.

**Correction path:** Replace “render fully open” with “remain operable without JavaScript.” If supporting content must be visible by default when scripting is unavailable, add `open` or use a progressive-enhancement pattern that starts from visible static content.
