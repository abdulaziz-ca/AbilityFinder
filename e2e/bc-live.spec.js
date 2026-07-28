const { test, expect } = require("@playwright/test");

const ALBERTA_PROGRAM = /AISH|Alberta Adult Health|Alberta Child Health|AADL|Persons with Developmental Disabilities|Family Support for Children with Disabilities|Disability Related Employment Supports/i;

async function deleteAppStorage(page) {
  await page.goto("/");
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    if (window.AbilityFinderDB) await window.AbilityFinderDB.close();
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase("abilityfinder");
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("Database deletion blocked"));
    });
  });
  await page.reload();
  await expect(page.locator("#app h1")).toBeVisible();
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

async function completeBcWizard(page, forWho = "Myself") {
  await page.locator(".js-start").first().click();
  await pick(page, forWho);
  await pick(page, "Something else / not listed");
  await page.locator("#next").click();
  await enterAge(page, forWho === "Myself" ? 34 : 9);
  await pick(page, "Yes, it is documented");
  await pick(page, forWho === "Myself" ? "None of these" : "Has very high or complex developmental support needs");
  await page.locator("#next").click();
  await pick(page, "British Columbia");
  await pick(page, "Yes");
  await pick(page, "None of these");
  await pick(page, "None of these");
  await page.locator("#next").click();
  await pick(page, "Yes");
  await pick(page, "No, not yet");
  await pick(page, forWho === "Myself" ? "None of these" : "In elementary school");
  await page.locator("#next").click();
  await pick(page, "Lower income");
  await page.locator("#selInput").selectOption("Vancouver");
  await expect(page.locator(".results-head")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await deleteAppStorage(page);
});

test("BC residents receive BC and federal results without Alberta programs", async ({ page }) => {
  await completeBcWizard(page);
  const matched = page.locator(".benefits-grid");
  await expect(matched.getByRole("heading", { name: "Fair PharmaCare", exact: true })).toHaveCount(1);
  await expect(matched.locator("h3").filter({ hasText: ALBERTA_PROGRAM })).toHaveCount(0);
  await expect(matched.getByRole("heading", { name: "Leisure Access Program (LAP)", exact: true })).toHaveCount(1);
  await expect(matched.getByRole("heading", { name: "Local transit & recreation discounts", exact: true })).toHaveCount(0);
  await expect(matched.getByRole("heading", { name: "Autism Funding: Under Age 6", exact: true })).toHaveCount(0);
  await expect(matched.getByRole("heading", { name: "BC Children and Youth Disability Benefit", exact: true })).toHaveCount(0);
});

test("BC child journey reaches child disability programs", async ({ page }) => {
  await completeBcWizard(page, "My child");
  const matched = page.locator(".benefits-grid");
  await expect(matched.getByRole("heading", { name: "BC Children and Youth Disability Benefit", exact: true })).toHaveCount(1);
  await expect(matched.getByRole("heading", { name: "Autism Funding: Under Age 6", exact: true })).toHaveCount(0);
  await expect(matched.getByRole("heading", { name: "Autism Funding: Ages 6-18", exact: true })).toHaveCount(0);
  await expect(matched.locator("h3").filter({ hasText: ALBERTA_PROGRAM })).toHaveCount(0);
  await expect(page.locator('[data-result-grant="variety-bc"]')).toBeVisible();
  await expect(page.locator('[data-result-grant="cknw-kids-fund"]')).toBeVisible();
  await expect(page.locator('[data-result-grant="variety-ab"]')).toHaveCount(0);
  await expect(page.locator(".program-kind", { hasText: "Charitable fund" }).first()).toBeVisible();
  const schoolSupport = page.locator(".support-section", { hasText: "Prepare for a school support meeting" });
  await schoolSupport.locator("summary").click();
  await expect(schoolSupport.locator(".support-card", { hasText: "Prepare for a school support meeting" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Disability Alliance BC" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Voice of Albertans with Disabilities (VAD)" })).toHaveCount(0);
});

test("BC directories show BC resources and keep Alberta entries out", async ({ page }) => {
  await completeBcWizard(page);
  await page.locator('[data-info-nav="grants"]').last().click();
  await expect(page.locator('[data-grant-id="variety-bc"]')).toBeVisible();
  await expect(page.locator('[data-grant-id="cp-cares"]')).toHaveCount(0);
  await page.locator("[data-grants-back]").first().click();
  await page.locator('[data-info-nav="organizations"]').click();
  await expect(page.locator('[data-org-id="dabc"]')).toBeVisible();
  await expect(page.locator('[data-org-id="vad"]')).toHaveCount(0);
  await page.locator("[data-orgs-back]").first().click();
  await expect(page.locator(".site-footer")).toHaveCSS("text-align", "center");
  await expect(page.locator(".site-footer")).toHaveCSS("align-items", "center");
});

test("BC adult post-secondary answers exclude child and unrelated work programs", async ({ page }) => {
  await page.locator(".js-start").first().click();
  await pick(page, "Myself");
  await pick(page, "Learning disability");
  await page.locator("#next").click();
  await enterAge(page, 22);
  await pick(page, "Yes, it is documented");
  await pick(page, "None of these");
  await page.locator("#next").click();
  await pick(page, "British Columbia");
  await pick(page, "Yes");
  await pick(page, "None of these");
  await pick(page, "None of these");
  await page.locator("#next").click();
  await pick(page, "Yes");
  await pick(page, "No, not yet");
  await pick(page, "In post-secondary school");
  await page.locator("#next").click();
  await pick(page, "Middle income");
  await page.locator("#selInput").selectOption("Vancouver");

  const matched = page.locator(".benefits-grid");
  await expect(matched.getByRole("heading", { name: "B.C. Access Grant for Students with Disabilities", exact: true })).toHaveCount(1);
  await expect(matched.getByRole("heading", { name: "Learning Disability Assessment Bursary", exact: true })).toHaveCount(1);
  await expect(matched.getByRole("heading", { name: "Autism Funding: Under Age 6", exact: true })).toHaveCount(0);
  await expect(matched.getByRole("heading", { name: "BC Children and Youth Disability Benefit", exact: true })).toHaveCount(0);
  await expect(matched.getByRole("heading", { name: "Work-Able Accessible Employment Program (BC Public Service)", exact: true })).toHaveCount(0);
  // BC-BC-14: WorkBC officially covers final-year post-secondary students with
  // disabilities, so the card is shown with a "confirm which route applies"
  // step rather than hidden. It can never reach "ready".
  await expect(matched.getByRole("heading", { name: "WorkBC Employment Services", exact: true })).toHaveCount(1);
  await expect(matched.locator(".program-kind", { hasText: "Government grant/bursary" }).first()).toBeVisible();
  await expect(page.locator('[data-result-grant="variety-bc"]')).toHaveCount(0);
});

test("Alberta adult post-secondary answers exclude child programs", async ({ page }) => {
  await page.locator(".js-start").first().click();
  await pick(page, "Myself");
  await pick(page, "Learning disability");
  await page.locator("#next").click();
  await enterAge(page, 22);
  await pick(page, "Yes, it is documented");
  await pick(page, "None of these");
  await page.locator("#next").click();
  await pick(page, "Alberta");
  await pick(page, "Yes");
  await pick(page, "No, not yet");
  await pick(page, "In post-secondary school");
  await page.locator("#next").click();
  await pick(page, "Middle income");
  await page.locator("#selInput").selectOption("Calgary");

  const matched = page.locator(".benefits-grid");
  await expect(matched.getByRole("heading", { name: "Canada Student Grant for Students with Disabilities", exact: true })).toHaveCount(1);
  await expect(matched.getByRole("heading", { name: "Family Support for Children with Disabilities (FSCD)", exact: true })).toHaveCount(0);
  await expect(matched.getByRole("heading", { name: "Child Disability Benefit", exact: true })).toHaveCount(0);
  await expect(matched.getByRole("heading", { name: "Alberta Child Health Benefit", exact: true })).toHaveCount(0);
});

// Split from one looping test: five full wizard walks in a single test made it
// the longest in the suite and it timed out under CI and matrix load. Separate
// tests keep each walk well inside the budget and name the failing age case.
const schoolChoiceCases = [
  { age: 4, expected: ["In child care or preschool"] },
  { age: 9, expected: ["In elementary school"] },
  { age: 14, expected: ["In junior high or high school"] },
  { age: 17, expected: ["In junior high or high school"] },
  { age: 18, expected: ["In junior high or high school", "In post-secondary school"] },
];

for (const item of schoolChoiceCases) {
  test(`age ${item.age} receives age-appropriate regular-school choices`, async ({ page }) => {
    await page.locator(".js-start").first().click();
    await pick(page, "My child");
    await pick(page, "Something else / not listed");
    await page.locator("#next").click();
    await enterAge(page, item.age);
    await pick(page, "Yes, it is documented");
    await pick(page, "None of these");
    await page.locator("#next").click();
    await pick(page, "Alberta");
    await pick(page, "Yes");
    await pick(page, "No, not yet");

    for (const label of item.expected) {
      await expect(page.getByRole("checkbox", { name: label, exact: true })).toBeVisible();
    }
    if (item.age !== 18) {
      await expect(page.getByRole("checkbox", { name: "In post-secondary school", exact: true })).toHaveCount(0);
    }
  });
}

test("age question uses eight tap targets and no typed field", async ({ page }) => {
  await page.locator(".js-start").first().click();
  await pick(page, "Myself");
  await pick(page, "Something else / not listed");
  await page.locator("#next").click();

  await expect(page.locator("#numberInput")).toHaveCount(0);
  await expect(page.locator(".options .opt")).toHaveCount(8);
  await expect(page.getByRole("radio", { name: /Younger than 6/ })).toBeVisible();
  await expect(page.getByRole("radio", { name: /65 or older/ })).toBeVisible();
  await pick(page, "18");
  await expect(page.getByRole("heading", { name: /documented your disability/i })).toBeVisible();
});

test("one-step-away guide uses a compact direct-action card without clipping", async ({ page }) => {
  await completeBcWizard(page);
  await page.evaluate(() => {
    answers.msp = "unknown";
    setState("detail", { detailId: "bc-fair-pharmacare" });
  });

  const card = page.locator(".side-card");
  await expect(card.getByText("Before you can apply", { exact: true })).toBeVisible();
  await expect(card.getByText("Confirm B.C. Medical Services Plan enrolment first.", { exact: true })).toBeVisible();
  await expect(card.getByRole("link", { name: /Check or apply for MSP/ })).toHaveAttribute("href", /eligibility-and-enrolment/);
  await expect(page.getByRole("heading", { name: "What it can provide", exact: true })).toBeVisible();

  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 800 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    const clipped = await card.evaluate((element) => element.scrollHeight > element.clientHeight + 1);
    expect(clipped).toBe(false);
  }
});

test("every uncertainty choice has contextual help and returns to its question", async ({ page }) => {
  const openHelpAndReturn = async (title) => {
    await expect(page.locator("#sideNote")).toBeVisible();
    await page.locator("#sideNote").click();
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await page.locator("#hp-back").click();
    await expect(page.locator("#sideNote")).toBeVisible();
  };

  await page.locator(".js-start").first().click();
  await pick(page, "My child");
  await pick(page, "Autism spectrum");
  await page.locator("#next").click();
  await enterAge(page, 9);

  await openHelpAndReturn("What “documented” means here");
  await pick(page, "Yes, it is documented");
  await openHelpAndReturn("How to tell whether the diagnosis meets B.C. standards");
  await pick(page, "Yes");
  await pick(page, "Yes, it began in childhood");
  await openHelpAndReturn("Choose what is true in everyday life");
  await pick(page, "None of these");
  await page.locator("#next").click();
  await pick(page, "British Columbia");
  await openHelpAndReturn("How to check MSP enrolment");
  await pick(page, "I'm not sure");
  await openHelpAndReturn("PWD, disability assistance and other statuses");
  await pick(page, "I'm not sure");
  await openHelpAndReturn("What the ownership and graduation choices mean");
  await pick(page, "I'm not sure");
  await page.locator("#next").click();
  await pick(page, "Yes");
  await openHelpAndReturn("How to tell if you have the DTC");
});

test("browse filters distinguish BC provincial and local programs", async ({ page }) => {
  await page.locator(".js-browse").first().click();
  await page.locator('[data-blevel="British Columbia"]').click();
  await expect(page.locator("#browseResults .benefit").first()).toBeVisible();
  await expect(page.locator("#browseResults .tag.lvl").filter({ hasNotText: "British Columbia" })).toHaveCount(0);

  await page.locator('[data-blevel="local"]').click();
  await expect(page.locator("#browseResults .tag.lvl").filter({ hasText: /^Vancouver$/ })).toBeVisible();
  await expect(page.locator("#browseResults .tag.lvl", { hasText: /^(Federal|Alberta|British Columbia)$/ })).toHaveCount(0);
});

test("impact page includes both provinces and all listed municipalities", async ({ page }) => {
  await page.locator('[data-info-nav="impact"]').click();
  await expect(page.locator(".impact-page")).toBeVisible();
  const expectedMunicipalities = await page.evaluate(() => new Set(CITIES_WITH_PROGRAMS).size);
  const municipalityMetric = page.locator(".impact-metric", { hasText: "municipalities with local programs" });
  await expect(municipalityMetric.locator("strong")).toHaveText(String(expectedMunicipalities));
  await expect(page.locator('.impact-levels span', { hasText: "provincial" }).locator("b")).not.toHaveText("0");
});

test("footer and accessibility controls reflow at a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.locator("#a11yFab").click();
  await page.locator('[data-toggle="contrast"]').click();
  await page.locator('[data-toggle="motion"]').click();
  await expect(page.locator("body")).toHaveClass(/a11y-contrast/);
  await expect(page.locator("body")).toHaveClass(/a11y-nomotion/);
  await page.locator("#a11yClose").click();
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator(".site-footer")).toHaveCSS("text-align", "center");
  await expect(page.locator(".disclaimer")).toHaveCSS("text-align", "center");
  const disclaimerCenterOffset = await page.locator(".disclaimer").evaluate((element) => {
    const box = element.getBoundingClientRect();
    return Math.abs((box.left + box.right) / 2 - document.documentElement.clientWidth / 2);
  });
  expect(disclaimerCenterOffset).toBeLessThanOrEqual(1);
});
