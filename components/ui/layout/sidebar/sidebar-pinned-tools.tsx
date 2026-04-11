'use client';

import { CATEGORY_COLORS, CategoryColor, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import type { ToolConfig } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { SidebarTooltip } from './sidebar-tooltip';

interface SidebarPinnedToolsProps {
  pinnedTools: ToolConfig[];
}

export function SidebarPinnedTools({ pinnedTools }: SidebarPinnedToolsProps): React.ReactNode {
  const pathname: string = usePathname();
  const tTools = useTranslations('Tools');

  if (pinnedTools.length === 0) return null;

  return (
    <>
      <div className="hidden sm:block w-px sm:w-8 h-8 sm:h-px bg-island-border/50 mx-1 sm:mx-auto my-0 sm:my-2" />

      {/* Desktop: Pinned Tools Icons */}
      <div className="hidden sm:flex flex-col gap-6">
        {
          pinnedTools.map((tool: ToolConfig, index: number) => {
            const Icon: LucideIcon = tool.icon;
            const isActive: boolean = pathname === tool.href;
            const categoryColor: CategoryColor = CATEGORY_COLORS[tool.category];
            const theme: CategoryTheme = getCategoryClasses(categoryColor);

            return (
              <React.Fragment key={tool.id}>
                {
                  index === 3
                  && (
                    <div className="hidden sm:block w-8 h-px bg-island-border/50 mx-auto my-2" />
                  )
                }
                <Link
                  href={tool.href}
                  className={cn(
                    'p-3.5 rounded-xl transition-all relative group shrink-0',
                    isActive
                      ? cn('shadow-md text-white', theme.bg, theme.shadow)
                      : cn('text-muted-foreground bg-island-bg border border-island-border', theme.hoverText, `hover:bg-${categoryColor}-600/10`)
                  )}
                  aria-label={tTools(`${tool.id}.title`)}
                >
                  <Icon className={cn('w-6 h-6', !isActive && theme.text)} />
                  <SidebarTooltip leftOffset="left-22.5">
                    {tTools(`${tool.id}.title`)}
                  </SidebarTooltip>
                </Link>
              </React.Fragment>
            );
          })
        }
      </div>
    </>
  );
}
