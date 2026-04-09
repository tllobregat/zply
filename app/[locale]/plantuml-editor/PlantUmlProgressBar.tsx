import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface PlantUmlProgressBarProps {
  progress: number;
  theme: { bg: string };
}

export function PlantUmlProgressBar({ progress, theme }: PlantUmlProgressBarProps): React.ReactNode {
  return (
    <AnimatePresence>
      {
        progress > 0 && progress < 100
        && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-1 bg-white/5 z-50"
          >
            <motion.div
              className={cn('h-full', theme.bg)}
              style={{
                width: `${progress}%`,
              }}
            />
          </motion.div>
        )
      }
    </AnimatePresence>
  );
}
