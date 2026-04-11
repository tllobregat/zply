'use client';

import { CategoryGrid } from '@/components/dashboard/category-grid';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ToolGrid } from '@/components/dashboard/tool-grid';
import { PageLayout } from '@/components/page-layout';
import { usePinnedTools, UsePinnedTools } from '@/hooks/use-pinned-tools';
import { Category, ToolConfig, TOOLS } from '@/lib/config/tools';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function HomeClient(): React.ReactNode {
  const searchParams: URLSearchParams = useSearchParams();
  const router: AppRouterInstance = useRouter();
  const tTools = useTranslations('Tools');

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
  const setActiveCategory = (newCategory: Category, useReplace: boolean = false): void => {
    const params: URLSearchParams = new URLSearchParams(searchParams.toString());
    if (newCategory === Category.ALL) {
      params.delete('category');
    } else {
      params.set('category', newCategory);
    }

    const queryString: string = params.toString();
    const targetUrl: string = queryString ? `/?${queryString}` : '/';

    if (useReplace) {
      router.replace(targetUrl, { scroll: false });
    } else {
      router.push(targetUrl, { scroll: false });
    }
  };

  // Handle reset-dashboard event
  useEffect(() => {
    const handleReset = (): void => {
      setActiveCategory(Category.ALL, true);
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
      const title = tTools(`${tool.id}.title`).toLowerCase();
      const description = tTools(`${tool.id}.description`).toLowerCase();
      const matchesSearch: boolean = title.includes(search.toLowerCase())
        || description.includes(search.toLowerCase());
      const matchesCategory: boolean = activeCategory === Category.ALL || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, tTools]);

  const isBrowsingCategories: boolean = activeCategory === Category.ALL && search === '';

  return (
    <PageLayout
      id="dashboard"
      ref={toolsRef}
      header={
        <DashboardHeader
          activeCategory={activeCategory}
          search={search}
          setSearch={setSearch}
          setActiveCategory={setActiveCategory}
          isBrowsingCategories={isBrowsingCategories}
          filteredToolsCount={filteredTools.length}
        />
      }
      footer={<DashboardFooter />}
      contentClassName="p-4 sm:p-8"
    >
      {isBrowsingCategories && <DashboardHero />}

      <AnimatePresence mode="wait">
        {
          isBrowsingCategories
            ? (
              <motion.div
                key="categories-view"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <QuickActions
                  pinnedIds={pinnedIds}
                  handleTogglePin={handleTogglePin}
                />
                <CategoryGrid setActiveCategory={setActiveCategory} />
              </motion.div>
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
    </PageLayout>
  );
}
