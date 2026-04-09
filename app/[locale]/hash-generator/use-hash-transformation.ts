import CryptoJS from 'crypto-js';
import { useMemo } from 'react';

export interface Hashes {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

export function useHashTransformation(text: string): Hashes {
  return useMemo(() => {
    if (!text) {
      return { md5: '', sha1: '', sha256: '', sha512: '' };
    }

    return {
      md5: CryptoJS.MD5(text).toString(),
      sha1: CryptoJS.SHA1(text).toString(),
      sha256: CryptoJS.SHA256(text).toString(),
      sha256_full: CryptoJS.SHA256(text).toString(),
      sha512: CryptoJS.SHA512(text).toString(),
    };
  }, [text]);
}
