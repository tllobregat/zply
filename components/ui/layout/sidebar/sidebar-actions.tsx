'use client';

import { Coffee } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { SidebarTooltip } from './sidebar-tooltip';

export function SidebarActions(): React.ReactNode {
  const tCommon = useTranslations('Common');

  return (
    <div className="hidden sm:flex flex-col gap-6 mt-auto items-center">
      <LanguageSwitcher />
      <ThemeToggle />

      <a
        href="https://buymeacoffee.com/tllo"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 sm:p-3.5 text-muted hover:text-orange-400 hover:bg-orange-400/10 rounded-xl sm:rounded-2xl transition-all group relative"
        aria-label={tCommon('sidebar.support')}
      >
        <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
        <SidebarTooltip>
          {tCommon('sidebar.support')}
        </SidebarTooltip>
      </a>
    </div>
  );
}
