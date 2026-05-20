/**
 * Source of truth for the Foundations/Colors page (ticket #6).
 * Hex values are the LIGHT theme values from src/styles/tokens.css —
 * they are displayed as info, never used as fills. Tiles always render
 * via `var(--token)`, so toggling theme repaints them automatically.
 */

export interface ColorTokenGroup {
  label: string;
  description?: string;
  kind: 'color' | 'text-sample';
  tokens: ReadonlyArray<{ token: string; hex: string }>;
}

export const COLOR_TOKEN_GROUPS: ReadonlyArray<ColorTokenGroup> = [
  {
    label: 'Background',
    kind: 'color',
    tokens: [
      { token: '--bg-canvas', hex: '#F8F4EC' },
      { token: '--bg-app', hex: '#FBF8F2' },
      { token: '--bg-surface', hex: '#FFFFFF' },
      { token: '--bg-subtle', hex: '#F1ECE2' },
      { token: '--bg-inset', hex: '#EBE5D8' },
    ],
  },
  {
    label: 'Border',
    kind: 'color',
    tokens: [
      { token: '--border-subtle', hex: '#E5DECF' },
      { token: '--border-default', hex: '#D6CDB9' },
      { token: '--border-strong', hex: '#B6AB91' },
    ],
  },
  {
    label: 'Foreground',
    kind: 'text-sample',
    tokens: [
      { token: '--fg-primary', hex: '#1F1B14' },
      { token: '--fg-secondary', hex: '#52493A' },
      { token: '--fg-tertiary', hex: '#8B816E' },
      { token: '--fg-on-accent', hex: '#FFFFFF' },
    ],
  },
  {
    label: 'Accents — per page',
    kind: 'color',
    tokens: [
      { token: '--accent-default', hex: '#534AB7' },
      { token: '--accent-experience', hex: '#534AB7' },
      { token: '--accent-project', hex: '#E89A4B' },
      { token: '--accent-skill', hex: '#5A8E2E' },
      { token: '--accent-contact', hex: '#1E78B4' },
      { token: '--accent-about', hex: '#C44A6B' },
      { token: '--accent-timeline', hex: '#7A4FB7' },
    ],
  },
  {
    label: 'Status',
    kind: 'color',
    tokens: [
      { token: '--status-success-bg', hex: '#E1F5EE' },
      { token: '--status-success-fg', hex: '#085041' },
      { token: '--status-warning-bg', hex: '#FBEFD3' },
      { token: '--status-warning-fg', hex: '#6B4A0A' },
      { token: '--status-danger-bg', hex: '#FBE3E3' },
      { token: '--status-danger-fg', hex: '#8C2222' },
      { token: '--status-info-bg', hex: '#DCEEFB' },
      { token: '--status-info-fg', hex: '#0E4D7A' },
    ],
  },
] as const;
