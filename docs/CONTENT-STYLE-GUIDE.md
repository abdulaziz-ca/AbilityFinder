# AbilityFinder content style guide

Who reads this: people with disabilities and their families, often tired, in pain, stressed, reading
on a phone, using a screen reader, or reading English as a second language. Many have been refused
before. Write so a grade-8 reader can act on it the first time.

These rules come from the October 2026 site audit (`research/2026-10-site-audit/`) and are enforced
where a test can check them. When a rule and an official source disagree, the official source wins,
and the qualifier stays.

## 1. Accuracy comes first

- **Never change meaning to make text shorter.** Keep every amount, date, age, deadline, condition,
  exception, limit and "who decides".
- **Never harden a hedge.** "May qualify" never becomes "qualify"; "up to" never becomes an exact
  amount; "usually" never becomes "always".
- **Absence is not a rule.** If the official page does not say something, do not write it.
- **Wording reviewed word for word against an official source stays as it is.** The factual-batch
  tests (`test/factual-batch.test.js`) and several e2e specs pin those phrases; if one fails after an
  edit, restore the reviewed wording rather than editing the test.

## 2. Plain language

- Sentences of about 15 words; never over 25.
- Everyday words: use, get, before, need, help, pay (not utilize, obtain, prior to, require,
  facilitate, remit), where the meaning is identical.
- Active voice and "you". One idea per sentence. Answer first, then explain.
- Explain an abbreviation the first time a record uses it: "the Disability Tax Credit (DTC)".
- No marketing voice: no "best-value", "free money", "don't leave it on the table", "easily",
  "many are approved", and no exclamation marks.
- No all-capital emphasis ("NOT", "ALL"): screen readers can spell it out. Guide fields render as
  escaped text, so rephrase instead ("you cannot…").
- List items start with a capital letter. Items that are full sentences end with a full stop.

## 3. Where each kind of text goes

| Field | Shown | Budget |
|---|---|---|
| `summary` | every results card and guide lede | one or two sentences, at most 60 words (test); aim for under 30 |
| `amount` | "How much?" on cards and guides | the official figure with its qualifier ("Up to $X per year") |
| `note` | "Good to know" box on the guide | at most 240 characters before it is flagged as dense |
| `detail.tips` | "Practical tips" list | one tip per item, one or two short sentences |
| `eligibility.items` | "You must meet" list | one short line per item; full official wording behind the expander |
| `REQS[...].short` | the one-line requirement cue | at most 80 characters, plain words |
| `REQS[...].unmet` | full requirement text | at most 120 characters and one sentence, or it counts against the dense-surface ratchet |

## 4. Tests that hold the line

- `test/plain-language-ratchet.test.js`: median reading grade of summary + note + tips (baseline
  9.1), programs at grade 9 or below (baseline 67), summary length, and no all-capital emphasis.
  Lower the baselines when text improves; never raise them.
- `test/dense-surface-ratchet.test.js` (`npm run check:surfaces`): counts of over-long surfaces.
- `npm run check:readability`: the per-program report in `research/197-info-density/`.

## 5. How the October 2026 rewrite was done (repeat this for big edits)

1. Rewriters work from a shared brief with the rules above, and return only changed fields.
2. An automatic check rejects any change to a figure, link, HTML tag, hedge word or list length.
3. A separate reviewer reads every before/after pair for meaning changes, and a person samples them.
4. The wording guards and all suites run; any field they flag goes back to its reviewed wording.
