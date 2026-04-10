import { Metadata } from 'next';
import { ReactNode } from 'react';
import { PrivacyPageClient } from './PrivacyPageClient';

export const metadata: Metadata = {
  title: 'Privacy & Security | Zply',
  description: 'Learn how Zply ensures your data privacy with 100% client-side processing and zero-cookie policy.',
  openGraph: {
    title: 'Privacy & Security | Zply',
    description: 'Learn how Zply ensures your data privacy with 100% client-side processing and zero-cookie policy.',
    url: 'https://zply.dev/privacy',
  },
  twitter: {
    title: 'Privacy & Security | Zply',
    description: 'Learn how Zply ensures your data privacy with 100% client-side processing and zero-cookie policy.',
  },
  alternates: {
    canonical: 'https://zply.dev/privacy',
  },
};

export default function PrivacyPage(): ReactNode {
  return <PrivacyPageClient />;
}
