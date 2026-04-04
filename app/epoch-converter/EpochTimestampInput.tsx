import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/ui/copy-button';
import React, { ReactNode } from 'react';

interface EpochTimestampInputProps {
  value: string;
  onChange: (val: string) => void;
  onCopy: () => void;
  isCopied: boolean;
  theme: CategoryTheme;
}

export function EpochTimestampInput(
  {
    value,
    onChange,
    onCopy,
    isCopied,
    theme,
  }: EpochTimestampInputProps,
): ReactNode {
  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Unix Timestamp (Seconds or
        Milliseconds)</label>
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full bg-island-bg/50 border-2 border-island-border rounded-3xl py-6 px-8 text-4xl font-mono focus:ring-4 transition-all outline-none',
            theme.text,
            `focus:border-${theme.text.split('-')[1]}-500/30`,
            `focus:ring-${theme.text.split('-')[1]}-500/5`
          )}
          placeholder="1710850000"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
          <CopyButton
            onCopy={onCopy}
            isCopied={isCopied}
            variant="outline"
            size="icon"
            showText={false}
            className={isCopied ? theme.text : ''}
          />
        </div>
      </div>
    </div>
  );
}
