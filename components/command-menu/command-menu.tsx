'use client';

import { OPEN_COMMAND_MENU_EVENT } from '@/lib/config/events';
import { ToolConfig, TOOLS } from '@/lib/config/tools';
import { AnimatePresence, motion } from 'framer-motion';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CommandMenuOverlay } from './command-menu-overlay';
import { CommandMenuInput } from './command-menu-input';
import { CommandMenuResults } from './command-menu-results';
import { CommandMenuFooter } from './command-menu-footer';

export function CommandMenu(): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router: AppRouterInstance = useRouter();
  const tTools = useTranslations('Tools');
  const tCategories = useTranslations('Categories');

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
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, openMenu);
    return (): void => {
      document.removeEventListener('keydown', down);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, openMenu);
    };
  }, []);

  const filteredItems: ToolConfig[] = useMemo((): ToolConfig[] => {
    if (!search) {
      return TOOLS.filter((t: ToolConfig) => t.status === 'active').slice(0, 5);
    }
    return TOOLS.filter((item: ToolConfig) => {
      const title = tTools(`${item.id}.title`).toLowerCase();
      const category = tCategories(item.category).toLowerCase();
      return title.includes(search.toLowerCase()) ||
             category.includes(search.toLowerCase());
    }).slice(0, 8);
  }, [search, tTools, tCategories]);

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
            <CommandMenuOverlay onClose={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[5%] sm:top-[10%] inset-x-3 sm:inset-x-0 mx-auto w-[calc(100%-1.5rem)] sm:w-full max-w-xl z-101"
            >
              <div className="bg-island-bg/95 border border-island-border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl">
                <CommandMenuInput
                  value={search}
                  onChange={setSearch}
                  onKeyDown={handleKeyDown}
                />

                <CommandMenuResults
                  items={filteredItems}
                  search={search}
                  activeIndex={activeIndex}
                  onSelect={onSelect}
                  onMouseEnter={setActiveIndex}
                />

                <CommandMenuFooter />
              </div>
            </motion.div>
          </>
        )
      }
    </AnimatePresence>
  );
}
