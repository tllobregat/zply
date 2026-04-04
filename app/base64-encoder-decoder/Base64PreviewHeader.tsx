import { Button } from '@/components/ui/button';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { Download, FileText, ImageIcon } from 'lucide-react';
import React, { ReactNode } from 'react';
import { FileInfo } from './base64.types';
import { CopyButton } from '@/components/ui/copy-button';

interface Base64PreviewHeaderProps {
  isImage: boolean;
  fileInfo: FileInfo | null;
  theme: CategoryTheme;
  result: string;
  isCopied: boolean;
  onDownload: () => void;
  onCopy: (t: string) => void;
}

export function Base64PreviewHeader(
  {
    isImage,
    fileInfo,
    theme,
    result,
    isCopied,
    onDownload,
    onCopy,
  }: Base64PreviewHeaderProps,
): ReactNode {
  return (
    <div className="flex items-center justify-between p-4 border-b border-island-border bg-island-card/50">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Result</span>
        {
          isImage
          && (
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
              <ImageIcon className="w-3 h-3" />
              Image Detected
            </div>
          )
        }
        {
          fileInfo
          && (
            <div className={cn('flex items-center gap-2 px-2 py-1 rounded text-[9px] font-bold max-w-30 sm:max-w-50', theme.icon)}>
              <FileText className="w-3 h-3 shrink-0" />
              <span className="truncate">{fileInfo.name}</span>
            </div>
          )
        }
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 rounded-xl"
          onClick={onDownload}
          disabled={!result}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <CopyButton
          className="h-8 gap-2 rounded-xl"
          onCopy={(): void => onCopy(result)}
          isCopied={isCopied}
          disabled={!result}
        />
      </div>
    </div>
  );
}
