'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { CATEGORY_META, CategoryMeta, getCategoryClasses, getCategoryColorClass } from '@/lib/config/categories';
import { CATEGORIES, Category } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { LayoutGrid, LucideIcon, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const tCommon = useTranslations('Common');
  const tIndex = useTranslations('Index');
  const tCategories = useTranslations('Categories');

  const title: string = activeCategory === Category.ALL
    ? tCommon('toolbox')
    : tCategories(activeCategory);

  const breadcrumbItems: BreadcrumbItem[] = activeCategory !== Category.ALL
    ? [{ label: tCategories(activeCategory) }]
    : [];

  const meta: CategoryMeta | undefined = activeCategory !== Category.ALL
    ? CATEGORY_META[activeCategory as keyof typeof CATEGORY_META]
    : undefined;
  const Icon: LucideIcon = meta?.icon || LayoutGrid;
  const theme = meta ? getCategoryClasses(meta.color) : undefined;

  return (
    <header className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 shrink-0">
      <div className="flex flex-col min-w-0">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-1.5 sm:p-2 rounded-xl border shrink-0 text-white transition-colors duration-500',
            theme ? cn(theme.bg, theme.border) : 'bg-blue-500 border-blue-500/20'
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="hidden sm:block relative group w-full sm:w-64 md:w-80 lg:w-96">
        <input
          type="text"
          placeholder={tIndex('searchPlaceholder')}
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="w-full bg-island-bg/40 border border-island-border rounded-xl sm:rounded-2xl py-2 sm:py-2.5 pl-10 sm:pl-12 pr-10 sm:pr-12 focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/50 transition-all outline-none text-base text-foreground placeholder:text-muted/50 shadow-sm group-hover:border-island-border-hover backdrop-blur-sm"
        />
        <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted group-focus-within:text-blue-500 transition-colors" />
        </div>
      </div>
    </header>
  );
}
