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
git push origin main        # Workers Builds deploys main
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

1. Confirm the deployed HTML references the new cache version.
2. Compare a changed asset with the local file or inspect its deployed content.
3. Complete a fresh wizard start, reload, and IndexedDB restore on the custom domain.
4. Test `/api/link-health` and any changed Worker endpoint.
5. Check browser page errors and application console errors. Distinguish CSP-blocked
   Cloudflare injections from application failures; do not hide real errors.
6. Verify `origin/main` matches the intended commit and Workers Builds succeeded.
7. Test keyboard navigation, dark/light theme, print, and a mobile viewport when the
   change touches them.

## Domain and recovery

The canonical domain, social metadata, robots file, and sitemap already use
`abilityfinder.ca`. If the domain changes, update all of them together.

A direct `npx wrangler deploy` can restore the last known-good working tree even if
Workers Builds is unavailable. Cloudflare deployment/version history provides
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
