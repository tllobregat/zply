import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/ui/copy-button';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

interface EpochResultCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  onCopy: () => void;
  isCopied: boolean;
  theme: CategoryTheme;
}

export function EpochResultCard(
  {
    icon,
    label,
    value,
    onCopy,
    isCopied,
    theme,
  }: EpochResultCardProps,
): ReactNode {
  const tCommon = useTranslations('Common');

  return (
    <div
      className={cn('glass-island p-8 rounded-4xl border border-island-border bg-island-card space-y-4 group transition-all', theme.hoverBorder)}>
      <div className={cn('flex items-center gap-3', theme.text)}>
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-xl font-bold leading-tight min-h-12">
        {value}
      </p>
      <CopyButton
        onCopy={onCopy}
        isCopied={isCopied}
        copyText={tCommon('share')}
        copiedText={tCommon('copied')}
        disabled={isCopied}
        className={cn('-ml-3', !isCopied && theme.hoverText)}
      />
    </div>
  );
}
