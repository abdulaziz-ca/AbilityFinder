"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { generate } = require("../scripts/gen-data-packs");
test("core and every province pack are regenerated with no drift or stale files", () => {
  const files = generate();
  const dir = path.join(__dirname, "../public");
  assert.deepEqual(fs.readdirSync(dir).filter(name => /^data-(core|pack-.*)\.js$/.test(name)).sort(), Object.keys(files).sort());
  for (const [name, text] of Object.entries(files)) {
    assert.equal(fs.readFileSync(path.join(dir, name), "utf8"), text, `${name} is stale; run npm run gen:packs`);
  }
});
