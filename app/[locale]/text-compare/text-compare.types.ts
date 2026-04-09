export type DiffMode = 'unified' | 'split';
export type ViewMode = 'original' | 'split' | 'modified';

export interface TextCompareState {
  original: string;
  modified: string;
  diffMode: DiffMode;
}
