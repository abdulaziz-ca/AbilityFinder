import { LINKS, SKIPPED_DYNAMIC } from "./links.js";

/**
 * Broken-link monitor.
 *
 * The Workers Free plan allows 50 external subrequests per invocation, and
 * every hop in a redirect chain counts. One URL therefore cannot safely be
 * treated as one request. This monitor deliberately bounds its work instead:
 * ten links × at most four GETs (the original URL plus three redirects) = 40
 * external requests. That leaves headroom below 50 without checking fewer
 * links overall.
 *
 */

const TIMEOUT_MS = 10_000;
const CONCURRENCY = 6; // Workers Free allows 6 simultaneous outgoing connections.
const LINKS_PER_RUN = 10;
const MAX_FETCHES_PER_LINK = 4;
const EXTERNAL_SUBREQUEST_LIMIT = 50;
const REPORT_SCHEMA = 2;

/**
 * wrangler.jsonc schedules this monitor at `0 *\/3 * * *`, so one
 * deterministic batch runs every three hours. With LINKS_PER_RUN fixed at 10,
 * the current catalogue of 180 links occupies 18 batches. Eighteen batches ×
 * 3 hours means a full sweep completes about every 54 hours, or about 2.25
 * days. Reviewing /api/link-health at least weekly guarantees the latest
 * cumulative report is
 * seen at least once every seven days, but it does not review every individual
 * sweep. Anyone who needs per-sweep granularity must review about every 54
 * hours. Looking more often than a sweep mostly re-reads links whose result has
 * not changed, while looking less often can leave a genuinely dead link sitting
 * in published guidance.
 *
 * The report's own `coverage.lastFullSweepAt` is the authority for whether a
 * fresh sweep has landed. Anything counted in `coverage.linksPendingThisSweep`
 * has no result yet in the current sweep: its status is unknown, not good.
 * Most importantly, a non-200 from the Worker is not evidence that a link is
 * dead. Cloudflare bot challenges, WAFs, and origin TLS blips can all produce a
 * 403, 526, or timeout for the monitor while the page serves normally to a real
 * browser. Confirm every flagged link by hand in a real browser before touching
 * any data file, because replacing a working URL can cost a disabled person the
 * page they needed.
 */

/**
 * Link-health review disposition, 2026-08-14. Report snapshot checkedAt
 * 2026-08-15T00:00:56Z: 175 links, 169 ok, 4 broken, 2 unreachable,
 * 0 inconclusive, 8 redirected, 5 skipped-dynamic, and 35 pending in the
 * current sweep. The 169 ok figure is cumulative and includes results retained
 * from earlier sweeps; those 35 pending links had no result in the current
 * sweep and were unknown, not confirmed healthy. Fourteen items were
 * dispositioned; thirteen needed no data change.
 *
 * FALSE ALARMS — verified live by hand, no data change:
 * - vancouver.ca leisure-access-card.aspx: the monitor received 403. A real
 *   browser reached Cloudflare's “Performing security verification” bot
 *   challenge, proving the site is live and gating bots. The challenge was not
 *   completed; its presence is the evidence.
 * - kelowna.ca financial-assistance-recreation: the monitor received 403. It
 *   loads normally in a real browser as “Financial assistance for recreation |
 *   City of Kelowna”; its published LICO thresholds and “Canadian citizens or
 *   permanent residents currently residing in Kelowna” criterion still match
 *   our record.
 * - neilsquire.ca/individual-programs-services/: the monitor received 526 from
 *   Cloudflare origin TLS. It returns 200 now, so this was a transient
 *   origin-side blip.
 * - airdrie.ca index.cfm?serviceID=2414 and ?serviceID=2157: the monitor timed
 *   out at 10000ms, but both return 200 to a browser user agent. This is the
 *   case described by the monitor payload itself: some sites answer browsers
 *   but refuse the Worker.
 *
 * REDIRECTS — all eight resolve 200 in one hop and were deliberately not
 * rewritten. Seven are host or trailing-slash canonicalisations:
 * www.fnha.ca/benefits → fnha.ca/benefits/; cpalberta.com → www.cpalberta.com;
 * www.hopeair.ca → hopeair.ca/; alsab.ca → www.alsab.ca/;
 * kidscancercare.ab.ca → www.kidscancercare.ab.ca/; www.sci-ab.ca → sci-ab.ca/;
 * and www.betweenfriends.ab.ca → betweenfriends.ab.ca/. The eighth,
 * www.translink.ca/handydart, is an intentional shortlink that adds TransLink's
 * own utm_source, utm_medium, and utm_campaign parameters. It remains
 * unrewritten because those parameters are supplied by TransLink itself, not by
 * us. Chasing an organisation's current canonical form creates churn and can
 * break when it flips back; rewriting any of these would be an unnecessary data
 * change. This is a decision, not an oversight: the next reviewer should not
 * “fix” them.
 *
 * GENUINE BREAK — one. easterseals.ab.ca/equipment-programs/ returns a hard 404
 * titled “Page Not Found - Easter Seals Alberta” to a real browser user agent,
 * not only to the Worker. Easter Seals Alberta's own homepage navigation still
 * advertises “Equipment Programs” and still links to that dead URL, while its
 * own site search for “equipment” returns no program page. The break is on
 * their side; the directory URL was therefore repointed to the confirmed-live
 * site root, with the unresolved equipment-funding claim left untouched.
 */

/**
 * Link-health review disposition, 2026-09-04. Report snapshot checkedAt
 * 2026-09-05T00:00:47Z: 179 links, 172 ok, 5 broken, 2 unreachable,
 * 0 inconclusive, 9 redirected, 5 skipped-dynamic. All seven flagged links were
 * confirmed by hand in a real browser. NONE needed a data change; every one of
 * them serves normally to a browser. No URL was touched.
 *
 * NEW FALSE ALARMS — not covered by the 2026-08-14 disposition:
 * - leduc.ca .../housing-financial-support: monitor received 403. Loads normally
 *   in a real browser as "Housing and Financial Navigation | City of Leduc".
 * - bccerebralpalsy.com/programs/equipment-funding-program/: monitor could not
 *   reach it. Loads normally as "Equipment Subsidy - CPABC Financial Aids", with
 *   the CPABC minors-with-cerebral-palsy assistive-device criteria still matching
 *   our directory entry.
 *
 * TRANSIENT OUTAGE, NOT A MOVED PAGE — the important one:
 * - edmonton.ca/ets/fare-assistance: monitor received 502. A real browser also
 *   received 502 Bad Gateway, but so did https://www.edmonton.ca/ itself, so the
 *   whole host was down during this review rather than the page having moved.
 *   The URL is therefore correct and was deliberately left alone. Re-check it on
 *   the next sweep; if edmonton.ca is up and only this path 502s, that is a
 *   genuine break worth chasing. Checking the site root is the cheap way to tell
 *   a dead page from a dead host, and is worth doing before any 5xx is treated
 *   as a broken link.
 *
 * STILL FINE — the four already dispositioned on 2026-08-14 were re-confirmed
 * live and unchanged: vancouver.ca leisure-access-card.aspx (403 to the monitor),
 * kelowna.ca financial-assistance-recreation (403), neilsquire.ca
 * individual-programs-services (526), airdrie.ca index.cfm?serviceID=2157
 * (monitor timeout). The nine redirects remain deliberately unrewritten for the
 * reasons given in the 2026-08-14 block.
 *
 * Bottom line for the next reviewer: seven flagged, seven fine. A non-200 from
 * the Worker is weak evidence. Confirm in a real browser before editing data —
 * replacing a working URL costs a disabled person the page they needed.
 */

export const REPORT_KEY = "latest";

const SOFT_DEAD_URL = /\/(not-?found|404|page-?not-?found|error)(\/|\.|$)/;
// Only unambiguous not-found phrasings, matched against <title>/<h1> ONLY.
const SOFT_DEAD_TEXT = /(page not found|page (?:can.?t|cannot|could not) be found|page you (?:requested|are looking for)|page (?:is )?no longer available|page not available|error 404|404 error|404 - )/i;

function titleAndH1(body) {
  const title = (String(body).match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ""])[1];
  const h1raw = (String(body).match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ""])[1];
  const h1 = h1raw.replace(/<[^>]+>/g, " ");
  return `${title} ${h1}`.replace(/\s+/g, " ").trim();
}

// Exported for unit testing. finalUrl = the URL actually landed on; body =
// the response HTML (may be empty when not read).
export function detectSoftDead(finalUrl, body) {
  if (SOFT_DEAD_URL.test(String(finalUrl).toLowerCase())) return true;
  if (body && SOFT_DEAD_TEXT.test(titleAndH1(body))) return true;
  return false;
}

const isRedirect = (status) => status >= 300 && status < 400;
const catalogSignature = () => LINKS.map((link) => link.url).join("\n");

/**
 * A real click uses GET, not HEAD. Using GET therefore removes the old
 * HEAD→GET retry (which could silently double the request count) and is a more
 * faithful health check. For 2xx responses, a bounded body is read to detect
 * soft 404s from the <title> and first <h1> only.
 *
 * Redirects are followed manually so their request cost is known. A chain that
 * exceeds the cap is *inconclusive*, never called broken: it needs a human
 * look, but the monitor must not create a false dead-link alarm.
 */
async function checkOne(link) {
  const started = Date.now();
  let currentUrl = link.url;
  const redirects = [];

  try {
    for (let attempt = 0; attempt < MAX_FETCHES_PER_LINK; attempt += 1) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      let res;
      try {
        res = await fetch(currentUrl, {
          method: "GET",
          redirect: "manual",
          signal: ctrl.signal,
          headers: {
            // Identify honestly, while avoiding an avoidable bot-block false
            // positive from a government site expecting an ordinary browser.
            "User-Agent":
              "Mozilla/5.0 (compatible; AbilityFinderLinkCheck/1.0; +https://abilityfinder.ca)",
            Accept: "text/html,application/xhtml+xml,*/*",
          },
        });
      } finally {
        clearTimeout(timer);
      }

      if (isRedirect(res.status)) {
        const location = res.headers.get("location");
        if (!location) {
          return {
            ...link,
            status: res.status,
            ok: false,
            reachable: true,
            error: "Redirect response had no Location header.",
            ms: Date.now() - started,
          };
        }

        let nextUrl;
        try {
          nextUrl = new URL(location, currentUrl).href;
        } catch {
          return {
            ...link,
            status: res.status,
            ok: false,
            reachable: true,
            error: "Redirect response had an invalid Location header.",
            ms: Date.now() - started,
          };
        }
        redirects.push(nextUrl);
        currentUrl = nextUrl;
        continue;
      }

      // SOFT 404: some sites answer 200 while landing on their own "not found"
      // page. Status code alone would incorrectly call that healthy.
      let body = "";
      if (res.ok) {
        try { body = (await res.text()).slice(0, 200000); } catch { body = ""; }
      }
      const softDead = detectSoftDead(currentUrl, body);

      return {
        ...link,
        status: res.status,
        ok: res.ok && !softDead,
        softDead,
        reachable: true,
        redirectedTo: redirects.length ? currentUrl : null,
        redirectCount: redirects.length,
        ms: Date.now() - started,
      };
    }

    return {
      ...link,
      status: 0,
      ok: false,
      reachable: true,
      inconclusive: true,
      error: `Redirect chain exceeded ${MAX_FETCHES_PER_LINK - 1} hops; check in a browser.`,
      redirectCount: redirects.length,
      ms: Date.now() - started,
    };
  } catch (err) {
    const msg = String(err?.message ?? err);
    // No HTTP answer is not proof that a user sees a dead link. Edmonton's
    // site, for example, answers browsers but has refused Workers fetches.
    return {
      ...link,
      status: 0,
      ok: false,
      reachable: false,
      error: /abort/i.test(msg) ? `timeout after ${TIMEOUT_MS}ms` : msg.slice(0, 120),
      ms: Date.now() - started,
    };
  }
}

/** Small pool — respects the six-connection cap without a dependency. */
async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const index = i++;
      out[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return out;
}

function reportItem(result, checkedAt) {
  return {
    url: result.url,
    label: result.label,
    kind: result.kind,
    status: result.status,
    ok: result.ok,
    reachable: result.reachable,
    ...(result.softDead ? { softDead: true } : {}),
    ...(result.inconclusive ? { inconclusive: true } : {}),
    ...(result.redirectedTo ? { redirectedTo: result.redirectedTo } : {}),
    ...(result.error ? { error: result.error } : {}),
    checkedAt,
  };
}

function issueItem(result) {
  const { url, label, kind, status, softDead, error, checkedAt } = result;
  return {
    url,
    label,
    kind,
    ...(status ? { status } : {}),
    ...(softDead ? { softDead: true, note: "Answered successfully but landed on a 'not found' page." } : {}),
    ...(error ? { error } : {}),
    checkedAt,
  };
}

function validPrevious(previous, signature) {
  return previous?.schemaVersion === REPORT_SCHEMA && previous.catalogSignature === signature;
}

/**
 * Checks one bounded batch and merges it into the last-known result for every
 * current catalog URL. KV costs are internal subrequests (limit 1,000 on Free)
 * and are intentionally just one read + one write per cron run.
 */
export async function runLinkCheck(env, nowIso) {
  const signature = catalogSignature();
  let previous = null;
  if (env.LINK_HEALTH) {
    try {
      const raw = await env.LINK_HEALTH.get(REPORT_KEY);
      previous = raw ? JSON.parse(raw) : null;
    } catch {
      // A malformed/legacy report must not stop link checks. It is replaced by
      // the new schema below, beginning a fresh sweep.
      previous = null;
    }
  }

  const reusable = validPrevious(previous, signature) ? previous : null;
  const batchCount = Math.max(1, Math.ceil(LINKS.length / LINKS_PER_RUN));
  const requestedBatch = Number(reusable?.coverage?.nextBatch);
  const batchIndex = Number.isInteger(requestedBatch) && requestedBatch >= 0 && requestedBatch < batchCount
    ? requestedBatch
    : 0;
  const start = batchIndex * LINKS_PER_RUN;
  const batch = LINKS.slice(start, start + LINKS_PER_RUN);
  const results = await pool(batch, CONCURRENCY, checkOne);

  const activeUrls = new Set(LINKS.map((link) => link.url));
  const priorResults = reusable?.links && typeof reusable.links === "object" ? reusable.links : {};
  const links = Object.fromEntries(
    Object.entries(priorResults).filter(([url]) => activeUrls.has(url))
  );
  for (const result of results) links[result.url] = reportItem(result, nowIso);

  const priorBatches = Array.isArray(reusable?.coverage?.completedBatches)
    ? reusable.coverage.completedBatches.filter((index) => Number.isInteger(index) && index >= 0 && index < batchCount)
    : [];
  const completed = new Set(priorBatches);
  completed.add(batchIndex);
  const sweepFinished = completed.size === batchCount;
  const completedBatches = sweepFinished ? [] : [...completed].sort((a, b) => a - b);
  const coveredThisSweep = sweepFinished
    ? LINKS.length
    : completedBatches.reduce(
        (count, index) => count + LINKS.slice(index * LINKS_PER_RUN, (index + 1) * LINKS_PER_RUN).length,
        0
      );

  const allResults = Object.values(links);
  const broken = allResults.filter((result) => result.reachable && !result.ok && !result.inconclusive);
  const unreachable = allResults.filter((result) => !result.reachable);
  const inconclusive = allResults.filter((result) => result.inconclusive);
  const redirected = allResults.filter((result) => result.ok && result.redirectedTo);
  const runBroken = results.filter((result) => result.reachable && !result.ok && !result.inconclusive);
  const runUnreachable = results.filter((result) => !result.reachable);
  const runInconclusive = results.filter((result) => result.inconclusive);

  const report = {
    schemaVersion: REPORT_SCHEMA,
    catalogSignature: signature,
    checkedAt: nowIso,
    total: LINKS.length,
    okCount: allResults.filter((result) => result.ok).length,
    brokenCount: broken.length,
    unreachableCount: unreachable.length,
    inconclusiveCount: inconclusive.length,
    skippedDynamic: SKIPPED_DYNAMIC,
    coverage: {
      status: sweepFinished ? "complete" : "collecting",
      linksCheckedThisRun: results.length,
      linksWithARecordedResult: allResults.length,
      linksPendingThisSweep: LINKS.length - coveredThisSweep,
      batch: batchIndex + 1,
      batches: batchCount,
      nextBatch: (batchIndex + 1) % batchCount,
      completedBatches,
      lastFullSweepAt: sweepFinished ? nowIso : reusable?.coverage?.lastFullSweepAt ?? null,
      externalSubrequestBudget: {
        maximum: LINKS_PER_RUN * MAX_FETCHES_PER_LINK,
        limit: EXTERNAL_SUBREQUEST_LIMIT,
      },
    },
    run: {
      broken: runBroken.map((result) => issueItem(reportItem(result, nowIso))),
      unreachable: runUnreachable.map((result) => issueItem(reportItem(result, nowIso))),
      inconclusive: runInconclusive.map((result) => issueItem(reportItem(result, nowIso))),
    },
    broken: broken.map(issueItem),
    unreachable: unreachable.map((result) => ({
      ...issueItem(result),
      note: "No HTTP response from the Worker. Check by hand before changing data.js — some sites answer browsers but refuse Workers.",
    })),
    inconclusive: inconclusive.map((result) => ({
      ...issueItem(result),
      note: "The monitor could not finish a redirect chain within its safe request budget. Check in a browser.",
    })),
    redirected: redirected.map(({ url, label, redirectedTo, checkedAt }) => ({
      url,
      label,
      redirectedTo,
      checkedAt,
    })),
    links,
  };

  if (env.LINK_HEALTH) await env.LINK_HEALTH.put(REPORT_KEY, JSON.stringify(report));
  return report;
}
