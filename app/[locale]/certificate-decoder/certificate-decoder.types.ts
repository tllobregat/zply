export interface CertificateExtension {
  name: string;
  oid: string;
  value: string;
  critical: boolean;
}

export interface CertificateInfo {
  subject: string;
  subjectDetails: Record<string, string>;
  issuer: string;
  issuerDetails: Record<string, string>;
  notBefore: string;
  notAfter: string;
  serialNumber: string;
  version: number;
  signatureAlgorithm: string;
  publicKey: {
    algorithm: string;
    details: string;
  };
  extensions: CertificateExtension[];
  fingerprints: {
    sha1: string;
    sha256: string;
  };
  isExpired: boolean;
  daysToExpiration: number;
}

export interface CertificateDecoderResult {
  info: CertificateInfo | null;
  error: string | null;
  isProcessing: boolean;
}
