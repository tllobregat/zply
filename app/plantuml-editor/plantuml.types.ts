import { ReactNode } from 'react';

export interface PlantUmlSnippetItem {
  label: string;
  content: string;
}

export interface PlantUmlSnippetGroup {
  label: string;
  icon: ReactNode;
  items: PlantUmlSnippetItem[];
}

export interface PlantUmlError {
  status?: string,
  error?: string,
  message: string,
  line?: number,
}
