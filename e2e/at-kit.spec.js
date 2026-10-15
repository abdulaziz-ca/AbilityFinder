const { test, expect } = require('@playwright/test');
const { gotoReady, waitForAppReady } = require('./app-ready');
const { personas, seedSnippet } = require('../scripts/at-kit-seed');

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
      'ab-self': [0, 22], 'bc-child': [4, 21], 'on-family': [3, 17],
      'bc-self': [10, 20], 'no-matches': [0, 11], returning: [0, 22],
    };
    const [ready, almost] = counts[persona.id];
    await expect(page.locator('.benefit.ready')).toHaveCount(ready);
    await expect(page.locator('.benefit.almost')).toHaveCount(almost);
    await expect(page.locator('.results-head .big')).toHaveText(String(ready + almost));
    await expect(page.locator('.group-title.ready')).toHaveCount(ready ? 1 : 0);
    if (ready) await expect(page.locator('.group-title.ready')).toContainText('Matches your answers');
    await expect(page.locator('.group-title.almost')).toContainText('More to check');
    await expect(page.locator('.group-title')).toHaveCount(ready ? 2 : 1);
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
      await expect(page.locator('.results-head .big')).toHaveText('22');
    } else {
      await expect(page.locator('.program-updates')).toHaveCount(0);
      await page.reload();
      await waitForAppReady(page);
      await expect(page.locator('.results-head')).toBeVisible();
      await expect(page.locator('#selInput')).toHaveCount(0);
      await expect(page.locator('.benefit.ready')).toHaveCount(ready);
      await expect(page.locator('.benefit.almost')).toHaveCount(almost);
      await expect(page.locator('.results-head .big')).toHaveText(String(ready + almost));
      await expect(page.locator('.program-updates')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  });
}
