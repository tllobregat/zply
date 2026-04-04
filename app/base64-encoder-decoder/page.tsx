import { Metadata } from 'next';
import { ReactNode } from 'react';
import Base64Client from './Base64Client';

export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder | Zply',
  description: 'Instant Base64 encoding and decoding for text or files.',
  openGraph: {
    title: 'Base64 Encoder/Decoder | Zply',
    description: 'Instant Base64 encoding and decoding for text or files.',
    url: 'https://zply.dev/base64-encoder-decoder',
  },
  twitter: {
    title: 'Base64 Encoder/Decoder | Zply',
    description: 'Instant Base64 encoding and decoding for text or files.',
  },
  alternates: {
    canonical: 'https://zply.dev/base64-encoder-decoder',
  },
};

export default function Base64ToolPage(): ReactNode {
  return <Base64Client />;
}
