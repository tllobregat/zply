'use client';

import { Base64Mode, InputType, TransformationResult } from '@/app/base64-encoder-decoder/base64.types';
import { Base64FileUpload } from '@/app/base64-encoder-decoder/Base64FileUpload';
import { Base64Preview } from '@/app/base64-encoder-decoder/Base64Preview';
import { Base64PreviewHeader } from '@/app/base64-encoder-decoder/Base64PreviewHeader';
import { Base64Toolbar } from '@/app/base64-encoder-decoder/Base64Toolbar';
import { useBase64File } from '@/app/base64-encoder-decoder/use-base64-file';
import { useBase64State } from '@/app/base64-encoder-decoder/use-base64-state';
import { useBase64Transformation } from '@/app/base64-encoder-decoder/use-base64-transformation';
import { EditorPreviewWorkspace } from '@/components/editor-preview-workspace';
import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useViewMode, ViewMode } from '@/hooks/use-view-mode';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';
import { Binary, Zap } from 'lucide-react';
import React, { ReactNode } from 'react';

const MAX_DISPLAY_LENGTH: number = 50000; // 50KB limit for live display

export default function Base64Client(): ReactNode {
  const { inputType, fileInfo, fileRawBase64, handleFileUpload, clearFile } = useBase64File();
  const { state, updateState, handleTextChange } = useBase64State();
  const transformation: TransformationResult = useBase64Transformation(state, inputType, fileRawBase64);

  const { viewMode, setViewMode }: { viewMode: ViewMode; setViewMode: (v: ViewMode) => void } = useViewMode('split');
  const { copy, isCopied }: { copy: (t: string) => void; isCopied: () => boolean } = useCopyToClipboard();

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.ENCODING]);
  const { result, error, isImage, imageType } = transformation;
  const isTooLarge: boolean = result.length > MAX_DISPLAY_LENGTH;

  const handleDownload = (): void => {
    if (!result) return;
    const blob: Blob = new Blob([result], { type: 'text/plain' });
    const url: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = `zply-base64-${state.mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      toolId={ToolId.BASE64}
      title="Base64 Tool"
      icon={<Binary className="w-5 h-5" />}
      breadcrumbItems={[
        { label: 'Encoding', href: `/?category=${Category.ENCODING}` },
        { label: 'Base64 Tool' }
      ]}
      headerActions={
        <Base64Toolbar
          mode={state.mode}
          inputType={state.inputType}
          theme={theme}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onModeChange={(mode: Base64Mode): void => updateState({ mode })}
          onInputTypeChange={(inputType: InputType): void => updateState({ inputType })}
        />
      }
      footerIndicator={
        <>
          <span className={cn('flex items-center gap-1.5 opacity-80', theme.text)}>
            <Zap className="w-3 h-3" /> UTF-8 Support
          </span>
          <Separator />
          <span>{state.inputType === 'file' ? 'Binary File' : 'Plain Text'} Mode</span>
        </>
      }
      workspaceClassName="flex-col md:flex-row"
    >
      <EditorPreviewWorkspace
        value={state.input}
        onChange={(val: string): void => handleTextChange(val, state.inputType, clearFile)}
        language={state.mode === 'decode' ? 'plaintext' : 'markdown'}
        viewMode={viewMode}
        customEditor={
          state.inputType === 'file' 
            ? (
              <div className="h-full flex flex-col justify-center">
                <Base64FileUpload
                  fileInfo={fileInfo}
                  theme={theme}
                  onFileUpload={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    handleFileUpload(e, (mode): void => updateState({ mode, inputType: 'file' }))
                  }
                  onClearFile={() => {
                    clearFile();
                    updateState({ inputType: 'text' });
                  }}
                />
              </div>
            )
            : undefined
        }
        editorProps={{
          options: {
            lineNumbers: 'on',
            wordWrap: 'on',
          }
        }}
        preview={
          <div className="flex flex-col h-full">
            <Base64PreviewHeader
              isImage={isImage}
              fileInfo={fileInfo}
              theme={theme}
              result={result}
              isCopied={isCopied()}
              onDownload={handleDownload}
              onCopy={copy}
            />

            <div className="flex-1 relative overflow-hidden bg-black/5">
              <AnimatePresence mode="wait">
                <Base64Preview
                  result={result}
                  error={error}
                  isImage={isImage}
                  imageType={imageType}
                  isTooLarge={isTooLarge}
                  onCopy={(): void => copy(result)}
                  onDownload={handleDownload}
                  theme={theme}
                />
              </AnimatePresence>
            </div>
          </div>
        }
      />
    </ToolPageLayout>
  );
}
