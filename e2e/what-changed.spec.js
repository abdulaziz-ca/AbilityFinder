const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const vm = require('node:vm');
const { gotoReady } = require('./app-ready');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('public/data.js', 'utf8') + '\n' + fs.readFileSync('public/changelog.js', 'utf8') +
  '\nglobalThis.fixture = { ids: BENEFITS.map(b => b.id), data: AbilityFinderProgramChanges.collect(DATA_CHANGELOG, BENEFITS.map(b => b.id)) };', context);
const { ids, data } = JSON.parse(JSON.stringify(context.fixture));
const watermark = data.watermark;
const sessionId = '00000000-0000-4000-8000-000000000001';
const answers = {
  forWho: 'self', disabilities: ['physical'], ageBand: '19to59', ageGroup: 'adult',
  disabilityVerified: 'yes', autismDiagnosis: null, onsetBefore18: false, canWalkFar: false,
  functionalNeeds: ['dailyLiving', 'transitBarrier'], province: 'AB', msp: null, bcAssistance: null,
  circumstances: ['none'], citizenPR: true, dtc: 'yes', situation: ['unableToWork'], income: 'low', city: 'Edmonton',
};
function marker(revision = 0) { return { version: 1, seenByProgram: Object.fromEntries(ids.map(id => [id, revision])) }; }
async function seed(page, programChanges, progress = {}, extra = {}) {
  // Use an actual same-origin script-free document. No app scripts or async
  // init-script race can run before this IndexedDB transaction commits.
  await page.goto('/robots.txt', {waitUntil: 'domcontentloaded'});
  await page.evaluate(async ({ payload, sessionId }) => {
    await new Promise((resolve, reject) => {
      const req = indexedDB.open('abilityfinder', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('sessionState', { keyPath: 'session_uuid' });
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('sessionState', 'readwrite');
        tx.objectStore('sessionState').put({session_uuid: sessionId, revision: 1, payload});
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onabort = () => { db.close(); reject(tx.error); };
      };
    });
  }, { payload: {schemaVersion: 2, answers, view: 'results', progress, ui: {programChanges}, ...extra}, sessionId });
}
async function flush(page) { await page.evaluate(async () => { await AbilityFinderDB._writeQueue; }); }
async function read(page) { return page.evaluate(() => AbilityFinderDB.loadState({})); }
const panel = page => page.locator('.program-updates');

test('first visit and first rollout are silent and baseline only after restore/render', async ({ page }) => {
  await gotoReady(page);
  await expect(panel(page)).toHaveCount(0);
  await flush(page);
  const saved = await read(page);
  expect(saved.schemaVersion).toBe(2);
  expect(saved.ui.programChanges).toEqual(marker(watermark));
  await seed(page, undefined);
  await gotoReady(page);
  await expect(page.locator('.results-head')).toBeVisible();
  await expect(panel(page)).toHaveCount(0);
  await flush(page);
  expect((await read(page)).ui.programChanges).toEqual(marker(watermark));
});

test('older marker lists exactly current matches plus tracked programs; one keyboard action persists without network', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await seed(page, marker(), {'bc-autism-funding-under-6': 'denied'});
  await gotoReady(page);
  await expect(panel(page)).toBeVisible();
  await expect(panel(page)).toHaveAttribute('lang', 'en');
  await expect(panel(page).getByRole('button')).toHaveCount(1);
  const expected = await page.evaluate((changedIds) => browseCatalog()
    .filter(b => changedIds.includes(b.id) && (['ready', 'almost'].includes(evaluate(b).status) || !!STAGE[progress[b.id]]))
    .map(b => b.id), [...new Set(data.changes.map(change => change.recordId))]);
  const actual = await panel(page).locator('[data-updated-program]').evaluateAll(items => items.map(item => item.dataset.updatedProgram));
  expect(actual).toEqual(expected);
  expect(actual).toContain('bc-autism-funding-under-6');
  expect(actual).not.toContain('on-adp');
  const requests = [];
  page.on('request', req => requests.push(req.url()));
  const summary = panel(page).locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(panel(page).locator('details')).toHaveAttribute('open', '');
  await expect(panel(page).locator('[data-updated-program="bc-autism-funding-under-6"]')).toContainText('Saved or tracked');
  expect((await read(page)).ui.programChanges).toEqual(marker());
  await page.reload();
  await expect(panel(page)).toBeVisible();
  requests.length = 0;
  await page.getByRole('button', {name: 'Got it, hide these updates', exact: true}).focus();
  await page.keyboard.press('Enter');
  await expect(panel(page).getByRole('status')).toHaveText('These updates are marked reviewed on this device.');
  await expect(panel(page).getByRole('status')).toBeFocused();
  const saved = await read(page);
  for (const id of ids) expect(saved.ui.programChanges.seenByProgram[id]).toBe(actual.includes(id) ? watermark : 0);
  expect(requests).toEqual([]);
  await page.reload();
  await expect(panel(page)).toHaveCount(0);
  expect(errors).toEqual([]);
});

for (const stage of ['saved', 'gathering', 'submitted', 'waiting', 'approved', 'denied']) {
  test(`tracked nonmatch at ${stage} remains relevant`, async ({ page }) => {
    const seen = marker(watermark);
    seen.seenByProgram['bc-autism-funding-under-6'] = 0;
    await seed(page, seen, {'bc-autism-funding-under-6': stage});
    await gotoReady(page);
    await expect(panel(page)).toContainText('Details for 1 program were updated in AbilityFinder.');
    await expect(panel(page).locator('[data-updated-program]')).toHaveCount(1);
    await page.getByText('Show the updates', {exact: true}).click();
    await expect(panel(page)).toContainText('Saved or tracked');
  });
}

test('unrelated updates and a newly introduced ID do not announce a change', async ({ page }) => {
  const seen = marker(watermark);
  seen.seenByProgram['on-adp'] = 0;
  delete seen.seenByProgram.dtc;
  await seed(page, seen);
  await gotoReady(page);
  await expect(panel(page)).toHaveCount(0);
  await flush(page);
  expect((await read(page)).ui.programChanges.seenByProgram.dtc).toBe(watermark);
});

for (const [label, bad] of [
  ['null', null], ['array', []], ['unknown version', {version: 9, seenByProgram: {}}],
  ['negative cursor', {version: 1, seenByProgram: {dtc: -1}}],
  ['future cursor', {version: 1, seenByProgram: {dtc: watermark + 1}}],
  ['unknown nested key', {...marker(), extra: 'ignored history'}],
  ['oversized map', {version: 1, seenByProgram: Object.fromEntries(Array.from({length: 1000}, (_, i) => ['bad'+i, 0]))}],
]) test(`malformed marker (${label}) silently baselines without a notice`, async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await seed(page, bad);
  await gotoReady(page);
  await expect(page.locator('.results-head')).toBeVisible();
  await expect(panel(page)).toHaveCount(0);
  await flush(page);
  expect((await read(page)).ui.programChanges).toEqual(marker(watermark));
  expect(errors).toEqual([]);
});

test('storage throwing at boot gives no panel and no crash', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => { indexedDB.open = () => { throw new DOMException('Denied', 'SecurityError'); }; });
  await gotoReady(page);
  await expect(panel(page)).toHaveCount(0);
  await expect(page.locator('#app h1')).toBeVisible();
  await page.locator('#themeToggle').click();
  await flush(page);
  expect(errors).toEqual([]);
});

test('failed review write restores cursors, keeps updates visible, and cannot leak into a later save', async ({ page }) => {
  await seed(page, marker());
  await gotoReady(page);
  await page.evaluate(async () => {
    await AbilityFinderDB._writeQueue;
    const db = await AbilityFinderDB.openDB();
    const transaction = db.transaction.bind(db);
    window.restoreReviewStorage = () => { db.transaction = transaction; };
    db.transaction = () => { throw new DOMException('Full', 'QuotaExceededError'); };
  });
  await page.getByRole('button', {name: 'Got it, hide these updates', exact: true}).click();
  await expect(panel(page).getByRole('status')).toHaveText('We could not save this review on this device. These updates may appear again next time.');
  await expect(panel(page).getByRole('status')).toBeFocused();
  await expect(panel(page).getByRole('button')).toBeEnabled();
  await expect(panel(page).locator('[data-updated-program]').first()).toBeAttached();
  expect(await page.evaluate(() => programChanges)).toEqual(marker());
  await page.evaluate(() => window.restoreReviewStorage());
  await page.locator('#themeToggle').click(); // unrelated save after storage recovers
  await flush(page);
  expect((await read(page)).ui.programChanges).toEqual(marker());
  await page.reload();
  await expect(page.getByRole('button', {name: 'Got it, hide these updates', exact: true})).toBeVisible();
});

for (const colorScheme of ['light', 'dark']) {
  test(`update links use themed colours in the ${colorScheme} colour scheme`, async ({page}) => {
    await page.emulateMedia({colorScheme});
    await seed(page, marker());
    await gotoReady(page);
    await panel(page).locator('summary').click();
    for (const name of [/Read the .* guide/, 'Official source']) {
      const link = panel(page).getByRole('link', {name}).first();
      await expect(link).toBeVisible();
      await expect(link).not.toHaveCSS('color', 'rgb(0, 0, 238)');
    }
  });
}

test('update links omit unpublished guides but retain official sources', async ({page}) => {
  await seed(page, marker(), {'local-supports': 'saved'});
  await gotoReady(page);
  await page.evaluate(() => {
    PROGRAM_CHANGE_DATA.changes.push({recordId: 'local-supports', revision: PROGRAM_CHANGE_DATA.watermark,
      date: '2026-10-15', kind: 'rule', summary: 'The eligibility wording was clarified.'});
    render();
  });
  await panel(page).locator('summary').click();
  const local = panel(page).locator('[data-updated-program="local-supports"]');
  await expect(local).toBeVisible();
  await expect(local.getByRole('link', {name: /Read the .* guide/})).toHaveCount(0);
  await expect(local.getByRole('link', {name: 'Official source', exact: true})).toBeVisible();
  const guideLinks = await panel(page).locator('a[href^="/guides/"]').evaluateAll(links => links.map(a => a.getAttribute('href')));
  expect(guideLinks.length).toBeGreaterThan(0);
  for (const href of guideLinks) expect(fs.existsSync('public' + href)).toBe(true);
});

test('no guide-page mirror; theme and contrast use inherited readable tokens without motion', async ({page}) => {
  await seed(page, marker(), {}, {view: 'detail', detailId: 'dtc'});
  await gotoReady(page);
  await expect(panel(page)).toHaveCount(0);
  await page.evaluate(() => { view = 'results'; render(); });
  await expect(panel(page)).toBeVisible();
  for (const theme of ['dark', 'light', 'contrast']) {
    await page.evaluate(theme => {
      document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
      a11y.contrast = theme === 'contrast';
      notifyStateChange('test-theme');
    }, theme);
    await flush(page);
    await page.reload();
    await expect(panel(page)).toBeVisible();
    const style = await panel(page).evaluate(el => ({color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor, animations: el.getAnimations().length}));
    const luminance = color => color.match(/\d+/g).slice(0, 3).map(Number).map(c => {
      const value = c / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    }).reduce((total, value, i) => total + value * [0.2126, 0.7152, 0.0722][i], 0);
    const foreground = luminance(style.color), background = luminance(style.background);
    expect((Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)).toBeGreaterThanOrEqual(4.5);
    expect(style.animations).toBe(0);
  }
  await page.setViewportSize({width: 320, height: 900});
  await expect(panel(page).locator('summary')).toBeVisible();
  expect(await panel(page).evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
});


test('delayed restore cannot compute notices or write a baseline prematurely', async ({page}) => {
  await seed(page, marker());
  await page.addInitScript(() => {
    let manager;
    window.noticeWrites = 0;
    Object.defineProperty(window, 'AbilityFinderDB', {
      configurable: true, get: () => manager,
      set(value) {
        manager = value;
        const load = value.loadState.bind(value);
        const save = value.saveState.bind(value);
        value.saveState = (...args) => { window.noticeWrites++; return save(...args); };
        value.loadState = async (...args) => {
          window.restoreWaiting = true;
          await new Promise(resolve => { window.releaseProgramRestore = resolve; });
          return load(...args);
        };
      },
    });
  });
  await page.goto('/');
  await page.waitForFunction(() => window.restoreWaiting === true);
  await expect(panel(page)).toHaveCount(0);
  expect(await page.evaluate(() => window.noticeWrites)).toBe(0);
  await page.evaluate(() => window.releaseProgramRestore());
  await expect(panel(page)).toBeVisible();
  expect(await page.evaluate(() => window.noticeWrites)).toBe(0);
});

for (const forWho of ['child', 'family']) test(`returning ${forWho} results use the same relevant-program boundary`, async ({page}) => {
  await seed(page, marker(), {}, {answers: {...answers, forWho, ageBand: '6to11', ageGroup: 'child', situation: ['elementary']}});
  await gotoReady(page);
  await expect(panel(page)).toBeVisible();
  const expected = await page.evaluate(changedIds => browseCatalog()
    .filter(b => changedIds.includes(b.id) && ['ready', 'almost'].includes(evaluate(b).status)).map(b => b.id),
    [...new Set(data.changes.map(change => change.recordId))]);
  expect(await panel(page).locator('[data-updated-program]').evaluateAll(items => items.map(el => el.dataset.updatedProgram))).toEqual(expected);
});
