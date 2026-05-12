import type { Meta, StoryObj } from '@storybook/react-vite';
import LangToggle from './LangToggle';
import './LangToggle.css';

const meta = {
  title: 'Primitives/LangToggle',
  component: LangToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof LangToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default state — FR canonical. The component reads localStorage on mount,
 * so the active option may switch to EN if the browser had it saved.
 */
export const Default: Story = {};

export const OnExperienceAccent: Story = {
  name: 'On Experience page accent',
  globals: { page: 'experience' },
};

export const OnSkillAccent: Story = {
  name: 'On Skill page accent',
  globals: { page: 'skill' },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
