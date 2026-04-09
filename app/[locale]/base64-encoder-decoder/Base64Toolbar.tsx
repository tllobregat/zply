import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { ViewMode } from '@/hooks/use-view-mode';
import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import { FileUp, RefreshCw, Type, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { ReactNode } from 'react';
import { Base64Mode, InputType } from './base64.types';

interface Base64ToolbarProps {
  mode: Base64Mode;
  inputType: InputType;
  theme: CategoryTheme;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  onModeChange: (mode: Base64Mode) => void;
  onInputTypeChange: (type: InputType) => void;
  isDropdown?: boolean;
}

export function Base64Toolbar(
  {
    mode,
    inputType,
    theme,
    viewMode,
    setViewMode,
    onModeChange,
    onInputTypeChange,
    isDropdown = false,
  }: Base64ToolbarProps,
): ReactNode {
  const tCommon = useTranslations('Common');
  return (
    <div className={cn("flex items-center gap-3", isDropdown && "flex-col items-stretch")}>
      <div className={cn(
        "flex items-center bg-island-bg border border-island-border rounded-xl shadow-inner px-1 h-10",
        isDropdown && "w-full justify-between"
      )}>
        <Button
          onClick={(): void => onModeChange('encode')}
          variant={mode === 'encode' ? 'active' : 'tab'}
          size="sm"
          className={cn('gap-2 flex-1', mode === 'encode' && theme.text)}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolModes.encode')}</span>
        </Button>
        <Button
          onClick={(): void => onModeChange('decode')}
          variant={mode === 'decode' ? 'active' : 'tab'}
          size="sm"
          className={cn('gap-2 flex-1', mode === 'decode' && theme.text)}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolModes.decode')}</span>
        </Button>
      </div>

      {!isDropdown && <Separator className="h-6" />}

      {/* Source Type Switcher (only for Encode) */}
      {
        mode === 'encode'
        && (
          <div className={cn(
            "flex items-center bg-island-bg border border-island-border rounded-2xl shadow-inner px-1 h-10",
            isDropdown && "w-full justify-between"
          )}>
            <Button
              onClick={(): void => onInputTypeChange('text')}
              variant={inputType === 'text' ? 'active' : 'tab'}
              size="sm"
              className={cn('gap-2 flex-1', inputType === 'text' && theme.text)}
            >
              <Type className="w-3.5 h-3.5" />
              <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolModes.text')}</span>
            </Button>
            <Button
              onClick={(): void => onInputTypeChange('file')}
              variant={inputType === 'file' ? 'active' : 'tab'}
              size="sm"
              className={cn('gap-2 flex-1', inputType === 'file' && theme.text)}
            >
              <FileUp className="w-3.5 h-3.5" />
              <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolModes.file')}</span>
            </Button>
          </div>
        )
      }

      {!isDropdown && <Separator className="h-6" />}
      <ViewModeToggle 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        className={cn(isDropdown && "w-full")}
      />
    </div>
  );
}
