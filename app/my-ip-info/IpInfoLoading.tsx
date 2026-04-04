import ToolPageLayout from '@/components/tool-page-layout';
import { Category, ToolId } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { Loader2, MapPin } from 'lucide-react';
import React, { ReactNode } from 'react';
import { CategoryTheme } from '@/lib/config/categories';

interface IpInfoLoadingProps {
  theme: CategoryTheme;
}

export function IpInfoLoading({ theme }: IpInfoLoadingProps): ReactNode {
  return (
    <ToolPageLayout
      toolId={ToolId.MY_IP}
      title="My IP Info"
      icon={<MapPin className="w-5 h-5" />}
      breadcrumbItems={[{ label: 'Network', href: `/?category=${Category.NETWORK}` }, { label: 'My IP' }]}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className={cn('w-10 h-10 animate-spin opacity-50', theme.text)} />
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Detecting your connection...</p>
      </div>
    </ToolPageLayout>
  );
}
