import { getDefaultMarkdown } from '@/app/[locale]/markdown-editor/markdown.default';
import { useShareableState } from '@/hooks/use-shareable-state';
import { useViewMode } from '@/hooks/use-view-mode';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export type UseMarkdownState = {
  content: string;
  setContent: (content: string) => void;
  viewMode: 'editor' | 'split' | 'preview';
  setViewMode: (mode: 'editor' | 'split' | 'preview') => void;
}

export function useMarkdownState(): UseMarkdownState {
  const t = useTranslations('Tools');
  const defaultMarkdown = useMemo(() => getDefaultMarkdown(t), [t]);
  const [content, setContent] = useShareableState<string>('md', defaultMarkdown);
  const { viewMode, setViewMode } = useViewMode('split');

  return {
    content,
    setContent,
    viewMode,
    setViewMode,
  };
}
