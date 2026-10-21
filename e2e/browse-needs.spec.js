const { test, expect } = require("@playwright/test");
const { gotoReadyAllPrograms } = require("./app-ready");

async function openBrowse(page) {
  await gotoReadyAllPrograms(page);
  await page.locator(".js-browse").first().click();
  await expect(page.locator("#browseResults .browse-card").first()).toBeVisible();
}
const total = (page) => page.locator("#browseResults .browse-card").count();
// Name + whether each rendered card carries the "aimed at this" marker, in order.
const cards = (page) => page.locator("#browseResults .browse-card").evaluateAll((els) =>
  els.map((el) => ({ name: el.querySelector("h3").textContent.trim(), match: el.classList.contains("dis-match") })));

test.describe("Browse by disability and need", () => {
  test("vision puts vision programs first and the note counts them", async ({ page }) => {
    await openBrowse(page);
    const all = await total(page);
    await page.locator('[data-bdis="vision"]').click();
    const list = await cards(page);
    expect(list.length).toBe(all);
    expect(list[0].match).toBe(true);
    const note = page.locator(".browse-disnote").first();
    const n = Number((await note.textContent()).match(/(\d+) program/)[1]);
    expect(n).toBeGreaterThan(0);
    expect(list.filter((c) => c.match).length).toBeGreaterThanOrEqual(n);
    // matches are contiguous at the top
    expect(list.findIndex((c) => !c.match)).toBeGreaterThanOrEqual(n);
  });

  test("Getting around puts paratransit first without hiding anything", async ({ page }) => {
    await openBrowse(page);
    const all = await total(page);
    await page.locator('[data-bneed="transitBarrier"]').click();
    const list = await cards(page);
    expect(list.length).toBe(all);
    expect(list[0].match).toBe(true);
    expect(list[0].name).toMatch(/transit|handi|dart|bus|paratransit|mobility|ride|taxi|travel/i);
    await expect(page.locator(".browse-neednote")).toContainText("aimed specifically at this need");
    await page.locator('[data-bneed="all"]').click();
    await expect(page.locator(".browse-neednote")).toHaveCount(0);
    expect(await total(page)).toBe(all);
  });

  test("with both rows chosen, programs matching both come before either", async ({ page }) => {
    await openBrowse(page);
    await page.locator('[data-bdis="physical"]').click();
    await page.locator('[data-bneed="equipment"]').click();
    const ranks = await page.evaluate(() => browseFiltered().map((b) =>
      (isDisSpecific(b, "physical") ? 1 : 0) + (isNeedSpecific(b, "equipment") ? 1 : 0)));
    expect(ranks.length).toBeGreaterThan(0);
    expect(ranks).toEqual([...ranks].sort((a, b) => b - a));
    expect(ranks[0]).toBe(2);
    expect(ranks).toContain(1);
  });

  test("need chips work from the keyboard", async ({ page }) => {
    await openBrowse(page);
    const chip = page.locator('[data-bneed="homeAccess"]');
    await chip.focus();
    await expect(chip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-bneed="homeAccess"]')).toHaveClass(/on/);
    const any = page.locator('[data-bneed="all"]');
    await any.focus();
    await page.keyboard.press("Space");
    await expect(page.locator('[data-bneed="all"]')).toHaveClass(/on/);
    await expect(page.locator(".browse-neednote")).toHaveCount(0);
  });
});
