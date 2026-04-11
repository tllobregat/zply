import { useShareableState } from '@/hooks/use-shareable-state';

export type UseHashState = {
  text: string;
  setText: (text: string) => void;
}

export function useHashState(): UseHashState {
  const [text, setText] = useShareableState<string>('h', '', { debounceMs: 0 });

  return {
    text,
    setText,
  };
}
