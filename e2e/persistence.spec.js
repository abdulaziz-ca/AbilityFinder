const { test, expect } = require("@playwright/test");

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
}

test("normal wizard cycle saves continuously and reloads from IndexedDB mid-flow", async ({ page, context }) => {
  const errors = [];
  const requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  context.on("request", (request) => requests.push(request.url()));
  await deleteAppStorage(page);

  await page.locator(".js-start").first().click();
  await pick(page, "Myself");
  await pick(page, "Autism spectrum");
  await pick(page, "Physical / mobility");
  await page.locator("#next").click();
  await pick(page, "Yes, it began in childhood");
  await pick(page, "No, that's difficult or impossible");
  await pick(page, "18 to 64");

  await expect(page.locator(".step-q")).toContainText("live in Alberta");
  await expect.poll(async () => (await storedState(page)).stepIndex).toBe(5);
  await page.reload();
  await expect(page.locator(".step-q")).toContainText("live in Alberta");
  await expect(page.locator("button.opt.selected")).toHaveCount(0);

  await pick(page, "Yes, I live in Alberta");
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
  recovered.on("pageerror", (error) => recoveredErrors.push(error.message));
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
  await pick(recovered, "Yes, it began in childhood");
  await pick(recovered, "Yes, I live in Alberta");
  await pick(recovered, "Yes");
  await pick(recovered, "I'm not sure what that is");
  await pick(recovered, "None of these");
  await recovered.locator("#next").click();
  await pick(recovered, "Middle income");
  await recovered.locator("#selInput").selectOption("Edmonton");
  await expect(recovered.locator(".results-head")).toBeVisible();
  await expect.poll(async () => (await storedState(recovered)).answers.forWho).toBe("child");
  await recovered.reload();
  await expect(recovered.locator(".results-head")).toBeVisible();
  expect((await storedState(recovered)).answers).toMatchObject({
    forWho: "child",
    ageGroup: "child",
    city: "Edmonton",
  });

  expect(requests.every((url) => new URL(url).origin === "http://127.0.0.1:8766")).toBe(true);
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
  await page.locator(".js-detail").first().click();
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

const personas = [
  {
    name: "self",
    answers: { forWho: "self", disabilities: ["autism", "physical"], ageGroup: "adult", onsetBefore18: true, canWalkFar: false, province: "AB", citizenPR: true, dtc: "no", situation: ["working", "student"], income: "low", city: "Calgary", retroYears: 5 },
  },
  {
    name: "child",
    answers: { forWho: "child", disabilities: ["autism", "physical"], ageGroup: "child", onsetBefore18: true, canWalkFar: false, province: "AB", citizenPR: true, dtc: "unsure", situation: ["none"], income: "moderate", city: "Edmonton", retroYears: 5 },
  },
  {
    name: "family",
    answers: { forWho: "family", disabilities: ["other"], ageGroup: "senior", onsetBefore18: null, canWalkFar: null, province: "other", citizenPR: true, dtc: "yes", situation: ["none"], income: "high", city: null, retroYears: 5 },
  },
];

for (const persona of personas) {
  test(`${persona.name} persona restores and renders every persisted route safely`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await deleteAppStorage(page);

    for (const viewState of [
      { view: "landing" },
      { view: "wizard", stepIndex: 0 },
      { view: "results" },
      { view: "browse" },
      { view: "detail", detailId: "dtc" },
      { view: "privacy" },
      { view: "updates" },
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
  stale.on("pageerror", (error) => errors.push(error.message));
  await stale.goto("/");

  await page.locator(".js-start").first().click();
  await expect.poll(async () => (await storedState(page)).view).toBe("wizard");

  await stale.locator(".js-browse").first().click();
  await expect(stale.locator(".step-q")).toBeVisible();
  expect((await storedState(stale)).view).toBe("wizard");
  expect(errors).toEqual([]);
});
