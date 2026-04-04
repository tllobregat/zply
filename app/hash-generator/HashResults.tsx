import HashResultRow from '@/app/hash-generator/HashResultRow';
import { Hashes } from '@/app/hash-generator/use-hash-transformation';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface HashResultsProps {
  hashes: Hashes;
  isCopied: (k: string) => boolean;
  onCopy: (val: string, k: string) => void;
  theme: CategoryTheme;
  className?: string;
}

export function HashResults(
  {
    hashes,
    isCopied,
    onCopy,
    theme,
    className,
  }: HashResultsProps,
): ReactNode {
  return (
    <div className={cn("flex flex-col p-8 md:p-10 overflow-y-auto custom-scrollbar gap-6", className)}>
      <HashResultRow
        label="MD5"
        value={hashes.md5}
        isCopied={isCopied('md5')}
        onCopy={() => onCopy(hashes.md5, 'md5')}
        theme={theme}
      />
      <HashResultRow
        label="SHA-1"
        value={hashes.sha1}
        isCopied={isCopied('sha1')}
        onCopy={() => onCopy(hashes.sha1, 'sha1')}
        theme={theme}
      />
      <HashResultRow
        label="SHA-256"
        value={hashes.sha256}
        isCopied={isCopied('sha256')}
        onCopy={() => onCopy(hashes.sha256, 'sha256')}
        theme={theme}
      />
      <HashResultRow
        label="SHA-512"
        value={hashes.sha512}
        isCopied={isCopied('sha512')}
        onCopy={() => onCopy(hashes.sha512, 'sha512')}
        theme={theme}
      />
    </div>
  );
}
