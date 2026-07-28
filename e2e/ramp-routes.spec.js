const { test, expect } = require("@playwright/test");

const RAMP_ID = "ramp";

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

const albertaProfile = {
  province: "AB",
  city: "Edmonton",
  ageBand: "19to59",
  citizenPR: true,
  disabilities: ["physical"],
  functionalNeeds: ["homeAccess"],
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
  }, answerModel({ ...albertaProfile, ...overrides }));
}

async function evaluateProfile(page, overrides = {}) {
  await page.goto("/");
  // app.js is a classic script; wait until it has actually executed before
  // touching its globals, so a slow or restarting dev server surfaces as a
  // clear wait rather than a confusing ReferenceError.
  await page.waitForFunction(() => typeof window.evaluateAnswers === "function");
  return evaluateLoadedProfile(page, overrides);
}

test("RAMP is a confirmation, never an approval", async ({ page }) => {
  const ramp = (await evaluateProfile(page))[RAMP_ID];

  expect(ramp.status).toBe("almost");
  expect(ramp.status).not.toBe("ready");
  expect(ramp.status).not.toBe("no");
});

test("income never denies RAMP", async ({ page }) => {
  for (const income of ["low", "moderate", "high"]) {
    const ramp = (await evaluateProfile(page, { income }))[RAMP_ID];

    expect(ramp.status, `income=${income}`).toBe("almost");
    expect(ramp.status, `income=${income}`).not.toBe("no");
  }
});

test("the needs name both unasked official routes", async ({ page }) => {
  const ramp = (await evaluateProfile(page))[RAMP_ID];
  const needsText = ramp.needs.map((need) => need.text).join(" ");

  expect(needsText).toMatch(/4-wheel walker/);
  expect(needsText).toMatch(/multiple sclerosis/);
  expect(needsText).toMatch(/\$36,900/);
  expect(needsText).toMatch(/90 continuous days/);
  expect(needsText).not.toMatch(/you qualify|you are eligible|approved/i);
});

test("preserved hard gates still fire", async ({ page }) => {
  const outsideAlberta = await evaluateProfile(page, {
    province: "BC",
    city: "Vancouver",
  });
  expect(outsideAlberta[RAMP_ID].status).toBe("no");

  const nonCitizen = await evaluateProfile(page, { citizenPR: false });
  expect(nonCitizen[RAMP_ID].status).toBe("no");

  const noHomeAccessNeed = await evaluateProfile(page, {
    functionalNeeds: ["none"],
  });
  expect(noHomeAccessNeed[RAMP_ID].status).toBe("no");
});

test("an unknown functional-need answer is not a denial", async ({ page }) => {
  const ramp = (
    await evaluateProfile(page, { functionalNeeds: ["unsure"] })
  )[RAMP_ID];

  expect(ramp.status).toBe("almost");
  expect(ramp.status).not.toBe("no");
});

test("RAMP can never reach ready", async ({ page }) => {
  await page.goto("/");
  // app.js is a classic script; wait until it has actually executed before
  // touching its globals, so a slow or restarting dev server surfaces as a
  // clear wait rather than a confusing ReferenceError.
  await page.waitForFunction(() => typeof window.evaluateAnswers === "function");

  for (const income of ["low", "moderate", "high"]) {
    for (const ageBand of ["19to59", "65plus"]) {
      for (const functionalNeeds of [
        ["homeAccess"],
        ["homeAccess", "equipment"],
        ["unsure"],
      ]) {
        const ramp = (
          await evaluateLoadedProfile(page, {
            income,
            ageBand,
            functionalNeeds,
          })
        )[RAMP_ID];
        const profile = `income=${income}, ageBand=${ageBand}, functionalNeeds=${functionalNeeds.join(",")}`;

        expect(ramp.status, profile).not.toBe("ready");
      }
    }
  }
});

test("the Alberta slice is unaffected", async ({ page }) => {
  const results = await evaluateProfile(page, {
    functionalNeeds: ["equipment"],
    situation: ["unableToWork"],
    income: "low",
  });

  for (const id of ["aish", "adap", "aadl", "adult-health-benefit"]) {
    expect(results[id].status).toBe("almost");
  }
  expect(results.aish.needs).toHaveLength(2);
  expect(results.adap.needs).toHaveLength(2);
  expect(results.aadl.needs).toHaveLength(3);
  expect(results["adult-health-benefit"].needs).toHaveLength(2);
});
