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
                                    answers, as "needed first" rows: DTC
                                    approval (DTC answered "no"), and an
                                    autism diagnosis for three programs
                                    (PREREQ_RULES).

     g0  "You already get"           one-line rows (phase 2). Programs the
                                    person says they already get, whatever
                                    their status. Removed from every other
                                    group, including "no", so a recipient is
                                    never told to check, or that they do not
                                    qualify for, a program they get.

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

  /* Gates that only ask whether the person gets a program the "already get"
     question covers. When they said they get it, that condition is known, so
     the program is no longer an "If you get ..." row: it keeps its full card
     in g1 with its remaining proof checks. The gate itself is never marked met. */
  const RECEIPT_GATES = Object.freeze({ ottawaOdspReceipt: "odsp" });

  /* Phase 1 g3 rule: programs whose remaining checks include DTC approval,
     for a person who answered the DTC question "no". "unsure" or unanswered
     never counts. Programs with a DTC-or-age-65 route (HATC, MHRTC) do not use
     the "dtc" gate and are deliberately NOT moved (CODEX-CRITIQUE-A.md §3). */
  const needsDtcFirst = (r, answers) =>
    answers && answers.dtc === "no" && r.needs.some((n) => n.key === "dtc");

  /* Further "needed first" rules (site audit, reviewed one gate class at a
     time). Each applies ONLY to the listed programs, each checked against its
     official page: the program has no route that works without the missing
     step (research/2026-10-site-audit/G3-RULES.md). The answer must be the
     definite "no" option; "not sure", skipped or unasked never counts. These
     are prerequisites, not refusals: the row says what is needed first. */
  const PREREQ_RULES = Object.freeze([
    /* Both BC pages: "In order to apply for funding, ensure you have had an
       assessment and diagnosis." OAP: "To register ... your child must ...
       have a written diagnosis of autism from a qualified professional." */
    {
      reason: "autism",
      gates: ["autismDiagnosis", "oapDiagnosis"],
      when: (a) => a.autismDiagnosis === "no",
      programs: ["bc-autism-funding-under-6", "bc-autism-funding-6-18", "ontario-autism-program"],
    },
  ]);
  function prereqReason(b, r, answers) {
    if (!answers) return null;
    for (const rule of PREREQ_RULES) {
      if (rule.programs.includes(b.id) && rule.when(answers) && r.needs.some((n) => rule.gates.includes(n.key))) return rule.reason;
    }
    return null;
  }

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
  /* Why a program is in g3: "dtc" first, then the first matching PREREQ_RULES entry. */
  function laterReason(e, answers) {
    if (needsDtcFirst(e.r, answers)) return "dtc";
    return prereqReason(e.b, e.r, answers);
  }

  function groupOf(e, answers, received = []) {
    const { b, r } = e;
    if (received.includes(b.id)) return "g0";
    if (r.status === "ready") return "g1";
    if (r.status !== "almost") return "no";
    if (b.id === DTC_ID) return "g1";
    if (laterReason(e, answers)) return "g3";
    const unasked = (n) => Object.prototype.hasOwnProperty.call(UNASKED_FACT_GATES, n.key)
      && !(RECEIPT_GATES[n.key] && received.includes(RECEIPT_GATES[n.key]));
    if (r.needs.length && r.needs.every(unasked)) return "g2";
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
     received: benefit ids the person says they already get (validated by the
     caller). Returns new arrays; the inputs are not modified. */
  function classifyResults(evaluated, answers, received = []) {
    const out = { g0: [], g1: [], g2: [], g3: [], no: [] };
    for (const e of evaluated) {
      const group = groupOf(e, answers, received);
      if (group === "g2") out.g2.push({ ...e, situation: situationFor(e.r, answers) });
      else if (group === "g3") out.g3.push({ ...e, reason: laterReason(e, answers) });
      else out[group].push(e);
    }
    out.g0.sort(compareEvidence);
    out.g1.sort(compareEvidence);
    out.g2.sort(compareEvidence);
    out.g3.sort(compareEvidence);
    return out;
  }

  return Object.freeze({ classifyResults, groupOf, compareEvidence, UNASKED_FACT_GATES, RECEIPT_GATES, PREREQ_RULES, DTC_ID });
});
