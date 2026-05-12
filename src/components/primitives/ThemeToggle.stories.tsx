import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemeToggle from './ThemeToggle';
import './ThemeToggle.css';

const meta = {
  title: 'Primitives/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default state — the component reads localStorage + system preference
 * on mount, so the visual state may vary between page loads. To force
 * a specific theme in Storybook, use the Theme toolbar.
 */
export const Default: Story = {};

export const LightActive: Story = {
  globals: { theme: 'light' },
};

export const DarkActive: Story = {
  globals: { theme: 'dark' },
};
