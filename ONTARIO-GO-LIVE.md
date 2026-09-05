# Ontario go-live checklist (#91)

Nine Ontario records are staged on `main` behind `ON_ENABLED=false`. They are invisible to
users, to the generated guides and sitemap, and to the assistant grounding. This file is the
exact sequence to switch them on.

**This was rehearsed end to end on 2026-09-04** — flag flipped on locally, everything
regenerated and tested, then flipped back and verified byte-identical. The one blocker that
rehearsal found (`npm run gen:context` crashing) is already fixed on `main`.

**With the flag on, no test fails.** 127 unit and 465 e2e passed during the rehearsal. So this
is a copy-and-regenerate exercise, not a code-fixing one. If a test does fail, something has
changed since the rehearsal — stop and investigate rather than editing the test.

## The nine records

| id | Program | Best case |
|---|---|---|
| `on-parking-permit` | Accessible Parking Permit | ready |
| `odsp` | ODSP income support | almost |
| `on-adp` | Assistive Devices Program | almost |
| `ontario-autism-program` | Ontario Autism Program | ready |
| `ssah` | Special Services at Home | almost |
| `acsd` | Assistance for Children with Severe Disabilities | almost |
| `passport-program` | Passport (adults with a developmental disability) | almost |
| `hvmp` | Home and Vehicle Modification Program | almost |
| `trillium-drug-program` | Trillium Drug Program | almost |

Every factual field was verified against its official ontario.ca page on 2026-09-04 and
reviewed for fact fidelity before landing. Re-verify anything that has since changed —
ODSP and ACSD amounts are inflation-indexed and move every July.

## Steps

1. **Flip the flag.** `public/app.js` — `const ON_ENABLED = false;` becomes `true`.

2. **Update the two hardcoded strings in `public/index.html`.** These are static HTML and are
   deliberately NOT generated — making them dynamic would cost SEO, since crawlers may not run
   JavaScript. Both currently say "Alberta and British Columbia":
   - line 9, the `<meta name="description">` content
   - line 11, the `<title>`
   The guides-index description is already province-aware and updates itself on regeneration.

3. **Bump the asset version.** Replace `?v=148` with `?v=149` in BOTH `public/index.html` and
   `public/styles.css`. (If someone has bumped it since, use the current number + 1.)

4. **Add a real changelog entry** at the top of `public/changelog.js`. Every Ontario entry so
   far has been deliberately neutral ("groundwork… nothing shown has changed") because nothing
   was user-visible. This one IS user-visible, so say so plainly — Ontario is now covered, and
   name the nine programs.

5. **Update `HANDOFF.md`.** The scope paragraph says Ontario is "held dark behind
   `ON_ENABLED=false`" — that clause becomes false. Keep the counts (`111 benefits — 16
   federal, 14 Alberta, 42 British Columbia, 9 Ontario`); a docs-consistency test checks them
   and they do not change when the flag flips.

6. **Regenerate.**
   ```
   npm run gen:context
   npm run gen:guides
   ```
   Expect `BC_ENABLED=true ON_ENABLED=true — excluded 0 dark-province entries; generating 111
   entries.` from both, `gen:context` reporting 111 benefits, and `gen:guides` writing 110
   benefit pages. Nine new guide files appear under `public/guides/` and in `public/sitemap.xml`.
   `gen:guides` takes about 10 minutes.

7. **Test.**
   ```
   node --test test/*.test.js      # expect 127 pass
   npx playwright test             # expect 465 pass
   ```
   Run the e2e suite on its own. Running it alongside another heavy job on a memory-constrained
   machine produces short, misleading counts — compare "N passed" against
   `npx playwright test --list` and treat any shortfall as a run that did not finish.

8. **Push and confirm CI is green.**

9. **Confirm the release actually shipped.** Per `DEPLOY.md`, a green CI run is NOT proof of a
   release — the deploy job exits 0 without releasing when the Cloudflare token is absent.
   Check the live `?v=` actually moved to the new number.

10. **Post-deploy checks.**
    ```
    npm run verify:deploy
    ```
    Then open one Ontario guide live (for example `/guides/odsp.html`), run the wizard as an
    Ontario resident, and confirm Ontario programs appear with sensible statuses.

## What you do NOT need to touch

- `test/ramp.test.js` — asserts 111 records, which is true in both states.
- `e2e/matcher-safety.spec.js` — the dark-province test is flag-aware. While dark it asserts no
  Ontario record is reachable; with the flag on it asserts all nine are. It stays correct
  through the flip.
- The eligibility oracle — all nine programs' gates and frozen best cases are already declared.

## A sharp edge worth knowing before you add Ontario records later

The assistant-grounding safety guard rejects numeric facts so the assistant can never state an
amount, and it asserts on the JOINED detail text. Steps render as a numbered list, so a step or
tip ending in "age", "under" or "over" followed by a numbered step produces something like
`age\n  3`, which the age-limit pattern matches across the line break. Per-item redaction cannot
catch it. `npm run gen:context` then fails with
`<id> detail grounding contains prohibited numeric or contact facts`.
Reword the sentence — do not loosen the guard. It is fail-closed on purpose: a false positive
costs a sentence, a false negative could feed the assistant a dollar figure.

## Deliberately not built

- **ODSP Employment Supports** — the official section states no eligibility, amounts or process,
  so there was nothing actionable to build a record on. It is a tip on the `odsp` record instead.
- **Ontario Renovates** — delivered by municipal service managers, with income limits and maximum
  loan amounts that vary by service manager. It cannot be a province-level record without stating
  amounts that are not province-wide. It belongs in a future municipal stage, verified one
  service manager at a time, like the existing Alberta and BC municipal records.
