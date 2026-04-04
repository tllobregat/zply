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

export default function TextCompareClient(): ReactNode {
  const { 
    state, 
    updateOriginal, 
    updateModified, 
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
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
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
      workspaceClassName="md:flex-row"
    >
      <TextCompareEditor
        original={state.original}
        modified={state.modified}
        viewMode={viewMode}
        onOriginalChange={updateOriginal}
        onModifiedChange={updateModified}
      />
    </ToolPageLayout>
  );
}
