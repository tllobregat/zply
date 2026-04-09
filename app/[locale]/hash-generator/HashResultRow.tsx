import { CopyButton } from '@/components/ui/copy-button';
import { getCategoryClasses } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import React from 'react';

type HashResultRowProps = {
  label: string;
  value: string;
  isCopied: boolean;
  onCopy: () => void;
  theme: ReturnType<typeof getCategoryClasses>;
}

export default function HashResultRow({ label, value, isCopied, onCopy, theme }: HashResultRowProps): React.ReactNode {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
        <CopyButton
          onCopy={onCopy}
          isCopied={isCopied}
          copyText="Copy"
          copiedText="Copié"
          className={cn(
            '-mr-3 transition-colors',
            !isCopied && theme.hoverText
          )}
        />
      </div>
      <div
        className={cn(
          'p-4 rounded-2xl bg-island-bg/50 border border-island-border font-mono text-xs break-all text-foreground transition-all min-h-12 flex items-center shadow-inner',
          theme.hoverBorder
        )}>
        {value || <span className="opacity-30 italic">Enter text to generate hash...</span>}
      </div>
    </div>
  );
}
