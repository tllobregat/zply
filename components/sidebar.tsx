'use client';

import { usePinnedTools } from '@/hooks/use-pinned-tools';
import { CATEGORY_COLORS, CategoryColor, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import type { ToolConfig } from '@/lib/config/tools';
import { TOOLS } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Github, LayoutGrid, LucideIcon, Menu, Search, X, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import { Portal } from './ui/portal';

export function Sidebar(): React.ReactNode {
  const pathname: string = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { pinnedIds }: { pinnedIds: string[] } = usePinnedTools();

  const pinnedTools: ToolConfig[] = useMemo(() => {
    return pinnedIds
      .map((id: string): ToolConfig | undefined =>
        TOOLS.find((t: ToolConfig): boolean => t.id === id)
      )
      .filter((t: ToolConfig | undefined): t is ToolConfig => Boolean(t));
  }, [pinnedIds]);


  const handleOpenSearch: () => void = (): void => {
    window.dispatchEvent(new CustomEvent('open-command-menu'));
  };

  return (
    <aside
      className="w-full sm:w-20 h-auto sm:h-full flex flex-row sm:flex-col items-center py-2 sm:py-8 px-4 sm:px-0 glass-island rounded-2xl sm:rounded-[2.5rem] border border-island-border shadow-2xl z-50 mb-safe sm:mb-0">
      {/* Logo Zply - Acts as Home button */}
      <Link
        href="/"
        onClick={(e: React.MouseEvent): void => {
          if (pathname === '/') {
            e.preventDefault();
            document.getElementById('home-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className={cn(
          'p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all active:scale-95 hover:rotate-3 relative group',
          pathname === '/' ? 'bg-zply-blue shadow-lg shadow-zply-blue/30' : 'bg-island-bg border border-island-border text-muted hover:text-foreground hover:bg-island-bg/80'
        )}
        aria-label="Home Page"
      >
        <Zap className={cn('w-5 h-5 sm:w-6 sm:h-6 fill-current', pathname === '/' ? 'text-white' : 'text-current')} />
        <span
          className="absolute left-16 sm:left-22.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl z-60 hidden sm:block">
          Home Page
        </span>
      </Link>

      <div className="w-px sm:w-8 h-8 sm:h-px bg-island-border/50 mx-2 sm:mx-auto my-0 sm:my-2 sm:hidden" />

      <nav className="flex-1 flex flex-row sm:flex-col items-center justify-start sm:mt-6 gap-2 sm:gap-6">
        {/* Search Trigger */}
        <button
          onClick={handleOpenSearch}
          className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all relative group text-muted-foreground hover:text-zply-blue hover:bg-zply-blue/10 cursor-pointer"
          aria-label="Open search menu"
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          <span
            className="absolute left-16 sm:left-22.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl z-60 hidden sm:block">
            Search <span className="text-muted-foreground ml-2">⌘K</span>
          </span>
        </button>

        <div className="w-px sm:w-8 h-8 sm:h-px bg-island-border/50 mx-1 sm:mx-auto my-0 sm:my-2" />

        {/* Dashboard / Categories shortcut */}
        <Link
          href="/#dashboard"
          onClick={(e: React.MouseEvent): void => {
            if (pathname === '/') {
              e.preventDefault();
              document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all relative group text-muted-foreground hover:text-zply-blue hover:bg-zply-blue/10 cursor-pointer"
          aria-label="Go to Dashboard"
        >
          <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
          <span
            className="absolute left-16 sm:left-22.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl z-60 hidden sm:block">
            Dashboard
          </span>
        </Link>

        {
          pinnedTools.length > 0
          && (
            <>
              <div className="w-px sm:w-8 h-8 sm:h-px bg-island-border/50 mx-1 sm:mx-auto my-0 sm:my-2" />

              {/* Desktop: Pinned Tools Icons */}
              <div className="hidden sm:flex flex-col gap-6">
                {
                  pinnedTools.map((tool: ToolConfig, index: number) => {
                    const Icon: LucideIcon = tool.icon;
                    const isActive: boolean = pathname === tool.href;
                    const categoryColor: CategoryColor = CATEGORY_COLORS[tool.category];
                    const theme: CategoryTheme = getCategoryClasses(categoryColor);

                    return (
                      <React.Fragment key={tool.id}>
                        {
                          index === 3
                          && (
                            <div className="hidden sm:block w-8 h-px bg-island-border/50 mx-auto my-2" />
                          )
                        }
                        <Link
                          href={tool.href}
                          className={cn(
                            'p-3.5 rounded-2xl transition-all relative group shrink-0',
                            isActive
                              ? cn('shadow-lg text-white', theme.bg, theme.shadow)
                              : cn('text-muted-foreground bg-island-bg border border-island-border', theme.hoverText, `hover:bg-${categoryColor}-600/10`)
                          )}
                          aria-label={tool.title}
                        >
                          <Icon className={cn('w-6 h-6', !isActive && theme.text)} />
                          <span
                            className="absolute left-22.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl z-60"
                          >
                            {tool.title}
                          </span>
                        </Link>
                      </React.Fragment>
                    );
                  })
                }
              </div>
            </>
          )
        }
      </nav>

      <div className="w-px sm:w-8 h-8 sm:h-px bg-island-border/50 mx-2 sm:mx-auto my-0 sm:my-2" />

      {/* Burger Menu Toggle (Mobile) */}
      <div className="sm:hidden">
        <button
          onClick={(): void => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-xl transition-all relative text-muted-foreground hover:text-zply-blue hover:bg-zply-blue/10 flex items-center gap-1"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="hidden sm:flex flex-col gap-6 mt-auto items-center">
        <ThemeToggle />

        <a
          href="https://github.com/tllobregat/zply"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 sm:p-3.5 text-muted hover:text-foreground hover:bg-island-bg/50 rounded-xl sm:rounded-2xl transition-all group relative"
          aria-label="GitHub Repository"
        >
          <Github className="w-5 h-5 sm:w-6 sm:h-6" />
          <span
            className="absolute left-16 sm:left-22.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl hidden sm:block">
            GitHub
          </span>
        </a>

        <a
          href="https://buymeacoffee.com/tllo"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 sm:p-3.5 text-muted hover:text-orange-400 hover:bg-orange-400/10 rounded-xl sm:rounded-2xl transition-all group relative"
          aria-label="Buy me a coffee"
        >
          <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
          <span
            className="absolute left-16 sm:left-22.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl hidden sm:block">
            Buy me a coffee
          </span>
        </a>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Portal>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 bg-background/90 backdrop-blur-xl z-[100] sm:hidden flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zply-blue rounded-xl">
                    <Zap className="w-5 h-5 text-white fill-current" />
                  </div>
                  <span className="text-xl font-black uppercase tracking-widest text-foreground">Menu</span>
                </div>
                <button
                  onClick={(): void => setIsMobileMenuOpen(false)}
                  className="p-3 rounded-xl bg-island-bg border border-island-border text-muted-foreground hover:text-foreground active:scale-90 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-10">
                {pinnedTools.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Pinned Tools</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {pinnedTools.map((tool: ToolConfig, index: number) => {
                        const Icon: LucideIcon = tool.icon;
                        const isActive: boolean = pathname === tool.href;
                        const categoryColor: CategoryColor = CATEGORY_COLORS[tool.category];
                        const theme: CategoryTheme = getCategoryClasses(categoryColor);

                        return (
                          <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + (index * 0.05) }}
                          >
                            <Link
                              href={tool.href}
                              onClick={(): void => setIsMobileMenuOpen(false)}
                              className={cn(
                                'flex items-center gap-4 p-4 rounded-2xl transition-all',
                                isActive ? 'bg-zply-blue/10 border border-zply-blue/20' : 'bg-island-bg border border-island-border active:scale-[0.98]'
                              )}
                            >
                              <div className={cn(
                                'p-3 rounded-xl transition-all shrink-0',
                                isActive ? cn('shadow-sm text-white', theme.bg) : cn('bg-island-bg border border-island-border', theme.text)
                              )}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className={cn('text-sm font-bold', isActive ? 'text-foreground' : 'text-foreground/80')}>
                                  {tool.title}
                                </span>
                                <span className="text-[11px] text-muted-foreground line-clamp-1">
                                  {tool.description}
                                </span>
                              </div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Preferences & Links</h3>
                  <div className="flex flex-wrap gap-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-island-bg border border-island-border p-2 rounded-2xl flex items-center"
                    >
                      <ThemeToggle />
                    </motion.div>
                    <motion.a
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45 }}
                      href="https://github.com/tllobregat/zply"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-island-bg border border-island-border rounded-2xl text-muted-foreground flex items-center gap-3 active:scale-95 transition-all"
                    >
                      <Github className="w-5 h-5" />
                      <span className="text-sm font-bold">GitHub</span>
                    </motion.a>
                    <motion.a
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      href="https://buymeacoffee.com/tllo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-island-bg border border-island-border rounded-2xl text-muted-foreground flex items-center gap-3 active:scale-95 transition-all"
                    >
                      <Coffee className="w-5 h-5" />
                      <span className="text-sm font-bold">Support</span>
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </aside>
  );
}
