"use strict";

const { test, expect } = require("@playwright/test");
const { gotoReady } = require("./app-ready");

async function openTypicalResults(page) {
  await gotoReady(page);
  await page.evaluate(async () => {
    answers = {
      ...BLANK(), province: "AB", city: "Calgary", forWho: "self",
      ageBand: "19to59", ageGroup: "adult", citizenPR: true,
      disabilities: ["physical"], functionalNeeds: ["mobility"], income: "low",
    };
    await ensurePacks(["AB"]);
    setState("results");
  });
  await expect(page.locator(".limits-panel")).toBeVisible();
}

test("results limits disclosure opens by keyboard and links to coverage", async ({ page }) => {
  await openTypicalResults(page);
  const panel = page.locator(".limits-panel");
  const summary = panel.locator("summary");

  await page.locator("#restart").focus();
  await page.keyboard.press("Tab");
  await expect(summary).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(panel).toHaveAttribute("open", "");

  await panel.locator('[data-nav="coverage"]').click();
  await expect(page.locator("h1.legal-title")).toHaveText("What we don’t cover yet");
});

test("results limits disclosure uses the French summary", async ({ page }) => {
  await openTypicalResults(page);
  await page.locator("#langBtn").click();
  await expect(page.locator(".limits-panel summary")).toHaveText("Ce que cette liste ne peut pas vous dire");
});

test("a static guide includes the guide limit sentence", async ({ page }) => {
  await page.goto("/guides/aish.html");
  await expect(page.locator(".guide-limit")).toHaveText(
    "What this guide can't tell you: whether you will be approved. The program decides, often using details we do not ask for."
  );
});
