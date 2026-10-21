"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

function appContext() {
  const classList = { contains: () => false, toggle() {}, add() {}, remove() {} };
  const context = {
    console, setTimeout, clearTimeout, URL, URLSearchParams, Intl, Date, Map, Set,
    Promise, structuredClone, Blob: function Blob() {}, navigator: {},
    history: { pushState() {}, replaceState() {} }, location: {},
    window: {
      location: { search: "" }, addEventListener() {}, open() {},
      matchMedia: () => ({ matches: false }),
    },
    document: {
      addEventListener() {}, querySelector: () => null, querySelectorAll: () => [],
      documentElement: { classList, setAttribute() {} }, body: { classList },
    },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  };
  context.window.window = context.window;
  context.window.document = context.document;
  context.globalThis = context;
  vm.createContext(context);

  const files = [
    "stateManager.js", "icons.js", "i18n.js", "data-core.js",
    ...fs.readdirSync(PUBLIC).filter((name) => /^data-pack-.*\.js$/.test(name)).sort(),
    "changelog.js", "grants-data.js", "orgs-data.js", "resultsGroups.js", "app.js",
  ];
  for (const file of files) {
    vm.runInContext(fs.readFileSync(path.join(PUBLIC, file), "utf8"), context, { filename: file });
  }
  return context;
}

function count(text, fragment) {
  return text.split(fragment).length - 1;
}

test("results explain the three limits without opening the panel by default", () => {
  const context = appContext();
  const result = vm.runInContext(`
    answers = { ...BLANK(), province: "AB", city: "Calgary", forWho: "self",
      ageBand: "19to59", ageGroup: "adult", citizenPR: true,
      disabilities: ["physical"], functionalNeeds: ["mobility"], income: "low" };
    const normalHtml = renderResults();
    const originalResultGroups = resultGroups;
    resultGroups = (evaluated) => ({ ...originalResultGroups(evaluated), g2: [] });
    const withoutOtherHtml = renderResults();
    resultGroups = originalResultGroups;
    ({ normalHtml, withoutOtherHtml });
  `, context);

  assert.equal(count(result.normalHtml, 'class="limits-panel"'), 1);
  assert.doesNotMatch(result.normalHtml, /<details class="limits-panel" open/);
  for (const lead of [
    "Programs we have not added yet.",
    "Whether you will be approved.",
    "Details we did not ask about.",
  ]) assert.match(result.normalHtml, new RegExp(lead.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(result.normalHtml, /The ones we know about are under Other programs to check\./);
  assert.doesNotMatch(result.withoutOtherHtml, /The ones we know about are under Other programs to check\./);
});

test("the app guide contains the approval limit sentence once", () => {
  const context = appContext();
  const html = vm.runInContext('renderDetail("aish")', context);
  assert.equal(count(html, "What this guide can't tell you:"), 1);
  assert.equal(count(html, "whether you will be approved. The program decides, often using details we do not ask for."), 1);
});
