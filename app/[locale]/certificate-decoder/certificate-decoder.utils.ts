import 'reflect-metadata';
import { Logger } from '@/lib/logger';
import { X509Certificate } from '@peculiar/x509';
import { CertificateInfo, CertificateExtension } from './certificate-decoder.types';

export async function decodeCertificate(pem: string): Promise<CertificateInfo> {
  try {
    // Extract PEM from potential noise or handle raw base64
    let cleanedPem: string = pem.trim();
    const pemMatch = cleanedPem.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/);
    
    if (pemMatch) {
      cleanedPem = pemMatch[0];
    } else {
      // If no BEGIN/END headers, try to wrap it (assuming it's a raw base64)
      // but only if it looks like base64 (no spaces, mainly alphanumeric and +/=/ )
      const potentialBase64 = cleanedPem.replace(/\s/g, '');
      if (/^[a-zA-Z0-9+/=]+$/.test(potentialBase64)) {
        cleanedPem = `-----BEGIN CERTIFICATE-----\n${potentialBase64}\n-----END CERTIFICATE-----`;
      }
    }

    const cert: X509Certificate = new X509Certificate(cleanedPem);

    const now: Date = new Date();
    const isExpired: boolean = now > cert.notAfter;
    const daysToExpiration: number = Math.floor((cert.notAfter.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Get fingerprints
    const sha1: ArrayBuffer = await cert.getThumbprint('SHA-1');
    const sha256: ArrayBuffer = await cert.getThumbprint('SHA-256');

    // Format fingerprints to hex string with colons
    const formatThumbprint = (buffer: ArrayBuffer): string => {
      return Array.from(new Uint8Array(buffer))
        .map((b: number) => b.toString(16).padStart(2, '0'))
        .join(':')
        .toUpperCase();
    };

    const extensions: CertificateExtension[] = cert.extensions.map((ext) => ({
      name: ext.type,
      oid: ext.type,
      value: 'Value decoding not fully implemented',
      critical: ext.critical
    }));

    return {
      subject: cert.subject,
      subjectDetails: parseDN(cert.subject),
      issuer: cert.issuer,
      issuerDetails: parseDN(cert.issuer),
      notBefore: cert.notBefore.toISOString(),
      notAfter: cert.notAfter.toISOString(),
      serialNumber: cert.serialNumber,
      version: 3,
      signatureAlgorithm: cert.signatureAlgorithm.name || 'Unknown',
      publicKey: {
        algorithm: cert.publicKey.algorithm.name || 'Unknown',
        details: `${cert.publicKey.algorithm.name || 'Unknown'}`
      },
      extensions,
      fingerprints: {
        sha1: formatThumbprint(sha1),
        sha256: formatThumbprint(sha256)
      },
      isExpired,
      daysToExpiration
    };
  } catch (error: unknown) {
    Logger.error('X509 Decode error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to decode certificate');
  }
}

function parseDN(dn: string): Record<string, string> {
  const result: Record<string, string> = {};
  // Very basic parser for DN strings like "CN=Zply, O=Zply, C=FR"
  const parts: string[] = dn.split(/,\s*/);
  parts.forEach((part: string) => {
    const [key, ...values] = part.split('=');
    if (key && values.length > 0) {
      result[key.trim()] = values.join('=').trim();
    }
  });
  return result;
}
