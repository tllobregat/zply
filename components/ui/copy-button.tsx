import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import React from 'react';

interface CopyButtonProps extends ButtonProps {
  isCopied: boolean;
  onCopy: () => void;
  copyText?: string;
  copiedText?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export function CopyButton(
  {
    isCopied,
    onCopy,
    copyText = 'Copy',
    copiedText = 'Copied',
    showIcon = true,
    showText = true,
    className,
    variant = 'ghost',
    size = 'sm',
    ...props
  }: CopyButtonProps,
): React.ReactNode {
  return (
    <Button
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onCopy();
      }}
      variant={variant}
      size={size}
      className={cn(
        'transition-all gap-1.5',
        isCopied && 'text-green-500 hover:text-green-500',
        className
      )}
      {...props}
    >
      {
        showIcon
        && (
          isCopied
            ? (
              <Check className="w-3.5 h-3.5" />
            )
            : (
              <Copy className="w-3.5 h-3.5" />
            )
        )
      }
      {showText && (isCopied ? copiedText : copyText)}
    </Button>
  );
}
