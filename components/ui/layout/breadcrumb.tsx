'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  className?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps): React.ReactNode {
  const t = useTranslations('Common');
  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
      <Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-1">
        <Home className="w-3 h-3" /> {t('home')}
      </Link>
      {
        items.map((item: BreadcrumbItem): React.ReactNode => (
          <div key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="w-2.5 h-2.5 text-muted" />
            {
              item.href
                ? (
                  <Link href={item.href} className={cn("hover:opacity-80 transition-opacity", item.className || "hover:text-blue-400 transition-colors")}>
                    {item.label}
                  </Link>
                )
                : (
                  <span className={cn("text-foreground font-bold", item.className)}>{item.label}</span>
                )
            }
          </div>
        ))
      }
    </nav>
  );
}
