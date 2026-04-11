import { Metadata } from 'next';
import { ReactNode } from 'react';
import { PrivacyPageClient } from './PrivacyPageClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicy' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    openGraph: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: 'https://zply.dev/privacy',
    },
    twitter: {
      title: t('metadata.title'),
      description: t('metadata.description'),
    },
    alternates: {
      canonical: 'https://zply.dev/privacy',
    },
  };
}

export default function PrivacyPage(): ReactNode {
  return <PrivacyPageClient />;
}
