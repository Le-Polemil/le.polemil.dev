import ExperienceCard from '@/components/cv/ExperienceCard';
import type { Experience } from '@/data/experiences';
import { selectedExperience } from '@/stores/selected-experience';
import { templateOptions } from '@/stores/template-options';
import { useStore } from '@nanostores/react';
import { type KeyboardEvent, useEffect, useState } from 'react';

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
 * Each list item is interactive : clicking anywhere on the section
 * (header + card) toggles its selection in the `selectedExperience`
 * store, which drives the right-rail ExperiencesInspect to switch
 * between TemplateOptions (none selected) and ExperienceDetail.
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
  const current = useStore(selectedExperience);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shown = expanded ? experiences : experiences.slice(0, initialCount);
  const hasMore = experiences.length > initialCount;

  const toggleExpand = () => {
    const apply = () => setExpanded((v) => !v);
    if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
      document.startViewTransition(apply);
      return;
    }
    apply();
  };

  const handleSelect = (experience: Experience, isSelected: boolean) => {
    selectedExperience.set(isSelected ? null : experience);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    experience: Experience,
    isSelected: boolean,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(experience, isSelected);
    }
  };

  return (
    <div
      className="experience-list"
      data-show-stack={opts.showStack ? 'true' : 'false'}
      data-hydrated={mounted ? 'true' : 'false'}
    >
      <ol className="experience-list-grid">
        {shown.map((experience) => {
          const isSelected = current?.id === experience.id;
          return (
            <li
              key={experience.id}
              className="experience-list-item"
              data-selected={isSelected ? 'true' : 'false'}
            >
              {/* Inner <div role="button"> rather than a real <button>
                  because a button can't legally wrap <article>/<h2>/<p>.
                  Lint override on this file in biome.json. */}
              <div
                className="experience-list-item-trigger"
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => handleSelect(experience, isSelected)}
                onKeyDown={(e) => handleKeyDown(e, experience, isSelected)}
              >
                <header className="experience-list-item-header">
                  <div className="experience-list-item-head-text">
                    <h2 className="experience-list-item-title">
                      {experience.role} · {experience.company}
                    </h2>
                    {experience.subtitle ? (
                      <p className="experience-list-item-subtitle">{experience.subtitle}</p>
                    ) : null}
                  </div>
                </header>
                <ExperienceCard experience={experience} variant={opts.variant} />
              </div>
            </li>
          );
        })}
      </ol>

      {hasMore ? (
        <div className="experience-list-actions">
          <button
            type="button"
            className="experience-list-pill"
            data-state={expanded ? 'expanded' : 'collapsed'}
            aria-expanded={expanded}
            onClick={toggleExpand}
          >
            <span lang="fr">{expanded ? showLessFr : showMoreFr}</span>
            <span lang="en">{expanded ? showLessEn : showMoreEn}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
