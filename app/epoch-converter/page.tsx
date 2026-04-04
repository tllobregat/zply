import { Metadata } from 'next';
import { ReactNode } from 'react';
import EpochConverterClient from './EpochConverterClient';

export const metadata: Metadata = {
  title: 'Epoch Converter | Zply',
  description: 'Timestamps to readable dates and UTC management.',
  openGraph: {
    title: 'Epoch Converter | Zply',
    description: 'Timestamps to readable dates and UTC management.',
    url: 'https://zply.dev/epoch-converter',
  },
  twitter: {
    title: 'Epoch Converter | Zply',
    description: 'Timestamps to readable dates and UTC management.',
  },
  alternates: {
    canonical: 'https://zply.dev/epoch-converter',
  },
};

export default function EpochConverterPage(): ReactNode {
  return <EpochConverterClient />;
}
