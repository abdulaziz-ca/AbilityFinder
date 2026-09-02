"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "data.js");
const APP = path.join(ROOT, "public", "app.js");
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
const unescapeGuideHtml = (html) => html
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&quot;/g, "\"")
  .replace(/&#39;/g, "'");

const withRequiresNote = BENEFITS.filter(
  (benefit) => typeof benefit.requiresNote === "string" && benefit.requiresNote.trim()
);

test("requiresNote stays populated, rendered, searchable, and present in generated guides", () => {
  assert.ok(withRequiresNote.length >= 40, `Expected at least 40 requiresNote records, found ${withRequiresNote.length}`);

  const appSource = fs.readFileSync(APP, "utf8");
  const appReferences = appSource.match(/b\.requiresNote/g) || [];
  assert.ok(appReferences.length >= 2, `Expected b.requiresNote at least twice in public/app.js, found ${appReferences.length}`);

  const generatorSource = fs.readFileSync(GUIDE_GENERATOR, "utf8");
  assert.ok(generatorSource.includes("b.requiresNote"), "scripts/gen-guide-pages.js must render b.requiresNote");

  let foundHeading = false;
  for (const benefit of withRequiresNote) {
    const guidePath = path.join(GUIDE_DIR, `${slugify(benefit.id)}.html`);
    assert.ok(fs.existsSync(guidePath), `Missing guide for ${benefit.id}: ${guidePath}`);

    const guideHtml = fs.readFileSync(guidePath, "utf8");
    if (guideHtml.includes("What you must meet")) foundHeading = true;
    const normalizedGuide = clean(unescapeGuideHtml(guideHtml));

    // A record may express its eligibility either as prose (`requiresNote`) or as
    // a structured list (`eligibility.items`). Whichever form it uses, the
    // eligibility information must still appear verbatim in the generated guide —
    // the point of this guard is that eligibility content is never silently
    // dropped when a record is converted from prose to a list.
    if (benefit.eligibility && Array.isArray(benefit.eligibility.items) && benefit.eligibility.items.length) {
      for (const item of benefit.eligibility.items) {
        const normalizedItem = clean(item);
        assert.ok(
          normalizedGuide.includes(normalizedItem),
          `Generated guide for ${benefit.id} is missing eligibility item "${normalizedItem.slice(0, 60)}…": ${guidePath}`
        );
      }
      if (benefit.eligibility.note) {
        assert.ok(
          normalizedGuide.includes(clean(benefit.eligibility.note)),
          `Generated guide for ${benefit.id} does not contain its eligibility note: ${guidePath}`
        );
      }
    } else {
      const normalizedNote = clean(benefit.requiresNote);
      assert.ok(
        normalizedGuide.includes(normalizedNote),
        `Generated guide for ${benefit.id} does not contain its requiresNote: ${guidePath}`
      );
    }
  }

  assert.ok(foundHeading, 'Expected "What you must meet" in at least one generated guide page');
});
