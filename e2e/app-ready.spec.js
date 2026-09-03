"use strict";
const { test, expect } = require("@playwright/test");
const { gotoReady } = require("./app-ready");

// Proves the #200 readiness guard: after gotoReady the SPA is fully wired, so a
// click dispatched immediately lands on a real listener instead of being lost.
test("gotoReady yields a fully wired app (history.state set, FAB responds)", async ({ page }) => {
  await gotoReady(page);
  expect(await page.evaluate(() => history.state !== null)).toBe(true);
  // wireAccessibility() ran: the accessibility FAB opens its dialog on click.
  await page.locator("#a11yFab").click();
  await expect(page.locator("#a11yPanel")).toBeVisible();
});
