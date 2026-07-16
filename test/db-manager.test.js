"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { IDBFactory } = require("fake-indexeddb");
const { IndexedDBManager } = require("../public/dbManager.js");
const { sanitizeLegacyState } = require("../public/stateManager.js");

const migrationSelections = {
  disabilities: ["physical"],
  situations: ["working"],
  provinces: ["AB", "other"],
  cities: ["Calgary"],
  benefitIds: ["dtc"],
  progressStages: ["submitted"],
};

function manager(overrides = {}) {
  return new IndexedDBManager({
    indexedDB: new IDBFactory(),
    dbName: `abilityfinder-test-${Math.random()}`,
    sessionId: "anonymous-test-session",
    logger: null,
    ...overrides,
  });
}

test("loadState creates the versioned store and returns an independent default state", async () => {
  const db = manager();
  const defaults = { answers: {}, progress: {}, featureFlags: { askConsent: false } };

  const loaded = await db.loadState(defaults);

  assert.deepEqual(loaded, defaults);
  assert.notStrictEqual(loaded, defaults);
  loaded.answers.changed = true;
  assert.deepEqual(defaults.answers, {});
  assert.equal(db.version, 1);
  assert.equal(db.storeName, "sessionState");
  await db.close();
});

test("saveState stores a JSON snapshot under the anonymous session identifier", async () => {
  const db = manager();
  const state = {
    answers: { forWho: "self", disabilities: ["physical"], citizenPR: true },
    progress: { dtc: "submitted" },
    ui: { theme: "dark" },
    updatedAt: "2026-07-15T10:30:00.000Z",
  };

  assert.equal(await db.saveState(state), true);
  state.answers.forWho = "family";

  const loaded = await db.loadState({});
  assert.equal(loaded.answers.forWho, "self");
  assert.equal(loaded.answers.citizenPR, true);
  assert.equal(loaded.updatedAt, "2026-07-15T10:30:00.000Z");
  assert.equal(typeof loaded.updatedAt, "string");
  await db.close();
});

test("saveState serializes data instead of retaining functions or object references", async () => {
  const db = manager();
  const state = { answers: { forWho: "self" }, calculate: () => "not data" };

  await db.saveState(state);
  const loaded = await db.loadState({});

  assert.deepEqual(loaded, { answers: { forWho: "self" } });
  await db.close();
});

test("queued writes resolve in order so the latest state wins", async () => {
  const db = manager();

  await Promise.all([
    db.saveState({ stepIndex: 1 }),
    db.saveState({ stepIndex: 2 }),
    db.saveState({ stepIndex: 3 }),
  ]);

  assert.deepEqual(await db.loadState({}), { stepIndex: 3 });
  await db.close();
});

test("a stale manager cannot overwrite a newer snapshot from another tab", async () => {
  const indexedDB = new IDBFactory();
  const dbName = `abilityfinder-cross-tab-${Math.random()}`;
  const first = manager({ indexedDB, dbName });
  const stale = manager({ indexedDB, dbName });

  await first.loadState({});
  await stale.loadState({});
  assert.equal(await first.saveState({ stepIndex: 2 }), true);
  assert.equal(await stale.saveState({ stepIndex: 1 }), false);
  assert.deepEqual(await first.loadState({}), { stepIndex: 2 });

  await first.close();
  await stale.close();
});

test("clearState removes the current anonymous session payload", async () => {
  const db = manager();
  await db.saveState({ answers: { forWho: "child" } });

  assert.equal(await db.clearState(), true);
  assert.deepEqual(await db.loadState({ answers: {} }), { answers: {} });
  await db.close();
});

test("a stale manager cannot resurrect state after another tab clears it", async () => {
  const indexedDB = new IDBFactory();
  const dbName = `abilityfinder-clear-conflict-${Math.random()}`;
  const current = manager({ indexedDB, dbName });
  const stale = manager({ indexedDB, dbName });

  await current.loadState({});
  assert.equal(await current.saveState({ answers: { forWho: "self" } }), true);
  assert.deepEqual(await stale.loadState({}), { answers: { forWho: "self" } });
  assert.equal(await current.clearState(), true);
  assert.equal(await stale.saveState({ answers: { forWho: "self" } }), false);
  assert.deepEqual(await current.loadState({ answers: {} }), { answers: {} });

  await current.close();
  await stale.close();
});

test("a stale manager cannot clear a newer snapshot", async () => {
  const indexedDB = new IDBFactory();
  const dbName = `abilityfinder-stale-clear-${Math.random()}`;
  const current = manager({ indexedDB, dbName });
  const stale = manager({ indexedDB, dbName });

  await current.loadState({});
  assert.equal(await current.saveState({ stepIndex: 1 }), true);
  await stale.loadState({});
  assert.equal(await current.saveState({ stepIndex: 2 }), true);
  assert.equal(await stale.clearState(), false);
  assert.deepEqual(await current.loadState({}), { stepIndex: 2 });

  await current.close();
  await stale.close();
});

test("migrateLegacyState imports existing localStorage data once and then removes it", async () => {
  const db = manager();
  const values = new Map([
    ["abilityfinder.v2", JSON.stringify({
      answers: { forWho: "self", postal: "T2P 1J9", unexpected: "private" },
      view: "results",
      stepIndex: 4,
      groupMode: "category",
      applied: { dtc: true },
      unexpectedRoot: "private",
    })],
    ["abilityfinder.a11y", JSON.stringify({ contrast: true })],
    ["abilityfinder.theme", "light"],
    ["abilityfinder.lang", "fr"],
    ["abilityfinder.askConsent", "1"],
  ]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
  };

  assert.equal(await db.migrateLegacyState(storage, (legacy) =>
    sanitizeLegacyState(legacy, migrationSelections)), true);
  const migrated = await db.loadState({});
  assert.equal(migrated.answers.forWho, "self");
  assert.equal(migrated.answers.postal, undefined);
  assert.equal(migrated.answers.unexpected, undefined);
  assert.equal(migrated.unexpectedRoot, undefined);
  assert.equal(migrated.view, "results");
  assert.equal(migrated.stepIndex, 4);
  assert.deepEqual(migrated.progress, { dtc: "submitted" });
  assert.equal(migrated.ui.groupMode, "category");
  assert.equal(migrated.ui.a11y.contrast, true);
  assert.equal(migrated.ui.theme, "light");
  assert.equal(migrated.ui.lang, "fr");
  assert.equal(migrated.ui.askConsent, true);
  assert.equal(values.size, 0);

  values.set("abilityfinder.v2", JSON.stringify({ stepIndex: 99 }));
  assert.equal(await db.migrateLegacyState(storage), false);
  assert.equal((await db.loadState({})).stepIndex, 4);
  await db.close();
});

test("storage failures return defaults and do not prevent the app from running", async () => {
  const db = manager({ indexedDB: null });

  assert.deepEqual(await db.loadState({ answers: {} }), { answers: {} });
  assert.equal(await db.saveState({ answers: { forWho: "self" } }), false);
  assert.equal(await db.clearState(), false);
});

test("a failed legacy import leaves the old data available for a later retry", async () => {
  const db = manager({ indexedDB: null });
  const values = new Map([["abilityfinder.v2", JSON.stringify({ stepIndex: 2 })]]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    removeItem: (key) => values.delete(key),
  };

  assert.equal(await db.migrateLegacyState(storage), false);
  assert.equal(values.has("abilityfinder.v2"), true);
});
