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

test("static guide has an On this page list that follows the reader", async ({ page }) => {
  await page.goto("/guides/aish.html");
  const toc = page.locator(".v2-toc");
  await expect(toc).toBeVisible();
  await expect(toc.locator("ol a").first()).toHaveAttribute("aria-current", "true");
  const tips = toc.locator("ol a", { hasText: "Practical tips" });
  await tips.click();
  await expect(tips).toHaveAttribute("aria-current", "true");
  await expect(toc.locator(".v2-toc-apply")).toHaveAttribute("href", /alberta\.ca/);
});

test("guides index shows each program as a card with its level", async ({ page }) => {
  await page.goto("/guides/");
  const card = page.locator(".gi-item").first();
  await expect(card.locator(".gi-lvl")).toBeVisible();
  await expect(card.locator(".gi-dash")).toBeHidden();
});

test("in-app guide lists its sections and jumps to one", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(async () => { await ensurePacks(["AB"]); detailFrom = "browse"; setState("detail", { detailId: "aish" }); });
  // Related programs' data can finish loading and re-render the guide; let that settle first.
  await page.waitForLoadState("networkidle");
  const link = page.locator(".v2-toc ol a", { hasText: "What you'll need" });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.locator(".detail-main .guide-h", { hasText: "What you'll need" })).toBeFocused();
  await expect(link).toHaveAttribute("aria-current", "true");
});

test("with Reduce motion saved, the home page headline and buttons are visible after a reload", async ({ page }) => {
  await gotoReady(page);
  await page.locator("#a11yFab").click();
  await page.locator('.a11y-toggle[data-toggle="motion"]').click();
  await page.waitForTimeout(400);
  await page.reload();
  await expect(page.locator("body")).toHaveClass(/a11y-nomotion/);
  for (const sel of [".hero-title", ".hero-cta .js-start"]) {
    await expect(page.locator(sel)).toBeVisible();
    await expect.poll(() => page.locator(sel).evaluate((el) => getComputedStyle(el.closest(".hero-title, .hero-cta")).opacity)).toBe("1");
  }
});

test("wizard rail shows answered questions and reopens one", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => { answers = { ...BLANK(), forWho: "self", disabilities: ["physical"] }; setState("wizard", { stepIndex: 2 }); });
  const rail = page.locator(".v2-rail");
  await expect(rail.locator("li.current")).toHaveAttribute("aria-current", "step");
  await expect(rail.locator("li.done")).toHaveCount(2);
  await expect(rail.locator("li.done").nth(1)).toContainText("Physical / mobility");
  await rail.locator("[data-rail-step='1']").click();
  await expect(page.locator("#wizard-question")).toHaveText(/Which of these apply to you/);
});

test("catalog filters sit in labelled groups and Clear filters resets them", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => setState("browse"));
  const all = await page.locator("#browseResults .browse-card").count();
  await expect(page.locator("#bClear")).toBeHidden();
  await expect(page.getByRole("group", { name: "Where" })).toBeVisible();
  await page.locator('[data-blevel="Federal"]').click();
  await expect(page.locator("#bClear")).toBeVisible();
  expect(await page.locator("#browseResults .browse-card").count()).toBeLessThan(all);
  await page.locator("#bClear").click();
  await expect(page.locator('[data-blevel="all"]')).toHaveClass(/on/);
  await expect(page.locator("#browseResults .browse-card")).toHaveCount(all);
  await expect(page.locator("#browseInput")).toBeFocused();
});

test("organizations directory filters by place (with Canada-wide entries) and by search", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => setState("organizations"));
  const cards = page.locator("#app article.org-card");
  const visible = () => page.locator("#app article.org-card:not([hidden])").count();
  const all = await cards.count();
  await expect(page.locator("#dirCount")).toHaveText(`${all} listed`);
  await page.locator('[data-dir-place="ON"]').click();
  await expect(page.locator('[data-dir-place="ON"]')).toHaveAttribute("aria-pressed", "true");
  const onCount = await visible();
  expect(onCount).toBeGreaterThan(0);
  expect(onCount).toBeLessThan(all);
  expect(await page.locator("#app article.org-card:not([hidden])").evaluateAll((els) => els.every((e) => /\bON\b|\bCA\b/.test(e.dataset.dirWhere)))).toBe(true);
  await page.locator('[data-dir-place="all"]').click();
  await page.locator("#dirSearch").fill("zzzz-no-such-org");
  await expect(page.locator("#dirEmpty")).toBeVisible();
  await expect(page.locator("#dirCount")).toHaveText("0 listed");
});

test("info pages get an On this page list and older data changes fold away", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => setState("privacy"));
  const toc = page.locator("section.legal .v2-toc");
  await expect(toc).toBeVisible();
  const link = toc.locator("ol a").nth(2);
  const name = (await link.textContent()).trim();
  await link.click();
  await expect(page.locator("section.legal .legal-block h2", { hasText: name })).toBeFocused();
  await page.evaluate(() => setState("updates"));
  const more = page.locator(".v2-more");
  await expect(more).toBeVisible();
  await expect(page.locator(".updates-changelog").first().locator(".updates-feed-item")).toHaveCount(15);
  await more.locator("summary").click();
  await expect(more.locator(".updates-feed-item").first()).toBeVisible();
});

test("catalog filter chips are in French on the French site, English unchanged", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => setState("browse"));
  await expect(page.locator('[data-blevel="Federal"]')).toHaveText("Federal");
  await page.evaluate(() => { LANG = "fr"; render(); });
  await expect(page.locator('[data-blevel="Federal"]')).toHaveText("Fédéral");
  await expect(page.locator('[data-blevel="British Columbia"]')).toHaveText("Colombie-Britannique");
  await expect(page.locator('[data-bdis="physical"]')).toHaveText("Physique / mobilité");
  await expect(page.locator('[data-btheme="all"]')).toHaveText("Toutes les catégories");
});

test("help topic and partner overview render with the v2 layout", async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => { helpReturnStep = 1; helpTopic = "disabilities"; setState("help"); });
  await expect(page.locator(".helppage .pt-item")).not.toHaveCount(0);
  await page.locator("#hp-back2").click();
  await expect(page.locator("#wizard-question")).toBeVisible();
  await page.evaluate(() => setState("partner-overview"));
  await expect(page.locator(".partner-metrics > div")).toHaveCount(2);
  await expect(page.locator("#partnerOverview")).not.toContainText("does not track visitors");
});
