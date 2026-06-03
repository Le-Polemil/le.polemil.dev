import { expect, test } from '@playwright/test';

/**
 * Ticket #39 — Visual fixes regression suite.
 *
 * Covers the three bugs surfaced by the live audit vs Figma 5:5 :
 *   1. Bilingual CSS swap hidden the inactive lang
 *   2. `/components/experience` Preview renders the 4 variants in a 2×2 grid
 *      (or wider) at desktop, never collapsing to 1×4 with room to spare
 *   3. Left rail `<nav class="app-nav">` renders the structured nav from
 *      Figma 5:5 with active state on `/components/experience`
 */
test.describe('Visual fixes (ticket #39)', () => {
  test('home renders only the active language', async ({ page }) => {
    await page.goto('/');
    const frHero = page.locator('section.home-hero[lang="fr"]');
    const enHero = page.locator('section.home-hero[lang="en"]');

    // Default is FR
    await expect(frHero).toBeVisible();
    await expect(enHero).toBeHidden();

    // Switch to EN via the data-lang attribute (same code path as LangToggle)
    await page.evaluate(() => {
      document.documentElement.dataset.lang = 'en';
    });
    await expect(frHero).toBeHidden();
    await expect(enHero).toBeVisible();
  });

  test('experience Preview grid renders 2×2 at desktop', async ({ page }, testInfo) => {
    // mobile-safari project has a narrower viewport — only assert 2×2 on chromium
    test.skip(testInfo.project.name !== 'chromium', 'mobile viewport falls back to 1×N grid');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/components/experience');

    const cards = page.locator(
      '.experience-preview .experience-card-selectable, .experience-preview > .experience-card',
    );
    await expect(cards).toHaveCount(4);

    // Cards live on exactly 2 distinct Y bands → 2×2 grid
    const boxes = await cards.evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().top)),
    );
    const uniqueRows = new Set(boxes);
    expect(uniqueRows.size).toBe(2);
  });

  test('left rail nav renders sections + active state', async ({ page }, testInfo) => {
    // The sidebar is hidden < 768px (mobile shell — #10) ; nav landmark is
    // still in the DOM but `display:none`. Only assert visibility at desktop.
    test.skip(testInfo.project.name !== 'chromium', 'mobile shell hides the desktop sidebar');

    // /experiences is the section page that ships with #41 (the
    // sidebar links there). /components/experience is now unlinked but
    // still routable as a dev surface (Code / Props tabs).
    await page.goto('/experiences');

    const nav = page.locator('nav.app-nav');
    await expect(nav).toBeVisible();

    // Three sections from Figma 5:5 — header stays "Composants" (the
    // angle-bracket "tag" style is the visual identity of the design
    // system nav, per the user's intent in #41).
    await expect(nav.getByRole('heading', { name: 'Composants' })).toBeVisible();
    await expect(nav.getByRole('heading', { name: 'Foundations' })).toBeVisible();
    await expect(nav.getByRole('heading', { name: 'Patterns' })).toBeVisible();

    // Active state on /experiences
    const activeLink = nav.locator('a.app-nav-item[data-active="true"]');
    await expect(activeLink).toHaveCount(1);
    await expect(activeLink).toHaveAttribute('href', '/experiences');
    await expect(activeLink).toHaveAttribute('aria-current', 'page');
  });
});
