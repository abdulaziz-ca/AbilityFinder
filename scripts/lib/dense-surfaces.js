const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Scan balanced code, skipping quoted text and comments. Template substitutions
// recurse into code so braces and nested templates inside them remain balanced.
function objectLiteral(source) {
  const match = /\bconst\s+REQS\s*=\s*\{/.exec(source);
  if (!match) throw new Error('Could not locate const REQS object');
  const start = match.index + match[0].length - 1;
  function quoted(i, quote) {
    for (i++; i < source.length; i++) {
      if (source[i] === '\\') { i++; continue; }
      if (source[i] === quote) return i + 1;
      if (quote === '`' && source[i] === '$' && source[i + 1] === '{') {
        i = balanced(i + 1) - 1;
      }
    }
    throw new Error('Unterminated REQS string');
  }
  function balanced(i) {
    let depth = 0;
    for (; i < source.length; i++) {
      const c = source[i], next = source[i + 1];
      if (c === '"' || c === "'" || c === '`') { i = quoted(i, c) - 1; continue; }
      if (c === '/' && next === '/') {
        const end = source.indexOf('\n', i + 2);
        i = end < 0 ? source.length : end;
        continue;
      }
      if (c === '/' && next === '*') {
        const end = source.indexOf('*/', i + 2);
        if (end < 0) throw new Error('Unterminated REQS comment');
        i = end + 1;
        continue;
      }
      if (c === '{') depth++;
      if (c === '}' && --depth === 0) return i + 1;
    }
    throw new Error('Unterminated REQS object');
  }
  return source.slice(start, balanced(start));
}

const SURFACES = ['gate.unmet', 'eligibility.note', 'detail.about', 'detail.aboutList.items', 'summary', 'note'];
const BULLETS = new Set(['gate.unmet', 'eligibility.note', 'detail.aboutList.items']);
function isFlagged(item) {
  return BULLETS.has(item.surface)
    ? item.chars > 120 || item.sentences > 1
    : item.chars > 240;
}
function collectDenseSurfaces(rootDir) {
  const results = [];
  function add(surface, id, text) {
    if (typeof text !== 'string') return;
    results.push({ surface, id, text, chars: text.length,
      sentences: text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean).length });
  }
  const gates = extractReqs(rootDir);
  function walk(value, keys) {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (key === 'unmet') add('gate.unmet', [...keys, key].join('.'), child);
      else walk(child, [...keys, key]);
    }
  }
  walk(gates, []);
  const ctx = { window: {}, document: {}, console };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(rootDir, 'public/data.js'), 'utf8') + ';globalThis.__B=BENEFITS;', ctx);
  for (const b of ctx.__B) {
    add('eligibility.note', `${b.id}.eligibility.note`, b.eligibility && b.eligibility.note);
    add('detail.about', `${b.id}.detail.about`, b.detail && b.detail.about);
    const items = b.detail && b.detail.aboutList && b.detail.aboutList.items;
    if (Array.isArray(items)) items.forEach((text, i) => add('detail.aboutList.items', `${b.id}.detail.aboutList.items[${i}]`, text));
    for (const field of ['summary', 'note']) add(field, `${b.id}.${field}`, b[field]);
  }
  return results;
}
// Expose display metadata alongside the original gate functions for schema and
// preservation tests. Evaluating the literal does not execute gate predicates.
function extractReqs(rootDir) {
  const noop = () => undefined;
  const globals = new Proxy({}, { get: () => noop });
  return vm.runInContext(`(${objectLiteral(fs.readFileSync(path.join(rootDir, 'public/app.js'), 'utf8'))})`,
    vm.createContext(globals), { timeout: 1000 });
}
module.exports = { collectDenseSurfaces, extractReqs, isFlagged, SURFACES };
