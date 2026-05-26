import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Ticket #9 — InspectPanel wired to selectedItem store.
 *
 * Verifies SSR (empty state visible) + hydration (click on a variant
 * mutates the store + panel re-renders).
 */

async function selectableCard(page: Page, variant: string) {
  const card = page
    .locator('.experience-card-selectable')
    .filter({ has: page.locator(`.experience-card[data-variant="${variant}"]`) })
    .first();
  // Wait for the React island (client:idle) to mount before interacting —
  // without this, mobile-safari races the test runner.
  await expect(card).toHaveAttribute('data-hydrated', 'true');
  return card;
}

test.describe('InspectPanel (ticket #9)', () => {
  test('renders empty state by default on /foundations/colors', async ({ page }) => {
    await page.goto('/foundations/colors');
    const panel = page.locator('.inspect-panel');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('data-state', 'empty');
    await expect(panel.getByText(/Sélectionne un élément/)).toBeVisible();
  });

  test('click on a variant card populates the panel', async ({ page }) => {
    await page.goto('/components/experience');
    const panel = page.locator('.inspect-panel');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveAttribute('data-state', 'empty');

    const card = await selectableCard(page, 'default');
    await card.click();

    await expect(panel).toHaveAttribute('data-state', 'populated');
    await expect(panel).toHaveAttribute('data-selected-kind', 'experience');

    // Properties section
    await expect(panel.getByRole('heading', { name: 'PROPERTIES' })).toBeVisible();
    await expect(panel.getByText('Lead développeur front-end')).toBeVisible();
    await expect(panel.getByText('Elao_', { exact: true })).toBeVisible();

    // Tokens section
    await expect(panel.getByRole('heading', { name: 'TOKENS' })).toBeVisible();
    await expect(panel.getByText('--accent', { exact: true })).toBeVisible();

    // Used In section
    await expect(panel.getByRole('heading', { name: 'USED IN' })).toBeVisible();
    await expect(panel.getByRole('link', { name: /Pattern Timeline/ })).toBeVisible();
  });

  test('selected card shows pressed state', async ({ page }) => {
    await page.goto('/components/experience');
    const card = await selectableCard(page, 'expanded');
    await expect(card).toHaveAttribute('aria-pressed', 'false');
    await card.click();
    await expect(card).toHaveAttribute('aria-pressed', 'true');
    await expect(card).toHaveAttribute('data-selected', 'true');
  });

  test('keyboard activation (Enter) selects', async ({ page }) => {
    await page.goto('/components/experience');
    const card = await selectableCard(page, 'default');
    await card.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.inspect-panel')).toHaveAttribute('data-state', 'populated');
  });
});
