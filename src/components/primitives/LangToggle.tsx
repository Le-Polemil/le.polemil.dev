import type { Lang } from '@/lib/i18n';
import { lang as langStore } from '@/stores/lang';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';

function persist(next: Lang) {
  document.documentElement.dataset.lang = next;
  try {
    localStorage.setItem('lang', next);
  } catch {
    /* localStorage unavailable — applied to DOM only */
  }
}

/**
 * LangToggle — iOS-style switch between FR and EN.
 *
 * Single `<button role="switch">` with two labels visible in the track
 * and a knob that slides between them. `aria-checked` reflects whether
 * EN is active (canonical FR-as-off convention).
 */
export default function LangToggle() {
  const current = useStore(langStore);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'fr' || stored === 'en') {
      langStore.set(stored);
      document.documentElement.dataset.lang = stored;
    }
    setMounted(true);
  }, []);

  const isEn = current === 'en';
  const toggle = () => {
    const next: Lang = isEn ? 'fr' : 'en';
    langStore.set(next);
    persist(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEn}
      aria-label={isEn ? 'Switch to French' : 'Switch to English'}
      onClick={toggle}
      className="lang-toggle"
      data-lang-state={current}
      data-hydrated={mounted ? 'true' : 'false'}
    >
      <span className="lang-toggle-label" data-side="left" aria-hidden="true">
        FR
      </span>
      <span className="lang-toggle-label" data-side="right" aria-hidden="true">
        EN
      </span>
      <span className="lang-toggle-knob" aria-hidden="true" />
    </button>
  );
}
