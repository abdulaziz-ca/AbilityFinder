# Review (claude) - TaskView #216

Verdict: FINDINGS (no high severity; two mediums, three lows). Logic and text preservation are sound.

## 1. Sentence support
CDB aboutList (data.js ~2944):
- "can reduce the benefit, in some cases to zero": src1 "the benefit amount will start to decrease after your adjusted family net income reaches a certain threshold. If your adjusted family net income is considerably above that threshold, your benefit amount will be $0." Supported, hedge kept.
- "Service Canada calculates your payment from adjusted family net income": src1 says "Benefit amounts are based on your adjusted family net income" and uses "we"; it never names Service Canada. Carried verbatim from the old gate, not newly added. LOW.
- "Meeting the other conditions does not by itself mean you receive money": no sentence in src1 says this. It follows from "$0" and "will start to decrease", but it is an inference. Pre-existing, hedged. LOW.
- Lead equals the old `about`. "started July 2025", "aged 18-64" and "approved for the DTC" are not in src1 (eligibility page not supplied).

RDSP aboutList:
- Grant bullet: src3 "A beneficiary's RDSP can receive a grant on contributions made until December 31 of the year in which the beneficiary turns 49." The bullet says "only paid until"; the "only" is carried over from the old text and is not a source word. The grant is tied to contributions made by that date. LOW.
- Bond bullet: src3 "A bond can be paid into an RDSP until the year in which the beneficiary turns 49." The new bullet "follows the same deadline" equates it to "December 31 of the year" (the grant wording). The source words differ, so a same-day deadline is an inference. Carried over from the old sentence, not hardened by this diff. LOW.
- "Grants and bonds follow a different, earlier deadline than contributions": src3 49 vs src2 "Contributions are permitted until the end of the year in which the beneficiary turns 59". Supported.
- src3 also says carry-forward of unused entitlements must happen "Before the end of the year you turn 49", which is consistent.
- No dropped hedge, wrong number or wrong date was found in the moved text.

## 2. Preservation
Both aboutList blocks render in "More about" (app.js:5038-5044: `aboutListData` produces lead plus `<ul class="eligibility-list">` of every item). `about` is suppressed when aboutList is present, but the lead repeats it, so nothing is lost.

All three CDB sentences and all three RDSP sentences are present (the RDSP deadline sentence is split in two). Plus "Check which of the two windows applies to you."

MEDIUM, not preserved: each removed gate's `action` link is gone from the whole site.
- `.../canada-disability-benefit/amount.html` ("Estimate your benefit amount"): 0 hits in data.js, app.js or guides/cdb-adult.html.
- `.../canada-disability-savings-grant-canada-disability-savings-bond.html`: 0 hits in data.js or guides/rdsp.html.
- Only audit docs and the sources dir still contain them. The estimator is the main user benefit of that gate.
- Fix: add both as linked items on the records (a related-links or sources field if one exists), or as `<a>` text in the aboutList items. Check the renderer allows HTML in items.

## 3. Eligibility logic and oracle
- cdb-adult.requires keeps dtc, workingAge, cdbTaxFiling, cdbStatus. cdbTaxFiling and cdbStatus are external gates (never `met`), so the best case stays "almost".
- rdsp.requires keeps dtc, under60, rdspOpening, rdspContributionWindow. rdspOpening and rdspContributionWindow are external, so it stays "almost".
- Oracle diff: only the two GATES entries are deleted, the spec version goes to 1.16.0, and PROGRAM_BEST_CASE is untouched. No status moves, nothing is promoted to ready, and no persona excluded by the source gains eligibility.
- Removing the grant gate stops flagging 50-59 users with a failing requirement. The record `amount` ("Up to $3,500 grant + $1,000 bond per year") still displays for them. The age-49 limit is only in More about. This is accurate to the source but worth knowing. Not a status change.

## 4. Review-month bumps
- cdb-adult (2026-07 to 2026-10): facts checked in src1 are the $204.20 maximum, July 2026-June 2027, the 2025 tax return, reassessment each year and the income reduction. All match. Not checked: "started July 2025", "18-64", the DTC requirement, `effort`/`wait` and the guide steps. MEDIUM: the bump relabels the whole record, but only the amount facts were verified.
- rdsp (inherited to 2026-10): src3 supports $3,500, $1,000, 300% and "No contributions have to be made to get the bond". Not checked: "tens of thousands of dollars", "most banks or credit unions", the steps and the rdspOpening text. MEDIUM, same issue. The proposal admits "not a full-catalogue re-verification", but the label on the page is per record.
- Fix: either re-read the remaining facts on both records against sources and add a source if needed, or leave the old month. Keeping the bump is a judgement call for the owner.
- The REVIEWED_MONTHS allowlist and the inherited count 54 to 53 are consistent with the bumps.

## 5. Kept gates
- rdspContributionWindow: keep is defensible. src2 supports "no annual limit" and "$200,000" ("all previous contributions and rollovers ... will reduce this amount") and contributions "until the end of the year in which the beneficiary turns 59". The unmet text also says "A plan can be opened ... until the end of the year the beneficiary turns 59". src2 only says contributions are permitted, not that a plan can be opened, so that clause is unsourced and unchanged. LOW: this record is stamped 2026-10 while carrying that clause. Fix: change "A plan can be opened and contributions made" to "Contributions are permitted" in a follow-up.
- bcCydbIntake: keep is justified, since the source gives hedged, conditional transition language. Source: "will transition to the Disability Benefit if they are eligible", "Temporary eligibility rules may be used during this time", "New applicants after April 1, 2027 will apply directly". The kept unmet text says "current recipients are being moved to this benefit automatically as their transition completes" and "Direct applications for this benefit open April 1, 2027", with the "if eligible" hedge dropped and "after" turned into "open on". Unchanged by this diff and not date-bumped, so no regression. LOW: log it as a separate follow-up.

## Other
- `node --check` passes on data.js and app.js.
- Test edits (matcher-safety, requirements-layout, data-verification, freshness-labels) are consistent with the change. No contradictions found.
