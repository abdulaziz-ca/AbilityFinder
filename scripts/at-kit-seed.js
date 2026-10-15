'use strict';
// Synthetic local-only fixtures. The console snippets are also exercised verbatim
// by e2e/at-kit.spec.js. No browser globals are needed to print them.
const base = {
  forWho: 'self', disabilities: ['physical'], ageBand: '19to59', ageGroup: 'adult',
  disabilityVerified: 'yes', autismDiagnosis: null, onsetBefore18: false,
  canWalkFar: false, functionalNeeds: ['dailyLiving', 'transitBarrier'],
  province: 'AB', msp: null, bcAssistance: null, circumstances: ['none'],
  citizenPR: true, dtc: 'yes', situation: ['unableToWork'], income: 'low', city: 'Edmonton',
};
const personas = [
  { id: 'ab-self', label: 'AB adult', answers: { ...base } },
  { id: 'bc-child', label: 'BC child', answers: { ...base, forWho: 'child', disabilities: ['autism'], ageBand: 'under6', ageGroup: 'child', autismDiagnosis: 'yes', onsetBefore18: true, canWalkFar: null, functionalNeeds: ['childHighNeeds', 'communication'], province: 'BC', msp: 'yes', bcAssistance: 'none', dtc: 'no', situation: ['childcare'], city: 'Vancouver' } },
  { id: 'on-family', label: 'ON family member', answers: { ...base, forWho: 'family', province: 'ON', city: 'Toronto', dtc: 'no', disabilityVerified: 'unsure', functionalNeeds: ['dailyLiving', 'equipment'] } },
  { id: 'bc-self', label: 'BC adult with PWD', answers: { ...base, province: 'BC', city: 'Victoria', msp: 'yes', bcAssistance: 'pwd', functionalNeeds: ['dailyLiving', 'transitBarrier', 'equipment'] } },
  { id: 'no-matches', label: 'Outside covered provinces, no matches', answers: { ...base, disabilities: ['other'], disabilityVerified: 'no', canWalkFar: null, functionalNeeds: ['none'], province: 'other', citizenPR: false, dtc: 'no', situation: ['none'], income: 'high', city: null } },
  { id: 'returning', label: 'Returning AB visitor, pending updates', answers: { ...base }, returning: true },
];

// Run only in a script-free same-origin document, after closing other app tabs.
// Increment the stored revision rather than reset it. Match the schema used in
// e2e/what-changed.spec.js, including the per-program v1 review marker.
async function writeFixture(payload) {
  await new Promise((resolve, reject) => {
    const req = indexedDB.open('abilityfinder', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('sessionState', { keyPath: 'session_uuid' });
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('Close other app tabs and retry.'));
    req.onsuccess = () => {
      const db = req.result;
      const tx = db.transaction('sessionState', 'readwrite');
      const store = tx.objectStore('sessionState');
      const session_uuid = '00000000-0000-4000-8000-000000000001';
      const read = store.get(session_uuid);
      read.onsuccess = () => store.put({ session_uuid, revision: (read.result?.revision || 0) + 1, payload });
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onabort = () => { db.close(); reject(tx.error); };
      tx.onerror = () => {}; /* onabort reports the transaction error */
    };
  });
  console.info('AT fixture saved. Open the app root in this tab.');
}
function seedSnippet(persona) {
  const payload = { schemaVersion: 2, answers: persona.answers, view: 'results', progress: {}, ui: {} };
  if (persona.returning) {
    const fs = require('node:fs');
    const vm = require('node:vm');
    const path = require('node:path');
    const context = vm.createContext({});
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../public/data.js'), 'utf8') + '\nglobalThis.ids = BENEFITS.map(b => b.id);', context);
    payload.ui.programChanges = { version: 1, seenByProgram: Object.fromEntries(Array.from(context.ids, id => [id, 0])) };
    // A tracked nonmatch proves that saved/tracked updates remain reachable too.
    payload.progress['bc-autism-funding-under-6'] = 'saved';
  }
  return `(${writeFixture.toString()})(${JSON.stringify(payload)})`.replace(/\s*\n\s*/g, ' ');
}
if (require.main === module) {
  console.log('TEST PROFILE ONLY: overwrites this device’s saved answers. Close other app tabs.');
  console.log('Open the app origin’s /robots.txt (not a search page), then its browser console.');
  console.log('Paste ONE snippet; wait for “AT fixture saved”, then open the app root in the same tab.');
  console.log('No requests or navigation are made by these snippets. Do not paste into a real visitor profile.\n');
  for (const persona of personas) console.log(`${persona.id} — ${persona.label}\n${seedSnippet(persona)}\n`);
}
module.exports = { personas, seedSnippet };
