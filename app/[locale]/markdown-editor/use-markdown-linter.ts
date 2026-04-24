import { ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import type * as monaco from 'monaco-editor';

export function useMarkdownLinter() {
  const t = useTranslations('Tools');

  const validateMarkdown = useCallback((model: monaco.editor.ITextModel, monacoInstance: typeof monaco) => {
    const lines: string[] = model.getLinesContent();
    const markers: monaco.editor.IMarkerData[] = [];
    let lastLevel: number = 0;
    let h1Count: number = 0;
    let consecutiveEmptyLines: number = 0;
    const headerTexts: Set<string> = new Set<string>();
    const linkReferences: Set<string> = new Set<string>();
    const usedReferences: { ref: string; line: number; col: number; len: number }[] = [];
    let insideCodeBlock: boolean = false;
    let codeBlockStartLine: number = -1;

    for (let i: number = 0; i < lines.length; i++) {
      const line: string = lines[i];
      const lineNum: number = i + 1;

      // 1. Code blocks tracking
      if (line.trim().startsWith('```')) {
        insideCodeBlock = !insideCodeBlock;
        codeBlockStartLine = insideCodeBlock ? lineNum : -1;
      }

      if (insideCodeBlock && lineNum !== codeBlockStartLine) continue;

      // 2. Trailing spaces
      if (line.length > 0 && /\s$/.test(line)) {
        markers.push({
          severity: monacoInstance.MarkerSeverity.Warning,
          message: t(`${ToolId.MARKDOWN}.trailingSpaces`),
          startLineNumber: lineNum,
          startColumn: line.length,
          endLineNumber: lineNum,
          endColumn: line.length + 1,
          code: 'trailing-spaces',
        });
      }

      // 3. Consecutive empty lines
      if (line.trim() === '') {
        consecutiveEmptyLines++;
        if (consecutiveEmptyLines > 2) {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.consecutiveEmptyLines`),
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: 1,
            code: 'consecutive-empty-lines',
          });
        }
      } else {
        consecutiveEmptyLines = 0;
      }

      // 4. Headers validation
      const headerMatch: RegExpMatchArray | null = line.match(/^(#{1,6})(\s+)(.*)/);
      const malformedHeaderMatch: RegExpMatchArray | null = line.match(/^(#{1,6})[^#\s]/);

      if (malformedHeaderMatch) {
        markers.push({
          severity: monacoInstance.MarkerSeverity.Error,
          message: t(`${ToolId.MARKDOWN}.malformedHeader`),
          startLineNumber: lineNum,
          startColumn: 1,
          endLineNumber: lineNum,
          endColumn: malformedHeaderMatch[1].length + 1,
          code: 'malformed-header',
        });
      }

      if (headerMatch) {
        const level: number = headerMatch[1].length;
        const text: string = headerMatch[3].trim();

        // Multiple H1
        if (level === 1) {
          h1Count++;
          if (h1Count > 1) {
            markers.push({
              severity: monacoInstance.MarkerSeverity.Warning,
              message: t(`${ToolId.MARKDOWN}.multipleH1`),
              startLineNumber: lineNum,
              startColumn: 1,
              endLineNumber: lineNum,
              endColumn: headerMatch[0].length + 1,
            });
          }
        }

        // Header level jump
        if (level > lastLevel + 1 && lastLevel !== 0) {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.headerLevelJump`, { prev: lastLevel, curr: level }),
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: headerMatch[1].length + 1,
          });
        }
        lastLevel = level;

        // Duplicate header ID
        if (headerTexts.has(text)) {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.duplicateHeaderId`, { text }),
            startLineNumber: lineNum,
            startColumn: headerMatch[1].length + headerMatch[2].length + 1,
            endLineNumber: lineNum,
            endColumn: headerMatch[0].length + 1,
          });
        }
        headerTexts.add(text);

        // Missing empty line before header
        if (i > 0 && lines[i - 1].trim() !== '') {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.missingLineAroundHeader`),
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: headerMatch[1].length + 1,
            code: 'missing-line-around-header',
          });
        }
        // Missing empty line after header
        if (i < lines.length - 1 && lines[i + 1].trim() !== '' && !lines[i + 1].startsWith('#')) {
          markers.push({
            severity: monacoInstance.MarkerSeverity.Warning,
            message: t(`${ToolId.MARKDOWN}.missingLineAroundHeader`),
            startLineNumber: lineNum,
            startColumn: 1,
            endLineNumber: lineNum,
            endColumn: headerMatch[1].length + 1,
            code: 'missing-line-around-header',
          });
        }
      }

      // 5. Lists inconsistency
      const listMatch: RegExpMatchArray | null = line.match(/^\s*([*\-+])\s/);
      if (listMatch) {
        const marker: string = listMatch[1];
        // Check surrounding list items if they use the same marker
        // Simplified: check if previous line was a list with different marker at same indentation
        if (i > 0) {
          const prevListMatch: RegExpMatchArray | null = lines[i - 1].match(/^(\s*)([*\-+])\s/);
          const currentIndent: string = line.match(/^\s*/)?.[0] || '';
          if (prevListMatch && prevListMatch[1] === currentIndent && prevListMatch[2] !== marker) {
            markers.push({
              severity: monacoInstance.MarkerSeverity.Warning,
              message: t(`${ToolId.MARKDOWN}.inconsistentListMarkers`),
              startLineNumber: lineNum,
              startColumn: line.indexOf(marker) + 1,
              endLineNumber: lineNum,
              endColumn: line.indexOf(marker) + 2,
              code: 'inconsistent-list-marker',
            });
          }
        }
      }

      // 6. Missing alt text
      const altTextMatches = line.matchAll(/(!?\[]\(.*?\))/g);
      for (const match of altTextMatches) {
        markers.push({
          severity: monacoInstance.MarkerSeverity.Warning,
          message: t(`${ToolId.MARKDOWN}.missingAltText`),
          startLineNumber: lineNum,
          startColumn: (match.index ?? 0) + 1,
          endLineNumber: lineNum,
          endColumn: (match.index ?? 0) + match[0].length + 1,
          code: 'missing-alt-text',
        });
      }

      // 7. Link references
      const refDefMatch: RegExpMatchArray | null = line.match(/^\s*\[(.*?)]:\s+/);
      if (refDefMatch) {
        linkReferences.add(refDefMatch[1]);
      }

      const refUsageMatches = line.matchAll(/\[(.*?)]\[(.*?)]/g);
      for (const match of refUsageMatches) {
        const ref: string = match[2] || match[1];
        usedReferences.push({
          ref,
          line: lineNum,
          col: (match.index ?? 0) + (match[2] ? match[1].length + 3 : 1),
          len: ref.length
        });
      }
    }

    // 8. Orphan link references
    for (const usage of usedReferences) {
      if (!linkReferences.has(usage.ref)) {
        markers.push({
          severity: monacoInstance.MarkerSeverity.Error,
          message: t(`${ToolId.MARKDOWN}.orphanLinkReference`, { ref: usage.ref }),
          startLineNumber: usage.line,
          startColumn: usage.col,
          endLineNumber: usage.line,
          endColumn: usage.col + usage.len,
        });
      }
    }

    // 9. Unclosed code block
    if (insideCodeBlock) {
      markers.push({
        severity: monacoInstance.MarkerSeverity.Error,
        message: t(`${ToolId.MARKDOWN}.unclosedCodeBlock`),
        startLineNumber: codeBlockStartLine,
        startColumn: 1,
        endLineNumber: codeBlockStartLine,
        endColumn: 4,
        code: 'unclosed-code-block',
      });
    }

    monacoInstance.editor.setModelMarkers(model, 'markdown-linter', markers);
  }, [t]);

  return { validateMarkdown };
}
