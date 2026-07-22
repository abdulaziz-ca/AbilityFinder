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
  await page.locator("button.opt", { hasText: text }).click();
  await page.waitForTimeout(230);
}

async function enterAge(page, age) {
  await page.locator("#numberInput").fill(String(age));
  await page.locator("#next").click();
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
  await expect(matched.getByRole("heading", { name: "WorkBC Employment Services", exact: true })).toHaveCount(0);
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

test("children and eighteen-year-olds receive age-appropriate regular-school choices", async ({ page }) => {
  const cases = [
    { age: 4, expected: ["In child care or preschool"] },
    { age: 9, expected: ["In elementary school"] },
    { age: 14, expected: ["In junior high or high school"] },
    { age: 17, expected: ["In junior high or high school"] },
    { age: 18, expected: ["In junior high or high school", "In post-secondary school"] },
  ];

  for (const [index, item] of cases.entries()) {
    if (index) await deleteAppStorage(page);
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
      await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
    }
    if (item.age !== 18) {
      await expect(page.getByRole("button", { name: "In post-secondary school", exact: true })).toHaveCount(0);
    }
  }
});

test("exact age field rejects unsafe values and accepts age cutoffs", async ({ page }) => {
  await page.locator(".js-start").first().click();
  await pick(page, "Myself");
  await pick(page, "Something else / not listed");
  await page.locator("#next").click();

  const age = page.locator("#numberInput");
  for (const invalid of ["-1", "18.5", "121"]) {
    await age.fill(invalid);
    await expect(page.locator("#next")).toBeDisabled();
  }
  await age.fill("18");
  await expect(page.locator("#next")).toBeEnabled();
  await page.locator("#next").click();
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
