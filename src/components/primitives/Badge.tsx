import type { CSSProperties, ReactNode } from 'react';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT_STYLES: Record<Variant, CSSProperties> = {
  success: {
    background: 'var(--status-success-bg)',
    color: 'var(--status-success-fg)',
  },
  warning: {
    background: 'var(--status-warning-bg)',
    color: 'var(--status-warning-fg)',
  },
  danger: {
    background: 'var(--status-danger-bg)',
    color: 'var(--status-danger-fg)',
  },
  info: {
    background: 'var(--status-info-bg)',
    color: 'var(--status-info-fg)',
  },
  neutral: {
    background: 'var(--bg-subtle)',
    color: 'var(--fg-secondary)',
  },
};

export default function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span className="badge" style={VARIANT_STYLES[variant]} data-variant={variant}>
      {children}
    </span>
  );
}
