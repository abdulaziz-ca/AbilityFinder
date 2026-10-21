#!/usr/bin/env node
// Copies the v2 design layer into the marked block at the end of public/styles.css,
// so the site keeps shipping one versioned stylesheet (pages and guides carry
// exactly three ?v= assets; see test/data-procedure.test.js).
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(ROOT, "research/2026-10-redesign/impl/v2.css"), "utf8").trim();
const file = path.join(ROOT, "public/styles.css");
const css = fs.readFileSync(file, "utf8");
const start = css.indexOf("/* === DESIGN V2 START ===");
const end = css.indexOf("/* === DESIGN V2 END === */");
if (start < 0 || end < start) { console.error("build-v2-css: markers not found in styles.css"); process.exit(1); }
const head = css.slice(0, css.indexOf("\n", start) + 1);
fs.writeFileSync(file, head + src + "\n" + css.slice(end));
console.log(`build-v2-css: ${src.length} bytes`);
