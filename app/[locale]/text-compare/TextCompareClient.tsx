'use client';

import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
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

  const t = useTranslations('Tools');
  const tTool = useTranslations(`Tools.${ToolId.TEXT_COMPARE}`);
  const tCategories = useTranslations('Categories');
  return (
    <ToolPageLayout
      toolId={ToolId.TEXT_COMPARE}
      title={t(`${ToolId.TEXT_COMPARE}.title`)}
      icon={<Columns className="w-5 h-5" />}
      breadcrumbItems={[
        { label: tCategories(Category.DATA), href: `/?category=${Category.DATA}` },
        { label: t(`${ToolId.TEXT_COMPARE}.title`) }
      ]}
      headerActions={
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <ViewModeToggle<DiffMode>
            viewMode={state.diffMode}
            setViewMode={updateDiffMode}
            modes={[
              { id: 'unified', label: tTool('unified') },
              { id: 'split', label: tTool('split') }
            ]}
          />
          {
            state.diffMode === 'split'
            && (
              <ViewModeToggle<ViewMode>
                viewMode={viewMode}
                setViewMode={setViewMode}
                modes={[
                  { id: 'original', label: tTool('original') },
                  { id: 'split', label: tTool('split') },
                  { id: 'modified', label: tTool('modified') }
                ]}
              />
            )
          }
        </div>
      }
      footerIndicator={
        <>
          <span className={cn('flex items-center gap-1.5 opacity-80', theme.text)}>
            <Zap className="w-3 h-3" /> {tTool('liveDiff')}
          </span>
          <Separator />
          <span>{tTool('sideBySide')}</span>
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
