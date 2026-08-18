"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { buildLinkCatalogue, benefitsInScope } = require("../scripts/link-sources");

/**
 * WHY THIS FILE EXISTS. scripts/link-sources.js is now the single definition of how a
 * monitorable link is derived, imported by both the generator and the data-procedure
 * guard. That removed a real drift hazard — the two used to be hand-synced copies and
 * fell out of step in #193 — but it also removed the only thing cross-checking the
 * labels and ordering, because the guard now compares a derivation against an artifact
 * produced by that same derivation.
 *
 * So these assertions are written against the SPEC, by hand, from fixtures. They must not
 * import anything from public/ or derive expectations from the module under test.
 */
const only = (over = {}) => ({ benefits: [], helpOrgs: [], grants: [], orgs: [], ...over });

test("a plain http(s) URL is registered with its cleaned label and kind", () => {
  const { links, skippedDynamic } = buildLinkCatalogue(
    only({ benefits: [{ name: "  Spaced   Name ", applyUrl: "https://example.org/a", source: "https://example.org/b" }] })
  );
  assert.deepEqual(links, [
    { url: "https://example.org/a", label: "Spaced Name — apply", kind: "apply" },
    { url: "https://example.org/b", label: "Spaced Name — official source", kind: "source" },
  ]);
  assert.equal(skippedDynamic, 0);
});

test("an answer-dependent function URL is SKIPPED and counted, never invented", () => {
  const dynamic = () => "https://example.org/depends-on-the-user";
  const { links, skippedDynamic } = buildLinkCatalogue(only({ benefits: [{ name: "N", applyUrl: dynamic }] }));
  assert.deepEqual(links, [], "the monitor must never fabricate a user's answers to build a URL");
  assert.equal(skippedDynamic, 1);
});

test("a function URL exposing a safe staticUrl IS registered and NOT counted as skipped", () => {
  const dynamic = () => "https://example.org/x";
  dynamic.staticUrl = "https://example.org/safe";
  const { links, skippedDynamic } = buildLinkCatalogue(only({ benefits: [{ name: "N", applyUrl: dynamic }] }));
  assert.deepEqual(links.map((l) => l.url), ["https://example.org/safe"]);
  assert.equal(skippedDynamic, 0);
});

test("non-http values are dropped silently and do not inflate the skip count", () => {
  const { links, skippedDynamic } = buildLinkCatalogue(
    only({ benefits: [{ name: "N", applyUrl: "mailto:a@b.c", source: undefined }, { name: "M", applyUrl: "/relative" }] })
  );
  assert.deepEqual(links, []);
  assert.equal(skippedDynamic, 0, "only unmonitorable FUNCTION urls count as skipped");
});

test("a repeated URL is registered once, keeping the FIRST label", () => {
  const { links } = buildLinkCatalogue(
    only({
      benefits: [{ name: "First", applyUrl: "https://example.org/same" }],
      helpOrgs: [{ name: "Second", url: "https://example.org/same" }],
    })
  );
  assert.equal(links.length, 1);
  assert.equal(links[0].label, "First — apply");
});

test("ordering is contractual: benefits, help, grants, orgs, then province fallbacks", () => {
  const { links } = buildLinkCatalogue({
    benefits: [{ name: "B", applyUrl: "https://e.org/benefit" }],
    helpOrgs: [{ name: "H", url: "https://e.org/help" }],
    grants: [{ id: "g1", name: "G", url: "https://e.org/grant" }],
    orgs: [{ id: "o1", name: "O", url: "https://e.org/org" }],
    studentAid: { AB: "https://e.org/sa" },
    twoEleven: { AB: "https://e.org/211" },
    employment: { AB: "https://e.org/emp" },
    fedStudentAid: "https://e.org/fed",
    national211: "https://e.org/nat211",
  });
  assert.deepEqual(links.map((l) => l.kind), ["apply", "help", "grant", "org", "help", "help", "help", "help", "help"]);
  assert.deepEqual(links.map((l) => l.url), [
    "https://e.org/benefit", "https://e.org/help", "https://e.org/grant", "https://e.org/org",
    "https://e.org/sa", "https://e.org/211", "https://e.org/emp", "https://e.org/fed", "https://e.org/nat211",
  ]);
});

test("province fallback labels name their map and province", () => {
  const { links } = buildLinkCatalogue(only({ twoEleven: { BC: "https://e.org/bc211" } }));
  assert.deepEqual(links, [
    { url: "https://e.org/bc211", label: "Province fallback — 2-1-1 (BC)", kind: "help" },
  ]);
});

test("HELP_ORGS is accepted as an array or as an object of arrays, flattened identically", () => {
  const asArray = buildLinkCatalogue(only({ helpOrgs: [{ name: "A", url: "https://e.org/1" }] }));
  const asObject = buildLinkCatalogue(only({ helpOrgs: { ab: [{ name: "A", url: "https://e.org/1" }] } }));
  assert.deepEqual(asObject.links, asArray.links);
});

test("benefitsInScope drops BC entries only when BC is disabled", () => {
  const benefits = [
    { name: "fed", level: "Federal" },
    { name: "bc", level: "British Columbia" },
    { name: "metro", level: "Metro Vancouver" },
    { name: "city", level: "Kelowna" },
  ];
  const cities = ["Kelowna"];
  assert.equal(benefitsInScope(benefits, cities, true).length, 4);
  assert.deepEqual(benefitsInScope(benefits, cities, false).map((b) => b.name), ["fed"]);
});
