const { test, expect } = require('@playwright/test');
const { gotoReady } = require('./app-ready');
for (const inherited of [true, false]) {
  test(`${inherited ? 'catalogue' : 'individual'} review label on detail`, async ({ page }) => {
    await gotoReady(page);
    const expected = await page.evaluate(inherited => {
      const b = BENEFITS.find(b => !BENEFIT_VERIFIED[b.id] === inherited);
      const f = verifiedFor(b);
      setState('detail', { detailId: b.id });
      return { wording: f.wording, inherited: f.inherited };
    }, inherited);
    expect(expected.inherited).toBe(inherited);
    await expect(page.locator('.side-foot .verified')).toHaveText(expected.wording);
    expect(expected.wording).toMatch(inherited ? /^Part of the .* catalogue review$/ : /^Info verified /);
  });
}
test('About reports live verification counts and catalogue month', async ({ page }) => {
  await gotoReady(page);
  const sentence = await page.evaluate(() => {
    const own = BENEFITS.filter(b => !!BENEFIT_VERIFIED[b.id]).length;
    setState('about');
    return `${own} programs were individually re-checked against their official source; the remaining ${BENEFITS.length - own} were last checked in the ${verifiedFor(null).label} catalogue review.`;
  });
  await expect(page.locator('#app')).toContainText(sentence);
});
