# Deploying AbilityFinder

AbilityFinder is a **100% static site** (HTML/CSS/vanilla JS, no build step, no
backend). Hosting is free and simple. This guide targets **Cloudflare Pages**.

---

## 0. One find-and-replace before you deploy (the domain)

Several files use the placeholder domain `https://abilityfinder.ca`. Until you buy
that domain, your live URL will be `https://<project>.pages.dev`. **Update the
placeholder to your real URL** (the pages.dev one first, then your custom domain
later) in:

- `index.html` — `canonical`, `og:url`, `og:image`, `twitter:image`
- `robots.txt` — the `Sitemap:` line
- `sitemap.xml` — the `<loc>`

> The Open Graph share image (`og-image.jpg`) uses an **absolute** URL, so it will
> only show in link previews once these point at a URL that actually resolves.

---

## 1. Deploy to Cloudflare Pages

You need a free Cloudflare account (I can't create it for you). Two ways:

### Option A — drag-and-drop (fastest, no Git)
1. Go to **dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets**.
2. Name the project (e.g. `abilityfinder`).
3. Drag the **entire `benefit-finder` folder** onto the upload area.
   - **Build command:** *(leave blank)*  ·  **Output directory:** `/` (the root).
4. Click **Deploy**. In ~30s you'll get `https://abilityfinder.pages.dev`.
5. To publish an update later, repeat the upload (or use Option B for auto-deploys).

### Option B — connect Git (auto-deploy on every push)
1. Push this folder to a GitHub/GitLab repo.
2. Cloudflare Pages → **Create → Pages → Connect to Git** → pick the repo.
3. **Framework preset:** None · **Build command:** *(blank)* · **Build output
   directory:** `/`.
4. Deploy. Every `git push` now redeploys automatically.

> `serve.py` is dev-only and is simply ignored by the host. The `_headers` file is
> read by Cloudflare Pages automatically (security + cache headers — no action
> needed).

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
