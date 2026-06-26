import { Button } from '@/components/ui/button';
import { ViewModeToggle } from '@/components/ui/layout';
import { cn } from '@/lib/utils';
import { Code, Download, Image as ImageIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { MermaidSnippets } from './MermaidSnippets';

interface MermaidToolbarProps {
  viewMode: 'editor' | 'split' | 'preview';
  setViewMode: (mode: 'editor' | 'split' | 'preview') => void;
  onCopy: () => void;
  onCopyAsImage: () => void;
  onDownload: () => void;
  onSelectSnippet: (snippet: string) => void;
  isCopied: (type: string) => boolean;
  isRendering: boolean;
  hasSvg: boolean;
  onInitEngine: () => void;
  isDropdown?: boolean;
}

export function MermaidToolbar(
  {
    viewMode,
    setViewMode,
    onCopy,
    onCopyAsImage,
    onDownload,
    onSelectSnippet,
    isCopied,
    isRendering,
    hasSvg,
    onInitEngine,
    isDropdown = false,
  }: MermaidToolbarProps,
): React.ReactNode {
  useEffect(() => {
    onInitEngine();
  }, [onInitEngine]);

  return (
    <div className={cn("flex items-center gap-3", isDropdown && "flex-col items-stretch")}>
      <ViewModeToggle 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        className={cn(isDropdown && "w-full")}
      />
      
      <div className={cn("flex items-center gap-2", isDropdown && "grid grid-cols-2")}>
        <MermaidSnippets onSelect={onSelectSnippet} />
        <CopyButton
          onCopy={onCopy}
          disabled={!hasSvg || isRendering}
          variant="tab"
          size="sm"
          className="gap-2"
          isCopied={isCopied('svg')}
          copyText="SVG"
          copiedText="Copied"
          showIcon={!isCopied('svg')}
        >
          {!isCopied('svg') && <Code className="w-3.5 h-3.5" />}
        </CopyButton>
        <CopyButton
          onCopy={onCopyAsImage}
          disabled={!hasSvg || isRendering}
          variant="tab"
          size="sm"
          className="gap-2"
          isCopied={isCopied('image')}
          copyText="Image"
          copiedText="Copied"
          showIcon={!isCopied('image')}
        >
          {!isCopied('image') && <ImageIcon className="w-3.5 h-3.5" />}
        </CopyButton>
        <Button
          onClick={onDownload}
          disabled={!hasSvg || isRendering}
          variant="tab"
          size="sm"
          className={cn("gap-2", isDropdown && "col-span-2")}
        >
          <Download className="w-3.5 h-3.5" /> 
          <span>Export SVG</span>
        </Button>
      </div>
    </div>
  );
}
