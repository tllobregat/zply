'use client';

import { Logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronUp, Copy, Terminal, X } from 'lucide-react';
import LZString from 'lz-string';
import React, { useEffect, useState } from 'react';

function DevToolButton(): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hashContent, setHashContent] = useState<unknown>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const updateHash = (): void => {
      try {
        const hash: string = window.location.hash.substring(1);
        if (!hash) {
          setHashContent(null);
          return;
        }
        const decoded: string = LZString.decompressFromEncodedURIComponent(hash);
        if (decoded) {
          setHashContent(JSON.parse(decoded));
        } else {
          setHashContent(null);
        }
      } catch (e) {
        Logger.error('Failed to decode hash', e);
        setHashContent({ error: 'Failed to decode hash' });
      }
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);

    // Periodically check if hash changed without hashchange event (e.g. via replaceState)
    const interval: ReturnType<typeof setInterval> = setInterval(updateHash, 1000);

    return (): void => {
      window.removeEventListener('hashchange', updateHash);
      clearInterval(interval);
    };
  }, []);

  const handleCopy = (): void => {
    navigator.clipboard.writeText(JSON.stringify(hashContent, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-9999 flex flex-col items-end gap-2 font-mono">
      {isOpen && (
        <div className={cn(
          'glass-island bg-black/90 border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300',
          isExpanded ? 'w-125 h-150' : 'w-80 h-96'
        )}>
          <div className="p-3 border-b border-emerald-500/20 flex items-center justify-between bg-emerald-500/5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">URI State Inspector</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-emerald-500/20 rounded-md transition-colors text-emerald-400/60 hover:text-emerald-400"
                title="Copy JSON"
                aria-label="Copy JSON"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-emerald-500/20 rounded-md transition-colors text-emerald-400/60 hover:text-emerald-400"
                aria-label={isExpanded ? "Shrink inspector" : "Expand inspector"}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-emerald-500/20 rounded-md transition-colors text-emerald-400/60 hover:text-emerald-400"
                aria-label="Close inspector"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 custom-scrollbar text-[11px]">
            {hashContent ? (
              <pre className="text-emerald-300/90 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify(hashContent, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 opacity-40 italic">
                <Terminal className="w-8 h-8" />
                <span>No state in URI hash</span>
              </div>
            )}
          </div>

          <div className="p-2 bg-emerald-500/5 border-t border-emerald-500/10 text-[9px] text-emerald-500/40 flex justify-between px-4">
            <span>PROXIED_ENV: {process.env.NODE_ENV}</span>
            <span>{hashContent ? `${JSON.stringify(hashContent).length} bytes` : '0 bytes'}</span>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 glass-island bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-full shadow-lg text-emerald-400 transition-all hover:scale-110 active:scale-95 group"
          title="Open State Inspector"
          aria-label="Open State Inspector"
        >
          <Terminal className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
}

export function DevTool(): React.ReactNode {

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <DevToolButton />;
}
