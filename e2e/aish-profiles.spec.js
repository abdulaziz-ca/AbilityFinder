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
    functionalNeeds: ["equipment"],
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
  // app.js is a classic script; wait until it has actually executed before
  // touching its globals, so a slow or restarting dev server surfaces as a
  // clear wait rather than a confusing ReferenceError.
  await page.waitForFunction(() => typeof window.evaluateAnswers === "function");
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

// The wizard cannot distinguish episodic work or leave states. That is exactly
// why a work-impact answer must never be treated as an eligibility adjudication.
const profiles = {
  unableToWork: { situation: ["unableToWork"] },
  working: { situation: ["working"] },
  episodicPartTime: { situation: ["working", "unableToWork"] },
  leaveFromWork: { situation: ["none"], disabilityVerified: "yes" },
  lowIncome: { situation: ["none"], income: "low" },
};

async function evaluateAllProfiles(page) {
  const entries = [];
  for (const [name, overrides] of Object.entries(profiles)) {
    entries.push([name, await evaluateProfile(page, overrides)]);
  }
  return Object.fromEntries(entries);
}

const needsText = (results) => results.aish.needs.map((need) => need.text).join(" ");

test("AISH is never ready for any work-impact answer", async ({ page }) => {
  const resultsByProfile = await evaluateAllProfiles(page);

  for (const results of Object.values(resultsByProfile)) {
    expect(results.aish.status).toBe("almost");
    expect(results.aish.status).not.toBe("ready");
  }
});

test("AISH always shows both conservative confirmation needs", async ({ page }) => {
  const resultsByProfile = await evaluateAllProfiles(page);

  for (const results of Object.values(resultsByProfile)) {
    expect(results.aish.needs).toHaveLength(2);
    expect(needsText(results)).toMatch(/permanently prevents employment/);
    expect(needsText(results)).toMatch(/\$100,000/);
  }
});

test("a lay work-impact answer never becomes an official verdict", async ({ page }) => {
  const results = await evaluateProfile(page, profiles.unableToWork);
  const joinedNeeds = needsText(results);

  expect(joinedNeeds).toMatch(/AISH decides/);
  expect(joinedNeeds).not.toMatch(/you qualify|you are eligible|approved/i);
});

test("the same reviewed wording appears for every profile", async ({ page }) => {
  const resultsByProfile = await evaluateAllProfiles(page);
  const reviewedWording = Object.values(resultsByProfile).map(needsText);

  for (const wording of reviewedWording.slice(1)) {
    expect(wording).toBe(reviewedWording[0]);
  }
});

test("ADAP and the Alberta slice are unaffected", async ({ page }) => {
  const results = await evaluateProfile(page, profiles.unableToWork);

  expect(results.adap.status).toBe("almost");
  expect(results.adap.needs).toHaveLength(2);
  expect(results.aadl.status).toBe("almost");
  expect(results.aadl.needs).toHaveLength(3);
  expect(results["adult-health-benefit"].status).toBe("almost");
  expect(results["adult-health-benefit"].needs).toHaveLength(2);
});
