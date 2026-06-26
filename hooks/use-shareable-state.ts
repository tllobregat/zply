'use client';

import { decompressState } from '@/lib/url-state';
import LZString from 'lz-string';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useShareableStateSync } from './use-shareable-state-context';

interface ShareableStateOptions {
  /**
   * Delay in milliseconds before updating the URL hash.
   * Default: 500ms
   */
  debounceMs?: number;
}

/**
 * Hook to manage state that is automatically synchronized with the URL hash
 * using LZ-String compression via a global manager.
 *
 * @param key The key to use for identifying this state
 * @param initialValue The default value if no state is found in the URL
 * @param options Configuration for debounce and sync
 * @returns [state, setState] pair
 */
export function useShareableState<T>(
  key: string, 
  initialValue: T, 
  options: ShareableStateOptions = {}
): [T, Dispatch<SetStateAction<T>>] {
  const { debounceMs = 500 } = options;
  const { registerUpdate, getLatestValue } = useShareableStateSync();

  // Try to load from hash immediately during initialization
  const getInitialValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    
    // Check if the value is already in the global registry (synced by another component)
    const latest: T | undefined = getLatestValue<T>(key);
    if (latest !== undefined) return latest;

    try {
      const hash: string = window.location.hash.substring(1);
      if (!hash) return initialValue;

      // Try new format first
      const newFormatData: Record<string, unknown> | null = decompressState<Record<string, unknown>>(hash);
      if (newFormatData) {
        if (key in newFormatData) {
          return newFormatData[key] as T;
        }
        return initialValue;
      }

      // Fallback to legacy LZ-String
      const decoded: string | null = LZString.decompressFromEncodedURIComponent(hash);
      if (!decoded) return initialValue;

      const parsed: unknown = JSON.parse(decoded);

      if (typeof parsed === 'object' && parsed !== null) {
        if (key in (parsed as Record<string, unknown>)) {
          return (parsed as Record<string, unknown>)[key] as T;
        }
        return initialValue;
      }

      return parsed as T;
    } catch {
      return initialValue;
    }
  }, [key, initialValue, getLatestValue]);

  const [state, setStateInternal] = useState<T>(getInitialValue);

  // Still keep the effect to sync hash changes (back button, manual URL changes)
  useEffect(() => {
    const handleHashChange = (): void => {
      const newValue: T = getInitialValue();
      setStateInternal((prev: T): T => {
        // Use a stable comparison to avoid jumps
        if (JSON.stringify(prev) === JSON.stringify(newValue)) {
          return prev;
        }
        return newValue;
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return (): void => window.removeEventListener('hashchange', handleHashChange);
  }, [getInitialValue]);

  // Update hash via the global manager when state changes
  useEffect(() => {
    registerUpdate(key, state, debounceMs);
  }, [key, state, debounceMs, registerUpdate]);

  // Update internal state
  const setState: (newValue: T | ((prev: T) => T)) => void = useCallback((newValue: T | ((prev: T) => T)): void => {
    setStateInternal((prev: T): T => {
      const updatedValue: T = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
      if (JSON.stringify(prev) === JSON.stringify(updatedValue)) {
        return prev;
      }
      return updatedValue;
    });
  }, []);

  return [state, setState];
}
