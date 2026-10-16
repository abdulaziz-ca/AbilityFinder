const { test, expect } = require('@playwright/test');
const { gotoReady } = require('./app-ready');
for (const [province, city] of [['AB','Calgary'], ['BC','Vancouver'], ['ON','Kitchener']]) {
  test(`${province} results, counts, scenario and print exclude other-province locals`, async ({ page }) => {
    await gotoReady(page);
    const result = await page.evaluate(({ province, city }) => {
      answers = { ...BLANK(), province, city, forWho: 'self', ageBand: '19to59', ageGroup: 'adult', citizenPR: true, disabilities: ['physical'], functionalNeeds: ['mobility'], income: 'low' };
      // The 2-1-1 fallback is nationwide, not a municipal record.
      const locals = BENEFITS.filter(b => benefitIsLocal(b) && b.id !== 'local-supports');
      const unclassified = locals.filter(b => !benefitProvince(b)).map(b => b.id);
      const excluded = locals.filter(b => benefitProvince(b) !== province || (city === 'Calgary' && b.id === 'okotoks-fee-assistance'));
      const html = renderResults();
      scenarioChanges.set('income', { key: 'income', value: 'high' });
      const scenarioHtml = renderResults();
      let printHtml = '';
      window.open = () => ({ document: { write: s => { printHtml = s; }, close() {} }, focus() {}, print() {} });
      printResults();
      const no = browseCatalog().filter(b => benefitInResultsScope(b, answers) && evaluate(b).status === 'no');
      const count = html.match(/<details class="notmatch">\s*<summary>[^<]*\((\d+)\)/);
      return { unclassified, leaks: excluded.filter(b => [html, scenarioHtml, printHtml].some(s => s.includes(b.name))).map(b => b.id), count: count ? +count[1] : 0, expectedCount: no.length };
    }, { province, city });
    expect(result.unclassified).toEqual([]);
    expect(result.leaks).toEqual([]);
    expect(result.count).toBe(result.expectedCount);
  });
}
test('unasked homeowner is unknown, not a Waterloo refusal', async ({ page }) => {
  await gotoReady(page);
  const result = await page.evaluate(() => {
    answers = { ...BLANK(), province: 'ON', city: 'Kitchener', forWho: 'self', ageBand: '19to59', ageGroup: 'adult', income: 'low' };
    const b = BENEFITS.find(b => b.id === 'waterloo-ontario-renovates');
    const unknown = evaluate(b);
    const html = renderResults();
    answers.circumstances = ['none'];
    return { unknown, explicitNo: evaluate(b).status, noList: html.split('<details class="notmatch">')[1]?.split('</details>')[0] || '' };
  });
  expect(result.unknown.status).toBe('almost');
  expect(result.unknown.needs.map(n => n.key)).toContain('homeowner');
  expect(result.noList).not.toContain('Waterloo Ontario Renovates');
  expect(result.explicitNo).toBe('no');
});
test('Okotoks keeps Foothills and unknown-city paths, but not Calgary or other provinces', async ({ page }) => {
  await gotoReady(page);
  const rows = await page.evaluate(() => {
    const b = BENEFITS.find(b => b.id === 'okotoks-fee-assistance');
    return ['Okotoks', 'Foothills County', null, "Other / my town isn't listed", 'Calgary'].map(city => {
      answers = { ...BLANK(), province: 'AB', city, income: 'low' };
      return { city, included: benefitInResultsScope(b, answers), status: evaluate(b).status };
    }).concat(['BC','ON','other'].map(province => {
      answers = { ...BLANK(), province, city: null, income: 'low' };
      return { province, included: benefitInResultsScope(b, answers), status: evaluate(b).status };
    }));
  });
  expect(rows.map(r => r.included)).toEqual([true,true,true,true,false,false,false,false]);
  expect(rows.map(r => r.status)).toEqual(['almost','almost','almost','almost','no','no','no','no']);
});
