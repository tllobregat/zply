import { DEFAULT_PLANTUML } from '@/app/plantuml-editor/plantuml.default';
import { useShareableState } from '@/hooks/use-shareable-state';
import { useViewMode, ViewMode } from '@/hooks/use-view-mode';
import { useEffect, useState } from 'react';

export type UsePlantUmlState = {
  content: string;
  setContent: (content: string) => void;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  isMounted: boolean;
};

export function usePlantUmlState(): UsePlantUmlState {
  const [content, setContent] = useShareableState<string>('puml', DEFAULT_PLANTUML);
  const { viewMode, setViewMode } = useViewMode('split');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const frame: number = requestAnimationFrame(() => setIsMounted(true));
    return (): void => cancelAnimationFrame(frame);
  }, []);

  return {
    content,
    setContent,
    viewMode,
    setViewMode,
    isMounted,
  };
}
