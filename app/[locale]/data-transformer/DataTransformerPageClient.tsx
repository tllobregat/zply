'use client';
import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Repeat, Zap } from 'lucide-react';
import { ReactNode } from 'react';
import { TransformerEditor } from './TransformerEditor';
import { TransformerOutput } from './TransformerOutput';
import { TransformerToolbar } from './TransformerToolbar';
import { useTransformerState } from './use-transformer-state';
import { useTransformerTransformation } from './use-transformer-transformation';

export default function DataTransformerPageClient(): ReactNode {
  const { state, updateState, swapFormats } = useTransformerState();
  const { transformContent, error } = useTransformerTransformation(state);

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.DATA]);

  const t = useTranslations('Tools');
  const tCategories = useTranslations('Categories');
  const tCommon = useTranslations('Common');
  return (
    <ToolPageLayout
      toolId={ToolId.DATA_TRANSFORMER}
      title={t(`${ToolId.DATA_TRANSFORMER}.title`)}
      icon={<Repeat className="w-5 h-5" />}
      breadcrumbItems={[
        { label: tCategories(Category.DATA), href: `/?category=${Category.DATA}` },
        { label: t(`${ToolId.DATA_TRANSFORMER}.title`) }
      ]}
      headerActions={
        <TransformerToolbar
          fromFormat={state.f}
          toFormat={state.t}
          onFromChange={(val) => updateState({ f: val })}
          onToChange={(val) => updateState({ t: val })}
          onSwap={swapFormats}
          activeColor={theme.text}
        />
      }
      footerIndicator={
        <>
          <span className={cn('flex items-center gap-1.5 opacity-80', theme.text)}>
            <Zap className="w-3 h-3" /> {tCommon('toolIndicators.liveTransform')}
          </span>
          <Separator />
          <span>{tCommon('charsCount', { count: state.i.length })} in → {tCommon('charsCount', { count: transformContent.length })} out</span>
        </>
      }
      workspaceClassName="flex-1 min-h-0 flex-col md:flex-row overflow-hidden"
    >
      <TransformerEditor
        value={state.i}
        format={state.f}
        onChange={(val) => updateState({ i: val })}
      />
      <TransformerOutput
        content={transformContent}
        format={state.t}
        error={error}
      />
    </ToolPageLayout>
  );
}
