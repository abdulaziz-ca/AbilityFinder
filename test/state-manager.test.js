"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  StateChangeEmitter,
  buildPersistedState,
  restorePersistedState,
  sanitizeLegacyState,
} = require("../public/stateManager.js");

const validSelections = {
  disabilities: ["physical", "autism", "other"],
  ageBands: ["under6", "6to11", "19to59"],
  situations: ["elementary", "student", "working", "none"],
  functionalNeeds: ["dailyLiving", "equipment", "none", "unsure"],
  circumstances: ["homeowner", "vehicleOwner", "none", "unsure"],
  provinces: ["AB", "BC", "other"],
  cities: ["Calgary", "Edmonton", "Vancouver"],
  benefitIds: ["dtc", "aish"],
  progressStages: ["saved", "submitted"],
};

const blankAnswers = () => ({
  forWho: null,
  disabilities: [],
  ageBand: null,
  ageGroup: null,
  disabilityVerified: null,
  autismDiagnosis: null,
  onsetBefore18: null,
  canWalkFar: null,
  functionalNeeds: [],
  province: null,
  msp: null,
  bcAssistance: null,
  circumstances: [],
  citizenPR: null,
  dtc: null,
  situation: [],
  income: null,
  city: null,
  postal: null,
  retroYears: 5,
});

function liveState() {
  return {
    answers: {
      ...blankAnswers(),
      forWho: "self",
      disabilities: ["physical"],
      citizenPR: true,
      income: "low",
      postal: "T2P 1J9",
      untrusted: "must not persist",
    },
    view: "browse",
    stepIndex: 3,
    detailId: "dtc",
    detailFrom: "browse",
    progress: { dtc: "submitted" },
    groupMode: "category",
    browseQuery: "tax",
    browseTheme: "money",
    browseLevel: "Federal",
    browseDis: "physical",
    a11y: { fontScale: 1.2, spacing: true, contrast: false, links: true, guide: false, motion: true },
    lang: "fr",
    theme: "light",
    askConsent: true,
    askHistory: [{ role: "user", content: "private question" }],
    calculate: () => "not state",
    validSelections,
  };
}

test("buildPersistedState whitelists app selections and excludes free-text/private runtime context", () => {
  const saved = buildPersistedState(liveState());

  assert.equal(saved.schemaVersion, 1);
  assert.equal(saved.answers.forWho, "self");
  assert.equal(saved.answers.citizenPR, true);
  assert.deepEqual(saved.answers.disabilities, ["physical"]);
  assert.equal("postal" in saved.answers, false);
  assert.equal("untrusted" in saved.answers, false);
  assert.equal("askHistory" in saved, false);
  assert.equal("calculate" in saved, false);
  assert.deepEqual(saved.progress, { dtc: "submitted" });
  assert.deepEqual(saved.ui, {
    groupMode: "category",
    browseQuery: "tax",
    browseTheme: "money",
    browseLevel: "Federal",
    browseDis: "physical",
    a11y: { fontScale: 1.2, spacing: true, contrast: false, links: true, guide: false, motion: true },
    lang: "fr",
    theme: "light",
    askConsent: true,
  });
});

test("restorePersistedState returns clean defaults when no initial data exists", () => {
  const restored = restorePersistedState({}, {
    answers: blankAnswers(),
    theme: "dark",
  });

  assert.deepEqual(restored.answers, blankAnswers());
  assert.equal(restored.view, "landing");
  assert.equal(restored.stepIndex, 0);
  assert.equal(restored.detailId, null);
  assert.deepEqual(restored.progress, {});
  assert.equal(restored.groupMode, "priority");
  assert.equal(restored.browseTheme, "all");
  assert.equal(restored.browseLevel, "all");
  assert.equal(restored.browseDis, "all");
  assert.equal(restored.lang, "en");
  assert.equal(restored.theme, "dark");
  assert.equal(restored.askConsent, false);
});

test("restorePersistedState rejects malformed values that could break rendering", () => {
  const restored = restorePersistedState({
    answers: {
      forWho: { bad: true },
      disabilities: "physical",
      citizenPR: "yes",
      retroYears: 99,
    },
    view: "made-up-view",
    stepIndex: -4,
    detailId: 123,
    detailFrom: "elsewhere",
    progress: ["not-an-object"],
    ui: {
      groupMode: "sideways",
      browseQuery: { bad: true },
      browseLevel: "International",
      a11y: { fontScale: 100, spacing: "yes" },
      lang: "es",
      theme: "neon",
      askConsent: "true",
    },
  }, { answers: blankAnswers(), theme: "light", validSelections });

  assert.deepEqual(restored.answers, blankAnswers());
  assert.equal(restored.view, "landing");
  assert.equal(restored.stepIndex, 0);
  assert.equal(restored.detailId, null);
  assert.equal(restored.groupMode, "priority");
  assert.equal(restored.browseQuery, "");
  assert.equal(restored.browseLevel, "all");
  assert.equal(restored.a11y.fontScale, 1);
  assert.equal(restored.a11y.spacing, false);
  assert.equal(restored.lang, "en");
  assert.equal(restored.theme, "light");
  assert.equal(restored.askConsent, false);
});

test("restorePersistedState rejects unknown catalog selections and progress IDs", () => {
  const restored = restorePersistedState({
    answers: {
      ...blankAnswers(),
      disabilities: ["physical", "made-up"],
      situation: ["working", "made-up"],
      province: "made-up",
      city: "Not A Place",
    },
    progress: { dtc: "submitted", fakeBenefit: "submitted", aish: "made-up" },
    ui: { browseDis: "made-up" },
  }, { answers: blankAnswers(), theme: "dark", validSelections });

  assert.deepEqual(restored.answers.disabilities, ["physical"]);
  assert.deepEqual(restored.answers.situation, ["working"]);
  assert.equal(restored.answers.province, null);
  assert.equal(restored.answers.city, null);
  assert.deepEqual(restored.progress, { dtc: "submitted" });
  assert.equal(restored.browseDis, "all");
});

test("restorePersistedState preserves a valid BC city and new conservative matching answers", () => {
  const restored = restorePersistedState({
    answers: {
      ...blankAnswers(),
      forWho: "child",
      disabilities: ["physical"],
      ageBand: "6to11",
      ageGroup: "child",
      disabilityVerified: "yes",
      functionalNeeds: ["equipment"],
      province: "BC",
      msp: "yes",
      bcAssistance: "none",
      circumstances: ["none"],
      situation: ["elementary"],
      city: "Vancouver",
    },
  }, { answers: blankAnswers(), theme: "dark", validSelections });

  assert.equal(restored.answers.province, "BC");
  assert.equal(restored.answers.city, "Vancouver");
  assert.equal(restored.answers.ageBand, "6to11");
  assert.deepEqual(restored.answers.functionalNeeds, ["equipment"]);
  assert.deepEqual(restored.answers.situation, ["elementary"]);
});

test("sanitizeLegacyState applies the whitelist and preserves supported legacy UI state", () => {
  const migrated = sanitizeLegacyState({
    answers: {
      ...blankAnswers(),
      forWho: "self",
      income: "low",
      postal: "T2P 1J9",
      unexpected: "private",
    },
    view: "results",
    groupMode: "category",
    ui: { theme: "light", askConsent: true },
    unexpectedRoot: "private",
  }, validSelections);

  assert.equal(migrated.answers.postal, undefined);
  assert.equal(migrated.answers.unexpected, undefined);
  assert.equal(migrated.unexpectedRoot, undefined);
  assert.equal(migrated.ui.groupMode, "category");
  assert.equal(migrated.ui.theme, "light");
  assert.equal(migrated.ui.askConsent, true);
});

test("StateChangeEmitter notifies every subscriber and supports unsubscribe", () => {
  const events = new StateChangeEmitter();
  const seen = [];
  const unsubscribe = events.subscribe((reason) => seen.push(`first:${reason}`));
  events.subscribe((reason) => seen.push(`second:${reason}`));

  events.emit("answer-change");
  unsubscribe();
  events.emit("filter-change");

  assert.deepEqual(seen, [
    "first:answer-change",
    "second:answer-change",
    "second:filter-change",
  ]);
});
