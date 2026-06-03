import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Ticket #11 — Accessibility audit (WCAG 2.1 AA via axe-core).
 *
 * Sweeps the routes that hold user-facing content today. Pages added later
 * (about, ProjectCard pages, …) should be appended here as they land.
 *
 * The axe tag set targets WCAG 2.1 A + AA plus axe's "best practices" lane;
 * we explicitly *do not* include `experimental` rules — those evolve too
 * fast to act as a CI gate.
 */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

const PAGES: ReadonlyArray<{ name: string; path: string }> = [
  { name: 'Home', path: '/' },
  { name: 'Components/Experience (Preview)', path: '/components/experience' },
];

test.describe('a11y — no axe-core violations', () => {
  for (const { name, path } of PAGES) {
    test(`${name} (${path})`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
