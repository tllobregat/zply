'use client';

import { usePinnedTools } from '@/hooks/use-pinned-tools';
import { CATEGORY_COLORS, CategoryColor, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import type { ToolConfig } from '@/lib/config/tools';
import { TOOLS } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { Coffee, Github, LayoutGrid, LucideIcon, Search, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { ThemeToggle } from './theme-toggle';

export function Sidebar(): React.ReactNode {
  const pathname: string = usePathname();

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
      className="w-full sm:w-20 h-auto sm:h-full flex flex-row sm:flex-col items-center py-2 sm:py-8 px-4 sm:px-0 glass-island rounded-2xl sm:rounded-[2.5rem] border border-island-border shadow-2xl z-50">
      {/* Logo Zply - Acts as Home button */}
      <Link
        href="/"
        onClick={(e: React.MouseEvent) => {
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

      <nav className="flex-1 flex flex-row sm:flex-col items-center justify-start mt-6 gap-2 sm:gap-6">
        {/* Search Trigger */}
        <button
          onClick={handleOpenSearch}
          className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all relative group text-muted-foreground hover:text-zply-blue hover:bg-zply-blue/10"
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
          onClick={(e: React.MouseEvent) => {
            if (pathname === '/') {
              e.preventDefault();
              document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all relative group text-muted-foreground hover:text-zply-blue hover:bg-zply-blue/10"
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
              <div className="flex flex-row sm:flex-col gap-2">
                {
                  pinnedTools.map((tool: ToolConfig) => {
                    const Icon: LucideIcon = tool.icon;
                    const isActive: boolean = pathname === tool.href;
                    const categoryColor: CategoryColor = CATEGORY_COLORS[tool.category];
                    const theme: CategoryTheme = getCategoryClasses(categoryColor);

                    return (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className={cn(
                          'p-3 sm:p-3.5 rounded-xl sm:rounded-2xl transition-all relative group shrink-0',
                          isActive
                            ? cn('shadow-lg text-white', theme.bg, theme.shadow)
                            : cn('text-muted-foreground bg-island-bg border border-island-border', theme.hoverText, `hover:bg-${categoryColor}-600/10`)
                        )}
                        aria-label={tool.title}
                      >
                        <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', !isActive && theme.text)} />
                        <span
                          className="absolute left-16 sm:left-22.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl z-60 hidden sm:block"
                        >
                          {tool.title}
                        </span>
                      </Link>
                    );
                  })
                }
              </div>
            </>
          )}
      </nav>

      <div className="w-px sm:w-8 h-8 sm:h-px bg-island-border/50 mx-2 sm:mx-auto my-0 sm:my-2 sm:hidden" />

      <div className="flex flex-row sm:flex-col gap-2 sm:gap-6 mt-0 sm:mt-auto items-center">
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
    </aside>
  );
}
