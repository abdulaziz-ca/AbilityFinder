/* Repeated-fact measure (site audit 2026-10, C-CONTENT-TRUST P1-08): for each
   program, count 7-word runs that appear verbatim in two different user-visible
   fields. A tired reader cannot tell whether the third mention is new. */
"use strict";
const FIELDS = (b) => {
  const d = b.detail || {};
  const out = {
    summary: b.summary, note: b.note, requiresNote: b.eligibility ? null : b.requiresNote, // guides show requiresNote only without an eligibility list
    about: d.aboutList ? null : d.about,
    aboutList: d.aboutList ? [d.aboutList.lead, ...(d.aboutList.items || [])].join(" ") : null,
    tips: (d.tips || []).join(" "), steps: (d.steps || []).join(" "),
    eligibility: b.eligibility ? (b.eligibility.items || []).join(" ") : null,
  };
  return Object.entries(out).filter(([, v]) => v);
};
const words = (t) => String(t).replace(/<[^>]+>/g, " ").toLowerCase().replace(/[^a-z0-9$%' ]+/g, " ").split(/\s+/).filter(Boolean);
function runs(t, n = 7) {
  const w = words(t), s = new Set();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(" "));
  return s;
}
function duplication(b) {
  const f = FIELDS(b).map(([k, v]) => [k, runs(v)]);
  let shared = 0; const pairs = [];
  for (let i = 0; i < f.length; i++) for (let j = i + 1; j < f.length; j++) {
    let n = 0; for (const r of f[i][1]) if (f[j][1].has(r)) n++;
    if (n) { shared += n; pairs.push(`${f[i][0]}↔${f[j][0]}:${n}`); }
  }
  return { shared, pairs };
}
module.exports = { duplication };
