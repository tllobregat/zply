import { TextCompareState } from '@/app/text-compare/text-compare.types';

export const DEFAULT_STATE: TextCompareState = {
  original: '// Original text\nconst a = 1;\nconst b = 2;',
  modified: '// Modified text\nconst a = 1;\nconst b = 3;'
};
