import { atom } from 'nanostores';

export type SelectedItemKind =
  | 'experience'
  | 'project'
  | 'skill'
  | 'training'
  | null;

export interface SelectedItem {
  kind: SelectedItemKind;
  id: string | null;
}

export const selectedItem = atom<SelectedItem>({ kind: null, id: null });
