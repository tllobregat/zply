import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { ExternalLink, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { ReactNode } from 'react';

interface IpInfoPermissionGateProps {
  onAccept: () => void;
  loading?: boolean;
  theme: CategoryTheme;
}

export function IpInfoPermissionGate({ onAccept, loading, theme }: IpInfoPermissionGateProps): ReactNode {
  return (
    <div className="relative group p-8 md:p-10 rounded-[3rem] bg-island-card border border-island-border overflow-hidden text-center md:text-left h-full flex flex-col justify-center">
      <div className={cn('absolute -inset-1 rounded-[3rem] blur opacity-5 group-hover:opacity-10 transition duration-1000', theme.bg)}></div>
      <div className="relative flex flex-col xl:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg">
          <span
            className={cn('flex items-center justify-center md:justify-start gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-1', theme.text)}>
            <Lock className="w-3.5 h-3.5 fill-current" /> Privacy Gate
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-foreground">
            IP Detection requires external query
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Zply runs entirely in your browser. To retrieve your public IP address and geolocation, we need to query an external provider (<span className="font-mono">ipapi.co</span>).
          </p>
        </div>
        <div className="flex flex-col sm:flex-row xl:flex-col gap-3 shrink-0 w-full sm:w-auto">
          <Button
            onClick={onAccept}
            disabled={loading}
            className={cn(
              'h-12 px-6 rounded-2xl text-white font-bold gap-2 shadow-lg transition-all active:scale-95 shrink-0 hover:opacity-90',
              theme.bg,
              theme.shadow
            )}
          >
            {
              loading
                ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )
                : (
                  <ShieldCheck className="w-4 h-4" />
                )
            }
            {loading ? 'Detecting...' : 'Show my IP'}
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            onClick={(): void => { window.open('https://ipapi.co/', '_blank'); }}
            className="h-12 px-6 rounded-2xl font-bold gap-2 border-island-border bg-island-bg/50 hover:bg-island-bg transition-all active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            Open ipapi.co
          </Button>
        </div>
      </div>
    </div>
  );
}
