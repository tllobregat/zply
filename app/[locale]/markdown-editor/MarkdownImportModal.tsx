import { ToolId } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface MarkdownImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mode: 'overwrite' | 'new-tab') => void;
  resolvedTheme?: string;
}

export function MarkdownImportModal({ isOpen, onClose, onConfirm, resolvedTheme }: MarkdownImportModalProps) {
  const tMarkdown = useTranslations(`Tools.${ToolId.MARKDOWN}`);

  return (
    <AnimatePresence>
      {
        isOpen
        && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-background/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                'relative w-full max-w-lg overflow-hidden rounded-3xl border border-island-border shadow-2xl',
                resolvedTheme === 'dark' ? 'bg-[#0a0f1e]/90' : 'bg-white/90'
              )}
            >
              <div className="p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                    <LucideIcons.FileUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">
                      {tMarkdown('importConfirmation.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tMarkdown('importConfirmation.description')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="w-full sm:w-auto sm:order-1"
                  >
                    {tMarkdown('importConfirmation.cancel')}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onConfirm('new-tab')}
                    className="w-full sm:w-auto sm:order-2"
                  >
                    {tMarkdown('importConfirmation.openNewTab')}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => onConfirm('overwrite')}
                    className="w-full sm:w-auto px-6 sm:order-3"
                  >
                    {tMarkdown('importConfirmation.overwrite')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )
      }
    </AnimatePresence>
  );
}
