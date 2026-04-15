'use client';

import { ViewMode } from '@/hooks/use-view-mode';
import { cn } from '@/lib/utils';
import MonacoEditor, { OnMount, EditorProps } from '@/components/monaco-editor';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import React, { ReactNode, RefObject, useCallback, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type * as monaco from 'monaco-editor';

type ITextModel = monaco.editor.ITextModel;

/**
 * Interface for the EditorPreviewWorkspace component props.
 */
interface EditorPreviewWorkspaceProps {
  /** The content value of the editor */
  value: string;
  /** Callback function when the content changes */
  onChange: (value: string) => void;
  /** The language for the editor (e.g., 'markdown', 'plantuml') */
  language?: string;
  /** The current view mode ('editor', 'split', 'preview') */
  viewMode: ViewMode;
  /** The preview component to display */
  preview: React.ReactNode;
  /** Optional additional props for the Monaco Editor */
  editorProps?: Partial<EditorProps>;
  /** Optional additional CSS classes for the editor panel */
  editorClassName?: string;
  /** Optional additional CSS classes for the preview panel */
  previewClassName?: string;
  /** Markers to display in the editor (for linting) */
  markers?: monaco.editor.IMarkerData[];
  /** Optional custom editor component to replace Monaco */
  customEditor?: React.ReactNode;
}

/**
 * A highly reusable workspace component for tools that feature an Editor and a Preview side-by-side.
 * It manages the split-screen logic, Monaco editor settings, and Framer Motion transitions.
 */
export function EditorPreviewWorkspace(
  {
    value,
    onChange,
    language,
    viewMode,
    preview,
    editorProps,
    editorClassName,
    previewClassName,
    markers,
    customEditor,
  }: EditorPreviewWorkspaceProps,
): ReactNode {
  const { resolvedTheme } = useTheme();
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkMobile = (): void => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return (): void => window.removeEventListener('resize', checkMobile);
  }, []);

  const isSplit: boolean = viewMode === 'split';
  const showEditor: boolean = viewMode === 'editor' || isSplit;
  const showPreview: boolean = viewMode === 'preview' || isSplit;

  const editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null> = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef: RefObject<typeof monaco | null> = React.useRef<typeof monaco | null>(null);

  // Sync markers when they change
  React.useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model: ITextModel | null = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelMarkers(model, 'owner', markers || []);
      }
    }
  }, [markers]);

  // Handle markers
  const handleEditorMount: OnMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco): void => {
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    if (markers) {
      monacoInstance.editor.setModelMarkers(editor.getModel()!, 'owner', markers);
    }
    
    const observer: ResizeObserver = new ResizeObserver((): void => {
      editor.layout();
    });
    const container: HTMLElement | null = editor.getDomNode()?.parentElement ?? null;
    if (container) {
      observer.observe(container);
    }
    if (editorProps?.onMount) {
      editorProps.onMount(editor, monacoInstance);
    }
  }, [editorProps, markers]);

  const stableEditorProps = useMemo(() => {
    if (!editorProps) return {};
    // Extract everything except onMount to avoid passing the mount handler twice
    const { onMount, ...rest } = editorProps;
    void onMount;
    return rest;
  }, [editorProps]);

  const editorElement: ReactNode = (
    <div className={cn('h-full w-full bg-island-bg/20 overflow-hidden', editorClassName)}>
      {
        customEditor
          ? (
            customEditor
          )
          : (
            <MonacoEditor
              height="100%"
              language={language}
              value={value}
              theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
              onChange={(val: string | undefined): void => onChange(val || '')}
              onMount={handleEditorMount}
              {...stableEditorProps}
            />
          )
      }
    </div>
  );

  const previewElement: ReactNode = (
    <div className={cn('h-full w-full bg-island-bg/50', previewClassName)}>
      {preview}
    </div>
  );

  // Simple Mode (Full width)
  if (!isSplit) {
    return (
      <AnimatePresence mode="popLayout" initial={false}>
        {
          showEditor
          && (
            <motion.div
              key="editor-main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full"
            >
              {editorElement}
            </motion.div>
          )
        }
        {
          showPreview
          && (
            <motion.div
              key="preview-main"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full h-full"
            >
              {previewElement}
            </motion.div>
          )
        }
      </AnimatePresence>
    );
  }

  // Split Mode with Resizable Panels
  return (
    <PanelGroup direction={isMobile ? 'vertical' : 'horizontal'} className="h-full w-full">
      <Panel defaultSize={isMobile ? 40 : 50} minSize={20}>
        <motion.div
          key="editor-main"
          initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? -20 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          className={cn(
            "h-full",
            isMobile ? "border-b border-island-border" : "border-r border-island-border"
          )}
        >
          {editorElement}
        </motion.div>
      </Panel>
      
      <PanelResizeHandle className={cn(
        "hover:bg-blue-500/30 transition-colors relative z-50 flex items-center justify-center group",
        isMobile ? "h-1.5 w-full" : "w-1.5 h-full"
      )}>
        <div className={cn(
          "bg-island-border rounded-full group-hover:bg-blue-400 group-active:bg-blue-500",
          isMobile ? "w-10 h-0.5" : "h-10 w-0.5"
        )} />
      </PanelResizeHandle>

      <Panel defaultSize={isMobile ? 60 : 50} minSize={20}>
        <motion.div
          key="preview-main"
          initial={{ opacity: 0, x: isMobile ? 0 : 20, y: isMobile ? 20 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          className="h-full"
        >
          {previewElement}
        </motion.div>
      </Panel>
    </PanelGroup>
  );
}
