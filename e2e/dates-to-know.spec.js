const fs = require('node:fs/promises');
const { test, expect } = require('@playwright/test');

function profile(overrides={}) {
  return { forWho:'self', disabilities:['physical'], ageBand:'65to74', ageGroup:'senior', disabilityVerified:'yes', autismDiagnosis:null, onsetBefore18:null, canWalkFar:'no', functionalNeeds:['home'], province:'ON', msp:null, bcAssistance:null, circumstances:['homeowner'], citizenPR:true, dtc:'no', situation:['none'], income:'low', city:'London', postal:null, ...overrides };
}
async function openProfile(page, model, now='2026-10-20T12:00:00-04:00') {
  await page.clock.setFixedTime(new Date(now));
  await page.goto('/');
  await page.waitForFunction(() => typeof ensurePacks === 'function');
  await page.evaluate(() => ensurePacks(['ON']));
  await page.evaluate(model => { answers=model; setState('results'); }, model);
  await expect(page.locator('.results-head')).toBeVisible();
}

test.describe('Dates to know', () => {
  test.use({ timezoneId:'America/Toronto', reducedMotion:'reduce' });

  test('London results download the exact closing date and the app guide repeats the block', async ({page}) => {
    await openProfile(page, profile());
    const block=page.locator('.dates-to-know').first();
    await expect(block.getByRole('heading',{name:'Dates to know'})).toBeVisible();
    await expect(block).toContainText('Applications close');
    await expect(block).toContainText('Ontario Renovates home repair and accessibility funding (London)');
    const button=block.getByRole('button',{name:/Add Ontario Renovates.*London.*applications close to calendar/i});
    const downloadPromise=page.waitForEvent('download');
    await button.click();
    const download=await downloadPromise;
    expect(download.suggestedFilename()).toBe('abilityfinder-london-ontario-renovates-date.ics');
    const ics=await fs.readFile(await download.path(),'utf8');
    expect(ics).toContain('DTSTART;VALUE=DATE:20261030');
    expect(ics).toContain('TRIGGER:-P6DT15H');
    expect(ics).toContain('TRIGGER:PT9H');

    await block.getByRole('link',{name:/Ontario Renovates.*London/}).first().click();
    await expect(page.locator('.detail .dates-to-know')).toContainText('Applications close');
  });

  test('after closing day London hides the deadline but qualifies the expected reopening', async ({page}) => {
    await openProfile(page, profile(), '2026-10-31T12:00:00-04:00');
    const block=page.locator('.dates-to-know').first();
    await expect(block).not.toContainText('Applications close');
    await expect(block).toContainText('Expected to reopen (expected)');
    await expect(block).toContainText('Check the official page; this date is not final.');
    await expect(block.getByRole('button',{name:/London/i})).toHaveCount(0);
  });

  test('Waterloo shows its conflicting deadline without a calendar button', async ({page}) => {
    await openProfile(page, profile({city:'Waterloo'}));
    const block=page.locator('.dates-to-know').first();
    const row=block.locator('li').filter({hasText:'Apply by (the official dates differ)'});
    await expect(row).toContainText('Check the official page; this date is not final.');
    await expect(row.getByRole('button')).toHaveCount(0);
  });

  test('a profile with no dated visible programs has no block', async ({page}) => {
    await openProfile(page, profile({province:'AB',city:'Calgary',circumstances:['none'],income:'high',disabilities:[],functionalNeeds:['none']}));
    await expect(page.locator('.dates-to-know')).toHaveCount(0);
  });
});
