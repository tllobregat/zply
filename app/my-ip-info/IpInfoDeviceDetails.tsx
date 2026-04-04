import { FeatureCard } from '@/app/my-ip-info/FeatureCard';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { Cpu, Info, Maximize2, Monitor, MousePointer2 } from 'lucide-react';
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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-xl bg-island-card border border-island-border', theme.text)}>
          <Monitor className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest">Device Info</h3>
      </div>

      <div className="space-y-4">
        <FeatureCard title="Operating System" value={userOS} icon={<Cpu className="w-4 h-4" />} theme={theme} />
        <FeatureCard title="Resolution" value={screenRes} icon={<Maximize2 className="w-4 h-4" />} theme={theme} />
        <div className="p-4 rounded-2xl bg-island-bg/50 border border-island-border space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <MousePointer2 className="w-3 h-3" /> User Agent
          </div>
          <code className={cn('text-[10px] break-all leading-relaxed line-clamp-3', theme.text)}>
            {userAgent}
          </code>
        </div>
        <div
          className={cn('p-3 rounded-xl bg-island-bg/5 border text-[10px] text-muted-foreground flex items-center gap-2 italic', theme.border)}>
          <Info className={cn('w-3 h-3', theme.text)} />
          Detection logic runs strictly in your browser.
        </div>
      </div>
    </div>
  );
}
