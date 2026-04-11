'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface PageLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  islandClassName?: string;
  contentClassName?: string;
  scrollInIsland?: boolean;
  afterIsland?: React.ReactNode;
  id?: string;
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(({
  header,
  children,
  footer,
  className,
  islandClassName,
  contentClassName,
  scrollInIsland = true,
  afterIsland,
  id,
}, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex-1 flex flex-col min-h-0",
        scrollInIsland ? "overflow-hidden" : "overflow-y-auto custom-scrollbar",
        className
      )}
    >
      <div
        id={id}
        ref={ref}
        className={cn(
          "flex flex-col px-2 sm:pl-0 sm:pr-3",
          scrollInIsland ? "flex-1 min-h-0" : "h-full shrink-0"
        )}
      >
        {header}

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
      </div>
      {afterIsland}
    </motion.div>
  );
});

PageLayout.displayName = 'PageLayout';
