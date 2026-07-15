import { LINKS, SKIPPED_DYNAMIC } from "./links.js";

/**
 * Phase 5A — broken-link monitor.
 *
 * Why this exists: 29 official government links carry the entire "how do I
 * actually get it?" promise. They were verified once (July 2026) and they rot
 * silently. A dead Apply link is a dead end for the person who needed it most,
 * and today we'd only find out if a user told us — and the feedback address was
 * a placeholder, so they couldn't.
 *
 * Free-plan constraints this is built around:
 *  - 50 subrequests per invocation. 29 links fits, with room to spare. If the
 *    catalog grows past ~45, chunk across runs (gen:context warns at 50).
 *  - Cron Triggers are free (5/account).
 *  - No user data is involved, so there is nothing here to leak.
 */

const TIMEOUT_MS = 10_000;
const CONCURRENCY = 6; // Free plan allows 6 simultaneous outgoing connections.
export const REPORT_KEY = "latest";

/**
 * Government sites are picky: many reject HEAD, and several block obvious bots.
 * A "failure" here must mean "a person clicking this would hit a dead end", not
 * "our request looked weird" — a false alarm every week trains you to ignore it.
 */
async function checkOne(link) {
  const started = Date.now();
  const attempt = async (method) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      return await fetch(link.url, {
        method,
        redirect: "follow",
        signal: ctrl.signal,
        headers: {
          // Identify honestly, and look enough like a browser that we aren't
          // bot-blocked into a false positive.
          "User-Agent":
            "Mozilla/5.0 (compatible; AbilityFinderLinkCheck/1.0; +https://abilityfinder.ca)",
          Accept: "text/html,application/xhtml+xml,*/*",
        },
      });
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    let res;
    try {
      res = await attempt("HEAD");
    } catch (headErr) {
      // Some hosts break on HEAD entirely — give GET a chance before judging.
      res = await attempt("GET");
    }
    // Lots of gov endpoints answer HEAD with 403/405 while GET is fine.
    if (res.status === 403 || res.status === 405 || res.status === 501) {
      res = await attempt("GET");
    }
    return {
      ...link,
      status: res.status,
      ok: res.ok,
      reachable: true,
      redirectedTo: res.url && res.url !== link.url ? res.url : null,
      ms: Date.now() - started,
    };
  } catch (err) {
    const msg = String(err?.message ?? err);
    // We never got an HTTP answer. That does NOT mean the link is dead — verified
    // case: www.edmonton.ca returns 200 in a browser and to curl, but refuses
    // Cloudflare Workers fetch every single time. Reporting that as "broken"
    // would put a permanent false alarm in the weekly report, and a report that
    // cries wolf is a report nobody reads. So it is reported separately as
    // "could not check", which is what actually happened.
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

/** Small pool — respects the 6-connection cap without a dependency. */
async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  });
  await Promise.all(workers);
  return out;
}

export async function runLinkCheck(env, nowIso) {
  const results = await pool(LINKS, CONCURRENCY, checkOne);

  // Three distinct states, because conflating them is what makes a monitor
  // untrustworthy:
  //   broken      — the server answered, and the answer was bad (404/500/...).
  //   unreachable — we never got an answer. Might be fine in a browser. Verify by hand.
  //   redirected  — fine today, but this is how a link quietly becomes wrong.
  const broken = results.filter((r) => r.reachable && !r.ok);
  const unreachable = results.filter((r) => !r.reachable);
  const redirected = results.filter((r) => r.ok && r.redirectedTo);

  const report = {
    checkedAt: nowIso,
    total: results.length,
    okCount: results.filter((r) => r.ok).length,
    brokenCount: broken.length,
    unreachableCount: unreachable.length,
    skippedDynamic: SKIPPED_DYNAMIC,
    broken: broken.map(({ url, label, kind, status }) => ({ url, label, kind, status })),
    unreachable: unreachable.map(({ url, label, kind, error }) => ({
      url,
      label,
      kind,
      error,
      note: "No HTTP response from the Worker. Check by hand before changing data.js — some sites (e.g. edmonton.ca) answer browsers but refuse Workers.",
    })),
    redirected: redirected.map(({ url, label, redirectedTo }) => ({
      url,
      label,
      redirectedTo,
    })),
  };

  if (env.LINK_HEALTH) {
    await env.LINK_HEALTH.put(REPORT_KEY, JSON.stringify(report));
  }
  return report;
}
