"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "data.js");
const APP = path.join(ROOT, "public", "app.js");
const I18N = path.join(ROOT, "public", "i18n.js");
const GUIDE_GENERATOR = path.join(ROOT, "scripts", "gen-guide-pages.js");
const GUIDE_DIR = path.join(ROOT, "public", "guides");

const ctx = { window: {}, document: {}, console };
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(SRC, "utf8") + "\n" + ";globalThis.__B = BENEFITS;",
  ctx
);
const BENEFITS = ctx.__B;

const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const slugify = (id) => clean(id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

test("benefit notes use the Good to know heading everywhere", () => {
  assert.ok(BENEFITS.length >= 80, `Expected at least 80 benefit records, found ${BENEFITS.length}`);

  const withoutNote = BENEFITS.filter(
    (benefit) => typeof benefit.note !== "string" || !benefit.note.trim()
  );
  assert.equal(
    withoutNote.length,
    0,
    `Every benefit must have a non-empty note; missing for: ${withoutNote.map((benefit) => benefit.id).join(", ")}`
  );

  const generatedBenefitGuides = BENEFITS.filter((benefit) => {
    const guidePath = path.join(GUIDE_DIR, `${slugify(benefit.id)}.html`);
    return fs.existsSync(guidePath);
  });
  assert.ok(generatedBenefitGuides.length >= 80, `Expected at least 80 generated benefit guides, found ${generatedBenefitGuides.length}`);

  const guideFiles = fs.readdirSync(GUIDE_DIR).filter((file) => file.endsWith(".html"));
  let goodToKnowFiles = 0;
  for (const file of guideFiles) {
    const guideHtml = fs.readFileSync(path.join(GUIDE_DIR, file), "utf8");
    assert.ok(!guideHtml.includes("Who it is for"), `Wrong note heading found in ${file}`);
    if (guideHtml.includes("Good to know")) goodToKnowFiles += 1;
  }
  assert.ok(goodToKnowFiles >= 80, `Expected at least 80 guides with "Good to know", found ${goodToKnowFiles}`);

  const appSource = fs.readFileSync(APP, "utf8");
  assert.ok(appSource.includes('t("guide.goodToKnow")'), 'public/app.js must use t("guide.goodToKnow")');

  const i18nSource = fs.readFileSync(I18N, "utf8");
  const i18nReferences = i18nSource.match(/"guide\.goodToKnow"/g) || [];
  assert.ok(i18nReferences.length >= 2, `Expected guide.goodToKnow at least twice in public/i18n.js, found ${i18nReferences.length}`);

  const generatorSource = fs.readFileSync(GUIDE_GENERATOR, "utf8");
  assert.ok(generatorSource.includes("Good to know"), 'scripts/gen-guide-pages.js must contain "Good to know"');
  assert.ok(!generatorSource.includes("Who it is for"), 'scripts/gen-guide-pages.js must not contain "Who it is for"');
});
