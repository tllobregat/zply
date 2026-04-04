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

  return {
    handleToolbarAction,
    handleFoldAll,
    handleUnfoldAll,
  };
}
