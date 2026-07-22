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
}

async function completeBcWizard(page, forWho = "Myself") {
  await page.locator(".js-start").first().click();
  await pick(page, forWho);
  await pick(page, "Something else / not listed");
  await page.locator("#next").click();
  if (forWho === "Myself") await pick(page, "18 to 64");
  await pick(page, "British Columbia");
  await pick(page, "Yes");
  await pick(page, "No, not yet");
  await pick(page, "None of these");
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
});

test("BC child journey reaches child disability programs", async ({ page }) => {
  await completeBcWizard(page, "My child");
  const matched = page.locator(".benefits-grid");
  await expect(matched.getByRole("heading", { name: "BC Children and Youth Disability Benefit", exact: true })).toHaveCount(1);
  await expect(matched.locator("h3").filter({ hasText: ALBERTA_PROGRAM })).toHaveCount(0);
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
