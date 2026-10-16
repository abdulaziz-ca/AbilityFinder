'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const api = require('../public/stateManager');
const { FACT_REGISTRY: registry, cleanConfirmedFacts: clean, confirmedGatePasses: passes } = api;
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync('public/data.js', 'utf8') + '\nglobalThis.benefits = BENEFITS;', ctx);
const app = fs.readFileSync('public/app.js', 'utf8');
function fact(id, gate, value = 'yes', version = registry[id][gate].version) {
  return { [id]: { [gate]: { version, components: Object.fromEntries(Object.keys(registry[id][gate].components).map(c => [c, value])) } } };
}
test('reviewed registry covers exactly all program uses of the three pilot gates', () => {
  const keys = ['mobilityplusRegistered', 'cnibCustomer', 'atpApproval'];
  const pairs = ctx.benefits.flatMap(b => b.requires.filter(k => keys.includes(k)).map(k => `${b.id}:${k}`));
  const actual = Object.entries(registry).flatMap(([id, gates]) => Object.entries(gates).map(([k, g]) => {
    assert.ok(Number.isInteger(g.version)); assert.ok(Object.keys(g.components).length);
    assert.ok(g.help); Object.values(g.components).forEach(q => assert.ok(q.endsWith('?')));
    return `${id}:${k}`;
  }));
  assert.deepEqual(actual.sort(), Array.from(pairs).sort());
});
test('strict confirmation validation rejects malformed, unknown, stale and oversized data without crashing', () => {
  for (const input of [null, false, [], 'yes', {unknown: {}}, Object.fromEntries(Array.from({length: 1000}, (_, i) => [i, {}])), new Proxy({}, { ownKeys() { throw Error(); } })]) assert.deepEqual(clean(input), {});
  for (const [id, gates] of Object.entries(registry)) for (const gate of Object.keys(gates)) {
    const good = fact(id, gate);
    assert.deepEqual(clean(good), good);
    assert.deepEqual(api.restorePersistedState(api.buildPersistedState({confirmedFacts: good})).confirmedFacts, good);
    for (const version of [0, registry[id][gate].version + 1, '1', 1.5, ... (registry[id][gate].version === 2 ? [1] : [])]) assert.deepEqual(clean(fact(id, gate, 'yes', version)), {});
    for (const value of [true, null, 'YES', 'x'.repeat(10000)]) assert.deepEqual(clean(fact(id, gate, value)), {});
    const bad = fact(id, gate); bad[id][gate].components.secret = 'yes'; assert.deepEqual(clean(bad), {});
  }
  assert.deepEqual(api.restorePersistedState({schemaVersion: 2}).confirmedFacts, {});
});
test('evaluate requires explicit all-yes, scoped versioned components; refusals and other gates survive', () => {
  const engine = app.slice(app.indexOf('function evaluate(benefit'), app.indexOf('/* =============================================================================\n   WIZARD STEPS'));
  const sandbox = vm.createContext({ AbilityFinderState: api, confirmedFacts: {}, answers: {}, REQS: {
    mobilityplusRegistered: {met: () => false, fixed: false, unmet: 'registration'},
    cnibCustomer: {met: () => false, fixed: false, unmet: 'customer'},
    atpApproval: {met: () => false, fixed: false, unmet: 'approval'},
    refusal: {met: () => false, fixed: true, unmet: 'wrong city'},
    external: {met: () => false, fixed: false, unmet: 'official decision'}
  } });
  vm.runInContext(engine, sandbox);
  for (const [id, gates] of Object.entries(registry)) for (const gate of Object.keys(gates)) {
    const benefit = {id, requires: [gate]};
    for (const value of ['no', 'unsure', undefined]) assert.equal(sandbox.evaluate(benefit, value ? fact(id, gate, value) : {}).status, 'almost');
    const yes = fact(id, gate);
    assert.equal(sandbox.evaluate(benefit, yes).status, 'ready');
    assert.equal(sandbox.evaluate({...benefit, id: 'wrong-program'}, yes).status, 'almost');
    assert.equal(sandbox.evaluate(benefit, fact(id, gate, 'yes', registry[id][gate].version + 1)).status, 'almost');
    assert.equal(sandbox.evaluate(benefit, {[id]: {[gate]: {version: 1, components: {}}}}).status, 'almost');
    assert.equal(sandbox.evaluate({...benefit, requires: [gate, 'refusal']}, yes).status, 'no');
    assert.equal(sandbox.evaluate({...benefit, requires: [gate, 'external']}, yes).status, 'almost');
    assert.equal(passes(id, gate, yes), true);
  }
});
