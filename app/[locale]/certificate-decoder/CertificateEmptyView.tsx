'use client';

import { useTranslations } from 'next-intl';

interface CertificateEmptyViewProps {
  isProcessing: boolean;
}

export function CertificateEmptyView({ isProcessing }: CertificateEmptyViewProps) {
  const tCommon = useTranslations('Common');
  const t = useTranslations('Tools.certificate-decoder');

  return (
    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground italic">
      {
        isProcessing
          ? (
            tCommon('syncing')
          )
          : (
            t('placeholder')
          )
      }
    </div>
  );
}
