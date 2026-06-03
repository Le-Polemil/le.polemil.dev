import ExperienceCard from '@/components/cv/ExperienceCard';
import type { Experience } from '@/data/experiences';
import { ACCENT_PRESETS, templateOptions } from '@/stores/template-options';
import { useStore } from '@nanostores/react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  experiences: ReadonlyArray<Experience>;
  /** Number of cards shown before \"Afficher plus\" is clicked. Defaults to 1. */
  initialCount?: number;
  showMoreFr?: string;
  showMoreEn?: string;
  showLessFr?: string;
  showLessEn?: string;
}

/**
 * ExperienceList — bound to the `templateOptions` store. Renders the
 * experiences with the current variant / accent / showStack settings and
 * exposes a \"Afficher plus\" pill that expands from `initialCount` to all.
 *
 * The expand transition uses `document.startViewTransition` when
 * available (Chrome / Edge / Safari 18+). Browsers without support fall
 * back to an immediate swap — no breakage, just no morph.
 */
export default function ExperienceList({
  experiences,
  initialCount = 1,
  showMoreFr = 'Afficher plus',
  showMoreEn = 'Show more',
  showLessFr = 'Afficher moins',
  showLessEn = 'Show less',
}: Props) {
  const opts = useStore(templateOptions);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const accentVar = useMemo(() => {
    const preset = ACCENT_PRESETS.find((p) => p.id === opts.accent);
    return preset?.cssVar ?? '--accent-experience';
  }, [opts.accent]);

  const shown = expanded ? experiences : experiences.slice(0, initialCount);
  const hasMore = experiences.length > initialCount;

  const toggle = () => {
    const apply = () => setExpanded((v) => !v);
    if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply);
      return;
    }
    apply();
  };

  return (
    <div
      className="experience-list"
      data-show-stack={opts.showStack ? 'true' : 'false'}
      data-hydrated={mounted ? 'true' : 'false'}
      style={{ '--accent': `var(${accentVar})` } as React.CSSProperties}
    >
      <ol className="experience-list-grid">
        {shown.map((experience) => (
          <li key={experience.id} className="experience-list-item">
            <ExperienceCard experience={experience} variant={opts.variant} />
          </li>
        ))}
      </ol>

      {hasMore ? (
        <div className="experience-list-actions">
          <button
            type="button"
            className="experience-list-pill"
            data-state={expanded ? 'expanded' : 'collapsed'}
            aria-expanded={expanded}
            onClick={toggle}
          >
            <span lang="fr">{expanded ? showLessFr : showMoreFr}</span>
            <span lang="en">{expanded ? showLessEn : showMoreEn}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
