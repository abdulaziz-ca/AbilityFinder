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
 * Cron invokes this every three hours. Each run checks the next deterministic
 * batch and merges it into a KV-backed report, so the published report remains
 * useful while a larger catalog is being swept. At today's 43 links every URL
 * is checked within 15 hours; even 500 links complete within 6¼ days.
 */

const TIMEOUT_MS = 10_000;
const CONCURRENCY = 6; // Workers Free allows 6 simultaneous outgoing connections.
const LINKS_PER_RUN = 10;
const MAX_FETCHES_PER_LINK = 4;
const EXTERNAL_SUBREQUEST_LIMIT = 50;
const REPORT_SCHEMA = 2;

export const REPORT_KEY = "latest";

const isRedirect = (status) => status >= 300 && status < 400;
const catalogSignature = () => LINKS.map((link) => link.url).join("\n");

/**
 * A real click uses GET, not HEAD. Using GET therefore removes the old
 * HEAD→GET retry (which could silently double the request count) and is a more
 * faithful health check. We do not read the response body.
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
      const landed = currentUrl.toLowerCase();
      const softDead = /\/(not-?found|404|page-?not-?found|error)(\/|\.|$)/.test(landed);

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
