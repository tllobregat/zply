import { DataFormat } from '@/app/data-transformer/transformer.types';
import { Logger } from '@/lib/logger';
import { JsonValue } from '../json-utils/types';

/**
 * Advanced TS to JSON Parser that resolves nested interfaces.
 */
export function parseTypeScriptToMock(input: string): JsonValue {
  const clean: string = input.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();

  // 1. Extract all interface/type definitions
  const definitions: Record<string, string> = {};
  const interfaceRegex: RegExp = /(?:interface|type)\s+(\w+)\s*=?\s*\{([\s\S]*?)}/g;
  let match: RegExpExecArray | null;
  let firstInterfaceName: string = '';

  while ((match = interfaceRegex.exec(clean)) !== null) {
    const name: string = match[1];
    definitions[name] = match[2];
    if (!firstInterfaceName) {
      firstInterfaceName = name;
    }
  }

  // 2. Resolver logic
  const seen: Set<string> = new Set<string>();

  function buildMock(body: string): JsonValue {
    const result: Record<string, JsonValue> = {};
    const lines: string[] = body.split(/[;,\n]/);

    lines.forEach((line: string): void => {
      const parts: string[] = line.split(':');
      if (parts.length < 2) {
        return;
      }

      const key: string = parts[0].replace(/\?|readonly/g, '').trim().replace(/['"]/g, '');
      const type: string = parts[1].trim();

      if (type.endsWith('[]')) {
        result[key] = [];
      } else if (type === 'string') {
        result[key] = '';
      } else if (type === 'number') {
        result[key] = 0;
      } else if (type === 'boolean') {
        result[key] = false;
      } else if (type === 'any' || type === 'unknown') {
        result[key] = null;
      } else if (definitions[type]) {
        if (seen.has(type)) {
          result[key] = {}; // Prevent circular infinite loops
        } else {
          seen.add(type);
          result[key] = buildMock(definitions[type]);
          seen.delete(type);
        }
      } else {
        result[key] = {}; // Default fallback
      }
    });

    return result;
  }

  if (firstInterfaceName) {
    seen.add(firstInterfaceName);
    return buildMock(definitions[firstInterfaceName]);
  }

  try {
    let sanitized: string = clean
      .replace(/(\w+)\s*:/g, '"$1":') // Quote keys
      .replace(/'/g, '"') // Normalize quotes
      .replace(/,\s*([}\]])/g, '$1'); // Trailing commas

    if (!sanitized.startsWith('{') && !sanitized.startsWith('[')) {
      sanitized = `{${sanitized}}`;
    }
    return JSON.parse(sanitized) as JsonValue;
  } catch (error: unknown) {
    Logger.error('TypeScript to Mock parsing failed', error);
    throw new Error('Could not parse TypeScript. Ensure it is a valid Interface, Type or Object.');
  }
}

/**
 * Converts a JS/JSON object into TypeScript interfaces.
 */
export function jsonToTypeScript(obj: JsonValue, interfaceName: string = 'RootObject'): string {
  const interfaces: string[] = [];

  function getTsType(val: JsonValue, key: string): string {
    if (val === null) {
      return 'any';
    }
    if (Array.isArray(val)) {
      if (val.length === 0) {
        return 'any[]';
      }
      const itemType: string = getTsType(val[0], key);
      return `${itemType}[]`;
    }
    if (typeof val === 'object') {
      const subInterfaceName: string = key.charAt(0).toUpperCase() + key.slice(1);
      generateInterface(val, subInterfaceName);
      return subInterfaceName;
    }
    return typeof val;
  }

  function generateInterface(data: { [key: string]: JsonValue } | JsonValue[], name: string): void {
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'object') {
        generateInterface(data[0] as { [key: string]: JsonValue }, name);
      }
      return;
    }

    const keys: string[] = Object.keys(data);
    let str: string = `export interface ${name} {\n`;
    keys.forEach((k: string): void => {
      const type: string = getTsType(data[k], k);
      str += `  ${k}: ${type};\n`;
    });
    str += `}`;
    if (!interfaces.includes(str)) {
      interfaces.push(str);
    }
  }

  try {
    generateInterface(obj as { [key: string]: JsonValue } | JsonValue[], interfaceName);
    return interfaces.reverse().join('\n\n');
  } catch (error: unknown) {
    Logger.error('JSON to TypeScript generation failed', error);
    return '// Error generating TypeScript interfaces';
  }
}

export const FORMAT_LABELS: Record<DataFormat, string> = {
  json: 'JSON',
  yaml: 'YAML',
  csv: 'CSV',
  xml: 'XML',
  typescript: 'TypeScript'
};
