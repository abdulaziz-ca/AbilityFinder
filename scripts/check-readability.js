#!/usr/bin/env node

/*
 * Non-blocking plain-language report for benefit prose.
 * This script intentionally exits 0 even if analysis or report writing fails.
 */

const fs=require('fs'),vm=require('vm'),path=require('path');

const REPORT_DATE = '2026-09-02';
const FK_GRADE_TARGET = 9;
const AVG_SENTENCE_TARGET = 20;
const MAX_SENTENCE_TARGET = 25;

function wordsIn(text) {
  return String(text || '')
    .split(/\s+/)
    .map((token) => token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, ''))
    .filter(Boolean);
}

function syllablesIn(word) {
  const letters = String(word).toLowerCase().replace(/[^a-z]/g, '');
  if (!letters) return 1;

  const vowelRuns = letters.match(/[aeiouy]+/g);
  let count = vowelRuns ? vowelRuns.length : 0;
  if (letters.endsWith('e')) count -= 1;
  return Math.max(1, count);
}

function proseFor(b) {
  const parts = [
    b.summary,
    b.note,
    b.requiresNote,
    b.detail && b.detail.about,
    (b.detail && b.detail.tips || []).join(' '),
  ];

  if (b.eligibility) {
    parts.push(
      (b.eligibility.items || []).join(' ') + ' ' + (b.eligibility.note || '')
    );
  }

  return parts.filter(Boolean).join(' ');
}

function analyzeBenefit(b) {
  const prose = proseFor(b);
  const sentenceTexts = prose.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const sentenceCount = Math.max(1, sentenceTexts.length);
  const words = wordsIn(prose);
  const wordCount = words.length;
  const syllableCount = words.reduce((sum, word) => sum + syllablesIn(word), 0);
  const averageSentenceLength = wordCount / sentenceCount;
  const longestSentence = sentenceTexts.length
    ? Math.max(...sentenceTexts.map((sentence) => wordsIn(sentence).length))
    : 0;
  const grade = wordCount
    ? 0.39 * averageSentenceLength + 11.8 * (syllableCount / wordCount) - 15.59
    : 0;
  const roundedGrade = Number(grade.toFixed(1));
  const roundedAverageSentenceLength = Number(averageSentenceLength.toFixed(1));

  const fkFlag = roundedGrade > FK_GRADE_TARGET;
  const avgFlag = roundedAverageSentenceLength > AVG_SENTENCE_TARGET;
  const maxFlag = longestSentence > MAX_SENTENCE_TARGET;

  return {
    id: b.id,
    level: b.level || '',
    grade: roundedGrade,
    avgSentenceLen: roundedAverageSentenceLength,
    maxSentenceLen: longestSentence,
    fkFlag,
    avgFlag,
    maxFlag,
    flagged: fkFlag || avgFlag || maxFlag,
  };
}

function formatNumber(value) {
  return Number(value).toFixed(1);
}

function flagReasons(result) {
  const reasons = [];
  if (result.fkFlag) reasons.push(`FK grade ${formatNumber(result.grade)} > ${FK_GRADE_TARGET}`);
  if (result.avgFlag) reasons.push(`average sentence ${formatNumber(result.avgSentenceLen)} > ${AVG_SENTENCE_TARGET} words`);
  if (result.maxFlag) reasons.push(`longest sentence ${result.maxSentenceLen} > ${MAX_SENTENCE_TARGET} words`);
  return reasons;
}

function buildReport(results) {
  const rows = results.map((result) =>
    `| ${result.id} | ${result.level} | ${formatNumber(result.grade)} | ${formatNumber(result.avgSentenceLen)} | ${result.maxSentenceLen} | ${result.flagged ? 'Yes' : 'No'} |`
  );
  const flagged = results.filter((result) => result.flagged);
  const flaggedLines = flagged.length
    ? flagged.map((result) => `- \`${result.id}\` — ${flagReasons(result).join('; ')}`)
    : ['- None.'];

  return `# Benefit Readability Report

**Date:** ${REPORT_DATE}

This non-blocking report checks the user-facing prose stored for every benefit. It includes each benefit's summary, note, requirements note, detail description, tips, and eligibility items/note. It excludes amounts, URLs, tables, IDs, procedural step lists, and other structured data. The checker splits sentences at periods, exclamation marks, and question marks; counts whitespace-separated words after removing surrounding punctuation; and estimates syllables from vowel runs with a silent-final-e adjustment. Flesch–Kincaid grades and average sentence lengths are rounded to one decimal place.

The thresholds are guidance for finding content to review, not build gates:

- **Flesch–Kincaid grade ≤ ${FK_GRADE_TARGET}.** This is an operational proxy for the lower-secondary reading-level direction in [WCAG 2.1 Success Criterion 3.1.5](https://www.w3.org/WAI/WCAG21/Understanding/reading-level.html). WCAG 3.1.5 is Level AAA and calls for supplemental content or a simpler version when text requires reading ability above lower-secondary level.
- **Average sentence length ≤ ${AVG_SENTENCE_TARGET} words.** The [Canada.ca Content Style Guide](https://design.canada.ca/style-guide/) advises aiming for an average sentence length of 15 to 20 words.
- **Longest sentence ≤ ${MAX_SENTENCE_TARGET} words.** [GOV.UK content design guidance](https://www.gov.uk/guidance/content-design/writing-for-gov-uk) recommends sentences of 25 words or fewer as a plain-language benchmark.

A benefit is flagged when it exceeds any one of these targets.

## All benefits, highest FK grade first

| id | level | FK grade | avg sentence | longest sentence | flagged? |
|---|---|---:|---:|---:|:---:|
${rows.join('\n')}

## Flagged

${flaggedLines.join('\n')}
`;
}

try {
  const ctx={window:{},document:{},console};vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname,'..','public','data.js'),'utf8')+';globalThis.__B=BENEFITS;',ctx);
  const BENEFITS=ctx.__B;

  const results = BENEFITS.map(analyzeBenefit).sort((a, b) =>
    b.grade - a.grade || b.avgSentenceLen - a.avgSentenceLen || b.maxSentenceLen - a.maxSentenceLen || a.id.localeCompare(b.id)
  );

  const fkCount = results.filter((result) => result.fkFlag).length;
  const avgCount = results.filter((result) => result.avgFlag).length;
  const maxCount = results.filter((result) => result.maxFlag).length;

  console.log(`Total benefits analyzed: ${results.length}`);
  console.log(`FK grade > ${FK_GRADE_TARGET}: ${fkCount}`);
  console.log(`Average sentence length > ${AVG_SENTENCE_TARGET}: ${avgCount}`);
  console.log(`Longest sentence > ${MAX_SENTENCE_TARGET}: ${maxCount}`);
  console.log('Top 15 by FK grade:');
  results.slice(0, 15).forEach((result) => {
    console.log(`${result.id}  grade=${formatNumber(result.grade)}  avgSent=${formatNumber(result.avgSentenceLen)}  maxSent=${result.maxSentenceLen}`);
  });

  const reportPath = path.join(__dirname, '..', 'research', '197-info-density', 'READABILITY-REPORT.md');
  fs.writeFileSync(reportPath, buildReport(results), 'utf8');
  console.log(`Wrote ${path.relative(path.join(__dirname, '..'), reportPath)}`);
} catch (error) {
  console.error(`Readability report could not be completed: ${error && error.stack ? error.stack : error}`);
}

process.exit(0);
