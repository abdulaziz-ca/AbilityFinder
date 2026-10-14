#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.resolve(__dirname, '..');
const DAY = 86400000;

function buildQueue({ rootDir = ROOT, today = new Date() } = {}) {
  const context = vm.createContext({ window: {}, document: {}, console });
  vm.runInContext(fs.readFileSync(path.join(rootDir, 'public/data.js'), 'utf8') +
    ';globalThis.catalogue = { benefits: BENEFITS, dates: BENEFIT_VERIFIED };', context);
  const app = fs.readFileSync(path.join(rootDir, 'public/app.js'), 'utf8');
  const month = app.match(/const\s+DATA_VERIFIED_MONTH\s*=\s*["'](\d{4}-\d{2})["']/)?.[1] || null;
  const now = new Date(today);
  if (!Number.isFinite(now.getTime())) throw new Error('Invalid today');
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Array.from(context.catalogue.benefits, b => {
    const own = context.catalogue.dates[b.id];
    const inherited = !own;
    const verified = own || month;
    const date = verified && new Date(verified.length === 7 ? `${verified}-01T00:00:00Z` : `${verified}T00:00:00Z`);
    const ageDays = date && Number.isFinite(date.getTime()) ? Math.max(0, Math.floor((midnight - date.getTime()) / DAY)) : 0;
    const urls = [];
    for (const field of [b.source, b.applyUrl]) {
      // Resolve every supported province rather than inventing a user's location.
      const values = typeof field === 'function' ? ['AB', 'BC', 'ON'].map(province => field({ province })) : [field];
      for (const value of values.flat()) {
        if (typeof value === 'string' && /^https?:\/\//i.test(value) && !urls.includes(value)) urls.push(value);
      }
    }
    const amountFields = Object.entries(b).filter(([key]) => key === 'summary' || /^amount/i.test(key)).map(([, value]) => value);
    const hasDollarFigures = /\$\d/.test(JSON.stringify(amountFields));
    return { id: b.id, name: b.name, scope: b.level || null, verified, inherited, ageDays, urls,
      hasDollarFigures, priority: ageDays + (inherited ? 60 : 0) + (hasDollarFigures ? 30 : 0) };
  }).sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
}

function parseArgs(args, queue) {
  let selected = null;
  let diff = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--diff' && !diff) diff = true;
    else if ((arg === '--snapshot' || arg === '--snapshot-top') && selected === null) {
      const value = args[++i];
      if (!value) throw new Error(`Missing value for ${arg}`);
      if (arg === '--snapshot-top') {
        if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) throw new Error('N must be a positive integer');
        selected = queue.slice(0, Number(value));
      } else {
        const ids = value.split(',');
        if (ids.some(id => !queue.some(b => b.id === id))) throw new Error('Unknown or empty benefit id');
        selected = [...new Set(ids)].map(id => queue.find(b => b.id === id));
      }
    } else throw new Error(`Unknown or repeated option: ${arg}`);
  }
  if (diff && selected === null) throw new Error('--diff requires a snapshot option');
  return { selected, diff };
}

function plainText(html) {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, ' ').trim();
}

function diffSummary(oldText, newText) {
  const sentences = text => text.split('\n').slice(1).join(' ').match(/[^.!?]+(?:[.!?]+|$)/g)?.map(s => s.trim()).filter(Boolean) || [];
  const before = sentences(oldText), after = sentences(newText);
  const subtract = (a, b) => {
    const remaining = [...b];
    return a.filter(s => { const i = remaining.indexOf(s); if (i < 0) return true; remaining.splice(i, 1); return false; });
  };
  const removed = subtract(before, after), added = subtract(after, before);
  return `added ${added.length}, removed ${removed.length}\n` +
    [...removed.map(s => `- ${s}`), ...added.map(s => `+ ${s}`)].slice(0, 5).map(s => s.length > 240 ? s.slice(0, 237) + '...' : s).join('\n');
}

async function snapshots(records, directory, diff) {
  const needsBrowser = [];
  let count = 0;
  const total = records.reduce((n, b) => n + b.urls.length, 0);
  fs.mkdirSync(directory, { recursive: true });
  for (const record of records) {
    if (!/^[a-zA-Z0-9_-]+$/.test(record.id)) throw new Error('Unsafe snapshot id');
    for (const [index, url] of record.urls.entries()) {
      if (count >= 25) break;
      if (count++) await new Promise(resolve => setTimeout(resolve, 1000));
      let status = 'ERROR', text = '', failure = '';
      const signal = AbortSignal.timeout(15000);
      try {
        const response = await fetch(url, { method: 'GET', redirect: 'manual', signal,
          headers: { 'User-Agent': 'AbilityFinder-reverify/1.0 (+https://abilityfinder.ca)' } });
        status = response.status;
        if (status === 200) text = plainText(await response.text());
        else { failure = `status ${status}`; await response.body?.cancel(); }
      } catch (error) { failure = error.message; }
      if (failure) { text = ''; needsBrowser.push(`${record.id}: ${url} (${failure})`); }
      const content = `URL: ${url} | fetched: ${new Date().toISOString()} | status: ${status}\n` + (text ? `${text}\n` : '');
      const file = path.join(directory, `${record.id}--${index + 1}.txt`);
      if (diff && fs.existsSync(file)) {
        fs.writeFileSync(file.replace(/\.txt$/, '.new.txt'), content);
        console.log(`${record.id}--${index + 1}: ${diffSummary(fs.readFileSync(file, 'utf8'), content)}`);
      } else fs.writeFileSync(file, content);
    }
  }
  if (total > 25) console.log(`URL limit: fetched 25 of ${total}; remaining URLs skipped.`);
  if (needsBrowser.length) console.log(`NEEDS BROWSER\n${needsBrowser.join('\n')}`);
}

async function main() {
  const queue = buildQueue({});
  let options;
  try { options = parseArgs(process.argv.slice(2), queue); }
  catch (error) { console.error(`Usage error: ${error.message}\nUsage: node scripts/reverify-queue.js [--snapshot id[,id...] | --snapshot-top N] [--diff]`); process.exitCode = 2; return; }
  const directory = path.join(ROOT, 'research/reverify');
  const inherited = queue.filter(b => b.inherited).length;
  const oldest = [...queue].sort((a, b) => b.ageDays - a.ageDays)[0];
  const date = new Date().toISOString().slice(0, 10);
  const summary = [`Generated: ${date}`, `Records: ${queue.length}`, `Inherited: ${inherited}`, `Own-date: ${queue.length - inherited}`,
    `Oldest: ${oldest ? `${oldest.verified} (${oldest.ageDays} days)` : 'none'}`];
  const cell = value => String(value ?? '').replace(/\|/g, '&#124;').replace(/[\r\n]/g, ' ');
  const rows = queue.map((b, i) => `| ${i + 1} | ${cell(b.id)} | ${cell(b.name)} | ${b.verified || 'unknown'} | ${b.inherited} | ${b.ageDays} | ${b.urls.map(cell).join('<br>')} |`);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'QUEUE.md'), `# Benefit re-verification queue\n\n${summary.join('  \n')}\n\nMonth-only ages use the first day of the month, not an asserted verification day. Priority = age + 60 inherited + 30 dollar figures. This queue never changes facts.\n\n| rank | id | name | verified | inherited | age (days) | official URL |\n|---:|---|---|---|---|---:|---|\n${rows.join('\n')}\n`);
  console.log(summary.join('\n'));
  if (options.selected) await snapshots(options.selected, path.join(directory, 'snapshots'), options.diff);
}

module.exports = { buildQueue };
if (require.main === module) main().catch(error => { console.error(`Re-verification queue could not be completed: ${error.message}`); });
