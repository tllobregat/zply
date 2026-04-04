import { marked } from 'marked';
import { useEffect, useState } from 'react';

export type UseMarkdownTransformation = {
  html: string;
};

export function useMarkdownTransformation(content: string): UseMarkdownTransformation {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    let frameId: number;
    const renderMarkdown = async (): Promise<void> => {
      let rendered: string = await marked.parse(content || '');
      // Simple sanitization to remove script tags
      rendered = rendered.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      frameId = requestAnimationFrame(() => setHtml(rendered));
    };
    renderMarkdown();
    return (): void => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [content]);

  return { html };
}
