import { MonacoDiffEditor } from '@/components/monaco-editor';
import { useTheme } from 'next-themes';
import React, { ReactNode } from 'react';
import { ViewMode } from '@/hooks/use-view-mode';

interface TextCompareEditorProps {
  original: string;
  modified: string;
  viewMode: ViewMode;
  onOriginalChange: (val: string) => void;
  onModifiedChange: (val: string) => void;
}

export function TextCompareEditor(
  {
    original,
    modified,
    viewMode,
    onOriginalChange,
    onModifiedChange,
  }: TextCompareEditorProps
): ReactNode {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex-1 min-h-0 bg-island-bg/20 relative">
      {/* Labels */}
      <div
        className="absolute top-4 left-12 z-10 px-2 py-1 rounded bg-island-bg/50 border border-island-border text-[9px] font-black uppercase tracking-widest text-muted-foreground backdrop-blur-sm pointer-events-none">
        Original
      </div>
      <div
        className="absolute top-4 right-12 z-10 px-2 py-1 rounded bg-island-bg/50 border border-island-border text-[9px] font-black uppercase tracking-widest text-muted-foreground backdrop-blur-sm pointer-events-none">
        Modified
      </div>

      <MonacoDiffEditor
        height="100%"
        original={original}
        modified={modified}
        language="plaintext"
        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
        onMount={(editor) => {
          editor.getOriginalEditor().onDidChangeModelContent(() => {
            onOriginalChange(editor.getOriginalEditor().getValue());
          });
          editor.getModifiedEditor().onDidChangeModelContent(() => {
            onModifiedChange(editor.getModifiedEditor().getValue());
          });
        }}
        options={{
          padding: { top: 40 },
          originalEditable: true,
          renderSideBySide: viewMode === 'split',
        }}
      />
    </div>
  );
}
