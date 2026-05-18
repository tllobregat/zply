import { createPortal } from 'react-dom';

interface MarkdownPrintAreaProps {
  html: string;
}

export function MarkdownPrintArea({ html }: MarkdownPrintAreaProps) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div id="markdown-print-area" className="hidden print:block">
      <article
        className="prose max-w-none prose-headings:font-black prose-p:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>,
    document.body
  );
}
