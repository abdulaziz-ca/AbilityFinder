"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function loadDetectSoftDead() {
  let source = fs.readFileSync(path.join(ROOT, "src", "link-check.js"), "utf8");
  source = source
    .replace('import { LINKS, SKIPPED_DYNAMIC } from "./links.js";\n', "")
    .replace(/\bexport function detectSoftDead/, "globalThis.detectSoftDead = function detectSoftDead")
    .replace(/\bexport const /g, "const ")
    .replace(/\bexport async function /g, "async function ");

  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.detectSoftDead;
}

const detectSoftDead = loadDetectSoftDead();

test("detectSoftDead identifies URL-based soft 404s", () => {
  assert.equal(detectSoftDead("https://x.ca/some/404", ""), true);
});

test("detectSoftDead identifies not-found titles", () => {
  assert.equal(
    detectSoftDead(
      "https://x.ca/aish",
      "<html><head><title>Page not found</title></head><body></body></html>"
    ),
    true
  );
});

test("detectSoftDead identifies not-found first headings", () => {
  assert.equal(
    detectSoftDead(
      "https://x.ca/moved",
      "<title>Government of B.C.</title><h1>Page not found</h1>"
    ),
    true
  );
});

test("detectSoftDead accepts healthy title and heading text", () => {
  assert.equal(
    detectSoftDead(
      "https://x.ca/aish",
      "<title>AISH — Alberta.ca</title><h1>Assured Income for the Severely Handicapped</h1>"
    ),
    false
  );
});

test("detectSoftDead ignores not-found wording in body prose", () => {
  assert.equal(
    detectSoftDead(
      "https://x.ca/help",
      "<title>Help</title><body><p>If you ever see a 404 or a page not found message, refresh.</p></body>"
    ),
    false
  );
});
