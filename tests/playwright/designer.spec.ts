import { expect, test } from '@playwright/test';

/**
 * Ticket #11 — Persona "Designer".
 *
 * A designer clicks a variant in the Preview tab and expects the
 * InspectPanel on the right to update with the variant's properties +
 * tokens. This is the Dev-Mode-Figma metaphor end-to-end.
 */
test.describe('Persona — Designer (ticket #11)', () => {
  test('clicking a variant card mutates InspectPanel content', async ({ page }) => {
    await page.goto('/components/experience');

    const panel = page.locator('.inspect-panel');
    await expect(panel).toHaveAttribute('data-state', 'empty');

    const card = page
      .locator('.experience-card-selectable')
      .filter({ has: page.locator('.experience-card[data-variant="default"]') })
      .first();
    await expect(card).toHaveAttribute('data-hydrated', 'true');
    await card.click();

    await expect(panel).toHaveAttribute('data-state', 'populated');
    await expect(panel).toHaveAttribute('data-selected-kind', 'experience');
    await expect(panel.getByRole('heading', { name: 'TOKENS' })).toBeVisible();
  });
});
