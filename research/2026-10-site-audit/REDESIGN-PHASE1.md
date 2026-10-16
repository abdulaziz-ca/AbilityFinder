# Results redesign, phase 1: before and after

Measured over the 15 audit personas (tools/measure-relevance.js = before, tools/measure-phase1.js = after). evaluate() statuses are unchanged; only presentation moved.

| Metric (15 personas, totals) | Before | After |
|---|---|---|
| Full cards shown | 307 (29 ready + 278 almost) | 208 (29 ready + 179 almost) in G1 |
| One-line rows (G2 "Other programs to check") | 0 | 87 |
| Closed "Not for your situation now" rows (G3) | 0 | 12 |
| Cards contradicted by the person's own answers, first 10 | 29 (c in top 10) | 0 DTC-needing cards in first 10 for dtc=no (G3 rule) |
| Total accounted for | 307 | 208 + 87 + 12 = 307 |

Notes
- G3 has one rule in phase 1: DTC answered "no" and the program needs DTC approval. The "city outside local area" rule needs no code: such programs are already status "no" and stay in "Does not match these answers".
- Unknown or "not sure" DTC never reaches G3 (unit tested). Other "contradicted" judgements (income ceilings etc.) are not moved; that is phase 2.
- Giant count and empty money band removed; headline is one h1.
- Screens: screens/redesign-desktop.png (1280), screens/redesign-phone.png (390, no horizontal overflow).
