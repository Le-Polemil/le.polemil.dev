import { atom } from 'nanostores';
import { flushSync } from 'react-dom';

/**
 * Selected item store — drives `<InspectPanel />` content across all pages.
 * Stays at `null` when nothing is selected ; the panel then shows its empty
 * state ("Sélectionne un élément"). Dispatchers (e.g. SelectableExperienceCard,
 * future SelectableSwatch) populate the store with the data the panel needs
 * to render its three sections.
 */

export type SelectedItemKind =
  | 'experience'
  | 'project'
  | 'skill'
  | 'foundations-color'
  | 'training';

export interface InspectableProperty {
  label: string;
  value: string;
}

export interface InspectableToken {
  /** CSS variable name, e.g. `--accent`. */
  token: string;
  /**
   * CSS variable name whose value drives the chip's background.
   * Usually the same as `token`, but separated so a token like `--text-base`
   * (a font-size) can have a swatch driven by a different colour var.
   */
  chip: string;
}

export interface InspectableLink {
  label: string;
  href: string;
}

export interface SelectionData {
  kind: SelectedItemKind;
  /** Stable identifier within `kind` — used as React key + Playwright target. */
  id: string;
  properties: ReadonlyArray<InspectableProperty>;
  tokens: ReadonlyArray<InspectableToken>;
  usedIn: ReadonlyArray<InspectableLink>;
}

export const selectedItem = atom<SelectionData | null>(null);

/**
 * Mutate the store inside a View Transition when the browser supports it.
 *
 * Why `flushSync` : `selectedItem.set(...)` triggers a React re-render of
 * `<InspectPanel />` via `useStore` (`useSyncExternalStore` under the hood).
 * React 18+ batches updates, which would queue the re-render *after* the
 * `startViewTransition` callback exits — so the browser would snapshot the
 * same DOM before & after and no morph would play. `flushSync` forces the
 * commit to happen inside the callback, so the snapshot diff is real.
 *
 * SSR safe (guards on `document`) and degrades to a plain set when the
 * browser doesn't support View Transitions (Firefox, older Safari).
 */
export function setSelection(next: SelectionData | null): void {
  if (typeof document !== 'undefined' && typeof document.startViewTransition === 'function') {
    document.startViewTransition(() => {
      flushSync(() => {
        selectedItem.set(next);
      });
    });
    return;
  }
  selectedItem.set(next);
}
