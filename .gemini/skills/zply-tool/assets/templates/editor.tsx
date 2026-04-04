// app/[tool-id]/page.tsx (Server Component)
import { Metadata } from 'next';
import { ReactNode } from 'react';
import MyEditorToolPageClient from './MyEditorToolPageClient';

export const metadata: Metadata = {
  title: 'Editor Tool | Zply',
  description: 'Detailed description of the tool for SEO.',
  openGraph: {
    title: 'Editor Tool | Zply',
    description: '...',
    url: 'https://zply.dev/editor-tool',
  },
  twitter: {
    title: 'Editor Tool | Zply',
    description: '...',
  },
  alternates: {
    canonical: 'https://zply.dev/editor-tool',
  },
};

export default function MyEditorToolPage(): ReactNode {
  return <MyEditorToolPageClient />;
}

// app/[tool-id]/MyEditorToolPageClient.tsx (Client Component)
'use client';

import { EditorPreviewWorkspace } from '@/components/editor-preview-workspace';
import ToolPageLayout from '@/components/tool-page-layout';
import { Separator } from '@/components/ui/separator';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { useShareableState } from '@/hooks/use-shareable-state';
import { useViewMode } from '@/hooks/use-view-mode';
import { CATEGORY_COLORS, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { FileCode, Zap } from 'lucide-react';
import { useMemo, ReactNode } from 'react';

const DEFAULT_CONTENT: string = `// Your code here`;

export default function MyEditorToolPageClient(): ReactNode {
  const [content, setContent] = useShareableState<string>('c', DEFAULT_CONTENT);
  const { viewMode, setViewMode } = useViewMode('split');
  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.VISUALISATION]);

  // Preview rendering logic
  const rendered: string = useMemo(() => {
    return content; // Transform content to preview format
  }, [content]);

  return (
    <ToolPageLayout
      toolId={ToolId.MY_EDITOR_TOOL}
      title="Editor Tool"
      icon={<FileCode className="w-5 h-5" />}
      breadcrumbItems={[
        { label: Category.VISUALISATION, href: `/?category=${Category.VISUALISATION}` },
        { label: 'Editor Tool' }
      ]}
      headerActions={
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      }
      footerIndicator={
        <>
          <span className={cn("flex items-center gap-1.5 opacity-80", theme.text)}>
            <Zap className="w-3 h-3" /> Live Preview
          </span>
          <Separator />
          <span>{content.length} chars</span>
        </>
      }
      workspaceClassName="flex-row overflow-hidden"
    >
      <EditorPreviewWorkspace
        value={content}
        onChange={setContent}
        language="javascript" // monaco language ID
        viewMode={viewMode}
        previewClassName="p-8"
        preview={
          <div className="prose prose-invert max-w-none">
            {/* Render preview here */}
            <pre>{rendered}</pre>
          </div>
        }
      />
    </ToolPageLayout>
  );
}
