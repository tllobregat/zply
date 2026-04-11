import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { History, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';
import { CategoryTheme } from '@/lib/config/categories';

interface TzConvToolbarProps {
  liveMode: boolean;
  onToggleLiveMode: () => void;
  onAddClick: () => void;
  theme: CategoryTheme;
}

export function TzConvToolbar(
  {
    liveMode,
    onToggleLiveMode,
    onAddClick,
    theme,
  }: TzConvToolbarProps,
): ReactNode {
  const t = useTranslations('Tools.timezone-converter');

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center bg-island-bg border border-island-border rounded-2xl shadow-inner px-1 h-10">
        <Button
          onClick={onToggleLiveMode}
          variant={liveMode ? 'active' : 'tab'}
          size="sm"
          className={cn('gap-2', liveMode && theme.text)}
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{liveMode ? t('liveMode') : t('fixedTime')}</span>
        </Button>
      </div>
      <Separator className="h-6" />
      <Button
        onClick={onAddClick}
        variant="active"
        size="sm"
        className={cn('gap-2 rounded-xl', theme.text)}
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="hidden md:inline">{t('addTimezone')}</span>
      </Button>
    </div>
  );
}
