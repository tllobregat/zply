'use client';

import { RefObject, useCallback, useRef, useState } from 'react';

export function useCopyToClipboard(timeout: number = 2000): {
  copy: (text: string, id?: string) => void;
  isCopied: (id?: string) => boolean;
  copiedId: string | null;
  setCopied: (id?: string) => void;
} {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timeoutRef: RefObject<ReturnType<typeof setTimeout> | null> = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setCopied: (id?: string) => void = useCallback((id: string = 'default'): void => {
    setCopiedId(id);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout((): void => {
      setCopiedId(null);
      timeoutRef.current = null;
    }, timeout);
  }, [timeout]);

  const fallbackCopy: (text: string, onComplete: () => void) => void = useCallback((text: string, onComplete: () => void): void => {
    const textArea: HTMLTextAreaElement = document.createElement('textarea');
    textArea.value = text;
    
    // Ensure it's not visible or disruptive
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      onComplete();
    } catch {
      // If even fallback fails, we can't do much
    }

    document.body.removeChild(textArea);
  }, []);

  const copy: (text: string, id?: string) => void = useCallback((text: string, id: string = 'default'): void => {
    if (typeof window === 'undefined') {
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => setCopied(id))
        .catch((err: Error): void => {
          // Fallback if Clipboard API fails (e.g., NotAllowedError)
          if (err.name === 'NotAllowedError') {
            // Permission denied or missing user gesture - try fallback
            fallbackCopy(text, () => setCopied(id));
          } else {
            // Log other unexpected clipboard errors
            console.error('Clipboard API error:', err);
            fallbackCopy(text, () => setCopied(id));
          }
        });
    } else {
      fallbackCopy(text, () => setCopied(id));
    }
  }, [setCopied, fallbackCopy]);

  const isCopied: (id?: string) => boolean = useCallback((id: string = 'default'): boolean => {
    return copiedId === id;
  }, [copiedId]);

  return { copy, isCopied, copiedId, setCopied };
}
