import { FORMAT_LABELS } from '@/app/data-transformer/transformer.utils';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { DataFormat } from './transformer.types';

interface FormatSelectorProps {
  value: DataFormat;
  onChange: (val: DataFormat) => void;
  options: DataFormat[];
  activeColor: string;
}

export default function FormatSelector(
  {
    value,
    onChange,
    options,
    activeColor
  }: FormatSelectorProps,
): ReactNode {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);

  useEffect((): () => void => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative h-full flex items-center" ref={containerRef}>
      <button
        onClick={(): void => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest outline-none',
          activeColor,
          isOpen && 'bg-white/5'
        )}
        aria-label="Select data format"
      >
        <span>{FORMAT_LABELS[value]}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {
          isOpen
          && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
              className="absolute top-full left-0 mt-2 min-w-40 z-50 glass-island bg-island-card/90 backdrop-blur-xl border border-island-border rounded-2xl shadow-2xl p-1.5 overflow-hidden"
            >
              <div className="flex flex-col gap-0.5">
                {
                  options.map((val: DataFormat) => (
                    <button
                      key={val}
                      onClick={(): void => {
                        onChange(val);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all',
                        value === val
                          ? cn('bg-white/5', activeColor)
                          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      )}
                    >
                      <span>{FORMAT_LABELS[val]}</span>
                      {
                        value === val
                        && (
                          <Check className="w-3 h-3" />
                        )
                      }
                    </button>
                  ))
                }
              </div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  );
}
