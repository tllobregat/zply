'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useEffect, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function ThemeToggle(): ReactNode {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

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
        'p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all duration-500 group relative overflow-hidden active:scale-95',
        'bg-island-bg border border-island-border shadow-lg cursor-pointer',
        'hover:shadow-zply-blue/10 hover:border-zply-blue/50'
      )}
      aria-label="Toggle theme"
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
      <span
        className="absolute left-22.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl z-60 hidden sm:block"
      >
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </span>
    </button>
  );
}
