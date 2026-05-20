export interface Experience {
  /** Stable identifier used for routing / selection. */
  id: string;
  /** Single letter shown in the avatar (typically the company initial). */
  initial: string;
  /** Job title, e.g. "Lead front-end". */
  role: string;
  /** Company name, e.g. "Elao". */
  company: string;
  /** Display string for the date range, e.g. "2021 — present". */
  dates: string;
  /** Short numeric year shown by the timeline variant, e.g. "2021". */
  startYear: string;
  /** Whether the experience is still on-going (drives the `current` badge). */
  current: boolean;
  /** Stack tags, mono uppercase-friendly. The default variant shows the first 3 + `+N`. */
  stack: ReadonlyArray<string>;
  /** Long description used by the `expanded` variant. */
  description: string;
}

export const EXPERIENCES: ReadonlyArray<Experience> = [
  {
    id: 'elao-lead',
    initial: 'E',
    role: 'Lead front-end',
    company: 'Elao',
    dates: '2021 — present',
    startYear: '2021',
    current: true,
    stack: ['react', 'remix', 'a11y', 'typescript', 'testing'],
    description:
      'Build and maintain the design system used across all client projects. Drive frontend craft, accessibility, and component library evolution. Mentor a team of 6 frontend engineers.',
  },
];
