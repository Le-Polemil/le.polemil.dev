import projectsEn from '@/content/projects-en.json';
import projectsFr from '@/content/projects-fr.json';

export interface Project {
  /** Stable identifier, e.g. "bhuumi". */
  key: string;
  /** Display name. */
  name: string;
  /** Free-form prose description. */
  description: string;
  /** Optional external URL — null if the project has no public destination yet. */
  link: string | null;
  /** Display order (lower = earlier in the listing). */
  order: number;
}

interface RawProject {
  documentId: string;
  key: string;
  name: string;
  description: string | null;
  link: string | null;
  order: number;
}

function normalize(projects: ReadonlyArray<RawProject>): ReadonlyArray<Project> {
  return [...projects]
    .sort((a, b) => a.order - b.order)
    .map((p) => ({
      key: p.key,
      name: p.name,
      description: p.description ?? '',
      link: p.link,
      order: p.order,
    }));
}

export const PROJECTS_FR: ReadonlyArray<Project> = normalize(
  (projectsFr as { projects: ReadonlyArray<RawProject> }).projects,
);
export const PROJECTS_EN: ReadonlyArray<Project> = normalize(
  (projectsEn as { projects: ReadonlyArray<RawProject> }).projects,
);

export function getProjects(locale: string | undefined): ReadonlyArray<Project> {
  return locale === 'en' ? PROJECTS_EN : PROJECTS_FR;
}
