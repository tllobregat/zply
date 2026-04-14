'use client';

import 'reflect-metadata';
import { ShareableStateProvider } from '@/hooks/use-shareable-state-context';
import React, { PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren): React.ReactNode {
  return (
    <ShareableStateProvider>
      {children}
    </ShareableStateProvider>
  );
}
