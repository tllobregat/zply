import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Code,
  FoldVertical,
  Heading1,
  Heading2,
  Heading3,
  ChevronUp,
  ChevronDown,
  Italic,
  Link,
  List,
  FolderOpen,
  Printer,
  Quote,
  Sigma,
  Strikethrough,
  Terminal,
  UnfoldVertical
} from 'lucide-react';
import React, { ReactNode, useRef } from 'react';

interface MarkdownToolbarProps {
  onAction: (prefix: string, suffix: string, placeholder: string, isBlock: boolean) => void;
  onFoldAll: () => void;
  onUnfoldAll: () => void;
  onShiftHeaders: (direction: 'up' | 'down') => void;
  onLoadFile: (content: string) => void;
  onExportPdf: () => void;
  loadFileLabel?: string;
  exportPdfLabel?: string;
  mathLabel?: string;
}

export function MarkdownToolbar(
  {
    onAction,
    onFoldAll,
    onUnfoldAll,
    onShiftHeaders,
    onLoadFile,
    onExportPdf,
    loadFileLabel = 'Load File',
    exportPdfLabel = 'Export to PDF',
    mathLabel = 'Mathematical Formula'
  }: MarkdownToolbarProps,
): ReactNode {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onLoadFile(content);
      }
    };
    reader.readAsText(file);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div className="hidden lg:flex flex-wrap items-center gap-0.5 bg-island-bg/40 border border-island-border p-1 rounded-xl">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title={loadFileLabel}
        onClick={() => fileInputRef.current?.click()}
      >
        <FolderOpen className="w-4 h-4" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".md,.markdown,text/markdown,text/plain"
        onChange={handleFileChange}
      />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title={exportPdfLabel}
        onClick={onExportPdf}
      >
        <Printer className="w-4 h-4" />
      </Button>
      <Separator className="h-4 mx-1 hidden xl:block" />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Titre 1"
        onClick={() => onAction('# ', '', 'Titre 1', true)}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Titre 2"
        onClick={() => onAction('## ', '', 'Titre 2', true)}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Titre 3"
        onClick={() => onAction('### ', '', 'Titre 3', true)}
      >
        <Heading3 className="w-4 h-4" />
      </Button>
      <Separator className="h-4 mx-1 hidden 2xl:block" />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Shift Headers (Hn -> Hn-1)"
        onClick={() => onShiftHeaders('up')}
      >
        <ChevronUp className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Shift Headers (Hn -> Hn+1)"
        onClick={() => onShiftHeaders('down')}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
      <Separator className="h-4 mx-1 hidden xl:block" />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Gras"
        onClick={() => onAction('**', '**', 'texte', false)}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Italique"
        onClick={() => onAction('*', '*', 'texte', false)}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Barré"
        onClick={() => onAction('~~', '~~', 'texte', false)}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Separator className="h-4 mx-1 hidden 2xl:block" />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Lien"
        onClick={() => onAction('[', '](https://)', 'lien', false)}
      >
        <Link className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Liste"
        onClick={() => onAction('- ', '', 'élément', true)}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Citation"
        onClick={() => onAction('> ', '', 'citation', true)}
      >
        <Quote className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Code"
        onClick={() => onAction('`', '`', 'code', false)}
      >
        <Code className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Bloc de code"
        onClick={() => onAction('```\n', '\n```', 'code', true)}
      >
        <Terminal className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title={mathLabel}
        onClick={() => onAction('$$\n', '\n$$', 'e = mc^2', true)}
      >
        <Sigma className="w-4 h-4" />
      </Button>
      <Separator className="h-4 mx-1 hidden xl:block" />
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Tout plier"
        onClick={onFoldAll}
      >
        <FoldVertical className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-lg"
        title="Tout déplier"
        onClick={onUnfoldAll}
      >
        <UnfoldVertical className="w-4 h-4" />
      </Button>
    </div>
  );
}
