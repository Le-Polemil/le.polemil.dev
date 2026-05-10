import type { Lang } from '@/lib/i18n';
import { atom } from 'nanostores';

export const lang = atom<Lang>('fr');

// To be wired up in phase 1: subscribe + sync to <html data-lang="..."> + localStorage.
