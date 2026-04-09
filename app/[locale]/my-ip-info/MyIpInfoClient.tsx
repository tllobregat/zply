'use client';

import { IpInfoDeviceDetails } from '@/app/[locale]/my-ip-info/IpInfoDeviceDetails';
import { IpInfoError } from '@/app/[locale]/my-ip-info/IpInfoError';
import { IpInfoGeolocation } from '@/app/[locale]/my-ip-info/IpInfoGeolocation';
import { IpInfoHero } from '@/app/[locale]/my-ip-info/IpInfoHero';
import { IpInfoManualGuide } from '@/app/[locale]/my-ip-info/IpInfoManualGuide';
import { IpInfoPermissionGate } from '@/app/[locale]/my-ip-info/IpInfoPermissionGate';
import { useIpInfoDevice } from '@/app/[locale]/my-ip-info/use-ip-info-device';
import { useIpInfoFetch } from '@/app/[locale]/my-ip-info/use-ip-info-fetch';
import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { MapPin, ShieldCheck } from 'lucide-react';
import React, { ReactNode } from 'react';

export default function MyIpInfoClient(): ReactNode {
  const { loading, data, error, triggerFetch } = useIpInfoFetch();
  const { userAgent, screenRes, userOS } = useIpInfoDevice();

  const { copy, isCopied }: { copy: (t: string) => void; isCopied: () => boolean } = useCopyToClipboard();
  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.NETWORK]);

  const t = useTranslations('Tools');
  const tCategories = useTranslations('Categories');
  if (error) {
    return (
      <IpInfoError error={error} />
    );
  }

  return (
    <ToolPageLayout
      toolId={ToolId.MY_IP}
      title={t(`${ToolId.MY_IP}.title`)}
      icon={<MapPin className="w-5 h-5" />}
      breadcrumbItems={[
        { label: tCategories(Category.NETWORK), href: `/?category=${Category.NETWORK}` },
        { label: t(`${ToolId.MY_IP}.title`) }
      ]}
      footerIndicator={
        <>
          <span className={cn('flex items-center gap-1.5 opacity-80', theme.text)}>
            <ShieldCheck className="w-3 h-3" /> {t(`${ToolId.MY_IP}.secureLookup`)}
          </span>
          <Separator />
          <span>{t(`${ToolId.MY_IP}.clientSideDetection`)}</span>
        </>
      }
      workspaceClassName="md:flex-col overflow-y-auto custom-scrollbar"
    >
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Content Area (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            {
              data
                ? (
                  <div className="animate-in fade-in zoom-in-95 duration-500">
                    <IpInfoHero
                      ip={data.ip || ''}
                      isCopied={isCopied()}
                      onCopy={(): void => copy(data.ip || '')}
                      theme={theme}
                    />
                  </div>
                )
                : (
                  <IpInfoPermissionGate
                    onAccept={triggerFetch}
                    loading={loading}
                    theme={theme}
                  />
                )
            }

            {
              data
              && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-200 fill-mode-both">
                  <IpInfoGeolocation data={data} theme={theme} />
                </div>
              )
            }
          </div>

          {/* Sidebar Area (4/12) */}
          <div className="lg:col-span-4 space-y-8">
            <IpInfoDeviceDetails
              userOS={userOS}
              screenRes={screenRes}
              userAgent={userAgent}
              theme={theme}
            />
            <IpInfoManualGuide theme={theme} />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
