'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CategoryTheme } from '@/lib/config/categories';

interface ErrorOverlayProps {
  error: string | null;
  theme: CategoryTheme;
}

export function ErrorOverlay({ error, theme }: ErrorOverlayProps): ReactNode {
  return (
    <AnimatePresence>
      {
        error
        && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={cn(
              "absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 text-white rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md z-50 border",
              theme.bg,
              theme.border.replace('500/20', '400/30')
            )}
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
          </motion.div>
        )
      }
    </AnimatePresence>
  );
}
