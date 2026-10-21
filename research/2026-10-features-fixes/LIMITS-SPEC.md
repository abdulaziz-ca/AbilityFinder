# Feature: "What this list can't tell you" (#245), owner pick 2026-10-20

## Goal
Nobody leaves the results thinking the site checked every program or decided their eligibility. A short,
closed-by-default panel separates three limits, using copy written here (do not reword it).

## Results page (`renderResults()` in public/app.js)
Place a `<details class="limits-panel">` after the last results group and directly before the existing
`<p class="disclaimer">`. Use the existing disclosure styling, the one used for the "Not for your situation now"
group. Add no new colours or fonts, and keep CSS minimal.

- `<summary>`: **What this list can't tell you**
- Body, a `<ul>` with three items. Each item has a bold lead phrase, then the sentence:
  1. **Programs we have not added yet.** We include selected programs in each province, not every one.
     <button class="linklike" data-nav="coverage">See what we don't cover yet</button>
     (wire it the way the existing `data-nav` coverage links are wired).
  2. **Whether you will be approved.** Each program makes its own decision, often using medical or income
     details we do not ask for.
  3. **Details we did not ask about.** Some programs depend on things like your exact income, savings or
     housing.
     - When the "Other programs to check" group is shown, append: "The ones we know about are under Other
       programs to check."
     - Otherwise append nothing.

French (i18n, same keys, used when the interface is in French):
- summary: **Ce que cette liste ne peut pas vous dire**
- 1. **Les programmes que nous n'avons pas encore ajoutés.** Nous incluons une sélection de programmes dans
  chaque province, pas tous. / bouton : « Voir ce que nous ne couvrons pas encore »
- 2. **Si votre demande sera acceptée.** Chaque programme prend sa propre décision, souvent à partir de
  renseignements médicaux ou financiers que nous ne demandons pas.
- 3. **Les détails que nous n'avons pas demandés.** Certains programmes dépendent par exemple de votre revenu
  exact, de votre épargne ou de votre logement. / ajout : « Ceux que nous connaissons figurent sous D'autres
  programmes à vérifier. »

## Program guide (app `renderDetail` and static guides from `scripts/gen-guide-pages.js`)
One short paragraph at the end of the eligibility section (app) or the guide's eligibility block (static),
before "How to apply":
- EN: **What this guide can't tell you:** whether you will be approved. The program decides, often using
  details we do not ask for.
- FR (static guides with `lang: "fr"` records use GUIDE_LABELS.fr): **Ce que ce guide ne peut pas vous
  dire :** si votre demande sera acceptée. Le programme décide, souvent à partir de renseignements que nous ne
  demandons pas.

## Do not
- Do not change any group, status, count or ordering, and do not touch resultsGroups.js.
- Do not add the panel to the landing, browse or print views.
- Do not edit public/data.js.

## Tests
- Unit: the results HTML for a typical profile contains one `.limits-panel` with the three lead phrases, and
  it is not open by default. The "Other programs to check" sentence appears only when that group renders. The
  detail HTML contains the guide sentence once.
- e2e (chromium): open the panel on results with the keyboard (Tab to the summary, Enter). The coverage
  button navigates to the coverage view. In French, the summary text is the French string. A static guide
  page contains the guide sentence.
- The readability and density ratchets must still pass. The guide sentence is short; if a ratchet trips,
  report it rather than rewording the copy.
- `npm test` passes. Run only your new spec with `--project=app-chromium`, and check port 8766 first
  (`lsof -nP -iTCP:8766 -sTCP:LISTEN`); stop it if another checkout owns it.

## Versioning
Bump `?v=` by one in `public/index.html` and in the `dataAssetVersion()` fallback in app.js, then run
`npm run gen:guides`. This is not a data change, so add no changelog entry unless the data-procedure test
requires one. Commit on the branch with a message ending
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do not push.
