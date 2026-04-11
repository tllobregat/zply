'use client';

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
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, MoreHorizontal, Pin, RefreshCw, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ToolPageActionsProps {
  toolId: string;
  isMobile: boolean;
  headerActions?: React.ReactNode;
  scrollToAbout: () => void;
}

export function ToolPageActions({
  toolId,
  isMobile,
  headerActions,
  scrollToAbout,
}: ToolPageActionsProps) {
  const tCommon = useTranslations('Common');
  const { togglePin, isPinned } = usePinnedTools();
  const { copy, isCopied } = useCopyToClipboard();
  const { isSyncing, syncNow } = useShareableStateSync();

  const handleShare = (): void => {
    if (isSyncing) return;
    syncNow();
    requestAnimationFrame(() => {
      copy(window.location.href, 'share');
    });
  };

  const isShared = isCopied('share');

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

  const renderHeaderAction = (): React.ReactNode => {
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

  if (isMobile) {
    return (
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
    );
  }

  return (
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
  );
}
