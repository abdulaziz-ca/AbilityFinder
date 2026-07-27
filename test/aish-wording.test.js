"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");
const TARGET_ID = "aish";

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function loadTarget() {
  const source = read("public/data.js");
  const context = { window: {}, document: {}, navigator: {}, console };
  vm.runInNewContext(
    `${source}
    ;globalThis.__captured = {
      benefit: BENEFITS.find((item) => item.id === ${JSON.stringify(TARGET_ID)}),
      extra: BENEFIT_EXTRA[${JSON.stringify(TARGET_ID)}],
    };`,
    context,
    { filename: "public/data.js" }
  );
  return context.__captured;
}

const sources = {
  data: read("public/data.js"),
  app: read("public/app.js"),
  context: read("src/benefits-context.js"),
  guide: read("public/guides/aish.html"),
};
const { benefit, extra } = loadTarget();

test("no AISH surface uses the weaker earn-a-living test", () => {
  for (const [name, source] of Object.entries(sources)) {
    assert.doesNotMatch(source, /earn a living/i, `${name} contains the earn-a-living test`);
    assert.doesNotMatch(
      source,
      /substantially limits your ability/i,
      `${name} contains the substantially-limits test`
    );
  }
});

test("every AISH surface states the official employment test", () => {
  assert.match(benefit.summary, /prevents employment/);
  assert.match(benefit.note, /prevents employment/);
  assert.match(benefit.detail.about, /prevents employment/);

  const medicalReportDocument = benefit.detail.documents.find((entry) =>
    /medical report/i.test(entry)
  );
  assert.ok(medicalReportDocument, "AISH documents should include the medical report");
  assert.match(medicalReportDocument, /prevents employment/);

  assert.match(extra.confirm, /permanently prevents employment/);
  assert.ok(
    extra.denials.some((entry) => /permanently prevents employment/.test(entry)),
    "an AISH denial should state the permanent-employment test"
  );
  assert.ok(
    benefit.detail.tips.some((entry) => /permanently prevents employment/.test(entry)),
    "an AISH tip should state the permanent-employment test"
  );
  assert.match(sources.guide, /prevents employment/);
  assert.match(sources.context, /prevents employment/);
});

test("the matcher gates are unchanged and conservative", () => {
  assert.deepEqual(Array.from(benefit.requires), [
    "adult",
    "ab",
    "citizenPR",
    "aishMedical",
    "aishFinancial",
  ]);

  const gateStart = sources.app.indexOf("aishMedical: {");
  assert.notEqual(gateStart, -1, "public/app.js should define the aishMedical gate");
  const gateSource = sources.app.slice(gateStart, gateStart + 200);
  assert.match(gateSource, /met: \(\) => false/);
  assert.match(gateSource, /fixed: false/);
  assert.ok(!benefit.requires.includes("unableToWork"));
});

test("the assistant grounding carries no prohibited numeric AISH facts", () => {
  const aishName = "Assured Income for the Severely Handicapped";
  const start = sources.context.indexOf(aishName);
  assert.notEqual(start, -1, "assistant grounding should contain the AISH entry");
  assert.doesNotMatch(sources.context.slice(start, start + 400), /\$[0-9]/);
});
