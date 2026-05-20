import type { Meta, StoryObj } from '@storybook/react-vite';
import ExperienceCard from './ExperienceCard';
import '@/components/primitives/Badge.css';
import './ExperienceCard.css';
import { EXPERIENCES } from '@/data/experiences';

const demoExperience = EXPERIENCES[0];
if (!demoExperience) throw new Error('experiences dataset is empty');

const meta = {
  title: 'CV/ExperienceCard',
  component: ExperienceCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { experience: demoExperience },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'expanded', 'compact', 'timeline'],
    },
    experience: { control: false },
  },
} satisfies Meta<typeof ExperienceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: 'default' } };
export const Expanded: Story = { args: { variant: 'expanded' } };
export const Compact: Story = { args: { variant: 'compact' } };
export const Timeline: Story = {
  args: { variant: 'timeline' },
  globals: { page: 'timeline' },
};

export const NotCurrent: Story = {
  name: 'Default — not current (no badge)',
  args: {
    variant: 'default',
    experience: { ...demoExperience, current: false, dates: '2018 — 2021' },
  },
};

export const ShortStack: Story = {
  name: 'Default — short stack (no +N)',
  args: {
    variant: 'default',
    experience: { ...demoExperience, stack: ['react', 'remix'] },
  },
};

export const Dark: Story = {
  args: { variant: 'default' },
  globals: { theme: 'dark' },
};
