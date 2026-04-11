import { ToolConfig, Library } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import React from 'react';

interface ToolPageFooterProps {
  toolConfig?: ToolConfig;
  footerIndicator?: React.ReactNode;
  isMobile: boolean;
}

export function ToolPageFooter({ toolConfig, footerIndicator, isMobile }: ToolPageFooterProps) {
  const tCommon = useTranslations('Common');

  if (!footerIndicator && !(toolConfig?.libs && toolConfig.libs.length > 0)) {
    return null;
  }

  return (
    <div
      className="px-6 sm:px-8 py-4 sm:py-6 flex items-center justify-between text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest border-t border-island-border/50 bg-island-bg/5"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1 overflow-hidden">
        {footerIndicator}
      </div>

      <div className="flex items-center gap-3 ml-4 shrink-0">
        {
          isMobile
            ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-3 py-1.5 bg-island-bg/40 border border-island-border/50 rounded-xl hover:bg-island-bg/60 transition-colors cursor-pointer group">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500/50" />
                    {
                      toolConfig?.libs && toolConfig.libs.length > 0
                      && (
                        <span className="text-muted-foreground group-hover:text-blue-400 transition-colors">
                          {tCommon('libsCount', { count: toolConfig.libs.length })}
                        </span>
                      )
                    }
                    <ChevronDown className="w-2.5 h-2.5 opacity-30" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" className="w-56 p-2 bg-island-bg/95 backdrop-blur-xl border-island-border shadow-2xl">
                  <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    {tCommon('securityPrivacy')}
                  </DropdownMenuLabel>
                  <div className="px-3 py-2.5 flex items-center gap-3 text-foreground/80 bg-island-bg/30 rounded-xl mb-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="font-bold text-[10px] tracking-widest uppercase">{tCommon('clientSideOnly')}</span>
                  </div>

                  {
                    toolConfig?.libs && toolConfig.libs.length > 0 && (
                      <>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                          {tCommon('poweredBy')}
                        </DropdownMenuLabel>
                        <div className="flex flex-col gap-1">
                          {
                            toolConfig.libs.map((lib: Library) => (
                              <DropdownMenuItem key={lib.name} className="p-0">
                                <a
                                  href={lib.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-blue-400 hover:bg-island-bg/50 rounded-lg transition-all"
                                >
                                  {lib.name}
                                </a>
                              </DropdownMenuItem>
                            ))
                          }
                        </div>
                      </>
                    )
                  }
                </DropdownMenuContent>
              </DropdownMenu>
            )
            : (
              <>
                {
                  toolConfig?.libs && toolConfig.libs.length > 0 && (
                    <div className="flex items-center gap-2 mr-4">
                      <span className="text-muted">{tCommon('poweredBy')}:</span>
                      <div className="flex items-center gap-2">
                        {
                          toolConfig.libs.map((lib: Library, index: number) => (
                            <React.Fragment key={lib.name}>
                              <a
                                href={lib.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-blue-400 transition-colors"
                              >
                                {lib.name}
                              </a>
                              {index < toolConfig.libs!.length - 1 && <span className="text-island-border">/</span>}
                            </React.Fragment>
                          ))
                        }
                      </div>
                    </div>
                  )
                }

                <div className="flex items-center gap-2 opacity-80">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500/50" />
                  {tCommon('clientSideOnly')}
                </div>
              </>
            )
        }
      </div>
    </div>
  );
}
