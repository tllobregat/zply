'use client';

import { EditorPreviewWorkspace } from '@/components/editor-preview-workspace';
import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { Category, ToolId } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import type * as monaco from 'monaco-editor';
import { ReactNode, RefObject, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useMarkdownState } from './use-markdown-state';
import { useMarkdownTransformation } from './use-markdown-transformation';
import { useMarkdownActions } from './use-markdown-actions';
import { MarkdownToolbar } from './MarkdownToolbar';

const { FileText, Zap } = LucideIcons;

export default function MarkdownPageClient(): ReactNode {
  const { resolvedTheme } = useTheme();
  const { content, setContent, viewMode, setViewMode } = useMarkdownState();
  const { html } = useMarkdownTransformation(content);
  const editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null> = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const previewRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const { handleToolbarAction, handleFoldAll, handleUnfoldAll } = useMarkdownActions(editorRef);


  return (
    <ToolPageLayout
      toolId={ToolId.MARKDOWN}
      title="Markdown Editor"
      icon={<FileText className="w-5 h-5" />}
      breadcrumbItems={[
        { label: Category.DIAGRAMS, href: `/?category=${Category.DIAGRAMS}` },
        { label: 'Markdown Editor' }
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          <MarkdownToolbar 
            onAction={handleToolbarAction} 
            onFoldAll={handleFoldAll} 
            onUnfoldAll={handleUnfoldAll} 
          />
          <Separator className="h-4 hidden lg:block" />
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      }
      footerIndicator={
        <>
          <span className="flex items-center gap-1.5"><Zap className="w-3 h-3 text-yellow-500/50" /> Live Rendering</span>
          <Separator />
          <span>{content.length} chars</span>
        </>
      }
      workspaceClassName="flex-1 min-h-0 flex-row overflow-hidden"
    >
      <EditorPreviewWorkspace
        value={content}
        onChange={setContent}
        language="markdown"
        viewMode={viewMode}
        editorProps={{
          onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
            editorRef.current = editor;

            // Register a custom folding provider for Markdown headers
            // as Monaco doesn't provide one for '#' headers by default
            monacoInstance.languages.registerFoldingRangeProvider('markdown', {
              provideFoldingRanges: (model: monaco.editor.ITextModel) => {
                const lines: string[] = model.getLinesContent();
                const ranges: monaco.languages.FoldingRange[] = [];
                const stack: { level: number; start: number }[] = [];

                for (let i: number = 0; i < lines.length; i++) {
                  const line: string = lines[i];
                  const match: RegExpMatchArray | null = line.match(/^(#{1,6})\s/);

                  if (match) {
                    const level: number = match[1].length;
                    const lineNumber: number = i + 1;

                    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                      const last: { level: number, start: number } = stack.pop()!;
                      if (lineNumber - 1 > last.start) {
                        ranges.push({
                          start: last.start,
                          end: lineNumber - 1,
                          kind: monacoInstance.languages.FoldingRangeKind.Region
                        });
                      }
                    }
                    stack.push({ level, start: lineNumber });
                  }
                }

                while (stack.length > 0) {
                  const last: { level: number; start: number } = stack.pop()!;
                  if (lines.length > last.start) {
                    ranges.push({
                      start: last.start,
                      end: lines.length,
                      kind: monacoInstance.languages.FoldingRangeKind.Region
                    });
                  }
                }

                return ranges;
              }
            });
          },
          options: {
            showFoldingControls: 'always',
            lineNumbers: 'on',
            foldingHighlight: true,
            lineDecorationsWidth: 16,
          }
        }}
        previewClassName={`${resolvedTheme === 'dark' ? 'bg-[#050a1a]' : 'bg-slate-50'}`}
        preview={
          <div ref={previewRef} className="h-full p-12 md:p-16 overflow-y-auto custom-scrollbar">
            <article
              className={cn(
                "prose max-w-none prose-headings:font-black prose-p:leading-relaxed",
                resolvedTheme === 'dark' && "prose-invert"
              )}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        }
      />
    </ToolPageLayout>
  );
}
