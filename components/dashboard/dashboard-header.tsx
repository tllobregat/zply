'use client';

import { getCategoryColorClass } from '@/lib/config/categories';
import { CATEGORIES, Category } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { ChevronLeft, Command, Search } from 'lucide-react';
import React from 'react';

interface DashboardHeaderProps {
  activeCategory: Category;
  search: string;
  setSearch: (search: string) => void;
  setActiveCategory: (category: Category, useReplace?: boolean) => void;
  isBrowsingCategories: boolean;
  filteredToolsCount: number;
}

export function DashboardHeader(
  {
    activeCategory,
    search,
    setSearch,
    setActiveCategory,
    isBrowsingCategories,
    filteredToolsCount,
  }: DashboardHeaderProps,
): React.ReactNode {
  const searchTitle: string = search ? 'Search Results' : 'Dashboard';
  const title: string = activeCategory === Category.ALL
    ? searchTitle
    : activeCategory;

  return (
    <header className="px-4 py-4 sm:px-8 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-b border-island-border/50 bg-island-bg/40 backdrop-blur-sm">
      <div className="flex items-center gap-4 sm:gap-8 flex-1 min-w-0">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-3xl font-black tracking-tighter text-foreground leading-none">
              ZPLY
            </h1>
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-zply-blue mt-0.5 sm:mt-1">
              Toolbox
            </span>
          </div>
        </div>

        <div className="w-px h-6 sm:h-8 bg-island-border" />

        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {
            !isBrowsingCategories
            && (
              <button
                onClick={() => {
                  setActiveCategory(Category.ALL, true);
                  setSearch('');
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-island-bg border border-island-border hover:border-blue-500/30 text-muted transition-all active:scale-95 hover:text-foreground group/back shadow-sm shrink-0"
                aria-label="Back to all categories"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover/back:-translate-x-0.5 transition-transform" />
              </button>
            )
          }
          <div className="flex-1 min-w-0">
            <h2 className={cn(
              "text-base sm:text-2xl font-black tracking-tight flex items-center gap-2 uppercase truncate",
              activeCategory !== Category.ALL ? getCategoryColorClass(activeCategory) : "text-foreground"
            )}>
              {title}
            </h2>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
              <p className="text-muted-foreground text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-80 whitespace-nowrap">
                {
                  isBrowsingCategories
                    ? `${CATEGORIES.length - 1} Categories`
                    : `${filteredToolsCount} Tools`
                }
              </p>
              <div className="w-1 h-1 rounded-full bg-island-border shrink-0" />
              <p className="text-zply-blue text-[8px] sm:text-[10px] font-black uppercase tracking-widest opacity-80 whitespace-nowrap">
                100% Private
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative group w-full md:w-[400px] lg:w-[500px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Search tools (e.g. jwt, json, regex)..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-full bg-island-bg border border-island-border rounded-xl sm:rounded-2xl py-3 sm:py-4 pl-12 sm:pl-14 pr-10 sm:pr-24 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all outline-none text-sm sm:text-base text-foreground placeholder:text-muted/50 shadow-sm group-hover:border-island-border-hover"
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-island-bg border border-island-border pointer-events-none group-focus-within:opacity-0 transition-opacity"
        >
          <Command className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] font-black text-muted-foreground">K</span>
        </div>
      </div>
    </header>
  );
}
