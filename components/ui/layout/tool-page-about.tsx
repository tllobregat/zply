import { ToolConfig } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ToolPageAboutProps {
  toolConfig: ToolConfig;
  title: string;
}

export const ToolPageAbout = React.forwardRef<HTMLElement, ToolPageAboutProps>(({
  toolConfig,
  title,
}, ref) => {
  const t = useTranslations('Tools');
  const tCommon = useTranslations('Common');

  return (
    <section ref={ref} className="px-6 py-12 sm:py-20 max-w-4xl mx-auto w-full space-y-12 shrink-0">
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground/90">
          {tCommon('aboutTitle', { title })}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(`${toolConfig.id}.description`)} {tCommon('aboutDescription')}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h3 className="text-lg font-black tracking-widest uppercase text-zply-blue">
            {tCommon('howToUse')}
          </h3>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-black text-foreground/40">01.</span>
              <span>{tCommon('step1')}</span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-foreground/40">02.</span>
              <span>{tCommon('step2')}</span>
            </li>
            <li className="flex gap-3">
              <span className="font-black text-foreground/40">03.</span>
              <span>{tCommon('step3')}</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black tracking-widest uppercase text-zply-purple">
            {tCommon('privacyFirst')}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tCommon('privacyDescription', { title })}
          </p>
        </div>
      </div>
    </section>
  );
});

ToolPageAbout.displayName = 'ToolPageAbout';
