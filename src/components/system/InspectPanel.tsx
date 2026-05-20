import { selectedItem } from '@/stores/selected-item';
import { useStore } from '@nanostores/react';

/**
 * InspectPanel — Figma node 25:2.
 * Right-side panel showing Properties / Tokens / Used In for the currently
 * selected item. Reads from the `selectedItem` nanostore. SSR-rendered with
 * the empty state visible ; hydrates via `client:visible` so the store
 * subscription kicks in only when the panel is actually on screen.
 */
export default function InspectPanel() {
  const selection = useStore(selectedItem);

  if (selection === null) {
    return (
      <div className="inspect-panel" data-state="empty">
        <p className="inspect-panel-empty">Sélectionne un élément pour voir ses détails.</p>
      </div>
    );
  }

  return (
    <div className="inspect-panel" data-state="populated" data-selected-kind={selection.kind}>
      <section className="inspect-panel-section" aria-label="Properties">
        <h3 className="inspect-panel-eyebrow">PROPERTIES</h3>
        {selection.properties.map((p) => (
          <div key={p.label} className="inspect-panel-prop-row">
            <span className="inspect-panel-prop-label">{p.label}</span>
            <span className="inspect-panel-prop-value">{p.value}</span>
          </div>
        ))}
      </section>

      {selection.tokens.length > 0 ? (
        <section
          className="inspect-panel-section inspect-panel-section--bordered"
          aria-label="Tokens"
        >
          <h3 className="inspect-panel-eyebrow">TOKENS</h3>
          {selection.tokens.map((t) => (
            <div key={t.token} className="inspect-panel-token-row">
              <span
                className="inspect-panel-chip"
                style={{ background: `var(${t.chip})` }}
                aria-hidden="true"
              />
              <span className="inspect-panel-token-name">{t.token}</span>
            </div>
          ))}
        </section>
      ) : null}

      {selection.usedIn.length > 0 ? (
        <section
          className="inspect-panel-section inspect-panel-section--bordered"
          aria-label="Used in"
        >
          <h3 className="inspect-panel-eyebrow">USED IN</h3>
          {selection.usedIn.map((link) => (
            <a key={link.href} className="inspect-panel-used-row" href={link.href}>
              <span className="inspect-panel-used-arrow" aria-hidden="true">
                ↗
              </span>
              <span className="inspect-panel-used-label">{link.label}</span>
            </a>
          ))}
        </section>
      ) : null}
    </div>
  );
}
