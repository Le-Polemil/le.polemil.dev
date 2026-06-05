import { expect, test } from '@playwright/test';

/**
 * LangToggle was rebuilt as an iOS-style sliding switch in #45 :
 * a single `<button role="switch">` with `aria-checked` reflecting
 * whether EN is active (FR = unchecked, EN = checked).
 *
 * `data-hydrated="true"` is set inside the React mount effect so
 * Playwright can wait for the click handler to be wired.
 */
async function waitForHydratedLangToggle(page: import('@playwright/test').Page) {
  return page.waitForSelector('button.lang-toggle[data-hydrated="true"]');
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
    const toggle = await waitForHydratedLangToggle(page);
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'fr');
    await expect(page.locator('button.lang-toggle')).toHaveAttribute('aria-checked', 'false');

    // Click the switch → flip to EN + persist.
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'en');
    await expect(page.locator('button.lang-toggle')).toHaveAttribute('aria-checked', 'true');
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('lang'))).toBe('en');

    // Reload → still EN. The inline script in <head> applies data-lang
    // before paint, so the active language doesn't flash.
    await page.reload();
    await waitForHydratedLangToggle(page);
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'en');
    await expect(page.locator('button.lang-toggle')).toHaveAttribute('aria-checked', 'true');
  });

  test('switch flips both directions', async ({ page }) => {
    await page.goto('/');
    const toggle = await waitForHydratedLangToggle(page);
    await expect(page.locator('button.lang-toggle')).toHaveAttribute('aria-checked', 'false');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'en');
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-lang', 'fr');
  });
});
