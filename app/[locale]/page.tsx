import { Metadata } from 'next';
import { ReactNode } from 'react';
import HomeClient from './HomeClient';
import Script from 'next/script';
import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    openGraph: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: 'https://zply.dev',
    },
    twitter: {
      title: t('metadata.title'),
      description: t('metadata.description'),
    },
    alternates: {
      canonical: 'https://zply.dev',
    },
  };
}

export default function Home(): ReactNode {
  const t = useTranslations('Index');
  const jsonLd: Record<string, string | object> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': t('metadata.title'),
    'description': t('metadata.description'),
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
      <Script
        id="json-ld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
