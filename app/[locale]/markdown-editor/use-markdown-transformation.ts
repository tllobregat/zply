import { marked } from 'marked';
import { useEffect, useState, useTransition } from 'react';

export type UseMarkdownTransformation = {
  html: string;
  isPending: boolean;
};

export function useMarkdownTransformation(content: string): UseMarkdownTransformation {
  const [html, setHtml] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    
    const renderMarkdown = async (): Promise<void> => {
      try {
        const rendered: string = await marked.parse(content || '');
        if (!active) return;
        
        // Sanitize to remove script tags
        const sanitized = rendered.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        // Use transition to avoid blocking UI during heavy renders
        startTransition(() => {
          setHtml(sanitized);
        });
      } catch (error) {
        console.error('Failed to parse markdown', error);
      }
    };

    renderMarkdown();
    
    return (): void => {
      active = false;
    };
  }, [content]);

  return { html, isPending };
}
