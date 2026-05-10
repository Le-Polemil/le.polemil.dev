import { atom } from 'nanostores';

export type Theme = 'light' | 'dark' | 'system';

export const theme = atom<Theme>('system');

// To be wired up in phase 1: subscribe + sync to <html data-theme="..."> + localStorage.
