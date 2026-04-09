'use client';

import TimezoneCard from '@/app/[locale]/timezone-converter/TimezoneCard';
import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Plus, Zap } from 'lucide-react';
import React, { ReactNode } from 'react';
import { useTzConvState } from './use-tz-conv-state';
import { useTzConvActions } from './use-tz-conv-actions';
import { TzConvToolbar } from './TzConvToolbar';
import { TimezoneHero } from './TimezoneHero';
import { AddTimezoneOverlay } from './AddTimezoneOverlay';

export default function TimezoneConverterClient(): ReactNode {
  const { state, updateState } = useTzConvState();
  const { 
    isAdding, 
    setIsAdding, 
    search, 
    setSearch, 
    addTimezone, 
    removeTimezone, 
    filteredTz 
  } = useTzConvActions(state, updateState);

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.TIME]);

  const t = useTranslations('Tools');
  const tCategories = useTranslations('Categories');
  const tCommon = useTranslations('Common');

  return (
    <ToolPageLayout
      toolId={ToolId.TZ_CONV}
      title={t(`${ToolId.TZ_CONV}.title`)}
      icon={<Globe className="w-5 h-5" />}
      breadcrumbItems={[
        { label: tCategories(Category.TIME), href: `/?category=${Category.TIME}` },
        { label: t(`${ToolId.TZ_CONV}.title`) }
      ]}
      headerActions={
        <TzConvToolbar
          liveMode={state.liveMode}
          onToggleLiveMode={() => updateState({ liveMode: !state.liveMode })}
          onAddClick={() => setIsAdding(true)}
          theme={theme}
        />
      }
      footerIndicator={
        <>
          <span className={cn('flex items-center gap-1.5 opacity-80', theme.text)}>
            <Zap className="w-3 h-3" /> {state.liveMode ? tCommon('toolIndicators.realTimeSync') : tCommon('toolIndicators.editingMode')}
          </span>
          <Separator />
          <span>{tCommon('tzCount', { count: state.selectedTimezoneNames.length })}</span>
        </>
      }
      workspaceClassName="md:flex-col overflow-y-auto custom-scrollbar"
    >
      <div className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full space-y-12">
        <TimezoneHero
          referenceTimestamp={state.referenceTimestamp}
          liveMode={state.liveMode}
          theme={theme}
        />

        {/* Grid of Timezones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {
              state.selectedTimezoneNames.map((tz: string) => (
                <TimezoneCard
                  key={tz}
                  timezone={tz}
                  timestamp={state.referenceTimestamp}
                  isReference={tz === 'UTC'}
                  onRemove={(): void => removeTimezone(tz)}
                  theme={theme}
                />
              ))
            }

            {/* Add New Button */}
            <motion.button
              layout
              onClick={(): void => setIsAdding(true)}
              className={cn(
                'p-8 flex flex-col items-center justify-center text-center glass-island border-2 border-dashed border-island-border rounded-4xl bg-island-bg/5 group transition-all cursor-pointer',
                theme.hoverBorder
              )}
            >
              <div className="relative mb-4">
                <Globe className={cn('w-16 h-16 text-muted-foreground/10 transition-transform duration-500', theme.hoverText)} />
                <Plus
                  className={cn('absolute -bottom-1 -right-1 w-6 h-6 bg-island-card rounded-full p-1 border border-island-border shadow-xl', theme.text)} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{t(`${ToolId.TZ_CONV}.addTimezone`)}</span>
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      <AddTimezoneOverlay
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        search={search}
        onSearchChange={setSearch}
        filteredTz={filteredTz}
        onAdd={addTimezone}
        theme={theme}
      />
    </ToolPageLayout>
  );
}
