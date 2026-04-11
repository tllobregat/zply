export type DataFormat = 'json' | 'yaml' | 'csv' | 'xml' | 'typescript';

export interface TransformerState {
  i: string;
  f: DataFormat;
  t: DataFormat;
}
