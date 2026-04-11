import { Button } from '@/components/ui/button';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { AlignLeft, FileJson, FoldVertical, Minimize2, Network, UnfoldVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';
import { JsonViewMode } from './use-json-state';

interface JsonToolbarProps {
  viewMode: JsonViewMode;
  setViewMode: (v: JsonViewMode) => void;
  onFormat: () => void;
  onMinify: () => void;
  onFoldAll: () => void;
  onUnfoldAll: () => void;
  theme: CategoryTheme;
  isDropdown?: boolean;
}

export function JsonToolbar(
  {
    viewMode,
    setViewMode,
    onFormat,
    onMinify,
    onFoldAll,
    onUnfoldAll,
    theme,
    isDropdown = false,
  }: JsonToolbarProps,
): ReactNode {
  const tCommon = useTranslations('Common');
  return (
    <div className={cn("flex items-center gap-3", isDropdown && "flex-col items-stretch")}>
      <div className={cn(
        "flex items-center bg-island-bg border border-island-border rounded-xl shadow-inner px-1 h-10",
        isDropdown && "w-full justify-between"
      )}>
        <Button
          onClick={() => setViewMode('editor')}
          variant={viewMode === 'editor' ? 'active' : 'tab'}
          size="sm"
          className={cn('gap-2 flex-1', viewMode === 'editor' && theme.text)}
        >
          <FileJson className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolModes.editor')}</span>
        </Button>
        <Button
          onClick={() => setViewMode('tree')}
          variant={viewMode === 'tree' ? 'active' : 'tab'}
          size="sm"
          className={cn('gap-2 flex-1', viewMode === 'tree' && theme.text)}
        >
          <Network className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolModes.tree')}</span>
        </Button>
      </div>

      {!isDropdown && <div className="w-px h-6 bg-island-border mx-1" />}

      <div
        className={cn(
          'flex items-center bg-island-bg border border-island-border rounded-xl shadow-inner px-1 h-10 transition-opacity', 
          viewMode === 'tree' && 'opacity-50 pointer-events-none',
          isDropdown && "w-full grid grid-cols-2 h-auto py-1"
        )}>
        <Button
          onClick={onFormat}
          variant="tab"
          size="sm"
          className="gap-2"
        >
          <AlignLeft className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolActions.beautify')}</span>
        </Button>
        <Button
          onClick={onMinify}
          variant="tab"
          size="sm"
          className="gap-2"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolActions.minify')}</span>
        </Button>
        {!isDropdown && <div className="w-px h-4 bg-island-border mx-1" />}
        <Button
          onClick={onFoldAll}
          variant="tab"
          size="sm"
          className="gap-2"
        >
          <FoldVertical className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolActions.foldAll')}</span>
        </Button>
        <Button
          onClick={onUnfoldAll}
          variant="tab"
          size="sm"
          className="gap-2"
        >
          <UnfoldVertical className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolActions.unfold')}</span>
        </Button>
      </div>
    </div>
  );
}
