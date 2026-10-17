"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const headers = fs.readFileSync(path.join(ROOT, "public", "_headers"), "utf8");

// Paths given a one-year immutable cache, except the fonts directory rule.
function immutablePaths() {
  const out = [];
  let current = null;
  for (const line of headers.split("\n")) {
    if (/^\/\S*$/.test(line)) current = line.trim();
    else if (current && /Cache-Control:.*immutable/.test(line)) out.push(current);
  }
  return out.filter((p) => p !== "/fonts/*");
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? htmlFiles(path.join(dir, e.name)) : e.name.endsWith(".html") ? [path.join(dir, e.name)] : []);
}

test("every immutable-cached file is referenced only with ?v=N, everywhere", () => {
  const paths = immutablePaths();
  assert.ok(paths.includes("/app.js") && paths.includes("/styles.css"), "expected rules for app.js and styles.css");
  const sources = htmlFiles(path.join(ROOT, "public")).map((f) => [path.relative(ROOT, f), fs.readFileSync(f, "utf8")]);
  const problems = [];
  for (const p of paths) {
    const name = p.slice(1).replace(/[.]/g, "\\.");
    const ref = new RegExp(`(?:src|href)="/?${name}(\\?[^"]*)?"`, "g");
    for (const [file, text] of sources) {
      for (const m of text.matchAll(ref)) if (!/^\?v=\d+$/.test(m[1] || "")) problems.push(`${file}: ${m[0]}`);
    }
    assert.ok(fs.existsSync(path.join(ROOT, "public", p.slice(1))), `${p} exists`);
  }
  assert.deepEqual(problems, []);
});

test("unversioned embed.js and the HTML are never long-cached", () => {
  const paths = immutablePaths();
  for (const p of ["/embed.js", "/index.html", "/embed.html", "/*"]) assert.ok(!paths.includes(p), p);
});
