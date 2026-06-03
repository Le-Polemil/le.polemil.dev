import type { ExperienceCardVariant } from '@/components/cv/ExperienceCard';
import { atom } from 'nanostores';

/**
 * Live rendering options shared between `<TemplateOptions />` (the right
 * panel control on `/experiences`) and `<ExperienceList />` (the cards
 * grid). Subscribing islands re-render on every option change.
 *
 * Defaults match the canonical Figma 15:2 (default variant) + the
 * brand accent (`--accent-experience`) + visible stack tags.
 */

export type AccentPresetId = 'experience' | 'project' | 'skill' | 'contact' | 'about';

export interface AccentPreset {
  id: AccentPresetId;
  /** Display label, FR. */
  labelFr: string;
  /** Display label, EN. */
  labelEn: string;
  /** CSS custom property name driving `--accent` for this preset. */
  cssVar: string;
}

export const ACCENT_PRESETS: ReadonlyArray<AccentPreset> = [
  { id: 'experience', labelFr: 'Expérience', labelEn: 'Experience', cssVar: '--accent-experience' },
  { id: 'project', labelFr: 'Projet', labelEn: 'Project', cssVar: '--accent-project' },
  { id: 'skill', labelFr: 'Compétence', labelEn: 'Skill', cssVar: '--accent-skill' },
  { id: 'contact', labelFr: 'Contact', labelEn: 'Contact', cssVar: '--accent-contact' },
  { id: 'about', labelFr: 'À propos', labelEn: 'About', cssVar: '--accent-about' },
];

export interface TemplateOptions {
  variant: ExperienceCardVariant;
  accent: AccentPresetId;
  showStack: boolean;
}

export const DEFAULT_OPTIONS: TemplateOptions = {
  variant: 'default',
  accent: 'experience',
  showStack: true,
};

export const templateOptions = atom<TemplateOptions>(DEFAULT_OPTIONS);
