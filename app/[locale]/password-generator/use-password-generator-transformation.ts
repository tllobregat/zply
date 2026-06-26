import { useEffect, useState } from 'react';
import { PasswordOptions, PasswordResult } from './password-generator.types';
import { generatePassword } from './password-generator.utils';

export function usePasswordGeneratorTransformation(
  options: PasswordOptions,
  refreshTrigger: number
): PasswordResult | null {
  const [result, setResult] = useState<PasswordResult | null>(null);

  useEffect(() => {
    const frame: number = requestAnimationFrame(() => {
      setResult(generatePassword(options));
    });
    return () => cancelAnimationFrame(frame);
  }, [options, refreshTrigger]);

  return result;
}
