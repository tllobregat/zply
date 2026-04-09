'use client';

import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { Columns, Zap } from 'lucide-react';
import { ReactNode } from 'react';
import { useTextCompareState } from './use-text-compare-state';
import { TextCompareEditor } from './TextCompareEditor';

import { DiffMode, ViewMode } from './text-compare.types';

export default function TextCompareClient(): ReactNode {
  const { 
    state, 
    updateOriginal, 
    updateModified, 
    updateDiffMode,
    viewMode, 
    setViewMode 
  } = useTextCompareState();

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.DATA]);

  return (
    <ToolPageLayout
      toolId={ToolId.TEXT_COMPARE}
      title="Text Compare"
      icon={<Columns className="w-5 h-5" />}
      breadcrumbItems={[
        { label: 'Data', href: `/?category=${Category.DATA}` },
        { label: 'Text Compare' }
      ]}
      headerActions={
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <ViewModeToggle<DiffMode>
            viewMode={state.diffMode}
            setViewMode={updateDiffMode}
            modes={[
              { id: 'unified', label: 'Unified' },
              { id: 'split', label: 'Split' }
            ]}
          />
          {
            state.diffMode === 'split'
            && (
              <ViewModeToggle<ViewMode>
                viewMode={viewMode}
                setViewMode={setViewMode}
                modes={[
                  { id: 'original', label: 'Original' },
                  { id: 'split', label: 'Split' },
                  { id: 'modified', label: 'Modified' }
                ]}
              />
            )
          }
        </div>
      }
      footerIndicator={
        <>
          <span className={cn('flex items-center gap-1.5 opacity-80', theme.text)}>
            <Zap className="w-3 h-3" /> Live Diff
          </span>
          <Separator />
          <span>Side-by-side comparison</span>
        </>
      }
      workspaceClassName="flex-1 min-h-0 md:flex-row"
    >
      <TextCompareEditor
        original={state.original}
        modified={state.modified}
        viewMode={viewMode}
        diffMode={state.diffMode}
        onOriginalChange={updateOriginal}
        onModifiedChange={updateModified}
      />
    </ToolPageLayout>
  );
}
