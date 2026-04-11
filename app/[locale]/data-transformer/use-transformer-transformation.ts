import { JsonValue } from '@/app/[locale]/json-utils/types';
import { parseTypeScriptToMock, jsonToTypeScript } from '@/app/[locale]/data-transformer/transformer.utils';
import { Logger } from '@/lib/logger';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import yaml from 'js-yaml';
import { useMemo } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { TransformerState, DataFormat } from '@/app/[locale]/data-transformer/transformer.types';

export interface TransformationResult {
  transformContent: string;
  error: string | null;
}

export function useTransformerTransformation(state: TransformerState): TransformationResult {
  return useMemo(() => {
    if (!state.i.trim()) {
      return { transformContent: '', error: null };
    }

    try {
      let parsed: JsonValue;

      // 1. Parse Input
      switch (state.f) {
        case 'json':
          parsed = JSON.parse(state.i) as JsonValue;
          break;
        case 'yaml':
          parsed = yaml.load(state.i) as JsonValue;
          break;
        case 'csv':
          const csvResult: ParseResult<unknown> = Papa.parse(state.i, {
            header: true, 
            dynamicTyping: true, 
            skipEmptyLines: true 
          });
          if (csvResult.errors.length > 0) {
            const msg: string = csvResult.errors[0].message;
            Logger.error(msg);
            return { transformContent: '', error: msg };
          }
          parsed = csvResult.data as unknown as JsonValue;
          break;
        case 'xml':
          const xmlParser: XMLParser = new XMLParser({ ignoreAttributes: false, parseAttributeValue: true });
          parsed = xmlParser.parse(state.i) as JsonValue;
          break;
        case 'typescript':
          parsed = parseTypeScriptToMock(state.i);
          break;
        default:
          const msg: string = 'Unsupported source format';
          Logger.error(msg);
          return { transformContent: '', error: msg };
      }

      // 2. Format Output
      let result: string = '';
      switch (state.t) {
        case 'json':
          result = JSON.stringify(parsed, null, 2);
          break;
        case 'yaml':
          result = yaml.dump(parsed, { indent: 2, noRefs: true });
          break;
        case 'csv':
          const dataArray: JsonValue[] = Array.isArray(parsed) ? parsed : [parsed];
          result = Papa.unparse(dataArray as Array<Record<string, unknown>>);
          break;
        case 'xml':
          const xmlBuilder: XMLBuilder = new XMLBuilder({ ignoreAttributes: false, format: true, indentBy: '  ' });
          result = xmlBuilder.build(parsed);
          break;
        case 'typescript':
          result = jsonToTypeScript(parsed);
          break;
        default:
          return { transformContent: 'Unsupported target format', error: null };
      }
      return { transformContent: result, error: null };
    } catch (err: unknown) {
      const msg: string = (err as Error).message;
      Logger.error('Transformation failed', err);
      return { transformContent: '', error: msg };
    }
  }, [state.i, state.f, state.t]);
}

export function getMonacoLanguage(format: DataFormat): string {
  if (format === 'typescript') {
    return 'typescript';
  }
  if (format === 'yaml') {
    return 'yaml';
  }
  if (format === 'xml') {
    return 'xml';
  }
  return 'json';
}
