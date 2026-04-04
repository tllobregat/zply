import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';
import MonacoEditor from '@/components/monaco-editor';
import { Check, Copy, FileOutput, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { ReactNode } from 'react';

interface JwtTokenInputProps {
  token: string;
  onTokenChange?: (val: string) => void;
  className?: string;
  title?: string;
  readOnly?: boolean;
}

export function JwtTokenInput(
  {
    token,
    onTokenChange,
    className,
    title = 'Encoded Token',
    readOnly = false
  }: JwtTokenInputProps,
): ReactNode {
  const { resolvedTheme } = useTheme();
  const { isCopied, copy } = useCopyToClipboard();

  return (
    <div
      className={cn(
        'border-island-border flex flex-col',
        resolvedTheme === 'dark' ? 'bg-island-bg/10' : 'bg-white',
        className
      )}
    >
      <div
        className="px-6 py-3 border-b border-island-border bg-island-card flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
        <div className="flex items-center gap-2">
          {readOnly ? <FileOutput className="w-3.5 h-3.5 text-blue-400/50" /> : <Lock className="w-3.5 h-3.5 text-purple-400/50" />}
          {title}
        </div>
        {
          readOnly
          && token
          && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px] gap-1 hover:bg-white/5"
              onClick={(): void => copy(token)}
            >
              {isCopied() ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              {isCopied() ? 'Copied' : 'Copy'}
            </Button>
          )
        }
      </div>
      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          defaultLanguage="plaintext"
          value={token}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          onChange={(value: string | undefined): void => onTokenChange?.(value || '')}
          options={{
            readOnly,
            fontSize: 13,
            padding: { top: 20 },
            lineNumbers: 'off',
            renderLineHighlight: 'none',
            folding: false,
          }}
        />
      </div>
    </div>
  );
}
