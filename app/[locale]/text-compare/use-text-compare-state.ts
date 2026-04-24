import { useTranslations } from 'next-intl';
import { useShareableState } from '@/hooks/use-shareable-state';
import { useViewMode } from '@/hooks/use-view-mode';
import { DiffMode, TextCompareState, ViewMode } from './text-compare.types';
import { useCallback } from 'react';

export type UseTextCompareState = {
  state: TextCompareState;
  updateOriginal: (val: string) => void;
  updateModified: (val: string) => void;
  updateDiffMode: (mode: DiffMode) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function useTextCompareState(): UseTextCompareState {
  const t = useTranslations('Tools.text-compare');
  const defaultState: TextCompareState = {
    original: t('default.original'),
    modified: t('default.modified'),
    diffMode: 'split'
  };

  const [state, setState] = useShareableState<TextCompareState>('diff', defaultState);
  const { viewMode, setViewMode } = useViewMode('split') as unknown as { viewMode: ViewMode; setViewMode: (mode: ViewMode) => void };

  const updateOriginal = useCallback((val: string): void => {
    setState((prev: TextCompareState) => ({ ...prev, original: val }));
  }, [setState]);

  const updateModified = useCallback((val: string): void => {
    setState((prev: TextCompareState) => ({ ...prev, modified: val }));
  }, [setState]);

  const updateDiffMode = useCallback((mode: DiffMode): void => {
    setState((prev: TextCompareState) => ({ ...prev, diffMode: mode }));
  }, [setState]);

  return {
    state,
    updateOriginal,
    updateModified,
    updateDiffMode,
    viewMode,
    setViewMode,
  };
}
