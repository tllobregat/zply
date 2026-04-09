import { Metadata } from 'next';
import { ReactNode } from 'react';
import TimezoneConverterClient from './TimezoneConverterClient';

export const metadata: Metadata = {
  title: 'Timezone Converter | Zply',
  description: 'Compare times between different time zones.',
  openGraph: {
    title: 'Timezone Converter | Zply',
    description: 'Compare times between different time zones.',
    url: 'https://zply.dev/timezone-converter',
  },
  twitter: {
    title: 'Timezone Converter | Zply',
    description: 'Compare times between different time zones.',
  },
  alternates: {
    canonical: 'https://zply.dev/timezone-converter',
  },
};

export default function TimezoneConverterPage(): ReactNode {
  return <TimezoneConverterClient />;
}
