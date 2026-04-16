import type * as monaco from 'monaco-editor';
import { RefObject } from 'react';

export type UseMarkdownActions = {
  handleToolbarAction: (
    prefix: string,
    suffix: string,
    placeholder: string,
    isBlock: boolean
  ) => void;
  handleFoldAll: () => void;
  handleUnfoldAll: () => void;
  handleShiftHeaders: (direction: 'up' | 'down') => void;
}

export function useMarkdownActions(editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>): UseMarkdownActions {
  const handleToolbarAction = (
    prefix: string,
    suffix: string = '',
    placeholder: string = '',
    isBlock: boolean = false
  ): void => {
    if (!editorRef.current) return;

    const editor: monaco.editor.IStandaloneCodeEditor = editorRef.current;
    const selection: monaco.Selection | null = editor.getSelection();
    const model: monaco.editor.ITextModel | null = editor.getModel();

    if (!selection || !model) return;

    const selectedText: string = model.getValueInRange(selection);
    const textToInsert: string = selectedText || placeholder;

    let finalPrefix: string = prefix;

    // Ensure block elements start on a new line
    if (isBlock && selection.startColumn > 1) {
      finalPrefix = `\n${prefix}`;
    }

    const newText: string = `${finalPrefix}${textToInsert}${suffix}`;

    editor.executeEdits('toolbar', [
      {
        range: selection,
        text: newText,
        forceMoveMarkers: true,
      },
    ]);

    editor.focus();
  };

  const handleFoldAll = (): void => {
    if (!editorRef.current) return;
    editorRef.current.trigger('toolbar', 'editor.foldAll', null);
  };

  const handleUnfoldAll = (): void => {
    if (!editorRef.current) return;
    editorRef.current.trigger('toolbar', 'editor.unfoldAll', null);
  };

  const handleShiftHeaders = (direction: 'up' | 'down'): void => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    const selection = editor.getSelection();
    if (!model || !selection) return;

    const isSelectionEmpty = selection.isEmpty();
    const startLine = isSelectionEmpty ? 1 : selection.startLineNumber;
    const endLine = isSelectionEmpty ? model.getLineCount() : selection.endLineNumber;

    const edits: monaco.editor.IIdentifiedSingleEditOperation[] = [];

    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
      const line = model.getLineContent(lineNumber);
      const match = line.match(/^(#{1,6})(\s+.*)/);
      if (match) {
        const hashes = match[1];
        const level = hashes.length;

        if (direction === 'down') {
          if (level < 6) {
            edits.push({
              range: {
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber,
                endColumn: level + 1,
              },
              text: '#'.repeat(level + 1),
            });
          }
        } else {
          if (level > 1) {
            edits.push({
              range: {
                startLineNumber: lineNumber,
                startColumn: 1,
                endLineNumber: lineNumber,
                endColumn: level + 1,
              },
              text: '#'.repeat(level - 1),
            });
          }
        }
      }
    }

    if (edits.length > 0) {
      editor.executeEdits('shift-headers', edits);
    }
  };

  return {
    handleToolbarAction,
    handleFoldAll,
    handleUnfoldAll,
    handleShiftHeaders,
  };
}
