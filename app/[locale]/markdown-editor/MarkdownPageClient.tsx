'use client';

import { EditorPreviewWorkspace } from '@/components/ui/layout';
import { ToolPageLayout } from '@/components/ui/layout';
import { Separator } from '@/components/ui/separator';
import { ViewModeToggle } from '@/components/ui/layout';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import type * as monaco from 'monaco-editor';
import { processFile } from './markdown.utils';
import React, { ReactNode, RefObject, useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { useMarkdownState } from './use-markdown-state';
import { useMarkdownTransformation } from './use-markdown-transformation';
import { useMarkdownActions } from './use-markdown-actions';
import { MarkdownToolbar } from './MarkdownToolbar';
import { useMarkdownLinter } from './use-markdown-linter';
import { useMarkdownPaste } from './use-markdown-paste';
import { MarkdownPasteModal } from './MarkdownPasteModal';
import { MarkdownPrintArea } from './MarkdownPrintArea';

const { FileText, Zap } = LucideIcons;

export default function MarkdownPageClient(): ReactNode {
  const { resolvedTheme } = useTheme();
  const { content, setContent, viewMode, setViewMode } = useMarkdownState();
  const { html, isPending } = useMarkdownTransformation(content);
  const editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null> = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const previewRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const { validateMarkdown } = useMarkdownLinter();
  const {
    isPasteModalOpen,
    setIsPasteModalOpen,
    pendingPaste,
    handleConfirmPaste,
    interceptPaste
  } = useMarkdownPaste(editorRef);

  const { handleToolbarAction, handleFoldAll, handleUnfoldAll, handleShiftHeaders } = useMarkdownActions(editorRef);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const t = useTranslations('Tools');
  const tMarkdown = useTranslations(`Tools.${ToolId.MARKDOWN}`);
  const tCategories = useTranslations('Categories');
  const tCommon = useTranslations('Common');

  const handleExportPdf = useCallback((): void => {
    window.print();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleExportPdf();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExportPdf]);

  const handleDragOver = useCallback((e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file: File | undefined = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      const content: string = await processFile(file);
      if (content) {
        setContent(content);
      }
    } catch (error: unknown) {
      console.error('Failed to process dropped file:', error);
    }
  }, [setContent]);

  // Memoize editor props to keep EditorPreviewWorkspace stable
  const editorProps = useMemo(() => ({
    onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
      editorRef.current = editor;

      // Use Monaco's own action system to override paste
      editor.addAction({
        id: 'zply-intercept-paste',
        label: 'Paste',
        keybindings: [monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyV],
        run: () => interceptPaste(editor),
      });

      // Initial validation
      const model = editor.getModel();
      if (model) {
        validateMarkdown(model, monacoInstance);
      }

      // Validate on content change
      editor.onDidChangeModelContent(() => {
        const model = editor.getModel();
        if (model) {
          validateMarkdown(model, monacoInstance);
        }
      });

      // Add command for PDF export (Ctrl+P / Cmd+P)
      editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyP, () => {
        handleExportPdf();
      });

      // Quick fixes provider
      monacoInstance.languages.registerCodeActionProvider('markdown', {
        provideCodeActions: (model, range, context) => {
          const actions: monaco.languages.CodeAction[] = context.markers.map((marker) => {
            const commonProps = {
              kind: 'quickfix',
              diagnostics: [marker],
              isPreferred: true,
            };

            switch (marker.code) {
              case 'trailing-spaces':
                return {
                  title: t(`${ToolId.MARKDOWN}.quickFix.removeTrailingSpaces`),
                  edit: {
                    edits: [{
                      resource: model.uri,
                      versionId: model.getVersionId(),
                      textEdit: {
                        range: marker,
                        text: '',
                      },
                    }],
                  },
                  ...commonProps,
                };
              case 'consecutive-empty-lines':
                return {
                  title: t(`${ToolId.MARKDOWN}.quickFix.fixConsecutiveEmptyLines`),
                  edit: {
                    edits: [{
                      resource: model.uri,
                      versionId: model.getVersionId(),
                      textEdit: {
                        range: marker,
                        text: '',
                      },
                    }],
                  },
                  ...commonProps,
                };
              case 'malformed-header':
                return {
                  title: t(`${ToolId.MARKDOWN}.quickFix.fixMalformedHeader`),
                  edit: {
                    edits: [{
                      resource: model.uri,
                      versionId: model.getVersionId(),
                      textEdit: {
                        range: {
                          startLineNumber: marker.startLineNumber,
                          startColumn: marker.endColumn - 1,
                          endLineNumber: marker.startLineNumber,
                          endColumn: marker.endColumn,
                        },
                        text: '# ',
                      },
                    }],
                  },
                  ...commonProps,
                };
              case 'inconsistent-list-marker': {
                const prevLine = model.getLineContent(marker.startLineNumber - 1);
                const match = prevLine.match(/^(\s*)([*\-+])\s/);
                if (match) {
                  return {
                    title: t(`${ToolId.MARKDOWN}.quickFix.fixInconsistentListMarker`),
                    edit: {
                      edits: [{
                        resource: model.uri,
                        versionId: model.getVersionId(),
                        textEdit: {
                          range: marker,
                          text: match[2],
                        },
                      }],
                    },
                    ...commonProps,
                  };
                }
                return null;
              }
              case 'missing-alt-text':
                return {
                  title: t(`${ToolId.MARKDOWN}.quickFix.fixMissingAltText`),
                  edit: {
                    edits: [{
                      resource: model.uri,
                      versionId: model.getVersionId(),
                      textEdit: {
                        range: {
                          startLineNumber: marker.startLineNumber,
                          startColumn: marker.startColumn + (model.getLineContent(marker.startLineNumber)[marker.startColumn - 1] === '!' ? 2 : 1),
                          endLineNumber: marker.startLineNumber,
                          endColumn: marker.startColumn + (model.getLineContent(marker.startLineNumber)[marker.startColumn - 1] === '!' ? 2 : 1),
                        },
                        text: 'Alt text',
                      },
                    }],
                  },
                  ...commonProps,
                };
              case 'missing-line-around-header':
                return {
                  title: t(`${ToolId.MARKDOWN}.quickFix.fixMissingLineAroundHeader`),
                  edit: {
                    edits: [
                      ...(marker.startLineNumber > 1 && model.getLineContent(marker.startLineNumber - 1).trim() !== '' ? [{
                        resource: model.uri,
                        versionId: model.getVersionId(),
                        textEdit: {
                          range: { startLineNumber: marker.startLineNumber, startColumn: 1, endLineNumber: marker.startLineNumber, endColumn: 1 },
                          text: '\n',
                        },
                      }] : []),
                      ...(marker.startLineNumber < model.getLineCount() && model.getLineContent(marker.startLineNumber + 1).trim() !== '' && !model.getLineContent(marker.startLineNumber + 1).startsWith('#') ? [{
                        resource: model.uri,
                        versionId: model.getVersionId(),
                        textEdit: {
                          range: {
                            startLineNumber: marker.startLineNumber + 1,
                            startColumn: 1,
                            endLineNumber: marker.startLineNumber + 1,
                            endColumn: 1
                          },
                          text: '\n',
                        },
                      }] : []),
                    ],
                  },
                  ...commonProps,
                };
              case 'unclosed-code-block':
                return {
                  title: t(`${ToolId.MARKDOWN}.quickFix.fixUnclosedCodeBlock`),
                  edit: {
                    edits: [{
                      resource: model.uri,
                      versionId: model.getVersionId(),
                      textEdit: {
                        range: {
                          startLineNumber: model.getLineCount(),
                          startColumn: model.getLineMaxColumn(model.getLineCount()),
                          endLineNumber: model.getLineCount(),
                          endColumn: model.getLineMaxColumn(model.getLineCount()),
                        },
                        text: '\n```',
                      },
                    }],
                  },
                  ...commonProps,
                };
              default:
                return null;
            }
          }).filter(Boolean) as monaco.languages.CodeAction[];

          return {
            actions,
            dispose: () => {
            },
          };
        },
      });

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
    } as const
  }), [handleExportPdf, validateMarkdown, t, interceptPaste]);

  // Memoize preview content
  const previewElement = useMemo(() => (
    <div ref={previewRef} className="h-full p-12 md:p-16 overflow-y-auto custom-scrollbar markdown-preview-area">
      <article
        className={cn(
          'prose max-w-none prose-headings:font-black prose-p:leading-relaxed',
          resolvedTheme === 'dark' && 'prose-invert'
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  ), [html, resolvedTheme]);

  return (
    <>
      <ToolPageLayout
        toolId={ToolId.MARKDOWN}
        title={t(`${ToolId.MARKDOWN}.title`)}
        icon={<FileText className="w-5 h-5" />}
        breadcrumbItems={[
          { label: tCategories(Category.DIAGRAMS), href: `/?category=${Category.DIAGRAMS}` },
          { label: t(`${ToolId.MARKDOWN}.title`) }
        ]}
        mobileBreakpoint={1400}
        headerActions={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <MarkdownToolbar
              onAction={handleToolbarAction}
              onFoldAll={handleFoldAll}
              onUnfoldAll={handleUnfoldAll}
              onShiftHeaders={handleShiftHeaders}
              onLoadFile={setContent}
              onExportPdf={handleExportPdf}
              loadFileLabel={tMarkdown('loadFile')}
              exportPdfLabel={tMarkdown('exportPdf')}
              mathLabel={tMarkdown('math')}
            />
            <Separator className="h-4 hidden xl:block" />
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          </div>
        }
        footerIndicator={
          <>
            <span className="flex items-center gap-1.5">
              <Zap className={cn('w-3 h-3 text-yellow-500/50', isPending && 'animate-pulse')} />
              {tCommon('toolIndicators.liveRendering')}
            </span>
            <Separator />
            <span>{tCommon('charsCount', { count: content.length })}</span>
          </>
        }
        workspaceClassName="flex-1 min-h-0 flex-row overflow-hidden"
      >
        <div
          className="flex-1 flex flex-row min-h-0 min-w-0 relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <EditorPreviewWorkspace
            value={content}
            onChange={setContent}
            language="markdown"
            viewMode={viewMode}
            editorProps={editorProps}
            previewClassName={`${resolvedTheme === 'dark' ? 'bg-[#050a1a]' : 'bg-slate-50'}`}
            preview={previewElement}
          />

          {
            isDragging
            && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-island-bg/60 backdrop-blur-sm border-2 border-dashed border-primary m-4 rounded-3xl pointer-events-none">
                <div className="flex flex-col items-center gap-4 text-primary">
                  <LucideIcons.Upload className="w-12 h-12 animate-bounce" />
                  <p className="text-xl font-bold">{tMarkdown('dropFileToImport')}</p>
                </div>
              </div>
            )
          }
        </div>
      </ToolPageLayout>

      <MarkdownPasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onConfirm={handleConfirmPaste}
        pendingPaste={pendingPaste}
        resolvedTheme={resolvedTheme}
      />

      <MarkdownPrintArea html={html} />
    </>
  );
}
