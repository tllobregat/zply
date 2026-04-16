'use client';

import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { ToolConfig } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

interface CommandMenuItemProps {
  item: ToolConfig;
  index: number;
  activeIndex: number;
  onSelect: (href: string) => void;
  onMouseEnter: (index: number) => void;
}

export function CommandMenuItem({
  item,
  index,
  activeIndex,
  onSelect,
  onMouseEnter,
}: CommandMenuItemProps): React.ReactNode {
  const tTools = useTranslations('Tools');
  const tCommon = useTranslations('Common');

  const Icon: LucideIcon = item.icon;
  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[item.category]);
  const isActive = activeIndex === index;

  return (
    <button
      onClick={() => onSelect(item.href)}
      onMouseEnter={() => onMouseEnter(index)}
      className={cn(
        'w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all text-left group',
        isActive
          ? 'bg-blue-600/10 text-blue-400'
          : 'text-muted hover:bg-island-bg/50',
        item.status === 'coming-soon' && 'opacity-50'
      )}
      aria-label={`${tCommon('sidebar.openSearch')} ${tTools(`${item.id}.title`)}`}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center border transition-colors shrink-0',
          isActive ? cn(theme.bg, theme.border, 'text-white') : cn('bg-island-bg border-island-border text-muted-foreground', theme.hoverText)
        )}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <p className="text-sm sm:text-base font-bold text-foreground">{tTools(`${item.id}.title`)}</p>
          <p
            className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight line-clamp-1">{tTools(`${item.id}.description`)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {
          item.status === 'coming-soon'
          && <span
            className="text-[8px] font-black bg-island-bg border border-island-border px-1.5 py-0.5 rounded uppercase tracking-widest text-muted-foreground">{tCommon('comingSoon')}</span>
        }
        <ArrowRight
          className={cn('w-4 h-4 transition-all', isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2')} />
      </div>
    </button>
  );
}
