const {test, expect} = require('@playwright/test');
const {gotoReady, waitForAppReady} = require('./app-ready');
const {buildProgramCases} = require('./oracle/build-personas');
const ids = ['grt-taxi-coupons', 'grt-cnib-pass', 'grt-affordable-transit'];
async function seed(page, id, subject = 'self', target = 'results') {
  await gotoReady(page);
  const program = await page.evaluate(id => {
    const b = BENEFITS.find(b => b.id === id); return {id: b.id, requires: [...b.requires]};
  }, id);
  const persona = buildProgramCases(program).bestCase.answers;
  await page.evaluate(async ({persona, subject, id, target}) => {
    answers = {...BLANK(), ...persona, forWho: subject, province: "ON", disabilities: persona.disabilities.length ? persona.disabilities : ["other"]}; confirmedFacts = {};
    view = target; detailId = target === 'detail' ? id : null;
    await saveState(); render();
  }, {persona, subject, id, target});
}
for (const id of ids) test(`${id}: scoped optional answers, stable focus, persistence, clear and subject reset`, async ({page}) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await seed(page, id);
  const card = page.locator(`[data-fact-program="${id}"]`);
  const checks = card.locator(':scope > .benefit-row .fact-checks');
  await expect(checks).toHaveCount(1);
  await expect(checks).not.toHaveAttribute('open');
  await expect(card.locator('.match-status')).toHaveText('More to check');
  const wrong = page.locator('[data-fact-program]').filter({has: page.locator('.fact-checks')});
  const shownIds = await wrong.evaluateAll(cards => cards.map(c => c.dataset.factProgram));
  expect(shownIds.every(v => ids.includes(v))).toBe(true);
  await expect(page.locator('[data-fact-program="grt-mobilityplus"] .fact-checks')).toHaveCount(0);
  await checks.locator('summary').click();
  await expect(checks.locator('input:checked')).toHaveCount(0);
  await expect(checks.getByRole('status')).toBeAttached();
  expect(await checks.getByRole('status').evaluate(el => getComputedStyle(el).display)).not.toBe('none');
  const requests = []; page.on('request', r => requests.push(r.url()));
  const order = await page.locator('[data-fact-program]').evaluateAll(cards => cards.map(c => c.dataset.factProgram));
  for (const label of ['No', 'Not sure']) {
    await checks.getByRole('radio', {name: label, exact: true}).check();
    await expect(card.locator('.match-status')).toHaveText('More to check');
  }
  const yes = checks.getByRole('radio', {name: 'Yes', exact: true});
  await yes.focus(); await page.keyboard.press('Space');
  await expect(yes).toBeFocused();
  await expect(card.locator('.match-status')).toHaveText('Matches your answers');
  await expect(card.locator('.checked-facts-note').first()).toHaveText('Includes facts you checked on this device.');
  await expect(checks.getByRole('status')).toHaveText('Matches your answers. The program still decides.');
  expect(await page.locator('[data-fact-program]').evaluateAll(cards => cards.map(c => c.dataset.factProgram))).toEqual(order);
  await expect.poll(() => page.evaluate(async () => (await AbilityFinderDB.loadState({})).confirmedFacts)).not.toEqual({});
  expect(requests).toEqual([]); expect(page.url()).not.toMatch(/confirmed|registered|approved|customer/);
  await page.reload(); await waitForAppReady(page);
  await expect(card.locator('.match-status')).toHaveText('Matches your answers');
  await checks.locator('summary').click(); await expect(checks.getByRole('radio', {name:'Yes', exact:true})).toBeChecked();
  await checks.getByRole('button', {name:'Clear these checks'}).click();
  await expect(checks.locator('input:checked')).toHaveCount(0);
  await expect(checks.getByRole('status')).toHaveText('Checks updated.');
  await expect(card.locator('.match-status')).toHaveText('More to check');
  await expect.poll(() => page.evaluate(async () => (await AbilityFinderDB.loadState({})).confirmedFacts)).toEqual({});
  await page.reload(); await waitForAppReady(page);
  await expect(card.locator('.match-status')).toHaveText('More to check');
  await checks.locator('summary').click();
  await expect(checks.locator('input:checked')).toHaveCount(0);
  await checks.getByRole('radio', {name:'Yes', exact:true}).check();
  await page.evaluate(async () => { applyWizardSelection(STEPS.find(s => s.id === 'forWho'), 'family'); await saveState(); });
  expect(await page.evaluate(() => confirmedFacts)).toEqual({});
  await page.reload(); await waitForAppReady(page);
  expect(await page.evaluate(() => confirmedFacts)).toEqual({});
  expect(errors).toEqual([]);
});
for (const subject of ['self','child','family']) test(`detail checks: ${subject}, themes, keyboard and 400% reflow`, async ({page}) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await seed(page, 'grt-cnib-pass', subject, 'detail');
  const checks = page.locator('.detail-side .fact-checks');
  await expect(checks).toHaveAttribute('lang','en');
  await checks.locator('summary').click();
  await expect(checks.getByRole('group')).toHaveAccessibleName(/CNIB.*: /);
  await expect(checks.locator('fieldset')).not.toHaveAttribute('aria-label');
  await checks.locator('summary').click();
  await expect(checks.locator('legend')).toContainText(subject === 'self' ? 'Are you' : subject === 'child' ? 'Is your child' : 'Is your family member');
  for (const theme of ['dark','light','contrast']) {
    await page.evaluate(async theme => { document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light':'dark'); a11y.contrast = theme === 'contrast'; applyA11y(); await saveState(); }, theme);
    await page.reload(); await waitForAppReady(page);
    await checks.locator('summary').focus(); await page.keyboard.press('Enter');
    await checks.getByRole('radio',{name:'Yes',exact:true}).focus(); await page.keyboard.press('Space');
    await expect(page.locator('.side-status')).toHaveText('Matches your answers');
    await expect(page.locator('.detail-side .checked-facts-note')).toHaveText('Includes facts you checked on this device.');
    await checks.getByRole('button',{name:'Clear these checks'}).click();
  }
  await page.setViewportSize({width:320,height:720});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await expect(checks.getByRole('radio',{name:'Not sure',exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});


test('scenario preserves checked facts and does not falsely remove readiness', async ({page}) => {
  await seed(page, 'grt-cnib-pass');
  const checks = page.locator('[data-fact-program="grt-cnib-pass"] > .benefit-row .fact-checks');
  await checks.locator('summary').click();
  await checks.getByRole('radio', {name:'Yes', exact:true}).check();
  const result = await page.evaluate(() => {
    const before = JSON.stringify({answers, confirmedFacts});
    scenarioChanges.set('unrelated', {id:'unrelated', key:'situation', option:'student', value:true, label:'Studying'});
    const html = renderScenarioPanel(BENEFITS.map(b => ({b, r:evaluate(b)})));
    return {html, unchanged: before === JSON.stringify({answers, confirmedFacts})};
  });
  expect(result.unchanged).toBe(true);
  const row = page.locator('.scenario-diff-row.not-ready');
  await page.locator('#scenario-panel').evaluate((el, html) => { el.innerHTML = html; }, result.html);
  await expect(row).not.toContainText('CNIB');
  await expect(row.locator('b span')).toHaveText('0');
});

test('non-pilot fixed refusal guide has no Requirements block', async ({page}) => {
  await seed(page, 'grt-mobilityplus', 'self', 'detail');
  await page.evaluate(() => { answers.city = 'Toronto'; render(); });
  await expect(page.locator('.side-status')).toHaveText('Does not match these answers');
  await expect(page.locator('.detail-side .needs')).toHaveCount(0);
  await expect(page.locator('.detail-side')).toContainText('Next step');
});

test('old persisted snapshot without confirmedFacts restores unanswered checks', async ({page}) => {
  await seed(page, 'grt-cnib-pass');
  await page.evaluate(async () => {
    const old = await AbilityFinderDB.loadState({});
    delete old.confirmedFacts;
    await AbilityFinderDB.saveState(old);
  });
  await page.reload(); await waitForAppReady(page);
  expect(await page.evaluate(() => confirmedFacts)).toEqual({});
  const card = page.locator('[data-fact-program="grt-cnib-pass"]');
  await expect(card.locator('.match-status')).toHaveText('More to check');
  await expect(card.locator('.fact-checks input:checked')).toHaveCount(0);
});

test('a checked fact cannot override a fixed refusal; failed storage keeps session answers usable', async ({page}) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await seed(page, 'grt-cnib-pass', 'self', 'detail');
  const checks = page.locator('.detail-side .fact-checks');
  await checks.locator('summary').click();
  await page.evaluate(() => { AbilityFinderDB.saveState = async () => false; });
  await checks.getByRole('radio', {name:'Yes',exact:true}).check();
  await expect(checks.getByRole('status')).toHaveText('Not saved on this device.');
  await expect(page.locator('.side-status')).toHaveText('Matches your answers');
  expect(await page.evaluate(() => confirmedFacts['grt-cnib-pass'].cnibCustomer.components.customer)).toBe('yes');
  await page.evaluate(() => { answers.city = 'Toronto'; render(); });
  await expect(page.locator('.side-status')).toHaveText('Does not match these answers');
  await expect(page.locator('.fact-checks')).toHaveCount(0);
  await page.evaluate(() => { view = 'results'; render(); });
  await expect(page.locator('[data-fact-program="grt-cnib-pass"] .fact-checks')).toHaveCount(0);
  expect(errors).toEqual([]);
});
