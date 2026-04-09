import { Metadata } from 'next';
import { ReactNode } from 'react';
import JsonUtilsPageClient from './JsonUtilsPageClient';

export const metadata: Metadata = {
  title: 'JSON Utils | Zply',
  description: 'Instant JSON visualization, indentation, validation, and minification.',
  openGraph: {
    title: 'JSON Utils | Zply',
    description: 'Instant JSON visualization, indentation, validation, and minification.',
    url: 'https://zply.dev/json-utils',
  },
  twitter: {
    title: 'JSON Utils | Zply',
    description: 'Instant JSON visualization, indentation, validation, and minification.',
  },
  alternates: {
    canonical: 'https://zply.dev/json-utils',
  },
};

export default function JsonUtilsPage(): ReactNode {
  return <JsonUtilsPageClient />;
}
