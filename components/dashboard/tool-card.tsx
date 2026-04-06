'use client';

import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { ToolConfig } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon, Pin, Wand2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ToolCardProps {
  tool: ToolConfig;
  index: number;
  isPinned?: boolean;
  onTogglePin?: (e: React.MouseEvent) => void;
}

export function ToolCard(
  {
    tool,
    index,
    isPinned,
    onTogglePin
  }: ToolCardProps,
): React.ReactNode {
  const Icon: LucideIcon = tool.icon;
  const isComingSoon: boolean = tool.status === 'coming-soon';
  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[tool.category]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        href={isComingSoon ? '#' : tool.href}
        className={cn(
          'group block p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border border-island-border bg-island-card hover:bg-island-bg transition-all duration-300 h-full relative overflow-hidden shadow-sm hover:shadow-lg',
          theme.hoverBorder,
          isComingSoon && 'opacity-40 cursor-not-allowed'
        )}
        aria-label={isComingSoon ? `${tool.title} (Coming Soon)` : `Open ${tool.title}`}
      >
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className={cn(
            'w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-md',
            cn(theme.bg, theme.border, 'text-white', theme.shadow),
          )}>
            <Icon className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
          </div>

          <div className="flex items-center gap-2">
            {
              !isComingSoon
              && (
                <button
                  onClick={onTogglePin}
                  className={cn(
                    'p-1.5 sm:p-2 rounded-lg sm:rounded-xl border transition-all active:scale-90 shadow-sm',
                    isPinned
                      ? cn(theme.icon, theme.border)
                      : 'bg-island-bg border-island-border text-muted hover:text-foreground hover:border-island-border/50'
                  )}
                  aria-label={isPinned ? "Unpin tool" : "Pin tool"}
                >
                  <Pin className={cn('w-3 h-3 sm:w-3.5 sm:h-3.5', isPinned && 'fill-current')} />
                </button>
              )
            }
          </div>
        </div>

        <h3 className={cn(
          "text-xs sm:text-sm font-black mb-1 transition-colors uppercase tracking-tight text-foreground line-clamp-1 sm:line-clamp-none",
          theme.hoverText
        )}>
          {tool.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed text-[9px] sm:text-[10px] font-medium line-clamp-2">
          {tool.description}
        </p>

        {
          !isComingSoon
          && (
            <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              <div className={cn("flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest", theme.text)}>
                Open Tool
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          )
        }

        {
          isComingSoon
          && (
            <div className="mt-4 flex items-center gap-1.5 opacity-40">
              <Wand2 className="w-3 h-3 text-muted" />
              <span className="text-[8px] font-black uppercase tracking-tighter text-muted">Soon</span>
            </div>
          )
        }

      </Link>
    </motion.div>
  );
}
