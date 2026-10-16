const { test, expect } = require('@playwright/test');
const { gotoReady } = require('./app-ready');
function contrast(a, b) {
  const lum = s => s.match(/[\d.]+/g).slice(0,3).map(Number).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((n,v,i) => n + v * [.2126,.7152,.0722][i], 0);
  const x = lum(a), y = lum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
for (const theme of ['dark','light']) for (const highContrast of [false,true]) {
  test(`${theme}, high contrast ${highContrast}: hero, danger, button and footer contrast`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoReady(page);
    await page.evaluate(({theme,highContrast}) => {
      document.documentElement.dataset.theme = theme;
      document.body.classList.toggle('a11y-contrast', highContrast);
    }, {theme,highContrast});
    if (highContrast) {
      await expect(page.locator('.hero-atmos')).toBeHidden();
      const colors = await page.evaluate(() => {
        const css = getComputedStyle(document.body);
        const color = token => { const span = document.createElement('span'); span.style.color = css.getPropertyValue(token); document.body.append(span); const c = getComputedStyle(span).color; span.remove(); return c; };
        return Object.fromEntries(['--danger','--bg','--btn','--btn-ink','--text'].map(t => [t,color(t)]));
      });
      expect(contrast(colors['--text'], colors['--bg'])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors['--danger'], colors['--bg'])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors['--btn'], colors['--bg'])).toBeGreaterThanOrEqual(3);
      expect(contrast(colors['--btn'], colors['--btn-ink'])).toBeGreaterThanOrEqual(4.5);
    }
    await page.goto('/guides/aish.html');
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    const footer = page.locator('.site-footer a', { hasText: 'Privacy' });
    await expect(footer).toHaveClass('guide-link');
    const colors = await footer.evaluate(a => ({ ink: getComputedStyle(a).color, bg: getComputedStyle(document.body).backgroundColor }));
    expect(contrast(colors.ink, colors.bg)).toBeGreaterThanOrEqual(4.5);
  });
}
test('results have h1 and practitioner postal field has a persistent label', async ({ page }) => {
  await gotoReady(page);
  await page.evaluate(() => { answers = { ...BLANK(), province: 'AB', city: 'Calgary', forWho: 'self' }; view = 'results'; render(); });
  await expect(page.locator('.results-head h1')).toHaveCount(1);
  await page.evaluate(() => { detailId = 'aish'; view = 'detail'; render(); });
  await expect(page.getByLabel('Postal code (optional)', {exact:true})).toBeVisible();
});
for (const forWho of ['self','child','family']) test(`all shared routes render for ${forWho}`, async ({page}) => {
  await gotoReady(page);
  const failed = await page.evaluate(forWho => {
    answers = { ...BLANK(), forWho, province: 'AB', city: 'Calgary' }; detailId = 'aish'; helpTopic = 'dtc';
    return ['landing','wizard','results','browse','detail','privacy','about','support','updates','help','accessibility','professionals','partner-overview','impact','dtc-prep','grants','organizations'].filter(route => {
      try { view = route; render(); return !document.getElementById('app').textContent.trim() || !!document.querySelector('.render-error'); } catch (_) { return true; }
    });
  }, forWho);
  expect(failed).toEqual([]);
});
