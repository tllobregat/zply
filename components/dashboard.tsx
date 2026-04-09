'use client';

import { CategoryGrid } from '@/components/dashboard/category-grid';
import { DashboardBreadcrumb } from '@/components/dashboard/dashboard-breadcrumb';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ToolGrid } from '@/components/dashboard/tool-grid';
import { UsePinnedTools, usePinnedTools } from '@/hooks/use-pinned-tools';
import { Category, ToolConfig, TOOLS } from '@/lib/config/tools';
import { AnimatePresence } from 'framer-motion';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export function Dashboard(): React.ReactNode {
  const searchParams: URLSearchParams = useSearchParams();
  const router: AppRouterInstance = useRouter();

  const [search, setSearch] = useState<string>('');
  const { pinnedIds, togglePin }: UsePinnedTools = usePinnedTools();
  const toolsRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  // Derive activeCategory from URL
  const activeCategory: Category = useMemo(() => {
    const categoryFromUrl: string | null = searchParams.get('category');
    if (categoryFromUrl && Object.values(Category).includes(categoryFromUrl as Category)) {
      return categoryFromUrl as Category;
    }
    return Category.ALL;
  }, [searchParams]);

  // Update activeCategory via URL
  const setActiveCategory = (newCategory: Category): void => {
    const params: URLSearchParams = new URLSearchParams(searchParams.toString());
    if (newCategory === Category.ALL) {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }

    const queryString: string = params.toString();
    const targetUrl: string = queryString ? `/?${queryString}` : '/';

    // Always use replace to avoid history pollution as requested in previous fixes
    router.replace(targetUrl, { scroll: false });
  };

  // Handle reset-dashboard event
  useEffect(() => {
    const handleReset = (): void => {
      setActiveCategory(Category.ALL);
      setSearch('');
    };

    window.addEventListener('reset-dashboard', handleReset);
    return (): void => window.removeEventListener('reset-dashboard', handleReset);
  }, [searchParams, router]); // include dependencies for setActiveCategory closure logic

  const handleTogglePin = (id: string, e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    togglePin(id);
  };

  const filteredTools: ToolConfig[] = useMemo((): ToolConfig[] => {
    return TOOLS.filter((tool: ToolConfig): boolean => {
      const matchesSearch: boolean = tool.title.toLowerCase().includes(search.toLowerCase())
        || tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory: boolean = activeCategory === Category.ALL || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const isBrowsingCategories: boolean = activeCategory === Category.ALL && search === '';

  return (
    <div id="dashboard" ref={toolsRef} className="px-1 sm:px-0 max-w-screen-2xl mx-auto h-full overflow-hidden">
      <div className="glass-island rounded-xl sm:rounded-3xl border border-island-border/50 overflow-hidden flex flex-col shadow-xl h-full min-h-[400px]">
        <DashboardHeader
          activeCategory={activeCategory}
          search={search}
          setSearch={setSearch}
          setActiveCategory={setActiveCategory}
          isBrowsingCategories={isBrowsingCategories}
          filteredToolsCount={filteredTools.length}
        />

        <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar">
          {isBrowsingCategories && (
            <>
              <DashboardHero />
              <QuickActions />
            </>
          )}

          <DashboardBreadcrumb
            activeCategory={activeCategory}
            search={search}
            setActiveCategory={setActiveCategory}
            setSearch={setSearch}
            isBrowsingCategories={isBrowsingCategories}
          />

          <AnimatePresence mode="wait">
            {
              isBrowsingCategories
                ? (
                  <CategoryGrid setActiveCategory={setActiveCategory} />
                )
                : (
                  <ToolGrid
                    filteredTools={filteredTools}
                    pinnedIds={pinnedIds}
                    handleTogglePin={handleTogglePin}
                  />
                )
            }
          </AnimatePresence>
        </div>

        <DashboardFooter />
      </div>
    </div>
  );
}
