'use client';

import { Logger } from '@/lib/logger';
import LZString from 'lz-string';
import { usePathname } from 'next/navigation';
import React, { createContext, PropsWithChildren, ReactNode, RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface ShareableStateContextType {
  isSyncing: boolean;
  registerUpdate: (key: string, value: unknown, debounceMs?: number) => void;
  syncNow: () => void;
  getLatestValue: <T>(key: string) => T;
}

const ShareableStateContext: React.Context<ShareableStateContextType | null> = createContext<ShareableStateContextType | null>(
  null
);

/**
 * Global provider for managing shareable state synchronized with the URL hash.
 * This centralizes LZ-String compression and hash updates to prevent race conditions
 * and provide a global "isSyncing" status.
 */
export function ShareableStateProvider({ children }: PropsWithChildren): ReactNode {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const pathname: string = usePathname();

  // Registry of all states currently active in the application
  const registryRef: RefObject<Record<string, unknown>> = useRef<Record<string, unknown>>({});

  // Clear registry when pathname changes (navigation between tools)
  useEffect(() => {
    registryRef.current = {};
  }, [pathname]);

  // Timeout references for different debounce levels
  const timeoutsRef: RefObject<Record<number, NodeJS.Timeout>> = useRef<Record<number, NodeJS.Timeout>>({});

  /**
   * Loads the current registry from the URL hash
   */
  const loadFromHash: () => Record<string, unknown> = useCallback((): Record<string, unknown> => {
    if (typeof window === 'undefined') return {};
    try {
      const hash: string = window.location.hash.substring(1);
      if (!hash) return {};

      const decoded: string | null = LZString.decompressFromEncodedURIComponent(hash);
      if (!decoded) return {};

      const parsed: unknown = JSON.parse(decoded);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as Record<string, unknown>;
      }
      return {};
    } catch {
      return {};
    }
  }, []);

  // Initialize registry from hash on mount
  useEffect(() => {
    registryRef.current = loadFromHash();

    // Listen for external hash changes (back button, etc.)
    const handleHashChange: () => void = (): void => {
      registryRef.current = loadFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    return (): void => window.removeEventListener('hashchange', handleHashChange);
  }, [loadFromHash]);

  /**
   * Immediately synchronizes the current registry to the URL hash
   */
  const syncNow: () => void = useCallback((): void => {
    // Clear all pending timeouts
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};

    try {
      const dataToSave: Record<string, unknown> = registryRef.current;
      const compressed: string = LZString.compressToEncodedURIComponent(JSON.stringify(dataToSave));
      const newHash: string = `#${compressed}`;

      if (typeof window !== 'undefined' && window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
      setIsSyncing(false);
    } catch (error: unknown) {
      Logger.error('Failed to sync shareable state to URL', error);
      setIsSyncing(false);
    }
  }, []);

  /**
   * Registers a state update and schedules a sync
   */
  const registerUpdate: (key: string, value: unknown, debounceMs?: number) => void = useCallback(
    (key: string, value: unknown, debounceMs = 500): void => {
      // Update local registry
      registryRef.current = { ...registryRef.current, [key]: value };

      // Immediate sync for 0ms debounce
      if (debounceMs <= 0) {
        syncNow();
        return;
      }

      // Set syncing status
      setIsSyncing(true);

      // Debounced sync
      if (timeoutsRef.current[debounceMs]) {
        clearTimeout(timeoutsRef.current[debounceMs]);
      }

      timeoutsRef.current[debounceMs] = setTimeout(() => {
        syncNow();
        delete timeoutsRef.current[debounceMs];
      }, debounceMs);
    }, [syncNow]
  );

  const getLatestValue: <T, >(key: string) => T = useCallback(<T, >(key: string): T => {
    return registryRef.current[key] as T;
  }, []);

  return (
    <ShareableStateContext.Provider
      value={{
        isSyncing,
        registerUpdate,
        syncNow,
        getLatestValue
      }}
    >
      {children}
    </ShareableStateContext.Provider>
  );
}

/**
 * Hook to access the shareable state manager
 */
export function useShareableStateSync(): ShareableStateContextType {
  const context: ShareableStateContextType | null = useContext(ShareableStateContext);
  if (!context) {
    throw new Error('useShareableStateSync must be used within a ShareableStateProvider');
  }
  return context;
}
