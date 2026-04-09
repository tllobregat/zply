import { Button } from '@/components/ui/button';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { FileUp, Upload, X } from 'lucide-react';
import React, { ReactNode } from 'react';
import { FileInfo } from './base64.types';

interface Base64FileUploadProps {
  fileInfo: FileInfo | null;
  theme: CategoryTheme;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
}

export function Base64FileUpload(
  {
    fileInfo,
    theme,
    onFileUpload,
    onClearFile,
  }: Base64FileUploadProps,
): ReactNode {
  return (
    <div className="p-6">
      {
        fileInfo
          ? (
            <div className={cn('flex items-center justify-between p-4 rounded-xl bg-island-bg border', theme.border)}>
              <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-lg shrink-0', theme.icon)}>
                  <FileUp className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate">{fileInfo.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest truncate">
                    {(fileInfo.size / 1024).toFixed(1)} KB • {fileInfo.type}
                  </span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-red-500/10 hover:text-red-400" 
                onClick={onClearFile}
                aria-label="Clear file"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )
          : (
            <div className="relative group cursor-pointer">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={onFileUpload}
              />
              <div className={cn(
                'flex flex-col items-center justify-center p-8 border-2 border-dashed border-island-border rounded-3xl bg-island-bg/5 transition-all',
                theme.hoverBorder
              )}>
                <Upload className={cn('w-8 h-8 text-muted-foreground/30 mb-3 transition-colors', theme.hoverText)} />
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Upload file to encode</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Images, PDFs, or any binary data</p>
              </div>
            </div>
          )
      }
    </div>
  );
}
