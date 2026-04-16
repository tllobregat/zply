'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface CertificateErrorViewProps {
  error: string;
  onReset: () => void;
}

export function CertificateErrorView({ error, onReset }: CertificateErrorViewProps) {
  const t = useTranslations('Tools.certificate-decoder');

  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center h-64 text-center p-8 border border-red-500/20 rounded-2xl bg-red-500/5"
    >
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-xl font-semibold text-red-500 mb-2">{t('invalidCert')}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{error}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        {t('resetToDefault')}
      </Button>
    </motion.div>
  );
}
