'use client';

import { ViewMode } from '@/hooks/use-view-mode';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

/**
 * Interface for the ViewModeToggle component props.
 */
interface ViewModeToggleProps<T extends string = ViewMode> {
  /** The current view mode */
  viewMode: T;
  /** Callback function to update the view mode */
  setViewMode: (mode: T) => void;
  /** Optional additional CSS classes */
  className?: string;
  /** Optional custom modes */
  modes?: { id: T; label: string }[];
}

/**
 * Available modes definition with label and id.
 */
const DEFAULT_MODES: { id: ViewMode; label: string }[] = [
  { id: 'editor', label: 'Editor' },
  { id: 'split', label: 'Split' },
  { id: 'preview', label: 'Preview' },
];

/**
 * A highly reusable toggle component for switching between 'editor', 'split', and 'preview' modes.
 * Features smooth Framer Motion animations and "Zply" aesthetic.
 */
export function ViewModeToggle<T extends string = ViewMode>(
  {
    viewMode,
    setViewMode,
    className,
    modes = DEFAULT_MODES as unknown as { id: T; label: string }[]
  }: ViewModeToggleProps<T>
): React.ReactNode {
  return (
    <div className={cn(
      'flex p-1 bg-island-bg/50 border border-island-border rounded-2xl relative shadow-inner',
      className
    )}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => setViewMode(mode.id)}
          className={cn(
            'relative z-10 px-3 py-2 flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors duration-300',
            viewMode === mode.id
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-label={`Switch to ${mode.label} view`}
        >
          {viewMode === mode.id && (
            <motion.div
              layoutId={`view-mode-active-${className}`} // Unique layoutId if multiple toggles are on the same page
              className="absolute inset-0 bg-island-bg border border-island-border rounded-xl shadow-lg -z-10"
              initial={false}
              transition={{
                type: 'spring',
                bounce: 0.15,
                duration: 0.5
              }}
            />
          )}
          <span className="relative">
            {mode.label}
          </span>
        </button>
      ))}
    </div>
  );
}
