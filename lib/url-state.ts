import { pack, unpack } from 'msgpackr';
import { zlibSync, unzlibSync } from 'fflate';

/**
 * Encode an object into a URL-safe string using MessagePack + Zlib + Base64URL.
 */
export function encodeState(data: unknown): string {
  // 1. Serialize to MessagePack
  const packed: Uint8Array = pack(data);

  // 2. Compress with Zlib (fast and good ratio)
  const compressed: Uint8Array = zlibSync(packed, { level: 9 });

  // 3. Encode to Base64URL
  return Buffer.from(compressed)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Decode a state string back into an object.
 */
export function decodeState<T>(encoded: string): T | null {
  try {
    // 1. Decode Base64URL to Buffer
    const base64: string = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if necessary
    const padded: string = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const buffer: Buffer = Buffer.from(padded, 'base64');

    // 2. Decompress Zlib
    const decompressed: Uint8Array = unzlibSync(buffer);

    // 3. Unpack MessagePack
    return unpack(decompressed) as T;
  } catch (error: unknown) {
    console.error('Failed to decode URL state:', error);
    // If decoding fails, it might be an old format
    return null;
  }
}

/**
 * Checks if a string is likely in the new format.
 * Since we want to transition, we can prefix our new format with a version or a special character.
 * But according to the request, we just want it shorter.
 * A good way to distinguish is that JSON (the old format) starts with '{' (compressed by LZ-String though).
 * Actually, LZ-String encoded strings for URI usually start with specific characters.
 * Let's use a prefix 'v2-' to be safe and future-proof.
 */
export const STATE_PREFIX: string = 'z2~'; // Short and unlikely to collide with LZ-String

export function compressState(data: unknown): string {
  return STATE_PREFIX + encodeState(data);
}

export function isNewFormat(encoded: string): boolean {
  return encoded.startsWith(STATE_PREFIX);
}

export function decompressState<T>(encoded: string): T | null {
  if (isNewFormat(encoded)) {
    return decodeState<T>(encoded.substring(STATE_PREFIX.length));
  }
  return null;
}
