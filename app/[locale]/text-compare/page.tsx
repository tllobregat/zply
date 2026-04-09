import { Metadata } from 'next';
import { ReactNode } from 'react';
import TextCompareClient from './TextCompareClient';

export const metadata: Metadata = {
  title: 'Text Compare | Zply',
  description: 'Compare two texts and find differences. Split or Unified view.',
  openGraph: {
    title: 'Text Compare | Zply',
    description: 'Compare two texts and find differences. Split or Unified view.',
    url: 'https://zply.dev/text-compare',
  },
  twitter: {
    title: 'Text Compare | Zply',
    description: 'Compare two texts and find differences. Split or Unified view.',
  },
  alternates: {
    canonical: 'https://zply.dev/text-compare',
  },
};

export default function TextComparePage(): ReactNode {
  return <TextCompareClient />;
}
