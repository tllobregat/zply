'use client';

import { Command, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

interface CommandMenuInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function CommandMenuInput({ value, onChange, onKeyDown }: CommandMenuInputProps): React.ReactNode {
  const tCommon = useTranslations('Common');

  return (
    <div className="flex items-center px-5 sm:px-8 py-3 sm:py-4 border-b border-island-border">
      <Search className="w-5 h-5 text-muted mr-3" />
      <input
        autoFocus
        placeholder={tCommon('sidebar.commandMenu.placeholder')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted/50 text-base sm:text-lg py-1.5"
      />
      <div
        className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-island-bg border border-island-border text-[10px] font-black text-muted-foreground">
        <Command className="w-3 h-3" /> K
      </div>
      <div className="w-5 ml-3 sm:hidden" />
    </div>
  );
}
