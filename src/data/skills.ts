import skillsEn from '@/content/skills-en.json';
import skillsFr from '@/content/skills-fr.json';

export type SkillLevel = 'expert' | 'confident' | 'experienced' | 'beginner' | 'willing_to_learn';

export interface Skill {
  /** Stable identifier, e.g. "techs.react". */
  key: string;
  /** Display label. */
  name: string;
  /** Self-rated proficiency. */
  level: SkillLevel;
}

export interface SkillSubCategory {
  /** Stable id from the BO (numeric-looking, but returned as a string). */
  id: string;
  /** Display label, e.g. "Langages". */
  name: string;
  skills: ReadonlyArray<Skill>;
}

export interface SkillCategory {
  /** Stable identifier: "techs" | "knowHow" | "softSkills". */
  key: string;
  /** Display label. */
  name: string;
  subCategories: ReadonlyArray<SkillSubCategory>;
}

interface RawSkill {
  documentId: string;
  key: string;
  name: string;
  level: SkillLevel;
}
interface RawSub {
  id: string;
  name: string;
  skills: ReadonlyArray<RawSkill> | null;
}
interface RawCategory {
  documentId: string;
  key: string;
  name: string;
  subCategories: ReadonlyArray<RawSub> | null;
}

function normalize(cats: ReadonlyArray<RawCategory>): ReadonlyArray<SkillCategory> {
  return cats.map((c) => ({
    key: c.key,
    name: c.name,
    subCategories: (c.subCategories ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      skills: (s.skills ?? []).map((sk) => ({ key: sk.key, name: sk.name, level: sk.level })),
    })),
  }));
}

export const SKILLS_FR: ReadonlyArray<SkillCategory> = normalize(
  (skillsFr as { skillCategories: ReadonlyArray<RawCategory> }).skillCategories,
);
export const SKILLS_EN: ReadonlyArray<SkillCategory> = normalize(
  (skillsEn as { skillCategories: ReadonlyArray<RawCategory> }).skillCategories,
);

export function getSkills(locale: string | undefined): ReadonlyArray<SkillCategory> {
  return locale === 'en' ? SKILLS_EN : SKILLS_FR;
}
