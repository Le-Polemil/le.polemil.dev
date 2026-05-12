import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)', '../src/styles/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-themes'],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (cfg) => {
    // Mirror the project's @ alias so stories can import from @/...
    cfg.resolve = cfg.resolve ?? {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias as Record<string, string>),
      '@': new URL('../src', import.meta.url).pathname,
    };
    return cfg;
  },
};

export default config;
