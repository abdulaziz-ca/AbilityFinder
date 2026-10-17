"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "public", "data.js"), "utf8") + "\nglobalThis.S = BENEFIT_STATUS; globalThis.ids = BENEFITS.map(b => b.id);", ctx);

test("time-limited status badges point at real programs, use a known kind and stay short", () => {
  const ids = new Set(ctx.ids);
  for (const [id, s] of Object.entries(ctx.S)) {
    assert.ok(ids.has(id), `${id} is a program`);
    assert.ok(["closing", "closed", "deadline"].includes(s.kind), `${id} kind`);
    assert.ok(s.text && s.text.length <= 120, `${id} text length ${s.text.length}`);
  }
});

test("every generated guide for a time-limited program shows its badge", () => {
  for (const [id, s] of Object.entries(ctx.S)) {
    const file = path.join(__dirname, "..", "public", "guides", `${id}.html`);
    const html = fs.readFileSync(file, "utf8");
    assert.ok(html.includes(`status-badge status-${s.kind}`), `${id} badge`);
  }
});
