'use client';

import { JsonToolbar } from '@/app/[locale]/json-utils/JsonToolbar';
import { JsonTreeView } from '@/app/[locale]/json-utils/JsonTreeView';
import { useJsonActions } from '@/app/[locale]/json-utils/use-json-actions';
import { useJsonState } from '@/app/[locale]/json-utils/use-json-state';
import { useJsonTransformation } from '@/app/[locale]/json-utils/use-json-transformation';
import { ToolPageLayout }from '@/components/ui/layout';
import { Separator } from '@/components/ui/separator';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import MonacoEditor from '@/components/monaco-editor';
import { AlertCircle, Check, FileJson } from 'lucide-react';
import type * as monaco from 'monaco-editor';
import { useTheme } from 'next-themes';
import React, { ReactNode, RefObject, useRef } from 'react';

export default function JsonUtilsPageClient(): ReactNode {
  const { resolvedTheme } = useTheme();
  const editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null> = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const { content, setContent, viewMode, setViewMode } = useJsonState();
  const { parsedContent, error } = useJsonTransformation(content);
  const { formatJson, minifyJson, foldAll, unfoldAll } = useJsonActions(content, setContent, editorRef);

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.DATA]);

  const t = useTranslations('Tools');
  const tCategories = useTranslations('Categories');
  return (
    <ToolPageLayout
      toolId={ToolId.JSON_UTILS}
      title={t(`${ToolId.JSON_UTILS}.title`)}
      icon={<FileJson className="w-5 h-5" />}
      breadcrumbItems={[
        { label: tCategories(Category.DATA), href: `/?category=${Category.DATA}` },
        { label: t(`${ToolId.JSON_UTILS}.title`) }
      ]}
      headerActions={
        <JsonToolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          onFormat={formatJson}
          onMinify={minifyJson}
          onFoldAll={foldAll}
          onUnfoldAll={unfoldAll}
          theme={theme}
        />
      }
      footerIndicator={
        <div className="flex gap-6">
          {
            error
              ? (
                <span className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" /> {t('json-utils.invalidJson')}: {error}
                </span>
              )
              : (
                <span className={cn("flex items-center gap-2 opacity-80", theme.text)}>
                  <Check className="w-3.5 h-3.5" /> {t('json-utils.validJson')}
                </span>
              )
          }
          <Separator />
          <span>{useTranslations('Common')('charsCount', { count: content.length })}</span>
        </div>
      }
      workspaceClassName="flex-1 min-h-0"
    >
      <div className="flex-1 flex flex-col min-h-0 bg-island-bg/20">
        {
          viewMode === 'editor'
            ? (
              <MonacoEditor
                height="100%"
                defaultLanguage="json"
                value={content}
                theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                onChange={(value: string | undefined) => setContent(value || '')}
                onMount={(editor: monaco.editor.IStandaloneCodeEditor) => {
                  editorRef.current = editor;
                }}
              />
            )
            : (
              <div className="flex-1 overflow-auto p-8 custom-scrollbar bg-black/20">
                <JsonTreeView
                  parsedContent={parsedContent}
                  error={error}
                  setViewMode={setViewMode}
                />
              </div>
            )
        }
      </div>
    </ToolPageLayout>
  );
}
