import { useShareableState } from '@/hooks/use-shareable-state';
import { Base64Mode, Base64State, InputType } from './base64.types';

export type UseBase64State = {
  state: Base64State;
  updateState: (patch: Partial<Base64State>) => void;
  handleTextChange: (val: string, inputType: InputType, onResetFile: () => void) => void;
}

export function useBase64State(): UseBase64State {
  const [mode, setMode] = useShareableState<Base64Mode>('bm', 'encode', { debounceMs: 0 });
  const [inputType, setInputType] = useShareableState<InputType>('bi', 'text', { debounceMs: 0 });
  const [input, setInput] = useShareableState<string>('bc', '', { debounceMs: 500 });

  const updateState = (patch: Partial<Base64State>): void => {
    if (patch.mode) setMode(patch.mode);
    if (patch.inputType) setInputType(patch.inputType);
    if (patch.input !== undefined) setInput(patch.input);
  };

  const handleTextChange = (val: string, currentInputType: InputType, onResetFile: () => void): void => {
    setInput(val);
    if (currentInputType === 'file') {
      setInputType('text');
      onResetFile();
    }
  };

  return {
    state: { mode, inputType, input },
    updateState,
    handleTextChange,
  };
}
