import enCommon from '@/i18n/en/common.json';
import frCommon from '@/i18n/fr/common.json';

export type Lang = 'fr' | 'en';

export const DEFAULT_LANG: Lang = 'fr';
export const LANGS: readonly Lang[] = ['fr', 'en'] as const;

/**
 * FR is canonical — TypeScript derives the key shape from the FR JSON.
 * The `satisfies` clause forces EN to expose the same keys with string values ;
 * any divergence between the two locales fails type-check at build time.
 */
const fr = frCommon;
const en = enCommon satisfies typeof fr;

type Translations = typeof fr;
export type I18nKey = keyof Translations;

const dict: Record<Lang, Translations> = { fr, en };

export function t<K extends I18nKey>(key: K, lang: Lang = DEFAULT_LANG): Translations[K] {
  return dict[lang][key];
}
