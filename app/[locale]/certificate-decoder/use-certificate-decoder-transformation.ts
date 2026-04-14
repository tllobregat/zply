import { Logger } from '@/lib/logger';
import { useEffect, useState } from 'react';
import { CertificateDecoderResult } from './certificate-decoder.types';
import { decodeCertificate } from './certificate-decoder.utils';

export function useCertificateDecoderTransformation(content: string): CertificateDecoderResult {
  const [result, setResult] = useState<CertificateDecoderResult>({
    info: null,
    error: null,
    isProcessing: false
  });

  useEffect(() => {
    let isMounted: boolean = true;

    async function transform(): Promise<void> {
      if (!content.trim()) {
        if (isMounted) {
          setResult({ info: null, error: null, isProcessing: false });
        }
        return;
      }

      setResult((prev: CertificateDecoderResult) => ({ ...prev, isProcessing: true }));

      try {
        const info = await decodeCertificate(content);
        if (isMounted) {
          setResult({
            info,
            error: null,
            isProcessing: false
          });
        }
      } catch (error: unknown) {
        Logger.error('Certificate decoding failed', error);
        if (isMounted) {
          setResult({
            info: null,
            error: error instanceof Error ? error.message : 'Invalid certificate format',
            isProcessing: false
          });
        }
      }
    }

    const timer: NodeJS.Timeout = setTimeout(() => {
      void transform();
    }, 200);

    return (): void => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [content]);

  return result;
}
