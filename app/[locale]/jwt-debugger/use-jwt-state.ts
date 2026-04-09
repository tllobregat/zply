import { useShareableState } from '@/hooks/use-shareable-state';

export enum JwtMode {
  DECODE = 'decode',
  ENCODE = 'encode'
}

export type UseJwtState = {
  mode: JwtMode;
  setMode: (mode: JwtMode) => void;
  token: string;
  setToken: (token: string) => void;
  encodeHeader: string;
  setEncodeHeader: (header: string) => void;
  encodePayload: string;
  setEncodePayload: (payload: string) => void;
  encodeSecret: string;
  setEncodeSecret: (secret: string) => void;
  encodeAlgorithm: string;
  setEncodeAlgorithm: (algorithm: string) => void;
};

const initialToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const initialHeader: string = JSON.stringify({
  alg: 'HS256',
  typ: 'JWT'
}, null, 2);

const initialPayload: string = JSON.stringify({
  sub: '1234567890',
  name: 'John Doe',
  iat: Math.floor(Date.now() / 1000)
}, null, 2);

export function useJwtState(): UseJwtState {
  const [mode, setMode] = useShareableState<JwtMode>('jwt_mode', JwtMode.DECODE);
  const [token, setToken] = useShareableState<string>('jwt_token', initialToken, { debounceMs: 0 });
  const [encodeHeader, setEncodeHeader] = useShareableState<string>('jwt_enc_header', initialHeader);
  const [encodePayload, setEncodePayload] = useShareableState<string>('jwt_enc_payload', initialPayload);
  const [encodeSecret, setEncodeSecret] = useShareableState<string>('jwt_enc_secret', 'your-256-bit-secret');
  const [encodeAlgorithm, setEncodeAlgorithm] = useShareableState<string>('jwt_enc_algo', 'HS256');

  const updateAlgorithm = (algo: string): void => {
    setEncodeAlgorithm(algo);
    setEncodeHeader((prev: string): string => {
      try {
        const parsedHeader: Record<string, unknown> = JSON.parse(prev) as Record<string, unknown>;
        if (parsedHeader.alg !== algo) {
          parsedHeader.alg = algo;
          return JSON.stringify(parsedHeader, null, 2);
        }
        return prev;
      } catch {
        // If parsing fails, reset to a standard header with the new algorithm
        return JSON.stringify({ alg: algo, typ: 'JWT' }, null, 2);
      }
    });
  };

  return {
    mode,
    setMode,
    token,
    setToken,
    encodeHeader,
    setEncodeHeader,
    encodePayload,
    setEncodePayload,
    encodeSecret,
    setEncodeSecret,
    encodeAlgorithm,
    setEncodeAlgorithm: updateAlgorithm,
  };
}
