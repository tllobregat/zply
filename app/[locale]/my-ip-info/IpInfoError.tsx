import { ToolPageLayout }from '@/components/ui/layout';
import { Button } from '@/components/ui/button';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { Globe, MapPin } from 'lucide-react';
import React, { ReactNode } from 'react';

interface IpInfoErrorProps {
  error: string;
}

export function IpInfoError({ error }: IpInfoErrorProps): ReactNode {
  const t = useTranslations('Tools');
  const tCategories = useTranslations('Categories');
  return (
    <ToolPageLayout
      toolId={ToolId.MY_IP}
      title={t(`${ToolId.MY_IP}.title`)}
      icon={<MapPin className="w-5 h-5" />}
      breadcrumbItems={[{ label: tCategories(Category.NETWORK), href: `/?category=${Category.NETWORK}` }, { label: t(`${ToolId.MY_IP}.title`) }]}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="p-4 rounded-full bg-red-500/10 text-red-400 mb-6">
          <Globe className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight mb-2">{t(`${ToolId.MY_IP}.detectionFailed`)}</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">{error}</p>
        <Button onClick={(): void => window.location.reload()} className="rounded-2xl gap-2">
          {t(`${ToolId.MY_IP}.reloadPage`)}
        </Button>
      </div>
    </ToolPageLayout>
  );
}
