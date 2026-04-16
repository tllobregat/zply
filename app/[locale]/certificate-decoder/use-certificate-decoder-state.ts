import { useShareableState } from '@/hooks/use-shareable-state';
import { DEFAULT_CERTIFICATE } from './certificate-decoder.default';

export enum CertViewMode {
  EDITOR = 'editor',
  SPLIT = 'split',
  PREVIEW = 'preview'
}

export function useCertificateDecoderState() {
  const [content, setContent] = useShareableState<string>('c', DEFAULT_CERTIFICATE);
  const [viewMode, setViewMode] = useShareableState<CertViewMode>('m', CertViewMode.SPLIT);

  return {
    content,
    setContent,
    viewMode,
    setViewMode
  };
}
