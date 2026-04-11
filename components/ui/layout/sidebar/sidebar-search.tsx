'use client';

import { OPEN_COMMAND_MENU_EVENT } from '@/lib/config/events';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import React from 'react';
import { SidebarTooltip } from './sidebar-tooltip';

export function SidebarSearch(): React.ReactNode {
  const tCommon = useTranslations('Common');
  const tIndex = useTranslations('Index');

  const handleOpenSearch: () => void = (): void => {
    window.dispatchEvent(new CustomEvent(OPEN_COMMAND_MENU_EVENT));
  };

  return (
    <button
      onClick={handleOpenSearch}
      className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-3 p-3 sm:p-3.5 bg-island-bg/40 border border-island-border sm:border-transparent sm:bg-transparent rounded-xl sm:rounded-xl transition-all relative group text-muted-foreground hover:text-zply-blue hover:bg-zply-blue/10 cursor-pointer"
      aria-label={tCommon('sidebar.openSearch')}
    >
      <Search className="w-5 h-5 sm:w-6 sm:h-6" />
      <span className="sm:hidden text-sm font-medium truncate max-w-40 sm:max-w-none">{tIndex('searchPlaceholderMobile')}</span>
      <SidebarTooltip>
        {tCommon('sidebar.search')} <span className="text-muted-foreground ml-2">{tCommon('sidebar.searchShortcut')}</span>
      </SidebarTooltip>
    </button>
  );
}
