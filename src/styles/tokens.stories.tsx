import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

/**
 * Foundations / Tokens — visual catalog of every CSS variable defined in
 * src/styles/tokens.css. Switching theme & page in the toolbar lets you
 * confirm light↔dark contrast and the per-page accent on every surface.
 */

const SECTION_TITLE: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-2xs)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--fg-tertiary)',
  marginBlockEnd: 'var(--space-3)',
};

const ITEM_LABEL: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-xs)',
  color: 'var(--fg-secondary)',
};

const SWATCH_GRID: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: 'var(--space-4)',
};

function ColorSwatch({ token }: { token: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div
        style={{
          inlineSize: '100%',
          aspectRatio: '2 / 1',
          background: `var(${token})`,
          border: 'var(--border-1) solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}
      />
      <code style={ITEM_LABEL}>{token}</code>
    </div>
  );
}

function ScaleBox({
  label,
  size,
  unit = 'block',
}: {
  label: string;
  size: string;
  unit?: 'block' | 'radius' | 'inline';
}) {
  const dim = `var(${size})`;
  const base: CSSProperties = {
    background: 'var(--accent-bg)',
    border: 'var(--border-1) solid var(--accent-border)',
  };
  const styles: CSSProperties =
    unit === 'block'
      ? { ...base, inlineSize: '100%', blockSize: dim }
      : unit === 'radius'
        ? { ...base, inlineSize: '48px', blockSize: '48px', borderRadius: dim }
        : { ...base, inlineSize: dim, blockSize: '24px' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div style={styles} />
      <code style={ITEM_LABEL}>
        {label} <span style={{ color: 'var(--fg-tertiary)' }}>({size})</span>
      </code>
    </div>
  );
}

function TextSample({ size, label }: { size: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
      <code style={{ ...ITEM_LABEL, inlineSize: '120px' }}>{label}</code>
      <span style={{ fontSize: `var(${size})`, fontFamily: 'var(--font-sans)' }}>
        The quick brown fox
      </span>
    </div>
  );
}

function TokensCatalog() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-12)',
        inlineSize: 'min(960px, 100%)',
        marginInline: 'auto',
      }}
    >
      <section>
        <h2 style={SECTION_TITLE}>Backgrounds</h2>
        <div style={SWATCH_GRID}>
          <ColorSwatch token="--bg-canvas" />
          <ColorSwatch token="--bg-app" />
          <ColorSwatch token="--bg-surface" />
          <ColorSwatch token="--bg-subtle" />
          <ColorSwatch token="--bg-inset" />
        </div>
      </section>

      <section>
        <h2 style={SECTION_TITLE}>Foregrounds</h2>
        <div style={SWATCH_GRID}>
          <ColorSwatch token="--fg-primary" />
          <ColorSwatch token="--fg-secondary" />
          <ColorSwatch token="--fg-tertiary" />
          <ColorSwatch token="--fg-on-accent" />
        </div>
      </section>

      <section>
        <h2 style={SECTION_TITLE}>Borders (colors)</h2>
        <div style={SWATCH_GRID}>
          <ColorSwatch token="--border-subtle" />
          <ColorSwatch token="--border-default" />
          <ColorSwatch token="--border-strong" />
        </div>
      </section>

      <section>
        <h2 style={SECTION_TITLE}>Accent + derived (switch page in toolbar)</h2>
        <div style={SWATCH_GRID}>
          <ColorSwatch token="--accent" />
          <ColorSwatch token="--accent-bg" />
          <ColorSwatch token="--accent-bg-hover" />
          <ColorSwatch token="--accent-fg-on-bg" />
          <ColorSwatch token="--accent-border" />
        </div>
      </section>

      <section>
        <h2 style={SECTION_TITLE}>Status</h2>
        <div style={SWATCH_GRID}>
          <ColorSwatch token="--status-success-bg" />
          <ColorSwatch token="--status-success-fg" />
          <ColorSwatch token="--status-warning-bg" />
          <ColorSwatch token="--status-warning-fg" />
          <ColorSwatch token="--status-danger-bg" />
          <ColorSwatch token="--status-danger-fg" />
          <ColorSwatch token="--status-info-bg" />
          <ColorSwatch token="--status-info-fg" />
        </div>
      </section>

      <section>
        <h2 style={SECTION_TITLE}>Spacing (4-base scale)</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {(['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20'] as const).map((n) => (
            <ScaleBox key={n} label={`space-${n}`} size={`--space-${n}`} unit="inline" />
          ))}
        </div>
      </section>

      <section>
        <h2 style={SECTION_TITLE}>Radius</h2>
        <div style={SWATCH_GRID}>
          {(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((n) => (
            <ScaleBox key={n} label={`radius-${n}`} size={`--radius-${n}`} unit="radius" />
          ))}
        </div>
      </section>

      <section>
        <h2 style={SECTION_TITLE}>Border widths</h2>
        <div style={SWATCH_GRID}>
          {(['0', '0_5', '1', '2'] as const).map((n) => (
            <div
              key={n}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
            >
              <div
                style={{
                  inlineSize: '100%',
                  blockSize: '48px',
                  border: `var(--border-${n}) solid var(--border-default)`,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)',
                }}
              />
              <code style={ITEM_LABEL}>--border-{n}</code>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={SECTION_TITLE}>Typography scale</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {(['2xs', 'xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl'] as const).map((s) => (
            <TextSample key={s} label={`text-${s}`} size={`--text-${s}`} />
          ))}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-4)' }}>
            <code style={{ ...ITEM_LABEL, inlineSize: '120px' }}>font-display</code>
            <span style={{ fontSize: 'var(--text-2xl)', fontFamily: 'var(--font-display)' }}>
              Polémil
            </span>
          </div>
        </div>
      </section>

      <section>
        <h2 style={SECTION_TITLE}>Motion</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {(['xs', 'sm', 'md', 'lg'] as const).map((d) => (
            <code key={d} style={ITEM_LABEL}>
              --duration-{d}
            </code>
          ))}
          {(['out', 'in', 'spring'] as const).map((e) => (
            <code key={e} style={ITEM_LABEL}>
              --ease-{e}
            </code>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: 'Foundations/Tokens',
  component: TokensCatalog,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof TokensCatalog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const All: Story = {};
