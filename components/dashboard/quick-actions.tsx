'use client';

import { ToolCard } from '@/components/dashboard/tool-card';
import { ToolConfig, ToolId, TOOLS } from '@/lib/config/tools';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

const POPULAR_TOOL_IDS: ToolId[] = [
  ToolId.JSON_UTILS,
  ToolId.MARKDOWN,
  ToolId.JWT_DEC,
  ToolId.BASE64,
  ToolId.EPOCH,
  ToolId.MY_IP,
];

interface QuickActionsProps {
  pinnedIds: string[];
  handleTogglePin: (id: string, e: React.MouseEvent) => void;
}

export function QuickActions({ pinnedIds, handleTogglePin }: QuickActionsProps): React.ReactNode {
  const tIndex = useTranslations('Index');
  const popularTools: ToolConfig[] = TOOLS.filter((tool: ToolConfig): boolean => 
    POPULAR_TOOL_IDS.includes(tool.id)
  );

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6 text-slate-500/80">
        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
        <h3 className="text-base sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.25em]">{tIndex('popularTools')}</h3>
        <div className="h-px bg-island-border/60 flex-1 ml-4 sm:ml-6" />
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {popularTools.map((tool: ToolConfig, index: number) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            index={index}
            isPinned={pinnedIds.includes(tool.id)}
            onTogglePin={(e: React.MouseEvent) => handleTogglePin(tool.id, e)}
          />
        ))}
      </div>
    </div>
  );
}
