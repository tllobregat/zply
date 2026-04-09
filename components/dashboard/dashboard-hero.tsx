'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Globe } from 'lucide-react';
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
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto font-medium">
          {t('description')}
          <span className="block mt-1 font-bold text-foreground/80 italic">{t('browserPrivacy')}</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-island-bg/40 border border-island-border/50 shadow-sm backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-foreground">{t('features.private')}</h3>
            <p className="text-[9px] text-muted-foreground leading-tight font-medium">{t('features.privateDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-island-bg/40 border border-island-border/50 shadow-sm backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-foreground">{t('features.offline')}</h3>
            <p className="text-[9px] text-muted-foreground leading-tight font-medium">{t('features.offlineDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-island-bg/40 border border-island-border/50 shadow-sm backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-foreground">{t('features.fast')}</h3>
            <p className="text-[9px] text-muted-foreground leading-tight font-medium">{t('features.fastDesc')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
