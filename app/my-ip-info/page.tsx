import { Metadata } from 'next';
import { ReactNode } from 'react';
import MyIpInfoClient from './MyIpInfoClient';

export const metadata: Metadata = {
  title: 'My IP Info | Zply',
  description: 'Get detailed information about your public IP address.',
  openGraph: {
    title: 'My IP Info | Zply',
    description: 'Get detailed information about your public IP address.',
    url: 'https://zply.dev/my-ip-info',
  },
  twitter: {
    title: 'My IP Info | Zply',
    description: 'Get detailed information about your public IP address.',
  },
  alternates: {
    canonical: 'https://zply.dev/my-ip-info',
  },
};

export default function IpInfoPage(): ReactNode {
  return <MyIpInfoClient />;
}
