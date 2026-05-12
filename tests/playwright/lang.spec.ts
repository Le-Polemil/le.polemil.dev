import { expect, test } from '@playwright/test';

/**
 * The LangToggle React island (client:idle) writes data-hydrated="true"
 * inside its mount effect, so we can deterministically wait for the click
 * handler to be wired before asserting.
 */
async function waitForHydratedLangToggle(page: import('@playwright/test').Page) {
  return page.waitForSelector('fieldset.lang-toggle[data-hydrated="true"]');
}

test.describe('Lang toggle (ticket #5)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('renders with data-lang="fr" by default (FR canonique)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'fr');
  });

  test('toggle bascule data-lang et persiste après reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('lang');
      document.documentElement.dataset.lang = 'fr';
    });
    await page.reload();
    await waitForHydratedLangToggle(page);
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'fr');

    // Click "EN" → flip + persist.
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'en');
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('lang'))).toBe('en');

    // Reload → still EN. The inline script in <head> applies data-lang
    // before paint, so the active language doesn't flash.
    await page.reload();
    await waitForHydratedLangToggle(page);
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'en');
  });

  test('clicking the active option is a no-op', async ({ page }) => {
    await page.goto('/');
    await waitForHydratedLangToggle(page);
    const fr = page.getByRole('button', { name: 'FR', exact: true });
    await expect(fr).toHaveAttribute('aria-pressed', 'true');
    await fr.click();
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'fr');
  });
});
