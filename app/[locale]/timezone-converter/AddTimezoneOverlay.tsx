import { Button } from '@/components/ui/button';
import { CategoryTheme } from '@/lib/config/categories';
import { TzMetadata } from '@/lib/data/timezones';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

interface AddTimezoneOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  search: string;
  onSearchChange: (val: string) => void;
  filteredTz: TzMetadata[];
  onAdd: (name: string) => void;
  theme: CategoryTheme;
}

export function AddTimezoneOverlay(
  {
    isOpen,
    onClose,
    search,
    onSearchChange,
    filteredTz,
    onAdd,
    theme,
  }: AddTimezoneOverlayProps,
): ReactNode {
  const t = useTranslations('Tools.timezone-converter');

  return (
    <AnimatePresence>
      {
        isOpen
        && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-island-card border border-island-border rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black uppercase tracking-tight">{t('addTimezone')}</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose} 
                    className="rounded-full"
                    aria-label="Close overlay"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    autoFocus
                    placeholder={t('searchPlaceholder')}
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onSearchChange(e.target.value)}
                    className={cn(
                      'w-full h-14 pl-12 pr-4 bg-island-bg border border-island-border rounded-2xl outline-none transition-all font-medium',
                      `focus:border-${theme.text.split('-')[1]}-500/50`
                    )}
                  />
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {
                    filteredTz.map((tz: TzMetadata) => (
                      <button
                        key={tz.id}
                        onClick={(): void => onAdd(tz.id)}
                        className={cn(
                          'w-full flex items-center justify-between p-4 rounded-2xl group transition-all text-left',
                          `hover:bg-${theme.text.split('-')[1]}-500/10`
                        )}
                        aria-label={`Add ${tz.name} timezone`}
                      >
                        <div className="flex flex-col">
                          <span className={cn('text-sm font-bold transition-colors truncate', theme.hoverText)}>{tz.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{tz.countryName}</span>
                        </div>
                        <ArrowRight
                          className={cn('w-4 h-4 text-muted-foreground transform group-hover:translate-x-1 transition-all shrink-0', theme.hoverText)} />
                      </button>
                    ))
                  }
                  {
                    filteredTz.length === 0
                    && (
                      <div className="py-10 text-center text-muted-foreground">
                        <p className="text-sm">{t('noResults', { search })}</p>
                      </div>
                    )
                  }
                </div>
              </div>
            </motion.div>
          </div>
        )
      }
    </AnimatePresence>
  );
}
