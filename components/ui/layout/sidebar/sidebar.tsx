'use client';

import { usePinnedTools } from '@/hooks/use-pinned-tools';
import type { ToolConfig } from '@/lib/config/tools';
import { TOOLS } from '@/lib/config/tools';
import React, { useMemo, useState } from 'react';
import { SidebarLogo } from './sidebar-logo';
import { SidebarSearch } from './sidebar-search';
import { SidebarPinnedTools } from './sidebar-pinned-tools';
import { SidebarActions } from './sidebar-actions';
import { SidebarMobileToggle } from './sidebar-mobile-toggle';
import { SidebarMobileMenu } from './sidebar-mobile-menu';

export function Sidebar(): React.ReactNode {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { pinnedIds }: { pinnedIds: string[] } = usePinnedTools();

  const pinnedTools: ToolConfig[] = useMemo(() => {
    return pinnedIds
      .map((id: string): ToolConfig | undefined =>
        TOOLS.find((t: ToolConfig): boolean => t.id === id)
      )
      .filter((t: ToolConfig | undefined): t is ToolConfig => Boolean(t));
  }, [pinnedIds]);

  return (
    <aside
      className="w-auto sm:w-20 h-auto sm:h-full flex flex-row sm:flex-col items-center py-2 sm:py-8 px-4 sm:px-0 gap-2 sm:gap-0 glass-island rounded-2xl sm:rounded-3xl border border-island-border shadow-xl z-50 mb-safe sm:mb-0 mx-2 sm:ml-3 sm:mr-0">
      
      <SidebarLogo />

      <div className="w-px sm:w-8 h-8 sm:h-px bg-island-border/50 mx-2 sm:mx-auto my-0 sm:my-2 hidden sm:block" />

      <nav className="flex-1 flex flex-row sm:flex-col items-center justify-start sm:mt-6 gap-3 sm:gap-6">
        <SidebarSearch />
        <SidebarPinnedTools pinnedTools={pinnedTools} />
      </nav>

      <div className="hidden sm:block w-px sm:w-8 h-8 sm:h-px bg-island-border/50 mx-2 sm:mx-auto my-0 sm:my-2" />

      <SidebarMobileToggle isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <SidebarActions />

      <SidebarMobileMenu isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} pinnedTools={pinnedTools} />
    </aside>
  );
}
