import Swatch from '@/components/primitives/Swatch';
import type { Meta, StoryObj } from '@storybook/react-vite';
import '@/components/primitives/Swatch.css';
import { COLOR_TOKEN_GROUPS } from '@/data/color-tokens';

/**
 * React mirror of `src/pages/foundations/colors.astro` for visual verification
 * against the Figma node 9:7. The Astro page renders the same data via the
 * same Swatch component, so this story is a high-fidelity proxy.
 */
function ColorsCatalog() {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-16)',
        padding: 'var(--space-8)',
        inlineSize: 'min(1200px, 100%)',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            fontSize: 'var(--text-2xs)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--fg-tertiary)',
            margin: 0,
          }}
        >
          FOUNDATIONS / COLORS
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: 'var(--text-2xl)',
            letterSpacing: '-0.02em',
            color: 'var(--fg-primary)',
            margin: 0,
          }}
        >
          Colors
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--fg-secondary)',
            maxInlineSize: '60ch',
            margin: 0,
          }}
        >
          Tokens couleur de la collection Colors — light mode affiché. Bascule le thème pour passer
          en dark. Clique un swatch pour copier son nom CSS.
        </p>
      </header>

      {COLOR_TOKEN_GROUPS.map((group) => (
        <section
          key={group.label}
          aria-label={group.label}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              fontSize: 'var(--text-2xs)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--fg-secondary)',
              margin: 0,
            }}
          >
            {group.label}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {group.tokens.map((t) => (
              <Swatch key={t.token} token={t.token} hex={t.hex} kind={group.kind} />
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}

const meta = {
  title: 'Pages/Foundations/Colors',
  component: ColorsCatalog,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorsCatalog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
