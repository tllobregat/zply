import { Logger } from '@/lib/logger';
import type * as monaco from 'monaco-editor';
import { RefObject } from 'react';

export type UseJsonActions = {
  formatJson: () => void;
  minifyJson: () => void;
  foldAll: () => void;
  unfoldAll: () => void;
}

export function useJsonActions(
  content: string,
  setContent: (val: string) => void,
  editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>
): UseJsonActions {
  const formatJson = (): void => {
    try {
      const parsed: object = JSON.parse(content);
      setContent(JSON.stringify(parsed, null, 2));
    } catch (error: unknown) {
      Logger.error('JSON formatting failed', error);
    }
  };

  const minifyJson = (): void => {
    try {
      const parsed: object = JSON.parse(content);
      setContent(JSON.stringify(parsed));
    } catch (error: unknown) {
      Logger.error('JSON minification failed', error);
    }
  };

  const foldAll = (): void => {
    editorRef.current?.getAction('editor.foldAll')?.run();
  };

  const unfoldAll = (): void => {
    editorRef.current?.getAction('editor.unfoldAll')?.run();
  };

  return {
    formatJson,
    minifyJson,
    foldAll,
    unfoldAll,
  };
}
