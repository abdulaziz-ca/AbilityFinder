# "Not for your situation now" — reviewed rules (2026-10-16)

Rule for adding one (DECISION.md, CODEX-CRITIQUE-A.md §3): the person's own **definite** answer
says a step is missing, and the program's official page offers **no route** without that step.
"Not sure", skipped or unasked never counts. The row says what is needed first; it is never a refusal.
Rules live in `PREREQ_RULES` in `public/resultsGroups.js`, each with an explicit program list.

## Shipped

| Rule | Programs | Official evidence |
|---|---|---|
| DTC answered "no" (phase 1) | every program with the `dtc` gate | DTC approval is required first |
| Autism diagnosis answered "No / not yet" | bc-autism-funding-under-6, bc-autism-funding-6-18 | "In order to apply for funding, ensure you have had an assessment and diagnosis." (bc-autism-funding-under-6--2.txt) |
| same | ontario-autism-program | "To register … your child must … have a written diagnosis of autism from a qualified professional" (ontario-autism-program--1.txt) |

## Checked and rejected (keep as cards)

A Claude source check (snapshots in research/reverify/snapshots/) found these unsafe:

- **Disability documentation answered "no"** — all 11 programs with `disabilityDoc`. The StudentAid BC
  and Canada Student Grant programs establish disability status inside the application and reimburse
  the medical assessment (up to $3,500); the BC learning-disability assessment bursary *pays for* the
  assessment; CLBC's facilitator explains what documents are needed and school assessments may count;
  WorkBC Assistive Technology asks about a work-related barrier, not formal documentation; DRES and the
  Alberta Grant for Students with Disabilities do not say documentation must exist before applying.
- **B.C. assistance "None of these"** — bc-monthly-nutritional-supplement (the snapshot has no
  eligibility text to prove PWD is required); bc-property-tax-deferment-disabilities (PWD designation is
  one route; the regular program also admits people 55+ and surviving spouses).
- **Age, working status, income, mobility, home ownership** — rejected earlier by the Codex critique
  (§3): each has exceptions an answer band cannot rule out (OAS eligibility, capacity vs having a job,
  adjusted net income, local medical travel, relatives' ownership).

## Data fix found by this review (shipped, ?v=195)

- `bc-learning-disability-assessment-bursary` required `disabilityDoc`, but the bursary pays for the
  assessment that produces the documentation. The official page asks instead for StudentAid BC
  eligibility, enrolment at a designated public B.C. post-secondary school, and a recommendation from
  the school's accessibility services office. The gate is now `bcLdAssessmentReferral` (always a check,
  never "ready"); oracle SPEC_VERSION 1.32.0, no-confirmation baseline 44 ready / 90 almost.
