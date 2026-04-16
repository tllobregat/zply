'use client';

import { PageLayout } from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { OPEN_COMMAND_MENU_EVENT } from '@/lib/config/events';
import { useTranslations } from 'next-intl';
import { Home, Search, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

export default function NotFound(): React.ReactNode {
  const t = useTranslations('NotFound');

  const handleOpenSearch: () => void = (): void => {
    window.dispatchEvent(new CustomEvent(OPEN_COMMAND_MENU_EVENT));
  };

  return (
    <PageLayout
      header={
        <div className="flex items-center gap-3 py-4">
          <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight">404 - {t('title')}</h1>
        </div>
      }
      contentClassName="flex items-center justify-center"
    >
      <div className="max-w-md w-full text-center space-y-8 py-12 px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative inline-block"
        >
          <div className="text-9xl font-black text-zply-blue/10 absolute -inset-4 blur-xl select-none">
            404
          </div>
          <div className="text-9xl font-black text-transparent bg-clip-text zply-gradient select-none">
            404
          </div>
        </motion.div>

        <div className="space-y-4">
          <p className="text-lg text-foreground font-medium">
            {t('description')}
          </p>
          <div className="p-4 bg-island-bg/50 border border-island-border rounded-2xl italic text-muted-foreground text-sm">
            {t('funFact')}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild variant="primary" size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 w-4 h-4" />
              {t('backHome')}
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleOpenSearch}
          >
            <Search className="mr-2 w-4 h-4" />
            {t('searchTools')}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
