VERDICT: APPROVED

Findings: 0

## Verbatim numeric-faithfulness review

- **victoria-life — PASS.** The seven `amountTiers.rows` values are **$29,640; $38,493; $47,145; $55,076; $62,464; $70,451; $78,436** for household sizes **1 person; 2; 3; 4; 5; 6; 7**. The unchanged `requiresNote` gives **$29,640; $38,493; $47,145; $55,076; $62,464; $70,451; $78,436** for **1 person; 2; 3; 4; 5; 6; 7**, respectively. Values, order, and size labels match exactly household-size by household-size. The `eligibility.items` faithfully preserve City of Victoria residence, a fixed address, residence for the previous 30 days, proof of residency, income at or below the applicable Statistics Canada threshold, and inclusion of all family members and dependants at the same address. No condition was invented or dropped.

- **kelowna-recreation-assistance — PASS.** The seven `amountTiers.rows` values are **$31,264; $38,922; $47,851; $58,096; $65,892; $74,315; $82,739** for family sizes **1; 2; 3; 4; 5; 6; 7**. The unchanged `requiresNote` gives **$31,264; $38,922; $47,851; $58,096; $65,892; $74,315; $82,739** for a **family of 1; 2; 3; 4; 5; 6; 7**, respectively. Values and order match exactly family-size by family-size; the table's `Family size` header makes each numeric row label the same “family of” size used by `requiresNote`. The checklist preserves Canadian citizenship or permanent residence, current full-time Kelowna residence, the after-tax LICO family-net-income test, and the complete who-qualifies clause covering both recipients of government financial assistance and people experiencing financial hardship who meet the guidelines. The eligibility note preserves the full exclusion list: post-secondary students (including the discounted-student-rate alternative), temporary residents and visitors including study- or work-permit holders, business-class/investor/entrepreneur immigrants, and people banned from City recreation facilities including Parkinson Recreation Centre and the Kelowna-area YMCAs. No condition was invented or dropped.

- **coquitlam-far — PASS.** The seven `amountTiers.rows` values are **$27,478; $34,206; $42,053; $51,058; $57,908; $65,313; $72,715** for household sizes **1 person; 2; 3; 4; 5; 6; 7 or more**. The unchanged `requiresNote` gives **$27,478; $34,206; $42,053; $51,058; $57,908; $65,313; $72,715** for **1 person; 2; 3; 4; 5; 6; 7 or more**, respectively. Values, order, and size labels—including **1 person** and **7 or more**—match exactly household-size by household-size. The checklist preserves Coquitlam residence and the 2025 Low Income Cut-off requirement. The eligibility note preserves the complete family definition: one or two married or common-law adults and their legal dependents aged 18 and younger. No condition was invented or dropped.

## Change-scope checks

- `git show HEAD -- public/data.js` / `git diff HEAD^ HEAD -- public/data.js` contains **62 additions and 0 deletions**.
- The additions consist only of the requested `eligibility` and `amountTiers` blocks for `victoria-life`, `kelowna-recreation-assistance`, and `coquitlam-far`.
- For all three records, both `requiresNote` and `amount` are unchanged; they appear only as surrounding context, with no deleted or replaced lines.
- No other record in `public/data.js` was touched.

## Tests

- `npm test`: **123 tests, 123 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo** (1 suite).
