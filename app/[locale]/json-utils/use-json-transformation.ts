import { Logger } from '@/lib/logger';
import { useMemo } from 'react';
import { JsonValue } from './types';

export type UseJsonTransformation = {
  parsedContent: JsonValue | null;
  error: string | null;
}

export function useJsonTransformation(content: string): UseJsonTransformation {
  const { parsedContent, error } = useMemo<{ parsedContent: JsonValue | null, error: string | null }>(() => {
    if (!content.trim()) {
      return { parsedContent: null, error: null };
    }
    try {
      return { parsedContent: JSON.parse(content) as JsonValue, error: null };
    } catch (err: unknown) {
      Logger.error('JSON parsing failed', err);
      return { parsedContent: null, error: (err as Error).message };
    }
  }, [content]);

  return {
    parsedContent,
    error,
  };
}
