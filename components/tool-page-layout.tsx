import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import { PageLayout } from '@/components/page-layout';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { usePinnedTools } from '@/hooks/use-pinned-tools';
import { useShareableStateSync } from '@/hooks/use-shareable-state-context';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses, getCategoryColorClass } from '@/lib/config/categories';
import { Category, Library, ToolConfig, TOOLS } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, Info, MoreHorizontal, Pin, RefreshCw, Share2, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Script from 'next/script';
import React, { useEffect, useRef, useState } from 'react';

interface ToolPageLayoutProps {
  toolId: string;
  breadcrumbItems: BreadcrumbItem[];
  title: string;
  icon: React.ReactNode;
  headerActions?: React.ReactNode;
  footerIndicator?: React.ReactNode;
  children: React.ReactNode;
  workspaceClassName?: string;
}

export default function ToolPageLayout(
  {
    toolId,
    breadcrumbItems,
    title,
    icon,
    headerActions,
    footerIndicator,
    children,
    workspaceClassName,
  }: ToolPageLayoutProps,
): React.ReactNode {
  const t = useTranslations('Tools');
  const tCommon = useTranslations('Common');
  const { togglePin, isPinned }: { togglePin: (id: string) => void; isPinned: (id: string) => boolean } = usePinnedTools();
  const { copy, isCopied }: { copy: (text: string, id?: string) => void; isCopied: (id?: string) => boolean } = useCopyToClipboard();
  const { isSyncing, syncNow } = useShareableStateSync();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const aboutRef: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = (): void => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return (): void => window.removeEventListener('resize', checkMobile);
  }, []);

  const tCategories = useTranslations('Categories');
  const toolConfig: ToolConfig | undefined = TOOLS.find((t: ToolConfig) => t.id === toolId);
  const theme: CategoryTheme | undefined = toolConfig ? getCategoryClasses(CATEGORY_COLORS[toolConfig.category]) : undefined;

  // Enhance breadcrumb items with category colors
  const enhancedBreadcrumbItems: BreadcrumbItem[] = breadcrumbItems.map((item: BreadcrumbItem) => {
    // Check if the label matches a translated category name
    const categoryKey = Object.keys(Category).find(key => tCategories(Category[key as keyof typeof Category]) === item.label);
    const categoryValue = categoryKey ? Category[categoryKey as keyof typeof Category] : item.label;

    return {
      ...item,
      className: item.className || getCategoryColorClass(categoryValue) || undefined
    };
  });

  const iconColorClassName: string = theme ? cn(theme.bg, theme.border, 'text-white') : 'bg-blue-500 border-blue-500/20 text-white';

  const handleShare = (): void => {
    if (isSyncing) {
      return;
    }

    // Force immediate sync before copying to ensure URL is up-to-date
    syncNow();

    // Small delay to let the URL update (though history.replaceState is synchronous)
    requestAnimationFrame(() => {
      copy(window.location.href, 'share');
    });
  };

  const scrollToAbout = (): void => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isShared: boolean = isCopied('share');

  // Determine button state and label
  let shareLabel: string = tCommon('share');
  let shareIcon: React.ReactNode = <Share2 className="w-3.5 h-3.5" />;
  let shareVariant: 'primary' | 'success' | 'active' = 'primary';

  if (isSyncing) {
    shareLabel = tCommon('syncing');
    shareIcon = <RefreshCw className="w-3.5 h-3.5 animate-spin" />;
    shareVariant = 'active';
  } else if (isShared) {
    shareLabel = tCommon('copied');
    shareIcon = <CheckCircle2 className="w-3.5 h-3.5" />;
    shareVariant = 'success';
  }

  const renderHeaderAction: () => React.ReactNode = (): React.ReactNode => {
    if (React.isValidElement(headerActions)) {
      if ((headerActions as React.ReactElement).type === React.Fragment) {
        return headerActions;
      }
      return (
        React.cloneElement(headerActions as React.ReactElement<{ isDropdown?: boolean }>, {
          isDropdown: true,
        })
      );
    }
    return headerActions;
  };

  const jsonLd: string = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': `${title} - Zply`,
    'description': toolConfig ? t(`${toolConfig.id}.description`) : '',
    'applicationCategory': 'DeveloperTool',
    'operatingSystem': 'Any',
    'url': `https://zply.dev${toolConfig?.href}`,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  });

  return (
    <PageLayout
      scrollInIsland={false}
      header={
        <header className="px-4 sm:px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex flex-col min-w-0">
            <Breadcrumb items={enhancedBreadcrumbItems} />
            <div className="flex items-center gap-3">
              <div className={cn('p-1.5 sm:p-2 rounded-xl border shrink-0', iconColorClassName)}>
                {icon}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate">{title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {
              isMobile
                ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-10 w-10"
                        aria-label={tCommon('moreOptions')}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 p-2 bg-island-bg/95 backdrop-blur-xl border-island-border shadow-2xl">
                      {
                        headerActions
                        && (
                          <>
                            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                              {tCommon('toolActions.title')}
                            </DropdownMenuLabel>
                            <div className="p-1 flex flex-col gap-1.5">
                              {renderHeaderAction()}
                            </div>
                            <DropdownMenuSeparator className="my-2" />
                          </>
                        )
                      }
                      <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        {tCommon('settings.title')}
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={scrollToAbout}
                        className="gap-3 py-2.5 rounded-xl cursor-pointer"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Info className="w-4 h-4" />
                          <span className="font-bold">{tCommon('aboutTool')}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => togglePin(toolId)}
                        className="gap-3 py-2.5 rounded-xl cursor-pointer"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <Pin className={cn('w-4 h-4', isPinned(toolId) && 'fill-current text-blue-500')} />
                          <span className="font-bold">{isPinned(toolId) ? tCommon('unpinFromDashboard') : tCommon('pinToDashboard')}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleShare}
                        className="gap-3 py-2.5 rounded-xl cursor-pointer"
                      >
                        <div className={cn('flex items-center gap-3 w-full', isShared && 'text-green-500')}>
                          {shareIcon}
                          <span className="font-bold">{shareLabel}</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
                : (
                  <>
                    {headerActions}

                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={scrollToAbout}
                      title={tCommon('aboutTool')}
                    >
                      <Info className="w-4 h-4" />
                    </Button>

                    <Button
                      variant={isPinned(toolId) ? 'active' : 'secondary'}
                      size="icon"
                      onClick={() => togglePin(toolId)}
                      title={isPinned(toolId) ? tCommon('unpinFromDashboard') : tCommon('pinToDashboard')}
                    >
                      <Pin className={cn('w-4 h-4', isPinned(toolId) && 'fill-current')} />
                    </Button>

                    <div className="h-6 w-px bg-island-border mx-1" />

                    <Button
                      onClick={handleShare}
                      variant={shareVariant}
                      className="w-32 justify-center"
                      disabled={isSyncing && !isShared}
                    >
                      <div className="relative flex items-center justify-center w-full h-full">
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={shareLabel}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.1, ease: 'easeOut' }}
                            className="flex items-center gap-2 absolute"
                          >
                            {shareIcon}
                            <span>{shareLabel}</span>
                          </motion.div>
                        </AnimatePresence>
                        <div className="flex items-center gap-2 opacity-0 pointer-events-none">
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{tCommon('syncing')}</span>
                        </div>
                      </div>
                    </Button>
                  </>
                )
            }
          </div>
        </header>
      }
      footer={
        (footerIndicator || (toolConfig?.libs && toolConfig.libs.length > 0))
        && (
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
        )
      }
      contentClassName={workspaceClassName}
      afterIsland={
        toolConfig
        && (
          <section ref={aboutRef} className="px-6 py-12 sm:py-20 max-w-4xl mx-auto w-full space-y-12 shrink-0">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground/90">
                {tCommon('aboutTitle', { title })}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {toolConfig ? t(`${toolConfig.id}.description`) : ''} {tCommon('aboutDescription')}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-lg font-black tracking-widest uppercase text-zply-blue">
                  {tCommon('howToUse')}
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-black text-foreground/40">01.</span>
                    <span>{tCommon('step1')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-black text-foreground/40">02.</span>
                    <span>{tCommon('step2')}</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-black text-foreground/40">03.</span>
                    <span>{tCommon('step3')}</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black tracking-widest uppercase text-zply-purple">
                  {tCommon('privacyFirst')}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tCommon('privacyDescription', { title })}
                </p>
              </div>
            </div>
          </section>
        )
      }
    >
      <Script
        id={`json-ld-${toolId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {children}
    </PageLayout>
  );
}
