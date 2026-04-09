/**
 * Detects if a string is a base64 data URI for an image
 */
export function isDataUriImage(str: string): boolean {
  return str.startsWith('data:image/');
}

/**
 * Detects image type from binary data (magic numbers)
 */
export function detectImageType(bytes: Uint8Array): string | null {
  if (bytes.length < 4) return null;

  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'image/png';

  // JPEG: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'image/jpeg';

  // GIF: 47 49 46 38
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'image/gif';

  // WEBP: RIFF .... WEBP
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) return 'image/webp';

  return null;
}

/**
 * Modern UTF-8 safe Base64 encoding
 */
export function utf8_to_b64(str: string): string {
  if (typeof window === 'undefined') return '';
  const bytes: Uint8Array = new TextEncoder().encode(str);
  let binary: string = '';
  for (let i: number = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
