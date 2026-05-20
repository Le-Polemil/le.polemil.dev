import type { Experience } from '@/data/experiences';
import { selectedItem, setSelection } from '@/stores/selected-item';
import { useStore } from '@nanostores/react';
import { type KeyboardEvent, useEffect, useState } from 'react';
import ExperienceCard, { type ExperienceCardVariant } from './ExperienceCard';

interface Props {
  experience: Experience;
  variant?: ExperienceCardVariant;
  maxStackInline?: number;
}

/**
 * Wraps an ExperienceCard with a click handler that publishes the
 * experience's properties / tokens / used-in to the `selectedItem`
 * nanostore — picked up by `<InspectPanel />` in the right column.
 *
 * Keeps the underlying ExperienceCard untouched (still usable as a plain
 * server-rendered card by Storybook and any non-inspect context).
 */
export default function SelectableExperienceCard(props: Props) {
  const current = useStore(selectedItem);
  const isSelected = current?.kind === 'experience' && current?.id === props.experience.id;
  // `data-hydrated` lets Playwright wait for client:idle to fire before
  // simulating clicks — without it, mobile-safari races the test runner.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const select = () => {
    const e = props.experience;
    // `setSelection` wraps the store mutation in `document.startViewTransition()`
    // so the panel morphs between empty / populated / different selections.
    // `usedIn` href is "#" until the Pattern Timeline page exists — once it
    // lands, swap to "/patterns/timeline".
    setSelection({
      kind: 'experience',
      id: e.id,
      properties: [
        { label: 'role', value: e.role },
        { label: 'company', value: e.company },
        { label: 'duration', value: e.dates },
        { label: 'stack[]', value: `${e.stack.length} items` },
      ],
      tokens: [
        { token: '--accent', chip: '--accent-experience' },
        { token: '--badge-bg', chip: '--status-success-bg' },
        { token: '--surface', chip: '--bg-surface' },
      ],
      usedIn: [{ label: 'Pattern Timeline', href: '#' }],
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select();
    }
  };

  return (
    /* Note: lint a11y/useSemanticElements is disabled for this file in
       biome.json — a <button> wrapper would be invalid HTML around the
       inner <article>. Div + role=button is the right compromise. */
    <div
      className="experience-card-selectable"
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      data-selected={isSelected ? 'true' : 'false'}
      data-hydrated={mounted ? 'true' : 'false'}
      onClick={select}
      onKeyDown={onKeyDown}
    >
      <ExperienceCard {...props} />
    </div>
  );
}
