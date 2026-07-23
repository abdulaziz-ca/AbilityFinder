const { test, expect } = require("@playwright/test");

// Only the local app and the two disclosed Cloudflare Web Analytics endpoints may be requested.
const ALLOWED_REQUEST_ORIGINS = new Set([
  "http://127.0.0.1:8766",
  "https://static.cloudflareinsights.com",
  "https://cloudflareinsights.com",
]);
const CLOUDFLARE_INSIGHTS_ORIGINS = new Set([
  "https://static.cloudflareinsights.com",
  "https://cloudflareinsights.com",
]);

async function abortCloudflareInsights(context) {
  await context.route("**/*", async (route) => {
    const origin = new URL(route.request().url()).origin;
    if (CLOUDFLARE_INSIGHTS_ORIGINS.has(origin)) {
      await route.abort();
    } else {
      await route.continue();
    }
  });
}

function collectPageErrors(page, errors) {
  page.on("pageerror", (error) => {
    if (!error.message.includes("cloudflareinsights")) errors.push(error.message);
  });
}

test.beforeEach(async ({ context }) => {
  await abortCloudflareInsights(context);
});

async function deleteAppStorage(page) {
  await page.goto("/");
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    if (window.AbilityFinderDB) await window.AbilityFinderDB.close();
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase("abilityfinder");
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Database deletion blocked"));
    });
  });
  await page.reload();
  await expect(page.locator("#app h1")).toBeVisible();
}

async function storedState(page) {
  return page.evaluate(() => window.AbilityFinderDB.loadState({}));
}

async function expectHealthy(page) {
  await expect(page.locator("#app")).not.toBeEmpty();
  await expect(page.locator(".render-error")).toHaveCount(0);
}

async function pick(page, text) {
  await page.locator("button.opt", { hasText: text }).click();
  await page.waitForTimeout(230);
  const next = page.locator("#next");
  if (await next.count() && (await next.textContent()).includes("Continue")) {
    await page.locator(".wizard-card").evaluate(async (card) => {
      await Promise.all(card.getAnimations().map((animation) => animation.finished.catch(() => {})));
    });
  }
}

async function enterAge(page, age) {
  const label = age < 6 ? "Younger than 6"
    : age < 12 ? "6 to 11"
      : age < 16 ? "12 to 15"
        : age < 18 ? "16 to 17"
          : age === 18 ? "18"
            : age < 60 ? "19 to 59"
              : age < 65 ? "60 to 64" : "65 or older";
  await pick(page, label);
}

test("normal wizard cycle saves continuously and reloads from IndexedDB mid-flow", async ({ page, context }) => {
  const errors = [];
  const requests = [];
  collectPageErrors(page, errors);
  context.on("request", (request) => requests.push(request.url()));
  await deleteAppStorage(page);

  await page.locator(".js-start").first().click();
  await pick(page, "Myself");
  await pick(page, "Autism spectrum");
  await pick(page, "Physical / mobility");
  await page.locator("#next").click();
  await enterAge(page, 34);
  await pick(page, "Yes, it is documented");
  await pick(page, "Yes");
  await pick(page, "Yes, it began in childhood");
  await pick(page, "No, that's difficult or impossible");
  await pick(page, "Needs significant help, supervision");
  await page.locator("#next").click();

  await expect(page.locator(".step-q")).toContainText("Where do you live?");
  await expect.poll(async () => (await storedState(page)).answers.ageBand).toBe("19to59");
  await page.reload();
  await expect(page.locator(".step-q")).toContainText("Where do you live?");
  await expect(page.locator("button.opt.selected")).toHaveCount(0);

  await pick(page, "Alberta");
  await pick(page, "Yes");
  await pick(page, "No, not yet");
  await pick(page, "Working / have a job");
  await pick(page, "A disability stops me from working");
  await page.locator("#next").click();
  await pick(page, "Lower income");
  await page.locator("#selInput").selectOption("Calgary");

  await expect(page.locator(".results-head")).toBeVisible();
  await page.locator('[data-group="category"]').click();
  await page.locator("[data-track]").first().selectOption("submitted");
  await expect.poll(async () => {
    const state = await storedState(page);
    return state.ui.groupMode;
  }).toBe("category");

  const beforeClose = await storedState(page);
  expect(beforeClose.answers).toMatchObject({
    forWho: "self",
    disabilities: expect.arrayContaining(["autism", "physical"]),
    income: "low",
    city: "Calgary",
  });
  expect(beforeClose.view).toBe("results");
  expect(Object.values(beforeClose.progress)).toContain("submitted");

  await page.close();
  const recovered = await context.newPage();
  const recoveredErrors = [];
  collectPageErrors(recovered, recoveredErrors);
  await recovered.goto("/");
  await expect(recovered.locator(".results-head")).toBeVisible();
  await expect(recovered.locator('[data-group="category"]')).toHaveClass(/on/);
  await expectHealthy(recovered);

  // Run a second complete persona through the real controls. Reset must not let
  // the previous adult answers reappear after the next reload.
  await recovered.locator("#restart").click();
  await recovered.locator(".js-start").first().click();
  await pick(recovered, "My child");
  await pick(recovered, "Autism spectrum");
  await recovered.locator("#next").click();
  await enterAge(recovered, 9);
  await pick(recovered, "Yes, it is documented");
  await pick(recovered, "Yes");
  await pick(recovered, "Yes, it began in childhood");
  await pick(recovered, "Has very high or complex developmental support needs");
  await recovered.locator("#next").click();
  await pick(recovered, "Alberta");
  await pick(recovered, "Yes");
  await pick(recovered, "I'm not sure what that is");
  await pick(recovered, "In elementary school");
  await recovered.locator("#next").click();
  await pick(recovered, "Middle income");
  await recovered.locator("#selInput").selectOption("Edmonton");
  await expect(recovered.locator(".results-head")).toBeVisible();
  await expect.poll(async () => (await storedState(recovered)).answers.forWho).toBe("child");
  await recovered.reload();
  await expect(recovered.locator(".results-head")).toBeVisible();
  expect((await storedState(recovered)).answers).toMatchObject({
    forWho: "child",
    ageBand: "6to11",
    ageGroup: "child",
    city: "Edmonton",
  });

  expect(requests.every((url) => ALLOWED_REQUEST_ORIGINS.has(new URL(url).origin))).toBe(true);
  expect(errors).toEqual([]);
  expect(recoveredErrors).toEqual([]);
});

test("browse filters, UI flags and consent recover while free text stays out of persistence", async ({ page }) => {
  await deleteAppStorage(page);

  await page.locator(".js-browse").first().click();
  await page.locator("#browseInput").fill("tax");
  await page.locator('[data-btheme="money"]').click();
  await page.locator('[data-blevel="Federal"]').click();
  await page.locator('[data-bdis="physical"]').click();
  await page.locator("#themeToggle").click();
  await page.locator("#a11yFab").click();
  await page.locator('[data-toggle="contrast"]').click();
  await page.locator("#askFab").click();
  await page.locator("#askAccept").click();

  await expect.poll(async () => (await storedState(page)).ui.askConsent).toBe(true);
  await page.reload();
  await expect(page.locator("#browseInput")).toHaveValue("tax");
  await expect(page.locator('[data-btheme="money"]')).toHaveClass(/on/);
  await expect(page.locator('[data-blevel="Federal"]')).toHaveClass(/on/);
  await expect(page.locator('[data-bdis="physical"]')).toHaveClass(/on/);
  await expect(page.locator("body")).toHaveClass(/a11y-contrast/);

  // A postal code is useful for a one-off Maps link, but is free text and is not
  // among the selections this migration is allowed to retain.
  // Open a guide that is guaranteed to include the practitioner finder. Browse
  // ordering is editorial and may change without affecting this privacy boundary.
  await page.locator('.js-detail[data-id="dtc"]').click();
  await page.locator("#finderPostal").fill("T2P 1J9");
  await page.locator("#d-back").click();
  await expect.poll(async () => JSON.stringify(await storedState(page))).not.toContain("T2P 1J9");

  const state = await storedState(page);
  expect(state.ui).toMatchObject({
    browseQuery: "tax",
    browseTheme: "money",
    browseLevel: "Federal",
    browseDis: "physical",
    askConsent: true,
  });
  expect(JSON.stringify(state)).not.toContain("askHistory");
  expect(JSON.stringify(state)).not.toContain("postal");
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(await page.evaluate(() => document.cookie)).toBe("");
  await expectHealthy(page);
});

test("legacy browser state is sanitized before migration and restores its help route", async ({ page }) => {
  await deleteAppStorage(page);
  await page.evaluate(() => {
    localStorage.setItem("abilityfinder.v2", JSON.stringify({
      answers: {
        forWho: "self",
        disabilities: ["physical", "not-in-catalog"],
        province: "AB",
        city: "Calgary",
        situation: ["working", "not-in-catalog"],
        income: "low",
        postal: "T2P 1J9",
        unexpected: "privacy-canary",
      },
      view: "help",
      stepIndex: 2,
      helpTopic: "disabilities",
      helpReturnStep: 2,
      groupMode: "category",
      applied: { dtc: true, "not-a-benefit": true },
      unexpectedRoot: "privacy-canary",
    }));
    localStorage.setItem("abilityfinder.theme", "light");
  });

  await page.reload();
  await expect(page.locator("#hp-back")).toBeVisible();
  const migrated = await storedState(page);
  expect(migrated.answers).toMatchObject({
    forWho: "self",
    disabilities: ["physical"],
    province: "AB",
    city: "Calgary",
    situation: ["working"],
    income: "low",
  });
  expect(migrated.answers.postal).toBeUndefined();
  expect(migrated.answers.unexpected).toBeUndefined();
  expect(migrated.unexpectedRoot).toBeUndefined();
  expect(migrated.progress).toEqual({ dtc: "submitted" });
  expect(migrated.ui.groupMode).toBe("category");
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("abilityfinder.")))).toEqual([]);

  await page.locator("#hp-back").click();
  await expect(page.locator(".step-q")).toBeVisible();
  await expect.poll(async () => {
    const state = await storedState(page);
    return { view: state.view, stepIndex: state.stepIndex };
  }).toEqual({ view: "wizard", stepIndex: 2 });
});

test("an older child session missing its age range resumes there instead of showing adult school choices", async ({ page }) => {
  await deleteAppStorage(page);
  await page.evaluate(async () => {
    await window.AbilityFinderDB.saveState({
      schemaVersion: 1,
      answers: {
        forWho: "child",
        disabilities: ["other"],
        ageBand: null,
        ageGroup: "child",
        disabilityVerified: "yes",
        autismDiagnosis: null,
        onsetBefore18: null,
        canWalkFar: null,
        functionalNeeds: ["none"],
        province: "AB",
        msp: null,
        bcAssistance: null,
        circumstances: [],
        citizenPR: true,
        dtc: "no",
        situation: [],
        income: null,
        city: null,
      },
      view: "wizard",
      stepIndex: 9,
      detailId: null,
      detailFrom: "results",
      helpTopic: null,
      helpReturnStep: 0,
      progress: {},
      ui: {},
    });
  });

  await page.reload();
  await expect(page.locator(".step-q")).toHaveText("How old is your child?");
  await expect(page.locator("button.opt", { hasText: "In post-secondary school" })).toHaveCount(0);
});

const personas = [
  {
    name: "self",
    answers: { forWho: "self", disabilities: ["autism", "physical"], ageBand: "19to59", ageGroup: "adult", disabilityVerified: "yes", autismDiagnosis: "yes", functionalNeeds: ["dailyLiving", "transitBarrier"], onsetBefore18: true, canWalkFar: false, province: "AB", msp: null, bcAssistance: null, circumstances: [], citizenPR: true, dtc: "no", situation: ["working", "student"], income: "low", city: "Calgary" },
  },
  {
    name: "child",
    answers: { forWho: "child", disabilities: ["autism", "physical"], ageBand: "6to11", ageGroup: "child", disabilityVerified: "yes", autismDiagnosis: "yes", functionalNeeds: ["childHighNeeds", "childThreeAdls", "transitBarrier"], onsetBefore18: true, canWalkFar: false, province: "AB", msp: null, bcAssistance: null, circumstances: [], citizenPR: true, dtc: "unsure", situation: ["elementary"], income: "moderate", city: "Edmonton" },
  },
  {
    name: "family",
    answers: { forWho: "family", disabilities: ["other"], ageBand: "65plus", ageGroup: "senior", disabilityVerified: "yes", autismDiagnosis: null, functionalNeeds: ["none"], onsetBefore18: null, canWalkFar: null, province: "other", msp: null, bcAssistance: null, circumstances: [], citizenPR: true, dtc: "yes", situation: ["none"], income: "high", city: null },
  },
];

for (const persona of personas) {
  test(`${persona.name} persona restores and renders every persisted route safely`, async ({ page }) => {
    const errors = [];
    collectPageErrors(page, errors);
    await deleteAppStorage(page);

    for (const viewState of [
      { view: "landing" },
      { view: "wizard", stepIndex: 0 },
      { view: "results" },
      { view: "browse" },
      { view: "detail", detailId: "dtc" },
      { view: "privacy" },
      { view: "about" },
      { view: "support" },
      { view: "updates" },
      { view: "accessibility" },
      { view: "professionals" },
      { view: "partner-overview" },
      { view: "impact" },
      { view: "dtc-prep" },
      { view: "grants" },
      { view: "organizations" },
      { view: "help", helpTopic: "dtc", helpReturnStep: 4 },
    ]) {
      await page.evaluate(async ({ answers, viewState }) => {
        const current = await window.AbilityFinderDB.loadState({});
        await window.AbilityFinderDB.saveState({
          ...current,
          answers,
          view: viewState.view,
          stepIndex: viewState.stepIndex || 0,
          detailId: viewState.detailId || null,
          detailFrom: "results",
          helpTopic: viewState.helpTopic || null,
          helpReturnStep: viewState.helpReturnStep || 0,
          progress: {},
          ui: current.ui || {},
        });
      }, { answers: persona.answers, viewState });
      await page.reload();
      await expectHealthy(page);
      if (viewState.view === "help") {
        await expect(page.locator("#hp-back")).toBeVisible();
        await expect(page.locator("#app")).not.toContainText("Not found.");
      }
    }

    expect(errors).toEqual([]);
  });
}

test("the app fails visible with clean defaults when IndexedDB is unavailable", async ({ browser }) => {
  const context = await browser.newContext();
  await abortCloudflareInsights(context);
  await context.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", { configurable: true, value: undefined });
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("#app h1")).toBeVisible();
  await expect(page.locator("#app h1")).toContainText("Every benefit");
  await expectHealthy(page);
  await context.close();
});

test("a stale second tab cannot overwrite newer wizard state", async ({ page, context }) => {
  await deleteAppStorage(page);
  const stale = await context.newPage();
  const errors = [];
  collectPageErrors(stale, errors);
  await stale.goto("/");

  await page.locator(".js-start").first().click();
  await expect.poll(async () => (await storedState(page)).view).toBe("wizard");

  await stale.locator(".js-browse").first().click();
  await expect(stale.locator(".step-q")).toBeVisible();
  expect((await storedState(stale)).view).toBe("wizard");
  expect(errors).toEqual([]);
});
