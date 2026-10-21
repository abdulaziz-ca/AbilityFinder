# Feature: browse by disability and by need (#246), owner pick 2026-10-20

## What exists
"Browse benefits in our catalog" (`renderBrowse` / `browseFiltered` in public/app.js) already has a disability
chip row. Picking a disability sorts programs aimed at it first and hides nothing (`isDisSpecific`, the
`browse-disnote` explanation). The weak point is the map behind it:
`DIS_BY_REQ = { mobility, equipmentNeed, developmental }` covers 3 gates. About 70 gates across the 10
provinces target a specific disability or need, for example visionDisability, hearingDisability,
autismSelected, autismDiagnosis, intellectualDisability, learningDisability, brainInjuryDisability,
physicalDisability, CNIB transit routes, hearing-aid routes, transitBarrier (28 programs), homeAccessNeed and
medicalTravelNeed.

## Build
1. **Derive the maps from the gates' own code**, not from prose. At load, for every gate in the requirement
   registry (the `REQS` object in app.js), read its `met` function source (`met.toString()`) and collect the
   literal values passed to `hasDisability("…")` and `hasFunctionalNeed("…")`. Also collect values from any
   other helper that tests `answers.disabilities` or `answers.functionalNeeds` membership; find these helpers
   and list them in the code comment.
   - `DIS_BY_REQ[gate]` = the disability values found, minus "other".
   - `NEED_BY_REQ[gate]` = the functional-need values found, minus "none", "unsure" and the
     child/adult-only ones that have no browse chip.
   - Ignore a value that appears only inside a negation (`!hasDisability("x")`). If a gate's source is too
     complex to read safely, leave it unmapped: unmapped means "applies to any", the safe default.
   - Keep the 3 existing hand entries as explicit overrides merged on top (`mobility`, `equipmentNeed`,
     `developmental`), with their current values.
2. **Need chip row.** Add a third chip row, "Show what helps with a need", with an "Any need" chip plus one chip
   per functional need: transitBarrier, equipment, nutrition, medicalTravel, communication, memorySafety,
   sensory, homeAccess, careCoordination, fatiguePain. Use short labels:
   - transitBarrier: "Getting around"
   - equipment: "Equipment & supplies"
   - nutrition: "Special diet"
   - medicalTravel: "Travel for medical care"
   - communication: "Communication"
   - memorySafety: "Memory & safety"
   - sensory: "Sensory support"
   - homeAccess: "Home changes"
   - careCoordination: "Organizing care"
   - fatiguePain: "Pain & fatigue"
   French labels go in i18n:
   - « Déplacements »
   - « Équipement et fournitures »
   - « Régime spécial »
   - « Déplacements pour soins »
   - « Communication »
   - « Mémoire et sécurité »
   - « Soutien sensoriel »
   - « Adaptation du domicile »
   - « Organisation des soins »
   - « Douleur et fatigue »
   Same behaviour as the disability row: matching programs sort first and get the `dis-match` card class.
   Nothing is hidden. Add a note line in the same style as `browse-disnote`: "N programs are aimed
   specifically at this need — shown first. Everything else may still apply." When N is 0: "No program is
   aimed only at this need. Everything else may still apply."
3. **Sort order** when both a disability and a need are chosen: programs matching both, then matching either,
   then the rest. Within each band keep the current `priorityScore` order.
4. **State**: keep the need choice the way the browse disability choice is kept (find how `browseDis` is
   persisted, if at all, and mirror it). Do not add it to saved answers.

## Do not
- Do not filter any program out. Do not change eligibility, statuses, results or the questionnaire.
- Do not edit public/data.js.
- Do not change the design beyond adding the chip row with the existing chip styles.

## Tests
- Unit, `test/browse-maps.test.js`: load app.js the way other tests load the engine
  (see `research/2026-10-site-audit/tools/load-engine.js`). Check:
  - visionDisability maps to vision, hearingDisability to hearing, autismSelected to autism,
    transitBarrier to the transitBarrier need, homeAccessNeed to homeAccess (whatever each gate's code really
    tests);
  - the 3 overrides keep their values;
  - no gate maps to "other", "none" or "unsure";
  - **pin a snapshot** of the full derived DIS_BY_REQ and NEED_BY_REQ in
    `test/fixtures/browse-maps.json`, so a change shows up in review. Print the table (gate → values →
    program count) in your final summary so the orchestrator can check it.
- e2e (chromium), `e2e/browse-needs.spec.js`:
  - pick "Vision loss / blindness": a CNIB or vision program is first and the note shows a count > 0;
  - pick "Getting around": a paratransit program is first, and the total count equals the unfiltered total;
  - both rows chosen: the order follows rule 3;
  - keyboard: chips are reachable and toggle with Enter/Space, like the existing rows.
- `npm test` passes. Run only your new spec with `--project=app-chromium`. Check port 8766 first and stop the
  listener if another checkout owns it.

## Versioning
Bump `?v=` by one (the current branch value plus one) in public/index.html and in the `dataAssetVersion()`
fallback, then run `npm run gen:guides`. Commit on the branch with a message ending
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do not push.
