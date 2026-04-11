import { useTranslations } from 'next-intl';
import { useShareableState } from '@/hooks/use-shareable-state';

export type JsonViewMode = 'editor' | 'tree';

export type UseJsonState = {
  content: string;
  setContent: (val: string) => void;
  viewMode: JsonViewMode;
  setViewMode: (val: JsonViewMode) => void;
};

export function useJsonState(): UseJsonState {
  const t = useTranslations('Tools.json-utils');
  const [content, setContent] = useShareableState<string>('json', t.raw('default'));
  const [viewMode, setViewMode] = useShareableState<JsonViewMode>('jv', 'editor', { debounceMs: 0 });

  return {
    content,
    setContent,
    viewMode,
    setViewMode,
  };
}
