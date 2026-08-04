import { getCategoryClasses } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { RefreshCw, Zap } from 'lucide-react';
import React from 'react';

interface StatusDisplayProps {
  isRendering: boolean;
  isEngineReady: boolean;
  theme: ReturnType<typeof getCategoryClasses>;
}

export default function StatusDisplay({ isRendering, isEngineReady, theme }: StatusDisplayProps): React.ReactNode {
  if (isRendering) {
    return (
      <span className={cn('flex items-center gap-2 animate-pulse', theme.text)}>
        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Rendering...
      </span>
    );
  }
  if (!isEngineReady) {
    return (
      <span className="flex items-center gap-2 text-muted-foreground">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Initializing...
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2 text-green-500/60">
      <Zap className="w-3.5 h-3.5 text-yellow-500/50" /> Engine Ready
    </span>
  );
}
