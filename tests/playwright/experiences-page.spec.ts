import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

/**
 * Ticket #41 — /experiences page : list + TemplateOptions panel +
 * "Afficher plus" pill.
 *
 * `client:visible` islands are gated on `data-hydrated="true"` so the
 * Playwright runner doesn't race them — same pattern as #4/#5/#9.
 */

async function hydratedList(page: Page): Promise<Locator> {
  const list = page.locator('section.experiences-list-wrap[lang="fr"] .experience-list');
  await expect(list).toHaveAttribute('data-hydrated', 'true');
  return list;
}

async function hydratedOptions(page: Page): Promise<Locator> {
  const opts = page.locator('.template-options');
  await expect(opts).toHaveAttribute('data-hydrated', 'true');
  return opts;
}

test.describe('Experiences page (ticket #41)', () => {
  test('initial state shows 1 card + Afficher plus pill', async ({ page }) => {
    await page.goto('/experiences');
    const list = await hydratedList(page);
    const items = list.locator('.experience-list-item');
    await expect(items).toHaveCount(1);

    const pill = list.locator('.experience-list-pill');
    await expect(pill).toBeVisible();
    await expect(pill).toHaveAttribute('aria-expanded', 'false');
    await expect(pill.locator('[lang="fr"]')).toHaveText('Afficher plus');
  });

  test('clicking Afficher plus expands to all 5 cards', async ({ page }) => {
    await page.goto('/experiences');
    const list = await hydratedList(page);
    const pill = list.locator('.experience-list-pill');
    await pill.click();
    const items = list.locator('.experience-list-item');
    await expect(items).toHaveCount(5);
    await expect(pill).toHaveAttribute('aria-expanded', 'true');
    await expect(pill.locator('[lang="fr"]')).toHaveText('Afficher moins');
  });

  test('variant picker propagates to all cards', async ({ page }) => {
    await page.goto('/experiences');
    const list = await hydratedList(page);
    const options = await hydratedOptions(page);
    // Expand first so we can assert across all 5 cards
    await list.locator('.experience-list-pill').click();

    // Initial : default variant
    await expect(list.locator('.experience-card[data-variant="default"]')).toHaveCount(5);

    // Click compact variant pill
    await options.getByRole('radio', { name: 'Compact' }).click();
    await expect(list.locator('.experience-card[data-variant="compact"]')).toHaveCount(5);
    await expect(list.locator('.experience-card[data-variant="default"]')).toHaveCount(0);
  });

  test('accent picker swaps the active swatch + the cascaded --accent', async ({ page }) => {
    await page.goto('/experiences');
    // Wait for the list island to hydrate so the right panel options
    // are guaranteed to be reactive too (both islands share the store).
    await hydratedList(page);
    const options = await hydratedOptions(page);

    // Initially the "experience" swatch is active
    const experienceSwatch = options
      .locator('.template-options-swatch')
      .filter({ hasText: 'Experience' })
      .first();
    await expect(experienceSwatch).toHaveAttribute('data-active', 'true');

    // Click the Skill swatch
    const skillSwatch = options
      .locator('.template-options-swatch')
      .filter({ hasText: 'Compétence' })
      .first();
    await skillSwatch.click();
    await expect(skillSwatch).toHaveAttribute('data-active', 'true');
    await expect(experienceSwatch).toHaveAttribute('data-active', 'false');

    // The chosen accent is set as an inline `--main-accent` on <html>
    // (drives `--accent` for every consumer on the page — sidenav,
    // ExperienceCard internals, etc.). Poll because the useEffect fires
    // after React's commit, which may land a tick after the click.
    await expect
      .poll(async () =>
        page.evaluate(() => document.documentElement.style.getPropertyValue('--main-accent')),
      )
      .toBe('var(--accent-skill)');
  });

  test('show-stack toggle hides the tags', async ({ page }) => {
    await page.goto('/experiences');
    const list = await hydratedList(page);
    const options = await hydratedOptions(page);

    // Default = stack visible
    await expect(list.locator('.experience-card-tag').first()).toBeVisible();

    // Untick the toggle
    await options.getByLabel('Afficher les technos').uncheck();
    await expect(list.locator('.experience-card-tag').first()).toBeHidden();
  });
});
