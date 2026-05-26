import { expect, test } from '@playwright/test';

/**
 * Ticket #7 — ExperienceCard rendering across the 4 variants.
 *
 * Reaches the variants via the components/experience demo page, which
 * already renders one of each. Asserts presence of role/company/dates
 * and per-variant features (Badge current, +N indicator, axis, etc.).
 */
test.describe('ExperienceCard (ticket #7)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/experience');
  });

  test('renders all 4 variants on /components/experience', async ({ page }) => {
    for (const v of ['default', 'expanded', 'compact', 'timeline']) {
      await expect(page.locator(`.experience-card[data-variant="${v}"]`)).toBeVisible();
    }
  });

  test('default variant — top row + 3 stack tags + +N', async ({ page }) => {
    const card = page.locator('.experience-card[data-variant="default"]');
    await expect(card.getByText('Lead développeur front-end · Elao_')).toBeVisible();
    await expect(card.getByText(/2024.*aujourd'hui/)).toBeVisible();
    await expect(card.getByText('current', { exact: true })).toBeVisible();
    // 3 first stack tags from EXPERIENCES[0] (elao)
    await expect(card.getByText('react', { exact: true })).toBeVisible();
    await expect(card.getByText('astro', { exact: true })).toBeVisible();
    await expect(card.getByText('typescript', { exact: true })).toBeVisible();
    // overflow indicator (+2 since stack length is 5, max inline 3)
    await expect(card.getByText('+2', { exact: true })).toBeVisible();
  });

  test('expanded variant — description + full stack', async ({ page }) => {
    const card = page.locator('.experience-card[data-variant="expanded"]');
    await expect(card.locator('.experience-card-description')).toBeVisible();
    await expect(card.locator('.experience-card-description')).toContainText(/J'intègre Elao/);
    for (const tag of ['react', 'astro', 'typescript', 'testing', 'a11y']) {
      await expect(card.getByText(tag, { exact: true })).toBeVisible();
    }
    // No +N in expanded
    await expect(card.getByText(/^\+\d+$/)).toHaveCount(0);
  });

  test('compact variant — single row layout', async ({ page }) => {
    const card = page.locator('.experience-card[data-variant="compact"]');
    await expect(card.getByText('Lead développeur front-end', { exact: true })).toBeVisible();
    await expect(card.getByText('Elao_', { exact: true })).toBeVisible();
    await expect(card.getByText(/2024.*aujourd'hui/)).toBeVisible();
    // No badge in compact (intentional — Figma doesn't show it)
    await expect(card.getByText('current', { exact: true })).toHaveCount(0);
  });

  test('timeline variant — axis + year + body', async ({ page }) => {
    const card = page.locator('.experience-card[data-variant="timeline"]');
    await expect(card.locator('.experience-card-axis')).toBeVisible();
    await expect(card.getByText('2024', { exact: true })).toBeVisible();
    await expect(card.getByText('current', { exact: true })).toBeVisible();
    await expect(card.getByText('Lead développeur front-end · Elao_')).toBeVisible();
  });

  test('Badge uses status-success tokens', async ({ page }) => {
    const badge = page.locator('.experience-card[data-variant="default"] .badge').first();
    await expect(badge).toHaveAttribute('data-variant', 'success');
  });
});
