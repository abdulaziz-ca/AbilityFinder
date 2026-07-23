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
    "situation",
    "income",
    "city",
  ];
  const A11Y_KEYS = ["spacing", "contrast", "links", "guide", "motion"];
  const HELP_TOPICS = ["disabilities", "documentation", "autismAssessment", "functionalNeeds", "msp", "bcAssistance", "circumstances", "dtc"];
  const VIEWS = new Set(["landing", "wizard", "results", "browse", "detail", "privacy", "about", "support", "updates", "help", "accessibility", "professionals", "partner-overview", "impact", "dtc-prep", "grants", "organizations"]);
  const BROWSE_LEVELS = new Set(["all", "Federal", "Alberta", "local"]);
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
    if (key === "disabilities" || key === "situation" || key === "functionalNeeds" || key === "circumstances") {
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
    if (!["AB", "BC"].includes(clean.province)) clean.city = null;
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

  function buildPersistedState(live = {}) {
    const validSelections = live.validSelections || {};
    const answers = cleanAnswers(live.answers, {}, validSelections);
    const benefitIds = allowedValues(validSelections, "benefitIds");
    return {
      schemaVersion: 1,
      answers,
      view: VIEWS.has(live.view) ? live.view : "landing",
      stepIndex: Number.isInteger(live.stepIndex) && live.stepIndex >= 0 ? live.stepIndex : 0,
      detailId: typeof live.detailId === "string" && (!benefitIds || benefitIds.has(live.detailId)) ? live.detailId : null,
      detailFrom: live.detailFrom === "browse" ? "browse" : "results",
      helpTopic: HELP_TOPICS.includes(live.helpTopic) ? live.helpTopic : null,
      helpReturnStep: Number.isInteger(live.helpReturnStep) && live.helpReturnStep >= 0 ? live.helpReturnStep : 0,
      progress: cleanProgress(live.progress, validSelections),
      ui: {
        groupMode: live.groupMode === "category" ? "category" : "priority",
        browseQuery: typeof live.browseQuery === "string" ? live.browseQuery.slice(0, 200) : "",
        browseTheme: BROWSE_THEMES.has(live.browseTheme) ? live.browseTheme : "all",
        browseLevel: BROWSE_LEVELS.has(live.browseLevel) ? live.browseLevel : "all",
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
    const benefitIds = allowedValues(validSelections, "benefitIds");
    return {
      answers: cleanAnswers(source.answers, defaults.answers || {}, validSelections),
      view: restoredView === "help" && !helpTopic ? "wizard" : restoredView,
      stepIndex: Number.isInteger(source.stepIndex) && source.stepIndex >= 0 ? source.stepIndex : 0,
      detailId: typeof source.detailId === "string" && (!benefitIds || benefitIds.has(source.detailId)) ? source.detailId : null,
      detailFrom: source.detailFrom === "browse" ? "browse" : "results",
      helpTopic,
      helpReturnStep: Number.isInteger(source.helpReturnStep) && source.helpReturnStep >= 0 ? source.helpReturnStep : 0,
      progress: cleanProgress(source.progress, validSelections),
      groupMode: ui.groupMode === "category" ? "category" : "priority",
      browseQuery: typeof ui.browseQuery === "string" ? ui.browseQuery.slice(0, 200) : "",
      browseTheme: BROWSE_THEMES.has(ui.browseTheme) ? ui.browseTheme : "all",
      browseLevel: BROWSE_LEVELS.has(ui.browseLevel) ? ui.browseLevel : "all",
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

  return { StateChangeEmitter, buildPersistedState, restorePersistedState, sanitizeLegacyState };
});
