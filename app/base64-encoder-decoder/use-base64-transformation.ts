import { detectImageType, isDataUriImage, utf8_to_b64 } from '@/app/base64-encoder-decoder/base64.utils';
import { Logger } from '@/lib/logger';
import { useMemo } from 'react';
import { Base64State, InputType, TransformationResult } from './base64.types';

export function useBase64Transformation(
  state: Base64State,
  inputType: InputType,
  fileRawBase64: string
): TransformationResult {
  return useMemo((): TransformationResult => {
    if (inputType === 'file') {
      if (state.mode === 'encode') {
        return { result: fileRawBase64, error: null, isImage: false, imageType: null };
      }
    }

    const input: string = state.input.trim();
    if (!input) return { result: '', error: null, isImage: false, imageType: null };

    try {
      if (state.mode === 'encode') {
        const encoded: string = utf8_to_b64(input);
        return { result: encoded, error: null, isImage: false, imageType: null };
      } else {
        // Decode logic
        if (isDataUriImage(input)) {
          const parts: string[] = input.split(',');
          if (parts.length > 1) {
            const mime: string = parts[0].split(':')[1].split(';')[0];
            return { result: input, error: null, isImage: true, imageType: mime };
          }
        }

        const sanitized: string = input.replace(/\s/g, '');
        const binary: string = window.atob(sanitized);
        const bytes: Uint8Array = new Uint8Array(binary.length);
        for (let i: number = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        const detectedMime: string | null = detectImageType(bytes);
        if (detectedMime) {
          return { result: `data:${detectedMime};base64,${sanitized}`, error: null, isImage: true, imageType: detectedMime };
        }

        const decoded: string = new TextDecoder().decode(bytes);
        const trimmedDecoded: string = decoded.trim();
        if (trimmedDecoded.startsWith('<svg') || trimmedDecoded.includes('http://www.w3.org/2000/svg')) {
          return { result: decoded, error: null, isImage: true, imageType: 'image/svg+xml' };
        }

        return { result: decoded, error: null, isImage: false, imageType: null };
      }
    } catch (err: unknown) {
      Logger.error('Base64 transformation failed', err);
      let msg: string = 'Failed to transform input';
      if (err instanceof DOMException && err.name === 'InvalidCharacterError') {
        msg = 'Invalid characters: The string to be decoded contains non-Base64 characters.';
      } else if (state.mode === 'decode') {
        msg = 'Invalid Base64: The string is not a valid Base64 encoded payload.';
      }
      return {
        result: '',
        error: msg,
        isImage: false,
        imageType: null
      };
    }
  }, [state.mode, state.input, inputType, fileRawBase64]);
}
