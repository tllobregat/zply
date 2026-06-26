import { PlantUmlError } from '@/app/[locale]/plantuml-editor/plantuml.types';
import { Logger } from '@/lib/logger';
import { RefObject, useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS: number = 1000;

type Timeout = ReturnType<typeof setTimeout>;

declare global {
  interface Window {
    cheerpjInit: (options?: object) => Promise<void>;
    cheerpjRunMain: (className: string, classPath: string, ...args: string[]) => Promise<number>;
    cjCall: (className: string, methodName: string, ...args: unknown[]) => Promise<unknown>;
    isCheerpJInitialized?: boolean;
  }
}

export type UsePlantUmlTransformation = {
  isEngineReady: boolean;
  svgContent: string | null;
  isRendering: boolean;
  isDebouncing: boolean;
  error: PlantUmlError | null;
  initEngine: () => void;
  forceRender: () => void,
}

export function usePlantUmlTransformation(content: string, isMounted: boolean): UsePlantUmlTransformation {
  const [isEngineReady, setIsEngineReady] = useState<boolean>(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);
  const [error, setError] = useState<PlantUmlError | null>(null);
  const [forceTrigger, setForceTrigger] = useState<number>(0);

  const timerRef: RefObject<Timeout | null> = useRef<Timeout | null>(null);
  const lastRenderedContentRef: RefObject<string | null> = useRef<string | null>(null);
  const isForcedRef: RefObject<boolean> = useRef<boolean>(false);

  const initEngine: () => void = (): void => {
    if (window.isCheerpJInitialized) {
      requestAnimationFrame(() => setIsEngineReady(true));
      Logger.debug('CheerpJ already initialized, skipping...');
      return;
    }

    fetch('/plantuml-core.jar.js', { method: 'HEAD' })
      .then((check: Response) => {
        if (!check.ok) {
          throw new Error('Binaires WASM manquants');
        }
        return window.cheerpjInit();
      })
      .then(() => (
        window.cheerpjRunMain('com.plantuml.api.cheerpj.v1.RunInit', '/app/plantuml-core.jar')
      ))
      .then(() => {
        window.isCheerpJInitialized = true;
        requestAnimationFrame(() => setIsEngineReady(true));
      })
      .catch((err: unknown) => {
        Logger.error('PlantUML engine initialization failed', err);
        const message: string = err instanceof Error ? err.message : 'Erreur d\'initialisation';
        requestAnimationFrame(() => setError({ message }));
      });
  };

  const renderDiagram = async (val: string): Promise<void> => {
    setIsRendering(true);
    setError(null);
    try {
      const result: unknown = await window.cjCall('com.plantuml.api.cheerpj.v1.Svg', 'convert', 'light', val);
      
      if (typeof result === 'string') {
        const trimmedResult: string = result.trim();
        
        // Check if result is JSON-like error: {"duration":14,"status":"Parsing error","line":2,"error":"Syntax Error?"}
        if (trimmedResult.startsWith('{') && trimmedResult.endsWith('}')) {
          try {
            const jsonError: PlantUmlError = JSON.parse(trimmedResult);
            if (jsonError.status === 'Parsing error' || jsonError.error) {
              setError({
                message: jsonError.error || jsonError.status || '',
                line: jsonError.line
              });
              setIsRendering(false);
              return;
            }
          } catch (e) {
            Logger.error('Error parsing JSON error response', e);
            // Not valid JSON, continue with normal processing
          }
        }

        const svgIndex: number = result.indexOf('<svg');
        if (svgIndex !== -1) {
          setSvgContent(result.substring(svgIndex));
          lastRenderedContentRef.current = val;
        } else {
          // PlantUML returns a text error when it fails to generate SVG
          // We clean up the result to get a readable error
          const cleanError: string = result
            .replace(/<[^>]*>/g, '') // Remove HTML tags if any
            .replace(/&nbsp;/g, ' ')
            .trim() || 'Syntax Error: Code invalide';
          setError({ message: cleanError });
        }
      }
    } catch (err: unknown) {
      Logger.error('PlantUML rendering failed', err);
      setError({ message: 'Erreur de compilation' });
    } finally {
      setIsRendering(false);
      isForcedRef.current = false;
    }
  };

  const forceRender = (): void => {
    isForcedRef.current = true;
    setForceTrigger(prev => prev + 1);
  };

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
