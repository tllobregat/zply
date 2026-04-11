import { cn } from '@/lib/utils';
import React from 'react';

interface SidebarTooltipProps {
  children: React.ReactNode;
  className?: string;
  showOnMobile?: boolean;
  leftOffset?: string;
}

/**
 * Standardized tooltip for sidebar items.
 * Appears on hover and matches the sidebar's design system.
 */
export function SidebarTooltip({
  children,
  className,
  showOnMobile = false,
  leftOffset = 'left-16 sm:left-22.5'
}: SidebarTooltipProps): React.ReactNode {
  return (
    <span
      className={cn(
        'absolute top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-xs font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl z-60',
        !showOnMobile && 'hidden sm:block',
        leftOffset,
        className
      )}
    >
      {children}
    </span>
  );
}
