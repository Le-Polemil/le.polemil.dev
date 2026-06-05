import ExperienceDetail from '@/components/cv/ExperienceDetail';
import TemplateOptions from '@/components/system/TemplateOptions';
import { selectedExperience } from '@/stores/selected-experience';
import { useStore } from '@nanostores/react';

/**
 * ExperiencesInspect — right-rail wrapper on `/experiences` that picks
 * between TemplateOptions (no selection) and ExperienceDetail (an
 * experience is selected via the "Voir le détail" link in
 * ExperienceList). Single island so the two sub-views share React
 * scheduling.
 */
export default function ExperiencesInspect() {
  const selected = useStore(selectedExperience);
  return selected ? <ExperienceDetail /> : <TemplateOptions />;
}
