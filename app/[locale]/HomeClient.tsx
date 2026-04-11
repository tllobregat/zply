'use client';

import { CategoryGrid } from '@/components/dashboard/category-grid';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardHero } from '@/components/dashboard/dashboard-hero';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ToolGrid } from '@/components/dashboard/tool-grid';
import { PageLayout } from '@/components/ui/layout';
import { useCategory, UseCategory } from '@/hooks/use-category';
import { usePinnedTools, UsePinnedTools } from '@/hooks/use-pinned-tools';
import { Category, ToolConfig, TOOLS } from '@/lib/config/tools';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React, { useMemo, useRef, useState, useCallback } from 'react';

export default function HomeClient(): React.ReactNode {
  const tTools = useTranslations('Tools');

  const [search, setSearch] = useState<string>('');
  const onReset = useCallback(() => setSearch(''), []);
  const { activeCategory, setActiveCategory }: UseCategory = useCategory(onReset);
  const { pinnedIds, togglePin }: UsePinnedTools = usePinnedTools();
  const toolsRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

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
