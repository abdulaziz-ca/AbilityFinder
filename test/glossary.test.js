"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "public", "data.js"), "utf8") + "\nglobalThis.G = GLOSSARY; globalThis.B = BENEFITS; globalThis.f = glossaryTermsFor;", ctx);

test("glossary entries are short, plain expansions and leave out known-ambiguous acronyms", () => {
  for (const [abbr, exp] of Object.entries(ctx.G)) {
    assert.match(abbr, /^[A-Z][A-Z0-9-]{1,7}$/, abbr);
    assert.ok(exp && exp.length <= 70 && !/[.;]$/.test(exp), `${abbr}: ${exp}`);
  }
  // Two different programs use each of these; an expansion would be wrong somewhere.
  for (const ambiguous of ["APP", "ATS", "CCC", "RAP", "CNIB"]) assert.ok(!(ambiguous in ctx.G), ambiguous);
});

test("a guide lists only abbreviations that appear in its own text", () => {
  const aish = Array.from(ctx.f(ctx.B.find((b) => b.id === "aish")), ([a]) => a);
  assert.ok(aish.includes("AISH") && aish.includes("ADAP"));
  assert.ok(!aish.includes("ODSP"));
  const html = fs.readFileSync(path.join(__dirname, "..", "public", "guides", "aish.html"), "utf8");
  assert.ok(html.includes('<abbr title="Assured Income for the Severely Handicapped">AISH</abbr>'));
});
