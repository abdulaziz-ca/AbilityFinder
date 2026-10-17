const { test, expect } = require("@playwright/test");
const { gotoReady } = require("./app-ready");

// "What we don't cover yet" (task #206): the city lists come from the matcher,
// so a city with a local program must never appear and one without must.
test("the coverage page lists only communities with no local program", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => setState("coverage"));
  const cities = page.locator(".legal-block").nth(1);
  await expect(cities).toContainText("Communities with no local program");
  for (const none of ["Wetaskiwin", "Williams Lake", "Timmins"]) await expect(cities).toContainText(none);
  const text = await cities.innerText();
  const listed = new Set(text.split(/[:,.\n]/).map((s) => s.trim()).filter(Boolean));
  for (const covered of ["Calgary", "Vancouver", "Toronto", "Nanaimo", "Kingston"]) {
    expect(listed.has(covered), covered).toBe(false);
  }
});

test("the main menu opens the coverage page", async ({ page }) => {
  await gotoReady(page);
  await page.locator("#headerMenuToggle").click();
  await page.locator('[data-nav="coverage"]').click();
  await expect(page.locator("h1.legal-title")).toHaveText("What we don’t cover yet");
});
