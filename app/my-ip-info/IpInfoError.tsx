import ToolPageLayout from '@/components/tool-page-layout';
import { Button } from '@/components/ui/button';
import { Category, ToolId } from '@/lib/config/tools';
import { Globe, MapPin } from 'lucide-react';
import React, { ReactNode } from 'react';

interface IpInfoErrorProps {
  error: string;
}

export function IpInfoError({ error }: IpInfoErrorProps): ReactNode {
  return (
    <ToolPageLayout
      toolId={ToolId.MY_IP}
      title="My IP Info"
      icon={<MapPin className="w-5 h-5" />}
      breadcrumbItems={[{ label: 'Network', href: `/?category=${Category.NETWORK}` }, { label: 'My IP' }]}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="p-4 rounded-full bg-red-500/10 text-red-400 mb-6">
          <Globe className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight mb-2">Detection Failed</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">{error}</p>
        <Button onClick={(): void => window.location.reload()} className="rounded-2xl gap-2">
          Try Again
        </Button>
      </div>
    </ToolPageLayout>
  );
}
