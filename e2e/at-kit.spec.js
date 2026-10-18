const { test, expect } = require('@playwright/test');
const { gotoReady, waitForAppReady } = require('./app-ready');
const { personas, seedSnippet } = require('../scripts/at-kit-seed');

async function expectGroupedTotal(page, ready, almost) {
  const cards = await page.locator('.benefit.almost').count();
  const rows = await page.locator('[data-result-group]').count();
  expect(cards + rows).toBe(almost);
  await expect(page.locator('.benefit.ready')).toHaveCount(ready);
}

for (const persona of personas) {
  test(`AT kit seed: ${persona.id}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // No app scripts can race the fixture transaction on this document.
    await page.goto('/robots.txt', { waitUntil: 'domcontentloaded' });
    const requests = [];
    page.on('request', request => requests.push(request.url()));
    await page.evaluate(snippet => (0, eval)(snippet), seedSnippet(persona));
    expect(requests).toEqual([]);
    await gotoReady(page);
    await expect(page.locator('.results-head')).toBeVisible();
    // Fixed expectations, independent of the evaluator: changes need a kit review.
    const counts = {
      // Okotoks is no longer a lead outside its Alberta service area.
      // 2026-10-17 provincial sweep: income-tested provincial benefits added (kit reviewed).
      'ab-self': [3, 23], 'bc-child': [6, 24], 'on-family': [6, 22],
      'bc-self': [10, 24], 'no-matches': [0, 11], returning: [3, 23],
    };
    const [ready, almost] = counts[persona.id];
    await expect(page.locator('.benefit.ready')).toHaveCount(ready);
    // Presentation groups: G1 cards + G2/G3 rows still account for every matched program.
    await expect(page.locator('.results-head h1')).toHaveText('Programs based on your answers');
    await expectGroupedTotal(page, ready, almost);
    await expect(page.locator('.group-title.ready')).toHaveCount(ready ? 1 : 0);
    if (ready) await expect(page.locator('.group-title.ready')).toContainText('Matches your answers');
    if (await page.locator('.group-title.almost').count()) await expect(page.locator('.group-title.almost')).toContainText('More to check');
    await expect(page.locator('.notmatch')).toBeVisible();
    if (persona.returning) {
      await expect(page.locator('.program-updates')).toBeVisible();
      await expect(page.locator('[data-updated-program="bc-autism-funding-under-6"]')).toHaveCount(1);
      await page.locator('.program-updates summary').click();
      await expect(page.locator('[data-updated-program="bc-autism-funding-under-6"]')).toContainText('Saved or tracked');
      await page.getByRole('button', { name: 'Got it, hide these updates', exact: true }).click();
      await expect(page.locator('#program-updates-status')).toHaveText('These updates are marked reviewed on this device.');
      await expect(page.locator('#program-updates-status')).toBeFocused();
      await gotoReady(page);
      await expect(page.locator('.program-updates')).toHaveCount(0);
      await expectGroupedTotal(page, ready, almost);
    } else {
      await expect(page.locator('.program-updates')).toHaveCount(0);
      await page.reload();
      await waitForAppReady(page);
      await expect(page.locator('.results-head')).toBeVisible();
      await expect(page.locator('#selInput')).toHaveCount(0);
      await expect(page.locator('.benefit.ready')).toHaveCount(ready);
      await expectGroupedTotal(page, ready, almost);
      await expect(page.locator('.program-updates')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  });
}
