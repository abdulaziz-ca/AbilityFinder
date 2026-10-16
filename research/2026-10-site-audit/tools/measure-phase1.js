#!/usr/bin/env node
/* After-numbers for the results redesign phase 1: runs public/resultsGroups.js
   on the same 15 personas as measure-relevance.js. READ-ONLY. */
const path = require("path");
const ROOT = path.resolve(__dirname, "../../..");
const { loadEngine } = require("./load-engine");
const PERSONAS = require("./personas");
const { classifyResults } = require(path.join(ROOT, "public/resultsGroups.js"));
const E = loadEngine(ROOT);
const tot = { ready: 0, g1Almost: 0, g1: 0, g2: 0, g3: 0, dtcGatedInTop10: 0 };
console.log("persona | G1 cards (ready+almost) | G2 rows | G3 rows | DTC-needing cards in first 10 of G1");
for (const p of PERSONAS) {
  E.setAnswers(p.answers);
  const ev = E.evaluateAnswers(p.answers, {}).filter((e) => E.benefitInResultsScope(e.b, p.answers));
  E.setAnswers(null);
  const g = classifyResults(ev, p.answers);
  const ready = g.g1.filter((e) => e.r.status === "ready").length;
  const top10 = Array.from(g.g1.slice(0, 10)).filter((e) => p.answers.dtc === "no" && e.r.needs.some((n) => n.key === "dtc")).length;
  tot.ready += ready; tot.g1Almost += g.g1.length - ready; tot.g1 += g.g1.length; tot.g2 += g.g2.length; tot.g3 += g.g3.length; tot.dtcGatedInTop10 += top10;
  console.log(`${p.id} | ${g.g1.length} (${ready}+${g.g1.length - ready}) | ${g.g2.length} | ${g.g3.length} | ${top10}`);
}
console.log("TOTAL", JSON.stringify(tot));
