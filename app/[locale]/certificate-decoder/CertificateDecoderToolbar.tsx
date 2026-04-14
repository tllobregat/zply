import { CopyButton } from '@/components/ui/copy-button';
import { ViewModeToggle } from '@/components/ui/layout';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { CertViewMode } from './use-certificate-decoder-state';

interface CertificateDecoderToolbarProps {
  content: string;
  viewMode: CertViewMode;
  onViewModeChange: (mode: CertViewMode) => void;
}

export function CertificateDecoderToolbar(
  {
    content,
    viewMode,
    onViewModeChange
  }: CertificateDecoderToolbarProps,
) {
  const { isCopied, copy } = useCopyToClipboard();

  return (
    <div className="flex items-center gap-3">
      <ViewModeToggle
        viewMode={viewMode}
        setViewMode={onViewModeChange}
        className="h-10"
      />
      <div className="w-px h-6 bg-island-border mx-1" />
      <CopyButton
        isCopied={isCopied()}
        onCopy={() => copy(content)}
        className="h-10 rounded-xl px-4"
      />
    </div>
  );
}
