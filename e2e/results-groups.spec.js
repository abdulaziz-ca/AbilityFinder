const { test, expect } = require('@playwright/test');
const { gotoReady } = require('./app-ready');
const PERSONAS = require('../research/2026-10-site-audit/tools/personas');

// Seed answers the same way the at-kit spec does: through the persisted state.
const { seedSnippet } = require('../scripts/at-kit-seed');

function personaSeed(id) {
  const p = PERSONAS.find((x) => x.id === id);
  return { ...p.answers };
}

async function openResults(page, id, edit = (a) => a) {
  const answers = edit(personaSeed(id));
  await page.goto('/robots.txt', { waitUntil: 'domcontentloaded' });
  await page.evaluate((snippet) => (0, eval)(snippet), seedSnippet({ id, answers, label: id }));
  await gotoReady(page);
  await expect(page.locator('.results-head h1')).toHaveText('Programs based on your answers');
}

test('AISH Calgary persona: groups, headline and no G3 item among the first 10 cards', async ({ page }) => {
  await openResults(page, 'P01-calgary-aish');
  await expect(page.locator('h1:visible')).toHaveCount(1);
  await expect(page.locator('.results-head .big')).toHaveCount(0);
  await expect(page.locator('#g1-title')).toContainText(/Programs to check \(\d+\)/);
  const g3 = page.locator('details.result-group-later');
  await expect(g3).toHaveCount(1);
  expect(await g3.evaluate((d) => d.open)).toBe(false);
  await expect(g3.locator('h2')).toContainText(/Not for your situation now \(\d+\)/);
  await expect(page.locator('[data-fact-program="dtc"]').first()).toBeVisible();
  const g3Ids = await page.locator('[data-result-group="g3"]').evaluateAll((els) => els.map((e) => e.dataset.id));
  expect(g3Ids.length).toBeGreaterThan(0);
  const firstTen = await page.locator('.result-group-main .benefit').evaluateAll((els) => els.slice(0, 10).map((e) => e.getAttribute('data-fact-program')));
  for (const id of g3Ids) expect(firstTen).not.toContain(id);
  await expect(page.locator('[data-result-group="g3"]').first()).toBeHidden();
  await g3.locator('summary').click();
  await expect(page.locator('[data-result-group="g3"]').first()).toBeVisible();
  await expect(g3).toContainText('Disability Tax Credit approval needed first');
});

test('working adult without DTC in Edmonton: DTC-dependent programs are in G3, DTC stays a card', async ({ page }) => {
  await openResults(page, 'P07-kelowna-moderate-nodtc', (a) => ({
    ...a, province: 'AB', city: 'Edmonton', msp: null, bcAssistance: null, circumstances: ['none'], dtc: 'no', situation: ['working'],
  }));
  const g3Ids = await page.locator('[data-result-group="g3"]').evaluateAll((els) => els.map((e) => e.dataset.id));
  expect(g3Ids.length).toBeGreaterThan(0);
  expect(g3Ids).not.toContain('dtc');
  const cardIds = await page.locator('.result-group-main .benefit').evaluateAll((els) => els.map((e) => e.getAttribute('data-fact-program')));
  expect(cardIds.slice(0, 10).filter((id) => g3Ids.includes(id))).toEqual([]);
  expect(cardIds.filter((id) => g3Ids.includes(id))).toEqual([]);
  await expect(page.locator('.result-group-main')).toContainText('Disability Tax Credit');
});
