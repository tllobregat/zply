'use client';

import { CATEGORY_META, CategoryMeta, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { CategoryWithoutAll, ToolConfig, TOOLS } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, LucideIcon } from 'lucide-react';
import React from 'react';

interface CategoryCardProps {
  name: CategoryWithoutAll;
  onClick: () => void;
  index: number;
}

export function CategoryCard({ name, onClick, index }: CategoryCardProps): React.ReactNode {
  const meta: CategoryMeta = CATEGORY_META[name] || { icon: LayoutGrid, color: 'blue', desc: 'Various tools' };
  const Icon: LucideIcon = meta.icon;
  const toolCount: number = TOOLS.filter((t: ToolConfig): boolean => t.category === name && t.status === 'active').length;

  const theme: CategoryTheme = getCategoryClasses(meta.color);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={cn(
        "group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-island-card border border-island-border transition-all text-left relative overflow-hidden active:scale-[0.98] shadow-sm hover:shadow-lg",
        theme.hoverBorder,
        "hover:bg-island-bg"
      )}
    >
      <div
        className={cn(
          'w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-md',
          cn(theme.bg, theme.border, 'text-white', theme.shadow)
        )}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      <h3 className={cn(
        "text-base sm:text-lg font-black uppercase tracking-tight mb-1 text-foreground transition-colors line-clamp-1",
        theme.hoverText
      )}>
        {name}
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-[10px] sm:text-[11px] font-medium line-clamp-2">
        {meta.desc}
      </p>

      <div className="flex items-center justify-between border-t border-island-border/50 pt-3 sm:pt-4">
         <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
            {toolCount} Tool{toolCount > 1 ? 's' : ''}
         </span>
        <div className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-island-bg border border-island-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shadow-sm", theme.text)}>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>

      {/* Background decoration */}
      <div
        className={cn(
          'absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity',
          theme.bg
        )}
      />
    </motion.button>
  );
}
