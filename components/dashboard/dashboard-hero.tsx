'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Link as LinkIcon, ChevronDown } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

interface DashboardHeroProps {
  onExplore?: () => void;
}

export function DashboardHero({ onExplore }: DashboardHeroProps): React.ReactNode {
  const t = useTranslations('Index');

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3 text-foreground">
          {t.rich('title', {
            span: (chunks) => <span className="text-zply-blue">{chunks}</span>
          })}
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto font-medium mb-8">
          {t('description')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-4 px-4 py-2 group transition-all">
          <div className="w-10 h-10 rounded-full bg-green-500/5 flex items-center justify-center text-green-500/60 shrink-0 transition-all group-hover:bg-green-500/10 group-hover:text-green-500 shadow-[inset_0_0_0_1px_rgba(34,197,94,0.05)] group-hover:shadow-[inset_0_0_0_1px_rgba(34,197,94,0.1)]">
            <Shield className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase text-foreground mb-0.5">{t('features.private')}</h3>
            <p className="text-xs text-muted-foreground leading-tight font-medium tracking-wider">{t('features.privateDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-2 group transition-all">
          <div className="w-10 h-10 rounded-full bg-orange-500/5 flex items-center justify-center text-orange-500/60 shrink-0 transition-all group-hover:bg-orange-500/10 group-hover:text-orange-500 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.05)] group-hover:shadow-[inset_0_0_0_1px_rgba(249,115,22,0.1)]">
            <LinkIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase text-foreground mb-0.5">{t('features.shareable')}</h3>
            <p className="text-xs text-muted-foreground leading-tight font-medium tracking-wider">{t('features.shareableDesc')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-2 group transition-all">
          <div className="w-10 h-10 rounded-full bg-blue-500/5 flex items-center justify-center text-blue-500/60 shrink-0 transition-all group-hover:bg-blue-500/10 group-hover:text-blue-500 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.05)] group-hover:shadow-[inset_0_0_0_1px_rgba(59,130,246,0.1)]">
            <Zap className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase text-foreground mb-0.5">{t('features.fast')}</h3>
            <p className="text-xs text-muted-foreground leading-tight font-medium tracking-wider">{t('features.fastDesc')}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mt-6"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={onExplore}
          className="group rounded-full px-8 py-6 border-zply-blue/20 hover:border-zply-blue/50 hover:bg-zply-blue/5 text-zply-blue transition-all"
        >
          <ChevronDown className="w-4 h-4 mr-2 animate-bounce group-hover:animate-none" />
          {t('browseCategories')}
        </Button>
      </motion.div>
    </div>
  );
}
