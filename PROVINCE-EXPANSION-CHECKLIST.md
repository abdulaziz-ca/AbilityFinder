# Province expansion — source-audit checklist

**Read this only when adding a province.** It is the authoritative bar for
re-integrating a jurisdiction from `archive/data-provinces-later.js`, and it exists
because Alberta and B.C. set a verified-depth standard that no additional province
may ship below.

**A province cannot ship until every section below has passing evidence recorded.**
Not "looks fine", not "was verified during the original build" — evidence, dated, in
the ticket. Four sections, each separately reviewable, each with its own gate:

1. Source audit
2. Metadata pass
3. Matcher gating
4. Generator runs

**National-but-shallow is rejected.** Covering every province with thin, unverified
records is explicitly not the goal; the Disability Benefits Compass approach was
considered and declined. One province at the Alberta/B.C. depth beats ten at a
directory's depth, because a wrong amount or rule costs someone money or a scarce
appointment.

---

## Before you start: the archive is a lead, not a source

`archive/data-provinces-later.js` sits outside `public/` and is not served. Its
header says *"Every benefit + link here was researched & verified during the
multi-province build."* **Do not trust that sentence.** It was true when written and
says nothing about today: amounts move, programs close, URLs rot, and eligibility
rules change. Treat every archived record as an unverified draft.

The same caution already applies to `AUDIT_REPORT_2026-07-22.md`, three of whose
findings were disproved against primary sources. Prior verification is a starting
point, never a passing grade.

**Check the catalogue first.** Before recording that this province needs a program,
run the record-id and keyword searches required by the "Coverage-gap proposals"
section of `AGENTS.md`. A record often already exists under a different id.

---

## 1. Source audit

**Gate: every fact traces to an official page read on the day, and every claim of
absence is a recorded search.**

- [ ] Read the **official** government page for each program on the day of the
      change. Never extrapolate from another province or municipality — programs
      that look alike have materially different exclusions, prices and coverage.
- [ ] **A third-party figure is not a source.** Advocacy sites, aggregators and
      news articles are leads. B.C.'s RAHA limits were widely quoted as `$134,140`;
      the program's own calculator said combined income under `$146,270` and assets
      under `$100,000`. Refusing to copy the third-party number was correct.
- [ ] **Prefer the hub page anchor over a per-program URL.** Standalone per-plan
      URLs 404 while the hub section stays correct — this is why the PharmaCare
      records point at hub anchors.
- [ ] **Filter hub pages that are out of scope rather than harvesting them.** A
      provincial benefits hub lists programs for many audiences; take the ones this
      product covers, and record why the rest were excluded.
- [ ] **A non-200 is not proof a link is dead, and a 200 is not proof it is alive.**
      Municipal and federal sites return 403 to automated clients — `canada.ca`,
      `vancouver.ca`, `kelowna.ca` and `airdrie.ca` all did, and all loaded normally
      in a browser. Conversely a **soft 404 returns 200** with a not-found body.
      Confirm in a real browser and inspect the landed content, not the status code.
- [ ] **Watch for a source that contradicts itself.** The CRA's DTC page states two
      different therapy frequencies — its eligibility checklist says 2 times per
      week, its embedded video transcript says 3. The checklist is operative.
      Writing the wrong one would have turned away people who qualify.
- [ ] Record, per program: the URL, the date read, the figures taken, and anything
      the page does **not** say. Absence is a finding.

## 2. Metadata pass

**Gate: every record carries the fields the current catalogue requires, and every
field has been read.**

- [ ] **Grep every field of a record, not just `note`.** This is not hypothetical:
      a B.C. record was declared clean after verifying only its `note`, while its
      own `detail.time` and `detail.tips` still contradicted the correction. A
      grep across all fields would have caught it immediately.
- [ ] Every record keeps its **`source`**, and an **`applyUrl`** that resolves.
- [ ] Every record has a **`detail`** block. Archived records predate the current
      shape: all 16 carry `detail.phone` and `detail.time`, but **none carries
      `requiresNote`** — 0 occurrences across the whole archive file. That single
      missing field is what makes an archived record structurally incomplete against
      the current bar, even when its facts are right. (Count it yourself rather than
      sampling one record: `grep -c requiresNote archive/data-provinces-later.js`.)
- [ ] **`requiresNote`** is written wherever the program has an eligibility rule the
      user must meet. It renders as "What you must meet" on the guide and in the app;
      a record without one hides eligibility detail available nowhere else.
      **Nothing catches its absence automatically.** `test/requires-note-rendered.test.js`
      filters to records that *already* have one, asserts at least 40 exist, and checks
      those render — so a new record shipped without `requiresNote` passes. This is a
      human check; treat the test as protection against the field going dark, not
      against forgetting it.
- [ ] A per-record **freshness date** is added to the verified map in
      `public/data.js`, so the guide can show when the figures were last confirmed.
- [ ] `b.note` is **"Good to know"**, not eligibility. Most notes are caveats,
      timing and gotchas; eligibility belongs in `requiresNote`.
- [ ] No dollar figure, rate or maximum is stated that the official page does not
      state. If the page gives no number, the record gives no number.

## 3. Matcher gating

**Gate: no unasked criterion can produce a "ready" verdict, and every new gate is
classified.**

- [ ] **An unasked criterion uses `met: () => false, fixed: false`.** That yields
      "One step away" rather than a false "Ready to apply". `fixed: false` matters —
      a hard "no" would wrongly drop the program for someone who simply has not done
      the step yet.
- [ ] **`fixed: true` only when the questionnaire actually asks.** Kelowna's
      post-secondary-student exclusion uses it correctly because the wizard does ask;
      without that gate a Kelowna student was returned `"ready"` for a program the
      city explicitly excludes.
- [ ] **Classify every new gate `answers` or `external`** in the eligibility oracle
      (`e2e/oracle/oracle-spec.js`). A gate needing a caseworker adjudication,
      practitioner certification, tax filing, registration, or money already spent is
      `external`, and any program carrying one can never legitimately return ready.
- [ ] The frozen outcome baseline is updated deliberately, and the oracle still
      forces **declared == derived == actual**. Never edit `public/` to make the
      oracle pass.
- [ ] Shared predicates stay **program-neutral**. `certifier` (`public/app.js:221`)
      is shared between the DTC and the parking placard, and is classified `external`
      in `e2e/oracle/oracle-spec.js`. The guards are in `e2e/matcher-safety.spec.js`:
      the `parking-placard` status assertions, and "shared predicates are unchanged
      for other programs". They assert **status**, not wording — so re-read them
      before changing a shared predicate's copy; a program-specific sentence can slip
      past a status assertion.
- [ ] Run the matcher-safety suite and confirm no new program reaches "ready" on a
      criterion the wizard never asked.

## 4. Generator runs

**Gate: generated output is regenerated from its scripts and reviewed, never
hand-edited.**

- [ ] `npm run gen:context` — regenerates `src/benefits-context.js` and
      `src/links.js` from the data sources.
- [ ] `npm run gen:guides` — regenerates the guide pages and `public/sitemap.xml`.
- [ ] **Review both generated diffs.** Confirm the new links appear in
      `src/links.js` with the right `kind`, and that the grounding context changed
      only where expected. Figures are redacted from grounding on purpose.
- [ ] Append a **`DATA_CHANGELOG`** entry in `public/changelog.js` for every
      benefit-fact change.
- [ ] Bump the shared **`?v=N`** in `public/index.html` and `public/styles.css`, then
      re-run `gen:guides` so all guides carry it. Verify none is left behind:
      ```sh
      version=$(grep -oE 'styles\.css\?v=[0-9]+' public/index.html | head -1 | grep -oE '[0-9]+')
      grep -rL "?v=$version" public/guides   # must print nothing
      ```
- [ ] `npm test` and `npm run test:e2e` pass. `test/data-procedure.test.js` fires
      automatically because `public/data.js` is in the change set — it will fail the
      landing if the changelog entry, the version bump or the generated output is
      missing.
- [ ] Restore the province in the residency step and the per-province `REQS` keys.
      The keys already exist in `app.js`.
- [ ] **Do not believe the archive's "only residency options + data" instruction.**
      Its header lists four re-integration steps and implies the code is ready. It is
      not: province handling is **hard-coded to Alberta and B.C. in five places**, and
      a province added without them ships broken in ways the tests will not catch.
      Verified on 2026-08-17; re-check each before trusting this list:
      - `scripts/gen-guide-pages.js` — provincial vs municipal classification. An
        Ontario record would be grouped under **Municipal** on the guide pages.
      - `scripts/gen-benefits-context.js` — the assistant's grounding scope.
      - `src/index.js` — the Worker's scope prompt. The assistant would tell an
        Ontario user that provincial programs are **not covered**, which is worse
        than silence: it is a confident wrong answer to someone who needs help.
      - `public/app.js` — browse classification and the impact statistics.
      - the scope strings listed in the next item.
- [ ] **Merge the province-specific fallback maps**, which the archive header names
      as step 2 and which this checklist previously omitted: **`STUDENT_AID`,
      `TWO_ELEVEN` and `EMPLOYMENT`**. Runtime code in `public/data.js` uses them to
      route a user to their province's student-aid office, 2-1-1 service and
      employment supports. Without them a new province's users silently get the
      generic national link instead of their own official route — a quiet wrong
      answer, not a visible failure. Record each new province's three values and
      confirm the generated links.
- [ ] Update `COVERED_PROVINCES`, `CITIES_BY_PROVINCE` and the city arrays — and
      then re-check every scope string. Coverage wording appears in the landing copy,
      the About page, the residency help, the meta description, the Open Graph and
      Twitter titles, the guide-index description and the embed. A province that
      ships without those updated will advertise coverage it does not have, or hide
      coverage it does.

## 5. Accessibility, language and privacy

**Gate: the surfaces a province changes are re-checked for the audience this product
serves.**

- [ ] **Both languages.** A province adds residency options, city names and scope
      strings. Check `public/i18n.js` for English and French, and confirm the French
      scope wording does not fall back to something stale — a French scope label once
      advertised Ontario and Québec, which the catalogue has never covered. Note that
      **`AF-S0904` keeps French paused**: do not write new French benefit content, but
      existing interface strings that name provinces must not become wrong.
- [ ] **Keyboard and screen reader** on the changed residency step and results, per
      the accessibility gates in `AGENTS.md`. Automated checks do not substitute.
- [ ] **200–400% zoom and reflow**, reduced motion, and forced-colours, since a longer
      province or city list changes layout.
- [ ] **Cognitive load.** A longer residency list is harder to scan for a tired or
      pain-affected user. Confirm the list stays ordered and the "another province"
      option still reads honestly about what they will see.
- [ ] **Privacy is unchanged, and say so explicitly.** A province adds catalogue data
      only; it must introduce no new persistence and no new server submission. State
      that in the evidence rather than leaving it unexamined.
- [ ] **Scope wording across search and social surfaces** — the meta description, the
      Open Graph and Twitter titles, the guide-index description, the 404 page and the
      embed all name the covered jurisdictions. A province that ships without them
      advertises coverage it does not have, or hides coverage it does.

---

## Recording the evidence

Each section is signed off separately, in the ticket, with:

- what was checked, and the command or URL used;
- the result, including explicit "no match" and "page does not state this";
- the date;
- anything deliberately **not** done, and why.

A section without recorded evidence is not passing — it is unstarted. The province
ships only when all four are passing, and `AF-S1102` (re-integrate the first
additional province) cannot ship before that.
