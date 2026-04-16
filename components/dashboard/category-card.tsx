'use client';

import { CATEGORY_META, CategoryMeta, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { CategoryWithoutAll, ToolConfig, TOOLS } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid, LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

interface CategoryCardProps {
  name: CategoryWithoutAll;
  onClick: () => void;
  index: number;
}

export function CategoryCard({ name, onClick, index }: CategoryCardProps): React.ReactNode {
  const t = useTranslations('Categories');
  const tTools = useTranslations('Tools');
  const meta: CategoryMeta = CATEGORY_META[name] || { icon: LayoutGrid, color: 'blue' };
  const Icon: LucideIcon = meta.icon;
  const tools: ToolConfig[] = TOOLS.filter((t: ToolConfig): boolean => t.category === name && t.status === 'active');
  const toolCount: number = tools.length;

  const theme: CategoryTheme = getCategoryClasses(meta.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-island-card border border-island-border transition-all relative overflow-hidden shadow-sm hover:shadow-lg flex flex-col h-full",
        theme.hoverBorder,
        "hover:bg-island-bg"
      )}
    >
      <div className="flex-1 flex flex-col">
        <button
          onClick={onClick}
          className="flex flex-col items-start text-left mb-4 group/header w-full"
        >
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-500 group-hover/header:scale-110 group-hover/header:rotate-3 shadow-md',
              cn(theme.bg, theme.border, 'text-white', theme.shadow)
            )}
          >
            <Icon className="w-5 h-5" />
          </div>

          <h3 className={cn(
            "text-sm font-black uppercase tracking-tight mb-1 text-foreground transition-colors line-clamp-1 flex items-center gap-2",
            theme.hoverText
          )}>
            {t(name)}
            <ArrowRight className="w-3 h-3 opacity-0 group-hover/header:opacity-100 transition-opacity" />
          </h3>
          <p className="text-muted-foreground leading-tight text-[11px] font-medium line-clamp-2">
            {t(`${name}Desc`)}
          </p>
        </button>

        <div className="flex flex-col gap-1 mt-2">
          {tools.map((tool: ToolConfig) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="px-2 py-1.5 rounded-lg hover:bg-island-border/30 border border-transparent hover:border-island-border/50 text-xs font-bold text-muted-foreground hover:text-foreground transition-all flex items-center justify-between group/tool"
            >
              <span className="truncate">{tTools(`${tool.id}.title`)}</span>
              <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover/tool:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-island-border/50 flex items-center justify-between">
         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
            {toolCount} {toolCount > 1 ? 'Tools' : 'Tool'}
         </span>
      </div>

      {/* Background decoration */}
      <div
        className={cn(
          'absolute -right-4 -bottom-4 w-16 h-16 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity',
          theme.bg
        )}
      />
    </motion.div>
  );
}
