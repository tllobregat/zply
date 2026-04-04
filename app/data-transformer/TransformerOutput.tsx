import { DataFormat } from '@/app/data-transformer/transformer.types';
import { FORMAT_LABELS } from '@/app/data-transformer/transformer.utils';
import { getMonacoLanguage } from '@/app/data-transformer/use-transformer-transformation';
import MonacoEditor from '@/components/monaco-editor';
import { AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

interface TransformerOutputProps {
  content: string;
  format: DataFormat;
  error: string | null;
}

export function TransformerOutput({ content, format, error }: TransformerOutputProps): React.ReactNode {
  const { resolvedTheme } = useTheme();

  if (error) {
    return (
      <div className="flex-1 min-w-0 h-1/2 md:h-full bg-island-bg/30 flex flex-col relative">
        <div className="flex-1 flex flex-col items-center justify-center text-red-400 gap-4 p-8">
          <AlertCircle className="w-12 h-12 opacity-50" />
          <div className="text-center">
            <p className="font-bold uppercase tracking-widest text-[10px] mb-1">Parsing Error</p>
            <p className="text-sm font-mono break-all max-w-md">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 h-1/2 md:h-full bg-island-bg/30 flex flex-col relative">
      <div
        className="absolute top-4 right-8 z-10 px-2 py-1 rounded bg-island-bg/50 border border-island-border text-[9px] font-black uppercase tracking-widest text-muted-foreground backdrop-blur-sm pointer-events-none">
        Output: {FORMAT_LABELS[format]}
      </div>
      <div className="flex-1 pt-2">
        <MonacoEditor
          value={content}
          language={getMonacoLanguage(format)}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            readOnly: true,
            lineNumbers: 'on',
            padding: { top: 40 },
          }}
        />
      </div>
    </div>
  );
}
