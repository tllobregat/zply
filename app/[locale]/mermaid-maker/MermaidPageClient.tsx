'use client';

import PreviewContent from '@/app/[locale]/mermaid-maker/PreviewContent';
import StatusDisplay from '@/app/[locale]/mermaid-maker/StatusDisplay';
import { EditorPreviewWorkspace } from '@/components/ui/layout';
import { ToolPageLayout } from '@/components/ui/layout';
import { Separator } from '@/components/ui/separator';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { ReactNode } from 'react';
import { MermaidToolbar } from './MermaidToolbar';
import { MermaidErrorOverlay } from './MermaidErrorOverlay';
import { useMermaidState } from './use-mermaid-state';
import { useMermaidTransformation } from './use-mermaid-transformation';
import { useMermaidActions } from './use-mermaid-actions';

export default function MermaidPageClient(): ReactNode {
  const t = useTranslations('Tools');
  const tCategories = useTranslations('Categories');
  const { resolvedTheme } = useTheme();
  const { content, setContent, viewMode, setViewMode, isMounted } = useMermaidState();
  const { 
    isEngineReady, 
    svgContent, 
    isRendering, 
    isDebouncing,
    error, 
    initEngine,
    forceRender
  } = useMermaidTransformation(content, isMounted);
  const { handleDownload, handleCopy, handleCopyAsImage, isCopied } = useMermaidActions();

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.DIAGRAMS]);

  const handleSelectSnippet = (snippet: string): void => {
    setContent(snippet);
    forceRender();
  };

  if (!isMounted) return null;

  return (
    <ToolPageLayout
      toolId={ToolId.MERMAID}
      title={t(`${ToolId.MERMAID}.title`)}
      icon={<Share2 className="w-5 h-5" />}
      workspaceClassName="flex-1 min-h-0 md:flex-row"
      breadcrumbItems={[
        { label: tCategories(Category.DIAGRAMS), href: `/?category=${Category.DIAGRAMS}` },
        { label: t(`${ToolId.MERMAID}.title`) }
      ]}
      headerActions={
        <MermaidToolbar 
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCopy={() => handleCopy(svgContent)}
          onCopyAsImage={() => handleCopyAsImage(svgContent)}
          onDownload={() => handleDownload(svgContent)}
          onSelectSnippet={handleSelectSnippet}
          isCopied={isCopied}
          isRendering={isRendering}
          hasSvg={!!svgContent}
          onInitEngine={initEngine}
        />
      }
      footerIndicator={
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <StatusDisplay isRendering={isRendering} isEngineReady={isEngineReady} theme={theme} />
          </div>
          <Separator />
          <span className="text-muted-foreground">{content.length} characters</span>
        </div>
      }
    >
      <EditorPreviewWorkspace
        value={content}
        onChange={setContent}
        language="mermaid"
        viewMode={viewMode}
        editorProps={{
          options: {
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 14,
            minimap: { enabled: false },
          },
        }}
        preview={
          <div className={`h-full w-full flex items-center justify-center ${resolvedTheme === 'dark' ? 'bg-[#050a1a]' : 'bg-slate-50'} relative overflow-hidden custom-scrollbar`}>
            <AnimatePresence mode="wait">
              <PreviewContent
                isEngineReady={isEngineReady}
                svgContent={svgContent}
                isRendering={isRendering}
                isDebouncing={isDebouncing}
                theme={theme}
              />
            </AnimatePresence>

            <MermaidErrorOverlay error={error} />
          </div>
        }
      />
    </ToolPageLayout>
  );
}
