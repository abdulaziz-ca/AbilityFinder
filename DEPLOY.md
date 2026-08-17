# AbilityFinder — deployment and operations

AbilityFinder is deployed as a **Cloudflare Worker with static assets**, not Pages.
The live site is https://abilityfinder.ca.

## What ships

```text
public/        static assets; the only deployed directory
src/index.js   Worker entry for APIs and asset fallthrough
wrangler.jsonc bindings, cron, and asset configuration
```

Root documentation, tests, scripts, and `serve.py` are not public assets. Never move
docs into `public/`; they were once exposed on the live domain.

## Local development

```sh
npm install
npm run dev
```

`wrangler dev` uses the real remote AI/email services declared with remote bindings.
Assistant testing consumes the free daily Workers AI allocation even though it
cannot create overage charges on Workers Free.

For static-only work, `python3 serve.py` serves a no-cache site on port 8731, but it
does not validate Worker routes, bindings, or production CSP behavior.

## Deploy

Preferred release flow:

```sh
npm run gen:context          # after BENEFITS, HELP_ORGS, or PRACTITIONER_FORMS changes
npm test
npm run test:e2e
git diff --check
npx wrangler deploy --dry-run
git commit -m "..."
git push origin main        # CI deploys main, but only if the suite is green
```

An explicit deployment is also supported:

```sh
npx wrangler deploy
```

After changing a browser-loaded CSS, JavaScript, font, or icon asset, bump the
shared `?v=N` query version in `public/index.html`. Keep matching font URLs in
`public/styles.css` aligned.

## Bindings and cost boundary

`wrangler.jsonc` is authoritative:

| Binding | Purpose | User data |
|---|---|---|
| `ASSETS` | Serves `public/` | None |
| `AI` | `/api/ask` Workers AI | Opt-in question/conversation |
| `ASK_LIMIT` | Per-IP assistant/feedback abuse limit | Ephemeral IP-based key |
| `LINK_HEALTH` | Link-monitor aggregate | Official links only |
| `FEEDBACK_MAIL` | Pinned feedback destination | Opt-in form content |

The Worker also has a three-hour cron for the rotating link monitor.

### Zero-spend guarantee

Production must remain on **Workers Free**. Workers AI has a daily free allocation
and no overage price on that plan: once exhausted, requests fail until reset while
the static finder continues working.

Workers Paid introduces usage billing above the allocation. Before any plan change:

1. Re-evaluate or disable `/api/ask`.
2. Confirm Worker, AI, KV, email, and cron pricing.
3. Add explicit usage caps/alerts.
4. Update `AGENTS.md`, this file, and user-facing availability copy.

No third-party model API key is required or stored.

## Feedback

`POST /api/feedback` sends through `FEEDBACK_MAIL`, pinned to the verified
destination in `wrangler.jsonc`; it cannot choose arbitrary recipients. The UI also
offers a `mailto:` alternative. If the destination or domain routing changes, test
both paths and update the privacy page if the payload changes.

Configuration and a successful deploy prove that the binding exists, not that a
message reached the inbox. After email or routing changes, send a non-sensitive test
submission and confirm receipt before describing feedback delivery as operational.

## Link monitor

- Cron runs every three hours.
- `src/link-check.js` checks a bounded rotating batch and merges last-known results
  into KV.
- `GET /api/link-health` exposes the aggregate report.
- Treat `broken`, `unreachable`, `inconclusive`, and `redirected` differently.
  A Worker fetch failure is not proof that a browser link is dead.
- Soft 404s can return 200; inspect the landed URL and content before replacement.

## Security and privacy checks

`public/_headers` supplies CSP and other security headers. After deployment:

```sh
curl -I https://abilityfinder.ca
```

Confirm at least CSP, `x-frame-options: DENY`, `x-content-type-options: nosniff`,
referrer policy, and permissions policy.

Cloudflare zone features may inject Browser Insights or challenge scripts at the
edge. The current strict `script-src 'self'` CSP blocks those scripts. **Do not allow
external analytics in CSP.** Disable Browser Insights/automatic injection in the
Cloudflare dashboard if clean-console verification requires it.

## Post-deploy verification

Run this against the custom domain after every deploy, and record the output. The point
is to tell a real release problem apart from propagation — most confusing results are the
latter, and three of the checks below exist because a plausible-looking failure was
reported that turned out to be the tooling, not the release.

**Before you start:** do not push a second change while this one still needs verifying.
CI uses `concurrency: cancel-in-progress`, so a newer push cancels the in-flight run, and
between that push and the next green deploy the earlier commit's new pages 404 in
production. Verify, then push again.

1. **Confirm the release actually happened.** `origin/main` matches the intended commit,
   and the CI run for that commit completed green. **A `deploy` job reporting success does
   not prove it deployed** — it exits 0 either way, warning and skipping when the token is
   absent, so confirm against the live site rather than the job's own conclusion.
   Do not look for a Workers Builds result: its git integration was disconnected on
   2026-07-28, so CI is the deploy path. That is Cloudflare dashboard state, not
   something this repository can prove — if it is ever reconnected, pushes deploy
   regardless of tests and this gate becomes decorative.
2. **If the change touched a browser-loaded asset, confirm the new cache version** on
   `/` and on a guide. A docs-only or Worker-only deploy correctly moves nothing, so skip
   this rather than reporting a false failure:
   ```sh
   curl -s  https://abilityfinder.ca/            | grep -o 'styles\.css?v=[0-9]*'
   curl -sL https://abilityfinder.ca/guides/dtc  | grep -o 'styles\.css?v=[0-9]*'
   ```
   Both must equal the `?v=N` you committed. One guide is representative because
   `gen:guides` writes all of them in a single pass — but the exhaustive check is local,
   before pushing: `grep -rL '?v=N' public/guides` (files *missing* the new version) must
   be empty. A guide left on the previous `?v` means `npm run gen:guides` was not run or
   not committed.
3. **Inspect the changed content itself, not just the version string.** A correct `?v`
   only proves `index.html` shipped. Grep the live asset for the specific text or value the
   change introduced, and for anything it was supposed to remove.
   **Guide URLs 307-redirect** from `/guides/<id>.html` to `/guides/<id>`, so `curl`
   without `-L` returns 0 bytes and looks exactly like a failed deploy. Always use
   `curl -sL` on a guide.
4. **Complete a fresh wizard start, a reload, and an IndexedDB restore** on the custom
   domain. Restore must finish before the first meaningful render; the persisted-blank-page
   incident is why this is not optional.
5. **Test `/api/link-health` and any changed Worker endpoint with `curl` or `fetch`.**
   Do **not** judge them by typing the URL into a browser: `/api/*` returns 200 JSON to
   `fetch` and **404 HTML to a top-level navigation**, because Cloudflare's static-asset
   routing answers navigations before the Worker runs. That is REL-06, it is understood,
   and it is WON'T FIX on zero-spend grounds — a 404 from a browser address bar is **not**
   a regression and must not be reported as one.
6. **Check browser page errors and application console errors**, and confirm the
   security headers still ship: `curl -I https://abilityfinder.ca` must still show CSP,
   `x-frame-options: DENY`, `x-content-type-options: nosniff`, referrer and permissions
   policy. Cloudflare **may** inject a Browser Insights beacon that the strict CSP blocks;
   if present, that console noise is expected. Distinguish it from application failures,
   do not hide real errors, and never weaken the CSP to silence it — disable injection in
   the Cloudflare dashboard instead.
7. **Check the bindings the change actually touched.** `/api/link-health` returning 200
   proves only that KV can be read, not that the three-hour cron has run recently — after
   a cron or monitor change, inspect `coverage.lastFullSweepAt` in the payload for
   freshness. After an AI change, smoke-test `/api/ask` once, without exhausting the free
   allocation. After an email or routing change, send one non-sensitive `/api/feedback`
   submission and confirm receipt, per the Feedback section above; a successful deploy
   proves the binding exists, not that mail arrived.
8. **Re-run the privacy contract checks whenever a data flow changed** — that no wizard or
   profile data leaves the device, that only `/api/ask` and `/api/feedback` carry
   user-entered content, and that nothing sensitive entered a URL.
9. **Test keyboard navigation, dark/light theme, print, and a mobile viewport** when the
   change touches them.

**Reading the results.** If two checks disagree — new URLs live but the old version
string, or 200s with missing content — that **may** be propagation mid-flight. Do not
classify it before retrying: wait a minute and re-run. A mismatch that **persists** is a
real release failure, not propagation, and a stale guide marker is usually a
generated-file mistake rather than the edge. Report neither the zeros as failure nor the
retry as proof; decide only after the repeat.

## Domain and recovery

The canonical domain, social metadata, robots file, and sitemap already use
`abilityfinder.ca`. If the domain changes, update all of them together.

A direct `npx wrangler deploy` can restore the last known-good working tree even if
CI is unavailable or blocked. It bypasses the test gate, so use it only to recover. Cloudflare deployment/version history provides
rollback options; verify the custom domain after any rollback.

## Province launch checklist

When `BC_ENABLED` is flipped in `public/app.js`, update the static scope wording that JavaScript cannot reach:

- `public/index.html`: page `<title>`, meta description, Open Graph description, and Twitter description.
- `public/embed.html`: page `<title>` and the embed headline.
- `scripts/gen-guide-pages.js`: guide header region label, guide-index meta description, and guide-index eyebrow.

Regenerate the generated grounding context and static guide pages after flipping `BC_ENABLED` and updating the template:

```sh
npm run gen:context
npm run gen:guides
```
