'use client';

import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import { LargeDataPlaceholder } from './LargeDataPlaceholder';

export interface Base64PreviewProps {
  result: string;
  error: string | null;
  isImage: boolean;
  imageType: string | null;
  isTooLarge: boolean;
  onCopy: () => void;
  onDownload: () => void;
  theme: CategoryTheme;
}

export function Base64Preview(
  {
    result,
    error,
    isImage,
    imageType,
    isTooLarge,
    onCopy,
    onDownload,
    theme
  }: Base64PreviewProps,
): ReactNode {
  if (error) {
    return (
      <motion.div
        key="error"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex flex-col items-center justify-center h-full text-red-400 gap-4 p-6 md:p-8 text-center overflow-y-auto custom-scrollbar"
      >
        <div className="flex flex-col items-center justify-center min-h-fit">
          <AlertCircle className="w-10 h-10 md:w-12 md:h-12 opacity-50 mb-2" />
          <div className="space-y-1">
            <p className="font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Transformation Error</p>
            <p className="text-xs md:text-sm font-medium max-w-xs">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isImage && imageType) {
    return (
      <motion.div
        key="image-preview"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col items-center justify-center p-8 overflow-auto custom-scrollbar"
      >
        <div className="relative group">
          <div className={cn('absolute -inset-4 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity', theme.bg, 'opacity-20')} />
          {
            imageType === 'image/svg+xml'
              ? (
                <div
                  className="relative max-w-full max-h-100 shadow-2xl rounded-lg bg-white p-4"
                  dangerouslySetInnerHTML={{ __html: result }}
                />
              )
              : (
                <Image
                  src={result}
                  alt="Decoded Preview"
                  className="relative max-w-full max-h-100 shadow-2xl rounded-lg border border-white/10"
                />
              )
          }
        </div>
        <div className="mt-6 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Preview Mode</span>
          <span className={cn('text-xs font-bold', theme.text)}>{imageType}</span>
        </div>
      </motion.div>
    );
  }

  if (isTooLarge) {
    return (
      <motion.div
        key="large-data"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full"
      >
        <LargeDataPlaceholder
          length={result.length}
          onCopy={onCopy}
          onDownload={onDownload}
          theme={theme}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <textarea
        readOnly
        value={result}
        className={cn(
          'w-full h-full p-6 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed custom-scrollbar',
          theme.selection
        )}
        placeholder="Waiting for input..."
      />
    </motion.div>
  );
}
