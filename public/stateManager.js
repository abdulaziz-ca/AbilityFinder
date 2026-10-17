/* =============================================================================
   AbilityFinder — persisted-state boundary + internal change events

   This module defines exactly which in-memory values may reach IndexedDB. Free-
   text practitioner searches, assistant messages, functions, DOM state and any
   unknown properties are intentionally excluded.
   ========================================================================== */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AbilityFinderState = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  // Reviewed against GRT snapshots fetched 2026-10-16. No shared/unscoped facts.
  const FACT_REGISTRY = Object.freeze({
    "grt-taxi-coupons": { mobilityplusRegistered: { version: 2, components: {
      registered: "Are you currently registered with MobilityPLUS?"
    }, help: "Taxi coupons are for travel within Cambridge, Kitchener and Waterloo. Customers with seasonal eligibility may only purchase during active registration periods. Customers on MobilityPLUS North Dumfries or Kiwanis Transit services are not eligible for taxi coupons." } },
    "grt-cnib-pass": { cnibCustomer: { version: 1, components: {
      customer: "Are you a CNIB customer?"
    }, help: "This asks about your CNIB customer status, not your vision." } },
    "grt-affordable-transit": { atpApproval: { version: 2, components: {
      approved: "Are you currently approved by the Region of Waterloo for the Affordable Transit Program?"
    }, help: "Applying is not the same as being approved. Check that your approval is still current; ATP eligibility lasts one year." } },
  });
  const plainFactObject = value => value && typeof value === "object" && !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
  function cleanConfirmedFacts(candidate) {
    const clean = {};
    try {
      if (!plainFactObject(candidate) || Object.keys(candidate).length > 3) return clean;
      for (const [id, gates] of Object.entries(FACT_REGISTRY)) {
        if (!Object.prototype.hasOwnProperty.call(candidate, id)) continue;
        const input = candidate[id];
        if (!plainFactObject(input) || Object.keys(input).length > Object.keys(gates).length) continue;
        for (const [key, definition] of Object.entries(gates)) {
          if (!Object.prototype.hasOwnProperty.call(input, key)) continue;
          const fact = input[key];
          if (!plainFactObject(fact) || Object.keys(fact).length !== 2 ||
              !Number.isInteger(fact.version) || fact.version !== definition.version ||
              !plainFactObject(fact.components) ||
              Object.keys(fact.components).length > Object.keys(definition.components).length) continue;
          const components = {};
          let valid = true;
          for (const [component, value] of Object.entries(fact.components)) {
            if (!Object.prototype.hasOwnProperty.call(definition.components, component) ||
                !["yes", "no", "unsure"].includes(value)) { valid = false; break; }
            components[component] = value;
          }
          if (valid) { clean[id] ||= {}; clean[id][key] = { version: fact.version, components }; }
        }
      }
    } catch (_) { return {}; }
    return clean;
  }
  function confirmedGatePasses(id, key, candidate) {
    const definition = Object.prototype.hasOwnProperty.call(FACT_REGISTRY, id) && FACT_REGISTRY[id][key];
    const fact = cleanConfirmedFacts(candidate)[id]?.[key];
    return !!(definition && fact && Object.keys(definition.components).every(c => fact.components[c] === "yes"));
  }

  const ANSWER_KEYS = [
    "forWho",
    "disabilities",
    "ageBand",
    "ageGroup",
    "disabilityVerified",
    "autismDiagnosis",
    "onsetBefore18",
    "canWalkFar",
    "functionalNeeds",
    "province",
    "msp",
    "bcAssistance",
    "circumstances",
    "citizenPR",
    "dtc",
    "receives",
    "situation",
    "income",
    "city",
  ];
  const A11Y_KEYS = ["spacing", "contrast", "links", "guide", "motion"];
  const HELP_TOPICS = ["disabilities", "documentation", "autismAssessment", "functionalNeeds", "msp", "bcAssistance", "circumstances", "dtc"];
  const VIEWS = new Set(["landing", "wizard", "results", "browse", "detail", "privacy", "about", "coverage", "support", "updates", "help", "accessibility", "professionals", "partner-overview", "impact", "dtc-prep", "grants", "organizations"]);
  const BROWSE_LEVELS = new Set(["all", "Federal", "Alberta", "British Columbia", "local"]);
  const BROWSE_THEMES = new Set(["all", "money", "health", "getting-around", "employment", "education", "family"]);

  function copyJson(value, fallback) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return fallback;
    }
  }

  function answerValueIsValid(key, value) {
    if (value === null) return true;
    if (key === "disabilities" || key === "situation" || key === "functionalNeeds" || key === "circumstances" || key === "receives") {
      return Array.isArray(value) && value.every((item) => typeof item === "string");
    }
    if (key === "onsetBefore18" || key === "canWalkFar" || key === "citizenPR") {
      return typeof value === "boolean";
    }
    if (typeof value !== "string") return false;
    if (key === "forWho") return ["self", "child", "family"].includes(value);
    if (key === "ageGroup") return ["child", "adult", "senior"].includes(value);
    if (key === "ageBand") return ["under6", "6to11", "12to15", "16to17", "18", "19to59", "60to64", "65plus"].includes(value);
    if (key === "dtc") return ["yes", "no", "unsure"].includes(value);
    if (["disabilityVerified", "autismDiagnosis", "msp"].includes(key)) return ["yes", "no", "unsure"].includes(value);
    if (key === "bcAssistance") return ["pwd", "other", "none", "unsure"].includes(value);
    if (key === "income") return ["low", "moderate", "high"].includes(value);
    return true;
  }

  function allowedValues(validSelections, key) {
    const values = validSelections && validSelections[key];
    return Array.isArray(values) ? new Set(values) : null;
  }

  function cleanAnswers(candidate, defaults, validSelections = {}) {
    const clean = copyJson(defaults || {}, {});
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return clean;
    ANSWER_KEYS.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(candidate, key) && answerValueIsValid(key, candidate[key])) {
        const selectionKey = { ageBand: "ageBands", situation: "situations", province: "provinces", city: "cities" }[key] || key;
        const allowed = allowedValues(validSelections, selectionKey);
        if (Array.isArray(candidate[key])) {
          clean[key] = allowed
            ? candidate[key].filter((value) => allowed.has(value))
            : copyJson(candidate[key], clean[key]);
        } else if (!allowed || candidate[key] === null || allowed.has(candidate[key])) {
          clean[key] = copyJson(candidate[key], clean[key]);
        }
      }
    });
    const byProvince = validSelections && validSelections.citiesByProvince;
    const provinceCities = byProvince && byProvince[clean.province];
    if (!Array.isArray(provinceCities) || !provinceCities.includes(clean.city)) clean.city = null;
    return clean;
  }

  function cleanA11y(candidate) {
    const clean = { fontScale: 1, spacing: false, contrast: false, links: false, guide: false, motion: false };
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return clean;
    if (typeof candidate.fontScale === "number" && Number.isFinite(candidate.fontScale) && candidate.fontScale >= 0.9 && candidate.fontScale <= 1.6) {
      clean.fontScale = candidate.fontScale;
    }
    A11Y_KEYS.forEach((key) => {
      if (typeof candidate[key] === "boolean") clean[key] = candidate[key];
    });
    return clean;
  }

  function cleanProgress(candidate, validSelections = {}) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return {};
    const clean = {};
    const benefitIds = allowedValues(validSelections, "benefitIds");
    const stages = allowedValues(validSelections, "progressStages");
    Object.keys(candidate).forEach((key) => {
      if (
        typeof candidate[key] === "string" &&
        (!benefitIds || benefitIds.has(key)) &&
        (!stages || stages.has(candidate[key]))
      ) clean[key] = candidate[key];
    });
    return clean;
  }

  // Feature markers are all-or-nothing: corruption must never invent history.
  function cleanProgramChanges(candidate, validSelections = {}) {
    const plain = (value) => value && typeof value === "object" && !Array.isArray(value) &&
      (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
    const ids = allowedValues(validSelections, "benefitIds");
    const watermark = validSelections.programChangeWatermark;
    if (!plain(candidate) || !ids || !Number.isSafeInteger(watermark) || watermark < 0 ||
        Object.keys(candidate).length !== 2 || candidate.version !== 1 ||
        !Object.prototype.hasOwnProperty.call(candidate, "seenByProgram") || !plain(candidate.seenByProgram)) return null;
    const keys = Object.keys(candidate.seenByProgram);
    if (keys.length > ids.size) return null;
    const seenByProgram = {};
    for (const id of keys) {
      const revision = candidate.seenByProgram[id];
      if (!ids.has(id) || !Number.isSafeInteger(revision) || revision < 0 || revision > watermark) return null;
      Object.defineProperty(seenByProgram, id, { value: revision, enumerable: true, writable: true, configurable: true });
    }
    return { version: 1, seenByProgram };
  }

  function buildPersistedState(live = {}) {
    const validSelections = live.validSelections || {};
    const answers = cleanAnswers(live.answers, {}, validSelections);
    const benefitIds = allowedValues(validSelections, "benefitIds");
    return {
      schemaVersion: 2,
      confirmedFacts: cleanConfirmedFacts(live.confirmedFacts),
      answers,
      view: VIEWS.has(live.view) ? live.view : "landing",
      stepIndex: Number.isInteger(live.stepIndex) && live.stepIndex >= 0 ? live.stepIndex : 0,
      detailId: typeof live.detailId === "string" && (!benefitIds || benefitIds.has(live.detailId)) ? live.detailId : null,
      detailFrom: live.detailFrom === "browse" ? "browse" : "results",
      helpTopic: HELP_TOPICS.includes(live.helpTopic) ? live.helpTopic : null,
      helpReturnStep: Number.isInteger(live.helpReturnStep) && live.helpReturnStep >= 0 ? live.helpReturnStep : 0,
      progress: cleanProgress(live.progress, validSelections),
      ui: {
        programChanges: cleanProgramChanges(live.programChanges, validSelections),
        groupMode: live.groupMode === "category" ? "category" : "priority",
        browseQuery: typeof live.browseQuery === "string" ? live.browseQuery.slice(0, 200) : "",
        browseTheme: BROWSE_THEMES.has(live.browseTheme) ? live.browseTheme : "all",
        browseLevel: (allowedValues(validSelections, "browseLevels") || BROWSE_LEVELS).has(live.browseLevel) ? live.browseLevel : "all",
        browseDis: live.browseDis === "all" || (allowedValues(validSelections, "disabilities") || new Set()).has(live.browseDis)
          ? live.browseDis
          : "all",
        a11y: cleanA11y(live.a11y),
        lang: live.lang === "fr" ? "fr" : "en",
        theme: live.theme === "light" ? "light" : "dark",
        askConsent: live.askConsent === true,
      },
    };
  }

  function restorePersistedState(saved = {}, defaults = {}) {
    const source = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    const ui = source.ui && typeof source.ui === "object" && !Array.isArray(source.ui) ? source.ui : {};
    const validSelections = defaults.validSelections || {};
    const helpTopic = HELP_TOPICS.includes(source.helpTopic) ? source.helpTopic : null;
    const restoredView = VIEWS.has(source.view) ? source.view : "landing";
    const disabilities = allowedValues(validSelections, "disabilities");
    const browseLevels = allowedValues(validSelections, "browseLevels") || BROWSE_LEVELS;
    const benefitIds = allowedValues(validSelections, "benefitIds");
    return {
      confirmedFacts: cleanConfirmedFacts(source.confirmedFacts),
      answers: cleanAnswers(source.answers, defaults.answers || {}, validSelections),
      view: restoredView === "help" && !helpTopic ? "wizard" : restoredView,
      stepIndex: Number.isInteger(source.stepIndex) && source.stepIndex >= 0 ? source.stepIndex : 0,
      detailId: typeof source.detailId === "string" && (!benefitIds || benefitIds.has(source.detailId)) ? source.detailId : null,
      detailFrom: source.detailFrom === "browse" ? "browse" : "results",
      helpTopic,
      helpReturnStep: Number.isInteger(source.helpReturnStep) && source.helpReturnStep >= 0 ? source.helpReturnStep : 0,
      progress: cleanProgress(source.progress, validSelections),
      programChanges: cleanProgramChanges(ui.programChanges, validSelections),
      groupMode: ui.groupMode === "category" ? "category" : "priority",
      browseQuery: typeof ui.browseQuery === "string" ? ui.browseQuery.slice(0, 200) : "",
      browseTheme: BROWSE_THEMES.has(ui.browseTheme) ? ui.browseTheme : "all",
      browseLevel: browseLevels.has(ui.browseLevel) ? ui.browseLevel : "all",
      browseDis: ui.browseDis === "all" || (disabilities && disabilities.has(ui.browseDis)) ? ui.browseDis : "all",
      a11y: cleanA11y(ui.a11y),
      lang: ui.lang === "fr" ? "fr" : "en",
      theme: ui.theme === "light" || ui.theme === "dark"
        ? ui.theme
        : defaults.theme === "light" ? "light" : "dark",
      askConsent: ui.askConsent === true,
    };
  }

  function sanitizeLegacyState(legacy = {}, validSelections = {}) {
    const source = legacy && typeof legacy === "object" && !Array.isArray(legacy) ? legacy : {};
    const ui = source.ui && typeof source.ui === "object" && !Array.isArray(source.ui) ? source.ui : {};
    return buildPersistedState({
      answers: source.answers,
      view: source.view,
      stepIndex: source.stepIndex,
      detailId: source.detailId,
      detailFrom: source.detailFrom,
      helpTopic: source.helpTopic,
      helpReturnStep: source.helpReturnStep,
      progress: source.progress,
      groupMode: source.groupMode === "category" ? "category" : ui.groupMode,
      browseQuery: ui.browseQuery,
      browseTheme: ui.browseTheme,
      browseLevel: ui.browseLevel,
      browseDis: ui.browseDis,
      a11y: ui.a11y,
      lang: ui.lang,
      theme: ui.theme,
      askConsent: ui.askConsent,
      validSelections,
    });
  }

  class StateChangeEmitter {
    constructor() {
      this.listeners = new Set();
    }

    subscribe(listener) {
      if (typeof listener !== "function") throw new TypeError("State listener must be a function");
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    emit(reason) {
      this.listeners.forEach((listener) => {
        try {
          listener(reason);
        } catch (error) {
          if (root && root.console && typeof root.console.error === "function") {
            root.console.error("AbilityFinder state listener failed:", error);
          }
        }
      });
    }
  }

  return { FACT_REGISTRY, cleanConfirmedFacts, confirmedGatePasses, cleanProgramChanges, StateChangeEmitter, buildPersistedState, restorePersistedState, sanitizeLegacyState };
});
