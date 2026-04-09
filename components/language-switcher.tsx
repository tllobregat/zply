'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useParams } from 'next/navigation';

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile';
}

export function LanguageSwitcher({ variant = 'desktop' }: LanguageSwitcherProps) {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'fr' : 'en';
    router.replace(
      // @ts-expect-error next-intl navigation types are tricky with dynamic segments
      { pathname, params },
      { locale: nextLocale }
    );
  };

  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleLanguage}
        className="p-4 bg-island-bg border border-island-border rounded-2xl text-muted-foreground flex items-center gap-3 active:scale-95 transition-all w-full"
      >
        <Globe className="w-5 h-5" />
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 leading-none mb-1">
            {t('language')}
          </span>
          <span className="text-sm font-bold text-foreground">
            {locale === 'en' ? t('en') : t('fr')}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="p-3 sm:p-3.5 text-muted hover:text-foreground hover:bg-island-bg/50 rounded-xl sm:rounded-2xl transition-all group relative"
      aria-label={t('language')}
    >
      <div className="relative">
        <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-zply-blue text-[8px] font-bold text-white uppercase">
          {locale}
        </span>
      </div>
      <span className="absolute left-16 sm:left-22.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-island-bg text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap border border-island-border pointer-events-none shadow-2xl hidden sm:block">
        {t('language')}: {locale === 'en' ? t('en') : t('fr')}
      </span>
    </button>
  );
}
