import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '@/styles/global.css';

type ThemeValue = 'light' | 'dark';
type PageValue =
  | 'experience'
  | 'project'
  | 'skill'
  | 'contact'
  | 'about'
  | 'timeline'
  | 'foundations-colors';

/**
 * Drive theme + per-page accent via toolbar globals.
 * data-theme on <html> swaps the neutral palette ; data-page on <body>
 * picks the accent. Matches the runtime contract from src/styles/.
 */
const withDesignSystemRoots: Decorator = (Story, ctx) => {
  const theme = (ctx.globals.theme ?? 'light') as ThemeValue;
  const page = (ctx.globals.page ?? 'foundations-colors') as PageValue;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.page = page;
    return () => {
      delete document.documentElement.dataset.theme;
      delete document.body.dataset.page;
    };
  }, [theme, page]);

  return (
    <div
      style={{
        padding: 'var(--space-6)',
        background: 'var(--bg-app)',
        color: 'var(--fg-primary)',
        minBlockSize: '100vh',
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light / Dark — drives <html data-theme>',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    page: {
      name: 'Page accent',
      description: 'Per-page accent — drives <body data-page>',
      defaultValue: 'foundations-colors',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'foundations-colors', title: 'Foundations (neutral)' },
          { value: 'experience', title: 'Experience (violet)' },
          { value: 'project', title: 'Project (orange)' },
          { value: 'skill', title: 'Skill (vert)' },
          { value: 'contact', title: 'Contact (bleu)' },
          { value: 'about', title: 'About (framboise)' },
          { value: 'timeline', title: 'Timeline (mauve)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withDesignSystemRoots],
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
