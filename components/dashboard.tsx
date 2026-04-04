'use client';

import { CategoryGrid } from '@/components/dashboard/category-grid';
import { DashboardBreadcrumb } from '@/components/dashboard/dashboard-breadcrumb';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ToolGrid } from '@/components/dashboard/tool-grid';
import { UsePinnedTools, usePinnedTools } from '@/hooks/use-pinned-tools';
import { Category, ToolConfig, TOOLS } from '@/lib/config/tools';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export function Dashboard(): React.ReactNode {
  const searchParams: URLSearchParams = useSearchParams();
  const initialCategory: Category | null = searchParams.get('category') as Category | null;

  const [search, setSearch] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<Category>((initialCategory as Category) || Category.ALL);
  const { pinnedIds, togglePin }: UsePinnedTools = usePinnedTools();
  const toolsRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  // Handle initial scroll and category selection from URL
  useEffect(() => {
    if (initialCategory && initialCategory !== Category.ALL) {
      // Wait for a frame to ensure the element is ready and avoid synchronous setState
      const frame: number = requestAnimationFrame(() => {
        setActiveCategory(initialCategory);
      });
      return (): void => cancelAnimationFrame(frame);
    }
  }, [initialCategory]);

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
      <div className="glass-island rounded-2xl sm:rounded-[2.5rem] border border-island-border/50 overflow-hidden flex flex-col shadow-2xl h-full min-h-[400px]">
        <DashboardHeader
          activeCategory={activeCategory}
          search={search}
          setSearch={setSearch}
          setActiveCategory={setActiveCategory}
          isBrowsingCategories={isBrowsingCategories}
          filteredToolsCount={filteredTools.length}
        />

        <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar">
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
