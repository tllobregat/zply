'use client';

import { EditorPreviewWorkspace } from '@/components/ui/layout';
import { ToolPageLayout } from '@/components/ui/layout/';
import { CATEGORY_COLORS, getCategoryClasses } from '@/lib/config/categories';
import { Category, ToolId } from '@/lib/config/tools';
import { AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DEFAULT_CERTIFICATE } from './certificate-decoder.default';
import { CertificateDecoderToolbar } from './CertificateDecoderToolbar';
import { CertificateEmptyView } from './CertificateEmptyView';
import { CertificateErrorView } from './CertificateErrorView';
import { CertificateInfoView } from './CertificateInfoView';
import { useCertificateDecoderState } from './use-certificate-decoder-state';
import { useCertificateDecoderTransformation } from './use-certificate-decoder-transformation';

export default function CertificateDecoderClient() {
  const t = useTranslations(`Tools.${ToolId.CERT_DEC}`);
  const tCategories = useTranslations('Categories');

  const { content, setContent, viewMode, setViewMode } = useCertificateDecoderState();
  const { info, error, isProcessing } = useCertificateDecoderTransformation(content);

  const theme = getCategoryClasses(CATEGORY_COLORS[Category.SECURITY]);

  const handleReset = () => setContent(DEFAULT_CERTIFICATE);

  const renderPreview = () => {
    if (error) {
      return <CertificateErrorView error={error} onReset={handleReset} />;
    }

    if (info) {
      return <CertificateInfoView info={info} theme={theme} />;
    }

    return <CertificateEmptyView isProcessing={isProcessing} />;
  };

  return (
    <ToolPageLayout
      toolId={ToolId.CERT_DEC}
      title={t('title')}
      icon={<ShieldCheck className="w-6 h-6" />}
      breadcrumbItems={[
        { label: tCategories(Category.SECURITY), href: `/?category=${Category.SECURITY}` },
        { label: t('title') },
      ]}
      headerActions={
        <CertificateDecoderToolbar
          content={content}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
    >
      <EditorPreviewWorkspace
        value={content}
        onChange={setContent}
        viewMode={viewMode}
        language="text"
        editorProps={{
          options: {
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            scrollBeyondLastLine: false,
          }
        }}
        preview={
          <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-6 bg-island-bg/20">
            <AnimatePresence mode="wait">
              {renderPreview()}
            </AnimatePresence>
          </div>
        }
      />
    </ToolPageLayout>
  );
}
