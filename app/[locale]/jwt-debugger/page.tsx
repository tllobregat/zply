import { Metadata } from 'next';
import { ReactNode } from 'react';
import JwtDebuggerClient from './JwtDebuggerClient';
import { getTranslations } from 'next-intl/server';
import { ToolId } from '@/lib/config/tools';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Tools' });
  const toolId: ToolId = ToolId.JWT_DEC;

  return {
    title: `${t(`${toolId}.title`)} | Zply`,
    description: t(`${toolId}.description`),
    openGraph: {
      title: `${t(`${toolId}.title`)} | Zply`,
      description: t(`${toolId}.description`),
      url: `https://zply.dev/jwt-debugger`,
    },
    twitter: {
      title: `${t(`${toolId}.title`)} | Zply`,
      description: t(`${toolId}.description`),
    },
    alternates: {
      canonical: `https://zply.dev/jwt-debugger`,
    },
  };
}

export default function JwtPage(): ReactNode {
  return <JwtDebuggerClient />;
}
