'use client';

import { ToolPageLayout }from '@/components/ui/layout';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { useViewMode } from '@/hooks/use-view-mode';
import { Key, Zap } from 'lucide-react';
import { ReactNode } from 'react';
import { useJwtState, JwtMode } from './use-jwt-state';
import { useJwtTransformation } from './use-jwt-transformation';
import { JwtTokenInput } from './JwtTokenInput';
import { JwtPanels } from './JwtPanels';
import { JwtToolbar } from './JwtToolbar';
import { ErrorOverlay } from './ErrorOverlay';
import { cn } from '@/lib/utils';

export default function JwtDebuggerClient(): ReactNode {
  const {
    mode, setMode,
    token, setToken,
    encodeHeader, setEncodeHeader,
    encodePayload, setEncodePayload,
    encodeSecret, setEncodeSecret,
    encodeAlgorithm, setEncodeAlgorithm
  } = useJwtState();

  const { header, payload, encodedToken, error } = useJwtTransformation(
    mode,
    token,
    encodeHeader,
    encodePayload,
    encodeSecret,
    encodeAlgorithm
  );

  const { viewMode, setViewMode } = useViewMode('split');

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.SECURITY]);

  const isSplit: boolean = viewMode === 'split';
  const showEditor: boolean = viewMode === 'editor' || isSplit;
  const showPreview: boolean = viewMode === 'preview' || isSplit;

  const isDecode: boolean = mode === JwtMode.DECODE;

  const t = useTranslations('Tools');
  const tCategories = useTranslations('Categories');
  return (
    <ToolPageLayout
      toolId={ToolId.JWT_DEC}
      title={t(`${ToolId.JWT_DEC}.title`)}
      icon={<Key className="w-5 h-5" />}
      breadcrumbItems={[
        { label: tCategories(Category.SECURITY), href: `/?category=${Category.SECURITY}` },
        { label: t(`${ToolId.JWT_DEC}.title`) }
      ]}
      headerActions={
        <JwtToolbar
          mode={mode}
          setMode={setMode}
          algorithm={encodeAlgorithm}
          setAlgorithm={setEncodeAlgorithm}
          secret={encodeSecret}
          setSecret={setEncodeSecret}
          viewMode={viewMode}
          setViewMode={setViewMode}
          theme={theme}
        />
      }
      footerIndicator={
        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500/30" /> Local Processing</span>
      }
      workspaceClassName={cn('flex-1 min-h-0', isSplit ? 'md:flex-row' : 'flex-col', 'flex-col')}
    >
      <div className={cn('flex-1 flex min-h-0', isSplit ? 'flex-col md:flex-row' : 'flex-col')}>
        {
          showEditor
          && (
            isDecode
              ? (
                <JwtTokenInput
                  token={token}
                  onTokenChange={setToken}
                  className={cn(
                    isSplit ? 'h-[35%] md:h-full md:w-1/3 border-b md:border-b-0 md:border-r' : 'flex-1'
                  )}
                />
              )
              : (
                <JwtPanels
                  header={header}
                  payload={payload}
                  onHeaderChange={setEncodeHeader}
                  onPayloadChange={setEncodePayload}
                  mode="encode"
                  className={cn(
                    isSplit ? 'h-[65%] md:h-full md:w-2/3 border-b md:border-b-0 md:border-r' : 'flex-1'
                  )}
                />
              )
          )
        }

        {
          showPreview
          && (
            isDecode
              ? (
                <JwtPanels
                  header={header}
                  payload={payload}
                  mode="decode"
                  className="flex-1"
                />
              )
              : (
                <JwtTokenInput
                  token={encodedToken}
                  readOnly
                  title="Signed Token"
                  className="flex-1"
                />
              )
          )
        }
      </div>
      <ErrorOverlay error={error} theme={theme} />
    </ToolPageLayout>
  );
}
