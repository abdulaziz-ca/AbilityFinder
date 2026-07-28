const { test, expect } = require("@playwright/test");

// Ordinary use must load only from AbilityFinder's own origin. User-initiated
// official/Maps links are covered separately and are not opened in this journey.
const ALLOWED_REQUEST_ORIGINS = new Set(["http://127.0.0.1:8766"]);

function collectPageErrors(page, errors) {
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
}

async function deleteAppStorage(page) {
  await page.goto("/");
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    if (window.AbilityFinderDB) await window.AbilityFinderDB.close();
    // `blocked` is NOT a failure. Per the IndexedDB spec it means another connection is
    // still open, so the delete request stays PENDING and fires `success` once they close.
    // The old code rejected on it, which turned a benign self-resolving state into a hard
    // failure — it broke two consecutive CI runs on WebKit, where releasing the handle
    // after close() is evidently not synchronous. Wait for the real outcome instead, and
    // only fail on a bounded timeout, reporting whether `blocked` had fired.
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase("abilityfinder");
      let blocked = false;
      const timer = setTimeout(() => {
        reject(new Error(
          `indexedDB.deleteDatabase("abilityfinder") did not complete within 15000ms` +
            (blocked ? " — it fired blocked, so a connection stayed open" : ""),
        ));
      }, 15000);
      const settle = (fn, value) => { clearTimeout(timer); fn(value); };
      request.onsuccess = () => settle(resolve);
      request.onerror = () => settle(reject, request.error);
      request.onblocked = () => { blocked = true; };
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
  const questionBefore = await page
    .locator("#wizard-question")
    .textContent()
    .catch(() => null);
  // The wizard is adaptive (skipIf() keys off answers.disabilities) and hasText
  // is a SUBSTRING match, so a stalled advance used to let the next pick() click
  // a plausible-looking option on the WRONG step — surfacing one or two steps
  // later as a zero-match locator that ate the full test timeout. Assert the
  // option belongs to the step actually on screen, so divergence fails HERE.
  const onScreen = await page.evaluate((wanted) => {
    const norm = (s) => String(s).replace(/\s+/g, " ").trim().toLowerCase();
    if (view !== "wizard") return { view };
    const step = visibleSteps()[stepIndex];
    if (!step) return { view, id: null, labels: [] };
    const labels = stepOptions(step).map((o) =>
      typeof o === "object" ? `${optionText(step, o)}${o.sub ? ` ${o.sub}` : ""}` : String(o),
    );
    const optionLabels = [...document.querySelectorAll("label.opt")].filter((el) =>
      norm(el.textContent).includes(norm(wanted)),
    );
    const pairedInput = optionLabels.length === 1
      ? document.getElementById(optionLabels[0].getAttribute("for"))
      : null;
    return {
      view,
      id: step.id,
      labels,
      matches: labels.filter((l) => norm(l).includes(norm(wanted))).length,
      type: step.type,
      alreadySelected: !!(pairedInput && pairedInput.checked),
      question: (document.getElementById("wizard-question") || {}).textContent || null,
    };
  }, text);
  if (onScreen.view !== "wizard") {
    throw new Error(`pick(${JSON.stringify(text)}): not in the wizard (view="${onScreen.view}")`);
  }
  if (onScreen.matches !== 1) {
    throw new Error(
      `pick(${JSON.stringify(text)}): wizard is on step "${onScreen.id}", whose options are ` +
        `[${onScreen.labels.join(" | ")}] — ${onScreen.matches} of them match. ` +
        `Expected exactly 1. The walk has diverged from the step this pick assumes.`,
    );
  }
  // A single-answer step auto-advances off the radio's change event, so clicking an
  // option that is ALREADY checked fires nothing: goNext never runs and the wizard
  // sits there. That is the one case that could hang, and it is knowable now rather
  // than after a wait — which is why the settle wait below no longer needs a short
  // bound. Multi-answer steps are excluded: re-clicking there legitimately deselects.
  if (onScreen.type !== "multi" && onScreen.alreadySelected) {
    throw new Error(
      `pick(${JSON.stringify(text)}) on step "${onScreen.id}": that option is already ` +
        `selected, so clicking it fires no change event and the wizard will never advance. ` +
        `The walk has already answered this step.`,
    );
  }
  await page.locator(".opt", { hasText: text }).click();
  // Single-answer steps auto-advance (goNext on a 150-200 ms timer); multi-answer
  // steps stay put and enable Continue. Wait for whichever actually happens rather
  // than sleeping past the longest timer.
  // Bounded and fatal. The only state that could never resolve — clicking an
  // already-checked radio — is now rejected before the click, so this bound is not
  // a hang guard: it is headroom for a loaded machine, and blowing it is a real
  // failure worth reporting rather than swallowing. A stall was observed here on a
  // full-suite run, which the old swallowed 3s bound had been hiding.
  await page
    .waitForFunction(
      (prev) => {
        const question = document.getElementById("wizard-question");
        const next = document.getElementById("next");
        if (!question) return true; // left the wizard entirely (e.g. results)
        if (question.textContent !== prev) return true; // auto-advanced
        return !!next && /Continue/.test(next.textContent || "") && !next.disabled;
      },
      questionBefore,
      { timeout: 20000 },
    )
    .catch(() => {
      throw new Error(
        `pick(${JSON.stringify(text)}) on step "${onScreen.id}": the wizard did not settle ` +
          `within 20000ms — it neither auto-advanced past ${JSON.stringify(questionBefore)} nor ` +
          `enabled a Continue button. The click landed but fired no change event, or goNext stalled.`,
      );
    });
  // Every step render animates the card in: .card gets `rise 0.5s`, which
  // translateY(10px)s the whole card — options included — while `.options` has a
  // 10px gap. Playwright decides an element is "stable" from two same-valued
  // bounding-box samples, and under load those two samples can land inside one
  // animation frame, so a click can be dispatched at stale coordinates and fall
  // into the gap BETWEEN two options: nothing is hit, no change event fires, and
  // the wizard sits. This wait used to be reachable only on multi-answer steps,
  // because it was gated on a "Continue" button that only multi steps render —
  // so single-answer steps, which are most of the walk, clicked into a moving
  // target. It is unconditional now.
  //
  // Only FINITE animations are awaited. The page also runs decorative infinite
  // ones (the aurora layers and .wiz-mountains drift), whose `finished` promise
  // never resolves; awaiting those would hang. The 1000ms race is a backstop for
  // an animation that fails to settle under CPU contention.
  const card = page.locator(".wizard-card");
  if (await card.count()) {
    await card
      .evaluate(async (el) => {
        const finite = el.getAnimations().filter((animation) => {
          const timing = animation.effect && animation.effect.getComputedTiming();
          return !timing || timing.iterations !== Infinity;
        });
        await Promise.race([
          Promise.all(finite.map((animation) => animation.finished.catch(() => {}))),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ]);
      }, undefined, { timeout: 5000 })
      .catch(() => {});
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
  await expect(page.locator(".opt.selected")).toHaveCount(0);

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
  await page.keyboard.press("Escape"); // a11y dialog is now modal (A11Y-03) — close it before using the assistant
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
  await expect(page.locator(".opt", { hasText: "In post-secondary school" })).toHaveCount(0);
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
