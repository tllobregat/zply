'use client';

import { useShareableState } from './use-shareable-state';

/**
 * Types of available view modes for tool workspaces.
 */
export type ViewMode = 'editor' | 'split' | 'preview';

/**
 * Interface for the view mode state and helpers.
 */
export interface UseViewModeReturn {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isEditor: boolean;
  isSplit: boolean;
  isPreview: boolean;
  showEditor: boolean;
  showPreview: boolean;
}

/**
 * Custom hook to manage the view mode of a tool page (Editor, Split, Preview).
 *
 * @param initialMode The initial view mode (defaults to 'split')
 * @returns An object containing the current view mode and several helpers
 */
export function useViewMode(initialMode: ViewMode = 'split'): UseViewModeReturn {
  const [viewMode, setViewMode] = useShareableState<ViewMode>('v', initialMode, { debounceMs: 0 });

  const isEditor: boolean = viewMode === 'editor';
  const isSplit: boolean = viewMode === 'split';
  const isPreview: boolean = viewMode === 'preview';

  // Computed visibility flags
  const showEditor: boolean = isEditor || isSplit;
  const showPreview: boolean = isPreview || isSplit;

  return {
    viewMode,
    setViewMode,
    isEditor,
    isSplit,
    isPreview,
    showEditor,
    showPreview,
  };
}
