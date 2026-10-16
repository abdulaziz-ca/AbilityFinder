#!/usr/bin/env node
/* Results-relevance audit (2026-10 site audit, part A). READ-ONLY.
   Runs the production matcher (public/app.js evaluate/evaluateAnswers, loaded
   in a vm by load-engine.js) for realistic personas, reproduces the results
   page's grouping and order, and classifies WHY each "More to check" program
   is not ready. Then runs a prototype tier classifier (option A) on the same
   data to give before/after counts.

   usage: node research/2026-10-site-audit/tools/measure-relevance.js [--json out.json] [--walk P01,P03]
*/
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "../../..");
const { loadEngine } = require("./load-engine");
const { GATES } = require(path.join(ROOT, "e2e/oracle/oracle-spec.js"));
const PERSONAS = require("./personas");
const E = loadEngine(ROOT);

/* #208 source-reading triage of always-false gates (EXTERNAL / ANSWERABLE / MISFILED). */
const TRIAGE = {};
for (const l of fs.readFileSync(path.join(ROOT, "research/208-unmet-layout/CODEX-PROPOSAL.md"), "utf8").split("\n")) {
  const m = /^\| `(\w+)` \(\d+\) \| (\w+) \|/.exec(l);
  if (m) TRIAGE[m[1]] = m[2];
}
/* Always-false gates added after #208's triage; classified here by reading their unmet text. */
const LATE_TRIAGE = {
  waterlooMobilityPlusTransit: "EXTERNAL", yorkRecreationFamilyRoute: "ANSWERABLE", hatcQualifyingRenovationSpend: "ANSWERABLE",
  exciseMobilityImpairment: "EXTERNAL", okotoksResidency: "ANSWERABLE", fortsaskIncomeRoute: "ANSWERABLE",
  bcMedTransportRoute: "ANSWERABLE", bcAtHomeMedicalRoute: "EXTERNAL", bcClbcStream: "EXTERNAL", bcHomeRenoSpend: "ANSWERABLE",
  bcVehicleDisabilityRoute: "ANSWERABLE", surreyLeisureRoute: "ANSWERABLE", burnabyFairPlayRoute: "ANSWERABLE",
};
const triage = (k) => TRIAGE[k] || LATE_TRIAGE[k] || (GATES[k] && GATES[k].evidence === "scoped-fact" ? "ANSWERABLE" : "EXTERNAL");

/* Answer-driven soft gates whose unmet state is a "pathway step" the person can
   take (apply for the DTC, get documentation, get PWD designation, finish a
   diagnosis) as opposed to a plain mismatch with their described situation. */
const STEP_GATES = new Set(["dtc", "disabilityDoc", "bcWorkAbleSelfIdentify", "bcPwdStatus", "bcBusPassStatus", "oapDiagnosis", "autismDiagnosis",
  "hatcQualifyingPerson", "mhrtcQualifyingIndividual"]);

/* Analysis-only judgement (NOT an engine fact): always-false gates whose own
   published criterion is contradicted by a definite answer. Thresholds are the
   ones quoted in each gate's unmet text (public/app.js). Conservative: an income
   band contradicts only when the WHOLE band lies above the LARGEST published
   threshold (any family size); routes through non-income-tested benefits
   (CPP-D, DTC, FSCD...) are never treated as contradicted. */
const BAND_FLOOR = { low: 0, moderate: 35000, high: 80000 };
const INCOME_CEILING = {
  // gate: largest published ceiling across family sizes (or null when needs-tested with no ceiling ≥ $80k)
  acsdIncome: 77640, odspFinancial: 50000, aishFinancial: 50000, adapFinancial: 50000, adultHealthIncome: 60000,
  bcSupplementaryBenefitsEligibility: 42000, planGClinicalAndFinancialNeed: 42000, bcHealthyKidsIncome: 42000,
  bcDisabilityAssistanceFinancial: 50000, bcPwdDesignationFinancial: 50000, coquitlamIncome: 72715, cwbEligibility: 60000,
  lowIncomeOrDisabilityIncome: 80000, municipalProgramEligibility: 80000, p2pIncomeTest: 80000,
};
function judgedContradiction(key, a) {
  if (key in INCOME_CEILING && a.income && BAND_FLOOR[a.income] >= INCOME_CEILING[key]) return `income band "${a.income}" lies above the published ceiling`;
  if (key === "okotoksResidency" && a.city && !["Okotoks", "Other / my town isn't listed"].includes(a.city)) return `said they live in ${a.city || a.province}`;
  if (key === "exciseMobilityImpairment" && !(a.canWalkFar === false || (a.functionalNeeds || []).includes("transitBarrier") || (a.functionalNeeds || []).includes("unsure"))) return "no mobility or transit limitation selected";
  if (key === "cppDisabilityContributorLink" && a.forWho !== "child" && ["60to64", "65plus"].includes(a.ageBand)) return "benefit is for a child (under 25) of a CPP-D recipient";
  if (key === "dresEmploymentRoute" && !(a.situation || []).some((v) => ["working", "looking", "student"].includes(v))) return "said not working, looking for work or studying";
  if (key === "rdspContributionWindow" && a.ageBand === "65plus") return "contributions end the year the beneficiary turns 59";
  return null;
}

/* Which answer keys a gate reads, taken from the oracle's satisfy fragment. */
function gateAnswerKeys(key) {
  const g = GATES[key];
  if (!g || !g.satisfy) return [];
  return [...Object.keys(g.satisfy.set || {}), ...Object.keys(g.satisfy.add || {}), ...Object.keys(g.satisfy.drop || {})];
}
const isUnknown = (v) => v == null || v === "unsure" || (Array.isArray(v) && (v.length === 0 || v.includes("unsure")));

/* Classify one unmet soft need. Returns {cls, sub, why}. */
function classifyNeed(key, a) {
  const g = GATES[key] || {};
  if (g.evidence === "answers") {
    const keys = gateAnswerKeys(key);
    const unknown = keys.filter((k) => isUnknown(a[k]));
    if (unknown.length) return { cls: "b", sub: "answered-unsure-or-not-asked", why: `answer for ${unknown.join("/")} is "not sure" or was never asked` };
    return { cls: "c", sub: STEP_GATES.has(key) ? "c-step" : "c-mismatch", why: `answers ${keys.map((k) => `${k}=${JSON.stringify(a[k])}`).join(", ")} do not meet it` };
  }
  const judged = judgedContradiction(key, a);
  if (judged) return { cls: "c", sub: "c-judged", why: judged };
  if (key === "caregiverSupportClaim") return { cls: "d", sub: "someone-else-claims", why: "a supporter claims it" };
  const t = triage(key);
  if (t === "ANSWERABLE") return { cls: "b", sub: "knowable-fact", why: "a fact the person likely knows (registration, receipt, spend, status)" };
  return { cls: "a", sub: "program-decides", why: "program/clinician/assessor decides" };
}
const RANK = { c: 3, d: 2, b: 1, a: 0 };

function resultsFor(answers) {
  const evaluated = E.evaluateAnswers(answers, {});
  const ready = evaluated.filter((e) => e.r.status === "ready").sort((x, y) => E.priorityScore(y.b) - E.priorityScore(x.b));
  const almost = evaluated.filter((e) => e.r.status === "almost").sort((x, y) => E.priorityScore(y.b) - E.priorityScore(x.b));
  const no = evaluated.filter((e) => e.r.status === "no" && (!E.benefitProvince(e.b) || E.benefitProvince(e.b) === answers.province));
  for (const e of almost) {
    e.cls = e.r.needs.map((n) => ({ key: n.key, ...classifyNeed(n.key, answers) }));
    e.programCls = e.cls.reduce((m, c) => (RANK[c.cls] > RANK[m] ? c.cls : m), "a");
    e.sub = e.cls.filter((c) => c.cls === e.programCls).map((c) => c.sub)[0];
    // a program with NO answer-based gate at all is shown to every persona
    e.universal = e.b.requires.every((k) => !(GATES[k] && GATES[k].evidence === "answers"));
  }
  return { ready, almost, no };
}

/* ---------------- prototype tier classifier (recommended option) ----------------
   Never touches status. Ready stays ready ("Matches your answers"). An "almost"
   program goes to:
     later    — at least one remaining requirement is contradicted by an answer
                the person gave (engine-mechanical c-step/c-mismatch, plus the
                curated `contradictedBy` judgements); OR a DTC-gated program for
                dtc=no (grouped under the DTC pathway);
     possible — everything else (program decides / facts we did not ask / unsure).
   Option C (reclassify as "no") and option B (score) are computed for comparison. */
function tierOf(e, mode = "A") {
  if (e.r.status === "ready") return "ready";
  if (e.r.status === "no") return "no";
  const contradicted = e.cls.some((c) => c.cls === "c" && (mode !== "A-mech" || c.sub !== "c-judged"));
  return contradicted ? "later" : "possible";
}
/* Refinement of "possible": does the person's own answers positively point at this
   program (a met answer gate other than province / citizenship / coverage)? */
const GENERIC = new Set(["ab", "bc", "on", "citizenPR", "provinceCovered", "notBcStudentAidDuplicate", "bcMsp"]);
function hasFitEvidence(e, a) {
  E.setAnswers(a);
  try {
    return e.b.requires.some((k) => GATES[k] && GATES[k].evidence === "answers" && !GENERIC.has(k) && E.REQS[k].met());
  } finally { E.setAnswers(null); }
}
function tier4(e, a) {
  const t = tierOf(e);
  if (t !== "possible") return t;
  return hasFitEvidence(e, a) ? "personal" : "general";
}
/* RECOMMENDED layout (option A + D): visible cards = ready + possible-specific;
   collapsed "programs we could not narrow down" = possible items whose only
   answer gates are province gates (shown to everyone in that province), except
   the DTC itself, which becomes a pathway card; collapsed "If your situation
   changes" = later. phase: "mech" uses only answer-driven contradictions
   (no new benefit facts); "full" adds the source-quoted judgements. */
const PROVINCE_ONLY = new Set(["ab", "bc", "on", "provinceCovered"]);
const unnarrowed = (e) => e.b.requires.every((k) => !(GATES[k] && GATES[k].evidence === "answers") || PROVINCE_ONLY.has(k));
/* Facts a person simply knows about themself (a status, registration, card,
   residence type, or money already spent). A program whose ONLY remaining
   checks are these is an "only if" item: one line, not a full card. */
const STATUS_GATES = new Set(["abCapccContinuingCareHome", "abServiceDogQualified", "firstNationsStatus", "cppDisabilityContributorLink",
  "translinkHandyCard", "bcTransitHandyDart", "paraTranspoRegistered", "mobilityplusRegistered", "cnibCustomer", "aCardProof", "atHomeProgram",
  "bcFuelTaxRegistered", "qualifyingRenovationSpend", "hatcQualifyingRenovationSpend", "bcHomeRenoSpend", "mhrtcSecondaryUnit",
  "disabilityMedicalExpensesPaid", "ottawaOdspReceipt", "caregiverSupportClaim", "atpApproval"]);
function layout(e, phase) {
  if (e.r.status === "ready") return "ready";
  const later = e.cls.some((c) => c.cls === "c" && (phase !== "mech" || c.sub !== "c-judged"));
  if (later) return e.r.needs.some((n) => n.key === "dtc") ? "later-dtc" : "later";
  if (e.b.id === "dtc") return "dtc-card";
  if (phase === "full2" && e.r.needs.every((n) => STATUS_GATES.has(n.key))) return "unnarrowed";
  return unnarrowed(e) ? "unnarrowed" : "possible";
}
/* Option B: likelihood score from gate evidence (for ordering inside one list). */
function likelihoodScore(e) {
  if (e.r.status === "ready") return 100;
  let s = 80;
  for (const c of e.cls) s -= c.cls === "c" ? 40 : c.cls === "b" ? 8 : c.cls === "d" ? 15 : 5;
  return s;
}

/* A "Does not match" item that belongs to a different province than the user's,
   but slips through benefitProvince() because its requires list names only a
   city gate (no province gate). */
function otherProvince(b, prov) {
  const cityGate = b.requires.find((k) => GATES[k] && GATES[k].satisfy && GATES[k].satisfy.set && "city" in GATES[k].satisfy.set);
  if (!cityGate) return false;
  const city = GATES[cityGate].satisfy.set.city;
  const provOf = { AB: E.CITIES_BY_PROVINCE.AB, BC: E.CITIES_BY_PROVINCE.BC, ON: E.CITIES_BY_PROVINCE.ON };
  const home = Object.keys(provOf).find((pv) => provOf[pv].includes(city));
  return !!home && home !== prov;
}
function summarize(p) {
  const { ready, almost, no } = resultsFor(p.answers);
  const by = { a: 0, b: 0, c: 0, d: 0 };
  const sub = {};
  for (const e of almost) { by[e.programCls]++; sub[e.sub] = (sub[e.sub] || 0) + 1; }
  const tiers = { ready: ready.length, possible: 0, later: 0 };
  const tiersMech = { ready: ready.length, possible: 0, later: 0 };
  const rec = {};
  for (const phase of ["mech", "full", "full2"]) {
    const c = { ready: 0, possible: 0, "dtc-card": 0, unnarrowed: 0, later: 0, "later-dtc": 0 };
    for (const e of [...ready, ...almost]) c[layout(e, phase)]++;
    c.visible = c.ready + c.possible + c["dtc-card"];
    rec[phase] = c;
  }
  for (const e of almost) e.layout = layout(e, "full2");
  const t4 = { ready: ready.length, personal: 0, general: 0, later: 0 };
  for (const e of almost) { e.tier4 = tier4(e, p.answers); t4[e.tier4]++; }
  for (const e of almost) { tiers[tierOf(e)]++; tiersMech[tierOf(e, "A-mech")]++; }
  // Option B: where do contradicted items land in a single score-sorted list?
  const scored = [...ready, ...almost].sort((x, y) => likelihoodScore(y) - likelihoodScore(x) || E.priorityScore(y.b) - E.priorityScore(x.b));
  const firstC = scored.findIndex((e) => e.programCls === "c");
  // where does the FIRST contradicted program appear in today's on-screen order (ready then almost)?
  const today = [...ready, ...almost];
  const firstCToday = today.findIndex((e) => e.programCls === "c");
  const cInTop10 = today.slice(0, 10).filter((e) => e.programCls === "c").length;
  const universal = almost.filter((e) => e.universal).length;
  const cInTop10Scored = scored.slice(0, 10).filter((e) => e.programCls === "c").length;
  const dtcGated = almost.filter((e) => e.r.needs.some((n) => n.key === "dtc")).length;
  const otherProvNo = no.filter((e) => otherProvince(e.b, p.answers.province)).length;
  const possibleUniversal = almost.filter((e) => tierOf(e) === "possible" && e.universal).length;
  return { id: p.id, label: p.label, ready: ready.length, almost: almost.length, no: no.length, by, sub, tiers, tiersMech,
    firstCToday: firstCToday < 0 ? null : firstCToday + 1, cInTop10, universal, firstCScored: firstC < 0 ? null : firstC + 1, cInTop10Scored, t4, rec, dtcGated, otherProvNo, possibleUniversal,
    list: { ready, almost, no } };
}

function walk(s) {
  const out = [];
  out.push(`### ${s.id} — ${s.label}`);
  out.push(`Today: ${s.ready + s.almost} "benefits you may be able to get" = ${s.ready} Matches your answers + ${s.almost} More to check; ${s.no} under "Does not match these answers" (collapsed).`);
  out.push("");
  out.push("| # | Group today | Program | Why not ready (class) | Proposed tier |");
  out.push("|---|---|---|---|---|");
  let i = 0;
  for (const e of s.list.ready) out.push(`| ${++i} | Matches your answers | ${e.b.name} | — | Matches your answers |`);
  for (const e of s.list.almost) {
    const why = e.cls.map((c) => `${c.key}: ${c.cls}${c.sub.startsWith("c-") ? "/" + c.sub : ""}`).join("; ");
    out.push(`| ${++i} | More to check | ${e.b.name}${e.universal ? " †" : ""} | ${why} | ${({ later: "If your situation changes (collapsed)", "later-dtc": "If your situation changes → after you get the DTC (collapsed)", possible: "May fit you now", unnarrowed: "One-line list: Check if these apply to you", "dtc-card": "DTC pathway card (visible)" })[e.layout]} |`);
  }
  return out.join("\n");
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const sums = PERSONAS.map(summarize);
  const tot = { ready: 0, almost: 0, no: 0, a: 0, b: 0, c: 0, d: 0, possible: 0, later: 0, laterMech: 0, universal: 0, cInTop10: 0 };
  console.log("persona | ready | almost | no | a | b | c (c-step/c-mismatch/c-judged) | d | universal† | first c in today's list | c in top 10 | tierA: ready/possible/later | mech-only later");
  for (const s of sums) {
    console.log(`${s.id} | ${s.ready} | ${s.almost} | ${s.no} | ${s.by.a} | ${s.by.b} | ${s.by.c} (${s.sub["c-step"] || 0}/${s.sub["c-mismatch"] || 0}/${s.sub["c-judged"] || 0}) | ${s.by.d} | ${s.universal} | ${s.firstCToday} | ${s.cInTop10} | ${s.tiers.ready}/${s.tiers.possible}/${s.tiers.later} | ${s.tiersMech.later}`);
    for (const k of ["ready", "almost", "no"]) tot[k] += s[k];
    for (const k of ["a", "b", "c", "d"]) tot[k] += s.by[k];
    tot.possible += s.tiers.possible; tot.later += s.tiers.later; tot.laterMech += s.tiersMech.later; tot.universal += s.universal; tot.cInTop10 += s.cInTop10;
  }
  console.log("TOTAL", JSON.stringify(tot));
  console.log("\npersona | today visible cards | RECOMMENDED phase1(mech): matches / possible / DTC card / collapsed-unnarrowed / collapsed-later(+dtc pathway) | phase1+2(full) same");
  const rt = { today: 0, m: 0, f: 0 };
  for (const s of sums) { const m = s.rec.mech, f = s.rec.full; rt.today += s.ready + s.almost; rt.m += m.visible; rt.f += f.visible;
    console.log(`${s.id} | ${s.ready + s.almost} | ${m.ready} / ${m.possible} / ${m["dtc-card"]} / ${m.unnarrowed} / ${m.later}+${m["later-dtc"]} | ${f.ready} / ${f.possible} / ${f["dtc-card"]} / ${f.unnarrowed} / ${f.later}+${f["later-dtc"]}`); }
  console.log("visible-card totals", JSON.stringify(rt));
  console.log("\nvariant A2 (status-only items join the one-line list): persona | matches / possible cards / DTC card / one-line 'check if these apply' / later+dtc");
  let a2 = 0, a2line = 0;
  for (const s of sums) { const f = s.rec.full2; a2 += f.visible; a2line += f.unnarrowed; console.log(`${s.id} | ${f.ready} / ${f.possible} / ${f["dtc-card"]} / ${f.unnarrowed} / ${f.later}+${f["later-dtc"]}`); }
  console.log("A2 full cards visible total", a2, "one-line items total", a2line);
  console.log("\npersona | 4-tier: ready / worth-checking(personal) / other-to-check(general) / if-situation-changes");
  for (const s of sums) console.log(`${s.id} | ${s.t4.ready} / ${s.t4.personal} / ${s.t4.general} / ${s.t4.later}`);
  console.log("\npersona | DTC-gated almost | possible that are universal | c in top10 today | c in top10 under option-B score | first c (score order) | 'no' items from another province");
  for (const s of sums) console.log(`${s.id} | ${s.dtcGated} | ${s.possibleUniversal} | ${s.cInTop10} | ${s.cInTop10Scored} | ${s.firstCScored} | ${s.otherProvNo}`);
  const wi = args.indexOf("--walk");
  if (wi >= 0) for (const id of args[wi + 1].split(",")) console.log("\n" + walk(sums.find((s) => s.id.startsWith(id))));
  const ji = args.indexOf("--json");
  if (ji >= 0) fs.writeFileSync(args[ji + 1], JSON.stringify(sums.map(({ list, ...s }) => ({ ...s,
    almostDetail: list.almost.map((e) => ({ id: e.b.id, layout: e.layout, tier4: e.tier4, programCls: e.programCls, universal: e.universal, needs: e.cls })) })), null, 2));
}
module.exports = { resultsFor, classifyNeed, summarize, tierOf, PERSONAS, E };
