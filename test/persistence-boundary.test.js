"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const PUBLIC = path.join(__dirname, "..", "public");

function source(name) {
  return fs.readFileSync(path.join(PUBLIC, name), "utf8");
}

test("raw IndexedDB access remains encapsulated in dbManager.js", () => {
  for (const name of fs.readdirSync(PUBLIC).filter((file) => file.endsWith(".js") && file !== "dbManager.js")) {
    const text = source(name);
    assert.doesNotMatch(text, /\bindexedDB\s*\.(?:open|deleteDatabase|databases)\s*\(/, name);
    assert.doesNotMatch(text, /\bIDB(?:Database|Transaction|ObjectStore|Request)\b/, name);
  }
});

test("production logic uses localStorage only inside the one-time migration manager", () => {
  for (const name of fs.readdirSync(PUBLIC).filter((file) => file.endsWith(".js") && file !== "dbManager.js")) {
    assert.doesNotMatch(
      source(name),
      /localStorage\s*\.\s*(?:getItem|setItem|removeItem|clear)\s*\(/,
      name
    );
  }
});

test("the persisted answer whitelist excludes free-text postal data", () => {
  const stateManager = source("stateManager.js");
  const answerKeys = /const ANSWER_KEYS = \[([\s\S]*?)\];/.exec(stateManager);
  assert.ok(answerKeys, "ANSWER_KEYS must remain explicit");
  assert.doesNotMatch(answerKeys[1], /postal/);
});
