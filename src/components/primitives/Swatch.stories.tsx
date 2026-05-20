import type { Meta, StoryObj } from '@storybook/react-vite';
import Swatch from './Swatch';
import './Swatch.css';

const meta = {
  title: 'Primitives/Swatch',
  component: Swatch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Swatch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Background: Story = {
  args: { token: '--bg-canvas', hex: '#F8F4EC' },
};

export const ForegroundTextSample: Story = {
  args: { token: '--fg-primary', hex: '#1F1B14', kind: 'text-sample' },
};

export const AccentExperience: Story = {
  args: { token: '--accent-experience', hex: '#534AB7' },
  globals: { page: 'experience' },
};

export const StatusDangerBg: Story = {
  args: { token: '--status-danger-bg', hex: '#FBE3E3' },
};

export const Dark: Story = {
  args: { token: '--bg-canvas', hex: '#0F0F11' },
  globals: { theme: 'dark' },
};
