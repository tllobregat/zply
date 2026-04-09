import { Logger } from '@/lib/logger';
import { useEffect, useState } from 'react';
import { JwtMode } from './use-jwt-state';
import { SignJWT, importJWK, importPKCS8, JWK, JWTHeaderParameters, type CryptoKey, type KeyObject } from 'jose';

export interface JwtTransformationResult {
  header: string;
  payload: string;
  encodedToken: string;
  error: string | null;
  isProcessing: boolean;
}

function base64UrlDecode(str: string): string {
  try {
    const base64: string = str.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(escape(atob(base64)));
  } catch {
    return '';
  }
}

export function useJwtTransformation(
  mode: JwtMode,
  token: string,
  encodeHeader: string,
  encodePayload: string,
  encodeSecret: string,
  encodeAlgorithm: string
): JwtTransformationResult {
  const [result, setResult] = useState<JwtTransformationResult>({
    header: '',
    payload: '',
    encodedToken: '',
    error: null,
    isProcessing: false
  });

  useEffect(() => {
    let isMounted: boolean = true;

    async function transform(): Promise<void> {
      setResult((prev: JwtTransformationResult) => ({ ...prev, isProcessing: true }));

      try {
        if (mode === JwtMode.DECODE) {
          if (!token.trim()) {
            if (isMounted) setResult({ header: '', payload: '', encodedToken: '', error: null, isProcessing: false });
            return;
          }

          const parts: string[] = token.split('.');
          if (parts.length < 2) {
            throw new Error('Invalid JWT format (missing parts)');
          }

          let headerStr: string = '';
          let payloadStr: string = '';

          // Decode Header
          const decodedHeader: string = base64UrlDecode(parts[0]);
          if (decodedHeader) {
            headerStr = JSON.stringify(JSON.parse(decodedHeader), null, 2);
          }

          // Decode Payload
          const decodedPayload: string = base64UrlDecode(parts[1]);
          if (decodedPayload) {
            payloadStr = JSON.stringify(JSON.parse(decodedPayload), null, 2);
          }

          if (isMounted) {
            setResult({
              header: headerStr,
              payload: payloadStr,
              encodedToken: token,
              error: null,
              isProcessing: false
            });
          }
        } else {
          // ENCODE Mode
          try {
            const headerObj: Record<string, unknown> = JSON.parse(encodeHeader) as Record<string, unknown>;
            const payloadObj: Record<string, unknown> = JSON.parse(encodePayload) as Record<string, unknown>;

            let key: Uint8Array | CryptoKey | KeyObject | JWK;
            
            if (encodeAlgorithm.startsWith('HS')) {
              // HMAC algorithms use a shared secret (Uint8Array)
              key = new TextEncoder().encode(encodeSecret);
            } else {
              // Asymmetric algorithms use PEM or JWK
              try {
                if (encodeSecret.trim().startsWith('{')) {
                  // Attempt as JWK
                  key = await importJWK(JSON.parse(encodeSecret) as JWK, encodeAlgorithm);
                } else {
                  // Attempt as PEM (PKCS8 for private key)
                  key = await importPKCS8(encodeSecret, encodeAlgorithm);
                }
              } catch (e: unknown) {
                throw new Error(`Invalid Private Key for ${encodeAlgorithm}: ${e instanceof Error ? e.message : 'Unknown error'}`);
              }
            }

            const jwt: string = await new SignJWT(payloadObj)
              .setProtectedHeader(headerObj as unknown as JWTHeaderParameters)
              .sign(key);

            if (isMounted) {
              setResult({
                header: encodeHeader,
                payload: encodePayload,
                encodedToken: jwt,
                error: null,
                isProcessing: false
              });
            }
          } catch (error: unknown) {
            if (isMounted) {
              setResult({
                header: encodeHeader,
                payload: encodePayload,
                encodedToken: '',
                error: error instanceof Error ? error.message : 'Encoding error',
                isProcessing: false
              });
            }
          }
        }
      } catch (error: unknown) {
        Logger.error('JWT Transformation failed', error);
        if (isMounted) {
          setResult({
            header: '',
            payload: '',
            encodedToken: '',
            error: error instanceof Error ? error.message : 'Invalid or malformed JWT token',
            isProcessing: false
          });
        }
      }
    }

    const timer: NodeJS.Timeout = setTimeout(() => {
      void transform();
    }, 100); // Small debounce to avoid flashing during typing

    return (): void => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [mode, token, encodeHeader, encodePayload, encodeSecret, encodeAlgorithm]);

  return result;
}
