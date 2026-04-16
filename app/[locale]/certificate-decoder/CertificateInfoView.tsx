'use client';

import { CertificateExtension, CertificateInfo } from '@/app/[locale]/certificate-decoder/certificate-decoder.types';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { AlertCircle, Building, Calendar, CheckCircle2, Fingerprint, Key, Layers, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { DetailRow, InfoSection } from './CertificateDecoderComponents';

interface CertificateInfoViewProps {
  info: CertificateInfo;
  theme: CategoryTheme;
}

export function CertificateInfoView({ info, theme }: CertificateInfoViewProps) {
  const t = useTranslations('Tools.certificate-decoder');

  return (
    <motion.div
      key="info"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Status Banner */}
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-xl border shadow-sm",
        info.isExpired
          ? "bg-red-500/10 border-red-500/20 text-red-500"
          : "bg-green-500/10 border-green-500/20 text-green-500"
      )}>
        {
          info.isExpired
            ? (
              <AlertCircle className="w-5 h-5" />
            )
            : (
              <CheckCircle2 className="w-5 h-5" />
            )
        }
        <div className="font-medium">
          {
            info.isExpired
              ? t('expired')
              : t('expiresIn', { days: info.daysToExpiration })
          }
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Section */}
        <InfoSection icon={<User className="w-5 h-5" />} title={t('subject')} theme={theme}>
          <div className="space-y-2">
            <p className="text-sm font-mono break-all bg-island-bg/40 p-2 rounded-lg border border-island-border/50">
              {info.subject}
            </p>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(info.subjectDetails).map(([key, value]) => (
                <DetailRow key={key} label={key} value={value as string} />
              ))}
            </div>
          </div>
        </InfoSection>

        {/* Issuer Section */}
        <InfoSection icon={<Building className="w-5 h-5" />} title={t('issuer')} theme={theme}>
          <div className="space-y-2">
            <p className="text-sm font-mono break-all bg-island-bg/40 p-2 rounded-lg border border-island-border/50">
              {info.issuer}
            </p>
            <div className="grid grid-cols-1 gap-1">
              {Object.entries(info.issuerDetails).map(([key, value]) => (
                <DetailRow key={key} label={key} value={value as string} />
              ))}
            </div>
          </div>
        </InfoSection>

        {/* Validity Section */}
        <InfoSection icon={<Calendar className="w-5 h-5" />} title={t('validity')} theme={theme}>
          <div className="space-y-2">
            <DetailRow label={t('notBefore')} value={new Date(info.notBefore).toLocaleString()} />
            <DetailRow label={t('notAfter')} value={new Date(info.notAfter).toLocaleString()} />
            <DetailRow label={t('serialNumber')} value={info.serialNumber} />
            <DetailRow label={t('version')} value={String(info.version)} />
          </div>
        </InfoSection>

        {/* Public Key Section */}
        <InfoSection icon={<Key className="w-5 h-5" />} title={t('publicKey')} theme={theme}>
          <div className="space-y-2">
            <DetailRow label={t('signatureAlgorithm')} value={info.signatureAlgorithm} />
            <DetailRow label="Algorithm" value={info.publicKey.algorithm} />
            <p className="text-xs text-muted-foreground mt-2">{info.publicKey.details}</p>
          </div>
        </InfoSection>
      </div>

      {/* Fingerprints Section */}
      <InfoSection icon={<Fingerprint className="w-5 h-5" />} title={t('fingerprints')} theme={theme}>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">SHA-1</p>
            <p className="text-xs font-mono break-all bg-island-bg/40 p-2 rounded-lg border border-island-border/50">
              {info.fingerprints.sha1}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">SHA-256</p>
            <p className="text-xs font-mono break-all bg-island-bg/40 p-2 rounded-lg border border-island-border/50">
              {info.fingerprints.sha256}
            </p>
          </div>
        </div>
      </InfoSection>

      {/* Extensions Section */}
      <InfoSection icon={<Layers className="w-5 h-5" />} title={t('extensions')} theme={theme}>
        <div className="space-y-2">
          {info.extensions.map((ext: CertificateExtension, idx: number) => (
            <div key={idx} className="p-3 rounded-lg border border-island-border/50 bg-island-bg/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">{ext.name}</span>
                {
                  ext.critical
                  && (
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                      {t('critical')}
                    </span>
                  )
                }
              </div>
              <p className="text-xs text-muted-foreground mb-1 font-mono">{ext.oid}</p>
            </div>
          ))}
        </div>
      </InfoSection>
    </motion.div>
  );
}
