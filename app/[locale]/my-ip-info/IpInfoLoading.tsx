import ToolPageLayout from '@/components/tool-page-layout';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Loader2, MapPin } from 'lucide-react';
import React, { ReactNode } from 'react';
import { CategoryTheme } from '@/lib/config/categories';

interface IpInfoLoadingProps {
  theme: CategoryTheme;
}

export function IpInfoLoading({ theme }: IpInfoLoadingProps): ReactNode {
  const t = useTranslations('Tools');
  const tCategories = useTranslations('Categories');
  return (
    <ToolPageLayout
      toolId={ToolId.MY_IP}
      title={t(`${ToolId.MY_IP}.title`)}
      icon={<MapPin className="w-5 h-5" />}
      breadcrumbItems={[{ label: tCategories(Category.NETWORK), href: `/?category=${Category.NETWORK}` }, { label: t(`${ToolId.MY_IP}.title`) }]}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className={cn('w-10 h-10 animate-spin opacity-50', theme.text)} />
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">{t(`${ToolId.MY_IP}.detectingConnection`)}</p>
      </div>
    </ToolPageLayout>
  );
}
