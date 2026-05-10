// Helper i18n — to be filled in phase 1.
// The implementation will load JSON files from src/i18n/<lang>/*.json
// and expose a typed t(key, lang) helper. The key type will be derived
// from the JSON structure at build time.

export type Lang = 'fr' | 'en';

export const DEFAULT_LANG: Lang = 'fr';

// Placeholder until phase 1 ticket lands.
export function t(key: string, lang: Lang = DEFAULT_LANG): string {
  // TODO: implement typed translation lookup
  return `[${lang}:${key}]`;
}
