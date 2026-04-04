import { useShareableState } from '@/hooks/use-shareable-state';

export type UseEpochState = {
  timestamp: string;
  setTimestamp: (ts: string) => void;
}

export function useEpochState(): UseEpochState {
  const [timestamp, setTimestamp] = useShareableState<string>('t', '0', { debounceMs: 0 });

  return {
    timestamp,
    setTimestamp,
  };
}
