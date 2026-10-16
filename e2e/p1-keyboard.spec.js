const { test, expect } = require('@playwright/test');
const { settleWizardCard } = require('./wizard-helpers');
test('radio arrows only move focus; Space records; Next advances', async ({ page }) => {
  await page.goto('/');
  await page.locator('.js-start').first().click();
  await settleWizardCard(page);
  await page.getByRole('radio', { name: 'Myself', exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'My child', exact: true })).toBeFocused();
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => answers.forWho)).toBeNull();
  await expect(page.locator('#wizard-question')).toHaveText('Who are we finding benefits for?');
  await page.keyboard.press('Space');
  expect(await page.evaluate(() => answers.forWho)).toBe('child');
  await page.waitForTimeout(300);
  await expect(page.locator('#wizard-question')).toHaveText('Who are we finding benefits for?');
  await page.locator('#next').click();
  await expect(page.locator('#wizard-question')).toContainText('Which of these apply');
});
test('clicking option LABEL text advances exactly one step', async ({ page }) => {
  await page.goto('/');
  await page.locator('.js-start').first().click();
  await settleWizardCard(page);
  // Hit the visible text inside the label, never the sr-only radio input.
  await page.locator('label[for="wizard-option-0-0"] .label').click();
  await expect(page.locator('#wizard-question')).toContainText('Which of these apply');
  await page.waitForTimeout(500);
  await expect(page.locator('#wizard-question')).toContainText('Which of these apply');
  expect(await page.evaluate(() => ({ index: stepIndex, answer: answers.forWho })))
    .toEqual({ index: 1, answer: 'self' });
});
test('Enter records without advancing, even after unused pointer intent', async ({ page }) => {
  await page.goto('/');
  await page.locator('.js-start').first().click();
  await settleWizardCard(page);
  const radio = page.getByRole('radio', { name: 'Myself', exact: true });
  await page.locator('label[for="wizard-option-0-0"]').dispatchEvent('pointerdown', {
    isPrimary: true, button: 0, pointerType: 'mouse',
  });
  await radio.focus();
  await page.keyboard.press('Enter');
  await expect(radio).toBeChecked();
  expect(await page.evaluate(() => answers.forWho)).toBe('self');
  await page.waitForTimeout(500);
  await expect(page.locator('#wizard-question')).toHaveText('Who are we finding benefits for?');
  expect(await page.evaluate(() => stepIndex)).toBe(0);
});
test('double-clicking a step-one option advances exactly one step', async ({ page }) => {
  await page.goto('/');
  await page.locator('.js-start').first().click();
  await settleWizardCard(page);
  await page.locator('label[for="wizard-option-0-0"]').dblclick();
  await expect(page.locator('#wizard-question')).toContainText('Which of these apply');
  // Let both delayed click callbacks run before checking for a skipped question.
  await page.waitForTimeout(500);
  await expect(page.locator('#wizard-question')).toContainText('Which of these apply');
  expect(await page.evaluate(() => stepIndex)).toBe(1);
});
test('city select navigation remains draft until Next', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => history.state !== null);
  await page.evaluate(() => {
    answers = { ...BLANK(), forWho: 'self', province: 'AB' };
    view = 'wizard'; stepIndex = visibleSteps().findIndex(s => s.key === 'city'); render();
  });
  const select = page.locator('#selInput');
  await select.focus();
  await page.keyboard.press('ArrowDown');
  // selectOption also covers browsers whose closed native select needs opening.
  await select.selectOption('Calgary');
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => answers.city)).toBeNull();
  await expect(select).toBeVisible();
  await settleWizardCard(page);
  await page.locator('#next').click();
  expect(await page.evaluate(() => answers.city)).toBe('Calgary');
  await expect(select).toHaveCount(0);
});
