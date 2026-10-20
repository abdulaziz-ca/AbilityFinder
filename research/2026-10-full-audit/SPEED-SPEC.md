# Speed: load only the programs a visitor needs (full audit, Phase 4)

## Why
Measured on live v228 (iPhone 13 profile, 4x CPU, cache off):
- 4G: ready 1.14 s. Fast 3G: ready 4.19 s, first paint 1.74 s.
- The page transfers 720 KB. `data.js` is 373 KB of that as served (Cloudflare's brotli level). It is 1.6 MB raw,
  and the `BENEFITS` array is 1.3 MB of it. A visitor only ever needs the federal set plus one province (with
  its cities).
- Every data release changes `data.js`, so returning visitors re-download all of it after each release.

Pre-compressing in the Worker is ruled out. It would route every JS request through the Worker, which counts
against the free plan's daily request quota (static assets do not), and the site's scripts would fail once the
quota ran out.

## Design: generated per-province packs; `public/data.js` stays the source of truth
1. `public/data.js` is unchanged as the editing source. Tests, `gen:guides` and `gen:context` keep reading it.
2. New generator `scripts/gen-data-packs.js` (run by a `gen:packs` npm script, and by the same procedure that
   regenerates guides) writes:
   - `public/data-core.js`: everything in `data.js` except non-federal `BENEFITS` records. That means federal
     records, BENEFIT_VALUES/META/EXTRA/VERIFIED/STATUS, GLOSSARY, HELP_ORGS, PROVINCE_NOTICES, city lists, and so
     on, all unchanged. It also adds `BENEFIT_INDEX`, one compact row per record in catalogue order
     (`[id, level, pack]`), so counts, "new since your last visit" and deep links still know every program.
   - `public/data-pack-<XX>.js` for XX in AB BC ON SK MB NB NS PE NL QC. Each file calls
     `AF_ADD_PACK("XX", [ ...records ])` with that province's provincial and city records, in catalogue order.
     A city belongs to the pack of the province whose city list it is in. Lloydminster (AB+SK) goes in both;
     `AF_ADD_PACK` dedupes by id.
3. `AF_ADD_PACK` (defined in data-core.js) inserts the records into `BENEFITS` at their catalogue positions
   (by BENEFIT_INDEX order), so the array order stays exactly what it is today.
4. `index.html` loads `data-core.js` instead of `data.js`. App code gets an async `ensurePacks(provs)` that
   injects `<script src="data-pack-XX.js?v=N">` (CSP is 'self', so this is allowed) and resolves when the
   scripts have run. It is idempotent.
5. Call sites (public/app.js; 12 direct `BENEFITS` uses today):
   - Boot: if saved answers have a province, `await ensurePacks([prov])` before the first render that needs
     results. The landing page renders without waiting.
   - Province answer chosen or changed in the wizard: start `ensurePacks` right away, and await it before
     results.
   - Browse all / catalogue, the about page counts, the "cities without local programs" help, saved
     plan/progress follow-ups, and deep links (`?start=id`, detail routes): use `BENEFIT_INDEX` for counts. For
     anything that renders records, `await ensurePacks(<the packs the ids need>)` first. Browse-all loads every
     pack.
   - Program-change tracking (`PROGRAM_CHANGE_DATA`, seenByProgram) uses `BENEFIT_INDEX` ids, not `BENEFITS`.
6. Caching: add `/data-core.js` and `/data-pack-*` to the immutable block in `public/_headers`. Add them to the
   data-procedure guard (`test/data-procedure.test.js`) so a content change without a `?v` bump fails CI,
   like the other versioned assets.
7. Keep a kill switch: `const DATA_PACKS = true;` in app.js. When false, index.html's fallback loads the full
   `data.js` and `ensurePacks` resolves immediately. The full `data.js` stays deployed.

## Acceptance
- `npm test` passes (add a test: core + all packs reproduce exactly the `BENEFITS` array of data.js, ids
  and order identical, deep-equal records). Add a test that every pack file is regenerated (no drift).
- Full Playwright suite passes on chromium, firefox and webkit, run on its own.
- `D-perf.js` and the network script show the first-visit transfer for an Ontario visitor at least 200 KB
  smaller, with no regression in results render time.
- No visible design change.
