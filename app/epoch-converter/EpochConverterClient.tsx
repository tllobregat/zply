'use client';

import { EpochLiveNow } from '@/app/epoch-converter/EpochLiveNow';
import { EpochResultCard } from '@/app/epoch-converter/EpochResultCard';
import { EpochTimestampInput } from '@/app/epoch-converter/EpochTimestampInput';
import { useEpochNow } from '@/app/epoch-converter/use-epoch-now';
import { useEpochState } from '@/app/epoch-converter/use-epoch-state';
import { useEpochTransformation } from '@/app/epoch-converter/use-epoch-transformation';
import ToolPageLayout from '@/components/tool-page-layout';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { Calendar, Clock, Globe, Zap } from 'lucide-react';
import React, { ReactNode } from 'react';

export default function EpochConverterClient(): ReactNode {
  const { timestamp, setTimestamp } = useEpochState();
  const { mounted, now, setNowAsTimestamp } = useEpochNow(timestamp, setTimestamp);
  const { localDate, utcDate } = useEpochTransformation(timestamp, mounted);

  const { copy, isCopied }: { copy: (t: string, k?: string) => void; isCopied: (k?: string) => boolean } = useCopyToClipboard();
  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.TIME]);

  return (
    <ToolPageLayout
      toolId={ToolId.EPOCH}
      title="Epoch Converter"
      icon={<Clock className="w-5 h-5" />}
      breadcrumbItems={[
        { label: Category.TIME, href: `/?category=${Category.TIME}` },
        { label: 'Epoch Converter' }
      ]}
      footerIndicator={
        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500/30" /> Milliseconds auto-detected</span>
      }
      workspaceClassName="p-8 md:p-12 items-center justify-center"
    >
      <div className="w-full max-w-2xl space-y-12">
        {/* Header/Actions Section */}
        <EpochLiveNow
          mounted={mounted}
          now={now}
          theme={theme}
          onSetNow={setNowAsTimestamp}
        />

        {/* Input Section */}
        <EpochTimestampInput
          value={timestamp}
          onChange={setTimestamp}
          onCopy={(): void => copy(timestamp, 'input')}
          isCopied={isCopied('input')}
          theme={theme}
        />

        <div className="h-px w-full bg-linear-to-r from-transparent via-island-border/50 to-transparent" />

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EpochResultCard
            icon={<Calendar className="w-5 h-5" />}
            label="Local Time"
            value={localDate}
            onCopy={(): void => copy(localDate, 'local')}
            isCopied={isCopied('local')}
            theme={theme}
          />

          <EpochResultCard
            icon={<Globe className="w-5 h-5" />}
            label="UTC Time"
            value={utcDate}
            onCopy={(): void => copy(utcDate, 'utc')}
            isCopied={isCopied('utc')}
            theme={theme}
          />
        </div>
      </div>
    </ToolPageLayout>
  );
}
