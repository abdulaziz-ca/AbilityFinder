const { test, expect } = require('@playwright/test');
const { gotoReady } = require('./app-ready');
test('missing changelog degrades without blocking startup or results', async ({ page }) => {
  await gotoReady(page);
  const markers = await page.evaluate(async () => { baselineProgramChanges(); await saveState(); return programChanges; });
  await page.route('**/changelog.js*', route => route.abort());
  await gotoReady(page);
  expect(await page.evaluate(() => programChanges)).toEqual(markers);
  await expect(page.locator('.js-start').first()).toBeVisible();
  await page.evaluate(() => { answers = { ...BLANK(), province: 'AB', city: 'Calgary', forWho: 'self' }; view = 'results'; render(); });
  await expect(page.locator('.results-head h1')).toBeVisible();
  await expect(page.locator('.render-error, .startup-error')).toHaveCount(0);
  expect(await page.evaluate(() => pendingProgramUpdates([]))).toEqual([]);
});
test('startup exception offers working Reload and guides escape', async ({ page }) => {
  await page.route('**/app.js*', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'cache-control': 'no-store' }, body: (await response.text()).replace('  applyA11y();\n  applyStaticI18n();', '  throw new Error("injected startup failure");\n  applyStaticI18n();') });
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'AbilityFinder did not finish loading' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Browse program guides' })).toHaveAttribute('href', '/guides/');
  await page.unroute('**/app.js*');
  await page.getByRole('button', { name: 'Reload', exact: true }).click();
  await expect(page.locator('.js-start').first()).toBeVisible();
});
test('missing core script does not leave loading forever', async ({ page }) => {
  await page.route('**/app.js*', route => route.abort());
  await page.goto('/');
  await expect(page.locator('.startup-error')).toBeVisible();
});
