import { useShareableState } from '@/hooks/use-shareable-state';
import { DEFAULT_STATE } from './tz-conv.default';
import { TzConvState } from './tz-conv.types';
import { useEffect } from 'react';

export type UseTzConvState = {
  state: TzConvState;
  updateState: (patch: Partial<TzConvState>) => void;
  setState: (state: TzConvState) => void;
}

export function useTzConvState(): UseTzConvState {
  const [state, setState] = useShareableState<TzConvState>('tz', DEFAULT_STATE, { debounceMs: 0 });

  // Live Mode: Update reference time every second
  useEffect(() => {
    if (!state.liveMode) return;
    
    const interval: NodeJS.Timeout = setInterval(() => {
      setState((prev: TzConvState) => ({ ...prev, referenceTimestamp: Date.now() }));
    }, 1000);
    
    return (): void => clearInterval(interval);
  }, [state.liveMode, setState]);

  const updateState = (patch: Partial<TzConvState>): void => {
    setState((prev: TzConvState) => ({ ...prev, ...patch }));
  };

  return {
    state,
    updateState,
    setState,
  };
}
