'use client';

import { ArrowDown, ArrowUp, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

export function CommandMenuFooter(): React.ReactNode {
  const tCommon = useTranslations('Common');

  return (
    <div
      className="px-5 sm:px-8 py-2.5 sm:py-3.5 border-t border-island-border bg-island-bg/30 flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest">
      <div className="flex gap-4 sm:gap-6 whitespace-nowrap">
        <span className="hidden xs:flex items-center gap-2">
          <span className="flex items-center gap-1">
            <ArrowUp className="w-3 h-3" />
            <ArrowDown className="w-3 h-3" />
          </span>
          <span>{tCommon('sidebar.commandMenu.navigate')}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="flex items-center">
            <span className="hidden sm:inline">ENTER</span>
            <span className="sm:hidden text-sm">⏎</span>
          </span>
          <span>{tCommon('sidebar.commandMenu.select')}</span>
        </span>
        <span className="hidden xs:flex items-center gap-2">
          <span className="flex items-center">
            <span className="hidden sm:inline">ESC</span>
            <X className="sm:hidden w-3 h-3" />
          </span>
          <span>{tCommon('sidebar.commandMenu.close')}</span>
        </span>
      </div>
    </div>
  );
}
