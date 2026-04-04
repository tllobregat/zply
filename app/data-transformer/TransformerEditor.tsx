import { DataFormat } from '@/app/data-transformer/transformer.types';
import { FORMAT_LABELS } from '@/app/data-transformer/transformer.utils';
import { getMonacoLanguage } from '@/app/data-transformer/use-transformer-transformation';
import MonacoEditor from '@/components/monaco-editor';
import { useTheme } from 'next-themes';
import React from 'react';

interface TransformerEditorProps {
  value: string;
  format: DataFormat;
  onChange: (val: string) => void;
}

export function TransformerEditor({ value, format, onChange }: TransformerEditorProps): React.ReactNode {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex-1 min-w-0 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-island-border bg-island-bg/10 flex flex-col relative">
      <div
        className="absolute top-4 right-8 z-10 px-2 py-1 rounded bg-island-bg/50 border border-island-border text-[9px] font-black uppercase tracking-widest text-muted-foreground backdrop-blur-sm pointer-events-none">
        Source: {FORMAT_LABELS[format]}
      </div>
      <div className="flex-1 pt-2">
        <MonacoEditor
          height="100%"
          language={getMonacoLanguage(format)}
          value={value}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          onChange={(val: string | undefined): void => onChange(val || '')}
          options={{
            padding: { top: 40 },
          }}
        />
      </div>
    </div>
  );
}
