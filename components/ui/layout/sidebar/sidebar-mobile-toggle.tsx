'use client';

import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

interface SidebarMobileToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function SidebarMobileToggle({ isOpen, setIsOpen }: SidebarMobileToggleProps): React.ReactNode {
  const tCommon = useTranslations('Common');

  return (
    <div className="sm:hidden">
      <button
        onClick={(): void => setIsOpen(!isOpen)}
        className="p-3 rounded-xl transition-all relative text-muted-foreground hover:text-zply-blue hover:bg-zply-blue/10 flex items-center gap-1"
        aria-label={tCommon('sidebar.toggleMobileMenu')}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </div>
  );
}
