'use client';

import React, { useEffect } from 'react';

const THEME_KEY = 'verigen_theme'; // localStorage key

/**
 * Apply the given theme preference to the document root.
 * 'dark'   → removes 'light' class, sets data-theme="dark"
 * 'light'  → adds 'light' class, sets data-theme="light"
 * 'system' → reads OS prefers-color-scheme
 */
function applyTheme(theme: string) {
  const root = document.documentElement;
  let isDark: boolean;

  if (theme === 'light') {
    isDark = false;
  } else if (theme === 'dark') {
    isDark = true;
  } else {
    // 'system' — honour OS preference
    isDark = !window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  if (isDark) {
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // 1. Apply saved theme (or dark by default) on initial mount
    const saved = localStorage.getItem(THEME_KEY) ?? 'dark';
    applyTheme(saved);

    // 2. Listen for manual theme changes from the Settings page
    const handleThemeChange = () => {
      const current = localStorage.getItem(THEME_KEY) ?? 'dark';
      applyTheme(current);
    };
    window.addEventListener('verigen_theme_change', handleThemeChange);

    // 3. Also react to OS-level changes (useful when saved theme is 'system')
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleSystemChange = () => {
      const current = localStorage.getItem(THEME_KEY) ?? 'dark';
      if (current === 'system') applyTheme('system');
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    }

    return () => {
      window.removeEventListener('verigen_theme_change', handleThemeChange);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      }
    };
  }, []);

  return <>{children}</>;
};

/** Call this from anywhere to programmatically change the theme. */
export function setTheme(theme: 'dark' | 'light' | 'system') {
  if (typeof window === 'undefined') return;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new Event('verigen_theme_change'));
}
