'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SidebarTooltip } from './sidebar-tooltip';

export function ThemeToggle(): ReactNode {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const t = useTranslations('Common');

  useEffect((): () => void => {
    const frame: number = requestAnimationFrame((): void => setMounted(true));
    return (): void => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return (
      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl w-11 h-11 sm:w-13 sm:h-13 bg-muted/10 animate-pulse" />
    );
  }

  const isDark: boolean = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={(): void => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all duration-500 group relative active:scale-95',
        'bg-island-bg border border-island-border shadow-lg cursor-pointer',
        'hover:shadow-zply-blue/10 hover:border-zply-blue/50'
      )}
      aria-label={t('sidebar.toggleTheme')}
    >
      <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
        <Sun 
          className={cn(
            'w-5 h-5 sm:w-6 sm:h-6 absolute transition-all duration-500 transform',
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100 text-amber-500'
          )} 
        />
        <Moon 
          className={cn(
            'w-5 h-5 sm:w-6 sm:h-6 absolute transition-all duration-500 transform',
            isDark ? 'rotate-0 scale-100 opacity-100 text-blue-400' : '-rotate-90 scale-0 opacity-0'
          )} 
        />
      </div>
      
      {/* Tooltip style similar to other sidebar buttons */}
      <SidebarTooltip leftOffset="left-22.5">
        {t('sidebar.themeToggle', { mode: isDark ? t('light') : t('dark') })}
      </SidebarTooltip>
    </button>
  );
}
