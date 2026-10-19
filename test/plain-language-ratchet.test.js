"use strict";
// Plain-language ratchet (site audit 2026-10, P2-01). The October rewrite took the
// median Flesch-Kincaid grade of summary + "Good to know" + tips from 11.8 to 9.1
// and the programs at grade 9 or below from 19 to 67. New or edited text must not
// slide back: lower the numbers below when they improve, never raise them.
// Rules: docs/CONTENT-STYLE-GUIDE.md.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { loadEngine } = require("../research/2026-10-site-audit/tools/load-engine");

const MAX_MEDIAN_GRADE = 9.1;
const MIN_PROGRAMS_AT_GRADE_9 = 67;
const MAX_SUMMARY_WORDS = 60;

const words = (t) => String(t || "").split(/\s+/).map((w) => w.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "")).filter(Boolean);
function syllables(word) {
  const l = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!l) return 1;
  let c = (l.match(/[aeiouy]+/g) || []).length;
  if (l.endsWith("e")) c -= 1;
  return Math.max(1, c);
}
function grade(text) {
  const t = text.replace(/<[^>]+>/g, "");
  const sentences = Math.max(1, t.split(/[.!?]+/).filter((s) => s.trim()).length);
  const w = words(t);
  if (!w.length) return 0;
  return 0.39 * (w.length / sentences) + 11.8 * (w.reduce((a, x) => a + syllables(x), 0) / w.length) - 15.59;
}

const E = loadEngine(path.join(__dirname, ".."));
const programs = Array.from(E.BENEFITS).filter((b) => b.requires);

// The Flesch-Kincaid grade is an English formula: it miscounts French syllables
// and sentences, so French records (Québec, b.lang === "fr") are left out of the
// grade baseline. The length and capitals rules below apply to every record.
const englishPrograms = programs.filter((b) => b.lang !== "fr");

test("summary, Good to know and tips stay at or below the plain-language baseline", () => {
  const grades = englishPrograms.map((b) => grade([b.summary, b.note, ((b.detail && b.detail.tips) || []).join(" ")].join(" "))).sort((a, b) => a - b);
  const median = grades[Math.floor(grades.length / 2)];
  assert.ok(median <= MAX_MEDIAN_GRADE + 0.05, `median grade ${median.toFixed(2)} exceeds ${MAX_MEDIAN_GRADE}`);
  const atNine = grades.filter((g) => g <= 9).length;
  assert.ok(atNine >= MIN_PROGRAMS_AT_GRADE_9, `${atNine} programs at grade 9 or below, baseline ${MIN_PROGRAMS_AT_GRADE_9}`);
});

test("no program summary runs past the length budget", () => {
  const long = programs.filter((b) => words(b.summary.replace(/<[^>]+>/g, "")).length > MAX_SUMMARY_WORDS).map((b) => b.id);
  assert.deepEqual(Array.from(long), []);
});

test("no all-capital emphasis words in program text", () => {
  const CAPS = /\b(NOT|AND|OR|ALL|CLOSED|LESSER|BEFORE|ONE|FIRST|NO|NEVER|MUST|ONLY|ENDED|COMBINED|ABOVE)\b/;
  const hits = [];
  const walk = (o, p) => {
    if (typeof o === "string") { if (CAPS.test(o)) hits.push(p); }
    else if (o && typeof o === "object") for (const k of Object.keys(o)) walk(o[k], `${p}.${k}`);
  };
  for (const b of programs) walk(b, b.id);
  assert.deepEqual(hits, []);
});
