import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import React, { ReactNode } from 'react';

interface IpInfoHeroProps {
  ip: string;
  isCopied: boolean;
  onCopy: () => void;
  theme: CategoryTheme;
}

export function IpInfoHero({ ip, isCopied, onCopy, theme }: IpInfoHeroProps): ReactNode {
  return (
    <div
      className="relative group p-8 md:p-10 rounded-[3rem] bg-island-card border border-island-border overflow-hidden text-center md:text-left">
      <div className={cn('absolute -inset-1 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000', theme.bg)}></div>
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
            <span
              className={cn('flex items-center justify-center md:justify-start gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-1', theme.text)}>
              <Zap className="w-3.5 h-3.5 fill-current" /> Your Public IP Address
            </span>
          <h2 className={cn('text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black font-mono tracking-tighter text-foreground break-all leading-tight', theme.selection)}>
            {ip}
          </h2>
        </div>
        <CopyButton
          onCopy={onCopy}
          isCopied={isCopied}
          copyText="Copy IP"
          className={cn(
            'h-12 md:h-14 px-8 rounded-2xl text-white font-bold gap-3 shadow-lg transition-all active:scale-95 shrink-0 hover:opacity-90',
            theme.bg,
            theme.shadow,
            isCopied && 'text-white'
          )}
        />
      </div>
    </div>
  );
}
