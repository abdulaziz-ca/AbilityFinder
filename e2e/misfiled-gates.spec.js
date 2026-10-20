const { test, expect } = require('@playwright/test');
const { buildAll } = require('./oracle/build-personas');

test('converted context stays on guides while unresolved checks prevent false readiness', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => typeof evaluateAnswers === 'function');
  // The engine probes below need every province, not only the federal set loaded at boot.
  await page.evaluate(() => typeof ensurePacks === "function" ? ensurePacks(COVERED_PROVINCES) : null);
  const catalogue = await page.evaluate(() => BENEFITS.map(b => ({ id: b.id, requires: b.requires })));
  const ids = ['cdb-adult', 'rdsp', 'bc-cy-disability-benefit'];
  const cases = buildAll(catalogue).filter(c => ids.includes(c.id));
  const statuses = await page.evaluate(personas => personas.map(p => {
    const hit = evaluateAnswers(p.answers).find(e => e.b.id === p.programId);
    return [p.programId, hit.r.status];
  }), cases.map(c => ({ ...c.bestCase, programId: c.id })));
  expect(statuses).toHaveLength(3);
  for (const [id, status] of statuses) expect(status, id).toBe('almost');
  const cdb = catalogue.find(b => b.id === 'cdb-adult');
  const rdsp = catalogue.find(b => b.id === 'rdsp');
  expect(cdb.requires).toEqual(['dtc', 'workingAge', 'cdbTaxFiling', 'cdbStatus']);
  expect(rdsp.requires).toEqual(['dtc', 'under60', 'rdspOpening', 'rdspContributionWindow']);
  expect(catalogue.find(b => b.id === 'bc-cy-disability-benefit').requires).toContain('bcCydbIntake');
  const gates = await page.evaluate(() => ({
    contribution: REQS.rdspContributionWindow.met({}),
    intake: REQS.bcCydbIntake.met({}),
    amountRemoved: !('cdbAmountCalculation' in REQS),
    grantRemoved: !('rdspGrantWindow' in REQS),
  }));
  expect(gates).toEqual({ contribution: false, intake: false, amountRemoved: true, grantRemoved: true });
  const liveContext = await page.evaluate(() => Object.fromEntries(
    ['cdb-adult', 'rdsp'].map(id => {
      const b = BENEFITS.find(b => b.id === id);
      const host = document.createElement('div');
      host.innerHTML = renderGuideBody(b, evaluate(b));
      return [id, host.textContent];
    })
  ));
  expect(liveContext['cdb-adult']).toContain("The benefit amount will start to decrease after your adjusted family net income reaches a certain threshold.");
  expect(liveContext.rdsp).toContain("A beneficiary's RDSP can receive a grant on contributions made until December 31 of the year in which the beneficiary turns 49.");
  expect(liveContext.rdsp).toContain("A bond can be paid into an RDSP until the year in which the beneficiary turns 49.");
});

for (const [id, sentences] of [
  ['cdb-adult', [
    "If your adjusted family net income is considerably above that threshold, your benefit amount will be $0.",
    "Benefit amounts are based on your adjusted family net income.",
    "The benefit amount will start to decrease after your adjusted family net income reaches a certain threshold.",
  ]],
  ['rdsp', [
    'Grants and bonds follow a different, earlier deadline than contributions.',
    "A beneficiary's RDSP can receive a grant on contributions made until December 31 of the year in which the beneficiary turns 49.",
    "A bond can be paid into an RDSP until the year in which the beneficiary turns 49.",
    'Check which of the two windows applies to you.',
  ]],
]) {
  test(`${id} generated guide retains the complete converted warning`, async ({ page }) => {
    await page.goto(`/guides/${id}.html`);
    for (const text of sentences) await expect(page.locator('body')).toContainText(text);
  });
}
