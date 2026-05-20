import { useState } from 'react';

type Kind = 'color' | 'text-sample';

interface SwatchProps {
  /** CSS variable name including the leading `--`. Also the value copied on click. */
  token: string;
  /** Hex string shown beneath the token name (purely display — never used as a fill). */
  hex: string;
  /** `color` fills the tile with `var(--token)`. `text-sample` renders "Aa" coloured by the token. */
  kind?: Kind;
}

async function copyToken(token: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(token);
    return true;
  } catch {
    return false;
  }
}

export default function Swatch({ token, hex, kind = 'color' }: SwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const ok = await copyToken(token);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      type="button"
      className="swatch"
      onClick={handleClick}
      aria-label={`Copier ${token} dans le presse-papier`}
      data-copied={copied ? 'true' : 'false'}
    >
      {kind === 'color' ? (
        <span
          className="swatch-tile swatch-tile-color"
          style={{ background: `var(${token})` }}
          aria-hidden="true"
        />
      ) : (
        <span className="swatch-tile swatch-tile-text" aria-hidden="true">
          <span className="swatch-aa" style={{ color: `var(${token})` }}>
            Aa
          </span>
        </span>
      )}
      <span className="swatch-labels">
        <span className="swatch-token">{token}</span>
        <span className="swatch-hex">{hex}</span>
      </span>
      <span className="swatch-feedback" aria-live="polite">
        {copied ? 'Copié' : ''}
      </span>
    </button>
  );
}
