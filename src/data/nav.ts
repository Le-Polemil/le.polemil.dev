/**
 * Left-rail navigation, structured per Figma frame 5:5.
 *
 * Each section has an eyebrow + a flat list of items. Items with `href`
 * link to an existing route ; items with `disabled: true` are shown as
 * styled placeholders (the page does not exist yet but its slot in the
 * nav is visible — matches the legacy polemil.dev nav rhythm).
 */

export interface NavItem {
  /** Stable id, also used to compute the active state from a `page` prop. */
  id: string;
  /** Display label in FR. */
  labelFr: string;
  /** Display label in EN. */
  labelEn: string;
  /** Route. Undefined → rendered as `<span>` placeholder, not `<a>`. */
  href?: string;
  /** When true, the item renders muted + non-interactive. */
  disabled?: boolean;
}

export interface NavSection {
  /** Stable id for the section (used as React key). */
  id: string;
  /** Eyebrow label in FR. */
  eyebrowFr: string;
  /** Eyebrow label in EN. */
  eyebrowEn: string;
  items: ReadonlyArray<NavItem>;
}

export const NAV: ReadonlyArray<NavSection> = [
  {
    id: 'components',
    eyebrowFr: 'Composants',
    eyebrowEn: 'Components',
    items: [
      {
        id: 'experiences',
        labelFr: '<Experiences />',
        labelEn: '<Experiences />',
        href: '/experiences',
      },
      { id: 'projects', labelFr: '<Projects />', labelEn: '<Projects />', disabled: true },
      { id: 'skills', labelFr: '<Skills />', labelEn: '<Skills />', disabled: true },
      { id: 'contact', labelFr: '<Contact />', labelEn: '<Contact />', disabled: true },
    ],
  },
  {
    id: 'foundations',
    eyebrowFr: 'Foundations',
    eyebrowEn: 'Foundations',
    items: [
      { id: 'colors', labelFr: 'Colors', labelEn: 'Colors', href: '/foundations/colors' },
      { id: 'typography', labelFr: 'Typography', labelEn: 'Typography', disabled: true },
      { id: 'spacing', labelFr: 'Spacing', labelEn: 'Spacing', disabled: true },
    ],
  },
  {
    id: 'patterns',
    eyebrowFr: 'Patterns',
    eyebrowEn: 'Patterns',
    items: [
      { id: 'timeline', labelFr: 'Timeline', labelEn: 'Timeline', disabled: true },
      { id: 'case-study', labelFr: 'Case Study', labelEn: 'Case Study', disabled: true },
      { id: 'about', labelFr: 'About', labelEn: 'About', disabled: true },
    ],
  },
];

/**
 * Resolve the active item id from the current pathname. Returns null when
 * no item matches (e.g. home page).
 */
export function activeNavItem(pathname: string): string | null {
  for (const section of NAV) {
    for (const item of section.items) {
      if (item.href && (pathname === item.href || pathname.startsWith(`${item.href}/`))) {
        return item.id;
      }
    }
  }
  return null;
}
