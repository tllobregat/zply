'use client';

import { ToolCard } from '@/components/dashboard/tool-card';
import { ToolConfig } from '@/lib/config/tools';
import { motion } from 'framer-motion';
import React from 'react';

interface ToolGridProps {
  filteredTools: ToolConfig[];
  pinnedIds: string[];
  handleTogglePin: (id: string, e: React.MouseEvent) => void;
}

export function ToolGrid(
  {
    filteredTools,
    pinnedIds,
    handleTogglePin,
  }: ToolGridProps,
): React.ReactNode {
  return (
    <motion.div
      key="tools"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {
        filteredTools.length > 0
          ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {
                filteredTools.map((tool: ToolConfig, index: number) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    index={index}
                    isPinned={pinnedIds.includes(tool.id)}
                    onTogglePin={(e: React.MouseEvent) => handleTogglePin(tool.id, e)}
                  />
                ))
              }
            </div>
          )
          : (
            <div className="py-40 text-center">
              <h3 className="text-xl font-black text-foreground uppercase">No results</h3>
              <p className="text-muted-foreground text-xs mt-2 uppercase tracking-widest">Try other keywords</p>
            </div>
          )
      }
    </motion.div>
  );
}
