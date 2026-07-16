"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const source = (name) => fs.readFileSync(path.join(ROOT, name), "utf8");

test("user-facing privacy copy discloses assistant and feedback submissions", () => {
  const app = source("public/app.js");
  const html = source("public/index.html");
  const i18n = source("public/i18n.js");
  const readme = source("README.md");
  const archive = source("ARCHIVAL_KNOWLEDGE_BASE.md");

  assert.doesNotMatch(app, /There is <b>one exception<\/b>|assistant — the one exception|only part of AbilityFinder that sends/i);
  assert.match(app, /two optional ways information leaves your browser/i);
  assert.match(app, /feedback.*emailed to AbilityFinder/i);
  assert.doesNotMatch(html, /only part of AbilityFinder that sends anything over the internet/i);
  assert.match(html, /feedback form is the other optional submission/i);
  assert.match(i18n, /Send feedback.*sends this form to AbilityFinder/i);
  assert.match(i18n, /Envoyer.*envoie ce formulaire à AbilityFinder/i);
  assert.match(readme, /Feedback text is not saved in IndexedDB/i);
  assert.match(readme, /submitted copy is emailed/i);
  assert.match(archive, /Privacy copy must enumerate both opt-in submissions/i);
});

test("assistant disclosures describe the full in-memory conversation sent", () => {
  const app = source("public/app.js");
  const html = source("public/index.html");
  const readme = source("README.md");
  const handoff = source("HANDOFF.md");

  for (const [name, text] of [["app", app], ["html", html], ["README", readme], ["HANDOFF", handoff]]) {
    assert.match(text, /entire current in-memory conversation.*up to 20 messages/i, name);
  }
});

test("privacy invariants acknowledge nonsensitive browse and Maps exceptions", () => {
  const agents = source("AGENTS.md");
  const handoff = source("HANDOFF.md");

  assert.doesNotMatch(agents, /No free text belongs in URLs or persistent state\./);
  assert.doesNotMatch(handoff, /Verify no free text appears in IndexedDB or URLs\./);
  for (const [name, text] of [["AGENTS", agents], ["HANDOFF", handoff]]) {
    assert.match(text, /browseQuery/i, name);
    assert.match(text, /user-initiated Google Maps/i, name);
    assert.match(text, /sensitive wizard|profile data/i, name);
  }
});

test("all generated-file inputs appear in regeneration instructions", () => {
  for (const file of ["AGENTS.md", "README.md", "ROADMAP.md", "DEPLOY.md"]) {
    const text = source(file);
    for (const symbol of ["BENEFITS", "HELP_ORGS", "PRACTITIONER_FORMS"]) {
      assert.match(text, new RegExp(symbol), `${file} must mention ${symbol}`);
    }
  }
});

test("legacy cleanup documentation covers authoritative snapshots and tombstones", () => {
  for (const file of ["AGENTS.md", "HANDOFF.md"]) {
    const text = source(file);
    assert.match(text, /authoritative (?:IndexedDB )?snapshot or tombstone/i, file);
  }
});

test("source comments link to current headings and schedules", () => {
  const html = source("public/index.html");
  const css = source("public/styles.css");
  const app = source("public/app.js");
  const data = source("public/data.js");
  const worker = source("src/index.js");
  const linkCheck = source("src/link-check.js");

  assert.doesNotMatch(html, /HANDOFF §9/);
  assert.match(html, /HANDOFF\.md.*Assistant grounding/);
  assert.doesNotMatch(css, /HANDOFF §"detail sidebar"/);
  assert.match(css, /ARCHIVAL_KNOWLEDGE_BASE\.md.*Media-query order caused a sticky overlay/);
  assert.doesNotMatch(worker, /weekly check/i);
  assert.match(worker, /three-hour check/i);
  for (const [name, text] of [["app", app], ["data", data], ["styles", css], ["Worker", worker], ["link check", linkCheck]]) {
    assert.doesNotMatch(text, /Phase \d/i, `${name} should not retain milestone labels`);
  }
});
