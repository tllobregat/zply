'use client';

import PreviewContent from '@/app/plantuml-editor/PreviewContent';
import StatusDisplay from '@/app/plantuml-editor/StatusDisplay';
import { EditorPreviewWorkspace } from '@/components/editor-preview-workspace';
import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { AnimatePresence } from 'framer-motion';
import { Code } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { ReactNode, useMemo } from 'react';
import { PlantUmlToolbar } from './PlantUmlToolbar';
import { PlantUmlErrorOverlay } from './PlantUmlErrorOverlay';
import { PlantUmlProgressBar } from './PlantUmlProgressBar';
import { usePlantUmlState } from './use-plantuml-state';
import { usePlantUmlTransformation } from './use-plantuml-transformation';
import { usePlantUmlActions } from './use-plantuml-actions';
import type * as monaco from 'monaco-editor';

export default function PlantUmlPageClient(): ReactNode {
  const { resolvedTheme } = useTheme();
  const { content, setContent, viewMode, setViewMode, isMounted } = usePlantUmlState();
  const { 
    isEngineReady, 
    svgContent, 
    isRendering, 
    error, 
    progress, 
    initEngine,
    forceRender
  } = usePlantUmlTransformation(content, isMounted);
  const { handleDownload, handleCopy, handleCopyAsImage, isCopied } = usePlantUmlActions();

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.VISUALISATION]);

  const handleSelectSnippet = (snippet: string): void => {
    setContent(snippet);
    // Use setTimeout to ensure content state is updated before forcing render
    // or we can rely on the fact that forceRender will trigger the effect which uses the current 'content'
    forceRender();
  };

  const markers: monaco.editor.IMarkerData[] = useMemo(() => {
    if (!error) return [];
    
    let lineNumber: number = error.line || 1;
    let message: string = error.message;

    // If no explicit line number, attempt to extract it from the message (fallback for legacy/plain errors)
    if (!error.line) {
      const lineMatch: RegExpMatchArray | null = message.match(/(?:line\s+|ligne\s+)(\d+)/i);
      if (lineMatch) {
        lineNumber = parseInt(lineMatch[1], 10);
        // Clean the message if it contains "line X"
        message = message.replace(/^.*(?:line|ligne)\s+\d+[:\s]*/i, '').trim() || message;
      }
    }

    return [{
      severity: 8, // MarkerSeverity.Error
      message: message,
      startLineNumber: lineNumber,
      startColumn: 1,
      endLineNumber: lineNumber,
      endColumn: 1000,
    }];
  }, [error]);

  if (!isMounted) return null;

  return (
    <ToolPageLayout
      toolId={ToolId.PLANTUML}
      title="PlantUML Editor"
      icon={<Code className="w-5 h-5" />}
      workspaceClassName="flex-1 min-h-0 md:flex-row"
      breadcrumbItems={[
        { label: Category.VISUALISATION, href: `/?category=${Category.VISUALISATION}` },
        { label: 'PlantUML Editor' }
      ]}
      headerActions={
        <PlantUmlToolbar 
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCopy={() => handleCopy(svgContent)}
          onCopyAsImage={() => handleCopyAsImage(svgContent)}
          onDownload={() => handleDownload(svgContent)}
          onSelectSnippet={handleSelectSnippet}
          isCopied={isCopied}
          isEngineReady={isEngineReady}
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
        language="plantuml"
        viewMode={viewMode}
        markers={markers}
        editorProps={{
          options: {
            fontFamily: 'var(--font-geist-mono)',
            fontSize: 14,
            minimap: { enabled: false },
          },
        }}
        preview={
          <div className={`h-full w-full flex items-center justify-center ${resolvedTheme === 'dark' ? 'bg-[#050a1a]' : 'bg-slate-50'} relative overflow-hidden custom-scrollbar`}>
            <PlantUmlProgressBar progress={progress} theme={theme} />

            <AnimatePresence mode="wait">
              <PreviewContent
                isEngineReady={isEngineReady}
                svgContent={svgContent}
                isRendering={isRendering}
                progress={progress}
                theme={theme}
              />
            </AnimatePresence>

            <PlantUmlErrorOverlay error={error} />
          </div>
        }
      />
    </ToolPageLayout>
  );
}
