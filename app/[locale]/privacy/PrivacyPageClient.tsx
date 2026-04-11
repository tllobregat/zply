'use client';

import { DashboardFooter } from '@/components/dashboard/dashboard-footer';
import { PageLayout, Breadcrumb } from '@/components/ui/layout';
import { ShieldCheck, Lock, Cookie, Database, Activity, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { motion } from 'framer-motion';

export function PrivacyPageClient(): React.ReactNode {
  const t = useTranslations('PrivacyPolicy');

  const principles = [
    {
      icon: <Database className="w-5 h-5 text-blue-500" />,
      title: t('zeroBackend'),
      description: t('zeroBackendDesc')
    },
    {
      icon: <Cookie className="w-5 h-5 text-purple-500" />,
      title: t('zeroCookies'),
      description: t('zeroCookiesDesc')
    },
    {
      icon: <Lock className="w-5 h-5 text-green-500" />,
      title: t('uriPersistence'),
      description: t('uriPersistenceDesc')
    }
  ];

  return (
    <PageLayout
      header={
        <header className="px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex flex-col min-w-0">
            <Breadcrumb items={[{ label: t('title') }]} />
            <div className="flex items-center gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-500 rounded-xl text-white border border-blue-500/20 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight break-words">{t('title')}</h1>
            </div>
          </div>
        </header>
      }
      footer={<DashboardFooter />}
      contentClassName="p-2.5 sm:p-8 bg-island-bg/5"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-w-0 max-w-4xl mx-auto space-y-10 sm:space-y-12 pb-12"
      >
        <section className="space-y-4 px-2 sm:px-0">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('description')}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {principles.map((principle, i) => (
            <div key={i} className="p-6 bg-island-bg/20 border border-island-border/30 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
              {principle.icon}
              <h3 className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                {principle.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </section>

        <section className="p-5 sm:p-8 bg-blue-500/5 border border-blue-500/20 rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Lock className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-xl font-black tracking-tight">{t('secureHash')}</h2>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>{t('secureHashDesc')}</p>
            <div className="p-4 bg-island-bg/40 rounded-xl border border-island-border/30 font-mono text-xs overflow-x-auto whitespace-nowrap min-w-0">
              https://zply.dev/markdown-editor<span className="text-blue-500 font-bold">{t('exampleHash')}</span>
            </div>
            <div className="flex justify-end">
              <a
                href="https://en.wikipedia.org/wiki/URI_fragment#Security"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
              >
                {t('fragmentIdentifier')} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2 sm:px-0">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-black tracking-tight">{t('telemetry')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed px-2 sm:px-0">
                {t('telemetryDesc')}
              </p>
              <div className="flex flex-col gap-4 p-5 sm:p-0 bg-island-bg/10 sm:bg-transparent rounded-2xl sm:rounded-none">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {t('noPii')}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t('noPiiDesc')}
                </p>
              </div>
            </div>
            <div className="p-5 sm:p-8 bg-island-bg/20 border border-island-border/30 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">
                {t('transparency')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('transparencyDesc')}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  {t('externalPrivacyPolicy')} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </PageLayout>
  );
}
