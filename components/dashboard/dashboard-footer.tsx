'use client';

import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import React from 'react';

export function DashboardFooter(): React.ReactNode {
  const t = useTranslations('Common');

  return (
    <footer
      className="px-4 sm:px-10 py-3 sm:py-5 border-t border-island-border/50 bg-island-bg/40 flex flex-col gap-3 sm:gap-5 mt-auto"
    >
      <div className="pt-3 sm:pt-6 border-t border-island-border/30 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/privacy" className="hover:text-blue-500 transition-colors">
            {t('privacyGuaranteed')}
          </Link>
          <Separator className="opacity-30" />
          <span>{t('openSource')}</span>
        </div>
        <div className="text-muted-foreground/40 sm:text-muted-foreground/60">
          ZPLY {t('toolbox')} © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
