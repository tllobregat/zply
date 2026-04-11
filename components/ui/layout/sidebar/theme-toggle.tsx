'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SidebarTooltip } from './sidebar-tooltip';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  variant?: 'desktop' | 'mobile';
}

export function ThemeToggle({ variant = 'desktop' }: ThemeToggleProps): ReactNode {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const t = useTranslations('Common');

  useEffect((): () => void => {
    const frame: number = requestAnimationFrame((): void => setMounted(true));
    return (): void => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    if (variant === 'mobile') {
      return (
        <div className="p-4 bg-island-bg/50 border border-island-border rounded-2xl w-full h-[76px] animate-pulse" />
      );
    }
    return (
      <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl w-11 h-11 sm:w-13 sm:h-13 bg-muted/10 animate-pulse" />
    );
  }

  const isDark: boolean = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (variant === 'mobile') {
    return (
      <button
        onClick={(): void => setTheme(isDark ? 'light' : 'dark')}
        className="p-4 bg-island-bg border border-island-border rounded-2xl text-muted-foreground flex items-center justify-between active:scale-95 transition-all w-full"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2.5 rounded-xl transition-all shrink-0',
            isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-500'
          )}>
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 leading-none mb-1">
              {t('theme')}
            </span>
            <span className="text-sm font-bold text-foreground">
              {isDark ? t('dark') : t('light')}
            </span>
          </div>
        </div>

        <div className={cn(
          "relative w-11 h-6 rounded-full border border-island-border transition-colors duration-300",
          isDark ? "bg-blue-600/20" : "bg-muted/20"
        )}>
          <motion.div
            className="absolute top-1 left-1 w-4 h-4 bg-foreground rounded-full shadow-sm"
            animate={{ x: isDark ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </button>
    );
  }

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
