import { JwtMode } from './use-jwt-state';
import { Button } from '@/components/ui/button';
import { Key, Unlock, Shield, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import React, { ReactNode } from 'react';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { ViewMode } from '@/hooks/use-view-mode';
import { CategoryTheme } from '@/lib/config/categories';
import { useTranslations } from 'next-intl';
import { ToolId } from '@/lib/config/tools';

interface JwtToolbarProps {
  mode: JwtMode;
  setMode: (mode: JwtMode) => void;
  algorithm: string;
  setAlgorithm: (algo: string) => void;
  secret: string;
  setSecret: (secret: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  theme: CategoryTheme;
  isDropdown?: boolean;
}

const ALGORITHMS: string[] = [
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'PS256', 'PS384', 'PS512',
  'ES256', 'ES384', 'ES512'
];

export function JwtToolbar(
  {
    mode,
    setMode,
    algorithm,
    setAlgorithm,
    secret,
    setSecret,
    viewMode,
    setViewMode,
    theme,
    isDropdown = false,
  }: JwtToolbarProps,
): ReactNode {
  const tCommon = useTranslations('Common');
  const tTools = useTranslations('Tools');
  const isSymmetric: boolean = algorithm.startsWith('HS');

  return (
    <div className={cn('flex items-center gap-3', isDropdown && 'flex-col items-stretch')}>
      {/* Config Selector (Algorithm/Secret/Key) - Only in Encode mode */}
      {
        mode === JwtMode.ENCODE
        && (
          <div
            className={cn(
              'flex items-center gap-2 bg-island-bg border border-island-border rounded-xl shadow-inner px-2 h-10',
              isDropdown && 'w-full flex-col h-auto py-2 items-stretch'
            )}
          >
            {/* Algorithm Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] font-mono gap-2 hover:bg-white/5">
                  <Settings2 className="w-3 h-3 text-muted-foreground" /> {algorithm}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-island-card border-island-border max-h-[300px] overflow-auto custom-scrollbar">
                {
                  ALGORITHMS.map((algo: string) => (
                    <DropdownMenuItem
                      key={algo}
                      onClick={(): void => setAlgorithm(algo)}
                      className="text-[11px] font-mono"
                    >
                      {algo}
                    </DropdownMenuItem>
                  ))
                }
              </DropdownMenuContent>
            </DropdownMenu>

            {!isDropdown && <div className="w-px h-4 bg-island-border mx-1" />}

            {/* Secret/Key Input */}
            <div
              className={cn(
                'flex items-center gap-2 bg-island-bg/50 px-3 h-7 rounded-xl border border-island-border/50 min-w-[150px]',
                isDropdown && 'w-full'
              )}
            >
              <Shield className="w-3 h-3 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={secret}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSecret(e.target.value)}
                placeholder={isSymmetric ? tTools(`${ToolId.JWT_DEC}.hmacSecret`) : tTools(`${ToolId.JWT_DEC}.privateKey`)}
                className="bg-transparent border-none outline-none text-[10px] font-mono w-full text-foreground placeholder:text-muted-foreground/30"
              />
            </div>
          </div>
        )
      }

      {/* Mode Selector (Decode/Encode) */}
      <div
        className={cn(
          'flex items-center bg-island-bg border border-island-border rounded-xl shadow-inner px-1 h-10',
          isDropdown && 'w-full justify-between'
        )}
      >
        <Button
          onClick={(): void => setMode(JwtMode.DECODE)}
          variant={mode === JwtMode.DECODE ? 'active' : 'tab'}
          size="sm"
          className={cn('gap-2 flex-1', mode === JwtMode.DECODE && theme.text)}
        >
          <Unlock className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolModes.decode')}</span>
        </Button>
        <Button
          onClick={(): void => setMode(JwtMode.ENCODE)}
          variant={mode === JwtMode.ENCODE ? 'active' : 'tab'}
          size="sm"
          className={cn('gap-2 flex-1', mode === JwtMode.ENCODE && theme.text)}
        >
          <Key className="w-3.5 h-3.5" />
          <span className={cn('md:inline', !isDropdown && 'hidden')}>{tCommon('toolModes.encode')}</span>
        </Button>
      </div>

      {/* View Mode Toggle (Editor/Split/Preview) */}
      <ViewModeToggle
        viewMode={viewMode}
        setViewMode={setViewMode}
        className={cn(isDropdown && 'w-full')}
      />
    </div>
  );
}
