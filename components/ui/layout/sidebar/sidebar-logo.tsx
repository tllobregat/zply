'use client';

import { RESET_DASHBOARD_EVENT } from '@/lib/config/events';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { SidebarTooltip } from './sidebar-tooltip';

export function SidebarLogo(): React.ReactNode {
  const pathname: string = usePathname();
  const tCommon = useTranslations('Common');

  return (
    <Link
      href="/"
      onClick={(e: React.MouseEvent): void => {
        if (pathname === '/') {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent(RESET_DASHBOARD_EVENT));
          document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      className={cn(
        'p-3 sm:p-3.5 rounded-lg sm:rounded-xl transition-all active:scale-95 hover:rotate-3 relative group',
        pathname === '/' ? 'bg-zply-blue shadow-md shadow-zply-blue/30' : 'bg-island-bg border border-island-border text-muted-foreground hover:text-foreground hover:bg-island-bg/80'
      )}
      aria-label={tCommon('homePage')}
    >
      <Zap className={cn('w-5 h-5 sm:w-6 sm:h-6 fill-current', pathname === '/' ? 'text-white' : 'text-current')} />
      <SidebarTooltip>
        {tCommon('homePage')}
      </SidebarTooltip>
    </Link>
  );
}
