import { LANGS, type Lang } from '@/lib/i18n';
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

  const handleSwitch = (next: Lang) => {
    if (next === current) return;
    langStore.set(next);
    persist(next);
  };

  return (
    <fieldset className="lang-toggle" data-hydrated={mounted ? 'true' : 'false'}>
      <legend className="lang-toggle-legend">Langue</legend>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className="lang-toggle-option"
          aria-pressed={current === l}
          data-active={current === l ? 'true' : 'false'}
          onClick={() => handleSwitch(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </fieldset>
  );
}
