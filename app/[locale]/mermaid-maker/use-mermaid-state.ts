'use client';

import { DEFAULT_MERMAID } from '@/app/[locale]/mermaid-maker/mermaid.default';
import { useShareableState } from '@/hooks/use-shareable-state';
import { useViewMode, ViewMode } from '@/hooks/use-view-mode';
import { useEffect, useState } from 'react';

export type UseMermaidState = {
  content: string;
  setContent: (content: string) => void;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
  isMounted: boolean;
};

export function useMermaidState(): UseMermaidState {
  const [content, setContent] = useShareableState<string>('m', DEFAULT_MERMAID);
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
