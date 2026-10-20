"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { PACKS } = require("../scripts/gen-data-packs");
const read = name => fs.readFileSync(path.join(__dirname, "../public", name), "utf8");
// Compare every field, including executable URL fields, across VM realms.
const snapshot = (ctx, expression) => JSON.parse(vm.runInContext(`JSON.stringify(${expression}, (_, v) => typeof v === "function" ? { functionSource: v.toString() } : v)`, ctx));
test("core plus all packs reproduce every source record and exact catalogue order", () => {
  const source = vm.createContext({});
  vm.runInContext(read("data.js"), source);
  const expected = snapshot(source, "BENEFITS");
  for (const order of [PACKS, [...PACKS].reverse()]) {
    const ctx = vm.createContext({});
    vm.runInContext(read("data-core.js"), ctx);
    const coreIds = snapshot(ctx, "BENEFITS.map(b => b.id)");
    assert.ok(coreIds.includes("dtc"));
    assert.ok(!coreIds.includes("odsp"));
    for (const province of order) {
      const pack = read(`data-pack-${province}.js`);
      vm.runInContext(pack, ctx);
      vm.runInContext(pack, ctx); // repeated loads and the shared city dedupe
      const partial = snapshot(ctx, "BENEFITS");
      const ids = new Set(partial.map(b => b.id));
      assert.deepEqual(partial, expected.filter(b => ids.has(b.id)));
    }
    assert.deepEqual(snapshot(ctx, "BENEFITS"), expected);
    assert.deepEqual(snapshot(ctx, "BENEFIT_INDEX.map(row => row.slice(0, 2))"), expected.map(b => [b.id, b.level]));
  }
  const fallback = vm.createContext({});
  vm.runInContext(read("data-core.js"), fallback);
  vm.runInContext(read("data.js"), fallback); // kill switch: no lexical collisions
  assert.deepEqual(snapshot(fallback, "BENEFITS"), expected);
});

test("ensurePacks shares in-flight requests, validates packs, retries errors and honours the kill switch", async () => {
  const app = read("app.js");
  const loader = app.slice(app.indexOf("const DATA_PACKS ="), app.indexOf("const BC_ENABLED ="));
  const scripts = [];
  const ctx = vm.createContext({
    document: {
      createElement: () => ({ remove() {} }),
      head: { appendChild: script => scripts.push(script) },
      querySelector: () => ({ getAttribute: () => "app.js?v=231" }),
    },
  });
  vm.runInContext(read("data-core.js"), ctx);
  vm.runInContext(loader, ctx);
  const first = vm.runInContext('ensurePacks(["ON", "ON", "YT"])', ctx);
  const second = vm.runInContext('ensurePacks(["ON"])', ctx);
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, "data-pack-ON.js?v=231");
  vm.runInContext(read("data-pack-ON.js"), ctx);
  scripts[0].onload();
  await Promise.all([first, second]);
  await vm.runInContext('ensurePacks(["ON"])', ctx);
  assert.equal(scripts.length, 1);
  const failed = vm.runInContext('ensurePacks(["BC"])', ctx);
  scripts[1].onerror();
  await assert.rejects(failed, /could not be downloaded/);
  const retry = vm.runInContext('ensurePacks(["BC"])', ctx);
  assert.equal(scripts.length, 3);
  vm.runInContext(read("data-pack-BC.js"), ctx);
  scripts[2].onload();
  await retry;
  const disabled = vm.createContext({});
  vm.runInContext(read("data-core.js"), disabled);
  vm.runInContext(loader.replace("const DATA_PACKS = true;", "const DATA_PACKS = false;"), disabled);
  await vm.runInContext('ensurePacks(["ON", "BC"])', disabled); // no document needed
});
