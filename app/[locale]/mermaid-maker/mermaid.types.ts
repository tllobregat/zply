import { ReactNode } from 'react';

export type MermaidError = {
  message: string;
  line?: number;
  hash?: string;
};

export type MermaidSnippet = {
  id: string;
  content: string;
};

export type MermaidSnippetGroup = {
  id: string;
  icon: ReactNode;
  items: MermaidSnippet[];
};
