# Saskatchewan — what adding it takes (research, 2026-10-17)

Status (2026-10-18): **live with 22 provincial records** (`?v=213`), per the owner's decisions: provincial first,
cities later; general low-income programs included; Lloydminster under both Alberta and Saskatchewan. Built
from official page snapshots (`snapshots/`), each reviewed by a separate agent. A completeness check
(`sk-final-check.json`) added 4 more. Not built: housing and supports for people with intellectual disabilities
(no eligibility rule beyond "meets CLSD requirements"), Acquired Brain Injury services and Therapy Services (no
published eligibility), FASD services (single condition), KidsFirst (not disability-specific), the student grant
(same as the federal grant), the closed Rental Housing Supplement. **Next: city programs** (Regina, Saskatoon,
North Battleford first).

Original scoping notes follow.
Candidate list with official URLs: `sk-programs.json` (found by a research agent; each URL was fetched, but
nothing has been drafted or reviewed yet).

## Programs found

**Provincial (19 candidates)**
- Income: SAID (disability income support, 18+), Saskatchewan Income Support (SIS), Saskatchewan Employment
  Incentive (low-income working parents), Seniors Income Plan (65+), Saskatchewan Housing Benefit (new 2026).
- Health: Supplementary Health Benefits (for SAID/SIS recipients), Family Health Benefits, the Special Support drug
  program, the Seniors' Drug Plan.
- Equipment and home: SAIL (equipment and supplies, 14 sub-programs), Adapt a Home (forgivable loan up to $23,000),
  the Accessible Parking Program (run by SaskAbilities for SGI).
- Children: Autism Individualized Funding (under 12), respite for families of a child with an intellectual
  disability, Cognitive Disability Strategy support.
- Care and work: Individualized Funding for Home Care, Employability Assistance for Persons with Disabilities
  (EAPD, 16+), housing and supports for people with intellectual disabilities.
- Education: the Canada-Saskatchewan grant for services and equipment (largely the federal grant we already list).

**Municipal (11 candidates):** Regina Paratransit and the Affordable Access Program (recreation and transit);
Saskatoon Access Transit, the low-income bus pass and Leisure Access; North Battleford's Handi-Bus; Moose Jaw and
Swift Current transit (no official page found yet); Lloydminster's Recreation Access Program (already a record,
and it also accepts SAID).

A realistic first release is about **15 provincial records plus 5 to 6 city records** (Regina, Saskatoon,
North Battleford), the same way Ontario launched with its provincial core first.

## What makes Saskatchewan harder

- **Rules are moving right now.** SAID changes from four rate tiers to two on 2026-09-01, and the rental housing
  supplement has been replaced by the new Saskatchewan Housing Benefit (2026-08-31). Some pages mix old and new
  dates, so the records need a careful, dated re-check.
- **Some pages do not load for automated tools** (SGI parking, Saskatoon Leisure Access, Supplementary Health
  Benefits), so they would need the browser method we used for Alberta.
- **Several programs publish no thresholds** (Cognitive Disability Strategy, respite, Family Health Benefits, EAPD).
  Following our rules, those become "More to check" records, or are not built.
- **Smaller cities publish little.** Prince Albert, Yorkton, Estevan, Weyburn, Martensville and Warman had no
  official program page; their services are often community-run.
- **Lloydminster sits on the border.** It is in our Alberta city list today; it needs a decision for Saskatchewan
  residents of the city.

## Engineering steps (mirrors the Ontario launch, `ONTARIO-GO-LIVE.md`)

1. A `SK_ENABLED` flag (off) with the scope strings, the wizard's province option, the `sk` gate and the
   province-coverage helpers, following `ON_ENABLED`. Generators (`gen:context`, `gen:guides`) read the flag.
2. `SK_CITIES` in `data.js`, `COVERED_PROVINCES`, `CITIES_BY_PROVINCE`, and the "What we don't cover yet" page
   (211 Saskatchewan link).
3. A "You already get" option for SAID, and receipt rules where SAID or SIS opens other programs (like ODSP).
4. Records built dark behind the flag through the same pipeline: official page snapshot, draft, independent
   review, oracle gates and best cases, the oracle's default and second cities for SK, and count tests.
5. The dark-province test in `matcher-safety.spec.js` extended to SK; a full flag-on rehearsal; then the
   go-live steps: `index.html` title and description, version bump, changelog, `HANDOFF.md`.
6. Organisations directory: SaskAbilities, 211 Saskatchewan, and others found during the build.

## Questions for the owner

1. Start with the provincial core only (about 15 records), then cities? (Recommended: yes, same as Ontario.)
2. Include general low-income programs (SIS, Housing Benefit, Employment Incentive) as well as disability-specific
   ones? We did this for Alberta, B.C. and Ontario.
3. Lloydminster: list it under both provinces, or keep it Alberta-only with a note?
