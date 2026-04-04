'use client';

import { HashInput } from '@/app/hash-generator/HashInput';
import { HashResults } from '@/app/hash-generator/HashResults';
import { useHashState } from '@/app/hash-generator/use-hash-state';
import { Hashes, useHashTransformation } from '@/app/hash-generator/use-hash-transformation';
import ToolPageLayout from '@/components/tool-page-layout';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { useViewMode } from '@/hooks/use-view-mode';
import { Hash, Zap } from 'lucide-react';
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function HashGeneratorClient(): ReactNode {
  const { text, setText } = useHashState();
  const hashes: Hashes = useHashTransformation(text);
  const { viewMode, setViewMode } = useViewMode('split');
  const { copy, isCopied }: { copy: (t: string, k?: string) => void; isCopied: (k?: string) => boolean } = useCopyToClipboard();

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.SECURITY]);

  const isSplit: boolean = viewMode === 'split';
  const showEditor: boolean = viewMode === 'editor' || isSplit;
  const showResults: boolean = viewMode === 'preview' || isSplit;

  return (
    <ToolPageLayout
      toolId={ToolId.HASH_GEN}
      title="Hash Generator"
      icon={<Hash className="w-5 h-5" />}
      breadcrumbItems={[
        { label: Category.SECURITY, href: `/?category=${Category.SECURITY}` },
        { label: 'Hash Generator' }
      ]}
      headerActions={
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      }
      footerIndicator={
        <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-yellow-500/30" /> Real-time Hashing</span>
      }
      workspaceClassName={cn(isSplit ? 'md:flex-row' : 'flex-col')}
    >
      {
        showEditor
        && (
          <HashInput
            value={text}
            onChange={setText}
            className={cn(
              isSplit ? 'h-[40%] md:h-full md:w-1/2 border-b md:border-b-0 md:border-r' : 'flex-1'
            )}
          />
        )
      }
      {
        showResults
        && (
          <HashResults
            hashes={hashes}
            isCopied={isCopied}
            onCopy={copy}
            theme={theme}
            className="flex-1"
          />
        )
      }
    </ToolPageLayout>
  );
}
