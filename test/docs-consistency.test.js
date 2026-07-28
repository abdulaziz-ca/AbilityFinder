"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function readRepoFile(...parts) {
  return fs.readFileSync(path.join(ROOT, ...parts), "utf8");
}

function loadBenefits() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    `${readRepoFile("public", "data.js")}\nglobalThis.__benefits = BENEFITS;`,
    context
  );
  return context.__benefits;
}

test("HANDOFF.md does not claim British Columbia is parked or unloaded", () => {
  const handoff = readRepoFile("HANDOFF.md");

  assert.doesNotMatch(handoff, /BC is (not )?parked/i);
  assert.equal(handoff.includes("public/data-provinces-later.js"), false);
  assert.match(handoff, /British Columbia is live/i);
});

test("documented benefit counts match the catalogue", () => {
  const handoff = readRepoFile("HANDOFF.md");
  const benefits = loadBenefits();
  const documentedCounts = handoff.match(
    /catalog holds\s+\*\*(\d+) benefits\*\*\s+[^.]*?(\d+) federal,\s*(\d+) Alberta,\s*(\d+) British Columbia/i
  );

  assert.ok(documentedCounts, "HANDOFF.md must state the total, federal, Alberta, and British Columbia benefit counts together");

  const actual = {
    total: benefits.length,
    federal: benefits.filter((benefit) => benefit.level === "Federal").length,
    alberta: benefits.filter((benefit) => benefit.level === "Alberta").length,
    britishColumbia: benefits.filter((benefit) => benefit.level === "British Columbia").length,
  };
  const documented = {
    total: Number(documentedCounts[1]),
    federal: Number(documentedCounts[2]),
    alberta: Number(documentedCounts[3]),
    britishColumbia: Number(documentedCounts[4]),
  };

  assert.deepEqual(documented, actual);
});

test("BC_ENABLED in the code matches what the docs say", () => {
  const handoff = readRepoFile("HANDOFF.md");
  const app = readRepoFile("public", "app.js");
  const match = app.match(/const BC_ENABLED = (true|false)/);

  assert.match(handoff, /British Columbia is live/i);
  assert.ok(match, "public/app.js must declare BC_ENABLED as a boolean literal");
  assert.equal(match[1], "true");
});

test("no doc references the parked file at its old deployed path", () => {
  const docs = [readRepoFile("HANDOFF.md"), readRepoFile("ROADMAP.md")];
  let archivedReferences = 0;

  for (const doc of docs) {
    assert.equal(doc.includes("public/data-provinces-later.js"), false);
    archivedReferences += doc.match(/archive\/data-provinces-later\.js/g)?.length || 0;
    assert.equal(
      doc.replaceAll("archive/data-provinces-later.js", "").includes("data-provinces-later.js"),
      false,
      "every parked-file reference must use the archive path"
    );
  }
  assert.ok(archivedReferences > 0, "the parked file should remain documented at its archive path");
  assert.equal(fs.existsSync(path.join(ROOT, "archive", "data-provinces-later.js")), true);
  assert.equal(fs.existsSync(path.join(ROOT, "public", "data-provinces-later.js")), false);
});
