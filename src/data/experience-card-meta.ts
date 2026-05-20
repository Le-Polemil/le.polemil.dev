/**
 * Documentation metadata for the `<ExperienceCard />` component.
 * Drives the Props table on /components/experience/props and the Code
 * sample on /components/experience/code. Kept here (not in the
 * component file) so future doc tooling can consume it generically.
 */

export interface PropDocRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export const EXPERIENCE_CARD_PROPS: ReadonlyArray<PropDocRow> = [
  {
    name: 'experience',
    type: 'Experience',
    defaultValue: '—',
    description: 'Typed experience entry from src/data/experiences.ts.',
  },
  {
    name: 'variant',
    type: '"default" | "expanded" | "compact" | "timeline"',
    defaultValue: '"default"',
    description: 'Visual variant. Each maps to a Figma sub-node (15:2 / 15:20 / 15:41 / 15:48).',
  },
  {
    name: 'maxStackInline',
    type: 'number',
    defaultValue: '3',
    description:
      'Default variant trims the stack to the first N tags and adds a "+M" overflow indicator.',
  },
];

export const EXPERIENCE_CARD_CODE_SAMPLE = `import ExperienceCard from '@/components/cv/ExperienceCard';
import { EXPERIENCES } from '@/data/experiences';

const experience = EXPERIENCES[0];

export function ExperienceLeadElao() {
  return (
    <ExperienceCard
      experience={experience}
      variant="default"
      maxStackInline={3}
    />
  );
}`;
