import { Button } from '@/components/ui/button';
import { ViewModeToggle } from '@/components/ui/layout';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
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
  return (
    <div className={cn("flex items-center gap-3", isDropdown && "flex-col items-stretch")}>
      <ViewModeToggle 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        className={cn(isDropdown && "w-full")}
      />
      <Button
        onClick={onUpdateSchema}
        variant="tab"
        size="sm"
        className={cn("gap-2", isDropdown && "w-full justify-start py-3")}
      >
        <RefreshCw className="w-3.5 h-3.5" /> 
        <span>Force Layout</span>
      </Button>
    </div>
  );
}
