import { expect, test } from '@playwright/test';

/**
 * Ticket #11 — Persona "Client".
 *
 * A prospective client lands on the home page and looks for a way to
 * contact: either a Calendly link (smoke-tested by checking the anchor
 * `href` only — no third-party navigation) or the `<ContactForm />`.
 *
 * Both touchpoints are owned by ticket #13 (cv components) and the
 * About / contact section. Until #13 lands, this spec only validates that
 * the home page renders, and skips the contact-specific assertions so the
 * test surface is in place for the day #13 ships.
 */
test.describe('Persona — Client (ticket #11)', () => {
  test('home page renders', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'polemil.dev' })).toBeVisible();
  });

  test.skip('Calendly link is reachable (smoke)', async ({ page }) => {
    await page.goto('/');
    const calendlyLink = page.getByRole('link', {
      name: /calendly|prendre.*rendez|book.*meeting/i,
    });
    await expect(calendlyLink).toBeVisible();
    const href = await calendlyLink.getAttribute('href');
    expect(href).toMatch(/calendly\.com/);
  });

  test.skip('ContactForm submits (depends on #13)', async ({ page }) => {
    await page.goto('/components/about');
    const form = page.locator('form.contact-form');
    await expect(form).toBeVisible();
  });
});
