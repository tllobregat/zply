'use client';

import { CATEGORY_COLORS, CategoryColor, CategoryTheme, getCategoryClasses } from '@/lib/config/categories';
import type { ToolConfig } from '@/lib/config/tools';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Github, LucideIcon, ShieldCheck, X, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { Portal } from '../../portal';

interface SidebarMobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pinnedTools: ToolConfig[];
}

export function SidebarMobileMenu({ isOpen, setIsOpen, pinnedTools }: SidebarMobileMenuProps): React.ReactNode {
  const pathname: string = usePathname();
  const tTools = useTranslations('Tools');
  const tCommon = useTranslations('Common');

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 bg-background/90 backdrop-blur-xl z-100 sm:hidden flex flex-col p-6 overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zply-blue rounded-xl">
                  <Zap className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="text-xl font-black uppercase tracking-widest text-foreground">{tCommon('sidebar.menu')}</span>
              </div>
              <button
                onClick={(): void => setIsOpen(false)}
                className="p-3 rounded-xl bg-island-bg border border-island-border text-muted-foreground hover:text-foreground active:scale-90 transition-all"
                aria-label={tCommon('sidebar.closeMenu')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-10">
              {pinnedTools.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col gap-5"
                >
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">{tCommon('sidebar.pinnedTools')}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {pinnedTools.map((tool: ToolConfig, index: number) => {
                      const Icon: LucideIcon = tool.icon;
                      const isActive: boolean = pathname === tool.href;
                      const categoryColor: CategoryColor = CATEGORY_COLORS[tool.category];
                      const theme: CategoryTheme = getCategoryClasses(categoryColor);

                      return (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + (index * 0.05) }}
                        >
                          <Link
                            href={tool.href}
                            onClick={(): void => setIsOpen(false)}
                            className={cn(
                              'flex items-center gap-4 p-4 rounded-2xl transition-all',
                              isActive ? 'bg-zply-blue/10 border border-zply-blue/20' : 'bg-island-bg border border-island-border active:scale-[0.98]'
                            )}
                          >
                            <div className={cn(
                              'p-3 rounded-xl transition-all shrink-0',
                              isActive ? cn('shadow-sm text-white', theme.bg) : cn('bg-island-bg border border-island-border', theme.text)
                            )}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className={cn('text-sm font-bold', isActive ? 'text-foreground' : 'text-foreground/80')}>
                                {tTools(`${tool.id}.title`)}
                              </span>
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {tTools(`${tool.id}.description`)}
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-5"
              >
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">{tCommon('sidebar.preferencesLinks')}</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <ThemeToggle variant="mobile" />
                    </motion.div>
                    <motion.a
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      href="https://buymeacoffee.com/tllo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-island-bg border border-island-border rounded-2xl text-muted-foreground flex items-center gap-3 active:scale-95 transition-all w-full"
                    >
                      <Coffee className="w-5 h-5" />
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 leading-none mb-1">
                          {tCommon('support')}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {tCommon('buyMeACoffee')}
                        </span>
                      </div>
                    </motion.a>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <LanguageSwitcher variant="mobile" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-5 pt-10 border-t border-island-border/20"
              >
                <div className="flex flex-col gap-4">
                  <Link
                    href="/privacy"
                    onClick={(): void => setIsOpen(false)}
                    className="flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-blue-500 transition-colors"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    {tCommon('privacyGuaranteed')}
                  </Link>
                  <a
                    href="https://github.com/tllobregat/zply"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    {tCommon('openSource')}
                  </a>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
                  ZPLY {tCommon('toolbox')} © {new Date().getFullYear()}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
