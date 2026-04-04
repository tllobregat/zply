import { Metadata } from 'next';
import { ReactNode } from 'react';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Zply - High Quality Developer Toolbox',
  description: 'Ultra-fast, private, and secure developer tools. JSON, YAML, CSV, SQL, JWT, and more.',
};

export default function Home(): ReactNode {
  const jsonLd: Record<string, string | object> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Zply - High Quality Developer Toolbox',
    'description': 'Ultra-fast, private, and secure developer tools. JSON, YAML, CSV, SQL, JWT, and more.',
    'applicationCategory': 'DeveloperTool',
    'operatingSystem': 'Any',
    'url': 'https://zply.dev',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
