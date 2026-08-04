import { Button } from '@/components/ui/button';
import { ViewModeToggle } from '@/components/ui/layout';
import { ToolId } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { Layout } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';

interface DbSchemaToolbarProps {
  viewMode: 'editor' | 'split' | 'preview';
  setViewMode: (mode: 'editor' | 'split' | 'preview') => void;
  onUpdateSchema: () => void;
  isDropdown?: boolean;
}

export function DbSchemaToolbar(
  {
    viewMode,
    setViewMode,
    onUpdateSchema,
    isDropdown = false,
  }: DbSchemaToolbarProps,
): ReactNode {
  const t: ReturnType<typeof useTranslations> = useTranslations('Tools');

  return (
    <div className={cn("flex items-center gap-3 w-full sm:w-auto", isDropdown && "flex-col items-stretch")}>
      <ViewModeToggle 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        className={cn("shrink-0", isDropdown && "w-full")}
      />
      <Button
        onClick={onUpdateSchema}
        variant="tab"
        size="sm"
        className={cn("flex-1 sm:flex-initial gap-2 text-primary whitespace-nowrap", isDropdown && "w-full justify-start py-3")}
      >
        <Layout className="w-3.5 h-3.5" /> 
        <span>{t(`${ToolId.DB_SCHEMA}.autoOrganize`)}</span>
      </Button>
    </div>
  );
}
