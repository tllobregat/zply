import { PlantUmlSnippetGroup, PlantUmlSnippetItem } from '@/app/plantuml-editor/plantuml.types';
import React from 'react';
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
import { SNIPPET_GROUPS } from './plantuml.snippets';

interface PlantUmlSnippetsProps {
  onSelect: (snippet: string) => void;
}

export function PlantUmlSnippets({ onSelect }: PlantUmlSnippetsProps): React.ReactNode {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="tab" size="sm" className="gap-2">
          <FileCode className="w-3.5 h-3.5" /> Snippets
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>PlantUML Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {
          SNIPPET_GROUPS.map((group: PlantUmlSnippetGroup, gi: number) => (
            <React.Fragment key={group.label}>
              <DropdownMenuLabel className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                {group.icon}
                <span>{group.label}</span>
              </DropdownMenuLabel>
              {
                group.items.map((item: PlantUmlSnippetItem) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => onSelect(item.content)}
                    className="cursor-pointer pl-8"
                  >
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))
              }
              {gi < SNIPPET_GROUPS.length - 1 && <DropdownMenuSeparator />}
            </React.Fragment>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
