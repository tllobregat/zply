import MonacoEditor, { MonacoDiffEditor } from '@/components/monaco-editor';
import { useTheme } from 'next-themes';
import React, { ReactNode, useCallback, useMemo } from 'react';
import type * as monaco from 'monaco-editor';
import { DiffMode, ViewMode } from './text-compare.types';

interface TextCompareEditorProps {
  original: string;
  modified: string;
  viewMode: ViewMode;
  diffMode: DiffMode;
  onOriginalChange: (val: string) => void;
  onModifiedChange: (val: string) => void;
}

export function TextCompareEditor(
  {
    original,
    modified,
    viewMode,
    diffMode,
    onOriginalChange,
    onModifiedChange,
  }: TextCompareEditorProps
): ReactNode {
  const { resolvedTheme } = useTheme();

  const isSplit: boolean = diffMode === 'split';
  const showDiff: boolean = viewMode === 'split' || !isSplit;

  const handleDiffEditorMount = useCallback((editor: monaco.editor.IStandaloneDiffEditor): void => {
    editor.getOriginalEditor().onDidChangeModelContent((): void => {
      onOriginalChange(editor.getOriginalEditor().getValue());
    });
    editor.getModifiedEditor().onDidChangeModelContent((): void => {
      onModifiedChange(editor.getModifiedEditor().getValue());
    });
  }, [onOriginalChange, onModifiedChange]);

  const diffOptions = useMemo(() => ({
    padding: { top: 40 },
    originalEditable: true,
    renderSideBySide: isSplit,
    readOnly: false,
  }), [isSplit]);

  const editorOptions = useMemo(() => ({
    padding: { top: 40 },
    readOnly: false,
  }), []);

  const handleEditorChange = useCallback((val: string | undefined): void => {
    if (viewMode === 'original') {
      onOriginalChange(val || '');
    } else {
      onModifiedChange(val || '');
    }
  }, [viewMode, onOriginalChange, onModifiedChange]);

  return (
    <div className="flex-1 min-h-0 bg-island-bg/20 relative">
      {/* Labels */}
      {
        (viewMode === 'original' || (viewMode === 'split' && isSplit))
        && (
          <div
            className="absolute top-4 left-12 z-10 px-2 py-1 rounded bg-island-bg/50 border border-island-border text-[9px] font-black uppercase tracking-widest text-muted-foreground backdrop-blur-sm pointer-events-none">
            Original
          </div>
        )
      }
      {
        (viewMode === 'modified' || (viewMode === 'split' && isSplit))
        && (
          <div
            className="absolute top-4 right-12 z-10 px-2 py-1 rounded bg-island-bg/50 border border-island-border text-[9px] font-black uppercase tracking-widest text-muted-foreground backdrop-blur-sm pointer-events-none">
            Modified
          </div>
        )
      }

      {
        showDiff
          ? (
            <MonacoDiffEditor
              height="100%"
              original={original}
              modified={modified}
              language="plaintext"
              theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
              onMount={handleDiffEditorMount}
              options={diffOptions}
            />
          )
          : (
            <MonacoEditor
              height="100%"
              value={viewMode === 'original' ? original : modified}
              language="plaintext"
              theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
              onChange={handleEditorChange}
              options={editorOptions}
            />
          )
      }
    </div>
  );
}
