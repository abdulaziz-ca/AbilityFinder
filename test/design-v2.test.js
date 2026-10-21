"use strict";
// The 2026 redesign is one switch in two places (the app and the static guides),
// all scoped under html.v2 so turning it off restores the previous design.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

test("app and static guides share one DESIGN_V2 value", () => {
  const flag = (src) => (/var DESIGN_V2 = (true|false);/.exec(src) || [])[1];
  const app = flag(read("public/theme-init.js")), guides = flag(read("public/guide-prefs.js"));
  assert.ok(app, "theme-init.js declares DESIGN_V2");
  assert.equal(guides, app, "guide-prefs.js matches theme-init.js");
});

test("the v2 layer is built into styles.css and fully scoped under html.v2", () => {
  const css = read("public/styles.css");
  const start = css.indexOf("/* === DESIGN V2 START ===");
  const end = css.indexOf("/* === DESIGN V2 END === */");
  assert.ok(start > 0 && end > start, "markers present");
  const block = css.slice(css.indexOf("\n", start) + 1, end);
  assert.equal(block.trim(), read("research/2026-10-redesign/impl/v2.css").trim(), "styles.css is in sync with impl/v2.css (run node scripts/build-v2-css.js)");
  // Every selector in the block starts with html.v2 (inside @media too); @keyframes are global names prefixed v2.
  const stripped = block.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@keyframes\s+([\w-]+)\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, (m, name) => { assert.match(name, /^v2/, `keyframes ${name} is v2-prefixed`); return ""; });
  const selectors = [...stripped.matchAll(/(?:^|[{}])\s*([^{}@][^{}]*)\{/g)].map((m) => m[1].trim()).filter(Boolean);
  const bad = selectors.flatMap((sel) => sel.split(",").map((s) => s.trim())).filter((s) => s && !s.startsWith("@") && !s.startsWith("html.v2") && !/^(from|to|\d+%)/.test(s));
  assert.deepEqual(bad, [], "unscoped selectors would change the old design too");
});

test("motion respects reduced-motion preferences", () => {
  const app = read("public/app.js");
  assert.match(app, /function v2MotionAllowed\(\)[\s\S]*prefers-reduced-motion: reduce[\s\S]*a11y-nomotion/);
  assert.match(app, /v2Ribbon\(v2RibbonHost\.querySelector\("canvas"\), !v2MotionAllowed\(\)/, "ribbon is a still frame without motion");
});
