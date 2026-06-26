'use client';

import { ToolPageLayout } from '@/components/ui/layout';
import { ToolId, Category } from '@/lib/config/tools';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Lock, Shield, Hash, Type, CaseUpper, CaseLower, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { usePasswordGeneratorState } from './use-password-generator-state';
import { usePasswordGeneratorTransformation } from './use-password-generator-transformation';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';
import React from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { CATEGORY_COLORS, getCategoryClasses, CategoryTheme } from '@/lib/config/categories';
import { motion } from 'framer-motion';

export default function PasswordGeneratorClient(): React.ReactNode {
  const t = useTranslations('Tools.password-generator');
  const tCategories = useTranslations('Categories');
  const { resolvedTheme } = useTheme();
  const { options, updateOption, refreshTrigger, regenerate } = usePasswordGeneratorState();
  const result = usePasswordGeneratorTransformation(options, refreshTrigger);
  const { copy, isCopied } = useCopyToClipboard();

  const theme: CategoryTheme = getCategoryClasses(CATEGORY_COLORS[Category.SECURITY]);
  const isDark: boolean = resolvedTheme === 'dark';

  const handleCopy = (): void => {
    if (result?.password) {
      copy(result.password, 'main');
    }
  };

  const getStrengthClasses = (strength: string): string => {
    switch (strength) {
      case 'weak': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'fair': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'good': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'strong': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'very-strong': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <ToolPageLayout
      toolId={ToolId.PASSWORD_GEN}
      title={t('title')}
      icon={<Lock />}
      breadcrumbItems={[{ label: tCategories(Category.SECURITY), href: '/?category=Security' }]}
      workspaceClassName="p-0 flex-col overflow-y-auto custom-scrollbar"
    >
      <div className="flex flex-col min-h-full">
        {/* Hero Section */}
        <div className="relative p-6 md:p-8 lg:p-10 border-b border-island-border bg-island-bg/40 flex flex-col items-center gap-6 group overflow-hidden shrink-0">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Lock className="w-48 h-48" />
          </div>

          <div className="w-full max-w-4xl space-y-3 relative z-10">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t('title')}</span>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={regenerate}
                   className={cn("p-2 rounded-lg transition-all hover:bg-white/10 active:scale-95 cursor-pointer", theme.text)}
                   title={t('regenerate')}
                 >
                    <RefreshCw className="w-4 h-4" />
                 </button>
                 <CopyButton
                   onCopy={handleCopy}
                   isCopied={isCopied('main')}
                   copyText={t('copy')}
                   copiedText={t('copied')}
                   className={cn(
                     '-mr-2 transition-colors font-bold',
                     !isCopied('main') && theme.hoverText
                   )}
                 />
              </div>
            </div>
            <div className={cn(
              "w-full text-center p-6 md:p-8 rounded-[2rem] font-mono text-xl md:text-3xl lg:text-4xl break-all transition-all duration-300 shadow-inner min-h-[6rem] flex items-center justify-center border",
              isDark ? 'bg-black/40 text-white border-white/5 shadow-black/40' : 'bg-white text-slate-900 border-slate-200'
            )}>
              {result?.password || '••••••••••••••••'}
            </div>
          </div>

          {
            result
            && (
              <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
                <div className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors border shadow-sm",
                  getStrengthClasses(result.strength)
                )}>
                  <Shield className="w-3.5 h-3.5" />
                  {t(`strength.${result.strength}`).toUpperCase()}
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border shadow-sm",
                  isDark ? 'bg-white/5 text-slate-400 border-white/10' : 'bg-white text-slate-600 border-slate-200'
                )}>
                  <Hash className="w-3.5 h-3.5" />
                  {t('entropy', { value: Math.round(result.entropy) })}
                </div>
              </div>
            )
          }
        </div>

        {/* Configuration & Info Section */}
        <div className="p-6 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto w-full flex-1">
           {/* Left Column: Settings */}
           <div className="space-y-8">
              <div className="space-y-2">
                 <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-3">{t('options.title')}</h4>
                 <div className="space-y-1">
                    <SettingToggle
                       icon={<CaseUpper className="w-4 h-4" />}
                       label={t('options.uppercase')}
                       checked={options.uppercase}
                       onChange={(val: boolean): void => updateOption('uppercase', val)}
                       theme={theme}
                       isDark={isDark}
                    />
                    <SettingToggle
                       icon={<CaseLower className="w-4 h-4" />}
                       label={t('options.lowercase')}
                       checked={options.lowercase}
                       onChange={(val: boolean): void => updateOption('lowercase', val)}
                       theme={theme}
                       isDark={isDark}
                    />
                    <SettingToggle
                       icon={<Hash className="w-4 h-4" />}
                       label={t('options.numbers')}
                       checked={options.numbers}
                       onChange={(val: boolean): void => updateOption('numbers', val)}
                       theme={theme}
                       isDark={isDark}
                    />
                    <SettingToggle
                       icon={<Type className="w-4 h-4" />}
                       label={t('options.symbols')}
                       checked={options.symbols}
                       onChange={(val: boolean): void => updateOption('symbols', val)}
                       theme={theme}
                       isDark={isDark}
                    />
                    <div className="pt-2">
                      <SettingToggle
                        icon={<AlertCircle className="w-4 h-4" />}
                        label={t('options.excludeSimilar')}
                        checked={options.excludeSimilar}
                        onChange={(val: boolean): void => updateOption('excludeSimilar', val)}
                        theme={theme}
                        isDark={isDark}
                      />
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Length & Entropy */}
           <div className="space-y-10">
              <div className="space-y-6">
                 <div className="flex justify-between items-end px-3">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">{t('options.length')}</label>
                    <span className={cn("text-5xl font-black tabular-nums leading-none", theme.text)}>{options.length}</span>
                 </div>
                 <div className="px-3">
                    <input 
                      type="range"
                      min="4"
                      max="128"
                      value={options.length}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => updateOption('length', parseInt(e.target.value))}
                      className={cn(
                        "w-full h-3 rounded-full appearance-none cursor-pointer",
                        isDark ? 'bg-white/10' : 'bg-slate-200'
                      )}
                      style={{
                        accentColor: CATEGORY_COLORS[Category.SECURITY]
                      }}
                    />
                 </div>
              </div>

              <div className={cn(
                "p-8 rounded-[2rem] border transition-all",
                isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
              )}>
                 <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-2xl shrink-0 shadow-sm", theme.icon)}>
                       <Info className="w-6 h-6" />
                    </div>
                    <div className="space-y-3">
                       <h4 className="font-black text-lg tracking-tight">{t('entropy', { value: result ? Math.round(result.entropy) : 0 })}</h4>
                       <p className="text-sm text-muted-foreground leading-relaxed">
                          {t('entropy_info')}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}

interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  theme: CategoryTheme;
  isDark: boolean;
}

function SettingToggle({ icon, label, checked, onChange, theme, isDark }: SettingToggleProps): React.ReactNode {
  return (
    <button
      onClick={(): void => onChange(!checked)}
      className={cn(
        "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all group",
        isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2 rounded-xl transition-all duration-300",
          checked && theme.icon,
          !checked && isDark && "bg-white/5 text-slate-500",
          !checked && !isDark && "bg-slate-100 text-slate-400"
        )}>
          {icon}
        </div>
        <span className={cn(
          "text-sm font-bold transition-colors",
          checked ? "text-foreground" : "text-muted-foreground group-hover:text-slate-400"
        )}>
          {label}
        </span>
      </div>
      
      <div className={cn(
        "w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center",
        checked && theme.bg,
        !checked && isDark && "bg-white/10",
        !checked && !isDark && "bg-slate-200"
      )}>
        <motion.div
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-4 h-4 rounded-full bg-white shadow-md"
        />
      </div>
    </button>
  );
}
