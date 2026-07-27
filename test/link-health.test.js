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

function loadGeneratedLinkCatalog() {
  const source = fs.readFileSync(path.join(ROOT, "src", "links.js"), "utf8")
    .replace("export const LINKS =", "globalThis.LINKS =")
    .replace("export const SKIPPED_DYNAMIC =", "globalThis.SKIPPED_DYNAMIC =");
  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "src/links.js" });
  return { links: context.LINKS, skippedDynamic: context.SKIPPED_DYNAMIC };
}

function loadBenefits() {
  const source = fs.readFileSync(path.join(ROOT, "public", "data.js"), "utf8");
  const context = { window: {}, document: {}, console };
  vm.createContext(context);
  vm.runInContext(
    source + "\n;globalThis.BENEFITS_FOR_TEST = BENEFITS;",
    context,
    { filename: "public/data.js" }
  );
  return context.BENEFITS_FOR_TEST;
}

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

test("generated links monitor a dynamic URL's safe staticUrl exactly once", () => {
  const benefits = loadBenefits();
  const { links, skippedDynamic } = loadGeneratedLinkCatalog();
  const handyDart = benefits.find((benefit) => benefit.id === "handydart-bctransit");
  const chooser = "https://www.bctransit.com/";

  assert.ok(handyDart);
  assert.equal(typeof handyDart.applyUrl, "function");
  assert.equal(handyDart.applyUrl.staticUrl, chooser);
  assert.equal(handyDart.source, handyDart.applyUrl);
  const chooserLinks = links.filter((link) => link.url === chooser);
  assert.equal(chooserLinks.length, 1);
  assert.equal(chooserLinks[0].url, chooser);
  assert.equal(chooserLinks[0].label, "handyDART (BC Transit) — apply");
  assert.equal(chooserLinks[0].kind, "apply");

  const regionalUrls = new Set(
    ["Victoria", "Colwood", "Langford", "Saanich", "Kelowna", "Kamloops", "Nanaimo", "Parksville"]
      .map((city) => handyDart.applyUrl({ city }))
  );
  for (const url of regionalUrls) {
    assert.equal(links.some((link) => link.url === url), false, `Regional URL must not be monitored: ${url}`);
  }

  const dynamicWithoutStaticUrl = benefits.reduce((count, benefit) => {
    return count + [benefit.applyUrl, benefit.source].filter(
      (url) => typeof url === "function" &&
        (typeof url.staticUrl !== "string" || !url.staticUrl.startsWith("http"))
    ).length;
  }, 0);
  assert.equal(skippedDynamic, dynamicWithoutStaticUrl);
});
