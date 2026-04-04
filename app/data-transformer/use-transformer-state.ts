import { DataFormat, TransformerState } from '@/app/data-transformer/transformer.types';
import { useShareableState } from '@/hooks/use-shareable-state';

type UseTransformerState = {
  state: TransformerState;
  updateState: (patch: Partial<TransformerState>) => void;
  swapFormats: () => void;
}

export function useTransformerState(): UseTransformerState {
  const [formats, setFormats] = useShareableState<{ f: DataFormat, t: DataFormat }>('tf', { f: 'json', t: 'yaml' }, { debounceMs: 0 });
  const [input, setInput] = useShareableState<string>('ti', '', { debounceMs: 500 });

  const state: TransformerState = {
    f: formats.f,
    t: formats.t,
    i: input,
  };

  const updateState = (patch: Partial<TransformerState>): void => {
    if (patch.f || patch.t) {
      setFormats((prev) => ({ ...prev, f: patch.f ?? prev.f, t: patch.t ?? prev.t }));
    }
    if (patch.i !== undefined) {
      setInput(patch.i);
    }
  };

  const swapFormats = (): void => {
    updateState({ f: state.t, t: state.f });
  };

  return {
    state,
    updateState,
    swapFormats,
  };
}
