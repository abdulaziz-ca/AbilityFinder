# AbilityFinder — start here

**Read this first. It's the short version.** Deeper detail lives in `HANDOFF.md`
(architecture + conventions), `ROADMAP.md` (what's done, what's next, and why
some things were rejected), and `DEPLOY.md` (hosting, cost, email).

---

## What this is

A free tool that finds every disability benefit an Albertan can get — federal,
provincial and municipal — and hands them plain-English guides to apply.

**Live:** https://abilityfinder.ca · **Repo:** github.com/abdulaziz-ca/AbilityFinder

**Who uses it:** disabled people, their caregivers and families. Many are tired,
in pain, short on money, or have been denied before. Some have cognitive
disabilities or brain fog. This shapes every decision below.

**The stakes, plainly:** if we're wrong, someone doesn't get money they're owed,
or wastes an appointment they had to wait months for. A confidently wrong
benefits directory is worse than none. Optimise for *not being wrong*, then for
being useful, then for being pretty.

---

## The five rules

1. **Never invent a benefit fact.** No amount, cutoff, form number, phone
   number, timeline or eligibility rule unless you read it on the official page
   *today*. Every entry in `data.js` carries a `source`. This isn't caution
   theatre — see "Things that actually went wrong".
2. **Zero spend.** The owner's hard rule. Everything is on the **Workers Free
   plan**, where Workers AI has no overage price (10k Neurons/day, then requests
   just fail). Moving to Workers Paid reintroduces billing on `/api/ask` — read
   `DEPLOY.md` §1b before ever upgrading.
3. **Privacy is the product.** Everything stays in the browser except two
   opt-in things: the assistant (`/api/ask`) and the feedback form
   (`/api/feedback`). No accounts, no analytics, no PII. If you change what
   leaves the device, **change the privacy page in the same commit**.
4. **Eligibility is about limitation, not diagnosis.** This is the single most
   important idea in the domain. Most benefits don't care what you have; they
   care how much it limits you. There is no list of "qualifying disabilities".
   Never imply otherwise — it's the belief that stops people applying.
5. **Never let the page go blank.** See "Things that actually went wrong".

---

## Layout

```
public/          the ONLY deployed directory — the whole static site
  data.js        BENEFITS catalog + values/meta/extras. The product is in here.
  app.js         everything: state, wizard, eligibility engine, router, render
  styles.css     one design system, no build step
src/index.js     the Worker: /api/ask, /api/feedback, /api/link-health, cron
src/*-context.js GENERATED — do not hand-edit (npm run gen:context)
*.md, serve.py   docs + dev server. At the ROOT so they are never served.
```

> Docs used to sit next to `index.html` and were publicly readable at
> `abilityfinder.ca/HANDOFF.md`. Keep them out of `public/`.

## Commands

```sh
npx wrangler dev        # local, real bindings
npm run gen:context     # AFTER any data.js edit — regenerates the AI grounding + link list
npx wrangler deploy     # deploy (wrangler is already authenticated)
git push                # also auto-deploys via Workers Builds in ~35s
```
Cache-bust: bump `?v=N` in `index.html` **and** `styles.css` when you touch
`public/` — otherwise returning visitors get stale files.

---

## Architecture in six lines

- Cloudflare **Worker with static assets** (not Pages). `public/` is served;
  `/api/*` is handled by `src/index.js`.
- **No build step for the site.** Plain HTML/CSS/vanilla JS.
- **Assistant** = Workers AI (`@cf/meta/llama-4-scout-17b-16e-instruct`), opt-in,
  streaming, rate-limited, **grounded in `data.js`** via `src/benefits-context.js`.
- **Feedback** = `send_email` binding pinned to one destination (can't be a spam
  relay). Free because sending to a *verified destination* is free on any plan.
- **Link monitor** = weekly cron → checks all official links → KV →
  `/api/link-health`.
- **State** = `answers` + `progress` in `localStorage`. No server-side state.

---

## Things that actually went wrong (do not re-learn these)

**The free model invents things.** Ungrounded, it called AISH *"Alberta Income
Support for the Homeless"* (it's Assured Income for the Severely Handicapped),
called T2201 the *"Medical Certificate"*, and invented an AISH phone number —
all **despite** a prompt explicitly forbidding it. Prompt rules do not contain
this model; data does. That's why `benefits-context.js` exists, why figures are
*redacted* from it (a model can't quote a number it was never shown), and why
the assistant is forbidden from stating any amount or eligibility verdict.
**Don't widen its job without a stronger model.**

**Municipal programs are not copies of each other.** Grande Prairie *excludes*
AISH recipients from its low-income transit subsidy and gives them a better
separate pass ($10.25/mo vs $74.25). St. Albert gives AISH free transit outright.
Pattern-matching from Calgary would have cost a real person ~$27/month. Verify
every city individually.

**A blank page is the worst failure mode.** `valueLabel()` read `step.options`
directly after that field became a *function* on one step → `renderResults()`
threw → `#app.innerHTML` was never assigned → blank page, unrecoverable by
refresh (the broken view is restored from localStorage). Every view now goes
through `renderSafely()`. **After touching anything shared, render every view for
every persona (self/child/family) before deploying** — the thing that broke was
on the one page that wasn't checked.

**Verify the path a user takes, not the diff you wrote.** Unit-checking your own
change proves only the parts you were already thinking about.

**CSS traps in this file:** (1) there are no cascade layers — a media query above
its base rule silently loses; (2) a class with `display:` beats the UA's
`[hidden]{display:none}`, so any hidden element needs its own
`[hidden]{display:none}`; (3) the light theme was built by inverting backgrounds
without re-checking token contrast — every colour must clear 4.5:1 against
*every* background it lands on, **including its own soft tint**.

**Soft 404s return 200.** rmwb.ca answered 200 and redirected to `/not-found-404/`.
The link monitor checks the landed URL for this now.

---

## Accessibility (non-negotiable)

Audited with axe-core: **8 views × 2 themes, 0 violations.** Keep it there.

- Motion: respect `prefers-reduced-motion` **and** the in-app `a11y-nomotion`
  toggle. Reveals **fail visible** — content is never hidden unless JS confirms
  motion is wanted, plus a 3s watchdog. A section stuck at `opacity:0` is a
  person who doesn't get their benefit.
- Don't put `aria-live` on the assistant's chat log — streaming tokens would
  announce every fragment. The finished answer is announced once via `#askLive`.
- Model output renders with `textContent`, never `innerHTML`.
- Re-run the audit per theme with a **fresh reload** — flipping `data-theme`
  in-page and re-running gives false counts (47 phantom violations once).

---

## State of play

**Done:** Phases 1–5 (money & priority, eligibility depth, organise & act, AI
assistant, keep-it-true). 10 municipalities. Accessibility audit. All five
user questions are answered.

**The real remaining risk is decay**, not missing features: 30+ official links
and every dollar figure go stale silently. The weekly monitor reports Mondays at
`/api/link-health`; feedback now reaches the owner.

**Next, in order:**
1. **Get a real disabled person to use it.** The audit clears the automated
   third of WCAG; screen readers, keyboard-only, 400% zoom and whether the
   plain-language copy lands are all unverified. This is the biggest unknown.
2. **`BENEFIT_SIGNERS` for CPP-D / AISH / parking placard** — only DTC has a
   verified signer list. Needs research, not a guess: a wrong entry sends
   someone to pay for an appointment with a practitioner who can't sign.
3. **More municipalities** — 10 done; Spruce Grove, Leduc, Cochrane, Okotoks,
   Camrose, Canmore, Lloydminster, Fort Saskatchewan are unchecked.
   ⚠️ **The link monitor is at 43/50 subrequests.** The Workers Free plan caps
   subrequests at 50 per invocation, so roughly two more cities will break the
   weekly check. `npm run gen:context` prints the count and warns past 50 —
   when it does, chunk the check across runs (e.g. half the links on alternate
   Mondays) rather than silently dropping links.
4. **Per-benefit `verified` dates** (`BENEFIT_VERIFIED`) — seeded empty; add an
   entry only when you have actually re-checked that benefit.
5. Scroll-reveal animation is **unverified in a real browser** (the preview pane
   can't scroll). The fail-safes are tested; the effect isn't.

**Deliberately rejected — don't "just add" these** (reasons in `ROADMAP.md`):
accounts/sync, email/SMS reminders, community reviews, an admin CMS, and any
"describe your disability and we'll pick for you" matcher.
