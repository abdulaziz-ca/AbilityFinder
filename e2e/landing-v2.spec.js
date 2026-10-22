"use strict";
const { test, expect } = require("@playwright/test");
const { gotoReady } = require("./app-ready");

// Landing v2.1: the catalog explorer reads the real index, demos can be paused,
// and topic cards open the catalog on that topic.
test("catalog explorer filters by province and topic and opens a guide that returns home", async ({ page }) => {
  await gotoReady(page);
  const explorer = page.locator(".v2-explore");
  await expect(page.locator(".eyebrow").first()).toHaveText(/Canada-wide/);
  await expect(page.locator(".nav-tag")).toHaveText("Canada");
  await expect(explorer.locator(".v2-ex-item")).toHaveCount(5);
  const federal = Number(await page.locator("#v2ex-n").getAttribute("data-n"));

  await page.selectOption("#v2ex-prov", "ON");
  await expect.poll(() => page.locator("#v2ex-n").getAttribute("data-n").then(Number)).toBeGreaterThan(federal);
  await expect(page.locator("#v2ex-split")).toContainText("provincial");
  await explorer.locator('[data-ex-theme="getting-around"]').click();
  await expect(explorer.locator('[data-ex-theme="getting-around"]')).toHaveAttribute("aria-pressed", "true");
  await expect(explorer.locator(".v2-ex-item").first()).toBeVisible();
  // Program names come from the Ontario pack, so every listed item is a real record.
  const ids = await explorer.locator(".v2-ex-item").evaluateAll((items) => items.map((i) => i.dataset.id));
  expect(await page.evaluate((list) => list.every((id) => BENEFITS.some((b) => b.id === id && benefitTheme(b) === "getting-around")), ids)).toBe(true);

  await explorer.locator(".v2-ex-item").first().click();
  await expect(page.locator("#d-back")).toHaveText(/Back to the home page/);
  await page.locator("#d-back").click();
  await expect(page.locator(".v2-explore")).toBeVisible();
});

test("topic cards open the catalog on their topic", async ({ page }) => {
  await gotoReady(page);
  await page.locator('[data-cat-theme="health"]').click();
  await expect(page.locator('.browse-chip.on[data-btheme="health"]')).toBeVisible();
});

test("auto-playing demos can be paused, and stay still without motion", async ({ page }) => {
  await gotoReady(page);
  const pause = page.locator(".v2-compare .v2-pause");
  await pause.scrollIntoViewIfNeeded();
  if (await pause.isVisible()) {
    await pause.click();
    await expect(pause).toHaveAttribute("aria-pressed", "true");
    await expect(pause).toHaveAttribute("aria-label", "Play animation");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".v2-compare .v2-pause")).toBeHidden();
  await expect(page.locator(".v2-cmp")).toHaveAttribute("data-step", "4");
});

test("turning on less motion in the accessibility menu stops the landing demos at once", async ({ page }) => {
  await gotoReady(page);
  await expect(page.locator(".v2-compare .v2-pause")).toBeVisible();
  await page.locator("#a11yFab").click();
  await page.locator('.a11y-toggle[data-toggle="motion"]').click();
  await expect(page.locator("html")).not.toHaveClass(/\bmotion\b/);
  await expect(page.locator(".v2-compare .v2-pause")).toBeHidden();
  await expect(page.locator(".v2-cmp")).toHaveAttribute("data-step", "4");
});

test("results overview counts match the lists and its tiles jump to their sections", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(async () => {
    answers = { ...BLANK(), province: "AB", city: "Calgary", forWho: "self", ageBand: "19to59", ageGroup: "adult", citizenPR: true,
      disabilities: ["physical"], functionalNeeds: ["mobility"], income: "low" };
    await ensurePacks(["AB"]); setState("results");
  });
  const ready = page.locator(".v2-ov-tile.ok b");
  await expect(ready).toHaveText(String(await page.locator(".benefit.ready").count()));
  await expect(page.locator(".v2-ov-tile.q b")).toHaveText(String(await page.locator(".benefit.almost").count()));
  await page.locator(".v2-ov-tile.q").click();
  await expect(page.locator(".group-title.almost")).toBeFocused();
  // Answers are labelled; a skipped question says so instead of a dash.
  await expect(page.locator(".answers-bar .chip-q").first()).toHaveText("For");
  await expect(page.locator(".answers-bar .chip.empty").first()).toContainText("Not answered");
  await expect(page.locator(".answers-bar .chip-v", { hasText: /^—$/ })).toHaveCount(0);
});
