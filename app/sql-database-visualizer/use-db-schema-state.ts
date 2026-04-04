import { useShareableState } from '@/hooks/use-shareable-state';
import { useViewMode, ViewMode } from '@/hooks/use-view-mode';
import { useEffect, useState } from 'react';
import { DEFAULT_SQL } from './db-schema.default';

export type UseDbSchemaState = {
  content: string;
  setContent: (content: string) => void;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  isMounted: boolean;
}

export function useDbSchemaState(): UseDbSchemaState {
  const [content, setContent] = useShareableState<string>('sql', DEFAULT_SQL);
  const { viewMode, setViewMode } = useViewMode('split');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect((): () => void => {
    const frame: number = requestAnimationFrame((): void => setIsMounted(true));
    return (): void => cancelAnimationFrame(frame);
  }, []);

  return {
    content,
    setContent,
    viewMode,
    setViewMode,
    isMounted
  };
}
