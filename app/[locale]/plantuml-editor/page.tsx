import { Metadata } from 'next';
import { ReactNode } from 'react';
import PlantUmlPageClient from './PlantUmlPageClient';

export const metadata: Metadata = {
  title: 'PlantUML Editor | Zply',
  description: 'Design UML diagrams via text. Real-time preview and sharing by URI.',
  openGraph: {
    title: 'PlantUML Editor | Zply',
    description: 'Design UML diagrams via text. Real-time preview and sharing by URI.',
    url: 'https://zply.dev/plantuml-editor',
  },
  twitter: {
    title: 'PlantUML Editor | Zply',
    description: 'Design UML diagrams via text. Real-time preview and sharing by URI.',
  },
  alternates: {
    canonical: 'https://zply.dev/plantuml-editor',
  },
};

export default function PlantUmlPage(): ReactNode {
  return <PlantUmlPageClient />;
}
