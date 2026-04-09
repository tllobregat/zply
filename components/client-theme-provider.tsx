'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';
import React from 'react';

export function ClientThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props} enableColorScheme={false}>
      {children}
    </NextThemesProvider>
  );
}
