/* =============================================================================
   TEST-01 — THE ELIGIBILITY ORACLE, RUN AGAINST THE REAL MATCHER
   TaskView #61 · spec-key AF-S0401 · issue #19

   Audit finding TEST-01: there is no systematic eligibility oracle across all
   programs, and the false-ready cluster was only ever fixed as individual
   findings. e2e/matcher-safety.spec.js asserts specific programs a person
   thought to check. This file asserts EVERY program, and fails when a new one
   arrives without an entry.

   It drives the production matcher through window.evaluateAnswers(), the same
   entry point matcher-safety.spec.js uses, so it tests the shipped code path
   rather than a re-implementation of it.

   Failures are reported with expect.soft() so one run lists every divergence.
   A single hard expect would report the first mismatch and hide the shape of
   the problem, which is the opposite of what an oracle is for.
   ========================================================================== */

const { test, expect } = require("@playwright/test");
const {
  SPEC_VERSION,
  DIMENSIONS,
  GATES,
  PROGRAM_BEST_CASE,
  PROGRAM_NOTES,
} = require("./oracle/oracle-spec");
const { buildAll, outcomeSets } = require("./oracle/build-personas");

/* One navigation for the whole file. Every persona is evaluated inside the page
   in a single round trip per test, which keeps the ~390 assertions cheap enough
   to sit in the default suite instead of behind a flag. */
async function gotoReadyApp(page) {
  await page.goto("/");
  // Both are top-level declarations in classic scripts. `evaluateAnswers` is a
  // function declaration and so lands on window; `BENEFITS` is a const and does
  // not, which is why it is reached by bare reference rather than window.*.
  await page.waitForFunction(
    () => typeof window.evaluateAnswers === "function" && typeof BENEFITS !== "undefined",
  );
}

async function readCatalogue(page) {
  return page.evaluate(() => BENEFITS.map((b) => ({ id: b.id, requires: [...b.requires] })));
}

/* Evaluate many personas in one page call. Returns, for each persona, only the
   status of the program it is about — the full result set is 118 entries per
   persona and serialising all of it would be the slow part. */
async function evaluateBatch(page, personas) {
  return page.evaluate((cases) =>
    cases.map(({ programId, answers }) => {
      const evaluated = window.evaluateAnswers(answers);
      const hit = evaluated.find((e) => e.b.id === programId);
      return {
        status: hit ? hit.r.status : null,
        needs: hit ? hit.r.needs.map((n) => n.text) : [],
        reasons: hit ? hit.r.reasons : [],
      };
    }), personas);
}

test.describe("eligibility oracle", () => {
  test("the oracle covers every catalogue program and every gate they use", async ({ page }) => {
    await gotoReadyApp(page);
    const catalogue = await readCatalogue(page);
    const cases = buildAll(catalogue);

    // 1. Every program is covered. A program is covered when every gate in its
    //    requires list has a registry entry — that is what makes its outcome
    //    sets derivable at all.
    const uncovered = cases.filter((c) => c.unknownGates.length);
    expect(
      uncovered.map((c) => `${c.id} — gates missing from the oracle registry: ${c.unknownGates.join(", ")}`),
      "every catalogue program must be covered by the oracle; add the missing gates to e2e/oracle/oracle-spec.js",
    ).toEqual([]);

    // 2. The comparison is machine-generated in both directions: a registry
    //    entry for a gate no program uses is dead weight that will rot.
    const usedGates = new Set(catalogue.flatMap((program) => program.requires));
    const orphaned = Object.keys(GATES).filter((key) => !usedGates.has(key));
    expect(
      orphaned,
      "these oracle gates are no longer required by any program; remove them or restore the program",
    ).toEqual([]);

    // 3. No persona may be self-contradictory. A collision means two gates on
    //    one program demand different answers to the same question, which makes
    //    the program unreachable — a finding about the catalogue, surfaced here
    //    rather than swallowed.
    const contradictory = cases
      .filter((c) => c.bestCase.conflicts.length)
      .map((c) => `${c.id} — ${c.bestCase.conflicts.join(" | ")}`);
    expect(contradictory, "a program whose gates contradict each other can never be matched").toEqual([]);

    // 3b. And no violation persona may break a gate other than the one it
    //     targets, or its expected outcome would be a coincidence rather than a
    //     statement about the gate under test.
    const impureViolations = cases.flatMap((c) =>
      c.violations
        .filter((v) => v.conflicts.length)
        .map((v) => `${c.id} / ${v.gate} (${v.name}) — ${v.conflicts.join(" | ")}`),
    );
    expect(impureViolations, "a violation persona collides with another gate's requirement").toEqual([]);

    // 4. Every declared expectation for a program must name a program that
    //    exists, so a rename cannot leave a stale exemption behind.
    const ids = new Set(catalogue.map((c) => c.id));
    expect(
      Object.keys(PROGRAM_NOTES).filter((id) => !ids.has(id)),
      "PROGRAM_NOTES names a program that is no longer in the catalogue",
    ).toEqual([]);

    // 5. The frozen baseline names every program, so a rename or a deletion
    //    cannot slip past.
    const declared = new Set(Object.keys(PROGRAM_BEST_CASE));
    expect(
      catalogue.map((c) => c.id).filter((id) => !declared.has(id)),
      "these programs have no declared best-case outcome; add them to PROGRAM_BEST_CASE",
    ).toEqual([]);
    expect(
      [...declared].filter((id) => !ids.has(id)),
      "PROGRAM_BEST_CASE declares a program that is no longer in the catalogue",
    ).toEqual([]);

    // 6. The load-bearing check. Derivation alone cannot catch a gate being
    //    DELETED — remove an external gate and the derivation cheerfully
    //    re-derives "ready", agreeing with the mutation. The frozen value is
    //    what makes that edit visible.
    const drifted = cases
      .filter((c) => PROGRAM_BEST_CASE[c.id] && PROGRAM_BEST_CASE[c.id] !== c.bestCase.expect)
      .map(
        (c) =>
          `${c.id} — declared ${PROGRAM_BEST_CASE[c.id]}, but its gates now derive ${c.bestCase.expect} ` +
          `(requires: ${c.requires.join(", ")})`,
      );
    expect(
      drifted,
      "a program's gates no longer derive its declared outcome — a gate was added or removed. " +
        "If the change is intended, update PROGRAM_BEST_CASE and bump SPEC_VERSION; that is a product decision",
    ).toEqual([]);

    // 7. And the declared expectations must agree with the derived ones. A note
    //    is documentation of a derivation, never an override of it.
    const disagreeing = cases
      .filter((c) => PROGRAM_NOTES[c.id] && PROGRAM_NOTES[c.id].bestCase !== c.bestCase.expect)
      .map((c) => `${c.id} — note says ${PROGRAM_NOTES[c.id].bestCase}, gates derive ${c.bestCase.expect}`);
    expect(disagreeing, "a PROGRAM_NOTES entry contradicts what the program's gates derive").toEqual([]);

    console.log(
      `oracle spec ${SPEC_VERSION}: ${cases.length} programs, ${usedGates.size} gates ` +
        `(${Object.values(GATES).filter((g) => g.evidence === "external").length} external), ` +
        `${DIMENSIONS.length} persona dimensions, ` +
        `${cases.reduce((n, c) => n + 1 + c.violations.length, 0)} asserted outcomes`,
    );
  });

  test("no program can claim readiness on evidence the wizard never collects", async ({ page }) => {
    await gotoReadyApp(page);
    const catalogue = await readCatalogue(page);
    const cases = buildAll(catalogue).filter((c) => c.externalGates.length);

    const results = await evaluateBatch(
      page,
      cases.map((c) => ({ programId: c.id, answers: c.bestCase.answers })),
    );

    // The false-ready invariant, stated once for all 59 externally gated
    // programs. This is the assertion the audit's TEST-01 finding is about: the
    // best a truthful matcher can say about a caseworker's decision, a doctor's
    // signature or money not yet spent is "one step away".
    cases.forEach((programCase, i) => {
      expect
        .soft(
          results[i].status,
          `${programCase.id} is gated on evidence the wizard cannot collect ` +
            `(${programCase.externalGates.join(", ")}), so its best possible outcome is "almost"`,
        )
        .toBe("almost");
    });
  });

  test("every program's best-case persona lands on its specified outcome", async ({ page }) => {
    await gotoReadyApp(page);
    const catalogue = await readCatalogue(page);
    const cases = buildAll(catalogue);

    const results = await evaluateBatch(
      page,
      cases.map((c) => ({ programId: c.id, answers: c.bestCase.answers })),
    );

    // Asserted against the DECLARED baseline, not the derived one. The coverage
    // test has already proven the two agree; comparing the app to the frozen
    // value here is what makes a matcher change visible even when the gate list
    // is untouched.
    cases.forEach((programCase, i) => {
      const note = PROGRAM_NOTES[programCase.id];
      expect
        .soft(
          results[i].status,
          `${programCase.id} best case` + (note ? ` — ${note.why}` : ""),
        )
        .toBe(PROGRAM_BEST_CASE[programCase.id]);
    });
  });

  test("every program that can be refused is refused for the specified reason", async ({ page }) => {
    await gotoReadyApp(page);
    const catalogue = await readCatalogue(page);
    const cases = buildAll(catalogue);

    const flattened = cases.flatMap((programCase) =>
      programCase.violations.map((violation) => ({ programCase, violation })),
    );

    const violationPersonas = flattened.map(({ programCase, violation }) => ({
      programId: programCase.id,
      answers: violation.answers,
    }));
    const results = await evaluateBatch(page, [
      ...violationPersonas,
      ...cases.map((programCase) => ({
        programId: programCase.id,
        answers: programCase.bestCase.answers,
      })),
    ]);
    const baselineNeeds = new Map(
      cases.map((programCase, i) => [programCase.id, results[violationPersonas.length + i].needs.length]),
    );

    flattened.forEach(({ programCase, violation }, i) => {
      expect
        .soft(
          results[i].status,
          `${programCase.id} with ${violation.gate} violated (${violation.name})`,
        )
        .toBe(violation.expect);

      // An externally gated program is already "almost" in its best case, so
      // another "almost" status proves nothing by itself. The violated gate has
      // only been exercised if the matcher exposes an additional unmet step.
      if (violation.expect === "almost") {
        const baselineNeedsLength = baselineNeeds.get(programCase.id);
        expect
          .soft(
            results[i].needs.length,
            `${programCase.id}: violating ${violation.gate} must add an unmet need, but the need count ` +
              `is unchanged at ${baselineNeedsLength} — this assertion would pass even if the gate were deleted`,
          )
          .toBeGreaterThan(baselineNeedsLength);
      }
    });
  });

  test("a refusal always says why, and a conditional result always says what to do", async ({ page }) => {
    await gotoReadyApp(page);
    const catalogue = await readCatalogue(page);
    const cases = buildAll(catalogue);

    const flattened = cases.flatMap((programCase) =>
      programCase.violations.map((violation) => ({ programCase, violation })),
    );
    const results = await evaluateBatch(
      page,
      flattened.map(({ programCase, violation }) => ({
        programId: programCase.id,
        answers: violation.answers,
      })),
    );

    // A status with nothing behind it is a dead end for someone who is tired,
    // in pain or short on time. "Not a match" owes them a reason; "one step
    // away" owes them the step.
    flattened.forEach(({ programCase, violation }, i) => {
      const result = results[i];
      if (result.status === "no") {
        expect
          .soft(result.reasons.length, `${programCase.id} refused via ${violation.gate} without a reason`)
          .toBeGreaterThan(0);
      }
      if (result.status === "almost") {
        expect
          .soft(result.needs.length, `${programCase.id} is one step away via ${violation.gate} but names no step`)
          .toBeGreaterThan(0);
      }
    });
  });

  test("ready stays reachable for every program with no external gate", async ({ page }) => {
    await gotoReadyApp(page);
    const catalogue = await readCatalogue(page);
    const cases = buildAll(catalogue).filter((c) => !c.externalGates.length);

    // The other half of the invariant. An oracle that only proves nothing is
    // ever ready would pass against a matcher that returns "almost" for
    // everything, which would be useless to a user and undetectable here.
    expect(cases.length, "no program is reachable at all — the catalogue or the oracle is wrong").toBeGreaterThan(0);

    const results = await evaluateBatch(
      page,
      cases.map((c) => ({ programId: c.id, answers: c.bestCase.answers })),
    );

    cases.forEach((programCase, i) => {
      expect
        .soft(
          results[i].status,
          `${programCase.id} has no external gate, so a person who meets all of ` +
            `${programCase.provableGates.join(", ")} must be able to reach ready`,
        )
        .toBe("ready");
    });
  });

  test("the matcher returns all three recorded outcome states across the catalogue", async ({ page }) => {
    await gotoReadyApp(page);
    const catalogue = await readCatalogue(page);
    const cases = buildAll(catalogue);

    const declaredTotals = { ready: 0, almost: 0, no: 0 };
    const noOutcomes = [];
    for (const programCase of cases) {
      const sets = outcomeSets(programCase);
      for (const state of Object.keys(declaredTotals)) declaredTotals[state] += sets[state].length;
      // A program with no answer-provable gate refuses nobody. That is a real
      // property of a federal credit gated only on money already spent, and it
      // is recorded rather than asserted away.
      if (!sets.no.length) noOutcomes.push(programCase.id);
    }

    const personas = cases.flatMap((programCase) => [
      { programId: programCase.id, answers: programCase.bestCase.answers },
      ...programCase.violations.map((violation) => ({
        programId: programCase.id,
        answers: violation.answers,
      })),
    ]);
    const results = await evaluateBatch(page, personas);
    const totals = { ready: 0, almost: 0, no: 0 };
    for (const result of results) {
      if (Object.hasOwn(totals, result.status)) totals[result.status] += 1;
    }

    expect.soft(totals.ready, "the matcher returned no ready outcome anywhere").toBeGreaterThan(0);
    expect.soft(totals.almost, "the matcher returned no almost outcome anywhere").toBeGreaterThan(0);
    expect.soft(totals.no, "the matcher returned no refusal anywhere").toBeGreaterThan(0);
    for (const state of Object.keys(totals)) {
      expect
        .soft(
          totals[state],
          `the matcher returned ${totals[state]} ${state} outcomes, but the recorded sets declare ${declaredTotals[state]}`,
        )
        .toBe(declaredTotals[state]);
    }

    console.log(
      `outcome sets — ready ${totals.ready}, almost ${totals.almost}, no ${totals.no}; ` +
        `${noOutcomes.length} programs refuse nobody: ${noOutcomes.join(", ") || "none"}`,
    );
  });
});
