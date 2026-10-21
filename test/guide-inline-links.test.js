"use strict";
// Static guides once printed raw "<a href=...>" text where a record's aboutList holds an
// official link (cdb-adult, rdsp). Only https links become anchors; nothing else unescapes.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const dir = path.join(__dirname, "..", "public", "guides");

test("no static guide shows escaped link markup", () => {
  const bad = fs.readdirSync(dir).filter((f) => f.endsWith(".html") && fs.readFileSync(path.join(dir, f), "utf8").includes("&lt;a href"));
  assert.deepEqual(bad, []);
});

test("the CDB guide links to the official estimator", () => {
  const html = fs.readFileSync(path.join(dir, "cdb-adult.html"), "utf8");
  assert.match(html, /<a class="guide-link" href="https:\/\/www\.canada\.ca\/en\/services\/benefits\/disability\/canada-disability-benefit\/amount\.html" rel="noopener">Estimate your benefit amount<\/a>/);
});
