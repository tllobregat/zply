"use client";

import { Dashboard } from '@/components/dashboard';
import React, { Suspense } from 'react';

export default function HomeClient(): React.ReactNode {
  return (
    <div id="home-scroll-container" className="flex-1 h-full">
      <Suspense fallback={<div className="h-full flex items-center justify-center text-muted-foreground font-black uppercase tracking-widest text-[10px]">Loading...</div>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}
