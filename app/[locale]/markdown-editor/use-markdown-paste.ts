import type * as monaco from 'monaco-editor';
import { RefObject, useCallback, useState } from 'react';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

export interface PendingPaste {
  text: string;
  html?: string;
  selection: monaco.Selection;
}

export function useMarkdownPaste(editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>) {
  const [isPasteModalOpen, setIsPasteModalOpen] = useState<boolean>(false);
  const [pendingPaste, setPendingPaste] = useState<PendingPaste | null>(null);

  const handleConfirmPaste = useCallback((useHtml: boolean = false): void => {
    if (pendingPaste && editorRef.current) {
      let textToInsert = pendingPaste.text;

      if (useHtml && pendingPaste.html) {
        try {
          const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
          });
          turndownService.use(gfm);

          // Custom rule to handle tables that don't have <th> in the first row
          turndownService.addRule('table-no-th', {
            filter: (node) => {
              const tableNode = node as HTMLTableElement;
              return tableNode.nodeName === 'TABLE' &&
                tableNode.rows &&
                tableNode.rows.length > 0 &&
                !Array.from(tableNode.rows[0].cells).every(cell => cell.nodeName === 'TH');
            },
            replacement: (content) => {
              const cleanContent = content.replace(/\n\n+/g, '\n');
              const rows = cleanContent.split('\n').filter(r => r.trim().startsWith('|'));
              if (rows.length > 0) {
                const firstRow = rows[0];
                const columnCount = (firstRow.match(/\|/g) || []).length - 1;
                if (columnCount > 0) {
                  const separator = '|' + ' --- |'.repeat(columnCount);
                  rows.splice(1, 0, separator);
                }
                return '\n\n' + rows.join('\n') + '\n\n';
              }
              return '\n\n' + cleanContent + '\n\n';
            }
          });

          const convertedMarkdown = turndownService.turndown(pendingPaste.html);
          textToInsert = convertedMarkdown
            .split('\n')
            .map(line => line.trimEnd())
            .join('\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        } catch (err) {
          console.error('Failed to convert HTML to Markdown:', err);
          textToInsert = pendingPaste.text;
        }
      }

      editorRef.current.executeEdits('paste-confirmation', [
        {
          range: pendingPaste.selection,
          text: textToInsert,
          forceMoveMarkers: true,
        },
      ]);
      editorRef.current.focus();
    }
    setIsPasteModalOpen(false);
    setPendingPaste(null);
  }, [pendingPaste, editorRef]);

  const interceptPaste = useCallback(async (editor: monaco.editor.IStandaloneCodeEditor) => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      let text = '';
      let htmlContent = '';
      let hasHtml = false;

      for (const item of clipboardItems) {
        if (item.types.includes('text/html')) {
          const blob = await item.getType('text/html');
          htmlContent = await blob.text();
          hasHtml = true;
        }
        if (item.types.includes('text/plain')) {
          const blob = await item.getType('text/plain');
          text = await blob.text();
        }
      }

      if (!text && !htmlContent) return;

      const selection = editor.getSelection();
      if (!selection) return;

      if (hasHtml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const interestingElements = ['table', 'a', 'strong', 'b', 'em', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'img', 'code', 'pre', 'blockquote', 'hr', 'del', 's', 'math'];
        const isInteresting = interestingElements.some(tag => doc.querySelector(tag)) ||
          doc.querySelector('[data-equation-content]') !== null ||
          Array.from(doc.querySelectorAll('img')).some(img => {
            const alt = img.getAttribute('alt') || '';
            return alt.includes('\\') || alt.includes('$');
          });

        if (isInteresting) {
          setPendingPaste({ text, html: htmlContent, selection });
          setIsPasteModalOpen(true);
        } else {
          editor.executeEdits('zply-paste', [
            {
              range: selection,
              text: text,
              forceMoveMarkers: true,
            },
          ]);
          editor.focus();
        }
      } else {
        editor.executeEdits('zply-paste', [
          {
            range: selection,
            text: text,
            forceMoveMarkers: true,
          },
        ]);
        editor.focus();
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          const selection = editor.getSelection();
          if (selection) {
            editor.executeEdits('zply-paste-fallback', [
              {
                range: selection,
                text: text,
                forceMoveMarkers: true,
              },
            ]);
            editor.focus();
          }
        }
      } catch (fallbackErr) {
        console.error('Fallback clipboard read failed:', fallbackErr);
      }
    }
  }, []);

  return {
    isPasteModalOpen,
    setIsPasteModalOpen,
    pendingPaste,
    handleConfirmPaste,
    interceptPaste
  };
}
