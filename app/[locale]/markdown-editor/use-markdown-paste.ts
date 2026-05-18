import type * as monaco from 'monaco-editor';
import { RefObject, useCallback, useState } from 'react';
import { csvToMarkdown, isCSV, htmlToMarkdown, isHTML } from './markdown.utils';

export interface PendingPaste {
  text: string;
  html?: string;
  isCsv?: boolean;
  isHtml?: boolean;
  selection: monaco.Selection;
}

export function useMarkdownPaste(editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>) {
  const [isPasteModalOpen, setIsPasteModalOpen] = useState<boolean>(false);
  const [pendingPaste, setPendingPaste] = useState<PendingPaste | null>(null);

  const handleConfirmPaste = useCallback((mode: 'raw' | 'html' | 'csv' = 'raw'): void => {
    if (pendingPaste && editorRef.current) {
      let textToInsert = pendingPaste.text;

      if (mode === 'csv') {
        textToInsert = csvToMarkdown(pendingPaste.text);
      } else if (mode === 'html') {
        try {
          textToInsert = htmlToMarkdown(pendingPaste.html || pendingPaste.text);
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
      let hasRichtext = false;

      for (const item of clipboardItems) {
        if (item.types.includes('text/html')) {
          const blob = await item.getType('text/html');
          htmlContent = await blob.text();
          hasRichtext = true;
        }
        if (item.types.includes('text/plain')) {
          const blob = await item.getType('text/plain');
          text = await blob.text();
        }
      }

      if (!text && !htmlContent) return;

      const selection = editor.getSelection();
      if (!selection) return;

      if (hasRichtext) {
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
          setPendingPaste({ text, html: htmlContent, isHtml: true, selection });
          setIsPasteModalOpen(true);
        } else if (isCSV(text)) {
          setPendingPaste({ text, html: htmlContent, isCsv: true, selection });
          setIsPasteModalOpen(true);
        } else if (isHTML(text)) {
          setPendingPaste({ text, html: text, isHtml: true, selection });
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
      } else if (isCSV(text)) {
        setPendingPaste({ text, isCsv: true, selection });
        setIsPasteModalOpen(true);
      } else if (isHTML(text)) {
        setPendingPaste({ text, isHtml: true, selection });
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
