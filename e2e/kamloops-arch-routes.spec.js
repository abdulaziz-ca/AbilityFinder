const { test, expect } = require("@playwright/test");

const ARCH_ID = "kamloops-arch";

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

const kamloopsProfile = {
  province: "BC",
  city: "Kamloops",
  ageBand: "19to59",
  citizenPR: true,
  msp: "yes",
  functionalNeeds: ["equipment"],
  disabilityVerified: "yes",
};

async function evaluateLoadedProfile(page, overrides = {}) {
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
          requires: b.requires,
        },
      ]),
    );
  }, answerModel({ ...kamloopsProfile, ...overrides }));
}

async function evaluateProfile(page, overrides = {}) {
  await page.goto("/");
  // app.js is a classic script; wait until it has actually executed before
  // touching its globals, so a slow or restarting dev server surfaces as a
  // clear wait rather than a confusing ReferenceError.
  await page.waitForFunction(() => typeof window.evaluateAnswers === "function");
  return evaluateLoadedProfile(page, overrides);
}

test("low income without assistance is a confirmation, not an approval", async ({ page }) => {
  const results = await evaluateProfile(page, {
    income: "low",
    bcAssistance: "none",
  });
  const arch = results[ARCH_ID];

  expect(arch.status).toBe("almost");
  expect(arch.status).not.toBe("ready");
  expect(arch.status).not.toBe("no");
});

test("a qualifying assistance recipient on moderate income is never denied", async ({ page }) => {
  const moderate = await evaluateProfile(page, {
    income: "moderate",
    bcAssistance: "pwd",
  });

  expect(moderate[ARCH_ID].status).toBe("almost");
  expect(moderate[ARCH_ID].status).not.toBe("no");

  const high = await evaluateProfile(page, {
    income: "high",
    bcAssistance: "pwd",
  });
  expect(high[ARCH_ID].status).not.toBe("no");
});

test("moderate income without assistance is a confirmation, not a denial", async ({ page }) => {
  const results = await evaluateProfile(page, {
    income: "moderate",
    bcAssistance: "none",
  });

  expect(results[ARCH_ID].status).toBe("almost");
});

test("the wrong city is still a clean no-match", async ({ page }) => {
  const kelowna = await evaluateProfile(page, {
    city: "Kelowna",
    income: "low",
    bcAssistance: "none",
  });
  expect(kelowna[ARCH_ID].status).toBe("no");

  const alberta = await evaluateProfile(page, {
    province: "AB",
    city: "Edmonton",
    income: "low",
    bcAssistance: "none",
  });
  expect(alberta[ARCH_ID].status).toBe("no");
});

test("unknown or incomplete assistance status is a confirmation, not a denial", async ({ page }) => {
  for (const bcAssistance of ["unsure", null]) {
    for (const income of ["low", "moderate"]) {
      const results = await evaluateProfile(page, { bcAssistance, income });
      expect(
        results[ARCH_ID].status,
        `income=${income}, bcAssistance=${String(bcAssistance)}`,
      ).toBe("almost");
    }
  }
});

test("the confirmation need names all three official routes", async ({ page }) => {
  const results = await evaluateProfile(page, {
    income: "low",
    bcAssistance: "none",
  });
  const needsText = results[ARCH_ID].needs.map((need) => need.text).join(" ");

  expect(needsText).toMatch(/Ministry of Social Development and Poverty Reduction/);
  expect(needsText).toMatch(/Statistics Canada Low Income Guidelines/);
  expect(needsText).toMatch(/Canadian pension or long-term disability/);
  expect(needsText).not.toMatch(/you qualify|you are eligible|approved/i);
});

test("ARCH can never return ready", async ({ page }) => {
  await page.goto("/");
  // app.js is a classic script; wait until it has actually executed before
  // touching its globals, so a slow or restarting dev server surfaces as a
  // clear wait rather than a confusing ReferenceError.
  await page.waitForFunction(() => typeof window.evaluateAnswers === "function");

  for (const income of ["low", "moderate", "high"]) {
    for (const bcAssistance of ["pwd", "other", "none", "unsure"]) {
      const results = await evaluateLoadedProfile(page, { income, bcAssistance });
      const status = results[ARCH_ID].status;

      expect(status, `income=${income}, bcAssistance=${bcAssistance}`).toBe("almost");
      expect(status).not.toBe("ready");
      expect(status).not.toBe("no");
    }
  }
});

test("the shared lowIncome predicate still serves other programs", async ({ page }) => {
  const results = await evaluateProfile(page, {
    province: "BC",
    city: "Vancouver",
    income: "high",
  });
  const lowIncomeNoMatches = Object.entries(results).filter(
    ([id, result]) =>
      id !== ARCH_ID &&
      result.requires.includes("lowIncome") &&
      result.status === "no",
  );

  expect(lowIncomeNoMatches.length).toBeGreaterThan(0);
});

test("the BC-BC-17 KamPASS separation is preserved", async ({ page }) => {
  await page.goto("/");
  // app.js is a classic script; wait until it has actually executed before
  // touching its globals, so a slow or restarting dev server surfaces as a
  // clear wait rather than a confusing ReferenceError.
  await page.waitForFunction(() => typeof window.evaluateAnswers === "function");
  const note = await page.evaluate(
    (id) => BENEFITS.find((benefit) => benefit.id === id)?.note || "",
    ARCH_ID,
  );

  expect(note).toMatch(/does not establish that you are eligible for KamPASS/);
});
