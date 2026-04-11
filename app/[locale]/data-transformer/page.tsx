import { Metadata } from 'next';
import { ReactNode } from 'react';
import DataTransformerPageClient from './DataTransformerPageClient';
import { getTranslations } from 'next-intl/server';
import { ToolId } from '@/lib/config/tools';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Tools' });
  const toolId: ToolId = ToolId.DATA_TRANSFORMER;

  return {
    title: `${t(`${toolId}.title`)} | Zply`,
    description: t(`${toolId}.description`),
    openGraph: {
      title: `${t(`${toolId}.title`)} | Zply`,
      description: t(`${toolId}.description`),
      url: `https://zply.dev/data-transformer`,
    },
    twitter: {
      title: `${t(`${toolId}.title`)} | Zply`,
      description: t(`${toolId}.description`),
    },
    alternates: {
      canonical: `https://zply.dev/data-transformer`,
    },
  };
}

export default function DataTransformerPage(): ReactNode {
  return <DataTransformerPageClient />;
}
