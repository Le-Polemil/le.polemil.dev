import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('theme');
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* localStorage unavailable — applied to DOM only */
  }
}

/**
 * ThemeToggle — iOS-style switch between light (sun, left) and
 * dark (moon, right). Knob slides to the active side.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readStoredTheme() ?? systemTheme();
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
      onClick={handleToggle}
      className="theme-toggle"
      data-theme-state={theme}
      data-hydrated={mounted ? 'true' : 'false'}
    >
      <span className="theme-toggle-icon-slot" data-side="left">
        <Sun size={12} aria-hidden="true" />
      </span>
      <span className="theme-toggle-icon-slot" data-side="right">
        <Moon size={12} aria-hidden="true" />
      </span>
      <span className="theme-toggle-knob" aria-hidden="true" />
    </button>
  );
}
