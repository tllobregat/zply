import { Metadata } from 'next';
import { ReactNode } from 'react';
import HashGeneratorClient from './HashGeneratorClient';

export const metadata: Metadata = {
  title: 'Hash Generator | Zply',
  description: 'Generate SHA-256, SHA-512, and MD5 hashes via Web Crypto API.',
  openGraph: {
    title: 'Hash Generator | Zply',
    description: 'Generate SHA-256, SHA-512, and MD5 hashes via Web Crypto API.',
    url: 'https://zply.dev/hash-generator',
  },
  twitter: {
    title: 'Hash Generator | Zply',
    description: 'Generate SHA-256, SHA-512, and MD5 hashes via Web Crypto API.',
  },
  alternates: {
    canonical: 'https://zply.dev/hash-generator',
  },
};

export default function HashGeneratorPage(): ReactNode {
  return <HashGeneratorClient />;
}
