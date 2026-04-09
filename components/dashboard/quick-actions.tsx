'use client';

import { CATEGORY_META, CategoryMeta, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { ToolConfig, ToolId, TOOLS } from '@/lib/config/tools';
import { motion } from 'framer-motion';
import { LucideIcon, Star } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const POPULAR_TOOL_IDS: ToolId[] = [
  ToolId.JSON_UTILS,
  ToolId.MARKDOWN,
  ToolId.JWT_DEC,
  ToolId.BASE64,
  ToolId.EPOCH,
  ToolId.MY_IP,
];

export function QuickActions(): React.ReactNode {
  const popularTools: ToolConfig[] = TOOLS.filter((tool: ToolConfig): boolean => 
    POPULAR_TOOL_IDS.includes(tool.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-10"
    >
      <div className="flex items-center gap-3 mb-6 text-slate-500/80">
        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.25em]">Popular Tools</h3>
        <div className="h-px bg-island-border/60 flex-1 ml-4 sm:ml-6" />
      </div>

      <div className="flex flex-wrap gap-3">
        {popularTools.map((tool: ToolConfig) => {
          const meta: CategoryMeta = CATEGORY_META[tool.category as keyof typeof CATEGORY_META];
          const theme: CategoryTheme | null = meta ? getCategoryClasses(meta.color) : null;
          const Icon: LucideIcon | undefined = meta?.icon;

          return (
            <Link
              key={tool.id}
              href={tool.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-island-card border border-island-border hover:bg-island-bg transition-all active:scale-95 group shadow-sm cursor-pointer ${theme?.hoverBorder || 'hover:border-zply-blue/30'}`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${theme?.icon || 'bg-zply-blue/10 text-zply-blue'}`}>
                {Icon && <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-bold text-foreground">{tool.title}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
