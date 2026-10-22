const { test, expect } = require("@playwright/test");

// Static guides follow the visitor's theme and display settings (site audit
// 2026-10, D-ENGINEERING P2-5). They used to always render dark.

// Design v2 (owner decision 2026-10-21): dark is the default even when the device
// prefers light; a theme the visitor saved still wins (next test, and the light save below).
test("a guide starts dark in design v2 when nothing is saved, and honours a saved light theme", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  await page.goto("/guides/aadl.html");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveClass(/\bv2\b/);
  await page.evaluate(() => window.AbilityFinderDB.saveState({ schemaVersion: 2, answers: {}, view: "landing", progress: {}, ui: { theme: "light" } }));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".nav-tag")).toHaveText("Canada");
  await context.close();
});

test("a saved theme, contrast and text size apply on a guide", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  await page.goto("/guides/aadl.html");
  await page.evaluate(() => window.AbilityFinderDB.saveState({
    schemaVersion: 2, answers: {}, view: "landing", progress: {},
    ui: { theme: "dark", a11y: { fontScale: 1.25, contrast: true, spacing: false, links: false, guide: false, motion: false } },
  }));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveClass(/a11y-contrast/);
  await expect.poll(() => page.evaluate(() => document.documentElement.style.fontSize)).toBe("20px");
  await context.close();
});

test("the guides index is labelled Canada-wide", async ({ page }) => {
  await page.goto("/guides/");
  await expect(page.locator(".eyebrow").first()).toHaveText("Canada-wide · federal, provincial and local programs");
});
