'use client';

import dynamic from 'next/dynamic';
import { EditorProps } from '@monaco-editor/react';
import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading component for Monaco Editor.
 * Matches the background and overall style of the application.
 */
const MonacoLoader = (): React.ReactNode => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 animate-in fade-in duration-500">
    <Loader2 className="w-8 h-8 text-zply-blue animate-spin mb-4" />
    <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">
      Loading Editor...
    </span>
  </div>
);

/**
 * Dynamically imported Monaco Editor to prevent heavy bundle on initial load.
 * SSR is disabled as Monaco depends on browser-only globals.
 */
const DynamicEditor: React.ComponentType<EditorProps> = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <MonacoLoader />,
  }
);

/**
 * Dynamically imported Monaco Diff Editor.
 */
const DynamicDiffEditor: React.ComponentType<import('@monaco-editor/react').DiffEditorProps> = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.DiffEditor),
  {
    ssr: false,
    loading: () => <MonacoLoader />,
  }
);

/**
 * Reusable Monaco Editor component with project defaults.
 */
const MonacoEditor = (props: EditorProps): React.ReactNode => {
  return (
    <DynamicEditor
      {...props}
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
 * Reusable Monaco Diff Editor component with project defaults.
 */
const MonacoDiffEditor = (props: import('@monaco-editor/react').DiffEditorProps): React.ReactNode => {
  return (
    <DynamicDiffEditor
      {...props}
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
export type { OnMount, EditorProps, DiffEditorProps } from '@monaco-editor/react';
