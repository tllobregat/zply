import { cn } from '@/lib/utils';
import MonacoEditor from '@/components/monaco-editor';
import { Fingerprint } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { ReactNode } from 'react';

interface HashInputProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function HashInput({ value, onChange, className }: HashInputProps): ReactNode {
  const { resolvedTheme } = useTheme();

  return (
    <div className={cn("border-island-border flex flex-col", className)}>
      <div
        className="px-6 py-3 border-b border-island-border bg-island-card flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
        <Fingerprint className="w-3.5 h-3.5" /> Input Text
      </div>
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          defaultLanguage="plaintext"
          value={value}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          onChange={(v) => onChange(v || '')}
          options={{
            padding: { top: 20 },
          }}
        />
      </div>
    </div>
  );
}
