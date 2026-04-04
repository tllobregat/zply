import { Metadata } from 'next';
import { ReactNode } from 'react';
import JwtDebuggerClient from './JwtDebuggerClient';

export const metadata: Metadata = {
  title: 'JWT Debugger | Zply',
  description: 'Secure and local decoding and encoding of JSON Web Tokens (JWT).',
  openGraph: {
    title: 'JWT Debugger | Zply',
    description: 'Secure and local decoding and encoding of JSON Web Tokens (JWT).',
    url: 'https://zply.dev/jwt-debugger',
  },
  twitter: {
    title: 'JWT Debugger | Zply',
    description: 'Secure and local decoding and encoding of JSON Web Tokens (JWT).',
  },
  alternates: {
    canonical: 'https://zply.dev/jwt-debugger',
  },
};

export default function JwtPage(): ReactNode {
  return <JwtDebuggerClient />;
}
