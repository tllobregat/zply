'use client';

import dynamic from 'next/dynamic';
import { EditorProps, OnMount, DiffEditorProps } from '@monaco-editor/react';
import React, { useRef, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type * as monaco from 'monaco-editor';

/**
 * Loading component for Monaco Editor.
 */
const MonacoLoader = (): React.ReactNode => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 animate-in fade-in duration-500">
    <Loader2 className="w-8 h-8 text-zply-blue animate-spin mb-4" />
    <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">
      Loading Editor...
    </span>
  </div>
);

const DynamicEditor: React.ComponentType<EditorProps> = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <MonacoLoader />,
  }
);

const DynamicDiffEditor: React.ComponentType<DiffEditorProps> = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.DiffEditor),
  {
    ssr: false,
    loading: () => <MonacoLoader />,
  }
);

/**
 * Reusable Monaco Editor component.
 * Optimized to prevent cursor jumps by using a hybrid controlled/uncontrolled approach.
 */
const MonacoEditor = (props: EditorProps): React.ReactNode => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { value, onMount, ...restProps } = props;

  // Sync value from outside (e.g. file load, URL sync)
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const currentValue = editorRef.current.getValue();
      if (value !== currentValue) {
        const selection = editorRef.current.getSelection();
        editorRef.current.setValue(value);
        if (selection) {
          editorRef.current.setSelection(selection);
        }
      }
    }
  }, [value]);

  const handleEditorMount: OnMount = useCallback((editor, monacoInstance) => {
    editorRef.current = editor;
    if (onMount) {
      onMount(editor, monacoInstance);
    }
  }, [onMount]);

  return (
    <DynamicEditor
      {...restProps}
      value={undefined}
      defaultValue={value}
      onMount={handleEditorMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        padding: { top: 30 },
        wordWrap: 'on',
        fontFamily: 'var(--font-geist-mono)',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        folding: true,
        smoothScrolling: true,
        cursorSmoothCaretAnimation: 'on',
        ...props.options,
      }}
    />
  );
};

/**
 * Reusable Monaco Diff Editor component.
 */
const MonacoDiffEditor = (props: DiffEditorProps): React.ReactNode => {
  const diffEditorRef = useRef<monaco.editor.IDiffEditor | null>(null);
  const { original, modified, onMount, ...restProps } = props;

  // Sync original value
  useEffect(() => {
    if (diffEditorRef.current && original !== undefined) {
      const originalEditor = diffEditorRef.current.getOriginalEditor();
      if (original !== originalEditor.getValue()) {
        const selection = originalEditor.getSelection();
        originalEditor.setValue(original);
        if (selection) {
          originalEditor.setSelection(selection);
        }
      }
    }
  }, [original]);

  // Sync modified value
  useEffect(() => {
    if (diffEditorRef.current && modified !== undefined) {
      const modifiedEditor = diffEditorRef.current.getModifiedEditor();
      if (modified !== modifiedEditor.getValue()) {
        const selection = modifiedEditor.getSelection();
        modifiedEditor.setValue(modified);
        if (selection) {
          modifiedEditor.setSelection(selection);
        }
      }
    }
  }, [modified]);

  const handleEditorMount = useCallback((editor: monaco.editor.IStandaloneDiffEditor, monacoInstance: typeof monaco) => {
    diffEditorRef.current = editor;
    if (onMount) {
      onMount(editor, monacoInstance);
    }
  }, [onMount]);

  return (
    <DynamicDiffEditor
      {...restProps}
      original={original}
      modified={modified}
      onMount={handleEditorMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        padding: { top: 30 },
        wordWrap: 'on',
        fontFamily: 'var(--font-geist-mono)',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        folding: true,
        smoothScrolling: true,
        ...props.options,
      }}
    />
  );
};

export default MonacoEditor;
export { MonacoDiffEditor };
export type { OnMount, EditorProps, DiffEditorProps };
