# D — Engineering audit (performance, accessibility, robustness, security, SEO)

**Date:** 2026-10-16 · **Tree:** `oct-resume` worktree at `c35ae0c` (assets `?v=189`) · **Mode:** read-only on product code.
**Evidence:** scripts in `research/2026-10-site-audit/tools/D-*.js` and screenshots in `screens/D-*.png`.
Lighthouse 12.8.2 ran through `npx` with Playwright's `chrome-headless-shell`. Full Chrome-for-Testing
returned `NO_FCP` headless on this machine. Local runs used `python3 -m http.server --directory public`.
That server does no compression, so local byte and paint numbers are pessimistic. Every user-facing
performance figure below was therefore re-measured against **production** (`https://abilityfinder.ca`).

axe-core is **not** in `node_modules`, and no new dependencies were installed. The accessibility pass is
Lighthouse's bundled axe subset plus a scripted semantic audit (`D-a11y.js`) and manual code reading.

---

## 0. Measurements at a glance

| What | Value | Compared with PERF-01 (2026-07-30) |
|---|---|---|
| Script transfer, production (brotli), every SPA load | **295 KB** (data.js 148, app.js 93.5, i18n 20.7, changelog 14.6, the other 7 files 18) | 212 KB → **+39 %** |
| `data.js` / `app.js` raw | 618 KB / 335 KB (6,695 / 6,055 lines) | data.js 96 → 148 KB br (+54 %); app.js 76 → 93.5 KB br (+23 %) |
| CSS + fonts + HTML | 29.9 KB + 115.8 KB (Inter 48, Fraunces 67) + 4.5 KB. **Total first visit about 445 KB** | – |
| Lighthouse mobile, **production landing** (two runs) | Perf **80/81**. FCP **3.1 s**, LCP **3.7 s** (h1.hero-title; 81 % of it is "render delay" waiting on JS), SI 4.8 s, TBT 0 ms, CLS 0. A11y 100, BP 93, SEO 100 | LCP 2,364 ms → **3.7 s**. Different throttling, but now outside the "good" band |
| Lighthouse mobile, **production guide** `/guides/aish` | Perf 99, FCP/LCP 1.6 s, 150 KB. **A11y 95 (contrast failure)** | – |
| Lighthouse desktop, local landing (uncompressed) | Perf 90, LCP 1.5 s | – |
| App ready (`history.state !== null`), 4× CPU, local | 300 ms | – |
| Results render, broad AB profile, 4× CPU | One **113 ms** long task (26 ms at 1× CPU). **4,639 elements** in `#app`. 331 KB of HTML string. 62 headings | – |
| Results re-render (same page), 4× CPU | 35–40 ms | – |
| Browse render | 60 ms long task, 3,140 elements, 135 headings | – |
| JS heap | 2.3 → 3.4 MB. **Stable after forced GC over 23 navigation cycles, so no leak** (`D-mem.js`) | – |
| Caching | Every `.js` and `.css` is served `cache-control: public, max-age=0, must-revalidate` despite `?v=N`. Only `/fonts/*` is `immutable`. No service worker | – |
| `?v` churn | **25 commits touched `public/index.html` from Oct 1 to 16**. Every bump re-downloads all 13 versioned assets (about 440 KB), including fonts that never change | – |
| CI test job | 19–26 min. "Browser and Worker tests" takes **1,107–1,543 s**, install-deps about 35 s, unit tests 6 s | – |
| E2E inventory | 873 tests = 280 × 3 app engines + 11 × 3 worker engines | – |
| Local chromium project | 280 tests in 130–153 s. **`bc-live.spec.js` = 124–132 s**, about 51 % of the per-test time and the wall-clock floor | – |

---

## P1: fix first (user-facing harm, cheap to fix)

### P1-1 Arrow keys on a wizard radio group commit an answer and leave the question (WCAG 3.2.2 On Input)
`public/app.js:3776-3786` auto-advances 200 ms after any `change` on a single-choice step. Native
radios fire `change` on **ArrowUp/Down**. **Measured** (`D-arrow.js`): focusing the first "Who are we
finding benefits for?" option and pressing ArrowDown left the question in 700 ms. It recorded
`forWho = "child"` and moved focus to the next question.

So a keyboard or screen-reader user who explores the options with arrows (the standard radio
interaction) answers a question they never chose, and that wrong answer flows into eligibility. The
`select` step does the same thing at `app.js:3761-3767` (`setTimeout(goNext, 150)`). On Windows and
Firefox, arrowing a closed `<select>` (the city step, `app.js:1917`) fires `change`. No e2e test
exercises arrow keys (`grep -rn ArrowDown e2e` finds nothing).

**Fix:** auto-advance only for pointer activation. Record `pointerdown` on `.wizard-choice` labels and
advance only if the change followed one. For keyboard input, select without advancing and leave Next
as the commit. Drop auto-advance on `#selInput` entirely. Add a Playwright test: ArrowDown changes the
selection and `stepIndex` is unchanged.

### P1-2 One failed script request leaves a permanent "Loading your saved progress…" screen
**Measured** (`D-fail.js`): aborting any one of `data.js`, `i18n.js`, `changelog.js`, `stateManager.js` or
`app.js` leaves `#app` stuck on the placeholder forever. There is no message, no retry and no route to
the guides. Even `changelog.js`, which only drives the non-essential "what changed" panel, takes the
whole app down (`AbilityFinderProgramChanges is not defined`).

`renderSafely()` (`app.js:2358`) only guards view rendering. The boot path at `app.js:5993-6010` (loadState
→ applyA11y → wire*) has no guard, and `wire*()` calls after `innerHTML` are not wrapped. This is the
same failure class as the AGENTS rule "Never allow a blank page", reached through flaky mobile networks,
an edge hiccup or deploy skew. The e2e suite hit it for real (§P2-6: `BENEFITS is not defined`).

**Fix:**
- (a) Add a boot watchdog to the head script `theme-init.js`. It must be an external file to satisfy
  CSP. Listen in the capture phase for `error` on `<script>` elements, plus a 10 s timer. If
  `history.state` is still null, replace `#app` with static HTML: "AbilityFinder didn't finish loading"
  and two plain links, `/` (reload) and `/guides/` (static guides that need no JS).
- (b) Make `changelog.js`, `grants-data.js` and `orgs-data.js` optional with `typeof` guards.
- (c) Wrap the DOMContentLoaded body and the `wire*` calls inside `render()` (`app.js:2390-2462`) in
  try/catch that falls back to the render-error card.

### P1-3 "High contrast" mode makes the light-theme landing *less* readable
`body.a11y-contrast` (`styles.css:1363`) forces white text and a black background. It leaves the
light-theme hero art (`styles.css:892`, `.hero-atmos`) and the light text-shadow (`styles.css:935`) in
place.

**Measured** on the rendered page at 390 px (`D-hc-light-landing-390.png`; pixels sampled behind the
hero copy): white text on that background reaches **1.56–1.85 : 1** (3.0 : 1 at best) where 4.5 : 1 is
required. Token arithmetic (`D-contrast.js`) finds two more failures in the same contrast + light combo:
- `--danger` is not overridden, so `#b53a38` sits on black at **3.15–3.63 : 1** (`.bm-diff.hard`,
  `.ts-pill.denied`, `.fact-diff.hard`).
- `--btn` stays `#1f1913` on `#000`, so the primary-button boundary is **1.21 : 1**, which fails
  1.4.11 Non-text Contrast.

The people who turn this toggle on are exactly the ones it now fails.

**Fix:** in the `body.a11y-contrast` block, also set `--danger:#ff8a87; --btn:#fff; --btn-ink:#000;`
and the soft tints. Add `body.a11y-contrast .hero-atmos, body.a11y-contrast .wiz-mountains {display:none}`
and `body.a11y-contrast .hero-inner{text-shadow:none}`. Add the contrast + light combination to the
theme e2e matrix.

### P1-4 Unlabelled postal-code field on every practitioner guide
`app.js:4729`: `<input id="finderPostal" … placeholder="…">` has no `<label>`, no `aria-label` and no
`aria-labelledby`. The block heading above it is a `<div class="guide-h">`, so it cannot label the field
either. A placeholder is not an accessible name, which fails 1.3.1, 3.3.2 and 4.1.2 (`D-a11y.js`
flagged it on the AISH guide).

**Fix:** add `<label for="finderPostal" class="sr-only">${t("finder.postalLabel")}</label>`, or a visible
label. A visible label is better for cognitive load.

### P1-5 Static guide footer link fails contrast (2.0 : 1) on all 134 guide pages
`scripts/gen-guide-pages.js:178-186`: the `Privacy & disclaimer` `<a>` in `.site-footer` has no class.
It renders in UA blue `#0000ee` on `#14110e`. Lighthouse reports this as the only a11y failure on
`/guides/aish` and `/guides/`, in production too (score 95).

**Fix:** add `class="guide-link"` to that anchor, then run `npm run gen:guides`.

---

## P2: important

### P2-1 Asset caching undoes the `?v=N` scheme, and every bump re-downloads everything
`public/_headers:26-32` makes only `/fonts/*` immutable. Production returns `max-age=0, must-revalidate`
for `app.js?v=189`, `data.js?v=189` and `styles.css?v=189`. Every repeat visit and every guide view
therefore sends 1–13 conditional requests, one round trip each before first render on a slow link,
for files that by construction never change at a given `?v`.

At the same time, **one shared N** covers 13 files and was bumped about 25 times in 16 days. Each bump
re-downloads about 440 KB, including **116 KB of fonts that did not change**: the font URLs carry `?v=189`
at `index.html:36-37` and in `styles.css`, so their year-long immutable cache is thrown away about
1.5 times a day. A returning user on mobile data pays roughly that every other day.

**Fix (low effort):**
- Add `/*.js` and `/styles.css` rules with `Cache-Control: public, max-age=31536000, immutable`. Exclude
  the unversioned `embed.js` (`embed.html:48`) by giving it a `?v` first, or by listing explicit files.
- Give fonts their own version, or none, since they never change.

**Better (medium effort):** generate per-file content-hash versions (`?v=<sha8>`) from a script and let
`test/asset-version-consistency.test.js` assert them. A data-only change then invalidates only `data.js`.

### P2-2 The JS payload is 39 % bigger than at PERF-01, and LCP has slipped to 3.7 s on mobile
Production Lighthouse shows LCP = TTFB 0.65 s + **render delay 3.0 s**: the hero cannot paint until all
11 synchronous scripts have downloaded and `loadState()` has resolved. PERF-01's conclusion that
splitting data does not help was measured at 212 KB. It should be re-checked at 295 KB.

Cheap wins that keep the restore-before-render rule intact:
- (a) **Stop preloading Fraunces** (`index.html:37`, 67 KB). Preloads compete for bandwidth with the
  critical-path JS, and `font-display: swap` already covers late arrival. Subset both fonts to the
  glyphs and weights actually used.
- (b) Load `changelog.js` (52 KB raw / 14.6 KB br), `grants-data.js` and `orgs-data.js` on demand. Only
  their views and the "what changed" panel need them.
- (c) Add `defer` to the body scripts so ordering is explicit and parse is not blocked. This is no
  behaviour change, since they are already last in `<body>`.
- (d) Record a size budget in a test (for example, total script under 320 KB br) so growth is a
  deliberate decision.

Main-thread cost is **not** the problem: TBT is 0 and bootup is under 1 s at 4× CPU.

### P2-3 The results page has no `<h1>`, and its heading omits the count
`app.js:4041-4043` renders `<div class="big">${totalWin}</div><h2>${headline}</h2>`. The route
announcement (`#routeLive`), the document title and heading navigation all read only "benefits you may
be able to get". The number, which is the single most important fact on the page, is never announced,
and the title starts lowercase.

The wizard also has no `<h1>` (`app.js:3679`, the question is an `h2`). Browse jumps from h1 straight to
h3 (`app.js:3581`). The print-only `<h1>` ("AbilityFinder — My action plan", `app.js:4984`) is correctly
`display:none` on screen (`styles.css:1468`), so it does not count as the page's h1.

**Fix:** `<h1 class="results-h"><span class="big">${totalWin}</span> ${headline}</h1>`. Make the wizard
question an `h1`, and render browse cards as `h2` (or add a visually hidden h2 for the list).

### P2-4 At 400 % zoom (320 × 256 CSS px), fixed chrome covers most of the wizard
`D-wizard-400pct-zoom-320x256.png`: the fixed nav (72 px), the fixed `.wiz-mountains` (133 px) and the
two 52 px FABs leave about 130 px of usable height. The FABs sit on top of the question text. There is
no horizontal scroll anywhere (reflow passes on results, guide and wizard), but this fails
2.4.11 Focus Not Obscured and is borderline for 1.4.10.

**Fix:** `@media (max-height: 480px) { .nav{position:static} .wiz-mountains{display:none} .a11y-wrap,.ask-wrap{…smaller, or docked into the nav} }`.

### P2-5 Static guides ignore the user's theme, text size and contrast settings, and mislabel the region
Guide pages load only `styles.css` (`gen-guide-pages.js:128-160`). `styles.css` has no
`prefers-color-scheme` rule, and `theme-init.js` is not included, so **every guide is dark** for a
light-mode or high-contrast user arriving from the SPA or from search. The header tag reads
**"Alberta + BC"** (`gen-guide-pages.js:170`) and the guides index eyebrow reads **"Alberta, BC + federal
benefits"** (`:280`), although Ontario is live and its guides are published (for example
`/guides/mississauga-activeassist`).

**Fix:**
- Include `dbManager.js` and `theme-init.js` (both external, so CSP-safe), or add a CSS
  `@media (prefers-color-scheme: light) { :root:not([data-theme]) {…} }` block.
- Build both labels from the existing `provinceProse` and `enabledProvinceNames`.

French copy has the same drift: `SCOPE_RESIDENCY_HELP_FR` (`app.js:32-36`) tells French users the
catalogue covers **Alberta and BC only**, because it branches on `BC_ENABLED` and ignores `ON_ENABLED`.

### P2-6 E2E flakiness has a measurable infrastructure cause: the Python static server's listen backlog of 5
`playwright.config.js:75` serves the app with `python3 -m http.server`. Its `socketserver` backlog is
**5**. Each app page opens 14+ parallel connections, multiplied by the number of workers.

**Measured, chromium project only, same tree:**

| Server | Workers | Result |
|---|---|---|
| Python http.server | 7 | **14 failures**: `ERR_SOCKET_NOT_CONNECTED`, 45 s timeouts in REL-02/03, AISH, at-kit, quick-wins, and `BENEFITS is not defined` because `data.js` never arrived |
| Python http.server | 2 | **2 different failures**: A11Y-03 timeout, `BENEFITS is not defined` |
| Node server with backlog 511 (`D-static.js`) | 2 | **280/280** |
| Node server with backlog 511 (`D-static.js`) | 7 | **280/280** |

On Linux CI, an overflowing SYN queue drops packets and the client retransmits after 1 s, 3 s and so on.
That fits "slow, occasionally timing out" better than hard failures. It is a strong candidate root
cause for the REL-03 and WebKit-persistence timeout class.

REL-03 also has a test-side race of its own. `e2e/assistant-reliability.spec.js:92-101` sets a 400 ms
assistant timeout and then asserts `#askStop` is visible. On a slow runner the stop button can come and
go inside that 400 ms, so the assertion waits for a state that has already passed. The test also uses
bare `page.goto("/")` (`:93`) rather than `gotoReady`.

**Fix:**
- Replace the webServer command with a tiny dependency-free Node static server (`e2e/static-server.js`,
  backlog 511, about 20 lines), or with `wrangler dev` for both project types.
- In REL-03, use a timeout of at least 1,500 ms, or assert the end state only; switch to `gotoReady`.

### P2-7 CI wall time (19–26 min) is set by serial files and one-job-for-three-engines
- `fullyParallel: false` (`playwright.config.js:29`) makes `bc-live.spec.js`, 16 UI-driven wizard walks
  at about 8 s each, a 130 s serial chain per engine locally and about 1.75× that on CI.
- CI runs Playwright's default of 50 % of vCPUs, which is 2 workers on `ubuntu-latest`.
- All six projects share one job.

**Fix, in order of payoff:**
- (1) Split the job into a `strategy.matrix` over chromium, firefox and webkit, keeping the deploy job's
  `needs` on all of them. Expect roughly a third of the wall time, about 8–9 min.
- (2) Add `test.describe.configure({ mode: "parallel" })` to `bc-live.spec.js`, or set `fullyParallel:
  true` once the specs are confirmed independent. They already use fresh contexts.
- (3) Set `workers: process.env.CI ? 4 : undefined` once P2-6 removes the server bottleneck.
- (4) Move pure-evaluation assertions in bc-live onto `evaluateAnswers()`, as `matcher-safety` already
  does with 73 tests in 12 s, and keep one UI walk per journey.

### P2-8 The eligibility engine fails open on an unknown requirement key
`app.js:1585`: `if (!req || req.met()) continue;`. A misspelt `requires` key in `data.js` silently
**removes that gate**, which can produce a false "ready". Today all 212 used keys resolve; that was
checked against the 234 keys in `REQS`. Nothing enforces it, though, and the oracle only knows the gates
it declares.

**Fix:** treat `!req` as an unmet, non-fixed need ("We could not check one requirement") plus
`console.error`. Add a unit test that every `requires` key in `BENEFITS` exists in `REQS`.

### P2-9 Two hand-maintained renderers for the same guide content
`renderGuideBody` (`app.js:5425-5595`, 172 lines) and `benefitPage()` (`gen-guide-pages.js:191-260`) each
lay out about, eligibility, amountTiers, coversList, steps, documents, tips, time and phone.

They have already drifted:
- The static page omits `declarationText`/`declarationUrl`, `needsPractitioner` and the
  practitioner-finder context.
- The difficulty labelling differs.
- The generator scrapes `app.js` with regexes (`verifiedFor`, `BC_ENABLED`, `ON_ENABLED`; `:35-55`),
  which breaks silently on reformatting. It does throw, which is good.

**Fix (medium):** move the pure, string-only guide-section builder into a small UMD module, like
`stateManager.js`, that both `app.js` and the generator load. Until then, add a unit test asserting that
both outputs contain the same section headings for every benefit.

---

## P3: worth doing

- **Double announcement on route change.** `render()` moves focus to the new heading and also writes the
  same text to `#routeLive` (`app.js:2472-2481`). Many screen-reader and browser pairs will speak it twice
  on every wizard step. Keep one of the two. Which one is right must be decided in the screen-reader pass,
  because this is human-only (see §Human-only). Live regions otherwise look disciplined: 4 global, and
  `#askLog` deliberately has no `aria-live`.
- **Touch targets.** Everything clears the 24 px AA minimum at 390 px, except the landing footer
  `.linklike` buttons at 22 px tall (`app.js:2677-2686`, `styles.css:1185`), which rely on the spacing
  exception. On results, 100 of 137 targets are under 44 px: `.track-sel` selects at 26 px (× 22),
  `.gt-btn` at 28 px, `.chip` at 30 px. For a motor-impaired audience, aim for 44 px (`min-height:44px`
  on those classes).
- **No service worker or offline fallback.** It fits the zero-spend, static model: a small SW that
  precaches `/guides/*` and the versioned shell would make repeat visits instant and work on bad
  connections. Only do it after P2-1, and with a kill-switch, because a broken SW is worse than none.
- **The logo click silently wipes all answers** (`app.js:6040-6050`; it is documented as the "clear data"
  path on the privacy page). Its aria-label says "start over", but sighted users expect a logo to mean
  "home". Add an undo toast, or confirm when results exist.
- **Three local `esc` helpers.** Two of them (`app.js:4958`, `:5017`) do not escape quotes, alongside
  `attrEscape` and `ttsEscape`, and 28 `innerHTML` sinks interpolate catalogue fields raw (for example
  `app.js:4072 ${e.b.name}`). This is safe today, because the data is first-party and CSP forbids inline
  script, but it is one shared helper away from being robust.
- **`/api/*` bodies without `Content-Length`** are read unbounded (`src/index.js:148-151`; the test
  "no Content-Length still reaches validation" codifies it). The platform caps this, but a streamed
  reader with a 64 KB cut-off would make the limit real.
- **`/api/link-health`**: its "no report" branch lacks `Cache-Control: no-store` (`src/index.js:455-459`).
- **The assistant prompt names only "Legal Aid Alberta"** (`src/index.js:90`) for BC and Ontario users.
  Parameterise it from `BENEFITS_SCOPE`.
- **Content baked into the persistence layer.** `stateManager.js` carries a `FACT_REGISTRY` of benefit
  questions and help text (lines 15-25). That is content inside the persistence layer, and future
  contributors will not look for it there.
- **`app.js` is 6,055 lines in one classic script.** No single function exceeds 200 lines. The largest are
  `renderLanding` (187), `renderGuideBody` (172), `wireResults` (138) and `render` (129). The real mass is
  data-shaped: `REQS` (1,211 lines of gates), `STEPS` (325) and `HELP_PAGES` (181). Splitting those three
  into their own files, loaded like `data.js`, would halve `app.js` with no build step.
- **The results page re-renders by full `innerHTML`.** Same-page re-renders cost 35–40 ms at 4× CPU, which
  is acceptable. The multi-select path already avoids it, so focus is preserved (verified in
  `D-focus.js`). Keep that pattern for any new interactive control on results.

---

## Security and privacy: what holds

- **CSP** (`_headers:11`): `script-src 'self'` with no inline script, `connect-src 'self'` and
  `frame-ancestors 'none'`. `style-src 'unsafe-inline'` is required by the JS-set styles and is low risk.
  It is verified live. The embed route correctly swaps in its own CSP.
- **Third-party requests on load: none.** The only external request on production is Cloudflare's
  injected Insights beacon plus an inline bootstrap, and **both are blocked by CSP**. They are the source of
  Best-Practices 93 (`errors-in-console`, `inspector-issues`). Disable Web Analytics / Browser Insights
  injection for the zone in the dashboard (as `AGENTS.md` says), which is a free +7 on Best Practices.
- **`/api/ask` and `/api/feedback`** (`src/index.js`):
  - The same-origin check runs before any binding.
  - The declared-size gate runs before parsing.
  - The per-IP limiter fails closed with a 503.
  - Messages are validated (role, length, 20 turns, last turn must be from the user).
  - The model output is re-framed as SSE and the client renders it as `textContent`.
  - Feedback is pinned to one recipient, and the reply-to is regex-sanitised against header injection.
  - The `kind` field is allowlisted.

  This is good, defensive work.
- **On-device data:** IndexedDB holds wizard answers, including disability categories (health-adjacent),
  stored unencrypted with no expiry. That is the intended design and is disclosed on the privacy page.
  Postal and free text are excluded by the allowlist. The only off-site path for answers is the
  user-initiated Google Maps link (postal or city in the URL, `app.js:104-115`), opened with
  `noopener noreferrer`.

## SEO and shareability

- **Good:**
  - 133 static guides plus `/guides/`, with unique `<title>`, `description` and `canonical` tags.
  - Sitemap with 135 URLs; `robots.txt` points to it.
  - SPA `index.html` has full OG and Twitter tags with a 1200 × 630 image.
  - Lighthouse SEO 100 on landing and guide.
- **Gaps:**
  - Guides have **no `og:image` and no `twitter:card`** (`gen-guide-pages.js:128-141`), so shared guide
    links unfurl without an image. Add the site image plus `twitter:card=summary_large_image`, and use
    `og:type=article`.
  - The sitemap has no `<lastmod>`; derive it from the benefit's verified date.
  - SPA views (browse, about, grants, organizations) are not addressable URLs, except `?view=privacy`
    (`app.js:5997`). That is acceptable while the guides carry search.
  - The guide header region label is stale (see P2-5).

---

## Top 10 engineering improvements (ranked by user impact against effort)

| # | Change | Impact | Effort | Ref |
|---|---|---|---|---|
| 1 | Stop arrow keys from auto-advancing the wizard; pointer-only auto-advance, no auto-advance on `<select>` | High: keyboard and screen-reader users record wrong answers | S | P1-1 |
| 2 | Boot watchdog plus optional non-core scripts, so no permanent "Loading…" screen | High: anyone on a flaky connection | S | P1-2 |
| 3 | Repair high-contrast + light mode (hero art, `--danger`, `--btn`) | High for low-vision users | S | P1-3 |
| 4 | Label `#finderPostal`; class the guide footer link and regenerate guides | Medium-high, 2 lines | XS | P1-4, P1-5 |
| 5 | Immutable caching for versioned JS/CSS; independent font version | High for returning mobile users, about 440 KB saved per bump | S | P2-1 |
| 6 | Results `<h1>` that includes the count; wizard `<h1>`; browse heading levels | Medium: screen-reader orientation on the key page | S | P2-3 |
| 7 | Static guides honour theme and contrast; fix the "Alberta + BC" labels and the French scope string | Medium: the search landing pages | S | P2-5 |
| 8 | Replace `python3 -m http.server` in e2e with a backlog-511 Node server; fix the REL-03 400 ms race | Medium: removes the flake class and red-deploy blocks | S | P2-6 |
| 9 | CI matrix per engine, parallel `bc-live`, 4 workers | Medium (developer loop): about 20 min down to about 8 min | S-M | P2-7 |
| 10 | Fail-closed on unknown `REQS` key plus test; payload budget and font/preload trims | Medium: protects accuracy, holds LCP | S-M | P2-8, P2-2 |

Next after these: a shared guide-section module (P2-9), 400 % zoom chrome (P2-4), and moving `REQS`,
`STEPS` and `HELP_PAGES` out of `app.js`.

## Human-only (cannot be closed by this audit; epic #28)

- **Screen-reader passes** with VoiceOver on iOS Safari, VoiceOver on macOS, NVDA with Firefox or
  Chrome, and TalkBack. They must cover:
  - the full wizard;
  - results with the tracker selects;
  - the assistant consent and streaming answer;
  - whether route changes double-announce (P3).
- **Real keyboard-only and switch-access users** on the wizard after P1-1 is fixed.
- **Cognitive-load and comprehension testing** (UX-02, UX-03 owner TBDs).
- **Real 200–400 % zoom and Windows High Contrast / forced-colors sessions** with low-vision users.
  The automated checks here only prove there is no horizontal overflow.
- **INP in the field**, which stays unmeasurable without analytics, by design.

## Method notes and caveats

- The local Lighthouse runs (FCP 7.8 s landing) used an uncompressed Python server and are **not**
  representative; the production runs are.
- PERF-01's 2,364 ms LCP used a different throttle profile. Treat the 3.7 s as a regression signal to
  re-measure with identical settings, not as a precise delta.
- The e2e server experiment covered the chromium project only, on macOS. CI runs Linux, where an
  overflowing listen backlog drops and retransmits rather than resets.
- The token-contrast math does not include alpha-composited soft tints; the 2026-07-15 axe audit covered
  those in the non-contrast themes.
