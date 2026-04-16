'use client';

import { CategoryTheme } from '@/lib/config/categories';
import { cn } from '@/lib/utils';
import React from 'react';

interface InfoSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  theme: CategoryTheme;
}

export function InfoSection({ icon, title, children, theme }: InfoSectionProps) {
  return (
    <div className="bg-island-bg/30 border border-island-border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("p-1.5 rounded-lg", theme.icon)}>
          {icon}
        </div>
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col py-1.5 border-b border-island-border/30 last:border-0">
      <span className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5 tracking-wider">{label}</span>
      <span className="text-sm font-medium text-foreground break-all">{value}</span>
    </div>
  );
}
