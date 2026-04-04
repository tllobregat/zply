import { DEFAULT_MARKDOWN } from '@/app/markdown-editor/markdown.default';
import { useShareableState } from '@/hooks/use-shareable-state';
import { useViewMode } from '@/hooks/use-view-mode';

export type UseMarkdownState = {
  content: string;
  setContent: (content: string) => void;
  viewMode: 'editor' | 'split' | 'preview';
  setViewMode: (mode: 'editor' | 'split' | 'preview') => void;
}

export function useMarkdownState(): UseMarkdownState {
  const [content, setContent] = useShareableState<string>('md', DEFAULT_MARKDOWN);
  const { viewMode, setViewMode } = useViewMode('split');

  return {
    content,
    setContent,
    viewMode,
    setViewMode,
  };
}
