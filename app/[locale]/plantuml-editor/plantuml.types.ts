import { ReactNode } from 'react';

export interface PlantUmlSnippetItem {
  id: string;
  content: string;
}

export interface PlantUmlSnippetGroup {
  id: string;
  icon: ReactNode;
  items: PlantUmlSnippetItem[];
}

export interface PlantUmlError {
  status?: string,
  error?: string,
  message: string,
  line?: number,
}
