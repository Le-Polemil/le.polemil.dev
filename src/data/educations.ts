import educationsEn from '@/content/educations-en.json';
import educationsFr from '@/content/educations-fr.json';

export interface Education {
  /** Stable identifier, e.g. "iut". */
  key: string;
  /** Diploma name. */
  name: string;
  /** School/university acronym, e.g. "UCBL". */
  school: string;
  /** City, e.g. "Lyon". */
  city: string;
}

interface RawEdu {
  documentId: string;
  key: string;
  name: string;
  school: string;
  city: string;
}

function normalize(items: ReadonlyArray<RawEdu>): ReadonlyArray<Education> {
  return items.map((e) => ({ key: e.key, name: e.name, school: e.school, city: e.city }));
}

export const EDUCATIONS_FR: ReadonlyArray<Education> = normalize(
  (educationsFr as { educations: ReadonlyArray<RawEdu> }).educations,
);
export const EDUCATIONS_EN: ReadonlyArray<Education> = normalize(
  (educationsEn as { educations: ReadonlyArray<RawEdu> }).educations,
);

export function getEducations(locale: string | undefined): ReadonlyArray<Education> {
  return locale === 'en' ? EDUCATIONS_EN : EDUCATIONS_FR;
}
