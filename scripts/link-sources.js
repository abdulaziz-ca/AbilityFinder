#!/usr/bin/env node
/**
 * The single definition of how a monitorable link is derived from the data files.
 *
 * WHY THIS EXISTS: scripts/gen-benefits-context.js builds src/links.js, and
 * test/data-procedure.test.js used to keep its own hand-maintained copy of the same
 * logic so the guard could compare expected against generated as ordered
 * (url, label, kind) tuples. Two copies of one rule, kept in step by hand — and in #193
 * they fell out of step: the province fallback maps were added to the generator and not
 * to the mirror, which would have blocked the next data deploy for a reason unrelated to
 * the change being made. Both sides now import this.
 *
 * WHAT WAS TRADED AWAY, recorded so nobody has to re-derive it: the second copy was an
 * independent restatement, so a wrong edit to the generator did not automatically become
 * the expectation too. That independence was already largely notional — both sides
 * carried "keep these in step" comments, so the documented procedure was to copy changes
 * across, which defeats it. What the guard actually detects is a *stale generated
 * artifact*: committed file versus fresh derivation. That survives the collapse intact.
 * What does not survive is a hand-written second opinion on the labels and ordering, so
 * test/link-sources.test.js tests this module's own semantics directly rather than by
 * deriving them from the same source it is checking.
 */
const CLEAN = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

/**
 * Build the ordered link catalogue from already-loaded data sources.
 *
 * ORDER AND LABELS ARE CONTRACTUAL. The guard compares ordered tuples, so a reordering
 * fails as loudly as an omission — which is the point: src/links.js is a committed
 * artifact and any drift from its sources must surface.
 *
 * The monitor must NEVER evaluate an answer-dependent link function. A function URL is
 * counted as skipped unless it exposes a safe `staticUrl`, because building a URL would
 * mean inventing a user's answers.
 */
function buildLinkCatalogue({ benefits, helpOrgs, grants, orgs, studentAid, twoEleven, employment, fedStudentAid, national211 }) {
  const links = [];
  const seen = new Set();
  let skippedDynamic = 0;

  const addLink = (url, label, kind) => {
    const staticUrl = typeof url === "function" ? url.staticUrl : url;
    if (typeof url === "function" && (typeof staticUrl !== "string" || !staticUrl.startsWith("http"))) {
      skippedDynamic++;
      return;
    }
    if (typeof staticUrl !== "string" || !staticUrl.startsWith("http")) return;
    if (seen.has(staticUrl)) return;
    seen.add(staticUrl);
    links.push({ url: staticUrl, label: CLEAN(label), kind });
  };

  for (const benefit of benefits || []) {
    addLink(benefit.applyUrl, `${CLEAN(benefit.name)} — apply`, "apply");
    addLink(benefit.source, `${CLEAN(benefit.name)} — official source`, "source");
  }

  // Help orgs are the "talk to a human" escape hatch; a dead one is just as bad.
  // HELP_ORGS is an array in some shapes and an object-of-arrays in others, so the
  // normalisation lives here rather than at each call site — both callers must flatten it
  // the same way or their catalogues differ by the whole help section.
  const flatHelp = Array.isArray(helpOrgs) ? helpOrgs : Object.values(helpOrgs || {}).flat();
  for (const org of flatHelp) {
    if (org && org.url) addLink(org.url, `Help — ${CLEAN(org.name || org.url)}`, "help");
  }
  for (const grant of grants || []) {
    if (grant && grant.url) addLink(grant.url, `grant:${CLEAN(grant.id)} — ${CLEAN(grant.name || grant.url)}`, "grant");
  }
  for (const org of orgs || []) {
    if (org && org.url) addLink(org.url, `org:${CLEAN(org.id)} — ${CLEAN(org.name || org.url)}`, "org");
  }

  // Province fallback maps. These are reached only through answer-dependent link
  // functions, so addLink() never sees them from a record and they were unmonitored
  // until #193. Registered per value — a province added later is covered automatically.
  for (const [mapName, map] of [
    ["student aid", studentAid],
    ["2-1-1", twoEleven],
    ["employment supports", employment],
  ]) {
    for (const [province, url] of Object.entries(map || {})) {
      addLink(url, `Province fallback — ${mapName} (${CLEAN(province)})`, "help");
    }
  }
  addLink(fedStudentAid, "Province fallback — student aid (national default)", "help");
  addLink(national211, "Province fallback — 2-1-1 (national default)", "help");

  return { links, skippedDynamic };
}

/** Benefits filtered exactly as the generator filters them when BC is disabled. */
function benefitsInScope(benefits, bcCities, bcEnabled) {
  if (bcEnabled) return benefits;
  return (benefits || []).filter(
    (benefit) =>
      benefit.level !== "British Columbia" &&
      benefit.level !== "Metro Vancouver" &&
      !(bcCities || []).includes(benefit.level)
  );
}

module.exports = { buildLinkCatalogue, benefitsInScope, CLEAN };
