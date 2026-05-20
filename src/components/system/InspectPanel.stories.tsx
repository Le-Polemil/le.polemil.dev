import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import InspectPanel from './InspectPanel';
import './InspectPanel.css';
import { type SelectionData, selectedItem } from '@/stores/selected-item';

const demoExperience: SelectionData = {
  kind: 'experience',
  id: 'elao-lead',
  properties: [
    { label: 'role', value: 'Lead front-end' },
    { label: 'company', value: 'Elao' },
    { label: 'duration', value: '5 ans' },
    { label: 'stack[]', value: '7 items' },
  ],
  tokens: [
    { token: '--accent', chip: '--accent-experience' },
    { token: '--badge-bg', chip: '--status-success-bg' },
    { token: '--surface', chip: '--bg-surface' },
  ],
  usedIn: [
    { label: 'Pattern Timeline', href: '/patterns/timeline' },
    { label: 'About', href: '/components/about' },
  ],
};

/**
 * Storybook decorator that seeds the `selectedItem` store before each
 * story. Resets to null on unmount so other stories see a clean state.
 */
function withSelection(selection: SelectionData | null) {
  return function StorySelectionDecorator() {
    useEffect(() => {
      selectedItem.set(selection);
      return () => selectedItem.set(null);
    }, [selection]);
    return <InspectPanel />;
  };
}

const meta = {
  title: 'System/InspectPanel',
  component: InspectPanel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ inlineSize: '280px', background: 'var(--bg-inset)', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InspectPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  name: 'Empty (no selection)',
  render: withSelection(null),
};

export const ExperienceSelected: Story = {
  name: 'Experience selected',
  render: withSelection(demoExperience),
  globals: { page: 'experience' },
};

export const Dark: Story = {
  render: withSelection(demoExperience),
  globals: { theme: 'dark', page: 'experience' },
};
