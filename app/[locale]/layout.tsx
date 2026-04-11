import { CommandMenu } from '@/components/command-menu';
import { DevTool } from '@/components/dev-tool';
import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/sidebar';
import type { Metadata } from 'next';
import { NextFontWithVariable } from 'next/dist/compiled/@next/font';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import React from 'react';
import { Analytics } from "@vercel/analytics/next"
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { ClientThemeProvider } from '@/components/client-theme-provider';

const geistSans: NextFontWithVariable = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono: NextFontWithVariable = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Zply - High Quality Developer Toolbox',
  description: 'A fast, privacy-focused toolbox for developers. Zero backend, zero cookies, zero database.',
  keywords: ['developer tools', 'toolbox', 'json formatter', 'jwt decoder', 'sql visualizer', 'base64', 'privacy-focused'],
  authors: [{ name: 'tllobregat' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zply.dev',
    siteName: 'Zply',
    title: 'Zply - High Quality Developer Toolbox',
    description: 'Ultra-fast, private, and secure developer tools. JSON, YAML, CSV, SQL, JWT, and more.',
    images: [
      {
        url: 'https://zply.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zply Developer Toolbox',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zply - High Quality Developer Toolbox',
    description: 'Ultra-fast, private, and secure developer tools. JSON, YAML, CSV, SQL, JWT, and more.',
    images: ['https://zply.dev/og-image.png'],
    creator: '@tllobregat',
  },
  alternates: {
    canonical: 'https://zply.dev',
  },
  metadataBase: new URL('https://zply.dev'),
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
    <body
      className="h-dvh flex overflow-hidden selection:bg-zply-blue/30 selection:text-zply-blue transition-colors duration-300"
    >
      <ClientThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {/* Dynamic Background with Depth */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zply-blue/10 rounded-full blur-[160px] animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zply-purple/10 rounded-full blur-[140px]" />
            </div>

            <div className="flex flex-col-reverse sm:flex-row w-full h-full py-2 sm:py-3 gap-8 sm:gap-6">
              {/* Navigation (Sidebar on desktop, Bottom bar on mobile) */}
              <Sidebar />

              {/* Main Workspace */}
              <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {children}
              </main>
            </div>

            <CommandMenu />
            <DevTool />
          </Providers>
          <Analytics />
        </NextIntlClientProvider>
      </ClientThemeProvider>
    </body>
    </html>
  );
}
