import type { Experience } from '@/data/experiences';
import { atom } from 'nanostores';

/**
 * Holds the experience currently being "inspected" on `/experiences`.
 * `null` = no selection → right panel renders TemplateOptions.
 * Populated → right panel renders ExperienceDetail.
 *
 * Parallel to `selectedItem` (#9), which carries a design-token-shaped
 * SelectionData on `/components/experience`. The two stores are kept
 * separate because the mental models are different (job inspection
 * vs. token inspection).
 */
export const selectedExperience = atom<Experience | null>(null);
