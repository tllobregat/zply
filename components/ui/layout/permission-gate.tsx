import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { ExternalLink, Lock, ShieldCheck, Loader2, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

interface PermissionGateProps {
  /**
   * Function to call when the user accepts the external request.
   */
  onAccept: () => void;
  
  /**
   * Loading state of the request.
   */
  loading?: boolean;
  
  /**
   * Theme configuration for the gate (colors, shadows).
   */
  theme: CategoryTheme;
  
  /**
   * Title of the permission gate. Defaults to common translation.
   */
  title?: string;
  
  /**
   * Description of why the external request is needed. Defaults to common translation.
   */
  description?: string | ReactNode;
  
  /**
   * Label for the main action button. Defaults to common translation.
   */
  buttonLabel?: string;

  /**
   * Label for the button when in loading state. Defaults to common translation.
   */
  loadingLabel?: string;
  
  /**
   * Optional URL to the third-party provider's website.
   */
  providerUrl?: string;
  
  /**
   * Optional icon to display in the main button. Defaults to ShieldCheck.
   */
  icon?: LucideIcon;
  
  /**
   * Optional label for the gate type (e.g. "Privacy Gate").
   */
  gateLabel?: string;
}

export function PermissionGate({
  onAccept,
  loading,
  theme,
  title,
  description,
  buttonLabel,
  loadingLabel,
  providerUrl,
  icon: Icon = ShieldCheck,
  gateLabel,
}: PermissionGateProps): ReactNode {
  const t = useTranslations('PrivacyGate');

  return (
    <div className="relative group p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-island-card border border-island-border overflow-hidden text-center md:text-left h-full flex flex-col justify-center">
      <div className={cn('absolute -inset-1 rounded-2xl sm:rounded-3xl blur opacity-5 group-hover:opacity-10 transition duration-1000', theme.bg)}></div>
      <div className="relative flex flex-col xl:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg text-left">
          <span
            className={cn('flex items-center justify-center md:justify-start gap-2 text-[10px] font-black uppercase tracking-[0.3em] mb-1', theme.text)}>
            <Lock className="w-3.5 h-3.5 fill-current" /> {gateLabel || t('privacyGate')}
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-sans tracking-tight text-foreground">
            {title || t('title')}
          </h2>
          <div
            className="text-muted-foreground text-xs leading-relaxed"
          >
            {
              typeof description === 'string'
                ? (
                  <p dangerouslySetInnerHTML={{ __html: description }} />
                )
                : (
                  description || <p dangerouslySetInnerHTML={{ __html: t.raw('description') }} />
                )
            }
          </div>
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
                  <Icon className="w-4 h-4" />
                )
            }
            {loading ? (loadingLabel || t('loading')) : (buttonLabel || t('accept'))}
          </Button>
          {
            providerUrl
            && (
              <Button
                variant="outline"
                disabled={loading}
                onClick={(): void => { window.open(providerUrl, '_blank'); }}
                className="h-12 px-6 rounded-2xl font-bold gap-2 border-island-border bg-island-bg/50 hover:bg-island-bg transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                {t('providerLink')}
              </Button>
            )
          }
        </div>
      </div>
    </div>
  );
}
