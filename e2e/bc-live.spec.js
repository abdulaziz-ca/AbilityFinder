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

async function completeBcWizard(page, forWho = "Myself") {
  await page.locator(".js-start").first().click();
  await pick(page, forWho);
  await pick(page, "Something else / not listed");
  await page.locator("#next").click();
  await pick(page, forWho === "Myself" ? "19 to 59" : "6 to 11");
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
  await pick(page, "19 to 59");
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
  await pick(page, "19 to 59");
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
});
