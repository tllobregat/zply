import { MermaidSnippetGroup, MermaidSnippet } from './mermaid.types';
import React, { useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FileCode } from 'lucide-react';
import { getSnippetGroups } from './mermaid.snippets';
import { useTranslations } from 'next-intl';

interface MermaidSnippetsProps {
  onSelect: (snippet: string) => void;
}

export function MermaidSnippets({ onSelect }: MermaidSnippetsProps): React.ReactNode {
  const t = useTranslations('Tools.mermaid-maker.snippets');

  const snippetGroups = useMemo(() => getSnippetGroups(t), [t]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="tab" size="sm" className="gap-2">
          <FileCode className="w-3.5 h-3.5" /> {t('title')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          snippetGroups.map((group: MermaidSnippetGroup, gi: number) => (
            <React.Fragment key={group.id}>
              <DropdownMenuLabel className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                {group.icon}
                <span>{t(`groups.${group.id}`)}</span>
              </DropdownMenuLabel>
              {
                group.items.map((item: MermaidSnippet) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => onSelect(item.content)}
                    className="cursor-pointer pl-8"
                  >
                    <span>{t(`items.${item.id}`)}</span>
                  </DropdownMenuItem>
                ))
              }
              {gi < snippetGroups.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
