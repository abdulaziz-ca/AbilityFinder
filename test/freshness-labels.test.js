'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { buildQueue } = require('../scripts/reverify-queue');
const app = fs.readFileSync('public/app.js', 'utf8');
function context() {
  const ctx = vm.createContext({window: {}, document: {}, console});
  const constants = ['DATA_VERIFIED_MONTH', 'STALE_MONTHS', 'MONTHS_EN'].map(n => app.match(new RegExp(`^const ${n} = .*;$`, 'm'))[0]);
  vm.runInContext(fs.readFileSync('public/data.js', 'utf8') + '\n' + constants.join('\n') + '\n' + app.match(/function verifiedFor\(b\) \{[\s\S]*?\n\}/)[0] + '\nglobalThis.freshness = verifiedFor; globalThis.levelOf = (id) => BENEFITS.find((b) => b.id === id).level;', ctx);
  return ctx;
}
test('every record has exactly one honest label, agrees with queue and generated guide', () => {
  const ctx = context();
  const queue = buildQueue();
  let inherited = 0;
  for (const record of queue) {
    const f = ctx.freshness(record);
    assert.equal(f.inherited, record.inherited, record.id);
    const ownLabel = /^Info verified \w+ \d{4}$/.test(f.wording);
    const inheritedLabel = /^Part of the \w+ \d{4} catalogue review$/.test(f.wording);
    assert.equal(Number(ownLabel) + Number(inheritedLabel), 1, record.id);
    assert.equal(inheritedLabel, record.inherited, record.id);
    inherited += Number(f.inherited);
    const file = `public/guides/${record.id}.html`;
    // The routing placeholder and dark-province records have no static guide.
    if (record.id === 'local-supports' || (ctx.levelOf(record.id) === 'Saskatchewan' && !/^const SK_ENABLED = true;/m.test(app)) || (/^(Manitoba|Winnipeg|Brandon)$/.test(ctx.levelOf(record.id)) && !/^const MB_ENABLED = true;/m.test(app)) || (/^(New Brunswick|Dieppe|Fredericton|Saint John|Moncton|Riverview|Bathurst|Campbellton|Edmundston|Miramichi|Oromocto|Quispamsis|Rothesay)$/.test(ctx.levelOf(record.id)) && !/^const NB_ENABLED = true;/m.test(app)) || (/^(Nova\ Scotia|Amherst|Antigonish|Bridgewater|Dartmouth|Glace\ Bay|Halifax|Kentville|Lunenburg|New\ Glasgow|Sydney|Truro|Wolfville|Yarmouth)$/.test(ctx.levelOf(record.id)) && !/^const NS_ENABLED = true;/m.test(app)) || (/^(Prince Edward Island|Charlottetown|Cornwall, PEI|Kensington|Montague|Souris|Stratford, PEI|Summerside|Alberton|Tignish)$/.test(ctx.levelOf(record.id)) && !/^const PE_ENABLED = true;/m.test(app)) || (/^(Newfoundland\ and\ Labrador|St\.\ John's|Conception\ Bay\ South|Paradise|Mount\ Pearl|Corner\ Brook|Grand\ Falls\-Windsor|Gander|Portugal\ Cove\-St\.\ Philip's|Happy\ Valley\-Goose\ Bay|Torbay|Labrador\ City|Clarenville|Stephenville)$/.test(ctx.levelOf(record.id)) && !/^const NL_ENABLED = true;/m.test(app)) || (/^(Quebec|Montréal|Ville\ de\ Québec|Laval|Gatineau|Longueuil|Sherbrooke|Saguenay|Lévis|Trois\-Rivières|Terrebonne|Saint\-Jean\-sur\-Richelieu|Repentigny|Brossard|Drummondville|Saint\-Jérôme|Granby)$/.test(ctx.levelOf(record.id)) && !/^const QC_ENABLED = true;/m.test(app))) { assert.equal(fs.existsSync(file), false); continue; }
    const html = fs.readFileSync(file, 'utf8');
    // French guides (Québec records) carry the same label in French.
    const months = { January: 'janvier', February: 'février', March: 'mars', April: 'avril', May: 'mai', June: 'juin', July: 'juillet', August: 'août', September: 'septembre', October: 'octobre', November: 'novembre', December: 'décembre' };
    const fr = f.wording.replace(/^Info verified (\w+) (\d{4})$/, (_, m, y) => `Information vérifiée en ${months[m]} ${y}`)
      .replace(/^Part of the (\w+) (\d{4}) catalogue review$/, (_, m, y) => `Revue du catalogue de ${months[m]} ${y}`);
    const label = /<html lang="fr-CA">/.test(html) ? fr : f.wording;
    assert.ok(html.includes(`<span class="verified">${label}</span>`), record.id);
  }
  assert.equal(queue.length, 463);
  assert.equal(inherited, 5);
  assert.ok(app.includes('${vFresh.wording}'));
});
