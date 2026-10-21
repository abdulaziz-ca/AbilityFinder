# Backup of the site before the 2026 redesign

The owner asked on 2026-10-21 for the current site to be kept, so it can be referenced or restored.

- **Git tag:** `pre-redesign-v238`, and **branch:** `backup/pre-redesign-v238`. Both are on GitHub
  (`abdulaziz-ca/AbilityFinder`) and point at commit `bda008cf`. That is exactly what was live as `?v=238`
  on 2026-10-21, with all 463 programs, analytics, dates to know and browse by need.
- **Screenshots** of the old design are in `before-v238/`: home, question, results, guide and browse at
  desktop and phone width, plus a static guide page.

## Look at the old site locally
```
git worktree add ../old-site pre-redesign-v238
cd ../old-site && npx wrangler dev
```
Or, with no Worker features: `node e2e/static-server.js public 8800`, then open http://127.0.0.1:8800.

## Put the old design back
1. **Fastest, design only:** the redesign ships behind the `DESIGN_V2` switch in `public/app.js` (and the
   matching class on `<html>`). Set it to `false`, bump `?v=`, and push. Data and features stay current.
2. **Full revert of the code to the backup:** `git revert` the redesign commits, or check out the tag's
   `public/` and push. Data added since the backup would be lost that way, so prefer option 1.
3. **Emergency:** `npx wrangler rollback` returns Cloudflare to the previous deployment in seconds. See
   DEPLOY.md.
