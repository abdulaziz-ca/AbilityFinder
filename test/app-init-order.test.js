"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appjs = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");

test("init wires accessibility before it records history.state (guards the #200 readiness signal)", () => {
  const start = appjs.indexOf('addEventListener("DOMContentLoaded"');
  assert.ok(start !== -1, "DOMContentLoaded init handler not found in public/app.js");
  const body = appjs.slice(start);
  const wire = body.indexOf("wireAccessibility()");
  const stamp = body.indexOf('history.replaceState({ view, stepIndex, detailId }');
  assert.ok(wire !== -1, "wireAccessibility() call not found in the init handler");
  assert.ok(stamp !== -1, "history.replaceState({ view, stepIndex, detailId }) not found in the init handler");
  assert.ok(
    wire < stamp,
    "wireAccessibility() must run BEFORE history.replaceState so a non-null history.state proves the app is wired (e2e/app-ready.js waitForAppReady). Reordering silently disarms the readiness wait."
  );
});

test("the readiness helper keys off history.state, matching the init invariant", () => {
  const helper = fs.readFileSync(path.join(__dirname, "..", "e2e", "app-ready.js"), "utf8");
  assert.match(helper, /history\.state/, "e2e/app-ready.js must wait on history.state to stay in sync with the init handler");
});
