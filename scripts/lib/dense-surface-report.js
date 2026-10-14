const fs = require('node:fs');
const path = require('node:path');
const { collectDenseSurfaces, isFlagged, SURFACES, cueCoverage } = require('./dense-surfaces');

module.exports = function report(rootDir, updateBaseline) {
  const items = collectDenseSurfaces(rootDir);
  const counts = {}, maxChars = {};
  const rows = SURFACES.map(surface => {
    const group = items.filter(item => item.surface === surface).sort((a, b) => b.chars - a.chars || a.id.localeCompare(b.id));
    counts[surface] = group.filter(isFlagged).length;
    maxChars[surface] = group[0]?.chars || 0;
    return `| ${surface} | ${group.length} | ${counts[surface]} | ${group[0]?.id || '—'} | ${maxChars[surface]} |`;
  });
  const table = ['| Surface | Total | Flagged | Longest id | Chars |', '|---|---:|---:|---|---:|', ...rows].join('\n');
  console.log(table);
  const coverage = cueCoverage(rootDir);
  console.log(`gates with a short cue: ${coverage.withShort} of ${coverage.flagged} flagged`);
  const directory = path.join(rootDir, 'research/197-info-density');
  fs.mkdirSync(directory, { recursive: true });
  const flagged = items.filter(isFlagged).sort((a, b) => b.chars - a.chars || a.id.localeCompare(b.id));
  const reportPath = path.join(directory, 'DENSE-SURFACES-REPORT.md');
  fs.writeFileSync(reportPath, `# Dense surfaces report\n\nBullet surfaces (gate.unmet, eligibility.note, detail.aboutList.items) are flagged above 120 characters or one sentence. Summary, note and detail.about are flagged above 240 characters. Sentences split at periods, exclamation marks and question marks, as in the original checker. These are review signals: preserve official qualifiers behind the expander, never delete them.\n\n${table}\n\n## Flagged items, longest first\n\n${flagged.map(item => `- **${item.surface}** — \`${item.id}\` (${item.chars} chars, ${item.sentences} sentences): ${item.text.replace(/\s+/g, ' ')}`).join('\n')}\n`);
  console.log(`Wrote ${path.relative(rootDir, reportPath)}`);
  if (updateBaseline) {
    fs.writeFileSync(path.join(directory, 'dense-surface-baseline.json'), JSON.stringify({ generated: new Date().toISOString(), counts, maxChars, flaggedWithoutShort: coverage.withoutShort }, null, 2) + '\n');
    console.log('Wrote dense-surface-baseline.json');
  }
};
