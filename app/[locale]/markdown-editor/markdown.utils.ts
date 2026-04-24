import Papa from 'papaparse';

/**
 * Converts a CSV string into a GFM Markdown table.
 */
export function csvToMarkdown(csv: string): string {
  const results = Papa.parse<string[]>(csv, {
    skipEmptyLines: true,
  });

  if (results.data.length === 0) {
    return '';
  }

  const rows = results.data;
  const header = rows[0];
  const body = rows.slice(1);

  if (header.length === 0) {
    return '';
  }

  const markdownTable = [
    `| ${header.join(' | ')} |`,
    `| ${header.map(() => '---').join(' | ')} |`,
    ...body.map(row => `| ${row.join(' | ')} |`)
  ].join('\n');

  return markdownTable;
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
