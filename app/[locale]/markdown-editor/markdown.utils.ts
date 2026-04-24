import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Converts a 2D array of data into a valid GFM Markdown table.
 * Ensures consistent column counts and escapes special characters.
 */
function arrayToMarkdownTable(data: unknown[][]): string {
  if (data.length === 0) return '';

  // 1. Find the maximum number of columns
  const maxColumns = Math.max(...data.map(row => row.length));
  if (maxColumns === 0) return '';

  const formatCell = (cell: unknown): string => {
    const str = String(cell ?? '').trim();
    // Escape pipes and handle newlines
    return str.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
  };

  const rows: string[] = [];

  // 2. Format Header
  const header = data[0];
  const paddedHeader = [...header];
  while (paddedHeader.length < maxColumns) paddedHeader.push('');
  rows.push(`| ${paddedHeader.map(formatCell).join(' | ')} |`);

  // 3. Format Separator
  const separator = Array(maxColumns).fill('---');
  rows.push(`| ${separator.join(' | ')} |`);

  // 4. Format Body
  const body = data.slice(1);
  body.forEach(row => {
    const paddedRow = [...row];
    while (paddedRow.length < maxColumns) paddedRow.push('');
    rows.push(`| ${paddedRow.map(formatCell).join(' | ')} |`);
  });

  return rows.join('\n');
}

/**
 * Converts HTML string to Markdown.
 */
export function htmlToMarkdown(html: string): string {
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
        // Parse the rows back into an array to use our robust table generator
        const data = rows.map(row => 
          row.trim()
             .replace(/^\|/, '')
             .replace(/\|$/, '')
             .split('|')
             .map(cell => cell.trim())
        );
        return '\n\n' + arrayToMarkdownTable(data) + '\n\n';
      }
      return '\n\n' + cleanContent + '\n\n';
    }
  });

  return turndownService.turndown(html)
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Converts a CSV string into a GFM Markdown table.
 */
export function csvToMarkdown(csv: string): string {
  const results = Papa.parse<string[]>(csv, {
    skipEmptyLines: true,
  });

  return arrayToMarkdownTable(results.data);
}

/**
 * Converts an Excel workbook (ArrayBuffer) into a GFM Markdown string.
 */
export function excelToMarkdown(buffer: ArrayBuffer, fileName: string): string {
  const workbook: XLSX.WorkBook = XLSX.read(buffer, { type: 'array' });
  const baseName: string = fileName.replace(/\.[^/.]+$/, "");
  
  let markdown: string = `# ${baseName}\n\n`;

  workbook.SheetNames.forEach((sheetName: string) => {
    const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
    const data: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (data.length > 0) {
      markdown += `## ${sheetName}\n\n`;
      markdown += arrayToMarkdownTable(data);
      markdown += '\n\n';
    }
  });

  return markdown.trim();
}

export function processFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();
    const isCsv = fileName.endsWith('.csv');
    const isHtml = fileName.endsWith('.html') || fileName.endsWith('.htm');
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xlsb') || fileName.endsWith('.xls') || fileName.endsWith('.xlsm');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (!result) {
        resolve('');
        return;
      }

      if (isExcel) {
        if (result instanceof ArrayBuffer) {
          resolve(excelToMarkdown(result, file.name));
        } else {
          resolve('');
        }
        return;
      }

      if (typeof result === 'string') {
        if (isCsv) {
          resolve(csvToMarkdown(result));
        } else if (isHtml) {
          resolve(htmlToMarkdown(result));
        } else {
          resolve(result);
        }
      } else {
        resolve('');
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

/**
 * Heuristic to detect if a string might be CSV data.
 * Checks for multiple lines and consistent column counts with delimiters.
 */
export function isCSV(text: string): boolean {
  if (!text || text.length < 3) {
    return false;
  }

  // If it looks like HTML, it's probably not CSV (let the HTML handler take it)
  if (text.trim().startsWith('<') && text.trim().includes('>')) {
    return false;
  }

  // Use PapaParse to detect the structure
  const results = Papa.parse(text, {
    preview: 5, // Only check the first few lines for performance
    skipEmptyLines: true,
  });

  // If no data or errors that suggest it's not CSV-like
  if (results.data.length === 0) {
    return false;
  }

  // PapaParse will often return data even for plain text (single column)
  // We need to verify it actually found a delimiter or has multiple columns
  const firstRow = results.data[0] as string[];
  const columnCount = firstRow.length;

  // If only one column was found, it might just be plain text
  if (columnCount <= 1) {
    return false;
  }

  // Check for consistency in subsequent rows if they exist
  if (results.data.length > 1) {
    const rowsToCheck = results.data as string[][];
    const consistentRows = rowsToCheck.filter(row => row.length === columnCount).length;
    
    // If the majority of rows have the same column count, we're fairly confident
    if (consistentRows >= Math.min(rowsToCheck.length, 3)) {
      return true;
    }
  } else {
    // Single line: requires at least 3 columns to be considered CSV with high confidence
    return columnCount >= 3;
  }

  return false;
}

/**
 * Heuristic to detect if a string might be HTML.
 */
export function isHTML(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  // Basic check for HTML tags
  return (
    (trimmed.startsWith('<') && trimmed.endsWith('>')) ||
    (/<[a-z][\s\S]*>/i.test(trimmed))
  );
}
