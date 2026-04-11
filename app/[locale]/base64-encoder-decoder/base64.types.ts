export type Base64Mode = 'encode' | 'decode';
export type InputType = 'text' | 'file';

export interface Base64State {
  mode: Base64Mode;
  inputType: InputType;
  input: string; // input text
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface TransformationResult {
  result: string;
  error: string | null;
  isImage: boolean;
  imageType: string | null;
}
