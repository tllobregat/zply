'use client';

import React, { ReactNode } from 'react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';
import { getCategoryClasses } from '@/lib/config/categories';
import { CopyButton } from '@/components/ui/copy-button';

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
  icon: ReactNode;
  copyable?: boolean;
  theme: ReturnType<typeof getCategoryClasses>;
}

export function InfoRow({ label, value, icon, copyable, theme }: InfoRowProps): ReactNode {
  const { copy, isCopied } = useCopyToClipboard();
  
  return (
    <div className={cn("flex items-center justify-between p-3 rounded-xl bg-island-bg border border-island-border group transition-all", theme.hoverBorder)}>
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-island-card border border-island-border text-muted-foreground transition-colors", theme.hoverText)}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
          <span className="text-sm font-bold text-foreground truncate max-w-40 md:max-w-xs">{value || 'Unknown'}</span>
        </div>
      </div>
      {
        copyable && value
        && (
          <CopyButton
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onCopy={(): void => copy(value.toString())}
            isCopied={isCopied()}
            showText={false}
          />
        )
      }
    </div>
  );
}
