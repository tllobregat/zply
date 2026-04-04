// app/[tool-id]/page.tsx (Server Component)
import { Metadata } from 'next';
import { ReactNode } from 'react';
import MyNewToolPageClient from './MyNewToolPageClient';

export const metadata: Metadata = {
  title: 'My New Tool | Zply',
  description: 'Detailed description of the tool for SEO.',
  openGraph: {
    title: 'My New Tool | Zply',
    description: '...',
    url: 'https://zply.dev/my-new-tool',
  },
  twitter: {
    title: 'My New Tool | Zply',
    description: '...',
  },
  alternates: {
    canonical: 'https://zply.dev/my-new-tool',
  },
};

export default function MyNewToolPage(): ReactNode {
  return <MyNewToolPageClient />;
}

// app/[tool-id]/MyNewToolPageClient.tsx (Client Component)
'use client';

import ToolPageLayout from '@/components/tool-page-layout';
import { useShareableState } from '@/hooks/use-shareable-state';
import { Category, ToolId } from '@/lib/config/tools';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Activity, Zap } from 'lucide-react';
import { useMemo, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function MyNewToolPageClient(): ReactNode {
  const [input, setInput] = useShareableState<string>('i', '');
  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.DATA]);

  // Core tool logic
  const result: string = useMemo(() => {
    if (!input) return '';
    return input.toUpperCase(); // Example logic
  }, [input]);

  return (
    <ToolPageLayout
      toolId={ToolId.MY_NEW_TOOL}
      title="My New Tool"
      icon={<Activity className="w-5 h-5" />}
      breadcrumbItems={[
        { label: Category.DATA, href: `/?category=${Category.DATA}` },
        { label: 'My New Tool' }
      ]}
      footerIndicator={
        <span className={cn("flex items-center gap-1.5 opacity-80", theme.text)}>
          <Zap className="w-3 h-3" /> Real-time results
        </span>
      }
      workspaceClassName="md:flex-row"
    >
      {/* Input Section */}
      <div className="flex-1 border-r border-island-border p-8">
        <textarea
          className={cn(
            "w-full h-full bg-transparent border-none focus:ring-0 resize-none",
            theme.selection
          )}
          placeholder="Entrez du texte..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Output Section */}
      <div className="flex-1 p-8 bg-island-bg/10">
        <div className="text-muted-foreground uppercase text-[10px] font-black mb-4">Resultat</div>
        <pre className="whitespace-pre-wrap">{result}</pre>
      </div>
    </ToolPageLayout>
  );
}
