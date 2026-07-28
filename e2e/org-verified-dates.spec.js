const { test, expect } = require("@playwright/test");

async function renderOrganizationsView(page) {
  await page.evaluate(() => {
    document.getElementById("app").innerHTML = window.renderSafely(
      window.renderOrganizations,
      "orgs"
    );
  });
}

test("DATA-15: each organization card shows its own verified date", async ({ page }) => {
  await page.goto("/");
  await renderOrganizationsView(page);

  const cards = page.locator("#app article.org-card");
  const verifiedLines = page.locator("#app .org-verified");
  const cardCount = await cards.count();
  const lineCount = await verifiedLines.count();

  expect(lineCount).toBe(cardCount);
  const texts = await verifiedLines.allTextContents();
  for (const rawText of texts) {
    const text = rawText.replace(/\s+/g, " ").trim();
    expect(text).toMatch(/^Verified .*\d{4}$/);
    expect(text).not.toContain("{date}");
  }
});

test("the label is derived from the record, not hardcoded", async ({ page }) => {
  await page.goto("/");

  const labels = await page.evaluate(() => [
    window.orgVerifiedLabel({ verified: "2026-07-21" }),
    window.orgVerifiedLabel({ verified: "2026-09" }),
    window.orgVerifiedLabel({ verified: "2025-01-05" }),
  ]);

  expect(labels).toEqual(["July 2026", "September 2026", "January 2025"]);
});

test("missing or malformed dates omit the line instead of inventing one", async ({ page }) => {
  await page.goto("/");

  const labels = await page.evaluate(() => [
    window.orgVerifiedLabel({}),
    window.orgVerifiedLabel({ verified: "not-a-date" }),
    window.orgVerifiedLabel({ verified: "2026-13-01" }),
    window.orgVerifiedLabel({ verified: 20260721 }),
    window.orgVerifiedLabel({ verified: null }),
  ]);

  expect(labels).toEqual([null, null, null, null, null]);
});

test("no page errors and the view renders", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await renderOrganizationsView(page);

  const cardCount = await page.locator("#app article.org-card").count();
  expect(cardCount).toBeGreaterThanOrEqual(10);
  expect(pageErrors).toEqual([]);
});
