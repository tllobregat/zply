import { getCategoryClasses } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ImageIcon, RefreshCw, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';

interface PreviewContentProps {
  isEngineReady: boolean;
  svgContent: string | null;
  isRendering: boolean;
  isDebouncing: boolean;
  theme: ReturnType<typeof getCategoryClasses>;
}

export default function PreviewContent({ isEngineReady, svgContent, isRendering, isDebouncing, theme }: PreviewContentProps): React.ReactNode {
  if (!isEngineReady) {
    return (
      <motion.div
        key="booting"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center gap-4 text-slate-500"
      >
        <RefreshCw className={cn('w-8 h-8 animate-spin', theme.text)} />
        <p className="text-[10px] font-black uppercase tracking-widest">Booting JVM...</p>
      </motion.div>
    );
  }

  if (isRendering && !svgContent) {
    return (
      <motion.div
        key="rendering-initial"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center gap-4 text-slate-500"
      >
        <RefreshCw className={cn('w-8 h-8 animate-spin', theme.text)} />
        <p className="text-[10px] font-black uppercase tracking-widest">Generating Diagram...</p>
      </motion.div>
    );
  }

  if (svgContent) {
    return (
      <motion.div
        key={svgContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative h-full w-full flex flex-col items-center justify-center"
      >
        <TransformWrapper
          initialScale={1}
          minScale={0.1}
          maxScale={4}
          centerOnInit
          limitToBounds={false}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <Button
                  variant="tab"
                  size="icon"
                  onClick={() => zoomIn()}
                  className="h-8 w-8 rounded-lg"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="tab"
                  size="icon"
                  onClick={() => zoomOut()}
                  className="h-8 w-8 rounded-lg"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="tab"
                  size="icon"
                  onClick={() => resetTransform()}
                  className="h-8 w-8 rounded-lg"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <TransformComponent
                wrapperClass="!w-full !h-full cursor-grab active:cursor-grabbing"
                contentClass="!w-full !h-full flex items-center justify-center"
              >
                <div
                  className={cn(
                    'transition-all duration-700 p-8 rounded-xl bg-slate-50 shadow-2xl border border-white/10 mx-auto',
                    (isRendering || isDebouncing) && 'opacity-40 scale-[0.98] blur-[1px]'
                  )}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        {
          isRendering
          && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <RefreshCw className={cn('w-12 h-12 animate-spin', theme.text)} />
            </div>
          )
        }
      </motion.div>
    );
  }

  return (
    <motion.div
      key="awaiting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-3 opacity-20 text-slate-400"
    >
      <ImageIcon className="w-12 h-12" />
      <p className="text-[10px] font-black uppercase tracking-widest">Awaiting code...</p>
    </motion.div>
  );
}
