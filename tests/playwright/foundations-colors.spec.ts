import { expect, test } from '@playwright/test';

/**
 * Ticket #6 — Foundations/Colors page : route + click-to-copy interaction.
 *
 * The Swatch component shows a "Copié" feedback pill for ~1s. We assert
 * the feedback flag always (no permission needed) and the clipboard
 * contents only on chromium (WebKit headless doesn't expose a working
 * clipboard API in CI and rejects clipboard-write as an unknown permission).
 */
test.describe('Foundations/Colors (ticket #6)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('route /foundations/colors renders with the 5 groups', async ({ page }) => {
    await page.goto('/foundations/colors');
    // data-page moved from <body> to <html> in #41 so the inline accent
    // override from TemplateOptions can win over the page selector.
    await expect(page.locator('html')).toHaveAttribute('data-page', 'foundations-colors');
    await expect(page.getByRole('heading', { level: 1, name: 'Colors' })).toBeVisible();
    for (const group of ['Background', 'Border', 'Foreground', 'Accents — per page', 'Status']) {
      await expect(page.locator('section').filter({ hasText: group }).first()).toBeVisible();
    }
  });

  test('click on a swatch shows feedback + copies to clipboard', async ({
    page,
    context,
    browserName,
  }) => {
    // WebKit's headless clipboard API rejects writes and the
    // `clipboard-write` permission name itself — skip there. Real
    // Safari on a device works fine ; this is a Playwright limitation.
    test.skip(browserName === 'webkit', 'WebKit headless has no working clipboard API');

    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/foundations/colors');

    const swatch = page.getByRole('button', { name: 'Copier --bg-canvas dans le presse-papier' });
    await expect(swatch).toBeVisible();
    await swatch.click();
    await expect(swatch).toHaveAttribute('data-copied', 'true');

    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe('--bg-canvas');

    // Feedback clears after ~1s
    await expect(swatch).toHaveAttribute('data-copied', 'false', { timeout: 2000 });
  });
});
