import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

type UsePlantumlActions = {
  handleDownload: (svgContent: string | null) => void;
  handleCopy: (svgContent: string | null) => void;
  handleCopyAsImage: (svgContent: string | null) => Promise<void>;
  isCopied: (id?: string) => boolean;
};

export function usePlantUmlActions(): UsePlantumlActions {
  const { copy, isCopied, setCopied } = useCopyToClipboard();

  const handleDownload = (svgContent: string | null): void => {
    if (!svgContent) return;
    const blob: Blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (svgContent: string | null): void => {
    if (!svgContent) return;
    copy(svgContent, 'svg');
  };

  const handleCopyAsImage = async (svgContent: string | null): Promise<void> => {
    if (!svgContent) return;

    try {
      const parser: DOMParser = new DOMParser();
      const svgDoc: Document = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement: HTMLElement = svgDoc.documentElement;

      // Get dimensions
      const width: number = parseInt(svgElement.getAttribute('width') || '0', 10);
      const height: number = parseInt(svgElement.getAttribute('height') || '0', 10);

      if (!width || !height) {
        // Fallback to viewBox or bounding box if width/height are not explicitly set
        const viewBox: string | null = svgElement.getAttribute('viewBox');
        if (viewBox) {
          const [, , vbWidth, vbHeight] = viewBox.split(/\s+/).map(Number);
          if (vbWidth && vbHeight) {
            svgElement.setAttribute('width', vbWidth.toString());
            svgElement.setAttribute('height', vbHeight.toString());
          }
        }
      }

      // Re-read dimensions after potential fix
      const finalWidth: number = parseInt(svgElement.getAttribute('width') || '0', 10);
      const finalHeight: number = parseInt(svgElement.getAttribute('height') || '0', 10);

      if (!finalWidth || !finalHeight) return;

      const canvas: HTMLCanvasElement = document.createElement('canvas');
      const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
      if (!ctx) return;

      // Use a higher scale for better quality
      const scale: number = 2;
      canvas.width = finalWidth * scale;
      canvas.height = finalHeight * scale;
      ctx.scale(scale, scale);

      // Add white background (optional but often preferred for diagrams)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, finalWidth, finalHeight);

      const svgData: string = new XMLSerializer().serializeToString(svgElement);
      const svgBlob: Blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url: string = URL.createObjectURL(svgBlob);

      const img: HTMLImageElement = new Image();
      img.onload = (): void => {
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob: Blob | null) => {
          if (blob) {
            try {
              const item: ClipboardItem = new ClipboardItem({ [blob.type]: blob });
              await navigator.clipboard.write([item]);
              setCopied('image');
            } catch (err) {
              console.error('Failed to copy image to clipboard:', err);
            }
          }
        }, 'image/png');
      };
      img.src = url;
    } catch (error) {
      console.error('Error converting SVG to PNG:', error);
    }
  };

  return {
    handleDownload,
    handleCopy,
    handleCopyAsImage,
    isCopied,
  };
}
