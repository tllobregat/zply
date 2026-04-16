'use client';

import { EditorPreviewWorkspace } from '@/components/ui/layout';
import { ToolPageLayout }from '@/components/ui/layout';
import { Separator } from '@/components/ui/separator';
import { ViewModeToggle } from '@/components/ui/layout';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import type * as monaco from 'monaco-editor';
import { ReactNode, RefObject, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'next-themes';
import { useMarkdownState } from './use-markdown-state';
import { useMarkdownTransformation } from './use-markdown-transformation';
import { useMarkdownActions } from './use-markdown-actions';
import { MarkdownToolbar } from './MarkdownToolbar';

const { FileText, Zap } = LucideIcons;

export default function MarkdownPageClient(): ReactNode {
  const { resolvedTheme } = useTheme();
  const { content, setContent, viewMode, setViewMode } = useMarkdownState();
  const { html, isPending } = useMarkdownTransformation(content);
  const editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null> = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const previewRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const { handleToolbarAction, handleFoldAll, handleUnfoldAll, handleShiftHeaders } = useMarkdownActions(editorRef);
  
  const t = useTranslations('Tools');
  const tMarkdown = useTranslations(`Tools.${ToolId.MARKDOWN}`);
  const tCategories = useTranslations('Categories');
  const tCommon = useTranslations('Common');

  // Validate markdown for quality and syntax
  const validateMarkdown = useCallback((model: monaco.editor.ITextModel, monacoInstance: typeof monaco) => {
    const lines: string[] = model.getLinesContent();
    const markers: monaco.editor.IMarkerData[] = [];
    let lastLevel: number = 0;
    let h1Count: number = 0;
    let consecutiveEmptyLines: number = 0;
    const headerTexts: Set<string> = new Set<string>();
    const linkReferences: Set<string> = new Set<string>();
    const usedReferences: { ref: string; line: number; col: number; len: number }[] = [];
    let insideCodeBlock: boolean = false;
    let codeBlockStartLine: number = -1;

    for (let i: number = 0; i < lines.length; i++) {
      const line: string = lines[i];
      const lineNum: number = i + 1;

      // 1. Code blocks tracking
      if (line.trim().startsWith('```')) {
        insideCodeBlock = !insideCodeBlock;
        codeBlockStartLine = insideCodeBlock ? lineNum : -1;
      }

      if (insideCodeBlock && lineNum !== codeBlockStartLine) continue;

      // 2. Trailing spaces
      if (line.length > 0 && /\s$/.test(line)) {
        markers.push({
          severity: monacoInstance.MarkerSeverity.Warning,
          message: t(`${ToolId.MARKDOWN}.trailingSpaces`),
          startLineNumber: lineNum,
          startColumn: line.length,
          endLineNumber: lineNum,
          endColumn: line.length + 1,
          code: 'trailing-spaces',
        });
      }

      // 3. Consecutive empty lines
      if (line.trim() === '') {
        consecutiveEmptyLines++;
        if (consecutiveEmptyLines > 2) {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.consecutiveEmptyLines`),
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: 1,
            code: 'consecutive-empty-lines',
          });
        }
      } else {
        consecutiveEmptyLines = 0;
      }

      // 4. Headers validation
      const headerMatch: RegExpMatchArray | null = line.match(/^(#{1,6})(\s+)(.*)/);
      const malformedHeaderMatch: RegExpMatchArray | null = line.match(/^(#{1,6})[^#\s]/);

      if (malformedHeaderMatch) {
        markers.push({
          severity: monacoInstance.MarkerSeverity.Error,
          message: t(`${ToolId.MARKDOWN}.malformedHeader`),
          startLineNumber: lineNum,
          startColumn: 1,
          endLineNumber: lineNum,
          endColumn: malformedHeaderMatch[1].length + 1,
          code: 'malformed-header',
        });
      }

      if (headerMatch) {
        const level: number = headerMatch[1].length;
        const text: string = headerMatch[3].trim();

        // Multiple H1
        if (level === 1) {
          h1Count++;
          if (h1Count > 1) {
            markers.push({
              severity: monacoInstance.MarkerSeverity.Warning,
              message: t(`${ToolId.MARKDOWN}.multipleH1`),
              startLineNumber: lineNum,
              startColumn: 1,
              endLineNumber: lineNum,
              endColumn: headerMatch[0].length + 1,
            });
          }
        }

        // Header level jump
        if (level > lastLevel + 1 && lastLevel !== 0) {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.headerLevelJump`, { prev: lastLevel, curr: level }),
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: headerMatch[1].length + 1,
          });
        }
        lastLevel = level;

        // Duplicate header ID
        if (headerTexts.has(text)) {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.duplicateHeaderId`, { text }),
            startLineNumber: lineNum,
            startColumn: headerMatch[1].length + headerMatch[2].length + 1,
            endLineNumber: lineNum,
            endColumn: headerMatch[0].length + 1,
          });
        }
        headerTexts.add(text);

        // Missing empty line before header
        if (i > 0 && lines[i - 1].trim() !== '') {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.missingLineAroundHeader`),
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: headerMatch[1].length + 1,
            code: 'missing-line-around-header',
          });
        }
        // Missing empty line after header
        if (i < lines.length - 1 && lines[i + 1].trim() !== '' && !lines[i + 1].startsWith('#')) {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.missingLineAroundHeader`),
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: headerMatch[1].length + 1,
            code: 'missing-line-around-header',
          });
        }
      }

      // 5. Lists inconsistency
      const listMatch: RegExpMatchArray | null = line.match(/^\s*([*\-+])\s/);
      if (listMatch) {
        const marker: string = listMatch[1];
        // Check surrounding list items if they use the same marker
        // Simplified: check if previous line was a list with different marker at same indentation
        if (i > 0) {
          const prevListMatch: RegExpMatchArray | null = lines[i - 1].match(/^(\s*)([*\-+])\s/);
          const currentIndent: string = line.match(/^\s*/)?.[0] || '';
          if (prevListMatch && prevListMatch[1] === currentIndent && prevListMatch[2] !== marker) {
            markers.push({
              severity: monacoInstance.MarkerSeverity.Warning,
              message: t(`${ToolId.MARKDOWN}.inconsistentListMarkers`),
              startLineNumber: lineNum,
              startColumn: line.indexOf(marker) + 1,
              endLineNumber: lineNum,
              endColumn: line.indexOf(marker) + 2,
              code: 'inconsistent-list-marker',
            });
          }
        }
      }

      // 6. Missing alt text
      const altTextMatches = line.matchAll(/(!?\[]\(.*?\))/g);
      for (const match of altTextMatches) {
        markers.push({
          severity: monacoInstance.MarkerSeverity.Warning,
          message: t(`${ToolId.MARKDOWN}.missingAltText`),
          startLineNumber: lineNum,
          startColumn: match.index + 1,
          endLineNumber: lineNum,
          endColumn: match.index + match[0].length + 1,
          code: 'missing-alt-text',
        });
      }

      // 7. Link references
      const refDefMatch: RegExpMatchArray | null = line.match(/^\s*\[(.*?)]:\s+/);
      if (refDefMatch) {
        linkReferences.add(refDefMatch[1]);
      }

      const refUsageMatches = line.matchAll(/\[(.*?)]\[(.*?)]/g);
      for (const match of refUsageMatches) {
        const ref: string = match[2] || match[1];
        usedReferences.push({
          ref,
          line: lineNum,
          col: match.index + (match[2] ? match[1].length + 3 : 1),
          len: ref.length
        });
      }
    }

    // 8. Orphan link references
    for (const usage of usedReferences) {
      if (!linkReferences.has(usage.ref)) {
        markers.push({
          severity: monacoInstance.MarkerSeverity.Error,
          message: t(`${ToolId.MARKDOWN}.orphanLinkReference`, { ref: usage.ref }),
          startLineNumber: usage.line,
          startColumn: usage.col,
          endLineNumber: usage.line,
          endColumn: usage.col + usage.len,
        });
      }
    }

    // 9. Unclosed code block
    if (insideCodeBlock) {
      markers.push({
        severity: monacoInstance.MarkerSeverity.Error,
        message: t(`${ToolId.MARKDOWN}.unclosedCodeBlock`),
        startLineNumber: codeBlockStartLine,
        startColumn: 1,
        endLineNumber: codeBlockStartLine,
        endColumn: 4,
        code: 'unclosed-code-block',
      });
    }

    monacoInstance.editor.setModelMarkers(model, 'markdown-linter', markers);
  }, [t]);

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

  // Memoize editor props to keep EditorPreviewWorkspace stable
  const editorProps = useMemo(() => ({
    onMount: (editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
      editorRef.current = editor;

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
                          range: { startLineNumber: marker.startLineNumber + 1, startColumn: 1, endLineNumber: marker.startLineNumber + 1, endColumn: 1 },
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
            dispose: () => {},
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
  }), [handleExportPdf, validateMarkdown, t]);

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
              <Zap className={cn("w-3 h-3 text-yellow-500/50", isPending && "animate-pulse")} /> 
              {tCommon('toolIndicators.liveRendering')}
            </span>
            <Separator />
            <span>{tCommon('charsCount', { count: content.length })}</span>
          </>
        }
        workspaceClassName="flex-1 min-h-0 flex-row overflow-hidden"
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
      </ToolPageLayout>
      {
        typeof document !== 'undefined'
        && createPortal(
          <div id="markdown-print-area" className="hidden print:block">
            <article
              className="prose max-w-none prose-headings:font-black prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>,
          document.body
        )
      }
    </>
  );
}
