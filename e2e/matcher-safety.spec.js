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
