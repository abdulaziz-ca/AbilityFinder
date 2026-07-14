# Deploying AbilityFinder

AbilityFinder is a static site **plus one small Worker route** (`/api/ask`, the
Phase 4 assistant). It is deployed as a **Cloudflare Worker with static assets**
— not Cloudflare Pages. It is already live at **https://abilityfinder.ca**.

## Repo layout (matters for deploys)

```
public/          <- the ONLY directory that ships. Site files live here.
src/index.js     <- the Worker: serves /api/ask, passes everything else to public/
wrangler.jsonc   <- deploy config (name, assets dir, rate limit binding)
*.md, serve.py   <- docs + dev server. At the root, so they are NEVER served.
```

> ⚠️ The docs used to sit next to `index.html` and were **publicly readable** on
> the live site (`abilityfinder.ca/HANDOFF.md` returned 200). Keeping them out of
> `public/` is what fixes that — do not move them back in.

---

## 0. Domain

`https://abilityfinder.ca` is bought, live, and already used in `index.html`
(`canonical`, `og:url`, `og:image`, `twitter:image`), `robots.txt` (`Sitemap:`),
and `sitemap.xml` (`<loc>`). Nothing to do unless the domain changes.

---

## 1. Deploy

### Option A — Git push (preferred, once the repo is connected)
Every push to `main` rebuilds and redeploys via Cloudflare Workers Builds.

### Option B — from your machine
```sh
npx wrangler deploy
```
Requires `npx wrangler login` once (opens a browser).

To check what *would* ship without deploying:
```sh
npx wrangler deploy --dry-run
```

> `_headers` inside `public/` is applied automatically (security + cache headers).
> Verify after any deploy that `curl -I https://abilityfinder.ca` still shows
> `x-frame-options: DENY`.

---

## 1b. The API key (required for the assistant)

`/api/ask` needs an Anthropic key. It is a **secret**, never a `var`, and never
committed:

```sh
npx wrangler secret put ANTHROPIC_API_KEY
```

For local dev, put it in `.dev.vars` (already gitignored):
```
ANTHROPIC_API_KEY=sk-ant-...
```
Then `npx wrangler dev`. Without a key the site still works; `/api/ask` returns
503 and logs the misconfiguration.

**Cost control:** `/api/ask` is a public endpoint spending your money. It is rate
limited to 8 requests/minute per IP (`ASK_LIMIT` in `wrangler.jsonc`). Set a
spend cap in the Anthropic console too — the rate limit bounds one visitor, not
the whole internet.

## 2. Add your custom domain (when you buy it)
1. Buy the domain (e.g. `abilityfinder.ca` — a `.ca` needs a Canadian presence,
   which you have). Cloudflare Registrar is cheapest/at-cost.
2. Pages project → **Custom domains → Set up a domain** → enter it → Cloudflare
   adds the DNS + free SSL automatically.
3. Redo the **§0 find-and-replace** with the real domain and redeploy.

---

## 3. Pre-launch checklist

**Done in code already**
- [x] Fonts self-hosted (no Google Fonts) — nothing leaves the visitor's browser.
- [x] Strict Content-Security-Policy + security headers (`_headers`).
- [x] Privacy & disclaimer page (footer link) + honest privacy copy.
- [x] SEO: `<title>`, description, canonical, Open Graph + Twitter tags,
      `favicon.svg`, `apple-touch-icon.png`, `og-image.jpg`, `robots.txt`,
      `sitemap.xml`, branded `404.html`.
- [x] Official government links re-verified (see HANDOFF/QA notes).
- [x] Print / "Save as PDF" report tested.
- [x] Responsive layout checked at mobile/tablet/desktop.

**You still need to do**
- [ ] **Feedback:** `FEEDBACK_EMAIL` in `app.js` is a placeholder
      (`feedback@abilityfinder.ca`). Set a real inbox, or swap the `mailto:` in
      `wireLanding()` for a free form service (Formspree) so feedback actually
      reaches you.
- [ ] **Domain** (§0 + §2).
- [ ] **Accessibility audit** (deferred): run Lighthouse/axe before wide launch —
      the audience is disabled users, so contrast + keyboard + screen-reader
      checks matter most.
- [ ] Optional: privacy-friendly, cookieless analytics (Cloudflare Web Analytics
      or Plausible) if you want usage numbers.

---

## 4. After it's live — quick smoke test
- Open the `.pages.dev` URL on a **real phone** and desktop.
- Confirm **HTTPS** (padlock) — required, and the "Use my location" button needs it.
- Run the wizard → results → open a guide → Save/print the report.
- Toggle light/dark; reload (your answers should persist).
- Paste the URL into a Slack/iMessage/X DM to confirm the link preview image shows.
