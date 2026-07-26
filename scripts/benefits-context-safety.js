"use strict";

const GUIDE_AMOUNT = "[amount — see the guide]";
const GUIDE_PERCENTAGE = "[percentage — see the guide]";
const GUIDE_AGE = "[age limit — see the guide]";
const GUIDE_PHONE = "[phone — see the guide]";
const GUIDE_CUTOFF = "[cutoff — see the guide]";

const NUMBER_WORD =
  "(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|" +
  "thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|" +
  "thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred)";

const patterns = {
  phone: [
    /\b(?:\+?1[-.\s])?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}(?:\s*(?:ext\.?|x)\s*\d+)?\b/gi,
    /\b\d-\d-\d\b/g,
  ],
  money: [
    /(?:C\$|CAD\s*|[$£€¥]\s*)\d[\d,]*(?:\.\d+)?/gi,
    /\b\d[\d,]*(?:\.\d+)?\s*(?:Canadian\s+)?dollars?\b/gi,
    new RegExp(`\\b${NUMBER_WORD}(?:[-\\s]+${NUMBER_WORD})*\\s+(?:Canadian\\s+)?dollars?\\b`, "gi"),
    /\b\d{1,3},\d{3}(?:\.\d+)?\b/g,
  ],
  percentage: [
    /\b\d+(?:\s*\/\s*\d+)+\s*%/g,
    /\b\d+(?:\.\d+)?\s*%/g,
    /\b\d+(?:\.\d+)?\s+per\s*cent\b/gi,
    new RegExp(`\\b${NUMBER_WORD}(?:[-\\s]+${NUMBER_WORD})*\\s+(?:percent|per\\s*cent)\\b`, "gi"),
    /\b(?:half[-\s]?price|half\s+off|one[-\s]?half\s+off|a\s+quarter\s+off|one[-\s]?quarter\s+off|three[-\s]?quarters?\s+off|nine[-\s]?tenths?\s+off)\b/gi,
    /%/g,
  ],
  age: [
    /\b\d{1,3}\s*(?:\+(?!\w)|[-–—]\s*\d{1,3}\b|to\s+\d{1,3}\b)/g,
    /\b(?:under|younger\s+than|over|older\s+than|aged?|ages?|from\s+age|turns?)\s+(?:of\s+)?\d{1,3}\b/gi,
    new RegExp(
      `\\b(?:under|younger\\s+than|over|older\\s+than|aged?|ages?|from\\s+age|turns?)\\s+(?:of\\s+)?${NUMBER_WORD}\\b`,
      "gi"
    ),
    /\b\d{1,3}\s+(?:and|or)\s+(?:over|older|under|younger)\b/gi,
    /\b\d{1,3}(?:st|nd|rd|th)\s+birthday\b/gi,
    /\b(?:child|children|adult|adults|youth|senior|seniors)\s+(?:under|over|aged?)\s+\d{1,3}\b/gi,
  ],
  cutoff: [
    /\b(?:income|assets?|earnings?|net\s+income)\s+(?:of\s+|under\s+|over\s+|below\s+|above\s+|up\s+to\s+|less\s+than\s+|more\s+than\s+)?\d[\d,]*(?:\.\d+)?\b/gi,
  ],
};

function replaceAll(text, regexes, replacement) {
  return regexes.reduce((value, regex) => value.replace(regex, replacement), text);
}

function redactGroundingNarrative(value) {
  let text = String(value ?? "");
  text = replaceAll(text, patterns.phone, GUIDE_PHONE);
  text = replaceAll(text, patterns.percentage, GUIDE_PERCENTAGE);
  text = replaceAll(text, patterns.cutoff, GUIDE_CUTOFF);
  text = replaceAll(text, patterns.money, GUIDE_AMOUNT);
  text = replaceAll(text, patterns.age, GUIDE_AGE);
  return text;
}

function prohibitedGroundingMatches(value) {
  const text = String(value ?? "");
  const matches = [];
  for (const [kind, regexes] of Object.entries(patterns)) {
    for (const regex of regexes) {
      const found = text.match(regex);
      if (found) matches.push(...found.map((match) => ({ kind, match })));
    }
  }
  return matches;
}

function assertGroundingNarrativeSafe(value, label = "assistant grounding") {
  const matches = prohibitedGroundingMatches(value);
  if (!matches.length) return;
  const examples = matches
    .slice(0, 8)
    .map(({ kind, match }) => `${kind}: ${JSON.stringify(match)}`)
    .join(", ");
  throw new Error(`${label} contains prohibited numeric or contact facts (${examples})`);
}

module.exports = {
  GUIDE_AGE,
  GUIDE_AMOUNT,
  GUIDE_CUTOFF,
  GUIDE_PERCENTAGE,
  GUIDE_PHONE,
  assertGroundingNarrativeSafe,
  prohibitedGroundingMatches,
  redactGroundingNarrative,
};
