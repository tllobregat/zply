import { useState } from 'react';
import { Base64Mode, FileInfo, InputType } from './base64.types';

export type UseBase64File = {
  inputType: InputType;
  fileInfo: FileInfo | null;
  fileRawBase64: string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, onEncodeMode: (mode: Base64Mode) => void) => void;
  clearFile: () => void;
}

export function useBase64File(): UseBase64File {
  const [inputType, setInputType] = useState<InputType>('text');
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [fileRawBase64, setFileRawBase64] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onEncodeMode: (mode: Base64Mode) => void): void => {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;

    const reader: FileReader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>): void => {
      const dataUrl: string = event.target?.result as string;
      const b64: string = dataUrl.split(',')[1];
      setFileRawBase64(b64);
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type
      });
      setInputType('file');
      onEncodeMode('encode');
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (): void => {
    setInputType('text');
    setFileInfo(null);
    setFileRawBase64('');
  };

  return {
    inputType,
    fileInfo,
    fileRawBase64,
    handleFileUpload,
    clearFile,
  };
}
