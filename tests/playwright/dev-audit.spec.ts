import { expect, test } from '@playwright/test';

/**
 * Ticket #11 — Persona "Dev (audit)".
 *
 * A dev opens the component doc page, switches to the Code tab to read the
 * JSX, then to the Props tab to check the API. Validates that both
 * developer-facing surfaces are reachable and contain the right artefacts.
 */
test.describe('Persona — Dev audit (ticket #11)', () => {
  test('Code tab exposes the JSX sample for <Experience />', async ({ page }) => {
    await page.goto('/components/experience/code');
    const block = page.locator('.code-block');
    await expect(block).toBeVisible();
    await expect(block).toContainText('ExperienceCard');
  });

  test('Props tab exposes the props table', async ({ page }) => {
    await page.goto('/components/experience/props');
    const table = page.locator('table.props-table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'NAME' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'TYPE' })).toBeVisible();
  });
});
