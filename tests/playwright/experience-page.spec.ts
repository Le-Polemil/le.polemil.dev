import { expect, test } from '@playwright/test';

/**
 * Ticket #8 — Components/Experience full page with Preview/Code/Props tabs.
 *
 * Each tab is a separate route (`/components/experience`, `/code`, `/props`).
 * Astro's <ClientRouter /> handles View Transition between them — the AC
 * mentions "?tab= ou nanostore" ; sub-routes are an idiomatic equivalent.
 */
test.describe('Components/Experience (ticket #8)', () => {
  test('Preview route renders ExperiencePreview with 4 variants', async ({ page }) => {
    await page.goto('/components/experience');
    await expect(page.getByRole('heading', { level: 1, name: '<Experience />' })).toBeVisible();
    await expect(page.getByText('Une expérience pro. 4 variants, 3 états.')).toBeVisible();

    for (const v of ['default', 'expanded', 'compact', 'timeline']) {
      await expect(page.locator(`.experience-card[data-variant="${v}"]`)).toBeVisible();
    }
  });

  test('Code route renders the code sample inside a CodeBlock', async ({ page }) => {
    await page.goto('/components/experience/code');
    await expect(page.locator('.code-block')).toBeVisible();
    await expect(page.locator('.code-block')).toContainText('ExperienceCard');
    await expect(page.locator('.code-block')).toContainText('variant="default"');
  });

  test('Props route renders the props table with all 3 props', async ({ page }) => {
    await page.goto('/components/experience/props');
    const table = page.locator('table.props-table');
    await expect(table).toBeVisible();

    // Header columns
    for (const col of ['NAME', 'TYPE', 'DEFAULT', 'DESCRIPTION']) {
      await expect(table.getByRole('columnheader', { name: col })).toBeVisible();
    }

    // Row names
    for (const name of ['experience', 'variant', 'maxStackInline']) {
      await expect(
        table.locator('tbody td.props-cell-name').getByText(name, { exact: true }),
      ).toBeVisible();
    }
  });

  test('TabBar has the correct active tab per route', async ({ page }) => {
    await page.goto('/components/experience');
    await expect(page.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.getByRole('tab', { name: 'Code' })).toHaveAttribute('aria-selected', 'false');

    await page.goto('/components/experience/code');
    await expect(page.getByRole('tab', { name: 'Code' })).toHaveAttribute('aria-selected', 'true');

    await page.goto('/components/experience/props');
    await expect(page.getByRole('tab', { name: 'Props' })).toHaveAttribute('aria-selected', 'true');
  });

  test('TabBar links navigate to the correct routes', async ({ page }) => {
    await page.goto('/components/experience');
    await page.getByRole('tab', { name: 'Code' }).click();
    await expect(page).toHaveURL(/\/components\/experience\/code$/);
    await page.getByRole('tab', { name: 'Props' }).click();
    await expect(page).toHaveURL(/\/components\/experience\/props$/);
    await page.getByRole('tab', { name: 'Preview' }).click();
    await expect(page).toHaveURL(/\/components\/experience$/);
  });
});
