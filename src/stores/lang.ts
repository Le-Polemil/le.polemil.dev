import { atom } from 'nanostores';
import type { Lang } from '@/lib/i18n';

export const lang = atom<Lang>('fr');

// To be wired up in phase 1: subscribe + sync to <html data-lang="..."> + localStorage.
