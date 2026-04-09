import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import dayjs from '@/lib/dayjs';
import { CalendarDays, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

interface TimezoneHeroProps {
  referenceTimestamp: number;
  liveMode: boolean;
  theme: CategoryTheme;
}

export function TimezoneHero(
  {
    referenceTimestamp,
    liveMode,
    theme,
  }: TimezoneHeroProps,
): ReactNode {
  const t = useTranslations('Tools.timezone-converter');

  return (
    <div className="relative group">
      <div className={cn('absolute -inset-1 rounded-4xl blur opacity-10 group-hover:opacity-20 transition duration-1000', theme.bg)}></div>
      <div
        className="relative p-10 md:p-16 rounded-4xl bg-island-card border border-island-border flex flex-col items-center text-center space-y-6">
        <div className="space-y-2 w-full flex flex-col items-center">
          <span className={cn('text-[10px] font-black uppercase tracking-[0.3em]', theme.text)}>{t('referenceTime')}</span>
          <div className="relative w-full">
            <input
              type="text"
              readOnly
              value={dayjs(referenceTimestamp).format('HH:mm:ss')}
              className={cn(
                'w-full bg-transparent border-none p-0 text-5xl md:text-6xl font-black font-mono tracking-tighter outline-none transition-colors cursor-pointer text-center',
                theme.selection,
                theme.hoverText
              )}
            />
          </div>
          <div className="flex items-center justify-center gap-3 text-muted-foreground font-bold">
            <CalendarDays className="w-4 h-4 opacity-50" />
            <span>{dayjs(referenceTimestamp).format('dddd, MMMM D, YYYY')}</span>
          </div>
        </div>

        {
          liveMode
          && (
            <div
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              <Zap className="w-3 h-3 fill-current" /> {t('liveSyncActive')}
            </div>
          )
        }
      </div>
    </div>
  );
}
