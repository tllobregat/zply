import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { getCategoryClasses } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import dayjs from '@/lib/dayjs';
import { motion } from 'framer-motion';
import { CalendarDays, Trash2 } from 'lucide-react';
import React, { ReactNode } from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { Button } from '@/components/ui/button';

interface TimezoneCardProps {
  timezone: string;
  timestamp: number;
  isReference?: boolean;
  onRemove: () => void;
  theme: ReturnType<typeof getCategoryClasses>;
}

export default function TimezoneCard({ timezone, timestamp, isReference, onRemove, theme }: TimezoneCardProps): ReactNode {
  const { copy, isCopied } = useCopyToClipboard();
  const time: dayjs.Dayjs = dayjs(timestamp).tz(timezone);

  const city: string = timezone.split('/').pop()?.replace('_', ' ') || timezone;
  const region: string = timezone.includes('/') ? timezone.split('/')[0] : '';

  const formatTime: string = time.format('HH:mm');
  const formatSeconds: string = time.format(':ss');
  const formatDate: string = time.format('ddd, MMM D, YYYY');
  const formatOffset: string = time.format('Z');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'group relative p-6 md:p-8 rounded-4xl bg-island-card border transition-all duration-500',
        isReference ? theme.border : 'border-island-border hover:border-island-border/80',
        'hover:shadow-2xl',
        isReference && theme.shadow.replace('20', '10')
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{region}</span>
          <h3 className={cn('text-lg font-black tracking-tight truncate transition-colors', theme.hoverText)}>{city}</h3>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton
            variant="ghost"
            size="icon"
            onCopy={(): void => copy(time.format())}
            isCopied={isCopied()}
            showText={false}
            className={cn('h-10 w-10 rounded-xl transition-colors', !isCopied() && theme.hoverText, 'hover:bg-white/5')}
          />
          {
            !isReference
            && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )
          }
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className={cn('text-3xl md:text-4xl font-black font-mono tracking-tighter', theme.selection)}>
          {formatTime}
          <span className="text-muted-foreground/30 text-xl md:text-2xl">{formatSeconds}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground font-medium text-xs">
          <CalendarDays className="w-3 h-3 opacity-50" />
          <span>{formatDate}</span>
          <span className="px-1.5 py-0.5 rounded-md bg-island-bg border border-island-border text-[10px] font-black">{formatOffset}</span>
        </div>
      </div>

      {/* Background decoration */}
      <div className={cn('absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity', theme.bg)} />
    </motion.div>
  );
}
