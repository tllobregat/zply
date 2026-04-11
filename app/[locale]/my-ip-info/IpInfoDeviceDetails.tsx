import { FeatureCard } from '@/app/[locale]/my-ip-info/FeatureCard';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { Cpu, Info, Maximize2, Monitor, MousePointer2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ToolId } from '@/lib/config/tools';
import React, { ReactNode } from 'react';

interface IpInfoDeviceDetailsProps {
  userOS: string;
  screenRes: string;
  userAgent: string;
  theme: CategoryTheme;
}

export function IpInfoDeviceDetails
({
   userOS,
   screenRes,
   userAgent,
   theme,
 }: IpInfoDeviceDetailsProps,
): ReactNode {
  const t = useTranslations('Tools');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-xl bg-island-card border border-island-border', theme.text)}>
          <Monitor className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest">{t(`${ToolId.MY_IP}.deviceInfo`)}</h3>
      </div>

      <div className="space-y-4">
        <FeatureCard title={t(`${ToolId.MY_IP}.operatingSystem`)} value={userOS} icon={<Cpu className="w-4 h-4" />} theme={theme} />
        <FeatureCard title={t(`${ToolId.MY_IP}.resolution`)} value={screenRes} icon={<Maximize2 className="w-4 h-4" />} theme={theme} />
        <div className="p-4 rounded-2xl bg-island-bg/50 border border-island-border space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <MousePointer2 className="w-3 h-3" /> {t(`${ToolId.MY_IP}.userAgent`)}
          </div>
          <code className={cn('text-[10px] break-all leading-relaxed line-clamp-3', theme.text)}>
            {userAgent}
          </code>
        </div>
        <div
          className={cn('p-3 rounded-xl bg-island-bg/5 border text-[10px] text-muted-foreground flex items-center gap-2 italic', theme.border)}>
          <Info className={cn('w-3 h-3', theme.text)} />
          {t(`${ToolId.MY_IP}.localDetectionLogic`)}
        </div>
      </div>
    </div>
  );
}
