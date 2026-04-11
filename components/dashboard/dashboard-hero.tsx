'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Link } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';

export function DashboardHero(): React.ReactNode {
  const t = useTranslations('Index');

  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-foreground">
          {t.rich('title', {
            span: (chunks) => <span className="text-zply-blue">{chunks}</span>
          })}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
          {t('description')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-4 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-green-500/5 flex items-center justify-center text-green-500/60 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase text-foreground mb-0.5">{t('features.private')}</h3>
            <p className="text-xs text-muted-foreground leading-tight font-medium tracking-wider">{t('features.privateDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-orange-500/5 flex items-center justify-center text-orange-500/60 shrink-0">
            <Link className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase text-foreground mb-0.5">{t('features.shareable')}</h3>
            <p className="text-xs text-muted-foreground leading-tight font-medium tracking-wider">{t('features.shareableDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-blue-500/5 flex items-center justify-center text-blue-500/60 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase text-foreground mb-0.5">{t('features.fast')}</h3>
            <p className="text-xs text-muted-foreground leading-tight font-medium tracking-wider">{t('features.fastDesc')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
