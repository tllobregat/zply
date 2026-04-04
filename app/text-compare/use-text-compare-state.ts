import { useShareableState } from '@/hooks/use-shareable-state';
import { useViewMode, ViewMode } from '@/hooks/use-view-mode';
import { DEFAULT_STATE } from './text-compare.default';
import { TextCompareState } from './text-compare.types';

export type UseTextCompareState = {
  state: TextCompareState;
  updateOriginal: (val: string) => void;
  updateModified: (val: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function useTextCompareState(): UseTextCompareState {
  const [state, setState] = useShareableState<TextCompareState>('diff', DEFAULT_STATE);
  const { viewMode, setViewMode } = useViewMode('split');

  const updateOriginal = (val: string): void => {
    setState((prev: TextCompareState) => ({ ...prev, original: val }));
  };

  const updateModified = (val: string): void => {
    setState((prev: TextCompareState) => ({ ...prev, modified: val }));
  };

  return {
    state,
    updateOriginal,
    updateModified,
    viewMode,
    setViewMode,
  };
}
