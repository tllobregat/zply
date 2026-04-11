import { ToolConfig } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import Script from 'next/script';
import React from 'react';

interface ToolPageJsonLdProps {
  toolId: string;
  title: string;
  toolConfig?: ToolConfig;
}

export function ToolPageJsonLd({ toolId, title, toolConfig }: ToolPageJsonLdProps) {
  const t = useTranslations('Tools');
  const features = toolConfig ? t.raw(`${toolConfig.id}.features`) as string[] | undefined : undefined;

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': `${title} - Zply`,
    'description': toolConfig ? t(`${toolConfig.id}.description`) : '',
    'applicationCategory': 'DeveloperTool',
    'operatingSystem': 'Any',
    'url': `https://zply.dev${toolConfig?.href}`,
    'featureList': Array.isArray(features) ? features.join(', ') : undefined,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  });

  return (
    <Script
      id={`json-ld-${toolId}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
