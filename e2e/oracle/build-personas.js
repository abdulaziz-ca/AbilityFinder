/* =============================================================================
   TEST-01 — PERSONA BUILDER
   TaskView #61 · spec-key AF-S0401

   Turns the declarative specification in oracle-spec.js into concrete answer
   models plus the outcome each one must produce. Pure functions, no Playwright
   and no DOM, so the derivation can be reasoned about — and unit-tested — apart
   from the browser run that checks it against the real matcher.

   For each program it produces:

     best case  — every gate the wizard CAN satisfy is satisfied. Expected
                  "ready" if the program has no external gate, "almost" if it
                  has one. This single assertion is the false-ready net.
     violations — one persona per declared violation of each answer-provable
                  gate, expected "no" (a trait the user cannot change) or
                  "almost" (something they can act on).

   A program with no answer-provable gate produces no violation personas. That
   is a real property, not a hole: a federal credit gated only on money already
   spent is "almost" for everybody and refuses nobody, and the coverage report
   states so explicitly rather than leaving it implicit.
   ========================================================================== */

const { BASE_PERSONA, DEFAULT_CITY, GATES } = require("./oracle-spec");

const MULTI_SELECT = ["disabilities", "functionalNeeds", "circumstances", "situation"];
const PLACEHOLDERS = ["none", "unsure"];

const CHILD_BANDS = ["under6", "6to11", "12to15", "16to17"];
const ADULT_BANDS = ["18", "19to59", "60to64"];
const ageGroupForBand = (band) =>
  CHILD_BANDS.includes(band) ? "child" : ADULT_BANDS.includes(band) ? "adult" : band === "65plus" ? "senior" : null;

/* A persona under construction: the answers so far, plus the record of which
   gates claimed which scalar or multi-select value, so a collision names the
   culprits instead of silently letting the last one win. `setBy` holds every
   gate that claimed a scalar, not just the most recent — two gates can
   legitimately agree on the same answer (the Alberta Child Health Benefit
   needs both of its age gates), and either of them must still be able to
   override it in its own violation. `ownedValues` carries that same protection
   per value where several gates can legitimately share one answer array. */
function newDraft() {
  return {
    answers: {
      ...BASE_PERSONA,
      disabilities: [...BASE_PERSONA.disabilities],
      functionalNeeds: [...BASE_PERSONA.functionalNeeds],
      circumstances: [...BASE_PERSONA.circumstances],
      situation: [...BASE_PERSONA.situation],
    },
    setBy: {},
    ownedValues: {},
    conflicts: [],
  };
}

/* `overrides` names the gate whose own satisfy fragment this fragment is
   allowed to overwrite. A violation must be able to undo the thing its gate
   asked for — that is the entire point of it — but it must NOT be able to
   quietly undo a different gate's requirement, because then the persona would
   be violating two gates and the expected outcome would be a coincidence.
   Collisions with any other gate stay conflicts and get reported. */
function applyFragment(draft, fragment, source, overrides = null) {
  if (!fragment) return draft;

  const claimValue = (key, value) => {
    const owners = draft.ownedValues[key] || new Map();
    const valueOwners = owners.get(value) || [];
    owners.set(value, valueOwners.includes(source) ? valueOwners : [...valueOwners, source]);
    draft.ownedValues[key] = owners;
  };

  const removeValues = (key, removed, replacement) => {
    const owners = draft.ownedValues[key] || new Map();
    for (const value of removed) {
      const blockingOwners = (owners.get(value) || []).filter((owner) => owner !== overrides && owner !== source);
      if (blockingOwners.length) {
        draft.conflicts.push(
          `${key}: ${blockingOwners.join(" + ")} need ${JSON.stringify(value)} but ${source} needs ${JSON.stringify(replacement)}`,
        );
      }
      owners.delete(value);
    }
    draft.ownedValues[key] = owners;
  };

  for (const [key, value] of Object.entries(fragment.set || {})) {
    if (MULTI_SELECT.includes(key)) {
      // A `set` on a multi-select replaces it outright — that is how a
      // violation says "answer none of these" or "answer I'm not sure". Values
      // another gate still needs cannot disappear invisibly merely because
      // arrays do not participate in scalar ownership.
      removeValues(key, draft.answers[key].filter((current) => !value.includes(current)), value);
      draft.answers[key] = [...value];
      for (const installed of value) claimValue(key, installed);
      continue;
    }
    const owners = draft.setBy[key] || [];
    if (owners.length && !owners.includes(overrides) && draft.answers[key] !== value) {
      draft.conflicts.push(
        `${key}: ${owners.join(" + ")} need ${JSON.stringify(draft.answers[key])} but ${source} needs ${JSON.stringify(value)}`,
      );
      continue;
    }
    draft.answers[key] = value;
    draft.setBy[key] = owners.includes(source) ? owners : [...owners, source];
  }

  for (const [key, values] of Object.entries(fragment.add || {})) {
    const current = draft.answers[key].filter((v) => !PLACEHOLDERS.includes(v));
    const owners = draft.ownedValues[key] || new Map();
    for (const placeholder of PLACEHOLDERS) owners.delete(placeholder);
    draft.ownedValues[key] = owners;
    draft.answers[key] = [...new Set([...current, ...values])];
    for (const added of values) claimValue(key, added);
  }

  for (const [key, values] of Object.entries(fragment.drop || {})) {
    const kept = draft.answers[key].filter((v) => !values.includes(v));
    // An emptied multi-select is not "unanswered" in this product — the user
    // picked "None of these". Keep that explicit so the placeholder-sensitive
    // gates (the ones whose hardness depends on "unsure") behave as the wizard
    // would make them behave.
    const replacement = kept.length ? kept : ["none"];
    removeValues(key, draft.answers[key].filter((value) => values.includes(value)), replacement);
    draft.answers[key] = replacement;
  }

  return draft;
}

/* Province and city travel together. A persona in BC living in Calgary is not a
   persona, it is a bug in the spec — so the city default follows the province
   unless a city gate has claimed the field itself. */
function settle(draft) {
  const { answers } = draft;
  if (!draft.setBy.city || !draft.setBy.city.length) answers.city = DEFAULT_CITY[answers.province] || null;
  answers.ageGroup = ageGroupForBand(answers.ageBand);
  answers.forWho = answers.ageGroup === "child" ? "child" : "self";
  return draft;
}

function unknownGates(requires) {
  return requires.filter((key) => !GATES[key]);
}

function externalGates(requires) {
  return requires.filter((key) => GATES[key] && GATES[key].evidence === "external");
}

function provableGates(requires) {
  return requires.filter((key) => GATES[key] && GATES[key].evidence === "answers");
}

/* The best-case persona: satisfy everything satisfiable. */
function buildBestCase(program) {
  const draft = newDraft();
  for (const key of provableGates(program.requires)) {
    applyFragment(draft, GATES[key].satisfy, key);
  }
  settle(draft);
  return draft;
}

/* One persona per declared violation, built on top of the best case so the
   violated gate is the only thing standing in the way. */
function buildViolations(program) {
  const cases = [];
  for (const key of provableGates(program.requires)) {
    for (const violation of GATES[key].violations || []) {
      const draft = newDraft();
      for (const other of provableGates(program.requires)) {
        applyFragment(draft, GATES[other].satisfy, other);
      }
      applyFragment(draft, violation.fragment, `${key}/${violation.name}`, key);
      settle(draft);
      cases.push({
        gate: key,
        name: violation.name,
        expect: violation.expect,
        answers: draft.answers,
        conflicts: draft.conflicts,
      });
    }
  }
  return cases;
}

/* The whole oracle for one program. */
function buildProgramCases(program) {
  const unknown = unknownGates(program.requires);
  const external = externalGates(program.requires);
  const best = buildBestCase(program);

  return {
    id: program.id,
    requires: program.requires,
    unknownGates: unknown,
    externalGates: external,
    provableGates: provableGates(program.requires),
    bestCase: {
      // The invariant. One external gate is enough: the product cannot know the
      // fact, so it must not claim the outcome.
      expect: external.length ? "almost" : "ready",
      answers: best.answers,
      conflicts: best.conflicts,
    },
    violations: buildViolations(program),
  };
}

function buildAll(benefits) {
  return benefits.map(buildProgramCases);
}

/* The outcome sets the ticket asks to be recorded, read back off the built
   cases so the record and the assertions cannot drift apart. */
function outcomeSets(programCase) {
  const sets = { ready: [], almost: [], no: [] };
  sets[programCase.bestCase.expect].push("best case");
  for (const violation of programCase.violations) {
    sets[violation.expect].push(`${violation.gate}: ${violation.name}`);
  }
  return sets;
}

module.exports = {
  ageGroupForBand,
  applyFragment,
  buildAll,
  buildBestCase,
  buildProgramCases,
  buildViolations,
  externalGates,
  newDraft,
  outcomeSets,
  provableGates,
  settle,
  unknownGates,
};
