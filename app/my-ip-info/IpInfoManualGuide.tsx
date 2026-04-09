import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/ui/copy-button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Terminal, Settings, Globe } from 'lucide-react';
import React, { ReactNode } from 'react';

interface IpInfoManualGuideProps {
  theme: CategoryTheme;
}

export function IpInfoManualGuide({ theme }: IpInfoManualGuideProps): ReactNode {
  const { copy }: { copy: (t: string) => void } = useCopyToClipboard();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 opacity-50">
        <div className={cn('p-1.5 rounded-lg bg-island-card border border-island-border', theme.text)}>
          <Terminal className="w-3.5 h-3.5" />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-widest">Manual Detection</h3>
      </div>

      <div className="space-y-3">
        {/* Public IP */}
        <div className="p-4 rounded-2xl bg-island-card border border-island-border space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Globe className="w-3 h-3" /> Public IP (Terminal)
          </div>
          <div className="space-y-2">
            {[
              { label: 'macOS / Linux / Windows', cmd: 'curl ifconfig.me' },
              { label: 'PowerShell', cmd: 'Invoke-RestMethod ifconfig.me' }
            ].map((item: { label: string; cmd: string }) => (
              <div key={item.cmd} className="flex items-center justify-between p-2 rounded-xl bg-island-bg/50 border border-island-border gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase truncate">{item.label}</div>
                  <code className={cn('text-[10px] font-mono break-all', theme.text)}>{item.cmd}</code>
                </div>
                <CopyButton onCopy={(): void => copy(item.cmd)} isCopied={false} className="h-7 w-7 shrink-0" showText={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Local IP */}
        <div className="p-4 rounded-2xl bg-island-card border border-island-border space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Settings className="w-3 h-3" /> Local IP (Internal)
          </div>
          <div className="space-y-2">
            {[
              { label: 'Windows (CMD)', cmd: 'ipconfig' },
              { label: 'macOS / Linux', cmd: 'ip addr | grep "inet "' }
            ].map((item: { label: string; cmd: string }) => (
              <div key={item.cmd} className="flex items-center justify-between p-2 rounded-xl bg-island-bg/50 border border-island-border gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[9px] font-bold text-muted-foreground uppercase truncate">{item.label}</div>
                  <code className={cn('text-[10px] font-mono break-all', theme.text)}>{item.cmd}</code>
                </div>
                <CopyButton onCopy={(): void => copy(item.cmd)} isCopied={false} className="h-7 w-7 shrink-0" showText={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
