import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Ticket #47 — per-experience detail panel on /experiences.
 *
 * Right-rail flips between TemplateOptions (no selection) and
 * ExperienceDetail. The whole list item is the selector — clicking
 * anywhere on the section toggles its selection.
 */

async function listHydrated(page: Page) {
  const list = page.locator('section.experiences-list-wrap[lang="fr"] .experience-list');
  await expect(list).toHaveAttribute('data-hydrated', 'true');
  return list;
}

test.describe('Experience detail panel (ticket #47)', () => {
  test('initial right panel shows TemplateOptions, no detail', async ({ page }) => {
    await page.goto('/experiences');
    await listHydrated(page);
    await expect(page.locator('.template-options')).toBeVisible();
    await expect(page.locator('.experience-detail')).toHaveCount(0);
  });

  test('clicking an experience section swaps the right panel to ExperienceDetail', async ({
    page,
  }) => {
    await page.goto('/experiences');
    const list = await listHydrated(page);

    const firstItem = list.locator('.experience-list-item').first();
    const firstTrigger = firstItem.locator('.experience-list-item-trigger');
    await firstTrigger.click();

    await expect(page.locator('.experience-detail')).toBeVisible();
    await expect(page.locator('.template-options')).toHaveCount(0);
    await expect(firstItem).toHaveAttribute('data-selected', 'true');
    await expect(firstTrigger).toHaveAttribute('aria-pressed', 'true');
  });

  test('close button reverts to TemplateOptions', async ({ page }) => {
    await page.goto('/experiences');
    const list = await listHydrated(page);

    await list.locator('.experience-list-item').first().click();
    await expect(page.locator('.experience-detail')).toBeVisible();

    await page.locator('.experience-detail-close').click();
    await expect(page.locator('.experience-detail')).toHaveCount(0);
    await expect(page.locator('.template-options')).toBeVisible();
    await expect(list.locator('.experience-list-item[data-selected="true"]')).toHaveCount(0);
  });

  test('clicking the selected section toggles it off', async ({ page }) => {
    await page.goto('/experiences');
    const list = await listHydrated(page);

    const first = list.locator('.experience-list-item').first();
    await first.click();
    await expect(page.locator('.experience-detail')).toBeVisible();
    await first.click();
    await expect(page.locator('.experience-detail')).toHaveCount(0);
    await expect(page.locator('.template-options')).toBeVisible();
  });

  test('clicking another section replaces the active selection', async ({ page }) => {
    await page.goto('/experiences');
    const list = await listHydrated(page);

    await list.locator('.experience-list-pill').click();
    const items = list.locator('.experience-list-item');
    await items.nth(0).click();
    const titleBefore = await page.locator('.experience-detail-title').textContent();

    await items.nth(1).click();
    const titleAfter = await page.locator('.experience-detail-title').textContent();
    expect(titleAfter).not.toBe(titleBefore);
    await expect(list.locator('.experience-list-item[data-selected="true"]')).toHaveCount(1);
  });
});
