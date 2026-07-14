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

## 1b. The assistant — and why it costs nothing

`/api/ask` runs on **Workers AI** (`env.AI`), not a paid third-party API. **There
is no API key and no secret to set.** The binding is declared in `wrangler.jsonc`
and works as soon as the Worker deploys.

### The no-bill guarantee — read this before changing plans

| Plan | Free allocation | Price above it |
|---|---|---|
| **Workers Free** | 10,000 Neurons/day | **None — requests just fail** |
| Workers Paid | 10,000 Neurons/day | $0.011 / 1,000 Neurons |

On the **Workers Free plan this endpoint cannot bill you.** There is no overage
price; once the daily allocation is spent, `env.AI.run` errors until it resets at
00:00 UTC, and the assistant shows "reached its free daily limit". The site and
all benefit guides keep working — the assistant is the only thing affected.

> ⚠️ **Upgrading to Workers Paid removes that protection.** On Paid, usage above
> 10,000 Neurons/day is billed. If you ever upgrade for some unrelated reason,
> revisit this endpoint first.

Rough budget: ~60 Neurons per question ⇒ **~150 questions/day** on the free
allocation. `ASK_LIMIT` (8/min per IP) stops one visitor burning the whole day.

Local dev note: Workers AI has no local simulator — `wrangler dev` calls your
real account and spends real Neurons (it cannot bill on the Free plan, but it
does consume the daily allowance).

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
