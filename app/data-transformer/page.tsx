import { Metadata } from 'next';
import { ReactNode } from 'react';
import DataTransformerPageClient from './DataTransformerPageClient';

export const metadata: Metadata = {
  title: 'Data Transformer | Zply',
  description: 'Convert between JSON, YAML, CSV, XML, and TypeScript formats instantly.',
  openGraph: {
    title: 'Data Transformer | Zply',
    description: 'Convert between JSON, YAML, CSV, XML, and TypeScript formats instantly.',
    url: 'https://zply.dev/data-transformer',
  },
  twitter: {
    title: 'Data Transformer | Zply',
    description: 'Convert between JSON, YAML, CSV, XML, and TypeScript formats instantly.',
  },
  alternates: {
    canonical: 'https://zply.dev/data-transformer',
  },
};

export default function DataTransformerPage(): ReactNode {
  return <DataTransformerPageClient />;
}
