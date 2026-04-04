'use client';

import { getCategoryColorClass } from '@/lib/config/categories';
import { Category } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { ChevronLeft, LayoutGrid } from 'lucide-react';
import React from 'react';

interface DashboardBreadcrumbProps {
  activeCategory: Category;
  search: string;
  setActiveCategory: (category: Category) => void;
  setSearch: (search: string) => void;
  isBrowsingCategories: boolean;
}

export function DashboardBreadcrumb(
  {
    activeCategory,
    search,
    setActiveCategory,
    setSearch,
    isBrowsingCategories,
  }: DashboardBreadcrumbProps,
): React.ReactNode {
  if (isBrowsingCategories) {
    return null;
  }

  return (
    <div className="px-3 sm:px-10 flex items-center gap-2 sm:gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4 sm:mb-6 bg-island-bg/30 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-island-border/30 w-fit max-w-full overflow-hidden truncate">
      <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
      <span
        className="cursor-pointer hover:text-zply-blue transition-colors shrink-0"
        onClick={() => {
          setActiveCategory(Category.ALL);
          setSearch('');
        }}
      >
        Toolbox
      </span>
      <ChevronLeft className="w-2.5 h-2.5 sm:w-3 h-3 rotate-180 text-muted/30 shrink-0" />
      <span className={cn("font-black truncate", getCategoryColorClass(activeCategory))}>
        {search ? 'Search' : activeCategory}
      </span>
    </div>
  );
}
