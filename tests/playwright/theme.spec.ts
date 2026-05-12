import { expect, test } from '@playwright/test';

/**
 * Waits for the ThemeToggle React island (client:idle) to be hydrated.
 * The component sets data-hydrated="true" inside its mount effect, so
 * once the selector resolves we know the click handler is wired.
 */
async function waitForHydratedToggle(page: import('@playwright/test').Page) {
  return page.waitForSelector('button[role="switch"][data-hydrated="true"]');
}

test.describe('Theme toggle (ticket #4)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('toggle bascule data-theme et persiste après reload', async ({ page }) => {
    await page.goto('/');

    // Deterministic starting point — don't rely on the runner's system preference.
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      document.documentElement.dataset.theme = 'light';
    });
    await page.reload();
    await waitForHydratedToggle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const toggle = page.getByRole('switch', { name: /thème/i });
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

    // Reload → still dark. The inline script in <head> reads localStorage
    // before first paint, so there's no FOUC.
    await page.reload();
    await waitForHydratedToggle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('toggle bascule retour à light', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      document.documentElement.dataset.theme = 'dark';
    });
    await page.reload();
    await waitForHydratedToggle(page);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const toggle = page.getByRole('switch', { name: /thème/i });
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
