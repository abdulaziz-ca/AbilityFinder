# Provincial program sweep — Alberta, B.C., Ontario (2026-10-17)

Why: Ontario was the latest province added, and Alberta and B.C. had not been re-checked against a
full list of provincial programs. Each candidate was checked on its official page
(`verification/verified-*.json`), the page text was saved (`snapshots/`), a record was drafted from the
snapshot only, and a separate reviewer checked every sentence and number against it.

## Built (35)

**Ontario (15):** Ontario Works · Ontario Drug Benefit · ODSP health and disability benefits (Special Diet
Allowance folded in) · ODSP employment supports · Healthy Smiles Ontario · Ontario Seniors Dental Care
Program · Developmental Services Ontario (adult services) · Enhanced Respite (children) · Ontario Health
atHome home and community care · Northern Health Travel Grant · GAINS · Ontario Child Benefit · Ontario
Trillium Benefit · Ontario Electricity Support Program · Children's Rehabilitation Services (added after the final check).

**B.C. (10):** Income Assistance · Persons with Persistent Multiple Barriers · hearing instruments and the
Alternative Hearing Assistance Supplement · Home and Community Care home support · CSIL · Nursing
Support Services · SAFER · Rental Assistance Program · B.C. Family Benefit · subsidized housing through the BC
Housing Registry (added after the final check).

**Alberta (10):** Income Support · Alberta Seniors Benefit · Special Needs Assistance for Seniors · Dental
and Optical Assistance for Seniors · SHARP · Alberta Child and Family Benefit · Rent Assistance Benefit
· Alberta Brain Injury Initiative · home care / continuing care at home · Alberta Blue Cross Non-Group
Coverage (premium subsidy).

## Matching decisions

- Programs decided by a care-needs assessment (home care in all three provinces, CSIL, Nursing Support
  Services) and the Northern Health Travel Grant (district, referral, 100 km) never show as a full match:
  they show as "More to check" with what to ask for.
- Child benefits (Ontario Child Benefit, Alberta Child and Family Benefit, RAP) are a full match only when
  the person is under 18; for adults the program stays "More to check" because the wizard does not ask
  whether you are raising a child.
- B.C. Income Assistance and RAP are not a full match for people on disability assistance (PWD).
- Brain Injury Initiative needs the brain-injury category; DSO needs a developmental disability that began
  before 18; hearing supplements need the hearing category and B.C. assistance.
- Ontario Drug Benefit is a full match at 65+; other routes (OW/ODSP, home care, Trillium) stay "More to check".
- SAFER uses a new 60-and-over age check.

## Not built, with reasons

- **B.C. Family Benefit disability supplement** — proposed, expected July 2027. Re-check then.
- **Ontario Bursary for Students with Disabilities** — no public eligibility page; ontario.ca lists only the
  federal disability grants, which are already records (csg-disability, csg-dse).
- **Covered by an existing record:** AISH health benefits (aish), PDD respite (pdd), Alberta/Ontario/B.C.
  provincial disability tax amounts (claimed with the federal DTC record), Mandatory Special Necessities
  (inside ODSP health benefits), diet supplements (bc-monthly-nutritional-supplement).
- **Ended:** HAFI (replaced by BC RAHA, already a record).
- **Out of scope:** Inclusive Child Care (funds child care programs; families cannot apply), Senior
  Homeowners' Property Tax Grant and Seniors Care at Home Tax Credit (no eligibility on the page),
  Ontario Renovates (no disability criterion), OHIP eye exams (universal), LEAP (no usable program page;
  mentioned as a tip on OESP), BC Seniors Supplement (no current gov.bc.ca page).

## Final completeness check

A fresh agent re-read each province's hub pages against the updated catalogue
(`verification/final-check.json`). It found the two programs above, which were then built and reviewed the same
way. Also checked and not built: Alberta Child Care Subsidy (general subsidy, no disability-specific rule),
Alberta Seniors Lodge Program (the page covers capital funding only), B.C. PWD transportation supplement (already
in bc-disability-assistance-pwd and bc-bus-pass), B.C. Community Volunteer Supplement (closed to new applicants
since 2011), MSP premium help (premiums ended in 2020), Ontario community housing (run by municipal service
managers; no provincial eligibility page).
