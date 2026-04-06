'use client';

import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { ToolConfig, TOOLS } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ArrowUp, Command, LucideIcon, Search, X } from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export function CommandMenu(): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router: AppRouterInstance = useRouter();

  // Raccourcis clavier et événements
  useEffect(() => {
    const down = (e: KeyboardEvent): void => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open: boolean): boolean => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const openMenu = (): void => setIsOpen(true);

    document.addEventListener('keydown', down);
    window.addEventListener('open-command-menu', openMenu);

    return (): void => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('open-command-menu', openMenu);
    };
  }, []);

  const filteredItems: ToolConfig[] = useMemo((): ToolConfig[] => {
    if (!search) {
      return TOOLS.filter((t: ToolConfig) => t.status === 'active').slice(0, 5);
    }
    return TOOLS.filter((item: ToolConfig) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 8);
  }, [search]);

  useEffect(() => {
    const frame: number = requestAnimationFrame(() => {
      setActiveIndex(0);
    });
    return (): void => cancelAnimationFrame(frame);
  }, [search]);

  const onSelect: (href: string) => void = useCallback((href: string) => {
    setIsOpen(false);
    setSearch('');
    router.push(href);
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      if (filteredItems[activeIndex]) {
        onSelect(filteredItems[activeIndex].href);
      }
    }
  };

  return (
    <AnimatePresence>
      {
        isOpen
        && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-100"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[10%] inset-x-0 mx-auto w-[calc(100%-1.5rem)] sm:w-full max-w-xl z-101"
            >
              <div className="bg-island-bg/95 border border-island-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl">
                <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-island-border">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted mr-2 sm:mr-3" />
                  <input
                    autoFocus
                    placeholder="Search tools..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base sm:text-lg"
                  />
                  <div
                    className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-island-bg border border-island-border text-[10px] font-black text-muted-foreground">
                    <Command className="w-3 h-3" /> K
                  </div>
                </div>

                <div className="p-1.5 sm:p-2 max-h-[60vh] sm:max-h-100 overflow-y-auto custom-scrollbar">
                  {
                    filteredItems.length > 0
                      ? (
                        <div className="py-1">
                          <p className="px-3 sm:px-4 py-1 text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Available
                            tools</p>
                          {
                            filteredItems.map((item: ToolConfig, index: number) => {
                              const Icon: LucideIcon = item.icon;
                              const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[item.category]);

                              return (
                                <button
                                  key={item.id}
                                  onClick={() => onSelect(item.href)}
                                  onMouseEnter={() => setActiveIndex(index)}
                                  className={cn(
                                    'w-full flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all text-left group',
                                    activeIndex === index
                                      ? 'bg-blue-600/10 text-blue-400'
                                      : 'text-muted hover:bg-island-bg/50',
                                    item.status === 'coming-soon' && 'opacity-50'
                                  )}
                                  aria-label={`Open ${item.title} tool`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={cn(
                                      'w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center border transition-colors',
                                      activeIndex === index ? cn(theme.bg, theme.border, 'text-white') : cn('bg-island-bg border-island-border text-muted-foreground', theme.hoverText)
                                    )}>
                                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                    <div>
                                      <p className="text-xs sm:text-sm font-bold text-foreground">{item.title}</p>
                                      <p
                                        className="text-[8px] sm:text-[9px] text-muted-foreground font-medium leading-none line-clamp-1">{item.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {
                                      item.status === 'coming-soon'
                                      && <span
                                        className="text-[8px] font-black bg-island-bg border border-island-border px-1.5 py-0.5 rounded uppercase tracking-widest text-muted-foreground">Soon</span>
                                    }
                                    <ArrowRight
                                      className={cn('w-4 h-4 transition-all', activeIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2')} />
                                  </div>
                                </button>
                              );
                            })
                          }
                        </div>
                      )
                      : (
                        <div className="py-4 sm:py-12 text-center">
                          <p className="text-muted text-xs sm:text-sm">No tools found for &quot;{search}&quot;</p>
                        </div>
                      )
                  }
                </div>

                <div
                  className="px-4 sm:px-6 py-2 sm:py-3 border-t border-island-border bg-island-bg/30 flex items-center justify-between text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  <div className="flex gap-4 sm:gap-6 whitespace-nowrap">
                    <span className="hidden xs:flex items-center gap-1.5">
                      <span className="flex items-center gap-0.5">
                        <ArrowUp className="w-2.5 h-2.5" />
                        <ArrowDown className="w-2.5 h-2.5" />
                      </span>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="flex items-center">
                        <span className="hidden sm:inline">ENTER</span>
                        <span className="sm:hidden text-xs">⏎</span>
                      </span>
                      <span>Select</span>
                    </span>
                    <span className="hidden xs:flex items-center gap-1.5">
                      <span className="flex items-center">
                        <span className="hidden sm:inline">ESC</span>
                        <X className="sm:hidden w-2.5 h-2.5" />
                      </span>
                      <span>Close</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )
      }
    </AnimatePresence>
  );
}
