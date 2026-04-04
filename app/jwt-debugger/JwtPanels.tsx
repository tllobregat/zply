import { Button } from '@/components/ui/button';
import dayjs from '@/lib/dayjs';
import { cn } from '@/lib/utils';
import MonacoEditor from '@/components/monaco-editor';
import { AlertCircle, Clock, Layout, ShieldAlert, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { ReactNode, useMemo } from 'react';

interface JwtPanelsProps {
  header: string;
  payload: string;
  onHeaderChange?: (val: string) => void;
  onPayloadChange?: (val: string) => void;
  className?: string;
  mode: 'decode' | 'encode';
}

export function JwtPanels({
                            header,
                            payload,
                            onHeaderChange,
                            onPayloadChange,
                            className,
                            mode
                          }: JwtPanelsProps): ReactNode {
  const { resolvedTheme } = useTheme();

  // Header is always read-only.
  // In Decode mode, it's read-only because it's the result.
  // In Encode mode, it's read-only because it's derived from the toolbar config.
  const isHeaderReadOnly: boolean = true;
  const isPayloadReadOnly: boolean = mode === 'decode';

  const parsedPayload: Record<string, unknown> | null = useMemo(() => {
    try {
      return JSON.parse(payload) as Record<string, unknown>;
    } catch {
      return null;
    }
  }, [payload]);

  const hasIat: boolean = parsedPayload !== null && 'iat' in parsedPayload;
  const hasExp: boolean = parsedPayload !== null && 'exp' in parsedPayload;

  const iatDate: string | null = useMemo(() => {
    if (parsedPayload?.iat && typeof parsedPayload.iat === 'number') {
      return dayjs.unix(parsedPayload.iat).format('LLL');
    }
    return null;
  }, [parsedPayload]);

  const expDate: string | null = useMemo(() => {
    if (parsedPayload?.exp && typeof parsedPayload.exp === 'number') {
      return dayjs.unix(parsedPayload.exp).format('LLL');
    }
    return null;
  }, [parsedPayload]);

  const addOrUpdateIat = (): void => {
    if (!onPayloadChange || !parsedPayload) return;
    const p: Record<string, unknown> = { ...parsedPayload };
    p.iat = Math.floor(Date.now() / 1000);
    onPayloadChange(JSON.stringify(p, null, 2));
  };

  const addOrUpdateExp = (): void => {
    if (!onPayloadChange || !parsedPayload) return;
    const p: Record<string, unknown> = { ...parsedPayload };
    p.exp = Math.floor(Date.now() / 1000) + 3600;
    onPayloadChange(JSON.stringify(p, null, 2));
  };

  return (
    <div className={cn('flex flex-col min-h-0', className)}>
      {/* Header Panel */}
      <div className={cn(
        'h-1/3 min-h-37.5 border-b border-island-border flex flex-col shrink-0',
        resolvedTheme === 'dark' ? 'bg-transparent' : 'bg-white'
      )}>
        <div
          className="px-6 py-2 border-b border-island-border bg-island-card flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
          <div className="flex items-center gap-2">
            <Layout className="w-3.5 h-3.5 text-purple-400/50" /> Header (Algorithm & Token Type)
          </div>
          {mode === 'encode' && (
            <div
              className="flex items-center gap-1.5 text-[9px] text-orange-400/60 font-bold bg-orange-400/5 px-2 py-0.5 rounded-full border border-orange-400/10">
              <AlertCircle className="w-3 h-3" /> Managed via config
            </div>
          )}
        </div>
        <div className="flex-1 min-h-0 relative">
          <MonacoEditor
            height="100%"
            defaultLanguage="json"
            value={header}
            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
            onChange={(val: string | undefined): void => onHeaderChange?.(val || '')}
            options={{
              readOnly: isHeaderReadOnly,
              fontSize: 12,
              padding: { top: 15 },
              lineNumbers: 'off',
              renderLineHighlight: 'none',
              folding: false,
              domReadOnly: true,
            }}
          />
        </div>
      </div>

      {/* Payload Panel */}
      <div className={cn(
        'flex-1 min-h-62.5 flex flex-col',
        resolvedTheme === 'dark' ? 'bg-island-bg/20' : 'bg-white'
      )}>
        <div
          className="px-6 py-2 border-b border-island-border bg-island-card flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-blue-400/50" /> Payload (Claims / Data)
          </div>
          {mode === 'encode' && parsedPayload && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[9px] gap-1 hover:bg-blue-400/10 text-blue-400/70 hover:text-blue-400 transition-colors"
                onClick={addOrUpdateIat}
              >
                <Clock className="w-3 h-3" /> {hasIat ? 'Update iat' : 'Add iat'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[9px] gap-1 hover:bg-orange-400/10 text-orange-400/70 hover:text-orange-400 transition-colors"
                onClick={addOrUpdateExp}
              >
                <ShieldAlert className="w-3 h-3" /> {hasExp ? 'Update exp' : 'Add exp'}
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 relative">
            <MonacoEditor
              height="100%"
              defaultLanguage="json"
              value={payload}
              theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
              onChange={(val: string | undefined): void => onPayloadChange?.(val || '')}
              options={{
                readOnly: isPayloadReadOnly,
                fontSize: 13,
                padding: { top: 20 },
                lineNumbers: 'off',
                renderLineHighlight: 'none',
                folding: false,
              }}
            />
          </div>

          {
            (iatDate || expDate)
            && (
              <div
                className={cn(
                  'px-6 py-3 border-t border-island-border/50 flex flex-wrap gap-x-8 gap-y-3 shrink-0',
                  resolvedTheme === 'dark' ? 'bg-black/40' : 'bg-white'
                )}
              >
                {
                  iatDate
                  && (
                    <div className="flex flex-col gap-0.5 min-w-35">
                      <span className="font-black uppercase tracking-[0.2em] text-[8px] text-blue-400">Issued At (iat)</span>
                      <span className="font-mono text-[11px] text-foreground font-bold">{iatDate}</span>
                    </div>
                  )
                }
                {
                  expDate
                  && (
                    <div className="flex flex-col gap-0.5 min-w-35">
                      <span className="font-black uppercase tracking-[0.2em] text-[8px] text-orange-400">Expiration (exp)</span>
                      <span className="font-mono text-[11px] text-foreground font-bold">{expDate}</span>
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
