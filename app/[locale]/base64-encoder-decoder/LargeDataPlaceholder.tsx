'use client';

import { Button } from '@/components/ui/button';
import { getCategoryClasses } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { Binary, Copy, Download } from 'lucide-react';
import React, { ReactNode } from 'react';

interface LargeDataPlaceholderProps {
  length: number;
  onCopy: () => void;
  onDownload: () => void;
  theme: ReturnType<typeof getCategoryClasses>;
}

export function LargeDataPlaceholder(
  {
    length,
    onCopy,
    onDownload,
    theme
  }: LargeDataPlaceholderProps,
): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 md:p-8 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col items-center justify-center min-h-fit">
        <div className={cn('p-4 md:p-6 rounded-full mb-4 md:mb-6', theme.icon)}>
          <Binary className="w-8 h-8 md:w-12 md:h-12" />
        </div>
        <h3 className="text-lg md:text-xl font-black mb-2 uppercase tracking-tight">Output too large</h3>
        <p className="text-muted-foreground max-w-xs mb-6 md:mb-8 text-xs md:text-sm">
          The result contains <strong>{(length / 1024).toFixed(1)} KB</strong> of data.
          Rendering this much text would slow down your browser.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3">
          <Button onClick={onCopy} variant="secondary" className="rounded-xl gap-2 h-9 md:h-10 text-xs md:text-sm">
            <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" /> Copy All
          </Button>
          <Button onClick={onDownload} className={cn('rounded-xl gap-2 text-white h-9 md:h-10 text-xs md:text-sm', theme.bg, `hover:opacity-90`)}>
            <Download className="w-3.5 h-3.5 md:w-4 md:h-4" /> Download
          </Button>
        </div>
      </div>
    </div>
  );
}
