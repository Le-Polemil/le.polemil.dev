import type { ExperienceCardVariant } from '@/components/cv/ExperienceCard';
import {
  ACCENT_PRESETS,
  type AccentPresetId,
  type TemplateOptions as Options,
  templateOptions,
} from '@/stores/template-options';
import { useStore } from '@nanostores/react';
import { useEffect, useState } from 'react';

const VARIANTS: ReadonlyArray<{ id: ExperienceCardVariant; labelFr: string; labelEn: string }> = [
  { id: 'default', labelFr: 'Default', labelEn: 'Default' },
  { id: 'expanded', labelFr: 'Expanded', labelEn: 'Expanded' },
  { id: 'compact', labelFr: 'Compact', labelEn: 'Compact' },
  { id: 'timeline', labelFr: 'Timeline', labelEn: 'Timeline' },
];

function setOption<K extends keyof Options>(key: K, value: Options[K]): void {
  templateOptions.set({ ...templateOptions.get(), [key]: value });
}

/**
 * TemplateOptions — right-rail panel on `/experiences`.
 *
 * Three controls that mutate the `templateOptions` store : variant picker,
 * accent picker (CSS variable preset), show-stack toggle. The
 * `<ExperienceList />` island on the same page subscribes and re-renders
 * every card live.
 *
 * `data-hydrated` marker so Playwright can wait for `client:visible` to
 * fire before clicking the controls (same pattern as #4/#5/#9).
 */
export default function TemplateOptions() {
  const opts = useStore(templateOptions);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Drive `--main-accent` at the root level so the chosen accent
  // propagates everywhere — sidenav active state, badges, ExperienceCard
  // internals, etc. The inline style on <html> beats the
  // `html[data-page="..."]` selector by specificity. Cleared on
  // unmount so navigating away from /experiences reverts to the
  // page-default accent.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const preset = ACCENT_PRESETS.find((p) => p.id === opts.accent);
    if (!preset) return;
    document.documentElement.style.setProperty('--main-accent', `var(${preset.cssVar})`);
    return () => {
      document.documentElement.style.removeProperty('--main-accent');
    };
  }, [opts.accent]);

  return (
    <div className="template-options" data-hydrated={mounted ? 'true' : 'false'}>
      <section className="template-options-section" aria-label="Variant">
        <h3 className="template-options-eyebrow">VARIANT</h3>
        <div role="radiogroup" aria-label="Variant" className="template-options-radio-group">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={opts.variant === v.id}
              className="template-options-pill"
              data-active={opts.variant === v.id ? 'true' : 'false'}
              onClick={() => setOption('variant', v.id)}
            >
              <span lang="fr">{v.labelFr}</span>
              <span lang="en">{v.labelEn}</span>
            </button>
          ))}
        </div>
      </section>

      <section
        className="template-options-section template-options-section--bordered"
        aria-label="Accent"
      >
        <h3 className="template-options-eyebrow">ACCENT</h3>
        <div role="radiogroup" aria-label="Accent" className="template-options-swatch-group">
          {ACCENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={opts.accent === preset.id}
              className="template-options-swatch"
              data-active={opts.accent === preset.id ? 'true' : 'false'}
              style={{ background: `var(${preset.cssVar})` }}
              onClick={() => setOption('accent', preset.id as AccentPresetId)}
            >
              <span className="sr-only" lang="fr">
                {preset.labelFr}
              </span>
              <span className="sr-only" lang="en">
                {preset.labelEn}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section
        className="template-options-section template-options-section--bordered"
        aria-label="Stack"
      >
        <h3 className="template-options-eyebrow">STACK</h3>
        <label className="template-options-toggle">
          <input
            type="checkbox"
            checked={opts.showStack}
            onChange={(e) => setOption('showStack', e.currentTarget.checked)}
          />
          <span lang="fr">Afficher les technos</span>
          <span lang="en">Show tech tags</span>
        </label>
      </section>
    </div>
  );
}
