import { expect, test } from '@playwright/test';

/**
 * Ticket #11 — Persona "Recruiter".
 *
 * The recruiter lands on the home page, navigates to the components area
 * and expects to see the `timeline` variant of `<ExperienceCard>` rendered
 * within 5s. This is the canonical "fast first impression" path.
 */
test.describe('Persona — Recruiter (ticket #11)', () => {
  test('home → /components/experience → timeline variant visible ≤ 5s', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Paul-Émile Moreau' }).first(),
    ).toBeVisible();

    // Measure only the second navigation — the user-perception window is
    // "click → see the timeline", not the full session boot.
    const start = Date.now();
    await page.goto('/components/experience');
    const timelineCard = page.locator('.experience-card[data-variant="timeline"]').first();
    await expect(timelineCard).toBeVisible({ timeout: 5_000 });

    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(5_000);
  });
});
