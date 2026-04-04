'use client';

import { useCallback, useEffect, useState } from 'react';
import { Logger } from '@/lib/logger';

export type UsePinnedTools = {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
}

export function usePinnedTools(): UsePinnedTools {
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // Load pinned tools from localStorage
  useEffect(() => {
    const saved: string | null = localStorage.getItem('zply-pinned-tools');
    if (saved) {
      const frame: number = requestAnimationFrame(() => {
        try {
          setPinnedIds(JSON.parse(saved) as string[]);
        } catch (error: unknown) {
          Logger.error('Failed to parse pinned tools', error);
        }
      });
      return (): void => cancelAnimationFrame(frame);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === 'zply-pinned-tools' && e.storageArea === localStorage) {
        try {
          const newPinnedIds: string[] = JSON.parse(e.newValue ?? '[]');
          requestAnimationFrame(() => setPinnedIds(newPinnedIds));
        } catch (error: unknown) {
          Logger.error('Failed to parse pinned tools from storage event', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return (): void => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const togglePin: (id: string) => void = useCallback((id: string): void => {
    setPinnedIds((prev: string[]): string[] => {
      const isPinned: boolean = prev.includes(id);
      const newPinned: string[] = isPinned
        ? prev.filter((pid: string): boolean => pid !== id)
        : [...prev, id];

      localStorage.setItem('zply-pinned-tools', JSON.stringify(newPinned));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'zply-pinned-tools',
          newValue: JSON.stringify(newPinned),
          storageArea: localStorage,
        })
      );
      return newPinned;
    });
  }, []);

  const isPinned: (id: string) => boolean = useCallback((id: string): boolean => {
    return pinnedIds.includes(id);
  }, [pinnedIds]);

  return { pinnedIds, togglePin, isPinned };
}
