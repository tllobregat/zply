import { cn } from '@/lib/utils';
import React from 'react';

interface PageLayoutIslandProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  islandClassName?: string;
  contentClassName?: string;
  scrollInIsland?: boolean;
}

export function PageLayoutIsland({
  children,
  footer,
  islandClassName,
  contentClassName,
  scrollInIsland = true,
}: PageLayoutIslandProps) {
  return (
    <div className={cn(
      "flex-1 min-h-0 flex flex-col glass-island rounded-2xl sm:rounded-3xl overflow-hidden border border-island-border relative shadow-2xl bg-island-bg/20",
      !scrollInIsland && "shrink-0",
      islandClassName
    )}>
      <div className={cn(
        "flex-1 min-h-0 flex flex-col rounded-[inherit]",
        scrollInIsland && "overflow-y-auto custom-scrollbar",
        contentClassName
      )}>
        {children}
      </div>
      {footer}
    </div>
  );
}
