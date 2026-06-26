import { MermaidError } from '@/app/[locale]/mermaid-maker/mermaid.types';
import { Logger } from '@/lib/logger';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';
import { RefObject, useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS: number = 500;

type Timeout = ReturnType<typeof setTimeout>;

export type UseMermaidTransformation = {
  isEngineReady: boolean;
  svgContent: string | null;
  isRendering: boolean;
  isDebouncing: boolean;
  error: MermaidError | null;
  initEngine: () => void;
  forceRender: () => void;
}

export function useMermaidTransformation(content: string, isMounted: boolean): UseMermaidTransformation {
  const { resolvedTheme } = useTheme();
  const [isEngineReady, setIsEngineReady] = useState<boolean>(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const [error, setError] = useState<MermaidError | null>(null);
  const [forceTrigger, setForceTrigger] = useState<number>(0);

  const timerRef: RefObject<Timeout | null> = useRef<Timeout | null>(null);
  const lastRenderedContentRef: RefObject<string | null> = useRef<string | null>(null);
  const isForcedRef: RefObject<boolean> = useRef<boolean>(false);

  const initEngine: () => void = (): void => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'var(--font-geist-sans)',
        gantt: {
          useMaxWidth: false,
        },
      });
      requestAnimationFrame(() => setIsEngineReady(true));
    } catch (err: unknown) {
      Logger.error('Mermaid initialization failed', err);
      setError({ message: 'Erreur d\'initialisation de Mermaid' });
    }
  };

  const renderDiagram = async (val: string): Promise<void> => {
    if (!val.trim()) {
      setSvgContent(null);
      setError(null);
      return;
    }

    setIsRendering(true);
    setError(null);

    try {
      // Mermaid requires a unique ID for each render
      const id: string = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
      const { svg } = await mermaid.render(id, val);
      
      setSvgContent(svg);
      lastRenderedContentRef.current = val;
    } catch (err: unknown) {
      Logger.error('Mermaid rendering failed', err);
      // Mermaid errors can be complex, try to extract message
      const message: string = err instanceof Error ? err.message : 'Erreur de syntaxe Mermaid';
      setError({ 
        message,
        hash: (err as { hash?: string }).hash
      });
    } finally {
      setIsRendering(false);
      isForcedRef.current = false;
    }
  };

  const forceRender = (): void => {
    isForcedRef.current = true;
    setForceTrigger((prev: number) => prev + 1);
  };

  // Re-initialize mermaid when theme changes
  useEffect(() => {
    if (isEngineReady) {
      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'var(--font-geist-sans)',
        gantt: {
          useMaxWidth: false,
        },
      });
      forceRender();
    }
  }, [resolvedTheme, isEngineReady]);

  useEffect(() => {
    if (!isEngineReady || !isMounted) return;

    if (!svgContent || isForcedRef.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsDebouncing(false);
      renderDiagram(content);
      return;
    }

    if (content === lastRenderedContentRef.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsDebouncing(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    setIsDebouncing(true);
    timerRef.current = setTimeout(() => {
      setIsDebouncing(false);
      renderDiagram(content);
    }, DEBOUNCE_MS);

    return (): void => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [content, isEngineReady, isMounted, forceTrigger]);

  return {
    isEngineReady,
    svgContent,
    isRendering,
    isDebouncing,
    error,
    initEngine,
    forceRender,
  };
}
