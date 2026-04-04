import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { getCategoryClasses } from '@/lib/config/categories';

interface FeatureCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  theme: ReturnType<typeof getCategoryClasses>;
}

export function FeatureCard({ title, value, icon, theme }: FeatureCardProps): ReactNode {
  return (
    <div className="p-4 rounded-2xl bg-island-card border border-island-border relative overflow-hidden group">
      <div className={cn("p-1.5 rounded-lg w-fit mb-3", theme.icon)}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{title}</span>
        <span className="text-sm font-bold text-foreground">{value}</span>
      </div>
      <div className={cn("absolute top-0 left-0 w-1 h-full opacity-50", theme.bg)}></div>
    </div>
  );
}
