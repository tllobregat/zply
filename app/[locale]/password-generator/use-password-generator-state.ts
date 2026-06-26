import { useShareableState } from '@/hooks/use-shareable-state';
import { useState } from 'react';
import { DEFAULT_PASSWORD_OPTIONS } from './password-generator.default';
import { PasswordOptions } from './password-generator.types';

export type UsePasswordGeneratorState = {
  options: PasswordOptions;
  setOptions: (options: PasswordOptions) => void;
  updateOption: <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => void;
  refreshTrigger: number;
  regenerate: () => void;
};

export function usePasswordGeneratorState(): UsePasswordGeneratorState {
  const [options, setOptions] = useShareableState<PasswordOptions>('o', DEFAULT_PASSWORD_OPTIONS);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]): void => {
    setOptions((prev: PasswordOptions) => ({
      ...prev,
      [key]: value,
    }));
  };

  const regenerate = (): void => {
    setRefreshTrigger((prev: number) => prev + 1);
  };

  return {
    options,
    setOptions,
    updateOption,
    refreshTrigger,
    regenerate,
  };
}
