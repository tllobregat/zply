import { cn } from '@/lib/utils';
import React from 'react';

interface SeparatorProps {
  className?: string;
}

export function Separator({ className }: SeparatorProps): React.ReactNode {
  return (
    <span className={cn('text-muted', className)} aria-hidden="true">
      |
    </span>
  );
}
