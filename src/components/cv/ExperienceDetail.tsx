import Badge from '@/components/primitives/Badge';
import { selectedExperience } from '@/stores/selected-experience';
import { useStore } from '@nanostores/react';
import { X } from 'lucide-react';

/**
 * ExperienceDetail — right-rail detail panel on `/experiences`.
 *
 * Renders the currently `selectedExperience` (or nothing if null — the
 * parent wrapper `ExperiencesInspect` already gates on that). Shows the
 * full description (no first-sentence stripping — the user is here to
 * dig in), the complete stack, and a close button that clears the
 * selection so the panel reverts to TemplateOptions.
 */
export default function ExperienceDetail() {
  const e = useStore(selectedExperience);
  if (!e) return null;

  const close = () => {
    selectedExperience.set(null);
  };

  return (
    <article className="experience-detail" aria-label={`Détail : ${e.role} chez ${e.company}`}>
      <header className="experience-detail-header">
        <div className="experience-detail-head-text">
          <h3 className="experience-detail-eyebrow">EXPERIENCE</h3>
          <p className="experience-detail-title">{e.role}</p>
          <p className="experience-detail-company">{e.company}</p>
        </div>
        <button
          type="button"
          className="experience-detail-close"
          onClick={close}
          aria-label="Fermer le détail"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </header>

      <section className="experience-detail-section" aria-label="Dates">
        <p className="experience-detail-dates">{e.dates}</p>
        {e.current ? <Badge variant="success">current</Badge> : null}
      </section>

      {e.description ? (
        <section
          className="experience-detail-section experience-detail-section--bordered"
          aria-label="Description"
        >
          <h4 className="experience-detail-section-title">À propos</h4>
          <p className="experience-detail-description">{e.description}</p>
        </section>
      ) : null}

      {e.stack.length > 0 ? (
        <section
          className="experience-detail-section experience-detail-section--bordered"
          aria-label="Stack"
        >
          <h4 className="experience-detail-section-title">Stack</h4>
          <ul className="experience-detail-stack">
            {e.stack.map((tag) => (
              <li key={tag} className="experience-detail-tag">
                {tag}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
