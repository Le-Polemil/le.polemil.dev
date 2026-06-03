import jobsEn from '@/content/jobs-en.json';
import jobsFr from '@/content/jobs-fr.json';

export interface Experience {
  /** Stable identifier used for routing / selection. */
  id: string;
  /** Single letter shown in the avatar (typically the company initial). */
  initial: string;
  /** Job title, e.g. "Lead front-end". */
  role: string;
  /** Company name, e.g. "Elao". */
  company: string;
  /** Display string for the date range, e.g. "2021 — present". */
  dates: string;
  /** Short numeric year shown by the timeline variant, e.g. "2021". */
  startYear: string;
  /** Whether the experience is still on-going (drives the `current` badge). */
  current: boolean;
  /** Stack tags, mono uppercase-friendly. The default variant shows the first 3 + `+N`. */
  stack: ReadonlyArray<string>;
  /** One-line subtitle — the first sentence of `description`. Rendered
   * as a section header *above* each card on `/experiences` (shadcn
   * doc-page pattern : title + descriptive subtitle, then the demo). */
  subtitle: string;
  /** Long description used by the `expanded` variant. */
  description: string;
  /** Description minus the first sentence — rendered by the expanded
   * variant so the first sentence (already shown as `subtitle` above
   * the card on `/experiences`) isn't repeated inside the card. */
  descriptionRest: string;
}

/** Extract the first sentence of a prose description (the subtitle). */
function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text;
}

/** Everything after the first sentence. Empty string if there's only one. */
function restAfterFirstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]\s*/);
  if (!match) return '';
  return text.slice(match[0].length).trim();
}

interface RawJob {
  key: string;
  title: string;
  company: string;
  dateStart: string;
  dateEnd: string | null;
}

/**
 * Stack picks per role, mirroring the legacy polemil.dev. The BO does not
 * expose a structured `stack` field on jobs — these are curated locally
 * and reviewed at each `pnpm fetch-content` if needed.
 */
const STACK_BY_KEY: Record<string, ReadonlyArray<string>> = {
  artprice: ['react', 'redux', 'ruby-on-rails', 'sql'],
  pentalog: ['react', 'redux', 'symfony', 'postgresql', 'scrum'],
  abbeal: ['vue', 'typescript', 'sharepoint', 'fluent-ui'],
  freelance: ['react', 'next', 'typescript', 'strapi', 'css'],
  elao: ['react', 'astro', 'typescript', 'testing', 'a11y'],
};

/**
 * Long descriptions per role, mirroring the legacy timeline narrative.
 * Kept inline (rather than in i18n JSON) to keep the Experience module
 * self-contained — switch to i18n if more locales land or the prose
 * starts diverging by surface.
 */
const DESCRIPTIONS: Record<'fr' | 'en', Record<string, string>> = {
  fr: {
    artprice:
      "J'intègre Artprice, une entreprise de cotation d'art et d'artistes. Formé à React et Redux, en parallèle du maintien de l'historique en Ruby-on-Rails.",
    pentalog:
      "Je quitte Artprice pour rejoindre Pentalog/Soluti, une agence Web. J'y travaille quasi uniquement en binôme avec un dev back Symfony.",
    abbeal:
      "Employé chez Abbeal, une ESN, j'intègre les équipes de Cultura, avant de m'atteler à la refonte de l'app interne.",
    freelance: 'Nouvelle aventure : je me lance en freelance sous la marque Polémil.',
    elao: "J'intègre Elao et travaille sur plusieurs apps front (React, Astro) : santé, suivi du temps et usine à sites. En parallèle, j'améliore le workflow design→dev grâce aux nouveaux outils IA (MCP Figma, Skills) et rédige des articles sur l'évolution du CSS.",
  },
  en: {
    artprice:
      'Joined Artprice, an art valuation company. Got trained on React and Redux while maintaining the legacy Ruby-on-Rails app.',
    pentalog:
      'Left Artprice for Pentalog/Soluti, a web agency. Worked almost exclusively paired with a Symfony backend developer.',
    abbeal:
      'Hired at Abbeal, a tech consultancy. Embedded at Cultura, then led the rewrite of their internal app.',
    freelance: 'New chapter: I went freelance under the Polémil brand.',
    elao: 'Joined Elao to work on several front-end apps (React, Astro): healthcare, time tracking, and a site factory. Also improved the design→dev workflow with new AI tooling (Figma MCP, Skills) and wrote articles on the modern CSS evolution.',
  },
};

const MONTHS_FR = [
  'janv.',
  'févr.',
  'mars',
  'avril',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];
const MONTHS_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDates(start: string, end: string | null, locale: 'fr' | 'en'): string {
  const present = locale === 'fr' ? "aujourd'hui" : 'present';
  const [ys, ms] = start.split('-');
  const months = locale === 'fr' ? MONTHS_FR : MONTHS_EN;
  const startLabel = `${months[Number(ms) - 1]} ${ys}`;
  if (end === null) return `${startLabel} → ${present}`;
  const [ye, me] = end.split('-');
  const endLabel = `${months[Number(me) - 1]} ${ye}`;
  return `${startLabel} → ${endLabel}`;
}

function toExperience(job: RawJob, locale: 'fr' | 'en'): Experience {
  const stack = STACK_BY_KEY[job.key] ?? [];
  const description = DESCRIPTIONS[locale][job.key] ?? '';
  return {
    id: job.key,
    initial: job.company.charAt(0).toUpperCase(),
    role: job.title,
    company: job.company,
    dates: formatDates(job.dateStart, job.dateEnd, locale),
    startYear: job.dateStart.slice(0, 4),
    current: job.dateEnd === null,
    stack,
    subtitle: firstSentence(description),
    description,
    descriptionRest: restAfterFirstSentence(description),
  };
}

function buildExperiences(
  jobs: ReadonlyArray<RawJob>,
  locale: 'fr' | 'en',
): ReadonlyArray<Experience> {
  // Most-recent-first, matching the live site's reverse-chronological timeline.
  return [...jobs]
    .sort((a, b) => b.dateStart.localeCompare(a.dateStart))
    .map((j) => toExperience(j, locale));
}

const JOBS_FR = (jobsFr as { jobs: ReadonlyArray<RawJob> }).jobs;
const JOBS_EN = (jobsEn as { jobs: ReadonlyArray<RawJob> }).jobs;

export const EXPERIENCES_FR: ReadonlyArray<Experience> = buildExperiences(JOBS_FR, 'fr');
export const EXPERIENCES_EN: ReadonlyArray<Experience> = buildExperiences(JOBS_EN, 'en');

/** Default export = FR. Component-doc surfaces stay on this. */
export const EXPERIENCES: ReadonlyArray<Experience> = EXPERIENCES_FR;

export function getExperiences(locale: string | undefined): ReadonlyArray<Experience> {
  return locale === 'en' ? EXPERIENCES_EN : EXPERIENCES_FR;
}
