import { Metadata } from 'next';
import { ReactNode } from 'react';
import VisualizerClient from './VisualizerClient';

export const metadata: Metadata = {
  title: 'SQL & DB Visualizer | Zply',
  description: 'Generate interactive ER diagrams from SQL or Prisma locally and securely.',
  openGraph: {
    title: 'SQL & DB Visualizer | Zply',
    description: 'Generate interactive ER diagrams from SQL or Prisma locally and securely.',
    url: 'https://zply.dev/sql-database-visualizer',
  },
  twitter: {
    title: 'SQL & DB Visualizer | Zply',
    description: 'Generate interactive ER diagrams from SQL or Prisma locally and securely.',
  },
  alternates: {
    canonical: 'https://zply.dev/sql-database-visualizer',
  },
};

export default function DbSchemaPage(): ReactNode {
  return <VisualizerClient />;
}
