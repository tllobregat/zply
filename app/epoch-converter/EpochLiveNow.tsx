import { Button } from '@/components/ui/button';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import React, { ReactNode } from 'react';

interface EpochLiveNowProps {
  mounted: boolean;
  now: number;
  theme: CategoryTheme;
  onSetNow: () => void;
}

export function EpochLiveNow(
  {
    mounted,
    now,
    theme,
    onSetNow,
  }: EpochLiveNowProps,
): ReactNode {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="px-4 py-2 rounded-xl bg-island-bg border border-island-border flex items-center gap-3 w-full md:w-auto">
        <div className={cn('w-2 h-2 rounded-full animate-pulse', theme.bg)} />
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Now:</span>
        <code className="text-xs font-mono text-foreground">{mounted ? now : '--'}</code>
      </div>

      <Button
        onClick={onSetNow}
        variant="secondary"
        className="w-full md:w-auto"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Use Current Time
      </Button>
    </div>
  );
}
