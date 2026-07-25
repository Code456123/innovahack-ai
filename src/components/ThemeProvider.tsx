'use client';

import React, { useEffect } from 'react';
import { getStoredUserProfile } from '@/lib/store';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const applyTheme = () => {
      const profile = getStoredUserProfile();
      const theme = profile.theme || 'dark';

      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      } else if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!prefersDark) {
          document.documentElement.classList.add('light');
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } else {
        // Dark Mode Default
        document.documentElement.classList.remove('light');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    };

    applyTheme();

    // Listen for custom user profile changes
    window.addEventListener('verigen_user_updated', applyTheme);

    // Listen for OS-level theme preference changes (for System Mode)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const profile = getStoredUserProfile();
      if (profile.theme === 'system') {
        applyTheme();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      window.removeEventListener('verigen_user_updated', applyTheme);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, []);

  return <>{children}</>;
};
