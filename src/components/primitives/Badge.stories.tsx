import type { Meta, StoryObj } from '@storybook/react-vite';
import Badge from './Badge';
import './Badge.css';

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'neutral'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = { args: { variant: 'success', children: 'current' } };
export const Warning: Story = { args: { variant: 'warning', children: 'draft' } };
export const Danger: Story = { args: { variant: 'danger', children: 'deprecated' } };
export const Info: Story = { args: { variant: 'info', children: 'new' } };
export const Neutral: Story = { args: { variant: 'neutral', children: 'archived' } };

export const Dark: Story = {
  args: { variant: 'success', children: 'current' },
  globals: { theme: 'dark' },
};
