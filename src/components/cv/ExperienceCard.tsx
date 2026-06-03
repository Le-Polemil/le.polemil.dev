import Badge from '@/components/primitives/Badge';
import type { Experience } from '@/data/experiences';
import type { ReactNode } from 'react';

export type ExperienceCardVariant = 'default' | 'expanded' | 'compact' | 'timeline';

interface ExperienceCardProps {
  experience: Experience;
  variant?: ExperienceCardVariant;
  /** Default variant trims the stack to the first N tags + a `+M` indicator. */
  maxStackInline?: number;
}

function Avatar({
  initial,
  size,
}: {
  initial: string;
  size: 20 | 28 | 32;
}) {
  return (
    <span className="experience-card-avatar" data-size={size} aria-hidden="true">
      {initial}
    </span>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="experience-card-tag">{children}</span>;
}

export default function ExperienceCard({
  experience,
  variant = 'default',
  maxStackInline = 3,
}: ExperienceCardProps) {
  const e = experience;

  if (variant === 'compact') {
    return (
      <article
        className="experience-card"
        data-variant="compact"
        aria-label={`${e.role} chez ${e.company}`}
      >
        <Avatar initial={e.initial} size={20} />
        <span className="experience-card-role">{e.role}</span>
        <span className="experience-card-company">{e.company}</span>
        <span className="experience-card-spacer" />
        <span className="experience-card-dates">{e.dates}</span>
      </article>
    );
  }

  if (variant === 'timeline') {
    return (
      <article
        className="experience-card"
        data-variant="timeline"
        aria-label={`${e.role} chez ${e.company}`}
      >
        <span className="experience-card-axis" aria-hidden="true" />
        <div className="experience-card-body">
          <div className="experience-card-year-row">
            <span className="experience-card-year">{e.startYear}</span>
            {e.current ? <Badge variant="success">current</Badge> : null}
          </div>
          <p className="experience-card-role-line">
            {e.role} · {e.company}
          </p>
        </div>
      </article>
    );
  }

  // default + expanded share the same top row layout
  const isExpanded = variant === 'expanded';
  const tagsToShow = isExpanded ? e.stack : e.stack.slice(0, maxStackInline);
  const overflow = !isExpanded ? Math.max(0, e.stack.length - maxStackInline) : 0;

  return (
    <article
      className="experience-card"
      data-variant={variant}
      aria-label={`${e.role} chez ${e.company}`}
    >
      <div className="experience-card-top">
        <Avatar initial={e.initial} size={isExpanded ? 32 : 28} />
        <div className="experience-card-title-block">
          {/* Title + subtitle pattern (shadcn accordion-style trigger).
              Both default + expanded variants use the larger `md` size so
              every card has a prominent header — matches the user-driven
              redesign in #41. */}
          <p className="experience-card-role-line" data-size="md">
            {e.role} · {e.company}
          </p>
          {e.subtitle ? <p className="experience-card-subtitle">{e.subtitle}</p> : null}
          <p className="experience-card-dates">{e.dates}</p>
        </div>
        {e.current ? <Badge variant="success">current</Badge> : null}
      </div>

      {isExpanded ? <p className="experience-card-description">{e.description}</p> : null}

      <div className="experience-card-stack">
        {tagsToShow.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
        {overflow > 0 ? <Tag>+{overflow}</Tag> : null}
      </div>
    </article>
  );
}
