'use client';

import { ToolConfig } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import React from 'react';
import { CommandMenuItem } from './command-menu-item';

interface CommandMenuResultsProps {
  items: ToolConfig[];
  search: string;
  activeIndex: number;
  onSelect: (href: string) => void;
  onMouseEnter: (index: number) => void;
}

export function CommandMenuResults({
  items,
  search,
  activeIndex,
  onSelect,
  onMouseEnter,
}: CommandMenuResultsProps): React.ReactNode {
  const tCommon = useTranslations('Common');

  return (
    <div className="p-2 sm:p-3 max-h-[65vh] sm:max-h-100 overflow-y-auto custom-scrollbar">
      {
        items.length > 0
          ? (
            <div className="py-1">
              <p className="px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest">
                {tCommon('sidebar.commandMenu.availableTools')}
              </p>
              {
                items.map((item, index) => (
                  <CommandMenuItem
                    key={item.id}
                    item={item}
                    index={index}
                    activeIndex={activeIndex}
                    onSelect={onSelect}
                    onMouseEnter={onMouseEnter}
                  />
                ))
              }
            </div>
          )
          : (
            <div className="py-4 sm:py-12 text-center">
              <p className="text-muted text-xs sm:text-sm">{tCommon('sidebar.commandMenu.noResults', { search })}</p>
            </div>
          )
      }
    </div>
  );
}
