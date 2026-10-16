/* =============================================================================
   AbilityFinder — results presentation groups (site audit 2026-10, phase 1)

   A PURE presentation classifier. It never changes evaluate() statuses: it only
   decides where an already-evaluated program is shown. Every in-scope program
   with status "ready" or "almost" lands in exactly one group:

     g1  "Programs to check"        full cards. Every "ready" program (the
                                    "Matches your answers" set is unchanged),
                                    then "almost" programs with a route that is
                                    still open. The Disability Tax Credit's own
                                    record always stays here.
     g2  "Other programs to check"  one-line rows. "almost" programs whose ONLY
                                    remaining checks are reviewed facts the
                                    questionnaire did not ask (a registration,
                                    a card, receipt of another benefit, money
                                    already spent, who claims a credit).
     g3  "Not for your situation now" closed disclosure. ONLY definite
                                    contradictions from the person's own
                                    answers. Phase 1 has one rule: the person
                                    answered the DTC question "no" and the
                                    program needs DTC approval first.

   Status "no" programs are returned separately and untouched.

   Conservative by design: anything not on a reviewed list stays in g1. An
   unknown, skipped or "not sure" answer never moves a program to g3.
   ========================================================================== */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AbilityFinderResultsGroups = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DTC_ID = "dtc";

  /* Subject wording, matching FOR_WHO in app.js. */
  const SUBJECTS = {
    self: { subj: "you", them: "you", self: true },
    child: { subj: "your child", them: "your child", self: false },
    family: { subj: "your family member", them: "your family member", self: false },
  };
  const verb = (s, selfForm, otherForm) => (s.self ? selfForm : otherForm);

  /* Reviewed gate list for g2 (A-RESULTS-RELEVANCE.md STATUS_GATES, minus the
     three Check-this-fact pilot gates, which keep their full card so the
     optional check stays available). Each entry is a fact a person simply
     knows about their own situation and that no question asks. The phrase
     follows "If " in the row: "If you have a qualified service dog: ...".
     Gates that a program decides (medical, income review, assessor) are NOT
     here: those programs stay in g1. */
  const UNASKED_FACT_GATES = Object.freeze({
    abCapccContinuingCareHome: (s) => `${s.subj} ${verb(s, "live", "lives")} in a type A or B continuing care home`,
    abServiceDogQualified: (s) => `${s.subj} ${verb(s, "have", "has")} a qualified service dog`,
    firstNationsStatus: (s) => `${s.subj} ${verb(s, "are", "is")} First Nations with Indian status`,
    cppDisabilityContributorLink: () => "a parent gets a CPP disability benefit",
    translinkHandyCard: (s) => `${s.subj} ${verb(s, "have", "has")} a TransLink HandyCard`,
    bcTransitHandyDart: (s) => `${s.subj} ${verb(s, "are", "is")} a registered handyDART customer`,
    paraTranspoRegistered: (s) => `${s.subj} ${verb(s, "are", "is")} registered with Para Transpo`,
    aCardProof: (s) => `${s.subj} ${verb(s, "have", "has")} a CNIB or guide dog photo ID card`,
    atHomeProgram: (s) => `${s.subj} ${verb(s, "are", "is")} enrolled in the At Home Program`,
    bcFuelTaxRegistered: (s) => `${s.subj} ${verb(s, "are", "is")} registered for the fuel tax refund for persons with disabilities`,
    qualifyingRenovationSpend: () => "the renovation is done and paid for",
    hatcQualifyingRenovationSpend: () => "an accessibility renovation is done and paid for",
    bcHomeRenoSpend: () => "an accessibility renovation is done",
    mhrtcSecondaryUnit: () => "a separate unit is built so a relative can live with family",
    disabilityMedicalExpensesPaid: () => "you paid medical or disability-support costs and kept the receipts",
    ottawaOdspReceipt: (s) => `${s.subj} ${verb(s, "get", "gets")} ODSP`,
    caregiverSupportClaim: (s) => (s.self
      ? "someone who supports you claims it on their tax return"
      : `you support ${s.them} and claim it on your tax return`),
  });

  /* Phase 1 g3 rule: programs whose remaining checks include DTC approval,
     for a person who answered the DTC question "no". "unsure" or unanswered
     never counts. Programs with a DTC-or-age-65 route (HATC, MHRTC) do not use
     the "dtc" gate and are deliberately NOT moved (CODEX-CRITIQUE-A.md §3). */
  const needsDtcFirst = (r, answers) =>
    answers && answers.dtc === "no" && r.needs.some((n) => n.key === "dtc");

  function subjectFor(answers) {
    return SUBJECTS[answers && answers.forWho] || SUBJECTS.self;
  }

  function situationFor(r, answers) {
    const s = subjectFor(answers);
    const parts = [];
    for (const n of r.needs) {
      const phrase = UNASKED_FACT_GATES[n.key](s);
      if (!parts.includes(phrase)) parts.push(phrase);
    }
    return parts.join(" and ");
  }

  /* Which group one evaluated program belongs to. */
  function groupOf(e, answers) {
    const { b, r } = e;
    if (r.status === "ready") return "g1";
    if (r.status !== "almost") return "no";
    if (b.id === DTC_ID) return "g1";
    if (needsDtcFirst(r, answers)) return "g3";
    if (r.needs.length && r.needs.every((n) => Object.prototype.hasOwnProperty.call(UNASKED_FACT_GATES, n.key))) return "g2";
    return "g1";
  }

  /* Evidence order, no editorial weights: ready before almost, then fewer
     unmet checks, then name, then id (stable). */
  function compareEvidence(x, y) {
    const rank = (e) => (e.r.status === "ready" ? 0 : 1);
    return rank(x) - rank(y)
      || x.r.needs.length - y.r.needs.length
      || String(x.b.name).localeCompare(String(y.b.name), "en")
      || String(x.b.id).localeCompare(String(y.b.id), "en");
  }

  /* evaluated: [{ b, r }] already limited to the person's results scope.
     Returns new arrays; the inputs are not modified. */
  function classifyResults(evaluated, answers) {
    const out = { g1: [], g2: [], g3: [], no: [] };
    for (const e of evaluated) {
      const group = groupOf(e, answers);
      if (group === "g2") out.g2.push({ ...e, situation: situationFor(e.r, answers) });
      else if (group === "g3") out.g3.push({ ...e, reason: "dtc" });
      else out[group].push(e);
    }
    out.g1.sort(compareEvidence);
    out.g2.sort(compareEvidence);
    out.g3.sort(compareEvidence);
    return out;
  }

  return Object.freeze({ classifyResults, groupOf, compareEvidence, UNASKED_FACT_GATES, DTC_ID });
});
