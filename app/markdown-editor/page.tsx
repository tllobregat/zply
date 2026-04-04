import { Metadata } from 'next';
import { ReactNode } from 'react';
import MarkdownPageClient from './MarkdownPageClient';

export const metadata: Metadata = {
  title: 'Markdown Editor | Zply',
  description: 'Ultra-fast GitHub Flavored Markdown (GFM) editor with split-screen preview.',
  openGraph: {
    title: 'Markdown Editor | Zply',
    description: 'Ultra-fast GitHub Flavored Markdown (GFM) editor with split-screen preview.',
    url: 'https://zply.dev/markdown-editor',
  },
  twitter: {
    title: 'Markdown Editor | Zply',
    description: 'Ultra-fast GitHub Flavored Markdown (GFM) editor with split-screen preview.',
  },
  alternates: {
    canonical: 'https://zply.dev/markdown-editor',
  },
};

export default function MarkdownPage(): ReactNode {
  return <MarkdownPageClient />;
}
