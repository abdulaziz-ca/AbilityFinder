# AbilityFinder — decisions and failure archive

This file preserves durable lessons, not a project diary. Current architecture is
in `HANDOFF.md`; current work is in `ROADMAP.md`. Completed implementation details
remain in git history.

## Accuracy failures

### Prompt rules did not contain the free model

Before grounding, the assistant called AISH "Alberta Income Support for the
Homeless," misnamed T2201, and invented an AISH phone number despite explicit
"never invent" instructions.

**Decision:** generated source data, not prompt confidence, constrains the model.
`src/benefits-context.js` is generated from `public/data.js` and practitioner forms.
Figures are redacted so the model cannot repeat amounts. The assistant does not
state figures or eligibility verdicts and points users to verified guides.

**Regression prompts:** AISH identity, T2201 meaning, amount refusal, out-of-scope
Ontario program, application steps, and verified help phone. Run after grounding or
model changes.

### Municipal programs are not templates

Programs with similar names have different rules. Examples found during research:
Grande Prairie separates AISH recipients from its regular subsidy; St. Albert has
more generous AISH transit/recreation treatment; Lethbridge includes paratransit;
Red Deer can auto-qualify AISH recipients.

**Decision:** verify every municipality independently. Copying Calgary's pattern can
send someone to the wrong program or make them pay more.

### Soft 404s and Worker-only failures

Some sites return HTTP 200 while landing on a not-found route. Others work in a
browser/curl but reject Cloudflare Worker fetches.

**Decision:** monitor states distinguish broken, redirected, unreachable, and
inconclusive. Inspect final URLs and confirm in a real browser before declaring a
published source dead. Reports that cry wolf stop being useful.

## Rendering and CSS failures

### A persisted blank page

`valueLabel()` assumed `step.options` was always an array after one step changed it
to a function. Results rendering threw before assigning `#app.innerHTML`; the bad
route then restored on every reload.

**Decision:** every route goes through `renderSafely()`. Shared changes require all
routes for self/child/family, not only the changed screen. Test the user's path, not
just the diff.

### `[hidden]` lost to component display rules

A panel child with `display:flex` overrode the browser's `[hidden]` styling and
appeared outside its panel.

**Decision:** any component class that declares `display` also needs an explicit
`[hidden] { display:none }` rule.

### Media-query order caused a sticky overlay

A narrow-screen override appeared before an equal-specificity base rule, so the
later base rule won and a sticky detail sidebar covered content.

**Decision:** in the unlayered stylesheet, put base rules before media-query
overrides. Avoid relying on source-order assumptions you have not inspected.

### Light-theme contrast was not a simple inversion

Placeholder text, dim text, semantic green/amber/red, and text on soft semantic
tints failed AA even when the same token passed on the page background.

**Decision:** check 4.5:1 against every actual background, including composited soft
tints. Firefox placeholder opacity needs explicit handling. Axe reports gradient
contrast as incomplete; use human review there.

### Motion can hide essential content

Scroll reveal is decoration, but a reveal stuck at opacity zero hides benefits.

**Decision:** only hide after JS confirms motion is wanted, respect OS and in-app
reduced motion, and keep a fail-visible watchdog.

## Accessibility testing failures

Switching `data-theme` in place before rerunning axe produced dozens of phantom
violations. Freshly loaded theme runs were clean after fixes.

**Decision:** persist the desired theme, reload, then audit. Automated checks still
do not validate screen readers, full keyboard journeys, 200–400% zoom/reflow, or
cognitive clarity.

Streaming assistant tokens in an `aria-live` chat log would announce fragments
continuously.

**Decision:** the log is not live; only the completed answer is announced through
`#askLive`.

## Persistence failures and decisions

### Broad serialization violates privacy

Legacy state could contain postal/free-text and unknown fields. Migrating that object
directly would preserve data outside the new policy.

**Decision:** `stateManager.js` owns an explicit allowlist and authoritative catalog
validation. Legacy records are translated then sanitized through that same boundary
before any IndexedDB write. Old keys are removed only after success.

### Restore-after-render creates races

An asynchronous database restore can flash defaults or let startup saves overwrite
the user's real state.

**Decision:** await restore before the first meaningful render. If IndexedDB is
unavailable, return clean defaults and keep the app visible.

### Per-tab write queues do not protect multiple tabs

A promise queue orders writes within one manager only. Two tabs can hold full stale
snapshots and overwrite each other.

**Decision:** records carry optimistic revisions checked inside the read-write
transaction. A stale write is rejected; the app reloads authoritative state rather
than retrying stale data.

### Physical deletion created an ABA race

If one tab deleted the record, another tab that had loaded an older revision saw a
missing record and could recreate cleared answers. A stale tab could also clear a
newer snapshot.

**Decision:** clear writes a metadata-only tombstone with an incremented revision
and no payload. Saves and clears reject revision mismatches and missing records when
the manager previously observed a record. Tombstones also block stale legacy
re-import. Unit tests cover stale-save-after-clear and stale-clear-after-save.

## Worker and protocol failures

Workers AI may stream numeric fragments as JSON numbers. A truthy response check
silently discards a literal zero.

**Decision:** test response fields for null/undefined, not truthiness, in Worker and
browser stream handling.

Calendar lines must fold at 75 **octets**, not JavaScript characters. Unicode dashes
made apparently short lines exceed RFC 5545 limits.

**Decision:** fold generated `.ics` content by UTF-8 bytes and test non-ASCII text.
Unknown or vague benefit wait strings do not become invented reminder dates.

## Operational failures

### Documentation was once deployed

Docs lived beside `index.html` and were publicly readable.

**Decision:** only `public/` ships; operational and historical docs stay at root.

### Cache-busting hid deployed fixes

Browsers continued serving old CSS/JS after source edits.

**Decision:** bump the shared `?v=N` asset version in `public/index.html` and keep
related URLs aligned.

### Cloudflare edge injection conflicts with privacy CSP

Cloudflare zone features can inject Browser Insights/challenge scripts. The strict
self-only CSP blocks them and logs CSP warnings on the live edge, while local
Wrangler tests do not show the injection.

**Decision:** never weaken CSP to make analytics execute. Disable automatic
injection in the Cloudflare dashboard if desired, and separate blocked edge-script
warnings from real application errors during smoke tests.

## Product decisions not to re-litigate casually

- No accounts/server sync for disability and income state; use local export/import
  if a proven need emerges.
- No email/SMS reminders storing contact data; local calendar downloads cover the
  common case.
- No community free text without a moderation/privacy model.
- No custom admin CMS while `data.js` plus git is sufficient.
- No diagnosis-based or free-text AI eligibility verdict. Structured limitation-
  based questions are safer and closer to official criteria.
- No weaker assistant safety merely to sound more complete.
