'use client';

import { CategoryCard } from '@/components/dashboard/category-card';
import { Category, CATEGORIES, CategoryWithoutAll } from '@/lib/config/tools';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import React from 'react';

interface CategoryGridProps {
  setActiveCategory: (category: Category) => void;
}

export function CategoryGrid({ setActiveCategory }: CategoryGridProps): React.ReactNode {
  return (
    <motion.div
      key="categories"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center gap-3 mb-6 text-slate-500/80">
        <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.25em]">Browse Categories</h3>
        <div className="h-px bg-island-border/60 flex-1 ml-4 sm:ml-6" />
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {
          CATEGORIES
            .filter((c: Category): c is CategoryWithoutAll => c !== Category.ALL)
            .map((cat: CategoryWithoutAll, index: number) => (
              <CategoryCard
                key={cat}
                name={cat}
                onClick={() => setActiveCategory(cat)}
                index={index}
              />
            ))
        }
      </div>
    </motion.div>
  );
}
