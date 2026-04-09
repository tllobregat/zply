import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Code,
  FoldVertical,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  Quote,
  Strikethrough,
  Terminal,
  UnfoldVertical
} from 'lucide-react';
import React, { ReactNode } from 'react';

interface MarkdownToolbarProps {
  onAction: (prefix: string, suffix: string, placeholder: string, isBlock: boolean) => void;
  onFoldAll: () => void;
  onUnfoldAll: () => void;
}

export function MarkdownToolbar({ 
  onAction, 
  onFoldAll, 
  onUnfoldAll,
}: MarkdownToolbarProps): ReactNode {
  return (
    <div className="hidden lg:flex items-center gap-0.5 bg-island-bg/40 border border-island-border p-1 rounded-xl">
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
      <Separator className="h-4 mx-1" />
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
      <Separator className="h-4 mx-1" />
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
      <Separator className="h-4 mx-1" />
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
