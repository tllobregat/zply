import { PlantUmlError } from '@/app/plantuml-editor/plantuml.types';
import { Logger } from '@/lib/logger';
import { RefObject, useEffect, useRef, useState } from 'react';

const DEBOUNCE_MS: number = 3000;

type Timeout = ReturnType<typeof setTimeout>;
type Interval = ReturnType<typeof setInterval>;

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
  error: PlantUmlError | null;
  progress: number;
  initEngine: () => void;
  forceRender: () => void,
}

export function usePlantUmlTransformation(content: string, isMounted: boolean): UsePlantUmlTransformation {
  const [isEngineReady, setIsEngineReady] = useState<boolean>(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [error, setError] = useState<PlantUmlError | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [forceTrigger, setForceTrigger] = useState<number>(0);

  const timerRef: RefObject<Timeout | null> = useRef<Timeout | null>(null);
  const progressIntervalRef: RefObject<Interval | null> = useRef<Interval | null>(null);
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
              setProgress(0);
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
      setProgress(0);
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
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      renderDiagram(content);
      return;
    }

    if (content === lastRenderedContentRef.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(0);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(0);

    const startTime: number = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed: number = Date.now() - startTime;
      const newProgress: number = Math.min((elapsed / DEBOUNCE_MS) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      }
    }, 50);

    timerRef.current = setTimeout(() => {
      renderDiagram(content);
    }, DEBOUNCE_MS);

    return (): void => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [content, isEngineReady, isMounted, forceTrigger]);

  return {
    isEngineReady,
    svgContent,
    isRendering,
    error,
    progress,
    initEngine,
    forceRender,
  };
}
