const { test, expect } = require('@playwright/test');
const { gotoReady } = require('./app-ready');

// #215(a): boot-time corruption, not the normal save/reload journeys in
// persistence.spec.js. Real stores and the production migration/restore path.
// Each Playwright test gets a fresh browser context (no deletion of live DBs).
const SESSION_ID = '00000000-0000-4000-8000-000000000001';
const LEGACY_KEYS = [
  'abilityfinder.v2', 'abilityfinder.a11y', 'abilityfinder.theme',
  'abilityfinder.lang', 'abilityfinder.askConsent',
];

async function seedBeforeBoot(page, { legacy = {}, payload, dbVersion = 1 } = {}) {
  // Async addInitScript alone is NOT a boot barrier. Run it on a same-origin
  // script-free document, await the committed transaction, then gotoReady('/').
  // The app's HTML/scripts have never loaded while this seed is being written.
  await page.route('**/__persistence_chaos_seed__', (route) => route.fulfill({
    contentType: 'text/html', body: '<!doctype html><title>Storage seed</title>',
  }));
  await page.addInitScript(({ legacy, payload, dbVersion, sessionId }) => {
    if (location.pathname !== '/__persistence_chaos_seed__') return;
    window.chaosSeed = (async () => {
      for (const [key, value] of Object.entries(legacy)) localStorage.setItem(key, value);
      if (payload === undefined && dbVersion === 1) return;
      await new Promise((resolve, reject) => {
        const request = indexedDB.open('abilityfinder', dbVersion);
        request.onupgradeneeded = () => {
          request.result.createObjectStore('sessionState', { keyPath: 'session_uuid' });
        };
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error('Chaos seed DB open blocked'));
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('sessionState', 'readwrite');
          tx.objectStore('sessionState').put({
            session_uuid: sessionId, revision: 1, payload,
            updatedAt: '2026-01-01T00:00:00.000Z',
          });
          tx.oncomplete = () => { db.close(); resolve(); };
          tx.onabort = () => { db.close(); reject(tx.error); };
          tx.onerror = () => { db.close(); reject(tx.error); };
        };
      });
    })();
  }, { legacy, payload, dbVersion, sessionId: SESSION_ID });
  await page.goto('/__persistence_chaos_seed__');
  await page.evaluate(() => window.chaosSeed);
}

async function expectUsable(page, errors) {
  // Surface a rejected boot promise as its actual pageerror rather than a
  // readiness timeout. Still use gotoReady as the successful boot barrier.
  let onBootError;
  const bootError = new Promise((_, reject) => {
    onBootError = (error) => reject(error);
    page.once('pageerror', onBootError);
  });
  try {
    await Promise.race([gotoReady(page), bootError]);
  } finally {
    page.removeListener('pageerror', onBootError);
  }
  const main = page.getByRole('main');
  await expect(main).not.toBeEmpty();
  await expect(main).toContainText(/\S/);
  await expect(main.locator('h1, #wizard-question').first()).toBeVisible();
  await expect(main.locator('.render-error')).toHaveCount(0);
  await page.locator('#a11yFab').click();
  await expect(page.getByRole('dialog', { name: 'Accessibility options' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#a11yPanel')).toBeHidden();
  // Exercise the live save path as well as restore (including open/setItem faults).
  await page.locator('#themeToggle').click();
  await page.evaluate(async () => { await window.AbilityFinderDB._writeQueue; });
  expect(errors, 'No uncaught exception during restore, render, dialog, or save').toEqual([]);
}

test.describe('persistence chaos — restore before first meaningful render', () => {
  let errors;
  test.beforeEach(async ({ page }) => {
    errors = [];
    page.on('pageerror', (error) => errors.push(`${error.name}: ${error.message}`));
  });

  for (const key of LEGACY_KEYS) {
    for (const [kind, value] of [
      ['garbage', '{ definitely not JSON !!!'],
      ['wrong type', '42'],
    ]) {
      test(`legacy ${key}: ${kind}`, async ({ page }) => {
        await seedBeforeBoot(page, { legacy: { [key]: value } });
        await expectUsable(page, errors);
      });
    }
  }

  for (const key of ['abilityfinder.v2', 'abilityfinder.a11y']) {
    for (const [kind, root] of [
      ['null', null], ['array', []], ['string', 'saved progress'], ['boolean', true],
    ]) {
      test(`legacy ${key}: ${kind} root`, async ({ page }) => {
        await seedBeforeBoot(page, { legacy: { [key]: JSON.stringify(root) } });
        await expectUsable(page, errors);
        expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBeNull();
      });
    }
  }

  // Only v2 and a11y are JSON keys. theme/lang are enum strings and
  // askConsent is a literal "1" flag; truncated JSON has no meaning for those.
  for (const key of ['abilityfinder.v2', 'abilityfinder.a11y']) {
    test(`legacy ${key}: truncated valid JSON`, async ({ page }) => {
      const value = JSON.stringify({ view: 'wizard', answers: { forWho: 'self' }, fontScale: 1.2 }).slice(0, -2);
      await seedBeforeBoot(page, { legacy: { [key]: value } });
      await expectUsable(page, errors);
    });
  }

  // IndexedDB uses structured clones, NOT a JSON text parser. Strings that look
  // like garbage/truncated JSON are still possible payloads and must be rejected.
  for (const [kind, payload] of [
    ['garbage JSON string', 'not JSON at all'],
    ['truncated JSON string', '{"schemaVersion":1,"answers":{"forWho":"self"}'],
    ['number', 42], ['null', null], ['array', ['wizard']],
    ['wrong field types', {
      schemaVersion: [], answers: 'bad', view: {}, stepIndex: '999',
      detailId: 123, detailFrom: [], progress: ['submitted'],
      helpTopic: 42, helpReturnStep: {}, ui: { a11y: true, lang: [], theme: {},
        askConsent: 'yes', browseQuery: 42, browseDis: [], browseLevel: {},
        browseTheme: false, groupMode: 42 },
    }],
  ]) {
    test(`IndexedDB payload: ${kind}`, async ({ page }) => {
      await seedBeforeBoot(page, { payload });
      await expectUsable(page, errors);
    });
  }

  for (const [kind, payload] of [
    ['future schema', { schemaVersion: 999999, view: 'wizard', stepIndex: 0,
      answers: { forWho: 'self' }, futureField: { unsupported: true }, ui: {} }],
    ['very old schema with missing fields', { schemaVersion: 0, view: 'results', answers: { forWho: 'self' } }],
    ['unversioned historical snapshot', { view: 'wizard' }],
    ['deleted answer references', { schemaVersion: 1, view: 'wizard', answers: {
      forWho: 'self', province: 'AB', city: 'Deleted City', benefitId: 'deleted-benefit',
      disabilities: ['deleted-benefit'], situation: ['deleted-benefit'],
    } }],
    ['deleted detailId', { schemaVersion: 1, view: 'detail', detailId: 'deleted-benefit', detailFrom: 'browse' }],
    ['wizard step beyond last', { schemaVersion: 1, view: 'wizard', stepIndex: 1000000 }],
    ['negative wizard step', { schemaVersion: 1, view: 'wizard', stepIndex: -7 }],
    ['unknown progress status keys', { schemaVersion: 1, view: 'browse',
      progress: { dtc: 'future-status', 'deleted-benefit': 'submitted', aish: { status: 'unknown' } } }],
  ]) {
    test(`saved snapshot: ${kind}`, async ({ page }) => {
      await seedBeforeBoot(page, { payload });
      await expectUsable(page, errors);
      const restored = await page.evaluate(() => ({
        view, stepIndex, detailId, progress, answers, stepCount: visibleSteps().length,
      }));
      if (kind === 'deleted answer references') {
        expect(restored.answers.city).toBeNull();
        expect(restored.answers.benefitId).toBeUndefined();
        expect(restored.answers.disabilities).not.toContain('deleted-benefit');
      }
      if (kind === 'deleted detailId') {
        expect(restored.detailId).toBeNull();
        expect(restored.view).not.toBe('detail');
      }
      if (kind.includes('wizard step')) {
        expect(restored.stepIndex).toBeGreaterThanOrEqual(0);
        expect(restored.stepIndex).toBeLessThan(restored.stepCount);
      }
      if (kind === 'unknown progress status keys') expect(restored.progress).toEqual({});
    });
  }

  test('IndexedDB: 1 MB persisted browse query and answer', async ({ page }) => {
    await seedBeforeBoot(page, { payload: {
      schemaVersion: 1, view: 'browse', ui: { browseQuery: 'x'.repeat(1024 * 1024) },
      answers: { province: 'AB', city: 'x'.repeat(1024 * 1024) },
    } });
    await expectUsable(page, errors);
    expect(await page.evaluate(() => browseQuery.length)).toBe(200);
    expect(await page.evaluate(() => answers.city)).toBeNull();
  });

  for (const key of LEGACY_KEYS) {
    test(`legacy ${key}: 1 MB value`, async ({ page }) => {
      const huge = 'x'.repeat(1024 * 1024);
      const value = key === 'abilityfinder.v2'
        ? JSON.stringify({ view: 'browse', ui: { browseQuery: huge } })
        : key === 'abilityfinder.a11y' ? JSON.stringify({ fontScale: huge }) : huge;
      await seedBeforeBoot(page, { legacy: { [key]: value } });
      await expectUsable(page, errors);
    });
  }

  for (const method of ['getItem', 'setItem']) {
    test(`localStorage.${method} throws SecurityError`, async ({ page }) => {
      await page.addInitScript((method) => {
        const real = Storage.prototype[method];
        Storage.prototype[method] = function (...args) {
          if (this === window.localStorage) {
            window.chaosStorageFaults = (window.chaosStorageFaults || 0) + 1;
            throw new DOMException(`Chaos localStorage.${method} denied`, 'SecurityError');
          }
          return real.apply(this, args);
        };
      }, method);
      await expectUsable(page, errors);
      // Current code never writes localStorage (only imports/removes legacy
      // keys). Probe setItem to verify injection, not pretend the app called it.
      if (method === 'setItem') {
        expect(await page.evaluate(() => {
          try { localStorage.setItem('chaos-probe', '1'); } catch (error) { return error.name; }
        })).toBe('SecurityError');
      }
      expect(await page.evaluate(() => window.chaosStorageFaults)).toBeGreaterThan(0);
    });
  }

  test('indexedDB.open throws SecurityError (restore and save)', async ({ page }) => {
    await page.addInitScript(() => {
      IDBFactory.prototype.open = function () {
        window.chaosOpenFaults = (window.chaosOpenFaults || 0) + 1;
        throw new DOMException('Chaos indexedDB.open denied', 'SecurityError');
      };
    });
    await expectUsable(page, errors);
    expect(await page.evaluate(() => window.chaosOpenFaults)).toBeGreaterThan(0);
  });

  test('indexedDB.open fails asynchronously with VersionError', async ({ page }) => {
    // Real IDBOpenDBRequest failure: DB version 2 exists but manager opens v1.
    // Distinct from a future payload schemaVersion (currently no version gate).
    await seedBeforeBoot(page, { dbVersion: 2, payload: { view: 'wizard' } });
    const warnings = [];
    const warningPromises = [];
    page.on('console', (message) => {
      if (message.type() === 'warning') {
        warningPromises.push((async () => {
          const parts = await Promise.all(message.args().map(a => a.evaluate(v => v && v.name ? v.name + ': ' + v.message : String(v)).catch(() => '')));
          warnings.push([message.text(), ...parts].join(' '));
        })());
      }
    });
    await expectUsable(page, errors);
    await Promise.all(warningPromises);
    expect(warnings.join('\n')).toMatch(/VersionError|version.*(lower|less)|higher version/i);
  });
});
