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

test("analytics is cookieless Cloudflare Web Analytics only, disclosed, and nothing else", () => {
  // Owner decision 2026-10-20: count visits to measure marketing. The boundary is one
  // beacon from one origin, disclosed on the privacy page, with no cookies and nothing
  // from the questionnaire.
  const app = source("public/app.js");
  const html = source("public/index.html");
  const notFound = source("public/404.html");
  const i18n = source("public/i18n.js");
  const headers = source("public/_headers");
  const generator = source("scripts/gen-guide-pages.js");
  const embed = source("public/embed.html");
  const guidesDir = path.join(ROOT, "public", "guides");

  assert.match(app, /uses <b>Cloudflare Web Analytics<\/b> to count visits/i);
  assert.match(app, /does not use cookies, does not follow you to other websites, and never sees your answers/i);
  assert.doesNotMatch(app, /does not run client-side analytics|use third-party trackers/i);
  assert.match(i18n, /cookieless Cloudflare Web Analytics/i);
  assert.match(i18n, /Cloudflare Web Analytics, sans témoins/i);

  const loader = source("public/analytics.js");
  assert.match(loader, /location\.hostname !== "abilityfinder\.ca"/, "only the real site counts visits");
  assert.match(loader, /https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/);
  const token = (/token: "([^"]+)"/.exec(loader) || [])[1];
  assert.ok(token, "loader carries the site token");
  if (process.env.CI || process.env.REQUIRE_WA_TOKEN) assert.match(token, /^[0-9a-f]{32}$/, "real Web Analytics token, not the placeholder");
  const LOADER = /<script defer src="\/?analytics\.js[^"]*"><\/script>/g;
  for (const [name, text] of [["index", html], ["404", notFound], ["guide generator", generator]]) {
    assert.equal([...text.matchAll(LOADER)].length, 1, `${name} loads analytics.js once`);
    assert.doesNotMatch(text, /cloudflareinsights/, `${name} has no direct beacon tag`);
  }
  assert.doesNotMatch(embed, /analytics\.js|cloudflareinsights/, "the partner embed does not count partner visitors");

  assert.match(headers, /script-src 'self' https:\/\/static\.cloudflareinsights\.com;/);
  assert.match(headers, /connect-src 'self' https:\/\/cloudflareinsights\.com;/);
  for (const csp of headers.split("\n").filter((line) => /^\s*Content-Security-Policy:/.test(line))) {
    assert.doesNotMatch(csp, /script-src[^;]*'unsafe-inline'/, "no inline scripts");
  }
  for (const text of [app, html, generator]) {
    assert.doesNotMatch(text, /googletagmanager|google-analytics|gtag\(|plausible\.io|matomo|hotjar|segment\.com|facebook\.net/i);
  }
  assert.doesNotMatch(app, /document\.cookie\s*=/);

  for (const file of fs.readdirSync(guidesDir).filter((name) => name.endsWith(".html"))) {
    const guide = fs.readFileSync(path.join(guidesDir, file), "utf8");
    assert.equal([...guide.matchAll(LOADER)].length, 1, `generated guide ${file} loads analytics.js once`);
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
