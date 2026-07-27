const { test, expect } = require("@playwright/test");

function answerModel(overrides = {}) {
  return {
    forWho: "self",
    disabilities: [],
    ageBand: "19to59",
    ageGroup: "adult",
    disabilityVerified: "yes",
    autismDiagnosis: null,
    onsetBefore18: null,
    canWalkFar: null,
    functionalNeeds: ["none"],
    province: "AB",
    msp: null,
    bcAssistance: null,
    circumstances: ["none"],
    citizenPR: true,
    dtc: "yes",
    situation: ["none"],
    income: "low",
    city: "Edmonton",
    postal: null,
    ...overrides,
  };
}

async function evaluateProfile(page, overrides = {}) {
  await page.goto("/");
  return page.evaluate((model) => {
    const evaluated = evaluateAnswers(model);
    return Object.fromEntries(
      evaluated.map(({ b, r }) => [
        b.id,
        {
          status: r.status,
          needs: r.needs.map((need) => ({
            text: need.text,
            actionUrl: need.action?.url || null,
          })),
          reasons: r.reasons,
        },
      ]),
    );
  }, answerModel(overrides));
}

test("unasked DTC and CPP criteria never become ready", async ({ page }) => {
  const results = await evaluateProfile(page, {
    situation: ["unableToWork"],
  });

  expect(results.dtc.status).toBe("almost");
  expect(results.dtc.needs).toHaveLength(2);
  expect(results["cpp-disability"].status).toBe("almost");
  expect(results["cpp-disability"].needs.map((need) => need.text).join(" ")).toMatch(
    /Statement of Contributions/i,
  );
});

test("Alberta core programs stay conditional until defining gates are confirmed", async ({ page }) => {
  const adult = await evaluateProfile(page, {
    disabilities: ["physical"],
    canWalkFar: false,
  });
  expect(adult["adult-health-benefit"].status).toBe("almost");
  expect(adult["parking-placard"].status).toBe("almost");

  const child = await evaluateProfile(page, {
    forWho: "child",
    ageBand: "6to11",
    ageGroup: "child",
    disabilities: ["physical"],
    canWalkFar: false,
  });
  expect(child.fscd.status).toBe("almost");

  const olderAdult = await evaluateProfile(page, {
    ageBand: "65plus",
    ageGroup: "senior",
    disabilities: ["intellectual"],
    onsetBefore18: true,
  });
  expect(olderAdult.pdd.status).toBe("almost");
  expect(olderAdult.pdd.reasons).not.toContain("This is for people aged 18–64.");
});

test("municipal recipient routes and placard vision criteria are not inferred", async ({ page }) => {
  const edmonton = await evaluateProfile(page, {
    dtc: "yes",
    situation: ["unableToWork"],
    city: "Edmonton",
  });
  expect(edmonton["edmonton-fare-assistance"].status).toBe("almost");

  const grandePrairie = await evaluateProfile(page, { city: "Grande Prairie" });
  expect(grandePrairie["grandeprairie-aish-pass"].status).toBe("almost");

  const stAlbert = await evaluateProfile(page, { city: "St. Albert" });
  expect(stAlbert["stalbert-subsidy"].status).toBe("almost");

  const vision = await evaluateProfile(page, {
    disabilities: ["vision"],
    city: "Calgary",
  });
  expect(vision["parking-placard"].status).toBe("almost");

  const noMobilityRoute = await evaluateProfile(page, {
    disabilities: ["mental"],
    city: "Calgary",
  });
  expect(noMobilityRoute["parking-placard"].status).toBe("no");
});

test("shared disability documentation no longer sends Alberta users to StudentAid BC", async ({ page }) => {
  const results = await evaluateProfile(page, {
    disabilityVerified: "no",
    situation: ["student"],
    city: "Calgary",
  });
  const albertaIds = ["adap", "dres", "ab-grant-disability"];
  const actionUrls = albertaIds.flatMap((id) =>
    (results[id]?.needs || []).map((need) => need.actionUrl).filter(Boolean),
  );

  expect(actionUrls).not.toContain(
    "https://studentaidbc.ca/apply/how-to-apply-disability-funding",
  );
});

test("DTC disability amount is not presented as cash, tax savings, or back-pay estimate", async ({ page }) => {
  await page.goto("/");
  const dtcModel = await page.evaluate(() => {
    const benefit = BENEFITS.find((entry) => entry.id === "dtc");
    const value = BENEFIT_VALUES.dtc;
    return {
      amount: benefit.amount,
      summary: benefit.summary,
      hasMasterKey: Object.prototype.hasOwnProperty.call(benefit, "masterKey"),
      excludeFromEstimate: value.excludeFromEstimate,
      annualMax: value.annualMax ?? null,
      annualTotal: reportAnnualTotal([{ b: benefit }]),
      moneyBand: renderMoneyBand([], [{ b: benefit, r: evaluate(benefit) }]),
      priorityScore: priorityScore(benefit),
    };
  });

  expect(dtcModel.amount).toMatch(/non-refundable tax credit/i);
  expect(dtcModel.summary).not.toMatch(/master key/i);
  expect(dtcModel.hasMasterKey).toBe(false);
  expect(dtcModel.excludeFromEstimate).toBe(true);
  expect(dtcModel.annualMax).toBeNull();
  expect(dtcModel.annualTotal).toBe(0);
  expect(dtcModel.moneyBand).not.toMatch(/back-pay|retroYears|\$25,000/i);
  expect(dtcModel.priorityScore).toBeLessThan(10);

  await expect(page.locator("body")).not.toContainText("$10,138");
  await expect(page.locator(".pv-hero-val")).toHaveText("Amounts vary");
});

test("DTC practitioner finder exposes the current scoped CRA certification matrix", async ({ page }) => {
  await page.goto("/");
  const signerModel = await page.evaluate(() => {
    const benefit = BENEFITS.find((entry) => entry.id === "dtc");
    return {
      matrix: DTC_SIGNER_SCOPES,
      html: practitionerFinder(benefit),
    };
  });

  expect(signerModel.matrix).toEqual([
    { name: "Medical doctor", search: "family doctor", scope: "All impairments" },
    { name: "Nurse practitioner", search: "nurse practitioner", scope: "All impairments" },
    { name: "Optometrist", search: "optometrist", scope: "Vision only" },
    { name: "Audiologist", search: "audiologist", scope: "Hearing only" },
    { name: "Occupational therapist", search: "occupational therapist", scope: "Walking, feeding or dressing only" },
    { name: "Physiotherapist", search: "physiotherapist", scope: "Walking only" },
    { name: "Psychologist", search: "psychologist", scope: "Mental functions only" },
    { name: "Speech-language pathologist", search: "speech-language pathologist", scope: "Speaking only" },
  ]);
  expect(signerModel.html).toContain("Who can certify depends on the functional category");
  expect(signerModel.html).toContain("Check the current CRA matrix");
  expect(signerModel.html).not.toContain("whoever you can get in to see soonest");
  expect(signerModel.html).not.toMatch(/podiatrist/i);
});

test("generated DTC guide uses corrected value and prioritization language", async ({ page }) => {
  const response = await page.request.get("/guides/dtc.html");
  expect(response.ok()).toBe(true);
  const guide = await response.text();

  expect(guide).toMatch(/non-refundable tax credit/i);
  expect(guide).not.toMatch(/master key|single most important step|\$10,138|up to \$25,000/i);
  expect(guide).toMatch(/refund depends on the tax situation for each year/i);
});

test("Alberta disability programs never return ready from unasked criteria", async ({ page }) => {
  const results = await evaluateProfile(page, {
    disabilityVerified: "yes",
    situation: ["unableToWork"],
    income: "low",
    functionalNeeds: ["equipment"],
    province: "AB",
    ageBand: "19to59",
    citizenPR: true,
  });

  const aishNeeds = results.aish.needs.map((need) => need.text).join(" ");
  const adapNeeds = results.adap.needs.map((need) => need.text).join(" ");
  const aadlNeeds = results.aadl.needs.map((need) => need.text).join(" ");
  const adultHealthNeeds = results["adult-health-benefit"].needs
    .map((need) => need.text)
    .join(" ");

  for (const id of ["aish", "adap", "aadl", "adult-health-benefit"]) {
    expect(results[id].status).toBe("almost");
  }

  expect(aishNeeds).toMatch(/\$100,000/);
  expect(aishNeeds).toMatch(/severe, permanent/);
  expect(adapNeeds).toMatch(/significantly impedes/);
  expect(adapNeeds).toMatch(/\$100,000/);
  expect(aadlNeeds).toMatch(/Alberta Health Care Insurance Plan/);
  expect(aadlNeeds).toMatch(/approved vendor/);
  expect(aadlNeeds).toMatch(/Veterans Affairs/);
  expect(adultHealthNeeds).toMatch(/\$16,580/);
  expect(adultHealthNeeds).toMatch(/high ongoing prescription drug needs/);

  expect(results.aadl.needs).toHaveLength(3);
  expect(results.aish.needs).toHaveLength(2);
  expect(results.adap.needs).toHaveLength(2);
  expect(results["adult-health-benefit"].needs).toHaveLength(2);
});

test("no Alberta answer combination reaches ready", async ({ page }) => {
  const targetIds = ["aish", "adap", "aadl", "adult-health-benefit"];
  await page.goto("/");

  for (const income of ["low", "moderate", "high"]) {
    for (const disabilityVerified of ["yes", "no", "unsure"]) {
      for (const situation of [["unableToWork"], ["working"], ["none"]]) {
        for (const functionalNeeds of [["equipment"], ["dailyLiving"], ["none"], ["unsure"]]) {
          const statuses = await page.evaluate(
            ({ model, ids }) => {
              const evaluated = evaluateAnswers(model);
              return Object.fromEntries(
                evaluated
                  .filter(({ b }) => ids.includes(b.id))
                  .map(({ b, r }) => [b.id, r.status]),
              );
            },
            {
              model: answerModel({
                income,
                disabilityVerified,
                situation,
                functionalNeeds,
                province: "AB",
                ageBand: "19to59",
                citizenPR: true,
              }),
              ids: targetIds,
            },
          );

          for (const id of targetIds) {
            expect(statuses[id]).not.toBe("ready");
          }
        }
      }
    }
  }
});

test("jurisdiction, age and status produce a clean no-match", async ({ page }) => {
  const albertaIds = ["aish", "adap", "aadl", "adult-health-benefit"];
  const adultProgramIds = ["aish", "adap", "adult-health-benefit"];

  const outsideAlberta = await evaluateProfile(page, {
    province: "BC",
    functionalNeeds: ["equipment"],
  });
  for (const id of albertaIds) expect(outsideAlberta[id].status).toBe("no");

  const senior = await evaluateProfile(page, { ageBand: "65plus" });
  for (const id of adultProgramIds) expect(senior[id].status).toBe("no");

  const nonCitizen = await evaluateProfile(page, { citizenPR: false });
  for (const id of adultProgramIds) expect(nonCitizen[id].status).toBe("no");

  const noEquipmentNeed = await evaluateProfile(page, { functionalNeeds: ["none"] });
  expect(noEquipmentNeed.aadl.status).toBe("no");
});

test("shared predicates are unchanged for other programs", async ({ page }) => {
  await page.goto("/");
  const sharedPredicateResults = await page.evaluate((model) => {
    const changedIds = new Set(["aish", "adap", "aadl", "adult-health-benefit"]);
    return evaluateAnswers(model)
      .filter(
        ({ b }) =>
          !changedIds.has(b.id) &&
          b.requires.some((requirement) =>
            ["disabilityDoc", "lowIncome"].includes(requirement),
          ),
      )
      .map(({ b, r }) => ({ id: b.id, status: r.status }));
  }, answerModel());

  expect(sharedPredicateResults.length).toBeGreaterThanOrEqual(6);
  expect(sharedPredicateResults.some(({ status }) => status === "ready")).toBe(true);
});

const bcWitnessIds = [
  "bc-pwd-designation",
  "bc-disability-assistance-pwd",
  "bc-cy-disability-benefit",
  "bc-fuel-tax-refund-disabilities",
  "bc-icbc-disability-discount",
  "bc-property-tax-deferment-disabilities",
  "bc-healthy-kids",
  "bc-workbc-employment-services",
  "coquitlam-far",
];

const qualifyingBcAdult = {
  province: "BC",
  city: "Coquitlam",
  ageBand: "19to59",
  citizenPR: true,
  msp: "yes",
  bcAssistance: "pwd",
  income: "low",
  functionalNeeds: ["dailyLiving", "equipment", "transitBarrier"],
  circumstances: ["vehicleOwner", "homeowner"],
  disabilities: ["physical"],
};

const qualifyingBcChild = {
  ...qualifyingBcAdult,
  forWho: "child",
  ageBand: "6to11",
  ageGroup: "child",
  functionalNeeds: ["childHighNeeds"],
  bcAssistance: "none",
  msp: "yes",
};

test("BC programs never return ready from unasked criteria", async ({ page }) => {
  const adult = await evaluateProfile(page, qualifyingBcAdult);
  for (const id of [
    "bc-pwd-designation",
    "bc-disability-assistance-pwd",
    "bc-fuel-tax-refund-disabilities",
    "bc-icbc-disability-discount",
    "bc-property-tax-deferment-disabilities",
    "bc-workbc-employment-services",
    "coquitlam-far",
  ]) {
    expect(adult[id].status).toBe("almost");
  }

  const child = await evaluateProfile(page, qualifyingBcChild);
  expect(child["bc-cy-disability-benefit"].status).toBe("almost");
  expect(child["bc-healthy-kids"].status).toBe("almost");
});

test("BC needs carry the official wording", async ({ page }) => {
  const adult = await evaluateProfile(page, qualifyingBcAdult);
  const child = await evaluateProfile(page, qualifyingBcChild);
  const needsText = (results, id) =>
    results[id].needs.map((need) => need.text).join(" ");

  expect(needsText(adult, "bc-disability-assistance-pwd")).toMatch(/\$100,000/);
  expect(needsText(adult, "bc-disability-assistance-pwd")).toMatch(/\$200,000/);
  expect(needsText(adult, "bc-pwd-designation")).toMatch(/prescribed-class/i);
  expect(needsText(adult, "bc-pwd-designation")).toMatch(/not automatically lost/i);
  expect(needsText(adult, "bc-pwd-designation")).toMatch(/at least two years/);
  expect(needsText(adult, "bc-disability-assistance-pwd")).toMatch(/at least two years/);
  expect(needsText(child, "bc-cy-disability-benefit")).toMatch(/April 1, 2027/);
  expect(needsText(child, "bc-cy-disability-benefit")).toMatch(/Support is available now/);
  expect(needsText(adult, "bc-fuel-tax-refund-disabilities")).toMatch(/BCANDS/);
  expect(needsText(adult, "bc-fuel-tax-refund-disabilities")).toMatch(/CNIB/);
  expect(needsText(adult, "bc-icbc-disability-discount")).toMatch(/registration is confirmed/);
  expect(needsText(adult, "bc-property-tax-deferment-disabilities")).toMatch(/25% equity/);
  expect(needsText(adult, "bc-property-tax-deferment-disabilities")).toMatch(/at least one year/);
  expect(needsText(child, "bc-healthy-kids")).toMatch(/\$42,000/);
  expect(needsText(adult, "bc-workbc-employment-services")).toMatch(/unemployed or underemployed/);
  expect(needsText(adult, "coquitlam-far")).toMatch(/refugees/);
  expect(needsText(adult, "coquitlam-far")).toMatch(/study or work permit/);
});

test("no BC answer combination reaches ready", async ({ page }) => {
  const models = [];
  for (const income of ["low", "moderate", "high"]) {
    for (const bcAssistance of ["pwd", "other", "none"]) {
      for (const msp of ["yes", "no"]) {
        for (const functionalNeeds of [
          ["dailyLiving"],
          ["equipment"],
          ["transitBarrier"],
          ["childHighNeeds"],
          ["none"],
        ]) {
          for (const circumstances of [["vehicleOwner", "homeowner"], ["none"]]) {
            for (const ageBand of ["6to11", "19to59", "65plus"]) {
              models.push(
                answerModel({
                  ...qualifyingBcAdult,
                  province: "BC",
                  income,
                  bcAssistance,
                  msp,
                  functionalNeeds,
                  circumstances,
                  ageBand,
                }),
              );
            }
          }
        }
      }
    }
  }

  await page.goto("/");
  const readyMatches = await page.evaluate(
    ({ profiles, ids }) =>
      profiles.flatMap((model, index) =>
        evaluateAnswers(model)
          .filter(({ b, r }) => ids.includes(b.id) && r.status === "ready")
          .map(({ b }) => ({ id: b.id, index, model })),
      ),
    { profiles: models, ids: bcWitnessIds },
  );

  expect(readyMatches).toEqual([]);
});

test("preserved BC no-match gates still fire", async ({ page }) => {
  const outsideBc = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    province: "AB",
    city: "Edmonton",
  });
  for (const id of bcWitnessIds) expect(outsideBc[id].status).toBe("no");

  const noMsp = await evaluateProfile(page, { ...qualifyingBcChild, msp: "no" });
  expect(noMsp["bc-healthy-kids"].status).toBe("no");

  const receivesPwd = await evaluateProfile(page, {
    ...qualifyingBcChild,
    bcAssistance: "pwd",
  });
  expect(receivesPwd["bc-healthy-kids"].status).toBe("no");

  const noAssistance = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    bcAssistance: "none",
  });
  // bcPwdStatus is fixed:false by design — someone without the designation can
  // still apply for it, so the program stays visible with a confirm step
  // rather than being hidden behind a hard no-match.
  expect(noAssistance["bc-property-tax-deferment-disabilities"].status).toBe("almost");
  expect(
    noAssistance["bc-property-tax-deferment-disabilities"].needs
      .map((need) => need.text)
      .join(" "),
  ).toMatch(/PWD designation or disability assistance/i);

  const noCircumstances = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    circumstances: ["none"],
  });
  expect(noCircumstances["bc-property-tax-deferment-disabilities"].status).toBe("no");
  expect(noCircumstances["bc-fuel-tax-refund-disabilities"].status).toBe("no");

  const adult = await evaluateProfile(page, {
    ...qualifyingBcChild,
    forWho: "self",
    ageBand: "19to59",
    ageGroup: "adult",
  });
  expect(adult["bc-cy-disability-benefit"].status).toBe("no");

  const outsideCoquitlam = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    city: "Kelowna",
  });
  expect(outsideCoquitlam["coquitlam-far"].status).toBe("no");
});

test("under-inclusion regressions are fixed", async ({ page }) => {
  const moderateIncomeFamily = await evaluateProfile(page, {
    ...qualifyingBcChild,
    income: "moderate",
    msp: "yes",
    bcAssistance: "none",
    forWho: "child",
    ageBand: "6to11",
  });
  expect(moderateIncomeFamily["bc-healthy-kids"].status).not.toBe("no");
  expect(moderateIncomeFamily["bc-healthy-kids"].status).toBe("almost");

  const unemployedAdult = await evaluateProfile(page, {
    ...qualifyingBcAdult,
    situation: ["none"],
    income: "low",
  });
  expect(unemployedAdult["bc-workbc-employment-services"].status).not.toBe("no");
  expect(unemployedAdult["bc-workbc-employment-services"].status).toBe("almost");
});

test("the Alberta slice is preserved", async ({ page }) => {
  const results = await evaluateProfile(page, {
    province: "AB",
    city: "Edmonton",
    ageBand: "19to59",
    citizenPR: true,
    disabilityVerified: "yes",
    situation: ["unableToWork"],
    income: "low",
    functionalNeeds: ["equipment"],
  });

  for (const id of ["aish", "adap", "aadl", "adult-health-benefit"]) {
    expect(results[id].status).toBe("almost");
  }
  expect(results.aish.needs).toHaveLength(2);
  expect(results.adap.needs).toHaveLength(2);
  expect(results.aadl.needs).toHaveLength(3);
  expect(results["adult-health-benefit"].needs).toHaveLength(2);
  expect(results.aish.needs.map((need) => need.text).join(" ")).toMatch(/\$100,000/);
});

test("shared predicates still serve their other consumers", async ({ page }) => {
  const changedIds = new Set([
    ...bcWitnessIds,
    "aish",
    "adap",
    "aadl",
    "adult-health-benefit",
  ]);
  await page.goto("/");
  const readyIds = await page.evaluate(
    ({ model, excludedIds }) =>
      evaluateAnswers(model)
        .filter(({ b, r }) => !excludedIds.includes(b.id) && r.status === "ready")
        .map(({ b }) => b.id),
    { model: answerModel(), excludedIds: [...changedIds] },
  );

  expect(readyIds.length).toBeGreaterThan(0);
});
